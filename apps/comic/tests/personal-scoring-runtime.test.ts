import test from 'node:test';
import assert from 'node:assert/strict';
import {createAppraisalRun,applyAppraisalAction} from '../src/game/appraisal/engine.js';
import {appraisalViewFor} from '../src/game/appraisal/views.js';
import {appraisalBotDecision} from '../src/simulation/appraisal.js';
import {appraise,damageLife,inspect,purchase,completeAppraisedSale,marketSell} from '../src/game/appraisal/mechanics.js';
import {auctionLots,placeBid,settleAuction} from '../src/game/appraisal/brokerage.js';
import {startTheftDuel,chooseTheftHand} from '../src/game/appraisal/theft.js';
import {redeemNpcContracts} from '../src/game/appraisal/npc-events.js';
import {collectRun} from '../src/game/appraisal/survival.js';
import {applyWish,wishSell} from '../src/game/appraisal/wishlist.js';
import {calculatePersonalScore,personalScoreFor} from '../src/game/appraisal/personal-scoring.js';
import {handleLoanAction,payVaultInterest} from '../src/game/appraisal/secure-storage.js';
import {advanceAppraisalEncounter} from '../src/game/appraisal/engine.js';
import {exportAppraisalAudit,replayAppraisalAudit} from '../src/game/appraisal/audit.js';
import type {AppraisalAction,AppraisalState} from '../src/game/appraisal/types.js';

function setup(enabled=true){
 return createAppraisalRun(['alice','bob'],'personal-runtime-1',{startingCredits:500,commerce:true,secureEconomy:true,catalogVersion:4,survival:{maxLife:6,encounterLifeCost:1,entryEnergyCost:0},...(enabled?{personalScoringRules:1 as const}:{})});
}
function metric(s:AppraisalState,id:string,actor='alice'){
 return calculatePersonalScore({playerId:actor,facts:s.personalPerformance?.facts??[],assetScore:0,modifierPercent:0,ghostBonus:0,rarities:[]}).metrics.find(m=>m.id===id)!;
}
// Named mutation fixture isolates the authoritative writers; public routing/replay is tested below.
function shop(){const s=setup(),p=s.players[0]!;s.phase='APPRAISAL';p.eventOffer=null;const item=Object.values(s.items).find(i=>i.npcOwnerId===p.id&&i.encounter===1)!;p.stock=[item.id];return {s,p,item};}

