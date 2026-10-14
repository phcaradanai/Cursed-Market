import { marketOrderReserve } from '../game/appraisal/market-contracts.js';
import { emptyPassives, freeInspectionCount, heldPassives } from '../game/appraisal/passives.js';
import type { InspectionProperty } from '../game/appraisal/types.js';
import { BOND_SPECS, CONSIGN_RULES, EVENT_CATALOG, ITEM_SPECS, NPC_SPECS, STATUS_CATALOG, UNSOLD_PENALTIES } from '../game/appraisal/content.js';
import type { AppraisalView, EventOffer, ItemView, NpcId, StatusId } from '../game/appraisal/types.js';
import type { AppraisalSeatAction } from '../shared/appraisal-protocol.js';

export type Decision = AppraisalSeatAction extends infer A ? A extends AppraisalSeatAction ? Omit<A,'requestId'|'encounter'> : never : never;
export const phaseName = {PORTALS:'เลือกประตู',APPRAISAL:'ประเมินและซื้อ',TRADE:'ต่อรองกับผู้เล่น',REVEAL:'รับเครดิตหลังซื้อขาย',RESULTS:'จบการเดินทาง'};
export const statusName = (id:StatusId) => STATUS_CATALOG.find(s=>s.id===id)!.name;
export function scoreStatusText(id:StatusId,survival=false):string {
  return !survival?'':id==='B10'?' · Collector เพิ่มคะแนนรวม 20% หากสถานะยังอยู่เมื่อตาย':id==='D10'?' · Collector ลดคะแนนรวม 20% หากสถานะยังอยู่เมื่อตาย':'';
}
export function eventScoreText(game:AppraisalView,offer:EventOffer,choice:string,statusId?:string):string {
  if(!game.survival || choice==='decline')return '';
  if(['E23','E34'].includes(offer.id))return scoreStatusText('B10',true);
  if(['E03','E39'].includes(offer.id) && (offer.id==='E39'||choice==='debt'))return scoreStatusText('D10',true);
  if(offer.id==='E42')return choice==='cleanse'?'ล้างความกระหายโลหิตและเอาผล Collector −20% ออก':'การฟื้นพลังใช้สิทธิ์ความกระหายโลหิต 1 ครั้ง หากเป็นสิทธิ์สุดท้าย ผล Collector −20% จะหมดไปด้วย';
  if(['E06','E41'].includes(offer.id) && statusId==='D10')return 'ล้างความกระหายโลหิตและเอาผล Collector −20% ออก';
  return '';
}
export function readable(text:string):string {
  return text.replace(/\b[BD]\d{2}\b/g,id=>statusName(id as StatusId)).replace(/base value|base/g,'มูลค่าจริง').replace(/encounter/g,'ช่วงพบพ่อค้า').replace(/settlement/g,'การคิดผลรอบ').replace(/seed/g,'เส้นทาง').replace(/credit/g,'เครดิต').replace(/percentage points/g,'จุดเปอร์เซ็นต์').replace(/\bevent\b/g,'เหตุการณ์').replace(/ก่อน resolve /g,'ก่อนเกิด').replace(/\bserver\b/g,'เซิร์ฟเวอร์');
}
/** Price stepper: out-of-range or fractional entries clamp into the 0–1000 integer range before stepping. */
export function stepPrice(value:string,delta:number):string {
  const number=Number(value);const base=value.trim()!=='' && Number.isFinite(number)?Math.round(number):0;
  return String(Math.max(0,Math.min(1000,base+delta)));
}
export function hasStatus(game:AppraisalView,id:StatusId):boolean {
  return game.self.statuses.some(s=>s.id===id && s.starts<=game.encounter && s.expires>=game.encounter && s.charges>0);
}
export const playerPassives=(game:AppraisalView,exclude?:string)=>game.passives && game.self.life!==0?heldPassives(game.self.inventory.filter(i=>i.id!==exclude)):emptyPassives();
export const npcAcceptanceChance=(game:AppraisalView,npc:NpcId)=>Math.min(95,(game.self.npcTrust?.[npc]??0)*5+playerPassives(game).acceptance);
export const inspectionQuota=(game:AppraisalView)=>2+playerPassives(game).inspections;
export const freeInspectionRemaining=(game:AppraisalView,property:InspectionProperty)=>freeInspectionCount(playerPassives(game),game.self,property);
export const inspectionCost = (game:AppraisalView,property:InspectionProperty='price') => freeInspectionRemaining(game,property)>0?0:Math.max(0,1+Number(hasStatus(game,'D01'))-Number(hasStatus(game,'B05')));
export const purchaseEnergy = (game:AppraisalView) => Math.max(0,1+Number(hasStatus(game,'D06'))-playerPassives(game).buyEnergy);
/** A preview uses only the seat DTO. Hidden base/reservation and RNG never enter this module. */
export function riskRange(game:AppraisalView,item:ItemView,value:number):[number,number] | null {
  const range=item.knowledge.base!==undefined?[item.knowledge.base,item.knowledge.base]:item.knowledge.range;
  if(!range)return null;
  const risks:number[]=[];
  for(let base=range[0]!;base<=range[1]!;base++) {
    const under=Math.max(0,1-value/base);
    const modifier=(under>0?.1*(Number(hasStatus(game,'D03'))-Number(hasStatus(game,'B04'))):0)+(game.self.honorJob && Math.abs(value-base)>base*.1?.1:0);
    risks.push(Math.max(0,Math.min(1,.4*under*NPC_SPECS[item.npc].sensitivity+modifier))*100);
  }
  return [Math.floor(Math.min(...risks)),Math.ceil(Math.max(...risks))];
}
export function purchasePrice(game:AppraisalView,items:ItemView[],condition:boolean,extraDiscount=0):number {
  return Math.max(0,items.reduce((sum,item)=>sum+item.price,0)-(hasStatus(game,'B03')?2:0)-(condition?(items[0]?.condition.discount??0):0)-extraDiscount-playerPassives(game).discount);
}
export function marketOptions(game:AppraisalView,item:ItemView) {
  return game.market.orders.filter(o=>game.market.open && o.kind===item.kind && (o.quota[game.self.id]??0)>0 && game.market.budget>=marketOrderReserve(o) && item.lockedUntil===null);
}
export function eventCatalog(offer:EventOffer) { return EVENT_CATALOG.find(e=>e.id===offer.id)!; }
const itemEvents=new Set(['E07','E09','E11','E12','E16','E17','E19','E20','E24','E25','E27','E29','E30','E31','E32','E33','E34','E35','E36','E38','E39','E44','E45','E46','E47']);
/** E48–E50 settle an accepted NPC risk; they cannot be declined. Never compare event IDs as strings. */
export const isConsequence=(id:string)=>['E48','E49','E50'].includes(id);
export const bondOf=(offer:EventOffer)=>BOND_SPECS.find(spec=>spec.id===offer.id);
export function eventNeedsItem(offer:EventOffer,choice:string):boolean {
  const bond=bondOf(offer);if(bond) return choice!=='decline' && bond.mode!=='show';
  return choice!=='decline' && (itemEvents.has(offer.id) || (offer.id==='E48' && choice==='item') || (offer.id==='E50' && choice==='surrender'));
}
export function eventStatusOptions(offer:EventOffer,choice:string):StatusId[] {
  if(choice==='decline') return [];
  if(offer.id==='E06') return offer.statusIds.filter(id=>id.startsWith('D') && id!==(choice==='interest'?'D04':'D07'));
  if(offer.id==='E34') return offer.statusIds.filter(id=>id.startsWith('B') && id!=='B10');
  if(offer.id==='E35') return offer.statusIds.filter(id=>id==='D01' || id==='D05');
  if(offer.id==='E41') return offer.statusIds.filter(id=>id.startsWith('D'));
  return [];
}
export function eventNeedsStatus(offer:EventOffer,choice:string):boolean {return choice!=='decline' && ['E06','E34','E35','E41'].includes(offer.id);}
export const factName={base:'มูลค่าจริง',genuine:'ความแท้',cursed:'คำสาป'};
export function eventFacts(offer:EventOffer,itemId:string):Array<keyof typeof factName> {
  return (['base','genuine','cursed'] as const).filter(fact=>offer.facts[itemId]?.[fact]!==undefined);
}
export function eventDecision(offer:EventOffer,choice:string,selection:{itemId:string;statusId:string;fact:string;guess:boolean}):Decision|null {
  if(!offer.choices.includes(choice)) return null;
  const action:Extract<Decision,{type:'event'}>={type:'event',key:offer.key,choice};
  if(eventNeedsItem(offer,choice)) {if(!offer.itemIds.includes(selection.itemId)) return null;action.itemId=selection.itemId;}
  if(eventNeedsStatus(offer,choice)) {if(!eventStatusOptions(offer,choice).includes(selection.statusId as StatusId)) return null;action.statusId=selection.statusId as StatusId;}
  if(choice!=='decline' && offer.id==='E45') {if(!eventFacts(offer,selection.itemId).includes(selection.fact as keyof typeof factName)) return null;action.fact=selection.fact as keyof typeof factName;}
  if(choice!=='decline' && offer.id==='E46') action.guess=selection.guess;
  return action;
}
const choiceNames:Record<string,string>={accept:'ตกลง',decline:'ไม่รับ',stay:'ยึดประตูเดิม',switch:'ใช้ประตูอื่น',pay:'จ่ายเครดิต',debt:'รับความกระหายโลหิต',interest:'รับดอกเบี้ยเงา',seal:'ยอมปิดประตูครั้งหน้า',cash:'เลือกพ่อค้ารับเครดิต',condition:'เลือกพ่อค้าลดราคาแลกเงื่อนไข',fog:'ยอมรับหมอกราคา',careful:'ตรวจอย่างระวัง',force:'ฝืนตรวจ',price:'เลือกตาเห็นราคา',curse:'เลือกอ่านคำสาป',discount:'รับรางวัลส่วนลด',risk:'รับรางวัลลดการจับผิด',burden:'ยอมรับอุปกรณ์หนัก',repair:'ซ่อมเครื่อง',energy:'เลือกผลต่อพลัง',cleanse:'ล้างความกระหายโลหิต',item:'ยอมเสียสินค้าที่เลือก',oath:'สาบานห้ามต่อรอง',surrender:'สละสินค้าเพื่อถอนสัญญา',die:'รับผลตายและพักช่วงนี้'};
export const choiceName=(choice:string,survival=false)=>survival && choice==='die'?'รับผลตายและเป็นผู้ชมจนจบ run':choiceNames[choice]??choice;
const eventChoiceNames:Partial<Record<string,Record<string,string>>>={E42:{energy:'ฟื้นพลัง 2'},E48:{energy:'เสียพลัง 2',pay:'จ่ายค่าปรับ 2 เครดิต'},E49:{pay:'จ่าย 2 เครดิตให้ลืม'},E03:{pay:'จ่าย 2 เครดิต',debt:'จ่ายด้วยเลือด'},E37:{pay:'จ้างคนแบก',burden:'แบกเอง'},E10:{pay:'จ่ายค่าผ่าน',fog:'ผ่านฟรีในหมอก',switch:'เลี่ยงไปประตูอื่น'}};
/** Button and card title for one event choice; a few events name the same choice key differently. */
export const choiceTitle=(offer:EventOffer,choice:string,survival=false)=>eventChoiceNames[offer.id]?.[choice]??choiceName(choice,survival);
export function eventCost(game:AppraisalView,offer:EventOffer,choice:string,itemId:string):string {
  if(game.phase==='PORTALS' && ['E01','E08','E10'].includes(offer.id)) {
    const first=NPC_SPECS[game.self.portals[0]!.npc].name;
    if(offer.id==='E08') {
      if(choice==='decline')return 'ไม่จ่ายเครดิตหรือพลัง · ประตูที่เปิดอยู่ยังเลือกได้ตามเดิม';
      const npc=NPC_SPECS[game.self.portals[choice==='cash'?0:1]!.npc];
      return `${choice==='cash'?'จ่ายเครดิตอย่างเดียว ไม่มีส่วนลด':`ลด ${npc.discount} เครดิตต่อการซื้อ · ต้องรับ ${statusName(npc.condition)}`} · ปิดประตูอื่นทั้งหมด`;
    }
    if(choice==='switch' || choice==='decline')return `ไม่เสียเครดิตหรือพลัง · เข้า ${first} ไม่ได้ในช่วงนี้ เลือกพ่อค้าจากประตูอื่นที่เปิดอยู่`;
    return `${offer.id==='E01'?'1 พลัง':choice==='pay'?'2 เครดิต':'รับหมอกราคา · ตรวจมูลค่าจริงไม่ได้จนหมดสถานะ'} · เก็บสิทธิ์เลือก ${first} และประตูอื่นที่เปิดอยู่${game.self.portals[0]!.disabled?' · ประตูนี้ปิดอยู่แล้ว เหตุการณ์นี้ไม่เปิดประตูคืน':''}`;
  }
  if(choice==='decline') return ['E01','E10'].includes(offer.id)?'ประตูแรกจะถูกปิดในช่วงนี้':'ไม่จ่ายเครดิตหรือพลัง';
  const bond=bondOf(offer);
  if(bond) {
    const give=offer.giveItemId?eventItemName(offer,offer.giveItemId):'';
    if(bond.mode==='swap') return `มอบ ${give} · รับสินค้าที่เลือกฟรี · ไม่ใช้พลัง${bond.genuineOnly?' · ของปลอมถูกปฏิเสธและรับ '+statusName('D10'):''}${bond.risk?` · เสี่ยง ${bond.risk*100}% ถูกจับได้และรับ ${statusName('D03')}`:''}`;
    if(bond.mode==='sell') return `ขายของที่เลือก รับ ${offer.quotedPrices[itemId]??0} เครดิต`;
    if(bond.mode==='reveal') return bond.energyCost?`${bond.energyCost} พลัง · ไม่ใช้สิทธิ์ตรวจ`:'ไม่ใช้พลังหรือสิทธิ์ตรวจ';
    return bond.mode==='tribute'?'มอบของที่เลือกให้ NPC':'ไม่ต้องสละของ';
  }
  const energy=(n:number)=>`${Math.max(0,n+Number(hasStatus(game,'D01'))-Number(hasStatus(game,'B05')))} พลัง · ใช้สิทธิ์ตรวจ 1 ครั้ง`;
  const item=game.self.stock.find(i=>i.id===itemId);
  const buying=['E09','E24','E27','E29','E30'].includes(offer.id);
  if(buying && item) {
    const discount=offer.id==='E29'?3:offer.id==='E30'?-2:2;
    return `ซื้อของที่เลือก ${purchasePrice(game,[item],game.self.dealMode==='condition',discount)} เครดิต · ${purchaseEnergy(game)} พลัง${game.self.dealMode==='condition'?` · รับ ${statusName(item.condition.statusId)}`:''}`;
  }
  const fixed:Record<string,string>={E02:'ไม่จ่ายทันที · รับความเสี่ยงงานประเมินพิเศษ',E04:'1 เครดิต',E05:'1 พลัง',E06:'สละสถานะที่เลือก แลกสถานะใหม่',E07:'ใช้หมด: อาหารที่เลือก',E13:energy(1),E14:'1 เครดิต',E15:'1 พลัง',E16:energy(1),E17:`2 เครดิต · ${energy(0)}`,E18:'1 พลัง',E19:'เปิดผลตรวจของปลอม · รับ 1 เครดิต',E20:energy(2),E22:'1 เครดิต',E23:'1 พลัง',E25:`ใช้หมด: ของที่เลือก · รับสินค้าชิ้นแรกของร้าน · ${purchaseEnergy(game)} พลัง${game.self.dealMode==='condition' && game.self.stock[0]?` · รับ ${statusName(game.self.stock[0].condition.statusId)}`:''}`,E26:'2 เครดิต',E28:'2 เครดิต',E31:'1 พลัง · รับลมหายใจต้องสาป',E32:'ใช้หมด: ลูกแก้ว · 1 เครดิต',E33:'ใช้หมด: กุญแจเงา',E34:'สละ buff ที่เลือก',E35:'ใช้หมด: ยาชำระล้าง',E36:'1 พลัง',E38:'1 พลัง · รับตรานักโกง',E39:'1 พลัง · รับกระหายโลหิต',E41:'2 เครดิต',E43:'ไม่จ่าย · รับ 1 เครดิตเมื่อซื้อขายกับผู้เล่นสำเร็จ',E45:'เปิดข้อมูลที่เลือกให้ทุกคน · รับ 1 เครดิต',E46:'1 พลัง · ทายถูกได้ 2 เครดิต',E47:'ดูรายการข้ามร้าน · ไม่มีการโอนของ'};
  if(offer.id==='E08') {
    const portal=game.self.portals[choice==='cash'?0:1];const npc=portal?NPC_SPECS[portal.npc]:null;
    return !npc?'เลือกได้รายเดียว':choice==='cash'?`${npc.name} · จ่ายเครดิตอย่างเดียว`:`${npc.name} · ลด ${npc.discount} เครดิต แลก ${statusName(npc.condition)}`;
  }
  if(offer.id==='E01') return choice==='stay'?'1 พลัง':'ประตูแรกจะถูกปิด';
  if(offer.id==='E03') return choice==='pay'?'2 เครดิต · ฟื้นพลังได้สูงสุด 3':`รับกระหายโลหิต · การฟื้นพลังถูกลดลง${game.survival?' · เสียชีวิต 1 · Collector ลดคะแนน 20% ขณะที่สถานะยังอยู่':''}`;
  if(offer.id==='E10') return choice==='pay'?'2 เครดิต':choice==='fog'?'รับหมอกราคา':'ประตูแรกจะถูกปิด';
  if(offer.id==='E11') return `${energy(choice==='careful'?2:1)}${choice==='force'?' · รับอ่อนล้า':''}`;
  if(offer.id==='E12') return `1 เครดิต · ${energy(0)}`;
  if(offer.id==='E21') return `ซื้อทั้งคู่ ${purchasePrice(game,game.self.stock.slice(0,2),game.self.dealMode==='condition',2)} เครดิต · ${purchaseEnergy(game)} พลัง${game.self.dealMode==='condition' && game.self.stock[0]?` · รับ ${statusName(game.self.stock[0].condition.statusId)}`:''}`;
  if(offer.id==='E37') return choice==='pay'?'2 เครดิต':'รับอุปกรณ์หนัก';
  if(offer.id==='E40') return choice==='repair'?'2 พลัง':'รับหมอกราคา';
  if(offer.id==='E42') return choice==='energy'?'ฟื้นพลังได้สูงสุด 2':'ล้างกระหายโลหิต';
  if(offer.id==='E44') return `ขายของที่เลือก รับ ${offer.quotedPrices[itemId]??0} เครดิต`;
  if(offer.id==='E48') return choice==='pay'?'2 เครดิต':choice==='item'?'เสียสินค้าที่เลือก · ประกันทรัพย์อาจป้องกัน':'เสียพลังไม่เกิน 2';
  if(offer.id==='E49') return choice==='pay'?'2 เครดิต':'รับสาบานห้ามต่อรองถึงจบช่วงถัดไป';
  if(offer.id==='E50') return choice==='surrender'?'เสียสินค้าที่เลือก · ถอนสัญญา':game.survival?'ชีวิตเป็น 0: เป็นผู้ชมจนจบ run · ของและเครดิตยังรอ Collector · สัญญาปลอดภัยอาจแทนด้วยเสียพลัง 2':'ตาย: พักช่วงนี้และได้คะแนนช่วงนี้ 0 · สัญญาปลอดภัยอาจแทนด้วยเสียพลัง 2';
  return fixed[offer.id]??'ดูเงื่อนไขข้อเสนอด้านบน';
}
export function eventItemName(offer:EventOffer,id:string):string { const kind=offer.targetKinds[id];return kind?ITEM_SPECS[kind].name:'สินค้าในผลตรวจเดิม'; }
export function inventoryLabel(game:AppraisalView,item:ItemView):string {return `คลัง #${game.self.inventory.findIndex(i=>i.id===item.id)+1} ${item.name}`;}
export function defaultConsequence(offer:EventOffer|null):string|null {
  if(!offer || offer.choices.includes('decline')) return null;
  return offer.choices.includes('pay')?'หากจบช่วงหรือหมดเวลา จะจ่ายค่าปรับ 2 เครดิต':offer.choices.includes('oath')?'หากจบช่วงหรือหมดเวลา จะรับสาบานห้ามต่อรอง':offer.choices.includes('die')?'หากจบช่วงหรือหมดเวลา จะรับผลตายตามสัญญา Dark One':offer.choices.includes('energy')?'หากจบช่วงหรือหมดเวลา จะเสียพลังไม่เกิน 2':'หากจบช่วงหรือหมดเวลา จะเสียสินค้าชิ้นแรก';
}

