import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceAppraisalEncounter, applyAppraisalAction, appraisalViewFor, assertAppraisalInvariants, BROKERAGE_RULES, createAppraisalRun, SURVIVAL_RULES } from '../src/game/appraisal/index.js';
import { BOND_SPECS, ITEM_SPECS, UNSOLD_PENALTIES } from '../src/game/appraisal/content.js';
import { auctionLots, settleAuction } from '../src/game/appraisal/brokerage.js';
import { eventEligible, offerEvent } from '../src/game/appraisal/events.js';
import { grant, reward, spend, status } from '../src/game/appraisal/mechanics.js';
import { BOND_EVENT_IDS, EVENT_IDS } from '../src/game/appraisal/types.js';
import type { AppraisalAction, AppraisalConfig, AppraisalState, ItemKind, NpcId } from '../src/game/appraisal/types.js';
import { parseAppraisalMessage } from '../src/server/appraisal-messages.js';
import { AppraisalRoomService } from '../src/server/appraisal-rooms.js';
import { analyseAppraisalMatchAudit } from '../src/playtest/appraisal-report.js';
import type { AppraisalRoomView, AppraisalServerMessage } from '../src/shared/appraisal-protocol.js';
import { simulateAppraisalRun } from '../src/simulation/appraisal.js';
import { eventCost, eventDecision, eventNeedsItem, isConsequence } from '../src/appraisal-client/model.js';

type Body = AppraisalAction extends infer A ? A extends AppraisalAction ? Omit<A,'playerId'|'requestId'|'encounter'> : never : never;
let request=0;
const act=(state:AppraisalState,playerId:string,body:Body)=>applyAppraisalAction(state,{...body,playerId,requestId:`broker-${++request}`,encounter:state.encounter} as AppraisalAction);

/** Both seats at an APPRAISAL table with the given NPC; alice holds one genuine, uncursed item of every kind. */
function brokerFixture(npc:NpcId='orc',overrides:Partial<AppraisalConfig>={}):AppraisalState {
  const state=createAppraisalRun(['alice','bob'],'broker',{marketProbability:0,brokerage:BROKERAGE_RULES,...overrides});
  state.phase='APPRAISAL';
  for(const seat of state.players) {
    seat.eventOffer=null;seat.done=false;seat.offerSlots=0;seat.energy=7;reward(state,seat,100,'test-fixture');
    seat.selectedPortalId=seat.portals[0]!.id;seat.stock=[...seat.portals[0]!.stock];
    seat.stock.forEach((itemId,index)=>{const item=state.items[itemId]!;item.npc=npc;item.kind=index?'key':'mirror';item.base=index?24:20;item.ask=item.base;item.reservation=10;item.genuine=true;item.cursed=false;});
  }
  const p=state.players[0]!;
  for(const kind of Object.keys(ITEM_SPECS) as ItemKind[]) {
    const id=`owned-${kind}`;
    state.items[id]={id,kind,base:ITEM_SPECS[kind].anchor,genuine:true,cursed:false,ask:ITEM_SPECS[kind].anchor,owner:p.id,npcOwnerId:p.id,npc:'orc',encounter:1,certificate:true,lastAppraisal:null,lastAccepted:null,reservation:1};
    p.inventory.push(id);
  }
  assertAppraisalInvariants(state);return state;
}

test('brokerage is opt-in: default runs keep 50 random events, no vault and the original market-sale owner', () => {
  assert.equal(EVENT_IDS.length,50);assert.equal(BOND_EVENT_IDS.length,22);assert.equal(BOND_SPECS.length,22);
  const plain=createAppraisalRun(['alice','bob'],'plain');assert.equal(plain.vault,undefined);assert.equal(plain.market.lots,undefined);
  for(const id of BOND_EVENT_IDS) assert.equal(eventEligible(plain,plain.players[0]!,id),false);
  assert.throws(()=>act(plain,'alice',{type:'bid',lotId:'x',credits:5}));
  for(const bad of [{auctionProbability:2,maxLots:2,bondProbability:.5},{auctionProbability:.5,maxLots:0,bondProbability:.5},{auctionProbability:.5,maxLots:2,bondProbability:.5,extra:1}])
    assert.throws(()=>createAppraisalRun(['alice','bob'],'bad',{brokerage:bad as NonNullable<AppraisalConfig['brokerage']>}));
});

