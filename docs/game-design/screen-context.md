# Context กลางของหน้าจอและ concept

เริ่มที่ [บอร์ดหน้าจอ](screen-flow.html) · [ทะเบียน JSON](screen-flow.json) · [กราฟระบบ](logic-item-relations.html)

## ทำให้ภาพกับ logic อ้างถึงสิ่งเดียวกัน

ใช้ screen ID เช่น S01 ในชื่อภาพ brief งานพัฒนา และกราฟ `screen:S01` อย่าใช้ชื่อไฟล์อย่างเดียวเพราะอาจมีหลายร่าง แต่ละหน้าระบุ phase, trigger, logic/action ที่เกี่ยวข้อง, source references (คำนวณ sourceSymbols เป็น sourceRefs ใน system-atlas/screens.json), variants และภาพปัจจุบัน/ภาพที่อนุมัติแยกกัน

- `runtime`: มี logic ที่รองรับ ไม่รับรองว่าหน้า comic ทำครบหรือ concept อนุมัติแล้ว
- `conditional-event`: ขึ้นเมื่อมี eventOffer ตาม state/config ไม่ใช่ทุก encounter
- `presentation-proposal`: เสนอวิธีนำเสนอผลที่เกมมีอยู่ ไม่สร้าง phase/action ใหม่
- `mixed`: มีบางส่วนใน runtime และบางส่วนยังเป็นแผน
- `design-only`: ยังเป็น spec เช่นบริการวิญญาณ/Wishlist ใหม่

`nextIds` เป็นผังเพื่อออกแบบ มีเงื่อนไขและทางข้าม ไม่ใช่คำสั่งบังคับให้ทุกเกมผ่านทุกหน้า

## ลำดับภาพที่จะทำ

1. S01 เหตุการณ์ก่อนเลือกประตู — เริ่มด้วย E117 ด่านเก็บค่าผ่าน
2. S02 เลือกประตูและพ่อค้า — ใช้หน้าเดิม ไม่สร้าง concept ใหม่
3. S03 เหตุการณ์หลังเลือกประตู — ใช้ shell event เดียวกันแต่เปลี่ยนเนื้อหา/choices
4. S04 ประเมินและซื้อ — ใช้ concept ที่มีเป็นฐานและเทียบ logic ปัจจุบัน
5. S05 เหตุการณ์ก่อนซื้อขาย, S06 ซื้อขาย
6. S07 สรุปก่อนรับเงิน, S08 เครดิตท้ายช่วง/เหรียญ, S09 บริการหลังรับเงิน
7. หน้ารอ ตาย Collector ผลเกม และ interaction ที่จำเป็น
8. โลกวิญญาณ G01–G04 หลังปิดกฎที่ยังค้าง

### เริ่มเดิน flow หลังสำรวจเกม — 2026-10-29

S01 ใช้ร่าง minimal v03, S02 ใช้ภาพเกมเดิม; เติม [S03/E109 v01](concepts/S03-E109-v01.md) เป็นภาพอ้างอิงเหตุการณ์หลังเลือกประตู ไม่เพิ่ม phase ใหม่และไม่แทนภาพจับเกม เป็น draft ยังไม่อนุมัติ แสดงชีวิต4→2ทันที และสุ่มผลเพียงหนึ่งอย่างเมื่อเลือกพบ Vampire อีกครั้ง หากจบรันก่อนพบอีกไม่ได้ผลตอบแทน รายละเอียดผลอยู่ใน tooltip ที่ต้องเปิดได้ด้วย keyboard/touch และจัดตำแหน่งให้อยู่ใน viewport เสมอ

ผู้ใช้แก้ S03 ให้ลดรูป เพิ่มการใช้พื้นที่และเข้า comic มากขึ้น: [v02](concepts/S03-E109-v02.md) เป็นร่างปัจจุบัน ใช้ภาพพ่อค้าประมาณหนึ่งในสาม เพิ่มพื้นที่ข้อมูลและลาย halftone/เส้นหมึก; v01 เก็บเป็นประวัติ ภาพร่างยังไม่ใช่ข้อยืนยันว่าระยะทุกพิกเซล/ขนาดปุ่มเท่ากันแล้ว ตอนพัฒนาต้องยึด spacing/component กลางตาม brief

