import { theftViewFor } from './theft.js';
import { sealMarketViewFor } from './seals.js';
import { loanViewFor, quoteVaultExpansion, vaultInterestOf } from './secure-storage.js';
import { integrityItemView, liquidationQuote } from './price-integrity.js';
import { merchantAbilityViews } from './merchant-abilities.js';
import { ABILITY_ITEM_TEXT, MODERN_ACTIVATIONS } from './ability-content.js';
import { cleanseOffer } from './cleanse.js';
import { PULSE_RULES, STOCK_RULES, activeNpcs, merchantWary, shardsPerSale } from './pulse.js';
import { wishBook, wishDesk, wishOffer } from './wishlist.js';
import { passiveBonuses, passivesEnabled } from './passives.js';
import { ITEM_USE_EFFECTS } from './item-effects.js';
import { dreadChance } from './core2.js';
import { core2ActionsOf } from './core2-actions.js';
import { ITEM_SPECS, NPC_SPECS, ALL_STATUS_CATALOG as STATUS_CATALOG, itemFamily, itemImage } from './content.js';
import { merchantActionFree, counterLimit, feeSurcharge, known, maxEnergyOf, maxLifeOf, npcQuote, omenNow, player, recoveryOffer, salePercent, stockBonus } from './mechanics.js';
import type { AppraisalState, AppraisalView, ItemView } from './types.js';

/** Sealed bids: a seat sees only its own bid and how many bids exist. */
function marketView(state:AppraisalState,playerId:string):AppraisalView['market'] {
  const {lots,...market}=structuredClone(state.market);
  return {...market,...(lots?{lots:lots.map(l=>({id:l.id,itemId:l.itemId,minimum:l.minimum,item:{...appraisalItemView(state,playerId,l.itemId),appraisal:null,appraisalAccepted:null},yourBid:l.bids[playerId]??null,bidCount:Object.keys(l.bids).length,...(l.winnerId!==undefined?{winnerId:l.winnerId}:{}),...(l.price!==undefined?{price:l.price}:{})}))}:{})};
}

