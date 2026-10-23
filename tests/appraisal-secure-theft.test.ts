import test from 'node:test';
import assert from 'node:assert/strict';
import { applyAppraisalAction, createAppraisalRun } from '../src/game/appraisal/engine.js';
import { cancelTheftDuels, chooseTheftHand, clearCrime, merchantTradeBanned, npcTheftTell, startTheftDuel, theftViewFor } from '../src/game/appraisal/theft.js';
import type { CrimeRecord, RpsHand, TheftDuel } from '../src/game/appraisal/theft.js';
import type { AppraisalState, Appraiser } from '../src/game/appraisal/types.js';

type State = AppraisalState & {theftDuels?:TheftDuel[]};
type Player = Appraiser & {crime?:CrimeRecord};
const beats: Record<RpsHand,RpsHand> = {rock:'paper',paper:'scissors',scissors:'rock'};
const loses: Record<RpsHand,RpsHand> = {rock:'scissors',paper:'rock',scissors:'paper'};
function fixture(): State {
  const state: State = createAppraisalRun(['alice','bob'],'secure-theft',{core2:true,marketProbability:0});
  state.phase = 'APPRAISAL';
  for(const p of state.players) {
    p.stock = [...p.portals[0]!.stock];
    p.selectedPortalId = p.portals[0]!.id;
    p.done = false; p.eventOffer = null; p.energy = 8;
  }
  return state;
}
const latest = (state:State) => state.theftDuels!.at(-1)!;
function owned(state:State, p:Appraiser):string {
  const id = p.stock.shift()!;
  state.items[id]!.owner = p.id; p.inventory.push(id);
  return id;
}

test('NPC hand is sealed before choice; draws replay without spending another attempt or energy',()=>{
  const state = fixture(); const p = state.players[0]!;
  startTheftDuel(state,p,{itemId:p.stock[0]!});
  const duel = latest(state); const sealed = duel.hands.npc!;
  const before = JSON.stringify(theftViewFor(state,p));
  assert.equal(before.includes('"hands"'),false);
  assert.equal(before.includes('"itemId"'),false);
  assert.deepEqual(theftViewFor(state,p).duels[0]!.revealed,[]);
  chooseTheftHand(state,p,duel.id,sealed);
  assert.equal(duel.status,'open'); assert.equal(duel.round,2);
  assert.deepEqual(duel.revealed,[{thief:sealed,opponent:sealed}]);
  assert.equal(p.energy,7); assert.equal(p.stealTried!.length,1);
  chooseTheftHand(state,p,duel.id,beats[duel.hands.npc!]);
  assert.equal(duel.status,'won'); assert.equal(p.energy,7);
  assert.equal(state.items[duel.itemId]!.owner,p.id);
  assert.equal(p.inventory.filter(id=>id===duel.itemId).length,1);
  assert.equal(p.theft,undefined);
  assert.throws(()=>startTheftDuel(state,p,{itemId:p.stock[0]!}));
});

test('same seed and choices replay identical NPC hands and results',()=>{
  const first = fixture(); const second = fixture();
  for(const state of [first,second]) {
    const p = state.players[0]!;
    startTheftDuel(state,p,{itemId:p.stock[0]!});
    const d = latest(state);
    chooseTheftHand(state,p,d.id,d.hands.npc!);
    chooseTheftHand(state,p,d.id,'paper');
  }
  assert.deepEqual(first,second);
});

test('merchant habits are readable without revealing the current hand or percentage',()=>{
  const state = fixture(); const p = state.players[0]!;
  const item = state.items[p.stock[0]!]!;
  item.npc = 'orc';
  const counts = {rock:0,paper:0,scissors:0};
  for(let i=0;i<120;i++) {
    const run = structuredClone(state); run.seed = `tell-${i}`;
    startTheftDuel(run,run.players[0]!,{itemId:item.id});
    counts[latest(run).hands.npc!]++;
  }
  assert.ok(counts.rock > counts.paper && counts.rock > counts.scissors);
  assert.ok(counts.paper > 0 && counts.scissors > 0);
  startTheftDuel(state,p,{itemId:item.id});
  const view = theftViewFor(state,p).duels[0]!;
  assert.deepEqual(view.npcTell,npcTheftTell('orc'));
  assert.equal(JSON.stringify(view).includes('"hands"'),false);
  assert.equal(JSON.stringify(view).includes('%'),false);
});

