import {REMAINING48_ITEMS,REMAINING48_RULES} from './remaining48-catalog.js';
import type {Remaining48Kind,Remaining48Effect} from './remaining48-catalog.js';
import {itemEffectScale} from './copy-effects.js';
import {personalOrigin,setPersonalTrust} from './personal-scoring.js';
import {unlocked,trace,maxEnergyOf,maxLifeOf,reward,recover} from './mechanics.js';
import {remainingScaled,remainingStrength,remainingFundedBonus} from './remaining48-numbers.js';
import {TRUST_CAP} from './market-contracts.js';
import type {AppraisalState,Appraiser,AppraisalItem,NpcId,TradeOffer,AuctionLot} from './types.js';

export const isRemaining48Kind=(kind:string):kind is Remaining48Kind=>Object.hasOwn(REMAINING48_ITEMS,kind);
/** Registration alone never enables an effect; extend only alongside its canonical owner and tests. */
export const remainingEffectReady=(kind:Remaining48Kind,revision?:2|3|4|5|6)=>REMAINING48_ITEMS[kind].nativeEffect==='effect:E05'||revision!==undefined&&REMAINING48_ITEMS[kind].nativeEffect==='effect:E06'||revision!==undefined&&revision>=3&&['effect:E28','effect:E61','effect:E63','effect:E02','effect:E11','effect:E07'].includes(REMAINING48_ITEMS[kind].nativeEffect)||revision!==undefined&&revision>=4&&['effect:E13','effect:E16'].includes(REMAINING48_ITEMS[kind].nativeEffect)||revision!==undefined&&revision>=5&&REMAINING48_ITEMS[kind].nativeEffect==='effect:E22'||revision!==undefined&&revision>=6&&REMAINING48_ITEMS[kind].nativeEffect==='effect:E38';

export function remainingHeld(state:AppraisalState,p:Appraiser,effect:Remaining48Effect):AppraisalItem[] {
 if(state.config.catalogVersion!==5||p.life===0||p.paused==='dead')return [];
 return p.inventory.map(id=>state.items[id]!).filter(item=>item?.owner===p.id&&isRemaining48Kind(item.kind)&&REMAINING48_ITEMS[item.kind].nativeEffect===`effect:${effect}`&&!p.npcContracts?.alien?.itemIds.includes(item.id)&&(state.config.native56Effects===undefined||unlocked(p,item.id)));
}

export function remainingChallengeBps(state:AppraisalState,p:Appraiser):number {
 const rule=REMAINING48_RULES.E05;
 return remainingScaled(rule.bonusBps,remainingStrength(remainingHeld(state,p,'E05'),'E05'),rule.familyCapBps);
}

/** First real positive penalty consumes the right even if its saving rounds to zero; void0 does not. */
export function remainingChallengePenalty(state:AppraisalState,p:Appraiser,penalty:number):number {
 if(state.config.native56Effects===undefined||penalty<=0)return penalty;
 const used=state.native56ChallengeUses?.encounter===state.encounter?state.native56ChallengeUses:undefined;
 if(used?.players.includes(p.id))return penalty;
 const tools=remainingHeld(state,p,'E06').filter(i=>!used?.origins.includes(personalOrigin(i))).sort((a,b)=>itemEffectScale(b)-itemEffectScale(a)||(a.id<b.id?-1:a.id>b.id?1:0)).slice(0,5);
 const rule=REMAINING48_RULES.E06,bps=remainingScaled(rule.penaltyDiscountBps,remainingStrength(tools,'E06'),rule.familyCapBps),saved=Math.floor(penalty*bps/10000);
 if(!bps)return penalty;
 state.native56ChallengeUses={encounter:state.encounter,players:[...(used?.players??[]),p.id],origins:[...new Set([...(used?.origins??[]),...tools.map(personalOrigin)])]};
 return penalty-saved;
}

