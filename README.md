# Cursed Market — ตลาดวัตถุต้องสาป

Active Project #1; อีก 3 concepts พักไว้โดยไม่กำหนดเวลากลับมาทำ

**สถานะ 2026-10-14:** กติกา [Survival + Collector v0.5](docs/plan/Survival_Collector_v0.5.md) แยกชีวิตกับพลัง พลัง 0 ยังพบ encounter ได้ ชีวิต 0 เป็นผู้ชมจนจบ run เล่นจนทุกคนตาย แล้ว Collector รวมมูลค่าสินค้าและเครดิตพร้อมผลคะแนนจากสถานะ เปิดบน LAN **http://192.168.10.150:3107** ผ่าน352tests,build,120seededreplays และ6actualLANruns ทั้งสองโหมด รุ่นก่อนและห้องเดิมเก็บไว้ หลักฐานเทคนิคไม่พิสูจน์ความสนุก; ยังต้องทดสอบกับคนหลัง feedback ว่ารุ่นแรกซ้ำและคาดเดาง่าย

## เกมที่ส่งมอบ

ผู้เล่น 2–4 คนเลือกประตูพบ Orc, Vampire, Autometa, Alien, Dark One หรือ Beast ประเมิน ตรวจ ต่อรอง และซื้อวัตถุด้วย credit หรือรับเงื่อนไข บริหารพลัง ของที่ถือ และผลดี/ผลเสีย ซื้อขาย/แลกกับเพื่อนหรือซื้อข้ามร้านเมื่อได้รับสิทธิ์ หน้าการ์ดภาษาไทยใช้ข้อมูล private DTO จริงพร้อมต้นทุน ราคาที่ยอมรับ ความเสี่ยงและสัญญาก่อนยืนยัน

- ไม่กำหนดจำนวน encounters ต่อ run; จบเมื่อทุกคนชีวิตหมด มี 50 RNG events และ 20 combined buff/debuff types มี resolver และ effect tests ครบ
- Dark Market สุ่มเปิดก่อน encounter มี demand 1+ รับซื้อถึงจบ encounter รวมของที่เพิ่งซื้อ ขายรับเครดิตทันที มี quota/budget และ prior sold types อยู่ใน pool
- พลัง 0 ยังเลือกประตูและรับดีลฟื้นได้; ชีวิต 0 เป็นผู้ชมถาวรใน run นี้ ของ/เครดิต/สถานะรอ Collector ไม่มีฟื้นฟรีหรือโบนัสคะแนนรายช่วง
- NPC กดราคาต่ำมีความเสี่ยงถูกจับได้; P2P ราคาต่ำไม่มี NPC retaliation โอนของ/เงินอย่าง atomic และ retry ไม่ทำซ้ำ
- ห้องส่วนตัว ready/start/reconnect/results/rematch พร้อม audit schema-v4/v5; เจ้าของตั้งจับเวลา/ไม่จับเวลาและเวลา 4 ช่วงได้ก่อนเริ่ม ห้องอยู่ใน memory ไม่มีฐานข้อมูล
- ภาพ NPC 6 และสินค้า 10 เป็น assets แยกพร้อม exact prompt provenance; ฟอนต์ไทย self-hosted, bounded motion/reduced-motion และเสียงเลือกเปิดได้

Card + realistic art เป็นแนวทำงานของ goal ไม่ใช่ final brand approval [ภาพสามแนว](docs/art/concepts/v0.4/README.md) ยังเป็น concept exploration ไม่ใช่ภาพหน้าจอ runtime ที่ตรวจแล้ว สินค้า 30 ชนิดใช้ภาพร่วมตาม 10 หมวดเดิม ตัวเลข balance และ split buff/debuff 10/10 เป็นการทดลองของผู้ช่วยใน [decision ledger](docs/plan/Appraisal_Rules_Decisions_v0.4.md)

## รัน v0.5

Node.js 22.12+:

```sh
npm ci
npm run build
APPRAISAL_RULES=survival PORT=3107 HOST=0.0.0.0 npm run start:appraisal
```

เปิด `http://localhost:3107` บน server; คนละเครื่องใช้ LAN IP กับ port ที่เปิด สร้างห้อง ส่งรหัส เจ้าของเลือกจับเวลา/ไม่จับเวลาและกดบันทึกก่อนทุกคนพร้อม แล้วเจ้าของเริ่ม ดู [LAN guide](docs/plan/Appraisal_LAN_v0.5.md) สำหรับวิธีเล่น/reconnect/เปลี่ยน IP ดาวน์โหลด audit หลังจบ **ก่อน rematch/restart**

`npm start` และ `npm run dev` ยังใช้ legacy auction v0.3 แยกจาก `start:appraisal` พอร์ตเดิม 3100/3101/3102/3103/3104/3105 เก็บไว้ ไม่ restart/kill ใน session นี้ Appraisers ใช้ `dist/appraisal-client`; legacy ใช้ `dist/client` ไม่มี public hosting หากไม่ตั้ง `APPRAISAL_RULES=survival` จะใช้กติกา v0.4

## ตรวจและอ่าน audit

```sh
npm test
npm run build
node docs/validation/survival-v0.5/check-simulation.mjs
npm run replay -- path/to/downloaded-match.json
npm run --silent playtest:report -- path/to/downloaded-match.json > /tmp/appraisal-report.json
```

