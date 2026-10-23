import test from 'node:test';
import assert from 'node:assert/strict';
import { createAppraisalRun, restoreAppraisalRun } from '../src/game/appraisal/engine.js';
import { defaultEvent, eventChoices, eventEligible, offerEvent, resolveEvent } from '../src/game/appraisal/events.js';
import { core2EventChoices, resolveCore2Event } from '../src/game/appraisal/core2-events.js';
import { BROKERAGE_RULES } from '../src/game/appraisal/survival.js';
import type { AppraisalAction, AppraisalConfig, AppraisalState, Appraiser, EventId, ItemKind } from '../src/game/appraisal/types.js';

const SERVER = { secureEconomy: true, brokerage: BROKERAGE_RULES, polish: true, npcEvents: true, core2: true } satisfies Partial<AppraisalConfig>;
function table(config: Partial<AppraisalConfig> = {}): AppraisalState {
  const state = createAppraisalRun(['alice', 'bob'], 'event-rework', { ...SERVER, marketProbability: 0, ...config });
  state.phase = 'APPRAISAL';
  for (const p of state.players) { p.stock = [...p.portals[0]!.stock]; p.selectedPortalId = p.portals[0]!.id; p.eventOffer = null; p.energy = 8; p.credits = 40; }
  return state;
}
/** Move one of the seat's shop goods into its bag as the given kind. */
function hold(state: AppraisalState, p: Appraiser, kind: ItemKind): string {
  const id = Object.keys(state.items).find(key => state.items[key]!.owner.startsWith('npc:') && !p.stock.includes(key))!;
  Object.assign(state.items[id]!, { owner: p.id, kind, genuine: true, cursed: false });
  p.inventory.push(id); return id;
}
const choose = (state: AppraisalState, p: Appraiser, choice: string, extra: Partial<Extract<AppraisalAction, { type: 'event' }>> = {}) =>
  resolveEvent(state, p, { type: 'event', key: p.eventOffer!.key, choice, playerId: p.id, requestId: 'r', encounter: state.encounter, ...extra });

test('free gifts have no decline, time out to the gift, and old runs keep their decline', () => {
  const s = table(); const alice = s.players[0]!;
  offerEvent(s, alice, 'E108');
  assert.deepEqual(alice.eventOffer!.choices, ['pick']);
  const first = alice.eventOffer!.boons![0]!;
  defaultEvent(s, alice);
  assert.ok(alice.statuses.some(st => st.id === first), 'timing out takes the first boon');
  for (const [id, expected] of [['E131', ['haste', 'credits']], ['E43', ['accept']]] as const) {
    alice.eventOffer = null; s.phase = id === 'E43' ? 'TRADE' : 'APPRAISAL';
    assert.deepEqual(eventChoices(s, alice, id as EventId), expected);
  }
  const config = structuredClone(table().config); delete config.eventChoiceRules;
  const old = restoreAppraisalRun(['alice', 'bob'], 'event-rework', config);
  assert.ok(eventChoices(old, old.players[0]!, 'E108').includes('decline'));
  assert.ok(eventChoices(old, old.players[0]!, 'E131').includes('decline'));
});

test('a merchant gift is one button and does not use an event slot', () => {
  const s = table(); const alice = s.players[0]!;
  // The merchant at the table is the one whose goods are on the shelf.
  for (const id of alice.stock) s.items[id]!.npc = 'orc';
  hold(s, alice, 'blade');
  assert.ok(eventEligible(s, alice, 'E52'));
  offerEvent(s, alice, 'E52');
  assert.deepEqual(alice.eventOffer!.choices, ['accept']);
  assert.equal(alice.offerSlots, 0);
  choose(s, alice, 'accept');
  assert.ok(alice.statuses.some(st => st.id === 'B03'));
  assert.equal(eventEligible(s, alice, 'E52'), false, 'a gift that would change nothing is not offered again');
});

test('E37 overloaded baggage has no free way out: pay, carry it, or leave an item', () => {
  const s = table(); const alice = s.players[0]!;
  const items = [hold(s, alice, 'food'), hold(s, alice, 'mask'), hold(s, alice, 'orb')];
  offerEvent(s, alice, 'E37');
  assert.deepEqual(alice.eventOffer!.choices, ['pay', 'burden', 'drop']);
  choose(s, alice, 'drop', { itemId: items[1]! });
  assert.equal(alice.inventory.includes(items[1]!), false);
  assert.equal(s.items[items[1]!]!.owner, 'removed');
  hold(s, alice, 'key'); alice.eventOffer = null; offerEvent(s, alice, 'E37'); defaultEvent(s, alice);
  assert.ok(alice.statuses.some(st => st.id === 'D06'), 'timing out carries the load');
});

