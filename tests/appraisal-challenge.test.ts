import test from 'node:test';
import assert from 'node:assert/strict';
import { applyAppraisalAction, appraisalViewFor } from '../src/game/appraisal/index.js';
import { CHALLENGE_CAP, challengeDiscount, challengePenalty, winPct } from '../src/game/appraisal/challenge-rules.js';
import { ITEM_SPECS, merchantKinds } from '../src/game/appraisal/content.js';
import { npcQuote } from '../src/game/appraisal/mechanics.js';
import { parseAppraisalMessage } from '../src/server/appraisal-messages.js';
import type { AppraisalAction, AppraisalState, ItemKind, NpcId } from '../src/game/appraisal/types.js';
import { appraisalFixture } from './support/appraisal-fixture.js';

type Body=AppraisalAction extends infer A ? A extends AppraisalAction ? Omit<A,'playerId'|'requestId'|'encounter'> : never : never;
let request=0;
const act=(state:AppraisalState,playerId:string,body:Body)=>applyAppraisalAction(state,{...body,playerId,requestId:`ch-${++request}`,encounter:state.encounter} as AppraisalAction);
/** Bob (seller) lists his appraised shop item claiming it is genuine; alice (buyer) is in the TRADE phase. */
function table(claim:boolean,truth:boolean) {
  const state=appraisalFixture('E47');state.phase='TRADE';
  const bob=state.players[1]!,alice=state.players[0]!;const itemId=bob.stock[0]!;
  state.items[itemId]!.genuine=truth;state.items[itemId]!.cursed=false;
  for(const p of state.players){p.eventOffer=null;p.done=false;}
  state.listings=state.listings.filter(l=>l.itemId!==itemId);
  state.listings.push({ownerId:bob.id,itemId,purchase:true,claims:{genuine:claim}});
  return {state,itemId,bob,alice};
}
const give=(state:AppraisalState,kind:ItemKind,id:string)=>{state.items[id]={...state.items['owned-mirror']!,id,kind};state.players[0]!.inventory.push(id);return id;};

