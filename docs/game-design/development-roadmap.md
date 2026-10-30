# แผนพัฒนาเกมจริงและกระดานงาน

อัปเดต 2026-10-28 · แผนดำเนินงาน ไม่ใช่คำรับรองว่างาน runtime เสร็จแล้ว

## ลำดับงาน

| ลำดับ / ID | งาน | สถานะ | ขึ้นกับ | เกณฑ์จบ / หลักฐาน |
|---|---|---|---|---|
| 0 CTX-01 | Catalog และแผนที่ทั้งระบบ | done | — | ตรวจ atlas และ HTML ผ่าน |
| 0 CTX-02 | Context กลางและแผนส่งต่อ | done | CTX-01 | มีจุดเริ่มต้น/งานถัดไป/กติกาอัปเดตถาวร |
| 1 BAL-01 | Baseline runtime และข้อผิดพลาดเศรษฐกิจ | done (initial baseline) | CTX-02 | เก็บ revision, config server/room, seed, policies, ผลก่อนปรับ; ไม่เอา simulator เกมเก่ามาอ้างเป็น appraisal |
| 2 RULE-01 | Vault เงินต้นตามอายุและดอกเบี้ย 10% | done | BAL-01, D02 | ฝาก/ถอนบางส่วน/เติม/ฝากซ้ำ/ข้ามช่วง/settle ซ้ำถูกต้อง; ไม่มีดอกเบี้ยย้อนหลัง |
| 2 RULE-02 | ขโมยและ forced RPS ครบวงจร | prepare | BAL-01, D01 | ทั้ง UI/timeout/disconnect/retry ไม่มีช่องปฏิเสธหรือ settle ซ้ำ |
| 3 STRAT-01 | เส้นทางชนะหลายแบบและเป้าหมายต่อสาย | design in progress | BAL-01; วิธีจบยืนยันแล้ว: Collector | มี progress/cost/counter ต่อสายและผลทดสอบแยก policy; ดู strategic-paths.md |
| 3 ITEM-01 | สัญญาข้อมูล runtime ของสินค้าใหม่ 56 | ready for design | CTX-01, STRAT-01, D05 | stable IDs, merchant/type/palette, trigger/target/scale/stack/cap, legacy predicates แต่ละตัวมี mapping หรือระบุเลิกใช้ |
| 4 ITEM-02 | กลุ่มทดลอง 8 ชิ้น คนละพ่อค้า | queued | ITEM-01 | ครบ spawn/ซื้อ/ตรวจ/ถือ/ใช้/ขาย/สำเนา/จบเกม; ใช้งานบน comic จริง ไม่มี realistic fallback |
| 5 RULE-03 | Collector Wishlist แบบ 3+2 | prepare | ITEM-02, D03 | timeline จัดส่ง/ปกปิด/เปิดหนึ่ง/จ่ายซื้อ/reconnect ทดสอบครบ; ไม่สับสนกับ E73 |
| 5 RULE-04 | คะแนนพิเศษและ rarity กลุ่ม | prepare | ITEM-02, D04 | ตัวนับอ้าง audit ได้; คะแนน ×2/×3 ถูกต้อง; tie policy ชัดและ deterministic |
| 6 ITEM-03 | ย้ายครบ 56 พร้อม event/encounter/omen | queued | ITEM-02, RULE-01–04 | ไม่เหลือ target predicate ที่อ้างชนิดเก่าโดยไม่มีคำอธิบาย; action/เหตุการณ์ใช้ได้กับของใหม่ |
| 7 BAL-02 | ปรับเศรษฐกิจ/ความเสี่ยง/พ่อค้า | queued | ITEM-03 | รายงานเทียบ baseline แบบ seed เดียวกัน แยกตาม merchant/rarity/จำนวนคน |
| 8 PLAY-01 | เล่นเต็มเกมกับ UI comic | queued | BAL-02 | จบรัน/Collector/ตาย/ตลาด/ประมูล/loan/vault/RPS/reconnect และ logs อธิบายเหตุผลได้ |

`ready` = เริ่มงานตามขอบเขตได้; `prepare` = ทำส่วนที่กฎชัดได้ แต่รายละเอียดใน Dxx ต้องตกลงก่อนปิดงาน; `queued` = ยังไม่เริ่ม

## งานถัดไปที่ควรหยิบ: BAL-01

