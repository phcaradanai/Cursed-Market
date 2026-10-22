import { randomAt } from '../random.js';
import { ITEM_SPECS } from './content.js';
import { check, damageLife, grant, healLife, penaltyItem, recover, reward, spend, status, trace, transfer } from './mechanics.js';
import type { AppraisalAction, AppraisalState, Appraiser, EventId, EventOffer } from './types.js';

export { CORE2_SPECS, core2Spec, isCore2Consequence } from './core2-specs.js';
export type { Core2Choice, Core2EventSpec } from './core2-specs.js';
import { CORE2_SPECS, FALLBACK_BRAND } from './core2-specs.js';
export { FALLBACK_BRAND };
import type { Core2Choice, Core2EventSpec } from './core2-specs.js';
/** Events a seat may meet by chance (the penalties are only drawn by their cause). */
export const CORE2_DRAW_IDS:readonly EventId[]=['E117','E118','E119','E125','E126','E127','E128','E129'];
export const CORE2_BACKLASH_IDS:readonly EventId[]=['E120','E121','E122'];

const hasLoseChoice=(spec:Core2EventSpec)=>spec.choices.some(c=>c.lose);
const needsItem=(spec:Core2EventSpec,choice:string)=>!!spec.choices.find(c=>c.id===choice)?.lose;
export const core2NeedsItem=(id:EventId,choice:string)=>{const spec=CORE2_SPECS[id];return !!spec && needsItem(spec,choice);};

/** Can this seat pay for the choice right now? A fine never offers a price that would kill the payer. */
function affordable(state:AppraisalState,p:Appraiser,c:Core2Choice):boolean {
  if(c.credits && p.credits<c.credits)return false;
  if(c.energy && p.energy<c.energy)return false;
  if(c.life && (!state.config.survival || p.life===undefined || p.life<=c.life))return false;
  if(c.lose && !p.inventory.length)return false;
  if(c.reward && state.bank-state.market.budget-state.reservedRewards<c.reward)return false;
  if(c.heal && state.config.survival && p.life!==undefined && p.life>=(state.config.survival.maxLife))return false;
  return true;
}
export function core2EventChoices(state:AppraisalState,p:Appraiser,id:EventId):string[] {
  const spec=CORE2_SPECS[id]!;
  const open=spec.choices.filter(c=>c.id==='decline' || affordable(state,p,c)).map(c=>c.id);
  if(spec.consequence){return open.length?open:[FALLBACK_BRAND.id];}
  if(spec.phase==='PORTALS' && !open.length)return [FALLBACK_BRAND.id];
  return open;
}
export function core2EventEligible(state:AppraisalState,p:Appraiser,id:EventId):boolean {
  const spec=CORE2_SPECS[id];
  if(!spec || !state.config.core2 || p.paused || p.done || ['REVEAL','RESULTS'].includes(state.phase))return false;
  if(spec.consequence){
    if(p.consequenceSlots>=1)return false;
    if(CORE2_BACKLASH_IDS.includes(id))return !!p.inflated;
    return !!p.theft && (id==='E123'?p.theft.kind==='shop':p.theft.kind==='player' && !!p.theft.victim);
  }
  if(state.phase!==spec.phase)return false;
  if(spec.phase==='PORTALS')return p.portals.filter(v=>!v.disabled).length>1 && core2EventChoices(state,p,id).some(c=>c!==FALLBACK_BRAND.id);
  if(id==='E125')return p.stock.length>0 && !Object.keys(p.valuations).length && !status(p,'B01');
  if(id==='E126')return (state.config.survival?p.life!==undefined && p.life<state.config.survival.maxLife:p.energy<state.config.maxEnergy) && p.credits>=3;
  if(id==='E127')return state.bank-state.market.budget-state.reservedRewards>=5 && !status(p,'D04');
  if(id==='E128')return p.inventory.length>0 && !status(p,'B06') && !status(p,'B19');
  if(id==='E129')return p.stock.length>0 && !Object.keys(p.valuations).length && !status(p,'B04') && !status(p,'D03');
  return true;
}
/** Which backlash event fits the run: later and more extreme appraisals draw the harsher courts. */
export function pickBacklash(state:AppraisalState,p:Appraiser):EventId {
  const weights=[3,2,1+Math.floor((state.encounter-1)/3)];
  const total=weights.reduce((a,b)=>a+b,0);
  let roll=randomAt(state.seed,`${state.encounter}:${p.id}:backlash:pick`)*total;
  for(const [index,weight] of weights.entries()){roll-=weight;if(roll<0)return CORE2_BACKLASH_IDS[index]!;}
  return CORE2_BACKLASH_IDS[0]!;
}

/** Pay for a choice. Items go through the seizure check so B07 still protects. */
export function resolveCore2Event(state:AppraisalState,p:Appraiser,offer:EventOffer,command:Extract<AppraisalAction,{type:'event'}>):void {
  const spec=CORE2_SPECS[offer.id]!;const choice=command.choice;
  const picked:Core2Choice|undefined=choice===FALLBACK_BRAND.id?FALLBACK_BRAND:spec.choices.find(c=>c.id===choice);
  check(picked,'event-choice','ไม่มีตัวเลือกนี้');
  if(choice!=='decline' && choice!==FALLBACK_BRAND.id)check(affordable(state,p,picked),'event-cost','จ่ายตัวเลือกนี้ไม่ไหวแล้ว');
  if(picked.lose){
    check(command.itemId && offer.itemIds.includes(command.itemId),'event-target','เลือกสินค้าที่จะสละ');
    penaltyItem(state,p,command.itemId);
  }
  const victim=picked.toVictim && p.theft?.victim?state.players.find(v=>v.id===p.theft!.victim):undefined;
  if(picked.credits){
    if(victim)transfer(state,p,victim,picked.credits,spec.id);else spend(state,p,picked.credits,0,spec.id);
  }
  if(picked.energy)spend(state,p,0,picked.energy,spec.id);
  if(picked.life)damageLife(state,p,picked.life,spec.id);
  if(picked.heal){if(state.config.survival)healLife(state,p,picked.heal,spec.id);else recover(state,p,3,spec.id);}
  if(picked.reward)reward(state,p,picked.reward,spec.id);
  for(const s of picked.grant??[])grant(state,p,s);
  if(picked.door)p.portals.forEach((portal,index)=>{if(index===(picked.door==='first'?1:0))portal.disabled=true;});
  if(picked.deal)p.dealMode=picked.deal;
  if(spec.consequence){delete p.inflated;delete p.theft;}
  p.notes.push(`${spec.name}: ${choice}`);p.notes=p.notes.slice(-30);
  trace(state,p,'core2-event',{id:spec.id,choice});
}
/** Items a choice may sacrifice; empty when the event takes none. */
export const core2EventItems=(id:EventId,p:Appraiser)=>CORE2_SPECS[id] && hasLoseChoice(CORE2_SPECS[id]!)?[...p.inventory]:[];
export const core2ItemName=(state:AppraisalState,itemId:string)=>ITEM_SPECS[state.items[itemId]!.kind].name;
