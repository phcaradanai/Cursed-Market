import test from 'node:test';
import assert from 'node:assert/strict';
import {createAppraisalRun,applyAppraisalAction,appraisalViewFor} from '../src/game/appraisal/index.js';
import {pilotUses,swordForDuel} from '../src/game/appraisal/pilot-effects.js';
import {remainingEffectReady} from '../src/game/appraisal/remaining48-effects.js';
import type {AppraisalAction,AppraisalItem,AppraisalState,Appraiser,ItemKind} from '../src/game/appraisal/types.js';

let seq=0;
function make(revision:2|3|4|5|6=6,playerIds=['alice','bob']) {
 const s=createAppraisalRun(playerIds,'e38-'+revision,{catalogVersion:5,native56Effects:revision,secureEconomy:true,core2:true,marketProbability:0,startingCredits:100});
 s.phase='TRADE';
 for(const p of s.players){p.done=false;p.paused=null;p.eventOffer=null;p.energy=8;delete p.abilityChoice;}
 const thief=s.players[0]!,victim=s.players[1]!,itemId='victim-good';
 s.items[itemId]={id:itemId,kind:'orc-tusk-shield',base:24,genuine:true,cursed:false,ask:20,owner:victim.id,npcOwnerId:victim.id,npc:'orc',encounter:1,certificate:false,lastAppraisal:null,reservation:0,lastAccepted:null};victim.inventory.push(itemId);
 return {s,thief,victim,itemId};
}
function give(s:AppraisalState,p:Appraiser,kind:ItemKind,power=1,copy=false) {
 const id='e38-'+kind+'-'+Object.keys(s.items).length;
 const item:AppraisalItem={id,kind,base:24,genuine:true,cursed:false,ask:20,owner:p.id,npcOwnerId:p.id,npc:'vampire',encounter:1,certificate:false,lastAppraisal:null,reservation:0,lastAccepted:null,appearance:{version:1,rarity:'common',theme:'plain',visualSeed:1},rarityPower:{version:1,valueMultiplier:power,effectMultiplier:power}};
 if(copy){s.items[id+'-origin']={...item,id:id+'-origin',owner:'removed'};item.copy={sourceId:id+'-origin',number:1,valuePercent:25};}
 s.items[id]=item;p.inventory.push(id);return item;
}
function act(s:AppraisalState,playerId:string,body:object):AppraisalState {
 return applyAppraisalAction(s,{...body,playerId,encounter:s.encounter,requestId:'e38-'+seq++} as AppraisalAction);
}
function start(s:AppraisalState) { return act(s,'alice',{type:'theft-start',victimId:'bob'}); }
function hand(s:AppraisalState,playerId:string,round:number,choice:'rock'|'paper'|'scissors') {
 return act(s,playerId,{type:'theft-hand',duelId:s.theftDuels![0]!.id,round,hand:choice});
}

test('effects6 keeps E22 readiness and unlocks E38 without changing older readiness',()=>{
 assert.equal(remainingEffectReady('vampire-midnight-invitation',5),true);
 assert.equal(remainingEffectReady('vampire-midnight-invitation',6),true);
 assert.equal(remainingEffectReady('vampire-mooncut-sword',5),false);
 assert.equal(remainingEffectReady('vampire-mooncut-sword',6),true);
});

test('E38 is declared before hands and a public tie uses one shared player/encounter right',()=>{
 const t=make(),sword=give(t.s,t.thief,'vampire-mooncut-sword');let s=start(t.s),duel=s.theftDuels![0]!;
 assert.deepEqual(duel.swordIds,{alice:sword.id});
 assert.deepEqual(appraisalViewFor(s,'alice').theft!.duels[0]!.publicSwords,{you:true,opponent:false});
 s=hand(s,'alice',1,'rock');s=hand(s,'bob',1,'rock');duel=s.theftDuels![0]!;
 assert.equal(duel.status,'won');assert.equal(s.items[duel.itemId]!.owner,'alice');
 assert.deepEqual(s.native56TieRights,{encounter:1,players:['alice']});assert.equal(pilotUses(s,s.items[sword.id]!),1);
 assert.equal(swordForDuel(s,s.players[0]!),undefined);
 const control=make();let without=start(control.s);without=hand(without,'alice',1,'rock');without=hand(without,'bob',1,'rock');
 assert.equal(without.theftDuels![0]!.status,'open');assert.equal(without.theftDuels![0]!.round,2);assert.equal(without.items[control.itemId]!.owner,'bob');
});

test('E38 and the riftfang sword cancel across the family and neither can stack on the next tie',()=>{
 const t=make(),mooncut=give(t.s,t.thief,'vampire-mooncut-sword'),riftfang=give(t.s,t.victim,'beast-riftfang-sword');let s=start(t.s),duel=s.theftDuels![0]!;
 assert.deepEqual(duel.swordIds,{alice:mooncut.id,bob:riftfang.id});
 s=hand(s,'alice',1,'rock');s=hand(s,'bob',1,'rock');duel=s.theftDuels![0]!;
 assert.equal(duel.status,'open');assert.equal(duel.round,2);
 assert.deepEqual(s.native56TieRights,{encounter:1,players:['alice','bob']});
 assert.deepEqual(appraisalViewFor(s,'alice').theft!.duels[0]!.publicSwords,{you:false,opponent:false});
 s=hand(s,'alice',2,'paper');s=hand(s,'bob',2,'paper');duel=s.theftDuels![0]!;
 assert.equal(duel.status,'open');assert.equal(duel.round,3);assert.equal(duel.revealed.length,2);
});

