# เกมปัจจุบัน — ภาพจับจริงและบัญชีหน้าจอ

อ้างอิงหลัก: [HTML กลาง](logic-item-relations.html) แท็บ **ภาพเกมปัจจุบัน** · ข้อมูลจับภาพ: [current-captures.json](current-captures.json)

## ขอบเขตที่ตรวจพบ

- 63 ภาพ ครอบคลุม 22 กลุ่มหน้าจอ/เมนู/เหตุการณ์
- 15 ภาพมาจากห้องเกมที่รันจริง; 48 ภาพใช้ public preview fixture; ไม่ใช่หลักฐานจ่ายเงินจริงทุกภาพ
- ทะเบียน30รายการรวมหน้าที่ยังเป็นแผน จึงไม่ใช่30หน้าที่ทำแล้ว และภาพหลายแท็บของหน้าเดียวไม่นับเป็นหน้าใหม่
- ชุดแรก25ภาพไม่ได้แก้ UI/logic เกม; C26 เพิ่มหลังลง UI E109 ตาม concept v05 เป็นภาพจับ component จริงด้วย fixture ไม่ใช่ภาพ AI ไม่ได้แก้กฎเกม

## ทะเบียนที่เชื่อมแล้ว

| ID | หน้า/สถานะ | ภาพจับ | สถานะ logic | ภาพหลัก |
|---|---|---|---|---|
| U02 | ล็อบบี้และตั้งค่าโต๊ะ | 1 | runtime | [ดูภาพ](captures/current-comic-2026-10-29/lobby.png) |
| U01 | เข้าเกมและสร้าง/เข้าห้อง | 1 | runtime | [ดูภาพ](captures/current-comic-2026-10-29/entry.png) |
| S01 | เหตุการณ์ก่อนเลือกประตู | 0 | runtime | ยังไม่จับ ไม่ใช่ข้อสรุปว่าไม่มี |
| S02 | เลือกประตูและพ่อค้า | 1 | runtime | [ดูภาพ](captures/current-comic-2026-10-29/merchants.png) |
| S03 | เหตุการณ์หลังเลือกประตู · E109 | 1 | runtime; ลง comic variant E109 แล้ว | [ดูภาพ](captures/current-comic-2026-10-29/event-blood-pact.png) |
| S04 | ประเมินและซื้อสินค้า | 5 | runtime | [ดูภาพ](captures/current-comic-2026-10-29/inspection.png) |
| S05 | เหตุการณ์ก่อนซื้อขายระหว่างผู้เล่น | 1 | runtime | [ดูภาพ](captures/current-comic-2026-10-29/live-current-event.png) |
| S06 | ซื้อขายระหว่างผู้เล่น | 3 | runtime; tabletop C27 | [ดูภาพ](captures/current-comic-2026-10-29/trade-table.png) |
| S07 | สรุปผลก่อนรับเงินท้ายช่วง | 0 | presentation-proposal | ยังไม่จับ ไม่ใช่ข้อสรุปว่าไม่มี |
| S08 | รับเครดิตท้ายช่วงและเสี่ยงเหรียญ | 4 | runtime; comic implementation C29/C30 | [ดูภาพปัจจุบัน](captures/s08-2026-10-30/reveal-1440x722.png) |
| S09 | บริการหลังรับเงินและพร้อมไปช่วงหน้า | 3 | runtime; comic implementation C31–C33 | [ดูภาพปัจจุบัน](captures/s09-2026-10-30/reward-settled-1440x722.png) |
| S10 | รอผู้เล่นอื่น | 0 | runtime | ยังไม่จับ ไม่ใช่ข้อสรุปว่าไม่มี |
| S11 | เสียชีวิตและทางเข้าโลกวิญญาณ | 1 | runtime | [ดูภาพ](captures/ghost-2026-10-30/ghost-1440x722.png) |
| S12 | Collector มาถึง | 0 | mixed | ยังไม่จับ ไม่ใช่ข้อสรุปว่าไม่มี |
| S13 | ผลเกมและอันดับ | 11 | runtime Comic personal-scoring v1; candidate C64–C72 | [ดูภาพ](../validation/personal-score-ui-2026-11-03/score-2-1440.png) |
| M01 | กระเป๋า | 2 | runtime | [ดูภาพ](captures/current-comic-2026-10-29/inventory.png) |
| M02 | สถานะและเส้นทางกลยุทธ์ | 1 | mixed | [ดูภาพ](captures/current-comic-2026-10-29/status.png) |
| M03 | ตลาดมืดและประมูล | 5 | runtime | [ดูภาพ](captures/current-comic-2026-10-29/market.png) |
| M04 | บันทึกเหตุการณ์ | 1 | runtime | [ดูภาพ](captures/current-comic-2026-10-29/ledger.png) |
| M05 | กติกา | 1 | runtime | [ดูภาพ](captures/current-comic-2026-10-29/rules.png) |
| M06 | ตั้งค่า | 1 | runtime | [ดูภาพ](captures/current-comic-2026-10-29/settings.png) |
| A01 | ข้อเสนอเงินกู้และหลักประกัน | 0 | runtime | ยังไม่จับ ไม่ใช่ข้อสรุปว่าไม่มี |
| A02 | ขโมยและเป่ายิ้งฉุบ | 0 | mixed | ยังไม่จับ ไม่ใช่ข้อสรุปว่าไม่มี |
| A03 | ตราบาปและแลกคืน | 0 | runtime | ยังไม่จับ ไม่ใช่ข้อสรุปว่าไม่มี |
| A04 | ของขายไม่ออก | 0 | runtime | ยังไม่จับ ไม่ใช่ข้อสรุปว่าไม่มี |
| A05 | Collector Wishlist | 20 | runtime | ขอ3/รอ2/เปิด1/จ่ายจริง; main rooms v1; candidate captures |
| G01 | วิญญาณติดตามการ์ด | 1 | runtime (shared composite state) | [ดูภาพ](captures/ghost-2026-10-30/ghost-1440x722.png) |
| G02 | เรียกบริการและตกลงสัญญาวิญญาณ | 1 | runtime (shared composite state) | [ดูภาพ](captures/ghost-2026-10-30/ghost-busy-1440x722.png) |
| G03 | ร้าน Skeleton และ RPS แยกสามช่อง | 1 | runtime (shared composite state) | [ดูภาพ](captures/ghost-2026-10-30/ghost-lost-1440x722.png) |
| G04 | ส่งมอบและคะแนนพิเศษวิญญาณ | 2 | runtime (shared composite state) | [ดูภาพ](captures/ghost-2026-10-30/ghost-working-1440x722.png) |

