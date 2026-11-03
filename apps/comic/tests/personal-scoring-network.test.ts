import test from 'node:test';
import assert from 'node:assert/strict';
import {once} from 'node:events';
import {writeFileSync} from 'node:fs';
import path from 'node:path';
import type {AddressInfo} from 'node:net';
import {WebSocket} from 'ws';
import {createApp} from '../src/server/app.js';
import {AppraisalRoomService} from '../src/server/appraisal-rooms.js';
import {parseAppraisalMessage} from '../src/server/appraisal-messages.js';
import {createAppraisalRun} from '../src/game/appraisal/engine.js';
import {exportAppraisalAudit,replayAppraisalAudit} from '../src/game/appraisal/audit.js';
import {appraisalBotDecision} from '../src/simulation/appraisal.js';
import type {AppraisalState} from '../src/game/appraisal/types.js';
import type {AppraisalRoomView,AppraisalServerMessage} from '../src/shared/appraisal-protocol.js';

class Rooms extends AppraisalRoomService {
 protected override createGame(ids:string[]){return createAppraisalRun(ids,'personal-wire-v1',{personalScoringRules:1,catalogVersion:4,startingCredits:40,survival:{maxLife:6,encounterLifeCost:1,entryEnergyCost:0},collectorDeadline:2});}
 state(code:string):AppraisalState{return this.rooms.get(code)!.game!;}
}
class Client {
 messages:AppraisalServerMessage[]=[];
 constructor(readonly ws:WebSocket){ws.on('message',m=>this.messages.push(JSON.parse(String(m))));}
 static async open(url:string){const ws=new WebSocket(url),client=new Client(ws);await once(ws,'open');return client;}
 send(m:object){this.ws.send(JSON.stringify(m));}
 get room():AppraisalRoomView{const m=this.messages.findLast(m=>m.type==='state');assert(m?.type==='state');return m.room;}
 async wait(fn:()=>boolean){for(let n=0;n<500;n++){if(fn())return;await new Promise(resolve=>setTimeout(resolve,5));}throw Error('personal scoring socket condition timed out');}
}
test('public parser cannot accept client-supplied points or canonical facts',()=>{
 for(const body of [{personalScore:999},{personalPerformance:{version:1,facts:[]}},{metric:'trustGained',raw:99}])assert.throws(()=>parseAppraisalMessage({type:'action',matchId:'match',action:{type:'done',encounter:1,requestId:'score-spoof',...body}}));
});
for(const count of [2,4])test(`${count} real sockets preserve private receipts, duplicate idempotency, resume and exact final audit`,{timeout:20000},async t=>{
 const rooms=new Rooms(()=>1000),app=createApp({rooms}),clients:Client[]=[];
 t.after(()=>{for(const c of clients)c.ws.terminate();void app.close();});
 app.server.listen(0,'127.0.0.1');await once(app.server,'listening');const url=`ws://127.0.0.1:${(app.server.address() as AddressInfo).port}/socket`;
 for(let n=0;n<count;n++)clients.push(await Client.open(url));const first=clients[0]!;
 first.send({type:'create',name:'Scoring Alice'});await first.wait(()=>first.messages.some(m=>m.type==='state'));
 for(const [n,c]of clients.entries()){if(n===0)continue;c.send({type:'join',name:`Scoring Seat ${n}`,roomCode:first.room.code});await c.wait(()=>c.messages.some(m=>m.type==='state'));}
 for(const c of clients)c.send({type:'ready',ready:true});await first.wait(()=>first.room.seats.every(s=>s.ready));first.send({type:'start'});await clients.at(-1)!.wait(()=>!!clients.at(-1)!.room.game);
 let seq=0,repeated=false,inspectionCount=0;const inspected=new Set<string>();
 const sync=async()=>{const revision=rooms.state(first.room.code).revision;for(const c of clients)await c.wait(()=>c.room.game?.revision===revision);};
 const act=async(c:Client,body:object)=>{
  const requestId=`score-wire-${seq++}`,action={...body,requestId,encounter:c.room.game!.encounter};
  c.send({type:'action',matchId:c.room.matchId,action});await c.wait(()=>c.messages.some(m=>(m.type==='ack'||m.type==='error')&&m.requestId===requestId));
  assert.equal(c.messages.findLast(m=>(m.type==='ack'||m.type==='error')&&m.requestId===requestId)!.type,'ack');await sync();return action;
 };
 for(let bound=0;bound<240&&first.room.game!.phase!=='RESULTS';bound++){
  await sync();const game=first.room.game!;
  for(const c of clients){const text=JSON.stringify(c.room.game);assert(!text.includes('"personalPerformance"'));assert(!text.includes('"eligibleKey"'));}
  if(game.phase==='REVEAL'){
   for(const c of clients){if(c.room.game!.self.roundReward&&!c.room.game!.self.roundReward.settled)await act(c,{type:'round-bank'});}
   for(const c of clients)c.send({type:'reveal-ready',matchId:c.room.matchId,encounter:game.encounter});await first.wait(()=>first.room.game!.encounter!==game.encounter||first.room.game!.phase==='RESULTS');continue;
  }
  const c=clients.find(c=>(c.room.game!.self.eventOffer||c.room.game!.self.abilityChoice)&&!c.room.game!.self.done&&!c.room.game!.self.paused)??clients.find(c=>!c.room.game!.self.done&&!c.room.game!.self.paused);assert(c);
  const v=c.room.game!;
  if(v.self.eventOffer||v.self.abilityChoice){await act(c,appraisalBotDecision(v,'cautious'));continue;}
  if(v.phase==='PORTALS'){await act(c,{type:'enter',portalId:v.self.portals.find(p=>!p.disabled)!.id});continue;}
  const item=v.self.stock.find(i=>i.knowledge.genuine===undefined),key=`${v.self.id}:${v.encounter}`;
  if(v.phase==='APPRAISAL'&&item&&!inspected.has(key)){
   inspected.add(key);inspectionCount++;const action=await act(c,{type:'inspect',itemId:item.id,property:'authenticity'});
   if(!repeated){const before=structuredClone(rooms.state(first.room.code)),acks=c.messages.filter(m=>m.type==='ack'&&m.requestId===action.requestId).length;c.send({type:'action',matchId:c.room.matchId,action});await c.wait(()=>c.messages.filter(m=>m.type==='ack'&&m.requestId===action.requestId).length===acks+1);assert.deepEqual(rooms.state(first.room.code),before);repeated=true;
    const old=clients.at(-1)!,joined=old.messages.find(m=>m.type==='joined');assert(joined?.type==='joined');old.ws.terminate();const resumed=await Client.open(url);clients[clients.length-1]=resumed;resumed.send({type:'resume',roomCode:first.room.code,token:joined.token});await resumed.wait(()=>resumed.messages.some(m=>m.type==='state'));await sync();assert.deepEqual(rooms.state(first.room.code),before);
   }
   continue;
  }
  await act(c,{type:'done'});
 }
 await sync();assert.equal(first.room.game!.phase,'RESULTS');assert(repeated&&inspectionCount>0);
 const state=rooms.state(first.room.code);assert(state.personalPerformance!.facts.some(f=>f.metric==='inspection'));
 for(const row of state.collector!){assert(row.personalScore);assert.equal(row.score,row.personalScore.total);assert.equal(row.personalScore.groups.reduce((n,g)=>n+g.points,0),row.score);}
 first.send({type:'audit',matchId:first.room.matchId});await first.wait(()=>first.messages.some(m=>m.type==='audit'));const message=first.messages.find(m=>m.type==='audit');assert(message?.type==='audit');assert.deepEqual(exportAppraisalAudit(replayAppraisalAudit(message.audit.run)),message.audit.run);assert.deepEqual(message.audit.run.personalPerformance,state.personalPerformance);
 if(process.env.PERSONAL_SCORING_AUDIT_DIR)writeFileSync(path.join(process.env.PERSONAL_SCORING_AUDIT_DIR,`${count}-players.audit.json`),JSON.stringify(message.audit,null,2)+'\n');
});

