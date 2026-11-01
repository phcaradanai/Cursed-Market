// Bounded paired smoke experiment, not a release balance or win-share claim.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import crypto from 'node:crypto';import {execFileSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
import {simulateAppraisalRun} from '../dist/src/simulation/appraisal.js';
import {SURVIVAL_RULES} from '../dist/src/game/appraisal/survival.js';
const root=fileURLToPath(new URL('../../..',import.meta.url)),out=path.resolve(process.argv[2]??'/tmp/new56-pilot-experiment');fs.mkdirSync(out,{recursive:true});
const approved=JSON.parse(fs.readFileSync(path.join(root,'docs/game-design/new56-pilot-proposal.json')));assert.equal(approved.status,'approved-experimental-pilot');
const cases=[];for(const count of [2,3])for(const policy of ['cautious','trader'])for(const catalogVersion of [3,4]){
 const seed='pilot-paired-0',config={catalogVersion,encounters:3,secureEconomy:true,core2:true,survival:SURVIVAL_RULES,collectorDeadline:3},started=Date.now();
 const audit=simulateAppraisalRun(count,policy,seed,config);assert.equal(audit.collector?.length,count);assert(audit.commands.length<1500);
 const file=`catalog${catalogVersion}-${count}-${policy}.json`,bytes=JSON.stringify(audit,null,2)+'\n';fs.writeFileSync(path.join(out,file),bytes);
 cases.push({count,policy,seed,catalogVersion,config:audit.config,commands:audit.commands.length,ms:Date.now()-started,audit:file,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),final:audit.final});
}
const report={asOf:new Date().toISOString(),observedRevision:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),scope:'8 paired survival runs, 2/3 seats, 2 policies, one seed, Collector at3; each strict replayed by simulator. No statistical balance claim.',cases};fs.writeFileSync(path.join(out,'experiment.json'),JSON.stringify(report,null,2)+'\n');console.log('PASS:8 bounded paired survival runs + strict replays, Collector settled');
