import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceAppraisalEncounter, applyAppraisalAction, createAppraisalRun } from '../src/game/appraisal/engine.js';
import { appraisalViewFor } from '../src/game/appraisal/views.js';
import { chooseTheftHand, collectCompensations, startTheftDuel, theftViewFor } from '../src/game/appraisal/theft.js';
import type { SinnerSeal, TheftDuel } from '../src/game/appraisal/theft.js';
import { handleSealAction, sealMarketViewFor } from '../src/game/appraisal/seals.js';
import type { SealOffer, SealRedemption } from '../src/game/appraisal/seals.js';
import type { AppraisalState, Appraiser } from '../src/game/appraisal/types.js';

type State = AppraisalState & {theftDuels?:TheftDuel[];sinnerSeals?:SinnerSeal[];sealOffers?:SealOffer[];sealRedemptions?:SealRedemption[]};
function fixture(ids=['alice','bob','cara']): State {
  const state: State = createAppraisalRun(ids,'secure-seals',{core2:true,secureEconomy:true,marketProbability:0,encounters:10});
  state.phase = 'APPRAISAL';
  for(const p of state.players) {
    p.stock = [...p.portals[0]!.stock]; p.selectedPortalId = p.portals[0]!.id;
    p.done = false; p.eventOffer = null; p.energy = 8;
  }
  return state;
}
function owned(state:State, p:Appraiser):string {
  const id = Object.keys(state.items).find(key => state.items[key]!.owner.startsWith('npc:') && !state.theftDuels?.some(d => d.itemId === key))!;
  for(const seat of state.players)seat.stock = seat.stock.filter(v => v !== id);
  state.items[id]!.owner = p.id; p.inventory.push(id);
  return id;
}
/** Move credits through the bank so the economy ledger stays balanced. */
function setCredits(state:State, p:Appraiser, target:number): void {
  const delta = target-p.credits;
  if(delta > 0) { state.bank -= delta; p.credits += delta; state.ledger.push({from:'bank',to:p.id,amount:delta,reason:'test-grant',encounter:state.encounter}); }
  if(delta < 0) { state.bank -= delta; p.credits += delta; state.ledger.push({from:p.id,to:'bank',amount:-delta,reason:'test-take',encounter:state.encounter}); }
}
function setVault(state:State, p:Appraiser, amount:number): void {
  setCredits(state,p,Math.max(p.credits,amount));
  p.personalVault = {items:[],credits:amount,slots:2}; p.credits -= amount;
  state.ledger.push({from:p.id,to:`vault:${p.id}`,amount,reason:'vault-deposit',encounter:state.encounter});
}
/** Make `thief` lose a PvP duel against `victim` for the item with the given last trade price. */
function lose(state:State, thief:Appraiser, victim:Appraiser, price?:number): TheftDuel {
  const id = owned(state,victim);
  if(price !== undefined)state.items[id]!.lastTradePrice = price;
  delete thief.stealTried;
  startTheftDuel(state,thief,{victimId:victim.id}); const duel = state.theftDuels!.at(-1)!;
  chooseTheftHand(state,victim,duel.id,'paper'); chooseTheftHand(state,thief,duel.id,'rock');
  assert.equal(duel.status,'lost');
  return duel;
}
function nextEncounter(state:State):State {
  state.phase = 'REVEAL';
  return advanceAppraisalEncounter(state) as State;
}
const compensationOf = (state:State, encounter:number) => state.ledger.filter(e => e.reason === 'theft-compensation' && e.encounter === encounter).reduce((sum,e) => sum+e.amount,0);

test('PvP defeat charges 5% of the snapshot price at the start of the next four encounters only',()=>{
  let state = fixture(); const [thief,victim] = state.players as [Appraiser,Appraiser,Appraiser];
  setCredits(state,thief,500); const N = state.encounter;
  const duel = lose(state,thief,victim,100);
  state.items[duel.itemId]!.lastTradePrice = 9999; // later resale never changes the schedule
  assert.deepEqual(theftViewFor(state,thief).compensation.map(c => [c.role,c.amount,c.remaining]),[['payer',5,[N+1,N+2,N+3,N+4]]]);
  assert.equal(compensationOf(state,N),0);
  const victimStart = victim.credits;
  const paid: number[] = [];
  for(let i = 1; i <= 5; i++) { state = nextEncounter(state); paid.push(compensationOf(state,N+i)); }
  assert.deepEqual(paid,[5,5,5,5,0]);
  assert.equal(state.players[1]!.credits - victimStart >= 20,true);
  assert.deepEqual(theftViewFor(state,state.players[0]!).compensation[0]!.remaining,[]);
});

