# BAL-02 — พิสูจน์ effect ผ่านคำสั่งและข้อมูลสาธารณะ

วันที่2026-11-02 · baseline5a44a7a. นี่คือหลักฐานใหม่แยกจาก8pairedpolicy auditsเดิมที่coverageไม่ครบ และแยกจาก29unit/lifecycle tests. ไม่ได้เปลี่ยนตัวเลขeffectหรือproductcode

## วิธีทำและรันซ้ำ

```
npm --prefix apps/comic run build:server
node apps/comic/scripts/pilot-public-run.mjs /tmp/pilot-public-repeat
```

แต่ละcaseมีtimeout50sในrunner. รอบที่บันทึกนี้ยังครอบทั้งrunnerด้วยexternal50s boundและจบexit0. ใช้fixedseedsที่บันทึก ไม่ค้นseedใหม่อัตโนมัติในregression หากseedนั้นพิสูจน์ผลเดิมไม่ได้ต้องfail. Harnessแบบdiscoveryแยกใช้ `pilot-public-scenarios.mjs KIND OUT SEED_INDEX` ครั้งละไม่เกิน24seed; ผลค้นเก็บในdiscovery.json ไม่ใช่สัดส่วนชนะ

สร้างเกมจากconfigจริง,เลือกประตู/ซื้อของที่สร้างจริง,ใช้`applyAppraisalAction`ทุกการกระทำ และadvanceตามวงจร. Actorมีเพียงpublic`appraisalViewFor`; ไม่มีsetterไปยังstate/privateitem/เงิน/ชีวิต, ไม่ถามRNGเพื่อเลือกมือ. ใช้public cautious event decisionเดิมเฉพาะแก้eventที่เกิดจริง. เปรียบเทียบseed+configเดียวกัน โดยcounterfactualฝากสินค้าจริงในช่วงREVEALที่รับเงินแล้ว หรือเว้นการเปิดโล่. ไม่ใช่ปลอมhelditemsหรือแก้ค่าผลโดยตรง

**Configทดสอบ:**2คน,catalog4,startingCredits500,ชีวิต6,Collectorช่วง3,secureEconomy/core2/expansionเปิด,ปิดmarket offers/npcEvents/polish/wishlistเพื่อแยกกลไก. DEFAULTส่วนอื่นเก็บในaudit. เงิน500เป็นทรัพยากรตั้งต้นที่ประกาศในconfig ไม่ใช่เติมเงินระหว่างรัน; ยังคง **ไม่ใช่balanceของห้องปกติ40เครดิต**. Counterfactualดาบใช้สองactorส่งมือที่กำหนดไว้ ไม่อ่านมือที่ปิดอยู่ จึงเป็นcooperative mechanism proof ไม่ใช่PvP strategy win-rate

## ผลที่ตรวจผ่าน

| สินค้า | ถือ/ใช้จริง | ฝาก/ไม่ใช้ | ผลที่วัดได้ |
|---|---:|---:|---|
| โล่เขี้ยวออร์ก | เปิดใช้1พลัง; natural settlementเสีย0ชีวิต | ไม่เปิด;เสีย1ชีวิต | ป้องกัน1ชีวิต; ไม่อ้างว่าผ่านทุกcurse/mandatory-priceจากcaseนี้ |
| แหวนตราราตรี | เงินต้น100ครบช่วง จ่าย12 | แหวนอยู่คลัง จ่าย10 | โบนัส2เครดิต; quoteตรงเงินรับ |
| คาลิเปอร์วัดแรงบิด | ตรวจราคาจ่าย0พลัง | ตรวจรายการเดียวกันจ่าย1 | ประหยัด1พลังและมีpilot-price-checkจริง |
| เครื่องแปลความคิด | ยอมรับราคา10 | ไม่ยอมรับราคา10 | item/action/seedเดียวกัน,ถือเทียบฝาก;เลือกseed233ที่ข้ามขอบการยอมรับ ไม่ใช่ประมาณโอกาสรวม |
| เหรียญผ่านแดน | คดีจากNPCดวลแพ้จริง จ่าย38 | คดีเดียวกันจ่าย48 | ประหยัด10เครดิตและล้างคดีจริงทั้งคู่ |
| เข็มทิศกระแสน้ำ | เปลี่ยนประตูครั้งถัดไปจ่าย2พลัง | จ่าย3พลัง | quoteตรงค่าจ่าย;ประหยัด1 |
| ค้อนรัง | เพิ่มช่องคลังจ่าย6 | จ่าย10 | ประหยัด4เครดิต;quoteตรงค่าจ่าย |
| ดาบเขี้ยวรอยแยก | ประกาศ+1ก่อนมือ;ชนะตาเสมอแรก | ไม่มี+1;เสมอไปตา2 | มีpilot-sword-usedจริง ไม่อ่านguardหรือมือฝ่ายตรงข้าม |

