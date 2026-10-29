import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { createAppraisalRun, restoreAppraisalRun } from '../src/game/appraisal/engine.js';
import { BOND_SPECS, CONSIGN_RULES, ITEM_SPECS, NPC_SPECS, UNSOLD_PENALTIES } from '../src/game/appraisal/content.js';
import { CORE2_SPECS, FALLBACK_BRAND, core2Choices } from '../src/game/appraisal/core2-specs.js';
import { resolveCore2Event } from '../src/game/appraisal/core2-events.js';
import { linkedStatuses } from '../src/game/appraisal/core2.js';
import { offerEvent } from '../src/game/appraisal/events.js';
import { merchantAbilityViews } from '../src/game/appraisal/merchant-abilities.js';
import { grant, status } from '../src/game/appraisal/mechanics.js';
import { omenOf } from '../src/game/appraisal/omens.js';
import { POLISH_EVENTS } from '../src/game/appraisal/polish-events.js';
import { BROKERAGE_RULES } from '../src/game/appraisal/survival.js';
import { chooseTheftHand, startTheftDuel, theftViewFor } from '../src/game/appraisal/theft.js';
import { ALL_STATUS_IDS, STATUS_IDS } from '../src/game/appraisal/types.js';
import type { AppraisalConfig, AppraisalState, Appraiser, EventId, StatusId } from '../src/game/appraisal/types.js';

const SERVER = { secureEconomy: true, brokerage: BROKERAGE_RULES, polish: true, npcEvents: true, core2: true } satisfies Partial<AppraisalConfig>;
const ENGINE = 'src/game/appraisal';
const source = readdirSync(ENGINE).filter(f => f.endsWith('.ts') && !['types.ts', 'content.ts', 'core2-content.ts', 'ability-content.ts'].includes(f))
  .map(f => readFileSync(`${ENGINE}/${f}`, 'utf8')).join('\n');

