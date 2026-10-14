import test from 'node:test';
import assert from 'node:assert/strict';
import { applyAppraisalAction, appraisalViewFor, restoreAppraisalRun } from '../src/game/appraisal/index.js';
import { activationNote, grant, status, wealth } from '../src/game/appraisal/mechanics.js';
import { collectorTotal, itemScoreValue } from '../src/game/appraisal/scoring.js';
import { collectorEstimate, eventItemUsable, eventNeeds, itemScoreRange, activationOutcome } from '../src/appraisal-client/model.js';
import { offerEvent } from '../src/game/appraisal/events.js';
import type { AppraisalAction, AppraisalState } from '../src/game/appraisal/types.js';
import { appraisalFixture } from './support/appraisal-fixture.js';

type Body=AppraisalAction extends infer A ? A extends AppraisalAction ? Omit<A,'playerId'|'requestId'|'encounter'> : never : never;
let request=0;
const act=(state:AppraisalState,playerId:string,body:Body)=>applyAppraisalAction(state,{...body,playerId,requestId:`curse-${++request}`,encounter:state.encounter} as AppraisalAction);

test('the third inspection reads the curse without any buff, and only once per item',()=>{
  let state=appraisalFixture('E18');const item=state.players[0]!.stock[0]!;state.items[item]!.cursed=true;
  assert.equal(appraisalViewFor(state,'alice').curseSight,true);
  state=act(state,'alice',{type:'inspect',itemId:item,property:'effects'});
  assert.equal(state.players[0]!.knowledge[item]!.cursed,true);assert.equal(state.players[0]!.knowledge[item]!.effectsKnown,true);
  assert.throws(()=>act(state,'alice',{type:'inspect',itemId:item,property:'effects'}));
});
test('a saved run without the flag keeps the old effects check (no curse unless B02)',()=>{
  const fresh=appraisalFixture('E18');const config={...fresh.config};delete config.curseSight;
  let state=restoreAppraisalRun(['alice','bob'],'legacy',config);state.phase='APPRAISAL';
  const p=state.players[0]!;p.eventOffer=null;p.stock=[...p.portals[0]!.stock];p.energy=7;state.items[p.stock[0]!]!.cursed=true;
  state=act(state,'alice',{type:'inspect',itemId:p.stock[0]!,property:'effects'});
  assert.equal(state.players[0]!.knowledge[p.stock[0]!]!.cursed,undefined);assert.equal(state.players[0]!.knowledge[p.stock[0]!]!.effectsKnown,true);
});
test('B02 adds the curse to the next price or authenticity check and is spent',()=>{
  let state=appraisalFixture('E18');const p=state.players[0]!;const item=p.stock[0]!;state.items[item]!.cursed=true;grant(state,p,'B02');
  state=act(state,'alice',{type:'inspect',itemId:item,property:'authenticity'});
  assert.equal(state.players[0]!.knowledge[item]!.genuine,state.items[item]!.genuine);assert.equal(state.players[0]!.knowledge[item]!.cursed,true);assert(!status(state.players[0]!,'B02'));
});
test('activating spells out genuine/fake × cursed/clean; genuine always works, fake only sometimes',()=>{
  for(const cursed of [false,true]) {
    let state=appraisalFixture('E18');const item=state.items['owned-mirror']!;item.genuine=true;item.cursed=cursed;
    const energy=state.players[0]!.energy;
    state=act(state,'alice',{type:'activate',itemId:'owned-mirror'});const p=state.players[0]!;
    assert(p.notes.at(-1)!.includes(cursed?'ของแท้แต่มีคำสาป':'ของแท้ ไม่มีคำสาป'));
    assert.equal(p.energy,energy-1);assert(status(p,'B01'));assert.equal(!!status(p,'D05'),cursed);
    assert.equal(p.knowledge['owned-mirror']!.genuine,true);assert.equal(p.knowledge['owned-mirror']!.cursed,cursed);
  }
  let worked=0,failed=0;
  for(let i=0;i<60;i++) {
    let state=appraisalFixture('E18');state.seed=`fake-${i}`;const item=state.items['owned-mirror']!;item.genuine=false;item.cursed=i%2===0;
    state=act(state,'alice',{type:'activate',itemId:'owned-mirror'});const p=state.players[0]!;
    const buff=!!status(p,'B01');if(buff){worked++;assert(p.notes.at(-1)!.includes('ออกฤทธิ์ได้'));}else{failed++;assert(p.notes.at(-1)!.includes('ไม่ออกฤทธิ์'));}
    assert.equal(!!status(p,'D05'),item.cursed);assert.equal(p.knowledge['owned-mirror']!.genuine,false);
  }
  assert(worked>10 && failed>10 && worked<failed,`fake works ${worked}/60, expected roughly 40%`);
  const legacy=appraisalFixture('E18');delete legacy.config.fakeEffect;legacy.items['owned-mirror']!.genuine=false;
  assert(!status(act(legacy,'alice',{type:'activate',itemId:'owned-mirror'}).players[0]!,'B01'),'saved runs keep fakes inert');
  const shielded=appraisalFixture('E18');shielded.items['owned-mirror']!.cursed=true;grant(shielded,shielded.players[0]!,'B06');
  assert(activationNote(shielded,shielded.items['owned-mirror']!,true).includes('กันไว้'));
});
test('event choices that cost resources are priced, and already-known items are not offered again',()=>{
  const state=appraisalFixture('E46');offerEvent(state,state.players[0]!,'E46');
  const view=appraisalViewFor(state,'alice');const offer=view.self.eventOffer!;
  assert.deepEqual(eventNeeds(view,offer,'accept',offer.itemIds[0]!),{credits:0,energy:1});assert.deepEqual(eventNeeds(view,offer,'decline',''),{credits:0,energy:0});
  state.players[0]!.knowledge[offer.itemIds[0]!]={genuine:true};
  const known=appraisalViewFor(state,'alice');
  assert.equal(eventItemUsable(known,offer,offer.itemIds[0]!),false);assert.equal(eventItemUsable(known,offer,offer.itemIds[1]!),true);
});
test('score value and the Collector total share one formula; the client estimate uses only known facts',()=>{
  assert.equal(itemScoreValue(20,true,false),20);assert.equal(itemScoreValue(20,false,false),5);assert.equal(itemScoreValue(20,true,true),15);assert.equal(itemScoreValue(23,false,true),4);
  assert.equal(collectorTotal(10,15,20),30);assert.equal(collectorTotal(10,15,-20),20);assert.equal(collectorTotal(7,0,20),8);
  const state=appraisalFixture('E18');const p=state.players[0]!;
  state.items['owned-mirror']!.genuine=false;state.items['owned-mirror']!.cursed=true;
  assert.equal(wealth(state,p),p.credits+p.inventory.reduce((sum,id)=>sum+itemScoreValue(state.items[id]!.base,state.items[id]!.genuine,state.items[id]!.cursed),0));
  assert.deepEqual(itemScoreRange({base:20}),[3,20]);assert.deepEqual(itemScoreRange({base:20,genuine:false,cursed:true}),[3,3]);
  assert.equal(itemScoreRange({}),null);assert.deepEqual(itemScoreRange({range:[10,12],genuine:true,cursed:false}),[10,12]);
  const view=appraisalViewFor(state,'alice');const est=collectorEstimate(view);
  assert.equal(est.unpriced,view.self.inventory.length);assert.equal(est.min,collectorTotal(p.credits,0,0));
  assert.match(activationOutcome({genuine:false,cursed:false}),/40%/);assert.match(activationOutcome({}),/ของปลอมมีโอกาส 40%/);
});
