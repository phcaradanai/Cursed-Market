# ระบบเดิม 33 กลุ่ม → หลักฐาน runtime และข้อเสนอสินค้าใหม่

การจัดหมวดเป็น editorial classification ไม่ใช่ dedicated item binding; ศูนย์หมายถึงยังไม่จัดหลักฐานตรงในหมวดนี้ ไม่ยืนยันว่าไม่มี runtime

## logic:L01 ตรวจและประเมินราคา

เปิดมูลค่า/ช่วงราคา สิทธิ์ตรวจและการประเมิน

- code:apps/comic/src/game/appraisal/mechanics.ts:check ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":24,"endLine":26})
- code:apps/comic/src/game/appraisal/mechanics.ts:player ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":27,"endLine":30})
- code:apps/comic/src/game/appraisal/mechanics.ts:trace ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":31,"endLine":33})
- code:apps/comic/src/game/appraisal/mechanics.ts:status ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":34,"endLine":34})
- code:apps/comic/src/game/appraisal/mechanics.ts:consumeStatus ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":35,"endLine":37})
- code:apps/comic/src/game/appraisal/mechanics.ts:removeStatus ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":38,"endLine":38})
- code:apps/comic/src/game/appraisal/mechanics.ts:maxEnergyOf ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":40,"endLine":42})
- code:apps/comic/src/game/appraisal/mechanics.ts:maxLifeOf ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":43,"endLine":45})
- code:apps/comic/src/game/appraisal/mechanics.ts:wishSlotsOf ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":46,"endLine":46})
- code:apps/comic/src/game/appraisal/mechanics.ts:enforceCaps ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":48,"endLine":53})
- code:apps/comic/src/game/appraisal/mechanics.ts:stockBonus ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":55,"endLine":62})
- code:apps/comic/src/game/appraisal/mechanics.ts:omenNow ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":64,"endLine":64})
- code:apps/comic/src/game/appraisal/mechanics.ts:salePercent ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":69,"endLine":72})
- code:apps/comic/src/game/appraisal/mechanics.ts:saleAdjusted ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":73,"endLine":73})
- code:apps/comic/src/game/appraisal/mechanics.ts:salePreview ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":75,"endLine":75})
- code:apps/comic/src/game/appraisal/mechanics.ts:saleApply ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":77,"endLine":81})
- code:apps/comic/src/game/appraisal/mechanics.ts:feeSurcharge ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":83,"endLine":83})
- code:apps/comic/src/game/appraisal/mechanics.ts:grant ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":84,"endLine":98})
- code:apps/comic/src/game/appraisal/mechanics.ts:spend ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":99,"endLine":105})
- code:apps/comic/src/game/appraisal/mechanics.ts:reward ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":106,"endLine":111})
- code:apps/comic/src/game/appraisal/mechanics.ts:transfer ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":112,"endLine":116})
- code:apps/comic/src/game/appraisal/mechanics.ts:fundPassive ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":118,"endLine":121})
- code:apps/comic/src/game/appraisal/mechanics.ts:recover ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":122,"endLine":128})
- code:apps/comic/src/game/appraisal/mechanics.ts:healLife ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":129,"endLine":133})
- code:apps/comic/src/game/appraisal/mechanics.ts:damageLife ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":134,"endLine":143})
- code:apps/comic/src/game/appraisal/mechanics.ts:recoveryOffer ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":144,"endLine":155})
- code:apps/comic/src/game/appraisal/mechanics.ts:recoveryAmount ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":157,"endLine":160})
- code:apps/comic/src/game/appraisal/mechanics.ts:mendWithShards ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":162,"endLine":167})
- code:apps/comic/src/game/appraisal/mechanics.ts:gainShards ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":168,"endLine":175})
- code:apps/comic/src/game/appraisal/mechanics.ts:unlocked ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":176,"endLine":178})
- code:apps/comic/src/game/appraisal/mechanics.ts:ownedItem ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":179,"endLine":183})
- code:apps/comic/src/game/appraisal/mechanics.ts:retire ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":184,"endLine":190})
- code:apps/comic/src/game/appraisal/mechanics.ts:wealth ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":191,"endLine":195})
- code:apps/comic/src/game/appraisal/mechanics.ts:stockItem ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":196,"endLine":200})
- code:apps/comic/src/game/appraisal/mechanics.ts:known ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":201,"endLine":203})
- code:apps/comic/src/game/appraisal/mechanics.ts:learn ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":204,"endLine":206})
- code:apps/comic/src/game/appraisal/mechanics.ts:merchantActionFree ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":208,"endLine":211})
- code:apps/comic/src/game/appraisal/mechanics.ts:inspect ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":212,"endLine":248})
- code:apps/comic/src/game/appraisal/mechanics.ts:counterLimit ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":249,"endLine":249})
- code:apps/comic/src/game/appraisal/mechanics.ts:detectionRisk ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":250,"endLine":254})
- code:apps/comic/src/game/appraisal/mechanics.ts:appraise ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":255,"endLine":294})
- code:apps/comic/src/game/appraisal/mechanics.ts:npcQuote ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":295,"endLine":297})
- code:apps/comic/src/game/appraisal/mechanics.ts:completeAppraisedSale ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":299,"endLine":311})
- code:apps/comic/src/game/appraisal/mechanics.ts:payRebate ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":313,"endLine":319})
- code:apps/comic/src/game/appraisal/mechanics.ts:friendAppraised ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":321,"endLine":323})
- code:apps/comic/src/game/appraisal/mechanics.ts:inheritKnowledge ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":325,"endLine":334})
- code:apps/comic/src/game/appraisal/mechanics.ts:noteRepeatBuy ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":336,"endLine":346})
- code:apps/comic/src/game/appraisal/mechanics.ts:noteScrap ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":348,"endLine":361})
- code:apps/comic/src/game/appraisal/mechanics.ts:purchaseModifiers ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":362,"endLine":364})
- code:apps/comic/src/game/appraisal/mechanics.ts:purchase ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":365,"endLine":405})
- code:apps/comic/src/game/appraisal/mechanics.ts:activate ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":406,"endLine":470})
- code:apps/comic/src/game/appraisal/mechanics.ts:activationNote ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":472,"endLine":483})
- code:apps/comic/src/game/appraisal/mechanics.ts:penaltyItem ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":484,"endLine":488})
- code:apps/comic/src/game/appraisal/mechanics.ts:kill ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":489,"endLine":493})
- code:apps/comic/src/game/appraisal/mechanics.ts:marketSell ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":494,"endLine":539})
- code:apps/comic/src/game/appraisal/mechanics.ts:inspect ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":212,"endLine":248})
- code:apps/comic/src/game/appraisal/price-integrity.ts:auditItemPrice ({"file":"apps/comic/src/game/appraisal/price-integrity.ts","line":14,"endLine":23})

## logic:L02 ความแท้และท้าทาย

ตรวจความแท้ ท้าทายคำระบุ และผลพลาด

- code:apps/comic/src/game/appraisal/challenge.ts:settleChallenge ({"file":"apps/comic/src/game/appraisal/challenge.ts","line":13,"endLine":33})
- code:apps/comic/src/game/appraisal/mechanics.ts:check ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":24,"endLine":26})
- code:apps/comic/src/game/appraisal/mechanics.ts:player ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":27,"endLine":30})
- code:apps/comic/src/game/appraisal/mechanics.ts:trace ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":31,"endLine":33})
- code:apps/comic/src/game/appraisal/mechanics.ts:status ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":34,"endLine":34})
- code:apps/comic/src/game/appraisal/mechanics.ts:consumeStatus ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":35,"endLine":37})
- code:apps/comic/src/game/appraisal/mechanics.ts:removeStatus ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":38,"endLine":38})
- code:apps/comic/src/game/appraisal/mechanics.ts:maxEnergyOf ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":40,"endLine":42})
- code:apps/comic/src/game/appraisal/mechanics.ts:maxLifeOf ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":43,"endLine":45})
- code:apps/comic/src/game/appraisal/mechanics.ts:wishSlotsOf ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":46,"endLine":46})
- code:apps/comic/src/game/appraisal/mechanics.ts:enforceCaps ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":48,"endLine":53})
- code:apps/comic/src/game/appraisal/mechanics.ts:stockBonus ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":55,"endLine":62})
- code:apps/comic/src/game/appraisal/mechanics.ts:omenNow ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":64,"endLine":64})
- code:apps/comic/src/game/appraisal/mechanics.ts:salePercent ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":69,"endLine":72})
- code:apps/comic/src/game/appraisal/mechanics.ts:saleAdjusted ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":73,"endLine":73})
- code:apps/comic/src/game/appraisal/mechanics.ts:salePreview ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":75,"endLine":75})
- code:apps/comic/src/game/appraisal/mechanics.ts:saleApply ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":77,"endLine":81})
- code:apps/comic/src/game/appraisal/mechanics.ts:feeSurcharge ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":83,"endLine":83})
- code:apps/comic/src/game/appraisal/mechanics.ts:grant ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":84,"endLine":98})
- code:apps/comic/src/game/appraisal/mechanics.ts:spend ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":99,"endLine":105})
- code:apps/comic/src/game/appraisal/mechanics.ts:reward ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":106,"endLine":111})
- code:apps/comic/src/game/appraisal/mechanics.ts:transfer ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":112,"endLine":116})
- code:apps/comic/src/game/appraisal/mechanics.ts:fundPassive ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":118,"endLine":121})
- code:apps/comic/src/game/appraisal/mechanics.ts:recover ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":122,"endLine":128})
- code:apps/comic/src/game/appraisal/mechanics.ts:healLife ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":129,"endLine":133})
- code:apps/comic/src/game/appraisal/mechanics.ts:damageLife ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":134,"endLine":143})
- code:apps/comic/src/game/appraisal/mechanics.ts:recoveryOffer ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":144,"endLine":155})
- code:apps/comic/src/game/appraisal/mechanics.ts:recoveryAmount ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":157,"endLine":160})
- code:apps/comic/src/game/appraisal/mechanics.ts:mendWithShards ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":162,"endLine":167})
- code:apps/comic/src/game/appraisal/mechanics.ts:gainShards ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":168,"endLine":175})
- code:apps/comic/src/game/appraisal/mechanics.ts:unlocked ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":176,"endLine":178})
- code:apps/comic/src/game/appraisal/mechanics.ts:ownedItem ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":179,"endLine":183})
- code:apps/comic/src/game/appraisal/mechanics.ts:retire ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":184,"endLine":190})
- code:apps/comic/src/game/appraisal/mechanics.ts:wealth ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":191,"endLine":195})
- code:apps/comic/src/game/appraisal/mechanics.ts:stockItem ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":196,"endLine":200})
- code:apps/comic/src/game/appraisal/mechanics.ts:known ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":201,"endLine":203})
- code:apps/comic/src/game/appraisal/mechanics.ts:learn ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":204,"endLine":206})
- code:apps/comic/src/game/appraisal/mechanics.ts:merchantActionFree ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":208,"endLine":211})
- code:apps/comic/src/game/appraisal/mechanics.ts:inspect ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":212,"endLine":248})
- code:apps/comic/src/game/appraisal/mechanics.ts:counterLimit ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":249,"endLine":249})
- code:apps/comic/src/game/appraisal/mechanics.ts:detectionRisk ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":250,"endLine":254})
- code:apps/comic/src/game/appraisal/mechanics.ts:appraise ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":255,"endLine":294})
- code:apps/comic/src/game/appraisal/mechanics.ts:npcQuote ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":295,"endLine":297})
- code:apps/comic/src/game/appraisal/mechanics.ts:completeAppraisedSale ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":299,"endLine":311})
- code:apps/comic/src/game/appraisal/mechanics.ts:payRebate ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":313,"endLine":319})
- code:apps/comic/src/game/appraisal/mechanics.ts:friendAppraised ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":321,"endLine":323})
- code:apps/comic/src/game/appraisal/mechanics.ts:inheritKnowledge ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":325,"endLine":334})
- code:apps/comic/src/game/appraisal/mechanics.ts:noteRepeatBuy ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":336,"endLine":346})
- code:apps/comic/src/game/appraisal/mechanics.ts:noteScrap ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":348,"endLine":361})
- code:apps/comic/src/game/appraisal/mechanics.ts:purchaseModifiers ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":362,"endLine":364})
- code:apps/comic/src/game/appraisal/mechanics.ts:purchase ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":365,"endLine":405})
- code:apps/comic/src/game/appraisal/mechanics.ts:activate ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":406,"endLine":470})
- code:apps/comic/src/game/appraisal/mechanics.ts:activationNote ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":472,"endLine":483})
- code:apps/comic/src/game/appraisal/mechanics.ts:penaltyItem ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":484,"endLine":488})
- code:apps/comic/src/game/appraisal/mechanics.ts:kill ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":489,"endLine":493})
- code:apps/comic/src/game/appraisal/mechanics.ts:marketSell ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":494,"endLine":539})
- code:apps/comic/src/game/appraisal/challenge.ts:settleChallenge ({"file":"apps/comic/src/game/appraisal/challenge.ts","line":13,"endLine":33})

