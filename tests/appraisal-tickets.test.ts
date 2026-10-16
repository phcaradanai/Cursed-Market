import test from 'node:test';
import assert from 'node:assert/strict';
import { applyAppraisalAction, assertAppraisalInvariants, BROKERAGE_RULES, createAppraisalRun } from '../src/game/appraisal/index.js';
import { settleAuction } from '../src/game/appraisal/brokerage.js';
import { npcQuote, purchase } from '../src/game/appraisal/mechanics.js';
import { TRUST_RULES } from '../src/game/appraisal/pulse.js';
import type { AppraisalAction, AppraisalState, NpcId } from '../src/game/appraisal/types.js';
import { appraisalFixture } from './support/appraisal-fixture.js';

type Body=AppraisalAction extends infer A?A extends AppraisalAction?Omit<A,'playerId'|'requestId'|'encounter'>:never:never;
let request=0;
const act=(s:AppraisalState,body:Body,id='alice')=>applyAppraisalAction(s,{...body,playerId:id,requestId:`tickets-${++request}`,encounter:s.encounter} as AppraisalAction);

test('being caught lowballing costs trust with that merchant, never below 0',()=>{
  let caught=0;
  for(let n=0;n<60 && caught<2;n++){
    const s=appraisalFixture('E18',2);s.seed=`caught-${n}`;const p=s.players[0]!;p.npcTrust={orc:2};
    const after=act(s,{type:'appraise',itemId:p.stock[0]!,value:1,acceptDanger:true}).players[0]!;
    if(after.valuations[p.stock[0]!]!.caught){
      caught++;assert.equal(after.npcTrust!.orc,2-TRUST_RULES.caughtLoss);
      assert(after.notes.some(note=>note.includes('ความไว้ใจ') && note.includes('ลด')));
    }else assert.equal(after.npcTrust!.orc,2,'an honest-looking appraisal keeps its trust');
  }
  assert(caught>0,'some seed must catch the lowball');
  for(let n=0;n<60;n++){
    const s=appraisalFixture('E18',2);s.seed=`caught0-${n}`;const p=s.players[0]!;p.npcTrust={};
    const after=act(s,{type:'appraise',itemId:p.stock[0]!,value:1,acceptDanger:true}).players[0]!;
    assert((after.npcTrust!.orc??0)>=0);
  }
});

/** Bob buys goods that others appraised: alice and cara appraise, then each item is bought straight from their shops. */
function shops(npcs:NpcId[]):{s:AppraisalState;ids:Array<{shop:number;id:string}>} {
  let s=appraisalFixture('E18',3);const ids:Array<{shop:number;id:string}>=[];
  for(const shop of [0,0,2]){
    const seat=s.players[shop]!;const id=seat.stock.find(item=>!seat.valuations[item])!;
    s=act(s,{type:'appraise',itemId:id,value:20,acceptDanger:true},seat.id);ids.push({shop,id});
  }
  ids.forEach(({id},index)=>{s.items[id]!.npc=npcs[index]!;});
  return {s,ids};
}
const buy=(s:AppraisalState,shop:number,id:string)=>{purchase(s,s.players[1]!,s.players[shop]!,[id]);};

test('three purchases in a row of one merchant\'s goods appraised by others earn trust with it',()=>{
  const {s,ids}=shops(['orc','orc','orc']);const bob=s.players[1]!;const trust0=bob.npcTrust!.orc??0;
  buy(s,ids[0]!.shop,ids[0]!.id);assert.deepEqual(bob.buyLog,['orc']);buy(s,ids[1]!.shop,ids[1]!.id);assert.deepEqual(bob.buyLog,['orc','orc']);
  assert.equal(bob.npcTrust!.orc??0,trust0);
  buy(s,ids[2]!.shop,ids[2]!.id);
  assert.equal(bob.npcTrust!.orc,trust0+TRUST_RULES.repeatBuyTrust);assert.equal(bob.buyLog,undefined,'the stack clears after paying');
  assert(bob.notes.some(note=>note.includes('ครบ 3 ครั้งติด')));assertAppraisalInvariants(s);
});

