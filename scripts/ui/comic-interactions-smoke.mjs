import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function run({page,repo}) {
 const checks=[];
 await page.cdp('Emulation.setTouchEmulationEnabled',{enabled:false});
 const style=selector=>page.evaluate(async selector=>{const e=document.querySelector(selector);assertElement(e);function assertElement(e){if(!e)throw Error('Missing '+selector);}await Promise.all(e.getAnimations().filter(a=>a.effect?.getComputedTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));const s=getComputedStyle(e);return {border:s.borderColor,background:s.backgroundColor,outline:s.outlineStyle,width:s.outlineWidth,offset:s.outlineOffset,color:s.outlineColor,shadow:s.boxShadow,transform:s.transform,duration:s.transitionDuration,opacity:s.opacity,active:e.matches(':active'),rect:[e.offsetWidth,e.offsetHeight]};},selector);
 const idle=async()=>{await page.mouse.move(5,5);await page.evaluate(()=>document.activeElement?.blur());};
 const focus=async selector=>{await page.keyboard.press('Tab');await page.focus(selector+' >> nth=0');};
 const ring=s=>{assert.equal(s.outline,'solid');assert.equal(s.width,'3px');assert.equal(s.offset,'4px');assert.equal(s.color,'rgb(255, 66, 101)');};
 const press=async selector=>{const point=await page.evaluate(selector=>{const r=document.querySelector(selector).getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2];},selector);await page.mouse.move(...point);await page.mouse.down({button:'left'});const result=await style(selector);await page.mouse.move(5,5);await page.mouse.up({button:'left'});return result;};
 for(const [width,height]of [[1440,720],[1024,800]]) {
  await page.cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
  await page.cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  await page.goto('http://localhost:5174/?preview=inventory');await page.waitForSelector('#drawer-bag .drawer-close');await idle();
  const close='#drawer-bag .drawer-close',before=await style(close);await page.hover(close);const hover=await style(close);assert.equal(hover.background,'rgb(66, 19, 32)');assert.deepEqual(hover.rect,before.rect);assert.equal(hover.transform,'none');
  const pressed=await press(close);assert(pressed.active);assert.equal(pressed.transform,'matrix(1, 0, 0, 1, 0, 1)');await focus(close);ring(await style(close));
  await idle();const selected='.inventory-filters button[aria-pressed=true]';assert.equal((await style(selected)).background,'rgb(41, 16, 25)');await focus(selected);ring(await style(selected));
  assert.equal(await page.evaluate(()=>getComputedStyle(document.querySelector('.item-thumb.selected'),'::before').boxShadow),'none');
  await page.goto('http://localhost:5174/?preview=event-oath');await page.waitForSelector('.event-menu .choice-card');await idle();await page.hover('.event-review button.primary >> nth=0');assert.equal((await style('.event-review button.primary')).background,'rgb(225, 25, 65)');await idle();
  const card='.event-menu .choice-card.selected',radio=card+' input';assert.equal((await style(card)).outline,'none');await focus(radio);ring(await style(card));assert.equal((await style(radio)).outline,'none');
  await idle();await page.evaluate(()=>document.querySelector('.event-menu .choice-cards').disabled=true);const disabledCard=await style(card);await page.hover(card+' >> nth=0');const disabledHover=await style(card);assert.equal(disabledHover.border,disabledCard.border);assert.equal(disabledHover.background,disabledCard.background);assert.equal(disabledHover.transform,'none');
  await page.goto('http://localhost:5174/?preview=trade&unsold=1');await page.waitForSelector('button.table-good');await page.hover('button.table-good >> nth=0');await page.waitForSelector('.comic-tooltip');await page.mouse.move(5,5);await page.waitForFunction(()=>!document.querySelector('.comic-tooltip'));
  await focus('.table-down');ring(await style('.table-down'));assert.equal((await style('.table-down')).opacity,'1');assert((await style('.table-down')).duration.split(',').every(t=>t.trim()==='0.16s'));
  await page.click('button.table-good >> nth=0');await page.waitForSelector('.comic-sale-controls .choice-card.selected');await idle();assert.equal((await style('.comic-sale-controls .choice-card.selected')).background,'rgb(41, 16, 25)');await focus('.comic-sale-controls .choice-card.selected input');ring(await style('.comic-sale-controls .choice-card.selected'));assert.equal((await style('.comic-sale-controls .choice-card.selected input')).outline,'none');await page.click('button[aria-label="ปิด เครื่องรางเฝ้าจิต"]');
  await page.click('button[aria-label="ไปโต๊ะ ผู้ประเมินอีกคน"]');await page.click('button.table-good >> nth=0');await page.waitForSelector('.trade-listing .stepper input');await focus('.trade-listing .stepper input');ring(await style('.trade-listing .stepper'));assert.equal((await style('.trade-listing .stepper input')).outline,'none');
  await page.goto('http://localhost:5174/?preview=reward-settled');await page.waitForSelector('.vault-stepper input');await focus('.vault-stepper input');ring(await style('.vault-stepper input'));
  const disabled='.vault-stepper button:first-child';await page.evaluate(selector=>document.querySelector(selector).disabled=true,disabled);const d=await style(disabled);assert.equal((await press(disabled)).transform,'none');assert.deepEqual((await style(disabled)).rect,d.rect);
  await page.cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});const plus='.vault-stepper button:last-child';assert.equal((await style(plus)).duration,'0s');assert.equal((await press(plus)).transform,'none');
  checks.push({viewport:[width,height],passed:true,coverage:['secondary hover','pressed offset','selected navigation','choice single focus ring','disabled choice/button','quiet overlay fade','tooltip exit','stepper focus','reduced motion']});
 }
 await page.cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
 await page.goto('http://localhost:5174/');await page.waitForSelector('.masthead button');await focus('.masthead button');ring(await style('.masthead button'));
 await fs.writeFile(path.join(repo,'docs/ui-system/runs/latest/comic-interactions-smoke.json'),JSON.stringify({finishedAt:new Date().toISOString(),checks,entryFocus:true},null,2)+'\n');
 console.log('PASS shared Comic interaction contract '+checks.length+' viewports and entry header');
}
