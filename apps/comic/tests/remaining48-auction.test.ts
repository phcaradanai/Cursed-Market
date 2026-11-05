import test from 'node:test';import assert from 'node:assert/strict';
import {createAppraisalRun,applyAppraisalAction,appraisalViewFor} from '../src/game/appraisal/index.js';
import {placeBid,settleAuction,vaultSale} from '../src/game/appraisal/brokerage.js';
import {grant} from '../src/game/appraisal/mechanics.js';
import type {AppraisalState,AppraisalItem,AppraisalAction,AuctionLot} from '../src/game/appraisal/types.js';
function make(ids=['alice','bob']){const s=createAppraisalRun(ids,'auction-contract',{catalogVersion:5,startingCredits:500,core2:false,npcEvents:false,polish:false,marketProbability:0,commerce:true,secureEconomy:true,trustAbilities:true,brokerage:{auctionProbability:1,maxLots:4,bondProbability:0},survival:{maxLife:6,encounterLifeCost:1,entryEnergyCost:0}});s.phase='TRADE';s.market.lots=[];s.vault=[];for(const p of s.players){p.eventOffer=null;p.done=false;p.personalVault={items:[],credits:0,slots:3};}return s;}
function invitation(s:AppraisalState,power=1,copy=false){const p=s.players[0]!,source=Object.values(s.items)[0]!,id='invite-'+Object.keys(s.items).length;const i:AppraisalItem={...source,id,kind:'vampire-midnight-invitation',owner:p.id,appearance:{version:1,rarity:power===8?'mythic':'common',theme:'plain',visualSeed:1},rarityPower:{version:1,valueMultiplier:power,effectMultiplier:power}};delete i.copy;delete i.appraisedBy;s.items[id]=i;p.inventory.push(id);if(copy){s.items[id+'-origin']={...i,id:id+'-origin',owner:'removed'};i.copy={sourceId:id+'-origin',number:1,valuePercent:25};}return i;}
function lot(s:AppraisalState,seller='bob',copy=false){const id='auction-'+Object.keys(s.items).length,source=Object.values(s.items)[0]!;const item:AppraisalItem={...source,id,kind:'orc-tusk-shield',owner:'dark-market',appearance:{version:1,rarity:'common',theme:'plain',visualSeed:1},rarityPower:{version:1,valueMultiplier:1,effectMultiplier:1}};delete item.appraisedBy;delete item.copy;Object.assign(item,{nativeAuctionSellerId:seller});if(copy){s.items[id+'-origin']={...item,id:id+'-origin',owner:'removed'};item.copy={sourceId:id+'-origin',number:1,valuePercent:25};}s.items[id]=item;s.vault!.push(id);const entry:AuctionLot={id:'lot-'+id,itemId:id,minimum:1,bids:{}};s.market.lots!.push(entry);return entry;}
let seq=0;const act=(s:AppraisalState,body:object,playerId='alice')=>applyAppraisalAction(s,{...body,playerId,encounter:s.encounter,requestId:'auction-'+seq++} as AppraisalAction);
const rebates=(s:AppraisalState)=>s.ledger.filter(l=>l.reason==='native-auction-rebate').reduce((n,l)=>n+l.amount,0);
test('E22 pays actual winning-price rebate with rarity/copy floors, per-win3 and per-run6 from bank',()=>{
 for(const [power,copy,paid,expected] of [[1,false,20,1],[1,true,20,0],[8,true,20,2],[8,false,100,3]] as const){const s=make();invitation(s,power,copy);const l=lot(s),before=s.players[0]!.credits,bank=s.bank;placeBid(s,s.players[0]!,l.id,paid);settleAuction(s);assert.equal(rebates(s),expected);assert.equal(s.players[0]!.credits,before-paid+expected);assert.equal(s.bank,bank+paid-expected);assert.equal(s.items[l.itemId]!.lastTradePrice,paid);const settled=structuredClone(s);settleAuction(s);assert.deepEqual(s,settled);}
 const s=make();invitation(s,8);for(let n=0;n<3;n++){const l=lot(s);placeBid(s,s.players[0]!,l.id,100);settleAuction(s);}assert.equal(rebates(s),6);
});
test('E22 requires invitation at first positive bid, and withdrawal/rebid cannot reset that start',()=>{
 for(const withdraw of [false,true]){const s=make(),l=lot(s);placeBid(s,s.players[0]!,l.id,20);if(withdraw)placeBid(s,s.players[0]!,l.id,0);invitation(s,8);placeBid(s,s.players[0]!,l.id,30);settleAuction(s);assert.equal(rebates(s),0);}
});
test('E22 actual funded loan and repayment break continuous custody irreversibly, including after bid withdrawal',()=>{
 for(const withdraw of [false,true]){let s=make();const i=invitation(s,8),l=lot(s);s=act(s,{type:'bid',lotId:l.id,credits:30});if(withdraw)s=act(s,{type:'bid',lotId:l.id,credits:0});s.items[i.id]!.lastTradePrice=40;s=act(s,{type:'loan-propose',lenderId:'bob',itemId:i.id,principal:20});const loanId=s.loans!.at(-1)!.id;s=act(s,{type:'loan-respond',loanId,accept:true},'bob');s=act(s,{type:'loan-repay',loanId,amount:20});s=act(s,{type:'bid',lotId:l.id,credits:30});settleAuction(s);assert.equal(rebates(s),0);}
});
test('E22 excludes self-origin, copied auction goods, locked/dead invitation, losing and unpaid bids',()=>{
 for(const mode of ['self','copy','lock','dead','lose','unfunded','old'] as const){const s=make(),i=invitation(s,8),l=lot(s,mode==='self'?'alice':'bob',mode==='copy');if(mode==='old')s.config.native56Effects=4;placeBid(s,s.players[0]!,l.id,30);if(mode==='lock')grant(s,s.players[0]!,'D09',i.id);if(mode==='dead'){s.players[0]!.life=0;s.players[0]!.paused='dead';}if(mode==='lose')placeBid(s,s.players[1]!,l.id,40);if(mode==='unfunded')s.players[0]!.credits=0;settleAuction(s);assert.equal(rebates(s),0,mode);}
});
test('E22 B20 discounted payment is the rebate base, and private snapshots never appear in market DTO',()=>{
 const s=make();s.config.polish=true;invitation(s,8);grant(s,s.players[0]!,'B20');const l=lot(s);placeBid(s,s.players[0]!,l.id,20);const dto=appraisalViewFor(s,'bob').market;assert(!JSON.stringify(dto).includes('nativeInvitations'));assert.equal(dto.lots![0]!.yourBid,null);settleAuction(s);assert.equal(l.price,16);assert.equal(rebates(s),1);assert(s.players[0]!.notes.some(n=>n.includes('บัตรเชิญเที่ยงคืน')));
});
test('E22 goods provenance follows actual owner on entry to market vault',()=>{
 const s=make(),i=invitation(s);vaultSale(s,i);assert.equal((i as AppraisalItem&{nativeAuctionSellerId?:string}).nativeAuctionSellerId,'alice');
});

