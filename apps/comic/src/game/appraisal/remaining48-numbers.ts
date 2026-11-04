import type {PoweredItem} from '../../shared/rarity-power.js';
import {itemEffectScale,integerEffect} from './copy-effects.js';
import {REMAINING48_ITEMS,REMAINING48_RULES} from './remaining48-catalog.js';
import type {Remaining48Effect,Remaining48Kind} from './remaining48-catalog.js';

/** Callers supply eligible carried instances; ownership, age and use ledgers belong to settlement owners. */
export function remainingStrength(items:ReadonlyArray<PoweredItem&{kind:string;id:string;copy?:unknown}>,effect:Remaining48Effect):number {
 const tools=items.filter(item=>Object.hasOwn(REMAINING48_ITEMS,item.kind)&&REMAINING48_ITEMS[item.kind as Remaining48Kind].nativeEffect===`effect:${effect}`);
 if(!tools.length)return 0;
 const mode=REMAINING48_ITEMS[tools[0]!.kind as Remaining48Kind].mode;
 if(mode!=='held'&&tools.length>1)throw Error('Active effects require one selected instance');
 const strengths=[...tools].sort((a,b)=>itemEffectScale(b)-itemEffectScale(a)||(a.id<b.id?-1:a.id>b.id?1:0)).slice(0,5).map(itemEffectScale);
 return 'binary' in REMAINING48_RULES[effect]?strengths[0]!:strengths.reduce((sum,value)=>sum+value,0);
}

/** Resource quantities and basis points round down before the owner computes actual payment. */
export const remainingScaled=(amount:number,strength:number,cap:number):number=>Math.max(0,Math.min(cap,integerEffect(amount*strength)));

export function remainingDiscount(base:number,amount:number,strength:number,cap:number,minimum:number):number {
 return base===0?0:Math.max(minimum,base-remainingScaled(amount,strength,cap));
}

/** freeBank must already exclude market, reward and other obligations; never mint or defer an unfunded bonus. */
export function remainingFundedBonus(quote:number,freeBank:number):number {
 if(!Number.isSafeInteger(quote)||!Number.isSafeInteger(freeBank))throw Error('Bonus credits must be safe integer amounts');
 if(quote<0)throw Error('Bonus quote must be nonnegative');
 return Math.min(quote,Math.max(0,freeBank));
}
