import { RuleError } from '../engine.js';
import { randomAt } from '../random.js';
import { ITEM_SPECS, NPC_SPECS, itemFamily, priceRange } from './content.js';
import type { AppraisalItem, AppraisalState, Appraiser, Knowledge, RecoveryOffer, Status, StatusId } from './types.js';

export function check(condition: unknown, code: string, message: string): asserts condition {
  if (!condition) throw new RuleError(code, message);
}
export function player(state: AppraisalState, id: string): Appraiser {
  const p = state.players.find(value => value.id === id);
  check(p, 'unknown-player', 'ไม่พบผู้เล่น'); return p;
}
export function trace(state: AppraisalState, p: Appraiser, type: string, details: Record<string,unknown> = {}): void {
  state.trace.push({type, encounter:state.encounter, playerId:p.id, details});
}
export function status(p: Appraiser, id: StatusId): Status | undefined { return p.statuses.find(s => s.id === id && s.charges > 0); }
export function consumeStatus(p: Appraiser, id: StatusId): void {
  const s = status(p,id); if (s) s.charges--; p.statuses = p.statuses.filter(value => value.charges > 0);
}
export function removeStatus(p: Appraiser, id: StatusId): void { p.statuses = p.statuses.filter(s => s.id !== id); }
export function grant(state: AppraisalState, p: Appraiser, id: StatusId, targetItemId?: string): void {
  if (id.startsWith('D') && status(p,'B06')) { consumeStatus(p,'B06'); trace(state,p,'debuff-blocked',{id}); return; }
  if (!state.config.survival && ['B09','D04','D07'].includes(id) && state.encounter === state.config.encounters) return;
  const currentOnly = ['B05','B10','D02'].includes(id);
  const charges = ['B05','D01','D03','D05','D06','D10'].includes(id) ? 2 : 1;
  const expires = state.encounter + (currentOnly ? 0 : 1);
  const starts = state.encounter + (['B09','D04','D07'].includes(id) ? 1 : 0);
  const old = status(p,id);
  if (old) { old.charges = Math.max(old.charges,charges); old.expires = Math.max(old.expires,expires); }
  else p.statuses.push({id,expires,charges,starts,...(targetItemId ? {targetItemId} : {})});
  trace(state,p,'status-granted',{id,expires,charges,...(targetItemId ? {targetItemId} : {})});
}
export function spend(state: AppraisalState, p: Appraiser, credits: number, energy: number, reason: string): void {
  check(Number.isSafeInteger(credits) && credits >= 0 && Number.isSafeInteger(energy) && energy >= 0,'cost','ต้นทุนไม่ถูกต้อง');
  check(p.credits >= credits,'credits','credit ไม่พอ'); check(p.energy >= energy,'energy','พลังไม่พอ');
  p.credits -= credits; state.bank += credits; p.energy -= energy;
  if (credits) state.ledger.push({from:p.id,to:'bank',amount:credits,reason,encounter:state.encounter});
  if (energy) trace(state,p,'energy-spent',{energy,reason});
}
export function reward(state: AppraisalState, p: Appraiser, credits: number, reason: string, market = false): void {
  check(Number.isSafeInteger(credits) && credits >= 0,'reward','รางวัลไม่ถูกต้อง');
  check(credits <= state.bank - (market ? 0 : state.market.budget + state.reservedRewards),'bank','งบรางวัลไม่พอ');
  state.bank -= credits; p.credits += credits;
  if (credits) state.ledger.push({from:'bank',to:p.id,amount:credits,reason,encounter:state.encounter});
}
export function transfer(state: AppraisalState, from: Appraiser, to: Appraiser, credits: number, reason: string): void {
  check(Number.isSafeInteger(credits) && credits >= 0 && from.credits >= credits,'credits','credit ไม่พอ');
  from.credits -= credits; to.credits += credits;
  if (credits) state.ledger.push({from:from.id,to:to.id,amount:credits,reason,encounter:state.encounter});
}
export function recover(state: AppraisalState, p: Appraiser, amount: number, reason: string, minimum = false): void {
  let gained = amount;
  if (!minimum && status(p,'D10')) { gained = Math.max(0,amount-2); consumeStatus(p,'D10'); }
  const before = p.energy; p.energy = Math.min(state.config.maxEnergy,p.energy + gained);
  trace(state,p,'energy-restored',{amount:p.energy-before,reason});
}
export function healLife(state:AppraisalState,p:Appraiser,amount:number,reason:string):void {
  check(state.config.survival && p.life!==undefined && p.life>0,'life','ผู้ตายฟื้นกลับมาใน run นี้ไม่ได้');
  const before=p.life;p.life=Math.min(state.config.survival.maxLife,p.life+amount);
  trace(state,p,'life-restored',{amount:p.life-before,reason});
}
export function damageLife(state:AppraisalState,p:Appraiser,amount:number,reason:string):void {
  check(p.life!==undefined,'life','กติกานี้ไม่มีชีวิตแยก');
  const before=p.life;p.life=Math.max(0,p.life-amount);
  trace(state,p,'life-lost',{amount:before-p.life,reason});
  if(p.life===0 && !p.paused){p.paused='dead';p.done=true;p.eventOffer=null;trace(state,p,'death',{reason});}
}
export function recoveryOffer(state:AppraisalState,p:Appraiser):RecoveryOffer|undefined {
  if(!state.config.survival || p.life===0 || !p.selectedPortalId || p.recoveryUsed)return;
  const npc=p.portals.find(portal=>portal.id===p.selectedPortalId)?.npc;
  if(!npc)return;
  return ['vampire','autometa','alien'].includes(npc)?{target:'energy',credits:2,amount:3}:{target:'life',credits:4,amount:2};
}
export function unlocked(p: Appraiser, itemId: string): boolean {
  return !p.statuses.some(s => s.id === 'D09' && s.targetItemId === itemId && s.charges > 0);
}
export function ownedItem(state: AppraisalState, p: Appraiser, itemId: string, movable = false): AppraisalItem {
  const item = state.items[itemId];
  check(item && item.owner === p.id && p.inventory.includes(itemId),'owner','ไม่ได้เป็นเจ้าของสินค้า');
  check(!movable || unlocked(p,itemId),'locked','สินค้าถูกล็อก'); return item;
}
export function retire(state: AppraisalState, p: Appraiser, itemId: string, reason: string, movable = true): void {
  const item = ownedItem(state,p,itemId,movable); p.inventory = p.inventory.filter(id => id !== itemId);
  item.owner = 'removed'; state.listings = state.listings.filter(l => l.itemId !== itemId);
  p.statuses = p.statuses.filter(s => s.id !== 'D09' || s.targetItemId !== itemId);
  trace(state,p,'item-removed',{itemId,reason});
}
export function wealth(state: AppraisalState, p: Appraiser): number {
  return p.credits + p.inventory.reduce((sum,id) => {
    const item = state.items[id]!; return sum + Math.floor(item.base * (item.genuine ? 1 : .25) * (item.cursed ? .75 : 1));
  },0);
}
export function stockItem(state: AppraisalState, p: Appraiser, itemId: string): AppraisalItem {
  const item = state.items[itemId];
  check(item && item.encounter === state.encounter && item.npcOwnerId === p.id && p.stock.includes(itemId) && item.owner === `npc:${p.id}:${state.encounter}`,'stock','สินค้านี้ไม่มีในร้านแล้ว');
  return item;
}
export function known(state: AppraisalState, p: Appraiser, itemId: string): Knowledge {
  return {...state.publicKnowledge[itemId],...p.knowledge[itemId]};
}
export function learn(p: Appraiser, itemId: string, knowledge: Knowledge): void {
  p.knowledge[itemId] = {...p.knowledge[itemId],...knowledge};
}
export function inspect(state: AppraisalState, p: Appraiser, itemId: string, property: 'price'|'authenticity'|'effects'): void {
  check(['price','authenticity','effects'].includes(property),'property','ข้อมูลที่จะตรวจไม่ถูกต้อง');
  const item = state.items[itemId];
  check(item && (item.owner === p.id || p.stock.includes(itemId)),'inspect','ตรวจได้เฉพาะของตนหรือร้านปัจจุบัน');
  check(p.inspections < 2,'inspections','ใช้สิทธิ์ตรวจครบแล้ว');
  const k = known(state,p,itemId);
  check(property === 'price' ? k.base === undefined : property === 'authenticity' ? k.genuine === undefined : !k.effectsKnown || (status(p,'B02') && k.cursed === undefined),'known','รู้ข้อมูลนี้แล้ว');
  const cost = Math.max(0,1 + (status(p,'D01') ? 1 : 0) - (status(p,'B05') ? 1 : 0));
  spend(state,p,0,cost,'inspect'); consumeStatus(p,'B05'); consumeStatus(p,'D01'); p.inspections++;
  if (property === 'price') {
    if (status(p,'B01') && !status(p,'D02')) { learn(p,itemId,{base:item.base}); consumeStatus(p,'B01'); }
    else {
      const bounds = priceRange(item.kind); const offset = Math.floor(randomAt(state.seed,`${item.id}:narrow`)*4);
      learn(p,itemId,{range:[Math.max(bounds[0],item.base-offset-2),Math.min(bounds[1],item.base+5-offset)]});
    }
  } else if (property === 'authenticity') learn(p,itemId,{genuine:item.genuine});
  else {
    learn(p,itemId,{effectsKnown:true});
    if (status(p,'B02')) { learn(p,itemId,{cursed:item.cursed}); consumeStatus(p,'B02'); }
  }
  trace(state,p,'inspected',{itemId,property});
}
export function counterLimit(p: Appraiser): number { return Math.max(0,1 + (status(p,'B10') ? 1 : 0) - (status(p,'D08') ? 1 : 0)); }
export function detectionRisk(p: Appraiser, item: AppraisalItem, value: number, base = item.base): number {
  const under = Math.max(0,1-value/base);
  const modifier = (under > 0 ? (status(p,'D03') ? .1 : 0) - (status(p,'B04') ? .1 : 0) : 0) + (p.honorJob && Math.abs(value-base)>base*.1 ? .1 : 0);
  return Math.max(0,Math.min(1,.4*under*NPC_SPECS[item.npc].sensitivity+modifier));
}
export function appraise(state: AppraisalState, p: Appraiser, itemId: string, value: number, counter: boolean, acceptDanger: boolean): boolean {
  const item = stockItem(state,p,itemId);
  check(Number.isSafeInteger(value) && value >= 0 && value <= 1000,'price','ราคาประเมินไม่ถูกต้อง');
  check(counter ? p.valuations[itemId] && p.counters < counterLimit(p) : !p.valuations[itemId],'appraisal','ไม่มีสิทธิ์ประเมินหรือต่อรองเพิ่ม');
  check(item.npc !== 'darkone' || acceptDanger,'danger','ต้องยอมรับขอบเขตผลเสียของ Dark One ก่อน');
  spend(state,p,0,1,counter ? 'counter' : 'appraise'); if (counter) p.counters++;
  p.acceptedDanger ||= item.npc === 'darkone' && acceptDanger;
  const risk = detectionRisk(p,item,value);
  const caught = randomAt(state.seed,`${state.encounter}:${p.id}:${itemId}:detection`) < risk;
  const accuracy = Math.abs(value-item.base) <= item.base*.1;
  const accepted = value >= item.reservation;
  const previous = p.valuations[itemId];
  if (accuracy && !previous?.accuracy) p.accuracyBonus += 5;
  if (!accuracy && previous?.accuracy) p.accuracyBonus -= 5;
  p.valuations[itemId] = {value,accuracy,caught,accepted};
  item.lastAppraisal = value; item.lastAccepted = accepted;
  p.notes.push(accepted?`NPC ยอมรับราคา ${value} credit`:`NPC ปฏิเสธราคา ${value}; ยังซื้อราคาหน้าร้าน ${item.ask} credit ได้`);
  if (caught) p.notes.push('พ่อค้าจับได้ว่าคุณกดราคา!');
  p.notes = p.notes.slice(-30);
  consumeStatus(p,'B04'); consumeStatus(p,'D03');
  if (p.honorJob && accuracy) grant(state,p,'B07'); p.honorJob = false;
  if (p.honestyReward && accuracy) grant(state,p,p.honestyReward); p.honestyReward = null;
  p.caught ||= caught; trace(state,p,'appraised',{itemId,value,risk,caught,counter,accepted}); return caught;
}
export function npcQuote(shop:Appraiser,item:AppraisalItem):number {
  const valuation=shop.valuations[item.id];return valuation?.accepted?valuation.value:item.ask;
}
export function purchase(state: AppraisalState, buyer: Appraiser, shop: Appraiser, itemIds: string[], options: {discount?:number;condition?:boolean;grantStatus?:StatusId;lock?:boolean;barterItemId?:string} = {}): void {
  check(Array.isArray(itemIds) && itemIds.length > 0 && itemIds.length<=2 && itemIds.every(id=>typeof id==='string') && new Set(itemIds).size === itemIds.length,'bundle','ชุดสินค้าไม่ถูกต้อง');
  const items = itemIds.map(id => stockItem(state,shop,id));
  const profile = NPC_SPECS[items[0]!.npc];
  check(shop.dealMode !== 'condition' || options.condition,'condition','ข้อเสนอนี้ต้องรับเงื่อนไข');
  check(shop.dealMode !== 'cash' || !options.condition,'condition','ข้อเสนอนี้รับ credit อย่างเดียว');
  check(items.every(item => item.npc === items[0]!.npc),'bundle','สินค้าไม่ได้อยู่ร้านเดียวกัน');
  check(!options.condition || !['D04','D07'].includes(profile.condition) || !!state.config.survival || state.encounter < state.config.encounters,'condition','เงื่อนไขนี้ไม่มี encounter ถัดไป');
  const basePrice = items.reduce((sum,item) => sum + npcQuote(shop,item),0);
  const discount = (options.discount ?? 0) + (status(buyer,'B03') ? 2 : 0) + (options.condition ? profile.discount : 0);
  const price = options.barterItemId ? 0 : Math.max(0,basePrice-discount);
  const energy = 1 + (status(buyer,'D06') ? 1 : 0);
  if (options.barterItemId) ownedItem(state,buyer,options.barterItemId,true);
  spend(state,buyer,price,energy,'npc-purchase');
  if (options.barterItemId) retire(state,buyer,options.barterItemId,'npc-barter');
  consumeStatus(buyer,'B03'); consumeStatus(buyer,'D06');
  for (const item of items) {
    item.owner = buyer.id; buyer.inventory.push(item.id); shop.stock = shop.stock.filter(id => id !== item.id);
    state.listings = state.listings.filter(l => l.itemId !== item.id);
  }
  if (options.grantStatus) grant(state,buyer,options.grantStatus);
  if (options.condition) grant(state,buyer,profile.condition);
  if (options.lock) grant(state,buyer,'D09',items[0]!.id);
  trace(state,buyer,'npc-purchased',{itemIds,shopId:shop.id,price,energy,condition:options.condition ?? false});
}
export function activate(state: AppraisalState, p: Appraiser, itemId: string): void {
  const item = ownedItem(state,p,itemId); check(!p.activated.includes(itemId),'activated','เปิดใช้ชิ้นนี้ใน encounter แล้ว');
  spend(state,p,0,1,'activate'); p.activated.push(itemId);
  const spec = ITEM_SPECS[item.kind];
  if (item.cursed) grant(state,p,spec.drawback);
  if (item.genuine) {
    if (itemFamily(item.kind) === 'orb') recover(state,p,spec.energyRecovery??3,'orb');
    else if (itemFamily(item.kind) === 'key' && status(p,'D07')) removeStatus(p,'D07');
    else grant(state,p,spec.buff);
    if(state.config.survival && ['food','potion'].includes(itemFamily(item.kind)))healLife(state,p,2,'restorative-item');
  }
  if(state.config.survival && item.cursed)damageLife(state,p,1,'cursed-activation');
  if (spec.consumable) retire(state,p,itemId,'consumed',false);
  learn(p,itemId,{activationKnown:true}); trace(state,p,'item-activated',{itemId});
}
export function penaltyItem(state: AppraisalState, p: Appraiser, itemId: string): void {
  ownedItem(state,p,itemId);
  if (status(p,'B07')) { consumeStatus(p,'B07'); trace(state,p,'seizure-blocked',{itemId}); }
  else retire(state,p,itemId,'npc-penalty',false);
}
export function kill(state: AppraisalState, p: Appraiser): void {
  if (status(p,'B08')) { consumeStatus(p,'B08'); p.energy = Math.max(0,p.energy-2); trace(state,p,'death-blocked'); }
  else if(state.config.survival)damageLife(state,p,p.life!,'dark-one-contract');
  else { p.paused = 'dead'; p.done = true; p.eventOffer = null; trace(state,p,'death'); }
}
export function marketSell(state: AppraisalState, p: Appraiser, itemId: string, orderId: string): void {
  const item = ownedItem(state,p,itemId,true); const order = state.market.orders.find(o => o.id === orderId);
  check(state.market.open && state.market.encounter === state.encounter,'market-closed','Dark Market ปิดแล้ว');
  check(order && order.kind === item.kind && (order.quota[p.id] ?? 0) > 0,'market-order','ไม่มีสิทธิ์รับซื้อตามรายการ');
  check(state.market.budget >= order.price,'market-budget','งบรับซื้อหมด');
  reward(state,p,order.price,'dark-market',true); state.market.budget -= order.price; order.quota[p.id]!--;
  retire(state,p,itemId,'dark-market'); if (state.config.brokerage) { item.owner='dark-market'; state.vault!.push(itemId); }
  trace(state,p,'market-sale',{itemId,orderId,price:order.price});
}
