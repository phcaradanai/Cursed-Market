import { RARITIES } from './item-rarity.js';
import type { Rarity } from './item-rarity.js';

export interface RarityPower { version:1; valueMultiplier:number; effectMultiplier:number }
export interface RarityEconomyConfig { version:1; tiers:Record<Rarity,{value:number;effect:number}> }
export interface PoweredItem { rarityPower?:RarityPower }
/** Existing appraisal commands accept up to 1000 credits; keep catalog-scaled prices in that domain. */
export const MAX_RARITY_MULTIPLIER=8;
export function defaultRarityEconomy():RarityEconomyConfig {
  return {version:1,tiers:{common:{value:1,effect:1},uncommon:{value:2,effect:2},rare:{value:3,effect:3},epic:{value:4,effect:4},legendary:{value:6,effect:6},mythic:{value:8,effect:8}}};
}
export function validateRarityEconomy(config:RarityEconomyConfig):void {
  if(!config||config.version!==1||!config.tiers)throw Error('Invalid rarity economy version');
  let value=0,effect=0;
  for(const rarity of RARITIES){const t=config.tiers[rarity];
    if(!t||![t.value,t.effect].every(n=>Number.isSafeInteger(n)&&n>=1&&n<=MAX_RARITY_MULTIPLIER)||t.value<value||t.effect<effect)throw Error('Rarity multipliers must increase within 1–8');
    value=t.value;effect=t.effect;
  }
  if(config.tiers.common.value!==1||config.tiers.common.effect!==1)throw Error('Common is the unscaled baseline');
}
export function rarityPowerFor(rarity:Rarity,config:RarityEconomyConfig):RarityPower {
  const tier=config.tiers[rarity];return {version:1,valueMultiplier:tier.value,effectMultiplier:tier.effect};
}
export function validateRarityPower(power:RarityPower):void {
  if(!power||power.version!==1||![power.valueMultiplier,power.effectMultiplier].every(n=>Number.isSafeInteger(n)&&n>=1&&n<=MAX_RARITY_MULTIPLIER))throw Error('Invalid item rarity power');
}
/** Use only for catalog/order reference prices. item.base/ask are already scaled. */
export const rarityValue=(item:PoweredItem,reference:number)=>Math.max(0,Math.floor(reference*(item.rarityPower?.valueMultiplier??1)+1e-9));
export const rarityEffect=(item:PoweredItem)=>item.rarityPower?.effectMultiplier??1;
