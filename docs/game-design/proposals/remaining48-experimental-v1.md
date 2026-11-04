# Remaining48 — สเปกทดลอง v1

วันที่ 2026-11-04 · **รออนุมัติ ยังไม่ลงเกม**

[หน้าทบทวน](remaining48-experimental-v1.html) · [ข้อมูลต้นทาง](remaining48-experimental-v1.json) · [Audit ปัจจุบัน](../remaining48-audit.html) · [Context กลาง](../logic-item-relations.html)

E05 อนุมัติเฉพาะความหมายแล้ว; ชุดนี้เสนอ 9 ความหมายที่เหลือและค่าทดลองทั้ง48 ไม่ถือว่าผู้ใช้อนุมัติโดยอ่านหรือไม่มีคำตอบ ราคาฐานไม่ใช่ราคาขายตายตัว ผลเสริมยังปิดอยู่ทั้งหมด ไม่มีการอ้างผล balance จากตารางนี้

## กฎร่วม

1. นี่เป็นข้อเสนอค่าทดลองใหม่ทั้งหมด48ชิ้น ไม่ใช่การลงเกม; E05อนุมัติเฉพาะความหมาย ที่เหลือ9ความหมายและตัวเลขทั้งหมดรออนุมัติชุดนี้ ใช้ชื่อ/ภาพ/palette/typeเดิม ไม่สร้างภาพใหม่
2. anchor เป็นราคาฐานก่อน priceRange/rarity ตาม generatorเดิม ไม่ใช่ราคาขายตายตัว; maxLife/maxEnergy/inspectionquota/stockbudget/forcedRPS/Collector3+2/Spirit/scoringweights เดิมไม่เปลี่ยน นอกจาก E69 asset bonus ที่เสนออย่างเปิดเผย
3. S คือผลรวม strength=rarityEffect*(copy?0.4:1) ของเครื่องมือกลุ่มเดียวกันสูงสุด5ชิ้นเรียงstrengthมากก่อนแล้วinstanceIdที่ถือจริง; original/copyใช้สูตรเดิม ไม่คูณราคา/baseซ้ำ; จำนวนเต็มปัดลง basispointsปัดลงก่อนคำนวณเงิน แล้วเงินปัดลงเมื่อจ่าย; สำหรับbinaryให้ใช้ S=ค่าstrengthสูงสุดของinstanceเดียว ไม่รวมเศษหลายชิ้น; binaryสิทธิ์ต้อง S>=1 ไม่เพิ่มจำนวนสิทธิ์ตามrarity
4. heldใช้ได้เฉพาะผู้มีชีวิตที่เป็นเจ้าของจริงในinventory ไม่อยู่vault/escrow/auction/loan/Alienloan/lockที่ห้ามใช้; ไม่ต้องรู้truthเพื่อได้heldbonus และheldbonusไม่เปลี่ยนตามtruthลับ จึงไม่รั่วauth/curse
5. active/consumeเลือกใช้instanceเดียวต่อattempt ใช้ strengthของinstanceนั้น ไม่รวมของอื่น; binaryต่ำกว่า1ปิดปุ่มไม่คิดcost; ของแท้สำเร็จ ของปลอมroll40%เดิม คำสาปใช้activationconsequenceเดิมและเปิดข้อมูลตามกฎเดิมเท่านั้น; ห้ามส่งactivateตรงเมื่อขาดtarget/phase/resource
6. accepted active/consume attemptจ่าย1พลังตามcostที่ระบุแม้fakefail; useledgerเพิ่มแม้fakefail; consumeทำลายชิ้นที่เลือกทั้งsuccess/fakefail (รวมสำเนาตามretirementเดิม); invalid/noop/cancelก่อนยืนยันไม่คิดcostและไม่กินสิทธิ์; ถ้าตายจากactivationไม่ใช้ผลเป้าหมายต่อและไม่refund
7. ทุกperEncounter capเป็นผู้เล่น+effectFamily+encounter และมีphysicalOrigin ledgerด้วย; transfer/ฝากถอน/loan/เปลี่ยนห้อง/reconnect/ทำcopyไม่reset; copyสืบประวัติusedต้นทาง และorigin sharedcapกันใช้ต้นฉบับ+copyซ้ำ; perRun/pair/origin/statusInstance ledgersตามรันไม่ผูกหน้าจอ
8. ผลที่เขียนว่าถือต่อเนื่องใช้การinvalidateทันทีเมื่อ custodyขาด ไม่เทียบแค่ภาพปลายช่วง; ไม่ได้สิทธิ์ย้อนหลังจากซื้อกลางช่วง; snapshotก่อนactionและrecheckก่อนsettle; ไม่มีสิทธิ์ข้ามdeath/finalization
9. bank-reserveคือเงินbankที่มีอยู่จริงและยังไม่ผูกescrow/loan/Spirit obligation: จ่าย min(quotedBonus,freeBankCredits) ด้วย ledger source bank→seat ชื่อeffectเฉพาะ; ไม่mint ไม่ติดหนี้รอจ่าย ไม่แย่ง principal/obligations; UIแสดงquoteที่จ่ายได้และactualผล เงินโบนัสไม่triggerbonusตัวเอง
10. priorities: truth/eligibilityและexistingphase guardsก่อน → สิทธิ์เดิม/เหตุยกเว้น → neweffectรวมcap → quoteที่รู้ก่อนตกลง →จ่าย/โอน →actualstats/log →consumeสิทธิ์อย่างเดียวครั้งเดียว; seededkeysมีrun/action/instance/target ไม่rollซ้ำจากrender/retry
11. ครอบครัวร่วมpilot: acceptanceเฉพาะ48ใหม่รวม6pp (translatorเดิมไม่ถูกตัด), rerollลดรวม2, interestbonusรวม4pp, tieweaponรวม1/ช่วง, armorไม่บวกpilotshield; ตัวเลขpilot8ไม่แก้และเมื่อไม่มี48ผลเหมือนเดิมทุกประการ; โบนัสข้ามfamilyใช้เฉพาะเมื่อเขียนชัด
12. financialbenefitไม่ถูกนับเป็นsoldGross/interest/loan/newpurchaseโดยอัตโนมัติ; personal scoringเขียนactualcanonicaleventsเดิม ไม่เพิ่มรางวัลตามข้อความeffect; E69แสดงAเพิ่มแยกไม่แก้P/Gหรือน้ำหนัก
13. รันเก่า/ค่าdefault/version3/version4และauditbytesเดิมต้องreplayเหมือนเดิม; สร้างcatalog/effectrevisionใหม่หลังอนุมัติเท่านั้น ก่อนเปิดdefault56ต้องมีครบcapability/eventpredicate/UI/bot/reconnect/replay/benchmarkทุกชิ้น ไม่ใช้newIDaliasสินค้าเก่า
14. UIใช้ComicMenu/Button/Tooltip/tokensเดิม ไม่redesignหน้าที่ไม่เกี่ยว; ไม่มีscroll/dropdownขยาย; effectแสดงknowncost/gain/target/ข้อจำกัดและเหตุผลdisabled ไม่แสดงtruthที่ยังไม่ตรวจ; รายงานlogactualamountและcapที่ใช้ ไม่แสดงseed/มือRPS/ของblind