for(const spec of BOND_SPECS) test(`${spec.id} ${spec.npc}: held item opens the offer, accept applies its effect, decline is free`, () => {
  const setup=()=>{
    const state=brokerFixture(spec.npc);const p=state.players[0]!;
    if(spec.known==='cursed') for(const id of p.inventory) p.knowledge[id]={cursed:true};
    if(spec.known==='fake') for(const id of p.inventory) p.knowledge[id]={genuine:false};
    if(spec.cleanse==='debuffs') grant(state,p,'D01');
    if(spec.cleanse==='D10') grant(state,p,'D10');
    p.energy=4;return state;
  };
  const declined=setup();const before=structuredClone(declined.players[0]!);
  assert.equal(eventEligible(declined,declined.players[0]!,spec.id),true);
  offerEvent(declined,declined.players[0]!,spec.id);
  const afterDecline=act(declined,'alice',{type:'event',key:declined.players[0]!.eventOffer!.key,choice:'decline'}).players[0]!;
  assert.equal(afterDecline.credits,before.credits);assert.deepEqual(afterDecline.inventory,before.inventory);assert.equal(afterDecline.energy,before.energy);

  let state=setup();const p0=structuredClone(state.players[0]!);
  offerEvent(state,state.players[0]!,spec.id);const offer=structuredClone(state.players[0]!.eventOffer!);
  assert.equal(offer.choices.includes('decline'),true);
  if(spec.mode==='swap') assert(offer.giveItemId && p0.inventory.includes(offer.giveItemId));
  const itemId=offer.itemIds[0];
  state=act(state,'alice',{type:'event',key:offer.key,choice:'accept',...(itemId?{itemId}:{})});const p=state.players[0]!;
  assertAppraisalInvariants(state);assert.equal(p.eventOffer,null);assert(p.resolvedEvents.includes(spec.id));
  if(spec.mode==='swap') {
    const swapped=p.inventory.includes(itemId!);
    assert.equal(swapped,!p.inventory.includes(offer.giveItemId!));
    if(!swapped) assert(status(p,spec.genuineOnly?'D10':'D03'),'a refused swap must say why');
    if(!spec.risk) assert(swapped);
  }
  if(spec.mode==='sell') {assert.equal(p.credits,p0.credits+offer.quotedPrices[itemId!]!);assert(!p.inventory.includes(itemId!));}
  if(spec.mode==='tribute') assert(!p.inventory.includes(itemId!));
  if(spec.mode==='show') assert.deepEqual(p.inventory,p0.inventory);
  if(spec.mode==='reveal') for(const fact of spec.reveal!) assert.notEqual(p.knowledge[itemId!]?.[fact],undefined);
  if(spec.mode==='tribute' || spec.mode==='show') for(const id of spec.buffs??[]) assert(status(p,id),`${spec.id} grants ${id}`);
  if(spec.cleanse==='debuffs') assert(!p.statuses.some(s=>s.id.startsWith('D')));
  if(spec.cleanse==='D10') assert(!status(p,'D10'));
});

test('E51 pure blood: a fake blood item is refused, kept, and leaves blood thirst', () => {
  let state=brokerFixture('vampire');const p=state.players[0]!;
  for(const id of p.inventory) if(['blood-orb','blood-tonic'].includes(state.items[id]!.kind)) state.items[id]!.genuine=false;
  offerEvent(state,p,'E51');const offer=p.eventOffer!;
  state=act(state,'alice',{type:'event',key:offer.key,choice:'accept',itemId:offer.itemIds[0]!});
  assert(state.players[0]!.inventory.includes(offer.giveItemId!));assert(!state.players[0]!.inventory.includes(offer.itemIds[0]!));assert(status(state.players[0]!,'D10'));
});

