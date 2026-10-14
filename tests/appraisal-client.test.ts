import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { applyAppraisalAction, appraisalViewFor } from '../src/game/appraisal/index.js';
import { offerEvent } from '../src/game/appraisal/events.js';
import { detectionRisk, grant } from '../src/game/appraisal/mechanics.js';
import { EVENT_IDS } from '../src/game/appraisal/types.js';
import type { AppraisalState } from '../src/game/appraisal/types.js';
import type { AppraisalRoomView } from '../src/shared/appraisal-protocol.js';
import { App, GameTable, monogram } from '../src/appraisal-client/App.js';
import { supportedRulesVersion } from '../src/appraisal-client/connection.js';
import { AppraisalDesk, DarkMarket, EventDecision, Inventory, TradeListing, Trades } from '../src/appraisal-client/components.js';
import { defaultConsequence, eventCost, eventDecision, eventFacts, eventStatusOptions, inspectionCost, marketOptions, purchaseEnergy, purchasePrice, readable, riskRange, stepPrice } from '../src/appraisal-client/model.js';
import { appraisalFixture } from './support/appraisal-fixture.js';

function roomView(state:AppraisalState):AppraisalRoomView {
  return {rulesVersion:'0.4',code:'ABC234',hostId:'alice',yourSeatId:'alice',seats:state.players.map(p=>({id:p.id,name:p.id==='alice'?'ผู้ประเมินหนึ่ง':'ผู้ประเมินสอง',connected:true,ready:true})),matchSeats:state.players.map(p=>({id:p.id,name:p.id})),playtestMode:'no-voice',matchId:'match-ui',deadline:10000,serverTime:1000,revealReady:[],game:appraisalViewFor(state,'alice')};
}
for(const id of EVENT_IDS) test(`v0.4 UI ${id}: every offered choice builds an engine-accepted decision`,()=>{
  const initial=appraisalFixture(id);offerEvent(initial,initial.players[0]!,id);
  for(const choice of initial.players[0]!.eventOffer!.choices) {
    const state=structuredClone(initial);const game=appraisalViewFor(state,'alice');const offer=game.self.eventOffer!;
    const itemId=offer.itemIds[0]??'';const statuses=eventStatusOptions(offer,choice);const facts=eventFacts(offer,itemId);
    const decision=eventDecision(offer,choice,{itemId,statusId:statuses[0]??'',fact:facts[0]??'',guess:true});
    assert(decision,`${id}/${choice} must be selectable from the seat view`);
    const updated=applyAppraisalAction(state,{...decision,playerId:'alice',requestId:`ui-${id}-${choice}`,encounter:state.encounter});
    assert.notEqual(updated,state);assert.equal(updated.players[0]!.eventOffer,null);
    assert(eventCost(game,offer,choice,itemId).length>0);
  }
  const game=appraisalViewFor(initial,'alice');const offer=game.self.eventOffer!;
  const html=renderToStaticMarkup(createElement(EventDecision,{game,offer,submit:()=>{},disabled:false}));
  assert(html.includes('<label'));assert(html.includes('ยืนยัน:'));assert(!html.includes('undefined'));
});
test('visible-data risk bounds enclose every possible hidden base, including honor/status jumps',()=>{
  for(const npc of ['orc','vampire','autometa','alien','darkone','beast'] as const) {
    const state=appraisalFixture();const p=state.players[0]!;const target=state.items[p.stock[0]!]!;target.npc=npc;p.honorJob=true;grant(state,p,'D03');grant(state,p,'B04');
    const game=appraisalViewFor(state,p.id);const item=game.self.stock[0]!;
    for(const value of [0,10,17,20,24,30,1000]) {
      const [low,high]=riskRange(game,item,value);
      for(let base=item.range[0];base<=item.range[1];base++) {const exact=detectionRisk(p,target,value,base)*100;assert(exact>=low && exact<=high,`${npc}/${value}/${base}: ${low}..${high} vs ${exact}`);}
    }
  }
  const state=appraisalFixture();state.players[0]!.knowledge[state.players[0]!.stock[0]!]={base:20};
  const game=appraisalViewFor(state,'alice');assert.deepEqual(riskRange(game,game.self.stock[0]!,10),[20,20]);
});
test('purchase preview uses accepted quote and buyer discounts, once for a bundle',()=>{
  const state=appraisalFixture();const p=state.players[0]!;grant(state,p,'B03');grant(state,p,'D06');
  for(const id of p.stock) {const i=state.items[id]!;i.lastAppraisal=10;i.lastAccepted=false;}
  let game=appraisalViewFor(state,p.id);
  assert.equal(purchasePrice(game,game.self.stock,false),42);assert.equal(purchasePrice(game,game.self.stock,true),40);assert.equal(purchaseEnergy(game),2);
  state.items[p.stock[0]!]!.lastAccepted=true;p.valuations[p.stock[0]!]={value:10,accuracy:false,caught:false,accepted:true};game=appraisalViewFor(state,p.id);assert.equal(purchasePrice(game,[game.self.stock[0]!],false),8);
  const html=renderToStaticMarkup(createElement(AppraisalDesk,{game,item:game.self.stock[1]!,submit:()=>{},disabled:false}));
  assert(html.includes('NPC ปฏิเสธ'));assert(html.includes('ราคาที่พ่อค้ายอมขาย 24 เครดิต'));assert(html.includes('ใช้ราคาหน้าร้าน 24 เครดิต'));
});
test('inspection and market availability respect status charges, locks, quota and budget',()=>{
  const state=appraisalFixture();const p=state.players[0]!;grant(state,p,'B05');grant(state,p,'D01');
  state.market={encounter:1,open:true,budget:40,orders:[{id:'q',kind:'food',price:10,quota:{alice:1,bob:1}}]};
  let game=appraisalViewFor(state,p.id);assert.equal(inspectionCost(game),1);const food=game.self.inventory.find(i=>i.kind==='food')!;assert.equal(marketOptions(game,food).length,1);
  grant(state,p,'D09',food.id);game=appraisalViewFor(state,p.id);assert.equal(marketOptions(game,game.self.inventory.find(i=>i.id===food.id)!).length,0);
  state.market.orders[0]!.quota.alice=0;game=appraisalViewFor(state,p.id);assert.equal(marketOptions(game,food).length,0);
  state.market.orders[0]!.quota.alice=1;state.market.budget=0;game=appraisalViewFor(state,p.id);assert.equal(marketOptions(game,food).length,0);
});
test('unknown authenticity and curse remain unknown in the desk; Dark One requires separate consent',()=>{
  const state=appraisalFixture();const p=state.players[0]!;state.items[p.stock[0]!]!.npc='darkone';const game=appraisalViewFor(state,p.id);
  const html=renderToStaticMarkup(createElement(AppraisalDesk,{game,item:game.self.stock[0]!,submit:()=>{},disabled:false}));
  assert(html.includes('ยังไม่ตรวจ'));assert(html.includes('ยังไม่ทราบ'));assert(html.includes('ยอมรับสัญญา Dark One'));assert(!html.includes('checked=""'));
  assert(!html.includes('reservation'));assert(!html.includes('fixture'));
});
test('full phase surfaces render with live DTO data and no missing text',()=>{
  for(const phase of ['PORTALS','APPRAISAL','TRADE','REVEAL','RESULTS'] as const) {
    const state=appraisalFixture();state.phase=phase;const room=roomView(state);
    const html=renderToStaticMarkup(createElement(GameTable,{room,submit:()=>{},send:()=>true,disabled:false}));
    const table=['PORTALS','APPRAISAL','TRADE'].includes(phase);
    assert.equal(html.includes('id="market-title"'),table,`${phase}: market only beside live decisions`);assert.equal(html.includes('ของที่คุณเก็บไว้'),table,phase);
    assert(html.includes('เครดิต'));assert(!html.includes('undefined'));
    assert(!html.includes('schedule'));assert(!html.includes('reservation'));assert(!html.includes('fixture'));
  }
  const html=renderToStaticMarkup(createElement(App));assert(html.includes('สร้างห้องใหม่'));assert(html.includes('ชื่อที่ใช้ในเกม'));
});
test('cross-shop form presents actual NPC price plus fee; player trade offers allow zero',()=>{
  const state=appraisalFixture('E47');const room=roomView(state);const game=room.game!;const listing=game.listings[0]!;
  const html=renderToStaticMarkup(createElement(TradeListing,{game,listing,room,submit:()=>{},disabled:false}));
  assert(html.includes('ค่าแนะนำที่จะให้นักประเมิน'));assert(html.includes(`${listing.item.price} ให้ NPC + 0 ค่าแนะนำ`));assert(html.includes('min="0"'));
});
test('confirmed consequences expose timeout defaults and decline cannot forge targets',()=>{
  for(const id of ['E48','E49','E50'] as const) {const state=appraisalFixture(id);offerEvent(state,state.players[0]!,id);assert(defaultConsequence(state.players[0]!.eventOffer));}
  const state=appraisalFixture('E45');offerEvent(state,state.players[0]!,'E45');const offer=state.players[0]!.eventOffer!;
  assert.equal(eventDecision(offer,'accept',{itemId:'not-a-target',statusId:'',fact:'base',guess:false}),null);
  assert.equal(eventDecision(offer,'accept',{itemId:offer.itemIds[0]!,statusId:'',fact:'cursed',guess:false}),null);
});
test('six NPC and ten item assets ship independently with embedded prompt provenance',()=>{
  const manifest=JSON.parse(readFileSync('docs/art/appraisal-v0.4/generation-prompts.json','utf8')) as {assets:{id:string;destination:string;prompt:string;sourcePath:string;status:string;sha256:string}[]};
  assert.equal(manifest.assets.length,16);assert.equal(manifest.assets.filter(a=>a.id.startsWith('npc-')).length,6);
  for(const asset of manifest.assets) {assert.equal(asset.status,'generated');const bytes=readFileSync(asset.destination);assert.equal(createHash('sha256').update(bytes).digest('hex'),asset.sha256);assert(existsSync(asset.sourcePath));assert(bytes.includes(Buffer.from('impeccable')),asset.id);assert(asset.prompt.length>100);}
  const css=readFileSync('src/appraisal-client/styles.css','utf8');assert(css.includes('prefers-reduced-motion'));assert(css.includes('min-height:44px'));assert(css.includes('font-display:swap'));
});
test('seller sees an incoming unlisted swap identity without the buyer private truth',()=>{
  let state=appraisalFixture('E43');const buyer=state.players[0]!,seller=state.players[1]!;
  buyer.inventory=buyer.inventory.filter(id=>id!=='owned-key');seller.inventory.push('owned-key');state.items['owned-key']!.owner=seller.id;
  state.listings=[{ownerId:seller.id,itemId:'owned-key',purchase:true}];
  buyer.knowledge['owned-food']={base:8,genuine:true,cursed:false};
  state=applyAppraisalAction(state,{type:'propose',playerId:buyer.id,requestId:'unlisted-swap',encounter:1,sellerId:seller.id,itemId:'owned-key',swapItemId:'owned-food',credits:0});
  const game=appraisalViewFor(state,seller.id);const offer=game.trades[0]!;
  assert.equal(offer.swapItem!.kind,'food');assert.equal(offer.swapItem!.name,'อาหารสัตว์นำทาง');assert.equal(offer.swapItem!.knowledge.genuine,undefined);assert.equal(offer.swapItem!.knowledge.cursed,undefined);assert.equal(offer.swapItem!.knowledge.base,undefined);
  const room={...roomView(state),yourSeatId:seller.id,game};
  const html=renderToStaticMarkup(createElement(Trades,{game,room,submit:()=>{},disabled:false}));assert(html.includes('ของแลกจาก alice: อาหารสัตว์นำทาง'));assert(html.includes('ยังไม่ตรวจ'));assert(html.includes('ตกลงและโอนทันที'));
  assert.equal(appraisalViewFor(state,buyer.id).trades[0]!.swapItem!.knowledge.base,8);
});
test('E08 identifies both fixed portals and exact mandatory discount/status before commitment',()=>{
  const state=appraisalFixture('E08');state.players[0]!.portals[0]!.npc='orc';state.players[0]!.portals[1]!.npc='autometa';offerEvent(state,state.players[0]!,'E08');
  const game=appraisalViewFor(state,'alice');const html=renderToStaticMarkup(createElement(EventDecision,{game,offer:game.self.eventOffer!,submit:()=>{},disabled:false}));
  for(const phrase of ['เลือกเครดิต','ออร์กผู้รักษาเกียรติ','เลือกเงื่อนไข','Autometa','ลด 3 เครดิตต่อการซื้อ','อุปกรณ์หนัก','การซื้อจาก NPC สองครั้งถัดไป','หมดเมื่อจบช่วงหน้า'])assert(html.includes(phrase),phrase);
});
test('same-kind Dark Market items use inventory identifiers and separate known facts',()=>{
  const state=appraisalFixture();const p=state.players[0]!;state.items['second-food']={...state.items['owned-food']!,id:'second-food'};p.inventory.push('second-food');p.knowledge['owned-food']={genuine:true,cursed:false};p.knowledge['second-food']={genuine:false,cursed:true};
  state.market={encounter:1,open:true,budget:40,orders:[{id:'q-food',kind:'food',price:12,quota:{alice:1,bob:1}}]};const game=appraisalViewFor(state,'alice');
  const market=renderToStaticMarkup(createElement(DarkMarket,{game,submit:()=>{},disabled:false}));const inventory=renderToStaticMarkup(createElement(Inventory,{game,submit:()=>{},disabled:false}));
  for(const id of ['owned-food','second-food']){const text=`คลัง #${p.inventory.indexOf(id)+1}`;assert(market.includes(text));assert(inventory.includes(text));}
  for(const text of ['ของแท้','ของปลอม','มีคำสาป','ไม่มีคำสาป'])assert(market.includes(text));assert(!market.includes('ขายชิ้น 1'));
});
test('browser client accepts survival rooms and labels seats legibly',()=>{
  for(const version of ['0.4','0.5'] as const)assert(supportedRulesVersion(version),version);
  assert(!supportedRulesVersion('0.3'));
  assert.equal(monogram('kael'),'K');assert.equal(monogram('เอกชัย'),'เอ');assert.equal(monogram('สมชาย'),'ส');assert.equal(monogram('  '),'?');
});
test('price stepper clamps to whole credits 0–1000 and Thai copy hides engine English',()=>{
  const cases:[string,number,string][]=[['17',1,'18'],['17',-1,'16'],['0',-1,'0'],['1000',1,'1000'],['1500',-1,'1000'],['1500',1,'1000'],['-5',1,'0'],['12.5',-1,'12'],['',1,'1'],['',-1,'0']];
  for(const [value,delta,expected] of cases)assert.equal(stepPrice(value,delta),expected,`${value}${delta>0?'+':'-'}`);
  assert.equal(readable('เพิ่มโอกาส 10 percentage points'),'เพิ่มโอกาส 10 จุดเปอร์เซ็นต์');
  assert.equal(readable('ไม่รับทั้งสองอย่างจาก event เดียว'),'ไม่รับทั้งสองอย่างจาก เหตุการณ์ เดียว');
  assert.equal(readable('ยอมรับก่อน resolve เหตุ'),'ยอมรับก่อนเกิดเหตุ');assert.equal(readable('events'),'events');
});

