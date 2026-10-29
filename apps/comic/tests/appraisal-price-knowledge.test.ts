import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { applyAppraisalAction, appraisalViewFor } from '../src/game/appraisal/index.js';
import { appraisalItemView } from '../src/game/appraisal/views.js';
import { grant } from '../src/game/appraisal/mechanics.js';
import { AppraisalDesk, ItemFacts } from '../src/appraisal-client/components.js';
import { ItemCard } from '../src/appraisal-client/lore.js';
import { riskRange } from '../src/appraisal-client/model.js';
import { appraisalFixture } from './support/appraisal-fixture.js';

const renderFacts=(state:ReturnType<typeof appraisalFixture>,id:string)=>renderToStaticMarkup(createElement(ItemFacts,{item:appraisalItemView(state,'alice',id)}));
function fixture() {
  const s=appraisalFixture();for(const p of s.players)p.offerSlots=2;
  return s;
}
test('uninspected prices have no DTO range, fact clue, kind-card fallback, midpoint default or numerical risk',()=>{
  const state=fixture();const id=state.players[0]!.stock[0]!;state.items[id]!.ask=37;
  const game=appraisalViewFor(state,'alice');const item=game.self.stock[0]!;
  assert.equal(item.range,undefined);assert.equal(item.knowledge.range,undefined);assert.equal(item.knowledge.base,undefined);
  assert(!JSON.stringify(item).includes('"range"'));
  const facts=renderFacts(state,id);assert(facts.includes('ใช้ตรวจราคาเพื่อหาเบาะแส'));assert(!/\d+–\d+/.test(facts));
  for(const props of [{kind:item.kind},{kind:item.kind,item},{kind:item.kind,item:{...item,range:[18,24] as [number,number]}}]) {
    const html=renderToStaticMarkup(createElement(ItemCard,props));assert(html.includes('ต้องตรวจราคาสินค้าชิ้นนี้'));assert(!/\d+–\d+/.test(html));
  }
  assert.equal(riskRange(game,item,10),null);assert.equal(riskRange(game,{...item,range:[18,24]},10),null,'old server fallback must not count as inspected knowledge');
  const html=renderToStaticMarkup(createElement(AppraisalDesk,{game,item,submit:()=>{},disabled:false}));
  assert(html.includes('value="37"'));assert(html.includes('ยังคำนวณโอกาสถูกจับผิดไม่ได้'));assert(!html.includes('จากข้อมูลที่คุณรู้'));
});
test('price inspection unlocks only this item for this seat; other inspections and another item stay hidden',()=>{
  const initial=fixture();const p=initial.players[0]!;const id=p.stock[0]!;
  initial.listings.push({ownerId:p.id,itemId:id,purchase:true});
  for(const property of ['authenticity','effects'] as const) {
    const state=applyAppraisalAction(initial,{type:'inspect',property,itemId:id,playerId:p.id,requestId:`check-${property}`,encounter:1});
    assert.equal(appraisalItemView(state,p.id,id).range,undefined);assert(!/\d+–\d+/.test(renderFacts(state,id)));
  }
  const state=applyAppraisalAction(initial,{type:'inspect',property:'price',itemId:id,playerId:p.id,requestId:'check-price',encounter:1});
  const game=appraisalViewFor(state,p.id);const item=game.self.stock[0]!;const range=item.knowledge.range!;
  assert(range[0]<=20 && range[1]>=20);assert.deepEqual(item.range,range);assert.equal(item.knowledge.base,undefined);
  assert(renderFacts(state,id).includes(`เบาะแส ${range[0]}–${range[1]}`));assert(riskRange(game,item,10));
  assert.equal(game.self.stock[1]!.range,undefined);assert.equal(game.self.stock[1]!.knowledge.range,undefined);
  const other=appraisalViewFor(state,'bob').listings.find(l=>l.itemId===id)!.item;
  assert.equal(other.range,undefined);assert.equal(other.knowledge.range,undefined);
  assert(renderToStaticMarkup(createElement(ItemCard,{kind:item.kind,item})).includes(`เบาะแสมูลค่า ${range[0]}–${range[1]}`));
});
test('exact price revealed by price inspection still renders correctly and known public results remain available',()=>{
  let state=fixture();const p=state.players[0]!;const id=p.stock[0]!;grant(state,p,'B01');
  state=applyAppraisalAction(state,{type:'inspect',property:'price',itemId:id,playerId:p.id,requestId:'exact-price',encounter:1});
  const item=appraisalItemView(state,p.id,id);assert.equal(item.knowledge.base,20);assert.deepEqual(item.range,[20,20]);assert(renderFacts(state,id).includes('20 เครดิต'));
  assert(renderToStaticMarkup(createElement(ItemCard,{kind:item.kind,item})).includes('มูลค่าจริง 20 เครดิต'));
  state.publicKnowledge[id]={range:[18,24]};assert.deepEqual(appraisalItemView(state,'bob',id).range,[18,24]);
});
