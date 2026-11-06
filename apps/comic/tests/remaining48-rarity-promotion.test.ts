import test from 'node:test';
import assert from 'node:assert/strict';
import { createAppraisalRun } from '../src/game/appraisal/index.js';
import { handleCollectorWishlist, reconcileCollectorWishlist } from '../src/game/appraisal/collector-wishlist.js';
import { ghostQuotes } from '../src/game/appraisal/ghost-service.js';
import { merchantKinds, NPC_SPECS, priceRange } from '../src/game/appraisal/content.js';
import { anchorOf } from '../src/game/appraisal/core2.js';
import { e25CandidatePromotionChanceBps, useMerchantAbility } from '../src/game/appraisal/merchant-abilities.js';
import { remainingStrength } from '../src/game/appraisal/remaining48-numbers.js';
import { REMAINING48_ITEMS } from '../src/game/appraisal/remaining48-catalog.js';
import { ensureItemAppearance } from '../src/game/appraisal/rarity.js';
import { randomAt } from '../src/game/random.js';
import { defaultRarityConfig, RARITIES, rollAppearance } from '../src/shared/item-rarity.js';
import type { AppraisalAction, AppraisalItem, AppraisalState, Appraiser, ItemKind } from '../src/game/appraisal/types.js';
import { defaultRarityEconomy } from '../src/shared/rarity-power.js';

const E25_KINDS=['alien-star-chart-membrane','beast-trail-scent-disc'] as const satisfies readonly ItemKind[];
type Skill='alien'|'beast';
let sequence=0;

