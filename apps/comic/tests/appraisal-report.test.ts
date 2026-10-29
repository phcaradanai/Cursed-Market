import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { analyseAppraisalMatchAudit } from '../src/playtest/appraisal-report.js';
import { analyseDownloadedAudits } from '../src/playtest/downloaded-reports.js';
import type { AppraisalMatchAudit } from '../src/shared/appraisal-protocol.js';
import type { AppraisalRoomView, AppraisalServerMessage } from '../src/shared/appraisal-protocol.js';
import { AppraisalRoomService } from '../src/server/appraisal-rooms.js';

const read=(n:number)=>JSON.parse(readFileSync(`docs/validation/appraisal-network-v0.4/network-${n}-players.json`,'utf8')) as AppraisalMatchAudit;
test('downloaded 2/3/4-player appraisal audits replay and produce version-specific evidence',()=>{
  const report=analyseDownloadedAudits([read(2),read(3),read(4)]);
  assert.equal(report.humanFunValidated,false);assert.equal(report.voluntaryRematchRate,null);
  for(const n of [2,3,4]) {const match=analyseAppraisalMatchAudit(read(n));assert.equal(match.playerCount,n);assert.equal(match.encounters,3);assert.equal(match.rulesVersion,'0.4-appraisers-experimental');assert.equal(match.phases.length,12);assert.equal(match.defaultChoices,0);assert.equal(match.players.length,n);}
});
test('appraisal report rejects forged run, roster, mode and missing room metadata',()=>{
  const run=read(2);run.run.final[0]!.score++;assert.throws(()=>analyseAppraisalMatchAudit(run),/audit/);
  const roster=read(2);roster.seats.reverse();assert.throws(()=>analyseAppraisalMatchAudit(roster),/roster/);
  assert.throws(()=>analyseAppraisalMatchAudit(read(2).run),/room audit/);
  const mode=read(2);Object.assign(mode,{playtestMode:'invented'});assert.throws(()=>analyseAppraisalMatchAudit(mode),/mode/);
});
test('appraisal timing/timeout metadata must match phases and safe default commands',()=>{
  const missing=read(2);missing.phaseTimes.pop();assert.throws(()=>analyseAppraisalMatchAudit(missing),/missing phase/);
  const duplicate=read(2);duplicate.phaseTimes.push(duplicate.phaseTimes[0]!);assert.throws(()=>analyseAppraisalMatchAudit(duplicate),/duplicate phase/);
  const order=read(2);order.phaseTimes[0]!.phase='TRADE';assert.throws(()=>analyseAppraisalMatchAudit(order),/phase order/);
  const time=read(2);time.phaseTimes[0]!.endedAt=time.startedAt-1;assert.throws(()=>analyseAppraisalMatchAudit(time),/timestamps/);
  const timeout=read(2);timeout.timeouts.push({encounter:1,phase:'PORTALS',playerId:timeout.seats[0]!.id,at:timeout.phaseTimes[0]!.endedAt});assert.throws(()=>analyseAppraisalMatchAudit(timeout),/safe default/);
});
test('deadline-driven audit with skipped empty appraisal phases validates recorded defaults',()=>{
  let now=100;const rooms=new AppraisalRoomService(()=>now,{PORTALS:1,APPRAISAL:1,TRADE:1,REVEAL:1},undefined,{});
  const received:AppraisalServerMessage[]=[];
  const host={send:(m:AppraisalServerMessage)=>received.push(m),close:()=>{}};
  const peer={send:(_m:AppraisalServerMessage)=>{},close:()=>{}};
  const room=()=>received.filter((m):m is Extract<AppraisalServerMessage,{type:'state'}>=>m.type==='state').at(-1)!.room as AppraisalRoomView;
  rooms.receive(host,{type:'create',name:'host'});rooms.receive(peer,{type:'join',name:'peer',roomCode:room().code});
  rooms.receive(host,{type:'ready',ready:true});rooms.receive(peer,{type:'ready',ready:true});rooms.receive(host,{type:'start'});
  for(let i=0;i<30 && room().game?.phase!=='RESULTS';i++){now+=10;rooms.tick();}
  assert.equal(room().game!.phase,'RESULTS');rooms.receive(host,{type:'audit',matchId:room().matchId});
  const audit=received.find((m):m is Extract<AppraisalServerMessage,{type:'audit'}>=>m.type==='audit')!.audit;
  const result=analyseAppraisalMatchAudit(audit);assert(result.defaultChoices>0);assert(result.phases.every(p=>p.phase!=='APPRAISAL'));
  assert(result.phases.length>=3);assert(result.players.every(p=>p.score===0));
});
test('mixed report rejects duplicate matches; CLI accepts room and raw run plus legacy audit',()=>{
  assert.throws(()=>analyseDownloadedAudits([read(2),read(2)]),/more than once/);
  assert.throws(()=>analyseDownloadedAudits([]),/at least one/);
  const paths=['docs/validation/appraisal-network-v0.4/network-2-players.json','docs/simulation/appraisal-v0.4/example-run.json','docs/simulation/engine-v0.1/example-match.json'];
  for(const file of paths) {const result=JSON.parse(execFileSync(process.execPath,['dist/src/simulation/replay.js',file],{encoding:'utf8'}));assert.equal(result.phase,'RESULTS');}
  const result=JSON.parse(execFileSync(process.execPath,['dist/src/playtest/run.js',paths[0]!],{encoding:'utf8'}));assert.equal(result.matches[0].rulesVersion,'0.4-appraisers-experimental');assert.equal(result.humanFunValidated,false);
  const directory=mkdtempSync(join(tmpdir(),'appraisal-cli-'));
  try {const invalid=read(2);invalid.phaseTimes.pop();const file=join(directory,'invalid.json');writeFileSync(file,JSON.stringify(invalid));assert.throws(()=>execFileSync(process.execPath,['dist/src/simulation/replay.js',file],{stdio:'pipe'}));}finally{rmSync(directory,{recursive:true,force:true});}
});
