import test from 'node:test';
import assert from 'node:assert/strict';
import {applyDread,dreadNow} from '../src/game/appraisal/core2-rules.js';
import {createAppraisalRun,appraisalViewFor} from '../src/game/appraisal/index.js';
import {randomAt} from '../src/game/random.js';
import {dreadChance} from '../src/game/appraisal/core2.js';
import {omenNow,status} from '../src/game/appraisal/mechanics.js';
import {defaultRarityConfig} from '../src/shared/item-rarity.js';
import {defaultRarityEconomy} from '../src/shared/rarity-power.js';
import type {AppraisalItem,AppraisalState,Appraiser,ItemKind} from '../src/game/appraisal/types.js';

function game(revision:12|13,seed='e67-dread') {
 const s=createAppraisalRun(['alice','bob'],seed,{catalogVersion:5,native56Effects:revision,core2:true,survival:{maxLife:6,encounterLifeCost:1,entryEnergyCost:0},startingCredits:50,maxEnergy:10,marketProbability:0,npcEvents:false,secureEconomy:false,commerce:false,roundRewards:false,trustAbilities:false});
 s.config.rarity??=defaultRarityConfig();s.config.rarityEconomy??=defaultRarityEconomy();
 s.encounter=6;
 return s;
}

function hold(s:AppraisalState,p:Appraiser,kind:ItemKind,power=1):AppraisalItem {
 const source=Object.values(s.items)[0]!,rarity=power>=8?'mythic':power>=6?'legendary':power>=4?'epic':power>=3?'rare':power>=2?'uncommon':'common';
 const item:AppraisalItem={...source,id:`held-${p.inventory.length}-${kind}`,kind,owner:p.id,genuine:true,cursed:false,appearance:{version:1,rarity,theme:'plain',visualSeed:1},rarityPower:{version:1,valueMultiplier:power,effectMultiplier:power}};
 s.items[item.id]=item;p.inventory.push(item.id);return item;
}

test('E67 applies the existing-omen/B23 chance first, then one shared 20% relative family cap',()=>{
 const s=game(13),p=s.players[0]!;
 p.statuses.push({id:'B23',starts:s.encounter,expires:s.encounter,charges:1});
 const base=dreadChance(s.encounter,(omenNow(s)?.dread??1)*(status(p,'B23')?.5:1));
 assert.equal(dreadNow(s,p),base);
 hold(s,p,'alien-spore-lantern');
 assert.equal(dreadNow(s,p),base*.9,'one common tool reduces the post-omen, post-B23 chance by 10% relatively');
 hold(s,p,'darkone-omen-censer');
 assert.equal(dreadNow(s,p),base*.8,'lantern and censer share the 20% family cap');
 hold(s,p,'alien-spore-lantern',8);
 assert.equal(dreadNow(s,p),base*.8,'rarity and additional tools cannot exceed the family cap');
 assert.equal(appraisalViewFor(s,p.id).dread,dreadNow(s,p),'the displayed chance matches the settlement chance');
});

test('E67 is inactive before revision13 and on the preserved catalog',()=>{
 const early=game(12),earlyPlayer=early.players[0]!;hold(early,earlyPlayer,'alien-spore-lantern');
 const expectedEarly=dreadChance(early.encounter,omenNow(early)?.dread??1);
 assert.equal(dreadNow(early,earlyPlayer),expectedEarly);
 const legacy=game(13);legacy.config.catalogVersion=4;const legacyPlayer=legacy.players[0]!;hold(legacy,legacyPlayer,'alien-spore-lantern');
 const expectedLegacy=dreadChance(legacy.encounter,omenNow(legacy)?.dread??1);
 assert.equal(dreadNow(legacy,legacyPlayer),expectedLegacy);
});

test('E67 changes only the actual settlement threshold without rerolling',()=>{
 let protectedRun:AppraisalState|undefined,plainRun:AppraisalState|undefined;
 for(let i=0;i<10000;i++){
  const seed=`e67-roll-${i}`,protectedCandidate=game(13,seed),plainCandidate=game(12,seed);
  hold(protectedCandidate,protectedCandidate.players[0]!,'alien-spore-lantern');
  hold(plainCandidate,plainCandidate.players[0]!,'alien-spore-lantern');
  const roll=randomAt(seed,`${protectedCandidate.encounter}:${protectedCandidate.players[0]!.id}:dread`);
  if(roll>=dreadNow(protectedCandidate,protectedCandidate.players[0]!)&&roll<dreadNow(plainCandidate,plainCandidate.players[0]!)){
   protectedRun=protectedCandidate;plainRun=plainCandidate;break;
  }
 }
 assert(protectedRun&&plainRun,'fixture seed must land between the protected and unprotected thresholds');
 const protectedPlayer=protectedRun.players[0]!,plainPlayer=plainRun.players[0]!;
 assert.equal(protectedRun.seed,plainRun.seed);
 assert.equal(randomAt(protectedRun.seed,`${protectedRun.encounter}:${protectedPlayer.id}:dread`),randomAt(plainRun.seed,`${plainRun.encounter}:${plainPlayer.id}:dread`));
 applyDread(protectedRun,protectedPlayer);applyDread(plainRun,plainPlayer);
 assert.equal(protectedRun.trace.some(e=>e.type==='dread-hit'),false);
 const hit=plainRun.trace.find(e=>e.type==='dread-hit');assert(hit,'the exact same roll hits without E67');
 assert.equal(hit.details.chance,dreadNow(plainRun,plainPlayer));
});
