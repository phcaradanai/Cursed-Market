import test from 'node:test';
import assert from 'node:assert/strict';
import {appraisalFixture} from './support/appraisal-fixture.js';
import {handleGhostAction,ghostView,ghostQuotes} from '../src/game/appraisal/ghost-service.js';
test('paid spirit delivery credits only living buyer achievements, leaving ghost bonus unchanged',async()=>{
 const {personalScoreFor}=await import('../src/game/appraisal/personal-scoring.js');
 const s=appraisalFixture();s.config.survival={maxLife:6,encounterLifeCost:1,entryEnergyCost:0};s.config.personalScoringRules=1;s.personalPerformance={version:1,facts:[]};s.players[0]!.life=0;s.players[0]!.paused='dead';
 handleGhostAction(s,'alice',{type:'ghost-start'});const g=s.ghosts!.alice!;handleGhostAction(s,'alice',{type:'ghost-guess',round:g.round,position:g.tracking!.answer});
 handleGhostAction(s,'bob',{type:'ghost-hire',ghostId:'alice',choice:0,fee:3,quoteId:ghostQuotes(s,'alice','bob')[0]!.id});const j=g.jobs[0]!;handleGhostAction(s,'alice',{type:'ghost-accept',jobId:j.id,accept:true});g.slots[0]!.kind=j.kind;
 handleGhostAction(s,'alice',{type:'ghost-deliver',jobId:j.id,slot:0});
 assert.equal(personalScoreFor(s,'bob').metrics.find(m=>m.id==='bought')!.points,2);assert.equal(personalScoreFor(s,'alice').metrics.find(m=>m.id==='soldQuantity')!.points,0);assert.equal(g.bonus,Math.floor(j.base*.1)+3);
});
test('living cannot start ghost game; dead can retry and view never contains answer',()=>{
 const s=appraisalFixture();s.config.survival={maxLife:6,encounterLifeCost:1,entryEnergyCost:0};
 assert.throws(()=>handleGhostAction(s,'alice',{type:'ghost-start'}));
 s.players[0]!.life=0;s.players[0]!.paused='dead';
 handleGhostAction(s,'alice',{type:'ghost-start'});
 assert(!JSON.stringify(ghostView(s,'alice')).includes('answer'));
 const g=s.ghosts!.alice!;handleGhostAction(s,'alice',{type:'ghost-guess',round:g.round,position:g.tracking!.answer});
 assert.equal(g.available,true);
 assert.throws(()=>handleGhostAction(s,'alice',{type:'ghost-guess',round:g.round,position:0}));
});

test('delivery waits for funds then charges once, grants one item and bonus; duplicate is rejected',()=>{
 const s=appraisalFixture();s.config.survival={maxLife:6,encounterLifeCost:1,entryEnergyCost:0};s.players[0]!.life=0;s.players[0]!.paused='dead';
 handleGhostAction(s,'alice',{type:'ghost-start'});const g=s.ghosts!.alice!;
 handleGhostAction(s,'alice',{type:'ghost-guess',round:g.round,position:g.tracking!.answer});
 handleGhostAction(s,'bob',{type:'ghost-hire',ghostId:'alice',choice:0,fee:3,quoteId:ghostQuotes(s,'alice','bob')[0]!.id});const j=g.jobs[0]!;
 handleGhostAction(s,'alice',{type:'ghost-accept',jobId:j.id,accept:true});g.slots[0]!.kind=j.kind;
 const buyer=s.players[1]!,credits=buyer.credits;buyer.credits=0;
 assert.throws(()=>handleGhostAction(s,'alice',{type:'ghost-deliver',jobId:j.id,slot:0}),/เติมเครดิต/);assert.equal(j.status,'accepted');
 buyer.credits=credits;const count=buyer.inventory.length;
 handleGhostAction(s,'alice',{type:'ghost-deliver',jobId:j.id,slot:0});
 assert.equal(buyer.credits,credits-j.price-j.fee);assert.equal(buyer.inventory.length,count+1);assert.equal(buyer.paid?.[buyer.inventory.at(-1)!],j.price+j.fee);if(s.config.secureEconomy)assert.equal(s.items[buyer.inventory.at(-1)!]!.lastTradePrice,j.price);assert.equal(g.bonus,Math.floor(j.base*.1)+3);assert.equal(g.available,false);
 assert.throws(()=>handleGhostAction(s,'alice',{type:'ghost-deliver',jobId:j.id,slot:0}));
});

