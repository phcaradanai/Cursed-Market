import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
// Fixture geometry/navigation only; socket settlement is tested separately.
export async function run({page,repo,spaceId,url,outputDir,reportFile}) {
 const file=reportFile??path.join(repo,'docs/ui-system/forced-rps-ui-verification.json'),dir=outputDir??path.join(repo,'docs/game-design/captures/forced-rps-2026-10-31');await fs.mkdir(dir,{recursive:true});
 const report={startedAt:new Date().toISOString(),spaceId,url,scope:'public fixture; no transaction claims',checks:[]};
 const save=()=>fs.writeFile(file,JSON.stringify(report,null,2)+'\n');await save();
 const close=(a,b)=>assert(Math.abs(a-b)<=1,`${a} vs ${b}`);
 for(const [width,height] of [[1024,800],[1440,722],[1920,800]]) {
  await page.cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
  await page.goto(url+'/?preview=inventory');await page.waitForSelector('#drawer-bag[open]');
  const reference=await page.evaluate(()=>{const r=document.querySelector('#drawer-bag').getBoundingClientRect();return[r.x,r.y,r.width,r.height]});
  await page.goto(url+'/?preview=theft');await page.waitForSelector('.theft-duel-screen');
  await page.waitForFunction(()=>document.fonts.status==='loaded');
  const metrics=await page.evaluate(()=>{
   const q=s=>document.querySelector(s),r=e=>{const a=e.getBoundingClientRect();return[a.x,a.y,a.width,a.height]};
   return{frame:r(q('.theft-duel-screen')),page:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],viewport:[innerWidth,innerHeight],halves:[...document.querySelectorAll('.theft-duel-half')].map(e=>({rect:r(e),scroll:[e.scrollWidth,e.scrollHeight]})),buttons:[...document.querySelectorAll('.theft-duel-hands button')].map(r),clock:q('[role="timer"]').textContent,duplicate:!!q('.appraisal-stage,.trade-screen')};
  });
  reference.forEach((v,i)=>close(v,metrics.frame[i]));assert.deepEqual(metrics.page,metrics.viewport);assert.equal(metrics.duplicate,false);
  close(metrics.halves[0].rect[2],metrics.halves[1].rect[2]);close(metrics.halves[0].rect[1],metrics.halves[1].rect[1]);
  for(const half of metrics.halves){assert(half.scroll[0]<=half.rect[2]+1);assert(half.scroll[1]<=half.rect[3]+1)}
  for(const b of metrics.buttons){close(b[2],metrics.buttons[0][2]);close(b[3],48);close(b[1],metrics.buttons[0][1])}
  const [a,b,c]=metrics.buttons;close(b[0]-a[0]-a[2],c[0]-b[0]-b[2]);
  const left=metrics.halves[0].rect[0]-metrics.frame[0],right=metrics.frame[0]+metrics.frame[2]-metrics.halves[1].rect[0]-metrics.halves[1].rect[2];close(left,right);
  for(const selector of ['[data-drawer="bag"]','[data-drawer="effects"]','[data-drawer="market"]','[data-drawer="ledger"]','[data-drawer="rules"]','.hud-settings']) {
   await page.click(selector);await page.waitForSelector('dialog[open]');await page.click(selector);await page.waitForFunction(()=>!document.querySelector('dialog[open]'));
  }
  const after=await page.evaluate(()=>({clock:document.querySelector('[role="timer"]').textContent,round:document.querySelector('.theft-duel-screen .comic-menu-actions').textContent,enabled:[...document.querySelectorAll('.theft-duel-hands button')].every(e=>!e.disabled)}));
  assert(Number(after.clock.match(/\d+/)[0])<=Number(metrics.clock.match(/\d+/)[0]));assert(after.enabled);assert(after.round.includes('1'));
  await page.focus('.theft-duel-hands button:first-child');await page.press('.theft-duel-hands button:first-child','Tab');
  assert(await page.evaluate(()=>document.activeElement===document.querySelector('.theft-duel-hands button:nth-child(2)')));
  const shot=await page.cdp('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false,optimizeForSpeed:true});
  const image=path.join(dir,`theft-${width}x${height}.png`);await fs.writeFile(image,Buffer.from(shot.data,'base64'));
  report.checks.push({width,height,...metrics,after,image:path.relative(repo,image),passed:true});await save();console.log(width+' PASS');
 }
 report.finishedAt=new Date().toISOString();await save();
}
