# แผนที่ระบบเกมทั้งหมด

Snapshot 2026-10-30; revision 44afc49a51580e7170a7f918a86b67bbec03fae3 (รวม working tree fingerprint ใน manifest)

[เปิด HTML ทั้งระบบ](../logic-item-relations.html) · [Events](events.md) · [Status/Omen](statuses-omens.md) · [Encounter/Config](encounters-config.md) · [พ่อค้า](merchants.md) · [Actions/Logs/Validation](actions-logs.md) · [State schemas](state-schema.md) · [Coverage/ช่องว่าง](coverage.md) · [33 ระบบและหลักฐาน](systems.md)

## ชุดข้อมูล

- [data.json](data.json): catalog, ตัวเลือก, branches/guards, source spans, symbol bodies, defaults/profiles, random, operations, logs และ validation
- [graph.json](graph.json): กราฟรวมสินค้าใหม่/effect proposals เดิม + dependency ของระบบ
- [nodes.csv](nodes.csv) / [edges.csv](edges.csv): ใช้ pivot / วิเคราะห์ degree / ตรวจจุดเชื่อมมากเกินไป
- [manifest.json](manifest.json): source/output SHA256 เพื่อตรวจข้อมูลเก่า

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
## สืบต่อเมื่อเพิ่ม logic

1. แก้ runtime ตามงานที่อนุมัติ หรือแก้ข้อเสนอใน logic-item-relations.json
2. รัน `node docs/game-design/scripts/build-system-atlas.mjs`
3. รัน `node docs/game-design/scripts/build-system-atlas.mjs --check`
4. รัน `node docs/game-design/scripts/check-system-atlas.mjs` แล้วตรวจ coverage และกราฟ โดยดู guard, config, variant และ evidence ก่อนนับผล

กราฟรวมใช้เส้น domain-classification เชื่อม runtime กับ 33 logic เดิม เป็นการจัดหมวดโดยผู้จัดทำ ไม่ใช่หลักฐานว่าสินค้าใหม่ผูก runtime แล้ว คลิก logic → code → event/status/action เพื่อไล่ต่อ หรือเริ่มจาก event แล้วตามเส้นเข้าออก

ไม่มี dependency เพิ่ม ไม่รันเกมหรือสุ่มเล่นระหว่างสร้างเอกสาร ชื่อ E01 ของ effect และ event เป็นคนละ namespace ห้าม join ด้วยเลขล้วน
