import { randomAt } from '../random.js';
import { linkedStatuses } from './core2.js';
// The full catalog: status links can hand out the v0.6 statuses too.
import { ITEM_SPECS, ALL_STATUS_CATALOG as STATUS_CATALOG } from './content.js';
import { check, grant, healLife, known, learn, maxEnergyOf, maxLifeOf, ownedItem, recover, removeStatus, retire, reward, spend, status, trace, unlocked } from './mechanics.js';
import { NPC_EVENT_IDS, STATUS_IDS } from './types.js';
import type { AppraisalAction, AppraisalState, Appraiser, EventId, EventOffer, NpcId, StatusId } from './types.js';

export const NPC_PERSONAL_EVENT:Record<NpcId,typeof NPC_EVENT_IDS[number]>={vampire:'E109',alien:'E110',darkone:'E111',autometa:'E112',orc:'E113',beast:'E114',deepsea:'E115',swarm:'E116'};
export const isNpcEvent=(id:EventId)=> (NPC_EVENT_IDS as readonly string[]).includes(id);
const merchant=(p:Appraiser)=>p.portals.find(portal=>portal.id===p.selectedPortalId)?.npc;
const movable=(state:AppraisalState,p:Appraiser)=>p.inventory.filter(id=>state.items[id]?.owner===p.id && unlocked(p,id));
const livingOthers=(state:AppraisalState,p:Appraiser)=>state.players.filter(other=>other.id!==p.id && other.paused!=='dead' && (!state.config.survival || other.life!>0));
const freeBank=(state:AppraisalState)=>state.bank-state.market.budget-state.reservedRewards;
const pick=<T>(state:AppraisalState,key:string,pool:readonly T[]):T=>pool[Math.floor(randomAt(state.seed,key)*pool.length)]!;
const note=(p:Appraiser,text:string)=>{p.notes.push(text);p.notes=p.notes.slice(-30);};

/** No seed, hidden item truths or pre-rolled rewards are sent in the contract. */
export function npcEventEligible(state:AppraisalState,p:Appraiser,id:EventId):boolean {
  if(!state.config.npcEvents || state.phase!=='APPRAISAL' || p.paused || p.done || NPC_PERSONAL_EVENT[merchant(p)!]!==id)return false;
  const items=movable(state,p);
  const buffs=statusPool(state,p,'B').length;
  switch(id) {
    case 'E109': return !!state.config.survival && p.life!>2 && !p.npcContracts?.vampire;
    case 'E110': return !p.npcContracts?.alien && items.length>0 && freeBank(state)>=8;
    case 'E111': return (p.credits>=2 || p.energy>=1 || !!state.config.survival && p.life!>1 || items.length>0) && (p.statuses.some(s=>s.id.startsWith('D')) || livingOthers(state,p).length>0);
    case 'E112': return buffs>0 && (p.energy>=2 || items.length>0);
    case 'E113': return buffs>0 && p.energy>=2;
    case 'E114': return buffs>0 && items.length>0;
    case 'E116': return buffs>=2 && items.length>0;
    case 'E115': return buffs>0 && p.credits>=3 && p.stock.some(id=>{const k=known(state,p,id);return k.base===undefined || k.genuine===undefined || k.cursed===undefined;});
    default: return false;
  }
}