ร่างปัจจุบัน S03 คือ [v03 symmetry pass](concepts/S03-E109-v03.md) ตามคำขอถัดมา: จัดคู่ข้อมูล/ปุ่มให้แนวตรงกัน ใช้ช่องไฟร่วม และย้าย tooltip ออกจากคำเตือนกับปุ่ม v02 เก็บเป็นประวัติ ยังไม่อนุมัติและยังไม่แก้ runtime

ผู้ใช้ย้ำรูปแบบพ่อค้าเดิมอีกครั้ง จึงใช้ [S03 v04](concepts/S03-E109-v04.md) เป็นร่างปัจจุบัน: ฐานรูปชิด/ตัดเสมอขอบล่าง ส่วนบนซ้ายขวาทับหรือทะลุกรอบได้ การ์ดพื้นหลังอยู่หลัง silhouette ไม่ขังรูปทั้งตัว รักษาขนาดที่ลดแล้วและไม่ทับข้อมูล/ปุ่ม v03 เก็บเป็นประวัติ ยังไม่อนุมัติ/ไม่ลง runtime

คำขอล่าสุดเอากรอบพื้นหลังพ่อค้าออกทั้งหมด ใช้ [S03 v05](concepts/S03-E109-v05.md) เป็นร่างปัจจุบันแทน v04: ไม่มีการ์ดแดง/เส้นขาวเฉพาะ portrait วาง cutout บนฉากตลาดตรงๆ ฐานชิดขอบล่างกรอบรวม ไม่ล้นล่าง ยังไม่อนุมัติ/ไม่ลง runtime

ผู้ใช้ให้เริ่มสร้างแล้ว: [implementation S03/E109](implementations/S03-E109.md) ลงใน comic build แยกตาม v05 ใช้ปุ่ม/tooltip/คำสั่ง event เดิม มีภาพจับ C26 และผลวัด symmetry แล้ว ภาพหลัก S03 ใช้ capture แทน concept; ภาพจับเป็น fixture ไม่ใช่ live encounter ร่าง v05 เป็น reference ที่ใช้พัฒนา ไม่อ้างว่า event ทุกแบบเสร็จแล้ว

ลำดับตรวจถัดไปคือ S04 และ S05 ซึ่งมีภาพจับแล้ว ให้เทียบกับ logic ก่อนเสนอการปรับเฉพาะส่วนที่ขาด ไม่ gen ภาพใหม่อัตโนมัติจากค่า planned ในทะเบียน

เมนู M01–M06 ใช้กรอบหลักเท่ากระเป๋า ไม่ออกแบบขนาด header/ปุ่ม/มุมมนใหม่ทุกหน้า หน้า Axx เป็น interaction ตามสิทธิ์ ไม่ยัดเข้าหน้าหลักพร้อมกันทั้งหมด

## Brief ที่ทุกภาพต้องมี

**Symmetry ทุกหน้าต่อจากนี้:** ใช้แนวขอบและ baseline ร่วมกัน ระยะขอบ/gap/padding ที่สม่ำเสมอจาก token กลาง กล่องหรือปุ่มคู่มีขนาดเท่ากันเมื่อทำหน้าที่คู่กัน จัดน้ำหนักภาพและข้อมูลให้สมดุล ตรวจทั้งภาพร่างและ UI จริงทุกขนาดที่รองรับ โดยไม่บังคับให้ข้อความทุกส่วนยาวเท่ากัน และไม่แลกความอ่านง่ายกับความสมมาตร

- Screen ID + variant + phase + สถานะจำลองที่ใช้
- สิ่งที่ผู้เล่นต้องตัดสินใจและ action หลัก/รอง พร้อมต้นทุนที่รู้ก่อนกด
- สิ่งที่มองเห็นได้ กับข้อมูลลับที่ห้ามเปิด
- state ปกติ/กดไม่ได้/กำลังดำเนินการ/เสร็จ/รอ พร้อมเหตุผล
- header/content/footer ใช้ component กลางและ spacing เดียวกัน; 100vh ไม่มี page scroll ในภาพอ้างอิง
- Comic2D เส้นเข้ม โทน UI แดงดำขาว มุมมนเท่ากัน; artwork ใช้ palette ของตัวเอง ภาพทะลุกรอบได้แต่ฐานตัวละครไม่เลยกรอบล่าง
- ความสมมาตรเป็นการจัดแนว/ช่องไฟ/น้ำหนัก ไม่บังคับเนื้อหาฝั่งซ้ายขวาเท่ากันทุกบรรทัด
- ระบุว่าเป็นภาพร่างหรืออนุมัติแล้ว ห้ามให้ระบบถือภาพร่างเป็นกติกาใหม่

