# เครดิตจบรอบและหัวก้อย — ผลตรวจ 2026-10-14

เพิ่มกติกาตาม [คำขอเครดิตจบรอบ](../plan/Round_Credits_Coin_v0.5.md) ใน appraisal v0.4/v0.5 เกมใหม่เปิดใช้เป็นค่าเริ่มต้น บันทึกเก่าที่ไม่มี flag ยัง replay เศรษฐกิจเดิม

- `npm test`: **399 passed, 0 failed** รวมเกมเดิมและ actual HTTP/WebSocket tests การรันใน sandbox รอบแรกเปิด loopback ไม่ได้ จึงรันชุดเต็มภายนอก sandbox สำเร็จหลังแก้สมมติฐานยอดเงินเก่าและขอบเขตตัวจำลอง
- `npm run build`: ผ่าน server, legacy client และ appraisal client
- Reward regressions: รอบ 1/2/3 จ่าย 10/15/10; ชนะต่อเนื่องเพิ่ม 5; รับครั้งเดียว; แพ้หลังชนะเสียฐานและโบนัสทั้งหมด; request ซ้ำ/ลำดับเก่าไม่ reroll; สองที่นั่งไม่รบกวน RNG กัน; ออกเงินได้แม้งบร้านเป็น 0; historical exact replay; ผู้ชม Survival ไม่ได้รับเงินเพิ่ม
- Room/socket regressions: รับเงินทันที, timeout รับยอดค้าง, ready แล้วเดิมพันเพิ่มไม่ได้, กลับเข้าห้องคงยอด/ผล, rematch/old match protections และ strict audit replay
- Ego Browser ใช้ production bundle บน QA server แยกพอร์ต 3108: desktop **1440×1000**, mobile **375×900** ในห้อง 2 ที่นั่งไม่จับเวลา ตรวจรอบคี่ 10 และรอบคู่ 15, ปุ่มทั้งหมดรวมยืนยันไปต่อถูกล็อกระหว่างโยน 1.3s, ผลเปิดเมื่อเหรียญตก, ทายผิดยอด 0 แต่กระเป๋า 40 คงเดิม, มือถือไม่ล้นแนวนอน และ reduced motion ไม่มี animation พร้อมแสดงผลทาย รอบถัดไปกดรับ 10 แล้วกระเป๋าเพิ่มจาก 40 เป็น 50 และไม่มีปุ่มเดิมพันเหลือ
- Mechanical design detector มี advisory จาก sidecar เดิมที่ตาม DESIGN.md ไม่ทัน ไม่มี blocker ที่ต้องขยายงานซ่อม design system สีเหรียญใช้ token amber/bronze/ink เดิม

ภาพตรวจเป็นภาพ runtime ของกติกานี้: [desktop](round-credits-v0.5/desktop.png), [mobile ระหว่างโยน](round-credits-v0.5/mobile-toss.png), [mobile ผลทายผิด](round-credits-v0.5/mobile-result.png) ไม่ใช่หลักฐาน human fun, balance หรือ screen-reader certification การชนะซ้ำและรับโบนัสพิสูจน์ด้วย engine/room/socket/SSR tests; browser รอบนี้สุ่มทายผิดสองครั้ง

เครดิตเติมรอบทำให้เส้นทางซื้อชีวิตอาจอยู่ต่อได้ยาว ตัวจำลองกดผ่านหลังรอบ 12 เพื่อจบการทดสอบ ผู้เล่นจริงไม่มีเพดานนี้ ยังต้องสังเกตความยาว run และความเสี่ยงที่คนเต็มใจเดิมพันจากการเล่นจริง
