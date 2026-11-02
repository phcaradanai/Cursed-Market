import fs from 'node:fs';import crypto from 'node:crypto';import path from 'node:path';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';import {execFileSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..'),dir=path.join(root,'docs/game-design'),read=f=>JSON.parse(fs.readFileSync(path.join(dir,f),'utf8'));
const d=read('system-atlas/data.json'),g=read('system-atlas/graph.json'),base=read('logic-item-graph.json');
assert.equal(d.provenance.sourceRoot,'apps/comic/src','Atlas must extract active Comic, not root baseline');
assert(d.provenance.sourceFiles.every(f=>f.file.startsWith('apps/comic/src/')),'Mixed root runtime source scope');
assert.equal(d.configs.find(c=>c.key==='theftTimeoutRules')?.default,1,'Missing active forced RPS default');
const appraisalFiles=fs.readdirSync(path.join(root,'apps/comic/src/game/appraisal')).filter(f=>f.endsWith('.ts')).map(f=>'apps/comic/src/game/appraisal/'+f).sort();
assert.deepEqual(d.provenance.sourceFiles.map(f=>f.file).filter(f=>f.startsWith('apps/comic/src/game/appraisal/')).sort(),appraisalFiles,'Missing active appraisal module');
assert(d.provenance.sourceFiles.some(f=>f.file==='apps/comic/src/simulation/appraisal.ts'),'Bot actions must be extracted, not merely fingerprinted');
for(const row of [...d.symbols,...d.schemas])assert(row.source.file.startsWith('apps/comic/src/'),'Historical symbol leaked into active AST');
for(const id of ['ghost-start','ghost-guess','ghost-hire','ghost-accept','ghost-rps','ghost-deliver'])assert(d.actions.some(a=>a.id===id),id+' action absent');
assert(d.codeRelations.some(e=>e.kind==='code-call'&&e.source.endsWith('engine.ts:applyAppraisalAction')&&e.target.endsWith('ghost-service.ts:handleGhostAction')),'Ghost handler detached from active engine');
assert(d.codeRelations.some(e=>e.kind==='code-call'&&e.source.endsWith('appraisal-rooms.ts:AppraisalRoomService.afterChange')&&e.target.endsWith('appraisal.ts:appraisalBotTurn')),'Active bot dependency absent');
for(const name of ['GhostAction','GhostState','GhostJob'])assert(d.schemas.some(s=>s.name===name));
const rps=d.confirmedRules.find(r=>r.id==='forced-rps');assert.equal(rps.state,'implemented-new-runs/legacy-versioned');assert(rps.runtime.newRuns.includes('missing hands only'));assert.equal(d.timers.APPRAISAL_DUEL_MS.value,30000);
assert(!g.nodes.some(n=>n.id.startsWith('code:src/')),'Root runtime nodes leaked into active graph');
assert(!g.edges.some(e=>e.source==='rule:forced-rps'&&e.kind==='runtime-gap'));assert(g.edges.some(e=>e.source==='rule:forced-rps'&&e.kind==='rule-runtime'));
const legacy=read('legacy-atlas-baseline.json');assert.equal(legacy.gitRevision,'9f0a972');assert(legacy.sourceFiles.some(f=>f.file.startsWith('src/')));
for(const m of d.encounterModels)assert(m.functionNames.every(name=>d.symbols.some(s=>s.name===name)),'Unresolved encounter function '+m.id);
const approved=read('new56-pilot-approval.json');assert.equal(approved.status,'approved-experimental-pilot');assert.equal(g.nodes.filter(n=>n.kind==='item'&&n.pilot?.status===approved.status).length,8);
for(const output of legacy.outputHashes){const blob=execFileSync('git',['show',legacy.gitRevision+':'+output.file],{cwd:root,maxBuffer:16*1024*1024});assert.equal(crypto.createHash('sha256').update(blob).digest('hex'),output.sha256,'Historical Atlas lost: '+output.file);}

