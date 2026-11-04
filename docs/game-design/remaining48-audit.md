# Remaining48 — factual integration audit

New56 only. Compiled membership verifies56registered; verified primary21, pending35; owner references locate existing primitives only and DO NOT claim proposed causal bindings or lifecycle support. This audit does not itself change runtime/config/art/weights.

Current registered: **56 /56**. Verified primary: **21 /56**; pending primary: **35**. This table covers the48 approved additions, six per merchant. Approved numeric specs: **48**. See [approved package](proposals/remaining48-experimental-v1.html) and [receipt](remaining48-approval.json); numeric data is not a runtime binding.

## Meaning decisions

### MEANING-CHALLENGE
settleChallenge compares claim with actual truth. It has no random win roll; CHALLENGE_PCT changes payment, not the chance of truth.
Meaning and exact experimental numbers approved by the full48 receipt; runtime remains unbound.
Approved meaning: เพิ่มส่วนลดเมื่อท้าทายคำระบุเท็จถูกต้อง; full numeric package approval: true.

### SCOPE-RARITY
ensureItemAppearance rolls once and scales base/ask/reservation once. Stock, ability choices, copies, Collector and Spirit delivery have different ownership/privacy paths.
Meaning and exact experimental numbers approved by the full48 receipt; runtime remains unbound.
Approved meaning: เฉพาะ new candidate ที่สร้างให้เจ้าของจากสกิล Beast/Alien หลังยืนยันการใช้สกิล โดยถือก่อนสร้าง · หลัง rarity base roll ที่ยังไม่ finalize: โอกาส min(1500,500*S)/10000 ขยับขึ้น1 tier ที่มี weight>0ใน profile · ไม่ใช้กับ stock portals, reroll portals, Collector, Spirit, Swarm copies, existingitems, polish/reveal; ไม่แตะ truth; ไม่สร้าง tier ที่ config ปิด; full numeric package approval: true.

### MEANING-SWARM
Swarm currently makes one copy per origin at25/35/50% from actual trust tier; separate cooldown and once-per-encounter guards apply.
Meaning and exact experimental numbers approved by the full48 receipt; runtime remains unbound.
Approved meaning: ใช้สกิล Swarm สร้าง copy ใหม่ที่มีสิทธิ์ ขณะถือก่อนใช้ · copy valuePercent ของ Swarm จาก25/35/50 เพิ่ม min(10,floor(5*S)) points ตาม trust tier จริง · ราคาคัดลอกคำนวณครั้งเดียวหลัง bonus ไม่คืนเงิน/เพิ่มค่าของcopyที่มีแล้ว; ไม่ให้ trust tier ที่ยังไม่ปลดล็อก; full numeric package approval: true.

### VISIBILITY-PORTAL
Portals and their stock already exist before selection; their public hint does not reveal all hidden item facts.
Meaning and exact experimental numbers approved by the full48 receipt; runtime remains unbound.
Approved meaning: PORTALS ก่อนเลือก ไม่มี unresolved event; ผู้เล่นเลือกเป้าหมายจากประตูจริง · S>=1 เปิด kind ของ stock slot2 ที่มีอยู่จริงของ portal ที่เลือก1บาน · ไม่แสดง base/ask/truth/curse/rarity หรือของคนอื่น; ไม่สร้าง stock ใหม่; ถ้ารู้แล้วหรือไม่มี slot2 ไม่คิดพลัง; full numeric package approval: true.

### CAUSE-PORTAL
Portal disabled state and merchant trade bans are distinct runtime constraints.
Meaning and exact experimental numbers approved by the full48 receipt; runtime remains unbound.
Approved meaning: PORTALS ไม่มี eventค้าง/ยังไม่เลือก และ closure provenance cause=resolved-event · S>=1 เปิด event-closed portal ที่เลือก1บาน · ไม่เปิด crime/tradeban/statusD07/ห้องปิดโดยระบบ/คนตาย; ถ้าพ่อค้าติดbanยังเลือกไม่ได้; failure/noopไม่คิดพลัง; full numeric package approval: true.

