# Events — 132 รายการ

ทางเลือกเป็น candidate หรือเวอร์ชันตาม config ไม่ใช่ทั้งหมดที่ผู้เล่นเลือกได้พร้อมกัน เงื่อนไขเต็มอยู่ใน data.json → policies / policyFunctions

## E01 ประตูคลาดมิติ

ประตูกำลังเลื่อนหนี ใช้พลัง 1 ยึดประตูแรกไว้ หรือปล่อยไปแล้วเลือกจากประตูที่เหลือ

- ตระกูล: base; flags: base + global gates
- จังหวะ: ก่อนเข้าประตู; มีตัวเลือกสำรอง
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:9](../../../apps/comic/src/game/appraisal/content.ts#L9)
- ทางเลือก: switch (source-dependent), stay (source-dependent), decline (source-dependent)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:175, policy:apps/comic/src/game/appraisal/events.ts:190, policy:apps/comic/src/game/appraisal/events.ts:328, policy:apps/comic/src/game/appraisal/events.ts:if:8247, policy:apps/comic/src/game/appraisal/events.ts:if:9537, policy:apps/comic/src/game/appraisal/events.ts:if:26048
- Operations: operation:apps/comic/src/game/appraisal/events.ts:28752

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E02 คำทักทายแห่งเกียรติ

ออร์กขอให้ประเมินอย่างมีเกียรติ ถ้าราคาที่คุณให้ห่างจากมูลค่าจริงไม่เกิน 10% ได้ B07 แต่ถ้าพลาดเกินนั้น โอกาสถูกจับผิดเพิ่ม 10%

- ตระกูล: base; flags: base + global gates
- จังหวะ: พบออร์ก; ก่อนประเมิน
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:15](../../../apps/comic/src/game/appraisal/content.ts#L15)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:122, policy:apps/comic/src/game/appraisal/events.ts:329
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E03 สัมผัสชีพจร

Vampire เสนอฟื้นพลัง 3 จ่าย 2 เครดิต หรือจ่ายด้วยเลือดแล้วรับ D10 แทน

- ตระกูล: base; flags: base + global gates
- จังหวะ: พบ Vampire; พลังไม่เต็ม
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:21](../../../apps/comic/src/game/appraisal/content.ts#L21)
- ทางเลือก: decline (source-dependent), pay (source-dependent), debt (source-dependent)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:123, policy:apps/comic/src/game/appraisal/events.ts:191, policy:apps/comic/src/game/appraisal/events.ts:330, policy:apps/comic/src/simulation/appraisal.ts:if:3130
- Operations: operation:apps/comic/src/game/appraisal/events.ts:29020, operation:apps/comic/src/game/appraisal/events.ts:29048, operation:apps/comic/src/game/appraisal/events.ts:29070, operation:apps/comic/src/game/appraisal/events.ts:29138

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E04 การสอบเทียบ Autometa

Autometa สอบเทียบเครื่องให้ จ่าย 1 เครดิต รับ B01

- ตระกูล: base; flags: base + global gates
- จังหวะ: พบ Autometa; มีสินค้าที่ยังไม่ทราบราคา
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:27](../../../apps/comic/src/game/appraisal/content.ts#L27)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:124, policy:apps/comic/src/game/appraisal/events.ts:331
- Operations: operation:apps/comic/src/game/appraisal/events.ts:29202, operation:apps/comic/src/game/appraisal/events.ts:29225

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E05 ภาษาที่ไม่มีบนโลก

จ้างเครื่องแปลภาษา Alien ใช้พลัง 1 รับ B02

- ตระกูล: base; flags: base + global gates
- จังหวะ: พบ alien; ยังมีข้อมูลผลสินค้าที่ยังไม่รู้
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:33](../../../apps/comic/src/game/appraisal/content.ts#L33)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:125, policy:apps/comic/src/game/appraisal/events.ts:332
- Operations: operation:apps/comic/src/game/appraisal/events.ts:29270, operation:apps/comic/src/game/appraisal/events.ts:29293

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E06 ประตูรับสารภาพ

สารภาพต่อ Dark One แล้ว debuff ที่คุณเลือกจะหายไปหนึ่งอย่าง แต่ต้องรับ D04 หรือ D07 แทน

- ตระกูล: base; flags: base + global gates
- จังหวะ: พบ dark one; มี debuff และมี encounter ถัดไป
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:39](../../../apps/comic/src/game/appraisal/content.ts#L39)
- ทางเลือก: decline (source-dependent), interest (source-dependent), seal (source-dependent)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:126, policy:apps/comic/src/game/appraisal/events.ts:194, policy:apps/comic/src/game/appraisal/events.ts:333, policy:apps/comic/src/simulation/appraisal.ts:if:3903
- Operations: operation:apps/comic/src/game/appraisal/events.ts:29542, operation:apps/comic/src/game/appraisal/events.ts:29568

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E07 สัตว์นำทาง

ป้อนอาหารหนึ่งชิ้นให้สัตว์นำทาง รับ B05

- ตระกูล: base; flags: base + global gates
- จังหวะ: ผู้มาเยือนเป็นสัตว์; ยังตรวจได้อย่างน้อยหนึ่งครั้ง
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:45](../../../apps/comic/src/game/appraisal/content.ts#L45)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:127, policy:apps/comic/src/game/appraisal/events.ts:334, policy:apps/comic/src/game/appraisal/events.ts:if:18348
- Operations: operation:apps/comic/src/game/appraisal/events.ts:29678, operation:apps/comic/src/game/appraisal/events.ts:29699

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": [
    {
      "owner": "code:apps/comic/src/game/appraisal/events.ts:eventEligible",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 127,
        "endLine": 127
      },
      "expression": "kindOwned(state,p,'food')",
      "legacyKinds": [
        "food"
      ],
      "status": "unresolved-new56-mapping",
      "start": 10540,
      "end": 10566
    },
    {
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 334,
        "endLine": 334
      },
      "expression": "ownKind('food')",
      "legacyKinds": [
        "food"
      ],
      "status": "unresolved-new56-mapping",
      "start": 29623,
      "end": 29638
    }
  ]
}
```

## E08 ผู้มาเยือนคู่แข่ง

พ่อค้าสองรายแย่งโต๊ะคุณ เลือกรายที่รับเครดิตอย่างเดียว หรือรายที่ลดราคาแต่ต้องรับเงื่อนไข เลือกได้รายเดียว

- ตระกูล: base; flags: base + global gates
- จังหวะ: ก่อนพบ NPC; มีข้อเสนอสองชุด
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:51](../../../apps/comic/src/game/appraisal/content.ts#L51)
- ทางเลือก: cash (source-dependent), condition (source-dependent), decline (source-dependent)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:195, policy:apps/comic/src/game/appraisal/events.ts:335, policy:apps/comic/src/game/appraisal/events.ts:if:8247, policy:apps/comic/src/game/appraisal/events.ts:if:8321, policy:apps/comic/src/game/appraisal/events.ts:if:9537
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E09 พ่อค้ากำลังรีบ

พ่อค้ารีบปิดร้าน ซื้อของที่เลือกลด 2 เครดิต แต่รับ D08

- ตระกูล: base; flags: base + global gates
- จังหวะ: พบ NPC; ยังมีสิทธิ์ต่อรอง
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:57](../../../apps/comic/src/game/appraisal/content.ts#L57)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:128, policy:apps/comic/src/game/appraisal/events.ts:336, policy:apps/comic/src/simulation/appraisal.ts:if:4902
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E10 ค่าผ่านม่านภาพลวง

ม่านภาพลวงขวางประตูแรก จ่าย 2 เครดิตเพื่อผ่านตามปกติ ผ่านฟรีแต่รับ D02 ถึงจบช่วงนี้ หรือเลี่ยงไปประตูอื่น

- ตระกูล: base; flags: base + global gates
- จังหวะ: ก่อนพบ NPC; ยังมีข้อมูลราคาไม่ทราบ
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:63](../../../apps/comic/src/game/appraisal/content.ts#L63)
- ทางเลือก: fog (source-dependent), switch (source-dependent), pay (source-dependent), decline (source-dependent)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:176, policy:apps/comic/src/game/appraisal/events.ts:196, policy:apps/comic/src/game/appraisal/events.ts:337, policy:apps/comic/src/game/appraisal/events.ts:if:8247, policy:apps/comic/src/game/appraisal/events.ts:if:9537, policy:apps/comic/src/game/appraisal/events.ts:if:26048
- Operations: operation:apps/comic/src/game/appraisal/events.ts:29969, operation:apps/comic/src/game/appraisal/events.ts:30016

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E11 รอยประทับโรงงาน

ตรวจรอยประทับว่าของแท้ไหม ตรวจอย่างระวังใช้พลัง 2 หรือฝืนตรวจใช้พลัง 1 แล้วรับ D01

- ตระกูล: base; flags: base + global gates
- จังหวะ: สินค้ายังไม่ทราบความแท้
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:69](../../../apps/comic/src/game/appraisal/content.ts#L69)
- ทางเลือก: careful (source-dependent), force (source-dependent), decline (source-dependent)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:129, policy:apps/comic/src/game/appraisal/events.ts:197, policy:apps/comic/src/game/appraisal/events.ts:338, policy:apps/comic/src/game/appraisal/events.ts:if:18022, policy:apps/comic/src/simulation/appraisal.ts:if:3442
- Operations: operation:apps/comic/src/game/appraisal/events.ts:30175, operation:apps/comic/src/game/appraisal/events.ts:30280

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E12 ใบรับรองน่าสงสัย

จ่าย 1 เครดิต ตรวจว่าใบรับรองของพ่อค้าพูดจริงไหม ผลนี้รู้แค่คุณ

- ตระกูล: base; flags: base + global gates
- จังหวะ: NPC มีคำรับรองที่ตรวจเทียบได้
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:75](../../../apps/comic/src/game/appraisal/content.ts#L75)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:130, policy:apps/comic/src/game/appraisal/events.ts:339, policy:apps/comic/src/game/appraisal/events.ts:if:18104
- Operations: operation:apps/comic/src/game/appraisal/events.ts:30463

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E13 ตาชั่งของคู่

ใช้พลัง 1 ชั่งของสองชิ้นในร้าน รู้ว่าชิ้นไหนมีมูลค่าสูงกว่า แต่ไม่รู้ตัวเลข

- ตระกูล: base; flags: base + global gates
- จังหวะ: NPC เสนอสินค้าสองชิ้นที่ยังไม่ทราบราคา
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:81](../../../apps/comic/src/game/appraisal/content.ts#L81)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:131, policy:apps/comic/src/game/appraisal/events.ts:340
- Operations: operation:apps/comic/src/game/appraisal/events.ts:30705

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E14 ใบราคาจากอดีต

จ่าย 1 เครดิต ดูราคาที่ของแบบนี้เคยซื้อขายจริง เป็นแค่เบาะแส ไม่ใช่มูลค่าของชิ้นนี้

- ตระกูล: base; flags: base + global gates
- จังหวะ: มีประวัติซื้อขาย family เดียวกันที่เปิดเผยได้
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:87](../../../apps/comic/src/game/appraisal/content.ts#L87)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:132, policy:apps/comic/src/game/appraisal/events.ts:341
- Operations: operation:apps/comic/src/game/appraisal/events.ts:30939

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E15 การสแกนที่เหลือช่องเดียว

เครื่องสแกนเหลือช่องเดียว ใช้พลัง 1 เลือกรับ B01 หรือ B02 อย่างใดอย่างหนึ่ง

- ตระกูล: base; flags: base + global gates
- จังหวะ: ยังตรวจได้; มีข้อมูลไม่ทราบ
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:93](../../../apps/comic/src/game/appraisal/content.ts#L93)
- ทางเลือก: price (source-dependent), curse (source-dependent), decline (source-dependent)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:133, policy:apps/comic/src/game/appraisal/events.ts:198, policy:apps/comic/src/game/appraisal/events.ts:342
- Operations: operation:apps/comic/src/game/appraisal/events.ts:31112, operation:apps/comic/src/game/appraisal/events.ts:31135

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E16 แสงที่เผยเงื่อนไข

ใช้พลัง 1 ส่องสินค้าที่เลือก เปิดผลของสินค้าและบอกว่ามีคำสาปหรือไม่

- ตระกูล: base; flags: base + global gates
- จังหวะ: สินค้ามี buff/debuff ที่ยังไม่ทราบจังหวะ
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:99](../../../apps/comic/src/game/appraisal/content.ts#L99)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:134, policy:apps/comic/src/game/appraisal/events.ts:343, policy:apps/comic/src/simulation/appraisal.ts:if:3571
- Operations: operation:apps/comic/src/game/appraisal/events.ts:31220

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E17 พยานอีกมิติ

จ่าย 2 เครดิต ให้พยานช่วยบีบช่วงราคาของสินค้าที่เลือกให้แคบลง มูลค่าจริงยังอยู่ในช่วงเสมอ

- ตระกูล: base; flags: base + global gates
- จังหวะ: มีข้อมูลราคาเป็นช่วงและ NPC เสนอการตรวจเพิ่ม
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:105](../../../apps/comic/src/game/appraisal/content.ts#L105)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:135, policy:apps/comic/src/game/appraisal/events.ts:344, policy:apps/comic/src/simulation/appraisal.ts:if:3732
- Operations: operation:apps/comic/src/game/appraisal/events.ts:31539

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E18 งานตรวจสอบความซื่อตรง

ใช้พลัง 1 รับงาน ถ้าราคาที่คุณประเมินครั้งถัดไปห่างจากมูลค่าจริงไม่เกิน 10% เลือกรับ B03 หรือ B04

- ตระกูล: base; flags: base + global gates
- จังหวะ: NPC เสนองานประเมินและไม่ใช่การค้ากับผู้เล่น
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:111](../../../apps/comic/src/game/appraisal/content.ts#L111)
- ทางเลือก: discount (source-dependent), risk (source-dependent), decline (source-dependent)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:136, policy:apps/comic/src/game/appraisal/events.ts:199, policy:apps/comic/src/game/appraisal/events.ts:345
- Operations: operation:apps/comic/src/game/appraisal/events.ts:31684

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E19 รางวัลเปิดโปงของปลอม

คุณรู้ว่าของชิ้นนี้ปลอม ประกาศให้ทุกคนรู้แล้วรับ 1 เครดิต

- ตระกูล: base; flags: base + global gates
- จังหวะ: ตรวจพบว่าสินค้าเป็นของปลอมแล้ว; NPC มีงบรางวัล
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:117](../../../apps/comic/src/game/appraisal/content.ts#L117)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:137, policy:apps/comic/src/game/appraisal/events.ts:346, policy:apps/comic/src/game/appraisal/events.ts:if:18221
- Operations: operation:apps/comic/src/game/appraisal/events.ts:31989

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E20 ของที่มีเงื่อนไขแฝง

ใช้พลัง 2 รู้ว่าผลดีและผลเสียของสินค้าที่เลือกทำงานเมื่อไร

- ตระกูล: base; flags: base + global gates
- จังหวะ: มีสินค้าเปิดใช้ได้และยังไม่ทราบเงื่อนไขเปิดใช้
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:123](../../../apps/comic/src/game/appraisal/content.ts#L123)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:138, policy:apps/comic/src/game/appraisal/events.ts:347, policy:apps/comic/src/simulation/appraisal.ts:if:3571
- Operations: operation:apps/comic/src/game/appraisal/events.ts:32035

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E21 ชุดขายเหมา

ซื้อทั้งสองชิ้นในร้านพร้อมกัน ลดรวม 2 เครดิต

- ตระกูล: base; flags: base + global gates
- จังหวะ: NPC มีสินค้าสองชิ้นพร้อมขาย
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:129](../../../apps/comic/src/game/appraisal/content.ts#L129)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:139, policy:apps/comic/src/game/appraisal/events.ts:348, policy:apps/comic/src/simulation/appraisal.ts:if:5147
- Operations: operation:apps/comic/src/game/appraisal/events.ts:32115

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E22 กรมธรรม์พ่อค้า

จ่าย 1 เครดิตซื้อประกันจากพ่อค้า รับ B07

- ตระกูล: base; flags: base + global gates
- จังหวะ: ไม่มี B07 ที่ใช้งาน; มีความเสี่ยง NPC ยึดของ
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:135](../../../apps/comic/src/game/appraisal/content.ts#L135)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:140, policy:apps/comic/src/game/appraisal/events.ts:349
- Operations: operation:apps/comic/src/game/appraisal/events.ts:32226, operation:apps/comic/src/game/appraisal/events.ts:32249

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E23 นายหน้าต่างมิติ

ใช้พลัง 1 จ้างนายหน้า รับ B10

- ตระกูล: base; flags: base + global gates
- จังหวะ: ยังมีพลังยื่นข้อเสนอ; อยู่ในช่วง NPC ต่อรอง
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:141](../../../apps/comic/src/game/appraisal/content.ts#L141)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:141, policy:apps/comic/src/game/appraisal/events.ts:350
- Operations: operation:apps/comic/src/game/appraisal/events.ts:32294, operation:apps/comic/src/game/appraisal/events.ts:32317

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E24 ราคาพิเศษแลกเลือด

Vampire ลดราคาของที่เลือก 2 เครดิต แลกกับ D05

- ตระกูล: base; flags: base + global gates
- จังหวะ: พบ Vampire; มีสินค้าพร้อมซื้อ
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:147](../../../apps/comic/src/game/appraisal/content.ts#L147)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:142, policy:apps/comic/src/game/appraisal/events.ts:351, policy:apps/comic/src/simulation/appraisal.ts:if:4902
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E25 พ่อค้าไม่รับเงิน

พ่อค้าไม่เอาเครดิต แต่อยากได้ของในคลังของคุณ แลกของที่เลือกกับสินค้าชิ้นแรกในร้าน

- ตระกูล: base; flags: base + global gates
- จังหวะ: มีสินค้าที่ NPC ต้องการใน inventory และโอนได้
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:153](../../../apps/comic/src/game/appraisal/content.ts#L153)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:143, policy:apps/comic/src/game/appraisal/events.ts:352, policy:apps/comic/src/game/appraisal/events.ts:if:17547
- Operations: operation:apps/comic/src/game/appraisal/events.ts:32587

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E26 ฝากแรงล่วงหน้า

จ่าย 2 เครดิต รับ B09 พลังจะมาตอนต้นช่วงหน้า

- ตระกูล: base; flags: base + global gates
- จังหวะ: มี encounter ถัดไป
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:159](../../../apps/comic/src/game/appraisal/content.ts#L159)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:144, policy:apps/comic/src/game/appraisal/events.ts:353
- Operations: operation:apps/comic/src/game/appraisal/events.ts:32698, operation:apps/comic/src/game/appraisal/events.ts:32721

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E27 ซื้อก่อนจ่ายทีหลัง

ซื้อของที่เลือกลด 2 เครดิตตอนนี้ แล้วรับ D04 ไว้จ่ายทีหลัง

- ตระกูล: base; flags: base + global gates
- จังหวะ: มี encounter ถัดไปและสินค้าพร้อมซื้อ
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:165](../../../apps/comic/src/game/appraisal/content.ts#L165)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:145, policy:apps/comic/src/game/appraisal/events.ts:354, policy:apps/comic/src/simulation/appraisal.ts:if:4902
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E28 ผู้ค้ำความตาย

จ่าย 2 เครดิต รับ B08 ไว้กันสัญญาถึงตาย

- ตระกูล: base; flags: base + global gates
- จังหวะ: มี NPC ที่ขอบเขตผลเสียระบุว่าตายได้; ไม่มี B08
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:171](../../../apps/comic/src/game/appraisal/content.ts#L171)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:146, policy:apps/comic/src/game/appraisal/events.ts:355
- Operations: operation:apps/comic/src/game/appraisal/events.ts:32803, operation:apps/comic/src/game/appraisal/events.ts:32826

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E29 ของถูกแต่ขายต่อไม่ได้

ซื้อของที่เลือกลด 3 เครดิต แต่ของชิ้นนั้นติด D09 ขายหรือแลกไม่ได้จนจบช่วงหน้า

- ตระกูล: base; flags: base + global gates
- จังหวะ: มีสินค้าซื้อได้; ไม่มี D09 สำหรับชิ้นนั้น
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:177](../../../apps/comic/src/game/appraisal/content.ts#L177)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:147, policy:apps/comic/src/game/appraisal/events.ts:356, policy:apps/comic/src/simulation/appraisal.ts:if:4902
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E30 พิธีคุ้มครองสัญญา

จ่ายแพงขึ้น 2 เครดิตสำหรับของที่เลือก เพื่อรับ B06

- ตระกูล: base; flags: base + global gates
- จังหวะ: NPC เสนอทางเลือกที่อาจให้ debuff; ไม่มี B06
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:183](../../../apps/comic/src/game/appraisal/content.ts#L183)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:148, policy:apps/comic/src/game/appraisal/events.ts:357, policy:apps/comic/src/simulation/appraisal.ts:if:4902
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E31 กระจกกินลมหายใจ

ใช้พลัง 1 เปิดกระจก รับ B01 แต่ติด D05

- ตระกูล: base; flags: base + global gates
- จังหวะ: ถือกระจกที่มีคุณสมบัตินี้
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:189](../../../apps/comic/src/game/appraisal/content.ts#L189)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:149, policy:apps/comic/src/game/appraisal/events.ts:358
- Operations: operation:apps/comic/src/game/appraisal/events.ts:33022, operation:apps/comic/src/game/appraisal/events.ts:33066, operation:apps/comic/src/game/appraisal/events.ts:33133

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": [
    {
      "owner": "code:apps/comic/src/game/appraisal/events.ts:eventEligible",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 149,
        "endLine": 149
      },
      "expression": "kindOwned(state,p,'mirror')",
      "legacyKinds": [
        "mirror"
      ],
      "status": "unresolved-new56-mapping",
      "start": 12211,
      "end": 12239
    },
    {
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 358,
        "endLine": 358
      },
      "expression": "ownKind('mirror')",
      "legacyKinds": [
        "mirror"
      ],
      "status": "unresolved-new56-mapping",
      "start": 32965,
      "end": 32982
    }
  ]
}
```

