import test from 'node:test';
import assert from 'node:assert/strict';
import {createAppraisalRun,restoreAppraisalRun,applyAppraisalAction} from '../src/game/appraisal/engine.js';
import {recoveryOffer,grant} from '../src/game/appraisal/mechanics.js';
import {parseAppraisalMessage} from '../src/server/appraisal-messages.js';
import type {AppraisalAction,AppraisalState} from '../src/game/appraisal/types.js';
function make(ids=['alice','bob']){const s=createAppraisalRun(ids,'recovery-quote',{catalogVersion:5,core2:false,npcEvents:false,polish:false,startingCredits:100,survival:{maxLife:6,encounterLifeCost:1,entryEnergyCost:2}});const p=s.players[0]!;s.phase='APPRAISAL';p.eventOffer=null;p.selectedPortalId=p.portals[0]!.id;p.portals[0]!.npc='autometa';p.energy=1;return s;}
const token=(s:AppraisalState)=> (recoveryOffer(s,s.players[0]!) as {quoteId?:string})!.quoteId;
function command(s:AppraisalState,quoteId=token(s)){return {type:'recover-resource',target:'energy',quoteId,playerId:'alice',requestId:'recover',encounter:s.encounter} as Extract<AppraisalAction,{type:'recover-resource'}> & {quoteId?:string};}
test('recovery binds visible price and terms before charging and accepts a fresh retry exactly once',()=>{
 const s=make(),before=structuredClone(s),old=command(s);assert.equal(typeof token(s),'string');assert.equal(token(s),token(s));assert.deepEqual(s,before);
 grant(s,s.players[0]!,'D16');assert.notEqual(token(s),token(before));const stale=structuredClone(s);assert.throws(()=>applyAppraisalAction(s,old),/ข้อเสนอ.*เปลี่ยน/);assert.deepEqual(s,stale);
 const quote=recoveryOffer(s,s.players[0]!)!,fresh=command(s),next=applyAppraisalAction(s,fresh);assert.equal(next.players[0]!.credits,s.players[0]!.credits-quote.credits);assert.deepEqual(applyAppraisalAction(next,fresh),next);
});
test('recovery quote cannot be omitted, reused for another actor or shop, or changed through unrelated revision',()=>{
 const s=make(),id=token(s)!;s.revision++;assert.equal(token(s),id);
 assert.throws(()=>applyAppraisalAction(s,{...command(s),quoteId:undefined} as unknown as AppraisalAction),/ข้อเสนอ.*เปลี่ยน/);
 const b=s.players[1]!;b.eventOffer=null;b.selectedPortalId=b.portals[0]!.id;b.portals[0]!.npc='autometa';b.energy=1;
 assert.throws(()=>applyAppraisalAction(s,{...command(s,id),playerId:'bob'}),/ข้อเสนอ.*เปลี่ยน/);
 s.players[0]!.portals[0]!.npc='alien';assert.notEqual(token(s),id);
 s.encounter++;assert.notEqual(token(s),id);
});
test('old effects3 exact restore retains recovery without quote tokens',()=>{
 const s=make(),config={...s.config,native56Effects:3 as const};delete (config as {recoveryQuoteRules?:number}).recoveryQuoteRules;
 const old=restoreAppraisalRun(['alice','bob'],s.seed,config);old.phase='APPRAISAL';const p=old.players[0]!;p.eventOffer=null;p.selectedPortalId=p.portals[0]!.id;p.portals[0]!.npc='autometa';p.energy=1;
 assert.equal(token(old),undefined);assert.doesNotThrow(()=>applyAppraisalAction(old,command(old)));
});
test('wire recovery quote is bounded and rejects extra fields',()=>{
 const parse=(action:object)=>{const m=parseAppraisalMessage({type:'action',matchId:'match',action});assert(m.type==='action');return m.action as {quoteId?:string};};
 const action={type:'recover-resource',requestId:'q',encounter:1,target:'energy',quoteId:'visible-terms'};
 assert.equal(parse(action).quoteId,action.quoteId);
 for(const quoteId of ['',5,'x'.repeat(513)])assert.throws(()=>parse({...action,quoteId}));
 assert.throws(()=>parse({...action,extra:true}));
});

test('life range changes invalidate a quote even when its price stays fixed',()=>{
 const s=make(),p=s.players[0]!;p.portals[0]!.npc='orc';p.npcTrust!.orc=3;const old=token(s);assert(old);const price=recoveryOffer(s,p)!.credits;const item=Object.values(s.items)[0]!;s.items.brooch={...item,id:'brooch',kind:'healing-brooch',owner:p.id,rarityPower:{version:1,valueMultiplier:1,effectMultiplier:1}};p.inventory.push('brooch');assert.equal(recoveryOffer(s,p)!.credits,price);assert.notEqual(token(s),old);
});

