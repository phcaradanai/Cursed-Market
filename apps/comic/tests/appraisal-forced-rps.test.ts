import test from 'node:test';
import assert from 'node:assert/strict';
import {createAppraisalRun,defaultAppraisalAction,applyAppraisalAction} from '../src/game/appraisal/engine.js';
import {startTheftDuel,chooseTheftHand,expireTheftDuel,theftViewFor} from '../src/game/appraisal/theft.js';
import {randomAt} from '../src/game/random.js';
function fixture(seed='forced-rps'){
 const s=createAppraisalRun(['alice','bob'],seed,{secureEconomy:true,core2:true,marketProbability:0});s.config.theftTimeoutRules=1;s.phase='TRADE';
 for(const p of s.players){p.done=false;p.paused=null;p.eventOffer=null;p.energy=8;p.stock=[...p.portals[0]!.stock];p.selectedPortalId=p.portals[0]!.id;}
 const [thief,victim]=s.players,id=victim!.stock.shift()!;s.items[id]!.owner=victim!.id;victim!.inventory.push(id);startTheftDuel(s,thief!,{victimId:victim!.id});return {s,thief:thief!,victim:victim!,duel:s.theftDuels![0]!};
}
test('timeout fills both missing hands deterministically and resolves without a cancellation or extra cost',()=>{
 const a=fixture(),b=fixture(),energy=a.thief.energy;
 for(const t of [a,b])expireTheftDuel(t.s,t.thief,t.duel.id);
 assert.notEqual(a.duel.status,'cancelled');assert.equal(a.duel.revealed.length,1);assert.equal(a.thief.energy,energy);assert.equal(a.thief.stealTried!.length,1);assert.deepEqual(a.s,b.s);
 assert(!JSON.stringify(theftViewFor(a.s,a.thief)).includes('"hands"'));
});
test('timeout preserves a submitted hand and cannot fill a newly tied round',()=>{
 const t=fixture();const hands=['rock','paper','scissors'] as const;
 const auto=hands[Math.floor(randomAt(t.s.seed,`${t.duel.id}:round:${t.duel.round}:timeout:${t.victim.id}`)*3)]!;
 chooseTheftHand(t.s,t.thief,t.duel.id,auto);assert.equal(t.duel.hands[t.thief.id],auto);expireTheftDuel(t.s,t.thief,t.duel.id);
 assert.deepEqual(t.duel.revealed,[{thief:auto,opponent:auto}]);assert.equal(t.duel.round,2);assert.equal(t.duel.status,'open');assert.deepEqual(t.duel.hands,{});
});
test('the expired phase clock defers active forced duels to the independent round clock',()=>{
 const t=fixture();assert.equal(defaultAppraisalAction(t.s,t.thief.id,'phase-expired'),null);assert.equal(defaultAppraisalAction(t.s,t.victim.id,'phase-expired-victim'),null);
});
test('old audits retain cancelled timeout and genuinely moved targets still invalidate new duels',()=>{
 const old=fixture();delete old.s.config.theftTimeoutRules;expireTheftDuel(old.s,old.thief,old.duel.id);assert.equal(old.duel.status,'cancelled');
 const moved=fixture();moved.victim.inventory=[];expireTheftDuel(moved.s,moved.thief,moved.duel.id);assert.equal(moved.duel.status,'cancelled');assert.equal(moved.duel.revealed.length,0);
});

test('new-rule hand commands reject missing or stale round tokens while historical commands remain valid',()=>{
 const t=fixture();const body={type:'theft-hand' as const,playerId:t.thief.id,duelId:t.duel.id,hand:'rock' as const,requestId:'round-token',encounter:t.s.encounter};
 assert.throws(()=>applyAppraisalAction(t.s,body),/รอบเป่ายิ้งฉุบ/);assert.throws(()=>applyAppraisalAction(t.s,{...body,round:0}),/รอบเป่ายิ้งฉุบ/);
 const next=applyAppraisalAction(t.s,{...body,round:1});assert.equal(next.theftDuels![0]!.hands[t.thief.id],'rock');assert.equal(applyAppraisalAction(next,{...body,round:1}),next);
 const old=fixture();delete old.s.config.theftTimeoutRules;assert.doesNotThrow(()=>applyAppraisalAction(old.s,body));
});
test('NPC keeps its sealed hand and timeout uses normal defeat consequences',()=>{
 const t=fixture();t.s.theftDuels=[];delete t.thief.stealTried;startTheftDuel(t.s,t.thief,{itemId:t.thief.stock[0]!});const duel=t.s.theftDuels[0]!,sealed=duel.hands.npc,energy=t.thief.energy;
 expireTheftDuel(t.s,t.thief,duel.id);assert.equal(duel.revealed.length,1);assert.equal(duel.revealed[0]!.opponent,sealed);assert.notEqual(duel.status,'cancelled');assert.equal(t.thief.energy,energy);
});

