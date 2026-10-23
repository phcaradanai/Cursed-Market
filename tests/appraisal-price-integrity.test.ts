import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { appraisalFixture } from './support/appraisal-fixture.js';
import { appraisalViewFor } from '../src/game/appraisal/index.js';
import { FactSeals, WishDeal } from '../src/appraisal-client/components.js';
import { MarketSale } from '../src/appraisal-client/MarketSale.js';
import { getLang, setLang } from '../src/appraisal-client/i18n.js';
import { appraise, grant, marketSell, purchase } from '../src/game/appraisal/mechanics.js';
import { eventEligible, offerEvent, resolveEvent } from '../src/game/appraisal/events.js';
import { auditItemPrice, integrityItemView, liquidateOwnedItem, liquidationQuote, priceAuditChance, reappraiseOwnedItem, recordItemTrade, systemSaleQuote } from '../src/game/appraisal/price-integrity.js';

function fixture(){const s=appraisalFixture();s.config.secureEconomy=true;return s;}

test('audit boundaries use the specific item base and seed deterministically',()=>{
  assert.deepEqual([59,60,79,80,99,100].map(value=>priceAuditChance(40,value)),[0,.25,.25,.5,.5,1]);
  const a=fixture(),b=structuredClone(a);const id='owned-food';
  a.items[id]!.base=b.items[id]!.base=40;
  auditItemPrice(a,a.items[id]!,60,'test');auditItemPrice(b,b.items[id]!,60,'test');
  assert.deepEqual(a.items[id]!.priceIntegrity,b.items[id]!.priceIntegrity);
  auditItemPrice(a,a.items[id]!,100,'test');
  assert.equal(a.items[id]!.priceIntegrity!.overpriced,true);
  assert.equal(a.items[id]!.base,40);
  const before=structuredClone(a);integrityItemView(a,a.items[id]!);systemSaleQuote(a,a.items[id]!,100);
  assert.deepEqual(a,before);
});

test('cash history cannot inflate liquidation and hidden base never appears in integrity view',()=>{
  const s=fixture(),item=s.items['owned-food']!;item.base=40;
  recordItemTrade(s,item,59);
  assert.equal(item.lastTradePrice,59);assert.equal(liquidationQuote(s,item),40);
  assert.deepEqual(Object.keys(integrityItemView(s,item)).sort(),['lastTradePrice','overpriced','reappraisalUsed']);
  recordItemTrade(s,item,20);assert.equal(liquidationQuote(s,item),20);
  recordItemTrade(s,item,100);assert.equal(liquidationQuote(s,item),0);
  assert.equal(systemSaleQuote(s,item,500),0);
});

test('only a successful paid owner reappraisal clears flag, never base or cash history',()=>{
  const s=fixture(),p=s.players[0]!,item=s.items['owned-food']!;item.base=40;
  recordItemTrade(s,item,100);const energy=p.energy;
  assert.throws(()=>reappraiseOwnedItem(s,s.players[1]!,item.id,40),/ไม่ได้เป็นเจ้าของ/);
  reappraiseOwnedItem(s,p,item.id,20);
  assert.equal(p.energy,energy-1);assert.equal(item.priceIntegrity!.overpriced,true);
  assert.throws(()=>reappraiseOwnedItem(s,p,item.id,40),/ใหม่แล้ว/);
  s.encounter++;reappraiseOwnedItem(s,p,item.id,44);
  assert.equal(item.priceIntegrity!.overpriced,false);assert.equal(item.priceIntegrity!.certifiedPrice,44);
  assert.equal(item.lastAppraisal,44);assert.equal(item.lastTradePrice,100);assert.equal(item.base,40);
  assert.equal(liquidationQuote(s,item),40);
});

test('NPC appraisal and completed purchases each commit one audit; barter never creates cash history',()=>{
  const s=fixture(),p=s.players[0]!,id=p.stock[0]!,item=s.items[id]!;
  appraise(s,p,id,50,false,false);assert.equal(item.priceIntegrity!.audits,1);
  purchase(s,p,p,[id]);assert.equal(item.priceIntegrity!.audits,2);assert.equal(item.lastTradePrice,50);
  const next=p.stock[0]!;
  purchase(s,p,p,[next],{barterItemId:'owned-food'});
  assert.equal(s.items[next]!.lastTradePrice,undefined);
});

test('cash liquidation works with Dark Market closed, retires item and respects reserves/locks/stolen goods',()=>{
  const s=fixture(),p=s.players[0]!,item=s.items['owned-food']!;item.base=40;item.lastTradePrice=30;
  s.market.open=false;const credits=p.credits,bank=s.bank;
  liquidateOwnedItem(s,p,item.id);assert.equal(p.credits,credits+30);assert.equal(s.bank,bank-30);
  assert.equal(item.owner,'removed');assert(!p.inventory.includes(item.id));
  assert.equal(s.ledger.at(-1)!.reason,'emergency-liquidation');
  assert.throws(()=>liquidateOwnedItem(s,p,item.id),/ไม่ได้เป็นเจ้าของ/);
  const locked=s.items['owned-key']!;grant(s,p,'D09',locked.id);
  assert.throws(()=>liquidateOwnedItem(s,p,locked.id),/ล็อก/);
  const stolen=s.items['owned-mask']!;stolen.stolen=true;
  assert.throws(()=>liquidateOwnedItem(s,p,stolen.id),/ฉกมา/);
  const other=s.items['owned-orb']!;s.bank=s.market.budget+s.reservedRewards;
  assert.throws(()=>liquidateOwnedItem(s,p,other.id),/งบรางวัล/);assert.equal(other.owner,p.id);
});

