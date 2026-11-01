import test from 'node:test';import assert from 'node:assert/strict';
import {createAppraisalRun,appraisalViewFor,applyAppraisalAction} from '../src/game/appraisal/index.js';
import {startTheftDuel,chooseTheftHand,theftViewFor,clearCrime} from '../src/game/appraisal/theft.js';
import {pilotUses,reconcilePilotCustody} from '../src/game/appraisal/pilot-effects.js';
import {activate,inspect,appraise,damageLife} from '../src/game/appraisal/mechanics.js';
import {payVaultInterest} from '../src/game/appraisal/secure-storage.js';
import type {AppraisalItem,PilotItemKind} from '../src/game/appraisal/types.js';
function table(){const s=createAppraisalRun(['alice','bob'],'pilot-custody',{catalogVersion:4,marketProbability:0,secureEconomy:true,core2:true,survival:{maxLife:6,encounterLifeCost:1,entryEnergyCost:1}});s.phase='TRADE';for(const p of s.players){p.eventOffer=null;p.stock=[...p.portals[0]!.stock];p.energy=10;p.life=6;p.credits=1000;}return {s,a:s.players[0]!,b:s.players[1]!}}
function held(t:ReturnType<typeof table>,kind:PilotItemKind,who=t.a,power=1){const i:AppraisalItem={...t.s.items[t.a.stock[0]!]!,id:`${kind}-${who.id}-${who.inventory.length}`,kind,owner:who.id,genuine:true,cursed:false,rarityPower:{version:1,valueMultiplier:power,effectMultiplier:power}};t.s.items[i.id]=i;who.inventory.push(i.id);return i}
test('sword declares both edges without guard leak, cancels/spends both on a real tie, not on submission',()=>{
 const t=table(),a=held(t,'beast-riftfang-sword'),b=held(t,'beast-riftfang-sword',t.b);t.b.statuses.push({id:'B21',starts:1,expires:2,charges:1});startTheftDuel(t.s,t.a,{victimId:t.b.id});const d=t.s.theftDuels![0]!;assert.deepEqual(theftViewFor(t.s,t.a).duels[0]!.publicSwords,{you:true,opponent:true});assert.equal(theftViewFor(t.s,t.a).duels[0]!.tieGoesTo,undefined);t.b.statuses=[];chooseTheftHand(t.s,t.a,d.id,'rock');assert.equal(pilotUses(t.s,a),0);chooseTheftHand(t.s,t.b,d.id,'rock');assert.equal(d.status,'open');assert.equal(d.round,2);assert.equal(pilotUses(t.s,a),1);assert.equal(pilotUses(t.s,b),1);
});
test('one sword wins a real tie once; a low-strength copy has no binary edge',()=>{
 const t=table();held(t,'beast-riftfang-sword');const target=held(t,'orc-tusk-shield',t.b);startTheftDuel(t.s,t.a,{victimId:t.b.id});const d=t.s.theftDuels![0]!;chooseTheftHand(t.s,t.a,d.id,'paper');chooseTheftHand(t.s,t.b,d.id,'paper');assert.equal(d.status,'won');assert.equal(target.owner,t.a.id);
 const u=table(),copy=held(u,'beast-riftfang-sword');copy.copy={sourceId:u.a.stock[0]!,number:1,valuePercent:25};held(u,'orc-tusk-shield',u.b);startTheftDuel(u.s,u.a,{victimId:u.b.id});assert.deepEqual(theftViewFor(u.s,u.a).duels[0]!.publicSwords,{you:false,opponent:false});
});
test('crime discount uses the full current notice and clears once with no trust refund',()=>{
 const t=table();held(t,'darkone-crossing-token',t.a,8);t.a.crime={failures:2,banStartsEncounter:1,banUntilEncounter:5,cases:[{itemId:t.a.stock[0]!,ask:20,npc:'orc'},{itemId:t.a.stock[1]!,ask:40,npc:'vampire'}]};const trust=structuredClone(t.a.npcTrust);assert.equal(theftViewFor(t.s,t.a).crime!.noticePrice,60);clearCrime(t.s,t.a);assert.equal(t.a.credits,940);assert.deepEqual(t.a.npcTrust,trust);assert.throws(()=>clearCrime(t.s,t.a));assert.equal(t.a.credits,940);
});
test('shield and caliper used-instance state survives transfers and copied provenance',()=>{
 const t=table(),shield=held(t,'orc-tusk-shield');activate(t.s,t.a,shield.id);t.a.inventory=[];t.b.inventory=[shield.id];shield.owner=t.b.id;assert.throws(()=>activate(t.s,t.b,shield.id));const copy={...shield,id:'copied-shield',copy:{sourceId:shield.id,number:1,valuePercent:25}};t.s.items[copy.id]=copy;t.b.inventory.push(copy.id);assert.throws(()=>activate(t.s,t.b,copy.id));
 const c=held(t,'autometa-torque-caliper',t.b);t.s.phase='APPRAISAL';inspect(t.s,t.b,shield.id,'price');assert.equal(pilotUses(t.s,c),1);c.owner=t.a.id;t.a.inventory=[c.id];const other=held(t,'deepsea-tide-compass');const before=t.a.energy;inspect(t.s,t.a,other.id,'price');assert.equal(t.a.energy,before-1);
});
test('taking a ring out of custody invalidates its interval even if returned before settlement',()=>{
 const t=table(),ring=held(t,'vampire-nocturne-signet');t.a.personalVault={items:[],credits:100,slots:2};payVaultInterest(t.s);ring.owner='escrow:test';reconcilePilotCustody(t.s);ring.owner=t.a.id;t.s.encounter++;payVaultInterest(t.s);assert.equal(t.a.credits,1010);
});
test('reroll discount uses real advancing base cost and request retry is idempotent',()=>{
 const t=table();for(const p of t.s.players)p.credits=t.s.config.startingCredits;const compass=held(t,'deepsea-tide-compass',t.a,3);compass.appearance={version:1,rarity:'rare',theme:'lunar',visualSeed:1};t.s.phase='PORTALS';t.a.portalRerolls=2;const before=t.a.energy;const action={type:'reroll-portal' as const,playerId:t.a.id,requestId:'reroll-pilot',encounter:1,portalId:t.a.portals[0]!.id};const s=applyAppraisalAction(t.s,action);assert.equal(s.players[0]!.energy,before-2);assert.equal(s.players[0]!.portalRerolls,3);assert.equal(appraisalViewFor(s,t.a.id).self.portalRerollCost,3);assert.deepEqual(applyAppraisalAction(s,action),s);
});
test('translator gives measurable acceptance without changing the shared seeded roll or hidden truths',()=>{
 let changed=0;for(let seed=0;seed<30;seed++){const t=table();t.s.seed=`acceptance-${seed}`;t.s.phase='APPRAISAL';const item=t.s.items[t.a.stock[0]!]!;item.npc='vampire';item.reservation=1000;item.base=1000;const u=structuredClone(t.s);held(t,'alien-thought-translator',t.a,8);appraise(t.s,t.a,item.id,1,false,true);appraise(u,u.players[0]!,item.id,1,false,true);if(item.lastAccepted&&!u.items[item.id]!.lastAccepted)changed++;}assert(changed>0);
});

