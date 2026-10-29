import { ITEM_SPECS } from './content.js';
import type { ItemKind, NpcId } from './types.js';

/** Tools that raise the odds of a curse cleansing. The hammer works while held; the whetstone is spent on the attempt. */
export const CLEANSE_TOOLS = {
  'smith-hammer':{bonus:10,consumed:false,text:'ถือไว้ โอกาสล้างคำสาปสำเร็จ +10 จุดเปอร์เซ็นต์ต่อชิ้น (ซ้อนได้)'},
  whetstone:{bonus:20,consumed:true,text:'เลือกใช้ตอนล้างคำสาป โอกาสสำเร็จ +20 จุดเปอร์เซ็นต์ ใช้แล้วหมดไป'},
} as const satisfies Partial<Record<ItemKind,{bonus:number;consumed:boolean;text:string}>>;
export type CleanseToolKind = keyof typeof CLEANSE_TOOLS;
export const isCleanseTool=(kind:ItemKind):kind is CleanseToolKind=>kind in CLEANSE_TOOLS;
/** Price multiplier range (rolled per item from the seed) and base success chance per merchant. */
export const CLEANSE_RULES:Record<NpcId,{price:[number,number];chance:number}> = {
  orc:{price:[1,1.4],chance:50},
  vampire:{price:[.9,1.5],chance:55},
  autometa:{price:[.8,1],chance:60},
  alien:{price:[.7,1.6],chance:45},
  darkone:{price:[1.2,2],chance:65},
  beast:{price:[.6,1],chance:40},
  deepsea:{price:[1.1,1.8],chance:50},
  swarm:{price:[.5,.9],chance:55},
};
export const CLEANSE_CAP=95;
export const CLEANSE_TRUST_PRICE=3;
export const CLEANSE_TRUST_CHANCE=2;
/** Half the kind's reference price is the starting point, before the merchant's roll and trust discount. */
export const cleanseBasePrice=(kind:ItemKind)=>Math.max(1,Math.floor(ITEM_SPECS[kind].anchor*.5));
export function cleansePrice(kind:ItemKind,npc:NpcId,trust:number,roll:number):number {
  const [low,high]=CLEANSE_RULES[npc].price;
  return Math.max(1,Math.round(cleanseBasePrice(kind)*(low+(high-low)*roll)*(1-CLEANSE_TRUST_PRICE*trust/100)));
}
/** `held` are the other items the seat carries; `stone` is the tool chosen for this attempt. Never 100%. */
export function cleanseChance(npc:NpcId,trust:number,held:ItemKind[],stone?:ItemKind,modifier=0):number {
  const hammers=held.filter(kind=>kind==='smith-hammer').length*CLEANSE_TOOLS['smith-hammer'].bonus;
  const stoneBonus=stone && isCleanseTool(stone) && CLEANSE_TOOLS[stone].consumed?CLEANSE_TOOLS[stone].bonus:0;
  return Math.max(5,Math.min(CLEANSE_CAP,CLEANSE_RULES[npc].chance+trust*CLEANSE_TRUST_CHANCE+hammers+stoneBonus+modifier));
}