/** Shop items you appraised that are still unsold; they need buy, NPC penalty or Dark Market consignment. */
export function unsoldItems(game:AppraisalView):ItemView[] {
  return game.brokerage?game.self.stock.filter(item=>item.appraisal!==null && item.owner.startsWith('npc:')):[];
}
export const unsoldPenaltyText=(item:ItemView)=>UNSOLD_PENALTIES[item.npc].text;
export const consignText=`${CONSIGN_RULES.cleanBelow*100}% ไม่มีผล · ${(CONSIGN_RULES.debuffBelow-CONSIGN_RULES.cleanBelow)*100}% รับ debuff สุ่มหนึ่งอย่าง · ${Math.round((1-CONSIGN_RULES.debuffBelow)*100)}% เสียค่าผ่านทาง ${CONSIGN_RULES.fee} เครดิตเท่าที่มี · ของเข้าคลังรอประมูล`;

/** One line telling the player what this phase is for; the HUD shows it under the phase title. */
export const phaseHint:Record<AppraisalView['phase'],string>={
  PORTALS:'เลือกพ่อค้าหนึ่งรายที่จะเชิญมาที่โต๊ะ',
  APPRAISAL:'ตรวจของ → ตีราคา → ตัดสินใจซื้อ',
  TRADE:'ขายหรือแลกของกับเพื่อน จัดการของค้างโต๊ะ แล้วรับเครดิตเติมก่อนพบพ่อค้าช่วงถัดไป',
  REVEAL:'จบช่วงซื้อขายนี้แล้ว รับเครดิตเติม หรือเสี่ยงหัวก้อยพร้อมผลของสะสม ก่อนเลือกประตูครั้งถัดไป',
  RESULTS:'จบการเดินทาง ดูคะแนนสุดท้าย',
};
export interface Outcome { tone:'good'|'bad'|'info'; title:string; lines:string[] }
/** Notes are an append-only window capped by the engine; return only the ones added since `prev`. */
export function appendedNotes(prev:string[],next:string[]):string[] {
  for(let k=Math.min(prev.length,next.length);k>0;k--) if(next.slice(0,k).every((note,i)=>note===prev[prev.length-k+i])) return next.slice(k);
  return next;
}
const BAD_NOTE=/ทายผิด|จับได้|ปฏิเสธ|ขายไม่ออก|ไม่ยอมแลก|ทิ้ง|ค่าผ่านทาง/;
const GOOD_NOTE=/ทายถูก|ยอมรับราคา|ชนะ|เงียบ ๆ/;
const signed=(n:number,unit:string)=>`${n>0?'+':'−'}${Math.abs(n)} ${unit}`;
/**
 * Turn the difference between two private views into one player-facing result card.
 * Reads only the seat DTO, so it can never reveal another player's hidden facts.
 */