test('actual Comic entry point enables approved scoring for new rooms without client-supplied config',{timeout:20000},async t=>{
 const {spawn}=await import('node:child_process'),{createServer}=await import('node:net');const reservation=createServer();reservation.listen(0,'127.0.0.1');await once(reservation,'listening');const port=(reservation.address() as AddressInfo).port;await new Promise<void>(resolve=>reservation.close(()=>resolve()));
 const {fileURLToPath}=await import('node:url');const server=spawn(process.execPath,[fileURLToPath(new URL('../src/server/appraisal-main.js',import.meta.url))],{cwd:process.cwd(),env:{...process.env,HOST:'127.0.0.1',PORT:String(port)},stdio:['ignore','pipe','pipe']}),clients:Client[]=[];
 t.after(()=>{for(const c of clients)c.ws.terminate();server.kill('SIGTERM');});
 let output='';server.stdout.on('data',data=>output+=String(data));server.stderr.on('data',data=>output+=String(data));
 for(let n=0;n<400&&!output.includes('Cursed Market v0.5 Survival:');n++){assert.equal(server.exitCode,null,output);await new Promise(resolve=>setTimeout(resolve,10));}assert(output.includes('Cursed Market v0.5 Survival:'),output);
 for(let n=0;n<2;n++)clients.push(await Client.open(`ws://127.0.0.1:${port}/socket`));const first=clients[0]!;first.send({type:'create',name:'Entry host'});await first.wait(()=>first.messages.some(m=>m.type==='state'));clients[1]!.send({type:'join',name:'Entry guest',roomCode:first.room.code});await clients[1]!.wait(()=>clients[1]!.messages.some(m=>m.type==='state'));for(const c of clients)c.send({type:'ready',ready:true});await first.wait(()=>first.room.seats.every(s=>s.ready));first.send({type:'start'});await first.wait(()=>!!first.room.game);
 assert(first.room.game!.self.personalScoreEstimate,'main entry did not enable approved personal scoring');assert.equal(first.room.game!.self.credits,40);assert.equal(first.room.game!.self.life,6);assert(!JSON.stringify(first.room.game).includes('personalPerformance'));
});