## 9 ข้อที่ต้องตัดสินพร้อมชุดนี้

- **SCOPE-RARITY / E25**: เฉพาะ new candidate ที่สร้างให้เจ้าของจากสกิล Beast/Alien หลังยืนยันการใช้สกิล โดยถือก่อนสร้าง · หลัง rarity base roll ที่ยังไม่ finalize: โอกาส min(1500,500*S)/10000 ขยับขึ้น1 tier ที่มี weight>0ใน profile · ไม่ใช้กับ stock portals, reroll portals, Collector, Spirit, Swarm copies, existingitems, polish/reveal; ไม่แตะ truth; ไม่สร้าง tier ที่ config ปิด
- **MEANING-SWARM / E33**: ใช้สกิล Swarm สร้าง copy ใหม่ที่มีสิทธิ์ ขณะถือก่อนใช้ · copy valuePercent ของ Swarm จาก25/35/50 เพิ่ม min(10,floor(5*S)) points ตาม trust tier จริง · ราคาคัดลอกคำนวณครั้งเดียวหลัง bonus ไม่คืนเงิน/เพิ่มค่าของcopyที่มีแล้ว; ไม่ให้ trust tier ที่ยังไม่ปลดล็อก
- **VISIBILITY-PORTAL / E35**: PORTALS ก่อนเลือก ไม่มี unresolved event; ผู้เล่นเลือกเป้าหมายจากประตูจริง · S>=1 เปิด kind ของ stock slot2 ที่มีอยู่จริงของ portal ที่เลือก1บาน · ไม่แสดง base/ask/truth/curse/rarity หรือของคนอื่น; ไม่สร้าง stock ใหม่; ถ้ารู้แล้วหรือไม่มี slot2 ไม่คิดพลัง
- **CAUSE-PORTAL / E36**: PORTALS ไม่มี eventค้าง/ยังไม่เลือก และ closure provenance cause=resolved-event · S>=1 เปิด event-closed portal ที่เลือก1บาน · ไม่เปิด crime/tradeban/statusD07/ห้องปิดโดยระบบ/คนตาย; ถ้าพ่อค้าติดbanยังเลือกไม่ได้; failure/noopไม่คิดพลัง
- **TARGET-DEFEAT / E40**: แพ้การขโมยจากพ่อค้าเท่านั้น ขณะถือ sentry ก่อนเริ่มดวล · S>=1 ลด trust loss ของ NPC-theft defeat จาก2เหลือ1 (หาก trust เหลือน้อยลดได้ตามจริง) · ไม่ลดโทษ PvP/compensation/seal/ban/D21 ไม่ยกเลิก duel; นี่คือข้อเสนอจำกัดความหมายใหม่ที่ต้องอนุมัติ
- **SCOPE-ALIEN-RETURN / E59**: รับของเดิมคืนจาก Alien เมื่อครบ due และพบ Alien จริง ผู้ถือ cradle เดิมตลอด signedAt..return · min(3,floor(S)*actualReturnedOriginalCount,remainingRunCap6) credits เพิ่ม · loaned cradle ไม่ให้ผล; ผู้ตายคืนprincipalเพื่อscoreไม่รับโบนัส; ไม่มีของคืนจริงก็0; ไม่สร้าง contract stats ซ้ำ
- **SCOPE-COLLECTOR / E69**: Collector final settlement สำหรับคนมีชีวิตหลังคืน principal และปิดหนี้แล้ว · bonus=min(20,floor(eligibleOriginalItemAssetSum * min(1000,200*S)/10000)); บวกเฉพาะ A ก่อน B10/D10 ตามสูตรเดิม · ไม่ alias B10 ไม่คูณ P/G; แสดง asset bonus แยก; ต้องอนุมัติเป็นกฎคะแนนใหม่ในชุดนี้ ไม่แก้ approved weights JSON
- **ALLOWLIST-REMOVE / E71**: allowlist D01,D02,D05,D06,D19,D20,D22,D23 เท่านั้น มีผลอนาคตยังค้าง · S>=1 ลบ active debuff instance ที่เลือก1อย่าง · ห้ามD03/D07/D08/D09/D10/D21/D24 และห้ามลบ crime/loan/seal/contract/cooldown; ไม่คืนพลัง/HP/เงินหรือเปิดประตูย้อนหลัง
- **ALLOWLIST-EXTEND / E72**: เลือก active finite-expiry buff instance ใน allowlist B03,B05,B11,B14,B16 ที่ยังไม่ใช้หมด · S>=1 ขยาย expiresAt +1 ช่วง ไม่เพิ่ม charges/magnitude · exclude B10/คะแนน/อายุไม่มีที่สิ้นสุด/triggerต้นช่วง/สัญญา/Collector/Spirit/expiryที่หมดแล้ว; สำเนาสืบสถานะขยายของ buff ไม่เริ่มใหม่

## รายการ48ชิ้น