### TARGET-DEFEAT
PvP and merchant duel defeats have different consequences, including seals, cooldown, crime and possible resource loss.
Meaning and exact experimental numbers approved by the full48 receipt; runtime remains unbound.
Approved meaning: แพ้การขโมยจากพ่อค้าเท่านั้น ขณะถือ sentry ก่อนเริ่มดวล · S>=1 ลด trust loss ของ NPC-theft defeat จาก2เหลือ1 (หาก trust เหลือน้อยลดได้ตามจริง) · ไม่ลดโทษ PvP/compensation/seal/ban/D21 ไม่ยกเลิก duel; นี่คือข้อเสนอจำกัดความหมายใหม่ที่ต้องอนุมัติ; full numeric package approval: true.

### SCOPE-ALIEN-RETURN
Alien returns original loaned goods plus credits and energy per actual returned item; principal return at Collector is different from successful meeting reward.
Meaning and exact experimental numbers approved by the full48 receipt; runtime remains unbound.
Approved meaning: รับของเดิมคืนจาก Alien เมื่อครบ due และพบ Alien จริง ผู้ถือ cradle เดิมตลอด signedAt..return · min(3,floor(S)*actualReturnedOriginalCount,remainingRunCap6) credits เพิ่ม · loaned cradle ไม่ให้ผล; ผู้ตายคืนprincipalเพื่อscoreไม่รับโบนัส; ไม่มีของคืนจริงก็0; ไม่สร้าง contract stats ซ้ำ; full numeric package approval: true.

### SCOPE-COLLECTOR
Approved personal scoring applies B10/D10 to assets plus ordinary accomplishments, while itemScoreValue is an asset valuation primitive.
Meaning and exact experimental numbers approved by the full48 receipt; runtime remains unbound.
Approved meaning: Collector final settlement สำหรับคนมีชีวิตหลังคืน principal และปิดหนี้แล้ว · bonus=min(20,floor(eligibleOriginalItemAssetSum * min(1000,200*S)/10000)); บวกเฉพาะ A ก่อน B10/D10 ตามสูตรเดิม · ไม่ alias B10 ไม่คูณ P/G; แสดง asset bonus แยก; ต้องอนุมัติเป็นกฎคะแนนใหม่ในชุดนี้ ไม่แก้ approved weights JSON; full numeric package approval: true.

### ALLOWLIST-REMOVE
Status removal is separate from crime records, loan/Spirit/NPC contracts, cooldowns and Collector eligibility.
Meaning and exact experimental numbers approved by the full48 receipt; runtime remains unbound.
Approved meaning: allowlist D01,D02,D05,D06,D19,D20,D22,D23 เท่านั้น มีผลอนาคตยังค้าง · S>=1 ลบ active debuff instance ที่เลือก1อย่าง · ห้ามD03/D07/D08/D09/D10/D21/D24 และห้ามลบ crime/loan/seal/contract/cooldown; ไม่คืนพลัง/HP/เงินหรือเปิดประตูย้อนหลัง; full numeric package approval: true.

### ALLOWLIST-EXTEND
Statuses have starts/expires/charges; changing expiry, magnitude and charges are different mechanisms.
Meaning and exact experimental numbers approved by the full48 receipt; runtime remains unbound.
Approved meaning: เลือก active finite-expiry buff instance ใน allowlist B03,B05,B11,B14,B16 ที่ยังไม่ใช้หมด · S>=1 ขยาย expiresAt +1 ช่วง ไม่เพิ่ม charges/magnitude · exclude B10/คะแนน/อายุไม่มีที่สิ้นสุด/triggerต้นช่วง/สัญญา/Collector/Spirit/expiryที่หมดแล้ว; สำเนาสืบสถานะขยายของ buff ไม่เริ่มใหม่; full numeric package approval: true.

## Per-item investigation table

