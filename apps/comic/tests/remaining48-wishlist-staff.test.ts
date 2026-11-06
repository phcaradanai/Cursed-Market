import test from 'node:test';
import assert from 'node:assert/strict';
import { applyAppraisalAction, appraisalViewFor } from '../src/game/appraisal/index.js';
import { REMAINING48_ITEMS } from '../src/game/appraisal/remaining48-catalog.js';
import { WISH_ENERGY } from '../src/game/appraisal/wishlist-rules.js';
import { wishPick } from '../src/game/appraisal/wishlist.js';
import type { AppraisalAction, AppraisalState } from '../src/game/appraisal/types.js';
import { appraisalFixture } from './support/appraisal-fixture.js';

type Body=AppraisalAction extends infer A ? A extends AppraisalAction ? Omit<A,'playerId'|'requestId'|'encounter'> : never : never;
let request=0;
const act=(state:AppraisalState,body:Body)=>applyAppraisalAction(state,{...body,playerId:'alice',requestId:`e57-wish-${++request}`,encounter:state.encounter} as AppraisalAction);
const staffId='e57-test-phase-staff';

function table(revision=14,withStaff=true) {
  const state=appraisalFixture('E18'),p=state.players[0]!;
  state.config.catalogVersion=5;
  Object.assign(state.config,{native56Effects:revision});
  p.eventOffer=null;p.done=false;p.paused=null;p.selectedPortalId=p.portals[0]!.id;p.portals[0]!.npc='alien';p.wishRolls=0;p.activated=[];
  const current=wishPick(state,p,'alien',0);
  p.wishes={alien:{...current,set:state.encounter}};
  if(withStaff) {
    const source=state.items['owned-mirror']!;
    state.items[staffId]={...source,id:staffId,kind:'alien-phase-staff',base:REMAINING48_ITEMS['alien-phase-staff'].anchor,ask:REMAINING48_ITEMS['alien-phase-staff'].anchor,owner:p.id,npc:'alien',encounter:state.encounter,reservation:1};
    p.inventory.push(staffId);
  }
  return state;
}

test('E57 makes one eligible Alien NPC wish replacement free and the view quotes the same cost',()=>{
  const state=table(),p=state.players[0]!,old=p.wishes!.alien!,expected=wishPick(state,p,'alien',1,old.kind);
  assert.notEqual(expected.kind,old.kind);
  assert.equal(appraisalViewFor(state,'alice').self.wishDesk!.cost,0);
  const energy=p.energy,after=act(state,{type:'wish-new'}),seat=after.players[0]!;
  assert.equal(seat.energy,energy);
  assert.equal(seat.wishes!.alien!.kind,expected.kind);
  assert.deepEqual(seat.activated,[staffId]);
  const trace=after.trace.at(-1)!;
  assert.equal(trace?.details.freeChange,true);assert.equal(trace?.details.itemId,staffId);
  assert.equal(appraisalViewFor(after,'alice').self.wishDesk!.cost,WISH_ENERGY);
  const second=act(after,{type:'wish-new'});
  assert.equal(second.players[0]!.energy,energy-WISH_ENERGY,'the same family cannot waive energy twice in one encounter');
});

test('E57 is revision-, contract-, target-, and strength-gated; weak copies do not pool into a binary use',()=>{
  const legacy=table(13),legacyP=legacy.players[0]!;
  assert.equal(appraisalViewFor(legacy,'alice').self.wishDesk!.cost,WISH_ENERGY);
  const legacyAfter=act(legacy,{type:'wish-new'});
  assert.equal(legacyAfter.players[0]!.energy,legacyP.energy-WISH_ENERGY);
  assert.deepEqual(legacyAfter.players[0]!.activated,[]);

  const noCurrent=table(14),noCurrentP=noCurrent.players[0]!;delete noCurrentP.wishes!.alien;
  assert.equal(appraisalViewFor(noCurrent,'alice').self.wishDesk!.cost,WISH_ENERGY);

  const copy=table(14),copyP=copy.players[0]!,item=copy.items[staffId]!;
  item.copy={sourceId:'owned-mirror',number:1,valuePercent:40};
  const secondId='e57-test-phase-staff-copy';
  copy.items[secondId]={...item,id:secondId,owner:copyP.id,copy:{sourceId:'owned-mirror',number:2,valuePercent:40}};copyP.inventory.push(secondId);
  assert.equal(appraisalViewFor(copy,'alice').self.wishDesk!.cost,WISH_ENERGY,'two sub-threshold copies cannot combine for a binary benefit');
});

test('E57 does not spend its per-encounter use if the replacement cannot be funded',()=>{
  const state=table(),p=state.players[0]!,before=structuredClone(p.wishes!.alien);
  state.bank=state.market.budget+state.reservedRewards;
  assert.throws(()=>act(state,{type:'wish-new'}),/งบธนาคาร/);
  assert.deepEqual(p.activated,[]);assert.deepEqual(p.wishes!.alien,before);
});