Survival ใช้ 10 seeds ต่อ 2/3/4 คน × 4 policies = 120 runs เก็บในโฟลเดอร์ v0.5 แยกจาก baseline เดิม Replay รองรับ appraisal raw/room v0.4/v0.5 และ legacy v0.1/v0.2/v0.3; report ใช้ downloaded room envelope ที่มี roster/timing แล้วตรวจ replay Logs ไม่ระบุว่ามีคนจริง ไม่บอกความสนุกหรือความสมัครใจของ rematch

[ผล Survival + Collector](docs/validation/survival-v0.5.md) เป็นหลักฐานปัจจุบัน [ผลแก้รูปและตั้งเวลา](docs/validation/appraisal-timers-v0.4.md) เก็บแยกไว้ [ผลขยายคลัง 30 ชนิด](docs/validation/appraisal-catalog-v0.4.md) และ [รายงานส่งมอบเดิม](docs/validation/appraisal-delivery-v0.4.md) เก็บแยกไว้ [simulation กติกาปัจจุบัน](docs/simulation/survival-v0.5/summary.json) และ [catalog baseline](docs/simulation/appraisal-catalog-v0.4/summary.json) เก็บแยกจาก [M1/M2](docs/validation/appraisal-domain-v0.4.md), [M3](docs/validation/appraisal-network-v0.4.md) และ legacy baselines ไม่มีการปรับ balance อัตโนมัติจากคะแนน bot

## Architecture

| ส่วน | หน้าที่ |
| --- | --- |
| `src/game/appraisal/` | Authoritative seeded rules, life/energy/Collector, 50 events/20 statuses, private views, ledger/replay |
| `src/server/appraisal-rooms.ts` และ `appraisal-messages.ts` | Rooms/seat identity, validation, safe defaults, host timer settings, atomic latest-state actions |
| `src/server/room-lifecycle.ts` | Lifecycle ที่ appraisal และ legacy ใช้ร่วมกัน |
| `src/shared/appraisal-protocol.ts` | Typed private DTO/actions และ downloaded schema-v4/v5 room audit |
| `src/appraisal-client/` | React Thai card UI, reconnect/retry, generated art/self-hosted fonts |
| `src/server/appraisal-main.ts` | Appraisal entry, default port 3103, explicit survival rule flag, independent bundle |
| `src/simulation/appraisal.ts` และ `replay.ts` | Multi-policy seeded runs และ versioned replay CLI |
| `src/playtest/` | Downloaded legacy/v4 audit validation และ factual metrics |
| `src/game/`, `src/client/`, `src/server/main.ts` | Preserved legacy auction/roguelike kernel, UI and entry |

Server ไม่ส่ง seed, future offers, hidden truth หรือ internal audit ก่อนจบให้ client สิทธิ์ actor มาจาก opaque seat token ไม่เชื่อ playerId จาก JSON Request/encounter/match IDs ป้องกัน packet เก่าและการคิดเงินซ้ำ ภาพสินค้าอิงชนิด ไม่เปลี่ยนตามความแท้/คำสาปที่ซ่อนอยู่

## Playtest ถัดไป

ใช้ [protocol v0.5](docs/playtests/appraisal-v0.5.md) และ [แบบบันทึก](docs/playtests/appraisal-session-v0.5.md): กลุ่มแรก LAN 3–4 คน แล้วเปรียบเทียบ voice/no-voice และกลุ่ม 2 คน จดเหตุผลเลือกประตู/ประเมิน/เก็บ/ขาย ความเสียดายจากตลาด ความรู้สึกต่อความเสี่ยง เวลาที่เป็นผู้ชม การฟื้นชีวิต/พลัง ความเข้าใจคะแนน Collector และ rematch ที่ผู้เล่นขอเองก่อนผู้จัดชวน หากยังเลือกแบบเดิมทุกครั้ง ให้แก้กติกาตามหลักฐานก่อนเพิ่ม art/events

รอบขัดเกลา UI 2026-10-14 ผู้ใช้อนุญาตให้ใช้เครื่องมือตรวจภาพแล้ว (แทนคำสั่งหยุดตรวจภาพเดิม): พบว่า client ใน browser ปฏิเสธห้อง v0.5 ทุกห้อง จึงแก้พร้อม test ตรวจหน้าจอจริงบน dev server ที่ 1440×900 (lobby/ประตู/ประเมิน/ต่อรอง/ผล encounter), 375×812 (ประตู/ประเมิน/ผล/Collector) และ 1280×800 (Collector) แล้ว smoke test bundle จริงที่ 375×812 และ 1000×800 ยังไม่เห็นในเบราว์เซอร์: ผู้ชมกลาง run, แถว Dark Market ที่ขายได้, เหตุการณ์ E48+, นับถอยหลังใกล้หมด และห้อง v0.4 ยังไม่รับรอง screen reader หรือคุณภาพ art จริง ยังไม่มี human fun/balance/final brand approval ไม่รวม accounts/ranking/combat/permanent progression/Three.js world/in-app voice/automation

ประวัติ: [GDD v0.1](docs/plan/Cursed_Market_GDD_v0.1.md), [feedback แรก](docs/playtests/2026-10-13-first-feedback.md), [v0.2 wagers](docs/validation/curse-wagers-v0.2.md), [v0.3 roguelike](docs/validation/roguelike-run-v0.3.md), [legacy simulation](docs/simulation/engine-v0.1/report.md), [สถานะโครงการ](docs/plan/Project_Status.md)
