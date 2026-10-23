import { rarityValue } from '../src/shared/rarity-power.js';
import { passiveSpec } from '../src/game/appraisal/passives.js';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { advanceAppraisalEncounter, applyAppraisalAction, appraisalViewFor, assertAppraisalInvariants, createAppraisalRun, exportAppraisalAudit, replayAppraisalAudit } from '../src/game/appraisal/index.js';
import { EXPANSION_KINDS, ITEM_SPECS, NPC_SPECS, itemFamily, itemImage, merchantKinds } from '../src/game/appraisal/content.js';
import { analyseAppraisalMatchAudit } from '../src/playtest/appraisal-report.js';
import { eventEligible, offerEvent, resolveEvent } from '../src/game/appraisal/events.js';
import { appraisalFixture } from './support/appraisal-fixture.js';
import type { AppraisalAction, AppraisalState, EventId, ItemKind, NpcId } from '../src/game/appraisal/types.js';
import type { AppraisalMatchAudit } from '../src/shared/appraisal-protocol.js';

const kinds=(Object.keys(ITEM_SPECS) as ItemKind[]).filter(kind=>!passiveSpec(kind) && !['smith-hammer','whetstone','doubt-lens','void-seal','chrono-gear','burden-hourglass','shifting-compass'].includes(kind) && !EXPANSION_KINDS.includes(kind));
type Body=AppraisalAction extends infer A ? A extends AppraisalAction ? Omit<A,'playerId'|'requestId'|'encounter'> : never : never;
function driver(initial:AppraisalState) {
  let state=initial,request=0;
  const act=(playerId:string,body:Body)=>{state=applyAppraisalAction(state,{...body,playerId,requestId:`catalog-${++request}`,encounter:state.encounter} as AppraisalAction);};
  const decline=(id:string)=>{const offer=state.players.find(p=>p.id===id)!.eventOffer;if(offer)act(id,{type:'event',key:offer.key,choice:'decline'});};
  const finish=()=>{
    for(let i=0;state.phase!=='RESULTS' && i<100;i++) {
      if(state.phase==='REVEAL')state=advanceAppraisalEncounter(state);
      else {const p=state.players.find(p=>!p.done&&!p.paused);assert(p);act(p.id,{type:'done'});}
    }
    assert.equal(state.phase,'RESULTS');const audit=exportAppraisalAudit(state);assert.deepEqual(replayAppraisalAudit(audit),state);return audit;
  };
  return {get state(){return state;},act,decline,finish};
}
function offered(kind:ItemKind,market:boolean) {
  for(let i=0;i<256;i++) {
    const state=createAppraisalRun(['alice','bob'],`catalog-${kind}-${market}-${i}`,{catalogVersion:2,commerce:false,startingCredits:200,maxEnergy:20,bankReserve:10000,marketProbability:market?1:0,marketMaxOrders:30});
    const portal=state.players[0]!.portals.find(portal=>portal.stock.some(id=>state.items[id]!.kind===kind && (market || (state.items[id]!.genuine&&!state.items[id]!.cursed))));
    if(!portal || (market && !state.market.orders.some(o=>o.kind===kind)))continue;
    const id=portal.stock.find(id=>state.items[id]!.kind===kind && (market || (state.items[id]!.genuine&&!state.items[id]!.cursed)))!;
    const run=driver(state);for(const p of state.players)run.decline(p.id);
    if(run.state.players[0]!.done || run.state.players[0]!.selectedPortalId || run.state.players[0]!.portals.find(p=>p.id===portal.id)?.disabled)continue;
    run.act('alice',{type:'enter',portalId:portal.id});
    if(run.state.phase==='PORTALS' && !run.state.players[1]!.done)run.act('bob',{type:'enter',portalId:run.state.players[1]!.portals.find(p=>!p.disabled)!.id});
    for(const p of run.state.players)run.decline(p.id);assert.equal(run.state.phase,'APPRAISAL');return {run,id};
  }
  throw new Error(`No bounded seeded offer for ${kind}, market=${market}`);
}

test('catalog has 30 distinct reachable products with usable family artwork and different mechanical profiles',()=>{
  assert.equal(kinds.length,30);assert.equal(new Set(kinds.map(k=>ITEM_SPECS[k].name)).size,30);
  assert.equal(new Set(kinds.map(k=>JSON.stringify({...ITEM_SPECS[k],name:undefined}))).size,30);
  for(const kind of kinds)assert(existsSync(`src/appraisal-client/public${itemImage(kind)}`));
  for(const npc of Object.keys(NPC_SPECS) as NpcId[]) {
    assert.deepEqual(merchantKinds(npc,1),NPC_SPECS[npc].favorite);
    assert.equal(merchantKinds(npc,2).length,9);
  }
  assert.deepEqual(new Set(Object.keys(NPC_SPECS).flatMap(npc=>merchantKinds(npc as NpcId,2))),new Set(kinds));
  assert.throws(()=>createAppraisalRun(['a','b'],'bad-version',{catalogVersion:4 as 2}),/เวอร์ชันคลังสินค้า/);
});