test('timeout fills only the missing hand and consumes the frozen sword only when it creates a real tie',async()=>{
 const {expireTheftDuel}=await import('../src/game/appraisal/theft.js');const {randomAt}=await import('../src/game/random.js');const t=table(),sword=held(t,'beast-riftfang-sword');held(t,'orc-tusk-shield',t.b);startTheftDuel(t.s,t.a,{victimId:t.b.id});const d=t.s.theftDuels![0]!,hands=['rock','paper','scissors'] as const,expected=hands[Math.floor(randomAt(t.s.seed,`${d.id}:round:1:timeout:${t.b.id}`)*3)]!;chooseTheftHand(t.s,t.a,d.id,expected);assert.equal(pilotUses(t.s,sword),0);expireTheftDuel(t.s,t.b,d.id);assert.equal(d.status,'won');assert.equal(d.revealed[0]!.thief,expected);assert.equal(d.revealed[0]!.opponent,expected);assert.equal(pilotUses(t.s,sword),1);
});
test('a fractional copied shield never rounds protection up, and old encounter guards expire',()=>{
 const t=table(),shield=held(t,'orc-tusk-shield');shield.copy={sourceId:t.a.stock[0]!,number:1,valuePercent:25};activate(t.s,t.a,shield.id);assert.equal(t.a.pilotGuard,undefined);const fresh=held(t,'orc-tusk-shield');activate(t.s,t.a,fresh.id);assert.equal(appraisalViewFor(t.s,t.a.id).self.pilotGuard?.amount,1);t.s.encounter++;damageLife(t.s,t.a,2,'bleeding');assert.equal(t.a.life,4);
});
