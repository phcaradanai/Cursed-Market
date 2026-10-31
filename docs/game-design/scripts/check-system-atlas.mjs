import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';import {execFileSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..'),dir=path.join(root,'docs/game-design'),read=f=>JSON.parse(fs.readFileSync(path.join(dir,f),'utf8'));
const d=read('system-atlas/data.json'),g=read('system-atlas/graph.json'),base=read('logic-item-graph.json');
assert.deepEqual(d.events.map(e=>e.id),Array.from({length:132},(_,i)=>'E'+String(i+1).padStart(2,'0')));
assert.equal(d.statuses.length,51);assert.equal(d.omens.filter(o=>o.pack==='polish').length,7);assert.equal(d.omens.filter(o=>o.pack==='core2').length,15);
assert.equal(new Set(g.nodes.map(n=>n.id)).size,g.nodes.length);const ids=new Set(g.nodes.map(n=>n.id));assert(g.edges.every(e=>ids.has(e.source)&&ids.has(e.target)));
assert.deepEqual(g.nodes.filter(n=>n.kind==='item').map(n=>n.id),base.nodes.filter(n=>n.kind==='item').map(n=>n.id));assert.equal(d.productScope.runtimeDedicatedBindings,0);
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
execFileSync(process.execPath,['docs/game-design/scripts/build-system-atlas.mjs','--check'],{cwd:root,stdio:'inherit'});
console.log('PASS: catalog coverage, namespaces, new56-only products, source guards, rule gaps, generic actions, profiles, original views and freshness.');
