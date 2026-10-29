# Status และ Omen

สถานะ 51 แบบ; omen 7 แบบใน polish และ 15 แบบใน core2 (มี ID ซ้ำข้าม pack จึงใช้ namespace)

## B01 ตาเห็นราคา

ตรวจราคาครั้งถัดไป เห็นมูลค่าจริงแบบตัวเลขเป๊ะ

ระยะ: 1 ครั้ง · หมดเมื่อจบช่วงหน้า; ที่มา: เครื่องตรวจราคา/กระจก; D02 ระงับการเปิดค่าจริงได้ แต่ข้อมูลที่รู้แล้วไม่ถูกลบ

[src/game/appraisal/content.ts:403](../../../src/game/appraisal/content.ts#L403)

```json
[
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 329,
      "endLine": 329
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": []
  },
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 340,
      "endLine": 340
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": []
  },
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 356,
      "endLine": 356
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": []
  },
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 230,
      "endLine": 230
    },
    "owner": "code:src/game/appraisal/mechanics.ts:inspect",
    "guards": [
      "property === 'price'",
      "status(p,'B01') && !status(p,'D02')"
    ]
  }
]
```

## B02 อ่านคำสาป

ตรวจราคาหรือความแท้ครั้งถัดไป อ่านคำสาปของสินค้านั้นให้ด้วย

ระยะ: 1 ครั้ง · หมดเมื่อจบช่วงหน้า; ที่มา: เครื่องแปล/การสแกน; ข้อสัญญาที่ NPC เสนอต้องเปิดก่อนรับอยู่แล้ว

[src/game/appraisal/content.ts:410](../../../src/game/appraisal/content.ts#L410)

```json
[
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 330,
      "endLine": 330
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": []
  },
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 340,
      "endLine": 340
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": []
  },
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 239,
      "endLine": 239
    },
    "owner": "code:src/game/appraisal/mechanics.ts:inspect",
    "guards": [
      "NOT property === 'price'",
      "NOT property === 'authenticity'",
      "NOT state.config.curseSight",
      "status(p,'B02')"
    ]
  },
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 242,
      "endLine": 242
    },
    "owner": "code:src/game/appraisal/mechanics.ts:inspect",
    "guards": [
      "state.config.curseSight && property !== 'effects' && status(p,'B02')"
    ]
  }
]
```

## B03 ปากทอง

ซื้อจากพ่อค้าครั้งถัดไปถูกลง 2 เครดิต

ระยะ: 1 การซื้อ · หมดเมื่อจบช่วงหน้า; ที่มา: ปิดงานประเมินที่ยาก; ไม่ลดราคาที่ผู้เล่นอีกคนได้รับ

[src/game/appraisal/content.ts:417](../../../src/game/appraisal/content.ts#L417)

```json
[
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/cleanse.ts",
      "line": 38,
      "endLine": 38
    },
    "owner": "code:src/game/appraisal/cleanse.ts:cleanseItem",
    "guards": [
      "state.config.polish"
    ]
  },
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 381,
      "endLine": 381
    },
    "owner": "code:src/game/appraisal/mechanics.ts:purchase",
    "guards": []
  }
]
```

## B04 รับรองผู้ประเมิน

การประเมินครั้งถัดไป โอกาสถูกจับว่ากดราคาลดลง 10%

ระยะ: 1 การประเมิน · หมดเมื่อจบช่วงหน้า; ที่มา: ประเมินตรงในงานตรวจสอบ/เปิดใช้สินค้า

[src/game/appraisal/content.ts:424](../../../src/game/appraisal/content.ts#L424)

```json
[
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 364,
      "endLine": 364
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": []
  },
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 285,
      "endLine": 285
    },
    "owner": "code:src/game/appraisal/mechanics.ts:appraise",
    "guards": []
  }
]
```

## B05 มือเบา

การตรวจสองครั้งถัดไปใช้พลังน้อยลงครั้งละ 1

ระยะ: 2 ครั้ง · หมดเมื่อจบช่วงนี้; ที่มา: สัตว์นำทาง/แบตเตอรี่; ยังต้องมีสิทธิ์ตรวจตามกติกาหลัก

[src/game/appraisal/content.ts:431](../../../src/game/appraisal/content.ts#L431)

```json
[
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/core2-actions.ts",
      "line": 120,
      "endLine": 120
    },
    "owner": "code:src/game/appraisal/core2-actions.ts:useSkill",
    "guards": []
  },
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 303,
      "endLine": 303
    },
    "owner": "code:src/game/appraisal/events.ts:eventInspect",
    "guards": []
  },
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 332,
      "endLine": 332
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": []
  },
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 361,
      "endLine": 361
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": []
  },
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 227,
      "endLine": 227
    },
    "owner": "code:src/game/appraisal/mechanics.ts:inspect",
    "guards": [
      "NOT merchantFree",
      "NOT free",
      "NOT insight",
      "NOT compoundEyes"
    ]
  }
]
```

## B06 เกราะจิต

กัน debuff ใหม่ได้ 1 ครั้ง แต่ไม่ล้าง debuff ที่ติดอยู่แล้ว

ระยะ: 1 ครั้ง · หมดเมื่อจบช่วงหน้า; ที่มา: รับเงื่อนไข NPC/เครื่องราง; ไม่ป้องกันการสูญเสีย credit หรือของโดยตรง

[src/game/appraisal/content.ts:438](../../../src/game/appraisal/content.ts#L438)

```json
[
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/core2-actions.ts",
      "line": 118,
      "endLine": 118
    },
    "owner": "code:src/game/appraisal/core2-actions.ts:useSkill",
    "guards": [
      "strong"
    ]
  },
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 363,
      "endLine": 363
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": []
  },
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 87,
      "endLine": 87
    },
    "owner": "code:src/game/appraisal/mechanics.ts:grant",
    "guards": [
      "id.startsWith('D') && status(p,'B06')"
    ]
  },
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/merchant-abilities.ts",
      "line": 92,
      "endLine": 92
    },
    "owner": "code:src/game/appraisal/merchant-abilities.ts:useMerchantAbility",
    "guards": [
      "tier>=2"
    ]
  }
]
```

## B07 ประกันทรัพย์

ถ้าพ่อค้าจะยึดของเป็นค่าปรับ กันไว้ได้ 1 ชิ้น

ระยะ: 1 ครั้ง · หมดเมื่อจบช่วงหน้า; ที่มา: พ่อค้าประกัน/พ่อค้าออร์กที่ไว้ใจ

[src/game/appraisal/content.ts:445](../../../src/game/appraisal/content.ts#L445)

```json
[
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/core2-rules.ts",
      "line": 28,
      "endLine": 28
    },
    "owner": "code:src/game/appraisal/core2-rules.ts:applyDread",
    "guards": [
      "status(p,'B07')"
    ]
  },
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 347,
      "endLine": 347
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": []
  },
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 286,
      "endLine": 286
    },
    "owner": "code:src/game/appraisal/mechanics.ts:appraise",
    "guards": [
      "p.honorJob && accuracy"
    ]
  },
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 476,
      "endLine": 476
    },
    "owner": "code:src/game/appraisal/mechanics.ts:penaltyItem",
    "guards": [
      "status(p,'B07')"
    ]
  }
]
```

## B08 สัญญาปลอดภัย

รอดจากความตายเพราะพ่อค้า 1 ครั้ง แลกกับเสียพลัง 2

ระยะ: 1 ครั้ง · หมดเมื่อจบช่วงหน้า; ที่มา: ซื้อสิทธิ์คุ้มครอง; ไม่ล้างผลสัญญาอื่น

[src/game/appraisal/content.ts:452](../../../src/game/appraisal/content.ts#L452)

```json
[
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 353,
      "endLine": 353
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": []
  },
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 480,
      "endLine": 480
    },
    "owner": "code:src/game/appraisal/mechanics.ts:kill",
    "guards": [
      "status(p,'B08')"
    ]
  }
]
```

## B09 บ่อน้ำฟื้นแรง

ต้นช่วงหน้าได้พลังเพิ่ม 2 (ไม่เกินเพดาน)

ระยะ: ทำงานตอนต้นช่วงหน้า; ที่มา: จ่ายล่วงหน้าหรือรับสัญญาฝากพลัง; ไม่สุ่มถ้าไม่มี encounter ถัดไป

[src/game/appraisal/content.ts:459](../../../src/game/appraisal/content.ts#L459)

```json
[
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/engine.ts",
      "line": 438,
      "endLine": 438
    },
    "owner": "code:src/game/appraisal/engine.ts:advanceAppraisalEncounter",
    "guards": [
      "status(p,'B09')?.starts===state.encounter"
    ]
  },
  {
    "operation": "recover",
    "source": {
      "file": "src/game/appraisal/engine.ts",
      "line": 438,
      "endLine": 438
    },
    "owner": "code:src/game/appraisal/engine.ts:advanceAppraisalEncounter",
    "guards": [
      "status(p,'B09')?.starts===state.encounter"
    ]
  },
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 351,
      "endLine": 351
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": []
  }
]
```

## B10 คนกลาง

ต่อรองราคากับพ่อค้าได้เพิ่ม 1 ครั้ง

ระยะ: หมดเมื่อจบช่วงนี้; ที่มา: ซื้องานนายหน้า/หน้ากาก; ไม่เพิ่มผลลงโทษในการต่อรองระหว่างผู้เล่น

[src/game/appraisal/content.ts:466](../../../src/game/appraisal/content.ts#L466)

```json
[
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 348,
      "endLine": 348
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": []
  },
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 359,
      "endLine": 359
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": []
  }
]
```

## D01 อ่อนล้า

การตรวจสองครั้งถัดไปใช้พลังเพิ่มครั้งละ 1

ระยะ: 2 ครั้ง · หมดเมื่อจบช่วงหน้า; ที่มา: หยุดตรวจหรือชำระล้าง; B05 หักล้างต้นทุนตามจำนวนใช้ที่เหลือ

[src/game/appraisal/content.ts:473](../../../src/game/appraisal/content.ts#L473)

```json
[
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 303,
      "endLine": 303
    },
    "owner": "code:src/game/appraisal/events.ts:eventInspect",
    "guards": []
  },
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 336,
      "endLine": 336
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": [
      "choice==='force'"
    ]
  },
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 227,
      "endLine": 227
    },
    "owner": "code:src/game/appraisal/mechanics.ts:inspect",
    "guards": [
      "NOT merchantFree",
      "NOT free",
      "NOT insight",
      "NOT compoundEyes"
    ]
  }
]
```

## D02 หมอกราคา

ตรวจราคาได้แค่ช่วงคร่าว ๆ ไม่เห็นมูลค่าจริง แม้มี B01 ก็ตาม สิ่งที่รู้แล้วไม่หายไป

ระยะ: หมดเมื่อจบช่วงนี้; ที่มา: ซ่อมหรือชำระล้างก่อนตรวจ; เลือกตรวจเงื่อนไขอื่นแทน

[src/game/appraisal/content.ts:480](../../../src/game/appraisal/content.ts#L480)

```json
[
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 335,
      "endLine": 335
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": [
      "NOT choice==='pay'",
      "choice==='fog'"
    ]
  },
  {
    "operation": "removeStatus",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 366,
      "endLine": 366
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": [
      "!reworked(state)",
      "choice==='repair'"
    ]
  },
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 366,
      "endLine": 366
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": [
      "!reworked(state)",
      "NOT choice==='repair'"
    ]
  },
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 368,
      "endLine": 368
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": [
      "NOT choice==='repair'",
      "NOT choice==='discard'"
    ]
  }
]
```

## D03 ตรานักโกง

การประเมินสองครั้งถัดไป โอกาสถูกจับว่ากดราคาเพิ่ม 10%

ระยะ: 2 การประเมิน · หมดเมื่อจบช่วงหน้า; ที่มา: ประเมินตรง/หลีกเลี่ยงข้อเสนอเสี่ยงหรือชำระล้าง; ไม่ใช้กับการเสนอราคาให้ผู้เล่น

[src/game/appraisal/content.ts:487](../../../src/game/appraisal/content.ts#L487)

```json
[
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/brokerage.ts",
      "line": 104,
      "endLine": 104
    },
    "owner": "code:src/game/appraisal/brokerage.ts:resolveBond",
    "guards": [
      "spec.risk && randomAt(state.seed,`${offer.key}:bond-risk`)<spec.risk"
    ]
  },
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 363,
      "endLine": 363
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": []
  },
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 285,
      "endLine": 285
    },
    "owner": "code:src/game/appraisal/mechanics.ts:appraise",
    "guards": []
  }
]
```

## D04 ดอกเบี้ยเงา

ต้นช่วงหน้าเสีย 2 เครดิต ถ้ามีไม่พอเสียเท่าที่มี

ระยะ: ทำงานตอนต้นช่วงหน้า; ที่มา: กันเงินหรือชำระสัญญาก่อนจุดคิดเงิน; ไม่สุ่มถ้าไม่มี encounter ถัดไป

[src/game/appraisal/content.ts:494](../../../src/game/appraisal/content.ts#L494)

```json
[
  {
    "operation": "spend",
    "source": {
      "file": "src/game/appraisal/engine.ts",
      "line": 437,
      "endLine": 437
    },
    "owner": "code:src/game/appraisal/engine.ts:advanceAppraisalEncounter",
    "guards": [
      "status(p,'D04')?.starts===state.encounter"
    ]
  },
  {
    "operation": "spend",
    "source": {
      "file": "src/game/appraisal/engine.ts",
      "line": 437,
      "endLine": 437
    },
    "owner": "code:src/game/appraisal/engine.ts:advanceAppraisalEncounter",
    "guards": [
      "status(p,'D04')?.starts===state.encounter"
    ]
  },
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/engine.ts",
      "line": 437,
      "endLine": 437
    },
    "owner": "code:src/game/appraisal/engine.ts:advanceAppraisalEncounter",
    "guards": [
      "status(p,'D04')?.starts===state.encounter"
    ]
  }
]
```

## D05 ลมหายใจต้องสาป

ท้ายช่วงนี้และท้ายช่วงหน้า เสียพลังครั้งละ 2

ระยะ: 2 ครั้งตอนคิดผลช่วง; ที่มา: ชำระล้างก่อน settlement/เก็บพลังสำรอง; ถ้าหมดพลังใช้ช่วงพักเดิม

[src/game/appraisal/content.ts:501](../../../src/game/appraisal/content.ts#L501)

```json
[
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/engine.ts",
      "line": 194,
      "endLine": 194
    },
    "owner": "code:src/game/appraisal/engine.ts:settleEncounter",
    "guards": [
      "status(p,'D05')"
    ]
  },
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 356,
      "endLine": 356
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": []
  }
]
```

## D06 อุปกรณ์หนัก

การซื้อจาก NPC สองครั้งถัดไปใช้พลังเพิ่มครั้งละ 1

ระยะ: 2 การซื้อ · หมดเมื่อจบช่วงหน้า; ที่มา: ลดการซื้อหรือจ้างจัดของ; ไม่หักพลังจากผู้ขายที่เป็นผู้เล่น

[src/game/appraisal/content.ts:508](../../../src/game/appraisal/content.ts#L508)

```json
[
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 362,
      "endLine": 362
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": [
      "NOT choice==='pay'",
      "NOT choice==='drop'"
    ]
  },
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 381,
      "endLine": 381
    },
    "owner": "code:src/game/appraisal/mechanics.ts:purchase",
    "guards": []
  }
]
```

## D07 ปิดประตู

ตอนเลือกประตูครั้งหน้า ประตูหนึ่งบานจะถูกปิด

ระยะ: ตอนเลือกประตูครั้งหน้า; ที่มา: ใช้กุญแจเงา/ชำระล้าง; ให้ event นี้ได้เมื่อมีประตูอย่างน้อยสองบานและมี encounter ถัดไป

[src/game/appraisal/content.ts:515](../../../src/game/appraisal/content.ts#L515)

```json
[
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/engine.ts",
      "line": 439,
      "endLine": 439
    },
    "owner": "code:src/game/appraisal/engine.ts:advanceAppraisalEncounter",
    "guards": [
      "status(p,'D07')?.starts===state.encounter"
    ]
  },
  {
    "operation": "removeStatus",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 358,
      "endLine": 358
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": [
      "power===1||randomAt(state.seed,`${offer.key}:${v}:copy-key`)<power"
    ]
  },
  {
    "operation": "removeStatus",
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 435,
      "endLine": 435
    },
    "owner": "code:src/game/appraisal/mechanics.ts:activate",
    "guards": [
      "works",
      "NOT state.config.trustAbilities && (ABILITY_ITEM_IDS as readonly string[]).includes(item.kind)",
      "NOT state.config.trustAbilities && item.kind in MODERN_ACTIVATIONS",
      "NOT itemFamily(item.kind) === 'orb'",
      "itemFamily(item.kind) === 'key' && status(p,'D07')",
      "power===1 || randomAt(state.seed,`${state.encounter}:${item.id}:copy-key`)<power"
    ]
  }
]
```

## D08 สาบานห้ามต่อรอง

ต่อรองราคากับพ่อค้าได้น้อยลง 1 ครั้ง ยังซื้อตามราคาที่ตั้งได้

ระยะ: หมดเมื่อจบช่วงหน้า; ที่มา: รอหมดอายุ/ปลดสัญญา; B10 เพิ่มสิทธิ์คืนได้ ไม่จำกัดการคุยกับผู้เล่น

[src/game/appraisal/content.ts:522](../../../src/game/appraisal/content.ts#L522)

```json
[
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 404,
      "endLine": 404
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": [
      "NOT choice==='pay'"
    ]
  }
]
```

## D09 ครอบครองอัปมงคล

ของชิ้นที่ผูกไว้ขายหรือแลกไม่ได้ แต่ยังเปิดใช้ได้

ระยะ: หมดเมื่อจบช่วงหน้า; ที่มา: ชำระล้าง/รอหมดอายุ; ขอดูได้โดยไม่โอน ไม่สุ่มเมื่อไม่มีของที่เข้าเงื่อนไข

[src/game/appraisal/content.ts:529](../../../src/game/appraisal/content.ts#L529)

```json
[
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 396,
      "endLine": 396
    },
    "owner": "code:src/game/appraisal/mechanics.ts:purchase",
    "guards": [
      "options.lock"
    ]
  }
]
```

## D10 กระหายโลหิต

การฟื้นพลังสองครั้งถัดไปได้น้อยลงครั้งละ 2

ระยะ: 2 ครั้ง · หมดเมื่อจบช่วงหน้า; ที่มา: ชำระล้าง/หลีกเลี่ยงดีลเลือด/ใช้การฟื้นตามกติกากลับเข้าเล่น

[src/game/appraisal/content.ts:536](../../../src/game/appraisal/content.ts#L536)

```json
[
  {
    "operation": "removeStatus",
    "source": {
      "file": "src/game/appraisal/brokerage.ts",
      "line": 69,
      "endLine": 69
    },
    "owner": "code:src/game/appraisal/brokerage.ts:applyGain",
    "guards": [
      "spec.cleanse==='D10'"
    ]
  },
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/brokerage.ts",
      "line": 103,
      "endLine": 103
    },
    "owner": "code:src/game/appraisal/brokerage.ts:resolveBond",
    "guards": [
      "spec.genuineOnly && !give.genuine"
    ]
  },
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 328,
      "endLine": 328
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": [
      "NOT choice==='pay'"
    ]
  },
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 364,
      "endLine": 364
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": []
  },
  {
    "operation": "removeStatus",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 372,
      "endLine": 372
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": [
      "NOT choice==='energy'"
    ]
  },
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 123,
      "endLine": 123
    },
    "owner": "code:src/game/appraisal/mechanics.ts:recover",
    "guards": [
      "!minimum && status(p,'D10')"
    ]
  }
]
```

## B11 ตาประกอบหลายเหลี่ยม

การตรวจสองครั้งถัดไปไม่เสียพลัง (ยังนับสิทธิ์ตรวจ)

ระยะ: 2 ครั้ง · หมดเมื่อจบช่วงหน้า; ที่มา: ตะเกียงน้ำขึ้น/กระจกตารวม/ข้อเสนอของ The Swarm

[src/game/appraisal/content.ts:543](../../../src/game/appraisal/content.ts#L543)

```json
[
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/core2-actions.ts",
      "line": 120,
      "endLine": 120
    },
    "owner": "code:src/game/appraisal/core2-actions.ts:useSkill",
    "guards": [
      "strong"
    ]
  },
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 398,
      "endLine": 398
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": []
  },
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 226,
      "endLine": 226
    },
    "owner": "code:src/game/appraisal/mechanics.ts:inspect",
    "guards": [
      "NOT merchantFree",
      "NOT free",
      "NOT insight",
      "compoundEyes"
    ]
  }
]
```

## B12 เสียงกระซิบเหวลึก

การประเมินครั้งถัดไป โอกาสที่ NPC ยอมรับราคาต่ำเพิ่ม 25 จุดเปอร์เซ็นต์ ไม่ลดความเสี่ยงจับผิด

ระยะ: 1 การประเมิน · หมดเมื่อจบช่วงหน้า; ที่มา: หมึกยักษ์ดำ/อสูรใต้ทะเลลึก

[src/game/appraisal/content.ts:550](../../../src/game/appraisal/content.ts#L550)

```json
[
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 393,
      "endLine": 393
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": []
  },
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 285,
      "endLine": 285
    },
    "owner": "code:src/game/appraisal/mechanics.ts:appraise",
    "guards": []
  }
]
```

## B13 ฝูงหนุนหลัง

การขาย Dark Market ครั้งถัดไปได้ราคาเพิ่ม 20% ปัดลง

ระยะ: 1 การขาย · หมดเมื่อจบช่วงหน้า; ที่มา: ดาบเปลือกแมลง/ข้อตกลงกับ The Swarm

[src/game/appraisal/content.ts:557](../../../src/game/appraisal/content.ts#L557)

```json
[
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/core2-actions.ts",
      "line": 121,
      "endLine": 121
    },
    "owner": "code:src/game/appraisal/core2-actions.ts:useSkill",
    "guards": [
      "strong"
    ]
  },
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/core2-actions.ts",
      "line": 122,
      "endLine": 122
    },
    "owner": "code:src/game/appraisal/core2-actions.ts:useSkill",
    "guards": []
  },
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 399,
      "endLine": 399
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": []
  },
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 78,
      "endLine": 78
    },
    "owner": "code:src/game/appraisal/mechanics.ts:saleApply",
    "guards": [
      "market || state.config.polish"
    ]
  }
]
```

## B14 ลมหายใจใต้น้ำลึก

การฟื้นพลังครั้งถัดไปได้เพิ่ม 2 (ไม่นับการฟื้นขั้นต่ำท้ายช่วง)

ระยะ: 1 ครั้ง · หมดเมื่อจบช่วงหน้า; ที่มา: ไข่มุกห้วงลึก/เซลล์ตัวอ่อนเรืองแสง

[src/game/appraisal/content.ts:564](../../../src/game/appraisal/content.ts#L564)

```json
[
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/core2-actions.ts",
      "line": 121,
      "endLine": 121
    },
    "owner": "code:src/game/appraisal/core2-actions.ts:useSkill",
    "guards": []
  },
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 396,
      "endLine": 396
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": [
      "randomAt(state.seed,`${offer.key}:pearl-dive`)<.5"
    ]
  },
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 400,
      "endLine": 400
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": []
  },
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 124,
      "endLine": 124
    },
    "owner": "code:src/game/appraisal/mechanics.ts:recover",
    "guards": [
      "!minimum && status(p,'B14')"
    ]
  }
]
```

## B15 สายสัมพันธ์ของรัง

การขายของที่คุณประเมินครั้งถัดไปได้ความไว้ใจเพิ่มอีก 1

ระยะ: 1 การขาย · หมดเมื่อจบช่วงหน้า; ที่มา: รวงรังฝูง/พ่อค้าผึ้งส่งสาร

[src/game/appraisal/content.ts:571](../../../src/game/appraisal/content.ts#L571)

```json
[
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/core2-actions.ts",
      "line": 122,
      "endLine": 122
    },
    "owner": "code:src/game/appraisal/core2-actions.ts:useSkill",
    "guards": [
      "strong"
    ]
  },
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 394,
      "endLine": 394
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": []
  },
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 402,
      "endLine": 402
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": [
      "randomAt(state.seed,`${offer.key}:old-nest`)<.6"
    ]
  },
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 304,
      "endLine": 304
    },
    "owner": "code:src/game/appraisal/mechanics.ts:completeAppraisedSale",
    "guards": []
  }
]
```

## B16 ไข่มุกนำโชค

การล้างคำสาปครั้งถัดไปมีโอกาสสำเร็จเพิ่ม 20 จุดเปอร์เซ็นต์ และการต่อรองขายของที่พ่อค้าตามหาเพิ่ม 15 จุดเปอร์เซ็นต์ ใช้อย่างใดอย่างหนึ่งก่อน

ระยะ: 1 ครั้ง · หมดเมื่อจบช่วงหน้า; ที่มา: สังข์เรียกเงา/เสียงเรียกจากเหวลึก

[src/game/appraisal/content.ts:578](../../../src/game/appraisal/content.ts#L578)

```json
[
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/cleanse.ts",
      "line": 38,
      "endLine": 38
    },
    "owner": "code:src/game/appraisal/cleanse.ts:cleanseItem",
    "guards": []
  },
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 400,
      "endLine": 400
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": []
  },
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/wishlist.ts",
      "line": 97,
      "endLine": 97
    },
    "owner": "code:src/game/appraisal/wishlist.ts:wishSell",
    "guards": [
      "NOT !item.genuine && randomAt(state.seed,`${state.encounter}:${p.id}:${itemId}:wish-fake`)<Math.min(.9,Math.max(.05,.4*NPC_SPECS[npc].sensitivity+(state.config.polish?statusMagnitude(p,'D03',.1)-statusMagnitude(p,'B04',.1):0)))"
    ]
  }
]
```

## D11 พิษฝูง

ท้ายช่วงถัดไปเสียพลัง 1 ต่อครั้ง รวมสองครั้ง

ระยะ: 2 ครั้ง · หมดเมื่อจบช่วงหน้า; ที่มา: รวงรังฝูง/เซลล์ตัวอ่อน/ข้อตกลงกับ The Swarm

[src/game/appraisal/content.ts:585](../../../src/game/appraisal/content.ts#L585)

```json
[
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/engine.ts",
      "line": 195,
      "endLine": 195
    },
    "owner": "code:src/game/appraisal/engine.ts:settleEncounter",
    "guards": [
      "status(p,'D11')"
    ]
  },
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 399,
      "endLine": 399
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": []
  }
]
```

## D12 แรงดันห้วงลึก

การซื้อจาก NPC ครั้งถัดไปแพงขึ้น 2 เครดิต

ระยะ: 1 การซื้อ · หมดเมื่อจบช่วงหน้า; ที่มา: ไข่มุกห้วงลึก/การดำน้ำพลาด

[src/game/appraisal/content.ts:592](../../../src/game/appraisal/content.ts#L592)

```json
[
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 396,
      "endLine": 396
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": [
      "NOT randomAt(state.seed,`${offer.key}:pearl-dive`)<.5"
    ]
  },
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 381,
      "endLine": 381
    },
    "owner": "code:src/game/appraisal/mechanics.ts:purchase",
    "guards": []
  }
]
```

## D13 กลิ่นรัง

การขาย Dark Market ครั้งถัดไปได้ราคาลด 20% ปัดลง

ระยะ: 1 การขาย · หมดเมื่อจบช่วงหน้า; ที่มา: ดาบเปลือกแมลง/ขายข้อมูลใต้น้ำ

[src/game/appraisal/content.ts:599](../../../src/game/appraisal/content.ts#L599)

```json
[
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 401,
      "endLine": 401
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": []
  },
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 78,
      "endLine": 78
    },
    "owner": "code:src/game/appraisal/mechanics.ts:saleApply",
    "guards": [
      "market || state.config.polish"
    ]
  }
]
```

## D14 หมอกวิกลจริต

การเปิดใช้สินค้าครั้งถัดไป ผลดีไม่ออกฤทธิ์ แต่คำสาปยังทำงานตามปกติ

ระยะ: 1 การเปิดใช้ · หมดเมื่อจบช่วงหน้า; ที่มา: หมึกยักษ์ดำ/หมอกเมาทะเลลึก

[src/game/appraisal/content.ts:606](../../../src/game/appraisal/content.ts#L606)

```json
[
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 398,
      "endLine": 398
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": []
  },
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 406,
      "endLine": 406
    },
    "owner": "code:src/game/appraisal/mechanics.ts:activate",
    "guards": []
  }
]
```

## D15 ใยพันขา

ค่านายหน้าจากการขายครั้งถัดไปลดครึ่งหนึ่ง ปัดลง

ระยะ: 1 การขาย · หมดเมื่อจบช่วงหน้า; ที่มา: ดาบเปลือกแมลง/ตาข่ายใย

[src/game/appraisal/content.ts:613](../../../src/game/appraisal/content.ts#L613)

```json
[
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 395,
      "endLine": 395
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": []
  },
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 402,
      "endLine": 402
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": [
      "NOT randomAt(state.seed,`${offer.key}:old-nest`)<.6"
    ]
  },
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 304,
      "endLine": 304
    },
    "owner": "code:src/game/appraisal/mechanics.ts:completeAppraisedSale",
    "guards": []
  }
]
```

## D16 น้ำเค็มกัดกร่อน

ช่วงนี้ดีลฟื้นพลังหรือชีวิตแพงขึ้น 2 เครดิต และการล้างคำสาปมีโอกาสสำเร็จลด 15 จุดเปอร์เซ็นต์

ระยะ: เฉพาะช่วงนี้; ที่มา: ตะเกียงน้ำขึ้น/เสียงเรียกจากเหวลึก

[src/game/appraisal/content.ts:620](../../../src/game/appraisal/content.ts#L620)

```json
[
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 400,
      "endLine": 400
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": []
  }
]
```

## B17 ตลาดคึกคัก

ช่วงนี้ขายของที่คุณเป็นเจ้าของได้ราคาเพิ่ม 15% ทั้ง Dark Market ผู้ซื้อตามหา และผู้ซื้อพิเศษ ไม่รวมของที่ประเมินให้พ่อค้า

ระยะ: เฉพาะช่วงนี้; ที่มา: ข่าวตลาด/ลางตลาดคึกคัก

[src/game/appraisal/content.ts:627](../../../src/game/appraisal/content.ts#L627)

```json
[]
```

## B18 เหรียญนำโชค

เครดิตหลังซื้อขายของช่วงนี้เพิ่ม 3 และโอกาสทายหัวก้อยถูกเพิ่ม 10 จุดเปอร์เซ็นต์

ระยะ: เฉพาะช่วงนี้; ที่มา: เหรียญริมทาง/เหตุการณ์โชคดี

[src/game/appraisal/content.ts:634](../../../src/game/appraisal/content.ts#L634)

```json
[]
```

## B19 เกราะวิญญาณ

ผลเสียต่อชีวิตครั้งถัดไปลดลง 1 หรือบทลงโทษของพ่อค้าที่ขายไม่ออกครั้งถัดไปถูกยกเว้นเครดิตและลดพลังที่เสีย 1

ระยะ: 1 ครั้ง · หมดเมื่อจบช่วงหน้า; ที่มา: วิญญาณคุ้มครอง/ของสะสม

[src/game/appraisal/content.ts:641](../../../src/game/appraisal/content.ts#L641)

```json
[
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/brokerage.ts",
      "line": 130,
      "endLine": 130
    },
    "owner": "code:src/game/appraisal/brokerage.ts:unsoldPenalty",
    "guards": [
      "ward"
    ]
  },
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 136,
      "endLine": 136
    },
    "owner": "code:src/game/appraisal/mechanics.ts:damageLife",
    "guards": [
      "hit>0 && status(p,'B19')"
    ]
  }
]
```

## B20 ประมูลได้เปรียบ

ถ้าชนะประมูลครั้งถัดไป จ่ายน้อยลง 20% ปัดลง

ระยะ: 1 ครั้ง · หมดเมื่อจบช่วงหน้า; ที่มา: ผู้ประมูลเก่าแก่/ของสะสม

[src/game/appraisal/content.ts:648](../../../src/game/appraisal/content.ts#L648)

```json
[
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/brokerage.ts",
      "line": 219,
      "endLine": 219
    },
    "owner": "code:src/game/appraisal/brokerage.ts:settleAuction",
    "guards": [
      "edge"
    ]
  }
]
```

## D17 ราคาตลาดเฟ้อ

ช่วงนี้ขายของที่คุณเป็นเจ้าของได้ราคาลด 20% ทั้ง Dark Market ผู้ซื้อตามหา และผู้ซื้อพิเศษ ไม่รวมของที่ประเมินให้พ่อค้า

ระยะ: เฉพาะช่วงนี้; ที่มา: ข่าวลือเฟ้อ/ลางราคาตลาดเฟ้อ

[src/game/appraisal/content.ts:655](../../../src/game/appraisal/content.ts#L655)

```json
[]
```

## D18 ภาษีแอบแฝง

ช่วงนี้ซื้อจากพ่อค้า ล้างคำสาป และดีลฟื้นต้องจ่ายเพิ่ม 1 เครดิต

ระยะ: เฉพาะช่วงนี้; ที่มา: นักเก็บภาษีเงา

[src/game/appraisal/content.ts:662](../../../src/game/appraisal/content.ts#L662)

```json
[]
```

## D19 เหรียญไม่เข้าข้าง

เครดิตหลังซื้อขายของช่วงนี้ลด 3 และโอกาสทายหัวก้อยถูกลด 10 จุดเปอร์เซ็นต์

ระยะ: เฉพาะช่วงนี้; ที่มา: เหรียญสาป/เหตุการณ์โชคร้าย

[src/game/appraisal/content.ts:669](../../../src/game/appraisal/content.ts#L669)

```json
[]
```

## D20 บาดแผลเปิด

ผลเสียต่อชีวิตครั้งถัดไปเพิ่ม 1 หรือบทลงโทษเครดิตของพ่อค้าที่ขายไม่ออกครั้งถัดไปเป็นสองเท่า

ระยะ: 1 ครั้ง · หมดเมื่อจบช่วงหน้า; ที่มา: แผลเก่า/คำสาปติดตัว

[src/game/appraisal/content.ts:676](../../../src/game/appraisal/content.ts#L676)

```json
[
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/brokerage.ts",
      "line": 130,
      "endLine": 130
    },
    "owner": "code:src/game/appraisal/brokerage.ts:unsoldPenalty",
    "guards": [
      "wound"
    ]
  },
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/core2-rules.ts",
      "line": 32,
      "endLine": 32
    },
    "owner": "code:src/game/appraisal/core2-rules.ts:applyDread",
    "guards": [
      "NOT status(p,'D20')"
    ]
  },
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 137,
      "endLine": 137
    },
    "owner": "code:src/game/appraisal/mechanics.ts:damageLife",
    "guards": [
      "hit>0 && status(p,'D20')"
    ]
  }
]
```

## B21 ผู้คุ้มกัน

การขโมยจากคุณครั้งถัดไปล้มเหลว (ดวลเป่ายิ้งฉุบ: ตาเสมอนับเป็นของคุณ) และกันผลสะท้อนจากการประเมินราคาเกินจริงได้ 1 ครั้ง

ระยะ: 1 ครั้ง · หมดเมื่อจบช่วงหน้า; ที่มา: เหตุการณ์โจรกระเป๋า/ไอเทมเฝ้ายาม

[src/game/appraisal/core2-content.ts:6](../../../src/game/appraisal/core2-content.ts#L6)

```json
[
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/core2-actions.ts",
      "line": 57,
      "endLine": 57
    },
    "owner": "code:src/game/appraisal/core2-actions.ts:pickpocket",
    "guards": [
      "guarded"
    ]
  },
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 269,
      "endLine": 269
    },
    "owner": "code:src/game/appraisal/mechanics.ts:appraise",
    "guards": [
      "overChance>0 && randomAt(state.seed,`${state.encounter}:${p.id}:${itemId}:overvalue:${counter?p.counters:0}`)<overChance",
      "status(p,'B21')"
    ]
  },
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/theft.ts",
      "line": 221,
      "endLine": 221
    },
    "owner": "code:src/game/appraisal/theft.ts:breakTie",
    "guards": [
      "victim && status(victim,'B21')"
    ]
  }
]
```

## B22 นิ้วเบา

การขโมยครั้งถัดไปมีโอกาสสำเร็จเพิ่ม 25 จุดเปอร์เซ็นต์ (ดวลเป่ายิ้งฉุบ: ตาเสมอครั้งแรกนับเป็นชนะของคุณ)

ระยะ: 1 ครั้ง · หมดเมื่อจบช่วงหน้า; ที่มา: พ่อค้าที่ไว้ใจ/ไอเทมโจร

[src/game/appraisal/core2-content.ts:7](../../../src/game/appraisal/core2-content.ts#L7)

```json
[
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/core2-actions.ts",
      "line": 31,
      "endLine": 31
    },
    "owner": "code:src/game/appraisal/core2-actions.ts:stealShop",
    "guards": []
  },
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/core2-actions.ts",
      "line": 51,
      "endLine": 51
    },
    "owner": "code:src/game/appraisal/core2-actions.ts:pickpocket",
    "guards": []
  },
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/theft.ts",
      "line": 148,
      "endLine": 148
    },
    "owner": "code:src/game/appraisal/theft.ts:startTheftDuel",
    "guards": [
      "state.config.statusLinks !== 1"
    ]
  }
]
```

## B23 ใจนิ่ง

โอกาสเกิดความกดดันท้ายช่วงนี้ลดลงครึ่งหนึ่ง

ระยะ: ช่วงนี้เท่านั้น; ที่มา: พิธีสงบใจ/พ่อค้าที่ไว้ใจ

[src/game/appraisal/core2-content.ts:8](../../../src/game/appraisal/core2-content.ts#L8)

```json
[]
```

## B24 พรปลอบชีพ

ท้ายช่วงนี้ฟื้นชีวิต 1 (โหมดปกติฟื้นพลัง 2)

ระยะ: ตอนคิดผลท้ายช่วงนี้; ที่มา: หมอเถื่อน/พ่อค้า

[src/game/appraisal/core2-content.ts:9](../../../src/game/appraisal/core2-content.ts#L9)

```json
[
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/core2-rules.ts",
      "line": 58,
      "endLine": 58
    },
    "owner": "code:src/game/appraisal/core2-rules.ts:applyCore2Settlement",
    "guards": [
      "status(p,'B24')"
    ]
  }
]
```

## D21 ถูกจับตา

การขโมยของคุณมีโอกาสสำเร็จลดลง 15 จุดเปอร์เซ็นต์ (ดวลเป่ายิ้งฉุบ: ตาเสมอครั้งแรกนับเป็นแพ้) และพ่อค้าไม่ยอมใช้ความสามารถพิเศษให้

ระยะ: 1 ครั้ง · หมดเมื่อจบช่วงหน้า; ที่มา: ถูกจับตอนขโมย/ผลสะท้อนราคาพอง

[src/game/appraisal/core2-content.ts:10](../../../src/game/appraisal/core2-content.ts#L10)

```json
[
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/theft.ts",
      "line": 237,
      "endLine": 237
    },
    "owner": "code:src/game/appraisal/theft.ts:merchantFailure",
    "guards": [
      "state.config.statusLinks === 1"
    ]
  }
]
```

## D22 กระเป๋าฉีก

ท้ายช่วงนี้เสียเครดิต 3 เท่าที่มี

ระยะ: ตอนคิดผลท้ายช่วงนี้; ที่มา: โจรกระเป๋า/ผลสะท้อน

[src/game/appraisal/core2-content.ts:11](../../../src/game/appraisal/core2-content.ts#L11)

```json
[
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/core2-rules.ts",
      "line": 49,
      "endLine": 49
    },
    "owner": "code:src/game/appraisal/core2-rules.ts:applyCore2Settlement",
    "guards": [
      "status(p,'D22')"
    ]
  }
]
```

## D23 เลือดไหลไม่หยุด

ท้ายช่วงนี้เสียชีวิต 1 (โหมดปกติเสียพลัง 2)

ระยะ: ตอนคิดผลท้ายช่วงนี้; ที่มา: พ่อค้าแค้น/หมอเถื่อนพลาด

[src/game/appraisal/core2-content.ts:12](../../../src/game/appraisal/core2-content.ts#L12)

```json
[
  {
    "operation": "consumeStatus",
    "source": {
      "file": "src/game/appraisal/core2-rules.ts",
      "line": 51,
      "endLine": 51
    },
    "owner": "code:src/game/appraisal/core2-rules.ts:applyCore2Settlement",
    "guards": [
      "status(p,'D23')"
    ]
  }
]
```

## D24 ผวาตื่นกลางคืน

สิทธิ์ตรวจสินค้าของช่วงนี้ลดลง 1 ครั้ง

ระยะ: ช่วงนี้เท่านั้น; ที่มา: ผลสะท้อน/ความกดดัน

[src/game/appraisal/core2-content.ts:13](../../../src/game/appraisal/core2-content.ts#L13)

```json
[]
```

## B25 จังหวะเร่งเวลา

สกิลพ่อค้าครั้งถัดไปมี cooldown สั้นลง 1 รอบ ต่ำสุด 1 รอบ ไม่เปลี่ยนเวลารอที่กำลังเดินอยู่

ระยะ: ถึงจบช่วงถัดไป หรือใช้สกิล; ที่มา: เหตุการณ์เวลา

[src/game/appraisal/ability-content.ts:15](../../../src/game/appraisal/ability-content.ts#L15)

```json
[
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 324,
      "endLine": 324
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": [
      "choice==='haste'"
    ]
  },
  {
    "operation": "removeStatus",
    "source": {
      "file": "src/game/appraisal/merchant-abilities.ts",
      "line": 117,
      "endLine": 117
    },
    "owner": "code:src/game/appraisal/merchant-abilities.ts:useMerchantAbility",
    "guards": []
  }
]
```

## B26 ทิศทางแปรผัน

สัตว์นำทางเสนอสินค้าเพิ่ม 1 ตัวเลือกครั้งถัดไป สูงสุด 5 ตัวเลือก

ระยะ: ถึงจบช่วงถัดไป หรือใช้สัตว์นำทาง; ที่มา: เข็มทิศแปรผัน

[src/game/appraisal/ability-content.ts:16](../../../src/game/appraisal/ability-content.ts#L16)

```json
[
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 325,
      "endLine": 325
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": [
      "choice==='compass'"
    ]
  },
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 417,
      "endLine": 417
    },
    "owner": "code:src/game/appraisal/mechanics.ts:activate",
    "guards": [
      "works",
      "state.config.trustAbilities && (ABILITY_ITEM_IDS as readonly string[]).includes(item.kind)",
      "NOT item.kind==='chrono-gear' || item.kind==='burden-hourglass'"
    ]
  },
  {
    "operation": "removeStatus",
    "source": {
      "file": "src/game/appraisal/merchant-abilities.ts",
      "line": 110,
      "endLine": 110
    },
    "owner": "code:src/game/appraisal/merchant-abilities.ts:useMerchantAbility",
    "guards": [
      "npc==='beast'"
    ]
  }
]
```

## D25 พันธนาการเวลา

สกิลพ่อค้าครั้งถัดไปมี cooldown เพิ่ม 2 รอบ ไม่ยืดเวลารอปัจจุบันและไม่เพิ่มซ้ำทุกช่วง

ระยะ: ถึงจบช่วงถัดไป หรือใช้สกิล; ที่มา: คำสาปและเหตุการณ์เวลา

[src/game/appraisal/ability-content.ts:17](../../../src/game/appraisal/ability-content.ts#L17)

```json
[
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 324,
      "endLine": 324
    },
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "guards": [
      "NOT choice==='haste'"
    ]
  },
  {
    "operation": "grant",
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 422,
      "endLine": 422
    },
    "owner": "code:src/game/appraisal/mechanics.ts:activate",
    "guards": [
      "works",
      "NOT state.config.trustAbilities && (ABILITY_ITEM_IDS as readonly string[]).includes(item.kind)",
      "state.config.trustAbilities && item.kind in MODERN_ACTIVATIONS",
      "operation==='energy-for-delay'"
    ]
  },
  {
    "operation": "removeStatus",
    "source": {
      "file": "src/game/appraisal/merchant-abilities.ts",
      "line": 117,
      "endLine": 117
    },
    "owner": "code:src/game/appraisal/merchant-abilities.ts:useMerchantAbility",
    "guards": []
  }
]
```

# Omen

## polish / boom ตลาดคึกคัก

```json
{
  "pack": "polish",
  "id": "boom",
  "name": "ตลาดคึกคัก",
  "text": "ทุกคนขายของที่ตัวเองเป็นเจ้าของได้ราคาเพิ่ม 15% ในช่วงนี้ รวม Dark Market ผู้ซื้อตามหา และผู้ซื้อพิเศษ ไม่รวมของที่ประเมินให้พ่อค้า",
  "salePct": 15,
  "uid": "omen:polish:boom",
  "parameters": {
    "salePct": 15
  },
  "requiredFlags": [
    "polish"
  ],
  "selection": "uniform-with-repeat-avoidance",
  "weightExpression": "uniform; previous omen excluded by shift",
  "firstEncounter": 1
}
```

## polish / inflation ราคาตลาดเฟ้อ

```json
{
  "pack": "polish",
  "id": "inflation",
  "name": "ราคาตลาดเฟ้อ",
  "text": "ทุกคนขายของที่ตัวเองเป็นเจ้าของได้ราคาลด 20% ในช่วงนี้ รวม Dark Market ผู้ซื้อตามหา และผู้ซื้อพิเศษ ไม่รวมของที่ประเมินให้พ่อค้า",
  "salePct": -20,
  "uid": "omen:polish:inflation",
  "parameters": {
    "salePct": -20
  },
  "requiredFlags": [
    "polish"
  ],
  "selection": "uniform-with-repeat-avoidance",
  "weightExpression": "uniform; previous omen excluded by shift",
  "firstEncounter": 1
}
```

## polish / tax ภาษีเงา

```json
{
  "pack": "polish",
  "id": "tax",
  "name": "ภาษีเงา",
  "text": "ซื้อจากพ่อค้า ล้างคำสาป และดีลฟื้นต้องจ่ายเพิ่ม 1 เครดิต",
  "fee": 1,
  "uid": "omen:polish:tax",
  "parameters": {
    "fee": 1
  },
  "requiredFlags": [
    "polish"
  ],
  "selection": "uniform-with-repeat-avoidance",
  "weightExpression": "uniform; previous omen excluded by shift",
  "firstEncounter": 1
}
```

## polish / festival เทศกาลพ่อค้า

```json
{
  "pack": "polish",
  "id": "festival",
  "name": "เทศกาลพ่อค้า",
  "text": "พ่อค้ายอมรับราคาต่ำและล้างคำสาปสำเร็จง่ายขึ้น 10 จุดเปอร์เซ็นต์",
  "accept": 10,
  "uid": "omen:polish:festival",
  "parameters": {
    "accept": 10
  },
  "requiredFlags": [
    "polish"
  ],
  "selection": "uniform-with-repeat-avoidance",
  "weightExpression": "uniform; previous omen excluded by shift",
  "firstEncounter": 1
}
```

## polish / insight ฟ้าสว่างเหนือโต๊ะ

```json
{
  "pack": "polish",
  "id": "insight",
  "name": "ฟ้าสว่างเหนือโต๊ะ",
  "text": "การตรวจครั้งแรกของช่วงนี้ไม่เสียพลัง (ยังนับสิทธิ์ตรวจ)",
  "firstInspectFree": true,
  "uid": "omen:polish:insight",
  "parameters": {
    "firstInspectFree": true
  },
  "requiredFlags": [
    "polish"
  ],
  "selection": "uniform-with-repeat-avoidance",
  "weightExpression": "uniform; previous omen excluded by shift",
  "firstEncounter": 1
}
```

## polish / plague ฝูงโรคระบาด

```json
{
  "pack": "polish",
  "id": "plague",
  "name": "ฝูงโรคระบาด",
  "text": "ทุกคนที่ยังเล่นอยู่เสียพลัง 1 ตอนคิดผลท้ายช่วง",
  "settleEnergy": 1,
  "uid": "omen:polish:plague",
  "parameters": {
    "settleEnergy": 1
  },
  "requiredFlags": [
    "polish"
  ],
  "selection": "uniform-with-repeat-avoidance",
  "weightExpression": "uniform; previous omen excluded by shift",
  "firstEncounter": 1
}
```

## polish / generous ปีแห่งการให้

```json
{
  "pack": "polish",
  "id": "generous",
  "name": "ปีแห่งการให้",
  "text": "เครดิตหลังซื้อขายของทุกคนเพิ่ม 3",
  "roundBonus": 3,
  "uid": "omen:polish:generous",
  "parameters": {
    "roundBonus": 3
  },
  "requiredFlags": [
    "polish"
  ],
  "selection": "uniform-with-repeat-avoidance",
  "weightExpression": "uniform; previous omen excluded by shift",
  "firstEncounter": 1
}
```

## core2 / boom ตลาดคึกคัก

```json
{
  "pack": "core2",
  "id": "boom",
  "kind": "plain",
  "name": "ตลาดคึกคัก",
  "text": "ทุกคนขายของที่ตัวเองเป็นเจ้าของได้ราคาเพิ่ม 15% ในช่วงนี้ รวม Dark Market ผู้ซื้อตามหา และผู้ซื้อพิเศษ ไม่รวมของที่ประเมินให้พ่อค้า",
  "salePct": 15,
  "uid": "omen:core2:boom",
  "parameters": {
    "salePct": 15
  },
  "requiredFlags": [
    "polish",
    "core2"
  ],
  "selection": "weighted-no-back-to-back",
  "weightExpression": "1",
  "firstEncounter": 1
}
```

## core2 / inflation ราคาตลาดเฟ้อ

```json
{
  "pack": "core2",
  "id": "inflation",
  "kind": "plain",
  "name": "ราคาตลาดเฟ้อ",
  "text": "ทุกคนขายของที่ตัวเองเป็นเจ้าของได้ราคาลด 20% ในช่วงนี้ รวม Dark Market ผู้ซื้อตามหา และผู้ซื้อพิเศษ ไม่รวมของที่ประเมินให้พ่อค้า",
  "salePct": -20,
  "uid": "omen:core2:inflation",
  "parameters": {
    "salePct": -20
  },
  "requiredFlags": [
    "polish",
    "core2"
  ],
  "selection": "weighted-no-back-to-back",
  "weightExpression": "1",
  "firstEncounter": 1
}
```

## core2 / tax ภาษีเงา

```json
{
  "pack": "core2",
  "id": "tax",
  "kind": "harsh",
  "name": "ภาษีเงา",
  "text": "ซื้อจากพ่อค้า ล้างคำสาป และดีลฟื้นต้องจ่ายเพิ่ม 1 เครดิต",
  "fee": 1,
  "uid": "omen:core2:tax",
  "parameters": {
    "fee": 1
  },
  "requiredFlags": [
    "polish",
    "core2"
  ],
  "selection": "weighted-no-back-to-back",
  "weightExpression": "1 + (encounter - 1) * 0.25",
  "firstEncounter": 1
}
```

## core2 / festival เทศกาลพ่อค้า

```json
{
  "pack": "core2",
  "id": "festival",
  "kind": "relief",
  "name": "เทศกาลพ่อค้า",
  "text": "พ่อค้ายอมรับราคาต่ำและล้างคำสาปสำเร็จง่ายขึ้น 10 จุดเปอร์เซ็นต์",
  "accept": 10,
  "uid": "omen:core2:festival",
  "parameters": {
    "accept": 10
  },
  "requiredFlags": [
    "polish",
    "core2"
  ],
  "selection": "weighted-no-back-to-back",
  "weightExpression": "max(0.35, 1 - (encounter - 1) * 0.08)",
  "firstEncounter": 1
}
```

## core2 / insight ฟ้าสว่างเหนือโต๊ะ

```json
{
  "pack": "core2",
  "id": "insight",
  "kind": "relief",
  "name": "ฟ้าสว่างเหนือโต๊ะ",
  "text": "การตรวจครั้งแรกของช่วงนี้ไม่เสียพลัง (ยังนับสิทธิ์ตรวจ)",
  "firstInspectFree": true,
  "uid": "omen:core2:insight",
  "parameters": {
    "firstInspectFree": true
  },
  "requiredFlags": [
    "polish",
    "core2"
  ],
  "selection": "weighted-no-back-to-back",
  "weightExpression": "max(0.35, 1 - (encounter - 1) * 0.08)",
  "firstEncounter": 1
}
```

## core2 / plague ฝูงโรคระบาด

```json
{
  "pack": "core2",
  "id": "plague",
  "kind": "harsh",
  "name": "ฝูงโรคระบาด",
  "text": "ทุกคนที่ยังเล่นอยู่เสียพลัง 1 ตอนคิดผลท้ายช่วง",
  "settleEnergy": 1,
  "uid": "omen:core2:plague",
  "parameters": {
    "settleEnergy": 1
  },
  "requiredFlags": [
    "polish",
    "core2"
  ],
  "selection": "weighted-no-back-to-back",
  "weightExpression": "1 + (encounter - 1) * 0.25",
  "firstEncounter": 1
}
```

## core2 / generous ปีแห่งการให้

```json
{
  "pack": "core2",
  "id": "generous",
  "kind": "relief",
  "name": "ปีแห่งการให้",
  "text": "เครดิตหลังซื้อขายของทุกคนเพิ่ม 3",
  "roundBonus": 3,
  "uid": "omen:core2:generous",
  "parameters": {
    "roundBonus": 3
  },
  "requiredFlags": [
    "polish",
    "core2"
  ],
  "selection": "weighted-no-back-to-back",
  "weightExpression": "max(0.35, 1 - (encounter - 1) * 0.08)",
  "firstEncounter": 1
}
```

## core2 / bloodmoon จันทร์เลือด

```json
{
  "pack": "core2",
  "id": "bloodmoon",
  "kind": "harsh",
  "name": "จันทร์เลือด",
  "text": "ความกดดันท้ายช่วงเกิดบ่อยขึ้นเท่าตัว แต่ขายของที่เป็นเจ้าของได้ราคาเพิ่ม 10%",
  "dread": 2,
  "salePct": 10,
  "from": 2,
  "uid": "omen:core2:bloodmoon",
  "parameters": {
    "dread": 2,
    "salePct": 10
  },
  "requiredFlags": [
    "polish",
    "core2"
  ],
  "selection": "weighted-no-back-to-back",
  "weightExpression": "1 + (encounter - 1) * 0.25",
  "firstEncounter": 2
}
```

## core2 / collector-tax ภาษีนักสะสม

```json
{
  "pack": "core2",
  "id": "collector-tax",
  "kind": "harsh",
  "name": "ภาษีนักสะสม",
  "text": "ท้ายช่วงนี้ทุกคนเสียเครดิต 15% ของที่ถืออยู่ ปัดลง",
  "taxPct": 15,
  "from": 3,
  "uid": "omen:core2:collector-tax",
  "parameters": {
    "taxPct": 15
  },
  "requiredFlags": [
    "polish",
    "core2"
  ],
  "selection": "weighted-no-back-to-back",
  "weightExpression": "1 + (encounter - 1) * 0.25",
  "firstEncounter": 3
}
```

## core2 / famine ปีข้าวยากหมากแพง

```json
{
  "pack": "core2",
  "id": "famine",
  "kind": "harsh",
  "name": "ปีข้าวยากหมากแพง",
  "text": "ดีลฟื้นพลังและชีวิตกับพ่อค้าแพงขึ้น 3 เครดิตในช่วงนี้",
  "healCost": 3,
  "from": 2,
  "uid": "omen:core2:famine",
  "parameters": {
    "healCost": 3
  },
  "requiredFlags": [
    "polish",
    "core2"
  ],
  "selection": "weighted-no-back-to-back",
  "weightExpression": "1 + (encounter - 1) * 0.25",
  "firstEncounter": 2
}
```

## core2 / thieves-night คืนโจรพราย

```json
{
  "pack": "core2",
  "id": "thieves-night",
  "kind": "plain",
  "name": "คืนโจรพราย",
  "text": "ทุกการขโมยในช่วงนี้มีโอกาสสำเร็จเพิ่ม 25 จุดเปอร์เซ็นต์ รวมการขโมยจากเพื่อน · ในห้องที่ขโมยด้วยเป่ายิ้งฉุบ ตาเสมอนับเป็นของผู้ขโมย",
  "steal": 25,
  "from": 2,
  "uid": "omen:core2:thieves-night",
  "parameters": {
    "steal": 25
  },
  "requiredFlags": [
    "polish",
    "core2"
  ],
  "selection": "weighted-no-back-to-back",
  "weightExpression": "1",
  "firstEncounter": 2
}
```

## core2 / calm ตลาดสงบนิ่ง

```json
{
  "pack": "core2",
  "id": "calm",
  "kind": "relief",
  "name": "ตลาดสงบนิ่ง",
  "text": "ความกดดันท้ายช่วงนี้เกิดยากลงมาก เหลือราว 30%",
  "dread": 0.3,
  "from": 2,
  "uid": "omen:core2:calm",
  "parameters": {
    "dread": 0.3
  },
  "requiredFlags": [
    "polish",
    "core2"
  ],
  "selection": "weighted-no-back-to-back",
  "weightExpression": "max(0.35, 1 - (encounter - 1) * 0.08)",
  "firstEncounter": 2
}
```

## core2 / black-night คืนตลาดมืด

```json
{
  "pack": "core2",
  "id": "black-night",
  "kind": "plain",
  "name": "คืนตลาดมืด",
  "text": "Dark Market เปิดแน่นอนในช่วงนี้ มีรายการรับซื้อให้ตามงบที่เหลือ",
  "marketOpen": true,
  "from": 2,
  "uid": "omen:core2:black-night",
  "parameters": {
    "marketOpen": true
  },
  "requiredFlags": [
    "polish",
    "core2"
  ],
  "selection": "weighted-no-back-to-back",
  "weightExpression": "1",
  "firstEncounter": 2
}
```

## core2 / pilgrims ขบวนผู้แสวงบุญ

```json
{
  "pack": "core2",
  "id": "pilgrims",
  "kind": "relief",
  "name": "ขบวนผู้แสวงบุญ",
  "text": "การขายของที่คุณประเมินครั้งแรกของแต่ละชิ้น ได้ความไว้ใจจากพ่อค้าเพิ่ม 1",
  "trust": 1,
  "from": 2,
  "uid": "omen:core2:pilgrims",
  "parameters": {
    "trust": 1
  },
  "requiredFlags": [
    "polish",
    "core2"
  ],
  "selection": "weighted-no-back-to-back",
  "weightExpression": "max(0.35, 1 - (encounter - 1) * 0.08)",
  "firstEncounter": 2
}
```

## core2 / pestilence โรคร้ายแห่งมิติ

```json
{
  "pack": "core2",
  "id": "pestilence",
  "kind": "harsh",
  "name": "โรคร้ายแห่งมิติ",
  "text": "ทุกคนที่ยังมีชีวิตเสียชีวิต 1 ตอนคิดผลท้ายช่วง (โหมดปกติเสียพลัง 2)",
  "settleLife": 1,
  "settleEnergy": 2,
  "from": 5,
  "uid": "omen:core2:pestilence",
  "parameters": {
    "settleLife": 1,
    "settleEnergy": 2
  },
  "requiredFlags": [
    "polish",
    "core2"
  ],
  "selection": "weighted-no-back-to-back",
  "weightExpression": "1 + (encounter - 1) * 0.25",
  "firstEncounter": 5
}
```
