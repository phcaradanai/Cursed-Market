import { randomAt } from '../random.js';
import type { AppraisalConfig } from './types.js';
export { OMENS } from './omen-table.js';
export type { Omen, OmenId } from './omen-table.js';
import { OMENS, type Omen } from './omen-table.js';

const pick=(seed:string,encounter:number)=>Math.floor(randomAt(seed,`${encounter}:omen`)*OMENS.length);
/** The omen of an encounter, never the same as the one before it. Absent in runs without polish rules. */
export function omenOf(config:Pick<AppraisalConfig,'polish'>,seed:string,encounter:number):Omen|undefined {
  if(!config.polish) return undefined;
  let index=pick(seed,1);
  for(let e=2;e<=encounter;e++) {
    const next=pick(seed,e);
    index=next===index?(index+1+Math.floor(randomAt(seed,`${e}:omen:shift`)*(OMENS.length-1)))%OMENS.length:next;
  }
  return OMENS[index];
}