function setRevision(state:AppraisalState,revision:number):void {
  (state.config as unknown as {native56Effects?:number}).native56Effects=revision;
}
function makeState(seed:string,revision=13,extra:Record<string,unknown>={}):AppraisalState {
  const state=createAppraisalRun(['alice','bob'],seed,{
    catalogVersion:5,native56Effects:13,trustAbilities:true,expansion:true,
    rarity:defaultRarityConfig(),rarityEconomy:defaultRarityEconomy(),
    marketProbability:0,roundRewards:false,secureEconomy:false,commerce:false,
    ...extra,
  });
  setRevision(state,revision);state.phase='APPRAISAL';
  for(const player of state.players){player.done=false;player.paused=null;player.eventOffer=null;player.skillUsed=false;player.inventory=[];player.stock=[];player.npcTrust={};}
  return state;
}
function addItem(state:AppraisalState,player:Appraiser,id:string,kind:ItemKind,owner=player.id,extras:Partial<AppraisalItem>={}):AppraisalItem {
  const item:AppraisalItem={id,kind,base:30,ask:30,reservation:12,genuine:true,cursed:false,owner,npcOwnerId:player.id,npc:'alien',encounter:state.encounter,certificate:false,lastAppraisal:null,lastAccepted:null,...extras};
  state.items[id]=item;return item;
}
function giveTool(state:AppraisalState,player:Appraiser,kind:typeof E25_KINDS[number],power=1,copy=false):AppraisalItem {
  const id=`e25-held-${++sequence}`;
  const item=addItem(state,player,id,kind,player.id,{rarityPower:{version:1,valueMultiplier:1,effectMultiplier:power},appearance:{version:1,rarity:'common',theme:'plain',visualSeed:7},...(copy?{copy:{sourceId:`source-${id}`,number:1,valuePercent:40}}:{})});
  player.inventory.push(id);return item;
}
function sourceItem(state:AppraisalState,player:Appraiser,skill:Skill):AppraisalItem {
  if(skill==='alien'){
    const item=addItem(state,player,'alien-ability-source','alien-biobright-seedpod',player.id,{base:1000,ask:1000,npc:'alien'});
    player.inventory.push(item.id);return item;
  }
  const id='beast-ability-source';
  const item=addItem(state,player,id,'beast-tracker-horn',`npc:${player.id}:${state.encounter}`,{base:1000,ask:1000,npc:'beast'});
  player.stock=[id];const portal=player.portals[0]!;portal.npc='beast';portal.stock=[id];player.selectedPortalId=portal.id;return item;
}
function candidateSeed(skill:Skill,drawMinBps=0,drawMaxBps=1500):string {
  const target=skill==='alien'?E25_KINDS[0]:E25_KINDS[1],sourceKind:ItemKind=skill==='alien'?'alien-biobright-seedpod':'beast-tracker-horn';
  let pool=merchantKinds(skill,5,true,true,true,true,true);
  if(skill==='alien'&&pool.length>1)pool=pool.filter(kind=>kind!==sourceKind);
  const slots=skill==='alien'?4:3,key=`1-alice-${skill}`,rarity=defaultRarityConfig();
  for(let n=0;n<50_000;n++){
    const seed=`e25-${skill}-${n}`;
    for(let slot=0;slot<slots;slot++){
      if(pool[Math.floor(randomAt(seed,`${key}:${slot}:kind`)*pool.length)]!==target)continue;
      const id=`ability-${key}-${slot}`,draw=randomAt(seed,`${id}:E25:promotion:v1`)*10000;
      const appearanceSeed=Math.floor(randomAt(seed,`${id}:appearance:v1`)*0x100000000),base=rollAppearance(appearanceSeed,rarity);
      if(draw>=drawMinBps&&draw<drawMaxBps&&base.rarity!=='mythic')return seed;
    }
  }
  throw new Error(`Could not find a deterministic ${skill} E25 candidate seed`);
}
function openAbility(state:AppraisalState,skill:Skill):AppraisalItem[] {
  const player=state.players[0]!;player.npcTrust![skill]=6;
  const source=sourceItem(state,player,skill);
  const action:Extract<AppraisalAction,{type:'merchant-ability'}>={type:'merchant-ability',playerId:player.id,requestId:`e25-ability-${++sequence}`,encounter:state.encounter,npc:skill,itemId:source.id};
  useMerchantAbility(state,player,action);
  return (player.abilityChoice?.itemIds??[]).map(id=>state.items[id]!);
}
function expectedAppearance(seed:string,id:string,state:AppraisalState,chanceBps:number) {
  const config=state.config.rarity!,appearanceSeed=Math.floor(randomAt(seed,`${id}:appearance:v1`)*0x100000000),base=rollAppearance(appearanceSeed,config);
  const draw=randomAt(seed,`${id}:E25:promotion:v1`)*10000;
  const promoted=draw<chanceBps?RARITIES.slice(RARITIES.indexOf(base.rarity)+1).find(rarity=>config.rates[rarity]>0&&config.themes[rarity]?.some(theme=>theme.weight>0)):undefined;
  if(!promoted)return base;
  const rates=Object.fromEntries(RARITIES.map(rarity=>[rarity,rarity===promoted?1:0])) as typeof config.rates;
  return rollAppearance(appearanceSeed,{...config,rates});
}
function e25Candidate(state:AppraisalState,skill:Skill):AppraisalItem {
  const expected=skill==='alien'?E25_KINDS[0]:E25_KINDS[1];
  return openAbility(state,skill).find(item=>item.kind===expected)!;
}

test('E25 stays frozen at revision 13 and computes the approved held-strength formula at revision 14',()=>{
  const state=makeState('e25-strength'),player=state.players[0]!;
  const original=giveTool(state,player,E25_KINDS[0]);
  assert.equal(e25CandidatePromotionChanceBps(state,player),0,'revision13 remains unchanged');
  setRevision(state,14);assert.equal(e25CandidatePromotionChanceBps(state,player),500,'one common original gives 500 BPS');
  const copy=giveTool(state,player,E25_KINDS[1],1,true);
  assert.equal(remainingStrength([original,copy],'E25'),1.4);
  assert.equal(e25CandidatePromotionChanceBps(state,player),700,'a held copy contributes its 0.4 strength');

  addItem(state,player,'e25-not-carried',E25_KINDS[0],player.id,{rarityPower:{version:1,valueMultiplier:1,effectMultiplier:8}});
  assert.equal(e25CandidatePromotionChanceBps(state,player),700,'items outside inventory are not held sources');
  const loan=giveTool(state,player,E25_KINDS[0],8);
  player.npcContracts={alien:{lentAt:1,dueAt:2,itemIds:[loan.id],key:'e25-loan',reservedCredits:0}};
  assert.equal(e25CandidatePromotionChanceBps(state,player),700,'Alien-loaned sources are excluded');

  const high=giveTool(state,player,E25_KINDS[1],8);assert.equal(e25CandidatePromotionChanceBps(state,player),1500,'family chance caps at 1500 BPS');
  player.inventory=player.inventory.filter(id=>id!==high.id);state.items[high.id]!.owner='vault:alice';
  assert.equal(e25CandidatePromotionChanceBps(state,player),700,'vault custody does not add strength');
  player.life=0;assert.equal(e25CandidatePromotionChanceBps(state,player),0,'dead owners cannot source held effects');
  player.life=3;(state.config as AppraisalState['config']).catalogVersion=4;assert.equal(e25CandidatePromotionChanceBps(state,player),0,'legacy catalog revisions stay unaffected');
});

