import { itemEffectScale, statusMagnitude, integerEffect } from './copy-effects.js';
import { randomAt } from '../random.js';
import { ITEM_SPECS } from './content.js';
import { cleanseChance, cleansePrice, CLEANSE_TOOLS } from './cleanse-rules.js';
import { check, consumeStatus, feeSurcharge, learn, omenNow, ownedItem, retire, spend, trace } from './mechanics.js';
import type { AppraisalState, Appraiser, CleanseOffer, ItemKind, NpcId } from './types.js';

function shopNpc(state:AppraisalState,p:Appraiser):NpcId|undefined {
  return state.config.cleanse && state.phase==='APPRAISAL' && p.selectedPortalId?p.portals.find(portal=>portal.id===p.selectedPortalId)?.npc:undefined;
}
const trustOf=(p:Appraiser,npc:NpcId)=>p.npcTrust?.[npc]??0;
function quote(state:AppraisalState,p:Appraiser,npc:NpcId,itemId:string,stoneKind?:ItemKind,stonePower=1):{price:number;chance:number} {
  const item=state.items[itemId]!;const trust=trustOf(p,npc);
  const heldItems=p.inventory.filter(id=>id!==itemId).map(id=>state.items[id]!);
  const held=heldItems.filter(i=>!i.copy).map(i=>i.kind);
  const copyTools=heldItems.filter(i=>i.kind==='smith-hammer').reduce((sum,i)=>sum+10*(itemEffectScale(i)-(i.copy?0:1)),0)+(stonePower-1)*(stoneKind==='whetstone'?20:0);
  // Polish: golden mouth takes 2 off the fee, hidden taxes add to it; the festival omen helps the odds.
  const fee=state.config.polish?feeSurcharge(state,p)-integerEffect(statusMagnitude(p,'B03',2)):0;
  const base=cleansePrice(item.kind,npc,trust,randomAt(state.seed,`${state.encounter}:${p.id}:${itemId}:cleanse-price`));
  return {price:Math.max(1,base+fee),chance:cleanseChance(npc,trust,held,stoneKind,statusMagnitude(p,'B16',20)-statusMagnitude(p,'D16',15)+(omenNow(state)?.accept??0)+copyTools)};
}
/** The merchant's standing offer for each held item. Contains no hidden curse information. */
export function cleanseOffer(state:AppraisalState,p:Appraiser):CleanseOffer|undefined {
  const npc=shopNpc(state,p);if(!npc || p.life===0) return;
  const items=p.inventory.map(itemId=>({itemId,...quote(state,p,npc,itemId),done:!!p.cleansed?.includes(itemId)}));
  return {npc,items,stoneBonus:CLEANSE_TOOLS.whetstone.bonus};
}
export function cleanseItem(state:AppraisalState,p:Appraiser,itemId:string,stoneId?:string):void {
  const npc=shopNpc(state,p);check(npc,'cleanse','พ่อค้านี้ไม่รับล้างคำสาปตอนนี้');
  const item=ownedItem(state,p,itemId);
  check(!p.cleansed!.includes(itemId),'cleanse','ชิ้นนี้ล้างคำสาปในช่วงนี้แล้ว');
  let stoneKind:ItemKind|undefined;let stonePower=1;
  if(stoneId!==undefined) {
    check(stoneId!==itemId,'cleanse','ใช้หินขัดกับตัวมันเองไม่ได้');
    const stone=ownedItem(state,p,stoneId);check(stone.kind==='whetstone','cleanse','ของที่เลือกไม่ใช่หินขัด');stoneKind=stone.kind;stonePower=itemEffectScale(stone);
  }
  const {price,chance}=quote(state,p,npc,itemId,stoneKind,stonePower);
  spend(state,p,price,0,'cleanse-curse');consumeStatus(p,'B16');if(state.config.polish)consumeStatus(p,'B03');p.cleansed!.push(itemId);
  if(stoneId) retire(state,p,stoneId,'cleanse-stone',false);
  const name=ITEM_SPECS[item.kind].name;const who='พ่อค้า';
  const wasCursed=item.cursed;
  if(!wasCursed) {
    learn(p,itemId,{cursed:false});p.notes.push(`${who}ตรวจ${name}แล้วไม่พบคำสาป เสียค่าบริการ ${price} เครดิตเปล่า`);
  } else if(randomAt(state.seed,`${state.encounter}:${p.id}:${itemId}:cleanse-roll`)*100<chance) {
    item.cursed=false;learn(p,itemId,{cursed:false});p.notes.push(`ล้างคำสาป${name}สำเร็จ (โอกาส ${chance}%) จ่าย ${price} เครดิต`);
  } else {
    learn(p,itemId,{cursed:true});p.notes.push(`ล้างคำสาป${name}ไม่สำเร็จ (โอกาส ${chance}%) จ่าย ${price} เครดิต คำสาปยังติดอยู่`);
  }
  p.notes=p.notes.slice(-30);trace(state,p,'cursed-cleanse',{itemId,npc,price,chance,stone:!!stoneId,cleansed:wasCursed && !item.cursed});
}
