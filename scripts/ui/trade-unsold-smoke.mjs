import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function run({page,repo}) {
 const checks=[];
 for(const [width,height] of [[1440,720],[1024,800]]) {
  await page.cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
  await page.goto('http://localhost:5174/?preview=trade&unsold=1');
  await page.waitForSelector('.trade-table');
  assert.equal(await page.evaluate(()=>document.querySelectorAll('.unsold-item-trigger').length),0);
  await page.click('button[aria-label="ไปโต๊ะ ผู้ประเมินอีกคน"]');
  assert.equal(await page.evaluate(()=>document.querySelectorAll('button.table-good').length),3);
  await page.click('button.table-offers');
  const menu=await page.evaluate(()=>{const b=document.querySelector('#table-offers-detail .drawer-body'),d=document.querySelector('#table-offers-detail');return {height:b.clientHeight,scroll:b.scrollHeight,actions:[...document.querySelectorAll('.unsold .option-copy>button')].map(e=>({text:e.textContent,inside:e.getBoundingClientRect().bottom<=d.getBoundingClientRect().bottom}))};});
  assert.equal(menu.height,menu.scroll);assert.equal(menu.actions.length,3);assert(menu.actions.every(a=>a.inside));
  await page.hover('.unsold-item-trigger');
  await page.waitForFunction(()=>document.querySelector('.comic-tooltip')?.textContent.includes('คุณประเมินไว้ 21 เครดิต'));
  await page.click('button[aria-label="ปิด ข้อเสนอซื้อขาย"]');
  assert.equal(await page.evaluate(()=>document.querySelectorAll('.comic-tooltip,.unsold-item-trigger').length),0);
  await page.hover('button.table-good >> nth=0');
  await page.waitForSelector('.comic-tooltip');
  await page.mouse.move(10,10);
  await page.waitForFunction(()=>!document.querySelector('.comic-tooltip'));
  checks.push({viewport:[width,height],menu,passed:true});
 }
 await fs.writeFile(path.join(repo,'docs/ui-system/runs/latest/trade-unsold-smoke.json'),JSON.stringify({finishedAt:new Date().toISOString(),checks},null,2)+'\n');
 console.log('PASS trade unsold overlay and tooltip '+checks.length+' viewports');
}
