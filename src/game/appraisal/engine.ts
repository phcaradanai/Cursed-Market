import { passivesEnabled } from './passives.js';
import { randomAt } from '../random.js';
import { ITEM_SPECS, NPC_SPECS, expansionActive, merchantKinds, priceRange } from './content.js';
import { anchorOf, decayFor, rerollCost } from './core2.js';
import { applyCore2Settlement, applyDread, resetCore2Encounter } from './core2-rules.js';
import { barter, pickpocket, stealShop, useSkill } from './core2-actions.js';
import { defaultEvent, drawBacklashEvent, drawTheftEvent, isConsequence, drawBondEvent, drawExpansionEvent, drawPolishEvent, drawWishEvent, drawEvent, drawPersonalNpcEvent, resolveEvent } from './events.js';
import { closeNpcContracts, redeemNpcContracts } from './npc-events.js';
import { auctionLots, placeBid, settleAuction, settleRemainingUnsold, settleUnsold } from './brokerage.js';
import { merchantActionFree, activate, appraise, check, enforceCaps, maxEnergyOf, maxLifeOf, npcQuote, omenNow, consumeStatus, damageLife, healLife, inspect, marketSell, ownedItem, player, purchase, payRebate, stockBonus, recover, recoveryAmount, recoveryOffer, mendWithShards, reward, spend, status, stockItem, trace, transfer, unlocked, wealth } from './mechanics.js';
import { cleanseItem } from './cleanse.js';
import { wishNew, wishSell } from './wishlist.js';
import { settleChallenge } from './challenge.js';
import { challengePenalty } from './challenge-rules.js';
import type { Claims } from './challenge-rules.js';
import { makeMarketContract, marketOrderReserve, TRUST_CAP } from './market-contracts.js';
import { collectRun } from './survival.js';
import { PULSE_RULES, TRUST_RULES, activeNpcs, linkTrade } from './pulse.js';
import { bankRoundReward, flipRoundReward, openRoundRewards, raiseRoundReward } from './round-rewards.js';
import type { AppraisalAction, AppraisalConfig, AppraisalState, Appraiser, DarkMarket, NpcId, Portal } from './types.js';

