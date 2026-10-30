import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

// Mount the real GameTable with synthetic successive DTOs; no live payment or server call.
export async function run({page,repo}) {
 await page.cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
 await page.goto('http://127.0.0.1:5174/?preview=reveal');await page.waitForSelector('.reward-screen');
 await page.evaluate(async()=>{
  const resources=performance.getEntriesByType('resource').map(e=>e.name),url=part=>resources.find(u=>u.includes(part));
  const [reactModule,domModule,{GameTable},{previewRooms}]=await Promise.all([import(url('/react.js?')),import(url('/react-dom_client.js?')),import(url('/App.tsx')),import(url('/comic-preview-data.ts'))]);
  const React=reactModule.default??reactModule,{createRoot}=domModule.default??domModule;
  const host=document.createElement('div');host.id='s09-transition-test';document.querySelector('#game-main').appendChild(host);
  const root=createRoot(host),room=structuredClone(previewRooms.inspection);room.game.phase='REVEAL';room.game.encounter=3;room.game.self.eventOffer=null;
  room.game.self.roundReward={encounter:3,base:10,amount:5,flips:0,settled:false,coinCount:1,staked:0,net:0};
  const render=room=>root.render(React.createElement(GameTable,{room,submit:()=>{},send:()=>true,disabled:false}));
  window.__s09UiHarness={root,room,render,host};render(room);
 });
 await page.waitForSelector('#s09-transition-test .reward-screen');
 const during=await page.evaluate(async()=>{
  const h=window.__s09UiHarness,room=structuredClone(h.room);Object.assign(room.game.self.roundReward,{amount:0,flips:1,settled:true,lastFlip:{guess:'heads',side:'tails',correct:false,coins:[{guess:'heads',side:'tails',correct:false}],delta:-5}});h.render(room);
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  return {tossing:!!h.host.querySelector('.coin-scene.tossing'),postReward:!!h.host.querySelector('.post-reward-screen'),disabled:[...h.host.querySelectorAll('.reward-primary-row button')].every(e=>e.disabled)};
 });
 assert(during.tossing);assert(!during.postReward);assert(during.disabled);
 await page.waitForSelector('#s09-transition-test .post-reward-screen');
 const after=await page.evaluate(()=>{const h=window.__s09UiHarness,post=h.host.querySelector('.post-reward-screen');const result={postReward:!!post,tossing:!!h.host.querySelector('.coin-scene.tossing'),reward:post.querySelector('.vault-receipt').textContent};h.root.unmount();h.host.remove();delete window.__s09UiHarness;return result;});
 assert(after.postReward&&!after.tossing);assert(after.reward.includes('0'));
 const report={scope:'Real component lifecycle with synthetic incoming DTOs, not live match settlement',during,after,passed:true,finishedAt:new Date().toISOString()};
 await fs.writeFile(path.join(repo,'docs/ui-system/s09-transition-verification.json'),JSON.stringify(report,null,2)+'\n');console.log(report);
}
