import { randomAt } from '../random.js';
import { CORE2 } from './core2.js';
import { check, consumeStatus, spend, stockItem, trace, transfer, unlocked } from './mechanics.js';
import type { AppraisalItem, AppraisalState, Appraiser, NpcId } from './types.js';

export type RpsHand = 'rock' | 'paper' | 'scissors';
export interface CrimeRecord {
  failures: number;
  banStartsEncounter: number;
  banUntilEncounter: number;
  cases: Array<{itemId: string; ask: number; npc: NpcId}>;
}
/** A victim's proof of a defeated PvP theft. The thief never changes; holders may trade it. */
export interface SinnerSeal {
  id: string;
  thiefId: string;
  holderId: string;
  duelId: string;
  issuedEncounter: number;
}
/** Fixed at defeat: the installment never follows later resale of the item. */
export interface PvpCompensation {
  id: string;
  duelId: string;
  thiefId: string;
  victimId: string;
  itemId: string;
  snapshot: number;
  amount: number;
  dueEncounters: number[];
  settled: Array<{encounter: number; paid: number}>;
}
export interface TheftDuel {
  id: string;
  encounter: number;
  thiefId: string;
  victimId?: string;
  npc?: NpcId;
  itemId: string;
  ask: number;
  hands: Record<string, RpsHand>;
  round: number;
  status: 'open' | 'won' | 'lost' | 'cancelled';
  revealed: Array<{thief: RpsHand; opponent: RpsHand}>;
}
export interface TheftDuelView {
  id: string;
  thiefId: string;
  victimId?: string;
  npc?: NpcId;
  npcTell?: {preferredHand: RpsHand; text: string};
  round: number;
  status: TheftDuel['status'];
  needsChoice: boolean;
  submitted: boolean;
  revealed: TheftDuel['revealed'];
}
export interface TheftView {
  duels: TheftDuelView[];
  targets: Array<{playerId: string; blockedUntilEncounter?: number}>;
  seals: Array<{id: string; thiefId: string}>;
  compensation: Array<{id: string; role: 'payer' | 'receiver'; otherId: string; amount: number; remaining: number[]; paid: number}>;
  crime?: {
    failures: number;
    banStartsEncounter: number;
    banUntilEncounter: number;
    active: boolean;
    noticePrice: number;
    cases: number;
  };
}

type TheftState = AppraisalState & {theftDuels?: TheftDuel[]; sinnerSeals?: SinnerSeal[]; compensations?: PvpCompensation[]};
/** pvpBlocks maps a victim to the last encounter in which this thief may not target them again. */
type Thief = Appraiser & {crime?: CrimeRecord; pvpBlocks?: Record<string, number>};
const PVP_COOLDOWN_ENCOUNTERS = 2;
export const PVP_COMPENSATION_PERCENT = 5;
export const PVP_COMPENSATION_INSTALLMENTS = 4;
const pvpBlockedUntil = (state: AppraisalState, thief: Appraiser, victimId: string): number | undefined => {
  const until = (thief as Thief).pvpBlocks?.[victimId];
  return until !== undefined && state.encounter <= until ? until : undefined;
};
const hands: readonly RpsHand[] = ['rock', 'paper', 'scissors'];
const npcTells: Record<NpcId,{preferredHand:RpsHand;text:string}> = {
  orc: {preferredHand:'rock',text:'ออร์คชอบกำหมัดข่มขู่ แต่บางครั้งก็เปลี่ยนท่า'},
  vampire: {preferredHand:'scissors',text:'แวมไพร์ชอบยกสองนิ้วคล้ายเขี้ยว แต่บางครั้งก็ซ่อนเขี้ยว'},
  autometa: {preferredHand:'paper',text:'เครื่องจักรมักกางฝ่ามือสแกน แต่บางครั้งก็เปลี่ยนรูปแบบ'},
  alien: {preferredHand:'scissors',text:'เอเลี่ยนมักชูสองนิ้ว แต่บางครั้งก็เลียนแบบท่าอื่น'},
  darkone: {preferredHand:'paper',text:'ผู้มืดมักกางมือคลุมเงา แต่บางครั้งก็หุบมือ'},
  beast: {preferredHand:'rock',text:'อสูรมักกำหมัดแน่น แต่บางครั้งก็เปลี่ยนท่า'},
  deepsea: {preferredHand:'paper',text:'ชาวบาดาลมักแผ่มือคล้ายครีบ แต่บางครั้งก็พับครีบ'},
  swarm: {preferredHand:'scissors',text:'รังแมลงมักยกก้ามคู่ แต่บางครั้งก็เปลี่ยนท่า'},
};
/** A merchant's public habit is a clue, never the sealed hand of the current duel. */
export function npcTheftTell(npc: NpcId): {preferredHand:RpsHand;text:string} {
  return {...npcTells[npc]};
}
const opponentKey = (duel: TheftDuel) => duel.victimId ?? 'npc';
const note = (p: Appraiser, text: string) => { p.notes.push(text); p.notes = p.notes.slice(-30); };
const openDuel = (state: AppraisalState, playerId: string) => (state as TheftState).theftDuels?.some(d => d.status === 'open' && [d.thiefId,d.victimId].includes(playerId));