## Style ที่มีอยู่จริง

- ฟอนต์ที่วัดได้: Noto Sans Thai
- พื้นหลัง panel ใกล้ดำ ตัวหนังสือขาว/ครีม เส้นกรอบอ่อน primary สีแดงเข้ม
- ตัวอย่าง primary: rgb(197,16,50), secondary: rgb(12,16,17), มุมปุ่ม10px
- ตัวอย่างปุ่มรายละเอียดตลาดสูง44px บางปุ่มไอคอน48px ไม่สรุปว่าทุกปุ่มเท่ากัน
- HUDเต็มความกว้าง เมนูล่าง6ช่อง กรอบเมนูร่วมกัน ประเมิน2คอลัมน์ พ่อค้า3การ์ด ตลาดมี navigation ฝั่งซ้าย
- Artwork comic/manhua เส้นเข้ม ภาพพ่อค้าและของแยกชั้นจากกรอบ UI
- ภาพพื้นฐาน12ภาพตรวจที่viewport1440×722 ไม่พบpageoverflow ไม่ใช่การรับรองทุกขนาดจอ
- ค่าที่วัดและปุ่มอยู่ใน captures/current-comic-2026-10-29/style-observations.json

## Source และข้อจำกัด

Comic build ที่จับภาพอยู่แยกจาก canonical repository ตาม path/hash ใน current-captures.json Backend ของห้องสำรวจใช้ dist ปัจจุบันใน repository นี้ จึงต้องแยกหลักฐาน UI กับหลักฐาน logic ไม่ถือว่า UIแยกbuildรองรับกฎใหม่ทั้งหมดแล้ว