## S01 / E117 — ภาพแรก

PORTALS เมื่อมี E117 ค้าง ก่อนเลือกประตู ใช้ core2 ตาม server profile: จ่ายเครดิต2+พลัง1จะปิดประตู2 (ประตู1และ3ยังเปิด); รับ D02 หรือ D06 จะปิดประตู1 (ประตู2และ3ยังเปิด) แสดงสามตัวเลือกและต้นทุน/สถานะก่อนกด ไม่แสดงข้อมูลพ่อค้า/สินค้าลับหรือคะแนนรวมซ้ำใน HUD

ไม่มี event ไม่ต้องเพิ่มหน้าบังคับหยุดเกมเพียงเพื่อให้เหมือนภาพ หากต้องการ encounter intro แยก ควรเป็น transition ที่ไม่เพิ่มภาระกดพร้อมโดยไม่มีเหตุผล

## สถานะภาพและชื่อไฟล์

เก็บใน `concepts/<screen-ID>-<variant>-vNN.png` พร้อม brief หรือ generation prompt

`planned` → `draft` → `approved` → `implemented` เป็นสถานะอ้างอิง ห้ามขยับ approved โดยไม่ได้รับการยืนยัน เก็บร่างเก่าไว้ และกรอก `currentImage`, `approvedImage` ให้เป็น path สัมพัทธ์จาก docs/game-design

การแก้ชื่อหน้าหรือเส้นทางแก้ที่ screen-flow.json แล้วรัน build-system-atlas.mjs และ check-system-atlas.mjs ไม่แก้ HTML ที่สร้างแล้วด้วยมือ

หมายเหตุ: E01 ประตูคลาดมิติเป็นตัวอย่าง legacy ซึ่ง core2 ปิดไว้ จึงไม่ใช้เป็นภาพแรกของ profile ปัจจุบัน


## กฎข้อมูลก่อนตัดสินใจ — ผู้ใช้ย้ำ 2026-10-29

ทุกตัวเลือกต้องแสดงบริบทที่จำเป็นให้ตัดสินใจอย่างมีเหตุผล ก่อนให้กด เช่น event ปิดประตูต้องเห็นประตูและชื่อ/ภาพพ่อค้าประจำประตูครบ หมายเลขและ ID ต้องตรงกับ state จริง พร้อมบอกว่าทางเลือกนั้นปิดประตูไหน เหลือประตูไหน ไม่ใช้ภาพประกอบประตูไร้ชื่อแทนข้อมูลตัดสินใจ และไม่เปิดข้อมูลสินค้า/ราคา/ความแท้/คำสาปที่ผู้เล่นยังไม่รู้

ใช้หลักเดียวกันกับเสียสินค้า (เห็นชิ้นที่จะเสีย), จ่ายเงิน/ชีวิต/พลัง (เห็นยอดและต้นทุน), สัญญา (เห็นคู่สัญญา/สิ่งส่งมอบ/ค่าตอบแทน) และผลก่อนรับเงิน (เห็นเหตุผลของยอดเปลี่ยน) ตรวจจาก state และ action guards ไม่ตีความจากคำบรรยายสั้นอย่างเดียว

แก้ S01: generatePortals สร้าง3ประตู; resolveCore2Event ปิดเพียงประตู index1 หรือ0 ตาม choice ไม่ได้ปิดทุกประตูที่เหลือ ร่างv01แสดงไม่ครบ จึงต้องมีv02และเก็บv01เป็นประวัติที่ไม่ควรใช้พัฒนา


## การปรับที่ผู้ใช้เลือก: minimal + ดูประตู + preview — 2026-10-29

ผู้ใช้ชอบความเรียบของ S01v01 มากกว่า v02 จึงเก็บ artwork/สามตัวเลือกของรูปแรก และเพิ่ม “ดูประตู · 3” เพื่อซ่อนเนื้อหาเหตุการณ์ชั่วคราวแล้วดูหมายเลข/พ่อค้า/สถานะของทั้ง3ประตู ปุ่มกลับต้องกลับเหตุการณ์เดิม ใช้หน้า/คอมโพเนนต์ S02 เดิมโดยปิด action เข้าประตูระหว่าง event ค้าง ไม่ทำหน้าประตูใหม่และไม่ให้ข้าม event และไม่ส่งคำตอบ/รีเซ็ตเวลา

