// Diagnostic evidence: reproduced=true means a defect is still present; --expect-fixed verifies the corrections.
// Run from the repository root after npm run build:server.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createAppraisalRun, applyAppraisalAction, assertAppraisalInvariants, defaultAppraisalAction } from '../../../dist/src/game/appraisal/engine.js';
import { offerEvent, eventEligible } from '../../../dist/src/game/appraisal/events.js';
import { core2EventChoices } from '../../../dist/src/game/appraisal/core2-events.js';
import { dreadNow } from '../../../dist/src/game/appraisal/core2-rules.js';
import { grant, maxLifeOf, maxEnergyOf, spend, status } from '../../../dist/src/game/appraisal/mechanics.js';
import { passiveBonuses } from '../../../dist/src/game/appraisal/passives.js';
import { appraisalViewFor } from '../../../dist/src/game/appraisal/views.js';
import { BROKERAGE_RULES, SURVIVAL_RULES } from '../../../dist/src/game/appraisal/survival.js';

const serverConfig = { secureEconomy: true, brokerage: BROKERAGE_RULES, polish: true, npcEvents: true, core2: true };
let sequence = 0;
function act(state, playerId, action) {
  return applyAppraisalAction(state, { playerId, encounter: state.encounter, requestId: `links-audit-${++sequence}`, ...action });
}
function fixture(seed = 'links-continuation', survival = true) {
  const s = createAppraisalRun(['alice', 'bob'], seed, { ...serverConfig, marketProbability: 0, ...(survival ? { survival: SURVIVAL_RULES } : {}) });
  s.phase = 'APPRAISAL';
  for (const p of s.players) {
    p.eventOffer = null; p.done = false; p.offerSlots = 0; p.consequenceSlots = 0;
    p.selectedPortalId = p.portals[0].id; p.stock = [...p.portals[0].stock];
  }
  assertAppraisalInvariants(s);
  return s;
}
function held(s, kind, suffix = '') {
  const p = s.players[0], source = s.items[p.stock[0]];
  const id = `audit-held-${kind}${suffix}`;
  const item = { ...source, id, kind, owner: p.id, base: 10, ask: 10, reservation: 1, genuine: true, cursed: false, lastTradePrice: 10 };
  delete item.appearance; delete item.rarityPower;
  s.items[id] = item; p.inventory.push(id);
  return id;
}

const findings = [];
{
  let s = fixture();
  const itemId = held(s, 'mirror');
  s.items[itemId].lastTradePrice = 6;
  spend(s, s.players[0], s.players[0].credits, 0, 'audit-setup');
  s = act(s, 'alice', { type: 'loan-propose', lenderId: 'bob', itemId, principal: 3 });
  const loanId = s.loans.at(-1).id;
  s = act(s, 'bob', { type: 'loan-respond', loanId, accept: true });
  s.players[0].inflated = true;
  offerEvent(s, s.players[0], 'E120');
  const capturedChoices = [...s.players[0].eventOffer.choices];
  s = act(s, 'alice', { type: 'loan-repay', loanId, amount: 3 });
  assertAppraisalInvariants(s);
  const currentChoices = core2EventChoices(s, s.players[0], 'E120');
  let error = null;
  let done = null;
  try { done = act(s, 'alice', { type: 'done' }); } catch (e) { error = { code: e.code, message: e.message }; }
  let defaultError = null;
  let timed = null;
  try { timed = applyAppraisalAction(s, defaultAppraisalAction(s, 'alice', 'audit-timeout')); } catch (e) { defaultError = { code: e.code, message: e.message }; }
  findings.push({ id: 'N1', reproduced: error?.code === 'event-cost' && defaultError?.code === 'event-cost', fixed: !error && !defaultError && done?.players[0].eventOffer === null && timed?.players[0].eventOffer === null && done.players[0].energy === s.players[0].energy - 2 && timed.players[0].energy === s.players[0].energy - 2, capturedChoices, currentChoices, creditsAfterRepay: s.players[0].credits, doneError: error, timeoutError: defaultError });
  // Positive control: the alternative can still be settled manually before the server deadline.
  const manual = act(s, 'alice', { type: 'event', key: s.players[0].eventOffer.key, choice: 'energy' });
  assert.equal(manual.players[0].eventOffer, null);
}
{
  const s = fixture(), p = s.players[0];
  held(s, 'life-relic'); p.energy = 0; p.life = SURVIVAL_RULES.maxLife;
  assertAppraisalInvariants(s);
  const injured = p.life < maxLifeOf(s, p), eligible = eventEligible(s, p, 'E126');
  const c = structuredClone(s); c.players[0].life--;
  findings.push({ id: 'N2', reproduced: injured && !eligible && eventEligible(c, c.players[0], 'E126'), fixed: injured && eligible && core2EventChoices(s, p, 'E126').includes('drink'), life: p.life, actualCap: maxLifeOf(s, p), energy: p.energy, eligible, eligibleOneLifeLower: eventEligible(c, c.players[0], 'E126') });
}
{
  const s = fixture(), p = s.players[0];
  const choices = core2EventChoices(s, p, 'E128'), emptyHandEligible = eventEligible(s, p, 'E128');
  held(s, 'mirror');
  const heldEligible = eventEligible(s, p, 'E128');
  grant(s, p, 'B06');
  const shieldEligible = eventEligible(s, p, 'E128');
  findings.push({ id: 'N3', reproduced: choices.includes('ward') && !emptyHandEligible && heldEligible && !shieldEligible, fixed: choices.includes('ward') && emptyHandEligible && heldEligible && shieldEligible && !core2EventChoices(s, p, 'E128').includes('offer'), choices, credits: p.credits, emptyHandEligible, heldEligible, withB06Eligible: shieldEligible });
}
{
  const s = fixture(), p = s.players[0];
  const before = { actual: dreadNow(s, p), view: appraisalViewFor(s, p.id).dread };
  grant(s, p, 'B23');
  const after = { actual: dreadNow(s, p), view: appraisalViewFor(s, p.id).dread };
  findings.push({ id: 'N4', reproduced: after.actual < before.actual && after.view === before.view && after.actual !== after.view, fixed: after.actual < before.actual && after.actual === after.view, before, after });
}

