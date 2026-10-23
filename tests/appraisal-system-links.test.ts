import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createAppraisalRun, restoreAppraisalRun, applyAppraisalAction, advanceAppraisalEncounter, assertAppraisalInvariants, defaultAppraisalAction } from '../src/game/appraisal/engine.js';
import { exportAppraisalAudit } from '../src/game/appraisal/audit.js';
import { offerEvent, eventEligible, eventChoices } from '../src/game/appraisal/events.js';
import { core2EventChoices } from '../src/game/appraisal/core2-events.js';
import { dreadNow } from '../src/game/appraisal/core2-rules.js';
import { grant, maxLifeOf, maxEnergyOf, retire, spend, status } from '../src/game/appraisal/mechanics.js';
import { appraisalViewFor } from '../src/game/appraisal/views.js';
import { BROKERAGE_RULES, SURVIVAL_RULES } from '../src/game/appraisal/survival.js';
import { AppraisalRoomService } from '../src/server/appraisal-rooms.js';
import type { LifecyclePeer } from '../src/server/room-lifecycle.js';
import type { AppraisalRoomView, AppraisalServerMessage } from '../src/shared/appraisal-protocol.js';
import type { AppraisalAction, AppraisalConfig, AppraisalState, EventId, ItemKind } from '../src/game/appraisal/types.js';

const SERVER = { secureEconomy: true, brokerage: BROKERAGE_RULES, polish: true, npcEvents: true, core2: true };
type Body = AppraisalAction extends infer A ? A extends AppraisalAction ? Omit<A, 'playerId' | 'requestId' | 'encounter'> : never : never;
let sequence = 0;
function act(s: AppraisalState, id: string, body: Body): AppraisalState {
  return applyAppraisalAction(s, { ...body, playerId: id, encounter: s.encounter, requestId: `system-links-${++sequence}` });
}
function fixture(survival = true, ids = ['alice', 'bob']): AppraisalState {
  const s = createAppraisalRun(ids, 'links-continuation', { ...SERVER, marketProbability: 0, ...(survival ? { survival: SURVIVAL_RULES } : {}) });
  s.phase = 'APPRAISAL';
  for (const p of s.players) {
    p.eventOffer = null; p.done = false; p.offerSlots = 0; p.consequenceSlots = 0;
    p.selectedPortalId = p.portals[0]!.id; p.stock = [...p.portals[0]!.stock];
  }
  assertAppraisalInvariants(s);
  return s;
}
function held(s: AppraisalState, kind: ItemKind, suffix = ''): string {
  const p = s.players[0]!, source = s.items[p.stock[0]!]!;
  const id = `links-held-${kind}${suffix}`;
  const item = { ...source, id, kind, owner: p.id, base: 10, ask: 10, reservation: 1, genuine: true, cursed: false, lastTradePrice: 6 };
  delete item.appearance; delete item.rarityPower;
  s.items[id] = item; p.inventory.push(id);
  return id;
}
function fundedPenalty(s = fixture()): AppraisalState {
  const borrower = s.players[0]!.id, lender = s.players[1]!.id;
  const itemId = held(s, 'mirror');
  spend(s, s.players[0]!, s.players[0]!.credits, 0, 'links-setup');
  s = act(s, borrower, { type: 'loan-propose', lenderId: lender, itemId, principal: 3 });
  s = act(s, lender, { type: 'loan-respond', loanId: s.loans!.at(-1)!.id, accept: true });
  s.players[0]!.inflated = true;
  offerEvent(s, s.players[0]!, 'E120');
  assert.equal(s.players[0]!.eventOffer!.choices[0], 'pay');
  return s;
}

