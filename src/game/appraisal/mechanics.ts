import { marketConditionMatch, marketOrderReserve, trustAcceptanceBonus, TRUST_CAP } from './market-contracts.js';
import { commissionRate, freeInspectionCount, inspectionLimit, MAX_ENERGY_CAP, MAX_LIFE_BONUS_CAP, passiveBonuses, passiveMarketBonus, passivesEnabled, WISH_SLOT_CAP } from './passives.js';
import type { PassiveBonuses } from './passives.js';
import { RuleError } from '../engine.js';
import { randomAt } from '../random.js';
import { ITEM_SPECS, NPC_SPECS, STATUS_CATALOG, itemFamily, priceRange } from './content.js';
import { FAKE_EFFECT_CHANCE, itemScoreValue } from './scoring.js';
import { omenOf } from './omens.js';
import { ENERGY_DEAL_NPCS, PULSE_RULES, TRUST_RULES, lifeDealTerms, merchantWary, shardsPerSale } from './pulse.js';
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
/** Per-seat caps: held relics raise them, selling the relic lowers them again (see enforceCaps). */
export function maxEnergyOf(state:AppraisalState,p:Appraiser):number {
  const b=passiveBonuses(state,p);return Math.min(MAX_ENERGY_CAP,state.config.maxEnergy+b.maxEnergy+(state.config.survival?0:b.maxLife));
}
export function maxLifeOf(state:AppraisalState,p:Appraiser):number|undefined {
  return state.config.survival?state.config.survival.maxLife+Math.min(MAX_LIFE_BONUS_CAP,passiveBonuses(state,p).maxLife):undefined;
}
export const wishSlotsOf=(state:AppraisalState,p:Appraiser,base:number)=>Math.min(Math.max(base,WISH_SLOT_CAP),base+passiveBonuses(state,p).wishSlots);
/** Resources above a cap that no longer applies are lost. */
export function enforceCaps(state:AppraisalState):void {
  for(const p of state.players) {
    p.energy=Math.min(p.energy,maxEnergyOf(state,p));
    if(p.life!==undefined && p.life>0) p.life=Math.min(p.life,maxLifeOf(state,p)!);
  }
}
/** The omen of the current encounter (polish rules only). */
export const omenNow=(state:AppraisalState)=>omenOf(state.config,state.seed,state.encounter);
/**
 * One pipeline for every sale of an item the seat owns: Dark Market, a merchant's wish, bond buyers and the Collector's collector offer.
 * Items appraised for a merchant (commission, cross-shop sales) never pass through it. Percentages add up, then floor once.
 */
