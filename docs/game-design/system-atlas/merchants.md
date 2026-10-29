# พ่อค้าและความสามารถ

สินค้าใช้ชุดใหม่ 56 เท่านั้น favorite/kinds/families ของ runtime ยังเป็นเงื่อนไขเก่า ต้องออกแบบ mapping ก่อนใช้งานกับชุดใหม่

## ออร์กผู้รักษาเกียรติ

```json
{
  "id": "orc",
  "name": "ออร์กผู้รักษาเกียรติ",
  "sensitivity": 1,
  "condition": "D03",
  "discount": 2,
  "reservation": [
    0.45,
    0.8
  ],
  "favorite": [
    "blade",
    "amulet",
    "food"
  ],
  "hint": "ราคาที่ดูถูกอาจทำให้เสียทรัพย์",
  "ability": {
    "name": "ปิดดีล",
    "cooldown": 3,
    "target": "stock",
    "description": "ลดราคาซื้อสินค้า 1 ชิ้น 10/15/20% ตามขั้นความไว้ใจ ใช้กับเครดิตที่จ่ายจริง ไม่ลดค่าธรรมเนียม"
  },
  "personalEvent": "E113",
  "newItemIds": [
    "orc-oath-sword",
    "orc-tusk-shield",
    "orc-ironroot-greaves",
    "orc-ember-salve",
    "orc-bone-war-drum",
    "orc-tally-beads",
    "orc-clan-forge-tongs"
  ],
  "favoriteStatus": "runtime legacy family predicate; no automatic remap of new56 from art/type"
}
```

## พ่อค้าแวมไพร์

```json
{
  "id": "vampire",
  "name": "พ่อค้าแวมไพร์",
  "sensitivity": 0.75,
  "condition": "D10",
  "discount": 3,
  "reservation": [
    0.35,
    0.65
  ],
  "favorite": [
    "orb",
    "mirror",
    "blade"
  ],
  "hint": "ส่วนลดแลกการฟื้นพลังที่ลดลง",
  "ability": {
    "name": "รักษาร่างต้น",
    "cooldown": 5,
    "target": "consumable",
    "description": "เปิดใช้ของใช้แล้วหมดโดยเก็บไว้ได้หนึ่งครั้งต่อชิ้น ขั้นสูงคืนพลัง 1/2 เพิ่มเติม ใช้กับสำเนาไม่ได้"
  },
  "personalEvent": "E109",
  "newItemIds": [
    "vampire-mist-cloak",
    "vampire-nocturne-signet",
    "vampire-shadow-wine-decanter",
    "vampire-gloam-violin",
    "vampire-mist-atomizer",
    "vampire-midnight-invitation",
    "vampire-mooncut-sword"
  ],
  "favoriteStatus": "runtime legacy family predicate; no automatic remap of new56 from art/type"
}
```

## นักค้าจักรกล Autometa

```json
{
  "id": "autometa",
  "name": "นักค้าจักรกล Autometa",
  "sensitivity": 0.5,
  "condition": "D06",
  "discount": 3,
  "reservation": [
    0.7,
    0.9
  ],
  "favorite": [
    "scanner",
    "battery",
    "key"
  ],
  "hint": "ตรวจจับต่ำ แต่ราคามีกฎตายตัวและของเพิ่มภาระพลัง",
  "ability": {
    "name": "วิเคราะห์สมบูรณ์",
    "cooldown": 3,
    "target": "stock",
    "description": "เปิดราคาจริง / ราคาและความแท้ / ข้อมูลทั้งหมดของสินค้า 1 ชิ้น ตามขั้นความไว้ใจ"
  },
  "personalEvent": "E112",
  "newItemIds": [
    "autometa-coil-repeater",
    "autometa-clockwork-sentry",
    "autometa-data-prism",
    "autometa-coolant-canister",
    "autometa-torque-caliper",
    "autometa-folding-beacon",
    "autometa-servo-harness"
  ],
  "favoriteStatus": "runtime legacy family predicate; no automatic remap of new56 from art/type"
}
```

## ผู้แลกเปลี่ยน Alien

```json
{
  "id": "alien",
  "name": "ผู้แลกเปลี่ยน Alien",
  "sensitivity": 1.25,
  "condition": "D02",
  "discount": 3,
  "reservation": [
    0.4,
    0.85
  ],
  "favorite": [
    "mask",
    "orb",
    "potion"
  ],
  "hint": "ภาษาและข้อมูลราคาไม่แน่นอน",
  "ability": {
    "name": "แลกเปลี่ยนต่างมิติ",
    "cooldown": 4,
    "target": "inventory",
    "description": "แลกของที่ถือเป็นตัวเลือกใหม่ 2/3/4 ชิ้น เลือกได้หนึ่ง มูลค่าคิดคะแนนไม่เกินต้นฉบับ เห็นข้อมูลเท่าที่ตรวจต้นฉบับไว้"
  },
  "personalEvent": "E110",
  "newItemIds": [
    "alien-spore-lantern",
    "alien-echoweave-shawl",
    "alien-star-chart-membrane",
    "alien-biobright-seedpod",
    "alien-thought-translator",
    "alien-phase-dial",
    "alien-phase-staff"
  ],
  "favoriteStatus": "runtime legacy family predicate; no automatic remap of new56 from art/type"
}
```