## E32 ลูกแก้วแลกแรง

ทุบลูกแก้วหนึ่งลูกและจ่าย 1 เครดิต ฟื้นพลัง 3

- ตระกูล: base; flags: base + global gates
- จังหวะ: ถือไอเทมใช้แล้วหมด; พลังไม่เต็ม
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:195](../../../apps/comic/src/game/appraisal/content.ts#L195)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:150, policy:apps/comic/src/game/appraisal/events.ts:359
- Operations: operation:apps/comic/src/game/appraisal/events.ts:33259, operation:apps/comic/src/game/appraisal/events.ts:33286, operation:apps/comic/src/game/appraisal/events.ts:33309

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": [
    {
      "owner": "code:apps/comic/src/game/appraisal/events.ts:eventEligible",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 150,
        "endLine": 150
      },
      "expression": "kindOwned(state,p,'orb')",
      "legacyKinds": [
        "orb"
      ],
      "status": "unresolved-new56-mapping",
      "start": 12272,
      "end": 12297
    },
    {
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 359,
        "endLine": 359
      },
      "expression": "ownKind('orb')",
      "legacyKinds": [
        "orb"
      ],
      "status": "unresolved-new56-mapping",
      "start": 33205,
      "end": 33219
    }
  ]
}
```

## E33 กุญแจฝ่าผนึก

ใช้กุญแจหนึ่งดอกปลด D07

- ตระกูล: base; flags: base + global gates
- จังหวะ: ถือกุญแจใช้แล้วหมดและมี D07
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:201](../../../apps/comic/src/game/appraisal/content.ts#L201)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:151, policy:apps/comic/src/game/appraisal/events.ts:360
- Operations: operation:apps/comic/src/game/appraisal/events.ts:33485, operation:apps/comic/src/game/appraisal/events.ts:33582

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": [
    {
      "owner": "code:apps/comic/src/game/appraisal/events.ts:eventEligible",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 151,
        "endLine": 151
      },
      "expression": "kindOwned(state,p,'key')",
      "legacyKinds": [
        "key"
      ],
      "status": "unresolved-new56-mapping",
      "start": 12363,
      "end": 12388
    },
    {
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 360,
        "endLine": 360
      },
      "expression": "ownKind('key')",
      "legacyKinds": [
        "key"
      ],
      "status": "unresolved-new56-mapping",
      "start": 33431,
      "end": 33445
    }
  ]
}
```

