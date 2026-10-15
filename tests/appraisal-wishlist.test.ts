import test from 'node:test';
import assert from 'node:assert/strict';
import { applyAppraisalAction, appraisalViewFor } from '../src/game/appraisal/index.js';
import { ITEM_SPECS } from '../src/game/appraisal/content.js';
import { eventEligible, offerEvent } from '../src/game/appraisal/events.js';
import { grant } from '../src/game/appraisal/mechanics.js';
import { WISH_CAP, WISH_DECAY_SHARE, WISH_ENERGY, WISH_FLOOR, WISH_MARKUPS, WISH_MAX_ACTIVE, wishAsk, wishChance, wishDecayStep, wishDecayed, wishFloor, wishPrice } from '../src/game/appraisal/wishlist-rules.js';
import { parseAppraisalMessage } from '../src/server/appraisal-messages.js';
import type { AppraisalAction, AppraisalState, NpcId } from '../src/game/appraisal/types.js';
import { appraisalFixture } from './support/appraisal-fixture.js';

type Body=AppraisalAction extends infer A ? A extends AppraisalAction ? Omit<A,'playerId'|'requestId'|'encounter'> : never : never;
let request=0;
const act=(state:AppraisalState,playerId:string,body:Body)=>applyAppraisalAction(state,{...body,playerId,requestId:`wish-${++request}`,encounter:state.encounter} as AppraisalAction);
function shop(seed:string,wanted='mirror' as const) {
  const state=appraisalFixture('E18');state.seed=seed;const p=state.players[0]!;
  p.eventOffer=null;p.selectedPortalId=p.portals[0]!.id;p.portals[0]!.npc='orc';
  p.wishes={orc:{kind:wanted,price:wishPrice(wanted),set:1}};return state;
}

test('price is far above the market anchor and the odds stay between floor and cap',()=>{
  assert(wishPrice('mirror')>ITEM_SPECS.mirror.anchor*1.5);assert.equal(wishAsk(100,30),130);
  assert.equal(wishChance(0,0,0,0),85);assert(wishChance(40,0,0,0)<wishChance(0,0,0,0),'asking more lowers the odds');
  assert(wishChance(10,5,3,0)>wishChance(10,5,0,0) && wishChance(10,5,0,3)<wishChance(10,5,0,0),'buffs help, debuffs hurt');
  assert.equal(wishChance(0,10,9,0),WISH_CAP);assert.equal(wishChance(40,0,0,30),WISH_FLOOR);
});
test('E73: a merchant announces a wish once, accepting stores it and the view shows the standing offer',()=>{
  const state=appraisalFixture('E18');const p=state.players[0]!;p.eventOffer=null;p.selectedPortalId=p.portals[0]!.id;
  assert.equal(eventEligible(state,p,'E73'),true);
  offerEvent(state,p,'E73');const offer=structuredClone(p.eventOffer!);
  assert(offer.wish && offer.wish.price===wishPrice(offer.wish.kind));assert.deepEqual(offer.choices,['accept','decline']);
  const declined=act(structuredClone(state),'alice',{type:'event',key:offer.key,choice:'decline'}).players[0]!;
  assert.deepEqual(declined.wishes,{});
  const after=act(state,'alice',{type:'event',key:offer.key,choice:'accept'});const npc=p.portals.find(v=>v.id===p.selectedPortalId)!.npc;
  assert.deepEqual(after.players[0]!.wishes![npc],{...offer.wish,set:1});assert.equal(after.players[0]!.energy,p.energy-WISH_ENERGY,'a new wish costs energy');assert.equal(eventEligible(after,after.players[0]!,'E73'),false,'no second wish while one is open');
  after.players[0]!.selectedPortalId=after.players[0]!.portals.find(v=>v.npc===npc)?.id??after.players[0]!.selectedPortalId;
  const view=appraisalViewFor(after,'alice');
  if(view.self.wishOffer){assert.equal(view.self.wishOffer.options.length,WISH_MARKUPS.length);assert.equal(view.wishlist,true);}
});
test('selling pays the asked price once, clears the wish and raises trust; a refusal keeps the wish for next time',()=>{
  let sold=0,refused=0,fakes=0;
  for(let i=0;i<120;i++) {
    const state=shop(`wish-${i}`);const p=state.players[0]!;const markup=i%2?0:40;
    state.items['owned-mirror']!.genuine=i%3!==0;
    const credits=p.credits,trust=p.npcTrust!.orc??0,price=wishAsk(wishPrice('mirror'),markup);
    const after=act(state,'alice',{type:'wish-sell',itemId:'owned-mirror',markup});const q=after.players[0]!;
    assert.equal(q.wishTried,true);assert.throws(()=>act(after,'alice',{type:'wish-sell',itemId:'owned-mirror',markup}),/ต่อรอง|ไม่ได้บอก/);
    if(q.credits===credits+price){sold++;assert.equal(q.wishes!.orc,undefined);assert(!q.inventory.includes('owned-mirror'));assert.equal(q.npcTrust!.orc,Math.min(10,trust+1));}
    else{refused++;assert.equal(q.credits,credits);assert(q.inventory.includes('owned-mirror'));assert(q.wishes!.orc);if(!state.items['owned-mirror']!.genuine&&q.knowledge['owned-mirror']?.genuine===false)fakes++;}
  }
  assert(sold>20 && refused>10 && fakes>0,`sold ${sold}, refused ${refused}, fakes caught ${fakes}`);
});
test('statuses move the odds shown to the player; wrong kind, unknown markup and rule-less runs are rejected',()=>{
  const state=shop('wish-view');const base=appraisalViewFor(state,'alice').self.wishOffer!;
  grant(state,state.players[0]!,'B03');grant(state,state.players[0]!,'D01');grant(state,state.players[0]!,'B04');
  const view=appraisalViewFor(state,'alice').self.wishOffer!;assert.equal(view.buffs,2);assert.equal(view.debuffs,1);assert(view.options[0]!.chance>base.options[0]!.chance);
  assert.deepEqual(view.itemIds,['owned-mirror']);
  assert.throws(()=>act(shop('x'),'alice',{type:'wish-sell',itemId:'owned-orb',markup:0}),/ชนิดนี้/);
  assert.throws(()=>act(shop('x'),'alice',{type:'wish-sell',itemId:'owned-mirror',markup:7}));
  const legacy=shop('x');delete legacy.config.wishlist;assert.throws(()=>act(legacy,'alice',{type:'wish-sell',itemId:'owned-mirror',markup:0}));
  assert.equal(appraisalViewFor(legacy,'alice').self.wishOffer,undefined);assert.equal(eventEligible(legacy,legacy.players[0]!,'E73'),false);
  const msg={type:'action',matchId:'m1',action:{type:'wish-sell',requestId:'r1',encounter:1,itemId:'a',markup:10}};
  assert.deepEqual(parseAppraisalMessage(msg),msg);
  assert.throws(()=>parseAppraisalMessage({...msg,action:{...msg.action,extra:1}}));
});

