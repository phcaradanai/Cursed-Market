# ระบบเดิม 33 กลุ่ม → หลักฐาน runtime และข้อเสนอสินค้าใหม่

การจัดหมวดเป็น editorial classification ไม่ใช่ dedicated item binding; ศูนย์หมายถึงยังไม่จัดหลักฐานตรงในหมวดนี้ ไม่ยืนยันว่าไม่มี runtime

## logic:L01 ตรวจและประเมินราคา

เปิดมูลค่า/ช่วงราคา สิทธิ์ตรวจและการประเมิน

- code:src/game/appraisal/mechanics.ts:check ({"file":"src/game/appraisal/mechanics.ts","line":23,"endLine":25})
- code:src/game/appraisal/mechanics.ts:player ({"file":"src/game/appraisal/mechanics.ts","line":26,"endLine":29})
- code:src/game/appraisal/mechanics.ts:trace ({"file":"src/game/appraisal/mechanics.ts","line":30,"endLine":32})
- code:src/game/appraisal/mechanics.ts:status ({"file":"src/game/appraisal/mechanics.ts","line":33,"endLine":33})
- code:src/game/appraisal/mechanics.ts:consumeStatus ({"file":"src/game/appraisal/mechanics.ts","line":34,"endLine":36})
- code:src/game/appraisal/mechanics.ts:removeStatus ({"file":"src/game/appraisal/mechanics.ts","line":37,"endLine":37})
- code:src/game/appraisal/mechanics.ts:maxEnergyOf ({"file":"src/game/appraisal/mechanics.ts","line":39,"endLine":41})
- code:src/game/appraisal/mechanics.ts:maxLifeOf ({"file":"src/game/appraisal/mechanics.ts","line":42,"endLine":44})
- code:src/game/appraisal/mechanics.ts:wishSlotsOf ({"file":"src/game/appraisal/mechanics.ts","line":45,"endLine":45})
- code:src/game/appraisal/mechanics.ts:enforceCaps ({"file":"src/game/appraisal/mechanics.ts","line":47,"endLine":52})
- code:src/game/appraisal/mechanics.ts:stockBonus ({"file":"src/game/appraisal/mechanics.ts","line":54,"endLine":61})
- code:src/game/appraisal/mechanics.ts:omenNow ({"file":"src/game/appraisal/mechanics.ts","line":63,"endLine":63})
- code:src/game/appraisal/mechanics.ts:salePercent ({"file":"src/game/appraisal/mechanics.ts","line":68,"endLine":71})
- code:src/game/appraisal/mechanics.ts:saleAdjusted ({"file":"src/game/appraisal/mechanics.ts","line":72,"endLine":72})
- code:src/game/appraisal/mechanics.ts:salePreview ({"file":"src/game/appraisal/mechanics.ts","line":74,"endLine":74})
- code:src/game/appraisal/mechanics.ts:saleApply ({"file":"src/game/appraisal/mechanics.ts","line":76,"endLine":80})
- code:src/game/appraisal/mechanics.ts:feeSurcharge ({"file":"src/game/appraisal/mechanics.ts","line":82,"endLine":82})
- code:src/game/appraisal/mechanics.ts:grant ({"file":"src/game/appraisal/mechanics.ts","line":83,"endLine":97})
- code:src/game/appraisal/mechanics.ts:spend ({"file":"src/game/appraisal/mechanics.ts","line":98,"endLine":104})
- code:src/game/appraisal/mechanics.ts:reward ({"file":"src/game/appraisal/mechanics.ts","line":105,"endLine":110})
- code:src/game/appraisal/mechanics.ts:transfer ({"file":"src/game/appraisal/mechanics.ts","line":111,"endLine":115})
- code:src/game/appraisal/mechanics.ts:fundPassive ({"file":"src/game/appraisal/mechanics.ts","line":117,"endLine":120})
- code:src/game/appraisal/mechanics.ts:recover ({"file":"src/game/appraisal/mechanics.ts","line":121,"endLine":127})
- code:src/game/appraisal/mechanics.ts:healLife ({"file":"src/game/appraisal/mechanics.ts","line":128,"endLine":132})
- code:src/game/appraisal/mechanics.ts:damageLife ({"file":"src/game/appraisal/mechanics.ts","line":133,"endLine":141})
- code:src/game/appraisal/mechanics.ts:recoveryOffer ({"file":"src/game/appraisal/mechanics.ts","line":142,"endLine":153})
- code:src/game/appraisal/mechanics.ts:recoveryAmount ({"file":"src/game/appraisal/mechanics.ts","line":155,"endLine":158})
- code:src/game/appraisal/mechanics.ts:mendWithShards ({"file":"src/game/appraisal/mechanics.ts","line":160,"endLine":165})
- code:src/game/appraisal/mechanics.ts:gainShards ({"file":"src/game/appraisal/mechanics.ts","line":166,"endLine":173})
- code:src/game/appraisal/mechanics.ts:unlocked ({"file":"src/game/appraisal/mechanics.ts","line":174,"endLine":176})
- code:src/game/appraisal/mechanics.ts:ownedItem ({"file":"src/game/appraisal/mechanics.ts","line":177,"endLine":181})
- code:src/game/appraisal/mechanics.ts:retire ({"file":"src/game/appraisal/mechanics.ts","line":182,"endLine":188})
- code:src/game/appraisal/mechanics.ts:wealth ({"file":"src/game/appraisal/mechanics.ts","line":189,"endLine":193})
- code:src/game/appraisal/mechanics.ts:stockItem ({"file":"src/game/appraisal/mechanics.ts","line":194,"endLine":198})
- code:src/game/appraisal/mechanics.ts:known ({"file":"src/game/appraisal/mechanics.ts","line":199,"endLine":201})
- code:src/game/appraisal/mechanics.ts:learn ({"file":"src/game/appraisal/mechanics.ts","line":202,"endLine":204})
- code:src/game/appraisal/mechanics.ts:merchantActionFree ({"file":"src/game/appraisal/mechanics.ts","line":206,"endLine":209})
- code:src/game/appraisal/mechanics.ts:inspect ({"file":"src/game/appraisal/mechanics.ts","line":210,"endLine":244})
- code:src/game/appraisal/mechanics.ts:counterLimit ({"file":"src/game/appraisal/mechanics.ts","line":245,"endLine":245})
- code:src/game/appraisal/mechanics.ts:detectionRisk ({"file":"src/game/appraisal/mechanics.ts","line":246,"endLine":250})
- code:src/game/appraisal/mechanics.ts:appraise ({"file":"src/game/appraisal/mechanics.ts","line":251,"endLine":290})
- code:src/game/appraisal/mechanics.ts:npcQuote ({"file":"src/game/appraisal/mechanics.ts","line":291,"endLine":293})
- code:src/game/appraisal/mechanics.ts:completeAppraisedSale ({"file":"src/game/appraisal/mechanics.ts","line":295,"endLine":307})
- code:src/game/appraisal/mechanics.ts:payRebate ({"file":"src/game/appraisal/mechanics.ts","line":309,"endLine":315})
- code:src/game/appraisal/mechanics.ts:friendAppraised ({"file":"src/game/appraisal/mechanics.ts","line":317,"endLine":319})
- code:src/game/appraisal/mechanics.ts:inheritKnowledge ({"file":"src/game/appraisal/mechanics.ts","line":321,"endLine":330})
- code:src/game/appraisal/mechanics.ts:noteRepeatBuy ({"file":"src/game/appraisal/mechanics.ts","line":332,"endLine":342})
- code:src/game/appraisal/mechanics.ts:noteScrap ({"file":"src/game/appraisal/mechanics.ts","line":344,"endLine":357})
- code:src/game/appraisal/mechanics.ts:purchase ({"file":"src/game/appraisal/mechanics.ts","line":358,"endLine":398})
- code:src/game/appraisal/mechanics.ts:activate ({"file":"src/game/appraisal/mechanics.ts","line":399,"endLine":460})
- code:src/game/appraisal/mechanics.ts:activationNote ({"file":"src/game/appraisal/mechanics.ts","line":462,"endLine":473})
- code:src/game/appraisal/mechanics.ts:penaltyItem ({"file":"src/game/appraisal/mechanics.ts","line":474,"endLine":478})
- code:src/game/appraisal/mechanics.ts:kill ({"file":"src/game/appraisal/mechanics.ts","line":479,"endLine":483})
- code:src/game/appraisal/mechanics.ts:marketSell ({"file":"src/game/appraisal/mechanics.ts","line":484,"endLine":529})
- code:src/game/appraisal/mechanics.ts:inspect ({"file":"src/game/appraisal/mechanics.ts","line":210,"endLine":244})
- code:src/game/appraisal/price-integrity.ts:auditItemPrice ({"file":"src/game/appraisal/price-integrity.ts","line":14,"endLine":23})

## logic:L02 ความแท้และท้าทาย

ตรวจความแท้ ท้าทายคำระบุ และผลพลาด

