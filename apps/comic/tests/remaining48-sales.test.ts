import test from 'node:test';import assert from 'node:assert/strict';
import {createAppraisalRun,applyAppraisalAction,appraisalViewFor} from '../src/game/appraisal/index.js';
import {purchase,grant,completeAppraisedSale} from '../src/game/appraisal/mechanics.js';
import type {AppraisalAction,AppraisalState,AppraisalItem,ItemKind} from '../src/game/appraisal/types.js';
function make(ids=['alice','bob','carol']){const s=createAppraisalRun(ids,'sales-contract',{catalogVersion:5,startingCredits:1000,core2:false,npcEvents:false,polish:false,marketProbability:0,commerce:true,secureEconomy:false,trustAbilities:true,survival:{maxLife:6,encounterLifeCost:1,entryEnergyCost:0}});s.phase='TRADE';for(const p of s.players){p.eventOffer=null;p.done=false;p.energy=2;}return s;}
function give(s:AppraisalState,kind:ItemKind,seat=0,power=1,copy=false){const p=s.players[seat]!,source=Object.values(s.items)[0]!,id='held-'+Object.keys(s.items).length;const i:AppraisalItem={...source,id,kind,owner:p.id,appearance:{version:1,rarity:power===8?'mythic':'common',theme:'plain',visualSeed:1},rarityPower:{version:1,valueMultiplier:power,effectMultiplier:power}};delete i.copy;s.items[id]=i;p.inventory.push(id);if(copy){s.items[id+'-origin']={...i,id:id+'-origin',owner:'removed'};i.copy={sourceId:id+'-origin',number:1,valuePercent:25};}return i;}
function commission(s:AppraisalState,price=100,seat=1,copy=false){const a=s.players[0]!,b=s.players[seat]!,source=Object.values(s.items).find(i=>i.owner.startsWith('npc:'))!;a.stock=[source.id];Object.assign(source,{base:price,ask:price,appraisedBy:a.id});delete source.commissionPaid;delete source.copy;if(copy)source.copy={sourceId:'sold-origin',number:1,valuePercent:25};purchase(s,b,a,[source.id],{condition:false});return source;}
let seq=0;function act(s:AppraisalState,seat:number,body:object){return applyAppraisalAction(s,{...body,playerId:s.players[seat]!.id,encounter:s.encounter,requestId:'sale-'+seq++} as AppraisalAction);}
function sale(s:AppraisalState,seat=0,buyer=1,credits=10,kind:ItemKind='orc-tusk-shield',copy=false){const item=give(s,kind,seat,1,copy);s.listings.push({ownerId:s.players[seat]!.id,itemId:item.id,purchase:true});s=act(s,buyer,{type:'propose',sellerId:s.players[seat]!.id,itemId:item.id,credits,condition:false});return {s,item,offer:s.trades.at(-1)!};}

