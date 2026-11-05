import fs from 'node:fs';import crypto from 'node:crypto';import {gunzipSync} from 'node:zlib';
import test from 'node:test';import assert from 'node:assert/strict';
import {createAppraisalRun,applyAppraisalAction,advanceAppraisalEncounter,appraisalViewFor,replayAppraisalAudit} from '../src/game/appraisal/index.js';
import {inspect,appraise,recoveryOffer,grant} from '../src/game/appraisal/mechanics.js';
import {cleanseOffer} from '../src/game/appraisal/cleanse.js';
import {defaultRarityConfig} from '../src/shared/item-rarity.js';import {defaultRarityEconomy} from '../src/shared/rarity-power.js';
import {randomAt} from '../src/game/random.js';
import type {AppraisalAction,AppraisalState,AppraisalItem,ItemKind,NpcId} from '../src/game/appraisal/types.js';
function make(){const s=createAppraisalRun(['alice','bob'],'automatic-contracts',{catalogVersion:5,startingCredits:500,maxEnergy:10,marketProbability:0,commerce:true,core2:false,npcEvents:false,polish:false,trustAbilities:true,roundRewards:false,survival:{maxLife:6,encounterLifeCost:1,entryEnergyCost:2},cleanse:true});for(const p of s.players){p.eventOffer=null;p.energy=8;}return s;}
function give(s:AppraisalState,kind:ItemKind,power=1,copy=false,seat=0){const p=s.players[seat]!,source=Object.values(s.items)[0]!;s.config.rarity??=defaultRarityConfig();s.config.rarityEconomy??=defaultRarityEconomy();const item:AppraisalItem={...source,id:'held-'+Object.keys(s.items).length,kind,owner:p.id,genuine:true,cursed:false,appearance:{version:1,rarity:power===8?'mythic':'common',theme:'plain',visualSeed:1},rarityPower:{version:1,valueMultiplier:power,effectMultiplier:power}};s.items[item.id]=item;p.inventory.push(item.id);if(copy){s.items[item.id+'-origin']={...item,id:item.id+'-origin',owner:'removed'};item.copy={sourceId:item.id+'-origin',number:1,valuePercent:25};}return item;}
let seq=0;const act=(s:AppraisalState,body:object,seat=0)=>applyAppraisalAction(s,{...body,playerId:s.players[seat]!.id,encounter:s.encounter,requestId:'auto-'+seq++} as AppraisalAction);
function portal(s:AppraisalState,npc:NpcId='orc'){const p=s.players[0]!;p.portals[0]!.npc=npc;return p.portals[0]!;}
function shop(s:AppraisalState,npc:NpcId='orc'){const p=s.players[0]!,door=portal(s,npc);s.phase='APPRAISAL';p.selectedPortalId=door.id;p.stock=[...door.stock];for(const id of p.stock)s.items[id]!.npc=npc;return s.items[p.stock[0]!]!;}
function range(s:AppraisalState){const item=shop(s);item.base=100;s.config.rarity??=defaultRarityConfig();s.config.rarityEconomy??=defaultRarityEconomy();item.appearance={version:1,rarity:'common',theme:'plain',visualSeed:1};item.rarityPower={version:1,valueMultiplier:1,effectMultiplier:1};const p=s.players[0]!;inspect(s,p,item.id,'price');return {item,facts:p.knowledge[item.id]!};}

test('new native runs select effects5, retaining historical revision2 as explicit config',()=>{assert.equal((createAppraisalRun(['a','b'],'new',{catalogVersion:5}).config as {native56Effects?:number}).native56Effects,5);assert.doesNotThrow(()=>createAppraisalRun(['a','b'],'two',{catalogVersion:5,native56Effects:2}));});