/** Every place a status can come from in a room with this config: code that grants it by name, and every data table and pool. */
function producers(config: AppraisalConfig): Set<StatusId> {
  const out = new Set<StatusId>();
  for (const m of source.matchAll(/grant\(\s*state\s*,\s*[\w!.]+\s*,\s*'([BD]\d\d)'/g)) out.add(m[1] as StatusId);
  for (const m of source.matchAll(/statusId:'([BD]\d\d)'/g)) out.add(m[1] as StatusId);
  for (const spec of Object.values(ITEM_SPECS)) { out.add(spec.buff); out.add(spec.drawback); }
  for (const npc of Object.values(NPC_SPECS)) out.add(npc.condition);
  for (const spec of Object.values(POLISH_EVENTS)) spec.grant.forEach(s => out.add(s));
  for (const id of Object.keys(CORE2_SPECS) as EventId[]) for (const c of core2Choices(id, config)) [...(c.grant ?? []), ...(c.gamble?.win ?? []), ...(c.gamble?.lose ?? [])].forEach(s => out.add(s));
  FALLBACK_BRAND.grant!.forEach(s => out.add(s));
  for (const spec of BOND_SPECS) [...(spec.buffs ?? []), ...(spec.debuffs ?? [])].forEach(s => out.add(s));
  for (const rule of Object.values(UNSOLD_PENALTIES)) rule.statuses.forEach(s => out.add(s));
  CONSIGN_RULES.debuffs.forEach(s => out.add(s));
  // Random boons, blessings and hexes draw from the original forty plus the linked v0.6 statuses.
  for (const s of [...STATUS_IDS, ...linkedStatuses(config, 'B'), ...linkedStatuses(config, 'D')]) out.add(s);
  return out;
}
/** Statuses some rule actually reads, not only spends or lists. */
function readers(): Set<StatusId> {
  const out = new Set<StatusId>();
  for (const m of source.matchAll(/(?:status|statusMagnitude)\(\s*[\w!.]+\s*,\s*'([BD]\d\d)'/g)) out.add(m[1] as StatusId);
  for (const m of source.matchAll(/\.id\s*===\s*'([BD]\d\d)'/g)) out.add(m[1] as StatusId);
  return out;
}

test('every status in a new run has a producer and a reader', () => {
  const config = createAppraisalRun(['a', 'b'], 'links', SERVER).config;
  const made = producers(config), read = readers();
  assert.deepEqual(ALL_STATUS_IDS.filter(id => !made.has(id)), [], 'statuses nothing can give');
  assert.deepEqual(ALL_STATUS_IDS.filter(id => !read.has(id)), [], 'statuses no rule reads');
});

test('without status links the v0.6 statuses have no producer, so the check above is meaningful', () => {
  const config = structuredClone(createAppraisalRun(['a', 'b'], 'links', SERVER).config); delete config.statusLinks;
  const made = producers(config);
  // D21's only named grant (a failed merchant duel) is gated in code, which this source scan cannot see; the duel test covers it.
  assert.deepEqual(['B21', 'B22', 'B23', 'B24', 'D22', 'D23', 'D24'].filter(id => made.has(id as StatusId)), []);
});

function table(config: Partial<AppraisalConfig> = {}, seed = 'status-links'): AppraisalState {
  const state = createAppraisalRun(['alice', 'bob'], seed, { ...SERVER, marketProbability: 0, ...config });
  state.phase = 'APPRAISAL';
  for (const p of state.players) { p.stock = [...p.portals[0]!.stock]; p.selectedPortalId = p.portals[0]!.id; p.eventOffer = null; p.energy = 8; p.done = false; }
  return state;
}
/** Start a merchant duel and play the merchant's own sealed hand, so the round ties. */
function tieMerchant(state: AppraisalState, thief: Appraiser) {
  startTheftDuel(state, thief, { itemId: thief.stock[0]! });
  const duel = state.theftDuels!.at(-1)!;
  chooseTheftHand(state, thief, duel.id, duel.hands.npc!);
  return duel;
}

test('B22 waits for a tie and wins it; D21 loses it; neither tips anything without status links', () => {
  const s = table(); const alice = s.players[0]!;
  grant(s, alice, 'B22');
  startTheftDuel(s, alice, { itemId: alice.stock[0]! });
  assert.ok(status(alice, 'B22'), 'not spent when the duel starts');
  assert.equal(theftViewFor(s, alice).duels[0]!.tieGoesTo, 'you');
  const duel = s.theftDuels![0]!; chooseTheftHand(s, alice, duel.id, duel.hands.npc!);
  assert.equal(duel.status, 'won'); assert.ok(!status(alice, 'B22'));

  const caught = table(); const thief = caught.players[0]!;
  grant(caught, thief, 'D21');
  const lost = tieMerchant(caught, thief);
  assert.equal(lost.status, 'lost');
  assert.ok(status(thief, 'D21'), 'a failed merchant theft leaves the merchant watching');
  assert.equal(merchantAbilityViews(caught, thief).every(view => !view.ready), true, 'watched seats get no merchant service');

  const config = structuredClone(table().config); delete config.statusLinks;
  const old = restoreAppraisalRun(['alice', 'bob'], 'status-links', config); old.phase = 'APPRAISAL';
  const o = old.players[0]!; o.stock = [...o.portals[0]!.stock]; o.selectedPortalId = o.portals[0]!.id; o.eventOffer = null; o.energy = 8;
  grant(old, o, 'B22');
  const tie = tieMerchant(old, o);
  assert.equal(tie.status, 'open'); assert.equal(tie.round, 2); assert.ok(!status(o, 'B22'), 'old runs keep spending B22 at the start');
});

test('the victim\'s B21 takes a tied round against a player thief', () => {
  const s = table(); const [alice, bob] = s.players as [Appraiser, Appraiser];
  const id = Object.keys(s.items).find(key => s.items[key]!.owner.startsWith('npc:') && !alice.stock.includes(key) && !bob.stock.includes(key))!;
  Object.assign(s.items[id]!, { owner: bob.id }); bob.inventory.push(id);
  grant(s, bob, 'B21');
  startTheftDuel(s, alice, { victimId: bob.id });
  const duel = s.theftDuels![0]!;
  assert.equal(theftViewFor(s, bob).duels[0]!.tieGoesTo, 'you');
  assert.equal(theftViewFor(s, alice).duels[0]!.tieGoesTo, undefined, 'the thief does not learn about the guard');
  chooseTheftHand(s, bob, duel.id, 'rock'); chooseTheftHand(s, alice, duel.id, 'rock');
  assert.equal(duel.status, 'lost'); assert.ok(!status(bob, 'B21'));
  assert.ok(bob.inventory.includes(id));
});

test('the thieves\' night omen gives tied rounds to the thief', () => {
  const seed = Array.from({ length: 400 }, (_, n) => `night-${n}`).find(seed => omenOf(SERVER, seed, 2)?.id === 'thieves-night')!;
  assert.ok(seed, 'some seed meets the omen on encounter 2');
  const s = table({}, seed); s.encounter = 2; s.market.encounter = 2;
  for (const p of s.players) { for (const id of p.stock) { s.items[id]!.encounter = 2; s.items[id]!.owner = `npc:${p.id}:2`; } }
  const duel = tieMerchant(s, s.players[0]!);
  assert.equal(duel.status, 'won');
});

test('the v0.6 statuses come from the events their catalog names', () => {
  const resolve = (id: EventId, choice: string, setup?: (s: AppraisalState, p: Appraiser) => void) => {
    const s = table(); const p = s.players[0]!; p.credits = 40; setup?.(s, p);
    if (id === 'E120') p.inflated = true;
    offerEvent(s, p, id);
    resolveCore2Event(s, p, p.eventOffer!, { type: 'event', key: p.eventOffer!.key, choice, playerId: p.id, requestId: 'r', encounter: s.encounter });
    return p;
  };
  assert.ok(status(resolve('E128', 'ward', (s, p) => { p.inventory.push(Object.keys(s.items).find(k => s.items[k]!.owner.startsWith('npc:') && !p.stock.includes(k))!); s.items[p.inventory[0]!]!.owner = p.id; }), 'B21'));
  assert.ok(status(resolve('E126', 'calm'), 'B23'));
  const drink = resolve('E126', 'drink', (_s, p) => { p.energy = 2; });
  assert.ok(status(drink, 'B24') || status(drink, 'D23'), 'the brew is a gamble between a blessing and bleeding');
  const pouch = resolve('E120', 'pouch'); assert.ok(status(pouch, 'D22') && status(pouch, 'D24'));
  assert.ok(status(resolve('E129', 'whisper'), 'D24'));
  const s = table(); const p = s.players[0]!;
  assert.deepEqual(linkedStatuses(s.config, 'B'), ['B21', 'B22', 'B23', 'B24']);
  assert.deepEqual(linkedStatuses(s.config, 'D'), ['D21', 'D22', 'D23', 'D24']);
  assert.ok(p, 'boon drafts and NPC blessings draw from these pools');
});
