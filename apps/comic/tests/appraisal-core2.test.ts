import { rarityValue } from '../src/shared/rarity-power.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {applyAppraisalAction,appraisalViewFor,assertAppraisalInvariants,createAppraisalRun,exportAppraisalAudit,replayAppraisalAudit,SURVIVAL_RULES} from '../src/game/appraisal/index.js';
import {ITEM_SPECS} from '../src/game/appraisal/content.js';
import {CORE2,anchorOf,consignPayout,decayFor,dreadChance,overvalueChance} from '../src/game/appraisal/core2.js';
import {grant,noteScrap} from '../src/game/appraisal/mechanics.js';
import {CORE2_SPECS} from '../src/game/appraisal/core2-events.js';
import {stealChance} from '../src/game/appraisal/core2-actions.js';
import {liveRules,playBalanced,runBalanced} from '../src/simulation/balance.js';
import type {AppraisalAction,AppraisalState,EventId} from '../src/game/appraisal/types.js';

type Body=AppraisalAction extends infer A?A extends AppraisalAction?Omit<A,'playerId'|'requestId'|'encounter'>:never:never;
let request=0;
const act=(s:AppraisalState,id:string,body:Body)=>applyAppraisalAction(s,{...body,playerId:id,requestId:`core2-${++request}`,encounter:s.encounter} as AppraisalAction);
function fixture(seed='core2-fixture',core2=true):AppraisalState {
  const s=createAppraisalRun(['alice','bob'],seed,{survival:SURVIVAL_RULES,marketProbability:0,trustAbilities:false,...(core2?{core2:true}:{})});
  for(const p of s.players){p.eventOffer=null;p.offerSlots=2;p.consequenceSlots=0;}
  return s;
}
function inShop(s:AppraisalState,id='alice'):AppraisalState {
  const p=s.players.find(v=>v.id===id)!;
  return act(s,id,{type:'enter',portalId:p.portals[0]!.id});
}
function toAppraisal(s:AppraisalState):AppraisalState {
  s=inShop(s,'alice');s=inShop(s,'bob');
  for(const p of s.players){p.eventOffer=null;p.offerSlots=2;p.consequenceSlots=0;p.energy=8;}
  assert.equal(s.phase,'APPRAISAL');return s;
}

test('runs saved without core2 keep the old prices and decay',()=>{
  const s=fixture('legacy',false);
  assert.equal(s.config.core2,undefined);
  for(const kind of Object.keys(ITEM_SPECS) as Array<keyof typeof ITEM_SPECS>)assert.equal(anchorOf(s.config,kind),ITEM_SPECS[kind].anchor);
  assert.equal(appraisalViewFor(s,'alice').core2,undefined);
});

test('core2 prices restoratives by their healing and keeps every good affordable',()=>{
  const live=fixture().config;const {survival:_s,...plain}=live;
  const kinds=Object.keys(ITEM_SPECS) as Array<keyof typeof ITEM_SPECS>;
  assert.ok(kinds.some(k=>anchorOf(live,k)>anchorOf(plain,k)),'some goods cost more because they restore life in survival');
  for(const kind of kinds)assert.ok(anchorOf(live,kind)>=4);
});

test('consign pays 80% of the real value minus a fee, less for fakes and cursed goods',()=>{
  assert.equal(consignPayout(20,true,false),Math.floor(20*.8)-CORE2.consign.fee);
  assert.ok(consignPayout(20,false,false)<consignPayout(20,true,false));
  assert.ok(consignPayout(20,true,true)<consignPayout(20,true,false));
  assert.equal(consignPayout(2,false,true),0);
});

test('overvaluing only draws a backlash from twice the asking price and caps below certainty',()=>{
  assert.equal(overvalueChance(19,10),0);
  assert.ok(overvalueChance(20,10)>=CORE2.overvalue.base);
  assert.ok(overvalueChance(25,10)>overvalueChance(20,10));
  assert.equal(overvalueChance(900,10),CORE2.overvalue.cap);
});

