---
title: E22 auction rebate snapshots invitation custody at first positive bid
author: Phcaradanai
date: 2026-11-05
branch: codex/collector-wishlist
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - ".impeccable/surfaces/src-appraisal-client-app-tsx.md"
  - apps/comic/scripts/native56-compatibility.mjs
  - apps/comic/src/game/appraisal/brokerage.ts
  - apps/comic/src/game/appraisal/engine.ts
  - apps/comic/src/game/appraisal/mechanics.ts
  - apps/comic/src/game/appraisal/remaining48-effects.ts
  - apps/comic/src/game/appraisal/types.ts
  - apps/comic/tests/native56-catalog.test.ts
---

## Decided
E22 (vampire-midnight-invitation) measures actual paid auction price. Snapshot qualifying invitation instances at a bidder's first positive bid; keep that start through bid withdrawal/rebid, reconcile physical custody as transactions commit and before settlement, then grant only after an actual paid win. Bank-funded rebate respects rarity/copy strength, per-win and per-run caps, origin/lot dedup, and excludes self-origin or copied auction lots.
## Tried and ruled out
Do not snapshot at settlement, allow withdrawal to reset eligibility, pay for losses/unpaid bids, or expose the private per-lot custody snapshot in public DTOs. A single held-versus-stored public command pair proves this mechanism only; it is not balance acceptance.
## Watch out
Keep native56Effects5 opt-in for new catalog5 runs and preserve absent/2/3/4 archive semantics. E22 bidder-facing explanation remains Task5 UI work; do not mark the whole game complete when the owner test is green.