test('request ID and later player choice do not affect the sealed NPC hand',()=>{
  const initial = fixture(); initial.config.secureEconomy = true;
  for(const p of initial.players)p.energy = initial.config.maxEnergy;
  const [player] = initial.players;
  const start = {type:'theft-start' as const,playerId:player!.id,encounter:initial.encounter,itemId:player!.stock[0]!};
  const a = applyAppraisalAction(initial,{...start,requestId:'first-request'}) as State;
  const b = applyAppraisalAction(initial,{...start,requestId:'different-request'}) as State;
  assert.equal(latest(a).hands.npc,latest(b).hands.npc);
  const sealed = latest(a).hands.npc!;
  chooseTheftHand(a,a.players[0]!,latest(a).id,beats[sealed]);
  chooseTheftHand(b,b.players[0]!,latest(b).id,loses[sealed]);
  assert.equal(latest(a).revealed[0]!.opponent,sealed);
  assert.equal(latest(b).revealed[0]!.opponent,sealed);
});

test('merchant defeat loses targeted trust 2, bans next encounter, and notice clears immediately at captured ask',()=>{
  const state = fixture(); const p = state.players[0]! as Player;
  const item = state.items[p.stock[0]!]!;
  item.ask = 7; p.npcTrust = {[item.npc]:4};
  startTheftDuel(state,p,{itemId:item.id});
  const duel = latest(state);
  item.ask = 999;
  chooseTheftHand(state,p,duel.id,loses[duel.hands.npc!]);
  assert.equal(p.npcTrust[item.npc],2);
  assert.equal(p.theft,undefined);
  assert.equal(merchantTradeBanned(state,p),false);
  assert.equal(p.crime!.banUntilEncounter,state.encounter+1);
  state.encounter++;
  assert.equal(merchantTradeBanned(state,p),true);
  const credits = p.credits = 20; const bank = state.bank;
  assert.equal(theftViewFor(state,p).crime!.noticePrice,14);
  clearCrime(state,p);
  assert.equal(p.credits,credits-14); assert.equal(state.bank,bank+14);
  assert.equal(p.npcTrust[item.npc],2);
  assert.equal(merchantTradeBanned(state,p),false); assert.equal(p.crime,undefined);
});

test('each repeat defeat adds exactly one future banned encounter; multiple-case notice charges twice the summed captured asks',()=>{
  const state = fixture(); const p = state.players[0]! as Player;
  const asks = [20,30,50];
  for(const [attempt,ask] of asks.entries()) {
    delete p.stealTried;
    const id = p.stock[attempt % p.stock.length]!; state.items[id]!.ask = ask;
    startTheftDuel(state,p,{itemId:id});
    const duel = latest(state);
    state.items[id]!.ask = 999;
    chooseTheftHand(state,p,duel.id,loses[duel.hands.npc!]);
  }
  assert.equal(p.crime!.failures,3);
  assert.equal(p.crime!.banUntilEncounter,state.encounter+3);
  assert.equal(theftViewFor(state,p).crime!.noticePrice,200);
  p.credits = 199; assert.throws(()=>clearCrime(state,p)); assert.equal(p.credits,199); assert.equal(p.crime!.cases.length,3);
  p.credits = 250; const bank = state.bank; const trust = {...p.npcTrust};
  clearCrime(state,p);
  assert.equal(p.credits,50); assert.equal(state.bank,bank+200);
  assert.equal(p.crime,undefined); assert.deepEqual(p.npcTrust,trust);
  state.encounter += 3; assert.equal(merchantTradeBanned(state,p),false);
});

test('merchant theft remains available during trading ban, and failure extends the ban exactly one encounter',()=>{
  const state = fixture(); const p = state.players[0]! as Player;
  p.crime = {failures:1,banStartsEncounter:state.encounter,banUntilEncounter:state.encounter,cases:[{itemId:'old-case',ask:5,npc:'orc'}]};
  assert.equal(merchantTradeBanned(state,p),true);
  startTheftDuel(state,p,{itemId:p.stock[0]!}); const duel = latest(state);
  chooseTheftHand(state,p,duel.id,loses[duel.hands.npc!]);
  assert.equal(p.crime.banUntilEncounter,state.encounter+1);
  assert.equal(p.crime.banStartsEncounter,state.encounter);
  assert.equal(p.crime.failures,2);
});

