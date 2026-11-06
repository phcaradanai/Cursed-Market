import test from 'node:test';
import assert from 'node:assert/strict';
import {applyAppraisalAction,appraisalViewFor,createAppraisalRun} from '../src/game/appraisal/index.js';
import {passiveText} from '../src/appraisal-client/catalog-text.js';
import type {AppraisalAction,AppraisalItem,AppraisalState,Appraiser,ItemKind} from '../src/game/appraisal/types.js';
import type {SinnerSeal} from '../src/game/appraisal/theft.js';
import type {SealOffer} from '../src/game/appraisal/seals.js';

type State=AppraisalState&{sinnerSeals?:SinnerSeal[];sealOffers?:SealOffer[];native56SealEnergy?:{origins:string[];uses:{encounter:number;players:string[]};offers:Record<string,{buyerId:string;encounter:number;itemIds:string[]}>}};
let seq=0;
function make(revision:10|11=11,ids=['alice','bob','cara','dave']):State {
 const s=createAppraisalRun(ids,'e52-seal-energy',{catalogVersion:5,native56Effects:revision,secureEconomy:true,startingCredits:100,maxEnergy:10,marketProbability:0,encounters:4});
 s.phase='TRADE';for(const p of s.players){p.done=false;p.paused=null;p.eventOffer=null;p.energy=0;}
 return s as State;
}
function give(s:State,p:Appraiser,kind:ItemKind='swarm-resin-spool',power=1):AppraisalItem {
 const source=Object.values(s.items)[0]!,id=`e52-item-${seq++}`;
 const rarity=power>=8?'mythic':power>=6?'legendary':power>=4?'epic':power>=3?'rare':power>=2?'uncommon':'common';
 const item:AppraisalItem={...source,id,kind,owner:p.id,npcOwnerId:p.id,npc:'swarm',appearance:{version:1,rarity,theme:'plain',visualSeed:1},rarityPower:{version:1,valueMultiplier:power,effectMultiplier:power}};
 s.items[id]=item;p.inventory.push(id);return item;
}
function addSeal(s:State,id:string,thiefId:string,holderId:string):SinnerSeal {
 const seal={id,thiefId,holderId,duelId:`duel-${id}`,issuedEncounter:s.encounter};(s.sinnerSeals??=[]).push(seal);return seal;
}
function act(s:State,playerId:string,body:object):State {
 return applyAppraisalAction(s,{...body,playerId,encounter:s.encounter,requestId:`e52-${seq++}`} as AppraisalAction) as State;
}
function offer(s:State,holder:Appraiser,buyer:Appraiser,sealId:string,credits=1,goods=0):State {
 return act(s,holder.id,{type:'seal-offer',sealId,buyerId:buyer.id,credits,energy:0,life:0,goods});
}
function accept(s:State,buyer:Appraiser,itemIds:string[]=[]):State {
 const current=s.sealOffers!.find(o=>o.status==='open'&&o.buyerId===buyer.id)!;return act(s,buyer.id,{type:'seal-respond',offerId:current.id,accept:true,itemIds});
}

test('E52 restores only the buyer after a paid seal exchange and keeps the held-tool snapshot private',()=>{
 const s=make(),[buyer,holder,thief]=s.players as [Appraiser,Appraiser,Appraiser,Appraiser];
 const spool=give(s,buyer);give(s,holder);addSeal(s,'seal-1',thief.id,holder.id);
 let opened=offer(s,holder,buyer,'seal-1');
 const view=appraisalViewFor(opened,buyer.id);
 assert.equal(JSON.stringify(view).includes('native56SealEnergy'),false);
 assert.equal(JSON.stringify(view).includes(spool.id),true,'the held item itself is public to its owner; only the settlement snapshot stays private');
  opened=accept(opened,buyer);
 assert.equal(opened.players[0]!.energy,1);
 assert.equal(opened.players[1]!.energy,0,'the seller never receives the buyer effect');
 assert.deepEqual(opened.native56SealEnergy?.origins,['seal-1']);
 assert.deepEqual(opened.native56SealEnergy?.uses,{encounter:1,players:[buyer.id]});
 assert.equal(opened.trace.some(entry=>entry.type==='native-seal-energy'&&entry.playerId===buyer.id),true);
 assert.match(passiveText('swarm-resin-spool',true,{nativeEffectReady:true}),/อย่างน้อย 1 เครดิต/);
});