test('E40 the broken scanner: repair it, throw it away, or live with the fog', () => {
  const s = table(); const alice = s.players[0]!;
  const scanner = hold(s, alice, 'scanner');
  offerEvent(s, alice, 'E40');
  assert.deepEqual(alice.eventOffer!.choices, ['repair', 'discard', 'endure']);
  const repaired = structuredClone(s); const a2 = repaired.players[0]!;
  choose(repaired, a2, 'repair'); assert.equal(a2.energy, 6); assert.ok(!a2.statuses.some(st => st.id === 'D02'));
  const thrown = structuredClone(s); const a3 = thrown.players[0]!;
  choose(thrown, a3, 'discard', { itemId: scanner }); assert.equal(a3.inventory.includes(scanner), false); assert.ok(!a3.statuses.some(st => st.id === 'D02'));
  defaultEvent(s, alice); assert.ok(alice.statuses.some(st => st.id === 'D02'));
  alice.eventOffer = null;
  assert.equal(eventEligible(s, alice, 'E40'), false, 'not offered while the fog is already on');
});

test('E47 sells one fact the other appraiser verified for 1 credit', () => {
  const s = table(); s.phase = 'TRADE'; const [alice, bob] = s.players as [Appraiser, Appraiser];
  const itemId = bob.stock[0]!; const item = s.items[itemId]!;
  bob.valuations[itemId] = { value: item.base, accuracy: true, caught: false, accepted: true };
  bob.knowledge[itemId] = { base: item.base };
  s.listings.push({ ownerId: bob.id, itemId, purchase: true });
  assert.ok(eventEligible(s, alice, 'E47'));
  offerEvent(s, alice, 'E47');
  choose(s, alice, 'accept', { itemId });
  assert.equal(alice.credits, 39);
  assert.equal(alice.knowledge[itemId]?.base, item.base);
  alice.eventOffer = null;
  assert.equal(eventEligible(s, alice, 'E47'), false, 'nothing left to learn from that ledger');
});

test('E119, E121 and E127: paying now is cheaper than paying later, and no debt is offered without a next encounter', () => {
  const s = table({ encounters: 3 }); s.phase = 'PORTALS'; const alice = s.players[0]!;
  assert.deepEqual(core2EventChoices(s, alice, 'E119'), ['pay', 'interest', 'switch']);
  offerEvent(s, alice, 'E119');
  const paid = structuredClone(s); resolveCore2Event(paid, paid.players[0]!, alice.eventOffer!, { type: 'event', key: alice.eventOffer!.key, choice: 'pay', playerId: 'alice', requestId: 'r', encounter: 1 });
  assert.equal(paid.players[0]!.credits, 38);
  const owed = structuredClone(s); resolveCore2Event(owed, owed.players[0]!, alice.eventOffer!, { type: 'event', key: alice.eventOffer!.key, choice: 'interest', playerId: 'alice', requestId: 'r', encounter: 1 });
  assert.equal(owed.players[0]!.credits, 39); assert.ok(owed.players[0]!.statuses.some(st => st.id === 'D04'), '1 now + 2 next encounter = 3 > 2');
  const last = table({ encounters: 1 }); last.phase = 'PORTALS';
  assert.deepEqual(core2EventChoices(last, last.players[0]!, 'E119'), ['pay', 'switch']);
  const lastAppraisal = table({ encounters: 1 });
  assert.equal(eventEligible(lastAppraisal, lastAppraisal.players[0]!, 'E127'), false);
  const borrow = table({ encounters: 3 }); const b = borrow.players[0]!;
  offerEvent(borrow, b, 'E127'); choose(borrow, b, 'borrow');
  assert.equal(b.credits, 43, 'borrow 3, repay 2 next encounter plus fees');
  const fine = table(); const f = fine.players[0]!; f.inflated = true;
  offerEvent(fine, f, 'E121'); choose(fine, f, 'pay');
  assert.equal(f.credits, 37);
});
