import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { defaultRarityEconomy, rarityPowerFor, rarityValue, validateRarityEconomy } from '../src/shared/rarity-power.js';
import type { Rarity } from '../src/shared/item-rarity.js';
import { createAppraisalRun, restoreAppraisalRun, assertAppraisalInvariants } from '../src/game/appraisal/engine.js';
import { ensureItemAppearance, itemPriceRange } from '../src/game/appraisal/rarity.js';
import { activate, grant, inspect, marketSell, reward, salePreview } from '../src/game/appraisal/mechanics.js';
import { wishOffer, wishSell } from '../src/game/appraisal/wishlist.js';
import { randomAt } from '../src/game/random.js';
import { itemEffectScale, statusMagnitude } from '../src/game/appraisal/copy-effects.js';
import { coinWinChance, heldPassives } from '../src/game/appraisal/passives.js';
import { appraisalItemView } from '../src/game/appraisal/views.js';
import { marketOrderReserve } from '../src/game/appraisal/market-contracts.js';
import { auctionLots } from '../src/game/appraisal/brokerage.js';
import { ITEM_SPECS } from '../src/game/appraisal/content.js';
import type { AppraisalState, AppraisalItem, ItemKind } from '../src/game/appraisal/types.js';
import { ItemCard } from '../src/appraisal-client/lore.js';
import { MarketSale } from '../src/appraisal-client/MarketSale.js';
import { appraisalViewFor } from '../src/game/appraisal/views.js';
import { passiveText } from '../src/appraisal-client/catalog-text.js';
import { setLang } from '../src/appraisal-client/i18n.js';
import { simulateAppraisalRun } from '../src/simulation/appraisal.js';
import { replayAppraisalAudit, exportAppraisalAudit } from '../src/game/appraisal/audit.js';

