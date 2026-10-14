import test from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {advanceAppraisalEncounter,applyAppraisalAction,appraisalViewFor,assertAppraisalInvariants,createAppraisalRun,exportAppraisalAudit,replayAppraisalAudit,SURVIVAL_RULES} from '../src/game/appraisal/index.js';
import {appraise,completeAppraisedSale,detectionRisk,grant,marketSell,purchase,recoveryOffer,retire} from '../src/game/appraisal/mechanics.js';
import {coinWinChance,commissionRate,heldPassives,inspectionLimit,passiveBonuses,PASSIVE_ITEMS} from '../src/game/appraisal/passives.js';
import {ITEM_SPECS,merchantKinds,NPC_SPECS} from '../src/game/appraisal/content.js';
import {PASSIVE_ITEM_IDS} from '../src/game/appraisal/types.js';
import type {AppraisalAction,AppraisalState,ItemKind,NpcId} from '../src/game/appraisal/types.js';
import {randomAt} from '../src/game/random.js';
import {flipRoundReward,openRoundRewards} from '../src/game/appraisal/round-rewards.js';
import {inspectionCost,inspectionQuota,npcAcceptanceChance,purchaseEnergy,purchasePrice} from '../src/appraisal-client/model.js';
import {Inspect} from '../src/appraisal-client/components.js';
import {HeldEffects} from '../src/appraisal-client/HeldEffects.js';
import {MarketSale} from '../src/appraisal-client/MarketSale.js';

type Body=AppraisalAction extends infer A?A extends AppraisalAction?Omit<A,'playerId'|'requestId'|'encounter'>:never:never;
let request=0;
const act=(s:AppraisalState,body:Body,id='alice')=>applyAppraisalAction(s,{...body,playerId:id,requestId:`gear-${++request}`,encounter:s.encounter} as AppraisalAction);
function fixture(){const s=createAppraisalRun(['alice','bob'],'passive-fixture',{catalogVersion:3,survival:SURVIVAL_RULES,startingCredits:200,marketProbability:0});s.phase='APPRAISAL';for(const p of s.players){p.eventOffer=null;p.offerSlots=2;p.stock=[...p.portals[0]!.stock];p.selectedPortalId=p.portals[0]!.id;p.portals[0]!.npc='orc';p.energy=8;for(const id of p.stock)Object.assign(s.items[id]!,{npc:'orc',base:20,ask:20,reservation:1});}return s;}
function equip(s:AppraisalState,kind:ItemKind,count=1,seat=0){const p=s.players[seat]!,ids:string[]=[];for(let n=0;n<count;n++){const id=`gear-item-${++request}`;s.items[id]={id,kind,base:ITEM_SPECS[kind].anchor,genuine:false,cursed:true,ask:20,owner:p.id,npcOwnerId:p.id,npc:'orc',encounter:s.encounter,certificate:false,lastAppraisal:null,lastAccepted:null,reservation:1};p.inventory.push(id);ids.push(id);}return ids;}
function end(s:AppraisalState){for(let n=0;n<30&&!['REVEAL','RESULTS'].includes(s.phase);n++){const p=s.players.find(p=>!p.done&&!p.paused)!;s=act(s,{type:'done'},p.id);}return s;}