1. อ่าน `system-atlas/profiles` และ `encounters-config.md` แยก engine defaults กับ server-entry/room mode
2. ตรวจ `src/simulation/appraisal.ts` ผ่าน Trail ว่าใช้กฎ/profile ใด; `src/simulation/balance.ts` อาจเป็นอีกโหมด ต้องตรวจแทนการสมมติ
3. รันชุดตรวจเดิมและเก็บ command/results จริง ไม่อ้างว่าผ่านก่อนรัน
4. เก็บ baseline ตาม balance-workflow.md; หาก simulator ยังไม่ครอบคลุมระบบใหม่ ให้รายงาน coverage ก่อนเพิ่ม harness ที่จำเป็น
5. แยกบั๊ก invariant ออกจากค่าที่อยาก tune; ปิดบั๊กก่อนใช้ตัวเลขมาสรุปบาลานซ์

## ขอบเขตเปลี่ยนระบบ

- RULE-01: `secure-storage.ts`, โครงสร้าง state/serialization, จังหวะ `advanceAppraisalEncounter`, audit/replay, view และ tests ที่เกี่ยวข้อง
- RULE-02: theft duel, dispatcher, server lifecycle/timers, client controls, audit/replay และ reconnect tests
- ITEM-01–03: catalog ใหม่, generation, effect resolution, passive/activated effects, rarity/copy scaling, event eligibility, merchant favorite/bond predicates, inventory/views และ comic assets
- RULE-03: Collector state/timeline/action/view, stock/payment/custody, audit/replay และ tests
- RULE-04: scoring/stat counters/settlement/result views/audit และ tests

นี่เป็นขอบเขตระดับระบบ ก่อนลงมือแต่ละงานต้องทำแผนเฉพาะจาก source spans และ callers ล่าสุด ห้ามถือรายชื่อไฟล์นี้ว่าครบ blast radius ตลอดไป

## เงื่อนไขก่อนเรียกพร้อมเล่น

- กฎยืนยันครบ; ค่าที่ยังค้างมีบันทึกการตัดสินใจ ไม่ซ่อนด้วย default
- ชุดสินค้าใหม่ครบและไม่ผูก effect จากชื่อหรือรูปโดยเดา
- Retry/reconnect/replay ไม่สร้างเงิน ของ ดอกเบี้ย หรือรางวัลซ้ำ
- UI ยังรักษา concept/spacing/component กลาง และไม่เปิดข้อมูลลับผิดช่วง
- รายงาน balance ระบุ coverage/ข้อจำกัดและผลเล่นจริง; ไม่มีคำว่า balanced จากกราฟ degree อย่างเดียว


## หลักฐานล่าสุด

[Baseline attempt 2026-10-28](balance-reports/2026-10-28-baseline-attempt.md): ตรวจเอกสารผ่าน แต่ `npm test` ยังไม่ผ่านขั้น build จึงไม่มีผลทดสอบเกมหรือผลบาลานซ์ งาน BAL-01 ยังไม่เสร็จ


## ส่งต่อหลัง RULE-01

- BAL-01: baseline 12 เกมจบครบ พร้อม seed/config; server build จบ 19.55s ไม่พบเหตุให้แก้ build แบบคาดเดา
- RULE-01: เงินต้นอายุครบ 10%, ถอนใหม่ก่อนเก่า, floor และกันจ่ายซ้ำ; audit เก่าไม่มี flag รักษา 4%
- ชุดใหญ่ post-change 840/841: เคสที่ผิดคาดมาจาก E43 subsidy ใน fixture เครือข่าย แก้ความคาดหมายแล้วชุดที่เกี่ยวข้องผ่าน 69/69; ไม่อ้างว่าได้รันชุดใหญ่ซ้ำครบอีกรอบ
- Client/server TypeScript และ atlas checker ผ่าน ดู balance-reports/2026-10-28-vault-interest.md
- ถัดไป STRAT-01 ผูกเป้าหมายแต่ละสายกับการตัดสินพร้อมกันตอน Collector ก่อนกำหนด effect ใหม่; RULE-02 เตรียมได้แต่ยังต้องยืนยัน timeout


STRAT-01: ผู้ใช้ยืนยัน 2026-10-28 ให้ตัดสินพร้อมกันตอนจบเมื่อ Collector มา ขั้นต่อไปคือเป้าหมาย/โบนัสต่อสายและวิธีเปรียบเทียบ ไม่ต้องถามรูปแบบจบซ้ำ


## GHOST-01 — สัญญาบริการหลังตาย

สถานะ design in progress ดู ghost-service-contracts.md ใช้กติกาล่าสุดจากผู้ใช้แทนข้อเสนอร่วมชัยชนะผ่านพันธมิตร ก่อนลง runtime สูตรจ่ายเมื่อส่งมอบและ 10%base หักราคาสินค้ายืนยันแล้ว ต้องปิดอัตราแปลงรายได้เป็นคะแนนพิเศษ/ปัดเศษ/เงินไม่พอ จากนั้นกำหนดวงจรรับงาน/สามช่อง/หมดสิทธิ์/ส่งมอบ/reconnect โดยคนเป็นไม่ต้องรอ


