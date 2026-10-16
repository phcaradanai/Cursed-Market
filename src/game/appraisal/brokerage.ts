import { randomAt } from '../random.js';
import { TRUST_RULES } from './pulse.js';
import { BOND_SPECS, CONSIGN_RULES, ITEM_SPECS, UNSOLD_PENALTIES, itemFamily } from './content.js';
import type { BondSpec } from './content.js';
import { check, completeAppraisedSale, consumeStatus, damageLife, grant, healLife, known, learn, ownedItem, player, purchase, recover, removeStatus, retire, reward, saleApply, salePreview, spend, status, stockItem, trace, unlocked } from './mechanics.js';
import type { AppraisalAction, AppraisalItem, AppraisalState, Appraiser, AuctionLot, EventId, EventOffer, UnsoldChoice } from './types.js';

/* ---------- NPC × held-item events (E51–E72) ---------- */

export function bondSpec(id:EventId):BondSpec|undefined { return BOND_SPECS.find(spec=>spec.id===id); }
function currentNpc(state:AppraisalState,p:Appraiser) { return p.stock[0] ? state.items[p.stock[0]]!.npc : null; }
function shopStock(state:AppraisalState,p:Appraiser):string[] {
  return p.stock.filter(id=>state.items[id]?.owner===`npc:${p.id}:${state.encounter}`);
}
function freeBank(state:AppraisalState):number { return state.bank-state.market.budget-state.reservedRewards; }
function bondPrice(state:AppraisalState,spec:BondSpec,itemId:string):number {
  return Math.floor(ITEM_SPECS[state.items[itemId]!.kind].anchor*(spec.price??1));
}
/** What the seat would really receive: the shared sale pipeline applies to everything it owns. */
function bondQuote(state:AppraisalState,p:Appraiser,spec:BondSpec,itemId:string):number {return salePreview(state,p,bondPrice(state,spec,itemId));}
/** Held items that satisfy the NPC. Items handed over must be unlocked and unused this encounter. */
export function bondItems(state:AppraisalState,p:Appraiser,spec:BondSpec):string[] {
  const gives=['swap','sell','tribute'].includes(spec.mode);
  return p.inventory.filter(id=>{
    const item=state.items[id]!;const k=known(state,p,id);
    if(spec.kinds && !spec.kinds.includes(item.kind)) return false;
    if(spec.families && !spec.families.includes(itemFamily(item.kind))) return false;
    if(spec.exclude?.includes(item.kind)) return false;
    if(spec.known==='cursed' && k.cursed!==true) return false;
    if(spec.known==='fake' && k.genuine!==false) return false;
    return !gives || (unlocked(p,id) && !p.activated.includes(id));
  });
}
function revealTargets(state:AppraisalState,p:Appraiser,spec:BondSpec):string[] {
  return shopStock(state,p).filter(id=>spec.reveal!.some(fact=>known(state,p,id)[fact]===undefined));
}
export function bondEligible(state:AppraisalState,p:Appraiser,id:EventId):boolean {
  const spec=bondSpec(id);
  if(!spec || !state.config.brokerage || state.phase!=='APPRAISAL' || currentNpc(state,p)!==spec.npc) return false;
  const held=bondItems(state,p,spec);if(!held.length) return false;
  if(spec.mode==='swap' && !shopStock(state,p).length) return false;
  if(spec.mode==='reveal' && !revealTargets(state,p,spec).length) return false;
  if(spec.mode==='sell' && freeBank(state)<Math.max(...held.map(itemId=>bondQuote(state,p,spec,itemId)))) return false;
  if(spec.energyCost && p.energy<spec.energyCost) return false;
  if(spec.cleanse==='debuffs' && !p.statuses.some(s=>s.id.startsWith('D'))) return false;
  return true;
}
/** Item choices for the offer: shop items for swap/reveal, held items for sell/tribute, none for show. */
export function bondTargets(state:AppraisalState,p:Appraiser,id:EventId):{itemIds:string[];giveItemId?:string} {
  const spec=bondSpec(id)!;const held=bondItems(state,p,spec);
  if(spec.mode==='swap') return {itemIds:shopStock(state,p),giveItemId:held[0]!};
  if(spec.mode==='reveal') return {itemIds:revealTargets(state,p,spec)};
  if(spec.mode==='show') return {itemIds:[]};
  return {itemIds:held};
}
export function bondQuotes(state:AppraisalState,p:Appraiser,id:EventId):Record<string,number> {
  const spec=bondSpec(id);
  return spec?.mode==='sell'?Object.fromEntries(bondItems(state,p,spec).map(itemId=>[itemId,bondQuote(state,p,spec,itemId)])):{};
}
function applyGain(state:AppraisalState,p:Appraiser,spec:BondSpec):void {
  if(spec.cleanse==='D10') removeStatus(p,'D10');
  if(spec.cleanse==='debuffs') p.statuses=p.statuses.filter(s=>!s.id.startsWith('D'));
  for(const id of spec.buffs??[]) grant(state,p,id);
  for(const id of spec.debuffs??[]) grant(state,p,id);
  if(spec.energy) recover(state,p,spec.energy,spec.id);
  if(spec.life && state.config.survival && p.life!>0) healLife(state,p,spec.life,spec.id);
}
function takeFromShop(state:AppraisalState,p:Appraiser,itemId:string):void {
  const item=stockItem(state,p,itemId);
  item.owner=p.id;p.inventory.push(item.id);p.stock=p.stock.filter(id=>id!==item.id);
  state.listings=state.listings.filter(l=>l.itemId!==item.id);
}
export function resolveBond(state:AppraisalState,p:Appraiser,offer:EventOffer,command:Extract<AppraisalAction,{type:'event'}>):void {
  const spec=bondSpec(offer.id)!;
  const chosen=()=>{check(command.itemId && offer.itemIds.includes(command.itemId),'event-target','เลือกสินค้าที่อยู่ใน event');return command.itemId;};
  const stillHeld=(itemId:string)=>{check(bondItems(state,p,spec).includes(itemId),'event-target','ไม่มีของที่ NPC ต้องการแล้ว');return ownedItem(state,p,itemId,true);};
  switch(spec.mode) {
    case 'show': check(bondItems(state,p,spec).length>0,'event-target','ไม่มีของที่ NPC ต้องการแล้ว');applyGain(state,p,spec);break;
    case 'reveal': {
      const itemId=chosen();const item=stockItem(state,p,itemId);check(bondItems(state,p,spec).length>0,'event-target','ไม่มีของที่ NPC ต้องการแล้ว');
      if(spec.energyCost) spend(state,p,0,spec.energyCost,spec.id);
      const facts={base:item.base,genuine:item.genuine,cursed:item.cursed,effectsKnown:true};
      learn(p,itemId,Object.fromEntries(spec.reveal!.map(fact=>[fact,facts[fact]])));
      trace(state,p,'bond-revealed',{id:spec.id,itemId,facts:spec.reveal});break;
    }
    case 'sell': case 'tribute': {
      const itemId=chosen();stillHeld(itemId);
      if(spec.mode==='sell') reward(state,p,saleApply(state,p,bondPrice(state,spec,itemId)),spec.id);
      retire(state,p,itemId,spec.id);if(spec.mode==='tribute') applyGain(state,p,spec);break;
    }
    case 'swap': {
      const target=chosen();stockItem(state,p,target);
      const give=stillHeld(offer.giveItemId!);
      if(spec.genuineOnly && !give.genuine) {grant(state,p,'D10');p.notes.push(`${ITEM_SPECS[give.kind].name}เป็นของปลอม NPC ปฏิเสธการแลก`);trace(state,p,'bond-refused',{id:spec.id,itemId:give.id});break;}
      if(spec.risk && randomAt(state.seed,`${offer.key}:bond-risk`)<spec.risk) {grant(state,p,'D03');p.notes.push('NPC จับได้ว่าเป็นของปลอม ไม่ยอมแลก');trace(state,p,'bond-caught',{id:spec.id,itemId:give.id});break;}
      retire(state,p,give.id,spec.id);takeFromShop(state,p,target);
      trace(state,p,'bond-swapped',{id:spec.id,gave:give.id,received:target});break;
    }
  }
  p.notes=p.notes.slice(-30);
}