test('unsold duty: buy, NPC penalty and Dark Market consignment each clear the appraised item', () => {
  const appraised=()=>{const state=brokerFixture('orc');return act(state,'alice',{type:'appraise',itemId:state.players[0]!.stock[0]!,value:20});};
  let state=appraised();const itemId=state.players[0]!.stock[0]!;
  assert.deepEqual(appraisalViewFor(state,'alice').self.stock.filter(i=>i.appraisal!==null).map(i=>i.id),[itemId]);
  assert.throws(()=>act(state,'alice',{type:'unsold',itemId:state.players[0]!.stock[1]!,choice:'penalty'}),'only appraised items carry the duty');

  const bought=act(state,'alice',{type:'unsold',itemId,choice:'buy'});
  assert.equal(bought.items[itemId]!.owner,'alice');assert.equal(bought.players[0]!.credits,state.players[0]!.credits-20);

  const penalised=act(state,'alice',{type:'unsold',itemId,choice:'penalty'});
  assert.equal(penalised.players[0]!.credits,state.players[0]!.credits-UNSOLD_PENALTIES.orc.credits);
  assert(!penalised.players[0]!.stock.includes(itemId));assert(penalised.items[itemId]!.owner.startsWith('npc:'));

  const consigned=act(state,'alice',{type:'unsold',itemId,choice:'consign'});
  assert.equal(consigned.items[itemId]!.owner,'dark-market');assert.deepEqual(consigned.vault,[itemId]);
  assert(consigned.trace.some(t=>t.type==='unsold-consigned'));
  assert.throws(()=>act(consigned,'alice',{type:'unsold',itemId,choice:'consign'}));
});

test('unsold duty: a penalty never overdraws and settlement applies it to anything left', () => {
  let state=brokerFixture('autometa');const p=state.players[0]!;spend(state,p,p.credits-1,0,'test-drain');
  state=act(state,'alice',{type:'appraise',itemId:p.stock[0]!,value:20});
  state=act(state,'alice',{type:'unsold',itemId:state.players[0]!.stock[0]!,choice:'penalty'});
  assert.equal(state.players[0]!.credits,0);assert(status(state.players[0]!,'D06'));

  state=brokerFixture('orc');const itemId=state.players[0]!.stock[0]!;
  state=act(state,'alice',{type:'appraise',itemId,value:20});
  for(let turn=0;turn<12 && state.phase!=='REVEAL';turn++) for(const seat of state.players) if(!seat.done && !seat.paused) state=act(state,seat.id,{type:'done'});
  assert.equal(state.phase,'REVEAL');
  assert(state.trace.some(t=>t.type==='unsold-penalty' && t.details.itemId===itemId),'timeout/done settles unsold items with the NPC penalty');
});

test('survival: Dark One unsold penalty costs life and can end the run', () => {
  let state=brokerFixture('darkone',{survival:SURVIVAL_RULES});const p=state.players[0]!;p.life=1;
  state=act(state,'alice',{type:'appraise',itemId:p.stock[0]!,value:20,acceptDanger:true});
  if(state.players[0]!.eventOffer) state=act(state,'alice',{type:'event',key:state.players[0]!.eventOffer.key,choice:state.players[0]!.eventOffer.choices.includes('pay')?'pay':state.players[0]!.eventOffer.choices[0]!});
  if(state.players[0]!.paused) return;
  state=act(state,'alice',{type:'unsold',itemId:state.players[0]!.stock[0]!,choice:'penalty'});
  assert.equal(state.players[0]!.life,0);assert.equal(state.players[0]!.paused,'dead');
});