| พ่อค้า | สินค้า | Anchor | ผลหลัก | แบบ / พลัง |
|---|---|---:|---|---|
| orc | ดาบสาบานเผ่า (orc-oath-sword) | 24 | E28 | held / 0 |
| orc | สนับแข้งรากเหล็ก (orc-ironroot-greaves) | 20 | E61 | held / 0 |
| orc | ยาทาเถ้าร้อน (orc-ember-salve) | 14 | E63 | held / 0 |
| orc | กลองศึกกระดูก (orc-bone-war-drum) | 20 | E16 | held / 0 |
| orc | ลูกปัดนับชัย (orc-tally-beads) | 18 | E13 | held / 0 |
| orc | คีมตีเหล็กเผ่า (orc-clan-forge-tongs) | 18 | E07 | held / 0 |
| vampire | เสื้อคลุมหมอก (vampire-mist-cloak) | 24 | E42 | held / 0 |
| vampire | ขวดรินไวน์เงา (vampire-shadow-wine-decanter) | 20 | E58 | held / 0 |
| vampire | ไวโอลินสนธยา (vampire-gloam-violin) | 22 | E11 | held / 0 |
| vampire | เครื่องพ่นละอองหมอก (vampire-mist-atomizer) | 18 | E06 | held / 0 |
| vampire | บัตรเชิญเที่ยงคืน (vampire-midnight-invitation) | 16 | E22 | held / 0 |
| vampire | ดาบจันทร์แหว่ง (vampire-mooncut-sword) | 24 | E38 | held / 0 |
| autometa | เครื่องยิงขดลวด (autometa-coil-repeater) | 26 | E05 | held / 0 |
| autometa | ยามกลไกไขลาน (autometa-clockwork-sentry) | 24 | E40 | held / 0 |
| autometa | ปริซึมบันทึกข้อมูล (autometa-data-prism) | 20 | E02 | held / 0 |
| autometa | กระป๋องสารหล่อเย็น (autometa-coolant-canister) | 16 | E31 | active / 1 |
| autometa | สัญญาณไฟพับได้ (autometa-folding-beacon) | 18 | E35 | active / 1 |
| autometa | สายรัดเซอร์โว (autometa-servo-harness) | 20 | E61 | held / 0 |
| alien | ตะเกียงสปอร์ (alien-spore-lantern) | 18 | E67 | held / 0 |
| alien | ผ้าคลุมเสียงสะท้อน (alien-echoweave-shawl) | 22 | E72 | consume / 1 |
| alien | แผนที่ดาวเยื่อชีวภาพ (alien-star-chart-membrane) | 26 | E25 | held / 0 |
| alien | ฝักเมล็ดเรืองแสง (alien-biobright-seedpod) | 16 | E61 | held / 0 |
| alien | หน้าปัดระยะเฟส (alien-phase-dial) | 18 | E31 | active / 1 |
| alien | คทาเคลื่อนเฟส (alien-phase-staff) | 22 | E57 | held / 0 |
| darkone | ดาบสุญญะ (darkone-null-sword) | 26 | E71 | consume / 1 |
| darkone | คัมภีร์สุญญะ (darkone-null-testament) | 24 | E69 | held / 0 |
| darkone | โซ่พันธะหนี้ (darkone-debt-chain) | 18 | E49 | held / 0 |
| darkone | กระถางกำยานลางร้าย (darkone-omen-censer) | 18 | E67 | held / 0 |
| darkone | ตราประทับเถ้าถ่าน (darkone-ash-seal) | 18 | E53 | held / 0 |
| darkone | ที่ครอบดับเสียง (darkone-silence-snuffer) | 14 | E71 | consume / 1 |
| deepsea | ตรีศูลห้วงลึก (deepsea-abyss-trident) | 24 | E07 | held / 0 |
| deepsea | เกราะแรงดันใต้ทะเล (deepsea-pressure-cuirass) | 22 | E62 | held / 0 |
| deepsea | อานสาหร่าย (deepsea-kelp-saddle) | 20 | E16 | held / 0 |
| deepsea | ทุ่นแก้วคลื่น (deepsea-tideglass-buoy) | 20 | E46 | held / 0 |
| deepsea | กรงปลาโคม (deepsea-lanternfish-cage) | 18 | E35 | active / 1 |
| deepsea | แตรสังข์วาฬ (deepsea-whale-conch-horn) | 18 | E63 | held / 0 |
| swarm | เครื่องพ่นฟีโรโมน (swarm-pheromone-sprayer) | 22 | E11 | held / 0 |
| swarm | กลุ่มไข่รัง (swarm-hive-egg-cluster) | 22 | E33 | held / 0 |
| swarm | หลอดม้วนยางไม้ (swarm-resin-spool) | 16 | E52 | held / 0 |
| swarm | เครื่องร่อนเยื่อปีก (swarm-wing-membrane-glider) | 18 | E34 | held / 0 |
| swarm | แท่นรองดักแด้ (swarm-pupa-cradle) | 20 | E59 | held / 0 |
| swarm | เกราะไคติน (swarm-chitin-cuirass) | 22 | E62 | held / 0 |
| beast | แผ่นกลิ่นสะกดรอย (beast-trail-scent-disc) | 24 | E25 | held / 0 |
| beast | เขาส่งสัญญาณ (beast-tracker-horn) | 20 | E32 | held / 0 |
| beast | อานข้ามรอยแยก (beast-rift-saddle) | 22 | E36 | active / 1 |
| beast | กับดักกรามดีด (beast-springjaw-trap) | 18 | E53 | held / 0 |
| beast | เสื้อคลุมขนอำพัน (beast-amber-fur-mantle) | 22 | E68 | held / 0 |
| beast | บ่วงเส้นเขี้ยว (beast-fangline-lasso) | 20 | E37 | held / 0 |

## สัญญาผลหลัก35กลุ่ม

### E28

held · 0 พลัง · ดาบสาบานเผ่า

- ตัวเลข: {"trust":1,"perMerchantPerRun":1,"familyCap":2}
- สูตร: min(2,floor(S)) trust จริง ไม่เกิน trust cap
- เกิดเมื่อ: เข้าพบพ่อค้าเผ่าที่ผู้เล่นยังไม่เคยพบในรัน ขณะถือก่อนเลือกประตู
- สิทธิ์/เพดาน: บันทึก first-meeting ของผู้เล่นตลอดรัน แม้ยังไม่มีดาบ; ซื้อดาบภายหลังไม่ย้อนให้ผล; ใช้ได้ครั้งเดียวต่อพ่อค้า/ผู้เล่น
- ข้อยกเว้น: ไม่เพิ่ม trust เมื่อแค่ peek/reroll; ใช้ setPersonalTrust เก็บเฉพาะส่วนที่เพิ่มจริง

### E61

held · 0 พลัง · สนับแข้งรากเหล็ก, สายรัดเซอร์โว, ฝักเมล็ดเรืองแสง

- ตัวเลข: {"energy":1,"familyCap":2}
- สูตร: min(2,floor(S)) พลัง ผ่าน recover และเพดานพลังเดิม
- เกิดเมื่อ: เริ่มช่วงใหม่ หลังจ่ายค่าเข้าช่วง ถ้ายังมีชีวิตและถือ instance เดิมตั้งแต่ต้นขอบช่วง
- สิทธิ์/เพดาน: หนึ่ง settlement ต่อผู้เล่น/ช่วง รวมสนับแข้ง สายรัด และฝักเมล็ด; ไม่คิดตอนเริ่มเกมช่วง1หรือซื้อกลางช่วง
- ข้อยกเว้น: ผล D10/B14 และการฟื้นที่เกิดจริงยังใช้กฎเดิม; ฝาก/โอนไม่ทำให้ได้พลังซ้ำ

### E63

held · 0 พลัง · ยาทาเถ้าร้อน, แตรสังข์วาฬ

