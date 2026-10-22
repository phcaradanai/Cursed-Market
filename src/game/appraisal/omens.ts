import { randomAt } from '../random.js';
import type { AppraisalConfig } from './types.js';
export { OMENS } from './omen-table.js';
export type { Omen, OmenId } from './omen-table.js';
import { OMENS, type Omen } from './omen-table.js';
import { CORE2_OMENS } from './core2-content.js';

const pick=(seed:string,encounter:number)=>Math.floor(randomAt(seed,`${encounter}:omen`)*OMENS.length);
/** The omen of an encounter, never the same as the one before it. Absent in runs without polish rules. */
export function omenOf(config:Pick<AppraisalConfig,'polish'|'core2'>,seed:string,encounter:number):Omen|undefined {
  if(!config.polish) return undefined;
  if(config.core2) return core2Omen(seed,encounter);
  let index=pick(seed,1);
  for(let e=2;e<=encounter;e++) {
    const next=pick(seed,e);
    index=next===index?(index+1+Math.floor(randomAt(seed,`${e}:omen:shift`)*(OMENS.length-1)))%OMENS.length:next;
  }
  return OMENS[index];
}

/**
 * The v0.6 route: every encounter draws one of fifteen omens by weight. Harsh ones grow likelier as the run deepens, relief ones rarer,
 * and an omen never repeats back to back, so no two seeds walk the same road.
 */
const core2Weight=(omen:typeof CORE2_OMENS[number],encounter:number)=>{
  if((omen.from??1)>encounter) return 0;
  return omen.kind==='harsh'?1+(encounter-1)*.25:omen.kind==='relief'?Math.max(.35,1-(encounter-1)*.08):1;
};
function core2Omen(seed:string,encounter:number):Omen {
  let previous=-1,chosen=0;
  for(let e=1;e<=encounter;e++) {
    const weights=CORE2_OMENS.map((omen,index)=>index===previous?0:core2Weight(omen,e));
    let roll=randomAt(seed,`${e}:omen2`)*weights.reduce((a,b)=>a+b,0);
    chosen=weights.findIndex(weight=>(roll-=weight)<0);
    if(chosen<0) chosen=weights.findLastIndex(weight=>weight>0);
    previous=chosen;
  }
  return CORE2_OMENS[chosen]!;
}
