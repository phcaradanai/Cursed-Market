import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
const root = path.resolve(import.meta.dirname, '../..'), app = path.join(root, 'apps/comic'), doc = path.join(root, 'docs/ui-system'), sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : e.isFile() ? [path.join(dir, e.name)] : []); }
const source = [...walk(path.join(app, 'src')), ...walk(path.join(app, 'tests')), ...['package.json', 'tsconfig.json', 'tsconfig.client.json', 'tsconfig.appraisal-client.json', 'vite.appraisal.config.mjs', 'docs/art/comic-assets.json'].map(f => path.join(app, f))].sort();
const manifestFile = path.join(doc, 'source-manifest.json');
if (process.argv.includes('--refresh')) {
    fs.writeFileSync(manifestFile, JSON.stringify({ schema: 1, implementation: 'apps/comic', node: process.version, files: source.map(f => ({ file: path.relative(root, f), sha256: sha(f) })) }, null, 2) + '\n');
    console.log(`recorded ${source.length} source fingerprints; this is not verification or approval`);
    process.exit(0);
}
const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
assert.equal(manifest.implementation, 'apps/comic');
assert.deepEqual(manifest.files.map(e => e.file), source.map(f => path.relative(root, f)), 'source inventory drift; review additions/removals');
for (const e of manifest.files)
    assert.equal(sha(path.join(root, e.file)), e.sha256, e.file + ' changed since verification manifest');
const read = f => fs.readFileSync(path.join(app, 'src/appraisal-client', f), 'utf8'), tokens = read('comic-tokens.css'), frame = read('comic-frame.css');
for (const text of ['--comic-radius: 10px', '--layout-space:12px', '--comic-menu-header-height:65px', '--comic-menu-control-height:40px', '--comic-frame-inset:24px', '--comic-frame-max:1480px'])
    assert(tokens.includes(text), `approved token drift: ${text}`);
assert(frame.includes('var(--comic-frame-top)') && frame.includes('var(--comic-frame-inset)'), 'frame must use shared tokens');
for (const f of source.filter(f => /\.(tsx|ts)$/.test(f) && f.includes('/appraisal-client/')))
    if (!f.endsWith('/main.tsx'))
        assert(!/import\s+['"][^'"]+\.css['"]/.test(fs.readFileSync(f, 'utf8')), path.basename(f) + ' imports CSS outside entry; breaks SSR');
const main = read('main.tsx');
assert(main.indexOf("import './comic-frame.css'") > main.indexOf("import './item-sale.css'"), 'shared frame must load after screen styles');
const base = JSON.parse(fs.readFileSync(path.join(doc, 'baselines/manifest.json'), 'utf8'));
assert.equal(base.entries.length, 14, 'all baseline cases required');
for (const e of base.entries)
    assert.equal(sha(path.join(doc, 'baselines', e.file)), e.sha256, e.id + ' reference changed');
const top = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')), comic = JSON.parse(fs.readFileSync(path.join(app, 'package.json'), 'utf8'));
assert.deepEqual(comic.dependencies, top.dependencies, 'use root dependencies/lock');
assert.deepEqual(comic.devDependencies, top.devDependencies);
if (fs.existsSync(path.join(app, 'node_modules')))
    assert(fs.readdirSync(path.join(app, 'node_modules')).every(n => ['.vite', '.vite-temp'].includes(n)), 'no second dependency tree (Vite caches are allowed)');
assert(fs.readFileSync(path.join(root, 'docs/game-design/logic-item-relations.html'), 'utf8').includes('<code id="active-ui-source">apps/comic</code>'), 'main HTML must identify the active comic source; regenerate atlas');
const required = ['AGENTS.md', 'docs/ui-system/README.md', 'docs/ui-system/design-system.md', 'docs/ui-system/decisions.md', 'docs/ui-system/source-manifest.json', 'apps/comic/src/appraisal-client/comic-tokens.css'];
if (process.argv.includes('--require-tracked'))
    for (const f of required)
        execFileSync('git', ['ls-files', '--error-unmatch', f], { cwd: root, stdio: 'pipe' });
console.log(`PASS: ${source.length} source fingerprints, shared token/frame/SSR rules, 14 baseline hashes, dependency parity${process.argv.includes('--require-tracked') ? ', continuity files tracked' : ''}. Pixel approval: ${base.approval}`);
