import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

// Real public-component controls; preview transaction feedback is not settlement proof.
export async function run({page,repo,spaceId}) {
 const output=path.join(repo,'docs/game-design/captures/s09-2026-10-30'),file=path.join(repo,'docs/ui-system/s09-verification.json');await fs.mkdir(output,{recursive:true});
 const report={startedAt:new Date().toISOString(),spaceId,scope:'S09 public fixtures, no live payments',checks:[]};
 const save=()=>fs.writeFile(file,JSON.stringify(report,null,2)+'\n');await save();
 const close=(a,b)=>assert(Math.abs(a-b)<=1,`${a} vs ${b}`);
 for(const [width,height] of [[1024,800],[1440,722],[1920,800]]) {
  await page.cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
  await page.goto('http://127.0.0.1:5174/?preview=inventory');await page.waitForSelector('#drawer-bag[open]');
  const inventory=await page.evaluate(()=>{const r=document.querySelector('#drawer-bag').getBoundingClientRect();return [r.x,r.y,r.width,r.height];});
  for(const scene of ['reward-settled','vault-full','vault-empty']) {
   await page.goto('http://127.0.0.1:5174/?preview='+scene);await page.waitForSelector('.post-reward-screen');
   await page.waitForFunction(()=>document.fonts.status==='loaded'&&[...document.images].filter(e=>e.getClientRects().length).every(e=>e.complete&&e.naturalWidth>0));
   const metrics=await page.evaluate(()=>{
    const q=s=>document.querySelector(s),r=e=>{const a=e.getBoundingClientRect();return [a.x,a.y,a.width,a.height];},frame=q('.post-reward-screen'),cols=[q('.vault-money'),q('.vault-goods')],input=q('.vault-stepper input'),buttons=[...document.querySelectorAll('.vault-stepper >button')];
    return {frame:r(frame),page:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],viewport:[innerWidth,innerHeight],cols:cols.map(e=>({rect:r(e),scroll:[e.scrollWidth,e.scrollHeight]})),input:r(input),stepper:r(q('.vault-stepper')),stepperButtons:buttons.map(r),actions:[...document.querySelectorAll('.vault-transfer-actions button')].map(r),padding:getComputedStyle(q('.vault-spread')).padding,header:r(q('.comic-frame-header')),seconds:Number(q('.countdown').textContent.match(/\d+/)[0])};
   });
   metrics.frame.forEach((n,i)=>close(n,inventory[i]));assert.deepEqual(metrics.viewport,[width,height]);assert.deepEqual(metrics.page,metrics.viewport);close(metrics.cols[0].rect[2],metrics.cols[1].rect[2]);close(metrics.header[3],65);
   for(const c of metrics.cols){assert(c.scroll[0]<=c.rect[2]+1);assert(c.scroll[1]<=c.rect[3]+2,'content overflow');}
   for(const a of metrics.actions){close(a[1],metrics.actions[0][1]);close(a[2],metrics.actions[0][2]);close(a[3],44);}
   const [minus,plus]=metrics.stepperButtons,box=metrics.input,centre=r=>r[0]+r[2]/2;
   close(box[0]-minus[0]-minus[2],plus[0]-box[0]-box[2]);close(centre(box),centre(metrics.stepper));close(centre(box),(metrics.actions[0][0]+metrics.actions[1][0]+metrics.actions[1][2])/2);
   for(const button of metrics.stepperButtons){close(button[1],box[1]);close(button[2],44);close(button[3],44);}
   if(scene==='reward-settled') {
    const input='.vault-stepper input';await page.fill(input,'1.5');assert(await page.evaluate(()=>[...document.querySelectorAll('.vault-transfer-actions button')].every(e=>e.disabled)));
    await page.fill(input,'41');assert.equal(await page.evaluate(()=>document.querySelector('.vault-transfer-actions button:nth-child(2)').disabled),true);
    await page.fill(input,'40');await page.click('button[aria-label="เพิ่มจำนวนเครดิต"]');assert.equal(await page.evaluate(()=>document.querySelector('.vault-stepper input').value),'41');
    await page.click('button[aria-label="ลดจำนวนเครดิต"]');await page.fill(input,'10');
    await page.click('nav[aria-label="หน้าของที่ถืออยู่"] button[aria-label="ถัดไป"]');await page.click('nav[aria-label="หน้าของที่ถืออยู่"] button[aria-label="ก่อนหน้า"]');
    for(const selector of ['[data-drawer="bag"]','[data-drawer="effects"]','[data-drawer="market"]','[data-drawer="ledger"]','[data-drawer="rules"]','.hud-settings']) {
     await page.click(selector);await page.waitForSelector('dialog[open]');await page.click(selector);await page.waitForFunction(()=>!document.querySelector('dialog[open]'));
    }
    const after=await page.evaluate(()=>({value:document.querySelector('.vault-stepper input').value,seconds:Number(document.querySelector('.countdown').textContent.match(/\d+/)[0]),balance:document.querySelector('.vault-balances').textContent}));
    assert.equal(after.value,'10');assert(after.seconds<=metrics.seconds);assert(after.balance.includes('95')&&after.balance.includes('40'));
   } else if(scene==='vault-full') {
    assert(await page.evaluate(()=>[...document.querySelectorAll('.vault-shelf:first-child .vault-item')].every(e=>e.disabled)));
    await page.click('nav[aria-label="หน้าของในคลัง"] button[aria-label="ถัดไป"]');await page.click('nav[aria-label="หน้าของในคลัง"] button[aria-label="ก่อนหน้า"]');
   } else assert(await page.evaluate(()=>[...document.querySelectorAll('.vault-transfer-actions button,.vault-expand')].every(e=>e.disabled)));
   let shot;for(let attempt=0;attempt<3;attempt++){try{shot=await page.cdp('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false,optimizeForSpeed:true});break;}catch(error){if(!/timed out/i.test(String(error))||attempt===2)throw error;}}
   await fs.writeFile(path.join(output,`${scene}-${width}x${height}.png`),Buffer.from(shot.data,'base64'));
   report.checks.push({scene,...metrics,passed:true});await save();console.log(scene+' '+width+' PASS');
  }
 }
 report.finishedAt=new Date().toISOString();await save();console.log('PASS '+report.checks.length+' S09 cases');
}
