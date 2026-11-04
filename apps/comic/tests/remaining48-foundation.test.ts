import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {REMAINING48_ITEMS,REMAINING48_RULES,REMAINING48_SPEC_SHA} from '../src/game/appraisal/remaining48-catalog.js';
import {remainingStrength,remainingScaled,remainingDiscount,remainingFundedBonus} from '../src/game/appraisal/remaining48-numbers.js';
import type {PoweredItem} from '../src/shared/rarity-power.js';
const root=new URL('../../../',import.meta.url);
const specFile=new URL('docs/game-design/proposals/remaining48-experimental-v1.json',root);
// Compiled tests live under apps/comic/dist/tests rather than apps/comic/tests.
const repo=fs.existsSync(specFile)?root:new URL('../../../../',import.meta.url);
const read=(file:string)=>JSON.parse(fs.readFileSync(new URL(file,repo),'utf8'));
const tool=(kind:string,id:string,power=1,copy=false):PoweredItem&{kind:string;id:string;copy?:unknown}=>({kind,id,rarityPower:{version:1,valueMultiplier:power,effectMultiplier:power},...(copy?{copy:{}}:{})});

test('48 typed identities and35rule contracts exactly match the frozen approved package',()=>{
 const spec=read('docs/game-design/proposals/remaining48-experimental-v1.json'),approval=read('docs/game-design/remaining48-approval.json');
 const hash=crypto.createHash('sha256').update(fs.readFileSync(new URL(approval.proposal,repo))).digest('hex');
 assert.equal(approval.status,'approved-experimental');assert.equal(hash,approval.proposalSha256);assert.equal(hash,REMAINING48_SPEC_SHA);
 assert.equal(Object.keys(REMAINING48_ITEMS).length,48);assert.equal(Object.keys(REMAINING48_RULES).length,35);
 for(const item of spec.items){
  const actual=REMAINING48_ITEMS[item.id as keyof typeof REMAINING48_ITEMS];assert(actual);
  assert.equal(actual.name,item.name);assert.equal(actual.anchor,item.anchor);assert.equal(actual.merchant,item.merchantId);
  assert.equal(actual.family,item.type);assert.equal(actual.nativeEffect,`effect:${item.primaryEffect}`);
  assert.equal(actual.mode,spec.effectContracts[item.contract].mode);assert.equal(actual.cost,spec.effectContracts[item.contract].cost);
 }
 for(const [effect,rule]of Object.entries(spec.effectContracts) as Array<[keyof typeof REMAINING48_RULES,{parameters:object}]>)assert.deepEqual(REMAINING48_RULES[effect],rule.parameters);
 assert.deepEqual(Object.keys(REMAINING48_ITEMS),approval.approvedItemIds);
 for(const merchant of new Set(Object.values(REMAINING48_ITEMS).map(i=>i.merchant)))assert.equal(Object.values(REMAINING48_ITEMS).filter(i=>i.merchant===merchant).length,6);
});

test('held strength selects the strongest5 across one effect family without mutating caller order',()=>{
 const items=[tool('orc-ironroot-greaves','a'),tool('autometa-servo-harness','b',8),tool('alien-biobright-seedpod','c',4),tool('orc-ironroot-greaves','d',6),tool('alien-biobright-seedpod','e',3),tool('autometa-servo-harness','f',2),tool('autometa-coil-repeater','other',8)];
 const before=structuredClone(items);assert.equal(remainingStrength(items,'E61'),23);assert.deepEqual(items,before);
 assert.equal(remainingStrength([...items].reverse(),'E61'),23);assert.equal(remainingStrength([], 'E61'),0);
});

test('binary rights never pool fractional common copies into one entitlement',()=>{
 const copies=[tool('vampire-mooncut-sword','a',1,true),tool('vampire-mooncut-sword','b',1,true),tool('vampire-mooncut-sword','c',1,true)];
 assert.equal(remainingStrength(copies,'E38'),.4);
 assert(Math.abs(remainingStrength([...copies,tool('vampire-mooncut-sword','d',3,true)],'E38')-1.2)<1e-12);
 assert.equal(remainingStrength([tool('unregistered-kind','wrong',8)],'E38'),0);
});

test('active and consumable callers must select one instance rather than summing a family',()=>{
 assert.throws(()=>remainingStrength([tool('autometa-folding-beacon','a'),tool('deepsea-lanternfish-cage','b')],'E35'),/selected instance/);
 assert.throws(()=>remainingStrength([tool('darkone-null-sword','a'),tool('darkone-silence-snuffer','b')],'E71'),/selected instance/);
 assert(Math.abs(remainingStrength([tool('autometa-folding-beacon','a',3,true)],'E35')-1.2)<1e-12);
 assert.equal(remainingStrength([tool('darkone-null-sword','a',1,true)],'E71'),.4);
});

for(const rarity of [1,2,3,4,6,8])for(const copy of [false,true])test(`rarity${rarity}/copy${copy}: integer and basis point scaling stay capped`,()=>{
 const s=rarity*(copy?.4:1);
 assert.equal(remainingStrength([tool('orc-ironroot-greaves','a',rarity,copy)],'E61'),s);
 assert.equal(remainingScaled(1,s,2),Math.min(2,Math.floor(s+1e-9)));
 assert.equal(remainingScaled(500,s,1500),Math.min(1500,Math.floor(500*s+1e-9)));
 const rate=remainingScaled(REMAINING48_RULES.E05.bonusBps,s,REMAINING48_RULES.E05.familyCapBps);
 assert(rate<=1500);assert.equal(remainingDiscount(3,1,s,2,1),Math.max(1,3-Math.min(2,Math.floor(s+1e-9))));
});

test('discounts cannot create free infinite actions or charge a previously free action',()=>{
 assert.equal(remainingDiscount(1,1,8,2,1),1);assert.equal(remainingDiscount(0,1,8,2,1),0);
 assert.equal(remainingDiscount(5,1,.4,2,1),5);assert.equal(remainingDiscount(8,1,8,2,1),6);
 assert.equal(remainingScaled(5,.6,10),3);assert.equal(remainingScaled(1,0,2),0);
});

test('bank-funded bonus cannot mint, overdraw reservations or accept noninteger credit quotes',()=>{
 assert.equal(remainingFundedBonus(4,2),2);assert.equal(remainingFundedBonus(4,0),0);assert.equal(remainingFundedBonus(4,-5),0);
 assert.equal(remainingFundedBonus(0,100),0);assert.equal(remainingFundedBonus(4,100),4);
 for(const bad of [NaN,Infinity,.4,Number.MAX_SAFE_INTEGER+1]){
  assert.throws(()=>remainingFundedBonus(bad,10),/integer/);assert.throws(()=>remainingFundedBonus(4,bad),/integer/);
 }
 assert.throws(()=>remainingFundedBonus(-1,10),/nonnegative/);
});
