import test from 'node:test';import assert from 'node:assert/strict';import {createElement} from 'react';import {renderToStaticMarkup} from 'react-dom/server';
import {createAppraisalRun,appraisalViewFor} from '../src/game/appraisal/index.js';
import {PILOT_ITEM_IDS} from '../src/game/appraisal/types.js';
import type {ItemKind} from '../src/game/appraisal/types.js';
import {ITEM_SPECS,merchantKinds} from '../src/game/appraisal/content.js';
import {inspect,appraise,purchase} from '../src/game/appraisal/mechanics.js';
import {handleStorageAction,handleLoanAction} from '../src/game/appraisal/secure-storage.js';
import {useMerchantAbility} from '../src/game/appraisal/merchant-abilities.js';
import {auctionLots,placeBid,settleAuction} from '../src/game/appraisal/brokerage.js';
import {collectRun} from '../src/game/appraisal/survival.js';
import {Inventory} from '../src/appraisal-client/components.js';
import {inspectionCost} from '../src/appraisal-client/model.js';
import {setLang} from '../src/appraisal-client/i18n.js';
for(const version of [4,5] as const)for(const kind of version===4?PILOT_ITEM_IDS:(Object.keys(ITEM_SPECS) as ItemKind[]).filter(k=>ITEM_SPECS[k].nativeEffect))test(`catalog${version}/${kind}: actual stock, knowledge, purchase, copy, vault, collateral, auction and Collector keep native identity`,()=>{
 const create=(seed:number)=>createAppraisalRun(['alice','bob'],`pilot-lifecycle-${seed}`,{catalogVersion:version,secureEconomy:true,survival:{maxLife:6,encounterLifeCost:1,entryEnergyCost:0},brokerage:{auctionProbability:1,maxLots:2,bondProbability:0}});let s=create(0);for(let seed=1;seed<(version===4?40:128)&&!Object.values(s.items).some(i=>i.kind===kind&&i.npcOwnerId==='alice');seed++)s=create(seed);const a=s.players[0]!,b=s.players[1]!;s.phase='APPRAISAL';a.eventOffer=null;a.energy=100;a.credits=1000;b.credits=1000;
 const npc=ITEM_SPECS[kind].merchant!;if(version===4)assert.deepEqual(merchantKinds(npc,4),[kind]);else assert(merchantKinds(npc,5).includes(kind));
 // Use the generated stock instance of this exact merchant, including its hidden truths.
 const item=Object.values(s.items).find(i=>i.kind===kind&&i.npcOwnerId===a.id);assert(item,'seeded schedule contains this merchant');s.encounter=item.encounter;a.stock=[item.id];a.selectedPortalId=a.portals.find(portal=>portal.stock.includes(item.id))!.id;
 inspect(s,a,item.id,'authenticity');assert.equal(appraisalViewFor(s,a.id).self.stock[0]!.knowledge.genuine,item.genuine);assert.equal(appraisalViewFor(s,b.id).self.inventory.length,0);
 appraise(s,a,item.id,item.base,false,true);purchase(s,a,a,[item.id]);assert.equal(item.owner,a.id);assert(a.paid?.[item.id]!==undefined);assert.equal(item.kind,kind);
 s.phase='TRADE';a.npcTrust!.swarm=6;useMerchantAbility(s,a,{type:'merchant-ability',npc:'swarm',itemId:item.id,playerId:a.id,requestId:'copy',encounter:s.encounter});const copy=Object.values(s.items).find(i=>i.copy?.sourceId===item.id)!;assert(copy);assert.equal(copy.kind,kind);assert.equal(copy.owner,a.id);
 s.phase='REVEAL';a.roundReward={encounter:s.encounter,base:10,amount:10,flips:0,settled:true};handleStorageAction(s,a,{type:'vault-deposit-item',itemId:item.id});assert.equal(item.owner,`personal-vault:${a.id}`);handleStorageAction(s,a,{type:'vault-withdraw-item',itemId:item.id});assert.equal(item.owner,a.id);
 s.phase='TRADE';item.lastTradePrice=20;handleLoanAction(s,a,{type:'loan-propose',lenderId:b.id,itemId:item.id,principal:10});const loan=s.loans!.at(-1)!;handleLoanAction(s,b,{type:'loan-respond',loanId:loan.id,accept:true});assert.equal(item.owner,`collateral:${loan.id}`);handleLoanAction(s,a,{type:'loan-repay',loanId:loan.id,amount:10});assert.equal(item.owner,a.id);
 a.inventory=a.inventory.filter(id=>id!==item.id);item.owner='vault';s.vault=[item.id];s.market.lots=auctionLots(s);const lot=s.market.lots.find(l=>l.itemId===item.id)!;assert(lot);placeBid(s,b,lot.id,lot.minimum);settleAuction(s);assert.equal(item.owner,b.id);assert.equal(appraisalViewFor(s,b.id).self.inventory.find(i=>i.id===item.id)!.image,`/art/comic/items/merchant-set-v1/${kind}.png`);
 s.encounter=s.config.collectorDeadline!;collectRun(s);assert.equal(s.phase,'RESULTS');assert(s.collector!.find(p=>p.playerId===b.id)!.items.some(i=>i.id===item.id&&i.kind===kind));
});
test('native inventory uses established controls, no separate activation for held tools, exact inspection quote',()=>{
 setLang('th');const s=createAppraisalRun(['alice','bob'],'pilot-client',{catalogVersion:4});const p=s.players[0]!;p.eventOffer=null;s.phase='APPRAISAL';const item=Object.values(s.items).find(i=>i.kind==='autometa-torque-caliper'&&i.npcOwnerId===p.id)!;item.owner=p.id;p.inventory=[item.id];p.stock=[];const view=appraisalViewFor(s,p.id);const html=renderToStaticMarkup(createElement(Inventory,{game:view,submit:()=>{},disabled:false,drawer:true}));assert(html.includes('คาลิเปอร์วัดแรงบิด'));assert(!html.includes('class="primary inventory-activate"'));assert.equal(inspectionCost(view,'price'),0);assert.equal(inspectionCost(view,'authenticity'),1);assert(!html.includes('รับ B'));
});
