import {openRoundRewards} from '../src/game/appraisal/round-rewards.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {createAppraisalRun} from '../src/game/appraisal/engine.js';
import {startTheftDuel,chooseTheftHand} from '../src/game/appraisal/theft.js';
import {pickpocket,stealShop} from '../src/game/appraisal/core2-actions.js';
import {reappraiseOwnedItem} from '../src/game/appraisal/price-integrity.js';
import {appraise,enforceCaps,maxLifeOf,retire} from '../src/game/appraisal/mechanics.js';
import {applyAppraisalAction} from '../src/game/appraisal/engine.js';
import {collectRun} from '../src/game/appraisal/survival.js';
import type {AppraisalAction} from '../src/game/appraisal/types.js';
import {handleLoanAction} from '../src/game/appraisal/secure-storage.js';
import {damageLife} from '../src/game/appraisal/mechanics.js';
import {personalScoreFor} from '../src/game/appraisal/personal-scoring.js';

function fixture(seed='score-eligibility'){
 const s=createAppraisalRun(['alice','bob'],seed,{personalScoringRules:1,catalogVersion:4,core2:true,secureEconomy:true,survival:{maxLife:6,encounterLifeCost:1,entryEnergyCost:0}});
 const [p,q]=s.players as [typeof s.players[number],typeof s.players[number]];for(const seat of s.players)seat.eventOffer=null;s.phase='TRADE';
 const item=Object.values(s.items).find(i=>i.npcOwnerId===p.id&&i.encounter===1)!;p.stock=[];return {s,p,q,item};
}
const metric=(s:ReturnType<typeof fixture>['s'],id:string)=>personalScoreFor(s,'alice').metrics.find(m=>m.id===id)!;

