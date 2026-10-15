import { randomAt } from '../random.js';
import type { AppraisalConfig } from './types.js';

/** A seeded omen colours every encounter of a run, so no two runs weigh the same choices. Applies to every seat alike. */
export type OmenId='boom'|'inflation'|'tax'|'festival'|'insight'|'plague'|'generous';
export interface Omen {
  id:OmenId; name:string; text:string;
  /** Percentage points added to every sale of an item the seat owns. */
  salePct?:number;
  /** Extra credits on every NPC purchase, cleansing and recovery deal. */
  fee?:number;
  /** Percentage points added to NPC acceptance and to curse cleansing. */
  accept?:number;
  /** The first inspection of the encounter costs no energy. */
  firstInspectFree?:boolean;
  /** Energy every living seat loses at settlement. */
  settleEnergy?:number;
  /** Credits added to the post-trade round reward. */
  roundBonus?:number;
}
export const OMENS:ReadonlyArray<Omen>=[
  {id:'boom',name:'ตลาดคึกคัก',text:'ทุกคนขายของที่ตัวเองเป็นเจ้าของได้ราคาเพิ่ม 15% ในช่วงนี้ รวม Dark Market ผู้ซื้อตามหา และผู้ซื้อพิเศษ ไม่รวมของที่ประเมินให้พ่อค้า',salePct:15},
  {id:'inflation',name:'ราคาตลาดเฟ้อ',text:'ทุกคนขายของที่ตัวเองเป็นเจ้าของได้ราคาลด 20% ในช่วงนี้ รวม Dark Market ผู้ซื้อตามหา และผู้ซื้อพิเศษ ไม่รวมของที่ประเมินให้พ่อค้า',salePct:-20},
  {id:'tax',name:'ภาษีเงา',text:'ซื้อจากพ่อค้า ล้างคำสาป และดีลฟื้นต้องจ่ายเพิ่ม 1 เครดิต',fee:1},
  {id:'festival',name:'เทศกาลพ่อค้า',text:'พ่อค้ายอมรับราคาต่ำและล้างคำสาปสำเร็จง่ายขึ้น 10 จุดเปอร์เซ็นต์',accept:10},
  {id:'insight',name:'ฟ้าสว่างเหนือโต๊ะ',text:'การตรวจครั้งแรกของช่วงนี้ไม่เสียพลัง (ยังนับสิทธิ์ตรวจ)',firstInspectFree:true},
  {id:'plague',name:'ฝูงโรคระบาด',text:'ทุกคนที่ยังเล่นอยู่เสียพลัง 1 ตอนคิดผลท้ายช่วง',settleEnergy:1},
  {id:'generous',name:'ปีแห่งการให้',text:'เครดิตหลังซื้อขายของทุกคนเพิ่ม 3',roundBonus:3},
];
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
