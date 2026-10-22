import type { EventId, StatusId } from './types.js';

/** Pure data (no node imports) so the browser client can read the same table as the engine. */
/**
 * Core v0.6 events as data, so the engine and the client read the same table. Every choice is a trade:
 * the prices are what the player can pay in different currencies, never a free option.
 * `door` closes the other portal, `fine` marks a penalty that may be paid in kind, `toVictim` sends the fine to the robbed seat.
 */
export interface Core2Choice {
  id:string;credits?:number;energy?:number;life?:number;reward?:number;heal?:number;
  grant?:StatusId[];lose?:boolean;door?:'first'|'second';deal?:'cash'|'condition';toVictim?:boolean;
}
export interface Core2EventSpec {
  id:EventId;name:string;when:string;phase:'PORTALS'|'APPRAISAL'|'TRADE';consequence?:boolean;description:string;choices:Core2Choice[];
}

export const CORE2_SPECS:Partial<Record<EventId,Core2EventSpec>>={
  E117:{id:'E117',name:'ด่านเก็บค่าผ่าน',when:'ก่อนเลือกประตู',phase:'PORTALS',description:'ผู้เฝ้าด่านเรียกเก็บค่าผ่านก่อนเปิดประตู ทุกทางมีราคา ไม่มีทางผ่านฟรี',choices:[
    {id:'pay',credits:2,energy:1,door:'first'},{id:'fog',grant:['D02'],door:'second'},{id:'burden',grant:['D06'],door:'second'}]},
  E118:{id:'E118',name:'สัญญาหน้าประตู',when:'ก่อนเลือกประตู',phase:'PORTALS',description:'ประตูแรกรับเครดิตสด ประตูที่สองให้ส่วนลดแต่ผูกเงื่อนไขกับคุณ',choices:[
    {id:'cash',credits:3,door:'first',deal:'cash'},{id:'condition',energy:1,grant:['D08'],door:'second',deal:'condition'}]},
  E119:{id:'E119',name:'ผู้เฝ้าประตูทวงหนี้',when:'ก่อนเลือกประตู',phase:'PORTALS',description:'ผู้เฝ้าประตูทวงเครดิตเก่า จ่ายสดตอนนี้ ติดดอกเบี้ย หรือยอมเสียแรงเปลี่ยนทาง',choices:[
    {id:'pay',credits:3,door:'first'},{id:'interest',grant:['D04'],door:'first'},{id:'switch',energy:2,door:'second'}]},
  E120:{id:'E120',name:'ผู้ตรวจสอบสงสัย',when:'หลังประเมินราคาสูงเกินจริง',phase:'APPRAISAL',consequence:true,description:'ราคาที่คุณตั้งสูงเกินหน้าร้านมาก ผู้ตรวจสอบเรียกค่าอธิบาย จ่ายด้วยอะไรก็ได้ที่คุณมี',choices:[
    {id:'pay',credits:3},{id:'energy',energy:2},{id:'item',lose:true}]},
  E121:{id:'E121',name:'พ่อค้าตะคอก',when:'หลังประเมินราคาสูงเกินจริง',phase:'APPRAISAL',consequence:true,description:'พ่อค้ารู้ว่าคุณโกหกเรื่องราคา เขาเรียกค่าปรับหรือบังคับให้คุณรับภาษีแฝง',choices:[
    {id:'pay',credits:4},{id:'tax',grant:['D18','D12']},{id:'blood',life:1}]},
  E122:{id:'E122',name:'ศาลเงาพิพากษา',when:'หลังประเมินราคาสูงเกินจริง',phase:'APPRAISAL',consequence:true,description:'ศาลเงาตัดสินความโลภ ค่าปรับหนักที่สุด แต่คุณเลือกได้ว่าจะจ่ายด้วยอะไร',choices:[
    {id:'pay',credits:6},{id:'item',lose:true},{id:'blood',life:2},{id:'energy',energy:3}]},
  E123:{id:'E123',name:'ถูกจับตอนฉกของ',when:'หลังขโมยหรือหลอกแลกของล้มเหลว',phase:'APPRAISAL',consequence:true,description:'ยามเงาจับมือคุณได้ ค่าปรับหนัก จ่ายตามที่เหลือ หรือยอมรับตราขโมย',choices:[
    {id:'pay',credits:5},{id:'energy',energy:3},{id:'item',lose:true},{id:'blood',life:1}]},
  E124:{id:'E124',name:'มือล้วงถูกจับ',when:'หลังล้วงกระเป๋าเพื่อนล้มเหลว',phase:'APPRAISAL',consequence:true,description:'เหยื่อจับข้อมือคุณได้ ค่าชดเชยจ่ายให้เหยื่อโดยตรง',choices:[
    {id:'pay',credits:4,toVictim:true},{id:'energy',energy:3},{id:'item',lose:true},{id:'blood',life:1}]},
  E125:{id:'E125',name:'ข่าวลือจากพ่อค้าเร่',when:'ระหว่างประเมิน',phase:'APPRAISAL',description:'พ่อค้าเร่ขายข่าวลือเรื่องราคา ซื้อด้วยเครดิตหรือแลกด้วยแรงเดินตามหา',choices:[
    {id:'pay',credits:2,grant:['B01']},{id:'walk',energy:1,grant:['B02']},{id:'decline'}]},
  E126:{id:'E126',name:'ยาหม้อเถื่อน',when:'ระหว่างประเมิน',phase:'APPRAISAL',description:'ยาจากหม้อต้มข้างทางฟื้นกำลังได้จริง แต่ผลข้างเคียงติดตัวไปถึงช่วงหน้า',choices:[
    {id:'drink',credits:3,heal:1,grant:['D11']},{id:'decline'}]},
  E127:{id:'E127',name:'เจ้าหนี้เงา',when:'ระหว่างประเมิน',phase:'APPRAISAL',description:'เจ้าหนี้เงายื่นเครดิตให้ทันที แลกกับดอกเบี้ยและภาษีแฝงที่ตามมา',choices:[
    {id:'borrow',reward:5,grant:['D04','D18']},{id:'decline'}]},
  E128:{id:'E128',name:'พิธีสละของ',when:'ระหว่างประเมิน',phase:'APPRAISAL',description:'ผู้ประกอบพิธีรับของเซ่นหนึ่งชิ้นแล้วให้เกราะคุ้มภัยเป็นการตอบแทน',choices:[
    {id:'offer',lose:true,grant:['B06','B19']},{id:'decline'}]},
  E129:{id:'E129',name:'เงาสะท้อนผู้ประเมิน',when:'ระหว่างประเมิน',phase:'APPRAISAL',description:'เงาของคุณเสนอให้ประเมินได้ปลอดภัยขึ้น หรือรับตรานักโกงแลกเสียงกระซิบ',choices:[
    {id:'steady',energy:1,grant:['B04']},{id:'whisper',grant:['D03','B12']},{id:'decline'}]},
};
/** Penalties always keep one way out: when nothing is affordable, the seat takes a brand. */
export const FALLBACK_BRAND:Core2Choice={id:'brand',grant:['D03','D18']};
export const core2Spec=(id:EventId)=>CORE2_SPECS[id];
export const isCore2Consequence=(id:EventId)=>!!CORE2_SPECS[id]?.consequence;