/** Only carried, movable goods can be stolen. Escrow and personal vault goods are not inventory. */
export function eligibleItems(state: AppraisalState, victim: Appraiser): string[] {
  return victim.inventory.filter(id => {
    const item = state.items[id];
    return item?.owner === victim.id && unlocked(victim,id) && !victim.npcContracts?.alien?.itemIds.includes(id) &&
      !state.trades.some(t => t.status === 'open' && (t.itemId === id || t.swapItemId === id));
  }).sort();
}

function npcHand(state: AppraisalState, duel: TheftDuel): RpsHand {
  const preferred = npcTheftTell(duel.npc!).preferredHand;
  const roll = randomAt(state.seed,`${duel.id}:round:${duel.round}:npc`);
  if(roll < .6)return preferred;
  const alternatives = hands.filter(hand => hand !== preferred);
  return alternatives[Math.min(1,Math.floor((roll-.6)/.2))]!;
}

export function merchantTradeBanned(state: AppraisalState, p: Appraiser): boolean {
  const crime = (p as Thief).crime;
  return !!crime && state.encounter >= crime.banStartsEncounter && state.encounter <= crime.banUntilEncounter;
}

/** Start one paid attempt. Merchant hands are sealed before the thief submits a choice. */
export function startTheftDuel(state: AppraisalState, p: Appraiser, target: {itemId?: string; victimId?: string}): void {
  check(state.config.core2 && ['APPRAISAL','TRADE'].includes(state.phase) && !p.paused && !p.done && !p.eventOffer && !p.abilityChoice,'steal','ช่วงนี้ขโมยไม่ได้');
  check(!p.stealTried?.length && !openDuel(state,p.id),'steal','ขโมยได้ครั้งเดียวต่อช่วง');
  let item: AppraisalItem;
  let victim: Appraiser | undefined;
  if(target.victimId) {
    victim = state.players.find(v => v.id === target.victimId);
    check(victim && victim.id !== p.id && !victim.paused && !victim.done && !victim.eventOffer && !victim.abilityChoice && !openDuel(state,victim.id),'steal','เริ่มการขโมยกับผู้เล่นนี้ไม่ได้');
    const eligible = eligibleItems(state,victim);
    check(eligible.length > 0,'steal','เริ่มการขโมยกับผู้เล่นนี้ไม่ได้');
    check(pvpBlockedUntil(state,p,victim.id) === undefined,'steal-cooldown','แพ้การขโมยผู้เล่นคนนี้ ต้องรออีก 2 ช่วงก่อนขโมยซ้ำ');
    // The server chooses the concealed good, never accepts a guessed private item ID.
    const index = Math.floor(randomAt(state.seed,`${state.encounter}:${p.id}:${victim.id}:theft-item`)*eligible.length);
    item = state.items[eligible[index]!]!;
  } else {
    check(target.itemId,'steal','เลือกสินค้าที่จะขโมย');
    item = stockItem(state,p,target.itemId);
  }
  spend(state,p,0,CORE2.steal.energy,'theft-duel');
  (p.stealTried ??= []).push(victim ? `p:${victim.id}` : item.id);
  consumeStatus(p,'B22');
  const duels = ((state as TheftState).theftDuels ??= []);
  const duel: TheftDuel = {
    id: `theft-${state.encounter}-${p.id}-${duels.length}`,
    encounter: state.encounter, thiefId: p.id, itemId: item.id, ask: item.ask,
    ...(victim ? {victimId: victim.id} : {npc: item.npc}),
    hands: {}, round: 1, status: 'open', revealed: [],
  };
  if(!victim)duel.hands.npc = npcHand(state,duel);
  duels.push(duel);
  trace(state,p,'theft-started',{duelId:duel.id,...(victim ? {victimId:victim.id} : {itemId:item.id,npc:item.npc})});
}