test('E38 does not spend its right on a non-tie; binary rarity and copy threshold do not multiply rights',()=>{
 const t=make(),weak=give(t.s,t.thief,'vampire-mooncut-sword',1,true);let s=start(t.s);
 assert.equal(s.theftDuels![0]!.swordIds?.alice,undefined,'a 0.4 copy is below S=1');
 s=hand(s,'alice',1,'rock');s=hand(s,'bob',1,'scissors');assert.equal(s.native56TieRights,undefined);
 const r=make(),strong=give(r.s,r.thief,'vampire-mooncut-sword',8);let next=start(r.s);
 next=hand(next,'alice',1,'rock');next=hand(next,'bob',1,'rock');assert.equal(next.theftDuels![0]!.status,'won');
 assert.deepEqual(next.native56TieRights,{encounter:1,players:['alice']});assert.equal(pilotUses(next,next.items[strong.id]!),1);assert.equal(weak.copy!.valuePercent,25);
});

test('E38 is absent from archived effects5 semantics; stage5 sword behavior remains unchanged',()=>{
 const t=make(5),mooncut=give(t.s,t.thief,'vampire-mooncut-sword'),riftfang=give(t.s,t.victim,'beast-riftfang-sword');
 const s=start(t.s),duel=s.theftDuels![0]!;
 assert.deepEqual(duel.swordIds,{bob:riftfang.id});assert.equal((duel.swordIds as Record<string,string>|undefined)?.alice,undefined);
 assert.equal(s.items[mooncut.id]!.owner,'alice');
});

import {once} from 'node:events';import type {AddressInfo} from 'node:net';import {WebSocket} from 'ws';
import {AppraisalRoomService} from '../src/server/appraisal-rooms.js';import {createApp} from '../src/server/app.js';
import type {AppraisalRoomView,AppraisalServerMessage} from '../src/shared/appraisal-protocol.js';
class TheftRooms extends AppraisalRoomService {
 protected override createGame(ids:string[],_seed:string){const {s,thief}=make(6,ids);give(s,thief,'vampire-mooncut-sword');return s;}
 state(code:string){return this.rooms.get(code)!.game!;}
}
class TheftClient {
 messages:AppraisalServerMessage[]=[];constructor(readonly ws:WebSocket){ws.on('message',raw=>this.messages.push(JSON.parse(String(raw))));}
 static async open(url:string){const ws=new WebSocket(url),c=new TheftClient(ws);await once(ws,'open');return c;}
 send(m:object){this.ws.send(JSON.stringify(m));}
 get room():AppraisalRoomView{const m=this.messages.findLast(m=>m.type==='state');assert(m?.type==='state');return m.room;}
 async wait(fn:()=>boolean){for(let n=0;n<700;n++){if(fn())return;await new Promise(r=>setTimeout(r,5));}throw Error('E38 socket condition timeout');}
}
test('two actual sockets expose E38 before the forced duel and settle the public tie once',{timeout:15000},async t=>{
 const rooms=new TheftRooms(()=>1000,{},60000),app=createApp({rooms}),clients:TheftClient[]=[];t.after(()=>{for(const c of clients)c.ws.terminate();void app.close();});app.server.listen(0,'127.0.0.1');await once(app.server,'listening');const url=`ws://127.0.0.1:${(app.server.address() as AddressInfo).port}/socket`;
 const a=await TheftClient.open(url),b=await TheftClient.open(url);clients.push(a,b);a.send({type:'create',name:'Alice'});await a.wait(()=>a.messages.some(m=>m.type==='state'));b.send({type:'join',name:'Bob',roomCode:a.room.code});await b.wait(()=>b.messages.some(m=>m.type==='state'));for(const c of clients)c.send({type:'ready',ready:true});await a.wait(()=>a.room.seats.every(s=>s.ready));a.send({type:'start'});await b.wait(()=>!!b.room.game);
 let seq=0;const send=async(c:TheftClient,body:object)=>{const action={...body,requestId:'e38-wire-'+seq++,encounter:c.room.game!.encounter};c.send({type:'action',matchId:c.room.matchId,action});await c.wait(()=>c.messages.some(m=>(m.type==='ack'||m.type==='error')&&m.requestId===action.requestId));const response=c.messages.findLast(m=>(m.type==='ack'||m.type==='error')&&m.requestId===action.requestId)!;assert.equal(response.type,'ack',JSON.stringify(response));const rev=rooms.state(b.room.code).revision;for(const peer of clients)if(peer.ws.readyState===WebSocket.OPEN)await peer.wait(()=>peer.room.game!.revision===rev);};
 await send(a,{type:'theft-start',victimId:b.room.game!.self.id});const duel=a.room.game!.theft!.duels[0]!;assert.deepEqual(b.room.game!.theft!.duels[0]!.publicSwords,{you:false,opponent:true});
 await send(a,{type:'theft-hand',duelId:duel.id,round:1,hand:'rock'});await send(b,{type:'theft-hand',duelId:duel.id,round:1,hand:'rock'});
 const state=rooms.state(b.room.code);assert.equal(state.theftDuels![0]!.status,'won');assert.equal(state.items[state.theftDuels![0]!.itemId]!.owner,a.room.game!.self.id);assert.deepEqual(state.native56TieRights,{encounter:1,players:[a.room.game!.self.id]});
});
