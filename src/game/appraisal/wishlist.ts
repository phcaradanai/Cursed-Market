import { randomAt } from '../random.js';
import { ITEM_SPECS, NPC_SPECS, merchantKinds } from './content.js';
import { TRUST_CAP } from './market-contracts.js';
import { check, consumeStatus, learn, ownedItem, retire, reward, status, trace } from './mechanics.js';
import { WISH_MARKUPS, WISH_PROBABILITY, wishAsk, wishChance, wishPrice } from './wishlist-rules.js';
import type { AppraisalState, Appraiser, ItemKind, NpcId, WishOffer } from './types.js';

export function shopNpcOf(p:Appraiser):NpcId|undefined {
  return p.selectedPortalId?p.portals.find(portal=>portal.id===p.selectedPortalId)?.npc:undefined;
}
const freeBank=(state:AppraisalState)=>state.bank-state.market.budget-state.reservedRewards;
/** The kind this merchant asks for, fixed by the seed so the offer and its resolution agree. */
export function wishPick(state:AppraisalState,p:Appraiser,npc:NpcId):{kind:ItemKind;price:number} {
  const kinds=merchantKinds(npc,state.config.catalogVersion??1);
  const kind=kinds[Math.floor(randomAt(state.seed,`${state.encounter}:${p.id}:${npc}:wish-kind`)*kinds.length)]!;
  return {kind,price:wishPrice(kind)};
}
const maxAsk=(price:number)=>wishAsk(price,Math.max(...WISH_MARKUPS));
export function wishEligible(state:AppraisalState,p:Appraiser):boolean {
  const npc=shopNpcOf(p);
  return !!state.config.wishlist && state.phase==='APPRAISAL' && !!npc && !p.wishes?.[npc] && freeBank(state)>=maxAsk(wishPick(state,p,npc).price);
}
export function drawWishEvent(state:AppraisalState,p:Appraiser,offer:(id:'E73')=>void):boolean {
  if(!state.config.wishlist || p.eventOffer || p.paused || p.done || p.offerSlots>=2 || !wishEligible(state,p)) return false;
  if(randomAt(state.seed,`${state.encounter}:${p.id}:wish`)>=WISH_PROBABILITY) return false;
  offer('E73');return true;
}
const counts=(p:Appraiser)=>({buffs:p.statuses.filter(s=>s.id.startsWith('B') && s.charges>0).length,debuffs:p.statuses.filter(s=>s.id.startsWith('D') && s.charges>0).length});
/** The standing wish of the merchant at the table, with the odds for every asking tier. */
export function wishOffer(state:AppraisalState,p:Appraiser):WishOffer|undefined {
  const npc=shopNpcOf(p);const wish=npc && p.wishes?.[npc];
  if(!state.config.wishlist || state.phase!=='APPRAISAL' || !npc || !wish || p.life===0) return;
  const trust=p.npcTrust?.[npc]??0;const {buffs,debuffs}=counts(p);
  return {npc,kind:wish.kind,price:wish.price,trust,buffs,debuffs,tried:!!p.wishTried,
    options:WISH_MARKUPS.map(markup=>({markup,price:wishAsk(wish.price,markup),chance:wishChance(markup,trust,buffs,debuffs,status(p,'B16')?15:0)})),
    itemIds:p.inventory.filter(id=>state.items[id]!.kind===wish.kind)};
}
export function wishSell(state:AppraisalState,p:Appraiser,itemId:string,markup:number):void {
  check(state.config.wishlist && state.phase==='APPRAISAL','wish','พ่อค้านี้ยังรับซื้อตามคำขอไม่ได้');
  const npc=shopNpcOf(p);const wish=npc && p.wishes?.[npc];check(wish,'wish','พ่อค้านี้ไม่ได้บอกของที่อยากได้');
  check(!p.wishTried,'wish','ต่อรองกับพ่อค้านี้แล้วในช่วงนี้');
  check((WISH_MARKUPS as readonly number[]).includes(markup),'wish','ราคาที่เสนอไม่ถูกต้อง');
  const item=ownedItem(state,p,itemId,true);check(item.kind===wish.kind,'wish','พ่อค้าไม่ได้ต้องการสินค้าชนิดนี้');
  const price=wishAsk(wish.price,markup);check(freeBank(state)>=price,'bank','งบธนาคารไม่พอสำหรับราคานี้');
  p.wishTried=true;const name=ITEM_SPECS[item.kind].name;const who=NPC_SPECS[npc].name;
  if(!item.genuine && randomAt(state.seed,`${state.encounter}:${p.id}:${itemId}:wish-fake`)<Math.min(.9,.4*NPC_SPECS[npc].sensitivity)) {
    learn(p,itemId,{genuine:false});p.notes.push(`${who}จับได้ว่า${name}เป็นของปลอม ไม่ซื้อ`);trace(state,p,'wish-refused',{itemId,npc,reason:'fake'});
  } else {
    const trust=p.npcTrust?.[npc]??0;const {buffs,debuffs}=counts(p);const chance=wishChance(markup,trust,buffs,debuffs,status(p,'B16')?15:0);consumeStatus(p,'B16');
    if(randomAt(state.seed,`${state.encounter}:${p.id}:${itemId}:wish-deal`)*100<chance) {
      reward(state,p,price,'npc-wish');retire(state,p,itemId,'npc-wish');delete p.wishes![npc];
      if(p.npcTrust) p.npcTrust[npc]=Math.min(TRUST_CAP,trust+1);
      p.notes.push(`${who}ซื้อ${name}ตามที่ตามหา ${price} เครดิต (โอกาส ${chance}%)`);trace(state,p,'wish-sold',{itemId,npc,price,chance});
    } else {
      p.notes.push(`${who}ไม่ยอมรับราคา ${price} เครดิตสำหรับ${name} (โอกาส ${chance}%) ยังรอของชิ้นนี้ในครั้งหน้า`);trace(state,p,'wish-refused',{itemId,npc,reason:'price',chance});
    }
  }
  p.notes=p.notes.slice(-30);
}
