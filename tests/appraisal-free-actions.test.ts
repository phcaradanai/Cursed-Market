import test from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createAppraisalRun,applyAppraisalAction,advanceAppraisalEncounter,appraisalViewFor,exportAppraisalAudit,replayAppraisalAudit,SURVIVAL_RULES} from '../src/game/appraisal/index.js';
import {grant} from '../src/game/appraisal/mechanics.js';
import {AppraisalDesk,Inspect} from '../src/appraisal-client/components.js';
import {appraisalCost,inspectionCost,inspectionBlock} from '../src/appraisal-client/model.js';
import type {AppraisalAction,AppraisalState} from '../src/game/appraisal/types.js';

type Body=AppraisalAction extends infer A?A extends AppraisalAction?Omit<A,'playerId'|'requestId'|'encounter'>:never:never;
let request=0;
const act=(s:AppraisalState,body:Body,id='alice')=>applyAppraisalAction(s,{...body,playerId:id,requestId:`free-${++request}`,encounter:s.encounter} as AppraisalAction);
function fixture(freeMerchantAction=true):AppraisalState {
  let s=createAppraisalRun(['alice','bob'],'free-merchant-actions',{survival:SURVIVAL_RULES,freeMerchantAction,marketProbability:0});
  for(const p of s.players){p.eventOffer=null;p.offerSlots=2;p.energy=0;}
  for(const p of s.players)s=act(s,{type:'enter',portalId:p.portals[0]!.id},p.id);
  return s;
}

test('encounters begin without energy loss, including advancement',()=>{
  let s=createAppraisalRun(['alice','bob'],'free-start',{survival:SURVIVAL_RULES});
  assert(s.players.every(p=>p.energy===s.config.maxEnergy));
  s.phase='REVEAL';s.players[0]!.energy=4;
  s=advanceAppraisalEncounter(s);assert.equal(s.players[0]!.energy,4);
});

for(const property of ['price','authenticity','effects'] as const)test(`free ${property} inspection spends the item's shared right, not energy or quota`,()=>{
  let s=fixture();const id=s.players[0]!.stock[0]!;
  grant(s,s.players[0]!,'D01');grant(s,s.players[0]!,'B11');
  s.players[0]!.inspections=2;
  let v=appraisalViewFor(s,'alice');assert.equal(inspectionCost(v,property,v.self.stock[0]),0);assert.equal(inspectionBlock(v,false,v.self.stock[0]),null);
  s=act(s,{type:'inspect',itemId:id,property});
  assert.equal(s.players[0]!.energy,0);assert.equal(s.players[0]!.inspections,2);
  assert(s.players[0]!.statuses.some(x=>x.id==='D01'));assert(s.players[0]!.statuses.some(x=>x.id==='B11'));
  v=appraisalViewFor(s,'alice');assert.equal(v.self.stock[0]!.freeMerchantAction,false);assert.equal(appraisalCost(v.self.stock[0]!),1);
  const before=structuredClone(s);assert.throws(()=>act(s,{type:'appraise',itemId:id,value:s.items[id]!.base,acceptDanger:true}));assert.deepEqual(s,before);
  const other=s.players[0]!.stock[1]!;s=act(s,{type:'appraise',itemId:other,value:s.items[other]!.base,acceptDanger:true});assert.equal(s.players[0]!.energy,0);
});

test('appraisal first is free, further inspection and counter both cost energy',()=>{
  let s=fixture();const id=s.players[0]!.stock[0]!;
  s=act(s,{type:'appraise',itemId:id,value:s.items[id]!.base,acceptDanger:true});assert.equal(s.players[0]!.energy,0);
  assert.throws(()=>act(s,{type:'inspect',itemId:id,property:'authenticity'}));
  assert.throws(()=>act(s,{type:'counter',itemId:id,value:s.items[id]!.base,acceptDanger:true}));
  s.players[0]!.energy=2;s=act(s,{type:'inspect',itemId:id,property:'authenticity'});assert.equal(s.players[0]!.energy,1);
  s=act(s,{type:'counter',itemId:id,value:s.items[id]!.base,acceptDanger:true});assert.equal(s.players[0]!.energy,0);
});

