import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { advanceAppraisalEncounter, applyAppraisalAction, appraisalViewFor, assertAppraisalInvariants, createAppraisalRun, SURVIVAL_RULES } from '../src/game/appraisal/index.js';
import { eventEligible, offerEvent } from '../src/game/appraisal/events.js';
import { grant, maxEnergyOf, npcQuote, purchase, status, wealth } from '../src/game/appraisal/mechanics.js';
import { NPC_PERSONAL_EVENT, redeemNpcContracts } from '../src/game/appraisal/npc-events.js';
import { collectRun } from '../src/game/appraisal/survival.js';
import { NPC_EVENT_IDS } from '../src/game/appraisal/types.js';
import type { AppraisalAction, AppraisalState, EventId, NpcId } from '../src/game/appraisal/types.js';
import { collectorEstimate, eventDecision, eventNeeds, eventNeedsItem, eventNeedsStatus, eventStatusOptions, outcomeBetween, purchasePrice } from '../src/appraisal-client/model.js';
import { EventDecision } from '../src/appraisal-client/components.js';
import { NpcContracts } from '../src/appraisal-client/NpcContracts.js';
import { Toasts } from '../src/appraisal-client/feedback.js';
import { GameTable } from '../src/appraisal-client/App.js';
import type { AppraisalRoomView } from '../src/shared/appraisal-protocol.js';
import { parseAppraisalMessage } from '../src/server/appraisal-messages.js';
import { simulateAppraisalRun } from '../src/simulation/appraisal.js';
import { appraisalFixture } from './support/appraisal-fixture.js';

type Body=AppraisalAction extends infer A ? A extends AppraisalAction ? Omit<A,'playerId'|'requestId'|'encounter'> : never : never;
let request=0;
const act=(state:AppraisalState,body:Body)=>applyAppraisalAction(state,{...body,playerId:'alice',requestId:`npc-${++request}`,encounter:state.encounter} as AppraisalAction);
function table(npc:NpcId='alien',seed='npc-events'):AppraisalState {
  const s=appraisalFixture();s.seed=seed;s.config.npcEvents=true;s.config.survival=SURVIVAL_RULES;s.version=5;
  for(const p of s.players){p.life=6;p.selectedPortalId=p.portals[0]!.id;p.portals[0]!.npc=npc;for(const id of p.stock)s.items[id]!.npc=npc;}
  return s;
}
function open(npc:NpcId,seed='npc-events') {const s=table(npc,seed);offerEvent(s,s.players[0]!,NPC_PERSONAL_EVENT[npc]);return s;}
function resolve(s:AppraisalState,choice='accept',extra:Partial<Extract<Body,{type:'event'}>>={}){return act(s,{type:'event',key:s.players[0]!.eventOffer!.key,choice,...extra});}
function alienThree(){for(let i=0;i<60;i++){const s=open('alien',`loan-${i}`);if(s.players[0]!.eventOffer!.npcTerms!.loanMax===3)return s;}throw new Error('missing three-item loan');}
function loan(count=3){const s=alienThree(),ids=s.players[0]!.eventOffer!.itemIds.slice(0,count);return {s:resolve(s,`lend-${count}`,{itemIds:ids}),ids};}