function stillEligible(state: AppraisalState, duel: TheftDuel): boolean {
  if(duel.encounter !== state.encounter || !['APPRAISAL','TRADE'].includes(state.phase))return false;
  const item = state.items[duel.itemId];
  const thief = state.players.find(p => p.id === duel.thiefId);
  if(!thief || thief.paused || thief.done || !item)return false;
  if(duel.victimId) {
    const victim = state.players.find(p => p.id === duel.victimId);
    return !!victim && !victim.paused && !victim.done && eligibleItems(state,victim).includes(item.id);
  }
  return thief.stock.includes(item.id) && item.encounter === state.encounter && item.npcOwnerId === thief.id && item.owner === `npc:${thief.id}:${state.encounter}`;
}

/** Invalidate moved goods without revealing or transferring them; the original attempt stays spent. */
export function cancelTheftDuels(state: AppraisalState): void {
  for(const duel of (state as TheftState).theftDuels ?? []) {
    if(duel.status === 'open' && !stillEligible(state,duel)) {
      duel.status = 'cancelled'; duel.hands = {};
    }
  }
}

/** Defeat in a PvP duel: one seal for the victim and a per-victim cooldown. Draws and cancellations never reach this. */
function playerFailure(state: AppraisalState, thief: Appraiser, duel: TheftDuel): void {
  const victimId = duel.victimId!;
  ((thief as Thief).pvpBlocks ??= {})[victimId] = state.encounter+PVP_COOLDOWN_ENCOUNTERS;
  const seals = ((state as TheftState).sinnerSeals ??= []);
  seals.push({id:`seal-${duel.id}`,thiefId:thief.id,holderId:victimId,duelId:duel.id,issuedEncounter:state.encounter});
  // Without a recorded trade price no reference exists, so no instalments are scheduled.
  const snapshot = state.items[duel.itemId]?.lastTradePrice ?? 0;
  const amount = Math.floor(snapshot*PVP_COMPENSATION_PERCENT/100);
  if(amount > 0)((state as TheftState).compensations ??= []).push({
    id:`comp-${duel.id}`,duelId:duel.id,thiefId:thief.id,victimId,itemId:duel.itemId,snapshot,amount,settled:[],
    dueEncounters:Array.from({length:PVP_COMPENSATION_INSTALLMENTS},(_,i) => state.encounter+1+i),
  });
  note(thief,`เป่ายิ้งฉุบแพ้ ขโมยผู้เล่นไม่สำเร็จ: เหยื่อได้ตราคนบาป ขโมยคนเดิมไม่ได้ 2 ช่วง${amount > 0 ? ` และต้องจ่ายชดเชยช่วงละ ${amount} เครดิต ${PVP_COMPENSATION_INSTALLMENTS} ช่วง` : ''}`);
  const victim = state.players.find(v => v.id === victimId)!;
  note(victim,'จับขโมยได้: ได้ตราคนบาปของผู้ขโมยหนึ่งใบ');
}

