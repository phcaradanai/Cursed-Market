import test from 'node:test';
import assert from 'node:assert/strict';
import {createAppraisalRun,appraisalViewFor} from '../src/game/appraisal/index.js';
import {handleStorageAction,payVaultInterest} from '../src/game/appraisal/secure-storage.js';
function table(){const s=createAppraisalRun(['alice','bob'],'aged-vault',{secureEconomy:true});s.phase='REVEAL';const p=s.players[0]!;p.credits=1000;p.roundReward={encounter:s.encounter,base:10,amount:10,flips:0,settled:true};return {s,p}}
function reveal(t:ReturnType<typeof table>){t.s.phase='REVEAL';t.p.roundReward={encounter:t.s.encounter,base:10,amount:10,flips:0,settled:true}}
function advance(t:ReturnType<typeof table>){t.s.encounter++;t.s.phase='PORTALS';payVaultInterest(t.s)}
function deposit(t:ReturnType<typeof table>,amount:number){handleStorageAction(t.s,t.p,{type:'vault-deposit-credits',amount})}
function withdraw(t:ReturnType<typeof table>,amount:number){handleStorageAction(t.s,t.p,{type:'vault-withdraw-credits',amount})}
test('fresh deposit matures only after a complete encounter, pays 10 percent to wallet once',()=>{
 const t=table();deposit(t,100);advance(t);assert.equal(t.p.credits,900);assert.equal(appraisalViewFor(t.s,t.p.id).self.personalVault!.nextInterest,10);
 advance(t);assert.equal(t.p.credits,910);assert.equal(t.p.personalVault!.credits,100);payVaultInterest(t.s);assert.equal(t.p.credits,910);
 assert.equal(t.s.trace.filter(x=>x.type==='vault-interest').length,1);
});
test('new topup does not increase mature interest; withdrawals spend new money first',()=>{
 const t=table();deposit(t,100);advance(t);reveal(t);deposit(t,50);assert.equal(appraisalViewFor(t.s,t.p.id).self.personalVault!.nextInterest,10);withdraw(t,30);advance(t);assert.equal(t.p.credits,890);assert.equal(t.p.personalVault!.credits,120);
});
test('withdrawal of old principal reduces entitlement; redeposit cannot restore it',()=>{
 const t=table();deposit(t,100);advance(t);reveal(t);withdraw(t,60);deposit(t,60);assert.equal(appraisalViewFor(t.s,t.p.id).self.personalVault!.nextInterest,4);advance(t);assert.equal(t.p.credits,904);
});
test('floor aggregate eligible principal and do not compound wallet interest automatically',()=>{
 const t=table();deposit(t,19);advance(t);advance(t);assert.equal(t.p.credits,982);advance(t);assert.equal(t.p.credits,983);assert.equal(t.p.personalVault!.credits,19);
});
test('legacy balance without age evidence starts fresh and cannot claim retroactive interest',()=>{
 const t=table();t.p.personalVault={items:[],credits:100,slots:2};const before=t.p.credits;advance(t);assert.equal(t.p.credits,before);advance(t);assert.equal(t.p.credits,before+10);
});
test('bank shortage cannot be retried in the same encounter to claim a second payment',()=>{
 const t=table();deposit(t,100);advance(t);t.s.bank=3;t.s.market.budget=0;t.s.reservedRewards=0;advance(t);assert.equal(t.p.credits,903);t.s.bank=100;payVaultInterest(t.s);assert.equal(t.p.credits,903);
});
test('age metadata stays private and invalid principal is rejected',async()=>{
 const {secureStorageInvariants}=await import('../src/game/appraisal/secure-storage.js');
 const t=table();deposit(t,100);advance(t);const view=appraisalViewFor(t.s,t.p.id);
 assert.equal('interest' in view.self.personalVault!,false);t.p.personalVault!.interest!.principal=101;
 assert.throws(()=>secureStorageInvariants(t.s),/อายุเงินต้น/);
});
test('historical configs keep whole-balance 4 percent without age metadata',()=>{
 const t=table();delete t.s.config.vaultInterestRules;deposit(t,100);advance(t);assert.equal(t.p.credits,904);assert.equal(t.p.personalVault!.interest,undefined);
});
test('large safe-integer principal uses exact integer tenth; dead seats earn nothing',async()=>{
 const {vaultInterestOf}=await import('../src/game/appraisal/secure-storage.js');assert.equal(vaultInterestOf(Number.MAX_SAFE_INTEGER),900719925474099);
 const t=table();deposit(t,100);advance(t);t.p.paused='dead';t.p.life=0;advance(t);assert.equal(t.p.credits,900);
});

test('real phase advances mature deposits once and the complete command audit replays',async()=>{
 const {applyAppraisalAction,advanceAppraisalEncounter}=await import('../src/game/appraisal/engine.js');const {exportAppraisalAudit,replayAppraisalAudit}=await import('../src/game/appraisal/audit.js');
 let s=createAppraisalRun(['alice','bob'],'comic-aged-interest-replay',{secureEconomy:true,startingCredits:200,encounters:5,marketProbability:0}),seq=0;
 const act=(id:string,body:Record<string,unknown>)=>{const action={...body,playerId:id,encounter:s.encounter,requestId:`aged-${seq++}`} as Parameters<typeof applyAppraisalAction>[1];s=applyAppraisalAction(s,action);return action;};
 const finish=()=>{for(let steps=0;s.phase!=='REVEAL'&&steps<12;steps++){const p=s.players.find(p=>!p.done&&!p.paused)!;act(p.id,{type:'done'});}assert.equal(s.phase,'REVEAL');for(const p of s.players)if(!p.roundReward!.settled)act(p.id,{type:'round-bank'});};
 finish();const deposit=act('alice',{type:'vault-deposit-credits',amount:100});let before=s.players[0]!.credits;s=advanceAppraisalEncounter(s);assert.equal(s.players[0]!.credits,before);
 finish();before=s.players[0]!.credits;s=advanceAppraisalEncounter(s);assert.equal(s.players[0]!.credits,before+10);assert.equal(s.players[0]!.personalVault!.credits,100);
 assert.equal(applyAppraisalAction(s,deposit),s,'accepted retry cannot deposit or pay again');for(let round=0;s.phase!=='RESULTS'&&round<6;round++){finish();s=advanceAppraisalEncounter(s);}assert.equal(s.phase,'RESULTS');assert.deepEqual(replayAppraisalAudit(exportAppraisalAudit(s)),s);
});

test('vault without a deposit explains the active rule; historical DTO still reports four percent',async()=>{
 const {createElement}=await import('react');const {renderToStaticMarkup}=await import('react-dom/server');const {VaultPanel}=await import('../src/appraisal-client/SecureEconomy.js');
 const t=table();delete t.p.personalVault;let view=appraisalViewFor(t.s,t.p.id);assert.match(renderToStaticMarkup(createElement(VaultPanel,{game:view,submit:()=>undefined,disabled:false})),/ดอกเบี้ย 10%/);
 delete t.s.config.vaultInterestRules;view=appraisalViewFor(t.s,t.p.id);assert.match(renderToStaticMarkup(createElement(VaultPanel,{game:view,submit:()=>undefined,disabled:false})),/ดอกเบี้ย 4%/);
});