/* ---------- Unsold appraisals ---------- */

/** Shop items this seat appraised that are still on the NPC's table. */
export function unsoldItems(state:AppraisalState,p:Appraiser):string[] {
  if(!state.config.brokerage) return [];
  return shopStock(state,p).filter(id=>!!p.valuations[id]);
}
function leaveShop(state:AppraisalState,p:Appraiser,item:AppraisalItem):void {
  p.stock=p.stock.filter(id=>id!==item.id);state.listings=state.listings.filter(l=>l.itemId!==item.id);
}
function payUpTo(state:AppraisalState,p:Appraiser,credits:number,reason:string):number {
  const paid=Math.min(credits,p.credits);spend(state,p,paid,0,reason);return paid;
}
export function unsoldPenalty(state:AppraisalState,p:Appraiser,item:AppraisalItem):void {
  const rule=UNSOLD_PENALTIES[item.npc];
  // Spirit ward turns a credit/energy penalty into a lighter one; an open wound doubles the credits. Life penalties go through damageLife.
  const lifePenalty=!!(rule.life && state.config.survival);
  const ward=!lifePenalty && !!state.config.polish && !!status(p,'B19'),wound=!lifePenalty && !!state.config.polish && !!status(p,'D20');
  if(ward) consumeStatus(p,'B19');if(wound) consumeStatus(p,'D20');
  const paid=payUpTo(state,p,ward?0:rule.credits*(wound?2:1),'unsold-penalty');
  const drained=Math.min(Math.max(0,rule.energy-(ward?1:0)),p.energy);p.energy-=drained;
  for(const id of rule.statuses) grant(state,p,id);
  leaveShop(state,p,item);
  p.notes.push(`${ITEM_SPECS[item.kind].name}ขายไม่ออก: ${rule.text}`);p.notes=p.notes.slice(-30);
  trace(state,p,'unsold-penalty',{itemId:item.id,npc:item.npc,credits:paid,energy:drained,statuses:rule.statuses});
  if(rule.life && state.config.survival && p.life!>0) damageLife(state,p,rule.life,'unsold-penalty');
}
function consign(state:AppraisalState,p:Appraiser,item:AppraisalItem):void {
  const roll=randomAt(state.seed,`${state.encounter}:${p.id}:${item.id}:consign`);
  leaveShop(state,p,item);item.owner='dark-market';state.vault!.push(item.id);
  let outcome='clean';
  if(roll>=CONSIGN_RULES.debuffBelow) {const paid=payUpTo(state,p,CONSIGN_RULES.fee,'consign-fee');outcome=`fee:${paid}`;p.notes.push(`Dark Market รับฝากของ เก็บค่าผ่านทาง ${paid} เครดิต`);}
  else if(roll>=CONSIGN_RULES.cleanBelow) {
    // Polish rules add market inflation and hidden taxes to the debuffs a consignment can leave behind.
    const pool=state.config.polish?[...CONSIGN_RULES.debuffs,'D17' as const,'D18' as const]:CONSIGN_RULES.debuffs;
    const debuff=pool[Math.floor(randomAt(state.seed,`${state.encounter}:${p.id}:${item.id}:consign-debuff`)*pool.length)]!;
    grant(state,p,debuff);outcome=`debuff:${debuff}`;p.notes.push(`Dark Market รับฝากของ แต่ทิ้ง ${debuff} ไว้กับคุณ`);
  } else p.notes.push('Dark Market รับฝากของเงียบ ๆ ไม่มีผลติดตัว');
  p.notes=p.notes.slice(-30);
  trace(state,p,'unsold-consigned',{itemId:item.id,outcome});
}
export function settleUnsold(state:AppraisalState,p:Appraiser,itemId:string,choice:UnsoldChoice):void {
  check(['buy','penalty','consign'].includes(choice),'unsold','ตัวเลือกของค้างไม่ถูกต้อง');
  check(unsoldItems(state,p).includes(itemId),'unsold','ไม่มีของที่ประเมินแล้วค้างอยู่ในร้าน');
  const item=state.items[itemId]!;
  if(choice==='buy') purchase(state,p,p,[itemId],{condition:p.dealMode==='condition'});
  else if(choice==='penalty') unsoldPenalty(state,p,item);
  else consign(state,p,item);
}
/** Settlement: whatever is still unsold takes the NPC penalty, the one option that is always payable. */
export function settleRemainingUnsold(state:AppraisalState,p:Appraiser):void {
  if(p.paused==='dead') return;
  for(const itemId of unsoldItems(state,p)) {
    if(p.life===0) break;
    unsoldPenalty(state,p,state.items[itemId]!);
  }
}