- code:src/game/appraisal/challenge.ts:settleChallenge ({"file":"src/game/appraisal/challenge.ts","line":13,"endLine":33})
- code:src/game/appraisal/mechanics.ts:check ({"file":"src/game/appraisal/mechanics.ts","line":23,"endLine":25})
- code:src/game/appraisal/mechanics.ts:player ({"file":"src/game/appraisal/mechanics.ts","line":26,"endLine":29})
- code:src/game/appraisal/mechanics.ts:trace ({"file":"src/game/appraisal/mechanics.ts","line":30,"endLine":32})
- code:src/game/appraisal/mechanics.ts:status ({"file":"src/game/appraisal/mechanics.ts","line":33,"endLine":33})
- code:src/game/appraisal/mechanics.ts:consumeStatus ({"file":"src/game/appraisal/mechanics.ts","line":34,"endLine":36})
- code:src/game/appraisal/mechanics.ts:removeStatus ({"file":"src/game/appraisal/mechanics.ts","line":37,"endLine":37})
- code:src/game/appraisal/mechanics.ts:maxEnergyOf ({"file":"src/game/appraisal/mechanics.ts","line":39,"endLine":41})
- code:src/game/appraisal/mechanics.ts:maxLifeOf ({"file":"src/game/appraisal/mechanics.ts","line":42,"endLine":44})
- code:src/game/appraisal/mechanics.ts:wishSlotsOf ({"file":"src/game/appraisal/mechanics.ts","line":45,"endLine":45})
- code:src/game/appraisal/mechanics.ts:enforceCaps ({"file":"src/game/appraisal/mechanics.ts","line":47,"endLine":52})
- code:src/game/appraisal/mechanics.ts:stockBonus ({"file":"src/game/appraisal/mechanics.ts","line":54,"endLine":61})
- code:src/game/appraisal/mechanics.ts:omenNow ({"file":"src/game/appraisal/mechanics.ts","line":63,"endLine":63})
- code:src/game/appraisal/mechanics.ts:salePercent ({"file":"src/game/appraisal/mechanics.ts","line":68,"endLine":71})
- code:src/game/appraisal/mechanics.ts:saleAdjusted ({"file":"src/game/appraisal/mechanics.ts","line":72,"endLine":72})
- code:src/game/appraisal/mechanics.ts:salePreview ({"file":"src/game/appraisal/mechanics.ts","line":74,"endLine":74})
- code:src/game/appraisal/mechanics.ts:saleApply ({"file":"src/game/appraisal/mechanics.ts","line":76,"endLine":80})
- code:src/game/appraisal/mechanics.ts:feeSurcharge ({"file":"src/game/appraisal/mechanics.ts","line":82,"endLine":82})
- code:src/game/appraisal/mechanics.ts:grant ({"file":"src/game/appraisal/mechanics.ts","line":83,"endLine":97})
- code:src/game/appraisal/mechanics.ts:spend ({"file":"src/game/appraisal/mechanics.ts","line":98,"endLine":104})
- code:src/game/appraisal/mechanics.ts:reward ({"file":"src/game/appraisal/mechanics.ts","line":105,"endLine":110})
- code:src/game/appraisal/mechanics.ts:transfer ({"file":"src/game/appraisal/mechanics.ts","line":111,"endLine":115})
- code:src/game/appraisal/mechanics.ts:fundPassive ({"file":"src/game/appraisal/mechanics.ts","line":117,"endLine":120})
- code:src/game/appraisal/mechanics.ts:recover ({"file":"src/game/appraisal/mechanics.ts","line":121,"endLine":127})
- code:src/game/appraisal/mechanics.ts:healLife ({"file":"src/game/appraisal/mechanics.ts","line":128,"endLine":132})
- code:src/game/appraisal/mechanics.ts:damageLife ({"file":"src/game/appraisal/mechanics.ts","line":133,"endLine":141})
- code:src/game/appraisal/mechanics.ts:recoveryOffer ({"file":"src/game/appraisal/mechanics.ts","line":142,"endLine":153})
- code:src/game/appraisal/mechanics.ts:recoveryAmount ({"file":"src/game/appraisal/mechanics.ts","line":155,"endLine":158})
- code:src/game/appraisal/mechanics.ts:mendWithShards ({"file":"src/game/appraisal/mechanics.ts","line":160,"endLine":165})
- code:src/game/appraisal/mechanics.ts:gainShards ({"file":"src/game/appraisal/mechanics.ts","line":166,"endLine":173})
- code:src/game/appraisal/mechanics.ts:unlocked ({"file":"src/game/appraisal/mechanics.ts","line":174,"endLine":176})
- code:src/game/appraisal/mechanics.ts:ownedItem ({"file":"src/game/appraisal/mechanics.ts","line":177,"endLine":181})
- code:src/game/appraisal/mechanics.ts:retire ({"file":"src/game/appraisal/mechanics.ts","line":182,"endLine":188})
- code:src/game/appraisal/mechanics.ts:wealth ({"file":"src/game/appraisal/mechanics.ts","line":189,"endLine":193})
- code:src/game/appraisal/mechanics.ts:stockItem ({"file":"src/game/appraisal/mechanics.ts","line":194,"endLine":198})
- code:src/game/appraisal/mechanics.ts:known ({"file":"src/game/appraisal/mechanics.ts","line":199,"endLine":201})
- code:src/game/appraisal/mechanics.ts:learn ({"file":"src/game/appraisal/mechanics.ts","line":202,"endLine":204})
- code:src/game/appraisal/mechanics.ts:merchantActionFree ({"file":"src/game/appraisal/mechanics.ts","line":206,"endLine":209})
- code:src/game/appraisal/mechanics.ts:inspect ({"file":"src/game/appraisal/mechanics.ts","line":210,"endLine":244})
- code:src/game/appraisal/mechanics.ts:counterLimit ({"file":"src/game/appraisal/mechanics.ts","line":245,"endLine":245})
- code:src/game/appraisal/mechanics.ts:detectionRisk ({"file":"src/game/appraisal/mechanics.ts","line":246,"endLine":250})
- code:src/game/appraisal/mechanics.ts:appraise ({"file":"src/game/appraisal/mechanics.ts","line":251,"endLine":290})
- code:src/game/appraisal/mechanics.ts:npcQuote ({"file":"src/game/appraisal/mechanics.ts","line":291,"endLine":293})
- code:src/game/appraisal/mechanics.ts:completeAppraisedSale ({"file":"src/game/appraisal/mechanics.ts","line":295,"endLine":307})
- code:src/game/appraisal/mechanics.ts:payRebate ({"file":"src/game/appraisal/mechanics.ts","line":309,"endLine":315})
- code:src/game/appraisal/mechanics.ts:friendAppraised ({"file":"src/game/appraisal/mechanics.ts","line":317,"endLine":319})
- code:src/game/appraisal/mechanics.ts:inheritKnowledge ({"file":"src/game/appraisal/mechanics.ts","line":321,"endLine":330})
- code:src/game/appraisal/mechanics.ts:noteRepeatBuy ({"file":"src/game/appraisal/mechanics.ts","line":332,"endLine":342})
- code:src/game/appraisal/mechanics.ts:noteScrap ({"file":"src/game/appraisal/mechanics.ts","line":344,"endLine":357})
- code:src/game/appraisal/mechanics.ts:purchase ({"file":"src/game/appraisal/mechanics.ts","line":358,"endLine":398})
- code:src/game/appraisal/mechanics.ts:activate ({"file":"src/game/appraisal/mechanics.ts","line":399,"endLine":460})
- code:src/game/appraisal/mechanics.ts:activationNote ({"file":"src/game/appraisal/mechanics.ts","line":462,"endLine":473})
- code:src/game/appraisal/mechanics.ts:penaltyItem ({"file":"src/game/appraisal/mechanics.ts","line":474,"endLine":478})
- code:src/game/appraisal/mechanics.ts:kill ({"file":"src/game/appraisal/mechanics.ts","line":479,"endLine":483})
- code:src/game/appraisal/mechanics.ts:marketSell ({"file":"src/game/appraisal/mechanics.ts","line":484,"endLine":529})
- code:src/game/appraisal/challenge.ts:settleChallenge ({"file":"src/game/appraisal/challenge.ts","line":13,"endLine":33})

## logic:L03 คำสาปและการชำระ

ตรวจคำสาป ชำระ เครื่องมือและความล้มเหลว

- code:src/game/appraisal/cleanse.ts:shopNpc ({"file":"src/game/appraisal/cleanse.ts","line":8,"endLine":10})
- code:src/game/appraisal/cleanse.ts:trustOf ({"file":"src/game/appraisal/cleanse.ts","line":11,"endLine":11})
- code:src/game/appraisal/cleanse.ts:quote ({"file":"src/game/appraisal/cleanse.ts","line":12,"endLine":21})
- code:src/game/appraisal/cleanse.ts:cleanseOffer ({"file":"src/game/appraisal/cleanse.ts","line":23,"endLine":27})
- code:src/game/appraisal/cleanse.ts:cleanseItem ({"file":"src/game/appraisal/cleanse.ts","line":28,"endLine":50})
- code:src/game/appraisal/mechanics.ts:check ({"file":"src/game/appraisal/mechanics.ts","line":23,"endLine":25})
- code:src/game/appraisal/mechanics.ts:player ({"file":"src/game/appraisal/mechanics.ts","line":26,"endLine":29})
- code:src/game/appraisal/mechanics.ts:trace ({"file":"src/game/appraisal/mechanics.ts","line":30,"endLine":32})
- code:src/game/appraisal/mechanics.ts:status ({"file":"src/game/appraisal/mechanics.ts","line":33,"endLine":33})
- code:src/game/appraisal/mechanics.ts:consumeStatus ({"file":"src/game/appraisal/mechanics.ts","line":34,"endLine":36})
- code:src/game/appraisal/mechanics.ts:removeStatus ({"file":"src/game/appraisal/mechanics.ts","line":37,"endLine":37})
- code:src/game/appraisal/mechanics.ts:maxEnergyOf ({"file":"src/game/appraisal/mechanics.ts","line":39,"endLine":41})
- code:src/game/appraisal/mechanics.ts:maxLifeOf ({"file":"src/game/appraisal/mechanics.ts","line":42,"endLine":44})
- code:src/game/appraisal/mechanics.ts:wishSlotsOf ({"file":"src/game/appraisal/mechanics.ts","line":45,"endLine":45})
- code:src/game/appraisal/mechanics.ts:enforceCaps ({"file":"src/game/appraisal/mechanics.ts","line":47,"endLine":52})
- code:src/game/appraisal/mechanics.ts:stockBonus ({"file":"src/game/appraisal/mechanics.ts","line":54,"endLine":61})
- code:src/game/appraisal/mechanics.ts:omenNow ({"file":"src/game/appraisal/mechanics.ts","line":63,"endLine":63})
- code:src/game/appraisal/mechanics.ts:salePercent ({"file":"src/game/appraisal/mechanics.ts","line":68,"endLine":71})
- code:src/game/appraisal/mechanics.ts:saleAdjusted ({"file":"src/game/appraisal/mechanics.ts","line":72,"endLine":72})
- code:src/game/appraisal/mechanics.ts:salePreview ({"file":"src/game/appraisal/mechanics.ts","line":74,"endLine":74})
- code:src/game/appraisal/mechanics.ts:saleApply ({"file":"src/game/appraisal/mechanics.ts","line":76,"endLine":80})
- code:src/game/appraisal/mechanics.ts:feeSurcharge ({"file":"src/game/appraisal/mechanics.ts","line":82,"endLine":82})
- code:src/game/appraisal/mechanics.ts:grant ({"file":"src/game/appraisal/mechanics.ts","line":83,"endLine":97})
- code:src/game/appraisal/mechanics.ts:spend ({"file":"src/game/appraisal/mechanics.ts","line":98,"endLine":104})
- code:src/game/appraisal/mechanics.ts:reward ({"file":"src/game/appraisal/mechanics.ts","line":105,"endLine":110})
- code:src/game/appraisal/mechanics.ts:transfer ({"file":"src/game/appraisal/mechanics.ts","line":111,"endLine":115})
- code:src/game/appraisal/mechanics.ts:fundPassive ({"file":"src/game/appraisal/mechanics.ts","line":117,"endLine":120})
- code:src/game/appraisal/mechanics.ts:recover ({"file":"src/game/appraisal/mechanics.ts","line":121,"endLine":127})
- code:src/game/appraisal/mechanics.ts:healLife ({"file":"src/game/appraisal/mechanics.ts","line":128,"endLine":132})
- code:src/game/appraisal/mechanics.ts:damageLife ({"file":"src/game/appraisal/mechanics.ts","line":133,"endLine":141})
- code:src/game/appraisal/mechanics.ts:recoveryOffer ({"file":"src/game/appraisal/mechanics.ts","line":142,"endLine":153})
- code:src/game/appraisal/mechanics.ts:recoveryAmount ({"file":"src/game/appraisal/mechanics.ts","line":155,"endLine":158})
- code:src/game/appraisal/mechanics.ts:mendWithShards ({"file":"src/game/appraisal/mechanics.ts","line":160,"endLine":165})
- code:src/game/appraisal/mechanics.ts:gainShards ({"file":"src/game/appraisal/mechanics.ts","line":166,"endLine":173})
- code:src/game/appraisal/mechanics.ts:unlocked ({"file":"src/game/appraisal/mechanics.ts","line":174,"endLine":176})
- code:src/game/appraisal/mechanics.ts:ownedItem ({"file":"src/game/appraisal/mechanics.ts","line":177,"endLine":181})
- code:src/game/appraisal/mechanics.ts:retire ({"file":"src/game/appraisal/mechanics.ts","line":182,"endLine":188})
- code:src/game/appraisal/mechanics.ts:wealth ({"file":"src/game/appraisal/mechanics.ts","line":189,"endLine":193})
- code:src/game/appraisal/mechanics.ts:stockItem ({"file":"src/game/appraisal/mechanics.ts","line":194,"endLine":198})
- code:src/game/appraisal/mechanics.ts:known ({"file":"src/game/appraisal/mechanics.ts","line":199,"endLine":201})
- code:src/game/appraisal/mechanics.ts:learn ({"file":"src/game/appraisal/mechanics.ts","line":202,"endLine":204})
- code:src/game/appraisal/mechanics.ts:merchantActionFree ({"file":"src/game/appraisal/mechanics.ts","line":206,"endLine":209})
- code:src/game/appraisal/mechanics.ts:inspect ({"file":"src/game/appraisal/mechanics.ts","line":210,"endLine":244})
- code:src/game/appraisal/mechanics.ts:counterLimit ({"file":"src/game/appraisal/mechanics.ts","line":245,"endLine":245})
- code:src/game/appraisal/mechanics.ts:detectionRisk ({"file":"src/game/appraisal/mechanics.ts","line":246,"endLine":250})
- code:src/game/appraisal/mechanics.ts:appraise ({"file":"src/game/appraisal/mechanics.ts","line":251,"endLine":290})
- code:src/game/appraisal/mechanics.ts:npcQuote ({"file":"src/game/appraisal/mechanics.ts","line":291,"endLine":293})
- code:src/game/appraisal/mechanics.ts:completeAppraisedSale ({"file":"src/game/appraisal/mechanics.ts","line":295,"endLine":307})
- code:src/game/appraisal/mechanics.ts:payRebate ({"file":"src/game/appraisal/mechanics.ts","line":309,"endLine":315})
- code:src/game/appraisal/mechanics.ts:friendAppraised ({"file":"src/game/appraisal/mechanics.ts","line":317,"endLine":319})
- code:src/game/appraisal/mechanics.ts:inheritKnowledge ({"file":"src/game/appraisal/mechanics.ts","line":321,"endLine":330})
- code:src/game/appraisal/mechanics.ts:noteRepeatBuy ({"file":"src/game/appraisal/mechanics.ts","line":332,"endLine":342})
- code:src/game/appraisal/mechanics.ts:noteScrap ({"file":"src/game/appraisal/mechanics.ts","line":344,"endLine":357})
- code:src/game/appraisal/mechanics.ts:purchase ({"file":"src/game/appraisal/mechanics.ts","line":358,"endLine":398})
- code:src/game/appraisal/mechanics.ts:activate ({"file":"src/game/appraisal/mechanics.ts","line":399,"endLine":460})
- code:src/game/appraisal/mechanics.ts:activationNote ({"file":"src/game/appraisal/mechanics.ts","line":462,"endLine":473})
- code:src/game/appraisal/mechanics.ts:penaltyItem ({"file":"src/game/appraisal/mechanics.ts","line":474,"endLine":478})
- code:src/game/appraisal/mechanics.ts:kill ({"file":"src/game/appraisal/mechanics.ts","line":479,"endLine":483})
- code:src/game/appraisal/mechanics.ts:marketSell ({"file":"src/game/appraisal/mechanics.ts","line":484,"endLine":529})
- code:src/game/appraisal/cleanse.ts:cleanseOffer ({"file":"src/game/appraisal/cleanse.ts","line":23,"endLine":27})

