# Coverage และจุดที่ยังต้องตัดสินใจ

```json
{
  "events": 132,
  "statuses": 51,
  "omens": 22,
  "omenPacks": {
    "polish": 7,
    "core2": 15
  },
  "merchants": 8,
  "abilities": 8,
  "choiceVariants": 314,
  "encounterModels": 6,
  "phases": 5,
  "actions": 50,
  "configKeys": 53,
  "parameters": 67,
  "functions": 431,
  "codeSymbols": 564,
  "policies": 197,
  "randomRules": 89,
  "legacyGateSites": 21,
  "logSites": 105,
  "logTopics": 92,
  "validationSites": 406,
  "dynamicStatusOperations": 28,
  "schemas": 108,
  "propertyWriteSites": 485
}
```
## กฎยืนยันและสถานะ runtime

### ขโมยบังคับ RPS ห้ามปฏิเสธ

```json
{
  "id": "forced-rps",
  "name": "ขโมยบังคับ RPS ห้ามปฏิเสธ",
  "state": "confirmed-rule/runtime-gap",
  "runtime": "expireTheftDuel cancels on expiry",
  "confirmed": "ห้ามปฏิเสธ; timeout ต้องไม่เป็นช่องหลบปลอดภัย",
  "functionNames": [
    "startTheftDuel",
    "expireTheftDuel",
    "chooseTheftHand"
  ],
  "logicIds": [
    "L13",
    "L14"
  ],
  "evidence": "docs/game-design/rules-and-logic.md",
  "functionRefs": [
    "code:src/game/appraisal/theft.ts:startTheftDuel",
    "code:src/game/appraisal/theft.ts:expireTheftDuel",
    "code:src/game/appraisal/theft.ts:chooseTheftHand"
  ]
}
```
### ดอกเบี้ย 10% จากเงินเดิมครบช่วง

```json
{
  "id": "aged-interest",
  "name": "ดอกเบี้ย 10% จากเงินเดิมครบช่วง",
  "state": "implemented-new-runs/legacy-versioned",
  "runtime": {
    "rate": 10,
    "principal": "eligible principal snapshot; vaultInterestRules:1; historical configs without flag retain 4%"
  },
  "confirmed": {
    "rate": 10,
    "principal": "เงินก้อนเดิมครบช่วง; ถอน/เติมใหม่ไม่รับย้อนหลัง"
  },
  "functionNames": [
    "payVaultInterest",
    "handleStorageAction",
    "vaultInterestOf"
  ],
  "logicIds": [
    "L16"
  ],
  "evidence": "docs/game-design/rules-and-logic.md",
  "functionRefs": [
    "code:src/game/appraisal/secure-storage.ts:payVaultInterest",
    "code:src/game/appraisal/secure-storage.ts:handleStorageAction",
    "code:src/game/appraisal/secure-storage.ts:vaultInterestOf"
  ]
}
```
### Collector Wishlist 3+2 / รอ2 / ดู1 / จ่ายจริง

```json
{
  "id": "collector-wishlist",
  "name": "Collector Wishlist 3+2 / รอ2 / ดู1 / จ่ายจริง",
  "state": "confirmed-rule/not-runtime-bound",
  "confirmed": "ทุก 2 turn ขอ 3; ส่งอีก 2 turn รวมสุ่ม 2; ปกปิด 5 ช่อง; เปิดดู 1; ต้องจ่ายซื้อ",
  "functionNames": [],
  "logicIds": [
    "L21"
  ],
  "notEquivalentTo": [
    "E73",
    "wishNew",
    "wishSell"
  ],
  "evidence": "docs/game-design/rules-and-logic.md",
  "functionRefs": []
}
```
### คะแนนผู้นำและ rarity รายกลุ่ม

```json
{
  "id": "leader-awards",
  "name": "คะแนนผู้นำและ rarity รายกลุ่ม",
  "state": "confirmed-rule/pending-details",
  "confirmed": "ซื้อ/ขาย/เสียพลังชีวิตสะสม/ของตอนจบ/ความไว้ใจ; ×2 มากสุด=20, ×3 มากสุด=40; หมวดอื่นและเสมอยังไม่ตกลง",
  "functionNames": [
    "collectorTotal",
    "collectRun"
  ],
  "logicIds": [
    "L30"
  ],
  "note": "ผู้ใช้แก้ความหมาย 2026-10-29: วัด cumulative life lost ไม่ใช่ death count; ตายได้ครั้งเดียว; ไม่อนุมาน ×4/×5",
  "evidence": "docs/game-design/rules-and-logic.md",
  "functionRefs": [
    "code:src/game/appraisal/scoring.ts:collectorTotal",
    "code:src/game/appraisal/survival.ts:collectRun"
  ]
}
```
## การย้ายสินค้า

56 ชิ้นเป็น catalog/art และ effect proposals; dedicated runtime bindings = 0 ไม่จับคู่จากรูป/ชื่อโดยอัตโนมัติ เงื่อนไข legacy ด้านล่างเป็นหลักฐานที่ต้องแก้ ไม่เพิ่มสินค้าเก่าในกราฟ

