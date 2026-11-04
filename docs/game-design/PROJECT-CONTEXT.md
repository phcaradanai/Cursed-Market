# Cursed Market — Context กลางสำหรับพัฒนาเกม

อัปเดตสถานะ 2026-11-04 · Active comic: `apps/comic/`

เริ่ม session ที่ [UI continuity](../ui-system/README.md) และ [decisions](../ui-system/decisions.md). ข้อความเส้นทาง external ด้านล่างเป็นประวัติ; อย่าแก้ backup แทน source ใน repo.

## สถานะเกมล่าสุด — ยังไม่ครบทั้งเกม

[สถานะรวมรายระบบ](game-status.json) เป็นข้อมูลสรุปที่แสดงใน HTML หลัก สถานะนี้แยก **active Comic** ออกจาก root เวอร์ชันเก่า และแยก runtime / แผน / ผลตรวจ

- ตลาดวิญญาณ S11/G01–G04 ทำและตรวจแล้วใน commit51d89ea; ดู ghost-service-contracts.md และ ../ui-system/ghost-functional-verification.json
- จุดตกหล่นสำคัญ: RULE-01 ดอกเบี้ย10%พร้อมอายุเงินต้นเชื่อมเข้า Comic รันใหม่แล้ว ตรวจผ่านแล้ว; รันเก่าไม่มีflagรักษา4% ดู implementations/comic-aged-interest-plan.md
- สินค้าใหม่ทดลอง catalog5 ลงทะเบียน56/56 (7ต่อพ่อค้า); primaryตรวจระดับownerแล้ว21 (pilot8+E05+E06+11กลุ่มอัตโนมัติ), อีก35ยังไม่เชื่อมและปิดความสามารถที่ไม่รองรับ; native56Effects3 แยกจาก stage1/2 ที่ไม่มีflag. Main default3/pilot4เดิมไม่เปลี่ยน; optionalปิด ดู native56-runtime.json และ native56-stage3.json ไม่ใช่ full56balance/เกมครบ
- Collector3+2 เชื่อม engine/protocol/Comic UI แบบทดลองแล้ว (reviewเสร็จ; minorค้าง); คะแนนผลงานv1/ตัวบันทึกfacts2ตามค่าทดลองที่อนุมัติเชื่อมแล้ว; ยังไม่รับรองfull-game balance
- ขโมย/RPS Comic และ timeout มี implementation/หลักฐานเฉพาะส่วน; อารมณ์พ่อค้า S02/S04 เชื่อมแล้ว บริบทอื่นและการรับรองร่วมทั้งเกมยังไม่ครบ
- ยังไม่ผ่าน PLAY-01/BAL-02: ไม่มีคำรับรองครบทั้งเกม/บาลานซ์/มือถือ; มีเทสต์เก่า Dark One แสดงชื่อผู้เล่นเสียหนึ่งข้อ

Atlas ปัจจุบันสกัดทุก module ของ `apps/comic/src/game/appraisal` พร้อม support/server/bot ที่ระบุใน provenance โดย UI มี capture/flow registry แยก; ไม่ใช้ root เป็น runtime ฐานแล้ว หลักฐานรุ่นก่อนตรึงที่ Git9f0a972 และ `legacy-atlas-baseline.json` กราฟยังเป็น static dependency ไม่ใช่หลักฐาน execute หรือเกมครบ

## จุดอ้างอิงหลักก่อนทำงาน

ใช้ [HTML หลัก](logic-item-relations.html) เป็นหน้ารวม source of truth: ภาพจับเกมปัจจุบัน/จำนวนหน้าที่ตรวจพบ/style/เส้นเชื่อม logic อยู่ที่เดียว ข้อมูลต้นทางเป็น current-captures.json และ screen-flow.json ภาพconceptแยกเป็นประวัติร่าง ไม่ใช่สภาพเกมปัจจุบัน

ตรวจภาพจับและ source ก่อนทุกงาน ไม่ทำหน้าเดิมซ้ำ ดู current-ui-inventory.md สำหรับช่องว่างที่ยังไม่ได้ capture ผู้ใช้ให้เริ่มออกแบบตาม flow อีกครั้ง 2026-10-29 หลังจัดทะเบียนภาพปัจจุบันแล้ว: ใช้ S01 ร่างเดิมและ S02 หน้าเดิม เริ่มเติมภาพอ้างอิง S03/E109 เท่านั้นในรอบนี้ ไม่ถือว่าหน้าที่ยังไม่ได้จับภาพไม่มี implementation

## เป้าหมายและสถานะจริง

นำ UI comic ที่มีอยู่มาเชื่อมกฎเกมและสินค้าใหม่ให้เล่นได้ครบ แล้วจึงปรับบาลานซ์จากผลทดสอบที่ทำซ้ำได้ งานจัดข้อมูล/กราฟและ RULE-01 ใน root เสร็จแล้ว แต่ Comic เชื่อมและตรวจการใช้กฎเงินฝากใหม่แล้ว การย้ายสินค้าใหม่และการบาลานซ์ทั้งเกมยังไม่เสร็จ

- สินค้าใช้ชุดใหม่ **56 ชิ้น / 8 พ่อค้า / คนละ 7** เท่านั้น ไม่ย้อนใช้รายการสินค้า realistic
- Effect ที่ผูกสินค้าใน relation ยังเป็นข้อเสนอ; registration56 / verified primary21; ดู native56-runtime.json; relation ที่ไม่มีหลักฐานยังเป็นข้อเสนอ
- Runtime snapshot: 132 events, 51 statuses, omen 7/15 แบบ; ดู manifest ก่อนใช้จำนวนเป็นฐาน
- UI: comic 2D, เส้นเข้ม, แดง/ดำ/ขาว, palette สินค้าตามพ่อค้า, symmetry และ spacing กลาง; รักษารูปแบบเมนูเดิม
- กราฟ source-reference และ domain-classification เป็นหลักฐานความเกี่ยวข้อง ไม่ยืนยันว่าทุกผลเกิดพร้อมกัน
- ยังไม่มีผลทดลองที่ยืนยันว่าเกมหรือสินค้าใหม่สมดุล

## ทิศทางเกมล่าสุด

ผู้เล่นต้องเลือกเส้นทางวางแผนเพื่อชนะได้หลายทาง คล้าย Civilization ดู [strategic-paths.md](strategic-paths.md) เป้าหมายแต่ละสายต้องแข่งขันกันได้จริง ไม่ใช่เปลี่ยนชื่อคะแนนเดียว ผู้ใช้ยืนยันให้ทุกสายตัดสินพร้อมกันตอนจบเมื่อ Collector มา ไม่จบทันทีเมื่อครบเป้า ตัวเลขเป้าหมาย/โบนัสและกฎเสมอยังต้องกำหนด

## Context หน้าจอและภาพ concept

ผู้ใช้ย้ำ 2026-10-29: ทุกหน้าต่อจากนี้ต้องออกแบบและตรวจ symmetry ทั้งแนวขอบ ระยะ padding/gap และปุ่มหรือกล่องที่เป็นคู่ ใช้ component และ token กลางร่วมกัน ดู screen-context.md

กฎยืนยัน [ท่าทางพ่อค้า MERCHANT-EXPRESSION-01](merchant-expression-rules.md): เลือกประตู idle → ผู้ถูกเลือก smile และคนอื่น angry; เริ่มประเมิน idle; พ่อค้ายอมรับราคา smile / ไม่ยอมรับ angry กฎนำเสนอรอพัฒนา ใช้ component กลาง ไม่เปลี่ยนกฎเกม ใช้ 3 ท่าที่มีจริง ไม่ต้องหาท่ายื่นมือ

