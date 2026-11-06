import test from 'node:test';
import assert from 'node:assert/strict';
import {advanceAppraisalEncounter,applyAppraisalAction,createAppraisalRun,SURVIVAL_RULES} from '../src/game/appraisal/index.js';
import {collectRun} from '../src/game/appraisal/survival.js';

function fixture(revision=15){
  const state=createAppraisalRun(['alice','bob'],'testament',{catalogVersion:5,collectorDeadline:2,survival:SURVIVAL_RULES,secureEconomy:true,marketProbability:0,personalScoringRules:1,roundRewards:true,multiCoinRewards:false});
  Object.assign(state.config,{native56Effects:revision});
  const p=state.players[0]!;
  const prototype=Object.values(state.items)[0]!;
  state.items.testament={...prototype,id:'testament',kind:'darkone-null-testament',owner:p.id};
  state.items.asset={...prototype,id:'asset',kind:'mirror',owner:p.id,base:1000,genuine:true,cursed:false};
  p.inventory.push('testament','asset');
  state.phase='REVEAL';
  return advanceAppraisalEncounter(state);
}

test('E69 adds capped item-only value to ordinary assets at the Collector',()=>{
  const state=fixture();
  collectRun(state);
  const row=state.collector![0]!;
  assert.equal(row.assetBonus,20);
  assert.equal(row.personalScore!.groups[0]!.points,row.credits+row.itemValue+20);
  const old=fixture(14);
  collectRun(old);
  assert.equal(old.collector![0]!.assetBonus,undefined);
});

test('E69 permanently loses eligibility after an accepted vault deposit and withdrawal',()=>{
  let state=fixture();
  state.phase='REVEAL';
  state.players[0]!.roundReward={encounter:2,base:15,amount:15,flips:0,settled:true};
  for(const type of ['vault-deposit-item','vault-withdraw-item'] as const){
    state=applyAppraisalAction(state,{type,requestId:type,itemId:'testament',playerId:'alice',encounter:2});
  }
  assert.equal(state.items.testament!.owner,'alice');
  collectRun(state);
  assert.equal(state.collector![0]!.assetBonus,undefined);
});
