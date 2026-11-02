// Generated public DTOs, not product truth or balance evidence. Regenerate after build:server.
import type {AppraisalView} from '../game/appraisal/types.js';
export const collectorPreview={
  "request": {
    "secureEconomy": true,
    "theftTimeoutRules": 1,
    "vaultInterestPercent": 10,
    "theft": {
      "duels": [],
      "targets": [
        {
          "playerId": "bob"
        }
      ],
      "compensation": [],
      "seals": []
    },
    "sealMarket": {
      "holdings": [],
      "offers": []
    },
    "loans": [],
    "trustAbilities": true,
    "itemEffects": true,
    "core2": true,
    "dread": 0.11,
    "passives": true,
    "curseSight": true,
    "freeBuy": true,
    "fakeEffect": true,
    "cleanse": true,
    "challenge": true,
    "eventChoiceRules": 1,
    "statusLinks": 1,
    "ghosts": {
      "services": [],
      "jobs": []
    },
    "version": 5,
    "phase": "PORTALS",
    "encounter": 2,
    "encounterCount": null,
    "revision": 12,
    "roundRewardBase": 15,
    "survival": {
      "maxLife": 20,
      "encounterLifeCost": 1,
      "entryEnergyCost": 0
    },
    "maxEnergy": 10,
    "collectorAt": 5,
    "self": {
      "id": "alice",
      "credits": 509,
      "energy": 10,
      "statuses": [],
      "paused": null,
      "done": false,
      "selectedPortalId": null,
      "inspections": 0,
      "counters": 0,
      "activated": [],
      "score": 0,
      "accuracyBonus": 0,
      "eventOffer": null,
      "offerSlots": 0,
      "consequenceSlots": 0,
      "honorJob": false,
      "honestyReward": null,
      "caught": false,
      "subsidy": false,
      "revealedInfo": [],
      "dealMode": "any",
      "notes": [],
      "passiveUses": {},
      "npcTrust": {},
      "cleansed": [],
      "wishRolls": 0,
      "life": 19,
      "recoveryUsed": false,
      "journal": [
        {
          "id": 0,
          "encounter": 1,
          "phase": "PORTALS",
          "action": "เริ่มการเดินทาง",
          "cause": "ทรัพยากรตั้งต้นของห้อง",
          "changes": [
            "เครดิต +500",
            "พลัง +10",
            "ชีวิต +20"
          ]
        },
        {
          "id": 1,
          "encounter": 1,
          "phase": "PORTALS",
          "action": "เลือกพบพ่อค้า",
          "cause": "เกิดจากเลือกพบพ่อค้า",
          "changes": []
        },
        {
          "id": 3,
          "encounter": 1,
          "phase": "APPRAISAL",
          "action": "เลือกทางในเหตุการณ์ · ค้อนรัง",
          "cause": "เลือก accept",
          "changes": [
            "เครดิต -1"
          ],
          "choice": "เลือก accept",
          "itemKind": "swarm-brood-hammer"
        },
        {
          "id": 5,
          "encounter": 1,
          "phase": "APPRAISAL",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": []
        },
        {
          "id": 7,
          "encounter": 1,
          "phase": "TRADE",
          "action": "เลือกทางในเหตุการณ์ · ค้อนรัง",
          "cause": "เลือก accept",
          "changes": [],
          "choice": "เลือก accept",
          "itemKind": "swarm-brood-hammer"
        },
        {
          "id": 9,
          "encounter": 1,
          "phase": "TRADE",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": []
        },
        {
          "id": 10,
          "encounter": 1,
          "phase": "TRADE",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": [
            "ชีวิต -1"
          ]
        },
        {
          "id": 11,
          "encounter": 1,
          "phase": "REVEAL",
          "action": "เริ่มช่วงใหม่",
          "cause": "ผลเมื่อเริ่มช่วงใหม่",
          "changes": [
            "เครดิต +10"
          ]
        }
      ],
      "collectorWishlist": {
        "request": {
          "available": true,
          "kinds": [
            {
              "kind": "orc-tusk-shield",
              "name": "โล่เขี้ยวออร์ก",
              "image": "/art/comic/items/merchant-set-v1/orc-tusk-shield.png"
            },
            {
              "kind": "vampire-nocturne-signet",
              "name": "แหวนตราราตรี",
              "image": "/art/comic/items/merchant-set-v1/vampire-nocturne-signet.png"
            },
            {
              "kind": "autometa-torque-caliper",
              "name": "คาลิเปอร์วัดแรงบิด",
              "image": "/art/comic/items/merchant-set-v1/autometa-torque-caliper.png"
            },
            {
              "kind": "alien-thought-translator",
              "name": "เครื่องแปลความคิด",
              "image": "/art/comic/items/merchant-set-v1/alien-thought-translator.png"
            },
            {
              "kind": "darkone-crossing-token",
              "name": "เหรียญผ่านแดน",
              "image": "/art/comic/items/merchant-set-v1/darkone-crossing-token.png"
            },
            {
              "kind": "deepsea-tide-compass",
              "name": "เข็มทิศกระแสน้ำ",
              "image": "/art/comic/items/merchant-set-v1/deepsea-tide-compass.png"
            },
            {
              "kind": "swarm-brood-hammer",
              "name": "ค้อนรัง",
              "image": "/art/comic/items/merchant-set-v1/swarm-brood-hammer.png"
            },
            {
              "kind": "beast-riftfang-sword",
              "name": "ดาบเขี้ยวรอยแยก",
              "image": "/art/comic/items/merchant-set-v1/beast-riftfang-sword.png"
            }
          ],
          "dueAt": 4
        }
      },
      "portalRerollCost": 2,
      "pilotAcceptancePercent": 0,
      "pilotPriceChecks": 0,
      "personalVault": {
        "items": [],
        "credits": 0,
        "slots": 2,
        "nextSlotPrice": 10,
        "nextInterest": 0,
        "interestPercent": 10,
        "canWithdrawCredits": false
      },
      "merchantAbilities": [
        {
          "npc": "orc",
          "name": "ปิดดีล",
          "cooldown": 3,
          "target": "stock",
          "description": "ลดราคาซื้อสินค้า 1 ชิ้น 10/15/20% ตามขั้นความไว้ใจ ใช้กับเครดิตที่จ่ายจริง ไม่ลดค่าธรรมเนียม",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "autometa",
          "name": "วิเคราะห์สมบูรณ์",
          "cooldown": 3,
          "target": "stock",
          "description": "เปิดราคาจริง / ราคาและความแท้ / ข้อมูลทั้งหมดของสินค้า 1 ชิ้น ตามขั้นความไว้ใจ",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "alien",
          "name": "แลกเปลี่ยนต่างมิติ",
          "cooldown": 4,
          "target": "inventory",
          "description": "แลกของที่ถือเป็นตัวเลือกใหม่ 2/3/4 ชิ้น เลือกได้หนึ่ง มูลค่าคิดคะแนนไม่เกินต้นฉบับ เห็นข้อมูลเท่าที่ตรวจต้นฉบับไว้",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "vampire",
          "name": "รักษาร่างต้น",
          "cooldown": 5,
          "target": "consumable",
          "description": "เปิดใช้ของใช้แล้วหมดโดยเก็บไว้ได้หนึ่งครั้งต่อชิ้น ขั้นสูงคืนพลัง 1/2 เพิ่มเติม ใช้กับสำเนาไม่ได้",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "darkone",
          "name": "ฉีกพันธสัญญา",
          "cooldown": 4,
          "target": "debuff",
          "description": "ลบ debuff ที่เลือกทันที ขั้นกลางคืนพลัง 1 ขั้นสูงให้เกราะป้องกัน debuff ครั้งถัดไป",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "deepsea",
          "name": "ชำระของต้องสาป",
          "cooldown": 4,
          "target": "inventory",
          "description": "ทำให้ของที่เลือกไร้คำสาป แม้ยังไม่ตรวจ ขั้นกลางเปิดความแท้ ขั้นสูงเปิดราคาด้วย ใช้สิทธิ์แม้ของเดิมไร้คำสาป",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "swarm",
          "name": "แตกหน่อ",
          "cooldown": 5,
          "target": "inventory",
          "description": "สำเนาหนึ่งชิ้น มูลค่า 25/35/50% ของต้นฉบับ effect เหลือ 40% มีได้ชิ้นเดียวต่อต้นฉบับ สำเนาทำสำเนาต่อไม่ได้ ใช้สำเนาสิ้นเปลืองแล้วต้นฉบับทำซ้ำไม่ได้",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "beast",
          "name": "เปลี่ยนสินค้าที่เสนอ",
          "cooldown": 3,
          "target": "stock",
          "description": "เลือกสินค้าที่ยังไม่ซื้อเพื่อรับตัวเลือกใหม่ 2/3/4 ชิ้น แล้วเลือกหนึ่งมาแทน ยังต้องซื้อปกติ เก็บของเดิมเป็นหนึ่งในตัวเลือกได้",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        }
      ],
      "inventory": [],
      "stock": [],
      "portals": [
        {
          "id": "portal-2-0-0",
          "npc": "beast",
          "hint": "beast-riftfang-sword",
          "disabled": false
        },
        {
          "id": "portal-2-0-1",
          "npc": "alien",
          "hint": "alien-thought-translator",
          "disabled": false
        },
        {
          "id": "portal-2-0-2",
          "npc": "vampire",
          "hint": "vampire-nocturne-signet",
          "disabled": false
        }
      ],
      "counterLimit": 1,
      "stockBonus": {
        "tier": 0,
        "total": 0,
        "extra": 0,
        "need": 3,
        "npcs": [
          "orc",
          "vampire",
          "autometa",
          "alien",
          "darkone",
          "deepsea",
          "swarm",
          "beast"
        ]
      },
      "pulse": {
        "shards": 0,
        "perLife": 3,
        "perSale": 1,
        "wary": false
      },
      "core2Actions": {
        "theftUsed": false,
        "trustForSkill": 3
      }
    },
    "players": [
      {
        "id": "alice",
        "credits": 509,
        "energy": 10,
        "score": 0,
        "paused": null,
        "done": false,
        "itemCount": 0,
        "life": 19
      },
      {
        "id": "bob",
        "credits": 507,
        "energy": 10,
        "score": 0,
        "paused": null,
        "done": false,
        "itemCount": 0,
        "life": 19
      }
    ],
    "market": {
      "encounter": 2,
      "open": false,
      "budget": 0,
      "orders": []
    },
    "listings": [],
    "trades": [],
    "history": []
  },
  "waiting": {
    "secureEconomy": true,
    "theftTimeoutRules": 1,
    "vaultInterestPercent": 10,
    "theft": {
      "duels": [],
      "targets": [
        {
          "playerId": "bob"
        }
      ],
      "compensation": [],
      "seals": []
    },
    "sealMarket": {
      "holdings": [],
      "offers": []
    },
    "loans": [],
    "trustAbilities": true,
    "itemEffects": true,
    "core2": true,
    "dread": 0.11,
    "passives": true,
    "curseSight": true,
    "freeBuy": true,
    "fakeEffect": true,
    "cleanse": true,
    "challenge": true,
    "eventChoiceRules": 1,
    "statusLinks": 1,
    "ghosts": {
      "services": [],
      "jobs": []
    },
    "version": 5,
    "phase": "PORTALS",
    "encounter": 2,
    "encounterCount": null,
    "revision": 13,
    "roundRewardBase": 15,
    "survival": {
      "maxLife": 20,
      "encounterLifeCost": 1,
      "entryEnergyCost": 0
    },
    "maxEnergy": 10,
    "collectorAt": 5,
    "self": {
      "id": "alice",
      "credits": 509,
      "energy": 10,
      "statuses": [],
      "paused": null,
      "done": false,
      "selectedPortalId": null,
      "inspections": 0,
      "counters": 0,
      "activated": [],
      "score": 0,
      "accuracyBonus": 0,
      "eventOffer": null,
      "offerSlots": 0,
      "consequenceSlots": 0,
      "honorJob": false,
      "honestyReward": null,
      "caught": false,
      "subsidy": false,
      "revealedInfo": [],
      "dealMode": "any",
      "notes": [
        "ขอ Collector: โล่เขี้ยวออร์ก / แหวนตราราตรี / คาลิเปอร์วัดแรงบิด รับช่วง 4"
      ],
      "passiveUses": {},
      "npcTrust": {},
      "cleansed": [],
      "wishRolls": 0,
      "life": 19,
      "recoveryUsed": false,
      "journal": [
        {
          "id": 0,
          "encounter": 1,
          "phase": "PORTALS",
          "action": "เริ่มการเดินทาง",
          "cause": "ทรัพยากรตั้งต้นของห้อง",
          "changes": [
            "เครดิต +500",
            "พลัง +10",
            "ชีวิต +20"
          ]
        },
        {
          "id": 1,
          "encounter": 1,
          "phase": "PORTALS",
          "action": "เลือกพบพ่อค้า",
          "cause": "เกิดจากเลือกพบพ่อค้า",
          "changes": []
        },
        {
          "id": 3,
          "encounter": 1,
          "phase": "APPRAISAL",
          "action": "เลือกทางในเหตุการณ์ · ค้อนรัง",
          "cause": "เลือก accept",
          "changes": [
            "เครดิต -1"
          ],
          "choice": "เลือก accept",
          "itemKind": "swarm-brood-hammer"
        },
        {
          "id": 5,
          "encounter": 1,
          "phase": "APPRAISAL",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": []
        },
        {
          "id": 7,
          "encounter": 1,
          "phase": "TRADE",
          "action": "เลือกทางในเหตุการณ์ · ค้อนรัง",
          "cause": "เลือก accept",
          "changes": [],
          "choice": "เลือก accept",
          "itemKind": "swarm-brood-hammer"
        },
        {
          "id": 9,
          "encounter": 1,
          "phase": "TRADE",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": []
        },
        {
          "id": 10,
          "encounter": 1,
          "phase": "TRADE",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": [
            "ชีวิต -1"
          ]
        },
        {
          "id": 11,
          "encounter": 1,
          "phase": "REVEAL",
          "action": "เริ่มช่วงใหม่",
          "cause": "ผลเมื่อเริ่มช่วงใหม่",
          "changes": [
            "เครดิต +10"
          ]
        },
        {
          "id": 13,
          "encounter": 2,
          "phase": "PORTALS",
          "action": "ส่งรายการ Collector",
          "cause": "ขอ Collector: โล่เขี้ยวออร์ก / แหวนตราราตรี / คาลิเปอร์วัดแรงบิด รับช่วง 4",
          "changes": []
        }
      ],
      "collectorWishlist": {
        "request": {
          "available": false,
          "kinds": [
            {
              "kind": "orc-tusk-shield",
              "name": "โล่เขี้ยวออร์ก",
              "image": "/art/comic/items/merchant-set-v1/orc-tusk-shield.png"
            },
            {
              "kind": "vampire-nocturne-signet",
              "name": "แหวนตราราตรี",
              "image": "/art/comic/items/merchant-set-v1/vampire-nocturne-signet.png"
            },
            {
              "kind": "autometa-torque-caliper",
              "name": "คาลิเปอร์วัดแรงบิด",
              "image": "/art/comic/items/merchant-set-v1/autometa-torque-caliper.png"
            },
            {
              "kind": "alien-thought-translator",
              "name": "เครื่องแปลความคิด",
              "image": "/art/comic/items/merchant-set-v1/alien-thought-translator.png"
            },
            {
              "kind": "darkone-crossing-token",
              "name": "เหรียญผ่านแดน",
              "image": "/art/comic/items/merchant-set-v1/darkone-crossing-token.png"
            },
            {
              "kind": "deepsea-tide-compass",
              "name": "เข็มทิศกระแสน้ำ",
              "image": "/art/comic/items/merchant-set-v1/deepsea-tide-compass.png"
            },
            {
              "kind": "swarm-brood-hammer",
              "name": "ค้อนรัง",
              "image": "/art/comic/items/merchant-set-v1/swarm-brood-hammer.png"
            },
            {
              "kind": "beast-riftfang-sword",
              "name": "ดาบเขี้ยวรอยแยก",
              "image": "/art/comic/items/merchant-set-v1/beast-riftfang-sword.png"
            }
          ],
          "dueAt": 4
        },
        "pending": {
          "id": "cw-alice-2",
          "kinds": [
            "orc-tusk-shield",
            "vampire-nocturne-signet",
            "autometa-torque-caliper"
          ],
          "requestedAt": 2,
          "dueAt": 4
        }
      },
      "portalRerollCost": 2,
      "pilotAcceptancePercent": 0,
      "pilotPriceChecks": 0,
      "personalVault": {
        "items": [],
        "credits": 0,
        "slots": 2,
        "nextSlotPrice": 10,
        "nextInterest": 0,
        "interestPercent": 10,
        "canWithdrawCredits": false
      },
      "merchantAbilities": [
        {
          "npc": "orc",
          "name": "ปิดดีล",
          "cooldown": 3,
          "target": "stock",
          "description": "ลดราคาซื้อสินค้า 1 ชิ้น 10/15/20% ตามขั้นความไว้ใจ ใช้กับเครดิตที่จ่ายจริง ไม่ลดค่าธรรมเนียม",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "autometa",
          "name": "วิเคราะห์สมบูรณ์",
          "cooldown": 3,
          "target": "stock",
          "description": "เปิดราคาจริง / ราคาและความแท้ / ข้อมูลทั้งหมดของสินค้า 1 ชิ้น ตามขั้นความไว้ใจ",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "alien",
          "name": "แลกเปลี่ยนต่างมิติ",
          "cooldown": 4,
          "target": "inventory",
          "description": "แลกของที่ถือเป็นตัวเลือกใหม่ 2/3/4 ชิ้น เลือกได้หนึ่ง มูลค่าคิดคะแนนไม่เกินต้นฉบับ เห็นข้อมูลเท่าที่ตรวจต้นฉบับไว้",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "vampire",
          "name": "รักษาร่างต้น",
          "cooldown": 5,
          "target": "consumable",
          "description": "เปิดใช้ของใช้แล้วหมดโดยเก็บไว้ได้หนึ่งครั้งต่อชิ้น ขั้นสูงคืนพลัง 1/2 เพิ่มเติม ใช้กับสำเนาไม่ได้",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "darkone",
          "name": "ฉีกพันธสัญญา",
          "cooldown": 4,
          "target": "debuff",
          "description": "ลบ debuff ที่เลือกทันที ขั้นกลางคืนพลัง 1 ขั้นสูงให้เกราะป้องกัน debuff ครั้งถัดไป",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "deepsea",
          "name": "ชำระของต้องสาป",
          "cooldown": 4,
          "target": "inventory",
          "description": "ทำให้ของที่เลือกไร้คำสาป แม้ยังไม่ตรวจ ขั้นกลางเปิดความแท้ ขั้นสูงเปิดราคาด้วย ใช้สิทธิ์แม้ของเดิมไร้คำสาป",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "swarm",
          "name": "แตกหน่อ",
          "cooldown": 5,
          "target": "inventory",
          "description": "สำเนาหนึ่งชิ้น มูลค่า 25/35/50% ของต้นฉบับ effect เหลือ 40% มีได้ชิ้นเดียวต่อต้นฉบับ สำเนาทำสำเนาต่อไม่ได้ ใช้สำเนาสิ้นเปลืองแล้วต้นฉบับทำซ้ำไม่ได้",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "beast",
          "name": "เปลี่ยนสินค้าที่เสนอ",
          "cooldown": 3,
          "target": "stock",
          "description": "เลือกสินค้าที่ยังไม่ซื้อเพื่อรับตัวเลือกใหม่ 2/3/4 ชิ้น แล้วเลือกหนึ่งมาแทน ยังต้องซื้อปกติ เก็บของเดิมเป็นหนึ่งในตัวเลือกได้",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        }
      ],
      "inventory": [],
      "stock": [],
      "portals": [
        {
          "id": "portal-2-0-0",
          "npc": "beast",
          "hint": "beast-riftfang-sword",
          "disabled": false
        },
        {
          "id": "portal-2-0-1",
          "npc": "alien",
          "hint": "alien-thought-translator",
          "disabled": false
        },
        {
          "id": "portal-2-0-2",
          "npc": "vampire",
          "hint": "vampire-nocturne-signet",
          "disabled": false
        }
      ],
      "counterLimit": 1,
      "stockBonus": {
        "tier": 0,
        "total": 0,
        "extra": 0,
        "need": 3,
        "npcs": [
          "orc",
          "vampire",
          "autometa",
          "alien",
          "darkone",
          "deepsea",
          "swarm",
          "beast"
        ]
      },
      "pulse": {
        "shards": 0,
        "perLife": 3,
        "perSale": 1,
        "wary": false
      },
      "core2Actions": {
        "theftUsed": false,
        "trustForSkill": 3
      }
    },
    "players": [
      {
        "id": "alice",
        "credits": 509,
        "energy": 10,
        "score": 0,
        "paused": null,
        "done": false,
        "itemCount": 0,
        "life": 19
      },
      {
        "id": "bob",
        "credits": 507,
        "energy": 10,
        "score": 0,
        "paused": null,
        "done": false,
        "itemCount": 0,
        "life": 19
      }
    ],
    "market": {
      "encounter": 2,
      "open": false,
      "budget": 0,
      "orders": []
    },
    "listings": [],
    "trades": [],
    "history": []
  },
  "delivery": {
    "secureEconomy": true,
    "theftTimeoutRules": 1,
    "vaultInterestPercent": 10,
    "theft": {
      "duels": [],
      "targets": [
        {
          "playerId": "bob"
        }
      ],
      "compensation": [],
      "seals": []
    },
    "sealMarket": {
      "holdings": [],
      "offers": []
    },
    "loans": [],
    "trustAbilities": true,
    "itemEffects": true,
    "core2": true,
    "dread": 0.16999999999999998,
    "passives": true,
    "curseSight": true,
    "freeBuy": true,
    "fakeEffect": true,
    "cleanse": true,
    "challenge": true,
    "eventChoiceRules": 1,
    "statusLinks": 1,
    "ghosts": {
      "services": [],
      "jobs": []
    },
    "version": 5,
    "phase": "PORTALS",
    "encounter": 4,
    "encounterCount": null,
    "revision": 34,
    "roundRewardBase": 15,
    "survival": {
      "maxLife": 20,
      "encounterLifeCost": 1,
      "entryEnergyCost": 0
    },
    "maxEnergy": 10,
    "collectorAt": 5,
    "self": {
      "id": "alice",
      "credits": 531,
      "energy": 8,
      "statuses": [],
      "paused": null,
      "done": false,
      "selectedPortalId": null,
      "inspections": 0,
      "counters": 0,
      "activated": [],
      "score": 0,
      "accuracyBonus": 0,
      "eventOffer": null,
      "offerSlots": 0,
      "consequenceSlots": 0,
      "honorJob": false,
      "honestyReward": null,
      "caught": false,
      "subsidy": false,
      "revealedInfo": [],
      "dealMode": "any",
      "notes": [
        "ขอ Collector: โล่เขี้ยวออร์ก / แหวนตราราตรี / คาลิเปอร์วัดแรงบิด รับช่วง 4",
        "สัญญาหน้าประตู: cash",
        "ความอ่อนล้าจากมิติ: เสียพลัง 2",
        "Collector ส่งชุด cw-alice-2 มาแล้ว 5 ช่อง ราคาต้นทุนร่วม 48 เครดิต"
      ],
      "passiveUses": {},
      "npcTrust": {},
      "cleansed": [],
      "wishRolls": 0,
      "life": 17,
      "recoveryUsed": false,
      "journal": [
        {
          "id": 0,
          "encounter": 1,
          "phase": "PORTALS",
          "action": "เริ่มการเดินทาง",
          "cause": "ทรัพยากรตั้งต้นของห้อง",
          "changes": [
            "เครดิต +500",
            "พลัง +10",
            "ชีวิต +20"
          ]
        },
        {
          "id": 1,
          "encounter": 1,
          "phase": "PORTALS",
          "action": "เลือกพบพ่อค้า",
          "cause": "เกิดจากเลือกพบพ่อค้า",
          "changes": []
        },
        {
          "id": 3,
          "encounter": 1,
          "phase": "APPRAISAL",
          "action": "เลือกทางในเหตุการณ์ · ค้อนรัง",
          "cause": "เลือก accept",
          "changes": [
            "เครดิต -1"
          ],
          "choice": "เลือก accept",
          "itemKind": "swarm-brood-hammer"
        },
        {
          "id": 5,
          "encounter": 1,
          "phase": "APPRAISAL",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": []
        },
        {
          "id": 7,
          "encounter": 1,
          "phase": "TRADE",
          "action": "เลือกทางในเหตุการณ์ · ค้อนรัง",
          "cause": "เลือก accept",
          "changes": [],
          "choice": "เลือก accept",
          "itemKind": "swarm-brood-hammer"
        },
        {
          "id": 9,
          "encounter": 1,
          "phase": "TRADE",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": []
        },
        {
          "id": 10,
          "encounter": 1,
          "phase": "TRADE",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": [
            "ชีวิต -1"
          ]
        },
        {
          "id": 11,
          "encounter": 1,
          "phase": "REVEAL",
          "action": "เริ่มช่วงใหม่",
          "cause": "ผลเมื่อเริ่มช่วงใหม่",
          "changes": [
            "เครดิต +10"
          ]
        },
        {
          "id": 13,
          "encounter": 2,
          "phase": "PORTALS",
          "action": "ส่งรายการ Collector",
          "cause": "ขอ Collector: โล่เขี้ยวออร์ก / แหวนตราราตรี / คาลิเปอร์วัดแรงบิด รับช่วง 4",
          "changes": []
        },
        {
          "id": 14,
          "encounter": 2,
          "phase": "PORTALS",
          "action": "เลือกพบพ่อค้า",
          "cause": "เกิดจากเลือกพบพ่อค้า",
          "changes": []
        },
        {
          "id": 16,
          "encounter": 2,
          "phase": "APPRAISAL",
          "action": "เลือกทางในเหตุการณ์ · ดาบเขี้ยวรอยแยก",
          "cause": "เลือก decline",
          "changes": [],
          "choice": "เลือก decline",
          "itemKind": "beast-riftfang-sword"
        },
        {
          "id": 18,
          "encounter": 2,
          "phase": "APPRAISAL",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": []
        },
        {
          "id": 20,
          "encounter": 2,
          "phase": "TRADE",
          "action": "เลือกทางในเหตุการณ์ · ดาบเขี้ยวรอยแยก",
          "cause": "เลือก decline",
          "changes": [],
          "choice": "เลือก decline",
          "itemKind": "beast-riftfang-sword"
        },
        {
          "id": 21,
          "encounter": 2,
          "phase": "TRADE",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": []
        },
        {
          "id": 22,
          "encounter": 2,
          "phase": "TRADE",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": [
            "ชีวิต -1"
          ]
        },
        {
          "id": 23,
          "encounter": 2,
          "phase": "REVEAL",
          "action": "เริ่มช่วงใหม่",
          "cause": "ผลเมื่อเริ่มช่วงใหม่",
          "changes": [
            "เครดิต +15"
          ]
        },
        {
          "id": 24,
          "encounter": 3,
          "phase": "PORTALS",
          "action": "เลือกทางในเหตุการณ์",
          "cause": "สัญญาหน้าประตู: cash",
          "changes": [
            "เครดิต -3"
          ],
          "choice": "เลือก cash"
        },
        {
          "id": 26,
          "encounter": 3,
          "phase": "PORTALS",
          "action": "เลือกพบพ่อค้า",
          "cause": "เกิดจากเลือกพบพ่อค้า",
          "changes": []
        },
        {
          "id": 28,
          "encounter": 3,
          "phase": "APPRAISAL",
          "action": "เลือกทางในเหตุการณ์ · แหวนตราราตรี",
          "cause": "เลือก decline",
          "changes": [],
          "choice": "เลือก decline",
          "itemKind": "vampire-nocturne-signet"
        },
        {
          "id": 30,
          "encounter": 3,
          "phase": "APPRAISAL",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": []
        },
        {
          "id": 32,
          "encounter": 3,
          "phase": "TRADE",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": []
        },
        {
          "id": 33,
          "encounter": 3,
          "phase": "TRADE",
          "action": "จบช่วง",
          "cause": "ความอ่อนล้าจากมิติ: เสียพลัง 2",
          "changes": [
            "พลัง -2",
            "ชีวิต -1"
          ]
        },
        {
          "id": 34,
          "encounter": 3,
          "phase": "REVEAL",
          "action": "เริ่มช่วงใหม่",
          "cause": "Collector ส่งชุด cw-alice-2 มาแล้ว 5 ช่อง ราคาต้นทุนร่วม 48 เครดิต",
          "changes": [
            "เครดิต +10"
          ]
        }
      ],
      "collectorWishlist": {
        "request": {
          "available": false,
          "kinds": [
            {
              "kind": "orc-tusk-shield",
              "name": "โล่เขี้ยวออร์ก",
              "image": "/art/comic/items/merchant-set-v1/orc-tusk-shield.png"
            },
            {
              "kind": "vampire-nocturne-signet",
              "name": "แหวนตราราตรี",
              "image": "/art/comic/items/merchant-set-v1/vampire-nocturne-signet.png"
            },
            {
              "kind": "autometa-torque-caliper",
              "name": "คาลิเปอร์วัดแรงบิด",
              "image": "/art/comic/items/merchant-set-v1/autometa-torque-caliper.png"
            },
            {
              "kind": "alien-thought-translator",
              "name": "เครื่องแปลความคิด",
              "image": "/art/comic/items/merchant-set-v1/alien-thought-translator.png"
            },
            {
              "kind": "darkone-crossing-token",
              "name": "เหรียญผ่านแดน",
              "image": "/art/comic/items/merchant-set-v1/darkone-crossing-token.png"
            },
            {
              "kind": "deepsea-tide-compass",
              "name": "เข็มทิศกระแสน้ำ",
              "image": "/art/comic/items/merchant-set-v1/deepsea-tide-compass.png"
            },
            {
              "kind": "swarm-brood-hammer",
              "name": "ค้อนรัง",
              "image": "/art/comic/items/merchant-set-v1/swarm-brood-hammer.png"
            },
            {
              "kind": "beast-riftfang-sword",
              "name": "ดาบเขี้ยวรอยแยก",
              "image": "/art/comic/items/merchant-set-v1/beast-riftfang-sword.png"
            }
          ],
          "dueAt": 6
        },
        "delivery": {
          "id": "cw-alice-2",
          "quoteId": "cw-alice-2:48:0:0",
          "status": "open",
          "cost": {
            "price": 48,
            "fee": 0,
            "total": 48,
            "energy": 0
          },
          "canPeek": true,
          "canBuy": true,
          "slots": [
            {
              "id": "s0"
            },
            {
              "id": "s1"
            },
            {
              "id": "s2"
            },
            {
              "id": "s3"
            },
            {
              "id": "s4"
            }
          ]
        }
      },
      "portalRerollCost": 2,
      "pilotAcceptancePercent": 0,
      "pilotPriceChecks": 0,
      "personalVault": {
        "items": [],
        "credits": 0,
        "slots": 2,
        "nextSlotPrice": 10,
        "nextInterest": 0,
        "interestPercent": 10,
        "canWithdrawCredits": true
      },
      "merchantAbilities": [
        {
          "npc": "orc",
          "name": "ปิดดีล",
          "cooldown": 3,
          "target": "stock",
          "description": "ลดราคาซื้อสินค้า 1 ชิ้น 10/15/20% ตามขั้นความไว้ใจ ใช้กับเครดิตที่จ่ายจริง ไม่ลดค่าธรรมเนียม",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "autometa",
          "name": "วิเคราะห์สมบูรณ์",
          "cooldown": 3,
          "target": "stock",
          "description": "เปิดราคาจริง / ราคาและความแท้ / ข้อมูลทั้งหมดของสินค้า 1 ชิ้น ตามขั้นความไว้ใจ",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "alien",
          "name": "แลกเปลี่ยนต่างมิติ",
          "cooldown": 4,
          "target": "inventory",
          "description": "แลกของที่ถือเป็นตัวเลือกใหม่ 2/3/4 ชิ้น เลือกได้หนึ่ง มูลค่าคิดคะแนนไม่เกินต้นฉบับ เห็นข้อมูลเท่าที่ตรวจต้นฉบับไว้",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "vampire",
          "name": "รักษาร่างต้น",
          "cooldown": 5,
          "target": "consumable",
          "description": "เปิดใช้ของใช้แล้วหมดโดยเก็บไว้ได้หนึ่งครั้งต่อชิ้น ขั้นสูงคืนพลัง 1/2 เพิ่มเติม ใช้กับสำเนาไม่ได้",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "darkone",
          "name": "ฉีกพันธสัญญา",
          "cooldown": 4,
          "target": "debuff",
          "description": "ลบ debuff ที่เลือกทันที ขั้นกลางคืนพลัง 1 ขั้นสูงให้เกราะป้องกัน debuff ครั้งถัดไป",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "deepsea",
          "name": "ชำระของต้องสาป",
          "cooldown": 4,
          "target": "inventory",
          "description": "ทำให้ของที่เลือกไร้คำสาป แม้ยังไม่ตรวจ ขั้นกลางเปิดความแท้ ขั้นสูงเปิดราคาด้วย ใช้สิทธิ์แม้ของเดิมไร้คำสาป",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "swarm",
          "name": "แตกหน่อ",
          "cooldown": 5,
          "target": "inventory",
          "description": "สำเนาหนึ่งชิ้น มูลค่า 25/35/50% ของต้นฉบับ effect เหลือ 40% มีได้ชิ้นเดียวต่อต้นฉบับ สำเนาทำสำเนาต่อไม่ได้ ใช้สำเนาสิ้นเปลืองแล้วต้นฉบับทำซ้ำไม่ได้",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "beast",
          "name": "เปลี่ยนสินค้าที่เสนอ",
          "cooldown": 3,
          "target": "stock",
          "description": "เลือกสินค้าที่ยังไม่ซื้อเพื่อรับตัวเลือกใหม่ 2/3/4 ชิ้น แล้วเลือกหนึ่งมาแทน ยังต้องซื้อปกติ เก็บของเดิมเป็นหนึ่งในตัวเลือกได้",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        }
      ],
      "inventory": [],
      "stock": [],
      "portals": [
        {
          "id": "portal-4-0-0",
          "npc": "deepsea",
          "hint": "deepsea-tide-compass",
          "disabled": false
        },
        {
          "id": "portal-4-0-1",
          "npc": "beast",
          "hint": "beast-riftfang-sword",
          "disabled": false
        },
        {
          "id": "portal-4-0-2",
          "npc": "alien",
          "hint": "alien-thought-translator",
          "disabled": false
        }
      ],
      "counterLimit": 1,
      "stockBonus": {
        "tier": 0,
        "total": 0,
        "extra": 0,
        "need": 3,
        "npcs": [
          "orc",
          "vampire",
          "autometa",
          "alien",
          "darkone",
          "deepsea",
          "swarm",
          "beast"
        ]
      },
      "pulse": {
        "shards": 0,
        "perLife": 3,
        "perSale": 1,
        "wary": false
      },
      "core2Actions": {
        "theftUsed": false,
        "trustForSkill": 3
      }
    },
    "players": [
      {
        "id": "alice",
        "credits": 531,
        "energy": 8,
        "score": 0,
        "paused": null,
        "done": false,
        "itemCount": 0,
        "life": 17
      },
      {
        "id": "bob",
        "credits": 530,
        "energy": 9,
        "score": 0,
        "paused": null,
        "done": false,
        "itemCount": 0,
        "life": 17
      }
    ],
    "market": {
      "encounter": 4,
      "open": false,
      "budget": 0,
      "orders": []
    },
    "listings": [],
    "trades": [],
    "history": []
  },
  "peek": {
    "secureEconomy": true,
    "theftTimeoutRules": 1,
    "vaultInterestPercent": 10,
    "theft": {
      "duels": [],
      "targets": [
        {
          "playerId": "bob"
        }
      ],
      "compensation": [],
      "seals": []
    },
    "sealMarket": {
      "holdings": [],
      "offers": []
    },
    "loans": [],
    "trustAbilities": true,
    "itemEffects": true,
    "core2": true,
    "dread": 0.16999999999999998,
    "passives": true,
    "curseSight": true,
    "freeBuy": true,
    "fakeEffect": true,
    "cleanse": true,
    "challenge": true,
    "eventChoiceRules": 1,
    "statusLinks": 1,
    "ghosts": {
      "services": [],
      "jobs": []
    },
    "version": 5,
    "phase": "PORTALS",
    "encounter": 4,
    "encounterCount": null,
    "revision": 35,
    "roundRewardBase": 15,
    "survival": {
      "maxLife": 20,
      "encounterLifeCost": 1,
      "entryEnergyCost": 0
    },
    "maxEnergy": 10,
    "collectorAt": 5,
    "self": {
      "id": "alice",
      "credits": 531,
      "energy": 8,
      "statuses": [],
      "paused": null,
      "done": false,
      "selectedPortalId": null,
      "inspections": 0,
      "counters": 0,
      "activated": [],
      "score": 0,
      "accuracyBonus": 0,
      "eventOffer": null,
      "offerSlots": 0,
      "consequenceSlots": 0,
      "honorJob": false,
      "honestyReward": null,
      "caught": false,
      "subsidy": false,
      "revealedInfo": [],
      "dealMode": "any",
      "notes": [
        "ขอ Collector: โล่เขี้ยวออร์ก / แหวนตราราตรี / คาลิเปอร์วัดแรงบิด รับช่วง 4",
        "สัญญาหน้าประตู: cash",
        "ความอ่อนล้าจากมิติ: เสียพลัง 2",
        "Collector ส่งชุด cw-alice-2 มาแล้ว 5 ช่อง ราคาต้นทุนร่วม 48 เครดิต",
        "เปิดดู Collector ช่อง 1: ดาบเขี้ยวรอยแยก"
      ],
      "passiveUses": {},
      "npcTrust": {},
      "cleansed": [],
      "wishRolls": 0,
      "life": 17,
      "recoveryUsed": false,
      "journal": [
        {
          "id": 0,
          "encounter": 1,
          "phase": "PORTALS",
          "action": "เริ่มการเดินทาง",
          "cause": "ทรัพยากรตั้งต้นของห้อง",
          "changes": [
            "เครดิต +500",
            "พลัง +10",
            "ชีวิต +20"
          ]
        },
        {
          "id": 1,
          "encounter": 1,
          "phase": "PORTALS",
          "action": "เลือกพบพ่อค้า",
          "cause": "เกิดจากเลือกพบพ่อค้า",
          "changes": []
        },
        {
          "id": 3,
          "encounter": 1,
          "phase": "APPRAISAL",
          "action": "เลือกทางในเหตุการณ์ · ค้อนรัง",
          "cause": "เลือก accept",
          "changes": [
            "เครดิต -1"
          ],
          "choice": "เลือก accept",
          "itemKind": "swarm-brood-hammer"
        },
        {
          "id": 5,
          "encounter": 1,
          "phase": "APPRAISAL",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": []
        },
        {
          "id": 7,
          "encounter": 1,
          "phase": "TRADE",
          "action": "เลือกทางในเหตุการณ์ · ค้อนรัง",
          "cause": "เลือก accept",
          "changes": [],
          "choice": "เลือก accept",
          "itemKind": "swarm-brood-hammer"
        },
        {
          "id": 9,
          "encounter": 1,
          "phase": "TRADE",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": []
        },
        {
          "id": 10,
          "encounter": 1,
          "phase": "TRADE",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": [
            "ชีวิต -1"
          ]
        },
        {
          "id": 11,
          "encounter": 1,
          "phase": "REVEAL",
          "action": "เริ่มช่วงใหม่",
          "cause": "ผลเมื่อเริ่มช่วงใหม่",
          "changes": [
            "เครดิต +10"
          ]
        },
        {
          "id": 13,
          "encounter": 2,
          "phase": "PORTALS",
          "action": "ส่งรายการ Collector",
          "cause": "ขอ Collector: โล่เขี้ยวออร์ก / แหวนตราราตรี / คาลิเปอร์วัดแรงบิด รับช่วง 4",
          "changes": []
        },
        {
          "id": 14,
          "encounter": 2,
          "phase": "PORTALS",
          "action": "เลือกพบพ่อค้า",
          "cause": "เกิดจากเลือกพบพ่อค้า",
          "changes": []
        },
        {
          "id": 16,
          "encounter": 2,
          "phase": "APPRAISAL",
          "action": "เลือกทางในเหตุการณ์ · ดาบเขี้ยวรอยแยก",
          "cause": "เลือก decline",
          "changes": [],
          "choice": "เลือก decline",
          "itemKind": "beast-riftfang-sword"
        },
        {
          "id": 18,
          "encounter": 2,
          "phase": "APPRAISAL",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": []
        },
        {
          "id": 20,
          "encounter": 2,
          "phase": "TRADE",
          "action": "เลือกทางในเหตุการณ์ · ดาบเขี้ยวรอยแยก",
          "cause": "เลือก decline",
          "changes": [],
          "choice": "เลือก decline",
          "itemKind": "beast-riftfang-sword"
        },
        {
          "id": 21,
          "encounter": 2,
          "phase": "TRADE",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": []
        },
        {
          "id": 22,
          "encounter": 2,
          "phase": "TRADE",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": [
            "ชีวิต -1"
          ]
        },
        {
          "id": 23,
          "encounter": 2,
          "phase": "REVEAL",
          "action": "เริ่มช่วงใหม่",
          "cause": "ผลเมื่อเริ่มช่วงใหม่",
          "changes": [
            "เครดิต +15"
          ]
        },
        {
          "id": 24,
          "encounter": 3,
          "phase": "PORTALS",
          "action": "เลือกทางในเหตุการณ์",
          "cause": "สัญญาหน้าประตู: cash",
          "changes": [
            "เครดิต -3"
          ],
          "choice": "เลือก cash"
        },
        {
          "id": 26,
          "encounter": 3,
          "phase": "PORTALS",
          "action": "เลือกพบพ่อค้า",
          "cause": "เกิดจากเลือกพบพ่อค้า",
          "changes": []
        },
        {
          "id": 28,
          "encounter": 3,
          "phase": "APPRAISAL",
          "action": "เลือกทางในเหตุการณ์ · แหวนตราราตรี",
          "cause": "เลือก decline",
          "changes": [],
          "choice": "เลือก decline",
          "itemKind": "vampire-nocturne-signet"
        },
        {
          "id": 30,
          "encounter": 3,
          "phase": "APPRAISAL",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": []
        },
        {
          "id": 32,
          "encounter": 3,
          "phase": "TRADE",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": []
        },
        {
          "id": 33,
          "encounter": 3,
          "phase": "TRADE",
          "action": "จบช่วง",
          "cause": "ความอ่อนล้าจากมิติ: เสียพลัง 2",
          "changes": [
            "พลัง -2",
            "ชีวิต -1"
          ]
        },
        {
          "id": 34,
          "encounter": 3,
          "phase": "REVEAL",
          "action": "เริ่มช่วงใหม่",
          "cause": "Collector ส่งชุด cw-alice-2 มาแล้ว 5 ช่อง ราคาต้นทุนร่วม 48 เครดิต",
          "changes": [
            "เครดิต +10"
          ]
        },
        {
          "id": 35,
          "encounter": 4,
          "phase": "PORTALS",
          "action": "เปิดดูสินค้า Collector",
          "cause": "เปิดดู Collector ช่อง 1: ดาบเขี้ยวรอยแยก",
          "changes": []
        }
      ],
      "collectorWishlist": {
        "request": {
          "available": false,
          "kinds": [
            {
              "kind": "orc-tusk-shield",
              "name": "โล่เขี้ยวออร์ก",
              "image": "/art/comic/items/merchant-set-v1/orc-tusk-shield.png"
            },
            {
              "kind": "vampire-nocturne-signet",
              "name": "แหวนตราราตรี",
              "image": "/art/comic/items/merchant-set-v1/vampire-nocturne-signet.png"
            },
            {
              "kind": "autometa-torque-caliper",
              "name": "คาลิเปอร์วัดแรงบิด",
              "image": "/art/comic/items/merchant-set-v1/autometa-torque-caliper.png"
            },
            {
              "kind": "alien-thought-translator",
              "name": "เครื่องแปลความคิด",
              "image": "/art/comic/items/merchant-set-v1/alien-thought-translator.png"
            },
            {
              "kind": "darkone-crossing-token",
              "name": "เหรียญผ่านแดน",
              "image": "/art/comic/items/merchant-set-v1/darkone-crossing-token.png"
            },
            {
              "kind": "deepsea-tide-compass",
              "name": "เข็มทิศกระแสน้ำ",
              "image": "/art/comic/items/merchant-set-v1/deepsea-tide-compass.png"
            },
            {
              "kind": "swarm-brood-hammer",
              "name": "ค้อนรัง",
              "image": "/art/comic/items/merchant-set-v1/swarm-brood-hammer.png"
            },
            {
              "kind": "beast-riftfang-sword",
              "name": "ดาบเขี้ยวรอยแยก",
              "image": "/art/comic/items/merchant-set-v1/beast-riftfang-sword.png"
            }
          ],
          "dueAt": 6
        },
        "delivery": {
          "id": "cw-alice-2",
          "quoteId": "cw-alice-2:48:0:0",
          "status": "open",
          "cost": {
            "price": 48,
            "fee": 0,
            "total": 48,
            "energy": 0
          },
          "canPeek": false,
          "canBuy": true,
          "slots": [
            {
              "id": "s0",
              "peek": {
                "kind": "beast-riftfang-sword",
                "name": "ดาบเขี้ยวรอยแยก",
                "image": "/art/comic/items/merchant-set-v1/beast-riftfang-sword.png",
                "rarity": "common"
              }
            },
            {
              "id": "s1"
            },
            {
              "id": "s2"
            },
            {
              "id": "s3"
            },
            {
              "id": "s4"
            }
          ]
        }
      },
      "portalRerollCost": 2,
      "pilotAcceptancePercent": 0,
      "pilotPriceChecks": 0,
      "personalVault": {
        "items": [],
        "credits": 0,
        "slots": 2,
        "nextSlotPrice": 10,
        "nextInterest": 0,
        "interestPercent": 10,
        "canWithdrawCredits": true
      },
      "merchantAbilities": [
        {
          "npc": "orc",
          "name": "ปิดดีล",
          "cooldown": 3,
          "target": "stock",
          "description": "ลดราคาซื้อสินค้า 1 ชิ้น 10/15/20% ตามขั้นความไว้ใจ ใช้กับเครดิตที่จ่ายจริง ไม่ลดค่าธรรมเนียม",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "autometa",
          "name": "วิเคราะห์สมบูรณ์",
          "cooldown": 3,
          "target": "stock",
          "description": "เปิดราคาจริง / ราคาและความแท้ / ข้อมูลทั้งหมดของสินค้า 1 ชิ้น ตามขั้นความไว้ใจ",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "alien",
          "name": "แลกเปลี่ยนต่างมิติ",
          "cooldown": 4,
          "target": "inventory",
          "description": "แลกของที่ถือเป็นตัวเลือกใหม่ 2/3/4 ชิ้น เลือกได้หนึ่ง มูลค่าคิดคะแนนไม่เกินต้นฉบับ เห็นข้อมูลเท่าที่ตรวจต้นฉบับไว้",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "vampire",
          "name": "รักษาร่างต้น",
          "cooldown": 5,
          "target": "consumable",
          "description": "เปิดใช้ของใช้แล้วหมดโดยเก็บไว้ได้หนึ่งครั้งต่อชิ้น ขั้นสูงคืนพลัง 1/2 เพิ่มเติม ใช้กับสำเนาไม่ได้",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "darkone",
          "name": "ฉีกพันธสัญญา",
          "cooldown": 4,
          "target": "debuff",
          "description": "ลบ debuff ที่เลือกทันที ขั้นกลางคืนพลัง 1 ขั้นสูงให้เกราะป้องกัน debuff ครั้งถัดไป",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "deepsea",
          "name": "ชำระของต้องสาป",
          "cooldown": 4,
          "target": "inventory",
          "description": "ทำให้ของที่เลือกไร้คำสาป แม้ยังไม่ตรวจ ขั้นกลางเปิดความแท้ ขั้นสูงเปิดราคาด้วย ใช้สิทธิ์แม้ของเดิมไร้คำสาป",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "swarm",
          "name": "แตกหน่อ",
          "cooldown": 5,
          "target": "inventory",
          "description": "สำเนาหนึ่งชิ้น มูลค่า 25/35/50% ของต้นฉบับ effect เหลือ 40% มีได้ชิ้นเดียวต่อต้นฉบับ สำเนาทำสำเนาต่อไม่ได้ ใช้สำเนาสิ้นเปลืองแล้วต้นฉบับทำซ้ำไม่ได้",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "beast",
          "name": "เปลี่ยนสินค้าที่เสนอ",
          "cooldown": 3,
          "target": "stock",
          "description": "เลือกสินค้าที่ยังไม่ซื้อเพื่อรับตัวเลือกใหม่ 2/3/4 ชิ้น แล้วเลือกหนึ่งมาแทน ยังต้องซื้อปกติ เก็บของเดิมเป็นหนึ่งในตัวเลือกได้",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        }
      ],
      "inventory": [],
      "stock": [],
      "portals": [
        {
          "id": "portal-4-0-0",
          "npc": "deepsea",
          "hint": "deepsea-tide-compass",
          "disabled": false
        },
        {
          "id": "portal-4-0-1",
          "npc": "beast",
          "hint": "beast-riftfang-sword",
          "disabled": false
        },
        {
          "id": "portal-4-0-2",
          "npc": "alien",
          "hint": "alien-thought-translator",
          "disabled": false
        }
      ],
      "counterLimit": 1,
      "stockBonus": {
        "tier": 0,
        "total": 0,
        "extra": 0,
        "need": 3,
        "npcs": [
          "orc",
          "vampire",
          "autometa",
          "alien",
          "darkone",
          "deepsea",
          "swarm",
          "beast"
        ]
      },
      "pulse": {
        "shards": 0,
        "perLife": 3,
        "perSale": 1,
        "wary": false
      },
      "core2Actions": {
        "theftUsed": false,
        "trustForSkill": 3
      }
    },
    "players": [
      {
        "id": "alice",
        "credits": 531,
        "energy": 8,
        "score": 0,
        "paused": null,
        "done": false,
        "itemCount": 0,
        "life": 17
      },
      {
        "id": "bob",
        "credits": 530,
        "energy": 9,
        "score": 0,
        "paused": null,
        "done": false,
        "itemCount": 0,
        "life": 17
      }
    ],
    "market": {
      "encounter": 4,
      "open": false,
      "budget": 0,
      "orders": []
    },
    "listings": [],
    "trades": [],
    "history": []
  },
  "bought": {
    "secureEconomy": true,
    "theftTimeoutRules": 1,
    "vaultInterestPercent": 10,
    "theft": {
      "duels": [],
      "targets": [
        {
          "playerId": "bob"
        }
      ],
      "compensation": [],
      "seals": []
    },
    "sealMarket": {
      "holdings": [],
      "offers": []
    },
    "loans": [],
    "trustAbilities": true,
    "itemEffects": true,
    "core2": true,
    "dread": 0.16999999999999998,
    "passives": true,
    "curseSight": true,
    "freeBuy": true,
    "fakeEffect": true,
    "cleanse": true,
    "challenge": true,
    "eventChoiceRules": 1,
    "statusLinks": 1,
    "ghosts": {
      "services": [],
      "jobs": []
    },
    "version": 5,
    "phase": "PORTALS",
    "encounter": 4,
    "encounterCount": null,
    "revision": 36,
    "roundRewardBase": 15,
    "survival": {
      "maxLife": 20,
      "encounterLifeCost": 1,
      "entryEnergyCost": 0
    },
    "maxEnergy": 10,
    "collectorAt": 5,
    "self": {
      "id": "alice",
      "credits": 483,
      "energy": 8,
      "statuses": [],
      "paused": null,
      "done": false,
      "selectedPortalId": null,
      "inspections": 0,
      "counters": 0,
      "activated": [],
      "score": 0,
      "accuracyBonus": 0,
      "eventOffer": null,
      "offerSlots": 0,
      "consequenceSlots": 0,
      "honorJob": false,
      "honestyReward": null,
      "caught": false,
      "subsidy": false,
      "revealedInfo": [],
      "dealMode": "any",
      "notes": [
        "ขอ Collector: โล่เขี้ยวออร์ก / แหวนตราราตรี / คาลิเปอร์วัดแรงบิด รับช่วง 4",
        "สัญญาหน้าประตู: cash",
        "ความอ่อนล้าจากมิติ: เสียพลัง 2",
        "Collector ส่งชุด cw-alice-2 มาแล้ว 5 ช่อง ราคาต้นทุนร่วม 48 เครดิต",
        "เปิดดู Collector ช่อง 1: ดาบเขี้ยวรอยแยก",
        "ซื้อ เหรียญผ่านแดน จาก Collector cw-alice-2: สินค้า 48 + ค่าธรรมเนียม 0 เครดิต ใช้ 0 พลัง"
      ],
      "passiveUses": {},
      "npcTrust": {},
      "cleansed": [],
      "wishRolls": 0,
      "life": 17,
      "recoveryUsed": false,
      "journal": [
        {
          "id": 0,
          "encounter": 1,
          "phase": "PORTALS",
          "action": "เริ่มการเดินทาง",
          "cause": "ทรัพยากรตั้งต้นของห้อง",
          "changes": [
            "เครดิต +500",
            "พลัง +10",
            "ชีวิต +20"
          ]
        },
        {
          "id": 1,
          "encounter": 1,
          "phase": "PORTALS",
          "action": "เลือกพบพ่อค้า",
          "cause": "เกิดจากเลือกพบพ่อค้า",
          "changes": []
        },
        {
          "id": 3,
          "encounter": 1,
          "phase": "APPRAISAL",
          "action": "เลือกทางในเหตุการณ์ · ค้อนรัง",
          "cause": "เลือก accept",
          "changes": [
            "เครดิต -1"
          ],
          "choice": "เลือก accept",
          "itemKind": "swarm-brood-hammer"
        },
        {
          "id": 5,
          "encounter": 1,
          "phase": "APPRAISAL",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": []
        },
        {
          "id": 7,
          "encounter": 1,
          "phase": "TRADE",
          "action": "เลือกทางในเหตุการณ์ · ค้อนรัง",
          "cause": "เลือก accept",
          "changes": [],
          "choice": "เลือก accept",
          "itemKind": "swarm-brood-hammer"
        },
        {
          "id": 9,
          "encounter": 1,
          "phase": "TRADE",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": []
        },
        {
          "id": 10,
          "encounter": 1,
          "phase": "TRADE",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": [
            "ชีวิต -1"
          ]
        },
        {
          "id": 11,
          "encounter": 1,
          "phase": "REVEAL",
          "action": "เริ่มช่วงใหม่",
          "cause": "ผลเมื่อเริ่มช่วงใหม่",
          "changes": [
            "เครดิต +10"
          ]
        },
        {
          "id": 13,
          "encounter": 2,
          "phase": "PORTALS",
          "action": "ส่งรายการ Collector",
          "cause": "ขอ Collector: โล่เขี้ยวออร์ก / แหวนตราราตรี / คาลิเปอร์วัดแรงบิด รับช่วง 4",
          "changes": []
        },
        {
          "id": 14,
          "encounter": 2,
          "phase": "PORTALS",
          "action": "เลือกพบพ่อค้า",
          "cause": "เกิดจากเลือกพบพ่อค้า",
          "changes": []
        },
        {
          "id": 16,
          "encounter": 2,
          "phase": "APPRAISAL",
          "action": "เลือกทางในเหตุการณ์ · ดาบเขี้ยวรอยแยก",
          "cause": "เลือก decline",
          "changes": [],
          "choice": "เลือก decline",
          "itemKind": "beast-riftfang-sword"
        },
        {
          "id": 18,
          "encounter": 2,
          "phase": "APPRAISAL",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": []
        },
        {
          "id": 20,
          "encounter": 2,
          "phase": "TRADE",
          "action": "เลือกทางในเหตุการณ์ · ดาบเขี้ยวรอยแยก",
          "cause": "เลือก decline",
          "changes": [],
          "choice": "เลือก decline",
          "itemKind": "beast-riftfang-sword"
        },
        {
          "id": 21,
          "encounter": 2,
          "phase": "TRADE",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": []
        },
        {
          "id": 22,
          "encounter": 2,
          "phase": "TRADE",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": [
            "ชีวิต -1"
          ]
        },
        {
          "id": 23,
          "encounter": 2,
          "phase": "REVEAL",
          "action": "เริ่มช่วงใหม่",
          "cause": "ผลเมื่อเริ่มช่วงใหม่",
          "changes": [
            "เครดิต +15"
          ]
        },
        {
          "id": 24,
          "encounter": 3,
          "phase": "PORTALS",
          "action": "เลือกทางในเหตุการณ์",
          "cause": "สัญญาหน้าประตู: cash",
          "changes": [
            "เครดิต -3"
          ],
          "choice": "เลือก cash"
        },
        {
          "id": 26,
          "encounter": 3,
          "phase": "PORTALS",
          "action": "เลือกพบพ่อค้า",
          "cause": "เกิดจากเลือกพบพ่อค้า",
          "changes": []
        },
        {
          "id": 28,
          "encounter": 3,
          "phase": "APPRAISAL",
          "action": "เลือกทางในเหตุการณ์ · แหวนตราราตรี",
          "cause": "เลือก decline",
          "changes": [],
          "choice": "เลือก decline",
          "itemKind": "vampire-nocturne-signet"
        },
        {
          "id": 30,
          "encounter": 3,
          "phase": "APPRAISAL",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": []
        },
        {
          "id": 32,
          "encounter": 3,
          "phase": "TRADE",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": []
        },
        {
          "id": 33,
          "encounter": 3,
          "phase": "TRADE",
          "action": "จบช่วง",
          "cause": "ความอ่อนล้าจากมิติ: เสียพลัง 2",
          "changes": [
            "พลัง -2",
            "ชีวิต -1"
          ]
        },
        {
          "id": 34,
          "encounter": 3,
          "phase": "REVEAL",
          "action": "เริ่มช่วงใหม่",
          "cause": "Collector ส่งชุด cw-alice-2 มาแล้ว 5 ช่อง ราคาต้นทุนร่วม 48 เครดิต",
          "changes": [
            "เครดิต +10"
          ]
        },
        {
          "id": 35,
          "encounter": 4,
          "phase": "PORTALS",
          "action": "เปิดดูสินค้า Collector",
          "cause": "เปิดดู Collector ช่อง 1: ดาบเขี้ยวรอยแยก",
          "changes": []
        },
        {
          "id": 36,
          "encounter": 4,
          "phase": "PORTALS",
          "action": "ซื้อจาก Collector",
          "cause": "ซื้อ เหรียญผ่านแดน จาก Collector cw-alice-2: สินค้า 48 + ค่าธรรมเนียม 0 เครดิต ใช้ 0 พลัง",
          "changes": [
            "เครดิต -48",
            "ได้รับ เหรียญผ่านแดน"
          ]
        }
      ],
      "paid": {
        "cw-alice-2-item-1": 48
      },
      "collectorWishlist": {
        "request": {
          "available": true,
          "kinds": [
            {
              "kind": "orc-tusk-shield",
              "name": "โล่เขี้ยวออร์ก",
              "image": "/art/comic/items/merchant-set-v1/orc-tusk-shield.png"
            },
            {
              "kind": "vampire-nocturne-signet",
              "name": "แหวนตราราตรี",
              "image": "/art/comic/items/merchant-set-v1/vampire-nocturne-signet.png"
            },
            {
              "kind": "autometa-torque-caliper",
              "name": "คาลิเปอร์วัดแรงบิด",
              "image": "/art/comic/items/merchant-set-v1/autometa-torque-caliper.png"
            },
            {
              "kind": "alien-thought-translator",
              "name": "เครื่องแปลความคิด",
              "image": "/art/comic/items/merchant-set-v1/alien-thought-translator.png"
            },
            {
              "kind": "darkone-crossing-token",
              "name": "เหรียญผ่านแดน",
              "image": "/art/comic/items/merchant-set-v1/darkone-crossing-token.png"
            },
            {
              "kind": "deepsea-tide-compass",
              "name": "เข็มทิศกระแสน้ำ",
              "image": "/art/comic/items/merchant-set-v1/deepsea-tide-compass.png"
            },
            {
              "kind": "swarm-brood-hammer",
              "name": "ค้อนรัง",
              "image": "/art/comic/items/merchant-set-v1/swarm-brood-hammer.png"
            },
            {
              "kind": "beast-riftfang-sword",
              "name": "ดาบเขี้ยวรอยแยก",
              "image": "/art/comic/items/merchant-set-v1/beast-riftfang-sword.png"
            }
          ],
          "dueAt": 6
        },
        "delivery": {
          "id": "cw-alice-2",
          "quoteId": "cw-alice-2:48:0:0",
          "status": "bought",
          "cost": {
            "price": 48,
            "fee": 0,
            "total": 48,
            "energy": 0
          },
          "canPeek": false,
          "canBuy": false,
          "reason": "phase",
          "slots": [
            {
              "id": "s0",
              "peek": {
                "kind": "beast-riftfang-sword",
                "name": "ดาบเขี้ยวรอยแยก",
                "image": "/art/comic/items/merchant-set-v1/beast-riftfang-sword.png",
                "rarity": "common"
              }
            },
            {
              "id": "s1"
            },
            {
              "id": "s2"
            },
            {
              "id": "s3"
            },
            {
              "id": "s4"
            }
          ]
        }
      },
      "portalRerollCost": 2,
      "pilotAcceptancePercent": 0,
      "pilotPriceChecks": 0,
      "personalVault": {
        "items": [],
        "credits": 0,
        "slots": 2,
        "nextSlotPrice": 10,
        "nextInterest": 0,
        "interestPercent": 10,
        "canWithdrawCredits": false
      },
      "merchantAbilities": [
        {
          "npc": "orc",
          "name": "ปิดดีล",
          "cooldown": 3,
          "target": "stock",
          "description": "ลดราคาซื้อสินค้า 1 ชิ้น 10/15/20% ตามขั้นความไว้ใจ ใช้กับเครดิตที่จ่ายจริง ไม่ลดค่าธรรมเนียม",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "autometa",
          "name": "วิเคราะห์สมบูรณ์",
          "cooldown": 3,
          "target": "stock",
          "description": "เปิดราคาจริง / ราคาและความแท้ / ข้อมูลทั้งหมดของสินค้า 1 ชิ้น ตามขั้นความไว้ใจ",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "alien",
          "name": "แลกเปลี่ยนต่างมิติ",
          "cooldown": 4,
          "target": "inventory",
          "description": "แลกของที่ถือเป็นตัวเลือกใหม่ 2/3/4 ชิ้น เลือกได้หนึ่ง มูลค่าคิดคะแนนไม่เกินต้นฉบับ เห็นข้อมูลเท่าที่ตรวจต้นฉบับไว้",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [
            "cw-alice-2-item-1"
          ],
          "statusIds": []
        },
        {
          "npc": "vampire",
          "name": "รักษาร่างต้น",
          "cooldown": 5,
          "target": "consumable",
          "description": "เปิดใช้ของใช้แล้วหมดโดยเก็บไว้ได้หนึ่งครั้งต่อชิ้น ขั้นสูงคืนพลัง 1/2 เพิ่มเติม ใช้กับสำเนาไม่ได้",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "darkone",
          "name": "ฉีกพันธสัญญา",
          "cooldown": 4,
          "target": "debuff",
          "description": "ลบ debuff ที่เลือกทันที ขั้นกลางคืนพลัง 1 ขั้นสูงให้เกราะป้องกัน debuff ครั้งถัดไป",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "deepsea",
          "name": "ชำระของต้องสาป",
          "cooldown": 4,
          "target": "inventory",
          "description": "ทำให้ของที่เลือกไร้คำสาป แม้ยังไม่ตรวจ ขั้นกลางเปิดความแท้ ขั้นสูงเปิดราคาด้วย ใช้สิทธิ์แม้ของเดิมไร้คำสาป",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [
            "cw-alice-2-item-1"
          ],
          "statusIds": []
        },
        {
          "npc": "swarm",
          "name": "แตกหน่อ",
          "cooldown": 5,
          "target": "inventory",
          "description": "สำเนาหนึ่งชิ้น มูลค่า 25/35/50% ของต้นฉบับ effect เหลือ 40% มีได้ชิ้นเดียวต่อต้นฉบับ สำเนาทำสำเนาต่อไม่ได้ ใช้สำเนาสิ้นเปลืองแล้วต้นฉบับทำซ้ำไม่ได้",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [
            "cw-alice-2-item-1"
          ],
          "statusIds": []
        },
        {
          "npc": "beast",
          "name": "เปลี่ยนสินค้าที่เสนอ",
          "cooldown": 3,
          "target": "stock",
          "description": "เลือกสินค้าที่ยังไม่ซื้อเพื่อรับตัวเลือกใหม่ 2/3/4 ชิ้น แล้วเลือกหนึ่งมาแทน ยังต้องซื้อปกติ เก็บของเดิมเป็นหนึ่งในตัวเลือกได้",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        }
      ],
      "inventory": [
        {
          "lastTradePrice": 48,
          "overpriced": true,
          "reappraisalUsed": false,
          "freeMerchantAction": false,
          "pilotUses": 0,
          "id": "cw-alice-2-item-1",
          "kind": "darkone-crossing-token",
          "npc": "darkone",
          "name": "เหรียญผ่านแดน",
          "image": "/art/comic/items/merchant-set-v1/darkone-crossing-token.png",
          "owner": "alice",
          "trustAbilities": true,
          "itemEffects": true,
          "ask": 21,
          "appraisal": null,
          "appearance": {
            "version": 1,
            "rarity": "common",
            "theme": "plain",
            "visualSeed": 17488185
          },
          "rarityPower": {
            "version": 1,
            "valueMultiplier": 1,
            "effectMultiplier": 1
          },
          "price": 21,
          "appraisalAccepted": null,
          "paid": 48,
          "lockedUntil": null,
          "knowledge": {},
          "certificate": false,
          "possibleBenefit": "ลดค่าล้างประวัติ 10% ต่อหน่วย effect รวมสูงสุด50%; หากราคาฐานมากกว่า0 ยังจ่ายอย่างน้อย1เครดิต",
          "possibleDrawback": "ไม่ยกเลิกดวล ไม่คืนความไว้ใจ ไม่ล้างคดีฟรี ไม่ให้ cashback",
          "condition": {
            "statusId": "D04",
            "discount": 4,
            "available": true,
            "required": false
          }
        }
      ],
      "stock": [],
      "portals": [
        {
          "id": "portal-4-0-0",
          "npc": "deepsea",
          "hint": "deepsea-tide-compass",
          "disabled": false
        },
        {
          "id": "portal-4-0-1",
          "npc": "beast",
          "hint": "beast-riftfang-sword",
          "disabled": false
        },
        {
          "id": "portal-4-0-2",
          "npc": "alien",
          "hint": "alien-thought-translator",
          "disabled": false
        }
      ],
      "counterLimit": 1,
      "stockBonus": {
        "tier": 0,
        "total": 0,
        "extra": 0,
        "need": 3,
        "npcs": [
          "orc",
          "vampire",
          "autometa",
          "alien",
          "darkone",
          "deepsea",
          "swarm",
          "beast"
        ]
      },
      "pulse": {
        "shards": 0,
        "perLife": 3,
        "perSale": 1,
        "wary": false
      },
      "core2Actions": {
        "theftUsed": false,
        "trustForSkill": 3
      }
    },
    "players": [
      {
        "id": "alice",
        "credits": 483,
        "energy": 8,
        "score": 0,
        "paused": null,
        "done": false,
        "itemCount": 1,
        "life": 17
      },
      {
        "id": "bob",
        "credits": 530,
        "energy": 9,
        "score": 0,
        "paused": null,
        "done": false,
        "itemCount": 0,
        "life": 17
      }
    ],
    "market": {
      "encounter": 4,
      "open": false,
      "budget": 0,
      "orders": []
    },
    "listings": [],
    "trades": [],
    "history": []
  },
  "closed": {
    "secureEconomy": true,
    "theftTimeoutRules": 1,
    "vaultInterestPercent": 10,
    "theft": {
      "duels": [],
      "targets": [
        {
          "playerId": "bob"
        }
      ],
      "compensation": [],
      "seals": []
    },
    "sealMarket": {
      "holdings": [],
      "offers": []
    },
    "loans": [],
    "trustAbilities": true,
    "itemEffects": true,
    "core2": true,
    "dread": 0.16999999999999998,
    "passives": true,
    "curseSight": true,
    "freeBuy": true,
    "fakeEffect": true,
    "cleanse": true,
    "challenge": true,
    "eventChoiceRules": 1,
    "statusLinks": 1,
    "ghosts": {
      "services": [],
      "jobs": []
    },
    "version": 5,
    "phase": "PORTALS",
    "encounter": 4,
    "encounterCount": null,
    "revision": 37,
    "roundRewardBase": 15,
    "survival": {
      "maxLife": 20,
      "encounterLifeCost": 1,
      "entryEnergyCost": 0
    },
    "maxEnergy": 10,
    "collectorAt": 5,
    "self": {
      "id": "alice",
      "credits": 531,
      "energy": 8,
      "statuses": [],
      "paused": null,
      "done": true,
      "selectedPortalId": null,
      "inspections": 0,
      "counters": 0,
      "activated": [],
      "score": 0,
      "accuracyBonus": 0,
      "eventOffer": null,
      "offerSlots": 0,
      "consequenceSlots": 0,
      "honorJob": false,
      "honestyReward": null,
      "caught": false,
      "subsidy": false,
      "revealedInfo": [],
      "dealMode": "any",
      "notes": [
        "ขอ Collector: โล่เขี้ยวออร์ก / แหวนตราราตรี / คาลิเปอร์วัดแรงบิด รับช่วง 4",
        "สัญญาหน้าประตู: cash",
        "ความอ่อนล้าจากมิติ: เสียพลัง 2",
        "Collector ส่งชุด cw-alice-2 มาแล้ว 5 ช่อง ราคาต้นทุนร่วม 48 เครดิต",
        "เปิดดู Collector ช่อง 1: ดาบเขี้ยวรอยแยก",
        "Collector ปิดชุด cw-alice-2: ข้ามชุด"
      ],
      "passiveUses": {},
      "npcTrust": {},
      "cleansed": [],
      "wishRolls": 0,
      "life": 17,
      "recoveryUsed": false,
      "journal": [
        {
          "id": 0,
          "encounter": 1,
          "phase": "PORTALS",
          "action": "เริ่มการเดินทาง",
          "cause": "ทรัพยากรตั้งต้นของห้อง",
          "changes": [
            "เครดิต +500",
            "พลัง +10",
            "ชีวิต +20"
          ]
        },
        {
          "id": 1,
          "encounter": 1,
          "phase": "PORTALS",
          "action": "เลือกพบพ่อค้า",
          "cause": "เกิดจากเลือกพบพ่อค้า",
          "changes": []
        },
        {
          "id": 3,
          "encounter": 1,
          "phase": "APPRAISAL",
          "action": "เลือกทางในเหตุการณ์ · ค้อนรัง",
          "cause": "เลือก accept",
          "changes": [
            "เครดิต -1"
          ],
          "choice": "เลือก accept",
          "itemKind": "swarm-brood-hammer"
        },
        {
          "id": 5,
          "encounter": 1,
          "phase": "APPRAISAL",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": []
        },
        {
          "id": 7,
          "encounter": 1,
          "phase": "TRADE",
          "action": "เลือกทางในเหตุการณ์ · ค้อนรัง",
          "cause": "เลือก accept",
          "changes": [],
          "choice": "เลือก accept",
          "itemKind": "swarm-brood-hammer"
        },
        {
          "id": 9,
          "encounter": 1,
          "phase": "TRADE",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": []
        },
        {
          "id": 10,
          "encounter": 1,
          "phase": "TRADE",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": [
            "ชีวิต -1"
          ]
        },
        {
          "id": 11,
          "encounter": 1,
          "phase": "REVEAL",
          "action": "เริ่มช่วงใหม่",
          "cause": "ผลเมื่อเริ่มช่วงใหม่",
          "changes": [
            "เครดิต +10"
          ]
        },
        {
          "id": 13,
          "encounter": 2,
          "phase": "PORTALS",
          "action": "ส่งรายการ Collector",
          "cause": "ขอ Collector: โล่เขี้ยวออร์ก / แหวนตราราตรี / คาลิเปอร์วัดแรงบิด รับช่วง 4",
          "changes": []
        },
        {
          "id": 14,
          "encounter": 2,
          "phase": "PORTALS",
          "action": "เลือกพบพ่อค้า",
          "cause": "เกิดจากเลือกพบพ่อค้า",
          "changes": []
        },
        {
          "id": 16,
          "encounter": 2,
          "phase": "APPRAISAL",
          "action": "เลือกทางในเหตุการณ์ · ดาบเขี้ยวรอยแยก",
          "cause": "เลือก decline",
          "changes": [],
          "choice": "เลือก decline",
          "itemKind": "beast-riftfang-sword"
        },
        {
          "id": 18,
          "encounter": 2,
          "phase": "APPRAISAL",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": []
        },
        {
          "id": 20,
          "encounter": 2,
          "phase": "TRADE",
          "action": "เลือกทางในเหตุการณ์ · ดาบเขี้ยวรอยแยก",
          "cause": "เลือก decline",
          "changes": [],
          "choice": "เลือก decline",
          "itemKind": "beast-riftfang-sword"
        },
        {
          "id": 21,
          "encounter": 2,
          "phase": "TRADE",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": []
        },
        {
          "id": 22,
          "encounter": 2,
          "phase": "TRADE",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": [
            "ชีวิต -1"
          ]
        },
        {
          "id": 23,
          "encounter": 2,
          "phase": "REVEAL",
          "action": "เริ่มช่วงใหม่",
          "cause": "ผลเมื่อเริ่มช่วงใหม่",
          "changes": [
            "เครดิต +15"
          ]
        },
        {
          "id": 24,
          "encounter": 3,
          "phase": "PORTALS",
          "action": "เลือกทางในเหตุการณ์",
          "cause": "สัญญาหน้าประตู: cash",
          "changes": [
            "เครดิต -3"
          ],
          "choice": "เลือก cash"
        },
        {
          "id": 26,
          "encounter": 3,
          "phase": "PORTALS",
          "action": "เลือกพบพ่อค้า",
          "cause": "เกิดจากเลือกพบพ่อค้า",
          "changes": []
        },
        {
          "id": 28,
          "encounter": 3,
          "phase": "APPRAISAL",
          "action": "เลือกทางในเหตุการณ์ · แหวนตราราตรี",
          "cause": "เลือก decline",
          "changes": [],
          "choice": "เลือก decline",
          "itemKind": "vampire-nocturne-signet"
        },
        {
          "id": 30,
          "encounter": 3,
          "phase": "APPRAISAL",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": []
        },
        {
          "id": 32,
          "encounter": 3,
          "phase": "TRADE",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": []
        },
        {
          "id": 33,
          "encounter": 3,
          "phase": "TRADE",
          "action": "จบช่วง",
          "cause": "ความอ่อนล้าจากมิติ: เสียพลัง 2",
          "changes": [
            "พลัง -2",
            "ชีวิต -1"
          ]
        },
        {
          "id": 34,
          "encounter": 3,
          "phase": "REVEAL",
          "action": "เริ่มช่วงใหม่",
          "cause": "Collector ส่งชุด cw-alice-2 มาแล้ว 5 ช่อง ราคาต้นทุนร่วม 48 เครดิต",
          "changes": [
            "เครดิต +10"
          ]
        },
        {
          "id": 35,
          "encounter": 4,
          "phase": "PORTALS",
          "action": "เปิดดูสินค้า Collector",
          "cause": "เปิดดู Collector ช่อง 1: ดาบเขี้ยวรอยแยก",
          "changes": []
        },
        {
          "id": 36,
          "encounter": 4,
          "phase": "PORTALS",
          "action": "ข้าม Collector",
          "cause": "Collector ปิดชุด cw-alice-2: ข้ามชุด",
          "changes": []
        },
        {
          "id": 37,
          "encounter": 4,
          "phase": "PORTALS",
          "action": "จบช่วง",
          "cause": "เกิดจากจบช่วง",
          "changes": []
        }
      ],
      "collectorWishlist": {
        "request": {
          "available": false,
          "kinds": [
            {
              "kind": "orc-tusk-shield",
              "name": "โล่เขี้ยวออร์ก",
              "image": "/art/comic/items/merchant-set-v1/orc-tusk-shield.png"
            },
            {
              "kind": "vampire-nocturne-signet",
              "name": "แหวนตราราตรี",
              "image": "/art/comic/items/merchant-set-v1/vampire-nocturne-signet.png"
            },
            {
              "kind": "autometa-torque-caliper",
              "name": "คาลิเปอร์วัดแรงบิด",
              "image": "/art/comic/items/merchant-set-v1/autometa-torque-caliper.png"
            },
            {
              "kind": "alien-thought-translator",
              "name": "เครื่องแปลความคิด",
              "image": "/art/comic/items/merchant-set-v1/alien-thought-translator.png"
            },
            {
              "kind": "darkone-crossing-token",
              "name": "เหรียญผ่านแดน",
              "image": "/art/comic/items/merchant-set-v1/darkone-crossing-token.png"
            },
            {
              "kind": "deepsea-tide-compass",
              "name": "เข็มทิศกระแสน้ำ",
              "image": "/art/comic/items/merchant-set-v1/deepsea-tide-compass.png"
            },
            {
              "kind": "swarm-brood-hammer",
              "name": "ค้อนรัง",
              "image": "/art/comic/items/merchant-set-v1/swarm-brood-hammer.png"
            },
            {
              "kind": "beast-riftfang-sword",
              "name": "ดาบเขี้ยวรอยแยก",
              "image": "/art/comic/items/merchant-set-v1/beast-riftfang-sword.png"
            }
          ],
          "dueAt": 6
        },
        "delivery": {
          "id": "cw-alice-2",
          "quoteId": "cw-alice-2:48:0:0",
          "status": "skipped",
          "cost": {
            "price": 48,
            "fee": 0,
            "total": 48,
            "energy": 0
          },
          "canPeek": false,
          "canBuy": false,
          "reason": "phase",
          "slots": [
            {
              "id": "s0",
              "peek": {
                "kind": "beast-riftfang-sword",
                "name": "ดาบเขี้ยวรอยแยก",
                "image": "/art/comic/items/merchant-set-v1/beast-riftfang-sword.png",
                "rarity": "common"
              }
            },
            {
              "id": "s1"
            },
            {
              "id": "s2"
            },
            {
              "id": "s3"
            },
            {
              "id": "s4"
            }
          ]
        }
      },
      "portalRerollCost": 2,
      "pilotAcceptancePercent": 0,
      "pilotPriceChecks": 0,
      "personalVault": {
        "items": [],
        "credits": 0,
        "slots": 2,
        "nextSlotPrice": 10,
        "nextInterest": 0,
        "interestPercent": 10,
        "canWithdrawCredits": false
      },
      "merchantAbilities": [
        {
          "npc": "orc",
          "name": "ปิดดีล",
          "cooldown": 3,
          "target": "stock",
          "description": "ลดราคาซื้อสินค้า 1 ชิ้น 10/15/20% ตามขั้นความไว้ใจ ใช้กับเครดิตที่จ่ายจริง ไม่ลดค่าธรรมเนียม",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "autometa",
          "name": "วิเคราะห์สมบูรณ์",
          "cooldown": 3,
          "target": "stock",
          "description": "เปิดราคาจริง / ราคาและความแท้ / ข้อมูลทั้งหมดของสินค้า 1 ชิ้น ตามขั้นความไว้ใจ",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "alien",
          "name": "แลกเปลี่ยนต่างมิติ",
          "cooldown": 4,
          "target": "inventory",
          "description": "แลกของที่ถือเป็นตัวเลือกใหม่ 2/3/4 ชิ้น เลือกได้หนึ่ง มูลค่าคิดคะแนนไม่เกินต้นฉบับ เห็นข้อมูลเท่าที่ตรวจต้นฉบับไว้",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "vampire",
          "name": "รักษาร่างต้น",
          "cooldown": 5,
          "target": "consumable",
          "description": "เปิดใช้ของใช้แล้วหมดโดยเก็บไว้ได้หนึ่งครั้งต่อชิ้น ขั้นสูงคืนพลัง 1/2 เพิ่มเติม ใช้กับสำเนาไม่ได้",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "darkone",
          "name": "ฉีกพันธสัญญา",
          "cooldown": 4,
          "target": "debuff",
          "description": "ลบ debuff ที่เลือกทันที ขั้นกลางคืนพลัง 1 ขั้นสูงให้เกราะป้องกัน debuff ครั้งถัดไป",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "deepsea",
          "name": "ชำระของต้องสาป",
          "cooldown": 4,
          "target": "inventory",
          "description": "ทำให้ของที่เลือกไร้คำสาป แม้ยังไม่ตรวจ ขั้นกลางเปิดความแท้ ขั้นสูงเปิดราคาด้วย ใช้สิทธิ์แม้ของเดิมไร้คำสาป",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "swarm",
          "name": "แตกหน่อ",
          "cooldown": 5,
          "target": "inventory",
          "description": "สำเนาหนึ่งชิ้น มูลค่า 25/35/50% ของต้นฉบับ effect เหลือ 40% มีได้ชิ้นเดียวต่อต้นฉบับ สำเนาทำสำเนาต่อไม่ได้ ใช้สำเนาสิ้นเปลืองแล้วต้นฉบับทำซ้ำไม่ได้",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        },
        {
          "npc": "beast",
          "name": "เปลี่ยนสินค้าที่เสนอ",
          "cooldown": 3,
          "target": "stock",
          "description": "เลือกสินค้าที่ยังไม่ซื้อเพื่อรับตัวเลือกใหม่ 2/3/4 ชิ้น แล้วเลือกหนึ่งมาแทน ยังต้องซื้อปกติ เก็บของเดิมเป็นหนึ่งในตัวเลือกได้",
          "trust": 0,
          "tier": 0,
          "remaining": 0,
          "ready": false,
          "reason": "ต้องมีความไว้ใจอย่างน้อย 1",
          "itemIds": [],
          "statusIds": []
        }
      ],
      "inventory": [],
      "stock": [],
      "portals": [
        {
          "id": "portal-4-0-0",
          "npc": "deepsea",
          "hint": "deepsea-tide-compass",
          "disabled": false
        },
        {
          "id": "portal-4-0-1",
          "npc": "beast",
          "hint": "beast-riftfang-sword",
          "disabled": false
        },
        {
          "id": "portal-4-0-2",
          "npc": "alien",
          "hint": "alien-thought-translator",
          "disabled": false
        }
      ],
      "counterLimit": 1,
      "stockBonus": {
        "tier": 0,
        "total": 0,
        "extra": 0,
        "need": 3,
        "npcs": [
          "orc",
          "vampire",
          "autometa",
          "alien",
          "darkone",
          "deepsea",
          "swarm",
          "beast"
        ]
      },
      "pulse": {
        "shards": 0,
        "perLife": 3,
        "perSale": 1,
        "wary": false
      },
      "core2Actions": {
        "theftUsed": false,
        "trustForSkill": 3
      }
    },
    "players": [
      {
        "id": "alice",
        "credits": 531,
        "energy": 8,
        "score": 0,
        "paused": null,
        "done": true,
        "itemCount": 0,
        "life": 17
      },
      {
        "id": "bob",
        "credits": 530,
        "energy": 9,
        "score": 0,
        "paused": null,
        "done": false,
        "itemCount": 0,
        "life": 17
      }
    ],
    "market": {
      "encounter": 4,
      "open": false,
      "budget": 0,
      "orders": []
    },
    "listings": [],
    "trades": [],
    "history": []
  }
} as unknown as Record<string,AppraisalView>;
