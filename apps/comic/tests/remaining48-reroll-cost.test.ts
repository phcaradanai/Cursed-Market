import test from 'node:test';
import assert from 'node:assert/strict';
import {createAppraisalRun,appraisalViewFor,applyAppraisalAction} from '../src/game/appraisal/index.js';
import {remainingPortalRerollTools,remainingEffectReady} from '../src/game/appraisal/remaining48-effects.js';
import {pilotRerollCost,pilotRerollStrength} from '../src/game/appraisal/pilot-effects.js';
import {rerollCost} from '../src/game/appraisal/core2.js';
import {passiveText} from '../src/appraisal-client/catalog-text.js';
import {defaultRarityConfig} from '../src/shared/item-rarity.js';
import {defaultRarityEconomy} from '../src/shared/rarity-power.js';
import type {AppraisalItem,ItemKind} from '../src/game/appraisal/types.js';

const game=(revision:2|3|4|5|6|7|8|9|10|11|12=12)=>createAppraisalRun(['alice','bob'],'e34-reroll',{catalogVersion:5,native56Effects:revision,core2:true,startingCredits:50,maxEnergy:10,marketProbability:0,npcEvents:false,secureEconomy:false,commerce:false,roundRewards:false,trustAbilities:false});
function hold(s:ReturnType<typeof game>,kind:ItemKind,power=1){
 const p=s.players[0]!,source=Object.values(s.items)[0]!;s.config.rarity??=defaultRarityConfig();s.config.rarityEconomy??=defaultRarityEconomy();
 const rarity=power===8?'mythic':power===6?'legendary':power===4?'epic':power===3?'rare':power===2?'uncommon':'common';
 const item:AppraisalItem={...source,id:`held-${p.inventory.length}`,kind,owner:p.id,genuine:true,cursed:false,appearance:{version:1,rarity,theme:'plain',visualSeed:1},rarityPower:{version:1,valueMultiplier:power,effectMultiplier:power}};
 s.items[item.id]=item;p.inventory.push(item.id);return item;
}

test('E34 glider and compass share a two-energy discount, quote matches settlement, and cost never drops below one',()=>{
 const s=game(),p=s.players[0]!;p.eventOffer=null;hold(s,'deepsea-tide-compass');const glider=hold(s,'swarm-wing-membrane-glider',4);p.portalRerolls=3;
 const base=rerollCost(p.portalRerolls);
 const gliderTools=remainingPortalRerollTools(s,p);
 assert.equal(gliderTools.length,1);
 assert.equal(pilotRerollStrength(s,p,gliderTools),5);
 assert.equal(pilotRerollCost(s,p,base,gliderTools),base-2);
 assert.equal(appraisalViewFor(s,p.id).self.portalRerollCost,base-2);
 assert.equal(appraisalViewFor(s,p.id).self.inventory.find(i=>i.id===glider.id)?.nativeEffectReady,true);
 assert.match(passiveText(glider.kind,true,{nativeEffectReady:true}),/เข็มทิศ/);

 const before=p.energy,portalId=p.portals[0]!.id;
 const next=applyAppraisalAction(s,{type:'reroll-portal',playerId:p.id,requestId:'e34-paid-reroll',encounter:s.encounter,portalId});
 assert.equal(before-next.players[0]!.energy,base-2);
 assert.equal(next.players[0]!.portalRerolls,4);

 p.portalRerolls=0;
 assert.equal(appraisalViewFor(s,p.id).self.portalRerollCost,1);
});

test('E34 stays locked before revision12 and does not affect the existing compass-only quote',()=>{
 const s=game(11),p=s.players[0]!;hold(s,'deepsea-tide-compass');const glider=hold(s,'swarm-wing-membrane-glider',4);p.portalRerolls=3;
 assert.equal(remainingEffectReady('swarm-wing-membrane-glider',11),false);
 assert.equal(remainingEffectReady('swarm-wing-membrane-glider',12),true);
 assert.deepEqual(remainingPortalRerollTools(s,p),[]);
 assert.equal(appraisalViewFor(s,p.id).self.portalRerollCost,rerollCost(3)-1);
 assert.equal(appraisalViewFor(s,p.id).self.inventory.find(i=>i.id===glider.id)?.nativeEffectReady,false);
});

test('E34 selects the five strongest compass and glider instances together before capping',()=>{
 const s=game(),p=s.players[0]!;
 const mythicCopy=hold(s,'deepsea-tide-compass',8);mythicCopy.copy={sourceId:'compass-origin',number:1,valuePercent:40};
 for(let n=0;n<5;n++){const weak=hold(s,'swarm-wing-membrane-glider');weak.copy={sourceId:`glider-origin-${n}`,number:1,valuePercent:40};}
 const tools=remainingPortalRerollTools(s,p);
 assert.ok(Math.abs(pilotRerollStrength(s,p,tools)-4.8)<1e-9);
});
