---
title: Forced RPS fills only missing hands and shares Comic frame
author: Phcaradanai
date: 2026-10-30
branch: main
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - ".impeccable/surfaces/src-appraisal-client-app-tsx.md"
  - apps/comic/src/appraisal-client/App.tsx
  - apps/comic/src/appraisal-client/ComicPreview.tsx
  - apps/comic/src/appraisal-client/SecureEconomy.tsx
  - apps/comic/src/appraisal-client/main.tsx
  - apps/comic/src/game/appraisal/engine.ts
  - apps/comic/src/game/appraisal/theft.ts
  - apps/comic/src/game/appraisal/types.ts
---

## Decided
Comic new runs use theftTimeoutRules:1; old flagless audits retain cancelled timeout. Missing-human hands seed by duel/round/player, reuse chooseTheftHand, stop on round change. User approved inventory-sized ComicPhaseFrame with equal tracks, hiding duplicate phase behind duel; utility navigation read-only. Evidence forced-rps-verification.json.
## Tried and ruled out
Cancelling or phase-defaulting a forced duel lets users evade. Filling after a tie without round guard consumes the next round. A hand command needs a round token for new rules, but accepted idempotent retries must still ack after phase expiry. Do not run two browser suites on one Page concurrently. Timers asset test must run in apps/comic cwd.
## Watch out
Independent server30s clock survives reconnect; late unsent round commands reject. Target picker and resolved history retain legacy expanding layout: not full UX completion. Full-game catalog56/strategy/Collector still open. Fixture captures are not settlement proof or automatic approved baselines. Keep whole-goal Ego space10 active; user authorized continuous checks.
