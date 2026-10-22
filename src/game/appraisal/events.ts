import { inspectionLimit } from './passives.js';
import { randomAt } from '../random.js';
import { ITEM_SPECS, NPC_SPECS, expansionActive, itemFamily, priceRange } from './content.js';
import { check, consumeStatus, counterLimit, damageLife, grant, kill, known, learn, ownedItem, penaltyItem, maxEnergyOf, purchase, recover, removeStatus, retire, reward, saleApply, salePreview, spend, status, stockItem, trace, unlocked, wishSlotsOf } from './mechanics.js';
import { BOND_EVENT_IDS, BOON_EVENT_ID, EVENT_IDS, EXPANSION_EVENT_IDS, POLISH_EVENT_IDS, STATUS_IDS } from './types.js';
import { POLISH_EVENTS } from './polish-events.js';
import { anchorOf } from './core2.js';
import { CORE2_DRAW_IDS, core2EventChoices, core2EventEligible, core2EventItems, core2NeedsItem, core2Spec, isCore2Consequence, pickBacklash, resolveCore2Event } from './core2-events.js';
import { isNpcEvent, NPC_PERSONAL_EVENT, npcEventEligible, personalNpcOffer, resolvePersonalNpcEvent } from './npc-events.js';
import { applyWish, drawWishEvent as drawWish, shopNpcOf, wishEligible, wishPick } from './wishlist.js';
import { bondEligible, bondQuotes, bondSpec, bondTargets, resolveBond } from './brokerage.js';
import { wishFloor } from './wishlist-rules.js';
import type { AppraisalAction, AppraisalState, Appraiser, EventId, EventOffer, ItemKind, Knowledge, NpcId, StatusId } from './types.js';