test('N1: done and timeout pay a still-affordable captured alternative after loan repayment', () => {
  let s = fundedPenalty();
  s = act(s, 'alice', { type: 'loan-repay', loanId: s.loans![0]!.id, amount: 3 });
  const beforeEnergy = s.players[0]!.energy;
  assert.equal(s.players[0]!.credits, 0);
  const done = act(s, 'alice', { type: 'done' });
  const timed = applyAppraisalAction(s, defaultAppraisalAction(s, 'alice', 'test-timeout')!);
  for (const result of [done, timed]) {
    assert.equal(result.players[0]!.eventOffer, null);
    assert.equal(result.players[0]!.energy, beforeEnergy - 2);
    assert(result.players[0]!.resolvedEvents.includes('E120'));
    assertAppraisalInvariants(result);
  }
});

test('N1: no captured payment left uses the penalty brand without seizing a newly acquired item', () => {
  let s = fixture(), p = s.players[0]!;
  const itemId = held(s, 'mirror');
  spend(s, p, p.credits, 0, 'links-setup'); p.energy = 0; p.life = 1;
  s = act(s, 'alice', { type: 'loan-propose', lenderId: 'bob', itemId, principal: 3 });
  p = s.players[0]!; p.inflated = true;
  offerEvent(s, p, 'E122');
  assert.deepEqual(p.eventOffer!.choices, ['item']);
  s = act(s, 'bob', { type: 'loan-respond', loanId: s.loans![0]!.id, accept: true });
  const newItemId = held(s, 'key');
  s = act(s, 'alice', { type: 'done' });
  p = s.players[0]!;
  assert.equal(p.eventOffer, null);
  assert(status(p, 'D03')); assert(status(p, 'D18'));
  assert(p.inventory.includes(newItemId));
  assert.equal(s.items[itemId]!.owner, `collateral:${s.loans![0]!.id}`);
  assert.equal(p.credits, 3);
  assertAppraisalInvariants(s);
});

test('N1: item default selects a still-owned captured target after another target moves into collateral', () => {
  let s = fixture(), p = s.players[0]!;
  const removed = held(s, 'mirror'), retained = held(s, 'key');
  spend(s, p, p.credits, 0, 'links-setup'); p.energy = 0; p.life = 1;
  s = act(s, 'alice', { type: 'loan-propose', lenderId: 'bob', itemId: removed, principal: 3 });
  p = s.players[0]!; p.inflated = true;
  offerEvent(s, p, 'E122');
  s = act(s, 'bob', { type: 'loan-respond', loanId: s.loans![0]!.id, accept: true });
  const unoffered = held(s, 'food');
  // The newly acquired item comes first now; it was never an offered sacrifice.
  s.players[0]!.inventory.reverse();
  s = act(s, 'alice', { type: 'done' });
  assert.equal(s.items[retained]!.owner, 'removed');
  assert.equal(s.items[unoffered]!.owner, 'alice');
  assert.equal(s.players[0]!.eventOffer, null);
  assertAppraisalInvariants(s);
});

test('N1: every mandatory core2 event defaults after all captured resources and items lapse', () => {
  for (const id of ['E117', 'E118', 'E119', 'E120', 'E121', 'E122', 'E123', 'E124'] as EventId[]) {
    let s = fixture(), p = s.players[0]!;
    if (['E117', 'E118', 'E119'].includes(id)) s.phase = 'PORTALS';
    const itemId = held(s, 'mirror');
    p.inflated = true; p.theft = { kind: id === 'E124' ? 'player' : 'shop', victim: 'bob' };
    offerEvent(s, p, id);
    spend(s, p, p.credits, 0, 'links-setup'); p.energy = 0; p.life = 1;
    retire(s, p, itemId, 'links-target-lapsed', false);
    s = act(s, 'alice', { type: 'done' });
    assert.equal(s.players[0]!.eventOffer, null, id);
    assert(s.players[0]!.resolvedEvents.includes(id), id);
    assertAppraisalInvariants(s);
  }
});

