import test from 'node:test';
import assert from 'node:assert/strict';
import { applyAppraisalAction, appraisalViewFor } from '../src/game/appraisal/index.js';
import { CLEANSE_CAP, CLEANSE_RULES, cleanseBasePrice, cleanseChance, cleansePrice } from '../src/game/appraisal/cleanse-rules.js';
import { reward } from '../src/game/appraisal/mechanics.js';
import { ITEM_SPECS, merchantKinds } from '../src/game/appraisal/content.js';
import { parseAppraisalMessage } from '../src/server/appraisal-messages.js';
import type { AppraisalAction, AppraisalState, ItemKind, NpcId } from '../src/game/appraisal/types.js';
import { appraisalFixture } from './support/appraisal-fixture.js';

type Body=AppraisalAction extends infer A ? A extends AppraisalAction ? Omit<A,'playerId'|'requestId'|'encounter'> : never : never;
let request=0;
const act=(state:AppraisalState,playerId:string,body:Body)=>applyAppraisalAction(state,{...body,playerId,requestId:`cl-${++request}`,encounter:state.encounter} as AppraisalAction);
/** Alice sits at a shop; her `owned-*` items are the candidates. */
function shop(npc:NpcId='orc') {
  const state=appraisalFixture('E18');const p=state.players[0]!;
  p.selectedPortalId=p.portals[0]!.id;p.portals[0]!.npc=npc;reward(state,p,100,'test-fixture');return state;
}
const give=(state:AppraisalState,kind:ItemKind,id:string)=>{state.items[id]={...state.items['owned-mirror']!,id,kind};state.players[0]!.inventory.push(id);return id;};

test('price starts at half the reference price, scales with the merchant roll and trust, and odds never reach 100%',()=>{
  assert.equal(cleanseBasePrice('mirror'),12);
  assert.equal(cleansePrice('mirror','orc',0,0),12);assert.equal(cleansePrice('mirror','orc',0,1),17);
  assert(cleansePrice('mirror','orc',10,.5)<cleansePrice('mirror','orc',0,.5),'trust discounts the price');
  assert.equal(cleanseChance('orc',0,[]),50);assert.equal(cleanseChance('orc',3,[]),56);
  assert.equal(cleanseChance('orc',0,['smith-hammer','smith-hammer']),70);assert.equal(cleanseChance('orc',0,[],'whetstone'),70);
  assert.equal(cleanseChance('darkone',10,Array(10).fill('smith-hammer'),'whetstone'),CLEANSE_CAP);assert(CLEANSE_CAP<100);
  for(const npc of Object.keys(CLEANSE_RULES) as NpcId[]) assert(CLEANSE_RULES[npc].chance<CLEANSE_CAP);
});
test('the offer is public data, the attempt is charged either way, and success or failure reveals the curse state',()=>{
  const base=shop();const offer=appraisalViewFor(base,'alice').self.cleanseOffer!;
  assert.equal(offer.npc,'orc');assert.equal(offer.items.length,base.players[0]!.inventory.length);
  const row=offer.items.find(r=>r.itemId==='owned-mirror')!;assert.equal(row.chance,60,'orc 50% + the fixture\'s held smith hammer (+10)');
  let wins=0,fails=0;
  for(let i=0;i<80;i++) {
    let state=shop();state.seed=`cleanse-${i}`;state.items['owned-mirror']!.cursed=true;
    const credits=state.players[0]!.credits,energy=state.players[0]!.energy;
    const price=appraisalViewFor(state,'alice').self.cleanseOffer!.items.find(r=>r.itemId==='owned-mirror')!.price;
    state=act(state,'alice',{type:'cleanse',itemId:'owned-mirror'});const p=state.players[0]!;
    assert.equal(p.credits,credits-price);assert.equal(p.energy,energy,'merchant services cost no energy');
    if(state.items['owned-mirror']!.cursed){fails++;assert.equal(p.knowledge['owned-mirror']!.cursed,true);}
    else{wins++;assert.equal(p.knowledge['owned-mirror']!.cursed,false);}
    assert.throws(()=>act(state,'alice',{type:'cleanse',itemId:'owned-mirror'}),'one attempt per item per encounter');
  }
  assert(wins>20 && fails>20,`60% odds gave ${wins}/${fails}`);
});
test('whetstone raises the odds and is spent; a clean item just costs the fee; bad targets are rejected',()=>{
  let state=shop();const stone=give(state,'whetstone','stone-1');
  const view=appraisalViewFor(state,'alice');assert.equal(view.self.cleanseOffer!.stoneBonus,20);
  state=act(state,'alice',{type:'cleanse',itemId:'owned-mirror',stoneId:stone});
  assert(!state.players[0]!.inventory.includes(stone));assert.equal(state.items[stone]!.owner,'removed');
  assert.equal(state.players[0]!.knowledge['owned-mirror']!.cursed,false,'uncursed item: merchant finds nothing');
  assert.throws(()=>act(shop(),'alice',{type:'cleanse',itemId:'owned-mirror',stoneId:'owned-orb'}),/หินขัด/);
  assert.throws(()=>act(shop(),'alice',{type:'cleanse',itemId:'nope'}));
  const poor=shop();poor.players[0]!.credits=0;assert.throws(()=>act(poor,'alice',{type:'cleanse',itemId:'owned-mirror'}));
});
test('rule is opt-in: saved runs have no offer, no action and no smith tools in stock',()=>{
  const state=shop();delete state.config.cleanse;
  assert.equal(appraisalViewFor(state,'alice').self.cleanseOffer,undefined);assert.throws(()=>act(state,'alice',{type:'cleanse',itemId:'owned-mirror'}));
  for(const npc of Object.keys(CLEANSE_RULES) as NpcId[]) assert(merchantKinds(npc,3).every(k=>k!=='whetstone' && k!=='smith-hammer'));
  assert(Object.keys(CLEANSE_RULES).some(npc=>merchantKinds(npc as NpcId,3,true).includes('whetstone')));
  assert(ITEM_SPECS['smith-hammer'] && ITEM_SPECS.whetstone.consumable);
  const msg=parseAppraisalMessage({type:'action',matchId:'m1',action:{type:'cleanse',requestId:'r1',encounter:1,itemId:'a',stoneId:'b'}});
  assert.deepEqual(msg,{type:'action',matchId:'m1',action:{type:'cleanse',requestId:'r1',encounter:1,itemId:'a',stoneId:'b'}});
  assert.throws(()=>parseAppraisalMessage({type:'action',matchId:'m1',action:{type:'cleanse',requestId:'r1',encounter:1,itemId:'a',extra:1}}));
});
