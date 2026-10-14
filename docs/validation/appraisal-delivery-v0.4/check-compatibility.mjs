import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { advanceAuction, applyAction, assertEconomy, createGame, replayEvents, scores, winnerIds } from '../../../dist/src/game/index.js';
import { RoomService } from '../../../dist/src/server/rooms.js';
const dir='docs/validation/appraisal-delivery-v0.4/compatibility';mkdirSync(dir,{recursive:true});
const checks=[];const reports=[];
for(const version of ['0.1','0.2','0.3']) {
  const config=version==='0.1'?{}:version==='0.2'?{curseWagers:true,fastMarket:true}:{curseWagers:true,fastMarket:true,rogueRun:true};
  let state=createGame(['a','b','c'],`delivery-legacy-${version}`,config),sequence=0;
  const act=body=>{state=applyAction(state,{...body,requestId:`compat-${++sequence}`,auctionNumber:state.auction.number});assertEconomy(state);};
  while(state.phase!=='RESULTS') {
    if(state.phase==='ROUTE_CHOICE')for(const p of state.players)act({type:'vote-route',playerId:p.id,nodeId:state.run.routeChoices[0].id});
    else if(state.phase==='BOON_CHOICE')for(const p of state.players)act({type:'choose-boon',playerId:p.id,boonId:null});
    else if(state.phase==='SELLER_PREP') {
      const seller=state.auction.sellerId;act({type:'offer',playerId:seller,relicId:state.auction.candidates[0].id,mode:'as-is'});
      const buyers=state.players.filter(p=>p.id!==seller);
      if(state.phase==='BUYER_INSPECTION')for(const p of buyers)act({type:'pass-inspection',playerId:p.id});
      for(const p of buyers){const stake=version==='0.1'?0:Math.min(1,p.coins);act({type:'bid',playerId:p.id,amount:Math.min(1,p.coins-stake),...(stake?{wager:{cursed:true,stake}}:{})});}
    } else {assert.equal(state.phase,'REVEAL');state=advanceAuction(state);}
  }
  assert.deepEqual(replayEvents(state.events),state);
  const path=`${dir}/legacy-${version}-raw.json`;writeFileSync(path,JSON.stringify({evidenceKind:'synthetic-compatibility-fixture',events:state.events,scores:scores(state),winnerIds:winnerIds(state)},null,2)+'\n');
  const rawOutput=JSON.parse(execFileSync(process.execPath,['dist/src/simulation/replay.js',path],{encoding:'utf8'}));assert.equal(rawOutput.phase,'RESULTS');checks.push({version,kind:'raw',path,phase:rawOutput.phase});
  let now=1000;class FixtureRooms extends RoomService {createGame(ids,seed){return createGame(ids,seed,config);}}
  const rooms=new FixtureRooms(()=>now,{SELLER_PREP:10,BUYER_INSPECTION:10,SEALED_BID:10,REVEAL:10,ROUTE_CHOICE:10,BOON_CHOICE:10});
  const peers=Array.from({length:3},()=>({messages:[],send(m){this.messages.push(m);},close(){}}));const host=peers[0];const view=p=>p.messages.findLast(m=>m.type==='state')?.room;
  rooms.receive(host,{type:'create',name:'Synthetic compatibility'});const code=view(host).code;
  for(const p of peers.slice(1))rooms.receive(p,{type:'join',name:'Synthetic fixture',roomCode:code});
  for(const p of peers)rooms.receive(p,{type:'ready',ready:true});rooms.receive(host,{type:'start'});
  for(let i=0;view(host).game.phase!=='RESULTS' && i<100;i++){now+=11;rooms.tick();}
  assert.equal(view(host).game.phase,'RESULTS');rooms.receive(host,{type:'audit',matchId:view(host).matchId});const audit=host.messages.findLast(m=>m.type==='audit').audit;
  const roomPath=`${dir}/legacy-${version}-room.json`;writeFileSync(roomPath,JSON.stringify(audit,null,2)+'\n');reports.push(roomPath);
  const output=JSON.parse(execFileSync(process.execPath,['dist/src/simulation/replay.js',roomPath],{encoding:'utf8'}));assert.equal(output.phase,'RESULTS');checks.push({version,kind:'room',path:roomPath,phase:output.phase});
}
for(const path of ['docs/simulation/engine-v0.1/example-match.json','docs/simulation/appraisal-delivery-v0.4/example-run.json','docs/validation/appraisal-delivery-v0.4/network/lan-4-players.json']) {
  const output=JSON.parse(execFileSync(process.execPath,['dist/src/simulation/replay.js',path],{encoding:'utf8'}));assert.equal(output.phase,'RESULTS');checks.push({kind:'existing/raw-v4/room-v4',path,phase:output.phase});
}
reports.push(...[2,3,4].map(n=>`docs/validation/appraisal-delivery-v0.4/network/network-${n}-players.json`),...[2,3,4].map(n=>`docs/validation/appraisal-delivery-v0.4/network/lan-${n}-players.json`));
const reportOutput=execFileSync(process.execPath,['dist/src/playtest/run.js',...reports],{encoding:'utf8'});const report=JSON.parse(reportOutput);assert.equal(report.matches.length,9);assert.equal(report.humanFunValidated,false);assert.equal(report.voluntaryRematchRate,null);
writeFileSync('docs/validation/appraisal-delivery-v0.4/audit-report.json',reportOutput);
writeFileSync('docs/validation/appraisal-delivery-v0.4/compatibility-check.json',JSON.stringify({checkedAt:new Date().toISOString(),evidenceKind:'synthetic-only',replayChecks:checks,reportChecks:reports.length,humanFunValidated:false},null,2)+'\n');
console.log(`${checks.length} replay CLI checks passed; 9 mixed legacy/v4 downloaded reports passed; no baseline overwritten`);
