import { remainingHeld } from './remaining48-effects.js';
import { remainingStrength } from './remaining48-numbers.js';
import { trace } from './mechanics.js';
import type { AppraisalItem, AppraisalState, Appraiser } from './types.js';

const enabled=(state:AppraisalState)=>state.config.catalogVersion===5&&(state.config.native56Effects??0)>=15;

function grantEntry(state:AppraisalState,p:Appraiser){
  return state.trace.find(e=>e.encounter===state.encounter&&e.type==='e53-permit'&&e.playerId===p.id);
}

export function sealInspectionTool(state:AppraisalState,p:Appraiser):string|undefined {
  if(!enabled(state)||grantEntry(state,p))return;
  return remainingHeld(state,p,'E53').find(item=>!item.copy&&remainingStrength([item],'E53')>=1)?.id;
}

export function grantSealInspection(state:AppraisalState,p:Appraiser,item:AppraisalItem,toolId:string|undefined):void {
  if(toolId&&!item.copy)trace(state,p,'e53-permit',{itemId:item.id,toolId});
}

export function sealInspectionFree(state:AppraisalState,p:Appraiser,itemId:string):boolean {
  if(!enabled(state)||state.phase==='RESULTS'||state.phase==='REVEAL'||p.life===0||p.paused==='dead')return false;
  const entry=grantEntry(state,p);
  if(!entry||entry.details.itemId!==itemId||state.items[itemId]?.owner!==p.id||!p.inventory.includes(itemId))return false;
  return remainingHeld(state,p,'E53').some(item=>item.id===entry.details.toolId)
    &&!state.trace.some(e=>e.encounter===state.encounter&&e.playerId===p.id&&e.type==='e53-permit-ended');
}

export function reconcileE53(state:AppraisalState):void {
  if(!enabled(state))return;
  for(const p of state.players){
    const entry=grantEntry(state,p);
    if(entry&&typeof entry.details.itemId==='string'&&!sealInspectionFree(state,p,entry.details.itemId)
      &&!state.trace.some(e=>e.encounter===state.encounter&&e.playerId===p.id&&e.type==='e53-permit-ended')){
      trace(state,p,'e53-permit-ended',{itemId:entry.details.itemId});
    }
  }
}