test('E13 uses actual commission, caps each settlement2 and player run8, and funds only free bank',()=>{
 const s=make();give(s,'orc-tally-beads',0,8);const before=s.players[0]!.credits;for(let i=0;i<6;i++)commission(s,100);assert.equal(s.players[0]!.credits-before,60+8);assert.equal(s.ledger.filter(l=>l.reason==='native-commission-bonus').reduce((n,l)=>n+l.amount,0),8);
 const low=make();give(low,'orc-tally-beads',0,8);low.bank=10+low.market.budget+low.reservedRewards;const i=Object.values(low.items).find(i=>i.owner.startsWith('npc:'))!;i.appraisedBy='alice';Reflect.apply(completeAppraisedSale,undefined,[low,i,100,undefined,low.players[1]!]);assert.equal(low.ledger.filter(l=>l.reason==='native-commission-bonus').length,0);
});
test('E13 excludes self-purchases, copied goods, dead/locked/outside tools and archived effects3',()=>{
 for(const mode of ['self','copy','lock','vault','old','dead','loan'] as const){const s=make(),t=give(s,'orc-tally-beads',0,8);if(mode==='old')s.config.native56Effects=3;if(mode==='lock')grant(s,s.players[0]!,'D09',t.id);if(mode==='vault')t.owner='vault:alice';if(mode==='dead')s.players[0]!.life=0;if(mode==='loan')s.players[0]!.npcContracts={alien:{lentAt:1,dueAt:3,itemIds:[t.id],key:'loan',reservedCredits:0}};commission(s,100,mode==='self'?0:1,mode==='copy');assert.equal(s.ledger.filter(l=>l.reason==='native-commission-bonus').length,0,mode);}
});
test('E16 original paid trade restores both eligible parties, no duplicate by retry or same pair in later encounter',()=>{
 let s=make();give(s,'orc-bone-war-drum',0);give(s,'deepsea-kelp-saddle',1);const run=sale(s);s=run.s;const reply={type:'respond',offerId:run.offer.id,accept:true,playerId:'alice',requestId:'settle',encounter:1} as const;s=applyAppraisalAction(s,reply);assert.deepEqual(s.players.map(p=>p.energy),[3,3,2]);assert.deepEqual(applyAppraisalAction(s,reply),s);
 s.encounter++;const again=sale(s);s=act(again.s,0,{type:'respond',offerId:again.offer.id,accept:true});assert.deepEqual(s.players.map(p=>p.energy),[3,3,2]);
});
test('E16 requires tools before offer and settlement, paid original goods and one benefit per player encounter',()=>{
 for(const mode of ['late','lost','copy','gift','reject','old'] as const){let s=make();const tool=mode==='late'?undefined:give(s,'orc-bone-war-drum');if(mode==='old')s.config.native56Effects=3;const run=sale(s,0,1,mode==='gift'?0:10,'orc-tusk-shield',mode==='copy');s=run.s;if(mode==='late')give(s,'orc-bone-war-drum');if(mode==='lost'){s.players[0]!.inventory=s.players[0]!.inventory.filter(id=>id!==tool!.id);s.items[tool!.id]!.owner='removed';}s=act(s,0,{type:'respond',offerId:run.offer.id,accept:mode!=='reject'});assert.equal(s.players[0]!.energy,2,mode);}
 let s=make();give(s,'orc-bone-war-drum',0,8);const first=sale(s);s=act(first.s,0,{type:'respond',offerId:first.offer.id,accept:true});const next=sale(s,0,2);s=act(next.s,0,{type:'respond',offerId:next.offer.id,accept:true});assert.equal(s.players[0]!.energy,4,'family cap2 and per-encounter1');
});
test('trade DTO never exposes internal held-item snapshots',()=>{let s=make();const tool=give(s,'orc-bone-war-drum');s=sale(s).s;assert(!JSON.stringify(appraisalViewFor(s,'bob').trades).includes(tool.id));});