## logic:L03 คำสาปและการชำระ

ตรวจคำสาป ชำระ เครื่องมือและความล้มเหลว

- code:apps/comic/src/game/appraisal/cleanse.ts:shopNpc ({"file":"apps/comic/src/game/appraisal/cleanse.ts","line":8,"endLine":10})
- code:apps/comic/src/game/appraisal/cleanse.ts:trustOf ({"file":"apps/comic/src/game/appraisal/cleanse.ts","line":11,"endLine":11})
- code:apps/comic/src/game/appraisal/cleanse.ts:quote ({"file":"apps/comic/src/game/appraisal/cleanse.ts","line":12,"endLine":21})
- code:apps/comic/src/game/appraisal/cleanse.ts:cleanseOffer ({"file":"apps/comic/src/game/appraisal/cleanse.ts","line":23,"endLine":27})
- code:apps/comic/src/game/appraisal/cleanse.ts:cleanseItem ({"file":"apps/comic/src/game/appraisal/cleanse.ts","line":28,"endLine":50})
- code:apps/comic/src/game/appraisal/mechanics.ts:check ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":24,"endLine":26})
- code:apps/comic/src/game/appraisal/mechanics.ts:player ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":27,"endLine":30})
- code:apps/comic/src/game/appraisal/mechanics.ts:trace ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":31,"endLine":33})
- code:apps/comic/src/game/appraisal/mechanics.ts:status ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":34,"endLine":34})
- code:apps/comic/src/game/appraisal/mechanics.ts:consumeStatus ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":35,"endLine":37})
- code:apps/comic/src/game/appraisal/mechanics.ts:removeStatus ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":38,"endLine":38})
- code:apps/comic/src/game/appraisal/mechanics.ts:maxEnergyOf ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":40,"endLine":42})
- code:apps/comic/src/game/appraisal/mechanics.ts:maxLifeOf ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":43,"endLine":45})
- code:apps/comic/src/game/appraisal/mechanics.ts:wishSlotsOf ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":46,"endLine":46})
- code:apps/comic/src/game/appraisal/mechanics.ts:enforceCaps ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":48,"endLine":53})
- code:apps/comic/src/game/appraisal/mechanics.ts:stockBonus ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":55,"endLine":62})
- code:apps/comic/src/game/appraisal/mechanics.ts:omenNow ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":64,"endLine":64})
- code:apps/comic/src/game/appraisal/mechanics.ts:salePercent ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":69,"endLine":72})
- code:apps/comic/src/game/appraisal/mechanics.ts:saleAdjusted ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":73,"endLine":73})
- code:apps/comic/src/game/appraisal/mechanics.ts:salePreview ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":75,"endLine":75})
- code:apps/comic/src/game/appraisal/mechanics.ts:saleApply ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":77,"endLine":81})
- code:apps/comic/src/game/appraisal/mechanics.ts:feeSurcharge ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":83,"endLine":83})
- code:apps/comic/src/game/appraisal/mechanics.ts:grant ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":84,"endLine":98})
- code:apps/comic/src/game/appraisal/mechanics.ts:spend ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":99,"endLine":105})
- code:apps/comic/src/game/appraisal/mechanics.ts:reward ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":106,"endLine":111})
- code:apps/comic/src/game/appraisal/mechanics.ts:transfer ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":112,"endLine":116})
- code:apps/comic/src/game/appraisal/mechanics.ts:fundPassive ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":118,"endLine":121})
- code:apps/comic/src/game/appraisal/mechanics.ts:recover ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":122,"endLine":128})
- code:apps/comic/src/game/appraisal/mechanics.ts:healLife ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":129,"endLine":133})
- code:apps/comic/src/game/appraisal/mechanics.ts:damageLife ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":134,"endLine":143})
- code:apps/comic/src/game/appraisal/mechanics.ts:recoveryOffer ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":144,"endLine":155})
- code:apps/comic/src/game/appraisal/mechanics.ts:recoveryAmount ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":157,"endLine":160})
- code:apps/comic/src/game/appraisal/mechanics.ts:mendWithShards ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":162,"endLine":167})
- code:apps/comic/src/game/appraisal/mechanics.ts:gainShards ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":168,"endLine":175})
- code:apps/comic/src/game/appraisal/mechanics.ts:unlocked ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":176,"endLine":178})
- code:apps/comic/src/game/appraisal/mechanics.ts:ownedItem ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":179,"endLine":183})
- code:apps/comic/src/game/appraisal/mechanics.ts:retire ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":184,"endLine":190})
- code:apps/comic/src/game/appraisal/mechanics.ts:wealth ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":191,"endLine":195})
- code:apps/comic/src/game/appraisal/mechanics.ts:stockItem ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":196,"endLine":200})
- code:apps/comic/src/game/appraisal/mechanics.ts:known ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":201,"endLine":203})
- code:apps/comic/src/game/appraisal/mechanics.ts:learn ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":204,"endLine":206})
- code:apps/comic/src/game/appraisal/mechanics.ts:merchantActionFree ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":208,"endLine":211})
- code:apps/comic/src/game/appraisal/mechanics.ts:inspect ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":212,"endLine":248})
- code:apps/comic/src/game/appraisal/mechanics.ts:counterLimit ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":249,"endLine":249})
- code:apps/comic/src/game/appraisal/mechanics.ts:detectionRisk ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":250,"endLine":254})
- code:apps/comic/src/game/appraisal/mechanics.ts:appraise ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":255,"endLine":294})
- code:apps/comic/src/game/appraisal/mechanics.ts:npcQuote ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":295,"endLine":297})
- code:apps/comic/src/game/appraisal/mechanics.ts:completeAppraisedSale ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":299,"endLine":311})
- code:apps/comic/src/game/appraisal/mechanics.ts:payRebate ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":313,"endLine":319})
- code:apps/comic/src/game/appraisal/mechanics.ts:friendAppraised ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":321,"endLine":323})
- code:apps/comic/src/game/appraisal/mechanics.ts:inheritKnowledge ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":325,"endLine":334})
- code:apps/comic/src/game/appraisal/mechanics.ts:noteRepeatBuy ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":336,"endLine":346})
- code:apps/comic/src/game/appraisal/mechanics.ts:noteScrap ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":348,"endLine":361})
- code:apps/comic/src/game/appraisal/mechanics.ts:purchaseModifiers ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":362,"endLine":364})
- code:apps/comic/src/game/appraisal/mechanics.ts:purchase ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":365,"endLine":405})
- code:apps/comic/src/game/appraisal/mechanics.ts:activate ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":406,"endLine":470})
- code:apps/comic/src/game/appraisal/mechanics.ts:activationNote ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":472,"endLine":483})
- code:apps/comic/src/game/appraisal/mechanics.ts:penaltyItem ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":484,"endLine":488})
- code:apps/comic/src/game/appraisal/mechanics.ts:kill ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":489,"endLine":493})
- code:apps/comic/src/game/appraisal/mechanics.ts:marketSell ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":494,"endLine":539})
- code:apps/comic/src/game/appraisal/cleanse.ts:cleanseOffer ({"file":"apps/comic/src/game/appraisal/cleanse.ts","line":23,"endLine":27})

## logic:L04 ซื้อและต่อรอง NPC

ส่วนลด โอกาสยอมรับ ราคาและจำนวนการต่อรอง