## E34 หน้ากากเลือกบุคลิก

สวมหน้ากาก สละ buff ที่เลือกหนึ่งอย่างเพื่อรับ B10

- ตระกูล: base; flags: base + global gates
- จังหวะ: ถือหน้ากาก; มี buff ที่ยังใช้งาน
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:207](../../../apps/comic/src/game/appraisal/content.ts#L207)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:152, policy:apps/comic/src/game/appraisal/events.ts:361, policy:apps/comic/src/simulation/appraisal.ts:if:4679
- Operations: operation:apps/comic/src/game/appraisal/events.ts:33803, operation:apps/comic/src/game/appraisal/events.ts:33829

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": [
    {
      "owner": "code:apps/comic/src/game/appraisal/events.ts:eventEligible",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 152,
        "endLine": 152
      },
      "expression": "kindOwned(state,p,'mask')",
      "legacyKinds": [
        "mask"
      ],
      "status": "unresolved-new56-mapping",
      "start": 12442,
      "end": 12468
    },
    {
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 361,
        "endLine": 361
      },
      "expression": "ownKind('mask')",
      "legacyKinds": [
        "mask"
      ],
      "status": "unresolved-new56-mapping",
      "start": 33637,
      "end": 33652
    }
  ]
}
```

## E35 เศษยาจากอีกโลก

ดื่มยาหนึ่งขวด ล้าง D01 หรือ D05 อย่างใดอย่างหนึ่ง

- ตระกูล: base; flags: base + global gates
- จังหวะ: ถือยาใช้แล้วหมดและมี D01 หรือ D05
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:213](../../../apps/comic/src/game/appraisal/content.ts#L213)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:153, policy:apps/comic/src/game/appraisal/events.ts:362, policy:apps/comic/src/simulation/appraisal.ts:if:4771
- Operations: operation:apps/comic/src/game/appraisal/events.ts:34122, operation:apps/comic/src/game/appraisal/events.ts:34222

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": [
    {
      "owner": "code:apps/comic/src/game/appraisal/events.ts:eventEligible",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 153,
        "endLine": 153
      },
      "expression": "kindOwned(state,p,'potion')",
      "legacyKinds": [
        "potion"
      ],
      "status": "unresolved-new56-mapping",
      "start": 12561,
      "end": 12589
    },
    {
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 362,
        "endLine": 362
      },
      "expression": "ownKind('potion')",
      "legacyKinds": [
        "potion"
      ],
      "status": "unresolved-new56-mapping",
      "start": 34065,
      "end": 34082
    }
  ]
}
```

## E36 แบตเตอรี่รั่ว

ใช้พลัง 1 ชาร์จแบตเตอรี่ รับ B05

- ตระกูล: base; flags: base + global gates
- จังหวะ: ถือแบตเตอรี่เปิดใช้ได้; ยังตรวจได้อย่างน้อยหนึ่งครั้ง
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:219](../../../apps/comic/src/game/appraisal/content.ts#L219)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:154, policy:apps/comic/src/game/appraisal/events.ts:363
- Operations: operation:apps/comic/src/game/appraisal/events.ts:34300, operation:apps/comic/src/game/appraisal/events.ts:34344

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": [
    {
      "owner": "code:apps/comic/src/game/appraisal/events.ts:eventEligible",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 154,
        "endLine": 154
      },
      "expression": "kindOwned(state,p,'battery')",
      "legacyKinds": [
        "battery"
      ],
      "status": "unresolved-new56-mapping",
      "start": 12666,
      "end": 12695
    },
    {
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 363,
        "endLine": 363
      },
      "expression": "ownKind('battery')",
      "legacyKinds": [
        "battery"
      ],
      "status": "unresolved-new56-mapping",
      "start": 34281,
      "end": 34299
    }
  ]
}
```

## E37 สัมภาระเกินแรง

ของเต็มมือจนต้องจัดการก่อนเดินต่อ จ่าย 2 เครดิตจ้างคนแบก แบกเองแล้วรับ D06 หรือทิ้งของหนึ่งชิ้นให้พ่อค้า

- ตระกูล: base; flags: base + global gates
- จังหวะ: ถือของอย่างน้อย 3 ชิ้น; อยู่ก่อนการซื้อจาก NPC
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:225](../../../apps/comic/src/game/appraisal/content.ts#L225)
- ทางเลือก: burden (source-dependent), pay (source-dependent), drop (source-dependent), decline (source-dependent)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:155, policy:apps/comic/src/game/appraisal/events.ts:177, policy:apps/comic/src/game/appraisal/events.ts:200, policy:apps/comic/src/game/appraisal/events.ts:364, policy:apps/comic/src/game/appraisal/events.ts:if:18431
- Operations: operation:apps/comic/src/game/appraisal/events.ts:34452, operation:apps/comic/src/game/appraisal/events.ts:34543, operation:apps/comic/src/game/appraisal/events.ts:34570

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E38 เครื่องรางทำให้ถูกสงสัย

ใช้พลัง 1 เปิดเครื่องราง รับ B06 แต่ติด D03

- ตระกูล: base; flags: base + global gates
- จังหวะ: ถือเครื่องรางที่มีคุณสมบัตินี้
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:231](../../../apps/comic/src/game/appraisal/content.ts#L231)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:156, policy:apps/comic/src/game/appraisal/events.ts:365
- Operations: operation:apps/comic/src/game/appraisal/events.ts:34643, operation:apps/comic/src/game/appraisal/events.ts:34687, operation:apps/comic/src/game/appraisal/events.ts:34752

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": [
    {
      "owner": "code:apps/comic/src/game/appraisal/events.ts:eventEligible",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 156,
        "endLine": 156
      },
      "expression": "kindOwned(state,p,'amulet')",
      "legacyKinds": [
        "amulet"
      ],
      "status": "unresolved-new56-mapping",
      "start": 12836,
      "end": 12864
    },
    {
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 365,
        "endLine": 365
      },
      "expression": "ownKind('amulet')",
      "legacyKinds": [
        "amulet"
      ],
      "status": "unresolved-new56-mapping",
      "start": 34625,
      "end": 34642
    }
  ]
}
```

## E39 ดาบกระหายโลหิต

ใช้พลัง 1 เปิดดาบ รับ B04 แต่ติด D10

- ตระกูล: base; flags: base + global gates
- จังหวะ: ถือสินค้าที่มีคุณสมบัตินี้; ยังมีการประเมิน NPC
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:237](../../../apps/comic/src/game/appraisal/content.ts#L237)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:157, policy:apps/comic/src/game/appraisal/events.ts:366
- Operations: operation:apps/comic/src/game/appraisal/events.ts:34868, operation:apps/comic/src/game/appraisal/events.ts:34912, operation:apps/comic/src/game/appraisal/events.ts:34977

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": [
    {
      "owner": "code:apps/comic/src/game/appraisal/events.ts:eventEligible",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 157,
        "endLine": 157
      },
      "expression": "kindOwned(state,p,'blade')",
      "legacyKinds": [
        "blade"
      ],
      "status": "unresolved-new56-mapping",
      "start": 12926,
      "end": 12953
    },
    {
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 366,
        "endLine": 366
      },
      "expression": "ownKind('blade')",
      "legacyKinds": [
        "blade"
      ],
      "status": "unresolved-new56-mapping",
      "start": 34851,
      "end": 34867
    }
  ]
}
```

## E40 วงจรราคาเสีย

เครื่องตรวจราคาเสียแล้ว ใช้พลัง 2 ซ่อม ทิ้งเครื่องตรวจไป หรือทนใช้ต่อแล้วรับ D02 ถึงจบช่วงนี้

- ตระกูล: base; flags: base + global gates
- จังหวะ: ถือเครื่องตรวจจาก Autometa ที่เปิดเผยความเสี่ยงขัดข้องไว้
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:243](../../../apps/comic/src/game/appraisal/content.ts#L243)
- ทางเลือก: discard (source-dependent), endure (source-dependent), repair (source-dependent), fog (source-dependent), decline (source-dependent)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:158, policy:apps/comic/src/game/appraisal/events.ts:178, policy:apps/comic/src/game/appraisal/events.ts:201, policy:apps/comic/src/game/appraisal/events.ts:367, policy:apps/comic/src/game/appraisal/events.ts:if:18470
- Operations: operation:apps/comic/src/game/appraisal/events.ts:35118, operation:apps/comic/src/game/appraisal/events.ts:35140, operation:apps/comic/src/game/appraisal/events.ts:35169, operation:apps/comic/src/game/appraisal/events.ts:35330, operation:apps/comic/src/game/appraisal/events.ts:35381, operation:apps/comic/src/game/appraisal/events.ts:35431

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": [
    {
      "owner": "code:apps/comic/src/game/appraisal/events.ts:eventEligible",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 158,
        "endLine": 158
      },
      "expression": "kindOwned(state,p,'scanner')",
      "legacyKinds": [
        "scanner"
      ],
      "status": "unresolved-new56-mapping",
      "start": 13021,
      "end": 13050
    },
    {
      "owner": "code:apps/comic/src/game/appraisal/events.ts:offerEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 229,
        "endLine": 229
      },
      "expression": "kindOwned(state,p,'scanner')",
      "legacyKinds": [
        "scanner"
      ],
      "status": "unresolved-new56-mapping",
      "start": 18498,
      "end": 18526
    },
    {
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 370,
        "endLine": 370
      },
      "expression": "ownKind('scanner')",
      "legacyKinds": [
        "scanner"
      ],
      "status": "unresolved-new56-mapping",
      "start": 35397,
      "end": 35415
    }
  ]
}
```

## E41 ร้านชำระคำสาป

จ่าย 2 เครดิต ล้าง debuff ที่เลือกหนึ่งอย่าง

