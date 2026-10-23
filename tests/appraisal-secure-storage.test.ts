import test from 'node:test';
import assert from 'node:assert/strict';
import {createAppraisalRun,SURVIVAL_RULES} from '../src/game/appraisal/index.js';
import {handleStorageAction,handleLoanAction,quoteLoanDeadline,quoteVaultExpansion,settleLoansBeforeAdvance,secureStorageInvariants,loanViewFor} from '../src/game/appraisal/secure-storage.js';
import type {AppraisalState,Appraiser} from '../src/game/appraisal/types.js';

function fixture():AppraisalState {
  const state=createAppraisalRun(['alice','bob','eve'],'secure-storage-tests',{survival:{...SURVIVAL_RULES},secureEconomy:true,marketProbability:0});
  state.phase='REVEAL';state.encounter=1;
  for(const p of state.players){p.credits=200;p.roundReward={encounter:1,base:10,amount:10,flips:0,settled:true};}
  return state;
}
function seat(state:AppraisalState,id='alice'):Appraiser{return state.players.find(p=>p.id===id)!;}
function own(state:AppraisalState,value=40):string {
  const p=seat(state);const id=`collateral-${p.inventory.length}`;
  state.items[id]={id,kind:'mirror',base:40,genuine:true,cursed:false,ask:40,owner:p.id,npcOwnerId:p.id,npc:'orc',encounter:state.encounter,certificate:false,lastAppraisal:null,lastAccepted:null,reservation:1,lastTradePrice:value};
  p.inventory.push(id);return id;
}
function fund(state:AppraisalState,itemId=own(state),principal=20):string {
  handleLoanAction(state,seat(state),{type:'loan-propose',itemId,lenderId:'bob',principal});
  const loanId=state.loans!.at(-1)!.id;
  handleLoanAction(state,seat(state,'bob'),{type:'loan-respond',loanId,accept:true});return loanId;
}

test('vault opens only after own payout and rejects dead players',()=>{
  const s=fixture(),p=seat(s),itemId=own(s);
  s.phase='TRADE';assert.throws(()=>handleStorageAction(s,p,{type:'vault-deposit-item',itemId}),/หลังรับเงิน/);
  s.phase='REVEAL';p.roundReward!.settled=false;
  assert.throws(()=>handleStorageAction(s,p,{type:'vault-deposit-item',itemId}),/หลังรับเงิน/);
  p.roundReward!.settled=true;p.paused='dead';p.life=0;
  assert.throws(()=>handleStorageAction(s,p,{type:'vault-deposit-item',itemId}),/ตาย/);
  assert.equal(s.items[itemId]!.owner,p.id);
});

test('vault has two free item slots, removes held effects, and enforces ownership and locks',()=>{
  const s=fixture(),p=seat(s),ids=[own(s),own(s),own(s)];
  p.statuses.push({id:'D09',targetItemId:ids[0]!,charges:1,starts:1,expires:2});
  assert.throws(()=>handleStorageAction(s,p,{type:'vault-deposit-item',itemId:ids[0]!}),/ล็อก/);
  p.statuses=[];
  s.listings.push({ownerId:p.id,itemId:ids[0]!,purchase:true});
  for(const itemId of ids.slice(0,2))handleStorageAction(s,p,{type:'vault-deposit-item',itemId});
  assert.equal(p.personalVault!.slots,2);assert.equal(p.inventory.length,1);assert.equal(s.listings.length,0);
  assert.equal(s.items[ids[0]!]!.owner,'personal-vault:alice');
  assert.throws(()=>handleStorageAction(s,p,{type:'vault-deposit-item',itemId:ids[2]!}),/เต็ม/);
  assert.throws(()=>handleStorageAction(s,seat(s,'bob'),{type:'vault-withdraw-item',itemId:ids[0]!}),/คลังของคุณ/);
  handleStorageAction(s,p,{type:'vault-withdraw-item',itemId:ids[0]!});
  assert.equal(s.items[ids[0]!]!.owner,'alice');assert(p.inventory.includes(ids[0]!));secureStorageInvariants(s);
});

