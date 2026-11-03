import test from 'node:test';
import assert from 'node:assert/strict';
import {createAppraisalRun,applyAppraisalAction} from '../src/game/appraisal/engine.js';
import {appraisalViewFor} from '../src/game/appraisal/views.js';
import {personalScoreFor} from '../src/game/appraisal/personal-scoring.js';
import {offerEvent} from '../src/game/appraisal/events.js';
import {grant,reward,inspect} from '../src/game/appraisal/mechanics.js';
import {startTheftDuel,chooseTheftHand} from '../src/game/appraisal/theft.js';
import type {AppraisalState,AppraisalAction,AppraisalItem,Appraiser,EventId,NpcId} from '../src/game/appraisal/types.js';
let seq=0;
function fixture(npc:NpcId='orc'){
 const s=createAppraisalRun(['alice','bob'],'score-review',{personalScoringRules:1,catalogVersion:2,core2:true,secureEconomy:true,npcEvents:true,brokerage:{auctionProbability:.5,maxLots:2,bondProbability:1},survival:{maxLife:6,encounterLifeCost:1,entryEnergyCost:0}});s.phase='APPRAISAL';
 for(const p of s.players){p.eventOffer=null;p.done=false;p.offerSlots=0;p.selectedPortalId=p.portals[0]!.id;p.portals[0]!.npc=npc;p.stock=[...p.portals[0]!.stock];for(const id of p.stock)s.items[id]!.npc=npc;reward(s,p,100,'review-fixture');}
 return s;
}
function owned(s:AppraisalState,p:Appraiser,kind:AppraisalItem['kind']='potion'){
 const source=s.items[p.stock[0]!]!,id=`review-owned-${seq++}`,item={...source,id,kind,owner:p.id,base:20,ask:20,genuine:true,cursed:false,lastAppraisal:null,lastAccepted:null,reservation:1};s.items[id]=item;p.inventory.push(id);return item;
}
function act(s:AppraisalState,body:object,id='alice'){return applyAppraisalAction(s,{...body,playerId:id,requestId:`review-${seq++}`,encounter:s.encounter} as AppraisalAction);}
const metric=(s:AppraisalState,id:string)=>personalScoreFor(s,'alice').metrics.find(m=>m.id===id)!;
function event(s:AppraisalState,id:EventId,choice:string,extra:object={}){offerEvent(s,s.players[0]!,id);return act(s,{type:'event',key:s.players[0]!.eventOffer!.key,choice,...extra});}
for(const id of ['E44','E61'] as const)test(`${id} completed event sale records settled quantity and gross credits`,()=>{
 let s=fixture(id==='E61'?'alien':'orc'),p=s.players[0]!;const item=owned(s,p);owned(s,p,'key');if(id==='E44')s.phase='TRADE';const before=p.credits;
 s=event(s,id,'accept',{itemId:item.id});const paid=s.players[0]!.credits-before;assert(paid>0);assert(!s.players[0]!.inventory.includes(item.id));assert.equal(metric(s,'soldQuantity').eligible,1);assert.equal(metric(s,'soldGrossCredits').eligible,paid);
});
test('exact voluntary NPC life cost counts actual HP without consuming shield or vulnerability',()=>{
 let s=fixture('vampire');grant(s,s.players[0]!,'B19');grant(s,s.players[0]!,'D20');s=event(s,'E109','accept');const p=s.players[0]!;assert.equal(p.life,4);assert(p.statuses.some(s=>s.id==='B19')&&p.statuses.some(s=>s.id==='D20'));assert.equal(metric(s,'lifeLost').eligible,2);
});
test('exact seal life transfer records payer loss and not receiver healing',()=>{
 let s=fixture(),p=s.players[0]!,q=s.players[1]!;q.life=4;owned(s,q);startTheftDuel(s,p,{victimId:q.id});const duel=s.theftDuels!.at(-1)!;chooseTheftHand(s,p,duel.id,'rock');chooseTheftHand(s,q,duel.id,'paper');
 const seal=(s as AppraisalState & {sinnerSeals:{id:string}[]}).sinnerSeals[0]!;s=act(s,{type:'seal-offer',sealId:seal.id,buyerId:p.id,credits:0,energy:0,life:1,goods:0,terms:''},q.id);
 const offer=(s as AppraisalState & {sealOffers:{id:string}[]}).sealOffers.at(-1)!;s=act(s,{type:'seal-respond',offerId:offer.id,accept:true,itemIds:[]});assert.equal(s.players[0]!.life,5);assert.equal(s.players[1]!.life,5);assert.equal(metric(s,'lifeLost').eligible,1);assert.equal(personalScoreFor(s,'bob').metrics.find(m=>m.id==='lifeLost')!.eligible,0);
});
test('paid event inspection records newly learned authenticity, B02 records its additional curse facet',()=>{
 let s=fixture();const id=s.players[0]!.stock[0]!;s=event(s,'E11','careful',{itemId:id});assert.equal(s.players[0]!.knowledge[id]!.genuine,s.items[id]!.genuine);assert.equal(metric(s,'inspection').eligible,1);
 const fresh=fixture(),p=fresh.players[0]!,target=p.stock[0]!;grant(fresh,p,'B02');inspect(fresh,p,target,'authenticity');assert(p.knowledge[target]!.genuine!==undefined&&p.knowledge[target]!.cursed!==undefined);assert.equal(metric(fresh,'inspection').eligible,2);
});
test('inherited identical price range does not become personally learned information',()=>{
 const s=fixture(),p=s.players[0]!,id=p.stock[0]!,probe=structuredClone(s);inspect(probe,probe.players[0]!,id,'price');p.knowledge[id]={range:[...probe.players[0]!.knowledge[id]!.range!]};const before=structuredClone(p.knowledge[id]);inspect(s,p,id,'price');assert.deepEqual(p.knowledge[id],before);assert.equal(metric(s,'inspection').eligible,0);
});
test('positive emergency liquidation counts the actual closed cash sale',()=>{
 let s=fixture(),p=s.players[0]!;const item=owned(s,p),before=p.credits;s=act(s,{type:'liquidate',itemId:item.id});const paid=s.players[0]!.credits-before;assert(paid>0);assert(!s.players[0]!.inventory.includes(item.id));assert.equal(metric(s,'soldQuantity').eligible,1);assert.equal(metric(s,'soldGrossCredits').eligible,paid);
});
test('funded consignment counts closing payout before separate extra fees',()=>{
 let s=fixture(),p=s.players[0]!,id=p.stock[0]!;s.items[id]!.base=40;s.items[id]!.ask=40;s.items[id]!.genuine=true;s.items[id]!.cursed=false;s=act(s,{type:'appraise',itemId:id,value:40});s=act(s,{type:'unsold',itemId:id,choice:'consign'});const paid=s.ledger.filter(e=>e.to==='alice'&&e.reason==='consign-payout').reduce((n,e)=>n+e.amount,0);assert(paid>0);assert.equal(s.items[id]!.owner,'dark-market');assert.equal(metric(s,'soldQuantity').eligible,1);assert.equal(metric(s,'soldGrossCredits').eligible,paid);
});
for(const [name,config]of [['without survival',{personalScoringRules:1}],['without final debt settlement',{personalScoringRules:1,secureEconomy:true,loanEndSettlement:false,survival:{maxLife:6,encounterLifeCost:1,entryEnergyCost:0}}]]as const)test(`scoring v1 rejects incompatible config ${name}`,()=>{
 assert.throws(()=>createAppraisalRun(['alice','bob'],'incompatible',config));const legacy={...config};delete (legacy as {personalScoringRules?:1}).personalScoringRules;assert.doesNotThrow(()=>createAppraisalRun(['alice','bob'],'legacy-compatible',legacy));
});
test('active live wish and Vampire contracts omit private performance identities',()=>{
 const s=fixture('vampire'),p=s.players[0]!;p.wishes={vampire:{kind:'potion',price:20,set:1,performanceId:'private-wish-id'}};p.npcContracts={vampire:{signedAt:1,performanceId:'private-pact-id'}};
 const json=JSON.stringify(appraisalViewFor(s,p.id));assert(!json.includes('performanceId'));assert(!json.includes('private-wish-id'));assert(!json.includes('private-pact-id'));
});
test('B02 personally revealed authenticity and curse are two new scoring facets',()=>{
 const s=fixture(),p=s.players[0]!,id=p.stock[0]!;grant(s,p,'B02');inspect(s,p,id,'authenticity');assert(p.knowledge[id]!.genuine!==undefined&&p.knowledge[id]!.cursed!==undefined);assert.equal(metric(s,'inspection').eligible,2);
});
test('pre-review experimental scoring audits retain exact replay while new rooms select corrected receipt producers',async()=>{
 const fs=await import('node:fs'),{exportAppraisalAudit,replayAppraisalAudit}=await import('../src/game/appraisal/audit.js');
 for(const name of ['personal-scoring-eligibility-2026-11-03/normal-personal/journey.audit.json','personal-scoring-eligibility-2026-11-03/4-players.audit.json']){
  const raw=JSON.parse(fs.readFileSync(new URL('../../../../docs/validation/'+name,import.meta.url),'utf8')),audit=raw.run??raw;assert.deepEqual(exportAppraisalAudit(replayAppraisalAudit(audit)),audit);
 }
 assert.equal((fixture().config as unknown as {personalScoringFacts?:number}).personalScoringFacts,2);
});
test('corrected producer version rejects unsupported markers and markers without scoring',()=>{
 for(const overrides of [{personalScoringFacts:2},{personalScoringRules:1,personalScoringFacts:1},{personalScoringRules:1,personalScoringFacts:3}])assert.throws(()=>createAppraisalRun(['alice','bob'],'bad-producer',overrides as never));
});
test('restored corrected-writer config requires an explicit final debt settlement in secure rooms',async()=>{
 const {restoreAppraisalRun}=await import('../src/game/appraisal/engine.js');const config={...fixture().config};delete config.loanEndSettlement;
 assert.throws(()=>restoreAppraisalRun(['alice','bob'],'missing-final-settlement',config));delete config.personalScoringFacts;assert.doesNotThrow(()=>restoreAppraisalRun(['alice','bob'],'historical-config',config));
});