```json
{
  "legacyKindSites": [
    {
      "owner": "code:src/game/appraisal/events.ts:eventEligible",
      "source": {
        "file": "src/game/appraisal/events.ts",
        "line": 126,
        "endLine": 126
      },
      "expression": "kindOwned(state,p,'food')",
      "legacyKinds": [
        "food"
      ],
      "status": "unresolved-new56-mapping",
      "start": 10457,
      "end": 10483
    },
    {
      "owner": "code:src/game/appraisal/events.ts:eventEligible",
      "source": {
        "file": "src/game/appraisal/events.ts",
        "line": 148,
        "endLine": 148
      },
      "expression": "kindOwned(state,p,'mirror')",
      "legacyKinds": [
        "mirror"
      ],
      "status": "unresolved-new56-mapping",
      "start": 12128,
      "end": 12156
    },
    {
      "owner": "code:src/game/appraisal/events.ts:eventEligible",
      "source": {
        "file": "src/game/appraisal/events.ts",
        "line": 149,
        "endLine": 149
      },
      "expression": "kindOwned(state,p,'orb')",
      "legacyKinds": [
        "orb"
      ],
      "status": "unresolved-new56-mapping",
      "start": 12189,
      "end": 12214
    },
    {
      "owner": "code:src/game/appraisal/events.ts:eventEligible",
      "source": {
        "file": "src/game/appraisal/events.ts",
        "line": 150,
        "endLine": 150
      },
      "expression": "kindOwned(state,p,'key')",
      "legacyKinds": [
        "key"
      ],
      "status": "unresolved-new56-mapping",
      "start": 12280,
      "end": 12305
    },
    {
      "owner": "code:src/game/appraisal/events.ts:eventEligible",
      "source": {
        "file": "src/game/appraisal/events.ts",
        "line": 151,
        "endLine": 151
      },
      "expression": "kindOwned(state,p,'mask')",
      "legacyKinds": [
        "mask"
      ],
      "status": "unresolved-new56-mapping",
      "start": 12359,
      "end": 12385
    },
    {
      "owner": "code:src/game/appraisal/events.ts:eventEligible",
      "source": {
        "file": "src/game/appraisal/events.ts",
        "line": 152,
        "endLine": 152
      },
      "expression": "kindOwned(state,p,'potion')",
      "legacyKinds": [
        "potion"
      ],
      "status": "unresolved-new56-mapping",
      "start": 12478,
      "end": 12506
    },
    {
      "owner": "code:src/game/appraisal/events.ts:eventEligible",
      "source": {
        "file": "src/game/appraisal/events.ts",
        "line": 153,
        "endLine": 153
      },
      "expression": "kindOwned(state,p,'battery')",
      "legacyKinds": [
        "battery"
      ],
      "status": "unresolved-new56-mapping",
      "start": 12583,
      "end": 12612
    },
    {
      "owner": "code:src/game/appraisal/events.ts:eventEligible",
      "source": {
        "file": "src/game/appraisal/events.ts",
        "line": 155,
        "endLine": 155
      },
      "expression": "kindOwned(state,p,'amulet')",
      "legacyKinds": [
        "amulet"
      ],
      "status": "unresolved-new56-mapping",
      "start": 12753,
      "end": 12781
    },
    {
      "owner": "code:src/game/appraisal/events.ts:eventEligible",
      "source": {
        "file": "src/game/appraisal/events.ts",
        "line": 156,
        "endLine": 156
      },
      "expression": "kindOwned(state,p,'blade')",
      "legacyKinds": [
        "blade"
      ],
      "status": "unresolved-new56-mapping",
      "start": 12843,
      "end": 12870
    },
    {
      "owner": "code:src/game/appraisal/events.ts:eventEligible",
      "source": {
        "file": "src/game/appraisal/events.ts",
        "line": 157,
        "endLine": 157
      },
      "expression": "kindOwned(state,p,'scanner')",
      "legacyKinds": [
        "scanner"
      ],
      "status": "unresolved-new56-mapping",
      "start": 12938,
      "end": 12967
    },
    {
      "owner": "code:src/game/appraisal/events.ts:offerEvent",
      "source": {
        "file": "src/game/appraisal/events.ts",
        "line": 228,
        "endLine": 228
      },
      "expression": "kindOwned(state,p,'scanner')",
      "legacyKinds": [
        "scanner"
      ],
      "status": "unresolved-new56-mapping",
      "start": 18415,
      "end": 18443
    },
    {
      "owner": "code:src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "src/game/appraisal/events.ts",
        "line": 332,
        "endLine": 332
      },
      "expression": "ownKind('food')",
      "legacyKinds": [
        "food"
      ],
      "status": "unresolved-new56-mapping",
      "start": 29412,
      "end": 29427
    },
    {
      "owner": "code:src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "src/game/appraisal/events.ts",
        "line": 356,
        "endLine": 356
      },
      "expression": "ownKind('mirror')",
      "legacyKinds": [
        "mirror"
      ],
      "status": "unresolved-new56-mapping",
      "start": 32754,
      "end": 32771
    },
    {
      "owner": "code:src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "src/game/appraisal/events.ts",
        "line": 357,
        "endLine": 357
      },
      "expression": "ownKind('orb')",
      "legacyKinds": [
        "orb"
      ],
      "status": "unresolved-new56-mapping",
      "start": 32994,
      "end": 33008
    },
    {
      "owner": "code:src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "src/game/appraisal/events.ts",
        "line": 358,
        "endLine": 358
      },
      "expression": "ownKind('key')",
      "legacyKinds": [
        "key"
      ],
      "status": "unresolved-new56-mapping",
      "start": 33220,
      "end": 33234
    },
    {
      "owner": "code:src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "src/game/appraisal/events.ts",
        "line": 359,
        "endLine": 359
      },
      "expression": "ownKind('mask')",
      "legacyKinds": [
        "mask"
      ],
      "status": "unresolved-new56-mapping",
      "start": 33426,
      "end": 33441
    },
    {
      "owner": "code:src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "src/game/appraisal/events.ts",
        "line": 360,
        "endLine": 360
      },
      "expression": "ownKind('potion')",
      "legacyKinds": [
        "potion"
      ],
      "status": "unresolved-new56-mapping",
      "start": 33854,
      "end": 33871
    },
    {
      "owner": "code:src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "src/game/appraisal/events.ts",
        "line": 361,
        "endLine": 361
      },
      "expression": "ownKind('battery')",
      "legacyKinds": [
        "battery"
      ],
      "status": "unresolved-new56-mapping",
      "start": 34070,
      "end": 34088
    },
    {
      "owner": "code:src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "src/game/appraisal/events.ts",
        "line": 363,
        "endLine": 363
      },
      "expression": "ownKind('amulet')",
      "legacyKinds": [
        "amulet"
      ],
      "status": "unresolved-new56-mapping",
      "start": 34414,
      "end": 34431
    },
    {
      "owner": "code:src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "src/game/appraisal/events.ts",
        "line": 364,
        "endLine": 364
      },
      "expression": "ownKind('blade')",
      "legacyKinds": [
        "blade"
      ],
      "status": "unresolved-new56-mapping",
      "start": 34640,
      "end": 34656
    },
    {
      "owner": "code:src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "src/game/appraisal/events.ts",
        "line": 368,
        "endLine": 368
      },
      "expression": "ownKind('scanner')",
      "legacyKinds": [
        "scanner"
      ],
      "status": "unresolved-new56-mapping",
      "start": 35186,
      "end": 35204
    }
  ],
  "bondPredicates": [
    {
      "id": "E51",
      "spec": {
        "id": "E51",
        "npc": "vampire",
        "mode": "swap",
        "kinds": [
          "blood-orb",
          "blood-tonic"
        ],
        "genuineOnly": true,
        "name": "เลือดบริสุทธิ์",
        "when": "พบ Vampire; ถือลูกแก้วชีพจรโลหิตหรือน้ำยาเลือดคืนชีพ",
        "description": "Vampire ขอแลกของเลือดที่คุณถือกับสินค้าในร้านหนึ่งชิ้นโดยไม่คิดเครดิตหรือพลัง หากของเลือดเป็นของปลอม Vampire ปฏิเสธ คุณเก็บของไว้และรับ D10"
      }
    },
    {
      "id": "E52",
      "spec": {
        "id": "E52",
        "npc": "orc",
        "mode": "show",
        "families": [
          "blade"
        ],
        "buffs": [
          "B03"
        ],
        "name": "ดาบที่คู่ควร",
        "when": "พบออร์ก; ถือดาบ",
        "description": "ออร์กเคารพผู้ถือดาบ ได้รับ B03 โดยไม่ต้องสละของ"
      }
    },
    {
      "id": "E53",
      "spec": {
        "id": "E53",
        "npc": "orc",
        "mode": "reveal",
        "kinds": [
          "oath-charm",
          "amulet"
        ],
        "reveal": [
          "base"
        ],
        "name": "คำสัตย์ต่อคำสัตย์",
        "when": "พบออร์ก; ถือเครื่องรางคำสัตย์ออร์กหรือเครื่องรางเฝ้าจิต",
        "description": "ออร์กบอกมูลค่าจริงของสินค้าที่เลือกหนึ่งชิ้นตามคำสัตย์ ไม่ใช้สิทธิ์ตรวจและไม่ใช้พลัง"
      }
    },
    {
      "id": "E54",
      "spec": {
        "id": "E54",
        "npc": "orc",
        "mode": "tribute",
        "families": [
          "food"
        ],
        "energy": 3,
        "life": 1,
        "name": "เนื้อย่างเพื่อนร่วมรบ",
        "when": "พบออร์ก; ถืออาหาร",
        "description": "มอบอาหารหนึ่งชิ้นให้ออร์ก ฟื้นพลัง 3 · กติกาชีวิตฟื้นชีวิตเพิ่ม 1"
      }
    },
    {
      "id": "E55",
      "spec": {
        "id": "E55",
        "npc": "vampire",
        "mode": "sell",
        "families": [
          "mirror"
        ],
        "price": 1,
        "name": "กระจกที่ไร้เงา",
        "when": "พบ Vampire; ถือกระจก; ธนาคารมีงบพอ",
        "description": "Vampire ซื้อกระจกหนึ่งชิ้นในราคาอ้างอิงเต็มของชนิดนั้น ไม่สนว่าแท้หรือปลอม"
      }
    },
    {
      "id": "E56",
      "spec": {
        "id": "E56",
        "npc": "vampire",
        "mode": "tribute",
        "families": [
          "orb"
        ],
        "exclude": [
          "blood-orb"
        ],
        "cleanse": "D10",
        "energy": 2,
        "name": "ดื่มพายุในลูกแก้ว",
        "when": "พบ Vampire; ถือลูกแก้วที่ไม่ใช่ลูกแก้วชีพจรโลหิต",
        "description": "มอบลูกแก้วหนึ่งชิ้น Vampire ดูดพลังแทนคุณ ล้าง D10 และฟื้นพลัง 2"
      }
    },
    {
      "id": "E57",
      "spec": {
        "id": "E57",
        "npc": "autometa",
        "mode": "swap",
        "families": [
          "battery"
        ],
        "name": "แบตเตอรี่ที่เข้ากัน",
        "when": "พบ Autometa; ถือแบตเตอรี่",
        "description": "Autometa ขอแลกแบตเตอรี่ที่คุณถือกับสินค้าในร้านหนึ่งชิ้นโดยไม่คิดเครดิตหรือพลัง"
      }
    },
    {
      "id": "E58",
      "spec": {
        "id": "E58",
        "npc": "autometa",
        "mode": "reveal",
        "families": [
          "scanner"
        ],
        "reveal": [
          "base",
          "genuine"
        ],
        "energyCost": 1,
        "name": "อัปเดตเครื่องสแกน",
        "when": "พบ Autometa; ถือเครื่องตรวจราคา",
        "description": "จ่ายพลัง 1 ให้ Autometa เชื่อมเครื่องสแกน เปิดมูลค่าจริงและความแท้ของสินค้าที่เลือกหนึ่งชิ้น ไม่ใช้สิทธิ์ตรวจ"
      }
    },
    {
      "id": "E59",
      "spec": {
        "id": "E59",
        "npc": "autometa",
        "mode": "show",
        "families": [
          "key"
        ],
        "buffs": [
          "B10"
        ],
        "name": "รหัสกุญแจกลไก",
        "when": "พบ Autometa; ถือกุญแจ",
        "description": "Autometa อ่านรหัสกุญแจแล้วยอมต่อรองเพิ่ม ได้รับ B10 โดยไม่ต้องสละของ"
      }
    },
    {
      "id": "E60",
      "spec": {
        "id": "E60",
        "npc": "alien",
        "mode": "reveal",
        "families": [
          "mask"
        ],
        "reveal": [
          "cursed",
          "effectsKnown"
        ],
        "name": "หน้ากากแปลภาษา",
        "when": "พบ Alien; ถือหน้ากาก",
        "description": "สวมหน้ากากคุยกับ Alien เปิดผลของสินค้าและคำสาปของสินค้าที่เลือกหนึ่งชิ้น ไม่ใช้สิทธิ์ตรวจและไม่ใช้พลัง"
      }
    },
    {
      "id": "E61",
      "spec": {
        "id": "E61",
        "npc": "alien",
        "mode": "sell",
        "families": [
          "potion"
        ],
        "price": 1.25,
        "name": "ตัวอย่างยาจากโลกนี้",
        "when": "พบ Alien; ถือยา; ธนาคารมีงบพอ",
        "description": "Alien ซื้อยาหนึ่งชิ้นไปศึกษาในราคาอ้างอิง 125% ของชนิดนั้น"
      }
    },
    {
      "id": "E62",
      "spec": {
        "id": "E62",
        "npc": "alien",
        "mode": "show",
        "families": [
          "orb"
        ],
        "energy": 2,
        "buffs": [
          "B05"
        ],
        "name": "ลูกแก้วนำทางดาว",
        "when": "พบ Alien; ถือลูกแก้ว",
        "description": "Alien ปรับคลื่นลูกแก้วให้ ฟื้นพลัง 2 และได้รับ B05 โดยไม่ต้องสละของ"
      }
    },
    {
      "id": "E63",
      "spec": {
        "id": "E63",
        "npc": "darkone",
        "mode": "tribute",
        "families": [
          "key"
        ],
        "buffs": [
          "B08"
        ],
        "name": "กุญแจห้องมืด",
        "when": "พบ Dark One; ถือกุญแจ",
        "description": "มอบกุญแจหนึ่งชิ้นให้ Dark One ได้รับ B08"
      }
    },
    {
      "id": "E64",
      "spec": {
        "id": "E64",
        "npc": "darkone",
        "mode": "tribute",
        "families": [
          "amulet"
        ],
        "cleanse": "debuffs",
        "name": "วิญญาณแลกวิญญาณ",
        "when": "พบ Dark One; ถือเครื่องราง; มี debuff",
        "description": "มอบเครื่องรางหนึ่งชิ้น Dark One กลืนผลเสียทั้งหมดที่ติดตัวคุณ"
      }
    },
    {
      "id": "E65",
      "spec": {
        "id": "E65",
        "npc": "darkone",
        "mode": "swap",
        "families": [
          "mask"
        ],
        "name": "หน้ากากแห่งความว่าง",
        "when": "พบ Dark One; ถือหน้ากาก",
        "description": "Dark One ขอแลกหน้ากากที่คุณถือกับสินค้าในร้านหนึ่งชิ้นโดยไม่คิดเครดิตหรือพลัง"
      }
    },
    {
      "id": "E66",
      "spec": {
        "id": "E66",
        "npc": "beast",
        "mode": "swap",
        "families": [
          "food"
        ],
        "name": "อาหารแลกของวิเศษ",
        "when": "พบสัตว์นำทาง; ถืออาหาร",
        "description": "สัตว์นำทางคาบสินค้าในร้านหนึ่งชิ้นมาแลกอาหารที่คุณถือ ไม่คิดเครดิตหรือพลัง"
      }
    },
    {
      "id": "E67",
      "spec": {
        "id": "E67",
        "npc": "beast",
        "mode": "tribute",
        "families": [
          "potion"
        ],
        "buffs": [
          "B05",
          "B09"
        ],
        "name": "ยาสมานแผลสัตว์",
        "when": "พบสัตว์นำทาง; ถือยา",
        "description": "ใช้ยาหนึ่งชิ้นรักษาสัตว์นำทาง ได้รับ B05 และ B09"
      }
    },
    {
      "id": "E68",
      "spec": {
        "id": "E68",
        "npc": "beast",
        "mode": "show",
        "families": [
          "blade"
        ],
        "buffs": [
          "B03"
        ],
        "debuffs": [
          "D03"
        ],
        "name": "สัตว์หวาดคมดาบ",
        "when": "พบสัตว์นำทาง; ถือดาบ",
        "description": "ข่มขู่สัตว์นำทางด้วยดาบ ได้รับ B03 แต่รับ D03"
      }
    },
    {
      "id": "E69",
      "spec": {
        "id": "E69",
        "npc": "darkone",
        "mode": "sell",
        "known": "cursed",
        "price": 1,
        "name": "นักสะสมคำสาป",
        "when": "พบ Dark One; ถือของที่คุณรู้ว่ามีคำสาป; ธนาคารมีงบพอ",
        "description": "Dark One ซื้อของต้องสาปหนึ่งชิ้นในราคาอ้างอิงเต็มของชนิดนั้น"
      }
    },
    {
      "id": "E70",
      "spec": {
        "id": "E70",
        "npc": "alien",
        "mode": "swap",
        "known": "fake",
        "risk": 0.5,
        "name": "ของปลอมข้ามจักรวาล",
        "when": "พบ Alien; ถือของที่คุณรู้ว่าเป็นของปลอม",
        "description": "ลองแลกของปลอมกับสินค้าในร้านหนึ่งชิ้น โอกาส 50% ที่ Alien จับได้: ไม่แลกและรับ D03"
      }
    },
    {
      "id": "E71",
      "spec": {
        "id": "E71",
        "npc": "orc",
        "mode": "show",
        "families": [
          "mask"
        ],
        "buffs": [
          "B07"
        ],
        "name": "หน้ากากนักรบ",
        "when": "พบออร์ก; ถือหน้ากาก",
        "description": "ออร์กนับถือหน้ากากนักรบ ได้รับ B07 โดยไม่ต้องสละของ"
      }
    },
    {
      "id": "E72",
      "spec": {
        "id": "E72",
        "npc": "autometa",
        "mode": "show",
        "families": [
          "mirror"
        ],
        "buffs": [
          "B01"
        ],
        "name": "กระจกสอบเทียบ",
        "when": "พบ Autometa; ถือกระจก",
        "description": "Autometa ใช้กระจกของคุณสอบเทียบเลนส์ ได้รับ B01 โดยไม่ต้องสละของ"
      }
    },
    {
      "id": "E74",
      "spec": {
        "id": "E74",
        "npc": "deepsea",
        "mode": "swap",
        "kinds": [
          "abyss-pearl"
        ],
        "genuineOnly": true,
        "name": "ไข่มุกคืนทะเล",
        "when": "พบอสูรใต้ทะเลลึก; ถือไข่มุกห้วงลึก",
        "description": "อสูรใต้ทะเลลึกขอไข่มุกที่คุณถือคืนสู่ห้วงน้ำ แลกกับสินค้าในร้านหนึ่งชิ้นโดยไม่คิดเครดิตหรือพลัง หากไข่มุกเป็นของปลอม อสูรปฏิเสธ คุณเก็บของไว้และรับ D10"
      }
    },
    {
      "id": "E75",
      "spec": {
        "id": "E75",
        "npc": "deepsea",
        "mode": "reveal",
        "kinds": [
          "kraken-ink"
        ],
        "reveal": [
          "base",
          "genuine"
        ],
        "energyCost": 1,
        "name": "หมึกเขียนความจริง",
        "when": "พบอสูรใต้ทะเลลึก; ถือหมึกยักษ์ดำ",
        "description": "จ่ายพลัง 1 ให้อสูรใช้หมึกเขียนความจริงบนสินค้าที่เลือก เปิดมูลค่าจริงและความแท้ ไม่ใช้สิทธิ์ตรวจ"
      }
    },
    {
      "id": "E76",
      "spec": {
        "id": "E76",
        "npc": "deepsea",
        "mode": "show",
        "families": [
          "amulet"
        ],
        "buffs": [
          "B12"
        ],
        "name": "เสียงที่ฟังได้",
        "when": "พบอสูรใต้ทะเลลึก; ถือเครื่องราง",
        "description": "อสูรใต้ทะเลลึกได้ยินเครื่องรางของคุณสะท้อนเสียงห้วงน้ำ ได้รับ B12 โดยไม่ต้องสละของ"
      }
    },
    {
      "id": "E77",
      "spec": {
        "id": "E77",
        "npc": "deepsea",
        "mode": "sell",
        "families": [
          "mask"
        ],
        "price": 1.1,
        "name": "หน้ากากของผู้จมน้ำ",
        "when": "พบอสูรใต้ทะเลลึก; ถือหน้ากาก; ธนาคารมีงบพอ",
        "description": "อสูรใต้ทะเลลึกซื้อหน้ากากหนึ่งชิ้นในราคาอ้างอิง 110% ของชนิดนั้น ไม่สนว่าแท้หรือปลอม"
      }
    },
    {
      "id": "E78",
      "spec": {
        "id": "E78",
        "npc": "deepsea",
        "mode": "tribute",
        "families": [
          "food"
        ],
        "energy": 2,
        "buffs": [
          "B11"
        ],
        "name": "เครื่องเซ่นจากผิวน้ำ",
        "when": "พบอสูรใต้ทะเลลึก; ถืออาหาร",
        "description": "มอบอาหารหนึ่งชิ้นให้อสูรใต้ทะเลลึก ฟื้นพลัง 2 และได้รับ B11"
      }
    },
    {
      "id": "E79",
      "spec": {
        "id": "E79",
        "npc": "swarm",
        "mode": "show",
        "families": [
          "blade"
        ],
        "buffs": [
          "B13"
        ],
        "debuffs": [
          "D11"
        ],
        "name": "ฝูงเกรงคมดาบ",
        "when": "พบ The Swarm; ถือดาบ",
        "description": "ฝูงมนุษย์แมลงถอยให้ผู้ถือดาบและยอมหนุนหลัง ได้รับ B13 แต่ถูกพิษฝูงกัดเป็นค่าผ่านทาง รับ D11"
      }
    },
    {
      "id": "E80",
      "spec": {
        "id": "E80",
        "npc": "swarm",
        "mode": "swap",
        "families": [
          "food"
        ],
        "name": "น้ำหวานแลกของเก็บ",
        "when": "พบ The Swarm; ถืออาหาร",
        "description": "The Swarm ขออาหารที่คุณถือไปเลี้ยงตัวอ่อน แลกกับสินค้าในร้านหนึ่งชิ้นโดยไม่คิดเครดิตหรือพลัง"
      }
    },
    {
      "id": "E81",
      "spec": {
        "id": "E81",
        "npc": "swarm",
        "mode": "tribute",
        "families": [
          "potion"
        ],
        "cleanse": "debuffs",
        "name": "ยาแก้พิษให้ฝูงกลืน",
        "when": "พบ The Swarm; ถือยา; มี debuff",
        "description": "มอบยาหนึ่งชิ้นให้ The Swarm ฝูงดูดผลเสียทั้งหมดที่ติดตัวคุณไป"
      }
    },
    {
      "id": "E82",
      "spec": {
        "id": "E82",
        "npc": "swarm",
        "mode": "reveal",
        "families": [
          "scanner"
        ],
        "reveal": [
          "base",
          "cursed"
        ],
        "energyCost": 1,
        "name": "ตาของทั้งฝูง",
        "when": "พบ The Swarm; ถือเครื่องตรวจ",
        "description": "จ่ายพลัง 1 ยืมสายตาของทั้งฝูงส่องสินค้าที่เลือก เปิดมูลค่าจริงและคำสาป ไม่ใช้สิทธิ์ตรวจ"
      }
    },
    {
      "id": "E83",
      "spec": {
        "id": "E83",
        "npc": "swarm",
        "mode": "sell",
        "families": [
          "battery"
        ],
        "price": 1.2,
        "name": "รังต้องการพลัง",
        "when": "พบ The Swarm; ถือแบตเตอรี่; ธนาคารมีงบพอ",
        "description": "The Swarm ซื้อแบตเตอรี่หนึ่งชิ้นไปจุดรังในราคาอ้างอิง 120% ของชนิดนั้น"
      }
    },
    {
      "id": "E102",
      "spec": {
        "id": "E102",
        "npc": "orc",
        "mode": "show",
        "kinds": [
          "vital-flask"
        ],
        "buffs": [
          "B17"
        ],
        "name": "ขวดของนักรบ",
        "when": "พบออร์ก; ถือขวดพลังสำรอง",
        "description": "ออร์กเห็นขวดพลังสำรองที่คุณพกและแนะนำช่องทางขาย ได้รับ B17 โดยไม่ต้องสละของ"
      }
    },
    {
      "id": "E103",
      "spec": {
        "id": "E103",
        "npc": "alien",
        "mode": "reveal",
        "kinds": [
          "wish-ledger"
        ],
        "reveal": [
          "base",
          "genuine"
        ],
        "name": "ภาษาของสัญญา",
        "when": "พบ Alien; ถือสมุดคำสัญญาพ่อค้า",
        "description": "Alien อ่านสมุดคำสัญญาของคุณและบอกมูลค่าจริงกับความแท้ของสินค้าที่เลือกหนึ่งชิ้น ไม่ใช้พลังหรือสิทธิ์ตรวจ"
      }
    },
    {
      "id": "E104",
      "spec": {
        "id": "E104",
        "npc": "autometa",
        "mode": "tribute",
        "kinds": [
          "vital-flask"
        ],
        "energy": 3,
        "buffs": [
          "B20"
        ],
        "name": "แลกพลังสำรอง",
        "when": "พบ Autometa; ถือขวดพลังสำรอง",
        "description": "มอบขวดพลังสำรองหนึ่งชิ้นให้ Autometa ฟื้นพลัง 3 และได้รับ B20"
      }
    },
    {
      "id": "E105",
      "spec": {
        "id": "E105",
        "npc": "beast",
        "mode": "show",
        "kinds": [
          "life-relic"
        ],
        "buffs": [
          "B19"
        ],
        "name": "สัตว์รับรู้ศิลา",
        "when": "พบสัตว์นำทาง; ถือศิลาชีพจรเก่า",
        "description": "สัตว์นำทางสัมผัสศิลาชีพจรแล้วเฝ้าระวังให้คุณ ได้รับ B19 โดยไม่ต้องสละของ"
      }
    },
    {
      "id": "E106",
      "spec": {
        "id": "E106",
        "npc": "darkone",
        "mode": "sell",
        "kinds": [
          "wish-ledger"
        ],
        "price": 1.3,
        "name": "สมุดสัญญาสำหรับคนตาย",
        "when": "พบ Dark One; ถือสมุดคำสัญญาพ่อค้า; ธนาคารมีงบพอ",
        "description": "Dark One ซื้อสมุดคำสัญญาหนึ่งเล่มในราคาอ้างอิง 130% ของชนิดนั้น"
      }
    },
    {
      "id": "E107",
      "spec": {
        "id": "E107",
        "npc": "deepsea",
        "mode": "swap",
        "kinds": [
          "life-relic"
        ],
        "genuineOnly": true,
        "name": "ศิลาคืนบึ้ง",
        "when": "พบอสูรใต้ทะเลลึก; ถือศิลาชีพจรเก่า",
        "description": "อสูรใต้ทะเลลึกขอศิลาที่คุณถือแลกกับสินค้าในร้านหนึ่งชิ้นโดยไม่คิดเครดิตหรือพลัง หากศิลาเป็นของปลอม อสูรปฏิเสธ คุณเก็บของไว้และรับ D10"
      }
    }
  ],
  "merchantFavorites": [
    {
      "id": "orc",
      "favorite": [
        "blade",
        "amulet",
        "food"
      ]
    },
    {
      "id": "vampire",
      "favorite": [
        "orb",
        "mirror",
        "blade"
      ]
    },
    {
      "id": "autometa",
      "favorite": [
        "scanner",
        "battery",
        "key"
      ]
    },
    {
      "id": "alien",
      "favorite": [
        "mask",
        "orb",
        "potion"
      ]
    },
    {
      "id": "darkone",
      "favorite": [
        "key",
        "amulet",
        "mirror"
      ]
    },
    {
      "id": "deepsea",
      "favorite": [
        "potion",
        "orb",
        "amulet"
      ]
    },
    {
      "id": "swarm",
      "favorite": [
        "food",
        "blade",
        "battery"
      ]
    },
    {
      "id": "beast",
      "favorite": [
        "food",
        "potion",
        "battery"
      ]
    }
  ]
}
```
## ข้อจำกัดและงานติดตาม

