# MERCHANT-EXPRESSION-01 — ท่าทางพ่อค้า

ผู้ใช้ยืนยัน 2026-10-29 · กฎการนำเสนอ **S02/S04 เชื่อมและตรวจแล้ว 2026-10-31** โดยไม่เปลี่ยนกฎเกม ข้อมูลสำหรับ HTML กลางอยู่ใน `screen-flow.json` ภายใต้ `merchantExpressionRules`

| บริบท | ปฏิกิริยา |
|---|---|
| S02 ก่อนเลือกประตู | พ่อค้าทุกประตู idle |
| S02 เมื่อยืนยันเลือก | พ่อค้าที่เลือก smile และรายอื่นที่ไม่ถูกเลือก angry ก่อนเข้าสู่หน้าถัดไป |
| S04 เริ่มหน้าประเมิน | พ่อค้าที่เลือกใช้ idle |
| S04 ผลตีราคาของพ่อค้า | พ่อค้ายอมรับราคาที่เสนอ → smile; ไม่ยอมรับ → angry |

ใช้สถานะและผลยืนยันจริง ไม่เปิดข้อมูลที่ผู้เล่นยังไม่รู้ ไม่เปลี่ยน logic ต้นทุน คะแนน หรือเวลาของเกม ไม่บล็อกเมนู ใช้ `MerchantEventPortrait` และ component/token กลางที่เหมาะสม ให้ขนาดและฐานรูปพ่อค้าสม่ำเสมอ ไม่บังคับให้ภาพบิดเบี้ยว

**ตรวจ asset 2026-10-29:** comic build ที่ใช้อยู่มี `idle.png`, `smile.png`, `angry.png` อย่างละหนึ่งต่อพ่อค้า ครบ8ราย ยังไม่พบไฟล์ท่ายื่นมือแยกในโฟลเดอร์ build ที่ตรวจ ไม่ได้ยืนยันว่าไม่มีอยู่ที่อื่น ผู้ใช้ยืนยันให้ใช้เพียง 3 ท่าที่มี เริ่มหน้าประเมินด้วย idle ไม่ต้องหาหรือเพิ่มท่ายื่นมือ

ต้องกำหนด/ทดสอบระยะเวลาของปฏิกิริยาก่อนเปลี่ยนหน้า, การกลับ idle, reduced motion, การจัดลำดับเมื่อผลมาถึงซ้ำ, timeout และ reconnect โดยรักษา timer และ state ที่ยืนยันจริง ตรวจการจัดกรอบสำหรับ smile/angry ทุกคน เพราะค่ากรอบปัจจุบันตรวจเฉพาะ idle


## Implementation / evidence 2026-10-31

`merchant-reactions.ts` owns shared pure mood rules and a650ms confirmed-entry display hook. The previous portal layout is read-only during that short reaction, then shows current appraisal. Server state/actions/clocks are never delayed or reset; all6 utility controls remain accessible. A fresh/reconnected selected state does not replay entry; duplicate updates do not restart it; dead/duelling/new encounter/seat/later phase invalidates it; reduced motion skips the hold. Before selection all portals idle including closed/high-trust portals. Selected item appraisalAccepted drives mood until the item/result changes; null is idle regardless of trust/caught.

Asset dimensions/bounds were inspected for24 existing files. Beast smile/angry and Alien angry have different canvases. Existing appraisal `object-fit:cover` and bottom clip provide the same image/window rectangle for all24 poses without stretching/repainting assets; measured at1440, common layout at3 desktop widths. This is frame/cropping evidence, not a new anatomical/head-anchor calibration or human pixel approval. Existing idle-only event portrait calibration remains unchanged.

[Verification](../ui-system/merchant-expression-verification.json): targeted20/20 including real engine commands, mounted sequences3widths/24poses/reduced-motion, original14 pixel references and18 menu flows. Two old broad-test failures reproduced against parent a2102fb; not hidden or called new regressions.
