import test from 'node:test';
import assert from 'node:assert/strict';
import { applyAppraisalAction, appraisalViewFor } from '../src/game/appraisal/index.js';
import { ITEM_SPECS } from '../src/game/appraisal/content.js';
import { eventEligible, offerEvent } from '../src/game/appraisal/events.js';
import { grant } from '../src/game/appraisal/mechanics.js';
import { WISH_CAP, WISH_FLOOR, WISH_MARKUPS, wishAsk, wishChance, wishPrice } from '../src/game/appraisal/wishlist-rules.js';
import { parseAppraisalMessage } from '../src/server/appraisal-messages.js';
import type { AppraisalAction, AppraisalState } from '../src/game/appraisal/types.js';
import { appraisalFixture } from './support/appraisal-fixture.js';

type Body=AppraisalAction extends infer A ? A extends AppraisalAction ? Omit<A,'playerId'|'requestId'|'encounter'> : never : never;
let request=0;
const act=(state:AppraisalState,playerId:string,body:Body)=>applyAppraisalAction(state,{...body,playerId,requestId:`wish-${++request}`,encounter:state.encounter} as AppraisalAction);
function shop(seed:string,wanted='mirror' as const) {
  const state=appraisalFixture('E18');state.seed=seed;const p=state.players[0]!;
  p.eventOffer=null;p.selectedPortalId=p.portals[0]!.id;p.portals[0]!.npc='orc';
  p.wishes={orc:{kind:wanted,price:wishPrice(wanted)}};return state;
}

test('price is far above the market anchor and the odds stay between floor and cap',()=>{
  assert(wishPrice('mirror')>ITEM_SPECS.mirror.anchor*1.5);assert.equal(wishAsk(100,30),130);
  assert.equal(wishChance(0,0,0,0),85);assert(wishChance(40,0,0,0)<wishChance(0,0,0,0),'asking more lowers the odds');
  assert(wishChance(10,5,3,0)>wishChance(10,5,0,0) && wishChance(10,5,0,3)<wishChance(10,5,0,0),'buffs help, debuffs hurt');
  assert.equal(wishChance(0,10,9,0),WISH_CAP);assert.equal(wishChance(40,0,0,9),WISH_FLOOR);
});
test('E73: a merchant announces a wish once, accepting stores it and the view shows the standing offer',()=>{
  const state=appraisalFixture('E18');const p=state.players[0]!;p.eventOffer=null;p.selectedPortalId=p.portals[0]!.id;
  assert.equal(eventEligible(state,p,'E73'),true);
  offerEvent(state,p,'E73');const offer=structuredClone(p.eventOffer!);
  assert(offer.wish && offer.wish.price===wishPrice(offer.wish.kind));assert.deepEqual(offer.choices,['accept','decline']);
  const declined=act(structuredClone(state),'alice',{type:'event',key:offer.key,choice:'decline'}).players[0]!;
  assert.deepEqual(declined.wishes,{});
  const after=act(state,'alice',{type:'event',key:offer.key,choice:'accept'});const npc=p.portals.find(v=>v.id===p.selectedPortalId)!.npc;
  assert.deepEqual(after.players[0]!.wishes![npc],offer.wish);assert.equal(eventEligible(after,after.players[0]!,'E73'),false,'no second wish while one is open');
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