export const DEFAULT_APPRAISAL_CONFIG: AppraisalConfig = {
  catalogVersion:3, itemEffects:true, roundRewards:true, multiCoinRewards:true, commerce:true, curseSight:true, freeBuy:true, freeMerchantAction:true, fakeEffect:true, cleanse:true, wishlist:true, wishContract:true, challenge:true, expansion:true,
  encounters:3, startingCredits:40, maxEnergy:10, recoveryEnergy:4,
  bankReserve:2000, marketProbability:.5, marketMaxOrders:3, marketQuota:1,
};
function validateConfig(config:AppraisalConfig):void {
  check(config.itemEffects===undefined || typeof config.itemEffects==='boolean','config','กติกาผลสินค้าไม่ถูกต้อง');
  check(config.npcEvents===undefined || typeof config.npcEvents==='boolean','config','กติกาอีเวนต์เฉพาะพ่อค้าไม่ถูกต้อง');
  check(config.core2===undefined || typeof config.core2==='boolean','config','กติกาแกนเกมใหม่ไม่ถูกต้อง');
  check(config.commerce===undefined || typeof config.commerce==='boolean','config','กติกาการค้าไม่ถูกต้อง');
  check(config.polish===undefined || typeof config.polish==='boolean','config','กติกาขัดเกลาไม่ถูกต้อง');
  check(config.expansion===undefined || typeof config.expansion==='boolean','config','กติกาส่วนขยายไม่ถูกต้อง');
  check(config.challenge===undefined || typeof config.challenge==='boolean','config','กติกาท้าทายคำระบุไม่ถูกต้อง');
  check(config.wishContract===undefined || typeof config.wishContract==='boolean','config','กติกาสัญญาตามหาของไม่ถูกต้อง');
  check(config.wishlist===undefined || typeof config.wishlist==='boolean','config','กติกาของที่พ่อค้าตามหาไม่ถูกต้อง');
  check(config.cleanse===undefined || typeof config.cleanse==='boolean','config','กติกาล้างคำสาปไม่ถูกต้อง');
  check(config.fakeEffect===undefined || typeof config.fakeEffect==='boolean','config','กติกาผลของปลอมไม่ถูกต้อง');
  check(config.freeMerchantAction===undefined || typeof config.freeMerchantAction==='boolean','config','กติกาสิทธิ์ฟรีประจำสินค้าไม่ถูกต้อง');
  check(config.freeBuy===undefined || typeof config.freeBuy==='boolean','config','กติกาซื้อฟรีพลังไม่ถูกต้อง');
  check(config.curseSight===undefined || typeof config.curseSight==='boolean','config','กติกาตรวจคำสาปไม่ถูกต้อง');
  check(config.multiCoinRewards===undefined || typeof config.multiCoinRewards==='boolean','config','กติกาทบเหรียญไม่ถูกต้อง');
  check(config.roundRewards===undefined || typeof config.roundRewards==='boolean','config','กติการางวัลจบรอบไม่ถูกต้อง');
  check(config.catalogVersion===undefined || config.catalogVersion===1 || config.catalogVersion===2 || config.catalogVersion===3,'config','เวอร์ชันคลังสินค้าไม่ถูกต้อง');
  for(const key of ['encounters','startingCredits','maxEnergy','recoveryEnergy','bankReserve','marketMaxOrders','marketQuota'] as const)
    check(Number.isSafeInteger(config[key]) && config[key]>=0 && config[key]<=10000,'config',`ค่า ${key} ไม่ถูกต้อง`);
  check(config.encounters>=1 && config.encounters<=10 && config.maxEnergy>=1 && config.recoveryEnergy>=1 && config.recoveryEnergy<=config.maxEnergy,'config','จำนวน encounter หรือพลังไม่ถูกต้อง');
  check(Number.isFinite(config.marketProbability) && config.marketProbability>=0 && config.marketProbability<=1 && config.marketMaxOrders>=1 && config.marketQuota>=1,'config','การสุ่มตลาดไม่ถูกต้อง');
  check(config.survival===undefined || !!config.survival && typeof config.survival==='object' && !Array.isArray(config.survival),'config','กติกาชีวิตไม่ถูกต้อง');
  if(config.survival){
    const rules=config.survival;
    check(Object.keys(rules).length===3 && ['maxLife','encounterLifeCost','entryEnergyCost'].every(key=>Number.isSafeInteger(rules[key as keyof typeof rules])),'config','กติกาชีวิตไม่ถูกต้อง');
    check(rules.maxLife>=1 && rules.maxLife<=100 && rules.encounterLifeCost>=1 && rules.encounterLifeCost<=rules.maxLife && rules.entryEnergyCost>=0 && rules.entryEnergyCost<=config.maxEnergy,'config','ค่าชีวิตหรือต้นทุนเริ่มรอบไม่ถูกต้อง');
  }
  if(config.brokerage!==undefined){
    const rules=config.brokerage;
    check(!!rules && typeof rules==='object' && !Array.isArray(rules) && Object.keys(rules).length===3,'config','กติกานายหน้าไม่ถูกต้อง');
    check([rules.auctionProbability,rules.bondProbability].every(v=>Number.isFinite(v) && v>=0 && v<=1) && Number.isSafeInteger(rules.maxLots) && rules.maxLots>=1 && rules.maxLots<=4,'config','กติกานายหน้าไม่ถูกต้อง');
  }
}
export function createAppraisalRun(playerIds:string[],seed:string,overrides:Partial<AppraisalConfig>={}):AppraisalState {
  return initialiseAppraisalRun(playerIds,seed,{...DEFAULT_APPRAISAL_CONFIG,...overrides});
}
/** Restore an exact saved config, including original audits without a catalog version. */
export function restoreAppraisalRun(playerIds:string[],seed:string,config:AppraisalConfig):AppraisalState {
  return initialiseAppraisalRun(playerIds,seed,structuredClone(config));
}
function initialiseAppraisalRun(playerIds:string[],seed:string,config:AppraisalConfig):AppraisalState {
  check(playerIds.length>=2 && playerIds.length<=4 && new Set(playerIds).size===playerIds.length && playerIds.every(id=>typeof id==='string' && /^[a-zA-Z0-9_-]{1,64}$/.test(id) && !['bank','__proto__','constructor','prototype'].includes(id)),'players','ต้องมีผู้เล่น 2–4 คนและ ID ไม่ซ้ำ');
  check(typeof seed==='string' && seed.length>0 && seed.length<=256,'seed','seed ไม่ถูกต้อง');
  check(config && typeof config==='object','config','กติกาไม่ถูกต้อง'); validateConfig(config);
  const state:AppraisalState={version:config.survival?5:4,seed,config,encounter:1,phase:'PORTALS',revision:0,players:[],items:{},schedule:{},bank:config.bankReserve,reservedRewards:0,market:{encounter:1,open:false,budget:0,orders:[]},listings:[],publicKnowledge:{},trades:[],ledger:[],trace:[],history:[],accepted:{},commands:[]};
  if(config.brokerage) state.vault=[];
  playerIds.forEach((id,seat)=>{
    const schedule:Portal[][]=[];
    for(let encounter=1;encounter<=(config.survival?1:config.encounters);encounter++) {
      schedule.push(generatePortals(state,id,seat,encounter));
    }
    state.schedule[id]=schedule;
    state.players.push({id,credits:config.startingCredits,energy:config.maxEnergy,inventory:[],statuses:[],paused:null,done:false,portals:structuredClone(schedule[0]!),selectedPortalId:null,stock:[],knowledge:{},valuations:{},inspections:0,counters:0,activated:[],score:0,startWealth:config.startingCredits,accuracyBonus:0,eventOffer:null,seenEvents:[],resolvedEvents:[],offerSlots:0,consequenceSlots:0,honorJob:false,honestyReward:null,acceptedDanger:false,caught:false,subsidy:false,revealedInfo:[],dealMode:'any',notes:[],...(passivesEnabled(config)?{passiveUses:{}}:{}),...(config.commerce?{npcTrust:{}}:{}),...(config.cleanse?{cleansed:[]}:{}),...(config.wishlist?{wishes:{},wishTried:false}:{}),...(config.wishContract?{wishRolls:0}:{}),...(config.survival?{life:config.survival.maxLife,recoveryUsed:false}:{})});
  });
  if(config.survival)for(const p of state.players)spend(state,p,0,Math.min(p.energy,config.survival.entryEnergyCost),'encounter-entry');
  state.market=makeMarket(state);
  for(const p of state.players) if(randomAt(seed,`${state.encounter}:${p.id}:entry-event`)<.55) drawEvent(state,p);
  assertAppraisalInvariants(state); return state;
}
/** One merchant item; the same recipe fills the portals up front and the extra slots earned through trust. */
function spawnStockItem(state:AppraisalState,id:string,seat:number,encounter:number,index:number|string,slot:number,npc:NpcId):string {
  const {seed,config}=state;const favorites=merchantKinds(npc,config.catalogVersion??1,!!config.cleanse,!!config.challenge,expansionActive(config),!!config.polish);
  const itemId=`item-${encounter}-${seat}-${index}-${slot}`;
  const kind=favorites[Math.floor(randomAt(seed,`${itemId}:kind`)*favorites.length)]!;
  const anchor=anchorOf(config,kind);const range=priceRange(kind,anchor); const base=range[0]+Math.floor(randomAt(seed,`${itemId}:base`)*(range[1]-range[0]+1));
  const reservation=NPC_SPECS[npc].reservation;
  const ask=Math.max(1,anchor-2+Math.floor(randomAt(seed,`${itemId}:ask`)*6));
  const minimum=Math.ceil(base*(reservation[0]+(reservation[1]-reservation[0])*randomAt(seed,`${itemId}:reservation`)));
  state.items[itemId]={
    id:itemId,kind,base,ask,genuine:randomAt(seed,`${itemId}:genuine`)<.75,
    cursed:randomAt(seed,`${itemId}:curse`)<.35,owner:`npc:${id}:${encounter}`,
    npcOwnerId:id,npc,encounter,certificate:randomAt(seed,`${itemId}:certificate`)<.65,
    lastAppraisal:null,lastAccepted:null,reservation:Math.min(ask,Math.max(1,minimum)),
    ...(slot>=2?{bonus:true}:{}),
  };
  return itemId;
}
function generatePortals(state:AppraisalState,id:string,seat:number,encounter:number):Portal[] {
      const {seed,config}=state;const npcIds=activeNpcs(config);
      const npcs=npcIds.map(npc=>({npc,rank:randomAt(seed,`${encounter}:${seat}:${npc}:portal`)})).sort((a,b)=>a.rank-b.rank).slice(0,3);
      const portals=npcs.map(({npc},index)=>{
        const stock:string[]=[];
        for(let slot=0;slot<2;slot++) stock.push(spawnStockItem(state,id,seat,encounter,index,slot,npc));
        return {id:`portal-${encounter}-${seat}-${index}`,npc,stock,disabled:false};
      });return portals;
}
/** Core v0.6: swap one unopened door for a different merchant with fresh goods. The price climbs with every reroll until the encounter ends. */
function rerollPortal(state:AppraisalState,p:Appraiser,portalId:string):void {
  check(state.config.core2 && state.phase==='PORTALS' && !p.eventOffer && !p.selectedPortalId,'reroll','รีประตูได้เฉพาะตอนเลือกประตู');
  const index=p.portals.findIndex(v=>v.id===portalId);const old=p.portals[index];
  check(old && !old.disabled,'portal','ประตูนี้รีไม่ได้');
  const shown=new Set(p.portals.map(v=>v.npc));
  const unseen=activeNpcs(state.config).filter(npc=>!shown.has(npc));
  const pool=unseen.length?unseen:activeNpcs(state.config).filter(npc=>npc!==old.npc);
  check(pool.length,'reroll','ไม่มีพ่อค้าให้เปลี่ยน');
  const done=p.portalRerolls??0;spend(state,p,0,rerollCost(done),'portal-reroll');
  const seat=state.players.indexOf(p);const tag=`${index}r${done+1}`;
  const npc=pool.map(npc=>({npc,rank:randomAt(state.seed,`${state.encounter}:${seat}:${npc}:portal:reroll${done+1}`)})).sort((a,b)=>a.rank-b.rank)[0]!.npc;
  const stock=[0,1].map(slot=>spawnStockItem(state,p.id,seat,state.encounter,tag,slot,npc));
  p.portals[index]={id:`portal-${state.encounter}-${seat}-${tag}`,npc,stock,disabled:false};
  p.portalRerolls=done+1;trace(state,p,'portal-rerolled',{from:old.npc,to:npc,energy:rerollCost(done)});
}
function makeMarket(state:AppraisalState):DarkMarket {
  const market:DarkMarket={encounter:state.encounter,open:false,budget:0,orders:[]};
  // Vault auctions roll independently of the sell-order market.
  if(state.config.brokerage) market.lots=auctionLots(state);
  if(!(state.config.core2 && omenNow(state)?.marketOpen) && randomAt(state.seed,`${state.encounter}:market:open`)>=state.config.marketProbability) return market;
  const pool=[...new Set(Object.values(state.items).map(item=>item.kind))];
  const count=1+Math.floor(randomAt(state.seed,`${state.encounter}:market:count`)*Math.min(pool.length,state.config.marketMaxOrders));
  const selected=pool.map(kind=>({kind,rank:randomAt(state.seed,`${state.encounter}:market:${kind}:rank`)})).sort((a,b)=>a.rank-b.rank).slice(0,count);
  for(const {kind} of selected) {
    const price=Math.round(anchorOf(state.config,kind)*(1.25+.5*randomAt(state.seed,`${state.encounter}:market:${kind}:price`)));
    const order={id:`quote-${state.encounter}-${kind}`,kind,price,quota:Object.fromEntries(state.players.map(p=>[p.id,state.config.marketQuota])),...(state.config.commerce?{contract:makeMarketContract(key=>randomAt(state.seed,`${state.encounter}:market:${kind}:contract:${key}`),!!state.config.survival)}:{})};
    const reserved=marketOrderReserve(order)*state.config.marketQuota*state.players.length;
    if(market.budget+reserved>state.bank-state.reservedRewards) continue;
    market.orders.push(order);market.budget+=reserved;
  }
  market.open=market.orders.length>0; return market;
}
function pauseIfNeeded(state:AppraisalState,p:Appraiser):void {
  if(!state.config.survival && p.energy===0 && !p.paused && !(state.config.freeMerchantAction && (p.selectedPortalId===null || p.stock.some(id=>merchantActionFree(state,p,id))))) {
    // Settle a previously accepted risk before energy exhaustion removes action rights.
    if(p.eventOffer && isConsequence(p.eventOffer.id)) defaultEvent(state,p);
    if(!p.paused) { p.paused='exhausted'; p.done=true; p.eventOffer=null; trace(state,p,'exhausted'); }
  }
  if(p.paused) {p.done=true;p.eventOffer=null;}
}
function settleEncounter(state:AppraisalState):void {
  if(state.config.brokerage) {for(const p of state.players) settleRemainingUnsold(state,p);settleAuction(state);}
  for(const p of state.players) {
    if(state.config.survival && p.life===0){
      if(p.subsidy){p.subsidy=false;state.reservedRewards--;}
      state.history.push({encounter:state.encounter,playerId:p.id,gain:0,accuracy:0,score:0,paused:'dead'});continue;
    }
    if(status(p,'D05')) {p.energy=Math.max(0,p.energy-2);consumeStatus(p,'D05');trace(state,p,'breath-drain');}
    if(status(p,'D11')) {p.energy=Math.max(0,p.energy-1);consumeStatus(p,'D11');trace(state,p,'swarm-venom');}
    if(omenNow(state)?.settleEnergy) {p.energy=Math.max(0,p.energy-omenNow(state)!.settleEnergy!);trace(state,p,'omen-plague');}
    if(state.config.core2) applyCore2Settlement(state,p);
    pauseIfNeeded(state,p);
    const gain=Math.max(0,wealth(state,p)-p.startWealth);
    const score=state.config.survival?0:p.paused==='dead'?0:gain+p.accuracyBonus;
    p.score+=score; state.history.push({encounter:state.encounter,playerId:p.id,gain,accuracy:p.accuracyBonus,score,paused:p.paused});
    if(p.subsidy) {p.subsidy=false;state.reservedRewards--;}
    if(state.config.survival && p.life!>0 && state.config.core2) applyDread(state,p);
    if(state.config.survival && p.life!>0){damageLife(state,p,state.config.core2?decayFor(state.encounter):state.config.survival.encounterLifeCost,'dimensional-decay');if(p.life!>0)mendWithShards(state,p);}
  }
  state.market.open=false; state.market.budget=0;
  for(const offer of state.trades) if(offer.status==='open') offer.status='rejected';
  if(state.config.survival && (state.players.every(p=>p.life===0) ))collectRun(state);
  else {state.phase='REVEAL';openRoundRewards(state);}
}
function progress(state:AppraisalState):void {
  let moves=0;
  while(moves++<4 && state.players.every(p=>p.done || !!p.paused)) {
    if(state.phase==='PORTALS') {
      state.phase='APPRAISAL';
      for(const p of state.players) { p.done=!!p.paused || !p.stock.length; if(!p.done && !drawPersonalNpcEvent(state,p) && !drawBondEvent(state,p) && !drawWishEvent(state,p) && !drawExpansionEvent(state,p) && !drawPolishEvent(state,p)) drawEvent(state,p); }
    } else if(state.phase==='APPRAISAL') {
      state.phase='TRADE';
      for(const p of state.players) {p.done=!!p.paused; if(!p.done && !drawExpansionEvent(state,p) && !drawPolishEvent(state,p)) drawEvent(state,p);}
    } else if(state.phase==='TRADE') { settleEncounter(state); break; }
    else break;
  }
}
function npcActionAllowed(state:AppraisalState,p:Appraiser):void {
  check(state.phase==='APPRAISAL','phase','ยังไม่ใช่ช่วงประเมิน'); check(!p.eventOffer,'event-pending','เลือกผล event ก่อน');
}
function share(state:AppraisalState,p:Appraiser,itemId:string,allow:boolean,purchaseAllowed:boolean,claims?:Claims,rebate=0):void {
  const item=state.items[itemId];
  check(item && (item.owner===p.id || p.stock.includes(itemId)),'owner','เปิดได้เฉพาะรายการของตน');
  check(!purchaseAllowed || (item.owner===p.id ? unlocked(p,itemId) : !!p.valuations[itemId]),'listing','ต้องประเมินสินค้าหรือปลดล็อกก่อนเปิดให้ซื้อ');
  const stated=claims && Object.keys(claims).length?{...(claims.genuine!==undefined?{genuine:claims.genuine}:{}),...(claims.cursed!==undefined?{cursed:claims.cursed}:{})}:undefined;
  // An appraiser may state facts they never checked: that is exactly what a buyer can challenge.
  check(!stated || (state.config.challenge && item.owner.startsWith('npc:') && allow && purchaseAllowed),'claims','ระบุข้อมูลได้เฉพาะสินค้าร้านที่ประกาศขายและประเมินแล้ว');
  check(Number.isSafeInteger(rebate) && rebate>=0 && rebate<=1000 && (rebate===0 || allow && purchaseAllowed && p.credits>=rebate),'rebate','ค่าแถมต้องเป็นจำนวนเต็ม 0–1000 เปิดขายอยู่ และเจ้าของต้องมีเครดิตพอ');
  state.listings=state.listings.filter(l=>l.itemId!==itemId);
  if(allow) state.listings.push({ownerId:p.id,itemId,purchase:purchaseAllowed,...(stated?{claims:stated}:{}),...(rebate?{rebate}:{})});
  trace(state,p,'listing-shared',{itemId,allow,purchase:purchaseAllowed,...(stated?{claims:stated}:{}),...(rebate?{rebate}:{})});
}
function propose(state:AppraisalState,p:Appraiser,action:Extract<AppraisalAction,{type:'propose'}>):void {
  const seller=player(state,action.sellerId);
  check(seller.id!==p.id && !seller.paused && !seller.done,'seller','เจ้าของยังไม่พร้อมต่อรอง');
  const listing=state.listings.find(l=>l.ownerId===seller.id && l.itemId===action.itemId && l.purchase);
  check(listing,'listing','เจ้าของยังไม่เปิดให้ซื้อ');
  check(Number.isSafeInteger(action.credits) && action.credits>=0 && action.credits<=1000 && p.credits>=action.credits,'price','credit ที่เสนอไม่ถูกต้อง');
  const item=state.items[action.itemId]!; const source=item.owner.startsWith('npc:')?'npc':'inventory';
  if(source==='inventory') ownedItem(state,seller,item.id,true); else stockItem(state,seller,item.id);
  if(source==='npc') check(seller.dealMode!=='condition' || action.condition===true,'condition','ต้องยอมรับเงื่อนไขร้านนี้');
  if(action.challenge!==undefined) {
    const claim=listing.claims?.[action.challenge];
    check(state.config.challenge && source==='npc' && claim!==undefined,'challenge','ท้าทายได้เฉพาะคำระบุที่ผู้ประเมินให้ไว้');
    const quote=npcQuote(seller,item);check(p.credits>=action.credits+quote+challengePenalty(quote),'credits','เครดิตไม่พอสำหรับราคา ค่าแนะนำ และค่าปรับถ้าท้าทายผิด');
    if(action.sealId!==undefined) {check(ownedItem(state,p,action.sealId,true).kind==='void-seal','challenge','ของที่เลือกไม่ใช่ตราโมฆะ');}
  } else check(action.sealId===undefined,'challenge','ตราโมฆะใช้ได้กับการท้าทายเท่านั้น');
  if(action.swapItemId) {check(source==='inventory','swap','ร้าน NPC รับค่าแนะนำเป็น credit เท่านั้น');ownedItem(state,p,action.swapItemId,true);}
  check(state.trades.filter(o=>o.status==='open' && o.buyerId===p.id).length<8,'offers','มีข้อเสนอค้างมากเกินไป');
  state.trades.push({id:`trade-${state.encounter}-${p.id}-${action.requestId}`,buyerId:p.id,sellerId:seller.id,itemId:item.id,swapItemId:action.swapItemId??null,credits:action.credits,source,encounter:state.encounter,status:'open',condition:action.condition===true,...(action.challenge!==undefined?{challenge:action.challenge}:{}),...(action.sealId!==undefined?{sealId:action.sealId}:{})});
}
/** Dark order tickets: enough of them force a shared shop item to sell at the appraised price, with no answer or haggling. */
function forceBuy(state:AppraisalState,p:Appraiser,action:Extract<AppraisalAction,{type:'force-buy'}>):void {
  const seller=player(state,action.sellerId);
  check((p.darkTickets??0)>=TRUST_RULES.ticketsToForce,'tickets',`ต้องมีตั๋วคำสั่งมืด ${TRUST_RULES.ticketsToForce} ใบ`);
  check(seller.id!==p.id && seller.paused!=='dead','seller','บังคับซื้อจากเจ้าของนี้ไม่ได้');
  check(state.listings.some(l=>l.ownerId===seller.id && l.itemId===action.itemId),'listing','เจ้าของยังไม่เปิดรายการนี้');
  const item=stockItem(state,seller,action.itemId);
  const rebate=state.listings.find(l=>l.itemId===action.itemId)?.rebate;
  check(!!seller.valuations[item.id],'appraisal','บังคับซื้อได้เฉพาะของที่ประเมินแล้ว');
  if(state.config.survival){linkTrade(p,seller.id,state.encounter);linkTrade(seller,p.id,state.encounter);}
  p.darkTickets=p.darkTickets!-TRUST_RULES.ticketsToForce;
  purchase(state,p,seller,[item.id],{condition:seller.dealMode==='condition'});
  const rebated=payRebate(state,seller,p,rebate,false);p.paid={...p.paid,[item.id]:Math.max(0,(p.paid?.[item.id]??0)-rebated)};
  state.listings=state.listings.filter(l=>l.itemId!==item.id);
  const note=`ใช้ตั๋วคำสั่งมืดบังคับซื้อ ${ITEM_SPECS[item.kind].name} ตามราคาประเมิน`;
  p.notes.push(note);p.notes=p.notes.slice(-30);
  seller.notes.push(`${ITEM_SPECS[item.kind].name}ถูกบังคับซื้อด้วยตั๋วคำสั่งมืด ตามราคาประเมิน`);seller.notes=seller.notes.slice(-30);
  trace(state,p,'forced-purchase',{itemId:item.id,sellerId:seller.id,tickets:p.darkTickets});
}
function respond(state:AppraisalState,p:Appraiser,offerId:string,accept:boolean):void {
  const offer=state.trades.find(o=>o.id===offerId);
  check(offer && offer.encounter===state.encounter && offer.status==='open' && offer.sellerId===p.id,'offer','ข้อเสนอหมดอายุหรือไม่ใช่ของคุณ');
  if(!accept) {offer.status='rejected';return;}
  const buyer=player(state,offer.buyerId); check(!buyer.paused && !buyer.done,'buyer','ผู้ซื้อยังไม่พร้อม');
  const listing=state.listings.find(l=>l.itemId===offer.itemId && l.ownerId===p.id && l.purchase);
  check(listing,'listing','รายการไม่เปิดแล้ว');
  check(p.credits+offer.credits>=(listing.rebate??0),'rebate','เครดิตเจ้าของไม่พอจ่ายค่าแถม');
  if(state.config.survival){linkTrade(p,buyer.id,state.encounter);linkTrade(buyer,p.id,state.encounter);}
  let penalty=0;
  if(offer.source==='npc') {
    const settled=offer.challenge?settleChallenge(state,buyer,p,offer):{discount:0,penalty:0};penalty=settled.penalty;
    purchase(state,buyer,p,[offer.itemId],{condition:offer.condition,...(settled.discount?{discount:settled.discount}:{})});
  }
  else {
    const item=ownedItem(state,p,offer.itemId,true);
    const swap=offer.swapItemId?ownedItem(state,buyer,offer.swapItemId,true):null;
    check(buyer.credits>=offer.credits,'credits','ผู้ซื้อเงินไม่พอ');
    p.inventory=p.inventory.filter(id=>id!==item.id); buyer.inventory.push(item.id); item.owner=buyer.id;
    if(swap) {buyer.inventory=buyer.inventory.filter(id=>id!==swap.id);p.inventory.push(swap.id);swap.owner=p.id;}
  }
  transfer(state,buyer,p,offer.credits,offer.source==='npc'?'cross-shop-fee':'p2p');
  if(penalty) transfer(state,buyer,p,penalty,'challenge-penalty');
  const rebated=payRebate(state,p,buyer,listing.rebate,true);
  buyer.paid={...buyer.paid,[offer.itemId]:Math.max(0,(offer.source==='npc'?(buyer.paid?.[offer.itemId]??0):0)+offer.credits+penalty-rebated)};
  state.listings=state.listings.filter(l=>l.itemId!==offer.itemId && l.itemId!==offer.swapItemId);
  offer.status='accepted';
  for(const party of [p,buyer]) if(party.subsidy) {party.subsidy=false;state.reservedRewards--;reward(state,party,1,'E43');}
  trace(state,p,'trade-completed',{offerId,itemId:offer.itemId,buyerId:buyer.id,credits:offer.credits,source:offer.source});
  pauseIfNeeded(state,buyer);
}
function expireUnavailableOffers(state:AppraisalState):void {
  for(const offer of state.trades) {
    if(offer.status!=='open') continue;
    const seller=player(state,offer.sellerId),buyer=player(state,offer.buyerId),item=state.items[offer.itemId];
    const listed=state.listings.some(l=>l.itemId===offer.itemId && l.ownerId===seller.id && l.purchase);
    const available=offer.source==='inventory'?item?.owner===seller.id && unlocked(seller,offer.itemId):item?.owner===`npc:${seller.id}:${state.encounter}` && seller.stock.includes(offer.itemId);
    const swapAvailable=!offer.swapItemId || (state.items[offer.swapItemId]?.owner===buyer.id && unlocked(buyer,offer.swapItemId));
    if(!listed || !available || !swapAvailable || seller.paused || buyer.paused || seller.done || buyer.done) {
      offer.status='rejected';trace(state,seller,'offer-expired',{offerId:offer.id,itemId:offer.itemId});
    }
  }
}
export function applyAppraisalAction(previous:AppraisalState,action:AppraisalAction):AppraisalState {
  check(action && typeof action==='object' && typeof action.playerId==='string' && typeof action.requestId==='string' && /^[a-zA-Z0-9_-]{1,80}$/.test(action.requestId),'request','คำสั่งไม่ถูกต้อง');
  const key=`${action.playerId}:${action.requestId}`; const signature=JSON.stringify(action);
  if(previous.accepted[key]) {check(previous.accepted[key]===signature,'request-conflict','request ID ถูกใช้กับคำสั่งอื่น');return previous;}
  check(action.encounter===previous.encounter,'stale-encounter','คำสั่งมาจาก encounter เก่า');
  const roundAction=action.type==='round-flip' || action.type==='round-bank' || action.type==='round-raise';
  check(roundAction?previous.phase==='REVEAL':!['REVEAL','RESULTS'].includes(previous.phase),'phase','ช่วงนี้ไม่รับ action');
  const state=structuredClone(previous); const p=player(state,action.playerId);
  if(roundAction) {
    if(action.type==='round-flip')flipRoundReward(state,p,action.guess,action.attempt,action.guesses);
    else if(action.type==='round-raise')raiseRoundReward(state,p,action.coinCount,action.attempt);
    else bankRoundReward(state,p);
    state.revision++;state.accepted[key]=signature;state.commands.push(structuredClone(action));enforceCaps(state);assertAppraisalInvariants(state);return state;
  }
  check(!p.paused && !p.done,'inactive','ผู้เล่นพักหรือจบช่วงแล้ว');
  check(!p.eventOffer || !isConsequence(p.eventOffer.id) || action.type==='event' || action.type==='done','consequence','resolve ผล NPC ก่อน');
  switch(action.type) {
    case 'enter': {
      check(state.phase==='PORTALS' && !p.eventOffer,'phase','เลือก event ก่อนเข้าประตู');
      const portal=p.portals.find(v=>v.id===action.portalId && !v.disabled); check(portal,'portal','ประตูนี้เข้าไม่ได้');
      p.selectedPortalId=portal.id;p.stock=[...portal.stock];
      for(let slot=2;slot<2+stockBonus(state,p).extra;slot++)p.stock.push(spawnStockItem(state,p.id,state.players.indexOf(p),state.encounter,p.portals.indexOf(portal),slot,portal.npc));
      redeemNpcContracts(state,p,portal.npc);p.done=true;trace(state,p,'portal-entered',{portalId:portal.id,npc:portal.npc});break;
    }
    case 'reroll-portal': rerollPortal(state,p,action.portalId);break;
    case 'inspect': npcActionAllowed(state,p);inspect(state,p,action.itemId,action.property);break;
    case 'appraise': case 'counter': {
      npcActionAllowed(state,p);check(!p.caught,'npc-closed','NPC ที่จับได้แล้วไม่รับการประเมินใหม่');
      const caught=appraise(state,p,action.itemId,action.value,action.type==='counter',action.acceptDanger===true); drawBacklashEvent(state,p);if(caught && !p.eventOffer) drawEvent(state,p,true);break;
    }
    case 'buy': npcActionAllowed(state,p);purchase(state,p,p,action.itemIds,{condition:action.condition});break;
    case 'activate': check(['APPRAISAL','TRADE'].includes(state.phase) && !p.eventOffer,'phase','resolve event ก่อนเปิดใช้');activate(state,p,action.itemId);break;
    case 'recover-resource': {
      npcActionAllowed(state,p);const offer=recoveryOffer(state,p);
      check(offer && offer.target===action.target,'recovery','พ่อค้านี้ไม่มีดีลฟื้นที่เลือกหรือใช้สิทธิ์แล้ว');
      check(offer.target==='life'?p.life!<maxLifeOf(state,p)!:p.energy<maxEnergyOf(state,p),'recovery','ทรัพยากรนี้เต็มแล้ว');
      spend(state,p,offer.credits,0,'recovery-deal');p.recoveryUsed=true;
      const amount=recoveryAmount(state,p,offer);
      if(offer.target==='life'){if(amount)healLife(state,p,amount,'recovery-deal');p.notes.push(`ดีลฟื้นชีวิต: จ่าย ${offer.credits} เครดิต ได้ฟื้น ${amount}`);p.notes=p.notes.slice(-30);}
      else recover(state,p,amount,'recovery-deal');
      break;
    }
    case 'steal': npcActionAllowed(state,p);stealShop(state,p,action.itemId);drawTheftEvent(state,p);break;
    case 'pickpocket': check(['APPRAISAL','TRADE'].includes(state.phase) && !p.eventOffer,'phase','resolve event ก่อน');pickpocket(state,p,action.victimId);drawTheftEvent(state,p);break;
    case 'barter': npcActionAllowed(state,p);check(state.config.core2,'action-type','ห้องนี้ไม่มีการแลกของ');barter(state,p,action.itemId,action.targetItemId);drawTheftEvent(state,p);break;
    case 'skill': npcActionAllowed(state,p);useSkill(state,p,action.itemId);break;
    case 'wish-new': npcActionAllowed(state,p);wishNew(state,p,action.replaceNpc);break;
    case 'wish-sell': npcActionAllowed(state,p);wishSell(state,p,action.itemId,action.markup);break;
    case 'cleanse': npcActionAllowed(state,p);cleanseItem(state,p,action.itemId,action.stoneId);break;
    case 'event': resolveEvent(state,p,action);break;
    case 'unsold': check(state.config.brokerage && ['APPRAISAL','TRADE'].includes(state.phase) && !p.eventOffer,'phase','resolve event ก่อนจัดการของค้าง');settleUnsold(state,p,action.itemId,action.choice);break;
    case 'bid': check(state.config.brokerage,'action-type','ห้องนี้ไม่มีการประมูล');placeBid(state,p,action.lotId,action.credits);break;
    case 'market-sell': marketSell(state,p,action.itemId,action.orderId,action.resolution);break;
    case 'share': check(['APPRAISAL','TRADE'].includes(state.phase),'phase','ยังเปิดรายการไม่ได้');share(state,p,action.itemId,action.allow,action.purchase,action.claims,action.rebate);break;
    case 'force-buy': check(state.phase==='TRADE','phase','ยังไม่ใช่ช่วงต่อรอง');forceBuy(state,p,action);break;
    case 'propose': check(state.phase==='TRADE','phase','ยังไม่ใช่ช่วงต่อรอง');propose(state,p,action);break;
    case 'respond': check(state.phase==='TRADE','phase','ยังไม่ใช่ช่วงต่อรอง');respond(state,p,action.offerId,action.accept);break;
    case 'done': defaultEvent(state,p);p.done=true;for(const offer of state.trades) if(offer.status==='open' && [offer.buyerId,offer.sellerId].includes(p.id)) offer.status='rejected';break;
    default: check(false,'action-type','ไม่รู้จักคำสั่ง');
  }
  pauseIfNeeded(state,p); progress(state); expireUnavailableOffers(state); state.revision++;
  state.accepted[key]=signature;state.commands.push(structuredClone(action));enforceCaps(state);assertAppraisalInvariants(state);return state;
}
export function advanceAppraisalEncounter(previous:AppraisalState):AppraisalState {
  check(previous.phase==='REVEAL','phase','ต้องเปิดผลก่อน');
  const state=structuredClone(previous);state.commands.push({type:'advance'});state.revision++;
  for(const p of state.players)if(p.roundReward && !p.roundReward.settled)bankRoundReward(state,p);
  if(!state.config.survival && state.encounter===state.config.encounters) {closeNpcContracts(state);state.phase='RESULTS';enforceCaps(state);assertAppraisalInvariants(state);return state;}
  state.encounter++;state.phase='PORTALS';state.listings=[];state.market={encounter:state.encounter,open:false,budget:0,orders:[]};
  for(const p of state.players) {
    delete p.roundReward;
    delete p.merchantActionsUsed;
    delete p.itemUseBonuses;
    delete p.itemUseKinds;
    delete p.vampireDiscount;resetCore2Encounter(p);
    if(state.config.survival && p.life===0)continue;
    if(passivesEnabled(state.config))p.passiveUses={};
    if(state.config.survival){state.schedule[p.id]!.push(generatePortals(state,p.id,state.players.indexOf(p),state.encounter));p.recoveryUsed=false;}
    const rested=!!p.paused; p.paused=null;p.done=false;p.portals=structuredClone(state.schedule[p.id]![state.encounter-1]!);p.selectedPortalId=null;p.stock=[];p.valuations={};p.inspections=0;p.counters=0;p.activated=[];p.accuracyBonus=0;p.eventOffer=null;p.offerSlots=0;p.consequenceSlots=0;p.honorJob=false;p.honestyReward=null;p.acceptedDanger=false;p.caught=false;p.dealMode='any';if(p.cleansed)p.cleansed=[];if(p.wishes)p.wishTried=false;
    p.statuses=p.statuses.filter(s=>s.expires>=state.encounter && s.charges>0);p.startWealth=wealth(state,p);
    if(state.config.survival)spend(state,p,0,Math.min(p.energy,state.config.survival.entryEnergyCost),'encounter-entry');
    else if(rested) recover(state,p,Math.max(0,state.config.recoveryEnergy-p.energy),'encounter-recovery',true);else recover(state,p,2,'encounter-rest',true);
    if(status(p,'D04')?.starts===state.encounter) {spend(state,p,Math.min(2,p.credits),0,'D04');consumeStatus(p,'D04');}
    if(status(p,'B09')?.starts===state.encounter) {consumeStatus(p,'B09');recover(state,p,2,'B09');}
    if(status(p,'D07')?.starts===state.encounter) {p.portals.at(-1)!.disabled=true;consumeStatus(p,'D07');}
  }
  state.market=makeMarket(state);
  for(const p of state.players) if(randomAt(state.seed,`${state.encounter}:${p.id}:entry-event`)<.55) drawEvent(state,p);
  enforceCaps(state);assertAppraisalInvariants(state);return state;
}
export function defaultAppraisalAction(state:AppraisalState,playerId:string,requestId:string):AppraisalAction | null {
  const p=player(state,playerId);if(p.paused || p.done || ['RESULTS','REVEAL'].includes(state.phase)) return null;
  return {type:'done',playerId,requestId,encounter:state.encounter};
}
export function assertAppraisalInvariants(state:AppraisalState):void {
  check(state.reservedRewards===state.players.filter(p=>p.subsidy).length+state.players.reduce((sum,p)=>sum+(p.npcContracts?.alien?.reservedCredits??0),0),'reward-reserve','งบรางวัลไม่ตรงสิทธิ์ที่จอง');
  check(Number.isSafeInteger(state.bank) && state.bank>=0 && state.market.budget>=0 && state.bank>=state.market.budget+state.reservedRewards,'economy','bank reserve ไม่ถูกต้อง');
  const roundFunding=state.ledger.filter(e=>e.from==='@round-fund');
  check(roundFunding.every(e=>state.config.roundRewards && e.reason==='round-reward' && state.players.some(p=>p.id===e.to)),'ledger','เงินรางวัลจบรอบไม่ถูกต้อง');
  const roundStakes=state.ledger.filter(e=>e.to==='@round-fund');
  check(roundStakes.every(e=>state.config.multiCoinRewards && e.reason==='round-stake' && state.players.some(p=>p.id===e.from)),'ledger','เงินทบเหรียญไม่ถูกต้อง');
  const itemFunding=state.ledger.filter(e=>e.from==='@item-fund');
  check(itemFunding.every(e=>passivesEnabled(state.config) && ['gear-commission','gear-market'].includes(e.reason) && state.players.some(p=>p.id===e.to)),'ledger','โบนัสสินค้าผิดกติกา');
  const expected=state.config.bankReserve+state.config.startingCredits*state.players.length+roundFunding.reduce((sum,e)=>sum+e.amount,0)-roundStakes.reduce((sum,e)=>sum+e.amount,0)+itemFunding.reduce((sum,e)=>sum+e.amount,0);
  check(state.bank+state.players.reduce((sum,p)=>sum+p.credits,0)===expected,'economy','credit รวมเปลี่ยนโดยไม่มี ledger');
  const initial:Record<string,number>={bank:state.config.bankReserve,'@round-fund':0,'@item-fund':0,...Object.fromEntries(state.players.map(p=>[p.id,state.config.startingCredits]))};
  for(const entry of state.ledger) {check(Number.isSafeInteger(entry.amount) && entry.amount>0 && initial[entry.from]!==undefined && initial[entry.to]!==undefined,'ledger','ledger ไม่ถูกต้อง');initial[entry.from]!-=entry.amount;initial[entry.to]!+=entry.amount;}
  check(initial.bank===state.bank && state.players.every(p=>initial[p.id]===p.credits),'ledger','ledger ไม่ตรง state');
  const owned=new Set<string>();
  for(const p of state.players) {
    check(!!p.npcTrust===!!state.config.commerce && Object.entries(p.npcTrust??{}).every(([npc,n])=>npc in NPC_SPECS && Number.isSafeInteger(n) && n>=0 && n<=TRUST_CAP),'npc-trust','ความไว้ใจ NPC ไม่ถูกต้อง');
    check(Object.values(p.passiveUses??{}).every(n=>Number.isSafeInteger(n) && n>=0),'passive-use','สิทธิ์ตรวจฟรีไม่ถูกต้อง');
    const r=p.roundReward;
    if(r) {
      const validAmount=state.config.multiCoinRewards
        ? Number.isSafeInteger(r.coinCount) && r.coinCount!>=1 && Number.isSafeInteger(r.staked) && r.staked===(r.coinCount!-1)*r.base && Number.isSafeInteger(r.net)
          && r.amount===r.base+(r.incomeBonus??0)+r.staked!+r.net! && r.amount>=0 && (r.amount>0 || r.settled)
          && r.staked===roundStakes.filter(e=>e.from===p.id && e.encounter===state.encounter).reduce((sum,e)=>sum+e.amount,0)
        : r.amount===r.base+(r.incomeBonus??0)+(r.winBonus??5)*r.flips || r.amount===0 && r.settled && r.lastFlip?.correct===false;
      check(state.config.roundRewards && r.encounter===state.encounter && r.base===(state.encounter%2?10:15) && Number.isSafeInteger(r.flips) && r.flips>=0 && Number.isSafeInteger(r.amount) && validAmount,'round-reward','ยอดรางวัลจบรอบไม่ถูกต้อง');
    }
    check(Number.isSafeInteger(p.credits) && p.credits>=0 && Number.isSafeInteger(p.energy) && p.energy>=0 && p.energy<=maxEnergyOf(state,p),'resources','ทรัพยากรไม่ถูกต้อง');
    if(state.config.survival)check(Number.isSafeInteger(p.life) && p.life!>=0 && p.life!<=maxLifeOf(state,p)! && (p.life===0)===(p.paused==='dead') && p.paused!=='exhausted','life','ชีวิตหรือสิทธิ์เล่นไม่ตรงกัน');
    check(p.darkTickets===undefined || Number.isSafeInteger(p.darkTickets) && p.darkTickets>=0,'tickets','ตั๋วคำสั่งมืดไม่ถูกต้อง');
    check(p.pulseShards===undefined || state.config.survival && Number.isSafeInteger(p.pulseShards) && p.pulseShards>=0 && p.pulseShards<=PULSE_RULES.bankCap,'pulse','เศษชีพจรไม่ถูกต้อง');
    check(p.inventory.every(id=>!owned.has(id) && !!owned.add(id) && state.items[id]?.owner===p.id),'owner','สินค้าซ้ำหรือเจ้าของไม่ตรง');
    const loan=p.npcContracts?.alien;
    if(loan){check(state.config.npcEvents && loan.itemIds.length>=1 && loan.itemIds.length<=3 && loan.reservedCredits===8*loan.itemIds.length && loan.dueAt===loan.lentAt+2 && loan.lentAt<=state.encounter,'alien-loan','สัญญายืมไม่ถูกต้อง');check(loan.itemIds.every(id=>!owned.has(id) && !!owned.add(id) && state.items[id]?.owner===`alien-loan:${p.id}`),'loan-owner','ของที่ให้ยืมซ้ำหรือเจ้าของไม่ตรง');}
    check(p.statuses.every(s=>s.charges>0 && (s.expires>=state.encounter || !!state.config.survival && p.life===0)) && new Set(p.statuses.map(s=>s.id)).size===p.statuses.length,'status','สถานะไม่ถูกต้อง');
  }
  for(const item of Object.values(state.items)) if(state.players.some(p=>p.id===item.owner)) check(owned.has(item.id),'owner','ของมีเจ้าของแต่ไม่มีใน inventory');
  for(const item of Object.values(state.items))if(item.owner.startsWith('alien-loan:'))check(owned.has(item.id),'loan-owner','ของที่ให้ยืมไม่มีสัญญา');
  check(!!state.config.brokerage===Array.isArray(state.vault),'vault','คลัง Dark Market ไม่ตรงกติกา');
  if(state.vault) check(new Set(state.vault).size===state.vault.length && state.vault.every(id=>state.items[id]?.owner==='dark-market') && Object.values(state.items).filter(i=>i.owner==='dark-market').length===state.vault.length,'vault','คลัง Dark Market ไม่ตรงเจ้าของ');
  if(state.config.survival){check(state.version===5,'version','กติกาชีวิตต้องเป็น v0.5');if(state.phase==='RESULTS')check(state.players.every(p=>p.life===0) && state.collector?.length===state.players.length,'collector','จบได้เมื่อทุกคนตายและ Collector คิดผลแล้ว');else check(!state.collector,'collector','เปิดผล Collector ก่อนจบไม่ได้');}
}
