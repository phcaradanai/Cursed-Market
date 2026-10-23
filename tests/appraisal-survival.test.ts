import test from 'node:test';
import { dismissEvent } from './event-dismiss.js';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {readFileSync} from 'node:fs';
import {advanceAppraisalEncounter,applyAppraisalAction,appraisalViewFor,assertAppraisalInvariants,createAppraisalRun,exportAppraisalAudit,replayAppraisalAudit,SURVIVAL_RULES} from '../src/game/appraisal/index.js';
import {restoreAppraisalRun} from '../src/game/appraisal/engine.js';
import {damageLife,grant,kill} from '../src/game/appraisal/mechanics.js';
import {offerEvent} from '../src/game/appraisal/events.js';
import type {AppraisalAction,AppraisalState,ItemKind} from '../src/game/appraisal/types.js';
import type {AppraisalRoomView,AppraisalServerMessage,AppraisalTimerSettings} from '../src/shared/appraisal-protocol.js';
import {AppraisalRoomService} from '../src/server/appraisal-rooms.js';
import {parseAppraisalMessage} from '../src/server/appraisal-messages.js';
import {App,GameTable,SurvivalResults} from '../src/appraisal-client/App.js';
import {AppraisalDesk,Contract,EventDecision,Statuses,TradeListing} from '../src/appraisal-client/components.js';
import {eventScoreText} from '../src/appraisal-client/model.js';
import {analyseAppraisalMatchAudit} from '../src/playtest/appraisal-report.js';
import {simulateAppraisalRun,APPRAISAL_POLICIES} from '../src/simulation/appraisal.js';
import {APPRAISAL_BOT_POLICIES} from '../src/shared/appraisal-protocol.js';

type Body=AppraisalAction extends infer A?A extends AppraisalAction?Omit<A,'playerId'|'requestId'|'encounter'>:never:never;
let request=0;
function act(s:AppraisalState,id:string,body:Body):AppraisalState{return applyAppraisalAction(s,{...body,playerId:id,requestId:`survival-${++request}`,encounter:s.encounter} as AppraisalAction);}
function fixture(life=6):AppraisalState {
  const s=createAppraisalRun(['alice','bob'],'survival-fixture',{survival:{...SURVIVAL_RULES,maxLife:life},marketProbability:0,freeMerchantAction:false});
  for(const p of s.players){p.eventOffer=null;p.offerSlots=2;}
  return s;
}
function enter(s:AppraisalState):AppraisalState {
  for(const p of s.players.filter(p=>!p.paused))s=act(s,p.id,{type:'enter',portalId:p.portals[0]!.id});
  return s;
}
function end(s:AppraisalState):AppraisalState {
  for(let i=0;i<20 && !['REVEAL','RESULTS'].includes(s.phase);i++){
    const p=s.players.find(p=>!p.paused&&!p.done);assert(p);s=act(s,p.id,{type:'done'});
  }
  assert(['REVEAL','RESULTS'].includes(s.phase));return s;
}
function finish(s:AppraisalState):AppraisalState {
  for(let i=0;i<200 && s.phase!=='RESULTS';i++)s=s.phase==='REVEAL'?advanceAppraisalEncounter(s):end(s);
  assert.equal(s.phase,'RESULTS');return s;
}
function own(s:AppraisalState,id:string,kind:ItemKind='mirror',genuine=true,cursed=false,base=20):string {
  const p=s.players.find(p=>p.id===id)!;const itemId=`held-${id}-${p.inventory.length}`;
  s.items[itemId]={id:itemId,kind,base,genuine,cursed,ask:base,owner:id,npcOwnerId:id,npc:'orc',encounter:s.encounter,certificate:false,lastAppraisal:null,lastAccepted:null,reservation:1};p.inventory.push(itemId);return itemId;
}
function view(s:AppraisalState,id='alice'):AppraisalRoomView {
  return {rulesVersion:'0.5',mode:s.config.survival?'survival':'classic',code:'ABC234',hostId:'alice',yourSeatId:id,seats:s.players.map(p=>({id:p.id,name:p.id,ready:true,connected:true})),matchSeats:s.players.map(p=>({id:p.id,name:p.id})),playtestMode:'no-voice',matchId:'survival-ui',deadline:null,serverTime:0,revealReady:[],timerSettings:{enabled:false,durationsMs:{PORTALS:30000,APPRAISAL:90000,TRADE:45000,REVEAL:4000}},game:appraisalViewFor(s,id)};
}
class Peer {close(){} messages:AppraisalServerMessage[]=[];send(m:AppraisalServerMessage){this.messages.push(m);}get room(){const m=this.messages.findLast(m=>m.type==='state');assert(m?.type==='state');return m.room;}get joined(){const m=this.messages.findLast(m=>m.type==='joined');assert(m?.type==='joined');return m;}}

