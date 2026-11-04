---
title: E06 cap means first real penalty not first nonzero rounded saving
author: Phcaradanai
date: 2026-11-04
branch: codex/collector-wishlist
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - ".impeccable/surfaces/src-appraisal-client-app-tsx.md"
  - apps/comic/scripts/native56-compatibility.mjs
  - apps/comic/src/game/appraisal/challenge.ts
  - apps/comic/src/game/appraisal/engine.ts
  - apps/comic/src/game/appraisal/remaining48-effects.ts
  - apps/comic/src/game/appraisal/types.ts
  - apps/comic/src/game/appraisal/views.ts
  - apps/comic/tests/native56-catalog.test.ts
---

## Decided
Correction supersedes the zero-rounded-saving sentence in the earlier native56 effects2 note: approved E06 triggers on the first positive real failed-challenge credit penalty. With eligible positive basis points, record player/origin use even when floor(penalty*bps/10000) is zero. Only actual zero penalty (including void seal) preserves rights. This follows the frozen approved contract; no new passive no-op exception.
## Tried and ruled out
A preliminary implementation returned before recording rights when saved was zero, incorrectly allowing another discounted challenge in the same encounter. New regression observed38 instead of approved50 on the second challenge after a1credit first penalty. Change the guard to no eligible basis points, not no rounded saving.
## Watch out
Do not apply the active/no-op cost rule to this held once-per-encounter trigger. Keep source/compiled/public proof fingerprints fresh after this correction, preserve red evidence, and rerun frozen stage1/stage2 replays. No balance or full56 completion claim.