**8/8pairedcases,16/16fullrunsจบRESULTSพร้อมCollector2คน.** แต่ละauditstrict replayในscenarioและrunnerซ้ำ รวม32replay checks ไม่ใช่32รันที่เป็นอิสระ. มี31–40commandsต่อรัน. Source+compiled fingerprintsและhashauditทั้งหมดอยู่ใน [public-effects.json](../../validation/pilot-public-2026-11-02/public-effects.json); rawcommands,trace,ledger,finalsnapshotsและlogsอยู่directoryเดียวกัน. รายงานผูกกับ5a44a7a+scriptworktreeตามfingerprints ไม่อ้างว่าscriptมีอยู่ในcommitนั้นแล้ว

Discoveryพบการตั้งexpansion=falseทำให้Swarm/Deepseaไม่อยู่pool จึงแก้configทดสอบให้เปิดraceครบก่อนfinalrun. Swordannouncementต้องจับก่อนสิทธิ์ถูกใช้ ไม่ใช่อ่านจากผลดวลที่หมดสิทธิ์แล้ว. เป็นข้อแก้harness ไม่ใช่บั๊กruntime. Seedsที่ไม่มีmerchant/ไม่เกิดboundary/failedassertไม่ถูกนับเป็นpass และบันทึกไว้

## ขอบเขตที่ยังไม่ผ่าน

ไม่ใช่การทดสอบsocket/UIใหม่,ไม่ใช่4คน/multiseed/unbiasedpolicy/40-credit scarcity/ยาวถึงCollector15,ไม่ใช่หลักฐานfull56/optional effects/strategic paths/รางวัล. หลักฐานcopy/raritycap/escrowcornercasesยังเป็นชุด29เดิมแยกกัน. ไม่ทำให้goalทั้งเกมเสร็จ

งานต่อ:เชื่อมCollector3+2ตามสเปกที่ผู้ใช้อนุมัติแล้ว; เพิ่มหลายseed/real-budgetpoliciesพร้อมเศรษฐกิจและcoverageก่อนtuneค่า. อย่าเปลี่ยนlivebotให้รู้truthเพื่อทำให้ผลตรวจผ่าน

## Checkpoint verification

Comicserverbuildผ่าน;fixedrunnerexit0ครบ8cases/16audits/32strictreplaychecks; Atlaschecker160inputsรวมapprovedproposalSHA/publicproofsource+compiled+auditSHAผ่าน; oldcoverage/new56freshnesschecksผ่าน; ui:check386และui:test10ผ่าน. ไม่มีproductUI/CSSเปลี่ยนจึงไม่อ้างfreshscreenshot/menu/networkrunรอบนี้; หลักฐานUIล่าสุดคง518d702ตามวันที่จริง. Trail20lexicalconflictsยังเป็นไฟล์.impeccableเดิมที่ไม่นำเข้าcommitนี้

Collector-engine compatibility followup2026-11-02: reran all8 pairs/16 full command runs/32 strict replays against Task1 engine worktree, feature disabled. Audit bytes remain identical to10629f2; public-effects.json pins this newer source/compiled set. Original evidence remains in10629f2. No claim that Collector lifecycle itself was exercised by these native scenarios.

Collector-protocol followup: reran the same8/16/32 after public-policy opt-in branch; original no-flag audits remain byte-identical. Current fingerprints now include Task2 policy changes. Collector network proof is separate incollector-wishlist-network-verification.json, not inferred fromnative tests.
