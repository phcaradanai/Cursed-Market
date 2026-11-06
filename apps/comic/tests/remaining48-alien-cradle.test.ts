import test from 'node:test';
import assert from 'node:assert/strict';
import { applyAppraisalAction, assertAppraisalInvariants, SURVIVAL_RULES } from '../src/game/appraisal/index.js';
import { offerEvent } from '../src/game/appraisal/events.js';
import { retire, reward } from '../src/game/appraisal/mechanics.js';
import { closeNpcContracts, redeemNpcContracts } from '../src/game/appraisal/npc-events.js';
import { remainingStrength } from '../src/game/appraisal/remaining48-numbers.js';
import type { AppraisalAction, AppraisalState, Appraiser } from '../src/game/appraisal/types.js';
import { appraisalFixture } from './support/appraisal-fixture.js';

let request=0;
const withRevision=(state:AppraisalState,revision:number)=>{(state.config as unknown as {native56Effects:number}).native56Effects=revision;};
function setup({revision=14,catalogVersion=5,cradles=1,bankBonus=5000,seed}:{revision?:number;catalogVersion?:number;cradles?:number;bankBonus?:number;seed?:string}={}):AppraisalState {
  const state=appraisalFixture('E18',2),p=state.players[0]!;
  state.seed=seed??`alien-cradle-${++request}`;state.phase='APPRAISAL';state.version=5;state.config.catalogVersion=catalogVersion as 5;state.config.npcEvents=true;state.config.survival=SURVIVAL_RULES;withRevision(state,revision);
  for(const seat of state.players){seat.life=6;seat.paused=null;seat.done=false;seat.selectedPortalId=seat.portals[0]!.id;seat.portals[0]!.npc='alien';for(const id of seat.stock)state.items[id]!.npc='alien';}
  for(let index=0;index<cradles;index++){
    const id=`cradle-${index+1}`;
    state.items[id]={id,kind:'swarm-pupa-cradle',base:20,genuine:true,cursed:false,ask:20,owner:p.id,npcOwnerId:p.id,npc:'swarm',encounter:1,certificate:true,lastAppraisal:null,reservation:1,lastAccepted:null};
    p.inventory.push(id);
  }
  if(bankBonus){state.bank+=bankBonus;state.config.bankReserve+=bankBonus;}
  offerEvent(state,p,'E110');
  assertAppraisalInvariants(state);
  return state;
}
function setupWithLoanMax(count:number,overrides:Parameters<typeof setup>[0]={}):AppraisalState {
  for(let index=0;index<100;index++){
    const state=setup({...overrides,seed:`alien-cradle-loan-${count}-${index}`});
    if((state.players[0]!.eventOffer?.npcTerms?.loanMax??0)>=count)return state;
  }
  throw new Error(`could not seed an Alien offer with loanMax >= ${count}`);
}
function sign(state:AppraisalState,count:number,selected?:string[]):{state:AppraisalState;action:AppraisalAction;ids:string[]} {
  const p=state.players[0]!,offer=p.eventOffer!;
  const ids=selected??offer.itemIds.filter(id=>state.items[id]?.kind!=='swarm-pupa-cradle').slice(0,count);
  const action:AppraisalAction={type:'event',playerId:p.id,requestId:`cradle-sign-${++request}`,encounter:state.encounter,key:offer.key,choice:`lend-${count}`,itemIds:ids};
  return {state:applyAppraisalAction(state,action),action,ids};
}
function addPaidE59(state:AppraisalState,p:Appraiser,contractKey:string,credits:number,returnedCount:number,strength:number,itemId:string):void {
  reward(state,p,credits,'alien-cradle-bonus');
  state.trace.push({type:'alien-cradle-bonus',encounter:state.encounter,playerId:p.id,details:{contractKey,credits,returnedCount,strength,sourceItemIds:[itemId]}});
}