test('E22 original goods cannot earn a second rebate in another lot and zero-rounded win consumes origin',()=>{
 const s=make(),i=invitation(s),first=lot(s);placeBid(s,s.players[0]!,first.id,1);settleAuction(s);assert.equal(rebates(s),0);s.players[0]!.inventory=s.players[0]!.inventory.filter(id=>id!==first.itemId);const goods=s.items[first.itemId]!;goods.owner='dark-market';Object.assign(goods,{nativeAuctionSellerId:'bob'});s.vault!.push(goods.id);const next:AuctionLot={id:'relot',itemId:goods.id,minimum:1,bids:{}};s.market.lots!.push(next);i.rarityPower!.effectMultiplier=8;placeBid(s,s.players[0]!,next.id,100);settleAuction(s);assert.equal(rebates(s),0,'first eligible paid win consumes original even if floor0');
});
test('E22 consign and normal market sale capture the actor rather than a previous appraiser',()=>{
 let s=make();const p=s.players[0]!,source=Object.values(s.items).find(i=>i.owner.startsWith('npc:')&&i.npcOwnerId===p.id)!;p.stock=[source.id];p.selectedPortalId=p.portals[0]!.id;s.phase='APPRAISAL';s=act(s,{type:'appraise',itemId:source.id,value:source.base});s=act(s,{type:'unsold',itemId:source.id,choice:'consign'});assert.equal(s.items[source.id]!.nativeAuctionSellerId,'alice');
 s=make();const item=invitation(s);item.appraisedBy='bob';s.market.open=true;s.market.budget=10;s.market.orders=[{id:'order',kind:item.kind,price:10,quota:{alice:1,bob:0}}];s=act(s,{type:'market-sell',itemId:item.id,orderId:'order'});assert.equal(s.items[item.id]!.nativeAuctionSellerId,'alice');
});
test('E22 first bid and snapshot reads are stable across retry and reconnect',()=>{
 let s=make();invitation(s);const l=lot(s),command={type:'bid',lotId:l.id,credits:30,playerId:'alice',requestId:'first-bid',encounter:1} as const;s=applyAppraisalAction(s,command);assert.deepEqual(applyAppraisalAction(s,command),s);const before=structuredClone(s);appraisalViewFor(s,'alice');appraisalViewFor(s,'bob');assert.deepEqual(s,before);const resumed=structuredClone(s);settleAuction(resumed);assert.equal(rebates(resumed),1);
});

