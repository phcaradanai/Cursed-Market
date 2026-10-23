import { randomAt } from '../random.js';
import { check, maxEnergyOf, maxLifeOf, ownedItem, player, trace, transfer } from './mechanics.js';
import { eligibleItems } from './theft.js';
import type { SinnerSeal } from './theft.js';
import type { AppraisalItem, AppraisalState, Appraiser } from './types.js';

export const SEALS_PER_REDEMPTION = 2;
export const REDEMPTION_CHOICES = 3;

/** A sale of one seal. Credits, energy, life and goods move atomically on acceptance; terms are inert text. */
export interface SealOffer {
  id: string;
  sealId: string;
  holderId: string;
  buyerId: string;
  credits: number;
  energy: number;
  life: number;
  /** How many carried goods the buyer must hand over; the buyer chooses which when accepting. */
  goods: number;
  terms: string;
  encounter: number;
  status: 'open' | 'accepted' | 'declined' | 'cancelled';
}
/** Slots keep the thief's goods in a server-chosen order. The holder only ever learns the slot count. */
export interface SealRedemption {
  id: string;
  holderId: string;
  thiefId: string;
  sealIds: string[];
  slots: Array<{itemId: string; gone?: boolean}>;
  encounter: number;
  status: 'open' | 'done' | 'cancelled';
}
export type SealAction =
  | {type: 'seal-offer'; sealId: string; buyerId: string; credits: number; energy: number; life: number; goods: number; terms?: string}
  | {type: 'seal-respond'; offerId: string; accept: boolean; itemIds?: string[]}
  | {type: 'seal-cancel'; offerId: string}
  | {type: 'seal-redeem'; thiefId: string}
  | {type: 'seal-pick'; redemptionId: string; slot: number};
export interface SealMarketView {
  offers: Array<SealOffer & {thiefId: string}>;
  redemption?: {id: string; thiefId: string; slots: number[]};
  /** thiefId -> seals held, so the client can offer redemption at two or more. */
  holdings: Array<{thiefId: string; count: number}>;
}

type SealState = AppraisalState & {sinnerSeals?: SinnerSeal[]; sealOffers?: SealOffer[]; sealRedemptions?: SealRedemption[]};
const seals = (state: AppraisalState) => (state as SealState).sinnerSeals ??= [];
const offers = (state: AppraisalState) => (state as SealState).sealOffers ??= [];
const redemptions = (state: AppraisalState) => (state as SealState).sealRedemptions ??= [];
const alive = (p: Appraiser) => p.paused !== 'dead' && p.life !== 0;
const text = (value: unknown) => {
  check(value === undefined || typeof value === 'string' && value.length <= 500,'seal-terms','ข้อตกลงยาวได้ไม่เกิน 500 ตัวอักษร');
  return (value as string | undefined) ?? '';
};
const amount = (value: number, code: string) => check(Number.isSafeInteger(value) && value >= 0,code,'จำนวนที่เสนอไม่ถูกต้อง');

const lockedSealIds = (state: AppraisalState): Set<string> => new Set([
  ...offers(state).filter(o => o.status === 'open').map(o => o.sealId),
  ...redemptions(state).filter(r => r.status === 'open').flatMap(r => r.sealIds),
]);
function ownSeal(state: AppraisalState, p: Appraiser, sealId: string): SinnerSeal {
  const seal = seals(state).find(s => s.id === sealId);
  check(seal && seal.holderId === p.id,'seal-owner','ไม่ได้ถือตรานี้');
  check(!lockedSealIds(state).has(seal.id),'seal-locked','ตรานี้อยู่ระหว่างข้อเสนอหรือการใช้สิทธิ์');
  return seal;
}
function moveGoods(state: AppraisalState, from: Appraiser, to: Appraiser, item: AppraisalItem): void {
  from.inventory = from.inventory.filter(id => id !== item.id);
  if(from.paid)delete from.paid[item.id];
  item.owner = to.id; to.inventory.push(item.id);
  state.listings = state.listings.filter(l => l.itemId !== item.id);
}

function offerSeal(state: AppraisalState, p: Appraiser, action: Extract<SealAction,{type:'seal-offer'}>): void {
  const seal = ownSeal(state,p,action.sealId);
  const buyer = player(state,action.buyerId);
  check(buyer.id !== p.id && alive(buyer),'seal-party','ต้องขายให้ผู้เล่นอื่นที่ยังมีชีวิต');
  for(const [value,code] of [[action.credits,'seal-credits'],[action.energy,'seal-energy'],[action.life,'seal-life']] as const)amount(value,code);
  check(Number.isSafeInteger(action.goods) && action.goods >= 0 && action.goods <= 8,'seal-items','จำนวนสินค้าที่ขอไม่ถูกต้อง');
  check(action.life === 0 || state.config.survival,'seal-life','ห้องนี้ไม่มีชีวิตให้แลก');
  check(action.credits+action.energy+action.life+action.goods > 0 || text(action.terms) !== '','seal-empty','ต้องระบุสิ่งตอบแทนหรือข้อตกลง');
  check(!offers(state).some(o => o.status === 'open' && o.sealId === seal.id),'seal-locked','ตรานี้มีข้อเสนอค้างอยู่');
  const list = offers(state);
  list.push({id:`seal-offer:${list.length+1}`,sealId:seal.id,holderId:p.id,buyerId:buyer.id,credits:action.credits,energy:action.energy,life:action.life,goods:action.goods,terms:text(action.terms),encounter:state.encounter,status:'open'});
  trace(state,p,action.type,{offerId:list.at(-1)!.id});
}

