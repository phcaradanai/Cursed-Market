import {REMAINING48_ITEMS,REMAINING48_RULES} from './remaining48-catalog.js';
import type {Remaining48Kind,Remaining48Effect} from './remaining48-catalog.js';
import {itemEffectScale} from './copy-effects.js';
import {personalOrigin,setPersonalTrust} from './personal-scoring.js';
import {unlocked,trace,maxEnergyOf,maxLifeOf} from './mechanics.js';
import {remainingScaled,remainingStrength} from './remaining48-numbers.js';
import {TRUST_CAP} from './market-contracts.js';
import type {AppraisalState,Appraiser,AppraisalItem,NpcId} from './types.js';

export const isRemaining48Kind=(kind:string):kind is Remaining48Kind=>Object.hasOwn(REMAINING48_ITEMS,kind);
/** Registration alone never enables an effect; extend only alongside its canonical owner and tests. */
export const remainingEffectReady=(kind:Remaining48Kind,revision?:2|3)=>REMAINING48_ITEMS[kind].nativeEffect==='effect:E05'||revision!==undefined&&REMAINING48_ITEMS[kind].nativeEffect==='effect:E06'||revision===3&&['effect:E28','effect:E61','effect:E63','effect:E02','effect:E11','effect:E07'].includes(REMAINING48_ITEMS[kind].nativeEffect);

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
 return state.config.native56Effects===3?remainingScaled(amount,remainingStrength(remainingHeld(state,p,effect).filter(i=>i.id!==excludeId),effect),cap):0;
}
export function remainingMeet(state:AppraisalState,p:Appraiser,npc:NpcId):void {
 if(state.config.native56Effects!==3||p.life===0||p.paused==='dead')return;
 const meetings=(state.native56Meetings??={})[p.id]??=[];if(meetings.includes(npc))return;meetings.push(npc);
 const tools=remainingHeld(state,p,'E28').sort((a,b)=>itemEffectScale(b)-itemEffectScale(a)||(a.id<b.id?-1:1)).slice(0,5),rule=REMAINING48_RULES.E28;
 const amount=remainingScaled(rule.trust,remainingStrength(tools,'E28'),rule.familyCap);if(!amount||!p.npcTrust)return;
 const before=p.npcTrust[npc]??0;setPersonalTrust(state,p,npc,Math.min(TRUST_CAP,before+amount),tools[0]!);
 trace(state,p,'native-first-meeting',{npc,amount:p.npcTrust[npc]!-before,quoted:amount,sourceItemIds:tools.map(i=>i.id)});
}
/** Snapshot before any boundary settlement; returned loans cannot earn retroactive held energy. */
export function remainingBoundaryEnergy(state:AppraisalState,p:Appraiser,boundaryIds:readonly string[]):number {
 if(state.config.native56Effects!==3||state.encounter<=1)return 0;
 const used=state.native56EnergyUses?.encounter===state.encounter?state.native56EnergyUses:undefined;if(used?.players.includes(p.id))return 0;
 const tools=remainingHeld(state,p,'E61').filter(i=>boundaryIds.includes(i.id)&&!used?.origins.includes(personalOrigin(i))).sort((a,b)=>itemEffectScale(b)-itemEffectScale(a)||(a.id<b.id?-1:1)).slice(0,5),rule=REMAINING48_RULES.E61;
 const amount=remainingScaled(rule.energy,remainingStrength(tools,'E61'),rule.familyCap);if(!amount)return 0;
 state.native56EnergyUses={encounter:state.encounter,players:[...(used?.players??[]),p.id],origins:[...new Set([...(used?.origins??[]),...tools.map(personalOrigin)])]};return amount;
}
export function remainingRecoveryPrice(state:AppraisalState,p:Appraiser,credits:number,target:'life'|'energy'):number {
 if(state.config.native56Effects!==3||(target==='life'?p.life!>=maxLifeOf(state,p)!:p.energy>=maxEnergyOf(state,p)))return credits;
 const rule=REMAINING48_RULES.E63,discount=remainingScaled(rule.discountCredits,remainingStrength(remainingRecoveryTools(state,p),'E63'),rule.familyCap);return discount?Math.max(rule.minimumPrice,credits-discount):credits;
}
export function remainingPriceRange(state:AppraisalState,p:Appraiser,range:[number,number],truth:number):[number,number] {
 const rule=REMAINING48_RULES.E02,r=remainingHeldBonus(state,p,'E02',rule.narrowBps,rule.familyCapBps)/10000;
 if(!r)return range;
 const low=Math.min(range[0],truth),high=Math.max(range[1],truth);
 return [Math.floor(low+(truth-low)*r),Math.ceil(high-(high-truth)*r)];
}

function remainingRecoveryTools(state:AppraisalState,p:Appraiser):AppraisalItem[] {
 if(state.config.native56Effects!==3)return [];
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
