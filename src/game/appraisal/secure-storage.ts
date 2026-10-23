import type {AppraisalItem, AppraisalState, Appraiser} from './types.js';
import {check, ownedItem, player, reward, spend, trace, transfer} from './mechanics.js';

export const VAULT_INTEREST_PERCENT=4;
export const vaultInterestOf=(credits:number):number=>Math.floor(credits*VAULT_INTEREST_PERCENT/100);
export interface PersonalVault {items:string[]; credits:number; slots:number}
export interface SecuredLoan {
  id:string; borrowerId:string; lenderId:string; itemId:string;
  /** Agreed item value and deadline never change after funding. */
  collateralValue:number; principal:number; repaid:number; proposedAt:number;
  firstPayoutAt:number; dueAt:number; fundedAt?:number; settledAt?:number;
  terms:string; status:'proposed'|'countered'|'active'|'repaid'|'foreclosed'|'cancelled';
}
export type StorageAction =
  | {type:'vault-deposit-item'|'vault-withdraw-item';itemId:string}
  | {type:'vault-deposit-credits'|'vault-withdraw-credits';amount:number}
  | {type:'vault-expand'};
export type LoanAction =
  | {type:'loan-propose';lenderId:string;itemId:string;principal:number;terms?:string}
  | {type:'loan-counter';loanId:string;principal:number;terms?:string}
  | {type:'loan-respond';loanId:string;accept:boolean}
  | {type:'loan-cancel';loanId:string}
  | {type:'loan-repay';loanId:string;amount:number};

