import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { advanceAppraisalEncounter, applyAppraisalAction, appraisalViewFor, assertAppraisalInvariants, createAppraisalRun, exportAppraisalAudit, replayAppraisalAudit, restoreAppraisalRun } from '../src/game/appraisal/index.js';
import { TrustRing } from '../src/appraisal-client/meters.js';
import { setLang } from '../src/appraisal-client/i18n.js';
import { activeNpcs, extraStock, STOCK_RULES, trustTier } from '../src/game/appraisal/pulse.js';
import type { AppraisalAction, AppraisalState, NpcId } from '../src/game/appraisal/types.js';

const act=(s:AppraisalState,body:Record<string,unknown>,id='alice')=>applyAppraisalAction(s,{...body,playerId:id,requestId:`stock-${Math.random().toString(36).slice(2,10)}`,encounter:s.encounter} as AppraisalAction);

function arrival(trust:Partial<Record<NpcId,number>>|'all-1'|'all-4'|'all-3-one-0',totalTrustStock=false):AppraisalState {
  const s=createAppraisalRun(['alice','bob'],'stock-bonus',{marketProbability:0,totalTrustStock});
  for(const p of s.players){p.eventOffer=null;p.offerSlots=0;}
  const npcs=activeNpcs(s.config);const alice=s.players[0]!;
  alice.npcTrust=trust==='all-1'?Object.fromEntries(npcs.map(n=>[n,1])):trust==='all-4'?Object.fromEntries(npcs.map(n=>[n,4])):trust==='all-3-one-0'?Object.fromEntries(npcs.map((n,i)=>[n,i?3:0])):trust;
  return s;
}
const enter=(s:AppraisalState)=>act(s,{type:'enter',portalId:s.players[0]!.portals[0]!.id});

test('historical rule: trust 1 with every merchant adds 1 shop item, and it does not scale',()=>{
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
  const a=enter(arrival({orc:6},true)),b=enter(arrival({orc:6},true));
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

test('new runs add one shop good per three total trust, from any merchants',()=>{
  assert.equal(createAppraisalRun(['alice','bob'],'default-stock').config.totalTrustStock,true);
  for(const [trust,extra] of [[{},0],[{orc:2},0],[{orc:3},1],[{orc:5},1],[{orc:6},2],[{orc:9},3],[{orc:2,vampire:1},1],[{orc:2,vampire:2,alien:2},2]] as const) {
    const s=arrival(trust,true),before=appraisalViewFor(s,'alice').self.stockBonus!;
    assert.equal(before.extra,extra);assert.equal(before.need,3);
    const entered=enter(s),p=entered.players[0]!;
    assert.equal(p.stock.length,2+extra,JSON.stringify(trust));
    assert.equal(appraisalViewFor(entered,'alice').self.stock.filter(item=>item.bonus).length,extra);
    assertAppraisalInvariants(entered);
  }
  const one=enter(arrival({orc:6},true)),split=enter(arrival({orc:2,vampire:2,alien:2},true));
  assert.deepEqual(one.players[0]!.stock,split.players[0]!.stock,'the same total gives the same deterministic bonus goods');
});

test('pooled stock uses current trust and only merchants enabled in the run',()=>{
  const s=arrival({orc:3,vampire:2},true);
  assert.equal(appraisalViewFor(s,'alice').self.stockBonus!.total,5);
  s.players[0]!.npcTrust!.orc=0;
  assert.equal(appraisalViewFor(s,'alice').self.stockBonus!.extra,0,'lost trust stops counting toward future shops');
  s.config.expansion=false;s.players[0]!.npcTrust={orc:2,swarm:10};
  assert.equal(appraisalViewFor(s,'alice').self.stockBonus!.total,2);
  const noCommerce=createAppraisalRun(['alice','bob'],'stock-no-commerce',{commerce:false,totalTrustStock:true,marketProbability:0});
  for(const p of noCommerce.players){p.eventOffer=null;p.offerSlots=0;}
  assert.equal(enter(noCommerce).players[0]!.stock.length,2);
  assert.equal(appraisalViewFor(noCommerce,'alice').self.stockBonus,undefined);
});

test('trust ring shows pooled progress and repeated rewards in Thai and English',()=>{
  for(const lang of ['th','en'] as const) {
    setLang(lang);
    try {
      for(const [trust,label] of [[2,'2/3'],[3,'+1'],[6,'+2']] as const) {
        const html=renderToStaticMarkup(createElement(TrustRing,{game:appraisalViewFor(arrival({orc:trust},true),'alice')}));
        assert(html.includes(label));
        assert(!html.includes(lang==='th'?'ไว้ใจครบ':'All trusted'));
        if(lang==='en')assert(!/[฀-๿]/.test(html));
      }
    } finally {setLang('th');}
  }
});

test('saved configs without pooled stock retain the historical all-merchant bonus and replay',()=>{
  const old=arrival('all-4');delete old.config.totalTrustStock;
  const restored=restoreAppraisalRun(['alice','bob'],old.seed,old.config);
  assert.equal(restored.config.totalTrustStock,undefined);
  restored.players[0]!.npcTrust=old.players[0]!.npcTrust!;
  restored.players[0]!.eventOffer=null;restored.players[0]!.offerSlots=0;
  assert.equal(enter(restored).players[0]!.stock.length,3);
  assert.equal(appraisalViewFor(restored,'alice').self.stockBonus!.total,undefined);
  for(const rule of [undefined,false,true]) {
    let s=createAppraisalRun(['alice','bob'],'stock-replay',{marketProbability:0});
    const config={...s.config};if(rule===undefined)delete config.totalTrustStock;else config.totalTrustStock=rule;
    s=restoreAppraisalRun(['alice','bob'],s.seed,config);
    for(let guard=0;guard<150 && s.phase!=='RESULTS';guard++) {
      if(s.phase==='REVEAL'){s=advanceAppraisalEncounter(s);continue;}
      const p=s.players.find(p=>!p.done && !p.paused);assert(p);
      s=act(s,p.eventOffer || s.phase!=='PORTALS'?{type:'done'}:{type:'enter',portalId:p.portals[0]!.id},p.id);
    }
    assert.equal(s.phase,'RESULTS');
    assert.deepEqual(replayAppraisalAudit(exportAppraisalAudit(s)),s);
  }
});
