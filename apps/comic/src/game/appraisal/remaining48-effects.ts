import {REMAINING48_ITEMS,REMAINING48_RULES} from './remaining48-catalog.js';
import type {Remaining48Kind,Remaining48Effect} from './remaining48-catalog.js';
import {itemEffectScale} from './copy-effects.js';
import {personalOrigin} from './personal-scoring.js';
import {unlocked} from './mechanics.js';
import {remainingScaled,remainingStrength} from './remaining48-numbers.js';
import type {AppraisalState,Appraiser,AppraisalItem} from './types.js';

export const isRemaining48Kind=(kind:string):kind is Remaining48Kind=>Object.hasOwn(REMAINING48_ITEMS,kind);
/** Registration alone never enables an effect; extend only alongside its canonical owner and tests. */
export const remainingEffectReady=(kind:Remaining48Kind,revision?:2)=>REMAINING48_ITEMS[kind].nativeEffect==='effect:E05'||revision===2&&REMAINING48_ITEMS[kind].nativeEffect==='effect:E06';

export function remainingHeld(state:AppraisalState,p:Appraiser,effect:Remaining48Effect):AppraisalItem[] {
 if(state.config.catalogVersion!==5||p.life===0||p.paused==='dead')return [];
 return p.inventory.map(id=>state.items[id]!).filter(item=>item?.owner===p.id&&isRemaining48Kind(item.kind)&&REMAINING48_ITEMS[item.kind].nativeEffect===`effect:${effect}`&&!p.npcContracts?.alien?.itemIds.includes(item.id)&&(state.config.native56Effects!==2||unlocked(p,item.id)));
}

export function remainingChallengeBps(state:AppraisalState,p:Appraiser):number {
 const rule=REMAINING48_RULES.E05;
 return remainingScaled(rule.bonusBps,remainingStrength(remainingHeld(state,p,'E05'),'E05'),rule.familyCapBps);
}

/** First real positive penalty consumes the right even if its saving rounds to zero; void0 does not. */
export function remainingChallengePenalty(state:AppraisalState,p:Appraiser,penalty:number):number {
 if(state.config.native56Effects!==2||penalty<=0)return penalty;
 const used=state.native56ChallengeUses?.encounter===state.encounter?state.native56ChallengeUses:undefined;
 if(used?.players.includes(p.id))return penalty;
 const tools=remainingHeld(state,p,'E06').filter(i=>!used?.origins.includes(personalOrigin(i))).sort((a,b)=>itemEffectScale(b)-itemEffectScale(a)||(a.id<b.id?-1:a.id>b.id?1:0)).slice(0,5);
 const rule=REMAINING48_RULES.E06,bps=remainingScaled(rule.penaltyDiscountBps,remainingStrength(tools,'E06'),rule.familyCapBps),saved=Math.floor(penalty*bps/10000);
 if(!bps)return penalty;
 state.native56ChallengeUses={encounter:state.encounter,players:[...(used?.players??[]),p.id],origins:[...new Set([...(used?.origins??[]),...tools.map(personalOrigin)])]};
 return penalty-saved;
}