test('engine integrates ghost actions with idempotency and conservation',async()=>{
 const {createAppraisalRun,applyAppraisalAction,assertAppraisalInvariants}=await import('../src/game/appraisal/engine.js');
 let s=createAppraisalRun(['alice','bob'],'ghost-integration',{survival:{maxLife:6,encounterLifeCost:1,entryEnergyCost:0},marketProbability:0});
 s.players[0]!.life=0;s.players[0]!.paused='dead';s.players[0]!.done=true;
 let n=0;const act=(id:string,a:import('../src/game/appraisal/ghost-service.js').GhostAction)=>{s=applyAppraisalAction(s,{...a,playerId:id,encounter:s.encounter,requestId:`ghost-${n++}`});};
 act('alice',{type:'ghost-start'});const round=s.ghosts!.alice!.round;
 act('alice',{type:'ghost-guess',round,position:s.ghosts!.alice!.tracking!.answer});
 const q=ghostView(s,'bob').services[0]!.quotes[0]!;
 s.players[1]!.credits>=q.price?act('bob',{type:'ghost-hire',ghostId:'alice',choice:0,fee:0,quoteId:ghostQuotes(s,'alice','bob')[0]!.id}):assert.throws(()=>act('bob',{type:'ghost-hire',ghostId:'alice',choice:0,fee:0,quoteId:ghostQuotes(s,'alice','bob')[0]!.id}));
 const last=s.commands.at(-1)!;if(last.type!=='advance')assert.equal(applyAppraisalAction(s,last),s);
 assertAppraisalInvariants(s);
 assert.throws(()=>act('alice',{type:'ghost-guess',round:round-1,position:0}));
});

test('Collector adds earned ghost bonus and cancels unfinished jobs without payment',async()=>{
 const {createAppraisalRun}=await import('../src/game/appraisal/engine.js');const {collectRun}=await import('../src/game/appraisal/survival.js');
 const s=createAppraisalRun(['alice','bob'],'ghost-final',{survival:{maxLife:6,encounterLifeCost:1,entryEnergyCost:0},marketProbability:0});
 s.players[0]!.life=0;s.players[0]!.paused='dead';handleGhostAction(s,'alice',{type:'ghost-start'});const g=s.ghosts!.alice!;
 handleGhostAction(s,'alice',{type:'ghost-guess',round:g.round,position:g.tracking!.answer});g.bonus=7;
 const kind=g.slots[0]!.kind;g.jobs.push({id:'pending',buyerId:'bob',kind,base:20,price:20,fee:0,status:'accepted'});
 s.players[1]!.life=0;s.players[1]!.paused='dead';const credits=s.players[1]!.credits;
 collectRun(s);assert.equal(g.jobs[0]!.status,'cancelled');assert.equal(s.players[1]!.credits,credits);assert.equal(s.collector!.find(r=>r.playerId==='alice')!.score,s.players[0]!.credits+7);
});

test('buyer death cancels unpaid work and requires a new minigame',async()=>{
 const {reconcileGhostJobs}=await import('../src/game/appraisal/ghost-service.js');
 const s=appraisalFixture();s.config.survival={maxLife:6,encounterLifeCost:1,entryEnergyCost:0};s.players[0]!.life=0;s.players[0]!.paused='dead';
 handleGhostAction(s,'alice',{type:'ghost-start'});const g=s.ghosts!.alice!;handleGhostAction(s,'alice',{type:'ghost-guess',round:g.round,position:g.tracking!.answer});
 handleGhostAction(s,'bob',{type:'ghost-hire',ghostId:'alice',choice:0,fee:0,quoteId:ghostQuotes(s,'alice','bob')[0]!.id});const credits=s.players[1]!.credits;s.players[1]!.life=0;
 reconcileGhostJobs(s);assert.equal(g.jobs[0]!.status,'cancelled');assert.equal(g.available,false);assert.equal(g.bonus,0);assert.equal(s.players[1]!.credits,credits);
 handleGhostAction(s,'alice',{type:'ghost-start'});assert.equal(g.tracking!.status,'guessing');
});

