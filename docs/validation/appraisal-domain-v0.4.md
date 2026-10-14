# v0.4 appraisal domain — validation

2026-10-13 — M0/M1 และส่วน domain ของ M2 มี implementation และหลักฐานแล้ว **ยังไม่ใช่ต้นแบบ v0.4 ที่เล่นผ่าน LAN** [M3 rooms/network](appraisal-network-v0.4.md) ผ่านแล้วภายหลังชุดหลักฐานนี้; UI/LAN ยังเป็น v0.3 และ goal ส่งมอบเต็มยัง active

## สิ่งที่ตรวจจริง

- `npm run build:server` ผ่าน strict TypeScript สำหรับ kernel ใหม่
- ชุด `node --test --test-reporter=spec dist/tests/*.test.js` ผ่าน **182 tests**: domain ใหม่116และ regressionเดิม66 ไม่มี fail/skip Network tests ใน suite นี้เป็นของ v0.1–v0.3 ไม่ใช่หลักฐานห้อง v0.4 การ bind localhost ต้องรันนอก sandbox ที่ปฏิเสธ `listen`; ไม่ restart LAN servers
- E01–E50 ทุก ID มี forced fixture ที่เข้าเงื่อนไข, ยอมรับและตรวจผลจริง, บริบทไม่เข้าเงื่อนไขและปฏิเสธการเสนอ; E01–E47 มี decline ที่ไม่จ่าย/ไม่โอน; E48–E50 เป็นผลยืนยันความเสี่ยงที่ปฏิเสธเพื่อล้างโทษไม่ได้
- ตรวจสถานะทั้ง20ผ่านการตรวจราคา/คำสาป, ค่าใช้จ่ายbundle, โล่debuff/ทรัพย์/ตาย, สิทธิ์ต่อรอง, การใช้ซ้ำไม่บวกทับ, tick/expiry/recovery/ประตูล็อก และ D10 ไม่ทำลายพลังขั้นต่ำหลังพัก
- ตรวจตลาดสุ่มเปิด/ปิดจริงด้วย preset50%, demand1–3จากชนิดที่มีใน run, quota/budget, รับเงินทันที, owner/lock/stale/retry และชุด demand ไม่เล็ง inventory ที่เพิ่งขาย
- P2Pราคา0ไม่มีNPCreaction; cross-shop ต้องเปิดสิทธิ์และตอบรับ จ่าย NPC+ค่าตอบแทนพร้อมกัน หรือ rollback ทั้งหมดเมื่อเงินรวมไม่พอ; competing offers ปิดเมื่อของถูกโอน/รายการหาย
- ผู้พักหมดพลังทั้งหมด/ตายทั้งหมดเลื่อน phase ได้และกลับ encounter ถัดไป; ตายให้0เฉพาะ encounterนี้และเก็บคะแนนเก่า; private DTO ไม่ส่ง seed/schedule/ความจริงของเพื่อน
- 60 seeded runs ใน test สำหรับ2/3/4คนจบและ replayตรง พร้อมปฏิเสธ audit ที่ถูกแก้; schema4แยกจาก old audits
- `npm run build:client` ผ่านสำหรับ frontend v0.3 ที่ยังไม่เปลี่ยน ไม่ถือเป็น UI validation ของ v0.4

## Simulation ล่าสุด

`npm run simulate:appraisal -- --runs 100 --out docs/simulation/appraisal-v0.4` จบ **1,200 runs** (100 ×2/3/4คน ×4policies) ทุก run replay ตรวจ ledger/ownership/score/ผลสุ่มตรงกัน Bots อ่าน private DTO เดียวกับผู้เล่น ไม่อ่าน seed/base/curse ฝั่ง server