/* ---------- Dark Market vault and sealed-bid auction ---------- */

export function vaultSale(state:AppraisalState,item:AppraisalItem):void {
  if(!state.config.brokerage) return;
  item.owner='dark-market';state.vault!.push(item.id);
}
export function auctionLots(state:AppraisalState):AuctionLot[] {
  const rules=state.config.brokerage;const vault=state.vault??[];
  if(!rules || !vault.length || randomAt(state.seed,`${state.encounter}:auction:open`)>=rules.auctionProbability) return [];
  return vault.map(itemId=>({itemId,rank:randomAt(state.seed,`${state.encounter}:auction:${itemId}:rank`)}))
    .sort((a,b)=>a.rank-b.rank).slice(0,rules.maxLots)
    .map(({itemId})=>({id:`lot-${state.encounter}-${itemId}`,itemId,minimum:Math.max(1,Math.floor(ITEM_SPECS[state.items[itemId]!.kind].anchor*.6)),bids:{}}));
}
export function placeBid(state:AppraisalState,p:Appraiser,lotId:string,credits:number):void {
  const lot=state.market.lots?.find(l=>l.id===lotId);
  check(lot && lot.winnerId===undefined,'lot','ไม่มีรายการประมูลนี้');
  check(Number.isSafeInteger(credits) && credits>=0 && credits<=1000,'bid','ราคาประมูลไม่ถูกต้อง');
  if(credits===0) {delete lot.bids[p.id];trace(state,p,'bid-withdrawn',{lotId});return;}
  check(credits>=lot.minimum,'bid',`ประมูลขั้นต่ำ ${lot.minimum} เครดิต`);
  check(p.credits>=credits,'credits','credit ไม่พอสำหรับราคาประมูล');
  lot.bids[p.id]=credits;trace(state,p,'bid-placed',{lotId});
}
/** Highest live bid that can still pay wins; ties break by seed. Bids are sealed until settlement. */
export function settleAuction(state:AppraisalState):void {
  for(const lot of state.market.lots??[]) {
    if(lot.winnerId!==undefined) continue;
    const bidders=Object.entries(lot.bids).map(([id,amount])=>({p:player(state,id),amount,tie:randomAt(state.seed,`${lot.id}:${id}:tie`)}))
      .filter(b=>b.p.paused!=='dead' && b.p.life!==0).sort((a,b)=>b.amount-a.amount || a.tie-b.tie);
    const winner=bidders.find(b=>b.p.credits>=b.amount);
    if(!winner) {lot.winnerId=null;continue;}
    const item=state.items[lot.itemId]!;
    const edge=!!state.config.polish && !!status(winner.p,'B20');const paid=edge?winner.amount-Math.floor(winner.amount*20/100):winner.amount;
    if(edge) consumeStatus(winner.p,'B20');
    spend(state,winner.p,paid,0,'dark-auction');
    completeAppraisedSale(state,item,paid);
    item.owner=winner.p.id;winner.p.inventory.push(item.id);state.vault=state.vault!.filter(id=>id!==item.id);
    lot.winnerId=winner.p.id;lot.price=paid;
    winner.p.darkTickets=(winner.p.darkTickets??0)+1;winner.p.notes.push(`ชนะประมูล ได้ตั๋วคำสั่งมืด ${winner.p.darkTickets}/${TRUST_RULES.ticketsToForce}`);winner.p.notes=winner.p.notes.slice(-30);
    trace(state,winner.p,'auction-won',{lotId:lot.id,itemId:item.id,price:paid,...(edge?{bid:winner.amount}:{})});
  }
}