test('E28 awards only a first actual meeting, records meetings without sword and counts only actual trust gain',()=>{
 let s=make();s.config.personalScoringRules=1;s.personalPerformance={version:1,facts:[]};const sword=give(s,'orc-oath-sword',8),door=portal(s);s.players[0]!.npcTrust!.orc=9;
 const command={type:'enter',portalId:door.id,playerId:'alice',requestId:'first-orc',encounter:1} as const;s=applyAppraisalAction(s,command);assert.equal(s.players[0]!.npcTrust!.orc,10);assert.equal(s.personalPerformance!.facts.filter(f=>f.metric==='trustGained').reduce((n,f)=>n+f.raw,0),1);assert.deepEqual(applyAppraisalAction(s,command),s);
 s.phase='PORTALS';s.players[0]!.done=false;s.players[0]!.npcTrust!.orc=2;s=act(s,{type:'enter',portalId:door.id});assert.equal(s.players[0]!.npcTrust!.orc,2);assert.equal(s.items[sword.id]!.owner,'alice');
 let late=make();const d=portal(late);late=act(late,{type:'enter',portalId:d.id});give(late,'orc-oath-sword');late.phase='PORTALS';late.players[0]!.done=false;late=act(late,{type:'enter',portalId:d.id});assert.equal((late.players[0]!.npcTrust!.orc??0),0);
});

test('E28 copy floors, custody and read-only peeking never fabricate a meeting bonus',()=>{
 for(const [power,copy,expected] of [[1,false,1],[1,true,0],[8,true,2]] as const){let s=make();give(s,'orc-oath-sword',power,copy);const d=portal(s);appraisalViewFor(s,'alice');assert.equal((s.players[0]!.npcTrust!.orc??0),0);s=act(s,{type:'enter',portalId:d.id});assert.equal((s.players[0]!.npcTrust!.orc??0),expected);}
 for(const where of ['vault','loan','lock'] as const){let s=make();const i=give(s,'orc-oath-sword'),p=s.players[0]!;if(where==='vault'){p.inventory=[];p.personalVault={items:[i.id],credits:0,slots:2};i.owner='vault:alice';}if(where==='loan'){s.config.npcEvents=true;p.inventory=[];i.owner='alien-loan:alice';s.reservedRewards+=8;p.npcContracts={alien:{lentAt:1,dueAt:3,itemIds:[i.id],key:'loan',reservedCredits:8}};}if(where==='lock')grant(s,p,'D09',i.id);const d=portal(s);s=act(s,{type:'enter',portalId:d.id});assert.equal((s.players[0]!.npcTrust!.orc??0),0,where);}
});

test('E61 adds only boundary-carried energy after entry cost with a shared family cap and old recovery statuses',()=>{
 for(const [power,copy,expected] of [[1,false,7],[1,true,6],[8,true,8]] as const){const s=make();give(s,'orc-ironroot-greaves',power,copy);s.phase='REVEAL';assert.equal(advanceAppraisalEncounter(s).players[0]!.energy,expected);}
 const s=make();give(s,'orc-ironroot-greaves');give(s,'autometa-servo-harness');give(s,'alien-biobright-seedpod');s.phase='REVEAL';assert.equal(advanceAppraisalEncounter(s).players[0]!.energy,8);
 const debuff=make();give(debuff,'orc-ironroot-greaves');grant(debuff,debuff.players[0]!,'D10');debuff.phase='REVEAL';assert.equal(advanceAppraisalEncounter(debuff).players[0]!.energy,6);
 const buff=make();give(buff,'orc-ironroot-greaves');grant(buff,buff.players[0]!,'B14');buff.phase='REVEAL';assert.equal(advanceAppraisalEncounter(buff).players[0]!.energy,9);
});

test('E61 ignores acquisition mid-encounter, dead seats and goods outside carried custody',()=>{
 const s=make();const i=give(s,'autometa-servo-harness');assert.equal(s.players[0]!.energy,8);appraisalViewFor(s,'alice');assert.equal(s.players[0]!.energy,8);s.players[0]!.inventory=[];i.owner='removed';s.phase='REVEAL';assert.equal(advanceAppraisalEncounter(s).players[0]!.energy,6);
 const dead=make();give(dead,'orc-ironroot-greaves');dead.players[0]!.life=0;dead.players[0]!.paused='dead';dead.players[0]!.done=true;dead.phase='REVEAL';assert.equal(advanceAppraisalEncounter(dead).players[0]!.energy,8);
});