test('actual HP removed includes lethal cost but excludes overkill, shields and postdeath damage',()=>{
 const s=setup(),p=s.players[0]!;
 damageLife(s,p,2,'blood-pact',false);assert.equal(p.life,4);assert.equal(metric(s,'lifeLost').raw,2);
 damageLife(s,p,99,'blood-pact',false);assert.equal(p.life,0);assert.equal(metric(s,'lifeLost').eligible,6);
 damageLife(s,p,1,'after-death',false);assert.equal(metric(s,'lifeLost').eligible,6);
 const shielded=setup(),q=shielded.players[0]!;q.statuses=[{id:'B19',charges:1,starts:1,expires:2}];damageLife(shielded,q,1,'hazard');assert.equal(q.life,6);assert.equal(metric(shielded,'lifeLost').raw,0);
});
test('real canonical positive trust gain survives later loss in same command and clamps at cap',()=>{
 const {s,p,item}=shop();item.appraisedBy=p.id;p.npcTrust![item.npc]=9;
 completeAppraisedSale(s,item,20);assert.equal(p.npcTrust![item.npc],10);assert.equal(metric(s,'trustGained').raw,1);
 p.npcTrust![item.npc]=0;assert.equal(metric(s,'trustGained').eligible,1);
 completeAppraisedSale(s,item,20);assert.equal(metric(s,'trustGained').raw,1,'commission cannot pay twice');
 const capped=shop();capped.item.appraisedBy=capped.p.id;capped.p.npcTrust![capped.item.npc]=10;completeAppraisedSale(capped.s,capped.item,20);assert.equal(metric(capped.s,'trustGained').raw,0);
});
test('first personally inspected facets and first submitted appraisal use original identity',()=>{
 const {s,p,item}=shop();inspect(s,p,item.id,'authenticity');assert.equal(metric(s,'inspection').eligible,1);
 assert.throws(()=>inspect(s,p,item.id,'authenticity'));assert.equal(metric(s,'inspection').raw,1);
 appraise(s,p,item.id,item.base,false,true);assert.equal(metric(s,'accurateAppraisal').points,2);
 appraise(s,p,item.id,item.base,true,true);assert.equal(metric(s,'accurateAppraisal').points,2);
 const missed=shop();appraise(missed.s,missed.p,missed.item.id,0,false,true);appraise(missed.s,missed.p,missed.item.id,missed.item.base,true,true);assert.equal(metric(missed.s,'accurateAppraisal').points,0,'a corrected second submission cannot replace first attempt');
});
test('NPC settlement credits buyer and distinct appraiser once using gross sale price',()=>{
 const {s,p,item}=shop(),buyer=s.players[1]!;item.appraisedBy=p.id;item.ask=20;
 const before=buyer.credits;purchase(s,buyer,p,[item.id]);assert.equal(buyer.credits,before-20);assert.equal(item.owner,buyer.id);
 assert.equal(metric(s,'bought',buyer.id).points,2);assert.equal(metric(s,'soldQuantity').points,5);assert.equal(metric(s,'soldGrossCredits').eligible,20);
 assert.equal(metric(s,'soldQuantity',buyer.id).raw,0);
 const own=shop();own.item.appraisedBy=own.p.id;purchase(own.s,own.p,own.p,[own.item.id]);assert.equal(metric(own.s,'bought').points,2);assert.equal(metric(own.s,'soldQuantity').raw,0);
});
test('copies and zero-credit acquisitions do not earn transaction achievements',()=>{
 const copy=shop();copy.item.copy={sourceId:'original-fixture',number:1,valuePercent:40};purchase(copy.s,copy.p,copy.p,[copy.item.id]);assert.equal(metric(copy.s,'bought').raw,1);assert.equal(metric(copy.s,'bought').eligible,0);
 const free=shop();free.item.ask=0;purchase(free.s,free.p,free.p,[free.item.id]);assert.equal(metric(free.s,'bought').points,0);
});
test('public accepted requests record facts exactly once and flagless rooms keep old state shape',()=>{
 for(const enabled of [false,true]){
  let s=setup(enabled),n=0;const act=(id:string,body:Record<string,unknown>)=>{s=applyAppraisalAction(s,{...body,playerId:id,requestId:`personal-${n++}`,encounter:s.encounter} as AppraisalAction);};
  const events=()=>{for(let k=0;k<30;k++){const p=s.players.find(p=>p.eventOffer||p.abilityChoice);if(!p)return;act(p.id,appraisalBotDecision(appraisalViewFor(s,p.id),'cautious'));}throw Error('event bound');};
  events();for(const id of ['alice','bob']){act(id,{type:'enter',portalId:appraisalViewFor(s,id).self.portals.find(p=>!p.disabled)!.id});events();}
  const item=appraisalViewFor(s,'alice').self.stock[0]!;const request={type:'inspect',property:'authenticity',itemId:item.id,playerId:'alice',requestId:'personal-duplicate',encounter:s.encounter} as AppraisalAction;
  s=applyAppraisalAction(s,request);const before=structuredClone(s);s=applyAppraisalAction(s,request);assert.deepEqual(s,before);
  if(enabled)assert.equal(metric(s,'inspection').eligible,1);else assert.equal(Object.hasOwn(s,'personalPerformance'),false);
 }
});
test('interest points use aged credits actually paid and cannot repeat at same boundary',()=>{
 const s=setup(),p=s.players[0]!;s.config.vaultInterestRules=1;
 p.personalVault={credits:50,items:[],slots:2,interest:{principal:10,encounter:1}};s.encounter=2;
 const before=p.credits;payVaultInterest(s);assert.equal(p.credits,before+1);assert.equal(metric(s,'interest').eligible,1);
 payVaultInterest(s);assert.equal(metric(s,'interest').raw,1);assert.equal(p.credits,before+1);
});
test('funded loan earns both living parties only after full encounter and full repayment',()=>{
 for(const at of [1,2,3]){
  const {s,p,item}=shop(),lender=s.players[1]!;s.phase='TRADE';p.stock=[];p.inventory=[item.id];item.owner=p.id;item.lastTradePrice=40;
  handleLoanAction(s,p,{type:'loan-propose',lenderId:lender.id,itemId:item.id,principal:20});const loan=s.loans!.at(-1)!;
  handleLoanAction(s,lender,{type:'loan-respond',loanId:loan.id,accept:true});assert.equal(item.owner,`collateral:${loan.id}`);
  const credits=lender.credits;s.encounter=at;handleLoanAction(s,p,{type:'loan-repay',loanId:loan.id,amount:10});assert.equal(metric(s,'loanRepaid').points,0);
  handleLoanAction(s,p,{type:'loan-repay',loanId:loan.id,amount:10});assert.equal(item.owner,p.id);assert.equal(lender.credits,credits+20);
  for(const id of [p.id,lender.id])assert.equal(metric(s,'loanRepaid',id).points,at===3?5:0);
  assert.throws(()=>handleLoanAction(s,p,{type:'loan-repay',loanId:loan.id,amount:1}));
 }
});
test('reversing borrower and lender cannot score the same collateral origin twice for the pair',()=>{
 const {s,p,item}=shop(),other=s.players[1]!;s.phase='TRADE';p.stock=[];p.inventory=[item.id];item.owner=p.id;item.lastTradePrice=40;
 const fundAndRepay=(borrower:typeof p,lender:typeof p,at:number)=>{
  handleLoanAction(s,borrower,{type:'loan-propose',lenderId:lender.id,itemId:item.id,principal:20});const loan=s.loans!.at(-1)!;handleLoanAction(s,lender,{type:'loan-respond',loanId:loan.id,accept:true});s.encounter=at;handleLoanAction(s,borrower,{type:'loan-repay',loanId:loan.id,amount:20});
 };
 fundAndRepay(p,other,3);p.inventory=[];other.inventory.push(item.id);item.owner=other.id;fundAndRepay(other,p,5);
 for(const actor of [p.id,other.id]){assert.equal(metric(s,'loanRepaid',actor).raw,2);assert.equal(metric(s,'loanRepaid',actor).eligible,1);}
});
test('public complete run stores exact shared score breakdown, survives replay and counts settlement',()=>{
 let s=createAppraisalRun(['alice','bob'],'personal-full-run',{personalScoringRules:1,startingCredits:40,catalogVersion:4,survival:{maxLife:6,encounterLifeCost:1,entryEnergyCost:0},collectorDeadline:2});
 for(let n=0;n<200&&s.phase!=='RESULTS';n++){
  if(s.phase==='REVEAL'){s=advanceAppraisalEncounter(s);continue;}
  const p=s.players.find(p=>!p.done&&!p.paused)!;assert(p);
  const view=appraisalViewFor(s,p.id),body=view.self.eventOffer||view.self.abilityChoice?appraisalBotDecision(view,'cautious'):s.phase==='PORTALS'?{type:'enter',portalId:view.self.portals.find(p=>!p.disabled)!.id}:{type:'done'};
  s=applyAppraisalAction(s,{...body,playerId:p.id,requestId:`full-${n}`,encounter:s.encounter} as AppraisalAction);
 }
 assert.equal(s.phase,'RESULTS');for(const row of s.collector!){
  const score=(row as any).personalScore;assert(score,'Collector must store canonical personal breakdown');assert.equal(score.total,row.score);assert.equal(score.groups.reduce((n:number,g:any)=>n+g.points,0),row.score);
  assert.equal(metric(s,'survived',row.playerId).eligible,2);
 }
 const audit=exportAppraisalAudit(s);assert.deepEqual(exportAppraisalAudit(replayAppraisalAudit(audit)),audit);
 assert.deepEqual((audit as any).personalPerformance,s.personalPerformance,'ended audit includes canonical receipts, not only totals');
});
test('market cash sales count once per origin and gross credits exclude side bonuses',()=>{
 const {s,p,item}=shop();s.phase='TRADE';p.stock=[];item.owner=p.id;p.inventory=[item.id];
 s.market={...s.market,encounter:1,open:true,budget:200,orders:[{id:'personal-order',kind:item.kind,price:20,quota:{alice:2},requirement:'any'} as any]};
 marketSell(s,p,item.id,'personal-order');assert.equal(metric(s,'soldQuantity').points,5);assert.equal(metric(s,'soldGrossCredits').eligible,20);
 // Named custody-return fixture proves a repeated sale of this origin cannot mint achievements.
 item.owner=p.id;p.inventory.push(item.id);marketSell(s,p,item.id,'personal-order');assert.equal(metric(s,'soldQuantity').raw,2);assert.equal(metric(s,'soldQuantity').eligible,1);assert.equal(metric(s,'soldGrossCredits').raw,40);assert.equal(metric(s,'soldGrossCredits').eligible,20);
});
test('only funded auction winner gets buying points and old custody owner gets no sale',()=>{
 const {s,p,item}=shop(),buyer=s.players[1]!;s.config.brokerage={auctionProbability:1,maxLots:2,bondProbability:0};s.vault=[item.id];item.owner='vault';p.stock=[];s.market.lots=auctionLots(s);const lot=s.market.lots.find(l=>l.itemId===item.id)!;assert(lot);
 placeBid(s,buyer,lot.id,lot.minimum);assert.equal(metric(s,'bought',buyer.id).points,0);settleAuction(s);
 assert.equal(item.owner,buyer.id);assert.equal(metric(s,'bought',buyer.id).points,2);assert.equal(metric(s,'soldQuantity').points,0);settleAuction(s);assert.equal(metric(s,'bought',buyer.id).raw,1);
});
test('successful RPS theft records an actual transfer without granting buy or sale points',()=>{
 const {s,p,item}=shop(),victim=s.players[1]!;s.config.core2=true;victim.eventOffer=null;s.phase='TRADE';p.stock=[];item.owner=victim.id;victim.inventory=[item.id];
 startTheftDuel(s,p,{victimId:victim.id});const duel=s.theftDuels!.at(-1)!;chooseTheftHand(s,p,duel.id,'rock');chooseTheftHand(s,victim,duel.id,'scissors');
 assert.equal(duel.status,'won');assert.equal(item.owner,p.id);assert.equal(metric(s,'theft').points,4);assert.equal(metric(s,'bought').points,0);assert.equal(metric(s,'soldQuantity',victim.id).points,0);
});
test('NPC deferred contract earns only on successful return and not final forced principal return',()=>{
 const {s,p}=shop();s.config.npcEvents=true;p.npcContracts={vampire:{signedAt:1}};s.encounter=2;
 redeemNpcContracts(s,p,'vampire');assert.equal(metric(s,'npcContract').points,4);redeemNpcContracts(s,p,'vampire');assert.equal(metric(s,'npcContract').raw,1);
 const closed=shop();closed.s.config.npcEvents=true;closed.p.npcContracts={vampire:{signedAt:1}};closed.s.encounter=closed.s.config.collectorDeadline!;collectRun(closed.s);assert.equal(metric(closed.s,'npcContract').points,0);
});
test('accepted NPC wishlist scores its fulfilled contract identity and actual cash sale separately',()=>{
 const {s,p,item}=shop();p.selectedPortalId=p.portals.find(portal=>portal.npc===item.npc)!.id;p.stock=[];item.owner=p.id;item.genuine=true;p.inventory=[item.id];p.npcTrust![item.npc]=10;
 p.statuses=[{id:'B16',charges:1,starts:1,expires:2,power:10}];
 applyWish(s,p,item.npc,{kind:item.kind,price:20});assert.equal(metric(s,'npcContract').points,0);
 wishSell(s,p,item.id,0);assert(!p.inventory.includes(item.id),'fixed named wish fixture must settle');
 assert.equal(metric(s,'soldQuantity').points,5);assert.equal(metric(s,'npcContract').points,4);assert.throws(()=>wishSell(s,p,item.id,0));assert.equal(metric(s,'npcContract').raw,1);
});
test('dead estate keeps original rarity, excludes copies, applies modifier before ghost bonus',()=>{
 const {s,p,item}=shop();p.stock=[];p.inventory=[item.id];item.owner=p.id;item.appearance={rarity:'mythic'} as any;
 const copy={...item,id:'personal-copy-estate',copy:{sourceId:item.id,number:1,valuePercent:40}};s.items[copy.id]=copy;p.inventory.push(copy.id);
 damageLife(s,p,99,'blood-pact',false);p.statuses=[{id:'D10',charges:1,starts:1,expires:99}];s.ghosts={[p.id]:{round:1,available:false,swaps:[],encounter:1,slots:[],jobs:[],bonus:7,draws:0}};
 s.encounter=s.config.collectorDeadline!;collectRun(s);const result=s.collector!.find(r=>r.playerId===p.id)!;const score=result.personalScore!;
 assert.equal(score.metrics.find(m=>m.id==='rarity')!.points,28);assert.equal(score.total,Math.floor((result.credits+result.itemValue+score.performancePoints)*.8)+7);assert.equal(score.ghostBonus,7);
 assert.deepEqual(personalScoreFor(s,p.id),score,'post-Collector projection must keep the frozen estate after custody is cleared');
});
