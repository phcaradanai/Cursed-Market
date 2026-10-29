# S06 trade implementation

## Fidelity correction หลังผู้ใช้เทียบกับ concept

เปลี่ยนพื้น display-cloth เป็น [ฉากโต๊ะ comic](../assets/S06-table-background-v1.png) ที่สร้างด้วย built-in imagegen จาก concept v05 โดยเอา UI/สินค้าออก เหลือไม้ ผ้าแดงและฉากตลาด; runtime ยังวางรูป/ชื่อ/ราคาจริงแยกและกดได้ Prompt: preserve inked comic wooden table/red patterned cloth perspective; remove all UI/text/avatars/four sale items; empty center; retain perimeter props. ติดตั้งที่ public/art/comic/trade-table-v1.png ใน comic build เท่านั้น

แก้ grid สองแถวเก่าที่ทำให้โต๊ะเหลือครึ่งจอเป็นแถวเดียวเต็มพื้นที่ ย้ายจบซื้อขายเข้าโต๊ะล่างขวา คำอธิบายจบช่วงดูเมื่อ hover/focus ปุ่ม; คงข้อความเตือนของค้างย่อไว้เหนือปุ่ม ขยายของบน baseline เดียว ใช้ silhouette ผู้เล่นแทนอักษรแรก ไม่ใช้ภาพพ่อค้าแทนผู้เล่น

ตรวจจริง: 1440×722 page1440×722, table560==scroll560; 1024×768 page1024×768, table606==scroll606. วน4→2→4, โต๊ะเพื่อนว่าง/ซ่อน rail/กลับ, เปิดปิดรายละเอียดผ่าน Build appraisal ผ่าน. ภาพร้าน fixture มี2ชิ้นตามข้อมูลจึงต่างจำนวนจาก concept4ชิ้น ไม่เพิ่มข้อมูลปลอม ยังไม่ตรวจ multiplayer transaction หรือฟอร์มยาวทุกกรณี

## Table v05 ที่ใช้ปัจจุบัน

แทน split panels ด้วยโต๊ะเดียว วางสูงสุด4ชิ้น (จอแคบ3) ปุ่มกระเป๋าลงคลังตัวเอง ปุ่มบนกลับร้านที่ประเมิน; paging วนเมื่อมีหลายหน้า rail ซ้ายแสดงผู้เล่นอื่นเฉพาะโต๊ะเรา โต๊ะเพื่อนอ่านจาก listings ที่มองเห็นเท่านั้น ไม่อ่านคลังส่วนตัว pagingซ้ายและกลับโต๊ะเราทางขวา กลับที่หน้าแรกของร้านเรา

กดสินค้าเปิด ComicMenu ใช้ FactSeals/Share/TradeListing เดิมและปุ่มข้อเสนอเปิด Trades ไม่เปลี่ยนกติกาเงินจริง เคารพ reduced motion และไม่รีเซ็ตเวลา [ภาพ implementation](S06-table-implemented.png) · [patch](S06-table.patch)

ตรวจ preview: คลัง6ชิ้นวน4→2→4และลำดับคืนเดิม, โต๊ะเพื่อนไม่มีสินค้าที่เปิดแสดงสถานะว่างและซ่อน rail, กลับโต๊ะเรา/เปิดปิดรายละเอียดผ่าน หน้าและโต๊ะไม่มี overflow ที่1440×722 Buildผ่าน ยังไม่ได้ทดสอบธุรกรรมหลายผู้เล่นจริง/จอทุกขนาด และรายละเอียดใช้คอมโพเนนต์เดิม ยังต้องตรวจกรณีตัวเลือกยาวก่อนรับรอง no-scroll ทุกหน้าต่าง

เนื้อหาด้านล่างเป็นประวัติ split layout ก่อนผู้ใช้เปลี่ยน concept

Comic build แยกใช้ TradeScreen, ComicButton และ FactSeals/Share/Trades เดิม รายการซ้ายเลือกเปลี่ยนรายละเอียดขวาได้ ใช้ grid สองคอลัมน์เท่ากัน

ผู้ใช้แก้ล่าสุดให้ลบรูปซ้ำขวา: เหลือภาพเฉพาะรายการซ้าย ฝั่งขวาใช้ข้อมูลและปุ่มเต็มพื้นที่ ตรวจ browser พบ leftImages2/rightImages0 และเลือกสินค้ารายการสองแล้วชื่อเปลี่ยนเป็นยาชำระล้างได้

ยังใช้ logic ส่งคำสั่งเดิม ยังไม่ได้ทดสอบซื้อขายข้ามผู้เล่นในห้องจริงรอบนี้

Symmetry pass: กรอบคู่632.8047pxเท่ากัน header48pxเท่ากัน ปุ่มคู่ประมาณ288.4×48px; จัด status/actions/options บนแนวร่วม เอาเส้นปะออก ข้อเสนอระหว่างผู้เล่นเปิดผ่าน ComicMenu กลางเพื่อไม่ให้เนื้อหาถูกตัดใน panel

