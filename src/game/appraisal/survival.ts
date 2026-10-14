import { check, status, trace } from './mechanics.js';
import type { AppraisalConfig, AppraisalState, CollectorResult } from './types.js';

/** Experimental numbers; the life/energy/end condition was confirmed by the user. */
export const SURVIVAL_RULES:NonNullable<AppraisalConfig['survival']>={maxLife:6,encounterLifeCost:1,entryEnergyCost:1};
/** Experimental numbers for unsold-appraisal duty, vault auctions and NPC × held-item events. */
export const BROKERAGE_RULES:NonNullable<AppraisalConfig['brokerage']>={auctionProbability:.5,maxLots:2,bondProbability:.65};
export function collectRun(state:AppraisalState):void {
  check(state.config.survival && state.players.every(p=>p.life===0),'collector','Collector รับของเมื่อทุกคนชีวิตหมดเท่านั้น');
  check(!state.collector,'collector','Collector คิดคะแนนแล้ว');
  const results:CollectorResult[]=state.players.map(p=>{
    const items=p.inventory.map(id=>{const item=state.items[id]!;return {id,kind:item.kind,base:item.base,genuine:item.genuine,cursed:item.cursed,value:Math.floor(item.base*(item.genuine?1:.25)*(item.cursed?.75:1))};});
    const itemValue=items.reduce((sum,item)=>sum+item.value,0);
    const statusIds=(['B10','D10'] as const).filter(id=>!!status(p,id));
    const modifierPercent=(statusIds.includes('B10')?20:0)-(statusIds.includes('D10')?20:0);
    const score=Math.floor((p.credits+itemValue)*(100+modifierPercent)/100);
    for(const item of items)state.items[item.id]!.owner='collector';
    p.inventory=[];p.score=score;
    trace(state,p,'collector-scored',{credits:p.credits,itemValue,modifierPercent,score,itemIds:items.map(item=>item.id),statusIds});
    return {playerId:p.id,credits:p.credits,itemValue,modifierPercent,statusIds,score,items};
  });
  state.collector=results;state.listings=[];state.phase='RESULTS';
}