## UI-FLOW-01 — ทะเบียนหน้าจอและ concept

สถานะ: context/flow พร้อมอ้างอิง; ภาพเริ่มที่ S01/E117 ด่านเก็บค่าผ่าน (core2) ใช้ screen-flow.json เป็นทะเบียนและ screen-flow.html เป็นบอร์ด ดู screen-context.md สำหรับ brief/style/source mapping ทุกภาพต้องมี ID, variant, state และสถานะ draft/approved แยกกัน ไม่เปลี่ยน runtime ตามภาพโดยไม่มี logic รองรับ


## CAPTURE-01 — Existing game first

เสร็จ:25ภาพ/14กลุ่มที่ตรวจพบ จากlive5และpreviewเดิม20 ผูกในHTMLหลักเป็นdefault view มีstyleและsource hashesแยกจากconcept หยุดgen งานต่อไปเลือกจากgapจริงในcurrent-ui-inventory.md ไม่ถือว่า30รายการในregistryคือ30หน้าที่ต้องออกแบบใหม่


2026-10-29 · S03/E109: ใช้ MerchantEventPortrait กลาง จัดสัดส่วน idle ทั้ง 8; ตรวจภาพและฐานร่วมแล้ว ต่อไปใช้กับ event พ่อค้าอื่นเมื่อพัฒนา พร้อมตรวจภาพอารมณ์อื่นก่อนใช้จริง ดู implementations/S03-E109.md

2026-10-29 · MERCHANT-EXPRESSION-01: กฎท่าทางพ่อค้าตามบริบท S02/S04 ยืนยันแล้ว รอพัฒนา ใช้ 3 ท่า idle/smile/angry จัดสัดส่วนแต่ละอารมณ์ และกำหนดเวลา/reconnect/reduced motion ก่อนเชื่อมผลจริง ดู merchant-expression-rules.md

2026-10-29 S06 table v05: ลง comic build แยกแล้ว ตรวจ navigation วนสินค้าและโต๊ะเพื่อนผ่าน; ยังไม่ตรวจธุรกรรมหลายผู้เล่นจริง ดู implementations/S06-trade.md

2026-10-29 S06 fidelity correction: ฉากโต๊ะ comic จริง + แก้ grid ครึ่งจอ + ขนาดของ/baseline + จบซื้อขายในโต๊ะ. Browser1440×722/1024×768ไม่ล้น; navigation/เปิดปิดรายละเอียดผ่าน; ดู implementations/S06-trade.md และ C27. ยังไม่ตรวจธุรกรรมหลายผู้เล่นจริง

S06 tooltip follow-up: เพิ่ม ComicTooltip กลาง ปุ่ม transition และข้อมูลย่อ known facts; จัด empty state กลางพื้นที่. Build appraisal ผ่าน.

2026-10-29 S06 tooltip fix: ลบป้ายกระเป๋าข้างปุ่มและคำสั่งย่อซ้ำใต้สินค้า (เก็บชื่อ/ราคา). ComicTooltip เปิด focus เฉพาะ :focus-visible, ปิดเมื่อ click/pointerdown/blur/scroll เพื่อไม่ค้างจาก navigation. Browserผ่าน hover→leave ปิด, คลิกกระเป๋า/วนหน้าปิด, keyboard Shift+Tab เปิด, Escapeปิด; build109modulesผ่าน. ภาพ implements: implementations/S06-tooltip-fix.png.

2026-10-29 S06 quiet overlays: ใช้ NavigationIcon/TableReturnIcon/PlayerOutlineIcon จาก icons กลางแทน glyph และ silhouette เดิม กระเป๋ามีลูกศรลง SVG; comic-overlay.css เป็น style กลาง opacity .42→1 เมื่อ hover/focus-visible, touch .75, reduced motion ไม่มี transition. Browserวัด idle.42/hover1, tooltipทำงาน, เปลี่ยนหน้าคลังเหลือ2ชิ้นและกลับผ่าน ไม่มี scroll1440×722. Build110modulesผ่าน. ภาพ implementations/S06-overlay-idle.png และ S06-overlay-hover.png.

2026-10-29 S06 shared frame correction: ผู้ใช้ย้ำใช้กรอบกระเป๋าเป็นมาตรฐานทุกเมนู. เพิ่ม comic-frame.css เป็นกฎร่วมของ ComicMenu/กระเป๋า/โต๊ะซื้อขายด้วย --comic-frame-*; ไม่กำหนดขนาดแยก. วัด1440×722: ทั้ง7กรอบ x24,y60,w1392,h562; 1024×800 ซื้อขาย/กระเป๋า x24,y60,w976,h640;1920×800 x220,y60,w1480,h640 เท่ากัน. Build111modulesผ่าน; page1440×722ไม่ล้น. ดู implementations/S06-shared-frame.png. กฎถาวรอยู่ AGENTS.md และ screen-context.md.