2026-10-29: E109 ใช้ `MerchantEventPortrait` กลางพร้อมสัดส่วน idle ทั้ง 8 พ่อค้าแล้ว [รายละเอียดและภาพตรวจ](implementations/S03-E109.md) ให้ใช้ component เดิมเมื่อสร้าง event พ่อค้ารายอื่น และใช้ ComicButton/Peek/GameDialog กับ token ระยะและมุมร่วมกันตามเหมาะสม ยังไม่อ้างว่า event อื่นเชื่อมครบ

2026-10-29: ผู้ใช้ให้เริ่มสร้าง S03/E109 หลังแก้ภาพถึง v05 ลง implementation ใน comic build แยกแล้ว ดู [หลักฐาน/patch](implementations/S03-E109.md), capture C26 ใน HTML หลัก ไม่แก้ source UI realistic ใน repo นี้ ไม่ได้เปลี่ยนทุก event; capture เป็น fixture ของ component จริงและทดสอบ engine แยกกัน

[บอร์ดหน้าจอ](screen-flow.html) · [วิธีใช้](screen-context.md) · [ทะเบียน screen-flow.json](screen-flow.json) ใช้ screen ID ร่วมกับกราฟและชื่อภาพเพื่อหา state/logic/ภาพที่อนุมัติได้เร็ว เริ่มภาพจาก S01 เหตุการณ์ก่อนประตู แล้วเดินตามผังโดยไม่สับสน event กับ phase

## แหล่งข้อมูลและลำดับอำนาจ

| ต้องการรู้ | เอกสารหลัก |
|---|---|
| ผู้ใช้ยืนยันกฎอะไร | [rules-and-logic.md](rules-and-logic.md) — เหนือ runtime และข้อเสนอเก่า |
| ต่อไปทำอะไร / เสร็จถึงไหน | [development-roadmap.md](development-roadmap.md) |
| ต้องวัดอะไรก่อนปรับค่า | [balance-workflow.md](balance-workflow.md) |
| Runtime ปัจจุบันทำอะไร | [system-atlas/data.json](system-atlas/data.json), [manifest](system-atlas/manifest.json) และ source spans |
| ช่องว่างจากกฎและ migration | [system-atlas/coverage.md](system-atlas/coverage.md) |
| ไล่เส้นระบบ | [HTML](logic-item-relations.html) และ [33 ระบบ](system-atlas/systems.md) |
| สินค้าใหม่เสนอให้แตะระบบไหน | [logic-item-relations.json](logic-item-relations.json) และ [ตาราง](logic-item-relations.md) |
| แนว effect และข้อห้าม | [effect-catalog.md](effect-catalog.md) |

หากข้อมูลขัดกัน บันทึกความต่าง ไม่แก้เอกสารให้ดูเหมือน runtime รองรับแล้ว ความจำจากแชตใช้ช่วยค้นหา แต่ไม่แทนหลักฐานและกฎล่าสุด

## ประเด็นค้างที่ห้ามอนุมานเป็นกฎอนุมัติ

| ID | เรื่อง | ยืนยันแล้ว | ยังต้องตัดสินใจ |
|---|---|---|---|
| D01 | ขโมย | ถูกกฎแล้วบังคับ RPS ปฏิเสธไม่ได้ | ยืนยัน2026-10-31: สุ่มมือเฉพาะฝ่ายยังไม่ส่ง เก็บมือเดิม ตัดสินปกติ; รอเชื่อมruntime |
| D02 | ดอกเบี้ย | 10% จากเงินต้นเดิมครบช่วง; ถอนก่อน/เติมใหม่ไม่รับย้อนหลัง | ยืนยันเพิ่มแล้ว: อยู่ครบจากเริ่มถึงจบช่วง ปัดเศษลง ถอนเงินใหม่ก่อนเงินเก่า; รักษาการจ่ายเข้ากระเป๋า/งบธนาคารเดิม |
| D03 | Collector Wishlist | ทุก 2 turn เลือก 3; อีก 2 turn รวมสุ่ม 2; ปกปิด 5; เปิด 1; จ่ายซื้อ | นิยาม turn ใน runtime, ราคา/หมดเวลา/เงินไม่พอ/สิทธิ์ซื้อกี่ชิ้น/ของซ้ำ |
| D04 | คะแนนพิเศษ | ซื้อ/ขาย/เสียพลังชีวิตสะสม/ของจบ/ความไว้ใจ; rarity ×2=20, ×3=40 | เสมอ, จำนวนรางวัลหมวดอื่น, วิธีนับ lifeLost ที่จ่ายเอง/ป้องกันรักษาวน และการนับสำเนา |
| D05 | Effect สินค้า | ใช้ catalog ใหม่ 56 เท่านั้น | trigger, magnitude, stack/cap, duration, copy scale และ target ของแต่ละชิ้น |

รายละเอียดที่ขาดไม่ต้องหยุดงานอิสระ เช่น เก็บ baseline, เขียนกรณีทดสอบของกฎที่ยืนยัน, ตรวจแผนที่ dependency แต่ห้ามใช้ค่าทดลองเป็นกฎจริงโดยไม่ระบุ

## วิธีทำงานทุกครั้ง

1. อ่าน context นี้และเลือกงาน ID ใน roadmap; ตรวจ atlas freshness
2. อ่านกฎของงานนั้น ใช้กราฟหา callers/ผลกระทบ แล้วใช้ Trail ดู source ที่ต้องแก้
3. ระบุ invariant, state/config/phase ที่แตะ และเกณฑ์จบงานก่อนแก้
4. แก้ทีละระบบ พร้อมทดสอบขอบเขตของเงิน/ของ/เวลา/RNG/retry/reconnect ที่เกี่ยวข้อง
5. บันทึกผลจริง ค่าก่อน/หลัง seed และ config; งานยังไม่ผ่านห้ามย้ายเป็น done
6. อัปเดตกฎ/relations เมื่อมีการตัดสินใจจริง แล้วสร้าง atlas ใหม่และตรวจ
7. อัปเดต roadmap และบันทึกส่งต่องานด้านล่างทุกครั้ง ห้ามแก้ generated data หรือ HTML ด้วยมือแทน generator

```sh
node docs/game-design/scripts/build-system-atlas.mjs
node docs/game-design/scripts/check-system-atlas.mjs
```

## บันทึกส่งต่อ

| วันที่ | งาน | ผล / หลักฐาน | งานถัดไป |
|---|---|---|---|
| 2026-10-28 | CTX-01 | รวม catalog/runtime graph และชุดข้อมูล; ตรวจ HTML/namespace/new56/fingerprints ผ่าน | ตั้ง baseline BAL-01 ก่อนปรับ runtime |
| 2026-10-28 | CTX-02 | ตั้ง context กลาง, roadmap, balance workflow และทางเข้าใน AGENTS/HTML; ไม่เปลี่ยน runtime | BAL-01 และเตรียม RULE-01 โดยแยก D01–D04 ไว้ |

| 2026-10-28 | BAL-01 เริ่มแล้ว | ตรวจเอกสารผ่าน; npm test ยังไม่จบขั้น build ดู balance-reports/2026-10-28-baseline-attempt.md | ตรวจ build แล้วเก็บ baseline ให้ครบก่อน tune |