- ตัวเลข: {"discountCredits":1,"familyCap":2,"minimumPrice":1}
- สูตร: quote - min(2,floor(S)) แต่ไม่น้อยกว่า1เครดิต
- เกิดเมื่อ: ดีล recovery ที่มีอยู่จริง มีทรัพยากรขาดและใช้สิทธิ์ recovery เดิม
- สิทธิ์/เพดาน: ใช้ได้กับดีล1ครั้งต่อช่วงตามระบบเดิม ไม่มีสิทธิ์ recovery เพิ่ม; ยาทาและแตรรวมเพดานเดียว
- ข้อยกเว้น: แสดงราคาสุดท้ายก่อนยืนยัน; ไม่คืนเงินย้อนหลัง ไม่ลด HP payment หรือค่าจ้างวิญญาณ

### E16

held · 0 พลัง · กลองศึกกระดูก, อานสาหร่าย

- ตัวเลข: {"energy":1,"familyCap":2,"perEncounter":1}
- สูตร: min(2,floor(S)) พลังตาม missing energy
- เกิดเมื่อ: ปิดการซื้อขาย PvP เป็นเครดิตจริงกับผู้เล่นคู่ใหม่ ขณะถือก่อนเปิด offer และตอน settle
- สิทธิ์/เพดาน: คู่ผู้เล่นแบบไม่เรียงลำดับนับครั้งเดียวตลอดรัน ร่วมทั้งกลอง/อาน; ไม่เกิน1ครั้ง/ผู้เล่น/ช่วง; ต้องเป็น original และ paid>=1
- ข้อยกเว้น: ไม่รวม barter/gift/self/loan/Spirit/NPC และสำเนา; origin ที่เคยรับผลแล้วไม่ให้ซ้ำ; ไม่ฟื้นเมื่อยกเลิก

### E13

held · 0 พลัง · ลูกปัดนับชัย

- ตัวเลข: {"bonusBps":1000,"perSettlementCap":2,"perRunCap":8}
- สูตร: floor(commissionPaid * min(2000,1000*S)/10000), ไม่เกิน2/settlement และ8/ผู้เล่น/รัน
- เกิดเมื่อ: รับ commission จากการขายของที่ตนประเมินให้ผู้เล่นอื่นตามระบบเดิม สำเร็จและมี commission จริง
- สิทธิ์/เพดาน: origin/ผู้ขาย/ผู้ซื้อไม่ซ้ำตลอดรัน; ห้ามสำเนาและโอนวน; ทุนจ่ายเพิ่มจาก bank-reserve
- ข้อยกเว้น: ไม่เพิ่มจาก gross หรือค่าจ้างวิญญาณ ไม่ลดเงินของคู่ค้า; actual bonus แยก log ไม่ถือเป็นยอดขายหรือ commission ต้นทางรอบใหม่

### E07

held · 0 พลัง · คีมตีเหล็กเผ่า, ตรีศูลห้วงลึก

- ตัวเลข: {"bonusBps":1000,"familyCapBps":2000,"chanceMax":95}
- สูตร: เพิ่ม min(2000,1000*S) basis points ก่อน clamp โอกาสรวม5..95%
- เกิดเมื่อ: การจ่ายชำระคำสาปจริงตาม cleanse quote เดิม
- สิทธิ์/เพดาน: คีมและตรีศูลรวมเพดาน20pp ไม่ใช้เป็นวัตถุดิบและไม่ลบทิ้ง; เป้าหมายต้องไม่ใช่เครื่องมือชิ้นเดียวกัน
- ข้อยกเว้น: ไม่เปลี่ยนราคาหรือเปิด truth ก่อนตรวจ; ยังคงเสี่ยงล้มเหลวและจ่ายครั้งนั้นตามเดิม

### E42

held · 0 พลัง · เสื้อคลุมหมอก

- ตัวเลข: {"refundBps":2000,"perLossCap":4,"perRunCap":6}
- สูตร: min(4, floor(min(lastPaidPrice,scaledBase)*min(3000,2000*S)/10000), remainingRunCap6)
- เกิดเมื่อ: ของ original ถูกขโมยสำเร็จจริงจากเจ้าของ ไม่ใช่ cloak เอง และ cloak อยู่กับผู้เสียหายก่อนเริ่มดวลถึงหลังโอนของ
- สิทธิ์/เพดาน: origin หนึ่งชิ้นจ่ายประกันได้ครั้งเดียวทั้งรันข้ามผู้เล่น; ล็อกสิทธิ์ที่เริ่มดวล; bank-reserve; ชำระทีเดียว
- ข้อยกเว้น: ไม่รวม seizure/ขาย/ฝาก/ให้ยืม/สำเนา/ดวลยกเลิก/ป้องกันสำเร็จ; ไม่คืนของและไม่ลดโทษโจร; เงินประกันไม่สร้าง buy/sell stats

### E58

held · 0 พลัง · ขวดรินไวน์เงา

- ตัวเลข: {"lifeDiscount":1,"minimumLifePayment":1,"binary":true}
- สูตร: ลด HP quote 1 เมื่อ S>=1 แต่ต้องจ่ายอย่างน้อย1ชีวิต
- เกิดเมื่อ: ยอมรับ Vampire blood contract ใหม่ ที่ยังไม่มีสัญญาค้าง
- สิทธิ์/เพดาน: หนึ่งส่วนลดต่อการเซ็น ไม่คูณจำนวนสัญญา/rarity; ขวดไม่หมด; สัญญาคืนตามพบครั้งหน้ากฎเดิม
- ข้อยกเว้น: ประกาศ HP quote ก่อนตกลง; ไม่ใช่ damage shield; lifeLost นับที่จ่ายจริง; ผลตอบแทนยังสุ่มเพียง1อย่างเดิม

### E11

held · 0 พลัง · ไวโอลินสนธยา, เครื่องพ่นฟีโรโมน

- ตัวเลข: {"bonusBps":200,"familyCapBps":600,"chanceMax":95}
- สูตร: เพิ่ม min(600,200*S) basis points ให้ acceptance ก่อน clamp95%
- เกิดเมื่อ: NPC ตัดสินยอมรับราคาประเมินที่มีสิทธิ์ต่อรอง
- สิทธิ์/เพดาน: ไวโอลิน/ฟีโรโมนรวมโบนัสใหม่ไม่เกิน6pp; translator pilot คง+2ppต่อstrengthตามสเปกเดิมและรวมกับผลใหม่เฉพาะก่อน overall95%cap ไม่ลดสิทธิ์pilotเดิม
- ข้อยกเว้น: ไม่ลด detection/backlash ไม่บังคับผู้เล่นอื่นยอม ไม่ข้าม overpriced/purchase/ban/trust gates

### E06

held · 0 พลัง · เครื่องพ่นละอองหมอก