test('vault expansion costs 10 then 15 then 20, and money transfers conserve total without interest',()=>{
  const s=fixture(),p=seat(s);assert.deepEqual([2,3,4,5].map(quoteVaultExpansion),[10,15,20,25]);
  for(let n=0;n<3;n++)handleStorageAction(s,p,{type:'vault-expand'});
  assert.equal(p.credits,155);assert.equal(p.personalVault!.slots,5);
  handleStorageAction(s,p,{type:'vault-deposit-credits',amount:50});
  assert.equal(p.credits,105);assert.equal(p.personalVault!.credits,50);
  assert.deepEqual(s.ledger.at(-1),{from:'alice',to:'vault:alice',amount:50,reason:'vault-deposit',encounter:1});
  handleStorageAction(s,p,{type:'vault-withdraw-credits',amount:20});
  assert.equal(p.credits+p.personalVault!.credits,155);assert.equal(p.personalVault!.credits,30);
  for(const amount of [0,-1,0.5,NaN,Infinity,Number.MAX_SAFE_INTEGER+1])assert.throws(()=>handleStorageAction(s,p,{type:'vault-deposit-credits',amount}));
  assert.throws(()=>handleStorageAction(s,p,{type:'vault-withdraw-credits',amount:31}),/ไม่พอ/);
  secureStorageInvariants(s);
});

test('deadline uses frozen collateral value, alternating base payouts, and starting encounter parity',()=>{
  assert.equal(quoteLoanDeadline(40,1),4);assert.equal(quoteLoanDeadline(40,2),4);
  assert.equal(quoteLoanDeadline(10,1),1);assert.equal(quoteLoanDeadline(15,2),2);
  assert.equal(quoteLoanDeadline(25,1),2);assert.equal(quoteLoanDeadline(26,1),3);
  assert.equal(quoteLoanDeadline(40,3),6);
  for(const value of [0,-1,0.5,NaN,Infinity])assert.throws(()=>quoteLoanDeadline(value,1));
  assert.throws(()=>quoteLoanDeadline(40,Number.MAX_SAFE_INTEGER));
});

test('loan needs both parties, can be countered, and transfers lender cash with collateral escrow',()=>{
  const s=fixture(),p=seat(s),bob=seat(s,'bob'),itemId=own(s);
  handleLoanAction(s,p,{type:'loan-propose',lenderId:'bob',itemId,principal:20,terms:'Pay in two installments.'});
  const loan=s.loans![0]!;assert.equal(s.items[itemId]!.owner,'alice');assert.equal(bob.credits,200);
  assert.throws(()=>handleLoanAction(s,p,{type:'loan-respond',loanId:loan.id,accept:true}),/อีกฝ่าย/);
  assert.throws(()=>handleLoanAction(s,seat(s,'eve'),{type:'loan-respond',loanId:loan.id,accept:true}),/สัญญาของคุณ/);
  handleLoanAction(s,bob,{type:'loan-counter',loanId:loan.id,principal:30});
  assert.throws(()=>handleLoanAction(s,bob,{type:'loan-respond',loanId:loan.id,accept:true}),/อีกฝ่าย/);
  handleLoanAction(s,p,{type:'loan-respond',loanId:loan.id,accept:true});
  assert.equal(p.credits,230);assert.equal(bob.credits,170);assert.equal(loan.principal,30);
  assert.equal(loan.firstPayoutAt,2);assert.equal(loan.dueAt,4);assert.equal(s.items[itemId]!.owner,`collateral:${loan.id}`);
  assert(!p.inventory.includes(itemId));assert.throws(()=>handleLoanAction(s,p,{type:'loan-respond',loanId:loan.id,accept:true}),/ปิดแล้ว/);
  secureStorageInvariants(s);
});

test('loan pricing and collateral checks reject zero history, underfunding, inflated and locked goods',()=>{
  const s=fixture(),p=seat(s),itemId=own(s),item=s.items[itemId]!;
  const propose=()=>handleLoanAction(s,p,{type:'loan-propose',itemId,lenderId:'bob',principal:20});
  item.lastTradePrice=0;assert.throws(propose,/จำนวนเต็มบวก/);item.lastTradePrice=40;
  assert.throws(()=>handleLoanAction(s,p,{type:'loan-propose',itemId,lenderId:'bob',principal:19}),/ครึ่งราคา/);
  item.priceIntegrity={overpriced:true,audits:1};assert.throws(propose,/ราคาเกินจริง/);delete item.priceIntegrity;
  p.statuses.push({id:'D09',targetItemId:itemId,charges:1,starts:1,expires:2});assert.throws(propose,/ล็อก/);p.statuses=[];
  propose();assert.throws(propose,/สัญญาที่ยังไม่ปิด/);
  seat(s,'bob').credits=19;assert.throws(()=>handleLoanAction(s,seat(s,'bob'),{type:'loan-respond',loanId:s.loans![0]!.id,accept:true}),/ไม่พอ/);
  assert.equal(s.items[itemId]!.owner,'alice');assert.equal(p.credits,200);
});