const at=(state:AppraisalState,npc:NpcId)=>{const p=state.players[0]!;p.selectedPortalId=p.portals[0]!.id;p.portals[0]!.npc=npc;return state;};
test('the offer sinks a fixed step per encounter, stops at the base price, and ignores buffs and debuffs',()=>{
  const kind='mirror' as const;const start=wishPrice(kind),floor=wishFloor(kind),step=wishDecayStep(kind);
  assert.equal(floor,ITEM_SPECS.mirror.anchor);assert(start>floor);assert.equal(step,Math.ceil(floor*WISH_DECAY_SHARE));
  assert.equal(wishDecayed(kind,start,0),start);assert.equal(wishDecayed(kind,start,1),start-step);assert.equal(wishDecayed(kind,start,99),floor);
  for(let age=0;age<12;age++) assert(wishDecayed(kind,start,age+1)<=wishDecayed(kind,start,age) && wishDecayed(kind,start,age)>=floor);
  const state=shop('decay');const first=appraisalViewFor(state,'alice').self.wishOffer!;
  assert.equal(first.price,start);assert.equal(first.floor,floor);assert.equal(first.next,start-step);assert.equal(first.age,0);
  state.encounter=3;state.players[0]!.wishTried=false;const later=appraisalViewFor(state,'alice').self.wishOffer!;
  assert.equal(later.price,wishDecayed(kind,start,2));assert.equal(later.options[0]!.price,later.price);
  grant(state,state.players[0]!,'D13');grant(state,state.players[0]!,'D12');grant(state,state.players[0]!,'B13');
  assert.equal(appraisalViewFor(state,'alice').self.wishOffer!.price,later.price,'statuses never move the price');
  state.encounter=40;assert.equal(appraisalViewFor(state,'alice').self.wishOffer!.price,floor);
  assert.equal(appraisalViewFor(state,'alice').self.wishDesk!.book[0]!.floor,floor);
});
test('a sale pays the decayed price, never less than base',()=>{
  const state=shop('decay-sale');state.encounter=3;state.items['owned-mirror']!.genuine=true;
  const expected=wishAsk(wishDecayed('mirror',wishPrice('mirror'),2),0);let paid=0;
  for(let i=0;i<30 && !paid;i++){const s=shop(`decay-sale-${i}`);s.encounter=3;s.items['owned-mirror']!.genuine=true;const credits=s.players[0]!.credits;
    const after=act(s,'alice',{type:'wish-sell',itemId:'owned-mirror',markup:0}).players[0]!;if(after.credits>credits){paid=after.credits-credits;}}
  assert.equal(paid,expected);assert(paid>=wishFloor('mirror'));
});
test('a new wish costs energy, two stay open, a third must replace one, and redoing the same merchant swaps it',()=>{
  let state=at(appraisalFixture('E18'),'orc');state.players[0]!.eventOffer=null;state.players[0]!.wishes={};
  const energy=state.players[0]!.energy;
  state=act(state,'alice',{type:'wish-new'});let p=state.players[0]!;
  assert.equal(p.energy,energy-WISH_ENERGY);assert.deepEqual(Object.keys(p.wishes!),['orc']);assert.equal(p.wishes!.orc!.set,1);
  const first=p.wishes!.orc!;
  state=act(state,'alice',{type:'wish-new'});p=state.players[0]!;
  assert.equal(Object.keys(p.wishes!).length,1,'same merchant: replaced in place');assert.notEqual(p.wishes!.orc!.kind,first.kind,'a re-roll never repeats the kind');assert.equal(p.energy,energy-2*WISH_ENERGY);
  assert.throws(()=>act(state,'alice',{type:'wish-new',replaceNpc:'vampire'}),/แทน/);
  at(state,'vampire');state=act(state,'alice',{type:'wish-new'});p=state.players[0]!;
  assert.deepEqual(Object.keys(p.wishes!).sort(),['orc','vampire']);assert.equal(WISH_MAX_ACTIVE,2);
  at(state,'beast');p=state.players[0]!;p.energy=9;
  const desk=appraisalViewFor(state,'alice').self.wishDesk!;assert.deepEqual(desk.replaceable.sort(),['orc','vampire']);assert.equal(desk.replaces,null);assert.equal(desk.cost,WISH_ENERGY);
  assert.throws(()=>act(state,'alice',{type:'wish-new'}),/ครบ/);assert.throws(()=>act(state,'alice',{type:'wish-new',replaceNpc:'alien'}),/ครบ/);
  state=act(state,'alice',{type:'wish-new',replaceNpc:'orc'});p=state.players[0]!;
  assert.deepEqual(Object.keys(p.wishes!).sort(),['beast','vampire']);assert(p.notes.some(n=>n.includes('ยกเลิกคำขอ')));
  const broke=at(appraisalFixture('E18'),'orc');broke.players[0]!.eventOffer=null;broke.players[0]!.energy=1;
  assert.throws(()=>act(broke,'alice',{type:'wish-new'}),/พลังไม่พอ/);
});
test('E73 with two wishes open offers replace choices; saved runs keep free, unlimited, undecaying wishes',()=>{
  const state=at(appraisalFixture('E18'),'orc');const p=state.players[0]!;p.eventOffer=null;
  p.wishes={vampire:{kind:'mirror',price:wishPrice('mirror'),set:1},beast:{kind:'food',price:wishPrice('food'),set:1}};
  assert.equal(eventEligible(state,p,'E73'),true);offerEvent(state,p,'E73');
  assert.deepEqual(p.eventOffer!.choices,['replace:vampire','replace:beast','decline']);
  const energy=p.energy;const done=act(state,'alice',{type:'event',key:p.eventOffer!.key,choice:'replace:beast'}).players[0]!;
  assert.deepEqual(Object.keys(done.wishes!).sort(),['orc','vampire']);assert.equal(done.energy,energy-WISH_ENERGY);
  const legacy=at(appraisalFixture('E18'),'orc');delete legacy.config.wishContract;legacy.players[0]!.eventOffer=null;legacy.players[0]!.wishes={orc:{kind:'mirror',price:wishPrice('mirror')}};
  legacy.encounter=9;assert.equal(appraisalViewFor(legacy,'alice').self.wishOffer!.price,wishPrice('mirror'));assert.equal(appraisalViewFor(legacy,'alice').self.wishDesk,undefined);
  assert.throws(()=>act(legacy,'alice',{type:'wish-new'}));
  const msg={type:'action',matchId:'m1',action:{type:'wish-new',requestId:'r1',encounter:1,replaceNpc:'orc'}};
  assert.deepEqual(parseAppraisalMessage(msg),msg);assert.deepEqual(parseAppraisalMessage({...msg,action:{type:'wish-new',requestId:'r1',encounter:1}}),{...msg,action:{type:'wish-new',requestId:'r1',encounter:1}});
  assert.throws(()=>parseAppraisalMessage({...msg,action:{...msg.action,extra:1}}));
});