- code:apps/comic/src/game/appraisal/mechanics.ts:check ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":24,"endLine":26})
- code:apps/comic/src/game/appraisal/mechanics.ts:player ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":27,"endLine":30})
- code:apps/comic/src/game/appraisal/mechanics.ts:trace ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":31,"endLine":33})
- code:apps/comic/src/game/appraisal/mechanics.ts:status ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":34,"endLine":34})
- code:apps/comic/src/game/appraisal/mechanics.ts:consumeStatus ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":35,"endLine":37})
- code:apps/comic/src/game/appraisal/mechanics.ts:removeStatus ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":38,"endLine":38})
- code:apps/comic/src/game/appraisal/mechanics.ts:maxEnergyOf ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":40,"endLine":42})
- code:apps/comic/src/game/appraisal/mechanics.ts:maxLifeOf ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":43,"endLine":45})
- code:apps/comic/src/game/appraisal/mechanics.ts:wishSlotsOf ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":46,"endLine":46})
- code:apps/comic/src/game/appraisal/mechanics.ts:enforceCaps ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":48,"endLine":53})
- code:apps/comic/src/game/appraisal/mechanics.ts:stockBonus ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":55,"endLine":62})
- code:apps/comic/src/game/appraisal/mechanics.ts:omenNow ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":64,"endLine":64})
- code:apps/comic/src/game/appraisal/mechanics.ts:salePercent ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":69,"endLine":72})
- code:apps/comic/src/game/appraisal/mechanics.ts:saleAdjusted ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":73,"endLine":73})
- code:apps/comic/src/game/appraisal/mechanics.ts:salePreview ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":75,"endLine":75})
- code:apps/comic/src/game/appraisal/mechanics.ts:saleApply ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":77,"endLine":81})
- code:apps/comic/src/game/appraisal/mechanics.ts:feeSurcharge ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":83,"endLine":83})
- code:apps/comic/src/game/appraisal/mechanics.ts:grant ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":84,"endLine":98})
- code:apps/comic/src/game/appraisal/mechanics.ts:spend ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":99,"endLine":105})
- code:apps/comic/src/game/appraisal/mechanics.ts:reward ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":106,"endLine":111})
- code:apps/comic/src/game/appraisal/mechanics.ts:transfer ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":112,"endLine":116})
- code:apps/comic/src/game/appraisal/mechanics.ts:fundPassive ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":118,"endLine":121})
- code:apps/comic/src/game/appraisal/mechanics.ts:recover ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":122,"endLine":128})
- code:apps/comic/src/game/appraisal/mechanics.ts:healLife ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":129,"endLine":133})
- code:apps/comic/src/game/appraisal/mechanics.ts:damageLife ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":134,"endLine":143})
- code:apps/comic/src/game/appraisal/mechanics.ts:recoveryOffer ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":144,"endLine":155})
- code:apps/comic/src/game/appraisal/mechanics.ts:recoveryAmount ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":157,"endLine":160})
- code:apps/comic/src/game/appraisal/mechanics.ts:mendWithShards ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":162,"endLine":167})
- code:apps/comic/src/game/appraisal/mechanics.ts:gainShards ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":168,"endLine":175})
- code:apps/comic/src/game/appraisal/mechanics.ts:unlocked ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":176,"endLine":178})
- code:apps/comic/src/game/appraisal/mechanics.ts:ownedItem ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":179,"endLine":183})
- code:apps/comic/src/game/appraisal/mechanics.ts:retire ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":184,"endLine":190})
- code:apps/comic/src/game/appraisal/mechanics.ts:wealth ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":191,"endLine":195})
- code:apps/comic/src/game/appraisal/mechanics.ts:stockItem ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":196,"endLine":200})
- code:apps/comic/src/game/appraisal/mechanics.ts:known ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":201,"endLine":203})
- code:apps/comic/src/game/appraisal/mechanics.ts:learn ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":204,"endLine":206})
- code:apps/comic/src/game/appraisal/mechanics.ts:merchantActionFree ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":208,"endLine":211})
- code:apps/comic/src/game/appraisal/mechanics.ts:inspect ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":212,"endLine":248})
- code:apps/comic/src/game/appraisal/mechanics.ts:counterLimit ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":249,"endLine":249})
- code:apps/comic/src/game/appraisal/mechanics.ts:detectionRisk ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":250,"endLine":254})
- code:apps/comic/src/game/appraisal/mechanics.ts:appraise ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":255,"endLine":294})
- code:apps/comic/src/game/appraisal/mechanics.ts:npcQuote ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":295,"endLine":297})
- code:apps/comic/src/game/appraisal/mechanics.ts:completeAppraisedSale ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":299,"endLine":311})
- code:apps/comic/src/game/appraisal/mechanics.ts:payRebate ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":313,"endLine":319})
- code:apps/comic/src/game/appraisal/mechanics.ts:friendAppraised ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":321,"endLine":323})
- code:apps/comic/src/game/appraisal/mechanics.ts:inheritKnowledge ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":325,"endLine":334})
- code:apps/comic/src/game/appraisal/mechanics.ts:noteRepeatBuy ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":336,"endLine":346})
- code:apps/comic/src/game/appraisal/mechanics.ts:noteScrap ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":348,"endLine":361})
- code:apps/comic/src/game/appraisal/mechanics.ts:purchaseModifiers ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":362,"endLine":364})
- code:apps/comic/src/game/appraisal/mechanics.ts:purchase ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":365,"endLine":405})
- code:apps/comic/src/game/appraisal/mechanics.ts:activate ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":406,"endLine":470})
- code:apps/comic/src/game/appraisal/mechanics.ts:activationNote ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":472,"endLine":483})
- code:apps/comic/src/game/appraisal/mechanics.ts:penaltyItem ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":484,"endLine":488})
- code:apps/comic/src/game/appraisal/mechanics.ts:kill ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":489,"endLine":493})
- code:apps/comic/src/game/appraisal/mechanics.ts:marketSell ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":494,"endLine":539})
- code:apps/comic/src/game/appraisal/market-contracts.ts:trustAcceptanceBonus ({"file":"apps/comic/src/game/appraisal/market-contracts.ts","line":4,"endLine":4})
- code:apps/comic/src/game/appraisal/mechanics.ts:purchase ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":365,"endLine":405})

## logic:L05 ขาย/ค่านายหน้า/ระบาย

ผลจากการขายจริง ค่านายหน้า กำไรและระบายของ

- code:apps/comic/src/game/appraisal/mechanics.ts:salePreview ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":75,"endLine":75})

## logic:L06 ซื้อขายระหว่างผู้เล่น

คู่ค้า การแลกของ ข้อมูลรับรองและการรับข้อเสนอ

- code:apps/comic/src/game/appraisal/engine.ts:propose ({"file":"apps/comic/src/game/appraisal/engine.ts","line":247,"endLine":265})
- code:apps/comic/src/game/appraisal/engine.ts:respond ({"file":"apps/comic/src/game/appraisal/engine.ts","line":285,"endLine":316})

## logic:L07 ตลาดมืดและของค้าง

เงื่อนไขรับซื้อ งบ และการรับคืนของค้าง

- code:apps/comic/src/game/appraisal/market-contracts.ts:TRUST_CAP ({"file":"apps/comic/src/game/appraisal/market-contracts.ts","line":3,"endLine":3})
- code:apps/comic/src/game/appraisal/market-contracts.ts:trustAcceptanceBonus ({"file":"apps/comic/src/game/appraisal/market-contracts.ts","line":4,"endLine":4})
- code:apps/comic/src/game/appraisal/market-contracts.ts:marketOrderReserve ({"file":"apps/comic/src/game/appraisal/market-contracts.ts","line":5,"endLine":5})
- code:apps/comic/src/game/appraisal/market-contracts.ts:marketConditionMatch ({"file":"apps/comic/src/game/appraisal/market-contracts.ts","line":7,"endLine":10})
- code:apps/comic/src/game/appraisal/market-contracts.ts:makeMarketContract ({"file":"apps/comic/src/game/appraisal/market-contracts.ts","line":11,"endLine":22})
- code:apps/comic/src/game/appraisal/engine.ts:makeMarket ({"file":"apps/comic/src/game/appraisal/engine.ts","line":164,"endLine":184})
- code:apps/comic/src/game/appraisal/views.ts:marketView ({"file":"apps/comic/src/game/appraisal/views.ts","line":23,"endLine":26})

## logic:L08 ประมูล

ล็อต การเสนอราคา ผู้ชนะและข้อมูลล็อต

- code:apps/comic/src/game/appraisal/market-contracts.ts:TRUST_CAP ({"file":"apps/comic/src/game/appraisal/market-contracts.ts","line":3,"endLine":3})
- code:apps/comic/src/game/appraisal/market-contracts.ts:trustAcceptanceBonus ({"file":"apps/comic/src/game/appraisal/market-contracts.ts","line":4,"endLine":4})
- code:apps/comic/src/game/appraisal/market-contracts.ts:marketOrderReserve ({"file":"apps/comic/src/game/appraisal/market-contracts.ts","line":5,"endLine":5})
- code:apps/comic/src/game/appraisal/market-contracts.ts:marketConditionMatch ({"file":"apps/comic/src/game/appraisal/market-contracts.ts","line":7,"endLine":10})
- code:apps/comic/src/game/appraisal/market-contracts.ts:makeMarketContract ({"file":"apps/comic/src/game/appraisal/market-contracts.ts","line":11,"endLine":22})

## logic:L09 Rarity

อัตราสร้าง rarity; แยกจากตัวคูณทั่วไปที่สินค้าทุกชิ้นได้รับ

- code:apps/comic/src/shared/rarity-power.ts:rarityPowerFor ({"file":"apps/comic/src/shared/rarity-power.ts","line":21,"endLine":23})
- code:apps/comic/src/shared/rarity-power.ts:rarityValue ({"file":"apps/comic/src/shared/rarity-power.ts","line":28,"endLine":28})
- code:apps/comic/src/shared/rarity-power.ts:rarityEffect ({"file":"apps/comic/src/shared/rarity-power.ts","line":29,"endLine":29})

## logic:L10 ความไว้ใจและสต็อก

ความไว้ใจ โบนัสจำนวนสินค้า และการลดความไว้ใจ

- code:apps/comic/src/game/appraisal/cleanse.ts:trustOf ({"file":"apps/comic/src/game/appraisal/cleanse.ts","line":11,"endLine":11})
- code:apps/comic/src/game/appraisal/core2-actions.ts:trustOf ({"file":"apps/comic/src/game/appraisal/core2-actions.ts","line":16,"endLine":16})
- code:apps/comic/src/game/appraisal/core2-actions.ts:loseTrust ({"file":"apps/comic/src/game/appraisal/core2-actions.ts","line":17,"endLine":19})
- code:apps/comic/src/game/appraisal/mechanics.ts:stockBonus ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":55,"endLine":62})
- code:apps/comic/src/game/appraisal/pulse.ts:extraStock ({"file":"apps/comic/src/game/appraisal/pulse.ts","line":26,"endLine":26})

## logic:L11 ความสามารถพ่อค้า

เวลารอ ระดับที่ปลดล็อกและตัวเลือกของความสามารถ