Hover หรือ keyboard focus ตัวเลือกแสดง tooltip และ highlight ว่าต้องจ่ายอะไร ได้รับสถานะใด ปิดประตูไหนกับพ่อค้าใด และยังเปิดทางไหน ข้อมูลเป็น preview ไม่เปลี่ยนทรัพยากรจริง ไม่ควรบังตัวเลือกข้างเคียง บนจอสัมผัสใช้ปุ่มข้อมูลแยกเพื่อเปิดดูผลโดยไม่เผลอเลือก action

ไม่จำเป็นต้องแสดงทุกข้อมูลพร้อมกันตลอด แต่ต้องเข้าถึงข้อมูลสำคัญได้ก่อนยืนยัน นี่แทนที่การวางกริดประตูถาวรใน v02 ยังไม่ใช่การอนุมัติภาพ v03 หรือ runtime implementation


## ห้ามทำงานซ้ำ — ผู้ใช้ย้ำ 2026-10-29

ก่อนสร้างภาพหรือแก้หน้าใด ต้องตรวจ implementation และภาพที่มีอยู่ก่อน ใช้ของเดิมและทำเฉพาะ gap/ส่วนที่ผู้ใช้ขอแก้ S02 มีอยู่แล้วจึงเป็น reuse-existing ไม่ต้องทำภาพเลือกประตูหรือหน้าดูประตูใหม่ แผน28หน้าคือทะเบียนอ้างอิง ไม่ใช่คำสั่งสร้างภาพ28ใบ ค่า planned ไม่อนุญาตให้ gen ซ้ำเอง

## Shared comic frame — confirmed user rule

Use inventory as the outer-frame reference for every comic destination/menu, including phase screens such as S06. Width, maximum width, top/bottom/side insets, border width and corner radius come from comic-frame.css / --comic-frame-* tokens. Do not assign a new per-screen frame size. Keep content layouts inside that frame. Before completion compare actual x/y/width/height against inventory at the same viewport; check at least narrow desktop and wide desktop. Preserve HUD, preview selector and bottom dock.

2026-10-29 S06/item-sale v01: ผู้ใช้ขอconceptหน้ารายละเอียด/ประกาศขายจากscreenshot21.21.31. สร้างภาพและbriefใน concepts/S06-item-sale-v01.* ลงทะเบียนvariantdraftแยกจากtabletop/ภาพจับปัจจุบัน ไม่ใช่หน้าใหม่ ไม่อนุมัติและไม่แก้runtime. แสดงstateNPC52เครดิตยังไม่ประเมิน/knowledge? ประกาศขายปิด โชว์ยังได้.

S06/item-sale v02: ผู้ใช้ขอcomicขึ้น ทำภาพeditจากv01ให้UIเป็นcaption/หมึก/halftone ไม่ใช่เพียงภาพสินค้า. ลงทะเบียนdraftแยก ไม่มีruntimeเปลี่ยนและยังไม่อนุมัติ. ดูconcepts/S06-item-sale-v02.md

2026-10-29 S06/item-sale v02 implemented in isolated comic build. ItemSalePanel + Share comic presentation retain same handlers/eligibility; caption/paper choice controls and knownfacts3cells. 1024×800 columns486/486;1920×800 738/738;1440×722 694/694; zero panel overflow and frame matches inventory. Browser public-fixture tests confirmed share claims genuine/cursed+rebate3, over-budget disabled, owned sale/show omit claims, withdraw allowfalse. Menu overlap found and fixed with utilityOpen pause; only one dialog remains when utilities open. Build114modules passed. C28 actual fixture capture, not AI/live multiplayer; portable code and fixture under implementations/S06-sale-source and docs/validation/s06-item-sale.

2026-10-29 S06 style correction: ผู้ใช้ย้ำเกมเดียวกันต้องอ้างอิงUIที่มี ไม่สร้างstyleใหม่ต่อหน้า. ยกเลิกbrushcaption/whitechoice/paperfactsและdividerกลาง/ที่มา/rebate/footer; ใช้ComicMenu header65px/line1pxและComicButtonดำแดงเดิม. คอลัมน์1024=486/486,1920=738/738,1440=694/694. แถวchoice/rebateleftตรงกัน590/1066/826ตามviewport; stepper40pxเท่ากันและpaneloverflow0. ไม่เปลี่ยนShare logic. C28จับใหม่จริงตามstyleนี้.

