---
title: Collector private supply isolation and real App payment proof
author: Phcaradanai
date: 2026-11-02
branch: codex/collector-wishlist
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - ".impeccable/surfaces/src-appraisal-client-app-tsx.md"
  - apps/comic/src/game/appraisal/engine.ts
  - apps/comic/src/game/appraisal/ghost-service.ts
  - apps/comic/src/game/appraisal/mechanics.ts
  - apps/comic/tests/collector-wishlist.test.ts
  - docs/game-design/PROJECT-CONTEXT.md
  - docs/game-design/balance-reports/2026-11-02-pilot-coverage.json
  - docs/game-design/collector-wishlist-approval.json
---

## Decided
Private Collector escrow and its copies must never seed public market demand or Spirit quote/card pools. Shared publicOfferItems filters immutable cw- origin under rules1, not owner. No-flag keeps old pool. Initial independent review complete; owner fix verified with RED/GREEN and235 scoped regressions.
## Tried and ruled out
Filtering only owner would leak skipped/expired/paid/copied rows. Mounted UI plus sockets alone was insufficient: actual App request/peek/payment/owned item/RESULTS replay now proved with declared500/20/deadline5 fixture, not normal-budget balance.
## Watch out
UI-COLLECTOR-CONTEXT minor deferred: initial event hides request catalog entry. Whole goal remains active;48 items/STRAT/awards/normal40-credit balance still open. Source receipts in collector-offer-isolation-verification.json and collector-wishlist-review.md; Hindsight tag filtering is unreliable, Git authoritative.