test('next-encounter slot preview equals the slots used by the next action and hides item truth',()=>{
 const s=appraisalFixture();s.config.survival={maxLife:6,encounterLifeCost:1,entryEnergyCost:0};s.players[0]!.life=0;s.players[0]!.paused='dead';
 handleGhostAction(s,'alice',{type:'ghost-start'});const g=s.ghosts!.alice!;handleGhostAction(s,'alice',{type:'ghost-guess',round:g.round,position:g.tracking!.answer});
 handleGhostAction(s,'bob',{type:'ghost-hire',ghostId:'alice',choice:0,fee:0,quoteId:ghostQuotes(s,'alice','bob')[0]!.id});handleGhostAction(s,'alice',{type:'ghost-accept',jobId:g.jobs[0]!.id,accept:true});
 g.slots.forEach(slot=>slot.lost=true);s.encounter++;
 const before=structuredClone(g),view=ghostView(s,'alice');assert.equal(view.self!.encounter,s.encounter);assert(view.self!.slots.every(slot=>!slot.lost));assert.deepEqual(g,before,'view must not mutate runtime');
 const slot=view.self!.slots[0]!.kind;handleGhostAction(s,'alice',{type:'ghost-rps',slot:1,hand:'rock'});assert.equal(g.slots[0]!.kind,slot);
 const buyer=JSON.stringify(ghostView(s,'bob'));for(const secret of ['"base"','"answer"','"genuine"','"cursed"','"prototype"'])assert(!buyer.includes(secret),secret);
});

test('RPS ties retry, losses lock each slot independently, no minigame reset until next encounter',async()=>{
 const {randomAt}=await import('../src/game/random.js');
 const s=appraisalFixture();s.config.survival={maxLife:6,encounterLifeCost:1,entryEnergyCost:0};s.players[0]!.life=0;s.players[0]!.paused='dead';
 handleGhostAction(s,'alice',{type:'ghost-start'});const g=s.ghosts!.alice!;handleGhostAction(s,'alice',{type:'ghost-guess',round:g.round,position:g.tracking!.answer});handleGhostAction(s,'bob',{type:'ghost-hire',ghostId:'alice',choice:0,fee:0,quoteId:ghostQuotes(s,'alice','bob')[0]!.id});handleGhostAction(s,'alice',{type:'ghost-accept',jobId:g.jobs[0]!.id,accept:true});
 const hands=['rock','paper','scissors'] as const,opponent=()=>Math.floor(randomAt(s.seed,`ghost:alice:${g.round}:${g.draws}`)*3);
 handleGhostAction(s,'alice',{type:'ghost-rps',slot:0,hand:hands[opponent()]!});assert.equal(g.lastRps!.result,'tie');assert(!g.slots[0]!.lost);
 for(let slot=0;slot<3;slot++)handleGhostAction(s,'alice',{type:'ghost-rps',slot,hand:hands[(opponent()+2)%3]!});
 assert(g.slots.every(slot=>slot.lost));assert.throws(()=>handleGhostAction(s,'alice',{type:'ghost-rps',slot:0,hand:'rock'}));assert.throws(()=>handleGhostAction(s,'alice',{type:'ghost-start'}));
 s.encounter++;handleGhostAction(s,'alice',{type:'ghost-rps',slot:0,hand:'rock'});assert(g.slots.slice(1).every(slot=>!slot.lost));
});

test('living phase advances while a ghost is still tracking cards',async()=>{
 const {createAppraisalRun,applyAppraisalAction}=await import('../src/game/appraisal/engine.js');let s=createAppraisalRun(['alice','bob'],'ghost-independent',{survival:{maxLife:6,encounterLifeCost:1,entryEnergyCost:0},marketProbability:0});
 Object.assign(s.players[0]!,{life:0,paused:'dead',done:true,eventOffer:null});
 s=applyAppraisalAction(s,{type:'ghost-start',playerId:'alice',requestId:'independent-start',encounter:s.encounter});const phase=s.phase,round=s.ghosts!.alice!.round;
 s=applyAppraisalAction(s,{type:'done',playerId:'bob',requestId:'independent-done',encounter:s.encounter});
 assert.notEqual(s.phase,phase);assert.equal(s.ghosts!.alice!.round,round);assert.equal(s.ghosts!.alice!.tracking!.status,'guessing');
});

test('status estimate adds spirit earnings once after ordinary score modifiers',async()=>{
 const {createAppraisalRun}=await import('../src/game/appraisal/engine.js');const {appraisalViewFor}=await import('../src/game/appraisal/views.js');const {collectorEstimate}=await import('../src/appraisal-client/model.js');
 const s=createAppraisalRun(['alice','bob'],'ghost-estimate',{survival:{maxLife:6,encounterLifeCost:1,entryEnergyCost:0}});Object.assign(s.players[0]!,{life:0,paused:'dead',done:true});handleGhostAction(s,'alice',{type:'ghost-start'});
 const {grant}=await import('../src/game/appraisal/mechanics.js');grant(s,s.players[0]!,'B10');const before=collectorEstimate(appraisalViewFor(s,'alice'));s.ghosts!.alice!.bonus=7;const after=collectorEstimate(appraisalViewFor(s,'alice'));assert.equal(after.min,before.min+7);assert.equal(after.max,before.max+7);assert.equal(after.unpriced,before.unpriced);
});

