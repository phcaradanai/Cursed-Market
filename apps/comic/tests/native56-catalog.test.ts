import test from 'node:test';import assert from 'node:assert/strict';
import fs from 'node:fs';import crypto from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {createAppraisalRun,restoreAppraisalRun,appraisalViewFor,applyAppraisalAction,assertAppraisalInvariants,replayAppraisalAudit} from '../src/game/appraisal/index.js';
import {ITEM_SPECS,NPC_SPECS,itemImage,merchantKinds,expansionActive} from '../src/game/appraisal/content.js';
import {REMAINING48_ITEMS} from '../src/game/appraisal/remaining48-catalog.js';
import {pilotRerollCost,priceCaliper,swordForDuel,pilotExpansionCost,pilotCrimeCost,pilotStrength,heldInterestRings,ringInterestBasisPoints} from '../src/game/appraisal/pilot-effects.js';
import {defaultRarityConfig} from '../src/shared/item-rarity.js';
import {defaultRarityEconomy} from '../src/shared/rarity-power.js';
import {remainingChallengeBps} from '../src/game/appraisal/remaining48-effects.js';
import {collectorWishlistView,reconcileCollectorWishlist,handleCollectorWishlist} from '../src/game/appraisal/collector-wishlist.js';
import {ghostQuotes,ghostView} from '../src/game/appraisal/ghost-service.js';
import {publicOfferItems} from '../src/game/appraisal/mechanics.js';
import {wishPick} from '../src/game/appraisal/wishlist.js';
import {activationBlock,activationEnergy} from '../src/appraisal-client/model.js';
import {appraisalBotDecision} from '../src/simulation/appraisal.js';
import {activate,damageLife,npcQuote} from '../src/game/appraisal/mechanics.js';
import type {AppraisalAction,AppraisalItem,ItemKind,ItemView,NpcId} from '../src/game/appraisal/types.js';
const repo=new URL('../../../../',import.meta.url),read=(file:string)=>JSON.parse(fs.readFileSync(new URL(file,repo),'utf8'));
const catalog=read('apps/comic/src/appraisal-client/public/art/comic/items/merchant-set-v1/catalog.json') as {merchants:Array<{id:NpcId;items:Array<{id:string;image:string;sha256:string}>}>};
const ids=new Set(catalog.merchants.flatMap(m=>m.items.map(i=>i.id)));
const hash=(value:string|Buffer)=>crypto.createHash('sha256').update(value).digest('hex');
const run=()=>createAppraisalRun(['alice','bob'],'full56-catalog',{catalogVersion:5,startingCredits:500,maxEnergy:20,marketProbability:0,npcEvents:false,core2:false,secureEconomy:true,commerce:false,polish:false,roundRewards:false,trustAbilities:false});
function give(s:ReturnType<typeof run>,kind:ItemKind,power=1){const p=s.players[0]!,source=Object.values(s.items)[0]!;s.config.rarity??=defaultRarityConfig();s.config.rarityEconomy??=defaultRarityEconomy();const rarity=power===8?'mythic':power===6?'legendary':power===4?'epic':power===3?'rare':power===2?'uncommon':'common';const i:AppraisalItem={...source,id:'held-'+p.inventory.length,kind,owner:p.id,genuine:true,cursed:false,appearance:{version:1,rarity,theme:'plain',visualSeed:1},rarityPower:{version:1,valueMultiplier:power,effectMultiplier:power}};s.items[i.id]=i;p.inventory.push(i.id);return i;}

test('catalog5 selects exactly seven canonical products per merchant with independent assets and no old-kind alias',()=>{
 assert.equal(ids.size,56);
 for(const merchant of catalog.merchants){
  assert.deepEqual(merchantKinds(merchant.id,5),merchant.items.map(i=>i.id));
  for(const row of merchant.items){const kind=row.id as ItemKind,spec=ITEM_SPECS[kind];assert(spec?.nativeEffect);assert.equal(spec.merchant,merchant.id);assert.equal(itemImage(kind),'/'+row.image);assert.equal(hash(fs.readFileSync(new URL('apps/comic/src/appraisal-client/public/'+row.image,repo))),row.sha256);}
 }
 const state=run();assert.equal(state.config.catalogVersion,5);assert(expansionActive(state.config));assertAppraisalInvariants(state);
 for(const p of state.players)for(const portal of p.portals)for(const id of portal.stock)assert(merchantKinds(portal.npc,5).includes(state.items[id]!.kind));
});

test('versions1–4 retain exact pre-registration ordered pools and sixteen initial-state fingerprints',()=>{
 const golden=read('docs/validation/native56-catalog-2026-11-04/legacy-golden.json');
 for(const row of golden.cases){const state=createAppraisalRun(['a','b','c','d'].slice(0,row.count),row.seed,row.config);assert.equal(hash(JSON.stringify(state)),row.stateSha256,JSON.stringify(row.config));
  for(const npc of Object.keys(NPC_SPECS) as NpcId[])assert.deepEqual(merchantKinds(npc,row.version,row.flags,row.flags,row.flags,row.flags,row.flags),row.pools[npc]);
 }
 assert.equal(createAppraisalRun(['a','b'],'default').config.catalogVersion,3);
});