test('E59 reserves and pays the exact per-contract formula after the due Alien returns originals; both settlement paths are idempotent',()=>{
  const state=setupWithLoanMax(3,{cradles:2}),p=state.players[0]!,reserved=state.reservedRewards;
  const signed=sign(state,3),loan=signed.state.players[0]!.npcContracts!.alien!;
  assert.equal(loan.reservedCredits,24);assert.equal(loan.native56SwarmPupaCradleStrength,2);assert.equal(loan.native56SwarmPupaCradleReservedCredits,3);
  assert.deepEqual(loan.native56SwarmPupaCradleItemIds,['cradle-1','cradle-2']);assert.equal(signed.state.reservedRewards,reserved+27);
  assertAppraisalInvariants(signed.state);
  assert.strictEqual(applyAppraisalAction(signed.state,signed.action),signed.state,'replaying the accepted loan command must not reserve twice');
  signed.state.encounter=loan.dueAt;
  const before=p.credits;
  redeemNpcContracts(signed.state,signed.state.players[0]!,'orc');assert(signed.state.players[0]!.npcContracts!.alien,'a non-Alien encounter must not settle the contract');
  redeemNpcContracts(signed.state,signed.state.players[0]!,'alien');
  const settled=signed.state.players[0]!,alienPaid=signed.state.trace.find(entry=>entry.type==='alien-repaid')!.details.credits as number;
  assert.equal(settled.credits-before,alienPaid+3);assert.equal(alienPaid%3,0);assert.equal(signed.state.trace.find(entry=>entry.type==='alien-cradle-bonus')!.details.credits,3);
  assert.equal(signed.state.reservedRewards,reserved);assert(!settled.npcContracts?.alien);assertAppraisalInvariants(signed.state);
  const once=structuredClone(signed.state);redeemNpcContracts(signed.state,settled,'alien');assert.deepEqual(signed.state,once,'repeating redemption must not pay the contract twice');
});

test('E59 follows rarity and copy scaling, rounds strength down only at the approved payout formula, and respects the run cap',()=>{
  const powered=[
    {id:'common',kind:'swarm-pupa-cradle',rarityPower:{version:1 as const,valueMultiplier:1,effectMultiplier:1}},
    {id:'epic',kind:'swarm-pupa-cradle',rarityPower:{version:1 as const,valueMultiplier:4,effectMultiplier:4}},
    {id:'copy',kind:'swarm-pupa-cradle',rarityPower:{version:1 as const,valueMultiplier:8,effectMultiplier:8},copy:{sourceId:'original',number:1,valuePercent:30}},
  ];
  const strength=remainingStrength(powered,'E59');assert.equal(strength,8.2);assert.equal(Math.min(3,Math.floor(strength)*1,6),3);
  const state=setupWithLoanMax(2,{cradles:1}),p=state.players[0]!;addPaidE59(state,p,'prior-contract-1',3,3,1,'cradle-1');addPaidE59(state,p,'prior-contract-2',2,2,1,'cradle-1');
  const signed=sign(state,2),loan=signed.state.players[0]!.npcContracts!.alien!;assert.equal(loan.native56SwarmPupaCradleReservedCredits,1);
  signed.state.encounter=loan.dueAt;redeemNpcContracts(signed.state,signed.state.players[0]!,'alien');
  assert.equal(signed.state.trace.findLast(entry=>entry.type==='alien-cradle-bonus')!.details.credits,1);assertAppraisalInvariants(signed.state);
});

