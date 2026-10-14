import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { applyAppraisalAction, appraisalViewFor, assertAppraisalInvariants, BROKERAGE_RULES, createAppraisalRun, replayAppraisalAudit, SURVIVAL_RULES } from '../src/game/appraisal/index.js';
import { completeAppraisedSale, damageLife, grant, spend } from '../src/game/appraisal/mechanics.js';
import { marketConditionMatch, marketOrderReserve, trustAcceptanceBonus } from '../src/game/appraisal/market-contracts.js';
import { settleAuction } from '../src/game/appraisal/brokerage.js';
import { randomAt } from '../src/game/random.js';
import type { AppraisalAction, AppraisalState, MarketContract } from '../src/game/appraisal/types.js';
import { parseAppraisalMessage } from '../src/server/appraisal-messages.js';
import { MarketSale } from '../src/appraisal-client/MarketSale.js';
import { AppraisalDesk, DarkMarket } from '../src/appraisal-client/components.js';
import { appraisalFixture } from './support/appraisal-fixture.js';
import { simulateAppraisalRun } from '../src/simulation/appraisal.js';

type Body=AppraisalAction extends infer A?A extends AppraisalAction?Omit<A,'playerId'|'requestId'|'encounter'>:never:never;
let request=0;
const act=(s:AppraisalState,body:Body,id='alice')=>applyAppraisalAction(s,{...body,playerId:id,requestId:`commerce-${++request}`,encounter:s.encounter} as AppraisalAction);
function fixture():AppraisalState {const s=appraisalFixture();for(const p of s.players){p.eventOffer=null;p.offerSlots=2;}return s;}
function appraised():AppraisalState {let s=fixture();s=act(s,{type:'appraise',itemId:s.players[0]!.stock[0]!,value:20});return s;}
const contract=(bonus:MarketContract['bonus']={kind:'credits',amount:3},cost:MarketContract['fullPriceCost']={kind:'energy',amount:2}):MarketContract=>({requirements:[{property:'genuine',value:true},{property:'cursed',value:false}],bonus,fullPriceCost:cost});
function market(c=contract(),survival=false):AppraisalState {
  const s=fixture();s.phase='TRADE';
  if(survival){s.config.survival=SURVIVAL_RULES;s.version=5;for(const p of s.players){p.life=3;p.recoveryUsed=false;}}
  const order={id:'contract',kind:'food' as const,price:25,quota:{alice:1,bob:1},contract:c};
  s.market={encounter:1,open:true,budget:marketOrderReserve(order)*2,orders:[order]};assertAppraisalInvariants(s);return s;
}

