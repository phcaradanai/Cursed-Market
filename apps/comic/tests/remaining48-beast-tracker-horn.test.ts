import test from 'node:test';
import assert from 'node:assert/strict';
import { createAppraisalRun } from '../src/game/appraisal/index.js';
import { useMerchantAbility } from '../src/game/appraisal/merchant-abilities.js';
import { defaultRarityConfig } from '../src/shared/item-rarity.js';
import { defaultRarityEconomy } from '../src/shared/rarity-power.js';
import type { AppraisalAction, AppraisalItem, AppraisalState, Appraiser } from '../src/game/appraisal/types.js';

let sequence=0;

function makeState(seed:string,revision=14,trust=1):AppraisalState {
  const state=createAppraisalRun(['alice','bob'],seed,{
    catalogVersion:5,native56Effects:13,trustAbilities:true,expansion:true,
    rarity:defaultRarityConfig(),rarityEconomy:defaultRarityEconomy(),marketProbability:0,
    roundRewards:false,secureEconomy:false,commerce:false,
  });
  (state.config as unknown as {native56Effects?:number}).native56Effects=revision;
  state.phase='APPRAISAL';
  for(const player of state.players){player.done=false;player.paused=null;player.eventOffer=null;player.skillUsed=false;player.inventory=[];player.stock=[];player.npcTrust={};}
  state.players[0]!.npcTrust!.beast=trust;
  return state;
}

function addItem(state:AppraisalState,player:Appraiser,id:string,kind:AppraisalItem['kind'],owner=player.id,extras:Partial<AppraisalItem>={}):AppraisalItem {
  const item:AppraisalItem={id,kind,base:30,ask:30,reservation:12,genuine:true,cursed:false,owner,npcOwnerId:player.id,npc:'beast',encounter:state.encounter,certificate:false,lastAppraisal:null,lastAccepted:null,...extras};
  state.items[id]=item;return item;
}

function giveHorn(state:AppraisalState,player:Appraiser,power=1,copy=false):void {
  const id=`tracker-${++sequence}`;
  if(copy)addItem(state,player,`origin-${id}`,'beast-tracker-horn','retired');
  const item=addItem(state,player,id,'beast-tracker-horn',player.id,{
    rarityPower:{version:1,valueMultiplier:1,effectMultiplier:power},
    appearance:{version:1,rarity:'common',theme:'plain',visualSeed:sequence},
    ...(copy?{copy:{sourceId:`origin-${id}`,number:1,valuePercent:40}}:{}),
  });
  player.inventory.push(item.id);
}

function openBeastAbility(seed:string,revision=14,power=0,trust=1,copy=false,catalogVersion=5):{state:AppraisalState;player:Appraiser;source:AppraisalItem;action:Extract<AppraisalAction,{type:'merchant-ability'}>} {
  const state=makeState(seed,revision,trust),player=state.players[0]!;
  (state.config as unknown as {catalogVersion:number}).catalogVersion=catalogVersion;
  if(power)giveHorn(state,player,power,copy);
  const source=addItem(state,player,'beast-shop-source','beast-tracker-horn',`npc:${player.id}:${state.encounter}`,{npc:'beast'});
  player.stock=[source.id];const portal=player.portals[0]!;portal.npc='beast';portal.stock=[source.id];player.selectedPortalId=portal.id;
  const action:Extract<AppraisalAction,{type:'merchant-ability'}>={type:'merchant-ability',playerId:player.id,requestId:`tracker-use-${++sequence}`,encounter:state.encounter,npc:'beast',itemId:source.id};
  useMerchantAbility(state,player,action);
  return {state,player,source,action};
}

test('E32 adds floor(strength) Beast candidate choices only at catalog5 revision14, capped at two',()=>{
  const legacy=openBeastAbility('e32-gate-legacy',13,8),plain=openBeastAbility('e32-no-tool',14),one=openBeastAbility('e32-one',14,1),fractional=openBeastAbility('e32-copy-floor',14,1,1,true),two=openBeastAbility('e32-two',14,2),tierSix=openBeastAbility('e32-tier-six-base',14,0,6),capped=openBeastAbility('e32-cap',14,8,6),oldCatalog=openBeastAbility('e32-old-catalog',14,8,1,false,4);
  const count=(result:{player:Appraiser})=>result.player.abilityChoice!.itemIds.length;
  assert.equal(count(legacy),2,'revision13 keeps the base Beast count');
  assert.equal(count(plain),2,'no held E32 does not change the Beast list');
  assert.equal(count(one),3,'one strength adds one candidate');
  assert.equal(count(fractional),2,'a 0.4-strength copy alone rounds down to zero choices');
  assert.equal(count(two),4,'two strength adds two candidates');
  assert.equal(count(capped),count(tierSix)+2,'rarity cannot exceed the two-candidate family cap');
  assert.equal(count(oldCatalog),2,'catalog4 remains unchanged');
});

test('E32 scales from Beast tier count, never adds extra selections or creates a reroll on repeat',()=>{
  const base=openBeastAbility('e32-tier-base',14,0,6),boosted=openBeastAbility('e32-tier-boosted',14,8,6);
  const before=[...boosted.player.abilityChoice!.itemIds];
  assert.equal(before.length,base.player.abilityChoice!.itemIds.length+2,'the bonus adds choices after the real trust tier');
  assert.throws(()=>useMerchantAbility(boosted.state,boosted.player,{...boosted.action,requestId:'tracker-repeat'}));
  assert.deepEqual(boosted.player.abilityChoice!.itemIds,before,'the persisted candidate list does not reroll');
  const selected=before.find(id=>id!==boosted.source.id)!;
  useMerchantAbility(boosted.state,boosted.player,{...boosted.action,requestId:'tracker-choice',choiceId:selected});
  assert.equal(boosted.player.stock.length,1,'selecting from more candidates still replaces one shop slot');
  assert.equal(boosted.state.items[selected]!.owner,`npc:${boosted.player.id}:${boosted.state.encounter}`);
  assert.equal(boosted.state.items[boosted.source.id]!.owner,'retired');
  assert.equal(boosted.player.abilityChoice,undefined,'only one candidate can be accepted');
});

test('E32 does not increase Alien ability candidates',()=>{
  const state=makeState('e32-alien-scope'),player=state.players[0]!;
  player.npcTrust!.alien=1;giveHorn(state,player,8);
  const source=addItem(state,player,'alien-source','alien-biobright-seedpod',player.id,{npc:'alien'});player.inventory.push(source.id);
  const action:Extract<AppraisalAction,{type:'merchant-ability'}>={type:'merchant-ability',playerId:player.id,requestId:'e32-alien',encounter:state.encounter,npc:'alien',itemId:source.id};
  useMerchantAbility(state,player,action);
  assert.equal(player.abilityChoice!.itemIds.length,2,'Alien keeps its base count even while the Beast horn is held');
});
