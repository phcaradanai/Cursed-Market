import test from 'node:test';
import assert from 'node:assert/strict';
import {createAppraisalRun,applyAppraisalAction,assertAppraisalInvariants,defaultAppraisalAction,advanceAppraisalEncounter} from '../src/game/appraisal/engine.js';
import {appraisalViewFor} from '../src/game/appraisal/views.js';
import {openRoundRewards} from '../src/game/appraisal/round-rewards.js';
import {passiveBonuses} from '../src/game/appraisal/passives.js';
import {collectRun,SURVIVAL_RULES} from '../src/game/appraisal/survival.js';
import {parseAppraisalMessage} from '../src/server/appraisal-messages.js';
import type {AppraisalAction,AppraisalState} from '../src/game/appraisal/types.js';
let sequence=0;
function fixture(survival=false):AppraisalState {
  const s=createAppraisalRun(['alice','bob'],'secure-integration',{secureEconomy:true,core2:true,polish:true,freeMerchantAction:false,encounters:10,startingCredits:200,marketProbability:0,...(survival?{survival:SURVIVAL_RULES}:{})});
  s.phase='APPRAISAL';
  for(const p of s.players){p.eventOffer=null;p.done=false;p.stock=[...p.portals[0]!.stock];p.selectedPortalId=p.portals[0]!.id;}
  return s;
}
function act(s:AppraisalState,body:object,playerId='alice'):AppraisalState {
  return applyAppraisalAction(s,{...body,playerId,encounter:s.encounter,requestId:`secure-integration-${++sequence}`} as AppraisalAction);
}
function own(s:AppraisalState):string {
  const p=s.players[0]!,id=p.stock.shift()!,item=s.items[id]!;
  item.owner=p.id;item.base=40;item.lastTradePrice=40;item.genuine=true;item.cursed=false;p.inventory.push(id);return id;
}
function reveal(s:AppraisalState):AppraisalState {
  s.phase='REVEAL';openRoundRewards(s);return act(s,{type:'round-bank'});
}
test('full action pipeline conserves wallet/vault ledger, suppresses held effects and redacts other custody',()=>{
  let s=fixture();const itemId=own(s);s.items[itemId]!.kind='noble-seal';
  const before=passiveBonuses(s,s.players[0]!).income;
  assert(before>0);assert.throws(()=>act(s,{type:'vault-deposit-item',itemId}));
  s=reveal(s);s=act(s,{type:'vault-deposit-item',itemId});s=act(s,{type:'vault-deposit-credits',amount:50});
  assert.equal(passiveBonuses(s,s.players[0]!).income,0);assert.equal(s.players[0]!.personalVault!.credits,50);
  assert.equal(appraisalViewFor(s,'alice').self.personalVault!.items[0]!.id,itemId);
  assert(!JSON.stringify(appraisalViewFor(s,'bob')).includes(itemId));
  s=act(s,{type:'vault-withdraw-credits',amount:20});s=act(s,{type:'vault-expand'});
  assert.equal(s.players[0]!.personalVault!.slots,3);assertAppraisalInvariants(s);
});
test('last-energy theft can resolve; done cannot evade RPS; timeout is rejected on the wire',()=>{
  let s=fixture();s.players[0]!.energy=1;
  s=act(s,{type:'theft-start',itemId:s.players[0]!.stock[0]!});
  assert.equal(s.players[0]!.energy,0);assert.equal(s.players[0]!.paused,null);
  assert.throws(()=>act(s,{type:'done'}),/เป่ายิ้งฉุบ/);
  const timeout=defaultAppraisalAction(s,'alice','timeout-test')!;assert.equal(timeout.type,'theft-timeout');
  assert.throws(()=>parseAppraisalMessage({type:'action',matchId:'match',action:{type:'theft-timeout',encounter:1,requestId:'forged'}}));
  const d=s.theftDuels![0]!,hand=d.hands.npc!,beat={rock:'paper',paper:'scissors',scissors:'rock'} as const;
  s=act(s,{type:'theft-hand',duelId:d.id,hand:beat[hand]});
  assert.equal(s.theftDuels![0]!.status,'won');assert.equal(s.players[0]!.paused,'exhausted');assertAppraisalInvariants(s);
});
test('secured funding, installments and maturity work through authoritative actions',()=>{
  let s=fixture();const itemId=own(s);
  s=act(s,{type:'loan-propose',lenderId:'bob',itemId,principal:30});const loanId=s.loans![0]!.id;
  s=act(s,{type:'loan-respond',loanId,accept:true},'bob');
  assert.equal(s.loans![0]!.dueAt,4);assert.equal(s.players[0]!.credits,230);assert.equal(s.players[1]!.credits,170);
  s=act(s,{type:'loan-repay',loanId,amount:10});assert.equal(s.loans![0]!.repaid,10);
  s.items[itemId]!.lastTradePrice=999;assert.equal(s.loans![0]!.collateralValue,40);
  s.encounter=4;s=reveal(s);s=act(s,{type:'loan-repay',loanId,amount:20});
  assert.equal(s.loans![0]!.status,'repaid');assert.equal(s.items[itemId]!.owner,'alice');assertAppraisalInvariants(s);
});
test('due collateral transfers on advance after the payout repayment window',()=>{
  let s=fixture();const itemId=own(s);
  s=act(s,{type:'loan-propose',lenderId:'bob',itemId,principal:20});const loanId=s.loans![0]!.id;
  s=act(s,{type:'loan-respond',loanId,accept:true},'bob');
  s.encounter=4;s.config.encounters=10;s=reveal(s);
  assert.equal(s.loans![0]!.status,'active');
  s=advanceAppraisalEncounter(s);assert.equal(s.loans![0]!.status,'foreclosed');assert.equal(s.items[itemId]!.owner,'bob');assertAppraisalInvariants(s);
});
test('Collector includes vault assets without activating their held effects',()=>{
  let s=fixture(true);const itemId=own(s);s=reveal(s);
  s=act(s,{type:'vault-deposit-item',itemId});s=act(s,{type:'vault-deposit-credits',amount:50});
  const credits=s.players[0]!.credits+50;
  for(const p of s.players){p.life=0;p.paused='dead';p.done=true;}
  collectRun(s);assertAppraisalInvariants(s);
  const result=s.collector!.find(r=>r.playerId==='alice')!;
  assert.equal(result.credits,credits);assert(result.items.some(i=>i.id===itemId));assert.equal(s.items[itemId]!.owner,'collector');
});