test('buying a different merchant\'s goods breaks the run, and buying your own appraised goods does not count',()=>{
  const {s,ids}=shops(['orc','vampire','orc']);const bob=s.players[1]!;
  buy(s,ids[0]!.shop,ids[0]!.id);buy(s,ids[1]!.shop,ids[1]!.id);
  assert.deepEqual(bob.buyLog,['orc','vampire']);
  buy(s,ids[2]!.shop,ids[2]!.id);assert.deepEqual(bob.buyLog,['orc','vampire','orc'],'the stack shows the last three merchants');assert.equal(bob.npcTrust!.orc??0,0);

  const own=shops(['orc','orc','orc']);const alice=own.s.players[0]!;
  purchase(own.s,alice,alice,[own.ids[0]!.id]);assert.equal(alice.buyLog,undefined,'appraising and buying your own goods earns no run');
});

function withVault():AppraisalState {
  const s=createAppraisalRun(['alice','bob'],'tickets',{marketProbability:0,catalogVersion:2,brokerage:BROKERAGE_RULES});
  const id='vault-item';
  s.items[id]={id,kind:'mirror',base:20,genuine:true,cursed:false,ask:20,owner:'dark-market',npcOwnerId:'alice',npc:'orc',encounter:1,certificate:true,lastAppraisal:null,lastAccepted:null,reservation:1};
  s.vault=[id];s.market.lots=[{id:'lot-1',itemId:id,minimum:10,bids:{alice:30,bob:25}}];
  return s;
}
test('winning a Dark Market auction earns one dark order ticket, losing earns none',()=>{
  const s=withVault();settleAuction(s);
  assert.equal(s.players[0]!.darkTickets,1);assert.equal(s.players[1]!.darkTickets,undefined);
  assert(s.players[0]!.notes.some(note=>note.includes('ตั๋วคำสั่งมืด 1/3')));assertAppraisalInvariants(s);
});

/** Alice shares an appraised item for viewing only; bob holds the tickets. */
function forceTable(tickets:number=TRUST_RULES.ticketsToForce,purchaseAllowed=false):{s:AppraisalState;id:string} {
  let s=appraisalFixture('E18',3);const alice=s.players[0]!;const id=alice.stock[0]!;
  s=act(s,{type:'appraise',itemId:id,value:20,acceptDanger:true});
  s.phase='TRADE';s=act(s,{type:'share',itemId:id,allow:true,purchase:purchaseAllowed});
  s.players[1]!.darkTickets=tickets;return {s,id};
}
test('three tickets force a sale at the appraised price: no answer, no haggling, the owner still earns',()=>{
  const {s:before,id}=forceTable();const quote=npcQuote(before.players[0]!,before.items[id]!);
  const aliceCredits=before.players[0]!.credits,bobCredits=before.players[1]!.credits;
  const s=act(before,{type:'force-buy',sellerId:'alice',itemId:id},'bob');
  assert.equal(s.items[id]!.owner,'bob');assert(s.players[1]!.inventory.includes(id));assert(!s.players[0]!.stock.includes(id));
  assert.equal(s.players[1]!.darkTickets,0);
  assert.equal(s.players[1]!.credits,bobCredits-quote,'the buyer pays only the appraised price');
  assert.equal(s.players[0]!.credits,aliceCredits+Math.floor(quote/10),'the owner gets the usual commission and nothing else');
  assert(s.players[0]!.notes.some(note=>note.includes('บังคับซื้อ')));
  assert(!s.listings.some(l=>l.itemId===id));assertAppraisalInvariants(s);
});

test('forcing needs 3 tickets, a shared and appraised shop item, and the trade phase',()=>{
  const few=forceTable(2);assert.throws(()=>act(few.s,{type:'force-buy',sellerId:'alice',itemId:few.id},'bob'),/ตั๋วคำสั่งมืด/);
  const open=forceTable(3,true);const s=act(open.s,{type:'force-buy',sellerId:'alice',itemId:open.id},'bob');
  assert.equal(s.items[open.id]!.owner,'bob','a listing open for offers can be forced too');
  const unshared=forceTable();unshared.s.listings=[];assert.throws(()=>act(unshared.s,{type:'force-buy',sellerId:'alice',itemId:unshared.id},'bob'),/ยังไม่เปิด/);
  const early=forceTable();early.s.phase='APPRAISAL';assert.throws(()=>act(early.s,{type:'force-buy',sellerId:'alice',itemId:early.id},'bob'),/ช่วงต่อรอง/);
  assert.throws(()=>act(forceTable().s,{type:'force-buy',sellerId:'bob',itemId:'x'},'bob'));
});