- ตระกูล: base; flags: base + global gates
- จังหวะ: มี debuff ที่ล้างได้
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:249](../../../apps/comic/src/game/appraisal/content.ts#L249)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:159, policy:apps/comic/src/game/appraisal/events.ts:372
- Operations: operation:apps/comic/src/game/appraisal/events.ts:35606, operation:apps/comic/src/game/appraisal/events.ts:35629

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E42 น้ำพุทางแยก

ดื่มน้ำพุได้ครั้งเดียว เลือกฟื้นพลัง 2 หรือล้าง D10

- ตระกูล: base; flags: base + global gates
- จังหวะ: พลังไม่เต็มหรือมี D10
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:255](../../../apps/comic/src/game/appraisal/content.ts#L255)
- ทางเลือก: energy (source-dependent), cleanse (source-dependent), decline (source-dependent)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:160, policy:apps/comic/src/game/appraisal/events.ts:179, policy:apps/comic/src/game/appraisal/events.ts:202, policy:apps/comic/src/game/appraisal/events.ts:374, policy:apps/comic/src/simulation/appraisal.ts:if:3234
- Operations: operation:apps/comic/src/game/appraisal/events.ts:35827, operation:apps/comic/src/game/appraisal/events.ts:35917

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E43 เงินอุดหนุนคนกลาง

ซื้อขายกับผู้เล่นสำเร็จครั้งถัดไป รับโบนัส 1 เครดิต

- ตระกูล: base; flags: base + global gates
- จังหวะ: ช่วงซื้อขายระหว่างผู้เล่น; ยังไม่รับรางวัลนี้; ตลาดมีงบ
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:261](../../../apps/comic/src/game/appraisal/content.ts#L261)
- ทางเลือก: accept (source-dependent)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:161, policy:apps/comic/src/game/appraisal/events.ts:180, policy:apps/comic/src/game/appraisal/events.ts:375
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E44 นักสะสมซื้อคืน

นักสะสมขอซื้อของในคลังของคุณหนึ่งชิ้น ตามราคาที่เสนอ

- ตระกูล: base; flags: base + global gates
- จังหวะ: ถือของอย่างน้อยสองชิ้นที่โอนได้; NPC มีงบซื้อ
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:267](../../../apps/comic/src/game/appraisal/content.ts#L267)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:162, policy:apps/comic/src/game/appraisal/events.ts:376, policy:apps/comic/src/game/appraisal/events.ts:if:17701
- Operations: operation:apps/comic/src/game/appraisal/events.ts:36528, operation:apps/comic/src/game/appraisal/events.ts:36668

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E45 หอข้อมูลเปิดเผย

เปิดผลตรวจหนึ่งข้อให้ทุกคนเห็น รับ 1 เครดิต

- ตระกูล: base; flags: base + global gates
- จังหวะ: มีผลตรวจส่วนตัวที่ server รับรองและยังไม่เผยแพร่
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:273](../../../apps/comic/src/game/appraisal/content.ts#L273)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:163, policy:apps/comic/src/game/appraisal/events.ts:377, policy:apps/comic/src/game/appraisal/events.ts:if:17834, policy:apps/comic/src/game/appraisal/events.ts:if:18942
- Operations: operation:apps/comic/src/game/appraisal/events.ts:37149

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E46 ท้าทายอ่านของ

ใช้พลัง 1 ทายว่าสินค้าที่เลือกแท้หรือปลอม ทายถูกได้ 2 เครดิต และได้รู้คำตอบเสมอ

- ตระกูล: base; flags: base + global gates
- จังหวะ: NPC เสนอสินค้าที่มีคุณสมบัติยังไม่ทราบ; มีพลังพอ
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:279](../../../apps/comic/src/game/appraisal/content.ts#L279)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:164, policy:apps/comic/src/game/appraisal/events.ts:378, policy:apps/comic/src/simulation/appraisal.ts:if:3442
- Operations: operation:apps/comic/src/game/appraisal/events.ts:37369, operation:apps/comic/src/game/appraisal/events.ts:37450, operation:apps/comic/src/game/appraisal/events.ts:37472

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E47 สมุดสินค้าข้ามร้าน

จ่าย 1 เครดิตอ่านสมุดของผู้ประเมินคนอื่น รู้ข้อมูลที่เขาตรวจไว้หนึ่งด้าน (มูลค่าจริง ความแท้ หรือคำสาป) ของสินค้าที่เลือก ไม่มีการโอนของ

- ตระกูล: base; flags: base + global gates
- จังหวะ: มีรายการ NPC ที่นักประเมินคนอื่นประเมินไว้และยอมเปิดให้ชม
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:285](../../../apps/comic/src/game/appraisal/content.ts#L285)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:165, policy:apps/comic/src/game/appraisal/events.ts:379, policy:apps/comic/src/game/appraisal/events.ts:if:17885, policy:apps/comic/src/game/appraisal/events.ts:if:18527
- Operations: operation:apps/comic/src/game/appraisal/events.ts:38260, operation:apps/comic/src/game/appraisal/events.ts:38291

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E48 ค่าปรับจากการกดราคา

พ่อค้าจับได้ว่าคุณกดราคา จ่ายค่าปรับ 2 เครดิต หรือยอมให้ยึดของหนึ่งชิ้น (B07 กันการยึดได้) ถ้าไม่มีทั้งเครดิตและของ เสียพลัง 2

- ตระกูล: base; flags: base + global gates
- จังหวะ: Server บันทึกว่าถูก NPC จับได้แล้ว และขอบเขตผลเสียประกาศไว้
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:291](../../../apps/comic/src/game/appraisal/content.ts#L291)
- ทางเลือก: pay (source-dependent), item (source-dependent), energy (source-dependent)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:203, policy:apps/comic/src/game/appraisal/events.ts:405, policy:apps/comic/src/game/appraisal/events.ts:if:17701
- Operations: operation:apps/comic/src/game/appraisal/events.ts:40773, operation:apps/comic/src/game/appraisal/events.ts:40821

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E49 พ่อค้าจดจำใบหน้า

พ่อค้าจำหน้าคุณได้ จ่าย 2 เครดิตให้ลืม หรือรับ D08 จนจบช่วงหน้า

- ตระกูล: base; flags: base + global gates
- จังหวะ: ถูก NPC จับได้แล้ว; ยังมี encounter ถัดไป; ประกาศผลนี้ไว้
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:297](../../../apps/comic/src/game/appraisal/content.ts#L297)
- ทางเลือก: oath (source-dependent), pay (source-dependent)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:204, policy:apps/comic/src/game/appraisal/events.ts:406
- Operations: operation:apps/comic/src/game/appraisal/events.ts:41017, operation:apps/comic/src/game/appraisal/events.ts:41045

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E50 คำพิพากษา Dark One

คุณผิดสัญญา Dark One สละของหนึ่งชิ้นเพื่อรอด หรือรับความตายในช่วงนี้ ถ้ามี B08 จะเสียพลัง 2 แทนการตาย

- ตระกูล: base; flags: base + global gates
- จังหวะ: รับสัญญา NPC ที่เปิดเผยว่าตายได้และถูกจับผิดตามสัญญาแล้ว
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:303](../../../apps/comic/src/game/appraisal/content.ts#L303)
- ทางเลือก: die (source-dependent), surrender (source-dependent)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:207, policy:apps/comic/src/game/appraisal/events.ts:407, policy:apps/comic/src/game/appraisal/events.ts:if:17701
- Operations: operation:apps/comic/src/game/appraisal/events.ts:41115, operation:apps/comic/src/game/appraisal/events.ts:41153

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E51 เลือดบริสุทธิ์

Vampire ขอแลกของเลือดที่คุณถือกับสินค้าในร้านหนึ่งชิ้นโดยไม่คิดเครดิตหรือพลัง หากของเลือดเป็นของปลอม Vampire ปฏิเสธ คุณเก็บของไว้และรับ D10

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบ Vampire; ถือลูกแก้วชีพจรโลหิตหรือน้ำยาเลือดคืนชีพ
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:321](../../../apps/comic/src/game/appraisal/content.ts#L321)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
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
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E52 ดาบที่คู่ควร

ออร์กเคารพผู้ถือดาบ ได้รับ B03 โดยไม่ต้องสละของ

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบออร์ก; ถือดาบ
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:322](../../../apps/comic/src/game/appraisal/content.ts#L322)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
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
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E53 คำสัตย์ต่อคำสัตย์

ออร์กบอกมูลค่าจริงของสินค้าที่เลือกหนึ่งชิ้นตามคำสัตย์ ไม่ใช้สิทธิ์ตรวจและไม่ใช้พลัง

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบออร์ก; ถือเครื่องรางคำสัตย์ออร์กหรือเครื่องรางเฝ้าจิต
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:323](../../../apps/comic/src/game/appraisal/content.ts#L323)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
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
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E54 เนื้อย่างเพื่อนร่วมรบ

มอบอาหารหนึ่งชิ้นให้ออร์ก ฟื้นพลัง 3 · กติกาชีวิตฟื้นชีวิตเพิ่ม 1

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบออร์ก; ถืออาหาร
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:324](../../../apps/comic/src/game/appraisal/content.ts#L324)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
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
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E55 กระจกที่ไร้เงา

Vampire ซื้อกระจกหนึ่งชิ้นในราคาอ้างอิงเต็มของชนิดนั้น ไม่สนว่าแท้หรือปลอม

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบ Vampire; ถือกระจก; ธนาคารมีงบพอ
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:325](../../../apps/comic/src/game/appraisal/content.ts#L325)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
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
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E56 ดื่มพายุในลูกแก้ว

มอบลูกแก้วหนึ่งชิ้น Vampire ดูดพลังแทนคุณ ล้าง D10 และฟื้นพลัง 2

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบ Vampire; ถือลูกแก้วที่ไม่ใช่ลูกแก้วชีพจรโลหิต
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:326](../../../apps/comic/src/game/appraisal/content.ts#L326)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
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
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E57 แบตเตอรี่ที่เข้ากัน

Autometa ขอแลกแบตเตอรี่ที่คุณถือกับสินค้าในร้านหนึ่งชิ้นโดยไม่คิดเครดิตหรือพลัง

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบ Autometa; ถือแบตเตอรี่
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:327](../../../apps/comic/src/game/appraisal/content.ts#L327)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
    "id": "E57",
    "npc": "autometa",
    "mode": "swap",
    "families": [
      "battery"
    ],
    "name": "แบตเตอรี่ที่เข้ากัน",
    "when": "พบ Autometa; ถือแบตเตอรี่",
    "description": "Autometa ขอแลกแบตเตอรี่ที่คุณถือกับสินค้าในร้านหนึ่งชิ้นโดยไม่คิดเครดิตหรือพลัง"
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E58 อัปเดตเครื่องสแกน

จ่ายพลัง 1 ให้ Autometa เชื่อมเครื่องสแกน เปิดมูลค่าจริงและความแท้ของสินค้าที่เลือกหนึ่งชิ้น ไม่ใช้สิทธิ์ตรวจ

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบ Autometa; ถือเครื่องตรวจราคา
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:328](../../../apps/comic/src/game/appraisal/content.ts#L328)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
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
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E59 รหัสกุญแจกลไก

Autometa อ่านรหัสกุญแจแล้วยอมต่อรองเพิ่ม ได้รับ B10 โดยไม่ต้องสละของ

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบ Autometa; ถือกุญแจ
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:329](../../../apps/comic/src/game/appraisal/content.ts#L329)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
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
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E60 หน้ากากแปลภาษา

สวมหน้ากากคุยกับ Alien เปิดผลของสินค้าและคำสาปของสินค้าที่เลือกหนึ่งชิ้น ไม่ใช้สิทธิ์ตรวจและไม่ใช้พลัง

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบ Alien; ถือหน้ากาก
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:330](../../../apps/comic/src/game/appraisal/content.ts#L330)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
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
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E61 ตัวอย่างยาจากโลกนี้

Alien ซื้อยาหนึ่งชิ้นไปศึกษาในราคาอ้างอิง 125% ของชนิดนั้น

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบ Alien; ถือยา; ธนาคารมีงบพอ
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:331](../../../apps/comic/src/game/appraisal/content.ts#L331)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
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
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E62 ลูกแก้วนำทางดาว

Alien ปรับคลื่นลูกแก้วให้ ฟื้นพลัง 2 และได้รับ B05 โดยไม่ต้องสละของ

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบ Alien; ถือลูกแก้ว
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:332](../../../apps/comic/src/game/appraisal/content.ts#L332)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
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
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E63 กุญแจห้องมืด

มอบกุญแจหนึ่งชิ้นให้ Dark One ได้รับ B08

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบ Dark One; ถือกุญแจ
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:333](../../../apps/comic/src/game/appraisal/content.ts#L333)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
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
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E64 วิญญาณแลกวิญญาณ

มอบเครื่องรางหนึ่งชิ้น Dark One กลืนผลเสียทั้งหมดที่ติดตัวคุณ

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบ Dark One; ถือเครื่องราง; มี debuff
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:334](../../../apps/comic/src/game/appraisal/content.ts#L334)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
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
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E65 หน้ากากแห่งความว่าง

Dark One ขอแลกหน้ากากที่คุณถือกับสินค้าในร้านหนึ่งชิ้นโดยไม่คิดเครดิตหรือพลัง

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบ Dark One; ถือหน้ากาก
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:335](../../../apps/comic/src/game/appraisal/content.ts#L335)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
    "id": "E65",
    "npc": "darkone",
    "mode": "swap",
    "families": [
      "mask"
    ],
    "name": "หน้ากากแห่งความว่าง",
    "when": "พบ Dark One; ถือหน้ากาก",
    "description": "Dark One ขอแลกหน้ากากที่คุณถือกับสินค้าในร้านหนึ่งชิ้นโดยไม่คิดเครดิตหรือพลัง"
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E66 อาหารแลกของวิเศษ

สัตว์นำทางคาบสินค้าในร้านหนึ่งชิ้นมาแลกอาหารที่คุณถือ ไม่คิดเครดิตหรือพลัง

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบสัตว์นำทาง; ถืออาหาร
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:336](../../../apps/comic/src/game/appraisal/content.ts#L336)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
    "id": "E66",
    "npc": "beast",
    "mode": "swap",
    "families": [
      "food"
    ],
    "name": "อาหารแลกของวิเศษ",
    "when": "พบสัตว์นำทาง; ถืออาหาร",
    "description": "สัตว์นำทางคาบสินค้าในร้านหนึ่งชิ้นมาแลกอาหารที่คุณถือ ไม่คิดเครดิตหรือพลัง"
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E67 ยาสมานแผลสัตว์

ใช้ยาหนึ่งชิ้นรักษาสัตว์นำทาง ได้รับ B05 และ B09

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบสัตว์นำทาง; ถือยา
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:337](../../../apps/comic/src/game/appraisal/content.ts#L337)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
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
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E68 สัตว์หวาดคมดาบ

ข่มขู่สัตว์นำทางด้วยดาบ ได้รับ B03 แต่รับ D03

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบสัตว์นำทาง; ถือดาบ
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:338](../../../apps/comic/src/game/appraisal/content.ts#L338)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
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
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E69 นักสะสมคำสาป

Dark One ซื้อของต้องสาปหนึ่งชิ้นในราคาอ้างอิงเต็มของชนิดนั้น

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบ Dark One; ถือของที่คุณรู้ว่ามีคำสาป; ธนาคารมีงบพอ
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:339](../../../apps/comic/src/game/appraisal/content.ts#L339)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
    "id": "E69",
    "npc": "darkone",
    "mode": "sell",
    "known": "cursed",
    "price": 1,
    "name": "นักสะสมคำสาป",
    "when": "พบ Dark One; ถือของที่คุณรู้ว่ามีคำสาป; ธนาคารมีงบพอ",
    "description": "Dark One ซื้อของต้องสาปหนึ่งชิ้นในราคาอ้างอิงเต็มของชนิดนั้น"
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E70 ของปลอมข้ามจักรวาล

ลองแลกของปลอมกับสินค้าในร้านหนึ่งชิ้น โอกาส 50% ที่ Alien จับได้: ไม่แลกและรับ D03

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบ Alien; ถือของที่คุณรู้ว่าเป็นของปลอม
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:340](../../../apps/comic/src/game/appraisal/content.ts#L340)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
    "id": "E70",
    "npc": "alien",
    "mode": "swap",
    "known": "fake",
    "risk": 0.5,
    "name": "ของปลอมข้ามจักรวาล",
    "when": "พบ Alien; ถือของที่คุณรู้ว่าเป็นของปลอม",
    "description": "ลองแลกของปลอมกับสินค้าในร้านหนึ่งชิ้น โอกาส 50% ที่ Alien จับได้: ไม่แลกและรับ D03"
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E71 หน้ากากนักรบ

ออร์กนับถือหน้ากากนักรบ ได้รับ B07 โดยไม่ต้องสละของ

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบออร์ก; ถือหน้ากาก
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:341](../../../apps/comic/src/game/appraisal/content.ts#L341)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
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
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E72 กระจกสอบเทียบ

Autometa ใช้กระจกของคุณสอบเทียบเลนส์ ได้รับ B01 โดยไม่ต้องสละของ

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบ Autometa; ถือกระจก
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:342](../../../apps/comic/src/game/appraisal/content.ts#L342)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
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
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E73 ของที่ข้าตามหา

พ่อค้าบอกของที่ตามหาและเสนอราคาสูงกว่าตลาด ใช้พลัง 2 เพื่อทำสัญญา เปิดสัญญาได้พร้อมกันสูงสุด 2 รายการ (เต็มแล้วต้องแทนรายการเก่า) ราคาลดลงทุกช่วงแต่ไม่ต่ำกว่าราคาฐานของสินค้า ถ้าครั้งหน้าคุณเลือกพ่อค้านี้อีกและถือของชนิดนั้นอยู่ ขายให้ได้ ต่อรองราคาได้ โอกาสขึ้นกับความไว้ใจและผลดีผลเสียที่ติดตัว

- ตระกูล: npc-wishlist; flags: wishlist
- จังหวะ: พบพ่อค้าที่ยังไม่เคยบอกของที่อยากได้
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:387](../../../apps/comic/src/game/appraisal/content.ts#L387)
- ทางเลือก: decline (source-dependent), accept (source-dependent)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:206, policy:apps/comic/src/game/appraisal/events.ts:if:8591, policy:apps/comic/src/game/appraisal/events.ts:if:27190, policy:apps/comic/src/simulation/appraisal.ts:if:3009
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/wishlist.ts:applyWish"
  ],
  "legacyTargetGates": []
}
```

## E74 ไข่มุกคืนทะเล

อสูรใต้ทะเลลึกขอไข่มุกที่คุณถือคืนสู่ห้วงน้ำ แลกกับสินค้าในร้านหนึ่งชิ้นโดยไม่คิดเครดิตหรือพลัง หากไข่มุกเป็นของปลอม อสูรปฏิเสธ คุณเก็บของไว้และรับ D10

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบอสูรใต้ทะเลลึก; ถือไข่มุกห้วงลึก
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:343](../../../apps/comic/src/game/appraisal/content.ts#L343)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
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
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E75 หมึกเขียนความจริง

จ่ายพลัง 1 ให้อสูรใช้หมึกเขียนความจริงบนสินค้าที่เลือก เปิดมูลค่าจริงและความแท้ ไม่ใช้สิทธิ์ตรวจ

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบอสูรใต้ทะเลลึก; ถือหมึกยักษ์ดำ
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:344](../../../apps/comic/src/game/appraisal/content.ts#L344)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
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
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E76 เสียงที่ฟังได้

อสูรใต้ทะเลลึกได้ยินเครื่องรางของคุณสะท้อนเสียงห้วงน้ำ ได้รับ B12 โดยไม่ต้องสละของ

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบอสูรใต้ทะเลลึก; ถือเครื่องราง
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:345](../../../apps/comic/src/game/appraisal/content.ts#L345)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
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
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E77 หน้ากากของผู้จมน้ำ

อสูรใต้ทะเลลึกซื้อหน้ากากหนึ่งชิ้นในราคาอ้างอิง 110% ของชนิดนั้น ไม่สนว่าแท้หรือปลอม

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบอสูรใต้ทะเลลึก; ถือหน้ากาก; ธนาคารมีงบพอ
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:346](../../../apps/comic/src/game/appraisal/content.ts#L346)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
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
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E78 เครื่องเซ่นจากผิวน้ำ

มอบอาหารหนึ่งชิ้นให้อสูรใต้ทะเลลึก ฟื้นพลัง 2 และได้รับ B11

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบอสูรใต้ทะเลลึก; ถืออาหาร
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:347](../../../apps/comic/src/game/appraisal/content.ts#L347)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
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
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E79 ฝูงเกรงคมดาบ

ฝูงมนุษย์แมลงถอยให้ผู้ถือดาบและยอมหนุนหลัง ได้รับ B13 แต่ถูกพิษฝูงกัดเป็นค่าผ่านทาง รับ D11

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบ The Swarm; ถือดาบ
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:348](../../../apps/comic/src/game/appraisal/content.ts#L348)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
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
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E80 น้ำหวานแลกของเก็บ

The Swarm ขออาหารที่คุณถือไปเลี้ยงตัวอ่อน แลกกับสินค้าในร้านหนึ่งชิ้นโดยไม่คิดเครดิตหรือพลัง

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบ The Swarm; ถืออาหาร
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:349](../../../apps/comic/src/game/appraisal/content.ts#L349)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
    "id": "E80",
    "npc": "swarm",
    "mode": "swap",
    "families": [
      "food"
    ],
    "name": "น้ำหวานแลกของเก็บ",
    "when": "พบ The Swarm; ถืออาหาร",
    "description": "The Swarm ขออาหารที่คุณถือไปเลี้ยงตัวอ่อน แลกกับสินค้าในร้านหนึ่งชิ้นโดยไม่คิดเครดิตหรือพลัง"
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E81 ยาแก้พิษให้ฝูงกลืน

มอบยาหนึ่งชิ้นให้ The Swarm ฝูงดูดผลเสียทั้งหมดที่ติดตัวคุณไป

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบ The Swarm; ถือยา; มี debuff
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:350](../../../apps/comic/src/game/appraisal/content.ts#L350)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
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
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E82 ตาของทั้งฝูง

จ่ายพลัง 1 ยืมสายตาของทั้งฝูงส่องสินค้าที่เลือก เปิดมูลค่าจริงและคำสาป ไม่ใช้สิทธิ์ตรวจ

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบ The Swarm; ถือเครื่องตรวจ
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:351](../../../apps/comic/src/game/appraisal/content.ts#L351)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
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
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E83 รังต้องการพลัง

The Swarm ซื้อแบตเตอรี่หนึ่งชิ้นไปจุดรังในราคาอ้างอิง 120% ของชนิดนั้น

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบ The Swarm; ถือแบตเตอรี่; ธนาคารมีงบพอ
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:352](../../../apps/comic/src/game/appraisal/content.ts#L352)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
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
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E84 คลื่นกระซิบจากก้นบึ้ง

อสูรใต้ทะเลลึกส่งคลื่นเสียงให้คุณฟัง ใช้พลัง 1 รับ B12

- ตระกูล: expansion; flags: expansion
- จังหวะ: พบอสูรใต้ทะเลลึก; มีพลัง 1
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:377](../../../apps/comic/src/game/appraisal/content.ts#L377)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:77, policy:apps/comic/src/game/appraisal/events.ts:395
- Operations: operation:apps/comic/src/game/appraisal/events.ts:39260, operation:apps/comic/src/game/appraisal/events.ts:39283

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E85 ผึ้งส่งสาร

ตัวส่งสารของฝูงขอเครดิต 1 แลกการแนะนำคนซื้อ รับ B15

- ตระกูล: expansion; flags: expansion
- จังหวะ: พบ The Swarm; มีเครดิต 1
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:378](../../../apps/comic/src/game/appraisal/content.ts#L378)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:78, policy:apps/comic/src/game/appraisal/events.ts:396
- Operations: operation:apps/comic/src/game/appraisal/events.ts:39328, operation:apps/comic/src/game/appraisal/events.ts:39351

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E86 ตาข่ายใยแมงมุม

เก็บของจากใยที่ขึงไว้ รับ 3 เครดิตทันที แต่ติดใยพันขา รับ D15

- ตระกูล: expansion; flags: expansion
- จังหวะ: ธนาคารมีงบ 3 เครดิต
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:379](../../../apps/comic/src/game/appraisal/content.ts#L379)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:79, policy:apps/comic/src/game/appraisal/events.ts:397
- Operations: operation:apps/comic/src/game/appraisal/events.ts:39396, operation:apps/comic/src/game/appraisal/events.ts:39418

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E87 ดำน้ำหาไข่มุก

ใช้พลัง 2 ดำลงไปหาไข่มุก สุ่มจากเส้นทางของห้อง สำเร็จรับ 6 เครดิตและ B14 พลาดรับ D12

- ตระกูล: expansion; flags: expansion
- จังหวะ: มีพลัง 2; ธนาคารมีงบ 6 เครดิต
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:380](../../../apps/comic/src/game/appraisal/content.ts#L380)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:80, policy:apps/comic/src/game/appraisal/events.ts:398
- Operations: operation:apps/comic/src/game/appraisal/events.ts:39465, operation:apps/comic/src/game/appraisal/events.ts:39542, operation:apps/comic/src/game/appraisal/events.ts:39563, operation:apps/comic/src/game/appraisal/events.ts:39652

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E88 ผึ้งเลียพิษ

จ่าย 1 เครดิตให้ผึ้งเลียพิษออก เลือกล้างหนึ่งในผลเสีย D11–D16 ที่ติดตัว

- ตระกูล: expansion; flags: expansion
- จังหวะ: มีผลเสียจากฝูงหรือห้วงลึกติดตัว; มีเครดิต 1
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:381](../../../apps/comic/src/game/appraisal/content.ts#L381)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:81, policy:apps/comic/src/game/appraisal/events.ts:399, policy:apps/comic/src/simulation/appraisal.ts:if:4569
- Operations: operation:apps/comic/src/game/appraisal/events.ts:39948, operation:apps/comic/src/game/appraisal/events.ts:39971

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E89 หมอกเมาห้วงลึก

สูดหมอกใต้น้ำ ได้ตาประกอบหลายเหลี่ยม B11 แต่เสียสติชั่วคราว รับ D14

- ตระกูล: expansion; flags: expansion
- จังหวะ: ยังไม่มี B11 และ D14
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:382](../../../apps/comic/src/game/appraisal/content.ts#L382)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:82, policy:apps/comic/src/game/appraisal/events.ts:400
- Operations: operation:apps/comic/src/game/appraisal/events.ts:40021, operation:apps/comic/src/game/appraisal/events.ts:40043

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E90 คำสัญญาของฝูง

ฝูงยอมหนุนหลังการขายของคุณ รับ B13 แต่ทิ้งพิษไว้ รับ D11

- ตระกูล: expansion; flags: expansion
- จังหวะ: พบ The Swarm
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:383](../../../apps/comic/src/game/appraisal/content.ts#L383)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:83, policy:apps/comic/src/game/appraisal/events.ts:401
- Operations: operation:apps/comic/src/game/appraisal/events.ts:40088, operation:apps/comic/src/game/appraisal/events.ts:40110

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E91 เสียงเรียกจากเหวลึก

ตอบเสียงเรียก เสียพลัง 2 (กติกาชีวิตเสียชีวิต 1) รับ B16 และ B14 แต่น้ำเค็มกัดช่วงนี้ รับ D16

- ตระกูล: expansion; flags: expansion
- จังหวะ: พบอสูรใต้ทะเลลึก; มีพลัง 2 หรือชีวิตเกิน 1
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:384](../../../apps/comic/src/game/appraisal/content.ts#L384)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:84, policy:apps/comic/src/game/appraisal/events.ts:402
- Operations: operation:apps/comic/src/game/appraisal/events.ts:40220, operation:apps/comic/src/game/appraisal/events.ts:40257, operation:apps/comic/src/game/appraisal/events.ts:40280, operation:apps/comic/src/game/appraisal/events.ts:40302, operation:apps/comic/src/game/appraisal/events.ts:40324

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E92 ตลาดมืดใต้น้ำ

ขายข่าวการค้าให้ตลาดใต้น้ำ รับ 2 เครดิตแต่กลิ่นรังติดตัว รับ D13

- ตระกูล: expansion; flags: expansion
- จังหวะ: ช่วงต่อรอง; ธนาคารมีงบ 2 เครดิต
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:385](../../../apps/comic/src/game/appraisal/content.ts#L385)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:403, policy:apps/comic/src/game/appraisal/events.ts:if:6486
- Operations: operation:apps/comic/src/game/appraisal/events.ts:40370, operation:apps/comic/src/game/appraisal/events.ts:40392

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E93 สำรวจรังร้าง

ใช้พลัง 1 ค้นรังร้าง สุ่มจากเส้นทางของห้อง 60% รับ 1 เครดิตและ B15 อีก 40% รับ D15

- ตระกูล: expansion; flags: expansion
- จังหวะ: มีพลัง 1; ธนาคารมีงบ 1 เครดิต
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:386](../../../apps/comic/src/game/appraisal/content.ts#L386)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:85, policy:apps/comic/src/game/appraisal/events.ts:404
- Operations: operation:apps/comic/src/game/appraisal/events.ts:40439, operation:apps/comic/src/game/appraisal/events.ts:40514, operation:apps/comic/src/game/appraisal/events.ts:40535, operation:apps/comic/src/game/appraisal/events.ts:40633

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E94 ข่าวตลาดจากคนรู้จัก

จ่าย 2 เครดิตซื้อข่าววงใน รับ B17 ช่วงนี้ขายของที่คุณเป็นเจ้าของได้ราคาเพิ่ม 15%

- ตระกูล: polish; flags: polish
- จังหวะ: ยังไม่มี B17 หรือ D17; มีเครดิต 2
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:369](../../../apps/comic/src/game/appraisal/content.ts#L369)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:390
- Operations: operation:apps/comic/src/game/appraisal/events.ts:38827, operation:apps/comic/src/game/appraisal/events.ts:38899, operation:apps/comic/src/game/appraisal/events.ts:38958

```json
{
  "bondSpec": null,
  "polishSpec": {
    "phase": "APPRAISAL",
    "credits": 2,
    "grant": [
      "B17"
    ],
    "avoid": [
      "B17",
      "D17"
    ]
  },
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E95 ขายข่าวลือเฟ้อ

ขายข่าวลือให้นักปั่นราคา รับ 3 เครดิตทันที แต่ราคาตลาดเฟ้อ รับ D17 ช่วงนี้ขายของที่คุณเป็นเจ้าของได้ลด 20%

- ตระกูล: polish; flags: polish
- จังหวะ: ยังไม่มี B17 หรือ D17; ธนาคารมีงบ 3 เครดิต
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:370](../../../apps/comic/src/game/appraisal/content.ts#L370)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:390
- Operations: operation:apps/comic/src/game/appraisal/events.ts:38827, operation:apps/comic/src/game/appraisal/events.ts:38899, operation:apps/comic/src/game/appraisal/events.ts:38958

```json
{
  "bondSpec": null,
  "polishSpec": {
    "phase": "APPRAISAL",
    "reward": 3,
    "grant": [
      "D17"
    ],
    "avoid": [
      "D17",
      "B17"
    ]
  },
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E96 เหรียญริมทาง

เก็บเหรียญแปลกตาข้างโต๊ะ ใช้พลัง 1 รับ B18 เครดิตหลังซื้อขายเพิ่ม 3 และหัวก้อยถูกง่ายขึ้น

- ตระกูล: polish; flags: polish
- จังหวะ: ยังไม่มี B18 หรือ D19; มีพลัง 1
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:371](../../../apps/comic/src/game/appraisal/content.ts#L371)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:390
- Operations: operation:apps/comic/src/game/appraisal/events.ts:38827, operation:apps/comic/src/game/appraisal/events.ts:38899, operation:apps/comic/src/game/appraisal/events.ts:38958

```json
{
  "bondSpec": null,
  "polishSpec": {
    "phase": "APPRAISAL",
    "energy": 1,
    "grant": [
      "B18"
    ],
    "avoid": [
      "B18",
      "D19"
    ]
  },
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E97 ผู้ประมูลเก่าแก่

จ่าย 2 เครดิตให้ผู้ประมูลเก่าแก่สอนเคล็ดลับ รับ B20 ถ้าชนะประมูลครั้งถัดไปจ่ายน้อยลง 20%

- ตระกูล: polish; flags: polish
- จังหวะ: ห้องมีระบบประมูลตลาดเงา; มีเครดิต 2
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:372](../../../apps/comic/src/game/appraisal/content.ts#L372)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:390
- Operations: operation:apps/comic/src/game/appraisal/events.ts:38827, operation:apps/comic/src/game/appraisal/events.ts:38899, operation:apps/comic/src/game/appraisal/events.ts:38958

```json
{
  "bondSpec": null,
  "polishSpec": {
    "phase": "APPRAISAL",
    "credits": 2,
    "grant": [
      "B20"
    ],
    "avoid": [
      "B20"
    ],
    "needsAuctions": true
  },
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E98 วิญญาณคุ้มครอง

ใช้พลัง 1 จุดธูปเรียกวิญญาณคุ้มครอง รับ B19 ผลเสียต่อชีวิตครั้งถัดไปลด 1

- ตระกูล: polish; flags: polish
- จังหวะ: ยังไม่มี B19 หรือ D20; มีพลัง 1
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:373](../../../apps/comic/src/game/appraisal/content.ts#L373)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:390
- Operations: operation:apps/comic/src/game/appraisal/events.ts:38827, operation:apps/comic/src/game/appraisal/events.ts:38899, operation:apps/comic/src/game/appraisal/events.ts:38958

```json
{
  "bondSpec": null,
  "polishSpec": {
    "phase": "APPRAISAL",
    "energy": 1,
    "grant": [
      "B19"
    ],
    "avoid": [
      "B19",
      "D20"
    ]
  },
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E99 แผลเก่าเปิดอีกครั้ง

ยอมเปิดแผลเก่าให้หมอเก็บค่าหัว รับ 4 เครดิตทันที แต่รับ D20 ผลเสียต่อชีวิตครั้งถัดไปเพิ่ม 1

- ตระกูล: polish; flags: polish
- จังหวะ: ยังไม่มี B19 หรือ D20; ธนาคารมีงบ 4 เครดิต
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:374](../../../apps/comic/src/game/appraisal/content.ts#L374)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:390
- Operations: operation:apps/comic/src/game/appraisal/events.ts:38827, operation:apps/comic/src/game/appraisal/events.ts:38899, operation:apps/comic/src/game/appraisal/events.ts:38958

```json
{
  "bondSpec": null,
  "polishSpec": {
    "phase": "APPRAISAL",
    "reward": 4,
    "grant": [
      "D20"
    ],
    "avoid": [
      "D20",
      "B19"
    ]
  },
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E100 นักเก็บภาษีเงา

รับเงินปิดปากจากนักเก็บภาษี 2 เครดิต แต่ติดภาษีแอบแฝง รับ D18 ช่วงนี้ซื้อ ล้างคำสาป และดีลฟื้นแพงขึ้น 1 เครดิต

- ตระกูล: polish; flags: polish
- จังหวะ: ยังไม่มี D18; ธนาคารมีงบ 2 เครดิต
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:375](../../../apps/comic/src/game/appraisal/content.ts#L375)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:390
- Operations: operation:apps/comic/src/game/appraisal/events.ts:38827, operation:apps/comic/src/game/appraisal/events.ts:38899, operation:apps/comic/src/game/appraisal/events.ts:38958

```json
{
  "bondSpec": null,
  "polishSpec": {
    "phase": "APPRAISAL",
    "reward": 2,
    "grant": [
      "D18"
    ],
    "avoid": [
      "D18"
    ]
  },
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E101 ตลาดนัดข้ามมิติ

จ่าย 1 เครดิตเข้าตลาดนัด รับ B17 ขายของได้ราคาเพิ่ม 15% แต่ต้องจ่ายภาษีแอบแฝง D18 ช่วงนี้

- ตระกูล: polish; flags: polish
- จังหวะ: ช่วงต่อรอง; ไม่มี B17 D17 D18; มีเครดิต 1
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:376](../../../apps/comic/src/game/appraisal/content.ts#L376)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:390
- Operations: operation:apps/comic/src/game/appraisal/events.ts:38827, operation:apps/comic/src/game/appraisal/events.ts:38899, operation:apps/comic/src/game/appraisal/events.ts:38958

```json
{
  "bondSpec": null,
  "polishSpec": {
    "phase": "TRADE",
    "credits": 1,
    "grant": [
      "B17",
      "D18"
    ],
    "avoid": [
      "B17",
      "D17",
      "D18"
    ]
  },
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E102 ขวดของนักรบ

ออร์กเห็นขวดพลังสำรองที่คุณพกและแนะนำช่องทางขาย ได้รับ B17 โดยไม่ต้องสละของ

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบออร์ก; ถือขวดพลังสำรอง
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:353](../../../apps/comic/src/game/appraisal/content.ts#L353)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
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
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E103 ภาษาของสัญญา

Alien อ่านสมุดคำสัญญาของคุณและบอกมูลค่าจริงกับความแท้ของสินค้าที่เลือกหนึ่งชิ้น ไม่ใช้พลังหรือสิทธิ์ตรวจ

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบ Alien; ถือสมุดคำสัญญาพ่อค้า
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:354](../../../apps/comic/src/game/appraisal/content.ts#L354)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
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
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E104 แลกพลังสำรอง

มอบขวดพลังสำรองหนึ่งชิ้นให้ Autometa ฟื้นพลัง 3 และได้รับ B20

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบ Autometa; ถือขวดพลังสำรอง
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:355](../../../apps/comic/src/game/appraisal/content.ts#L355)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
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
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E105 สัตว์รับรู้ศิลา

สัตว์นำทางสัมผัสศิลาชีพจรแล้วเฝ้าระวังให้คุณ ได้รับ B19 โดยไม่ต้องสละของ

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบสัตว์นำทาง; ถือศิลาชีพจรเก่า
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:356](../../../apps/comic/src/game/appraisal/content.ts#L356)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
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
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E106 สมุดสัญญาสำหรับคนตาย

Dark One ซื้อสมุดคำสัญญาหนึ่งเล่มในราคาอ้างอิง 130% ของชนิดนั้น

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบ Dark One; ถือสมุดคำสัญญาพ่อค้า; ธนาคารมีงบพอ
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:357](../../../apps/comic/src/game/appraisal/content.ts#L357)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
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
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E107 ศิลาคืนบึ้ง

อสูรใต้ทะเลลึกขอศิลาที่คุณถือแลกกับสินค้าในร้านหนึ่งชิ้นโดยไม่คิดเครดิตหรือพลัง หากศิลาเป็นของปลอม อสูรปฏิเสธ คุณเก็บของไว้และรับ D10

- ตระกูล: merchant-bond; flags: brokerage
- จังหวะ: พบอสูรใต้ทะเลลึก; ถือศิลาชีพจรเก่า
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:358](../../../apps/comic/src/game/appraisal/content.ts#L358)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": {
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
  },
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond"
  ],
  "legacyTargetGates": []
}
```

## E108 เลือกหนึ่งพร

ลางดีเปิดทางให้เลือกผลดีหนึ่งอย่างจากสามตัวเลือกที่สุ่มจากเส้นทางของห้อง ไม่เสียอะไร แต่ผลดีเหล่านี้หมดเมื่อจบช่วงหน้า

- ตระกูล: boon; flags: polish
- จังหวะ: ช่วงประเมิน; มีผลดีที่ยังไม่ติดตัวอย่างน้อย 3 อย่าง
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:369](../../../apps/comic/src/game/appraisal/content.ts#L369)
- ทางเลือก: pick (source-dependent), decline (source-dependent)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:181, policy:apps/comic/src/game/appraisal/events.ts:205, policy:apps/comic/src/game/appraisal/events.ts:394, policy:apps/comic/src/simulation/appraisal.ts:if:4023
- Operations: operation:apps/comic/src/game/appraisal/events.ts:39156

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E109 สัญญาเลือดครั้งหน้า

จ่ายชีวิต 2 ตอนนี้ เมื่อเลือกพบ Vampire ครั้งหน้า จะสุ่มได้ผลตอบแทนอย่างเดียวเท่านั้น หนึ่งในห้าอย่าง: ของฟรี 1 ชิ้นจากร้าน, ส่วนลด 50% สำหรับการซื้อครั้งแรกในช่วงนั้น, ฟื้นพลังสูงสุด 6, ฟื้นชีวิตสูงสุด 3 หรือพรสุ่มหนึ่งอย่าง ไม่ได้ทั้งหมด (ตัวเลือกที่ใช้ไม่ได้ เช่น พลังหรือชีวิตเต็มแล้ว จะไม่ถูกสุ่ม) หากจบรันก่อนพบกันจะไม่ได้ผลตอบแทน

- ตระกูล: personal-npc; flags: npcEvents
- จังหวะ: พบ Vampire; ชีวิตเกิน 2 และไม่มีสัญญาเลือดค้าง
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:361](../../../apps/comic/src/game/appraisal/content.ts#L361)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/npc-events.ts:25, policy:apps/comic/src/game/appraisal/npc-events.ts:95, policy:apps/comic/src/game/appraisal/npc-events.ts:if:3166, policy:apps/comic/src/simulation/appraisal.ts:if:4231
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent"
  ],
  "legacyTargetGates": []
}
```

## E110 ของฝากจากต่างดาว

Alien ขอยืมของ 1–3 ชิ้น เลือกจำนวนและชิ้นที่ยอมให้ยืมตามที่เสนอ ของจะออกจากคลังและหยุดให้ผลติดตัว เมื่อเลือกพบ Alien ตั้งแต่สองช่วงถัดไป คืนของเดิมพร้อมโบนัสสุ่ม 4–8 เครดิตและฟื้นพลังสูงสุด 1–2 ต่อชิ้น หากจบรันก่อนพบกัน คืนของเพื่อคิดคะแนนแต่ไม่มีโบนัส

- ตระกูล: personal-npc; flags: npcEvents
- จังหวะ: พบ Alien; มีสินค้าที่ให้ยืมได้และไม่มีสัญญายืมค้าง
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:362](../../../apps/comic/src/game/appraisal/content.ts#L362)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/npc-events.ts:26, policy:apps/comic/src/game/appraisal/npc-events.ts:96, policy:apps/comic/src/game/appraisal/npc-events.ts:if:3197
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent"
  ],
  "legacyTargetGates": []
}
```

## E111 เครื่องบรรณาการแห่งเงา

Dark One สุ่มขอค่าตอบแทน 1–3 ประเภทไม่ซ้ำกันจากเครดิต พลัง ชีวิต และสินค้า จ่ายแล้วเลือกล้างผลเสียของตนหนึ่งอย่าง หรือส่งผลเสียสุ่มหนึ่งอย่างให้ผู้เล่นอื่นที่ยังมีชีวิต เกราะป้องกันผลเสียของเป้าหมายยังทำงาน

- ตระกูล: personal-npc; flags: npcEvents
- จังหวะ: พบ Dark One; มีทรัพยากรจ่ายและมีเป้าหมาย
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:363](../../../apps/comic/src/game/appraisal/content.ts#L363)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/npc-events.ts:27, policy:apps/comic/src/game/appraisal/npc-events.ts:106, policy:apps/comic/src/game/appraisal/npc-events.ts:if:3435
- Operations: operation:apps/comic/src/game/appraisal/npc-events.ts:9171, operation:apps/comic/src/game/appraisal/npc-events.ts:9428

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent"
  ],
  "legacyTargetGates": []
}
```

## E112 การอัปเกรดที่คาดไม่ถึง

เลือกส่งสินค้าหนึ่งชิ้น หรือจ่ายพลัง 2 ให้ Autometa แลกรับพรสุ่มหนึ่งอย่าง พรใช้จำนวนครั้งและระยะเวลาตามคำอธิบายของสถานะ

- ตระกูล: personal-npc; flags: npcEvents
- จังหวะ: พบ Autometa; มีสินค้าให้แลกหรือมีพลัง 2
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:364](../../../apps/comic/src/game/appraisal/content.ts#L364)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/npc-events.ts:28, policy:apps/comic/src/game/appraisal/npc-events.ts:110, policy:apps/comic/src/game/appraisal/npc-events.ts:if:4262
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent"
  ],
  "legacyTargetGates": []
}
```

