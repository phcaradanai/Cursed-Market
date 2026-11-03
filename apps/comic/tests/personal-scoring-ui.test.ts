import test from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createAppraisalRun} from '../src/game/appraisal/engine.js';
import {appraisalViewFor} from '../src/game/appraisal/views.js';
import {recordPersonalActivity,calculatePersonalScore} from '../src/game/appraisal/personal-scoring.js';
import {collectRun} from '../src/game/appraisal/survival.js';
import {previewRooms} from '../src/appraisal-client/comic-preview-data.js';
import {ScoreMetric} from '../src/appraisal-client/PersonalScoreResults.js';
import {GameTable,SurvivalResults} from '../src/appraisal-client/App.js';
import {collectorEstimate} from '../src/appraisal-client/model.js';

const fixture=()=>createAppraisalRun(['alice','bob'],'score-visibility',{personalScoringRules:1,catalogVersion:4,survival:{maxLife:6,encounterLifeCost:1,entryEnergyCost:0}});
test('live Status projection uses known assets, hides appraisal truth and source receipts, and leaves noflag DTO unchanged',()=>{
 const s=fixture(),p=s.players[0]!,item=s.items[p.portals[0]!.stock[0]!]!;item.owner=p.id;p.inventory=[item.id];
 recordPersonalActivity(s,p,'soldQuantity',2,'visible-sale');
 const before=appraisalViewFor(s,p.id),projection=(before.self as unknown as Record<string,unknown>).personalScoreEstimate;
 assert(projection,'server known-fact score estimate missing');assert.deepEqual(collectorEstimate(before),projection);
 recordPersonalActivity(s,p,'accurateAppraisal',1,'hidden-accuracy');item.base+=100;item.genuine=!item.genuine;item.cursed=!item.cursed;
 const after=appraisalViewFor(s,p.id);assert.deepEqual((after.self as unknown as Record<string,unknown>).personalScoreEstimate,projection);
 const json=JSON.stringify(after);assert(!json.includes('hidden-accuracy'));assert(!json.includes('sourceIds'));assert(!json.includes('eligibleKey'));assert(!json.includes('personalPerformance'));
 const old=createAppraisalRun(['a','b'],'legacy-view');assert(!('personalScoreEstimate'in appraisalViewFor(old,'a').self));
 s.encounter=s.config.collectorDeadline??15;collectRun(s);const end=appraisalViewFor(s,p.id);assert.deepEqual((end.self as unknown as Record<string,unknown>).personalScore,s.collector![0]!.personalScore);
});
for(const count of [2,4])test(`Comic results show ${count} fixed player columns, nine stages, server totals and paged metrics without dropdowns`,()=>{
 const room=structuredClone(previewRooms.inspection!),game=room.game!;game.phase='RESULTS';
 game.collector=Array.from({length:count},(_,i)=>{
  const id=`score-seat-${i}`,facts=[['bought',3],['soldQuantity',4],['soldGrossCredits',90],['trustGained',6]].map(([metric,raw],n)=>({id:`${i}-${n}`,playerId:id,metric:metric as 'bought',raw:raw as number,eligibleKey:`origin-${n}`,eligible:true,cause:'settled'}));
  const score=calculatePersonalScore({playerId:id,facts:i===0?facts:[],assetScore:i===0?100:130,modifierPercent:i===0?20:0,ghostBonus:i===0?0:11,rarities:[]});
  return {playerId:id,credits:100,itemValue:0,modifierPercent:i===0?20:0,score:score.total,statusIds:[],items:[],personalScore:score};
 });
 room.matchSeats=room.matchSeats.slice(0,1).flatMap(seat=>game.collector!.map((r,i)=>({...seat,id:r.playerId,name:`Player ${i+1}`})));
 const html=renderToStaticMarkup(createElement(SurvivalResults,{room,send:()=>true,disabled:false}));
 assert(html.includes('personal-score-results'));assert.equal((html.match(/class="personal-score-player"/g)??[]).length,count);assert(html.includes('data-stage-count="9"'));assert(html.includes('183'));assert(html.includes('141'));assert(html.includes('จำนวนที่ขาย'));for(const metric of game.collector![0]!.personalScore!.metrics){const detail=renderToStaticMarkup(createElement(ScoreMetric,{metric}));assert(detail.includes('ดิบ'));assert(detail.includes('เข้าเกณฑ์'));assert(detail.includes('เพดาน'));if(metric.id==='soldGrossCredits')assert(detail.includes('เครดิตจากการขาย'));if(metric.id==='trustGained')assert(detail.includes('ความไว้ใจสะสม'));}assert(html.includes('ดิบ'));assert(html.includes('เข้าเกณฑ์'));assert(html.includes('เพดาน'));assert(!html.includes('<details'));assert(!html.includes('table-scroll'));game.self.personalScore=game.collector![0]!.personalScore!;const table=renderToStaticMarkup(createElement(GameTable,{room,submit:()=>{},send:()=>true,disabled:false}));for(const id of ['bag','effects','market','ledger','rules'])assert(table.includes(`data-drawer="${id}"`),`missing end utility ${id}`);const bag=renderToStaticMarkup(createElement(GameTable,{room,submit:()=>{},send:()=>true,disabled:false,initialDrawer:'bag'}));assert(bag.includes('id="drawer-bag"'));assert(bag.includes('Your bag')||bag.includes('กระเป๋าของคุณ')); // Dialog opening is an effect, verified by the browser suite.

});
test('historical noflag survival results retain original fallback',()=>{
 const room=structuredClone(previewRooms.inspection!);room.game!.phase='RESULTS';room.game!.collector=[];
 const html=renderToStaticMarkup(createElement(SurvivalResults,{room,send:()=>true,disabled:false}));assert(html.includes('table-scroll'));assert(!html.includes('personal-score-results'));
});

