import test from 'node:test';
import assert from 'node:assert/strict';
import { applyAppraisalAction, assertAppraisalInvariants, SURVIVAL_RULES } from '../src/game/appraisal/index.js';
import { grant, maxLifeOf, mendWithShards, recoveryAmount, recoveryOffer } from '../src/game/appraisal/mechanics.js';
import { lifeDealTerms, merchantWary, PULSE_RULES, shardsPerSale } from '../src/game/appraisal/pulse.js';
import type { AppraisalAction, AppraisalState, NpcId } from '../src/game/appraisal/types.js';
import { appraisalFixture } from './support/appraisal-fixture.js';

type Body=AppraisalAction extends infer A?A extends AppraisalAction?Omit<A,'playerId'|'requestId'|'encounter'>:never:never;
let request=0;
const act=(s:AppraisalState,body:Body,id='alice')=>applyAppraisalAction(s,{...body,playerId:id,requestId:`pulse-${++request}`,encounter:s.encounter} as AppraisalAction);

/** Alice has appraised both of her shop items and listed them for purchase; three seats so a new partner exists. */
function market(life=3):AppraisalState {
  let s=appraisalFixture('E18',3);
  s.config.survival=SURVIVAL_RULES;s.version=5;
  for(const p of s.players){p.life=life;p.recoveryUsed=false;}
  for(const itemId of s.players[0]!.stock)s=act(s,{type:'appraise',itemId,value:20,acceptDanger:true});
  s.phase='TRADE';
  for(const itemId of s.players[0]!.stock)s=act(s,{type:'share',itemId,allow:true,purchase:true});
  return s;
}
/** Jump to a later encounter, carrying the merchants' stock along with it. */
function later(s:AppraisalState,encounter:number):AppraisalState {
  s.encounter=encounter;
  for(const item of Object.values(s.items))if(item.owner.startsWith('npc:')){item.owner=item.owner.replace(/:\d+$/,`:${encounter}`);item.encounter=encounter;}
  return s;
}
function sell(s:AppraisalState,itemId:string,buyer:string):AppraisalState {
  s=act(s,{type:'propose',sellerId:'alice',itemId,credits:5},buyer);
  return act(s,{type:'respond',offerId:s.trades.at(-1)!.id,accept:true});
}

test('a sale to another seat pays 1 pulse shard, and 3 shards mend 1 life',()=>{
  let s=market();const alice=()=>s.players[0]!;
  s=sell(s,alice().stock[0]!,'bob');
  assert.equal(alice().pulseShards,1);assert.equal(alice().life,3,'one shard is not enough');
  assert(alice().notes.some(n=>n.includes('เศษชีพจร +1')));
  assert(s.trace.some(t=>t.type==='pulse-shards' && t.playerId==='alice' && t.details.gained===1));
  alice().pulseShards=2;s=sell(s,alice().stock[0]!,'cara');
  assert.equal(alice().life,4);assert.equal(alice().pulseShards,0,'the third shard mends 1 life');
  assertAppraisalInvariants(s);
});

test('buying your own appraised goods from the merchant pays no shards',()=>{
  let s=market();s.phase='APPRAISAL';const itemId=s.players[0]!.stock[0]!;
  s=act(s,{type:'buy',itemIds:[itemId],condition:false});
  assert.equal(s.players[0]!.pulseShards,undefined);assert.equal(s.players[0]!.life,3);
});

test('full life banks shards, the bank is capped, and the next missing life is mended from it',()=>{
  const s=market(6);const p=s.players[0]!;
  p.pulseShards=3;mendWithShards(s,p);assert.equal(p.life,6);assert.equal(p.pulseShards,3,'full life keeps the shards');
  p.life=5;mendWithShards(s,p);assert.equal(p.life,6);assert.equal(p.pulseShards,0);
  p.pulseShards=9;mendWithShards(s,p);assert.equal(p.pulseShards,PULSE_RULES.bankCap);
  p.life=0;p.pulseShards=3;mendWithShards(s,p);assert.equal(p.life,0,'the dead do not mend');
});

test('merchants grow wary after more than 3 encounters of trading with one partner only',()=>{
  const s=market();const p=s.players[0]!;
  assert.equal(merchantWary(p,9),false,'no trades yet');
  p.tradeLink={partner:'bob',since:1};
  assert.equal(merchantWary(p,3),false,'encounters 1-3 are three encounters');
  assert.equal(merchantWary(p,4),true,'the fourth encounter is more than three');
  assert.equal(shardsPerSale(p,3),1);assert.equal(shardsPerSale(p,4),0);
});

