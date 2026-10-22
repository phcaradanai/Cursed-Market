import type { ItemSpec } from './content.js';
import { addUseBonuses, EXTRA_HELD_EFFECTS } from './item-effects.js';
import type { AppraisalConfig, AppraisalState, Appraiser, InspectionProperty, ItemKind, MarketOrder, PassiveKind } from './types.js';

export interface PassiveBonuses {
  freePrice:number; commission:number; income:number; luck:number; coinWin:number; saleFee:number;
  trust:number; acceptance:number; discount:number; buyEnergy:number; freeAuth:number; freeEffects:number;
  market:number; match:number; mitigation:number; energyRecovery:number; lifeRecovery:number; inspections:number;
  maxEnergy:number; maxLife:number; wishSlots:number;
}
export const emptyPassives=():PassiveBonuses=>({freePrice:0,commission:0,income:0,luck:0,coinWin:0,saleFee:0,trust:0,acceptance:0,discount:0,buyEnergy:0,freeAuth:0,freeEffects:0,market:0,match:0,mitigation:0,energyRecovery:0,lifeRecovery:0,inspections:0,maxEnergy:0,maxLife:0,wishSlots:0});
type PassiveSpec=ItemSpec & {passive:{effect:keyof PassiveBonuses;amount:number;text:string}};
export const PASSIVE_ITEMS={
  'inspection-warrant':{name:'หมายสั่งตรวจราคา',family:'scanner',anchor:16,buff:'B01',drawback:'D02',consumable:false,passive:{effect:'freePrice',amount:1,text:'ตรวจราคาฟรี 1 ครั้งต่อช่วงต่อชิ้น ยังใช้จำนวนครั้งตรวจตามปกติ'}},
  'tax-order':{name:'ใบสั่งเพิ่มภาษี',family:'key',anchor:23,buff:'B03',drawback:'D04',consumable:false,passive:{effect:'commission',amount:5,text:'ค่านายหน้าจากของที่คุณประเมินเพิ่ม 5 จุดเปอร์เซ็นต์ต่อชิ้น อัตรารวมสูงสุด 100%'}},
  'noble-seal':{name:'ตราขุนนางชั้นสูง',family:'amulet',anchor:24,buff:'B07',drawback:'D03',consumable:false,passive:{effect:'income',amount:2,text:'เงินหลังจบซื้อขายเพิ่ม 2 เครดิตต่อชิ้น รวมในยอดที่เสี่ยงหัวก้อย'}},
  'gambler-hat':{name:'หมวกเซียนพนัน',family:'mask',anchor:28,buff:'B04',drawback:'D08',consumable:false,passive:{effect:'luck',amount:5,text:'โอกาสทายหัวก้อยถูกเพิ่ม 5 จุดเปอร์เซ็นต์ต่อชิ้น สูงสุด 85%'}},
  'lucky-die':{name:'ลูกเต๋ากินเจ้ามือ',family:'orb',anchor:21,buff:'B03',drawback:'D10',consumable:false,passive:{effect:'coinWin',amount:1,text:'ทายหัวก้อยถูกได้โบนัสเพิ่มอีก 1 เครดิตต่อชิ้นต่อครั้ง ยังเสียทั้งหมดเมื่อทายผิด'}},
  'merchant-ledger':{name:'สมุดบัญชีคนกลาง',family:'mirror',anchor:17,buff:'B10',drawback:'D05',consumable:false,passive:{effect:'saleFee',amount:1,text:'ขายของที่คุณประเมินสำเร็จครั้งแรก รับค่าดำเนินการเพิ่ม 1 เครดิตต่อชิ้นที่ถือ'}},
  'friendship-ring':{name:'แหวนผูกไมตรี',family:'amulet',anchor:22,buff:'B07',drawback:'D08',consumable:false,passive:{effect:'trust',amount:1,text:'ความไว้ใจจากการขายของที่คุณประเมินเพิ่มอีก 1 ต่อชิ้นที่ถือ ยังสูงสุด 10'}},
  'negotiator-gloves':{name:'ถุงมือนักเจรจา',family:'blade',anchor:25,buff:'B04',drawback:'D03',consumable:false,passive:{effect:'acceptance',amount:3,text:'โอกาสที่ NPC ยอมรับราคาต่ำเพิ่ม 3 จุดเปอร์เซ็นต์ต่อชิ้น รวมความไว้ใจสูงสุด 95% ไม่ลดความเสี่ยงจับผิด'}},
  'guild-badge':{name:'เข็มกลัดกิลด์พ่อค้า',family:'key',anchor:19,buff:'B03',drawback:'D04',consumable:false,passive:{effect:'discount',amount:1,text:'ซื้อจาก NPC ลดเพิ่ม 1 เครดิตต่อชิ้นที่ถือ ต่อดีล ไม่ต่อสินค้าภายในชุด ราคาต่ำสุด 0'}},
  'light-satchel':{name:'กระเป๋าขนนก',family:'battery',anchor:18,buff:'B05',drawback:'D06',consumable:false,passive:{effect:'buyEnergy',amount:1,text:'พลังที่ใช้ซื้อจาก NPC ลด 1 ต่อชิ้นที่ถือ ต่ำสุด 0 รวมผลอุปกรณ์หนักก่อนลด'}},
  'surveyor-lens':{name:'แว่นผู้พิสูจน์ของแท้',family:'scanner',anchor:20,buff:'B02',drawback:'D02',consumable:false,passive:{effect:'freeAuth',amount:1,text:'ตรวจความแท้ฟรี 1 ครั้งต่อช่วงต่อชิ้น ยังใช้จำนวนครั้งตรวจตามปกติ'}},
  'curse-compass':{name:'เข็มทิศเงาคำสาป',family:'scanner',anchor:20,buff:'B02',drawback:'D05',consumable:false,passive:{effect:'freeEffects',amount:1,text:'ตรวจคำสาปฟรี 1 ครั้งต่อช่วงต่อชิ้น ยังใช้จำนวนครั้งตรวจตามปกติ'}},
  'market-pass':{name:'บัตรสมาชิกตลาดเงา',family:'mask',anchor:15,buff:'B03',drawback:'D08',consumable:false,passive:{effect:'market',amount:1,text:'ขาย Dark Market รับเพิ่ม 1 เครดิตต่อชิ้นที่ถือ ไม่นับสินค้าที่กำลังขาย'}},
  'authenticity-seal':{name:'ตรารับรองสัญญาตลาด',family:'mirror',anchor:26,buff:'B07',drawback:'D03',consumable:false,passive:{effect:'match',amount:2,text:'ขายตรงเงื่อนไข Dark Market รับเครดิตเพิ่ม 2 ต่อชิ้นที่ถือ ไม่นับสินค้าที่กำลังขาย'}},
  'smuggler-cloak':{name:'เสื้อคลุมนักลักลอบ',family:'mask',anchor:29,buff:'B08',drawback:'D08',consumable:false,passive:{effect:'mitigation',amount:5,text:'ขายผิดเงื่อนไขแบบลดราคา ลดค่าปรับ 5 จุดเปอร์เซ็นต์ต่อชิ้น จาก 20% เหลือต่ำสุด 0% ไม่นับชิ้นที่ขาย'}},
  'merchant-canteen':{name:'กระติกแรงพ่อค้า',family:'battery',anchor:14,buff:'B09',drawback:'D10',consumable:false,passive:{effect:'energyRecovery',amount:1,text:'ดีลจ่ายเครดิตฟื้นพลังกับ NPC ฟื้นเพิ่ม 1 ต่อชิ้นที่ถือ ไม่เกินพลังสูงสุด'}},
  'healing-brooch':{name:'เข็มกลัดชีพจร',family:'amulet',anchor:27,buff:'B08',drawback:'D10',consumable:false,passive:{effect:'lifeRecovery',amount:1,text:'ดีลจ่ายเครดิตฟื้นชีวิตกับ NPC ฟื้นเพิ่ม 1 ต่อชิ้นที่ถือ ไม่เกินชีวิตสูงสุด ผู้ตายฟื้นไม่ได้'}},
  'vital-flask':{name:'ขวดพลังสำรอง',family:'battery',anchor:22,buff:'B17',drawback:'D18',consumable:false,passive:{effect:'maxEnergy',amount:2,text:'พลังสูงสุด +2 ต่อชิ้น (รวมสูงสุด 20) ขายหรือแลกออกแล้วพลังที่เกินจะหายไป'}},
  'life-relic':{name:'ศิลาชีพจรเก่า',family:'amulet',anchor:26,buff:'B19',drawback:'D20',consumable:false,passive:{effect:'maxLife',amount:1,text:'โหมดมีชีวิต: ชีวิตสูงสุด +1 ต่อชิ้น (สูงสุด +6) · โหมดปกติที่ไม่มีชีวิต: พลังสูงสุด +1 ต่อชิ้น'}},
  'wish-ledger':{name:'สมุดคำสัญญาพ่อค้า',family:'key',anchor:20,buff:'B18',drawback:'D19',consumable:false,passive:{effect:'wishSlots',amount:1,text:'ทำสัญญาตามหาของพร้อมกันได้เพิ่ม 1 รายการต่อชิ้น (รวมสูงสุด 4 รายการ)'}},
  'inspector-notebook':{name:'สมุดนัดผู้ตรวจ',family:'mirror',anchor:18,buff:'B01',drawback:'D05',consumable:false,passive:{effect:'inspections',amount:1,text:'ตรวจสินค้าได้เพิ่ม 1 ครั้งต่อช่วงต่อชิ้น ค่าใช้พลังคิดตามประเภทการตรวจ'}},
} satisfies Record<PassiveKind,PassiveSpec>;
export const passivesEnabled=(config:Pick<AppraisalConfig,'catalogVersion'>)=>config.catalogVersion===3;
export function passiveSpec(kind:ItemKind):PassiveSpec|undefined {return PASSIVE_ITEMS[kind as PassiveKind];}
/** Effects depend on the known kind and ownership, never hidden authenticity or curse. */
export const HELD_STACK_CAP=5;
export function heldPassives(items:ReadonlyArray<{kind:ItemKind}>,itemEffects=false):PassiveBonuses {
  const result=emptyPassives(),counts=new Map<ItemKind,number>();
  for(const item of items){
    const count=counts.get(item.kind)??0;if(itemEffects && count>=HELD_STACK_CAP)continue;
    counts.set(item.kind,count+1);
    const effect=passiveSpec(item.kind)?.passive??(itemEffects?EXTRA_HELD_EFFECTS[item.kind]:undefined);
    if(effect)result[effect.effect]+=effect.amount;
  }
  return result;
}
export function passiveBonuses(state:AppraisalState,p:Appraiser,exclude:readonly string[]=[]):PassiveBonuses {
  if(p.life===0)return emptyPassives();
  const held=heldPassives(p.inventory.filter(id=>!exclude.includes(id) && state.items[id]?.owner===p.id).map(id=>state.items[id]!),!!state.config.itemEffects);
  return addUseBonuses(passivesEnabled(state.config)?held:emptyPassives(),state.config.itemEffects?p.itemUseBonuses:undefined);
}
export function freeInspectionCount(b:PassiveBonuses,p:Pick<Appraiser,'passiveUses'>,property:InspectionProperty):number {
  return Math.max(0,b[property==='price'?'freePrice':property==='authenticity'?'freeAuth':'freeEffects']-(p.passiveUses?.[property]??0));
}
export const inspectionLimit=(state:AppraisalState,p:Appraiser)=>Math.max(0,2+passiveBonuses(state,p).inspections-(state.config.core2 && p.statuses.some(s=>s.id==='D24' && s.charges>0)?1:0));
export const commissionRate=(b:PassiveBonuses)=>Math.min(100,10+b.commission);
export const coinWinChance=(b:PassiveBonuses)=>Math.min(85,50+b.luck);
/** Only artifact credits are extra; the existing market reservation stays unchanged. */
export function passiveMarketBonus(order:MarketOrder,b:PassiveBonuses,match:boolean,markdown:boolean):number {
  return b.market+(match?b.match:0)+(markdown?Math.floor(order.price*(80+Math.min(20,b.mitigation))/100)-Math.floor(order.price*.8):0);
}
export const MAX_ENERGY_CAP=20,MAX_LIFE_BONUS_CAP=6,WISH_SLOT_CAP=4;