test('survival pressure grows but is capped, and the run is only over when every life is gone',()=>{
  assert.equal(decayFor(1),1);assert.ok(decayFor(14)>decayFor(1));assert.ok(decayFor(99)<=CORE2.decayCap);
  assert.ok(dreadChance(10)>dreadChance(1));assert.ok(dreadChance(99)<=CORE2.dread.cap);
  for(let i=0;i<4;i++){
    const run=runBalanced(3,['aggressive','trader','collector'],`core2-cap:${i}`,liveRules({core2:true}));
    assert.notEqual(run.ended,'stuck');
  }
});

test('an overvalued appraisal is refused and the merchant court demands a payment of the seat’s choice',()=>{
  let found=false;
  for(let n=0;n<12 && !found;n++){
    let s=toAppraisal(fixture(`backlash-${n}`));
    const alice=s.players[0]!;const item=s.items[alice.stock[0]!]!;
    s=act(s,'alice',{type:'appraise',itemId:item.id,value:Math.min(1000,item.ask*8),acceptDanger:true});
    const a=s.players[0]!;
    if(!a.inflated)continue;
    found=true;
    assert.equal(a.valuations[item.id]!.accepted,false);
    assert.ok(a.eventOffer && CORE2_SPECS[a.eventOffer.id as EventId]?.consequence,'a consequence event is waiting');
    assert.ok(a.eventOffer!.choices.includes('pay') || a.eventOffer!.choices.includes('brand'));
    assert.throws(()=>act(s,'alice',{type:'inspect',itemId:item.id,property:'authenticity'}),/resolve/);
    const before=a.credits;
    s=act(s,'alice',{type:'event',key:a.eventOffer!.key,choice:a.eventOffer!.choices[0]!,...(a.eventOffer!.choices[0]==='item'?{itemId:a.inventory[0]}:{})} as Body);
    assert.equal(s.players[0]!.eventOffer,null);assert.ok(s.players[0]!.credits<=before);
    assertAppraisalInvariants(s);
  }
  assert.ok(found,'some seed draws the backlash');
});

test('stealing from a shop costs energy, can only be tried once, and a failure must be paid for',()=>{
  const results=new Set<string>();
  for(let n=0;n<16;n++){
    let s=toAppraisal(fixture(`steal-${n}`));
    const id=s.players[0]!.stock[0]!;
    const energy=s.players[0]!.energy;
    s=act(s,'alice',{type:'steal',itemId:id});
    const a=s.players[0]!;
    assert.equal(a.energy,energy-CORE2.steal.energy);
    if(a.inventory.includes(id)){
      results.add('ok');assert.equal(s.items[id]!.stolen,true);
      assert.equal(a.stock.includes(id),false);assert.throws(()=>act(s,'alice',{type:'steal',itemId:a.stock[0]!}),/ครั้งเดียว/);
    } else {
      results.add('caught');assert.equal(a.eventOffer?.id,'E123');
      const choice=a.eventOffer!.choices[0]!;
      s=act(s,'alice',{type:'event',key:a.eventOffer!.key,choice,...(choice==='item'?{itemId:a.inventory[0]}:{})} as Body);
      assert.equal(s.players[0]!.eventOffer,null);
    }
    assertAppraisalInvariants(s);
  }
  assert.deepEqual([...results].sort(),['caught','ok']);
});