## logic:L04 ซื้อและต่อรอง NPC

ส่วนลด โอกาสยอมรับ ราคาและจำนวนการต่อรอง

- code:src/game/appraisal/mechanics.ts:check ({"file":"src/game/appraisal/mechanics.ts","line":23,"endLine":25})
- code:src/game/appraisal/mechanics.ts:player ({"file":"src/game/appraisal/mechanics.ts","line":26,"endLine":29})
- code:src/game/appraisal/mechanics.ts:trace ({"file":"src/game/appraisal/mechanics.ts","line":30,"endLine":32})
- code:src/game/appraisal/mechanics.ts:status ({"file":"src/game/appraisal/mechanics.ts","line":33,"endLine":33})
- code:src/game/appraisal/mechanics.ts:consumeStatus ({"file":"src/game/appraisal/mechanics.ts","line":34,"endLine":36})
- code:src/game/appraisal/mechanics.ts:removeStatus ({"file":"src/game/appraisal/mechanics.ts","line":37,"endLine":37})
- code:src/game/appraisal/mechanics.ts:maxEnergyOf ({"file":"src/game/appraisal/mechanics.ts","line":39,"endLine":41})
- code:src/game/appraisal/mechanics.ts:maxLifeOf ({"file":"src/game/appraisal/mechanics.ts","line":42,"endLine":44})
- code:src/game/appraisal/mechanics.ts:wishSlotsOf ({"file":"src/game/appraisal/mechanics.ts","line":45,"endLine":45})
- code:src/game/appraisal/mechanics.ts:enforceCaps ({"file":"src/game/appraisal/mechanics.ts","line":47,"endLine":52})
- code:src/game/appraisal/mechanics.ts:stockBonus ({"file":"src/game/appraisal/mechanics.ts","line":54,"endLine":61})
- code:src/game/appraisal/mechanics.ts:omenNow ({"file":"src/game/appraisal/mechanics.ts","line":63,"endLine":63})
- code:src/game/appraisal/mechanics.ts:salePercent ({"file":"src/game/appraisal/mechanics.ts","line":68,"endLine":71})
- code:src/game/appraisal/mechanics.ts:saleAdjusted ({"file":"src/game/appraisal/mechanics.ts","line":72,"endLine":72})
- code:src/game/appraisal/mechanics.ts:salePreview ({"file":"src/game/appraisal/mechanics.ts","line":74,"endLine":74})
- code:src/game/appraisal/mechanics.ts:saleApply ({"file":"src/game/appraisal/mechanics.ts","line":76,"endLine":80})
- code:src/game/appraisal/mechanics.ts:feeSurcharge ({"file":"src/game/appraisal/mechanics.ts","line":82,"endLine":82})
- code:src/game/appraisal/mechanics.ts:grant ({"file":"src/game/appraisal/mechanics.ts","line":83,"endLine":97})
- code:src/game/appraisal/mechanics.ts:spend ({"file":"src/game/appraisal/mechanics.ts","line":98,"endLine":104})
- code:src/game/appraisal/mechanics.ts:reward ({"file":"src/game/appraisal/mechanics.ts","line":105,"endLine":110})
- code:src/game/appraisal/mechanics.ts:transfer ({"file":"src/game/appraisal/mechanics.ts","line":111,"endLine":115})
- code:src/game/appraisal/mechanics.ts:fundPassive ({"file":"src/game/appraisal/mechanics.ts","line":117,"endLine":120})
- code:src/game/appraisal/mechanics.ts:recover ({"file":"src/game/appraisal/mechanics.ts","line":121,"endLine":127})
- code:src/game/appraisal/mechanics.ts:healLife ({"file":"src/game/appraisal/mechanics.ts","line":128,"endLine":132})
- code:src/game/appraisal/mechanics.ts:damageLife ({"file":"src/game/appraisal/mechanics.ts","line":133,"endLine":141})
- code:src/game/appraisal/mechanics.ts:recoveryOffer ({"file":"src/game/appraisal/mechanics.ts","line":142,"endLine":153})
- code:src/game/appraisal/mechanics.ts:recoveryAmount ({"file":"src/game/appraisal/mechanics.ts","line":155,"endLine":158})
- code:src/game/appraisal/mechanics.ts:mendWithShards ({"file":"src/game/appraisal/mechanics.ts","line":160,"endLine":165})
- code:src/game/appraisal/mechanics.ts:gainShards ({"file":"src/game/appraisal/mechanics.ts","line":166,"endLine":173})
- code:src/game/appraisal/mechanics.ts:unlocked ({"file":"src/game/appraisal/mechanics.ts","line":174,"endLine":176})
- code:src/game/appraisal/mechanics.ts:ownedItem ({"file":"src/game/appraisal/mechanics.ts","line":177,"endLine":181})
- code:src/game/appraisal/mechanics.ts:retire ({"file":"src/game/appraisal/mechanics.ts","line":182,"endLine":188})
- code:src/game/appraisal/mechanics.ts:wealth ({"file":"src/game/appraisal/mechanics.ts","line":189,"endLine":193})
- code:src/game/appraisal/mechanics.ts:stockItem ({"file":"src/game/appraisal/mechanics.ts","line":194,"endLine":198})
- code:src/game/appraisal/mechanics.ts:known ({"file":"src/game/appraisal/mechanics.ts","line":199,"endLine":201})
- code:src/game/appraisal/mechanics.ts:learn ({"file":"src/game/appraisal/mechanics.ts","line":202,"endLine":204})
- code:src/game/appraisal/mechanics.ts:merchantActionFree ({"file":"src/game/appraisal/mechanics.ts","line":206,"endLine":209})
- code:src/game/appraisal/mechanics.ts:inspect ({"file":"src/game/appraisal/mechanics.ts","line":210,"endLine":244})
- code:src/game/appraisal/mechanics.ts:counterLimit ({"file":"src/game/appraisal/mechanics.ts","line":245,"endLine":245})
- code:src/game/appraisal/mechanics.ts:detectionRisk ({"file":"src/game/appraisal/mechanics.ts","line":246,"endLine":250})
- code:src/game/appraisal/mechanics.ts:appraise ({"file":"src/game/appraisal/mechanics.ts","line":251,"endLine":290})
- code:src/game/appraisal/mechanics.ts:npcQuote ({"file":"src/game/appraisal/mechanics.ts","line":291,"endLine":293})
- code:src/game/appraisal/mechanics.ts:completeAppraisedSale ({"file":"src/game/appraisal/mechanics.ts","line":295,"endLine":307})
- code:src/game/appraisal/mechanics.ts:payRebate ({"file":"src/game/appraisal/mechanics.ts","line":309,"endLine":315})
- code:src/game/appraisal/mechanics.ts:friendAppraised ({"file":"src/game/appraisal/mechanics.ts","line":317,"endLine":319})
- code:src/game/appraisal/mechanics.ts:inheritKnowledge ({"file":"src/game/appraisal/mechanics.ts","line":321,"endLine":330})
- code:src/game/appraisal/mechanics.ts:noteRepeatBuy ({"file":"src/game/appraisal/mechanics.ts","line":332,"endLine":342})
- code:src/game/appraisal/mechanics.ts:noteScrap ({"file":"src/game/appraisal/mechanics.ts","line":344,"endLine":357})
- code:src/game/appraisal/mechanics.ts:purchase ({"file":"src/game/appraisal/mechanics.ts","line":358,"endLine":398})
- code:src/game/appraisal/mechanics.ts:activate ({"file":"src/game/appraisal/mechanics.ts","line":399,"endLine":460})
- code:src/game/appraisal/mechanics.ts:activationNote ({"file":"src/game/appraisal/mechanics.ts","line":462,"endLine":473})
- code:src/game/appraisal/mechanics.ts:penaltyItem ({"file":"src/game/appraisal/mechanics.ts","line":474,"endLine":478})
- code:src/game/appraisal/mechanics.ts:kill ({"file":"src/game/appraisal/mechanics.ts","line":479,"endLine":483})
- code:src/game/appraisal/mechanics.ts:marketSell ({"file":"src/game/appraisal/mechanics.ts","line":484,"endLine":529})
- code:src/game/appraisal/market-contracts.ts:trustAcceptanceBonus ({"file":"src/game/appraisal/market-contracts.ts","line":4,"endLine":4})
- code:src/game/appraisal/mechanics.ts:purchase ({"file":"src/game/appraisal/mechanics.ts","line":358,"endLine":398})