- Static branches record possible source paths, not simultaneous effects or availability for a particular player.
- Choice candidates extracted from source may be gated, replaced, dynamic or fallback-only.
- Encounter generation is seeded and stateful; this catalog does not enumerate every possible run.
- No new56 item→runtime-event binding is inferred from images, names, old kinds or effect IDs.
- E01 as a proposal effect differs from event:E01; namespaces are mandatory.
- Source references are static dependencies, not proof a function executes on every action.
- Mode/config variants and latest confirmed rules must be distinguished from current runtime values.
- Dynamic status operations 28 จุด: payload/ตัวเลือก/state เป็นตัวกำหนดผล ไม่ขยายเป็นผลจริงทั้งหมด
- การอ้างตัวอักษร / code-call แสดง dependency เท่านั้น ไม่รับประกันการ execute
- ตัวเลขใน parameter เป็น runtime snapshot; กฎใหม่มีอำนาจเหนือค่าเก่า แต่เอกสารไม่ได้เปลี่ยน runtime
- การวิเคราะห์ความถี่จริงต้องจำลอง seed/config/player state และเก็บผล; งานนี้ไม่อ้างว่าได้จำลองแล้ว

```json
[
  {
    "id": "operation:src/game/appraisal/brokerage.ts:4997",
    "name": "grant",
    "owner": "code:src/game/appraisal/brokerage.ts:applyGain",
    "args": [
      "state",
      "p",
      "id"
    ],
    "statusIds": [],
    "guards": [],
    "source": {
      "file": "src/game/appraisal/brokerage.ts",
      "line": 71,
      "endLine": 71
    },
    "expression": "grant(state,p,id)",
    "start": 4997,
    "end": 5015
  },
  {
    "id": "operation:src/game/appraisal/brokerage.ts:5052",
    "name": "grant",
    "owner": "code:src/game/appraisal/brokerage.ts:applyGain",
    "args": [
      "state",
      "p",
      "id"
    ],
    "statusIds": [],
    "guards": [],
    "source": {
      "file": "src/game/appraisal/brokerage.ts",
      "line": 72,
      "endLine": 72
    },
    "expression": "grant(state,p,id)",
    "start": 5052,
    "end": 5070
  },
  {
    "id": "operation:src/game/appraisal/brokerage.ts:9333",
    "name": "grant",
    "owner": "code:src/game/appraisal/brokerage.ts:unsoldPenalty",
    "args": [
      "state",
      "p",
      "id"
    ],
    "statusIds": [],
    "guards": [],
    "source": {
      "file": "src/game/appraisal/brokerage.ts",
      "line": 133,
      "endLine": 133
    },
    "expression": "grant(state,p,id)",
    "start": 9333,
    "end": 9351
  },
  {
    "id": "operation:src/game/appraisal/brokerage.ts:10992",
    "name": "grant",
    "owner": "code:src/game/appraisal/brokerage.ts:consign",
    "args": [
      "state",
      "p",
      "debuff"
    ],
    "statusIds": [],
    "guards": [
      "state.config.core2",
      "NOT roll>=CORE2.consign.debuffBelow",
      "roll>=CORE2.consign.cleanBelow"
    ],
    "source": {
      "file": "src/game/appraisal/brokerage.ts",
      "line": 154,
      "endLine": 154
    },
    "expression": "grant(state,p,debuff)",
    "start": 10992,
    "end": 11020
  },
  {
    "id": "operation:src/game/appraisal/brokerage.ts:11831",
    "name": "grant",
    "owner": "code:src/game/appraisal/brokerage.ts:consign",
    "args": [
      "state",
      "p",
      "debuff"
    ],
    "statusIds": [],
    "guards": [
      "NOT roll>=CONSIGN_RULES.debuffBelow",
      "roll>=CONSIGN_RULES.cleanBelow"
    ],
    "source": {
      "file": "src/game/appraisal/brokerage.ts",
      "line": 165,
      "endLine": 165
    },
    "expression": "grant(state,p,debuff)",
    "start": 11831,
    "end": 11857
  },
  {
    "id": "operation:src/game/appraisal/core2-actions.ts:7729",
    "name": "removeStatus",
    "owner": "code:src/game/appraisal/core2-actions.ts:useSkill",
    "args": [
      "p",
      "debuff.id"
    ],
    "statusIds": [],
    "guards": [],
    "source": {
      "file": "src/game/appraisal/core2-actions.ts",
      "line": 118,
      "endLine": 118
    },
    "expression": "removeStatus(p,debuff.id)",
    "start": 7729,
    "end": 7761
  },
  {
    "id": "operation:src/game/appraisal/core2-events.ts:6739",
    "name": "grant",
    "owner": "code:src/game/appraisal/core2-events.ts:resolveCore2Event",
    "args": [
      "state",
      "p",
      "s"
    ],
    "statusIds": [],
    "guards": [],
    "source": {
      "file": "src/game/appraisal/core2-events.ts",
      "line": 96,
      "endLine": 96
    },
    "expression": "grant(state,p,s)",
    "start": 6739,
    "end": 6755
  },
  {
    "id": "operation:src/game/appraisal/core2-events.ts:6917",
    "name": "grant",
    "owner": "code:src/game/appraisal/core2-events.ts:resolveCore2Event",
    "args": [
      "state",
      "p",
      "s"
    ],
    "statusIds": [],
    "guards": [
      "picked.gamble"
    ],
    "source": {
      "file": "src/game/appraisal/core2-events.ts",
      "line": 99,
      "endLine": 99
    },
    "expression": "grant(state,p,s)",
    "start": 6917,
    "end": 6933
  },
  {
    "id": "operation:src/game/appraisal/events.ts:29331",
    "name": "removeStatus",
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "args": [
      "p",
      "selected"
    ],
    "statusIds": [],
    "guards": [],
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 331,
      "endLine": 331
    },
    "expression": "removeStatus(p,selected)",
    "start": 29331,
    "end": 29356
  },
  {
    "id": "operation:src/game/appraisal/events.ts:29357",
    "name": "grant",
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "args": [
      "state",
      "p",
      "next"
    ],
    "statusIds": [],
    "guards": [],
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 331,
      "endLine": 331
    },
    "expression": "grant(state,p,next)",
    "start": 29357,
    "end": 29377
  },
  {
    "id": "operation:src/game/appraisal/events.ts:33592",
    "name": "removeStatus",
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "args": [
      "p",
      "selected"
    ],
    "statusIds": [],
    "guards": [],
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 359,
      "endLine": 359
    },
    "expression": "removeStatus(p,selected)",
    "start": 33592,
    "end": 33617
  },
  {
    "id": "operation:src/game/appraisal/events.ts:34011",
    "name": "removeStatus",
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "args": [
      "p",
      "selected"
    ],
    "statusIds": [],
    "guards": [
      "power===1||randomAt(state.seed,`${offer.key}:${v}:copy-potion`)<power"
    ],
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 360,
      "endLine": 360
    },
    "expression": "removeStatus(p,selected)",
    "start": 34011,
    "end": 34035
  },
  {
    "id": "operation:src/game/appraisal/events.ts:35418",
    "name": "removeStatus",
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "args": [
      "p",
      "selected"
    ],
    "statusIds": [],
    "guards": [],
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 370,
      "endLine": 370
    },
    "expression": "removeStatus(p,selected)",
    "start": 35418,
    "end": 35443
  },
  {
    "id": "operation:src/game/appraisal/events.ts:38666",
    "name": "grant",
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "args": [
      "state",
      "p",
      "s"
    ],
    "statusIds": [],
    "guards": [],
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 390,
      "endLine": 390
    },
    "expression": "grant(state,p,s)",
    "start": 38666,
    "end": 38683
  },
  {
    "id": "operation:src/game/appraisal/events.ts:38864",
    "name": "grant",
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "args": [
      "state",
      "p",
      "picked"
    ],
    "statusIds": [],
    "guards": [],
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 392,
      "endLine": 392
    },
    "expression": "grant(state,p,picked)",
    "start": 38864,
    "end": 38885
  },
  {
    "id": "operation:src/game/appraisal/events.ts:39679",
    "name": "removeStatus",
    "owner": "code:src/game/appraisal/events.ts:resolveEvent",
    "args": [
      "p",
      "selected"
    ],
    "statusIds": [],
    "guards": [],
    "source": {
      "file": "src/game/appraisal/events.ts",
      "line": 397,
      "endLine": 397
    },
    "expression": "removeStatus(p,selected)",
    "start": 39679,
    "end": 39704
  },
  {
    "id": "operation:src/game/appraisal/mechanics.ts:21773",
    "name": "grant",
    "owner": "code:src/game/appraisal/mechanics.ts:appraise",
    "args": [
      "state",
      "p",
      "p.honestyReward"
    ],
    "statusIds": [],
    "guards": [
      "p.honestyReward && accuracy"
    ],
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 287,
      "endLine": 287
    },
    "expression": "grant(state,p,p.honestyReward)",
    "start": 21773,
    "end": 21804
  },
  {
    "id": "operation:src/game/appraisal/mechanics.ts:31348",
    "name": "grant",
    "owner": "code:src/game/appraisal/mechanics.ts:purchase",
    "args": [
      "state",
      "buyer",
      "options.grantStatus"
    ],
    "statusIds": [],
    "guards": [
      "options.grantStatus"
    ],
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 394,
      "endLine": 394
    },
    "expression": "grant(state,buyer,options.grantStatus)",
    "start": 31348,
    "end": 31387
  },
  {
    "id": "operation:src/game/appraisal/mechanics.ts:31413",
    "name": "grant",
    "owner": "code:src/game/appraisal/mechanics.ts:purchase",
    "args": [
      "state",
      "buyer",
      "profile.condition"
    ],
    "statusIds": [],
    "guards": [
      "options.condition"
    ],
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 395,
      "endLine": 395
    },
    "expression": "grant(state,buyer,profile.condition)",
    "start": 31413,
    "end": 31450
  },
  {
    "id": "operation:src/game/appraisal/mechanics.ts:32154",
    "name": "grant",
    "owner": "code:src/game/appraisal/mechanics.ts:activate",
    "args": [
      "state",
      "p",
      "spec.drawback",
      "undefined",
      "itemDrawbackScale(item)"
    ],
    "statusIds": [],
    "guards": [
      "item.cursed"
    ],
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 405,
      "endLine": 405
    },
    "expression": "grant(state,p,spec.drawback,undefined,itemDrawbackScale(item))",
    "start": 32154,
    "end": 32217
  },
  {
    "id": "operation:src/game/appraisal/mechanics.ts:35381",
    "name": "grant",
    "owner": "code:src/game/appraisal/mechanics.ts:activate",
    "args": [
      "state",
      "p",
      "spec.buff",
      "undefined",
      "power"
    ],
    "statusIds": [],
    "guards": [
      "works",
      "NOT state.config.trustAbilities && (ABILITY_ITEM_IDS as readonly string[]).includes(item.kind)",
      "NOT state.config.trustAbilities && item.kind in MODERN_ACTIVATIONS",
      "NOT itemFamily(item.kind) === 'orb'",
      "NOT itemFamily(item.kind) === 'key' && status(p,'D07')"
    ],
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 436,
      "endLine": 436
    },
    "expression": "grant(state,p,spec.buff,undefined,power)",
    "start": 35381,
    "end": 35422
  },
  {
    "id": "operation:src/game/appraisal/mechanics.ts:41709",
    "name": "grant",
    "owner": "code:src/game/appraisal/mechanics.ts:marketSell",
    "args": [
      "state",
      "p",
      "cost.statusId"
    ],
    "statusIds": [],
    "guards": [
      "contract && !matched",
      "NOT resolution==='discount'",
      "NOT cost.kind==='energy'",
      "NOT cost.kind==='life'"
    ],
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 511,
      "endLine": 511
    },
    "expression": "grant(state,p,cost.statusId)",
    "start": 41709,
    "end": 41738
  },
  {
    "id": "operation:src/game/appraisal/mechanics.ts:42587",
    "name": "grant",
    "owner": "code:src/game/appraisal/mechanics.ts:marketSell",
    "args": [
      "state",
      "p",
      "bonus.statusId"
    ],
    "statusIds": [],
    "guards": [
      "matched && contract",
      "NOT bonus.kind==='energy'",
      "NOT bonus.kind==='life'",
      "bonus.kind==='buff'"
    ],
    "source": {
      "file": "src/game/appraisal/mechanics.ts",
      "line": 523,
      "endLine": 523
    },
    "expression": "grant(state,p,bonus.statusId)",
    "start": 42587,
    "end": 42616
  },
  {
    "id": "operation:src/game/appraisal/merchant-abilities.ts:8327",
    "name": "removeStatus",
    "owner": "code:src/game/appraisal/merchant-abilities.ts:useMerchantAbility",
    "args": [
      "p",
      "action.statusId"
    ],
    "statusIds": [],
    "guards": [],
    "source": {
      "file": "src/game/appraisal/merchant-abilities.ts",
      "line": 92,
      "endLine": 92
    },
    "expression": "removeStatus(p,action.statusId)",
    "start": 8327,
    "end": 8358
  },
  {
    "id": "operation:src/game/appraisal/npc-events.ts:5638",
    "name": "grant",
    "owner": "code:src/game/appraisal/npc-events.ts:randomBuff",
    "args": [
      "state",
      "p",
      "id"
    ],
    "statusIds": [],
    "guards": [],
    "source": {
      "file": "src/game/appraisal/npc-events.ts",
      "line": 70,
      "endLine": 70
    },
    "expression": "grant(state,p,id)",
    "start": 5638,
    "end": 5655
  },
  {
    "id": "operation:src/game/appraisal/npc-events.ts:8884",
    "name": "removeStatus",
    "owner": "code:src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent",
    "args": [
      "p",
      "command.statusId!"
    ],
    "statusIds": [],
    "guards": [
      "command.choice==='purge'"
    ],
    "source": {
      "file": "src/game/appraisal/npc-events.ts",
      "line": 105,
      "endLine": 105
    },
    "expression": "removeStatus(p,command.statusId!)",
    "start": 8884,
    "end": 8917
  },
  {
    "id": "operation:src/game/appraisal/npc-events.ts:9141",
    "name": "grant",
    "owner": "code:src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent",
    "args": [
      "state",
      "victim!",
      "id"
    ],
    "statusIds": [],
    "guards": [
      "NOT command.choice==='purge'"
    ],
    "source": {
      "file": "src/game/appraisal/npc-events.ts",
      "line": 106,
      "endLine": 106
    },
    "expression": "grant(state,victim!,id)",
    "start": 9141,
    "end": 9164
  },
  {
    "id": "operation:src/game/appraisal/theft.ts:11707",
    "name": "consumeStatus",
    "owner": "code:src/game/appraisal/theft.ts:breakTie",
    "args": [
      "thief",
      "id"
    ],
    "statusIds": [],
    "guards": [],
    "source": {
      "file": "src/game/appraisal/theft.ts",
      "line": 220,
      "endLine": 220
    },
    "expression": "consumeStatus(thief,id)",
    "start": 11707,
    "end": 11730
  }
]
```
## Reference ที่ resolve ไม่ได้

```json
[]
```