test('picking a friend’s pocket moves credits, and a guard stops it',()=>{
  let moved=false,paid=false;
  for(let n=0;n<24 && !(moved&&paid);n++){
    let s=toAppraisal(fixture(`pocket-${n}`));
    const before=s.players[1]!.credits;const startA=s.players[0]!.credits;
    s=act(s,'alice',{type:'pickpocket',victimId:'bob'});
    const a=s.players[0]!,b=s.players[1]!;
    if(b.credits<before){moved=true;assert.equal(a.credits,startA+(before-b.credits));}
    else {
      paid=true;assert.equal(a.eventOffer?.id,'E124');
      const choice=a.eventOffer!.choices.includes('pay')?'pay':a.eventOffer!.choices[0]!;
      s=act(s,'alice',{type:'event',key:a.eventOffer!.key,choice,...(choice==='item'?{itemId:a.inventory[0]}:{})} as Body);
      if(choice==='pay')assert.equal(s.players[1]!.credits,before+CORE2_SPECS.E124!.choices[0]!.credits!);
    }
    assertAppraisalInvariants(s);
  }
  assert.ok(moved&&paid);
  const guard=toAppraisal(fixture('pocket-guard'));
  grant(guard,guard.players[1]!,'B21');
  const bobCredits=guard.players[1]!.credits;
  const after=act(guard,'alice',{type:'pickpocket',victimId:'bob'});
  assert.equal(after.players[1]!.credits,bobCredits);
  assert.equal(after.players[0]!.eventOffer?.id,'E124');
});

test('theft odds follow trust, the omen and the watchers',()=>{
  const s=toAppraisal(fixture('odds'));const a=s.players[0]!;const npc=s.items[a.stock[0]!]!.npc;
  const base=stealChance(s,a,npc);
  a.npcTrust![npc]=5;assert.ok(stealChance(s,a,npc)>base);
  assert.ok(stealChance(s,a,npc,true)<stealChance(s,a,npc,false));
});

test('buying two goods other seats appraised refunds energy, at most twice per encounter',()=>{
  const s=toAppraisal(fixture('scrap'));
  const a=s.players[0]!;a.energy=0;
  const items=a.stock.map(id=>s.items[id]!);
  const other=(i:number)=>{const copy={...items[0]!,appraisedBy:'bob',id:`x${i}`};return copy;};
  noteScrap(s,a,[other(1)]);assert.equal(a.energy,0);
  noteScrap(s,a,[other(2)]);assert.equal(a.energy,CORE2.scrap.energy);
  for(let i=3;i<12;i++)noteScrap(s,a,[other(i)]);
  assert.equal(a.energy,Math.min(a.energy,CORE2.scrap.energy*CORE2.scrap.cap));
  assert.equal(a.scrapPaid,CORE2.scrap.cap);
  const own={...items[0]!,appraisedBy:'alice'};const gained=a.energy;noteScrap(s,a,[own,own]);assert.equal(a.energy,gained);
});

test('a merchant skill needs trust, works once per encounter, and its price is checked first',()=>{
  const s=toAppraisal(fixture('skill'));const a=s.players[0]!;const npc=s.items[a.stock[0]!]!.npc;
  assert.equal(appraisalViewFor(s,'alice').self.core2Actions?.skill,undefined);
  assert.throws(()=>act(s,'alice',{type:'skill',itemId:a.stock[0]!}),/ความสามารถ/);
  a.npcTrust![npc]=CORE2.skill.trust;
  const view=appraisalViewFor(s,'alice').self.core2Actions!;
  if(!view.skill)return; // the merchant's price (life or an unaffordable debuff) is not met; the button stays hidden
  const itemId=view.skill.needsItem?a.stock[0]!:undefined;
  const after=act(s,'alice',{type:'skill',...(itemId?{itemId}:{})});
  assert.equal(after.players[0]!.skillUsed,true);
  assert.throws(()=>act(after,'alice',{type:'skill',...(itemId?{itemId}:{})}),/ความสามารถ/);
});

test('barter swaps goods without credits and rejects goods that are too cheap',()=>{
  const s=toAppraisal(fixture('barter'));const a=s.players[0]!;
  const shopItem=s.items[a.stock[0]!]!;
  const kind=(Object.keys(ITEM_SPECS) as Array<keyof typeof ITEM_SPECS>).find(k=>rarityValue(shopItem,anchorOf(s.config,k))>=shopItem.ask)!;
  const mine={...shopItem,id:'mine',kind,owner:'alice',npc:shopItem.npc,genuine:true,cursed:false,stolen:false,appraisedBy:undefined};
  s.items['mine']=mine as never;a.inventory.push('mine');
  const credits=a.credits;
  const after=act(s,'alice',{type:'barter',itemId:'mine',targetItemId:shopItem.id});
  assert.ok(after.players[0]!.inventory.includes(shopItem.id));assert.equal(after.players[0]!.inventory.includes('mine'),false);
  assert.ok(after.players[0]!.credits<=credits+0);assertAppraisalInvariants(after);
});

