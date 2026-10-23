import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceAppraisalEncounter, applyAppraisalAction, restoreAppraisalRun } from '../src/game/appraisal/engine.js';
import { eventEligible, offerEvent, resolveEvent, isConsequence } from '../src/game/appraisal/events.js';
import { BROKERAGE_RULES, SURVIVAL_RULES } from '../src/game/appraisal/survival.js';
import { ABILITY_EVENT_IDS, BOND_EVENT_IDS, BOON_EVENT_ID, CORE2_EVENT_IDS, EVENT_IDS, EXPANSION_EVENT_IDS, NPC_EVENT_IDS, POLISH_EVENT_IDS } from '../src/game/appraisal/types.js';
import { simulateAppraisalRun } from '../src/simulation/appraisal.js';
import type { AppraisalAction, AppraisalConfig, AppraisalState, Appraiser, EventId, EventOffer, StatusId } from '../src/game/appraisal/types.js';

/**
 * A choice is only worth showing when it is a real decision. This test offers every event that fits real mid-run tables,
 * resolves every choice on a copy, and fails when:
 *  - a decline sits beside an option that only gives (pointless decline),
 *  - no option of an event that has a decline ever gives anything (the decline dominates),
 *  - two options lead to exactly the same table (duplicate choice).
 */
const SERVER = { secureEconomy: true, brokerage: BROKERAGE_RULES, polish: true, npcEvents: true, core2: true } satisfies Partial<AppraisalConfig>;
const ALL_EVENTS: EventId[] = [...EVENT_IDS, ...BOND_EVENT_IDS, ...POLISH_EVENT_IDS, BOON_EVENT_ID, ...NPC_EVENT_IDS, ...CORE2_EVENT_IDS, ...EXPANSION_EVENT_IDS, ...ABILITY_EVENT_IDS];
/** Outcomes that hang on a seeded roll or a hidden fact (fakes are refused): one table may only show the losing side. */
const GAMBLES = new Set<EventId>(['E51', 'E70', 'E74', 'E87', 'E93', 'E107']);
/** E14 teaches a past sale price through a note rather than a fact on an item. */
const NOTE_ONLY = new Set<EventId>(['E14']);

type Outcome = { choice: string; cost: boolean; gain: boolean; table: string };
type Finding = { id: EventId; rule: 'pointless-decline' | 'decline-dominates' | 'duplicate'; detail: string };

