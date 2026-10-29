import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { applyAppraisalAction, appraisalViewFor } from '../src/game/appraisal/index.js';
import { offerEvent } from '../src/game/appraisal/events.js';
import { NPC_SPECS, npcImage } from '../src/game/appraisal/content.js';
import { EventDecision } from '../src/appraisal-client/components.js';
import { portalAvailability, portalChoiceTitle } from '../src/appraisal-client/PortalEventPreview.js';
import { eventCost } from '../src/appraisal-client/model.js';
import { appraisalFixture } from './support/appraisal-fixture.js';
import { CORE2_SPECS, core2Choices } from '../src/game/appraisal/core2-specs.js';
import type { EventId } from '../src/game/appraisal/types.js';
import { EventModal } from '../src/appraisal-client/feedback.js';

const currentPortalEvents=Object.values(CORE2_SPECS).filter(spec=>spec.phase==='PORTALS');
function currentPortalFixture(id:EventId) {
  const state=appraisalFixture(id);state.phase='PORTALS';state.config.core2=true;
  for(const player of state.players)player.stock=[];
  return state;
}

test('all current portal event choices predict the actual door flags for current and archived rules',()=>{
  for(const spec of currentPortalEvents)for(const archived of [false,true])for(const closed of [-1,0,1,2]) {
    const state=currentPortalFixture(spec.id);const p=state.players[0]!;
    if(archived)delete state.config.eventChoiceRules;
    if(closed>=0)p.portals[closed]!.disabled=true;
    offerEvent(state,p,spec.id);const game=appraisalViewFor(state,p.id);const offer=game.self.eventOffer!;
    for(const choice of offer.choices) {
      const next=applyAppraisalAction(state,{type:'event',key:offer.key,choice,playerId:p.id,requestId:`doors-${spec.id}-${archived}-${closed}-${choice}`,encounter:state.encounter});
      assert.deepEqual(portalAvailability(game,offer,choice),next.players[0]!.portals.map(portal=>!portal.disabled),`${spec.id}/${choice}`);
      assert.equal(next.players[0]!.selectedPortalId,p.selectedPortalId,'previewing or resolving the event must not enter a door');
      const picked=core2Choices(spec.id,state.config).find(c=>c.id===choice)!;
      if(picked.door){
        const closedIndex=picked.door==='first'?1:0;
        assert(portalChoiceTitle(game,offer,choice)?.includes(NPC_SPECS[p.portals[closedIndex]!.npc].name));
      }
    }
  }
});
test('every current portal event displays three numbered merchant doors inside its dialog',()=>{
  for(const spec of currentPortalEvents) {
    const state=currentPortalFixture(spec.id);const p=state.players[0]!;offerEvent(state,p,spec.id);
    const game=appraisalViewFor(state,p.id),offer=game.self.eventOffer!;
    const html=renderToStaticMarkup(createElement(EventModal,{game,offer,submit:()=>{},disabled:false,tucked:false,setTucked:()=>{}}));
    assert(html.includes('portal-event-dialog'),spec.id);
    assert(html.indexOf('event-portal-grid')<html.indexOf('event-form'),spec.id);
    for(const [index,portal] of game.self.portals.entries()){
      assert(html.includes(`ประตู ${index+1}: ${NPC_SPECS[portal.npc].name}`),spec.id);
      assert(html.includes(npcImage(portal.npc)),spec.id);
    }
    assert.equal((html.match(/class="portal-number"/g)??[]).length,3);
    assert(!html.includes('reservation'));assert(!html.includes('lastAccepted'));
  }
});

test('every portal-event preview matches the resolved engine flags, including existing closed portals',()=>{
  for(const id of ['E01','E08','E10'] as const)for(const closed of [-1,0,1,2]) {
    const state=appraisalFixture(id);const p=state.players[0]!;
    if(closed>=0)p.portals[closed]!.disabled=true;
    offerEvent(state,p,id);const game=appraisalViewFor(state,p.id);const offer=game.self.eventOffer!;
    for(const choice of offer.choices) {
      const next=applyAppraisalAction(state,{type:'event',key:offer.key,choice,playerId:p.id,requestId:`preview-${id}-${closed}-${choice}`,encounter:state.encounter});
      assert.deepEqual(portalAvailability(game,offer,choice),next.players[0]!.portals.map(portal=>!portal.disabled),`${id}/${closed}/${choice}`);
      assert.equal(next.players[0]!.selectedPortalId,p.selectedPortalId,'resolving the event does not enter a portal');
      assert(portalChoiceTitle(game,offer,choice));
      assert(!eventCost(game,offer,choice,'').includes('ประตูแรก'));
    }
  }
});
test('portal decisions expose all merchant hints before the choices, and name the affected merchant',()=>{
  for(const id of ['E01','E08','E10'] as const) {
    const state=appraisalFixture(id);const p=state.players[0]!;p.npcTrust={orc:3};offerEvent(state,p,id);
    const game=appraisalViewFor(state,p.id);const offer=game.self.eventOffer!;
    const html=renderToStaticMarkup(createElement(EventDecision,{game,offer,submit:()=>{},disabled:false}));
    assert(html.indexOf('event-portal-grid')<html.indexOf('event-form'));
    for(const portal of game.self.portals) {
      assert(html.includes(npcImage(portal.npc)));assert(html.includes(NPC_SPECS[portal.npc].name));assert(html.includes(NPC_SPECS[portal.npc].hint));
    }
    assert(html.includes('จึงเลือกเข้าประตู'));
    assert(!html.includes('ยึดประตูเดิม'));
    assert.equal((html.match(/type="radio"/g)??[]).length,id==='E01'?2:3,'identical decline/switch outcomes appear only once');
    assert(!html.includes('reservation'));assert(!html.includes('lastAccepted'));
  }
});
