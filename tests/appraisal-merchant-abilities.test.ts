import test from 'node:test';
import { dismissEvent } from './event-dismiss.js';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createAppraisalRun, restoreAppraisalRun, applyAppraisalAction, advanceAppraisalEncounter, appraisalViewFor, assertAppraisalInvariants, replayAppraisalAudit } from '../src/game/appraisal/index.js';
import { ITEM_SPECS, NPC_SPECS, merchantKinds, itemImage } from '../src/game/appraisal/content.js';
import { ABILITY_ITEMS, ABILITY_ITEM_TEXT } from '../src/game/appraisal/ability-content.js';
import { abilityRemaining, reduceAbilityCooldown } from '../src/game/appraisal/ability-rules.js';
import { merchantAbilityViews } from '../src/game/appraisal/merchant-abilities.js';
import { grant, reward, status } from '../src/game/appraisal/mechanics.js';
import { heldPassives, passiveBonuses } from '../src/game/appraisal/passives.js';
import { itemScoreValue } from '../src/game/appraisal/scoring.js';
import { offerEvent, resolveEvent, eventEligible } from '../src/game/appraisal/events.js';
import { simulateAppraisalRun } from '../src/simulation/appraisal.js';
import { parseAppraisalMessage } from '../src/server/appraisal-messages.js';
import { MerchantAbilities } from '../src/appraisal-client/MerchantAbilities.js';
import { abilityItemLabel } from '../src/appraisal-client/ability-text.js';
import { purchasePrice, playerPassives } from '../src/appraisal-client/model.js';
import { setLang } from '../src/appraisal-client/i18n.js';
import type { AppraisalAction, AppraisalItem, AppraisalState, ItemKind, NpcId } from '../src/game/appraisal/types.js';

type Body=AppraisalAction extends infer A?A extends AppraisalAction?Omit<A,'playerId'|'requestId'|'encounter'>:never:never;
let sequence=0;
const act=(s:AppraisalState,body:Body,playerId='alice')=>applyAppraisalAction(s,{...body,playerId,encounter:s.encounter,requestId:`ability-test-${++sequence}`} as AppraisalAction);
function fixture():AppraisalState {
  const s=createAppraisalRun(['alice','bob'],'merchant-abilities',{trustAbilities:true,marketProbability:0,encounters:10});
  s.phase='APPRAISAL';
  for(const p of s.players){p.eventOffer=null;p.done=false;p.offerSlots=2;p.selectedPortalId=p.portals[0]!.id;p.stock=[...p.portals[0]!.stock];p.npcTrust=Object.fromEntries(Object.keys(NPC_SPECS).map(n=>[n,6]));for(const id of p.stock){s.items[id]!.genuine=true;s.items[id]!.cursed=false;}}
  return s;
}
function equip(s:AppraisalState,kind:ItemKind,extras:Partial<AppraisalItem>={}):string {
  const p=s.players[0]!,id=`ability-owned-${++sequence}`;
  s.items[id]={id,kind,base:40,ask:40,genuine:true,cursed:false,owner:p.id,npcOwnerId:p.id,npc:'orc',encounter:s.encounter,certificate:false,lastAppraisal:null,lastAccepted:null,reservation:1,...extras};p.inventory.push(id);return id;
}
function next(s:AppraisalState):AppraisalState {
  s.phase='REVEAL';return advanceAppraisalEncounter(s);
}

test('all eight abilities unlock by their own trust and share one use per encounter',()=>{
  let s=fixture();const p=s.players[0]!,id=p.stock[0]!;p.npcTrust={autometa:1,orc:0};
  assert.equal(merchantAbilityViews(s,p).filter(v=>v.ready).length,1);
  assert.throws(()=>act(s,{type:'merchant-ability',npc:'orc',itemId:id}),/ไว้ใจ/);
  s=act(s,{type:'merchant-ability',npc:'autometa',itemId:id});
  assert.equal(s.players[0]!.knowledge[id]!.base,s.items[id]!.base);
  assert.equal(s.players[0]!.knowledge[id]!.genuine,undefined);
  assert.equal(s.players[0]!.abilityReady!.autometa,4);
  assert.throws(()=>act(s,{type:'merchant-ability',npc:'autometa',itemId:id}),/ช่วงนี้/);
  const later=next(s);assert.equal(!!later.players[0]!.skillUsed,false);assert.equal(abilityRemaining(later.players[0]!,'autometa',2),2);
});