test('E52 sums rarity strength, caps at two, and never restores beyond missing energy',()=>{
 for(const [power,initial,expected] of [[4,0,2],[8,9,1]] as const){
  const s=make(),[buyer,holder,thief]=s.players as [Appraiser,Appraiser,Appraiser,Appraiser];
  give(s,buyer,'swarm-resin-spool',power);addSeal(s,`seal-${power}`,thief.id,holder.id);buyer.energy=initial;
  const opened=offer(s,holder,buyer,`seal-${power}`),done=accept(opened,buyer);
  assert.equal(done.players[0]!.energy-initial,expected);
 }
});

test('E52 does not activate from copied spools',()=>{
 const s=make(),[buyer,holder,thief]=s.players as [Appraiser,Appraiser,Appraiser,Appraiser];
 const copy=give(s,buyer,'swarm-resin-spool',4),sourceId=`source-${copy.id}`;s.items[sourceId]={...copy,id:sourceId,owner:'removed'};copy.copy={sourceId,number:1,valuePercent:25};
 addSeal(s,'copy-seal',thief.id,holder.id);const opened=offer(s,holder,buyer,'copy-seal'),done=accept(opened,buyer);
 assert.equal(done.players[0]!.energy,0);assert.equal(passiveText('swarm-resin-spool',true,{nativeEffectReady:true,copy:true}),'');
});

test('E52 does not trigger for free, declined, cancelled, or buyback seal deals',()=>{
 {
  const s=make(),[buyer,holder,thief]=s.players as [Appraiser,Appraiser,Appraiser,Appraiser];give(s,buyer);give(s,buyer,'orc-tusk-shield');addSeal(s,'free',thief.id,holder.id);
  const opened=offer(s,holder,buyer,'free',0,1),done=accept(opened,buyer,[buyer.inventory[1]!]);
  assert.equal(done.players[0]!.energy,0);assert.equal(done.native56SealEnergy,undefined);
 }
 {
  const s=make(),[buyer,holder,thief]=s.players as [Appraiser,Appraiser,Appraiser,Appraiser];give(s,buyer);addSeal(s,'declined',thief.id,holder.id);
  const opened=offer(s,holder,buyer,'declined'),declined=act(opened,buyer.id,{type:'seal-respond',offerId:opened.sealOffers![0]!.id,accept:false});
  assert.equal(declined.players[0]!.energy,0);assert.equal(declined.native56SealEnergy?.offers['seal-offer:1'],undefined);
 }
 {
  const s=make(),[buyer,holder,thief]=s.players as [Appraiser,Appraiser,Appraiser,Appraiser];give(s,buyer);addSeal(s,'cancelled',thief.id,holder.id);
  const opened=offer(s,holder,buyer,'cancelled'),cancelled=act(opened,holder.id,{type:'seal-cancel',offerId:opened.sealOffers![0]!.id});
  assert.equal(cancelled.players[0]!.energy,0);assert.equal(cancelled.native56SealEnergy?.offers['seal-offer:1'],undefined);
 }
 {
  const s=make(),[buyer,holder]=s.players as [Appraiser,Appraiser,Appraiser,Appraiser];give(s,buyer);addSeal(s,'buyback',buyer.id,holder.id);
  const opened=offer(s,holder,buyer,'buyback'),done=accept(opened,buyer);
  assert.equal(done.players[0]!.energy,0);assert.deepEqual(done.sinnerSeals,[]);assert.equal(done.native56SealEnergy?.origins.length??0,0);
 }
 {
  const s=make(10),[buyer,holder,thief]=s.players as [Appraiser,Appraiser,Appraiser,Appraiser];give(s,buyer);addSeal(s,'old-stage',thief.id,holder.id);
  const opened=offer(s,holder,buyer,'old-stage'),done=accept(opened,buyer);
  assert.equal(done.players[0]!.energy,0);assert.equal(done.native56SealEnergy,undefined,'revision10 remains unchanged');
 }
});

