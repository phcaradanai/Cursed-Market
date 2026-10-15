# Three capacity relic paintings — 2026-10-15

Built-in ImageGen generated one new, unique painting for each requested name, matching the realistic charcoal-brown, worn bronze and restrained amber catalog:

| Product | Kind | Delivered image |
| --- | --- | --- |
| ขวดพลังสำรอง | vital-flask | `src/appraisal-client/public/art/item-vital-flask.jpg` |
| ศิลาชีพจรเก่า | life-relic | `src/appraisal-client/public/art/item-life-relic.jpg` |
| สมุดคำสัญญาพ่อค้า | wish-ledger | `src/appraisal-client/public/art/item-wish-ledger.jpg` |

Each opaque JPEG is 768×768, converted with `sips` at quality 85. [Exact prompts, origins and hashes](generation-prompts.json) cover all three. The 2026-10-14 60-item catalog manifest remains a historical snapshot; this addendum supplies the three subsequent kinds.

`itemImage` now selects painted JPEGs for every one of the 63 kinds. The artwork regression no longer permits vector placeholders and verifies real JPEG signatures and distinct hashes across the catalog. Historical `.svg` URLs for these three items embed the exact new JPEGs, so existing room payloads can display the same art without restarting the server. Their original vector files are backed up in `legacy-vector/`.

Validation: server TypeScript build and appraisal production build passed; the focused all-item/merchant artwork regression passed for all 63 items and eight merchants. All six live JPG/SVG URLs returned HTTP 200 with correct MIME/data from `http://localhost:3113`. A dedicated browser loaded and rendered all six variants; [preview.png](preview.png) confirms that each legacy URL displays the same realistic painting as its JPEG. The review browser was closed. The game server and existing rooms were preserved. No game rules changed as part of this image correction.

Existing browsers may have cached the old SVG placeholders; a cache-bypassing refresh retrieves the replacements. [Preview gallery](preview.html).