const statusLevel = (p: Appraiser) => new Map(p.statuses.map(s => [s.id, s.charges * 100 + s.expires]));
const facts = (p: Appraiser) => Object.values(p.knowledge).reduce((n, k) => n + Object.keys(k).length, 0);
function judge(before: AppraisalState, after: AppraisalState, id: string): { cost: boolean; gain: boolean } {
  const a = before.players.find(p => p.id === id)!, b = after.players.find(p => p.id === id)!;
  let cost = false, gain = false;
  if (b.credits < a.credits) cost = true; if (b.credits > a.credits) gain = true;
  if (b.energy < a.energy) cost = true; if (b.energy > a.energy) gain = true;
  if ((b.life ?? 0) < (a.life ?? 0)) cost = true; if ((b.life ?? 0) > (a.life ?? 0)) gain = true;
  if (a.inventory.some(item => !b.inventory.includes(item))) cost = true;
  if (b.inventory.some(item => !a.inventory.includes(item))) gain = true;
  const sa = statusLevel(a), sb = statusLevel(b);
  for (const [sid, level] of sb) if ((sa.get(sid) ?? -1) < level) (sid.startsWith('D') ? cost = true : gain = true);
  for (const [sid, level] of sa) if ((sb.get(sid) ?? -1) < level) (sid.startsWith('D') ? gain = true : cost = true);
  if (facts(b) > facts(a)) gain = true;
  if (b.portals.filter(v => v.disabled).length > a.portals.filter(v => v.disabled).length) cost = true;
  if (b.dealMode !== a.dealMode) cost = true;
  // Wagers on the next appraisal: a reward if accurate, a penalty if not.
  if (b.honorJob !== a.honorJob || b.honestyReward !== a.honestyReward) { cost = true; gain = true; }
  if (b.subsidy && !a.subsidy) gain = true;
  if (JSON.stringify(b.wishes) !== JSON.stringify(a.wishes) || JSON.stringify(b.npcContracts) !== JSON.stringify(a.npcContracts)) gain = true;
  if (JSON.stringify(b.abilityReady) !== JSON.stringify(a.abilityReady)) gain = true;
  if (JSON.stringify(after.publicKnowledge) !== JSON.stringify(before.publicKnowledge)) cost = true;
  for (const other of after.players) if (other.id !== id) {
    const was = before.players.find(p => p.id === other.id)!;
    if (other.statuses.some(s => s.id.startsWith('D') && !was.statuses.some(w => w.id === s.id))) gain = true;
  }
  return { cost, gain };
}
const table = (state: AppraisalState, id: string) => {
  const { notes: _notes, resolvedEvents: _resolved, seenEvents: _seen, eventOffer: _offer, ...rest } = state.players.find(p => p.id === id)!;
  return JSON.stringify({ rest, others: state.players.filter(p => p.id !== id).map(p => [p.statuses, p.credits]), pub: state.publicKnowledge, items: Object.values(state.items).map(i => i.owner) });
};
/** Every plausible way to fill in a choice's targets; the first that the engine accepts is used. */
function commands(offer: EventOffer, choice: string, playerId: string, encounter: number): AppraisalAction[] {
  const items = offer.itemIds.length ? offer.itemIds.slice(0, 3) : [undefined];
  const statuses: Array<StatusId | undefined> = [...(offer.boons ?? []), ...offer.statusIds, undefined].slice(0, 6);
  const lend = /^lend-(\d)$/.exec(choice);
  const out: AppraisalAction[] = [];
  for (const itemId of items) for (const statusId of statuses) {
    if (out.length >= 8) break;
    const fact = itemId ? (['base', 'genuine', 'cursed'] as const).find(f => offer.facts[itemId]?.[f] !== undefined) : undefined;
    out.push({ type: 'event', key: offer.key, choice, playerId, requestId: 'probe', encounter,
      ...(itemId ? { itemId } : {}), ...(statusId ? { statusId } : {}), ...(fact ? { fact } : {}), guess: true,
      ...(offer.otherPlayerIds[0] ? { otherPlayerId: offer.otherPlayerIds[0] } : {}),
      ...(lend ? { itemIds: offer.itemIds.slice(0, Number(lend[1])) } : {}) } as AppraisalAction);
  }
  return out;
}
/** Mid-run tables from seeded bot runs: replay each run and keep a spread of states in which seats can still act. */
type Policy = 'collector' | 'trader' | 'aggressive';
function tables(config: Partial<AppraisalConfig>, seeds: readonly string[], policies: readonly Policy[]): AppraisalState[] {
  const kept: AppraisalState[] = [];
  for (const mode of ['classic', 'survival'] as const) for (const policy of policies) for (const seed of seeds) {
    const audit = simulateAppraisalRun(3, policy, `choices-${mode}-${policy}-${seed}`, { ...config, ...(mode === 'survival' ? { survival: SURVIVAL_RULES } : {}) });
    let state = restoreAppraisalRun(audit.playerIds, audit.seed, audit.config);
    audit.commands.forEach((command, index) => {
      // Logs are dropped so each probe copies a small table; events read live state, not history (E14 aside).
      if (index % 6 === 0 && ['PORTALS', 'APPRAISAL', 'TRADE'].includes(state.phase)) kept.push({ ...state, trace: [], ledger: [], commands: [], accepted: {}, history: [] });
      state = command.type === 'advance' ? advanceAppraisalEncounter(state) : applyAppraisalAction(state, command);
    });
  }
  return kept;
}
function audit(config: Partial<AppraisalConfig>, seeds: readonly string[], policies: readonly Policy[] = ['collector', 'trader', 'aggressive']): { covered: Set<EventId>; findings: Finding[] } {
  const covered = new Set<EventId>(), findings: Finding[] = [];
  const everGains = new Map<EventId, boolean>(), withDecline = new Set<EventId>();
  for (const base of tables(config, seeds, policies)) for (const seat of base.players) {
    if (seat.paused || seat.done) continue;
    for (const id of ALL_EVENTS) {
      if (isConsequence(id) || !eventEligible(base, seat, id)) continue;
      const ready = structuredClone(base); const p = ready.players.find(v => v.id === seat.id)!;
      p.eventOffer = null;
      try { offerEvent(ready, p, id); } catch { continue; }
      const offer = p.eventOffer!;
      const outcomes: Outcome[] = [];
      for (const choice of offer.choices) {
        for (const command of commands(offer, choice, p.id, ready.encounter)) {
          const after = structuredClone(ready);
          try { resolveEvent(after, after.players.find(v => v.id === p.id)!, command as Extract<AppraisalAction, { type: 'event' }>); }
          catch { continue; }
          outcomes.push({ choice, ...judge(ready, after, p.id), table: table(after, p.id) });
          break;
        }
      }
      if (outcomes.length < 2 && !outcomes.some(o => o.choice !== 'decline')) continue;
      covered.add(id);
      const taken = outcomes.filter(o => o.choice !== 'decline');
      const decline = outcomes.find(o => o.choice === 'decline');
      if (taken.some(o => o.gain)) everGains.set(id, true); else if (!everGains.has(id)) everGains.set(id, false);
      if (decline && !GAMBLES.has(id)) for (const o of taken) if (o.gain && !o.cost) findings.push({ id, rule: 'pointless-decline', detail: `${o.choice} gives without cost` });
      for (const [i, x] of outcomes.entries()) for (const y of outcomes.slice(i + 1))
        if (x.table === y.table) findings.push({ id, rule: 'duplicate', detail: `${x.choice} = ${y.choice}` });
      if (decline) withDecline.add(id);
    }
  }
  // Only events that offer a decline can be dominated by it.
  for (const id of withDecline) if (!everGains.get(id) && !NOTE_ONLY.has(id) && !GAMBLES.has(id)) {
    findings.push({ id, rule: 'decline-dominates', detail: 'no option ever gives anything' });
  }
  const unique = new Map(findings.map(f => [`${f.id}:${f.rule}:${f.detail}`, f]));
  return { covered, findings: [...unique.values()] };
}

test('every event choice in a new run is a real decision: no pointless decline, no dominated decline, no duplicates', t => {
  const { covered, findings } = audit(SERVER, ['a']);
  t.diagnostic(`events probed: ${covered.size}`);
  assert.ok(covered.size >= 70, `only ${covered.size} events were reached; the probe is not exercising enough of the pool`);
  assert.deepEqual(findings, []);
});

test('the same probe finds the problems the original rules had, so it is not vacuous', () => {
  const { findings } = audit({ ...SERVER, eventChoiceRules: undefined } as unknown as Partial<AppraisalConfig>, ['a'], ['collector']);
  const flagged = new Set<string>(findings.map(f => f.id));
  assert.ok(['E108', 'E131', 'E42', 'E43'].some(id => flagged.has(id)), `original rules should be flagged, got ${[...flagged].join(',')}`);
});