/** New automatic families are gated separately from archived stage1/effects2. */
export function remainingHeldBonus(state:AppraisalState,p:Appraiser,effect:Remaining48Effect,amount:number,cap:number,excludeId?:string):number {
 return (state.config.native56Effects??0)>=3?remainingScaled(amount,remainingStrength(remainingHeld(state,p,effect).filter(i=>i.id!==excludeId),effect),cap):0;
}
export function remainingMeet(state:AppraisalState,p:Appraiser,npc:NpcId):void {
 if((state.config.native56Effects??0)<3||p.life===0||p.paused==='dead')return;
 const meetings=(state.native56Meetings??={})[p.id]??=[];if(meetings.includes(npc))return;meetings.push(npc);
 const tools=remainingHeld(state,p,'E28').sort((a,b)=>itemEffectScale(b)-itemEffectScale(a)||(a.id<b.id?-1:1)).slice(0,5),rule=REMAINING48_RULES.E28;
 const amount=remainingScaled(rule.trust,remainingStrength(tools,'E28'),rule.familyCap);if(!amount||!p.npcTrust)return;
 const before=p.npcTrust[npc]??0;setPersonalTrust(state,p,npc,Math.min(TRUST_CAP,before+amount),tools[0]!);
 trace(state,p,'native-first-meeting',{npc,amount:p.npcTrust[npc]!-before,quoted:amount,sourceItemIds:tools.map(i=>i.id)});
}
/** Snapshot before any boundary settlement; returned loans cannot earn retroactive held energy. */
export function remainingBoundaryEnergy(state:AppraisalState,p:Appraiser,boundaryIds:readonly string[]):number {
 if((state.config.native56Effects??0)<3||state.encounter<=1)return 0;
 const used=state.native56EnergyUses?.encounter===state.encounter?state.native56EnergyUses:undefined;if(used?.players.includes(p.id))return 0;
 const tools=remainingHeld(state,p,'E61').filter(i=>boundaryIds.includes(i.id)&&!used?.origins.includes(personalOrigin(i))).sort((a,b)=>itemEffectScale(b)-itemEffectScale(a)||(a.id<b.id?-1:1)).slice(0,5),rule=REMAINING48_RULES.E61;
 const amount=remainingScaled(rule.energy,remainingStrength(tools,'E61'),rule.familyCap);if(!amount)return 0;
 state.native56EnergyUses={encounter:state.encounter,players:[...(used?.players??[]),p.id],origins:[...new Set([...(used?.origins??[]),...tools.map(personalOrigin)])]};return amount;
}
export function remainingRecoveryPrice(state:AppraisalState,p:Appraiser,credits:number,target:'life'|'energy'):number {
 if((state.config.native56Effects??0)<3||(target==='life'?p.life!>=maxLifeOf(state,p)!:p.energy>=maxEnergyOf(state,p)))return credits;
 const rule=REMAINING48_RULES.E63,discount=remainingScaled(rule.discountCredits,remainingStrength(remainingRecoveryTools(state,p),'E63'),rule.familyCap);return discount?Math.max(rule.minimumPrice,credits-discount):credits;
}
export function remainingPriceRange(state:AppraisalState,p:Appraiser,range:[number,number],truth:number):[number,number] {
 const rule=REMAINING48_RULES.E02,r=remainingHeldBonus(state,p,'E02',rule.narrowBps,rule.familyCapBps)/10000;
 if(!r)return range;
 const low=Math.min(range[0],truth),high=Math.max(range[1],truth);
 return [Math.floor(low+(truth-low)*r),Math.ceil(high-(high-truth)*r)];
}

function remainingRecoveryTools(state:AppraisalState,p:Appraiser):AppraisalItem[] {
 if((state.config.native56Effects??0)<3)return [];
 const used=state.native56RecoveryUses?.encounter===state.encounter?state.native56RecoveryUses:undefined;if(used?.players.includes(p.id))return [];
 return remainingHeld(state,p,'E63').filter(i=>!used?.origins.includes(personalOrigin(i))).sort((a,b)=>itemEffectScale(b)-itemEffectScale(a)||(a.id<b.id?-1:1)).slice(0,5);
}
/** Record only after a paid, valid recovery; quote reads must never reserve the shared origin. */
export function remainingUseRecovery(state:AppraisalState,p:Appraiser,amount:number,target:'life'|'energy'):void {
 if(amount<=0)return;const tools=remainingRecoveryTools(state,p);if(!tools.length)return;
 const used=state.native56RecoveryUses?.encounter===state.encounter?state.native56RecoveryUses:undefined;
 state.native56RecoveryUses={encounter:state.encounter,players:[...(used?.players??[]),p.id],origins:[...new Set([...(used?.origins??[]),...tools.map(personalOrigin)])]};
 trace(state,p,'native-recovery-discount',{amount,target,sourceItemIds:tools.map(i=>i.id)});
}