test('a wary appraiser earns no shard and the merchant says so; a new partner restores it',()=>{
  const wary=market();wary.players[0]!.tradeLink={partner:'bob',since:1};later(wary,4);
  const same=sell(wary,wary.players[0]!.stock[0]!,'bob');
  assert.equal(same.players[0]!.pulseShards,0);assert.equal(same.players[0]!.life,3);
  assert(same.players[0]!.notes.some(n=>n.includes('พ่อค้าเริ่มสงสัย')));
  assert.deepEqual(same.players[0]!.tradeLink,{partner:'bob',since:1});

  const fresh=market();fresh.players[0]!.tradeLink={partner:'bob',since:1};later(fresh,4);
  fresh.players[0]!.pulseShards=2;
  const other=sell(fresh,fresh.players[0]!.stock[0]!,'cara');
  assert.equal(other.players[0]!.life,4,'selling to someone new pays a shard again');
  assert.deepEqual(other.players[0]!.tradeLink,{partner:'cara',since:4});
  assert(!other.players[0]!.notes.some(n=>n.includes('พ่อค้าเริ่มสงสัย')));
});

test('life deals follow trust: none at 0, then 3/5/7 credits for 0-1, 1-2 and 2-3 life',()=>{
  assert.equal(lifeDealTerms(0),undefined);
  assert.deepEqual(lifeDealTerms(1),{credits:3,min:0,max:1});
  assert.deepEqual(lifeDealTerms(2),{credits:5,min:1,max:2});
  assert.deepEqual(lifeDealTerms(3),{credits:7,min:2,max:3});
  assert.deepEqual(lifeDealTerms(10),lifeDealTerms(3));
  const s=market();const p=s.players[0]!;p.selectedPortalId=p.portals[0]!.id;p.portals[0]!.npc='orc';
  p.npcTrust={};assert.equal(recoveryOffer(s,p),undefined);
  const expected=[[1,3,0,1],[2,5,1,2],[3,7,2,3],[10,7,2,3]] as const;
  for(const [trust,credits,min,amount] of expected){p.npcTrust={orc:trust};assert.deepEqual(recoveryOffer(s,p),{target:'life',credits,min,amount});}
  p.npcTrust={orc:1};grant(s,p,'D16');assert.equal(recoveryOffer(s,p)!.credits,5,'wallet surcharges still apply on top');
});

test('energy merchants keep their flat deal whatever the trust',()=>{
  const s=market();const p=s.players[0]!;p.selectedPortalId=p.portals[0]!.id;
  for(const npc of ['vampire','autometa','alien','swarm'] as NpcId[]){p.portals[0]!.npc=npc;p.npcTrust={};assert.deepEqual(recoveryOffer(s,p),{target:'energy',credits:2,amount:3});}
});

test('the rolled life covers the whole range, is fixed for the encounter and stays in bounds',()=>{
  const s=market();const p=s.players[0]!;p.selectedPortalId=p.portals[0]!.id;p.portals[0]!.npc='orc';
  for(const [trust,min,max] of [[1,0,1],[2,1,2],[3,2,3]] as const){
    p.npcTrust={orc:trust};const offer=recoveryOffer(s,p)!;const seen=new Set<number>();
    for(let n=0;n<80;n++){s.seed=`roll-${trust}-${n}`;const amount=recoveryAmount(s,p,offer);assert.equal(recoveryAmount(s,p,offer),amount);seen.add(amount);}
    assert.deepEqual([...seen].sort(),Array.from({length:max-min+1},(_,i)=>min+i),`trust ${trust} rolls ${min}-${max}`);
  }
});

test('a deal that rolls 0 still costs the credits and uses the encounter\'s deal',()=>{
  let s=market();const p=s.players[0]!;s.phase='APPRAISAL';p.selectedPortalId=p.portals[0]!.id;p.portals[0]!.npc='orc';p.npcTrust={orc:1};
  const offer=recoveryOffer(s,p)!;
  for(let n=0;n<200;n++){s.seed=`zero-${n}`;if(recoveryAmount(s,p,offer)===0)break;}
  assert.equal(recoveryAmount(s,p,offer),0);
  const credits=p.credits,life=p.life!;
  s=act(s,{type:'recover-resource',target:'life'});
  assert.equal(s.players[0]!.credits,credits-3);assert.equal(s.players[0]!.life,life);assert.equal(s.players[0]!.recoveryUsed,true);
  assert.throws(()=>act(s,{type:'recover-resource',target:'life'}));
  assert(s.players[0]!.notes.some(n=>n.includes('ได้ฟื้น 0')));
  assert.equal(maxLifeOf(s,s.players[0]!),SURVIVAL_RULES.maxLife);
  assertAppraisalInvariants(s);
});
