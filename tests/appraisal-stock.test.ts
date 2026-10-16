import test from 'node:test';
import assert from 'node:assert/strict';
import { applyAppraisalAction, appraisalViewFor, assertAppraisalInvariants, createAppraisalRun } from '../src/game/appraisal/index.js';
import { activeNpcs, extraStock, STOCK_RULES, trustTier } from '../src/game/appraisal/pulse.js';
import type { AppraisalAction, AppraisalState, NpcId } from '../src/game/appraisal/types.js';

const act=(s:AppraisalState,body:Record<string,unknown>,id='alice')=>applyAppraisalAction(s,{...body,playerId:id,requestId:`stock-${Math.random().toString(36).slice(2,10)}`,encounter:s.encounter} as AppraisalAction);

function arrival(trust:Partial<Record<NpcId,number>>|'all-1'|'all-4'|'all-3-one-0'):AppraisalState {
  const s=createAppraisalRun(['alice','bob'],'stock-bonus',{marketProbability:0});
  for(const p of s.players){p.eventOffer=null;p.offerSlots=0;}
  const npcs=activeNpcs(s.config);const alice=s.players[0]!;
  alice.npcTrust=trust==='all-1'?Object.fromEntries(npcs.map(n=>[n,1])):trust==='all-4'?Object.fromEntries(npcs.map(n=>[n,4])):trust==='all-3-one-0'?Object.fromEntries(npcs.map((n,i)=>[n,i?3:0])):trust;
  return s;
}
const enter=(s:AppraisalState)=>act(s,{type:'enter',portalId:s.players[0]!.portals[0]!.id});

test('trust 1 with every merchant adds 1 shop item, and it does not scale',()=>{
  assert.deepEqual([STOCK_RULES.minTrust,STOCK_RULES.extra],[1,1]);
  assert.deepEqual([0,1,2,3,4,5,10].map(extraStock),[0,1,1,1,1,1,1]);
  assert.equal(trustTier({orc:5,vampire:3},['orc','vampire']),3);
  assert.equal(trustTier({orc:5},['orc','vampire']),0,'a merchant you never traded with holds the tier at 0');
  assert.equal(trustTier(undefined,['orc']),0);
});

test('entering a portal lays out the earned extra goods',()=>{
  const base=enter(arrival({}));assert.equal(base.players[0]!.stock.length,2,'no bonus without trust');
  const one=enter(arrival('all-1'));assert.equal(one.players[0]!.stock.length,3);
  const high=enter(arrival('all-4'));assert.equal(high.players[0]!.stock.length,3,'higher trust adds nothing more');
  const weakest=enter(arrival('all-3-one-0'));assert.equal(weakest.players[0]!.stock.length,2,'one merchant at 0 keeps the bonus away');
  assertAppraisalInvariants(high);
});

test('extra goods are real shop goods of the chosen merchant, deterministic, and usable like any other',()=>{
  const a=enter(arrival('all-1')),b=enter(arrival('all-1'));
  const p=a.players[0]!;const portal=p.portals[0]!;
  assert.deepEqual(p.stock,b.players[0]!.stock,'same seed and trust give the same goods');
  assert.deepEqual(p.stock.slice(0,2),portal.stock);
  for(const id of p.stock.slice(2)){
    const item=a.items[id]!;
    assert.equal(item.npc,portal.npc);assert.equal(item.owner,`npc:alice:${a.encounter}`);assert.equal(item.npcOwnerId,'alice');assert.equal(item.encounter,a.encounter);
  }
  assert.equal(new Set(p.stock).size,p.stock.length);
  const table=act(a,{type:'enter',portalId:a.players[1]!.portals[0]!.id},'bob');assert.equal(table.phase,'APPRAISAL');table.players[0]!.eventOffer=null;
  const extra=p.stock[2]!;const done=act(table,{type:'appraise',itemId:extra,value:10,acceptDanger:true});
  assert(done.players[0]!.valuations[extra]);assertAppraisalInvariants(done);
});

test('the view tells the seat its tier and the trust the bonus needs',()=>{
  const npcs=activeNpcs(arrival({}).config);
  assert.deepEqual(appraisalViewFor(arrival('all-4'),'alice').self.stockBonus,{tier:4,extra:1,need:1,npcs});
  assert.deepEqual(appraisalViewFor(arrival({}),'alice').self.stockBonus,{tier:0,extra:0,need:1,npcs});
});

test('bonus goods are flagged, and the owner alone sees what they paid',()=>{
  const s=enter(arrival('all-1'));const p=s.players[0]!;
  const flags=p.stock.map(id=>Boolean(appraisalViewFor(s,'alice').self.stock.find(i=>i.id===id)?.bonus));
  assert.deepEqual(flags,[false,false,true],'only the third, trust-earned item carries the flag');
  const id=p.stock[0]!;p.paid={[id]:17};s.items[id]!.owner='alice';p.inventory.push(id);p.stock=p.stock.filter(x=>x!==id);
  assert.equal(appraisalViewFor(s,'alice').self.inventory.find(i=>i.id===id)!.paid,17);
  s.items[id]!.owner='bob';s.players[1]!.inventory.push(id);p.inventory=p.inventory.filter(x=>x!==id);
  assert.equal(appraisalViewFor(s,'bob').self.inventory.find(i=>i.id===id)!.paid,undefined,'the new owner never sees the old price');
});