test('ability retries are idempotent and invalid targets roll back without spending the cooldown',()=>{
  const s=fixture(),id=s.players[0]!.stock[0]!;
  const command:AppraisalAction={type:'merchant-ability',npc:'autometa',itemId:id,playerId:'alice',encounter:1,requestId:'retry-ability'};
  const result=applyAppraisalAction(s,command);assert.equal(applyAppraisalAction(result,command),result);
  assert.throws(()=>act(s,{type:'merchant-ability',npc:'autometa',itemId:s.players[1]!.stock[0]!}),/เลือกสินค้า/);
  assert.equal(s.players[0]!.skillUsed,undefined);assert.equal(s.players[0]!.abilityReady,undefined);
  assert.equal(Object.hasOwn(appraisalViewFor(result,'bob').self,'knowledge'),false);
});

test('Swarm value scales by trust, makes one copy, preserves unknown facts and labels its source',()=>{
  for(const [trust,percent] of [[1,25],[3,35],[6,50]] as const){
    let s=fixture();const id=equip(s,'gambler-hat');s.players[0]!.npcTrust!.swarm=trust;
    s=act(s,{type:'merchant-ability',npc:'swarm',itemId:id});
    const copy=Object.values(s.items).find(i=>i.copy?.sourceId===id)!;
    assert.equal(copy.base,Math.floor(40*percent/100));assert.equal(copy.copy!.valuePercent,percent);
    assert.equal(s.players[0]!.inventory.length,2);
    const v=appraisalViewFor(s,'alice').self.inventory.find(i=>i.id===copy.id)!;
    assert.equal(v.knowledge.genuine,undefined);assert.equal(v.knowledge.base,undefined);assert.equal(v.image,itemImage('gambler-hat'));
    assert.match(v.name,/สำเนา #1 ของ/);assert.equal(v.copy!.sourceId,id);
    assert.equal(heldPassives([{kind:'gambler-hat',copy:copy.copy}],true).luck,2);
    assert.deepEqual(playerPassives(appraisalViewFor(s,'alice')),passiveBonuses(s,s.players[0]!));
    s.players[0]!.skillUsed=false;s.players[0]!.abilityReady={};
    assert.throws(()=>act(s,{type:'merchant-ability',npc:'swarm',itemId:id}),/สินค้า/);
    assert.throws(()=>act(s,{type:'merchant-ability',npc:'swarm',itemId:copy.id}),/สินค้า/);
    setLang('en');assert.match(abilityItemLabel(v),/Copy #1 of/);setLang('th');
    assertAppraisalInvariants(s);
  }
});

test('consuming a Swarm copy permanently locks its original, including after ownership transfer',()=>{
  let s=fixture();const id=equip(s,'dream-tonic');
  s=act(s,{type:'merchant-ability',npc:'swarm',itemId:id});const copyId=s.players[0]!.inventory.find(i=>i!==id)!;
  s=act(s,{type:'activate',itemId:copyId});
  assert.equal(s.items[id]!.copyConsumed,true);assert.equal(s.items[copyId]!.owner,'removed');
  assert.equal(s.players[0]!.itemUseBonuses!.luck,4);
  s.players[0]!.inventory=[];s.items[id]!.owner='bob';s.players[1]!.inventory.push(id);
  assert.equal(merchantAbilityViews(s,s.players[1]!).find(a=>a.npc==='swarm')!.itemIds.includes(id),false);
  assertAppraisalInvariants(s);
});

test('original activation upgrades a weaker copy bonus without adding same-kind bonuses twice',()=>{
  let s=fixture();const id=equip(s,'dream-tonic');s=act(s,{type:'merchant-ability',npc:'swarm',itemId:id});
  const copy=s.players[0]!.inventory.find(v=>v!==id)!;s=act(s,{type:'activate',itemId:copy});
  s=act(s,{type:'activate',itemId:id});assert.equal(s.players[0]!.itemUseBonuses!.luck,10);
  assert.equal(s.players[0]!.itemUseKinds!.filter(k=>k==='dream-tonic').length,1);
});

test('Beast opens persistent unique choices, spends cooldown on opening, and does not grant a free item',()=>{
  let s=fixture();const id=s.players[0]!.stock[0]!,before=s.players[0]!.inventory.length;
  s=act(s,{type:'merchant-ability',npc:'beast',itemId:id});
  const p=s.players[0]!,ids=[...p.abilityChoice!.itemIds];assert.equal(ids.length,4);assert(ids.includes(id));assert.equal(p.abilityReady!.beast,4);
  assert.equal(new Set(ids.map(i=>s.items[i]!.kind)).size,ids.length);
  assert.deepEqual(appraisalViewFor(s,'alice').self.abilityChoice!.itemIds,ids);
  assert.throws(()=>act(s,{type:'buy',itemIds:[id],condition:false}),/เลือกสินค้า/);
  assert.throws(()=>act(s,{type:'merchant-ability',npc:'beast',choiceId:s.players[1]!.stock[0]!}),/เสนอ/);
  const choice=ids.find(i=>i!==id)!;s=act(s,{type:'merchant-ability',npc:'beast',choiceId:choice});
  assert(s.players[0]!.stock.includes(choice));assert.equal(s.players[0]!.inventory.length,before);assert.equal(s.players[0]!.abilityChoice,undefined);
  assert.equal(s.items[choice]!.owner,'npc:alice:1');assert.equal(s.items[id]!.owner,'retired');
});

test('Alien cannot launder fakes, curses, copy effects or scoring value',()=>{
  let s=fixture();const id=equip(s,'blade',{genuine:false,cursed:true,base:20});
  s=act(s,{type:'merchant-ability',npc:'alien',itemId:id});const choices=s.players[0]!.abilityChoice!.itemIds;
  for(const candidateId of choices){const c=s.items[candidateId]!;assert.equal(c.genuine,false);assert.equal(c.cursed,true);assert(itemScoreValue(c.base,c.genuine,c.cursed)<=itemScoreValue(20,false,true));}
  s=act(s,{type:'merchant-ability',npc:'alien',choiceId:choices[0]!});assert.equal(s.players[0]!.inventory.length,1);assert.equal(s.items[id]!.owner,'removed');
});

test('Orc price preview equals payment; fees and bank ledger are preserved',()=>{
  let s=fixture();const id=s.players[0]!.stock[0]!;s.items[id]!.ask=30;
  s=act(s,{type:'merchant-ability',npc:'orc',itemId:id});const view=appraisalViewFor(s,'alice'),quote=purchasePrice(view,[view.self.stock.find(i=>i.id===id)!],false);
  const before=s.players[0]!.credits;s=act(s,{type:'buy',itemIds:[id],condition:false});assert.equal(before-s.players[0]!.credits,quote);assert.equal(s.players[0]!.orcDeal,undefined);assertAppraisalInvariants(s);
});

test('Vampire preserves one consumable once per original; Deepsea cleanses without an inspection',()=>{
  let s=fixture();const id=equip(s,'food');s=act(s,{type:'merchant-ability',npc:'vampire',itemId:id});s=act(s,{type:'activate',itemId:id});
  assert(s.players[0]!.inventory.includes(id));assert.equal(s.items[id]!.preserved,true);
  s.players[0]!.activated=[];s=act(s,{type:'activate',itemId:id});assert(!s.players[0]!.inventory.includes(id));
  s=fixture();const cursed=equip(s,'blade',{cursed:true});s=act(s,{type:'merchant-ability',npc:'deepsea',itemId:cursed});
  assert.equal(s.items[cursed]!.cursed,false);assert.deepEqual(s.players[0]!.knowledge[cursed],{cursed:false,genuine:true,base:40});
});

test('Dark One removes the selected debuff; next-use haste and delay do not rewrite an existing timer',()=>{
  let s=fixture();grant(s,s.players[0]!,'D25');grant(s,s.players[0]!,'D01');
  s=act(s,{type:'merchant-ability',npc:'darkone',statusId:'D01'});assert.equal(status(s.players[0]!,'D01'),undefined);assert.equal(s.players[0]!.abilityReady!.darkone,7);
  const p=s.players[0]!;grant(s,p,'B25');assert.equal(p.abilityReady!.darkone,7);assert(status(p,'B25'));
});

test('cooldown gear has a shared per-kind limit, half-base cap, fractional copy effects and no same-round reuse',()=>{
  let s=fixture();const p=s.players[0]!;p.abilityReady={swarm:6};p.abilityLastUsed={swarm:1};p.abilityAdjusted={swarm:0};
  const gear=equip(s,'chrono-gear'),second=equip(s,'chrono-gear');
  s=act(s,{type:'activate',itemId:gear,npc:'swarm'});assert.equal(s.players[0]!.abilityReady!.swarm,5);
  assert.throws(()=>act(s,{type:'activate',itemId:second,npc:'swarm'}),/ครั้งเดียว/);
  assert.equal(reduceAbilityCooldown(s.players[0]!,'swarm',1,99),1);assert.equal(s.players[0]!.abilityReady!.swarm,4);
  assert.equal(reduceAbilityCooldown(s.players[0]!,'swarm',1,99),0);
  assert.equal(abilityRemaining(s.players[0]!,'swarm',2),2);
  const lone=fixture().players[0]!;lone.abilityReady={orc:4};lone.abilityLastUsed={orc:1};assert.equal(reduceAbilityCooldown(lone,'orc',1,.4),.4);assert.equal(lone.abilityReady.orc,3.6);
  lone.abilityReady.orc=1.4;assert.equal(reduceAbilityCooldown(lone,'orc',1,1),0);
});

test('time transfer moves the same amount between distinct cooling skills, and compass expands Beast only once',()=>{
  let s=fixture();s.players[0]!.abilityReady={swarm:6,alien:5};s.players[0]!.abilityLastUsed={swarm:1,alien:1};
  const glass=equip(s,'burden-hourglass');s=act(s,{type:'activate',itemId:glass,npc:'swarm',otherNpc:'alien'});
  assert.equal(s.players[0]!.abilityReady!.swarm,5);assert.equal(s.players[0]!.abilityReady!.alien,6);
  assert.throws(()=>act(fixture(),{type:'activate',itemId:glass,npc:'swarm',otherNpc:'swarm'}));
  s=fixture();const compass=equip(s,'shifting-compass');s=act(s,{type:'activate',itemId:compass});assert(status(s.players[0]!,'B26'));
  s=act(s,{type:'merchant-ability',npc:'beast',itemId:s.players[0]!.stock[0]!});assert.equal(s.players[0]!.abilityChoice!.itemIds.length,5);assert.equal(status(s.players[0]!,'B26'),undefined);
});

test('new events are gated, have distinct choices and charge the advertised resources',()=>{
  const s=fixture(),p=s.players[0]!;p.offerSlots=0;p.abilityReady={swarm:6};p.abilityLastUsed={swarm:1};
  assert(eventEligible(s,p,'E130'));offerEvent(s,p,'E130');const before=p.credits;
  resolveEvent(s,p,{type:'event',playerId:p.id,requestId:'wind',encounter:1,key:p.eventOffer!.key,choice:'wind'});assert.equal(p.credits,before-3);assert.equal(p.abilityReady.swarm,5);
  offerEvent(s,p,'E131');resolveEvent(s,p,{type:'event',playerId:p.id,requestId:'pact',encounter:1,key:p.eventOffer!.key,choice:'credits'});assert.equal(p.credits,before+2);assert(status(p,'D25'));
  s.config.trustAbilities=false;for(const id of ['E130','E131','E132'] as const)assert.equal(eventEligible(s,p,id),false);
});

test('new products have different mechanics and unique name-to-image mappings; legacy catalogs exclude them',()=>{
  const fingerprints=new Set<string>(),hashes=new Set<string>();
  for(const [kind,spec] of Object.entries(ABILITY_ITEMS)){
    const text=ABILITY_ITEM_TEXT[kind as keyof typeof ABILITY_ITEM_TEXT].en;assert(!fingerprints.has(text));fingerprints.add(text);
    assert.equal(ITEM_SPECS[kind as ItemKind].name,spec.name);const bytes=readFileSync(`src/appraisal-client/public${itemImage(kind as ItemKind)}`);assert.equal(bytes.subarray(0,3).toString('hex'),'ffd8ff');hashes.add(createHash('sha256').update(bytes).digest('hex'));
    for(const npc of Object.keys(NPC_SPECS) as NpcId[]){assert(!merchantKinds(npc,3,true,true,true,true).includes(kind as ItemKind));}
  }
  assert.equal(hashes.size,3);const reachable=new Set((Object.keys(NPC_SPECS) as NpcId[]).flatMap(n=>merchantKinds(n,3,true,true,true,true,true)));for(const kind of Object.keys(ABILITY_ITEMS))assert(reachable.has(kind as ItemKind));
  const s=fixture();const {trustAbilities:_flag,...historical}=s.config;const old=restoreAppraisalRun(['alice','bob'],'legacy-abilities',historical);assert.equal(old.config.trustAbilities,undefined);assert.equal(appraisalViewFor(old,'alice').self.merchantAbilities,undefined);
});

test('protocol validates ability targets, rejects actor/hidden-state injection, and UI renders both languages',()=>{
  const base={type:'merchant-ability',npc:'swarm',itemId:'original',requestId:'ability',encounter:1};
  assert.equal(parseAppraisalMessage({type:'action',matchId:'match',action:base}).type,'action');
  for(const extra of [{npc:'__proto__'},{playerId:'bob'},{base:999},{choiceId:123}])assert.throws(()=>parseAppraisalMessage({type:'action',matchId:'match',action:{...base,...extra}}));
  const s=fixture();for(const lang of ['th','en'] as const){setLang(lang);const html=renderToStaticMarkup(createElement(MerchantAbilities,{game:appraisalViewFor(s,'alice'),submit:()=>{},disabled:false}));assert(html.includes(lang==='th'?'พันธะพ่อค้า':'Merchant bonds'));assert(!html.includes('<select'));assert(!html.includes('undefined'));}setLang('th');
});

test('new seeded runs exercise abilities and events through DTO-only bots and replay strictly',()=>{
  let abilities=0,events=0;
  for(let n=0;n<5;n++){
    const audit=simulateAppraisalRun(3,'collector',`ability-proof-${n}`,{trustAbilities:true,survival:{maxLife:8,encounterLifeCost:1,entryEnergyCost:0}});
    abilities+=audit.trace.filter(t=>t.type==='merchant-ability-used').length;events+=audit.trace.filter(t=>t.type==='event-offered'&&['E130','E131','E132'].includes(String(t.details.id))).length;
    assert.deepEqual(replayAppraisalAudit(audit).config,audit.config);
  }
  assert(abilities>0);assert(events>0);
});


test('offered time events never trap the seat after shared funds change: they lapse, including the done default',()=>{
  for(const done of [false,true]){
    let s=fixture();const p=s.players[0]!;p.offerSlots=0;offerEvent(s,p,'E131');
    reward(s,s.players[1]!,s.bank-s.market.budget-s.reservedRewards-4,'test-bank-drain');
    assert.equal(eventEligible(s,p,'E131'),false);
    s=done?act(s,{type:'done'}):act(s,{type:'event',key:p.eventOffer!.key,...dismissEvent(p.eventOffer!)});
    assert.equal(s.players[0]!.eventOffer,null);assertAppraisalInvariants(s);
  }
});

test('copy sales and item-use events apply reduced value/effects through the existing pipelines',()=>{
  let s=fixture();const original=equip(s,'orb');s.players[0]!.npcTrust!.swarm=1;
  s=act(s,{type:'merchant-ability',npc:'swarm',itemId:original});const copyId=s.players[0]!.inventory.find(id=>id!==original)!;
  const p=s.players[0]!;p.offerSlots=0;p.energy=1;offerEvent(s,p,'E32');const before=p.energy;
  resolveEvent(s,p,{type:'event',playerId:p.id,requestId:'copy-event',encounter:1,key:p.eventOffer!.key,choice:'accept',itemId:copyId});
  assert.equal(p.energy-before,1,'three energy at 40 percent rounds down to one');assert.equal(s.items[original]!.copyConsumed,true);
  s=fixture();const id=equip(s,'mirror');s.players[0]!.npcTrust!.swarm=1;s=act(s,{type:'merchant-ability',npc:'swarm',itemId:id});
  const copy=s.players[0]!.inventory.find(v=>v!==id)!;s.market={encounter:1,open:true,budget:100,orders:[{id:'copy-order',kind:'mirror',price:20,quota:{alice:1,bob:1}}]};
  const wallet=s.players[0]!.credits;s=act(s,{type:'market-sell',itemId:copy,orderId:'copy-order'});assert.equal(s.players[0]!.credits-wallet,5);assertAppraisalInvariants(s);
});

test('new targeted items keep normal consumable/equipment activation costs',()=>{
  for(const kind of ['chrono-gear','burden-hourglass','shifting-compass'] as const){
    let s=fixture();const id=equip(s,kind);s.players[0]!.abilityReady={swarm:6,alien:5};s.players[0]!.abilityLastUsed={swarm:1,alien:1};
    const before=s.players[0]!.energy;s=act(s,{type:'activate',itemId:id,...(kind!=='shifting-compass'?{npc:'swarm' as const}:{}),...(kind==='burden-hourglass'?{otherNpc:'alien' as const}:{})});
    assert.equal(before-s.players[0]!.energy,kind==='burden-hourglass'?1:0);
  }
});

test('the full new-run catalog has no mechanically identical profiles after ignoring names and prices',async()=>{
  const {MODERN_ACTIVATIONS}=await import('../src/game/appraisal/ability-content.js');
  const {PASSIVE_ITEMS}=await import('../src/game/appraisal/passives.js');
  const {EXTRA_HELD_EFFECTS,ITEM_USE_EFFECTS}=await import('../src/game/appraisal/item-effects.js');
  const profiles=new Map<string,string>();
  for(const [kind,spec] of Object.entries(ITEM_SPECS)){
    const held=(PASSIVE_ITEMS as Record<string,{passive:{effect:string;amount:number}}>)[kind]?.passive??EXTRA_HELD_EFFECTS[kind as ItemKind],use=ITEM_USE_EFFECTS[kind as ItemKind];
    const modern=MODERN_ACTIVATIONS[kind as keyof typeof MODERN_ACTIVATIONS];
    const profile=JSON.stringify({active:modern?.operation??spec.buff,drawback:spec.drawback,consumable:spec.consumable,energyRecovery:spec.energyRecovery??(spec.family==='orb'||kind==='orb'?3:0),held:held?[held.effect,held.amount]:null,use:use?[use.effect,use.amount]:null,tool:['smith-hammer','whetstone','doubt-lens','void-seal','chrono-gear','burden-hourglass','shifting-compass'].includes(kind)?kind:null});
    assert.equal(profiles.has(profile),false,`${kind} duplicates ${profiles.get(profile)}`);profiles.set(profile,kind);
  }
  assert.equal(profiles.size,66);
});

test('previously duplicated scanner, memory mirror and void cell now change different decisions',()=>{
  let s=fixture();const scanner=equip(s,'scanner');s=act(s,{type:'activate',itemId:scanner});
  assert(s.trace.some(t=>t.type==='item-insight'&&t.details.itemId===scanner&&t.details.fact==='base'));assert.equal(status(s.players[0]!,'B01'),undefined);
  const warrant=equip(s,'inspection-warrant');s=act(s,{type:'activate',itemId:warrant});assert(status(s.players[0]!,'B01'));
  s=fixture();const mirror=equip(s,'memory-mirror');s=act(s,{type:'activate',itemId:mirror});assert(s.trace.some(t=>t.type==='item-insight'&&t.details.itemId===mirror));assert.equal(status(s.players[0]!,'B02'),undefined);
  const lens=equip(s,'surveyor-lens');s=act(s,{type:'activate',itemId:lens});assert(status(s.players[0]!,'B02'));
  s=fixture();const cell=equip(s,'void-cell');s.players[0]!.energy=5;s=act(s,{type:'activate',itemId:cell});assert.equal(s.players[0]!.energy,7);assert(status(s.players[0]!,'D25'));assert.equal(status(s.players[0]!,'B02'),undefined);
});

test('scanner ignores stale shop slots owned by another player and uses held fallback',()=>{
  let s=fixture();const p=s.players[0]!,scanner=equip(s,'scanner'),held=equip(s,'mirror'),stale=p.stock[0]!;
  s.items[stale]!.owner='bob';s.players[1]!.inventory.push(stale);
  for(const id of p.stock.slice(1))p.knowledge[id]={base:s.items[id]!.base};
  p.knowledge[scanner]={base:s.items[scanner]!.base};
  s=act(s,{type:'activate',itemId:scanner});
  assert.equal(s.players[0]!.knowledge[stale]?.base,undefined);
  assert.equal(s.players[0]!.knowledge[held]?.base,s.items[held]!.base);
  assertAppraisalInvariants(s);
});
