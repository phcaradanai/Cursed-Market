import { itemEffectScale } from './copy-effects.js';
import { randomAt } from '../random.js';
import { ITEM_SPECS } from './content.js';
import { challengeDiscount, challengePenalty, claimText } from './challenge-rules.js';
import { learn, npcQuote, retire, trace, unlocked } from './mechanics.js';
import type { AppraisalState, Appraiser, TradeOffer } from './types.js';

/**
 * A buyer called one claim on an appraiser's listing a lie. Truth decides it when the seller accepts:
 * a lie costs the appraiser a discount, a true claim costs the buyer a penalty unless a void seal cancels it.
 * Amounts come from the appraisal price, not the commission.
 */
export function settleChallenge(state:AppraisalState,buyer:Appraiser,seller:Appraiser,offer:TradeOffer):{discount:number;penalty:number} {
  const key=offer.challenge!;const item=state.items[offer.itemId]!;const claim=state.listings.find(l=>l.itemId===offer.itemId && l.ownerId===seller.id)?.claims?.[key];
  const truth=item[key];const quote=npcQuote(seller,item);const name=ITEM_SPECS[item.kind].name;
  learn(buyer,item.id,{[key]:truth});
  const lenses=buyer.inventory.filter(id=>state.items[id]!.kind==='doubt-lens').reduce((sum,id)=>sum+itemEffectScale(state.items[id]!),0);
  if(claim===undefined || claim===truth) {
    const owed=challengePenalty(quote);const hasSeal=offer.sealId!==undefined && buyer.inventory.includes(offer.sealId) && unlocked(buyer,offer.sealId) && state.items[offer.sealId]!.kind==='void-seal';
    const sealed=hasSeal && (!state.items[offer.sealId!]!.copy || randomAt(state.seed,`${state.encounter}:${offer.id}:copy-seal`)<.4);
    if(hasSeal) retire(state,buyer,offer.sealId!,'challenge-void-seal');
    const penalty=sealed?0:owed;
    buyer.notes.push(`ท้าทายคำระบุของ${name}ผิด ผู้ประเมินพูดจริง (${claimText(key,truth)})${sealed?' ตราโมฆะยกเลิกค่าปรับ':` เสียค่าปรับ ${penalty} เครดิต`}`);
    seller.notes.push(`คำระบุของ${name}ถูกท้าทายแต่เป็นความจริง${sealed?' ผู้ซื้อใช้ตราโมฆะ ไม่ต้องจ่ายค่าปรับ':` ได้ค่าปรับ ${penalty} เครดิต`}`);
    trace(state,buyer,'challenge-lost',{offerId:offer.id,itemId:item.id,key,penalty,sealed});
    buyer.notes=buyer.notes.slice(-30);seller.notes=seller.notes.slice(-30);return {discount:0,penalty};
  }
  const discount=challengeDiscount(quote,lenses);
  buyer.notes.push(`ท้าทายคำระบุของ${name}ถูก ผู้ประเมินโกหก (จริงคือ${claimText(key,truth)}) ลดราคา ${discount} เครดิต`);
  seller.notes.push(`คำระบุของ${name}เป็นเท็จและถูกจับได้ ผู้ซื้อลดราคา ${discount} เครดิต`);
  trace(state,buyer,'challenge-won',{offerId:offer.id,itemId:item.id,key,discount});
  buyer.notes=buyer.notes.slice(-30);seller.notes=seller.notes.slice(-30);return {discount,penalty:0};
}
