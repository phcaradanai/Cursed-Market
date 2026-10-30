import {randomAt} from '../random.js';
import {startTracking,guessTracking} from './ghost-tracking.js';
import type {Tracking} from './ghost-tracking.js';
import type {AppraisalState,AppraisalItem,ItemKind} from './types.js';
import {check,player,spend} from './mechanics.js';
import {ensureItemAppearance} from './rarity.js';
import {recordItemTrade} from './price-integrity.js';
export type GhostAction = {type:'ghost-start';startedAt?:number}|{type:'ghost-guess';round:number;position:number}|{type:'ghost-hire';ghostId:string;choice:number;quoteId:string;fee:number}|{type:'ghost-accept';jobId:string;accept:boolean}|{type:'ghost-rps';slot:number;hand:'rock'|'paper'|'scissors'}|{type:'ghost-deliver';jobId:string;slot:number};
export interface GhostJob {id:string;buyerId:string;kind:ItemKind;price:number;base:number;fee:number;status:'offered'|'accepted'|'delivered'|'cancelled';prototype?:AppraisalItem;round?:number}
export interface GhostState {round:number;available:boolean;startedAt?:number;tracking?:Tracking;swaps:[number,number][];encounter:number;slots:{kind:ItemKind;lost:boolean}[];jobs:GhostJob[];bonus:number;draws:number;lastRps?:{slot:number;hand:string;opponent:string;result:string}}
const active=(j:GhostJob)=>j.status==='offered'||j.status==='accepted';
function draw(s:AppraisalState,g:GhostState,label:string){return randomAt(s.seed,`ghost:${label}:${g.round}:${g.draws++}`);}
function kinds(s:AppraisalState){return [...new Set(Object.values(s.items).map(i=>i.kind))];}
function sample(s:AppraisalState,g:GhostState,id:string){const all=kinds(s);return all[Math.floor(draw(s,g,id)*all.length)]!;}
function resetSlots(s:AppraisalState,g:GhostState,id:string){g.encounter=s.encounter;delete g.lastRps;g.slots=Array.from({length:3},()=>({kind:sample(s,g,id),lost:false}));}
export function ghostQuotes(s:AppraisalState,ghostId:string,buyerId:string){
 const all=kinds(s),g=s.ghosts?.[ghostId];if(!g?.available)return [];
 return [...all].sort((a,b)=>randomAt(s.seed,`ghost-quote:${s.encounter}:${ghostId}:${buyerId}:${a}`)-randomAt(s.seed,`ghost-quote:${s.encounter}:${ghostId}:${buyerId}:${b}`)).slice(0,3).map(kind=>{
  const prototype=structuredClone(Object.values(s.items).find(i=>i.kind===kind)!);ensureItemAppearance(s,prototype);const base=prototype.base;
  const price=Math.ceil(base*.9)+Math.floor(randomAt(s.seed,`ghost-price:${s.encounter}:${ghostId}:${buyerId}:${kind}`)*(Math.floor(base*1.2)-Math.ceil(base*.9)+1));
  return {id:`${s.encounter}:${g.round}:${ghostId}:${buyerId}:${kind}:${price}`,kind,base,prototype,price};
 });
}
function handleGhostCommand(s:AppraisalState,id:string,a:GhostAction){
 check(s.config.survival&&s.phase!=='RESULTS','ghost-phase','โลกวิญญาณปิดแล้ว');
 const p=player(s,id);s.ghosts??={};
 if(a.type==='ghost-hire'){
  check(p.life!==0,'ghost-alive','เฉพาะผู้มีชีวิตจ้างงานได้');const g=s.ghosts[a.ghostId];check(g?.available,'ghost-unavailable','วิญญาณยังไม่เปิดรับงาน');
  check(!g.jobs.some(j=>j.buyerId===id&&active(j)),'ghost-job','มีงานค้างอยู่แล้ว');check(Number.isSafeInteger(a.fee)&&a.fee>=0,'ghost-fee','ค่าจ้างไม่ถูกต้อง');
  const q=ghostQuotes(s,a.ghostId,id)[a.choice];check(Number.isInteger(a.choice)&&q,'ghost-choice','เลือกสินค้าที่เสนอ');check(a.quoteId===q.id,'ghost-quote','ข้อเสนอเปลี่ยนแล้ว กรุณาเลือกใหม่');check(p.credits>=q.price+a.fee,'credits','เครดิตไม่พอสำหรับราคาที่ตกลง');
  const {id:_quoteId,...terms}=q;g.jobs.push({...terms,id:`ghost-${a.ghostId}-${g.round}-${g.jobs.length}`,buyerId:id,fee:a.fee,status:'offered',round:g.round});return;
 }
 check(p.life===0,'ghost-dead','ต้องหมดชีวิตก่อนเข้าโลกวิญญาณ');
 const g=s.ghosts[id]??={round:0,available:false,swaps:[],encounter:s.encounter,slots:[],jobs:[],bonus:0,draws:0};
 if(a.type==='ghost-start'){
  check(g.tracking?.status!=='guessing'&&!g.available&&!g.jobs.some(active),'ghost-busy','กำลังเปิดบริการหรือมีงานค้าง');check(a.startedAt===undefined||Number.isSafeInteger(a.startedAt)&&a.startedAt>=0,'ghost-clock','เวลามินิเกมไม่ถูกต้อง');g.startedAt=a.startedAt??0;g.round++;g.swaps=[];const order=[0,1,2,3];
  for(let n=0;n<6;n++){const x=Math.floor(draw(s,g,id)*4),y=(x+1+Math.floor(draw(s,g,id)*3))%4;g.swaps.push([x,y]);[order[x],order[y]]=[order[y]!,order[x]!];}
  g.tracking=startTracking(order,0);return;
 }
 if(a.type==='ghost-guess'){
  check(g.tracking&&a.round===g.round,'ghost-round','รอบการ์ดผ่านไปแล้ว');g.tracking=guessTracking(g.tracking,a.position);g.available=g.tracking.status==='available';if(g.available)resetSlots(s,g,id);return;
 }
 check(g.available,'ghost-locked','ชนะมินิเกมก่อน');
 if(a.type==='ghost-accept') {const j=g.jobs.find(j=>j.id===a.jobId);check(j?.status==='offered','ghost-job','ข้อเสนอนี้ผ่านไปแล้ว');check(player(s,j.buyerId).life!==0,'ghost-buyer','ผู้ว่าจ้างหมดชีวิตแล้ว');j.status=a.accept?'accepted':'cancelled';if(!g.jobs.some(active)&&g.jobs.some(job=>job.round===g.round&&job.status==='delivered')){g.available=false;delete g.tracking;}return;}
 if(g.encounter!==s.encounter)resetSlots(s,g,id);
 const slot=g.slots[a.slot];check(Number.isInteger(a.slot)&&slot,'ghost-slot','ช่องสินค้าไม่ถูกต้อง');
 if(a.type==='ghost-rps'){
  check(!slot.lost,'ghost-lost','ช่องนี้แพ้แล้ว รอช่วงหน้า');check(g.jobs.some(j=>j.status==='accepted'),'ghost-job','รับงานก่อนตามหาของ');
  const hands=['rock','paper','scissors'],h=hands.indexOf(a.hand);check(h>=0,'ghost-hand','มือไม่ถูกต้อง');const opponent=Math.floor(draw(s,g,id)*3),result=h===opponent?'tie':(h-opponent+3)%3===1?'won':'lost';
  if(result==='lost')slot.lost=true;if(result==='won')slot.kind=sample(s,g,id);g.lastRps={slot:a.slot,hand:a.hand,opponent:hands[opponent]!,result};return;
 }
 const j=g.jobs.find(j=>j.id===a.jobId);check(j?.status==='accepted'&&j.kind===slot.kind,'ghost-target','ซื้อได้เฉพาะของตามงาน');const buyer=player(s,j.buyerId);check(buyer.life!==0,'ghost-buyer','ผู้ว่าจ้างหมดชีวิตแล้ว');check(buyer.credits>=j.price+j.fee,'credits','รอผู้ว่าจ้างเติมเครดิตก่อนส่งมอบ');
 const source=j.prototype??Object.values(s.items).find(i=>i.kind===j.kind)!;const itemId=`delivery-${j.id}`;check(!s.items[itemId],'ghost-duplicate','ส่งของแล้ว');
 s.items[itemId]={id:itemId,kind:j.kind,base:j.base,genuine:randomAt(s.seed,`${itemId}:genuine`)<.75,cursed:randomAt(s.seed,`${itemId}:curse`)<.35,ask:j.price,owner:buyer.id,npcOwnerId:buyer.id,npc:source.npc,encounter:s.encounter,lastAppraisal:null,lastAccepted:null,certificate:false,reservation:1,...(source.appearance?{appearance:structuredClone(source.appearance)}:{}),...(source.rarityPower?{rarityPower:structuredClone(source.rarityPower)}:{})};buyer.inventory.push(itemId);
 const commission=Math.floor(j.base*.1);spend(s,buyer,j.price+j.fee,0,'ghost-delivery');buyer.paid={...buyer.paid,[itemId]:j.price+j.fee};recordItemTrade(s,s.items[itemId]!,j.price);g.bonus+=commission+j.fee;j.status='delivered';g.slots[a.slot]={kind:sample(s,g,id),lost:false};
 if(!g.jobs.some(active)){g.available=false;delete g.tracking;}
 s.trace.push({type:'ghost-delivery',encounter:s.encounter,playerId:id,details:{buyerId:buyer.id,itemId,price:j.price,fee:j.fee,bonus:commission+j.fee}});
}
export function ghostView(s:AppraisalState,id:string){
 const mine=s.ghosts?.[id]?structuredClone(s.ghosts[id]):undefined;if(mine?.available&&mine.encounter!==s.encounter)resetSlots(s,mine,id);return {services:Object.entries(s.ghosts??{}).map(([ghostId,g])=>({ghostId,available:g.available,quotes:ghostQuotes(s,ghostId,id).map(({base:_base,prototype:_prototype,...quote})=>quote)})),jobs:Object.entries(s.ghosts??{}).flatMap(([ghostId,g])=>g.jobs.filter(j=>id===ghostId||j.buyerId===id).map(({base:_base,prototype:_prototype,...j})=>({...j,ghostId}))),...(mine?{self:{startedAt:mine.startedAt??0,cards:kinds(s).slice(0,4),round:mine.round,available:mine.available,swaps:mine.swaps,tracking:mine.tracking?.status,slots:mine.slots,encounter:mine.encounter,bonus:mine.bonus,...(mine.lastRps?{lastRps:mine.lastRps}:{})}}:{})};
}

export function handleGhostAction(state:AppraisalState,id:string,action:GhostAction){
 reconcileGhostJobs(state);
 switch(action.type){
  case 'ghost-start': case 'ghost-guess': case 'ghost-hire': case 'ghost-accept': case 'ghost-rps': case 'ghost-deliver': return handleGhostCommand(state,id,action);
  default: throw new Error('Unknown spirit action');
 }
}

export function reconcileGhostJobs(state:AppraisalState){
 for(const g of Object.values(state.ghosts??{})){
  let cancelled=false;
  for(const job of g.jobs)if(active(job)&&player(state,job.buyerId).life===0){job.status='cancelled';cancelled=true;}
  if(cancelled&&!g.jobs.some(active)){g.available=false;delete g.tracking;}
 }
}
