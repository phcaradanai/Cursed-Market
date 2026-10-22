import { randomAt } from '../random.js';
import { ITEM_SPECS } from './content.js';
import { check, damageLife, grant, healLife, penaltyItem, recover, reward, spend, status, trace, transfer } from './mechanics.js';
import type { AppraisalAction, AppraisalState, Appraiser, EventId, EventOffer, StatusId } from './types.js';

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
export const core2Spec=(id:EventId)=>CORE2_SPECS[id];
export const isCore2Consequence=(id:EventId)=>!!CORE2_SPECS[id]?.consequence;
/** Events a seat may meet by chance (the penalties are only drawn by their cause). */
export const CORE2_DRAW_IDS:readonly EventId[]=['E117','E118','E119','E125','E126','E127','E128','E129'];
export const CORE2_BACKLASH_IDS:readonly EventId[]=['E120','E121','E122'];

const hasLoseChoice=(spec:Core2EventSpec)=>spec.choices.some(c=>c.lose);
const needsItem=(spec:Core2EventSpec,choice:string)=>!!spec.choices.find(c=>c.id===choice)?.lose;
export const core2NeedsItem=(id:EventId,choice:string)=>{const spec=CORE2_SPECS[id];return !!spec && needsItem(spec,choice);};

/** Can this seat pay for the choice right now? A fine never offers a price that would kill the payer. */
function affordable(state:AppraisalState,p:Appraiser,c:Core2Choice):boolean {
  if(c.credits && p.credits<c.credits)return false;
  if(c.energy && p.energy<c.energy)return false;
  if(c.life && (!state.config.survival || p.life===undefined || p.life<=c.life))return false;
  if(c.lose && !p.inventory.length)return false;
  if(c.reward && state.bank-state.market.budget-state.reservedRewards<c.reward)return false;
  if(c.heal && state.config.survival && p.life!==undefined && p.life>=(state.config.survival.maxLife))return false;
  return true;
}
/** Penalties always keep one way out: when nothing is affordable, the seat takes a brand. */
export const FALLBACK_BRAND:Core2Choice={id:'brand',grant:['D03','D18']};
export function core2EventChoices(state:AppraisalState,p:Appraiser,id:EventId):string[] {
  const spec=CORE2_SPECS[id]!;
  const open=spec.choices.filter(c=>c.id==='decline' || affordable(state,p,c)).map(c=>c.id);
  if(spec.consequence){return open.length?open:[FALLBACK_BRAND.id];}
  if(spec.phase==='PORTALS' && !open.length)return [FALLBACK_BRAND.id];
  return open;
}
export function core2EventEligible(state:AppraisalState,p:Appraiser,id:EventId):boolean {
  const spec=CORE2_SPECS[id];
  if(!spec || !state.config.core2 || p.paused || p.done || ['REVEAL','RESULTS'].includes(state.phase))return false;
  if(spec.consequence){
    if(p.consequenceSlots>=1)return false;
    if(CORE2_BACKLASH_IDS.includes(id))return !!p.inflated;
    return !!p.theft && (id==='E123'?p.theft.kind==='shop':p.theft.kind==='player' && !!p.theft.victim);
  }
  if(state.phase!==spec.phase)return false;
  if(spec.phase==='PORTALS')return p.portals.filter(v=>!v.disabled).length>1 && core2EventChoices(state,p,id).some(c=>c!==FALLBACK_BRAND.id);
  if(id==='E125')return p.stock.length>0 && !Object.keys(p.valuations).length && !status(p,'B01');
  if(id==='E126')return (state.config.survival?p.life!==undefined && p.life<state.config.survival.maxLife:p.energy<state.config.maxEnergy) && p.credits>=3;
  if(id==='E127')return state.bank-state.market.budget-state.reservedRewards>=5 && !status(p,'D04');
  if(id==='E128')return p.inventory.length>0 && !status(p,'B06') && !status(p,'B19');
  if(id==='E129')return p.stock.length>0 && !Object.keys(p.valuations).length && !status(p,'B04') && !status(p,'D03');
  return true;
}
/** Which backlash event fits the run: later and more extreme appraisals draw the harsher courts. */
export function pickBacklash(state:AppraisalState,p:Appraiser):EventId {
  const weights=[3,2,1+Math.floor((state.encounter-1)/3)];
  const total=weights.reduce((a,b)=>a+b,0);
  let roll=randomAt(state.seed,`${state.encounter}:${p.id}:backlash:pick`)*total;
  for(const [index,weight] of weights.entries()){roll-=weight;if(roll<0)return CORE2_BACKLASH_IDS[index]!;}
  return CORE2_BACKLASH_IDS[0]!;
}

/** Pay for a choice. Items go through the seizure check so B07 still protects. */
export function resolveCore2Event(state:AppraisalState,p:Appraiser,offer:EventOffer,command:Extract<AppraisalAction,{type:'event'}>):void {
  const spec=CORE2_SPECS[offer.id]!;const choice=command.choice;
  const picked:Core2Choice|undefined=choice===FALLBACK_BRAND.id?FALLBACK_BRAND:spec.choices.find(c=>c.id===choice);
  check(picked,'event-choice','ไม่มีตัวเลือกนี้');
  if(choice!=='decline' && choice!==FALLBACK_BRAND.id)check(affordable(state,p,picked),'event-cost','จ่ายตัวเลือกนี้ไม่ไหวแล้ว');
  if(picked.lose){
    check(command.itemId && offer.itemIds.includes(command.itemId),'event-target','เลือกสินค้าที่จะสละ');
    penaltyItem(state,p,command.itemId);
  }
  const victim=picked.toVictim && p.theft?.victim?state.players.find(v=>v.id===p.theft!.victim):undefined;
  if(picked.credits){
    if(victim)transfer(state,p,victim,picked.credits,spec.id);else spend(state,p,picked.credits,0,spec.id);
  }
  if(picked.energy)spend(state,p,0,picked.energy,spec.id);
  if(picked.life)damageLife(state,p,picked.life,spec.id);
  if(picked.heal){if(state.config.survival)healLife(state,p,picked.heal,spec.id);else recover(state,p,3,spec.id);}
  if(picked.reward)reward(state,p,picked.reward,spec.id);
  for(const s of picked.grant??[])grant(state,p,s);
  if(picked.door)p.portals.forEach((portal,index)=>{if(index===(picked.door==='first'?1:0))portal.disabled=true;});
  if(picked.deal)p.dealMode=picked.deal;
  if(spec.consequence){delete p.inflated;delete p.theft;}
  p.notes.push(`${spec.name}: ${choice}`);p.notes=p.notes.slice(-30);
  trace(state,p,'core2-event',{id:spec.id,choice});
}
/** Items a choice may sacrifice; empty when the event takes none. */
export const core2EventItems=(id:EventId,p:Appraiser)=>CORE2_SPECS[id] && hasLoseChoice(CORE2_SPECS[id]!)?[...p.inventory]:[];
export const core2ItemName=(state:AppraisalState,itemId:string)=>ITEM_SPECS[state.items[itemId]!.kind].name;