/** Capture payable, distinct costs and selectable targets once, when the offer opens. */
export function personalNpcOffer(state:AppraisalState,p:Appraiser,id:EventId,key:string):Partial<EventOffer> {
  const itemIds=movable(state,p),terms:NonNullable<EventOffer['npcTerms']>={credits:0,energy:0,life:0,items:0};
  let choices=['accept','decline'];
  if(id==='E109')terms.life=2;
  if(id==='E110') {
    terms.loanMax=Math.min(itemIds.length,1+Math.floor(randomAt(state.seed,`${key}:loan-size`)*3),Math.floor(freeBank(state)/8));
    choices=[...Array.from({length:terms.loanMax},(_,i)=>`lend-${i+1}`),'decline'];
  }
  if(id==='E111') {
    const costs:Array<keyof Pick<typeof terms,'credits'|'energy'|'life'|'items'>>=[];
    if(p.credits>=2)costs.push('credits');if(p.energy>=1)costs.push('energy');if(state.config.survival && p.life!>1)costs.push('life');if(itemIds.length)costs.push('items');
    const ranked=costs.map(cost=>({cost,rank:randomAt(state.seed,`${key}:cost:${cost}`)})).sort((a,b)=>a.rank-b.rank);
    const count=1+Math.floor(randomAt(state.seed,`${key}:cost-count`)*Math.min(3,costs.length));
    for(const {cost} of ranked.slice(0,count)) terms[cost]=cost==='credits'?Math.min(p.credits,2+Math.floor(randomAt(state.seed,`${key}:credits`)*4)):cost==='energy'?Math.min(p.energy,2):1;
    choices=[...(p.statuses.some(s=>s.id.startsWith('D'))?['purge']:[]),...(livingOthers(state,p).length?['send-debuff']:[]),'decline'];
  }
  if(id==='E112')choices=[...(itemIds.length?['give-item']:[]),...(p.energy>=2?['give-energy']:[]),'decline'];
  if(id==='E113')terms.energy=2;
  if(id==='E114' || id==='E116')terms.items=1;
  if(id==='E115')terms.credits=3;
  return {choices,itemIds:id==='E115'?[...p.stock]:itemIds,statusIds:p.statuses.filter(s=>s.id.startsWith('D')).map(s=>s.id),otherPlayerIds:livingOthers(state,p).map(other=>other.id),npcTerms:terms,
    targetKinds:Object.fromEntries((id==='E115'?p.stock:itemIds).map(itemId=>[itemId,state.items[itemId]!.kind]))};
}