test('autofilled outcomes use the same transfer, seal and compensation consequences exactly once',()=>{
 const hands=['rock','paper','scissors'] as const;
 for(const won of [false,true]){
  const t=fixture(`forced-result-${won}`),item=t.s.items[t.duel.itemId]!;item.lastTradePrice=40;
  const auto=hands[Math.floor(randomAt(t.s.seed,`${t.duel.id}:round:1:timeout:${t.thief.id}`)*3)]!,at=hands.indexOf(auto),victimHand=hands[(at+(won?2:1))%3]!;
  chooseTheftHand(t.s,t.victim,t.duel.id,victimHand);const energy=t.thief.energy;expireTheftDuel(t.s,t.thief,t.duel.id);
  assert.equal(t.duel.status,won?'won':'lost');assert.equal(item.owner,won?t.thief.id:t.victim.id);assert.equal(t.thief.energy,energy);
  assert.equal(theftViewFor(t.s,t.victim).seals.length,won?0:1);assert.equal(theftViewFor(t.s,t.thief).compensation.length,won?0:1);if(!won)assert.equal(theftViewFor(t.s,t.thief).compensation[0]!.amount,2);
  const before=structuredClone(t.s);assert.throws(()=>expireTheftDuel(t.s,t.thief,t.duel.id));assert.deepEqual(t.s,before);
 }
});

test('command-only acquisition, forced expiry and full run strictly replay with no injected stock',async()=>{
 const {advanceAppraisalEncounter}=await import('../src/game/appraisal/engine.js'),{appraisalViewFor}=await import('../src/game/appraisal/views.js'),{appraisalBotDecision}=await import('../src/simulation/appraisal.js'),{exportAppraisalAudit,replayAppraisalAudit}=await import('../src/game/appraisal/audit.js');
 let s=createAppraisalRun(['alice','bob'],'forced-audit-0',{secureEconomy:true,core2:true,startingCredits:200,encounters:3,marketProbability:0}),seq=0;
 const act=(id:string,body:Record<string,unknown>)=>{s=applyAppraisalAction(s,{...body,playerId:id,encounter:s.encounter,requestId:`forced-audit-${seq++}`} as Parameters<typeof applyAppraisalAction>[1]);};
 for(let i=0;s.phase==='PORTALS'&&i<25;i++){const p=s.players.find(p=>!p.done&&!p.paused)!;act(p.id,appraisalBotDecision(appraisalViewFor(s,p.id),'cautious'));}
 for(let i=0;s.phase==='APPRAISAL'&&!s.players[1]!.inventory.length&&i<35;i++){const p=s.players[1]!;assert(!p.done&&!p.paused);act(p.id,appraisalBotDecision(appraisalViewFor(s,p.id),'cautious'));}
 for(let i=0;s.players[0]!.eventOffer&&i<12;i++)act('alice',appraisalBotDecision(appraisalViewFor(s,'alice'),'cautious'));
 assert(s.players[1]!.inventory.length);act('alice',{type:'theft-start',victimId:'bob'});
 for(let i=0;s.theftDuels![0]!.status==='open'&&i<20;i++)act('alice',{type:'theft-expire',duelId:s.theftDuels![0]!.id});assert.notEqual(s.theftDuels![0]!.status,'open');assert.notEqual(s.theftDuels![0]!.status,'cancelled');
 for(let i=0;s.phase!=='RESULTS'&&i<100;i++){if(s.phase==='REVEAL')s=advanceAppraisalEncounter(s);else {const p=s.players.find(p=>!p.done&&!p.paused)!;act(p.id,{type:'done'});}}
 assert.equal(s.phase,'RESULTS');assert.deepEqual(replayAppraisalAudit(exportAppraisalAudit(s)),s);
});