function respondOffer(state: AppraisalState, p: Appraiser, offerId: string, accept: boolean, itemIds: string[] = []): void {
  check(typeof accept === 'boolean','seal-response','คำตอบไม่ถูกต้อง');
  const offer = offers(state).find(o => o.id === offerId);
  check(offer && offer.status === 'open' && offer.buyerId === p.id && offer.encounter === state.encounter,'seal-offer','ไม่มีข้อเสนอซื้อตรานี้ให้ตอบ');
  if(!accept) { offer.status = 'declined'; return; }
  const holder = player(state,offer.holderId);
  const seal = seals(state).find(s => s.id === offer.sealId);
  check(seal && seal.holderId === holder.id && !redemptions(state).some(r => r.status === 'open' && r.sealIds.includes(seal.id)),'seal-owner','ผู้ขายไม่ได้ถือตรานี้แล้ว');
  check(alive(holder) && alive(p),'seal-party','คู่ค้าต้องยังมีชีวิต');
  check(Array.isArray(itemIds) && itemIds.length === offer.goods && new Set(itemIds).size === itemIds.length,'seal-items','ต้องเลือกสินค้าให้ตรงจำนวนที่ผู้ขายขอ');
  const goods = itemIds.map(id => ownedItem(state,p,id,true));
  check(p.credits >= offer.credits,'credits','เครดิตไม่พอ');
  check(p.energy >= offer.energy && holder.energy+offer.energy <= maxEnergyOf(state,holder),'seal-energy','พลังไม่พอหรือผู้รับเต็ม');
  if(offer.life > 0)check((p.life ?? 0) > offer.life && (holder.life ?? 0)+offer.life <= (maxLifeOf(state,holder) ?? 0),'seal-life','ชีวิตผู้จ่ายต้องเหลือ 1 ขึ้นไป และผู้รับต้องไม่เกินขีดสูงสุด');
  if(offer.credits)transfer(state,p,holder,offer.credits,'seal-sale');
  p.energy -= offer.energy; holder.energy += offer.energy;
  if(offer.life > 0) { p.life! -= offer.life; holder.life! += offer.life; }
  for(const item of goods)moveGoods(state,p,holder,item);
  offer.status = 'accepted';
  if(seal.thiefId === p.id) {
    // Buying back your own seal removes it for good, so nobody can combine it with another.
    (state as SealState).sinnerSeals = seals(state).filter(s => s.id !== seal.id);
    trace(state,p,'seal-destroyed',{sealId:seal.id});
  } else seal.holderId = p.id;
  trace(state,p,'seal-sold',{offerId:offer.id,sealId:seal.id});
}

/** The server picks up to three carried goods at random; the holder chooses a slot, never an item ID. */
function redeem(state: AppraisalState, p: Appraiser, thiefId: string): void {
  const thief = player(state,thiefId);
  check(thief.id !== p.id,'seal-party','ใช้ตรากับตัวเองไม่ได้');
  check(!redemptions(state).some(r => r.status === 'open' && r.holderId === p.id),'seal-pending','เลือกสินค้าจากตราชุดก่อนให้เสร็จก่อน');
  const locked = lockedSealIds(state);
  const usable = seals(state).filter(s => s.holderId === p.id && s.thiefId === thief.id && !locked.has(s.id));
  check(usable.length >= SEALS_PER_REDEMPTION,'seal-count','ต้องมีตราของผู้ขโมยคนเดียวกัน 2 ใบ');
  const pool = eligibleItems(state,thief);
  // Nothing to take: the seals are kept untouched for a later encounter.
  check(pool.length > 0,'seal-empty-pool','ผู้ขโมยไม่มีของติดตัวที่ยึดได้ในตอนนี้ ตรายังอยู่');
  const list = redemptions(state);
  const id = `seal-redemption:${list.length+1}`;
  const chosen: string[] = [];
  for(let i = 0; i < REDEMPTION_CHOICES && pool.length; i++)
    chosen.push(pool.splice(Math.floor(randomAt(state.seed,`${state.encounter}:${id}:${i}:seal-pick`)*pool.length),1)[0]!);
  list.push({id,holderId:p.id,thiefId:thief.id,sealIds:usable.slice(0,SEALS_PER_REDEMPTION).map(s => s.id),slots:chosen.map(itemId => ({itemId})),encounter:state.encounter,status:'open'});
  trace(state,p,'seal-redeem',{redemptionId:id,thiefId:thief.id,slots:chosen.length});
}