- ตัวเลข: {"penaltyDiscountBps":2500,"familyCapBps":5000,"perEncounter":1}
- สูตร: ลด floor(actualCreditPenalty * min(5000,2500*S)/10000) หลัง voidseal เดิม
- เกิดเมื่อ: ท้าทายผิดที่ยังมี credit penalty จริง
- สิทธิ์/เพดาน: หนึ่ง failed challenge/ผู้เล่น/ช่วง; ล็อกค่าก่อน settle; ใช้ bank น้อยลง ไม่ refund
- ข้อยกเว้น: ไม่ลด trust/HP/ban ไม่สร้างส่วนลดซื้อ ไม่เปลี่ยน truth; void ทำ penalty0 จึงไม่กินสิทธิ์

### E22

held · 0 พลัง · บัตรเชิญเที่ยงคืน

- ตัวเลข: {"rebateBps":500,"perWinCap":3,"perRunCap":6}
- สูตร: min(3,floor(actualWinningBid*min(1000,500*S)/10000),remainingRunCap6)
- เกิดเมื่อ: ชนะประมูล original และชำระเงินจริง โอนของสำเร็จ
- สิทธิ์/เพดาน: ถือ invitation ตั้งแต่ bid แรกของตนใน lot ถึง settlement; origin/lot หนึ่งครั้ง/รัน; bank-reserve
- ข้อยกเว้น: ไม่รวม escrow คืน ถอน bid losing cancel หรือ bid ตัวเอง; rebate ไม่หัก lastTradePrice/gross ที่จ่ายจริง และไม่นับรายได้ขาย

### E38

held · 0 พลัง · ดาบจันทร์แหว่ง

- ตัวเลข: {"tieRights":1,"binary":true,"perEncounter":1}
- สูตร: S>=1 ให้สิทธิ์เสมอ1ครั้ง ไม่คูณ rarity
- เกิดเมื่อ: public theft RPS duel ที่ประกาศสิทธิ์ก่อนส่งมือ
- สิทธิ์/เพดาน: ใช้ contract เดียวกับ riftfang-sword: ครอบครัวอาวุธสิทธิ์เสมอรวม1/ผู้เล่น/ช่วง ไม่สะสมจากสองดาบ; ทั้งสองฝ่ายมีให้หักล้างตามเดิม
- ข้อยกเว้น: ไม่ดูมือคู่ต่อสู้ ไม่ข้าม mandatory duel/missing-hand randomization; freeze สิทธิ์ก่อนรับมือ

### E05

held · 0 พลัง · เครื่องยิงขดลวด

- ตัวเลข: {"bonusBps":500,"familyCapBps":1500,"discountMaxBps":9000}
- สูตร: ส่วนลดเดิมจาก correct challenge + min(1500,500*S) basis points; รวมส่วนลด challenge ไม่เกิน90%
- เกิดเมื่อ: ท้าทายคำระบุเท็จถูกต้องและ quote ของเป้าหมายยังมีผล
- สิทธิ์/เพดาน: หนึ่งผลต่อ challenge settlement เดิม ไม่ refund หรือท้าทายรายการเดิมซ้ำเพื่อสะสมส่วนลด
- ข้อยกเว้น: ความหมายอนุมัติแล้ว ตัวเลขยังเสนอ; ไม่สุ่มชนะ ไม่เปิด truth เพิ่ม ไม่ลด penalty เมื่อท้าทายผิด

### E40

held · 0 พลัง · ยามกลไกไขลาน

- ตัวเลข: {"trustLossReduction":1,"minimumTrustLoss":1,"binary":true,"perEncounter":1}
- สูตร: S>=1 ลด trust loss ของ NPC-theft defeat จาก2เหลือ1 (หาก trust เหลือน้อยลดได้ตามจริง)
- เกิดเมื่อ: แพ้การขโมยจากพ่อค้าเท่านั้น ขณะถือ sentry ก่อนเริ่มดวล
- สิทธิ์/เพดาน: หนึ่ง NPC-defeat/ผู้เล่น/ช่วง; ใช้จริงเมื่อ loss>=2 เท่านั้น
- ข้อยกเว้น: ไม่ลดโทษ PvP/compensation/seal/ban/D21 ไม่ยกเลิก duel; นี่คือข้อเสนอจำกัดความหมายใหม่ที่ต้องอนุมัติ

### E02

held · 0 พลัง · ปริซึมบันทึกข้อมูล

- ตัวเลข: {"narrowBps":2000,"familyCapBps":5000}
- สูตร: จากช่วงตรวจเดิม[L,H] truth V: Lใหม่=floor(L+(V-L)*r), Hใหม่=ceil(H-(H-V)*r), r=min(.5,.2*S)
- เกิดเมื่อ: ตรวจราคาแบบ range สำเร็จของสินค้าที่มีสิทธิ์ดู
- สิทธิ์/เพดาน: ไม่ใช้สิทธิ์ตรวจเพิ่ม; คง B01 exact / D02 priority เดิม; ถ้าD02บังคับ fog ไม่ narrow; ช่วงต้องครอบ truth scaled/copy/replacement
- ข้อยกเว้น: ไม่เปิด authenticity/curse ไม่คำนวณใน public view ก่อนตรวจ; ไม่เปิดราคาจริงเป๊ะโดยบังเอิญนอก known facts กฎเดิม

### E31

active · 1 พลัง · กระป๋องสารหล่อเย็น, หน้าปัดระยะเฟส

- ตัวเลข: {"cooldownReduction":1,"familyCap":2,"perEncounter":1}
- สูตร: min(2,floor(S),floor(baseCooldown/2),remainingCooldown) ช่วง
- เกิดเมื่อ: เลือก merchant ability ที่ยัง cooldown มีช่วงเหลือ และยังไม่มี abilityAdjusted ในช่วงนี้
- สิทธิ์/เพดาน: canister/dial รวม1การใช้/ผู้เล่น/ช่วง; physical+origin ledger; ไม่บริโภคของ; ลดได้แต่ไม่ให้สกิลที่ใช้แล้วในช่วงนี้ใช้ซ้ำ
- ข้อยกเว้น: คำนวณ quote target ก่อนจ่าย; ถ้าลดไม่ได้ปิดปุ่มและไม่ใช้พลัง; ไม่ปรับ cooldown ของ item/contract/RPS

### E35

active · 1 พลัง · สัญญาณไฟพับได้, กรงปลาโคม

- ตัวเลข: {"extraKinds":1,"binary":true,"perEncounter":1}
- สูตร: S>=1 เปิด kind ของ stock slot2 ที่มีอยู่จริงของ portal ที่เลือก1บาน
- เกิดเมื่อ: PORTALS ก่อนเลือก ไม่มี unresolved event; ผู้เล่นเลือกเป้าหมายจากประตูจริง
- สิทธิ์/เพดาน: beacon/cage รวม1portal/ผู้เล่น/ช่วง; ความรู้ส่วนตัวผูก portalId+itemId; เปลี่ยนประตูแล้วคำใบ้เดิมไม่ย้ายตาม; ของไม่หมด
- ข้อยกเว้น: ไม่แสดง base/ask/truth/curse/rarity หรือของคนอื่น; ไม่สร้าง stock ใหม่; ถ้ารู้แล้วหรือไม่มี slot2 ไม่คิดพลัง