## Dark One

```json
{
  "id": "darkone",
  "name": "Dark One",
  "sensitivity": 1.5,
  "condition": "D04",
  "discount": 4,
  "reservation": [
    0.25,
    0.7
  ],
  "favorite": [
    "key",
    "amulet",
    "mirror"
  ],
  "hint": "สัญญากดราคามีผลถึงชีวิต ต้องยอมรับก่อน",
  "ability": {
    "name": "ฉีกพันธสัญญา",
    "cooldown": 4,
    "target": "debuff",
    "description": "ลบ debuff ที่เลือกทันที ขั้นกลางคืนพลัง 1 ขั้นสูงให้เกราะป้องกัน debuff ครั้งถัดไป"
  },
  "personalEvent": "E111",
  "newItemIds": [
    "darkone-null-sword",
    "darkone-null-testament",
    "darkone-debt-chain",
    "darkone-omen-censer",
    "darkone-ash-seal",
    "darkone-crossing-token",
    "darkone-silence-snuffer"
  ],
  "favoriteStatus": "runtime legacy family predicate; no automatic remap of new56 from art/type"
}
```

## อสูรใต้ทะเลลึก

```json
{
  "id": "deepsea",
  "name": "อสูรใต้ทะเลลึก",
  "sensitivity": 1.1,
  "condition": "D12",
  "discount": 3,
  "reservation": [
    0.3,
    0.75
  ],
  "favorite": [
    "potion",
    "orb",
    "amulet"
  ],
  "hint": "เสียงจากห้วงลึกกดดันทุกการต่อรอง ส่วนลดแลกแรงดันที่ทำให้ซื้อครั้งถัดไปแพงขึ้น",
  "ability": {
    "name": "ชำระของต้องสาป",
    "cooldown": 4,
    "target": "inventory",
    "description": "ทำให้ของที่เลือกไร้คำสาป แม้ยังไม่ตรวจ ขั้นกลางเปิดความแท้ ขั้นสูงเปิดราคาด้วย ใช้สิทธิ์แม้ของเดิมไร้คำสาป"
  },
  "personalEvent": "E115",
  "newItemIds": [
    "deepsea-abyss-trident",
    "deepsea-pressure-cuirass",
    "deepsea-tide-compass",
    "deepsea-kelp-saddle",
    "deepsea-tideglass-buoy",
    "deepsea-lanternfish-cage",
    "deepsea-whale-conch-horn"
  ],
  "favoriteStatus": "runtime legacy family predicate; no automatic remap of new56 from art/type"
}
```

## The Swarm ฝูงมนุษย์แมลง

```json
{
  "id": "swarm",
  "name": "The Swarm ฝูงมนุษย์แมลง",
  "sensitivity": 0.8,
  "condition": "D11",
  "discount": 3,
  "reservation": [
    0.4,
    0.8
  ],
  "favorite": [
    "food",
    "blade",
    "battery"
  ],
  "hint": "ทุกตัวในฝูงฟังการต่อรองพร้อมกัน ส่วนลดแลกพิษที่กัดพลังท้ายช่วง",
  "ability": {
    "name": "แตกหน่อ",
    "cooldown": 5,
    "target": "inventory",
    "description": "สำเนาหนึ่งชิ้น มูลค่า 25/35/50% ของต้นฉบับ effect เหลือ 40% มีได้ชิ้นเดียวต่อต้นฉบับ สำเนาทำสำเนาต่อไม่ได้ ใช้สำเนาสิ้นเปลืองแล้วต้นฉบับทำซ้ำไม่ได้"
  },
  "personalEvent": "E116",
  "newItemIds": [
    "swarm-brood-hammer",
    "swarm-pheromone-sprayer",
    "swarm-hive-egg-cluster",
    "swarm-resin-spool",
    "swarm-wing-membrane-glider",
    "swarm-pupa-cradle",
    "swarm-chitin-cuirass"
  ],
  "favoriteStatus": "runtime legacy family predicate; no automatic remap of new56 from art/type"
}
```

## สัตว์นำทางข้ามมิติ

```json
{
  "id": "beast",
  "name": "สัตว์นำทางข้ามมิติ",
  "sensitivity": 0.6,
  "condition": "D01",
  "discount": 1,
  "reservation": [
    0.35,
    0.6
  ],
  "favorite": [
    "food",
    "potion",
    "battery"
  ],
  "hint": "อาหารแลกการตรวจที่ประหยัดแรง",
  "ability": {
    "name": "เปลี่ยนสินค้าที่เสนอ",
    "cooldown": 3,
    "target": "stock",
    "description": "เลือกสินค้าที่ยังไม่ซื้อเพื่อรับตัวเลือกใหม่ 2/3/4 ชิ้น แล้วเลือกหนึ่งมาแทน ยังต้องซื้อปกติ เก็บของเดิมเป็นหนึ่งในตัวเลือกได้"
  },
  "personalEvent": "E114",
  "newItemIds": [
    "beast-trail-scent-disc",
    "beast-tracker-horn",
    "beast-rift-saddle",
    "beast-springjaw-trap",
    "beast-amber-fur-mantle",
    "beast-fangline-lasso",
    "beast-riftfang-sword"
  ],
  "favoriteStatus": "runtime legacy family predicate; no automatic remap of new56 from art/type"
}
```