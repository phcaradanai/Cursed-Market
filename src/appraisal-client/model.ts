import { POLISH_EVENTS } from '../game/appraisal/polish-events.js';
import { marketOrderReserve } from '../game/appraisal/market-contracts.js';
import { emptyPassives, freeInspectionCount, heldPassives } from '../game/appraisal/passives.js';
import type { InspectionProperty, Knowledge } from '../game/appraisal/types.js';
import { FAKE_EFFECT_CHANCE, collectorTotal, itemScoreValue } from '../game/appraisal/scoring.js';
import { BOND_SPECS, CONSIGN_RULES, NPC_SPECS } from '../game/appraisal/content.js';
import { t, getLang } from './i18n.js';
import { eventText, itemName, npcName, npcUnsoldText, statusName, statusDescription } from './catalog-text.js';
import { ITEM_SPECS, itemFamily } from '../game/appraisal/content.js';
export { statusName } from './catalog-text.js';
import type { AppraisalView, EventOffer, ItemView, NpcId, StatusId } from '../game/appraisal/types.js';
import type { AppraisalSeatAction } from '../shared/appraisal-protocol.js';

export type Decision = AppraisalSeatAction extends infer A ? A extends AppraisalSeatAction ? Omit<A,'requestId'|'encounter'> : never : never;
const PHASE_LABEL:Record<AppraisalView['phase'],string>={PORTALS:'เลือกประตู',APPRAISAL:'ประเมินและซื้อ',TRADE:'ต่อรองกับผู้เล่น',REVEAL:'รับเครดิตหลังซื้อขาย',RESULTS:'จบการเดินทาง'};
/** Phase title in the active language. */
export const phaseLabel=(phase:AppraisalView['phase'])=>t(PHASE_LABEL[phase]);
export function scoreStatusText(id:StatusId,survival=false):string {
  return !survival?'':id==='B10'?t(' · Collector เพิ่มคะแนนรวม 20% หากสถานะยังอยู่เมื่อตาย'):id==='D10'?t(' · Collector ลดคะแนนรวม 20% หากสถานะยังอยู่เมื่อตาย'):'';
}
export function eventScoreText(game:AppraisalView,offer:EventOffer,choice:string,statusId?:string):string {
  if(!game.survival || choice==='decline')return '';
  if(['E23','E34'].includes(offer.id))return scoreStatusText('B10',true);
  if(['E03','E39'].includes(offer.id) && (offer.id==='E39'||choice==='debt'))return scoreStatusText('D10',true);
  if(offer.id==='E42')return choice==='cleanse'?t('ล้างความกระหายโลหิตและเอาผล Collector −20% ออก'):t('การฟื้นพลังใช้สิทธิ์ความกระหายโลหิต 1 ครั้ง หากเป็นสิทธิ์สุดท้าย ผล Collector −20% จะหมดไปด้วย');
  if(['E06','E41'].includes(offer.id) && statusId==='D10')return t('ล้างความกระหายโลหิตและเอาผล Collector −20% ออก');
  return '';
}
export function readable(text:string):string {
  // Catalog text is already English in English mode; only status codes still need a name.
  if(getLang()==='en') return text.replace(/\b[BD]\d{2}\b/g,id=>statusName(id as StatusId));
  return text.replace(/\b[BD]\d{2}\b/g,id=>statusName(id as StatusId)).replace(/base value|base/g,'มูลค่าจริง').replace(/encounter/g,'ช่วงพบพ่อค้า').replace(/settlement/g,'การคิดผลรอบ').replace(/seed/g,'เส้นทาง').replace(/credit/g,'เครดิต').replace(/percentage points/g,'จุดเปอร์เซ็นต์').replace(/\bevent\b/g,'เหตุการณ์').replace(/ก่อน resolve /g,'ก่อนเกิด').replace(/\bserver\b/g,'เซิร์ฟเวอร์');
}
/** Display names belong to the room, while engine notes and audit commands keep stable seat IDs. */
export function playerNote(text:string,names:Record<string,string>):string {
  const ids=Object.keys(names);if(!ids.length)return text;
  const escaped=ids.map(id=>id.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
  return text.replace(new RegExp(`(?<![A-Za-z0-9_-])(?:${escaped.join('|')})(?![A-Za-z0-9_-])`,'g'),id=>names[id]??id);
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
export const inspectionCost = (game:AppraisalView,property:InspectionProperty='price') => freeInspectionRemaining(game,property)>0?0:Math.max(0,1+Number(hasStatus(game,'D01'))-Number(hasStatus(game,'B05')))*Number(!hasStatus(game,'B11'));
/** Survival: goods a friend appraised and the merchant accepted cost no energy to buy. Mirrors friendAppraised in the engine. */
export const friendGoods = (game:AppraisalView, items:ItemView[]) => !!game.survival && items.length>0 && items.every(i=>i.appraisedBy!==undefined && i.appraisedBy!==game.self.id && i.appraisalAccepted===true && i.owner.startsWith(`npc:${i.appraisedBy}:`));
export const purchaseEnergy = (game:AppraisalView, items:ItemView[]=[]) => Math.max(0,(game.freeBuy || friendGoods(game,items)?0:1)+Number(hasStatus(game,'D06'))-playerPassives(game).buyEnergy);
export const effectsInspectionLabel=(game:AppraisalView)=>game.curseSight?t('ตรวจคำสาป'):t('ตรวจผลของสินค้า');
/** Nothing is left for the third inspection to teach. */
export const effectsKnownFor=(game:AppraisalView,k:Knowledge)=>game.curseSight?k.cursed!==undefined:!!k.effectsKnown && (!hasStatus(game,'B02') || k.cursed!==undefined);
export const needShort=(game:AppraisalView,need:{credits:number;energy:number;life?:number}):string|null=>
  game.self.credits<need.credits?t('เครดิตไม่พอ ต้องใช้ {need} มี {have}',{need:need.credits,have:game.self.credits}):game.self.energy<need.energy?t('พลังไม่พอ ต้องใช้ {need} มี {have}',{need:need.energy,have:game.self.energy}):need.life && (game.self.life??0)<=need.life?t('ต้องมีชีวิตมากกว่า {n} เพื่อเหลืออย่างน้อย 1',{n:need.life}):null;
/** Why an inspection button is locked for every item, or null. `quiet` suppresses the note while offline or after the seat is done. */
export function inspectionBlock(game:AppraisalView,quiet:boolean):string|null {
  if(quiet) return null;
  if(game.self.eventOffer) return t('ตอบเหตุการณ์ก่อน จึงตรวจได้');
  if(game.phase!=='APPRAISAL') return t('ตรวจได้เฉพาะช่วงประเมินและซื้อ');
  if(game.self.inspections>=inspectionQuota(game)) return t('ใช้สิทธิ์ตรวจครบแล้วในช่วงนี้');
  return null;
}
/** Why a purchase is locked, or null. The numbers shown on the button are the same ones checked here. */
export function purchaseBlock(game:AppraisalView,total:number,quiet:boolean):string|null {
  if(game.self.eventOffer) return t('ตอบเหตุการณ์ก่อน จึงซื้อได้');
  if(quiet) return null;
  return needShort(game,{credits:total,energy:purchaseEnergy(game)});
}
/** Mirror of the server's activation cost and preconditions. */
export function activationBlock(game:AppraisalView,itemId:string,quiet:boolean):string|null {
  if(game.self.eventOffer) return t('ตอบเหตุการณ์ก่อน จึงเปิดใช้ได้');
  if(quiet) return null;
  if(game.self.activated.includes(itemId)) return t('ชิ้นนี้เปิดใช้ในช่วงนี้แล้ว');
  return needShort(game,{credits:0,energy:1});
}
/**
 * What activating an item may give and what it may cost, composed on the client from the seat's own knowledge.
 * Mirrors the server's view rules, so the text follows the active language without server strings.
 */
export function possibleBenefitText(game:AppraisalView,item:ItemView):string {
  const spec=ITEM_SPECS[item.kind];const k=item.knowledge;
  const base=itemFamily(item.kind)==='orb'?t('อาจฟื้นพลัง {n} เมื่อเปิดใช้',{n:spec.energyRecovery??3}):
    itemFamily(item.kind)==='key' && hasStatus(game,'D07')?t('อาจล้างสถานะปิดประตูที่มีอยู่ การใช้ครั้งนี้เป็นการปลดประตู'):
    k.effectsKnown?statusDescription(spec.buff):t('อาจได้รับ {name}',{name:statusName(spec.buff)});
  return base+(game.survival && ['food','potion'].includes(itemFamily(item.kind))?t(' · ของแท้ฟื้นชีวิต 2'):'')+(game.survival && spec.buff==='B10'?t(' · ขณะมีสิทธิ์เหลือ Collector เพิ่มคะแนน 20%'):'');
}
export function possibleDrawbackText(game:AppraisalView,item:ItemView):string {
  const spec=ITEM_SPECS[item.kind];const k=item.knowledge;
  return (k.effectsKnown?statusDescription(spec.drawback):t('อาจได้รับ {name}',{name:statusName(spec.drawback)}))+(game.survival?t(' · หากมีคำสาป เปิดใช้เสียชีวิต 1'):'')+(game.survival && spec.drawback==='D10'?t(' · ขณะสถานะยังอยู่ Collector ลดคะแนน 20%'):'');
}
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
  const bloodDiscount=game.self.vampireDiscount?.encounter===game.encounter && items.length>0 && items.every(item=>item.npc==='vampire' && item.owner===`npc:${game.self.id}:${game.encounter}`);
  return (game.fee??0)+Math.floor(Math.max(0,items.reduce((sum,item)=>sum+item.price,0)-(hasStatus(game,'B03')?2:0)+(hasStatus(game,'D12')?2:0)-(condition?(items[0]?.condition.discount??0):0)-extraDiscount-playerPassives(game).discount)*(bloodDiscount?.5:1));
}
/** A sale of something the seat owns, after statuses and the omen (Dark Market, wishes, bond buyers). */
export const saleAdjusted=(game:AppraisalView,base:number)=>Math.max(0,Math.floor(base*(100+(game.salePct??0))/100));
export const salePctText=(game:AppraisalView)=>{const pct=game.salePct??0;return pct?t('ราคาขายของที่คุณเป็นเจ้าของถูกปรับ {pct}% จากผลติดตัวหรือลางของช่วงนี้ (ไม่รวมของที่ประเมินให้พ่อค้า)',{pct:`${pct>0?'+':''}${pct}`}):'';};
export function marketOptions(game:AppraisalView,item:ItemView) {
  return game.market.orders.filter(o=>game.market.open && o.kind===item.kind && (o.quota[game.self.id]??0)>0 && game.market.budget>=marketOrderReserve(o) && item.lockedUntil===null);
}
/** What an event choice charges up front, mirroring events.ts. Hidden facts never enter this. */
export function eventNeeds(game:AppraisalView,offer:EventOffer,choice:string,itemId:string):{credits:number;energy:number;life?:number} {
  const none={credits:0,energy:0};
  if(choice==='decline') return none;
  if(offer.npcTerms)return {credits:offer.npcTerms.credits,energy:offer.npcTerms.energy+(choice==='give-energy'?2:0),life:offer.npcTerms.life};
  const mod=(n:number)=>Math.max(0,n+Number(hasStatus(game,'D01'))-Number(hasStatus(game,'B05')));
  const item=game.self.stock.find(i=>i.id===itemId);
  const deal=game.self.dealMode==='condition';
  const bond=bondOf(offer);
  if(bond) return {credits:0,energy:bond.mode==='reveal'?bond.energyCost??0:0};
  switch(offer.id) {
    case 'E01': return choice==='stay'?{credits:0,energy:1}:none;
    case 'E03': case 'E10': case 'E37': case 'E48': case 'E49': return choice==='pay'?{credits:2,energy:0}:none;
    case 'E04': case 'E14': case 'E22': case 'E32': case 'E85': case 'E88': return {credits:1,energy:0};
    case 'E73': return {credits:0,energy:game.wishContract?2:0};
    case 'E94': case 'E95': case 'E96': case 'E97': case 'E98': case 'E99': case 'E100': case 'E101': return {credits:POLISH_EVENTS[offer.id]!.credits??0,energy:POLISH_EVENTS[offer.id]!.energy??0};
    case 'E84': case 'E93': return {credits:0,energy:1};
    case 'E87': return {credits:0,energy:2};
    case 'E91': return {credits:0,energy:game.survival?0:2};
    case 'E26': case 'E28': case 'E41': return {credits:2,energy:0};
    case 'E05': case 'E15': case 'E18': case 'E23': case 'E31': case 'E36': case 'E38': case 'E39': case 'E46': return {credits:0,energy:1};
    case 'E11': return {credits:0,energy:mod(choice==='careful'?2:1)};
    case 'E12': return {credits:1,energy:mod(0)};
    case 'E13': case 'E16': return {credits:0,energy:mod(1)};
    case 'E17': return {credits:2,energy:mod(0)};
    case 'E20': return {credits:0,energy:mod(2)};
    case 'E40': return choice==='repair'?{credits:0,energy:2}:none;
    case 'E09': case 'E24': case 'E27': return item?{credits:purchasePrice(game,[item],deal,2),energy:purchaseEnergy(game)}:none;
    case 'E29': return item?{credits:purchasePrice(game,[item],deal,3),energy:purchaseEnergy(game)}:none;
    case 'E30': return item?{credits:purchasePrice(game,[item],deal,-2),energy:purchaseEnergy(game)}:none;
    case 'E21': return {credits:purchasePrice(game,game.self.stock.slice(0,2),deal,2),energy:purchaseEnergy(game)};
    case 'E25': return {credits:0,energy:purchaseEnergy(game)};
    default: return none;
  }
}
/** Item options that would still teach something; the server offers the whole shelf for some events. */
export function eventItemUsable(game:AppraisalView,offer:EventOffer,id:string):boolean {
  const seen=[...game.self.stock,...game.self.inventory,...game.listings.map(l=>l.item)].find(i=>i.id===id);
  const k=seen?.knowledge;if(!k) return true;
  switch(offer.id) {
    case 'E11': case 'E46': return k.genuine===undefined;
    case 'E12': return k.certificate===undefined;
    case 'E16': return game.curseSight?k.cursed===undefined:!k.effectsKnown;
    case 'E17': return k.base===undefined;
    case 'E20': return !k.activationKnown;
    default: return true;
  }
}
/** Score range for one item from what this seat knows. Same formula the Collector uses. */
export function itemScoreRange(k:Knowledge,certified=false):[number,number]|null {
  const range=k.base!==undefined?[k.base,k.base]:k.range;if(!range) return null;
  const genuine=k.genuine===undefined?[true,false]:[k.genuine],cursed=k.cursed===undefined?[false,true]:[k.cursed];
  const values=range.flatMap(base=>genuine.flatMap(g=>cursed.map(c=>itemScoreValue(base,g,c,certified))));
  return [Math.min(...values),Math.max(...values)];
}
/** What the Collector would pay for the pack right now, from known facts only; unpriced items count 0. */
export function collectorEstimate(game:AppraisalView):{min:number;max:number;unpriced:number;modifier:number} {
  let low=0,high=0,unpriced=0;
  for(const item of [...game.self.inventory,...(game.self.loanItems??[])]) {const r=itemScoreRange(item.knowledge,item.appraisedBy!==undefined && item.appraisedBy!==game.self.id);if(r){low+=r[0];high+=r[1];}else unpriced++;}
  const has=(id:StatusId)=>game.self.statuses.some(s=>s.id===id && s.charges>0);
  const modifier=(has('B10')?20:0)-(has('D10')?20:0);
  return {min:collectorTotal(game.self.credits,low,modifier),max:collectorTotal(game.self.credits,high,modifier),unpriced,modifier};
}
/** The four authentic/fake × cursed/clean results of opening an item, said only as far as the facts are known. */
export function activationOutcome(k:Knowledge):string {
  const {genuine,cursed}=k;const pct=`${Math.round(FAKE_EFFECT_CHANCE*100)}%`;
  if(genuine===undefined && cursed===undefined) return t('ยังไม่รู้ว่าแท้หรือมีคำสาป ของแท้ได้ผลดีแน่ ของปลอมมีโอกาส {pct}',{pct});
  if(genuine!==undefined && cursed!==undefined) return genuine?(cursed?t('ได้ผลดี แต่โดนคำสาปด้วย'):t('ได้ผลดีเต็มที่ ไม่มีผลเสีย')):(cursed?t('ผลดีออกฤทธิ์ได้ {pct} แต่โดนคำสาปแน่',{pct}):t('ผลดีออกฤทธิ์ได้ {pct} ไม่มีผลเสีย',{pct}));
  if(genuine!==undefined) return genuine?t('ได้ผลดี · ยังไม่รู้ว่าจะโดนคำสาปไหม'):t('ผลดีออกฤทธิ์ได้ {pct} · ยังไม่รู้ว่าจะโดนคำสาปไหม',{pct});
  return cursed?t('โดนคำสาปแน่ · ผลดีออกแน่ถ้าเป็นของแท้ ถ้าปลอมได้ {pct}',{pct}):t('ไม่โดนคำสาป · ผลดีออกแน่ถ้าเป็นของแท้ ถ้าปลอมได้ {pct}',{pct});
}
/** Name, trigger and description of an event in the active language. */
export function eventCatalog(offer:EventOffer) { return eventText(offer.id); }
const itemEvents=new Set(['E07','E09','E11','E12','E16','E17','E19','E20','E24','E25','E27','E29','E30','E31','E32','E33','E34','E35','E36','E38','E39','E44','E45','E46','E47']);
/** E48–E50 settle an accepted NPC risk; they cannot be declined. Never compare event IDs as strings. */
export const isConsequence=(id:string)=>['E48','E49','E50'].includes(id);
export const bondOf=(offer:EventOffer)=>BOND_SPECS.find(spec=>spec.id===offer.id);
export function eventNeedsItem(offer:EventOffer,choice:string):boolean {
  if(offer.npcTerms)return choice!=='decline' && (offer.npcTerms.items>0 || choice==='give-item');
  const bond=bondOf(offer);if(bond) return choice!=='decline' && bond.mode!=='show';
  return choice!=='decline' && (itemEvents.has(offer.id) || (offer.id==='E48' && choice==='item') || (offer.id==='E50' && choice==='surrender'));
}
export function eventStatusOptions(offer:EventOffer,choice:string):StatusId[] {
  if(choice==='decline') return [];
  if(offer.id==='E06') return offer.statusIds.filter(id=>id.startsWith('D') && id!==(choice==='interest'?'D04':'D07'));
  if(offer.id==='E34') return offer.statusIds.filter(id=>id.startsWith('B') && id!=='B10');
  if(offer.id==='E35') return offer.statusIds.filter(id=>id==='D01' || id==='D05');
  if(offer.id==='E41') return offer.statusIds.filter(id=>id.startsWith('D'));
  if(offer.id==='E111' && choice==='purge')return offer.statusIds.filter(id=>id.startsWith('D'));
  if(offer.id==='E108') return offer.boons??[];
  if(offer.id==='E88') return offer.statusIds.filter(id=>['D11','D12','D13','D14','D15','D16'].includes(id));
  return [];
}
export function eventNeedsStatus(offer:EventOffer,choice:string):boolean {return choice!=='decline' && (['E06','E34','E35','E41','E88','E108'].includes(offer.id) || offer.id==='E111' && choice==='purge');}
export const loanItemCount=(choice:string)=>/^lend-[1-3]$/.test(choice)?Number(choice.slice(5)):0;
const FACT_LABEL={base:'มูลค่าจริง',genuine:'ความแท้',cursed:'คำสาป'} as const;
export const factLabel=(fact:keyof typeof FACT_LABEL)=>t(FACT_LABEL[fact]);
export function eventFacts(offer:EventOffer,itemId:string):Array<keyof typeof FACT_LABEL> {
  return (['base','genuine','cursed'] as const).filter(fact=>offer.facts[itemId]?.[fact]!==undefined);
}
export function eventDecision(offer:EventOffer,choice:string,selection:{itemId:string;statusId:string;fact:string;guess:boolean;itemIds?:string[];otherPlayerId?:string}):Decision|null {
  if(!offer.choices.includes(choice)) return null;
  const action:Extract<Decision,{type:'event'}>={type:'event',key:offer.key,choice};
  if(offer.id==='E110' && choice!=='decline'){const ids=selection.itemIds;if(!ids || ids.length!==loanItemCount(choice) || new Set(ids).size!==ids.length || !ids.every(id=>offer.itemIds.includes(id)))return null;action.itemIds=ids;}
  if(offer.id==='E111' && choice==='send-debuff'){if(!selection.otherPlayerId || !offer.otherPlayerIds.includes(selection.otherPlayerId))return null;action.otherPlayerId=selection.otherPlayerId;}
  if(eventNeedsItem(offer,choice)) {if(!offer.itemIds.includes(selection.itemId)) return null;action.itemId=selection.itemId;}
  if(eventNeedsStatus(offer,choice)) {if(!eventStatusOptions(offer,choice).includes(selection.statusId as StatusId)) return null;action.statusId=selection.statusId as StatusId;}
  if(choice!=='decline' && offer.id==='E45') {if(!eventFacts(offer,selection.itemId).includes(selection.fact as keyof typeof FACT_LABEL)) return null;action.fact=selection.fact as keyof typeof FACT_LABEL;}
  if(choice!=='decline' && offer.id==='E46') action.guess=selection.guess;
  return action;
}
export const replaceChoice=(choice:string)=>choice.startsWith('replace:')?choice.slice(8):null;
const choiceNames:Record<string,string>={pick:'เลือกพรหนึ่งอย่าง',accept:'ตกลง',decline:'ไม่รับ',stay:'ยึดประตูเดิม',switch:'ใช้ประตูอื่น',pay:'จ่ายเครดิต',debt:'รับความกระหายโลหิต',interest:'รับดอกเบี้ยเงา',seal:'ยอมปิดประตูครั้งหน้า',cash:'เลือกพ่อค้ารับเครดิต',condition:'เลือกพ่อค้าลดราคาแลกเงื่อนไข',fog:'ยอมรับหมอกราคา',careful:'ตรวจอย่างระวัง',force:'ฝืนตรวจ',price:'เลือกตาเห็นราคา',curse:'เลือกอ่านคำสาป',discount:'รับรางวัลส่วนลด',risk:'รับรางวัลลดการจับผิด',burden:'ยอมรับอุปกรณ์หนัก',repair:'ซ่อมเครื่อง',energy:'เลือกผลต่อพลัง',cleanse:'ล้างความกระหายโลหิต',item:'ยอมเสียสินค้าที่เลือก',oath:'สาบานห้ามต่อรอง',surrender:'สละสินค้าเพื่อถอนสัญญา',die:'รับผลตายและพักช่วงนี้'};
export const choiceName=(choice:string,survival=false)=>replaceChoice(choice)?t('แทนคำขอของ {name}',{name:npcName(replaceChoice(choice) as NpcId)??replaceChoice(choice)}):survival && choice==='die'?t('รับผลตายและเป็นผู้ชมจนจบ run'):t(choiceNames[choice]??choice);
const eventChoiceNames:Partial<Record<string,Record<string,string>>>={E42:{energy:'ฟื้นพลัง 2'},E48:{energy:'เสียพลัง 2',pay:'จ่ายค่าปรับ 2 เครดิต'},E49:{pay:'จ่าย 2 เครดิตให้ลืม'},E03:{pay:'จ่าย 2 เครดิต',debt:'จ่ายด้วยเลือด'},E37:{pay:'จ้างคนแบก',burden:'แบกเอง'},E10:{pay:'จ่ายค่าผ่าน',fog:'ผ่านฟรีในหมอก',switch:'เลี่ยงไปประตูอื่น'}};
/** Button and card title for one event choice; a few events name the same choice key differently. */
export const choiceTitle=(offer:EventOffer,choice:string,survival=false)=>loanItemCount(choice)?t('ให้ยืม {n} ชิ้น',{n:loanItemCount(choice)}):t(({purge:'ล้างผลเสียของฉัน','send-debuff':'ส่งผลเสียสุ่มให้ผู้เล่นอื่น','give-item':'ส่งสินค้าหนึ่งชิ้น','give-energy':'จ่ายพลัง 2'} as Record<string,string>)[choice]??eventChoiceNames[offer.id]?.[choice]??choiceName(choice,survival));
export function eventCost(game:AppraisalView,offer:EventOffer,choice:string,itemId:string):string {
  if(offer.npcTerms && choice!=='decline'){
    const term=offer.npcTerms,n=loanItemCount(choice);
    if(n)return t('ของที่เลือก {n} ชิ้นออกจากคลังชั่วคราว · พบ Alien ตั้งแต่ช่วง {next} รับของคืน + {lo}–{hi} เครดิต และฟื้นพลังสูงสุด {rlo}–{rhi}',{n,next:game.encounter+2,lo:4*n,hi:8*n,rlo:n,rhi:2*n});
    return [term.credits?t('{n} เครดิต',{n:term.credits}):'',term.energy || choice==='give-energy'?t('{n} พลัง',{n:term.energy+(choice==='give-energy'?2:0)}):'',term.life?t('{n} ชีวิต (เหลืออย่างน้อย 1)',{n:term.life}):'',term.items || choice==='give-item'?t('เสียสินค้าที่เลือก 1 ชิ้น'):''].filter(Boolean).join(' · ');
  }
  if(game.phase==='PORTALS' && ['E01','E08','E10'].includes(offer.id)) {
    const first=npcName(game.self.portals[0]!.npc);
    if(offer.id==='E08') {
      if(choice==='decline')return t('ไม่จ่ายเครดิตหรือพลัง · ประตูที่เปิดอยู่ยังเลือกได้ตามเดิม');
      const npc=NPC_SPECS[game.self.portals[choice==='cash'?0:1]!.npc];
      return `${choice==='cash'?t('จ่ายเครดิตอย่างเดียว ไม่มีส่วนลด'):t('ลด {d} เครดิตต่อการซื้อ · ต้องรับ {s}',{d:npc.discount,s:statusName(npc.condition)})} · ${t('ปิดประตูอื่นทั้งหมด')}`;
    }
    if(choice==='switch' || choice==='decline')return t('ไม่เสียเครดิตหรือพลัง · เข้า {npc} ไม่ได้ในช่วงนี้ เลือกพ่อค้าจากประตูอื่นที่เปิดอยู่',{npc:first});
    const cost=offer.id==='E01'?t('1 พลัง'):choice==='pay'?t('2 เครดิต'):t('รับหมอกราคา · ตรวจมูลค่าจริงไม่ได้จนหมดสถานะ');
    return `${cost} · ${t('เก็บสิทธิ์เลือก {npc} และประตูอื่นที่เปิดอยู่',{npc:first})}${game.self.portals[0]!.disabled?t(' · ประตูนี้ปิดอยู่แล้ว เหตุการณ์นี้ไม่เปิดประตูคืน'):''}`;
  }
  if(choice==='decline') return ['E01','E10'].includes(offer.id)?t('ประตูแรกจะถูกปิดในช่วงนี้'):t('ไม่จ่ายเครดิตหรือพลัง');
  const bond=bondOf(offer);
  if(bond) {
    const give=offer.giveItemId?eventItemName(offer,offer.giveItemId):'';
    if(bond.mode==='swap') return `${t('มอบ {give} · รับสินค้าที่เลือกฟรี · ไม่ใช้พลัง',{give})}${bond.genuineOnly?' · '+t('ของปลอมถูกปฏิเสธและรับ {s}',{s:statusName('D10')}):''}${bond.risk?` · ${t('เสี่ยง {p}% ถูกจับได้และรับ {s}',{p:bond.risk*100,s:statusName('D03')})}`:''}`;
    if(bond.mode==='sell') return t('ขายของที่เลือก รับ {n} เครดิต',{n:offer.quotedPrices[itemId]??0});
    if(bond.mode==='reveal') return bond.energyCost?t('{n} พลัง · ไม่ใช้สิทธิ์ตรวจ',{n:bond.energyCost}):t('ไม่ใช้พลังหรือสิทธิ์ตรวจ');
    return bond.mode==='tribute'?t('มอบของที่เลือกให้ NPC'):t('ไม่ต้องสละของ');
  }
  const energy=(n:number)=>t('{n} พลัง · ใช้สิทธิ์ตรวจ 1 ครั้ง',{n:Math.max(0,n+Number(hasStatus(game,'D01'))-Number(hasStatus(game,'B05')))});
  const item=game.self.stock.find(i=>i.id===itemId);
  const buying=['E09','E24','E27','E29','E30'].includes(offer.id);
  if(buying && item) {
    const discount=offer.id==='E29'?3:offer.id==='E30'?-2:2;
    return `${t('ซื้อของที่เลือก {n} เครดิต · {e}',{n:purchasePrice(game,[item],game.self.dealMode==='condition',discount),e:purchaseEnergy(game)===0?t('ไม่เสียพลัง'):t('{n} พลัง',{n:purchaseEnergy(game)})})}${game.self.dealMode==='condition'?` · ${t('รับ {s}',{s:statusName(item.condition.statusId)})}`:''}`;
  }
  const polish=POLISH_EVENTS[offer.id];
  if(polish) return [polish.credits?t('{n} เครดิต',{n:polish.credits}):'',polish.energy?t('{n} พลัง',{n:polish.energy}):'',polish.reward?t('รับ {n} เครดิต',{n:polish.reward}):'',...polish.grant.map(s=>t('รับ {s}',{s:statusName(s)}))].filter(Boolean).join(' · ');
  const fixed:Record<string,string>={
    E02:t('ไม่จ่ายทันที · รับความเสี่ยงงานประเมินพิเศษ'),E04:t('1 เครดิต'),E05:t('1 พลัง'),E06:t('สละสถานะที่เลือก แลกสถานะใหม่'),E07:t('ใช้หมด: อาหารที่เลือก'),
    E13:energy(1),E14:t('1 เครดิต'),E15:t('1 พลัง'),E16:energy(1),E17:`${t('2 เครดิต')} · ${energy(0)}`,E18:t('1 พลัง'),E19:t('เปิดผลตรวจของปลอม · รับ 1 เครดิต'),E20:energy(2),E22:t('1 เครดิต'),E23:t('1 พลัง'),
    E25:`${t('ใช้หมด: ของที่เลือก · รับสินค้าชิ้นแรกของร้าน · {e}',{e:purchaseEnergy(game)===0?t('ไม่เสียพลัง'):t('{n} พลัง',{n:purchaseEnergy(game)})})}${game.self.dealMode==='condition' && game.self.stock[0]?` · ${t('รับ {s}',{s:statusName(game.self.stock[0].condition.statusId)})}`:''}`,
    E26:t('2 เครดิต'),E28:t('2 เครดิต'),E31:t('1 พลัง · รับลมหายใจต้องสาป'),E32:t('ใช้หมด: ลูกแก้ว · 1 เครดิต'),E33:t('ใช้หมด: กุญแจเงา'),E34:t('สละ buff ที่เลือก'),E35:t('ใช้หมด: ยาชำระล้าง'),E36:t('1 พลัง'),E38:t('1 พลัง · รับตรานักโกง'),E39:t('1 พลัง · รับกระหายโลหิต'),E41:t('2 เครดิต'),
    E43:t('ไม่จ่าย · รับ 1 เครดิตเมื่อซื้อขายกับผู้เล่นสำเร็จ'),E45:t('เปิดข้อมูลที่เลือกให้ทุกคน · รับ 1 เครดิต'),E46:t('1 พลัง · ทายถูกได้ 2 เครดิต'),E47:t('ดูรายการข้ามร้าน · ไม่มีการโอนของ'),
    E108:t('ไม่เสียอะไร · เลือกผลดีหนึ่งอย่างจากสามตัวเลือก หมดเมื่อจบช่วงหน้า'),
    E73:t('พ่อค้าจำของที่ต้องการไว้ ขายให้ได้เมื่อพบกันอีก · ทำสัญญาใหม่เสียพลัง 2 ถ้ามีเต็ม 2 รายการต้องแทนรายการเก่า ราคาลดลงทุกช่วงแต่ไม่ต่ำกว่าราคาฐาน'),
    E84:t('1 พลัง · รับ เสียงกระซิบเหวลึก'),E85:t('1 เครดิต · รับ สายสัมพันธ์ของรัง'),E86:t('รับ 3 เครดิต · รับ ใยพันขา'),E87:t('2 พลัง · สุ่ม 50%: ได้ 6 เครดิตและ ลมหายใจใต้น้ำลึก หรือรับ แรงดันห้วงลึก'),E88:t('1 เครดิต · ล้างผลเสียที่เลือก'),
    E89:t('ไม่เสียอะไร · รับ ตาประกอบหลายเหลี่ยม แต่รับ หมอกวิกลจริต'),E90:t('ไม่เสียอะไร · รับ ฝูงหนุนหลัง แต่รับ พิษฝูง'),E91:t('2 พลัง (กติกาชีวิตเสียชีวิต 1) · รับ ไข่มุกนำโชค และ ลมหายใจใต้น้ำลึก แต่รับ น้ำเค็มกัดกร่อน'),
    E92:t('รับ 2 เครดิต · รับ กลิ่นรัง'),E93:t('1 พลัง · สุ่ม 60%: ได้ 1 เครดิตและ สายสัมพันธ์ของรัง หรือรับ ใยพันขา'),
  };
  if(offer.id==='E08') {
    const portal=game.self.portals[choice==='cash'?0:1];const npc=portal?NPC_SPECS[portal.npc]:null;
    return !npc?t('เลือกได้รายเดียว'):choice==='cash'?t('{npc} · จ่ายเครดิตอย่างเดียว',{npc:npcName(portal!.npc)}):t('{npc} · ลด {d} เครดิต แลก {s}',{npc:npcName(portal!.npc),d:npc.discount,s:statusName(npc.condition)});
  }
  if(offer.id==='E01') return choice==='stay'?t('1 พลัง'):t('ประตูแรกจะถูกปิด');
  if(offer.id==='E03') return choice==='pay'?t('2 เครดิต · ฟื้นพลังได้สูงสุด 3'):`${t('รับกระหายโลหิต · การฟื้นพลังถูกลดลง')}${game.survival?t(' · เสียชีวิต 1 · Collector ลดคะแนน 20% ขณะที่สถานะยังอยู่'):''}`;
  if(offer.id==='E10') return choice==='pay'?t('2 เครดิต'):choice==='fog'?t('รับหมอกราคา'):t('ประตูแรกจะถูกปิด');
  if(offer.id==='E11') return `${energy(choice==='careful'?2:1)}${choice==='force'?t(' · รับอ่อนล้า'):''}`;
  if(offer.id==='E12') return `${t('1 เครดิต')} · ${energy(0)}`;
  if(offer.id==='E21') return `${t('ซื้อทั้งคู่ {n} เครดิต · {e}',{n:purchasePrice(game,game.self.stock.slice(0,2),game.self.dealMode==='condition',2),e:purchaseEnergy(game)===0?t('ไม่เสียพลัง'):t('{n} พลัง',{n:purchaseEnergy(game)})})}${game.self.dealMode==='condition' && game.self.stock[0]?` · ${t('รับ {s}',{s:statusName(game.self.stock[0].condition.statusId)})}`:''}`;
  if(offer.id==='E37') return choice==='pay'?t('2 เครดิต'):t('รับอุปกรณ์หนัก');
  if(offer.id==='E40') return choice==='repair'?t('2 พลัง'):t('รับหมอกราคา');
  if(offer.id==='E42') return choice==='energy'?t('ฟื้นพลังได้สูงสุด 2'):t('ล้างกระหายโลหิต');
  if(offer.id==='E44') return t('ขายของที่เลือก รับ {n} เครดิต',{n:offer.quotedPrices[itemId]??0});
  if(offer.id==='E48') return choice==='pay'?t('2 เครดิต'):choice==='item'?t('เสียสินค้าที่เลือก · ประกันทรัพย์อาจป้องกัน'):t('เสียพลังไม่เกิน 2');
  if(offer.id==='E49') return choice==='pay'?t('2 เครดิต'):t('รับสาบานห้ามต่อรองถึงจบช่วงถัดไป');
  if(offer.id==='E50') return choice==='surrender'?t('เสียสินค้าที่เลือก · ถอนสัญญา'):game.survival?t('ชีวิตเป็น 0: เป็นผู้ชมจนจบ run · ของและเครดิตยังรอ Collector · สัญญาปลอดภัยอาจแทนด้วยเสียพลัง 2'):t('ตาย: พักช่วงนี้และได้คะแนนช่วงนี้ 0 · สัญญาปลอดภัยอาจแทนด้วยเสียพลัง 2');
  return fixed[offer.id]??t('ดูเงื่อนไขข้อเสนอด้านบน');
}
export function eventItemName(offer:EventOffer,id:string):string { const kind=offer.targetKinds[id];return kind?itemName(kind):t('สินค้าในผลตรวจเดิม'); }
export function inventoryLabel(game:AppraisalView,item:ItemView):string {return t('คลัง #{n} {name}',{n:game.self.inventory.findIndex(i=>i.id===item.id)+1,name:itemName(item.kind)});}
export function defaultConsequence(offer:EventOffer|null):string|null {
  if(!offer || offer.choices.includes('decline')) return null;
  return offer.choices.includes('pay')?t('หากจบช่วงหรือหมดเวลา จะจ่ายค่าปรับ 2 เครดิต'):offer.choices.includes('oath')?t('หากจบช่วงหรือหมดเวลา จะรับสาบานห้ามต่อรอง'):offer.choices.includes('die')?t('หากจบช่วงหรือหมดเวลา จะรับผลตายตามสัญญา Dark One'):offer.choices.includes('energy')?t('หากจบช่วงหรือหมดเวลา จะเสียพลังไม่เกิน 2'):t('หากจบช่วงหรือหมดเวลา จะเสียสินค้าชิ้นแรก');
}

/** Shop items you appraised that are still unsold; they need buy, NPC penalty or Dark Market consignment. */
export function unsoldItems(game:AppraisalView):ItemView[] {
  return game.brokerage?game.self.stock.filter(item=>item.appraisal!==null && item.owner.startsWith('npc:')):[];
}
export const unsoldPenaltyText=(item:ItemView)=>npcUnsoldText(item.npc);
export const consignText=()=>t('{clean}% ไม่มีผล · {debuff}% รับ debuff สุ่มหนึ่งอย่าง · {fee}% เสียค่าผ่านทาง {credits} เครดิตเท่าที่มี · ของเข้าคลังรอประมูล',{clean:CONSIGN_RULES.cleanBelow*100,debuff:(CONSIGN_RULES.debuffBelow-CONSIGN_RULES.cleanBelow)*100,fee:Math.round((1-CONSIGN_RULES.debuffBelow)*100),credits:CONSIGN_RULES.fee});

/** One line telling the player what this phase is for; the HUD shows it under the phase title. */
export function phaseHint(phase:AppraisalView['phase']):string {
  const hints:Record<AppraisalView['phase'],string>={
    PORTALS:'เลือกพ่อค้าหนึ่งรายที่จะเชิญมาที่โต๊ะ',
    APPRAISAL:'ตรวจของ → ตีราคา → ตัดสินใจซื้อ',
    TRADE:'ขายหรือแลกของกับเพื่อน จัดการของค้างโต๊ะ แล้วรับเครดิตเติมก่อนพบพ่อค้าช่วงถัดไป',
    REVEAL:'จบช่วงซื้อขายนี้แล้ว รับเครดิตเติม หรือเสี่ยงหัวก้อยพร้อมผลของสะสม ก่อนเลือกประตูครั้งถัดไป',
    RESULTS:'จบการเดินทาง ดูคะแนนสุดท้าย',
  };
  return t(hints[phase]);
}
export interface Outcome { tone:'good'|'bad'|'info'; title:string; lines:string[] }
/** Notes are an append-only window capped by the engine; return only the ones added since `prev`. */
export function appendedNotes(prev:string[],next:string[]):string[] {
  for(let k=Math.min(prev.length,next.length);k>0;k--) if(next.slice(0,k).every((note,i)=>note===prev[prev.length-k+i])) return next.slice(k);
  return next;
}
// Engine notes are still written in Thai on the server, so these patterns read the Thai text in either language.
const BAD_NOTE=/ทายผิด|จับได้|ปฏิเสธ|ขายไม่ออก|ไม่ยอมแลก|ทิ้ง|ค่าผ่านทาง|ไม่ออกฤทธิ์|คำสาปทำงาน/;
const GOOD_NOTE=/ทายถูก|ยอมรับราคา|ชนะ|เงียบ ๆ|ของแท้ ไม่มีคำสาป/;
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
    const a=before.get(id)?.knowledge;const b=item.knowledge;const name=itemName(item.kind);if(!a) continue;
    if(a.genuine===undefined && b.genuine!==undefined){lines.push(`${name}: ${b.genuine?t('ของแท้'):t('ของปลอม')}`);if(b.genuine)good++;else bad++;}
    if(a.cursed===undefined && b.cursed!==undefined){lines.push(`${name}: ${b.cursed?t('มีคำสาป'):t('ไม่มีคำสาป')}`);if(b.cursed)bad++;else good++;}
    if(a.base===undefined && b.base!==undefined) lines.push(t('{name}: มูลค่าจริง {n} เครดิต',{name,n:b.base}));
    else if(b.base===undefined && b.range && (a.range?.[0]!==b.range[0] || a.range?.[1]!==b.range[1])) lines.push(t('{name}: มูลค่าอยู่ช่วง {a}–{b} เครดิต',{name,a:b.range[0],b:b.range[1]}));
    if(!a.effectsKnown && b.effectsKnown) lines.push(t('{name}: รู้ผลเมื่อเปิดใช้แล้ว',{name}));
    if(a.certificate===undefined && b.certificate!==undefined) lines.push(t('{name}: ใบรับรอง{v}',{name,v:b.certificate?t('พูดจริง'):t('เป็นเท็จ')}));
    if(!a.activationKnown && b.activationKnown && !n.activated.includes(id)) lines.push(t('{name}: รู้จังหวะที่ผลทำงานแล้ว',{name}));
    if(!a.comparison && b.comparison) lines.push(t('{name} มีมูลค่าสูงกว่า',{name:b.comparison===id?name:after.get(b.comparison)?itemName(after.get(b.comparison)!.kind):t('อีกชิ้น')}));
  }
  reveals=lines.length;
  if(!p.caught && n.caught){lines.push(t('พ่อค้าจับได้ว่าคุณกดราคา'));bad+=2;}
  const gained=n.inventory.filter(i=>!p.inventory.some(x=>x.id===i.id));
  const lost=p.inventory.filter(i=>!n.inventory.some(x=>x.id===i.id));
  for(const item of gained){lines.push(p.npcContracts?.alien?.itemIds.includes(item.id)?t('Alien คืน {name}',{name:itemName(item.kind)}):t('ได้ {name}',{name:itemName(item.kind)}));good++;}
  const credits=n.credits-p.credits,energy=n.energy-p.energy,life=(n.life??0)-(p.life??0);
  for(const item of lost){const lent=!!n.npcContracts?.alien?.itemIds.includes(item.id);lines.push(lent?t('ให้ Alien ยืม {name}',{name:itemName(item.kind)}):t('เสีย {name}',{name:itemName(item.kind)}));if(!lent && credits<=0)bad++;}
  const had=new Set(p.statuses.map(s=>s.id)),has=new Set(n.statuses.map(s=>s.id));
  for(const st of n.statuses) if(!had.has(st.id)){lines.push(t('ได้รับ {name}',{name:statusName(st.id)}));if(st.id.startsWith('D'))bad++;else good++;}
  for(const st of p.statuses) if(!has.has(st.id)){lines.push(t('หมดผล {name}',{name:statusName(st.id)}));if(st.id.startsWith('D'))good++;}
  for(const tr of next.trades) {
    const old=prev.trades.find(o=>o.id===tr.id);
    if(!old && tr.sellerId===n.id && tr.status==='open') lines.push(t('มีข้อเสนอซื้อ {name} {n} เครดิต',{name:itemName(tr.item.kind),n:tr.credits}));
    if(old?.status==='open' && tr.status!=='open' && tr.buyerId===n.id) {lines.push(tr.status==='accepted'?t('ข้อเสนอซื้อ {name} สำเร็จ',{name:itemName(tr.item.kind)}):t('ข้อเสนอซื้อ {name} ถูกปฏิเสธ',{name:itemName(tr.item.kind)}));if(tr.status==='accepted')good++;}
  }
  for(const lot of next.market.lots??[]) {
    const old=prev.market.lots?.find(l=>l.id===lot.id);
    if(old && old.winnerId===undefined && lot.winnerId!==undefined && lot.yourBid!==null) {lines.push(lot.winnerId===n.id?t('ชนะประมูล {name} ที่ {n} เครดิต',{name:itemName(lot.item.kind),n:lot.price??0}):t('แพ้ประมูล {name}',{name:itemName(lot.item.kind)}));if(lot.winnerId===n.id)good++;}
  }
  if(credits){lines.push(signed(credits,t('เครดิต')));if(credits>0)good++;}
  if(energy) lines.push(signed(energy,t('พลัง')));
  if(life){lines.push(signed(life,t('ชีวิต')));if(life<0)bad+=2;else good++;}
  for(const note of notes){if(BAD_NOTE.test(note))bad+=2;else if(GOOD_NOTE.test(note))good+=2;}
  const phaseChanged=prev.phase!==next.phase || prev.encounter!==next.encounter;
  if(!phaseChanged && !lines.length && !notes.length) return null;
  const tone=bad>good?'bad':good>bad?'good':'info';
  if(phaseChanged) return {tone:life<0?'bad':'info',title:next.phase==='REVEAL'?t('รับเครดิตหลังซื้อขายช่วง {n}',{n:next.encounter}):`${phaseLabel(next.phase)}${next.phase==='PORTALS'?t(' · ช่วง {n}',{n:next.encounter}):''}`,lines:[phaseHint(next.phase),...notes,...lines]};
  const activated=n.activated.find(id=>!p.activated.includes(id));
  const resolved=p.eventOffer && n.eventOffer?.key!==p.eventOffer.key?eventText(p.eventOffer.id).name:undefined;
  const activatedName=activated?(after.get(activated)??before.get(activated)):undefined;
  const title=notes[0]??(resolved?resolved:activated?t('เปิดใช้ {name}',{name:activatedName?itemName(activatedName.kind):t('สินค้า')}):gained[0]?t('ได้ {name}',{name:itemName(gained[0].kind)}):lost[0]?(credits>0?t('ขาย {name}',{name:itemName(lost[0].kind)}):t('เสีย {name}',{name:itemName(lost[0].kind)})):reveals?t('ผลการตรวจ'):t('ผลการกระทำ'));
  return {tone,title,lines:[...notes.slice(1),...lines.filter(line=>line!==title)]};
}
