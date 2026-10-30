import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

// Public fixtures exercise presentation/selection only, never claim live settlement.
export async function run({page,repo,spaceId}) {
 const out=path.join(repo,'docs/game-design/captures/s08-2026-10-30');await fs.mkdir(out,{recursive:true});
 const report={startedAt:new Date().toISOString(),spaceId,scope:'S08 public fixtures; real component selection/navigation, not live multiplayer payment',checks:[]};
 await fs.writeFile(path.join(repo,'docs/ui-system/s08-verification.json'),JSON.stringify(report,null,2)+'\n');
 const geometry=()=>{
  const rect=e=>{const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height];};
  const frame=document.querySelector('.reward-screen');return {frame:rect(frame),viewport:[innerWidth,innerHeight],page:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],headers:[...frame.querySelectorAll('.reward-half h3')].map(rect),halves:[...frame.querySelectorAll('.reward-half')].map(e=>({rect:rect(e),scroll:[e.scrollWidth,e.scrollHeight]})),actions:[...frame.querySelectorAll('.reward-primary-row button')].map(rect),headerHeight:frame.querySelector('.comic-frame-header').getBoundingClientRect().height,contentPadding:getComputedStyle(frame.querySelector('.reward-spread')).padding,seconds:Number(document.querySelector('.countdown').textContent.match(/\d+/)[0])};
 };
 const close=(a,b)=>assert(Math.abs(a-b)<=1,`${a} differs from ${b}`);
 for(const [width,height] of [[1024,800],[1440,722],[1920,800]]) {
  await page.cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
  await page.goto('http://127.0.0.1:5174/?preview=inventory');await page.waitForSelector('#drawer-bag[open]');
  const inventory=await page.evaluate(()=>{const r=document.querySelector('#drawer-bag').getBoundingClientRect();return [r.x,r.y,r.width,r.height];});
  for(const scene of ['reveal','reward-multi']) {
   await page.goto('http://127.0.0.1:5174/?preview='+scene);await page.waitForSelector('.reward-screen');
   await page.waitForFunction(()=>document.fonts.status==='loaded');
   const g=await page.evaluate(geometry);g.frame.forEach((x,i)=>close(x,inventory[i]));
   assert.deepEqual(g.viewport,[width,height]);assert.deepEqual(g.page,g.viewport);close(g.halves[0].rect[2],g.halves[1].rect[2]);close(g.headers[0][1],g.headers[1][1]);
   for(const a of g.actions){close(a[1],g.actions[0][1]);close(a[3],48);}
   for(const h of g.halves){assert(h.scroll[0]<=h.rect[2]+1);assert(h.scroll[1]<=h.rect[3]+2,'inner content overflows');}
   close(g.headerHeight,65);assert(g.seconds>0);
   if(scene==='reward-multi') {
    await page.click('button[aria-label="เหรียญ 1 · ทาย ก้อย"]');await page.click('nav[aria-label="เลือกเหรียญ"] button[aria-label="ถัดไป"]');
    await page.waitForSelector('button[aria-label="เหรียญ 3 · ทาย หัว"]');
    await page.click('nav[aria-label="เลือกเหรียญ"] button[aria-label="ถัดไป"]');await page.waitForSelector('button[aria-label="เหรียญ 5 · ทาย หัว"]');
    await page.click('nav[aria-label="เลือกเหรียญ"] button[aria-label="ก่อนหน้า"]');await page.click('nav[aria-label="เลือกเหรียญ"] button[aria-label="ก่อนหน้า"]');
    assert.equal(await page.evaluate(()=>document.querySelector('button[aria-label="เหรียญ 1 · ทาย ก้อย"]').getAttribute('aria-pressed')),'true');
   } else {
    for(const label of ['กระเป๋า','สถานะ','Dark Market','สมุดบันทึก','กติกา','ตั้งค่า']) {
     await page.click(`button[aria-label="${label}"]`);await page.waitForSelector('dialog[open]');
     await page.click(`button[aria-label="${label}"]`);await page.waitForFunction(()=>!document.querySelector('dialog[open]'));
    }
    assert.equal(await page.evaluate(()=>document.querySelector('.reward-pool strong').textContent),'10');
    const after=await page.evaluate(geometry);assert(after.seconds<=g.seconds,'utility reset clock');
   }
   let shot;
   for(let attempt=0;attempt<3;attempt++) {
    try {shot=await page.cdp('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false,optimizeForSpeed:true});break;}
    catch(error){if(!/timed out/i.test(String(error))||attempt===2)throw error;}
   }
   await fs.writeFile(path.join(out,`${scene}-${width}x${height}.png`),Buffer.from(shot.data,'base64'));
   report.checks.push({scene,inventory,...g,passed:true});console.log(scene+' '+width+' PASS');
   await fs.writeFile(path.join(repo,'docs/ui-system/s08-verification.json'),JSON.stringify(report,null,2)+'\n');
  }
 }
 report.finishedAt=new Date().toISOString();await fs.writeFile(path.join(repo,'docs/ui-system/s08-verification.json'),JSON.stringify(report,null,2)+'\n');console.log(`PASS ${report.checks.length} S08 geometry/interaction cases`);
}
