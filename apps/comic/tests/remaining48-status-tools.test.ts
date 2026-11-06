import test from 'node:test';
import assert from 'node:assert/strict';
import {createAppraisalRun,SURVIVAL_RULES} from '../src/game/appraisal/index.js';
import {activate,grant,status} from '../src/game/appraisal/mechanics.js';
import type {AppraisalItem,StatusId} from '../src/game/appraisal/types.js';

function fixture(revision=15){
  const state=createAppraisalRun(['alice','bob'],'status-tools',{catalogVersion:5,survival:SURVIVAL_RULES,marketProbability:0,itemEffects:true});
  Object.assign(state.config,{native56Effects:revision});
  const p=state.players[0]!;
  const template=Object.values(state.items)[0]!;
  const give=(kind:AppraisalItem['kind'])=>{
    const id='tool-'+Object.keys(state.items).length;
    state.items[id]={...template,id,kind,owner:p.id,genuine:true,cursed:false};
    p.inventory.push(id);
    return id;
  };
  const use=(id:string,target:StatusId)=>activate(state,p,id,undefined,undefined,target);
  return {state,p,give,use};
}

test('E71 validates target before cost, shares cap across consumables and removes only selected status',()=>{
  const {state,p,give,use}=fixture();
  for(const id of ['D01','D05','D06','D10'] as const)grant(state,p,id);
  const sword=give('darkone-null-sword'),snuffer=give('darkone-silence-snuffer'),third=give('darkone-null-sword');
  const energy=p.energy;
  assert.throws(()=>use(sword,'D10'));
  assert.equal(p.energy,energy);
  use(sword,'D05');
  assert.equal(status(p,'D05'),undefined);
  assert.ok(status(p,'D01'));
  assert.equal(state.items[sword]!.owner,'removed');
  use(snuffer,'D01');
  assert.equal(p.energy,energy-2);
  assert.throws(()=>use(third,'D06'));
  assert.equal(state.items[third]!.owner,p.id);
  assert.ok(status(p,'D10'));
});

test('E72 preserves charges and magnitude, blocks copied instance after extension, and rejects prior revision',()=>{
  const {state,p,give,use}=fixture();
  grant(state,p,'B11',undefined,2);
  const first=status(p,'B11')!,copied=structuredClone(first),expiry=first.expires;
  const shawl=give('alien-echoweave-shawl');
  use(shawl,'B11');
  assert.equal(first.expires,expiry+1);
  assert.equal(first.charges,copied.charges);
  assert.equal(first.power,copied.power);
  assert.equal(first.extendedByShawl,true);
  grant(state,p,'B11');
  assert.equal(first.instanceId,copied.instanceId);
  state.encounter++;
  p.statuses=[copied];
  assert.throws(()=>use(give('alien-echoweave-shawl'),'B11'));
  const legacy=fixture(14);
  grant(legacy.state,legacy.p,'B11');
  assert.throws(()=>legacy.use(legacy.give('alien-echoweave-shawl'),'B11'));
});