## logic:L05 ขาย/ค่านายหน้า/ระบาย

ผลจากการขายจริง ค่านายหน้า กำไรและระบายของ

- code:src/game/appraisal/mechanics.ts:salePreview ({"file":"src/game/appraisal/mechanics.ts","line":74,"endLine":74})

## logic:L06 ซื้อขายระหว่างผู้เล่น

คู่ค้า การแลกของ ข้อมูลรับรองและการรับข้อเสนอ

- code:src/game/appraisal/engine.ts:propose ({"file":"src/game/appraisal/engine.ts","line":240,"endLine":258})
- code:src/game/appraisal/engine.ts:respond ({"file":"src/game/appraisal/engine.ts","line":278,"endLine":309})

## logic:L07 ตลาดมืดและของค้าง

เงื่อนไขรับซื้อ งบ และการรับคืนของค้าง

- code:src/game/appraisal/market-contracts.ts:TRUST_CAP ({"file":"src/game/appraisal/market-contracts.ts","line":3,"endLine":3})
- code:src/game/appraisal/market-contracts.ts:trustAcceptanceBonus ({"file":"src/game/appraisal/market-contracts.ts","line":4,"endLine":4})
- code:src/game/appraisal/market-contracts.ts:marketOrderReserve ({"file":"src/game/appraisal/market-contracts.ts","line":5,"endLine":5})
- code:src/game/appraisal/market-contracts.ts:marketConditionMatch ({"file":"src/game/appraisal/market-contracts.ts","line":7,"endLine":10})
- code:src/game/appraisal/market-contracts.ts:makeMarketContract ({"file":"src/game/appraisal/market-contracts.ts","line":11,"endLine":22})
- code:src/game/appraisal/engine.ts:makeMarket ({"file":"src/game/appraisal/engine.ts","line":157,"endLine":177})
- code:src/game/appraisal/views.ts:marketView ({"file":"src/game/appraisal/views.ts","line":19,"endLine":22})

## logic:L08 ประมูล

ล็อต การเสนอราคา ผู้ชนะและข้อมูลล็อต

- code:src/game/appraisal/market-contracts.ts:TRUST_CAP ({"file":"src/game/appraisal/market-contracts.ts","line":3,"endLine":3})
- code:src/game/appraisal/market-contracts.ts:trustAcceptanceBonus ({"file":"src/game/appraisal/market-contracts.ts","line":4,"endLine":4})
- code:src/game/appraisal/market-contracts.ts:marketOrderReserve ({"file":"src/game/appraisal/market-contracts.ts","line":5,"endLine":5})
- code:src/game/appraisal/market-contracts.ts:marketConditionMatch ({"file":"src/game/appraisal/market-contracts.ts","line":7,"endLine":10})
- code:src/game/appraisal/market-contracts.ts:makeMarketContract ({"file":"src/game/appraisal/market-contracts.ts","line":11,"endLine":22})

## logic:L09 Rarity

อัตราสร้าง rarity; แยกจากตัวคูณทั่วไปที่สินค้าทุกชิ้นได้รับ

- code:src/shared/rarity-power.ts:rarityPowerFor ({"file":"src/shared/rarity-power.ts","line":21,"endLine":23})
- code:src/shared/rarity-power.ts:rarityValue ({"file":"src/shared/rarity-power.ts","line":28,"endLine":28})
- code:src/shared/rarity-power.ts:rarityEffect ({"file":"src/shared/rarity-power.ts","line":29,"endLine":29})

## logic:L10 ความไว้ใจและสต็อก

ความไว้ใจ โบนัสจำนวนสินค้า และการลดความไว้ใจ

- code:src/game/appraisal/cleanse.ts:trustOf ({"file":"src/game/appraisal/cleanse.ts","line":11,"endLine":11})
- code:src/game/appraisal/core2-actions.ts:trustOf ({"file":"src/game/appraisal/core2-actions.ts","line":16,"endLine":16})
- code:src/game/appraisal/core2-actions.ts:loseTrust ({"file":"src/game/appraisal/core2-actions.ts","line":17,"endLine":19})
- code:src/game/appraisal/mechanics.ts:stockBonus ({"file":"src/game/appraisal/mechanics.ts","line":54,"endLine":61})
- code:src/game/appraisal/pulse.ts:extraStock ({"file":"src/game/appraisal/pulse.ts","line":26,"endLine":26})

## logic:L11 ความสามารถพ่อค้า

เวลารอ ระดับที่ปลดล็อกและตัวเลือกของความสามารถ

- code:src/game/appraisal/ability-rules.ts:MERCHANT_ABILITIES ({"file":"src/game/appraisal/ability-rules.ts","line":3,"endLine":12})
- code:src/game/appraisal/ability-rules.ts:abilityTier ({"file":"src/game/appraisal/ability-rules.ts","line":13,"endLine":13})
- code:src/game/appraisal/ability-rules.ts:abilityRemaining ({"file":"src/game/appraisal/ability-rules.ts","line":14,"endLine":14})
- code:src/game/appraisal/ability-rules.ts:reducibleCooldown ({"file":"src/game/appraisal/ability-rules.ts","line":16,"endLine":19})
- code:src/game/appraisal/ability-rules.ts:reduceAbilityCooldown ({"file":"src/game/appraisal/ability-rules.ts","line":20,"endLine":24})
- code:src/game/appraisal/merchant-abilities.ts:merchantAbilityViews ({"file":"src/game/appraisal/merchant-abilities.ts","line":21,"endLine":29})

## logic:L12 ประตูและเส้นทาง

เปลี่ยน/เปิดประตูและเบาะแสก่อนเลือก

- code:src/game/appraisal/engine.ts:generatePortals ({"file":"src/game/appraisal/engine.ts","line":131,"endLine":139})
- code:src/game/appraisal/engine.ts:rerollPortal ({"file":"src/game/appraisal/engine.ts","line":141,"endLine":155})

## logic:L13 ขโมยเชิงรุก RPS

ต้นทุนและความได้เปรียบต้องคงการเข้าร่วมแบบบังคับ

- code:src/game/appraisal/theft.ts:PVP_COOLDOWN_ENCOUNTERS ({"file":"src/game/appraisal/theft.ts","line":78,"endLine":78})
- code:src/game/appraisal/theft.ts:PVP_COMPENSATION_PERCENT ({"file":"src/game/appraisal/theft.ts","line":79,"endLine":79})
- code:src/game/appraisal/theft.ts:PVP_COMPENSATION_INSTALLMENTS ({"file":"src/game/appraisal/theft.ts","line":80,"endLine":80})
- code:src/game/appraisal/theft.ts:pvpBlockedUntil ({"file":"src/game/appraisal/theft.ts","line":81,"endLine":84})
- code:src/game/appraisal/theft.ts:hands ({"file":"src/game/appraisal/theft.ts","line":85,"endLine":85})
- code:src/game/appraisal/theft.ts:npcTells ({"file":"src/game/appraisal/theft.ts","line":86,"endLine":95})
- code:src/game/appraisal/theft.ts:npcTheftTell ({"file":"src/game/appraisal/theft.ts","line":97,"endLine":99})
- code:src/game/appraisal/theft.ts:opponentKey ({"file":"src/game/appraisal/theft.ts","line":100,"endLine":100})
- code:src/game/appraisal/theft.ts:note ({"file":"src/game/appraisal/theft.ts","line":101,"endLine":101})
- code:src/game/appraisal/theft.ts:openDuel ({"file":"src/game/appraisal/theft.ts","line":102,"endLine":102})
- code:src/game/appraisal/theft.ts:eligibleItems ({"file":"src/game/appraisal/theft.ts","line":105,"endLine":111})
- code:src/game/appraisal/theft.ts:npcHand ({"file":"src/game/appraisal/theft.ts","line":113,"endLine":119})
- code:src/game/appraisal/theft.ts:merchantTradeBanned ({"file":"src/game/appraisal/theft.ts","line":121,"endLine":124})
- code:src/game/appraisal/theft.ts:startTheftDuel ({"file":"src/game/appraisal/theft.ts","line":127,"endLine":159})
- code:src/game/appraisal/theft.ts:stillEligible ({"file":"src/game/appraisal/theft.ts","line":161,"endLine":171})
- code:src/game/appraisal/theft.ts:cancelTheftDuels ({"file":"src/game/appraisal/theft.ts","line":174,"endLine":180})
- code:src/game/appraisal/theft.ts:expireTheftDuel ({"file":"src/game/appraisal/theft.ts","line":183,"endLine":192})
- code:src/game/appraisal/theft.ts:playerFailure ({"file":"src/game/appraisal/theft.ts","line":195,"endLine":210})
- code:src/game/appraisal/theft.ts:linkedThiefEdge ({"file":"src/game/appraisal/theft.ts","line":213,"endLine":214})
- code:src/game/appraisal/theft.ts:breakTie ({"file":"src/game/appraisal/theft.ts","line":216,"endLine":224})
- code:src/game/appraisal/theft.ts:merchantFailure ({"file":"src/game/appraisal/theft.ts","line":226,"endLine":239})
- code:src/game/appraisal/theft.ts:chooseTheftHand ({"file":"src/game/appraisal/theft.ts","line":241,"endLine":282})
- code:src/game/appraisal/theft.ts:gone ({"file":"src/game/appraisal/theft.ts","line":284,"endLine":284})
- code:src/game/appraisal/theft.ts:collectCompensations ({"file":"src/game/appraisal/theft.ts","line":289,"endLine":301})
- code:src/game/appraisal/theft.ts:noticePrice ({"file":"src/game/appraisal/theft.ts","line":304,"endLine":304})
- code:src/game/appraisal/theft.ts:clearCrime ({"file":"src/game/appraisal/theft.ts","line":307,"endLine":315})
- code:src/game/appraisal/theft.ts:tieView ({"file":"src/game/appraisal/theft.ts","line":318,"endLine":321})
- code:src/game/appraisal/theft.ts:theftViewFor ({"file":"src/game/appraisal/theft.ts","line":324,"endLine":345})
- code:src/game/appraisal/theft.ts:startTheftDuel ({"file":"src/game/appraisal/theft.ts","line":127,"endLine":159})
- code:src/game/appraisal/theft.ts:chooseTheftHand ({"file":"src/game/appraisal/theft.ts","line":241,"endLine":282})