export function salePercent(state:AppraisalState,p:Appraiser,market=false):number {
  if(!market && !state.config.polish) return 0;
  return (status(p,'B13')?20:0)-(status(p,'D13')?20:0)+(state.config.polish?(status(p,'B17')?15:0)-(status(p,'D17')?20:0)+(omenNow(state)?.salePct??0):0);
}
export const saleAdjusted=(base:number,pct:number)=>Math.max(0,Math.floor(base*(100+pct)/100));
/** Quote without spending anything, so the UI and the engine agree. */
export function salePreview(state:AppraisalState,p:Appraiser,base:number,market=false):number {return saleAdjusted(base,salePercent(state,p,market));}
/** Settle a sale: adjusts the price and spends the one-shot statuses that shaped it. */
export function saleApply(state:AppraisalState,p:Appraiser,base:number,market=false):number {
  const price=saleAdjusted(base,salePercent(state,p,market));
  if(market || state.config.polish){consumeStatus(p,'B13');consumeStatus(p,'D13');}
  return price;
}
/** Flat surcharge on NPC purchases, curse cleansing and recovery deals. */
export const feeSurcharge=(state:AppraisalState,p:Appraiser)=>state.config.polish?(status(p,'D18')?1:0)+(omenNow(state)?.fee??0):0;
export function grant(state: AppraisalState, p: Appraiser, id: StatusId, targetItemId?: string): void {
  if (id.startsWith('D') && status(p,'B06')) { consumeStatus(p,'B06'); trace(state,p,'debuff-blocked',{id}); return; }
  if (!state.config.survival && ['B09','D04','D07'].includes(id) && state.encounter === state.config.encounters) return;
  const currentOnly = ['B05','B10','D02','D16','B17','B18','D17','D18','D19'].includes(id);
  const charges = ['B05','B11','D01','D03','D05','D06','D10','D11'].includes(id) ? 2 : 1;
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
/** Artifact bonuses are funded separately, just like encounter income. */
export function fundPassive(state:AppraisalState,p:Appraiser,amount:number,reason:'gear-commission'|'gear-market'):void {
  check(passivesEnabled(state.config) && Number.isSafeInteger(amount) && amount>=0,'passive-reward','โบนัสสินค้าไม่ถูกต้อง');
  if(!amount)return;p.credits+=amount;state.ledger.push({from:'@item-fund',to:p.id,amount,reason,encounter:state.encounter});
}
export function recover(state: AppraisalState, p: Appraiser, amount: number, reason: string, minimum = false): void {
  let gained = amount;
  if (!minimum && status(p,'D10')) { gained = Math.max(0,amount-2); consumeStatus(p,'D10'); }
  if (!minimum && status(p,'B14')) { gained += 2; consumeStatus(p,'B14'); }
  const before = p.energy; p.energy = Math.min(maxEnergyOf(state,p),p.energy + gained);
  trace(state,p,'energy-restored',{amount:p.energy-before,reason});
}
export function healLife(state:AppraisalState,p:Appraiser,amount:number,reason:string):void {
  check(state.config.survival && p.life!==undefined && p.life>0,'life','ผู้ตายฟื้นกลับมาใน run นี้ไม่ได้');
  const before=p.life;p.life=Math.min(maxLifeOf(state,p)!,p.life+amount);
  trace(state,p,'life-restored',{amount:p.life-before,reason});
}
export function damageLife(state:AppraisalState,p:Appraiser,amount:number,reason:string):void {
  check(p.life!==undefined,'life','กติกานี้ไม่มีชีวิตแยก');
  let hit=amount;
  if(hit>0 && status(p,'B19')){hit=Math.max(0,hit-1);consumeStatus(p,'B19');}
  if(hit>0 && status(p,'D20')){hit+=1;consumeStatus(p,'D20');}
  const before=p.life;p.life=Math.max(0,p.life-hit);
  trace(state,p,'life-lost',{amount:before-p.life,reason});
  if(p.life===0 && !p.paused){p.paused='dead';p.done=true;p.eventOffer=null;trace(state,p,'death',{reason});}
}
export function recoveryOffer(state:AppraisalState,p:Appraiser):RecoveryOffer|undefined {
  if(!state.config.survival || p.life===0 || !p.selectedPortalId || p.recoveryUsed)return;
  const npc=p.portals.find(portal=>portal.id===p.selectedPortalId)?.npc;
  if(!npc)return;
  const b=passiveBonuses(state,p);
  const salt=(status(p,'D16')?2:0)+feeSurcharge(state,p);
  if(ENERGY_DEAL_NPCS.includes(npc))return {target:'energy',credits:2+salt,amount:3+b.energyRecovery};
  // Life deals follow trust: none at 0, then 3/5/7 credits for 0-1, 1-2, 2-3 life. Held gear adds to both ends.
  const terms=lifeDealTerms(p.npcTrust?.[npc]??0);
  return terms?{target:'life',credits:terms.credits+salt,min:terms.min+b.lifeRecovery,amount:terms.max+b.lifeRecovery}:undefined;
}
/** What a deal restores this time; a ranged life deal rolls once per encounter from the run seed. */
export function recoveryAmount(state:AppraisalState,p:Appraiser,offer:RecoveryOffer):number {
  if(offer.min===undefined || offer.min>=offer.amount)return offer.amount;
  return offer.min+Math.floor(randomAt(state.seed,`${state.encounter}:${p.id}:recovery-roll`)*(offer.amount-offer.min+1));
}
/** Buyers of another seat's appraised goods earn the shards (the seller earns commission and trust). Every `shardsPerLife` banked shards mend 1 life while below the cap; the bank holds at most `bankCap`. */
export function mendWithShards(state:AppraisalState,p:Appraiser):void {
  while((p.pulseShards??0)>=PULSE_RULES.shardsPerLife && p.life!==undefined && p.life>0 && p.life<maxLifeOf(state,p)!) {
    p.pulseShards!-=PULSE_RULES.shardsPerLife;healLife(state,p,1,'pulse-shards');
  }
  if(p.pulseShards!==undefined)p.pulseShards=Math.min(p.pulseShards,PULSE_RULES.bankCap);
}
function gainShards(state:AppraisalState,p:Appraiser):void {
  const wary=merchantWary(p,state.encounter),gained=shardsPerSale(p,state.encounter);
  p.pulseShards=(p.pulseShards??0)+gained;
  p.notes.push(wary?'พ่อค้าเริ่มสงสัย: คุณซื้อขายกับคนเดิมมานานเกินไป จึงไม่ได้เศษชีพจร':`ได้เศษชีพจร +${gained}`);
  trace(state,p,'pulse-shards',{gained,wary});
  mendWithShards(state,p);
  p.notes=p.notes.slice(-30);
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
  return p.credits + [...p.inventory,...(p.npcContracts?.alien?.itemIds??[])].reduce((sum,id) => {
    const item = state.items[id]!; return sum + itemScoreValue(item.base,item.genuine,item.cursed);
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
  check(p.inspections < inspectionLimit(state,p),'inspections','ใช้สิทธิ์ตรวจครบแล้ว');
  const k = known(state,p,itemId);
  check(property === 'price' ? k.base === undefined : property === 'authenticity' ? k.genuine === undefined : state.config.curseSight ? k.cursed === undefined : !k.effectsKnown || (status(p,'B02') && k.cursed === undefined),'known','รู้ข้อมูลนี้แล้ว');
  const cost = Math.max(0,1 + (status(p,'D01') ? 1 : 0) - (status(p,'B05') ? 1 : 0));
  const free=cost>0 && freeInspectionCount(passiveBonuses(state,p),p,property)>0;
  const insight=cost>0 && !free && p.inspections===0 && !!omenNow(state)?.firstInspectFree;
  const compoundEyes=cost>0 && !free && !insight && !!status(p,'B11');
  spend(state,p,0,free||compoundEyes||insight?0:cost,'inspect');
  if(free){p.passiveUses??={};p.passiveUses[property]=(p.passiveUses[property]??0)+1;}
  else if(insight) {/* the omen pays for it */}
  else if(compoundEyes) consumeStatus(p,'B11');
  else {consumeStatus(p,'B05');consumeStatus(p,'D01');}
  p.inspections++;
  if (property === 'price') {
    if (status(p,'B01') && !status(p,'D02')) { learn(p,itemId,{base:item.base}); consumeStatus(p,'B01'); }
    else {
      const bounds = priceRange(item.kind); const offset = Math.floor(randomAt(state.seed,`${item.id}:narrow`)*4);
      learn(p,itemId,{range:[Math.max(bounds[0],item.base-offset-2),Math.min(bounds[1],item.base+5-offset)]});
    }
  } else if (property === 'authenticity') learn(p,itemId,{genuine:item.genuine});
  else if (state.config.curseSight) learn(p,itemId,{effectsKnown:true,cursed:item.cursed});
  else {
    learn(p,itemId,{effectsKnown:true});
    if (status(p,'B02')) { learn(p,itemId,{cursed:item.cursed}); consumeStatus(p,'B02'); }
  }
  // Curse sight: B02 lets the next price or authenticity check read the curse as well.
  if (state.config.curseSight && property !== 'effects' && status(p,'B02')) { learn(p,itemId,{effectsKnown:true,cursed:item.cursed}); consumeStatus(p,'B02'); }
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
  const accepted = value >= item.reservation || !!state.config.commerce && value>0 && randomAt(state.seed,`${state.encounter}:${p.id}:${itemId}:trust-accept:${counter?p.counters:0}`)<Math.min(.95,trustAcceptanceBonus(p,item.npc)+passiveBonuses(state,p).acceptance/100+(status(p,'B12')?.25:0)+(omenNow(state)?.accept??0)/100);
  const previous = p.valuations[itemId];
  if (accuracy && !previous?.accuracy) p.accuracyBonus += 5;
  if (!accuracy && previous?.accuracy) p.accuracyBonus -= 5;
  p.valuations[itemId] = {value,accuracy,caught,accepted};
  item.lastAppraisal = value; item.lastAccepted = accepted;
  if(state.config.commerce)item.appraisedBy=p.id;
  p.notes.push(accepted?`NPC ยอมรับราคา ${value} credit`:`NPC ปฏิเสธราคา ${value}; ยังซื้อราคาหน้าร้าน ${item.ask} credit ได้`);
  if (caught) {
    p.notes.push('พ่อค้าจับได้ว่าคุณกดราคา!');
    const trust=p.npcTrust;
    if(trust && (trust[item.npc]??0)>0){const lost=Math.min(trust[item.npc]!,TRUST_RULES.caughtLoss);trust[item.npc]=trust[item.npc]!-lost;p.notes.push(`ความไว้ใจ ${NPC_SPECS[item.npc].name} ลด ${lost} เหลือ ${trust[item.npc]}/${TRUST_CAP}`);trace(state,p,'trust-lost',{npc:item.npc,lost,trust:trust[item.npc]});}
  }
  p.notes = p.notes.slice(-30);
  consumeStatus(p,'B04'); consumeStatus(p,'D03'); consumeStatus(p,'B12');
  if (p.honorJob && accuracy) grant(state,p,'B07'); p.honorJob = false;
  if (p.honestyReward && accuracy) grant(state,p,p.honestyReward); p.honestyReward = null;
  p.caught ||= caught; trace(state,p,'appraised',{itemId,value,risk,caught,counter,accepted}); return caught;
}
export function npcQuote(shop:Appraiser,item:AppraisalItem):number {
  const valuation=shop.valuations[item.id];return valuation?.accepted?valuation.value:item.ask;
}
/** The original NPC sale pays once; reselling an owned item cannot farm commission or trust. */
export function completeAppraisedSale(state:AppraisalState,item:AppraisalItem,salePrice:number,bonuses?:PassiveBonuses):void {
  if(!state.config.commerce || !item.appraisedBy || item.commissionPaid || salePrice<=0)return;
  item.commissionPaid=true;const appraiser=player(state,item.appraisedBy);
  if(state.config.survival && appraiser.life===0)return;
  const b=bonuses??passiveBonuses(state,appraiser,[item.id]);const webbed=!!status(appraiser,'D15');
  const baseFull=Math.floor(salePrice/10);const baseCommission=webbed?Math.floor(baseFull/2):baseFull;
  const extraFull=Math.floor(salePrice*commissionRate(b)/100)-baseFull+b.saleFee;const extra=webbed?Math.floor(extraFull/2):extraFull;
  const commission=baseCommission+extra;
  reward(state,appraiser,baseCommission,'appraisal-commission');if(extra)fundPassive(state,appraiser,extra,'gear-commission');
  const trust=appraiser.npcTrust!;trust[item.npc]=Math.min(TRUST_CAP,(trust[item.npc]??0)+1+b.trust+(status(appraiser,'B15')?1:0));consumeStatus(appraiser,'D15');consumeStatus(appraiser,'B15');
  appraiser.notes.push(`ขาย ${ITEM_SPECS[item.kind].name} ได้ ${salePrice} เครดิต · ค่านายหน้า +${commission} เครดิต · ความไว้ใจ ${NPC_SPECS[item.npc].name} ${trust[item.npc]}/${TRUST_CAP}`);appraiser.notes=appraiser.notes.slice(-30);
  trace(state,appraiser,'appraisal-commission',{itemId:item.id,npc:item.npc,salePrice,commission,trust:trust[item.npc]});
}
/** The owner's listing rebate goes to the buyer; `exact` sales (the owner agreed) fail if the owner cannot pay, forced ones pay what the owner has. */
export function payRebate(state:AppraisalState,seller:Appraiser,buyer:Appraiser,rebate:number|undefined,exact:boolean):void {
  if(!rebate)return;
  const paid=exact?rebate:Math.min(rebate,seller.credits);
  transfer(state,seller,buyer,paid,'seller-rebate');
  if(paid){buyer.notes.push(`ผู้ขายแถมเครดิตให้ ${paid} เครดิต`);buyer.notes=buyer.notes.slice(-30);trace(state,seller,'rebate-paid',{buyerId:buyer.id,paid,promised:rebate});}
}
/** Survival: goods another seat appraised and the merchant accepted cost no energy to buy. */
export function friendAppraised(state:AppraisalState,buyer:Appraiser,shop:Appraiser,items:AppraisalItem[]):boolean {
  return !!state.config.survival && shop.id!==buyer.id && items.every(item=>item.appraisedBy===shop.id && !!shop.valuations[item.id]?.accepted);
}
/** What the appraiser verified travels with the goods; facts the buyer already knows stay as they are. */
function inheritKnowledge(state:AppraisalState,buyer:Appraiser,shop:Appraiser,item:AppraisalItem):void {
  if(!state.config.commerce || shop.id===buyer.id || item.appraisedBy!==shop.id)return;
  const known=shop.knowledge[item.id];if(!known)return;
  const facts:Knowledge={};
  for(const key of ['base','range','genuine','cursed','effectsKnown','activationKnown'] as const)if(known[key]!==undefined && buyer.knowledge[item.id]?.[key]===undefined)Object.assign(facts,{[key]:known[key]});
  if(!Object.keys(facts).length)return;
  learn(buyer,item.id,facts);
  buyer.notes.push(`ได้ข้อมูลที่ผู้ประเมินตรวจไว้จริงของ ${ITEM_SPECS[item.kind].name}`);buyer.notes=buyer.notes.slice(-30);
  trace(state,buyer,'knowledge-inherited',{itemId:item.id,from:shop.id,facts:Object.keys(facts)});
}
/** Buying one merchant's goods that other seats appraised, three times running, earns trust with that merchant. */
function noteRepeatBuy(state:AppraisalState,buyer:Appraiser,items:AppraisalItem[],appraisers:Array<string|undefined>):void {
  const trust=buyer.npcTrust;
  if(!trust || !state.config.commerce || !appraisers.some(id=>id!==undefined && id!==buyer.id))return;
  const npc=items[0]!.npc;
  const count=buyer.buyStreak?.npc===npc?buyer.buyStreak.count+1:1;
  if(count<TRUST_RULES.repeatBuys){buyer.buyStreak={npc,count};return;}
  delete buyer.buyStreak;
  const before=trust[npc]??0;trust[npc]=Math.min(TRUST_CAP,before+TRUST_RULES.repeatBuyTrust);
  buyer.notes.push(`ซื้อของ ${NPC_SPECS[npc].name} ที่เพื่อนประเมินครบ ${TRUST_RULES.repeatBuys} ครั้งติด ความไว้ใจ ${trust[npc]}/${TRUST_CAP}`);buyer.notes=buyer.notes.slice(-30);
  trace(state,buyer,'repeat-buy-trust',{npc,trust:trust[npc]});
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
  const b=passiveBonuses(state,buyer);const commissionBonuses=new Map(state.players.map(p=>[p.id,passiveBonuses(state,p)]));
  const discount = (options.discount ?? 0) + (status(buyer,'B03') ? 2 : 0) - (status(buyer,'D12') ? 2 : 0) + (options.condition ? profile.discount : 0)+b.discount;
  const bloodDiscount=!!state.config.npcEvents && buyer.id===shop.id && items[0]!.npc==='vampire' && buyer.vampireDiscount?.encounter===state.encounter && !options.barterItemId;
  const price = options.barterItemId ? 0 : Math.floor(Math.max(0,basePrice-discount)*(bloodDiscount?.5:1));
  const fee = options.barterItemId ? 0 : feeSurcharge(state,buyer);
  const energy = Math.max(0,(state.config.freeBuy || friendAppraised(state,buyer,shop,items) ? 0 : 1) + (status(buyer,'D06') ? 1 : 0)-b.buyEnergy);
  if (options.barterItemId) ownedItem(state,buyer,options.barterItemId,true);
  spend(state,buyer,price+fee,energy,'npc-purchase');
  if(bloodDiscount)delete buyer.vampireDiscount;
  if (options.barterItemId) retire(state,buyer,options.barterItemId,'npc-barter');
  consumeStatus(buyer,'B03'); consumeStatus(buyer,'D06'); consumeStatus(buyer,'D12');
  const appraisers=items.map(item=>item.appraisedBy);
  let allocated=0;
  for (const [index,item] of items.entries()) {
    const share=index===items.length-1?price-allocated:basePrice?Math.floor(price*npcQuote(shop,item)/basePrice):0;allocated+=share;
    completeAppraisedSale(state,item,share,commissionBonuses.get(item.appraisedBy??''));
    inheritKnowledge(state,buyer,shop,item);
    item.owner = buyer.id; buyer.inventory.push(item.id); shop.stock = shop.stock.filter(id => id !== item.id);
    state.listings = state.listings.filter(l => l.itemId !== item.id);
  }
  noteRepeatBuy(state,buyer,items,appraisers);
  if(state.config.survival && appraisers.some(id=>id!==undefined && id!==buyer.id))gainShards(state,buyer);
  if (options.grantStatus) grant(state,buyer,options.grantStatus);
  if (options.condition) grant(state,buyer,profile.condition);
  if (options.lock) grant(state,buyer,'D09',items[0]!.id);
  trace(state,buyer,'npc-purchased',{itemIds,shopId:shop.id,price,energy,condition:options.condition ?? false,...(fee?{fee}:{})});
}
export function activate(state: AppraisalState, p: Appraiser, itemId: string): void {
  const item = ownedItem(state,p,itemId); check(!p.activated.includes(itemId),'activated','เปิดใช้ชิ้นนี้ใน encounter แล้ว');
  spend(state,p,0,1,'activate'); p.activated.push(itemId);
  const spec = ITEM_SPECS[item.kind];
  const shielded = !!status(p,'B06') && spec.drawback.startsWith('D');
  if (item.cursed) grant(state,p,spec.drawback);
  const fogged = !!status(p,'D14'); consumeStatus(p,'D14');
  const works = !fogged && item.genuine || !fogged && (!!state.config.fakeEffect && randomAt(state.seed,`${state.encounter}:${p.id}:${itemId}:fake-effect`) < FAKE_EFFECT_CHANCE);
  if (works) {
    if (itemFamily(item.kind) === 'orb') recover(state,p,spec.energyRecovery??3,'orb');
    else if (itemFamily(item.kind) === 'key' && status(p,'D07')) removeStatus(p,'D07');
    else grant(state,p,spec.buff);
    if(state.config.survival && ['food','potion'].includes(itemFamily(item.kind)))healLife(state,p,2,'restorative-item');
  }
  if(state.config.survival && item.cursed)damageLife(state,p,1,'cursed-activation');
  if (spec.consumable) retire(state,p,itemId,'consumed',false);
  learn(p,itemId,{activationKnown:true});
  if (state.config.curseSight) {
    // The outcome is visible to the owner, so activating reveals what the item really was.
    learn(p,itemId,{genuine:item.genuine,cursed:item.cursed,effectsKnown:true});
    p.notes.push(activationNote(state,item,shielded,works,fogged)); p.notes = p.notes.slice(-30);
  }
  trace(state,p,'item-activated',{itemId});
}
/** The four authentic/fake × cursed/clean results, spelled out for the player. */
export function activationNote(state:AppraisalState,item:AppraisalItem,shielded:boolean,worked=item.genuine,fogged=false):string {
  const spec = ITEM_SPECS[item.kind]; const name = spec.name;
  const buff = itemFamily(item.kind) === 'orb' ? `ฟื้นพลัง ${spec.energyRecovery ?? 3}` : STATUS_CATALOG.find(s => s.id === spec.buff)!.name;
  const drawback = STATUS_CATALOG.find(s => s.id === spec.drawback)!.name;
  const curse = `คำสาปทำงาน ${shielded ? `${drawback}ถูก${STATUS_CATALOG.find(s => s.id === 'B06')!.name}กันไว้` : `รับ ${drawback}`}${state.config.survival ? ' และเสียชีวิต 1' : ''}`;
  if (fogged) return `เปิดใช้ ${name}: ${item.genuine ? 'ของแท้' : 'ของปลอม'}แต่หมอกวิกลจริตทำให้ผลดีไม่ออกฤทธิ์${item.cursed ? ` · ${curse}` : ''}`;
  if (item.genuine) return item.cursed ? `เปิดใช้ ${name}: ของแท้แต่มีคำสาป ได้ ${buff} · ${curse}` : `เปิดใช้ ${name}: ของแท้ ไม่มีคำสาป ได้ ${buff}`;
  const fake = worked ? `ของปลอมแต่ยังออกฤทธิ์ได้ ได้ ${buff}` : 'ของปลอม ผลดีไม่ออกฤทธิ์';
  return item.cursed ? `เปิดใช้ ${name}: ${fake} · ${curse}` : worked ? `เปิดใช้ ${name}: ${fake} ไม่มีคำสาป` : `เปิดใช้ ${name}: ของปลอม ไม่มีคำสาป ผลดีไม่ออกฤทธิ์ เสียพลังเปล่า`;
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
export function marketSell(state: AppraisalState, p: Appraiser, itemId: string, orderId: string, resolution:'discount'|'sacrifice'='discount'): void {
  check(resolution==='discount' || resolution==='sacrifice','market-resolution','เลือกรับราคาลดหรือสละตามเงื่อนไข');
  const item = ownedItem(state,p,itemId,true); const order = state.market.orders.find(o => o.id === orderId);
  check(state.market.open && state.market.encounter === state.encounter,'market-closed','Dark Market ปิดแล้ว');
  check(order && order.kind === item.kind && (order.quota[p.id] ?? 0) > 0,'market-order','ไม่มีสิทธิ์รับซื้อตามรายการ');
  const reserved=marketOrderReserve(order);check(state.market.budget>=reserved,'market-budget','งบรับซื้อหมด');
  const contract=order.contract;
  // Check that an optional sacrifice is payable before consulting hidden item facts.
  // Otherwise a rejected sale could become a free authenticity/curse probe.
  if(contract && resolution==='sacrifice') {
    const cost=contract.fullPriceCost;
    if(cost.kind==='energy')check(p.energy>=cost.amount,'energy','พลังไม่พอสำหรับเงื่อนไขราคาเต็ม');
    if(cost.kind==='debuff')check(!status(p,cost.statusId) || status(p,'B06'),'market-cost','มีผลเสียนี้อยู่แล้ว รับซ้ำเพื่อแลกราคาเต็มไม่ได้');
    if(cost.kind==='life')check(state.config.survival && p.life!>cost.amount,'life','ต้องเหลือชีวิตอย่างน้อย 1 หลังจ่าย');
  }
  const matched=!contract || marketConditionMatch(contract,item)==='match';
  let price=order.price;
  if(contract && !matched) {
    if(resolution==='discount')price=Math.floor(price*80/100);
    else {
      const cost=contract.fullPriceCost;
      if(cost.kind==='energy')spend(state,p,0,cost.amount,'market-condition');
      else if(cost.kind==='life') {check(state.config.survival && p.life!>cost.amount,'life','ต้องเหลือชีวิตอย่างน้อย 1 หลังจ่าย');damageLife(state,p,cost.amount,'market-condition');}
      else grant(state,p,cost.statusId);
    }
  }
  price=saleApply(state,p,price,true);
  const creditsBonus=matched && contract?.bonus.kind==='credits'?contract.bonus.amount:0;
  const gearBonus=passiveMarketBonus(order,passiveBonuses(state,p,[itemId]),!!contract && matched,!!contract && !matched && resolution==='discount');
  reward(state,p,price+creditsBonus,'dark-market',true);state.market.budget-=reserved;order.quota[p.id]!--;
  if(gearBonus)fundPassive(state,p,gearBonus,'gear-market');
  if(matched && contract) {
    const bonus=contract.bonus;
    if(bonus.kind==='energy')recover(state,p,bonus.amount,'market-condition');
    else if(bonus.kind==='life')healLife(state,p,bonus.amount,'market-condition');
    else if(bonus.kind==='buff')grant(state,p,bonus.statusId);
  }
  if(contract || gearBonus) {p.notes.push(`Dark Market: ${matched?'ตรงเงื่อนไข รับโบนัส':resolution==='discount'?(gearBonus?'ไม่ตรงเงื่อนไข รับราคาลด':'ไม่ตรงเงื่อนไข ลดราคา 20%'):'ไม่ตรงเงื่อนไข สละตามข้อตกลงเพื่อรับราคาเต็ม'} · รับ ${price+creditsBonus+gearBonus} เครดิต${gearBonus?` รวมโบนัสของถือ ${gearBonus}`:''}`);p.notes=p.notes.slice(-30);}
  retire(state,p,itemId,'dark-market'); if (state.config.brokerage) { item.owner='dark-market'; state.vault!.push(itemId); }
  trace(state,p,'market-sale',{itemId,orderId,price:price+creditsBonus+gearBonus,...(contract?{matched,resolution,bonus:matched?contract.bonus:null}:{})});
}