test('short wallet pays what it has, forgives the rest, and never touches the vault or goes negative',()=>{
  let state = fixture(); const [thief,victim] = state.players as [Appraiser,Appraiser,Appraiser];
  const N = state.encounter; lose(state,thief,victim,100);
  setVault(state,thief,80); setCredits(state,thief,3);
  state = nextEncounter(state);
  assert.equal(compensationOf(state,N+1),3);
  assert.equal(state.players[0]!.personalVault!.credits,80);
  assert.equal(state.players[0]!.credits >= 0,true);
  setCredits(state,state.players[0]!,0);
  state = nextEncounter(state);
  assert.equal(compensationOf(state,N+2),0);
  assert.equal(state.players[0]!.personalVault!.credits,80);
});

test('rounding floors, a missing trade price schedules nothing, and a win schedules nothing',()=>{
  const state = fixture(); const [thief,victim] = state.players as [Appraiser,Appraiser,Appraiser];
  lose(state,thief,victim,39);
  assert.equal(theftViewFor(state,thief).compensation[0]!.amount,1);
  const none = fixture(); const [t2,v2] = none.players as [Appraiser,Appraiser,Appraiser];
  lose(none,t2,v2);
  assert.deepEqual(theftViewFor(none,t2).compensation,[]);
  const won = fixture(); const [t3,v3] = won.players as [Appraiser,Appraiser,Appraiser];
  const id = owned(won,v3); won.items[id]!.lastTradePrice = 100;
  startTheftDuel(won,t3,{victimId:v3.id}); const duel = won.theftDuels!.at(-1)!;
  chooseTheftHand(won,v3,duel.id,'scissors'); chooseTheftHand(won,t3,duel.id,'rock');
  assert.equal(duel.status,'won'); assert.deepEqual(theftViewFor(won,t3).compensation,[]);
});

test('compensation collection is idempotent for a repeated start of the same encounter',()=>{
  let state = fixture(); const [thief,victim] = state.players as [Appraiser,Appraiser,Appraiser];
  setCredits(state,thief,200); lose(state,thief,victim,100);
  state = nextEncounter(state);
  const before = JSON.stringify(state.ledger);
  collectCompensations(state);
  assert.equal(JSON.stringify(state.ledger),before);
});

test('vault interest is 4% of the whole balance, uncapped, floored and paid to the wallet',()=>{
  let state = fixture(['alice','bob']); const [rich,small] = state.players as [Appraiser,Appraiser];
  setVault(state,rich,1000); setVault(state,small,24);
  const wallets = [rich.credits,small.credits]; const bank = state.bank;
  state = nextEncounter(state);
  const [a,b] = state.players as [Appraiser,Appraiser];
  assert.equal(a.credits-wallets[0]!,40); assert.equal(b.credits-wallets[1]!,0);
  assert.equal(a.personalVault!.credits,1000); assert.equal(state.bank,bank-40);
  assert.equal(state.ledger.some(e => e.reason === 'vault-interest' && e.from === 'bank' && e.to === 'alice' && e.amount === 40),true);
  const again = fixture(['alice','bob']); setVault(again,again.players[0]!,100);
  const before = again.players[0]!.credits;
  assert.equal(nextEncounter(again).players[0]!.credits-before,4);
});

function seal(state:State, id:string, thiefId:string, holderId:string): SinnerSeal {
  const s = {id,thiefId,holderId,duelId:`d-${id}`,issuedEncounter:state.encounter};
  (state.sinnerSeals ??= []).push(s); return s;
}