## logic:L14 บรรเทาผลถูกขโมย

ประกัน/บรรเทาหลังผลดวล ห้ามใช้ปฏิเสธหรือยกเลิก RPS

- code:src/game/appraisal/theft.ts:PVP_COOLDOWN_ENCOUNTERS ({"file":"src/game/appraisal/theft.ts","line":78,"endLine":78})
- code:src/game/appraisal/theft.ts:PVP_COMPENSATION_PERCENT ({"file":"src/game/appraisal/theft.ts","line":79,"endLine":79})
- code:src/game/appraisal/theft.ts:PVP_COMPENSATION_INSTALLMENTS ({"file":"src/game/appraisal/theft.ts","line":80,"endLine":80})
- code:src/game/appraisal/theft.ts:pvpBlockedUntil ({"file":"src/game/appraisal/theft.ts","line":81,"endLine":84})
- code:src/game/appraisal/theft.ts:hands ({"file":"src/game/appraisal/theft.ts","line":85,"endLine":85})
- code:src/game/appraisal/theft.ts:npcTells ({"file":"src/game/appraisal/theft.ts","line":86,"endLine":95})
- code:src/game/appraisal/theft.ts:npcTheftTell ({"file":"src/game/appraisal/theft.ts","line":97,"endLine":99})
- code:src/game/appraisal/theft.ts:opponentKey ({"file":"src/game/appraisal/theft.ts","line":100,"endLine":100})
- code:src/game/appraisal/theft.ts:note ({"file":"src/game/appraisal/theft.ts","line":101,"endLine":101})
- code:src/game/appraisal/theft.ts:openDuel ({"file":"src/game/appraisal/theft.ts","line":102,"endLine":102})
- code:src/game/appraisal/theft.ts:eligibleItems ({"file":"src/game/appraisal/theft.ts","line":105,"endLine":111})
- code:src/game/appraisal/theft.ts:npcHand ({"file":"src/game/appraisal/theft.ts","line":113,"endLine":119})
- code:src/game/appraisal/theft.ts:merchantTradeBanned ({"file":"src/game/appraisal/theft.ts","line":121,"endLine":124})
- code:src/game/appraisal/theft.ts:startTheftDuel ({"file":"src/game/appraisal/theft.ts","line":127,"endLine":159})
- code:src/game/appraisal/theft.ts:stillEligible ({"file":"src/game/appraisal/theft.ts","line":161,"endLine":171})
- code:src/game/appraisal/theft.ts:cancelTheftDuels ({"file":"src/game/appraisal/theft.ts","line":174,"endLine":180})
- code:src/game/appraisal/theft.ts:expireTheftDuel ({"file":"src/game/appraisal/theft.ts","line":183,"endLine":192})
- code:src/game/appraisal/theft.ts:playerFailure ({"file":"src/game/appraisal/theft.ts","line":195,"endLine":210})
- code:src/game/appraisal/theft.ts:linkedThiefEdge ({"file":"src/game/appraisal/theft.ts","line":213,"endLine":214})
- code:src/game/appraisal/theft.ts:breakTie ({"file":"src/game/appraisal/theft.ts","line":216,"endLine":224})
- code:src/game/appraisal/theft.ts:merchantFailure ({"file":"src/game/appraisal/theft.ts","line":226,"endLine":239})
- code:src/game/appraisal/theft.ts:chooseTheftHand ({"file":"src/game/appraisal/theft.ts","line":241,"endLine":282})
- code:src/game/appraisal/theft.ts:gone ({"file":"src/game/appraisal/theft.ts","line":284,"endLine":284})
- code:src/game/appraisal/theft.ts:collectCompensations ({"file":"src/game/appraisal/theft.ts","line":289,"endLine":301})
- code:src/game/appraisal/theft.ts:noticePrice ({"file":"src/game/appraisal/theft.ts","line":304,"endLine":304})
- code:src/game/appraisal/theft.ts:clearCrime ({"file":"src/game/appraisal/theft.ts","line":307,"endLine":315})
- code:src/game/appraisal/theft.ts:tieView ({"file":"src/game/appraisal/theft.ts","line":318,"endLine":321})
- code:src/game/appraisal/theft.ts:theftViewFor ({"file":"src/game/appraisal/theft.ts","line":324,"endLine":345})
- code:src/game/appraisal/core2-actions.ts:stealChance ({"file":"src/game/appraisal/core2-actions.ts","line":21,"endLine":23})

## logic:L15 อาชญากรรมและค่าชดเชย

ประวัติ แบนการค้า ชดเชย และล้างประวัติ

- code:src/game/appraisal/theft.ts:PVP_COOLDOWN_ENCOUNTERS ({"file":"src/game/appraisal/theft.ts","line":78,"endLine":78})
- code:src/game/appraisal/theft.ts:PVP_COMPENSATION_PERCENT ({"file":"src/game/appraisal/theft.ts","line":79,"endLine":79})
- code:src/game/appraisal/theft.ts:PVP_COMPENSATION_INSTALLMENTS ({"file":"src/game/appraisal/theft.ts","line":80,"endLine":80})
- code:src/game/appraisal/theft.ts:pvpBlockedUntil ({"file":"src/game/appraisal/theft.ts","line":81,"endLine":84})
- code:src/game/appraisal/theft.ts:hands ({"file":"src/game/appraisal/theft.ts","line":85,"endLine":85})
- code:src/game/appraisal/theft.ts:npcTells ({"file":"src/game/appraisal/theft.ts","line":86,"endLine":95})
- code:src/game/appraisal/theft.ts:npcTheftTell ({"file":"src/game/appraisal/theft.ts","line":97,"endLine":99})
- code:src/game/appraisal/theft.ts:opponentKey ({"file":"src/game/appraisal/theft.ts","line":100,"endLine":100})
- code:src/game/appraisal/theft.ts:note ({"file":"src/game/appraisal/theft.ts","line":101,"endLine":101})
- code:src/game/appraisal/theft.ts:openDuel ({"file":"src/game/appraisal/theft.ts","line":102,"endLine":102})
- code:src/game/appraisal/theft.ts:eligibleItems ({"file":"src/game/appraisal/theft.ts","line":105,"endLine":111})
- code:src/game/appraisal/theft.ts:npcHand ({"file":"src/game/appraisal/theft.ts","line":113,"endLine":119})
- code:src/game/appraisal/theft.ts:merchantTradeBanned ({"file":"src/game/appraisal/theft.ts","line":121,"endLine":124})
- code:src/game/appraisal/theft.ts:startTheftDuel ({"file":"src/game/appraisal/theft.ts","line":127,"endLine":159})
- code:src/game/appraisal/theft.ts:stillEligible ({"file":"src/game/appraisal/theft.ts","line":161,"endLine":171})
- code:src/game/appraisal/theft.ts:cancelTheftDuels ({"file":"src/game/appraisal/theft.ts","line":174,"endLine":180})
- code:src/game/appraisal/theft.ts:expireTheftDuel ({"file":"src/game/appraisal/theft.ts","line":183,"endLine":192})
- code:src/game/appraisal/theft.ts:playerFailure ({"file":"src/game/appraisal/theft.ts","line":195,"endLine":210})
- code:src/game/appraisal/theft.ts:linkedThiefEdge ({"file":"src/game/appraisal/theft.ts","line":213,"endLine":214})
- code:src/game/appraisal/theft.ts:breakTie ({"file":"src/game/appraisal/theft.ts","line":216,"endLine":224})
- code:src/game/appraisal/theft.ts:merchantFailure ({"file":"src/game/appraisal/theft.ts","line":226,"endLine":239})
- code:src/game/appraisal/theft.ts:chooseTheftHand ({"file":"src/game/appraisal/theft.ts","line":241,"endLine":282})
- code:src/game/appraisal/theft.ts:gone ({"file":"src/game/appraisal/theft.ts","line":284,"endLine":284})
- code:src/game/appraisal/theft.ts:collectCompensations ({"file":"src/game/appraisal/theft.ts","line":289,"endLine":301})
- code:src/game/appraisal/theft.ts:noticePrice ({"file":"src/game/appraisal/theft.ts","line":304,"endLine":304})
- code:src/game/appraisal/theft.ts:clearCrime ({"file":"src/game/appraisal/theft.ts","line":307,"endLine":315})
- code:src/game/appraisal/theft.ts:tieView ({"file":"src/game/appraisal/theft.ts","line":318,"endLine":321})
- code:src/game/appraisal/theft.ts:theftViewFor ({"file":"src/game/appraisal/theft.ts","line":324,"endLine":345})
- code:src/game/appraisal/theft.ts:collectCompensations ({"file":"src/game/appraisal/theft.ts","line":289,"endLine":301})

## logic:L16 ดอกเบี้ยเงินฝาก

นับเฉพาะเงินก้อนเดิมครบช่วง ถอน/เติมใหม่ห้ามรับทันที