function fixture(kind:ItemKind='orb',rarity:Rarity='uncommon') {
  const s=createAppraisalRun(['alice','bob'],'rarity-economy',{marketProbability:0});
  for(const p of s.players){p.eventOffer=null;p.selectedPortalId=p.portals[0]!.id;p.stock=[...p.portals[0]!.stock];}
  s.phase='APPRAISAL';const p=s.players[0]!,item=s.items[p.stock[0]!]!;
  Object.assign(item,{kind,base:20,ask:20,reservation:10,genuine:true,cursed:false,appearance:{version:1,rarity,theme:'inferno',visualSeed:123}});
  ensureItemAppearance(s,item);return {s,p,item};
}
function equip(s:AppraisalState,kind:ItemKind,rarity:Rarity,id:string):AppraisalItem {
  const p=s.players[0]!,item:AppraisalItem={id,kind,base:20,ask:20,reservation:10,genuine:true,cursed:false,owner:p.id,npcOwnerId:p.id,npc:'orc',encounter:s.encounter,certificate:false,lastAppraisal:null,lastAccepted:null,appearance:{version:1,rarity,theme:'inferno',visualSeed:11}};
  ensureItemAppearance(s,item);s.items[id]=item;p.inventory.push(id);return item;
}
test('20 credits and 2% become 40 and 4%, exactly once, with public multipliers only',()=>{
  const {s,item}=fixture();assert.equal(item.base,40);assert.equal(item.ask,40);assert.equal(item.reservation,20);
  const before=structuredClone(item);ensureItemAppearance(s,item);assert.deepEqual(item,before);
  assert.equal(heldPassives([{kind:'orb'}],true).luck,2);
  assert.equal(heldPassives([item],true).luck,4);
  const dto=appraisalItemView(s,'alice',item.id);assert.equal(dto.knowledge.base,undefined);assert.deepEqual(dto.rarityPower,rarityPowerFor('uncommon',defaultRarityEconomy()));
  dto.rarityPower!.effectMultiplier=8;assert.equal(item.rarityPower!.effectMultiplier,2);
  const common=fixture('orb','common').item;assert.equal(common.base,20);assert.equal(itemEffectScale(common),1);
});
test('configured values are monotonic, bounded and independently adjustable',()=>{
  const c=defaultRarityEconomy();c.tiers.uncommon.effect=3;c.tiers.rare.effect=3;validateRarityEconomy(c);
  const {s,item}=fixture();const config=structuredClone(s.config);config.rarityEconomy=c;
  const next=restoreAppraisalRun(['alice','bob'],'custom-economy',config),target=Object.values(next.items)[0]!;target.appearance=item.appearance!;
  ensureItemAppearance(next,target);assert.equal(target.rarityPower!.effectMultiplier,3);assert.equal(target.rarityPower!.valueMultiplier,2);
  for(const value of [0,-1,Infinity,1.5,9]){const bad=defaultRarityEconomy();bad.tiers.uncommon.value=value;assert.throws(()=>validateRarityEconomy(bad));}
});
test('mixed held tiers choose the five strongest, copies retain 40%, and chance stays capped',()=>{
  const item=fixture().item;
  const copy={...item,copy:{sourceId:item.id,number:1,valuePercent:25}};
  assert.equal(itemEffectScale(copy),.8);assert.equal(heldPassives([copy],true).luck,1.6);
  const mythic={...item,rarityPower:rarityPowerFor('mythic',defaultRarityEconomy())};
  const held=heldPassives([item,item,item,item,item,mythic],true);assert.equal(held.luck,32);
  assert.equal(coinWinChance(held),82);assert.equal(coinWinChance(heldPassives(Array(7).fill(mythic),true)),85);
});
test('numeric status powers above one persist and weaker activation does not replace stronger same-kind bonuses',()=>{
  const {s,p}=fixture('dream-tonic');p.stock=[];
  grant(s,p,'B13',undefined,2);assert.equal(statusMagnitude(p,'B13',20),40);assert.equal(salePreview(s,p,20,true),28);
  grant(s,p,'B13',undefined,1);assert.equal(statusMagnitude(p,'B13',20),40);
  for(const [rarity,id] of [['uncommon','u'],['rare','r'],['common','c']] as const){const item=equip(s,'dream-tonic',rarity,id);activate(s,p,item.id);}
  assert.equal(p.itemUseBonuses!.luck,30);assert.equal(p.itemUseStrength!['dream-tonic'],3);
  grant(s,p,'B13',undefined,3);assert.equal(statusMagnitude(p,'B13',20),60);
  assertAppraisalInvariants(s);
});
test('resource effects scale then floor and clamp to their existing maximum',()=>{
  const {s,p}=fixture();p.stock=[];p.energy=1;
  const orb=equip(s,'orb','uncommon','recovery');activate(s,p,orb.id);
  assert.equal(p.energy,Math.min(s.config.maxEnergy,1-(ITEM_SPECS.orb.consumable?0:1)+2*(ITEM_SPECS.orb.energyRecovery??3)));
});
test('rarity improves benefits while keeping activation costs and curse damage at their existing strength',()=>{
  const s=createAppraisalRun(['alice','bob'],'rarity-curse',{marketProbability:0,survival:{maxLife:6,encounterLifeCost:1,entryEnergyCost:0}});
  s.phase='APPRAISAL';const p=s.players[0]!;p.eventOffer=null;
  const item=equip(s,'orb','mythic','cursed-high-tier');item.cursed=true;
  activate(s,p,item.id);assert.equal(p.life,5);assert.equal(p.statuses.find(status=>status.id===ITEM_SPECS.orb.drawback)?.power,undefined);
});
test('inspection ranges contain rarity-scaled truths and copy/replacement bounds',()=>{
  const {s,p,item}=fixture();const bounds=itemPriceRange(s.config,item);assert.ok(bounds[0]<=40&&bounds[1]>=40);
  inspect(s,p,item.id,'price');assert.ok(p.knowledge[item.id]!.range![0]<=40&&p.knowledge[item.id]!.range![1]>=40);
  item.base=2;assert.ok(itemPriceRange(s.config,item)[0]<=2);
});
test('dark-market reserve, displayed payout and settlement agree on rarity while preserving bank earmarks',()=>{
  const {s,p,item}=fixture();item.owner=p.id;p.inventory.push(item.id);
  const order={id:'order',kind:item.kind,price:20,rarityReserveMultiplier:8,quota:{alice:1,bob:1}};
  s.market={encounter:1,open:true,budget:320,orders:[order]};
  assert.equal(marketOrderReserve(order),160);
  const game=appraisalViewFor(s,p.id);setLang('th');
  const html=renderToStaticMarkup(createElement(MarketSale,{game,item:appraisalItemView(s,p.id,item.id),order,submit:()=>{},disabled:false}));assert.match(html,/40/);
  const credits=p.credits;marketSell(s,p,item.id,order.id);assert.equal(p.credits-credits,40);assert.equal(s.market.budget,160);assertAppraisalInvariants(s);
});
test('a boosted market payout cannot consume another quota reserve or reveal hidden contract facts through insufficient funding',()=>{
  const {s,p,item}=fixture('orb','mythic');item.owner=p.id;p.inventory.push(item.id);
  const order={id:'funding',kind:item.kind,price:20,rarityReserveMultiplier:8,quota:{alice:1,bob:1}};
  s.market={encounter:1,open:true,budget:320,orders:[order]};reward(s,s.players[1]!,s.bank-320,'fixture-distribution');grant(s,p,'B13',undefined,8);
  const before=structuredClone(s);assert.throws(()=>marketSell(s,p,item.id,order.id),/งบรับซื้อ/);assert.deepEqual(s,before);assertAppraisalInvariants(s);
});
test('merchant wish per-item quotes and settlement agree after rarity, copy scaling and percentage rounding',()=>{
  const {s,p,item}=fixture('mirror','rare');s.items['wish-source']={...structuredClone(item),id:'wish-source',owner:'retired'};
  item.copy={sourceId:'wish-source',number:1,valuePercent:50};item.base=Math.floor(item.base*.5);item.ask=Math.floor(item.ask*.5);
  item.owner=p.id;p.inventory.push(item.id);p.portals[0]!.npc='orc';
  p.wishes={orc:{kind:'mirror',price:21,set:1}};p.npcTrust={orc:10};
  s.config.polish=true;grant(s,p,'B13',undefined,2);
  for(let n=0;n<100;n++){s.seed=`wish-rarity-${n}`;if(randomAt(s.seed,`1:${p.id}:${item.id}:wish-deal`)<.5)break;}
  const offer=wishOffer(s,p)!;const quote=offer.itemQuotes![item.id]!.find(o=>o.markup===0)!.price;
  assert.ok(quote>offer.options[0]!.price);const credits=p.credits;wishSell(s,p,item.id,0);assert.equal(p.credits-credits,quote);assertAppraisalInvariants(s);
});
test('rare auction minimums increase and old visual-only descriptors retain old economics',()=>{
  const {s,item}=fixture();s.config.brokerage={auctionProbability:1,maxLots:2,bondProbability:0};s.vault=[item.id];item.owner='dark-market';
  const lots=auctionLots(s);assert.equal(lots.length,1);assert.ok(lots[0]!.minimum>0);
  const config=structuredClone(s.config);delete config.rarityEconomy;
  const old=restoreAppraisalRun(['alice','bob'],'old-visual-only',config),original=Object.values(old.items)[0]!,before=original.base;
  ensureItemAppearance(old,original);assert.equal(original.base,before);assert.equal(original.rarityPower,undefined);assert.equal(itemEffectScale(original),1);
});
test('item descriptions show 4% without scaling caps or stack limits in Thai and English',()=>{
  const {s,item}=fixture(),dto=appraisalItemView(s,'alice',item.id);
  setLang('th');assert.match(passiveText('orb',true,dto),/\+4 จุดเปอร์เซ็นต์/);assert.match(passiveText('orb',true,dto),/85%/);assert.match(passiveText('orb',true,dto),/5 ชิ้น/);
  const html=renderToStaticMarkup(createElement(ItemCard,{kind:'orb',item:dto}));assert.match(html,/\+4 จุดเปอร์เซ็นต์/);
  setLang('en');assert.match(passiveText('orb',true,dto),/\+4 percentage/);setLang('th');
});
test('rarity value and effect config replay exactly; catalog references scale but actual values do not double',()=>{
  const audit=simulateAppraisalRun(2,'cautious','powered-rarity-audit',{encounters:1,marketProbability:0});
  assert.ok(Object.values(audit.items).some(i=>i.rarityPower));assert.deepEqual(exportAppraisalAudit(replayAppraisalAudit(audit)),audit);
  assert.equal(rarityValue(fixture().item,20),40);
});
