import test from 'node:test';
import assert from 'node:assert/strict';
import {AppraisalRoomService} from '../src/server/appraisal-rooms.js';
import type {LifecyclePeer} from '../src/server/room-lifecycle.js';
import type {AppraisalServerMessage,AppraisalSeatAction} from '../src/shared/appraisal-protocol.js';
import {randomAt} from '../src/game/random.js';
class Client implements LifecyclePeer<AppraisalServerMessage>{messages:AppraisalServerMessage[]=[];send(m:AppraisalServerMessage){this.messages.push(structuredClone(m));}close(){}get room(){const m=this.messages.findLast(m=>m.type==='state');assert(m?.type==='state');return m.room;}}
class Rooms extends AppraisalRoomService {state(code:string){return this.rooms.get(code)!.game!;}}
function setup(timed=true){
 let now=1000,n=0;const rooms=new Rooms(()=>now,{},60000,{core2:true,secureEconomy:true,marketProbability:0}),host=new Client(),guest=new Client();
 rooms.receive(host,{type:'create',name:'host'});rooms.receive(host,{type:'timer-settings',settings:{enabled:timed,durationsMs:{PORTALS:7000,APPRAISAL:11000,TRADE:13000,REVEAL:2000}}});rooms.receive(guest,{type:'join',name:'guest',roomCode:host.room.code});for(const c of [host,guest])rooms.receive(c,{type:'ready',ready:true});rooms.receive(host,{type:'start'});
 const send=(c:Client,body:Record<string,unknown>,requestId=`forced-room-${++n}`)=>{const action={...body,requestId,encounter:c.room.game!.encounter} as AppraisalSeatAction;rooms.receive(c,{type:'action',matchId:c.room.matchId!,action});return action;};
 for(const c of [host,guest]){for(const p of rooms.state(host.room.code).players)p.eventOffer=null;send(c,{type:'done'});}
 const s=rooms.state(host.room.code),victim=s.players.find(p=>p.id===guest.room.yourSeatId)!;for(const p of s.players){p.eventOffer=null;p.energy=8;}
 const item=s.items[victim.portals[0]!.stock[0]!]!;item.owner=victim.id;victim.inventory.push(item.id);send(host,{type:'theft-start',victimId:victim.id});assert.equal(host.messages.at(-1)?.type,'state');
 return {rooms,host,guest,send,setNow:(t:number)=>{now=t;},now:()=>now};
}
const hands=['rock','paper','scissors'] as const;
test('phase deadline cannot refuse a valid hand; duel expiry preserves it and a tie starts a fresh reconnectable clock',()=>{
 const t=setup();let s=t.rooms.state(t.host.room.code),d=s.theftDuels![0]!;const deadline=t.host.room.duelDeadlines![d.id]!;
 const auto=hands[Math.floor(randomAt(s.seed,`${d.id}:round:1:timeout:${t.guest.room.yourSeatId}`)*3)]!;t.setNow(t.host.room.deadline!+1);
 const a=t.send(t.host,{type:'theft-hand',duelId:d.id,round:1,hand:auto});assert(t.host.messages.some(m=>m.type==='ack'&&m.requestId===a.requestId),'phase expiry must not reject the active duel hand');
 const token=t.guest.messages.find(m=>m.type==='joined');assert(token?.type==='joined');t.rooms.disconnect(t.guest);t.setNow(deadline+1);
 t.send(t.host,{type:'theft-hand',duelId:d.id,round:1,hand:'rock'});s=t.rooms.state(t.host.room.code);d=s.theftDuels![0]!;assert.equal(d.round,2);assert.equal(d.status,'open');assert.deepEqual(d.hands,{});assert.deepEqual(d.revealed,[{thief:auto,opponent:auto}]);
 const fresh=t.host.room.duelDeadlines![d.id]!;assert.equal(fresh,t.now()+30000);const resumed=new Client();t.rooms.receive(resumed,{type:'resume',roomCode:t.host.room.code,token:token.token});assert.equal(resumed.room.duelDeadlines![d.id],fresh);
 const stale=t.send(resumed,{type:'theft-hand',duelId:d.id,round:1,hand:'paper'});assert(resumed.messages.some(m=>m.type==='error'&&m.requestId===stale.requestId));assert.deepEqual(t.rooms.state(t.host.room.code).theftDuels![0]!.hands,{});
 t.rooms.tick();assert.equal(t.rooms.state(t.host.room.code).theftDuels![0]!.revealed.length,1);assert.equal(t.host.room.duelDeadlines![d.id],fresh);
});
test('an accepted hand retry after phase expiry is acknowledged without replaying the action',()=>{
 const t=setup(),d=t.rooms.state(t.host.room.code).theftDuels![0]!;const a=t.send(t.host,{type:'theft-hand',duelId:d.id,round:1,hand:'paper'});t.send(t.guest,{type:'theft-hand',duelId:d.id,round:1,hand:'rock'});t.setNow(t.host.room.deadline!+1);
 const before=structuredClone(t.rooms.state(t.host.room.code));t.rooms.receive(t.host,{type:'action',matchId:t.host.room.matchId!,action:a});assert.equal(t.host.messages.filter(m=>m.type==='ack'&&m.requestId===a.requestId).length,2);assert.deepEqual(t.rooms.state(t.host.room.code),before);
});

test('untimed rooms still resolve a disconnected participant on the independent duel deadline once',()=>{
 const t=setup(false),d=t.rooms.state(t.host.room.code).theftDuels![0]!,energy=t.rooms.state(t.host.room.code).players[0]!.energy,deadline=t.host.room.duelDeadlines![d.id]!;assert.equal(t.host.room.deadline,null);
 t.rooms.disconnect(t.guest);t.setNow(deadline-1);t.rooms.tick();assert.equal(t.rooms.state(t.host.room.code).theftDuels![0]!.revealed.length,0);
 t.setNow(deadline);t.rooms.tick();const s=t.rooms.state(t.host.room.code);assert.notEqual(s.theftDuels![0]!.status,'cancelled');assert.equal(s.theftDuels![0]!.revealed.length,1);assert.equal(s.players[0]!.energy,energy);
 const before=structuredClone(s);t.rooms.tick();assert.deepEqual(t.rooms.state(t.host.room.code),before);
});