assert.deepEqual(d.events.map(e=>e.id),Array.from({length:132},(_,i)=>'E'+String(i+1).padStart(2,'0')));
assert.equal(d.statuses.length,51);assert.equal(d.omens.filter(o=>o.pack==='polish').length,7);assert.equal(d.omens.filter(o=>o.pack==='core2').length,15);
assert.equal(new Set(g.nodes.map(n=>n.id)).size,g.nodes.length);const ids=new Set(g.nodes.map(n=>n.id));assert(g.edges.every(e=>ids.has(e.source)&&ids.has(e.target)));
assert.deepEqual(g.nodes.filter(n=>n.kind==='item').map(n=>n.id),base.nodes.filter(n=>n.kind==='item').map(n=>n.id));assert.equal(d.productScope.runtimeDedicatedBindings,d.productScope.registeredNewItemIds.length);assert.equal(d.productScope.runtimeDedicatedBindings,read('new56-readiness.json').summary.newIdsInRuntime);
for(const id of ['vault-deposit-credits','loan-repay','seal-pick','theft-hand'])assert(d.actions.some(a=>a.id===id));
assert(d.choices.some(c=>c.eventId==='E15'&&c.key==='price'));assert(d.choices.some(c=>c.eventId==='E126'&&c.payload?.gamble));
assert.equal(d.profiles.find(p=>p.id==='server-entry-merged').values.core2,true);assert.equal(d.configs.find(c=>c.key==='core2').defaultPresent,false);
assert.equal(d.confirmedRules.find(r=>r.id==='aged-interest').confirmed.rate,10);assert.equal(d.confirmedRules.find(r=>r.id==='aged-interest').runtime.rate,10);
assert(g.nodes.some(n=>n.id==='effect:E01'));assert(g.nodes.some(n=>n.id==='event:E01'));
for(const e of d.events){assert(e.handlerRefs.length>0);assert(e.choiceRefs.every(id=>ids.has(id)));assert(e.sourceDefinitions.length>0)}
assert(d.legacyTargetGates.length>0);assert(d.dynamicOperations.length>0);assert(d.logSites.length>0);assert(d.validations.length>0);
const html=fs.readFileSync(path.join(dir,'logic-item-relations.html'),'utf8');for(const id of ['system-atlas-data','data','graph-data','matrix-view'])assert(html.includes('id="'+id+'"'));assert.equal((html.match(/<!-- SYSTEM-ATLAS-START -->/g)??[]).length,1);
const flow=read('screen-flow.json');
if(flow.merchantExpressionRules?.status==='implemented-S02-S04-verified')assert(/<summary>กฎท่าทางพ่อค้า[^<]+S02\/S04 เชื่อมและตรวจแล้ว/.test(html),'Merchant expression summary still claims pending implementation');
const status=read('game-status.json');assert.equal(status.activeSource,'apps/comic');assert(html.includes('id="game-status"')&&html.includes(status.headline));
for(const row of status.systems){assert(html.includes(row.remaining));for(const file of row.evidence)assert(fs.existsSync(path.join(root,file)),'Missing status evidence '+file);}
const vaultRate=file=>Number(fs.readFileSync(path.join(root,file),'utf8').match(/VAULT_INTEREST_PERCENT=(\d+)/)?.[1]);
assert.equal(status.runtimeFacts.comicVaultInterestPercent,vaultRate('apps/comic/src/game/appraisal/secure-storage.ts'));
assert.equal(status.runtimeFacts.rootVaultInterestPercent,vaultRate('src/game/appraisal/secure-storage.ts'));
assert.equal(status.runtimeFacts.new56DedicatedBindings,d.productScope.runtimeDedicatedBindings);
const collectorApproval=read('collector-wishlist-approval.json');assert.equal(collectorApproval.status,'approved-experimental');assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,collectorApproval.proposal))).digest('hex'),collectorApproval.proposalSha256,'Approved Collector spec changed');
const publicProof=read('../validation/pilot-public-2026-11-02/public-effects.json');assert(publicProof.passed&&publicProof.cases.length===8,'Public pilot evidence incomplete');
for(const [file,hash] of Object.entries({...publicProof.sourceFingerprints,...publicProof.compiledFingerprints}))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex'),hash,'Public pilot proof stale: '+file);
for(const c of publicProof.cases){assert(c.passed&&c.audits.length===2);for(const a of c.audits)assert(a.strictReplay&&crypto.createHash('sha256').update(fs.readFileSync(path.join(dir,'../validation/pilot-public-2026-11-02',a.file))).digest('hex')===a.sha256,'Public pilot audit changed: '+a.file);}
execFileSync(process.execPath,['docs/game-design/scripts/build-system-atlas.mjs','--check'],{cwd:root,stdio:'inherit'});
console.log('PASS: catalog coverage, namespaces, new56-only products, source guards, rule gaps, generic actions, profiles, original views and freshness.');
