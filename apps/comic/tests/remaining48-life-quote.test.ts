import test from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {EventModal} from '../src/appraisal-client/feedback.js';
import {applyAppraisalAction,appraisalViewFor,SURVIVAL_RULES} from '../src/game/appraisal/index.js';
import {offerEvent} from '../src/game/appraisal/events.js';
import {defaultRarityConfig} from '../src/shared/item-rarity.js';
import {defaultRarityEconomy} from '../src/shared/rarity-power.js';
import type {AppraisalState,AppraisalItem,ItemKind} from '../src/game/appraisal/types.js';
import {appraisalFixture} from './support/appraisal-fixture.js';

function fixture(revision:number,withWine=false,copy=false) {
  const state=appraisalFixture();state.config.catalogVersion=5;state.config.npcEvents=true;state.config.survival=SURVIVAL_RULES;state.config.trustAbilities=true;state.version=5;
  state.config.rarity=defaultRarityConfig();state.config.rarityEconomy=defaultRarityEconomy();
  (state.config as unknown as {native56Effects:number}).native56Effects=revision;
  for(const seat of state.players)seat.life=6;
  const p=state.players[0]!;p.life=3;p.selectedPortalId=p.portals[0]!.id;p.portals[0]!.npc='vampire';
  for(const id of p.stock)state.items[id]!.npc='vampire';
  if(withWine) {
    const source=state.items[p.stock[0]!]!,id='held-wine';
    const wine:AppraisalItem={...source,id,kind:'vampire-shadow-wine-decanter' as ItemKind,owner:p.id,appearance:{version:1,rarity:'common',theme:'plain',visualSeed:1},rarityPower:{version:1,valueMultiplier:1,effectMultiplier:1}};
    state.items[id]=wine;p.inventory.push(id);
    if(copy){state.items['wine-origin']={...wine,id:'wine-origin',owner:'removed'};wine.copy={sourceId:'wine-origin',number:1,valuePercent:25};}
  }
  offerEvent(state,p,'E109');
  return {state,p,offer:p.eventOffer!};
}

function accept(state:AppraisalState) {
  const p=state.players[0]!,offer=p.eventOffer!;
  return applyAppraisalAction(state,{type:'event',choice:'accept',key:offer.key,playerId:p.id,requestId:'e58-accept',encounter:state.encounter});
}

test('E58 changes the captured Vampire price only at native revision13 and the actual payment matches it',()=>{
  for(const [revision,withWine,expected] of [[12,true,2],[13,false,2],[13,true,1]] as const) {
    const {state,p,offer}=fixture(revision,withWine);
    assert.equal(offer.npcTerms!.life,expected);
    const view=appraisalViewFor(state,p.id),displayed=view.self.eventOffer!.npcTerms!.life;
    assert.equal(displayed,expected,'the player sees the captured payment');
    if(revision===13&&withWine) {
      const html=renderToStaticMarkup(createElement(EventModal,{game:view,offer:view.self.eventOffer!,submit:()=>{},disabled:false,tucked:false,setTucked:()=>{}}));
      assert(html.includes('−1'),'the Comic event displays the reduced life price');
    }
    const after=accept(state);
    assert.equal(after.players[0]!.life,3-expected);
    assert(after.players[0]!.inventory.includes('held-wine')===withWine);
  }
});

test('E58 copies do not reach binary strength one and cannot lower the life quote',()=>{
  const {state,offer}=fixture(13,true,true);
  assert.equal(offer.npcTerms!.life,2);
  assert.equal(accept(state).players[0]!.life,1);
});