- code:src/game/appraisal/secure-storage.ts:VAULT_INTEREST_PERCENT ({"file":"src/game/appraisal/secure-storage.ts","line":4,"endLine":4})
- code:src/game/appraisal/secure-storage.ts:vaultInterestOf ({"file":"src/game/appraisal/secure-storage.ts","line":5,"endLine":5})
- code:src/game/appraisal/secure-storage.ts:nextVaultInterest ({"file":"src/game/appraisal/secure-storage.ts","line":7,"endLine":9})
- code:src/game/appraisal/secure-storage.ts:positive ({"file":"src/game/appraisal/secure-storage.ts","line":28,"endLine":30})
- code:src/game/appraisal/secure-storage.ts:addable ({"file":"src/game/appraisal/secure-storage.ts","line":31,"endLine":33})
- code:src/game/appraisal/secure-storage.ts:enabled ({"file":"src/game/appraisal/secure-storage.ts","line":34,"endLine":37})
- code:src/game/appraisal/secure-storage.ts:afterReward ({"file":"src/game/appraisal/secure-storage.ts","line":38,"endLine":40})
- code:src/game/appraisal/secure-storage.ts:loanWindow ({"file":"src/game/appraisal/secure-storage.ts","line":41,"endLine":44})
- code:src/game/appraisal/secure-storage.ts:movable ({"file":"src/game/appraisal/secure-storage.ts","line":45,"endLine":48})
- code:src/game/appraisal/secure-storage.ts:removeFromHand ({"file":"src/game/appraisal/secure-storage.ts","line":49,"endLine":52})
- code:src/game/appraisal/secure-storage.ts:quoteVaultExpansion ({"file":"src/game/appraisal/secure-storage.ts","line":53,"endLine":56})
- code:src/game/appraisal/secure-storage.ts:quoteLoanDeadline ({"file":"src/game/appraisal/secure-storage.ts","line":58,"endLine":65})
- code:src/game/appraisal/secure-storage.ts:firstPayout ({"file":"src/game/appraisal/secure-storage.ts","line":66,"endLine":69})
- code:src/game/appraisal/secure-storage.ts:handleStorageAction ({"file":"src/game/appraisal/secure-storage.ts","line":70,"endLine":102})
- code:src/game/appraisal/secure-storage.ts:loanOf ({"file":"src/game/appraisal/secure-storage.ts","line":103,"endLine":106})
- code:src/game/appraisal/secure-storage.ts:pending ({"file":"src/game/appraisal/secure-storage.ts","line":107,"endLine":109})
- code:src/game/appraisal/secure-storage.ts:termsOf ({"file":"src/game/appraisal/secure-storage.ts","line":110,"endLine":112})
- code:src/game/appraisal/secure-storage.ts:validPrincipal ({"file":"src/game/appraisal/secure-storage.ts","line":113,"endLine":115})
- code:src/game/appraisal/secure-storage.ts:collateral ({"file":"src/game/appraisal/secure-storage.ts","line":116,"endLine":120})
- code:src/game/appraisal/secure-storage.ts:returnCollateral ({"file":"src/game/appraisal/secure-storage.ts","line":121,"endLine":125})
- code:src/game/appraisal/secure-storage.ts:handleLoanAction ({"file":"src/game/appraisal/secure-storage.ts","line":126,"endLine":173})
- code:src/game/appraisal/secure-storage.ts:settleLoansBeforeAdvance ({"file":"src/game/appraisal/secure-storage.ts","line":178,"endLine":191})
- code:src/game/appraisal/secure-storage.ts:payVaultInterest ({"file":"src/game/appraisal/secure-storage.ts","line":196,"endLine":212})
- code:src/game/appraisal/secure-storage.ts:loanViewFor ({"file":"src/game/appraisal/secure-storage.ts","line":213,"endLine":215})
- code:src/game/appraisal/secure-storage.ts:secureStorageInvariants ({"file":"src/game/appraisal/secure-storage.ts","line":216,"endLine":235})
- code:src/game/appraisal/secure-storage.ts:ownedAssetItemIds ({"file":"src/game/appraisal/secure-storage.ts","line":238,"endLine":240})
- code:src/game/appraisal/secure-storage.ts:vaultInterestOf ({"file":"src/game/appraisal/secure-storage.ts","line":5,"endLine":5})
- code:src/game/appraisal/secure-storage.ts:payVaultInterest ({"file":"src/game/appraisal/secure-storage.ts","line":196,"endLine":212})

## logic:L17 พื้นที่และการขยาย Vault

ราคาขยายและจำนวนช่อง ไม่รวมดอกเบี้ย

- code:src/game/appraisal/secure-storage.ts:VAULT_INTEREST_PERCENT ({"file":"src/game/appraisal/secure-storage.ts","line":4,"endLine":4})
- code:src/game/appraisal/secure-storage.ts:vaultInterestOf ({"file":"src/game/appraisal/secure-storage.ts","line":5,"endLine":5})
- code:src/game/appraisal/secure-storage.ts:nextVaultInterest ({"file":"src/game/appraisal/secure-storage.ts","line":7,"endLine":9})
- code:src/game/appraisal/secure-storage.ts:positive ({"file":"src/game/appraisal/secure-storage.ts","line":28,"endLine":30})
- code:src/game/appraisal/secure-storage.ts:addable ({"file":"src/game/appraisal/secure-storage.ts","line":31,"endLine":33})
- code:src/game/appraisal/secure-storage.ts:enabled ({"file":"src/game/appraisal/secure-storage.ts","line":34,"endLine":37})
- code:src/game/appraisal/secure-storage.ts:afterReward ({"file":"src/game/appraisal/secure-storage.ts","line":38,"endLine":40})
- code:src/game/appraisal/secure-storage.ts:loanWindow ({"file":"src/game/appraisal/secure-storage.ts","line":41,"endLine":44})
- code:src/game/appraisal/secure-storage.ts:movable ({"file":"src/game/appraisal/secure-storage.ts","line":45,"endLine":48})
- code:src/game/appraisal/secure-storage.ts:removeFromHand ({"file":"src/game/appraisal/secure-storage.ts","line":49,"endLine":52})
- code:src/game/appraisal/secure-storage.ts:quoteVaultExpansion ({"file":"src/game/appraisal/secure-storage.ts","line":53,"endLine":56})
- code:src/game/appraisal/secure-storage.ts:quoteLoanDeadline ({"file":"src/game/appraisal/secure-storage.ts","line":58,"endLine":65})
- code:src/game/appraisal/secure-storage.ts:firstPayout ({"file":"src/game/appraisal/secure-storage.ts","line":66,"endLine":69})
- code:src/game/appraisal/secure-storage.ts:handleStorageAction ({"file":"src/game/appraisal/secure-storage.ts","line":70,"endLine":102})
- code:src/game/appraisal/secure-storage.ts:loanOf ({"file":"src/game/appraisal/secure-storage.ts","line":103,"endLine":106})
- code:src/game/appraisal/secure-storage.ts:pending ({"file":"src/game/appraisal/secure-storage.ts","line":107,"endLine":109})
- code:src/game/appraisal/secure-storage.ts:termsOf ({"file":"src/game/appraisal/secure-storage.ts","line":110,"endLine":112})
- code:src/game/appraisal/secure-storage.ts:validPrincipal ({"file":"src/game/appraisal/secure-storage.ts","line":113,"endLine":115})
- code:src/game/appraisal/secure-storage.ts:collateral ({"file":"src/game/appraisal/secure-storage.ts","line":116,"endLine":120})
- code:src/game/appraisal/secure-storage.ts:returnCollateral ({"file":"src/game/appraisal/secure-storage.ts","line":121,"endLine":125})
- code:src/game/appraisal/secure-storage.ts:handleLoanAction ({"file":"src/game/appraisal/secure-storage.ts","line":126,"endLine":173})
- code:src/game/appraisal/secure-storage.ts:settleLoansBeforeAdvance ({"file":"src/game/appraisal/secure-storage.ts","line":178,"endLine":191})
- code:src/game/appraisal/secure-storage.ts:payVaultInterest ({"file":"src/game/appraisal/secure-storage.ts","line":196,"endLine":212})
- code:src/game/appraisal/secure-storage.ts:loanViewFor ({"file":"src/game/appraisal/secure-storage.ts","line":213,"endLine":215})
- code:src/game/appraisal/secure-storage.ts:secureStorageInvariants ({"file":"src/game/appraisal/secure-storage.ts","line":216,"endLine":235})
- code:src/game/appraisal/secure-storage.ts:ownedAssetItemIds ({"file":"src/game/appraisal/secure-storage.ts","line":238,"endLine":240})
- code:src/game/appraisal/secure-storage.ts:quoteVaultExpansion ({"file":"src/game/appraisal/secure-storage.ts","line":53,"endLine":56})

## logic:L18 เงินกู้มีหลักประกัน

เงินต้น คืนครบ ผลตอบแทนและกำหนดที่ทั้งคู่ยอมรับ

- code:src/game/appraisal/secure-storage.ts:handleLoanAction ({"file":"src/game/appraisal/secure-storage.ts","line":126,"endLine":173})
- code:src/game/appraisal/secure-storage.ts:settleLoansBeforeAdvance ({"file":"src/game/appraisal/secure-storage.ts","line":178,"endLine":191})

## logic:L19 ตราบาป

แลกตราและใช้ตราคนเดียวกันสองใบยึดของแบบปกปิด

- code:src/game/appraisal/seals.ts:SEALS_PER_REDEMPTION ({"file":"src/game/appraisal/seals.ts","line":7,"endLine":7})
- code:src/game/appraisal/seals.ts:REDEMPTION_CHOICES ({"file":"src/game/appraisal/seals.ts","line":8,"endLine":8})
- code:src/game/appraisal/seals.ts:seals ({"file":"src/game/appraisal/seals.ts","line":49,"endLine":49})
- code:src/game/appraisal/seals.ts:offers ({"file":"src/game/appraisal/seals.ts","line":50,"endLine":50})
- code:src/game/appraisal/seals.ts:redemptions ({"file":"src/game/appraisal/seals.ts","line":51,"endLine":51})
- code:src/game/appraisal/seals.ts:alive ({"file":"src/game/appraisal/seals.ts","line":52,"endLine":52})
- code:src/game/appraisal/seals.ts:text ({"file":"src/game/appraisal/seals.ts","line":53,"endLine":56})
- code:src/game/appraisal/seals.ts:amount ({"file":"src/game/appraisal/seals.ts","line":57,"endLine":57})
- code:src/game/appraisal/seals.ts:lockedSealIds ({"file":"src/game/appraisal/seals.ts","line":59,"endLine":62})
- code:src/game/appraisal/seals.ts:ownSeal ({"file":"src/game/appraisal/seals.ts","line":63,"endLine":68})
- code:src/game/appraisal/seals.ts:moveGoods ({"file":"src/game/appraisal/seals.ts","line":69,"endLine":74})
- code:src/game/appraisal/seals.ts:offerSeal ({"file":"src/game/appraisal/seals.ts","line":76,"endLine":88})
- code:src/game/appraisal/seals.ts:respondOffer ({"file":"src/game/appraisal/seals.ts","line":90,"endLine":115})
- code:src/game/appraisal/seals.ts:redeem ({"file":"src/game/appraisal/seals.ts","line":118,"endLine":135})
- code:src/game/appraisal/seals.ts:pick ({"file":"src/game/appraisal/seals.ts","line":137,"endLine":157})
- code:src/game/appraisal/seals.ts:handleSealAction ({"file":"src/game/appraisal/seals.ts","line":159,"endLine":172})
- code:src/game/appraisal/seals.ts:closeSealOffers ({"file":"src/game/appraisal/seals.ts","line":175,"endLine":178})
- code:src/game/appraisal/seals.ts:sealMarketViewFor ({"file":"src/game/appraisal/seals.ts","line":180,"endLine":191})
- code:src/game/appraisal/seals.ts:sealInvariants ({"file":"src/game/appraisal/seals.ts","line":193,"endLine":200})
- code:src/game/appraisal/seals.ts:handleSealAction ({"file":"src/game/appraisal/seals.ts","line":159,"endLine":172})
- code:src/game/appraisal/seals.ts:closeSealOffers ({"file":"src/game/appraisal/seals.ts","line":175,"endLine":178})

