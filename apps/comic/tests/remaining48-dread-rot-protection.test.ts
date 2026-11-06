import test from 'node:test';
import assert from 'node:assert/strict';
import {applyDread} from '../src/game/appraisal/core2-rules.js';
import {createAppraisalRun} from '../src/game/appraisal/index.js';
import {randomAt} from '../src/game/random.js';
import {dreadChance,dreadKinds} from '../src/game/appraisal/core2.js';
import {status} from '../src/game/appraisal/mechanics.js';
import {defaultRarityConfig} from '../src/shared/item-rarity.js';
import {defaultRarityEconomy} from '../src/shared/rarity-power.js';
import type {AppraisalItem,AppraisalState,Appraiser,ItemKind} from '../src/game/appraisal/types.js';

const encounter=6,playerId='alice';
function seedForRot(targetIndex:number,inventorySize:number):string {
 const pool=dreadKinds(encounter,true,inventorySize>0);
 for(let i=0;i<20_000;i++){
  const seed=`e68-rot-${targetIndex}-${i}`;
  if(randomAt(seed,`${encounter}:${playerId}:dread`)>=dreadChance(encounter))continue;
  if(pool[Math.floor(randomAt(seed,`${encounter}:${playerId}:dread:kind`)*pool.length)]!=='rot')continue;
  if(Math.floor(randomAt(seed,`${encounter}:${playerId}:dread:item`)*inventorySize)===targetIndex)return seed;
 }
 throw new Error('could not find a deterministic Dread rot seed');
}
function seedForDreadHit():string {
 for(let i=0;i<100;i++){const seed=`e68-no-target-${i}`;if(randomAt(seed,`${encounter}:${playerId}:dread`)<dreadChance(encounter))return seed;}
 throw new Error('could not find a deterministic Dread hit seed');
}
function game(seed:string,revision:13|14=14) {
 const s=createAppraisalRun(['alice','bob'],seed,{catalogVersion:5,native56Effects:13,core2:true,survival:{maxLife:6,encounterLifeCost:1,entryEnergyCost:0},startingCredits:50,maxEnergy:10,marketProbability:0,npcEvents:false,secureEconomy:false,commerce:false,roundRewards:false,trustAbilities:false});
 // Revision 14 is staged by the root integration after this owner-level patch.
 (s.config as unknown as {native56Effects:number}).native56Effects=revision;
 s.config.rarity??=defaultRarityConfig();s.config.rarityEconomy??=defaultRarityEconomy();s.encounter=encounter;
 const p=s.players[0]!;p.life=6;return {s,p};
}
function hold(s:AppraisalState,p:Appraiser,id:string,kind:ItemKind,copy=false):AppraisalItem {
 const source=Object.values(s.items)[0]!;
 const item:AppraisalItem={...source,id,kind,owner:p.id,npcOwnerId:p.id,genuine:true,cursed:false,...(copy?{copy:{sourceId:source.id,number:1,valuePercent:40}}:{}),appearance:{version:1,rarity:'common',theme:'plain',visualSeed:1},rarityPower:{version:1,valueMultiplier:1,effectMultiplier:1}};
 s.items[id]=item;p.inventory.push(id);return item;
}

test('E68 protects the exact existing Dread rot target without rerolling or consuming the mantle',()=>{
 const seed=seedForRot(1,2),old=game(seed,13),next=game(seed,14),oldPlayer=old.p,nextPlayer=next.p;
 hold(old.s,oldPlayer,'old-mantle','beast-amber-fur-mantle');const oldTarget=hold(old.s,oldPlayer,'old-target','orc-tusk-shield');
 hold(next.s,nextPlayer,'new-mantle','beast-amber-fur-mantle');const nextTarget=hold(next.s,nextPlayer,'new-target','orc-tusk-shield');
 const selected=Math.floor(randomAt(seed,`${encounter}:${playerId}:dread:item`)*nextPlayer.inventory.length);
 assert.equal(nextPlayer.inventory[selected],nextTarget.id);
 applyDread(old.s,oldPlayer);applyDread(next.s,nextPlayer);
 assert.equal(oldTarget.owner,'removed','the same run without revision14 loses the selected target');
 assert.equal(nextTarget.owner,nextPlayer.id,'revision14 protects that target');
 assert.equal(next.s.items['new-mantle']!.owner,nextPlayer.id,'the mantle remains held');
 assert.deepEqual(old.s.trace.find(e=>e.type==='dread-hit')!.details,next.s.trace.find(e=>e.type==='dread-hit')!.details,'chance and Dread result are unchanged');
});

test('E68 leaves protection to B07 first and does not protect a copy target',()=>{
 const seed=seedForRot(1,2),withPolicy=game(seed,14),p=withPolicy.p;
 hold(withPolicy.s,p,'mantle-policy','beast-amber-fur-mantle');const target=hold(withPolicy.s,p,'target-policy','orc-tusk-shield');
 p.statuses.push({id:'B07',starts:encounter,expires:encounter,charges:1});applyDread(withPolicy.s,p);
 assert.equal(target.owner,p.id);assert.equal(status(p,'B07'),undefined,'B07 is used before the mantle');assert.equal(withPolicy.s.items['mantle-policy']!.owner,p.id);

 const copyRun=game(seedForRot(1,2),14),copyPlayer=copyRun.p;
 hold(copyRun.s,copyPlayer,'mantle-copy-target','beast-amber-fur-mantle');const copy=hold(copyRun.s,copyPlayer,'rot-copy','orc-tusk-shield',true);
 applyDread(copyRun.s,copyPlayer);assert.equal(copy.owner,'removed','the mantle does not prevent copy retirement');
});

test('E68 requires an eligible original mantle, stays revision/catalog gated, and is inert without a living rot target',()=>{
 const seed=seedForRot(1,2);
 const early=game(seed,13),earlyMantle=hold(early.s,early.p,'early-mantle','beast-amber-fur-mantle');const earlyTarget=hold(early.s,early.p,'early-target','orc-tusk-shield');applyDread(early.s,early.p);assert.equal(earlyTarget.owner,'removed');assert.equal(earlyMantle.owner,early.p.id);

 const fractional=game(seedForRot(1,2),14),fractionalMantle=hold(fractional.s,fractional.p,'fractional-mantle','beast-amber-fur-mantle',true);const fractionalTarget=hold(fractional.s,fractional.p,'fractional-target','orc-tusk-shield');applyDread(fractional.s,fractional.p);assert.equal(fractionalTarget.owner,'removed');assert(fractionalMantle.copy);

 const legacy=game(seed,14);legacy.s.config.catalogVersion=4;hold(legacy.s,legacy.p,'legacy-mantle','beast-amber-fur-mantle');const legacyTarget=hold(legacy.s,legacy.p,'legacy-target','orc-tusk-shield');applyDread(legacy.s,legacy.p);assert.equal(legacyTarget.owner,'removed');

 const noTarget=game(seedForDreadHit(),14);hold(noTarget.s,noTarget.p,'not-carried','beast-amber-fur-mantle');noTarget.p.inventory=[];applyDread(noTarget.s,noTarget.p);assert.notEqual(noTarget.s.trace.find(e=>e.type==='dread-hit')!.details.kind,'rot');
 const dead=game(seed,14);hold(dead.s,dead.p,'dead-mantle','beast-amber-fur-mantle');const deadTarget=hold(dead.s,dead.p,'dead-target','orc-tusk-shield');dead.p.life=0;applyDread(dead.s,dead.p);assert.equal(deadTarget.owner,dead.p.id);assert.equal(dead.s.trace.some(e=>e.type==='dread-hit'),false);
});
