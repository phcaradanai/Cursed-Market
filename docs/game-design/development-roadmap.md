# แผนพัฒนาเกมจริงและกระดานงาน

อัปเดตสถานะ 2026-10-31 · Active Comic: apps/comic · แผนดำเนินงาน ไม่ใช่คำรับรองว่างาน runtime เสร็จแล้ว

## ลำดับงาน

| ลำดับ / ID | งาน | สถานะ | ขึ้นกับ | เกณฑ์จบ / หลักฐาน |
|---|---|---|---|---|
| 0 CTX-01 | Catalog และแผนที่ทั้งระบบ | done | — | ตรวจ atlas และ HTML ผ่าน |
| 0 CTX-02 | Context กลางและแผนส่งต่อ | done | CTX-01 | มีจุดเริ่มต้น/งานถัดไป/กติกาอัปเดตถาวร |
| 1 BAL-01 | Baseline runtime และข้อผิดพลาดเศรษฐกิจ | done (initial baseline) | CTX-02 | เก็บ revision, config server/room, seed, policies, ผลก่อนปรับ; ไม่เอา simulator เกมเก่ามาอ้างเป็น appraisal |
| 2 RULE-01 | Vault เงินต้นตามอายุและดอกเบี้ย 10% | root+Comic implemented/verified | BAL-01, D02 | ฝาก/ถอนบางส่วน/เติม/ฝากซ้ำ/ข้ามช่วง/settle ซ้ำถูกต้อง; ไม่มีดอกเบี้ยย้อนหลัง |
| 2 RULE-02 | ขโมยและ forced RPS ครบวงจร | implemented/tested518d702; broad balance pending | BAL-01, D01 | ทั้ง UI/timeout/disconnect/retry ไม่มีช่องปฏิเสธหรือ settle ซ้ำ |
| 3 STRAT-01 | คะแนนผลงานหลายระบบของทุกคน | direction+sale/trust units approved; weights/runtime pending | BAL-01; Collector พร้อมกัน | จำนวนขาย/ยอดเครดิตขายแยก, trustสะสม, canonical counters/anti-farming และกราฟเพิ่มทีละระบบ; ดู personal-scoring-direction.json |
| 3 ITEM-01 | สัญญาข้อมูล runtime ของสินค้าใหม่ 56 | pilot8 native contract implemented;48 pending | CTX-01, STRAT-01, D05 | stable IDs, merchant/type/palette, trigger/target/scale/stack/cap, legacy predicates แต่ละตัวมี mapping หรือระบุเลิกใช้ |
| 4 ITEM-02 | กลุ่มทดลอง 8 ชิ้น คนละพ่อค้า | pilot8 implemented/tested experimentally; balance pending | ITEM-01 | ครบ spawn/ซื้อ/ตรวจ/ถือ/ใช้/ขาย/สำเนา/จบเกม; ใช้งานบน comic จริง ไม่มี realistic fallback |
| 5 RULE-03 | Collector Wishlist แบบ 3+2 | implemented experimental; reviewed, minor deferred | ITEM-02, D03 | timeline จัดส่ง/ปกปิด/เปิดหนึ่ง/จ่ายซื้อ/reconnect ทดสอบครบ; ไม่สับสนกับ E73 |
| 5 RULE-04 | คะแนนพิเศษและ rarity กลุ่ม | prepare | ITEM-02, D04 | ตัวนับอ้าง audit ได้; คะแนน ×2/×3 ถูกต้อง; tie policy ชัดและ deterministic |
| 6 ITEM-03 | ย้ายครบ 56 พร้อม event/encounter/omen | queued | ITEM-02, RULE-01–04 | ไม่เหลือ target predicate ที่อ้างชนิดเก่าโดยไม่มีคำอธิบาย; action/เหตุการณ์ใช้ได้กับของใหม่ |
| 7 BAL-02 | ปรับเศรษฐกิจ/ความเสี่ยง/พ่อค้า | queued | ITEM-03 | รายงานเทียบ baseline แบบ seed เดียวกัน แยกตาม merchant/rarity/จำนวนคน |
| 8 PLAY-01 | เล่นเต็มเกมกับ UI comic | queued | BAL-02 | จบรัน/Collector/ตาย/ตลาด/ประมูล/loan/vault/RPS/reconnect และ logs อธิบายเหตุผลได้ |

