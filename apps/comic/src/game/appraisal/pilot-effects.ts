import {integerEffect,itemEffectScale} from './copy-effects.js';
import type {AppraisalItem,AppraisalState,Appraiser,PilotItemKind} from './types.js';

/** Public kind and actual custody only; never inspect hidden truth for held effects. */
export function pilotHeld(state:AppraisalState,p:Appraiser,kind:PilotItemKind):AppraisalItem[] {
  if((state.config.catalogVersion!==4 && state.config.catalogVersion!==5) || p.life===0 || p.paused==='dead')return [];
  return p.inventory.map(id=>state.items[id]!).filter(i=>i?.kind===kind && i.owner===p.id && !p.npcContracts?.alien?.itemIds.includes(i.id))
    .sort((a,b)=>itemEffectScale(b)-itemEffectScale(a)||a.id.localeCompare(b.id)).slice(0,5);
}
export const pilotStrength=(state:AppraisalState,p:Appraiser,kind:PilotItemKind)=>pilotHeld(state,p,kind).reduce((n,i)=>n+itemEffectScale(i),0);
export const pilotUses=(state:AppraisalState,item:AppraisalItem)=>item.pilotUsedAt===state.encounter?item.pilotUses??0:0;
export function usePilot(state:AppraisalState,item:AppraisalItem):void {const used=pilotUses(state,item);item.pilotUsedAt=state.encounter;item.pilotUses=used+1;}
export function priceCaliper(state:AppraisalState,p:Appraiser):AppraisalItem|undefined {
  return pilotHeld(state,p,'autometa-torque-caliper').find(i=>pilotUses(state,i)<integerEffect(itemEffectScale(i)));
}
export function pilotRerollCost(state:AppraisalState,p:Appraiser,base:number):number {
  return Math.max(1,base-Math.min(2,integerEffect(pilotStrength(state,p,'deepsea-tide-compass'))));
}
export function pilotExpansionCost(state:AppraisalState,p:Appraiser,base:number):number {
  return Math.max(1,base-Math.min(Math.floor(base/2),integerEffect(2*pilotStrength(state,p,'swarm-brood-hammer'))));
}
export function pilotCrimeCost(state:AppraisalState,p:Appraiser,base:number):number {
  const discount=Math.min(5000,integerEffect(1000*pilotStrength(state,p,'darkone-crossing-token')));
  return base>0?Math.max(1,Math.floor(base*(10000-discount)/10000)):0;
}
export function heldInterestRings(state:AppraisalState,p:Appraiser):Record<string,number> {
  return Object.fromEntries(pilotHeld(state,p,'vampire-nocturne-signet').map(i=>[i.id,integerEffect(200*itemEffectScale(i))]));
}
export function ringInterestBasisPoints(state:AppraisalState,p:Appraiser,start:Record<string,number>={}):number {
  const end=heldInterestRings(state,p);
  return Math.min(400,Object.entries(start).reduce((n,[id,amount])=>n+Math.min(amount,end[id]??0),0));
}
export function swordForDuel(state:AppraisalState,p:Appraiser):AppraisalItem|undefined {
  return pilotHeld(state,p,'beast-riftfang-sword').find(i=>itemEffectScale(i)>=1 && pilotUses(state,i)===0);
}

/** Losing custody during the interval forfeits that physical ring's age evidence. */
export function reconcilePilotCustody(state:AppraisalState):void {
  if((state.config.catalogVersion!==4 && state.config.catalogVersion!==5))return;
  for(const p of state.players){const rings=p.personalVault?.interest?.rings;if(!rings)continue;const held=new Set(pilotHeld(state,p,'vampire-nocturne-signet').map(i=>i.id));for(const id of Object.keys(rings))if(!held.has(id))delete rings[id];}
}