## E113 คำสัตย์นักรบ

ใช้พลัง 2 ฝึกคำสัตย์กับ Orc สุ่มรับพรด้านการต่อรอง ความปลอดภัย หรือคุ้มครองชีวิตหนึ่งอย่าง

- ตระกูล: personal-npc; flags: npcEvents
- จังหวะ: พบ Orc; มีพลัง 2
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:365](../../../apps/comic/src/game/appraisal/content.ts#L365)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/npc-events.ts:29, policy:apps/comic/src/game/appraisal/npc-events.ts:111, policy:apps/comic/src/game/appraisal/npc-events.ts:if:4373
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent"
  ],
  "legacyTargetGates": []
}
```

## E114 เสบียงให้ผู้นำทาง

ส่งสินค้าหนึ่งชิ้นให้ Beast รับการฟื้นพลังสูงสุด 4 และชีวิตสูงสุด 2 พร้อมพรนำทางสุ่มหนึ่งอย่าง การฟื้นขึ้นกับเพดานและผลติดตัว

- ตระกูล: personal-npc; flags: npcEvents
- จังหวะ: พบ Beast; มีสินค้าที่ส่งให้ได้
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:366](../../../apps/comic/src/game/appraisal/content.ts#L366)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/npc-events.ts:30, policy:apps/comic/src/game/appraisal/npc-events.ts:112, policy:apps/comic/src/game/appraisal/npc-events.ts:if:4406
- Operations: operation:apps/comic/src/game/appraisal/npc-events.ts:9864, operation:apps/comic/src/game/appraisal/npc-events.ts:9918

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent"
  ],
  "legacyTargetGates": []
}
```