`ready` = เริ่มงานตามขอบเขตได้; `prepare` = ทำส่วนที่กฎชัดได้ แต่รายละเอียดใน Dxx ต้องตกลงก่อนปิดงาน; `queued` = ยังไม่เริ่ม

## งานถัดไป: ข้อสรุป Collector/STRAT และ coverage ของpilot ก่อนย้ายอีก48

สถานะรวมที่แสดงบน HTML หลัก: [game-status.json](game-status.json). GHOST-01 ทำและตรวจแล้วใน51d89ea แต่ไม่ใช่การปิด PLAY-01 ทั้งเกม

## ขั้นตอน BAL-01 เดิม (ประวัติ; initial baseline เสร็จแล้ว)

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

[Baseline attempt 2026-10-28](balance-reports/2026-10-28-baseline-attempt.md): ตรวจเอกสารผ่าน แต่ `npm test` ยังไม่ผ่านขั้น build จึงไม่มีผลทดสอบเกมหรือผลบาลานซ์ นี่คือผลครั้งแรก ก่อน baseline12เกมด้านล่าง; ไม่ใช่สถานะปัจจุบัน


## ส่งต่อหลัง RULE-01

- BAL-01: baseline 12 เกมจบครบ พร้อม seed/config; server build จบ 19.55s ไม่พบเหตุให้แก้ build แบบคาดเดา
- RULE-01: เงินต้นอายุครบ 10%, ถอนใหม่ก่อนเก่า, floor และกันจ่ายซ้ำ; audit เก่าไม่มี flag รักษา 4%
- ชุดใหญ่ post-change 840/841: เคสที่ผิดคาดมาจาก E43 subsidy ใน fixture เครือข่าย แก้ความคาดหมายแล้วชุดที่เกี่ยวข้องผ่าน 69/69; ไม่อ้างว่าได้รันชุดใหญ่ซ้ำครบอีกรอบ
- Client/server TypeScript และ atlas checker ผ่าน ดู balance-reports/2026-10-28-vault-interest.md
- ถัดไป STRAT-01 ผูกเป้าหมายแต่ละสายกับการตัดสินพร้อมกันตอน Collector ก่อนกำหนด effect ใหม่; RULE-02 เตรียมได้แต่ยังต้องยืนยัน timeout


STRAT-01: ผู้ใช้ยืนยัน 2026-10-28 ให้ตัดสินพร้อมกันตอนจบเมื่อ Collector มา ขั้นต่อไปคือเป้าหมาย/โบนัสต่อสายและวิธีเปรียบเทียบ ไม่ต้องถามรูปแบบจบซ้ำ


## GHOST-01 — สัญญาบริการหลังตาย

สถานะ implemented and verified ใน Comic commit51d89ea. กฎยืนยันครบและเชื่อม runtime แล้ว ดู ghost-service-contracts.md, implementations/ghost-acceptance-audit.md และ ../ui-system/ghost-functional-verification.json. ผลตรวจนี้ไม่ใช่ผลบาลานซ์ทั้งเกม


## UI-FLOW-01 — ทะเบียนหน้าจอและ concept

สถานะ: context/flow พร้อมอ้างอิง; ภาพเริ่มที่ S01/E117 ด่านเก็บค่าผ่าน (core2) ใช้ screen-flow.json เป็นทะเบียนและ screen-flow.html เป็นบอร์ด ดู screen-context.md สำหรับ brief/style/source mapping ทุกภาพต้องมี ID, variant, state และสถานะ draft/approved แยกกัน ไม่เปลี่ยน runtime ตามภาพโดยไม่มี logic รองรับ


## CAPTURE-01 — Existing game first

ปัจจุบัน38ภาพ/20กลุ่มที่ตรวจพบ (รวมสถานะย่อย) จากlive5และfixture33 ผูกในHTMLหลักเป็นdefault view มีstyleและsource hashesแยกจากconcept หยุดgen งานต่อไปเลือกจากgapจริงในcurrent-ui-inventory.md ไม่ถือว่า30รายการในregistryคือ30หน้าที่ต้องออกแบบใหม่


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

