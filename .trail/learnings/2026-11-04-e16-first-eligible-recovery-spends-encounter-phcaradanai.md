---
title: E16 first eligible recovery spends encounter rights even if D10 blocks gain
author: Phcaradanai
date: 2026-11-04
branch: codex/collector-wishlist
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - ".impeccable/surfaces/src-appraisal-client-app-tsx.md"
  - apps/comic/scripts/native56-compatibility.mjs
  - apps/comic/src/game/appraisal/engine.ts
  - apps/comic/src/game/appraisal/mechanics.ts
  - apps/comic/src/game/appraisal/remaining48-effects.ts
  - apps/comic/src/game/appraisal/types.ts
  - apps/comic/src/game/appraisal/views.ts
  - apps/comic/tests/native56-catalog.test.ts
---

## Decided
Supersedes the actual-gain-only E16 wording in 2026-11-04-effects4-binds-actual-commission-and-first-phcaradanai.md. The first positive eligible recovery attempt spends player/tool-origin encounter rights and goods-origin/run rights even when D10 makes actual gain0. Otherwise cleansing D10 later allows another E16 attempt with a new pair, violating the approved1/encounter cap. Full energy makes no recovery attempt; first qualifying pair is still recorded. Trace/notes keep quoted and actual0 distinct.
## Tried and ruled out
Do not test by assuming grant(D10) is one charged status: ordinary D10 is duration-based and consumeStatus need not remove it. The owner regression models later cleansing explicitly, then a different real paid PvP trade in the same encounter; it failed4vs2 before fix and passes after. Do not rewrite committed1/2/3/quote3 archives; only the still-uncommitted effects4 candidate may be regenerated before first checkpoint.
## Watch out
D10 blocking, copy floor0, full energy, cancelled offer and real positive attempt are distinct cases. Never move consumption below an actual-gain guard. Existing E61/E63 and E06 policies remain unchanged. Context/memory summaries claiming actual0 consumes no E16 right are superseded by this correction and the current engine.