test('v0.5 keeps life separate, starts without entry energy and validates survival config while v0.4 is unchanged',()=>{
  const old=createAppraisalRun(['alice','bob'],'old');assert.equal(old.version,4);assert.equal(old.players[0]!.life,undefined);
  const s=fixture();assert.equal(s.version,5);assert.equal(s.players[0]!.life,6);assert.equal(s.players[0]!.energy,10);assert.equal(appraisalViewFor(s,'alice').encounterCount,null);
  for(const survival of [null,false,{...SURVIVAL_RULES,maxLife:0},{...SURVIVAL_RULES,encounterLifeCost:0},{...SURVIVAL_RULES,extra:1},{...SURVIVAL_RULES,entryEnergyCost:11}])assert.throws(()=>createAppraisalRun(['a','b'],'bad',{survival:survival as never}));
});
test('spending last energy does not pause, zero-energy actions fail atomically and free decisions remain legal',()=>{
  let s=enter(fixture());s.players[0]!.energy=1;
  s=act(s,'alice',{type:'inspect',itemId:s.players[0]!.stock[0]!,property:'authenticity'});
  assert.equal(s.players[0]!.energy,0);assert.equal(s.players[0]!.paused,null);assert.equal(s.players[0]!.life,6);
  const before=structuredClone(s);assert.throws(()=>act(s,'alice',{type:'appraise',itemId:s.players[0]!.stock[0]!,value:10}));assert.deepEqual(s,before);
  const itemId=own(s,'alice');s=act(s,'alice',{type:'share',itemId,allow:true,purchase:true});assert.equal(s.listings.length,1);
  s=end(s);s=advanceAppraisalEncounter(s);assert.equal(s.players[0]!.energy,0);assert.equal(s.players[0]!.paused,null);
  while(s.players[0]!.eventOffer)s=act(s,'alice',{type:'done'});
  if(!s.players[0]!.done)s=act(s,'alice',{type:'enter',portalId:s.players[0]!.portals[0]!.id});
  assert.equal(s.players[0]!.life,5);
});
for(const target of ['energy','life'] as const)test(`NPC ${target} recovery is available at zero energy, costs credits once and retry is idempotent`,()=>{
  let s=fixture();const p=s.players[0]!;const chosen=p.portals.find(portal=>['vampire','autometa','alien'].includes(portal.npc)===(target==='energy'))!;assert(chosen);
  s=act(s,'alice',{type:'enter',portalId:chosen.id});s=act(s,'bob',{type:'enter',portalId:s.players[1]!.portals[0]!.id});
  s.players[0]!.energy=0;s.players[0]!.life=3;s.players[0]!.npcTrust={...s.players[0]!.npcTrust,[chosen.npc]:3};const offer=appraisalViewFor(s,'alice').self.recoveryOffer!;assert.equal(offer.target,target);
  const command={type:'recover-resource',target,playerId:'alice',requestId:'recover-once',encounter:1} as const;
  const before=s.players[0]!.credits;s=applyAppraisalAction(s,command);assert.equal(s.players[0]!.credits,before-offer.credits);assert.equal(target==='life'?s.players[0]!.life:s.players[0]!.energy,target==='life'?s.players[0]!.life:3);if(target==='life')assert([5,6].includes(s.players[0]!.life!),'trust 3 deal restores 2-3');
  assert.equal(applyAppraisalAction(s,command),s);assert.throws(()=>act(s,'alice',{type:'recover-resource',target}));
  const wrong=structuredClone(s);wrong.players[0]!.recoveryUsed=false;assert.throws(()=>act(wrong,'alice',{type:'recover-resource',target:target==='life'?'energy':'life'}));
});
test('zero-energy vampire blood pact restores energy but costs life and cannot resurrect a dead player',()=>{
  let s=enter(fixture());const p=s.players[0]!;p.energy=0;p.life=1;p.offerSlots=0;s.items[p.stock[0]!]!.npc='vampire';offerEvent(s,p,'E03');
  s=act(s,p.id,{type:'event',key:p.eventOffer!.key,choice:'debt'});assert.equal(s.players[0]!.energy,1);assert.equal(s.players[0]!.life,0);assert.equal(s.players[0]!.paused,'dead');
  assert.throws(()=>act(s,p.id,{type:'recover-resource',target:'life'}));
});
for(const [genuine,cursed,life] of [[true,false,4],[false,false,2],[true,true,3],[false,true,1]] as const)test(`restorative consumable authenticity=${genuine} curse=${cursed} applies distinct life effects`,()=>{
  let s=enter(fixture());s.players[0]!.life=2;const item=own(s,'alice','potion',genuine,cursed);
  s=act(s,'alice',{type:'activate',itemId:item});assert.equal(s.players[0]!.life,life);assert.equal(s.items[item]!.owner,'removed');assert(!s.players[0]!.inventory.includes(item));
});
test('death is permanent, freezes owned property/statuses and survivors continue past it',()=>{
  let s=fixture(3);const item=own(s,'alice');grant(s,s.players[0]!,'B10');kill(s,s.players[0]!);
  s=end(s);assert.equal(s.phase,'REVEAL');assert.equal(s.players[1]!.life,2);assert.equal(s.collector,undefined);
  s=advanceAppraisalEncounter(s);assert.equal(s.players[0]!.life,0);assert.equal(s.players[0]!.paused,'dead');assert.equal(s.items[item]!.owner,'alice');assert.equal(s.players[0]!.statuses[0]!.expires,1);assertAppraisalInvariants(s);
  assert.throws(()=>act(s,'alice',{type:'done'}));assert.equal(appraisalViewFor(s,'alice').collector,undefined);
  s=finish(s);assert.equal(s.collector!.find(r=>r.playerId==='alice')!.score,72);
});
test('all dead invokes Collector once: true/fake/cursed values plus credits and score statuses, without history bonuses',()=>{
  let s=fixture(1);
  for(const p of s.players){own(s,p.id,'mirror',true,false);own(s,p.id,'mirror',false,false);own(s,p.id,'mirror',true,true);own(s,p.id,'mirror',false,true);p.accuracyBonus=999;}
  grant(s,s.players[0]!,'B10');grant(s,s.players[1]!,'D10');s=end(s);
  assert.equal(s.phase,'RESULTS');assert.deepEqual(s.collector!.map(r=>[r.itemValue,r.credits,r.modifierPercent,r.score]),[[43,40,20,99],[43,40,-20,66]]);
  assert(s.history.every(row=>row.score===0));assert(s.players.every(p=>p.inventory.length===0 && p.life===0));assert(s.collector!.every(r=>r.items.every(i=>s.items[i.id]!.owner==='collector')));
  assert.throws(()=>advanceAppraisalEncounter(s));assert.throws(()=>act(s,'alice',{type:'done'}));assertAppraisalInvariants(s);
});
test('score buff and debuff cancel and Collector handles zero inventory and tied credit scores',()=>{
  let s=fixture(1);grant(s,s.players[0]!,'B10');grant(s,s.players[0]!,'D10');s=end(s);
  assert.deepEqual(s.collector!.map(r=>r.score),[40,40]);assert.equal(s.collector![0]!.modifierPercent,0);
});
test('a complete command-only survival run exceeds three encounters, drains life and strictly replays',()=>{
  const s=finish(createAppraisalRun(['alice','bob'],'survival-full',{survival:SURVIVAL_RULES}));
  assert.equal(s.encounter,6);assert(s.players.every(p=>p.life===0));assert(!s.trace.some(t=>t.type==='energy-spent' && t.details.reason==='encounter-entry'));
  const audit=exportAppraisalAudit(s);assert.equal(audit.schemaVersion,5);assert.deepEqual(replayAppraisalAudit(audit),s);
  for(const mutate of [(a:typeof audit)=>{a.schemaVersion=4;},(a:typeof audit)=>{a.collector![0]!.score++;},(a:typeof audit)=>{a.final[0]!.life=1;},(a:typeof audit)=>{a.items[a.collector![0]!.items[0]?.id??Object.keys(a.items)[0]!]!.base++;}]){const bad=structuredClone(audit);mutate(bad);assert.throws(()=>replayAppraisalAudit(bad));}
});
test('parser accepts late encounters and recovery but rejects actor/target injections and unsafe numbers',()=>{
  assert.equal(parseAppraisalMessage({type:'action',matchId:'m',action:{type:'recover-resource',target:'energy',requestId:'r',encounter:99}}).type,'action');
  for(const patch of [{playerId:'bob'},{target:'credits'},{life:999},{encounter:0},{encounter:Number.MAX_SAFE_INTEGER+1}])assert.throws(()=>parseAppraisalMessage({type:'action',matchId:'m',action:{type:'recover-resource',target:'energy',requestId:'r',encounter:1,...patch}}));
});
test('v0.4 historical audits still replay with their exact old shape and scoring',()=>{
  for(const file of ['docs/simulation/appraisal-delivery-v0.4/example-run.json','docs/simulation/appraisal-catalog-v0.4/example-run.json']){
    const audit=JSON.parse(readFileSync(file,'utf8'));assert.deepEqual(exportAppraisalAudit(replayAppraisalAudit(audit)),audit);
  }
});
for(const policy of ['cautious','aggressive','collector','trader'] as const)test(`survival ${policy} reads only DTOs and completes strict seeded replay`,()=>{
  const audit=simulateAppraisalRun(3,policy,`survival-${policy}`,{survival:SURVIVAL_RULES});assert.equal(audit.schemaVersion,5);assert(audit.final.every(p=>p.life===0) || Math.max(...audit.history.map(row=>row.encounter))===audit.config.collectorDeadline,'the run ends when every life is gone or the Collector deadline arrives');assert.equal(replayAppraisalAudit(audit).phase,'RESULTS');
});
for(const enabled of [true,false])test(`room death/resume/reveal/final audit/rematch with timers ${enabled}`,()=>{
  let now=0;const service=new AppraisalRoomService(()=>now,{},undefined,{survival:{...SURVIVAL_RULES,maxLife:2}});const host=new Peer(),guest=new Peer();
  service.handle(host,{type:'create',name:'Alice'});service.handle(guest,{type:'join',roomCode:host.room.code,name:'Bob'});
  const settings:AppraisalTimerSettings={enabled,durationsMs:{PORTALS:1000,APPRAISAL:1000,TRADE:1000,REVEAL:1000}};
  service.handle(host,{type:'timer-settings',settings});service.handle(host,{type:'ready',ready:true});service.handle(guest,{type:'ready',ready:true});service.handle(host,{type:'start'});
  const seat=host.joined.seatId;const room=(service as unknown as {rooms:Map<string,{game:AppraisalState}>}).rooms.get(host.room.code)!;
  // Controlled death fixture verifies spectator gating; real command-only runs cover audit replay below.
  damageLife(room.game,room.game.players.find(p=>p.id===seat)!,2,'test-death');
  while(!['REVEAL','RESULTS'].includes(room.game.phase))service.handle(guest,{type:'action',matchId:guest.room.matchId!,action:{type:'done',requestId:`room-${++request}`,encounter:guest.room.game!.encounter}});
  assert.equal(guest.room.game!.phase,'REVEAL');service.disconnect(host);service.handle(guest,{type:'reveal-ready',matchId:guest.room.matchId!,encounter:1});assert.equal(guest.room.game!.encounter,2);
  const resumed=new Peer();service.handle(resumed,{type:'resume',roomCode:guest.room.code,token:host.joined.token});assert.equal(resumed.room.game!.self.life,0);assert.equal(resumed.room.game!.self.paused,'dead');
  service.handle(resumed,{type:'action',matchId:resumed.room.matchId!,action:{type:'done',requestId:'dead-action',encounter:2}});assert.equal(resumed.messages.at(-1)!.type,'error');
  if(!enabled){now+=100000;service.tick();assert.equal(guest.room.game!.phase,'PORTALS');}
  while(String(guest.room.game!.phase)!=='RESULTS')service.handle(guest,{type:'action',matchId:guest.room.matchId!,action:{type:'done',requestId:`room-${++request}`,encounter:guest.room.game!.encounter}});
  assert.equal(guest.room.game!.self.life,0);assert.equal(guest.room.game!.collector!.length,2);
  service.handle(guest,{type:'rematch'});assert.equal(guest.room.game,null);assert.deepEqual(guest.room.timerSettings,settings);assert.equal(guest.room.rulesVersion,'0.5');
});
for(const count of [2,3,4])test(`canonical ${count}-seat room audit reaches Collector and validates factual metadata`,()=>{
  const service=new AppraisalRoomService(()=>0,{},undefined,{survival:SURVIVAL_RULES});const peers=Array.from({length:count},()=>new Peer()),host=peers[0]!;
  service.handle(host,{type:'create',name:'Host'});for(const peer of peers.slice(1))service.handle(peer,{type:'join',roomCode:host.room.code,name:'Appraiser'});
  service.handle(host,{type:'timer-settings',settings:{enabled:false,durationsMs:{PORTALS:1000,APPRAISAL:1000,TRADE:1000,REVEAL:1000}}});
  for(const peer of peers)service.handle(peer,{type:'ready',ready:true});service.handle(host,{type:'start'});
  for(let i=0;i<200 && host.room.game!.phase!=='RESULTS';i++){
    if(host.room.game!.phase==='REVEAL'){for(const peer of peers.filter(p=>p.room.game!.self.life!>0))service.handle(peer,{type:'reveal-ready',matchId:peer.room.matchId!,encounter:peer.room.game!.encounter});}
    else {const peer=peers.find(p=>!p.room.game!.self.paused&&!p.room.game!.self.done)!;assert(peer);service.handle(peer,{type:'action',matchId:peer.room.matchId!,action:{type:'done',requestId:`canonical-${++request}`,encounter:peer.room.game!.encounter}});}
  }
  assert.equal(host.room.game!.phase,'RESULTS');service.handle(host,{type:'audit',matchId:host.room.matchId!});const message=host.messages.findLast(m=>m.type==='audit');assert(message?.type==='audit');
  const metrics=analyseAppraisalMatchAudit(message.audit);assert.equal(metrics.playerCount,count);assert.equal(metrics.encounters,6);assert(metrics.collector?.every(row=>row.score===100));
  const forged=structuredClone(message.audit);forged.schemaVersion=4;assert.throws(()=>analyseAppraisalMatchAudit(forged));
});
test('survival SSR distinguishes zero energy from death and exposes Collector credit/item/modifier results',()=>{
  let s=enter(fixture());s.players[0]!.energy=0;
  let html=renderToStaticMarkup(createElement(GameTable,{room:view(s),submit:()=>{},send:()=>true,disabled:false}));assert(html.includes('พลัง 0 ยังเล่นต่อได้'));assert(html.includes('ชีวิต'));assert(!html.includes('พักเฉพาะช่วงนั้น'));assert(!html.includes('ได้ 5 คะแนนต่อชิ้น'));
  const item=s.players[0]!.stock[0]!;s.items[item]!.npc='darkone';
  html=renderToStaticMarkup(createElement(AppraisalDesk,{game:appraisalViewFor(s,'alice'),item:appraisalViewFor(s,'alice').self.stock[0]!,submit:()=>{},disabled:false}));assert(html.includes('เป็นผู้ชมจนจบ run'));
  s.players[0]!.caught=true;s.players[0]!.acceptedDanger=true;s.players[0]!.offerSlots=0;offerEvent(s,s.players[0]!,'E50');
  html=renderToStaticMarkup(createElement(EventDecision,{game:appraisalViewFor(s,'alice'),offer:s.players[0]!.eventOffer!,submit:()=>{},disabled:false}));assert(!html.includes('พักช่วงนี้'));assert(html.includes('ผู้ชมจนจบ run'));
  kill(s,s.players[0]!);grant(s,s.players[0]!,'B10');s=end(s);s=advanceAppraisalEncounter(s);
  html=renderToStaticMarkup(createElement(Statuses,{game:appraisalViewFor(s,'alice')}));assert(html.includes('ไม่เดินอายุต่อหลังตาย'));
  html=renderToStaticMarkup(createElement(GameTable,{room:view(s),submit:()=>{},send:()=>true,disabled:false}));assert(html.includes('คุณเป็นผู้ชม'));assert(!html.includes('เปิดประตูนี้'));
  s=finish(s);html=renderToStaticMarkup(createElement(SurvivalResults,{room:view(s),send:()=>true,disabled:false}));assert(html.includes('Collector มารับของ'));assert(html.includes('เครดิต'));assert(html.includes('ผลคะแนน'));assert(html.includes('ผู้ได้คะแนนสูงสุด'));
});
test('F1 score effects are disclosed in D10 direct/cross-shop/E08 contracts and B10/D10 event choices',()=>{
  const s=enter(fixture());const p=s.players[0]!,peer=s.players[1]!;
  for(const id of [...p.stock,...peer.stock])s.items[id]!.npc='vampire';
  let game=appraisalViewFor(s,'alice'),item=game.self.stock[0]!;
  let html=renderToStaticMarkup(createElement(Contract,{item,condition:true,setCondition:()=>{},disabled:false,survival:true}));assert(html.includes('ลดคะแนนรวม 20%'));assert(html.includes('หากสถานะยังอยู่เมื่อตาย'));
  html=renderToStaticMarkup(createElement(Contract,{item,condition:true,setCondition:()=>{},disabled:false}));assert(!html.includes('Collector'));
  html=renderToStaticMarkup(createElement(AppraisalDesk,{game,item,submit:()=>{},disabled:false}));assert(html.includes('ลดคะแนนรวม 20%'));
  s.phase='TRADE';s.listings=[{ownerId:peer.id,itemId:peer.stock[0]!,purchase:true}];peer.valuations[peer.stock[0]!]={value:20,accuracy:false,caught:false,accepted:true};
  game=appraisalViewFor(s,'alice');html=renderToStaticMarkup(createElement(TradeListing,{game,listing:game.listings[0]!,room:view(s),submit:()=>{},disabled:false}));assert(html.includes('ลดคะแนนรวม 20%'));
  // E08 only exists under the original event choices.
  const portal=fixture();delete portal.config.eventChoiceRules;portal.players[0]!.offerSlots=0;portal.players[0]!.portals[1]!.npc='vampire';offerEvent(portal,portal.players[0]!,'E08');
  html=renderToStaticMarkup(createElement(EventDecision,{game:appraisalViewFor(portal,'alice'),offer:portal.players[0]!.eventOffer!,submit:()=>{},disabled:false}));assert(html.includes('ลดคะแนนรวม 20%'));
  for(const id of ['E23','E34','E39','E42','E41'] as const){
    const event=enter(fixture());const actor=event.players[0]!;actor.offerSlots=0;
    if(id==='E34'){own(event,'alice','mask');grant(event,actor,'B03');}
    if(id==='E39')own(event,'alice','blade');
    if(['E42','E41'].includes(id)){grant(event,actor,'D10');actor.energy=0;}
    offerEvent(event,actor,id);const projected=appraisalViewFor(event,'alice');
    html=renderToStaticMarkup(createElement(EventDecision,{game:projected,offer:actor.eventOffer!,submit:()=>{},disabled:false}));assert(html.includes('Collector'),id);
    if(id==='E42'){assert(eventScoreText(projected,actor.eventOffer!,'cleanse').includes('เอาผล Collector −20% ออก'));assert(eventScoreText(projected,actor.eventOffer!,'energy').includes('สิทธิ์สุดท้าย'));}
  }
  html=renderToStaticMarkup(createElement(GameTable,{room:view(s),submit:()=>{},send:()=>true,disabled:false}));assert(html.includes('คนกลาง'));assert(!html.includes('เจรจาทวีคูณ'));
});
test('F2 command-only privacy: hidden wealth/accuracy stay private through appraisal, reveal, advance and spectator views',()=>{
  // The seeded path below was recorded under the original event choices; this test is about privacy, not choices.
  const legacy=structuredClone(createAppraisalRun(['a','b'],'history-review-7',{survival:SURVIVAL_RULES,catalogVersion:2}).config);delete legacy.eventChoiceRules;
  const initial=restoreAppraisalRun(['a','b'],'history-review-7',legacy);
  let s=initial;
  for(const id of ['a','b']){
    const p=s.players.find(p=>p.id===id)!;
    if(p.eventOffer)s=act(s,id,{type:'event',key:p.eventOffer.key,...dismissEvent(p.eventOffer)});
    s=act(s,id,{type:'enter',portalId:s.players.find(p=>p.id===id)!.portals[0]!.id});
  }
  for(const id of ['a','b']){const p=s.players.find(p=>p.id===id)!;if(p.eventOffer)s=act(s,id,{type:'event',key:p.eventOffer.key,...dismissEvent(p.eventOffer)});}
  const stock=s.players[0]!.stock[0]!;assert.equal(stock,'item-1-0-0-0');
  let accuracy=act(s,'a',{type:'appraise',itemId:stock,value:37,acceptDanger:true});assert.equal(accuracy.players[0]!.accuracyBonus,5);
  for(const id of ['a','b']){const projected=appraisalViewFor(accuracy,id);assert.equal(projected.self.accuracyBonus,0);assert.deepEqual(projected.history,[]);assert.equal(projected.collector,undefined);}
  accuracy=finish(accuracy);replayAppraisalAudit(exportAppraisalAudit(accuracy));
  s=act(s,'a',{type:'buy',itemIds:[stock],condition:false});assert.equal(s.players[0]!.credits,5);
  s=end(s);assert.equal(s.phase,'REVEAL');assert.equal(s.history.find(row=>row.playerId==='a')!.gain,2);
  for(const id of ['a','b']){const projected=appraisalViewFor(s,id);assert.deepEqual(projected.history,[]);assert.equal(projected.self.accuracyBonus,0);assert.equal(projected.collector,undefined);}
  s=advanceAppraisalEncounter(s);assert.deepEqual(appraisalViewFor(s,'b').history,[]);
  const spectator=structuredClone(s);kill(spectator,spectator.players[1]!);assert.deepEqual(appraisalViewFor(spectator,'b').history,[]);
  s=finish(s);const projected=appraisalViewFor(s,'b');assert(projected.collector!.find(row=>row.playerId==='a')!.items.some(item=>item.id===stock && item.value===37));assert.deepEqual(projected.history,s.history);replayAppraisalAudit(exportAppraisalAudit(s));
});
test('roster reports reveal confirmation, not the stale trade flag, and drops death badges at Collector results',()=>{
  let s=end(fixture());assert.equal(s.phase,'REVEAL');
  const ids=s.players.map(p=>p.id);
  let html=renderToStaticMarkup(createElement(GameTable,{room:{...view(s),revealReady:[ids[0]!]},submit:()=>{},send:()=>true,disabled:false}));
  assert(html.includes(`${ids[0]} · คุณ · พร้อมไปต่อแล้ว`));assert(html.includes(`${ids[1]} · รอยืนยันไปต่อ`));assert(!html.includes('· จบช่วงนี้แล้ว'));
  s=finish(s);html=renderToStaticMarkup(createElement(GameTable,{room:view(s),submit:()=>{},send:()=>true,disabled:false}));
  assert(html.includes('จบการเดินทาง'));assert(!html.includes('ผู้ชม · ชีวิตหมด'));assert(!html.includes('undefined'));
});