| Merchant | New item | Proposed primary | Existing owner(s), not binding | Missing specification / boundary |
|---|---|---|---|---|
| orc | ดาบสาบานเผ่า (orc-oath-sword) | E28 / L10: พบพ่อค้ารายใหม่แล้วได้ความไว้ใจเพิ่ม | [remainingMeet](../../apps/comic/src/game/appraisal/remaining48-effects.ts:40), [applyAppraisalAction](../../apps/comic/src/game/appraisal/engine.ts:343), [setPersonalTrust](../../apps/comic/src/game/appraisal/personal-scoring.ts:181) | Actual positive trust at a specified first merchant meeting; record clamped gain, not requested gain. |
| orc | สนับแข้งรากเหล็ก (orc-ironroot-greaves) | E61 / L23: ฟื้นพลังเมื่อเริ่มช่วง | [advanceAppraisalEncounter](../../apps/comic/src/game/appraisal/engine.ts:443), [remainingBoundaryEnergy](../../apps/comic/src/game/appraisal/remaining48-effects.ts:49), [recover](../../apps/comic/src/game/appraisal/mechanics.ts:129) | Start-of-encounter alive/actual custody, apply after entry cost; cap by real missing energy, no retroactive purchase/re-entry gain. |
| orc | ยาทาเถ้าร้อน (orc-ember-salve) | E63 / L24: ลดราคาดีลฟื้นพลังหรือชีวิต | [recoveryOffer](../../apps/comic/src/game/appraisal/mechanics.ts:153), [remainingRecoveryPrice](../../apps/comic/src/game/appraisal/remaining48-effects.ts:56), [remainingUseRecovery](../../apps/comic/src/game/appraisal/remaining48-effects.ts:73) | Known payable recovery quote, real missing resource, minimum credit price and consumed-use policy explicit. |
| orc | กลองศึกกระดูก (orc-bone-war-drum) | E16 / L06: ซื้อขายกับคู่ค้ารายใหม่แล้วคืนพลัง | [respond](../../apps/comic/src/game/appraisal/engine.ts:294), [transfer](../../apps/comic/src/game/appraisal/mechanics.ts:119) | Only completed paid trade with a qualifying new partner; prevent A↔B cycling, zero-price and barter farming. |
| orc | ลูกปัดนับชัย (orc-tally-beads) | E13 / L05: เพิ่มค่านายหน้า | [commissionRate](../../apps/comic/src/game/appraisal/passives.ts:63), [respond](../../apps/comic/src/game/appraisal/engine.ts:294) | Actual settled commission only, original source/item/participant dedup, explicit funding; not arbitrary gifts. |
| orc | คีมตีเหล็กเผ่า (orc-clan-forge-tongs) | E07 / L03: เพิ่มโอกาสชำระสำเร็จ | [quote](../../apps/comic/src/game/appraisal/cleanse.ts:14), [cleanseChance](../../apps/comic/src/game/appraisal/cleanse-rules.ts:32) | Use real cleanse quote/chance/cap; specify spent tool only on accepted attempt. |
| vampire | เสื้อคลุมหมอก (vampire-mist-cloak) | E42 / L14: รับเงินประกันบางส่วนเมื่อของถูกขโมยจริง | [chooseTheftHand](../../apps/comic/src/game/appraisal/theft.ts:257) | Real stolen-item custody change only; no payment on cancelled duel, no same-origin insurance farm, define funding. |
| vampire | ขวดรินไวน์เงา (vampire-shadow-wine-decanter) | E58 / L22: ลดค่าชีวิตสัญญาเลือด Vampire | [payLife](../../apps/comic/src/game/appraisal/npc-events.ts:75), [personalNpcOffer](../../apps/comic/src/game/appraisal/npc-events.ts:38) | Exact quoted HP payment; minimum/age rules explicit, no free blood contract, count actual HP lost after discount. |
| vampire | ไวโอลินสนธยา (vampire-gloam-violin) | E11 / L04: เพิ่มโอกาสพ่อค้ายอมรับราคา | [appraise](../../apps/comic/src/game/appraisal/mechanics.ts:267), [remainingHeldBonus](../../apps/comic/src/game/appraisal/remaining48-effects.ts:37) | Existing native E11 is an analogy, not approval for these two new rows. Preserve overvalue/backlash and95% cap. |
| vampire | เครื่องพ่นละอองหมอก (vampire-mist-atomizer) | E06 / L02: ลดโทษจากการท้าทายพลาด | [settleChallenge](../../apps/comic/src/game/appraisal/challenge.ts:15), [remainingChallengePenalty](../../apps/comic/src/game/appraisal/remaining48-effects.ts:25) | Penalty reduction after actual failed challenge; no invented success and no duplicate void/copy refunds. |
| vampire | บัตรเชิญเที่ยงคืน (vampire-midnight-invitation) | E22 / L08: ชนะแล้วได้เงินคืนบางส่วน | [settleAuction](../../apps/comic/src/game/appraisal/brokerage.ts:211) | Rebate only actual settled winning bid, not escrow refund/loss/cancel; explicit bank budget. |
| vampire | ดาบจันทร์แหว่ง (vampire-mooncut-sword) | E38 / L13: ได้เปรียบเมื่อเป่ายิ้งฉุบเสมอหนึ่งครั้ง | [breakTie](../../apps/comic/src/game/appraisal/theft.ts:232) | Public pre-duel bounded tie advantage; do not leak hidden opponent guard or multiply binary rights by rarity. |
| autometa | เครื่องยิงขดลวด (autometa-coil-repeater) | E05 / L02: เพิ่มส่วนลดเมื่อท้าทายคำระบุเท็จถูกต้อง | [settleChallenge](../../apps/comic/src/game/appraisal/challenge.ts:15), [remainingChallengeBps](../../apps/comic/src/game/appraisal/remaining48-effects.ts:19) | Choose a truth-preserving benefit rather than adding an invented random success roll. |
| autometa | ยามกลไกไขลาน (autometa-clockwork-sentry) | E40 / L14: บรรเทาผลเสียเมื่อแพ้ดวลหนึ่งครั้ง | [playerFailure](../../apps/comic/src/game/appraisal/theft.ts:211), [merchantFailure](../../apps/comic/src/game/appraisal/theft.ts:242) | Name the reduced consequence; cannot infer all penalties are interchangeable. |
| autometa | ปริซึมบันทึกข้อมูล (autometa-data-prism) | E02 / L01: เปิดเผยช่วงราคาที่แคบลง | [inspect](../../apps/comic/src/game/appraisal/mechanics.ts:222), [remainingPriceRange](../../apps/comic/src/game/appraisal/remaining48-effects.ts:60) | Range must contain scaled truth including copies/replacements; no extra facet disclosure. |
| autometa | กระป๋องสารหล่อเย็น (autometa-coolant-canister) | E31 / L11: ลดเวลารอของความสามารถที่เลือก | [reduceAbilityCooldown](../../apps/comic/src/game/appraisal/ability-rules.ts:20) | Existing reducer caps half-base cooldown, no same-encounter reuse; transfer/copy must not reset charge. |
| autometa | สัญญาณไฟพับได้ (autometa-folding-beacon) | E35 / L12: ดูเบาะแสสินค้าเพิ่มก่อนเลือกประตู | [generatePortals](../../apps/comic/src/game/appraisal/engine.ts:146), [appraisalViewFor](../../apps/comic/src/game/appraisal/views.ts:51) | Choose exactly which extra clue is public to this player and whether it spends a charge. |
| autometa | สายรัดเซอร์โว (autometa-servo-harness) | E61 / L23: ฟื้นพลังเมื่อเริ่มช่วง | [advanceAppraisalEncounter](../../apps/comic/src/game/appraisal/engine.ts:443), [remainingBoundaryEnergy](../../apps/comic/src/game/appraisal/remaining48-effects.ts:49), [recover](../../apps/comic/src/game/appraisal/mechanics.ts:129) | Start-of-encounter alive/actual custody, apply after entry cost; cap by real missing energy, no retroactive purchase/re-entry gain. |
| alien | ตะเกียงสปอร์ (alien-spore-lantern) | E67 / L26: ลดโอกาสภัย Dread | [dreadNow](../../apps/comic/src/game/appraisal/core2-rules.ts:10), [applyDread](../../apps/comic/src/game/appraisal/core2-rules.ts:16) | Adjust the actual Dread roll once; preserve omen/B23 and shared aggregate cap, no redraw until favorable. |
| alien | ผ้าคลุมเสียงสะท้อน (alien-echoweave-shawl) | E72 / L27: ยืดผลดีที่เลือกหนึ่งอย่าง | [grant](../../apps/comic/src/game/appraisal/mechanics.ts:91) | Explicit extendable allowlist and per-status-instance cap; exclude contracts and Collector reveal rights. |
| alien | แผนที่ดาวเยื่อชีวภาพ (alien-star-chart-membrane) | E25 / L09: เพิ่มโอกาสสร้างสินค้าระดับสูง | [ensureItemAppearance](../../apps/comic/src/game/appraisal/rarity.ts:10), [spawnStockItem](../../apps/comic/src/game/appraisal/engine.ts:128), [makeCandidate](../../apps/comic/src/game/appraisal/merchant-abilities.ts:31) | Specify eligible creator/player, creation moment and exclusions; never reroll existing goods. |
| alien | ฝักเมล็ดเรืองแสง (alien-biobright-seedpod) | E61 / L23: ฟื้นพลังเมื่อเริ่มช่วง | [advanceAppraisalEncounter](../../apps/comic/src/game/appraisal/engine.ts:443), [remainingBoundaryEnergy](../../apps/comic/src/game/appraisal/remaining48-effects.ts:49), [recover](../../apps/comic/src/game/appraisal/mechanics.ts:129) | Start-of-encounter alive/actual custody, apply after entry cost; cap by real missing energy, no retroactive purchase/re-entry gain. |
| alien | หน้าปัดระยะเฟส (alien-phase-dial) | E31 / L11: ลดเวลารอของความสามารถที่เลือก | [reduceAbilityCooldown](../../apps/comic/src/game/appraisal/ability-rules.ts:20) | Existing reducer caps half-base cooldown, no same-encounter reuse; transfer/copy must not reset charge. |
| alien | คทาเคลื่อนเฟส (alien-phase-staff) | E57 / L20: เปลี่ยนสัญญาที่ไม่ต้องการฟรีหนึ่งครั้ง | [wishNew](../../apps/comic/src/game/appraisal/wishlist.ts:51) | NPC wish contract only, preserve budget/slots/expiry; never reroll Collector3+2 delivery or grant extra peeks. |
| darkone | ดาบสุญญะ (darkone-null-sword) | E71 / L27: ลบผลเสียที่เลือกหนึ่งอย่าง | [removeStatus](../../apps/comic/src/game/appraisal/mechanics.ts:41) | Explicit removable status allowlist, one-shot/expiry behavior and no-op cost policy. |
| darkone | คัมภีร์สุญญะ (darkone-null-testament) | E69 / L29: เพิ่มตัวปรับมูลค่าที่ Collector คิด | [itemScoreValue](../../apps/comic/src/game/appraisal/scoring.ts:3), [personalScoreFor](../../apps/comic/src/game/appraisal/personal-scoring.ts:186), [collectRun](../../apps/comic/src/game/appraisal/survival.ts:16) | Choose asset-only scope versus all-score modifier, eligible estates and exact visibility. Do not reuse B10 as an alias accidentally. |
| darkone | โซ่พันธะหนี้ (darkone-debt-chain) | E49 / L18: ผู้กู้คืนครบแล้วรับเงินคืนบางส่วน | [handleLoanAction](../../apps/comic/src/game/appraisal/secure-storage.ts:131) | Aged actually repaid loan only, no cancelled/foreclosed contracts; pair+collateral dedup and explicit refund funding. |
| darkone | กระถางกำยานลางร้าย (darkone-omen-censer) | E67 / L26: ลดโอกาสภัย Dread | [dreadNow](../../apps/comic/src/game/appraisal/core2-rules.ts:10), [applyDread](../../apps/comic/src/game/appraisal/core2-rules.ts:16) | Adjust the actual Dread roll once; preserve omen/B23 and shared aggregate cap, no redraw until favorable. |
| darkone | ตราประทับเถ้าถ่าน (darkone-ash-seal) | E53 / L19: ใช้ตรายึดของแล้วตรวจข้อมูลของนั้นฟรี | [pick](../../apps/comic/src/game/appraisal/seals.ts:138), [inspect](../../apps/comic/src/game/appraisal/mechanics.ts:222) | Free inspection entitlement after authoritative seizure custody; personally checked facet only, no copied/known-fact achievement farm. |
| darkone | ที่ครอบดับเสียง (darkone-silence-snuffer) | E71 / L27: ลบผลเสียที่เลือกหนึ่งอย่าง | [removeStatus](../../apps/comic/src/game/appraisal/mechanics.ts:41) | Explicit removable status allowlist, one-shot/expiry behavior and no-op cost policy. |
| deepsea | ตรีศูลห้วงลึก (deepsea-abyss-trident) | E07 / L03: เพิ่มโอกาสชำระสำเร็จ | [quote](../../apps/comic/src/game/appraisal/cleanse.ts:14), [cleanseChance](../../apps/comic/src/game/appraisal/cleanse-rules.ts:32) | Use real cleanse quote/chance/cap; specify spent tool only on accepted attempt. |
| deepsea | เกราะแรงดันใต้ทะเล (deepsea-pressure-cuirass) | E62 / L24: ลดความเสียหายชีวิตครั้งถัดไป | [damageLife](../../apps/comic/src/game/appraisal/mechanics.ts:141) | Distinguish new armor from approved active shield; no automatic shield alias, no refund of quoted HP payment or revival of an already-dead player. |
| deepsea | อานสาหร่าย (deepsea-kelp-saddle) | E16 / L06: ซื้อขายกับคู่ค้ารายใหม่แล้วคืนพลัง | [respond](../../apps/comic/src/game/appraisal/engine.ts:294), [transfer](../../apps/comic/src/game/appraisal/mechanics.ts:119) | Only completed paid trade with a qualifying new partner; prevent A↔B cycling, zero-price and barter farming. |
| deepsea | ทุ่นแก้วคลื่น (deepsea-tideglass-buoy) | E46 / L16: เพิ่มดอกเบี้ยของเงินต้นที่ครบช่วง | [payVaultInterest](../../apps/comic/src/game/appraisal/secure-storage.ts:206), [heldInterestRings](../../apps/comic/src/game/appraisal/pilot-effects.ts:26) | 10% base remains aged same principal; new money/early withdrawals cannot earn immediately. Shared bonus cap/physical hold age. |
| deepsea | กรงปลาโคม (deepsea-lanternfish-cage) | E35 / L12: ดูเบาะแสสินค้าเพิ่มก่อนเลือกประตู | [generatePortals](../../apps/comic/src/game/appraisal/engine.ts:146), [appraisalViewFor](../../apps/comic/src/game/appraisal/views.ts:51) | Choose exactly which extra clue is public to this player and whether it spends a charge. |
| deepsea | แตรสังข์วาฬ (deepsea-whale-conch-horn) | E63 / L24: ลดราคาดีลฟื้นพลังหรือชีวิต | [recoveryOffer](../../apps/comic/src/game/appraisal/mechanics.ts:153), [remainingRecoveryPrice](../../apps/comic/src/game/appraisal/remaining48-effects.ts:56), [remainingUseRecovery](../../apps/comic/src/game/appraisal/remaining48-effects.ts:73) | Known payable recovery quote, real missing resource, minimum credit price and consumed-use policy explicit. |
| swarm | เครื่องพ่นฟีโรโมน (swarm-pheromone-sprayer) | E11 / L04: เพิ่มโอกาสพ่อค้ายอมรับราคา | [appraise](../../apps/comic/src/game/appraisal/mechanics.ts:267), [remainingHeldBonus](../../apps/comic/src/game/appraisal/remaining48-effects.ts:37) | Existing native E11 is an analogy, not approval for these two new rows. Preserve overvalue/backlash and95% cap. |
| swarm | กลุ่มไข่รัง (swarm-hive-egg-cluster) | E33 / L11: เสริมการใช้หนึ่งครั้งตามระดับที่ปลดล็อกแล้ว | [useMerchantAbility](../../apps/comic/src/game/appraisal/merchant-abilities.ts:81) | Define what improves (copy share, copy effect or cooldown) without silently creating a second copy or granting trust tiers. |
| swarm | หลอดม้วนยางไม้ (swarm-resin-spool) | E52 / L19: แลกเปลี่ยนตราสำเร็จแล้วฟื้นพลัง | [respondOffer](../../apps/comic/src/game/appraisal/seals.ts:91) | Successful paid seal exchange only; prevent the same seal cycling for energy; do not treat offered/cancelled as success. |
| swarm | เครื่องร่อนเยื่อปีก (swarm-wing-membrane-glider) | E34 / L12: ลดพลังเปลี่ยนประตู | [rerollPortal](../../apps/comic/src/game/appraisal/engine.ts:156), [pilotRerollCost](../../apps/comic/src/game/appraisal/pilot-effects.ts:16) | Existing native E34 cost analogy; retain escalating reroll cost/minimum, no free infinite rerolls. |
| swarm | แท่นรองดักแด้ (swarm-pupa-cradle) | E59 / L22: เพิ่มผลตอบแทนของที่ให้ Alien ยืม | [redeemNpcContracts](../../apps/comic/src/game/appraisal/npc-events.ts:132) | Choose credits versus energy, funding/reservation and same-instance age requirements. |
| swarm | เกราะไคติน (swarm-chitin-cuirass) | E62 / L24: ลดความเสียหายชีวิตครั้งถัดไป | [damageLife](../../apps/comic/src/game/appraisal/mechanics.ts:141) | Distinguish new armor from approved active shield; no automatic shield alias, no refund of quoted HP payment or revival of an already-dead player. |
| beast | แผ่นกลิ่นสะกดรอย (beast-trail-scent-disc) | E25 / L09: เพิ่มโอกาสสร้างสินค้าระดับสูง | [ensureItemAppearance](../../apps/comic/src/game/appraisal/rarity.ts:10), [spawnStockItem](../../apps/comic/src/game/appraisal/engine.ts:128), [makeCandidate](../../apps/comic/src/game/appraisal/merchant-abilities.ts:31) | Specify eligible creator/player, creation moment and exclusions; never reroll existing goods. |
| beast | เขาส่งสัญญาณ (beast-tracker-horn) | E32 / L11: เพิ่มตัวเลือกเมื่อใช้ความสามารถเลือกสินค้า | [useMerchantAbility](../../apps/comic/src/game/appraisal/merchant-abilities.ts:81) | Add choices before generation, respect actual unlocked tier, no repeated paid selection or free item. |
| beast | อานข้ามรอยแยก (beast-rift-saddle) | E36 / L12: เปิดประตูที่ถูกปิดจากเหตุการณ์หนึ่งครั้ง | [rerollPortal](../../apps/comic/src/game/appraisal/engine.ts:156), [applyAppraisalAction](../../apps/comic/src/game/appraisal/engine.ts:343) | Define eligible closure causes and provenance; do not clear a trade ban or bypass a pending event. |
| beast | กับดักกรามดีด (beast-springjaw-trap) | E53 / L19: ใช้ตรายึดของแล้วตรวจข้อมูลของนั้นฟรี | [pick](../../apps/comic/src/game/appraisal/seals.ts:138), [inspect](../../apps/comic/src/game/appraisal/mechanics.ts:222) | Free inspection entitlement after authoritative seizure custody; personally checked facet only, no copied/known-fact achievement farm. |
| beast | เสื้อคลุมขนอำพัน (beast-amber-fur-mantle) | E68 / L26: คุ้มครองของจากการผุพังหนึ่งครั้ง | [applyDread](../../apps/comic/src/game/appraisal/core2-rules.ts:16) | Guard actual Dread rot once, not theft/seal seizure/quoted payment; retired/transferred item cannot protect retroactively. |
| beast | บ่วงเส้นเขี้ยว (beast-fangline-lasso) | E37 / L13: ลดพลังเริ่มขโมย | [startTheftDuel](../../apps/comic/src/game/appraisal/theft.ts:131) | Forced duel cannot be refused; preserve legal target and mandatory timeout hand behavior. |

## Gates before runtime

- Approved1551908 personal scoring weights/formula remain frozen; items do not receive leader awards automatically.
- Forced theft RPS cannot be refused; privacy and missing-hand timeout rules remain.
- Same-principal aged10% base interest, fresh-first partial withdrawals and held-instance bonus age remain.
- Collector3+2 paid blind delivery and1affordablepeek remain; NPC wishlist is a separate feature.
- Spirit work bonuses remain1credit1point and paid on delivery only; dead ordinary actions do not resume.
- New catalog is versioned; do not alias IDs to old kinds, regenerate art, flip default or rewrite old audits.

Approved48 anchors/contracts are referenced from the frozen package. Still implement owner hooks, charge/age/custody/funding/truth/death handling, UI and public-command benefit/replay evidence; registration or document data does not prove these. Do not generate more art.

Regenerate after building Comic server: `node docs/game-design/scripts/audit-remaining48.mjs`. `--check` verifies source/compiled pins, IDs, counts and full source-owner resolution; it does not prove gameplay or balance.