import {once} from 'node:events';import type {AddressInfo} from 'node:net';import {WebSocket} from 'ws';
import {AppraisalRoomService} from '../src/server/appraisal-rooms.js';import {createApp} from '../src/server/app.js';
import type {AppraisalRoomView,AppraisalServerMessage} from '../src/shared/appraisal-protocol.js';
class AuctionRooms extends AppraisalRoomService {
 protected override createGame(ids:string[],_seed:string){const s=make(ids),i=invitation(s,8);i.lastTradePrice=40;lot(s,s.players[1]!.id);return s;}
 state(code:string){return this.rooms.get(code)!.game!;}
}
class Client {
 messages:AppraisalServerMessage[]=[];constructor(readonly ws:WebSocket){ws.on('message',raw=>this.messages.push(JSON.parse(String(raw))));}
 static async open(url:string){const ws=new WebSocket(url),c=new Client(ws);await once(ws,'open');return c;}
 send(m:object){this.ws.send(JSON.stringify(m));}
 get room():AppraisalRoomView{const m=this.messages.findLast(m=>m.type==='state');assert(m?.type==='state');return m.room;}
 async wait(fn:()=>boolean){for(let n=0;n<700;n++){if(fn())return;await new Promise(r=>setTimeout(r,5));}throw Error('auction socket condition timeout');}
}
for(const interrupted of [false,true])test(`two actual sockets: E22 custody${interrupted?' gap':' retained'} survives resume and settlement retry`,{timeout:15000},async t=>{
 const rooms=new AuctionRooms(()=>1000,{},60000),app=createApp({rooms}),clients:Client[]=[];t.after(()=>{for(const c of clients)c.ws.terminate();void app.close();});app.server.listen(0,'127.0.0.1');await once(app.server,'listening');const url=`ws://127.0.0.1:${(app.server.address() as AddressInfo).port}/socket`;let a=await Client.open(url);const b=await Client.open(url);clients.push(a,b);a.send({type:'create',name:'Alice'});await a.wait(()=>a.messages.some(m=>m.type==='state'));b.send({type:'join',name:'Bob',roomCode:a.room.code});await b.wait(()=>b.messages.some(m=>m.type==='state'));for(const c of clients)c.send({type:'ready',ready:true});await a.wait(()=>a.room.seats.every(s=>s.ready));a.send({type:'start'});await b.wait(()=>!!b.room.game);
 let seq=0;const send=async(c:Client,body:object)=>{const action={...body,requestId:'auction-wire-'+seq++,encounter:1};c.send({type:'action',matchId:c.room.matchId,action});await c.wait(()=>c.messages.some(m=>(m.type==='ack'||m.type==='error')&&m.requestId===action.requestId));const response=c.messages.findLast(m=>(m.type==='ack'||m.type==='error')&&m.requestId===action.requestId)!;assert.equal(response.type,'ack',JSON.stringify(response));const rev=rooms.state(b.room.code).revision;for(const peer of clients)if(peer.ws.readyState===WebSocket.OPEN)await peer.wait(()=>peer.room.game!.revision===rev);return action;};
 const first=a.room.game!.market.lots![0]!,before=a.room.game!.self.credits;await send(a,{type:'bid',lotId:first.id,credits:30});assert.equal(b.room.game!.market.lots![0]!.yourBid,null);assert(!JSON.stringify(b.room.game!.market).includes('nativeInvitations'));
 if(interrupted){const i=a.room.game!.self.inventory.find(i=>i.kind==='vampire-midnight-invitation')!;await send(a,{type:'loan-propose',lenderId:b.room.game!.self.id,itemId:i.id,principal:20});const id=rooms.state(b.room.code).loans!.at(-1)!.id;await send(b,{type:'loan-respond',loanId:id,accept:true});await send(a,{type:'loan-repay',loanId:id,amount:20});}
 const joined=a.messages.findLast(m=>m.type==='joined');assert(joined?.type==='joined');a.ws.terminate();a=await Client.open(url);clients.push(a);a.send({type:'resume',roomCode:b.room.code,token:joined.token});await a.wait(()=>a.messages.some(m=>m.type==='state'));assert.equal(a.room.game!.market.lots![0]!.yourBid,30);
 await send(a,{type:'done'});const final=await send(b,{type:'done'});assert.equal(a.room.game!.phase,'REVEAL');assert.equal(a.room.game!.self.credits,before-30+(interrupted?0:3));const paid=structuredClone(rooms.state(b.room.code)),acks=b.messages.filter(m=>m.type==='ack'&&m.requestId===final.requestId).length;b.send({type:'action',matchId:b.room.matchId,action:final});await b.wait(()=>b.messages.filter(m=>m.type==='ack'&&m.requestId===final.requestId).length===acks+1);assert.deepEqual(rooms.state(b.room.code),paid);
});

