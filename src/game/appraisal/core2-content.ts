import type { EventId, StatusId } from './types.js';
import type { Omen } from './omen-table.js';

/** Statuses added by the v0.6 core. Same shape as STATUS_CATALOG; consumers read ALL_STATUS_CATALOG in content.ts. */
export const CORE2_STATUS_CATALOG: ReadonlyArray<{id:StatusId;name:string;description:string;duration:string;source:string}> = [
  {id:'B21',name:'ผู้คุ้มกัน',description:'การขโมยจากคุณครั้งถัดไปล้มเหลว (ดวลเป่ายิ้งฉุบ: ตาเสมอนับเป็นของคุณ) และกันผลสะท้อนจากการประเมินราคาเกินจริงได้ 1 ครั้ง',duration:'1 ครั้ง · หมดเมื่อจบช่วงหน้า',source:'เหตุการณ์โจรกระเป๋า/ไอเทมเฝ้ายาม'},
  {id:'B22',name:'นิ้วเบา',description:'การขโมยครั้งถัดไปมีโอกาสสำเร็จเพิ่ม 25 จุดเปอร์เซ็นต์ (ดวลเป่ายิ้งฉุบ: ตาเสมอครั้งแรกนับเป็นชนะของคุณ)',duration:'1 ครั้ง · หมดเมื่อจบช่วงหน้า',source:'พ่อค้าที่ไว้ใจ/ไอเทมโจร'},
  {id:'B23',name:'ใจนิ่ง',description:'โอกาสเกิดความกดดันท้ายช่วงนี้ลดลงครึ่งหนึ่ง',duration:'ช่วงนี้เท่านั้น',source:'พิธีสงบใจ/พ่อค้าที่ไว้ใจ'},
  {id:'B24',name:'พรปลอบชีพ',description:'ท้ายช่วงนี้ฟื้นชีวิต 1 (โหมดปกติฟื้นพลัง 2)',duration:'ตอนคิดผลท้ายช่วงนี้',source:'หมอเถื่อน/พ่อค้า'},
  {id:'D21',name:'ถูกจับตา',description:'การขโมยของคุณมีโอกาสสำเร็จลดลง 15 จุดเปอร์เซ็นต์ (ดวลเป่ายิ้งฉุบ: ตาเสมอครั้งแรกนับเป็นแพ้) และพ่อค้าไม่ยอมใช้ความสามารถพิเศษให้',duration:'1 ครั้ง · หมดเมื่อจบช่วงหน้า',source:'ถูกจับตอนขโมย/ผลสะท้อนราคาพอง'},
  {id:'D22',name:'กระเป๋าฉีก',description:'ท้ายช่วงนี้เสียเครดิต 3 เท่าที่มี',duration:'ตอนคิดผลท้ายช่วงนี้',source:'โจรกระเป๋า/ผลสะท้อน'},
  {id:'D23',name:'เลือดไหลไม่หยุด',description:'ท้ายช่วงนี้เสียชีวิต 1 (โหมดปกติเสียพลัง 2)',duration:'ตอนคิดผลท้ายช่วงนี้',source:'พ่อค้าแค้น/หมอเถื่อนพลาด'},
  {id:'D24',name:'ผวาตื่นกลางคืน',description:'สิทธิ์ตรวจสินค้าของช่วงนี้ลดลง 1 ครั้ง',duration:'ช่วงนี้เท่านั้น',source:'ผลสะท้อน/ความกดดัน'},
];

