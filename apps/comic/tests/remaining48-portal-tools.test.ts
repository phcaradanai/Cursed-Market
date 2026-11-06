import test from 'node:test';
import assert from 'node:assert/strict';
import { createAppraisalRun, appraisalViewFor } from '../src/game/appraisal/index.js';
import { activatePortalTool, closeEventPortal, portalClue } from '../src/game/appraisal/portal-effects.js';
import type { ItemKind } from '../src/game/appraisal/types.js';

function fixture(kind:ItemKind,revision=15){
  const state=createAppraisalRun(['alice','bob'],'portal-tool',{catalogVersion:5,native56Effects:14,marketProbability:0});
  Object.assign(state.config,{native56Effects:revision});
  const p=state.players[0]!,portal=p.portals[0]!;
  p.eventOffer=null;
  const item={...state.items[portal.stock[0]!]!,id:'tool',owner:p.id,kind};
  state.items[item.id]=item;p.inventory.push(item.id);
  return {state,p,portal,item};
}
test('E35 reveals only a private second stock kind and never moves its clue to a replacement',()=>{
  const {state,p,portal,item}=fixture('autometa-folding-beacon');
  const energy=p.energy;
  activatePortalTool(state,p,item.id,portal.id);
  assert.equal(p.energy,energy-1);
  assert.equal(portalClue(state,p,portal),state.items[portal.stock[1]!]!.kind);
  assert.equal(portalClue(state,p,{...portal,id:'replacement'}),undefined);
  assert(!JSON.stringify(appraisalViewFor(state,'bob')).includes('"clue"'));
  assert.throws(()=>activatePortalTool(state,p,item.id,portal.id));
  assert.equal(p.energy,energy-1);
  assert.equal(item.owner,p.id);
});
test('E36 preserves the event door and rejects system closures and older revisions',()=>{
  const {state,p,portal,item}=fixture('beast-rift-saddle');
  portal.disabled=true;
  assert.throws(()=>activatePortalTool(state,p,item.id,portal.id));
  portal.disabled=false;
  closeEventPortal(state,portal,'E01');
  const before=structuredClone(portal);
  activatePortalTool(state,p,item.id,portal.id);
  assert.deepEqual(portal,{id:before.id,npc:before.npc,stock:before.stock,disabled:false});
  assert.equal(item.owner,p.id);
  const old=fixture('beast-rift-saddle',14);
  closeEventPortal(old.state,old.portal,'E01');
  assert.throws(()=>activatePortalTool(old.state,old.p,old.item.id,old.portal.id));
});