test('E13 rarity/copy floors are based on actual commission and hidden tool truth never changes held benefit',()=>{
 for(const [power,copy,expected] of [[1,false,1],[1,true,0],[8,true,2]] as const){const s=make(),t=give(s,'orc-tally-beads',0,power,copy);t.genuine=false;t.cursed=true;commission(s,100);assert.equal(s.ledger.filter(l=>l.reason==='native-commission-bonus').reduce((n,l)=>n+l.amount,0),expected);}
});
test('E13 public cross-shop purchase grants the bonus once and journals its separate cause',()=>{
 let s=make();give(s,'orc-tally-beads');const a=s.players[0]!,source=Object.values(s.items).find(i=>i.owner.startsWith('npc:'))!;a.stock=[source.id];Object.assign(source,{base:100,ask:100,appraisedBy:a.id});s.listings.push({ownerId:a.id,itemId:source.id,purchase:true});s=act(s,1,{type:'propose',sellerId:a.id,itemId:source.id,credits:0,condition:false});
 const reply={type:'respond',offerId:s.trades.at(-1)!.id,accept:true,playerId:'alice',requestId:'commission-settle',encounter:1} as const;s=applyAppraisalAction(s,reply);assert.equal(s.ledger.find(l=>l.reason==='native-commission-bonus')!.amount,1);assert.deepEqual(applyAppraisalAction(s,reply),s);assert(s.players[0]!.journal!.at(-1)!.cause.includes('ลูกปัดนับชัย'));
});
test('E16 goods origin cannot earn again with a different pair and copied tool origin cannot pay twice in one encounter',()=>{
 let s=make();give(s,'orc-bone-war-drum');give(s,'deepsea-kelp-saddle',1);const first=sale(s);s=act(first.s,0,{type:'respond',offerId:first.offer.id,accept:true});s.encounter++;s.listings.push({ownerId:'bob',itemId:first.item.id,purchase:true});s=act(s,2,{type:'propose',sellerId:'bob',itemId:first.item.id,credits:10,condition:false});s=act(s,1,{type:'respond',offerId:s.trades.at(-1)!.id,accept:true});assert.equal(s.players[1]!.energy,3,'goods origin already paid');
 let shared=make();const tool=give(shared,'orc-bone-war-drum',0,8),copy=give(shared,'orc-bone-war-drum',1,8,true);copy.copy!.sourceId=tool.id;const r=sale(shared);shared=act(r.s,0,{type:'respond',offerId:r.offer.id,accept:true});assert.deepEqual(shared.players.map(p=>p.energy),[4,2,2],'shared tool origin follows canonical seller then buyer order');
});
test('E16 net-zero rebate and swaps cannot farm energy, and rejected offer leaves the pair unused',()=>{
 let s=make();give(s,'orc-bone-war-drum');let r=sale(s);r.s.listings.find(l=>l.itemId===r.item.id)!.rebate=10;s=act(r.s,0,{type:'respond',offerId:r.offer.id,accept:true});assert.equal(s.players[0]!.energy,2);
 r=sale(s);s=act(r.s,0,{type:'respond',offerId:r.offer.id,accept:false});r=sale(s);s=act(r.s,0,{type:'respond',offerId:r.offer.id,accept:true});assert.equal(s.players[0]!.energy,3);
 const swap=make();give(swap,'orc-bone-war-drum');const goods=give(swap,'orc-tusk-shield'),other=give(swap,'vampire-nocturne-signet',1);swap.listings.push({ownerId:'alice',itemId:goods.id,purchase:true});let next=act(swap,1,{type:'propose',sellerId:'alice',itemId:goods.id,swapItemId:other.id,credits:10,condition:false});next=act(next,0,{type:'respond',offerId:next.trades.at(-1)!.id,accept:true});assert.equal(next.players[0]!.energy,2);
});

test('E16 copy rounding, missing-energy cap and D10 use existing recovery semantics',()=>{
 for(const [power,copy,expected] of [[1,true,2],[8,true,4]] as const){let s=make();give(s,'orc-bone-war-drum',0,power,copy);const r=sale(s);s=act(r.s,0,{type:'respond',offerId:r.offer.id,accept:true});assert.equal(s.players[0]!.energy,expected);}
 let s=make();give(s,'orc-bone-war-drum',0,8);s.players[0]!.energy=9;let r=sale(s);s=act(r.s,0,{type:'respond',offerId:r.offer.id,accept:true});assert.equal(s.players[0]!.energy,10);
 s=make();give(s,'orc-bone-war-drum',0,8);grant(s,s.players[0]!,'D10');r=sale(s);s=act(r.s,0,{type:'respond',offerId:r.offer.id,accept:true});assert.equal(s.players[0]!.energy,2);
});
test('E13 bonus does not inflate canonical sold units, gross or trust accomplishments',()=>{
 const facts=(tool:boolean)=>{const s=make();s.config.personalScoringRules=1;s.config.personalScoringFacts=2;s.personalPerformance={version:1,facts:[]};if(tool)give(s,'orc-tally-beads',0,8);commission(s,100);return s.personalPerformance!.facts.map(f=>({metric:f.metric,raw:f.raw}));};assert.deepEqual(facts(true),facts(false));
});