test('rejected actions do not spend the free right, and retries cannot grant it twice',()=>{
  let s=fixture();const id=s.players[0]!.stock[0]!;
  const before=structuredClone(s);assert.throws(()=>act(s,{type:'appraise',itemId:id,value:-1,acceptDanger:true}));assert.deepEqual(s,before);
  const command={type:'inspect',itemId:id,property:'authenticity',playerId:'alice',requestId:'free-retry',encounter:s.encounter} as const;
  s=applyAppraisalAction(s,command);assert.equal(applyAppraisalAction(s,command),s);
  assert.deepEqual(s.players[0]!.merchantActionsUsed,[id]);
});

test('classic players at zero energy retain access to every remaining free merchant action',()=>{
  let s=createAppraisalRun(['alice','bob'],'classic-free',{marketProbability:0});
  for(const p of s.players){p.energy=0;p.eventOffer=null;p.offerSlots=2;}
  for(const p of s.players)s=act(s,{type:'enter',portalId:p.portals[0]!.id},p.id);
  const ids=[...s.players[0]!.stock];
  s=act(s,{type:'inspect',itemId:ids[0]!,property:'authenticity'});assert.equal(s.players[0]!.paused,null);
  s=act(s,{type:'inspect',itemId:ids[1]!,property:'authenticity'});assert.equal(s.players[0]!.merchantActionsUsed!.length,2);
});

test('each item has its own right even beyond the normal inspection quota; owned goods have none',()=>{
  let s=fixture();const p=s.players[0]!;
  const extra={...s.items[p.stock[0]!]!,id:'extra-stock'};s.items[extra.id]=extra;p.stock.push(extra.id);
  for(const itemId of [...p.stock])s=act(s,{type:'inspect',itemId,property:'authenticity'});
  assert.equal(s.players[0]!.merchantActionsUsed!.length,3);assert.equal(s.players[0]!.inspections,0);
  s.items[extra.id]!.owner='alice';s.players[0]!.stock=s.players[0]!.stock.filter(id=>id!==extra.id);s.players[0]!.inventory.push(extra.id);
  assert.equal(appraisalViewFor(s,'alice').self.inventory[0]!.freeMerchantAction,false);
  s.phase='REVEAL';s=advanceAppraisalEncounter(s);assert.equal(s.players[0]!.merchantActionsUsed,undefined);
});

test('zero-energy UI enables free actions and marks them free',()=>{
  const v=appraisalViewFor(fixture(),'alice'),item=v.self.stock[0]!;
  const inspect=renderToStaticMarkup(createElement(Inspect,{game:v,item,submit:()=>{},disabled:false}));
  assert.doesNotMatch(inspect,/disabled=""/);assert.match(inspect,/ฟรี/);
  const desk=renderToStaticMarkup(createElement(AppraisalDesk,{game:v,item,submit:()=>{},disabled:false}));
  assert.match(desk,/สินค้าชิ้นนี้ตรวจสอบหรือประเมินฟรี 1 ครั้ง/);
  assert.match(desk,/<button class="primary appraise"[^>]*>(?:(?!<\/button>)[\s\S])*ฟรี<\/button>/);
  assert.doesNotMatch(desk,/<button class="primary appraise"[^>]*disabled/);
});

test('legacy configuration retains paid actions and new rules replay exactly',()=>{
  const old=fixture(false);assert.throws(()=>act(old,{type:'inspect',itemId:old.players[0]!.stock[0]!,property:'authenticity'}));
  let s=createAppraisalRun(['alice','bob'],'free-replay',{survival:SURVIVAL_RULES,marketProbability:0});
  for(const id of ['alice','bob']){
    while(s.players.find(p=>p.id===id)!.eventOffer)s=act(s,{type:'done'},id);
    const p=s.players.find(p=>p.id===id)!;if(!p.done)s=act(s,{type:'enter',portalId:p.portals[0]!.id},id);
  }
  if(s.phase==='APPRAISAL' && s.players[0]!.stock.length){const id=s.players[0]!.stock[0]!;s=act(s,{type:'inspect',itemId:id,property:'authenticity'});}
  for(let guard=0;guard<100 && s.phase!=='RESULTS';guard++){
    if(s.phase==='REVEAL'){s=advanceAppraisalEncounter(s);continue;}
    const p=s.players.find(p=>!p.done&&!p.paused);assert(p);s=act(s,{type:'done'},p.id);
  }
  assert.equal(s.phase,'RESULTS');
  assert.deepEqual(replayAppraisalAudit(exportAppraisalAudit(s)),s);
});
