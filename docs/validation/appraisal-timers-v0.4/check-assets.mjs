import assert from 'node:assert/strict';
import {readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const base=process.argv[2];
assert(base && /^http:\/\/(?:192\.168\.|127\.0\.0\.1|localhost)/.test(base));
const response=await fetch(base);assert.equal(response.status,200);
const html=await response.text();
assert.equal(html,readFileSync('dist/appraisal-client/index.html','utf8'));
const paths=[...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map(m=>m[1]);
for(const dir of ['art','fonts'])for(const file of readdirSync(`dist/appraisal-client/${dir}`))if(/\.(png|ttf)$/.test(file))paths.push(`/${dir}/${file}`);
const assets=[];
for(const path of paths){
  const asset=await fetch(base+path);assert.equal(asset.status,200,path);
  const mime=asset.headers.get('content-type');
  assert(mime?.startsWith(path.endsWith('.png')?'image/png':path.endsWith('.ttf')?'font/ttf':path.endsWith('.css')?'text/css':'text/javascript'),path);
  const bytes=Buffer.from(await asset.arrayBuffer());assert.deepEqual(bytes,readFileSync('dist/appraisal-client'+path));
  assets.push({path,mime,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
}
assert.equal(assets.length,21);
writeFileSync('docs/validation/appraisal-timers-v0.4/final-assets.json',JSON.stringify({checkedAt:new Date().toISOString(),base,assets},null,2)+'\n');
console.log('Final rebuilt HTML and 21 live assets match disk byte-for-byte.');
