import assert from 'node:assert/strict';
import { dismissEvent } from './event-dismiss.js';
import test from 'node:test';
import { createAppraisalRun, replayAppraisalAudit } from '../src/game/appraisal/index.js';
import type { AppraisalConfig, AppraisalState } from '../src/game/appraisal/types.js';
import { offerEvent } from '../src/game/appraisal/events.js';
import { parseAppraisalMessage } from '../src/server/appraisal-messages.js';
import { AppraisalRoomService } from '../src/server/appraisal-rooms.js';
import { MessageError } from '../src/server/messages.js';
import { randomAt } from '../src/game/random.js';
import type { LifecyclePeer } from '../src/server/room-lifecycle.js';
import type { AppraisalRoomView, AppraisalServerMessage, AppraisalSeatAction } from '../src/shared/appraisal-protocol.js';

class Client implements LifecyclePeer<AppraisalServerMessage> {
  messages: AppraisalServerMessage[] = []; closed: number | null = null;
  send(message: AppraisalServerMessage): void { this.messages.push(structuredClone(message)); }
  close(code: number): void { this.closed = code; }
  get room(): AppraisalRoomView { const m = this.messages.findLast(m => m.type === 'state'); assert(m?.type === 'state'); return m.room; }
  get joined() { const m = this.messages.findLast(m => m.type === 'joined'); assert(m?.type === 'joined'); return m; }
  get error() { return this.messages.findLast(m => m.type === 'error'); }
}
class TestRooms extends AppraisalRoomService {
  constructor(now: () => number, private readonly config: Partial<AppraisalConfig> = {}) { super(now, { PORTALS: 10, APPRAISAL: 10, TRADE: 10, REVEAL: 10 }, 1000); }
  protected createGame(ids: string[], seed: string): AppraisalState { return createAppraisalRun(ids, seed, this.config); }
  state(code: string): AppraisalState { const state = this.rooms.get(code)?.game; assert(state); return state; }
}
function setup(count = 3, config: Partial<AppraisalConfig> = {}) {
  let now = 1000; const rooms = new TestRooms(() => now, config); const clients = Array.from({ length: count }, () => new Client());
  rooms.receive(clients[0]!, { type: 'create', name: 'เจ้าของ' });
  for (const c of clients.slice(1)) rooms.receive(c, { type: 'join', name: 'นักประเมิน', roomCode: clients[0]!.room.code });
  for (const c of clients) rooms.receive(c, { type: 'ready', ready: true }); rooms.receive(clients[0]!, { type: 'start' });
  let request = 0;
  const act = (client: Client, body: Omit<AppraisalSeatAction, 'requestId' | 'encounter'> | Record<string, unknown>, requestId = `room-${++request}`) => {
    rooms.receive(client, { type: 'action', matchId: client.room.matchId, action: { ...body, requestId, encounter: client.room.game!.encounter } });
  };
  const decline = (client: Client) => { const offer = client.room.game!.self.eventOffer; if (offer) act(client, { type: 'event', key: offer.key, ...dismissEvent(offer) }); };
  const portals = () => { for (const c of clients) { decline(c); act(c, { type: 'enter', portalId: c.room.game!.self.portals.find(p => !p.disabled)!.id }); } assert.equal(clients[0]!.room.game!.phase, 'APPRAISAL'); for (const c of clients) decline(c); };
  const endPhase = () => { const phase = clients[0]!.room.game!.phase; for (const c of clients) if (c.room.game!.phase === phase && !c.room.game!.self.done && !c.room.game!.self.paused) act(c, { type: 'done' }); };
  return { rooms, clients, act, decline, portals, endPhase, tick: () => { now += 11; rooms.tick(); }, late: () => { now += 11; }, now: () => now };
}
const actionBodies = [
  {type:'round-flip',guess:'heads',attempt:1},{type:'round-flip',guess:'heads',guesses:['heads','tails'],attempt:1},{type:'round-raise',coinCount:2,attempt:1},{type:'round-bank'},
  { type: 'enter', portalId: 'p' }, { type: 'inspect', itemId: 'i', property: 'price' },
  { type: 'appraise', itemId: 'i', value: 0, acceptDanger: true }, { type: 'counter', itemId: 'i', value: 20 },
  { type: 'buy', itemIds: ['i', 'j'], condition: true }, { type: 'activate', itemId: 'i' },
  { type: 'event', key: 'E15-key', choice: 'price', itemId: 'i', statusId: 'B01', fact: 'base', otherPlayerId: 'peer', guess: false },
  { type: 'market-sell', itemId: 'i', orderId: 'o' }, { type: 'share', itemId: 'i', allow: true, purchase: false },
  { type: 'propose', sellerId: 'peer', itemId: 'i', credits: 0, swapItemId: 'j', condition: true },
  { type: 'respond', offerId: 'trade', accept: false }, { type: 'done' },
];
test('v0.4 parser reconstructs every action and rejects actor/seed/event injection and malformed optional values', () => {
  for (const body of actionBodies) {
    const message = { type: 'action', matchId: 'm', action: { ...body, requestId: 'request_1', encounter: 1 } };
    assert.deepEqual(parseAppraisalMessage(message), message);
    for (const injected of [{ playerId: 'victim' }, { seed: 'choose-luck' }, { eventId: 'E50' }, { price: 0 }, { phase: 'TRADE' }])
      assert.throws(() => parseAppraisalMessage({ ...message, action: { ...message.action, ...injected } }), MessageError);
  }
  for (const body of [
    { type: 'buy', itemIds: ['same', 'same'], condition: false }, { type: 'buy', itemIds: [], condition: false },
    { type: 'buy', itemIds: ['i'], condition: 'yes' }, { type: 'event', key: 'x', choice: 'accept', guess: 1 },
    { type: 'event', key: 'x', choice: 'accept', statusId: 'D99' }, { type: 'event', key: 'x', choice: 'accept', fact: 'seed' },
    { type: 'appraise', itemId: 'i', value: -1 }, { type: 'counter', itemId: 'i', value: 2, acceptDanger: 1 },
    { type: 'propose', sellerId: 'x', itemId: 'i', credits: Number.MAX_SAFE_INTEGER + 1 }, { type: 'inspect', itemId: 'i', property: 'all' },
    {type:'round-flip',guess:'heads',guesses:[],attempt:1},{type:'round-flip',guess:'heads',guesses:['edge'],attempt:1},{type:'round-raise',coinCount:2.5,attempt:1},
    {type:'round-flip',guess:'edge',attempt:1},{type:'round-flip',guess:'heads',attempt:1.5},
    {type:'round-flip',guess:'tails',attempt:1,side:'tails'},{type:'round-bank',amount:100},
  ]) assert.throws(() => parseAppraisalMessage({ type: 'action', matchId: 'm', action: { ...body, requestId: 'x', encounter: 1 } }), MessageError);
  assert.throws(() => parseAppraisalMessage({ type: 'action', matchId: 'm', action: { type: 'done', requestId: 'bad:id', encounter: 1 } }), MessageError);
  assert.throws(() => parseAppraisalMessage({ type: 'reveal-ready', matchId: 'm', auctionNumber: 1 }), MessageError);
  assert.deepEqual(parseAppraisalMessage({ type: 'join', name: ' ไทย ', roomCode: 'abc234' }), { type: 'join', name: 'ไทย', roomCode: 'ABC234' });
});