test('E25 promotes only Alien and Beast ability candidates, then applies final rarity value once',()=>{
  for(const skill of ['alien','beast'] as const){
    const seed=candidateSeed(skill),legacy=makeState(seed,13),live=makeState(seed,14);
    for(const state of [legacy,live])giveTool(state,state.players[0]!,skill==='alien'?E25_KINDS[0]:E25_KINDS[1],8);
    const old=e25Candidate(legacy,skill),candidate=e25Candidate(live,skill);
    assert(old&&candidate,`${skill} ability must generate its approved E25 family item for this seed`);
    assert.equal(old.appearance!.rarity,expectedAppearance(seed,old.id,legacy,0).rarity,'revision13 retains the base rarity roll');
    const chance=e25CandidatePromotionChanceBps(live,live.players[0]!);
    assert.equal(chance,1500);
    const expected=expectedAppearance(seed,candidate.id,live,chance);
    assert.deepEqual(candidate.appearance,expected,`${skill} candidate uses one deterministic extra roll and at most one enabled tier`);
    const valueMultiplier=live.config.rarityEconomy!.tiers[expected.rarity].value;
    const anchor=anchorOf(live.config,candidate.kind),range=priceRange(candidate.kind,anchor);
    const rawBase=range[0]+Math.floor(randomAt(seed,`${candidate.id}:base`)*(range[1]-range[0]+1));
    const rawAsk=Math.max(1,anchor-2+Math.floor(randomAt(seed,`${candidate.id}:ask`)*6));
    const rawReservation=Math.max(1,Math.ceil(rawBase*NPC_SPECS[skill].reservation[0]));
    assert.equal(candidate.base,Math.floor(rawBase*valueMultiplier),'base price scales exactly once');
    assert.equal(candidate.ask,Math.floor(rawAsk*valueMultiplier),'ask scales exactly once');
    assert.equal(candidate.reservation,Math.floor(rawReservation*valueMultiplier),'reservation scales exactly once');
    assert.equal(candidate.rarityPower!.valueMultiplier,valueMultiplier);
    assert.equal(candidate.copy,undefined,'a newly generated candidate is not a Swarm copy');
    assert.equal(live.players[0]!.knowledge[candidate.id],undefined,'candidate truth is not added to owner knowledge');
    assert.equal(live.publicKnowledge[candidate.id],undefined,'candidate truth is not made public');
  }
});