| 2026-10-28 | BAL-01 / RULE-01 | baseline 12 เกมจบครบ; Vault ใหม่ 10% อายุครบ; targeted 69/69, server/client/atlas ผ่าน; ดูรายงาน RULE-01 | STRAT-01 หลายเส้นทางชนะ และ RULE-02 forced RPS |

| 2026-10-28 | STRAT-01 timing ยืนยัน | ทุกสายตัดสินพร้อมกันตอนจบเมื่อ Collector; ไม่มี instant victory | ออกแบบเป้าหมาย/โบนัส/counter ของแต่ละสายและตรวจการนับคะแนนซ้ำ |

| 2026-10-29 | D04 แก้ความหมายจากผู้ใช้ | รางวัลเสียพลังชีวิตสะสมมากสุด ไม่ใช่จำนวนครั้งตาย; แต่ละคนตายได้ครั้งเดียว | ใช้ lifeLost ใน STRAT-01; ตรวจแรงจูงใจรักษาแล้วเสียพลังชีวิตซ้ำแทนการคิดเกิดใหม่ |


## โลกวิญญาณ — แนวทางล่าสุด 2026-10-29

ผู้ใช้เลือกแนว [สัญญาบริการวิญญาณ](ghost-service-contracts.md): ชนะมินิเกมติดตามการ์ดเพื่อเปิดบริการ รับงานจากคนเป็น ตามหาของที่ Skeleton ผ่าน RPS สามช่องแยกสิทธิ์ ส่งมอบสำเร็จจึงได้ค่าจ้างและส่วนสินค้า 10% โลกวิญญาณไม่ขัด turn คนเป็น ไม่ใช่การร่วมชนะผ่านพันธมิตร ยืนยันเพิ่ม: จ่ายเมื่อส่งมอบสำเร็จ, 10% คิดจาก base หักในราคาสินค้า, รายได้เป็นคะแนนพิเศษ; อัตราแปลงคะแนน/ปัดเศษ/เงินไม่พอตอนส่งยังเปิดอยู่ ยังไม่ลง runtime

| 2026-10-29 | GHOST-01 เศรษฐกิจยืนยัน | จ่ายตอนส่งมอบ; ส่วนแบ่ง 10%base หักจากราคาสินค้า; รายได้บริการเป็นคะแนนพิเศษ แทนกฎคะแนนหลังตายหยุดทุกชนิด | ยืนยันอัตราแปลงคะแนนและกติกาส่งมอบเมื่อเงินไม่พอ |

| 2026-10-29 | UI-FLOW-01 | ทะเบียน28หน้าพร้อม phase/action/source links; S01/E117 v01 เป็น draft ภาพแรก ดูบอร์ด screen-flow.html | รีวิว S01 แล้วทำ S02 โดยใช้ shared UI เดิม; อีก27หน้ายัง planned |

| 2026-10-29 | UI-FLOW-01 ข้อมูลก่อนเลือก | ผู้ใช้ย้ำ event ปิดประตูต้องเห็นว่าประตูไหนมีพ่อค้าใด ตรวจพบ E117 ปิด1ประตูจาก3 ไม่ใช่บังคับเข้าอีกบาน | S01 v02 เพิ่มภาพพ่อค้าครบ3ประตูและผลเปิด/ปิดต่อตัวเลือก; ตรวจหลักเดียวกันทุกหน้า |

| 2026-10-29 | S01 แนวทาง visual ที่เลือก | ชอบ minimal v01 มากกว่าv02; ใช้ปุ่มดูประตูแบบอ่านอย่างเดียวและกลับเหตุการณ์ พร้อม hover/focus/tooltip บอกได้เสีย | เก็บสองสถานะเป็น v03 draft; ห้ามรีเซ็ตหรือส่ง event จากการดูประตู |

| 2026-10-29 | หยุดงานซ้ำ | ผู้ใช้ย้ำ S02 มีอยู่แล้ว ใช้หน้าเดิม ห้ามออกแบบ/สร้างภาพซ้ำ ตรวจของเดิมก่อนทุกงาน | S01v03เป็นหน้าหลัก minimal+tooltip; ปุ่มดูประตู reuse ของเดิมแบบอ่านอย่างเดียว |

| 2026-10-29 | CAPTURE-01 | จับ25ภาพจากเกมเดิม ครอบคลุม14กลุ่ม;5ภาพเกมlive/20ภาพpreviewเดิม ผูกscreen/logicในHTMLหลัก | ใช้ภาพจับเป็นหลัก ตรวจstateที่ยังไม่จับก่อนวางงานใหม่ หยุดgen |

S06 ปัจจุบันใช้ tabletop v05 แทน split layout เก่า ดู implementations/S06-trade.md และ capture C27; navigation preview ผ่าน ไม่อ้างว่าธุรกรรมหลายผู้เล่นทดสอบแล้ว

2026-10-29 S06 fidelity correction: ฉากโต๊ะ comic จริง + แก้ grid ครึ่งจอ + ขนาดของ/baseline + จบซื้อขายในโต๊ะ. Browser1440×722/1024×768ไม่ล้น; navigation/เปิดปิดรายละเอียดผ่าน; ดู implementations/S06-trade.md และ C27. ยังไม่ตรวจธุรกรรมหลายผู้เล่นจริง

S06 tooltip follow-up: เพิ่ม ComicTooltip กลาง ปุ่ม transition และข้อมูลย่อ known facts; จัด empty state กลางพื้นที่. Build appraisal ผ่าน.

2026-10-29 S06 tooltip fix: ลบป้ายกระเป๋าข้างปุ่มและคำสั่งย่อซ้ำใต้สินค้า (เก็บชื่อ/ราคา). ComicTooltip เปิด focus เฉพาะ :focus-visible, ปิดเมื่อ click/pointerdown/blur/scroll เพื่อไม่ค้างจาก navigation. Browserผ่าน hover→leave ปิด, คลิกกระเป๋า/วนหน้าปิด, keyboard Shift+Tab เปิด, Escapeปิด; build109modulesผ่าน. ภาพ implements: implementations/S06-tooltip-fix.png.

2026-10-29 S06 quiet overlays: ใช้ NavigationIcon/TableReturnIcon/PlayerOutlineIcon จาก icons กลางแทน glyph และ silhouette เดิม กระเป๋ามีลูกศรลง SVG; comic-overlay.css เป็น style กลาง opacity .42→1 เมื่อ hover/focus-visible, touch .75, reduced motion ไม่มี transition. Browserวัด idle.42/hover1, tooltipทำงาน, เปลี่ยนหน้าคลังเหลือ2ชิ้นและกลับผ่าน ไม่มี scroll1440×722. Build110modulesผ่าน. ภาพ implementations/S06-overlay-idle.png และ S06-overlay-hover.png.

2026-10-29 S06 shared frame correction: ผู้ใช้ย้ำใช้กรอบกระเป๋าเป็นมาตรฐานทุกเมนู. เพิ่ม comic-frame.css เป็นกฎร่วมของ ComicMenu/กระเป๋า/โต๊ะซื้อขายด้วย --comic-frame-*; ไม่กำหนดขนาดแยก. วัด1440×722: ทั้ง7กรอบ x24,y60,w1392,h562; 1024×800 ซื้อขาย/กระเป๋า x24,y60,w976,h640;1920×800 x220,y60,w1480,h640 เท่ากัน. Build111modulesผ่าน; page1440×722ไม่ล้น. ดู implementations/S06-shared-frame.png. กฎถาวรอยู่ AGENTS.md และ screen-context.md.

