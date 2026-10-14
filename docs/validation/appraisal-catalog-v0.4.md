# Cursed Market v0.4 — catalog expansion to 30 products

2026-10-14 — User requested at least 30 products. Implemented **30 distinct catalog kinds**, adding 20 to the original 10, each with its own Thai name, price anchor and mechanical profile. They are available through seeded NPC stock, normal purchases/activation/P2P, and exact-kind Dark Market demand. This is the shared catalog, not a guarantee of seeing every kind in one run.

## What changed

- `types.ts` expands ItemKind and records optional `catalogVersion` in run config. New runs default to version 2 (30 kinds). Version 1 and absent versions restore the original 10-kind pool and original RNG ordering.
- `content.ts` supplies all 30 definitions, 10 family mappings and nine favored kinds per merchant. Every kind belongs to at least one merchant pool. New orbs have distinct energy restoration amounts; other profiles vary price, benefit, curse drawback and consumption.
- `engine.ts` separates new-run default construction from exact saved-config restore. Audit replay and report timing reconstruction both use that restore factory, preserving old config shape without adding fields to published logs.
- Family-specific activation and E07/E31/E32/E33/E34/E35/E36/E38/E39 eligibility/targets accept new family members. New-key previews disclose door unlocking when that status is present. Dark Market quotas/demand remain tied to the exact kind, rather than accepting any member of a family.
- Existing React controls use live ItemView names/prices/effects. New kinds map to existing family art paths, avoiding missing images and hidden-truth clues. There are still 10 item rasters and 6 NPC rasters with original provenance, not 30 independently illustrated products. No CSS, component layout, typography or design tokens changed.

[Catalog and values](../plan/Item_Catalog_v0.4.md) document all 30 kinds and migration/rollback. Numeric balance remains experimental.

## Verification

**312 tests pass, 0 fail, 0 skipped**: prior 270 plus 42 catalog tests. Each of the 30 product cases uses real seeded stock to purchase, inspect effects, activate, complete and strictly replay a run; a second seeded run purchases and immediately sells that exact kind to a matching Dark Market order, then completes/replays. There are 60 completed seeded case runs in this coverage. Nine family-event cases accept variants. The new-key preview/actual unlock is verified. The catalog test checks unique names/profiles, all merchant coverage, existing art paths and invalid catalog version rejection.

The same-kind inventory regression now derives expected positions from its fixture instead of assuming exactly 10 owned items. Its checks for matching inventory/sale identities and distinct known facts are retained. Initial fixture failures came from sending an extra enter after an entry event had already chosen a route, omitting the required E34 status target, and a hardcoded inventory ordinal; the fixture logic/assertion was corrected without changing entry-event rules.

- [Full test output](appraisal-catalog-v0.4/tests.txt)
- [Full TypeScript/server/legacy/appraisal build output](appraisal-catalog-v0.4/build.txt)
- [Fresh 1,200 replay-verified simulation runs](../simulation/appraisal-catalog-v0.4/summary.json), 2/3/4 players × four policies × 100; does not prove balance or fun
- [Actual HTTP/WebSocket test audits](appraisal-catalog-v0.4/network/network-2-players.json) for 2, 3 and 4 seats; original domain/network safety and legacy regressions pass
- [CLI checks](appraisal-catalog-v0.4/cli-check.json): six old/new raw/room replay cases; [six mixed original/expanded room reports](appraisal-catalog-v0.4/mixed-report.json); [reproduction](appraisal-catalog-v0.4/check-cli.mjs)
- Original v0.4 compatibility test strictly replays/re-exports **11 published original raw/room audits** with absent catalogVersion and checks old downloaded-room reporting. v0.1/v0.2/v0.3 CLI compatibility remains intact. No old baseline JSON was overwritten.
- [Current source hashes](appraisal-catalog-v0.4/source-sha256.json) separate this expansion from the original M0–M5 delivery snapshot.

## LAN handoff

Current expanded-catalog game: **http://192.168.10.150:3104**, started with `PORT=3104 HOST=0.0.0.0 npm run start:appraisal`, PID 27527. The server's en0 IP changed from the earlier 192.168.1.114 snapshot; the old IP timed out, while localhost health returned 200. Current-IP validation passed.

[LAN checks](appraisal-catalog-v0.4/lan-check.json) verify HTTP health/index and 21 JS/CSS/art/font assets with MIME, and actual synthetic 2/3/4-seat full runs, strict replay, version-2 catalog audits and rematch reset through the current LAN address. [Reproduction script](appraisal-catalog-v0.4/check-lan.mjs) uses the public DTO bot. This remains traffic from the server machine, not separate human devices or browser QA.

All prior listeners remain untouched: 3100 PID99522, 3101 PID4365, 3102 PID9128, 3103 PID23920. Port3103 continues the original 10-kind server module in memory; the shared appraisal static bundle now contains the expanded client catalog and can still render those original DTO kinds. New catalog play uses port3104. Rooms are in memory; download before rematch/restart. Use [LAN instructions](../plan/Appraisal_LAN_v0.4.md) and the existing [human protocol](../playtests/appraisal-v0.4.md).

The user's stop on new browser/image QA remains binding. No browser, screenshot or image inspection was performed. Family image reuse is intentional for this content extension; final illustration quality and rendered/mobile/accessibility behavior are not certified. Human enjoyment, reduced repetitive decisions and final balance remain unproven.
