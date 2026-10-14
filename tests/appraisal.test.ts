import { appraisalFixture as fixture } from './support/appraisal-fixture.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceAppraisalEncounter, applyAppraisalAction, appraisalViewFor, assertAppraisalInvariants, createAppraisalRun, exportAppraisalAudit, replayAppraisalAudit } from '../src/game/appraisal/index.js';
import { ITEM_SPECS } from '../src/game/appraisal/content.js';
import { eventEligible, offerEvent } from '../src/game/appraisal/events.js';
import { detectionRisk, grant, spend, status } from '../src/game/appraisal/mechanics.js';
import { EVENT_IDS, STATUS_IDS } from '../src/game/appraisal/types.js';
import type { AppraisalAction, AppraisalState, EventId, ItemKind, StatusId } from '../src/game/appraisal/types.js';
import { simulateAppraisalRun } from '../src/simulation/appraisal.js';

type ActionBody = AppraisalAction extends infer A ? A extends AppraisalAction ? A extends {type:'event'} ? Omit<A,'playerId'|'requestId'|'encounter'|'key'> & {key?:string} : Omit<A,'playerId'|'requestId'|'encounter'> : never : never;
let request=0;
function act(state:AppraisalState,playerId:string,body:ActionBody):AppraisalState {
  return applyAppraisalAction(state,{...(body.type==='event'?{key:body.key??state.players.find(p=>p.id===playerId)!.eventOffer!.key}:{}),...body,playerId,requestId:`test-${++request}`,encounter:state.encounter} as AppraisalAction);
}
function eventResponse(state:AppraisalState,id:EventId):Extract<ActionBody,{type:'event'}> {
  const p=state.players[0]!;const stock=p.stock[0]!;
  const choice:Partial<Record<EventId,string>>={E01:'stay',E03:'pay',E06:'interest',E08:'cash',E10:'pay',E11:'careful',E15:'price',E18:'discount',E37:'pay',E40:'repair',E42:'energy',E48:'pay',E49:'pay',E50:'surrender'};
  const ownedKinds:Partial<Record<EventId,ItemKind>>={E07:'food',E25:'blade',E31:'mirror',E32:'orb',E33:'key',E34:'mask',E35:'potion',E36:'battery',E38:'amulet',E39:'blade',E44:'food',E50:'food'};
  const target=id==='E47'?state.players[1]!.stock[0]!:ownedKinds[id]?`owned-${ownedKinds[id]}`:stock;
  const selectedStatus:Partial<Record<EventId,StatusId>>={E06:'D01',E34:'B03',E35:'D01',E41:'D01'};
  return {type:'event',choice:choice[id]??'accept',itemId:target,...(selectedStatus[id]?{statusId:selectedStatus[id]!}:{}),...(id==='E45'?{fact:'base' as const}:{}),...(id==='E46'?{guess:false}:{})};
}
const expectedStatus:Partial<Record<EventId,StatusId>>={E02:'B07',E04:'B01',E05:'B02',E07:'B05',E09:'D08',E15:'B01',E18:'B03',E22:'B07',E23:'B10',E24:'D05',E26:'B09',E27:'D04',E28:'B08',E29:'D09',E30:'B06',E31:'B01',E34:'B10',E36:'B05',E38:'B06',E39:'B04'};
for(const id of EVENT_IDS) test(`${id}: eligible offer resolves its actual choice and rejects an empty context`,()=>{
  let state=fixture(id);const before=structuredClone(state.players[0]!);
  assert.equal(eventEligible(state,state.players[0]!,id),true,id);
  offerEvent(state,state.players[0]!,id);const offer=structuredClone(state.players[0]!.eventOffer);
  state=act(state,'alice',eventResponse(state,id));let p=state.players[0]!;
  assert.equal(p.eventOffer,null);assert(p.resolvedEvents.includes(id));assertAppraisalInvariants(state);
  if(id==='E02' || id==='E18') {
    state=act(state,'alice',{type:'appraise',itemId:p.stock[0]!,value:state.items[p.stock[0]!]!.base});p=state.players[0]!;
  }
  if(expectedStatus[id]) assert(status(p,expectedStatus[id]!),`${id} must apply ${expectedStatus[id]}`);
  if(['E11','E12','E13','E16','E17','E20'].includes(id)) assert.equal(p.inspections,before.inspections+1);
  if(['E07','E32','E33','E35','E44','E50'].includes(id)) assert.equal(p.inventory.length,before.inventory.length-1);
  if(['E09','E24','E25','E27','E29','E30'].includes(id)) assert(p.inventory.includes(before.stock[0]!));
  if(id==='E21') assert.equal(p.inventory.length,before.inventory.length+2);
  if(id==='E25') assert.equal(state.items['owned-blade']!.owner,'removed');
  if(id==='E03') assert.equal(p.energy,10);
  if(id==='E13') assert.equal(p.knowledge[p.stock[0]!]!.comparison,p.stock[1]);
  if(id==='E17') {const range=p.knowledge[p.stock[0]!]!.range!;assert(range[0]<=20 && range[1]>=20 && range[1]-range[0]<16);}
  if(id==='E19') assert.equal(state.publicKnowledge[p.stock[0]!]!.genuine,false);
  if(id==='E31') assert(status(p,'D05'));
  if(id==='E38') assert(status(p,'D03'));
  if(id==='E39') assert(status(p,'D10'));
  if(['E06','E33','E35','E41'].includes(id)) assert(!status(p,id==='E33'?'D07':'D01'));
  if(id==='E43') {assert.equal(p.subsidy,true);assert.equal(state.reservedRewards,1);}
  if(id==='E45') {assert.equal(state.publicKnowledge[p.stock[0]!]!.base,20);assert.equal(state.publicKnowledge[p.stock[0]!]!.genuine,undefined);}
  if(id==='E46') {assert.equal(p.credits,before.credits+2);assert.equal(state.items[p.stock[0]!]!.genuine,false);}
  if(['E48','E49'].includes(id)) assert.equal(p.credits,before.credits-2);
  const empty=fixture(id);const ep=empty.players[0]!;
  empty.encounter=empty.config.encounters;empty.listings=[];empty.trace=[];empty.bank=0;
  ep.stock=[];ep.portals=[];ep.inventory=[];ep.statuses=[];ep.knowledge={};ep.energy=empty.config.maxEnergy;ep.inspections=2;ep.caught=false;
  assert.equal(eventEligible(empty,ep,id),false,id);
  assert.throws(()=>offerEvent(empty,ep,id));assert(offer?.choices.length);
});
for(const id of EVENT_IDS.filter(id=>Number(id.slice(1))<48)) test(`${id}: decline does not charge or transfer goods`,()=>{
  let state=fixture(id);offerEvent(state,state.players[0]!,id);const p=state.players[0]!;
  const before={credits:p.credits,energy:p.energy,inventory:structuredClone(p.inventory),statuses:structuredClone(p.statuses)};
  state=act(state,'alice',{type:'event',choice:'decline'});
  const after=state.players[0]!;assert.deepEqual({credits:after.credits,energy:after.energy,inventory:after.inventory,statuses:after.statuses},before);
});
test('catalog counts are 50 mechanical handlers and 32 independent status types',()=>{
  assert.equal(new Set(EVENT_IDS).size,50);assert.equal(new Set(STATUS_IDS).size,32);
});
test('price20/offer10 is 20% detection; risk modifiers are points and apply only to NPC',()=>{
  const state=fixture();const p=state.players[0]!,item=state.items[p.stock[0]!]!;
  assert.equal(detectionRisk(p,item,10),.2);grant(state,p,'B04');assert.equal(detectionRisk(p,item,10),.1);
  grant(state,p,'D03');assert.equal(detectionRisk(p,item,10),.2);assert.equal(detectionRisk(p,item,20),0);
});
test('D02 preserves B01 and already known truth; B05 and D01 cancel inspection costs',()=>{
  let state=fixture();const p=state.players[0]!;grant(state,p,'B01');grant(state,p,'D02');grant(state,p,'B05');grant(state,p,'D01');
  state=act(state,'alice',{type:'inspect',itemId:p.stock[0]!,property:'price'});
  let after=state.players[0]!;assert.equal(after.energy,6);assert(status(after,'B01'));assert.equal(after.knowledge[after.stock[0]!]!.base,undefined);
  after.statuses=after.statuses.filter(s=>s.id!=='D02');
  state=act(state,'alice',{type:'inspect',itemId:after.stock[0]!,property:'price'});after=state.players[0]!;
  assert.equal(after.knowledge[after.stock[0]!]!.base,20);assert(!status(after,'B01'));
});
test('B02 opens curse truth; B03/D06 apply once to a bundle and D09 prevents transfers',()=>{
  let state=fixture();let p=state.players[0]!;grant(state,p,'B02');
  state=act(state,'alice',{type:'inspect',itemId:p.stock[0]!,property:'effects'});p=state.players[0]!;
  assert.equal(p.knowledge[p.stock[0]!]!.cursed,true);assert(status(p,'B02'),'the curse check itself needs no B02, so the buff is kept');
  state=act(state,'alice',{type:'inspect',itemId:p.stock[1]!,property:'authenticity'});p=state.players[0]!;
  assert.equal(p.knowledge[p.stock[1]!]!.cursed,state.items[p.stock[1]!]!.cursed);assert(!status(p,'B02'));grant(state,p,'B03');grant(state,p,'D06');
  const ids=[...p.stock],credits=p.credits,energy=p.energy;
  state=act(state,'alice',{type:'buy',itemIds:ids,condition:false});p=state.players[0]!;
  assert.equal(p.credits,credits-42);assert.equal(p.energy,energy-1,'free buying leaves only the heavy-gear D06 cost');assert(!status(p,'B03'));assert.equal(status(p,'D06')!.charges,1);
  grant(state,p,'D09',ids[0]!);assert.throws(()=>act(state,'alice',{type:'share',itemId:ids[0]!,allow:true,purchase:true}));
});
test('B06/B07/B08 prevent only their declared effects, not voluntary costs',()=>{
  let state=fixture('E48');let p=state.players[0]!;grant(state,p,'B06');grant(state,p,'D01');assert(!status(p,'D01'));assert(!status(p,'B06'));
  grant(state,p,'B07');offerEvent(state,p,'E48');state=act(state,'alice',{type:'event',choice:'item',itemId:'owned-food'});p=state.players[0]!;assert(p.inventory.includes('owned-food'));assert(!status(p,'B07'));
  state=fixture('E50');p=state.players[0]!;grant(state,p,'B08');offerEvent(state,p,'E50');state=act(state,'alice',{type:'event',choice:'die'});p=state.players[0]!;assert.equal(p.paused,null);assert.equal(p.energy,5);assert(!status(p,'B08'));
});
test('B10 and D08 change negotiation allowance; duplicate grants do not stack',()=>{
  const state=fixture();const p=state.players[0]!;grant(state,p,'B10');grant(state,p,'B10');grant(state,p,'D08');
  assert.equal(p.statuses.filter(s=>s.id==='B10').length,1);assert.equal(appraisalViewFor(state,p.id).self.counterLimit,1);
});
test('dark market transfers immediately, uses current quotas, rejects stale/locked/duplicate sales',()=>{
  let state=fixture();const p=state.players[0]!;const order={id:'quote-1-key',kind:'key' as const,price:30,quota:{alice:1,bob:1}};
  state.market={encounter:1,open:true,budget:60,orders:[order]};
  const command:AppraisalAction={type:'market-sell',playerId:'alice',requestId:'sale',encounter:1,itemId:'owned-key',orderId:order.id};
  const before=p.credits;state=applyAppraisalAction(state,command);assert.equal(state.players[0]!.credits,before+30);assert.equal(state.items['owned-key']!.owner,'removed');assert.equal(state.market.budget,30);
  assert.equal(applyAppraisalAction(state,command),state);assert.throws(()=>act(state,'alice',{type:'market-sell',itemId:'owned-key',orderId:order.id}));
  assert.throws(()=>applyAppraisalAction(state,{...command,requestId:'stale',encounter:0}));
  grant(state,state.players[0]!,'D09','owned-mirror');state.market.orders.push({id:'mirror',kind:'mirror',price:30,quota:{alice:1}});state.market.budget+=30;
  assert.throws(()=>act(state,'alice',{type:'market-sell',itemId:'owned-mirror',orderId:'mirror'}));
});
test('private view omits seed/future stock/truth; shared listings never copy another seat inspection',()=>{
  const state=fixture();const p=state.players[0]!,peer=state.players[1]!;p.knowledge[p.stock[0]!]={base:20,cursed:true};
  state.listings.push({ownerId:p.id,itemId:p.stock[0]!,purchase:true});const view=appraisalViewFor(state,peer.id);
  assert.equal(JSON.stringify(view).includes('"seed"'),false);assert.equal(JSON.stringify(view).includes('"schedule"'),false);
  const listing=view.listings.find(l=>l.ownerId===p.id)!;assert.equal(listing.item.knowledge.base,undefined);assert.equal(listing.item.knowledge.cursed,undefined);
  assert.throws(()=>exportAppraisalAudit(state));
});
test('P2P at price0 transfers once with no NPC reaction; cross-shop requires permission',()=>{
  let state=fixture('E43');const p=state.players[0]!,peer=state.players[1]!;
  const itemId='owned-food';state.listings=[{ownerId:p.id,itemId,purchase:true}];offerEvent(state,p,'E43');state=act(state,'alice',{type:'event',choice:'accept'});
  state=act(state,'bob',{type:'propose',sellerId:'alice',itemId,credits:0});const offerId=state.trades[0]!.id;
  const detections=state.trace.filter(t=>t.type==='appraised').length;const before=state.players[0]!.credits;
  state=act(state,'alice',{type:'respond',offerId,accept:true});assert.equal(state.items[itemId]!.owner,peer.id);assert.equal(state.players[0]!.credits,before+1);assert.equal(state.reservedRewards,0);
  assert.equal(state.trace.filter(t=>t.type==='appraised').length,detections);assert.throws(()=>act(state,'alice',{type:'respond',offerId,accept:true}));
  assert.throws(()=>act(state,'alice',{type:'propose',sellerId:'bob',itemId:peer.stock[0]!,credits:1}));
});
function playRun(count:number,seed:string):AppraisalState {
  let state=createAppraisalRun(Array.from({length:count},(_,i)=>`seat${i}`),seed);
  for(let turn=0;turn<1000 && state.phase!=='RESULTS';turn++) {
    if(state.phase==='REVEAL') {state=advanceAppraisalEncounter(state);continue;}
    const p=state.players.find(s=>!s.paused && !s.done)!;assert(p,'active seat or automatic phase progress');
    if(p.eventOffer) {
      const choices=p.eventOffer.choices;const choice=choices.includes('decline')?'decline':choices.includes('pay')?'pay':choices.includes('oath')?'oath':choices.includes('die')?'die':choices.includes('energy')?'energy':'item';
      state=act(state,p.id,{type:'event',choice,...(choice==='item'?{itemId:p.inventory[0]!}:{})});
    } else if(state.phase==='PORTALS') state=act(state,p.id,{type:'enter',portalId:p.portals.find(v=>!v.disabled)!.id});
    else if(state.phase==='APPRAISAL') {
      const itemId=p.stock.find(id=>!p.valuations[id]);
      if(itemId && !p.caught && p.energy>=3) {
        const item=state.items[itemId]!;const anchor=ITEM_SPECS[item.kind].anchor;
        state=act(state,p.id,{type:'appraise',itemId,value:Math.floor(anchor*.6),acceptDanger:true});
      } else {
        const buy=appraisalViewFor(state,p.id).self.stock.find(item=>p.credits>=item.price)?.id;
        if(buy && p.energy>=1) state=act(state,p.id,{type:'buy',itemIds:[buy],condition:false});else state=act(state,p.id,{type:'done'});
      }
    } else state=act(state,p.id,{type:'done'});
  }
  assert.equal(state.phase,'RESULTS');assertAppraisalInvariants(state);return state;
}
test('2/3/4 seat seeded appraisal runs finish and replay, with tampering rejected',()=>{
  for(const count of [2,3,4]) for(let seed=0;seed<20;seed++) {
    const state=playRun(count,`run-${count}-${seed}`);const audit=exportAppraisalAudit(state);
    assert.deepEqual(replayAppraisalAudit(audit),state);
    assert.equal(state.history.length,count*3);const bad=structuredClone(audit);bad.final[0]!.credits++;
    assert.throws(()=>replayAppraisalAudit(bad));
  }
});
test('bank/prototype seat IDs are rejected and invalid action leaves original state intact',()=>{
  for(const id of ['bank','__proto__','constructor']) assert.throws(()=>createAppraisalRun([id,'seat2'],'seed'));
  const state=fixture();const before=structuredClone(state);assert.throws(()=>act(state,'alice',{type:'buy',itemIds:state.players[1]!.stock,condition:false}));assert.deepEqual(state,before);
});
test('alternative event choices carry their exact costs, protections and penalties',()=>{
  const cases:Array<{id:EventId;choice:string;status?:StatusId;removed?:StatusId;energy?:number}>=[
    {id:'E03',choice:'debt',status:'D10',energy:8},{id:'E06',choice:'seal',status:'D07',removed:'D01'},
    {id:'E10',choice:'fog',status:'D02'},{id:'E11',choice:'force',status:'D01',energy:6},
    {id:'E15',choice:'curse',status:'B02'},{id:'E18',choice:'risk',status:'B04'},
    {id:'E37',choice:'burden',status:'D06'},{id:'E40',choice:'fog',status:'D02'},
    {id:'E42',choice:'cleanse',removed:'D10'},{id:'E49',choice:'oath',status:'D08'},
  ];
  for(const example of cases) {
    let state=fixture(example.id);offerEvent(state,state.players[0]!,example.id);
    state=act(state,'alice',{...eventResponse(state,example.id),choice:example.choice});let p=state.players[0]!;
    if(example.id==='E18') {state=act(state,'alice',{type:'appraise',itemId:p.stock[0]!,value:20});p=state.players[0]!;}
    if(example.status) assert(status(p,example.status),example.id);if(example.removed) assert(!status(p,example.removed),example.id);
    if(example.energy!==undefined) assert.equal(p.energy,example.energy,example.id);
  }
  let state=fixture('E48');let p=state.players[0]!;for(const id of p.inventory) state.items[id]!.owner='removed';p.inventory=[];spend(state,p,p.credits,0,'fixture-empty');
  offerEvent(state,p,'E48');state=act(state,p.id,{type:'event',choice:'energy'});assert.equal(state.players[0]!.energy,5);
  state=fixture('E50');offerEvent(state,state.players[0]!,'E50');assert.throws(()=>act(state,'alice',{type:'event',choice:'decline'}));
  state=act(state,'alice',{type:'event',choice:'die'});assert.equal(state.players[0]!.paused,'dead');assert.throws(()=>act(state,'alice',{type:'done'}));
});
test('old event keys are rejected within the same encounter and failed spending is atomic',()=>{
  let state=fixture('E32');offerEvent(state,state.players[0]!,'E32');const key=state.players[0]!.eventOffer!.key;
  assert.throws(()=>act(state,'alice',{...eventResponse(state,'E32'),key:'previous-event'}));
  spend(state,state.players[0]!,state.players[0]!.credits,0,'fixture-empty');const before=structuredClone(state);
  assert.throws(()=>act(state,'alice',{...eventResponse(state,'E32'),key}));assert.deepEqual(state,before);
  assert.equal(state.items['owned-orb']!.owner,'alice');
});
test('all exhausted seats settle and recover; B09/D04/D05/D07/D10 timing and expiry are explicit',()=>{
  let state=fixture();state.config.freeBuy=false;
  for(const p of state.players) {p.energy=1;grant(state,p,'D10');grant(state,p,'B09');grant(state,p,'D04');grant(state,p,'D07');grant(state,p,'D05');grant(state,p,'B05');}
  state=act(state,'alice',{type:'buy',itemIds:[state.players[0]!.stock[0]!],condition:false});assert.equal(state.players[0]!.paused,'exhausted');
  state=act(state,'bob',{type:'buy',itemIds:[state.players[1]!.stock[0]!],condition:false});assert.equal(state.phase,'REVEAL');
  const credits=state.players.map(p=>p.credits);assert(state.players.every(p=>status(p,'D05')?.charges===1));
  state=advanceAppraisalEncounter(state);assert.equal(state.encounter,2);
  for(const [i,p] of state.players.entries()) {
    assert.equal(p.paused,null);assert.equal(p.energy,4);assert.equal(p.credits,credits[i]!+10-2);
    assert.equal(p.portals.filter(v=>!v.disabled).length,2);assert(!status(p,'D07'));assert(!status(p,'D04'));assert(!status(p,'B09'));assert(!status(p,'B05'));assert.equal(status(p,'D10')!.charges,1);
  }
  for(let steps=0;steps<20 && state.phase!=='REVEAL';steps++) {const p=state.players.find(v=>!v.done && !v.paused)!;state=act(state,p.id,{type:'done'});}
  assert.equal(state.phase,'REVEAL');assert(state.players.every(p=>!status(p,'D05')));
  state=advanceAppraisalEncounter(state);assert(state.players.every(p=>!status(p,'D10')));
});
test('death zeros this encounter without erasing prior scores; all dead seats cannot stall a run',()=>{
  let state=fixture('E50');state.players[0]!.score=11;
  for(const id of ['alice','bob']) {
    const p=state.players.find(v=>v.id===id)!;p.caught=true;p.acceptedDanger=true;offerEvent(state,p,'E50');state=act(state,id,{type:'event',choice:'die'});
  }
  assert.equal(state.phase,'REVEAL');assert(state.history.every(row=>row.score===0));assert.equal(state.players[0]!.score,11);
  state=advanceAppraisalEncounter(state);assert(state.players.every(p=>p.paused===null && p.energy>=4));
});
test('cross-shop sale pays NPC and appraiser once, and insufficient combined funds roll back both',()=>{
  let state=fixture('E47');const stock=state.players[1]!.stock[0]!;
  state=act(state,'alice',{type:'propose',sellerId:'bob',itemId:stock,credits:3});const offer=state.trades.at(-1)!;
  const buyerCredits=state.players[0]!.credits,sellerCredits=state.players[1]!.credits;
  state=act(state,'bob',{type:'respond',offerId:offer.id,accept:true});
  assert.equal(state.players[0]!.credits,buyerCredits-15);assert.equal(state.players[1]!.credits,sellerCredits+3);assert.equal(state.items[stock]!.owner,'alice');
  assert.equal(state.trace.filter(t=>t.type==='appraised').length,0);
  state=fixture('E47');spend(state,state.players[0]!,188,0,'fixture-balance');
  state=act(state,'alice',{type:'propose',sellerId:'bob',itemId:state.players[1]!.stock[0]!,credits:4});const before=structuredClone(state);
  assert.throws(()=>act(state,'bob',{type:'respond',offerId:state.trades.at(-1)!.id,accept:true}));assert.deepEqual(state,before);
});
test('intermittent market draws are seeded, budgeted, reachable, and independent of inventory targeting',()=>{
  let opened=0,closed=0;const counts=new Set<number>();
  for(let i=0;i<200;i++) {
    const a=createAppraisalRun(['a','b','c'],`market-${i}`);const b=createAppraisalRun(['a','b','c'],`market-${i}`);
    assert.deepEqual(a.market,b.market);if(!a.market.open) {closed++;continue;}opened++;counts.add(a.market.orders.length);
    const pool=new Set(Object.values(a.items).map(item=>item.kind));assert(a.market.orders.every(order=>pool.has(order.kind)));
    assert.equal(a.market.budget,a.market.orders.reduce((sum,o)=>sum+(o.price+(o.contract?.bonus.kind==='credits'?o.contract.bonus.amount:0))*3,0));
    assert(a.market.orders.every(o=>o.price>=ITEM_SPECS[o.kind].anchor*1.25-1 && o.price<=ITEM_SPECS[o.kind].anchor*1.75+1));
  }
  assert(opened>40 && opened<160 && closed>0);assert.deepEqual([...counts].sort(),[1,2,3]);
  let state=fixture();for(const p of state.players) p.done=true;
  state.phase='REVEAL';const kept=advanceAppraisalEncounter(state);
  const sold=structuredClone(state);sold.players[0]!.inventory=sold.players[0]!.inventory.filter(id=>id!=='owned-key');sold.items['owned-key']!.owner='removed';
  const afterSale=advanceAppraisalEncounter(sold);assert.deepEqual(afterSale.market,kept.market);
});
test('competing buyers lose stale offers immediately after the first ownership transfer',()=>{
  let state=fixture('E43',3);const itemId='owned-food';
  state=act(state,'alice',{type:'share',itemId,allow:true,purchase:true});
  state=act(state,'bob',{type:'propose',sellerId:'alice',itemId,credits:12});
  state=act(state,'cara',{type:'propose',sellerId:'alice',itemId,credits:15});
  const first=state.trades[0]!,second=state.trades[1]!;
  state=act(state,'alice',{type:'respond',offerId:first.id,accept:true});
  assert.equal(state.trades[1]!.status,'rejected');assert.equal(state.items[itemId]!.owner,'bob');assert.equal(state.players[2]!.credits,200);
  const before=structuredClone(state);assert.throws(()=>act(state,'alice',{type:'respond',offerId:second.id,accept:true}));assert.deepEqual(state,before);
  const audit=simulateAppraisalRun(4,'trader','appraisal-v0.4:4:trader:33');assert.equal(replayAppraisalAudit(audit).phase,'RESULTS');
});
test('NPCs reject a zero appraisal without turning it into a free purchase or exposing reservation',()=>{
  let state=fixture();const itemId=state.players[0]!.stock[0]!;
  state=act(state,'alice',{type:'appraise',itemId,value:0});
  let p=state.players[0]!;assert.equal(p.valuations[itemId]!.accepted,false);
  assert.equal(appraisalViewFor(state,p.id).self.stock[0]!.price,20);
  assert.equal(JSON.stringify(appraisalViewFor(state,p.id)).includes('"reservation"'),false);
  if(p.eventOffer) state=act(state,p.id,{type:'event',choice:'pay'});
  p=state.players[0]!;const credits=p.credits;
  state=act(state,p.id,{type:'buy',itemIds:[itemId],condition:false});assert.equal(state.players[0]!.credits,credits-20+2);
  for(const item of Object.values(createAppraisalRun(['a','b'],'reservation').items)) assert(item.reservation>=1 && item.reservation<=item.ask);
});