test('E63 quotes and settles the same recovery discount with minimum1 and no extra recovery right',()=>{
 let s=make();shop(s,'autometa');give(s,'orc-ember-salve');const p=s.players[0]!,before=p.credits;p.energy=3;assert.equal(recoveryOffer(s,p)!.credits,1);assert.equal(appraisalViewFor(s,p.id).self.recoveryOffer!.credits,1);
 s=act(s,{type:'recover-resource',target:'energy',quoteId:recoveryOffer(s,s.players[0]!)?.quoteId});assert.equal(s.players[0]!.credits,before-1);assert.equal(s.players[0]!.energy,6);assert.throws(()=>act(s,{type:'recover-resource',target:'energy',quoteId:recoveryOffer(s,s.players[0]!)?.quoteId}));
 const life=make();shop(life,'orc');life.players[0]!.npcTrust!.orc=3;life.players[0]!.life=2;give(life,'orc-ember-salve');give(life,'deepsea-whale-conch-horn');assert.equal(recoveryOffer(life,life.players[0]!)!.credits,5);
});

test('E02 narrows the real inspected range by20percent*S capped50 without revealing other facts or overriding fog/exact',()=>{
 const baseline=make(),old=range(baseline).facts.range!;
 for(const [power,copy,r] of [[1,false,.2],[8,false,.5],[1,true,.08]] as const){const s=make();give(s,'autometa-data-prism',power,copy);const {facts}=range(s);assert.deepEqual(facts.range,[Math.floor(old[0]+(100-old[0])*r),Math.ceil(old[1]-(old[1]-100)*r)]);assert.equal(facts.base,undefined);assert.equal(facts.genuine,undefined);assert.equal(facts.cursed,undefined);}
 const fog=make();give(fog,'autometa-data-prism',8);grant(fog,fog.players[0]!,'D02');assert.deepEqual(range(fog).facts.range,old);
 const exact=make();give(exact,'autometa-data-prism');grant(exact,exact.players[0]!,'B01');assert.equal(range(exact).facts.base,100);
});

function acceptance(native:boolean,rollLow:number,rollHigh:number,pilot=false,power=1,kind:ItemKind='vampire-gloam-violin'){const s=make(),item=shop(s);item.base=100;item.reservation=99;item.ask=100;if(native)give(s,kind,power);if(pilot)give(s,'alien-thought-translator');for(let n=0;n<20000;n++){s.seed='accept-'+n;const roll=randomAt(s.seed,`1:alice:${item.id}:trust-accept:0`);if(roll>=rollLow&&roll<rollHigh){appraise(s,s.players[0]!,item.id,90,false,true);return s.players[0]!.valuations[item.id]!.accepted;}}throw Error('bounded acceptance seed unavailable');}
test('E11 acceptance bonus is2pp per strength capped6pp and composes with unchanged pilot translator',()=>{assert.equal(acceptance(false,.01,.019),false);assert.equal(acceptance(true,.01,.019),true);assert.equal(acceptance(true,.061,.07,false,8),false);assert.equal(acceptance(true,.05,.059,false,8),true);assert.equal(acceptance(true,.03,.039,true),true);});

test('E07 quote adds10pp per strength capped20pp, excludes the target tool and never changes price or tool truth',()=>{
 const s=make();shop(s);const target=give(s,'orc-tusk-shield');const base=cleanseOffer(s,s.players[0]!)!.items.find(i=>i.itemId===target.id)!;const tongs=give(s,'orc-clan-forge-tongs');const offer=cleanseOffer(s,s.players[0]!)!;const boosted=offer.items.find(i=>i.itemId===target.id)!;assert.equal(boosted.chance,base.chance+10);assert.equal(boosted.price,base.price);assert.equal(offer.items.find(i=>i.itemId===tongs.id)!.chance,base.chance);
 tongs.genuine=false;tongs.cursed=true;assert.equal(cleanseOffer(s,s.players[0]!)!.items.find(i=>i.itemId===target.id)!.chance,base.chance+10);give(s,'deepsea-abyss-trident',8);assert.equal(cleanseOffer(s,s.players[0]!)!.items.find(i=>i.itemId===target.id)!.chance,base.chance+20);
});

