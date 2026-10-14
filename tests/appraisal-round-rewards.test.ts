import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { advanceAppraisalEncounter, applyAppraisalAction, appraisalViewFor, assertAppraisalInvariants, createAppraisalRun, exportAppraisalAudit, replayAppraisalAudit } from '../src/game/appraisal/index.js';
import { restoreAppraisalRun } from '../src/game/appraisal/engine.js';
import type { AppraisalAction, AppraisalState, CoinSide } from '../src/game/appraisal/types.js';
import { randomAt } from '../src/game/random.js';
import { RoundReward } from '../src/appraisal-client/RoundReward.js';
import { SURVIVAL_RULES } from '../src/game/appraisal/survival.js';

type Body=AppraisalAction extends infer A?A extends AppraisalAction?Omit<A,'playerId'|'requestId'|'encounter'>:never:never;
let request=0;
const act=(s:AppraisalState,body:Body,id='alice')=>applyAppraisalAction(s,{...body,playerId:id,requestId:`reward-${++request}`,encounter:s.encounter} as AppraisalAction);
function end(s:AppraisalState):AppraisalState {
  for(let n=0;n<30 && !['REVEAL','RESULTS'].includes(s.phase);n++) {
    const p=s.players.find(p=>!p.done && !p.paused);assert(p);s=act(s,{type:'done'},p.id);
  }
  return s;
}
const start=()=>end(createAppraisalRun(['alice','bob'],'round-rewards',{marketProbability:0,bankReserve:0}));
function side(s:AppraisalState,attempt:number,id='alice'):CoinSide{return randomAt(s.seed,`${s.encounter}:${id}:round-coin:${attempt}`)<.5?'heads':'tails';}

