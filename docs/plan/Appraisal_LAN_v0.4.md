# เปิดเล่น Appraisers v0.4 บน LAN

ตรวจจริง 2026-10-14 จากเครื่อง server: **http://192.168.10.150:3105** เปิดรุ่นสินค้า 30 ชนิดที่แก้รูป Dark Market และตั้งจับเวลา/ไม่จับเวลาได้ ด้วย `PORT=3105 npm run start:appraisal` และ bind `0.0.0.0` ผู้เล่นคนละเครื่องต้องอยู่ LAN เดียวกันและใช้ IP นี้; `localhost` ใช้ได้เฉพาะเครื่อง server

ตรวจ HTTP index/bundled JS/CSS, 16 PNG และ 3 TTF (21 assets) พร้อม MIME และ actual WebSocket ผ่าน IP LAN สำหรับ 2/3/4 sockets ทั้ง custom timed และ untimed รวม 6 runs เล่นจบ 3 encounters, strict replay และ rematch reset ผ่าน ดู [หลักฐาน](../validation/appraisal-timers-v0.4.md) เป็น clients สังเคราะห์จากเครื่อง server และ functional lobby DOM ยังไม่ใช่ human playtest บนอุปกรณ์ของผู้ทดสอบ

IP ปัจจุบันเปลี่ยนจาก snapshot เดิม รุ่นคลัง 10 ชนิดยังอยู่ที่3103 และรุ่น30ชนิดก่อนตั้งเวลายังอยู่ที่3104 ใช้3105สำหรับการตั้งเวลาใหม่ Default PORT ของ start:appraisal ยังเป็น3103 จึงระบุ PORT=3105 ใน session นี้

## เริ่มห้อง

1. เปิด URL สร้างห้องด้วยชื่อ/รหัสผู้เล่น ส่งรหัสห้องให้เพื่อน
2. เพื่อนเปิด URL เดียวกันแล้วเข้าด้วยรหัส เลือกมี/ไม่มี external voice ให้ตรง session
3. เจ้าของเลือก **จับเวลา** หรือ **ไม่จับเวลา** ตั้งเวลาเลือกประตู/ประเมิน/ต่อรอง/เปิดผลเป็นจำนวนเต็ม 1–900 วินาทีแล้วกดบันทึก ค่าเริ่มต้น30/90/45/4วินาที เปลี่ยนค่าจริงจะล้างสถานะพร้อม ทุกคนต้องกดพร้อมอีกครั้ง เจ้าของเริ่มเมื่อครบ
4. เลือกประตู ตรวจ/ประเมิน/รับข้อเสนอ แล้วต่อรองร่วมกัน อ่านต้นทุนและเงื่อนไขก่อนยืนยัน จบช่วงเมื่อพร้อม โหมดไม่จับเวลาต้องรอทุกคนที่ต้องตอบ และทุกคนกดยืนยันหลังเปิดผล
5. หลัง RESULTS ดาวน์โหลด JSON **ก่อน rematch** แต่ละ run เก็บไฟล์ใหม่ไม่ทับของเก่า การตั้งเวลาอยู่ต่อใน rematch; เปลี่ยนได้เมื่อกลับ lobby

Reload แท็บเดิมจะใช้ seat token จาก sessionStorage กลับที่เดิม เปิดแท็บใหม่ถือเป็นคนใหม่ โหมดจับเวลามี deadline คงที่และ safe defaults โหมดไม่จับเวลาจะรอผู้หลุดที่ยังต้องตอบกลับมาเล่นต่อ ไม่มีการหมดเวลาอัตโนมัติ ตั้งค่าระหว่าง run ไม่ได้ เสียงตั้งต้นปิดและเลือกเปิดได้

## วิธีรันใหม่เมื่อไม่มี session เล่นอยู่

ใช้ Node.js 22.12+ จากโฟลเดอร์ project:

```sh
npm ci
npm run build
PORT=3105 HOST=0.0.0.0 npm run start:appraisal
```

ห้องอยู่ใน memory; restart ทำให้ห้องและ audit ที่ยังไม่ดาวน์โหลดหาย ต้องเก็บผลก่อนหยุด ถ้า port ถูกใช้อยู่ให้ใช้พอร์ตว่างใหม่และแจ้ง URL ห้าม kill เซิร์ฟเวอร์ที่ยังมีคนเล่น IP LAN อาจเปลี่ยนเมื่อ reconnect Wi-Fi ตรวจจาก Network settings ของ server แล้วเปลี่ยน IP ใน URL

`npm start` และ `npm run dev` ยังเป็น legacy auction v0.3; v0.4 ใช้คำสั่ง `start:appraisal` และ bundle `dist/appraisal-client` แยกจาก `dist/client` พอร์ต 3100/3101/3102/3103/3104 ของ session เดิมคงไว้ ไม่ restart/kill

## ตรวจซ้ำและอ่านผล

```sh
npm test
npm run build
npm run simulate:appraisal -- --runs 100 --out /tmp/appraisal-check
npm run replay -- path/to/downloaded-v4.json
npm run --silent playtest:report -- path/to/downloaded-v4.json > /tmp/appraisal-report.json
```

100 runs ต่อ 2/3/4 คน × 4 policies = 1,200 synthetic runs ใช้ output ใหม่เพื่อรักษา baseline CLI replay รองรับ v0.4 raw/room audit และ legacy v0.1/v0.2/v0.3; report ต้องใช้ downloaded room envelope ที่มี roster/timing ไม่รับ raw simulation เป็น human session

หากเข้า URL ไม่ได้ ตรวจ IP/Wi-Fi/port และการอนุญาต local network/firewall ของเครื่อง หาก UI แสดง reconnect ให้รอหรือ reload แท็บเดิม อย่าล้าง sessionStorage ระหว่าง run ไม่มี public hosting ในขอบเขตนี้

ทำ [human playtest v0.4](../playtests/appraisal-v0.4.md) แยกจากการตรวจเทคนิค ไม่อนุมานความสนุกจากการเล่นจบ