test('N2: an empty life slot granted by held gear opens the linked medicine event at zero energy', () => {
  let s = fixture(), p = s.players[0]!;
  p.energy = 0; p.life = SURVIVAL_RULES.maxLife;
  assert.equal(eventEligible(s, p, 'E126'), false);
  held(s, 'life-relic');
  assert.equal(maxLifeOf(s, p), 7);
  assert.equal(eventEligible(s, p, 'E126'), true);
  offerEvent(s, p, 'E126');
  assert(p.eventOffer!.choices.includes('drink'));
  s = act(s, 'alice', { type: 'event', key: p.eventOffer!.key, choice: 'drink' });
  p = s.players[0]!;
  assert.equal(p.credits, 37);
  assert(status(p, 'B24') || status(p, 'D23'));
  assertAppraisalInvariants(s);
});

test('N2: the original healing choice uses held life and energy caps when system links are enabled', () => {
  for (const survival of [true, false]) {
    let s = fixture(survival), p = s.players[0]!;
    delete s.config.statusLinks;
    held(s, 'life-relic');
    if (survival) { p.energy = 0; p.life = SURVIVAL_RULES.maxLife; }
    else p.energy = s.config.maxEnergy;
    assert.equal(eventEligible(s, p, 'E126'), true);
    assert(core2EventChoices(s, p, 'E126').includes('drink'));
    offerEvent(s, p, 'E126');
    s = act(s, 'alice', { type: 'event', key: p.eventOffer!.key, choice: 'drink' });
    p = s.players[0]!;
    assert.equal(survival ? p.life : p.energy, survival ? maxLifeOf(s, p) : maxEnergyOf(s, p));
    assertAppraisalInvariants(s);
  }
});

test('N3: a guard can be hired empty-handed or with another ward, without offering redundant protection', () => {
  for (const shield of [undefined, 'B06', 'B19'] as const) {
    let s = fixture(), p = s.players[0]!;
    if (shield) grant(s, p, shield);
    assert.equal(eventEligible(s, p, 'E128'), true);
    assert.deepEqual(core2EventChoices(s, p, 'E128'), ['ward', 'decline']);
    offerEvent(s, p, 'E128');
    s = act(s, 'alice', { type: 'event', key: p.eventOffer!.key, choice: 'ward' });
    p = s.players[0]!;
    assert(status(p, 'B21')); assert.equal(p.credits, 38);
    assert.equal(eventEligible(s, p, 'E128'), false);
    assertAppraisalInvariants(s);
  }
  const s = fixture(), p = s.players[0]!;
  held(s, 'mirror'); grant(s, p, 'B06');
  assert.deepEqual(core2EventChoices(s, p, 'E128'), ['ward', 'decline']);
});

test('N4: each player receives the same personal dread chance the settlement uses', () => {
  const s = fixture(), [p, peer] = s.players;
  const before = appraisalViewFor(s, p!.id).dread!;
  grant(s, p!, 'B23');
  const after = appraisalViewFor(s, p!.id).dread!;
  assert.equal(after, dreadNow(s, p!));
  assert(after < before);
  assert.equal(appraisalViewFor(s, peer!.id).dread, before);
  assertAppraisalInvariants(s);
});

test('classic blood-pact debt cannot restore energy and remove an existing thirst without a new cost', () => {
  let s = fixture(false), p = s.players[0]!;
  for (const id of p.stock) s.items[id]!.npc = 'vampire';
  p.portals[0]!.npc = 'vampire'; p.energy = 9;
  grant(s, p, 'D10');
  assert.deepEqual(eventChoices(s, p, 'E03'), ['pay', 'decline']);
  assert.equal(eventEligible(s, p, 'E03'), true);
  offerEvent(s, p, 'E03');
  s = act(s, 'alice', { type: 'event', key: p.eventOffer!.key, choice: 'pay' });
  p = s.players[0]!;
  assert.equal(p.credits, 38); assert.equal(p.energy, 10);
  spend(s, p, p.credits, 0, 'links-setup');
  assert.deepEqual(eventChoices(s, p, 'E03'), ['decline']);
  assert.equal(eventEligible(s, p, 'E03'), false);
  delete s.config.systemLinks;
  assert(eventChoices(s, p, 'E03').includes('debt'));
  assertAppraisalInvariants(s);
});