2026-10-29 S06/item-sale v01: ผู้ใช้ขอconceptหน้ารายละเอียด/ประกาศขายจากscreenshot21.21.31. สร้างภาพและbriefใน concepts/S06-item-sale-v01.* ลงทะเบียนvariantdraftแยกจากtabletop/ภาพจับปัจจุบัน ไม่ใช่หน้าใหม่ ไม่อนุมัติและไม่แก้runtime. แสดงstateNPC52เครดิตยังไม่ประเมิน/knowledge? ประกาศขายปิด โชว์ยังได้.

S06/item-sale v02: ผู้ใช้ขอcomicขึ้น ทำภาพeditจากv01ให้UIเป็นcaption/หมึก/halftone ไม่ใช่เพียงภาพสินค้า. ลงทะเบียนdraftแยก ไม่มีruntimeเปลี่ยนและยังไม่อนุมัติ. ดูconcepts/S06-item-sale-v02.md

2026-10-29 S06/item-sale v02 implemented in isolated comic build. ItemSalePanel + Share comic presentation retain same handlers/eligibility; caption/paper choice controls and knownfacts3cells. 1024×800 columns486/486;1920×800 738/738;1440×722 694/694; zero panel overflow and frame matches inventory. Browser public-fixture tests confirmed share claims genuine/cursed+rebate3, over-budget disabled, owned sale/show omit claims, withdraw allowfalse. Menu overlap found and fixed with utilityOpen pause; only one dialog remains when utilities open. Build114modules passed. C28 actual fixture capture, not AI/live multiplayer; portable code and fixture under implementations/S06-sale-source and docs/validation/s06-item-sale.

2026-10-29 S06 style correction: ผู้ใช้ย้ำเกมเดียวกันต้องอ้างอิงUIที่มี ไม่สร้างstyleใหม่ต่อหน้า. ยกเลิกbrushcaption/whitechoice/paperfactsและdividerกลาง/ที่มา/rebate/footer; ใช้ComicMenu header65px/line1pxและComicButtonดำแดงเดิม. คอลัมน์1024=486/486,1920=738/738,1440=694/694. แถวchoice/rebateleftตรงกัน590/1066/826ตามviewport; stepper40pxเท่ากันและpaneloverflow0. ไม่เปลี่ยนShare logic. C28จับใหม่จริงตามstyleนี้.


2026-10-30 CONTINUITY-01 latest: user approved the exact14-image baseline; two independent comparisons14/14, affected functional suite79/79, UI contracts10/10, existing18 real menu flows pass. Hindsight approval retain/scoped recall/direct-ID verified; broad retrieval is not assumed reliable. See docs/ui-system/verification.md for current evidence and historical failures. Atlas clean-clone reproducibility still depends on resolving four uncommitted root aged-interest source inputs; do not mark complete from worktree freshness alone. No unrelated screen redesign or gameplay unification.

2026-10-30 CONTINUITY-01 closure: user explicitly approved preserving RULE-01 source in separate commit4548562. Server/client typechecks and29 focused tests pass; a fresh Git-export tree passes Atlas106-input/output checks with existing dependencies reused. This resolves earlier uncommitted-root provenance gap. UI gates from6141e9c remain current; source/art/UI unchanged by this follow-up. No full simulation/live multiplayer/balance verdict. Root aged10% rules are committed; comic remains its imported runtime until a separately scoped integration. See docs/ui-system/root-provenance.json and completion-audit.md.

2026-10-30 S08 concept-only follow-up: user explicitly requested redesign of the existing end-of-encounter reward/coin screen. Added concepts/S08-salary-v01.png and brief/prompt with shared menu frame, equal columns and a modest comic coin. Draft/unapproved; C21 remains historical runtime evidence, approved UI baselines and game code unchanged. Fixture: encounter3, one multi-enabled coin, pending10, correct+5/wrong−5 floor0; add-coin cost10 from wallet (even encounter base15), not5. Follow-up implementation requires user approval and multi-coin/tossing/settled validation. Image-generation authorization is specific to S08, not a blanket resume of all concepts.

2026-10-30 S08 implemented after explicit user approval: shared ComicPhaseFrame/inventory geometry/header and ComicButton, equal pending cash-out/coin columns/actions, compact2-coin pages retaining all predictions. REVEAL keeps six utility menus, with new bag/status access read-only; pending duplicate ready/result panel removed, existing S09 follows payout. Game rules and legacy app untouched. New actual fixture captures C29/C30 replace draft as current view, concept remains design reference; no new pixel-baseline approval. Build/focused83/contract10 results and exact browser evidence in implementations/S08-reward.md and docs/ui-system/s08-* reports. Known broader i18n4 failures reproduced before change, not waived.

2026-10-30 S09 implemented after user authorized concept + implementation together. Reuses inventory ComicPhaseFrame, common header/buttons and equal columns; paged custody shelves, centered equal44px money controls and one ready action. C31–C33 record normal/full/empty actual fixtures, not live payment or separately approved pixel baselines. Final zero-result toss remains mounted until animation ends. Comic4% and root aged10% remain separate runtimes; no engine rules changed. Verification: focused104/104, UI contracts10/10, original sealed baselines14/14, peer menus18/18 and S09 browser9/9 at1024/1440/1920; synthetic incoming-DTO animation passes. See implementations/S09-vault.md and docs/ui-system/s09-* reports. Known broad i18n4 failures remain; no full simulation/live multiplayer/phone/balance claim.

2026-10-30 active goal: implement Comic spirit-world S11/G01–G04 from registered concepts through real gameplay and verified UI. Ordered plan: implementations/ghost-delivery-plan.md. User explicitly authorized concept and implementation; do not regenerate existing images unnecessarily. Only isolated tracking helper exists; full feature is not complete. Proposed rounding/ties/job-limit/match-end policy is awaiting user reply. Confirmed1credit=1bonuspoint and wait for buyer funds are authoritative.

2026-10-30 ghost integration active: actual six actions and GhostWorld wired, not just helper. Core7/7, focused31/31, real two-socket1/1, UI contracts10/10 and peer menus18/18 pass. Browser actual minigame unlock verified; C34 is separate component fixture. Visual gate13/14 (status wide drift1.268%); do not rebaseline or complete goal. Buyer-death cancellation/reunlock approved and implemented; latest build/network/UI reruns still needed after final edits. Exact handoff: implementations/ghost-delivery-progress.md.

### Current Comic spirit-world runtime — 2026-10-30

GHOST-01 is implemented through real authenticated commands, replay and shared UI; see implementations/ghost-delivery-progress.md for rules/evidence. Quote identities prevent stale financial terms; delivery owns a private snapshot. Buyer death/end cancels unpaid/unscored jobs; no pending batch requires a minigame win again. Current captures distinguish fixtures from live transactions. Ordinary latest entry uses appraisal-main.ts flags (secure economy, brokerage, polish, NPC events, core2, survival); fixture3188 is never the normal play entry.

## Whole-game goal active — 2026-10-31

ดู [completion program](implementations/completion-program.md). ต้องทำครบกฎ/สินค้าใหม่/UXและหลักฐานทั้งเกมก่อนปิด goal ไม่ถือว่าแต่ละ checkpointคือจบทั้งเกม กฎforced-RPS missing handsยืนยันแล้ว เดินงานส่วนที่กฎชัดต่อได้


### 2026-10-31 RULE-02 checkpoint

