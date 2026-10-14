import { randomAt } from '../random.js';
import { ITEM_SPECS, NPC_SPECS, itemFamily, priceRange } from './content.js';
import { check, consumeStatus, counterLimit, damageLife, grant, kill, known, learn, ownedItem, penaltyItem, purchase, recover, removeStatus, retire, reward, spend, status, stockItem, trace, unlocked } from './mechanics.js';
import { EVENT_IDS } from './types.js';
import type { AppraisalAction, AppraisalState, Appraiser, EventId, EventOffer, ItemKind, Knowledge, StatusId } from './types.js';

const consequences: EventId[] = ['E48','E49','E50'];
function kindOwned(state: AppraisalState,p:Appraiser,kind:ItemKind):string[] { return p.inventory.filter(id => itemFamily(state.items[id]!.kind) === kind && !p.activated.includes(id)); }
function movable(p:Appraiser):string[] { return p.inventory.filter(id => unlocked(p,id)); }
function debuffs(p:Appraiser):StatusId[] { return p.statuses.filter(s => s.id.startsWith('D')).map(s => s.id); }
function historyPrice(state:AppraisalState,p:Appraiser):number | undefined {
  const kinds=p.stock.map(id=>state.items[id]!.kind);
  const entry=state.trace.toReversed().find(t => {
    const ids=t.details.itemIds as string[] | undefined; const id=t.details.itemId as string | undefined;
    return t.encounter<state.encounter && typeof t.details.price==='number' && (ids?.length===1 ? kinds.includes(state.items[ids[0]!]!.kind) : !!id && kinds.includes(state.items[id]!.kind));
  });
  return entry?.details.price as number | undefined;
}
export function eventEligible(state:AppraisalState,p:Appraiser,id:EventId):boolean {
  if (p.paused || p.done || ['RESULTS','REVEAL'].includes(state.phase)) return false;
  const npc=p.stock[0] ? state.items[p.stock[0]]!.npc : null;
  const stock=p.stock.filter(itemId => state.items[itemId]?.owner===`npc:${p.id}:${state.encounter}`);
  const unknownPrice=stock.some(itemId=>known(state,p,itemId).base===undefined);
  const inspectable=p.inspections<2;
  const next=!!state.config.survival || state.encounter<state.config.encounters;
  if (consequences.includes(id)) {
    if (!p.caught || p.consequenceSlots>=1) return false;
    return id==='E48' || (id==='E49' && next) || (id==='E50' && npc==='darkone' && p.acceptedDanger);
  }
  if (['E01','E08','E10'].includes(id)) return state.phase==='PORTALS' && p.portals.filter(v=>!v.disabled).length>1 && (id!=='E08' || next || NPC_SPECS[p.portals[1]!.npc].condition!=='D04') && (id!=='E10' || unknownPrice || p.stock.length===0);
  if (state.phase==='PORTALS') return false;
  if (Number(id.slice(1))<=30 && state.phase!=='APPRAISAL') return false;
  const bank=state.bank-state.market.budget-state.reservedRewards;
  switch(id) {
    case 'E02': return npc==='orc' && stock.length>0 && !Object.keys(p.valuations).length;
    case 'E03': return npc==='vampire' && p.energy<state.config.maxEnergy;
    case 'E04': return npc==='autometa' && unknownPrice;
    case 'E05': return npc==='alien' && inspectable && stock.some(v=>!known(state,p,v).effectsKnown);
    case 'E06': return npc==='darkone' && next && debuffs(p).some(v=>v!=='D04' || next);
    case 'E07': return npc==='beast' && inspectable && kindOwned(state,p,'food').some(v=>unlocked(p,v));
    case 'E09': return stock.length>0 && p.counters<counterLimit(p);
    case 'E11': return inspectable && stock.some(v=>known(state,p,v).genuine===undefined);
    case 'E12': return inspectable && stock.some(v=>state.items[v]!.certificate && known(state,p,v).certificate===undefined);
    case 'E13': return inspectable && stock.length>=2 && stock.filter(v=>known(state,p,v).base===undefined).length>=2;
    case 'E14': return historyPrice(state,p)!==undefined;
    case 'E15': return inspectable && stock.length>0 && unknownPrice;
    case 'E16': return inspectable && stock.some(v=>!known(state,p,v).effectsKnown);
    case 'E17': return inspectable && unknownPrice;
    case 'E18': return stock.length>0 && !Object.keys(p.valuations).length;
    case 'E19': return bank>=1 && stock.some(v=>known(state,p,v).genuine===false && state.publicKnowledge[v]?.genuine===undefined);
    case 'E20': return inspectable && stock.some(v=>!known(state,p,v).activationKnown);
    case 'E21': return stock.length>=2;
    case 'E22': return !status(p,'B07') && ['orc','darkone','beast'].includes(npc??'');
    case 'E23': return p.energy>=1 && stock.length>0;
    case 'E24': return npc==='vampire' && stock.length>0;
    case 'E25': return stock.length>0 && movable(p).some(v=>NPC_SPECS[npc!].favorite.includes(state.items[v]!.kind));
    case 'E26': return next;
    case 'E27': return next && stock.length>0;
    case 'E28': return npc==='darkone' && !status(p,'B08');
    case 'E29': return stock.length>0 && !status(p,'D09');
    case 'E30': return stock.length>0 && !status(p,'B06');
    case 'E31': return kindOwned(state,p,'mirror').length>0;
    case 'E32': return kindOwned(state,p,'orb').length>0 && p.energy<state.config.maxEnergy;
    case 'E33': return kindOwned(state,p,'key').length>0 && !!status(p,'D07');
    case 'E34': return kindOwned(state,p,'mask').length>0 && p.statuses.some(s=>s.id.startsWith('B') && s.id!=='B10');
    case 'E35': return kindOwned(state,p,'potion').length>0 && (!!status(p,'D01') || !!status(p,'D05'));
    case 'E36': return kindOwned(state,p,'battery').length>0 && inspectable;
    case 'E37': return state.phase==='APPRAISAL' && p.inventory.length>=3 && stock.length>0;
    case 'E38': return kindOwned(state,p,'amulet').length>0;
    case 'E39': return state.phase==='APPRAISAL' && kindOwned(state,p,'blade').length>0 && stock.some(v=>!p.valuations[v]);
    case 'E40': return kindOwned(state,p,'scanner').length>0;
    case 'E41': return debuffs(p).length>0;
    case 'E42': return p.energy<state.config.maxEnergy || !!status(p,'D10');
    case 'E43': return state.phase==='TRADE' && !p.subsidy && bank>=1;
    case 'E44': return movable(p).length>=2 && bank>=Math.max(...movable(p).map(v=>Math.floor(ITEM_SPECS[state.items[v]!.kind].anchor*.75)));
    case 'E45': return Object.entries(p.knowledge).some(([item,k])=>['base','genuine','cursed'].some(f=>k[f as keyof Knowledge]!==undefined && state.publicKnowledge[item]?.[f as keyof Knowledge]===undefined && !p.revealedInfo.includes(`${item}:${f}`)));
    case 'E46': return p.energy>=1 && stock.some(v=>known(state,p,v).genuine===undefined) && bank>=2;
    case 'E47': return state.listings.some(l=>l.ownerId!==p.id && state.items[l.itemId]?.owner.startsWith('npc:') && !!state.players.find(other=>other.id===l.ownerId)?.valuations[l.itemId]);
    default: return false;
  }
}
export function eventChoices(state:AppraisalState,p:Appraiser,id:EventId):string[] {
  switch(id) {
    case 'E01': return ['stay','switch','decline'];
    case 'E03': return ['pay','debt','decline'];
    case 'E06': return [...(debuffs(p).some(v=>v!=='D04')?['interest']:[]),...(debuffs(p).some(v=>v!=='D07')?['seal']:[]),'decline'];
    case 'E08': return ['cash','condition','decline'];
    case 'E10': return ['pay','fog','switch','decline'];
    case 'E11': return ['careful','force','decline'];
    case 'E15': return ['price','curse','decline'];
    case 'E18': return ['discount','risk','decline'];
    case 'E37': return ['pay','burden','decline'];
    case 'E40': return ['repair','fog','decline'];
    case 'E42': return [...(p.energy<state.config.maxEnergy?['energy']:[]),...(status(p,'D10')?['cleanse']:[]),'decline'];
    case 'E48': return [...(p.credits>=2?['pay']:[]),...(p.inventory.length?['item']:[]),...(p.credits<2 && !p.inventory.length?['energy']:[])];
    case 'E49': return [...(p.credits>=2?['pay']:[]),'oath'];
    case 'E50': return [...(p.inventory.length?['surrender']:[]),'die'];
    default: return ['accept','decline'];
  }
}
export function offerEvent(state:AppraisalState,p:Appraiser,id:EventId):void {
  check(!p.eventOffer && eventEligible(state,p,id),'event-ineligible','event ไม่เข้าเงื่อนไข');
  const reaction=consequences.includes(id);
  const key=`${state.encounter}:${p.id}:${id}:${p.offerSlots}:${p.consequenceSlots}`;
  const ownKinds:Partial<Record<EventId,ItemKind>>={E07:'food',E31:'mirror',E32:'orb',E33:'key',E34:'mask',E35:'potion',E36:'battery',E38:'amulet',E39:'blade'};
  let itemIds=ownKinds[id]?kindOwned(state,p,ownKinds[id]!):p.stock;
  if(id==='E25') itemIds=movable(p).filter(v=>NPC_SPECS[state.items[p.stock[0]!]!.npc].favorite.includes(state.items[v]!.kind));
  if(['E44','E48','E50'].includes(id)) itemIds=id==='E44'?movable(p):p.inventory;
  if(id==='E45') itemIds=Object.keys(p.knowledge);
  if(id==='E47') itemIds=state.listings.filter(l=>l.ownerId!==p.id && state.items[l.itemId]!.owner.startsWith('npc:')).map(l=>l.itemId);
  if(id==='E11') itemIds=itemIds.filter(v=>known(state,p,v).genuine===undefined);
  if(id==='E12') itemIds=itemIds.filter(v=>state.items[v]!.certificate && known(state,p,v).certificate===undefined);
  if(id==='E19') itemIds=itemIds.filter(v=>known(state,p,v).genuine===false && state.publicKnowledge[v]?.genuine===undefined);
  if(id==='E07') itemIds=itemIds.filter(v=>unlocked(p,v));
  const quotedPrices=Object.fromEntries(p.inventory.map(itemId=>[itemId,Math.floor(ITEM_SPECS[state.items[itemId]!.kind].anchor*.75)]));
  const facts:Record<string,Knowledge>={};
  if(id==='E45') {
    for(const itemId of itemIds) {
      const proof:Knowledge={};
      for(const fact of ['base','genuine','cursed'] as const) if(p.knowledge[itemId]?.[fact]!==undefined && state.publicKnowledge[itemId]?.[fact]===undefined && !p.revealedInfo.includes(`${itemId}:${fact}`)) Object.assign(proof,{[fact]:p.knowledge[itemId]![fact]});
      if(Object.keys(proof).length) facts[itemId]=proof;
    }
    itemIds=Object.keys(facts);
  }
  const targetKinds=Object.fromEntries(itemIds.map(itemId=>[itemId,state.items[itemId]!.kind]));
  p.eventOffer={id,key,choices:eventChoices(state,p,id),itemIds:[...itemIds],statusIds:p.statuses.map(s=>s.id),otherPlayerIds:state.listings.filter(l=>l.ownerId!==p.id).map(l=>l.ownerId),quotedPrices,facts,targetKinds};
  if(reaction) p.consequenceSlots++; else p.offerSlots++;
  p.seenEvents.push(id); trace(state,p,'event-offered',{id,key,choices:p.eventOffer.choices});
}
export function drawEvent(state:AppraisalState,p:Appraiser,reaction=false):void {
  if(p.eventOffer || p.paused || p.done || (!reaction && p.offerSlots>=2) || (reaction && p.consequenceSlots>=1)) return;
  let pool=EVENT_IDS.filter(id=>consequences.includes(id)===reaction && eventEligible(state,p,id));
  const unseen=pool.filter(id=>!p.seenEvents.includes(id)); if(unseen.length) pool=unseen;
  if(!pool.length) return;
  const index=Math.floor(randomAt(state.seed,`${state.encounter}:${p.id}:${state.phase}:${p.offerSlots}:${p.consequenceSlots}:event`)*pool.length);
  offerEvent(state,p,pool[index]!);
}
function chooseItem(offer:EventOffer,command:Extract<AppraisalAction,{type:'event'}>):string {
  check(command.itemId && offer.itemIds.includes(command.itemId),'event-target','เลือกสินค้าที่อยู่ใน event'); return command.itemId;
}
function chooseStatus(offer:EventOffer,command:Extract<AppraisalAction,{type:'event'}>):StatusId {
  check(command.statusId && offer.statusIds.includes(command.statusId),'event-target','เลือกสถานะที่อยู่ใน event'); return command.statusId;
}
function eventInspect(state:AppraisalState,p:Appraiser,itemId:string,credits:number,energy:number,k:Knowledge):void {
  stockItem(state,p,itemId); check(p.inspections<2,'inspections','สิทธิ์ตรวจหมด');
  const cost=Math.max(0,energy+(status(p,'D01')?1:0)-(status(p,'B05')?1:0));
  spend(state,p,credits,cost,'event-inspect'); consumeStatus(p,'D01'); consumeStatus(p,'B05'); p.inspections++; learn(p,itemId,k);
}
export function resolveEvent(state:AppraisalState,p:Appraiser,command:Extract<AppraisalAction,{type:'event'}>):void {
  const offer=p.eventOffer; check(offer && offer.key===command.key && offer.choices.includes(command.choice),'event-choice','ข้อเสนอเก่าหรือไม่มีตัวเลือกนี้');
  const id=offer.id; const choice=command.choice;
  if(choice==='decline') { check(!consequences.includes(id),'consequence','ปฏิเสธผลที่รับความเสี่ยงไว้ไม่ได้'); if(['E01','E10'].includes(id)) p.portals[0]!.disabled=true; p.eventOffer=null; p.resolvedEvents.push(id); trace(state,p,'event-declined',{id}); return; }
  // The offer's captured targets are fixed. Resource/ownership conditions are rechecked at settlement.
  const item=()=>chooseItem(offer,command);
  const ownKind=(kind:ItemKind)=>{const itemId=item(); check(kindOwned(state,p,kind).includes(itemId),'event-target','สินค้าไม่เข้าเงื่อนไข'); ownedItem(state,p,itemId); return itemId;};
  const buy=(discount=0,extra?:StatusId,lock=false,barterItemId?:string)=>purchase(state,p,p,[item()],{discount,condition:p.dealMode==='condition',...(extra?{grantStatus:extra}:{}),lock,...(barterItemId?{barterItemId}:{})});
  switch(id) {
    case 'E01': if(choice==='stay') spend(state,p,0,1,id); else p.portals[0]!.disabled=true; break;
    case 'E02': p.honorJob=true; break;
    case 'E03': if(choice==='pay') spend(state,p,2,0,id); else grant(state,p,'D10'); recover(state,p,3,id); if(state.config.survival && choice==='debt')damageLife(state,p,1,'blood-pact'); break;
    case 'E04': spend(state,p,1,0,id); grant(state,p,'B01'); break;
    case 'E05': spend(state,p,0,1,id); grant(state,p,'B02'); break;
    case 'E06': {const selected=chooseStatus(offer,command); const next=choice==='interest'?'D04':'D07'; check(selected.startsWith('D') && selected!==next && status(p,selected),'event-target','ล้างสถานะที่เลือกไม่ได้'); removeStatus(p,selected); grant(state,p,next); break;}
    case 'E07': retire(state,p,ownKind('food'),id); grant(state,p,'B05'); break;
    case 'E08': p.dealMode=choice==='cash'?'cash':'condition'; p.portals.forEach((portal,index)=>portal.disabled=index!==(choice==='cash'?0:1)); break;
    case 'E09': buy(2,'D08'); break;
    case 'E10': if(choice==='pay') spend(state,p,2,0,id); else if(choice==='fog') grant(state,p,'D02'); else p.portals[0]!.disabled=true; break;
    case 'E11': {const v=item(); check(known(state,p,v).genuine===undefined,'known','รู้แล้ว'); eventInspect(state,p,v,0,choice==='careful'?2:1,{genuine:state.items[v]!.genuine}); if(choice==='force') grant(state,p,'D01'); break;}
    case 'E12': {const v=item(); check(state.items[v]!.certificate && known(state,p,v).certificate===undefined,'certificate','ไม่มีใบรับรองที่ตรวจได้'); eventInspect(state,p,v,1,0,{certificate:state.items[v]!.genuine}); break;}
    case 'E13': {const ids=p.stock.slice(0,2); check(ids.length===2 && ids.every(v=>known(state,p,v).base===undefined),'comparison','ไม่มีสินค้าคู่ที่ยังไม่รู้ราคา'); eventInspect(state,p,ids[0]!,0,1,{comparison:state.items[ids[0]!]!.base>=state.items[ids[1]!]!.base?ids[0]!:ids[1]!}); break;}
    case 'E14': {const price=historyPrice(state,p); check(price!==undefined,'history','ไม่มีประวัติราคา'); spend(state,p,1,0,id); p.notes.push(`ราคาซื้อขายจริงในอดีต ${price} credit ไม่ใช่ base ของชิ้นปัจจุบัน`); trace(state,p,'historical-price',{price}); break;}
    case 'E15': spend(state,p,0,1,id); grant(state,p,choice==='price'?'B01':'B02'); break;
    case 'E16': eventInspect(state,p,item(),0,1,{effectsKnown:true}); break;
    case 'E17': {const v=item(); const target=stockItem(state,p,v); const bounds=priceRange(target.kind); const offset=Math.floor(randomAt(state.seed,`${offer.key}:narrow`)*3); eventInspect(state,p,v,2,0,{range:[Math.max(bounds[0],target.base-offset-1),Math.min(bounds[1],target.base+3-offset)]}); break;}
    case 'E18': spend(state,p,0,1,id); p.honestyReward=choice==='discount'?'B03':'B04'; break;
    case 'E19': {const v=item(); check(known(state,p,v).genuine===false && state.publicKnowledge[v]?.genuine===undefined,'proof','ไม่มีผลตรวจใหม่ของปลอม'); state.publicKnowledge[v]={...state.publicKnowledge[v],genuine:false}; reward(state,p,1,id); break;}
    case 'E20': eventInspect(state,p,item(),0,2,{activationKnown:true}); break;
    case 'E21': purchase(state,p,p,p.stock.slice(0,2),{discount:2,condition:p.dealMode==='condition'}); break;
    case 'E22': spend(state,p,1,0,id); grant(state,p,'B07'); break;
    case 'E23': spend(state,p,0,1,id); grant(state,p,'B10'); break;
    case 'E24': buy(2,'D05'); break;
    case 'E25': {const v=item(); const npc=state.items[p.stock[0]!]!.npc; check(NPC_SPECS[npc].favorite.includes(ownedItem(state,p,v,true).kind),'barter','NPC ไม่ต้องการของนี้'); purchase(state,p,p,[p.stock[0]!],{barterItemId:v,condition:p.dealMode==='condition'}); break;}
    case 'E26': spend(state,p,2,0,id); grant(state,p,'B09'); break;
    case 'E27': buy(2,'D04'); break;
    case 'E28': spend(state,p,2,0,id); grant(state,p,'B08'); break;
    case 'E29': buy(3,undefined,true); break;
    case 'E30': buy(-2,'B06'); break;
    case 'E31': {const v=ownKind('mirror'); spend(state,p,0,1,id); p.activated.push(v); grant(state,p,'D05'); grant(state,p,'B01'); break;}
    case 'E32': retire(state,p,ownKind('orb'),id,false); spend(state,p,1,0,id); recover(state,p,3,id); break;
    case 'E33': check(status(p,'D07'),'status','ไม่มี D07'); retire(state,p,ownKind('key'),id,false); removeStatus(p,'D07'); break;
    case 'E34': {ownKind('mask'); const selected=chooseStatus(offer,command); check(selected.startsWith('B') && selected!=='B10' && status(p,selected),'status','เลือก buff ที่จะสละ'); removeStatus(p,selected); grant(state,p,'B10'); break;}
    case 'E35': {const selected=chooseStatus(offer,command); check(['D01','D05'].includes(selected) && status(p,selected),'status','เลือก D01 หรือ D05'); retire(state,p,ownKind('potion'),id,false); removeStatus(p,selected); break;}
    case 'E36': {const v=ownKind('battery'); spend(state,p,0,1,id); p.activated.push(v); grant(state,p,'B05'); break;}
    case 'E37': if(choice==='pay') spend(state,p,2,0,id); else grant(state,p,'D06'); break;
    case 'E38': {const v=ownKind('amulet'); spend(state,p,0,1,id); p.activated.push(v); grant(state,p,'D03'); grant(state,p,'B06'); break;}
    case 'E39': {const v=ownKind('blade'); spend(state,p,0,1,id); p.activated.push(v); grant(state,p,'D10'); grant(state,p,'B04'); break;}
    case 'E40': if(choice==='repair') {spend(state,p,0,2,id); removeStatus(p,'D02');} else grant(state,p,'D02'); break;
    case 'E41': {const selected=chooseStatus(offer,command); check(selected.startsWith('D') && status(p,selected),'status','เลือก debuff'); spend(state,p,2,0,id); removeStatus(p,selected); break;}
    case 'E42': if(choice==='energy') recover(state,p,2,id); else {check(status(p,'D10'),'status','ไม่มี D10'); removeStatus(p,'D10');} break;
    case 'E43': check(state.bank-state.market.budget-state.reservedRewards>=1,'bank','งบรางวัลไม่พอ'); p.subsidy=true; state.reservedRewards++; break;
    case 'E44': {const v=item(); check(movable(p).length>=2 && offer.quotedPrices[v]!==undefined,'collector','ไม่มีข้อเสนอรับซื้อ'); reward(state,p,offer.quotedPrices[v]!,id); retire(state,p,v,id); break;}
    case 'E45': {const v=item(); const fact=command.fact; check(fact && ['base','genuine','cursed'].includes(fact),'fact','เลือกข้อมูลที่จะเปิด'); const value=p.knowledge[v]?.[fact]; check(value!==undefined && state.publicKnowledge[v]?.[fact]===undefined && !p.revealedInfo.includes(`${v}:${fact}`),'proof','ข้อมูลนี้ยังไม่เคยตรวจหรือเปิดแล้ว'); state.publicKnowledge[v]={...state.publicKnowledge[v],[fact]:value}; p.revealedInfo.push(`${v}:${fact}`); reward(state,p,1,id); break;}
    case 'E46': {const v=item(); const target=stockItem(state,p,v); check(typeof command.guess==='boolean' && known(state,p,v).genuine===undefined,'guess','ต้องทายแท้หรือปลอมที่ยังไม่รู้'); spend(state,p,0,1,id); const correct=command.guess===target.genuine; if(correct) reward(state,p,2,id); learn(p,v,{genuine:target.genuine}); trace(state,p,'guess',{itemId:v,correct}); break;}
    case 'E47': {const v=item(); check(state.listings.some(l=>l.itemId===v && l.ownerId!==p.id && state.items[v]!.owner.startsWith('npc:')),'listing','รายการข้ามร้านไม่ได้เปิด'); trace(state,p,'cross-shop-viewed',{itemId:v}); break;}
    case 'E48': if(choice==='pay') spend(state,p,2,0,id); else if(choice==='item') penaltyItem(state,p,item()); else {check(p.credits<2 && !p.inventory.length,'penalty','ต้องเลือกค่าปรับที่ยังจ่ายได้'); p.energy=Math.max(0,p.energy-2);} break;
    case 'E49': if(choice==='pay') spend(state,p,2,0,id); else grant(state,p,'D08'); break;
    case 'E50': if(choice==='surrender') retire(state,p,item(),id,false); else kill(state,p); break;
  }
  p.eventOffer=null; p.resolvedEvents.push(id); trace(state,p,'event-resolved',{id,choice});
}
/** Safe timeout/defaults never accept a new optional contract. Confirmed consequences still settle. */
export function defaultEvent(state:AppraisalState,p:Appraiser):void {
  const offer=p.eventOffer; if(!offer) return;
  const choice=offer.choices.includes('decline')?'decline':offer.choices.includes('pay')?'pay':offer.choices.includes('oath')?'oath':offer.choices.includes('die')?'die':offer.choices.includes('energy')?'energy':'item';
  resolveEvent(state,p,{type:'event',key:offer.key,playerId:p.id,requestId:'system-default',encounter:state.encounter,choice,...(choice==='item'?{itemId:p.inventory[0]!}:{})});
}
