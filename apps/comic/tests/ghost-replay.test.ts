import test from 'node:test';
import assert from 'node:assert/strict';
import {createAppraisalRun,applyAppraisalAction,advanceAppraisalEncounter} from '../src/game/appraisal/engine.js';
import {appraisalViewFor} from '../src/game/appraisal/views.js';
import {exportAppraisalAudit,replayAppraisalAudit} from '../src/game/appraisal/audit.js';
import {appraisalBotDecision} from '../src/simulation/appraisal.js';
import {randomAt} from '../src/game/random.js';
import type {AppraisalAction} from '../src/game/appraisal/types.js';
type Body=AppraisalAction extends infer A?A extends AppraisalAction?Omit<A,'playerId'|'requestId'|'encounter'>:never:never;
test('command-only death, card unlock, agreed job, RPS search, delivery and Collector strictly replay',()=>{
 let s=createAppraisalRun(['alice','bob'],'ghost-replay-0',{survival:{maxLife:6,encounterLifeCost:1,entryEnergyCost:0},startingCredits:200,marketProbability:0,collectorDeadline:15}),seq=0;
 const act=(id:string,body:Body)=>{s=applyAppraisalAction(s,{...body,playerId:id,requestId:`replay-ghost-${seq++}`,encounter:s.encounter});};
 for(let step=0;step<200&&!s.players.some(p=>p.life===0);step++){
  if(s.phase==='REVEAL'){s=advanceAppraisalEncounter(s);continue;}
  const p=s.players.find(p=>!p.done&&!p.paused)!;
  act(p.id,p.id==='alice'?{type:'done'}:appraisalBotDecision(appraisalViewFor(s,p.id),'cautious'));
 }
 assert.equal(s.players[0]!.life,0);assert(s.players[1]!.life!>0);
 act('alice',{type:'ghost-start'});let ghost=s.ghosts!.alice!;
 act('alice',{type:'ghost-guess',round:ghost.round,position:ghost.tracking!.answer});
 let choice=-1;
 for(let step=0;step<20&&s.phase!=='RESULTS';step++){
  if(s.phase==='REVEAL'&&s.players[1]!.roundReward&&!s.players[1]!.roundReward!.settled)act('bob',{type:'round-bank'});
  choice=appraisalViewFor(s,'bob').ghosts!.services[0]!.quotes.findIndex(q=>q.price<=s.players[1]!.credits);if(choice>=0)break;
  if(s.phase==='REVEAL')s=advanceAppraisalEncounter(s);else act('bob',{type:'done'});
 }
 assert(choice>=0,'salary must fund a service quote in this deterministic run');
 act('bob',{type:'ghost-hire',ghostId:'alice',choice,quoteId:appraisalViewFor(s,'bob').ghosts!.services[0]!.quotes[choice]!.id,fee:0});const job=s.ghosts!.alice!.jobs[0]!;
 act('alice',{type:'ghost-accept',jobId:job.id,accept:true});
 // Test oracle selects a winning hand against the seeded opponent; all item draws remain actual commands, never injected stock.
 for(let step=0;step<1000&&!s.ghosts!.alice!.slots.some(slot=>slot.kind===job.kind);step++){
  ghost=s.ghosts!.alice!;const opponent=Math.floor(randomAt(s.seed,`ghost:alice:${ghost.round}:${ghost.draws}`)*3),hand=(['rock','paper','scissors'] as const)[(opponent+1)%3]!;
  act('alice',{type:'ghost-rps',slot:0,hand});
 }
 const slot=s.ghosts!.alice!.slots.findIndex(slot=>slot.kind===job.kind);assert(slot>=0);
 act('alice',{type:'ghost-deliver',jobId:job.id,slot});assert(s.ghosts!.alice!.bonus>0);
 for(let step=0;step<100&&s.phase!=='RESULTS';step++){
  if(s.phase==='REVEAL')s=advanceAppraisalEncounter(s);else {const p=s.players.find(p=>!p.done&&!p.paused)!;act(p.id,{type:'done'});}
 }
 assert.equal(s.phase,'RESULTS');assert.deepEqual(replayAppraisalAudit(exportAppraisalAudit(s)),s);
});
