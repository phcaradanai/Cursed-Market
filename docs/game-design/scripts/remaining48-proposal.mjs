#!/usr/bin/env node
// Documentation generator and structural/paper-math checks, never imported by gameplay.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const doc=path.join(root,'docs/game-design');
const read=file=>JSON.parse(fs.readFileSync(path.join(doc,file),'utf8'));
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(path.join(doc,file))).digest('hex');
const file='proposals/remaining48-experimental-v1.json',p=read(file),audit=read('remaining48-audit.json'),pilot=read('new56-pilot-proposal.json');
assert.equal(p.status,'proposal-awaiting-user-approval');
assert.equal(p.runtimeImplemented,false);assert.equal(p.approval,null);
for(const [file,hash] of Object.entries(p.sourceHashes))assert.equal(sha(file),hash,'Stale source '+file);
assert.equal(p.items.length,48);assert.equal(new Set(p.items.map(i=>i.id)).size,48);
assert.deepEqual(p.items.map(i=>i.id),audit.items.map(i=>i.id));
assert.equal(Object.keys(p.effectContracts).length,35);
for(const item of p.items){
  const source=audit.items.find(i=>i.id===item.id);
  for(const key of ['name','merchantId','type','primaryEffect','logicId'])assert.equal(item[key],source[key],item.id+': '+key);
  assert(!pilot.items.some(i=>i.id===item.id));assert.equal(item.optionalEffectsEnabled,false);
  assert.equal(item.status,'proposed-not-approved');assert.equal(item.contract,item.primaryEffect);
  assert(Number.isInteger(item.anchor)&&item.anchor>=1&&item.anchor<=40);
  const c=p.effectContracts[item.contract];assert(c,'No contract '+item.id);
  assert(['held','active','consume'].includes(c.mode));assert.equal(c.cost,c.mode==='held'?0:1);
  for(const key of ['formula','trigger','limit','guard'])assert.equal(typeof c[key],'string');
  assert(Object.values(c.parameters).every(v=>typeof v==='boolean'||Number.isFinite(v)&&v>0));
}
assert.equal(new Set(p.items.map(i=>i.merchantId)).size,8);
for(const merchant of new Set(p.items.map(i=>i.merchantId)))assert.equal(p.items.filter(i=>i.merchantId===merchant).length,6);
assert.deepEqual(p.meaningProposals.map(i=>i.id),audit.decisions.filter(i=>i.status==='pending').map(i=>i.id));
assert(p.meaningProposals.every(i=>i.status==='proposed-not-approved'&&p.effectContracts[i.effectId]));
assert.equal(read('remaining48-decisions.json').decisions.find(i=>i.effectId==='E05').numericApproval,false);
// Small independent numerical examples expose proposed caps/rounding. These are NOT runtime effect tests.
const examples=[];
const params=id=>p.effectContracts[id].parameters;
for(const rarity of [1,2,3,4,6,8])for(const copy of [false,true]){
  const s=rarity*(copy?.4:1),eligible=100;
  const challenge=Math.min(params('E05').discountMaxBps,5000+Math.floor(Math.min(params('E05').familyCapBps,params('E05').bonusBps*s)));
  const interest= Math.floor(Math.min(params('E46').sharedBonusCapBps,200*s+params('E46').bonusBps*s));
  const energy=Math.min(params('E61').familyCap,Math.floor(params('E61').energy*s));
  const asset=Math.min(params('E69').scoreCap,Math.floor(eligible*Math.floor(Math.min(params('E69').familyCapBps,params('E69').assetBonusBps*s))/10000));
  assert(challenge>=5000&&challenge<=9000);assert(interest<=400);assert(energy>=0&&energy<=2);assert(asset>=0&&asset<=20);
  const L=10,V=18,H=30,r=Math.floor(Math.min(params('E02').familyCapBps,params('E02').narrowBps*s))/10000,lo=Math.floor(L+(V-L)*r),hi=Math.ceil(H-(H-V)*r);
  assert(lo<=V&&hi>=V&&lo>=L&&hi<=H);
  examples.push({rarity,copy,strength:s,energy,extraChallengeBps:challenge-5000,ringAndBuoyBonusBps:interest,assetBonusFor100:asset,priceRange:[lo,hi],binaryRight:s>=1});
}
assert.equal(examples.find(x=>x.rarity===1&&x.copy).energy,0);
assert.equal(examples.find(x=>x.rarity===1&&x.copy).binaryRight,false);
const moneyExamples=[{name:'insurance bank-limited',quote:4,freeBank:2,actual:2},{name:'empty bank',quote:4,freeBank:0,actual:0}];
for(const x of moneyExamples)assert.equal(x.actual,Math.min(x.quote,x.freeBank));
assert.equal(Math.floor(29*.10),2);assert.equal(Math.floor(20*.14),2); // fresh money excluded; bonus never exceeds4pp
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const lines=['# Remaining48 — สเปกทดลอง v1','',`วันที่ ${p.date} · **รออนุมัติ ยังไม่ลงเกม**`,'',
'[หน้าทบทวน](remaining48-experimental-v1.html) · [ข้อมูลต้นทาง](remaining48-experimental-v1.json) · [Audit ปัจจุบัน](../remaining48-audit.html) · [Context กลาง](../logic-item-relations.html)','',
'E05 อนุมัติเฉพาะความหมายแล้ว; ชุดนี้เสนอ 9 ความหมายที่เหลือและค่าทดลองทั้ง48 ไม่ถือว่าผู้ใช้อนุมัติโดยอ่านหรือไม่มีคำตอบ ราคาฐานไม่ใช่ราคาขายตายตัว ผลเสริมยังปิดอยู่ทั้งหมด ไม่มีการอ้างผล balance จากตารางนี้','',
'## กฎร่วม','',...p.globalRules.map((s,i)=>`${i+1}. ${s}`),'','## 9 ข้อที่ต้องตัดสินพร้อมชุดนี้','',
...p.meaningProposals.map(g=>`- **${g.id} / ${g.effectId}**: ${g.decision}`),'','## รายการ48ชิ้น','',
'| พ่อค้า | สินค้า | Anchor | ผลหลัก | แบบ / พลัง |','|---|---|---:|---|---|',
...p.items.map(i=>`| ${i.merchantId} | ${i.name} (${i.id}) | ${i.anchor} | ${i.primaryEffect} | ${p.effectContracts[i.contract].mode} / ${p.effectContracts[i.contract].cost} |`),
'','## สัญญาผลหลัก35กลุ่ม',''];
for(const [id,c] of Object.entries(p.effectContracts))lines.push(`### ${id}`,``,`${c.mode} · ${c.cost} พลัง · ${p.items.filter(i=>i.contract===id).map(i=>i.name).join(', ')}`,'',
`- ตัวเลข: ${JSON.stringify(c.parameters)}`,`- สูตร: ${c.formula}`,`- เกิดเมื่อ: ${c.trigger}`,`- สิทธิ์/เพดาน: ${c.limit}`,`- ข้อยกเว้น: ${c.guard}`,'');
lines.push('## หลักฐานที่ต้องมีหลังอนุมัติ','',...p.requiredVerification.map(x=>'- '+x),'',
'## ผลตรวจเอกสารเท่านั้น','',`ตรวจ48IDs/8พ่อค้า/35contracts/9meaning proposals, source hashes, primary/type และ12ตัวอย่าง rarity×copy ได้ ตัวอย่างคณิตศาสตร์ไม่ใช่หลักฐานว่า runtime ทำงานหรือ balance แล้ว`,'',
'E69 เสนอเพิ่มคะแนน A แบบจำกัดแยกเฉพาะ assets; E40 จำกัดเฉพาะ NPC trust loss; E25 จำกัด creation ของ Beast/Alien; นี่เป็น material rule decisions ที่ต้องอนุมัติก่อนโค้ดตาม AGENTS.md ส่วนค่า pilot8, weights และ baseline เดิมยังตรึงไว้','');
const css=fs.readFileSync(path.join(doc,'remaining48-audit.html'),'utf8').match(/<style>([\s\S]*?)<\/style>/)?.[1]??'';
const list=values=>'<ul>'+values.map(x=>'<li>'+escape(x)+'</li>').join('')+'</ul>';
const sections=Object.entries(p.effectContracts).map(([id,c])=>`<section id="${id}"><h2>${id} · ${escape(p.items.filter(i=>i.contract===id).map(i=>i.name).join(' / '))}</h2><p><strong>${c.mode} · ${c.cost} พลัง</strong></p><dl><dt>ค่าทดลอง</dt><dd><code>${escape(JSON.stringify(c.parameters))}</code></dd><dt>สูตร</dt><dd>${escape(c.formula)}</dd><dt>เมื่อไร</dt><dd>${escape(c.trigger)}</dd><dt>เพดาน/สิทธิ์/เงินทุน</dt><dd>${escape(c.limit)}</dd><dt>ห้าม/ยกเว้น</dt><dd>${escape(c.guard)}</dd></dl></section>`).join('');
const rows=p.items.map(i=>`<tr><th>${escape(i.name)}<br><small>${escape(i.id)}</small></th><td>${i.merchantId}</td><td>${i.anchor}</td><td><a href="#${i.contract}">${i.primaryEffect}</a></td><td>${p.effectContracts[i.contract].mode} / ${p.effectContracts[i.contract].cost} ⚡</td></tr>`).join('');
const html=`<!doctype html><html lang="th"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Remaining48 — สเปกทดลองรออนุมัติ</title><style>${css}\nsection{margin:24px 0;padding:20px;border:1px solid #555;border-radius:12px}dl{display:grid;grid-template-columns:180px minmax(0,1fr);gap:12px}dt{font-weight:700}dd{margin:0;overflow-wrap:anywhere}code{white-space:normal}th small{font-weight:400}nav{line-height:2} @media(max-width:700px){dl{grid-template-columns:1fr}dd{margin-bottom:12px}}</style><main><nav><a href="../logic-item-relations.html">Context กลาง</a> · <a href="../remaining48-audit.html">Audit</a> · <a href="remaining48-experimental-v1.json">JSON</a> · <a href="remaining48-experimental-v1.md">Markdown</a></nav><h1>สินค้าอีก48ชิ้น — สเปกทดลอง v1</h1><p><strong>รออนุมัติ · ยังไม่ลงเกม · ไม่ใช่ผล balance</strong> · ${p.date}</p><p>8พ่อค้า ×6ชิ้นที่เหลือ · 35กลุ่มผลหลัก · 9ความหมายรอตัดสิน · E05อนุมัติความหมายแล้ว แต่ตัวเลขยังรอ · Optional effectsปิดทั้งหมด · 8ชิ้นนำร่องยังใช้สเปกเดิม</p><h2>สิ่งที่ต้องอนุมัติ</h2><p>ความหมาย9ข้อ ตัวเลข/ราคา/ต้นทุน/เพดานและlifecycleทั้ง48ตามหน้านี้ รวม E69 โบนัสเฉพาะคะแนนทรัพย์สิน (ไม่ใช่ตัวคูณทุกคะแนน) การอนุมัติเป็นค่าทดลองเพื่อเชื่อมและวัดผล ไม่ใช่รับรองรุ่นเปิดเล่นหรือเปลี่ยน baseline UI</p>${list(p.meaningProposals.map(g=>g.id+' / '+g.effectId+': '+g.decision))}<h2>กฎร่วม</h2>${list(p.globalRules)}<h2>สินค้า48ชิ้น</h2><p>กดรหัสผลเพื่อดูสูตร/สิทธิ์/ข้อยกเว้น · Anchorคือฐานก่อนสุ่มราคา/rarity ไม่ใช่ราคาขายตายตัว</p><div style="overflow-x:auto"><table><thead><tr><th>สินค้า</th><th>พ่อค้า</th><th>Anchor</th><th>ผลหลัก</th><th>แบบ / ต้นทุน</th></tr></thead><tbody>${rows}</tbody></table></div>${sections}<h2>สิ่งที่ต้องพิสูจน์หลังอนุมัติ</h2>${list(p.requiredVerification)}<p>ผ่านเฉพาะความครบของเอกสารและตัวอย่างคณิตศาสตร์12กรณี ยังไม่มี runtime ใหม่/ภาพใหม่/การทดลอง balance ของ48นี้ ผลauditปัจจุบันยังคง8native+48absentตามจริง</p></main></html>\n`;
const outputs={
  'proposals/remaining48-experimental-v1.md':lines.join('\n'),
  'proposals/remaining48-experimental-v1.html':html,
  'proposals/remaining48-experimental-v1-check.json':JSON.stringify({status:'proposal-structure-and-paper-math-pass-only',proposalSha256:sha(file),sourceHashes:p.sourceHashes,counts:{items:48,merchants:8,contracts:35,pendingMeanings:9},examples,moneyExamples,runtimeTestsRun:false,balanceVerified:false,approved:false},null,2)+'\n',
};
for(const [file,content] of Object.entries(outputs))if(process.argv.includes('--check'))assert.equal(fs.readFileSync(path.join(doc,file),'utf8'),content,'Stale generated proposal '+file);else fs.writeFileSync(path.join(doc,file),content);
console.log('PASS: remaining48 proposal structure, pinned sources and12 paper examples; NOT approval/runtime/balance evidence.');
