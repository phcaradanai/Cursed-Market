import { reducibleCooldown } from '../game/appraisal/ability-rules.js';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { advanceAppraisalEncounter, applyAppraisalAction, appraisalViewFor, createAppraisalRun, exportAppraisalAudit, replayAppraisalAudit } from '../game/appraisal/index.js';
import { TRUST_RULES } from '../game/appraisal/pulse.js';
import type { AppraisalAction, AppraisalAudit, AppraisalConfig, AppraisalState, AppraisalView, ItemView } from '../game/appraisal/index.js';

export const APPRAISAL_POLICIES=['cautious','aggressive','collector','trader'] as const;
export type AppraisalPolicy=typeof APPRAISAL_POLICIES[number];
type Body=AppraisalAction extends infer A ? A extends AppraisalAction ? Omit<A,'playerId'|'requestId'|'encounter'> : never : never;
function npcEnergy(v:AppraisalView):number {return (v.freeBuy?0:1)+(v.self.statuses.some(s=>s.id==='D06')?1:0);}
function buyPrice(v:AppraisalView,item:ItemView):number {return Math.max(0,item.price-(v.self.statuses.some(s=>s.id==='B03')?2:0)+(v.self.statuses.some(s=>s.id==='D12')?2:0)+(v.fee??0));}
function eventAction(v:AppraisalView,policy:AppraisalPolicy):Body {
  const offer=v.self.eventOffer!;const p=v.self;
  if(['E130','E131','E132'].includes(offer.id)){
    const choice=policy==='cautious'?'decline':offer.id==='E130'?(p.credits>=3?'wind':'decline'):offer.id==='E131'?'haste':'compass';
    return {type:'event',key:offer.key,choice};
  }
  if(/^E1(1[7-9]|2\d)$/.test(offer.id)) {
    // v0.6 events: penalties are paid in the cheapest listed currency, optional ones only when the bot has spare resources.
    const penalty=['E120','E121','E122','E123','E124'].includes(offer.id);
    const choice=penalty || policy!=='cautious' && p.energy>=3?offer.choices.find(c=>c!=='decline')??'decline':offer.choices.includes('decline')?'decline':offer.choices[0]!;
    const itemId=['item','offer'].includes(choice)?offer.itemIds[0]:undefined;
    return {type:'event',key:offer.key,choice,...(itemId?{itemId}:{})};
  }
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
  if(offer.npcTerms){
    choice=policy==='cautious'?'decline':offer.choices.find(c=>c!=='decline')??'decline';
    if(offer.id==='E109' && p.life!<=3)choice='decline';
    return {type:'event',key:offer.key,choice,...(itemId?{itemId}:{}),...(statusId?{statusId}:{}),...(offer.id==='E110' && choice!=='decline'?{itemIds:offer.itemIds.slice(0,Number(choice.slice(5)))}:{}),...(choice==='send-debuff'?{otherPlayerId:offer.otherPlayerIds[0]!}:{})};
  }
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
const TICKETS_TO_FORCE=TRUST_RULES.ticketsToForce;
const BUY_MARGIN:Record<AppraisalPolicy,number>={aggressive:-3,trader:0,collector:2,cautious:5};
const SELL_FLOOR:Record<AppraisalPolicy,number>={trader:.45,aggressive:.5,cautious:.6,collector:.8};
const BUY_RATIO:Record<AppraisalPolicy,number>={aggressive:.6,trader:.7,collector:.72,cautious:.74};
const has=(v:AppraisalView,id:string)=>v.self.statuses.some(s=>s.id===id && s.charges>0);
/** Expected score value of an item from what this seat knows; the seal of another appraiser adds 15%. */
function worth(v:AppraisalView,item:ItemView):number {
  const k=item.knowledge;
  const base=k.base!==undefined?k.base:k.range?(k.range[0]+k.range[1])/2:item.ask;
  const genuine=k.genuine===undefined?.75+.25*.25:k.genuine?1:.25;
  const clean=k.cursed===undefined?1-.35*.25:k.cursed?.75:1;
  const sealed=v.survival && item.appraisedBy!==undefined && item.appraisedBy!==v.self.id?1.15:1;
  return base*genuine*clean*sealed;
}
const knownBad=(item:ItemView)=>item.knowledge.cursed===true || item.knowledge.genuine===false;
/** Survival: goods a friend appraised and the merchant accepted cost no energy to buy (mirrors the engine). */
const friendGoods=(v:AppraisalView,item:ItemView)=>!!v.survival && item.appraisedBy!==undefined && item.appraisedBy!==v.self.id && item.appraisalAccepted===true && item.owner.startsWith(`npc:${item.appraisedBy}:`);
/** Credits an owner can spare to move a poor item: more when it is known bad, a little when life is at stake. */
function rebateFor(v:AppraisalView,item:ItemView):number {
  const p=v.self;let rebate=0;
  if(knownBad(item)) rebate=Math.min(8,Math.max(2,Math.floor(item.price*.3)));
  else if(v.survival && (p.life??9)<=3 && v.brokerage) rebate=2;
  return Math.max(0,Math.min(rebate,p.credits-8));
}
interface Deal {listing:AppraisalView['listings'][number];net:number;ok:boolean;npcSource:boolean;fee:number}
/** What buying a friend's listing is worth to this seat: the item, plus the shards, trust stack and saved energy the new rules pay. */
function dealFor(v:AppraisalView,listing:AppraisalView['listings'][number],policy:AppraisalPolicy):Deal {
  const p=v.self,item=listing.item,npcSource=item.owner.startsWith('npc:'),lowLife=!!v.survival && (p.life??9)<=3;
  const value=worth(v,item),friend=npcSource && friendGoods(v,item);
  const energy=npcSource?(v.freeBuy||friend?0:1)+(has(v,'D06')?1:0):0;
  const rebate=listing.rebate??0;
  const fee=npcSource?(rebate?0:1):Math.max(1,Math.floor(value*.5));
  const cost=(npcSource?buyPrice(v,item):0)+fee;
  let bonus=0;
  if(npcSource && v.survival && p.pulse && !p.pulse.wary && item.appraisedBy!==undefined && item.appraisedBy!==p.id) bonus+=(lowLife?9:4);
  const log=p.buyLog??[];
  if(npcSource && item.appraisedBy!==undefined && item.appraisedBy!==p.id && log.length>0 && log.every(npc=>npc===item.npc)) bonus+=log.length>=2?7:2;
  if(policy==='collector' && !p.inventory.some(i=>i.kind===item.kind)) bonus+=3;
  if(policy==='trader') {const order=v.market.orders.find(o=>o.kind===item.kind && (o.quota[p.id]??0)>0);if(order) bonus+=order.price*.8;}
  const net=value+bonus+rebate-cost-energy*3;
  const ok=p.credits>=cost+4 && p.energy>=energy && net>=BUY_MARGIN[policy] && (!knownBad(item) || rebate>=Math.floor(value*.3) || policy==='aggressive');
  return {listing,net,ok,npcSource,fee};
}
const seatOpen=(v:AppraisalView,id:string)=>{const o=v.players.find(x=>x.id===id);return !!o && !o.done && !o.paused && o.life!==0;};
function tradeDecision(v:AppraisalView,policy:AppraisalPolicy):Body {
  const p=v.self;
  const othersActive=v.players.some(o=>o.id!==p.id && seatOpen(v,o.id));
  const incoming=v.trades.find(o=>o.sellerId===p.id && o.status==='open');
  if(incoming) {
    const buyer=v.players.find(other=>other.id===incoming.buyerId)!;
    const listing=v.listings.find(l=>l.itemId===incoming.itemId && l.ownerId===p.id);
    const shopPrice=incoming.source==='npc'?incoming.item.price:0;
    const canPay=!buyer.paused && !buyer.done && buyer.credits>=incoming.credits+shopPrice+(v.fee??0) && (incoming.source!=='npc' || v.freeBuy || buyer.energy>=2) && p.credits+incoming.credits>=(listing?.rebate??0);
    const fair=incoming.source==='npc' || incoming.credits>=Math.floor(worth(v,incoming.item)*SELL_FLOOR[policy]);
    return {type:'respond',offerId:incoming.id,accept:canPay && fair};
  }
  // List what this seat does not want to keep, with a rebate when the goods are poor.
  const listedIds=new Set(v.listings.filter(l=>l.ownerId===p.id).map(l=>l.itemId));
  const shopItem=p.stock.find(i=>i.appraisal!==null && i.owner.startsWith('npc:') && !listedIds.has(i.id));
  if(shopItem) return {type:'share',itemId:shopItem.id,allow:true,purchase:true,...(rebateFor(v,shopItem)?{rebate:rebateFor(v,shopItem)}:{})};
  const surplus=p.inventory.find(i=>i.lockedUntil===null && !listedIds.has(i.id) && (policy==='trader' || policy==='aggressive' || knownBad(i)));
  if(surplus) return {type:'share',itemId:surplus.id,allow:true,purchase:true,...(knownBad(surplus) && rebateFor(v,surplus)?{rebate:rebateFor(v,surplus)}:{})};
  // Buy from friends when the item and the new rewards beat the price; tickets force the best shop item.
  const openOffers=v.trades.filter(o=>o.buyerId===p.id && o.status==='open').length;
  const deals=v.listings.filter(l=>l.ownerId!==p.id && l.purchase && seatOpen(v,l.ownerId) && !l.item.owner.startsWith('alien-loan:') && !v.trades.some(o=>o.buyerId===p.id && o.itemId===l.itemId))
    .map(l=>dealFor(v,l,policy)).filter(d=>d.ok).sort((a,b)=>b.net-a.net);
  if(openOffers<2 && deals.length) {
    const best=deals[0]!,item=best.listing.item;
    if(best.npcSource && (p.darkTickets??0)>=TICKETS_TO_FORCE) return {type:'force-buy',sellerId:best.listing.ownerId,itemId:item.id};
    return {type:'propose',sellerId:best.listing.ownerId,itemId:item.id,credits:best.fee,...(best.npcSource?{condition:item.condition.required}:{})};
  }
  // Stay in the phase while a friend could still answer an offer on a listing; settle unsold goods last.
  const waiting=othersActive && (listedIds.size>0 || openOffers>0);
  const unsold=v.brokerage && !waiting?p.stock.find(i=>i.appraisal!==null && i.owner.startsWith('npc:')):undefined;
  if(unsold) {
    const affordable=p.credits>=buyPrice(v,unsold) && p.energy>=npcEnergy(v) && p.dealMode!=='condition';
    return {type:'unsold',itemId:unsold.id,choice:affordable && policy!=='trader' && !knownBad(unsold)?'buy':policy==='cautious' || knownBad(unsold)?'penalty':'consign'};
  }
  return {type:'done'};
}
export function appraisalBotDecision(v:AppraisalView,policy:AppraisalPolicy):Body {
  const p=v.self;const duel=v.theft?.duels.find(d=>d.needsChoice);
  if(duel)return {type:'theft-hand',duelId:duel.id,hand:(['rock','paper','scissors'] as const)[(v.encounter+duel.round)%3]!};
  if(p.eventOffer) return eventAction(v,policy);
  if(v.market.open && policy==='trader') {
    const item=p.inventory.find(i=>i.lockedUntil===null && !i.stolen && v.market.orders.some(o=>o.kind===i.kind && (o.quota[p.id]??0)>0));
    if(item) return {type:'market-sell',itemId:item.id,orderId:v.market.orders.find(o=>o.kind===item.kind && (o.quota[p.id]??0)>0)!.id};
  }
  const lot=v.market.lots?.find(l=>l.winnerId===undefined && l.yourBid===null && p.credits>=l.minimum+10);
  const chasing=(p.darkTickets??0)>=1 && (p.darkTickets??0)<TICKETS_TO_FORCE && !!lot && p.credits>=lot.minimum+20;
  if(lot && (policy==='collector' || policy==='trader' || chasing) && v.phase!=='PORTALS') return {type:'bid',lotId:lot.id,credits:lot.minimum+(policy==='collector'?2:chasing?1:0)};
  if(v.phase==='PORTALS') {
    const portals=p.portals.filter(portal=>!portal.disabled);
    const chosen=policy==='trader'?portals.find(portal=>v.market.orders.some(o=>o.kind===portal.hint)):
      policy==='collector'?portals.find(portal=>!p.inventory.some(i=>i.kind===portal.hint)):
      policy==='cautious'?portals.find(portal=>portal.npc==='autometa' || portal.npc==='orc'):portals.find(portal=>portal.npc==='darkone' || portal.npc==='alien');
    return {type:'enter',portalId:(chosen??portals[0])!.id};
  }
  if(p.abilityChoice){const choiceId=p.abilityChoice.itemIds.find(id=>id!==p.abilityChoice!.sourceId)??p.abilityChoice.itemIds[0]!;return {type:'merchant-ability',npc:p.abilityChoice.npc,choiceId};}
  if(v.trustAbilities && ['APPRAISAL','TRADE'].includes(v.phase) && !p.skillUsed){
    const abilities=p.merchantAbilities??[];
    const order=policy==='collector'?['swarm','deepsea','vampire','autometa','orc','darkone','beast','alien']:policy==='cautious'?['deepsea','darkone','autometa','orc','swarm','vampire','beast','alien']:['darkone','orc','autometa','swarm','vampire','beast','deepsea','alien'];
    for(const npc of order){const a=abilities.find(a=>a.npc===npc&&a.ready);if(!a)continue;
      if(a.target==='debuff')return {type:'merchant-ability',npc:a.npc,statusId:a.statusIds[0]!};
      const targets=[...p.stock,...p.inventory].filter(i=>a.itemIds.includes(i.id));
      const item=a.npc==='deepsea'?targets.find(i=>i.knowledge.cursed===true):a.npc==='autometa'?targets.find(i=>i.knowledge.base===undefined):a.npc==='orc'?targets.find(i=>buyPrice(v,i)<=p.credits):targets[0];
      if(item)return {type:'merchant-ability',npc:a.npc,itemId:item.id};
    }
  }
  if(v.phase==='APPRAISAL') {
    const recovery=p.recoveryOffer;
    if(recovery && p.credits>=recovery.credits && (recovery.target==='life'?p.life!<=v.survival!.maxLife-recovery.amount:p.energy<3))return {type:'recover-resource',target:recovery.target};
    if(policy==='cautious' && p.inspections<1 && p.energy>=3) {
      const item=p.stock.find(i=>i.knowledge.genuine===undefined);if(item) return {type:'inspect',itemId:item.id,property:'authenticity'};
    }
    const c2=p.core2Actions;
    if(c2?.skill && p.energy>=3) {
      const itemId=c2.skill.needsItem?p.stock.find(i=>i.knowledge.base===undefined || i.knowledge.genuine===undefined)?.id:undefined;
      if(!c2.skill.needsItem || itemId) return {type:'skill',...(itemId?{itemId}:{})};
    }
    if(c2 && !c2.theftUsed && policy==='aggressive' && p.energy>=5) {
      const victim=v.players.find(o=>o.id!==p.id && !o.paused && o.credits>0);
      if(c2.pickpocketChance && c2.pickpocketChance>=.3 && victim && v.encounter%2===0) return {type:'pickpocket',victimId:victim.id};
      const loot=p.stock.find(i=>i.appraisal===null);
      if(c2.stealChance && c2.stealChance>=.4 && loot && v.encounter%2===1) return {type:'steal',itemId:loot.id};
    }
    const toAppraise=p.stock.find(i=>i.appraisal===null);
    if(toAppraise && !p.caught && p.energy>=3) {
      const [low,high]=toAppraise.range??[toAppraise.price,toAppraise.price];
      const value=Math.round(policy==='aggressive'?low*.65:policy==='trader'?low:policy==='collector'?(low+high)*.4:(low+high)/2);
      return {type:'appraise',itemId:toAppraise.id,value,acceptDanger:true};
    }
    const toBuy=p.stock.find(i=>p.credits>=buyPrice(v,i) && !(knownBad(i) && policy!=='aggressive') && worth(v,i)>=buyPrice(v,i)*BUY_RATIO[policy]);
    if(toBuy && p.energy>=npcEnergy(v)) return {type:'buy',itemIds:[toBuy.id],condition:false};
    if(policy==='collector' && p.energy>=4) {
      const item=p.inventory.find(i=>!p.activated.includes(i.id) && !p.abilityItemUsed?.includes(i.kind) && !['chrono-gear','burden-hourglass'].includes(i.kind));if(item) return {type:'activate',itemId:item.id};
      const source=p.merchantAbilities?.find(a=>a.trust>=1&&reducibleCooldown(p,a.npc,v.encounter)>0);
      const gear=p.inventory.find(i=>i.kind==='chrono-gear'&&!p.activated.includes(i.id)&&!p.abilityItemUsed?.includes(i.kind));
      if(source&&gear)return {type:'activate',itemId:gear.id,npc:source.npc};
    }
    return {type:'done'};
  }
  if(v.phase==='TRADE') return tradeDecision(v,policy);
  return {type:'done'};
}
/**
 * One bot move for a table of bots. A bot with something to do always goes before a bot that only wants to end its phase,
 * so bots can answer each other's offers; a bot that listed goods also stays while a human could still make an offer.
 */
export function appraisalBotTurn(state:AppraisalState,bots:Array<{id:string;policy:AppraisalPolicy}>,options:{humansActive?:boolean;retired?:boolean}={}):{id:string;body:Body}|null {
  const doneBody:Body={type:'done'};
  const decisions=bots.map(bot=>{
    let body:Body=doneBody;
    if(!options.retired) {try {body=appraisalBotDecision(appraisalViewFor(state,bot.id),bot.policy);} catch {body=doneBody;}}
    return {id:bot.id,body};
  });
  const busy=decisions.find(d=>d.body.type!=='done');
  if(busy) return busy;
  const holds=(id:string)=>!!options.humansActive && state.phase==='TRADE' && state.listings.some(l=>l.ownerId===id);
  return decisions.find(d=>!holds(d.id))??null;
}
export function simulateAppraisalRun(count:number,policy:AppraisalPolicy,seed:string,overrides:Partial<AppraisalConfig>={}):AppraisalAudit {
  let state=createAppraisalRun(Array.from({length:count},(_,i)=>`seat${i}`),seed,overrides);
  let cursor=0;
  for(let turn=0;turn<1500 && state.phase!=='RESULTS';turn++) {
    if(state.phase==='REVEAL') {state=advanceAppraisalEncounter(state);continue;}
    const active=state.players.map((player,index)=>({player,index})).filter(({player})=>!player.paused && !player.done)
      .sort((x,y)=>((x.index-cursor+count)%count)-((y.index-cursor+count)%count));
    if(!active.length) throw new Error('No active seat before automatic phase completion');
    // Replenished income can sustain life indefinitely. Retire synthetic seats after
    // twelve encounters so a replay test remains bounded; live play has no such cap.
    const turnChoice=appraisalBotTurn(state,active.map(({player})=>({id:player.id,policy})),{retired:!!state.config.survival && state.encounter>12})??{id:active[0]!.player.id,body:{type:'done'} as Body};
    const chosen=active.find(({player})=>player.id===turnChoice.id)!;cursor=(chosen.index+1)%count;const p=chosen.player;const body=turnChoice.body;
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
