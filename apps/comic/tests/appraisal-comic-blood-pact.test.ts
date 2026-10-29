import test from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {EventModal} from '../src/appraisal-client/feedback.js';
import {eventDecision} from '../src/appraisal-client/model.js';
import {applyAppraisalAction,appraisalViewFor,SURVIVAL_RULES} from '../src/game/appraisal/index.js';
import {offerEvent} from '../src/game/appraisal/events.js';
import {appraisalFixture} from './support/appraisal-fixture.js';

function fixture() {
  const state=appraisalFixture();state.config.npcEvents=true;state.config.survival=SURVIVAL_RULES;state.version=5;
  for(const player of state.players)player.life=4;
  const p=state.players[0]!;p.selectedPortalId=p.portals[0]!.id;p.portals[0]!.npc='vampire';
  for(const id of p.stock)state.items[id]!.npc='vampire';
  offerEvent(state,p,'E109');return {state,p,game:appraisalViewFor(state,p.id)};
}
test('comic E109 displays actual life price and deferred reward without exposing item truths',()=>{
  const {game}=fixture(),offer=game.self.eventOffer!;
  const html=renderToStaticMarkup(createElement(EventModal,{game,offer,submit:()=>assert.fail('render submitted'),disabled:false,tucked:false,setTucked:()=>{}}));
  assert(html.includes('comic-event-dialog'));assert(html.includes('/art/comic/merchants/vampire/idle.png'));
  assert(html.includes('สุ่มรับเพียง 1 อย่าง'));assert(html.includes('จบเกมก่อนพบกันอีกครั้ง'));
  assert(html.includes('ซ่อนไว้ดูโต๊ะ'));assert(!html.includes('event-form'));assert(!html.includes('portrait-card'));
  assert(html.includes('ดูผลตอบแทนที่อาจได้รับ'));assert(html.includes('role="tooltip"'));
  for(const item of game.self.stock)assert(!html.includes(item.id),'no stock detail leaks from event presentation');
  offer.npcTerms!.life=1;
  const repriced=renderToStaticMarkup(createElement(EventModal,{game,offer,submit:()=>{},disabled:false,tucked:false,setTucked:()=>{}}));
  assert(repriced.includes('−1'),'cost comes from offer terms');
});
test('life shortage blocks accept only; transport busy blocks both and tuck retains pending event',()=>{
  const {game}=fixture(),offer=game.self.eventOffer!;
  const render=(disabled:boolean,tucked=false)=>renderToStaticMarkup(createElement(EventModal,{game,offer,submit:()=>assert.fail('render submitted'),disabled,tucked,setTucked:()=>{}}));
  game.self.life=2;const html=render(false);
  assert.match(html,/<button[^>]*disabled=""[^>]*>ยอมรับ/);
  assert.match(html,/<button(?![^>]*disabled)[^>]*>ปฏิเสธ/);
  assert(html.includes('ต้องมีชีวิตมากกว่า 2'));
  assert.match(render(true),/<button[^>]*disabled=""[^>]*>ปฏิเสธ/);
  const tucked=render(false,true);assert(tucked.includes('กลับไปตัดสินใจ'));assert(!tucked.includes('comic-event-spread'));
  assert.equal(offer.key,game.self.eventOffer!.key);
});
test('event command used by comic choices pays now, defers reward and preserves decline',()=>{
  for(const choice of ['accept','decline']) {
    const {state,p,game}=fixture(),offer=game.self.eventOffer!;
    const command=eventDecision(offer,choice,{itemId:'',statusId:'',fact:'',guess:false});assert(command);
    const next=applyAppraisalAction(state,{...command,playerId:p.id,requestId:`comic-${choice}`,encounter:state.encounter});
    const after=next.players[0]!;
    assert.equal(after.life,choice==='accept'?2:4);assert.deepEqual(after.inventory,p.inventory);
    assert.equal(after.credits,p.credits);assert.equal(after.energy,p.energy);
    assert.equal(!!after.npcContracts?.vampire,choice==='accept');assert.equal(after.eventOffer,null);
  }
});