function positive(amount:number):void {
  check(Number.isSafeInteger(amount) && amount>0,'credits','จำนวนเครดิตต้องเป็นจำนวนเต็มบวก');
}
function addable(balance:number,amount:number):void {
  check(Number.isSafeInteger(balance+amount),'credits','จำนวนเครดิตเกินขอบเขต');
}
function enabled(state:AppraisalState,p:Appraiser):void {
  check(state.config.secureEconomy && state.players.includes(p),'secure-economy','ไม่ได้เปิดกติกาคลังส่วนตัวและเงินกู้');
  check(p.paused!=='dead' && p.life!==0,'dead','ผู้เล่นที่ตายแล้วทำรายการไม่ได้');
}
function afterReward(state:AppraisalState,p:Appraiser):void {
  check(state.phase==='REVEAL' && p.roundReward?.encounter===state.encounter && p.roundReward.settled,'vault-window','ฝากถอนได้หลังรับเงินท้ายช่วงเท่านั้น');
}
function loanWindow(state:AppraisalState,p:Appraiser):void {
  check(state.phase==='APPRAISAL' || state.phase==='TRADE' || state.phase==='REVEAL','loan-window','ยังทำสัญญากู้ไม่ได้');
  if(state.phase==='REVEAL')afterReward(state,p);
}
function movable(state:AppraisalState,p:Appraiser,itemId:string):AppraisalItem {
  const item=ownedItem(state,p,itemId,true);
  return item;
}
function removeFromHand(state:AppraisalState,p:Appraiser,item:AppraisalItem,owner:string):void {
  p.inventory=p.inventory.filter(id=>id!==item.id);item.owner=owner;
  state.listings=state.listings.filter(listing=>listing.itemId!==item.id);
}
export function quoteVaultExpansion(slots:number):number {
  check(Number.isSafeInteger(slots) && slots>=2,'vault-slots','จำนวนช่องคลังไม่ถูกต้อง');
  const cost=10+(slots-2)*5;positive(cost);return cost;
}
/** The threshold is the last transaction value, using only future base payouts. */
export function quoteLoanDeadline(collateralValue:number,firstPayoutAt:number):number {
  positive(collateralValue);positive(firstPayoutAt);
  const pairs=Math.floor((collateralValue-1)/25);
  const remaining=collateralValue-pairs*25;
  const steps=pairs*2+(remaining<=(firstPayoutAt%2?10:15)?1:2);
  const dueAt=firstPayoutAt+steps-1;
  check(Number.isSafeInteger(dueAt),'loan-deadline','กำหนดชำระเกินขอบเขต');return dueAt;
}
function firstPayout(state:AppraisalState):number {
  // REVEAL actions occur only after the acting player's payout was settled.
  return state.encounter+(state.phase==='REVEAL'?1:0);
}
export function handleStorageAction(state:AppraisalState,p:Appraiser,action:StorageAction):void {
  enabled(state,p);afterReward(state,p);
  const vault=p.personalVault??{items:[],credits:0,slots:2};
  switch(action.type){
    case 'vault-deposit-item':{
      check(vault.items.length<vault.slots,'vault-full','คลังส่วนตัวเต็ม');
      const item=movable(state,p,action.itemId);
      removeFromHand(state,p,item,`personal-vault:${p.id}`);
      vault.items.push(item.id);break;
    }
    case 'vault-withdraw-item':{
      check(vault.items.includes(action.itemId) && state.items[action.itemId]?.owner===`personal-vault:${p.id}`,'vault-owner','สินค้าไม่ได้อยู่ในคลังของคุณ');
      vault.items=vault.items.filter(id=>id!==action.itemId);
      state.items[action.itemId]!.owner=p.id;p.inventory.push(action.itemId);break;
    }
    case 'vault-deposit-credits':{
      positive(action.amount);check(p.credits>=action.amount,'credits','เครดิตไม่พอ');addable(vault.credits,action.amount);
      p.credits-=action.amount;vault.credits+=action.amount;
      state.ledger.push({from:p.id,to:`vault:${p.id}`,amount:action.amount,reason:'vault-deposit',encounter:state.encounter});break;
    }
    case 'vault-withdraw-credits':{
      positive(action.amount);check(vault.credits>=action.amount,'credits','เครดิตในคลังไม่พอ');addable(p.credits,action.amount);
      vault.credits-=action.amount;p.credits+=action.amount;
      state.ledger.push({from:`vault:${p.id}`,to:p.id,amount:action.amount,reason:'vault-withdraw',encounter:state.encounter});break;
    }
    case 'vault-expand':{
      const amount=quoteVaultExpansion(vault.slots);check(p.credits>=amount,'credits','เครดิตไม่พอเพิ่มช่องคลัง');
      addable(vault.slots,1);spend(state,p,amount,0,'vault-expand');vault.slots++;break;
    }
  }
  p.personalVault=vault;trace(state,p,action.type,{...action});
}
function loanOf(state:AppraisalState,p:Appraiser,id:string):SecuredLoan {
  const loan=state.loans?.find(loan=>loan.id===id);
  check(loan && (loan.borrowerId===p.id || loan.lenderId===p.id),'loan','ไม่พบสัญญาของคุณ');return loan;
}
function pending(loan:SecuredLoan):void {
  check(loan.status==='proposed' || loan.status==='countered','loan-status','ข้อเสนอนี้ปิดแล้ว');
}
function termsOf(terms:unknown):string {
  check(terms===undefined || typeof terms==='string' && terms.length<=500,'loan-terms','ข้อตกลงยาวได้ไม่เกิน 500 ตัวอักษร');return terms??'';
}
function validPrincipal(value:number,principal:number):void {
  positive(value);positive(principal);check(principal>=Math.ceil(value/2),'loan-minimum','เงินกู้ต้องไม่น้อยกว่าครึ่งราคาหลักประกัน');
}
function collateral(state:AppraisalState,p:Appraiser,itemId:string):AppraisalItem {
  const item=movable(state,p,itemId);
  check(!item.priceIntegrity?.overpriced,'loan-overpriced','สินค้าราคาเกินจริงใช้ค้ำประกันไม่ได้');
  positive(item.lastTradePrice??0);return item;
}
function returnCollateral(state:AppraisalState,loan:SecuredLoan,owner:Appraiser):void {
  const item=state.items[loan.itemId];
  check(item?.owner===`collateral:${loan.id}`,'loan-owner','เจ้าของหลักประกันไม่ตรงสัญญา');
  item.owner=owner.id;owner.inventory.push(item.id);
}
export function handleLoanAction(state:AppraisalState,p:Appraiser,action:LoanAction):void {
  enabled(state,p);loanWindow(state,p);
  if(action.type==='loan-propose'){
    const lender=player(state,action.lenderId);
    check(lender.id!==p.id && lender.paused!=='dead' && lender.life!==0,'loan-party','ต้องกู้จากผู้เล่นอื่นที่ยังมีชีวิต');
    const item=collateral(state,p,action.itemId);const value=item.lastTradePrice!;
    validPrincipal(value,action.principal);const terms=termsOf(action.terms);
    check(!state.loans?.some(loan=>loan.itemId===item.id && ['proposed','countered','active'].includes(loan.status)),'loan-collateral','สินค้านี้มีสัญญาที่ยังไม่ปิด');
    const first=firstPayout(state);const dueAt=quoteLoanDeadline(value,first);
    const loans=state.loans??=[];
    loans.push({id:`secured-loan:${loans.length+1}`,borrowerId:p.id,lenderId:lender.id,itemId:item.id,collateralValue:value,principal:action.principal,repaid:0,proposedAt:state.encounter,firstPayoutAt:first,dueAt,terms,status:'proposed'});
    trace(state,p,action.type,{loanId:loans.at(-1)!.id});return;
  }
  const loan=loanOf(state,p,action.loanId);
  if(action.type==='loan-counter'){
    pending(loan);check(p.id===loan.lenderId,'loan-party','เฉพาะผู้ให้กู้เสนอเงินใหม่ได้');
    validPrincipal(loan.collateralValue,action.principal);const terms=termsOf(action.terms??loan.terms);
    check(p.credits>=action.principal,'credits','เครดิตผู้ให้กู้ไม่พอ');
    loan.principal=action.principal;loan.terms=terms;loan.status='countered';
  }else if(action.type==='loan-cancel'){
    pending(loan);loan.status='cancelled';loan.settledAt=state.encounter;
  }else if(action.type==='loan-respond'){
    pending(loan);check(typeof action.accept==='boolean','loan-response','คำตอบสัญญาไม่ถูกต้อง');
    check(p.id===(loan.status==='proposed'?loan.lenderId:loan.borrowerId),'loan-party','ต้องให้อีกฝ่ายยืนยันข้อเสนอ');
    if(!action.accept){loan.status='cancelled';loan.settledAt=state.encounter;}
    else {
      const borrower=player(state,loan.borrowerId),lender=player(state,loan.lenderId);
      check(borrower.paused!=='dead' && borrower.life!==0 && lender.paused!=='dead' && lender.life!==0,'loan-party','คู่สัญญาต้องยังมีชีวิต');
      const item=collateral(state,borrower,loan.itemId);
      check(item.lastTradePrice===loan.collateralValue,'loan-price','ราคาหลักประกันเปลี่ยนแล้ว ต้องเสนอใหม่');
      validPrincipal(loan.collateralValue,loan.principal);check(lender.credits>=loan.principal,'credits','เครดิตผู้ให้กู้ไม่พอ');addable(borrower.credits,loan.principal);
      check(!state.loans!.some(other=>other!==loan && other.itemId===item.id && other.status==='active'),'loan-collateral','สินค้านี้ถูกใช้ค้ำแล้ว');
      const first=firstPayout(state),dueAt=quoteLoanDeadline(loan.collateralValue,first);
      transfer(state,lender,borrower,loan.principal,'secured-loan-fund');
      removeFromHand(state,borrower,item,`collateral:${loan.id}`);
      loan.status='active';loan.fundedAt=state.encounter;loan.firstPayoutAt=first;loan.dueAt=dueAt;
    }
  }else if(action.type==='loan-repay'){
    check(loan.status==='active' && p.id===loan.borrowerId,'loan-party','เฉพาะผู้กู้ชำระสัญญาที่ยังเปิดได้');
    check(state.encounter<=loan.dueAt,'loan-expired','พ้นกำหนดชำระแล้ว');
    positive(action.amount);check(action.amount<=loan.principal-loan.repaid,'loan-payment','ยอดชำระเกินหนี้ที่เหลือ');
    const lender=player(state,loan.lenderId);addable(lender.credits,action.amount);
    check(state.items[loan.itemId]?.owner===`collateral:${loan.id}`,'loan-owner','เจ้าของหลักประกันไม่ตรงสัญญา');
    transfer(state,p,lender,action.amount,'secured-loan-repay');loan.repaid+=action.amount;
    if(loan.repaid===loan.principal){returnCollateral(state,loan,p);loan.status='repaid';loan.settledAt=state.encounter;}
  }
  trace(state,p,action.type,{loanId:loan.id});
}
/**
 * Call after the last REVEAL repayment opportunity, before advancing.
 * `final` is the end of the match: every active loan is foreclosed as if due, so no borrower keeps both the principal and the collateral.
 */
