# BAL-02 evidence coverage — pilot8

วันที่2026-11-02 · วิเคราะห์ **auditเดิม** จาก707da16 ไม่ได้รันsimulationใหม่ และไม่ใช่ข้อสรุปว่าeffectไม่ทำงาน

## ตรวจอะไรแล้ว

`node docs/game-design/scripts/pilot-coverage.mjs` สร้างรายงาน; `--check` ตรวจซ้ำแบบไม่เขียนไฟล์. ตัวตรวจยืนยันSHA256ของexperimentและauditทั้ง8กับmanifestเดิม, catalog/player/seed, Collector snapshotตรงfinal score, item referencesไม่หาย และruntime game/simulation hashesตรงหลักฐานpilotที่ตรึงไว้. ปัจจุบันผ่านทั้งสร้าง/ตรวจซ้ำ

แหล่งต้นฉบับ: `docs/validation/new56-pilot-2026-11-01/experiment.json`. รายละเอียด/ทุกคำสั่ง/trace/ledger/config/แหล่งhash: [JSON](2026-11-02-pilot-coverage.json). ต้นฉบับexperimentใช้revision labelของworktreeก่อนcommit จึงตรวจruntimehashแยก ไม่อนุมานว่ามีแต่โค้ดcommittedขณะนั้น

## สิ่งที่ข้อมูลพิสูจน์

มี1seed,2/3คน,policy cautious/trader,catalog3/4,Collectorช่วง3 รวม8รัน. ทุกชุดมีCollectorครบและfinalscoreตรง. หลักฐานstrict replayเป็นของการรันเดิมใน707da16; ตัวตรวจใหม่นี้ไม่อ้างว่าได้replayใหม่

| สินค้าnative | instanceในaudit | ซื้อจากNPCสำเร็จ | โอนผ่านtrade-completed | ของในsnapshotCollector |
|---|---:|---:|---:|---:|
| โล่เขี้ยวออร์ก | 8 | 2 | 2 | 2 |
| แหวนตราราตรี | 29 | 5 | 6 | 5 |
| คาลิเปอร์วัดแรงบิด | 22 | 7 | 7 | 7 |
| เครื่องแปลความคิด | 8 | 0 | 0 | 0 |
| เหรียญผ่านแดน | 28 | 0 | 0 | 0 |
| เข็มทิศกระแสน้ำ | 20 | 0 | 0 | 0 |
| ค้อนรัง | 26 | 2 | 5 | 2 |
| ดาบเขี้ยวรอยแยก | 49 | 14 | 6 | 9 |

นับเฉพาะ4รันcatalog4. Instanceในauditรวมของที่สร้างไว้แต่ผู้เล่นอาจไม่เคยเห็น รวมสำเนา/ของจากability; ไม่ใช่จำนวนสินค้าที่สุ่มเห็นหรืออัตราซื้อ. โอนสินค้าชิ้นเดิมหลายครั้งนับหลายtransactionในคอลัมน์โอน ไม่ใช่unique owners. SnapshotCollectorรวมทรัพย์สินที่Collectorใช้คิดคะแนนตามcustodyเดิม ไม่ใช่แค่inventoryถืออยู่. ตารางนี้ไม่ให้รางวัลซื้อขายหรือเพิ่มคะแนน

## ช่องว่างที่เปลี่ยนงานถัดไป

- ไม่มี`activate`,`vault-deposit-credits`,`vault-expand`,`crime-clear`,`reroll-portal`,`theft-start`,`theft-hand`ในnative pairedruns. การซื้อ/ถือของจึงยังไม่ทำให้effectของโล่/แหวน/ค้อน/เหรียญ/เข็มทิศ/ดาบถูกทดสอบในpolicyเหล่านี้
- cautiousตรวจเฉพาะauthenticity ไม่มีprice inspectionให้วัดสิทธิ์คาลิเปอร์; traderไม่ตรวจ. มี`appraise`แต่ไม่มีหลักฐานว่าถือtranslatorขณะattemptและเปรียบเทียบrollเดียวกัน จึงไม่สรุปว่าผลacceptanceถูกวัดแล้ว
- ไม่ทราบการกระจายwinshare/ความแปรปรวนจาก1seed. ไม่มี4คน/ช่วงยาว/ตลาดวิญญาณ/งานกู้-ประมูล-คลัง-ขโมยที่policyใช้จริง. บางfeatureมีflag/เคสunitอยู่แล้ว แต่การเปิดflagไม่ใช่หลักฐานว่าถูกเล่น
- ทั้ง8effectยังมีหลักฐานunit/lifecycle29กรณีแยกในnew56-pilot-verification.json. ตารางcoverageนี้ไม่ยกเลิกหลักฐานนั้นและไม่กล่าวว่าระบบผิด

## งานต่อที่ตรงกับหลักฐาน

ก่อนtuneค่า ให้เพิ่มbounded scenarios/policiesที่อ่านเฉพาะpublicviewและใช้itemแต่ละชิ้นผ่านactionจริง มีbefore/afterเงิน/พลัง/ชีวิต/สิทธิ์พร้อมcounterfactualconfig+seedเดียวกัน และreplay. ต้องวัดeligibility/attempt/applied/savingsแยกกัน; การนับcommandsอย่างเดียวไม่พิสูจน์ผล. ขยายseedและจำนวนคนหลัง8ทางนี้ครบ ห้ามเปลี่ยนlivebotให้รู้truthหรือแต่งสถานะส่วนตัวเพื่ออ้างว่าเป็นการเล่นจริง

Collector3+2,strategicpaths,รางวัลและอีก48ชิ้นยังไม่มีruntimeใหม่ให้วัดครบ. คงgoalทั้งเกมเปิด และขออนุมัติกติกาที่ยังค้างจากข้อเสนอจริงก่อนเพิ่มระบบ

## Verification ของcheckpointนี้

สร้างและตรวจreportซ้ำด้วยscriptข้างบนผ่านทั้งคู่; `node docs/game-design/scripts/check-system-atlas.mjs`ผ่าน150inputs; `npm run ui:check`ผ่าน386sourcefingerprints/14baselinehashes. Main HTMLสร้างจากsourceใหม่ ไม่แก้ด้วยมือ. ไม่มีการแก้productcodeหรือCSS จึงไม่อ้างfreshpixel/menu/fullfunctionalrunในturnนี้; ใช้518d702เป็นหลักฐานUIล่าสุดตามวันที่จริง. Trailยังรายงาน20lexicalconflictsเฉพาะไฟล์.impeccableเดิมที่ไม่นำเข้าcheckpoint.