export function appraisalItemView(state:AppraisalState,playerId:string,itemId:string):ItemView {
  const p=player(state,playerId); const item=state.items[itemId]!; const spec=ITEM_SPECS[item.kind];
  const k=state.phase==='RESULTS' && state.config.survival && state.collector?.some(row=>row.items.some(i=>i.id===itemId))?{...known(state,p,itemId),base:item.base,genuine:item.genuine,cursed:item.cursed}:known(state,p,itemId); const owner=state.players.find(s=>s.id===item.owner);
  const lock=owner?.statuses.find(s=>s.id==='D09' && s.targetItemId===itemId);
  const buff=STATUS_CATALOG.find(s=>s.id===spec.buff)!; const drawback=STATUS_CATALOG.find(s=>s.id===spec.drawback)!;
  const benefit=itemFamily(item.kind)==='orb'?`อาจฟื้นพลัง ${spec.energyRecovery??3} เมื่อเปิดใช้`:
    itemFamily(item.kind)==='key' && p.statuses.some(s=>s.id==='D07' && s.charges>0)?'อาจล้างสถานะปิดประตูที่มีอยู่ การใช้ครั้งนี้เป็นการปลดประตู':
    k.effectsKnown?buff.description:`อาจได้รับ ${buff.name}`;
  const profile=NPC_SPECS[item.npc]; const shop=state.players.find(s=>s.id===item.npcOwnerId);
  return {...(state.config.secureEconomy?{...integrityItemView(state,item),...(item.owner===playerId && (k.base!==undefined || item.priceIntegrity?.certifiedPrice!==undefined)?{liquidationPrice:liquidationQuote(state,item)}:{})}:{}),...(item.copy?{copy:{...item.copy,sourceName:ITEM_SPECS[state.items[item.copy.sourceId]!.kind].name}}:{}),...(state.config.freeMerchantAction?{freeMerchantAction:merchantActionFree(state,p,itemId)}:{}),id:item.id,kind:item.kind,npc:item.npc,name:item.copy?`สำเนา #${item.copy.number} ของ ${spec.name}`:spec.name,image:itemImage(item.kind),owner:item.owner,...(state.config.trustAbilities?{trustAbilities:true}:{}),...(state.config.itemEffects?{itemEffects:true}:{}),
    ...(k.base!==undefined?{range:[k.base,k.base] as [number,number]}:k.range?{range:k.range}:{}),ask:item.ask,appraisal:item.lastAppraisal,
    ...(item.appearance?{appearance:{...item.appearance}}:{}),...(item.rarityPower?{rarityPower:{...item.rarityPower}}:{}),
    price:shop?npcQuote(shop,item):item.ask,appraisalAccepted:item.lastAccepted,
    ...(item.appraisedBy?{appraisedBy:item.appraisedBy,commissionPaid:!!item.commissionPaid}:{}),
    ...(item.owner===playerId && p.paid?.[item.id]!==undefined?{paid:p.paid[item.id]!}:{}),...(item.bonus?{bonus:true}:{}),...(item.stolen?{stolen:true}:{}),
    lockedUntil:lock?.expires??null,knowledge:k,certificate:item.certificate,
    possibleBenefit:(ABILITY_ITEM_TEXT[item.kind as keyof typeof ABILITY_ITEM_TEXT]??(state.config.trustAbilities?MODERN_ACTIVATIONS[item.kind as keyof typeof MODERN_ACTIVATIONS]:undefined))?.th??benefit+(state.config.itemEffects && ITEM_USE_EFFECTS[item.kind]?` · ${ITEM_USE_EFFECTS[item.kind]!.text}`:'')+(state.config.survival && ['food','potion'].includes(itemFamily(item.kind))?' · ของแท้ฟื้นชีวิต 2': '')+(state.config.survival && spec.buff==='B10'?' · ขณะมีสิทธิ์เหลือ Collector เพิ่มคะแนน 20%':'') ,
    possibleDrawback:(k.effectsKnown?drawback.description:`อาจได้รับ ${drawback.name}`)+(state.config.survival?' · หากมีคำสาป เปิดใช้เสียชีวิต 1':'')+(state.config.survival && spec.drawback==='D10'?' · ขณะสถานะยังอยู่ Collector ลดคะแนน 20%':''),
    condition:{statusId:profile.condition,discount:profile.discount,available:shop?.dealMode!=='cash' && (!!state.config.survival || profile.condition!=='D04' || state.encounter<state.config.encounters),required:shop?.dealMode==='condition'}};
}
/** Construct a seat-specific allowlist. Never spread state, items, schedule or another player's knowledge. */
export function appraisalViewFor(state:AppraisalState,playerId:string):AppraisalView {
  const p=player(state,playerId);
  const {personalVault:_personalVault,knowledge:_knowledge,portals:_portals,stock:_stock,inventory:_inventory,valuations:_valuations,startWealth:_startWealth,acceptedDanger:_acceptedDanger,seenEvents:_seenEvents,resolvedEvents:_resolvedEvents,...self}=structuredClone(p);
  return {
    ...(state.config.secureEconomy?{secureEconomy:true,theft:theftViewFor(state,p),sealMarket:sealMarketViewFor(state,p),loans:loanViewFor(state,p).map(loan=>({...loan,item:appraisalItemView(state,p.id,loan.itemId)}))}:{}),
    ...(state.config.trustAbilities?{trustAbilities:true}:{}),
    ...(state.config.itemEffects?{itemEffects:true}:{}),
    ...(state.config.core2?{core2:true,...(state.config.survival?{dread:dreadChance(state.encounter,omenNow(state)?.dread??1)}:{})}:{}),...(passivesEnabled(state.config)?{passives:true}:{}),...(state.config.curseSight?{curseSight:true}:{}),...(state.config.freeBuy?{freeBuy:true}:{}),...(state.config.fakeEffect?{fakeEffect:true}:{}),...(state.config.cleanse?{cleanse:true}:{}),...(state.config.wishlist?{wishlist:true}:{}),...(state.config.wishlist && state.config.wishContract?{wishContract:true}:{}),...(state.config.challenge?{challenge:true}:{}),...(salePercent(state,p,true)!==0 || state.config.polish?{salePct:salePercent(state,p,true)}:{}),...(state.config.polish?{polish:true,...(omenNow(state)?{omen:{id:omenNow(state)!.id,name:omenNow(state)!.name,text:omenNow(state)!.text}}:{}),fee:feeSurcharge(state,p)}:{}),
    ...(state.config.eventChoiceRules?{eventChoiceRules:state.config.eventChoiceRules}:{}),
    ...(state.config.statusLinks?{statusLinks:state.config.statusLinks}:{}),
    version:state.version,phase:state.phase,encounter:state.encounter,encounterCount:state.config.survival?null:state.config.encounters,revision:state.revision,
    ...(state.config.roundRewards?{roundRewardBase:(state.encounter%2?10:15)+passiveBonuses(state,p).income}:{}),
    ...(state.config.survival?{survival:structuredClone(state.config.survival),maxEnergy:state.config.maxEnergy,...(state.config.collectorDeadline!==undefined?{collectorAt:state.config.collectorDeadline}:{})}:{}),...(state.collector?{collector:structuredClone(state.collector)}:{}),...(state.config.brokerage?{brokerage:true}:{}),
    self:{...self,...(p.personalVault?{personalVault:{items:p.personalVault.items.map(id=>appraisalItemView(state,p.id,id)),credits:p.personalVault.credits,slots:p.personalVault.slots,nextSlotPrice:quoteVaultExpansion(p.personalVault.slots),nextInterest:vaultInterestOf(p.personalVault.credits)}}:{}),...(state.config.trustAbilities?{merchantAbilities:merchantAbilityViews(state,p),...(p.abilityChoice?{abilityChoices:p.abilityChoice.itemIds.map(id=>appraisalItemView(state,p.id,id))}:{})}:{}),...(p.npcContracts?.alien?{loanItems:p.npcContracts.alien.itemIds.map(id=>appraisalItemView(state,p.id,id))}:{}),...(state.config.survival && state.phase!=='RESULTS'?{accuracyBonus:0}:{}),inventory:p.inventory.map(id=>appraisalItemView(state,p.id,id)),stock:p.stock.filter(id=>state.items[id]!.owner.startsWith('npc:')).map(id=>appraisalItemView(state,p.id,id)),portals:p.portals.map(portal=>({id:portal.id,npc:portal.npc,hint:state.items[portal.stock[0]!]!.kind,disabled:portal.disabled})),counterLimit:counterLimit(p),...(state.config.commerce?{stockBonus:{...stockBonus(state,p),need:state.config.totalTrustStock?STOCK_RULES.trustPerItem:STOCK_RULES.minTrust,npcs:activeNpcs(state.config)}}:{}),...(state.config.survival && state.config.commerce?{pulse:{shards:p.pulseShards??0,perLife:PULSE_RULES.shardsPerLife,perSale:shardsPerSale(p,state.encounter),wary:merchantWary(p,state.encounter)}}:{}),...(state.config.polish?{maxEnergy:maxEnergyOf(state,p),...(maxLifeOf(state,p)!==undefined?{maxLife:maxLifeOf(state,p)!}:{})}:{}),...(recoveryOffer(state,p)?{recoveryOffer:recoveryOffer(state,p)!}:{}),...(state.config.core2 && p.life!==0?{core2Actions:core2ActionsOf(state,p)}:{}),...(cleanseOffer(state,p)?{cleanseOffer:cleanseOffer(state,p)!}:{}),...(wishOffer(state,p)?{wishOffer:wishOffer(state,p)!}:{}),...(wishDesk(state,p)?{wishDesk:wishDesk(state,p)!}:{}),...(state.config.wishlist && p.life!==0 && Object.keys(p.wishes??{}).length?{wishBook:wishBook(state,p)}:{})},
    players:state.players.map(other=>({id:other.id,credits:other.credits,energy:other.energy,score:other.score,paused:other.paused,done:other.done,itemCount:other.inventory.length,...(other.life!==undefined?{life:other.life}:{})})),
    market:marketView(state,p.id),listings:state.listings.map(l=>({...l,item:appraisalItemView(state,p.id,l.itemId)})),
    trades:state.trades.filter(t=>t.buyerId===p.id || t.sellerId===p.id).map(t=>({...structuredClone(t),item:appraisalItemView(state,p.id,t.itemId),swapItem:t.swapItemId?appraisalItemView(state,p.id,t.swapItemId):null})),history:state.config.survival && state.phase!=='RESULTS'?[]:structuredClone(state.history),
  };
}
