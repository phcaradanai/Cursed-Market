import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
export async function run({page,repo,spaceId,baseUrl='http://127.0.0.1:3185'}){
 const output=path.join(repo,'docs/game-design/captures/ghost-2026-10-30'),file=path.join(repo,'docs/ui-system/ghost-ui-verification.json');await fs.mkdir(output,{recursive:true});
 const report={startedAt:new Date().toISOString(),spaceId,baseUrl,scope:'Public component fixtures, not transaction or RPS outcome proof',checks:[]};const save=()=>fs.writeFile(file,JSON.stringify(report,null,2)+'\n');await save();
 for(const [width,height] of [[1024,800],[1440,722],[1920,800]]){
  await page.cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
  await page.goto(baseUrl+'/?preview=inventory');await page.waitForSelector('#drawer-bag[open]');const reference=await page.evaluate(()=>{const r=document.querySelector('#drawer-bag').getBoundingClientRect();return [r.x,r.y,r.width,r.height];});
  for(const scene of ['ghost','ghost-busy','ghost-working','ghost-lost','ghost-funds']){
   await page.goto(baseUrl+'/?preview='+scene);await page.waitForSelector('.ghost-world');await page.waitForFunction(()=>document.fonts.status==='loaded'&&[...document.images].filter(e=>e.getClientRects().length).every(e=>e.complete&&e.naturalWidth>0));
   const metrics=await page.evaluate(()=>{const box=e=>{const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height];},frame=document.querySelector('.ghost-world'),columns=[...document.querySelectorAll('.ghost-columns>section')];return {frame:box(frame),page:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],viewport:[innerWidth,innerHeight],header:frame.querySelector('header').getBoundingClientRect().height,cols:columns.map(e=>({rect:box(e),client:[e.clientWidth,e.clientHeight],scroll:[e.scrollWidth,e.scrollHeight]})),buttons:[...frame.querySelectorAll('button')].filter(e=>e.getClientRects().length).map(box)};});
   metrics.frame.forEach((v,i)=>assert(Math.abs(v-reference[i])<=1,'shared frame'));assert.deepEqual(metrics.page,metrics.viewport);assert.equal(metrics.header,65);assert.equal(metrics.cols[0].rect[2],metrics.cols[1].rect[2]);for(const c of metrics.cols){assert(c.scroll[0]<=c.client[0]+1);assert(c.scroll[1]<=c.client[1]+1,'inner content clipped');}for(const b of metrics.buttons){assert(b[0]>=metrics.frame[0]&&b[0]+b[2]<=metrics.frame[0]+metrics.frame[2]);assert(b[1]+b[3]<=metrics.frame[1]+metrics.frame[3]);}
   if(scene==='ghost-busy'){await page.click('nav[aria-label="งานวิญญาณ"] button[aria-label="ถัดไป"]');assert(await page.evaluate(()=>document.querySelector('.ghost-job-detail').textContent.includes('ผู้ว่าจ้าง 2')));await page.click('nav[aria-label="งานวิญญาณ"] button[aria-label="ก่อนหน้า"]');assert.equal(await page.evaluate(()=>document.querySelector('.ghost-pair button:first-child').getBoundingClientRect().width-document.querySelector('.ghost-pair button:last-child').getBoundingClientRect().width),0);}
   if(scene==='ghost-funds'){assert(await page.evaluate(()=>[...document.querySelectorAll('.ghost-slots article>button')].every(b=>b.disabled)));assert(await page.evaluate(()=>document.querySelector('.ghost-world').textContent.includes('รอผู้ว่าจ้างเติมเครดิต')));}
   if(scene==='ghost-lost')assert(await page.evaluate(()=>[...document.querySelectorAll('.ghost-slots article>div button')].every(b=>b.disabled)));
   if(scene==='ghost'){for(const selector of ['[data-drawer="bag"]','[data-drawer="effects"]','[data-drawer="market"]','[data-drawer="ledger"]','[data-drawer="rules"]','.hud-settings']){await page.click(selector);await page.waitForSelector('dialog[open]');await page.click(selector);await page.waitForFunction(()=>!document.querySelector('dialog[open]'));}}
   const shot=await page.cdp('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false,optimizeForSpeed:true});const bytes=Buffer.from(shot.data,'base64');assert.equal(bytes.readUInt32BE(16),width);assert.equal(bytes.readUInt32BE(20),height);await fs.writeFile(path.join(output,`${scene}-${width}x${height}.png`),bytes);
   report.checks.push({scene,...metrics,passed:true});await save();console.log(scene+' '+width+' PASS');
  }
 }
 report.finishedAt=new Date().toISOString();await save();console.log('PASS:15 ghost fixture geometry/navigation states');
}