test('odd/even end rewards issue exactly 10/15/10 once, even without merchant reserves, and never inflate encounter scores',()=>{
  let s=start();assert.equal(s.phase,'REVEAL');assert.equal(s.players[0]!.roundReward!.amount,10);assert.equal(s.players[0]!.credits,40);
  s=advanceAppraisalEncounter(s);assert.equal(s.players[0]!.credits,50);
  s=end(s);assert.equal(s.players[0]!.roundReward!.amount,15);s=advanceAppraisalEncounter(s);assert.equal(s.players[0]!.credits,65);
  s=end(s);assert.equal(s.players[0]!.roundReward!.amount,10);s=advanceAppraisalEncounter(s);
  assert.equal(s.phase,'RESULTS');assert(s.players.every(p=>p.credits===75 && p.score===0));assert.equal(s.ledger.length,6);
  assert.deepEqual(replayAppraisalAudit(exportAppraisalAudit(s)),s);assertAppraisalInvariants(s);
});
test('multiple correct guesses add 5 each; stopping banks the whole pending amount exactly once',()=>{
  let s=start();for(const attempt of [1,2,3])s=act(s,{type:'round-flip',guess:side(s,attempt),attempt});
  assert.equal(s.players[0]!.roundReward!.amount,25);assert.equal(s.players[0]!.credits,40);
  assert.equal(appraisalViewFor(s,'bob').self.roundReward!.amount,10);assert(!JSON.stringify(appraisalViewFor(s,'alice')).includes(s.seed));
  const command={type:'round-bank',playerId:'alice',requestId:'bank-once',encounter:1} as const;
  s=applyAppraisalAction(s,command);assert.equal(s.players[0]!.credits,65);assert.equal(applyAppraisalAction(s,command),s);
  assert.throws(()=>act(s,{type:'round-bank'}));assert.throws(()=>act(s,{type:'round-flip',guess:'heads',attempt:4}));
  s=advanceAppraisalEncounter(s);assert.equal(s.players[0]!.credits,65);assert.equal(s.players[1]!.credits,50);
});
test('a loss after two wins forfeits base and all bonus while preserving the existing wallet',()=>{
  let s=start();for(const attempt of [1,2])s=act(s,{type:'round-flip',guess:side(s,attempt),attempt});
  s=act(s,{type:'round-flip',guess:side(s,3)==='heads'?'tails':'heads',attempt:3});
  assert.equal(s.players[0]!.roundReward!.amount,0);assert(s.players[0]!.roundReward!.settled);assert.equal(s.players[0]!.credits,40);
  assert.throws(()=>act(s,{type:'round-bank'}));assert.throws(()=>act(s,{type:'round-flip',guess:'heads',attempt:4}));
  s=advanceAppraisalEncounter(s);assert.equal(s.players[0]!.credits,40);assert.equal(s.players[1]!.credits,50);
  while(s.phase!=='RESULTS')s=s.phase==='REVEAL'?advanceAppraisalEncounter(s):end(s);
  assert.deepEqual(replayAppraisalAudit(exportAppraisalAudit(s)),s);
});
test('duplicate coin commands replay once, changed request bodies and stale attempts reject atomically',()=>{
  let s=start();const command={type:'round-flip',guess:side(s,1),attempt:1,playerId:'alice',requestId:'flip-once',encounter:1} as const;
  s=applyAppraisalAction(s,command);assert.equal(applyAppraisalAction(s,command),s);
  const before=structuredClone(s);
  for(const bad of [{...command,guess:command.guess==='heads'?'tails':'heads'}, {...command,requestId:'other'}, {...command,attempt:3,requestId:'skip'}])assert.throws(()=>applyAppraisalAction(s,bad as AppraisalAction));
  assert.deepEqual(s,before);s=advanceAppraisalEncounter(s);assert.throws(()=>act(s,{type:'round-flip',guess:'heads',attempt:1}));
});
test('coin results depend on seat and attempt, independently of request IDs and other seats',()=>{
  const s=start();const alice={type:'round-flip',guess:side(s,1),attempt:1} as const;
  const a=act(s,alice);const b=act(act(s,{type:'round-flip',guess:side(s,1,'bob'),attempt:1},'bob'),alice);
  assert.deepEqual(a.players[0]!.roundReward,b.players[0]!.roundReward);
});
test('historical config without round rewards retains the original economy',()=>{
  const fresh=createAppraisalRun(['alice','bob'],'historical',{marketProbability:0});const config={...fresh.config};delete config.roundRewards;
  let s=restoreAppraisalRun(['alice','bob'],'historical',config);
  while(s.phase!=='RESULTS')s=s.phase==='REVEAL'?advanceAppraisalEncounter(s):end(s);
  assert(s.players.every(p=>p.credits===40 && !p.roundReward));assert.deepEqual(replayAppraisalAudit(exportAppraisalAudit(s)),s);
});
test('reward views show cashout, repeat play and explicit zero after loss with both coin faces',()=>{
  let s=start();const render=()=>renderToStaticMarkup(createElement(RoundReward,{reward:s.players[0]!.roundReward!,submit:()=>{},disabled:false,onTossing:()=>{}}));
  let html=render();for(const text of ['รับเลย 10 เครดิต','ทายหัว','ทายก้อย','เงินเดิมในกระเป๋ายังอยู่','coin-heads','coin-tails'])assert(html.includes(text),text);
  s=act(s,{type:'round-flip',guess:side(s,1),attempt:1});html=render();assert(html.includes('หยุดและรับ 15 เครดิต'));assert(html.includes('เล่นต่อ'));assert(html.includes('ทายถูก! เพิ่ม 5 เครดิต'));
  s=act(s,{type:'round-flip',guess:side(s,2)==='heads'?'tails':'heads',attempt:2});html=render();assert(html.includes('รางวัลช่วงนี้เหลือ 0 เครดิต'));assert(!html.includes('<button'));
});
test('survival refills after each completed trading interval and can spend it at the next merchant before the match ends',()=>{
  let s=createAppraisalRun(['alice','bob'],'trade-interval-income',{survival:SURVIVAL_RULES,marketProbability:0,startingCredits:200});
  const decline=(id:string)=>{while(s.players.find(p=>p.id===id)!.eventOffer){const offer=s.players.find(p=>p.id===id)!.eventOffer!;s=act(s,{type:'event',key:offer.key,choice:'decline'},id);}};
  for(const encounter of [1,2]) {
    assert.equal(s.phase,'PORTALS');assert.equal(s.encounter,encounter);
    assert.equal(appraisalViewFor(s,'alice').roundRewardBase,encounter%2?10:15);
    for(const id of ['alice','bob']) {decline(id);const portal=s.players.find(p=>p.id===id)!.portals.find(portal=>!portal.disabled)!;s=act(s,{type:'enter',portalId:portal.id},id);}
    assert.equal(s.phase,'APPRAISAL');decline('alice');
    const item=s.items[s.players[0]!.stock[0]!]!;const before=s.players[0]!.credits;
    s=act(s,{type:'buy',itemIds:[item.id],condition:false});assert(s.players[0]!.credits<before);
    assert.equal(s.players[0]!.roundReward,undefined);const afterPurchase=s.players[0]!.credits;
    s=end(s);assert.equal(s.phase,'REVEAL');assert.equal(s.players[0]!.credits,afterPurchase);
    assert(s.players.every(p=>p.life!>0));assert.equal(s.collector,undefined);
    assert.equal(s.players[0]!.roundReward!.amount,encounter%2?10:15);
    const html=renderToStaticMarkup(createElement(RoundReward,{reward:s.players[0]!.roundReward!,submit:()=>{},disabled:false,onTossing:()=>{}}));
    assert(html.includes(`เครดิตหลังจบช่วงซื้อขาย ${encounter}`));assert(html.includes('ก่อนเลือกประตูครั้งถัดไป'));
    s=act(s,{type:'round-bank'});assert.equal(s.players[0]!.credits,afterPurchase+(encounter%2?10:15));
    s=advanceAppraisalEncounter(s);assert.equal(s.phase,'PORTALS');assert.equal(s.players[0]!.inventory.length,encounter);
  }
  assert.equal(s.encounter,3);assertAppraisalInvariants(s);
  while(s.phase!=='RESULTS')s=s.phase==='REVEAL'?advanceAppraisalEncounter(s):end(s);
  assert.deepEqual(replayAppraisalAudit(exportAppraisalAudit(s)),s);
});
test('income does not give dead survival spectators new rewards; living seats can gamble',()=>{
  let s=createAppraisalRun(['alice','bob'],'survival-rewards',{survival:SURVIVAL_RULES,marketProbability:0});
  s.players[0]!.life=1;s=end(s);assert.equal(s.players[0]!.life,0);assert.equal(s.players[0]!.roundReward,undefined);assert(s.players[1]!.roundReward);
  assert.throws(()=>act(s,{type:'round-flip',guess:'heads',attempt:1}));s=advanceAppraisalEncounter(s);assert.equal(s.players[0]!.credits,40);assert.equal(s.players[1]!.credits,50);
});