test('different successful duels cannot farm the same stolen origin, including a copy',()=>{
 const {s,p,q,item}=fixture();
 for(let n=0;n<3;n++){
  // Named custody-return fixture; the next encounter grants a fresh duel but no new origin.
  s.encounter=n+1;p.stealTried=[];
  const target=n===2?{...item,id:'stolen-copy-fixture',copy:{sourceId:item.id,number:1,valuePercent:25}}:item;
  if(n===2){retire(s,p,item.id,'copy-custody-fixture');s.items[target.id]=target;}
  p.inventory=[];target.owner=q.id;q.inventory=[target.id];
  startTheftDuel(s,p,{victimId:q.id});const duel=s.theftDuels!.at(-1)!;
  chooseTheftHand(s,p,duel.id,'rock');chooseTheftHand(s,q,duel.id,'scissors');
  assert.equal(duel.status,'won');assert.equal(target.owner,p.id);
 }
 assert.equal(metric(s,'theft').raw,3);assert.equal(metric(s,'theft').eligible,1);assert.equal(metric(s,'theft').points,4);
});
test('supported legacy cash theft records a real transfer and item theft shares the origin rule',()=>{
 let cash=false,goods=false;
 // Bounded outcome fixtures cover existing success/failure branches; not a balance sample.
 for(let n=0;n<20&&(!cash||!goods);n++){
  const a=fixture(`legacy-theft-${n}`);a.s.config.secureEconomy=false;const before=a.p.credits,victim=a.q.credits;
  pickpocket(a.s,a.p,a.q.id);if(a.p.credits>before){cash=true;assert.equal(a.q.credits,victim-3);assert.equal(metric(a.s,'theft').points,4);}else assert.equal(metric(a.s,'theft').points,0);
  const b=fixture(`legacy-shop-${n}`);b.s.config.secureEconomy=false;b.item.owner=`npc:${b.p.id}:1`;b.p.stock=[b.item.id];stealShop(b.s,b.p,b.item.id);
  if(b.item.owner===b.p.id){goods=true;assert.equal(metric(b.s,'theft').points,4);}else assert.equal(metric(b.s,'theft').points,0);
 }
 assert(cash&&goods,'bounded fixtures must reach both success branches');
});
test('owned appraisal uses the same first attempt identity as merchant appraisal',()=>{
 const a=fixture();a.item.owner=a.p.id;a.p.inventory=[a.item.id];
 reappraiseOwnedItem(a.s,a.p,a.item.id,a.item.base);assert.equal(metric(a.s,'accurateAppraisal').points,2);
 a.s.encounter++;reappraiseOwnedItem(a.s,a.p,a.item.id,a.item.base);assert.equal(metric(a.s,'accurateAppraisal').eligible,1);
 const b=fixture();b.item.owner=`npc:${b.p.id}:1`;b.p.stock=[b.item.id];appraise(b.s,b.p,b.item.id,0,false,true);
 b.item.owner=b.p.id;b.p.inventory=[b.item.id];b.p.stock=[];reappraiseOwnedItem(b.s,b.p,b.item.id,b.item.base);assert.equal(metric(b.s,'accurateAppraisal').points,0);
});
test('an excluded copy appraisal cannot consume the first original appraisal right',()=>{
 const {s,p,item}=fixture();item.owner=p.id;p.inventory=[item.id];
 const copy={...item,id:'appraised-copy-fixture',base:Math.floor(item.base*.25),copy:{sourceId:item.id,number:1,valuePercent:25}};s.items[copy.id]=copy;p.inventory.push(copy.id);
 reappraiseOwnedItem(s,p,copy.id,copy.base);assert.equal(metric(s,'accurateAppraisal').eligible,0);
 reappraiseOwnedItem(s,p,item.id,item.base);assert.equal(metric(s,'accurateAppraisal').raw,2);assert.equal(metric(s,'accurateAppraisal').eligible,1);
});
function lifeRelic(){
 const s=createAppraisalRun(['alice','bob'],'life-cap-score',{personalScoringRules:1,catalogVersion:3,polish:true,secureEconomy:true,survival:{maxLife:6,encounterLifeCost:1,entryEnergyCost:0}}),p=s.players[0]!;
 const original=Object.values(s.items)[0]!;const item={...original,id:'cap-relic-fixture',kind:'life-relic' as const,owner:p.id,genuine:true,cursed:false};s.items[item.id]=item;p.inventory=[item.id];p.life=7;p.eventOffer=null;
 assert.equal(maxLifeOf(s,p),7);return {s,p,item};
}
test('public vault movement counts only actual HP clamped after losing a held life relic',()=>{
 const {s,p,item}=lifeRelic();s.phase='REVEAL';openRoundRewards(s);
 const paid=applyAppraisalAction(s,{type:'round-bank',playerId:p.id,requestId:'cap-salary',encounter:1});
 const after=applyAppraisalAction(paid,{type:'vault-deposit-item',itemId:item.id,playerId:p.id,requestId:'cap-deposit',encounter:1});
 assert.equal(after.players[0]!.life,6);assert.equal(metric(after,'lifeLost').raw,1);enforceCaps(after);assert.equal(metric(after,'lifeLost').raw,1);
});
test('Collector includes prior cap normalization but its own item cleanup cannot award postgame HP points',()=>{
 const a=lifeRelic();a.s.encounter=a.s.config.collectorDeadline!;retire(a.s,a.p,a.item.id,'settlement-fixture');collectRun(a.s);
 assert.equal(a.s.collector![0]!.personalScore!.metrics.find(m=>m.id==='lifeLost')!.raw,1);
 const b=lifeRelic();b.s.encounter=b.s.config.collectorDeadline!;collectRun(b.s);const score=structuredClone(b.s.collector![0]!.personalScore);enforceCaps(b.s);
 assert.equal(b.p.life,6);assert.equal(metric(b.s,'lifeLost').raw,0);assert.deepEqual(personalScoreFor(b.s,b.p.id),score);
});
for(const mode of ['cash-rebate','free','copy','barter'] as const)test(`public inventory settlement: ${mode} preserves cash and origin eligibility`,()=>{
 const f=fixture(),{p,q,item}=f;let s=f.s,n=0;item.owner=p.id;p.inventory=[item.id];
 if(mode==='copy'){const source={...item,id:'copy-origin-fixture',owner:'retired'};s.items[source.id]=source;item.copy={sourceId:source.id,number:1,valuePercent:25};}
 const swap=Object.values(s.items).find(i=>i.npcOwnerId===q.id&&i.encounter===1)!;
 if(mode==='barter'){swap.owner=q.id;q.inventory=[swap.id];}
 const act=(id:string,body:object)=>{s=applyAppraisalAction(s,{...body,playerId:id,encounter:s.encounter,requestId:`eligibility-${n++}`} as AppraisalAction);};
 const price=mode==='free'?0:20,rebate=mode==='cash-rebate'?3:0,beforeP=p.credits,beforeQ=q.credits;
 act(p.id,{type:'share',itemId:item.id,allow:true,purchase:true,rebate});
 act(q.id,{type:'propose',sellerId:p.id,itemId:item.id,credits:price,...(mode==='barter'?{swapItemId:swap.id}:{})});
 const offer=s.trades.at(-1)!;act(p.id,{type:'respond',offerId:offer.id,accept:true});
 assert.equal(s.items[item.id]!.owner,q.id);assert.equal(s.players[0]!.credits,beforeP+price-rebate);assert.equal(s.players[1]!.credits,beforeQ-price+rebate);
 const expected=mode==='cash-rebate'?5:0;assert.equal(metric(s,'soldQuantity').points,expected);
 assert.equal(metric(s,'soldGrossCredits').eligible,mode==='cash-rebate'?20:0);
 const bought=personalScoreFor(s,q.id).metrics.find(m=>m.id==='bought')!;assert.equal(bought.points,mode==='cash-rebate'?2:0);
 const response=s.commands.at(-1)!;assert(response.type!=='advance');assert.deepEqual(applyAppraisalAction(s,response),s,'duplicate acceptance cannot add receipts');
});
test('final foreclosure awards rarity to the dead lender estate, never repayment points',()=>{
 const {s,p,q,item}=fixture();item.owner=p.id;p.inventory=[item.id];item.lastTradePrice=40;item.appearance={rarity:'mythic'} as any;
 handleLoanAction(s,p,{type:'loan-propose',lenderId:q.id,itemId:item.id,principal:20});const loan=s.loans!.at(-1)!;
 handleLoanAction(s,q,{type:'loan-respond',loanId:loan.id,accept:true});assert.equal(item.owner,`collateral:${loan.id}`);
 damageLife(s,q,6,'blood-pact',false);s.encounter=s.config.collectorDeadline!;collectRun(s);
 assert.equal(loan.status,'foreclosed');assert(!s.collector![0]!.items.some(i=>i.id===item.id));assert(s.collector![1]!.items.some(i=>i.id===item.id));
 assert.equal(s.collector![1]!.personalScore!.metrics.find(m=>m.id==='rarity')!.points,28);
 for(const row of s.collector!)assert.equal(row.personalScore!.metrics.find(m=>m.id==='loanRepaid')!.points,0);
});