test('E25 remains opt-in only: existing/stock finalization, Collector, Spirit, Swarm copies, and legacy favorites do not promote',()=>{
  const state=makeState('e25-exclusions',14,{collectorWishlistRules:1}),player=state.players[0]!;
  giveTool(state,player,E25_KINDS[0],8);assert.equal(e25CandidatePromotionChanceBps(state,player),1500);

  const base=defaultRarityConfig();
  for(const origin of ['stock','existing','spirit-prototype'] as const){
    const item=addItem(state,player,`e25-${origin}`,E25_KINDS[0],player.id);
    ensureItemAppearance(state,item);
    const appearanceSeed=Math.floor(randomAt(state.seed,`${item.id}:appearance:v1`)*0x100000000);
    assert.deepEqual(item.appearance,rollAppearance(appearanceSeed,base),`${origin} keeps the ordinary base roll without an opt-in chance`);
  }
  const existing=state.items['e25-existing']!;ensureItemAppearance(state,existing,1500);
  assert.deepEqual(existing.appearance,rollAppearance(Math.floor(randomAt(state.seed,`${existing.id}:appearance:v1`)*0x100000000),base),'already finalized goods are never rerolled');

  const copySource=addItem(state,player,'e25-swarm-source',E25_KINDS[0],player.id,{appearance:{version:1,rarity:'common',theme:'plain',visualSeed:33},rarityPower:{version:1,valueMultiplier:1,effectMultiplier:1}});
  player.inventory.push(copySource.id);player.npcTrust!.swarm=6;
  const swarm:Extract<AppraisalAction,{type:'merchant-ability'}>={type:'merchant-ability',playerId:player.id,requestId:`e25-swarm-${++sequence}`,encounter:state.encounter,npc:'swarm',itemId:copySource.id};
  useMerchantAbility(state,player,swarm);
  const copy=Object.values(state.items).find(item=>item.copy?.sourceId===copySource.id)!;
  assert(copy);assert.deepEqual(copy.appearance,copySource.appearance,'Swarm copies inherit existing appearance without E25 promotion');

  state.encounter=2;state.phase='PORTALS';
  reconcileCollectorWishlist(state);
  handleCollectorWishlist(state,player,{type:'collector-wish-request',kinds:[E25_KINDS[0],E25_KINDS[1],'alien-thought-translator']});
  state.encounter=4;reconcileCollectorWishlist(state);
  const wish=state.collectorWishes![player.id]!,collectorItems=wish.offer!.itemIds.map(id=>state.items[id]!);
  for(const item of collectorItems.filter(item=>E25_KINDS.includes(item.kind as typeof E25_KINDS[number]))){
    const appearanceSeed=Math.floor(randomAt(state.seed,`${item.id}:appearance:v1`)*0x100000000);
    assert.deepEqual(item.appearance,rollAppearance(appearanceSeed,base),'Collector delivery uses the standard appearance roll');
  }

  const ghostId='bob',kind=E25_KINDS[1];
  for(const [id,item] of Object.entries(state.items))if(item.kind===kind)delete state.items[id];
  const prototype=addItem(state,player,'e25-spirit-market-item',kind,`npc:${ghostId}:1`,{npc:'beast'});
  delete prototype.appearance;delete prototype.rarityPower;
  state.ghosts={[ghostId]:{round:1,available:true,swaps:[],encounter:state.encounter,slots:[],jobs:[],bonus:0,draws:0}};
  const allKinds=[...new Set(Object.values(state.items).map(item=>item.kind))];let selectedSeed=state.seed;
  for(let n=0;n<500;n++){
    const candidate=`e25-spirit-${n}`;
    const order=[...allKinds].sort((a,b)=>randomAt(candidate,`ghost-quote:${state.encounter}:${ghostId}:alice:${a}`)-randomAt(candidate,`ghost-quote:${state.encounter}:${ghostId}:alice:${b}`));
    if(order.slice(0,3).includes(kind)){selectedSeed=candidate;break;}
  }
  state.seed=selectedSeed;
  const spiritOffer=ghostQuotes(state,ghostId,'alice').find(quote=>quote.kind===kind)!;
  assert(spiritOffer);const spiritSeed=Math.floor(randomAt(selectedSeed,`${prototype.id}:appearance:v1`)*0x100000000);
  assert.deepEqual(spiritOffer.prototype.appearance,rollAppearance(spiritSeed,base),'Spirit quotes clone stock appearance and never receive E25 candidate promotion');

  assert.deepEqual(REMAINING48_ITEMS[E25_KINDS[0]].nativeEffect,'effect:E25');
  assert.deepEqual(REMAINING48_ITEMS[E25_KINDS[1]].nativeEffect,'effect:E25');
  assert.equal(merchantKinds('alien',1).includes(E25_KINDS[0]),false,'raw Alien favorites remain legacy-only');
  assert.equal(merchantKinds('beast',1).includes(E25_KINDS[1]),false,'raw Beast favorites remain legacy-only');
});