2026-10-30 S08 concept-only follow-up: user explicitly requested redesign of the existing end-of-encounter reward/coin screen. Added concepts/S08-salary-v01.png and brief/prompt with shared menu frame, equal columns and a modest comic coin. Draft/unapproved; C21 remains historical runtime evidence, approved UI baselines and game code unchanged. Fixture: encounter3, one multi-enabled coin, pending10, correct+5/wrong−5 floor0; add-coin cost10 from wallet (even encounter base15), not5. Follow-up implementation requires user approval and multi-coin/tossing/settled validation. Image-generation authorization is specific to S08, not a blanket resume of all concepts.

2026-10-30 S08 implemented after explicit user approval: shared ComicPhaseFrame/inventory geometry/header and ComicButton, equal pending cash-out/coin columns/actions, compact2-coin pages retaining all predictions. REVEAL keeps six utility menus, with new bag/status access read-only; pending duplicate ready/result panel removed, existing S09 follows payout. Game rules and legacy app untouched. New actual fixture captures C29/C30 replace draft as current view, concept remains design reference; no new pixel-baseline approval. Build/focused83/contract10 results and exact browser evidence in implementations/S08-reward.md and docs/ui-system/s08-* reports. Known broader i18n4 failures reproduced before change, not waived.

2026-10-30 S09 implemented after user authorized concept + implementation together. Reuses inventory ComicPhaseFrame, common header/buttons and equal columns; paged custody shelves, centered equal44px money controls and one ready action. C31–C33 record normal/full/empty actual fixtures, not live payment or separately approved pixel baselines. Final zero-result toss remains mounted until animation ends. Comic4% and root aged10% remain separate runtimes; no engine rules changed. Verification: focused104/104, UI contracts10/10, original sealed baselines14/14, peer menus18/18 and S09 browser9/9 at1024/1440/1920; synthetic incoming-DTO animation passes. See implementations/S09-vault.md and docs/ui-system/s09-* reports. Known broad i18n4 failures remain; no full simulation/live multiplayer/phone/balance claim.

2026-10-30 S10 waiting concept v01: draft for the existing ready state after S09, illustrative four players. It is not a new game phase or implementation. Derive ready/spectator from actual room state; show time-out wording only if room timer is enabled. Use shared frame and utility dock, no invented actions. Image has not been separately approved.

2026-10-30 S11 death v01 is an unapproved concept, not runtime. Illustration has incorrect life 4/6 and lacks inventory shared frame; correct these and balance composition before implementation. Spectating exists; spirit services remain design-only. Do not assume the illustrated button exists.

2026-10-30 S11 v02 draft: entry to four-card tracking minigame and spirit market. Win before receiving service jobs; repeat minigame after all jobs completed. Wrong guess retries; each Skeleton offer slot tracks its own RPS loss; only contracted goods may be purchased. Pay on successful delivery; 10% of base is deducted from item price; ghost income is special score with conversion unresolved. Concept image is illustrative, not approval or runtime. Exact shared inventory frame required when implemented.

2026-10-30 ghost integration active: actual six actions and GhostWorld wired, not just helper. Core7/7, focused31/31, real two-socket1/1, UI contracts10/10 and peer menus18/18 pass. Browser actual minigame unlock verified; C34 is separate component fixture. Visual gate13/14 (status wide drift1.268%); do not rebaseline or complete goal. Buyer-death cancellation/reunlock approved and implemented; latest build/network/UI reruns still needed after final edits. Exact handoff: implementations/ghost-delivery-progress.md.

### S11/G01–G04 runtime handoff (2026-10-30)

One GhostWorld composite uses inventory-frame geometry and existing controls. Tracking, pending offers, active RPS search, three-lost and insufficient-funds states are registered with actual captures C34–C38. No page scrolling; one job/provider per shared pager. Backend workflow evidence is separate from preview images. See implementations/ghost-delivery-progress.md and ../ui-system/ghost-functional-verification.json. Historical concepts remain drafts rather than automatically approved baselines.


2026-11-02 A02 targets/history now use bounded shared ComicMenu from the HUD handshake, not permanent expanding theft-table. Actual public DTO fixture captures and source hashes: ../ui-system/theft-desk-verification.json. Active duel/utility navigation unchanged; no new phase/dock entry or human baseline approval.
