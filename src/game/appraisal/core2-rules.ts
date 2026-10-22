import { randomAt } from '../random.js';
import { consignPayout, dreadChance, dreadKinds, dreadTax, overvalueChance } from './core2.js';
import { ITEM_SPECS } from './content.js';
import { consumeStatus, damageLife, grant, healLife, omenNow, recover, retire, spend, status, trace, unlocked } from './mechanics.js';
import type { AppraisalState, Appraiser } from './types.js';

const note=(p:Appraiser,text:string)=>{p.notes.push(text);p.notes=p.notes.slice(-30);};

/** The chance a living seat draws a dread affliction at settlement, shown to every seat. */
export const dreadNow=(state:AppraisalState,p?:Appraiser)=>dreadChance(state.encounter,(omenNow(state)?.dread??1)*(p && status(p,'B23')?.5:1));

/**
 * Settlement pressure: every living seat rolls against a chance that grows with the run. A hit is one of a few
 * afflictions, each payable in a different currency, so a table can never feel safe for long.
 */
export function applyDread(state:AppraisalState,p:Appraiser):void {
  if(!state.config.core2 || !state.config.survival || p.life===0 || p.paused==='dead')return;
  const chance=dreadNow(state,p);
  if(randomAt(state.seed,`${state.encounter}:${p.id}:dread`)>=chance)return;
  const movable=p.inventory.filter(id=>unlocked(p,id));
  const pool=dreadKinds(state.encounter,true,movable.length>0);
  const kind=pool[Math.floor(randomAt(state.seed,`${state.encounter}:${p.id}:dread:kind`)*pool.length)]!;
  switch(kind) {
    case 'storm': damageLife(state,p,1,'dread-storm');note(p,'พายุมิติซัดใส่: เสียชีวิต 1');break;
    case 'tax': {const paid=Math.min(p.credits,dreadTax(state.encounter));if(paid)spend(state,p,paid,0,'dread-tax');note(p,`ผู้เก็บภาษีเงาบุกโต๊ะ: เสียเครดิต ${paid}`);break;}
    case 'rot': {
      const itemId=movable[Math.floor(randomAt(state.seed,`${state.encounter}:${p.id}:dread:item`)*movable.length)]!;
      if(status(p,'B07')){consumeStatus(p,'B07');note(p,'ของเกือบถูกยึด แต่กรมธรรม์พ่อค้าคุ้มครองไว้');}
      else {const name=ITEM_SPECS[state.items[itemId]!.kind].name;retire(state,p,itemId,'dread-rot',false);note(p,`${name}ผุพังหายไปในความมืด`);}
      break;
    }
    case 'wound': if(status(p,'D20')){recover(state,p,0,'dread');p.energy=Math.max(0,p.energy-2);note(p,'แผลเก่าเปิดซ้ำ: เสียพลัง 2');}else {grant(state,p,'D20');note(p,'แผลเปิด: ความเสียหายถัดไปหนักขึ้น 1');}break;
    case 'fatigue': {const lost=Math.min(2,p.energy);p.energy-=lost;note(p,`ความอ่อนล้าจากมิติ: เสียพลัง ${lost}`);break;}
  }
  trace(state,p,'dread-hit',{kind,chance});
}

/** Omens that hurt every living seat at settlement (core v0.6). */
export function applyOmenPressure(state:AppraisalState,p:Appraiser):void {
  const omen=omenNow(state);
  if(!state.config.core2 || !omen || p.paused==='dead' || p.life===0)return;
  if(omen.settleLife && state.config.survival){damageLife(state,p,omen.settleLife,'omen');note(p,`${omen.name}: เสียชีวิต ${omen.settleLife}`);}
  if(omen.taxPct){const paid=Math.floor(p.credits*omen.taxPct/100);if(paid){spend(state,p,paid,0,'omen-tax');note(p,`${omen.name}: ภาษีเงา ${paid} เครดิต`);}}
}

/** Settlement effects of the v0.6 statuses and omens, applied to every living seat before the decay. */
export function applyCore2Settlement(state:AppraisalState,p:Appraiser):void {
  if(p.paused==='dead' || state.config.survival && p.life===0)return;
  if(status(p,'D22')){const paid=Math.min(3,p.credits);if(paid)spend(state,p,paid,0,'torn-pouch');consumeStatus(p,'D22');note(p,`กระเป๋าฉีก: เสียเครดิต ${paid}`);}
  if(status(p,'D23')){
    consumeStatus(p,'D23');
    if(state.config.survival){damageLife(state,p,1,'bleeding');note(p,'เลือดไหลไม่หยุด: เสียชีวิต 1');}
    else {p.energy=Math.max(0,p.energy-2);note(p,'เลือดไหลไม่หยุด: เสียพลัง 2');}
  }
  applyOmenPressure(state,p);
  if(state.config.survival && p.life===0)return;
  if(status(p,'B24')){
    consumeStatus(p,'B24');
    if(state.config.survival && p.life!==undefined){healLife(state,p,1,'blessing');note(p,'พรปลอบชีพ: ฟื้นชีวิต 1');}
    else {recover(state,p,2,'blessing',true);note(p,'พรปลอบชีพ: ฟื้นพลัง 2');}
  }
}

export const resetCore2Encounter=(p:Appraiser)=>{delete p.scrapPaid;delete p.inflated;delete p.stealTried;delete p.skillUsed;delete p.theft;};

export {consignPayout,overvalueChance};