test('multiple buyers share a service batch; declining the last offer after a delivery relocks hiring',()=>{
 const s=appraisalFixture('E18',3);s.config.survival={maxLife:6,encounterLifeCost:1,entryEnergyCost:0};Object.assign(s.players[0]!,{life:0,paused:'dead'});
 handleGhostAction(s,'alice',{type:'ghost-start'});const g=s.ghosts!.alice!;handleGhostAction(s,'alice',{type:'ghost-guess',round:g.round,position:g.tracking!.answer});
 handleGhostAction(s,'bob',{type:'ghost-hire',ghostId:'alice',choice:0,fee:0,quoteId:ghostQuotes(s,'alice','bob')[0]!.id});assert.throws(()=>handleGhostAction(s,'bob',{type:'ghost-hire',ghostId:'alice',choice:1,fee:0,quoteId:ghostQuotes(s,'alice','bob')[1]!.id}));handleGhostAction(s,'cara',{type:'ghost-hire',ghostId:'alice',choice:0,fee:0,quoteId:ghostQuotes(s,'alice','cara')[0]!.id});
 const job=g.jobs[0]!;handleGhostAction(s,'alice',{type:'ghost-accept',jobId:job.id,accept:true});g.slots[0]!.kind=job.kind;handleGhostAction(s,'alice',{type:'ghost-deliver',jobId:job.id,slot:0});assert(g.available,'another offer is pending');
 handleGhostAction(s,'alice',{type:'ghost-accept',jobId:g.jobs[1]!.id,accept:false});assert.equal(g.available,false);handleGhostAction(s,'alice',{type:'ghost-start'});assert.equal(g.round,2);
});

test('a stale or forged displayed quote cannot create a differently priced contract',()=>{
 const s=appraisalFixture();s.config.survival={maxLife:6,encounterLifeCost:1,entryEnergyCost:0};Object.assign(s.players[0]!,{life:0,paused:'dead'});
 handleGhostAction(s,'alice',{type:'ghost-start'});const g=s.ghosts!.alice!;handleGhostAction(s,'alice',{type:'ghost-guess',round:g.round,position:g.tracking!.answer});
 const quote:any=ghostView(s,'bob').services[0]!.quotes[0]!,before=s.players[1]!.credits;
 assert.throws(()=>handleGhostAction(s,'bob',{type:'ghost-hire',ghostId:'alice',choice:0,fee:0,quoteId:'stale'} as any));
 assert.equal(g.jobs.length,0);assert.equal(s.players[1]!.credits,before);
 assert(quote.id);handleGhostAction(s,'bob',{type:'ghost-hire',ghostId:'alice',choice:0,fee:0,quoteId:quote.id} as any);assert.equal(g.jobs[0]!.price,quote.price);
});

test('quotes apply rarity once on a private clone and delivery keeps the accepted prototype',async()=>{
 const {defaultRarityEconomy}=await import('../src/shared/rarity-power.js');const s=appraisalFixture();s.config.survival={maxLife:6,encounterLifeCost:1,entryEnergyCost:0};s.config.rarityEconomy=defaultRarityEconomy();Object.assign(s.players[0]!,{life:0,paused:'dead'});s.players[1]!.credits=200;
 for(const item of Object.values(s.items)){item.base=20;item.appearance={version:1,rarity:'uncommon',theme:'inferno',visualSeed:123};delete item.rarityPower;}
 handleGhostAction(s,'alice',{type:'ghost-start'});const g=s.ghosts!.alice!;handleGhostAction(s,'alice',{type:'ghost-guess',round:g.round,position:g.tracking!.answer});
 const originals=structuredClone(s.items),q=ghostQuotes(s,'alice','bob')[0]!;assert.equal(q.base,40);assert.deepEqual(s.items,originals,'quote calculation must be read-only');
 handleGhostAction(s,'bob',{type:'ghost-hire',ghostId:'alice',choice:0,quoteId:q.id,fee:0});const j=g.jobs[0]!;handleGhostAction(s,'alice',{type:'ghost-accept',jobId:j.id,accept:true});
 const source=Object.values(s.items).find(i=>i.kind===j.kind)!;source.base=999;source.appearance!.theme='void';g.slots[0]!.kind=j.kind;handleGhostAction(s,'alice',{type:'ghost-deliver',jobId:j.id,slot:0});
 const delivered=s.items[s.players[1]!.inventory.at(-1)!]!;assert.equal(delivered.base,40);assert.deepEqual(delivered.appearance,q.prototype.appearance);assert.deepEqual(delivered.rarityPower,q.prototype.rarityPower);assert.equal(g.bonus,4);
});
