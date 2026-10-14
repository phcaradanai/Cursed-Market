# Appraisers v0.4 — missing images and configurable room timing

Verified 2026-10-14. User request: **“รูปไม่แสดง เพิ่มให้สามารถตั้งค่าการจับเวลาหรือไม่ได้”**; clarified image failure on **LAN port 3104**. Current updated service: **http://192.168.10.150:3105**. This is a bounded technical extension to the completed v0.4 delivery, not new human-fun or final-brand approval.

## Image diagnosis and correction

Dark Market constructed `/art/item-${order.kind}.png`. Twenty expanded product variants intentionally share the original ten family images, so variant filenames do not exist. `src/appraisal-client/components.tsx` now uses the existing authoritative `itemImage(order.kind)` helper, matching other item views. An SSR regression renders every one of the thirty kinds and verifies the emitted family path exists. No new illustration, icon, font, or art-family mapping was introduced.

Separate technical diagnostics checked all sixteen PNG files' signatures, chunk CRCs, IHDR, decompressed payloads and IEND. NPC dimensions are 1122×1402; item families are 1254×1254, 8-bit RGB. A narrow functional IAB check on 3104 confirmed the entry portrait decoded at 1122×1402 without console errors. These facts identify a URL-construction defect; they do not certify raster quality or all rendered game screens.

## Room timing behavior

- Only the lobby host can save timing settings. Four phases—PORTALS, APPRAISAL, TRADE, REVEAL—accept whole **1–900 seconds**; initial values stay **30/90/45/4 seconds**.
- Meaningful changes reset all readiness; equivalent retries preserve it. Settings remain room-owned across resume, host transfer and rematch, and cannot change during a run.
- Timed phases retain one fixed deadline. Actions do not extend it; existing expiry defaults remain authoritative.
- Untimed phases have `deadline:null` and no timeout-driven advancement. Players finish normal phases manually; all seats confirm REVEAL. An absent seat that still must answer needs to return. Paused players retain the reveal confirmation control.
- Host controls, guest summaries, countdown, rules and completed-player notices reflect the acknowledged server mode. Valid duration drafts are preserved when saving untimed mode. Older room DTOs without settings show default-server copy and no unsupported editing controls.
- Strict message validation rejects extra keys, missing phases, invalid modes, fractional seconds and values outside bounds. An optional `timerSettings` field in schema-v4 room audits preserves old audit readers; current reports validate supplied settings and reject timeout records in an untimed audit. Internal fake-clock fixtures retain their existing millisecond precision.

## Verification

| Evidence | Current result |
| --- | --- |
| [Full suite](appraisal-timers-v0.4/tests.txt) | **322 passed**, zero failed/skipped; 312 prior tests plus 10 image/timer regressions |
| [Focused UI/timer suite](appraisal-timers-v0.4/focused.txt) | **71 passed**, zero failed/skipped: 61 client/model/SSR plus 10 new regressions |
| [Final build](appraisal-timers-v0.4/build.txt) | Server TypeScript and both legacy/appraisal Vite bundles pass; final appraisal JS `index-C1c_bC4L.js`, CSS `index-COXbJ23Z.css` |
| [Live LAN runs](appraisal-timers-v0.4/lan-check.json) | Six completed synthetic socket runs: 2/3/4 seats × custom timed or untimed. Three encounters, strict replay and rematch reset pass with settings retained. Timed values are 7/11/13/2 seconds; untimed audits contain no timeouts |
| [Final served assets](appraisal-timers-v0.4/final-assets.json) | Rebuilt HTML and **21 assets** return 200, correct MIME and exact bytes matching disk: JS/CSS, 16 PNG, 3 TTF |
| [CLI compatibility](appraisal-timers-v0.4/cli-check.json) | **11** historical/catalog/timed/untimed completed replays and **9** mixed downloaded room reports pass; [report](appraisal-timers-v0.4/mixed-report.json) preserves `humanFunValidated:false` |
| Functional lobby DOM | On 3105, saving untimed mode preserves a valid 120-second PORTALS draft, disables duration fields, resets host readiness, and rules acknowledge the new mode. Synthetic room was left; only the agent-created tab was closed |
| [Source/build manifest](appraisal-timers-v0.4/source-sha256.json) | 161 hashed source/test/build files; all **21** game/simulation sources match the prior catalog manifest. Earlier 1,200-run domain simulation remains separate evidence; it was not rerun |

Reproduce targeted LAN and CLI evidence without overwriting older delivery/catalog baselines:

```sh
node docs/validation/appraisal-timers-v0.4/check-lan.mjs http://192.168.10.150:3105
node docs/validation/appraisal-timers-v0.4/check-assets.mjs http://192.168.10.150:3105
node docs/validation/appraisal-timers-v0.4/check-cli.mjs
```

These scripts replace only this extension's evidence. Full tests' network audits are additionally saved as `network/network-{2,3,4}-players.json`; six live audits use `network/lan-{timed,untimed}-{2,3,4}-players.json`.

## Independent handoff and design hooks

The [fresh finish reviewer](appraisal-timers-v0.4-review.md) initially found one mode-copy inconsistency: completed players in untimed rooms were promised expiry. One bounded fix changed the notice to wait for other players and added an actual two-seat timed/untimed SSR regression. Its independent ten-test run passed; focused verdict **ship, F1 resolved**. This verdict scores source/test behavior, not rendered quality.

The [fresh documenter](../art/appraisal-v0.4/timers-documentation.md) found no new primitive mismatch. Root `DESIGN.md` and `.impeccable/design.json` retain their exact incumbent hashes, confirmed independently and in the manifest. No detector ignore or suppression was added. The older hook finding `design-system-font Georgia` is absent in current indexed source; legacy headings inherit the documented typography. No new repair or ignore was needed for that historical finding. Pre-existing `config-build-path-unset` remains reported in the documentation handoff without a scope-expanding repair.

## Live service and limits

Snapshot after final build: listeners **3100 PID99522, 3101 PID4365, 3102 PID9128, 3103 PID23920, 3104 PID27527** remain running. The new service is **3105 PID29252**, launched with `PORT=3105 HOST=0.0.0.0 npm run start:appraisal`. No existing server was killed or restarted; earlier in-memory rooms and baseline audits remain. The shared static appraisal directory is rebuilt, so a reload can receive updated UI while older services expose their original settings capability. Use 3105 for new configurable rooms. Default appraisal PORT remains 3103.

The stop instruction **“หยุดตรวจภาพ ใช้ผลตรวจเดิม”** continues to exclude screenshots, raster/art review and rendered layout/mobile/accessibility QA. This bug fix used narrowly functional browser DOM and image-decoding diagnostics. No new human playtest, external-device reachability, visual approval, balance proof, public hosting or automation is claimed. The original negative auction feedback remains the only supplied human enjoyment evidence.