User redline correction: equal outer panels insufficient. Shared row tracks now enforce first stock/facts y146..324 (178px), second stock/action area y340..518 (178px), padding20px each side. Browser assertions passed plus select and offers open/close. No live multiplayer transaction verification.

Sale-options revision: Share accepts optional optionsHost/onOptionsChange so existing claims/rebate handlers render through portal into left slot2. On open selected item occupies slot1; close restores full list. Three pages authenticity/curse/rebate avoid scrolling. Browser checked all3 clientHeight176==scrollHeight176, right bottom unchanged540, second-item selection moved to slot1 and restored2items after close. Existing Share callers retain inline details by default.

2026-10-29 tooltip pass: ComicTooltip กลางแสดงคำอธิบายปุ่มกระเป๋า/กลับร้าน/วนสินค้า/โต๊ะเพื่อน/กลับโต๊ะเรา และข้อมูลย่อสินค้าจาก appraisal กับ knowledge เท่านั้น ไม่อ่านข้อมูลลับ. Portal clamp ภายใน viewport, เปิด hover/focus และปิด Escape. ข้อความโต๊ะว่างจัดกึ่งกลางทั้งสองแกนของพื้นที่รายการ. Build109modulesผ่าน.

2026-10-29 S06 tooltip fix: ลบป้ายกระเป๋าข้างปุ่มและคำสั่งย่อซ้ำใต้สินค้า (เก็บชื่อ/ราคา). ComicTooltip เปิด focus เฉพาะ :focus-visible, ปิดเมื่อ click/pointerdown/blur/scroll เพื่อไม่ค้างจาก navigation. Browserผ่าน hover→leave ปิด, คลิกกระเป๋า/วนหน้าปิด, keyboard Shift+Tab เปิด, Escapeปิด; build109modulesผ่าน. ภาพ implements: implementations/S06-tooltip-fix.png.

2026-10-29 S06 quiet overlays: ใช้ NavigationIcon/TableReturnIcon/PlayerOutlineIcon จาก icons กลางแทน glyph และ silhouette เดิม กระเป๋ามีลูกศรลง SVG; comic-overlay.css เป็น style กลาง opacity .42→1 เมื่อ hover/focus-visible, touch .75, reduced motion ไม่มี transition. Browserวัด idle.42/hover1, tooltipทำงาน, เปลี่ยนหน้าคลังเหลือ2ชิ้นและกลับผ่าน ไม่มี scroll1440×722. Build110modulesผ่าน. ภาพ implementations/S06-overlay-idle.png และ S06-overlay-hover.png.

2026-10-29 S06 shared frame correction: ผู้ใช้ย้ำใช้กรอบกระเป๋าเป็นมาตรฐานทุกเมนู. เพิ่ม comic-frame.css เป็นกฎร่วมของ ComicMenu/กระเป๋า/โต๊ะซื้อขายด้วย --comic-frame-*; ไม่กำหนดขนาดแยก. วัด1440×722: ทั้ง7กรอบ x24,y60,w1392,h562; 1024×800 ซื้อขาย/กระเป๋า x24,y60,w976,h640;1920×800 x220,y60,w1480,h640 เท่ากัน. Build111modulesผ่าน; page1440×722ไม่ล้น. ดู implementations/S06-shared-frame.png. กฎถาวรอยู่ AGENTS.md และ screen-context.md.

2026-10-29 S06/item-sale v02 implemented in isolated comic build. ItemSalePanel + Share comic presentation retain same handlers/eligibility; caption/paper choice controls and knownfacts3cells. 1024×800 columns486/486;1920×800 738/738;1440×722 694/694; zero panel overflow and frame matches inventory. Browser public-fixture tests confirmed share claims genuine/cursed+rebate3, over-budget disabled, owned sale/show omit claims, withdraw allowfalse. Menu overlap found and fixed with utilityOpen pause; only one dialog remains when utilities open. Build114modules passed. C28 actual fixture capture, not AI/live multiplayer; portable code and fixture under implementations/S06-sale-source and docs/validation/s06-item-sale.

2026-10-29 S06 style correction: ผู้ใช้ย้ำเกมเดียวกันต้องอ้างอิงUIที่มี ไม่สร้างstyleใหม่ต่อหน้า. ยกเลิกbrushcaption/whitechoice/paperfactsและdividerกลาง/ที่มา/rebate/footer; ใช้ComicMenu header65px/line1pxและComicButtonดำแดงเดิม. คอลัมน์1024=486/486,1920=738/738,1440=694/694. แถวchoice/rebateleftตรงกัน590/1066/826ตามviewport; stepper40pxเท่ากันและpaneloverflow0. ไม่เปลี่ยนShare logic. C28จับใหม่จริงตามstyleนี้.
