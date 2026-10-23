import { randomAt } from '../random.js';
import { copySaleQuote } from './copy-effects.js';
import { check, ownedItem, retire, reward, spend, trace } from './mechanics.js';
import type { AppraisalItem, AppraisalState, Appraiser } from './types.js';

/** Audits use the immutable value of this item, never a kind anchor or its trading history. */
export function priceAuditChance(base:number,value:number):number {
  if(value<base*1.5)return 0;
  if(value<base*2)return .25;
  return value<base*2.5?.5:1;
}

/** Call once after a committed appraisal or completed cash sale, never from a quote/view. */
export function auditItemPrice(state:AppraisalState,item:AppraisalItem,value:number,sourceKey:string):void {
  if(!state.config.secureEconomy)return;
  check(Number.isSafeInteger(value) && value>=0,'price','ราคาที่ตรวจสอบไม่ถูกต้อง');
  const integrity=item.priceIntegrity??={overpriced:false,audits:0};
  integrity.audits++;
  const chance=priceAuditChance(item.base,value);
  const flagged=randomAt(state.seed,`${state.encounter}:${item.id}:price-integrity:${sourceKey}:${integrity.audits}`)<chance;
  if(flagged)integrity.overpriced=true;
  state.trace.push({encounter:state.encounter,playerId:item.owner,type:'price-audited',details:{itemId:item.id,value,source:sourceKey,chance,flagged}});
}

/** Barter has no verified cash price; callers must not pass its cash adjustment here. */
export function recordItemTrade(state:AppraisalState,item:AppraisalItem,paidPrice:number):void {
  if(!state.config.secureEconomy)return;
  check(Number.isSafeInteger(paidPrice) && paidPrice>=0,'price','ราคาซื้อขายไม่ถูกต้อง');
  item.lastTradePrice=paidPrice;
  auditItemPrice(state,item,paidPrice,'trade');
}

/** Quotes supplied here must come from published system orders/contracts, never a player asking price. */
export function systemSaleQuote(state:AppraisalState,item:AppraisalItem,quote:number):number {
  return state.config.secureEconomy && item.priceIntegrity?.overpriced?0:quote;
}

/** Emergency cash sales cannot turn a fabricated trade price into money from the bank. */
export function liquidationQuote(state:AppraisalState,item:AppraisalItem):number {
  const reference=Math.max(0,Math.min(item.base,item.priceIntegrity?.certifiedPrice??item.base));
  return systemSaleQuote(state,item,copySaleQuote(item,Math.floor(Math.min(item.lastTradePrice??reference,reference))));
}

export function liquidateOwnedItem(state:AppraisalState,p:Appraiser,itemId:string):void {
  check(state.config.secureEconomy && ['APPRAISAL','TRADE'].includes(state.phase),'liquidate','ยังขายของเพื่อรับเงินสดไม่ได้');
  const item=ownedItem(state,p,itemId,true);
  check(!item.stolen,'stolen','ของที่ฉกมาขาย Dark Market ไม่ได้');
  const price=liquidationQuote(state,item);
  reward(state,p,price,'emergency-liquidation');
  recordItemTrade(state,item,price);
  retire(state,p,itemId,'emergency-liquidation');
  trace(state,p,'item-liquidated',{itemId,price});
}

/** Reappraisal is an explicit owner action: one paid attempt per item per encounter. */
export function reappraiseOwnedItem(state:AppraisalState,p:Appraiser,itemId:string,value:number):void {
  check(state.config.secureEconomy && ['APPRAISAL','TRADE'].includes(state.phase),'reappraisal','ยังประเมินของในมือใหม่ไม่ได้');
  const item=ownedItem(state,p,itemId,true);
  check(Number.isSafeInteger(value) && value>=0 && value<=1000,'price','ราคาประเมินไม่ถูกต้อง');
  check(item.priceIntegrity?.lastReappraisedEncounter!==state.encounter,'reappraisal-used','ประเมินของชิ้นนี้ใหม่แล้วในช่วงนี้');
  spend(state,p,0,1,'reappraise-owned');
  const integrity=item.priceIntegrity??={overpriced:false,audits:0};
  integrity.lastReappraisedEncounter=state.encounter;
  const success=Math.abs(value-item.base)<=item.base*.1;
  auditItemPrice(state,item,value,'owner-reappraisal');
  if(success) {
    integrity.overpriced=false;integrity.certifiedPrice=value;
    item.lastAppraisal=value;item.lastAccepted=true;
  }
  p.notes.push(success?'ประเมินใหม่สำเร็จ ล้างตราราคาเกินจริงแล้ว':'ประเมินใหม่ไม่สำเร็จ ตราราคาเกินจริงยังคงอยู่');
  p.notes=p.notes.slice(-30);
  trace(state,p,'item-reappraised',{itemId,value,success});
}

/** Public history and warnings only; never expose the hidden base value. */
export function integrityItemView(state:AppraisalState,item:AppraisalItem):{lastTradePrice?:number;overpriced?:boolean;reappraisalUsed?:boolean} {
  if(!state.config.secureEconomy)return {};
  return {...(item.lastTradePrice!==undefined?{lastTradePrice:item.lastTradePrice}:{}),overpriced:!!item.priceIntegrity?.overpriced,
    reappraisalUsed:item.priceIntegrity?.lastReappraisedEncounter===state.encounter};
}
