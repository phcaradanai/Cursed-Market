import test from 'node:test';
import assert from 'node:assert/strict';
import {applyAppraisalAction,createAppraisalRun,appraisalViewFor} from '../src/game/appraisal/index.js';
import {recordJournal} from '../src/game/appraisal/journal.js';

test('ledger keeps every accepted choice and its visible effects across rounds',()=>{
  let state=createAppraisalRun(['alice','bob'],'ledger-test',{marketProbability:0});
  for(const player of state.players)player.eventOffer=null;
  const portal=state.players[0]!.portals[0]!;
  state=applyAppraisalAction(state,{type:'enter',portalId:portal.id,playerId:'alice',requestId:'ledger-enter',encounter:1});
  assert.equal(state.players[0]!.journal?.at(-1)?.action,'เลือกพบพ่อค้า');
  assert.equal(appraisalViewFor(state,'alice').self.journal?.length,2);
  assert.equal(appraisalViewFor(state,'bob').self.journal?.length??0,1);
  for(let index=0;index<40;index++) {
    const before=structuredClone(state);state.revision++;
    state.players[0]!.credits++;
    state.players[0]!.notes.push(`รางวัลครั้งที่ ${index+1}`);
    state.players[0]!.notes=state.players[0]!.notes.slice(-30);
    recordJournal(before,state,{type:'advance'});
  }
  const journal=appraisalViewFor(state,'alice').self.journal!;
  assert.equal(journal.length,42);
  assert.equal(journal.at(-1)?.cause,'รางวัลครั้งที่ 40');
  assert.deepEqual(journal.at(-1)?.changes,['เครดิต +1']);
});