Preview reveal เดิมไม่มี roundReward จึงเห็นเฉพาะสรุปท้ายช่วง ภาพ live-salary จับจากเกมจริงและมีตัวเลือกรับเงิน/หัวก้อย ภาพ market-demo และ ledger ใช้รายการที่ ComicPreview ใส่มาเพื่อแสดงหน้าจอ ไม่ใช่ผลธุรกรรมจริง

ภาพของใน preview ยังเป็นข้อมูลตัวอย่าง ไม่ยืนยันการผูกสินค้าใหม่56ชิ้น ส่วนหน้าที่ยังไม่จับ เช่นเหตุการณ์ก่อนประตูหรือเงินกู้ ให้ตรวจ source/เล่นเข้าสู่stateก่อน ห้ามใช้ช่องว่างในทะเบียนเป็นเหตุสร้างconceptซ้ำ

## วิธีใช้ก่อนพัฒนาต่อ

1. เปิดHTMLหลัก ดูภาพจับของscreenIDและสถานะย่อยก่อน
2. กดดูเส้นเชื่อมเพื่อหา phase/event/action/source ที่เกี่ยวข้อง
3. ดูกฎยืนยันและpending spec แยกจากสภาพUIปัจจุบัน
4. ถ้าจะแก้ภาพหรือหน้า ต้องระบุgapจากภาพจับและสิ่งที่ผู้ใช้ขอ ห้ามเริ่มจากออกแบบใหม่ทั้งหน้า
5. หยุดgenตามคำสั่งผู้ใช้จนกว่าจะขอให้เริ่มใหม่

## ช่องว่างที่สังเกตได้จากภาพจับ

ภาพ market-auction-detail ใน preview เห็นพื้นหลังแต่ไม่เห็นภาพสินค้า เป็นข้อสังเกตของภาพนี้ ต้องตรวจข้อมูล fixture/asset binding ก่อนตัดสินว่าขาด artwork หรือคอมโพเนนต์ ห้ามสร้างภาพใหม่เพื่อกลบปัญหาจากข้อมูล

C28 เพิ่มรายละเอียด/ประกาศขาย comic v02 เป็น substate S06 ไม่นับหน้าใหม่ ดู captures/current-comic-2026-10-29/trade-item-sale.png

2026-10-30 C29/C30 เพิ่มภาพ S08 หลังลง concept ที่อนุมัติ เป็นสอง substate ของหน้าเดิม ไม่ใช่สองหน้าใหม่ ไม่ใช่ AI หรือธุรกรรมเกมหลายคน ดู implementations/S08-reward.md

S11/G01 share the same tracking view. G02–G04 are substates of GhostWorld, not newly duplicated full-screen shells. Counts refer to captured registry groups.

2026-11-02 A05: Collector reused ComicMenu/controls,12 captures at1024/1440/1920 with source hashes; no images generated or old screens recreated. Runtime audit/payment and UI fixture evidence are separate.

Post-review: C54–C58 are real App paid-flow captures at declared500-credit/20-life fixture config; C58 owned bag belongsM01. Hidden source pool isolation fixed; minor initial-event request-catalog access remains tracked.

2026-11-02 normal main: C59–C63 แยกจาก500-credit fixture;40เครดิต/6ชีวิต request2→delivery4→buy→RESULTS6/replay ผ่าน5checks. ดูnormal-play-verification.json; ไม่รับรองbalance.