- code:apps/comic/src/game/appraisal/ability-rules.ts:MERCHANT_ABILITIES ({"file":"apps/comic/src/game/appraisal/ability-rules.ts","line":3,"endLine":12})
- code:apps/comic/src/game/appraisal/ability-rules.ts:abilityTier ({"file":"apps/comic/src/game/appraisal/ability-rules.ts","line":13,"endLine":13})
- code:apps/comic/src/game/appraisal/ability-rules.ts:abilityRemaining ({"file":"apps/comic/src/game/appraisal/ability-rules.ts","line":14,"endLine":14})
- code:apps/comic/src/game/appraisal/ability-rules.ts:reducibleCooldown ({"file":"apps/comic/src/game/appraisal/ability-rules.ts","line":16,"endLine":19})
- code:apps/comic/src/game/appraisal/ability-rules.ts:reduceAbilityCooldown ({"file":"apps/comic/src/game/appraisal/ability-rules.ts","line":20,"endLine":24})
- code:apps/comic/src/game/appraisal/merchant-abilities.ts:merchantAbilityViews ({"file":"apps/comic/src/game/appraisal/merchant-abilities.ts","line":21,"endLine":29})

## logic:L12 ประตูและเส้นทาง

เปลี่ยน/เปิดประตูและเบาะแสก่อนเลือก

- code:apps/comic/src/game/appraisal/engine.ts:generatePortals ({"file":"apps/comic/src/game/appraisal/engine.ts","line":138,"endLine":146})
- code:apps/comic/src/game/appraisal/engine.ts:rerollPortal ({"file":"apps/comic/src/game/appraisal/engine.ts","line":148,"endLine":162})

## logic:L13 ขโมยเชิงรุก RPS

ต้นทุนและความได้เปรียบต้องคงการเข้าร่วมแบบบังคับ

- code:apps/comic/src/game/appraisal/theft.ts:PVP_COOLDOWN_ENCOUNTERS ({"file":"apps/comic/src/game/appraisal/theft.ts","line":81,"endLine":81})
- code:apps/comic/src/game/appraisal/theft.ts:PVP_COMPENSATION_PERCENT ({"file":"apps/comic/src/game/appraisal/theft.ts","line":82,"endLine":82})
- code:apps/comic/src/game/appraisal/theft.ts:PVP_COMPENSATION_INSTALLMENTS ({"file":"apps/comic/src/game/appraisal/theft.ts","line":83,"endLine":83})
- code:apps/comic/src/game/appraisal/theft.ts:pvpBlockedUntil ({"file":"apps/comic/src/game/appraisal/theft.ts","line":84,"endLine":87})
- code:apps/comic/src/game/appraisal/theft.ts:hands ({"file":"apps/comic/src/game/appraisal/theft.ts","line":88,"endLine":88})
- code:apps/comic/src/game/appraisal/theft.ts:npcTells ({"file":"apps/comic/src/game/appraisal/theft.ts","line":89,"endLine":98})
- code:apps/comic/src/game/appraisal/theft.ts:npcTheftTell ({"file":"apps/comic/src/game/appraisal/theft.ts","line":100,"endLine":102})
- code:apps/comic/src/game/appraisal/theft.ts:opponentKey ({"file":"apps/comic/src/game/appraisal/theft.ts","line":103,"endLine":103})
- code:apps/comic/src/game/appraisal/theft.ts:note ({"file":"apps/comic/src/game/appraisal/theft.ts","line":104,"endLine":104})
- code:apps/comic/src/game/appraisal/theft.ts:openDuel ({"file":"apps/comic/src/game/appraisal/theft.ts","line":105,"endLine":105})
- code:apps/comic/src/game/appraisal/theft.ts:eligibleItems ({"file":"apps/comic/src/game/appraisal/theft.ts","line":108,"endLine":114})
- code:apps/comic/src/game/appraisal/theft.ts:npcHand ({"file":"apps/comic/src/game/appraisal/theft.ts","line":116,"endLine":122})
- code:apps/comic/src/game/appraisal/theft.ts:merchantTradeBanned ({"file":"apps/comic/src/game/appraisal/theft.ts","line":124,"endLine":127})
- code:apps/comic/src/game/appraisal/theft.ts:startTheftDuel ({"file":"apps/comic/src/game/appraisal/theft.ts","line":130,"endLine":163})
- code:apps/comic/src/game/appraisal/theft.ts:stillEligible ({"file":"apps/comic/src/game/appraisal/theft.ts","line":165,"endLine":175})
- code:apps/comic/src/game/appraisal/theft.ts:cancelTheftDuels ({"file":"apps/comic/src/game/appraisal/theft.ts","line":178,"endLine":184})
- code:apps/comic/src/game/appraisal/theft.ts:expireTheftDuel ({"file":"apps/comic/src/game/appraisal/theft.ts","line":187,"endLine":207})
- code:apps/comic/src/game/appraisal/theft.ts:playerFailure ({"file":"apps/comic/src/game/appraisal/theft.ts","line":210,"endLine":225})
- code:apps/comic/src/game/appraisal/theft.ts:linkedThiefEdge ({"file":"apps/comic/src/game/appraisal/theft.ts","line":228,"endLine":229})
- code:apps/comic/src/game/appraisal/theft.ts:breakTie ({"file":"apps/comic/src/game/appraisal/theft.ts","line":231,"endLine":239})
- code:apps/comic/src/game/appraisal/theft.ts:merchantFailure ({"file":"apps/comic/src/game/appraisal/theft.ts","line":241,"endLine":254})
- code:apps/comic/src/game/appraisal/theft.ts:chooseTheftHand ({"file":"apps/comic/src/game/appraisal/theft.ts","line":256,"endLine":299})
- code:apps/comic/src/game/appraisal/theft.ts:gone ({"file":"apps/comic/src/game/appraisal/theft.ts","line":301,"endLine":301})
- code:apps/comic/src/game/appraisal/theft.ts:collectCompensations ({"file":"apps/comic/src/game/appraisal/theft.ts","line":306,"endLine":318})
- code:apps/comic/src/game/appraisal/theft.ts:noticePrice ({"file":"apps/comic/src/game/appraisal/theft.ts","line":321,"endLine":321})
- code:apps/comic/src/game/appraisal/theft.ts:clearCrime ({"file":"apps/comic/src/game/appraisal/theft.ts","line":324,"endLine":332})
- code:apps/comic/src/game/appraisal/theft.ts:tieView ({"file":"apps/comic/src/game/appraisal/theft.ts","line":335,"endLine":338})
- code:apps/comic/src/game/appraisal/theft.ts:theftViewFor ({"file":"apps/comic/src/game/appraisal/theft.ts","line":341,"endLine":363})
- code:apps/comic/src/game/appraisal/theft.ts:startTheftDuel ({"file":"apps/comic/src/game/appraisal/theft.ts","line":130,"endLine":163})
- code:apps/comic/src/game/appraisal/theft.ts:chooseTheftHand ({"file":"apps/comic/src/game/appraisal/theft.ts","line":256,"endLine":299})

## logic:L14 บรรเทาผลถูกขโมย

ประกัน/บรรเทาหลังผลดวล ห้ามใช้ปฏิเสธหรือยกเลิก RPS

- code:apps/comic/src/game/appraisal/theft.ts:PVP_COOLDOWN_ENCOUNTERS ({"file":"apps/comic/src/game/appraisal/theft.ts","line":81,"endLine":81})
- code:apps/comic/src/game/appraisal/theft.ts:PVP_COMPENSATION_PERCENT ({"file":"apps/comic/src/game/appraisal/theft.ts","line":82,"endLine":82})
- code:apps/comic/src/game/appraisal/theft.ts:PVP_COMPENSATION_INSTALLMENTS ({"file":"apps/comic/src/game/appraisal/theft.ts","line":83,"endLine":83})
- code:apps/comic/src/game/appraisal/theft.ts:pvpBlockedUntil ({"file":"apps/comic/src/game/appraisal/theft.ts","line":84,"endLine":87})
- code:apps/comic/src/game/appraisal/theft.ts:hands ({"file":"apps/comic/src/game/appraisal/theft.ts","line":88,"endLine":88})
- code:apps/comic/src/game/appraisal/theft.ts:npcTells ({"file":"apps/comic/src/game/appraisal/theft.ts","line":89,"endLine":98})
- code:apps/comic/src/game/appraisal/theft.ts:npcTheftTell ({"file":"apps/comic/src/game/appraisal/theft.ts","line":100,"endLine":102})
- code:apps/comic/src/game/appraisal/theft.ts:opponentKey ({"file":"apps/comic/src/game/appraisal/theft.ts","line":103,"endLine":103})
- code:apps/comic/src/game/appraisal/theft.ts:note ({"file":"apps/comic/src/game/appraisal/theft.ts","line":104,"endLine":104})
- code:apps/comic/src/game/appraisal/theft.ts:openDuel ({"file":"apps/comic/src/game/appraisal/theft.ts","line":105,"endLine":105})
- code:apps/comic/src/game/appraisal/theft.ts:eligibleItems ({"file":"apps/comic/src/game/appraisal/theft.ts","line":108,"endLine":114})
- code:apps/comic/src/game/appraisal/theft.ts:npcHand ({"file":"apps/comic/src/game/appraisal/theft.ts","line":116,"endLine":122})
- code:apps/comic/src/game/appraisal/theft.ts:merchantTradeBanned ({"file":"apps/comic/src/game/appraisal/theft.ts","line":124,"endLine":127})
- code:apps/comic/src/game/appraisal/theft.ts:startTheftDuel ({"file":"apps/comic/src/game/appraisal/theft.ts","line":130,"endLine":163})
- code:apps/comic/src/game/appraisal/theft.ts:stillEligible ({"file":"apps/comic/src/game/appraisal/theft.ts","line":165,"endLine":175})
- code:apps/comic/src/game/appraisal/theft.ts:cancelTheftDuels ({"file":"apps/comic/src/game/appraisal/theft.ts","line":178,"endLine":184})
- code:apps/comic/src/game/appraisal/theft.ts:expireTheftDuel ({"file":"apps/comic/src/game/appraisal/theft.ts","line":187,"endLine":207})
- code:apps/comic/src/game/appraisal/theft.ts:playerFailure ({"file":"apps/comic/src/game/appraisal/theft.ts","line":210,"endLine":225})
- code:apps/comic/src/game/appraisal/theft.ts:linkedThiefEdge ({"file":"apps/comic/src/game/appraisal/theft.ts","line":228,"endLine":229})
- code:apps/comic/src/game/appraisal/theft.ts:breakTie ({"file":"apps/comic/src/game/appraisal/theft.ts","line":231,"endLine":239})
- code:apps/comic/src/game/appraisal/theft.ts:merchantFailure ({"file":"apps/comic/src/game/appraisal/theft.ts","line":241,"endLine":254})
- code:apps/comic/src/game/appraisal/theft.ts:chooseTheftHand ({"file":"apps/comic/src/game/appraisal/theft.ts","line":256,"endLine":299})
- code:apps/comic/src/game/appraisal/theft.ts:gone ({"file":"apps/comic/src/game/appraisal/theft.ts","line":301,"endLine":301})
- code:apps/comic/src/game/appraisal/theft.ts:collectCompensations ({"file":"apps/comic/src/game/appraisal/theft.ts","line":306,"endLine":318})
- code:apps/comic/src/game/appraisal/theft.ts:noticePrice ({"file":"apps/comic/src/game/appraisal/theft.ts","line":321,"endLine":321})
- code:apps/comic/src/game/appraisal/theft.ts:clearCrime ({"file":"apps/comic/src/game/appraisal/theft.ts","line":324,"endLine":332})
- code:apps/comic/src/game/appraisal/theft.ts:tieView ({"file":"apps/comic/src/game/appraisal/theft.ts","line":335,"endLine":338})
- code:apps/comic/src/game/appraisal/theft.ts:theftViewFor ({"file":"apps/comic/src/game/appraisal/theft.ts","line":341,"endLine":363})
- code:apps/comic/src/game/appraisal/core2-actions.ts:stealChance ({"file":"apps/comic/src/game/appraisal/core2-actions.ts","line":21,"endLine":23})

