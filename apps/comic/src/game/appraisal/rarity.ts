import { rollAppearance } from '../../shared/item-rarity.js';
import { randomAt } from '../random.js';
import { rarityPowerFor, rarityValue } from '../../shared/rarity-power.js';
import { anchorOf } from './core2.js';
import { priceRange } from './content.js';
import type { AppraisalConfig } from './types.js';
import type { AppraisalItem, AppraisalState } from './types.js';

/** Roll once on authoritative creation/reveal. Never expose the run seed. */
export function ensureItemAppearance(state:AppraisalState,item:AppraisalItem):void {
  if(state.config.rarity && !item.appearance){
    const seed=Math.floor(randomAt(state.seed,`${item.id}:appearance:v1`)*0x100000000);
    item.appearance=rollAppearance(seed,state.config.rarity);
  }
  if(state.config.rarityEconomy && item.appearance && !item.rarityPower){
    item.rarityPower=rarityPowerFor(item.appearance.rarity,state.config.rarityEconomy);
    item.base=rarityValue(item,item.base);item.ask=rarityValue(item,item.ask);item.reservation=rarityValue(item,item.reservation);
  }
}
/** Inspection clues must contain scaled truths, including capped replacement items/copies. */
export function itemPriceRange(config:AppraisalConfig,item:AppraisalItem):[number,number] {
  const range=priceRange(item.kind,anchorOf(config,item.kind));
  if(!item.rarityPower)return range;
  const factor=(item.rarityPower?.valueMultiplier??1)*(item.copy?item.copy.valuePercent/100:1);
  return [Math.min(Math.floor(range[0]*factor),item.base),Math.max(Math.ceil(range[1]*factor),item.base)];
}
