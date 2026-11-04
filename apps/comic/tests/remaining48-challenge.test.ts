import fs from 'node:fs';import crypto from 'node:crypto';import {gunzipSync} from 'node:zlib';
import test from 'node:test';import assert from 'node:assert/strict';
import {createAppraisalRun,restoreAppraisalRun,applyAppraisalAction,appraisalViewFor,replayAppraisalAudit} from '../src/game/appraisal/index.js';
import {settleChallenge} from '../src/game/appraisal/challenge.js';
import {defaultRarityConfig} from '../src/shared/item-rarity.js';import {defaultRarityEconomy} from '../src/shared/rarity-power.js';
import type {AppraisalAction,AppraisalConfig,AppraisalItem,TradeOffer} from '../src/game/appraisal/types.js';
const make=()=>createAppraisalRun(['alice','bob'],'mist-contract',{catalogVersion:5,startingCredits:500,marketProbability:0,commerce:false,core2:false,npcEvents:false,trustAbilities:true});
function table(power=1,copy=false){const s=make(),a=s.players[0]!,b=s.players[1]!;s.phase='TRADE';for(const p of s.players){p.eventOffer=null;p.done=false;}b.stock=[...b.portals[0]!.stock];const item=s.items[b.stock[0]!]!;Object.assign(item,{genuine:true,cursed:false,base:100,ask:100,lastAppraisal:100,lastAccepted:true,appraisedBy:b.id});s.listings=[{ownerId:b.id,itemId:item.id,purchase:true,claims:{genuine:true}}];
 s.config.rarity??=defaultRarityConfig();s.config.rarityEconomy??=defaultRarityEconomy();
 const mist:AppraisalItem={...item,id:'mist',kind:'vampire-mist-atomizer',owner:a.id,npcOwnerId:a.id,appearance:{version:1,rarity:power===8?'mythic':'common',theme:'plain',visualSeed:1},rarityPower:{version:1,valueMultiplier:power,effectMultiplier:power}};s.items[mist.id]=mist;a.inventory.push(mist.id);
 if(copy){s.items.origin={...mist,id:'origin',owner:'removed'};mist.copy={sourceId:'origin',number:1,valuePercent:25};}
 const offer={id:'challenge',buyerId:a.id,sellerId:b.id,itemId:item.id,challenge:'genuine',source:'npc'} as TradeOffer;return {s,a,b,item,mist,offer};}

test('new catalog5 runs select effects3; exact restoration without revision remains stage1; invalid revisions reject',()=>{
 const s=make();assert.equal((s.config as AppraisalConfig&{native56Effects?:number}).native56Effects,3);
 const config=structuredClone(s.config) as AppraisalConfig&{native56Effects?:number};delete config.native56Effects;
 assert.equal((restoreAppraisalRun(['alice','bob'],'stage1',config).config as typeof config).native56Effects,undefined);
 assert.equal((createAppraisalRun(['alice','bob'],'default').config as typeof config).native56Effects,undefined);
 for(const bad of [{catalogVersion:4,native56Effects:2},{catalogVersion:5,native56Effects:1},{catalogVersion:5,native56Effects:4}])assert.throws(()=>createAppraisalRun(['alice','bob'],'invalid',bad as Partial<AppraisalConfig>));
});

test('E06 exact floor/cap/copy reductions apply once per buyer encounter after a real failed challenge',()=>{
 for(const [power,copy,expected] of [[1,false,38],[8,false,25],[1,true,45]] as const){const t=table(power,copy);assert.deepEqual(settleChallenge(t.s,t.a,t.b,t.offer),{discount:0,penalty:expected});assert.equal(settleChallenge(t.s,t.a,t.b,{...t.offer,id:'second'}).penalty,50);t.s.encounter++;assert.equal(settleChallenge(t.s,t.a,t.b,{...t.offer,id:'next'}).penalty,expected);}
});

test('E06 origin cap survives transfer/copies/reconnect and zero void penalty does not burn its right',()=>{
 const t=table();assert.equal(settleChallenge(t.s,t.a,t.b,t.offer).penalty,38);
 const copy={...t.mist,id:'mist-copy',owner:t.b.id,copy:{sourceId:t.mist.id,number:1,valuePercent:25 as const}};t.s.items[copy.id]=copy;t.b.inventory.push(copy.id);
 assert.equal(settleChallenge(t.s,t.b,t.a,{...t.offer,buyerId:t.b.id,sellerId:t.a.id}).penalty,50,'origin cannot refresh through a copy');
 const resumed=structuredClone(t.s);assert.equal(settleChallenge(resumed,resumed.players[0]!,resumed.players[1]!,t.offer).penalty,50);
 const z=table();const seal={...z.mist,id:'seal',kind:'void-seal' as const};z.s.items[seal.id]=seal;z.a.inventory.push(seal.id);
 assert.equal(settleChallenge(z.s,z.a,z.b,{...z.offer,sealId:seal.id}).penalty,0);assert.equal(settleChallenge(z.s,z.a,z.b,z.offer).penalty,38);
});

