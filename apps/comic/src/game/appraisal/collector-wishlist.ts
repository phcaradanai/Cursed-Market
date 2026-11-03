import {recordPersonalItemActivity} from './personal-scoring.js';
import {randomAt} from '../random.js';
import {rarityValue} from '../../shared/rarity-power.js';
import {ITEM_SPECS,merchantKinds,priceRange,itemImage} from './content.js';
import {anchorOf} from './core2.js';
import {activeNpcs} from './pulse.js';
import {ensureItemAppearance} from './rarity.js';
import {check,consumeStatus,purchaseModifiers,spend,trace} from './mechanics.js';
import {merchantTradeBanned} from './theft.js';
import {recordItemTrade} from './price-integrity.js';
import type {AppraisalState,Appraiser,ItemKind,NpcId,AppraisalItem} from './types.js';
import type {Rarity} from '../../shared/item-rarity.js';

export type CollectorWishlistAction=
 | {type:'collector-wish-request';kinds:ItemKind[]}
 | {type:'collector-wish-peek';batchId:string;slotId:string}
 | {type:'collector-wish-buy';batchId:string;slotId:string;quoteId:string}
 | {type:'collector-wish-skip';batchId?:string};
interface Pending {id:string;kinds:ItemKind[];requestedAt:number;dueAt:number}
interface Offer {id:string;encounter:number;itemIds:string[];rawQuote:number;peek?:number;status:'open'|'bought'|'skipped'|'expired'|'cancelled'}
export interface CollectorWishlistState {lastWindowAt:number;pending?:Pending;offer?:Offer}
export interface CollectorWishlistView {
 request:{available:boolean;kinds:Array<{kind:ItemKind;name:string;image:string}>;dueAt:number};
 pending?:Pending;
 delivery?:{id:string;quoteId:string;status:Offer['status'];cost:{price:number;fee:number;total:number;energy:number};canPeek:boolean;canBuy:boolean;reason?:string;slots:Array<{id:string;peek?:{kind:ItemKind;name:string;image:string;rarity?:Rarity}}>};
}
const prefix='collector-wishlist:';
const note=(p:Appraiser,text:string)=>{p.notes.push(text);p.notes=p.notes.slice(-30);};
const quoteKey=(offer:Offer,quote:ReturnType<typeof cost>)=>`${offer.id}:${quote.price}:${quote.fee}:${quote.energy}`;
function pool(state:AppraisalState):Map<ItemKind,NpcId>{const map=new Map<ItemKind,NpcId>();for(const npc of activeNpcs(state.config))for(const kind of merchantKinds(npc,state.config.catalogVersion??1,!!state.config.cleanse,!!state.config.challenge,!!state.config.expansion,!!state.config.polish,!!state.config.trustAbilities))if(!map.has(kind))map.set(kind,npc);return map;}
const alive=(p:Appraiser)=>p.life!==0&&p.paused!=='dead';
const phaseWindow=(state:AppraisalState)=>state.phase==='PORTALS'||state.phase==='APPRAISAL';
function interactive(state:AppraisalState,p:Appraiser):boolean{return phaseWindow(state)&&alive(p)&&!p.done&&!p.paused&&!p.eventOffer&&!p.abilityChoice&&!state.theftDuels?.some(d=>d.status==='open'&&[d.thiefId,d.victimId].includes(p.id));}
function available(state:AppraisalState,p:Appraiser):boolean{const s=state.collectorWishes?.[p.id];return interactive(state,p)&&state.encounter%2===0&&!!s&&s.lastWindowAt!==state.encounter&&!s.pending&&s.offer?.status!=='open'&&pool(state).size>=5;}
export function collectorCanWithdraw(state:AppraisalState,p:Appraiser):boolean{return state.config.collectorWishlistRules===1&&interactive(state,p)&&state.collectorWishes?.[p.id]?.offer?.status==='open';}
function cost(state:AppraisalState,p:Appraiser,raw:number){const m=purchaseModifiers(state,p),price=Math.max(1,Math.floor(raw-m.discount)),fee=m.fee;return {price,fee,total:price+fee,energy:Math.max(0,(state.config.freeBuy?0:1)+m.energyAdjustment)};}
function closeOffer(state:AppraisalState,p:Appraiser,status:Offer['status']):void{const offer=state.collectorWishes?.[p.id]?.offer;if(!offer||offer.status!=='open')return;for(const id of offer.itemIds){const item=state.items[id]!;if(item.owner===prefix+offer.id)item.owner='removed';}offer.status=status;if(status!=='bought')note(p,`Collector ปิดชุด ${offer.id}: ${status==='skipped'?'ข้ามชุด':status==='expired'?'หมดสิทธิ์ช่วงนี้':'ยกเลิกชุด'}`);trace(state,p,'collector-wish-'+status,{batchId:offer.id});}
export function closeCollectorWishlists(state:AppraisalState):void{if(state.config.collectorWishlistRules!==1)return;for(const p of state.players){const s=state.collectorWishes?.[p.id];if(!s)continue;closeOffer(state,p,'cancelled');if(s.pending){note(p,`Collector ยกเลิกคำขอ ${s.pending.id} เพราะจบเกม`);trace(state,p,'collector-wish-cancelled',{batchId:s.pending.id,dueAt:s.pending.dueAt});delete s.pending;}}}
function deliver(state:AppraisalState,p:Appraiser,s:CollectorWishlistState):void{
 const pending=s.pending!,kinds=pool(state),rest=[...kinds.keys()].filter(k=>!pending.kinds.includes(k)).sort((a,b)=>randomAt(state.seed,`${pending.id}:extra:${a}`)-randomAt(state.seed,`${pending.id}:extra:${b}`)||a.localeCompare(b));
 const selected=[...pending.kinds,...rest.slice(0,2)].sort((a,b)=>randomAt(state.seed,`${pending.id}:slot:${a}`)-randomAt(state.seed,`${pending.id}:slot:${b}`)||a.localeCompare(b));
 check(selected.length===5&&new Set(selected).size===5,'collector-pool','คลังสินค้าสำหรับ Collector ไม่พอ');
 const itemIds=selected.map((kind,index)=>{const id=`${pending.id}-item-${index}`,npc=kinds.get(kind)!;check(npc,'collector-pool','ชนิดสินค้านี้ไม่มีในรัน');const anchor=anchorOf(state.config,kind),range=priceRange(kind,anchor),base=range[0]+Math.floor(randomAt(state.seed,`${id}:base`)*(range[1]-range[0]+1)),ask=Math.max(1,anchor-2+Math.floor(randomAt(state.seed,`${id}:ask`)*6));
  const item:AppraisalItem={id,kind,npc,npcOwnerId:p.id,encounter:state.encounter,base,ask,reservation:ask,genuine:randomAt(state.seed,`${id}:genuine`)<.75,cursed:randomAt(state.seed,`${id}:curse`)<.35,certificate:randomAt(state.seed,`${id}:certificate`)<.65,lastAppraisal:null,lastAccepted:null,owner:prefix+pending.id};ensureItemAppearance(state,item);state.items[id]=item;return id;});
 const rawQuote=Math.max(1,Math.ceil(itemIds.reduce((n,id)=>n+rarityValue(state.items[id]!,anchorOf(state.config,state.items[id]!.kind)),0)/5));s.offer={id:pending.id,encounter:state.encounter,itemIds,rawQuote,status:'open'};delete s.pending;note(p,`Collector ส่งชุด ${s.offer.id} มาแล้ว 5 ช่อง ราคาต้นทุนร่วม ${rawQuote} เครดิต`);trace(state,p,'collector-wish-delivered',{batchId:s.offer.id,rawQuote});
}
export function reconcileCollectorWishlist(state:AppraisalState):void{
 if(state.config.collectorWishlistRules!==1)return;state.collectorWishes??={};
 if(state.phase==='RESULTS'){closeCollectorWishlists(state);return;}
 for(const p of state.players){if(!Object.hasOwn(state.collectorWishes,p.id))state.collectorWishes[p.id]={lastWindowAt:0};const s=state.collectorWishes[p.id]!;
  if(!alive(p)){closeOffer(state,p,'cancelled');if(s.pending){note(p,`Collector ยกเลิกคำขอ ${s.pending.id} เพราะเสียชีวิต`);trace(state,p,'collector-wish-cancelled',{batchId:s.pending.id,reason:'dead'});delete s.pending;}continue;}
  if(s.pending&&s.pending.dueAt<=state.encounter){if(s.pending.dueAt===state.encounter)deliver(state,p,s);else {note(p,`Collector ปิดคำขอ ${s.pending.id} เพราะเลยช่วงส่งของ`);trace(state,p,'collector-wish-expired',{batchId:s.pending.id});delete s.pending;}}
  if(!phaseWindow(state)||state.phase==='APPRAISAL'&&p.done){if(s.offer?.status==='open')closeOffer(state,p,'expired');if(state.encounter%2===0)s.lastWindowAt=state.encounter;}
 }
}
export function collectorWishlistView(state:AppraisalState,p:Appraiser):CollectorWishlistView|undefined{
 if(state.config.collectorWishlistRules!==1||!alive(p)||pool(state).size<5)return;const s=state.collectorWishes?.[p.id];const offer=s?.offer;
 const delivery=offer?(()=>{const quote=cost(state,p,offer.rawQuote),open=offer.status==='open'&&interactive(state,p),reason=!open?'phase':merchantTradeBanned(state,p)?'merchant-banned':p.credits<quote.total?'credits':p.energy<quote.energy?'energy':undefined;
 return {id:offer.id,quoteId:quoteKey(offer,quote),status:offer.status,cost:quote,canPeek:open&&offer.peek===undefined&&p.credits>=quote.total,canBuy:open&&reason===undefined,...(reason?{reason}:{}),slots:offer.itemIds.map((id,index)=>{const item=state.items[id]!;return {id:`s${index}`,...(offer.peek===index?{peek:{kind:item.kind,name:ITEM_SPECS[item.kind].name,image:itemImage(item.kind),...(item.appearance?{rarity:item.appearance.rarity}:{})}}:{})};})};})():undefined;
 return {request:{available:available(state,p),kinds:[...pool(state).keys()].map(kind=>({kind,name:ITEM_SPECS[kind].name,image:itemImage(kind)})),dueAt:state.encounter+2},...(s?.pending?{pending:structuredClone(s.pending)}:{}),...(delivery?{delivery}:{})};
}
export function handleCollectorWishlist(state:AppraisalState,p:Appraiser,action:CollectorWishlistAction):void{
 check(state.config.collectorWishlistRules===1&&interactive(state,p),'collector-window','ช่วงนี้ยังใช้บริการ Collector ไม่ได้');const s=state.collectorWishes?.[p.id];check(s,'collector-window','ยังไม่มีสิทธิ์ Collector');
 if(action.type==='collector-wish-request'){check(available(state,p),'collector-window','ยังส่งคำขอใหม่ไม่ได้');check(Array.isArray(action.kinds)&&action.kinds.length===3&&new Set(action.kinds).size===3&&action.kinds.every(k=>typeof k==='string'&&pool(state).has(k)),'collector-kinds','เลือกสินค้า 3 ชนิดที่ไม่ซ้ำกัน');s.pending={id:`cw-${p.id}-${state.encounter}`,kinds:[...action.kinds],requestedAt:state.encounter,dueAt:state.encounter+2};s.lastWindowAt=state.encounter;note(p,`ขอ Collector: ${action.kinds.map(k=>ITEM_SPECS[k].name).join(' / ')} รับช่วง ${s.pending.dueAt}`);trace(state,p,'collector-wish-requested',{batchId:s.pending.id,kinds:[...action.kinds],dueAt:s.pending.dueAt});return;}
 if(action.type==='collector-wish-skip'&&action.batchId===undefined){check(available(state,p),'collector-window','ยังข้ามคำขอไม่ได้');s.lastWindowAt=state.encounter;note(p,`ข้ามการส่งรายการ Collector ช่วง ${state.encounter}`);trace(state,p,'collector-wish-request-skipped',{});return;}
 const offer=s.offer;check(offer&&offer.status==='open'&&action.batchId===offer.id,'collector-batch','ชุด Collector นี้ไม่พร้อมแล้ว');if(action.type==='collector-wish-skip'){closeOffer(state,p,'skipped');return;}
 const index=offer.itemIds.findIndex((_,n)=>action.slotId===`s${n}`);check(index>=0,'collector-slot','ช่องสินค้าไม่ถูกต้อง');const quote=cost(state,p,offer.rawQuote);check(p.credits>=quote.total,'credits','เครดิตในกระเป๋าไม่พอ');
 if(action.type==='collector-wish-peek'){check(offer.peek===undefined,'collector-peek','เปิดดูชุดนี้แล้ว');offer.peek=index;note(p,`เปิดดู Collector ช่อง ${index+1}: ${ITEM_SPECS[state.items[offer.itemIds[index]!]!.kind].name}`);trace(state,p,'collector-wish-peeked',{batchId:offer.id,slotId:action.slotId});return;}
 check(action.quoteId===quoteKey(offer,quote),'collector-quote','ต้นทุนเปลี่ยนแล้ว กรุณาตรวจและยืนยันราคาใหม่');const item=state.items[offer.itemIds[index]!]!;check(item.owner===prefix+offer.id,'collector-owner','สินค้าชุดนี้ไม่พร้อมแล้ว');
 check(!merchantTradeBanned(state,p),'merchant-banned','ยังถูกห้ามค้าขายกับพ่อค้า');spend(state,p,quote.total,quote.energy,'collector-purchase');for(const id of ['B03','D06','D12'] as const)consumeStatus(p,id);
 item.owner=p.id;p.inventory.push(item.id);p.paid={...p.paid,[item.id]:quote.price};recordItemTrade(state,item,quote.price);recordPersonalItemActivity(state,p,'bought',item,1,quote.price>0,'zero-credit purchase');closeOffer(state,p,'bought');note(p,`ซื้อ ${ITEM_SPECS[item.kind].name} จาก Collector ${offer.id}: สินค้า ${quote.price} + ค่าธรรมเนียม ${quote.fee} เครดิต ใช้ ${quote.energy} พลัง`);trace(state,p,'collector-wish-purchased',{batchId:offer.id,itemId:item.id,slotId:action.slotId,...quote});
}
export function assertCollectorWishlistInvariants(state:AppraisalState):void{
 check((state.config.collectorWishlistRules===1)===!!state.collectorWishes,'collector-state','สถานะ Collector ไม่ตรงกติกา');if(!state.collectorWishes)return;check(Object.keys(state.collectorWishes).length===state.players.length&&state.players.every(p=>Object.hasOwn(state.collectorWishes!,p.id)),'collector-state','สิทธิ์ Collector ไม่ครบผู้เล่น');const escrow=new Set<string>();
 for(const [id,s] of Object.entries(state.collectorWishes??{})){check(state.players.some(p=>p.id===id)&&Number.isSafeInteger(s.lastWindowAt)&&s.lastWindowAt>=0&&s.lastWindowAt<=state.encounter,'collector-state','เจ้าของหรือรอบ Collector ไม่ถูกต้อง');
  if(s.pending)check(s.pending.kinds.length===3&&new Set(s.pending.kinds).size===3&&s.pending.dueAt===s.pending.requestedAt+2&&s.pending.requestedAt%2===0&&s.pending.dueAt>state.encounter,'collector-state','คำขอ Collector ไม่ถูกต้อง');
  if(s.offer){const o=s.offer;check(o.itemIds.length===5&&new Set(o.itemIds).size===5&&new Set(o.itemIds.map(i=>state.items[i]?.kind)).size===5&&Number.isSafeInteger(o.rawQuote)&&o.rawQuote>=1&&(o.peek===undefined||Number.isSafeInteger(o.peek)&&o.peek>=0&&o.peek<5),'collector-state','ชุด Collector ไม่ถูกต้อง');if(o.status==='open')for(const itemId of o.itemIds)check(!escrow.has(itemId)&&!!escrow.add(itemId)&&state.items[itemId]?.owner===prefix+o.id,'collector-owner','ของค้าง Collector ไม่ตรงเจ้าของ');}
 }
 for(const item of Object.values(state.items))if(item.owner.startsWith(prefix))check(escrow.has(item.id),'collector-owner','ของค้าง Collector ไม่มีชุด');
}