test('network contracts accept omitted or blank loan terms and reject forged fields',()=>{
  for(const action of [
    {type:'loan-propose',lenderId:'bob',itemId:'item',principal:20,terms:''},
    {type:'loan-counter',loanId:'loan',principal:30,terms:''},
  ]){
    const message={type:'action',matchId:'match',action:{...action,requestId:'empty-terms',encounter:1}};
    assert.equal(parseAppraisalMessage(message).type,'action');
    assert.throws(()=>parseAppraisalMessage({...message,action:{...message.action,playerId:'forged'}}));
  }
});

test('RPS participants cannot move goods or bypass an unresolved merchant choice',()=>{
  let s=fixture();const bob=s.players[1]!,itemId=bob.stock.shift()!;s.items[itemId]!.owner=bob.id;bob.inventory.push(itemId);
  bob.abilityChoice={npc:'beast',sourceId:bob.stock[0]!,itemIds:[bob.stock[0]!]};
  assert.throws(()=>act(s,{type:'theft-start',victimId:'bob'}),/เริ่มการขโมย/);
  delete bob.abilityChoice;s=act(s,{type:'theft-start',victimId:'bob'});
  assert.throws(()=>act(s,{type:'activate',itemId},'bob'),/เป่ายิ้งฉุบ/);
  assert.throws(()=>act(s,{type:'crime-clear'}),/เป่ายิ้งฉุบ/);
  const duelId=s.theftDuels![0]!.id;
  s=act(s,{type:'theft-hand',duelId,hand:'paper'});s=act(s,{type:'theft-hand',duelId,hand:'rock'},'bob');
  assert.equal(s.items[itemId]!.owner,'alice');assertAppraisalInvariants(s);
});
