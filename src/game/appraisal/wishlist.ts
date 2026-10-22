import { copySaleQuote, statusMagnitude } from './copy-effects.js';
import { randomAt } from '../random.js';
import { ITEM_SPECS, NPC_SPECS, merchantKinds } from './content.js';
import { TRUST_CAP } from './market-contracts.js';
import { check, consumeStatus, learn, ownedItem, retire, reward, saleApply, salePreview, spend, trace, wishSlotsOf } from './mechanics.js';
import { WISH_ENERGY, WISH_MARKUPS, WISH_MAX_ACTIVE, WISH_PROBABILITY, wishAsk, wishChance, wishDecayed, wishFloor, wishPrice } from './wishlist-rules.js';
import type { AppraisalState, Appraiser, ItemKind, NpcId, WishBookRow, WishDesk, WishOffer } from './types.js';

export function shopNpcOf(p:Appraiser):NpcId|undefined {
  return p.selectedPortalId?p.portals.find(portal=>portal.id===p.selectedPortalId)?.npc:undefined;
}
const freeBank=(state:AppraisalState)=>state.bank-state.market.budget-state.reservedRewards;
/** The kind this merchant asks for, fixed by the seed so the offer and its resolution agree. `nonce` makes every re-roll different. */
export function wishPick(state:AppraisalState,p:Appraiser,npc:NpcId,nonce=0,avoid?:ItemKind):{kind:ItemKind;price:number} {
  const all=state.config.trustAbilities?merchantKinds(npc,state.config.catalogVersion??1,!!state.config.cleanse,!!state.config.challenge,!!state.config.expansion,!!state.config.polish,true):merchantKinds(npc,state.config.catalogVersion??1);const others=all.filter(kind=>kind!==avoid);const kinds=others.length?others:all;
  const kind=kinds[Math.floor(randomAt(state.seed,`${state.encounter}:${p.id}:${npc}:wish-kind${nonce?`:${nonce}`:''}`)*kinds.length)]!;
  return {kind,price:wishPrice(kind)};
}
const maxAsk=(price:number)=>wishAsk(price,Math.max(...WISH_MARKUPS));
const contractOn=(state:AppraisalState)=>!!state.config.wishlist && !!state.config.wishContract;
type Wish={kind:ItemKind;price:number;set?:number};
/** Current offer: sinks by a fixed step each encounter but never below the kind's base price. Statuses play no part. */
export function wishNow(state:AppraisalState,wish:Wish):{price:number;next:number;age:number;floor:number} {
  const age=contractOn(state) && wish.set!==undefined?Math.max(0,state.encounter-wish.set):0;
  return {price:contractOn(state)?wishDecayed(wish.kind,wish.price,age):wish.price,next:contractOn(state)?wishDecayed(wish.kind,wish.price,age+1):wish.price,age,floor:wishFloor(wish.kind)};
}
export function wishBook(state:AppraisalState,p:Appraiser):WishBookRow[] {
  return (Object.entries(p.wishes??{}) as Array<[NpcId,Wish]>).map(([npc,wish])=>({npc,kind:wish.kind,initial:wish.price,...wishNow(state,wish)}));
}
export function wishEligible(state:AppraisalState,p:Appraiser):boolean {
  const npc=shopNpcOf(p);
  return !!state.config.wishlist && state.phase==='APPRAISAL' && !!npc && !p.wishes?.[npc] && (!contractOn(state) || p.energy>=WISH_ENERGY) && freeBank(state)>=maxAsk(wishPick(state,p,npc).price);
}
/** Record a wish. With contract rules it costs energy, keeps at most two open, and may replace an older one. */
export function applyWish(state:AppraisalState,p:Appraiser,npc:NpcId,pick:{kind:ItemKind;price:number},replaceNpc?:NpcId):void {
  if(!contractOn(state)) {p.wishes![npc]={...pick};return;}
  const here=p.wishes![npc];const open=Object.keys(p.wishes!).length;
  if(here) check(replaceNpc===undefined || replaceNpc===npc,'wish','คำขอใหม่แทนได้เฉพาะคำขอเดิมของพ่อค้านี้');
  else if(open>=wishSlotsOf(state,p,WISH_MAX_ACTIVE)) check(replaceNpc!==undefined && !!p.wishes![replaceNpc],'wish',`มีคำขอครบ ${wishSlotsOf(state,p,WISH_MAX_ACTIVE)} รายการแล้ว เลือกคำขอเดิมที่จะแทน`);
  else check(replaceNpc===undefined,'wish','ยังมีที่ว่าง ไม่ต้องแทนคำขอเดิม');
  spend(state,p,0,WISH_ENERGY,'wish-contract');
  if(!here && replaceNpc) {delete p.wishes![replaceNpc];p.notes.push(`ยกเลิกคำขอของ${NPC_SPECS[replaceNpc].name}เพื่อทำสัญญาใหม่`);}
  p.wishes![npc]={...pick,set:state.encounter};
}
/** Ask the merchant at the table to name a new wish (a fresh roll each time). */
export function wishNew(state:AppraisalState,p:Appraiser,replaceNpc?:NpcId):void {
  check(contractOn(state) && state.phase==='APPRAISAL','wish','พ่อค้านี้ยังรับทำสัญญาตามหาของไม่ได้');
  const npc=shopNpcOf(p);check(npc,'wish','ต้องเลือกพ่อค้าก่อน');
  const rolls=(p.wishRolls??0)+1;const pick=wishPick(state,p,npc,rolls,p.wishes![npc]?.kind);
  check(freeBank(state)>=maxAsk(pick.price),'bank','งบธนาคารไม่พอสำหรับคำขอนี้');
  applyWish(state,p,npc,pick,replaceNpc);p.wishRolls=rolls;
  p.notes.push(`${NPC_SPECS[npc].name}อยากได้ ${ITEM_SPECS[pick.kind].name} ให้ ${pick.price} เครดิต แต่ราคาลดลงทุกช่วง ไม่ต่ำกว่า ${wishFloor(pick.kind)} เครดิต`);p.notes=p.notes.slice(-30);
  trace(state,p,'wish-new',{npc,kind:pick.kind,price:pick.price,...(replaceNpc?{replaced:replaceNpc}:{})});
}
/** What the seat can do about wishes at this table, and what every open wish is worth now. */
export function wishDesk(state:AppraisalState,p:Appraiser):WishDesk|undefined {
  const npc=shopNpcOf(p);
  if(!contractOn(state) || state.phase!=='APPRAISAL' || !npc || p.life===0) return;
  const book=wishBook(state,p);const here=!!p.wishes?.[npc];
  const cap=wishSlotsOf(state,p,WISH_MAX_ACTIVE);
  return {npc,cost:WISH_ENERGY,cap,book,replaces:here?npc:null,replaceable:!here && book.length>=cap?book.map(row=>row.npc):[]};
}
export function drawWishEvent(state:AppraisalState,p:Appraiser,offer:(id:'E73')=>void):boolean {
  if(!state.config.wishlist || p.eventOffer || p.paused || p.done || p.offerSlots>=2 || !wishEligible(state,p)) return false;
  if(randomAt(state.seed,`${state.encounter}:${p.id}:wish`)>=WISH_PROBABILITY) return false;
  offer('E73');return true;
}
/** Pitch bonus: lucky pearl, a stronger or weaker bargaining stance. Statuses never touch the base price. */
const wishBonus=(p:Appraiser)=>statusMagnitude(p,'B16',15)+statusMagnitude(p,'B10',10)-statusMagnitude(p,'D08',10);
const counts=(p:Appraiser)=>({buffs:p.statuses.filter(s=>s.id.startsWith('B') && s.charges>0).length,debuffs:p.statuses.filter(s=>s.id.startsWith('D') && s.charges>0).length});
/** The standing wish of the merchant at the table, with the odds for every asking tier. */
export function wishOffer(state:AppraisalState,p:Appraiser):WishOffer|undefined {
  const npc=shopNpcOf(p);const wish=npc && p.wishes?.[npc];
  if(!state.config.wishlist || state.phase!=='APPRAISAL' || !npc || !wish || p.life===0) return;
  const trust=p.npcTrust?.[npc]??0;const {buffs,debuffs}=counts(p);
  const now=wishNow(state,wish);
  return {npc,kind:wish.kind,price:now.price,initial:wish.price,floor:now.floor,next:now.next,age:now.age,trust,buffs,debuffs,tried:!!p.wishTried,
    options:WISH_MARKUPS.map(markup=>({markup,price:salePreview(state,p,wishAsk(now.price,markup)),chance:wishChance(markup,trust,buffs,debuffs,wishBonus(p))})),
    itemIds:p.inventory.filter(id=>state.items[id]!.kind===wish.kind)};
}
export function wishSell(state:AppraisalState,p:Appraiser,itemId:string,markup:number):void {
  check(state.config.wishlist && state.phase==='APPRAISAL','wish','พ่อค้านี้ยังรับซื้อตามคำขอไม่ได้');
  const npc=shopNpcOf(p);const wish=npc && p.wishes?.[npc];check(wish,'wish','พ่อค้านี้ไม่ได้บอกของที่อยากได้');
  check(!p.wishTried,'wish','ต่อรองกับพ่อค้านี้แล้วในช่วงนี้');
  check((WISH_MARKUPS as readonly number[]).includes(markup),'wish','ราคาที่เสนอไม่ถูกต้อง');
  const item=ownedItem(state,p,itemId,true);check(item.kind===wish.kind,'wish','พ่อค้าไม่ได้ต้องการสินค้าชนิดนี้');
  const ask=wishAsk(wishNow(state,wish).price,markup);const price=copySaleQuote(item,salePreview(state,p,ask));check(freeBank(state)>=price,'bank','งบธนาคารไม่พอสำหรับราคานี้');
  p.wishTried=true;const name=ITEM_SPECS[item.kind].name;const who=NPC_SPECS[npc].name;
  if(!item.genuine && randomAt(state.seed,`${state.encounter}:${p.id}:${itemId}:wish-fake`)<Math.min(.9,Math.max(.05,.4*NPC_SPECS[npc].sensitivity+(state.config.polish?statusMagnitude(p,'D03',.1)-statusMagnitude(p,'B04',.1):0)))) {
    learn(p,itemId,{genuine:false});p.notes.push(`${who}จับได้ว่า${name}เป็นของปลอม ไม่ซื้อ`);trace(state,p,'wish-refused',{itemId,npc,reason:'fake'});
  } else {
    const trust=p.npcTrust?.[npc]??0;const {buffs,debuffs}=counts(p);const chance=wishChance(markup,trust,buffs,debuffs,wishBonus(p));consumeStatus(p,'B16');
    if(randomAt(state.seed,`${state.encounter}:${p.id}:${itemId}:wish-deal`)*100<chance) {
      const paid=copySaleQuote(item,saleApply(state,p,ask));reward(state,p,paid,'npc-wish');retire(state,p,itemId,'npc-wish');delete p.wishes![npc];
      if(p.npcTrust) p.npcTrust[npc]=Math.min(TRUST_CAP,trust+1);
      p.notes.push(`${who}ซื้อ${name}ตามที่ตามหา ${paid} เครดิต${paid!==ask?` (ราคาขอ ${ask} ปรับตามสถานะและลางแล้ว)`:''} (โอกาส ${chance}%)`);trace(state,p,'wish-sold',{itemId,npc,price:paid,ask,chance});
    } else {
      p.notes.push(`${who}ไม่ยอมรับราคา ${price} เครดิตสำหรับ${name} (โอกาส ${chance}%) ยังรอของชิ้นนี้ในครั้งหน้า`);trace(state,p,'wish-refused',{itemId,npc,reason:'price',chance});
    }
  }
  p.notes=p.notes.slice(-30);
}
