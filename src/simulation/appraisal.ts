import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { advanceAppraisalEncounter, applyAppraisalAction, appraisalViewFor, createAppraisalRun, exportAppraisalAudit, replayAppraisalAudit } from '../game/appraisal/index.js';
import { ITEM_SPECS } from '../game/appraisal/content.js';
import type { AppraisalAction, AppraisalAudit, AppraisalConfig, AppraisalView, ItemView } from '../game/appraisal/index.js';

export const APPRAISAL_POLICIES=['cautious','aggressive','collector','trader'] as const;
export type AppraisalPolicy=typeof APPRAISAL_POLICIES[number];
type Body=AppraisalAction extends infer A ? A extends AppraisalAction ? Omit<A,'playerId'|'requestId'|'encounter'> : never : never;
function npcEnergy(v:AppraisalView):number {return (v.freeBuy?0:1)+(v.self.statuses.some(s=>s.id==='D06')?1:0);}
function buyPrice(v:AppraisalView,item:ItemView):number {return Math.max(0,item.price-(v.self.statuses.some(s=>s.id==='B03')?2:0)+(v.self.statuses.some(s=>s.id==='D12')?2:0)+(v.fee??0));}
function eventAction(v:AppraisalView,policy:AppraisalPolicy):Body {
  const offer=v.self.eventOffer!;const p=v.self;
  let choice=offer.choices.includes('decline')?'decline':offer.choices.includes('pay')?'pay':offer.choices.includes('oath')?'oath':offer.choices.includes('surrender')?'surrender':offer.choices.includes('die')?'die':offer.choices.includes('energy')?'energy':'item';
  const useful=policy==='aggressive'?['E09','E21','E22','E24','E27','E28','E46']:policy==='collector'?['E02','E04','E05','E07','E15','E18','E26','E29','E31','E33','E34','E35','E36','E38','E39','E41','E42']:policy==='trader'?['E04','E15','E19','E21','E25','E43','E44','E45','E47']:['E03','E04','E12','E15','E16','E17','E18','E22','E28','E30','E35','E41','E42'];
  if(useful.includes(offer.id) && p.credits>=5 && p.energy>=4) choice=offer.choices.find(c=>c!=='decline')!;
  if(Number(offer.id.slice(1))>50 && policy!=='cautious') choice='accept';
  if(offer.id==='E73') choice=policy!=='cautious' && p.energy>=3 && offer.choices.includes('accept')?'accept':'decline';
  if(v.survival && offer.id==='E03' && p.energy<3)choice=p.credits>=2?'pay':p.life!>1?'debt':'decline';
  if(v.survival && offer.id==='E42' && p.energy<3 && offer.choices.includes('energy'))choice='energy';
  const visible=[...p.stock,...p.inventory,...v.listings.map(l=>l.item)];
  let itemId=offer.itemIds[0];
  if(['E11','E46'].includes(offer.id)) itemId=offer.itemIds.find(id=>visible.find(i=>i.id===id)?.knowledge.genuine===undefined);
  if(['E16','E20'].includes(offer.id)) itemId=offer.itemIds.find(id=>!visible.find(i=>i.id===id)?.knowledge[offer.id==='E16'?'effectsKnown':'activationKnown']);
  if(offer.id==='E17') itemId=offer.itemIds.find(id=>visible.find(i=>i.id===id)?.knowledge.base===undefined);
  let statusId=offer.statusIds.find(id=>id.startsWith('D'));
  if(offer.id==='E06') statusId=offer.statusIds.find(id=>id.startsWith('D') && id!==(choice==='interest'?'D04':'D07'));
  if(offer.id==='E108') {statusId=offer.boons![0];choice=policy==='cautious'?'decline':'pick';}
  if(offer.id==='E88') statusId=offer.statusIds.find(id=>['D11','D12','D13','D14','D15','D16'].includes(id));
  if(offer.id==='E34') statusId=offer.statusIds.find(id=>id.startsWith('B') && id!=='B10');
  if(offer.id==='E35') statusId=offer.statusIds.find(id=>id==='D01' || id==='D05');
  const target=p.stock.find(i=>i.id===itemId);
  if(['E09','E24','E27','E29','E30'].includes(offer.id) && choice==='accept') {
    const discount=offer.id==='E29'?3:offer.id==='E30'?-2:2;
    if(!target || p.credits<buyPrice(v,target)-discount || p.energy<npcEnergy(v)) choice='decline';
  }
  if(offer.id==='E21' && choice==='accept' && (p.stock.length<2 || p.credits<p.stock.reduce((sum,i)=>sum+i.price,0)-2 || p.energy<npcEnergy(v))) choice='decline';
  const proof=itemId?offer.facts[itemId]:undefined;
  const fact=proof?.base!==undefined?'base':proof?.genuine!==undefined?'genuine':proof?.cursed!==undefined?'cursed':undefined;
  return {type:'event',key:offer.key,choice,...(itemId?{itemId}:{}),...(statusId?{statusId}:{}),...(fact?{fact}:{}),...(offer.id==='E46'?{guess:true}:{})};
}
/** Policies read only the same private DTO a player receives, never seed or hidden truths. */
export function appraisalBotDecision(v:AppraisalView,policy:AppraisalPolicy):Body {
  const p=v.self;if(p.eventOffer) return eventAction(v,policy);
  if(v.market.open && policy==='trader') {
    const item=p.inventory.find(i=>i.lockedUntil===null && v.market.orders.some(o=>o.kind===i.kind && (o.quota[p.id]??0)>0));
    if(item) return {type:'market-sell',itemId:item.id,orderId:v.market.orders.find(o=>o.kind===item.kind && (o.quota[p.id]??0)>0)!.id};
  }
  const lot=v.market.lots?.find(l=>l.winnerId===undefined && l.yourBid===null && p.credits>=l.minimum+10);
  if(lot && (policy==='collector' || policy==='trader') && v.phase!=='PORTALS') return {type:'bid',lotId:lot.id,credits:lot.minimum+(policy==='collector'?2:0)};
  if(v.phase==='PORTALS') {
    const portals=p.portals.filter(portal=>!portal.disabled);
    const chosen=policy==='trader'?portals.find(portal=>v.market.orders.some(o=>o.kind===portal.hint)):
      policy==='collector'?portals.find(portal=>!p.inventory.some(i=>i.kind===portal.hint)):
      policy==='cautious'?portals.find(portal=>portal.npc==='autometa' || portal.npc==='orc'):portals.find(portal=>portal.npc==='darkone' || portal.npc==='alien');
    return {type:'enter',portalId:(chosen??portals[0])!.id};
  }
  if(v.phase==='APPRAISAL') {
    const recovery=p.recoveryOffer;
    if(recovery && p.credits>=recovery.credits && (recovery.target==='life'?p.life!<=v.survival!.maxLife-recovery.amount:p.energy<3))return {type:'recover-resource',target:recovery.target};
    if(policy==='cautious' && p.inspections<1 && p.energy>=3) {
      const item=p.stock.find(i=>i.knowledge.genuine===undefined);if(item) return {type:'inspect',itemId:item.id,property:'authenticity'};
    }
    const toAppraise=p.stock.find(i=>i.appraisal===null);
    if(toAppraise && !p.caught && p.energy>=3) {
      const [low,high]=toAppraise.range??[toAppraise.price,toAppraise.price];
      const value=Math.round(policy==='aggressive'?low*.65:policy==='trader'?low:policy==='collector'?(low+high)*.4:(low+high)/2);
      return {type:'appraise',itemId:toAppraise.id,value,acceptDanger:true};
    }
    const toBuy=p.stock.find(i=>p.credits>=buyPrice(v,i) && (policy==='aggressive' || policy==='trader' || i.knowledge.genuine!==false));
    if(toBuy && p.energy>=npcEnergy(v)) return {type:'buy',itemIds:[toBuy.id],condition:false};
    if(policy==='collector' && p.energy>=4) {
      const item=p.inventory.find(i=>!p.activated.includes(i.id));if(item) return {type:'activate',itemId:item.id};
    }
    return {type:'done'};
  }
  if(v.phase==='TRADE') {
    const incoming=v.trades.find(o=>o.sellerId===p.id && o.status==='open');
    if(incoming) {
      const buyer=v.players.find(other=>other.id===incoming.buyerId)!;
      return {type:'respond',offerId:incoming.id,accept:incoming.source==='inventory' && !buyer.paused && !buyer.done && buyer.credits>=incoming.credits};
    }
    const unlisted=p.inventory.find(i=>i.lockedUntil===null && !v.listings.some(l=>l.itemId===i.id));
    if(unlisted) return {type:'share',itemId:unlisted.id,allow:true,purchase:true};
    if(policy==='trader') {
      const listing=v.listings.find(l=>l.ownerId!==p.id && l.purchase && !l.item.owner.startsWith('npc:') && v.market.orders.some(o=>o.kind===l.item.kind && (o.quota[p.id]??0)>0) && !v.trades.some(o=>o.buyerId===p.id && o.itemId===l.itemId) && !v.players.find(other=>other.id===l.ownerId)!.done);
      if(listing) {const credits=Math.floor(ITEM_SPECS[listing.item.kind].anchor*.75);if(p.credits>=credits) return {type:'propose',sellerId:listing.ownerId,itemId:listing.itemId,credits};}
    }
    const unsold=v.brokerage?p.stock.find(i=>i.appraisal!==null && i.owner.startsWith('npc:')):undefined;
    if(unsold) {
      const affordable=p.credits>=buyPrice(v,unsold) && p.energy>=npcEnergy(v) && p.dealMode!=='condition';
      return {type:'unsold',itemId:unsold.id,choice:affordable && policy!=='trader'?'buy':policy==='cautious'?'penalty':'consign'};
    }
    return {type:'done'};
  }
  return {type:'done'};
}
export function simulateAppraisalRun(count:number,policy:AppraisalPolicy,seed:string,overrides:Partial<AppraisalConfig>={}):AppraisalAudit {
  let state=createAppraisalRun(Array.from({length:count},(_,i)=>`seat${i}`),seed,overrides);
  let cursor=0;
  for(let turn=0;turn<1500 && state.phase!=='RESULTS';turn++) {
    if(state.phase==='REVEAL') {state=advanceAppraisalEncounter(state);continue;}
    let selected=-1;
    for(let offset=0;offset<count;offset++) {const index=(cursor+offset)%count;if(!state.players[index]!.paused && !state.players[index]!.done) {selected=index;break;}}
    if(selected<0) throw new Error('No active seat before automatic phase completion');
    cursor=(selected+1)%count;const p=state.players[selected]!;
    // Replenished income can sustain life indefinitely. Retire synthetic seats after
    // twelve encounters so a replay test remains bounded; live play has no such cap.
    const body=state.config.survival && state.encounter>12?{type:'done'} as const:appraisalBotDecision(appraisalViewFor(state,p.id),policy);
    state=applyAppraisalAction(state,{...body,playerId:p.id,requestId:`sim-${turn}`,encounter:state.encounter} as AppraisalAction);
  }
  if(state.phase!=='RESULTS') throw new Error('Appraisal simulation exceeded action bound');
  const audit=exportAppraisalAudit(state);replayAppraisalAudit(audit);return audit;
}
export function runAppraisalScenarios(runs:number,out:string):void {
  const summaries=[];let example:AppraisalAudit | undefined;
  for(const count of [2,3,4]) for(const policy of APPRAISAL_POLICIES) {
    let deaths=0,exhaustions=0,sales=0,trades=0,caught=0,openMarkets=0,totalScores=0;
    const events=new Set<string>(),routes:Record<string,number>={};
    for(let i=0;i<runs;i++) {
      const audit=simulateAppraisalRun(count,policy,`appraisal-v0.4:${count}:${policy}:${i}`);example??=audit;
      totalScores+=audit.final.reduce((sum,p)=>sum+p.score,0);
      for(const row of audit.history) {if(row.paused==='dead') deaths++;if(row.paused==='exhausted') exhaustions++;}
      openMarkets+=new Set(audit.trace.filter(t=>t.type==='market-sale').map(t=>t.encounter)).size;
      for(const t of audit.trace) {
        if(t.type==='market-sale') sales++;if(t.type==='trade-completed') trades++;
        if(t.type==='appraised' && t.details.caught) caught++;
        if(t.type==='event-resolved') events.add(t.details.id as string);
        if(t.type==='portal-entered') {const npc=t.details.npc as string;routes[npc]=(routes[npc]??0)+1;}
      }
    }
    summaries.push({players:count,policy,runs,deaths,exhaustions,sales,trades,caught,meanScore:totalScores/(runs*count),encountersWithSales:openMarkets,resolvedEventIds:[...events].sort(),routes});
    process.stdout.write(`${count} players / ${policy}: ${runs} replay-verified runs\n`);
  }
  mkdirSync(out,{recursive:true});writeFileSync(resolve(out,'summary.json'),JSON.stringify({schemaVersion:4,runs:runs*12,limitations:'Synthetic runs verify rules and replay. They do not prove human fun or balanced strategies. Event fixtures cover all 50 IDs separately.',scenarios:summaries},null,2)+'\n');
  writeFileSync(resolve(out,'example-run.json'),JSON.stringify(example,null,2)+'\n');
}
if(process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href) {
  const args=process.argv.slice(2);let runs=100,out=resolve('docs/simulation/appraisal-v0.4');
  for(let i=0;i<args.length;i++) {if(args[i]==='--runs') runs=Number(args[++i]);else if(args[i]==='--out') out=resolve(args[++i]!);else throw new Error(`Unknown argument ${args[i]}`);}
  if(!Number.isSafeInteger(runs) || runs<1 || runs>10000) throw new Error('--runs must be an integer 1–10000');
  runAppraisalScenarios(runs,out);
}