Comic new runs use theftTimeoutRules:1. Missing hands only are server-seeded at the independent30s deadline; submitted/NPC hands remain sealed, ties start a fresh round; late hands require matching round, accepted retries remain idempotent. Historical flagless audit timeout remains cancelled. Active duel uses approved shared Comic frame; six utility menus do not reset it. Functional/network/replay and geometry evidence: `../ui-system/forced-rps-verification.json`. Target picker/closed history still legacy; no claim whole-game complete.


### 2026-10-31 MERCHANT-EXPRESSION S02/S04

Shared `merchant-reactions.ts` now links confirmed choice/result to3 existing frames; no trust-based mood guesses.650ms read-only portal reaction is presentation only and skips under reduced motion. Current frame/CSS/assets retained;24pose geometry and3width sequences verified. Full evidence and2 parent-reproduced old broad-test failures: `../ui-system/merchant-expression-verification.json`. STRAT-01 path-bonus structure question is pending; no new numeric scoring approval is implied.


### 2026-10-31 ITEM-01 readiness / pilot proposal

Portable catalog/art verified56/56 distinct paths and content hashes,8×7,type≤4merchant;56primary+57optional effect links are still proposals. Active compiled ITEM_SPECS contains66 old kinds,0 new IDs. Fresh command and hashes: `new56-readiness.json`, generated by `node docs/game-design/scripts/audit-new56.mjs` after Comic build; `--check` verifies freshness. Eight proposed experimental specs are reviewable in `new56-pilot-proposal.html`/JSON. User approval is pending; no old-ID alias or runtime binding was introduced. Whole-goal work continues independently; active Comic Atlas scope still needs reconciliation.


### 2026-10-31 pilot8 approved / CTX-02 active source

User explicitly approved the8 experimental specs from9f0a972 (original proposal SHA ec70ac9f55770ff3866b54cb55131f5703058faafbc921970cb7519c4924b0a1). See new56-pilot-approval.json; numeric/global rules unchanged and checked against that Git version. This supersedes earlier pending-pilot notes, not the unanswered STRAT-01 structure question. Proceed runtime pilot integration after current context verification; optional/remaining48/release balance are not approved by this reply.

Atlas now extracts active Comic appraisal modules and explicit support/server/bot AST/data exports, including ghost schemas/actions and new forced-timeout flag. Legacy outputs are pinned by hashes/Git reference. Counts/guards are static evidence; new56 lifecycle remains unfinished.

## Pilot8 runtime checkpoint — 2026-11-01

`apps/comic/src/game/appraisal/pilot-catalog.ts` owns native IDs/spec metadata; `pilot-effects.ts` owns held/custody/instance+encounter rights and cost/age helpers. `effect:E##` is separate from event:E##. No old-kind aliases or generic status injection. config4 is opt-in with `COMIC_CATALOG=pilot8`; historical generators/default3 remain unchanged. New56 integration is8/56, not74 new products. See [runtime handoff](implementations/new56-pilot-runtime.md), [evidence](new56-pilot-verification.json). Historical note: STRAT structure was pending then; superseded by2026-11-02 personal-system scoring direction; weights pending. Full goal active.


## RULE-02 target/history checkpoint — 2026-11-02

Approved Comic reconciliation now includes target/history in the shared inventory-sized menu. HUD handshake opens read-only;6 dock menus remain unchanged. Known costs/targets, fixed pagination, unknown goods privacy and active forced-duel precedence preserved. Phase changes clear unavailable drawers, preventing invisible inert main panes. Evidence: ../ui-system/theft-desk-verification.json (78 focused,174 related, socket1, target3width, boundary4, forced3width, baseline14, menus18, native10). No engine/default change or full-game/balance completion. Next unresolved work remains STRAT structure, Collector3+2, awards and remaining48.


## 2026-11-02 — Collector proposal / balance exposure

RULE-03 now has a concrete unapproved proposal: proposals/collector-wishlist-v1.md, distinct from NPC wanted contracts and final Collector. User question sent against that document; no implementation/default/price approval inferred while pending. Proposed uniform shared quote prevents slot-identity inference but still reveals aggregate reference value. Costs/status hooks, merchant ban, escrow closure and turn expiry are explicit proposals.

Read-only analyzer scripts/pilot-coverage.mjs checks the8 sealed old paired audits against original hashes/current pinned game sources. It proves short flow/snapshot coverage, not8 effect exposures. No activation/vault/notice/reroll/theft actions in native policy runs; inspections are authenticity-only. See balance-reports/2026-11-02-pilot-coverage.md/JSON. Keep29 native lifecycle tests and old strict-replay claims separately scoped. Add actual public-view effect scenarios before balance tuning. No product/UI change in this checkpoint.


## 2026-11-02 — eight public effect pairs and Collector approval

New evidence:8mechanism pairs/16complete command runs with onlypublicviewactors; legitimatebuy/custody and strictreplay32checks. Full source+compiled+audithashes in ../validation/pilot-public-2026-11-02/public-effects.json. Effects measured:shield1HP,ring12vs10,caliper0vs1energy,translatoracceptanceboundarysame10price,notice38vs48,reroll2vs3energy,vault6vs10credits,swordtie+1vsnext round. No productcodechange. These useconfigstarting500/selectedseeds/cooperativehands, notdefault40balance; old8genericpolicy gaps remain accurately scoped.

User explicitly approvedCollector proposal. collector-wishlist-approval.json pins5a44a7a:d7e79e71d6fcb61919c91beaea34b123d1676a4745be97aa88f87bd36462d98f and reply“อนุมัติสเปกทดลองนี้”. Originalproposalfrozenasapprovalsource; progress/plan in implementations/collector-wishlist-plan.md. Supersedes prior“pendingCollector” notes; no newruntimeyet and no repeatedapproval. STRATstructure stillpending. Whole-gamegoalactive.

2026-11-02 Collector Task1: แกน private3+2/schedule/peek/pay/expiry/custody/journal พร้อมแบบ opt-in `collectorWishlistRules:1` เท่านั้น.21 Collector tests และ232 focused cases ผ่าน,2 socket เดิมผ่าน,24 audit เดิม replay ตรง,8 effect pairs รันใหม่ผ่าน. Protocol/bot/UI ยังรอ Tasks2/3; ไม่ใช่เกมครบหรือ default rollout. ดู [engine verification](collector-wishlist-engine-verification.json).

2026-11-02 Collector Task2: protocol/public bots/reconnect/idempotency/audit ผ่าน5checks +2socketเดิม +69related. ชุด2→4ซื้อจริงและstrict replayจบRESULTS; ยังopt-inและComicUI/default rolloutรอTask3. ดูcollector-wishlist-network-verification.json.

2026-11-02 Collector Task3: ใช้ComicMenu/ปุ่มกลาง,เลือก3/รอ2/ห้าช่องปกปิด/peek1/confirmจ่าย/ถอนเอง/หมดสิทธิ์และwarningครบ. main new rooms เปิดcollectorWishlistRules1; explicit no-flag auditsเดิมคงเดิม.25 UI,7 network,12 captures+10 mounted checks,14 baseline,18 menusผ่าน; finalreviewยังรอ. ไม่ใช่เกมครบ/remaining48/STRAT/awards/balance. ดูcollector-wishlist-verification.json และA05ในHTMLกลาง.