test('NPC sale pays 10 percent of actual sale once, credits the appraiser, and grows only that NPC trust',()=>{
  let s=appraised();const id=s.players[0]!.stock[0]!;const before=s.players[0]!.credits;
  const command={type:'buy',itemIds:[id],condition:false,playerId:'alice',requestId:'commission-once',encounter:1} satisfies AppraisalAction;
  s=applyAppraisalAction(s,command);assert.equal(s.players[0]!.credits,before-20+2);assert.equal(s.players[0]!.npcTrust!.orc,1);assert.equal(s.players[0]!.npcTrust!.vampire,undefined);
  assert.equal(s.items[id]!.commissionPaid,true);assert.equal(applyAppraisalAction(s,command),s);assert.equal(s.ledger.filter(e=>e.reason==='appraisal-commission').length,1);
  s.phase='TRADE';s=act(s,{type:'share',itemId:id,allow:true,purchase:true});s=act(s,{type:'propose',itemId:id,sellerId:'alice',credits:10},'bob');s=act(s,{type:'respond',offerId:s.trades.at(-1)!.id,accept:true});
  assert.equal(s.players[0]!.npcTrust!.orc,1);assert.equal(s.ledger.filter(e=>e.reason==='appraisal-commission').length,1);assertAppraisalInvariants(s);
});
test('cross-shop commission belongs to the appraiser in addition to the agreed fee',()=>{
  let s=appraised();const itemId=s.players[0]!.stock[0]!;s.phase='TRADE';s=act(s,{type:'share',itemId,allow:true,purchase:true});
  s=act(s,{type:'propose',sellerId:'alice',itemId,credits:5},'bob');s=act(s,{type:'respond',offerId:s.trades[0]!.id,accept:true});
  assert.equal(s.players[0]!.credits,207);assert.equal(s.players[1]!.credits,175);assert.equal(s.players[0]!.npcTrust!.orc,1);assert.deepEqual(s.players[1]!.npcTrust,{});
});
test('bundle commissions use actual discounted per-item prices and unappraised purchases pay none',()=>{
  let s=appraised();const p=s.players[0]!;s=act(s,{type:'appraise',itemId:p.stock[1]!,value:24});grant(s,s.players[0]!,'B03');
  const before=s.players[0]!.credits;s=act(s,{type:'buy',itemIds:[...s.players[0]!.stock],condition:true});
  const commissions=s.trace.filter(t=>t.type==='appraisal-commission');const shares=commissions.map(t=>Number(t.details.salePrice));
  const paid=s.ledger.filter(e=>e.reason==='npc-purchase').at(-1)!.amount;assert.equal(shares.reduce((a,b)=>a+b,0),paid);
  const commission=shares.reduce((n,value)=>n+Math.floor(value/10),0);assert.equal(s.players[0]!.credits,before-paid+commission);assert.equal(s.players[0]!.npcTrust!.orc,2);
  s=fixture();const itemId=s.players[0]!.stock[0]!;s=act(s,{type:'buy',itemIds:[itemId],condition:false});assert.equal(s.players[0]!.credits,180);assert.deepEqual(s.players[0]!.npcTrust,{});
});
test('consigned appraisals pay on the first vault auction sale, without changing dead spectator assets',()=>{
  let s=appraised();s.config.brokerage=BROKERAGE_RULES;s.vault=[];const itemId=s.players[0]!.stock[0]!;s=act(s,{type:'unsold',itemId,choice:'consign'});
  s.market.lots=[{id:'lot',itemId,minimum:1,bids:{bob:30}}];const before=s.players[0]!.credits;settleAuction(s);
  assert.equal(s.players[0]!.credits,before+3);assert.equal(s.players[0]!.npcTrust!.orc,1);assertAppraisalInvariants(s);
  const dead=appraised();dead.config.survival=SURVIVAL_RULES;dead.version=5;for(const p of dead.players)p.life=6;damageLife(dead,dead.players[0]!,6,'fixture');
  const frozen=structuredClone(dead.players[0]);completeAppraisedSale(dead,dead.items[dead.players[0]!.stock[0]!]!,30);assert.deepEqual(dead.players[0],frozen);
});
test('insufficient funds reject atomically before any commission or trust can stick',()=>{
  const s=appraised();spend(s,s.players[0]!,199,0,'fixture');const before=structuredClone(s);
  assert.throws(()=>act(s,{type:'buy',itemIds:[s.players[0]!.stock[0]!],condition:false}));assert.deepEqual(s,before);
});
test('trust persists by NPC, caps at ten and raises low-offer acceptance without changing detection or accepting zero',()=>{
  const s=fixture();const p=s.players[0]!,item=s.items[p.stock[0]!]!;
  for(let i=0;i<12;i++){const lot={...item,id:`commission-${i}`,appraisedBy:p.id,commissionPaid:false};completeAppraisedSale(s,lot,10);}
  assert.equal(p.npcTrust!.orc,10);assert.equal(trustAcceptanceBonus(p,'orc'),.5);assert.equal(trustAcceptanceBonus(p,'alien'),0);
  let low=fixture();const id=low.players[0]!.stock[0]!;low.items[id]!.reservation=25;
  for(let n=0;randomAt(low.seed,`1:alice:${id}:trust-accept:0`)>=.5;n++)low.seed=`trust-${n}`;
  const high=structuredClone(low);high.players[0]!.npcTrust!.orc=10;
  low=act(low,{type:'appraise',itemId:id,value:20});const accepted=act(high,{type:'appraise',itemId:id,value:20});
  assert.equal(low.items[id]!.lastAccepted,false);assert.equal(accepted.items[id]!.lastAccepted,true);assert.equal(low.players[0]!.caught,accepted.players[0]!.caught);
  const zero=act(high,{type:'appraise',itemId:id,value:0});assert.equal(zero.items[id]!.lastAccepted,false);
});
for(const bonus of [{kind:'credits',amount:3},{kind:'energy',amount:2},{kind:'life',amount:1},{kind:'buff',statusId:'B03'}] as const)test(`matched market contract grants ${bonus.kind}, reserves max credit liability and consumes quota once`,()=>{
  let s=market(contract(bonus),bonus.kind==='life');const before=s.market.budget;const command={type:'market-sell',itemId:'owned-food',orderId:'contract',resolution:'discount',playerId:'alice',requestId:'market-once',encounter:1} as const;
  s=applyAppraisalAction(s,command);assert.equal(s.players[0]!.credits,225+(bonus.kind==='credits'?3:0));assert.equal(s.market.budget,before-marketOrderReserve(s.market.orders[0]!));
  if(bonus.kind==='energy')assert.equal(s.players[0]!.energy,9);if(bonus.kind==='life')assert.equal(s.players[0]!.life,4);if(bonus.kind==='buff')assert(s.players[0]!.statuses.some(v=>v.id==='B03'));
  assert.equal(applyAppraisalAction(s,command),s);assert.throws(()=>act(s,{type:'market-sell',itemId:'owned-food',orderId:'contract'}));assertAppraisalInvariants(s);
});
test('a mismatched curse/authenticity defaults to a 20 percent markdown and never grants the bonus',()=>{
  let s=market();s.items['owned-food']!.cursed=true;s=act(s,{type:'market-sell',itemId:'owned-food',orderId:'contract'});
  assert.equal(s.players[0]!.credits,220);assert.equal(s.players[0]!.energy,7);assert.equal(s.market.budget,28);assert(s.players[0]!.notes.at(-1)!.includes('ลดราคา 20%'));
});
for(const cost of [{kind:'energy',amount:2},{kind:'life',amount:1},{kind:'debuff',statusId:'D01'}] as const)test(`mismatched full-price sale takes the agreed ${cost.kind}, pays full base and no bonus`,()=>{
  let s=market(contract(undefined,cost),cost.kind==='life');s.items['owned-food']!.genuine=false;s=act(s,{type:'market-sell',itemId:'owned-food',orderId:'contract',resolution:'sacrifice'});
  assert.equal(s.players[0]!.credits,225);if(cost.kind==='energy')assert.equal(s.players[0]!.energy,5);if(cost.kind==='life')assert.equal(s.players[0]!.life,2);if(cost.kind==='debuff')assert(s.players[0]!.statuses.some(v=>v.id==='D01'));
});
test('a sacrifice must be affordable before checking hidden truth; rejection cannot become a free condition probe',()=>{
  for(const genuine of [false,true]) {
    const s=market();s.items['owned-food']!.genuine=genuine;s.players[0]!.energy=1;const before=structuredClone(s);
    assert.throws(()=>act(s,{type:'market-sell',itemId:'owned-food',orderId:'contract',resolution:'sacrifice'}),/พลังไม่พอ/);assert.deepEqual(s,before);
  }
  const s=market(contract(undefined,{kind:'life',amount:1}),true);s.players[0]!.life=1;assert.throws(()=>act(s,{type:'market-sell',itemId:'owned-food',orderId:'contract',resolution:'sacrifice'}));
});
test('a status sacrifice cannot be free when already active; a protection charge may pay instead',()=>{
  const initial=market(contract(undefined,{kind:'debuff',statusId:'D01'}));initial.items['owned-food']!.cursed=true;grant(initial,initial.players[0]!,'D01');
  const before=structuredClone(initial);assert.throws(()=>act(initial,{type:'market-sell',itemId:'owned-food',orderId:'contract',resolution:'sacrifice'}),/มีผลเสียนี้อยู่แล้ว/);assert.deepEqual(initial,before);
  grant(initial,initial.players[0]!,'B06');const paid=act(initial,{type:'market-sell',itemId:'owned-food',orderId:'contract',resolution:'sacrifice'});
  assert.equal(paid.players[0]!.credits,225);assert(!paid.players[0]!.statuses.some(s=>s.id==='B06'));
});
test('private market preview is identical for opposite hidden qualities and labels the unknown risk before selling',()=>{
  const s=market();const opposite=structuredClone(s);opposite.items['owned-food']!.genuine=false;opposite.items['owned-food']!.cursed=true;
  const game=appraisalViewFor(s,'alice'),other=appraisalViewFor(opposite,'alice');assert.deepEqual(game,other);
  const item=game.self.inventory.find(i=>i.id==='owned-food')!;const order=game.market.orders[0]!;
  assert.equal(marketConditionMatch(order.contract!,item.knowledge),'unknown');
  const html=renderToStaticMarkup(createElement(MarketSale,{game,item,order,submit:()=>{},disabled:false}));
  for(const text of ['ยังตรวจไม่ครบ','ตรงรับ 28 / ผิดรับ 20','สละ 2 พลัง','ไม่ได้โบนัส'])assert(html.includes(text),text);
  const marketHtml=renderToStaticMarkup(createElement(DarkMarket,{game,submit:()=>{},disabled:false}));for(const text of ['ต้องการ: ของแท้ และ ไม่มีคำสาป','เครดิตเพิ่ม 3','ลด 20%','ราคาเต็ม 25'])assert(marketHtml.includes(text),text);
  const shop=appraised(),view=appraisalViewFor(shop,'alice');const desk=renderToStaticMarkup(createElement(AppraisalDesk,{game:view,item:view.self.stock[0]!,submit:()=>{},disabled:false}));assert(desk.includes('ค่านายหน้า 10%'));assert(desk.includes('จุดเปอร์เซ็นต์'));
});
test('generated contracts vary requirements, bonuses and costs; their budget is fully reserved and old audits replay',()=>{
  const requirements=new Set<string>(),bonuses=new Set<string>(),costs=new Set<string>();
  for(let i=0;i<60;i++) {
    const s=createAppraisalRun(['a','b'],`contracts-${i}`,{marketProbability:1,survival:SURVIVAL_RULES});
    assert.equal(s.market.budget,s.market.orders.reduce((n,o)=>n+marketOrderReserve(o)*2,0));
    for(const o of s.market.orders){requirements.add(JSON.stringify(o.contract!.requirements));bonuses.add(o.contract!.bonus.kind);costs.add(o.contract!.fullPriceCost.kind);}
  }
  assert.equal(requirements.size,6);assert.equal(bonuses.size,4);assert.equal(costs.size,3);
  for(const count of [2,4]){const audit=simulateAppraisalRun(count,'trader',`commerce-replay-${count}`,{brokerage:BROKERAGE_RULES});assert.equal(replayAppraisalAudit(audit).phase,'RESULTS');}
});
test('parser accepts explicit settlement choices and rejects forged truth, payout, trust and hidden metadata',()=>{
  const wrap=(extra:Record<string,unknown>)=>({type:'action',matchId:'m',action:{type:'market-sell',itemId:'item',orderId:'order',requestId:'r',encounter:1,...extra}});
  for(const resolution of ['discount','sacrifice'])assert.equal(parseAppraisalMessage(wrap({resolution})).type,'action');
  for(const bad of [{resolution:'free'},{matched:true},{payout:100},{npcTrust:10},{commissionPaid:false},{contract:{}}])assert.throws(()=>parseAppraisalMessage(wrap(bad)));
});
