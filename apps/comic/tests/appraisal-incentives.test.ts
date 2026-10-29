import test from 'node:test';
import assert from 'node:assert/strict';
import { applyAppraisalAction, assertAppraisalInvariants, SURVIVAL_RULES } from '../src/game/appraisal/index.js';
import { npcQuote, purchase, spend } from '../src/game/appraisal/mechanics.js';
import { collectRun } from '../src/game/appraisal/survival.js';
import { itemScoreValue, PROVENANCE_PERCENT } from '../src/game/appraisal/scoring.js';
import type { AppraisalAction, AppraisalState } from '../src/game/appraisal/types.js';
import { appraisalFixture } from './support/appraisal-fixture.js';

type Body=AppraisalAction extends infer A?A extends AppraisalAction?Omit<A,'playerId'|'requestId'|'encounter'>:never:never;
let request=0;
const act=(s:AppraisalState,body:Body,id='alice')=>applyAppraisalAction(s,{...body,playerId:id,requestId:`incentive-${++request}`,encounter:s.encounter} as AppraisalAction);

/** Alice appraised one shop item for bob; the merchant accepts her price (reservation 0) unless said otherwise. */
function table(survival=true,accepted=true):{s:AppraisalState;id:string} {
  let s=appraisalFixture('E18',3);s.config.freeBuy=false;
  if(survival){s.config.survival=SURVIVAL_RULES;s.version=5;for(const p of s.players){p.life=3;p.recoveryUsed=false;}}
  const id=s.players[0]!.stock[0]!;s.items[id]!.reservation=accepted?0:1000;
  s=act(s,{type:'appraise',itemId:id,value:20,acceptDanger:true});
  assert.equal(s.players[0]!.valuations[id]!.accepted,accepted);
  return {s,id};
}

test('survival with paid purchases: goods a friend appraised and the merchant accepted cost no energy to buy',()=>{
  const {s,id}=table();const bob=s.players[1]!;const energy=bob.energy;
  purchase(s,bob,s.players[0]!,[id]);assert.equal(bob.energy,energy,'no energy spent');
  const refused=table(true,false);const b=refused.s.players[1]!;const e=b.energy;
  purchase(refused.s,b,refused.s.players[0]!,[refused.id]);assert.equal(b.energy,e-1,'the merchant rejected the price, so it is a normal purchase');
  const classic=table(false);const c=classic.s.players[1]!;const ce=c.energy;
  purchase(classic.s,c,classic.s.players[0]!,[classic.id]);assert.equal(c.energy,ce-1,'only survival rewards buying from friends');
  const own=table();const a=own.s.players[0]!;const ae=a.energy;
  purchase(own.s,a,a,[own.id]);assert.equal(a.energy,ae-1,'your own appraised goods still cost energy');
});