test('game UI uses choice cards instead of dropdowns and highlights status/item names with peek cards',()=>{
  const state=appraisalFixture('E41');offerEvent(state,state.players[0]!,'E41');const room=roomView(state);const game=room.game!;
  const event=renderToStaticMarkup(createElement(EventDecision,{game,offer:game.self.eventOffer!,submit:()=>{},disabled:false}));
  assert(!event.includes('<select'));assert(event.includes('type="radio"'));assert(event.includes('choice-card'));
  const table=renderToStaticMarkup(createElement(GameTable,{room,submit:()=>{},send:()=>true,disabled:false}));
  assert(!table.includes('<select'));assert(table.includes('class="term debuff"'));assert(table.includes('role="tooltip"'));
  const desk=renderToStaticMarkup(createElement(AppraisalDesk,{game,item:game.self.stock[0]!,submit:()=>{},disabled:false}));
  assert(desk.includes('class="term buff"') || desk.includes('class="term debuff"'),'item effects name their status');
});
test('result cards: a correct E46 guess says so, and phase changes announce what to do next',async()=>{
  const {outcomeBetween,appendedNotes}=await import('../src/appraisal-client/model.js');
  let state=appraisalFixture('E46');offerEvent(state,state.players[0]!,'E46');
  const before=appraisalViewFor(state,'alice');const itemId=state.players[0]!.eventOffer!.itemIds[0]!;const genuine=state.items[itemId]!.genuine;
  state=applyAppraisalAction(state,{type:'event',key:state.players[0]!.eventOffer!.key,choice:'accept',itemId,guess:genuine,playerId:'alice',requestId:'guess',encounter:1});
  const outcome=outcomeBetween(before,appraisalViewFor(state,'alice'))!;
  assert.equal(outcome.tone,'good');assert.match(outcome.title,/^ทายถูก!/);assert(outcome.lines.some(l=>l.includes(genuine?'ของแท้':'ของปลอม')));assert(outcome.lines.includes('+2 เครดิต'));
  const quiet=appraisalViewFor(state,'alice');assert.equal(outcomeBetween(quiet,quiet),null,'an unchanged view makes no card');
  const traded=structuredClone(state);traded.phase='TRADE';const phase=outcomeBetween(quiet,appraisalViewFor(traded,'alice'))!;
  assert.equal(phase.title,'ต่อรองกับผู้เล่น');assert(phase.lines[0]!.includes('ขายหรือแลก'));
  assert.deepEqual(appendedNotes(['a','b'],['b','c']),['c']);assert.deepEqual(appendedNotes(['a'],['a','a']),['a']);assert.deepEqual(appendedNotes([],[]),[]);
});
test('desk shows one step at a time and the event takes the stage as a dialog',()=>{
  const state=appraisalFixture('E41');const room=roomView(state);
  const desk=renderToStaticMarkup(createElement(AppraisalDesk,{game:room.game!,item:room.game!.self.stock[0]!,submit:()=>{},disabled:false}));
  assert.equal((desk.match(/role="tabpanel"/g)??[]).length,3);assert.equal((desk.match(/role="tabpanel"[^>]*hidden=""/g)??[]).length,2);
  offerEvent(state,state.players[0]!,'E41');const html=renderToStaticMarkup(createElement(GameTable,{room:roomView(state),submit:()=>{},send:()=>true,disabled:false}));
  assert(html.includes('role="dialog"'));assert(html.includes('aria-modal="true"'));assert(html.includes('inert'));
});
