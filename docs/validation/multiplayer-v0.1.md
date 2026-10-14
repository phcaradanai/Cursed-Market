# Milestone 2 validation — 2026-10-13

**ผล:** private multiplayer prototype พร้อมให้เริ่ม human playtest บนเครื่องเดียวหรือ LAN. กติกา GDD v0.1 ยังไม่เปลี่ยน และยังไม่มี public hosting

## Automated checks

`npm run check` ผ่านบน Node.js v22.23.1:

| ส่วน | ผล |
| --- | --- |
| Rules kernel | 25 tests ผ่าน |
| Room lifecycle / identity / deadlines | 8 tests ผ่าน |
| HTTP / WebSocket integration | 6 tests ผ่าน |
| Client typecheck + production build | ผ่าน |
| Reproducible simulation | 12,000 แมตช์ / 116,000 auctions ผ่าน |

รวม 39 tests ครอบคลุม full matches 2/3/4 คน, view ส่วนตัว, actor spoofing, bid retry, reconnect, audit ก่อน/หลังจบ, rematch, host transfer, room expiry, timeout defaults และ static-file boundary. หลังแก้ UI รอบสุดท้าย client typecheck/build ผ่านอีกครั้ง

## Browser checks

ตรวจผ่าน UI จริงใน browser 3 แท็บที่เป็นคนละ seat โดยไม่เรียก engine หรือแก้ state จาก browser:

- สร้างห้อง / เข้าห้อง / พร้อมเล่น / เริ่ม / เลือกสินค้า / guarantee / inspection / bid / reveal / results ครบสองแมตช์ แมตช์ละ 9 auctions
- Reload หลังล็อก bid 2 เหรียญ แล้วได้ seat และราคาที่ล็อกไว้กลับมา
- พบของแท้ที่มีคำสาปจริง และ Certified Genuine คืนมัดจำอย่างถูกต้อง; คำรับประกันผิดชดเชยผู้ซื้อและลดคะแนนผู้ขาย
- ดาวน์โหลด JSON จากปุ่มผลแมตช์ แล้ว replay ได้อันดับและคะแนนตรงกับหน้าจอ
- แมตช์แรกใช้ no-voice; แมตช์ที่สองเลือก external voice mode เพื่อทดสอบ metadata การเลือก mode ไม่ใช่การทดสอบ voice กับคนจริง
- Rematch ส่งทั้งสาม seat กลับ lobby โดยทุกคนยังไม่พร้อมเล่น
- LAN HTTP origin ที่ไม่มี Clipboard API คัดลอกรหัสผ่าน fallback ได้; ถ้าทั้งสองวิธีล้มเหลว source มีข้อความแนะนำคัดลอกเองและเลือกรหัสไว้ให้
- ใช้ชื่อ ASCII ยาว 24 ตัวโดยไม่มีช่องว่าง ตรวจ seller, buyer และ results ที่ desktop 1440px / mobile 390px ไม่มี document overflow; ตารางคะแนนเลื่อนภายใน container
- Live status แจ้งเปลี่ยน phase/auction/role 37 ครั้ง (4 phases × 9 auctions + results) โดยไม่แจ้งทุกวินาที

ตรวจภาพจากยอดหน้าแบบ full-page ครบ 6 ภาพในสองรอบ และแก้สามข้อจาก independent review: clipboard recovery, accessible phase notification และชื่อยาวบนมือถือ. Final review: **ship** สำหรับขอบเขต prototype

## ข้อจำกัดของหลักฐาน

Browser QA ใช้แท็บบนเครื่องเดียวและจำลองขนาดจอ ไม่ใช่การเล่นบนโทรศัพท์หลายเครื่องหรือการทดสอบ WAN. ห้องอยู่ใน memory และหายเมื่อ server restart. ดาวน์โหลดผลก่อน rematch เพราะไม่มีฐานข้อมูลเก็บประวัติ

ผล automated tests และ bot simulation พิสูจน์การทำงานตามกติกา ยังไม่พิสูจน์ความสนุก ความเข้าใจ guarantee หรือความต้องการเล่นซ้ำ. ขั้นถัดไปคือ human playtest ทั้งมี/ไม่มี external voice แล้วปรับปัญหาสำคัญตามหลักฐาน