| ผู้เล่น | Policy | Runs | คะแนนเฉลี่ยต่อseat | จับผิด | ตาย | หมดพลัง | ขายDarkMarket | P2Pสำเร็จ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2 | cautious | 100 | 9.52 | 37 | 2 | 0 | 0 | 0 |
| 2 | aggressive | 100 | 3.86 | 253 | 10 | 0 | 0 | 0 |
| 2 | collector | 100 | 8.30 | 69 | 3 | 7 | 0 | 0 |
| 2 | trader | 100 | 20.16 | 111 | 1 | 0 | 183 | 12 |
| 3 | cautious | 100 | 10.08 | 44 | 0 | 0 | 0 | 0 |
| 3 | aggressive | 100 | 4.23 | 381 | 15 | 0 | 0 | 0 |
| 3 | collector | 100 | 8.06 | 114 | 4 | 14 | 0 | 0 |
| 3 | trader | 100 | 21.33 | 189 | 5 | 0 | 316 | 31 |
| 4 | cautious | 100 | 9.61 | 57 | 0 | 0 | 0 | 0 |
| 4 | aggressive | 100 | 3.90 | 514 | 25 | 0 | 0 | 0 |
| 4 | collector | 100 | 8.09 | 152 | 5 | 28 | 0 | 0 |
| 4 | trader | 100 | 19.93 | 238 | 9 | 0 | 371 | 39 |

คะแนนเฉลี่ยนี้มาจากกลุ่มที่ทุก seat ใช้ policy เดียวกันในแต่ละ scenario ไม่ใช่การพิสูจน์ dominant strategy หรือความสนุก Trader ได้คะแนนมากกว่ากลุ่มอื่นใน presetนี้ จึงเป็นประเด็นติดตามในการทดลอง ไม่ปรับ balance อัตโนมัติจาก botหรืออ้างว่าเกมสมดุลแล้ว

[Raw summary](../simulation/appraisal-v0.4/summary.json) และ [example completed audit](../simulation/appraisal-v0.4/example-run.json) เป็นข้อมูลสังเคราะห์หลังจบ run; ไม่แจก seed/audit ระหว่างเล่นจริง ทุก eventไม่ได้เกิดในทุกrun การตรวจครบ50อาศัย fixtures แยกจาก sampled coverage ในsummary

## ข้อแก้จากหลักฐานระหว่างพัฒนา

1. B04 ที่เป็นรางวัล E18 ต้องได้รับหลังใช้สถานะของ appraisalปัจจุบัน เพื่อไม่ถูกใช้ทิ้งทันที มี regression ของทางเลือกรางวัลสองแบบ
2. พบ competing-listing failure ที่ seed `appraisal-v0.4:4:trader:33`; ปิด pending offers ที่รายการ/เจ้าของ/สิทธิ์ไม่พร้อม มี fixtureผู้ซื้อสองคนและ replayของseedเดิม
3. กติกาตั้งต้นยอมรับ appraisal0เป็นราคาซื้อฟรี เพิ่ม reservation ที่สุ่มคงที่ตาม NPCและแยก reference/accepted quote มี testราคา0, reservationไม่รั่ว, ซื้อ fallbackaskและตัวอย่าง Orc20/10 detection20% ยังตรงเดิม Simulationล่าสุดใช้กติกานี้แล้ว; การทดลองก่อนเพิ่มreservationเก็บใน `/tmp` ไม่ใช่หลักฐานของเวอร์ชันล่าสุด

## ยังต้องทำก่อน goal complete

M3 ผ่านตาม [network validation](appraisal-network-v0.4.md) แล้ว (suiteล่าสุด204tests); ยังต้องทำ M4 UIการ์ดภาษาไทย/ภาพNPCและitemแยก/feedback; การส่งมอบLAN URLที่ตรวจจริง, CLI audit/reportสำหรับv0.4, คู่มือhumanplaytest และ independent finish review

ไม่มีการตรวจ browser/ภาพ/responsive/accessibility ใหม่ ตามคำสั่งหยุด QA ของผู้ใช้ ไม่ใช้ conceptPNGแทน screenshotของimplementation ความสนุกยังไม่พิสูจน์และไม่ได้เรียก human playtestในรอบนี้ เซิร์ฟเวอร์เดิม3100/3101/3102ยังฟังอยู่จาก `lsof` โดยไม่ restart

## แหล่งกติกาและโค้ด

- [Decision ledger](../plan/Appraisal_Rules_Decisions_v0.4.md)
- [Delivery checklist](../plan/Card_Appraisers_Delivery_v0.4.md)
- [Kernel entry](../../src/game/appraisal/index.ts)
- [Domain tests](../../tests/appraisal.test.ts)
- [DTO-only bots and scenario runner](../../src/simulation/appraisal.ts)