/** Alice shares her appraised item for purchase with a rebate; bob buys through an accepted offer. */
function listed(rebate:number) {
  const {s,id}=table();
  s.phase='TRADE';
  const t=act(s,{type:'share',itemId:id,allow:true,purchase:true,rebate});
  return {s:t,id};
}
test('a listing rebate is paid by the owner to the buyer when the sale completes',()=>{
  const {s:before,id}=listed(12);
  assert.equal(before.listings.find(l=>l.itemId===id)!.rebate,12);
  const alice=before.players[0]!.credits,bob=before.players[1]!.credits;const quote=npcQuote(before.players[0]!,before.items[id]!);
  let s=act(before,{type:'propose',sellerId:'alice',itemId:id,credits:5},'bob');
  s=act(s,{type:'respond',offerId:s.trades.at(-1)!.id,accept:true});
  assert.equal(s.players[1]!.credits,bob-quote-5+12,'buyer pays quote and fee, then receives the rebate');
  assert.equal(s.players[0]!.credits,alice+5+Math.floor(quote/10)-12,'seller gets fee and commission, pays the rebate');
  assert(s.ledger.some(e=>e.reason==='seller-rebate' && e.from==='alice' && e.to==='bob' && e.amount===12));
  assert(s.players[1]!.notes.some(n=>n.includes('ผู้ขายแถม')));assertAppraisalInvariants(s);
});
test('a rebate needs an open listing and enough credits; a forced sale pays what the owner has',()=>{
  const {s,id}=table();s.phase='TRADE';
  assert.throws(()=>act(s,{type:'share',itemId:id,allow:true,purchase:false,rebate:5}),/ค่าแถม/);
  assert.throws(()=>act(s,{type:'share',itemId:id,allow:true,purchase:true,rebate:s.players[0]!.credits+1}),/ค่าแถม/);
  assert.throws(()=>act(s,{type:'share',itemId:id,allow:true,purchase:true,rebate:-1}),/ค่าแถม/);
  const l=listed(30);l.s.players[1]!.darkTickets=3;spend(l.s,l.s.players[0]!,l.s.players[0]!.credits-7,0,'test-drain');
  const bob=l.s.players[1]!.credits,quote=npcQuote(l.s.players[0]!,l.s.items[l.id]!);
  const forced=act(l.s,{type:'force-buy',sellerId:'alice',itemId:l.id},'bob');
  assert.equal(forced.players[1]!.credits,bob-quote+7+Math.floor(quote/10),'the owner pays everything they have, commission from this very sale included');
});
test('the sale fails if the owner cannot pay the promised rebate when accepting',()=>{
  const {s,id}=listed(10);
  let t=act(s,{type:'propose',sellerId:'alice',itemId:id,credits:0},'bob');
  t.players[0]!.credits=3;
  assert.throws(()=>act(t,{type:'respond',offerId:t.trades.at(-1)!.id,accept:true}),/ค่าแถม/);
});

test('the Collector pays 15 percent more for goods another seat appraised',()=>{
  assert.equal(PROVENANCE_PERCENT,15);
  assert.equal(itemScoreValue(20,true,false,false),20);assert.equal(itemScoreValue(20,true,false,true),23,'exact integer math, not 22.999');
  assert.equal(itemScoreValue(20,false,true,true),Math.floor(20*.25*.75*1.15));
  const {s,id}=table();purchase(s,s.players[1]!,s.players[0]!,[id]);
  const own=s.players[0]!.stock[0]!;purchase(s,s.players[0]!,s.players[0]!,[own]);
  for(const p of s.players){p.life=0;p.paused='dead';p.done=true;p.eventOffer=null;}
  collectRun(s);
  const bobRow=s.collector!.find(r=>r.playerId==='bob')!.items.find(i=>i.id===id)!;
  const aliceRow=s.collector!.find(r=>r.playerId==='alice')!.items.find(i=>i.id===own)!;
  assert.equal(bobRow.certified,true);assert.equal(bobRow.value,itemScoreValue(bobRow.base,bobRow.genuine,bobRow.cursed,true));
  assert.equal(aliceRow.certified,undefined,'your own appraisal carries no seal');
});

test('buying a friend\'s appraised goods hands over the facts they verified, never overriding what you know',()=>{
  const {s,id}=table();const alice=s.players[0]!,bob=s.players[1]!;
  alice.knowledge[id]={genuine:true,cursed:false,base:20};bob.knowledge[id]={genuine:false};
  purchase(s,bob,alice,[id]);
  assert.deepEqual(bob.knowledge[id],{genuine:false,cursed:false,base:20},'own belief wins, new verified facts fill the gaps');
  assert(bob.notes.some(n=>n.includes('ข้อมูลที่ผู้ประเมินตรวจไว้จริง')));
  assert(s.trace.some(t=>t.type==='knowledge-inherited' && t.playerId==='bob'));
  const own=table();own.s.players[0]!.knowledge[own.id]={genuine:true};
  purchase(own.s,own.s.players[0]!,own.s.players[0]!,[own.id]);
  assert(!own.s.trace.some(t=>t.type==='knowledge-inherited'),'buying your own goods shares nothing');
});
