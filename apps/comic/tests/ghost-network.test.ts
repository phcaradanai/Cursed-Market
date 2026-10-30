import test from 'node:test';
import assert from 'node:assert/strict';
import {once} from 'node:events';
import {WebSocket} from 'ws';
import type {AddressInfo} from 'node:net';
import {createApp} from '../src/server/app.js';
import {AppraisalRoomService} from '../src/server/appraisal-rooms.js';
import {createAppraisalRun} from '../src/game/appraisal/engine.js';
import {spend,reward} from '../src/game/appraisal/mechanics.js';
import type {AppraisalState} from '../src/game/appraisal/types.js';
class Rooms extends AppraisalRoomService {
 protected createGame(ids:string[],seed:string):AppraisalState {return createAppraisalRun(ids,seed,{survival:{maxLife:6,encounterLifeCost:1,entryEnergyCost:0},startingCredits:200,marketProbability:0,secureEconomy:true});}
 state(code:string){return this.rooms.get(code)!.game!;}
 publish(code:string){this.broadcast(this.rooms.get(code)!);}
}
test('two real sockets track cards, agree a job and deliver with no duplicate payment',{timeout:15000},async t=>{
 let now=1000;const rooms=new Rooms(()=>now),app=createApp({rooms});app.server.listen(0,'127.0.0.1');await once(app.server,'listening');
 const sockets:WebSocket[]=[],messages:any[][]=[[],[]];
 t.after(()=>{for(const ws of sockets)ws.terminate();app.close();});
 for(let i=0;i<2;i++){const ws=new WebSocket(`ws://127.0.0.1:${(app.server.address() as AddressInfo).port}/socket`);ws.on('message',m=>messages[i]!.push(JSON.parse(String(m))));sockets.push(ws);await once(ws,'open');}
 const wait=async(fn:()=>boolean)=>{for(let i=0;i<200;i++){if(fn())return;await new Promise(r=>setTimeout(r,10));}throw Error('socket condition timeout');};
 const send=(i:number,m:object)=>sockets[i]!.send(JSON.stringify(m));const room=(i:number)=>messages[i]!.findLast(m=>m.type==='state')?.room;
 send(0,{type:'create',name:'Ghost'});await wait(()=>!!room(0));send(1,{type:'join',name:'Buyer',roomCode:room(0).code});await wait(()=>!!room(1));
 send(0,{type:'ready',ready:true});send(1,{type:'ready',ready:true});await wait(()=>room(0).seats.every((s:any)=>s.ready));send(0,{type:'start'});await wait(()=>!!room(1).game);
 const state=rooms.state(room(0).code),ghost=state.players[0]!;ghost.life=0;ghost.paused='dead';ghost.done=true;rooms.publish(room(0).code);await wait(()=>room(0).game.self.life===0);
 let seq=0;const act=async(i:number,body:object,expectError=false)=>{const requestId=`g-${++seq}`;send(i,{type:'action',matchId:room(i).matchId,action:{...body,requestId,encounter:room(i).game.encounter}});await wait(()=>messages[i]!.some(m=>(m.type==='ack'||m.type==='error')&&m.requestId===requestId));const reply=messages[i]!.findLast(m=>m.requestId===requestId);assert.equal(reply.type,expectError?'error':'ack',JSON.stringify(reply));return requestId;};
 const invalidBefore=messages[0]!.length;send(0,{type:'action',matchId:room(0).matchId,action:{type:'ghost-start',startedAt:0,requestId:'forged-clock',encounter:room(0).game.encounter}});await wait(()=>messages[0]!.slice(invalidBefore).some(m=>m.type==='error'));
 const startRequest=await act(0,{type:'ghost-start'});now+=2000;send(0,{type:'action',matchId:room(0).matchId,action:{type:'ghost-start',requestId:startRequest,encounter:room(0).game.encounter}});await wait(()=>messages[0]!.filter(m=>m.type==='ack'&&m.requestId===startRequest).length===2);const started=rooms.state(room(0).code).ghosts![ghost.id]!;const round=started.round,answer=started.tracking!.answer;
 await act(0,{type:'ghost-guess',round,position:answer},true);now=7000;const guessRequest=await act(0,{type:'ghost-guess',round,position:answer});
 await wait(()=>room(1).game.ghosts.services.some((s:any)=>s.available));assert(!JSON.stringify(room(0).game.ghosts).includes('answer'));
 const token=messages[0]!.find(m=>m.type==='joined').token;const roomCode=room(0).code;sockets[0]!.terminate();
 const resumed=new WebSocket(`ws://127.0.0.1:${(app.server.address() as AddressInfo).port}/socket`);resumed.on('message',m=>messages[0]!.push(JSON.parse(String(m))));sockets[0]=resumed;await once(resumed,'open');send(0,{type:'resume',roomCode,token});await wait(()=>messages[0]!.filter(m=>m.type==='joined').length===2);assert.equal(room(0).game.ghosts.self.available,true);
 await act(1,{type:'ghost-hire',ghostId:ghost.id,choice:0,quoteId:room(1).game.ghosts.services.find((g:any)=>g.ghostId===ghost.id).quotes[0].id,fee:2});const job=rooms.state(room(0).code).ghosts![ghost.id]!.jobs[0]!;await act(0,{type:'ghost-accept',jobId:job.id,accept:true});
 const g=rooms.state(room(0).code).ghosts![ghost.id]!;g.slots[0]!.kind=job.kind;const before=room(1).game.self.credits;
 const funded=rooms.state(room(0).code),buyer=funded.players[1]!,cash=buyer.credits;spend(funded,buyer,cash,0,'test-funds-withdraw');rooms.publish(room(0).code);
 await act(0,{type:'ghost-deliver',jobId:job.id,slot:0},true);assert.equal(rooms.state(room(0).code).ghosts![ghost.id]!.jobs[0]!.status,'accepted');assert.equal(rooms.state(room(0).code).ghosts![ghost.id]!.bonus,0);
 reward(funded,buyer,cash,'test-funds-return');rooms.publish(room(0).code);
 await act(0,{type:'ghost-deliver',jobId:job.id,slot:0});await wait(()=>room(1).game.self.credits<before);assert.equal(room(1).game.self.credits,before-job.price-job.fee);assert.equal(room(0).game.ghosts.self.bonus,Math.floor(job.base*.1)+2);
 await act(0,{type:'ghost-deliver',jobId:job.id,slot:0},true);
 await act(0,{type:'ghost-start'});send(0,{type:'action',matchId:room(0).matchId,action:{type:'ghost-guess',round,position:answer,requestId:guessRequest,encounter:room(0).game.encounter}});await wait(()=>messages[0]!.filter(m=>m.type==='ack'&&m.requestId===guessRequest).length===2);assert.equal(rooms.state(room(0).code).ghosts![ghost.id]!.tracking!.status,'guessing');
});
