import { ITEM_SPECS } from './content.js';
import type { ItemKind, NpcId } from './types.js';

/** A merchant that announces a wish pays well above the market quote for exactly that kind. */
export const WISH_PREMIUM=1.8;
/** Share of meetings where an eligible merchant announces what it wants. */
export const WISH_PROBABILITY=.6;
/** Asking more than the offer lowers the odds that the merchant agrees. */
export const WISH_MARKUPS=[0,10,20,30,40] as const;
export const WISH_BASE_CHANCE=85;
export const WISH_MARKUP_PENALTY=1.5;
export const WISH_TRUST_BONUS=3;
export const WISH_STATUS_STEP=4;
export const WISH_CAP=95;
export const WISH_FLOOR=5;
export const wishPrice=(kind:ItemKind)=>Math.ceil(ITEM_SPECS[kind].anchor*WISH_PREMIUM);
export const wishAsk=(price:number,markup:number)=>Math.floor(price*(100+markup)/100);
/** Every buff the seat carries helps the pitch, every debuff hurts it. Never certain, never hopeless. */
export function wishChance(markup:number,trust:number,buffs:number,debuffs:number,bonus=0):number {
  const raw=WISH_BASE_CHANCE-markup*WISH_MARKUP_PENALTY+trust*WISH_TRUST_BONUS+(buffs-debuffs)*WISH_STATUS_STEP+bonus;
  return Math.max(WISH_FLOOR,Math.min(WISH_CAP,Math.round(raw)));
}
export type { NpcId };
