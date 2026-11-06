import { itemEffectScale } from './copy-effects.js';
import { check, ownedItem, spend, trace, unlocked } from './mechanics.js';
import { REMAINING48_ITEMS } from './remaining48-catalog.js';
import { merchantTradeBanned } from './theft.js';
import type { AppraisalItem, AppraisalState, Appraiser, EventId, Portal } from './types.js';

const enabled=(state:AppraisalState)=>state.config.catalogVersion===5&&(state.config.native56Effects??0)>=15;

export function closeEventPortal(state:AppraisalState,portal:Portal,event:EventId):void {
  if(enabled(state)&&!portal.disabled)portal.causeEventId=event;
  portal.disabled=true;
}

export function portalClue(state:AppraisalState,p:Appraiser,portal:Portal) {
  const clue=p.native56PortalClue;
  return clue?.encounter===state.encounter&&clue.portalId===portal.id&&clue.itemId===portal.stock[1]?clue.kind:undefined;
}

export function portalToolTargets(state:AppraisalState,p:Appraiser,item:AppraisalItem):Portal[] {
  if(!enabled(state)||state.phase!=='PORTALS'||p.selectedPortalId||p.eventOffer||p.done||p.paused||p.life===0||
    item.owner!==p.id||!p.inventory.includes(item.id)||!unlocked(p,item.id)||itemEffectScale(item)<1)return [];
  if(!Object.hasOwn(REMAINING48_ITEMS,item.kind))return [];
  const spec=REMAINING48_ITEMS[item.kind as keyof typeof REMAINING48_ITEMS];
  if(spec.nativeEffect==='effect:E35'&&p.native56PortalClue?.encounter!==state.encounter)
    return p.portals.filter(portal=>!!state.items[portal.stock[1]!]&&!portalClue(state,p,portal));
  if(spec.nativeEffect==='effect:E36'&&p.native56PortalReopenAt!==state.encounter&&!merchantTradeBanned(state,p))
    return p.portals.filter(portal=>portal.disabled&&portal.causeEventId!==undefined);
  return [];
}

export function activatePortalTool(state:AppraisalState,p:Appraiser,itemId:string,portalId:string):void {
  const item=ownedItem(state,p,itemId,true);
  const portal=portalToolTargets(state,p,item).find(candidate=>candidate.id===portalId);
  check(portal,'portal-target','เลือกประตูที่ใช้สินค้านี้ได้');
  spend(state,p,0,1,'activate');
  if(item.kind==='beast-rift-saddle'){
    const causeEventId=portal.causeEventId;
    portal.disabled=false;
    delete portal.causeEventId;
    p.native56PortalReopenAt=state.encounter;
    trace(state,p,'native56-portal-reopened',{itemId,portalId,causeEventId});
  }else{
    const stock=state.items[portal.stock[1]!]!;
    p.native56PortalClue={encounter:state.encounter,portalId,itemId:stock.id,kind:stock.kind};
    trace(state,p,'native56-portal-clue',{itemId,portalId});
  }
}
