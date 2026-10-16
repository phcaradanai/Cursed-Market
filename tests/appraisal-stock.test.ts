import test from 'node:test';
import assert from 'node:assert/strict';
import { applyAppraisalAction, appraisalViewFor, assertAppraisalInvariants, createAppraisalRun } from '../src/game/appraisal/index.js';
import { activeNpcs, extraStock, STOCK_RULES, trustTier } from '../src/game/appraisal/pulse.js';
import type { AppraisalAction, AppraisalState, NpcId } from '../src/game/appraisal/types.js';

const act=(s:AppraisalState,body:Record<string,unknown>,id='alice')=>applyAppraisalAction(s,{...body,playerId:id,requestId:`stock-${Math.random().toString(36).slice(2,10)}`,encounter:s.encounter} as AppraisalAction);

function arrival(trust:Partial<Record<NpcId,number>>|'all-2'|'all-4'|'all-3-one-1'):AppraisalState {
  const s=createAppraisalRun(['alice','bob'],'stock-bonus',{marketProbability:0});
  for(const p of s.players){p.eventOffer=null;p.offerSlots=0;}
  const npcs=activeNpcs(s.config);const alice=s.players[0]!;
  alice.npcTrust=trust==='all-2'?Object.fromEntries(npcs.map(n=>[n,2])):trust==='all-4'?Object.fromEntries(npcs.map(n=>[n,4])):trust==='all-3-one-1'?Object.fromEntries(npcs.map((n,i)=>[n,i?3:1])):trust;
  return s;
}
const enter=(s:AppraisalState)=>act(s,{type:'enter',portalId:s.players[0]!.portals[0]!.id});

test('every 2 levels of the lowest trust across all merchants add 1 shop item',()=>{
  assert.equal(STOCK_RULES.trustPerExtra,2);
  assert.deepEqual([0,1,2,3,4,5,10].map(extraStock),[0,0,1,1,2,2,5]);
  assert.equal(trustTier({orc:5,vampire:3},['orc','vampire']),3);
  assert.equal(trustTier({orc:5},['orc','vampire']),0,'a merchant you never traded with holds the tier at 0');
  assert.equal(trustTier(undefined,['orc']),0);
});

test('entering a portal lays out the earned extra goods',()=>{
  const base=enter(arrival({}));assert.equal(base.players[0]!.stock.length,2,'no bonus without trust');
  const one=enter(arrival('all-2'));assert.equal(one.players[0]!.stock.length,3);
  const two=enter(arrival('all-4'));assert.equal(two.players[0]!.stock.length,4);
  const weakest=enter(arrival('all-3-one-1'));assert.equal(weakest.players[0]!.stock.length,2,'one merchant at 1 keeps the tier at 1');
  assertAppraisalInvariants(two);
});

test('extra goods are real shop goods of the chosen merchant, deterministic, and usable like any other',()=>{
  const a=enter(arrival('all-4')),b=enter(arrival('all-4'));
  const p=a.players[0]!;const portal=p.portals[0]!;
  assert.deepEqual(p.stock,b.players[0]!.stock,'same seed and trust give the same goods');
  assert.deepEqual(p.stock.slice(0,2),portal.stock);
  for(const id of p.stock.slice(2)){
    const item=a.items[id]!;
    assert.equal(item.npc,portal.npc);assert.equal(item.owner,`npc:alice:${a.encounter}`);assert.equal(item.npcOwnerId,'alice');assert.equal(item.encounter,a.encounter);
  }
  assert.equal(new Set(p.stock).size,p.stock.length);
  const table=act(a,{type:'enter',portalId:a.players[1]!.portals[0]!.id},'bob');assert.equal(table.phase,'APPRAISAL');table.players[0]!.eventOffer=null;
  const extra=p.stock[3]!;const done=act(table,{type:'appraise',itemId:extra,value:10,acceptDanger:true});
  assert(done.players[0]!.valuations[extra]);assertAppraisalInvariants(done);
});

test('the view tells the seat its tier and what each extra level needs',()=>{
  const view=appraisalViewFor(arrival('all-4'),'alice').self.stockBonus;
  assert.deepEqual(view,{tier:4,extra:2,perExtra:2});
  assert.deepEqual(appraisalViewFor(arrival({}),'alice').self.stockBonus,{tier:0,extra:0,perExtra:2});
});
