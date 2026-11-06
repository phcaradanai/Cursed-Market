import test from 'node:test';
import assert from 'node:assert/strict';
import {createAppraisalRun,applyAppraisalAction,appraisalViewFor} from '../src/game/appraisal/index.js';
import {pilotUses,swordForDuel} from '../src/game/appraisal/pilot-effects.js';
import {remainingEffectReady} from '../src/game/appraisal/remaining48-effects.js';
import {eligibleItems} from '../src/game/appraisal/theft.js';
import {randomAt} from '../src/game/random.js';
import {passiveText} from '../src/appraisal-client/catalog-text.js';
import type {AppraisalAction,AppraisalItem,AppraisalState,Appraiser,ItemKind} from '../src/game/appraisal/types.js';

let seq=0;
function make(revision:2|3|4|5|6|7|8|9|10|11|15=7,playerIds=['alice','bob'],bankReserve=2000) {
 const s=createAppraisalRun(playerIds,'e38-'+revision,{catalogVersion:5,native56Effects:revision,secureEconomy:true,core2:true,marketProbability:0,startingCredits:100,bankReserve});
 s.phase='TRADE';
 for(const p of s.players){p.done=false;p.paused=null;p.eventOffer=null;p.energy=8;p.stock=[...p.portals[0]!.stock];p.selectedPortalId=p.portals[0]!.id;delete p.abilityChoice;}
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
function start(s:AppraisalState,thiefId='alice',victimId='bob') { return act(s,thiefId,{type:'theft-start',victimId}); }
function hand(s:AppraisalState,playerId:string,round:number,choice:'rock'|'paper'|'scissors') {
 return act(s,playerId,{type:'theft-hand',duelId:s.theftDuels![0]!.id,round,hand:choice});
}
function startNpc(s:AppraisalState,itemId=s.players[0]!.stock[0]!) { s.items[itemId]!.npc='autometa';return act(s,'alice',{type:'theft-start',itemId}); }
function loseNpc(s:AppraisalState) {
 const duel=s.theftDuels!.at(-1)!;assert(duel.hands.npc);
 const loser:Record<'rock'|'paper'|'scissors','rock'|'paper'|'scissors'>={rock:'scissors',paper:'rock',scissors:'paper'};
 return act(s,duel.thiefId,{type:'theft-hand',duelId:duel.id,round:duel.round,hand:loser[duel.hands.npc]});
}
function seedForTarget(s:AppraisalState,thiefId:string,victimId:string,itemId:string) {
 const victim=s.players.find(p=>p.id===victimId)!,eligible=eligibleItems(s,victim),index=eligible.indexOf(itemId);assert(index>=0);
 const key=`${s.encounter}:${thiefId}:${victimId}:theft-item`;
 for(let n=0;n<10000;n++){const seed=`e42-target-${n}`;if(Math.floor(randomAt(seed,key)*eligible.length)===index){s.seed=seed;return;}}
 assert.fail('could not find deterministic theft target seed');
}
function finishPvp(s:AppraisalState,thiefId='alice',victimId='bob') {
 let next=start(s,thiefId,victimId),duel=next.theftDuels!.at(-1)!;
 next=act(next,thiefId,{type:'theft-hand',duelId:duel.id,round:duel.round,hand:'rock'});
 duel=next.theftDuels!.at(-1)!;return act(next,victimId,{type:'theft-hand',duelId:duel.id,round:duel.round,hand:'scissors'});
}
function addOriginal(s:AppraisalState,owner:Appraiser,id:string,base=24,lastTradePrice=24) {
 const item:AppraisalItem={id,kind:'orc-tusk-shield',base,genuine:true,cursed:false,ask:base,owner:owner.id,npcOwnerId:owner.id,npc:'orc',encounter:s.encounter,certificate:false,lastAppraisal:null,lastTradePrice,reservation:0,lastAccepted:null};
 s.items[id]=item;owner.inventory.push(id);return item;
}

test('effects6 keeps E22 readiness and unlocks E38 without changing older readiness',()=>{
 assert.equal(remainingEffectReady('vampire-midnight-invitation',5),true);
 assert.equal(remainingEffectReady('vampire-midnight-invitation',6),true);
 assert.equal(remainingEffectReady('vampire-mooncut-sword',5),false);
 assert.equal(remainingEffectReady('vampire-mooncut-sword',6),true);
});

test('effects7 unlocks E40 only after effects6, while E22 and E38 stay ready',()=>{
 assert.equal(remainingEffectReady('autometa-clockwork-sentry',6),false);assert.equal(remainingEffectReady('autometa-clockwork-sentry',7),true);
 assert.equal(remainingEffectReady('vampire-midnight-invitation',7),true);assert.equal(remainingEffectReady('vampire-mooncut-sword',7),true);
});

test('effects9 unlocks E46 while preserving earlier theft effects and passive text',()=>{
 assert.equal(remainingEffectReady('vampire-mist-cloak',7),false);assert.equal(remainingEffectReady('vampire-mist-cloak',8),true);
 assert.equal(remainingEffectReady('autometa-clockwork-sentry',8),true);assert.equal(remainingEffectReady('vampire-mooncut-sword',8),true);
 assert.match(passiveText('vampire-mist-cloak',true,{nativeEffectReady:true}),/30%/);assert.equal(passiveText('vampire-mist-cloak',true,{nativeEffectReady:false}),'');
 assert.equal(remainingEffectReady('deepsea-tideglass-buoy',8),false);assert.equal(remainingEffectReady('deepsea-tideglass-buoy',9),true);
 assert.equal(remainingEffectReady('vampire-mist-cloak',9),true);assert.equal(remainingEffectReady('swarm-resin-spool',10),false);assert.equal(remainingEffectReady('swarm-resin-spool',11),true);assert.equal(remainingEffectReady('swarm-wing-membrane-glider',11),false);assert.equal(remainingEffectReady('swarm-wing-membrane-glider',12),true);assert.equal(remainingEffectReady('darkone-debt-chain',12),false);assert.equal(remainingEffectReady('darkone-debt-chain',13),true);assert.equal(remainingEffectReady('vampire-shadow-wine-decanter',12),false);assert.equal(remainingEffectReady('vampire-shadow-wine-decanter',13),true);assert.equal(remainingEffectReady('alien-spore-lantern',12),false);assert.equal(remainingEffectReady('alien-spore-lantern',13),true);assert.equal(remainingEffectReady('darkone-omen-censer',12),false);assert.equal(remainingEffectReady('darkone-omen-censer',13),true);assert.equal(remainingEffectReady('alien-star-chart-membrane',13),false);assert.equal(remainingEffectReady('alien-star-chart-membrane',14),true);assert.equal(remainingEffectReady('autometa-coolant-canister',13),false);assert.equal(remainingEffectReady('autometa-coolant-canister',14),true);assert.equal(createAppraisalRun(['a','b'],'default-native56',{catalogVersion:5}).config.native56Effects,14);
 assert.match(passiveText('deepsea-tideglass-buoy',true,{nativeEffectReady:true}),/ดอกเบี้ย/);assert.equal(passiveText('deepsea-tideglass-buoy',true,{nativeEffectReady:false}),'');
});

test('E42 pays only after a successful original PvP theft and preserves a private pre-duel cloak snapshot',()=>{
 const t=make(8),cloak=give(t.s,t.victim,'vampire-mist-cloak'),item=t.s.items[t.itemId]!;item.base=12;item.lastTradePrice=100;seedForTarget(t.s,'alice','bob',item.id);
 let s=start(t.s),duel=s.theftDuels![0]!;assert.equal(duel.itemId,item.id);assert.deepEqual(duel.insuranceItemIds,[cloak.id]);
 const publicDuel=appraisalViewFor(s,'alice').theft!.duels[0]!;assert.equal('insuranceItemIds' in publicDuel,false);
 s=act(s,'alice',{type:'theft-hand',duelId:duel.id,round:duel.round,hand:'rock'});s=act(s,'bob',{type:'theft-hand',duelId:duel.id,round:duel.round,hand:'scissors'});
 assert.equal(s.theftDuels![0]!.status,'won');assert.equal(s.items[item.id]!.owner,'alice');assert.equal(s.players[1]!.credits,t.victim.credits+2);
 assert.equal(s.bank,t.s.bank-2);assert.equal(s.ledger.at(-1)!.reason,'native-theft-insurance');assert.equal(s.native56TheftInsurance!.paid.bob,2);assert.deepEqual(s.native56TheftInsurance!.origins,[item.id]);
});

test('E42 clamps rarity stacking, per-loss and per-run payouts, and reserves bank obligations',()=>{
 const t=make(8),cloakA=give(t.s,t.victim,'vampire-mist-cloak'),cloakB=give(t.s,t.victim,'vampire-mist-cloak'),first=t.s.items[t.itemId]!;first.base=24;first.lastTradePrice=100;
 const second=addOriginal(t.s,t.victim,'victim-good-2',24,100);seedForTarget(t.s,'alice','bob',first.id);
 let s=start(t.s);assert.deepEqual(s.theftDuels![0]!.insuranceItemIds,[cloakA.id,cloakB.id]);
 s=act(s,'alice',{type:'theft-hand',duelId:s.theftDuels![0]!.id,round:1,hand:'rock'});s=act(s,'bob',{type:'theft-hand',duelId:s.theftDuels![0]!.id,round:1,hand:'scissors'});
 assert.equal(s.native56TheftInsurance!.paid.bob,4,'30% of24 is capped at4 per loss');
 s.encounter=2;s.phase='TRADE';for(const p of s.players){p.done=false;p.paused=null;p.stealTried=[];}
 seedForTarget(s,'alice','bob',second.id);s=finishPvp(s);
 assert.equal(s.native56TheftInsurance!.paid.bob,6,'per-run cap is6 across distinct origins');assert.deepEqual(new Set(s.native56TheftInsurance!.origins),new Set([first.id,second.id]));

 const poor=make(8,['alice','bob'],1),single=give(poor.s,poor.victim,'vampire-mist-cloak'),goods=poor.s.items[poor.itemId]!;goods.base=24;goods.lastTradePrice=100;
 seedForTarget(poor.s,'alice','bob',goods.id);const delivered=finishPvp(poor.s);
 assert.equal(delivered.native56TheftInsurance!.paid.bob,1);assert.equal(delivered.bank,poor.s.bank-1);assert.equal(delivered.players[1]!.credits,poor.victim.credits+1);assert(delivered.players[1]!.inventory.includes(single.id));
});

test('E42 requires the cloak before and through transfer; defense, cancellation, NPC theft and cloak theft pay nothing',()=>{
 const late=make(8);seedForTarget(late.s,'alice','bob',late.itemId);let s=start(late.s);give(s,s.players[1]!,'vampire-mist-cloak');s=act(s,'alice',{type:'theft-hand',duelId:s.theftDuels![0]!.id,round:1,hand:'rock'});s=act(s,'bob',{type:'theft-hand',duelId:s.theftDuels![0]!.id,round:1,hand:'scissors'});assert.equal(s.native56TheftInsurance,undefined);
 const moved=make(8),cloak=give(moved.s,moved.victim,'vampire-mist-cloak');seedForTarget(moved.s,'alice','bob',moved.itemId);let opened=start(moved.s);opened.players[1]!.inventory=opened.players[1]!.inventory.filter(id=>id!==cloak.id);opened.items[cloak.id]!.owner='alice';opened.players[0]!.inventory.push(cloak.id);opened=act(opened,'alice',{type:'theft-hand',duelId:opened.theftDuels![0]!.id,round:1,hand:'rock'});opened=act(opened,'bob',{type:'theft-hand',duelId:opened.theftDuels![0]!.id,round:1,hand:'scissors'});assert.equal(opened.theftDuels![0]!.status,'won');assert.equal(opened.native56TheftInsurance,undefined);
 const lost=make(8);give(lost.s,lost.victim,'vampire-mist-cloak');seedForTarget(lost.s,'alice','bob',lost.itemId);s=start(lost.s);s=act(s,'alice',{type:'theft-hand',duelId:s.theftDuels![0]!.id,round:1,hand:'rock'});s=act(s,'bob',{type:'theft-hand',duelId:s.theftDuels![0]!.id,round:1,hand:'paper'});assert.equal(s.theftDuels![0]!.status,'lost');assert.equal(s.native56TheftInsurance,undefined);
 const npc=make(8);give(npc.s,npc.thief,'vampire-mist-cloak');const npcItem=npc.s.players[0]!.stock[0]!;s=loseNpc(startNpc(npc.s,npcItem));assert.equal(s.native56TheftInsurance,undefined);
 const copy=make(8),copyCloak=give(copy.s,copy.victim,'vampire-mist-cloak');addOriginal(copy.s,copy.victim,'root-origin');copy.s.items[copy.itemId]!.copy={sourceId:'root-origin',number:1,valuePercent:50};seedForTarget(copy.s,'alice','bob',copy.itemId);s=finishPvp(copy.s);assert.equal(s.native56TheftInsurance,undefined);assert(copyCloak);
});

test('E42 never pays the cloak itself and does not insure the same original twice across owners',()=>{
 const self=make(8),cloak=give(self.s,self.victim,'vampire-mist-cloak'),other=give(self.s,self.victim,'vampire-mist-cloak');seedForTarget(self.s,'alice','bob',cloak.id);let s=finishPvp(self.s);assert.equal(s.theftDuels![0]!.itemId,cloak.id);assert.equal(s.native56TheftInsurance,undefined);assert(s.players[1]!.inventory.includes(other.id));
 const t=make(8,['alice','bob','charlie']),item=t.s.items[t.itemId]!;item.base=24;item.lastTradePrice=100;give(t.s,t.victim,'vampire-mist-cloak');seedForTarget(t.s,'alice','bob',item.id);s=finishPvp(t.s);assert.equal(s.native56TheftInsurance!.paid.bob,4);
 const newCloak=give(s,s.players[0]!,'vampire-mist-cloak');s.encounter=2;s.phase='TRADE';for(const p of s.players){p.done=false;p.paused=null;p.stealTried=[];}
 seedForTarget(s,'charlie','alice',item.id);const bank=s.bank;s=finishPvp(s,'charlie','alice');assert.equal(s.theftDuels!.at(-1)!.status,'won');assert.equal(s.bank,bank);assert.equal(s.native56TheftInsurance!.paid.alice,undefined);assert.equal(s.native56TheftInsurance!.origins.length,1);assert(s.players[0]!.inventory.includes(newCloak.id));
});

test('E40 reduces only a real NPC theft trust loss and leaves crime penalties intact',()=>{
 const t=make(7),sentry=give(t.s,t.thief,'autometa-clockwork-sentry',8),started=startNpc(t.s);assert.deepEqual(started.theftDuels![0]!.sentryItemIds,[sentry.id]);
 started.players[0]!.npcTrust={autometa:2};const lost=loseNpc(started),duel=lost.theftDuels![0]!;
 assert.equal(duel.status,'lost');assert.equal(lost.players[0]!.npcTrust!.autometa,1);assert.deepEqual(lost.native56SentryTrustUses,{encounter:1,players:['alice']});
 assert.equal((lost.players[0] as Appraiser&{crime?:{failures:number}}).crime?.failures,1);assert(lost.players[0]!.statuses.some(x=>x.id==='D21'));
 const plain=make(7);plain.s.players[0]!.npcTrust={autometa:2};const normal=loseNpc(startNpc(plain.s));assert.equal(normal.players[0]!.npcTrust!.autometa,0);assert.equal(normal.native56SentryTrustUses,undefined);
});

test('E40 requires a ready, sufficiently strong sentry held before the duel and loss of at least2 trust',()=>{
 const late=make(7);let s=startNpc(late.s);s.players[0]!.npcTrust={autometa:2};give(s,s.players[0]!,'autometa-clockwork-sentry');s=loseNpc(s);assert.equal(s.players[0]!.npcTrust!.autometa,0);assert.equal(s.native56SentryTrustUses,undefined);
 const low=make(7);give(low.s,low.thief,'autometa-clockwork-sentry',1,true);assert.equal(remainingEffectReady('autometa-clockwork-sentry',7),true);low.s.players[0]!.npcTrust={autometa:2};s=loseNpc(startNpc(low.s));assert.equal(s.players[0]!.npcTrust!.autometa,0);assert.equal(s.native56SentryTrustUses,undefined);
 const little=make(7);give(little.s,little.thief,'autometa-clockwork-sentry');little.s.players[0]!.npcTrust={autometa:1};s=loseNpc(startNpc(little.s));assert.equal(s.players[0]!.npcTrust!.autometa,0);assert.equal(s.native56SentryTrustUses,undefined);
 const old=make(6);give(old.s,old.thief,'autometa-clockwork-sentry');old.s.players[0]!.npcTrust={autometa:2};s=loseNpc(startNpc(old.s));assert.equal(s.players[0]!.npcTrust!.autometa,0);assert.equal(s.native56SentryTrustUses,undefined);
});

test('E40 is NPC-only and consumes one player/encounter right',()=>{
 const pvp=make(7);give(pvp.s,pvp.thief,'autometa-clockwork-sentry');let s=start(pvp.s);assert.equal(s.theftDuels![0]!.sentryItemIds,undefined);
 s=hand(s,'alice',1,'rock');s=hand(s,'bob',1,'paper');assert.equal(s.theftDuels![0]!.status,'lost');assert.equal(s.native56SentryTrustUses,undefined);assert.equal(s.players[0]!.npcTrust?.autometa,undefined);
 const t=make(7);give(t.s,t.thief,'autometa-clockwork-sentry');t.s.players[0]!.npcTrust={autometa:2};s=loseNpc(startNpc(t.s));assert.equal(s.players[0]!.npcTrust!.autometa,1);
 s.players[0]!.stealTried=[];s.players[0]!.npcTrust!.autometa=5;const second=s.players[0]!.stock.find(id=>id!==s.theftDuels![0]!.itemId)!;s=loseNpc(startNpc(s,second));
 assert.equal(s.players[0]!.npcTrust!.autometa,3);assert.deepEqual(s.native56SentryTrustUses,{encounter:1,players:['alice']});
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

test('E37 opens one free forced duel at zero energy, gated to revision 15',()=>{
 const {s,thief}=make(15);
 give(s,thief,'beast-fangline-lasso');thief.energy=0;
 assert.throws(()=>start(s,thief.id,'missing'));
 const next=start(s);
 assert.equal(next.players[0]!.energy,0);
 assert.equal(next.theftDuels?.[0]?.freeStart,true);
 assert.equal(next.theftDuels?.[0]?.status,'open');
 assert.throws(()=>start(next));
 const legacy=make(11);
 give(legacy.s,legacy.thief,'beast-fangline-lasso');legacy.thief.energy=0;
 assert.throws(()=>start(legacy.s));
});
