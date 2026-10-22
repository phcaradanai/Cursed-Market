import type { Appraiser, NpcId } from './types.js';

export const MERCHANT_ABILITIES = {
  orc:{name:'ปิดดีล',cooldown:3,target:'stock',description:'ลดราคาซื้อสินค้า 1 ชิ้น 10/15/20% ตามขั้นความไว้ใจ ใช้กับเครดิตที่จ่ายจริง ไม่ลดค่าธรรมเนียม'},
  autometa:{name:'วิเคราะห์สมบูรณ์',cooldown:3,target:'stock',description:'เปิดราคาจริง / ราคาและความแท้ / ข้อมูลทั้งหมดของสินค้า 1 ชิ้น ตามขั้นความไว้ใจ'},
  alien:{name:'แลกเปลี่ยนต่างมิติ',cooldown:4,target:'inventory',description:'แลกของที่ถือเป็นตัวเลือกใหม่ 2/3/4 ชิ้น เลือกได้หนึ่ง มูลค่าคิดคะแนนไม่เกินต้นฉบับ เห็นข้อมูลเท่าที่ตรวจต้นฉบับไว้'},
  vampire:{name:'รักษาร่างต้น',cooldown:5,target:'consumable',description:'เปิดใช้ของใช้แล้วหมดโดยเก็บไว้ได้หนึ่งครั้งต่อชิ้น ขั้นสูงคืนพลัง 1/2 เพิ่มเติม ใช้กับสำเนาไม่ได้'},
  darkone:{name:'ฉีกพันธสัญญา',cooldown:4,target:'debuff',description:'ลบ debuff ที่เลือกทันที ขั้นกลางคืนพลัง 1 ขั้นสูงให้เกราะป้องกัน debuff ครั้งถัดไป'},
  deepsea:{name:'ชำระของต้องสาป',cooldown:4,target:'inventory',description:'ทำให้ของที่เลือกไร้คำสาป แม้ยังไม่ตรวจ ขั้นกลางเปิดความแท้ ขั้นสูงเปิดราคาด้วย ใช้สิทธิ์แม้ของเดิมไร้คำสาป'},
  swarm:{name:'แตกหน่อ',cooldown:5,target:'inventory',description:'สำเนาหนึ่งชิ้น มูลค่า 25/35/50% ของต้นฉบับ effect เหลือ 40% มีได้ชิ้นเดียวต่อต้นฉบับ สำเนาทำสำเนาต่อไม่ได้ ใช้สำเนาสิ้นเปลืองแล้วต้นฉบับทำซ้ำไม่ได้'},
  beast:{name:'เปลี่ยนสินค้าที่เสนอ',cooldown:3,target:'stock',description:'เลือกสินค้าที่ยังไม่ซื้อเพื่อรับตัวเลือกใหม่ 2/3/4 ชิ้น แล้วเลือกหนึ่งมาแทน ยังต้องซื้อปกติ เก็บของเดิมเป็นหนึ่งในตัวเลือกได้'},
} as const;
export const abilityTier=(trust:number)=>trust>=6?2:trust>=3?1:0;
export const abilityRemaining=(p:Appraiser,npc:NpcId,encounter:number)=>Math.max(0,Math.ceil((p.abilityReady?.[npc]??0)-encounter));
/** A cooldown adjustment never permits the same skill twice in one encounter; at most half its base wait is removed. */
export function reducibleCooldown(p:Pick<Appraiser,'abilityReady'|'abilityLastUsed'|'abilityAdjusted'>,npc:NpcId,encounter:number):number {
  const ready=p.abilityReady?.[npc]??0;
  return Math.max(0,Math.min(ready-Math.max(encounter,(p.abilityLastUsed?.[npc]??0)+1),Math.floor(MERCHANT_ABILITIES[npc].cooldown/2)-(p.abilityAdjusted?.[npc]??0)));
}
export function reduceAbilityCooldown(p:Appraiser,npc:NpcId,encounter:number,amount:number):number {
  const reduced=Math.round(Math.min(amount,reducibleCooldown(p,npc,encounter))*100)/100;
  if(reduced>0){p.abilityReady??={};p.abilityReady[npc]=Math.round((p.abilityReady[npc]!-reduced)*100)/100;p.abilityAdjusted??={};p.abilityAdjusted[npc]=(p.abilityAdjusted[npc]??0)+reduced;}
  return reduced;
}