test('round wagers freeze after ready, reconnect preserves pending winnings, and timeout banks them once',()=>{
  const s=setup(2);s.portals();s.endPhase();s.endPhase();const [a,b]=s.clients as [Client,Client];
  assert.equal(a.room.game!.phase,'REVEAL');
  const state=s.rooms.state(a.room.code);const id=a.room.yourSeatId;
  const guess=randomAt(state.seed,`1:${id}:round-coin:1`)<.5?'heads':'tails';
  const extra=randomAt(state.seed,`1:${id}:round-coin:1:coin:2`)<.5?'heads':'tails';
  s.act(a,{type:'round-raise',coinCount:2,attempt:1},'raise-once');
  s.act(a,{type:'round-raise',coinCount:2,attempt:1},'raise-once');assert.equal(a.room.game!.self.credits,30);
  s.act(a,{type:'round-flip',guess,guesses:[guess,extra],attempt:1},'coin-once');assert.equal(a.room.game!.self.roundReward!.amount,30);
  s.act(a,{type:'round-flip',guess,guesses:[guess,extra],attempt:1},'coin-once');assert.equal(a.room.game!.self.roundReward!.flips,1);
  const resumed=new Client();s.rooms.disconnect(a);s.rooms.receive(resumed,{type:'resume',roomCode:a.room.code,token:a.joined.token});
  assert.deepEqual(resumed.room.game!.self.roundReward,a.room.game!.self.roundReward);
  const before=resumed.room.game!.self.credits;
  s.rooms.receive(resumed,{type:'reveal-ready',matchId:resumed.room.matchId!,encounter:1});
  s.act(resumed,{type:'round-flip',guess:'heads',attempt:2});assert.equal(resumed.error?.type==='error' && resumed.error.code,'already-ready');
  s.tick();assert.equal(resumed.room.game!.encounter,2);assert.equal(resumed.room.game!.self.credits,before+30);
  assert.equal(b.room.game!.self.credits,50);const ledger=structuredClone(s.rooms.state(a.room.code).ledger);s.rooms.tick();assert.deepEqual(s.rooms.state(a.room.code).ledger,ledger);
});

