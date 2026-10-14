import {writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {simulateAppraisalRun,APPRAISAL_POLICIES} from '../../../dist/src/simulation/appraisal.js';
import {SURVIVAL_RULES} from '../../../dist/src/game/appraisal/index.js';
const dir='docs/simulation/survival-v0.5';mkdirSync(dir,{recursive:true});
const cases=[];
for(const count of [2,3,4])for(const policy of APPRAISAL_POLICIES){
  const runs=[];
  for(let n=0;n<10;n++){
    const seed=`survival-v0.5:${count}:${policy}:${n}`;
    const audit=simulateAppraisalRun(count,policy,seed,{survival:SURVIVAL_RULES});
    if(audit.schemaVersion!==5 || !audit.final.every(p=>p.life===0) || audit.collector?.length!==count)throw new Error('Survival end condition failed');
    const encounters=Math.max(...audit.history.map(h=>h.encounter));
    runs.push({seed,encounters,commands:audit.commands.length,sha256:createHash('sha256').update(JSON.stringify(audit)).digest('hex'),scores:audit.final.map(p=>p.score),deaths:audit.trace.filter(t=>t.type==='death').length,recoveryDeals:audit.ledger.filter(row=>row.reason==='recovery-deal').length});
    if(n===0)writeFileSync(`${dir}/example-${count}-${policy}.json`,JSON.stringify(audit,null,2)+'\n');
  }
  cases.push({count,policy,runs});
  console.log(`${count} seats / ${policy}: 10 completed seeded runs, strict replay`);
}
writeFileSync(`${dir}/summary.json`,JSON.stringify({checkedAt:new Date().toISOString(),rulesVersion:'0.5',runs:120,strictReplay:true,humanFunValidated:false,cases},null,2)+'\n');
