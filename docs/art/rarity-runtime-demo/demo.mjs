import { RARITIES, THEMES, RARITY_NAMES, THEME_NAMES, appearanceRandom, defaultRarityConfig, rollAppearance, resolveAppearance } from '/dist/src/shared/item-rarity.js';
import { createRarityVisual } from '/dist/src/shared/rarity-renderer.js';
import { defaultRarityEconomy, rarityPowerFor, rarityValue } from '/dist/src/shared/rarity-power.js';

const gallery=document.querySelector('.gallery'),status=document.querySelector('#status');
const config=defaultRarityConfig(),economy=defaultRarityEconomy(),visuals=[];
let seed=Number(new URL(location.href).searchParams.get('seed')??8901)>>>0;
let theme='inferno',mode='tiers',paused=matchMedia('(prefers-reduced-motion: reduce)').matches,compare=false,looks=[];
const tools=document.createElement('div');tools.className='demo-tools';
tools.innerHTML=`<div class="seed-tools"><label>Seed <input id="seed" type="number" min="0" max="4294967295" step="1" value="${seed}"></label><button id="apply-seed">ใช้ seed นี้</button><button id="reroll">สุ่ม seed ใหม่</button><button id="roll-door">ทดลองสุ่มตาม rate</button><button id="tiers">เทียบ 6 ระดับ</button></div><div class="themes" role="group" aria-label="เลือกธีม"><button data-theme="random">สุ่มธีม</button>${THEMES.map(t=>`<button data-theme="${t}" aria-pressed="${t===theme}">${THEME_NAMES[t].th}</button>`).join('')}</div>`;
gallery.before(tools);
const rates=document.createElement('p');rates.className='rates';rates.textContent=`Rate ทดลอง: ${RARITIES.map(r=>`${RARITY_NAMES[r].en} ${Number((config.rates[r]*100).toFixed(3))}%`).join(' · ')} | Uncommon มี ${config.themes.uncommon.length} ธีม`;gallery.after(rates);
function updateVisuals(){
  visuals.forEach((v,i)=>{v.setAppearance(compare?{...looks[i],rarity:'common',theme:'plain'}:looks[i]);v.setPaused(paused);});
  document.querySelector('#pause').setAttribute('aria-pressed',String(paused));document.querySelector('#pause').textContent=paused?'เล่นการเคลื่อนไหว':'หยุดการเคลื่อนไหว';
  document.querySelector('#compare').setAttribute('aria-pressed',String(compare));document.querySelector('#compare').textContent=compare?'เปิดเอฟเฟกต์ทุกระดับ':'ปิดเอฟเฟกต์เพื่อเทียบ';
}
function render(){
  visuals.splice(0).forEach(v=>v.dispose());gallery.replaceChildren();
  looks=RARITIES.map((rarity,i)=>{
    const childSeed=Math.floor(appearanceRandom(seed,`demo-item:${i}`)*0x100000000);
    const rolled=rollAppearance(childSeed,config);
    const selected=mode==='tiers'?rarity:rolled.rarity;
    return {...rolled,rarity:selected,theme:selected==='common'?'plain':theme??rolled.theme,rarityPower:rarityPowerFor(selected,economy)};
  });
  window.demoLooks=looks;
  looks.forEach(look=>{
    const style=resolveAppearance(look),figure=document.createElement('figure');
    figure.style.setProperty('--tone',`rgb(${style.primary.map(n=>Math.round(n*255)).join(' ')})`);
    const label=`${RARITY_NAMES[look.rarity].th} · ${THEME_NAMES[look.theme].th}`;
    figure.innerHTML=`<div class="stage"><img class="fallback" src="key-cutout.png" alt="กุญแจ ${label}"><canvas aria-hidden="true"></canvas></div><figcaption><h2>${RARITY_NAMES[look.rarity].en}<span class="thai">${THEME_NAMES[look.theme].th}</span></h2><p>${label}</p><p>มูลค่า ${rarityValue(look,20)} เครดิต · โบนัส ${2*look.rarityPower.effectMultiplier}%</p><p>seed ${look.visualSeed} · ชุดสี ${style.primary.map(n=>Math.round(n*255)).join(' / ')}</p></figcaption>`;gallery.append(figure);
    try{visuals.push(createRarityVisual(figure.querySelector('canvas'),{imageUrl:'key-cutout.png',appearance:look,cutout:true,onReady:()=>figure.querySelector('.stage').classList.add('ready'),onError:()=>{status.textContent='โหลดเอฟเฟกต์ไม่ได้ แสดงภาพเดิมแทน';}}));}
    catch(error){status.textContent='WebGL ไม่พร้อม แสดงภาพเดิมแทน';console.error(error);}
  });
  document.querySelectorAll('[data-theme]').forEach(b=>b.setAttribute('aria-pressed',String((theme??'random')===b.dataset.theme)));
  document.querySelector('#seed').value=seed;
  const url=new URL(location.href);url.searchParams.set('seed',seed);history.replaceState(null,'',url);
  status.textContent=`${mode==='tiers'?'เทียบระดับ':'สุ่มตาม rate'} · ภาพเดียว · ธีม ${theme?THEME_NAMES[theme].th:'สุ่มตาม config'}`;
  updateVisuals();window.demoReady=true;
}
document.querySelector('#apply-seed').addEventListener('click',()=>{const n=Number(document.querySelector('#seed').value);if(!Number.isSafeInteger(n)||n<0||n>0xffffffff){status.textContent='Seed ต้องเป็นจำนวนเต็ม 0–4294967295';return;}seed=n;render();});
document.querySelector('#reroll').addEventListener('click',()=>{seed=crypto.getRandomValues(new Uint32Array(1))[0];render();});
document.querySelector('#roll-door').addEventListener('click',()=>{mode='roll';theme=null;seed=crypto.getRandomValues(new Uint32Array(1))[0];render();});
document.querySelector('#tiers').addEventListener('click',()=>{mode='tiers';render();});
document.querySelectorAll('[data-theme]').forEach(button=>button.addEventListener('click',()=>{theme=button.dataset.theme==='random'?null:button.dataset.theme;render();}));
document.querySelector('#pause').addEventListener('click',()=>{paused=!paused;updateVisuals();});
document.querySelector('#compare').addEventListener('click',()=>{compare=!compare;updateVisuals();});
window.addEventListener('pagehide',()=>visuals.forEach(v=>v.dispose()));
render();