test('18 unique passive effects extend the catalog to 48 and preserve all version-2 merchant pools',()=>{
 assert.equal(PASSIVE_ITEM_IDS.length,18);assert.equal(new Set(Object.values(PASSIVE_ITEMS).map(i=>i.passive.effect)).size,18);assert.equal(Object.keys(ITEM_SPECS).length,48);
 const old=new Set(Object.keys(NPC_SPECS).flatMap(n=>merchantKinds(n as NpcId,2)));assert.equal(old.size,30);assert(PASSIVE_ITEM_IDS.every(k=>!old.has(k)));
 assert.equal(new Set(Object.keys(NPC_SPECS).flatMap(n=>merchantKinds(n as NpcId,3))).size,48);
});
for(const kind of PASSIVE_ITEM_IDS)test(`${kind}: two held copies stack, counterfeit/curse do not become hidden oracles, and selling removes the effect`,()=>{
 const s=fixture(),p=s.players[0]!,ids=equip(s,kind,2);const effect=PASSIVE_ITEMS[kind].passive;
 assert.equal(passiveBonuses(s,p)[effect.effect],effect.amount*2);retire(s,p,ids[0]!,'test-sale');assert.equal(passiveBonuses(s,p)[effect.effect],effect.amount);
 s.config.catalogVersion=2;assert.equal(passiveBonuses(s,p)[effect.effect],0);assertAppraisalInvariants(s);
});
test('warrants and notebooks stack; free inspections work at zero energy and do not consume unrelated cost statuses',()=>{
 let s=fixture();equip(s,'inspection-warrant',2);equip(s,'inspector-notebook',2);let p=s.players[0]!;p.energy=0;grant(s,p,'D01');
 assert.equal(inspectionLimit(s,p),4);let v=appraisalViewFor(s,p.id);assert.equal(inspectionCost(v,'price'),0);assert.equal(inspectionCost(v,'authenticity'),2);assert.equal(inspectionQuota(v),4);
 const html=renderToStaticMarkup(createElement(Inspect,{game:v,item:v.self.stock[0]!,submit:()=>{},disabled:false}));assert(html.includes('ตรวจราคา · ฟรี'));
 for(const id of p.stock)s=act(s,{type:'inspect',itemId:id,property:'price'});
 p=s.players[0]!;assert.equal(p.energy,0);assert.equal(p.passiveUses!.price,2);assert.equal(p.statuses.find(s=>s.id==='D01')!.charges,2);
 v=appraisalViewFor(s,p.id);assert.equal(inspectionCost(v,'price'),2);assert.throws(()=>act(s,{type:'inspect',itemId:p.inventory[0]!,property:'price'}));
 s=advanceAppraisalEncounter(end(s));assert.deepEqual(s.players[0]!.passiveUses,{});assert.equal(inspectionCost(appraisalViewFor(s,p.id),'price'),0);
});
test('free authenticity and effects permits stay separate and do not reveal price',()=>{
 let s=fixture();equip(s,'surveyor-lens',2);equip(s,'curse-compass',2);equip(s,'inspector-notebook',2);s.players[0]!.energy=0;
 for(const id of s.players[0]!.stock)for(const property of ['authenticity','effects'] as const)s=act(s,{type:'inspect',itemId:id,property});
 const v=appraisalViewFor(s,'alice');assert.equal(v.self.inspections,4);assert.equal(v.self.energy,0);assert.equal(v.self.passiveUses!.authenticity,2);assert.equal(v.self.passiveUses!.effects,2);assert(v.self.stock.every(i=>!i.range));assert.throws(()=>act(s,{type:'inspect',itemId:v.self.inventory[0]!.id,property:'price'}));
});
test('stacked tax orders, ledgers and rings pay commission and trust once and preserve the ledger',()=>{
 const s=fixture();equip(s,'tax-order',2);equip(s,'merchant-ledger',2);equip(s,'friendship-ring',2);const p=s.players[0]!,item=s.items[p.stock[0]!]!;item.appraisedBy=p.id;
 completeAppraisedSale(s,item,40);assert.equal(p.credits,210);assert.equal(p.npcTrust!.orc,3);assert.equal(s.ledger.filter(e=>e.from==='@item-fund').reduce((n,e)=>n+e.amount,0),6);
 completeAppraisedSale(s,item,40);assert.equal(p.credits,210);assert.equal(p.npcTrust!.orc,3);assertAppraisalInvariants(s);
 assert.equal(commissionRate(heldPassives(Array.from({length:30},()=>({kind:'tax-order' as const})))),100);
});
test('purchase discounts and energy reductions match client quotes and do not self-boost a newly bought tax order',()=>{
 const s=fixture();equip(s,'guild-badge',2);equip(s,'light-satchel',2);const p=s.players[0]!;grant(s,p,'D06');const v=appraisalViewFor(s,p.id);assert.equal(purchasePrice(v,v.self.stock,false),38);assert.equal(purchaseEnergy(v),0);purchase(s,p,p,[...p.stock]);assert.equal(p.credits,162);assert.equal(p.energy,8);assertAppraisalInvariants(s);
 const t=fixture(),q=t.players[0]!,item=t.items[q.stock[0]!]!;item.kind='tax-order';item.appraisedBy=q.id;purchase(t,q,q,[item.id]);assert.equal(q.credits,182,'20-credit tax order itself earns only base 10%');
});
test('gloves increase low-price acceptance without eliminating detection or allowing free goods',()=>{
 const s=fixture(),p=s.players[0]!,item=s.items[p.stock[0]!]!;item.reservation=20;const risk=detectionRisk(p,item,1);equip(s,'negotiator-gloves',40);assert.equal(npcAcceptanceChance(appraisalViewFor(s,p.id),'orc'),95);assert.equal(detectionRisk(p,item,1),risk);
 for(let n=0;n<100;n++){s.seed=`gloves-${n}`;if(randomAt(s.seed,`${s.encounter}:${p.id}:${item.id}:trust-accept:0`)<.95)break;}
 appraise(s,p,item.id,1,false,true);assert(item.lastAccepted);const other=s.items[p.stock[1]!]!;appraise(s,p,other.id,0,false,true);assert.equal(other.lastAccepted,false);
});
test('canteens and brooches stack in paid recovery offers while resource caps still apply',()=>{
 for(const target of ['energy','life'] as const){let s=fixture();const p=s.players[0]!;p.energy=1;p.life=1;p.portals[0]!.npc=target==='energy'?'autometa':'orc';equip(s,target==='energy'?'merchant-canteen':'healing-brooch',2);const offer=recoveryOffer(s,p)!;assert.equal(offer.amount,target==='energy'?5:4);s=act(s,{type:'recover-resource',target});assert.equal(target==='energy'?s.players[0]!.energy:s.players[0]!.life,target==='energy'?6:5);assertAppraisalInvariants(s);}
});
test('noble seals, hats and dice snapshot stackable income, seeded odds and win bonuses; loss forfeits the whole pending stake',()=>{
 let s=fixture();equip(s,'noble-seal',2);equip(s,'gambler-hat',2);equip(s,'lucky-die',2);s.phase='REVEAL';
 for(let n=0;n<1000;n++){s.seed=`lucky-${n}`;if(randomAt(s.seed,'1:alice:round-coin:1')<.5 && randomAt(s.seed,'1:alice:round-coin-luck:1')<.2 && randomAt(s.seed,'1:alice:round-coin-luck:2')>=.2)break;}
 openRoundRewards(s);const r=s.players[0]!.roundReward!;assert.equal(r.amount,14);assert.equal(r.winChance,60);assert.equal(r.winBonus,7);s=act(s,{type:'round-flip',guess:'tails',attempt:1});assert.equal(s.players[0]!.roundReward!.amount,21);
 const winning=s;s=act(s,{type:'round-bank'});assert.equal(s.players[0]!.credits,221);assert.throws(()=>act(s,{type:'round-bank'}));assertAppraisalInvariants(s);
 const wrong=randomAt(winning.seed,'1:alice:round-coin:2')<.5?'tails':'heads';s=act(winning,{type:'round-flip',guess:wrong,attempt:2});assert.equal(s.players[0]!.roundReward!.amount,0);assert.equal(s.players[0]!.credits,200);assertAppraisalInvariants(s);
 assert.equal(coinWinChance(heldPassives(Array.from({length:30},()=>({kind:'gambler-hat' as const})))),85);
 const dead=fixture();equip(dead,'noble-seal',2);dead.players[0]!.life=0;assert.equal(passiveBonuses(dead,dead.players[0]!).income,0);
});
for(const mode of ['match','markdown','sacrifice'] as const)test(`market ${mode}: pass, seal and cloak stacks match the visible quote and reserved bank ledger`,()=>{
 const s=fixture();equip(s,'market-pass',2);equip(s,'authenticity-seal',2);equip(s,'smuggler-cloak',2);const id=equip(s,'food')[0]!,p=s.players[0]!;s.items[id]!.genuine=mode==='match';p.knowledge[id]={genuine:mode==='match'};
 const order={id:'gear-order',kind:'food' as const,price:100,quota:{alice:1,bob:1},contract:{requirements:[{property:'genuine' as const,value:true}],bonus:{kind:'credits' as const,amount:3},fullPriceCost:{kind:'energy' as const,amount:2}}};s.market={encounter:1,open:true,budget:206,orders:[order]};
 const v=appraisalViewFor(s,'alice'),item=v.self.inventory.find(i=>i.id===id)!;const expected=mode==='match'?109:mode==='markdown'?92:102;
 const html=renderToStaticMarkup(createElement(MarketSale,{game:v,item,order,submit:()=>{},disabled:false}));assert(html.includes(`${expected} เครดิต`));const unknown=renderToStaticMarkup(createElement(MarketSale,{game:v,item:{...item,knowledge:{}},order,submit:()=>{},disabled:false}));assert(unknown.includes('ขายราคาเต็ม 109 / ผิดรับ 102 เครดิต'));const energy=p.energy;marketSell(s,p,id,order.id,mode==='sacrifice'?'sacrifice':'discount');assert.equal(p.credits,200+expected);assert.equal(p.energy,energy-(mode==='sacrifice'?2:0));assert.equal(s.market.budget,103);assertAppraisalInvariants(s);
});
test('the passive item being sold does not grant its own market bonus; UI summarizes actual held stacks',()=>{
 const s=fixture(),p=s.players[0]!;equip(s,'tax-order',2);equip(s,'noble-seal',2);const ids=equip(s,'market-pass',2);const order={id:'pass-sale',kind:'market-pass' as const,price:100,quota:{alice:1}};s.market={encounter:1,open:true,budget:100,orders:[order]};marketSell(s,p,ids[0]!,order.id);assert.equal(p.credits,301);assert.equal(passiveBonuses(s,p).market,1);const html=renderToStaticMarkup(createElement(HeldEffects,{game:appraisalViewFor(s,p.id)}));assert(html.includes('ใบสั่งเพิ่มภาษี ×2'));assert(html.includes('20%'));assert(html.includes('เงินหลังซื้อขาย +4'));assertAppraisalInvariants(s);
});
for(const kind of PASSIVE_ITEM_IDS)test(`${kind}: naturally generated, purchased and replayed through a complete seeded game`,()=>{
 let s:AppraisalState|undefined,target='';
 for(let n=0;n<400;n++){let candidate=createAppraisalRun(['alice','bob'],`passive-natural-${kind}-${n}`,{catalogVersion:3,startingCredits:200,maxEnergy:20,marketProbability:0});for(const id of ['alice','bob']){const offer=candidate.players.find(p=>p.id===id)!.eventOffer;if(offer)candidate=act(candidate,{type:'event',key:offer.key,choice:'decline'},id);}const portal=candidate.players[0]!.portals.find(p=>!p.disabled && p.stock.some(id=>candidate.items[id]!.kind===kind));if(!portal)continue;target=portal.stock.find(id=>candidate.items[id]!.kind===kind)!;candidate=act(candidate,{type:'enter',portalId:portal.id});candidate=act(candidate,{type:'enter',portalId:candidate.players[1]!.portals.find(p=>!p.disabled)!.id},'bob');for(const id of ['alice','bob']){const offer=candidate.players.find(p=>p.id===id)!.eventOffer;if(offer)candidate=act(candidate,{type:'event',key:offer.key,choice:'decline'},id);}s=candidate;break;}
 assert(s,`seeded offer for ${kind}`);s=act(s,{type:'buy',itemIds:[target],condition:false});assert(s.players[0]!.inventory.includes(target));assert.equal(passiveBonuses(s,s.players[0]!)[PASSIVE_ITEMS[kind].passive.effect],PASSIVE_ITEMS[kind].passive.amount);
 while(s.phase!=='RESULTS')s=s.phase==='REVEAL'?advanceAppraisalEncounter(s):end(s);assert.deepEqual(replayAppraisalAudit(exportAppraisalAudit(s)),s);assertAppraisalInvariants(s);
});

test('seeded sampling verifies 60% stacked hat odds and the 85% cap for either guess',()=>{
 for(const count of [2,30])for(const guess of ['heads','tails'] as const){const s=fixture();equip(s,'gambler-hat',count);s.phase='REVEAL';openRoundRewards(s);const template=structuredClone(s.players[0]!.roundReward!);let wins=0;for(let n=0;n<3000;n++){s.seed=`hat-odds-${n}`;s.players[0]!.roundReward=structuredClone(template);flipRoundReward(s,s.players[0]!,guess,1);if(s.players[0]!.roundReward!.lastFlip!.correct)wins++;}const actual=wins/3000,expected=count===2?.6:.85;assert(Math.abs(actual-expected)<.04,`${count}/${guess}: ${actual}`);}
});