## E115 ความลับในเสียงคลื่น

จ่าย 3 เครดิตฟังความลับจากก้นบึ้ง เปิดผลตรวจที่ยังไม่รู้หนึ่งด้านของสินค้าในร้านหนึ่งชิ้นแบบสุ่ม พร้อมรับพรแห่งห้วงลึกสุ่มหนึ่งอย่าง

- ตระกูล: personal-npc; flags: npcEvents
- จังหวะ: พบ Deep Sea Monster; มีเครดิต 3 และยังมีข้อมูลสินค้าไม่รู้
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:367](../../../apps/comic/src/game/appraisal/content.ts#L367)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/npc-events.ts:32, policy:apps/comic/src/game/appraisal/npc-events.ts:113, policy:apps/comic/src/game/appraisal/npc-events.ts:if:4453
- Operations: operation:apps/comic/src/game/appraisal/npc-events.ts:10426

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent"
  ],
  "legacyTargetGates": []
}
```

## E116 แบ่งปันแก่รังใหญ่

ส่งสินค้าหนึ่งชิ้นให้รัง สุ่มรับพรจากฝูงสองอย่างที่ต่างกัน ผลแต่ละอย่างใช้จำนวนครั้งและระยะเวลาของสถานะนั้น

- ตระกูล: personal-npc; flags: npcEvents
- จังหวะ: พบ The Swarm; มีสินค้าที่ส่งให้ได้
- แหล่ง: [apps/comic/src/game/appraisal/content.ts:368](../../../apps/comic/src/game/appraisal/content.ts#L368)
- ทางเลือก: accept (generic-default-policy), decline (generic-default-policy)
- Policies: policy:apps/comic/src/game/appraisal/npc-events.ts:31, policy:apps/comic/src/game/appraisal/npc-events.ts:119, policy:apps/comic/src/game/appraisal/npc-events.ts:if:4406
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent"
  ],
  "legacyTargetGates": []
}
```

