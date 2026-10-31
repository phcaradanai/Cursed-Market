import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
export async function run({page,repo,spaceId,baseUrl}) {
 const out=path.join(repo,'docs/game-design/captures/merchant-expressions-2026-10-31');await fs.mkdir(out,{recursive:true});
 const report={startedAt:new Date().toISOString(),spaceId,baseUrl,scope:'mounted GameTable with explicit public DTO fixtures; not engine settlement proof',transitions:[],poses:[]};
 const save=()=>fs.writeFile(path.join(repo,'docs/ui-system/merchant-expression-ui-verification.json'),JSON.stringify(report,null,2)+'\n');await save();
 const mount=async()=>{await page.goto(baseUrl+'/?preview=merchants');await page.waitForSelector('.gate-figure');await page.evaluate(async()=>{const m=await import('/validation/merchant-expression-fixture.tsx');window.__merchantProof=m.mountMerchantExpressionProof();});};
 for(const [width,height] of [[1024,800],[1440,722],[1920,800]]) {
  await page.cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});await page.cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});await mount();
  const entry=await page.evaluate(()=>{window.__merchantProof.enter();window.__merchantProof.same();return{reaction:document.querySelector('.screen').dataset.merchantReaction,images:[...document.querySelectorAll('.gate-figure')].map(e=>e.src),buttons:[...document.querySelectorAll('.portals button')].filter(e=>!e.closest('.term-wrap')).map(e=>e.disabled),clock:document.querySelector('.countdown').textContent};});
  assert.equal(entry.reaction,'entry');assert(entry.images[0].endsWith('/smile.png'));assert(entry.images.slice(1).every(s=>s.endsWith('/angry.png')));assert(entry.buttons.every(Boolean));
  await page.click('[data-drawer="bag"]');await page.waitForSelector('#drawer-bag[open]');await page.click('[data-drawer="bag"]');await page.waitForSelector('.appraisal-stage');
  const idle=await page.evaluate(()=>{window.__merchantProof.same();return{image:document.querySelector('.merchant-figure').src,reaction:document.querySelector('.screen').dataset.merchantReaction,clock:document.querySelector('.countdown').textContent}});assert(idle.image.endsWith('/idle.png'));assert.equal(idle.reaction,undefined);assert(Number(idle.clock.match(/\d+/)[0])<=Number(entry.clock.match(/\d+/)[0]));
  for(const [accepted,mood] of [[true,'smile'],[false,'angry'],[null,'idle']]){await page.evaluate(v=>window.__merchantProof.result(v),accepted);assert((await page.evaluate(()=>document.querySelector('.merchant-figure').src)).endsWith('/'+mood+'.png'));}
  const metrics=await page.evaluate(()=>{const r=e=>{const a=e.getBoundingClientRect();return[a.x,a.y,a.width,a.height]};return{viewport:[innerWidth,innerHeight],page:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],image:r(document.querySelector('.merchant-figure')),window:r(document.querySelector('.merchant-window')),clip:getComputedStyle(document.querySelector('.merchant-window')).clipPath};});assert.deepEqual(metrics.viewport,metrics.page);assert(metrics.clip.includes('0px'));assert.equal(metrics.image[1]+metrics.image[3],metrics.window[1]+metrics.window[3]);
  report.transitions.push({width,height,entry,idle,metrics,passed:true});await save();console.log(width+' sequence PASS');
 }
 await page.cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:722,deviceScaleFactor:1,mobile:false});
 for(const npc of ['orc','vampire','autometa','alien','beast','swarm','deepsea','darkone'])for(const [accepted,mood] of [[null,'idle'],[true,'smile'],[false,'angry']]) {
  await page.evaluate(({npc,accepted})=>window.__merchantProof.merchant(npc,accepted),{npc,accepted});
  await page.waitForFunction(()=>{const im=document.querySelector('.merchant-figure');return im.complete&&im.naturalWidth>0});
  const pose=await page.evaluate(()=>{const im=document.querySelector('.merchant-figure'),w=document.querySelector('.merchant-window'),r=e=>{const a=e.getBoundingClientRect();return[a.x,a.y,a.width,a.height]};return{src:im.src,natural:[im.naturalWidth,im.naturalHeight],rect:r(im),window:r(w),fit:getComputedStyle(im).objectFit,clip:getComputedStyle(w).clipPath};});assert(pose.src.endsWith('/'+npc+'/'+mood+'.png'));assert.equal(pose.rect[1]+pose.rect[3],pose.window[1]+pose.window[3]);assert.equal(pose.fit,'cover');
  if(['beast','alien','vampire'].includes(npc)){
   const shot=await page.cdp('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false,optimizeForSpeed:true});await fs.writeFile(path.join(out,`${npc}-${mood}.png`),Buffer.from(shot.data,'base64'));
  }
  report.poses.push({npc,mood,...pose,passed:true});await save();
 }
 await page.cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await mount();
 const reduced=await page.evaluate(()=>{window.__merchantProof.enter();return{reaction:document.querySelector('.screen').dataset.merchantReaction,appraisal:!!document.querySelector('.appraisal-stage')}});assert.equal(reduced.reaction,undefined);assert(reduced.appraisal);report.reducedMotion={...reduced,passed:true};
 await page.cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});report.finishedAt=new Date().toISOString();await save();console.log('24 poses + reduced motion PASS');
}
