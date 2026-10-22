import { randomAt } from '../random.js';
import { NPC_SPECS } from './content.js';
import { CORE2, anchorOf } from './core2.js';
import { check, damageLife, grant, learn, omenNow, ownedItem, purchase, recover, removeStatus, spend, status, stockItem, trace, transfer, consumeStatus } from './mechanics.js';
import type { AppraisalState, Appraiser, Core2Actions, NpcId } from './types.js';

const note=(p:Appraiser,text:string)=>{p.notes.push(text);p.notes=p.notes.slice(-30);};
const clamp=(n:number)=>Math.max(.1,Math.min(.9,n));
/** Theft is one attempt per seat per encounter, so a failed try is a real loss and a spam loop is closed. */
function startTheft(state:AppraisalState,p:Appraiser,target:string):void {
  check(state.config.core2 && !p.eventOffer && !p.stealTried?.length,'steal','ขโมยได้ครั้งเดียวต่อช่วง');
  (p.stealTried??=[]).push(target);
}
const trustOf=(p:Appraiser,npc:NpcId)=>p.npcTrust?.[npc]??0;
function loseTrust(p:Appraiser,npc:NpcId,amount:number):void {
  if(p.npcTrust)p.npcTrust[npc]=Math.max(0,trustOf(p,npc)-amount);
}
/** Chance of a theft succeeding: the base, trust with the merchant, the night's omen, nimble fingers and a watchful eye. */
export function stealChance(state:AppraisalState,p:Appraiser,npc?:NpcId,friend=false):number {
  return clamp(CORE2.steal.base+(npc?CORE2.steal.perTrust*trustOf(p,npc):0)+(omenNow(state)?.steal??0)/100+(status(p,'B22')?.25:0)-(status(p,'D21')?.15:0)+(friend?CORE2.steal.friend:0));
}

/** Take a shop item without paying. A catch costs a heavy penalty that can be paid in credits, energy, an item or life. */
export function stealShop(state:AppraisalState,p:Appraiser,itemId:string):void {
  const item=stockItem(state,p,itemId);
  startTheft(state,p,itemId);spend(state,p,0,CORE2.steal.energy,'steal');
  const chance=stealChance(state,p,item.npc);
  const ok=randomAt(state.seed,`${state.encounter}:${p.id}:steal:${itemId}`)<chance;
  consumeStatus(p,'B22');
  if(ok){
    item.owner=p.id;item.stolen=true;p.inventory.push(itemId);p.stock=p.stock.filter(id=>id!==itemId);
    state.listings=state.listings.filter(l=>l.itemId!==itemId);
    note(p,`ฉกสำเร็จ: ได้ ${NPC_SPECS[item.npc].name}ขายของชิ้นนี้ไปฟรี แต่ขายต่อไม่ได้`);
    trace(state,p,'stolen',{itemId,chance});return;
  }
  loseTrust(p,item.npc,1);p.theft={kind:'shop'};
  note(p,`ฉกพลาด! ${NPC_SPECS[item.npc].name}จับมือไว้ได้`);
  trace(state,p,'steal-failed',{itemId,chance});
}

/** Lift a few credits from a friend's pouch. A guard (B21) stops it; a failure pays them back. */
export function pickpocket(state:AppraisalState,p:Appraiser,victimId:string):void {
  const victim=state.players.find(v=>v.id===victimId);
  check(victim && victim.id!==p.id && !victim.paused && victim.credits>0 && ['APPRAISAL','TRADE'].includes(state.phase),'steal','ล้วงกระเป๋าคนนี้ไม่ได้');
  startTheft(state,p,`p:${victimId}`);spend(state,p,0,CORE2.steal.energy,'pickpocket');
  const guarded=!!status(victim,'B21');
  const chance=stealChance(state,p,undefined,true);
  const ok=!guarded && randomAt(state.seed,`${state.encounter}:${p.id}:pickpocket:${victimId}`)<chance;
  consumeStatus(p,'B22');
  if(ok){
    const taken=Math.min(3,victim.credits);transfer(state,victim,p,taken,'pickpocket');
    note(p,`ล้วงกระเป๋าเพื่อนได้ ${taken} เครดิต`);note(victim,`มีคนล้วงกระเป๋าคุณไป ${taken} เครดิต`);
    trace(state,p,'pickpocketed',{victimId,taken,chance});return;
  }
  if(guarded){consumeStatus(victim,'B21');note(victim,'ผู้คุ้มกันจับมือโจรไว้ได้');}
  p.theft={kind:'player',victim:victim.id};
  note(p,'ล้วงพลาด! เพื่อนจับข้อมือไว้ได้');
  trace(state,p,'pickpocket-failed',{victimId,chance});
}

/** Swap one of your goods for a shop good with no credits. Offering fake or cursed goods risks being caught. */
export function barter(state:AppraisalState,p:Appraiser,itemId:string,targetItemId:string):void {
  const mine=ownedItem(state,p,itemId,true);const target=stockItem(state,p,targetItemId);
  const npc=NPC_SPECS[target.npc];
  check(npc.favorite.includes(mine.kind) || anchorOf(state.config,mine.kind)>=target.ask,'barter','ของที่เสนอมูลค่าไม่พอสำหรับแลก');
  check(!mine.stolen,'stolen','ของที่ฉกมาแลกไม่ได้');
  const suspicious=!mine.genuine || mine.cursed;
  if(suspicious && randomAt(state.seed,`${state.encounter}:${p.id}:barter:${itemId}`)<CORE2.barter.detect){
    spend(state,p,0,CORE2.barter.energy,'barter-caught');loseTrust(p,target.npc,1);p.theft={kind:'shop'};
    note(p,`${npc.name}ตรวจพบว่าของที่เสนอมีตำหนิ แลกไม่สำเร็จ`);trace(state,p,'barter-caught',{itemId});return;
  }
  purchase(state,p,p,[targetItemId],{barterItemId:itemId,condition:p.dealMode==='condition'});
  note(p,`แลก ${npc.name} สำเร็จโดยไม่เสียเครดิต`);
}