test('E22 held tool and non-copy auction authenticity/curse never leak through views or rebate',()=>{
 const s=make(),i=invitation(s,8),l=lot(s);placeBid(s,s.players[0]!,l.id,30);const opposite=structuredClone(s);for(const id of [i.id,l.itemId]){opposite.items[id]!.genuine=!s.items[id]!.genuine;opposite.items[id]!.cursed=!s.items[id]!.cursed;}
 assert.deepEqual(appraisalViewFor(s,'alice'),appraisalViewFor(opposite,'alice'));settleAuction(s);settleAuction(opposite);assert.equal(rebates(s),3);assert.equal(rebates(opposite),3);
});

import fs from 'node:fs';import crypto from 'node:crypto';import {gunzipSync} from 'node:zlib';
import {replayAppraisalAudit} from '../src/game/appraisal/audit.js';
test('effects5 sealed normal-game archives pin25primary kinds and preserve their config on replay',()=>{
 const repo=new URL('../../../../',import.meta.url),receipt=JSON.parse(fs.readFileSync(new URL('docs/game-design/native56-stage5.json',repo),'utf8'));assert.equal(receipt.native56Effects,5);assert.equal(receipt.implementedPrimaryItemIds.length,25);
 for(const c of receipt.archives){const bytes=fs.readFileSync(new URL(c.file,repo));assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),c.sha256);const raw=gunzipSync(bytes);assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),c.rawSha256);const s=replayAppraisalAudit(JSON.parse(raw.toString()));assert.equal(s.phase,'RESULTS');assert.equal(s.config.native56Effects,5);}
});
