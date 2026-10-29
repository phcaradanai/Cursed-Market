import test from 'node:test';
import { dismissEvent } from './event-dismiss.js';
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
function calls(s:AppraisalState,attempt:number):CoinSide[] {
  return Array.from({length:s.players[0]!.roundReward!.coinCount!},(_,index)=>randomAt(s.seed,`${s.encounter}:alice:round-coin:${attempt}${index?`:coin:${index+1}`:''}`)<.5?'heads':'tails');
}

test('adding coins spends the wallet at 10/15 per coin, and only a complete correct call wins',()=>{
  let s=start();const raise={type:'round-raise',coinCount:2,attempt:1,playerId:'alice',requestId:'raise-once',encounter:1} as const;
  s=applyAppraisalAction(s,raise);assert.equal(applyAppraisalAction(s,raise),s);
  assert.equal(s.players[0]!.credits,30);assert.equal(s.players[0]!.roundReward!.amount,20);
  assert.equal(s.players[0]!.roundReward!.coinCount,2);assert.equal(s.players[0]!.roundReward!.staked,10);
  const before=structuredClone(s);
  for(const body of [{type:'round-raise',coinCount:2,attempt:1},{type:'round-raise',coinCount:4,attempt:1},{type:'round-raise',coinCount:3,attempt:2},{type:'round-flip',guess:'heads',attempt:1},{type:'round-flip',guess:'tails',guesses:['heads','tails'],attempt:1}] as Body[])assert.throws(()=>act(s,body));
  assert.deepEqual(s,before);
  let guesses=calls(s,1);s=act(s,{type:'round-flip',guess:guesses[0]!,guesses,attempt:1});
  assert.equal(s.players[0]!.roundReward!.amount,30);assert.equal(s.players[0]!.roundReward!.lastFlip!.delta,10);
  guesses=calls(s,2);guesses[1]=guesses[1]==='heads'?'tails':'heads';
  s=act(s,{type:'round-flip',guess:guesses[0]!,guesses,attempt:2});
  assert.equal(s.players[0]!.roundReward!.amount,20);assert.equal(s.players[0]!.roundReward!.lastFlip!.delta,-10);
  assert.equal(s.players[0]!.roundReward!.lastFlip!.coins![0]!.correct,true);assert.equal(s.players[0]!.roundReward!.settled,false);
  assert.equal(s.players[0]!.credits,30);s=act(s,{type:'round-bank'});assert.equal(s.players[0]!.credits,50);
  s=end(advanceAppraisalEncounter(s));assert.equal(s.encounter,2);
  s=act(s,{type:'round-raise',coinCount:2,attempt:1});assert.equal(s.players[0]!.credits,35);assert.equal(s.players[0]!.roundReward!.amount,30);
  s=act(s,{type:'round-raise',coinCount:3,attempt:1});assert.equal(s.players[0]!.credits,20);assert.equal(s.players[0]!.roundReward!.amount,45);
  guesses=calls(s,1);s=act(s,{type:'round-flip',guess:guesses[0]!,guesses,attempt:1});assert.equal(s.players[0]!.roundReward!.amount,60);
  s=advanceAppraisalEncounter(s);assert.equal(s.players[0]!.credits,80);
  while(s.phase!=='RESULTS')s=s.phase==='REVEAL'?advanceAppraisalEncounter(s):end(s);
  assert.deepEqual(replayAppraisalAudit(exportAppraisalAudit(s)),s);assertAppraisalInvariants(s);
});
test('adding coins cannot borrow pending rewards or overdraw an empty wallet, and losses clamp at zero',()=>{
  let s=end(createAppraisalRun(['alice','bob'],'poor-coins',{marketProbability:0,startingCredits:9,bankReserve:0}));
  const before=structuredClone(s);assert.throws(()=>act(s,{type:'round-raise',coinCount:2,attempt:1}));assert.deepEqual(s,before);
  s=start();for(const coinCount of [2,3,4,5])s=act(s,{type:'round-raise',coinCount,attempt:1});
  assert.equal(s.players[0]!.credits,0);assert.equal(s.players[0]!.roundReward!.amount,50);
  assert.throws(()=>act(s,{type:'round-raise',coinCount:6,attempt:1}));
  for(const attempt of [1,2]){const guesses=calls(s,attempt);guesses[0]=guesses[0]==='heads'?'tails':'heads';s=act(s,{type:'round-flip',guess:guesses[0]!,guesses,attempt});}
  assert.equal(s.players[0]!.roundReward!.amount,0);assert.equal(s.players[0]!.roundReward!.settled,true);
  assert.throws(()=>act(s,{type:'round-raise',coinCount:6,attempt:3}));assert.throws(()=>act(s,{type:'round-bank'}));
  s=advanceAppraisalEncounter(s);assert.equal(s.players[0]!.credits,0);assertAppraisalInvariants(s);
});
test('a remaining pool smaller than one loss is reduced to zero without touching the wallet',()=>{
  let s=start();s.players[0]!.roundReward!.incomeBonus=2;s.players[0]!.roundReward!.amount=12;
  for(const attempt of [1,2,3])s=act(s,{type:'round-flip',guess:side(s,attempt)==='heads'?'tails':'heads',attempt});
  assert.equal(s.players[0]!.roundReward!.amount,0);assert.equal(s.players[0]!.roundReward!.lastFlip!.delta,-2);
  assert.equal(s.players[0]!.credits,40);assertAppraisalInvariants(s);
});
test('multi-coin controls show separate predictions, wallet cost, and an unaffordable raise',()=>{
  let s=start();s=act(s,{type:'round-raise',coinCount:2,attempt:1});
  const html=renderToStaticMarkup(createElement(RoundReward,{reward:s.players[0]!.roundReward!,credits:9,submit:()=>{},disabled:false,onTossing:()=>{}}));
  for(const text of ['เหรียญ 1','เหรียญ 2','โยน 2 เหรียญ','จ่าย 10 เครดิต','ได้ 10 · ผิดหัก 10','ในกระเป๋า 9 เครดิต','เครดิตในกระเป๋าไม่พอเพิ่มเหรียญ','aria-pressed="true"'])assert(html.includes(text),text);
  assert.equal((html.match(/class="coin-scene/g)??[]).length,2);
});
test('historical single-coin audits retain lose-all rules when the new flag is absent',()=>{
  const fresh=createAppraisalRun(['alice','bob'],'old-coins',{marketProbability:0});const config={...fresh.config};delete config.multiCoinRewards;
  let s=end(restoreAppraisalRun(['alice','bob'],'old-coins',config));
  assert.equal(s.players[0]!.roundReward!.coinCount,undefined);assert.throws(()=>act(s,{type:'round-raise',coinCount:2,attempt:1}));
  s=act(s,{type:'round-flip',guess:side(s,1)==='heads'?'tails':'heads',attempt:1});
  assert.equal(s.players[0]!.roundReward!.amount,0);assert.equal(s.players[0]!.roundReward!.settled,true);
  while(s.phase!=='RESULTS')s=s.phase==='REVEAL'?advanceAppraisalEncounter(s):end(s);
  assert.deepEqual(replayAppraisalAudit(exportAppraisalAudit(s)),s);
});

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
test('a loss subtracts one coin step and play continues until the pool reaches zero',()=>{
  let s=start();for(const attempt of [1,2])s=act(s,{type:'round-flip',guess:side(s,attempt),attempt});
  s=act(s,{type:'round-flip',guess:side(s,3)==='heads'?'tails':'heads',attempt:3});
  assert.equal(s.players[0]!.roundReward!.amount,15);assert(!s.players[0]!.roundReward!.settled);assert.equal(s.players[0]!.credits,40);
  for(const attempt of [4,5,6])s=act(s,{type:'round-flip',guess:side(s,attempt)==='heads'?'tails':'heads',attempt});
  assert.equal(s.players[0]!.roundReward!.amount,0);assert(s.players[0]!.roundReward!.settled);
  assert.throws(()=>act(s,{type:'round-bank'}));assert.throws(()=>act(s,{type:'round-flip',guess:'heads',attempt:7}));
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
  let html=render();for(const text of ['รับเลย 10 เครดิต','ทายหัว','ทายก้อย','เพิ่ม 1 เหรียญ · จ่าย 10 เครดิต','coin-heads','coin-tails'])assert(html.includes(text),text);
  s=act(s,{type:'round-flip',guess:side(s,1),attempt:1});html=render();assert(html.includes('หยุดและรับ 15 เครดิต'));assert(html.includes('เล่นต่อ'));assert(html.includes('ถูกครบทุกเหรียญ! เพิ่ม 5 เครดิต'));
  s=act(s,{type:'round-flip',guess:side(s,2)==='heads'?'tails':'heads',attempt:2});html=render();assert(html.includes('ทายผิด หัก 5 เครดิต · เหลือ 10 เครดิต'));assert(html.includes('เล่นต่อ'));
  for(const attempt of [3,4])s=act(s,{type:'round-flip',guess:side(s,attempt)==='heads'?'tails':'heads',attempt});
  html=render();assert(html.includes('เหลือ 0 เครดิต'));assert(!html.includes('<button'));
});
test('survival refills after each completed trading interval and can spend it at the next merchant before the match ends',()=>{
  let s=createAppraisalRun(['alice','bob'],'trade-interval-income',{survival:SURVIVAL_RULES,marketProbability:0,startingCredits:200});
  const decline=(id:string)=>{while(s.players.find(p=>p.id===id)!.eventOffer){const offer=s.players.find(p=>p.id===id)!.eventOffer!;s=act(s,{type:'event',key:offer.key,...dismissEvent(offer)},id);}};
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
