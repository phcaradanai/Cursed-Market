import { writeInvocationReceipt } from './run-receipt.mjs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..'), args = process.argv.slice(2), value = (key, fallback) => { const i = args.indexOf(key); return i < 0 ? fallback : args[i + 1]; };
const mode = value('--mode', 'compare');
if (!['record', 'compare', 'smoke'].includes(mode))
    throw Error('mode must be record, compare or smoke');
const space = value('--space', null), baseUrl = value('--url', 'http://127.0.0.1:5174');
const script = `const t=await taskSpace(${space ? Number(space) : JSON.stringify('UI consistency ' + new Date().toISOString())});console.log({spaceId:t.spaceId});const {run}=await import(${JSON.stringify(pathToFileURL(path.join(repo, mode === 'smoke' ? 'scripts/ui/menu-smoke.mjs' : 'scripts/ui/browser-suite.mjs')).href)});await run({task:t,page:t.page('p1'),repo:${JSON.stringify(repo)},baseUrl:${JSON.stringify(baseUrl)},mode:${JSON.stringify(mode)}});${space ? '' : 'await t.finish({keep:[]});'}`;
const startedAt=new Date().toISOString();
const result = spawnSync('ego-browser', ['nodejs', '-e', script], { stdio: 'inherit' });
writeInvocationReceipt({repo,mode,space,baseUrl,startedAt,result});
if (result.error)
    throw result.error;
process.exitCode = result.status ?? 1;