test('all eight merchants have an exclusive optional personal event; historical rooms keep them out',()=>{
  assert.equal(new Set(Object.values(NPC_PERSONAL_EVENT)).size,8);
  for(const [npc,id] of Object.entries(NPC_PERSONAL_EVENT) as [NpcId,EventId][]){
    const s=open(npc);assert(s.players[0]!.eventOffer!.choices.includes('decline'));assert(eventEligible(s,s.players[0]!,id));
    const before=structuredClone(s.players[0]!);const declined=resolve(s,'decline').players[0]!;assert.equal(declined.credits,before.credits);assert.equal(declined.energy,before.energy);assert.equal(declined.life,before.life);assert.deepEqual(declined.inventory,before.inventory);
    delete s.config.npcEvents;assert(!eventEligible(s,s.players[0]!,id));
  }
});
test('Vampire charges exactly two life, leaves shields unchanged, and refuses a second pending pact or last two life',()=>{
  let s=open('vampire');grant(s,s.players[0]!,'B19');grant(s,s.players[0]!,'D20');
  s=resolve(s);const p=s.players[0]!;assert.equal(p.life,4);assert(status(p,'B19') && status(p,'D20'));assert.equal(p.npcContracts!.vampire!.signedAt,1);assert(!eventEligible(s,p,'E109'));
  const poor=table('vampire');poor.players[0]!.life=2;assert(!eventEligible(poor,poor.players[0]!,'E109'));
});
test('Vampire reward waits for actual later entry, pays once, and reaches all five seeded outcomes',()=>{
  const seen=new Set<string>();
  for(let i=0;i<100;i++){
    let s=resolve(open('vampire',`blood-${i}`));const p=s.players[0]!;
    redeemNpcContracts(s,p,'vampire');assert(p.npcContracts!.vampire);
    s.encounter=2;redeemNpcContracts(s,p,'alien');assert(p.npcContracts!.vampire);
    for(const id of p.stock)s.items[id]!.owner='npc:alice:2';
    redeemNpcContracts(s,p,'vampire');const repayment=s.trace.find(t=>t.type==='vampire-repaid')!;seen.add(repayment.details.outcome as string);assert(!p.npcContracts!.vampire);
    const after=structuredClone(s);redeemNpcContracts(s,p,'vampire');assert.deepEqual(s,after);
  }
  assert.deepEqual([...seen].sort(),['buff','discount','energy','item','life']);
});
test('actual portal action redeems a Vampire pact rather than just exposing the merchant in choices',()=>{
  const s=table('vampire');s.phase='PORTALS';const p=s.players[0]!;p.selectedPortalId=null;p.stock=[];p.npcContracts={vampire:{signedAt:0}};
  const after=act(s,{type:'enter',portalId:p.portals[0]!.id});assert(!after.players[0]!.npcContracts!.vampire);assert(after.trace.some(t=>t.type==='vampire-repaid'));
});
test('50% Vampire discount matches the displayed final price, excludes fees, supports a bundle, and spends once',()=>{
  for(const bundle of [false,true]){
    const s=table('vampire');s.config.polish=true;const p=s.players[0]!;p.vampireDiscount={encounter:1};grant(s,p,'B03');grant(s,p,'D18');
    const v=appraisalViewFor(s,'alice'),ids=p.stock.slice(0,bundle?2:1),quoted=purchasePrice(v,v.self.stock.slice(0,bundle?2:1),false),credits=p.credits;
    const after=act(s,{type:'buy',itemIds:ids,condition:false});assert.equal(credits-after.players[0]!.credits,quoted);assert(!after.players[0]!.vampireDiscount);
    assert.equal(after.trace.findLast(t=>t.type==='npc-purchased')!.details.price,quoted-(v.fee??0));
  }
});
test('Vampire discount is not applied to another merchant or another appraiser shop and expires on advance',()=>{
  const s=table('orc'),p=s.players[0]!;p.vampireDiscount={encounter:1};const v=appraisalViewFor(s,'alice');assert.equal(purchasePrice(v,[v.self.stock[0]!],false),v.self.stock[0]!.price);
  s.players[1]!.stock.forEach(id=>s.items[id]!.npc='vampire');const credits=p.credits,id=s.players[1]!.stock[0]!,price=npcQuote(s.players[1]!,s.items[id]!);purchase(s,p,s.players[1]!,[id]);assert.equal(credits-p.credits,price);assert(p.vampireDiscount);
  s.phase='REVEAL';const advanced=advanceAppraisalEncounter(s);assert(!advanced.players[0]!.vampireDiscount);
});
test('Alien escrows one to three chosen unique items, preserves truths/knowledge, and reserves repayment',()=>{
  for(const count of [1,2,3]){
    const base=alienThree(),p=base.players[0]!,ids=p.eventOffer!.itemIds.slice(0,count),item=structuredClone(base.items[ids[0]!]!),beforeWealth=wealth(base,p);
    p.knowledge[ids[0]!] = {genuine:true};const s=resolve(base,`lend-${count}`,{itemIds:ids}),after=s.players[0]!;
    assert.equal(s.reservedRewards,8*count);assert.equal(after.npcContracts!.alien!.dueAt,3);assert.equal(wealth(s,after),beforeWealth);assert.deepEqual(after.knowledge[ids[0]!],{genuine:true});
    for(const id of ids){assert(!after.inventory.includes(id));assert.equal(s.items[id]!.owner,'alien-loan:alice');}
    assert.deepEqual({...s.items[item.id],owner:item.owner},item);assertAppraisalInvariants(s);
    assert.throws(()=>act(s,{type:'activate',itemId:ids[0]!}));
  }
});
test('Alien pays only after two intervals and the next chosen Alien, returning exact items once with proportional rewards',()=>{
  const payouts:number[]=[];
  for(const count of [1,2,3]){
    const {s,ids}=loan(count),p=s.players[0]!,credits=p.credits;
    s.encounter=2;redeemNpcContracts(s,p,'alien');assert(p.npcContracts!.alien);
    s.encounter=3;redeemNpcContracts(s,p,'orc');assert(p.npcContracts!.alien);
    redeemNpcContracts(s,p,'alien');const amount=p.credits-credits;payouts.push(amount);assert(amount>=4*count && amount<=8*count);assert.equal(s.reservedRewards,0);assert(!p.npcContracts!.alien);
    assert(ids.every(id=>p.inventory.filter(v=>v===id).length===1 && s.items[id]!.owner==='alice'));
    const before=structuredClone(s);redeemNpcContracts(s,p,'alien');assert.deepEqual(s,before);assertAppraisalInvariants(s);
  }
  assert.equal(payouts[1],payouts[0]!*2);assert.equal(payouts[2],payouts[0]!*3);
});
test('Alien rejects duplicated, foreign, missing, locked and over-limit selections atomically',()=>{
  const s=alienThree(),offer=s.players[0]!.eventOffer!,ids=offer.itemIds.slice(0,3),before=structuredClone(s);
  for(const itemIds of [[ids[0]!,ids[0]!],[ids[0]!,s.players[1]!.stock[0]!],[]])assert.throws(()=>resolve(s,'lend-2',{itemIds}));
  assert.throws(()=>resolve(s,'lend-3',{itemIds:ids.slice(0,2)}));assert.deepEqual(s,before);
  grant(s,s.players[0]!,'D09',ids[0]);assert.throws(()=>resolve(s,'lend-1',{itemIds:[ids[0]!]}));
});
test('run end returns Alien principal for Collector scoring without paying a bonus, even to dead spectators',()=>{
  const {s,ids}=loan(),p=s.players[0]!,credits=p.credits;
  for(const seat of s.players){seat.life=0;seat.paused='dead';seat.done=true;seat.eventOffer=null;}
  collectRun(s);assert.equal(p.credits,credits);assert.equal(s.reservedRewards,0);assert(!p.npcContracts!.alien);
  assert(ids.every(id=>s.collector![0]!.items.some(item=>item.id===id) && s.items[id]!.owner==='collector'));assertAppraisalInvariants(s);
});
test('loan items remove held capacity immediately and the private projection reveals no hidden truths',()=>{
  const s=alienThree();s.config.polish=true;const p=s.players[0]!,id='owned-vital-flask';for(const itemId of p.inventory)if(itemId!==id)s.items[itemId]!.owner='removed';p.inventory=[id];p.energy=maxEnergyOf(s,p);
  p.eventOffer=null;offerEvent(s,p,'E110');const after=resolve(s,'lend-1',{itemIds:[id]});assert.equal(after.players[0]!.energy,maxEnergyOf(after,after.players[0]!));
  const self=appraisalViewFor(after,'alice'),other=appraisalViewFor(after,'bob');assert.equal(self.self.loanItems![0]!.id,id);assert.equal(self.self.loanItems![0]!.knowledge.genuine,undefined);assert.equal(other.self.npcContracts,undefined);assert.equal(other.self.loanItems,undefined);assert(!('seed' in self));
});
test('Dark One cost RNG reaches one, two and three distinct payable resource types',()=>{
  const counts=new Set<number>(),mixes=new Set<string>();
  for(let i=0;i<80;i++){const s=open('darkone',`tribute-${i}`),t=s.players[0]!.eventOffer!.npcTerms!;const keys=(['credits','energy','life','items'] as const).filter(key=>t[key]>0);counts.add(keys.length);mixes.add(keys.join(','));assert(keys.length>=1 && keys.length<=3);assert(t.credits<=s.players[0]!.credits && t.energy<=s.players[0]!.energy && t.life<s.players[0]!.life!);}
  assert.deepEqual([...counts].sort(),[1,2,3]);assert(mixes.size>=8);
});
test('Dark One cleanses only the selected owned debuff and charges the disclosed cost',()=>{
  const s=table('darkone');grant(s,s.players[0]!,'D01');grant(s,s.players[0]!,'D05');offerEvent(s,s.players[0]!,'E111');
  const p=s.players[0]!,o=p.eventOffer!,t=o.npcTerms!;const after=resolve(s,'purge',{statusId:'D01',itemId:o.itemIds[0]!}).players[0]!;
  assert(!status(after,'D01'));assert(status(after,'D05'));assert.equal(after.credits,p.credits-t.credits);assert.equal(after.energy,p.energy-t.energy);assert.equal(after.life,p.life!-t.life);assert.equal(after.inventory.length,p.inventory.length-t.items);
  assert.throws(()=>resolve(s,'purge',{statusId:'B03',itemId:o.itemIds[0]!}));
});
test('Dark One sends RNG debuffs to the chosen living opponent and rejects self/dead/unknown targets',()=>{
  const found=new Set<string>();
  for(let i=0;i<60;i++){
    const s=open('darkone',`hex-${i}`),o=s.players[0]!.eventOffer!;assert.deepEqual(o.otherPlayerIds,['bob']);assert(!o.boons);
    for(const target of ['alice','missing'])assert.throws(()=>resolve(s,'send-debuff',{otherPlayerId:target,itemId:o.itemIds[0]!}));
    const after=resolve(s,'send-debuff',{otherPlayerId:'bob',itemId:o.itemIds[0]!});const id=after.trace.find(t=>t.type==='npc-hex')!.details.statusId as string;found.add(id);assert(after.players[1]!.statuses.some(status=>status.id===id));
  }
  assert(found.size>=10);
  const dead=open('darkone');dead.players[1]!.life=0;dead.players[1]!.paused='dead';assert.throws(()=>resolve(dead,'send-debuff',{otherPlayerId:'bob',itemId:dead.players[0]!.eventOffer!.itemIds[0]!}));
});
test('Autometa accepts either a chosen item or two energy and grants a seeded buff',()=>{
  const outcomes=new Set<string>();
  for(const choice of ['give-item','give-energy'])for(let i=0;i<20;i++){
    const s=open('autometa',`upgrade-${i}`),p=s.players[0]!,id=p.eventOffer!.itemIds[0]!,after=resolve(s,choice,{itemId:id}).players[0]!;
    assert.equal(after.energy,p.energy-(choice==='give-energy'?2:0));assert.equal(after.inventory.length,p.inventory.length-(choice==='give-item'?1:0));assert(after.statuses.some(s=>s.id.startsWith('B')));after.statuses.forEach(s=>outcomes.add(s.id));
  }
  assert(outcomes.size>5);
});
test('Dark One excludes dead spectators in historical encounter mode too',()=>{
  const s=table('darkone');delete s.config.survival;s.version=4;for(const p of s.players)delete p.life;
  s.players[1]!.paused='dead';s.players[1]!.done=true;grant(s,s.players[0]!,'D01');offerEvent(s,s.players[0]!,'E111');
  const offer=s.players[0]!.eventOffer!;assert.deepEqual(offer.otherPlayerIds,[]);assert.deepEqual(offer.choices,['purge','decline']);
  assert.throws(()=>resolve(s,'send-debuff',{otherPlayerId:'bob',itemId:offer.itemIds[0]!}));
});
for(const npc of ['orc','beast','deepsea','swarm'] as const)test(`${npc} unique event settles its own cost and reward`,()=>{
  const s=open(npc),p=s.players[0]!,after=resolve(s,'accept',{itemId:p.eventOffer!.itemIds[0]!});
  assert(after.players[0]!.statuses.filter(s=>s.id.startsWith('B')).length>=(npc==='swarm'?2:1));assertAppraisalInvariants(after);
  if(npc==='deepsea')assert(Object.values(after.players[0]!.knowledge).some(k=>k.base!==undefined || k.genuine!==undefined || k.cursed!==undefined));
});
test('event command parser validates one to three distinct string item IDs',()=>{
  const command={type:'action',matchId:'test',action:{type:'event',encounter:1,requestId:'loan',key:'offer',choice:'lend-2',itemIds:['a','b']}};
  assert.deepEqual(parseAppraisalMessage(command),command);
  for(const itemIds of [[],['a','a'],['a','b','c','d'],[1],null])assert.throws(()=>parseAppraisalMessage({...command,action:{...command.action,itemIds}}));
});
test('loan request retry is idempotent and conflicting payload cannot replace an accepted request',()=>{
  const s=alienThree(),o=s.players[0]!.eventOffer!,command:AppraisalAction={type:'event',playerId:'alice',encounter:1,requestId:'loan-retry',key:o.key,choice:'lend-1',itemIds:[o.itemIds[0]!]};
  const after=applyAppraisalAction(s,command);assert.strictEqual(applyAppraisalAction(after,command),after);assert.throws(()=>applyAppraisalAction(after,{...command,itemIds:[o.itemIds[1]!]}));
});
test('loan feedback names a temporary loan and a later return rather than a permanent loss',()=>{
  const s=alienThree(),o=s.players[0]!.eventOffer!,before=appraisalViewFor(s,'alice'),after=resolve(s,'lend-1',{itemIds:[o.itemIds[0]!]});
  const lent=appraisalViewFor(after,'alice'),outcome=outcomeBetween(before,lent)!;assert(outcome.lines.some(line=>line.startsWith('ให้ Alien ยืม')));assert(!outcome.lines.some(line=>line.startsWith('เสีย ')));
  after.encounter=3;redeemNpcContracts(after,after.players[0]!,'alien');const repaid=outcomeBetween(lent,appraisalViewFor(after,'alice'))!;assert(repaid.lines.some(line=>line.startsWith('Alien คืน')));
});
test('Collector estimate keeps known loan principal and unknown-item counts until items return',()=>{
  const s=alienThree(),p=s.players[0]!,o=p.eventOffer!,id=o.itemIds[0]!;p.knowledge[id]={base:s.items[id]!.base,genuine:true,cursed:false};
  const before=collectorEstimate(appraisalViewFor(s,'alice')),after=resolve(s,'lend-2',{itemIds:o.itemIds.slice(0,2)});
  assert.deepEqual(collectorEstimate(appraisalViewFor(after,'alice')),before);
});
test('client decisions require exact loan selection, own cleanse or chosen opponent, and disclose all costs',()=>{
  const selection={itemId:'',statusId:'',fact:'',guess:true};
  const alien=open('alien'),o=alien.players[0]!.eventOffer!;assert.equal(eventDecision(o,'lend-1',selection),null);assert(eventDecision(o,'lend-1',{...selection,itemIds:[o.itemIds[0]!]}));
  const d=table('darkone');grant(d,d.players[0]!,'D01');offerEvent(d,d.players[0]!,'E111');const offer=d.players[0]!.eventOffer!,v=appraisalViewFor(d,'alice');assert(eventNeedsStatus(offer,'purge'));assert.deepEqual(eventStatusOptions(offer,'purge'),['D01']);assert.equal(eventDecision(offer,'send-debuff',selection),null);assert(eventDecision(offer,'send-debuff',{...selection,itemId:offer.itemIds[0]!,otherPlayerId:'bob'}));
  assert.deepEqual(eventNeeds(v,offer,'purge',''),{credits:offer.npcTerms!.credits,energy:offer.npcTerms!.energy,life:offer.npcTerms!.life});
  const auto=open('autometa').players[0]!.eventOffer!;assert(eventNeedsItem(auto,'give-item'));assert(!eventNeedsItem(auto,'give-energy'));
});
test('UI renders loan checkbox identities, known opponent names and the pending contract ledger',()=>{
  const a=alienThree(),v=appraisalViewFor(a,'alice');const html=renderToStaticMarkup(createElement(EventDecision,{game:v,offer:v.self.eventOffer!,submit:()=>{},disabled:false}));assert(html.includes('type="checkbox"'));assert(html.includes('จบรันก่อนพบกัน'));
  const d=open('darkone'),dv=appraisalViewFor(d,'alice');const dark=renderToStaticMarkup(createElement(EventDecision,{game:dv,offer:dv.self.eventOffer!,submit:()=>{},disabled:false,playerNames:{bob:'เพื่อนบ็อบ'}}));assert(dark.includes('เพื่อนบ็อบ'));
  const pending=loan(),ledger=renderToStaticMarkup(createElement(NpcContracts,{game:appraisalViewFor(pending.s,'alice')}));assert(ledger.includes('สัญญากับพ่อค้า') && ledger.includes('ไม่ได้โบนัส'));
});
test('Dark One sender and victim see room display names in both result feedback and history',()=>{
  const s=open('darkone'),o=s.players[0]!.eventOffer!,after=resolve(s,'send-debuff',{otherPlayerId:'bob',itemId:o.itemIds[0]!}),names={alice:'นักเดินทาง',bob:'เพื่อนบ็อบ'};
  for(const playerId of ['alice','bob'] as const){
    const game=appraisalViewFor(after,playerId);const room:AppraisalRoomView={rulesVersion:'0.5',mode:'survival',code:'ABC234',hostId:'alice',yourSeatId:playerId,seats:after.players.map(p=>({id:p.id,name:names[p.id as keyof typeof names],connected:true,ready:true})),matchSeats:after.players.map(p=>({id:p.id,name:names[p.id as keyof typeof names]})),playtestMode:'no-voice',matchId:'npc-name',deadline:null,serverTime:1000,revealReady:[],game};
    const history=renderToStaticMarkup(createElement(GameTable,{room,submit:()=>{},send:()=>true,disabled:false}));
    const toast=renderToStaticMarkup(createElement(Toasts,{toasts:[{id:1,tone:'info',title:game.self.notes.at(-1)!,lines:[game.self.notes.at(-1)!]}],dismiss:()=>{},survival:true,playerNames:names}));
    const expected=playerId==='alice'?names.bob:names.alice,historyNotes=history.split('<details class="notes">')[1]!.split('</details>')[0]!;assert(historyNotes.includes(expected));assert(!historyNotes.includes(playerId==='alice'?'bob':'alice'));assert(toast.includes(expected));assert(!toast.includes(playerId==='alice'?'bob':'alice'));
    assert(game.self.notes.at(-1)!.includes(playerId==='alice'?'bob':'alice'),'authoritative notes retain stable IDs');
  }
  assert.equal(after.trace.find(t=>t.type==='npc-hex')!.details.targetId,'bob');
});
test('new and historical rule sets finish and strictly replay in seeded simulations',()=>{
  const seen=new Set<string>();
  for(const survival of [false,true])for(let i=0;i<12;i++){
    const audit=simulateAppraisalRun(2,i%2?'collector':'aggressive',`npc-run-${survival}-${i}`,{npcEvents:true,polish:true,...(survival?{survival:SURVIVAL_RULES}:{})});
    audit.trace.filter(t=>t.type==='event-offered').forEach(t=>{if(NPC_EVENT_IDS.includes(t.details.id as never))seen.add(t.details.id as string);});
    assert(audit.final.every(p=>p.credits>=0));
  }
  assert(seen.size>=6);
  for(const survival of [false,true]){const audit=simulateAppraisalRun(2,'cautious',`npc-legacy-${survival}`,{...(survival?{survival:SURVIVAL_RULES}:{})});assert(!audit.trace.some(t=>NPC_EVENT_IDS.includes(t.details.id as never)));}
  assert.equal(createAppraisalRun(['a','b'],'no-config').config.npcEvents,undefined);
});
