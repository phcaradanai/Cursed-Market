import { EVENT_CATALOG, ITEM_SPECS, NPC_SPECS, STATUS_CATALOG } from '../game/appraisal/content.js';
import type { AppraisalView, EventOffer, ItemView, StatusId } from '../game/appraisal/types.js';
import type { AppraisalSeatAction } from '../shared/appraisal-protocol.js';

export type Decision = AppraisalSeatAction extends infer A ? A extends AppraisalSeatAction ? Omit<A,'requestId'|'encounter'> : never : never;
export const phaseName = {PORTALS:'เลือกประตู',APPRAISAL:'ประเมินและซื้อ',TRADE:'ต่อรองกับผู้เล่น',REVEAL:'ผล encounter',RESULTS:'จบการเดินทาง'};
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
  return text.replace(/\b[BD]\d{2}\b/g,id=>statusName(id as StatusId)).replace(/base value|base/g,'มูลค่าจริง').replace(/encounter/g,'ช่วงพบพ่อค้า').replace(/settlement/g,'การคิดผลรอบ').replace(/seed/g,'เส้นทาง').replace(/credit/g,'เครดิต');
}
export function hasStatus(game:AppraisalView,id:StatusId):boolean {
  return game.self.statuses.some(s=>s.id===id && s.starts<=game.encounter && s.expires>=game.encounter && s.charges>0);
}
export const inspectionCost = (game:AppraisalView) => Math.max(0,1+Number(hasStatus(game,'D01'))-Number(hasStatus(game,'B05')));
export const purchaseEnergy = (game:AppraisalView) => 1+Number(hasStatus(game,'D06'));
/** A preview uses only the seat DTO. Hidden base/reservation and RNG never enter this module. */
export function riskRange(game:AppraisalView,item:ItemView,value:number):[number,number] {
  const risks:number[]=[];
  for(let base=item.range[0];base<=item.range[1];base++) {
    const under=Math.max(0,1-value/base);
    const modifier=(under>0?.1*(Number(hasStatus(game,'D03'))-Number(hasStatus(game,'B04'))):0)+(game.self.honorJob && Math.abs(value-base)>base*.1?.1:0);
    risks.push(Math.max(0,Math.min(1,.4*under*NPC_SPECS[item.npc].sensitivity+modifier))*100);
  }
  return [Math.floor(Math.min(...risks)),Math.ceil(Math.max(...risks))];
}
export function purchasePrice(game:AppraisalView,items:ItemView[],condition:boolean,extraDiscount=0):number {
  return Math.max(0,items.reduce((sum,item)=>sum+item.price,0)-(hasStatus(game,'B03')?2:0)-(condition?(items[0]?.condition.discount??0):0)-extraDiscount);
}
export function marketOptions(game:AppraisalView,item:ItemView) {
  return game.market.orders.filter(o=>game.market.open && o.kind===item.kind && (o.quota[game.self.id]??0)>0 && game.market.budget>=o.price && item.lockedUntil===null);
}
export function eventCatalog(offer:EventOffer) { return EVENT_CATALOG.find(e=>e.id===offer.id)!; }
const itemEvents=new Set(['E07','E09','E11','E12','E16','E17','E19','E20','E24','E25','E27','E29','E30','E31','E32','E33','E34','E35','E36','E38','E39','E44','E45','E46','E47']);
export function eventNeedsItem(offer:EventOffer,choice:string):boolean {
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
const choiceNames:Record<string,string>={accept:'รับข้อเสนอ',decline:'ปฏิเสธข้อเสนอนี้',stay:'ยึดประตูเดิม',switch:'ใช้ประตูอื่น',pay:'จ่ายเครดิต',debt:'รับความกระหายโลหิต',interest:'รับดอกเบี้ยเงา',seal:'ยอมปิดประตูครั้งหน้า',cash:'เลือกพ่อค้ารับเครดิต',condition:'เลือกพ่อค้าลดราคาแลกเงื่อนไข',fog:'ยอมรับหมอกราคา',careful:'ตรวจอย่างระวัง',force:'ฝืนตรวจ',price:'เลือกตาเห็นราคา',curse:'เลือกอ่านคำสาป',discount:'รับรางวัลส่วนลด',risk:'รับรางวัลลดการจับผิด',burden:'ยอมรับอุปกรณ์หนัก',repair:'ซ่อมเครื่อง',energy:'เลือกผลต่อพลัง',cleanse:'ล้างความกระหายโลหิต',item:'ยอมเสียสินค้าที่เลือก',oath:'สาบานห้ามต่อรอง',surrender:'สละสินค้าเพื่อถอนสัญญา',die:'รับผลตายและพักช่วงนี้'};
export const choiceName=(choice:string,survival=false)=>survival && choice==='die'?'รับผลตายและเป็นผู้ชมจนจบ run':choiceNames[choice]??choice;
export function eventCost(game:AppraisalView,offer:EventOffer,choice:string,itemId:string):string {
  if(choice==='decline') return ['E01','E10'].includes(offer.id)?'ประตูแรกจะถูกปิดในช่วงนี้':'ไม่จ่ายเครดิตหรือพลัง';
  const energy=(n:number)=>`${Math.max(0,n+Number(hasStatus(game,'D01'))-Number(hasStatus(game,'B05')))} พลัง · ใช้สิทธิ์ตรวจ 1 ครั้ง`;
  const item=game.self.stock.find(i=>i.id===itemId);
  const buying=['E09','E24','E27','E29','E30'].includes(offer.id);
  if(buying && item) {
    const discount=offer.id==='E29'?3:offer.id==='E30'?-2:2;
    return `ซื้อของที่เลือก ${purchasePrice(game,[item],game.self.dealMode==='condition',discount)} เครดิต · ${purchaseEnergy(game)} พลัง${game.self.dealMode==='condition'?` · รับ ${statusName(item.condition.statusId)}`:''}`;
  }
  const fixed:Record<string,string>={E02:'ไม่จ่ายทันที · รับความเสี่ยงงานประเมินพิเศษ',E04:'1 เครดิต',E05:'1 พลัง',E06:'สละสถานะที่เลือก แลกสถานะใหม่',E07:'ใช้หมด: อาหารที่เลือก',E08:'เลือกได้เพียงพ่อค้าชุดเดียว',E13:energy(1),E14:'1 เครดิต',E15:'1 พลัง',E16:energy(1),E17:`2 เครดิต · ${energy(0)}`,E18:'1 พลัง',E19:'เปิดผลตรวจของปลอม · รับ 1 เครดิต',E20:energy(2),E22:'1 เครดิต',E23:'1 พลัง',E25:`ใช้หมด: ของที่เลือก · รับสินค้าชิ้นแรกของร้าน · ${purchaseEnergy(game)} พลัง${game.self.dealMode==='condition' && game.self.stock[0]?` · รับ ${statusName(game.self.stock[0].condition.statusId)}`:''}`,E26:'2 เครดิต',E28:'2 เครดิต',E31:'1 พลัง · รับลมหายใจต้องสาป',E32:'ใช้หมด: ลูกแก้ว · 1 เครดิต',E33:'ใช้หมด: กุญแจเงา',E34:'สละ buff ที่เลือก',E35:'ใช้หมด: ยาชำระล้าง',E36:'1 พลัง',E38:'1 พลัง · รับตรานักโกง',E39:'1 พลัง · รับกระหายโลหิต',E41:'2 เครดิต',E43:'ไม่จ่าย · รับ 1 เครดิตเมื่อซื้อขายกับผู้เล่นสำเร็จ',E45:'เปิดข้อมูลที่เลือกให้ทุกคน · รับ 1 เครดิต',E46:'1 พลัง · ทายถูกได้ 2 เครดิต',E47:'ดูรายการข้ามร้าน · ไม่มีการโอนของ'};
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