test('flag suppresses all Dark Market cash bonuses but safe published premiums survive unflagged history',()=>{
  const s=fixture(),p=s.players[0]!,item=s.items['owned-food']!;s.phase='TRADE';item.base=10;item.lastTradePrice=999;
  const order={id:'safe-order',kind:item.kind,price:25,quota:{alice:1},contract:{requirements:[{property:'genuine' as const,value:true}],bonus:{kind:'credits' as const,amount:3},fullPriceCost:{kind:'energy' as const,amount:1}}};
  s.market={encounter:s.encounter,open:true,budget:100,orders:[order]};
  const before=p.credits;marketSell(s,p,item.id,order.id);assert.equal(p.credits-before,28);
  const flagged=fixture(),q=flagged.players[0]!,bad=flagged.items[item.id]!;flagged.phase='TRADE';
  flagged.market={encounter:flagged.encounter,open:true,budget:100,orders:[structuredClone(order)]};
  flagged.market.orders[0]!.quota.alice=1;bad.priceIntegrity={overpriced:true,audits:1};
  const start=q.credits;marketSell(flagged,q,bad.id,order.id);assert.equal(q.credits,start);
});

test('absent economy flag leaves historical items and trusted system quotes unchanged',()=>{
  const s=appraisalFixture(),item=s.items['owned-food']!;item.priceIntegrity={overpriced:true,audits:1};
  recordItemTrade(s,item,999);assert.equal(item.lastTradePrice,undefined);assert.equal(item.priceIntegrity.audits,1);
  assert.equal(systemSaleQuote(s,item,99),99);assert.deepEqual(integrityItemView(s,item),{});
});

test('collector cashout quotes and pays zero for flagged goods and records the actual sale',()=>{
  const s=fixture(),p=s.players[0]!,item=s.items['owned-food']!;
  s.phase='TRADE';item.priceIntegrity={overpriced:true,audits:1};
  offerEvent(s,p,'E44');const offer=p.eventOffer!;
  assert.equal(offer.quotedPrices[item.id],0);const before=p.credits;
  resolveEvent(s,p,{type:'event',playerId:p.id,requestId:'integrity-collector',encounter:s.encounter,key:offer.key,choice:'accept',itemId:item.id});
  assert.equal(p.credits,before);assert.equal(item.lastTradePrice,0);assert.equal(item.owner,'removed');
});

test('merchant ban cannot be bypassed by direct NPC purchase or collector event',()=>{
  const s=fixture(),p=s.players[0]!;
  Object.assign(p,{crime:{failures:1,banStartsEncounter:s.encounter,banUntilEncounter:s.encounter,cases:[]}});
  assert.throws(()=>purchase(s,p,p,[p.stock[0]!]),/ห้ามค้าขาย/);
  assert.equal(eventEligible(s,p,'E44'),false);
});

test('public item seals disclose overpriced restriction in Thai and English without hidden value',()=>{
  const s=fixture(),item=s.items['owned-food']!;item.priceIntegrity={overpriced:true,audits:1};
  const previous=getLang();
  try {
    for(const lang of ['th','en'] as const){
      setLang(lang);const visible=appraisalViewFor(s,'alice').self.inventory.find(i=>i.id===item.id)!;
      const html=renderToStaticMarkup(createElement(FactSeals,{item:visible}));
      assert.match(html,/data-seal="overpriced"/);assert.match(html,lang==='th'?/จนกว่าจะประเมินใหม่สำเร็จ/:/until successful reappraisal/);
      assert.equal(visible.knowledge.base,undefined);
    }
    const normal=appraisalViewFor(s,'alice').self.inventory.find(i=>!i.overpriced)!;
    assert.doesNotMatch(renderToStaticMarkup(createElement(FactSeals,{item:normal})),/data-seal="overpriced"/);
  }finally{setLang(previous);}
});

test('flagged market sale renders only zero payout and no paid sacrifice or monetary bonus',()=>{
  const s=fixture(),item=s.items['owned-food']!;item.priceIntegrity={overpriced:true,audits:1};
  const game=appraisalViewFor(s,'alice'),visible=game.self.inventory.find(i=>i.id===item.id)!;
  const order={id:'flagged-preview',kind:item.kind,price:72,quota:{alice:1},contract:{requirements:[{property:'genuine' as const,value:true}],bonus:{kind:'credits' as const,amount:9},fullPriceCost:{kind:'energy' as const,amount:3}}};
  const html=renderToStaticMarkup(createElement(MarketSale,{game,item:visible,order,submit:()=>{},disabled:false}));
  assert.equal((html.match(/<button/g)??[]).length,1);assert.match(html,/0 เครดิต/);assert.doesNotMatch(html,/สละ|72|81|เครดิตเพิ่ม/);
  delete visible.overpriced;
  const legacy=renderToStaticMarkup(createElement(MarketSale,{game,item:visible,order:{...order,contract:undefined} as never,submit:()=>{},disabled:false}));
  assert.match(legacy,/72 เครดิต/);
});

test('flagged selected wish item renders zero in current quote, asking options and sale button',()=>{
  const s=fixture(),item=s.items['owned-food']!;item.priceIntegrity={overpriced:true,audits:1};
  const game=appraisalViewFor(s,'alice');game.wishlist=true;
  game.self.wishOffer={npc:'orc',kind:item.kind,price:72,initial:72,floor:40,next:65,age:0,trust:0,buffs:0,debuffs:0,tried:false,itemIds:[item.id],options:[{markup:0,price:72,chance:80},{markup:10,price:79,chance:60}]};
  const html=renderToStaticMarkup(createElement(WishDeal,{game,submit:()=>{},disabled:false}));
  assert.match(html,/จนกว่าจะประเมินใหม่สำเร็จ/);assert.match(html,/ขายให้พ่อค้า · 0 เครดิต/);
  assert.doesNotMatch(html,/72 เครดิต|79 เครดิต/);
});