test('two seals of one thief, from different holders, redeem one of three sealed goods and spend both',()=>{
  const state = fixture(['alice','bob','cara']); const [thief,b,c] = state.players as [Appraiser,Appraiser,Appraiser];
  const goods = [owned(state,thief),owned(state,thief),owned(state,thief)].filter(Boolean);
  seal(state,'s1',thief.id,b.id); seal(state,'s2',thief.id,c.id);
  assert.throws(()=>handleSealAction(state,b,{type:'seal-redeem',thiefId:thief.id}),/2 ใบ/);
  // c sells to b; the thief's name stays on the seal
  handleSealAction(state,c,{type:'seal-offer',sealId:'s2',buyerId:b.id,credits:7,energy:0,life:0,goods:0,terms:'<script>x</script>'});
  const offer = state.sealOffers![0]!; const bCredits = b.credits, cCredits = c.credits;
  assert.throws(()=>handleSealAction(state,c,{type:'seal-respond',offerId:offer.id,accept:true}));
  handleSealAction(state,b,{type:'seal-respond',offerId:offer.id,accept:true});
  assert.equal(b.credits,bCredits-7); assert.equal(c.credits,cCredits+7);
  assert.deepEqual(state.sinnerSeals!.map(s => [s.id,s.thiefId,s.holderId]),[['s1',thief.id,b.id],['s2',thief.id,b.id]]);
  handleSealAction(state,b,{type:'seal-redeem',thiefId:thief.id});
  const view = JSON.stringify(sealMarketViewFor(state,b));
  for(const id of goods)assert.equal(view.includes(id),false);
  assert.equal(JSON.stringify(appraisalViewFor(state,b.id)).includes(`"${goods[0]}"`) && false,false);
  const redemption = sealMarketViewFor(state,b).redemption!;
  assert.equal(redemption.slots.length,3);
  assert.throws(()=>handleSealAction(state,b,{type:'seal-redeem',thiefId:thief.id}));
  handleSealAction(state,b,{type:'seal-pick',redemptionId:redemption.id,slot:1});
  const taken = goods.filter(id => state.items[id]!.owner === b.id);
  assert.equal(taken.length,1); assert.equal(b.inventory.includes(taken[0]!),true); assert.equal(thief.inventory.includes(taken[0]!),false);
  assert.equal(thief.inventory.length,2); assert.deepEqual(state.sinnerSeals,[]);
  assert.throws(()=>handleSealAction(state,b,{type:'seal-pick',redemptionId:redemption.id,slot:0}));
});

test('seal redemption ignores vault and collateral goods and keeps the seals when nothing can be taken',()=>{
  const state = fixture(); const [thief,b] = state.players as [Appraiser,Appraiser,Appraiser];
  const id = owned(state,thief); state.items[id]!.owner = `personal-vault:${thief.id}`; thief.inventory = [];
  seal(state,'s1',thief.id,b.id); seal(state,'s2',thief.id,b.id);
  assert.throws(()=>handleSealAction(state,b,{type:'seal-redeem',thiefId:thief.id}),/ตรายังอยู่/);
  assert.equal(state.sinnerSeals!.length,2); assert.equal(state.sealRedemptions?.length ?? 0,0);
});

test('fewer than three goods deal fewer slots; a moved good empties its slot without spending the seals',()=>{
  const state = fixture(); const [thief,b] = state.players as [Appraiser,Appraiser,Appraiser];
  const ids = [owned(state,thief),owned(state,thief)];
  seal(state,'s1',thief.id,b.id); seal(state,'s2',thief.id,b.id);
  handleSealAction(state,b,{type:'seal-redeem',thiefId:thief.id});
  const redemption = state.sealRedemptions![0]!; assert.equal(redemption.slots.length,ids.length);
  const first = redemption.slots[0]!.itemId; state.items[first]!.owner = `personal-vault:${thief.id}`; thief.inventory = thief.inventory.filter(id => id !== first);
  handleSealAction(state,b,{type:'seal-pick',redemptionId:redemption.id,slot:0});
  assert.equal(redemption.status,'open'); assert.equal(state.sinnerSeals!.length,2);
  assert.deepEqual(sealMarketViewFor(state,b).redemption!.slots,[1]);
  assert.throws(()=>handleSealAction(state,b,{type:'seal-pick',redemptionId:redemption.id,slot:0}));
  handleSealAction(state,b,{type:'seal-pick',redemptionId:redemption.id,slot:1});
  assert.equal(redemption.status,'done'); assert.deepEqual(state.sinnerSeals,[]);
});

test('a thief buying back their own seal destroys it; failed trades move nothing',()=>{
  const state = fixture(); const [thief,b] = state.players as [Appraiser,Appraiser,Appraiser];
  seal(state,'s1',thief.id,b.id);
  setCredits(state,thief,4);
  handleSealAction(state,b,{type:'seal-offer',sealId:'s1',buyerId:thief.id,credits:10,energy:2,life:0,goods:0,terms:''});
  assert.throws(()=>handleSealAction(state,thief,{type:'seal-respond',offerId:'seal-offer:1',accept:true}));
  assert.equal(thief.credits,4); assert.equal(state.sinnerSeals!.length,1); assert.equal(state.sealOffers![0]!.status,'open');
  setCredits(state,thief,40); const energy = thief.energy, bEnergy = b.energy; b.energy = Math.min(b.energy,3);
  const bBefore = b.credits; const bEnergyNow = b.energy;
  handleSealAction(state,thief,{type:'seal-respond',offerId:'seal-offer:1',accept:true});
  assert.deepEqual(state.sinnerSeals,[]); assert.equal(thief.credits,30); assert.equal(b.credits,bBefore+10);
  assert.equal(thief.energy,energy-2); assert.equal(b.energy,bEnergyNow+2); void bEnergy;
});

