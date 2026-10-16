/** One formula for what an item is worth to the score: fake keeps 25%, a curse keeps 75% of what is left, a seal from another appraiser adds 15%; floored per item. */
export function itemScoreValue(base:number,genuine:boolean,cursed:boolean,certified=false):number {
  return Math.floor(base*(genuine?100:25)*(cursed?75:100)*(certified?100+PROVENANCE_PERCENT:100)/1000000);
}
/** Goods another seat appraised carry that seat's seal: the Collector pays this much more for each. */
export const PROVENANCE_PERCENT=15;
/** Final Collector total: credits plus items, then one percentage modifier, floored once. */
export function collectorTotal(credits:number,itemValue:number,modifierPercent:number):number {
  return Math.floor((credits+itemValue)*(100+modifierPercent)/100);
}
/** Chance a fake (but not worthless) item still produces its good effect when opened; genuine items always do. */
export const FAKE_EFFECT_CHANCE=.4;