CONTINUITY-01 closure2026-10-30: source gap resolved by explicitly approved separate RULE-01 commit4548562. Root server/client typechecks,29 vault/client/seal cases and Git-export Atlas106 input/output verification pass. Exact approved UI references unchanged; prior79 functional/10 contracts/18 preview flows/two14-image comparisons retained. Continuity deliverables complete; future gameplay integration and balance remain separate roadmap work. RULE-01 root implementation is preserved; no10% runtime integration into comic is implied.

2026-10-30 S08 concept-only follow-up: user explicitly requested redesign of the existing end-of-encounter reward/coin screen. Added concepts/S08-salary-v01.png and brief/prompt with shared menu frame, equal columns and a modest comic coin. Draft/unapproved; C21 remains historical runtime evidence, approved UI baselines and game code unchanged. Fixture: encounter3, one multi-enabled coin, pending10, correct+5/wrong−5 floor0; add-coin cost10 from wallet (even encounter base15), not5. Follow-up implementation requires user approval and multi-coin/tossing/settled validation. Image-generation authorization is specific to S08, not a blanket resume of all concepts.

2026-10-30 S08 implemented after explicit user approval: shared ComicPhaseFrame/inventory geometry/header and ComicButton, equal pending cash-out/coin columns/actions, compact2-coin pages retaining all predictions. REVEAL keeps six utility menus, with new bag/status access read-only; pending duplicate ready/result panel removed, existing S09 follows payout. Game rules and legacy app untouched. New actual fixture captures C29/C30 replace draft as current view, concept remains design reference; no new pixel-baseline approval. Build/focused83/contract10 results and exact browser evidence in implementations/S08-reward.md and docs/ui-system/s08-* reports. Known broader i18n4 failures reproduced before change, not waived.

2026-10-30 S09 implemented after user authorized concept + implementation together. Reuses inventory ComicPhaseFrame, common header/buttons and equal columns; paged custody shelves, centered equal44px money controls and one ready action. C31–C33 record normal/full/empty actual fixtures, not live payment or separately approved pixel baselines. Final zero-result toss remains mounted until animation ends. Comic4% and root aged10% remain separate runtimes; no engine rules changed. Verification: focused104/104, UI contracts10/10, original sealed baselines14/14, peer menus18/18 and S09 browser9/9 at1024/1440/1920; synthetic incoming-DTO animation passes. See implementations/S09-vault.md and docs/ui-system/s09-* reports. Known broad i18n4 failures remain; no full simulation/live multiplayer/phone/balance claim.

2026-10-30 ghost service: user authorized implementation and confirmed 1 earned credit = 1 bonus point, insufficient buyer credits leave delivery waiting for funds. The ghost system remains unimplemented; pending details include commission rounding, RPS ties, simultaneous contracts, disconnect and end-of-game handling. Card tracking requires server validation without sending concealed answers. See ghost-service-contracts.md; do not present a fixture as a working service.

2026-10-30 ghost tracking foundation: added isolated server-side permutation/guess validation and red/green test `apps/comic/tests/ghost-tracking.test.ts` (1/1 pass; comic server build passes). It is not connected to rooms, actions, persisted state, clients or ghost hiring. A visible server-authoritative shuffle sequence, reconnect and idempotency are still required before it is playable. Do not treat this module as a complete or secure network integration.

2026-10-30 GHOST-01 active program: see implementations/ghost-delivery-plan.md for ordered engine/network/UI/contracts/search/settlement gates and open decisions. Goal created at user's request. Expand boundary/permutation tests before network integration; no playable claim from helper tests.

2026-10-30 ghost integration active: actual six actions and GhostWorld wired, not just helper. Core7/7, focused31/31, real two-socket1/1, UI contracts10/10 and peer menus18/18 pass. Browser actual minigame unlock verified; C34 is separate component fixture. Visual gate13/14 (status wide drift1.268%); do not rebaseline or complete goal. Buyer-death cancellation/reunlock approved and implemented; latest build/network/UI reruns still needed after final edits. Exact handoff: implementations/ghost-delivery-progress.md.