2026-10-29 S06/item-sale v01: ผู้ใช้ขอconceptหน้ารายละเอียด/ประกาศขายจากscreenshot21.21.31. สร้างภาพและbriefใน concepts/S06-item-sale-v01.* ลงทะเบียนvariantdraftแยกจากtabletop/ภาพจับปัจจุบัน ไม่ใช่หน้าใหม่ ไม่อนุมัติและไม่แก้runtime. แสดงstateNPC52เครดิตยังไม่ประเมิน/knowledge? ประกาศขายปิด โชว์ยังได้.

S06/item-sale v02: ผู้ใช้ขอcomicขึ้น ทำภาพeditจากv01ให้UIเป็นcaption/หมึก/halftone ไม่ใช่เพียงภาพสินค้า. ลงทะเบียนdraftแยก ไม่มีruntimeเปลี่ยนและยังไม่อนุมัติ. ดูconcepts/S06-item-sale-v02.md

2026-10-29 S06/item-sale v02 implemented in isolated comic build. ItemSalePanel + Share comic presentation retain same handlers/eligibility; caption/paper choice controls and knownfacts3cells. 1024×800 columns486/486;1920×800 738/738;1440×722 694/694; zero panel overflow and frame matches inventory. Browser public-fixture tests confirmed share claims genuine/cursed+rebate3, over-budget disabled, owned sale/show omit claims, withdraw allowfalse. Menu overlap found and fixed with utilityOpen pause; only one dialog remains when utilities open. Build114modules passed. C28 actual fixture capture, not AI/live multiplayer; portable code and fixture under implementations/S06-sale-source and docs/validation/s06-item-sale.

2026-10-29 S06 style correction: ผู้ใช้ย้ำเกมเดียวกันต้องอ้างอิงUIที่มี ไม่สร้างstyleใหม่ต่อหน้า. ยกเลิกbrushcaption/whitechoice/paperfactsและdividerกลาง/ที่มา/rebate/footer; ใช้ComicMenu header65px/line1pxและComicButtonดำแดงเดิม. คอลัมน์1024=486/486,1920=738/738,1440=694/694. แถวchoice/rebateleftตรงกัน590/1066/826ตามviewport; stepper40pxเท่ากันและpaneloverflow0. ไม่เปลี่ยนShare logic. C28จับใหม่จริงตามstyleนี้.

## CONTINUITY-01 — 2026-10-29

User authorized isolated comic migration into apps/comic. UI continuity/design system/AGENTS and repeatable contract/pixel gates live in docs/ui-system. Existing root gameplay changes preserved. Screenshot candidates await explicit review; see verification.md for actual gate outcomes and next tasks.

CONTINUITY-01 handoff: isolated app/docs/tooling ready for review; partial verification, not complete. UI contract tests5 pass, SSR continuity4 pass, focused root81 pass, atlas106 inputs pass. Full pixel run13/14 then targeted retry2/3; enlarged inventory art has0.279% raster drift. Next: diagnose stable cross-navigation artwork rendering without masking art/relaxing thresholds, obtain human candidate approval, and reconcile historical comic test expectations separately. See docs/ui-system/verification.md.

CONTINUITY-01 continuation:7 shared contract tests pass;18 actual preview menu flows pass at1024/1440/1920 with equal header padding/actions/radius, item restoration, no countdown reset/overflow. All63 migrated runtime files still match import hashes. DPR2 and warmed loads did not resolve cross-width artwork raster drift; checkpoint DPR1 candidates restored. Full UI historical suite60/67; focused continuity/price suite11/12; full simulation suite stopped after verified CPU-bound work. Pixel baseline approval and reproducibility remain open. See docs/ui-system/completion-audit.md.

CONTINUITY-01 art verification:46 assets validate from outside repo cwd; tests distinguish10 legacy display families in2 art versions from the new56 catalog.8 merchants each have3 mood frames. Source gate359 includes provenance manifest. Historical UI file61/67 (one stale art assertion fixed;6 remaining), no production/image changes. See docs/ui-system/asset-provenance-verification.json. Pixel baseline review/determinism still open.

CONTINUITY-01 latest2026-10-30: exact14 references approved by user, two full comparisons14/14, affected functional79/79, Node contracts10/10, existing18 menu flows. Earlier raster/assertion/approval gaps above are superseded by dated evidence in docs/ui-system/verification.md. Remaining: resolve root Atlas source provenance (pre-existing aged10% interest work), commit scoped follow-up and final freshness checks; no full simulation/balance claim.
