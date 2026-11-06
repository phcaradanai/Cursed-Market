import test from 'node:test';
import assert from 'node:assert/strict';
import {createAppraisalRun,SURVIVAL_RULES} from '../src/game/appraisal/index.js';
import {handleLoanAction,loanViewFor,reconcileNative56DebtChainCustody} from '../src/game/appraisal/secure-storage.js';
import type {AppraisalItem,AppraisalState,Appraiser} from '../src/game/appraisal/types.js';

function fixture():AppraisalState {
  const state=createAppraisalRun(['alice','bob'],'remaining48-debt-chain',{survival:{...SURVIVAL_RULES},secureEconomy:true,marketProbability:0,catalogVersion:5});
  Object.assign(state.config,{native56Effects:13});state.phase='REVEAL';state.encounter=1;state.bank=1000;
  for(const p of state.players){p.credits=300;p.roundReward={encounter:1,base:10,amount:10,flips:0,settled:true};}
  return state;
}
function seat(state:AppraisalState,id='alice'):Appraiser{return state.players.find(p=>p.id===id)!;}
function addItem(state:AppraisalState,id:string,kind:AppraisalItem['kind'],owner:string,value=200,copy?:AppraisalItem['copy']):AppraisalItem {
  const item:AppraisalItem={id,kind,base:value,genuine:true,cursed:false,ask:value,owner,npcOwnerId:owner,npc:'darkone',encounter:state.encounter,certificate:false,lastAppraisal:null,lastAccepted:null,reservation:1,lastTradePrice:value,...(copy?{copy}:{})};
  state.items[id]=item;if(owner==='alice')seat(state).inventory.push(id);return item;
}
function fund(state:AppraisalState,itemId:string,principal=100):string {
  handleLoanAction(state,seat(state),{type:'loan-propose',itemId,lenderId:'bob',principal});
  const loan=state.loans!.at(-1)!;handleLoanAction(state,seat(state,'bob'),{type:'loan-respond',loanId:loan.id,accept:true});
  reconcileNative56DebtChainCustody(state);return loan.id;
}
function at(state:AppraisalState,encounter:number):void {
  state.encounter=encounter;for(const p of state.players)p.roundReward={encounter,base:10,amount:10,flips:0,settled:true};
}
function repay(state:AppraisalState,loanId:string,amount:number):void {handleLoanAction(state,seat(state),{type:'loan-repay',loanId,amount});}
function bonusPaid(state:AppraisalState):number{return state.ledger.filter(row=>row.reason==='native56-debt-chain').reduce((sum,row)=>sum+row.amount,0);}

test('E49 pays only on aged full repayment, deduplicates the collateral origin, and caps the run at four',()=>{
  const state=fixture(),chain=addItem(state,'chain','darkone-debt-chain','alice',18);const collateral=addItem(state,'collateral-a','mirror','alice');
  let loanId=fund(state,collateral.id);let loan=state.loans!.find(row=>row.id===loanId)!;
  assert.deepEqual(loan.native56DebtChainItemIds,[chain.id]);
  assert.equal('native56DebtChainItemIds' in loanViewFor(state,seat(state))[0]!,false,'internal item custody is not exposed in the loan view');
  at(state,3);const bank=state.bank;repay(state,loanId,50);assert.equal(bonusPaid(state),0);assert.equal(state.bank,bank);
  repay(state,loanId,50);assert.equal(bonusPaid(state),2);assert.equal(state.bank,bank-2);assert.equal(loan.native56DebtChainBonusPaid,2);

  loanId=fund(state,collateral.id);loan=state.loans!.find(row=>row.id===loanId)!;at(state,5);repay(state,loanId,100);
  assert.equal(bonusPaid(state),2,'same borrower/lender/collateral origin pays once');

  const collateralB=addItem(state,'collateral-b','mirror','alice');loanId=fund(state,collateralB.id);at(state,7);repay(state,loanId,100);
  const collateralC=addItem(state,'collateral-c','mirror','alice');loanId=fund(state,collateralC.id);at(state,9);repay(state,loanId,100);
  assert.equal(bonusPaid(state),4,'distinct collateral origins share the per-run cap');
});

test('E49 permanently loses eligibility when the original chain leaves the borrower, even if returned',()=>{
  const state=fixture(),borrower=seat(state),chain=addItem(state,'chain','darkone-debt-chain','alice',18);const collateral=addItem(state,'collateral','mirror','alice');
  const loanId=fund(state,collateral.id);const loan=state.loans!.find(row=>row.id===loanId)!;
  borrower.inventory=borrower.inventory.filter(id=>id!==chain.id);chain.owner='bob';seat(state,'bob').inventory.push(chain.id);reconcileNative56DebtChainCustody(state);
  chain.owner=borrower.id;seat(state,'bob').inventory=seat(state,'bob').inventory.filter(id=>id!==chain.id);borrower.inventory.push(chain.id);reconcileNative56DebtChainCustody(state);
  assert.deepEqual(loan.native56DebtChainItemIds,[]);
  at(state,3);const bank=state.bank;repay(state,loanId,100);assert.equal(state.bank,bank);assert.equal(bonusPaid(state),0);
});

test('E49 scales a continuously-held copy and does not pay before the two-encounter age gate',()=>{
  const state=fixture();const copy=addItem(state,'copy-chain','darkone-debt-chain','alice',18,{sourceId:'origin-chain',number:1,valuePercent:40});const collateral=addItem(state,'collateral','mirror','alice',100);
  let loanId=fund(state,collateral.id,50);let loan=state.loans!.find(row=>row.id===loanId)!;assert.deepEqual(loan.native56DebtChainItemIds,[copy.id]);
  at(state,loan.fundedAt!+2);repay(state,loanId,50);assert.equal(bonusPaid(state),1,'copy strength 0.4 gives floor(50 × 200 / 10000) = 1');

  const chain=addItem(state,'original-chain','darkone-debt-chain','alice',18);const secondCollateral=addItem(state,'collateral-2','mirror','alice');
  loanId=fund(state,secondCollateral.id);loan=state.loans!.find(row=>row.id===loanId)!;assert.deepEqual(loan.native56DebtChainItemIds,[copy.id,chain.id]);
  at(state,loan.fundedAt!+1);repay(state,loanId,100);assert.equal(bonusPaid(state),1,'a loan settled before its age gate receives no E49 payout');
});
