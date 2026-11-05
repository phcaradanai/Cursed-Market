# Encounter / configuration / tuning

Encounter เป็นการสร้างตาม seed และ state ไม่ใช่รายการตายตัว ความน่าจะเป็นเข้าระบบไม่ใช่ความน่าจะเป็นราย event

## สร้าง encounter/ประตู/สต็อก

เป็นโมเดลสร้างตาม seed ผู้เล่น ช่วง พ่อค้า ความไว้ใจ และ config ไม่ใช่รายชื่อ encounter ตายตัวทั้งหมด

```json
{
  "id": "generation",
  "name": "สร้าง encounter/ประตู/สต็อก",
  "functionNames": [
    "createAppraisalRun",
    "spawnStockItem",
    "rerollPortal",
    "makeMarket"
  ],
  "note": "เป็นโมเดลสร้างตาม seed ผู้เล่น ช่วง พ่อค้า ความไว้ใจ และ config ไม่ใช่รายชื่อ encounter ตายตัวทั้งหมด",
  "functionRefs": [
    "code:apps/comic/src/game/appraisal/engine.ts:createAppraisalRun",
    "code:apps/comic/src/game/appraisal/engine.ts:spawnStockItem",
    "code:apps/comic/src/game/appraisal/engine.ts:rerollPortal",
    "code:apps/comic/src/game/appraisal/engine.ts:makeMarket"
  ]
}
```

## เข้า turn และเปิดเหตุการณ์

generic entry draw ใช้ randomAt < .55; ความถี่ของ event รายตัวต้องผ่าน pool และ eligibility ก่อน ไม่ใช่ 55% ต่อ event

```json
{
  "id": "entry",
  "name": "เข้า turn และเปิดเหตุการณ์",
  "functionNames": [
    "advanceAppraisalEncounter",
    "drawEvent",
    "drawPersonalNpcEvent",
    "drawBondEvent",
    "drawWishEvent",
    "drawExpansionEvent",
    "drawPolishEvent"
  ],
  "note": "generic entry draw ใช้ randomAt < .55; ความถี่ของ event รายตัวต้องผ่าน pool และ eligibility ก่อน ไม่ใช่ 55% ต่อ event",
  "functionRefs": [
    "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
    "code:apps/comic/src/game/appraisal/events.ts:drawEvent",
    "code:apps/comic/src/game/appraisal/events.ts:drawPersonalNpcEvent",
    "code:apps/comic/src/game/appraisal/events.ts:drawBondEvent",
    "code:apps/comic/src/game/appraisal/events.ts:drawWishEvent",
    "code:apps/comic/src/game/appraisal/wishlist.ts:drawWishEvent",
    "code:apps/comic/src/game/appraisal/events.ts:drawExpansionEvent",
    "code:apps/comic/src/game/appraisal/events.ts:drawPolishEvent"
  ]
}
```

## ลำดับเสนอเหตุการณ์หน้า APPRAISAL

เลือกอันแรกที่สำเร็จตาม short-circuit; ไม่ได้สุ่มทุกตระกูลอิสระพร้อมกัน

```json
{
  "id": "appraisal-pipeline",
  "name": "ลำดับเสนอเหตุการณ์หน้า APPRAISAL",
  "functionNames": [
    "progress",
    "drawPersonalNpcEvent",
    "drawBondEvent",
    "drawWishEvent",
    "drawExpansionEvent",
    "drawPolishEvent",
    "drawEvent"
  ],
  "orderedDraws": [
    "drawPersonalNpcEvent",
    "drawBondEvent",
    "drawWishEvent",
    "drawExpansionEvent",
    "drawPolishEvent",
    "drawEvent"
  ],
  "note": "เลือกอันแรกที่สำเร็จตาม short-circuit; ไม่ได้สุ่มทุกตระกูลอิสระพร้อมกัน",
  "functionRefs": [
    "code:apps/comic/src/game/appraisal/engine.ts:progress",
    "code:apps/comic/src/game/appraisal/events.ts:drawPersonalNpcEvent",
    "code:apps/comic/src/game/appraisal/events.ts:drawBondEvent",
    "code:apps/comic/src/game/appraisal/events.ts:drawWishEvent",
    "code:apps/comic/src/game/appraisal/wishlist.ts:drawWishEvent",
    "code:apps/comic/src/game/appraisal/events.ts:drawExpansionEvent",
    "code:apps/comic/src/game/appraisal/events.ts:drawPolishEvent",
    "code:apps/comic/src/game/appraisal/events.ts:drawEvent"
  ]
}
```

## ปิด encounter/ภัย/ชีวิต/Collector

source guards and call order determine actual application; do not add damage from all branches simultaneously

```json
{
  "id": "settlement",
  "name": "ปิด encounter/ภัย/ชีวิต/Collector",
  "functionNames": [
    "settleEncounter",
    "applyCore2Settlement",
    "applyDread",
    "mendWithShards",
    "collectorDue",
    "collectRun",
    "openRoundRewards"
  ],
  "note": "source guards and call order determine actual application; do not add damage from all branches simultaneously",
  "functionRefs": [
    "code:apps/comic/src/game/appraisal/engine.ts:settleEncounter",
    "code:apps/comic/src/game/appraisal/core2-rules.ts:applyCore2Settlement",
    "code:apps/comic/src/game/appraisal/core2-rules.ts:applyDread",
    "code:apps/comic/src/game/appraisal/mechanics.ts:mendWithShards",
    "code:apps/comic/src/game/appraisal/survival.ts:collectorDue",
    "code:apps/comic/src/game/appraisal/survival.ts:collectRun",
    "code:apps/comic/src/game/appraisal/round-rewards.ts:openRoundRewards"
  ]
}
```

## ขึ้นช่วงถัดไปและชำระตามเวลา

รันใหม่ vaultInterestRules:1 ใช้เงินต้นครบช่วง 10%; audit ไม่มี flag รักษา 4% เดิม

```json
{
  "id": "advance",
  "name": "ขึ้นช่วงถัดไปและชำระตามเวลา",
  "functionNames": [
    "advanceAppraisalEncounter",
    "settleLoansBeforeAdvance",
    "collectCompensations",
    "payVaultInterest",
    "closeSealOffers",
    "resetCore2Encounter"
  ],
  "note": "รันใหม่ vaultInterestRules:1 ใช้เงินต้นครบช่วง 10%; audit ไม่มี flag รักษา 4% เดิม",
  "functionRefs": [
    "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
    "code:apps/comic/src/game/appraisal/secure-storage.ts:settleLoansBeforeAdvance",
    "code:apps/comic/src/game/appraisal/theft.ts:collectCompensations",
    "code:apps/comic/src/game/appraisal/secure-storage.ts:payVaultInterest",
    "code:apps/comic/src/game/appraisal/seals.ts:closeSealOffers",
    "code:apps/comic/src/game/appraisal/core2-rules.ts:resetCore2Encounter"
  ]
}
```

## นาฬิกา phase/ดวลและ default action

Comic ใหม่ theftTimeoutRules:1 สุ่มเฉพาะมือที่ยังไม่ส่งตาม deadline ตา30วินาที; audit ไม่มีflagคงยกเลิกแบบเก่า; phaseหมดเวลาไม่ล้ำเข้ารีตาใหม่

```json
{
  "id": "timeout",
  "name": "นาฬิกา phase/ดวลและ default action",
  "functionNames": [
    "AppraisalRoomService.sweep",
    "AppraisalRoomService.timeout",
    "defaultAppraisalAction",
    "defaultEvent",
    "expireTheftDuel"
  ],
  "note": "Comic ใหม่ theftTimeoutRules:1 สุ่มเฉพาะมือที่ยังไม่ส่งตาม deadline ตา30วินาที; audit ไม่มีflagคงยกเลิกแบบเก่า; phaseหมดเวลาไม่ล้ำเข้ารีตาใหม่",
  "functionRefs": [
    "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.sweep",
    "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.timeout",
    "code:apps/comic/src/game/appraisal/engine.ts:defaultAppraisalAction",
    "code:apps/comic/src/game/appraisal/events.ts:defaultEvent",
    "code:apps/comic/src/game/appraisal/theft.ts:expireTheftDuel"
  ]
}
```