## logic:L20 สัญญารับซื้อ Wishlist NPC

NPC ขอซื้อของจากผู้เล่น; ไม่ใช่ Collector Wishlist

- code:src/game/appraisal/wishlist-rules.ts:WISH_PREMIUM ({"file":"src/game/appraisal/wishlist-rules.ts","line":5,"endLine":5})
- code:src/game/appraisal/wishlist-rules.ts:WISH_PROBABILITY ({"file":"src/game/appraisal/wishlist-rules.ts","line":7,"endLine":7})
- code:src/game/appraisal/wishlist-rules.ts:WISH_MARKUPS ({"file":"src/game/appraisal/wishlist-rules.ts","line":9,"endLine":9})
- code:src/game/appraisal/wishlist-rules.ts:WISH_BASE_CHANCE ({"file":"src/game/appraisal/wishlist-rules.ts","line":10,"endLine":10})
- code:src/game/appraisal/wishlist-rules.ts:WISH_MARKUP_PENALTY ({"file":"src/game/appraisal/wishlist-rules.ts","line":11,"endLine":11})
- code:src/game/appraisal/wishlist-rules.ts:WISH_TRUST_BONUS ({"file":"src/game/appraisal/wishlist-rules.ts","line":12,"endLine":12})
- code:src/game/appraisal/wishlist-rules.ts:WISH_STATUS_STEP ({"file":"src/game/appraisal/wishlist-rules.ts","line":13,"endLine":13})
- code:src/game/appraisal/wishlist-rules.ts:WISH_CAP ({"file":"src/game/appraisal/wishlist-rules.ts","line":14,"endLine":14})
- code:src/game/appraisal/wishlist-rules.ts:WISH_FLOOR ({"file":"src/game/appraisal/wishlist-rules.ts","line":15,"endLine":15})
- code:src/game/appraisal/wishlist-rules.ts:wishPrice ({"file":"src/game/appraisal/wishlist-rules.ts","line":16,"endLine":16})
- code:src/game/appraisal/wishlist-rules.ts:wishAsk ({"file":"src/game/appraisal/wishlist-rules.ts","line":17,"endLine":17})
- code:src/game/appraisal/wishlist-rules.ts:wishChance ({"file":"src/game/appraisal/wishlist-rules.ts","line":19,"endLine":22})
- code:src/game/appraisal/wishlist-rules.ts:WISH_ENERGY ({"file":"src/game/appraisal/wishlist-rules.ts","line":24,"endLine":24})
- code:src/game/appraisal/wishlist-rules.ts:WISH_MAX_ACTIVE ({"file":"src/game/appraisal/wishlist-rules.ts","line":25,"endLine":25})
- code:src/game/appraisal/wishlist-rules.ts:WISH_DECAY_SHARE ({"file":"src/game/appraisal/wishlist-rules.ts","line":27,"endLine":27})
- code:src/game/appraisal/wishlist-rules.ts:wishFloor ({"file":"src/game/appraisal/wishlist-rules.ts","line":29,"endLine":29})
- code:src/game/appraisal/wishlist-rules.ts:wishDecayStep ({"file":"src/game/appraisal/wishlist-rules.ts","line":30,"endLine":30})
- code:src/game/appraisal/wishlist-rules.ts:wishDecayed ({"file":"src/game/appraisal/wishlist-rules.ts","line":32,"endLine":32})
- code:src/game/appraisal/events.ts:drawWishEvent ({"file":"src/game/appraisal/events.ts","line":260,"endLine":260})
- code:src/game/appraisal/wishlist.ts:applyWish ({"file":"src/game/appraisal/wishlist.ts","line":38,"endLine":47})
- code:src/game/appraisal/wishlist.ts:wishNew ({"file":"src/game/appraisal/wishlist.ts","line":49,"endLine":57})
- code:src/game/appraisal/wishlist.ts:drawWishEvent ({"file":"src/game/appraisal/wishlist.ts","line":66,"endLine":70})
- code:src/game/appraisal/wishlist.ts:wishSell ({"file":"src/game/appraisal/wishlist.ts","line":85,"endLine":107})

## logic:L21 Collector Wishlist 3+2

ทุก 2 turn ขอ 3; รอ 2 turn; สุ่มเพิ่ม 2; ดู 1; จ่ายซื้อจริง



## logic:L22 สัญญาส่วนตัว NPC

เลือด Vampire และให้ Alien ยืมของ

- code:src/game/appraisal/npc-events.ts:NPC_PERSONAL_EVENT ({"file":"src/game/appraisal/npc-events.ts","line":9,"endLine":9})
- code:src/game/appraisal/npc-events.ts:isNpcEvent ({"file":"src/game/appraisal/npc-events.ts","line":10,"endLine":10})
- code:src/game/appraisal/npc-events.ts:merchant ({"file":"src/game/appraisal/npc-events.ts","line":11,"endLine":11})
- code:src/game/appraisal/npc-events.ts:movable ({"file":"src/game/appraisal/npc-events.ts","line":12,"endLine":12})
- code:src/game/appraisal/npc-events.ts:livingOthers ({"file":"src/game/appraisal/npc-events.ts","line":13,"endLine":13})
- code:src/game/appraisal/npc-events.ts:freeBank ({"file":"src/game/appraisal/npc-events.ts","line":14,"endLine":14})
- code:src/game/appraisal/npc-events.ts:pick ({"file":"src/game/appraisal/npc-events.ts","line":15,"endLine":15})
- code:src/game/appraisal/npc-events.ts:note ({"file":"src/game/appraisal/npc-events.ts","line":16,"endLine":16})
- code:src/game/appraisal/npc-events.ts:npcEventEligible ({"file":"src/game/appraisal/npc-events.ts","line":19,"endLine":34})
- code:src/game/appraisal/npc-events.ts:personalNpcOffer ({"file":"src/game/appraisal/npc-events.ts","line":37,"endLine":59})
- code:src/game/appraisal/npc-events.ts:statusPool ({"file":"src/game/appraisal/npc-events.ts","line":62,"endLine":67})
- code:src/game/appraisal/npc-events.ts:randomBuff ({"file":"src/game/appraisal/npc-events.ts","line":68,"endLine":72})
- code:src/game/appraisal/npc-events.ts:payLife ({"file":"src/game/appraisal/npc-events.ts","line":74,"endLine":77})
- code:src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent ({"file":"src/game/appraisal/npc-events.ts","line":78,"endLine":121})
- code:src/game/appraisal/npc-events.ts:returnLoanItems ({"file":"src/game/appraisal/npc-events.ts","line":123,"endLine":128})
- code:src/game/appraisal/npc-events.ts:redeemNpcContracts ({"file":"src/game/appraisal/npc-events.ts","line":130,"endLine":152})
- code:src/game/appraisal/npc-events.ts:closeNpcContracts ({"file":"src/game/appraisal/npc-events.ts","line":154,"endLine":157})
- code:src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent ({"file":"src/game/appraisal/npc-events.ts","line":78,"endLine":121})

## logic:L23 พลัง

ต้นทุน ฟื้นพลัง และค่าสูงสุด

- code:src/game/appraisal/mechanics.ts:maxEnergyOf ({"file":"src/game/appraisal/mechanics.ts","line":39,"endLine":41})
- code:src/game/appraisal/mechanics.ts:spend ({"file":"src/game/appraisal/mechanics.ts","line":98,"endLine":104})
- code:src/game/appraisal/mechanics.ts:recover ({"file":"src/game/appraisal/mechanics.ts","line":121,"endLine":127})

## logic:L24 ชีวิตและการฟื้นฟู

ความเสียหาย ดีลฟื้นชีวิตและการตาย

- code:src/game/appraisal/survival.ts:SURVIVAL_RULES ({"file":"src/game/appraisal/survival.ts","line":9,"endLine":9})
- code:src/game/appraisal/survival.ts:BROKERAGE_RULES ({"file":"src/game/appraisal/survival.ts","line":11,"endLine":11})
- code:src/game/appraisal/survival.ts:collectorDue ({"file":"src/game/appraisal/survival.ts","line":13,"endLine":13})
- code:src/game/appraisal/survival.ts:collectRun ({"file":"src/game/appraisal/survival.ts","line":14,"endLine":34})
- code:src/game/appraisal/mechanics.ts:healLife ({"file":"src/game/appraisal/mechanics.ts","line":128,"endLine":132})
- code:src/game/appraisal/mechanics.ts:damageLife ({"file":"src/game/appraisal/mechanics.ts","line":133,"endLine":141})
- code:src/game/appraisal/mechanics.ts:retire ({"file":"src/game/appraisal/mechanics.ts","line":182,"endLine":188})
- code:src/game/appraisal/mechanics.ts:kill ({"file":"src/game/appraisal/mechanics.ts","line":479,"endLine":483})

## logic:L25 เศษชีพจรและคู่ค้า

เศษจากการค้า ฟื้นชีวิต และกฎป้องกันปั๊มคู่ค้าเดิม

- code:src/game/appraisal/pulse.ts:PULSE_RULES ({"file":"src/game/appraisal/pulse.ts","line":5,"endLine":5})
- code:src/game/appraisal/pulse.ts:TRUST_RULES ({"file":"src/game/appraisal/pulse.ts","line":7,"endLine":7})
- code:src/game/appraisal/pulse.ts:ENERGY_DEAL_NPCS ({"file":"src/game/appraisal/pulse.ts","line":9,"endLine":9})
- code:src/game/appraisal/pulse.ts:LIFE_DEALS ({"file":"src/game/appraisal/pulse.ts","line":11,"endLine":11})
- code:src/game/appraisal/pulse.ts:lifeDealTerms ({"file":"src/game/appraisal/pulse.ts","line":12,"endLine":12})
- code:src/game/appraisal/pulse.ts:linkTrade ({"file":"src/game/appraisal/pulse.ts","line":15,"endLine":17})
- code:src/game/appraisal/pulse.ts:merchantWary ({"file":"src/game/appraisal/pulse.ts","line":19,"endLine":19})
- code:src/game/appraisal/pulse.ts:shardsPerSale ({"file":"src/game/appraisal/pulse.ts","line":20,"endLine":20})
- code:src/game/appraisal/pulse.ts:STOCK_RULES ({"file":"src/game/appraisal/pulse.ts","line":23,"endLine":23})
- code:src/game/appraisal/pulse.ts:activeNpcs ({"file":"src/game/appraisal/pulse.ts","line":24,"endLine":24})
- code:src/game/appraisal/pulse.ts:trustTier ({"file":"src/game/appraisal/pulse.ts","line":25,"endLine":25})
- code:src/game/appraisal/pulse.ts:extraStock ({"file":"src/game/appraisal/pulse.ts","line":26,"endLine":26})
- code:src/game/appraisal/mechanics.ts:mendWithShards ({"file":"src/game/appraisal/mechanics.ts","line":160,"endLine":165})