2026-11-02 Collector review completed (frozen10629f2..7ab2a39); Important public-offer contamination fixed via shared market/Spirit source filter with failure-first tests. 235 scoped regressions,7 actual network cases,24 historical+2 Collector replays,8 native effect pairs/16 runs/32 replays pass. Real App request/peek/confirmed purchase/owned item/RESULTS replay verified with500-credit/20-life fixture, not normal40/6 balance. UI-COLLECTOR-CONTEXT minor deferred: initial event hides request catalog entry until resolved. See collector-offer-isolation-verification.json and implementations/collector-wishlist-review.md. Whole-game goal remains active; remaining48, STRAT, awards and broader normal-budget balance remain open.

2026-11-02 normal main evidence: realApp40credit/6life/defaultclock request2/delivery4/peek1/confirmedbuy/owneditem/RESULTS6 strictreplay pass; public setup held spending beforedelivery. Matrix8 normal-config runs (2/4 seats,cautious/trader,catalog3/4,same deterministicseed) allRESULTS/replay, ends5–8.5Collectorpaid,8auctionwins andPvPtrades observed; no vault/interest/PvPloan/forcedRPS/ghost-service coverage. No balance/numeric change. See normal-play-verification.json and balance-reports/2026-11-02-normal-play.md. Whole goal active, remaining48/STRAT/awards pending.

2026-11-02 normal-resource command journey: exact main40credit/6life/deadline15 catalogue4pilot8, selectedseednormal-service-2,196commands/9checks. Deposit10/topup5/new-firstwithdraw/agedinterest1, real bought collateral loan funding+repayment, naturaldeath, public card tracking, realRPS/3slotloss/waitnextencounter,21credit delivery/bonus2/RESULTS7/strictreplay. Related44+network1 pass; network uses200/death/slotfixtures and is not combined normal live evidence. No runtime/UI change; see normal-service-verification.json. Whole goal remains active.

2026-11-02 user scoring direction supersedes pending best-path-only question: every player gets personal contributions across systems; sale quantity and gross sales credits are separate score components; merchant trust uses cumulative positive gains throughout game (not final trust). End summary reveals systems sequentially with colored growing bars. Timing remains simultaneous atCollector. Weights/caps/anti-farming and old leader bonus coexistence not yet approved; do not implement invented scoring or replace cumulative trust with peak/final values. See personal-scoring-direction.json and proposals/personal-system-scoring-v1.md.

2026-11-02 personal scoring concrete experimental package prepared: proposals/personal-scoring-rules-v1.md and personal-scoring-weights-v1.json. Every-player contributions/sale count+gross volume/cumulative trust already approved; numeric weights/caps, origin eligibility, replacing old leader bonuses, applyingB10/D10 to performance, and final rarity for deadplayers are explicit proposals awaiting approval. One independent builder check completed; tuple/death-scope questions resolved as proposed choices, not prior user decisions. Offline5audit/14player partial sales/trust illustrations reconstructed originalaudit exactly; trust per-command delta is incomplete/unfiltered and not canonical cumulative score. No runtime/UI changes.


### 2026-11-03 approved personal scoring checkpoint (supersedes pending wording above)

User explicitly approved the exact experimental package at1551908: see `personal-scoring-approval.json` for immutable proposal hashes. Every-player weights/caps, eligibility, leader replacement, B10/D10 on ordinary performance and final-custody rarity including dead are approved; do not ask again. Working-tree Task1 domain/config draft passes13 tests, but canonical runtime counters, final scoring/DTO and Comic graph are not implemented or enabled. Historical audits:38 exact replays pass,8 fail; parent comparison is recorded separately. Broad suite reached35s external wall limit;6 assertion failures reproduce by name on pristine1551908. No all-green/full-game claim. Evidence: `../validation/personal-scoring-2026-11-03/checkpoint.json`; continuation: `implementations/personal-scoring-plan.md`. Current goal reports `usageLimited`; Task1 remains in progress, not complete. Source fingerprint/public pilot acceptance checks require refresh after compatibility proof; existing screenshot baselines remain unchanged.

Checkpoint update: domain13/13 and UI contracts10/10 pass. `ui:check` fails source inventory drift; Atlas build rejects stale pilot engine fingerprint. Partial generated output restored, so main HTML remains historical until compatibility proof and guarded rebuild succeed. Do not claim HTML/current-source acceptance or refresh evidence hashes without proof.

2026-11-03 resumed: fresh8 native public-effect pairs/16fullruns/32replaychecks pass with all16 audit bytes unchanged; domain13pass. Source manifests repinned only after that compatibility proof. Producers/finalscore/DTO/graph/default activation remain pending. Supersedes earlier usage-limit/source-guard checkpoint; no new screenshot approval or full-game balance claim.

Task1 final gate:96 focused tests (including13domain), server/clientbuild, ui:check395, ui:test10 and guarded Atlas217inputs pass. MainHTML now regenerated with approval/current Task1 source. No canonical event producers/final score/DTO/graph/default activation yet; Task2 next. trail check reports20pre-existing conflicts only in excluded .impeccable cache/design files,400KB branch cap; no claim clean full-branchcheck.

2026-11-03 Task2 progress: canonical personal score receipts/final snapshot connected under opt-in personalScoringRules1; main default remains off. Domain+runtime29pass, actual2/4seat sockets3pass at40/6 with duplicates/resume/privacy and strict ended audits; broad226pass/1old notes-markup failure reproduced on1551908, expensive simulation cases omitted. Historical40exact replays pass/8same old failures; native8pairs/16runs/32checks retain16auditbytes. Task2 completion matrix still open (route/copy/custody coverage, owned reappraisal/cap semantics); Task3 selfDTO/Comic graph not implemented. See ../validation/personal-scoring-2026-11-03/runtime-checkpoint.json. No fresh pixel approval or release-balance claim.

2026-11-03 personal scoring Task2 eligibility/runtime verified:40scoring tests +3real2/4seat socket cases; broader237pass/1oldnotesmarkup failure (CPU cases omitted). Normal40/6 public196command journey naturally ends7, includes spirit mini-game/hire/RPS/delivery, correct ghost bonus2 and strict replay; immediate loan eligible0 intentionally.43historical replays pass/8same1551908 failures; native8/16/32 and original normal audit remain byte-identical. Theft now dedups origin, legacy cash positive transfer records, owner/NPC first appraisal shared, copies do not consume original rights, actual HP cap loss counted before final freeze. Confirmed rules section7/Atlas supersede old leader awards. Task3 selfDTO/Status/Comic graph/default remains pending; fullgame/48/balance/ghostbrowser issue remain. Evidence: ../validation/personal-scoring-eligibility-2026-11-03/verification.json.

2026-11-03 personal scoring UI: exact approved1551908 experiment now enabled for actual Comic main new rooms after48focused domain/runtime/eligibility/SSR/socket/main-entry checks,13new screen checks at1024/1440/1920,18peer menus and14sealed pixel comparisons. S13 uses shared inventory ComicPhaseFrame/ComicButton/Tooltip,9local playback stages and paged14metric details. Live Status consumes server known-only range; hidden appraisal receipts stay unresolved untilend, final score frozen. Six end menus readonly; legacy/no-flag fallback retained. C64–C72 are candidates, not promoted baselines. See implementations/personal-scoring-ui.md and docs/validation/personal-score-ui-2026-11-03. Independent final review,48remaining catalog effects/numbers, normal fullgame browser reconnect/ghosttracking scroll and multi-seed balance still outstanding; whole-game goal active.