## logic:L15 อาชญากรรมและค่าชดเชย

ประวัติ แบนการค้า ชดเชย และล้างประวัติ

- code:apps/comic/src/game/appraisal/theft.ts:PVP_COOLDOWN_ENCOUNTERS ({"file":"apps/comic/src/game/appraisal/theft.ts","line":81,"endLine":81})
- code:apps/comic/src/game/appraisal/theft.ts:PVP_COMPENSATION_PERCENT ({"file":"apps/comic/src/game/appraisal/theft.ts","line":82,"endLine":82})
- code:apps/comic/src/game/appraisal/theft.ts:PVP_COMPENSATION_INSTALLMENTS ({"file":"apps/comic/src/game/appraisal/theft.ts","line":83,"endLine":83})
- code:apps/comic/src/game/appraisal/theft.ts:pvpBlockedUntil ({"file":"apps/comic/src/game/appraisal/theft.ts","line":84,"endLine":87})
- code:apps/comic/src/game/appraisal/theft.ts:hands ({"file":"apps/comic/src/game/appraisal/theft.ts","line":88,"endLine":88})
- code:apps/comic/src/game/appraisal/theft.ts:npcTells ({"file":"apps/comic/src/game/appraisal/theft.ts","line":89,"endLine":98})
- code:apps/comic/src/game/appraisal/theft.ts:npcTheftTell ({"file":"apps/comic/src/game/appraisal/theft.ts","line":100,"endLine":102})
- code:apps/comic/src/game/appraisal/theft.ts:opponentKey ({"file":"apps/comic/src/game/appraisal/theft.ts","line":103,"endLine":103})
- code:apps/comic/src/game/appraisal/theft.ts:note ({"file":"apps/comic/src/game/appraisal/theft.ts","line":104,"endLine":104})
- code:apps/comic/src/game/appraisal/theft.ts:openDuel ({"file":"apps/comic/src/game/appraisal/theft.ts","line":105,"endLine":105})
- code:apps/comic/src/game/appraisal/theft.ts:eligibleItems ({"file":"apps/comic/src/game/appraisal/theft.ts","line":108,"endLine":114})
- code:apps/comic/src/game/appraisal/theft.ts:npcHand ({"file":"apps/comic/src/game/appraisal/theft.ts","line":116,"endLine":122})
- code:apps/comic/src/game/appraisal/theft.ts:merchantTradeBanned ({"file":"apps/comic/src/game/appraisal/theft.ts","line":124,"endLine":127})
- code:apps/comic/src/game/appraisal/theft.ts:startTheftDuel ({"file":"apps/comic/src/game/appraisal/theft.ts","line":130,"endLine":163})
- code:apps/comic/src/game/appraisal/theft.ts:stillEligible ({"file":"apps/comic/src/game/appraisal/theft.ts","line":165,"endLine":175})
- code:apps/comic/src/game/appraisal/theft.ts:cancelTheftDuels ({"file":"apps/comic/src/game/appraisal/theft.ts","line":178,"endLine":184})
- code:apps/comic/src/game/appraisal/theft.ts:expireTheftDuel ({"file":"apps/comic/src/game/appraisal/theft.ts","line":187,"endLine":207})
- code:apps/comic/src/game/appraisal/theft.ts:playerFailure ({"file":"apps/comic/src/game/appraisal/theft.ts","line":210,"endLine":225})
- code:apps/comic/src/game/appraisal/theft.ts:linkedThiefEdge ({"file":"apps/comic/src/game/appraisal/theft.ts","line":228,"endLine":229})
- code:apps/comic/src/game/appraisal/theft.ts:breakTie ({"file":"apps/comic/src/game/appraisal/theft.ts","line":231,"endLine":239})
- code:apps/comic/src/game/appraisal/theft.ts:merchantFailure ({"file":"apps/comic/src/game/appraisal/theft.ts","line":241,"endLine":254})
- code:apps/comic/src/game/appraisal/theft.ts:chooseTheftHand ({"file":"apps/comic/src/game/appraisal/theft.ts","line":256,"endLine":299})
- code:apps/comic/src/game/appraisal/theft.ts:gone ({"file":"apps/comic/src/game/appraisal/theft.ts","line":301,"endLine":301})
- code:apps/comic/src/game/appraisal/theft.ts:collectCompensations ({"file":"apps/comic/src/game/appraisal/theft.ts","line":306,"endLine":318})
- code:apps/comic/src/game/appraisal/theft.ts:noticePrice ({"file":"apps/comic/src/game/appraisal/theft.ts","line":321,"endLine":321})
- code:apps/comic/src/game/appraisal/theft.ts:clearCrime ({"file":"apps/comic/src/game/appraisal/theft.ts","line":324,"endLine":332})
- code:apps/comic/src/game/appraisal/theft.ts:tieView ({"file":"apps/comic/src/game/appraisal/theft.ts","line":335,"endLine":338})
- code:apps/comic/src/game/appraisal/theft.ts:theftViewFor ({"file":"apps/comic/src/game/appraisal/theft.ts","line":341,"endLine":363})
- code:apps/comic/src/game/appraisal/theft.ts:collectCompensations ({"file":"apps/comic/src/game/appraisal/theft.ts","line":306,"endLine":318})

## logic:L16 ดอกเบี้ยเงินฝาก

นับเฉพาะเงินก้อนเดิมครบช่วง ถอน/เติมใหม่ห้ามรับทันที

- code:apps/comic/src/game/appraisal/secure-storage.ts:VAULT_INTEREST_PERCENT ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":6,"endLine":6})
- code:apps/comic/src/game/appraisal/secure-storage.ts:vaultInterestOf ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":7,"endLine":7})
- code:apps/comic/src/game/appraisal/secure-storage.ts:nextVaultInterest ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":9,"endLine":13})
- code:apps/comic/src/game/appraisal/secure-storage.ts:positive ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":32,"endLine":34})
- code:apps/comic/src/game/appraisal/secure-storage.ts:addable ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":35,"endLine":37})
- code:apps/comic/src/game/appraisal/secure-storage.ts:enabled ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":38,"endLine":41})
- code:apps/comic/src/game/appraisal/secure-storage.ts:afterReward ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":42,"endLine":44})
- code:apps/comic/src/game/appraisal/secure-storage.ts:loanWindow ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":45,"endLine":48})
- code:apps/comic/src/game/appraisal/secure-storage.ts:movable ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":49,"endLine":52})
- code:apps/comic/src/game/appraisal/secure-storage.ts:removeFromHand ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":53,"endLine":56})
- code:apps/comic/src/game/appraisal/secure-storage.ts:quoteVaultExpansion ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":57,"endLine":60})
- code:apps/comic/src/game/appraisal/secure-storage.ts:quoteLoanDeadline ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":62,"endLine":69})
- code:apps/comic/src/game/appraisal/secure-storage.ts:firstPayout ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":70,"endLine":73})
- code:apps/comic/src/game/appraisal/secure-storage.ts:handleStorageAction ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":74,"endLine":106})
- code:apps/comic/src/game/appraisal/secure-storage.ts:loanOf ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":107,"endLine":110})
- code:apps/comic/src/game/appraisal/secure-storage.ts:pending ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":111,"endLine":113})
- code:apps/comic/src/game/appraisal/secure-storage.ts:termsOf ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":114,"endLine":116})
- code:apps/comic/src/game/appraisal/secure-storage.ts:validPrincipal ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":117,"endLine":119})
- code:apps/comic/src/game/appraisal/secure-storage.ts:collateral ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":120,"endLine":124})
- code:apps/comic/src/game/appraisal/secure-storage.ts:returnCollateral ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":125,"endLine":129})
- code:apps/comic/src/game/appraisal/secure-storage.ts:handleLoanAction ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":130,"endLine":177})
- code:apps/comic/src/game/appraisal/secure-storage.ts:settleLoansBeforeAdvance ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":182,"endLine":195})
- code:apps/comic/src/game/appraisal/secure-storage.ts:payVaultInterest ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":200,"endLine":217})
- code:apps/comic/src/game/appraisal/secure-storage.ts:loanViewFor ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":218,"endLine":220})
- code:apps/comic/src/game/appraisal/secure-storage.ts:secureStorageInvariants ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":221,"endLine":240})
- code:apps/comic/src/game/appraisal/secure-storage.ts:ownedAssetItemIds ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":243,"endLine":245})
- code:apps/comic/src/game/appraisal/secure-storage.ts:vaultInterestOf ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":7,"endLine":7})
- code:apps/comic/src/game/appraisal/secure-storage.ts:payVaultInterest ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":200,"endLine":217})

## logic:L17 พื้นที่และการขยาย Vault

ราคาขยายและจำนวนช่อง ไม่รวมดอกเบี้ย