import {once} from 'node:events';import type {AddressInfo} from 'node:net';import {WebSocket} from 'ws';
import {AppraisalRoomService} from '../src/server/appraisal-rooms.js';import {createApp} from '../src/server/app.js';
import type {AppraisalRoomView,AppraisalServerMessage} from '../src/shared/appraisal-protocol.js';
class SalesRooms extends AppraisalRoomService {
 protected override createGame(ids:string[],_seed:string){const s=make(ids);give(s,'orc-bone-war-drum',0,8);give(s,'deepsea-kelp-saddle',1,8);give(s,'orc-tally-beads');const goods=give(s,'orc-tusk-shield');s.listings.push({ownerId:ids[0]!,itemId:goods.id,purchase:true});const source=Object.values(s.items).find(i=>i.owner.startsWith('npc:'))!;s.players[0]!.stock=[source.id];Object.assign(source,{base:100,ask:100,appraisedBy:ids[0]!});s.listings.push({ownerId:ids[0]!,itemId:source.id,purchase:true});return s;}
 state(code:string){return this.rooms.get(code)!.game!;}
}
class Client {
 messages:AppraisalServerMessage[]=[];constructor(readonly ws:WebSocket){ws.on('message',raw=>this.messages.push(JSON.parse(String(raw))));}
 static async open(url:string){const ws=new WebSocket(url),c=new Client(ws);await once(ws,'open');return c;}
 send(m:object){this.ws.send(JSON.stringify(m));}
 get room():AppraisalRoomView{const m=this.messages.findLast(m=>m.type==='state');assert(m?.type==='state');return m.room;}
 async wait(fn:()=>boolean){for(let n=0;n<500;n++){if(fn())return;await new Promise(r=>setTimeout(r,5));}throw Error('sales socket condition timeout');}
}
test('two actual sockets settle E16 and E13, hide custody snapshots, reconnect and retry without double benefit',{timeout:15000},async t=>{
 const rooms=new SalesRooms(()=>1000,{},60000),app=createApp({rooms}),clients:Client[]=[];t.after(()=>{for(const c of clients)c.ws.terminate();void app.close();});app.server.listen(0,'127.0.0.1');await once(app.server,'listening');const url=`ws://127.0.0.1:${(app.server.address() as AddressInfo).port}/socket`,a=await Client.open(url),b=await Client.open(url);clients.push(a,b);
 a.send({type:'create',name:'Alice'});await a.wait(()=>a.messages.some(m=>m.type==='state'));b.send({type:'join',name:'Bob',roomCode:a.room.code});await b.wait(()=>b.messages.some(m=>m.type==='state'));for(const c of clients)c.send({type:'ready',ready:true});await a.wait(()=>a.room.seats.every(s=>s.ready));a.send({type:'start'});await b.wait(()=>!!b.room.game);
 let seq=0;const send=async(c:Client,body:object)=>{const action={...body,requestId:'sales-wire-'+seq++,encounter:1};c.send({type:'action',matchId:c.room.matchId,action});await c.wait(()=>c.messages.some(m=>(m.type==='ack'||m.type==='error')&&m.requestId===action.requestId));const result=c.messages.findLast(m=>(m.type==='ack'||m.type==='error')&&m.requestId===action.requestId)!;assert.equal(result.type,'ack',JSON.stringify(result));const revision=rooms.state(a.room.code).revision;for(const peer of clients)if(peer.ws.readyState===WebSocket.OPEN)await peer.wait(()=>peer.room.game!.revision===revision);return action;};
 const state=rooms.state(a.room.code),alice=state.players[0]!,goods=alice.inventory.map(id=>state.items[id]!).find(i=>i.kind==='orc-tusk-shield')!,before=alice.credits;
 await send(b,{type:'propose',sellerId:alice.id,itemId:goods.id,credits:10,condition:false});const offer=a.room.game!.trades.at(-1)!;assert(!('nativeEnergyTools' in offer));await send(a,{type:'respond',offerId:offer.id,accept:true});assert.equal(a.room.game!.self.energy,4);assert.equal(b.room.game!.self.energy,4);assert.equal(a.room.game!.self.credits,before+10);
 const joined=a.messages.findLast(m=>m.type==='joined');assert(joined?.type==='joined');a.ws.terminate();const resumed=await Client.open(url);clients.push(resumed);resumed.send({type:'resume',roomCode:b.room.code,token:joined.token});await resumed.wait(()=>resumed.messages.some(m=>m.type==='state'));assert.equal(resumed.room.game!.self.energy,4);
 const npc=rooms.state(b.room.code).players[0]!.stock[0]!;await send(b,{type:'propose',sellerId:alice.id,itemId:npc,credits:0,condition:false});const reply=await send(resumed,{type:'respond',offerId:resumed.room.game!.trades.at(-1)!.id,accept:true});assert.equal(resumed.room.game!.self.credits,before+21);const paid=structuredClone(rooms.state(b.room.code));const acks=resumed.messages.filter(m=>m.type==='ack'&&m.requestId===reply.requestId).length;resumed.send({type:'action',matchId:resumed.room.matchId,action:reply});await resumed.wait(()=>resumed.messages.filter(m=>m.type==='ack'&&m.requestId===reply.requestId).length===acks+1);assert.deepEqual(rooms.state(b.room.code),paid);
});