function merchantFailure(state: AppraisalState, p: Appraiser, duel: TheftDuel): void {
  const npc = duel.npc!;
  (p.npcTrust ??= {})[npc] = Math.max(0,(p.npcTrust[npc] ?? 0)-2);
  const previous = (p as Thief).crime;
  (p as Thief).crime = {
    failures: (previous?.failures ?? 0)+1,
    banStartsEncounter: previous && previous.banUntilEncounter >= state.encounter ? previous.banStartsEncounter : state.encounter+1,
    banUntilEncounter: Math.max(previous?.banUntilEncounter ?? state.encounter,state.encounter)+1,
    cases: [...(previous?.cases ?? []),{itemId:duel.itemId,ask:duel.ask,npc}],
  };
  note(p,'ขโมยพลาด: ความเชื่อใจพ่อค้าคนนี้ลด 2 และเพิ่มโทษห้ามค้าขายหนึ่งช่วง');
}

export function chooseTheftHand(state: AppraisalState, p: Appraiser, duelId: string, hand: RpsHand): void {
  check(hands.includes(hand),'theft-hand','เลือกค้อน กระดาษ หรือกรรไกร');
  const duel = (state as TheftState).theftDuels?.find(d => d.id === duelId);
  check(duel && duel.status === 'open' && [duel.thiefId,duel.victimId].includes(p.id),'theft-duel','ไม่มีการเป่ายิ้งฉุบที่เลือกได้');
  if(!stillEligible(state,duel)) { duel.status = 'cancelled'; duel.hands = {}; return; }
  check(!duel.hands[p.id],'theft-hand','ส่งมือแล้ว เปลี่ยนไม่ได้');
  duel.hands[p.id] = hand;
  const thiefHand = duel.hands[duel.thiefId];
  const opponentHand = duel.hands[opponentKey(duel)];
  if(!thiefHand || !opponentHand)return;
  duel.revealed.push({thief:thiefHand,opponent:opponentHand});
  duel.hands = {};
  if(thiefHand === opponentHand) {
    duel.round++;
    if(!duel.victimId)duel.hands.npc = npcHand(state,duel);
    return;
  }
  const won = (thiefHand === 'rock' && opponentHand === 'scissors') || (thiefHand === 'scissors' && opponentHand === 'paper') || (thiefHand === 'paper' && opponentHand === 'rock');
  duel.status = won ? 'won' : 'lost';
  const thief = state.players.find(v => v.id === duel.thiefId)!;
  if(won) {
    const item = state.items[duel.itemId]!;
    if(duel.victimId) {
      const victim = state.players.find(v => v.id === duel.victimId)!;
      victim.inventory = victim.inventory.filter(id => id !== item.id);
      if(victim.paid)delete victim.paid[item.id];
      note(victim,'ของที่ถืออยู่ถูกขโมยหนึ่งชิ้น');
    } else thief.stock = thief.stock.filter(id => id !== item.id);
    item.owner = thief.id;
    // Preserve the existing stolen-good restriction until laundering rules are agreed.
    item.stolen = true;
    thief.inventory.push(item.id);
    state.listings = state.listings.filter(l => l.itemId !== item.id);
    note(thief,'เป่ายิ้งฉุบชนะ ขโมยสินค้าได้');
  } else if(duel.npc)merchantFailure(state,thief,duel);
  else playerFailure(state,thief,duel);
  trace(state,thief,'theft-resolved',{duelId:duel.id,result:duel.status});
}

const gone = (p: Appraiser) => p.paused === 'dead' || p.life === 0;
/**
 * Call once as an encounter begins. Each instalment is keyed by encounter, so replays never charge twice.
 * Only carried credits are taken: a short wallet pays what it has and the rest is forgiven, never a debt.
 */