test('catalog5 first-stage archives and restored capability readiness remain a frozen replay contract',()=>{
 const stage=read('docs/game-design/native56-stage1.json');assert.equal(stage.effectStage,1);
 for(const archived of stage.archives){const bytes=fs.readFileSync(new URL(archived.file,repo));assert.equal(hash(bytes),archived.sha256);const raw=gunzipSync(bytes);assert.equal(hash(raw),archived.rawSha256);assert.equal(replayAppraisalAudit(JSON.parse(raw.toString())).phase,'RESULTS');}
 const s=restoreAppraisalRun(['alice','bob'],'stage1-restored',stage.config),p=s.players[0]!;p.eventOffer=null;
 for(const kind of Object.keys(REMAINING48_ITEMS)){const item=give(s,kind as ItemKind);assert.equal(appraisalViewFor(s,p.id).self.inventory.find(i=>i.id===item.id)!.nativeEffectReady,kind==='autometa-coil-repeater');}
});

test('new native views preserve unknown truths, use real art and distinguish registered but unbound effects',()=>{
 const s=run(),p=s.players[0]!;p.eventOffer=null;
 for(const kind of ids){const i=give(s,kind as ItemKind);const view=appraisalViewFor(s,p.id).self.inventory.find(v=>v.id===i.id)!;
  assert.equal(view.image,itemImage(i.kind));assert.equal(view.knowledge.base,undefined);assert.equal(view.knowledge.genuine,undefined);assert.equal(view.knowledge.cursed,undefined);assert(view.possibleBenefit.length>0);
  if(kind in REMAINING48_ITEMS)assert.equal((view as ItemView&{nativeEffectReady?:boolean}).nativeEffectReady,['vampire-midnight-invitation','orc-tally-beads','orc-bone-war-drum','deepsea-kelp-saddle','autometa-coil-repeater','vampire-mist-atomizer','orc-oath-sword','orc-ironroot-greaves','autometa-servo-harness','alien-biobright-seedpod','orc-ember-salve','deepsea-whale-conch-horn','autometa-data-prism','vampire-gloam-violin','swarm-pheromone-sprayer','orc-clan-forge-tongs','deepsea-abyss-trident'].includes(kind));
 }
});

test('unbound native activations reject before charging, consuming, revealing or recording a use',()=>{
 const s=run(),p=s.players[0]!;p.eventOffer=null;
 for(const [kind,spec]of Object.entries(REMAINING48_ITEMS)){if(!spec.explicitActivation)continue;const i=give(s,kind as ItemKind),before=structuredClone(s);assert.throws(()=>activate(s,p,i.id));assert.deepEqual(s,before);}
});

test('shared client eligibility and bot policy do not repeatedly submit an unbound activation',()=>{
 const s=run(),p=s.players[0]!;s.phase='APPRAISAL';p.eventOffer=null;p.stock=[];p.energy=20;
 const item=give(s,'autometa-coolant-canister');const view=appraisalViewFor(s,p.id);
 assert.deepEqual({blocked:activationBlock(view,item.id,false)!==null,botActivates:appraisalBotDecision(view,'collector')?.type==='activate'},{blocked:true,botActivates:false});
 const consumable=give(s,'darkone-null-sword');const next=appraisalViewFor(s,p.id);assert.equal(activationEnergy(next,next.self.inventory.find(i=>i.id===consumable.id)!),1);
});

test('the original eight primary capabilities remain available in version5',()=>{
 const s=run(),p=s.players[0]!;p.eventOffer=null;
 const compass=give(s,'deepsea-tide-compass');assert.equal(pilotRerollCost(s,p,2),1);
 const caliper=give(s,'autometa-torque-caliper');assert.equal(priceCaliper(s,p)?.id,caliper.id);
 const sword=give(s,'beast-riftfang-sword');assert.equal(swordForDuel(s,p)?.id,sword.id);
 give(s,'swarm-brood-hammer');assert.equal(pilotExpansionCost(s,p,10),8);
 give(s,'darkone-crossing-token');assert.equal(pilotCrimeCost(s,p,100),90);
 give(s,'alien-thought-translator');assert.equal(pilotStrength(s,p,'alien-thought-translator'),1);
 const ring=give(s,'vampire-nocturne-signet');assert.equal(heldInterestRings(s,p)[ring.id],200);assert.equal(ringInterestBasisPoints(s,p,{[ring.id]:200}),200);
 const shield=give(s,'orc-tusk-shield');s.config.survival={maxLife:6,encounterLifeCost:1,entryEnergyCost:0};p.life=6;p.energy=10;activate(s,p,shield.id);damageLife(s,p,2,'test-hit');assert.equal(p.life,5);assert.equal(p.energy,9);
 assert.equal(compass.owner,p.id);
});