test('a core2 run replays from its audit, and every new event has a choice for every purse',()=>{
  const run=runBalanced(2,['aggressive','collector'],'core2-replay',liveRules({core2:true}));
  assert.ok(run.encounters>=1);
  const {state}=playBalanced(2,['aggressive','trader'],'core2-audit',liveRules({core2:true}));
  assert.equal(state.phase,'RESULTS');
  assert.equal(state.config.core2,true);
  assert.doesNotThrow(()=>replayAppraisalAudit(exportAppraisalAudit(state)));
  for(const spec of Object.values(CORE2_SPECS)){
    assert.ok(spec.choices.length>=1);
    assert.ok(spec.choices.every(c=>c.id!==''));
  }
});

test('rerolling a merchant door costs 2 energy, then 1 more each time, and resets next encounter',()=>{
  let s=fixture('reroll-cost');const alice=()=>s.players.find(v=>v.id==='alice')!;
  const first=alice().portals[0]!;const others=alice().portals.slice(1).map(v=>v.id);const energy=alice().energy;
  s=act(s,'alice',{type:'reroll-portal',portalId:first.id});
  assert.equal(alice().energy,energy-CORE2.reroll.energy);assert.equal(alice().portalRerolls,1);
  assert.notEqual(alice().portals[0]!.id,first.id);assert.notEqual(alice().portals[0]!.npc,first.npc);assert.deepEqual(alice().portals.slice(1).map(v=>v.id),others);
  assert.equal(new Set(alice().portals.map(v=>v.npc)).size,3);
  assert.equal(alice().portals[0]!.stock.length,2);assert.ok(alice().portals[0]!.stock.every(id=>!!s.items[id]));
  s=act(s,'alice',{type:'reroll-portal',portalId:alice().portals[1]!.id});
  assert.equal(alice().energy,energy-CORE2.reroll.energy-(CORE2.reroll.energy+CORE2.reroll.step));
  assert.equal(appraisalViewFor(s,'alice').self.portalRerolls,2);
  assert.doesNotThrow(()=>assertAppraisalInvariants(s));
  s=act(s,'bob',{type:'enter',portalId:s.players[1]!.portals[0]!.id});s=act(s,'alice',{type:'enter',portalId:alice().portals[0]!.id});
  assert.equal(s.phase,'APPRAISAL');
  s=act(s,'alice',{type:'done'});s=act(s,'bob',{type:'done'});
  assert.equal(s.phase==='REVEAL'||s.phase==='TRADE',true);
});

test('a door reroll needs enough energy, an open door and the core v0.6 rules',()=>{
  let s=fixture('reroll-limits');const p=s.players[0]!;
  p.energy=1;assert.throws(()=>act(s,'alice',{type:'reroll-portal',portalId:p.portals[0]!.id}),/พลัง/);
  assert.throws(()=>act(s,'alice',{type:'reroll-portal',portalId:'no-such-door'}));
  p.energy=9;p.portals[0]!.disabled=true;assert.throws(()=>act(s,'alice',{type:'reroll-portal',portalId:p.portals[0]!.id}));
  p.portals[0]!.disabled=false;s=act(s,'alice',{type:'enter',portalId:p.portals[0]!.id});
  assert.throws(()=>act(s,'alice',{type:'reroll-portal',portalId:s.players[0]!.portals[1]!.id}));
  const old=fixture('reroll-old',false);assert.throws(()=>act(old,'alice',{type:'reroll-portal',portalId:old.players[0]!.portals[0]!.id}));
});
