import { FALLBACK_BRAND, core2Choices, core2Spec } from '../game/appraisal/core2-specs.js';
import type { Core2Rules } from '../game/appraisal/core2-specs.js';
import type { Core2Choice } from '../game/appraisal/core2-specs.js';
import type { EventId } from '../game/appraisal/types.js';
import { statusName } from './catalog-text.js';
import { t } from './i18n.js';

/** Core v0.6 events (E117–E129) read the engine's own table, so the client never shows a bare event ID. */
const COMMON:Record<string,string>={pay:'จ่ายเครดิต',energy:'จ่ายด้วยพลัง',item:'สละสินค้า',blood:'จ่ายด้วยเลือด',decline:'ไม่รับ',brand:'รับตรามลทิน'};
const TITLES:Partial<Record<EventId,Record<string,string>>>={
  E117:{pay:'จ่ายค่าผ่านครบ',fog:'รับหมอกราคา',burden:'แบกอุปกรณ์หนัก'},
  E118:{cash:'จ่ายสดผ่านประตูแรก',condition:'รับเงื่อนไขผ่านประตูที่สอง'},
  E119:{pay:'จ่ายหนี้สด',interest:'ติดดอกเบี้ย',switch:'เสียแรงเปลี่ยนทาง'},
  E121:{tax:'รับภาษีแฝง'},
  E125:{pay:'ซื้อข่าวลือด้วยเครดิต',walk:'เดินตามหาข่าว'},
  E126:{drink:'ดื่มยา',calm:'ทำพิธีสงบใจ'},E120:{pouch:'ค้างจ่ายท้ายช่วง'},E127:{borrow:'กู้เครดิตจากเจ้าหนี้เงา'},E128:{offer:'สละของเซ่น',ward:'จ้างยามเฝ้าโต๊ะ'},
  E129:{steady:'ประเมินให้ปลอดภัย',whisper:'รับตรานักโกงแลกเสียงกระซิบ'},
};
export const isCore2Event=(id:string)=>!!core2Spec(id as EventId);
export const isCore2Consequence=(id:string)=>!!core2Spec(id as EventId)?.consequence;
/** The choice's price list, or undefined for ids the table does not know. */
export function core2Choice(id:string,choice:string,rules?:Core2Rules):Core2Choice|undefined {
  return choice===FALLBACK_BRAND.id?FALLBACK_BRAND:core2Choices(id as EventId,rules).find(c=>c.id===choice);
}
export const core2NeedsItem=(id:string,choice:string)=>!!core2Choice(id,choice)?.lose;
export const core2Title=(id:string,choice:string)=>t(TITLES[id as EventId]?.[choice]??COMMON[choice]??choice);
export const core2Needs=(id:string,choice:string,rules?:Core2Rules):{credits:number;energy:number;life:number}=>{
  const c=core2Choice(id,choice,rules);return {credits:c?.credits??0,energy:c?.energy??0,life:c?.life??0};
};
export function core2Cost(id:string,choice:string,survival:boolean,rules?:Core2Rules):string {
  const c=core2Choice(id,choice,rules);if(!c)return '';
  return [
    c.credits?(c.toVictim?t('{n} เครดิต ให้ผู้ที่ถูกล้วง',{n:c.credits}):t('{n} เครดิต',{n:c.credits})):'',
    c.energy?t('{n} พลัง',{n:c.energy}):'',
    c.life?t('{n} ชีวิต (เหลืออย่างน้อย 1)',{n:c.life}):'',
    c.lose?t('เสียสินค้าที่เลือก 1 ชิ้น'):'',
    c.reward?t('รับ {n} เครดิต',{n:c.reward}):'',
    c.heal?(survival?t('ฟื้นชีวิต {n}',{n:c.heal}):t('ฟื้นพลังได้สูงสุด 3')):'',
    ...(c.grant??[]).map(s=>t('รับ {s}',{s:statusName(s)})),
    c.gamble?t('สุ่ม {p}%: {win} · ไม่งั้น {lose}',{p:Math.round(c.gamble.chance*100),win:c.gamble.win.map(statusName).join(', '),lose:c.gamble.lose.map(statusName).join(', ')}):'',
    c.door==='first'?t('ปิดประตูที่สอง'):c.door==='second'?t('ปิดประตูแรก'):'',
    c.deal==='cash'?t('ซื้อด้วยเครดิตเต็มราคา'):c.deal==='condition'?t('ซื้อแบบมีเงื่อนไขของพ่อค้า'):'',
  ].filter(Boolean).join(' · ')||t('ไม่เสียอะไร');
}