### E67

held · 0 พลัง · ตะเกียงสปอร์, กระถางกำยานลางร้าย

- ตัวเลข: {"riskReductionBps":1000,"familyCapBps":2000}
- สูตร: chanceAfterExistingOmenB23 * (1-min(.2,.1*S))
- เกิดเมื่อ: Dread roll จริงหนึ่งครั้งท้ายช่วง ไม่รวม personal event/omen direct consequence
- สิทธิ์/เพดาน: lantern/censer รวม relative reduction20% (ไม่ใช่−20pp); ไม่มี re-roll; ไม่ consume item
- ข้อยกเว้น: ไม่รับประกันปลอดภัย ไม่เปลี่ยน severity/type; log เฉพาะ chance ที่เปิดเผยได้ ไม่เปิด seed หรือ future roll

### E72

consume · 1 พลัง · ผ้าคลุมเสียงสะท้อน

- ตัวเลข: {"extraEncounters":1,"binary":true,"perStatusInstance":1,"perEncounter":1}
- สูตร: S>=1 ขยาย expiresAt +1 ช่วง ไม่เพิ่ม charges/magnitude
- เกิดเมื่อ: เลือก active finite-expiry buff instance ใน allowlist B03,B05,B11,B14,B16 ที่ยังไม่ใช้หมด
- สิทธิ์/เพดาน: ใช้ shawl1ชิ้น/ผู้เล่น/ช่วง; เป้าหมาย instance ขยายได้1ครั้งตลอดอายุ รวมทุกคน; consume ผ้าคลุมเมื่อ accepted attempt
- ข้อยกเว้น: exclude B10/คะแนน/อายุไม่มีที่สิ้นสุด/triggerต้นช่วง/สัญญา/Collector/Spirit/expiryที่หมดแล้ว; สำเนาสืบสถานะขยายของ buff ไม่เริ่มใหม่

### E25

held · 0 พลัง · แผนที่ดาวเยื่อชีวภาพ, แผ่นกลิ่นสะกดรอย

- ตัวเลข: {"promotionChanceBps":500,"familyCapBps":1500,"maxTierSteps":1}
- สูตร: หลัง rarity base roll ที่ยังไม่ finalize: โอกาส min(1500,500*S)/10000 ขยับขึ้น1 tier ที่มี weight>0ใน profile
- เกิดเมื่อ: เฉพาะ new candidate ที่สร้างให้เจ้าของจากสกิล Beast/Alien หลังยืนยันการใช้สกิล โดยถือก่อนสร้าง
- สิทธิ์/เพดาน: membrane/disc รวม15%; หนึ่ง deterministic extra roll/itemId; finalize appearance แล้ว scale base/ask/reservation ครั้งเดียว
- ข้อยกเว้น: ไม่ใช้กับ stock portals, reroll portals, Collector, Spirit, Swarm copies, existingitems, polish/reveal; ไม่แตะ truth; ไม่สร้าง tier ที่ config ปิด

### E57

held · 0 พลัง · คทาเคลื่อนเฟส

- ตัวเลข: {"freeChanges":1,"binary":true,"perEncounter":1}
- สูตร: S>=1 ยกเว้นเฉพาะพลังของการเปลี่ยน NPC wish หนึ่งครั้ง
- เกิดเมื่อ: ผู้เล่นเลือกสัญญา NPC wishlist ปัจจุบันที่ยังไม่สำเร็จและมีสิทธิ์เปลี่ยน
- สิทธิ์/เพดาน: staff รวม1change/ผู้เล่น/ช่วง; สร้างทดแทนสัญญาเดิม ไม่เพิ่ม slots/budget/lifetime; ไม่ทำให้สุ่มก่อนจ่ายวนฟรี
- ข้อยกเว้น: ไม่ใช่ Collector3+2 หรือ Ghost jobs; ถ้าปฏิเสธ/no candidate ไม่เสียสิทธิ์; cooldown/expiry/tradebanเดิมยังอยู่

### E71

consume · 1 พลัง · ดาบสุญญะ, ที่ครอบดับเสียง

- ตัวเลข: {"removedInstances":1,"binary":true,"perEncounter":2}
- สูตร: S>=1 ลบ active debuff instance ที่เลือก1อย่าง
- เกิดเมื่อ: allowlist D01,D02,D05,D06,D19,D20,D22,D23 เท่านั้น มีผลอนาคตยังค้าง
- สิทธิ์/เพดาน: ดาบ/ที่ครอบรวมไม่เกิน2/ผู้เล่น/ช่วง ใช้สินค้าที่เลือกหมดไปเมื่อ accepted attempt; ห้ามกินเป้าหมายที่ไม่มีแล้ว
- ข้อยกเว้น: ห้ามD03/D07/D08/D09/D10/D21/D24 และห้ามลบ crime/loan/seal/contract/cooldown; ไม่คืนพลัง/HP/เงินหรือเปิดประตูย้อนหลัง

### E69

held · 0 พลัง · คัมภีร์สุญญะ

- ตัวเลข: {"assetBonusBps":200,"familyCapBps":1000,"scoreCap":20}
- สูตร: bonus=min(20,floor(eligibleOriginalItemAssetSum * min(1000,200*S)/10000)); บวกเฉพาะ A ก่อน B10/D10 ตามสูตรเดิม
- เกิดเมื่อ: Collector final settlement สำหรับคนมีชีวิตหลังคืน principal และปิดหนี้แล้ว
- สิทธิ์/เพดาน: testament ถือจริงตั้งแต่ต้นช่วงสุดท้ายถึงคิดคะแนน; ไม่รวมตัว testament ทุกชิ้น/สำเนา/เงิน/vault/loan/escrow; ไม่มีโบนัส estate ของคนตาย
- ข้อยกเว้น: ไม่ alias B10 ไม่คูณ P/G; แสดง asset bonus แยก; ต้องอนุมัติเป็นกฎคะแนนใหม่ในชุดนี้ ไม่แก้ approved weights JSON

### E49

held · 0 พลัง · โซ่พันธะหนี้

