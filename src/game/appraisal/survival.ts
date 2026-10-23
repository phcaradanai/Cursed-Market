import { ownedAssetItemIds, settleLoansBeforeAdvance } from './secure-storage.js';
import { statusMagnitude } from './copy-effects.js';
import { check, status, trace } from './mechanics.js';
import { collectorTotal, itemScoreValue } from './scoring.js';
import { closeNpcContracts } from './npc-events.js';
import type { AppraisalConfig, AppraisalState, CollectorResult } from './types.js';

/** Experimental numbers; the life/energy/end condition was confirmed by the user. */
export const SURVIVAL_RULES:NonNullable<AppraisalConfig['survival']>={maxLife:6,encounterLifeCost:1,entryEnergyCost:0};
/** Experimental numbers for unsold-appraisal duty, vault auctions and NPC × held-item events. */
export const BROKERAGE_RULES:NonNullable<AppraisalConfig['brokerage']>={auctionProbability:.5,maxLots:2,bondProbability:.65};
/** The Collector arrives once the deadline encounter settles, whoever is still alive. */
export const collectorDue=(state:AppraisalState):boolean=>!!state.config.survival && state.config.collectorDeadline!==undefined && state.encounter>=state.config.collectorDeadline;
export function collectRun(state:AppraisalState):void {
  check(state.config.survival && (state.players.every(p=>p.life===0) || collectorDue(state)),'collector','Collector รับของเมื่อทุกคนชีวิตหมดหรือถึงช่วงที่ Collector มาเท่านั้น');
  check(!state.collector,'collector','Collector คิดคะแนนแล้ว');
  closeNpcContracts(state);
  // Saved audits keep the original settlement; new runs close every active loan at the end.
  if(state.config.secureEconomy){if(state.config.loanEndSettlement)settleLoansBeforeAdvance(state,true);else {state.phase='REVEAL';settleLoansBeforeAdvance(state);}}
  const results:CollectorResult[]=state.players.map(p=>{
    const items=ownedAssetItemIds(state,p).map(id=>{const item=state.items[id]!;const certified=!!item.appraisedBy && item.appraisedBy!==p.id;return {id,kind:item.kind,base:item.base,genuine:item.genuine,cursed:item.cursed,value:itemScoreValue(item.base,item.genuine,item.cursed,certified),...(certified?{certified}:{})};});
    const itemValue=items.reduce((sum,item)=>sum+item.value,0);
    const statusIds=(['B10','D10'] as const).filter(id=>!!status(p,id));
    const modifierPercent=statusMagnitude(p,'B10',20)-statusMagnitude(p,'D10',20);
    const credits=p.credits+(p.personalVault?.credits??0);
    const score=collectorTotal(credits,itemValue,modifierPercent);
    for(const item of items)if(!state.items[item.id]!.owner.startsWith('collateral:'))state.items[item.id]!.owner='collector';
    if(p.personalVault)p.personalVault.items=[];
    p.inventory=[];p.score=score;
    trace(state,p,'collector-scored',{credits:p.credits,itemValue,modifierPercent,score,itemIds:items.map(item=>item.id),statusIds});
    return {playerId:p.id,credits,itemValue,modifierPercent,statusIds,score,items};
  });
  state.collector=results;state.listings=[];state.phase='RESULTS';
}