/** Buff/debuff pools respect the room's enabled mechanics and the remaining encounters. */
function statusPool(state:AppraisalState,p:Appraiser,prefix:'B'|'D'):StatusId[] {
  return [...STATUS_IDS,...linkedStatuses(state.config,prefix)].filter(id=>id.startsWith(prefix) && !status(p,id)
    && (state.config.expansion || Number(id.slice(1))<=10 || Number(id.slice(1))>=17) && (state.config.polish || Number(id.slice(1))<=16)
    && (state.config.brokerage || id!=='B20') && (id!=='D09')
    && (state.config.survival || state.encounter<state.config.encounters || !['B09','D04','D07'].includes(id)));
}
function randomBuff(state:AppraisalState,p:Appraiser,key:string,preferred?:StatusId[]):void {
  const pool=statusPool(state,p,'B');const candidates=preferred?.filter(id=>pool.includes(id))??pool;
  const id=pick(state,key,candidates.length?candidates:pool.length?pool:['B03'] as StatusId[]);grant(state,p,id);
  note(p,`ได้รับพร ${STATUS_CATALOG.find(s=>s.id===id)!.name}`);
}
/** A life payment is exact; damage shields and vulnerability do not change a quoted price. */
function payLife(state:AppraisalState,p:Appraiser,amount:number,reason:string):void {
  if(!amount)return;check(state.config.survival && p.life!>amount,'life','ชีวิตไม่พอจ่ายและต้องเหลืออย่างน้อย 1');
  p.life!-=amount;trace(state,p,'life-paid',{amount,reason});
}
export function resolvePersonalNpcEvent(state:AppraisalState,p:Appraiser,offer:EventOffer,command:Extract<AppraisalAction,{type:'event'}>):void {
  check(npcEventEligible(state,p,offer.id),'event-ineligible','เงื่อนไขอีเวนต์พ่อค้าเปลี่ยนไปแล้ว');
  const terms=offer.npcTerms;check(terms,'event-terms','ไม่มีเงื่อนไขข้อตกลง');
  const selected=()=>{check(command.itemId && offer.itemIds.includes(command.itemId),'event-target','เลือกสินค้าที่เสนอให้');return command.itemId;};
  const itemCost=terms.items || offer.id==='E112' && command.choice==='give-item';
  if(itemCost)ownedItem(state,p,selected(),true);
  const energy=terms.energy+(offer.id==='E112' && command.choice==='give-energy'?2:0);
  check(p.credits>=terms.credits && p.energy>=energy && (!terms.life || p.life!>terms.life),'event-cost','ทรัพยากรไม่พอจ่ายข้อตกลง');
  // Validate all player-selected targets before any payment; the engine also settles on a clone.
  const victim=command.choice==='send-debuff'?livingOthers(state,p).find(other=>other.id===command.otherPlayerId && offer.otherPlayerIds.includes(other.id)):undefined;
  if(command.choice==='send-debuff')check(victim,'event-target','เลือกผู้เล่นอื่นที่ยังมีชีวิต');
  if(command.choice==='purge')check(command.statusId && offer.statusIds.includes(command.statusId) && command.statusId.startsWith('D') && status(p,command.statusId),'event-target','เลือกผลเสียที่คุณมีอยู่');
  spend(state,p,terms.credits,energy,offer.id);payLife(state,p,terms.life,offer.id);
  if(itemCost)retire(state,p,selected(),offer.id);
  switch(offer.id) {
    case 'E109': (p.npcContracts??={}).vampire={signedAt:state.encounter};note(p,'สัญญาเลือด: จ่ายชีวิต 2 แล้ว รับผลตอบแทนสุ่มเมื่อเลือกพบ Vampire ครั้งหน้า');break;
    case 'E110': {
      const count=Number(command.choice.slice(5)),ids=command.itemIds;
      check(Number.isInteger(count) && count>=1 && count<=terms.loanMax! && Array.isArray(ids) && ids.length===count && new Set(ids).size===count && ids.every(id=>offer.itemIds.includes(id)),'event-target','เลือกของให้ยืมให้ครบจำนวนและห้ามซ้ำ');
      for(const id of ids)ownedItem(state,p,id,true);
      check(freeBank(state)>=8*count,'bank','งบผลตอบแทนไม่พอ');
      for(const id of ids){p.inventory=p.inventory.filter(itemId=>itemId!==id);state.items[id]!.owner=`alien-loan:${p.id}`;}
      state.listings=state.listings.filter(l=>!ids.includes(l.itemId));
      state.reservedRewards+=8*count;(p.npcContracts??={}).alien={lentAt:state.encounter,dueAt:state.encounter+2,itemIds:[...ids],key:offer.key,reservedCredits:8*count};
      trace(state,p,'alien-loan',{itemIds:ids,dueAt:state.encounter+2});note(p,`Alien ยืมของ ${count} ชิ้น พบอีกครั้งตั้งแต่ช่วง ${state.encounter+2} เพื่อคืนของพร้อมโบนัสตามจำนวนชิ้น`);break;
    }
    case 'E111': {
      if(command.choice==='purge'){removeStatus(p,command.statusId!);note(p,`Dark One ล้าง ${STATUS_CATALOG.find(s=>s.id===command.statusId)!.name} ให้แล้ว`);}
      else {const pool=statusPool(state,victim!,'D');const id=pick(state,`${offer.key}:hex`,pool.length?pool:['D01'] as StatusId[]);grant(state,victim!,id);note(p,`Dark One ส่ง ${STATUS_CATALOG.find(s=>s.id===id)!.name} ให้ ${victim!.id}`);note(victim!,`${p.id} ส่ง ${STATUS_CATALOG.find(s=>s.id===id)!.name} ผ่าน Dark One`);trace(state,p,'npc-hex',{targetId:victim!.id,statusId:id});}break;
    }
    case 'E112': randomBuff(state,p,`${offer.key}:upgrade`);break;
    case 'E113': randomBuff(state,p,`${offer.key}:warrior`,['B04','B07','B19']);break;
    case 'E114': recover(state,p,4,offer.id);if(state.config.survival)healLife(state,p,2,offer.id);randomBuff(state,p,`${offer.key}:guide`,['B05','B09','B14']);break;
    case 'E115': {
      const ids=p.stock.filter(id=>state.items[id]?.owner===`npc:${p.id}:${state.encounter}`);
      const clues=ids.flatMap(itemId=>{const k=known(state,p,itemId);return (['base','genuine','cursed'] as const).filter(fact=>k[fact]===undefined).map(fact=>({itemId,fact}));});
      check(clues.length,'event-target','ไม่มีข้อมูลใหม่ในร้าน');const clue=pick(state,`${offer.key}:whisper`,clues);learn(p,clue.itemId,{[clue.fact]:state.items[clue.itemId]![clue.fact]});
      randomBuff(state,p,`${offer.key}:depth`,['B12','B14','B16']);note(p,`เสียงจากก้นบึ้งเปิดผลตรวจ ${ITEM_SPECS[state.items[clue.itemId]!.kind].name} หนึ่งด้าน`);break;
    }
    case 'E116': {
      randomBuff(state,p,`${offer.key}:hive:1`,['B11','B13','B15','B16']);randomBuff(state,p,`${offer.key}:hive:2`,['B11','B13','B15','B16']);break;
    }
  }
}