test('new rooms start in Survival without a mode choice and reject classic clients',()=>{
  const service=new AppraisalRoomService(()=>0);const host=new Peer(),guest=new Peer();
  service.handle(host,{type:'create',name:'Alice'});service.handle(guest,{type:'join',roomCode:host.room.code,name:'Bob'});
  assert.equal(host.room.mode,'survival');assert.equal(host.room.rulesVersion,'0.5');
  service.handle(guest,{type:'rules-mode',mode:'classic'});assert.equal(guest.messages.at(-1)!.type,'error');
  service.handle(guest,{type:'ready',ready:true});
  service.handle(host,{type:'rules-mode',mode:'classic'});
  assert.equal(host.messages.at(-1)!.type,'error');assert.equal(host.room.mode,'survival');
  assert(host.room.seats.find(s=>s.id===guest.room.yourSeatId)!.ready,'a rejected legacy selector must not clear readiness');
  service.handle(host,{type:'start'});
  assert.equal(host.room.game!.self.life,SURVIVAL_RULES.maxLife);
  service.handle(host,{type:'rules-mode',mode:'classic'});assert.equal(host.messages.at(-1)!.type,'error');assert.equal(host.room.mode,'survival');
});
test('explicit legacy service configurations preserve classic games',()=>{
  const service=new AppraisalRoomService(()=>0,{},undefined,{});const host=new Peer(),guest=new Peer();
  service.handle(host,{type:'create',name:'A'});service.handle(guest,{type:'join',roomCode:host.room.code,name:'B'});
  assert.equal(host.room.mode,'classic');service.handle(guest,{type:'ready',ready:true});service.handle(host,{type:'start'});
  assert.equal(host.room.game!.self.life,undefined);
});
test('entry explains Survival directly without a mode selector or comparison',()=>{
  const entry=renderToStaticMarkup(createElement(App));
  for(const text of ['เลือกโหมดเกม','เปรียบเทียบกติกาสองโหมด','โหมดเกมที่เลือกได้','โหมดปกติ'])assert(!entry.includes(text),text);
  assert(entry.includes('Collector'));assert(entry.includes('พลังไม่ใช่ชีวิต'));
});
for(const mode of ['classic','survival'] as const)test(`solo ${mode} room: a host plus bots plays a full replayable match`,()=>{
  const service=new AppraisalRoomService(()=>0,{},undefined,mode==='survival'?{survival:SURVIVAL_RULES}:{});const host=new Peer();
  service.handle(host,{type:'create',name:'Solo'});
  service.handle(host,{type:'ready',ready:true});service.handle(host,{type:'start'});assert.equal(host.messages.at(-1)!.type,'error','one seat alone cannot start');
  assert.equal(host.room.mode,mode);
  service.handle(host,{type:'add-bot',policy:'cautious'});service.handle(host,{type:'add-bot',policy:'trader'});
  assert.deepEqual(host.room.seats.map(s=>s.bot??null),[null,'cautious','trader']);assert(host.room.seats.slice(1).every(s=>s.ready&&s.connected));
  service.handle(host,{type:'ready',ready:true});service.handle(host,{type:'start'});assert.equal(host.room.game!.players.length,3);
  for(let i=0;i<400 && host.room.game!.phase!=='RESULTS';i++){
    const g=host.room.game!;
    if(g.phase==='REVEAL')service.handle(host,{type:'reveal-ready',matchId:host.room.matchId!,encounter:g.encounter});
    else if(!g.self.paused && !g.self.done)service.handle(host,{type:'action',matchId:host.room.matchId!,action:{type:'done',requestId:`solo-${i}`,encounter:g.encounter}});
    else service.handle(host,{type:'reveal-ready',matchId:host.room.matchId!,encounter:g.encounter});
    if(host.messages.at(-1)!.type==='error' && i>399)break;
  }
  assert.equal(host.room.game!.phase,'RESULTS');
  service.handle(host,{type:'audit',matchId:host.room.matchId!});const audit=host.messages.findLast(m=>m.type==='audit') as unknown as {audit:{run:Parameters<typeof replayAppraisalAudit>[0]}};
  assert.equal(replayAppraisalAudit(audit.audit.run).phase,'RESULTS');
  service.handle(host,{type:'rematch'});assert(host.room.seats.filter(s=>s.bot).every(s=>s.ready),'bots stay ready after a rematch');
  service.handle(host,{type:'remove-bot',seatId:host.room.seats[1]!.id});assert.equal(host.room.seats.length,2);
});
test('only the host adds bots before the match, up to four seats, and bot styles match the simulation',()=>{
  const service=new AppraisalRoomService(()=>0);const host=new Peer(),guest=new Peer();
  service.handle(host,{type:'create',name:'A'});service.handle(guest,{type:'join',roomCode:host.room.code,name:'B'});
  service.handle(guest,{type:'add-bot',policy:'cautious'});assert.equal(guest.messages.at(-1)!.type,'error');
  service.handle(host,{type:'add-bot',policy:'aggressive'});service.handle(host,{type:'add-bot',policy:'collector'});assert.equal(host.room.seats.length,4);
  service.handle(host,{type:'add-bot',policy:'trader'});assert.equal(host.messages.at(-1)!.type,'error');
  assert.throws(()=>service.receive(host,{type:'add-bot',policy:'nonsense'}));
  assert.deepEqual([...APPRAISAL_BOT_POLICIES],[...APPRAISAL_POLICIES]);
});
