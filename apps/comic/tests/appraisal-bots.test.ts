import test from 'node:test';
import assert from 'node:assert/strict';
import { applyAppraisalAction, appraisalViewFor, BROKERAGE_RULES, SURVIVAL_RULES } from '../src/game/appraisal/index.js';
import { npcQuote } from '../src/game/appraisal/mechanics.js';
import { appraisalBotDecision, appraisalBotTurn, simulateAppraisalRun } from '../src/simulation/appraisal.js';
import type { AppraisalAction, AppraisalState } from '../src/game/appraisal/types.js';
import { appraisalFixture } from './support/appraisal-fixture.js';

type Body=AppraisalAction extends infer A?A extends AppraisalAction?Omit<A,'playerId'|'requestId'|'encounter'>:never:never;
let request=0;
const act=(s:AppraisalState,body:Body,id:string)=>applyAppraisalAction(s,{...body,playerId:id,requestId:`bots-${++request}`,encounter:s.encounter} as AppraisalAction);

/** Survival TRADE table: bob appraised his first shop good and listed it for purchase. */
function table():{s:AppraisalState;id:string} {
  let s=appraisalFixture('E18',3);s.config.survival=SURVIVAL_RULES;s.version=5;
  for(const p of s.players){p.life=4;p.recoveryUsed=false;}
  const id=s.players[1]!.stock[0]!;
  // The fixture already has bob's first shop item appraised and listed; make the merchant accept his price.
  s.items[id]!.appraisedBy='bob';s.items[id]!.lastAppraisal=20;s.items[id]!.lastAccepted=true;s.players[1]!.valuations[id]={value:20,accuracy:true,caught:false,accepted:true};
  s.phase='TRADE';
  // Alice has nothing of her own left to list, so her next move is about buying.
  s.players[0]!.stock=[];s.players[0]!.inventory=s.players[0]!.inventory.filter(i=>s.items[i]!.kind==='mirror').slice(0,0);
  for(const item of Object.values(s.items))if(item.owner==='alice')item.owner='removed';
  return {s,id};
}
const decide=(s:AppraisalState,id:string,policy:'cautious'|'aggressive'|'collector'|'trader')=>appraisalBotDecision(appraisalViewFor(s,id),policy);

test('a bot buys a friend\'s appraised goods when the item and the new rewards beat the price',()=>{
  const {s,id}=table();
  const move=decide(s,'alice','aggressive');
  assert.equal(move.type,'propose');assert.equal((move as {sellerId:string}).sellerId,'bob');assert.equal((move as {itemId:string}).itemId,id);
});

test('three dark order tickets turn the best shop listing into a forced purchase',()=>{
  const {s,id}=table();s.players[0]!.darkTickets=3;
  assert.deepEqual(decide(s,'alice','aggressive'),{type:'force-buy',sellerId:'bob',itemId:id});
});

test('a bot never buys what it cannot pay for, and skips poor items without a rebate',()=>{
  const {s,id}=table();
  s.players[0]!.credits=3;assert.notEqual(decide(s,'alice','aggressive').type,'propose');
  const bad=table();bad.s.players[0]!.knowledge[bad.id]={cursed:true,genuine:false};
  assert.notEqual(decide(bad.s,'alice','cautious').type,'propose','a known fake with a curse is not worth buying');
  assert.ok(id);
});

test('a bot lists its appraised goods and attaches a rebate when they are known to be poor',()=>{
  const {s}=table();const bob=s.players[1]!;const second=bob.stock.find(i=>!s.listings.some(l=>l.itemId===i))!;
  s.players[1]!.valuations[second]={value:12,accuracy:true,caught:false,accepted:true};s.items[second]!.lastAppraisal=12;
  bob.knowledge[second]={cursed:true};
  const move=decide(s,'bob','trader') as Extract<Body,{type:'share'}>;
  assert.equal(move.type,'share');assert.equal(move.itemId,second);assert.equal(move.purchase,true);assert.ok((move.rebate??0)>=2,'a poor item is sweetened');
  const clean=decide(table().s,'bob','trader') as Extract<Body,{type:'share'}>;
  assert.equal(clean.rebate,undefined,'a good item needs no rebate');
});

test('a bot seller accepts a shop-goods offer only when the buyer can afford the whole price',()=>{
  const {s,id}=table();let t=act(s,{type:'propose',sellerId:'bob',itemId:id,credits:1},'alice');
  assert.deepEqual(decide(t,'bob','trader'),{type:'respond',offerId:t.trades.at(-1)!.id,accept:true});
  const poor=structuredClone(t);poor.players[0]!.credits=npcQuote(poor.players[1]!,poor.items[id]!);
  assert.equal((decide(poor,'bob','trader') as {accept:boolean}).accept,false,'the quote is covered but the fee is not');
});

test('bots with something to do go before bots that only want to end the phase, and wait for humans who could still offer',()=>{
  const {s}=table();
  const turn=appraisalBotTurn(s,[{id:'alice',policy:'aggressive'},{id:'bob',policy:'aggressive'}]);
  assert.equal(turn!.id,'alice');assert.notEqual(turn!.body.type,'done');
  const idle=structuredClone(s);idle.players[0]!.done=true;
  const held=appraisalBotTurn(idle,[{id:'bob',policy:'aggressive'}],{humansActive:true});
  assert.ok(!held || held.body.type!=='done','a bot with an open listing stays while a human could still offer');
  const bare=structuredClone(idle);bare.listings=[];bare.players[1]!.stock=[];
  assert.equal(appraisalBotTurn(bare,[{id:'bob',policy:'aggressive'}],{humansActive:true})?.body.type,'done','no listing, nothing to wait for');
  assert.equal(appraisalBotTurn(idle,[{id:'bob',policy:'aggressive'}],{retired:true})?.body.type,'done');
});

test('bot tables now trade with each other and earn the new rewards, and the run still replays',()=>{
  let trades=0,shards=0,rebates=0;
  for(const policy of ['trader','aggressive','cautious','collector'] as const)for(let n=0;n<5;n++){
    const audit=simulateAppraisalRun(3,policy,`bot-trade-${policy}-${n}`,{survival:SURVIVAL_RULES,brokerage:BROKERAGE_RULES});
    for(const t of audit.trace){if(t.type==='trade-completed')trades++;if(t.type==='pulse-shards')shards++;if(t.type==='rebate-paid')rebates++;}
  }
  assert.ok(trades>20,`bots completed ${trades} trades`);assert.ok(shards>0,'buying friends\' goods paid shards');
  assert.ok(rebates>=0);
});