- code:apps/comic/src/game/appraisal/secure-storage.ts:VAULT_INTEREST_PERCENT ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":6,"endLine":6})
- code:apps/comic/src/game/appraisal/secure-storage.ts:vaultInterestOf ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":7,"endLine":7})
- code:apps/comic/src/game/appraisal/secure-storage.ts:nextVaultInterest ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":9,"endLine":13})
- code:apps/comic/src/game/appraisal/secure-storage.ts:positive ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":32,"endLine":34})
- code:apps/comic/src/game/appraisal/secure-storage.ts:addable ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":35,"endLine":37})
- code:apps/comic/src/game/appraisal/secure-storage.ts:enabled ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":38,"endLine":41})
- code:apps/comic/src/game/appraisal/secure-storage.ts:afterReward ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":42,"endLine":44})
- code:apps/comic/src/game/appraisal/secure-storage.ts:loanWindow ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":45,"endLine":48})
- code:apps/comic/src/game/appraisal/secure-storage.ts:movable ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":49,"endLine":52})
- code:apps/comic/src/game/appraisal/secure-storage.ts:removeFromHand ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":53,"endLine":56})
- code:apps/comic/src/game/appraisal/secure-storage.ts:quoteVaultExpansion ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":57,"endLine":60})
- code:apps/comic/src/game/appraisal/secure-storage.ts:quoteLoanDeadline ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":62,"endLine":69})
- code:apps/comic/src/game/appraisal/secure-storage.ts:firstPayout ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":70,"endLine":73})
- code:apps/comic/src/game/appraisal/secure-storage.ts:handleStorageAction ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":74,"endLine":106})
- code:apps/comic/src/game/appraisal/secure-storage.ts:loanOf ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":107,"endLine":110})
- code:apps/comic/src/game/appraisal/secure-storage.ts:pending ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":111,"endLine":113})
- code:apps/comic/src/game/appraisal/secure-storage.ts:termsOf ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":114,"endLine":116})
- code:apps/comic/src/game/appraisal/secure-storage.ts:validPrincipal ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":117,"endLine":119})
- code:apps/comic/src/game/appraisal/secure-storage.ts:collateral ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":120,"endLine":124})
- code:apps/comic/src/game/appraisal/secure-storage.ts:returnCollateral ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":125,"endLine":129})
- code:apps/comic/src/game/appraisal/secure-storage.ts:handleLoanAction ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":130,"endLine":177})
- code:apps/comic/src/game/appraisal/secure-storage.ts:settleLoansBeforeAdvance ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":182,"endLine":195})
- code:apps/comic/src/game/appraisal/secure-storage.ts:payVaultInterest ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":200,"endLine":217})
- code:apps/comic/src/game/appraisal/secure-storage.ts:loanViewFor ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":218,"endLine":220})
- code:apps/comic/src/game/appraisal/secure-storage.ts:secureStorageInvariants ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":221,"endLine":240})
- code:apps/comic/src/game/appraisal/secure-storage.ts:ownedAssetItemIds ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":243,"endLine":245})
- code:apps/comic/src/game/appraisal/secure-storage.ts:quoteVaultExpansion ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":57,"endLine":60})

## logic:L18 เงินกู้มีหลักประกัน

เงินต้น คืนครบ ผลตอบแทนและกำหนดที่ทั้งคู่ยอมรับ

- code:apps/comic/src/game/appraisal/secure-storage.ts:handleLoanAction ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":130,"endLine":177})
- code:apps/comic/src/game/appraisal/secure-storage.ts:settleLoansBeforeAdvance ({"file":"apps/comic/src/game/appraisal/secure-storage.ts","line":182,"endLine":195})

## logic:L19 ตราบาป

แลกตราและใช้ตราคนเดียวกันสองใบยึดของแบบปกปิด

- code:apps/comic/src/game/appraisal/seals.ts:SEALS_PER_REDEMPTION ({"file":"apps/comic/src/game/appraisal/seals.ts","line":7,"endLine":7})
- code:apps/comic/src/game/appraisal/seals.ts:REDEMPTION_CHOICES ({"file":"apps/comic/src/game/appraisal/seals.ts","line":8,"endLine":8})
- code:apps/comic/src/game/appraisal/seals.ts:seals ({"file":"apps/comic/src/game/appraisal/seals.ts","line":49,"endLine":49})
- code:apps/comic/src/game/appraisal/seals.ts:offers ({"file":"apps/comic/src/game/appraisal/seals.ts","line":50,"endLine":50})
- code:apps/comic/src/game/appraisal/seals.ts:redemptions ({"file":"apps/comic/src/game/appraisal/seals.ts","line":51,"endLine":51})
- code:apps/comic/src/game/appraisal/seals.ts:alive ({"file":"apps/comic/src/game/appraisal/seals.ts","line":52,"endLine":52})
- code:apps/comic/src/game/appraisal/seals.ts:text ({"file":"apps/comic/src/game/appraisal/seals.ts","line":53,"endLine":56})
- code:apps/comic/src/game/appraisal/seals.ts:amount ({"file":"apps/comic/src/game/appraisal/seals.ts","line":57,"endLine":57})
- code:apps/comic/src/game/appraisal/seals.ts:lockedSealIds ({"file":"apps/comic/src/game/appraisal/seals.ts","line":59,"endLine":62})
- code:apps/comic/src/game/appraisal/seals.ts:ownSeal ({"file":"apps/comic/src/game/appraisal/seals.ts","line":63,"endLine":68})
- code:apps/comic/src/game/appraisal/seals.ts:moveGoods ({"file":"apps/comic/src/game/appraisal/seals.ts","line":69,"endLine":74})
- code:apps/comic/src/game/appraisal/seals.ts:offerSeal ({"file":"apps/comic/src/game/appraisal/seals.ts","line":76,"endLine":88})
- code:apps/comic/src/game/appraisal/seals.ts:respondOffer ({"file":"apps/comic/src/game/appraisal/seals.ts","line":90,"endLine":115})
- code:apps/comic/src/game/appraisal/seals.ts:redeem ({"file":"apps/comic/src/game/appraisal/seals.ts","line":118,"endLine":135})
- code:apps/comic/src/game/appraisal/seals.ts:pick ({"file":"apps/comic/src/game/appraisal/seals.ts","line":137,"endLine":157})
- code:apps/comic/src/game/appraisal/seals.ts:handleSealAction ({"file":"apps/comic/src/game/appraisal/seals.ts","line":159,"endLine":172})
- code:apps/comic/src/game/appraisal/seals.ts:closeSealOffers ({"file":"apps/comic/src/game/appraisal/seals.ts","line":175,"endLine":178})
- code:apps/comic/src/game/appraisal/seals.ts:sealMarketViewFor ({"file":"apps/comic/src/game/appraisal/seals.ts","line":180,"endLine":191})
- code:apps/comic/src/game/appraisal/seals.ts:sealInvariants ({"file":"apps/comic/src/game/appraisal/seals.ts","line":193,"endLine":200})
- code:apps/comic/src/game/appraisal/seals.ts:handleSealAction ({"file":"apps/comic/src/game/appraisal/seals.ts","line":159,"endLine":172})
- code:apps/comic/src/game/appraisal/seals.ts:closeSealOffers ({"file":"apps/comic/src/game/appraisal/seals.ts","line":175,"endLine":178})

## logic:L20 สัญญารับซื้อ Wishlist NPC

NPC ขอซื้อของจากผู้เล่น; ไม่ใช่ Collector Wishlist

- code:apps/comic/src/game/appraisal/wishlist-rules.ts:WISH_PREMIUM ({"file":"apps/comic/src/game/appraisal/wishlist-rules.ts","line":5,"endLine":5})
- code:apps/comic/src/game/appraisal/wishlist-rules.ts:WISH_PROBABILITY ({"file":"apps/comic/src/game/appraisal/wishlist-rules.ts","line":7,"endLine":7})
- code:apps/comic/src/game/appraisal/wishlist-rules.ts:WISH_MARKUPS ({"file":"apps/comic/src/game/appraisal/wishlist-rules.ts","line":9,"endLine":9})
- code:apps/comic/src/game/appraisal/wishlist-rules.ts:WISH_BASE_CHANCE ({"file":"apps/comic/src/game/appraisal/wishlist-rules.ts","line":10,"endLine":10})
- code:apps/comic/src/game/appraisal/wishlist-rules.ts:WISH_MARKUP_PENALTY ({"file":"apps/comic/src/game/appraisal/wishlist-rules.ts","line":11,"endLine":11})
- code:apps/comic/src/game/appraisal/wishlist-rules.ts:WISH_TRUST_BONUS ({"file":"apps/comic/src/game/appraisal/wishlist-rules.ts","line":12,"endLine":12})
- code:apps/comic/src/game/appraisal/wishlist-rules.ts:WISH_STATUS_STEP ({"file":"apps/comic/src/game/appraisal/wishlist-rules.ts","line":13,"endLine":13})
- code:apps/comic/src/game/appraisal/wishlist-rules.ts:WISH_CAP ({"file":"apps/comic/src/game/appraisal/wishlist-rules.ts","line":14,"endLine":14})
- code:apps/comic/src/game/appraisal/wishlist-rules.ts:WISH_FLOOR ({"file":"apps/comic/src/game/appraisal/wishlist-rules.ts","line":15,"endLine":15})
- code:apps/comic/src/game/appraisal/wishlist-rules.ts:wishPrice ({"file":"apps/comic/src/game/appraisal/wishlist-rules.ts","line":16,"endLine":16})
- code:apps/comic/src/game/appraisal/wishlist-rules.ts:wishAsk ({"file":"apps/comic/src/game/appraisal/wishlist-rules.ts","line":17,"endLine":17})
- code:apps/comic/src/game/appraisal/wishlist-rules.ts:wishChance ({"file":"apps/comic/src/game/appraisal/wishlist-rules.ts","line":19,"endLine":22})
- code:apps/comic/src/game/appraisal/wishlist-rules.ts:WISH_ENERGY ({"file":"apps/comic/src/game/appraisal/wishlist-rules.ts","line":24,"endLine":24})
- code:apps/comic/src/game/appraisal/wishlist-rules.ts:WISH_MAX_ACTIVE ({"file":"apps/comic/src/game/appraisal/wishlist-rules.ts","line":25,"endLine":25})
- code:apps/comic/src/game/appraisal/wishlist-rules.ts:WISH_DECAY_SHARE ({"file":"apps/comic/src/game/appraisal/wishlist-rules.ts","line":27,"endLine":27})
- code:apps/comic/src/game/appraisal/wishlist-rules.ts:wishFloor ({"file":"apps/comic/src/game/appraisal/wishlist-rules.ts","line":29,"endLine":29})
- code:apps/comic/src/game/appraisal/wishlist-rules.ts:wishDecayStep ({"file":"apps/comic/src/game/appraisal/wishlist-rules.ts","line":30,"endLine":30})
- code:apps/comic/src/game/appraisal/wishlist-rules.ts:wishDecayed ({"file":"apps/comic/src/game/appraisal/wishlist-rules.ts","line":32,"endLine":32})
- code:apps/comic/src/game/appraisal/events.ts:drawWishEvent ({"file":"apps/comic/src/game/appraisal/events.ts","line":260,"endLine":260})
- code:apps/comic/src/game/appraisal/wishlist.ts:applyWish ({"file":"apps/comic/src/game/appraisal/wishlist.ts","line":38,"endLine":47})
- code:apps/comic/src/game/appraisal/wishlist.ts:wishNew ({"file":"apps/comic/src/game/appraisal/wishlist.ts","line":49,"endLine":57})
- code:apps/comic/src/game/appraisal/wishlist.ts:drawWishEvent ({"file":"apps/comic/src/game/appraisal/wishlist.ts","line":66,"endLine":70})
- code:apps/comic/src/game/appraisal/wishlist.ts:wishSell ({"file":"apps/comic/src/game/appraisal/wishlist.ts","line":85,"endLine":107})

