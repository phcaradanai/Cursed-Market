import type { ItemSpec } from './content.js';
import type { EventId, StatusId } from './types.js';

export const ABILITY_ITEMS = {
  'chrono-gear':{name:'เฟืองย้อนเวลา',family:'key',anchor:22,buff:'B25',drawback:'D25',consumable:true},
  'burden-hourglass':{name:'นาฬิกาทรายถ่ายภาระ',family:'orb',anchor:24,buff:'B25',drawback:'D14',consumable:false},
  'shifting-compass':{name:'เข็มทิศแปรผัน',family:'scanner',anchor:20,buff:'B26',drawback:'D02',consumable:true},
} satisfies Record<string,ItemSpec>;
export const ABILITY_ITEM_TEXT = {
  'chrono-gear':{th:'ลดเวลารอที่เหลือของสกิลที่เลือก 1 รอบ ใช้แล้วหมด ชนิดนี้ใช้ได้ครั้งเดียวต่อช่วง',en:'Remove 1 remaining cooldown encounter from a chosen ability. Consumed; this kind works once per encounter.'},
  'burden-hourglass':{th:'ย้ายเวลารอ 1 รอบจากสกิลที่เลือก ไปเพิ่มให้อีกสกิลที่ยังรออยู่ ใช้ครั้งเดียวต่อช่วง',en:'Transfer 1 remaining cooldown encounter from one cooling ability to another. Once per encounter.'},
  'shifting-compass':{th:'การเปลี่ยนสินค้าของสัตว์นำทางครั้งถัดไปมีตัวเลือกเพิ่ม 1 ชิ้น ไม่เกิน 5 ใช้แล้วหมด',en:'Your next Beast stock replacement offers one additional choice, up to five. Consumed.'},
} as const;
export const ABILITY_STATUS_CATALOG:ReadonlyArray<{id:StatusId;name:string;description:string;duration:string;source:string}>=[
  {id:'B25',name:'จังหวะเร่งเวลา',description:'สกิลพ่อค้าครั้งถัดไปมี cooldown สั้นลง 1 รอบ ต่ำสุด 1 รอบ ไม่เปลี่ยนเวลารอที่กำลังเดินอยู่',duration:'ถึงจบช่วงถัดไป หรือใช้สกิล',source:'เหตุการณ์เวลา'},
  {id:'B26',name:'ทิศทางแปรผัน',description:'สัตว์นำทางเสนอสินค้าเพิ่ม 1 ตัวเลือกครั้งถัดไป สูงสุด 5 ตัวเลือก',duration:'ถึงจบช่วงถัดไป หรือใช้สัตว์นำทาง',source:'เข็มทิศแปรผัน'},
  {id:'D25',name:'พันธนาการเวลา',description:'สกิลพ่อค้าครั้งถัดไปมี cooldown เพิ่ม 2 รอบ ไม่ยืดเวลารอปัจจุบันและไม่เพิ่มซ้ำทุกช่วง',duration:'ถึงจบช่วงถัดไป หรือใช้สกิล',source:'คำสาปและเหตุการณ์เวลา'},
];
export const ABILITY_EVENT_CATALOG:ReadonlyArray<{id:EventId;name:string;when:string;description:string}>=[
  {id:'E130',name:'ช่างไขลานหลงมิติ',when:'มีสกิลที่ยังรออยู่',description:'จ่าย 3 เครดิต ลดเวลารอที่เหลือของสกิลที่รอนานที่สุด 1 รอบ หรือผ่าน'},
  {id:'E131',name:'ตลาดซื้อขายเวลา',when:'มีพ่อค้าที่ไว้ใจอย่างน้อยหนึ่งราย',description:'เลือกเร่งสกิลครั้งถัดไป 1 รอบ หรือรับ 5 เครดิตแลก cooldown ครั้งถัดไปเพิ่ม 2 รอบ'},
  {id:'E132',name:'ทางแยกของฝูง',when:'มีสินค้าจากพ่อค้าที่ไว้ใจ',description:'เลือกรับทิศทางแปรผันเพื่อเพิ่มตัวเลือกสัตว์นำทาง หรือใช้พลัง 1 เปิดความแท้ของสินค้าในร้านหนึ่งชิ้น'},
];

/** New-run replacements for the three mechanically identical legacy pairs. */
export const MODERN_ACTIVATIONS = {
  scanner:{operation:'scan-shop-price',th:'สแกนราคาจริงของสินค้าที่ยังไม่รู้ราคา 1 ชิ้นแบบสุ่มในร้านก่อน แล้วจึงในคลัง ไม่ใช้โควตาตรวจ',en:'Reveal the true value of one random unpriced shop item, falling back to your inventory. Uses no inspection quota.'},
  'memory-mirror':{operation:'recall-held-fact',th:'เรียกความทรงจำ เปิดข้อมูลที่ยังไม่รู้แบบสุ่ม 1 ด้านของของในคลัง ไม่ใช้โควตาตรวจ',en:'Recall one random unknown fact about a held item. Uses no inspection quota.'},
  'void-cell':{operation:'energy-for-delay',th:'ฟื้นพลังสูงสุด 3 แต่รับพันธนาการเวลา สกิลพ่อค้าครั้งถัดไปมี cooldown เพิ่ม 2 รอบ',en:'Restore up to 3 energy, but gain Time Shackles: your next merchant ability cooldown increases by 2.'},
} as const;
