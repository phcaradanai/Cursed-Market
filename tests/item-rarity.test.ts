import test from 'node:test';
import assert from 'node:assert/strict';
import { RARITIES, THEMES, appearanceRandom, defaultRarityConfig, resolveAppearance, rollAppearance, validateRarityConfig, weightedPick } from '../src/shared/item-rarity.js';
import type { ItemAppearance, Rarity } from '../src/shared/item-rarity.js';
import { createAppraisalRun, restoreAppraisalRun, applyAppraisalAction } from '../src/game/appraisal/engine.js';
import { appraisalItemView } from '../src/game/appraisal/views.js';
import { ensureItemAppearance } from '../src/game/appraisal/rarity.js';
import { simulateAppraisalRun } from '../src/simulation/appraisal.js';
import { replayAppraisalAudit, exportAppraisalAudit } from '../src/game/appraisal/audit.js';

test('weighted boundaries exclude disabled entries and reject malformed rates',()=>{
  const entries=[{value:'off',weight:0},{value:'a',weight:.25},{value:'b',weight:.75}];
  assert.equal(weightedPick(entries,0),'a');assert.equal(weightedPick(entries,.249999),'a');assert.equal(weightedPick(entries,.25),'b');assert.equal(weightedPick(entries,.999999),'b');
  for(const draw of [-1,1,NaN])assert.throws(()=>weightedPick(entries,draw));
  assert.throws(()=>weightedPick([{value:1,weight:0}],0));
  for(const value of [-.1,2,NaN,Infinity]){const c=defaultRarityConfig();c.rates.uncommon=value;assert.throws(()=>validateRarityConfig(c));}
  const c=defaultRarityConfig();c.rates.common=.5;assert.throws(()=>validateRarityConfig(c));
});
test('uncommon has ten configurable themes and weighted theme selection is independent of palette',()=>{
  const c=defaultRarityConfig();assert.equal(c.themes.uncommon.length,10);
  for(const r of RARITIES)c.rates[r]=r==='uncommon'?1:0;
  c.themes.uncommon=[{theme:'inferno',weight:1},{theme:'frost',weight:0}];
  for(let seed=0;seed<100;seed++){const a=rollAppearance(seed,c);assert.equal(a.rarity,'uncommon');assert.equal(a.theme,'inferno');assert.deepEqual(rollAppearance(seed,c),a);}
  c.themes.uncommon=[{theme:'inferno',weight:0}];assert.throws(()=>validateRarityConfig(c));
  c.themes.uncommon=[{theme:'inferno',weight:1},{theme:'inferno',weight:1}];assert.throws(()=>validateRarityConfig(c));
});
test('theme identity survives seeded palettes; effect richness increases monotonically with rarity',()=>{
  const look:ItemAppearance={version:1,rarity:'uncommon',theme:'inferno',visualSeed:123};
  const styles=Array.from({length:50},(_,seed)=>resolveAppearance({...look,visualSeed:seed}));
  assert.equal(new Set(styles.map(s=>s.primary.join(','))).size,50);
  assert.ok(styles.every(s=>s.theme==='inferno'&&s.primary.every(n=>n>=0&&n<=1)));
  let particles=-1,strength=-1;
  for(const rarity of RARITIES){const s=resolveAppearance({...look,rarity});assert.ok(s.particleCount>particles);assert.ok(s.strength>strength);particles=s.particleCount;strength=s.strength;}
  for(const theme of THEMES)assert.deepEqual(resolveAppearance({...look,theme}),resolveAppearance({...look,theme}));
  assert.throws(()=>rollAppearance(-1,defaultRarityConfig()));
});
test('sampled rates follow configuration and appearance variation is deterministic',()=>{
  const c=defaultRarityConfig(),counts=Object.fromEntries(RARITIES.map(r=>[r,0])) as Record<Rarity,number>;
  for(let seed=0;seed<20000;seed++){const a=rollAppearance(seed,c);counts[a.rarity]++;}
  for(const r of RARITIES)assert.ok(Math.abs(counts[r]/20000-c.rates[r])<.012,`${r}: ${counts[r]}`);
  assert.notEqual(appearanceRandom(1,'theme'),appearanceRandom(1,'rarity'));
});
test('door entry generates appearance only for chosen stock, including trust slots; retries do not reroll',()=>{
  let state=createAppraisalRun(['alice','bob'],'rarity-entry');
  for(const p of state.players)p.eventOffer=null;
  const p=state.players[0]!;p.npcTrust={orc:6};
  assert.ok(Object.values(state.items).every(i=>i.appearance===undefined));
  const command={type:'enter' as const,playerId:p.id,portalId:p.portals[0]!.id,requestId:'enter-a',encounter:1};
  state=applyAppraisalAction(state,command);
  const stock=state.players[0]!.stock;assert.ok(stock.length>2);
  assert.ok(stock.every(id=>!!state.items[id]!.appearance));
  assert.ok(Object.values(state.items).filter(i=>!stock.includes(i.id)).every(i=>i.appearance===undefined));
  const appearances=stock.map(id=>state.items[id]!.appearance);
  state=applyAppraisalAction(state,command);assert.deepEqual(stock.map(id=>state.items[id]!.appearance),appearances);
});
test('appearance never depends on hidden truths; DTO copies, ownership changes and reload preserve it',()=>{
  const state=createAppraisalRun(['alice','bob'],'rarity-privacy'),item=Object.values(state.items)[0]!;
  const before={base:item.base,ask:item.ask,genuine:item.genuine,cursed:item.cursed};
  ensureItemAppearance(state,item);const look=structuredClone(item.appearance!);
  const factor=item.rarityPower?.valueMultiplier??1;
  assert.deepEqual({base:item.base,ask:item.ask,genuine:item.genuine,cursed:item.cursed},{...before,base:before.base*factor,ask:before.ask*factor});
  const peer=appraisalItemView(state,'bob',item.id);assert.deepEqual(peer.appearance,look);assert.equal(peer.knowledge.base,undefined);
  peer.appearance!.visualSeed=7;assert.deepEqual(item.appearance,look);
  item.owner='alice';item.genuine=!item.genuine;item.cursed=!item.cursed;ensureItemAppearance(state,item);assert.deepEqual(item.appearance,look);
  assert.deepEqual(appraisalItemView(structuredClone(state),'alice',item.id).appearance,look);
});
test('appearance-enabled audits replay exactly and historical configs retain their original shape',()=>{
  const audit=simulateAppraisalRun(2,'cautious','rarity-audit',{encounters:1,marketProbability:0});
  assert.ok(Object.values(audit.items).some(i=>!!i.appearance));
  assert.deepEqual(exportAppraisalAudit(replayAppraisalAudit(audit)),audit);
  const config=structuredClone(audit.config);delete config.rarity;delete config.rarityEconomy;
  const old=restoreAppraisalRun(['alice','bob'],'legacy-rarity',config);
  const item=Object.values(old.items)[0]!;ensureItemAppearance(old,item);
  assert.equal('rarity' in old.config,false);assert.equal('appearance' in item,false);
  const fresh=createAppraisalRun(['alice','bob'],'config-isolation');fresh.config.rarity!.rates.common=0;
  assert.equal(createAppraisalRun(['alice','bob'],'another').config.rarity!.rates.common,.6);
});