for(const kind of ['orc-ironroot-greaves','autometa-servo-harness','alien-biobright-seedpod'] as const)test(kind+' restores actual energy at the next boundary',()=>{const s=make();give(s,kind);s.phase='REVEAL';assert.equal(advanceAppraisalEncounter(s).players[0]!.energy,7);});
for(const kind of ['orc-ember-salve','deepsea-whale-conch-horn'] as const)test(kind+' changes the actual recovery quote',()=>{const s=make();shop(s,'autometa');s.players[0]!.energy=3;give(s,kind);assert.equal(recoveryOffer(s,s.players[0]!)!.credits,1);});
for(const kind of ['vampire-gloam-violin','swarm-pheromone-sprayer'] as const)test(kind+' changes the NPC acceptance outcome without changing its truth',()=>{assert.equal(acceptance(true,.01,.019,false,1,kind),true);});
for(const kind of ['orc-clan-forge-tongs','deepsea-abyss-trident'] as const)test(kind+' improves the real cleanse quote for another held item',()=>{const s=make();shop(s);const target=give(s,'orc-tusk-shield');give(s,kind);assert.equal(cleanseOffer(s,s.players[0]!)!.items.find(i=>i.itemId===target.id)!.chance,60);});

test('E61 shared origin cap prevents an original and its transferred copy earning twice at one boundary',()=>{const s=make(),original=give(s,'orc-ironroot-greaves',8),copy=give(s,'orc-ironroot-greaves',8,true,1);copy.copy!.sourceId=original.id;s.phase='REVEAL';const next=advanceAppraisalEncounter(s);assert.deepEqual(next.players.map(p=>p.energy),[8,6]);});

test('E07 public paid cleanse uses the displayed odds and retains both held tools, with no pre-attempt truth leak',()=>{let s=make();shop(s);const target=give(s,'orc-tusk-shield'),tongs=give(s,'orc-clan-forge-tongs');target.cursed=true;for(let n=0;n<10000;n++){const seed='cleanse-'+n,roll=randomAt(seed,`1:alice:${target.id}:cleanse-roll`);if(roll>=.5&&roll<.6){s.seed=seed;break;}if(n===9999)throw Error('no bounded cleanse seed');}const before=s.players[0]!.credits,quote=cleanseOffer(s,s.players[0]!)!.items.find(i=>i.itemId===target.id)!;assert.equal(quote.chance,60);assert.equal(appraisalViewFor(s,'alice').self.inventory.find(i=>i.id===target.id)!.knowledge.cursed,undefined);s=act(s,{type:'cleanse',itemId:target.id});assert.equal(s.players[0]!.credits,before-quote.price);assert.equal(s.items[target.id]!.cursed,false);assert(s.players[0]!.inventory.includes(tongs.id));});

test('E63 quote is read-only and its successful use cannot refresh by transfer or a same-origin copy',()=>{
 let s=make();shop(s,'autometa');s.players[0]!.energy=3;const salve=give(s,'orc-ember-salve',8);assert.equal(recoveryOffer(s,s.players[0]!)!.credits,1);assert.equal(recoveryOffer(s,s.players[0]!)!.credits,1);
 s=act(s,{type:'recover-resource',target:'energy',quoteId:recoveryOffer(s,s.players[0]!)?.quoteId});const a=s.players[0]!,b=s.players[1]!;b.selectedPortalId=b.portals[0]!.id;b.portals[0]!.npc='autometa';b.energy=3;
 a.inventory=a.inventory.filter(id=>id!==salve.id);s.items[salve.id]!.owner=b.id;b.inventory.push(salve.id);assert.equal(recoveryOffer(s,b)!.credits,2,'same physical origin is already used');
 b.inventory=[];s.items[salve.id]!.owner='removed';const copy=give(s,'orc-ember-salve',8,true,1);copy.copy!.sourceId=salve.id;assert.equal(recoveryOffer(s,b)!.credits,2,'copy inherits origin use');
});

