import {remainingHeld} from './remaining48-effects.js';
import {remainingScaled, remainingStrength} from './remaining48-numbers.js';
import {REMAINING48_RULES} from './remaining48-catalog.js';
import {closeCollectorWishlists} from './collector-wishlist.js';
import {personalScoreFor} from './personal-scoring.js';
import { ownedAssetItemIds, settleLoansBeforeAdvance } from './secure-storage.js';
import { statusMagnitude } from './copy-effects.js';
import { check, enforceCaps, status, trace } from './mechanics.js';
import { collectorTotal, itemScoreValue } from './scoring.js';
import { closeNpcContracts } from './npc-events.js';
import type { AppraisalConfig, AppraisalState, Appraiser, CollectorResult } from './types.js';

/** Experimental numbers; the life/energy/end condition was confirmed by the user. */
export const SURVIVAL_RULES:NonNullable<AppraisalConfig['survival']>={maxLife:6,encounterLifeCost:1,entryEnergyCost:0};
/** Experimental numbers for unsold-appraisal duty, vault auctions and NPC × held-item events. */
export const BROKERAGE_RULES:NonNullable<AppraisalConfig['brokerage']>={auctionProbability:.5,maxLots:2,bondProbability:.65};
/** The Collector arrives once the deadline encounter settles, whoever is still alive. */
export const collectorDue=(state:AppraisalState):boolean=>!!state.config.survival && state.config.collectorDeadline!==undefined && state.encounter>=state.config.collectorDeadline;
function testamentActive(state:AppraisalState):boolean {
  return state.config.catalogVersion===5 && Number(state.config.native56Effects)>=15 && collectorDue(state) && !state.collector;
}

export function snapshotTestamentCustody(state:AppraisalState):void {
  if(!testamentActive(state))return;
  for(const player of state.players){
    const ids=remainingHeld(state,player,'E69').map(item=>item.id);
    if(ids.length)trace(state,player,'testament-custody',{ids});
  }
}

function testamentCustody(state:AppraisalState,player:Appraiser):string[] {
  const entry=state.trace.findLast(entry=>entry.type==='testament-custody' && entry.playerId===player.id && entry.encounter===state.encounter);
  return (entry?.details.ids as string[]|undefined)??[];
}

export function reconcileTestamentCustody(state:AppraisalState):void {
  if(!testamentActive(state))return;
  for(const player of state.players){
    const ids=testamentCustody(state,player);
    const kept=ids.filter(id=>state.items[id]?.owner===player.id && player.inventory.includes(id));
    if(kept.length!==ids.length)trace(state,player,'testament-custody',{ids:kept});
  }
}

export function testamentBonus(state:AppraisalState,player:Appraiser,items:readonly {id:string;value:number}[]):number {
  if(!testamentActive(state) || !player.life)return 0;
  const eligible=new Set(testamentCustody(state,player));
  const tools=remainingHeld(state,player,'E69').filter(item=>eligible.has(item.id));
  const rule=REMAINING48_RULES.E69;
  const bps=remainingScaled(rule.assetBonusBps,remainingStrength(tools,'E69'),rule.familyCapBps);
  const value=items.reduce((sum,entry)=>{
    const item=state.items[entry.id]!;
    return item.owner===player.id && player.inventory.includes(item.id) && item.kind!=='darkone-null-testament' && !item.copy ? sum+entry.value : sum;
  },0);
  return Math.max(0,Math.min(rule.scoreCap,Math.floor(value*bps/10000)));
}

export function collectRun(state:AppraisalState):void {
  check(state.config.survival && (state.players.every(p=>p.life===0) || collectorDue(state)),'collector','Collector รับของเมื่อทุกคนชีวิตหมดหรือถึงช่วงที่ Collector มาเท่านั้น');
  check(!state.collector,'collector','Collector คิดคะแนนแล้ว');
  reconcileTestamentCustody(state);
  const carriedBeforeSettlement=testamentActive(state)?new Map(state.players.map(p=>[p.id,new Set(p.inventory)])):undefined;
  closeCollectorWishlists(state);closeNpcContracts(state);
  // Saved audits keep the original settlement; new runs close every active loan at the end.
  if(state.config.secureEconomy){if(state.config.loanEndSettlement)settleLoansBeforeAdvance(state,true);else {state.phase='REVEAL';settleLoansBeforeAdvance(state);}}
  if(state.config.personalScoringRules===1)enforceCaps(state);
  const results:CollectorResult[]=state.players.map(p=>{
    const items=ownedAssetItemIds(state,p).map(id=>{const item=state.items[id]!;const certified=!!item.appraisedBy && item.appraisedBy!==p.id;return {id,kind:item.kind,base:item.base,genuine:item.genuine,cursed:item.cursed,value:itemScoreValue(item.base,item.genuine,item.cursed,certified),...(certified?{certified}:{})};});
    const itemValue=items.reduce((sum,item)=>sum+item.value,0);
    const statusIds=(['B10','D10'] as const).filter(id=>!!status(p,id));
    const modifierPercent=statusMagnitude(p,'B10',20)-statusMagnitude(p,'D10',20);
    const credits=p.credits+(p.personalVault?.credits??0);
    const carried=carriedBeforeSettlement?.get(p.id);
    const assetBonus=carried?testamentBonus(state,p,items.filter(item=>carried.has(item.id))):0;
    const personalScore=state.config.personalScoringRules===1?personalScoreFor(state,p.id,{credits,itemValue:itemValue+assetBonus,itemIds:items.map(i=>i.id)}):undefined;
    const score=personalScore?.total??collectorTotal(credits,itemValue+assetBonus,modifierPercent)+(state.ghosts?.[p.id]?.bonus??0);
    for(const item of items)if(!state.items[item.id]!.owner.startsWith('collateral:'))state.items[item.id]!.owner='collector';
    if(p.personalVault)p.personalVault.items=[];
    p.inventory=[];p.score=score;
    trace(state,p,'collector-scored',{credits:p.credits,itemValue,modifierPercent,score,itemIds:items.map(item=>item.id),statusIds});
    return {playerId:p.id,credits,itemValue,modifierPercent,statusIds,score,items,...(assetBonus?{assetBonus}:{}),...(personalScore?{personalScore}:{})};
  });
  for(const g of Object.values(state.ghosts??{})){g.available=false;for(const j of g.jobs)if(j.status==='offered'||j.status==='accepted')j.status='cancelled';}
  state.collector=results;state.listings=[];state.phase='RESULTS';
}
