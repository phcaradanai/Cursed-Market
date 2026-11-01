import test from 'node:test';
import assert from 'node:assert/strict';
import {createAppraisalRun,appraisalViewFor} from '../src/game/appraisal/index.js';
import {activate,damageLife,inspect,appraise} from '../src/game/appraisal/mechanics.js';
import {handleStorageAction,payVaultInterest} from '../src/game/appraisal/secure-storage.js';
import type {AppraisalItem,PilotItemKind} from '../src/game/appraisal/types.js';
function table(){const s=createAppraisalRun(['alice','bob'],'pilot-effects',{catalogVersion:4,marketProbability:0,secureEconomy:true,core2:true,survival:{maxLife:6,encounterLifeCost:1,entryEnergyCost:1}});s.phase='APPRAISAL';const p=s.players[0]!;p.eventOffer=null;p.stock=[...p.portals[0]!.stock];p.energy=10;p.life=6;p.credits=1000;return {s,p}}
function held(t:ReturnType<typeof table>,kind:PilotItemKind,power=1){const template=t.s.items[t.p.stock[0]!]!;const item:AppraisalItem={...template,id:`test-${kind}-${t.p.inventory.length}`,kind,owner:t.p.id,genuine:true,cursed:false,rarityPower:{version:1,valueMultiplier:power,effectMultiplier:power}};t.s.items[item.id]=item;t.p.inventory.push(item.id);return item}
test('shield guards the next damage, never its activation curse or mandatory life payments',()=>{
 const t=table(),i=held(t,'orc-tusk-shield',3);i.cursed=true;activate(t.s,t.p,i.id);assert.equal(t.p.life,5);assert.equal(t.p.energy,9);damageLife(t.s,t.p,1,'blood-pact');assert.equal(t.p.life,4);damageLife(t.s,t.p,3,'dimensional-decay');assert.equal(t.p.life,3);damageLife(t.s,t.p,1,'bleeding');assert.equal(t.p.life,2);
});
test('non-activatable pilot items reject before spending or recording activation',()=>{
 const t=table();for(const kind of ['vampire-nocturne-signet','autometa-torque-caliper','alien-thought-translator','darkone-crossing-token','deepsea-tide-compass','swarm-brood-hammer','beast-riftfang-sword'] as const){const i=held(t,kind);assert.throws(()=>activate(t.s,t.p,i.id));assert.equal(t.p.energy,10);assert(!t.p.activated.includes(i.id));}
});
test('caliper pays one price check, respects merchant-free rights and inspection quota',()=>{
 const t=table();held(t,'autometa-torque-caliper');const stock=t.s.items[t.p.stock[0]!]!;inspect(t.s,t.p,stock.id,'price');assert.equal(t.p.energy,10);assert.equal(t.p.inspections,0);
 const first=held(t,'orc-tusk-shield'),second=held(t,'deepsea-tide-compass');inspect(t.s,t.p,first.id,'price');assert.equal(t.p.energy,10);assert.equal(t.p.inspections,1);inspect(t.s,t.p,second.id,'price');assert.equal(t.p.energy,9);assert.equal(t.p.inspections,2);assert.throws(()=>inspect(t.s,t.p,second.id,'authenticity'));
});
test('ring interest intersects aged principal with the same held instance, caps aggregate and floors once',()=>{
 const t=table();t.p.personalVault={items:[],credits:199,slots:2};held(t,'vampire-nocturne-signet',3);payVaultInterest(t.s);t.s.encounter++;payVaultInterest(t.s);assert.equal(t.p.credits,1027);assert.equal(t.p.personalVault.credits,199);payVaultInterest(t.s);assert.equal(t.p.credits,1027);
});
test('late ring grants no interest retrospectively and vault-held rings do not count',()=>{
 const t=table();t.p.personalVault={items:[],credits:100,slots:2};payVaultInterest(t.s);const ring=held(t,'vampire-nocturne-signet');t.s.encounter++;payVaultInterest(t.s);assert.equal(t.p.credits,1010);ring.owner=`personal-vault:${t.p.id}`;t.s.encounter++;payVaultInterest(t.s);assert.equal(t.p.credits,1020);
});
test('hammer discount is quoted and charged identically, bounded by half of base',()=>{
 const t=table();held(t,'swarm-brood-hammer',8);t.s.phase='REVEAL';t.p.roundReward={encounter:1,base:10,amount:10,flips:0,settled:true};t.p.personalVault={items:[],credits:0,slots:2};assert.equal(appraisalViewFor(t.s,t.p.id).self.personalVault!.nextSlotPrice,5);handleStorageAction(t.s,t.p,{type:'vault-expand'});assert.equal(t.p.credits,995);assert.equal(t.p.personalVault.slots,3);
});
test('translator raises merchant acceptance only, and does not bypass overvalue backlash',()=>{
 const t=table();held(t,'alien-thought-translator',8);const item=t.s.items[t.p.stock[0]!]!;item.npc='vampire';item.reservation=1000;t.s.config.commerce=true;t.s.config.freeMerchantAction=true;t.s.config.eventChoiceRules=1;appraise(t.s,t.p,item.id,item.ask*4,false,true);assert.equal(item.lastAccepted,false);
});

test('caliper and portal quotations match the server effect without leaking truth',()=>{
 const t=table();held(t,'autometa-torque-caliper');held(t,'deepsea-tide-compass',8);t.p.portalRerolls=3;const v=appraisalViewFor(t.s,t.p.id);assert.equal(v.self.pilotPriceChecks,1);assert.equal(v.self.portalRerollCost,3);assert.equal(v.self.inventory[0]!.knowledge.genuine,undefined);
});