- ตัวเลข: {"refundBps":500,"perLoanCap":2,"perRunCap":4}
- สูตร: min(2,floor(principalRepaid*min(1000,500*S)/10000),remainingRunCap4)
- เกิดเมื่อ: ผู้กู้คืน loan แบบ fully-repaid ที่ผ่านอายุ funded+2ช่วงตาม scoring loan gate เดิม
- สิทธิ์/เพดาน: ผู้กู้ถือ chain เดิมต่อเนื่องตั้งแต่ funding ถึง repay; pairผู้ให้กู้/ผู้กู้+collateralOrigin หนึ่งครั้ง/รัน; bank-reserve
- ข้อยกเว้น: ไม่จ่าย default/foreclosure/partial/cancel/sameperiod; ไม่ลด principal ที่ lenderได้จริง; ไม่เพิ่ม gross/interest/loan count ซ้ำ

### E53

held · 0 พลัง · ตราประทับเถ้าถ่าน, กับดักกรามดีด

- ตัวเลข: {"freeFacets":1,"binary":true,"perEncounter":1}
- สูตร: S>=1 ให้สิทธิ์ inspect facet ที่ไม่รู้1อย่างโดยไม่เสียพลัง แต่ยังใช้ normal inspection quota
- เกิดเมื่อ: ใช้ seal-pick ยึด original สำเร็จและโอนถึงผู้เล่นที่ถือ tool ก่อนเสนอใช้ตราถึงsettle
- สิทธิ์/เพดาน: seal/trap รวม1สิทธิ์/ผู้เล่น/ช่วง ผูก seizedItemId+origin; หมดสิทธิ์เมื่อจบช่วงหรือออกจาก custody; ไม่ต่อโอน
- ข้อยกเว้น: ไม่ auto reveal; ถ้ารู้หมดหรือ quotaหมดไม่ให้สิทธิ์; personally checked fact เท่านั้น; ไม่ให้คะแนนตรวจจากการรู้ซ้ำ

### E62

held · 0 พลัง · เกราะแรงดันใต้ทะเล, เกราะไคติน

- ตัวเลข: {"damageReduction":1,"familyCap":2,"perEncounter":1}
- สูตร: min(2,floor(S),incomingDamage) ของ hit จริงครั้งถัดไป
- เกิดเมื่อ: damageLife ที่เป็น harm ขณะถือก่อน harm ไม่ใช่ quoted HP payment
- สิทธิ์/เพดาน: armor2ชนิดรวม1ครั้ง/ผู้เล่น/ช่วง; ไม่บวกกับ active shield pilot: ใช้แหล่งที่ลดได้มากที่สุดหนึ่งแหล่ง แล้วจึงกฎ damage เดิม
- ข้อยกเว้น: ไม่กัน bloodpayment/โจมตีตนจากคำสาป activation/deathcleanup ไม่ revive; consumeสิทธิ์เฉพาะลดได้จริง; ไม่มีปุ่มเปิดใช้

### E46

held · 0 พลัง · ทุ่นแก้วคลื่น

- ตัวเลข: {"bonusBps":100,"sharedBonusCapBps":400}
- สูตร: เพิ่ม100*S bpsแก่ aged principal; รวม buoy+pilot ring ไม่เกิน400bps; เครดิตรวมปัดลงครั้งเดียว
- เกิดเมื่อ: ถือ physical buoy เดิมต่อเนื่องครบขอบช่วงเดียวกับเงินฝากก้อนเดิม
- สิทธิ์/เพดาน: ถ่ายโอน/ฝากตัว buoy/ค้ำ/ให้ยืมตัดสิทธิ์ age; fresh-first withdrawals; เงินเพิ่มปลายช่วงไม่ earn; bonus bank-reserve
- ข้อยกเว้น: ฐาน10%ไม่เปลี่ยน; ไม่แก้ ring200bps/ชิ้น; ห้ามเพิ่มเพดาน4ppเดิม; เงินคืน/เติมไม่ถือเป็นต้นเดิม

### E33

held · 0 พลัง · กลุ่มไข่รัง

- ตัวเลข: {"copyValueBonusPoints":5,"familyCapPoints":10}
- สูตร: copy valuePercent ของ Swarm จาก25/35/50 เพิ่ม min(10,floor(5*S)) points ตาม trust tier จริง
- เกิดเมื่อ: ใช้สกิล Swarm สร้าง copy ใหม่ที่มีสิทธิ์ ขณะถือก่อนใช้
- สิทธิ์/เพดาน: หนึ่งcopy/originเดิม; ไม่เปลี่ยน effectScaleของcopy0.4 ไม่เปลี่ยนtruth/cooldown ไม่อนุญาตcopyต้นทางซ้ำ
- ข้อยกเว้น: ราคาคัดลอกคำนวณครั้งเดียวหลัง bonus ไม่คืนเงิน/เพิ่มค่าของcopyที่มีแล้ว; ไม่ให้ trust tier ที่ยังไม่ปลดล็อก

### E52

held · 0 พลัง · หลอดม้วนยางไม้

- ตัวเลข: {"energy":1,"familyCap":2,"perEncounter":1}
- สูตร: min(2,floor(S)) พลังตาม missing energy
- เกิดเมื่อ: ผู้ถือ spool ซื้อ seal จากผู้เล่นอื่นผ่าน paid exchange สำเร็จ โดย credits>=1
- สิทธิ์/เพดาน: sealOrigin หนึ่งครั้งตลอดรันข้ามผู้เล่น; ผู้เล่นรับผลได้1ครั้ง/ช่วง; ถือก่อน offerถึงsettle
- ข้อยกเว้น: ไม่รวม seal award/freeoffer/cancel/แลกคืน/สำเนา; ไม่ทำให้จ่ายซื้อ seal0ได้พลัง; ไม่ให้ผู้ขายได้ผลซ้ำ

### E34

held · 0 พลัง · เครื่องร่อนเยื่อปีก

- ตัวเลข: {"energyDiscount":1,"sharedDiscountCap":2,"minimumEnergyCost":1}
- สูตร: ลด floor(S) พลัง รวม compass pilot+glider ไม่เกิน2 แต่ costสุดท้าย>=1
- เกิดเมื่อ: reroll portal ที่ผ่าน guards เดิม และจ่ายพลังจริง
- สิทธิ์/เพดาน: escalating base cost เดิมยังเพิ่มทุกครั้ง; ไม่ reset count เมื่อโอน; ไม่มีสิทธิ์เปิดประตูที่ปิด
- ข้อยกเว้น: quote final cost ตรง server; ไม่ให้ reroll ขณะ eventค้าง/เลือกแล้ว; ไม่สร้าง infinite loop ฟรี

### E59

held · 0 พลัง · แท่นรองดักแด้

