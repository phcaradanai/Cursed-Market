import { statusMagnitude } from './copy-effects.js';
import { ensureItemAppearance } from './rarity.js';
import { randomAt } from '../random.js';
import { ITEM_SPECS, NPC_SPECS, merchantKinds, expansionActive, priceRange } from './content.js';
import { anchorOf } from './core2.js';
import { itemScoreValue } from './scoring.js';
import { ABILITY_ITEM_IDS } from './types.js';
import { MERCHANT_ABILITIES, abilityRemaining, abilityTier } from './ability-rules.js';
import { check, grant, known, learn, ownedItem, recover, removeStatus, retire, status, stockItem, trace, unlocked } from './mechanics.js';
import type { AppraisalAction, AppraisalItem, AppraisalState, Appraiser, MerchantAbilityView, NpcId } from './types.js';

const npcs=Object.keys(MERCHANT_ABILITIES) as NpcId[];
const activeNpcs=(state:AppraisalState)=>npcs.filter(n=>expansionActive(state.config)||!['swarm','deepsea'].includes(n));
const liveCopy=(state:AppraisalState,id:string)=>Object.values(state.items).some(i=>i.copy?.sourceId===id && !['consumed','removed','retired','collector'].includes(i.owner));
const movable=(state:AppraisalState,p:Appraiser,id:string)=>state.items[id]?.owner===p.id && unlocked(p,id) && !p.inventory.some(other=>other!==id && state.items[other]?.id===id);
export function abilityTargets(state:AppraisalState,p:Appraiser,npc:NpcId):string[] {
  if(npc==='orc' || npc==='autometa' || npc==='beast')return p.stock.filter(id=>state.items[id]?.owner===`npc:${p.id}:${state.encounter}` && (npc!=='beast' || state.items[id]?.lastAppraisal===null && !state.listings.some(l=>l.itemId===id)));
  if(npc==='darkone')return [];
  return p.inventory.filter(id=>movable(state,p,id) && (npc!=='vampire'||!p.activated.includes(id)) && (npc!=='alien'||!state.items[id]!.copy) && (npc!=='vampire'||ITEM_SPECS[state.items[id]!.kind].consumable && !state.items[id]!.copy && !state.items[id]!.preserved) && (npc!=='swarm'||!state.items[id]!.copy && !state.items[id]!.copyConsumed && !state.items[`copy-${id}-1`] && !liveCopy(state,id)));
}
export function merchantAbilityViews(state:AppraisalState,p:Appraiser):MerchantAbilityView[] {
  return activeNpcs(state).map(npc=>{
    const spec=MERCHANT_ABILITIES[npc],trust=p.npcTrust?.[npc]??0,remaining=abilityRemaining(p,npc,state.encounter),itemIds=abilityTargets(state,p,npc);
    const statusIds=p.statuses.filter(s=>s.id.startsWith('D')&&s.charges>0).map(s=>s.id);
    // Status links: a seat merchants are watching (D21) gets no special service.
    const reason=state.config.statusLinks===1 && status(p,'D21')?'พ่อค้าจับตาคุณอยู่ ไม่ยอมใช้ความสามารถพิเศษให้':trust<1?'ต้องมีความไว้ใจอย่างน้อย 1':p.skillUsed?'ใช้ความสามารถพ่อค้าในช่วงนี้แล้ว':remaining>0?'กำลังรอ cooldown':p.abilityChoice?'เลือกสินค้าที่เสนอให้ก่อน':p.caught?'ถูกจับผิดในช่วงนี้แล้ว':p.done||p.paused?'จบช่วงหรือพักแล้ว':p.eventOffer?'ตอบเหตุการณ์ก่อน':!['APPRAISAL','TRADE'].includes(state.phase)?'ใช้ในช่วงประเมินหรือต่อรอง':npc==='darkone'&&!statusIds.length?'ไม่มี debuff ให้ลบ':spec.target!=='debuff'&&!itemIds.length?'ไม่มีสินค้าที่ใช้ความสามารถนี้ได้':null;
    return {npc,...spec,trust,tier:abilityTier(trust),remaining,ready:reason===null,reason,itemIds,statusIds};
  });
}
/** Candidate facts are server-generated and persisted on opening; retries never reroll them. */
function makeCandidate(state:AppraisalState,p:Appraiser,npc:NpcId,key:string,slot:number,source?:AppraisalItem):AppraisalItem {
  const config=state.config;
  let pool=merchantKinds(npc,config.catalogVersion??1,!!config.cleanse,!!config.challenge,expansionActive(config),!!config.polish,!!config.trustAbilities);
  if(source && pool.length>1)pool=pool.filter(kind=>kind!==source.kind);
  const offered=new Set(Object.values(state.items).filter(i=>i.owner===`ability-choice:${p.id}`).map(i=>i.kind));
  const fresh=pool.filter(kind=>!offered.has(kind));if(fresh.length)pool=fresh;
  const kind=pool[Math.floor(randomAt(state.seed,`${key}:${slot}:kind`)*pool.length)]!;
  const id=`ability-${key}-${slot}`;
  const anchor=anchorOf(config,kind),range=priceRange(kind,anchor);
  const base=range[0]+Math.floor(randomAt(state.seed,`${id}:base`)*(range[1]-range[0]+1));
  const ask=Math.max(1,anchor-2+Math.floor(randomAt(state.seed,`${id}:ask`)*6));
  const item:AppraisalItem={id,kind,base,ask,genuine:randomAt(state.seed,`${id}:genuine`)<.75,cursed:randomAt(state.seed,`${id}:cursed`)<.35,owner:`ability-choice:${p.id}`,npcOwnerId:p.id,npc,encounter:state.encounter,certificate:false,lastAppraisal:null,lastAccepted:null,reservation:Math.max(1,Math.ceil(base*NPC_SPECS[npc].reservation[0]))};
  ensureItemAppearance(state,item);
  if(source){
    // Preserve quality instead of laundering fakes/curses; the new item cannot create score value.
    item.genuine=source.genuine;item.cursed=source.cursed;
    const ceiling=itemScoreValue(source.base,source.genuine,source.cursed,false);
    while(item.base>0 && itemScoreValue(item.base,item.genuine,item.cursed,false)>ceiling)item.base--;
    item.ask=Math.min(item.ask,source.ask);
  }
  state.items[id]=item;return item;
}
function retireChoices(state:AppraisalState,p:Appraiser,keep:string):void {
  for(const id of p.abilityChoice?.itemIds??[])if(id!==keep && state.items[id]?.owner===`ability-choice:${p.id}`)state.items[id]!.owner='retired';
}
export function settleAbilityChoice(state:AppraisalState,p:Appraiser,choiceId:string):void {
  const choice=p.abilityChoice;
  check(choice && choice.itemIds.includes(choiceId),'ability-choice','เลือกสินค้าที่เสนอให้เท่านั้น');
  const source=state.items[choice.sourceId]!;
  if(choice.npc==='alien'){
    ownedItem(state,p,source.id,true);
    const chosen=state.items[choiceId]!;check(chosen.owner===`ability-choice:${p.id}`,'ability-choice','สินค้านี้ไม่อยู่ในข้อเสนอ');
    const facts=known(state,p,source.id);retire(state,p,source.id,'alien-exchange');
    chosen.owner=p.id;p.inventory.push(chosen.id);
    learn(p,chosen.id,{...(facts.base!==undefined?{base:chosen.base}:{}),...(facts.genuine!==undefined?{genuine:chosen.genuine}:{}),...(facts.cursed!==undefined?{cursed:chosen.cursed}:{}),...(facts.effectsKnown?{effectsKnown:true}:{})});
  }else{
    stockItem(state,p,source.id);
    if(choiceId!==source.id){
      const chosen=state.items[choiceId]!;check(chosen.owner===`ability-choice:${p.id}`,'ability-choice','สินค้านี้ไม่อยู่ในข้อเสนอ');
      source.owner='retired';chosen.owner=`npc:${p.id}:${state.encounter}`;p.stock=p.stock.map(id=>id===source.id?chosen.id:id);
      const portal=p.portals.find(v=>v.id===p.selectedPortalId);if(portal)portal.stock=portal.stock.map(id=>id===source.id?chosen.id:id);
      state.listings=state.listings.filter(l=>l.itemId!==source.id);
    }
  }
  retireChoices(state,p,choiceId);delete p.abilityChoice;
  trace(state,p,'ability-choice-selected',{npc:choice.npc,sourceId:source.id,choiceId});
}
export function finishAbilityChoice(state:AppraisalState,p:Appraiser):void {
  if(p.abilityChoice)settleAbilityChoice(state,p,p.abilityChoice.itemIds[0]!);
}
export function useMerchantAbility(state:AppraisalState,p:Appraiser,action:Extract<AppraisalAction,{type:'merchant-ability'}>):void {
  check(state.config.trustAbilities && activeNpcs(state).includes(action.npc),'ability','ห้องนี้ไม่มีความสามารถที่เลือก');
  if(action.choiceId){check(p.abilityChoice?.npc===action.npc,'ability-choice','ไม่มีข้อเสนอของพ่อค้านี้');settleAbilityChoice(state,p,action.choiceId);return;}
  const view=merchantAbilityViews(state,p).find(v=>v.npc===action.npc)!;
  check(view.ready,'ability',view.reason??'ความสามารถยังไม่พร้อม');
  const npc=action.npc,tier=view.tier;
  const target=()=>{check(action.itemId && view.itemIds.includes(action.itemId),'ability-target','เลือกสินค้าที่ใช้ความสามารถนี้ได้');return state.items[action.itemId]!;};
  switch(npc){
    case 'orc': {const item=target();p.orcDeal={itemId:item.id,percent:[10,15,20][tier]!,encounter:state.encounter};break;}
    case 'autometa': {const item=target();learn(p,item.id,{base:item.base,...(tier>=1?{genuine:item.genuine}:{}),...(tier>=2?{cursed:item.cursed,effectsKnown:true}:{})});break;}
    case 'vampire': {const item=target();p.preserveItemId=item.id;if(tier)recover(state,p,tier,'vampire-preserve');break;}
    case 'darkone': {check(action.statusId && view.statusIds.includes(action.statusId),'ability-target','เลือก debuff ที่มีอยู่');removeStatus(p,action.statusId);if(tier>=1)recover(state,p,1,'darkone-release');if(tier>=2)grant(state,p,'B06');break;}
    case 'deepsea': {const item=target();item.cursed=false;for(const seat of state.players)if(seat.knowledge[item.id]?.cursed!==undefined)seat.knowledge[item.id]!.cursed=false;if(state.publicKnowledge[item.id]?.cursed!==undefined)state.publicKnowledge[item.id]!.cursed=false;learn(p,item.id,{cursed:false,...(tier>=1?{genuine:item.genuine}:{}),...(tier>=2?{base:item.base}:{})});break;}
    case 'swarm': {
      const item=target(),percent=[25,35,50][tier]!;
      const id=`copy-${item.id}-1`;
      check(!state.items[id],'ability-copy','ต้นฉบับนี้เคยมีสำเนาแล้ว');
      const copy:AppraisalItem={...item,id,base:Math.floor(item.base*percent/100),ask:Math.floor(item.ask*percent/100),reservation:0,owner:p.id,certificate:false,lastAppraisal:null,lastAccepted:null,copy:{sourceId:item.id,number:Object.values(state.items).filter(i=>i.copy).length+1,valuePercent:percent}};
      delete copy.appraisedBy;delete copy.commissionPaid;delete copy.preserved;delete copy.copyConsumed;
      state.items[id]=copy;p.inventory.push(id);
      const facts=known(state,p,item.id);learn(p,id,{...(facts.base!==undefined?{base:copy.base}:{}),...(facts.genuine!==undefined?{genuine:copy.genuine}:{}),...(facts.cursed!==undefined?{cursed:copy.cursed}:{}),...(facts.effectsKnown?{effectsKnown:true}:{})});break;
    }
    case 'alien': case 'beast': {
      const source=target(),key=`${state.encounter}-${p.id}-${npc}`;
      const count=2+tier+(npc==='beast'&&status(p,'B26')?1:0),itemIds:string[]=[];
      // Beast replaces a shop slot. Alien swaps an owned item, never the number of owned goods.
      if(npc==='beast')itemIds.push(source.id);
      for(let i=0;i<count-(npc==='beast'?1:0);i++)itemIds.push(makeCandidate(state,p,npc==='beast'?source.npc:npc,key,i,npc==='alien'?source:undefined).id);
      p.abilityChoice={npc,sourceId:source.id,itemIds};
      if(npc==='alien'){state.listings=state.listings.filter(l=>l.itemId!==source.id);for(const offer of state.trades)if(offer.status==='open' && (offer.itemId===source.id||offer.swapItemId===source.id))offer.status='rejected';}if(npc==='beast')removeStatus(p,'B26');break;
    }
  }
  const haste=statusMagnitude(p,'B25',1),delay=statusMagnitude(p,'D25',2);
  p.abilityReady??={};p.abilityLastUsed??={};p.abilityAdjusted??={};
  p.abilityReady[npc]=state.encounter+Math.max(1,MERCHANT_ABILITIES[npc].cooldown-haste+delay);
  p.abilityLastUsed[npc]=state.encounter;p.abilityAdjusted[npc]=haste;p.skillUsed=true;
  removeStatus(p,'B25');removeStatus(p,'D25');
  p.notes.push(`ใช้ ${view.name} · พร้อมอีกครั้งช่วง ${p.abilityReady[npc]}`);p.notes=p.notes.slice(-30);
  trace(state,p,'merchant-ability-used',{npc,tier,itemId:action.itemId??null,readyAt:p.abilityReady[npc]});
}
export const isAbilityItem=(kind:string)=>(ABILITY_ITEM_IDS as readonly string[]).includes(kind);