const consequences: EventId[] = ['E48','E49','E50'];
/** Consequences are penalties the seat has earned: they cannot be declined, and a pending one blocks every other action. */
export const isConsequence=(id:EventId)=>consequences.includes(id) || isCore2Consequence(id);
function kindOwned(state: AppraisalState,p:Appraiser,kind:ItemKind):string[] { return p.inventory.filter(id => itemFamily(state.items[id]!.kind) === kind && !p.activated.includes(id)); }
function movable(p:Appraiser):string[] { return p.inventory.filter(id => unlocked(p,id)); }
/** What the effects/curse inspection would still teach about an item. */
const effectsUnknown=(state:AppraisalState,p:Appraiser,id:string)=>state.config.curseSight?known(state,p,id).cursed===undefined:!known(state,p,id).effectsKnown;
function debuffs(p:Appraiser):StatusId[] { return p.statuses.filter(s => s.id.startsWith('D')).map(s => s.id); }
function historyPrice(state:AppraisalState,p:Appraiser):number | undefined {
  const kinds=p.stock.map(id=>state.items[id]!.kind);
  const entry=state.trace.toReversed().find(t => {
    const ids=t.details.itemIds as string[] | undefined; const id=t.details.itemId as string | undefined;
    return t.encounter<state.encounter && typeof t.details.price==='number' && (ids?.length===1 ? kinds.includes(state.items[ids[0]!]!.kind) : !!id && kinds.includes(state.items[id]!.kind));
  });
  return entry?.details.price as number | undefined;
}
const NEW_DEBUFFS:StatusId[]=['D11','D12','D13','D14','D15','D16'];
const freeBankOf=(state:AppraisalState)=>state.bank-state.market.budget-state.reservedRewards;
/** Buffs the seat could be offered: not already active, and not the one-use shields that would instantly vanish. */
function boonPool(p:Appraiser):StatusId[] {return STATUS_IDS.filter(id=>id.startsWith('B') && !status(p,id));}
/** Three distinct boons, shuffled by the seed and the offer key so every draft differs. */
function draftBoons(state:AppraisalState,p:Appraiser,key:string):StatusId[] {
  return boonPool(p).map(id=>({id,rank:randomAt(state.seed,`${key}:boon:${id}`)})).sort((a,b)=>a.rank-b.rank).slice(0,3).map(row=>row.id);
}
/** Polish events: table-driven; each needs its cost, its reward from the bank, and a status it would actually change. */
function polishEligible(state:AppraisalState,p:Appraiser,id:EventId):boolean {
  const spec=POLISH_EVENTS[id];
  if(!state.config.polish || !spec || state.phase!==spec.phase) return false;
  return p.credits>=(spec.credits??0) && p.energy>=(spec.energy??0) && freeBankOf(state)>=(spec.reward??0)
    && !spec.avoid.some(s=>!!status(p,s)) && (!spec.needsAuctions || !!state.config.brokerage);
}
/** Expansion events: only with the deep-sea/swarm rules, one per context, never in the original random pool. */
function expansionEligible(state:AppraisalState,p:Appraiser,id:EventId):boolean {
  if(!expansionActive(state.config)) return false;
  const npc=p.selectedPortalId?p.portals.find(portal=>portal.id===p.selectedPortalId)?.npc:undefined;
  const bank=freeBankOf(state);const survival=!!state.config.survival;
  // Selling trade news needs something to trade, and is pointless while the smell of the hive still clings.
  if(id==='E92') return state.phase==='TRADE' && bank>=2 && !status(p,'D13') && (!state.config.polish || p.inventory.length>0);
  if(state.phase!=='APPRAISAL') return false;
  switch(id) {
    case 'E84': return npc==='deepsea' && p.energy>=1;
    case 'E85': return npc==='swarm' && p.credits>=1;
    case 'E86': return bank>=3 && !status(p,'D15');
    case 'E87': return p.energy>=2 && bank>=6;
    case 'E88': return p.credits>=1 && p.statuses.some(s=>NEW_DEBUFFS.includes(s.id) && s.charges>0);
    case 'E89': return !status(p,'B11') && !status(p,'D14');
    case 'E90': return npc==='swarm';
    case 'E91': return npc==='deepsea' && (survival?p.life!>1:p.energy>=2);
    case 'E93': return p.energy>=1 && bank>=1;
    default: return false;
  }
}
export function eventEligible(state:AppraisalState,p:Appraiser,id:EventId):boolean {
  if (p.paused || p.done || ['RESULTS','REVEAL'].includes(state.phase)) return false;
  if(core2Spec(id))return core2EventEligible(state,p,id);
  if(state.config.core2 && ['E01','E08','E10'].includes(id))return false;
  if(isNpcEvent(id))return npcEventEligible(state,p,id);
  if (bondSpec(id)) return bondEligible(state,p,id);
  if (id==='E73') return wishEligible(state,p);
  if ((EXPANSION_EVENT_IDS as readonly string[]).includes(id)) return expansionEligible(state,p,id);
  if ((POLISH_EVENT_IDS as readonly string[]).includes(id)) return polishEligible(state,p,id);
  if (id===BOON_EVENT_ID) return !!state.config.polish && state.phase==='APPRAISAL' && boonPool(p).length>=3;
  const npc=p.stock[0] ? state.items[p.stock[0]]!.npc : null;
  const stock=p.stock.filter(itemId => state.items[itemId]?.owner===`npc:${p.id}:${state.encounter}`);
  const unknownPrice=stock.some(itemId=>known(state,p,itemId).base===undefined);
  const inspectable=p.inspections<inspectionLimit(state,p);
  const next=!!state.config.survival || state.encounter<state.config.encounters;
  if (consequences.includes(id)) {
    if (!p.caught || p.consequenceSlots>=1) return false;
    return id==='E48' || (id==='E49' && next) || (id==='E50' && npc==='darkone' && p.acceptedDanger);
  }
  if (['E01','E08','E10'].includes(id)) return state.phase==='PORTALS' && p.portals.filter(v=>!v.disabled).length>1 && (id!=='E08' || next || NPC_SPECS[p.portals[1]!.npc].condition!=='D04') && (id!=='E10' || unknownPrice || p.stock.length===0);
  if (state.phase==='PORTALS') return false;
  if (Number(id.slice(1))<=30 && state.phase!=='APPRAISAL') return false;
  const bank=state.bank-state.market.budget-state.reservedRewards;
  switch(id) {
    case 'E02': return npc==='orc' && stock.length>0 && !Object.keys(p.valuations).length;
    case 'E03': return npc==='vampire' && p.energy<maxEnergyOf(state,p);
    case 'E04': return npc==='autometa' && unknownPrice;
    case 'E05': return npc==='alien' && inspectable && stock.some(v=>effectsUnknown(state,p,v));
    case 'E06': return npc==='darkone' && next && debuffs(p).some(v=>v!=='D04' || next);
    case 'E07': return npc==='beast' && inspectable && kindOwned(state,p,'food').some(v=>unlocked(p,v));
    case 'E09': return stock.length>0 && p.counters<counterLimit(p);
    case 'E11': return inspectable && stock.some(v=>known(state,p,v).genuine===undefined);
    case 'E12': return inspectable && stock.some(v=>state.items[v]!.certificate && known(state,p,v).certificate===undefined);
    case 'E13': return inspectable && stock.length>=2 && stock.filter(v=>known(state,p,v).base===undefined).length>=2;
    case 'E14': return historyPrice(state,p)!==undefined;
    case 'E15': return inspectable && stock.length>0 && unknownPrice;
    case 'E16': return inspectable && stock.some(v=>effectsUnknown(state,p,v));
    case 'E17': return inspectable && unknownPrice;
    case 'E18': return stock.length>0 && !Object.keys(p.valuations).length;
    case 'E19': return bank>=1 && stock.some(v=>known(state,p,v).genuine===false && state.publicKnowledge[v]?.genuine===undefined);
    case 'E20': return inspectable && stock.some(v=>!known(state,p,v).activationKnown);
    case 'E21': return stock.length>=2;
    case 'E22': return !status(p,'B07') && ['orc','darkone','beast'].includes(npc??'');
    case 'E23': return p.energy>=1 && stock.length>0;
    case 'E24': return npc==='vampire' && stock.length>0;
    case 'E25': return stock.length>0 && movable(p).some(v=>NPC_SPECS[npc!].favorite.includes(state.items[v]!.kind));
    case 'E26': return next;
    case 'E27': return next && stock.length>0;
    case 'E28': return npc==='darkone' && !status(p,'B08');
    case 'E29': return stock.length>0 && !status(p,'D09');
    case 'E30': return stock.length>0 && !status(p,'B06');
    case 'E31': return kindOwned(state,p,'mirror').length>0;
    case 'E32': return kindOwned(state,p,'orb').length>0 && p.energy<maxEnergyOf(state,p);
    case 'E33': return kindOwned(state,p,'key').length>0 && !!status(p,'D07');
    case 'E34': return kindOwned(state,p,'mask').length>0 && p.statuses.some(s=>s.id.startsWith('B') && s.id!=='B10');
    case 'E35': return kindOwned(state,p,'potion').length>0 && (!!status(p,'D01') || !!status(p,'D05'));
    case 'E36': return kindOwned(state,p,'battery').length>0 && inspectable;
    case 'E37': return state.phase==='APPRAISAL' && p.inventory.length>=3 && stock.length>0;
    case 'E38': return kindOwned(state,p,'amulet').length>0;
    case 'E39': return state.phase==='APPRAISAL' && kindOwned(state,p,'blade').length>0 && stock.some(v=>!p.valuations[v]);
    case 'E40': return kindOwned(state,p,'scanner').length>0;
    case 'E41': return debuffs(p).length>0;
    case 'E42': return p.energy<maxEnergyOf(state,p) || !!status(p,'D10');
    case 'E43': return state.phase==='TRADE' && !p.subsidy && bank>=1;
    case 'E44': return movable(p).length>=2 && bank>=Math.max(...movable(p).map(v=>salePreview(state,p,Math.floor(anchorOf(state.config,state.items[v]!.kind)*.75))));
    case 'E45': return Object.entries(p.knowledge).some(([item,k])=>['base','genuine','cursed'].some(f=>k[f as keyof Knowledge]!==undefined && state.publicKnowledge[item]?.[f as keyof Knowledge]===undefined && !p.revealedInfo.includes(`${item}:${f}`)));
    case 'E46': return p.energy>=1 && stock.some(v=>known(state,p,v).genuine===undefined) && bank>=2;
    case 'E47': return state.listings.some(l=>l.ownerId!==p.id && state.items[l.itemId]?.owner.startsWith('npc:') && !!state.players.find(other=>other.id===l.ownerId)?.valuations[l.itemId]);
    default: return false;
  }
}
export function eventChoices(state:AppraisalState,p:Appraiser,id:EventId):string[] {
  if(core2Spec(id))return core2EventChoices(state,p,id);
  switch(id) {
    case 'E01': return ['stay','switch','decline'];
    case 'E03': return ['pay','debt','decline'];
    case 'E06': return [...(debuffs(p).some(v=>v!=='D04')?['interest']:[]),...(debuffs(p).some(v=>v!=='D07')?['seal']:[]),'decline'];
    case 'E08': return ['cash','condition','decline'];
    case 'E10': return ['pay','fog','switch','decline'];
    case 'E11': return ['careful','force','decline'];
    case 'E15': return ['price','curse','decline'];
    case 'E18': return ['discount','risk','decline'];
    case 'E37': return ['pay','burden','decline'];
    case 'E40': return ['repair','fog','decline'];
    case 'E42': return [...(p.energy<maxEnergyOf(state,p)?['energy']:[]),...(status(p,'D10')?['cleanse']:[]),'decline'];
    case 'E48': return [...(p.credits>=2?['pay']:[]),...(p.inventory.length?['item']:[]),...(p.credits<2 && !p.inventory.length?['energy']:[])];
    case 'E49': return [...(p.credits>=2?['pay']:[]),'oath'];
    case 'E108': return ['pick','decline'];
    case 'E73': {const npc=shopNpcOf(p);const open=Object.keys(p.wishes??{});return state.config.wishContract && npc && !p.wishes?.[npc] && open.length>=wishSlotsOf(state,p,2)?[...open.map(n=>`replace:${n}`),'decline']:['accept','decline'];}
    case 'E50': return [...(p.inventory.length?['surrender']:[]),'die'];
    default: return ['accept','decline'];
  }
}
export function offerEvent(state:AppraisalState,p:Appraiser,id:EventId):void {
  check(!p.eventOffer && eventEligible(state,p,id),'event-ineligible','event ไม่เข้าเงื่อนไข');
  const reaction=isConsequence(id);
  const key=`${state.encounter}:${p.id}:${id}:${p.offerSlots}:${p.consequenceSlots}`;
  const ownKinds:Partial<Record<EventId,ItemKind>>={E07:'food',E31:'mirror',E32:'orb',E33:'key',E34:'mask',E35:'potion',E36:'battery',E38:'amulet',E39:'blade'};
  let itemIds=ownKinds[id]?kindOwned(state,p,ownKinds[id]!):p.stock;
  if(id==='E25') itemIds=movable(p).filter(v=>NPC_SPECS[state.items[p.stock[0]!]!.npc].favorite.includes(state.items[v]!.kind));
  if(['E44','E48','E50'].includes(id)) itemIds=id==='E44'?movable(p):p.inventory;
  if(core2Spec(id)) itemIds=core2EventItems(id,p);
  if(id==='E45') itemIds=Object.keys(p.knowledge);
  if(id==='E47') itemIds=state.listings.filter(l=>l.ownerId!==p.id && state.items[l.itemId]!.owner.startsWith('npc:')).map(l=>l.itemId);
  if(id==='E11') itemIds=itemIds.filter(v=>known(state,p,v).genuine===undefined);
  if(id==='E12') itemIds=itemIds.filter(v=>state.items[v]!.certificate && known(state,p,v).certificate===undefined);
  if(id==='E19') itemIds=itemIds.filter(v=>known(state,p,v).genuine===false && state.publicKnowledge[v]?.genuine===undefined);
  if(id==='E07') itemIds=itemIds.filter(v=>unlocked(p,v));
  const quotedPrices=Object.fromEntries(p.inventory.map(itemId=>[itemId,salePreview(state,p,Math.floor(anchorOf(state.config,state.items[itemId]!.kind)*.75))]));
  const facts:Record<string,Knowledge>={};
  if(id==='E45') {
    for(const itemId of itemIds) {
      const proof:Knowledge={};
      for(const fact of ['base','genuine','cursed'] as const) if(p.knowledge[itemId]?.[fact]!==undefined && state.publicKnowledge[itemId]?.[fact]===undefined && !p.revealedInfo.includes(`${itemId}:${fact}`)) Object.assign(proof,{[fact]:p.knowledge[itemId]![fact]});
      if(Object.keys(proof).length) facts[itemId]=proof;
    }
    itemIds=Object.keys(facts);
  }
  let giveItemId:string|undefined;let quotes=quotedPrices;
  const boons=id===BOON_EVENT_ID?draftBoons(state,p,key):undefined;
  const wish=id==='E73'?wishPick(state,p,shopNpcOf(p)!):undefined;
  if(bondSpec(id)) {const targets=bondTargets(state,p,id);itemIds=targets.itemIds;giveItemId=targets.giveItemId;quotes=bondQuotes(state,p,id);}
  const targetKinds=Object.fromEntries([...itemIds,...(giveItemId?[giveItemId]:[])].map(itemId=>[itemId,state.items[itemId]!.kind]));
  p.eventOffer={id,key,choices:eventChoices(state,p,id),itemIds:[...itemIds],statusIds:p.statuses.map(s=>s.id),otherPlayerIds:state.listings.filter(l=>l.ownerId!==p.id).map(l=>l.ownerId),quotedPrices:quotes,facts,targetKinds,...(giveItemId?{giveItemId}:{}),...(wish?{wish}:{}),...(boons?{boons}:{})};
  if(isNpcEvent(id))Object.assign(p.eventOffer,personalNpcOffer(state,p,id,key));
  if(reaction) p.consequenceSlots++; else p.offerSlots++;
  p.seenEvents.push(id); trace(state,p,'event-offered',{id,key,choices:p.eventOffer.choices});
}
export function drawEvent(state:AppraisalState,p:Appraiser,reaction=false):void {
  if(p.eventOffer || p.paused || p.done || (!reaction && p.offerSlots>=2) || (reaction && p.consequenceSlots>=1)) return;
  let pool=[...EVENT_IDS,...(state.config.core2 && !reaction?CORE2_DRAW_IDS:[])].filter(id=>consequences.includes(id)===reaction && eventEligible(state,p,id));
  const unseen=pool.filter(id=>!p.seenEvents.includes(id)); if(unseen.length) pool=unseen;
  if(!pool.length) return;
  const index=Math.floor(randomAt(state.seed,`${state.encounter}:${p.id}:${state.phase}:${p.offerSlots}:${p.consequenceSlots}:event`)*pool.length);
  offerEvent(state,p,pool[index]!);
}
export const drawWishEvent=(state:AppraisalState,p:Appraiser)=>drawWish(state,p,id=>offerEvent(state,p,id));
/** Roguelike variety: with polish rules a seat sees every offer it qualifies for before any repeats. */
function preferUnseen<T extends EventId>(state:AppraisalState,p:Appraiser,pool:readonly T[]):readonly T[] {
  if(!state.config.polish) return pool;
  const unseen=pool.filter(id=>!p.seenEvents.includes(id));return unseen.length?unseen:pool;
}
/** Polish rules: a seeded chance to offer one of the table-driven events that fits the table. */
export function drawPolishEvent(state:AppraisalState,p:Appraiser):boolean {
  if(!state.config.polish || p.eventOffer || p.paused || p.done || p.offerSlots>=2) return false;
  const pool=preferUnseen(state,p,[...POLISH_EVENT_IDS,BOON_EVENT_ID].filter(id=>eventEligible(state,p,id)));
  if(!pool.length || randomAt(state.seed,`${state.encounter}:${p.id}:${state.phase}:polish`)>=(state.phase==='TRADE'?.3:.45)) return false;
  offerEvent(state,p,pool[Math.floor(randomAt(state.seed,`${state.encounter}:${p.id}:${state.phase}:polish:pick`)*pool.length)]!);return true;
}
export function drawPersonalNpcEvent(state:AppraisalState,p:Appraiser):boolean {
  if(!state.config.npcEvents || p.eventOffer || p.offerSlots>=2)return false;
  const npc=shopNpcOf(p);const id=npc?NPC_PERSONAL_EVENT[npc]:undefined;
  if(!id || !eventEligible(state,p,id) || randomAt(state.seed,`${state.encounter}:${p.id}:personal-npc`)>=.65)return false;
  offerEvent(state,p,id);return true;
}
/** Expansion rules: a seeded chance to offer one of the ten new events that fits the table. */
export function drawExpansionEvent(state:AppraisalState,p:Appraiser):boolean {
  if(!expansionActive(state.config) || p.eventOffer || p.paused || p.done || p.offerSlots>=2) return false;
  const pool=preferUnseen(state,p,EXPANSION_EVENT_IDS.filter(id=>eventEligible(state,p,id)));
  if(!pool.length || randomAt(state.seed,`${state.encounter}:${p.id}:${state.phase}:expansion`)>=(state.phase==='TRADE' && state.config.polish?.3:.5)) return false;
  offerEvent(state,p,pool[Math.floor(randomAt(state.seed,`${state.encounter}:${p.id}:${state.phase}:expansion:pick`)*pool.length)]!);return true;
}
/** Brokerage rules: on meeting an NPC, a seeded chance offers one NPC × held-item event before the random pool. */
export function drawBondEvent(state:AppraisalState,p:Appraiser):boolean {
  const rules=state.config.brokerage;
  if(!rules || p.eventOffer || p.paused || p.done || p.offerSlots>=2) return false;
  const pool=preferUnseen(state,p,BOND_EVENT_IDS.filter(id=>eventEligible(state,p,id)));
  if(!pool.length || randomAt(state.seed,`${state.encounter}:${p.id}:bond`)>=rules.bondProbability) return false;
  offerEvent(state,p,pool[Math.floor(randomAt(state.seed,`${state.encounter}:${p.id}:bond:pick`)*pool.length)]!);return true;
}
function chooseItem(offer:EventOffer,command:Extract<AppraisalAction,{type:'event'}>):string {
  check(command.itemId && offer.itemIds.includes(command.itemId),'event-target','เลือกสินค้าที่อยู่ใน event'); return command.itemId;
}
function chooseStatus(offer:EventOffer,command:Extract<AppraisalAction,{type:'event'}>):StatusId {
  check(command.statusId && offer.statusIds.includes(command.statusId),'event-target','เลือกสถานะที่อยู่ใน event'); return command.statusId;
}
function eventInspect(state:AppraisalState,p:Appraiser,itemId:string,credits:number,energy:number,k:Knowledge):void {
  stockItem(state,p,itemId); check(p.inspections<inspectionLimit(state,p),'inspections','สิทธิ์ตรวจหมด');
  const cost=Math.max(0,energy+(status(p,'D01')?1:0)-(status(p,'B05')?1:0));
  spend(state,p,credits,cost,'event-inspect'); consumeStatus(p,'D01'); consumeStatus(p,'B05'); p.inspections++; learn(p,itemId,k);
}
export function resolveEvent(state:AppraisalState,p:Appraiser,command:Extract<AppraisalAction,{type:'event'}>):void {
  const offer=p.eventOffer; check(offer && offer.key===command.key && offer.choices.includes(command.choice),'event-choice','ข้อเสนอเก่าหรือไม่มีตัวเลือกนี้');
  const id=offer.id; const choice=command.choice;
  if(choice==='decline') { check(!isConsequence(id),'consequence','ปฏิเสธผลที่รับความเสี่ยงไว้ไม่ได้'); if(['E01','E10'].includes(id)) p.portals[0]!.disabled=true; p.eventOffer=null; p.resolvedEvents.push(id); trace(state,p,'event-declined',{id}); return; }
  if(core2Spec(id)){resolveCore2Event(state,p,offer,command);p.eventOffer=null;p.resolvedEvents.push(id);trace(state,p,'event-resolved',{id,choice});return;}
  if(isNpcEvent(id)){resolvePersonalNpcEvent(state,p,offer,command);p.eventOffer=null;p.resolvedEvents.push(id);trace(state,p,'event-resolved',{id,choice});return;}
  // The offer's captured targets are fixed. Resource/ownership conditions are rechecked at settlement.
  const item=()=>chooseItem(offer,command);
  const ownKind=(kind:ItemKind)=>{const itemId=item(); check(kindOwned(state,p,kind).includes(itemId),'event-target','สินค้าไม่เข้าเงื่อนไข'); ownedItem(state,p,itemId); return itemId;};
  if(bondSpec(id)) {resolveBond(state,p,offer,command);p.eventOffer=null;p.resolvedEvents.push(id);trace(state,p,'event-resolved',{id,choice});return;}
  if(id==='E73') {const npc=shopNpcOf(p);check(npc && offer.wish,'wish','ไม่มีคำขอ');applyWish(state,p,npc,offer.wish,choice.startsWith('replace:')?choice.slice(8) as NpcId:undefined);p.notes.push(`${NPC_SPECS[npc].name}อยากได้ ${ITEM_SPECS[offer.wish.kind].name} ให้ ${offer.wish.price} เครดิต${state.config.wishContract?` แต่ราคาลดลงทุกช่วง ไม่ต่ำกว่า ${wishFloor(offer.wish.kind)} เครดิต`:' ถ้ามีมาขายครั้งหน้า'}`);p.notes=p.notes.slice(-30);p.eventOffer=null;p.resolvedEvents.push(id);trace(state,p,'event-resolved',{id,choice});return;}
  const buy=(discount=0,extra?:StatusId,lock=false,barterItemId?:string)=>purchase(state,p,p,[item()],{discount,condition:p.dealMode==='condition',...(extra?{grantStatus:extra}:{}),lock,...(barterItemId?{barterItemId}:{})});
  switch(id) {
    case 'E01': if(choice==='stay') spend(state,p,0,1,id); else p.portals[0]!.disabled=true; break;
    case 'E02': p.honorJob=true; break;
    case 'E03': if(choice==='pay') spend(state,p,2,0,id); else grant(state,p,'D10'); recover(state,p,3,id); if(state.config.survival && choice==='debt')damageLife(state,p,1,'blood-pact'); break;
    case 'E04': spend(state,p,1,0,id); grant(state,p,'B01'); break;
    case 'E05': spend(state,p,0,1,id); grant(state,p,'B02'); break;
    case 'E06': {const selected=chooseStatus(offer,command); const next=choice==='interest'?'D04':'D07'; check(selected.startsWith('D') && selected!==next && status(p,selected),'event-target','ล้างสถานะที่เลือกไม่ได้'); removeStatus(p,selected); grant(state,p,next); break;}
    case 'E07': retire(state,p,ownKind('food'),id); grant(state,p,'B05'); break;
    case 'E08': p.dealMode=choice==='cash'?'cash':'condition'; p.portals.forEach((portal,index)=>portal.disabled=index!==(choice==='cash'?0:1)); break;
    case 'E09': buy(2,'D08'); break;
    case 'E10': if(choice==='pay') spend(state,p,2,0,id); else if(choice==='fog') grant(state,p,'D02'); else p.portals[0]!.disabled=true; break;
    case 'E11': {const v=item(); check(known(state,p,v).genuine===undefined,'known','รู้แล้ว'); eventInspect(state,p,v,0,choice==='careful'?2:1,{genuine:state.items[v]!.genuine}); if(choice==='force') grant(state,p,'D01'); break;}
    case 'E12': {const v=item(); check(state.items[v]!.certificate && known(state,p,v).certificate===undefined,'certificate','ไม่มีใบรับรองที่ตรวจได้'); eventInspect(state,p,v,1,0,{certificate:state.items[v]!.genuine}); break;}
    case 'E13': {const ids=p.stock.slice(0,2); check(ids.length===2 && ids.every(v=>known(state,p,v).base===undefined),'comparison','ไม่มีสินค้าคู่ที่ยังไม่รู้ราคา'); eventInspect(state,p,ids[0]!,0,1,{comparison:state.items[ids[0]!]!.base>=state.items[ids[1]!]!.base?ids[0]!:ids[1]!}); break;}
    case 'E14': {const price=historyPrice(state,p); check(price!==undefined,'history','ไม่มีประวัติราคา'); spend(state,p,1,0,id); p.notes.push(`ราคาซื้อขายจริงในอดีต ${price} credit ไม่ใช่ base ของชิ้นปัจจุบัน`); trace(state,p,'historical-price',{price}); break;}
    case 'E15': spend(state,p,0,1,id); grant(state,p,choice==='price'?'B01':'B02'); break;
    case 'E16': {const v=item();eventInspect(state,p,v,0,1,state.config.curseSight?{effectsKnown:true,cursed:state.items[v]!.cursed}:{effectsKnown:true}); break;}
    case 'E17': {const v=item(); const target=stockItem(state,p,v); const bounds=priceRange(target.kind,anchorOf(state.config,target.kind)); const offset=Math.floor(randomAt(state.seed,`${offer.key}:narrow`)*3); eventInspect(state,p,v,2,0,{range:[Math.max(bounds[0],target.base-offset-1),Math.min(bounds[1],target.base+3-offset)]}); break;}
    case 'E18': spend(state,p,0,1,id); p.honestyReward=choice==='discount'?'B03':'B04'; break;
    case 'E19': {const v=item(); check(known(state,p,v).genuine===false && state.publicKnowledge[v]?.genuine===undefined,'proof','ไม่มีผลตรวจใหม่ของปลอม'); state.publicKnowledge[v]={...state.publicKnowledge[v],genuine:false}; reward(state,p,1,id); break;}
    case 'E20': eventInspect(state,p,item(),0,2,{activationKnown:true}); break;
    case 'E21': purchase(state,p,p,p.stock.slice(0,2),{discount:2,condition:p.dealMode==='condition'}); break;
    case 'E22': spend(state,p,1,0,id); grant(state,p,'B07'); break;
    case 'E23': spend(state,p,0,1,id); grant(state,p,'B10'); break;
    case 'E24': buy(2,'D05'); break;
    case 'E25': {const v=item(); const npc=state.items[p.stock[0]!]!.npc; check(NPC_SPECS[npc].favorite.includes(ownedItem(state,p,v,true).kind),'barter','NPC ไม่ต้องการของนี้'); purchase(state,p,p,[p.stock[0]!],{barterItemId:v,condition:p.dealMode==='condition'}); break;}
    case 'E26': spend(state,p,2,0,id); grant(state,p,'B09'); break;
    case 'E27': buy(2,'D04'); break;
    case 'E28': spend(state,p,2,0,id); grant(state,p,'B08'); break;
    case 'E29': buy(3,undefined,true); break;
    case 'E30': buy(-2,'B06'); break;
    case 'E31': {const v=ownKind('mirror'); spend(state,p,0,1,id); p.activated.push(v); grant(state,p,'D05'); grant(state,p,'B01'); break;}
    case 'E32': retire(state,p,ownKind('orb'),id,false); spend(state,p,1,0,id); recover(state,p,3,id); break;
    case 'E33': check(status(p,'D07'),'status','ไม่มี D07'); retire(state,p,ownKind('key'),id,false); removeStatus(p,'D07'); break;
    case 'E34': {ownKind('mask'); const selected=chooseStatus(offer,command); check(selected.startsWith('B') && selected!=='B10' && status(p,selected),'status','เลือก buff ที่จะสละ'); removeStatus(p,selected); grant(state,p,'B10'); break;}
    case 'E35': {const selected=chooseStatus(offer,command); check(['D01','D05'].includes(selected) && status(p,selected),'status','เลือก D01 หรือ D05'); retire(state,p,ownKind('potion'),id,false); removeStatus(p,selected); break;}
    case 'E36': {const v=ownKind('battery'); spend(state,p,0,1,id); p.activated.push(v); grant(state,p,'B05'); break;}
    case 'E37': if(choice==='pay') spend(state,p,2,0,id); else grant(state,p,'D06'); break;
    case 'E38': {const v=ownKind('amulet'); spend(state,p,0,1,id); p.activated.push(v); grant(state,p,'D03'); grant(state,p,'B06'); break;}
    case 'E39': {const v=ownKind('blade'); spend(state,p,0,1,id); p.activated.push(v); grant(state,p,'D10'); grant(state,p,'B04'); break;}
    case 'E40': if(choice==='repair') {spend(state,p,0,2,id); removeStatus(p,'D02');} else grant(state,p,'D02'); break;
    case 'E41': {const selected=chooseStatus(offer,command); check(selected.startsWith('D') && status(p,selected),'status','เลือก debuff'); spend(state,p,2,0,id); removeStatus(p,selected); break;}
    case 'E42': if(choice==='energy') recover(state,p,2,id); else {check(status(p,'D10'),'status','ไม่มี D10'); removeStatus(p,'D10');} break;
    case 'E43': check(state.bank-state.market.budget-state.reservedRewards>=1,'bank','งบรางวัลไม่พอ'); p.subsidy=true; state.reservedRewards++; break;
    case 'E44': {const v=item(); check(movable(p).length>=2 && offer.quotedPrices[v]!==undefined,'collector','ไม่มีข้อเสนอรับซื้อ'); reward(state,p,saleApply(state,p,Math.floor(anchorOf(state.config,state.items[v]!.kind)*.75)),id); retire(state,p,v,id); break;}
    case 'E45': {const v=item(); const fact=command.fact; check(fact && ['base','genuine','cursed'].includes(fact),'fact','เลือกข้อมูลที่จะเปิด'); const value=p.knowledge[v]?.[fact]; check(value!==undefined && state.publicKnowledge[v]?.[fact]===undefined && !p.revealedInfo.includes(`${v}:${fact}`),'proof','ข้อมูลนี้ยังไม่เคยตรวจหรือเปิดแล้ว'); state.publicKnowledge[v]={...state.publicKnowledge[v],[fact]:value}; p.revealedInfo.push(`${v}:${fact}`); reward(state,p,1,id); break;}
    case 'E46': {const v=item(); const target=stockItem(state,p,v); check(typeof command.guess==='boolean' && known(state,p,v).genuine===undefined,'guess','ต้องทายแท้หรือปลอมที่ยังไม่รู้'); spend(state,p,0,1,id); const correct=command.guess===target.genuine; if(correct) reward(state,p,2,id); learn(p,v,{genuine:target.genuine}); p.notes.push(`${correct?'ทายถูก!':'ทายผิด'} ${ITEM_SPECS[target.kind].name}เป็น${target.genuine?'ของแท้':'ของปลอม'}${correct?' ได้ 2 เครดิต':''}`); p.notes=p.notes.slice(-30); trace(state,p,'guess',{itemId:v,correct}); break;}
    case 'E47': {const v=item(); check(state.listings.some(l=>l.itemId===v && l.ownerId!==p.id && state.items[v]!.owner.startsWith('npc:')),'listing','รายการข้ามร้านไม่ได้เปิด'); trace(state,p,'cross-shop-viewed',{itemId:v}); break;}
    case 'E94': case 'E95': case 'E96': case 'E97': case 'E98': case 'E99': case 'E100': case 'E101': {
      const spec=POLISH_EVENTS[id]!;check(spec.avoid.every(s=>!status(p,s)),'status','ผลติดตัวนี้ทำให้เหตุการณ์ไม่มีความหมายแล้ว');
      spend(state,p,spec.credits??0,spec.energy??0,id); if(spec.reward) reward(state,p,spec.reward,id); for(const s of spec.grant) grant(state,p,s); break;
    }
    case 'E108': {const picked=command.statusId;check(picked && offer.boons?.includes(picked) && !status(p,picked),'event-target','เลือกพรที่เสนอให้และยังไม่ติดตัว');grant(state,p,picked);p.notes.push(`รับพร ${picked}`);p.notes=p.notes.slice(-30);break;}
    case 'E84': spend(state,p,0,1,id); grant(state,p,'B12'); break;
    case 'E85': spend(state,p,1,0,id); grant(state,p,'B15'); break;
    case 'E86': reward(state,p,3,id); grant(state,p,'D15'); break;
    case 'E87': {spend(state,p,0,2,id); if(randomAt(state.seed,`${offer.key}:pearl-dive`)<.5){reward(state,p,6,id);grant(state,p,'B14');p.notes.push('ดำน้ำพบไข่มุก ได้ 6 เครดิตและลมหายใจใต้น้ำลึก');}else{grant(state,p,'D12');p.notes.push('ดำน้ำพลาด ถูกแรงดันห้วงลึกกด ซื้อครั้งถัดไปแพงขึ้น');} p.notes=p.notes.slice(-30); break;}
    case 'E88': {const selected=chooseStatus(offer,command); check(NEW_DEBUFFS.includes(selected) && status(p,selected),'status','เลือกผลเสียจากฝูงหรือห้วงลึกที่ติดตัว'); spend(state,p,1,0,id); removeStatus(p,selected); break;}
    case 'E89': grant(state,p,'B11'); grant(state,p,'D14'); break;
    case 'E90': grant(state,p,'B13'); grant(state,p,'D11'); break;
    case 'E91': {if(state.config.survival){check(p.life!>1,'life','ชีวิตไม่พอ');damageLife(state,p,1,id);} else spend(state,p,0,2,id); grant(state,p,'B16'); grant(state,p,'B14'); grant(state,p,'D16'); break;}
    case 'E92': reward(state,p,2,id); grant(state,p,'D13'); break;
    case 'E93': {spend(state,p,0,1,id); if(randomAt(state.seed,`${offer.key}:old-nest`)<.6){reward(state,p,1,id);grant(state,p,'B15');p.notes.push('ค้นรังร้างเจอของเหลือ ได้ 1 เครดิตและสายสัมพันธ์ของรัง');}else{grant(state,p,'D15');p.notes.push('รังร้างมีใยค้างอยู่ ติดใยพันขา');} p.notes=p.notes.slice(-30); break;}
    case 'E48': if(choice==='pay') spend(state,p,2,0,id); else if(choice==='item') penaltyItem(state,p,item()); else {check(p.credits<2 && !p.inventory.length,'penalty','ต้องเลือกค่าปรับที่ยังจ่ายได้'); p.energy=Math.max(0,p.energy-2);} break;
    case 'E49': if(choice==='pay') spend(state,p,2,0,id); else grant(state,p,'D08'); break;
    case 'E50': if(choice==='surrender') retire(state,p,item(),id,false); else kill(state,p); break;
  }
  p.eventOffer=null; p.resolvedEvents.push(id); trace(state,p,'event-resolved',{id,choice});
}
/** Safe timeout/defaults never accept a new optional contract. Confirmed consequences still settle. */
export function defaultEvent(state:AppraisalState,p:Appraiser):void {
  const offer=p.eventOffer; if(!offer) return;
  if(core2Spec(offer.id)){
    const choice=offer.choices.includes('decline')?'decline':offer.choices[0]!;
    resolveEvent(state,p,{type:'event',key:offer.key,playerId:p.id,requestId:'system-default',encounter:state.encounter,choice,...(core2NeedsItem(offer.id,choice)?{itemId:p.inventory[0]!}:{})});return;
  }
  const choice=offer.choices.includes('decline')?'decline':offer.choices.includes('pay')?'pay':offer.choices.includes('oath')?'oath':offer.choices.includes('die')?'die':offer.choices.includes('energy')?'energy':'item';
  resolveEvent(state,p,{type:'event',key:offer.key,playerId:p.id,requestId:'system-default',encounter:state.encounter,choice,...(choice==='item'?{itemId:p.inventory[0]!}:{})});
}

/** Core v0.6: an overvalued appraisal the merchant refused draws one of three courts, harsher the later it happens. */
export function drawBacklashEvent(state:AppraisalState,p:Appraiser):boolean {
  if(!state.config.core2 || !p.inflated || p.eventOffer || p.paused || p.done || p.consequenceSlots>=1)return false;
  offerEvent(state,p,pickBacklash(state,p));return true;
}
/** Core v0.6: a failed theft offers its penalty at once. */
export function drawTheftEvent(state:AppraisalState,p:Appraiser):boolean {
  if(!state.config.core2 || !p.theft || p.eventOffer || p.paused || p.done || p.consequenceSlots>=1)return false;
  offerEvent(state,p,p.theft.kind==='shop'?'E123':'E124');return true;
}
