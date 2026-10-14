import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {writeFileSync} from 'node:fs';
const dir='docs/validation/survival-v0.5';
const historical=[
  'docs/simulation/engine-v0.1/example-match.json',
  ...['0.2','0.3'].map(v=>`docs/validation/appraisal-delivery-v0.4/compatibility/legacy-${v}-raw.json`),
  'docs/simulation/appraisal-delivery-v0.4/example-run.json',
  'docs/simulation/appraisal-catalog-v0.4/example-run.json',
];
const current=['timed','untimed'].flatMap(mode=>[2,3,4].map(n=>`${dir}/network/lan-${mode}-${n}-players.json`));
const checks=[];
for(const path of [...historical,'docs/simulation/survival-v0.5/example-3-collector.json',...current]){
  const output=JSON.parse(execFileSync(process.execPath,['dist/src/simulation/replay.js',path],{encoding:'utf8'}));
  assert.equal(output.phase,'RESULTS');checks.push({path,phase:output.phase,rulesVersion:output.rulesVersion??null});
}
const reports=[...[2,3,4].map(n=>`docs/validation/appraisal-timers-v0.4/network/lan-untimed-${n}-players.json`),...current];
const report=JSON.parse(execFileSync(process.execPath,['dist/src/playtest/run.js',...reports],{encoding:'utf8'}));
assert.equal(report.matches.length,9);assert.equal(report.humanFunValidated,false);
assert.equal(report.matches.filter(m=>m.rulesVersion==='0.5-survival-experimental').length,6);
writeFileSync(`${dir}/mixed-report.json`,JSON.stringify(report,null,2)+'\n');
writeFileSync(`${dir}/cli-check.json`,JSON.stringify({replayChecks:checks,mixedReports:9,humanFunValidated:false},null,2)+'\n');
console.log(`${checks.length} historical/current CLI replays and 9 mixed v4/v5 reports passed.`);