## E117 ด่านเก็บค่าผ่าน

ผู้เฝ้าด่านเรียกเก็บค่าผ่านก่อนเปิดประตู ทุกทางมีราคา ไม่มีทางผ่านฟรี

- ตระกูล: core2; flags: core2
- จังหวะ: ก่อนเลือกประตู
- แหล่ง: [apps/comic/src/game/appraisal/core2-specs.ts:20](../../../apps/comic/src/game/appraisal/core2-specs.ts#L20)
- ทางเลือก: pay (base), fog (base), burden (base)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/core2-events.ts:resolveCore2Event"
  ],
  "legacyTargetGates": []
}
```

## E118 สัญญาหน้าประตู

ประตูแรกรับเครดิตสด ประตูที่สองให้ส่วนลดแต่ผูกเงื่อนไขกับคุณ

- ตระกูล: core2; flags: core2
- จังหวะ: ก่อนเลือกประตู
- แหล่ง: [apps/comic/src/game/appraisal/core2-specs.ts:22](../../../apps/comic/src/game/appraisal/core2-specs.ts#L22)
- ทางเลือก: cash (base), condition (base)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/core2-events.ts:resolveCore2Event"
  ],
  "legacyTargetGates": []
}
```

## E119 ผู้เฝ้าประตูทวงหนี้

