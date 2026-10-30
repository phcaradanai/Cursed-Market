import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { appraisalViewFor } from '../src/game/appraisal/index.js';
import type { AppraisalState } from '../src/game/appraisal/types.js';
import type { AppraisalRoomView } from '../src/shared/appraisal-protocol.js';
import { Inventory, TradeListing, Trades } from '../src/appraisal-client/components.js';
import { setLang } from '../src/appraisal-client/i18n.js';
import { appraisalFixture } from './support/appraisal-fixture.js';

const text=(html:string)=>html.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
function room(state:AppraisalState,viewer='alice'):AppraisalRoomView {
  return {rulesVersion:'0.5',mode:'classic',code:'ABC234',hostId:'alice',yourSeatId:viewer,seats:state.players.map(p=>({id:p.id,name:p.id,connected:true,ready:true})),matchSeats:state.players.map(p=>({id:p.id,name:p.id})),playtestMode:'no-voice',matchId:'trade-prices',deadline:null,serverTime:1000,revealReady:[],game:appraisalViewFor(state,viewer)};
}
function listing(state:AppraisalState) {
  const r=room(state),game=r.game!;return renderToStaticMarkup(createElement(TradeListing,{game,listing:game.listings[0]!,room:r,submit:()=>{},disabled:false}));
}

test('trade listings show the last appraisal and current NPC price, including a rejected appraisal',()=>{
  const s=appraisalFixture('E47'),seller=s.players[1]!,id=seller.stock[0]!;
  s.items[id]!.lastAppraisal=9;s.items[id]!.lastAccepted=false;seller.valuations[id]={value:9,accepted:false,caught:false,accuracy:false};
  const rendered=text(listing(s));assert(rendered.includes('ราคาประเมินล่าสุด 9 เครดิต'));assert(rendered.includes('ราคาขายของพ่อค้า 20 เครดิต'));assert(rendered.includes('พ่อค้าไม่รับราคาประเมิน ใช้ราคาหน้าร้าน'));
});
test('zero appraisals remain visible, unappraised goods stay unknown and private inspections stay private',()=>{
  const s=appraisalFixture('E47'),seller=s.players[1]!,id=seller.stock[0]!;s.items[id]!.base=847;seller.knowledge[id]={base:847,genuine:true,cursed:true};
  s.items[id]!.lastAppraisal=0;s.items[id]!.lastAccepted=true;seller.valuations[id]!.value=0;
  let rendered=text(listing(s));assert(rendered.includes('ราคาประเมินล่าสุด 0 เครดิต'));assert(!rendered.includes('847'));assert(rendered.includes('ความแท้ ยังไม่ตรวจ'));assert(rendered.includes('คำสาป ยังไม่ทราบ'));
  s.items[id]!.lastAppraisal=null;rendered=text(listing(s));assert(!rendered.includes('ราคาประเมินล่าสุด'));assert(!rendered.includes('847'));
});
test('both trading seats compare appraisals; selected owned detail keeps known appraisal across phases',()=>{
  const s=appraisalFixture('E47'),seller=s.players[1]!,id=seller.stock[0]!,swap='owned-mirror';
  s.items[id]!.owner=seller.id;seller.inventory.push(id);seller.stock=seller.stock.filter(itemId=>itemId!==id);s.items[id]!.lastAppraisal=21;s.items[swap]!.lastAppraisal=8;
  s.trades.push({id:'price-offer',buyerId:'alice',sellerId:'bob',itemId:id,swapItemId:swap,credits:5,source:'inventory',encounter:1,status:'open',condition:false});
  for(const viewer of ['alice','bob']){const r=room(s,viewer),rendered=text(renderToStaticMarkup(createElement(Trades,{game:r.game!,room:r,submit:()=>{},disabled:false})));assert(rendered.includes('ราคาประเมินล่าสุด 21 เครดิต'));assert(rendered.includes('ราคาประเมินล่าสุด 8 เครดิต'));assert(!rendered.includes('ราคาขายของพ่อค้า'));}
  s.players[0]!.inventory=[swap,...s.players[0]!.inventory.filter(itemId=>itemId!==swap)];s.items[swap]!.base=847;
  const renderInventory=()=>{const markup=renderToStaticMarkup(createElement(Inventory,{game:appraisalViewFor(s,'alice'),submit:()=>{},disabled:false}));const facts=markup.match(/<dl class="inventory-known-facts">([\s\S]*?)<\/dl>/)?.[1];assert(facts,'selected item detail exists');return text(facts);};
  for(const phase of ['TRADE','APPRAISAL'] as const){s.phase=phase;assert(renderInventory().includes('ราคาประเมิน 8'),`${phase}: known appraisal stays visible`);}
  s.items[swap]!.lastAppraisal=null;assert(renderInventory().includes('ยังไม่ประเมิน'));assert(!renderInventory().includes('847'),'hidden base must not replace an unknown appraisal');
});
test('trade appraisal labels follow the English language setting',()=>{
  const s=appraisalFixture('E47');setLang('en');
  try{const rendered=text(listing(s));assert(rendered.includes('Last appraisal 12 credits'));assert(rendered.includes('Merchant asking price 12 credits'));assert(!/[฀-๿]/.test(rendered));}finally{setLang('th');}
});
