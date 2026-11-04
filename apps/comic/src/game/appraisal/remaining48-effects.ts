import {REMAINING48_ITEMS,REMAINING48_RULES} from './remaining48-catalog.js';
import type {Remaining48Kind,Remaining48Effect} from './remaining48-catalog.js';
import {remainingScaled,remainingStrength} from './remaining48-numbers.js';
import type {AppraisalState,Appraiser,AppraisalItem} from './types.js';

export const isRemaining48Kind=(kind:string):kind is Remaining48Kind=>Object.hasOwn(REMAINING48_ITEMS,kind);
/** Registration alone never enables an effect; extend only alongside its canonical owner and tests. */
export const remainingEffectReady=(kind:Remaining48Kind)=>REMAINING48_ITEMS[kind].nativeEffect==='effect:E05';

export function remainingHeld(state:AppraisalState,p:Appraiser,effect:Remaining48Effect):AppraisalItem[] {
 if(state.config.catalogVersion!==5||p.life===0||p.paused==='dead')return [];
 return p.inventory.map(id=>state.items[id]!).filter(item=>item?.owner===p.id&&isRemaining48Kind(item.kind)&&REMAINING48_ITEMS[item.kind].nativeEffect===`effect:${effect}`&&!p.npcContracts?.alien?.itemIds.includes(item.id));
}

export function remainingChallengeBps(state:AppraisalState,p:Appraiser):number {
 const rule=REMAINING48_RULES.E05;
 return remainingScaled(rule.bonusBps,remainingStrength(remainingHeld(state,p,'E05'),'E05'),rule.familyCapBps);
}