function returnLoanItems(state:AppraisalState,p:Appraiser):number {
  const loan=p.npcContracts?.alien;if(!loan)return 0;
  for(const id of loan.itemIds){check(state.items[id]?.owner===`alien-loan:${p.id}`,'loan-owner','ของที่ให้ยืมไม่ตรงสัญญา');state.items[id]!.owner=p.id;p.inventory.push(id);}
  state.reservedRewards-=loan.reservedCredits;delete p.npcContracts!.alien;
  trace(state,p,'alien-returned',{itemIds:loan.itemIds});return loan.itemIds.length;
}
/** Called once for an actual chosen portal, never merely for seeing it among the choices. */
export function redeemNpcContracts(state:AppraisalState,p:Appraiser,npc:NpcId):void {
  if(!state.config.npcEvents)return;
  const blood=p.npcContracts?.vampire;
  if(npc==='vampire' && blood && state.encounter>blood.signedAt) {
    delete p.npcContracts!.vampire;
    const stock=p.stock.filter(id=>state.items[id]?.owner===`npc:${p.id}:${state.encounter}`);
    const pool=[...(statusPool(state,p,'B').length?['buff']:[]),...(stock.length?['item','discount']:[]),...(p.energy<maxEnergyOf(state,p)?['energy']:[]),...(state.config.survival && p.life!<maxLifeOf(state,p)!?['life']:[])];
    const outcome=pick(state,`${p.id}:${blood.signedAt}:blood-return`,pool);
    if(outcome==='item'){const id=pick(state,`${p.id}:${blood.signedAt}:blood-item`,stock);state.items[id]!.owner=p.id;p.inventory.push(id);p.stock=p.stock.filter(itemId=>itemId!==id);note(p,`Vampire ตอบแทนด้วย ${ITEM_SPECS[state.items[id]!.kind].name} ฟรี 1 ชิ้น`);}
    else if(outcome==='discount'){p.vampireDiscount={encounter:state.encounter};note(p,'Vampire ลดราคาสินค้า 50% สำหรับการซื้อจากร้านนี้ครั้งแรกในช่วงนี้ (ไม่รวมค่าธรรมเนียม)');}
    else if(outcome==='energy'){recover(state,p,6,'vampire-return');note(p,'Vampire ตอบแทนด้วยการฟื้นพลังสูงสุด 6');}
    else if(outcome==='life'){healLife(state,p,3,'vampire-return');note(p,'Vampire ตอบแทนด้วยการฟื้นชีวิตสูงสุด 3');}
    else randomBuff(state,p,`${p.id}:${blood.signedAt}:blood-buff`);
    trace(state,p,'vampire-repaid',{outcome});
  }
  const loan=p.npcContracts?.alien;
  if(npc==='alien' && loan && state.encounter>=loan.dueAt) {
    const perItem=4+Math.floor(randomAt(state.seed,`${loan.key}:credits`)*5),energy=1+Math.floor(randomAt(state.seed,`${loan.key}:energy`)*2);
    const count=returnLoanItems(state,p);reward(state,p,perItem*count,'alien-return');recover(state,p,energy*count,'alien-return');
    note(p,`Alien คืนของเดิม ${count} ชิ้น พร้อมโบนัส ${perItem*count} เครดิตและฟื้นพลังสูงสุด ${energy*count}`);
    trace(state,p,'alien-repaid',{count,credits:perItem*count,energy:energy*count});
  }
}
/** Principal always returns for final scoring, even for a dead spectator; no meeting means no bonus. */
export function closeNpcContracts(state:AppraisalState):void {
  if(!state.config.npcEvents)return;
  for(const p of state.players){const count=returnLoanItems(state,p);if(count)note(p,`จบรัน: Alien คืนของ ${count} ชิ้นเพื่อคิดคะแนน แต่ไม่ได้โบนัสเพราะยังไม่ได้พบกันตามเงื่อนไข`);if(p.npcContracts)delete p.npcContracts.vampire;delete p.vampireDiscount;}
}
