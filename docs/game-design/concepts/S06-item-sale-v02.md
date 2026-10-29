# S06 / item-sale v02 — comic UI pass

Draft ตามคำขอผู้ใช้ให้ comic ขึ้น ไม่อนุมัติ/ไม่แก้ runtime. ใช้ state และกฎทั้งหมดตาม S06-item-sale-v01.md และ outer frame กลางจากกระเป๋า

เพิ่มภาษา visual ที่ตัว UI: เส้นหมึกหนา caption strip สีแดง/ขาว ปุ่มพื้นราบขาวดำที่เลือกเป็นแดง เงาหมึก offset เบา และ halftone ที่ไม่รบกวนตัวหนังสือ. คงมุมมนระดับเดียว symmetry/spacing/baseline และกรอบหลักเดิม ไม่เอียง panel ไม่เพิ่มกล่องซ้อนหรือ scrolling

ภาพสินค้า cel shading/เส้นดำเข้ม ลดขนาดเล็กน้อย พื้นโต๊ะหมึกสงบ ไม่มี glow/fade ภาพล่างชิดฐาน. ตัด thumbnail พ่อค้าเหลือแหล่งที่มาเป็นข้อความ ข้อมูลไม่ซ้ำ

NPC52เครดิตยังไม่ประเมิน: facts?ทั้งหมด ประกาศขายและค่าแถมdisabledพร้อมเหตุผล โชว์ให้ดูยังเป็นactionที่กฎอนุญาตเมื่อไม่มีlock. คำระบุไม่ใช่ผลตรวจ. ภาพเป็น design-only ไม่เปิดเผยข้อเท็จจริงหรือเสนอ rule ใหม่

สร้างด้วย built-in imagegen edit จาก S06-item-sale-v01.png. Prompt อยู่ S06-item-sale-v02.prompt.txt. v01เก็บประวัติ; v02รอfeedback ไม่แทนcaptureจริงหรือโต๊ะv05

ผู้ใช้สั่งลงตามconceptแล้ว 2026-10-29; implementedในcomic buildแยก ดูC28และimplementations/S06-trade.md. ภาพconceptคงเป็นdesign reference ไม่ใช่runtime screenshot