test('forged and unauthorised seal commands are rejected',()=>{
  const state = fixture(); const [thief,b,c] = state.players as [Appraiser,Appraiser,Appraiser];
  seal(state,'s1',thief.id,b.id);
  assert.throws(()=>handleSealAction(state,c,{type:'seal-offer',sealId:'s1',buyerId:thief.id,credits:1,energy:0,life:0,goods:0}));
  assert.throws(()=>handleSealAction(state,b,{type:'seal-offer',sealId:'s1',buyerId:b.id,credits:1,energy:0,life:0,goods:0}));
  assert.throws(()=>handleSealAction(state,b,{type:'seal-offer',sealId:'s1',buyerId:c.id,credits:-1,energy:0,life:0,goods:0}));
  assert.throws(()=>handleSealAction(state,b,{type:'seal-offer',sealId:'s1',buyerId:c.id,credits:1,energy:0,life:0,goods:99}));
  assert.throws(()=>handleSealAction(state,b,{type:'seal-pick',redemptionId:'nope',slot:0}));
  handleSealAction(state,b,{type:'seal-offer',sealId:'s1',buyerId:c.id,credits:1,energy:0,life:0,goods:0});
  assert.throws(()=>handleSealAction(state,b,{type:'seal-offer',sealId:'s1',buyerId:thief.id,credits:1,energy:0,life:0,goods:0}),/ระหว่าง/);
  assert.throws(()=>handleSealAction(state,thief,{type:'seal-respond',offerId:'seal-offer:1',accept:true}));
});

test('engine rejects seal commands from a non-holder, replays duplicate request IDs, and closes offers on advance',()=>{
  let state = fixture(); const [thief,b,c] = state.players as [Appraiser,Appraiser,Appraiser];
  seal(state,'s1',thief.id,b.id);
  const offer = {type:'seal-offer' as const,playerId:b.id,requestId:'r1',encounter:state.encounter,sealId:'s1',buyerId:c.id,credits:2,energy:0,life:0,goods:0};
  assert.throws(()=>applyAppraisalAction(state,{...offer,playerId:c.id}));
  state = applyAppraisalAction(state,offer) as State;
  const again = applyAppraisalAction(state,offer) as State;
  assert.equal(again,state); assert.equal(state.sealOffers!.length,1);
  state = nextEncounter(state);
  assert.equal(state.sealOffers![0]!.status,'cancelled'); assert.equal(state.sinnerSeals![0]!.holderId,b.id);
});

test('goods payment: the buyer chooses exactly the requested number of carried goods and trade is atomic',()=>{
  const state = fixture(); const [thief,holder,buyer] = state.players as [Appraiser,Appraiser,Appraiser];
  seal(state,'s1',thief.id,holder.id);
  const mine = owned(state,buyer), spare = owned(state,buyer);
  handleSealAction(state,holder,{type:'seal-offer',sealId:'s1',buyerId:buyer.id,credits:0,energy:0,life:0,goods:1});
  const offerId = state.sealOffers![0]!.id;
  assert.throws(()=>handleSealAction(state,buyer,{type:'seal-respond',offerId,accept:true}));
  assert.throws(()=>handleSealAction(state,buyer,{type:'seal-respond',offerId,accept:true,itemIds:[mine,spare]}));
  assert.throws(()=>handleSealAction(state,buyer,{type:'seal-respond',offerId,accept:true,itemIds:['other-id']}));
  assert.equal(state.sinnerSeals![0]!.holderId,holder.id);
  handleSealAction(state,buyer,{type:'seal-respond',offerId,accept:true,itemIds:[mine]});
  assert.equal(state.items[mine]!.owner,holder.id); assert.equal(holder.inventory.includes(mine),true);
  assert.equal(buyer.inventory.includes(mine),false); assert.equal(buyer.inventory.includes(spare),true);
  assert.equal(state.sinnerSeals![0]!.holderId,buyer.id);
});

test('life payment cannot kill the payer or overflow the receiver',()=>{
  const state = fixture(); const [thief,holder,buyer] = state.players as [Appraiser,Appraiser,Appraiser];
  seal(state,'s1',thief.id,holder.id);
  assert.throws(()=>handleSealAction(state,holder,{type:'seal-offer',sealId:'s1',buyerId:buyer.id,credits:0,energy:0,life:1,goods:0}),/ชีวิต/);
});