# Phases และ timers
```json
{
  "phases": [
    {
      "id": "PORTALS",
      "assignments": [
        {
          "phase": "PORTALS",
          "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
          "source": {
            "file": "apps/comic/src/game/appraisal/engine.ts",
            "line": 453,
            "endLine": 453
          },
          "guards": [],
          "expression": "state.phase='PORTALS'"
        }
      ],
      "semantics": "เลือกประตู/พ่อค้า"
    },
    {
      "id": "APPRAISAL",
      "assignments": [
        {
          "phase": "APPRAISAL",
          "owner": "code:apps/comic/src/game/appraisal/engine.ts:progress",
          "source": {
            "file": "apps/comic/src/game/appraisal/engine.ts",
            "line": 233,
            "endLine": 233
          },
          "guards": [
            "state.phase==='PORTALS'"
          ],
          "expression": "state.phase='APPRAISAL'"
        }
      ],
      "semantics": "ตรวจ ประเมิน ซื้อ และเหตุการณ์พ่อค้า"
    },
    {
      "id": "TRADE",
      "assignments": [
        {
          "phase": "TRADE",
          "owner": "code:apps/comic/src/game/appraisal/engine.ts:progress",
          "source": {
            "file": "apps/comic/src/game/appraisal/engine.ts",
            "line": 236,
            "endLine": 236
          },
          "guards": [
            "NOT state.phase==='PORTALS'",
            "state.phase==='APPRAISAL'"
          ],
          "expression": "state.phase='TRADE'"
        }
      ],
      "semantics": "ซื้อขายระหว่างผู้เล่น/ตลาด/การกระทำตามสิทธิ์"
    },
    {
      "id": "REVEAL",
      "assignments": [
        {
          "phase": "REVEAL",
          "owner": "code:apps/comic/src/game/appraisal/engine.ts:settleEncounter",
          "source": {
            "file": "apps/comic/src/game/appraisal/engine.ts",
            "line": 226,
            "endLine": 226
          },
          "guards": [
            "NOT state.config.survival && (state.players.every(p=>p.life===0) || collectorDue(state))"
          ],
          "expression": "state.phase='REVEAL'"
        },
        {
          "phase": "REVEAL",
          "owner": "code:apps/comic/src/game/appraisal/survival.ts:collectRun",
          "source": {
            "file": "apps/comic/src/game/appraisal/survival.ts",
            "line": 21,
            "endLine": 21
          },
          "guards": [
            "state.config.secureEconomy",
            "NOT state.config.loanEndSettlement"
          ],
          "expression": "state.phase='REVEAL'"
        }
      ],
      "semantics": "สรุปช่วงและรับ/เสี่ยงรางวัล"
    },
    {
      "id": "RESULTS",
      "assignments": [
        {
          "phase": "RESULTS",
          "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
          "source": {
            "file": "apps/comic/src/game/appraisal/engine.ts",
            "line": 452,
            "endLine": 452
          },
          "guards": [
            "!state.config.survival && state.encounter===state.config.encounters"
          ],
          "expression": "state.phase='RESULTS'"
        },
        {
          "phase": "RESULTS",
          "owner": "code:apps/comic/src/game/appraisal/survival.ts:collectRun",
          "source": {
            "file": "apps/comic/src/game/appraisal/survival.ts",
            "line": 38,
            "endLine": 38
          },
          "guards": [],
          "expression": "state.phase='RESULTS'"
        }
      ],
      "semantics": "สรุปรันและ Collector"
    }
  ],
  "timers": {
    "APPRAISAL_PHASE_MS": {
      "value": {
        "PORTALS": 30000,
        "APPRAISAL": 90000,
        "TRADE": 45000,
        "REVEAL": 30000
      },
      "source": {
        "file": "apps/comic/src/server/appraisal-rooms.ts",
        "line": 14,
        "endLine": 16
      }
    },
    "BOT_RETIRE_ENCOUNTER": {
      "value": 12,
      "source": {
        "file": "apps/comic/src/server/appraisal-rooms.ts",
        "line": 18,
        "endLine": 18
      }
    },
    "APPRAISAL_DUEL_MS": {
      "value": 30000,
      "source": {
        "file": "apps/comic/src/server/appraisal-rooms.ts",
        "line": 20,
        "endLine": 20
      }
    }
  }
}
```
# Profiles
ค่าที่ไม่กำหนดไม่เท่ากับ false; profile server-entry-merged ยังอาจถูกปรับตาม room mode
```json
[
  {
    "id": "engine-default",
    "name": "DEFAULT_APPRAISAL_CONFIG",
    "values": {
      "rarityEconomy": {
        "version": 1,
        "tiers": {
          "common": {
            "value": 1,
            "effect": 1
          },
          "uncommon": {
            "value": 2,
            "effect": 2
          },
          "rare": {
            "value": 3,
            "effect": 3
          },
          "epic": {
            "value": 4,
            "effect": 4
          },
          "legendary": {
            "value": 6,
            "effect": 6
          },
          "mythic": {
            "value": 8,
            "effect": 8
          }
        }
      },
      "rarity": {
        "version": 1,
        "rates": {
          "common": 0.6,
          "uncommon": 0.25,
          "rare": 0.1,
          "epic": 0.035,
          "legendary": 0.013,
          "mythic": 0.002
        },
        "themes": {
          "common": [
            {
              "theme": "plain",
              "weight": 1
            }
          ],
          "uncommon": [
            {
              "theme": "inferno",
              "weight": 1
            },
            {
              "theme": "frost",
              "weight": 1
            },
            {
              "theme": "storm",
              "weight": 1
            },
            {
              "theme": "venom",
              "weight": 1
            },
            {
              "theme": "spirit",
              "weight": 1
            },
            {
              "theme": "lunar",
              "weight": 1
            },
            {
              "theme": "solar",
              "weight": 1
            },
            {
              "theme": "void",
              "weight": 1
            },
            {
              "theme": "prism",
              "weight": 1
            },
            {
              "theme": "clockwork",
              "weight": 1
            }
          ],
          "rare": [
            {
              "theme": "inferno",
              "weight": 1
            },
            {
              "theme": "frost",
              "weight": 1
            },
            {
              "theme": "storm",
              "weight": 1
            },
            {
              "theme": "venom",
              "weight": 1
            },
            {
              "theme": "spirit",
              "weight": 1
            },
            {
              "theme": "lunar",
              "weight": 1
            },
            {
              "theme": "solar",
              "weight": 1
            },
            {
              "theme": "void",
              "weight": 1
            },
            {
              "theme": "prism",
              "weight": 1
            },
            {
              "theme": "clockwork",
              "weight": 1
            }
          ],
          "epic": [
            {
              "theme": "inferno",
              "weight": 1
            },
            {
              "theme": "frost",
              "weight": 1
            },
            {
              "theme": "storm",
              "weight": 1
            },
            {
              "theme": "venom",
              "weight": 1
            },
            {
              "theme": "spirit",
              "weight": 1
            },
            {
              "theme": "lunar",
              "weight": 1
            },
            {
              "theme": "solar",
              "weight": 1
            },
            {
              "theme": "void",
              "weight": 1
            },
            {
              "theme": "prism",
              "weight": 1
            },
            {
              "theme": "clockwork",
              "weight": 1
            }
          ],
          "legendary": [
            {
              "theme": "inferno",
              "weight": 1
            },
            {
              "theme": "frost",
              "weight": 1
            },
            {
              "theme": "storm",
              "weight": 1
            },
            {
              "theme": "venom",
              "weight": 1
            },
            {
              "theme": "spirit",
              "weight": 1
            },
            {
              "theme": "lunar",
              "weight": 1
            },
            {
              "theme": "solar",
              "weight": 1
            },
            {
              "theme": "void",
              "weight": 1
            },
            {
              "theme": "prism",
              "weight": 1
            },
            {
              "theme": "clockwork",
              "weight": 1
            }
          ],
          "mythic": [
            {
              "theme": "inferno",
              "weight": 1
            },
            {
              "theme": "frost",
              "weight": 1
            },
            {
              "theme": "storm",
              "weight": 1
            },
            {
              "theme": "venom",
              "weight": 1
            },
            {
              "theme": "spirit",
              "weight": 1
            },
            {
              "theme": "lunar",
              "weight": 1
            },
            {
              "theme": "solar",
              "weight": 1
            },
            {
              "theme": "void",
              "weight": 1
            },
            {
              "theme": "prism",
              "weight": 1
            },
            {
              "theme": "clockwork",
              "weight": 1
            }
          ]
        }
      },
      "loanEndSettlement": true,
      "vaultInterestRules": 1,
      "theftTimeoutRules": 1,
      "collectorDeadline": 15,
      "eventChoiceRules": 1,
      "statusLinks": 1,
      "systemLinks": 1,
      "trustAbilities": true,
      "catalogVersion": 3,
      "itemEffects": true,
      "roundRewards": true,
      "multiCoinRewards": true,
      "commerce": true,
      "totalTrustStock": true,
      "curseSight": true,
      "freeBuy": true,
      "freeMerchantAction": true,
      "fakeEffect": true,
      "cleanse": true,
      "wishlist": true,
      "wishContract": true,
      "challenge": true,
      "expansion": true,
      "encounters": 3,
      "startingCredits": 40,
      "maxEnergy": 10,
      "recoveryEnergy": 4,
      "bankReserve": 2000,
      "marketProbability": 1,
      "marketMaxOrders": 3,
      "marketQuota": 1
    },
    "source": {
      "file": "apps/comic/src/game/appraisal/engine.ts",
      "line": 37,
      "endLine": 44
    }
  },
  {
    "id": "room-constructor",
    "name": "Room constructor fallback",
    "expression": "{survival:SURVIVAL_RULES}",
    "values": {
      "survival": {
        "maxLife": 6,
        "encounterLifeCost": 1,
        "entryEnergyCost": 0
      }
    },
    "source": {
      "file": "apps/comic/src/server/appraisal-rooms.ts",
      "line": 25
    }
  },
  {
    "id": "server-entry",
    "name": "Server entry overrides",
    "expression": "{personalScoringRules:1,collectorWishlistRules:1,secureEconomy:true,brokerage:BROKERAGE_RULES,polish:true,npcEvents:true,core2:true,survival:SURVIVAL_RULES,...(pilot?{catalogVersion:4 as const}:{})}",
    "source": {
      "file": "apps/comic/src/server/appraisal-main.ts",
      "line": 8
    },
    "note": "Do not treat engine defaults alone as the live room profile; read the server overrides and room mode.",
    "values": {
      "personalScoringRules": 1,
      "collectorWishlistRules": 1,
      "secureEconomy": true,
      "brokerage": {
        "auctionProbability": 0.5,
        "maxLots": 2,
        "bondProbability": 0.65
      },
      "polish": true,
      "npcEvents": true,
      "core2": true,
      "survival": {
        "maxLife": 6,
        "encounterLifeCost": 1,
        "entryEnergyCost": 0
      },
      "$expression": "pilot?{catalogVersion:4 as const}:{}"
    }
  },
  {
    "id": "server-entry-merged",
    "name": "Engine defaults + server entry (before room-mode adjustments)",
    "values": {
      "rarityEconomy": {
        "version": 1,
        "tiers": {
          "common": {
            "value": 1,
            "effect": 1
          },
          "uncommon": {
            "value": 2,
            "effect": 2
          },
          "rare": {
            "value": 3,
            "effect": 3
          },
          "epic": {
            "value": 4,
            "effect": 4
          },
          "legendary": {
            "value": 6,
            "effect": 6
          },
          "mythic": {
            "value": 8,
            "effect": 8
          }
        }
      },
      "rarity": {
        "version": 1,
        "rates": {
          "common": 0.6,
          "uncommon": 0.25,
          "rare": 0.1,
          "epic": 0.035,
          "legendary": 0.013,
          "mythic": 0.002
        },
        "themes": {
          "common": [
            {
              "theme": "plain",
              "weight": 1
            }
          ],
          "uncommon": [
            {
              "theme": "inferno",
              "weight": 1
            },
            {
              "theme": "frost",
              "weight": 1
            },
            {
              "theme": "storm",
              "weight": 1
            },
            {
              "theme": "venom",
              "weight": 1
            },
            {
              "theme": "spirit",
              "weight": 1
            },
            {
              "theme": "lunar",
              "weight": 1
            },
            {
              "theme": "solar",
              "weight": 1
            },
            {
              "theme": "void",
              "weight": 1
            },
            {
              "theme": "prism",
              "weight": 1
            },
            {
              "theme": "clockwork",
              "weight": 1
            }
          ],
          "rare": [
            {
              "theme": "inferno",
              "weight": 1
            },
            {
              "theme": "frost",
              "weight": 1
            },
            {
              "theme": "storm",
              "weight": 1
            },
            {
              "theme": "venom",
              "weight": 1
            },
            {
              "theme": "spirit",
              "weight": 1
            },
            {
              "theme": "lunar",
              "weight": 1
            },
            {
              "theme": "solar",
              "weight": 1
            },
            {
              "theme": "void",
              "weight": 1
            },
            {
              "theme": "prism",
              "weight": 1
            },
            {
              "theme": "clockwork",
              "weight": 1
            }
          ],
          "epic": [
            {
              "theme": "inferno",
              "weight": 1
            },
            {
              "theme": "frost",
              "weight": 1
            },
            {
              "theme": "storm",
              "weight": 1
            },
            {
              "theme": "venom",
              "weight": 1
            },
            {
              "theme": "spirit",
              "weight": 1
            },
            {
              "theme": "lunar",
              "weight": 1
            },
            {
              "theme": "solar",
              "weight": 1
            },
            {
              "theme": "void",
              "weight": 1
            },
            {
              "theme": "prism",
              "weight": 1
            },
            {
              "theme": "clockwork",
              "weight": 1
            }
          ],
          "legendary": [
            {
              "theme": "inferno",
              "weight": 1
            },
            {
              "theme": "frost",
              "weight": 1
            },
            {
              "theme": "storm",
              "weight": 1
            },
            {
              "theme": "venom",
              "weight": 1
            },
            {
              "theme": "spirit",
              "weight": 1
            },
            {
              "theme": "lunar",
              "weight": 1
            },
            {
              "theme": "solar",
              "weight": 1
            },
            {
              "theme": "void",
              "weight": 1
            },
            {
              "theme": "prism",
              "weight": 1
            },
            {
              "theme": "clockwork",
              "weight": 1
            }
          ],
          "mythic": [
            {
              "theme": "inferno",
              "weight": 1
            },
            {
              "theme": "frost",
              "weight": 1
            },
            {
              "theme": "storm",
              "weight": 1
            },
            {
              "theme": "venom",
              "weight": 1
            },
            {
              "theme": "spirit",
              "weight": 1
            },
            {
              "theme": "lunar",
              "weight": 1
            },
            {
              "theme": "solar",
              "weight": 1
            },
            {
              "theme": "void",
              "weight": 1
            },
            {
              "theme": "prism",
              "weight": 1
            },
            {
              "theme": "clockwork",
              "weight": 1
            }
          ]
        }
      },
      "loanEndSettlement": true,
      "vaultInterestRules": 1,
      "theftTimeoutRules": 1,
      "collectorDeadline": 15,
      "eventChoiceRules": 1,
      "statusLinks": 1,
      "systemLinks": 1,
      "trustAbilities": true,
      "catalogVersion": 3,
      "itemEffects": true,
      "roundRewards": true,
      "multiCoinRewards": true,
      "commerce": true,
      "totalTrustStock": true,
      "curseSight": true,
      "freeBuy": true,
      "freeMerchantAction": true,
      "fakeEffect": true,
      "cleanse": true,
      "wishlist": true,
      "wishContract": true,
      "challenge": true,
      "expansion": true,
      "encounters": 3,
      "startingCredits": 40,
      "maxEnergy": 10,
      "recoveryEnergy": 4,
      "bankReserve": 2000,
      "marketProbability": 1,
      "marketMaxOrders": 3,
      "marketQuota": 1,
      "personalScoringRules": 1,
      "collectorWishlistRules": 1,
      "secureEconomy": true,
      "brokerage": {
        "auctionProbability": 0.5,
        "maxLots": 2,
        "bondProbability": 0.65
      },
      "polish": true,
      "npcEvents": true,
      "core2": true,
      "survival": {
        "maxLife": 6,
        "encounterLifeCost": 1,
        "entryEnergyCost": 0
      },
      "$expression": "pilot?{catalogVersion:4 as const}:{}"
    },
    "source": {
      "file": "apps/comic/src/server/appraisal-main.ts",
      "line": 8
    },
    "note": "Actual room options/mode can still adjust this profile; this is not a live-room read."
  }
]
```
# Config reads
```json
[
  {
    "key": "bankReserve",
    "default": 2000,
    "defaultPresent": true,
    "reads": [
      {
        "key": "bankReserve",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:initialiseAppraisalRun",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 109,
          "endLine": 109
        },
        "expression": "config.bankReserve",
        "guards": []
      },
      {
        "key": "bankReserve",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 498,
          "endLine": 498
        },
        "expression": "state.config.bankReserve",
        "guards": []
      },
      {
        "key": "bankReserve",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 500,
          "endLine": 500
        },
        "expression": "state.config.bankReserve",
        "guards": []
      }
    ]
  },
  {
    "key": "brokerage",
    "default": null,
    "defaultPresent": false,
    "reads": [
      {
        "key": "brokerage",
        "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:bondEligible",
        "source": {
          "file": "apps/comic/src/game/appraisal/brokerage.ts",
          "line": 47,
          "endLine": 47
        },
        "expression": "state.config.brokerage",
        "guards": []
      },
      {
        "key": "brokerage",
        "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:unsoldItems",
        "source": {
          "file": "apps/comic/src/game/appraisal/brokerage.ts",
          "line": 118,
          "endLine": 118
        },
        "expression": "state.config.brokerage",
        "guards": []
      },
      {
        "key": "brokerage",
        "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:vaultSale",
        "source": {
          "file": "apps/comic/src/game/appraisal/brokerage.ts",
          "line": 192,
          "endLine": 192
        },
        "expression": "state.config.brokerage",
        "guards": []
      },
      {
        "key": "brokerage",
        "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:auctionLots",
        "source": {
          "file": "apps/comic/src/game/appraisal/brokerage.ts",
          "line": 197,
          "endLine": 197
        },
        "expression": "state.config.brokerage",
        "guards": []
      },
      {
        "key": "brokerage",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 92,
          "endLine": 92
        },
        "expression": "config.brokerage",
        "guards": []
      },
      {
        "key": "brokerage",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 93,
          "endLine": 93
        },
        "expression": "config.brokerage",
        "guards": [
          "config.brokerage!==undefined"
        ]
      },
      {
        "key": "brokerage",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:initialiseAppraisalRun",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 111,
          "endLine": 111
        },
        "expression": "config.brokerage",
        "guards": []
      },
      {
        "key": "brokerage",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:makeMarket",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 176,
          "endLine": 176
        },
        "expression": "state.config.brokerage",
        "guards": []
      },
      {
        "key": "brokerage",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:settleEncounter",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 204,
          "endLine": 204
        },
        "expression": "state.config.brokerage",
        "guards": []
      },
      {
        "key": "brokerage",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 427,
          "endLine": 427
        },
        "expression": "state.config.brokerage",
        "guards": []
      },
      {
        "key": "brokerage",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 428,
          "endLine": 428
        },
        "expression": "state.config.brokerage",
        "guards": []
      },
      {
        "key": "brokerage",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 529,
          "endLine": 529
        },
        "expression": "state.config.brokerage",
        "guards": []
      },
      {
        "key": "brokerage",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:polishEligible",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 66,
          "endLine": 66
        },
        "expression": "state.config.brokerage",
        "guards": []
      },
      {
        "key": "brokerage",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:drawBondEvent",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 289,
          "endLine": 289
        },
        "expression": "state.config.brokerage",
        "guards": []
      },
      {
        "key": "brokerage",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:marketSell",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 563,
          "endLine": 563
        },
        "expression": "state.config.brokerage",
        "guards": []
      },
      {
        "key": "brokerage",
        "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:statusPool",
        "source": {
          "file": "apps/comic/src/game/appraisal/npc-events.ts",
          "line": 66,
          "endLine": 66
        },
        "expression": "state.config.brokerage",
        "guards": []
      },
      {
        "key": "brokerage",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 66,
          "endLine": 66
        },
        "expression": "state.config.brokerage",
        "guards": [
          "state.config.brokerage"
        ]
      }
    ]
  },
  {
    "key": "catalogVersion",
    "default": 3,
    "defaultPresent": true,
    "reads": [
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:pool",
        "source": {
          "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
          "line": 30,
          "endLine": 30
        },
        "expression": "state.config.catalogVersion",
        "guards": []
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/content.ts:expansionActive",
        "source": {
          "file": "apps/comic/src/game/appraisal/content.ts",
          "line": 749,
          "endLine": 749
        },
        "expression": "config.catalogVersion",
        "guards": []
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/content.ts:expansionActive",
        "source": {
          "file": "apps/comic/src/game/appraisal/content.ts",
          "line": 749,
          "endLine": 749
        },
        "expression": "config.catalogVersion",
        "guards": []
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/content.ts:expansionActive",
        "source": {
          "file": "apps/comic/src/game/appraisal/content.ts",
          "line": 749,
          "endLine": 749
        },
        "expression": "config.catalogVersion",
        "guards": []
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 46,
          "endLine": 46
        },
        "expression": "config.catalogVersion",
        "guards": []
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 81,
          "endLine": 81
        },
        "expression": "config.catalogVersion",
        "guards": []
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 81,
          "endLine": 81
        },
        "expression": "config.catalogVersion",
        "guards": []
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 81,
          "endLine": 81
        },
        "expression": "config.catalogVersion",
        "guards": []
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 81,
          "endLine": 81
        },
        "expression": "config.catalogVersion",
        "guards": []
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 81,
          "endLine": 81
        },
        "expression": "config.catalogVersion",
        "guards": []
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 81,
          "endLine": 81
        },
        "expression": "config.catalogVersion",
        "guards": []
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:spawnStockItem",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 130,
          "endLine": 130
        },
        "expression": "config.catalogVersion",
        "guards": []
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:damageLife",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 144,
          "endLine": 144
        },
        "expression": "state.config.catalogVersion",
        "guards": []
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:damageLife",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 144,
          "endLine": 144
        },
        "expression": "state.config.catalogVersion",
        "guards": []
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 434,
          "endLine": 434
        },
        "expression": "state.config.catalogVersion",
        "guards": [
          "spec.nativeEffect"
        ]
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 434,
          "endLine": 434
        },
        "expression": "state.config.catalogVersion",
        "guards": [
          "spec.nativeEffect"
        ]
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:makeCandidate",
        "source": {
          "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
          "line": 33,
          "endLine": 33
        },
        "expression": "config.catalogVersion",
        "guards": []
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/passives.ts:passivesEnabled",
        "source": {
          "file": "apps/comic/src/game/appraisal/passives.ts",
          "line": 39,
          "endLine": 39
        },
        "expression": "config.catalogVersion",
        "guards": []
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/passives.ts:passivesEnabled",
        "source": {
          "file": "apps/comic/src/game/appraisal/passives.ts",
          "line": 39,
          "endLine": 39
        },
        "expression": "config.catalogVersion",
        "guards": []
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/passives.ts:passivesEnabled",
        "source": {
          "file": "apps/comic/src/game/appraisal/passives.ts",
          "line": 39,
          "endLine": 39
        },
        "expression": "config.catalogVersion",
        "guards": []
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/pilot-effects.ts:pilotHeld",
        "source": {
          "file": "apps/comic/src/game/appraisal/pilot-effects.ts",
          "line": 7,
          "endLine": 7
        },
        "expression": "state.config.catalogVersion",
        "guards": []
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/pilot-effects.ts:pilotHeld",
        "source": {
          "file": "apps/comic/src/game/appraisal/pilot-effects.ts",
          "line": 7,
          "endLine": 7
        },
        "expression": "state.config.catalogVersion",
        "guards": []
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/pilot-effects.ts:swordForDuel",
        "source": {
          "file": "apps/comic/src/game/appraisal/pilot-effects.ts",
          "line": 37,
          "endLine": 37
        },
        "expression": "state.config.catalogVersion",
        "guards": []
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/pilot-effects.ts:reconcilePilotCustody",
        "source": {
          "file": "apps/comic/src/game/appraisal/pilot-effects.ts",
          "line": 44,
          "endLine": 44
        },
        "expression": "state.config.catalogVersion",
        "guards": []
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/pilot-effects.ts:reconcilePilotCustody",
        "source": {
          "file": "apps/comic/src/game/appraisal/pilot-effects.ts",
          "line": 44,
          "endLine": 44
        },
        "expression": "state.config.catalogVersion",
        "guards": []
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/remaining48-effects.ts:remainingHeld",
        "source": {
          "file": "apps/comic/src/game/appraisal/remaining48-effects.ts",
          "line": 15,
          "endLine": 15
        },
        "expression": "state.config.catalogVersion",
        "guards": []
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:payVaultInterest",
        "source": {
          "file": "apps/comic/src/game/appraisal/secure-storage.ts",
          "line": 215,
          "endLine": 215
        },
        "expression": "state.config.catalogVersion",
        "guards": [
          "state.config.vaultInterestRules===1",
          "(state.config.catalogVersion===4 || state.config.catalogVersion===5)"
        ]
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:payVaultInterest",
        "source": {
          "file": "apps/comic/src/game/appraisal/secure-storage.ts",
          "line": 215,
          "endLine": 215
        },
        "expression": "state.config.catalogVersion",
        "guards": [
          "state.config.vaultInterestRules===1",
          "(state.config.catalogVersion===4 || state.config.catalogVersion===5)"
        ]
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/theft.ts:startTheftDuel",
        "source": {
          "file": "apps/comic/src/game/appraisal/theft.ts",
          "line": 160,
          "endLine": 160
        },
        "expression": "state.config.catalogVersion",
        "guards": []
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/theft.ts:startTheftDuel",
        "source": {
          "file": "apps/comic/src/game/appraisal/theft.ts",
          "line": 160,
          "endLine": 160
        },
        "expression": "state.config.catalogVersion",
        "guards": []
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/theft.ts:chooseTheftHand",
        "source": {
          "file": "apps/comic/src/game/appraisal/theft.ts",
          "line": 273,
          "endLine": 273
        },
        "expression": "state.config.catalogVersion",
        "guards": [
          "thiefHand === opponentHand"
        ]
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/theft.ts:theftViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/theft.ts",
          "line": 347,
          "endLine": 347
        },
        "expression": "state.config.catalogVersion",
        "guards": []
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalItemView",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 39,
          "endLine": 39
        },
        "expression": "state.config.catalogVersion",
        "guards": [
          "isRemaining48Kind(item.kind)"
        ]
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 67,
          "endLine": 67
        },
        "expression": "state.config.catalogVersion",
        "guards": [
          "(state.config.catalogVersion===4 || state.config.catalogVersion===5)"
        ]
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 67,
          "endLine": 67
        },
        "expression": "state.config.catalogVersion",
        "guards": [
          "(state.config.catalogVersion===4 || state.config.catalogVersion===5)"
        ]
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:wishPick",
        "source": {
          "file": "apps/comic/src/game/appraisal/wishlist.ts",
          "line": 19,
          "endLine": 19
        },
        "expression": "state.config.catalogVersion",
        "guards": [
          "state.config.trustAbilities"
        ]
      },
      {
        "key": "catalogVersion",
        "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:wishPick",
        "source": {
          "file": "apps/comic/src/game/appraisal/wishlist.ts",
          "line": 19,
          "endLine": 19
        },
        "expression": "state.config.catalogVersion",
        "guards": [
          "state.config.trustAbilities"
        ]
      }
    ]
  },
  {
    "key": "challenge",
    "default": true,
    "defaultPresent": true,
    "reads": [
      {
        "key": "challenge",
        "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:pool",
        "source": {
          "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
          "line": 30,
          "endLine": 30
        },
        "expression": "state.config.challenge",
        "guards": []
      },
      {
        "key": "challenge",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 71,
          "endLine": 71
        },
        "expression": "config.challenge",
        "guards": []
      },
      {
        "key": "challenge",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 71,
          "endLine": 71
        },
        "expression": "config.challenge",
        "guards": []
      },
      {
        "key": "challenge",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:spawnStockItem",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 130,
          "endLine": 130
        },
        "expression": "config.challenge",
        "guards": []
      },
      {
        "key": "challenge",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:share",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 251,
          "endLine": 251
        },
        "expression": "state.config.challenge",
        "guards": []
      },
      {
        "key": "challenge",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:propose",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 268,
          "endLine": 268
        },
        "expression": "state.config.challenge",
        "guards": [
          "action.challenge!==undefined"
        ]
      },
      {
        "key": "challenge",
        "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:makeCandidate",
        "source": {
          "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
          "line": 33,
          "endLine": 33
        },
        "expression": "config.challenge",
        "guards": []
      },
      {
        "key": "challenge",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 60,
          "endLine": 60
        },
        "expression": "state.config.challenge",
        "guards": [
          "state.config.challenge"
        ]
      },
      {
        "key": "challenge",
        "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:wishPick",
        "source": {
          "file": "apps/comic/src/game/appraisal/wishlist.ts",
          "line": 19,
          "endLine": 19
        },
        "expression": "state.config.challenge",
        "guards": [
          "state.config.trustAbilities"
        ]
      }
    ]
  },
  {
    "key": "cleanse",
    "default": true,
    "defaultPresent": true,
    "reads": [
      {
        "key": "cleanse",
        "owner": "code:apps/comic/src/game/appraisal/cleanse.ts:shopNpc",
        "source": {
          "file": "apps/comic/src/game/appraisal/cleanse.ts",
          "line": 11,
          "endLine": 11
        },
        "expression": "state.config.cleanse",
        "guards": [
          "state.config.cleanse && state.phase==='APPRAISAL' && p.selectedPortalId"
        ]
      },
      {
        "key": "cleanse",
        "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:pool",
        "source": {
          "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
          "line": 30,
          "endLine": 30
        },
        "expression": "state.config.cleanse",
        "guards": []
      },
      {
        "key": "cleanse",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 74,
          "endLine": 74
        },
        "expression": "config.cleanse",
        "guards": []
      },
      {
        "key": "cleanse",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 74,
          "endLine": 74
        },
        "expression": "config.cleanse",
        "guards": []
      },
      {
        "key": "cleanse",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:initialiseAppraisalRun",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 119,
          "endLine": 119
        },
        "expression": "config.cleanse",
        "guards": [
          "config.cleanse"
        ]
      },
      {
        "key": "cleanse",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:spawnStockItem",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 130,
          "endLine": 130
        },
        "expression": "config.cleanse",
        "guards": []
      },
      {
        "key": "cleanse",
        "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:makeCandidate",
        "source": {
          "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
          "line": 33,
          "endLine": 33
        },
        "expression": "config.cleanse",
        "guards": []
      },
      {
        "key": "cleanse",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 60,
          "endLine": 60
        },
        "expression": "state.config.cleanse",
        "guards": [
          "state.config.cleanse"
        ]
      },
      {
        "key": "cleanse",
        "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:wishPick",
        "source": {
          "file": "apps/comic/src/game/appraisal/wishlist.ts",
          "line": 19,
          "endLine": 19
        },
        "expression": "state.config.cleanse",
        "guards": [
          "state.config.trustAbilities"
        ]
      }
    ]
  },
  {
    "key": "collectorDeadline",
    "default": 15,
    "defaultPresent": true,
    "reads": [
      {
        "key": "collectorDeadline",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 62,
          "endLine": 62
        },
        "expression": "config.collectorDeadline",
        "guards": []
      },
      {
        "key": "collectorDeadline",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 62,
          "endLine": 62
        },
        "expression": "config.collectorDeadline",
        "guards": []
      },
      {
        "key": "collectorDeadline",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 62,
          "endLine": 62
        },
        "expression": "config.collectorDeadline",
        "guards": []
      },
      {
        "key": "collectorDeadline",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 62,
          "endLine": 62
        },
        "expression": "config.collectorDeadline",
        "guards": []
      },
      {
        "key": "collectorDeadline",
        "owner": "code:apps/comic/src/game/appraisal/survival.ts:collectorDue",
        "source": {
          "file": "apps/comic/src/game/appraisal/survival.ts",
          "line": 15,
          "endLine": 15
        },
        "expression": "state.config.collectorDeadline",
        "guards": []
      },
      {
        "key": "collectorDeadline",
        "owner": "code:apps/comic/src/game/appraisal/survival.ts:collectorDue",
        "source": {
          "file": "apps/comic/src/game/appraisal/survival.ts",
          "line": 15,
          "endLine": 15
        },
        "expression": "state.config.collectorDeadline",
        "guards": []
      },
      {
        "key": "collectorDeadline",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 66,
          "endLine": 66
        },
        "expression": "state.config.collectorDeadline",
        "guards": [
          "state.config.survival",
          "state.config.collectorDeadline!==undefined"
        ]
      },
      {
        "key": "collectorDeadline",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 66,
          "endLine": 66
        },
        "expression": "state.config.collectorDeadline",
        "guards": [
          "state.config.survival",
          "state.config.collectorDeadline!==undefined"
        ]
      },
      {
        "key": "collectorDeadline",
        "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.afterChange",
        "source": {
          "file": "apps/comic/src/server/appraisal-rooms.ts",
          "line": 162,
          "endLine": 162
        },
        "expression": "current.config.collectorDeadline",
        "guards": []
      },
      {
        "key": "collectorDeadline",
        "owner": "code:apps/comic/src/simulation/appraisal.ts:simulateAppraisalRun",
        "source": {
          "file": "apps/comic/src/simulation/appraisal.ts",
          "line": 250,
          "endLine": 250
        },
        "expression": "state.config.collectorDeadline",
        "guards": []
      }
    ]
  },
  {
    "key": "collectorWishlistRules",
    "default": null,
    "defaultPresent": false,
    "reads": [
      {
        "key": "collectorWishlistRules",
        "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:collectorCanWithdraw",
        "source": {
          "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
          "line": 35,
          "endLine": 35
        },
        "expression": "state.config.collectorWishlistRules",
        "guards": []
      },
      {
        "key": "collectorWishlistRules",
        "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:closeCollectorWishlists",
        "source": {
          "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
          "line": 38,
          "endLine": 38
        },
        "expression": "state.config.collectorWishlistRules",
        "guards": []
      },
      {
        "key": "collectorWishlistRules",
        "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:reconcileCollectorWishlist",
        "source": {
          "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
          "line": 48,
          "endLine": 48
        },
        "expression": "state.config.collectorWishlistRules",
        "guards": []
      },
      {
        "key": "collectorWishlistRules",
        "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:collectorWishlistView",
        "source": {
          "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
          "line": 57,
          "endLine": 57
        },
        "expression": "state.config.collectorWishlistRules",
        "guards": []
      },
      {
        "key": "collectorWishlistRules",
        "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:handleCollectorWishlist",
        "source": {
          "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
          "line": 63,
          "endLine": 63
        },
        "expression": "state.config.collectorWishlistRules",
        "guards": []
      },
      {
        "key": "collectorWishlistRules",
        "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:assertCollectorWishlistInvariants",
        "source": {
          "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
          "line": 74,
          "endLine": 74
        },
        "expression": "state.config.collectorWishlistRules",
        "guards": []
      },
      {
        "key": "collectorWishlistRules",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 52,
          "endLine": 52
        },
        "expression": "config.collectorWishlistRules",
        "guards": []
      },
      {
        "key": "collectorWishlistRules",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 52,
          "endLine": 52
        },
        "expression": "config.collectorWishlistRules",
        "guards": []
      },
      {
        "key": "collectorWishlistRules",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:publicOfferItems",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 380,
          "endLine": 380
        },
        "expression": "state.config.collectorWishlistRules",
        "guards": []
      },
      {
        "key": "collectorWishlistRules",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 67,
          "endLine": 67
        },
        "expression": "state.config.collectorWishlistRules",
        "guards": [
          "p.personalVault",
          "state.config.collectorWishlistRules===1"
        ]
      }
    ]
  },
  {
    "key": "commerce",
    "default": true,
    "defaultPresent": true,
    "reads": [
      {
        "key": "commerce",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 67,
          "endLine": 67
        },
        "expression": "config.commerce",
        "guards": []
      },
      {
        "key": "commerce",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 67,
          "endLine": 67
        },
        "expression": "config.commerce",
        "guards": []
      },
      {
        "key": "commerce",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:initialiseAppraisalRun",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 119,
          "endLine": 119
        },
        "expression": "config.commerce",
        "guards": [
          "config.commerce"
        ]
      },
      {
        "key": "commerce",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:makeMarket",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 183,
          "endLine": 183
        },
        "expression": "state.config.commerce",
        "guards": [
          "state.config.commerce"
        ]
      },
      {
        "key": "commerce",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 506,
          "endLine": 506
        },
        "expression": "state.config.commerce",
        "guards": []
      },
      {
        "key": "commerce",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:stockBonus",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 63,
          "endLine": 63
        },
        "expression": "state.config.commerce",
        "guards": [
          "state.config.commerce"
        ]
      },
      {
        "key": "commerce",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:stockBonus",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 64,
          "endLine": 64
        },
        "expression": "state.config.commerce",
        "guards": []
      },
      {
        "key": "commerce",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:appraise",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 283,
          "endLine": 283
        },
        "expression": "state.config.commerce",
        "guards": []
      },
      {
        "key": "commerce",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:appraise",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 297,
          "endLine": 297
        },
        "expression": "state.config.commerce",
        "guards": []
      },
      {
        "key": "commerce",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:completeAppraisedSale",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 316,
          "endLine": 316
        },
        "expression": "state.config.commerce",
        "guards": []
      },
      {
        "key": "commerce",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:inheritKnowledge",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 343,
          "endLine": 343
        },
        "expression": "state.config.commerce",
        "guards": []
      },
      {
        "key": "commerce",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:noteRepeatBuy",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 355,
          "endLine": 355
        },
        "expression": "state.config.commerce",
        "guards": []
      },
      {
        "key": "commerce",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 67,
          "endLine": 67
        },
        "expression": "state.config.commerce",
        "guards": [
          "state.config.commerce"
        ]
      },
      {
        "key": "commerce",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 67,
          "endLine": 67
        },
        "expression": "state.config.commerce",
        "guards": [
          "state.config.survival && state.config.commerce"
        ]
      }
    ]
  },
  {
    "key": "common",
    "default": null,
    "defaultPresent": false,
    "reads": [
      {
        "key": "common",
        "owner": "code:apps/comic/src/shared/rarity-power.ts:validateRarityEconomy",
        "source": {
          "file": "apps/comic/src/shared/rarity-power.ts",
          "line": 19,
          "endLine": 19
        },
        "expression": "config.tiers.common",
        "guards": []
      },
      {
        "key": "common",
        "owner": "code:apps/comic/src/shared/rarity-power.ts:validateRarityEconomy",
        "source": {
          "file": "apps/comic/src/shared/rarity-power.ts",
          "line": 19,
          "endLine": 19
        },
        "expression": "config.tiers.common",
        "guards": []
      }
    ]
  },
  {
    "key": "core2",
    "default": null,
    "defaultPresent": false,
    "reads": [
      {
        "key": "core2",
        "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:consign",
        "source": {
          "file": "apps/comic/src/game/appraisal/brokerage.ts",
          "line": 145,
          "endLine": 145
        },
        "expression": "state.config.core2",
        "guards": []
      },
      {
        "key": "core2",
        "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:startTheft",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-actions.ts",
          "line": 14,
          "endLine": 14
        },
        "expression": "state.config.core2",
        "guards": []
      },
      {
        "key": "core2",
        "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:skillOpen",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-actions.ts",
          "line": 102,
          "endLine": 102
        },
        "expression": "state.config.core2",
        "guards": []
      },
      {
        "key": "core2",
        "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:core2EventEligible",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-events.ts",
          "line": 47,
          "endLine": 47
        },
        "expression": "state.config.core2",
        "guards": []
      },
      {
        "key": "core2",
        "owner": "code:apps/comic/src/game/appraisal/core2-rules.ts:applyDread",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-rules.ts",
          "line": 17,
          "endLine": 17
        },
        "expression": "state.config.core2",
        "guards": []
      },
      {
        "key": "core2",
        "owner": "code:apps/comic/src/game/appraisal/core2-rules.ts:applyOmenPressure",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-rules.ts",
          "line": 41,
          "endLine": 41
        },
        "expression": "state.config.core2",
        "guards": []
      },
      {
        "key": "core2",
        "owner": "code:apps/comic/src/game/appraisal/core2.ts:core2On",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2.ts",
          "line": 10,
          "endLine": 10
        },
        "expression": "config.core2",
        "guards": []
      },
      {
        "key": "core2",
        "owner": "code:apps/comic/src/game/appraisal/core2.ts:anchorOf",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2.ts",
          "line": 46,
          "endLine": 46
        },
        "expression": "config.core2",
        "guards": []
      },
      {
        "key": "core2",
        "owner": "code:apps/comic/src/game/appraisal/core2.ts:linkedStatuses",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2.ts",
          "line": 79,
          "endLine": 79
        },
        "expression": "config.core2",
        "guards": [
          "config.core2 && config.statusLinks===1"
        ]
      },
      {
        "key": "core2",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 66,
          "endLine": 66
        },
        "expression": "config.core2",
        "guards": []
      },
      {
        "key": "core2",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 66,
          "endLine": 66
        },
        "expression": "config.core2",
        "guards": []
      },
      {
        "key": "core2",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:rerollPortal",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 158,
          "endLine": 158
        },
        "expression": "state.config.core2",
        "guards": []
      },
      {
        "key": "core2",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:makeMarket",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 177,
          "endLine": 177
        },
        "expression": "state.config.core2",
        "guards": []
      },
      {
        "key": "core2",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:settleEncounter",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 213,
          "endLine": 213
        },
        "expression": "state.config.core2",
        "guards": []
      },
      {
        "key": "core2",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:settleEncounter",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 219,
          "endLine": 219
        },
        "expression": "state.config.core2",
        "guards": []
      },
      {
        "key": "core2",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:settleEncounter",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 220,
          "endLine": 220
        },
        "expression": "state.config.core2",
        "guards": [
          "state.config.survival && p.life!>0",
          "state.config.core2"
        ]
      },
      {
        "key": "core2",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 420,
          "endLine": 420
        },
        "expression": "state.config.core2",
        "guards": []
      },
      {
        "key": "core2",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:eventEligible",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 99,
          "endLine": 99
        },
        "expression": "state.config.core2",
        "guards": []
      },
      {
        "key": "core2",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:drawEvent",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 255,
          "endLine": 255
        },
        "expression": "state.config.core2",
        "guards": [
          "state.config.core2 && !reaction"
        ]
      },
      {
        "key": "core2",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:drawBacklashEvent",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 443,
          "endLine": 443
        },
        "expression": "state.config.core2",
        "guards": []
      },
      {
        "key": "core2",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:drawTheftEvent",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 448,
          "endLine": 448
        },
        "expression": "state.config.core2",
        "guards": []
      },
      {
        "key": "core2",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:recoveryOffer",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 158,
          "endLine": 158
        },
        "expression": "state.config.core2",
        "guards": []
      },
      {
        "key": "core2",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:appraise",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 285,
          "endLine": 285
        },
        "expression": "state.config.core2",
        "guards": [
          "state.config.core2"
        ]
      },
      {
        "key": "core2",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:completeAppraisedSale",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 325,
          "endLine": 325
        },
        "expression": "state.config.core2",
        "guards": [
          "state.config.core2"
        ]
      },
      {
        "key": "core2",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:noteScrap",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 366,
          "endLine": 366
        },
        "expression": "state.config.core2",
        "guards": []
      },
      {
        "key": "core2",
        "owner": "code:apps/comic/src/game/appraisal/omens.ts:omenOf",
        "source": {
          "file": "apps/comic/src/game/appraisal/omens.ts",
          "line": 12,
          "endLine": 12
        },
        "expression": "config.core2",
        "guards": []
      },
      {
        "key": "core2",
        "owner": "code:apps/comic/src/game/appraisal/passives.ts:inspectionLimit",
        "source": {
          "file": "apps/comic/src/game/appraisal/passives.ts",
          "line": 62,
          "endLine": 62
        },
        "expression": "state.config.core2",
        "guards": [
          "state.config.core2 && p.statuses.some(s=>s.id==='D24' && s.charges>0)"
        ]
      },
      {
        "key": "core2",
        "owner": "code:apps/comic/src/game/appraisal/theft.ts:startTheftDuel",
        "source": {
          "file": "apps/comic/src/game/appraisal/theft.ts",
          "line": 132,
          "endLine": 132
        },
        "expression": "state.config.core2",
        "guards": []
      },
      {
        "key": "core2",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 60,
          "endLine": 60
        },
        "expression": "state.config.core2",
        "guards": [
          "state.config.core2"
        ]
      },
      {
        "key": "core2",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 67,
          "endLine": 67
        },
        "expression": "state.config.core2",
        "guards": [
          "state.config.core2 && p.life!==0"
        ]
      }
    ]
  },
  {
    "key": "curseSight",
    "default": true,
    "defaultPresent": true,
    "reads": [
      {
        "key": "curseSight",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 78,
          "endLine": 78
        },
        "expression": "config.curseSight",
        "guards": []
      },
      {
        "key": "curseSight",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 78,
          "endLine": 78
        },
        "expression": "config.curseSight",
        "guards": []
      },
      {
        "key": "curseSight",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:effectsUnknown",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 29,
          "endLine": 29
        },
        "expression": "state.config.curseSight",
        "guards": [
          "state.config.curseSight"
        ]
      },
      {
        "key": "curseSight",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 343,
          "endLine": 343
        },
        "expression": "state.config.curseSight",
        "guards": [
          "state.config.curseSight"
        ]
      },
      {
        "key": "curseSight",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:inspect",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 232,
          "endLine": 232
        },
        "expression": "state.config.curseSight",
        "guards": [
          "property === 'price'",
          "property === 'authenticity'",
          "state.config.curseSight"
        ]
      },
      {
        "key": "curseSight",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:inspect",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 254,
          "endLine": 254
        },
        "expression": "state.config.curseSight",
        "guards": [
          "NOT property === 'price'",
          "NOT property === 'authenticity'"
        ]
      },
      {
        "key": "curseSight",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:inspect",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 260,
          "endLine": 260
        },
        "expression": "state.config.curseSight",
        "guards": []
      },
      {
        "key": "curseSight",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 489,
          "endLine": 489
        },
        "expression": "state.config.curseSight",
        "guards": []
      },
      {
        "key": "curseSight",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 60,
          "endLine": 60
        },
        "expression": "state.config.curseSight",
        "guards": [
          "state.config.curseSight"
        ]
      }
    ]
  },
  {
    "key": "effect",
    "default": null,
    "defaultPresent": false,
    "reads": [
      {
        "key": "effect",
        "owner": "code:apps/comic/src/shared/rarity-power.ts:validateRarityEconomy",
        "source": {
          "file": "apps/comic/src/shared/rarity-power.ts",
          "line": 19,
          "endLine": 19
        },
        "expression": "config.tiers.common.effect",
        "guards": []
      }
    ]
  },
  {
    "key": "encounterLifeCost",
    "default": null,
    "defaultPresent": false,
    "reads": [
      {
        "key": "encounterLifeCost",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:settleEncounter",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 220,
          "endLine": 220
        },
        "expression": "state.config.survival.encounterLifeCost",
        "guards": [
          "state.config.survival && p.life!>0",
          "state.config.core2"
        ]
      }
    ]
  },
  {
    "key": "encounters",
    "default": 3,
    "defaultPresent": true,
    "reads": [
      {
        "key": "encounters",
        "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:debtWithoutNext",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-events.ts",
          "line": 19,
          "endLine": 19
        },
        "expression": "state.config.encounters",
        "guards": []
      },
      {
        "key": "encounters",
        "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:core2EventEligible",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-events.ts",
          "line": 61,
          "endLine": 61
        },
        "expression": "state.config.encounters",
        "guards": [
          "id==='E127'"
        ]
      },
      {
        "key": "encounters",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 84,
          "endLine": 84
        },
        "expression": "config.encounters",
        "guards": []
      },
      {
        "key": "encounters",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 84,
          "endLine": 84
        },
        "expression": "config.encounters",
        "guards": []
      },
      {
        "key": "encounters",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:initialiseAppraisalRun",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 115,
          "endLine": 115
        },
        "expression": "config.encounters",
        "guards": [
          "config.survival"
        ]
      },
      {
        "key": "encounters",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 452,
          "endLine": 452
        },
        "expression": "state.config.encounters",
        "guards": []
      },
      {
        "key": "encounters",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:eventEligible",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 112,
          "endLine": 112
        },
        "expression": "state.config.encounters",
        "guards": []
      },
      {
        "key": "encounters",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:grant",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 96,
          "endLine": 96
        },
        "expression": "state.config.encounters",
        "guards": []
      },
      {
        "key": "encounters",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:purchase",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 392,
          "endLine": 392
        },
        "expression": "state.config.encounters",
        "guards": []
      },
      {
        "key": "encounters",
        "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:statusPool",
        "source": {
          "file": "apps/comic/src/game/appraisal/npc-events.ts",
          "line": 67,
          "endLine": 67
        },
        "expression": "state.config.encounters",
        "guards": []
      },
      {
        "key": "encounters",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalItemView",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 48,
          "endLine": 48
        },
        "expression": "state.config.encounters",
        "guards": []
      },
      {
        "key": "encounters",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 64,
          "endLine": 64
        },
        "expression": "state.config.encounters",
        "guards": [
          "state.config.survival"
        ]
      }
    ]
  },
  {
    "key": "entryEnergyCost",
    "default": null,
    "defaultPresent": false,
    "reads": [
      {
        "key": "entryEnergyCost",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:initialiseAppraisalRun",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 122,
          "endLine": 122
        },
        "expression": "config.survival.entryEnergyCost",
        "guards": [
          "config.survival"
        ]
      },
      {
        "key": "entryEnergyCost",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 468,
          "endLine": 468
        },
        "expression": "state.config.survival.entryEnergyCost",
        "guards": [
          "state.config.survival"
        ]
      }
    ]
  },
  {
    "key": "eventChoiceRules",
    "default": 1,
    "defaultPresent": true,
    "reads": [
      {
        "key": "eventChoiceRules",
        "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:bondEligible",
        "source": {
          "file": "apps/comic/src/game/appraisal/brokerage.ts",
          "line": 55,
          "endLine": 55
        },
        "expression": "state.config.eventChoiceRules",
        "guards": []
      },
      {
        "key": "eventChoiceRules",
        "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:debtWithoutNext",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-events.ts",
          "line": 19,
          "endLine": 19
        },
        "expression": "state.config.eventChoiceRules",
        "guards": []
      },
      {
        "key": "eventChoiceRules",
        "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:core2EventEligible",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-events.ts",
          "line": 61,
          "endLine": 61
        },
        "expression": "state.config.eventChoiceRules",
        "guards": [
          "id==='E127'"
        ]
      },
      {
        "key": "eventChoiceRules",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 56,
          "endLine": 56
        },
        "expression": "config.eventChoiceRules",
        "guards": []
      },
      {
        "key": "eventChoiceRules",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 56,
          "endLine": 56
        },
        "expression": "config.eventChoiceRules",
        "guards": []
      },
      {
        "key": "eventChoiceRules",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:reworked",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 41,
          "endLine": 41
        },
        "expression": "state.config.eventChoiceRules",
        "guards": []
      },
      {
        "key": "eventChoiceRules",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 61,
          "endLine": 61
        },
        "expression": "state.config.eventChoiceRules",
        "guards": [
          "state.config.eventChoiceRules"
        ]
      },
      {
        "key": "eventChoiceRules",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 61,
          "endLine": 61
        },
        "expression": "state.config.eventChoiceRules",
        "guards": [
          "state.config.eventChoiceRules"
        ]
      }
    ]
  },
  {
    "key": "expansion",
    "default": true,
    "defaultPresent": true,
    "reads": [
      {
        "key": "expansion",
        "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:pool",
        "source": {
          "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
          "line": 30,
          "endLine": 30
        },
        "expression": "state.config.expansion",
        "guards": []
      },
      {
        "key": "expansion",
        "owner": "code:apps/comic/src/game/appraisal/content.ts:expansionActive",
        "source": {
          "file": "apps/comic/src/game/appraisal/content.ts",
          "line": 749,
          "endLine": 749
        },
        "expression": "config.expansion",
        "guards": []
      },
      {
        "key": "expansion",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 70,
          "endLine": 70
        },
        "expression": "config.expansion",
        "guards": []
      },
      {
        "key": "expansion",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 70,
          "endLine": 70
        },
        "expression": "config.expansion",
        "guards": []
      },
      {
        "key": "expansion",
        "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:statusPool",
        "source": {
          "file": "apps/comic/src/game/appraisal/npc-events.ts",
          "line": 65,
          "endLine": 65
        },
        "expression": "state.config.expansion",
        "guards": []
      },
      {
        "key": "expansion",
        "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:wishPick",
        "source": {
          "file": "apps/comic/src/game/appraisal/wishlist.ts",
          "line": 19,
          "endLine": 19
        },
        "expression": "state.config.expansion",
        "guards": [
          "state.config.trustAbilities"
        ]
      }
    ]
  },
  {
    "key": "fakeEffect",
    "default": true,
    "defaultPresent": true,
    "reads": [
      {
        "key": "fakeEffect",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 75,
          "endLine": 75
        },
        "expression": "config.fakeEffect",
        "guards": []
      },
      {
        "key": "fakeEffect",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 75,
          "endLine": 75
        },
        "expression": "config.fakeEffect",
        "guards": []
      },
      {
        "key": "fakeEffect",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 441,
          "endLine": 441
        },
        "expression": "state.config.fakeEffect",
        "guards": []
      },
      {
        "key": "fakeEffect",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 60,
          "endLine": 60
        },
        "expression": "state.config.fakeEffect",
        "guards": [
          "state.config.fakeEffect"
        ]
      }
    ]
  },
  {
    "key": "filter",
    "default": null,
    "defaultPresent": false,
    "reads": [
      {
        "key": "filter",
        "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:core2EventChoices",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-events.ts",
          "line": 33,
          "endLine": 33
        },
        "expression": "core2Choices(id,state.config).filter",
        "guards": []
      },
      {
        "key": "filter",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:rerollPortal",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 162,
          "endLine": 162
        },
        "expression": "activeNpcs(state.config).filter",
        "guards": []
      },
      {
        "key": "filter",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:rerollPortal",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 163,
          "endLine": 163
        },
        "expression": "activeNpcs(state.config).filter",
        "guards": [
          "unseen.length"
        ]
      },
      {
        "key": "filter",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:boonPool",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 56,
          "endLine": 56
        },
        "expression": "[...STATUS_IDS,...linkedStatuses(state.config,'B')].filter",
        "guards": []
      },
      {
        "key": "filter",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:drawEvent",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 255,
          "endLine": 255
        },
        "expression": "[...EVENT_IDS,...(state.config.trustAbilities && !reaction?ABILITY_EVENT_IDS:[]),...(state.config.core2 && !reaction?CORE2_DRAW_IDS:[])].filter",
        "guards": []
      },
      {
        "key": "filter",
        "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:statusPool",
        "source": {
          "file": "apps/comic/src/game/appraisal/npc-events.ts",
          "line": 64,
          "endLine": 64
        },
        "expression": "[...STATUS_IDS,...linkedStatuses(state.config,prefix)].filter",
        "guards": []
      }
    ]
  },
  {
    "key": "find",
    "default": null,
    "defaultPresent": false,
    "reads": [
      {
        "key": "find",
        "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:resolveCore2Event",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-events.ts",
          "line": 81,
          "endLine": 81
        },
        "expression": "core2Choices(offer.id,state.config).find",
        "guards": [
          "choice===FALLBACK_BRAND.id"
        ]
      }
    ]
  },
  {
    "key": "freeBuy",
    "default": true,
    "defaultPresent": true,
    "reads": [
      {
        "key": "freeBuy",
        "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:cost",
        "source": {
          "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
          "line": 36,
          "endLine": 36
        },
        "expression": "state.config.freeBuy",
        "guards": [
          "state.config.freeBuy"
        ]
      },
      {
        "key": "freeBuy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 77,
          "endLine": 77
        },
        "expression": "config.freeBuy",
        "guards": []
      },
      {
        "key": "freeBuy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 77,
          "endLine": 77
        },
        "expression": "config.freeBuy",
        "guards": []
      },
      {
        "key": "freeBuy",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:purchase",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 401,
          "endLine": 401
        },
        "expression": "state.config.freeBuy",
        "guards": [
          "state.config.freeBuy || friendAppraised(state,buyer,shop,items)"
        ]
      },
      {
        "key": "freeBuy",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 60,
          "endLine": 60
        },
        "expression": "state.config.freeBuy",
        "guards": [
          "state.config.freeBuy"
        ]
      }
    ]
  },
  {
    "key": "freeMerchantAction",
    "default": true,
    "defaultPresent": true,
    "reads": [
      {
        "key": "freeMerchantAction",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 76,
          "endLine": 76
        },
        "expression": "config.freeMerchantAction",
        "guards": []
      },
      {
        "key": "freeMerchantAction",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 76,
          "endLine": 76
        },
        "expression": "config.freeMerchantAction",
        "guards": []
      },
      {
        "key": "freeMerchantAction",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:pauseIfNeeded",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 196,
          "endLine": 196
        },
        "expression": "state.config.freeMerchantAction",
        "guards": []
      },
      {
        "key": "freeMerchantAction",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:merchantActionFree",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 223,
          "endLine": 223
        },
        "expression": "state.config.freeMerchantAction",
        "guards": []
      },
      {
        "key": "freeMerchantAction",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalItemView",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 39,
          "endLine": 39
        },
        "expression": "state.config.freeMerchantAction",
        "guards": [
          "state.config.freeMerchantAction"
        ]
      }
    ]
  },
  {
    "key": "itemEffects",
    "default": true,
    "defaultPresent": true,
    "reads": [
      {
        "key": "itemEffects",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 64,
          "endLine": 64
        },
        "expression": "config.itemEffects",
        "guards": []
      },
      {
        "key": "itemEffects",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 64,
          "endLine": 64
        },
        "expression": "config.itemEffects",
        "guards": []
      },
      {
        "key": "itemEffects",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 435,
          "endLine": 435
        },
        "expression": "state.config.itemEffects",
        "guards": [
          "state.config.itemEffects && spec.consumable"
        ]
      },
      {
        "key": "itemEffects",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 473,
          "endLine": 473
        },
        "expression": "state.config.itemEffects",
        "guards": [
          "works",
          "state.config.itemEffects"
        ]
      },
      {
        "key": "itemEffects",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activationNote",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 499,
          "endLine": 499
        },
        "expression": "state.config.itemEffects",
        "guards": [
          "state.config.itemEffects"
        ]
      },
      {
        "key": "itemEffects",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activationNote",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 507,
          "endLine": 507
        },
        "expression": "state.config.itemEffects",
        "guards": [
          "item.cursed",
          "worked",
          "state.config.itemEffects && spec.consumable"
        ]
      },
      {
        "key": "itemEffects",
        "owner": "code:apps/comic/src/game/appraisal/passives.ts:passiveBonuses",
        "source": {
          "file": "apps/comic/src/game/appraisal/passives.ts",
          "line": 56,
          "endLine": 56
        },
        "expression": "state.config.itemEffects",
        "guards": []
      },
      {
        "key": "itemEffects",
        "owner": "code:apps/comic/src/game/appraisal/passives.ts:passiveBonuses",
        "source": {
          "file": "apps/comic/src/game/appraisal/passives.ts",
          "line": 57,
          "endLine": 57
        },
        "expression": "state.config.itemEffects",
        "guards": [
          "state.config.itemEffects"
        ]
      },
      {
        "key": "itemEffects",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalItemView",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 39,
          "endLine": 39
        },
        "expression": "state.config.itemEffects",
        "guards": [
          "state.config.itemEffects"
        ]
      },
      {
        "key": "itemEffects",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalItemView",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 46,
          "endLine": 46
        },
        "expression": "state.config.itemEffects",
        "guards": [
          "state.config.itemEffects && ITEM_USE_EFFECTS[item.kind]"
        ]
      },
      {
        "key": "itemEffects",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 59,
          "endLine": 59
        },
        "expression": "state.config.itemEffects",
        "guards": [
          "state.config.itemEffects"
        ]
      }
    ]
  },
  {
    "key": "loanEndSettlement",
    "default": true,
    "defaultPresent": true,
    "reads": [
      {
        "key": "loanEndSettlement",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 51,
          "endLine": 51
        },
        "expression": "config.loanEndSettlement",
        "guards": []
      },
      {
        "key": "loanEndSettlement",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 61,
          "endLine": 61
        },
        "expression": "config.loanEndSettlement",
        "guards": []
      },
      {
        "key": "loanEndSettlement",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 61,
          "endLine": 61
        },
        "expression": "config.loanEndSettlement",
        "guards": []
      },
      {
        "key": "loanEndSettlement",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 452,
          "endLine": 452
        },
        "expression": "state.config.loanEndSettlement",
        "guards": [
          "!state.config.survival && state.encounter===state.config.encounters"
        ]
      },
      {
        "key": "loanEndSettlement",
        "owner": "code:apps/comic/src/game/appraisal/survival.ts:collectRun",
        "source": {
          "file": "apps/comic/src/game/appraisal/survival.ts",
          "line": 21,
          "endLine": 21
        },
        "expression": "state.config.loanEndSettlement",
        "guards": [
          "state.config.secureEconomy"
        ]
      }
    ]
  },
  {
    "key": "map",
    "default": null,
    "defaultPresent": false,
    "reads": [
      {
        "key": "map",
        "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:core2EventChoices",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-events.ts",
          "line": 33,
          "endLine": 40
        },
        "expression": "core2Choices(id,state.config).filter(c=>{\n    if(c.id==='decline')return true;\n    if(state.config.systemLinks===1 && state.config.statusLinks===1 && id==='E128'){\n      if(c.id==='offer' && (status(p,'B06') || status(p,'B19')))return false;\n      if(c.id==='ward' && status(p,'B21'))return false;\n    }\n    return affordable(state,p,c) && !debtWithoutNext(state,c);\n  }).map",
        "guards": []
      },
      {
        "key": "map",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:makeMarket",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 183,
          "endLine": 183
        },
        "expression": "Object.values(state.config.rarityEconomy.tiers).map",
        "guards": [
          "state.config.rarityEconomy"
        ]
      },
      {
        "key": "map",
        "owner": "code:apps/comic/src/shared/item-rarity.ts:rollAppearance",
        "source": {
          "file": "apps/comic/src/shared/item-rarity.ts",
          "line": 57,
          "endLine": 57
        },
        "expression": "config.themes[rarity].map",
        "guards": []
      }
    ]
  },
  {
    "key": "marketMaxOrders",
    "default": 3,
    "defaultPresent": true,
    "reads": [
      {
        "key": "marketMaxOrders",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 85,
          "endLine": 85
        },
        "expression": "config.marketMaxOrders",
        "guards": []
      },
      {
        "key": "marketMaxOrders",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:makeMarket",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 179,
          "endLine": 179
        },
        "expression": "state.config.marketMaxOrders",
        "guards": []
      }
    ]
  },
  {
    "key": "marketProbability",
    "default": 1,
    "defaultPresent": true,
    "reads": [
      {
        "key": "marketProbability",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 85,
          "endLine": 85
        },
        "expression": "config.marketProbability",
        "guards": []
      },
      {
        "key": "marketProbability",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 85,
          "endLine": 85
        },
        "expression": "config.marketProbability",
        "guards": []
      },
      {
        "key": "marketProbability",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 85,
          "endLine": 85
        },
        "expression": "config.marketProbability",
        "guards": []
      },
      {
        "key": "marketProbability",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:makeMarket",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 177,
          "endLine": 177
        },
        "expression": "state.config.marketProbability",
        "guards": []
      }
    ]
  },
  {
    "key": "marketQuota",
    "default": 1,
    "defaultPresent": true,
    "reads": [
      {
        "key": "marketQuota",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 85,
          "endLine": 85
        },
        "expression": "config.marketQuota",
        "guards": []
      },
      {
        "key": "marketQuota",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:makeMarket",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 183,
          "endLine": 183
        },
        "expression": "state.config.marketQuota",
        "guards": []
      },
      {
        "key": "marketQuota",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:makeMarket",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 184,
          "endLine": 184
        },
        "expression": "state.config.marketQuota",
        "guards": []
      }
    ]
  },
  {
    "key": "maxEnergy",
    "default": 10,
    "defaultPresent": true,
    "reads": [
      {
        "key": "maxEnergy",
        "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:core2EventEligible",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-events.ts",
          "line": 57,
          "endLine": 57
        },
        "expression": "state.config.maxEnergy",
        "guards": [
          "id==='E126'",
          "state.config.survival",
          "state.config.systemLinks===1"
        ]
      },
      {
        "key": "maxEnergy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 84,
          "endLine": 84
        },
        "expression": "config.maxEnergy",
        "guards": []
      },
      {
        "key": "maxEnergy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 84,
          "endLine": 84
        },
        "expression": "config.maxEnergy",
        "guards": []
      },
      {
        "key": "maxEnergy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 90,
          "endLine": 90
        },
        "expression": "config.maxEnergy",
        "guards": [
          "config.survival"
        ]
      },
      {
        "key": "maxEnergy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:initialiseAppraisalRun",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 119,
          "endLine": 119
        },
        "expression": "config.maxEnergy",
        "guards": []
      },
      {
        "key": "maxEnergy",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:maxEnergyOf",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 44,
          "endLine": 44
        },
        "expression": "state.config.maxEnergy",
        "guards": []
      },
      {
        "key": "maxEnergy",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 66,
          "endLine": 66
        },
        "expression": "state.config.maxEnergy",
        "guards": [
          "state.config.survival"
        ]
      }
    ]
  },
  {
    "key": "maxLife",
    "default": null,
    "defaultPresent": false,
    "reads": [
      {
        "key": "maxLife",
        "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:affordable",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-events.ts",
          "line": 28,
          "endLine": 28
        },
        "expression": "state.config.survival.maxLife",
        "guards": [
          "state.config.systemLinks===1"
        ]
      },
      {
        "key": "maxLife",
        "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:core2EventEligible",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-events.ts",
          "line": 57,
          "endLine": 57
        },
        "expression": "state.config.survival.maxLife",
        "guards": [
          "id==='E126'",
          "state.config.survival",
          "state.config.systemLinks===1"
        ]
      },
      {
        "key": "maxLife",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:initialiseAppraisalRun",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 119,
          "endLine": 119
        },
        "expression": "config.survival.maxLife",
        "guards": [
          "config.survival"
        ]
      },
      {
        "key": "maxLife",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:maxLifeOf",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 47,
          "endLine": 47
        },
        "expression": "state.config.survival.maxLife",
        "guards": [
          "state.config.survival"
        ]
      }
    ]
  },
  {
    "key": "multiCoinRewards",
    "default": true,
    "defaultPresent": true,
    "reads": [
      {
        "key": "multiCoinRewards",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 79,
          "endLine": 79
        },
        "expression": "config.multiCoinRewards",
        "guards": []
      },
      {
        "key": "multiCoinRewards",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 79,
          "endLine": 79
        },
        "expression": "config.multiCoinRewards",
        "guards": []
      },
      {
        "key": "multiCoinRewards",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 495,
          "endLine": 495
        },
        "expression": "state.config.multiCoinRewards",
        "guards": []
      },
      {
        "key": "multiCoinRewards",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 511,
          "endLine": 511
        },
        "expression": "state.config.multiCoinRewards",
        "guards": [
          "r",
          "state.config.multiCoinRewards"
        ]
      },
      {
        "key": "multiCoinRewards",
        "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:openRoundRewards",
        "source": {
          "file": "apps/comic/src/game/appraisal/round-rewards.ts",
          "line": 18,
          "endLine": 18
        },
        "expression": "state.config.multiCoinRewards",
        "guards": []
      },
      {
        "key": "multiCoinRewards",
        "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:raiseRoundReward",
        "source": {
          "file": "apps/comic/src/game/appraisal/round-rewards.ts",
          "line": 23,
          "endLine": 23
        },
        "expression": "state.config.multiCoinRewards",
        "guards": []
      },
      {
        "key": "multiCoinRewards",
        "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:flipRoundReward",
        "source": {
          "file": "apps/comic/src/game/appraisal/round-rewards.ts",
          "line": 36,
          "endLine": 36
        },
        "expression": "state.config.multiCoinRewards",
        "guards": []
      }
    ]
  },
  {
    "key": "native56Effects",
    "default": null,
    "defaultPresent": false,
    "reads": [
      {
        "key": "native56Effects",
        "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:consign",
        "source": {
          "file": "apps/comic/src/game/appraisal/brokerage.ts",
          "line": 143,
          "endLine": 143
        },
        "expression": "state.config.native56Effects",
        "guards": []
      },
      {
        "key": "native56Effects",
        "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:vaultSale",
        "source": {
          "file": "apps/comic/src/game/appraisal/brokerage.ts",
          "line": 193,
          "endLine": 193
        },
        "expression": "state.config.native56Effects",
        "guards": []
      },
      {
        "key": "native56Effects",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 46,
          "endLine": 46
        },
        "expression": "config.native56Effects",
        "guards": []
      },
      {
        "key": "native56Effects",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 46,
          "endLine": 46
        },
        "expression": "config.native56Effects",
        "guards": []
      },
      {
        "key": "native56Effects",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 46,
          "endLine": 46
        },
        "expression": "config.native56Effects",
        "guards": []
      },
      {
        "key": "native56Effects",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 46,
          "endLine": 46
        },
        "expression": "config.native56Effects",
        "guards": []
      },
      {
        "key": "native56Effects",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 46,
          "endLine": 46
        },
        "expression": "config.native56Effects",
        "guards": []
      },
      {
        "key": "native56Effects",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 46,
          "endLine": 46
        },
        "expression": "config.native56Effects",
        "guards": []
      },
      {
        "key": "native56Effects",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:propose",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 274,
          "endLine": 274
        },
        "expression": "state.config.native56Effects",
        "guards": [
          "(state.config.native56Effects??0)>=4"
        ]
      },
      {
        "key": "native56Effects",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 448,
          "endLine": 448
        },
        "expression": "previous.config.native56Effects",
        "guards": [
          "(previous.config.native56Effects??0)>=3"
        ]
      },
      {
        "key": "native56Effects",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:marketSell",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 563,
          "endLine": 563
        },
        "expression": "state.config.native56Effects",
        "guards": [
          "state.config.brokerage"
        ]
      },
      {
        "key": "native56Effects",
        "owner": "code:apps/comic/src/game/appraisal/pilot-effects.ts:swordForDuel",
        "source": {
          "file": "apps/comic/src/game/appraisal/pilot-effects.ts",
          "line": 35,
          "endLine": 35
        },
        "expression": "state.config.native56Effects",
        "guards": []
      },
      {
        "key": "native56Effects",
        "owner": "code:apps/comic/src/game/appraisal/pilot-effects.ts:swordForDuel",
        "source": {
          "file": "apps/comic/src/game/appraisal/pilot-effects.ts",
          "line": 37,
          "endLine": 37
        },
        "expression": "state.config.native56Effects",
        "guards": []
      },
      {
        "key": "native56Effects",
        "owner": "code:apps/comic/src/game/appraisal/remaining48-effects.ts:remainingHeld",
        "source": {
          "file": "apps/comic/src/game/appraisal/remaining48-effects.ts",
          "line": 16,
          "endLine": 16
        },
        "expression": "state.config.native56Effects",
        "guards": []
      },
      {
        "key": "native56Effects",
        "owner": "code:apps/comic/src/game/appraisal/remaining48-effects.ts:remainingChallengePenalty",
        "source": {
          "file": "apps/comic/src/game/appraisal/remaining48-effects.ts",
          "line": 26,
          "endLine": 26
        },
        "expression": "state.config.native56Effects",
        "guards": []
      },
      {
        "key": "native56Effects",
        "owner": "code:apps/comic/src/game/appraisal/remaining48-effects.ts:remainingHeldBonus",
        "source": {
          "file": "apps/comic/src/game/appraisal/remaining48-effects.ts",
          "line": 38,
          "endLine": 38
        },
        "expression": "state.config.native56Effects",
        "guards": [
          "(state.config.native56Effects??0)>=3"
        ]
      },
      {
        "key": "native56Effects",
        "owner": "code:apps/comic/src/game/appraisal/remaining48-effects.ts:remainingMeet",
        "source": {
          "file": "apps/comic/src/game/appraisal/remaining48-effects.ts",
          "line": 41,
          "endLine": 41
        },
        "expression": "state.config.native56Effects",
        "guards": []
      },
      {
        "key": "native56Effects",
        "owner": "code:apps/comic/src/game/appraisal/remaining48-effects.ts:remainingBoundaryEnergy",
        "source": {
          "file": "apps/comic/src/game/appraisal/remaining48-effects.ts",
          "line": 50,
          "endLine": 50
        },
        "expression": "state.config.native56Effects",
        "guards": []
      },
      {
        "key": "native56Effects",
        "owner": "code:apps/comic/src/game/appraisal/remaining48-effects.ts:remainingRecoveryPrice",
        "source": {
          "file": "apps/comic/src/game/appraisal/remaining48-effects.ts",
          "line": 57,
          "endLine": 57
        },
        "expression": "state.config.native56Effects",
        "guards": []
      },
      {
        "key": "native56Effects",
        "owner": "code:apps/comic/src/game/appraisal/remaining48-effects.ts:remainingRecoveryTools",
        "source": {
          "file": "apps/comic/src/game/appraisal/remaining48-effects.ts",
          "line": 68,
          "endLine": 68
        },
        "expression": "state.config.native56Effects",
        "guards": []
      },
      {
        "key": "native56Effects",
        "owner": "code:apps/comic/src/game/appraisal/remaining48-effects.ts:remainingCommissionBonus",
        "source": {
          "file": "apps/comic/src/game/appraisal/remaining48-effects.ts",
          "line": 82,
          "endLine": 82
        },
        "expression": "state.config.native56Effects",
        "guards": []
      },
      {
        "key": "native56Effects",
        "owner": "code:apps/comic/src/game/appraisal/remaining48-effects.ts:remainingSaleEnergy",
        "source": {
          "file": "apps/comic/src/game/appraisal/remaining48-effects.ts",
          "line": 93,
          "endLine": 93
        },
        "expression": "state.config.native56Effects",
        "guards": []
      },
      {
        "key": "native56Effects",
        "owner": "code:apps/comic/src/game/appraisal/remaining48-effects.ts:remainingAuctionStart",
        "source": {
          "file": "apps/comic/src/game/appraisal/remaining48-effects.ts",
          "line": 112,
          "endLine": 112
        },
        "expression": "state.config.native56Effects",
        "guards": []
      },
      {
        "key": "native56Effects",
        "owner": "code:apps/comic/src/game/appraisal/remaining48-effects.ts:reconcileRemainingAuctionCustody",
        "source": {
          "file": "apps/comic/src/game/appraisal/remaining48-effects.ts",
          "line": 118,
          "endLine": 118
        },
        "expression": "state.config.native56Effects",
        "guards": []
      },
      {
        "key": "native56Effects",
        "owner": "code:apps/comic/src/game/appraisal/remaining48-effects.ts:remainingAuctionRebate",
        "source": {
          "file": "apps/comic/src/game/appraisal/remaining48-effects.ts",
          "line": 125,
          "endLine": 125
        },
        "expression": "state.config.native56Effects",
        "guards": []
      },
      {
        "key": "native56Effects",
        "owner": "code:apps/comic/src/game/appraisal/theft.ts:chooseTheftHand",
        "source": {
          "file": "apps/comic/src/game/appraisal/theft.ts",
          "line": 273,
          "endLine": 273
        },
        "expression": "state.config.native56Effects",
        "guards": [
          "thiefHand === opponentHand"
        ]
      },
      {
        "key": "native56Effects",
        "owner": "code:apps/comic/src/game/appraisal/theft.ts:theftViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/theft.ts",
          "line": 347,
          "endLine": 347
        },
        "expression": "state.config.native56Effects",
        "guards": []
      },
      {
        "key": "native56Effects",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalItemView",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 39,
          "endLine": 39
        },
        "expression": "state.config.native56Effects",
        "guards": [
          "isRemaining48Kind(item.kind)"
        ]
      }
    ]
  },
  {
    "key": "npcEvents",
    "default": null,
    "defaultPresent": false,
    "reads": [
      {
        "key": "npcEvents",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 65,
          "endLine": 65
        },
        "expression": "config.npcEvents",
        "guards": []
      },
      {
        "key": "npcEvents",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 65,
          "endLine": 65
        },
        "expression": "config.npcEvents",
        "guards": []
      },
      {
        "key": "npcEvents",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 524,
          "endLine": 524
        },
        "expression": "state.config.npcEvents",
        "guards": [
          "loan"
        ]
      },
      {
        "key": "npcEvents",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:drawPersonalNpcEvent",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 275,
          "endLine": 275
        },
        "expression": "state.config.npcEvents",
        "guards": []
      },
      {
        "key": "npcEvents",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:purchase",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 396,
          "endLine": 396
        },
        "expression": "state.config.npcEvents",
        "guards": []
      },
      {
        "key": "npcEvents",
        "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:npcEventEligible",
        "source": {
          "file": "apps/comic/src/game/appraisal/npc-events.ts",
          "line": 21,
          "endLine": 21
        },
        "expression": "state.config.npcEvents",
        "guards": []
      },
      {
        "key": "npcEvents",
        "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:redeemNpcContracts",
        "source": {
          "file": "apps/comic/src/game/appraisal/npc-events.ts",
          "line": 133,
          "endLine": 133
        },
        "expression": "state.config.npcEvents",
        "guards": []
      },
      {
        "key": "npcEvents",
        "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:closeNpcContracts",
        "source": {
          "file": "apps/comic/src/game/appraisal/npc-events.ts",
          "line": 159,
          "endLine": 159
        },
        "expression": "state.config.npcEvents",
        "guards": []
      }
    ]
  },
  {
    "key": "personalScoringFacts",
    "default": null,
    "defaultPresent": false,
    "reads": [
      {
        "key": "personalScoringFacts",
        "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond",
        "source": {
          "file": "apps/comic/src/game/appraisal/brokerage.ts",
          "line": 99,
          "endLine": 99
        },
        "expression": "state.config.personalScoringFacts",
        "guards": [
          "spec.mode==='sell'"
        ]
      },
      {
        "key": "personalScoringFacts",
        "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:consign",
        "source": {
          "file": "apps/comic/src/game/appraisal/brokerage.ts",
          "line": 150,
          "endLine": 150
        },
        "expression": "state.config.personalScoringFacts",
        "guards": [
          "state.config.core2"
        ]
      },
      {
        "key": "personalScoringFacts",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 49,
          "endLine": 49
        },
        "expression": "config.personalScoringFacts",
        "guards": []
      },
      {
        "key": "personalScoringFacts",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 49,
          "endLine": 49
        },
        "expression": "config.personalScoringFacts",
        "guards": []
      },
      {
        "key": "personalScoringFacts",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 50,
          "endLine": 50
        },
        "expression": "config.personalScoringFacts",
        "guards": []
      },
      {
        "key": "personalScoringFacts",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 51,
          "endLine": 51
        },
        "expression": "config.personalScoringFacts",
        "guards": []
      },
      {
        "key": "personalScoringFacts",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 376,
          "endLine": 376
        },
        "expression": "state.config.personalScoringFacts",
        "guards": []
      },
      {
        "key": "personalScoringFacts",
        "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:payLife",
        "source": {
          "file": "apps/comic/src/game/appraisal/npc-events.ts",
          "line": 77,
          "endLine": 77
        },
        "expression": "state.config.personalScoringFacts",
        "guards": []
      },
      {
        "key": "personalScoringFacts",
        "owner": "code:apps/comic/src/game/appraisal/personal-scoring.ts:recordPersonalInspection",
        "source": {
          "file": "apps/comic/src/game/appraisal/personal-scoring.ts",
          "line": 164,
          "endLine": 164
        },
        "expression": "state.config.personalScoringFacts",
        "guards": []
      },
      {
        "key": "personalScoringFacts",
        "owner": "code:apps/comic/src/game/appraisal/price-integrity.ts:liquidateOwnedItem",
        "source": {
          "file": "apps/comic/src/game/appraisal/price-integrity.ts",
          "line": 51,
          "endLine": 51
        },
        "expression": "state.config.personalScoringFacts",
        "guards": []
      },
      {
        "key": "personalScoringFacts",
        "owner": "code:apps/comic/src/game/appraisal/seals.ts:respondOffer",
        "source": {
          "file": "apps/comic/src/game/appraisal/seals.ts",
          "line": 107,
          "endLine": 107
        },
        "expression": "state.config.personalScoringFacts",
        "guards": [
          "offer.life > 0"
        ]
      }
    ]
  },
  {
    "key": "personalScoringRules",
    "default": null,
    "defaultPresent": false,
    "reads": [
      {
        "key": "personalScoringRules",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 48,
          "endLine": 48
        },
        "expression": "config.personalScoringRules",
        "guards": []
      },
      {
        "key": "personalScoringRules",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 48,
          "endLine": 48
        },
        "expression": "config.personalScoringRules",
        "guards": []
      },
      {
        "key": "personalScoringRules",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 50,
          "endLine": 50
        },
        "expression": "config.personalScoringRules",
        "guards": []
      },
      {
        "key": "personalScoringRules",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:initialiseAppraisalRun",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 110,
          "endLine": 110
        },
        "expression": "config.personalScoringRules",
        "guards": []
      },
      {
        "key": "personalScoringRules",
        "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent",
        "source": {
          "file": "apps/comic/src/game/appraisal/npc-events.ts",
          "line": 95,
          "endLine": 95
        },
        "expression": "state.config.personalScoringRules",
        "guards": [
          "state.config.personalScoringRules===1"
        ]
      },
      {
        "key": "personalScoringRules",
        "owner": "code:apps/comic/src/game/appraisal/personal-scoring.ts:recordPersonalFact",
        "source": {
          "file": "apps/comic/src/game/appraisal/personal-scoring.ts",
          "line": 149,
          "endLine": 149
        },
        "expression": "state.config.personalScoringRules",
        "guards": []
      },
      {
        "key": "personalScoringRules",
        "owner": "code:apps/comic/src/game/appraisal/personal-scoring.ts:recordPersonalActivity",
        "source": {
          "file": "apps/comic/src/game/appraisal/personal-scoring.ts",
          "line": 157,
          "endLine": 157
        },
        "expression": "state.config.personalScoringRules",
        "guards": []
      },
      {
        "key": "personalScoringRules",
        "owner": "code:apps/comic/src/game/appraisal/personal-scoring.ts:recordPersonalAppraisal",
        "source": {
          "file": "apps/comic/src/game/appraisal/personal-scoring.ts",
          "line": 175,
          "endLine": 175
        },
        "expression": "state.config.personalScoringRules",
        "guards": []
      },
      {
        "key": "personalScoringRules",
        "owner": "code:apps/comic/src/game/appraisal/personal-scoring.ts:personalPerformanceInvariants",
        "source": {
          "file": "apps/comic/src/game/appraisal/personal-scoring.ts",
          "line": 207,
          "endLine": 207
        },
        "expression": "state.config.personalScoringRules",
        "guards": []
      },
      {
        "key": "personalScoringRules",
        "owner": "code:apps/comic/src/game/appraisal/personal-scoring.ts:personalPerformanceInvariants",
        "source": {
          "file": "apps/comic/src/game/appraisal/personal-scoring.ts",
          "line": 208,
          "endLine": 208
        },
        "expression": "state.config.personalScoringRules",
        "guards": []
      },
      {
        "key": "personalScoringRules",
        "owner": "code:apps/comic/src/game/appraisal/survival.ts:collectRun",
        "source": {
          "file": "apps/comic/src/game/appraisal/survival.ts",
          "line": 22,
          "endLine": 22
        },
        "expression": "state.config.personalScoringRules",
        "guards": []
      },
      {
        "key": "personalScoringRules",
        "owner": "code:apps/comic/src/game/appraisal/survival.ts:collectRun",
        "source": {
          "file": "apps/comic/src/game/appraisal/survival.ts",
          "line": 29,
          "endLine": 29
        },
        "expression": "state.config.personalScoringRules",
        "guards": [
          "state.config.personalScoringRules===1"
        ]
      },
      {
        "key": "personalScoringRules",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 67,
          "endLine": 67
        },
        "expression": "state.config.personalScoringRules",
        "guards": [
          "state.config.personalScoringRules===1&&state.config.survival"
        ]
      },
      {
        "key": "personalScoringRules",
        "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:applyWish",
        "source": {
          "file": "apps/comic/src/game/appraisal/wishlist.ts",
          "line": 40,
          "endLine": 40
        },
        "expression": "state.config.personalScoringRules",
        "guards": [
          "state.config.personalScoringRules===1"
        ]
      }
    ]
  },
  {
    "key": "polish",
    "default": null,
    "defaultPresent": false,
    "reads": [
      {
        "key": "polish",
        "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:unsoldPenalty",
        "source": {
          "file": "apps/comic/src/game/appraisal/brokerage.ts",
          "line": 131,
          "endLine": 131
        },
        "expression": "state.config.polish",
        "guards": []
      },
      {
        "key": "polish",
        "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:unsoldPenalty",
        "source": {
          "file": "apps/comic/src/game/appraisal/brokerage.ts",
          "line": 131,
          "endLine": 131
        },
        "expression": "state.config.polish",
        "guards": []
      },
      {
        "key": "polish",
        "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:consign",
        "source": {
          "file": "apps/comic/src/game/appraisal/brokerage.ts",
          "line": 154,
          "endLine": 154
        },
        "expression": "state.config.polish",
        "guards": [
          "state.config.core2",
          "NOT roll>=CORE2.consign.debuffBelow",
          "roll>=CORE2.consign.cleanBelow",
          "state.config.polish"
        ]
      },
      {
        "key": "polish",
        "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:consign",
        "source": {
          "file": "apps/comic/src/game/appraisal/brokerage.ts",
          "line": 165,
          "endLine": 165
        },
        "expression": "state.config.polish",
        "guards": [
          "NOT roll>=CONSIGN_RULES.debuffBelow",
          "roll>=CONSIGN_RULES.cleanBelow",
          "state.config.polish"
        ]
      },
      {
        "key": "polish",
        "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:settleAuction",
        "source": {
          "file": "apps/comic/src/game/appraisal/brokerage.ts",
          "line": 222,
          "endLine": 222
        },
        "expression": "state.config.polish",
        "guards": []
      },
      {
        "key": "polish",
        "owner": "code:apps/comic/src/game/appraisal/cleanse.ts:quote",
        "source": {
          "file": "apps/comic/src/game/appraisal/cleanse.ts",
          "line": 20,
          "endLine": 20
        },
        "expression": "state.config.polish",
        "guards": [
          "state.config.polish"
        ]
      },
      {
        "key": "polish",
        "owner": "code:apps/comic/src/game/appraisal/cleanse.ts:cleanseItem",
        "source": {
          "file": "apps/comic/src/game/appraisal/cleanse.ts",
          "line": 40,
          "endLine": 40
        },
        "expression": "state.config.polish",
        "guards": []
      },
      {
        "key": "polish",
        "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:pool",
        "source": {
          "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
          "line": 30,
          "endLine": 30
        },
        "expression": "state.config.polish",
        "guards": []
      },
      {
        "key": "polish",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 69,
          "endLine": 69
        },
        "expression": "config.polish",
        "guards": []
      },
      {
        "key": "polish",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 69,
          "endLine": 69
        },
        "expression": "config.polish",
        "guards": []
      },
      {
        "key": "polish",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:spawnStockItem",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 130,
          "endLine": 130
        },
        "expression": "config.polish",
        "guards": []
      },
      {
        "key": "polish",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:polishEligible",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 64,
          "endLine": 64
        },
        "expression": "state.config.polish",
        "guards": []
      },
      {
        "key": "polish",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:expansionEligible",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 74,
          "endLine": 74
        },
        "expression": "state.config.polish",
        "guards": [
          "id==='E92'"
        ]
      },
      {
        "key": "polish",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:eventEligible",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 107,
          "endLine": 107
        },
        "expression": "state.config.polish",
        "guards": [
          "id===BOON_EVENT_ID"
        ]
      },
      {
        "key": "polish",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:preferUnseen",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 264,
          "endLine": 264
        },
        "expression": "state.config.polish",
        "guards": []
      },
      {
        "key": "polish",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:drawPolishEvent",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 269,
          "endLine": 269
        },
        "expression": "state.config.polish",
        "guards": []
      },
      {
        "key": "polish",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:drawExpansionEvent",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 284,
          "endLine": 284
        },
        "expression": "state.config.polish",
        "guards": [
          "state.phase==='TRADE' && state.config.polish"
        ]
      },
      {
        "key": "polish",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:salePercent",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 77,
          "endLine": 77
        },
        "expression": "state.config.polish",
        "guards": []
      },
      {
        "key": "polish",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:salePercent",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 78,
          "endLine": 78
        },
        "expression": "state.config.polish",
        "guards": [
          "state.config.polish"
        ]
      },
      {
        "key": "polish",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:saleApply",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 86,
          "endLine": 86
        },
        "expression": "state.config.polish",
        "guards": []
      },
      {
        "key": "polish",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:feeSurcharge",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 90,
          "endLine": 90
        },
        "expression": "state.config.polish",
        "guards": [
          "state.config.polish"
        ]
      },
      {
        "key": "polish",
        "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:makeCandidate",
        "source": {
          "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
          "line": 33,
          "endLine": 33
        },
        "expression": "config.polish",
        "guards": []
      },
      {
        "key": "polish",
        "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:statusPool",
        "source": {
          "file": "apps/comic/src/game/appraisal/npc-events.ts",
          "line": 65,
          "endLine": 65
        },
        "expression": "state.config.polish",
        "guards": []
      },
      {
        "key": "polish",
        "owner": "code:apps/comic/src/game/appraisal/omens.ts:omenOf",
        "source": {
          "file": "apps/comic/src/game/appraisal/omens.ts",
          "line": 11,
          "endLine": 11
        },
        "expression": "config.polish",
        "guards": []
      },
      {
        "key": "polish",
        "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:openRoundRewards",
        "source": {
          "file": "apps/comic/src/game/appraisal/round-rewards.ts",
          "line": 15,
          "endLine": 15
        },
        "expression": "state.config.polish",
        "guards": []
      },
      {
        "key": "polish",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 60,
          "endLine": 60
        },
        "expression": "state.config.polish",
        "guards": [
          "salePercent(state,p,true)!==0 || state.config.polish"
        ]
      },
      {
        "key": "polish",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 60,
          "endLine": 60
        },
        "expression": "state.config.polish",
        "guards": [
          "state.config.polish"
        ]
      },
      {
        "key": "polish",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 67,
          "endLine": 67
        },
        "expression": "state.config.polish",
        "guards": [
          "state.config.polish"
        ]
      },
      {
        "key": "polish",
        "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:wishPick",
        "source": {
          "file": "apps/comic/src/game/appraisal/wishlist.ts",
          "line": 19,
          "endLine": 19
        },
        "expression": "state.config.polish",
        "guards": [
          "state.config.trustAbilities"
        ]
      },
      {
        "key": "polish",
        "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:wishSell",
        "source": {
          "file": "apps/comic/src/game/appraisal/wishlist.ts",
          "line": 96,
          "endLine": 96
        },
        "expression": "state.config.polish",
        "guards": [
          "state.config.polish"
        ]
      }
    ]
  },
  {
    "key": "rarity",
    "default": {
      "version": 1,
      "rates": {
        "common": 0.6,
        "uncommon": 0.25,
        "rare": 0.1,
        "epic": 0.035,
        "legendary": 0.013,
        "mythic": 0.002
      },
      "themes": {
        "common": [
          {
            "theme": "plain",
            "weight": 1
          }
        ],
        "uncommon": [
          {
            "theme": "inferno",
            "weight": 1
          },
          {
            "theme": "frost",
            "weight": 1
          },
          {
            "theme": "storm",
            "weight": 1
          },
          {
            "theme": "venom",
            "weight": 1
          },
          {
            "theme": "spirit",
            "weight": 1
          },
          {
            "theme": "lunar",
            "weight": 1
          },
          {
            "theme": "solar",
            "weight": 1
          },
          {
            "theme": "void",
            "weight": 1
          },
          {
            "theme": "prism",
            "weight": 1
          },
          {
            "theme": "clockwork",
            "weight": 1
          }
        ],
        "rare": [
          {
            "theme": "inferno",
            "weight": 1
          },
          {
            "theme": "frost",
            "weight": 1
          },
          {
            "theme": "storm",
            "weight": 1
          },
          {
            "theme": "venom",
            "weight": 1
          },
          {
            "theme": "spirit",
            "weight": 1
          },
          {
            "theme": "lunar",
            "weight": 1
          },
          {
            "theme": "solar",
            "weight": 1
          },
          {
            "theme": "void",
            "weight": 1
          },
          {
            "theme": "prism",
            "weight": 1
          },
          {
            "theme": "clockwork",
            "weight": 1
          }
        ],
        "epic": [
          {
            "theme": "inferno",
            "weight": 1
          },
          {
            "theme": "frost",
            "weight": 1
          },
          {
            "theme": "storm",
            "weight": 1
          },
          {
            "theme": "venom",
            "weight": 1
          },
          {
            "theme": "spirit",
            "weight": 1
          },
          {
            "theme": "lunar",
            "weight": 1
          },
          {
            "theme": "solar",
            "weight": 1
          },
          {
            "theme": "void",
            "weight": 1
          },
          {
            "theme": "prism",
            "weight": 1
          },
          {
            "theme": "clockwork",
            "weight": 1
          }
        ],
        "legendary": [
          {
            "theme": "inferno",
            "weight": 1
          },
          {
            "theme": "frost",
            "weight": 1
          },
          {
            "theme": "storm",
            "weight": 1
          },
          {
            "theme": "venom",
            "weight": 1
          },
          {
            "theme": "spirit",
            "weight": 1
          },
          {
            "theme": "lunar",
            "weight": 1
          },
          {
            "theme": "solar",
            "weight": 1
          },
          {
            "theme": "void",
            "weight": 1
          },
          {
            "theme": "prism",
            "weight": 1
          },
          {
            "theme": "clockwork",
            "weight": 1
          }
        ],
        "mythic": [
          {
            "theme": "inferno",
            "weight": 1
          },
          {
            "theme": "frost",
            "weight": 1
          },
          {
            "theme": "storm",
            "weight": 1
          },
          {
            "theme": "venom",
            "weight": 1
          },
          {
            "theme": "spirit",
            "weight": 1
          },
          {
            "theme": "lunar",
            "weight": 1
          },
          {
            "theme": "solar",
            "weight": 1
          },
          {
            "theme": "void",
            "weight": 1
          },
          {
            "theme": "prism",
            "weight": 1
          },
          {
            "theme": "clockwork",
            "weight": 1
          }
        ]
      }
    },
    "defaultPresent": true,
    "reads": [
      {
        "key": "rarity",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 53,
          "endLine": 53
        },
        "expression": "config.rarity",
        "guards": [
          "config.rarityEconomy!==undefined"
        ]
      },
      {
        "key": "rarity",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 54,
          "endLine": 54
        },
        "expression": "config.rarity",
        "guards": []
      },
      {
        "key": "rarity",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 54,
          "endLine": 54
        },
        "expression": "config.rarity",
        "guards": [
          "config.rarity!==undefined"
        ]
      },
      {
        "key": "rarity",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 488,
          "endLine": 488
        },
        "expression": "state.config.rarity",
        "guards": [
          "item.appearance"
        ]
      },
      {
        "key": "rarity",
        "owner": "code:apps/comic/src/game/appraisal/rarity.ts:ensureItemAppearance",
        "source": {
          "file": "apps/comic/src/game/appraisal/rarity.ts",
          "line": 11,
          "endLine": 11
        },
        "expression": "state.config.rarity",
        "guards": []
      },
      {
        "key": "rarity",
        "owner": "code:apps/comic/src/game/appraisal/rarity.ts:ensureItemAppearance",
        "source": {
          "file": "apps/comic/src/game/appraisal/rarity.ts",
          "line": 13,
          "endLine": 13
        },
        "expression": "state.config.rarity",
        "guards": [
          "state.config.rarity && !item.appearance"
        ]
      }
    ]
  },
  {
    "key": "rarityEconomy",
    "default": {
      "version": 1,
      "tiers": {
        "common": {
          "value": 1,
          "effect": 1
        },
        "uncommon": {
          "value": 2,
          "effect": 2
        },
        "rare": {
          "value": 3,
          "effect": 3
        },
        "epic": {
          "value": 4,
          "effect": 4
        },
        "legendary": {
          "value": 6,
          "effect": 6
        },
        "mythic": {
          "value": 8,
          "effect": 8
        }
      }
    },
    "defaultPresent": true,
    "reads": [
      {
        "key": "rarityEconomy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 53,
          "endLine": 53
        },
        "expression": "config.rarityEconomy",
        "guards": []
      },
      {
        "key": "rarityEconomy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 53,
          "endLine": 53
        },
        "expression": "config.rarityEconomy",
        "guards": [
          "config.rarityEconomy!==undefined"
        ]
      },
      {
        "key": "rarityEconomy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:makeMarket",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 183,
          "endLine": 183
        },
        "expression": "state.config.rarityEconomy",
        "guards": [
          "state.config.rarityEconomy"
        ]
      },
      {
        "key": "rarityEconomy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:makeMarket",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 183,
          "endLine": 183
        },
        "expression": "state.config.rarityEconomy",
        "guards": [
          "state.config.rarityEconomy"
        ]
      },
      {
        "key": "rarityEconomy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 487,
          "endLine": 487
        },
        "expression": "state.config.rarityEconomy",
        "guards": [
          "item.rarityPower"
        ]
      },
      {
        "key": "rarityEconomy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 525,
          "endLine": 525
        },
        "expression": "state.config.rarityEconomy",
        "guards": [
          "state.config.rarityEconomy"
        ]
      },
      {
        "key": "rarityEconomy",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 475,
          "endLine": 475
        },
        "expression": "state.config.rarityEconomy",
        "guards": [
          "works",
          "bonus",
          "(state.config.trustAbilities||state.config.rarityEconomy)"
        ]
      },
      {
        "key": "rarityEconomy",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 478,
          "endLine": 478
        },
        "expression": "state.config.rarityEconomy",
        "guards": [
          "works",
          "bonus",
          "power>previous"
        ]
      },
      {
        "key": "rarityEconomy",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:marketSell",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 537,
          "endLine": 537
        },
        "expression": "state.config.rarityEconomy",
        "guards": []
      },
      {
        "key": "rarityEconomy",
        "owner": "code:apps/comic/src/game/appraisal/rarity.ts:ensureItemAppearance",
        "source": {
          "file": "apps/comic/src/game/appraisal/rarity.ts",
          "line": 15,
          "endLine": 15
        },
        "expression": "state.config.rarityEconomy",
        "guards": []
      },
      {
        "key": "rarityEconomy",
        "owner": "code:apps/comic/src/game/appraisal/rarity.ts:ensureItemAppearance",
        "source": {
          "file": "apps/comic/src/game/appraisal/rarity.ts",
          "line": 16,
          "endLine": 16
        },
        "expression": "state.config.rarityEconomy",
        "guards": [
          "state.config.rarityEconomy && item.appearance && !item.rarityPower"
        ]
      },
      {
        "key": "rarityEconomy",
        "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:wishOffer",
        "source": {
          "file": "apps/comic/src/game/appraisal/wishlist.ts",
          "line": 83,
          "endLine": 83
        },
        "expression": "state.config.rarityEconomy",
        "guards": [
          "state.config.rarityEconomy"
        ]
      }
    ]
  },
  {
    "key": "rates",
    "default": null,
    "defaultPresent": false,
    "reads": [
      {
        "key": "rates",
        "owner": "code:apps/comic/src/shared/item-rarity.ts:validateRarityConfig",
        "source": {
          "file": "apps/comic/src/shared/item-rarity.ts",
          "line": 30,
          "endLine": 30
        },
        "expression": "config.rates",
        "guards": []
      },
      {
        "key": "rates",
        "owner": "code:apps/comic/src/shared/item-rarity.ts:validateRarityConfig",
        "source": {
          "file": "apps/comic/src/shared/item-rarity.ts",
          "line": 33,
          "endLine": 33
        },
        "expression": "config.rates",
        "guards": []
      },
      {
        "key": "rates",
        "owner": "code:apps/comic/src/shared/item-rarity.ts:rollAppearance",
        "source": {
          "file": "apps/comic/src/shared/item-rarity.ts",
          "line": 56,
          "endLine": 56
        },
        "expression": "config.rates",
        "guards": []
      }
    ]
  },
  {
    "key": "recoveryEnergy",
    "default": 4,
    "defaultPresent": true,
    "reads": [
      {
        "key": "recoveryEnergy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 84,
          "endLine": 84
        },
        "expression": "config.recoveryEnergy",
        "guards": []
      },
      {
        "key": "recoveryEnergy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 84,
          "endLine": 84
        },
        "expression": "config.recoveryEnergy",
        "guards": []
      },
      {
        "key": "recoveryEnergy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 469,
          "endLine": 469
        },
        "expression": "state.config.recoveryEnergy",
        "guards": [
          "NOT state.config.survival",
          "rested"
        ]
      }
    ]
  },
  {
    "key": "recoveryQuoteRules",
    "default": null,
    "defaultPresent": false,
    "reads": [
      {
        "key": "recoveryQuoteRules",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 47,
          "endLine": 47
        },
        "expression": "config.recoveryQuoteRules",
        "guards": []
      },
      {
        "key": "recoveryQuoteRules",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 47,
          "endLine": 47
        },
        "expression": "config.recoveryQuoteRules",
        "guards": []
      },
      {
        "key": "recoveryQuoteRules",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 410,
          "endLine": 410
        },
        "expression": "state.config.recoveryQuoteRules",
        "guards": []
      },
      {
        "key": "recoveryQuoteRules",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:recoveryOffer",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 167,
          "endLine": 167
        },
        "expression": "state.config.recoveryQuoteRules",
        "guards": [
          "state.config.recoveryQuoteRules===1"
        ]
      }
    ]
  },
  {
    "key": "reduce",
    "default": null,
    "defaultPresent": false,
    "reads": [
      {
        "key": "reduce",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:stockBonus",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 65,
          "endLine": 65
        },
        "expression": "activeNpcs(state.config).reduce",
        "guards": [
          "state.config.commerce && state.config.totalTrustStock"
        ]
      }
    ]
  },
  {
    "key": "roundRewards",
    "default": true,
    "defaultPresent": true,
    "reads": [
      {
        "key": "roundRewards",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 80,
          "endLine": 80
        },
        "expression": "config.roundRewards",
        "guards": []
      },
      {
        "key": "roundRewards",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 80,
          "endLine": 80
        },
        "expression": "config.roundRewards",
        "guards": []
      },
      {
        "key": "roundRewards",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 493,
          "endLine": 493
        },
        "expression": "state.config.roundRewards",
        "guards": []
      },
      {
        "key": "roundRewards",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 516,
          "endLine": 516
        },
        "expression": "state.config.roundRewards",
        "guards": [
          "r"
        ]
      },
      {
        "key": "roundRewards",
        "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:openRoundRewards",
        "source": {
          "file": "apps/comic/src/game/appraisal/round-rewards.ts",
          "line": 9,
          "endLine": 9
        },
        "expression": "state.config.roundRewards",
        "guards": []
      },
      {
        "key": "roundRewards",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 65,
          "endLine": 65
        },
        "expression": "state.config.roundRewards",
        "guards": [
          "state.config.roundRewards"
        ]
      }
    ]
  },
  {
    "key": "secureEconomy",
    "default": null,
    "defaultPresent": false,
    "reads": [
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond",
        "source": {
          "file": "apps/comic/src/game/appraisal/brokerage.ts",
          "line": 85,
          "endLine": 85
        },
        "expression": "state.config.secureEconomy",
        "guards": []
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:core2ActionsOf",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-actions.ts",
          "line": 136,
          "endLine": 136
        },
        "expression": "state.config.secureEconomy",
        "guards": [
          "!state.config.secureEconomy"
        ]
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 51,
          "endLine": 51
        },
        "expression": "config.secureEconomy",
        "guards": []
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 55,
          "endLine": 55
        },
        "expression": "config.secureEconomy",
        "guards": []
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 55,
          "endLine": 55
        },
        "expression": "config.secureEconomy",
        "guards": []
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:initialiseAppraisalRun",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 112,
          "endLine": 112
        },
        "expression": "config.secureEconomy",
        "guards": []
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:initialiseAppraisalRun",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 121,
          "endLine": 121
        },
        "expression": "config.secureEconomy",
        "guards": []
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:pauseIfNeeded",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 195,
          "endLine": 195
        },
        "expression": "state.config.secureEconomy",
        "guards": []
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:settleEncounter",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 227,
          "endLine": 227
        },
        "expression": "state.config.secureEconomy",
        "guards": []
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:respond",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 322,
          "endLine": 322
        },
        "expression": "state.config.secureEconomy",
        "guards": []
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 359,
          "endLine": 359
        },
        "expression": "state.config.secureEconomy",
        "guards": []
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 370,
          "endLine": 370
        },
        "expression": "state.config.secureEconomy",
        "guards": [
          "financeAction || action.type==='theft-hand' || action.type==='theft-expire' || forcedTimeout"
        ]
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 388,
          "endLine": 388
        },
        "expression": "state.config.secureEconomy",
        "guards": []
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 418,
          "endLine": 418
        },
        "expression": "state.config.secureEconomy",
        "guards": []
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 419,
          "endLine": 419
        },
        "expression": "state.config.secureEconomy",
        "guards": []
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 436,
          "endLine": 436
        },
        "expression": "state.config.secureEconomy",
        "guards": [
          "action.type==='theft-timeout'"
        ]
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 439,
          "endLine": 439
        },
        "expression": "state.config.secureEconomy",
        "guards": []
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 443,
          "endLine": 443
        },
        "expression": "state.config.secureEconomy",
        "guards": []
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 451,
          "endLine": 451
        },
        "expression": "state.config.secureEconomy",
        "guards": []
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 452,
          "endLine": 452
        },
        "expression": "state.config.secureEconomy",
        "guards": [
          "!state.config.survival && state.encounter===state.config.encounters"
        ]
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 454,
          "endLine": 454
        },
        "expression": "state.config.secureEconomy",
        "guards": []
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:defaultAppraisalAction",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 482,
          "endLine": 482
        },
        "expression": "state.config.secureEconomy",
        "guards": [
          "state.config.secureEconomy && state.theftDuels?.some(d=>d.status==='open' && [d.thiefId,d.victimId].includes(p.id))"
        ]
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 489,
          "endLine": 489
        },
        "expression": "state.config.secureEconomy",
        "guards": []
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 500,
          "endLine": 500
        },
        "expression": "state.config.secureEconomy",
        "guards": [
          "state.config.secureEconomy"
        ]
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 502,
          "endLine": 502
        },
        "expression": "state.config.secureEconomy",
        "guards": []
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:eventEligible",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 162,
          "endLine": 162
        },
        "expression": "state.config.secureEconomy",
        "guards": []
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 376,
          "endLine": 376
        },
        "expression": "state.config.secureEconomy",
        "guards": []
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:purchase",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 385,
          "endLine": 385
        },
        "expression": "state.config.secureEconomy",
        "guards": []
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/price-integrity.ts:auditItemPrice",
        "source": {
          "file": "apps/comic/src/game/appraisal/price-integrity.ts",
          "line": 16,
          "endLine": 16
        },
        "expression": "state.config.secureEconomy",
        "guards": []
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/price-integrity.ts:recordItemTrade",
        "source": {
          "file": "apps/comic/src/game/appraisal/price-integrity.ts",
          "line": 28,
          "endLine": 28
        },
        "expression": "state.config.secureEconomy",
        "guards": []
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/price-integrity.ts:systemSaleQuote",
        "source": {
          "file": "apps/comic/src/game/appraisal/price-integrity.ts",
          "line": 36,
          "endLine": 36
        },
        "expression": "state.config.secureEconomy",
        "guards": [
          "state.config.secureEconomy && item.priceIntegrity?.overpriced"
        ]
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/price-integrity.ts:liquidateOwnedItem",
        "source": {
          "file": "apps/comic/src/game/appraisal/price-integrity.ts",
          "line": 46,
          "endLine": 46
        },
        "expression": "state.config.secureEconomy",
        "guards": []
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/price-integrity.ts:reappraiseOwnedItem",
        "source": {
          "file": "apps/comic/src/game/appraisal/price-integrity.ts",
          "line": 58,
          "endLine": 58
        },
        "expression": "state.config.secureEconomy",
        "guards": []
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/price-integrity.ts:integrityItemView",
        "source": {
          "file": "apps/comic/src/game/appraisal/price-integrity.ts",
          "line": 79,
          "endLine": 79
        },
        "expression": "state.config.secureEconomy",
        "guards": []
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/seals.ts:handleSealAction",
        "source": {
          "file": "apps/comic/src/game/appraisal/seals.ts",
          "line": 161,
          "endLine": 161
        },
        "expression": "state.config.secureEconomy",
        "guards": []
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:enabled",
        "source": {
          "file": "apps/comic/src/game/appraisal/secure-storage.ts",
          "line": 40,
          "endLine": 40
        },
        "expression": "state.config.secureEconomy",
        "guards": []
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:settleLoansBeforeAdvance",
        "source": {
          "file": "apps/comic/src/game/appraisal/secure-storage.ts",
          "line": 189,
          "endLine": 189
        },
        "expression": "state.config.secureEconomy",
        "guards": []
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:payVaultInterest",
        "source": {
          "file": "apps/comic/src/game/appraisal/secure-storage.ts",
          "line": 207,
          "endLine": 207
        },
        "expression": "state.config.secureEconomy",
        "guards": []
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:secureStorageInvariants",
        "source": {
          "file": "apps/comic/src/game/appraisal/secure-storage.ts",
          "line": 232,
          "endLine": 232
        },
        "expression": "state.config.secureEconomy",
        "guards": []
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:secureStorageInvariants",
        "source": {
          "file": "apps/comic/src/game/appraisal/secure-storage.ts",
          "line": 237,
          "endLine": 237
        },
        "expression": "state.config.secureEconomy",
        "guards": []
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:ownedAssetItemIds",
        "source": {
          "file": "apps/comic/src/game/appraisal/secure-storage.ts",
          "line": 251,
          "endLine": 251
        },
        "expression": "state.config.secureEconomy",
        "guards": [
          "state.config.secureEconomy"
        ]
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/survival.ts:collectRun",
        "source": {
          "file": "apps/comic/src/game/appraisal/survival.ts",
          "line": 21,
          "endLine": 21
        },
        "expression": "state.config.secureEconomy",
        "guards": []
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalItemView",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 39,
          "endLine": 39
        },
        "expression": "state.config.secureEconomy",
        "guards": [
          "state.config.secureEconomy"
        ]
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 57,
          "endLine": 57
        },
        "expression": "state.config.secureEconomy",
        "guards": [
          "state.config.secureEconomy"
        ]
      },
      {
        "key": "secureEconomy",
        "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:wishSell",
        "source": {
          "file": "apps/comic/src/game/appraisal/wishlist.ts",
          "line": 88,
          "endLine": 88
        },
        "expression": "state.config.secureEconomy",
        "guards": []
      }
    ]
  },
  {
    "key": "startingCredits",
    "default": 40,
    "defaultPresent": true,
    "reads": [
      {
        "key": "startingCredits",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:initialiseAppraisalRun",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 119,
          "endLine": 119
        },
        "expression": "config.startingCredits",
        "guards": []
      },
      {
        "key": "startingCredits",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:initialiseAppraisalRun",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 119,
          "endLine": 119
        },
        "expression": "config.startingCredits",
        "guards": []
      },
      {
        "key": "startingCredits",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 498,
          "endLine": 498
        },
        "expression": "state.config.startingCredits",
        "guards": []
      },
      {
        "key": "startingCredits",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 500,
          "endLine": 500
        },
        "expression": "state.config.startingCredits",
        "guards": []
      }
    ]
  },
  {
    "key": "statusLinks",
    "default": 1,
    "defaultPresent": true,
    "reads": [
      {
        "key": "statusLinks",
        "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:core2EventChoices",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-events.ts",
          "line": 35,
          "endLine": 35
        },
        "expression": "state.config.statusLinks",
        "guards": []
      },
      {
        "key": "statusLinks",
        "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:core2EventEligible",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-events.ts",
          "line": 59,
          "endLine": 59
        },
        "expression": "state.config.statusLinks",
        "guards": [
          "id==='E126'"
        ]
      },
      {
        "key": "statusLinks",
        "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:core2EventEligible",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-events.ts",
          "line": 62,
          "endLine": 62
        },
        "expression": "state.config.statusLinks",
        "guards": [
          "id==='E128'",
          "state.config.systemLinks===1 && state.config.statusLinks===1"
        ]
      },
      {
        "key": "statusLinks",
        "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:core2EventEligible",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-events.ts",
          "line": 66,
          "endLine": 66
        },
        "expression": "state.config.statusLinks",
        "guards": [
          "id==='E129'"
        ]
      },
      {
        "key": "statusLinks",
        "owner": "code:apps/comic/src/game/appraisal/core2.ts:linkedStatuses",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2.ts",
          "line": 79,
          "endLine": 79
        },
        "expression": "config.statusLinks",
        "guards": [
          "config.core2 && config.statusLinks===1"
        ]
      },
      {
        "key": "statusLinks",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 57,
          "endLine": 57
        },
        "expression": "config.statusLinks",
        "guards": []
      },
      {
        "key": "statusLinks",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 57,
          "endLine": 57
        },
        "expression": "config.statusLinks",
        "guards": []
      },
      {
        "key": "statusLinks",
        "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:merchantAbilityViews",
        "source": {
          "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
          "line": 26,
          "endLine": 26
        },
        "expression": "state.config.statusLinks",
        "guards": [
          "state.config.statusLinks===1 && status(p,'D21')"
        ]
      },
      {
        "key": "statusLinks",
        "owner": "code:apps/comic/src/game/appraisal/theft.ts:startTheftDuel",
        "source": {
          "file": "apps/comic/src/game/appraisal/theft.ts",
          "line": 152,
          "endLine": 152
        },
        "expression": "state.config.statusLinks",
        "guards": []
      },
      {
        "key": "statusLinks",
        "owner": "code:apps/comic/src/game/appraisal/theft.ts:merchantFailure",
        "source": {
          "file": "apps/comic/src/game/appraisal/theft.ts",
          "line": 253,
          "endLine": 253
        },
        "expression": "state.config.statusLinks",
        "guards": []
      },
      {
        "key": "statusLinks",
        "owner": "code:apps/comic/src/game/appraisal/theft.ts:chooseTheftHand",
        "source": {
          "file": "apps/comic/src/game/appraisal/theft.ts",
          "line": 276,
          "endLine": 276
        },
        "expression": "state.config.statusLinks",
        "guards": [
          "thiefHand === opponentHand",
          "state.config.statusLinks === 1"
        ]
      },
      {
        "key": "statusLinks",
        "owner": "code:apps/comic/src/game/appraisal/theft.ts:theftViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/theft.ts",
          "line": 353,
          "endLine": 353
        },
        "expression": "state.config.statusLinks",
        "guards": [
          "state.config.statusLinks === 1 && d.status === 'open'"
        ]
      },
      {
        "key": "statusLinks",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 62,
          "endLine": 62
        },
        "expression": "state.config.statusLinks",
        "guards": [
          "state.config.statusLinks"
        ]
      },
      {
        "key": "statusLinks",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 62,
          "endLine": 62
        },
        "expression": "state.config.statusLinks",
        "guards": [
          "state.config.statusLinks"
        ]
      }
    ]
  },
  {
    "key": "survival",
    "default": null,
    "defaultPresent": false,
    "reads": [
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/audit.ts:replayAppraisalAudit",
        "source": {
          "file": "apps/comic/src/game/appraisal/audit.ts",
          "line": 27,
          "endLine": 27
        },
        "expression": "audit.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/audit.ts:replayAppraisalAudit",
        "source": {
          "file": "apps/comic/src/game/appraisal/audit.ts",
          "line": 31,
          "endLine": 31
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:applyGain",
        "source": {
          "file": "apps/comic/src/game/appraisal/brokerage.ts",
          "line": 76,
          "endLine": 76
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:unsoldPenalty",
        "source": {
          "file": "apps/comic/src/game/appraisal/brokerage.ts",
          "line": 130,
          "endLine": 130
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:unsoldPenalty",
        "source": {
          "file": "apps/comic/src/game/appraisal/brokerage.ts",
          "line": 139,
          "endLine": 139
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:skillPayable",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-actions.ts",
          "line": 95,
          "endLine": 95
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:useSkill",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-actions.ts",
          "line": 108,
          "endLine": 108
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:debtWithoutNext",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-events.ts",
          "line": 19,
          "endLine": 19
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:affordable",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-events.ts",
          "line": 25,
          "endLine": 25
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:affordable",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-events.ts",
          "line": 28,
          "endLine": 28
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:affordable",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-events.ts",
          "line": 28,
          "endLine": 28
        },
        "expression": "state.config.survival",
        "guards": [
          "state.config.systemLinks===1"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:core2EventEligible",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-events.ts",
          "line": 57,
          "endLine": 57
        },
        "expression": "state.config.survival",
        "guards": [
          "id==='E126'",
          "state.config.survival"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:core2EventEligible",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-events.ts",
          "line": 57,
          "endLine": 57
        },
        "expression": "state.config.survival",
        "guards": [
          "id==='E126'",
          "state.config.survival",
          "state.config.systemLinks===1"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:core2EventEligible",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-events.ts",
          "line": 61,
          "endLine": 61
        },
        "expression": "state.config.survival",
        "guards": [
          "id==='E127'"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:resolveCore2Event",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-events.ts",
          "line": 94,
          "endLine": 94
        },
        "expression": "state.config.survival",
        "guards": [
          "picked.heal"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/core2-rules.ts:applyDread",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-rules.ts",
          "line": 17,
          "endLine": 17
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/core2-rules.ts:applyOmenPressure",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-rules.ts",
          "line": 42,
          "endLine": 42
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/core2-rules.ts:applyCore2Settlement",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-rules.ts",
          "line": 48,
          "endLine": 48
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/core2-rules.ts:applyCore2Settlement",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-rules.ts",
          "line": 52,
          "endLine": 52
        },
        "expression": "state.config.survival",
        "guards": [
          "status(p,'D23')"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/core2-rules.ts:applyCore2Settlement",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-rules.ts",
          "line": 56,
          "endLine": 56
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/core2-rules.ts:applyCore2Settlement",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-rules.ts",
          "line": 59,
          "endLine": 59
        },
        "expression": "state.config.survival",
        "guards": [
          "status(p,'B24')"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/core2.ts:anchorOf",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2.ts",
          "line": 48,
          "endLine": 48
        },
        "expression": "config.survival",
        "guards": [
          "!!config.survival && ['food','potion'].includes(itemFamily(kind))"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 51,
          "endLine": 51
        },
        "expression": "config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 86,
          "endLine": 86
        },
        "expression": "config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 86,
          "endLine": 86
        },
        "expression": "config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 86,
          "endLine": 86
        },
        "expression": "config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 86,
          "endLine": 86
        },
        "expression": "config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 87,
          "endLine": 87
        },
        "expression": "config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 88,
          "endLine": 88
        },
        "expression": "config.survival",
        "guards": [
          "config.survival"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:initialiseAppraisalRun",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 109,
          "endLine": 109
        },
        "expression": "config.survival",
        "guards": [
          "config.survival"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:initialiseAppraisalRun",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 115,
          "endLine": 115
        },
        "expression": "config.survival",
        "guards": [
          "config.survival"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:initialiseAppraisalRun",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 119,
          "endLine": 119
        },
        "expression": "config.survival",
        "guards": [
          "config.survival"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:initialiseAppraisalRun",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 119,
          "endLine": 119
        },
        "expression": "config.survival",
        "guards": [
          "config.survival"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:initialiseAppraisalRun",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 122,
          "endLine": 122
        },
        "expression": "config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:initialiseAppraisalRun",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 122,
          "endLine": 122
        },
        "expression": "config.survival",
        "guards": [
          "config.survival"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:makeMarket",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 183,
          "endLine": 183
        },
        "expression": "state.config.survival",
        "guards": [
          "state.config.commerce"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:pauseIfNeeded",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 196,
          "endLine": 196
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:settleEncounter",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 206,
          "endLine": 206
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:settleEncounter",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 216,
          "endLine": 216
        },
        "expression": "state.config.survival",
        "guards": [
          "state.config.survival"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:settleEncounter",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 219,
          "endLine": 219
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:settleEncounter",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 220,
          "endLine": 220
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:settleEncounter",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 220,
          "endLine": 220
        },
        "expression": "state.config.survival",
        "guards": [
          "state.config.survival && p.life!>0",
          "state.config.core2"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:settleEncounter",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 221,
          "endLine": 221
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:settleEncounter",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 225,
          "endLine": 225
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:forceBuy",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 285,
          "endLine": 285
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:respond",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 303,
          "endLine": 303
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 452,
          "endLine": 452
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 463,
          "endLine": 463
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 465,
          "endLine": 465
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 468,
          "endLine": 468
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 468,
          "endLine": 468
        },
        "expression": "state.config.survival",
        "guards": [
          "state.config.survival"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 519,
          "endLine": 519
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 521,
          "endLine": 521
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 525,
          "endLine": 525
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 531,
          "endLine": 531
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:expansionEligible",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 72,
          "endLine": 72
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:eventEligible",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 112,
          "endLine": 112
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:eventChoices",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 192,
          "endLine": 192
        },
        "expression": "state.config.survival",
        "guards": [
          "state.config.systemLinks===1",
          "state.config.survival || !status(p,'D10')"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 330,
          "endLine": 330
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 402,
          "endLine": 402
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
        "source": {
          "file": "apps/comic/src/game/appraisal/ghost-service.ts",
          "line": 26,
          "endLine": 26
        },
        "expression": "s.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:maxEnergyOf",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 44,
          "endLine": 44
        },
        "expression": "state.config.survival",
        "guards": [
          "state.config.survival"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:maxLifeOf",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 47,
          "endLine": 47
        },
        "expression": "state.config.survival",
        "guards": [
          "state.config.survival"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:maxLifeOf",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 47,
          "endLine": 47
        },
        "expression": "state.config.survival",
        "guards": [
          "state.config.survival"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:grant",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 96,
          "endLine": 96
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:healLife",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 137,
          "endLine": 137
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:recoveryOffer",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 154,
          "endLine": 154
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:completeAppraisedSale",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 318,
          "endLine": 318
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:friendAppraised",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 339,
          "endLine": 339
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:purchase",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 392,
          "endLine": 392
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:purchase",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 424,
          "endLine": 424
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 472,
          "endLine": 472
        },
        "expression": "state.config.survival",
        "guards": [
          "works"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 483,
          "endLine": 483
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activationNote",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 503,
          "endLine": 503
        },
        "expression": "state.config.survival",
        "guards": [
          "spec.nativeEffect",
          "state.config.survival"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activationNote",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 503,
          "endLine": 503
        },
        "expression": "state.config.survival",
        "guards": [
          "spec.nativeEffect",
          "state.config.survival"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:kill",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 516,
          "endLine": 516
        },
        "expression": "state.config.survival",
        "guards": [
          "NOT status(p,'B08')"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:marketSell",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 533,
          "endLine": 533
        },
        "expression": "state.config.survival",
        "guards": [
          "contract && resolution==='sacrifice'",
          "cost.kind==='life'"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:marketSell",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 545,
          "endLine": 545
        },
        "expression": "state.config.survival",
        "guards": [
          "contract && !matched",
          "NOT resolution==='discount'",
          "NOT cost.kind==='energy'",
          "cost.kind==='life'"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:livingOthers",
        "source": {
          "file": "apps/comic/src/game/appraisal/npc-events.ts",
          "line": 14,
          "endLine": 14
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:npcEventEligible",
        "source": {
          "file": "apps/comic/src/game/appraisal/npc-events.ts",
          "line": 25,
          "endLine": 25
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:npcEventEligible",
        "source": {
          "file": "apps/comic/src/game/appraisal/npc-events.ts",
          "line": 27,
          "endLine": 27
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:personalNpcOffer",
        "source": {
          "file": "apps/comic/src/game/appraisal/npc-events.ts",
          "line": 48,
          "endLine": 48
        },
        "expression": "state.config.survival",
        "guards": [
          "id==='E111'"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:statusPool",
        "source": {
          "file": "apps/comic/src/game/appraisal/npc-events.ts",
          "line": 67,
          "endLine": 67
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:payLife",
        "source": {
          "file": "apps/comic/src/game/appraisal/npc-events.ts",
          "line": 76,
          "endLine": 76
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent",
        "source": {
          "file": "apps/comic/src/game/appraisal/npc-events.ts",
          "line": 112,
          "endLine": 112
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:redeemNpcContracts",
        "source": {
          "file": "apps/comic/src/game/appraisal/npc-events.ts",
          "line": 138,
          "endLine": 138
        },
        "expression": "state.config.survival",
        "guards": [
          "npc==='vampire' && blood && state.encounter>blood.signedAt",
          "state.config.survival && p.life!<maxLifeOf(state,p)!"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:openRoundRewards",
        "source": {
          "file": "apps/comic/src/game/appraisal/round-rewards.ts",
          "line": 11,
          "endLine": 11
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/seals.ts:offerSeal",
        "source": {
          "file": "apps/comic/src/game/appraisal/seals.ts",
          "line": 83,
          "endLine": 83
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/survival.ts:collectorDue",
        "source": {
          "file": "apps/comic/src/game/appraisal/survival.ts",
          "line": 15,
          "endLine": 15
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/survival.ts:collectRun",
        "source": {
          "file": "apps/comic/src/game/appraisal/survival.ts",
          "line": 17,
          "endLine": 17
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalItemView",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 32,
          "endLine": 32
        },
        "expression": "state.config.survival",
        "guards": [
          "state.phase==='RESULTS' && state.config.survival && state.collector?.some(row=>row.items.some(i=>i.id===itemId))"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalItemView",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 46,
          "endLine": 46
        },
        "expression": "state.config.survival",
        "guards": [
          "state.config.survival && ['food','potion'].includes(itemFamily(item.kind))"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalItemView",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 46,
          "endLine": 46
        },
        "expression": "state.config.survival",
        "guards": [
          "state.config.survival && spec.buff==='B10'"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalItemView",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 47,
          "endLine": 47
        },
        "expression": "state.config.survival",
        "guards": [
          "spec.nativeEffect",
          "state.config.survival"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalItemView",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 47,
          "endLine": 47
        },
        "expression": "state.config.survival",
        "guards": [
          "spec.nativeEffect",
          "state.config.survival && spec.drawback==='D10'"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalItemView",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 48,
          "endLine": 48
        },
        "expression": "state.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 60,
          "endLine": 60
        },
        "expression": "state.config.survival",
        "guards": [
          "state.config.core2",
          "state.config.survival"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 63,
          "endLine": 63
        },
        "expression": "state.config.survival",
        "guards": [
          "state.config.survival"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 64,
          "endLine": 64
        },
        "expression": "state.config.survival",
        "guards": [
          "state.config.survival"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 66,
          "endLine": 66
        },
        "expression": "state.config.survival",
        "guards": [
          "state.config.survival"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 66,
          "endLine": 66
        },
        "expression": "state.config.survival",
        "guards": [
          "state.config.survival"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 67,
          "endLine": 67
        },
        "expression": "state.config.survival",
        "guards": [
          "state.config.personalScoringRules===1&&state.config.survival"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 67,
          "endLine": 67
        },
        "expression": "state.config.survival",
        "guards": [
          "state.config.survival && state.phase!=='RESULTS'"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 67,
          "endLine": 67
        },
        "expression": "state.config.survival",
        "guards": [
          "state.config.survival && state.config.commerce"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 70,
          "endLine": 70
        },
        "expression": "state.config.survival",
        "guards": [
          "state.config.survival && state.phase!=='RESULTS'"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.modeOf",
        "source": {
          "file": "apps/comic/src/server/appraisal-rooms.ts",
          "line": 52,
          "endLine": 52
        },
        "expression": "room.game.config.survival",
        "guards": [
          "room.game",
          "room.game.config.survival"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.matchMessage",
        "source": {
          "file": "apps/comic/src/server/appraisal-rooms.ts",
          "line": 122,
          "endLine": 122
        },
        "expression": "room.game.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.revealDone",
        "source": {
          "file": "apps/comic/src/server/appraisal-rooms.ts",
          "line": 140,
          "endLine": 140
        },
        "expression": "room.game?.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.afterChange",
        "source": {
          "file": "apps/comic/src/server/appraisal-rooms.ts",
          "line": 150,
          "endLine": 150
        },
        "expression": "game.config.survival",
        "guards": [
          "game.phase === 'REVEAL'"
        ]
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.afterChange",
        "source": {
          "file": "apps/comic/src/server/appraisal-rooms.ts",
          "line": 161,
          "endLine": 161
        },
        "expression": "current.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.afterChange",
        "source": {
          "file": "apps/comic/src/server/appraisal-rooms.ts",
          "line": 162,
          "endLine": 162
        },
        "expression": "current.config.survival",
        "guards": []
      },
      {
        "key": "survival",
        "owner": "code:apps/comic/src/simulation/appraisal.ts:simulateAppraisalRun",
        "source": {
          "file": "apps/comic/src/simulation/appraisal.ts",
          "line": 250,
          "endLine": 250
        },
        "expression": "state.config.survival",
        "guards": []
      }
    ]
  },
  {
    "key": "systemLinks",
    "default": 1,
    "defaultPresent": true,
    "reads": [
      {
        "key": "systemLinks",
        "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:affordable",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-events.ts",
          "line": 28,
          "endLine": 28
        },
        "expression": "state.config.systemLinks",
        "guards": [
          "state.config.systemLinks===1"
        ]
      },
      {
        "key": "systemLinks",
        "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:core2EventChoices",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-events.ts",
          "line": 35,
          "endLine": 35
        },
        "expression": "state.config.systemLinks",
        "guards": []
      },
      {
        "key": "systemLinks",
        "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:core2EventEligible",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-events.ts",
          "line": 57,
          "endLine": 57
        },
        "expression": "state.config.systemLinks",
        "guards": [
          "id==='E126'",
          "state.config.survival",
          "state.config.systemLinks===1"
        ]
      },
      {
        "key": "systemLinks",
        "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:core2EventEligible",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-events.ts",
          "line": 57,
          "endLine": 57
        },
        "expression": "state.config.systemLinks",
        "guards": [
          "id==='E126'",
          "state.config.survival",
          "state.config.systemLinks===1"
        ]
      },
      {
        "key": "systemLinks",
        "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:core2EventEligible",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-events.ts",
          "line": 62,
          "endLine": 62
        },
        "expression": "state.config.systemLinks",
        "guards": [
          "id==='E128'",
          "state.config.systemLinks===1 && state.config.statusLinks===1"
        ]
      },
      {
        "key": "systemLinks",
        "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:resolveCore2Event",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-events.ts",
          "line": 83,
          "endLine": 83
        },
        "expression": "state.config.systemLinks",
        "guards": [
          "choice!=='decline' && choice!==FALLBACK_BRAND.id",
          "state.config.systemLinks===1"
        ]
      },
      {
        "key": "systemLinks",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 58,
          "endLine": 58
        },
        "expression": "config.systemLinks",
        "guards": []
      },
      {
        "key": "systemLinks",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 58,
          "endLine": 58
        },
        "expression": "config.systemLinks",
        "guards": []
      },
      {
        "key": "systemLinks",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:eventEligible",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 123,
          "endLine": 123
        },
        "expression": "state.config.systemLinks",
        "guards": []
      },
      {
        "key": "systemLinks",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:eventChoices",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 191,
          "endLine": 191
        },
        "expression": "state.config.systemLinks",
        "guards": [
          "state.config.systemLinks===1"
        ]
      },
      {
        "key": "systemLinks",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 330,
          "endLine": 330
        },
        "expression": "state.config.systemLinks",
        "guards": []
      },
      {
        "key": "systemLinks",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:defaultEvent",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 415,
          "endLine": 415
        },
        "expression": "state.config.systemLinks",
        "guards": [
          "core2Spec(offer.id)"
        ]
      }
    ]
  },
  {
    "key": "th",
    "default": null,
    "defaultPresent": false,
    "reads": [
      {
        "key": "th",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalItemView",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 46,
          "endLine": 46
        },
        "expression": "(ABILITY_ITEM_TEXT[item.kind as keyof typeof ABILITY_ITEM_TEXT]??(state.config.trustAbilities?MODERN_ACTIVATIONS[item.kind as keyof typeof MODERN_ACTIVATIONS]:undefined))?.th",
        "guards": []
      }
    ]
  },
  {
    "key": "theftTimeoutRules",
    "default": 1,
    "defaultPresent": true,
    "reads": [
      {
        "key": "theftTimeoutRules",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 59,
          "endLine": 59
        },
        "expression": "config.theftTimeoutRules",
        "guards": []
      },
      {
        "key": "theftTimeoutRules",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 59,
          "endLine": 59
        },
        "expression": "config.theftTimeoutRules",
        "guards": []
      },
      {
        "key": "theftTimeoutRules",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 368,
          "endLine": 368
        },
        "expression": "state.config.theftTimeoutRules",
        "guards": []
      },
      {
        "key": "theftTimeoutRules",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 376,
          "endLine": 376
        },
        "expression": "state.config.theftTimeoutRules",
        "guards": [
          "financeAction || action.type==='theft-hand' || action.type==='theft-expire' || forcedTimeout",
          "NOT storageAction",
          "NOT loanAction",
          "NOT sealAction",
          "NOT action.type==='crime-clear'",
          "action.type==='theft-hand'"
        ]
      },
      {
        "key": "theftTimeoutRules",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:defaultAppraisalAction",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 481,
          "endLine": 481
        },
        "expression": "state.config.theftTimeoutRules",
        "guards": []
      },
      {
        "key": "theftTimeoutRules",
        "owner": "code:apps/comic/src/game/appraisal/theft.ts:expireTheftDuel",
        "source": {
          "file": "apps/comic/src/game/appraisal/theft.ts",
          "line": 191,
          "endLine": 191
        },
        "expression": "state.config.theftTimeoutRules",
        "guards": []
      },
      {
        "key": "theftTimeoutRules",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 57,
          "endLine": 57
        },
        "expression": "state.config.theftTimeoutRules",
        "guards": [
          "state.config.secureEconomy",
          "state.config.theftTimeoutRules===1"
        ]
      },
      {
        "key": "theftTimeoutRules",
        "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.matchMessage",
        "source": {
          "file": "apps/comic/src/server/appraisal-rooms.ts",
          "line": 64,
          "endLine": 64
        },
        "expression": "room.game?.config.theftTimeoutRules",
        "guards": [
          "message.type==='action'&&message.action.type==='theft-hand'&&message.matchId===room.matchId&&room.game?.config.theftTimeoutRules===1"
        ]
      }
    ]
  },
  {
    "key": "themes",
    "default": null,
    "defaultPresent": false,
    "reads": [
      {
        "key": "themes",
        "owner": "code:apps/comic/src/shared/item-rarity.ts:validateRarityConfig",
        "source": {
          "file": "apps/comic/src/shared/item-rarity.ts",
          "line": 30,
          "endLine": 30
        },
        "expression": "config.themes",
        "guards": []
      },
      {
        "key": "themes",
        "owner": "code:apps/comic/src/shared/item-rarity.ts:validateRarityConfig",
        "source": {
          "file": "apps/comic/src/shared/item-rarity.ts",
          "line": 34,
          "endLine": 34
        },
        "expression": "config.themes",
        "guards": []
      },
      {
        "key": "themes",
        "owner": "code:apps/comic/src/shared/item-rarity.ts:rollAppearance",
        "source": {
          "file": "apps/comic/src/shared/item-rarity.ts",
          "line": 57,
          "endLine": 57
        },
        "expression": "config.themes",
        "guards": []
      }
    ]
  },
  {
    "key": "tiers",
    "default": null,
    "defaultPresent": false,
    "reads": [
      {
        "key": "tiers",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:makeMarket",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 183,
          "endLine": 183
        },
        "expression": "state.config.rarityEconomy.tiers",
        "guards": [
          "state.config.rarityEconomy"
        ]
      },
      {
        "key": "tiers",
        "owner": "code:apps/comic/src/shared/rarity-power.ts:validateRarityEconomy",
        "source": {
          "file": "apps/comic/src/shared/rarity-power.ts",
          "line": 13,
          "endLine": 13
        },
        "expression": "config.tiers",
        "guards": []
      },
      {
        "key": "tiers",
        "owner": "code:apps/comic/src/shared/rarity-power.ts:validateRarityEconomy",
        "source": {
          "file": "apps/comic/src/shared/rarity-power.ts",
          "line": 15,
          "endLine": 15
        },
        "expression": "config.tiers",
        "guards": []
      },
      {
        "key": "tiers",
        "owner": "code:apps/comic/src/shared/rarity-power.ts:validateRarityEconomy",
        "source": {
          "file": "apps/comic/src/shared/rarity-power.ts",
          "line": 19,
          "endLine": 19
        },
        "expression": "config.tiers",
        "guards": []
      },
      {
        "key": "tiers",
        "owner": "code:apps/comic/src/shared/rarity-power.ts:validateRarityEconomy",
        "source": {
          "file": "apps/comic/src/shared/rarity-power.ts",
          "line": 19,
          "endLine": 19
        },
        "expression": "config.tiers",
        "guards": []
      },
      {
        "key": "tiers",
        "owner": "code:apps/comic/src/shared/rarity-power.ts:rarityPowerFor",
        "source": {
          "file": "apps/comic/src/shared/rarity-power.ts",
          "line": 22,
          "endLine": 22
        },
        "expression": "config.tiers",
        "guards": []
      }
    ]
  },
  {
    "key": "totalTrustStock",
    "default": true,
    "defaultPresent": true,
    "reads": [
      {
        "key": "totalTrustStock",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 68,
          "endLine": 68
        },
        "expression": "config.totalTrustStock",
        "guards": []
      },
      {
        "key": "totalTrustStock",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 68,
          "endLine": 68
        },
        "expression": "config.totalTrustStock",
        "guards": []
      },
      {
        "key": "totalTrustStock",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:stockBonus",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 64,
          "endLine": 64
        },
        "expression": "state.config.totalTrustStock",
        "guards": []
      },
      {
        "key": "totalTrustStock",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 67,
          "endLine": 67
        },
        "expression": "state.config.totalTrustStock",
        "guards": [
          "state.config.commerce",
          "state.config.totalTrustStock"
        ]
      }
    ]
  },
  {
    "key": "trustAbilities",
    "default": true,
    "defaultPresent": true,
    "reads": [
      {
        "key": "trustAbilities",
        "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:pool",
        "source": {
          "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
          "line": 30,
          "endLine": 30
        },
        "expression": "state.config.trustAbilities",
        "guards": []
      },
      {
        "key": "trustAbilities",
        "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:core2ActionsOf",
        "source": {
          "file": "apps/comic/src/game/appraisal/core2-actions.ts",
          "line": 135,
          "endLine": 135
        },
        "expression": "state.config.trustAbilities",
        "guards": [
          "open && npc && !state.config.trustAbilities"
        ]
      },
      {
        "key": "trustAbilities",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 63,
          "endLine": 63
        },
        "expression": "config.trustAbilities",
        "guards": []
      },
      {
        "key": "trustAbilities",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 63,
          "endLine": 63
        },
        "expression": "config.trustAbilities",
        "guards": []
      },
      {
        "key": "trustAbilities",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:spawnStockItem",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 130,
          "endLine": 130
        },
        "expression": "config.trustAbilities",
        "guards": []
      },
      {
        "key": "trustAbilities",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:spawnStockItem",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 131,
          "endLine": 131
        },
        "expression": "config.trustAbilities",
        "guards": []
      },
      {
        "key": "trustAbilities",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 422,
          "endLine": 422
        },
        "expression": "state.config.trustAbilities",
        "guards": []
      },
      {
        "key": "trustAbilities",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 458,
          "endLine": 458
        },
        "expression": "state.config.trustAbilities",
        "guards": []
      },
      {
        "key": "trustAbilities",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 504,
          "endLine": 504
        },
        "expression": "state.config.trustAbilities",
        "guards": [
          "item.copy"
        ]
      },
      {
        "key": "trustAbilities",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 508,
          "endLine": 508
        },
        "expression": "state.config.trustAbilities",
        "guards": []
      },
      {
        "key": "trustAbilities",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:eventEligible",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 92,
          "endLine": 92
        },
        "expression": "state.config.trustAbilities",
        "guards": [
          "(ABILITY_EVENT_IDS as readonly string[]).includes(id)"
        ]
      },
      {
        "key": "trustAbilities",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:drawEvent",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 255,
          "endLine": 255
        },
        "expression": "state.config.trustAbilities",
        "guards": [
          "state.config.trustAbilities && !reaction"
        ]
      },
      {
        "key": "trustAbilities",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 315,
          "endLine": 315
        },
        "expression": "state.config.trustAbilities",
        "guards": [
          "(ABILITY_EVENT_IDS as readonly string[]).includes(id)"
        ]
      },
      {
        "key": "trustAbilities",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:purchase",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 397,
          "endLine": 397
        },
        "expression": "state.config.trustAbilities",
        "guards": [
          "state.config.trustAbilities && buyer.orcDeal?.encounter===state.encounter && itemIds.includes(buyer.orcDeal.itemId)"
        ]
      },
      {
        "key": "trustAbilities",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 444,
          "endLine": 444
        },
        "expression": "state.config.trustAbilities",
        "guards": [
          "works",
          "NOT spec.nativeEffect==='effect:E62'"
        ]
      },
      {
        "key": "trustAbilities",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 455,
          "endLine": 455
        },
        "expression": "state.config.trustAbilities",
        "guards": [
          "works",
          "NOT spec.nativeEffect==='effect:E62'",
          "NOT state.config.trustAbilities && (ABILITY_ITEM_IDS as readonly string[]).includes(item.kind)"
        ]
      },
      {
        "key": "trustAbilities",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 475,
          "endLine": 475
        },
        "expression": "state.config.trustAbilities",
        "guards": [
          "works",
          "bonus",
          "(state.config.trustAbilities||state.config.rarityEconomy)"
        ]
      },
      {
        "key": "trustAbilities",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 478,
          "endLine": 478
        },
        "expression": "state.config.trustAbilities",
        "guards": [
          "works",
          "bonus",
          "power>previous"
        ]
      },
      {
        "key": "trustAbilities",
        "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activationNote",
        "source": {
          "file": "apps/comic/src/game/appraisal/mechanics.ts",
          "line": 500,
          "endLine": 500
        },
        "expression": "state.config.trustAbilities",
        "guards": [
          "state.config.trustAbilities"
        ]
      },
      {
        "key": "trustAbilities",
        "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:makeCandidate",
        "source": {
          "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
          "line": 33,
          "endLine": 33
        },
        "expression": "config.trustAbilities",
        "guards": []
      },
      {
        "key": "trustAbilities",
        "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:useMerchantAbility",
        "source": {
          "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
          "line": 82,
          "endLine": 82
        },
        "expression": "state.config.trustAbilities",
        "guards": []
      },
      {
        "key": "trustAbilities",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalItemView",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 39,
          "endLine": 39
        },
        "expression": "state.config.trustAbilities",
        "guards": [
          "state.config.trustAbilities"
        ]
      },
      {
        "key": "trustAbilities",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalItemView",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 46,
          "endLine": 46
        },
        "expression": "state.config.trustAbilities",
        "guards": [
          "state.config.trustAbilities"
        ]
      },
      {
        "key": "trustAbilities",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 58,
          "endLine": 58
        },
        "expression": "state.config.trustAbilities",
        "guards": [
          "state.config.trustAbilities"
        ]
      },
      {
        "key": "trustAbilities",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 67,
          "endLine": 67
        },
        "expression": "state.config.trustAbilities",
        "guards": [
          "state.config.trustAbilities"
        ]
      },
      {
        "key": "trustAbilities",
        "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:wishPick",
        "source": {
          "file": "apps/comic/src/game/appraisal/wishlist.ts",
          "line": 19,
          "endLine": 19
        },
        "expression": "state.config.trustAbilities",
        "guards": [
          "state.config.trustAbilities"
        ]
      }
    ]
  },
  {
    "key": "value",
    "default": null,
    "defaultPresent": false,
    "reads": [
      {
        "key": "value",
        "owner": "code:apps/comic/src/shared/rarity-power.ts:validateRarityEconomy",
        "source": {
          "file": "apps/comic/src/shared/rarity-power.ts",
          "line": 19,
          "endLine": 19
        },
        "expression": "config.tiers.common.value",
        "guards": []
      }
    ]
  },
  {
    "key": "vaultInterestRules",
    "default": 1,
    "defaultPresent": true,
    "reads": [
      {
        "key": "vaultInterestRules",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 60,
          "endLine": 60
        },
        "expression": "config.vaultInterestRules",
        "guards": []
      },
      {
        "key": "vaultInterestRules",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 60,
          "endLine": 60
        },
        "expression": "config.vaultInterestRules",
        "guards": []
      },
      {
        "key": "vaultInterestRules",
        "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:nextVaultInterest",
        "source": {
          "file": "apps/comic/src/game/appraisal/secure-storage.ts",
          "line": 13,
          "endLine": 13
        },
        "expression": "state.config.vaultInterestRules",
        "guards": [
          "state.config.vaultInterestRules===1"
        ]
      },
      {
        "key": "vaultInterestRules",
        "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleStorageAction",
        "source": {
          "file": "apps/comic/src/game/appraisal/secure-storage.ts",
          "line": 98,
          "endLine": 98
        },
        "expression": "state.config.vaultInterestRules",
        "guards": []
      },
      {
        "key": "vaultInterestRules",
        "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:payVaultInterest",
        "source": {
          "file": "apps/comic/src/game/appraisal/secure-storage.ts",
          "line": 211,
          "endLine": 211
        },
        "expression": "state.config.vaultInterestRules",
        "guards": []
      },
      {
        "key": "vaultInterestRules",
        "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:payVaultInterest",
        "source": {
          "file": "apps/comic/src/game/appraisal/secure-storage.ts",
          "line": 217,
          "endLine": 217
        },
        "expression": "state.config.vaultInterestRules",
        "guards": [
          "state.config.vaultInterestRules===1"
        ]
      },
      {
        "key": "vaultInterestRules",
        "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:payVaultInterest",
        "source": {
          "file": "apps/comic/src/game/appraisal/secure-storage.ts",
          "line": 221,
          "endLine": 221
        },
        "expression": "state.config.vaultInterestRules",
        "guards": []
      },
      {
        "key": "vaultInterestRules",
        "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:payVaultInterest",
        "source": {
          "file": "apps/comic/src/game/appraisal/secure-storage.ts",
          "line": 221,
          "endLine": 221
        },
        "expression": "state.config.vaultInterestRules",
        "guards": [
          "state.config.vaultInterestRules===1"
        ]
      },
      {
        "key": "vaultInterestRules",
        "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:payVaultInterest",
        "source": {
          "file": "apps/comic/src/game/appraisal/secure-storage.ts",
          "line": 222,
          "endLine": 222
        },
        "expression": "state.config.vaultInterestRules",
        "guards": [
          "state.config.vaultInterestRules===1"
        ]
      },
      {
        "key": "vaultInterestRules",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 57,
          "endLine": 57
        },
        "expression": "state.config.vaultInterestRules",
        "guards": [
          "state.config.secureEconomy",
          "state.config.vaultInterestRules===1"
        ]
      },
      {
        "key": "vaultInterestRules",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 67,
          "endLine": 67
        },
        "expression": "state.config.vaultInterestRules",
        "guards": [
          "p.personalVault",
          "state.config.vaultInterestRules===1"
        ]
      }
    ]
  },
  {
    "key": "version",
    "default": null,
    "defaultPresent": false,
    "reads": [
      {
        "key": "version",
        "owner": "code:apps/comic/src/shared/item-rarity.ts:validateRarityConfig",
        "source": {
          "file": "apps/comic/src/shared/item-rarity.ts",
          "line": 30,
          "endLine": 30
        },
        "expression": "config.version",
        "guards": []
      },
      {
        "key": "version",
        "owner": "code:apps/comic/src/shared/rarity-power.ts:validateRarityEconomy",
        "source": {
          "file": "apps/comic/src/shared/rarity-power.ts",
          "line": 13,
          "endLine": 13
        },
        "expression": "config.version",
        "guards": []
      }
    ]
  },
  {
    "key": "wishContract",
    "default": true,
    "defaultPresent": true,
    "reads": [
      {
        "key": "wishContract",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 72,
          "endLine": 72
        },
        "expression": "config.wishContract",
        "guards": []
      },
      {
        "key": "wishContract",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 72,
          "endLine": 72
        },
        "expression": "config.wishContract",
        "guards": []
      },
      {
        "key": "wishContract",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:initialiseAppraisalRun",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 119,
          "endLine": 119
        },
        "expression": "config.wishContract",
        "guards": [
          "config.wishContract"
        ]
      },
      {
        "key": "wishContract",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:eventChoices",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 206,
          "endLine": 206
        },
        "expression": "state.config.wishContract",
        "guards": [
          "state.config.wishContract && npc && !p.wishes?.[npc] && open.length>=wishSlotsOf(state,p,2)"
        ]
      },
      {
        "key": "wishContract",
        "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
        "source": {
          "file": "apps/comic/src/game/appraisal/events.ts",
          "line": 322,
          "endLine": 322
        },
        "expression": "state.config.wishContract",
        "guards": [
          "id==='E73'",
          "state.config.wishContract"
        ]
      },
      {
        "key": "wishContract",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 60,
          "endLine": 60
        },
        "expression": "state.config.wishContract",
        "guards": [
          "state.config.wishlist && state.config.wishContract"
        ]
      },
      {
        "key": "wishContract",
        "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:contractOn",
        "source": {
          "file": "apps/comic/src/game/appraisal/wishlist.ts",
          "line": 24,
          "endLine": 24
        },
        "expression": "state.config.wishContract",
        "guards": []
      }
    ]
  },
  {
    "key": "wishlist",
    "default": true,
    "defaultPresent": true,
    "reads": [
      {
        "key": "wishlist",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 73,
          "endLine": 73
        },
        "expression": "config.wishlist",
        "guards": []
      },
      {
        "key": "wishlist",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 73,
          "endLine": 73
        },
        "expression": "config.wishlist",
        "guards": []
      },
      {
        "key": "wishlist",
        "owner": "code:apps/comic/src/game/appraisal/engine.ts:initialiseAppraisalRun",
        "source": {
          "file": "apps/comic/src/game/appraisal/engine.ts",
          "line": 119,
          "endLine": 119
        },
        "expression": "config.wishlist",
        "guards": [
          "config.wishlist"
        ]
      },
      {
        "key": "wishlist",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 60,
          "endLine": 60
        },
        "expression": "state.config.wishlist",
        "guards": [
          "state.config.wishlist"
        ]
      },
      {
        "key": "wishlist",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 60,
          "endLine": 60
        },
        "expression": "state.config.wishlist",
        "guards": [
          "state.config.wishlist && state.config.wishContract"
        ]
      },
      {
        "key": "wishlist",
        "owner": "code:apps/comic/src/game/appraisal/views.ts:appraisalViewFor",
        "source": {
          "file": "apps/comic/src/game/appraisal/views.ts",
          "line": 67,
          "endLine": 67
        },
        "expression": "state.config.wishlist",
        "guards": [
          "state.config.wishlist && p.life!==0 && Object.keys(p.wishes??{}).length"
        ]
      },
      {
        "key": "wishlist",
        "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:contractOn",
        "source": {
          "file": "apps/comic/src/game/appraisal/wishlist.ts",
          "line": 24,
          "endLine": 24
        },
        "expression": "state.config.wishlist",
        "guards": []
      },
      {
        "key": "wishlist",
        "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:wishEligible",
        "source": {
          "file": "apps/comic/src/game/appraisal/wishlist.ts",
          "line": 36,
          "endLine": 36
        },
        "expression": "state.config.wishlist",
        "guards": []
      },
      {
        "key": "wishlist",
        "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:drawWishEvent",
        "source": {
          "file": "apps/comic/src/game/appraisal/wishlist.ts",
          "line": 69,
          "endLine": 69
        },
        "expression": "state.config.wishlist",
        "guards": []
      },
      {
        "key": "wishlist",
        "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:wishOffer",
        "source": {
          "file": "apps/comic/src/game/appraisal/wishlist.ts",
          "line": 79,
          "endLine": 79
        },
        "expression": "state.config.wishlist",
        "guards": []
      },
      {
        "key": "wishlist",
        "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:wishSell",
        "source": {
          "file": "apps/comic/src/game/appraisal/wishlist.ts",
          "line": 89,
          "endLine": 89
        },
        "expression": "state.config.wishlist",
        "guards": []
      }
    ]
  }
]
```
# Tuning parameters
```json
[
  {
    "id": "parameter:personal-scoring:PERSONAL_SCORING_WEIGHTS",
    "module": "personal-scoring",
    "name": "PERSONAL_SCORING_WEIGHTS",
    "value": [
      {
        "id": "bought",
        "group": "commerce",
        "unit": "unique original bought item",
        "numerator": 2,
        "denominator": 1,
        "cap": 40
      },
      {
        "id": "soldQuantity",
        "group": "commerce",
        "unit": "eligible successful sale item",
        "numerator": 5,
        "denominator": 1,
        "cap": 75
      },
      {
        "id": "soldGrossCredits",
        "group": "commerce",
        "unit": "eligible completed gross sale credits excluding fees/rebates/commissions",
        "numerator": 1,
        "denominator": 10,
        "cap": 100
      },
      {
        "id": "trustGained",
        "group": "relations",
        "unit": "actual positive merchant trust gained after cap; cumulative, never subtract later losses",
        "numerator": 3,
        "denominator": 1,
        "cap": 120
      },
      {
        "id": "inspection",
        "group": "knowledge",
        "unit": "new personally inspected item facet",
        "numerator": 1,
        "denominator": 1,
        "cap": 24
      },
      {
        "id": "accurateAppraisal",
        "group": "knowledge",
        "unit": "first submitted appraisal per origin within20percent of true rarity-scaled base",
        "numerator": 2,
        "denominator": 1,
        "cap": 40
      },
      {
        "id": "npcContract",
        "group": "relations",
        "unit": "fulfilled NPC contract id",
        "numerator": 4,
        "denominator": 1,
        "cap": 32
      },
      {
        "id": "interest",
        "group": "finance",
        "unit": "aged interest credits actually paid to wallet",
        "numerator": 1,
        "denominator": 1,
        "cap": 30
      },
      {
        "id": "loanRepaid",
        "group": "finance",
        "unit": "fully repaid real funded loan surviving at least one full encounter",
        "numerator": 5,
        "denominator": 1,
        "cap": 20
      },
      {
        "id": "survived",
        "group": "journey",
        "unit": "completed encounter with life above0 after settlement",
        "numerator": 2,
        "denominator": 1,
        "cap": 30
      },
      {
        "id": "lifeLost",
        "group": "journey",
        "unit": "actual HP removed, including voluntary costs, excluding overkill/death count",
        "numerator": 1,
        "denominator": 1,
        "cap": 12
      },
      {
        "id": "theft",
        "group": "journey",
        "unit": "successful theft with actual asset transfer",
        "numerator": 4,
        "denominator": 1,
        "cap": 20
      },
      {
        "id": "rarity",
        "group": "collection",
        "unit": "final original goods in actual Collector custody",
        "byRarity": {
          "common": 0,
          "uncommon": 4,
          "rare": 8,
          "epic": 12,
          "legendary": 20,
          "mythic": 28
        },
        "cap": 80
      },
      {
        "id": "ghost",
        "group": "ghost",
        "unit": "previously approved earned credit bonus",
        "numerator": 1,
        "denominator": 1,
        "cap": null
      }
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/personal-scoring.ts",
      "line": 9,
      "endLine": 128
    }
  },
  {
    "id": "parameter:pilot-catalog:PILOT_ITEMS",
    "module": "pilot-catalog",
    "name": "PILOT_ITEMS",
    "value": {
      "orc-tusk-shield": {
        "name": "โล่เขี้ยวออร์ก",
        "anchor": 24,
        "family": "shield",
        "consumable": false,
        "nativeEffect": "effect:E62",
        "merchant": "orc",
        "explicitActivation": true,
        "benefit": "ลดความเสียหายครั้งถัดไป 1 ชีวิต (ปรับตามพลัง effect สูงสุด 2) หมดเมื่อเปลี่ยนช่วง",
        "usage": "กดตั้งรับ 1 พลัง · ครั้งเดียวต่อชิ้นต่อช่วง",
        "exclusions": "ไม่ลดการจ่ายชีวิตตามสัญญา/ราคาสินค้า ไม่กันคำสาปจากการเปิดโล่นี้เอง; ใช้ผลแท้/ปลอมและคำสาปผ่านกฎเปิดใช้เดิม"
      },
      "vampire-nocturne-signet": {
        "name": "แหวนตราราตรี",
        "anchor": 20,
        "family": "ring",
        "consumable": false,
        "nativeEffect": "effect:E46",
        "merchant": "vampire",
        "explicitActivation": false,
        "benefit": "เพิ่มดอกเบี้ยเงินต้นที่ครบช่วง +2 จุดเปอร์เซ็นต์; โบนัสแหวนรวมไม่เกิน +4 จุด (ฐาน10%ไม่เปลี่ยน)",
        "usage": "ถือแหวนชิ้นเดิมตั้งแต่ต้นจนจบช่วง",
        "exclusions": "เงินฝากใหม่/แหวนเพิ่งได้ไม่มีดอกเบี้ยย้อนหลัง; โบนัสใช้ค่าต่ำกว่าระหว่างต้นและจบช่วง"
      },
      "autometa-torque-caliper": {
        "name": "คาลิเปอร์วัดแรงบิด",
        "anchor": 18,
        "family": "caliper",
        "consumable": false,
        "nativeEffect": "effect:E01",
        "merchant": "autometa",
        "explicitActivation": false,
        "benefit": "ให้สิทธิ์ประหยัดค่าพลังตรวจราคาเพิ่ม 1 ครั้งต่อชิ้นต่อช่วง ยังใช้โควตาตรวจตามปกติ",
        "usage": "ใช้ผ่านปุ่มตรวจราคาเดิม · ไม่ต้องเปิดใช้แยก",
        "exclusions": "หากรายการนั้นฟรีจากสิทธิ์พ่อค้าอยู่แล้ว ไม่กินสิทธิ์เครื่องมือซ้ำ"
      },
      "alien-thought-translator": {
        "name": "เครื่องแปลความคิด",
        "anchor": 20,
        "family": "translator",
        "consumable": false,
        "nativeEffect": "effect:E11",
        "merchant": "alien",
        "explicitActivation": false,
        "benefit": "เพิ่มโอกาสพ่อค้ายอมรับราคาต่ำ +2 จุดเปอร์เซ็นต์ต่อหน่วย effect; โอกาสรวมสูงสุด95%",
        "usage": "ทำงานขณะถือและเป็นเจ้าของ",
        "exclusions": "ไม่บังคับผู้เล่นอื่นรับข้อเสนอ ไม่ข้าม overvalue/backlash หรือสถานะห้ามซื้อขาย"
      },
      "darkone-crossing-token": {
        "name": "เหรียญผ่านแดน",
        "anchor": 18,
        "family": "token",
        "consumable": false,
        "nativeEffect": "effect:E43",
        "merchant": "darkone",
        "explicitActivation": false,
        "benefit": "ลดค่าล้างประวัติ 10% ต่อหน่วย effect รวมสูงสุด50%; หากราคาฐานมากกว่า0 ยังจ่ายอย่างน้อย1เครดิต",
        "usage": "ตอนจ่ายค่าล้างประวัติหลังจบดวล",
        "exclusions": "ไม่ยกเลิกดวล ไม่คืนความไว้ใจ ไม่ล้างคดีฟรี ไม่ให้ cashback"
      },
      "deepsea-tide-compass": {
        "name": "เข็มทิศกระแสน้ำ",
        "anchor": 18,
        "family": "compass",
        "consumable": false,
        "nativeEffect": "effect:E34",
        "merchant": "deepsea",
        "explicitActivation": false,
        "benefit": "ลดค่าพลังเปลี่ยนประตู 1 ต่อหน่วย effect รวมลดไม่เกิน2; เหลืออย่างน้อย1พลัง",
        "usage": "ตอนเปลี่ยนประตูที่เปิดได้",
        "exclusions": "ยังเพิ่มต้นทุนฐานตามจำนวนที่รีจริง และไม่เปิดประตูปิด/เปลี่ยน NPC หลังเลือก"
      },
      "swarm-brood-hammer": {
        "name": "ค้อนรัง",
        "anchor": 22,
        "family": "hammer",
        "consumable": false,
        "nativeEffect": "effect:E47",
        "merchant": "swarm",
        "explicitActivation": false,
        "benefit": "ลดราคาเพิ่มช่องคลัง 2เครดิตต่อหน่วย effect แต่ไม่เกินครึ่งของราคาฐานและเหลืออย่างน้อย1เครดิต",
        "usage": "ตอนจ่ายเพิ่มช่องคลัง",
        "exclusions": "ไม่คืนส่วนลดช่องที่ซื้อแล้ว ฝากถอนของไม่สร้างเงิน/charge และไม่ลดราคาฝากเงิน"
      },
      "beast-riftfang-sword": {
        "name": "ดาบเขี้ยวรอยแยก",
        "anchor": 24,
        "family": "sword",
        "consumable": false,
        "nativeEffect": "effect:E38",
        "merchant": "beast",
        "explicitActivation": false,
        "benefit": "แต้มได้เปรียบเสมอที่เปิดเผย +1 ใช้ได้กับตาเสมอจริงครั้งแรกในช่วงนั้น; ไม่เพิ่มเมื่อถือซ้ำ",
        "usage": "ประกาศเมื่อเข้าดวล · มีสิทธิ์ต่อชิ้นต่อช่วง",
        "exclusions": "แจ้งทั้งคู่ก่อนส่งมือ โดยไม่เผย guard/สถานะลับของคู่แข่ง; ถ้าทั้งคู่มีผลเดียวกันหักล้างและยังเล่นตาต่อไป"
      }
    },
    "source": {
      "file": "apps/comic/src/game/appraisal/pilot-catalog.ts",
      "line": 5,
      "endLine": 14
    }
  },
  {
    "id": "parameter:content:CONSIGN_RULES",
    "module": "content",
    "name": "CONSIGN_RULES",
    "value": {
      "cleanBelow": 0.4,
      "debuffBelow": 0.8,
      "debuffs": [
        "D01",
        "D02",
        "D03",
        "D06"
      ],
      "fee": 2
    },
    "source": {
      "file": "apps/comic/src/game/appraisal/content.ts",
      "line": 402,
      "endLine": 402
    }
  },
  {
    "id": "parameter:content:EXPANSION_NPCS",
    "module": "content",
    "name": "EXPANSION_NPCS",
    "value": [
      "deepsea",
      "swarm"
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/content.ts",
      "line": 748,
      "endLine": 748
    }
  },
  {
    "id": "parameter:content:UNSOLD_PENALTIES",
    "module": "content",
    "name": "UNSOLD_PENALTIES",
    "value": {
      "orc": {
        "credits": 3,
        "energy": 0,
        "statuses": [],
        "life": 0,
        "text": "ออร์กเสียหน้า ยึดเครดิต 3 เท่าที่มี"
      },
      "vampire": {
        "credits": 0,
        "energy": 1,
        "statuses": [
          "D10"
        ],
        "life": 0,
        "text": "Vampire ดูดพลัง 1 และทิ้งความกระหายโลหิต"
      },
      "autometa": {
        "credits": 2,
        "energy": 0,
        "statuses": [
          "D06"
        ],
        "life": 0,
        "text": "Autometa เก็บค่าจัดเก็บ 2 เครดิตเท่าที่มี และให้แบกอุปกรณ์หนัก"
      },
      "alien": {
        "credits": 0,
        "energy": 1,
        "statuses": [
          "D02"
        ],
        "life": 0,
        "text": "Alien ส่งคลื่นสับสน เสียพลัง 1 และรับหมอกราคา"
      },
      "darkone": {
        "credits": 2,
        "energy": 0,
        "statuses": [
          "D03"
        ],
        "life": 1,
        "text": "Dark One ยึดเครดิต 2 เท่าที่มีและประทับตรานักโกง · กติกาชีวิตเสียชีวิต 1"
      },
      "beast": {
        "credits": 0,
        "energy": 1,
        "statuses": [
          "D01"
        ],
        "life": 0,
        "text": "สัตว์นำทางงอน เสียพลัง 1 และรับอ่อนล้า"
      },
      "deepsea": {
        "credits": 1,
        "energy": 1,
        "statuses": [
          "D14"
        ],
        "life": 1,
        "text": "อสูรใต้ทะเลลึกส่งเสียงกล่อมประสาท เสียพลัง 1 ยึดเครดิต 1 เท่าที่มี และรับหมอกวิกลจริต · กติกาชีวิตเสียชีวิต 1"
      },
      "swarm": {
        "credits": 2,
        "energy": 0,
        "statuses": [
          "D11"
        ],
        "life": 0,
        "text": "ฝูงรุมเก็บค่าเสียหาย 2 เครดิตเท่าที่มี และทิ้งพิษฝูงไว้"
      }
    },
    "source": {
      "file": "apps/comic/src/game/appraisal/content.ts",
      "line": 391,
      "endLine": 400
    }
  },
  {
    "id": "parameter:engine:DEFAULT_APPRAISAL_CONFIG",
    "module": "engine",
    "name": "DEFAULT_APPRAISAL_CONFIG",
    "value": {
      "rarityEconomy": {
        "version": 1,
        "tiers": {
          "common": {
            "value": 1,
            "effect": 1
          },
          "uncommon": {
            "value": 2,
            "effect": 2
          },
          "rare": {
            "value": 3,
            "effect": 3
          },
          "epic": {
            "value": 4,
            "effect": 4
          },
          "legendary": {
            "value": 6,
            "effect": 6
          },
          "mythic": {
            "value": 8,
            "effect": 8
          }
        }
      },
      "rarity": {
        "version": 1,
        "rates": {
          "common": 0.6,
          "uncommon": 0.25,
          "rare": 0.1,
          "epic": 0.035,
          "legendary": 0.013,
          "mythic": 0.002
        },
        "themes": {
          "common": [
            {
              "theme": "plain",
              "weight": 1
            }
          ],
          "uncommon": [
            {
              "theme": "inferno",
              "weight": 1
            },
            {
              "theme": "frost",
              "weight": 1
            },
            {
              "theme": "storm",
              "weight": 1
            },
            {
              "theme": "venom",
              "weight": 1
            },
            {
              "theme": "spirit",
              "weight": 1
            },
            {
              "theme": "lunar",
              "weight": 1
            },
            {
              "theme": "solar",
              "weight": 1
            },
            {
              "theme": "void",
              "weight": 1
            },
            {
              "theme": "prism",
              "weight": 1
            },
            {
              "theme": "clockwork",
              "weight": 1
            }
          ],
          "rare": [
            {
              "theme": "inferno",
              "weight": 1
            },
            {
              "theme": "frost",
              "weight": 1
            },
            {
              "theme": "storm",
              "weight": 1
            },
            {
              "theme": "venom",
              "weight": 1
            },
            {
              "theme": "spirit",
              "weight": 1
            },
            {
              "theme": "lunar",
              "weight": 1
            },
            {
              "theme": "solar",
              "weight": 1
            },
            {
              "theme": "void",
              "weight": 1
            },
            {
              "theme": "prism",
              "weight": 1
            },
            {
              "theme": "clockwork",
              "weight": 1
            }
          ],
          "epic": [
            {
              "theme": "inferno",
              "weight": 1
            },
            {
              "theme": "frost",
              "weight": 1
            },
            {
              "theme": "storm",
              "weight": 1
            },
            {
              "theme": "venom",
              "weight": 1
            },
            {
              "theme": "spirit",
              "weight": 1
            },
            {
              "theme": "lunar",
              "weight": 1
            },
            {
              "theme": "solar",
              "weight": 1
            },
            {
              "theme": "void",
              "weight": 1
            },
            {
              "theme": "prism",
              "weight": 1
            },
            {
              "theme": "clockwork",
              "weight": 1
            }
          ],
          "legendary": [
            {
              "theme": "inferno",
              "weight": 1
            },
            {
              "theme": "frost",
              "weight": 1
            },
            {
              "theme": "storm",
              "weight": 1
            },
            {
              "theme": "venom",
              "weight": 1
            },
            {
              "theme": "spirit",
              "weight": 1
            },
            {
              "theme": "lunar",
              "weight": 1
            },
            {
              "theme": "solar",
              "weight": 1
            },
            {
              "theme": "void",
              "weight": 1
            },
            {
              "theme": "prism",
              "weight": 1
            },
            {
              "theme": "clockwork",
              "weight": 1
            }
          ],
          "mythic": [
            {
              "theme": "inferno",
              "weight": 1
            },
            {
              "theme": "frost",
              "weight": 1
            },
            {
              "theme": "storm",
              "weight": 1
            },
            {
              "theme": "venom",
              "weight": 1
            },
            {
              "theme": "spirit",
              "weight": 1
            },
            {
              "theme": "lunar",
              "weight": 1
            },
            {
              "theme": "solar",
              "weight": 1
            },
            {
              "theme": "void",
              "weight": 1
            },
            {
              "theme": "prism",
              "weight": 1
            },
            {
              "theme": "clockwork",
              "weight": 1
            }
          ]
        }
      },
      "loanEndSettlement": true,
      "vaultInterestRules": 1,
      "theftTimeoutRules": 1,
      "collectorDeadline": 15,
      "eventChoiceRules": 1,
      "statusLinks": 1,
      "systemLinks": 1,
      "trustAbilities": true,
      "catalogVersion": 3,
      "itemEffects": true,
      "roundRewards": true,
      "multiCoinRewards": true,
      "commerce": true,
      "totalTrustStock": true,
      "curseSight": true,
      "freeBuy": true,
      "freeMerchantAction": true,
      "fakeEffect": true,
      "cleanse": true,
      "wishlist": true,
      "wishContract": true,
      "challenge": true,
      "expansion": true,
      "encounters": 3,
      "startingCredits": 40,
      "maxEnergy": 10,
      "recoveryEnergy": 4,
      "bankReserve": 2000,
      "marketProbability": 1,
      "marketMaxOrders": 3,
      "marketQuota": 1
    },
    "source": {
      "file": "apps/comic/src/game/appraisal/engine.ts",
      "line": 37,
      "endLine": 44
    }
  },
  {
    "id": "parameter:core2-content:CORE2_EVENT_NAMES",
    "module": "core2-content",
    "name": "CORE2_EVENT_NAMES",
    "value": {},
    "source": {
      "file": "apps/comic/src/game/appraisal/core2-content.ts",
      "line": 34,
      "endLine": 34
    }
  },
  {
    "id": "parameter:core2-specs:FALLBACK_BRAND",
    "module": "core2-specs",
    "name": "FALLBACK_BRAND",
    "value": {
      "id": "brand",
      "grant": [
        "D03",
        "D18"
      ]
    },
    "source": {
      "file": "apps/comic/src/game/appraisal/core2-specs.ts",
      "line": 71,
      "endLine": 71
    }
  },
  {
    "id": "parameter:core2:CORE2",
    "module": "core2",
    "name": "CORE2",
    "value": {
      "collectorEncounter": 15,
      "decayEvery": 7,
      "decayCap": 3,
      "dread": {
        "base": 0.08,
        "step": 0.03,
        "cap": 0.6
      },
      "overvalue": {
        "ratio": 2,
        "base": 0.5,
        "step": 0.25,
        "cap": 0.95
      },
      "scrap": {
        "need": 2,
        "energy": 3,
        "cap": 2
      },
      "consign": {
        "percent": 80,
        "fee": 3,
        "cleanBelow": 0.3,
        "debuffBelow": 0.7,
        "extraFee": 4
      },
      "restorativePremium": 7,
      "recoveryStep": 4,
      "reroll": {
        "energy": 2,
        "step": 1
      },
      "steal": {
        "energy": 1,
        "base": 0.5,
        "perTrust": 0.03,
        "friend": -0.15
      },
      "barter": {
        "energy": 1,
        "detect": 0.35
      },
      "skill": {
        "trust": 3,
        "strong": 6
      }
    },
    "source": {
      "file": "apps/comic/src/game/appraisal/core2.ts",
      "line": 12,
      "endLine": 36
    }
  },
  {
    "id": "parameter:core2:ENERGY_DEAL_CREDITS2",
    "module": "core2",
    "name": "ENERGY_DEAL_CREDITS2",
    "value": 3,
    "source": {
      "file": "apps/comic/src/game/appraisal/core2.ts",
      "line": 74,
      "endLine": 74
    }
  },
  {
    "id": "parameter:core2-events:CORE2_BACKLASH_IDS",
    "module": "core2-events",
    "name": "CORE2_BACKLASH_IDS",
    "value": [
      "E120",
      "E121",
      "E122"
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/core2-events.ts",
      "line": 14,
      "endLine": 14
    }
  },
  {
    "id": "parameter:core2-events:CORE2_DRAW_IDS",
    "module": "core2-events",
    "name": "CORE2_DRAW_IDS",
    "value": [
      "E117",
      "E118",
      "E119",
      "E125",
      "E126",
      "E127",
      "E128",
      "E129"
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/core2-events.ts",
      "line": 13,
      "endLine": 13
    }
  },
  {
    "id": "parameter:core2-events:FALLBACK_BRAND",
    "module": "core2-events",
    "name": "FALLBACK_BRAND",
    "value": {
      "id": "brand",
      "grant": [
        "D03",
        "D18"
      ]
    },
    "source": {
      "file": "apps/comic/src/game/appraisal/core2-specs.ts",
      "line": 71,
      "endLine": 71
    }
  },
  {
    "id": "parameter:pulse:ENERGY_DEAL_NPCS",
    "module": "pulse",
    "name": "ENERGY_DEAL_NPCS",
    "value": [
      "vampire",
      "autometa",
      "alien",
      "swarm"
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/pulse.ts",
      "line": 9,
      "endLine": 9
    }
  },
  {
    "id": "parameter:pulse:PULSE_RULES",
    "module": "pulse",
    "name": "PULSE_RULES",
    "value": {
      "shardsPerLife": 3,
      "shardsPerSale": 1,
      "shardsWhenWary": 0,
      "waryAfter": 3,
      "bankCap": 5
    },
    "source": {
      "file": "apps/comic/src/game/appraisal/pulse.ts",
      "line": 5,
      "endLine": 5
    }
  },
  {
    "id": "parameter:pulse:STOCK_RULES",
    "module": "pulse",
    "name": "STOCK_RULES",
    "value": {
      "trustPerItem": 3,
      "minTrust": 1,
      "extra": 1
    },
    "source": {
      "file": "apps/comic/src/game/appraisal/pulse.ts",
      "line": 23,
      "endLine": 23
    }
  },
  {
    "id": "parameter:pulse:TRUST_RULES",
    "module": "pulse",
    "name": "TRUST_RULES",
    "value": {
      "caughtLoss": 1,
      "repeatBuys": 3,
      "repeatBuyTrust": 1,
      "ticketsToForce": 3
    },
    "source": {
      "file": "apps/comic/src/game/appraisal/pulse.ts",
      "line": 7,
      "endLine": 7
    }
  },
  {
    "id": "parameter:survival:BROKERAGE_RULES",
    "module": "survival",
    "name": "BROKERAGE_RULES",
    "value": {
      "auctionProbability": 0.5,
      "maxLots": 2,
      "bondProbability": 0.65
    },
    "source": {
      "file": "apps/comic/src/game/appraisal/survival.ts",
      "line": 13,
      "endLine": 13
    }
  },
  {
    "id": "parameter:survival:SURVIVAL_RULES",
    "module": "survival",
    "name": "SURVIVAL_RULES",
    "value": {
      "maxLife": 6,
      "encounterLifeCost": 1,
      "entryEnergyCost": 0
    },
    "source": {
      "file": "apps/comic/src/game/appraisal/survival.ts",
      "line": 11,
      "endLine": 11
    }
  },
  {
    "id": "parameter:wishlist-rules:WISH_BASE_CHANCE",
    "module": "wishlist-rules",
    "name": "WISH_BASE_CHANCE",
    "value": 85,
    "source": {
      "file": "apps/comic/src/game/appraisal/wishlist-rules.ts",
      "line": 10,
      "endLine": 10
    }
  },
  {
    "id": "parameter:wishlist-rules:WISH_CAP",
    "module": "wishlist-rules",
    "name": "WISH_CAP",
    "value": 95,
    "source": {
      "file": "apps/comic/src/game/appraisal/wishlist-rules.ts",
      "line": 14,
      "endLine": 14
    }
  },
  {
    "id": "parameter:wishlist-rules:WISH_DECAY_SHARE",
    "module": "wishlist-rules",
    "name": "WISH_DECAY_SHARE",
    "value": 0.2,
    "source": {
      "file": "apps/comic/src/game/appraisal/wishlist-rules.ts",
      "line": 27,
      "endLine": 27
    }
  },
  {
    "id": "parameter:wishlist-rules:WISH_ENERGY",
    "module": "wishlist-rules",
    "name": "WISH_ENERGY",
    "value": 2,
    "source": {
      "file": "apps/comic/src/game/appraisal/wishlist-rules.ts",
      "line": 24,
      "endLine": 24
    }
  },
  {
    "id": "parameter:wishlist-rules:WISH_FLOOR",
    "module": "wishlist-rules",
    "name": "WISH_FLOOR",
    "value": 5,
    "source": {
      "file": "apps/comic/src/game/appraisal/wishlist-rules.ts",
      "line": 15,
      "endLine": 15
    }
  },
  {
    "id": "parameter:wishlist-rules:WISH_MARKUPS",
    "module": "wishlist-rules",
    "name": "WISH_MARKUPS",
    "value": [
      0,
      10,
      20,
      30,
      40
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/wishlist-rules.ts",
      "line": 9,
      "endLine": 9
    }
  },
  {
    "id": "parameter:wishlist-rules:WISH_MARKUP_PENALTY",
    "module": "wishlist-rules",
    "name": "WISH_MARKUP_PENALTY",
    "value": 0.7,
    "source": {
      "file": "apps/comic/src/game/appraisal/wishlist-rules.ts",
      "line": 11,
      "endLine": 11
    }
  },
  {
    "id": "parameter:wishlist-rules:WISH_MAX_ACTIVE",
    "module": "wishlist-rules",
    "name": "WISH_MAX_ACTIVE",
    "value": 2,
    "source": {
      "file": "apps/comic/src/game/appraisal/wishlist-rules.ts",
      "line": 25,
      "endLine": 25
    }
  },
  {
    "id": "parameter:wishlist-rules:WISH_PREMIUM",
    "module": "wishlist-rules",
    "name": "WISH_PREMIUM",
    "value": 1.6,
    "source": {
      "file": "apps/comic/src/game/appraisal/wishlist-rules.ts",
      "line": 5,
      "endLine": 5
    }
  },
  {
    "id": "parameter:wishlist-rules:WISH_PROBABILITY",
    "module": "wishlist-rules",
    "name": "WISH_PROBABILITY",
    "value": 0.6,
    "source": {
      "file": "apps/comic/src/game/appraisal/wishlist-rules.ts",
      "line": 7,
      "endLine": 7
    }
  },
  {
    "id": "parameter:wishlist-rules:WISH_STATUS_STEP",
    "module": "wishlist-rules",
    "name": "WISH_STATUS_STEP",
    "value": 4,
    "source": {
      "file": "apps/comic/src/game/appraisal/wishlist-rules.ts",
      "line": 13,
      "endLine": 13
    }
  },
  {
    "id": "parameter:wishlist-rules:WISH_TRUST_BONUS",
    "module": "wishlist-rules",
    "name": "WISH_TRUST_BONUS",
    "value": 3,
    "source": {
      "file": "apps/comic/src/game/appraisal/wishlist-rules.ts",
      "line": 12,
      "endLine": 12
    }
  },
  {
    "id": "parameter:cleanse-rules:CLEANSE_CAP",
    "module": "cleanse-rules",
    "name": "CLEANSE_CAP",
    "value": 95,
    "source": {
      "file": "apps/comic/src/game/appraisal/cleanse-rules.ts",
      "line": 22,
      "endLine": 22
    }
  },
  {
    "id": "parameter:cleanse-rules:CLEANSE_RULES",
    "module": "cleanse-rules",
    "name": "CLEANSE_RULES",
    "value": {
      "orc": {
        "price": [
          1,
          1.4
        ],
        "chance": 50
      },
      "vampire": {
        "price": [
          0.9,
          1.5
        ],
        "chance": 55
      },
      "autometa": {
        "price": [
          0.8,
          1
        ],
        "chance": 60
      },
      "alien": {
        "price": [
          0.7,
          1.6
        ],
        "chance": 45
      },
      "darkone": {
        "price": [
          1.2,
          2
        ],
        "chance": 65
      },
      "beast": {
        "price": [
          0.6,
          1
        ],
        "chance": 40
      },
      "deepsea": {
        "price": [
          1.1,
          1.8
        ],
        "chance": 50
      },
      "swarm": {
        "price": [
          0.5,
          0.9
        ],
        "chance": 55
      }
    },
    "source": {
      "file": "apps/comic/src/game/appraisal/cleanse-rules.ts",
      "line": 12,
      "endLine": 21
    }
  },
  {
    "id": "parameter:cleanse-rules:CLEANSE_TOOLS",
    "module": "cleanse-rules",
    "name": "CLEANSE_TOOLS",
    "value": {
      "smith-hammer": {
        "bonus": 10,
        "consumed": false,
        "text": "ถือไว้ โอกาสล้างคำสาปสำเร็จ +10 จุดเปอร์เซ็นต์ต่อชิ้น (ซ้อนได้)"
      },
      "whetstone": {
        "bonus": 20,
        "consumed": true,
        "text": "เลือกใช้ตอนล้างคำสาป โอกาสสำเร็จ +20 จุดเปอร์เซ็นต์ ใช้แล้วหมดไป"
      }
    },
    "source": {
      "file": "apps/comic/src/game/appraisal/cleanse-rules.ts",
      "line": 5,
      "endLine": 8
    }
  },
  {
    "id": "parameter:cleanse-rules:CLEANSE_TRUST_CHANCE",
    "module": "cleanse-rules",
    "name": "CLEANSE_TRUST_CHANCE",
    "value": 2,
    "source": {
      "file": "apps/comic/src/game/appraisal/cleanse-rules.ts",
      "line": 24,
      "endLine": 24
    }
  },
  {
    "id": "parameter:cleanse-rules:CLEANSE_TRUST_PRICE",
    "module": "cleanse-rules",
    "name": "CLEANSE_TRUST_PRICE",
    "value": 3,
    "source": {
      "file": "apps/comic/src/game/appraisal/cleanse-rules.ts",
      "line": 23,
      "endLine": 23
    }
  },
  {
    "id": "parameter:challenge-rules:CHALLENGE_CAP",
    "module": "challenge-rules",
    "name": "CHALLENGE_CAP",
    "value": 90,
    "source": {
      "file": "apps/comic/src/game/appraisal/challenge-rules.ts",
      "line": 5,
      "endLine": 5
    }
  },
  {
    "id": "parameter:challenge-rules:CHALLENGE_LENS_BONUS",
    "module": "challenge-rules",
    "name": "CHALLENGE_LENS_BONUS",
    "value": 10,
    "source": {
      "file": "apps/comic/src/game/appraisal/challenge-rules.ts",
      "line": 4,
      "endLine": 4
    }
  },
  {
    "id": "parameter:challenge-rules:CHALLENGE_PCT",
    "module": "challenge-rules",
    "name": "CHALLENGE_PCT",
    "value": 50,
    "source": {
      "file": "apps/comic/src/game/appraisal/challenge-rules.ts",
      "line": 2,
      "endLine": 2
    }
  },
  {
    "id": "parameter:challenge-rules:CHALLENGE_TOOLS",
    "module": "challenge-rules",
    "name": "CHALLENGE_TOOLS",
    "value": {
      "doubt-lens": {
        "text": "ถือไว้ ท้าทายถูกแล้วลดราคาเพิ่ม +10 จุดเปอร์เซ็นต์ต่อชิ้น (สูงสุด 90%)"
      },
      "void-seal": {
        "text": "แนบกับการท้าทาย ถ้าท้าทายผิด ค่าปรับเป็นโมฆะ ใช้แล้วหมดไปเฉพาะเมื่อมีผลยกเลิก"
      }
    },
    "source": {
      "file": "apps/comic/src/game/appraisal/challenge-rules.ts",
      "line": 14,
      "endLine": 17
    }
  },
  {
    "id": "parameter:challenge-rules:CLAIM_KEYS",
    "module": "challenge-rules",
    "name": "CLAIM_KEYS",
    "value": [
      "genuine",
      "cursed"
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/challenge-rules.ts",
      "line": 8,
      "endLine": 8
    }
  },
  {
    "id": "parameter:scoring:FAKE_EFFECT_CHANCE",
    "module": "scoring",
    "name": "FAKE_EFFECT_CHANCE",
    "value": 0.4,
    "source": {
      "file": "apps/comic/src/game/appraisal/scoring.ts",
      "line": 13,
      "endLine": 13
    }
  },
  {
    "id": "parameter:scoring:PROVENANCE_PERCENT",
    "module": "scoring",
    "name": "PROVENANCE_PERCENT",
    "value": 15,
    "source": {
      "file": "apps/comic/src/game/appraisal/scoring.ts",
      "line": 7,
      "endLine": 7
    }
  },
  {
    "id": "parameter:theft:PVP_COMPENSATION_INSTALLMENTS",
    "module": "theft",
    "name": "PVP_COMPENSATION_INSTALLMENTS",
    "value": 4,
    "source": {
      "file": "apps/comic/src/game/appraisal/theft.ts",
      "line": 84,
      "endLine": 84
    }
  },
  {
    "id": "parameter:theft:PVP_COMPENSATION_PERCENT",
    "module": "theft",
    "name": "PVP_COMPENSATION_PERCENT",
    "value": 5,
    "source": {
      "file": "apps/comic/src/game/appraisal/theft.ts",
      "line": 83,
      "endLine": 83
    }
  },
  {
    "id": "parameter:secure-storage:VAULT_INTEREST_PERCENT",
    "module": "secure-storage",
    "name": "VAULT_INTEREST_PERCENT",
    "value": 10,
    "source": {
      "file": "apps/comic/src/game/appraisal/secure-storage.ts",
      "line": 7,
      "endLine": 7
    }
  },
  {
    "id": "parameter:seals:REDEMPTION_CHOICES",
    "module": "seals",
    "name": "REDEMPTION_CHOICES",
    "value": 3,
    "source": {
      "file": "apps/comic/src/game/appraisal/seals.ts",
      "line": 9,
      "endLine": 9
    }
  },
  {
    "id": "parameter:seals:SEALS_PER_REDEMPTION",
    "module": "seals",
    "name": "SEALS_PER_REDEMPTION",
    "value": 2,
    "source": {
      "file": "apps/comic/src/game/appraisal/seals.ts",
      "line": 8,
      "endLine": 8
    }
  },
  {
    "id": "parameter:market-contracts:TRUST_CAP",
    "module": "market-contracts",
    "name": "TRUST_CAP",
    "value": 10,
    "source": {
      "file": "apps/comic/src/game/appraisal/market-contracts.ts",
      "line": 3,
      "endLine": 3
    }
  },
  {
    "id": "parameter:types:BOON_EVENT_ID",
    "module": "types",
    "name": "BOON_EVENT_ID",
    "value": "E108",
    "source": {
      "file": "apps/comic/src/game/appraisal/types.ts",
      "line": 15,
      "endLine": 15
    }
  },
  {
    "id": "parameter:types:PILOT_ITEM_IDS",
    "module": "types",
    "name": "PILOT_ITEM_IDS",
    "value": [
      "orc-tusk-shield",
      "vampire-nocturne-signet",
      "autometa-torque-caliper",
      "alien-thought-translator",
      "darkone-crossing-token",
      "deepsea-tide-compass",
      "swarm-brood-hammer",
      "beast-riftfang-sword"
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/types.ts",
      "line": 32,
      "endLine": 32
    }
  },
  {
    "id": "parameter:types:WISH_EVENT_ID",
    "module": "types",
    "name": "WISH_EVENT_ID",
    "value": "E73",
    "source": {
      "file": "apps/comic/src/game/appraisal/types.ts",
      "line": 23,
      "endLine": 23
    }
  },
  {
    "id": "parameter:npc-events:NPC_PERSONAL_EVENT",
    "module": "npc-events",
    "name": "NPC_PERSONAL_EVENT",
    "value": {
      "vampire": "E109",
      "alien": "E110",
      "darkone": "E111",
      "autometa": "E112",
      "orc": "E113",
      "beast": "E114",
      "deepsea": "E115",
      "swarm": "E116"
    },
    "source": {
      "file": "apps/comic/src/game/appraisal/npc-events.ts",
      "line": 10,
      "endLine": 10
    }
  },
  {
    "id": "parameter:passives:HELD_STACK_CAP",
    "module": "passives",
    "name": "HELD_STACK_CAP",
    "value": 5,
    "source": {
      "file": "apps/comic/src/game/appraisal/passives.ts",
      "line": 42,
      "endLine": 42
    }
  },
  {
    "id": "parameter:passives:MAX_ENERGY_CAP",
    "module": "passives",
    "name": "MAX_ENERGY_CAP",
    "value": 20,
    "source": {
      "file": "apps/comic/src/game/appraisal/passives.ts",
      "line": 69,
      "endLine": 69
    }
  },
  {
    "id": "parameter:passives:MAX_LIFE_BONUS_CAP",
    "module": "passives",
    "name": "MAX_LIFE_BONUS_CAP",
    "value": 6,
    "source": {
      "file": "apps/comic/src/game/appraisal/passives.ts",
      "line": 69,
      "endLine": 69
    }
  },
  {
    "id": "parameter:passives:WISH_SLOT_CAP",
    "module": "passives",
    "name": "WISH_SLOT_CAP",
    "value": 4,
    "source": {
      "file": "apps/comic/src/game/appraisal/passives.ts",
      "line": 69,
      "endLine": 69
    }
  },
  {
    "id": "parameter:source:apps/comic/src/game/appraisal/ability-rules.ts:MERCHANT_ABILITIES",
    "module": "apps/comic/src/game/appraisal/ability-rules.ts",
    "name": "MERCHANT_ABILITIES",
    "value": {
      "orc": {
        "name": "ปิดดีล",
        "cooldown": 3,
        "target": "stock",
        "description": "ลดราคาซื้อสินค้า 1 ชิ้น 10/15/20% ตามขั้นความไว้ใจ ใช้กับเครดิตที่จ่ายจริง ไม่ลดค่าธรรมเนียม"
      },
      "autometa": {
        "name": "วิเคราะห์สมบูรณ์",
        "cooldown": 3,
        "target": "stock",
        "description": "เปิดราคาจริง / ราคาและความแท้ / ข้อมูลทั้งหมดของสินค้า 1 ชิ้น ตามขั้นความไว้ใจ"
      },
      "alien": {
        "name": "แลกเปลี่ยนต่างมิติ",
        "cooldown": 4,
        "target": "inventory",
        "description": "แลกของที่ถือเป็นตัวเลือกใหม่ 2/3/4 ชิ้น เลือกได้หนึ่ง มูลค่าคิดคะแนนไม่เกินต้นฉบับ เห็นข้อมูลเท่าที่ตรวจต้นฉบับไว้"
      },
      "vampire": {
        "name": "รักษาร่างต้น",
        "cooldown": 5,
        "target": "consumable",
        "description": "เปิดใช้ของใช้แล้วหมดโดยเก็บไว้ได้หนึ่งครั้งต่อชิ้น ขั้นสูงคืนพลัง 1/2 เพิ่มเติม ใช้กับสำเนาไม่ได้"
      },
      "darkone": {
        "name": "ฉีกพันธสัญญา",
        "cooldown": 4,
        "target": "debuff",
        "description": "ลบ debuff ที่เลือกทันที ขั้นกลางคืนพลัง 1 ขั้นสูงให้เกราะป้องกัน debuff ครั้งถัดไป"
      },
      "deepsea": {
        "name": "ชำระของต้องสาป",
        "cooldown": 4,
        "target": "inventory",
        "description": "ทำให้ของที่เลือกไร้คำสาป แม้ยังไม่ตรวจ ขั้นกลางเปิดความแท้ ขั้นสูงเปิดราคาด้วย ใช้สิทธิ์แม้ของเดิมไร้คำสาป"
      },
      "swarm": {
        "name": "แตกหน่อ",
        "cooldown": 5,
        "target": "inventory",
        "description": "สำเนาหนึ่งชิ้น มูลค่า 25/35/50% ของต้นฉบับ effect เหลือ 40% มีได้ชิ้นเดียวต่อต้นฉบับ สำเนาทำสำเนาต่อไม่ได้ ใช้สำเนาสิ้นเปลืองแล้วต้นฉบับทำซ้ำไม่ได้"
      },
      "beast": {
        "name": "เปลี่ยนสินค้าที่เสนอ",
        "cooldown": 3,
        "target": "stock",
        "description": "เลือกสินค้าที่ยังไม่ซื้อเพื่อรับตัวเลือกใหม่ 2/3/4 ชิ้น แล้วเลือกหนึ่งมาแทน ยังต้องซื้อปกติ เก็บของเดิมเป็นหนึ่งในตัวเลือกได้"
      }
    },
    "source": {
      "file": "apps/comic/src/game/appraisal/ability-rules.ts",
      "line": 3,
      "endLine": 12
    },
    "extraction": "static literal/expression; unresolved expressions are tagged"
  },
  {
    "id": "parameter:source:apps/comic/src/game/appraisal/core2-specs.ts:CORE2_SPECS",
    "module": "apps/comic/src/game/appraisal/core2-specs.ts",
    "name": "CORE2_SPECS",
    "value": {
      "E117": {
        "id": "E117",
        "name": "ด่านเก็บค่าผ่าน",
        "when": "ก่อนเลือกประตู",
        "phase": "PORTALS",
        "description": "ผู้เฝ้าด่านเรียกเก็บค่าผ่านก่อนเปิดประตู ทุกทางมีราคา ไม่มีทางผ่านฟรี",
        "choices": [
          {
            "id": "pay",
            "credits": 2,
            "energy": 1,
            "door": "first"
          },
          {
            "id": "fog",
            "grant": [
              "D02"
            ],
            "door": "second"
          },
          {
            "id": "burden",
            "grant": [
              "D06"
            ],
            "door": "second"
          }
        ]
      },
      "E118": {
        "id": "E118",
        "name": "สัญญาหน้าประตู",
        "when": "ก่อนเลือกประตู",
        "phase": "PORTALS",
        "description": "ประตูแรกรับเครดิตสด ประตูที่สองให้ส่วนลดแต่ผูกเงื่อนไขกับคุณ",
        "choices": [
          {
            "id": "cash",
            "credits": 3,
            "door": "first",
            "deal": "cash"
          },
          {
            "id": "condition",
            "energy": 1,
            "grant": [
              "D08"
            ],
            "door": "second",
            "deal": "condition"
          }
        ]
      },
      "E119": {
        "id": "E119",
        "name": "ผู้เฝ้าประตูทวงหนี้",
        "when": "ก่อนเลือกประตู",
        "phase": "PORTALS",
        "description": "ผู้เฝ้าประตูทวงเครดิตเก่า จ่ายสดตอนนี้ ติดดอกเบี้ย หรือยอมเสียแรงเปลี่ยนทาง",
        "choices": [
          {
            "id": "pay",
            "credits": 3,
            "door": "first"
          },
          {
            "id": "interest",
            "grant": [
              "D04"
            ],
            "door": "first"
          },
          {
            "id": "switch",
            "energy": 2,
            "door": "second"
          }
        ]
      },
      "E120": {
        "id": "E120",
        "name": "ผู้ตรวจสอบสงสัย",
        "when": "หลังประเมินราคาสูงเกินจริง",
        "phase": "APPRAISAL",
        "consequence": true,
        "description": "ราคาที่คุณตั้งสูงเกินหน้าร้านมาก ผู้ตรวจสอบเรียกค่าอธิบาย จ่ายด้วยอะไรก็ได้ที่คุณมี",
        "choices": [
          {
            "id": "pay",
            "credits": 3
          },
          {
            "id": "energy",
            "energy": 2
          },
          {
            "id": "item",
            "lose": true
          }
        ]
      },
      "E121": {
        "id": "E121",
        "name": "พ่อค้าตะคอก",
        "when": "หลังประเมินราคาสูงเกินจริง",
        "phase": "APPRAISAL",
        "consequence": true,
        "description": "พ่อค้ารู้ว่าคุณโกหกเรื่องราคา เขาเรียกค่าปรับหรือบังคับให้คุณรับภาษีแฝง",
        "choices": [
          {
            "id": "pay",
            "credits": 4
          },
          {
            "id": "tax",
            "grant": [
              "D18",
              "D12"
            ]
          },
          {
            "id": "blood",
            "life": 1
          }
        ]
      },
      "E122": {
        "id": "E122",
        "name": "ศาลเงาพิพากษา",
        "when": "หลังประเมินราคาสูงเกินจริง",
        "phase": "APPRAISAL",
        "consequence": true,
        "description": "ศาลเงาตัดสินความโลภ ค่าปรับหนักที่สุด แต่คุณเลือกได้ว่าจะจ่ายด้วยอะไร",
        "choices": [
          {
            "id": "pay",
            "credits": 6
          },
          {
            "id": "item",
            "lose": true
          },
          {
            "id": "blood",
            "life": 2
          },
          {
            "id": "energy",
            "energy": 3
          }
        ]
      },
      "E123": {
        "id": "E123",
        "name": "ถูกจับตอนฉกของ",
        "when": "หลังขโมยหรือหลอกแลกของล้มเหลว",
        "phase": "APPRAISAL",
        "consequence": true,
        "description": "ยามเงาจับมือคุณได้ ค่าปรับหนัก จ่ายตามที่เหลือ หรือยอมรับตราขโมย",
        "choices": [
          {
            "id": "pay",
            "credits": 5
          },
          {
            "id": "energy",
            "energy": 3
          },
          {
            "id": "item",
            "lose": true
          },
          {
            "id": "blood",
            "life": 1
          }
        ]
      },
      "E124": {
        "id": "E124",
        "name": "มือล้วงถูกจับ",
        "when": "หลังล้วงกระเป๋าเพื่อนล้มเหลว",
        "phase": "APPRAISAL",
        "consequence": true,
        "description": "เหยื่อจับข้อมือคุณได้ ค่าชดเชยจ่ายให้เหยื่อโดยตรง",
        "choices": [
          {
            "id": "pay",
            "credits": 4,
            "toVictim": true
          },
          {
            "id": "energy",
            "energy": 3
          },
          {
            "id": "item",
            "lose": true
          },
          {
            "id": "blood",
            "life": 1
          }
        ]
      },
      "E125": {
        "id": "E125",
        "name": "ข่าวลือจากพ่อค้าเร่",
        "when": "ระหว่างประเมิน",
        "phase": "APPRAISAL",
        "description": "พ่อค้าเร่ขายข่าวลือเรื่องราคา ซื้อด้วยเครดิตหรือแลกด้วยแรงเดินตามหา",
        "choices": [
          {
            "id": "pay",
            "credits": 2,
            "grant": [
              "B01"
            ]
          },
          {
            "id": "walk",
            "energy": 1,
            "grant": [
              "B02"
            ]
          },
          {
            "id": "decline"
          }
        ]
      },
      "E126": {
        "id": "E126",
        "name": "ยาหม้อเถื่อน",
        "when": "ระหว่างประเมิน",
        "phase": "APPRAISAL",
        "description": "ยาจากหม้อต้มข้างทางฟื้นกำลังได้จริง แต่ผลข้างเคียงติดตัวไปถึงช่วงหน้า",
        "choices": [
          {
            "id": "drink",
            "credits": 3,
            "heal": 1,
            "grant": [
              "D11"
            ]
          },
          {
            "id": "decline"
          }
        ]
      },
      "E127": {
        "id": "E127",
        "name": "เจ้าหนี้เงา",
        "when": "ระหว่างประเมิน",
        "phase": "APPRAISAL",
        "description": "เจ้าหนี้เงายื่นเครดิตให้ทันที แลกกับดอกเบี้ยและภาษีแฝงที่ตามมา",
        "choices": [
          {
            "id": "borrow",
            "reward": 5,
            "grant": [
              "D04",
              "D18"
            ]
          },
          {
            "id": "decline"
          }
        ]
      },
      "E128": {
        "id": "E128",
        "name": "พิธีสละของ",
        "when": "ระหว่างประเมิน",
        "phase": "APPRAISAL",
        "description": "ผู้ประกอบพิธีรับของเซ่นหนึ่งชิ้นแล้วให้เกราะคุ้มภัยเป็นการตอบแทน",
        "choices": [
          {
            "id": "offer",
            "lose": true,
            "grant": [
              "B06",
              "B19"
            ]
          },
          {
            "id": "decline"
          }
        ]
      },
      "E129": {
        "id": "E129",
        "name": "เงาสะท้อนผู้ประเมิน",
        "when": "ระหว่างประเมิน",
        "phase": "APPRAISAL",
        "description": "เงาของคุณเสนอให้ประเมินได้ปลอดภัยขึ้น หรือรับตรานักโกงแลกเสียงกระซิบ",
        "choices": [
          {
            "id": "steady",
            "energy": 1,
            "grant": [
              "B04"
            ]
          },
          {
            "id": "whisper",
            "grant": [
              "D03",
              "B12"
            ]
          },
          {
            "id": "decline"
          }
        ]
      }
    },
    "source": {
      "file": "apps/comic/src/game/appraisal/core2-specs.ts",
      "line": 19,
      "endLine": 46
    },
    "extraction": "static literal/expression; unresolved expressions are tagged"
  },
  {
    "id": "parameter:source:apps/comic/src/game/appraisal/core2-specs.ts:CORE2_CHOICES_V2",
    "module": "apps/comic/src/game/appraisal/core2-specs.ts",
    "name": "CORE2_CHOICES_V2",
    "value": {
      "E119": [
        {
          "id": "pay",
          "credits": 2,
          "door": "first"
        },
        {
          "id": "interest",
          "credits": 1,
          "grant": [
            "D04"
          ],
          "door": "first"
        },
        {
          "id": "switch",
          "energy": 2,
          "door": "second"
        }
      ],
      "E121": [
        {
          "id": "pay",
          "credits": 3
        },
        {
          "id": "tax",
          "grant": [
            "D18",
            "D12"
          ]
        },
        {
          "id": "blood",
          "life": 1
        }
      ],
      "E127": [
        {
          "id": "borrow",
          "reward": 3,
          "grant": [
            "D04",
            "D18"
          ]
        },
        {
          "id": "decline"
        }
      ]
    },
    "source": {
      "file": "apps/comic/src/game/appraisal/core2-specs.ts",
      "line": 51,
      "endLine": 55
    },
    "extraction": "static literal/expression; unresolved expressions are tagged"
  },
  {
    "id": "parameter:source:apps/comic/src/game/appraisal/core2-specs.ts:CORE2_CHOICES_LINKED",
    "module": "apps/comic/src/game/appraisal/core2-specs.ts",
    "name": "CORE2_CHOICES_LINKED",
    "value": {
      "E120": [
        {
          "id": "pay",
          "credits": 3
        },
        {
          "id": "energy",
          "energy": 2
        },
        {
          "id": "item",
          "lose": true
        },
        {
          "id": "pouch",
          "grant": [
            "D22",
            "D24"
          ]
        }
      ],
      "E126": [
        {
          "id": "drink",
          "credits": 3,
          "gamble": {
            "chance": 0.6,
            "win": [
              "B24"
            ],
            "lose": [
              "D23"
            ]
          }
        },
        {
          "id": "calm",
          "energy": 1,
          "grant": [
            "B23"
          ]
        },
        {
          "id": "decline"
        }
      ],
      "E128": [
        {
          "id": "offer",
          "lose": true,
          "grant": [
            "B06",
            "B19"
          ]
        },
        {
          "id": "ward",
          "credits": 2,
          "grant": [
            "B21"
          ]
        },
        {
          "id": "decline"
        }
      ],
      "E129": [
        {
          "id": "steady",
          "energy": 1,
          "grant": [
            "B04"
          ]
        },
        {
          "id": "whisper",
          "grant": [
            "D24",
            "B12"
          ]
        },
        {
          "id": "decline"
        }
      ]
    },
    "source": {
      "file": "apps/comic/src/game/appraisal/core2-specs.ts",
      "line": 61,
      "endLine": 66
    },
    "extraction": "static literal/expression; unresolved expressions are tagged"
  },
  {
    "id": "parameter:source:apps/comic/src/game/appraisal/core2.ts:LIFE_DEALS2",
    "module": "apps/comic/src/game/appraisal/core2.ts",
    "name": "LIFE_DEALS2",
    "value": [
      {
        "$expression": "undefined"
      },
      {
        "credits": 3,
        "min": 0,
        "max": 1
      },
      {
        "credits": 4,
        "min": 1,
        "max": 2
      },
      {
        "credits": 6,
        "min": 1,
        "max": 3
      }
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/core2.ts",
      "line": 72,
      "endLine": 72
    },
    "extraction": "static literal/expression; unresolved expressions are tagged"
  },
  {
    "id": "parameter:source:apps/comic/src/game/appraisal/engine.ts:MARKET_BANK_SHARE",
    "module": "apps/comic/src/game/appraisal/engine.ts",
    "name": "MARKET_BANK_SHARE",
    "value": 0.5,
    "source": {
      "file": "apps/comic/src/game/appraisal/engine.ts",
      "line": 172,
      "endLine": 172
    },
    "extraction": "static literal/expression; unresolved expressions are tagged"
  },
  {
    "id": "parameter:source:apps/comic/src/game/appraisal/pulse.ts:LIFE_DEALS",
    "module": "apps/comic/src/game/appraisal/pulse.ts",
    "name": "LIFE_DEALS",
    "value": [
      {
        "$expression": "undefined"
      },
      {
        "credits": 3,
        "min": 0,
        "max": 1
      },
      {
        "credits": 5,
        "min": 1,
        "max": 2
      },
      {
        "credits": 7,
        "min": 2,
        "max": 3
      }
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/pulse.ts",
      "line": 11,
      "endLine": 11
    },
    "extraction": "static literal/expression; unresolved expressions are tagged"
  },
  {
    "id": "parameter:source:apps/comic/src/game/appraisal/remaining48-catalog.ts:REMAINING48_RULES",
    "module": "apps/comic/src/game/appraisal/remaining48-catalog.ts",
    "name": "REMAINING48_RULES",
    "value": {
      "E28": {
        "trust": 1,
        "perMerchantPerRun": 1,
        "familyCap": 2
      },
      "E61": {
        "energy": 1,
        "familyCap": 2
      },
      "E63": {
        "discountCredits": 1,
        "familyCap": 2,
        "minimumPrice": 1
      },
      "E16": {
        "energy": 1,
        "familyCap": 2,
        "perEncounter": 1
      },
      "E13": {
        "bonusBps": 1000,
        "perSettlementCap": 2,
        "perRunCap": 8
      },
      "E07": {
        "bonusBps": 1000,
        "familyCapBps": 2000,
        "chanceMax": 95
      },
      "E42": {
        "refundBps": 2000,
        "perLossCap": 4,
        "perRunCap": 6
      },
      "E58": {
        "lifeDiscount": 1,
        "minimumLifePayment": 1,
        "binary": true
      },
      "E11": {
        "bonusBps": 200,
        "familyCapBps": 600,
        "chanceMax": 95
      },
      "E06": {
        "penaltyDiscountBps": 2500,
        "familyCapBps": 5000,
        "perEncounter": 1
      },
      "E22": {
        "rebateBps": 500,
        "perWinCap": 3,
        "perRunCap": 6
      },
      "E38": {
        "tieRights": 1,
        "binary": true,
        "perEncounter": 1
      },
      "E05": {
        "bonusBps": 500,
        "familyCapBps": 1500,
        "discountMaxBps": 9000
      },
      "E40": {
        "trustLossReduction": 1,
        "minimumTrustLoss": 1,
        "binary": true,
        "perEncounter": 1
      },
      "E02": {
        "narrowBps": 2000,
        "familyCapBps": 5000
      },
      "E31": {
        "cooldownReduction": 1,
        "familyCap": 2,
        "perEncounter": 1
      },
      "E35": {
        "extraKinds": 1,
        "binary": true,
        "perEncounter": 1
      },
      "E67": {
        "riskReductionBps": 1000,
        "familyCapBps": 2000
      },
      "E72": {
        "extraEncounters": 1,
        "binary": true,
        "perStatusInstance": 1,
        "perEncounter": 1
      },
      "E25": {
        "promotionChanceBps": 500,
        "familyCapBps": 1500,
        "maxTierSteps": 1
      },
      "E57": {
        "freeChanges": 1,
        "binary": true,
        "perEncounter": 1
      },
      "E71": {
        "removedInstances": 1,
        "binary": true,
        "perEncounter": 2
      },
      "E69": {
        "assetBonusBps": 200,
        "familyCapBps": 1000,
        "scoreCap": 20
      },
      "E49": {
        "refundBps": 500,
        "perLoanCap": 2,
        "perRunCap": 4
      },
      "E53": {
        "freeFacets": 1,
        "binary": true,
        "perEncounter": 1
      },
      "E62": {
        "damageReduction": 1,
        "familyCap": 2,
        "perEncounter": 1
      },
      "E46": {
        "bonusBps": 100,
        "sharedBonusCapBps": 400
      },
      "E33": {
        "copyValueBonusPoints": 5,
        "familyCapPoints": 10
      },
      "E52": {
        "energy": 1,
        "familyCap": 2,
        "perEncounter": 1
      },
      "E34": {
        "energyDiscount": 1,
        "sharedDiscountCap": 2,
        "minimumEnergyCost": 1
      },
      "E59": {
        "bonusCreditsPerReturnedItem": 1,
        "perContractCap": 3,
        "perRunCap": 6
      },
      "E32": {
        "extraChoices": 1,
        "familyCap": 2
      },
      "E36": {
        "openedPortals": 1,
        "binary": true,
        "perEncounter": 1
      },
      "E68": {
        "rotProtection": 1,
        "binary": true,
        "perEncounter": 1
      },
      "E37": {
        "energyDiscount": 1,
        "familyCap": 1,
        "minimumEnergyCost": 1
      }
    },
    "source": {
      "file": "apps/comic/src/game/appraisal/remaining48-catalog.ts",
      "line": 678,
      "endLine": 850
    },
    "extraction": "static literal/expression; unresolved expressions are tagged"
  },
  {
    "id": "parameter:source:apps/comic/src/game/appraisal/theft.ts:PVP_COOLDOWN_ENCOUNTERS",
    "module": "apps/comic/src/game/appraisal/theft.ts",
    "name": "PVP_COOLDOWN_ENCOUNTERS",
    "value": 2,
    "source": {
      "file": "apps/comic/src/game/appraisal/theft.ts",
      "line": 82,
      "endLine": 82
    },
    "extraction": "static literal/expression; unresolved expressions are tagged"
  },
  {
    "id": "parameter:source:apps/comic/src/shared/item-rarity.ts:HUES",
    "module": "apps/comic/src/shared/item-rarity.ts",
    "name": "HUES",
    "value": {
      "plain": [
        [
          35,
          42
        ]
      ],
      "inferno": [
        [
          12,
          43
        ],
        [
          355,
          24
        ],
        [
          280,
          325
        ],
        [
          195,
          240
        ]
      ],
      "frost": [
        [
          185,
          215
        ],
        [
          205,
          265
        ],
        [
          160,
          195
        ]
      ],
      "storm": [
        [
          210,
          280
        ],
        [
          270,
          330
        ],
        [
          45,
          205
        ]
      ],
      "venom": [
        [
          90,
          140
        ],
        [
          125,
          180
        ],
        [
          275,
          125
        ]
      ],
      "spirit": [
        [
          150,
          190
        ],
        [
          175,
          230
        ],
        [
          260,
          300
        ]
      ],
      "lunar": [
        [
          220,
          265
        ],
        [
          190,
          230
        ],
        [
          270,
          320
        ]
      ],
      "solar": [
        [
          30,
          55
        ],
        [
          5,
          40
        ],
        [
          45,
          80
        ]
      ],
      "void": [
        [
          270,
          320
        ],
        [
          225,
          280
        ],
        [
          320,
          190
        ]
      ],
      "prism": [
        [
          0,
          180
        ],
        [
          90,
          270
        ],
        [
          210,
          30
        ]
      ],
      "clockwork": [
        [
          25,
          50
        ],
        [
          165,
          40
        ],
        [
          5,
          185
        ]
      ]
    },
    "source": {
      "file": "apps/comic/src/shared/item-rarity.ts",
      "line": 64,
      "endLine": 69
    },
    "extraction": "static literal/expression; unresolved expressions are tagged"
  },
  {
    "id": "parameter:source:apps/comic/src/shared/rarity-power.ts:MAX_RARITY_MULTIPLIER",
    "module": "apps/comic/src/shared/rarity-power.ts",
    "name": "MAX_RARITY_MULTIPLIER",
    "value": 8,
    "source": {
      "file": "apps/comic/src/shared/rarity-power.ts",
      "line": 8,
      "endLine": 8
    },
    "extraction": "static literal/expression; unresolved expressions are tagged"
  },
  {
    "id": "parameter:source:apps/comic/src/server/appraisal-rooms.ts:APPRAISAL_PHASE_MS",
    "module": "apps/comic/src/server/appraisal-rooms.ts",
    "name": "APPRAISAL_PHASE_MS",
    "value": {
      "PORTALS": 30000,
      "APPRAISAL": 90000,
      "TRADE": 45000,
      "REVEAL": 30000
    },
    "source": {
      "file": "apps/comic/src/server/appraisal-rooms.ts",
      "line": 14,
      "endLine": 16
    },
    "extraction": "static literal/expression; unresolved expressions are tagged"
  },
  {
    "id": "parameter:source:apps/comic/src/server/appraisal-rooms.ts:BOT_RETIRE_ENCOUNTER",
    "module": "apps/comic/src/server/appraisal-rooms.ts",
    "name": "BOT_RETIRE_ENCOUNTER",
    "value": 12,
    "source": {
      "file": "apps/comic/src/server/appraisal-rooms.ts",
      "line": 18,
      "endLine": 18
    },
    "extraction": "static literal/expression; unresolved expressions are tagged"
  },
  {
    "id": "parameter:source:apps/comic/src/server/appraisal-rooms.ts:APPRAISAL_DUEL_MS",
    "module": "apps/comic/src/server/appraisal-rooms.ts",
    "name": "APPRAISAL_DUEL_MS",
    "value": 30000,
    "source": {
      "file": "apps/comic/src/server/appraisal-rooms.ts",
      "line": 20,
      "endLine": 20
    },
    "extraction": "static literal/expression; unresolved expressions are tagged"
  },
  {
    "id": "parameter:source:apps/comic/src/simulation/appraisal.ts:BUY_MARGIN",
    "module": "apps/comic/src/simulation/appraisal.ts",
    "name": "BUY_MARGIN",
    "value": {
      "aggressive": -3,
      "trader": 0,
      "collector": 2,
      "cautious": 5
    },
    "source": {
      "file": "apps/comic/src/simulation/appraisal.ts",
      "line": 65,
      "endLine": 65
    },
    "extraction": "static literal/expression; unresolved expressions are tagged"
  },
  {
    "id": "parameter:source:apps/comic/src/simulation/appraisal.ts:SELL_FLOOR",
    "module": "apps/comic/src/simulation/appraisal.ts",
    "name": "SELL_FLOOR",
    "value": {
      "trader": 0.45,
      "aggressive": 0.5,
      "cautious": 0.6,
      "collector": 0.8
    },
    "source": {
      "file": "apps/comic/src/simulation/appraisal.ts",
      "line": 66,
      "endLine": 66
    },
    "extraction": "static literal/expression; unresolved expressions are tagged"
  },
  {
    "id": "parameter:source:apps/comic/src/simulation/appraisal.ts:BUY_RATIO",
    "module": "apps/comic/src/simulation/appraisal.ts",
    "name": "BUY_RATIO",
    "value": {
      "aggressive": 0.6,
      "trader": 0.7,
      "collector": 0.72,
      "cautious": 0.74
    },
    "source": {
      "file": "apps/comic/src/simulation/appraisal.ts",
      "line": 67,
      "endLine": 67
    },
    "extraction": "static literal/expression; unresolved expressions are tagged"
  }
]
```
# Seeded random sites
```json
[
  {
    "id": "rng:apps/comic/src/game/appraisal/brokerage.ts:106:7832",
    "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond",
    "key": "`${offer.key}:bond-risk`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/brokerage.ts",
      "line": 106,
      "endLine": 106
    },
    "expression": "randomAt(state.seed,`${offer.key}:bond-risk`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/brokerage.ts:142:10073",
    "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:consign",
    "key": "`${state.encounter}:${p.id}:${item.id}:consign`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/brokerage.ts",
      "line": 142,
      "endLine": 142
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:${item.id}:consign`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/brokerage.ts:155:11336",
    "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:consign",
    "key": "`${state.encounter}:${p.id}:${item.id}:consign-debuff`",
    "seed": "state.seed",
    "guards": [
      "state.config.core2",
      "NOT roll>=CORE2.consign.debuffBelow",
      "roll>=CORE2.consign.cleanBelow"
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/brokerage.ts",
      "line": 155,
      "endLine": 155
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:${item.id}:consign-debuff`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/brokerage.ts:166:12175",
    "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:consign",
    "key": "`${state.encounter}:${p.id}:${item.id}:consign-debuff`",
    "seed": "state.seed",
    "guards": [
      "NOT roll>=CONSIGN_RULES.debuffBelow",
      "roll>=CONSIGN_RULES.cleanBelow"
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/brokerage.ts",
      "line": 166,
      "endLine": 166
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:${item.id}:consign-debuff`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/brokerage.ts:198:13925",
    "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:auctionLots",
    "key": "`${state.encounter}:auction:open`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/brokerage.ts",
      "line": 198,
      "endLine": 198
    },
    "expression": "randomAt(state.seed,`${state.encounter}:auction:open`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/brokerage.ts:199:14060",
    "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:auctionLots",
    "key": "`${state.encounter}:auction:${itemId}:rank`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/brokerage.ts",
      "line": 199,
      "endLine": 199
    },
    "expression": "randomAt(state.seed,`${state.encounter}:auction:${itemId}:rank`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/brokerage.ts:217:15421",
    "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:settleAuction",
    "key": "`${lot.id}:${id}:tie`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/brokerage.ts",
      "line": 217,
      "endLine": 217
    },
    "expression": "randomAt(state.seed,`${lot.id}:${id}:tie`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/challenge.ts:22:1705",
    "owner": "code:apps/comic/src/game/appraisal/challenge.ts:settleChallenge",
    "key": "`${state.encounter}:${offer.id}:copy-seal`",
    "seed": "state.seed",
    "guards": [
      "claim===undefined || claim===truth"
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/challenge.ts",
      "line": 22,
      "endLine": 22
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${offer.id}:copy-seal`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/cleanse.ts:21:1624",
    "owner": "code:apps/comic/src/game/appraisal/cleanse.ts:quote",
    "key": "`${state.encounter}:${p.id}:${itemId}:cleanse-price`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/cleanse.ts",
      "line": 21,
      "endLine": 21
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:${itemId}:cleanse-price`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/cleanse.ts:46:3552",
    "owner": "code:apps/comic/src/game/appraisal/cleanse.ts:cleanseItem",
    "key": "`${state.encounter}:${p.id}:${itemId}:cleanse-roll`",
    "seed": "state.seed",
    "guards": [
      "NOT !wasCursed"
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/cleanse.ts",
      "line": 46,
      "endLine": 46
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:${itemId}:cleanse-roll`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/collector-wishlist.ts:40:4533",
    "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:deliver",
    "key": "`${pending.id}:extra:${a}`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
      "line": 40,
      "endLine": 40
    },
    "expression": "randomAt(state.seed,`${pending.id}:extra:${a}`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/collector-wishlist.ts:40:4581",
    "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:deliver",
    "key": "`${pending.id}:extra:${b}`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
      "line": 40,
      "endLine": 40
    },
    "expression": "randomAt(state.seed,`${pending.id}:extra:${b}`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/collector-wishlist.ts:41:4717",
    "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:deliver",
    "key": "`${pending.id}:slot:${a}`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
      "line": 41,
      "endLine": 41
    },
    "expression": "randomAt(state.seed,`${pending.id}:slot:${a}`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/collector-wishlist.ts:41:4764",
    "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:deliver",
    "key": "`${pending.id}:slot:${b}`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
      "line": 41,
      "endLine": 41
    },
    "expression": "randomAt(state.seed,`${pending.id}:slot:${b}`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/collector-wishlist.ts:43:5195",
    "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:deliver",
    "key": "`${id}:base`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
      "line": 43,
      "endLine": 43
    },
    "expression": "randomAt(state.seed,`${id}:base`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/collector-wishlist.ts:43:5287",
    "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:deliver",
    "key": "`${id}:ask`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
      "line": 43,
      "endLine": 43
    },
    "expression": "randomAt(state.seed,`${id}:ask`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/collector-wishlist.ts:44:5440",
    "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:deliver",
    "key": "`${id}:genuine`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
      "line": 44,
      "endLine": 44
    },
    "expression": "randomAt(state.seed,`${id}:genuine`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/collector-wishlist.ts:44:5488",
    "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:deliver",
    "key": "`${id}:curse`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
      "line": 44,
      "endLine": 44
    },
    "expression": "randomAt(state.seed,`${id}:curse`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/collector-wishlist.ts:44:5539",
    "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:deliver",
    "key": "`${id}:certificate`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
      "line": 44,
      "endLine": 44
    },
    "expression": "randomAt(state.seed,`${id}:certificate`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/core2-actions.ts:31:2026",
    "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:stealShop",
    "key": "`${state.encounter}:${p.id}:steal:${itemId}`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/core2-actions.ts",
      "line": 31,
      "endLine": 31
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:steal:${itemId}`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/core2-actions.ts:52:3305",
    "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:pickpocket",
    "key": "`${state.encounter}:${p.id}:pickpocket:${victimId}`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/core2-actions.ts",
      "line": 52,
      "endLine": 52
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:pickpocket:${victimId}`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/core2-actions.ts:73:4676",
    "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:barter",
    "key": "`${state.encounter}:${p.id}:barter:${itemId}`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/core2-actions.ts",
      "line": 73,
      "endLine": 73
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:barter:${itemId}`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/core2-events.ts:73:5099",
    "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:pickBacklash",
    "key": "`${state.encounter}:${p.id}:backlash:pick`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/core2-events.ts",
      "line": 73,
      "endLine": 73
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:backlash:pick`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/core2-events.ts:98:6798",
    "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:resolveCore2Event",
    "key": "`${offer.key}:gamble`",
    "seed": "state.seed",
    "guards": [
      "picked.gamble"
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/core2-events.ts",
      "line": 98,
      "endLine": 98
    },
    "expression": "randomAt(state.seed,`${offer.key}:gamble`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/core2-rules.ts:19:1120",
    "owner": "code:apps/comic/src/game/appraisal/core2-rules.ts:applyDread",
    "key": "`${state.encounter}:${p.id}:dread`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/core2-rules.ts",
      "line": 19,
      "endLine": 19
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:dread`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/core2-rules.ts:22:1341",
    "owner": "code:apps/comic/src/game/appraisal/core2-rules.ts:applyDread",
    "key": "`${state.encounter}:${p.id}:dread:kind`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/core2-rules.ts",
      "line": 22,
      "endLine": 22
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:dread:kind`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/core2-rules.ts:27:1766",
    "owner": "code:apps/comic/src/game/appraisal/core2-rules.ts:applyDread",
    "key": "`${state.encounter}:${p.id}:dread:item`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/core2-rules.ts",
      "line": 27,
      "endLine": 27
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:dread:item`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/engine.ts:124:14210",
    "owner": "code:apps/comic/src/game/appraisal/engine.ts:initialiseAppraisalRun",
    "key": "`${state.encounter}:${p.id}:entry-event`",
    "seed": "seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/engine.ts",
      "line": 124,
      "endLine": 124
    },
    "expression": "randomAt(seed,`${state.encounter}:${p.id}:entry-event`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/engine.ts:133:15419",
    "owner": "code:apps/comic/src/game/appraisal/engine.ts:spawnStockItem",
    "key": "`${itemId}:kind`",
    "seed": "seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/engine.ts",
      "line": 133,
      "endLine": 133
    },
    "expression": "randomAt(seed,`${itemId}:kind`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/engine.ts:134:15577",
    "owner": "code:apps/comic/src/game/appraisal/engine.ts:spawnStockItem",
    "key": "`${itemId}:base`",
    "seed": "seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/engine.ts",
      "line": 134,
      "endLine": 134
    },
    "expression": "randomAt(seed,`${itemId}:base`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/engine.ts:136:15724",
    "owner": "code:apps/comic/src/game/appraisal/engine.ts:spawnStockItem",
    "key": "`${itemId}:ask`",
    "seed": "seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/engine.ts",
      "line": 136,
      "endLine": 136
    },
    "expression": "randomAt(seed,`${itemId}:ask`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/engine.ts:137:15839",
    "owner": "code:apps/comic/src/game/appraisal/engine.ts:spawnStockItem",
    "key": "`${itemId}:reservation`",
    "seed": "seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/engine.ts",
      "line": 137,
      "endLine": 137
    },
    "expression": "randomAt(seed,`${itemId}:reservation`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/engine.ts:139:15941",
    "owner": "code:apps/comic/src/game/appraisal/engine.ts:spawnStockItem",
    "key": "`${itemId}:genuine`",
    "seed": "seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/engine.ts",
      "line": 139,
      "endLine": 139
    },
    "expression": "randomAt(seed,`${itemId}:genuine`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/engine.ts:140:15992",
    "owner": "code:apps/comic/src/game/appraisal/engine.ts:spawnStockItem",
    "key": "`${itemId}:curse`",
    "seed": "seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/engine.ts",
      "line": 140,
      "endLine": 140
    },
    "expression": "randomAt(seed,`${itemId}:curse`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/engine.ts:141:16105",
    "owner": "code:apps/comic/src/game/appraisal/engine.ts:spawnStockItem",
    "key": "`${itemId}:certificate`",
    "seed": "seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/engine.ts",
      "line": 141,
      "endLine": 141
    },
    "expression": "randomAt(seed,`${itemId}:certificate`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/engine.ts:149:16501",
    "owner": "code:apps/comic/src/game/appraisal/engine.ts:generatePortals",
    "key": "`${encounter}:${seat}:${npc}:portal`",
    "seed": "seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/engine.ts",
      "line": 149,
      "endLine": 149
    },
    "expression": "randomAt(seed,`${encounter}:${seat}:${npc}:portal`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/engine.ts:167:17878",
    "owner": "code:apps/comic/src/game/appraisal/engine.ts:rerollPortal",
    "key": "`${state.encounter}:${seat}:${npc}:portal:reroll${done+1}`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/engine.ts",
      "line": 167,
      "endLine": 167
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${seat}:${npc}:portal:reroll${done+1}`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/engine.ts:177:18631",
    "owner": "code:apps/comic/src/game/appraisal/engine.ts:makeMarket",
    "key": "`${state.encounter}:market:open`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/engine.ts",
      "line": 177,
      "endLine": 177
    },
    "expression": "randomAt(state.seed,`${state.encounter}:market:open`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/engine.ts:179:18834",
    "owner": "code:apps/comic/src/game/appraisal/engine.ts:makeMarket",
    "key": "`${state.encounter}:market:count`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/engine.ts",
      "line": 179,
      "endLine": 179
    },
    "expression": "randomAt(state.seed,`${state.encounter}:market:count`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/engine.ts:180:18984",
    "owner": "code:apps/comic/src/game/appraisal/engine.ts:makeMarket",
    "key": "`${state.encounter}:market:${kind}:rank`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/engine.ts",
      "line": 180,
      "endLine": 180
    },
    "expression": "randomAt(state.seed,`${state.encounter}:market:${kind}:rank`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/engine.ts:182:19177",
    "owner": "code:apps/comic/src/game/appraisal/engine.ts:makeMarket",
    "key": "`${state.encounter}:market:${kind}:price`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/engine.ts",
      "line": 182,
      "endLine": 182
    },
    "expression": "randomAt(state.seed,`${state.encounter}:market:${kind}:price`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/engine.ts:183:19587",
    "owner": "code:apps/comic/src/game/appraisal/engine.ts:makeMarket",
    "key": "`${state.encounter}:market:${kind}:contract:${key}`",
    "seed": "state.seed",
    "guards": [
      "state.config.commerce"
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/engine.ts",
      "line": 183,
      "endLine": 183
    },
    "expression": "randomAt(state.seed,`${state.encounter}:market:${kind}:contract:${key}`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/engine.ts:476:48864",
    "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
    "key": "`${state.encounter}:${p.id}:entry-event`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/engine.ts",
      "line": 476,
      "endLine": 476
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:entry-event`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/events.ts:59:5450",
    "owner": "code:apps/comic/src/game/appraisal/events.ts:draftBoons",
    "key": "`${key}:boon:${id}`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/events.ts",
      "line": 59,
      "endLine": 59
    },
    "expression": "randomAt(state.seed,`${key}:boon:${id}`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/events.ts:258:21123",
    "owner": "code:apps/comic/src/game/appraisal/events.ts:drawEvent",
    "key": "`${state.encounter}:${p.id}:${state.phase}:${p.offerSlots}:${p.consequenceSlots}:event`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/events.ts",
      "line": 258,
      "endLine": 258
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:${state.phase}:${p.offerSlots}:${p.consequenceSlots}:event`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/events.ts:271:22143",
    "owner": "code:apps/comic/src/game/appraisal/events.ts:drawPolishEvent",
    "key": "`${state.encounter}:${p.id}:${state.phase}:polish`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/events.ts",
      "line": 271,
      "endLine": 271
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:${state.phase}:polish`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/events.ts:272:22300",
    "owner": "code:apps/comic/src/game/appraisal/events.ts:drawPolishEvent",
    "key": "`${state.encounter}:${p.id}:${state.phase}:polish:pick`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/events.ts",
      "line": 272,
      "endLine": 272
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:${state.phase}:polish:pick`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/events.ts:277:22681",
    "owner": "code:apps/comic/src/game/appraisal/events.ts:drawPersonalNpcEvent",
    "key": "`${state.encounter}:${p.id}:personal-npc`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/events.ts",
      "line": 277,
      "endLine": 277
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:personal-npc`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/events.ts:284:23201",
    "owner": "code:apps/comic/src/game/appraisal/events.ts:drawExpansionEvent",
    "key": "`${state.encounter}:${p.id}:${state.phase}:expansion`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/events.ts",
      "line": 284,
      "endLine": 284
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:${state.phase}:expansion`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/events.ts:285:23383",
    "owner": "code:apps/comic/src/game/appraisal/events.ts:drawExpansionEvent",
    "key": "`${state.encounter}:${p.id}:${state.phase}:expansion:pick`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/events.ts",
      "line": 285,
      "endLine": 285
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:${state.phase}:expansion:pick`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/events.ts:292:23915",
    "owner": "code:apps/comic/src/game/appraisal/events.ts:drawBondEvent",
    "key": "`${state.encounter}:${p.id}:bond`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/events.ts",
      "line": 292,
      "endLine": 292
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:bond`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/events.ts:293:24046",
    "owner": "code:apps/comic/src/game/appraisal/events.ts:drawBondEvent",
    "key": "`${state.encounter}:${p.id}:bond:pick`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/events.ts",
      "line": 293,
      "endLine": 293
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:bond:pick`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/events.ts:344:31493",
    "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
    "key": "`${offer.key}:narrow`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/events.ts",
      "line": 344,
      "endLine": 344
    },
    "expression": "randomAt(state.seed,`${offer.key}:narrow`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/events.ts:360:33526",
    "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
    "key": "`${offer.key}:${v}:copy-key`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/events.ts",
      "line": 360,
      "endLine": 360
    },
    "expression": "randomAt(state.seed,`${offer.key}:${v}:copy-key`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/events.ts:362:34163",
    "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
    "key": "`${offer.key}:${v}:copy-potion`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/events.ts",
      "line": 362,
      "endLine": 362
    },
    "expression": "randomAt(state.seed,`${offer.key}:${v}:copy-potion`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/events.ts:384:38201",
    "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
    "key": "`${offer.key}:ledger`",
    "seed": "state.seed",
    "guards": [
      "reworked(state)"
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/events.ts",
      "line": 384,
      "endLine": 384
    },
    "expression": "randomAt(state.seed,`${offer.key}:ledger`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/events.ts:398:39491",
    "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
    "key": "`${offer.key}:pearl-dive`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/events.ts",
      "line": 398,
      "endLine": 398
    },
    "expression": "randomAt(state.seed,`${offer.key}:pearl-dive`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/events.ts:404:40465",
    "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
    "key": "`${offer.key}:old-nest`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/events.ts",
      "line": 404,
      "endLine": 404
    },
    "expression": "randomAt(state.seed,`${offer.key}:old-nest`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/ghost-service.ts:13:1428",
    "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:draw",
    "key": "`ghost:${label}:${g.round}:${g.draws++}`",
    "seed": "s.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/ghost-service.ts",
      "line": 13,
      "endLine": 13
    },
    "expression": "randomAt(s.seed,`ghost:${label}:${g.round}:${g.draws++}`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/ghost-service.ts:19:2057",
    "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:ghostQuotes",
    "key": "`ghost-quote:${s.encounter}:${ghostId}:${buyerId}:${a}`",
    "seed": "s.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/ghost-service.ts",
      "line": 19,
      "endLine": 19
    },
    "expression": "randomAt(s.seed,`ghost-quote:${s.encounter}:${ghostId}:${buyerId}:${a}`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/ghost-service.ts:19:2130",
    "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:ghostQuotes",
    "key": "`ghost-quote:${s.encounter}:${ghostId}:${buyerId}:${b}`",
    "seed": "s.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/ghost-service.ts",
      "line": 19,
      "endLine": 19
    },
    "expression": "randomAt(s.seed,`ghost-quote:${s.encounter}:${ghostId}:${buyerId}:${b}`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/ghost-service.ts:21:2411",
    "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:ghostQuotes",
    "key": "`ghost-price:${s.encounter}:${ghostId}:${buyerId}:${kind}`",
    "seed": "s.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/ghost-service.ts",
      "line": 21,
      "endLine": 21
    },
    "expression": "randomAt(s.seed,`ghost-price:${s.encounter}:${ghostId}:${buyerId}:${kind}`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/ghost-service.ts:55:6243",
    "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
    "key": "`${itemId}:genuine`",
    "seed": "s.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/ghost-service.ts",
      "line": 55,
      "endLine": 55
    },
    "expression": "randomAt(s.seed,`${itemId}:genuine`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/ghost-service.ts:55:6291",
    "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
    "key": "`${itemId}:curse`",
    "seed": "s.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/ghost-service.ts",
      "line": 55,
      "endLine": 55
    },
    "expression": "randomAt(s.seed,`${itemId}:curse`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/mechanics.ts:93:6911",
    "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:grant",
    "key": "`${state.encounter}:${p.id}:${p.activated.at(-1)}:${id}:copy-status`",
    "seed": "state.seed",
    "guards": [
      "power<1 && !['B03','B04','B05','B09','B10','B12','B13','B14','B15','B16','B17','B18','B19','D01','D03','D04','D05','D06','D08','D10','D11','D12','D13','D16','D17','D18','D19','D20','B25','D25'].includes(id)"
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/mechanics.ts",
      "line": 93,
      "endLine": 93
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:${p.activated.at(-1)}:${id}:copy-status`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/mechanics.ts:172:13696",
    "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:recoveryAmount",
    "key": "`${state.encounter}:${p.id}:recovery-roll`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/mechanics.ts",
      "line": 172,
      "endLine": 172
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:recovery-roll`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/mechanics.ts:249:19303",
    "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:inspect",
    "key": "`${item.id}:narrow`",
    "seed": "state.seed",
    "guards": [
      "property === 'price'",
      "NOT status(p,'B01') && !status(p,'D02')"
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/mechanics.ts",
      "line": 249,
      "endLine": 249
    },
    "expression": "randomAt(state.seed,`${item.id}:narrow`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/mechanics.ts:281:21697",
    "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:appraise",
    "key": "`${state.encounter}:${p.id}:${itemId}:detection`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/mechanics.ts",
      "line": 281,
      "endLine": 281
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:${itemId}:detection`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/mechanics.ts:283:21921",
    "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:appraise",
    "key": "`${state.encounter}:${p.id}:${itemId}:trust-accept:${counter?p.counters:0}`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/mechanics.ts",
      "line": 283,
      "endLine": 283
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:${itemId}:trust-accept:${counter?p.counters:0}`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/mechanics.ts:287:22565",
    "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:appraise",
    "key": "`${state.encounter}:${p.id}:${itemId}:overvalue:${counter?p.counters:0}`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/mechanics.ts",
      "line": 287,
      "endLine": 287
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:${itemId}:overvalue:${counter?p.counters:0}`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/mechanics.ts:441:36206",
    "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
    "key": "`${state.encounter}:${p.id}:${itemId}:fake-effect`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/mechanics.ts",
      "line": 441,
      "endLine": 441
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:${itemId}:fake-effect`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/mechanics.ts:458:38019",
    "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
    "key": "`${state.encounter}:${item.id}:copy-insight`",
    "seed": "state.seed",
    "guards": [
      "works",
      "NOT spec.nativeEffect==='effect:E62'",
      "NOT state.config.trustAbilities && (ABILITY_ITEM_IDS as readonly string[]).includes(item.kind)",
      "state.config.trustAbilities && item.kind in MODERN_ACTIVATIONS",
      "NOT operation==='energy-for-delay'"
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/mechanics.ts",
      "line": 458,
      "endLine": 458
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${item.id}:copy-insight`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/mechanics.ts:462:38467",
    "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
    "key": "`${state.encounter}:${item.id}:scan-price`",
    "seed": "state.seed",
    "guards": [
      "works",
      "NOT spec.nativeEffect==='effect:E62'",
      "NOT state.config.trustAbilities && (ABILITY_ITEM_IDS as readonly string[]).includes(item.kind)",
      "state.config.trustAbilities && item.kind in MODERN_ACTIVATIONS",
      "NOT operation==='energy-for-delay'",
      "power===1 || randomAt(state.seed,`${state.encounter}:${item.id}:copy-insight`)<power",
      "operation==='scan-shop-price'",
      "pool.length"
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/mechanics.ts",
      "line": 462,
      "endLine": 462
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${item.id}:scan-price`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/mechanics.ts:465:38898",
    "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
    "key": "`${state.encounter}:${item.id}:recall-fact`",
    "seed": "state.seed",
    "guards": [
      "works",
      "NOT spec.nativeEffect==='effect:E62'",
      "NOT state.config.trustAbilities && (ABILITY_ITEM_IDS as readonly string[]).includes(item.kind)",
      "state.config.trustAbilities && item.kind in MODERN_ACTIVATIONS",
      "NOT operation==='energy-for-delay'",
      "power===1 || randomAt(state.seed,`${state.encounter}:${item.id}:copy-insight`)<power",
      "NOT operation==='scan-shop-price'",
      "options.length"
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/mechanics.ts",
      "line": 465,
      "endLine": 465
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${item.id}:recall-fact`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/mechanics.ts:470:39359",
    "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
    "key": "`${state.encounter}:${item.id}:copy-key`",
    "seed": "state.seed",
    "guards": [
      "works",
      "NOT spec.nativeEffect==='effect:E62'",
      "NOT state.config.trustAbilities && (ABILITY_ITEM_IDS as readonly string[]).includes(item.kind)",
      "NOT state.config.trustAbilities && item.kind in MODERN_ACTIVATIONS",
      "NOT itemFamily(item.kind) === 'orb'",
      "itemFamily(item.kind) === 'key' && status(p,'D07')"
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/mechanics.ts",
      "line": 470,
      "endLine": 470
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${item.id}:copy-key`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/merchant-abilities.ts:37:3892",
    "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:makeCandidate",
    "key": "`${key}:${slot}:kind`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
      "line": 37,
      "endLine": 37
    },
    "expression": "randomAt(state.seed,`${key}:${slot}:kind`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/merchant-abilities.ts:40:4089",
    "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:makeCandidate",
    "key": "`${id}:base`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
      "line": 40,
      "endLine": 40
    },
    "expression": "randomAt(state.seed,`${id}:base`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/merchant-abilities.ts:41:4190",
    "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:makeCandidate",
    "key": "`${id}:ask`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
      "line": 41,
      "endLine": 41
    },
    "expression": "randomAt(state.seed,`${id}:ask`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/merchant-abilities.ts:42:4281",
    "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:makeCandidate",
    "key": "`${id}:genuine`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
      "line": 42,
      "endLine": 42
    },
    "expression": "randomAt(state.seed,`${id}:genuine`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/merchant-abilities.ts:42:4329",
    "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:makeCandidate",
    "key": "`${id}:cursed`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
      "line": 42,
      "endLine": 42
    },
    "expression": "randomAt(state.seed,`${id}:cursed`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/npc-events.ts:16:1491",
    "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:pick",
    "key": "key",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/npc-events.ts",
      "line": 16,
      "endLine": 16
    },
    "expression": "randomAt(state.seed,key)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/npc-events.ts:43:3273",
    "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:personalNpcOffer",
    "key": "`${key}:loan-size`",
    "seed": "state.seed",
    "guards": [
      "id==='E110'"
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/npc-events.ts",
      "line": 43,
      "endLine": 43
    },
    "expression": "randomAt(state.seed,`${key}:loan-size`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/npc-events.ts:49:3761",
    "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:personalNpcOffer",
    "key": "`${key}:cost:${cost}`",
    "seed": "state.seed",
    "guards": [
      "id==='E111'"
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/npc-events.ts",
      "line": 49,
      "endLine": 49
    },
    "expression": "randomAt(state.seed,`${key}:cost:${cost}`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/npc-events.ts:50:3864",
    "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:personalNpcOffer",
    "key": "`${key}:cost-count`",
    "seed": "state.seed",
    "guards": [
      "id==='E111'"
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/npc-events.ts",
      "line": 50,
      "endLine": 50
    },
    "expression": "randomAt(state.seed,`${key}:cost-count`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/npc-events.ts:51:4040",
    "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:personalNpcOffer",
    "key": "`${key}:credits`",
    "seed": "state.seed",
    "guards": [
      "id==='E111'",
      "cost==='credits'"
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/npc-events.ts",
      "line": 51,
      "endLine": 51
    },
    "expression": "randomAt(state.seed,`${key}:credits`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/npc-events.ts:150:13127",
    "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:redeemNpcContracts",
    "key": "`${loan.key}:credits`",
    "seed": "state.seed",
    "guards": [
      "npc==='alien' && loan && state.encounter>=loan.dueAt"
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/npc-events.ts",
      "line": 150,
      "endLine": 150
    },
    "expression": "randomAt(state.seed,`${loan.key}:credits`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/npc-events.ts:150:13193",
    "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:redeemNpcContracts",
    "key": "`${loan.key}:energy`",
    "seed": "state.seed",
    "guards": [
      "npc==='alien' && loan && state.encounter>=loan.dueAt"
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/npc-events.ts",
      "line": 150,
      "endLine": 150
    },
    "expression": "randomAt(state.seed,`${loan.key}:energy`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/omens.ts:8:343",
    "owner": "code:apps/comic/src/game/appraisal/omens.ts:pick",
    "key": "`${encounter}:omen`",
    "seed": "seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/omens.ts",
      "line": 8,
      "endLine": 8
    },
    "expression": "randomAt(seed,`${encounter}:omen`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/omens.ts:16:840",
    "owner": "code:apps/comic/src/game/appraisal/omens.ts:omenOf",
    "key": "`${e}:omen:shift`",
    "seed": "seed",
    "guards": [
      "next===index"
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/omens.ts",
      "line": 16,
      "endLine": 16
    },
    "expression": "randomAt(seed,`${e}:omen:shift`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/omens.ts:33:1608",
    "owner": "code:apps/comic/src/game/appraisal/omens.ts:core2Omen",
    "key": "`${e}:omen2`",
    "seed": "seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/omens.ts",
      "line": 33,
      "endLine": 33
    },
    "expression": "randomAt(seed,`${e}:omen2`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/price-integrity.ts:21:1075",
    "owner": "code:apps/comic/src/game/appraisal/price-integrity.ts:auditItemPrice",
    "key": "`${state.encounter}:${item.id}:price-integrity:${sourceKey}:${integrity.audits}`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/price-integrity.ts",
      "line": 21,
      "endLine": 21
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${item.id}:price-integrity:${sourceKey}:${integrity.audits}`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/rarity.ts:12:614",
    "owner": "code:apps/comic/src/game/appraisal/rarity.ts:ensureItemAppearance",
    "key": "`${item.id}:appearance:v1`",
    "seed": "state.seed",
    "guards": [
      "state.config.rarity && !item.appearance"
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/rarity.ts",
      "line": 12,
      "endLine": 12
    },
    "expression": "randomAt(state.seed,`${item.id}:appearance:v1`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/round-rewards.ts:42:3155",
    "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:flipRoundReward",
    "key": "`${state.encounter}:${p.id}:round-coin:${attempt}${suffix}`",
    "seed": "state.seed",
    "guards": [
      "state.config.multiCoinRewards",
      "randomAt(state.seed,`${state.encounter}:${p.id}:round-coin:${attempt}${suffix}`)<.5"
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/round-rewards.ts",
      "line": 42,
      "endLine": 42
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:round-coin:${attempt}${suffix}`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/round-rewards.ts:44:3328",
    "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:flipRoundReward",
    "key": "`${state.encounter}:${p.id}:round-coin-luck:${attempt}${suffix}`",
    "seed": "state.seed",
    "guards": [
      "state.config.multiCoinRewards"
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/round-rewards.ts",
      "line": 44,
      "endLine": 44
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:round-coin-luck:${attempt}${suffix}`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/round-rewards.ts:45:3477",
    "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:flipRoundReward",
    "key": "`${state.encounter}:${p.id}:round-coin-unluck:${attempt}${suffix}`",
    "seed": "state.seed",
    "guards": [
      "state.config.multiCoinRewards"
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/round-rewards.ts",
      "line": 45,
      "endLine": 45
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:round-coin-unluck:${attempt}${suffix}`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/round-rewards.ts:57:4282",
    "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:flipRoundReward",
    "key": "`${state.encounter}:${p.id}:round-coin:${attempt}`",
    "seed": "state.seed",
    "guards": [
      "randomAt(state.seed,`${state.encounter}:${p.id}:round-coin:${attempt}`)<.5"
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/round-rewards.ts",
      "line": 57,
      "endLine": 57
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:round-coin:${attempt}`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/round-rewards.ts:58:4418",
    "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:flipRoundReward",
    "key": "`${state.encounter}:${p.id}:round-coin-luck:${attempt}`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/round-rewards.ts",
      "line": 58,
      "endLine": 58
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:round-coin-luck:${attempt}`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/seals.ts:133:8161",
    "owner": "code:apps/comic/src/game/appraisal/seals.ts:redeem",
    "key": "`${state.encounter}:${id}:${i}:seal-pick`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/seals.ts",
      "line": 133,
      "endLine": 133
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${id}:${i}:seal-pick`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/theft.ts:119:5214",
    "owner": "code:apps/comic/src/game/appraisal/theft.ts:npcHand",
    "key": "`${duel.id}:round:${duel.round}:npc`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/theft.ts",
      "line": 119,
      "endLine": 119
    },
    "expression": "randomAt(state.seed,`${duel.id}:round:${duel.round}:npc`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/theft.ts:143:6859",
    "owner": "code:apps/comic/src/game/appraisal/theft.ts:startTheftDuel",
    "key": "`${state.encounter}:${p.id}:${victim.id}:theft-item`",
    "seed": "state.seed",
    "guards": [
      "target.victimId"
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/theft.ts",
      "line": 143,
      "endLine": 143
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:${victim.id}:theft-item`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/theft.ts:197:10034",
    "owner": "code:apps/comic/src/game/appraisal/theft.ts:expireTheftDuel",
    "key": "`${duel.id}:round:${round}:timeout:${id}`",
    "seed": "state.seed",
    "guards": [
      "state.config.theftTimeoutRules===1"
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/theft.ts",
      "line": 197,
      "endLine": 197
    },
    "expression": "randomAt(state.seed,`${duel.id}:round:${round}:timeout:${id}`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/wishlist.ts:20:1782",
    "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:wishPick",
    "key": "`${state.encounter}:${p.id}:${npc}:wish-kind${nonce?`:${nonce}`:''}`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/wishlist.ts",
      "line": 20,
      "endLine": 20
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:${npc}:wish-kind${nonce?`:${nonce}`:''}`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/wishlist.ts:70:5986",
    "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:drawWishEvent",
    "key": "`${state.encounter}:${p.id}:wish`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/wishlist.ts",
      "line": 70,
      "endLine": 70
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:wish`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/wishlist.ts:96:8695",
    "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:wishSell",
    "key": "`${state.encounter}:${p.id}:${itemId}:wish-fake`",
    "seed": "state.seed",
    "guards": [],
    "source": {
      "file": "apps/comic/src/game/appraisal/wishlist.ts",
      "line": 96,
      "endLine": 96
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:${itemId}:wish-fake`)"
  },
  {
    "id": "rng:apps/comic/src/game/appraisal/wishlist.ts:100:9234",
    "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:wishSell",
    "key": "`${state.encounter}:${p.id}:${itemId}:wish-deal`",
    "seed": "state.seed",
    "guards": [
      "NOT !item.genuine && randomAt(state.seed,`${state.encounter}:${p.id}:${itemId}:wish-fake`)<Math.min(.9,Math.max(.05,.4*NPC_SPECS[npc].sensitivity+(state.config.polish?statusMagnitude(p,'D03',.1)-statusMagnitude(p,'B04',.1):0)))"
    ],
    "source": {
      "file": "apps/comic/src/game/appraisal/wishlist.ts",
      "line": 100,
      "endLine": 100
    },
    "expression": "randomAt(state.seed,`${state.encounter}:${p.id}:${itemId}:wish-deal`)"
  }
]
```