import {execFileSync} from 'node:child_process';
import {writeFileSync} from 'node:fs';
const dir='docs/validation/appraisal-catalog-v0.4';
const old=['docs/simulation/engine-v0.1/example-match.json',...['0.2','0.3'].map(v=>`docs/validation/appraisal-delivery-v0.4/compatibility/legacy-${v}-raw.json`),'docs/simulation/appraisal-delivery-v0.4/example-run.json'];
const newer=['docs/simulation/appraisal-catalog-v0.4/example-run.json',`${dir}/network/lan-4-players.json`];
const checks=[];
for(const path of [...old,...newer]){const output=JSON.parse(execFileSync(process.execPath,['dist/src/simulation/replay.js',path],{encoding:'utf8'}));if(output.phase!=='RESULTS')throw new Error('Incomplete replay');checks.push({path,phase:output.phase});}
const reportPaths=[...[2,3,4].map(n=>`docs/validation/appraisal-delivery-v0.4/network/lan-${n}-players.json`),...[2,3,4].map(n=>`${dir}/network/lan-${n}-players.json`)];
const report=execFileSync(process.execPath,['dist/src/playtest/run.js',...reportPaths],{encoding:'utf8'});writeFileSync(`${dir}/mixed-report.json`,report);
writeFileSync(`${dir}/cli-check.json`,JSON.stringify({replayChecks:checks,mixedReports:JSON.parse(report).matches.length,humanFunValidated:false},null,2)+'\n');
console.log('6 old/new CLI replays and 6 mixed room reports passed; old evidence preserved.');