test('discount and penalty are percentages of the appraisal price; lenses help only the winner and stay capped',()=>{
  assert.equal(challengeDiscount(20,0),10);assert.equal(challengePenalty(20),10);assert.equal(winPct(2),70);assert.equal(winPct(99),CHALLENGE_CAP);
  assert.equal(challengeDiscount(20,2),14);assert.equal(challengePenalty(20),10,'lenses never raise the penalty');
});
test('a correct challenge discounts the appraisal price by 50%, excludes commission, and reveals the truth',()=>{
  const control=(()=>{const t=table(true,false);let s=act(t.state,'alice',{type:'propose',sellerId:'bob',itemId:t.itemId,credits:0,condition:false});
    s=act(s,'bob',{type:'respond',offerId:s.trades.at(-1)!.id,accept:true});return t.state.players[0]!.credits-s.players[0]!.credits;})();
  const {state,itemId,bob}=table(true,false);const quote=npcQuote(bob,state.items[itemId]!);
  let s=act(state,'alice',{type:'propose',sellerId:'bob',itemId,credits:0,condition:false,challenge:'genuine'});
  const before=state.players[0]!.credits;
  s=act(s,'bob',{type:'respond',offerId:s.trades.at(-1)!.id,accept:true});const a=s.players[0]!;
  assert.equal(control-(before-a.credits),challengeDiscount(quote,1),'50% of the appraisal price off, +10 points for the fixture\'s one held doubt lens');
  assert(a.inventory.includes(itemId));assert.equal(a.knowledge[itemId]!.genuine,false);
});
test('a wrong challenge pays the appraiser 50% of the appraisal price; a void seal cancels it and is spent',()=>{
  for(const sealed of [false,true]) {
    const {state,itemId,bob}=table(true,true);const quote=npcQuote(bob,state.items[itemId]!);const seal=sealed?give(state,'void-seal','seal-1'):undefined;
    let s=act(state,'alice',{type:'propose',sellerId:'bob',itemId,credits:0,condition:false,challenge:'genuine',...(seal?{sealId:seal}:{})});
    const buyerBefore=s.players[0]!.credits,sellerBefore=s.players[1]!.credits;
    s=act(s,'bob',{type:'respond',offerId:s.trades.at(-1)!.id,accept:true});const a=s.players[0]!,b=s.players[1]!;
    const fee=sealed?0:challengePenalty(quote);
    assert.equal(a.credits,buyerBefore-quote-fee);assert.equal(a.knowledge[itemId]!.genuine,true);
    assert(b.credits>=sellerBefore+fee,'the penalty goes to the appraiser');
    assert.equal(a.inventory.includes('seal-1'),sealed && false,'spent seal is gone');if(sealed)assert.equal(s.items['seal-1']!.owner,'removed');
  }
});
test('challenge needs a real claim, enough credits for the worst case, and a seal only with a challenge',()=>{
  const {state,itemId}=table(true,true);
  state.listings[state.listings.length-1]!.claims={};
  assert.throws(()=>act(state,'alice',{type:'propose',sellerId:'bob',itemId,credits:0,challenge:'genuine'}),/ท้าทาย/);
  const t=table(true,true);assert.throws(()=>act(t.state,'alice',{type:'propose',sellerId:'bob',itemId:t.itemId,credits:0,sealId:'owned-orb'}),/ตราโมฆะ/);
  const poor=table(true,true);poor.state.players[0]!.credits=1;assert.throws(()=>act(poor.state,'alice',{type:'propose',sellerId:'bob',itemId:poor.itemId,credits:0,challenge:'genuine'}),/เครดิตไม่พอ/);
});
test('claims can be made without inspecting, only on listed shop items, and are visible to buyers; opt-in config and messages',()=>{
  const state=appraisalFixture('E47');state.phase='TRADE';const bob=state.players[1]!;const itemId=bob.stock[0]!;
  assert.equal(bob.knowledge[itemId]?.genuine,undefined);
  const s=act(state,'bob',{type:'share',itemId,allow:true,purchase:true,claims:{genuine:true,cursed:false}});
  assert.deepEqual(appraisalViewFor(s,'alice').listings.find(l=>l.itemId===itemId)!.claims,{genuine:true,cursed:false});
  assert.throws(()=>act(state,'alice',{type:'share',itemId:'owned-mirror',allow:true,purchase:true,claims:{genuine:true}}));
  const legacy=appraisalFixture('E47');delete legacy.config.challenge;legacy.phase='TRADE';
  assert.throws(()=>act(legacy,'bob',{type:'share',itemId:legacy.players[1]!.stock[0]!,allow:true,purchase:true,claims:{genuine:true}}));
  for(const npc of Object.keys({orc:1,vampire:1,autometa:1,alien:1,darkone:1,beast:1}) as NpcId[]) assert(merchantKinds(npc,3).every(k=>k!=='doubt-lens' && k!=='void-seal'));
  assert(ITEM_SPECS['void-seal'].consumable && !ITEM_SPECS['doubt-lens'].consumable);
  const msg={type:'action',matchId:'m1',action:{type:'propose',requestId:'r1',encounter:1,sellerId:'b',itemId:'i',credits:0,challenge:'cursed',sealId:'s'}};
  assert.deepEqual(parseAppraisalMessage(msg),msg);
  assert.throws(()=>parseAppraisalMessage({...msg,action:{...msg.action,challenge:'base'}}));
  const share={type:'action',matchId:'m1',action:{type:'share',requestId:'r2',encounter:1,itemId:'i',allow:true,purchase:true,claims:{genuine:true}}};
  assert.deepEqual(parseAppraisalMessage(share),share);assert.throws(()=>parseAppraisalMessage({...share,action:{...share.action,claims:{base:1}}}));
});
