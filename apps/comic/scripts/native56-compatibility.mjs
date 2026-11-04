// Bounded rollout evidence; registered catalog coverage is not primary-effect or balance completion.
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';import {gzipSync,gunzipSync} from 'node:zlib';import {fileURLToPath} from 'node:url';
import {replayAppraisalAudit} from '../dist/src/game/appraisal/index.js';
const root=fileURLToPath(new URL('../../..',import.meta.url)),script=fileURLToPath(import.meta.url);
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
if(process.argv[2]==='--replay'){
 const a=JSON.parse(gunzipSync(fs.readFileSync(process.argv[3])));const state=replayAppraisalAudit(a);assert.equal(state.phase,'RESULTS');console.log(JSON.stringify({seed:a.seed,commands:a.commands.length,replay:true}));
}else{
 const out=path.resolve(process.argv[2]??path.join(root,'docs/validation/recovery-quote-2026-11-04/compatibility'));fs.mkdirSync(out,{recursive:true});
 const oldDir=path.join(root,'docs/validation/normal-score-baseline-2026-11-04'),old=JSON.parse(fs.readFileSync(path.join(oldDir,'report.json')));
 assert(old.passed&&old.completed===32);assert.equal(old.config.startingCredits,40);assert.equal(old.config.survival.maxLife,6);assert.equal(old.config.collectorDeadline,15);
 const catalog=JSON.parse(fs.readFileSync(path.join(root,'apps/comic/src/appraisal-client/public/art/comic/items/merchant-set-v1/catalog.json'))),kinds=new Set(catalog.merchants.flatMap(m=>m.items.map(i=>i.id)));assert.equal(kinds.size,56);
 const sources=['apps/comic/scripts/native56-compatibility.mjs','apps/comic/scripts/normal-play-probe.mjs','apps/comic/src/server/appraisal-main.ts','apps/comic/src/simulation/appraisal.ts','apps/comic/src/appraisal-client/model.ts',...fs.readdirSync(path.join(root,'apps/comic/src/game/appraisal')).filter(f=>f.endsWith('.ts')).map(f=>'apps/comic/src/game/appraisal/'+f),...fs.readdirSync(path.join(root,'apps/comic/src/shared')).filter(f=>f.endsWith('.ts')).map(f=>'apps/comic/src/shared/'+f)];
 const sourceFingerprints=Object.fromEntries(sources.map(f=>[f,hash(fs.readFileSync(path.join(root,f)))]));
 const config={...old.config,catalogVersion:5,native56Effects:3,recoveryQuoteRules:1},report={startedAt:new Date().toISOString(),baseRevision:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),scope:'32sealed historical catalog4 audits replayed, plus4new catalog5/recoveryQuoteRules1 diagnostic games at40credits/6life/deadline15,2/4seats,cautious/collector,one fixed seed. Remaining35 owner bindings are still absent. Not release balance, multiplayer sockets, all56effect exposure or whole-game completion.',sourceFingerprints,config,legacy:[],cases:[],passed:false};
 const save=()=>fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2)+'\n');save();
 for(const c of old.cases){
  const file=path.join(oldDir,c.audit),bytes=fs.readFileSync(file);assert.equal(hash(bytes),c.auditSha256);assert.equal(hash(gunzipSync(bytes)),c.uncompressedSha256);
  const replay=JSON.parse(execFileSync(process.execPath,[script,'--replay',file],{cwd:root,encoding:'utf8',timeout:20000,maxBuffer:1024*1024}));assert.equal(replay.seed,c.seed);assert.equal(replay.commands,c.commands);
  report.legacy.push({id:c.id,audit:c.audit,sha256:c.auditSha256,...replay});save();
 }
 console.log('PASS32 sealed legacy audits strict replay');
 for(const count of [2,4])for(const policy of ['cautious','collector']){
  const id=`${count}-${policy}`,rawFile=path.join(out,id+'.audit.json'),c={count,policy,seed:'native56-rollout-0',config,output:rawFile};
  execFileSync(process.execPath,[path.join(root,'apps/comic/scripts/normal-play-probe.mjs'),'--case',JSON.stringify(c)],{cwd:root,encoding:'utf8',timeout:20000,maxBuffer:1024*1024});
  const raw=fs.readFileSync(rawFile),a=JSON.parse(raw);assert.deepEqual(a.config,config);assert.equal(a.collector.length,count);assert(Object.values(a.items).every(i=>kinds.has(i.kind)),'Old kind entered catalog5');
  for(const p of a.final)assert.equal(p.credits,40+a.ledger.filter(l=>l.to===p.id).reduce((n,l)=>n+l.amount,0)-a.ledger.filter(l=>l.from===p.id).reduce((n,l)=>n+l.amount,0));
  const compressed=gzipSync(raw),archive=id+'.audit.json.gz';fs.writeFileSync(path.join(out,archive),compressed);fs.unlinkSync(rawFile);
  report.cases.push({id,count,policy,seed:c.seed,commands:a.commands.length,audit:archive,sha256:hash(compressed),rawSha256:hash(raw),strictReplay:true,itemKinds:[...new Set(Object.values(a.items).map(i=>i.kind))].sort(),walletLedger:true,final:a.final});save();console.log('PASS '+id+' RESULTS/replay/new56-only/wallet ledger');
 }
 for(const [f,sha]of Object.entries(sourceFingerprints))assert.equal(hash(fs.readFileSync(path.join(root,f))),sha,'Source changed during proof: '+f);
 assert.equal(report.legacy.length,32);assert.equal(report.cases.length,4);report.passed=true;report.finishedAt=new Date().toISOString();save();
}