/** Bonus money is funded once from the free bank, never counted as another sale/commission. */
export function remainingCommissionBonus(state:AppraisalState,p:Appraiser,item:AppraisalItem,buyer:Appraiser|undefined,commission:number):void {
 if((state.config.native56Effects??0)<4||!buyer||buyer.id===p.id||item.copy||commission<=0)return;
 const rule=REMAINING48_RULES.E13,tools=remainingHeld(state,p,'E13'),bps=remainingScaled(rule.bonusBps,remainingStrength(tools,'E13'),2000);
 const key=JSON.stringify([personalOrigin(item),p.id,buyer.id]),ledger=state.native56Commission;if(ledger?.keys.includes(key))return;
 const paid=ledger?.paid[p.id]??0,quote=Math.min(rule.perSettlementCap,Math.max(0,rule.perRunCap-paid),Math.floor(commission*bps/10000));
 const amount=remainingFundedBonus(quote,state.bank-state.market.budget-state.reservedRewards);if(!amount)return;
 reward(state,p,amount,'native-commission-bonus');p.notes.push(`ลูกปัดนับชัย: โบนัสค่านายหน้า +${amount} เครดิต (รวม ${paid+amount}/${rule.perRunCap})`);p.notes=p.notes.slice(-30);state.native56Commission={paid:{...ledger?.paid,[p.id]:paid+amount},keys:[...ledger?.keys??[],key]};
 trace(state,p,'native-commission-bonus',{itemId:item.id,buyerId:buyer.id,commission,quoted:quote,amount,runPaid:paid+amount});
}
/** First paid original-good trade with each unordered pair; before-offer tools must still be carried. */
export function remainingSaleEnergy(state:AppraisalState,seller:Appraiser,buyer:Appraiser,offer:TradeOffer,paid:number):void {
 const item=state.items[offer.itemId]!;
 if((state.config.native56Effects??0)<4||offer.source!=='inventory'||offer.swapItemId||paid<1||item.copy||seller.id===buyer.id)return;
 const ledger=state.native56SaleEnergy,pair=JSON.stringify([seller.id,buyer.id].sort());if(ledger?.pairs.includes(pair))return;
 const current=state.native56SaleEnergy={pairs:[...ledger?.pairs??[],pair],origins:[...ledger?.origins??[]],uses:ledger?.uses.encounter===state.encounter?ledger.uses:{encounter:state.encounter,players:[],origins:[]}};
 const origin=personalOrigin(item);if(current.origins.includes(origin))return;
 let attempted=false;
 for(const p of [seller,buyer]){
  if(current.uses.players.includes(p.id))continue;
  const tools=remainingHeld(state,p,'E16').filter(i=>offer.nativeEnergyTools?.[p.id]?.includes(i.id)&&!current.uses.origins.includes(personalOrigin(i))).sort((a,b)=>itemEffectScale(b)-itemEffectScale(a)||(a.id<b.id?-1:1)).slice(0,5),rule=REMAINING48_RULES.E16;
  const amount=remainingScaled(rule.energy,remainingStrength(tools,'E16'),rule.familyCap),before=p.energy;if(!amount||before>=maxEnergyOf(state,p))continue;
  attempted=true;current.uses.players.push(p.id);current.uses.origins.push(...tools.map(personalOrigin));
  recover(state,p,amount,'native-sale-energy');const actual=p.energy-before;
  p.notes.push(`${REMAINING48_ITEMS[tools[0]!.kind as Remaining48Kind].name}: ซื้อขายกับคู่ใหม่ ฟื้นพลัง +${actual}`);p.notes=p.notes.slice(-30);
  trace(state,p,'native-sale-energy',{offerId:offer.id,itemId:item.id,paid,amount:actual,quoted:amount,sourceItemIds:tools.map(i=>i.id)});
 }
 if(attempted)current.origins.push(origin);
}

/** Withdrawal never erases the first bid's physical-custody evidence, including an empty start. */
export function remainingAuctionStart(state:AppraisalState,p:Appraiser,lot:AuctionLot):void {
 if((state.config.native56Effects??0)<5)return;
 const starts=lot.nativeInvitations??={};if(Object.hasOwn(starts,p.id))return;
 starts[p.id]=remainingHeld(state,p,'E22').map(i=>i.id);
}
/** Prune after every committed custody change and again before auction settlement. */
export function reconcileRemainingAuctionCustody(state:AppraisalState):void {
 if((state.config.native56Effects??0)<5)return;
 for(const lot of state.market.lots??[])for(const [id,items]of Object.entries(lot.nativeInvitations??{})){
  const p=state.players.find(p=>p.id===id);
  lot.nativeInvitations![id]=items.filter(itemId=>p&&p.life!==0&&p.paused!=='dead'&&p.inventory.includes(itemId)&&state.items[itemId]?.owner===p.id&&!p.npcContracts?.alien?.itemIds.includes(itemId));
 }
}
export function remainingAuctionRebate(state:AppraisalState,p:Appraiser,lot:AuctionLot,item:AppraisalItem,paid:number):void {
 if((state.config.native56Effects??0)<5||paid<=0||item.copy||!item.nativeAuctionSellerId||item.nativeAuctionSellerId===p.id)return;
 const ledger=state.native56Auction,origin=personalOrigin(item);if(ledger?.origins.includes(origin)||ledger?.lots.includes(lot.id))return;
 const tools=remainingHeld(state,p,'E22').filter(i=>lot.nativeInvitations?.[p.id]?.includes(i.id)),strength=remainingStrength(tools,'E22');if(!strength)return;
 const rule=REMAINING48_RULES.E22,bps=remainingScaled(rule.rebateBps,strength,1000),runPaid=ledger?.paid[p.id]??0;
 const quote=Math.min(rule.perWinCap,Math.floor(paid*bps/10000),Math.max(0,rule.perRunCap-runPaid)),amount=remainingFundedBonus(quote,state.bank-state.market.budget-state.reservedRewards);
 state.native56Auction={paid:{...ledger?.paid,[p.id]:runPaid+amount},origins:[...ledger?.origins??[],origin],lots:[...ledger?.lots??[],lot.id]};
 if(amount)reward(state,p,amount,'native-auction-rebate');
 p.notes.push(`บัตรเชิญเที่ยงคืน: คืนเครดิตประมูล +${amount} (รวม ${runPaid+amount}/${rule.perRunCap})`);p.notes=p.notes.slice(-30);
 trace(state,p,'native-auction-rebate',{lotId:lot.id,itemId:item.id,paid,quoted:quote,amount});
}