type Skill={name:string;needsItem?:boolean};
export const SKILLS:Record<NpcId,Skill>={
  orc:{name:'เกียรติของออร์ก: เปิดราคาจริงของสินค้า 1 ชิ้น',needsItem:true},
  vampire:{name:'พิธีเลือด: เสียชีวิต 1 หรือเครดิต 2 แลกพลัง 3'},
  autometa:{name:'สแกนจักรกล: เปิดความแท้ของสินค้า 1 ชิ้น',needsItem:true},
  alien:{name:'แปลภาษาต่างดาว: เปิดผลและคำสาปของสินค้า 1 ชิ้น',needsItem:true},
  darkone:{name:'สัญญาล้างบาป: เสียชีวิต 1 หรือเครดิต 3 ลบ debuff 1 อย่าง'},
  beast:{name:'ก้าวเบา: การตรวจสองครั้งถัดไปประหยัดพลัง'},
  deepsea:{name:'หายใจใต้น้ำ: การฟื้นพลังครั้งถัดไปแรงขึ้น'},
  swarm:{name:'ฝูงหนุนหลัง: Dark Market ครั้งถัดไปได้ราคาดี'},
};
export const skillNpc=(state:AppraisalState,p:Appraiser)=>p.stock[0]?state.items[p.stock[0]]?.npc:undefined;
/** The skill is offered only while its price can be paid, so a seat never sees a button that must fail. */
function skillPayable(state:AppraisalState,p:Appraiser,npc:NpcId):boolean {
  const life=!!state.config.survival && p.life!==undefined;
  switch(npc) {
    case 'vampire': return life?p.life!>1:p.credits>=2;
    case 'darkone': return p.statuses.some(s=>s.id.startsWith('D')) && (life?p.life!>1:p.credits>=3);
    default: return p.energy>=1;
  }
}
export const skillOpen=(state:AppraisalState,p:Appraiser)=>{const npc=skillNpc(state,p);return !!state.config.core2 && !!npc && !p.skillUsed && trustOf(p,npc)>=CORE2.skill.trust && skillPayable(state,p,npc);};

/** The merchant's own talent, earned with trust: free to use once per encounter, and stronger at high trust. */
export function useSkill(state:AppraisalState,p:Appraiser,itemId?:string):void {
  check(skillOpen(state,p),'skill','ความสามารถนี้ยังไม่พร้อมใช้');
  const npc=skillNpc(state,p)!;const strong=trustOf(p,npc)>=CORE2.skill.strong;
  const life=!!state.config.survival && p.life!==undefined;
  const target=()=>{check(itemId,'skill','เลือกสินค้าของร้านนี้');return stockItem(state,p,itemId);};
  switch(npc) {
    case 'orc': {const item=target();spend(state,p,0,1,'skill');learn(p,item.id,{base:item.base,...(strong?{genuine:item.genuine}:{})});break;}
    case 'vampire': {
      if(life){check(p.life!>1,'skill','ชีวิตไม่พอ');damageLife(state,p,1,'vampire-rite');}else spend(state,p,2,0,'vampire-rite');
      recover(state,p,strong?4:3,'vampire-rite');break;
    }
    case 'autometa': {const item=target();spend(state,p,0,1,'skill');learn(p,item.id,{genuine:item.genuine,...(strong?{effectsKnown:true}:{})});break;}
    case 'alien': {const item=target();spend(state,p,0,1,'skill');learn(p,item.id,{effectsKnown:true,cursed:item.cursed,...(strong?{genuine:item.genuine}:{})});break;}
    case 'darkone': {
      const debuff=p.statuses.find(s=>s.id.startsWith('D'));check(debuff,'skill','ไม่มี debuff ให้ลบ');
      if(life){check(p.life!>1,'skill','ชีวิตไม่พอ');damageLife(state,p,1,'darkone-pact');}else spend(state,p,3,0,'darkone-pact');
      removeStatus(p,debuff.id);if(strong)grant(state,p,'B06');break;
    }
    case 'beast': spend(state,p,0,1,'skill');grant(state,p,'B05');if(strong)grant(state,p,'B11');break;
    case 'deepsea': spend(state,p,0,1,'skill');grant(state,p,'B14');if(strong)grant(state,p,'B13');break;
    case 'swarm': spend(state,p,0,1,'skill');grant(state,p,'B13');if(strong)grant(state,p,'B15');break;
  }
  p.skillUsed=true;note(p,`ใช้ความสามารถ: ${SKILLS[npc].name}`);trace(state,p,'skill',{npc,strong});
}

/** What the seat's own view shows about the v0.6 actions. Odds are public rules, never hidden state. */
export function core2ActionsOf(state:AppraisalState,p:Appraiser):Core2Actions {
  const npc=skillNpc(state,p);const open=skillOpen(state,p);
  return {
    theftUsed:!!p.stealTried?.length,trustForSkill:CORE2.skill.trust,
    ...(open && npc?{skill:{npc,name:SKILLS[npc].name,needsItem:!!SKILLS[npc].needsItem,strong:trustOf(p,npc)>=CORE2.skill.strong}}:{}),
    ...(npc?{stealChance:stealChance(state,p,npc)}:{}),pickpocketChance:stealChance(state,p,undefined,true),
  };
}