test('effects3 sealed full-game archives replay with their own config without altering stage1 or2',()=>{
 const repo=new URL('../../../../',import.meta.url),stage=JSON.parse(fs.readFileSync(new URL('docs/game-design/native56-stage3.json',repo),'utf8')),hash=(bytes:Buffer)=>crypto.createHash('sha256').update(bytes).digest('hex');assert.equal(stage.native56Effects,3);assert.equal(stage.implementedPrimaryItemIds.length,21);
 for(const a of stage.archives){const bytes=fs.readFileSync(new URL(a.file,repo));assert.equal(hash(bytes),a.sha256);const raw=gunzipSync(bytes);assert.equal(hash(raw),a.rawSha256);const state=replayAppraisalAudit(JSON.parse(raw.toString()));assert.equal(state.phase,'RESULTS');assert.equal(state.config.native56Effects,3);}
});

test('E61 checks lock eligibility after expiry while snapshotting physical custody before the boundary',()=>{
 const s=make(),i=give(s,'orc-ironroot-greaves');grant(s,s.players[0]!,'D09',i.id);s.players[0]!.statuses.find(x=>x.id==='D09')!.expires=1;s.phase='REVEAL';assert.equal(advanceAppraisalEncounter(s).players[0]!.energy,7,'expired lock does not erase continuously carried physical custody');
 const locked=make(),tool=give(locked,'orc-ironroot-greaves');grant(locked,locked.players[0]!,'D09',tool.id);locked.players[0]!.statuses.find(x=>x.id==='D09')!.expires=3;locked.phase='REVEAL';assert.equal(advanceAppraisalEncounter(locked).players[0]!.energy,6);
});

test('E02 inspected replacement truth stays inside its range even when no rarity-power metadata exists',()=>{
 let s=make();give(s,'autometa-data-prism');delete s.config.rarity;delete s.config.rarityEconomy;for(const i of Object.values(s.items)){delete i.appearance;delete i.rarityPower;}const item=shop(s);item.base=999;item.ask=999;item.reservation=999;s=act(s,{type:'inspect',itemId:item.id,property:'price'});const range=s.players[0]!.knowledge[item.id]!.range!;assert(range[0]<=999&&range[1]>=999,'replacement-scaled truth must not escape');assert(range[0]<range[1],'range effect cannot accidentally grant an exact fact');assert.equal(s.players[0]!.knowledge[item.id]!.base,undefined);
});

test('E63 rejects an earlier same-origin quote after another owner spends that family right',()=>{
 let s=make();shop(s,'autometa');s.players[0]!.energy=3;const salve=give(s,'orc-ember-salve',8),copy=give(s,'orc-ember-salve',8,true,1);copy.copy!.sourceId=salve.id;
 const b=s.players[1]!;b.selectedPortalId=b.portals[0]!.id;b.portals[0]!.npc='autometa';b.energy=3;
 const old=recoveryOffer(s,b)!;assert.equal(old.credits,1);
 s=act(s,{type:'recover-resource',target:'energy',quoteId:recoveryOffer(s,s.players[0]!)!.quoteId});
 const before=structuredClone(s);assert.equal(recoveryOffer(s,s.players[1]!)!.credits,2);
 assert.throws(()=>act(s,{type:'recover-resource',target:'energy',quoteId:old.quoteId},1),/ข้อเสนอ.*เปลี่ยน/);assert.deepEqual(s,before);
 s=act(s,{type:'recover-resource',target:'energy',quoteId:recoveryOffer(s,s.players[1]!)!.quoteId},1);assert.equal(s.players[1]!.credits,before.players[1]!.credits-2);
});