test('personal result labels state every tied rank and the applied modifier percentage',()=>{
 const room=structuredClone(previewRooms.inspection!);room.game!.phase='RESULTS';
 room.game!.collector=['a','b','c','d'].map((playerId,i)=>{const personalScore=calculatePersonalScore({playerId,facts:[],assetScore:i<2?100:50,modifierPercent:-20,ghostBonus:0,rarities:[]});return {playerId,credits:i<2?100:50,itemValue:0,modifierPercent:-20,statusIds:['D10' as const],score:personalScore.total,items:[],personalScore};});
 const html=renderToStaticMarkup(createElement(SurvivalResults,{room,send:()=>true,disabled:false}));assert.equal((html.match(/class="personal-score-rank"/g)??[]).length,4);assert(html.includes('อันดับ 1'));assert(html.includes('อันดับ 3'));assert(!html.includes('อันดับ 2'));assert(html.includes('-20%'));assert(html.includes('D10'));
});
test('actual unaged-loan exclusion is accessible with its specific reason',()=>{
 const score=calculatePersonalScore({playerId:'a',facts:[{id:'loan',playerId:'a',metric:'loanRepaid',raw:1,eligibleKey:'pair',eligible:false,cause:'loan did not span a full encounter'}],assetScore:0,modifierPercent:0,ghostBonus:0,rarities:[]});
 const html=renderToStaticMarkup(createElement(ScoreMetric,{metric:score.metrics.find(m=>m.id==='loanRepaid')!}));assert(html.includes('เงินกู้ยังไม่อยู่ครบช่วง'));
});
test('negative result preview has one consistent score and modifier across graph, self, roster and status',async()=>{
 const {personalScorePreview}=await import('../src/appraisal-client/personal-score-preview-data.js');const room=personalScorePreview['score-neg']!,g=room.game!,own=g.collector!.find(row=>row.playerId===g.self.id)!;
 assert.equal(g.self.personalScore!.total,own.score);assert.equal(g.self.score,own.score);for(const row of g.collector!){assert.equal(g.players.find(p=>p.id===row.playerId)!.score,row.score);assert(row.statusIds.includes('D10'));assert.equal(row.modifierPercent,-20);}
});
test('negative result explicitly displays the applied D10 percentage independently of rank',()=>{
 const room=structuredClone(previewRooms.inspection!);room.game!.phase='RESULTS';const playerId=room.game!.self.id,personalScore=calculatePersonalScore({playerId,facts:[],assetScore:100,modifierPercent:-20,ghostBonus:0,rarities:[]});room.game!.collector=[{playerId,credits:100,itemValue:0,modifierPercent:-20,statusIds:['D10'],score:80,items:[],personalScore}];
 const html=renderToStaticMarkup(createElement(SurvivalResults,{room,send:()=>true,disabled:false}));assert(html.includes('-20%'));assert(html.includes('D10'));assert(html.includes('กระหายโลหิต'));
});