## GHOST-01 runtime milestone — 2026-10-30

Confirmed rules are closed, including buyer death and floor/tie/end handling. S11/G01–G04 are now integrated in apps/comic: server card clock, contracts, independent RPS slots, atomic delivery and bonus scoring. Earlier design-only paragraph is historical. Current evidence/limits: implementations/ghost-delivery-progress.md and ../ui-system/ghost-functional-verification.json. New56 binding, full-game balance and remaining strategic-path/content rules are separate tasks; do not imply a whole-game completion from this milestone.

2026-10-31 whole-game program active: implementations/completion-program.md. RULE-01 Comic verified:54focusedtests, ghost network1, visual14, menus18 and UI contracts10 pass. RULE-02 missing-hand behavior approved: server seeded fallback only for absent hands, retain submitted hands, normal resolution.


2026-10-31 RULE-02 checkpoint: approved missing-hand fallback + active Comic frame verified; see implementations/forced-rps-plan.md and ../ui-system/forced-rps-verification.json. Legacy target selector/closed history remains UX work. Whole-game catalog56/strategic paths/Collector/statistical awards remain open; this checkpoint does not supersede the status table.


2026-10-31 MERCHANT-EXPRESSION-01: S02/S04 confirmed three-frame behavior implemented and verified (shared helper/hook,20/20 focused,3width/24pose). See merchant-expression-rules.md and ../ui-system/merchant-expression-verification.json. Existing frame/cropping is preserved; further context rules and head-anchor art calibration are not claimed newly implemented. STRAT-01 structure proposal awaits a user decision; do not silently select a scoring architecture.


2026-10-31 ITEM-01 audit: new56-readiness.json verifies56 unique PNG paths/content hashes and catalog constraints against active compiled Comic (66 existing kinds,0 new IDs). Generated new56-pilot-proposal.html/JSON gives8 concrete experimental specs, awaiting user approval. No runtime item/effect/default changed. Main HTML links both data and proposal; see implementations/new56-integration-plan.md. Full active-Comic Atlas extraction remains a separate evidence gap; static root baseline does not prove active bindings.


2026-10-31 user approved exact pilot8 specs/experimental values; see new56-pilot-approval.json. Only STRAT-01 structure remains pending among those two questions. CTX-02 switches semantic extraction to active Comic modules/support/bot, preserving9f0a972 legacy evidence; continue actual pilot wiring next, not more approval for the same numbers.


2026-11-02 RULE-02 remaining UX verified: shared Comic target/history menu, fixed stock/duel/round pages, public-target privacy, phase-boundary cleanup. See ../ui-system/theft-desk-verification.json.78focused/174related/socket1,3width picker+duel,4boundaries,baseline14/menu18/native10 pass. Whole-game gaps remain; no engine or default change. ITEM pilot8 runtime checkpoint707da16 supersedes earlier pending-runtime notes.


2026-11-02 RULE-03: concrete proposal in proposals/collector-wishlist-v1.md. Builder review resolved purchase hooks/energy, trade-ban and escrow-closure gaps in the proposal; still awaiting user approval, A05 remains design-only. No new runtime rule. BAL-02 coverage audit verifies hashes of8 historical paired runs and pinned runtime; none proves all required native triggers. Most native tools are never exercised by those policies. See balance-reports/2026-11-02-pilot-coverage.md/JSON and scripts/pilot-coverage.mjs --check.29 lifecycle cases remain separate evidence. Next: public-view bounded effect scenarios, not premature numeric tuning.


2026-11-02 public pilot evidence:8effects/16complete command-driven runs/32strict replay checks pass with public actors and legalheld-versus-vault/unused counterfactuals. No directstateinjection or RNGhandoracle; starting500 is an explicit mechanismfixture, not40-credit balance. Source/compiled/audit hashes: ../validation/pilot-public-2026-11-02/public-effects.json; plan and human summary in implementations/pilot-public-scenarios-plan.md / balance-reports/2026-11-02-pilot-public.md. Supersedes only the exposure gap, not the old8audit scope or release balance.

