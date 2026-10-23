import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceAppraisalEncounter, applyAppraisalAction, assertAppraisalInvariants, createAppraisalRun, restoreAppraisalRun } from '../src/game/appraisal/engine.js';
import { appraisalViewFor } from '../src/game/appraisal/views.js';
import { replayAppraisalAudit } from '../src/game/appraisal/audit.js';
import { SURVIVAL_RULES } from '../src/game/appraisal/survival.js';
import { CORE2 } from '../src/game/appraisal/core2.js';
import { simulateAppraisalRun } from '../src/simulation/appraisal.js';
import { AppraisalRoomService } from '../src/server/appraisal-rooms.js';
import type { LifecyclePeer } from '../src/server/room-lifecycle.js';
import type { AppraisalAction, AppraisalConfig, AppraisalState } from '../src/game/appraisal/types.js';
import type { AppraisalRoomView, AppraisalServerMessage, AppraisalSeatAction } from '../src/shared/appraisal-protocol.js';

let request = 0;
const act = (state: AppraisalState, playerId: string, body: Record<string, unknown>): AppraisalState =>
  applyAppraisalAction(state, { ...body, playerId, requestId: `end-${++request}`, encounter: state.encounter } as AppraisalAction);
/** A table already in the given phase, every seat at its first merchant with no pending event. */
function table(phase: 'APPRAISAL' | 'TRADE', config: Partial<AppraisalConfig>, ids = ['alice', 'bob']): AppraisalState {
  const state = createAppraisalRun(ids, 'end-rules', { core2: true, secureEconomy: true, marketProbability: 0, ...config });
  state.phase = phase;
  for (const p of state.players) { p.stock = [...p.portals[0]!.stock]; p.selectedPortalId = p.portals[0]!.id; p.done = false; p.eventOffer = null; p.energy = 8; }
  return state;
}
/** Hand `owner` one of the merchant goods, with a recorded sale price so it can back a loan. */
function give(state: AppraisalState, ownerId: string, price = 40): string {
  const owner = state.players.find(p => p.id === ownerId)!;
  const id = owner.stock.shift()!;
  Object.assign(state.items[id]!, { owner: owner.id, lastTradePrice: price, genuine: true, cursed: false });
  owner.inventory.push(id);
  return id;
}
function fundLoan(state: AppraisalState, itemId: string): AppraisalState {
  state = act(state, 'alice', { type: 'loan-propose', lenderId: 'bob', itemId, principal: 20 });
  return act(state, 'bob', { type: 'loan-respond', loanId: state.loans![0]!.id, accept: true });
}
const endPhase = (state: AppraisalState): AppraisalState => {
  for (const p of state.players) if (!p.done && !p.paused) state = act(state, p.id, { type: 'done' });
  return state;
};

test('an expired duel is cancelled without ending either seat\'s phase or adding a penalty', () => {
  let s = table('APPRAISAL', { encounters: 3 });
  const victimItem = give(s, 'bob');
  s = act(s, 'alice', { type: 'theft-start', victimId: 'bob' });
  const duel = s.theftDuels![0]!;
  assert.equal(duel.itemId, victimItem);
  const energy = s.players[0]!.energy;
  assert.throws(() => act(s, 'bob', { type: 'done' }), /เป่ายิ้งฉุบ/);
  s = act(s, 'alice', { type: 'theft-expire', duelId: duel.id });
  assert.equal(s.theftDuels![0]!.status, 'cancelled');
  for (const p of s.players) { assert.equal(p.done, false); assert.equal(p.paused, null); }
  assert.equal(s.players[0]!.energy, energy, 'expiry costs nothing beyond the spent attempt');
  assert.equal(s.players[1]!.inventory.includes(victimItem), true);
  assert.deepEqual((s as AppraisalState & { sinnerSeals?: unknown[] }).sinnerSeals ?? [], [], 'no seal without a defeat');
  assert.throws(() => act(s, 'alice', { type: 'theft-start', victimId: 'bob' }), /ครั้งเดียว/);
  assert.throws(() => act(s, 'bob', { type: 'theft-expire', duelId: duel.id }), /หมดเวลา/);
  s = act(s, 'bob', { type: 'done' });
  assert.equal(s.players[1]!.done, true);
  assertAppraisalInvariants(s);
});

test('match end forecloses active loans in classic, so the borrower cannot keep both principal and collateral', () => {
  let s = table('TRADE', { encounters: 1 });
  const itemId = give(s, 'alice');
  s = fundLoan(s, itemId);
  assert.equal(s.loans![0]!.status, 'active');
  assert.ok(s.loans![0]!.dueAt > s.config.encounters, 'the deadline falls after the last encounter');
  s = advanceAppraisalEncounter(endPhase(s));
  assert.equal(s.phase, 'RESULTS');
  assert.equal(s.loans![0]!.status, 'foreclosed');
  assert.equal(s.items[itemId]!.owner, 'bob');
  assert.ok(s.players[1]!.inventory.includes(itemId));
  assert.ok(s.trace.some(e => e.type === 'secured-loan-foreclosed' && e.details.reason === 'match-end'));
  assertAppraisalInvariants(s);
});

test('saved runs without the end-settlement rule keep the loan open at the end', () => {
  const config = { ...table('TRADE', { encounters: 1 }).config };
  delete config.loanEndSettlement;
  let s = restoreAppraisalRun(['alice', 'bob'], 'end-rules', config);
  s.phase = 'TRADE';
  for (const p of s.players) { p.stock = [...p.portals[0]!.stock]; p.selectedPortalId = p.portals[0]!.id; p.done = false; p.eventOffer = null; p.energy = 8; }
  const itemId = give(s, 'alice');
  s = advanceAppraisalEncounter(endPhase(fundLoan(s, itemId)));
  assert.equal(s.phase, 'RESULTS');
  assert.equal(s.loans![0]!.status, 'active');
  assert.equal(s.items[itemId]!.owner, `collateral:${s.loans![0]!.id}`);
});