2026-11-03 independent scoring review4e3fe94: notready;6Important+4Minor. Owner fix pass reproduces12runtime failures then passes12/12 and60total non-network scoring/SSR cases; actual paid E44/bond/liquidation/consignment, exactNPC/sealHP, personallylearnedfacet deltas, configguards and private nestedIDs corrected. Rank/tied-rank/modifierreason/negativefixture and currentrules wording corrected. Server/client builds and8nativepairs16no-flag games32replays pass; normal196command current audit replay passes. Fresh Browser/socket/commit still pending because automatic approval review could not run (usage limit, not a safety decision). Prior captures C64–C72 and14pixel receipts remain historical, not fresh proof of changed labels. Pre-review scoring1 experimental audits may need their pinned old source; originals preserved, no-flag bytes unchanged. See personal-scoring-final-fixes verification and final-review handoff; whole-game goal active.


## Personal scoring final owner-fix checkpoint — 2026-11-03

2026-11-03 final owner-fix verification: 67/67 scoring tests (63 domain/runtime/SSR and4 actual socket/main-entry cases), server/client builds,16 score geometry/interactions with12 captures,4 browser review assertions,18 menu flows and14 unchanged approved pixel references pass. New personalScoringFacts:2 selects corrected canonical writers; rules/weights remain approved1551908. Five unique historical scoring1/no-marker audits replay exactly, and16 no-personal native audit bytes remain identical (8pairs/32strict replays). Normal40/6/deadline15 engine journey196commands reachesRESULTS7 withghostbonus2 and strictly replays. Independent6Important+4Minor findings addressed in one owner fix pass; no second review. Earlier usage-limit block resolved after reset; no bypass. Whole-game goal remains active: remaining48 specs/runtime bindings, normal combined browser/reconnect/ghosttracking overflow and multi-seed balance are not complete. Evidence: `docs/validation/personal-scoring-final-fixes-2026-11-03/verification.json`; candidate captures C73–C84. This latest checkpoint supersedes earlier pending compatibility/Browser notes above.


## Normal service / Spirit access — 2026-11-03

2026-11-03 normal two-App service route now reaches RESULTS with196commands and strict replay: real40credits/6life/defaultclocks/pilot8, natural death, early shuffle rejection without page shift, browser reload preserving round/server startedAt, actual Status→Spirit hire/accept/RPS3losses/next-encounter/delivery (debit21once, bonus2, living phase unchanged). User approved existing Spirit entry in Status header beside Close; shared button height/gaps, no new dock or clock reset.37focused tests,3feedback widths,3preview watch/reentry widths,UI404/contracts10,18menus/14unchanged approvedpixels pass. Final harness field assertion was corrected from amount to paid; same ended run separately validated, original failure retained. This closes the observed normal-service feedback/entry blockers, not every game flow or release balance. Evidence: `docs/validation/normal-service-feedback-2026-11-03/verification.json`. Supersedes earlier ghost-tracking root-scroll and inaccessible-entry checkpoint; remaining48specs/bindings and multi-seed/full-game acceptance remain.


## Remaining48 factual audit — 2026-11-03

Previous goal turn was verified progress:725fbcb scoring ande994fc2 normal Spirit route committed, not a wait. Fresh source/compiled/canonical-catalog reconciliation is now in remaining48-audit.html/json/md, generated by scripts/audit-remaining48.mjs. Exactly48new IDs remain absent from native ITEM_SPECS,6per merchant,35primary-effect groups;8native IDs exactly match approved pilot. Type presence remains at most4merchants. References resolve actual source owners but are NOT runtime bindings or lifecycle proof. No item values, effects, config, art or scoring weights changed.

Ten semantic gates: truth-based challenge vs purported success chance; rarity creation/owner scope; what Swarm improves; exact portal clue visibility; event-closure provenance vs trade bans; duel defeat consequence target; Alien credits vs energy/return timing; Collector assets-only vs all-score modifier; removable status allowlist; extendable status expiry vs charges. First user question is the Autometa coil repeater: extra discount for correctly challenging a false claim (recommended) versus additional information before challenge. This is meaning selection only, not numeric approval. Continue drafting other concrete item contracts while this is pending; no inference that optional effects or new48numbers are approved. The remaining48 table is an audit, not the complete numeric proposal.

Audit check validates identities/native counts/source spans/fingerprints and rejects a deliberately false runtime binding claim. It is not a gameplay/simulation/balance test. Before runtime implementation, approve full anchor/trigger/cost/magnitude/cap/funding/rarity-copy/age/custody/death/visibility/score policy and preserve historical audit writers. Existing approved8may be reused only for their exact items/specs, never auto-approved for another item sharing an effect ID.


## 2026-11-04 — E05 meaning and current32game diagnostic

User approved Autometa coil repeater/E05 meaning: increased discount when correctly challenging a false claim. The challenge still compares actual truth; no random win roll or prechallenge information. remaining48-decisions.json records exact reply/question and explicitly denies inferred numeric/runtime/optional approval. Current audit keeps original draft text and applies the approved per-item meaning:1meaning approved,9pending,0numeric specs ready. Do not ask the same E05meaning again.

Independent normal40/6/deadline15/pilot8/scoring1-facts2 baseline now completes32games:4predeclared seeds,2/4seats and4existing homogeneous policies,10084commands/96player results,32creation strict replays and0player-credit ledger discrepancies. First8second wall timeout was diagnosed successfully under20seconds;20sealed passes and the successful diagnostic were reused, only11unexecuted games then ran. No gameplay failure or new balance value from that wall sensitivity. See balance-reports/2026-11-04-normal-score-baseline.md and docs/validation/normal-score-baseline-2026-11-04/analysis.json.

Coverage limits are decisive: vault/loans/forced-theft/Spirit command families are0in this bot matrix. All8native kinds were bought, but ownership is not causal benefit exposure. Keep prior real finance/Spirit route, forced-RPS socket proofs and500credit native paired mechanisms separate. Do not nerf unexercised systems or rank policies by win share from homogeneous games. Next: review9remaining semantic contracts/full48numbers; gather deliberately eligible normal-resource financial/theft/native-benefit cases before release tuning. No runtime/game UI/art/weights/default change in this checkpoint.


## Remaining48 complete experimental proposal — 2026-11-04 (unapproved)

[Review all48 proposed specifications](proposals/remaining48-experimental-v1.html) ([JSON](proposals/remaining48-experimental-v1.json)). This supersedes the earlier “draft individual contracts next” handoff, not the factual8native/48absent audit. Includes48anchors,35primary effect contracts, active/consumable/held costs, rarity/copy rounding, shared caps, physical/origin custody and age, money funding, known-information guards,9remaining semantic decisions, and required post-approval runtime/UI/replay/balance evidence. E05 meaning remains approved, its numbers are proposed. No remaining48runtime, optional effects, default change, new art or scoring-weight changes were implemented. E69 is explicitly a proposed capped asset-only addition, not a B10 alias or approval to change all-score modifiers.

Next: obtain one explicit approval for this concrete experimental package, then implement versioned native56 with capability/predicate/lifecycle coverage and measured benefit evidence. Static document checks and12paper-math examples do not prove runtime or balance. Keep approvedpilot8/1551908 scoring and14UI baselines frozen. Whole-game goal remains active.


## Remaining48 approved — Task1 numerical/catalog foundation2026-11-04

User explicitly approved the complete experimental48 package from532dece (SHA f16175ff4bc0ad8162b56a5266552d9efc730c9681910e36684d71dba2ce7508), exact reply “อนุมัติชุดทดลอง48ชิ้นตามเอกสาร”. See [approval receipt](remaining48-approval.json) and [implementation plan](implementations/remaining48-plan.md). This supersedes earlier9pending-meaning/48pending-number notes. Frozen proposal JSON remains unchanged as approval provenance; generated review and current audit show the separate approval. Optional effects/new art/default release/balance are not inferred. Do not ask package approval again.

