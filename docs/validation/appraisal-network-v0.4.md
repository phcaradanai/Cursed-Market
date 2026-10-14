# v0.4 appraisal rooms — M3 validation

2026-10-13 — M3 ผ่านในระดับ room/protocol/HTTP/WebSocket จริง พร้อมหลักฐาน domain ก่อนหน้า **ยังไม่ใช่ต้นแบบที่ผู้เล่นกดผ่านหน้าเว็บ v0.4 ได้** Main/client/LAN ที่เปิดอยู่ยังเป็น v0.3; Goal ส่งมอบเต็มยัง active และงานต่อคือ M4

## สิ่งที่ส่งและตรวจ

- `src/server/room-lifecycle.ts` รวม seat/token/host/lobby/ready/reconnect/rematch/idle cleanup ที่ v0.3 และ v0.4 ใช้ร่วมกัน ส่วน kernel/command/private view/audit/defaults แยกตามกติกา ไม่เพิ่มตัวเลือกโหมดเกมให้ผู้เล่น
- `AppraisalRoomService` เชื่อม authoritative kernel v0.4 กับ transport เดิมผ่าน `createApp({ rooms: new AppraisalRoomService() })` Parser ใหม่รับทุก action โดย allowlist และใส่ actor จาก seat ที่ผูกกับ socket เท่านั้น ไม่รับ playerId/seed/eventId/price ที่ client แอบกำหนด
- Deadline ทดลอง PORTALS30s / APPRAISAL90s / TRADE45s / REVEAL4s ผูกกับ phase ไม่ขยับเมื่อ action ยังไม่เลื่อน phase คำสั่งที่เข้าตั้งแต่ deadline ใช้ defaults ของช่วงที่หมดเวลาแล้วและตอบ `phase-expired` ไม่รับ action ไปลงช่วงใหม่
- Timeout ส่ง done เฉพาะผู้ยัง active/pending: optional event ปฏิเสธ, ผล NPC ที่ยอมรับความเสี่ยงแล้วต้อง settle ผู้พักไม่ขวาง phase; all-offline ยังเดินจน RESULTS ได้ภายในเวลา idle30นาที
- หลังทุกคน offline ถ้า host เดิมยังไม่กลับ คนแรกที่ resume รับสิทธิ์ host การ close ของ socket ที่ถูกแทนไม่ตัด socket ใหม่; token/inspection/pending event key/accepted request เก็บต่อได้
- Retry command เดิม ack โดยไม่เพิ่ม revision/ledger/item transfer; request ID เดิมแต่ข้อมูลต่างกัน, match/encounter/event key เก่า, ของขายแล้ว และ competing offer ปฏิเสธตาม state ล่าสุด
- Room audit schema4 เป็น envelope ของ `run: AppraisalAudit` พร้อมชื่อ seat/voice condition/timestamps/timeouts/phase timings ดาวน์โหลดหลัง RESULTS เท่านั้น `run` replay ตรวจ ledger/history/items/trace/final ตาม engine เดิมได้ ไม่แก้ schema1 audits หรือ baseline v0.1–v0.3

## หลักฐานล่าสุด

`npm run build:server` ผ่าน และ `npm run build:client` ผ่านสำหรับ frontend v0.3 ที่ยังไม่เปลี่ยน

`APPRAISAL_NETWORK_EVIDENCE_DIR=/tmp/cursed-market-v04-network-evidence node --test --test-reporter=spec dist/tests/*.test.js` ผ่าน **204 tests; 0fail/0skip**: 116 appraisal-domain +22 M3ใหม่ (12HTTP/WebSocket,10parser/room) +66 regressionเดิม Bind temporary127.0.0.1 ports ผ่าน automatic approval review เพราะ sandbox ปกติห้าม listen ไม่แตะ process LAN