function pick(state: AppraisalState, p: Appraiser, redemptionId: string, slotIndex: number): void {
  const redemption = redemptions(state).find(r => r.id === redemptionId);
  check(redemption && redemption.status === 'open' && redemption.holderId === p.id && redemption.encounter === state.encounter,'seal-pick','ไม่มีชุดที่เลือกได้');
  check(Number.isSafeInteger(slotIndex) && slotIndex >= 0 && slotIndex < redemption.slots.length,'seal-slot','ช่องที่เลือกไม่ถูกต้อง');
  const slot = redemption.slots[slotIndex]!;
  check(!slot.gone,'seal-slot','ช่องนี้ว่างแล้ว เลือกช่องอื่น');
  const thief = player(state,redemption.thiefId);
  const item = state.items[slot.itemId];
  if(!item || !eligibleItems(state,thief).includes(item.id)) {
    // The good moved after the set was dealt. Show only that the slot is empty; the seals stay unspent.
    slot.gone = true;
    if(redemption.slots.every(s => s.gone))redemption.status = 'cancelled';
    return;
  }
  moveGoods(state,thief,p,item);
  // Mirrors a successful theft: seized goods keep the stolen restriction.
  item.stolen = true;
  (state as SealState).sinnerSeals = seals(state).filter(s => !redemption.sealIds.includes(s.id));
  redemption.status = 'done';
  trace(state,p,'seal-picked',{redemptionId:redemption.id,itemId:item.id,thiefId:thief.id});
}

export function handleSealAction(state: AppraisalState, p: Appraiser, action: SealAction): void {
  check(state.config.secureEconomy && alive(p),'seal','ใช้ตราคนบาปไม่ได้');
  switch(action.type) {
    case 'seal-offer': offerSeal(state,p,action); break;
    case 'seal-respond': respondOffer(state,p,action.offerId,action.accept,action.itemIds); break;
    case 'seal-cancel': {
      const offer = offers(state).find(o => o.id === action.offerId);
      check(offer && offer.status === 'open' && offer.holderId === p.id,'seal-offer','ไม่มีข้อเสนอที่ยกเลิกได้');
      offer.status = 'cancelled'; break;
    }
    case 'seal-redeem': redeem(state,p,action.thiefId); break;
    case 'seal-pick': pick(state,p,action.redemptionId,action.slot); break;
  }
}

/** Offers and unfinished redemptions last one encounter; the seals themselves never expire. */
export function closeSealOffers(state: AppraisalState): void {
  for(const offer of (state as SealState).sealOffers ?? [])if(offer.status === 'open')offer.status = 'cancelled';
  for(const r of (state as SealState).sealRedemptions ?? [])if(r.status === 'open')r.status = 'cancelled';
}

export function sealMarketViewFor(state: AppraisalState, p: Appraiser): SealMarketView {
  const s = state as SealState;
  const all = s.sinnerSeals ?? [];
  const counts = new Map<string, number>();
  for(const s of all)if(s.holderId === p.id)counts.set(s.thiefId,(counts.get(s.thiefId) ?? 0)+1);
  const open = (s.sealRedemptions ?? []).find(r => r.status === 'open' && r.holderId === p.id);
  return {
    holdings: [...counts].map(([thiefId,count]) => ({thiefId,count})),
    offers: (s.sealOffers ?? []).filter(o => o.status === 'open' && [o.holderId,o.buyerId].includes(p.id)).map(o => ({...o,thiefId:all.find(s => s.id === o.sealId)?.thiefId ?? ''})),
    ...(open ? {redemption:{id:open.id,thiefId:open.thiefId,slots:open.slots.map((slot,i) => slot.gone ? -1 : i).filter(i => i >= 0)}} : {}),
  };
}

export function sealInvariants(state: AppraisalState): void {
  const ids = new Set<string>();
  for(const seal of (state as SealState).sinnerSeals ?? []) {
    check(!ids.has(seal.id) && seal.thiefId !== seal.holderId && state.players.some(p => p.id === seal.thiefId) && state.players.some(p => p.id === seal.holderId),'seal','ตราคนบาปไม่ถูกต้อง');
    ids.add(seal.id);
  }
  for(const r of (state as SealState).sealRedemptions ?? [])if(r.status === 'open')check(r.sealIds.every(id => ids.has(id)),'seal','ชุดเลือกอ้างตราที่ไม่มีอยู่');
}
