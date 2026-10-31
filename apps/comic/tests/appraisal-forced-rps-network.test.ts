import test from 'node:test';
import assert from 'node:assert/strict';
import {once} from 'node:events';
import type {AddressInfo} from 'node:net';
import {WebSocket} from 'ws';
import {createApp} from '../src/server/app.js';
import {AppraisalRoomService} from '../src/server/appraisal-rooms.js';
import type {AppraisalState} from '../src/game/appraisal/types.js';
import {randomAt} from '../src/game/random.js';
class Rooms extends AppraisalRoomService {
 protected override createGame(...args:Parameters<AppraisalRoomService['createGame']>):AppraisalState {
  const s=super.createGame(...args);s.phase='APPRAISAL';for(const p of s.players){p.done=false;p.paused=null;p.eventOffer=null;p.stock=[...p.portals[0]!.stock];p.selectedPortalId=p.portals[0]!.id;p.energy=8;}
  const p=s.players[1]!,id=p.stock.shift()!;s.items[id]!.owner=p.id;p.inventory.push(id);return s;
 }
 state(code:string){return this.rooms.get(code)!.game!;}
}
test('real sockets preserve sealed hands, independent clocks, resume and round-token idempotency',{timeout:15000},async t=>{
 let now=1000;const rooms=new Rooms(()=>now,{APPRAISAL:11000},60000,{core2:true,secureEconomy:true,marketProbability:0}),app=createApp({rooms});app.server.listen(0,'127.0.0.1');await once(app.server,'listening');
 const sockets:WebSocket[]=[],messages:any[][]=[[],[]];t.after(()=>{for(const ws of sockets)ws.terminate();app.close();});
 for(let i=0;i<2;i++){const ws=new WebSocket(`ws://127.0.0.1:${(app.server.address() as AddressInfo).port}/socket`);ws.on('message',m=>messages[i]!.push(JSON.parse(String(m))));sockets.push(ws);await once(ws,'open');}
 const wait=async(fn:()=>boolean)=>{for(let i=0;i<300;i++){if(fn())return;await new Promise(r=>setTimeout(r,10));}throw Error('socket condition timeout');};
 const send=(i:number,m:object)=>sockets[i]!.send(JSON.stringify(m)),room=(i:number)=>messages[i]!.findLast(m=>m.type==='state')?.room;
 send(0,{type:'create',name:'Thief'});await wait(()=>!!room(0));send(1,{type:'join',name:'Victim',roomCode:room(0).code});await wait(()=>!!room(1));send(0,{type:'ready',ready:true});send(1,{type:'ready',ready:true});await wait(()=>room(0).seats.every((s:any)=>s.ready));send(0,{type:'start'});await wait(()=>!!room(1).game);
 let n=0;const act=async(i:number,body:object,error=false)=>{const action={...body,requestId:`forced-wire-${++n}`,encounter:room(i).game.encounter};send(i,{type:'action',matchId:room(i).matchId,action});await wait(()=>messages[i]!.some(m=>(m.type==='ack'||m.type==='error')&&m.requestId===action.requestId));assert.equal(messages[i]!.findLast(m=>m.requestId===action.requestId).type,error?'error':'ack');return action;};
 const victim=room(1).yourSeatId;await act(0,{type:'theft-start',victimId:victim});const s=rooms.state(room(0).code),d=s.theftDuels![0]!,energy=s.players[0]!.energy,item=d.itemId;
 await act(0,{type:'theft-hand',duelId:d.id,hand:'rock'},true);assert.equal(d.revealed.length,0);
 const invalid=messages[0]!.length;send(0,{type:'action',matchId:room(0).matchId,action:{type:'theft-expire',duelId:d.id,requestId:'forged-expiry',encounter:s.encounter}});await wait(()=>messages[0]!.slice(invalid).some(m=>m.type==='error'));assert.equal(rooms.state(room(0).code).theftDuels![0]!.round,1);
 const deadline=room(0).duelDeadlines[d.id],hands=['rock','paper','scissors'] as const,auto=hands[Math.floor(randomAt(s.seed,`${d.id}:round:1:timeout:${victim}`)*3)]!;now=room(0).deadline+1;
 await act(0,{type:'theft-hand',duelId:d.id,round:1,hand:auto});assert.equal(room(1).game.theft.duels[0].revealed.length,0);assert(!JSON.stringify(room(1).game.theft).includes('"hands"'));
 const token=messages[1]!.find(m=>m.type==='joined').token,code=room(1).code;sockets[1]!.terminate();now=deadline+1;rooms.tick();await wait(()=>room(0).game.theft.duels[0].round===2);const fresh=room(0).duelDeadlines[d.id];assert.equal(fresh,now+30000);assert.equal(rooms.state(code).players[0]!.energy,energy);
 const ws=new WebSocket(`ws://127.0.0.1:${(app.server.address() as AddressInfo).port}/socket`);ws.on('message',m=>messages[1]!.push(JSON.parse(String(m))));sockets[1]=ws;await once(ws,'open');send(1,{type:'resume',roomCode:code,token});await wait(()=>messages[1]!.filter(m=>m.type==='joined').length===2);assert.equal(room(1).duelDeadlines[d.id],fresh);
 await act(1,{type:'theft-hand',duelId:d.id,round:1,hand:'rock'},true);await act(1,{type:'theft-hand',duelId:d.id,round:2,hand:'rock'});const last=await act(0,{type:'theft-hand',duelId:d.id,round:2,hand:'paper'});
 assert.equal(rooms.state(code).theftDuels![0]!.status,'won');const before=structuredClone(rooms.state(code));send(0,{type:'action',matchId:room(0).matchId,action:last});await wait(()=>messages[0]!.filter(m=>m.type==='ack'&&m.requestId===last.requestId).length===2);assert.deepEqual(rooms.state(code),before);assert.equal(before.players[0]!.inventory.filter(id=>id===item).length,1);
});