test('Dark Market vault: sales are kept, auctions are seeded, sealed and paid by the best bidder who can pay', () => {
  let state=brokerFixture('orc',{marketProbability:1,brokerage:{...BROKERAGE_RULES,auctionProbability:1}});
  state.phase='TRADE';const sold=state.items['owned-mirror']!;
  state.items[sold.id]!.owner='dark-market';state.players[0]!.inventory=state.players[0]!.inventory.filter(id=>id!==sold.id);state.vault=[sold.id];
  state.market.lots=auctionLots(state);assertAppraisalInvariants(state);
  const lot=state.market.lots[0]!;assert.equal(lot.itemId,sold.id);assert.equal(lot.minimum,Math.floor(ITEM_SPECS.mirror.anchor*.6));
  assert.throws(()=>act(state,'bob',{type:'bid',lotId:lot.id,credits:lot.minimum-1}));
  state.items[sold.id]!.lastAppraisal=17;assert.equal(appraisalViewFor(state,'bob').market.lots![0]!.item.appraisal,null,'the consigner\'s appraisal stays private');
  state=act(state,'alice',{type:'bid',lotId:lot.id,credits:40});state=act(state,'bob',{type:'bid',lotId:lot.id,credits:30});
  const view=appraisalViewFor(state,'bob').market.lots![0]!;
  assert.equal(view.yourBid,30);assert.equal(view.bidCount,2);assert(!JSON.stringify(appraisalViewFor(state,'bob')).includes('"bids"'));

  const underfunded=structuredClone(state);spend(underfunded,underfunded.players[0]!,underfunded.players[0]!.credits-10,0,'test-drain');
  settleAuction(underfunded);assertAppraisalInvariants(underfunded);
  assert.equal(underfunded.items[sold.id]!.owner,'bob');assert.equal(underfunded.market.lots![0]!.price,30);assert.deepEqual(underfunded.vault,[]);

  const tie=act(state,'bob',{type:'bid',lotId:lot.id,credits:40});
  const a=structuredClone(tie),b=structuredClone(tie);settleAuction(a);settleAuction(b);
  assert.equal(a.market.lots![0]!.winnerId,b.market.lots![0]!.winnerId);assert.equal(a.market.lots![0]!.price,40);
  const withdrawn=act(act(state,'alice',{type:'bid',lotId:lot.id,credits:0}),'bob',{type:'bid',lotId:lot.id,credits:0});
  settleAuction(withdrawn);assert.equal(withdrawn.market.lots![0]!.winnerId,null);assert.deepEqual(withdrawn.vault,[sold.id]);
});

test('parser accepts unsold and bid actions and rejects unknown unsold choices', () => {
  const wrap=(action:Record<string,unknown>)=>({type:'action',matchId:'m',action:{...action,requestId:'r',encounter:1}});
  assert.equal(parseAppraisalMessage(wrap({type:'unsold',itemId:'i',choice:'consign'})).type,'action');
  assert.equal(parseAppraisalMessage(wrap({type:'bid',lotId:'l',credits:12})).type,'action');
  for(const bad of [{type:'unsold',itemId:'i',choice:'steal'},{type:'bid',lotId:'l',credits:-1},{type:'bid',lotId:'l',credits:1,playerId:'bob'}])
    assert.throws(()=>parseAppraisalMessage(wrap(bad)));
});

test('synthetic brokerage runs replay byte-for-byte in both rule sets', () => {
  for(const survival of [false,true]) for(const policy of ['cautious','collector','trader'] as const) for(let i=0;i<8;i++)
    simulateAppraisalRun(3,policy,`brokerage:${survival}:${policy}:${i}`,{brokerage:BROKERAGE_RULES,...(survival?{survival:SURVIVAL_RULES}:{})});
});