import {once} from 'node:events';import type {AddressInfo} from 'node:net';import {WebSocket} from 'ws';
import {AppraisalRoomService} from '../src/server/appraisal-rooms.js';import {createApp} from '../src/server/app.js';
import type {AppraisalRoomView,AppraisalServerMessage} from '../src/shared/appraisal-protocol.js';
class RecoveryRooms extends AppraisalRoomService {
 protected override createGame(ids:string[],_seed:string){const s=make(ids),source=Object.values(s.items)[0]!;
  for(const [i,p] of s.players.entries()){p.eventOffer=null;p.energy=1;p.selectedPortalId=p.portals[0]!.id;p.portals[0]!.npc='autometa';const id=`salve-${i}`;s.items[id]={...source,id,kind:'orc-ember-salve',owner:p.id,appearance:{version:1,rarity:'mythic',theme:'plain',visualSeed:1},rarityPower:{version:1,valueMultiplier:8,effectMultiplier:8},...(i?{copy:{sourceId:'salve-0',number:1,valuePercent:25}}:{})};p.inventory.push(id);}return s;}
 state(code:string){return this.rooms.get(code)!.game!;}
}
class Client {
 messages:AppraisalServerMessage[]=[];
 constructor(readonly ws:WebSocket){ws.on('message',raw=>this.messages.push(JSON.parse(String(raw))));}
 static async open(url:string){const ws=new WebSocket(url),c=new Client(ws);await once(ws,'open');return c;}
 send(value:object){this.ws.send(JSON.stringify(value));}
 get room():AppraisalRoomView{const m=this.messages.findLast(m=>m.type==='state');assert(m?.type==='state');return m.room;}
 async wait(fn:()=>boolean){for(let n=0;n<500;n++){if(fn())return;await new Promise(r=>setTimeout(r,5));}throw Error('recovery socket condition timeout');}
}
test('two actual sockets reject a stale E63 quote without charge and reconnect receives the new offer',{timeout:15000},async t=>{
 const rooms=new RecoveryRooms(()=>1000,{},60000),app=createApp({rooms}),clients:Client[]=[];t.after(()=>{for(const c of clients)c.ws.terminate();void app.close();});app.server.listen(0,'127.0.0.1');await once(app.server,'listening');const url=`ws://127.0.0.1:${(app.server.address() as AddressInfo).port}/socket`;
 const a=await Client.open(url),b=await Client.open(url);clients.push(a,b);a.send({type:'create',name:'Alice'});await a.wait(()=>a.messages.some(m=>m.type==='state'));b.send({type:'join',name:'Bob',roomCode:a.room.code});await b.wait(()=>b.messages.some(m=>m.type==='state'));for(const c of clients)c.send({type:'ready',ready:true});await a.wait(()=>a.room.seats.every(s=>s.ready));a.send({type:'start'});await b.wait(()=>!!b.room.game);
 const old=b.room.game!.self.recoveryOffer!,first=a.room.game!.self.recoveryOffer!;assert.equal(old.credits,1);assert(first.quoteId&&old.quoteId);
 const send=async(c:Client,requestId:string,quoteId:string)=>{c.send({type:'action',matchId:c.room.matchId,action:{type:'recover-resource',target:'energy',encounter:1,requestId,quoteId}});await c.wait(()=>c.messages.some(m=>(m.type==='ack'||m.type==='error')&&m.requestId===requestId));const response=c.messages.findLast(m=>(m.type==='ack'||m.type==='error')&&m.requestId===requestId)!;if(requestId==='alice-recover')assert.equal(response.type,'ack',JSON.stringify(response));return response;};
 assert.equal((await send(a,'alice-recover',first.quoteId)).type,'ack');await b.wait(()=>b.room.game!.self.recoveryOffer?.credits===2);
 const before=structuredClone(rooms.state(a.room.code));assert.equal((await send(b,'bob-stale',old.quoteId)).type,'error');assert.deepEqual(rooms.state(a.room.code),before);
 const joined=b.messages.findLast(m=>m.type==='joined');assert(joined?.type==='joined');const reconnect=await Client.open(url);clients.push(reconnect);b.ws.terminate();reconnect.send({type:'resume',roomCode:a.room.code,token:joined.token});await reconnect.wait(()=>reconnect.messages.some(m=>m.type==='state'));assert.equal(reconnect.room.game!.self.recoveryOffer!.credits,2);
 const fresh=reconnect.room.game!.self.recoveryOffer!;assert.equal((await send(reconnect,'bob-fresh',fresh.quoteId!)).type,'ack');const paid=structuredClone(rooms.state(a.room.code));assert.equal(paid.players[1]!.credits,before.players[1]!.credits-2);assert.equal((await send(reconnect,'bob-fresh',fresh.quoteId!)).type,'ack');assert.deepEqual(rooms.state(a.room.code),paid);
});