import fs from 'node:fs';import crypto from 'node:crypto';import {gunzipSync} from 'node:zlib';
import {replayAppraisalAudit} from '../src/game/appraisal/audit.js';
test('sealed effects3 quote-enabled normal games keep their exact replay semantics',()=>{
 const repo=new URL('../../../../',import.meta.url),base='docs/validation/recovery-quote-2026-11-04/compatibility/',report=JSON.parse(fs.readFileSync(new URL(base+'report.json',repo),'utf8'));
 for(const c of report.cases){const bytes=fs.readFileSync(new URL(base+c.audit,repo));assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),c.sha256);const raw=gunzipSync(bytes);assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),c.rawSha256);const state=replayAppraisalAudit(JSON.parse(raw.toString()));assert.equal(state.phase,'RESULTS');assert.equal(state.config.native56Effects,3);assert.equal(state.config.recoveryQuoteRules,1);}
});

test('effects4 sealed full-game archives pin24primary kinds and replay without upgrading config',()=>{
 const repo=new URL('../../../../',import.meta.url),receipt=JSON.parse(fs.readFileSync(new URL('docs/game-design/native56-stage4.json',repo),'utf8'));assert.equal(receipt.native56Effects,4);assert.equal(receipt.implementedPrimaryItemIds.length,24);
 for(const c of receipt.archives){const bytes=fs.readFileSync(new URL(c.file,repo));assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),c.sha256);const raw=gunzipSync(bytes);assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),c.rawSha256);const s=replayAppraisalAudit(JSON.parse(raw.toString()));assert.equal(s.phase,'RESULTS');assert.equal(s.config.native56Effects,4);}
});

test('E16 first eligible recovery consumes encounter and origin rights even when D10 blocks the gain',()=>{
 let s=make();give(s,'orc-bone-war-drum',0,8);grant(s,s.players[0]!,'D10');let r=sale(s);s=act(r.s,0,{type:'respond',offerId:r.offer.id,accept:true});assert.equal(s.players[0]!.energy,2);s.players[0]!.statuses=s.players[0]!.statuses.filter(x=>x.id!=='D10');r=sale(s,0,2);s=act(r.s,0,{type:'respond',offerId:r.offer.id,accept:true});assert.equal(s.players[0]!.energy,2,'cleansing D10 later cannot grant another E16 recovery in the same encounter');
});