- ตัวเลข: {"bonusCreditsPerReturnedItem":1,"perContractCap":3,"perRunCap":6}
- สูตร: min(3,floor(S)*actualReturnedOriginalCount,remainingRunCap6) credits เพิ่ม
- เกิดเมื่อ: รับของเดิมคืนจาก Alien เมื่อครบ due และพบ Alien จริง ผู้ถือ cradle เดิมตลอด signedAt..return
- สิทธิ์/เพดาน: โบนัสเครดิตเท่านั้น ไม่เพิ่ม energy; contractIdจ่าย1ครั้ง; จ่าย bank-reserveหลัง principalคืน; ไม่คิดที่Collector
- ข้อยกเว้น: loaned cradle ไม่ให้ผล; ผู้ตายคืนprincipalเพื่อscoreไม่รับโบนัส; ไม่มีของคืนจริงก็0; ไม่สร้าง contract stats ซ้ำ

### E32

held · 0 พลัง · เขาส่งสัญญาณ

- ตัวเลข: {"extraChoices":1,"familyCap":2}
- สูตร: เพิ่ม min(2,floor(S)) candidates จาก count ของ Beast tier จริง
- เกิดเมื่อ: เริ่มใช้สกิล Beast หลังผ่าน cooldown/cost/target guards
- สิทธิ์/เพดาน: สร้าง candidate list1ครั้ง/abilityUseId; rerender/reconnectไม่สุ่มใหม่; ไม่เพิ่มจำนวนเลือก/จำนวนรับ
- ข้อยกเว้น: ไม่ใช้กับ Alien/Swarm/Collector/Spirit ไม่เพิ่ม tier; เลือก1ชิ้นและแลกของตามกฎเดิม; E25ใช้เฉพาะcreationเดียวกัน

### E36

active · 1 พลัง · อานข้ามรอยแยก

- ตัวเลข: {"openedPortals":1,"binary":true,"perEncounter":1}
- สูตร: S>=1 เปิด event-closed portal ที่เลือก1บาน
- เกิดเมื่อ: PORTALS ไม่มี eventค้าง/ยังไม่เลือก และ closure provenance cause=resolved-event
- สิทธิ์/เพดาน: เปิดเฉพาะ disabled flag ของportalปัจจุบัน มี merchantId/portalId/causeEventIdให้เห็น; ไม่ reroll/refreshstock; itemไม่หมด
- ข้อยกเว้น: ไม่เปิด crime/tradeban/statusD07/ห้องปิดโดยระบบ/คนตาย; ถ้าพ่อค้าติดbanยังเลือกไม่ได้; failure/noopไม่คิดพลัง

### E68

held · 0 พลัง · เสื้อคลุมขนอำพัน

- ตัวเลข: {"rotProtection":1,"binary":true,"perEncounter":1}
- สูตร: S>=1 ป้องกัน Dread rot เป้าหมายoriginal1ชิ้น
- เกิดเมื่อ: Dread เลือกrotจริงและมีของที่จะถูกทำลาย ขณะถือmantleก่อนroll
- สิทธิ์/เพดาน: รวมmantle/B07ใช้เพียงแหล่งเดียว เลือกB07ก่อนแล้วจึงmantleถ้าไม่มี; ไม่ reroll target; ไม่ทำลาย mantleแทน
- ข้อยกเว้น: ไม่กันtheft/seizure/payment/expiry/copyretirement; คนตายไม่ใช้; ไม่มีเป้าหมายrotไม่กินสิทธิ์

### E37

held · 0 พลัง · บ่วงเส้นเขี้ยว

- ตัวเลข: {"energyDiscount":1,"familyCap":1,"minimumEnergyCost":1}
- สูตร: ลด min(1,floor(S)) จาก theft start energy แต่ final cost>=1
- เกิดเมื่อ: เริ่ม theft duel ที่ targetถูกกฎหมาย/ฝ่ายยังมีชีวิต/มีพลังจ่าย
- สิทธิ์/เพดาน: หนึ่งส่วนลดทุก theft start ที่จ่ายจริง แต่ repeat victim/cooldownเดิมไม่เปลี่ยน; freeze quoteก่อนstart
- ข้อยกเว้น: ไม่ทำให้ theftเสีย0 ไม่ข้าม forcedRPS/timeout/compensation/crime; no-op/invalid startไม่เสียพลัง

## หลักฐานที่ต้องมีหลังอนุมัติ

- สเปกเท่านั้น: 48exactIDs/6ต่อmerchant/35effects ไม่มีpilotซ้ำ; hashesตรงaudit/pilot approval; primaryeffect/typeตรงcanonical; ครอบ35contractsและ9pendingmeaningครบ; generatedHTML/MD reproducible
- หลังอนุมัติ: failing-first tests ต่อeffect-family/ทุกitemID; raritytiers1/2/3/4/6/8 กับcopy.4; rounding/caps/funding/quotes/knownfacts; no-op/invalid/fakecurse/death และprivateDTOไม่รั่ว
- custody matrix physicalorigin: trade/gift/vault/auction/loan/Alien/copy/seizure/Spirit; no age/charge/origin reset; earlywithdraw/freshdeposit; snapshot/recheck/timeouts/retries/reconnect
- event/encounter/omen predicatesต้องมีcapabilitymappingสำหรับ56จริง ไม่aliasoldkind; sourceownerในauditเป็นจุดเริ่มค้นไม่ใช่runtimeproof; existing66andhistoricalauditsยังreplay
- actualnormal40credit/6life multiplayer flowsครบaffectedfeatures; seedpaired benefit-vs-disabled ต่อ35familiesและ48items (ไม่ใช่แค่ซื้อของได้) พร้อมcashledger/strictreplay; กลุ่ม2/4playersและpolicyfinance/theft/Spiritด้วย
- UI gates/check/test/smoke/visual กับ14approvedbaselinesเมื่อแก้UI และmaincontextcapturefingerprints; ถ้าเปลี่ยนภาพmaterialต้องreviewก่อน baselineใหม่
- full56vsbaseline32gameและtargetedbenefitsบันทึกconfig/seed/revision/policy/coverage; ไม่อ้างreleasebalanceจากstaticmathหรือhomogeneousbotwinshare; ตรวจfinishrequirementsทั้งgoalก่อนประกาศเสร็จ

## ผลตรวจเอกสารเท่านั้น

ตรวจ48IDs/8พ่อค้า/35contracts/9meaning proposals, source hashes, primary/type และ12ตัวอย่าง rarity×copy ได้ ตัวอย่างคณิตศาสตร์ไม่ใช่หลักฐานว่า runtime ทำงานหรือ balance แล้ว

E69 เสนอเพิ่มคะแนน A แบบจำกัดแยกเฉพาะ assets; E40 จำกัดเฉพาะ NPC trust loss; E25 จำกัด creation ของ Beast/Alien; นี่เป็น material rule decisions ที่ต้องอนุมัติก่อนโค้ดตาม AGENTS.md ส่วนค่า pilot8, weights และ baseline เดิมยังตรึงไว้