test('E59 requires the same cradle to stay in hand; a cradle lent to Alien or obtained after signing cannot qualify',()=>{
  const lost=setup({cradles:1}),holder=lost.players[0]!,cradle='cradle-1',signed=sign(lost,1),loan=signed.state.players[0]!.npcContracts!.alien!;
  retire(signed.state,signed.state.players[0]!,cradle,'custody-test');signed.state.items[cradle]!.owner=holder.id;signed.state.players[0]!.inventory.push(cradle);
  signed.state.encounter=loan.dueAt;redeemNpcContracts(signed.state,signed.state.players[0]!,'alien');
  assert(!signed.state.trace.some(entry=>entry.type==='alien-cradle-bonus'));assert.equal(signed.state.reservedRewards,0);assertAppraisalInvariants(signed.state);

  const lentCradle=setup({cradles:1}),cradleId='cradle-1',loaned=sign(lentCradle,1,[cradleId]),loanContract=loaned.state.players[0]!.npcContracts!.alien!;
  assert.deepEqual(loanContract.native56SwarmPupaCradleItemIds,[]);assert.equal(loanContract.native56SwarmPupaCradleReservedCredits,0);
  loaned.state.encounter=loanContract.dueAt;redeemNpcContracts(loaned.state,loaned.state.players[0]!,'alien');assert(!loaned.state.trace.some(entry=>entry.type==='alien-cradle-bonus'));assertAppraisalInvariants(loaned.state);

  const acquired=setup({cradles:0}),signedWithout=sign(acquired,1),later='late-cradle';
  signedWithout.state.items[later]={id:later,kind:'swarm-pupa-cradle',base:20,genuine:true,cursed:false,ask:20,owner:'alice',npcOwnerId:'alice',npc:'swarm',encounter:1,certificate:true,lastAppraisal:null,reservation:1,lastAccepted:null};
  signedWithout.state.players[0]!.inventory.push(later);const acquiredLoan=signedWithout.state.players[0]!.npcContracts!.alien!;
  signedWithout.state.encounter=acquiredLoan.dueAt;redeemNpcContracts(signedWithout.state,signedWithout.state.players[0]!,'alien');assert(!signedWithout.state.trace.some(entry=>entry.type==='alien-cradle-bonus'));assertAppraisalInvariants(signedWithout.state);
});

test('E59 never pays without its whole reserve and releases unused escrow on Collector close for a dead player',()=>{
  const short=setup({cradles:1,bankBonus:0}),p=short.players[0]!,offer=p.eventOffer!,base=8,reserve=1;
  const target=short.market.budget+short.reservedRewards+base;
  short.config.bankReserve+=target-short.bank;short.bank=target;
  const ids=offer.itemIds.filter(id=>short.items[id]?.kind!=='swarm-pupa-cradle').slice(0,1),action:AppraisalAction={type:'event',playerId:p.id,requestId:`cradle-short-${++request}`,encounter:short.encounter,key:offer.key,choice:'lend-1',itemIds:ids},before=structuredClone(short);
  assert.equal(short.bank-short.market.budget-short.reservedRewards,base);assert.equal(reserve,1);assert.throws(()=>applyAppraisalAction(short,action));assert.deepEqual(short,before);

  const dead=setup({cradles:1}),signed=sign(dead,1),contract=signed.state.players[0]!.npcContracts!.alien!;
  signed.state.players[0]!.life=0;signed.state.players[0]!.paused='dead';closeNpcContracts(signed.state);
  assert.equal(signed.state.reservedRewards,0);assert(!signed.state.players[0]!.npcContracts?.alien);assert(!signed.state.trace.some(entry=>entry.type==='alien-cradle-bonus'));assert(signed.state.players[0]!.inventory.some(id=>id===contract.itemIds[0]));assertAppraisalInvariants(signed.state);
});

test('E59 is gated at catalog 5 and native56Effects 14, while legacy Alien reserve stays base-only',()=>{
  for(const gate of [{revision:13,catalogVersion:5},{revision:14,catalogVersion:4}]){
    const state=setup({...gate,cradles:1}),baseReserve=state.reservedRewards,signed=sign(state,1),contract=signed.state.players[0]!.npcContracts!.alien!;
    assert.equal(contract.reservedCredits,8);assert.equal(contract.native56SwarmPupaCradleReservedCredits,undefined);assert.equal(signed.state.reservedRewards,baseReserve+8);assertAppraisalInvariants(signed.state);
    signed.state.encounter=contract.dueAt;redeemNpcContracts(signed.state,signed.state.players[0]!,'alien');assert(!signed.state.trace.some(entry=>entry.type==='alien-cradle-bonus'));assertAppraisalInvariants(signed.state);
  }
});