export function outcomeBetween(prev:AppraisalView,next:AppraisalView):Outcome|null {
  const p=prev.self,n=next.self;const lines:string[]=[];let good=0,bad=0;let reveals=0;
  const notes=appendedNotes(p.notes,n.notes);
  const index=(g:AppraisalView)=>new Map([...g.self.stock,...g.self.inventory,...g.listings.map(l=>l.item)].map(i=>[i.id,i]));
  const before=index(prev),after=index(next);
  for(const [id,item] of after) {
    const a=before.get(id)?.knowledge;const b=item.knowledge;if(!a) continue;
    if(a.genuine===undefined && b.genuine!==undefined){lines.push(`${item.name}: ${b.genuine?'ของแท้':'ของปลอม'}`);if(b.genuine)good++;else bad++;}
    if(a.cursed===undefined && b.cursed!==undefined){lines.push(`${item.name}: ${b.cursed?'มีคำสาป':'ไม่มีคำสาป'}`);if(b.cursed)bad++;else good++;}
    if(a.base===undefined && b.base!==undefined) lines.push(`${item.name}: มูลค่าจริง ${b.base} เครดิต`);
    else if(b.base===undefined && b.range && (a.range?.[0]!==b.range[0] || a.range?.[1]!==b.range[1])) lines.push(`${item.name}: มูลค่าอยู่ช่วง ${b.range[0]}–${b.range[1]} เครดิต`);
    if(!a.effectsKnown && b.effectsKnown) lines.push(`${item.name}: รู้ผลเมื่อเปิดใช้แล้ว`);
    if(a.certificate===undefined && b.certificate!==undefined) lines.push(`${item.name}: ใบรับรอง${b.certificate?'พูดจริง':'เป็นเท็จ'}`);
    if(!a.activationKnown && b.activationKnown && !n.activated.includes(id)) lines.push(`${item.name}: รู้จังหวะที่ผลทำงานแล้ว`);
    if(!a.comparison && b.comparison) lines.push(`${b.comparison===id?item.name:after.get(b.comparison)?.name??'อีกชิ้น'} มีมูลค่าสูงกว่า`);
  }
  reveals=lines.length;
  if(!p.caught && n.caught){lines.push('พ่อค้าจับได้ว่าคุณกดราคา');bad+=2;}
  const gained=n.inventory.filter(i=>!p.inventory.some(x=>x.id===i.id));
  const lost=p.inventory.filter(i=>!n.inventory.some(x=>x.id===i.id));
  for(const item of gained){lines.push(`ได้ ${item.name}`);good++;}
  const credits=n.credits-p.credits,energy=n.energy-p.energy,life=(n.life??0)-(p.life??0);
  for(const item of lost){lines.push(`เสีย ${item.name}`);if(credits<=0)bad++;}
  const had=new Set(p.statuses.map(s=>s.id)),has=new Set(n.statuses.map(s=>s.id));
  for(const s of n.statuses) if(!had.has(s.id)){lines.push(`ได้รับ ${statusName(s.id)}`);if(s.id.startsWith('D'))bad++;else good++;}
  for(const s of p.statuses) if(!has.has(s.id)){lines.push(`หมดผล ${statusName(s.id)}`);if(s.id.startsWith('D'))good++;}
  for(const t of next.trades) {
    const old=prev.trades.find(o=>o.id===t.id);
    if(!old && t.sellerId===n.id && t.status==='open') lines.push(`มีข้อเสนอซื้อ ${t.item.name} ${t.credits} เครดิต`);
    if(old?.status==='open' && t.status!=='open' && t.buyerId===n.id) {lines.push(t.status==='accepted'?`ข้อเสนอซื้อ ${t.item.name} สำเร็จ`:`ข้อเสนอซื้อ ${t.item.name} ถูกปฏิเสธ`);if(t.status==='accepted')good++;}
  }
  for(const lot of next.market.lots??[]) {
    const old=prev.market.lots?.find(l=>l.id===lot.id);
    if(old && old.winnerId===undefined && lot.winnerId!==undefined && lot.yourBid!==null) {lines.push(lot.winnerId===n.id?`ชนะประมูล ${lot.item.name} ที่ ${lot.price} เครดิต`:`แพ้ประมูล ${lot.item.name}`);if(lot.winnerId===n.id)good++;}
  }
  if(credits){lines.push(signed(credits,'เครดิต'));if(credits>0)good++;}
  if(energy) lines.push(signed(energy,'พลัง'));
  if(life){lines.push(signed(life,'ชีวิต'));if(life<0)bad+=2;else good++;}
  for(const note of notes){if(BAD_NOTE.test(note))bad+=2;else if(GOOD_NOTE.test(note))good+=2;}
  const phaseChanged=prev.phase!==next.phase || prev.encounter!==next.encounter;
  if(!phaseChanged && !lines.length && !notes.length) return null;
  const tone=bad>good?'bad':good>bad?'good':'info';
  if(phaseChanged) return {tone:life<0?'bad':'info',title:next.phase==='REVEAL'?`รับเครดิตหลังซื้อขายช่วง ${next.encounter}`:`${phaseName[next.phase]}${next.phase==='PORTALS'?` · ช่วง ${next.encounter}`:''}`,lines:[phaseHint[next.phase],...notes,...lines]};
  const activated=n.activated.find(id=>!p.activated.includes(id));
  const resolved=p.eventOffer && n.eventOffer?.key!==p.eventOffer.key?EVENT_CATALOG.find(e=>e.id===p.eventOffer!.id)?.name:undefined;
  const title=notes[0]??(resolved?resolved:activated?`เปิดใช้ ${after.get(activated)?.name??before.get(activated)?.name??'สินค้า'}`:gained[0]?`ได้ ${gained[0].name}`:lost[0]?(credits>0?`ขาย ${lost[0].name}`:`เสีย ${lost[0].name}`):reveals?'ผลการตรวจ':'ผลการกระทำ');
  return {tone,title,lines:[...notes.slice(1),...lines.filter(line=>line!==title)]};
}