User approved Collector experimental spec on2026-11-02. collector-wishlist-approval.json pins original5a44a7a proposalSHA; prior pending-approval notes are superseded. Implement directly via implementations/collector-wishlist-plan.md; no repeated approval for same rules. STRATstructure/remaining48/awards remain separately unresolved.

2026-11-02 Collector Task1: แกน private3+2/schedule/peek/pay/expiry/custody/journal พร้อมแบบ opt-in `collectorWishlistRules:1` เท่านั้น.21 Collector tests และ232 focused cases ผ่าน,2 socket เดิมผ่าน,24 audit เดิม replay ตรง,8 effect pairs รันใหม่ผ่าน. Protocol/bot/UI ยังรอ Tasks2/3; ไม่ใช่เกมครบหรือ default rollout. ดู [engine verification](collector-wishlist-engine-verification.json).

2026-11-02 Collector Task2: protocol/public bots/reconnect/idempotency/audit ผ่าน5checks +2socketเดิม +69related. ชุด2→4ซื้อจริงและstrict replayจบRESULTS; ยังopt-inและComicUI/default rolloutรอTask3. ดูcollector-wishlist-network-verification.json.

2026-11-02 Collector Task3: ใช้ComicMenu/ปุ่มกลาง,เลือก3/รอ2/ห้าช่องปกปิด/peek1/confirmจ่าย/ถอนเอง/หมดสิทธิ์และwarningครบ. main new rooms เปิดcollectorWishlistRules1; explicit no-flag auditsเดิมคงเดิม.25 UI,7 network,12 captures+10 mounted checks,14 baseline,18 menusผ่าน; finalreviewยังรอ. ไม่ใช่เกมครบ/remaining48/STRAT/awards/balance. ดูcollector-wishlist-verification.json และA05ในHTMLกลาง.

2026-11-02 Collector review completed (frozen10629f2..7ab2a39); Important public-offer contamination fixed via shared market/Spirit source filter with failure-first tests. 235 scoped regressions,7 actual network cases,24 historical+2 Collector replays,8 native effect pairs/16 runs/32 replays pass. Real App request/peek/confirmed purchase/owned item/RESULTS replay verified with500-credit/20-life fixture, not normal40/6 balance. UI-COLLECTOR-CONTEXT minor deferred: initial event hides request catalog entry until resolved. See collector-offer-isolation-verification.json and implementations/collector-wishlist-review.md. Whole-game goal remains active; remaining48, STRAT, awards and broader normal-budget balance remain open.

2026-11-02 normal main evidence: realApp40credit/6life/defaultclock request2/delivery4/peek1/confirmedbuy/owneditem/RESULTS6 strictreplay pass; public setup held spending beforedelivery. Matrix8 normal-config runs (2/4 seats,cautious/trader,catalog3/4,same deterministicseed) allRESULTS/replay, ends5–8.5Collectorpaid,8auctionwins andPvPtrades observed; no vault/interest/PvPloan/forcedRPS/ghost-service coverage. No balance/numeric change. See normal-play-verification.json and balance-reports/2026-11-02-normal-play.md. Whole goal active, remaining48/STRAT/awards pending.

2026-11-02 normal-resource command journey: exact main40credit/6life/deadline15 catalogue4pilot8, selectedseednormal-service-2,196commands/9checks. Deposit10/topup5/new-firstwithdraw/agedinterest1, real bought collateral loan funding+repayment, naturaldeath, public card tracking, realRPS/3slotloss/waitnextencounter,21credit delivery/bonus2/RESULTS7/strictreplay. Related44+network1 pass; network uses200/death/slotfixtures and is not combined normal live evidence. No runtime/UI change; see normal-service-verification.json. Whole goal remains active.

2026-11-02 user scoring direction supersedes pending best-path-only question: every player gets personal contributions across systems; sale quantity and gross sales credits are separate score components; merchant trust uses cumulative positive gains throughout game (not final trust). End summary reveals systems sequentially with colored growing bars. Timing remains simultaneous atCollector. Weights/caps/anti-farming and old leader bonus coexistence not yet approved; do not implement invented scoring or replace cumulative trust with peak/final values. See personal-scoring-direction.json and proposals/personal-system-scoring-v1.md.