test('old configs keep the historical eligibility and default rules', () => {
  let s = fundedPenalty();
  delete s.config.systemLinks;
  s = act(s, 'alice', { type: 'loan-repay', loanId: s.loans![0]!.id, amount: 3 });
  assert.throws(() => act(s, 'alice', { type: 'done' }), { code: 'event-cost' });
  s = fixture(); delete s.config.systemLinks;
  const p = s.players[0]!; p.energy = 0; held(s, 'life-relic');
  assert.equal(eventEligible(s, p, 'E126'), false);
  p.inventory = []; s.items['links-held-life-relic']!.owner = 'removed';
  assert.equal(eventEligible(s, p, 'E128'), false);
});

test('pre-fix classic and survival commands reproduce their exact archived audit hashes', () => {
  type Sample = { seed: string; playerIds: string[]; config: AppraisalConfig; commands: Array<AppraisalAction | { type: 'advance' }>; auditSha256: string };
  const samples = JSON.parse(readFileSync('tests/fixtures/system-links-legacy.json', 'utf8')) as Sample[];
  for (const sample of samples) {
    assert.equal(sample.config.systemLinks, undefined);
    let s = restoreAppraisalRun(sample.playerIds, sample.seed, sample.config);
    for (const command of sample.commands) s = command.type === 'advance' ? advanceAppraisalEncounter(s) : applyAppraisalAction(s, command);
    assert.equal(createHash('sha256').update(JSON.stringify(exportAppraisalAudit(s))).digest('hex'), sample.auditSha256);
  }
});

test('systemLinks is enabled for new runs and rejects unsupported rule versions', () => {
  assert.equal(createAppraisalRun(['a', 'b'], 'links-default').config.systemLinks, 1);
  assert.throws(() => createAppraisalRun(['a', 'b'], 'links-invalid', { systemLinks: 2 as 1 }), { code: 'config' });
});

class Client implements LifecyclePeer<AppraisalServerMessage> {
  messages: AppraisalServerMessage[] = [];
  send(message: AppraisalServerMessage): void { this.messages.push(structuredClone(message)); }
  close(): void {}
  get room(): AppraisalRoomView { const m = this.messages.findLast(m => m.type === 'state'); assert(m?.type === 'state'); return m.room; }
}
class PenaltyRooms extends AppraisalRoomService {
  protected override createGame(ids: string[]): AppraisalState { return fundedPenalty(fixture(true, ids)); }
}
test('N1: room timeout advances after repaying a loan during an outstanding penalty', () => {
  let now = 1000;
  const rooms = new PenaltyRooms(() => now, { APPRAISAL: 10, TRADE: 10 });
  const [host, peer] = [new Client(), new Client()];
  rooms.receive(host!, { type: 'create', name: 'host' });
  rooms.receive(peer!, { type: 'join', name: 'peer', roomCode: host!.room.code });
  rooms.receive(peer!, { type: 'ready', ready: true });
  rooms.receive(host!, { type: 'start' });
  assert.equal(host!.room.game!.self.eventOffer?.id, 'E120');
  const loanId = host!.room.game!.loans![0]!.id;
  rooms.receive(host!, { type: 'action', matchId: host!.room.matchId, action: { type: 'loan-repay', loanId, amount: 3, requestId: 'repay-before-timeout', encounter: 1 } });
  assert.equal(host!.room.game!.self.credits, 0);
  now += 11;
  assert.doesNotThrow(() => rooms.tick());
  assert.equal(host!.room.game!.phase, 'TRADE');
  assert(!host!.messages.some(m => m.type === 'error'));
});