2026-11-03 personal scoring UI: exact approved1551908 experiment now enabled for actual Comic main new rooms after48focused domain/runtime/eligibility/SSR/socket/main-entry checks,13new screen checks at1024/1440/1920,18peer menus and14sealed pixel comparisons. S13 uses shared inventory ComicPhaseFrame/ComicButton/Tooltip,9local playback stages and paged14metric details. Live Status consumes server known-only range; hidden appraisal receipts stay unresolved untilend, final score frozen. Six end menus readonly; legacy/no-flag fallback retained. C64–C72 are candidates, not promoted baselines. See implementations/personal-scoring-ui.md and docs/validation/personal-score-ui-2026-11-03. Independent final review,48remaining catalog effects/numbers, normal fullgame browser reconnect/ghosttracking scroll and multi-seed balance still outstanding; whole-game goal active.

2026-11-03 independent scoring review4e3fe94: notready;6Important+4Minor. Owner fix pass reproduces12runtime failures then passes12/12 and60total non-network scoring/SSR cases; actual paid E44/bond/liquidation/consignment, exactNPC/sealHP, personallylearnedfacet deltas, configguards and private nestedIDs corrected. Rank/tied-rank/modifierreason/negativefixture and currentrules wording corrected. Server/client builds and8nativepairs16no-flag games32replays pass; normal196command current audit replay passes. Fresh Browser/socket/commit still pending because automatic approval review could not run (usage limit, not a safety decision). Prior captures C64–C72 and14pixel receipts remain historical, not fresh proof of changed labels. Pre-review scoring1 experimental audits may need their pinned old source; originals preserved, no-flag bytes unchanged. See personal-scoring-final-fixes verification and final-review handoff; whole-game goal active.


## Personal scoring final owner-fix checkpoint — 2026-11-03

2026-11-03 final owner-fix verification: 67/67 scoring tests (63 domain/runtime/SSR and4 actual socket/main-entry cases), server/client builds,16 score geometry/interactions with12 captures,4 browser review assertions,18 menu flows and14 unchanged approved pixel references pass. New personalScoringFacts:2 selects corrected canonical writers; rules/weights remain approved1551908. Five unique historical scoring1/no-marker audits replay exactly, and16 no-personal native audit bytes remain identical (8pairs/32strict replays). Normal40/6/deadline15 engine journey196commands reachesRESULTS7 withghostbonus2 and strictly replays. Independent6Important+4Minor findings addressed in one owner fix pass; no second review. Earlier usage-limit block resolved after reset; no bypass. Whole-game goal remains active: remaining48 specs/runtime bindings, normal combined browser/reconnect/ghosttracking overflow and multi-seed balance are not complete. Evidence: `docs/validation/personal-scoring-final-fixes-2026-11-03/verification.json`; candidate captures C73–C84. This latest checkpoint supersedes earlier pending compatibility/Browser notes above.


## Normal service / Spirit access — 2026-11-03

2026-11-03 normal two-App service route now reaches RESULTS with196commands and strict replay: real40credits/6life/defaultclocks/pilot8, natural death, early shuffle rejection without page shift, browser reload preserving round/server startedAt, actual Status→Spirit hire/accept/RPS3losses/next-encounter/delivery (debit21once, bonus2, living phase unchanged). User approved existing Spirit entry in Status header beside Close; shared button height/gaps, no new dock or clock reset.37focused tests,3feedback widths,3preview watch/reentry widths,UI404/contracts10,18menus/14unchanged approvedpixels pass. Final harness field assertion was corrected from amount to paid; same ended run separately validated, original failure retained. This closes the observed normal-service feedback/entry blockers, not every game flow or release balance. Evidence: `docs/validation/normal-service-feedback-2026-11-03/verification.json`. Supersedes earlier ghost-tracking root-scroll and inaccessible-entry checkpoint; remaining48specs/bindings and multi-seed/full-game acceptance remain.