test('acceptance revalidates ownership, price and collateral integrity without moving any money on failure',()=>{
  const s=fixture(),p=seat(s),bob=seat(s,'bob'),itemId=own(s);
  handleLoanAction(s,p,{type:'loan-propose',itemId,lenderId:'bob',principal:20});
  const loanId=s.loans![0]!.id;
  handleStorageAction(s,p,{type:'vault-deposit-item',itemId});
  assert.throws(()=>handleLoanAction(s,bob,{type:'loan-respond',loanId,accept:true}),/เจ้าของ/);
  handleStorageAction(s,p,{type:'vault-withdraw-item',itemId});s.items[itemId]!.lastTradePrice=50;
  assert.throws(()=>handleLoanAction(s,bob,{type:'loan-respond',loanId,accept:true}),/ราคา.*เปลี่ยน/);
  assert.equal(p.credits,200);assert.equal(bob.credits,200);
});

test('installments return item only when fully repaid, and reject overpayments or third-party actions',()=>{
  const s=fixture(),p=seat(s),bob=seat(s,'bob'),itemId=own(s),loanId=fund(s,itemId,25);
  handleLoanAction(s,p,{type:'loan-repay',loanId,amount:10});assert.equal(s.loans![0]!.repaid,10);
  assert.equal(s.items[itemId]!.owner,`collateral:${loanId}`);
  assert.throws(()=>handleLoanAction(s,bob,{type:'loan-repay',loanId,amount:15}),/เฉพาะผู้กู้/);
  assert.throws(()=>handleLoanAction(s,p,{type:'loan-repay',loanId,amount:16}),/เกินหนี้/);
  handleLoanAction(s,p,{type:'loan-repay',loanId,amount:15});
  assert.equal(s.loans![0]!.status,'repaid');assert.equal(s.items[itemId]!.owner,p.id);
  assert.equal(p.credits,200);assert.equal(bob.credits,200);secureStorageInvariants(s);
});

test('deadline permits final payout repayment before foreclosure, preserving original price and principal independence',()=>{
  const s=fixture(),itemId=own(s);s.phase='TRADE';const loanId=fund(s,itemId,40),loan=s.loans![0]!;
  assert.equal(loan.dueAt,4);s.items[itemId]!.lastTradePrice=999;
  s.encounter=3;s.phase='REVEAL';settleLoansBeforeAdvance(s);assert.equal(loan.status,'active');
  s.encounter=4;seat(s).roundReward={encounter:4,base:15,amount:15,flips:0,settled:true};
  handleLoanAction(s,seat(s),{type:'loan-repay',loanId,amount:40});settleLoansBeforeAdvance(s);
  assert.equal(loan.status,'repaid');assert.equal(s.items[itemId]!.owner,'alice');
  const unpaid=fixture(),collateralId=own(unpaid),unpaidId=fund(unpaid,collateralId);
  handleLoanAction(unpaid,seat(unpaid),{type:'loan-repay',loanId:unpaidId,amount:5});
  unpaid.encounter=4;settleLoansBeforeAdvance(unpaid);settleLoansBeforeAdvance(unpaid);
  assert.equal(unpaid.loans![0]!.status,'foreclosed');assert.equal(unpaid.items[collateralId]!.owner,'bob');
  assert.equal(seat(unpaid,'bob').inventory.filter(id=>id===collateralId).length,1);secureStorageInvariants(unpaid);
});

test('borrower death keeps escrow until deadline, and loan views remain private detached copies',()=>{
  const s=fixture(),itemId=own(s),loanId=fund(s,itemId);
  seat(s).paused='dead';seat(s).life=0;settleLoansBeforeAdvance(s);
  assert.equal(s.loans![0]!.status,'active');assert.equal(s.items[itemId]!.owner,`collateral:${loanId}`);
  assert.deepEqual(loanViewFor(s,seat(s,'eve')),[]);
  const view=loanViewFor(s,seat(s,'bob'));view[0]!.principal=900;assert.equal(s.loans![0]!.principal,20);
  s.encounter=4;settleLoansBeforeAdvance(s);assert.equal(s.items[itemId]!.owner,'bob');secureStorageInvariants(s);
});

test('vault and loan invariants detect orphaned escrow and duplicate storage ownership',()=>{
  const s=fixture(),itemId=own(s);handleStorageAction(s,seat(s),{type:'vault-deposit-item',itemId});
  secureStorageInvariants(s);seat(s).personalVault!.items.push(itemId);assert.throws(()=>secureStorageInvariants(s),/เจ้าของคลัง/);
  seat(s).personalVault!.items=[];assert.throws(()=>secureStorageInvariants(s),/ไม่มีบัญชี/);
});
