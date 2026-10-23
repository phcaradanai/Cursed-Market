import type { Appraiser, StatusId } from './types.js';
import { rarityEffect } from '../../shared/rarity-power.js';
import type { PoweredItem } from '../../shared/rarity-power.js';
export const itemEffectScale=(item:PoweredItem & {copy?:unknown})=>rarityEffect(item)*(item.copy?.4:1);
/** Rarity improves bonuses; existing costs/curse penalties retain their copy-scaled strength. */
export const itemDrawbackScale=(item:{copy?:unknown})=>item.copy?.4:1;
export const statusMagnitude=(p:Pick<Appraiser,'statuses'>,id:StatusId,amount:number):number=>{
  const found=p.statuses.find(s=>s.id===id&&s.charges>0);return found?amount*(found.power??1):0;
};
/** Credits, resources and action quotas stay integers; percentages retain their exact reduced strength. */
export const integerEffect=(amount:number)=>Math.floor(amount+1e-9);
/** NPC sale quotes follow the copy's trust-scaled value; negotiated player prices remain explicit. */
export const copySaleQuote=(item:{copy?:{valuePercent:number}},price:number)=>Math.floor(price*(item.copy?item.copy.valuePercent/100:1));