for(const kind of kinds)test(`catalog ${kind}: seeded NPC purchase, activation, Dark Market sale, private view and strict replay`,()=>{
  const {run,id}=offered(kind,false);const before=run.state.players[0]!.credits;const price=run.state.items[id]!.ask;
  run.act('alice',{type:'buy',itemIds:[id],condition:false});assert.equal(run.state.players[0]!.credits,before-price);
  let view=appraisalViewFor(run.state,'alice').self.inventory.find(i=>i.id===id)!;
  assert.equal(view.name,ITEM_SPECS[kind].name);assert.equal(view.image,itemImage(kind));assert.equal(view.knowledge.genuine,undefined);assert.equal(view.knowledge.cursed,undefined);
  run.act('alice',{type:'inspect',itemId:id,property:'effects'});view=appraisalViewFor(run.state,'alice').self.inventory.find(i=>i.id===id)!;
  const energy=run.state.players[0]!.energy;run.act('alice',{type:'activate',itemId:id});const p=run.state.players[0]!;
  if(itemFamily(kind)==='orb') {
    assert.equal(p.energy,Math.min(run.state.config.maxEnergy,energy-1+(ITEM_SPECS[kind].energyRecovery??3)));
    assert(view.possibleBenefit.includes(String(ITEM_SPECS[kind].energyRecovery??3)));
  } else assert(p.statuses.some(s=>s.id===ITEM_SPECS[kind].buff));
  assert.equal(p.inventory.includes(id),!ITEM_SPECS[kind].consumable);assertAppraisalInvariants(run.state);assert.equal(run.finish().config.catalogVersion,2);

  const sale=offered(kind,true);sale.run.act('alice',{type:'buy',itemIds:[sale.id],condition:false});const order=sale.run.state.market.orders.find(o=>o.kind===kind)!;
  const cash=sale.run.state.players[0]!.credits;sale.run.act('alice',{type:'market-sell',itemId:sale.id,orderId:order.id});
  assert.equal(sale.run.state.players[0]!.credits,cash+rarityValue(sale.run.state.items[sale.id]!,order.price));assert(!sale.run.state.players[0]!.inventory.includes(sale.id));
  assert.equal(sale.run.state.market.orders.find(o=>o.id===order.id)!.quota.alice,0);sale.run.finish();
});

for(const [event,kind] of [['E07','moon-feed'],['E31','memory-mirror'],['E32','blood-orb'],['E33','bone-key'],['E34','void-mask'],['E35','dream-tonic'],['E36','sun-cell'],['E38','echo-charm'],['E39','eclipse-blade']] as Array<[EventId,ItemKind]>)test(`${event} accepts the new ${kind} family member`,()=>{
  const state=appraisalFixture(event),p=state.players[0]!;
  for(const id of [...p.inventory])if(itemFamily(state.items[id]!.kind)===itemFamily(kind) && state.items[id]!.kind!==kind){p.inventory=p.inventory.filter(v=>v!==id);state.items[id]!.owner='removed';}
  assert(eventEligible(state,p,event));offerEvent(state,p,event);const offer=p.eventOffer!;const id=`owned-${kind}`;assert(offer.itemIds.includes(id));
  resolveEvent(state,p,{type:'event',playerId:p.id,requestId:'variant-event',encounter:state.encounter,key:offer.key,choice:offer.choices.find(c=>c!=='decline')!,itemId:id,...(offer.statusIds.length?{statusId:offer.statusIds[0]!}:{})});
  assertAppraisalInvariants(state);
});

test('new key preview names the actual door-unlock effect before activation',()=>{
  const state=appraisalFixture('E33');const view=appraisalViewFor(state,'alice').self.inventory.find(i=>i.kind==='bone-key')!;
  assert(view.possibleBenefit.includes('ล้างสถานะปิดประตู'));
  const after=applyAppraisalAction(state,{type:'activate',playerId:'alice',requestId:'unlock-new-key',encounter:1,itemId:view.id});
  assert(!after.players[0]!.statuses.some(s=>s.id==='D07'));assert(!after.players[0]!.statuses.some(s=>s.id==='B03'));
});

test('all published original v0.4 raw/room audits retain their exact 10-product replay and reporting',()=>{
  const paths=['docs/simulation/appraisal-v0.4/example-run.json','docs/simulation/appraisal-delivery-v0.4/example-run.json',...[2,3,4].map(n=>`docs/validation/appraisal-network-v0.4/network-${n}-players.json`),...[2,3,4].flatMap(n=>[`docs/validation/appraisal-delivery-v0.4/network/network-${n}-players.json`,`docs/validation/appraisal-delivery-v0.4/network/lan-${n}-players.json`])];
  for(const path of paths){const input=JSON.parse(readFileSync(path,'utf8'));const audit=input.run??input;assert.equal(audit.config.catalogVersion,undefined);const state=replayAppraisalAudit(audit);assert.deepEqual(exportAppraisalAudit(state),audit);assert(Object.values(state.items).every(i=>!ITEM_SPECS[i.kind].family));if(input.run)analyseAppraisalMatchAudit(input as AppraisalMatchAudit);}
});