type Body=AppraisalAction extends infer A?A extends AppraisalAction?Omit<A,'playerId'|'requestId'|'encounter'>:never:never;
function challenge(power:number,truth:boolean,version:4|5=5,copy=false){
 let s=version===5?run():createAppraisalRun(['alice','bob'],'coil-old',{catalogVersion:4,startingCredits:500,marketProbability:0,commerce:false,core2:false,secureEconomy:true,npcEvents:false,trustAbilities:false});
 s.phase='TRADE';for(const p of s.players){p.eventOffer=null;p.done=false;}const a=s.players[0]!,b=s.players[1]!;b.stock=[...b.portals[0]!.stock];const item=s.items[b.stock[0]!]!;item.genuine=truth;item.cursed=false;item.ask=100;item.base=100;item.lastAppraisal=100;item.lastAccepted=true;item.appraisedBy=b.id;
 s.listings=[{ownerId:b.id,itemId:item.id,purchase:true,claims:{genuine:true}}];
 const coil=give(s,'autometa-coil-repeater' as ItemKind,power);if(copy){s.config.trustAbilities=true;const sourceId=coil.id+'-origin';s.items[sourceId]={...coil,id:sourceId,owner:'retired'};coil.copy={sourceId,number:1,valuePercent:25};}
 const quote=npcQuote(b,item),credits=a.credits;
 const send=(playerId:string,body:Body,seq:number)=>{s=applyAppraisalAction(s,{...body,playerId,requestId:'coil-'+seq,encounter:s.encounter} as AppraisalAction);};
 send(a.id,{type:'propose',sellerId:b.id,itemId:item.id,credits:0,condition:false,challenge:'genuine'},1);
 assert.equal(s.players[0]!.knowledge[item.id]?.genuine,undefined,'tool does not reveal truth before challenge settlement');
 send(b.id,{type:'respond',offerId:s.trades.at(-1)!.id,accept:true},2);
 return {spent:credits-s.players[0]!.credits,quote,state:s,itemId:item.id};
}
test('E05 increases only a correct false-claim challenge discount with actual public propose/respond commands',()=>{
 const ordinary=challenge(1,false),strong=challenge(8,false),copied=challenge(1,false,5,true),wrong=challenge(8,true),legacy=challenge(8,false,4);
 assert.equal(ordinary.spent,45);assert.equal(strong.spent,35);assert.equal(copied.spent,48);assert.equal(wrong.spent,150);assert.equal(legacy.spent,50);
 assert.equal(strong.state.players[0]!.knowledge[strong.itemId]!.genuine,false);
});

test('E05 uses actual live carried custody, strongest-five cap and public kind without a truth oracle',()=>{
 const s=run(),p=s.players[0]!,i=give(s,'autometa-coil-repeater');assert.equal(remainingChallengeBps(s,p),500);
 i.genuine=false;i.cursed=true;assert.equal(remainingChallengeBps(s,p),500);assert.equal(p.knowledge[i.id],undefined);
 i.owner='vault:'+p.id;assert.equal(remainingChallengeBps(s,p),0);i.owner=p.id;
 p.npcContracts={alien:{lentAt:1,dueAt:3,itemIds:[i.id],key:'loan',reservedCredits:0}};assert.equal(remainingChallengeBps(s,p),0);delete p.npcContracts;
 p.life=0;assert.equal(remainingChallengeBps(s,p),0);p.life=6;
 for(let n=0;n<6;n++)give(s,'autometa-coil-repeater',8);assert.equal(remainingChallengeBps(s,p),1500);
 s.config.catalogVersion=4;assert.equal(remainingChallengeBps(s,p),0);
});

test('catalog5 consumers keep Collector blind items separate from public market/Spirit sources',()=>{
 const s=run(),p=s.players[0]!;s.config.collectorWishlistRules=1;s.phase='PORTALS';s.encounter=2;for(const seat of s.players)seat.eventOffer=null;
 reconcileCollectorWishlist(s);const request=collectorWishlistView(s,p)!.request;
 assert(request.available);assert.equal(request.kinds.length,56);assert(request.kinds.every(k=>ids.has(k.kind)));
 const requested=request.kinds.slice(0,3).map(k=>k.kind);handleCollectorWishlist(s,p,{type:'collector-wish-request',kinds:requested});
 s.encounter=4;reconcileCollectorWishlist(s);const delivery=collectorWishlistView(s,p)!.delivery!;assert.equal(delivery.slots.length,5);assert(delivery.slots.every(slot=>slot.peek===undefined));
 const privateItems=Object.values(s.items).filter(i=>i.id.startsWith('cw-'));assert.equal(privateItems.length,5);assert(privateItems.every(i=>ids.has(i.kind)));
 assert(publicOfferItems(s).every(i=>!i.id.startsWith('cw-')));
 s.ghosts={bob:{round:1,available:true,swaps:[],encounter:4,slots:[],jobs:[],bonus:0,draws:0}};
 const quotes=ghostQuotes(s,'bob',p.id);assert.equal(quotes.length,3);assert(quotes.every(q=>ids.has(q.kind)&&!q.prototype.id.startsWith('cw-')));
 assert(ghostView(s,p.id).services.every(service=>service.quotes.every(q=>!('prototype'in q)&&!('base'in q))));
 for(const npc of Object.keys(NPC_SPECS) as NpcId[])for(let n=0;n<20;n++)assert(merchantKinds(npc,5).includes(wishPick(s,p,npc,n).kind));
});