## logic:L26 ภัย Dread/ผุพัง

โอกาสภัย เสียทรัพยากรและของผุพัง

- code:src/game/appraisal/core2.ts:core2On ({"file":"src/game/appraisal/core2.ts","line":10,"endLine":10})
- code:src/game/appraisal/core2.ts:CORE2 ({"file":"src/game/appraisal/core2.ts","line":12,"endLine":36})
- code:src/game/appraisal/core2.ts:rerollCost ({"file":"src/game/appraisal/core2.ts","line":39,"endLine":39})
- code:src/game/appraisal/core2.ts:WEAK_BUFFS ({"file":"src/game/appraisal/core2.ts","line":41,"endLine":41})
- code:src/game/appraisal/core2.ts:STRONG_BUFFS ({"file":"src/game/appraisal/core2.ts","line":42,"endLine":42})
- code:src/game/appraisal/core2.ts:anchorOf ({"file":"src/game/appraisal/core2.ts","line":44,"endLine":50})
- code:src/game/appraisal/core2.ts:decayFor ({"file":"src/game/appraisal/core2.ts","line":53,"endLine":53})
- code:src/game/appraisal/core2.ts:dreadChance ({"file":"src/game/appraisal/core2.ts","line":54,"endLine":54})
- code:src/game/appraisal/core2.ts:overvalueChance ({"file":"src/game/appraisal/core2.ts","line":56,"endLine":59})
- code:src/game/appraisal/core2.ts:consignPayout ({"file":"src/game/appraisal/core2.ts","line":61,"endLine":61})
- code:src/game/appraisal/core2.ts:dreadKinds ({"file":"src/game/appraisal/core2.ts","line":64,"endLine":69})
- code:src/game/appraisal/core2.ts:dreadTax ({"file":"src/game/appraisal/core2.ts","line":70,"endLine":70})
- code:src/game/appraisal/core2.ts:LIFE_DEALS2 ({"file":"src/game/appraisal/core2.ts","line":72,"endLine":72})
- code:src/game/appraisal/core2.ts:lifeDealTerms2 ({"file":"src/game/appraisal/core2.ts","line":73,"endLine":73})
- code:src/game/appraisal/core2.ts:ENERGY_DEAL_CREDITS2 ({"file":"src/game/appraisal/core2.ts","line":74,"endLine":74})
- code:src/game/appraisal/core2.ts:recoverySurcharge ({"file":"src/game/appraisal/core2.ts","line":76,"endLine":76})
- code:src/game/appraisal/core2.ts:linkedStatuses ({"file":"src/game/appraisal/core2.ts","line":79,"endLine":79})
- code:src/game/appraisal/core2-rules.ts:applyDread ({"file":"src/game/appraisal/core2-rules.ts","line":16,"endLine":36})
- code:src/game/appraisal/core2.ts:dreadChance ({"file":"src/game/appraisal/core2.ts","line":54,"endLine":54})

## logic:L27 สถานะผลดี/ผลเสีย

ลบ ลดหรือยืดสถานะ ไม่เปลี่ยนหนี้หรือกำหนดสัญญาเอง

- code:src/game/appraisal/passives.ts:emptyPassives ({"file":"src/game/appraisal/passives.ts","line":14,"endLine":14})
- code:src/game/appraisal/passives.ts:PASSIVE_ITEMS ({"file":"src/game/appraisal/passives.ts","line":16,"endLine":38})
- code:src/game/appraisal/passives.ts:passivesEnabled ({"file":"src/game/appraisal/passives.ts","line":39,"endLine":39})
- code:src/game/appraisal/passives.ts:passiveSpec ({"file":"src/game/appraisal/passives.ts","line":40,"endLine":40})
- code:src/game/appraisal/passives.ts:HELD_STACK_CAP ({"file":"src/game/appraisal/passives.ts","line":42,"endLine":42})
- code:src/game/appraisal/passives.ts:heldPassives ({"file":"src/game/appraisal/passives.ts","line":43,"endLine":53})
- code:src/game/appraisal/passives.ts:passiveBonuses ({"file":"src/game/appraisal/passives.ts","line":54,"endLine":58})
- code:src/game/appraisal/passives.ts:freeInspectionCount ({"file":"src/game/appraisal/passives.ts","line":59,"endLine":61})
- code:src/game/appraisal/passives.ts:inspectionLimit ({"file":"src/game/appraisal/passives.ts","line":62,"endLine":62})
- code:src/game/appraisal/passives.ts:commissionRate ({"file":"src/game/appraisal/passives.ts","line":63,"endLine":63})
- code:src/game/appraisal/passives.ts:coinWinChance ({"file":"src/game/appraisal/passives.ts","line":64,"endLine":64})
- code:src/game/appraisal/passives.ts:passiveMarketBonus ({"file":"src/game/appraisal/passives.ts","line":66,"endLine":68})
- code:src/game/appraisal/passives.ts:MAX_ENERGY_CAP ({"file":"src/game/appraisal/passives.ts","line":69,"endLine":69})
- code:src/game/appraisal/passives.ts:MAX_LIFE_BONUS_CAP ({"file":"src/game/appraisal/passives.ts","line":69,"endLine":69})
- code:src/game/appraisal/passives.ts:WISH_SLOT_CAP ({"file":"src/game/appraisal/passives.ts","line":69,"endLine":69})
- code:src/game/appraisal/mechanics.ts:consumeStatus ({"file":"src/game/appraisal/mechanics.ts","line":34,"endLine":36})
- code:src/game/appraisal/mechanics.ts:removeStatus ({"file":"src/game/appraisal/mechanics.ts","line":37,"endLine":37})
- code:src/game/appraisal/mechanics.ts:grant ({"file":"src/game/appraisal/mechanics.ts","line":83,"endLine":97})

## logic:L28 รางวัลและทายเหรียญ

โอกาส เงินรางวัลและการเสียเดิมพัน

- code:src/game/appraisal/round-rewards.ts:openRoundRewards ({"file":"src/game/appraisal/round-rewards.ts","line":8,"endLine":20})
- code:src/game/appraisal/round-rewards.ts:raiseRoundReward ({"file":"src/game/appraisal/round-rewards.ts","line":21,"endLine":30})
- code:src/game/appraisal/round-rewards.ts:flipRoundReward ({"file":"src/game/appraisal/round-rewards.ts","line":31,"endLine":63})
- code:src/game/appraisal/round-rewards.ts:bankRoundReward ({"file":"src/game/appraisal/round-rewards.ts","line":64,"endLine":71})
- code:src/game/appraisal/passives.ts:coinWinChance ({"file":"src/game/appraisal/passives.ts","line":64,"endLine":64})
- code:src/game/appraisal/round-rewards.ts:openRoundRewards ({"file":"src/game/appraisal/round-rewards.ts","line":8,"endLine":20})

## logic:L29 Collector และคะแนนฐาน

มูลค่าเงิน/สินค้าและตัวปรับ; แยกจากรางวัลผู้นำ

- code:src/game/appraisal/scoring.ts:itemScoreValue ({"file":"src/game/appraisal/scoring.ts","line":2,"endLine":4})
- code:src/game/appraisal/scoring.ts:PROVENANCE_PERCENT ({"file":"src/game/appraisal/scoring.ts","line":6,"endLine":6})
- code:src/game/appraisal/scoring.ts:collectorTotal ({"file":"src/game/appraisal/scoring.ts","line":8,"endLine":10})
- code:src/game/appraisal/scoring.ts:FAKE_EFFECT_CHANCE ({"file":"src/game/appraisal/scoring.ts","line":12,"endLine":12})
- code:src/game/appraisal/scoring.ts:collectorTotal ({"file":"src/game/appraisal/scoring.ts","line":8,"endLine":10})
- code:src/game/appraisal/survival.ts:collectRun ({"file":"src/game/appraisal/survival.ts","line":14,"endLine":34})

## logic:L30 คะแนนพิเศษผู้นำ

ซื้อ ขาย ตาย ของตอนจบ ความไว้ใจ และกลุ่ม rarity ×2=20/×3=40

- code:src/game/appraisal/scoring.ts:itemScoreValue ({"file":"src/game/appraisal/scoring.ts","line":2,"endLine":4})
- code:src/game/appraisal/scoring.ts:PROVENANCE_PERCENT ({"file":"src/game/appraisal/scoring.ts","line":6,"endLine":6})
- code:src/game/appraisal/scoring.ts:collectorTotal ({"file":"src/game/appraisal/scoring.ts","line":8,"endLine":10})
- code:src/game/appraisal/scoring.ts:FAKE_EFFECT_CHANCE ({"file":"src/game/appraisal/scoring.ts","line":12,"endLine":12})

## logic:L31 สำเนาสินค้า

พลังสำเนา 40% กฎต้นฉบับและการสร้างสำเนา

- code:src/game/appraisal/copy-effects.ts:itemEffectScale ({"file":"src/game/appraisal/copy-effects.ts","line":4,"endLine":4})
- code:src/game/appraisal/copy-effects.ts:copySaleQuote ({"file":"src/game/appraisal/copy-effects.ts","line":13,"endLine":13})
- code:src/game/appraisal/merchant-abilities.ts:liveCopy ({"file":"src/game/appraisal/merchant-abilities.ts","line":14,"endLine":14})

## logic:L32 Log/ข้อมูลปกปิด

ติดตามเหตุผล/คำสั่งซ้ำ/ความรู้ ห้ามกลายเป็นโบนัสเฉพาะสินค้า

- code:src/game/appraisal/audit.ts:exportAppraisalAudit ({"file":"src/game/appraisal/audit.ts","line":21,"endLine":24})
- code:src/game/appraisal/audit.ts:replayAppraisalAudit ({"file":"src/game/appraisal/audit.ts","line":25,"endLine":33})
- code:src/game/appraisal/mechanics.ts:trace ({"file":"src/game/appraisal/mechanics.ts","line":30,"endLine":32})
- code:src/game/appraisal/views.ts:appraisalViewFor ({"file":"src/game/appraisal/views.ts","line":45,"endLine":63})

## logic:L33 เจ้าของ/คลัง/หลักประกัน

สิทธิ์ใช้และ passive ต้องหายเมื่อฝาก/ค้ำ/เปลี่ยนเจ้าของ

- code:src/game/appraisal/mechanics.ts:stockItem ({"file":"src/game/appraisal/mechanics.ts","line":194,"endLine":198})
- code:src/game/appraisal/npc-events.ts:returnLoanItems ({"file":"src/game/appraisal/npc-events.ts","line":123,"endLine":128})
- code:src/game/appraisal/price-integrity.ts:integrityItemView ({"file":"src/game/appraisal/price-integrity.ts","line":76,"endLine":80})
