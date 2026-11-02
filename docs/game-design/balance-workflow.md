# วิธีปรับบาลานซ์จากหลักฐาน

สถานะ: workflow พร้อมใช้ มี baseline และหลักฐานทดลองเฉพาะส่วนแล้ว ดู balance-reports/ และ new56-pilot-verification.json; ยังไม่มีผลรับรอง balance ทั้งเกมหรือรุ่นเปิดเล่น

## หน่วยทดลอง

บันทึกหนึ่งชุดต่อ revision + config/profile + player count + seed set + decision policy + catalog/effect revision ห้ามรวมโหมด legacy กับ appraisal หรืออ้างผลสินค้าเก่าครอบคลุม new56

เริ่มวัด runtime ปัจจุบันเป็น baseline แยกจากกลุ่มทดลอง 8 ชิ้นและครบ 56 ผลทั้งสามเป็นคนละชุด เปลี่ยนครั้งละกลุ่มเหตุผลเพื่ออธิบายความต่างได้

## สิ่งที่ต้องวัด

| ระบบ | ตัวชี้วัด / ตรวจ invariant |
|---|---|
| เศรษฐกิจ | เงินเข้าออกตามแหล่ง, เงินใช้จ่าย/vault/debt แยกกัน, กำไรขาย/ตลาด/ประมูล, ไม่สร้างเงินจากโอนวน |
| เวลาและชีวิต | พลังต่อ action, ชีวิตที่เสีย/ฟื้น, ครั้งตายแยกจาก life lost, ช่วงที่รอด, dread/omen ที่ทำให้แพ้ |
| สินค้า/rarity | อัตราพบ/ซื้อ/ใช้/ขาย/เก็บ, ผลต่อเงินจริง/ทรัพยากร, จำนวนสำเนา, rarity ตาม profile, target ที่ไม่มีสิทธิ์ใช้ |
| พ่อค้า | ความไว้ใจ, stock, เลือกพ่อค้า, สกิล/cooldown, event exposure และข้อเสนอที่ถูกเลือก |
| เหตุการณ์ | offered/eligible/chosen/resolved แยกกันตาม family/phase/choice variant; ไม่หารด้วยทุก turn แล้วอ้างโอกาสราย event |
| PvP | พยายามขโมย/ผล RPS/timeout, โอน/loan/compensation, การสร้างสถิติซื้อขายวนเพื่อฟาร์มรางวัล |
| จบเกม | คะแนนฐาน/ผู้นำ/rarity แยกองค์ประกอบ, win share, เสมอ, ของและเงินที่ยัง escrow |
| ประสบการณ์เล่น | ตัวเลือกที่ไม่มีทางจ่าย, action ไร้ผล, เหตุผลของผลลัพธ์ใน logs, เวลา/ความสับสนในการตัดสินใจ |

ไม่มีเป้าตัวเลขความสมดุลที่ผู้ใช้อนุมัติในเอกสารนี้ ให้เสนอช่วงเป้าหมายจาก baseline ก่อนใช้งานเป็น release gate สัดส่วนชนะเท่ากันไม่ใช่เป้าตายตัวเมื่อกติกาหรือ policy ต่างกัน

## ตรวจวงจรที่ต้องไม่หลุด

- ฝาก/ถอน/เติมเงินใกล้เปลี่ยนช่วง; interest settlement ซ้ำ
- Swarm copies กับ Vampire preservation และ passive stacking
- ซื้อขาย/โอนวนเพื่อฟาร์ม shards/trust/leader awards
- Item curse/auth unknown กับ reveal/use/cleanse และการรั่วข้อมูลใน view/log
- Auction escrow/loan/Collector item custody เมื่อจบช่วง/หมดเวลา/ตาย/disconnect
- ปรับ rarity แล้วผลคูณราคา/effect/copy ซ้ำชั้นโดยไม่ตั้งใจ

## ขั้นทดลอง

1. ตรวจ invariant และแยกบั๊กก่อน tune
2. ตั้งสมมติฐาน เช่น event family หนึ่งทำให้พลังหายจนไม่มีทางเลือก ไม่สรุปจากจำนวนเส้นมากอย่างเดียว
3. เก็บ run baseline และ run candidate ด้วย seed/config/policies เดียวกัน; ทดสอบหลาย policy และหลายจำนวนผู้เล่นที่รองรับ
4. เก็บ distribution และความแปรปรวน ไม่ใช้ค่าเฉลี่ยอย่างเดียว; จำนวนตัวอย่างเพิ่มเมื่อผลยังไม่ชัด
5. เล่นจริงหนึ่งรอบครบวงจรที่เกี่ยวข้อง ตรวจ UI และเหตุผลใน logs
6. รับ/ปฏิเสธการเปลี่ยนจากผล แล้วอัปเดต context/roadmap/atlas

## รูปแบบบันทึกต่อการเปลี่ยน

- งาน ID / วันที่ / revision ก่อนและหลัง / สมมติฐาน
- กฎที่เปลี่ยนกับค่าทดลองที่ยังไม่อนุมัติ
- Entity IDs ที่กระทบ เช่น event:E131, logic:L11, item:<new56-id>
- Config, seed set, จำนวนผู้เล่น, policy, คำสั่งที่รันจริง
- ผลก่อน/หลัง, invariant failures, coverage และข้อจำกัด
- ข้อสรุป/เหตุผล rollback หรือคงค่า/งานถัดไป

ผลรายงานเก็บใน `docs/game-design/balance-reports/` เมื่อมีการทดลองจริง ไม่สร้างผลลัพธ์เปล่าหรือแสร้งเป็นผลทดสอบ