test('cashout pays immediately and reveal-ready cannot pay the same round twice',()=>{
  const s=setup(2);s.portals();s.endPhase();s.endPhase();const [a,b]=s.clients as [Client,Client];
  const before=a.room.game!.self.credits;s.act(a,{type:'round-bank'});assert.equal(a.room.game!.self.credits,before+10);
  for(const c of [a,b])s.rooms.receive(c,{type:'reveal-ready',matchId:c.room.matchId!,encounter:1});
  assert.equal(a.room.game!.encounter,2);assert.equal(a.room.game!.self.credits,before+10);
});
test('v0.4 deadlines stay fixed and exact deadline commands use safe defaults once', () => {
  const s = setup(2); const [a, b] = s.clients as [Client, Client]; const deadline = a.room.deadline;
  s.decline(a); s.act(a, { type: 'enter', portalId: a.room.game!.self.portals.find(p => !p.disabled)!.id }, 'entry');
  assert.equal(a.room.deadline, deadline); s.late();
  s.act(b, { type: 'enter', portalId: b.room.game!.self.portals[0]!.id }, 'late-entry');
  assert.equal(b.error?.type === 'error' && b.error.code, 'phase-expired'); assert.equal(a.room.game!.phase, 'APPRAISAL');
  assert.equal(b.room.game!.self.selectedPortalId, null); assert(a.room.deadline! > deadline!);
  const ledger = structuredClone(s.rooms.state(a.room.code).ledger); s.rooms.tick(); assert.deepEqual(s.rooms.state(a.room.code).ledger, ledger);
});
test('v0.4 reconnect restores private inspection, pending event key and idempotent requests; replaced peer loses authority', () => {
  const s = setup(3); s.portals(); const [a, b, other] = s.clients as [Client, Client, Client];
  const item = a.room.game!.self.stock[0]!;
  s.act(a, { type: 'inspect', itemId: item.id, property: 'price' }, 'inspect'); const original = a.room.game!;
  assert.equal(other.room.game!.self.stock.some(i => i.id === item.id), false);
  assert.equal(JSON.stringify(other.messages).includes(a.joined.token), false);
  const state = s.rooms.state(a.room.code); const p = state.players.find(p => p.id === a.room.yourSeatId)!;
  offerEvent(state, p, 'E18');
  const resumed = new Client(); s.rooms.disconnect(a); s.rooms.receive(resumed, { type: 'resume', roomCode: a.room.code, token: a.joined.token });
  assert.equal(resumed.room.yourSeatId, a.room.yourSeatId); assert.deepEqual(resumed.room.game!.self.stock[0]!.knowledge, original.self.stock[0]!.knowledge);
  assert.equal(resumed.room.game!.self.eventOffer!.key, p.eventOffer!.key);
  const revision = resumed.room.game!.revision; s.act(resumed, { type: 'inspect', itemId: item.id, property: 'price' }, 'inspect'); assert.equal(resumed.room.game!.revision, revision);
  const replacement = new Client(); s.rooms.receive(replacement, { type: 'resume', roomCode: a.room.code, token: a.joined.token }); assert.equal(resumed.closed, 4001);
  s.rooms.disconnect(resumed); assert.equal(replacement.room.seats.find(p => p.id === replacement.room.yourSeatId)!.connected, true);
  s.rooms.receive(resumed, { type: 'ready', ready: false }); assert.equal(resumed.error?.type === 'error' && resumed.error.code, 'not-seated');
  assert.equal(b.room.game!.self.eventOffer?.key === p.eventOffer!.key, false);
});
for (const count of [2, 3, 4]) test(`v0.4 ${count} absent seats safely timeout to results, export replayable audit and rematch`, () => {
  const s = setup(count); const host = s.clients[0]!; const old = host.room.matchId!;
  s.rooms.receive(host, { type: 'audit', matchId: old }); assert.equal(host.error?.type === 'error' && host.error.code, 'audit-private');
  for (const c of s.clients) s.rooms.disconnect(c);
  for (let i = 0; i < 20 && s.rooms.state(host.room.code).phase !== 'RESULTS'; i++) s.tick();
  assert.equal(s.rooms.state(host.room.code).phase, 'RESULTS'); const resume = new Client(); s.rooms.receive(resume, { type: 'resume', roomCode: host.room.code, token: host.joined.token });
  s.rooms.receive(resume, { type: 'audit', matchId: old }); const m = resume.messages.findLast(m => m.type === 'audit'); assert(m?.type === 'audit');
  const replayed = replayAppraisalAudit(m.audit.run); assert.equal(replayed.history.length, count * 3); assert(m.audit.timeouts.length > 0);
  assert.equal(m.audit.phaseTimes.at(-1)!.phase, 'REVEAL'); assert.equal(m.audit.seats.length, count);
  s.rooms.receive(resume, { type: 'rematch' }); assert.equal(resume.room.game, null); assert(resume.room.seats.every(p => !p.ready));
  const second = new Client(); s.rooms.receive(second, { type: 'resume', roomCode: host.room.code, token: s.clients[1]!.joined.token });
  for (const c of [resume, second]) s.rooms.receive(c, { type: 'ready', ready: true });
  for (const c of s.clients.slice(2)) s.rooms.receive(resume, { type: 'remove-seat', seatId: c.joined.seatId });
  s.rooms.receive(resume, { type: 'start' }); assert.notEqual(resume.room.matchId, old); assert.equal(resume.room.game!.encounter, 1);
  s.rooms.receive(resume, { type: 'action', matchId: old, action: { type: 'done', requestId: 'old', encounter: 1 } });
  assert.equal(resume.error?.type === 'error' && resume.error.code, 'stale-match');
});
test('v0.4 all exhausted seats auto-settle and return next encounter without timeout deadlock', () => {
  const s = setup(3, { maxEnergy: 1, recoveryEnergy: 1, freeMerchantAction:false }); s.portals();
  for (const c of s.clients) s.act(c, { type: 'inspect', itemId: c.room.game!.self.stock[0]!.id, property: 'price' });
  assert.equal(s.clients[0]!.room.game!.phase, 'REVEAL'); assert(s.clients[0]!.room.game!.players.every(p => p.paused === 'exhausted'));
  s.tick(); assert.equal(s.clients[0]!.room.game!.phase, 'PORTALS'); assert(s.clients[0]!.room.game!.players.every(p => !p.paused && p.energy === 1));
});
test('v0.4 P2P zero-price approval is atomic, has no NPC punishment and duplicate approval transfers once', () => {
  const s = setup(3, { startingCredits: 500 }); s.portals(); const [seller, buyer, other] = s.clients as [Client, Client, Client];
  const item = seller.room.game!.self.stock[0]!; const truth = s.rooms.state(seller.room.code).items[item.id]!;
  s.act(seller, { type: 'appraise', itemId: item.id, value: truth.base, acceptDanger: true }); s.act(seller, { type: 'buy', itemIds: [item.id], condition: false });
  s.act(seller, { type: 'share', itemId: item.id, allow: true, purchase: true }); s.endPhase(); for (const c of s.clients) s.decline(c);
  s.act(buyer, { type: 'propose', sellerId: seller.room.yourSeatId, itemId: item.id, credits: 0 });
  const offer = seller.room.game!.trades.find(t => t.status === 'open')!; assert.equal(other.room.game!.trades.length, 0);
  const before = structuredClone(s.rooms.state(seller.room.code)); s.act(seller, { type: 'respond', offerId: offer.id, accept: true }, 'approval');
  const revision = seller.room.game!.revision; s.act(seller, { type: 'respond', offerId: offer.id, accept: true }, 'approval'); assert.equal(seller.room.game!.revision, revision);
  const after = s.rooms.state(seller.room.code); assert.equal(after.items[item.id]!.owner, buyer.room.yourSeatId);
  // A seat holding the middleman subsidy (E43, which can no longer be declined) earns its 1 credit from the bank.
  assert.deepEqual(after.players.map(p => p.credits), before.players.map(p => p.credits + (p.subsidy && [offer.buyerId, offer.sellerId].includes(p.id) ? 1 : 0))); assert.equal(after.trace.filter(t => t.type === 'npc-caught').length, 0);
  assert.equal(after.players.reduce((n, p) => n + p.inventory.filter(id => id === item.id).length, 0), 1);
});
test('v0.4 stale event keys reject without mutation even inside the same encounter', () => {
  const s = setup(2); s.portals(); const c = s.clients[0]!; const state = s.rooms.state(c.room.code); const p = state.players[0]!;
  offerEvent(state, p, 'E18'); const oldKey = p.eventOffer!.key;
  s.act(c, { type: 'event', key: oldKey, choice: 'decline' }); offerEvent(s.rooms.state(c.room.code), s.rooms.state(c.room.code).players[0]!, 'E23');
  const before = structuredClone(s.rooms.state(c.room.code)); s.act(c, { type: 'event', key: oldKey, choice: 'accept' });
  assert.equal(c.error?.type === 'error' && c.error.code, 'event-choice'); assert.deepEqual(s.rooms.state(c.room.code), before);
});
test('v0.4 timeout declines optional credit contracts and settles accepted NPC consequences', () => {
  const s = setup(2); s.portals(); const a = s.clients[0]!, b = s.clients[1]!; const state = s.rooms.state(a.room.code);
  offerEvent(state, state.players[0]!, 'E23'); state.players[1]!.caught = true; state.players[1]!.acceptedDanger = true; offerEvent(state, state.players[1]!, 'E48');
  const before = state.players.map(p => p.credits); s.tick(); const after = s.rooms.state(a.room.code);
  assert.equal(after.phase, 'TRADE'); assert.equal(after.players[0]!.credits, before[0]); assert.equal(after.players[1]!.credits, before[1]! - 2);
  assert.equal(after.trace.find(t => t.playerId === a.room.yourSeatId && t.details.id === 'E23' && t.type === 'event-declined')?.type, 'event-declined');
  assert(after.trace.some(t => t.playerId === b.room.yourSeatId && t.type === 'event-resolved' && t.details.id === 'E48'));
});