test('E52 requires the same spool to be held from offer through settlement',()=>{
 for(const mode of ['acquired-late','lost','given-away'] as const){
  const s=make(),[buyer,holder,thief]=s.players as [Appraiser,Appraiser,Appraiser,Appraiser];
  const spool=mode==='acquired-late'?undefined:give(s,buyer);if(mode==='given-away')give(s,buyer,'orc-tusk-shield');
  addSeal(s,mode,thief.id,holder.id);const opened=offer(s,holder,buyer,mode,1,mode==='given-away'?1:0);
  const buyerNow=opened.players.find(p=>p.id===buyer.id)!;
  if(mode==='acquired-late')give(opened,buyerNow);
  if(mode==='lost'){buyerNow.inventory=buyerNow.inventory.filter(id=>id!==spool!.id);opened.items[spool!.id]!.owner='removed';}
  const done=accept(opened,buyerNow,mode==='given-away'?[spool!.id]:[]);
  assert.equal(done.players[0]!.energy,0,mode);assert.equal(done.native56SealEnergy?.origins.length??0,0,mode);
 }
});

test('E52 custody is invalidated when the same spool leaves and later returns before settlement',()=>{
 const s=make(),[buyer,holder,trader,thief]=s.players as [Appraiser,Appraiser,Appraiser,Appraiser];
 const spool=give(s,buyer);addSeal(s,'target-seal',thief.id,holder.id);addSeal(s,'transfer-seal',thief.id,trader.id);
 let opened=offer(s,holder,buyer,'target-seal');const target=opened.sealOffers!.find(o=>o.sealId==='target-seal')!;
 opened=offer(opened,trader,buyer,'transfer-seal',0,1);const transfer=opened.sealOffers!.find(o=>o.sealId==='transfer-seal')!;
 opened=act(opened,buyer.id,{type:'seal-respond',offerId:transfer.id,accept:true,itemIds:[spool.id]});
 assert.equal(opened.items[spool.id]!.owner,trader.id);assert.equal(opened.native56SealEnergy?.offers[target.id],undefined);
 const returnedBuyer=opened.players.find(p=>p.id===buyer.id)!,returnedFrom=opened.players.find(p=>p.id===trader.id)!;returnedFrom.inventory=returnedFrom.inventory.filter(id=>id!==spool.id);opened.items[spool.id]!.owner=buyer.id;returnedBuyer.inventory.push(spool.id);
 opened=act(opened,buyer.id,{type:'seal-respond',offerId:target.id,accept:true,itemIds:[]});
 assert.equal(opened.players[0]!.energy,0,'returning the same physical spool does not restore its continuous-custody right');
});

test('E52 cannot cycle one seal between buyers or pay one buyer twice in the same encounter',()=>{
 const s=make(),[alice,bob,cara,dave]=s.players as [Appraiser,Appraiser,Appraiser,Appraiser];
 give(s,alice);give(s,cara);addSeal(s,'cycle',dave.id,bob.id);addSeal(s,'encounter-cap',dave.id,bob.id);
 const first=offer(s,bob,alice,'cycle'),afterFirst=accept(first,alice);assert.equal(afterFirst.players[0]!.energy,1);
 const cycleBack=offer(afterFirst,alice,cara,'cycle'),afterCycle=accept(cycleBack,cara);assert.equal(afterCycle.players[2]!.energy,0,'the original seal cannot grant a second buyer energy');
 const second=offer(afterCycle,bob,alice,'encounter-cap'),afterSecond=accept(second,alice);assert.equal(afterSecond.players[0]!.energy,1,'buyer gets at most one effect each encounter');
 assert.deepEqual(afterSecond.native56SealEnergy?.origins,['cycle']);
});