## logic:L21 Collector Wishlist 3+2

ทุก 2 turn ขอ 3; รอ 2 turn; สุ่มเพิ่ม 2; ดู 1; จ่ายซื้อจริง



## logic:L22 สัญญาส่วนตัว NPC

เลือด Vampire และให้ Alien ยืมของ

- code:apps/comic/src/game/appraisal/npc-events.ts:NPC_PERSONAL_EVENT ({"file":"apps/comic/src/game/appraisal/npc-events.ts","line":9,"endLine":9})
- code:apps/comic/src/game/appraisal/npc-events.ts:isNpcEvent ({"file":"apps/comic/src/game/appraisal/npc-events.ts","line":10,"endLine":10})
- code:apps/comic/src/game/appraisal/npc-events.ts:merchant ({"file":"apps/comic/src/game/appraisal/npc-events.ts","line":11,"endLine":11})
- code:apps/comic/src/game/appraisal/npc-events.ts:movable ({"file":"apps/comic/src/game/appraisal/npc-events.ts","line":12,"endLine":12})
- code:apps/comic/src/game/appraisal/npc-events.ts:livingOthers ({"file":"apps/comic/src/game/appraisal/npc-events.ts","line":13,"endLine":13})
- code:apps/comic/src/game/appraisal/npc-events.ts:freeBank ({"file":"apps/comic/src/game/appraisal/npc-events.ts","line":14,"endLine":14})
- code:apps/comic/src/game/appraisal/npc-events.ts:pick ({"file":"apps/comic/src/game/appraisal/npc-events.ts","line":15,"endLine":15})
- code:apps/comic/src/game/appraisal/npc-events.ts:note ({"file":"apps/comic/src/game/appraisal/npc-events.ts","line":16,"endLine":16})
- code:apps/comic/src/game/appraisal/npc-events.ts:npcEventEligible ({"file":"apps/comic/src/game/appraisal/npc-events.ts","line":19,"endLine":34})
- code:apps/comic/src/game/appraisal/npc-events.ts:personalNpcOffer ({"file":"apps/comic/src/game/appraisal/npc-events.ts","line":37,"endLine":59})
- code:apps/comic/src/game/appraisal/npc-events.ts:statusPool ({"file":"apps/comic/src/game/appraisal/npc-events.ts","line":62,"endLine":67})
- code:apps/comic/src/game/appraisal/npc-events.ts:randomBuff ({"file":"apps/comic/src/game/appraisal/npc-events.ts","line":68,"endLine":72})
- code:apps/comic/src/game/appraisal/npc-events.ts:payLife ({"file":"apps/comic/src/game/appraisal/npc-events.ts","line":74,"endLine":77})
- code:apps/comic/src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent ({"file":"apps/comic/src/game/appraisal/npc-events.ts","line":78,"endLine":121})
- code:apps/comic/src/game/appraisal/npc-events.ts:returnLoanItems ({"file":"apps/comic/src/game/appraisal/npc-events.ts","line":123,"endLine":128})
- code:apps/comic/src/game/appraisal/npc-events.ts:redeemNpcContracts ({"file":"apps/comic/src/game/appraisal/npc-events.ts","line":130,"endLine":152})
- code:apps/comic/src/game/appraisal/npc-events.ts:closeNpcContracts ({"file":"apps/comic/src/game/appraisal/npc-events.ts","line":154,"endLine":157})
- code:apps/comic/src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent ({"file":"apps/comic/src/game/appraisal/npc-events.ts","line":78,"endLine":121})

## logic:L23 พลัง

ต้นทุน ฟื้นพลัง และค่าสูงสุด

- code:apps/comic/src/game/appraisal/mechanics.ts:maxEnergyOf ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":40,"endLine":42})
- code:apps/comic/src/game/appraisal/mechanics.ts:spend ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":99,"endLine":105})
- code:apps/comic/src/game/appraisal/mechanics.ts:recover ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":122,"endLine":128})

## logic:L24 ชีวิตและการฟื้นฟู

ความเสียหาย ดีลฟื้นชีวิตและการตาย

- code:apps/comic/src/game/appraisal/survival.ts:SURVIVAL_RULES ({"file":"apps/comic/src/game/appraisal/survival.ts","line":10,"endLine":10})
- code:apps/comic/src/game/appraisal/survival.ts:BROKERAGE_RULES ({"file":"apps/comic/src/game/appraisal/survival.ts","line":12,"endLine":12})
- code:apps/comic/src/game/appraisal/survival.ts:collectorDue ({"file":"apps/comic/src/game/appraisal/survival.ts","line":14,"endLine":14})
- code:apps/comic/src/game/appraisal/survival.ts:collectRun ({"file":"apps/comic/src/game/appraisal/survival.ts","line":15,"endLine":36})
- code:apps/comic/src/game/appraisal/mechanics.ts:healLife ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":129,"endLine":133})
- code:apps/comic/src/game/appraisal/mechanics.ts:damageLife ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":134,"endLine":143})
- code:apps/comic/src/game/appraisal/mechanics.ts:retire ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":184,"endLine":190})
- code:apps/comic/src/game/appraisal/mechanics.ts:kill ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":489,"endLine":493})

## logic:L25 เศษชีพจรและคู่ค้า

เศษจากการค้า ฟื้นชีวิต และกฎป้องกันปั๊มคู่ค้าเดิม

- code:apps/comic/src/game/appraisal/pulse.ts:PULSE_RULES ({"file":"apps/comic/src/game/appraisal/pulse.ts","line":5,"endLine":5})
- code:apps/comic/src/game/appraisal/pulse.ts:TRUST_RULES ({"file":"apps/comic/src/game/appraisal/pulse.ts","line":7,"endLine":7})
- code:apps/comic/src/game/appraisal/pulse.ts:ENERGY_DEAL_NPCS ({"file":"apps/comic/src/game/appraisal/pulse.ts","line":9,"endLine":9})
- code:apps/comic/src/game/appraisal/pulse.ts:LIFE_DEALS ({"file":"apps/comic/src/game/appraisal/pulse.ts","line":11,"endLine":11})
- code:apps/comic/src/game/appraisal/pulse.ts:lifeDealTerms ({"file":"apps/comic/src/game/appraisal/pulse.ts","line":12,"endLine":12})
- code:apps/comic/src/game/appraisal/pulse.ts:linkTrade ({"file":"apps/comic/src/game/appraisal/pulse.ts","line":15,"endLine":17})
- code:apps/comic/src/game/appraisal/pulse.ts:merchantWary ({"file":"apps/comic/src/game/appraisal/pulse.ts","line":19,"endLine":19})
- code:apps/comic/src/game/appraisal/pulse.ts:shardsPerSale ({"file":"apps/comic/src/game/appraisal/pulse.ts","line":20,"endLine":20})
- code:apps/comic/src/game/appraisal/pulse.ts:STOCK_RULES ({"file":"apps/comic/src/game/appraisal/pulse.ts","line":23,"endLine":23})
- code:apps/comic/src/game/appraisal/pulse.ts:activeNpcs ({"file":"apps/comic/src/game/appraisal/pulse.ts","line":24,"endLine":24})
- code:apps/comic/src/game/appraisal/pulse.ts:trustTier ({"file":"apps/comic/src/game/appraisal/pulse.ts","line":25,"endLine":25})
- code:apps/comic/src/game/appraisal/pulse.ts:extraStock ({"file":"apps/comic/src/game/appraisal/pulse.ts","line":26,"endLine":26})
- code:apps/comic/src/game/appraisal/mechanics.ts:mendWithShards ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":162,"endLine":167})

## logic:L26 ภัย Dread/ผุพัง

โอกาสภัย เสียทรัพยากรและของผุพัง

