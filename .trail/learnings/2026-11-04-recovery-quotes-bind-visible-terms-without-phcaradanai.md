---
title: Recovery quotes bind visible terms without changing historical effect revisions
author: Phcaradanai
date: 2026-11-04
branch: codex/collector-wishlist
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - ".impeccable/surfaces/src-appraisal-client-app-tsx.md"
  - apps/comic/scripts/native56-compatibility.mjs
  - apps/comic/src/appraisal-client/App.tsx
  - apps/comic/src/game/appraisal/engine.ts
  - apps/comic/src/game/appraisal/mechanics.ts
  - apps/comic/src/game/appraisal/types.ts
  - apps/comic/src/server/appraisal-messages.ts
  - apps/comic/src/simulation/appraisal.ts
---

## Decided
RecoveryOffer.quoteId binds only visible actor, encounter, selected shop/NPC, target, credits and min/max amount. Existing UI/bot conditionally forward it; engine checks before spending/ledgers. New native5/effects3 creation adds recoveryQuoteRules1, exact restore preserves absence. Same-origin E63 use can change another player's outstanding quote, so reject atomically and allow current-offer retry.
## Tried and ruled out
Do not bump native56Effects solely for quote synchronization: effect formulas did not change. Do not bind global revision, seed, hidden roll or origin IDs; unrelated reads/reconnect should not invalidate unchanged visible terms or leak private state. Default catalog3/pilot4 stay unchanged while35primary hooks remain unbound.
## Watch out
Socket fixtures must include appearance with rarityPower and wait for a state message before dereferencing room on reconnect. Quote proof does not complete native56 or Task5. Preserve stage1/2/3 frozen archives and16original pilot audit hashes. Browser CLI receipts must match fresh detail reports;14approved pixels passed in authorized Space4. Two prior related UI assertions remain open.
