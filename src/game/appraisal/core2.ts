import { ITEM_SPECS, itemFamily } from './content.js';
import type { AppraisalConfig, ItemKind, StatusId } from './types.js';

/**
 * Core v0.6. Everything here applies only when `config.core2` is set; runs saved without it replay exactly as before.
 * Numbers are experimental: they were chosen with the balance harness (src/simulation/balance.ts) and are not human-validated.
 * See docs/plan/Core_v0.6_Rules.md.
 */
export const core2On=(config:Pick<AppraisalConfig,'core2'>)=>!!config.core2;

export const CORE2={
  /** Survival: the encounter after which the Collector arrives whoever is still alive. */
  collectorEncounter:15,
  /** Survival decay: 1 life per encounter, plus 1 more for every `decayEvery` encounters past the first, up to `decayCap`. */
  decayEvery:7,decayCap:3,
  /** Chance per living seat per encounter of a dread affliction at settlement: base + step per encounter, capped. */
  dread:{base:.08,step:.03,cap:.6},
  /** An appraisal at or above this multiple of the merchant's asking price may draw a backlash (and is then refused). */
  overvalue:{ratio:2,base:.5,step:.25,cap:.95},
  /** Buying this many goods other seats appraised refunds energy, at most `cap` times per encounter. */
  scrap:{need:2,energy:3,cap:2},
  /** Consigning an unsold appraisal pays this share of its real value (fake and cursed goods are worth less), minus a flat fee. */
  consign:{percent:80,fee:3,cleanBelow:.3,debuffBelow:.7,extraFee:4},
  /** Restoratives (food and potions) heal life in survival, so they cost what the life is worth. */
  restorativePremium:7,
  /** Credits added to a recovery deal for every `step` encounters past the first. */
  recoveryStep:4,
  /** Rerolling a merchant door costs `energy` for the first reroll of an encounter and `step` more for every reroll after it. */
  reroll:{energy:2,step:1},
  /** Theft and barter. */
  steal:{energy:1,base:.5,perTrust:.03,friend:-.15},
  barter:{energy:1,detect:.35},
  /** Merchant skills unlock at this trust and are stronger from `strong`. */
  skill:{trust:3,strong:6},
} as const;

/** Energy the next door reroll costs after `done` rerolls this encounter. */
export const rerollCost=(done:number)=>CORE2.reroll.energy+CORE2.reroll.step*done;

const WEAK_BUFFS:readonly StatusId[]=['B01','B03','B05'];
const STRONG_BUFFS:readonly StatusId[]=['B06','B07','B08','B19'];
/** Reference price of a kind. Plain `anchor` for saved runs; restoratives cost their healing, weak buffs cost less, strong ones more. */
export function anchorOf(config:Pick<AppraisalConfig,'core2'|'survival'>,kind:ItemKind):number {
  const spec=ITEM_SPECS[kind];
  if(!config.core2)return spec.anchor;
  const tier=WEAK_BUFFS.includes(spec.buff)?.85:STRONG_BUFFS.includes(spec.buff)?1.15:1;
  const healing=!!config.survival && ['food','potion'].includes(itemFamily(kind))?CORE2.restorativePremium:0;
  return Math.max(4,Math.round(spec.anchor*tier)+healing);
}

/** Life lost to dimensional decay at the end of an encounter. */
export const decayFor=(encounter:number)=>Math.min(CORE2.decayCap,1+Math.floor((encounter-1)/CORE2.decayEvery));
export const dreadChance=(encounter:number,modifier=1)=>Math.min(CORE2.dread.cap,Math.max(0,(CORE2.dread.base+CORE2.dread.step*(encounter-1))*modifier));
/** Chance an appraisal of `value` against the public asking price draws a backlash; 0 below the threshold. */
export function overvalueChance(value:number,ask:number):number {
  if(ask<=0 || value<ask*CORE2.overvalue.ratio)return 0;
  const {base,step,cap}=CORE2.overvalue;return Math.min(cap,base+step*(value/ask-CORE2.overvalue.ratio));
}
/** What consigning an unsold appraisal pays: a share of the real value after fake and cursed discounts. */
export const consignPayout=(base:number,genuine:boolean,cursed:boolean)=>Math.max(0,Math.floor(base*CORE2.consign.percent*(genuine?100:25)*(cursed?75:100)/100/10000)-CORE2.consign.fee);
export type Dread='storm'|'tax'|'rot'|'wound'|'fatigue';
/** The dread table: later encounters lean on the harsher results. */
export function dreadKinds(encounter:number,survival:boolean,hasItems:boolean):Dread[] {
  const pool:Dread[]=['tax','fatigue','tax',survival?'storm':'fatigue','wound'];
  if(hasItems && encounter>=3)pool.push('rot');
  if(survival && encounter>=5)pool.push('storm','storm');
  return pool;
}
export const dreadTax=(encounter:number)=>2+Math.floor(encounter/2);
/** Life deals by trust (capped at 3) once the v0.6 core is on: dearer and no longer guaranteed to heal much. */
const LIFE_DEALS2=[undefined,{credits:3,min:0,max:1},{credits:4,min:1,max:2},{credits:6,min:1,max:3}] as const;
export const lifeDealTerms2=(trust:number)=>LIFE_DEALS2[Math.max(0,Math.min(3,trust))];
export const ENERGY_DEAL_CREDITS2=3;
/** Recovery deals cost more the deeper the run goes. */
export const recoverySurcharge=(encounter:number)=>Math.floor((encounter-1)/CORE2.recoveryStep);