test('E06 respects actual custody, lock, death and revision; E05 lock exclusion starts at effects2',()=>{
 for(const reason of ['vault','loan','lock','dead','old'] as const){const t=table();if(reason==='vault')t.mist.owner='vault:alice';if(reason==='loan')t.a.npcContracts={alien:{lentAt:1,dueAt:3,itemIds:[t.mist.id],key:'loan',reservedCredits:0}};if(reason==='lock')t.a.statuses.push({id:'D09',charges:1,targetItemId:t.mist.id,starts:1,expires:3});if(reason==='dead')t.a.life=0;if(reason==='old')delete (t.s.config as AppraisalConfig&{native56Effects?:number}).native56Effects;assert.equal(settleChallenge(t.s,t.a,t.b,t.offer).penalty,50,reason);}
 const t=table();t.mist.kind='autometa-coil-repeater';t.item.genuine=false;t.a.statuses.push({id:'D09',charges:1,targetItemId:t.mist.id,starts:1,expires:3});assert.equal(settleChallenge(t.s,t.a,t.b,t.offer).discount,50);
 delete (t.s.config as AppraisalConfig&{native56Effects?:number}).native56Effects;assert.equal(settleChallenge(t.s,t.a,t.b,t.offer).discount,55,'stage1 preserves original sparse-audit semantics');
});

test('public propose/respond charges reduced penalty once; retry preserves wallet, owner and ledger',()=>{
 let {s,a,b,item}=table();const command=(playerId:string,requestId:string,body:object)=>({...body,playerId,requestId,encounter:s.encounter}) as AppraisalAction;
 assert.equal(appraisalViewFor(s,a.id).self.inventory.find(i=>i.kind==='vampire-mist-atomizer')!.nativeEffectReady,true);
 s=applyAppraisalAction(s,command(a.id,'offer',{type:'propose',sellerId:b.id,itemId:item.id,credits:0,condition:false,challenge:'genuine'}));assert.equal(s.players[0]!.knowledge[item.id]?.genuine,undefined);
 const response=command(b.id,'response',{type:'respond',offerId:s.trades.at(-1)!.id,accept:true});const before=s.players[0]!.credits;s=applyAppraisalAction(s,response);assert.equal(before-s.players[0]!.credits,138);assert.equal(s.ledger.filter(l=>l.reason==='challenge-penalty').at(-1)!.amount,38);assert.deepEqual(applyAppraisalAction(s,response),s);
});

test('effects2 sealed archives replay exactly while stage1 and2 remain independently restorable',()=>{
 const repo=new URL('../../../../',import.meta.url),receipt=JSON.parse(fs.readFileSync(new URL('docs/game-design/native56-stage2.json',repo),'utf8')),hash=(bytes:Buffer)=>crypto.createHash('sha256').update(bytes).digest('hex');
 assert.equal(receipt.native56Effects,2);assert.equal(receipt.implementedPrimaryItemIds.length,10);
 for(const archived of receipt.archives){const bytes=fs.readFileSync(new URL(archived.file,repo));assert.equal(hash(bytes),archived.sha256);const raw=gunzipSync(bytes);assert.equal(hash(raw),archived.rawSha256);assert.equal(replayAppraisalAudit(JSON.parse(raw.toString())).phase,'RESULTS');}
 const restored=restoreAppraisalRun(['alice','bob'],'effects2-restore',receipt.config);assert.equal(restored.config.native56Effects,2);
});

test('E06 consumes first real positive penalty even if its saving rounds to zero; only zero penalty preserves the right',()=>{
 const t=table();t.item.base=2;t.item.ask=2;t.item.lastAppraisal=2;
 assert.equal(settleChallenge(t.s,t.a,t.b,t.offer).penalty,1);
 t.item.base=100;t.item.ask=100;t.item.lastAppraisal=100;
 assert.equal(settleChallenge(t.s,t.a,t.b,{...t.offer,id:'later'}).penalty,50,'approved cap is first real failed-challenge penalty, not first profitable saving');
 const z=table();z.item.base=1;z.item.ask=1;z.item.lastAppraisal=1;
 assert.equal(settleChallenge(z.s,z.a,z.b,z.offer).penalty,0);z.item.base=100;z.item.ask=100;z.item.lastAppraisal=100;
 assert.equal(settleChallenge(z.s,z.a,z.b,z.offer).penalty,38);
});
