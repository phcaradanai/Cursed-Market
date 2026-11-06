import test from 'node:test';
import assert from 'node:assert/strict';
import {applyAppraisalAction,createAppraisalRun} from '../src/game/appraisal/index.js';
import type {AppraisalItem,ItemKind} from '../src/game/appraisal/types.js';
import {defaultRarityConfig} from '../src/shared/item-rarity.js';
import {defaultRarityEconomy} from '../src/shared/rarity-power.js';
import {passiveText} from '../src/appraisal-client/catalog-text.js';
import {setLang} from '../src/appraisal-client/i18n.js';

function copyAtTrust(trust:number,eggs=0,revision:2|3|4|5|6|7|8|9|10=10,copyEgg=false,eggPower=1){
 const state=createAppraisalRun(['alice','bob'],'e33-copy',{catalogVersion:5,native56Effects:revision,expansion:true,trustAbilities:true});
 state.config.rarity??=defaultRarityConfig();state.config.rarityEconomy??=defaultRarityEconomy();state.phase='TRADE';const player=state.players[0]!;player.eventOffer=null;player.skillUsed=false;for(const item of Object.values(state.items))if(item.owner===player.id)item.owner='removed';player.inventory=[];player.stock=[];player.npcTrust={...player.npcTrust,swarm:trust};
 const template=Object.values(state.items)[0]!;
 const add=(id:string,kind:ItemKind,npc:AppraisalItem['npc'])=>{const item:AppraisalItem={...template,id,kind,npc,owner:player.id,npcOwnerId:player.id,base:100,ask:40,reservation:0,lastAppraisal:null,lastAccepted:null};delete item.copy;state.items[id]=item;player.inventory.push(id);return item;};
 for(let i=0;i<eggs;i++){const egg=add(`egg-${i}`,'swarm-hive-egg-cluster','swarm');if(eggPower>1){egg.appearance={version:1,rarity:'uncommon',theme:'inferno',visualSeed:11};egg.rarityPower={version:1,valueMultiplier:eggPower,effectMultiplier:eggPower};}if(copyEgg&&i===0){state.items['egg-origin']={...egg,id:'egg-origin',owner:'removed'};egg.copy={sourceId:'egg-origin',number:1,valuePercent:30};}}
 const source=add('copy-source','orc-oath-sword','orc');
 const next=applyAppraisalAction(state,{type:'merchant-ability',npc:'swarm',itemId:source.id,playerId:player.id,requestId:'e33-copy',encounter:state.encounter});
 return {state:next,player:next.players[0]!,source,copy:next.items[`copy-${source.id}-1`]!};
}

test('E33 adds five value points per held strength on top of Swarm trust tiers',()=>{
 for(const [trust,eggs,expected] of [[1,0,25],[1,1,30],[3,1,40],[6,1,55],[6,3,60]] as const){
  const result=copyAtTrust(trust,eggs);assert.equal(result.copy.copy?.valuePercent,expected);assert.equal(result.copy.base,expected);
 }
 const boosted=copyAtTrust(1,1);assert.equal(boosted.state.trace.find(entry=>entry.type==='native-copy-value')?.details.bonusPercent,5);
 assert.equal(copyAtTrust(1,1,10,false,2).copy.copy?.valuePercent,35);
});

test('E33 uses the existing 40 percent copy strength and remains unavailable before effects10',()=>{
 assert.equal(copyAtTrust(1,1,10,true).copy.copy?.valuePercent,27);
 assert.equal(copyAtTrust(1,1,10,true,2).copy.copy?.valuePercent,29);
 assert.equal(copyAtTrust(6,2,9).copy.copy?.valuePercent,50);
});

test('Comic shows the held Swarm copy-value effect only after its revision unlocks and scales copied tools',()=>{
 setLang('th');
 assert.equal(passiveText('swarm-hive-egg-cluster',true,{nativeEffectReady:false}), '');
 assert.match(passiveText('swarm-hive-egg-cluster',true,{nativeEffectReady:true}),/5 จุดเปอร์เซ็นต์/);
 assert.match(passiveText('swarm-hive-egg-cluster',true,{nativeEffectReady:true,copy:{sourceId:'egg',number:1,valuePercent:30}}),/มูลค่าสำเนา 2 จุดเปอร์เซ็นต์/);
});