test('PvP choices are sealed, immutable and transfer one eligible item only after both choices',()=>{
  const state = fixture(); const [thief,victim] = state.players as [Appraiser,Appraiser];
  const id = owned(state,victim);
  startTheftDuel(state,thief,{victimId:victim.id}); const duel = latest(state);
  chooseTheftHand(state,thief,duel.id,'rock');
  assert.equal(state.items[id]!.owner,victim.id);
  const victimView = theftViewFor(state,victim);
  assert.deepEqual(victimView.duels[0]!.revealed,[]);
  assert.equal(JSON.stringify(victimView).includes('rock'),false);
  assert.equal(JSON.stringify(victimView).includes(id),false);
  assert.throws(()=>chooseTheftHand(state,thief,duel.id,'paper'));
  chooseTheftHand(state,victim,duel.id,'scissors');
  assert.equal(duel.status,'won'); assert.equal(state.items[id]!.owner,thief.id);
  assert.equal(victim.inventory.includes(id),false); assert.equal(thief.inventory.filter(v=>v===id).length,1);
  assert.throws(()=>chooseTheftHand(state,victim,duel.id,'rock'));
});

test('PvP defeat does not invent a credit, life or consequence-event penalty',()=>{
  const state = fixture(); const [thief,victim] = state.players as [Appraiser,Appraiser];
  const id = owned(state,victim); const money = [thief.credits,victim.credits]; const life = thief.life;
  startTheftDuel(state,thief,{victimId:victim.id}); const duel = latest(state);
  chooseTheftHand(state,victim,duel.id,'paper'); chooseTheftHand(state,thief,duel.id,'rock');
  assert.equal(duel.status,'lost'); assert.equal(state.items[id]!.owner,victim.id);
  assert.deepEqual([thief.credits,victim.credits],money); assert.equal(thief.life,life);
  assert.equal(thief.theft,undefined);
});

test('vault, collateral and locked goods cannot be stolen; target views do not reveal eligibility',()=>{
  const state = fixture(); const [thief,victim] = state.players as [Appraiser,Appraiser];
  const id = owned(state,victim);
  const before = theftViewFor(state,thief).targets;
  state.items[id]!.owner = `personal-vault:${victim.id}`;
  assert.throws(()=>startTheftDuel(state,thief,{victimId:victim.id}));
  state.items[id]!.owner = 'collateral:loan-1';
  assert.throws(()=>startTheftDuel(state,thief,{victimId:victim.id}));
  state.items[id]!.owner = victim.id;
  victim.statuses.push({id:'D09',targetItemId:id,charges:1,starts:state.encounter,expires:99});
  assert.throws(()=>startTheftDuel(state,thief,{victimId:victim.id}));
  assert.deepEqual(theftViewFor(state,thief).targets,before);
  assert.equal(thief.energy,8); assert.equal(thief.stealTried,undefined);
});

test('moving target before resolution cancels safely without duplicate ownership or revealed hands',()=>{
  const state = fixture(); const [thief,victim] = state.players as [Appraiser,Appraiser];
  const id = owned(state,victim);
  startTheftDuel(state,thief,{victimId:victim.id}); const duel = latest(state);
  chooseTheftHand(state,thief,duel.id,'rock');
  victim.inventory = []; state.items[id]!.owner = `personal-vault:${victim.id}`;
  chooseTheftHand(state,victim,duel.id,'scissors');
  assert.equal(duel.status,'cancelled'); assert.deepEqual(duel.revealed,[]); assert.deepEqual(duel.hands,{});
  assert.equal(thief.inventory.includes(id),false); assert.equal(state.items[id]!.owner,`personal-vault:${victim.id}`);
  assert.equal(thief.energy,7);
});

test('encounter transition cancels unresolved duels without leaking submitted hands',()=>{
  const state = fixture(); const p = state.players[0]!;
  startTheftDuel(state,p,{itemId:p.stock[0]!}); const duel = latest(state);
  state.encounter++; cancelTheftDuels(state);
  assert.equal(duel.status,'cancelled'); assert.deepEqual(duel.hands,{});
});