export function collectCompensations(state: AppraisalState): void {
  for(const comp of (state as TheftState).compensations ?? []) {
    if(!comp.dueEncounters.includes(state.encounter) || comp.settled.some(s => s.encounter === state.encounter))continue;
    const thief = state.players.find(p => p.id === comp.thiefId)!, victim = state.players.find(p => p.id === comp.victimId)!;
    const paid = gone(thief) || gone(victim) ? 0 : Math.min(comp.amount,thief.credits);
    if(paid > 0) {
      transfer(state,thief,victim,paid,'theft-compensation');
      note(thief,`จ่ายค่าชดเชยขโมยพลาด ${paid} เครดิต`); note(victim,`ได้รับค่าชดเชย ${paid} เครดิต`);
    }
    comp.settled.push({encounter:state.encounter,paid});
    trace(state,thief,'theft-compensation',{compensationId:comp.id,due:comp.amount,paid});
  }
}

/** Cases keep the storefront ask captured when each failure happened; later repricing never changes the notice. */
const noticePrice = (crime: CrimeRecord) => 2*crime.cases.reduce((sum,c) => sum+c.ask,0);

/** One notice clears every case and the trade ban. It is independent of Dark Market availability and refunds no trust. */
export function clearCrime(state: AppraisalState, p: Appraiser): void {
  const crime = (p as Thief).crime;
  check(crime && crime.cases.length > 0,'crime','ไม่มีโทษให้ล้าง');
  const price = noticePrice(crime);
  spend(state,p,price,0,'criminal-notice');
  delete (p as Thief).crime;
  note(p,`ซื้อใบประกาศอาชญากร ${price} เครดิต ล้างทุกคดีและโทษห้ามค้าขายทันที`);
  trace(state,p,'crime-cleared',{price,cases:crime.cases.length});
}

/** Never send an NPC hand, concealed target item, or submitted opposing hand to a client. */
export function theftViewFor(state: AppraisalState, p: Appraiser): TheftView {
  const crime = (p as Thief).crime;
  return {
    duels: ((state as TheftState).theftDuels ?? []).filter(d => d.encounter === state.encounter && [d.thiefId,d.victimId].includes(p.id)).map(d => ({
      id:d.id, thiefId:d.thiefId, ...(d.victimId ? {victimId:d.victimId} : d.npc ? {npc:d.npc} : {}),
      ...(d.npc ? {npcTell:npcTheftTell(d.npc)} : {}),
      round:d.round, status:d.status, needsChoice:d.status === 'open' && !d.hands[p.id], submitted:!!d.hands[p.id],
      revealed:d.revealed.map(r => ({...r})),
    })),
    targets: state.players.filter(v => v.id !== p.id && !v.paused && !v.done).map(v => {
      const until = pvpBlockedUntil(state,p,v.id);
      return {playerId:v.id,...(until !== undefined ? {blockedUntilEncounter:until} : {})};
    }),
    compensation: ((state as TheftState).compensations ?? []).filter(c => [c.thiefId,c.victimId].includes(p.id)).map(c => ({
      id:c.id,role:c.thiefId === p.id ? 'payer' as const : 'receiver' as const,otherId:c.thiefId === p.id ? c.victimId : c.thiefId,
      amount:c.amount,remaining:c.dueEncounters.filter(e => !c.settled.some(s => s.encounter === e)),paid:c.settled.reduce((sum,s) => sum+s.paid,0),
    })),
    seals: ((state as TheftState).sinnerSeals ?? []).filter(seal => seal.holderId === p.id).map(seal => ({id:seal.id,thiefId:seal.thiefId})),
    ...(crime ? {crime:{failures:crime.failures,banStartsEncounter:crime.banStartsEncounter,banUntilEncounter:crime.banUntilEncounter,active:merchantTradeBanned(state,p),noticePrice:noticePrice(crime),cases:crime.cases.length}} : {}),
  };
}
