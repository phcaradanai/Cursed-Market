# Product image audit — 2026-10-15

**PASS: 63 product names map to 63 distinct product paintings. No missing, shared or swapped product artwork was found.** This includes ขวดพลังสำรอง, ศิลาชีพจรเก่า and สมุดคำสัญญาพ่อค้า. Eight NPC portraits were also complete and distinct within their category.

| Check | Result |
| --- | --- |
| Current product kinds and unique Thai names | 63 / 63 |
| Unique canonical product image paths | 63 / 63 |
| Existing real JPEG product files | 63 / 63 |
| Distinct product file SHA-256 hashes | 63 / 63 |
| Production files match source images | 63 / 63 |
| Exact name, destination and hash match generation provenance | 63 / 63 |
| Product images decoded by browser from the live game | 63 / 63 |
| Unique decoded image fingerprints | 63 / 63 |
| Live HTTP 200, JPEG MIME and matching data | 71 / 71, including eight NPCs |
| Labeled visual comparison with current product names | 63 / 63 |
| Missing / duplicate / swapped product artwork found | 0 / 0 / 0 |

Canonical item art is selected by public kind through `itemImage(kind)`. A shared gameplay family does not select shared art. Historical SVG aliases for the three capacity relics display the same painting as that same kind's JPEG; they are compatibility URLs, not reuse across different products.

Fresh verification ran `npm run build:server` and `node --test --test-name-pattern='every item kind and merchant has its own artwork' dist/tests/appraisal-expansion.test.js`; the focused regression passed. Additional checks compared source, production, both generation manifests and live bytes from `http://localhost:3113`. A separate Ego Browser page decoded all 63 live product images with cache disabled, calculated distinct 64×64 RGBA fingerprints, and captured all names alongside their images. Each of the three contact sheets was visually inspected. The browser review space was closed; game code, existing rooms and the running server were not changed.

This verifies catalog identity, files and rendered images. It does not claim to have walked every product through every interactive game state.

- [Full labeled catalog](catalog.html)
- [Products 1–21](catalog-1.png)
- [Products 22–42](catalog-2.png)
- [Products 43–63, including the three newest relics](catalog-3.png)
- [Machine-readable evidence for every name and image](report.json)