- code:apps/comic/src/game/appraisal/core2.ts:core2On ({"file":"apps/comic/src/game/appraisal/core2.ts","line":10,"endLine":10})
- code:apps/comic/src/game/appraisal/core2.ts:CORE2 ({"file":"apps/comic/src/game/appraisal/core2.ts","line":12,"endLine":36})
- code:apps/comic/src/game/appraisal/core2.ts:rerollCost ({"file":"apps/comic/src/game/appraisal/core2.ts","line":39,"endLine":39})
- code:apps/comic/src/game/appraisal/core2.ts:WEAK_BUFFS ({"file":"apps/comic/src/game/appraisal/core2.ts","line":41,"endLine":41})
- code:apps/comic/src/game/appraisal/core2.ts:STRONG_BUFFS ({"file":"apps/comic/src/game/appraisal/core2.ts","line":42,"endLine":42})
- code:apps/comic/src/game/appraisal/core2.ts:anchorOf ({"file":"apps/comic/src/game/appraisal/core2.ts","line":44,"endLine":50})
- code:apps/comic/src/game/appraisal/core2.ts:decayFor ({"file":"apps/comic/src/game/appraisal/core2.ts","line":53,"endLine":53})
- code:apps/comic/src/game/appraisal/core2.ts:dreadChance ({"file":"apps/comic/src/game/appraisal/core2.ts","line":54,"endLine":54})
- code:apps/comic/src/game/appraisal/core2.ts:overvalueChance ({"file":"apps/comic/src/game/appraisal/core2.ts","line":56,"endLine":59})
- code:apps/comic/src/game/appraisal/core2.ts:consignPayout ({"file":"apps/comic/src/game/appraisal/core2.ts","line":61,"endLine":61})
- code:apps/comic/src/game/appraisal/core2.ts:dreadKinds ({"file":"apps/comic/src/game/appraisal/core2.ts","line":64,"endLine":69})
- code:apps/comic/src/game/appraisal/core2.ts:dreadTax ({"file":"apps/comic/src/game/appraisal/core2.ts","line":70,"endLine":70})
- code:apps/comic/src/game/appraisal/core2.ts:LIFE_DEALS2 ({"file":"apps/comic/src/game/appraisal/core2.ts","line":72,"endLine":72})
- code:apps/comic/src/game/appraisal/core2.ts:lifeDealTerms2 ({"file":"apps/comic/src/game/appraisal/core2.ts","line":73,"endLine":73})
- code:apps/comic/src/game/appraisal/core2.ts:ENERGY_DEAL_CREDITS2 ({"file":"apps/comic/src/game/appraisal/core2.ts","line":74,"endLine":74})
- code:apps/comic/src/game/appraisal/core2.ts:recoverySurcharge ({"file":"apps/comic/src/game/appraisal/core2.ts","line":76,"endLine":76})
- code:apps/comic/src/game/appraisal/core2.ts:linkedStatuses ({"file":"apps/comic/src/game/appraisal/core2.ts","line":79,"endLine":79})
- code:apps/comic/src/game/appraisal/core2-rules.ts:applyDread ({"file":"apps/comic/src/game/appraisal/core2-rules.ts","line":16,"endLine":36})
- code:apps/comic/src/game/appraisal/core2.ts:dreadChance ({"file":"apps/comic/src/game/appraisal/core2.ts","line":54,"endLine":54})

## logic:L27 สถานะผลดี/ผลเสีย

ลบ ลดหรือยืดสถานะ ไม่เปลี่ยนหนี้หรือกำหนดสัญญาเอง

- code:apps/comic/src/game/appraisal/passives.ts:emptyPassives ({"file":"apps/comic/src/game/appraisal/passives.ts","line":14,"endLine":14})
- code:apps/comic/src/game/appraisal/passives.ts:PASSIVE_ITEMS ({"file":"apps/comic/src/game/appraisal/passives.ts","line":16,"endLine":38})
- code:apps/comic/src/game/appraisal/passives.ts:passivesEnabled ({"file":"apps/comic/src/game/appraisal/passives.ts","line":39,"endLine":39})
- code:apps/comic/src/game/appraisal/passives.ts:passiveSpec ({"file":"apps/comic/src/game/appraisal/passives.ts","line":40,"endLine":40})
- code:apps/comic/src/game/appraisal/passives.ts:HELD_STACK_CAP ({"file":"apps/comic/src/game/appraisal/passives.ts","line":42,"endLine":42})
- code:apps/comic/src/game/appraisal/passives.ts:heldPassives ({"file":"apps/comic/src/game/appraisal/passives.ts","line":43,"endLine":53})
- code:apps/comic/src/game/appraisal/passives.ts:passiveBonuses ({"file":"apps/comic/src/game/appraisal/passives.ts","line":54,"endLine":58})
- code:apps/comic/src/game/appraisal/passives.ts:freeInspectionCount ({"file":"apps/comic/src/game/appraisal/passives.ts","line":59,"endLine":61})
- code:apps/comic/src/game/appraisal/passives.ts:inspectionLimit ({"file":"apps/comic/src/game/appraisal/passives.ts","line":62,"endLine":62})
- code:apps/comic/src/game/appraisal/passives.ts:commissionRate ({"file":"apps/comic/src/game/appraisal/passives.ts","line":63,"endLine":63})
- code:apps/comic/src/game/appraisal/passives.ts:coinWinChance ({"file":"apps/comic/src/game/appraisal/passives.ts","line":64,"endLine":64})
- code:apps/comic/src/game/appraisal/passives.ts:passiveMarketBonus ({"file":"apps/comic/src/game/appraisal/passives.ts","line":66,"endLine":68})
- code:apps/comic/src/game/appraisal/passives.ts:MAX_ENERGY_CAP ({"file":"apps/comic/src/game/appraisal/passives.ts","line":69,"endLine":69})
- code:apps/comic/src/game/appraisal/passives.ts:MAX_LIFE_BONUS_CAP ({"file":"apps/comic/src/game/appraisal/passives.ts","line":69,"endLine":69})
- code:apps/comic/src/game/appraisal/passives.ts:WISH_SLOT_CAP ({"file":"apps/comic/src/game/appraisal/passives.ts","line":69,"endLine":69})
- code:apps/comic/src/game/appraisal/mechanics.ts:consumeStatus ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":35,"endLine":37})
- code:apps/comic/src/game/appraisal/mechanics.ts:removeStatus ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":38,"endLine":38})
- code:apps/comic/src/game/appraisal/mechanics.ts:grant ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":84,"endLine":98})

## logic:L28 รางวัลและทายเหรียญ

โอกาส เงินรางวัลและการเสียเดิมพัน

- code:apps/comic/src/game/appraisal/round-rewards.ts:openRoundRewards ({"file":"apps/comic/src/game/appraisal/round-rewards.ts","line":8,"endLine":20})
- code:apps/comic/src/game/appraisal/round-rewards.ts:raiseRoundReward ({"file":"apps/comic/src/game/appraisal/round-rewards.ts","line":21,"endLine":30})
- code:apps/comic/src/game/appraisal/round-rewards.ts:flipRoundReward ({"file":"apps/comic/src/game/appraisal/round-rewards.ts","line":31,"endLine":63})
- code:apps/comic/src/game/appraisal/round-rewards.ts:bankRoundReward ({"file":"apps/comic/src/game/appraisal/round-rewards.ts","line":64,"endLine":71})
- code:apps/comic/src/game/appraisal/passives.ts:coinWinChance ({"file":"apps/comic/src/game/appraisal/passives.ts","line":64,"endLine":64})
- code:apps/comic/src/game/appraisal/round-rewards.ts:openRoundRewards ({"file":"apps/comic/src/game/appraisal/round-rewards.ts","line":8,"endLine":20})

## logic:L29 Collector และคะแนนฐาน

มูลค่าเงิน/สินค้าและตัวปรับ; แยกจากรางวัลผู้นำ

- code:apps/comic/src/game/appraisal/scoring.ts:itemScoreValue ({"file":"apps/comic/src/game/appraisal/scoring.ts","line":2,"endLine":4})
- code:apps/comic/src/game/appraisal/scoring.ts:PROVENANCE_PERCENT ({"file":"apps/comic/src/game/appraisal/scoring.ts","line":6,"endLine":6})
- code:apps/comic/src/game/appraisal/scoring.ts:collectorTotal ({"file":"apps/comic/src/game/appraisal/scoring.ts","line":8,"endLine":10})
- code:apps/comic/src/game/appraisal/scoring.ts:FAKE_EFFECT_CHANCE ({"file":"apps/comic/src/game/appraisal/scoring.ts","line":12,"endLine":12})
- code:apps/comic/src/game/appraisal/scoring.ts:collectorTotal ({"file":"apps/comic/src/game/appraisal/scoring.ts","line":8,"endLine":10})
- code:apps/comic/src/game/appraisal/survival.ts:collectRun ({"file":"apps/comic/src/game/appraisal/survival.ts","line":15,"endLine":36})

## logic:L30 คะแนนพิเศษผู้นำ

ซื้อ ขาย ตาย ของตอนจบ ความไว้ใจ และกลุ่ม rarity ×2=20/×3=40

- code:apps/comic/src/game/appraisal/scoring.ts:itemScoreValue ({"file":"apps/comic/src/game/appraisal/scoring.ts","line":2,"endLine":4})
- code:apps/comic/src/game/appraisal/scoring.ts:PROVENANCE_PERCENT ({"file":"apps/comic/src/game/appraisal/scoring.ts","line":6,"endLine":6})
- code:apps/comic/src/game/appraisal/scoring.ts:collectorTotal ({"file":"apps/comic/src/game/appraisal/scoring.ts","line":8,"endLine":10})
- code:apps/comic/src/game/appraisal/scoring.ts:FAKE_EFFECT_CHANCE ({"file":"apps/comic/src/game/appraisal/scoring.ts","line":12,"endLine":12})

## logic:L31 สำเนาสินค้า

พลังสำเนา 40% กฎต้นฉบับและการสร้างสำเนา

- code:apps/comic/src/game/appraisal/copy-effects.ts:itemEffectScale ({"file":"apps/comic/src/game/appraisal/copy-effects.ts","line":4,"endLine":4})
- code:apps/comic/src/game/appraisal/copy-effects.ts:copySaleQuote ({"file":"apps/comic/src/game/appraisal/copy-effects.ts","line":13,"endLine":13})
- code:apps/comic/src/game/appraisal/merchant-abilities.ts:liveCopy ({"file":"apps/comic/src/game/appraisal/merchant-abilities.ts","line":14,"endLine":14})

## logic:L32 Log/ข้อมูลปกปิด

ติดตามเหตุผล/คำสั่งซ้ำ/ความรู้ ห้ามกลายเป็นโบนัสเฉพาะสินค้า

- code:apps/comic/src/game/appraisal/audit.ts:exportAppraisalAudit ({"file":"apps/comic/src/game/appraisal/audit.ts","line":21,"endLine":24})
- code:apps/comic/src/game/appraisal/audit.ts:replayAppraisalAudit ({"file":"apps/comic/src/game/appraisal/audit.ts","line":25,"endLine":33})
- code:apps/comic/src/game/appraisal/mechanics.ts:trace ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":31,"endLine":33})
- code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor ({"file":"apps/comic/src/game/appraisal/views.ts","line":49,"endLine":68})

## logic:L33 เจ้าของ/คลัง/หลักประกัน

สิทธิ์ใช้และ passive ต้องหายเมื่อฝาก/ค้ำ/เปลี่ยนเจ้าของ

- code:apps/comic/src/game/appraisal/mechanics.ts:stockItem ({"file":"apps/comic/src/game/appraisal/mechanics.ts","line":196,"endLine":200})
- code:apps/comic/src/game/appraisal/npc-events.ts:returnLoanItems ({"file":"apps/comic/src/game/appraisal/npc-events.ts","line":123,"endLine":128})
- code:apps/comic/src/game/appraisal/price-integrity.ts:integrityItemView ({"file":"apps/comic/src/game/appraisal/price-integrity.ts","line":76,"endLine":80})