/** Omens of the v0.6 core: the old seven plus eight sharper ones. Harsh ones weigh more late in a run, relief ones less. */
export const CORE2_OMENS: ReadonlyArray<Omen & {kind:'harsh'|'relief'|'plain';from?:number}> = [
  {id:'boom',kind:'plain',name:'ตลาดคึกคัก',text:'ทุกคนขายของที่ตัวเองเป็นเจ้าของได้ราคาเพิ่ม 15% ในช่วงนี้ รวม Dark Market ผู้ซื้อตามหา และผู้ซื้อพิเศษ ไม่รวมของที่ประเมินให้พ่อค้า',salePct:15},
  {id:'inflation',kind:'plain',name:'ราคาตลาดเฟ้อ',text:'ทุกคนขายของที่ตัวเองเป็นเจ้าของได้ราคาลด 20% ในช่วงนี้ รวม Dark Market ผู้ซื้อตามหา และผู้ซื้อพิเศษ ไม่รวมของที่ประเมินให้พ่อค้า',salePct:-20},
  {id:'tax',kind:'harsh',name:'ภาษีเงา',text:'ซื้อจากพ่อค้า ล้างคำสาป และดีลฟื้นต้องจ่ายเพิ่ม 1 เครดิต',fee:1},
  {id:'festival',kind:'relief',name:'เทศกาลพ่อค้า',text:'พ่อค้ายอมรับราคาต่ำและล้างคำสาปสำเร็จง่ายขึ้น 10 จุดเปอร์เซ็นต์',accept:10},
  {id:'insight',kind:'relief',name:'ฟ้าสว่างเหนือโต๊ะ',text:'การตรวจครั้งแรกของช่วงนี้ไม่เสียพลัง (ยังนับสิทธิ์ตรวจ)',firstInspectFree:true},
  {id:'plague',kind:'harsh',name:'ฝูงโรคระบาด',text:'ทุกคนที่ยังเล่นอยู่เสียพลัง 1 ตอนคิดผลท้ายช่วง',settleEnergy:1},
  {id:'generous',kind:'relief',name:'ปีแห่งการให้',text:'เครดิตหลังซื้อขายของทุกคนเพิ่ม 3',roundBonus:3},
  {id:'bloodmoon',kind:'harsh',name:'จันทร์เลือด',text:'ความกดดันท้ายช่วงเกิดบ่อยขึ้นเท่าตัว แต่ขายของที่เป็นเจ้าของได้ราคาเพิ่ม 10%',dread:2,salePct:10,from:2},
  {id:'collector-tax',kind:'harsh',name:'ภาษีนักสะสม',text:'ท้ายช่วงนี้ทุกคนเสียเครดิต 15% ของที่ถืออยู่ ปัดลง',taxPct:15,from:3},
  {id:'famine',kind:'harsh',name:'ปีข้าวยากหมากแพง',text:'ดีลฟื้นพลังและชีวิตกับพ่อค้าแพงขึ้น 3 เครดิตในช่วงนี้',healCost:3,from:2},
  {id:'thieves-night',kind:'plain',name:'คืนโจรพราย',text:'ทุกการขโมยในช่วงนี้มีโอกาสสำเร็จเพิ่ม 25 จุดเปอร์เซ็นต์ รวมการขโมยจากเพื่อน · ในห้องที่ขโมยด้วยเป่ายิ้งฉุบ ตาเสมอนับเป็นของผู้ขโมย',steal:25,from:2},
  {id:'calm',kind:'relief',name:'ตลาดสงบนิ่ง',text:'ความกดดันท้ายช่วงนี้เกิดยากลงมาก เหลือราว 30%',dread:.3,from:2},
  {id:'black-night',kind:'plain',name:'คืนตลาดมืด',text:'Dark Market เปิดแน่นอนในช่วงนี้ มีรายการรับซื้อให้ตามงบที่เหลือ',marketOpen:true,from:2},
  {id:'pilgrims',kind:'relief',name:'ขบวนผู้แสวงบุญ',text:'การขายของที่คุณประเมินครั้งแรกของแต่ละชิ้น ได้ความไว้ใจจากพ่อค้าเพิ่ม 1',trust:1,from:2},
  {id:'pestilence',kind:'harsh',name:'โรคร้ายแห่งมิติ',text:'ทุกคนที่ยังมีชีวิตเสียชีวิต 1 ตอนคิดผลท้ายช่วง (โหมดปกติเสียพลัง 2)',settleLife:1,settleEnergy:2,from:5},
];
export const CORE2_EVENT_NAMES:Partial<Record<EventId,string>>={};