test('UI builds an engine-accepted decision for every bond event and never styles it as a consequence', () => {
  for(const spec of BOND_SPECS) {
    let state=brokerFixture(spec.npc);const p=state.players[0]!;
    if(spec.known==='cursed') for(const id of p.inventory) p.knowledge[id]={cursed:true};
    if(spec.known==='fake') for(const id of p.inventory) p.knowledge[id]={genuine:false};
    if(spec.cleanse==='debuffs') grant(state,p,'D01');
    offerEvent(state,p,spec.id);const offer=p.eventOffer!;
    assert.equal(isConsequence(offer.id),false);assert.equal(eventNeedsItem(offer,'accept'),spec.mode!=='show');
    const view=appraisalViewFor(state,'alice');assert.notEqual(eventCost(view,view.self.eventOffer!,'accept',offer.itemIds[0]??''),'ดูเงื่อนไขข้อเสนอด้านบน');
    const decision=eventDecision(view.self.eventOffer!,'accept',{itemId:offer.itemIds[0]??'',statusId:'',fact:'',guess:true});
    assert(decision,spec.id);state=act(state,'alice',decision as Body);assert.equal(state.players[0]!.eventOffer,null);
  }
});

test('auctions open from the vault even when the sell-order market stays shut', () => {
  let state=brokerFixture('orc',{marketProbability:0,brokerage:{...BROKERAGE_RULES,auctionProbability:1}});
  const itemId=state.players[0]!.stock[0]!;
  state=act(state,'alice',{type:'appraise',itemId,value:20});
  state=act(state,'alice',{type:'unsold',itemId,choice:'consign'});
  for(let turn=0;turn<12 && state.phase!=='REVEAL';turn++) for(const seat of state.players) if(!seat.done && !seat.paused) state=act(state,seat.id,{type:'done'});
  state=advanceAppraisalEncounter(state);
  assert.equal(state.market.open,false);assert.deepEqual(state.market.lots!.map(l=>l.itemId),[itemId]);
});

test('room service with brokerage: timeouts settle an unsold appraisal and the audit replays through the report', () => {
  let now=100;const rooms=new AppraisalRoomService(()=>now,{PORTALS:1000,APPRAISAL:1000,TRADE:1000,REVEAL:1000},undefined,{brokerage:BROKERAGE_RULES});
  const received:AppraisalServerMessage[]=[];
  const host={send:(m:AppraisalServerMessage)=>received.push(m),close:()=>{}};
  const peer={send:(_m:AppraisalServerMessage)=>{},close:()=>{}};
  const room=()=>received.filter((m):m is Extract<AppraisalServerMessage,{type:'state'}>=>m.type==='state').at(-1)!.room as AppraisalRoomView;
  rooms.receive(host,{type:'create',name:'host'});rooms.receive(peer,{type:'join',name:'peer',roomCode:room().code});
  rooms.receive(host,{type:'ready',ready:true});rooms.receive(peer,{type:'ready',ready:true});rooms.receive(host,{type:'start'});
  let n=0;const send=(action:Record<string,unknown>)=>rooms.receive(host,{type:'action',matchId:room().matchId!,action:{...action,requestId:`host-${++n}`,encounter:room().game!.encounter}} as never);
  const clearEvent=()=>{const offer=room().game!.self.eventOffer;if(offer?.choices.includes('decline'))send({type:'event',key:offer.key,choice:'decline'});};
  clearEvent();assert.equal(room().game!.brokerage,true);
  send({type:'enter',portalId:room().game!.self.portals.find(p=>!p.disabled)!.id});
  for(let i=0;i<3 && room().game!.phase!=='APPRAISAL';i++){now+=1000;rooms.tick();}
  clearEvent();const itemId=room().game!.self.stock[0]!.id;
  send({type:'appraise',itemId,value:20,acceptDanger:true});
  assert.equal(room().game!.self.stock.find(i=>i.id===itemId)?.appraisal,20);
  for(let i=0;i<40 && room().game?.phase!=='RESULTS';i++){now+=1000;rooms.tick();}
  assert.equal(room().game!.phase,'RESULTS');rooms.receive(host,{type:'audit',matchId:room().matchId});
  const audit=received.find((m):m is Extract<AppraisalServerMessage,{type:'audit'}>=>m.type==='audit')!.audit;
  assert.deepEqual(audit.run.config.brokerage,BROKERAGE_RULES);
  assert(audit.run.trace.some(t=>t.type==='unsold-penalty' && t.details.itemId===itemId));
  assert.equal(analyseAppraisalMatchAudit(audit).playerCount,2);
});