export function settleLoansBeforeAdvance(state:AppraisalState,final=false):void {
  if(!state.config.secureEconomy)return;
  for(const loan of state.loans??[]){
    const borrower=player(state,loan.borrowerId),lender=player(state,loan.lenderId);
    const dead=borrower.paused==='dead' || borrower.life===0;
    if(loan.status==='active' && (final || state.phase==='REVEAL' && state.encounter>=loan.dueAt)){
      const due=state.encounter>=loan.dueAt;
      returnCollateral(state,loan,lender);loan.status='foreclosed';loan.settledAt=state.encounter;
      trace(state,borrower,'secured-loan-foreclosed',{loanId:loan.id,lenderId:lender.id,reason:due?'deadline':'match-end'});
    }else if((loan.status==='proposed' || loan.status==='countered') && (final || dead || lender.paused==='dead' || lender.life===0)){
      loan.status='cancelled';loan.settledAt=state.encounter;
    }
  }
}
/**
 * Paid into the wallet as an encounter begins, on the whole vault balance and with no cap.
 * The bank funds it; a bank that cannot cover a payment pays what it safely can. Never compounds on its own.
 */
export function payVaultInterest(state:AppraisalState):void {
  if(!state.config.secureEconomy)return;
  for(const p of state.players){
    const vault=p.personalVault;if(!vault || p.paused==='dead' || p.life===0)continue;
    const owed=vaultInterestOf(vault.credits);
    const amount=Math.min(owed,Math.max(0,state.bank-state.market.budget-state.reservedRewards));
    if(amount<=0)continue;
    reward(state,p,amount,'vault-interest');
    trace(state,p,'vault-interest',{balance:vault.credits,owed,paid:amount});
  }
}
export function loanViewFor(state:AppraisalState,p:Appraiser):SecuredLoan[] {
  return structuredClone((state.loans??[]).filter(loan=>loan.borrowerId===p.id || loan.lenderId===p.id));
}
export function secureStorageInvariants(state:AppraisalState):void {
  const held=new Set<string>();const ids=new Set<string>();
  for(const p of state.players){
    const vault=p.personalVault;if(!vault)continue;
    check(state.config.secureEconomy && Number.isSafeInteger(vault.slots) && vault.slots>=2 && vault.items.length<=vault.slots && Number.isSafeInteger(vault.credits) && vault.credits>=0,'vault','ข้อมูลคลังส่วนตัวไม่ถูกต้อง');
    for(const id of vault.items){check(!held.has(id) && state.items[id]?.owner===`personal-vault:${p.id}` && !p.inventory.includes(id),'vault-owner','เจ้าของคลังส่วนตัวไม่ตรง');held.add(id);}
  }
  for(const loan of state.loans??[]){
    check(state.config.secureEconomy && !ids.has(loan.id) && loan.borrowerId!==loan.lenderId && state.players.some(p=>p.id===loan.borrowerId) && state.players.some(p=>p.id===loan.lenderId),'loan','คู่สัญญาไม่ถูกต้อง');ids.add(loan.id);
    validPrincipal(loan.collateralValue,loan.principal);
    check(Number.isSafeInteger(loan.repaid) && loan.repaid>=0 && loan.repaid<=loan.principal && loan.dueAt===quoteLoanDeadline(loan.collateralValue,loan.firstPayoutAt),'loan','ยอดหรือกำหนดชำระไม่ถูกต้อง');
    if(loan.status==='active'){
      check(loan.repaid<loan.principal && !held.has(loan.itemId) && state.items[loan.itemId]?.owner===`collateral:${loan.id}`,'loan-owner','หลักประกันไม่ตรงสัญญา');held.add(loan.itemId);
    }
  }
  for(const item of Object.values(state.items)){
    if(item.owner.startsWith('personal-vault:') || item.owner.startsWith('collateral:'))check(held.has(item.id),'secure-owner','สินค้าฝากหรือค้ำไม่มีบัญชีรองรับ');
  }
}

/** Custody changes where an asset is kept, not who owns it before a loan expires. */
export function ownedAssetItemIds(state:AppraisalState,p:Appraiser):string[] {
  return [...p.inventory,...(p.npcContracts?.alien?.itemIds??[]),...(state.config.secureEconomy?[...(p.personalVault?.items??[]),...(state.loans??[]).filter(l=>l.status==='active' && l.borrowerId===p.id).map(l=>l.itemId)]:[])];
}