ผู้เฝ้าประตูทวงเครดิตเก่า จ่ายสดตอนนี้ ติดดอกเบี้ย หรือยอมเสียแรงเปลี่ยนทาง

- ตระกูล: core2; flags: core2
- จังหวะ: ก่อนเลือกประตู
- แหล่ง: [apps/comic/src/game/appraisal/core2-specs.ts:24](../../../apps/comic/src/game/appraisal/core2-specs.ts#L24)
- ทางเลือก: pay (base), interest (base), switch (base), pay (eventChoiceRules:1), interest (eventChoiceRules:1), switch (eventChoiceRules:1)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/core2-events.ts:resolveCore2Event"
  ],
  "legacyTargetGates": []
}
```

## E120 ผู้ตรวจสอบสงสัย

ราคาที่คุณตั้งสูงเกินหน้าร้านมาก ผู้ตรวจสอบเรียกค่าอธิบาย จ่ายด้วยอะไรก็ได้ที่คุณมี

- ตระกูล: core2; flags: core2
- จังหวะ: หลังประเมินราคาสูงเกินจริง
- แหล่ง: [apps/comic/src/game/appraisal/core2-specs.ts:26](../../../apps/comic/src/game/appraisal/core2-specs.ts#L26)
- ทางเลือก: pay (base), energy (base), item (base), pay (statusLinks:1), energy (statusLinks:1), item (statusLinks:1), pouch (statusLinks:1)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/core2-events.ts:resolveCore2Event"
  ],
  "legacyTargetGates": []
}
```

## E121 พ่อค้าตะคอก

พ่อค้ารู้ว่าคุณโกหกเรื่องราคา เขาเรียกค่าปรับหรือบังคับให้คุณรับภาษีแฝง

- ตระกูล: core2; flags: core2
- จังหวะ: หลังประเมินราคาสูงเกินจริง
- แหล่ง: [apps/comic/src/game/appraisal/core2-specs.ts:28](../../../apps/comic/src/game/appraisal/core2-specs.ts#L28)
- ทางเลือก: pay (base), tax (base), blood (base), pay (eventChoiceRules:1), tax (eventChoiceRules:1), blood (eventChoiceRules:1)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/core2-events.ts:resolveCore2Event"
  ],
  "legacyTargetGates": []
}
```

## E122 ศาลเงาพิพากษา

ศาลเงาตัดสินความโลภ ค่าปรับหนักที่สุด แต่คุณเลือกได้ว่าจะจ่ายด้วยอะไร

- ตระกูล: core2; flags: core2
- จังหวะ: หลังประเมินราคาสูงเกินจริง
- แหล่ง: [apps/comic/src/game/appraisal/core2-specs.ts:30](../../../apps/comic/src/game/appraisal/core2-specs.ts#L30)
- ทางเลือก: pay (base), item (base), blood (base), energy (base)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/core2-events.ts:resolveCore2Event"
  ],
  "legacyTargetGates": []
}
```

## E123 ถูกจับตอนฉกของ

ยามเงาจับมือคุณได้ ค่าปรับหนัก จ่ายตามที่เหลือ หรือยอมรับตราขโมย

- ตระกูล: core2; flags: core2
- จังหวะ: หลังขโมยหรือหลอกแลกของล้มเหลว
- แหล่ง: [apps/comic/src/game/appraisal/core2-specs.ts:32](../../../apps/comic/src/game/appraisal/core2-specs.ts#L32)
- ทางเลือก: pay (base), energy (base), item (base), blood (base)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/core2-events.ts:resolveCore2Event"
  ],
  "legacyTargetGates": []
}
```

## E124 มือล้วงถูกจับ

เหยื่อจับข้อมือคุณได้ ค่าชดเชยจ่ายให้เหยื่อโดยตรง

- ตระกูล: core2; flags: core2
- จังหวะ: หลังล้วงกระเป๋าเพื่อนล้มเหลว
- แหล่ง: [apps/comic/src/game/appraisal/core2-specs.ts:34](../../../apps/comic/src/game/appraisal/core2-specs.ts#L34)
- ทางเลือก: pay (base), energy (base), item (base), blood (base)
- Policies: 
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/core2-events.ts:resolveCore2Event"
  ],
  "legacyTargetGates": []
}
```

## E125 ข่าวลือจากพ่อค้าเร่

พ่อค้าเร่ขายข่าวลือเรื่องราคา ซื้อด้วยเครดิตหรือแลกด้วยแรงเดินตามหา

- ตระกูล: core2; flags: core2
- จังหวะ: ระหว่างประเมิน
- แหล่ง: [apps/comic/src/game/appraisal/core2-specs.ts:36](../../../apps/comic/src/game/appraisal/core2-specs.ts#L36)
- ทางเลือก: pay (base), walk (base), decline (base)
- Policies: policy:apps/comic/src/game/appraisal/core2-events.ts:if:3533
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/core2-events.ts:resolveCore2Event"
  ],
  "legacyTargetGates": []
}
```

## E126 ยาหม้อเถื่อน

ยาจากหม้อต้มข้างทางฟื้นกำลังได้จริง แต่ผลข้างเคียงติดตัวไปถึงช่วงหน้า

- ตระกูล: core2; flags: core2
- จังหวะ: ระหว่างประเมิน
- แหล่ง: [apps/comic/src/game/appraisal/core2-specs.ts:38](../../../apps/comic/src/game/appraisal/core2-specs.ts#L38)
- ทางเลือก: drink (base), decline (base), drink (statusLinks:1), calm (statusLinks:1), decline (statusLinks:1)
- Policies: policy:apps/comic/src/game/appraisal/core2-events.ts:if:3632
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/core2-events.ts:resolveCore2Event"
  ],
  "legacyTargetGates": []
}
```

## E127 เจ้าหนี้เงา

เจ้าหนี้เงายื่นเครดิตให้ทันที แลกกับดอกเบี้ยและภาษีแฝงที่ตามมา

- ตระกูล: core2; flags: core2
- จังหวะ: ระหว่างประเมิน
- แหล่ง: [apps/comic/src/game/appraisal/core2-specs.ts:40](../../../apps/comic/src/game/appraisal/core2-specs.ts#L40)
- ทางเลือก: borrow (base), decline (base), borrow (eventChoiceRules:1), decline (eventChoiceRules:1)
- Policies: policy:apps/comic/src/game/appraisal/core2-events.ts:if:4079
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/core2-events.ts:resolveCore2Event"
  ],
  "legacyTargetGates": []
}
```

## E128 พิธีสละของ

ผู้ประกอบพิธีรับของเซ่นหนึ่งชิ้นแล้วให้เกราะคุ้มภัยเป็นการตอบแทน

- ตระกูล: core2; flags: core2
- จังหวะ: ระหว่างประเมิน
- แหล่ง: [apps/comic/src/game/appraisal/core2-specs.ts:42](../../../apps/comic/src/game/appraisal/core2-specs.ts#L42)
- ทางเลือก: offer (base), decline (base), offer (statusLinks:1), ward (statusLinks:1), decline (statusLinks:1)
- Policies: policy:apps/comic/src/game/appraisal/core2-events.ts:if:2410, policy:apps/comic/src/game/appraisal/core2-events.ts:if:4289
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/core2-events.ts:resolveCore2Event"
  ],
  "legacyTargetGates": []
}
```

## E129 เงาสะท้อนผู้ประเมิน

เงาของคุณเสนอให้ประเมินได้ปลอดภัยขึ้น หรือรับตรานักโกงแลกเสียงกระซิบ

- ตระกูล: core2; flags: core2
- จังหวะ: ระหว่างประเมิน
- แหล่ง: [apps/comic/src/game/appraisal/core2-specs.ts:44](../../../apps/comic/src/game/appraisal/core2-specs.ts#L44)
- ทางเลือก: steady (base), whisper (base), decline (base), steady (statusLinks:1), whisper (statusLinks:1), decline (statusLinks:1)
- Policies: policy:apps/comic/src/game/appraisal/core2-events.ts:if:4509
- Operations: data-driven / generic handler; see handlerRefs

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/core2-events.ts:resolveCore2Event"
  ],
  "legacyTargetGates": []
}
```

## E130 ช่างไขลานหลงมิติ

จ่าย 3 เครดิต ลดเวลารอที่เหลือของสกิลที่รอนานที่สุด 1 รอบ หรือผ่าน

- ตระกูล: merchant-ability; flags: trustAbilities
- จังหวะ: มีสกิลที่ยังรออยู่
- แหล่ง: [apps/comic/src/game/appraisal/ability-content.ts:20](../../../apps/comic/src/game/appraisal/ability-content.ts#L20)
- ทางเลือก: wind (source-dependent), decline (source-dependent)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:187, policy:apps/comic/src/game/appraisal/events.ts:325, policy:apps/comic/src/game/appraisal/events.ts:if:7775, policy:apps/comic/src/simulation/appraisal.ts:if:1337
- Operations: operation:apps/comic/src/game/appraisal/events.ts:28245, operation:apps/comic/src/game/appraisal/events.ts:28267

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E131 ตลาดซื้อขายเวลา

เลือกเร่งสกิลครั้งถัดไป 1 รอบ หรือรับ 5 เครดิตแลก cooldown ครั้งถัดไปเพิ่ม 2 รอบ

- ตระกูล: merchant-ability; flags: trustAbilities
- จังหวะ: มีพ่อค้าที่ไว้ใจอย่างน้อยหนึ่งราย
- แหล่ง: [apps/comic/src/game/appraisal/ability-content.ts:21](../../../apps/comic/src/game/appraisal/ability-content.ts#L21)
- ทางเลือก: haste (source-dependent), credits (source-dependent), decline (source-dependent)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:182, policy:apps/comic/src/game/appraisal/events.ts:188, policy:apps/comic/src/game/appraisal/events.ts:326, policy:apps/comic/src/game/appraisal/events.ts:if:7938, policy:apps/comic/src/simulation/appraisal.ts:if:1337
- Operations: operation:apps/comic/src/game/appraisal/events.ts:28359, operation:apps/comic/src/game/appraisal/events.ts:28386, operation:apps/comic/src/game/appraisal/events.ts:28407

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```

## E132 ทางแยกของฝูง

เลือกรับทิศทางแปรผันเพื่อเพิ่มตัวเลือกสัตว์นำทาง หรือใช้พลัง 1 เปิดความแท้ของสินค้าในร้านหนึ่งชิ้น

- ตระกูล: merchant-ability; flags: trustAbilities
- จังหวะ: มีสินค้าจากพ่อค้าที่ไว้ใจ
- แหล่ง: [apps/comic/src/game/appraisal/ability-content.ts:22](../../../apps/comic/src/game/appraisal/ability-content.ts#L22)
- ทางเลือก: compass (source-dependent), survey (source-dependent), decline (source-dependent)
- Policies: policy:apps/comic/src/game/appraisal/events.ts:183, policy:apps/comic/src/game/appraisal/events.ts:189, policy:apps/comic/src/game/appraisal/events.ts:327, policy:apps/comic/src/game/appraisal/events.ts:if:17463, policy:apps/comic/src/simulation/appraisal.ts:if:1337
- Operations: operation:apps/comic/src/game/appraisal/events.ts:28475, operation:apps/comic/src/game/appraisal/events.ts:28628, operation:apps/comic/src/game/appraisal/events.ts:28650

```json
{
  "bondSpec": null,
  "polishSpec": null,
  "handlers": [
    "code:apps/comic/src/game/appraisal/events.ts:resolveEvent"
  ],
  "legacyTargetGates": []
}
```