test('survival: the Collector arrives at the deadline with seats still alive and settles open loans', () => {
  let s = table('TRADE', { survival: { maxLife: 20, encounterLifeCost: 1, entryEnergyCost: 0 }, collectorDeadline: 1 });
  assert.equal(appraisalViewFor(s, 'alice').collectorAt, 1);
  const itemId = give(s, 'alice');
  s = endPhase(fundLoan(s, itemId));
  assert.equal(s.phase, 'RESULTS');
  assert.ok(s.players.every(p => p.life! > 0), 'nobody had to die');
  assert.equal(s.collector?.length, 2);
  assert.equal(s.loans![0]!.status, 'foreclosed');
  const bob = s.collector!.find(row => row.playerId === 'bob')!, alice = s.collector!.find(row => row.playerId === 'alice')!;
  assert.ok(bob.items.some(item => item.id === itemId));
  assert.ok(!alice.items.some(item => item.id === itemId));
  assertAppraisalInvariants(s);
});

test('survival runs end by the default Collector deadline and still replay', () => {
  assert.equal(createAppraisalRun(['a', 'b'], 'deadline').config.collectorDeadline, CORE2.collectorEncounter);
  const rules = { maxLife: 40, encounterLifeCost: 1, entryEnergyCost: 0 };
  const audit = simulateAppraisalRun(2, 'cautious', 'deadline', { core2: true, secureEconomy: true, survival: rules, collectorDeadline: 3 });
  assert.equal(Math.max(...audit.history.map(row => row.encounter)), 3);
  assert.ok(audit.final.some(p => (p.life ?? 0) > 0));
  assert.equal(audit.collector?.length, 2);
  replayAppraisalAudit(audit);
  // A saved run without the deadline only ends when every life is gone.
  const old = createAppraisalRun(['a', 'b'], 'deadline', { survival: SURVIVAL_RULES });
  const config = structuredClone(old.config); delete config.collectorDeadline;
  assert.equal(appraisalViewFor(restoreAppraisalRun(['a', 'b'], 'deadline', config), 'a').collectorAt, undefined);
  assert.throws(() => createAppraisalRun(['a', 'b'], 'deadline', { collectorDeadline: 0 }), /Collector/);
});

class Client implements LifecyclePeer<AppraisalServerMessage> {
  messages: AppraisalServerMessage[] = [];
  send(message: AppraisalServerMessage): void { this.messages.push(structuredClone(message)); }
  close(): void {}
  get room(): AppraisalRoomView { const m = this.messages.findLast(m => m.type === 'state'); assert(m?.type === 'state'); return m.room; }
}
class DuelRooms extends AppraisalRoomService {
  state(code: string): AppraisalState { const state = this.rooms.get(code)?.game; assert(state); return state; }
}

test('an untimed room cancels a stalled duel on its own clock and the table can finish the phase', () => {
  let now = 1000;
  const rooms = new DuelRooms(() => now, {}, 60_000, { core2: true, secureEconomy: true, marketProbability: 0 }, 50);
  const [host, guest] = [new Client(), new Client()];
  rooms.receive(host, { type: 'create', name: 'host' });
  rooms.receive(host, { type: 'timer-settings', settings: { enabled: false, durationsMs: { PORTALS: 30000, APPRAISAL: 90000, TRADE: 45000, REVEAL: 30000 } } });
  rooms.receive(guest, { type: 'join', name: 'guest', roomCode: host.room.code });
  for (const c of [host, guest]) rooms.receive(c, { type: 'ready', ready: true });
  rooms.receive(host, { type: 'start' });
  let n = 0;
  const send = (c: Client, body: Record<string, unknown>) => rooms.receive(c, { type: 'action', matchId: c.room.matchId, action: { ...body, requestId: `duel-${++n}`, encounter: c.room.game!.encounter } as AppraisalSeatAction });
  // Skip the door events: put both seats at their first merchant, as the engine tests do.
  const live = rooms.state(host.room.code);
  live.phase = 'APPRAISAL';
  for (const p of live.players) { p.stock = [...p.portals[0]!.stock]; p.selectedPortalId = p.portals[0]!.id; p.done = false; p.eventOffer = null; p.energy = 8; }
  assert.equal(host.room.deadline, null, 'the room is untimed');
  send(host, { type: 'theft-start', itemId: live.players.find(p => p.id === host.room.yourSeatId)!.stock[0]! });
  const duelId = host.room.game!.theft!.duels[0]!.id;
  assert.equal(host.room.duelDeadlines?.[duelId], now + 50);
  assert.equal(guest.room.duelDeadlines, undefined, 'only the duel\'s seats see its clock');
  now += 49; rooms.tick();
  assert.equal(rooms.state(host.room.code).theftDuels![0]!.status, 'open');
  now += 1; rooms.tick();
  const state = rooms.state(host.room.code);
  assert.equal(state.theftDuels![0]!.status, 'cancelled');
  assert.equal(state.players.find(p => p.id === host.room.yourSeatId)!.done, false);
  assert.equal(host.room.duelDeadlines, undefined);
  for (const c of [host, guest]) send(c, { type: 'done' });
  assert.equal(host.room.game!.phase, 'TRADE');
});