// Positive controls across ownership, item effects and encounter rewards.
const controls = [];
{
  let s = fixture(), p = s.players[0];
  const itemId = held(s, 'life-relic');
  const holdingCap = maxLifeOf(s, p);
  s.phase = 'REVEAL';
  // Use the real reward opener to satisfy storage's post-reward window.
  const { openRoundRewards } = await import('../../../dist/src/game/appraisal/round-rewards.js');
  openRoundRewards(s);
  s = act(s, 'alice', { type: 'round-bank' });
  s = act(s, 'alice', { type: 'vault-deposit-item', itemId });
  assert.equal(maxLifeOf(s, s.players[0]), holdingCap - 1);
  s = act(s, 'alice', { type: 'vault-withdraw-item', itemId });
  assert.equal(maxLifeOf(s, s.players[0]), holdingCap);
  controls.push('vault deposit removes held cap; withdrawal restores it');
}
{
  let s = fixture(), p = s.players[0];
  const itemId = held(s, 'orb'); p.energy = 2;
  s = act(s, p.id, { type: 'activate', itemId });
  assert(s.players[0].energy > 2);
  assert.equal(s.items[itemId].owner, 'removed');
  assert(!s.players[0].inventory.includes(itemId));
  controls.push('orb activation restores energy and removes the consumed item');
}
{
  const s = fixture(), p = s.players[0];
  for (let n = 0; n < 6; n++) held(s, 'life-relic', String(n));
  assert.equal(passiveBonuses(s, p).maxLife, 5);
  assert(p.energy <= maxEnergyOf(s, p));
  grant(s, p, 'B06'); grant(s, p, 'D23');
  assert(!status(p, 'D23'));
  controls.push('held copies cap at five; B06 blocks a newly granted D23');
}

// Compare initial demand coverage without claiming rerolls/gifts cannot supply missing kinds.
const coverage = [];
for (const survival of [false, true]) {
  let opened = 0, orders = 0, notInitiallyAvailable = 0, runsWithMissingKind = 0;
  for (let i = 0; i < 100; i++) {
    const s = createAppraisalRun(['alice', 'bob'], `links-market-${i}`, { ...serverConfig, marketProbability: 1, ...(survival ? { survival: SURVIVAL_RULES } : {}) });
    const current = new Set(s.players.flatMap(p => p.portals.flatMap(portal => portal.stock.map(id => s.items[id].kind))));
    if (s.market.open) opened++;
    orders += s.market.orders.length;
    const missing = s.market.orders.filter(order => !current.has(order.kind));
    notInitiallyAvailable += missing.length;
    if (missing.length) runsWithMissingKind++;
    assertAppraisalInvariants(s);
  }
  coverage.push({ mode: survival ? 'survival' : 'classic', seeds: 100, opened, orders, notInitiallyAvailable, runsWithMissingKind });
}
const sourcePaths = ['src/server/appraisal-main.ts', 'src/game/appraisal/engine.ts', 'src/game/appraisal/events.ts', 'src/game/appraisal/core2-events.ts', 'src/game/appraisal/core2-rules.ts', 'src/game/appraisal/core2-specs.ts', 'src/game/appraisal/mechanics.ts', 'src/game/appraisal/views.ts', 'src/game/appraisal/secure-storage.ts', 'src/game/appraisal/passives.ts'];
const sourceHashes = Object.fromEntries(sourcePaths.map(path => [path, createHash('sha256').update(readFileSync(path)).digest('hex')]));
if (process.argv.includes('--expect-fixed')) assert(findings.every(f => f.fixed && !f.reproduced), 'Every correction must pass its behavioral checks');
const report = { purpose: 'Pre/post-fix diagnostic plus positive controls. reproduced=true means a remaining defect; fixed=true verifies corrected behavior. --expect-fixed requires all four corrections.', head: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), systemLinks: fixture().config.systemLinks ?? null, findings, controls, coverage, sourceHashes };
writeFileSync(fileURLToPath(new URL('./report.json', import.meta.url)), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ findings, controls, coverage }, null, 2));