Actual socket coverage: run2/3/4คนตั้งแต่ portal ถึง RESULTS, score/history/replay, rematch/reset, stale match/encounter, actor/secret injection, reconnect/retry/conflict, private inspection/trades/tokens, all-offline timeout2/3/4คน, Dark Marketซื้อของใหม่มาขายทันที/quota/retry/open through TRADE/close at REVEAL, P2Pราคา0ไม่มีNPCreaction, cross-shopจ่ายNPC+feeatomicหรือrollbackทั้งก้อน, competing buyers, exhausted/deadทุกseatแล้วกลับ encounterถัดไป

Run หลักใช้ configจริงและ DTO-only trader bot; ตรวจ score/replay ของ auditจริงจาก socket การตรวจ death ใช้ server-side E50 branch fixture ที่ระบุชัดใน test ไม่ export เป็น seeded run ส่วน cross-shop/P2Pใช้ credit500 fixture และ Dark Marketเลือก bounded fixture seed ที่มี route hintตรง demandพร้อมเปิดตลาด100%; ไม่อ้างว่า oddsเหล่านี้เป็นค่าproduction หรือ humanplaytest

Auditsต่อไปนี้เป็น synthetic completed socket runs ใช้ค่าตั้งต้น40credit/10energy/3encounters:

- [2 players](appraisal-network-v0.4/network-2-players.json): 64commands /6history rows /0timeouts
- [3 players](appraisal-network-v0.4/network-3-players.json): 87commands /9history rows /0timeouts
- [4 players](appraisal-network-v0.4/network-4-players.json): 133commands /12history rows /0timeouts
- [Source hashes](appraisal-network-v0.4/source-sha256.json) ระบุไฟล์ room/protocol/tests ที่ใช้กับผลนี้

[Domain evidence](appraisal-domain-v0.4.md) และ [1,200 seeded runs](../simulation/appraisal-v0.4/summary.json) ยังใช้ได้: kernel/simulation sourceทั้ง10ไฟล์ตรง manifestเดิม จึงไม่รัน simulationซ้ำเมื่อแก้เฉพาะ room layer ผลbotไม่พิสูจน์ความสนุกหรือdominant strategy

## ข้อแก้และข้อจำกัด

การทดสอบ all-offline พบ hostค้างที่seatofflineหลังresume จึงแก้ shared lifecycle ให้ hostคนที่เชื่อมต่อกลับมาเมื่อhostเดิมยังoffline มีหลักฐานทั้งroomและactualsocketพร้อมregressionรุ่นเก่า การทดสอบdeadline/stale event/cross-shopแก้ fixtureให้เลือกประตูที่ยังเปิด, ใช้eventที่เข้าเงื่อนไข, ราคาช่วงอ้างอิงที่ผู้เล่นเห็น และ consentของDarkOneก่อนยืนยัน ไม่เปลี่ยนกติกาหรือ oddsเพื่อให้testsผ่าน

Mainยังสร้างv0.3 RoomService และclientยังใช้v0.3 protocol ตั้งใจต่อv0.4ในM4พร้อมUIก่อนเปิดLANใหม่ เพื่อไม่ส่งstateใหม่ให้หน้ารุ่นเก่า Legacy audit/replay/report CLIผ่านregressionเดิม แต่CLIอ่านv0.4 envelopeยังต้องเพิ่มในM5 ยังไม่มีภาพNPC/itemแยก, UIการ์ด, source/componentbehaviorvalidationของUIใหม่, protocolhumanplaytestv0.4 หรือLANURLv0.4

ไม่มี browser/image/responsive/accessibility QA ใหม่ตามคำสั่งหยุดของผู้ใช้ ไม่มี humanplaytest/fun claim ไม่มีsubagentหรือautomation เซิร์ฟเวอร์3100(PID99522)/3101(PID4365)/3102(PID9128)ยังLISTENและไม่restart/kill; auditsในroomเดิมไม่ถูกรีเซ็ต

## งานต่อ

M4: หน้าการ์ดภาษาไทยบนstateจริง, controlsครบทุกaction/event, actual accepted quoteแยกจากreference appraisal, NPC/item artแยกพร้อมpromptprovenance, bounded feedback หลังจากนั้นM5เชื่อมmainบนพอร์ตว่าง, CLI/replay/reportv0.4, ตรวจhandoffและprotocolhumanplaytest Goalยังไม่complete