Task1 produces generated typed48 identities/35parameter groups, exact approved SHA and shared numerical primitives using existing itemEffectScale/integerEffect. Binary rights take strongest single instance (cannot sum fractional copies); held tools strongest5 per family; active/consume require one selected instance; positive action costs retain minimum and already-free actions stay free; funded bonus rejects invalid credit units and caps by unreserved bank. Foundation18/18 and pilot29/29 tests plus server build pass. Initial missing-module RED preserved; first numeric run16/18 failed only exact1.2 versus existing IEEE3×0.4 representation, so raw-scale assertion now uses tiny tolerance while all integer/cap assertions remain exact. No game settlement behavior or catalog defaults changed; source owners are still unbound for48.

Next Task2: versioned new56 pools/metadata without old-kind aliases, preserve versions1–4 and private source separation. Tasks3–4 implement automatic/active/consume owner hooks, persistent custody/age/use/funding/provenance/status rules. Task5 actual Comic interactions/reconnect, Task6 full event/capability reconciliation and normal-resource benefit/balance evidence. Early source observation found38BOND specs beyond21Atlas helper-call gates, and E25 rawNPC favorites; these require a complete separate consumer audit, not automatic blade/hammer aliases. Native gameplay count stays8/56 despite typed contract data. Whole-game goal remains active.

## Current native56 checkpoint — 2026-11-04

48package is approved in `remaining48-approval.json`; do not request its numbers/semantics again. Experimental catalog5 registers all56 canonical IDs/assets/anchors,7per merchant. Verified primary effects =9 (pilot8+Autometa E05), remaining47 primary hooks disabled/unbound. Default3 and opt-inpilot4 unchanged; optional effects off. Registration/lifecycle ownership is not proof of primary benefit.

See `native56-runtime.json`, immutable `native56-stage1.json`, `implementations/remaining48-plan.md` and `../validation/native56-catalog-2026-11-04/verification.json`.198focused/65lifecycle/6Collector socket tests;32historical replays,4new40credit/6life games,16byte-identical pilot public audits;18menu/14unchanged approvedpixel references pass. Not full56 balance/game acceptance. Next: versioned effects revision then remaining47 approved canonical owner hooks, Task3–6.

Ruling: absent a later explicit effects revision preserves archived catalog5stage1 (pilot8+E05); new owner bindings must not change old sparse-config replay.

## Native56 effects2 checkpoint — 2026-11-04

Supersedes the stage1 current-count note above:56registered /10primary verified (pilot8+E05+E06) /46primary pending. `native56Effects:2` is selected only for newly created experimental catalog5 runs; main default3 and opt-inpilot4 unchanged. Exact restore without flag keeps stage1; archived2 keeps stage2. E06 reduces actual failed-challenge credit penalty after void-seal resolution, using floor/cap and player+origin/encounter ledgers. Only an actual zero penalty (including void0) preserves rights; a positive penalty consumes the eligible right even if the saving rounds to zero. Approved held lock restriction applies in2; original sparse5 audits remain unchanged.

203focused tests include65lifecycle identity tests (not an additive268tests);6Collector socket checks,32old strict replays,4new normal-budget2/4seat games and16byte-identical pilot public audits pass. See `native56-runtime.json`, `native56-stage2.json` and `../validation/native56-stage2-2026-11-04/verification.json`. No E06 normal-budget benefit exposure, all56balance or new browser pixel-run claim. Next: remaining46 primary owners plus full predicate/UI/normal-budget acceptance.

Contract correction: E06 counts the first real positive penalty, not the first profitable saving. Positive penalty with eligible basis points consumes player/origin rights even when the saving rounds to0; actual zero penalty/void0 preserves them. A failing regression caught38 instead of50 on the next challenge; fixed before commit. No new passive no-op rule.

Final effects2 checkpoint verification:205focused pass, including65lifecycle and both sealed-stage replay tests;410source fingerprints/10UI contracts and293Atlas inputs current. No fresh stage2browser pixels claimed.

## Current native56 effects3 — 2026-11-04

Current count supersedes earlier checkpoints:56registered /21primary owner-tested /35pending. Eleven new kinds implement E28/E61/E63/E02/E11/E07 with the exact approved formulas; default3 and opt-inpilot4 unchanged. Native56 effects3 preserves absent stage1 and explicit2; future versions must preserve3too. `native56-runtime.json` separates membership from owner proof; `native56-stage3.json` pins4new normal-budget full-game archives.

Evidence:229focused (includes65lifecycle; do not add them),124related regressions pass;3priorUI assertion failures reproduce812ef79 (semantic reconciliation still pending) and remain open. One old audit test cwd path fixed.6Collector socket checks,32old replays+4new40credit/6life games and16byte-identical pilot audits pass. Read `../validation/native56-stage3-2026-11-04/verification.json` for scope, failures and source pins. Not full56 public benefit coverage, pixel approval or balance acceptance.

Ruling: E61 boundary snapshot precedes settlement; shared physical-origin rights use existing player order. Reason: no retroactive returned-loan bonus or duplicate origin payout. Risk: same-origin copies across seats compete in canonical order; covered by original/copy boundary test.

Still required before default rollout:35primary hooks; full native predicate/custody/benefit matrices; Task5 authoritative quote/expected-cost synchronization (E63 origin rights can change between displayed quote and action), item remaining-use explanations and full UI/network/balance acceptance. Whole-game goal remains active.

Effects3 final source verification:229focused pass;124related pass/3priorUI failures remain;6socket pass;411UI fingerprints/10contracts and298Atlas inputs current. Main default and approved image references unchanged; no fresh browser pixel claim.

Effects3 edge verification: lock expiry is evaluated after status expiry against a physical pre-boundary custody snapshot; E02 ranges retain unpowered replacement truth. Two RED→GREEN cases, final229focused pass; no candidate archive or approved image hash changed.

## Recovery quote synchronization — 2026-11-04

New catalog5/effects3 creations now add `recoveryQuoteRules:1`; explicit effects2 and exact historical restore keep their old shapes/semantics. Recovery offer tokens contain only visible actor/encounter/shop/NPC/target/price/range terms, never seed or hidden roll/origin IDs. Existing UI and bot submit the token conditionally; server checks it before spending, recovery rights or effect ledgers. A changed E63 shared-origin right rejects the old quote atomically; fresh retry, reconnect and repeated request tested. Read-only views/unrelated revision changes do not invalidate unchanged terms. This closes the observed E63 stale-payment gate, not all Task5 UI work.

Evidence:145focused pass;12wire/unit checks pass (includes actual two-socket E63 race/reconnect/retry and Collector4/5);82related pass/2previously recorded UI assertions remain.32historical normal audits+4new quote-enabled40credit/6life games pass;16pilot audit hashes unchanged/32strict replays.412UI source pins,10contracts,18menu flows and14approved visual comparisons pass with matching fresh receipts. Existing build chunk-size warning remains. FullCPU suite and dedicated browser-click recovery path not claimed.

Count stays56registered/21primary owner-tested/35pending; defaults3/pilot4, approved values, optional effects and original screenshot baselines unchanged. Whole-game goal active. Sources/evidence: `../validation/recovery-quote-2026-11-04/verification.json`. Next: continue approved automatic settlement owners; finish predicate/custody/public-benefit/UI/balance matrices before default56.
