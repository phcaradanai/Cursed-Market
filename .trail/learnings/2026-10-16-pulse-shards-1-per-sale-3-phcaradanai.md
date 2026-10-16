---
title: "Pulse shards: 1 per sale, 3 per life, wary pays 0"
author: Phcaradanai
date: 2026-10-16
branch: main
cost: { minutes: 4, tokens: 14200 }
touches:
  - ".impeccable/hook.cache.json"
  - src/appraisal-client/App.tsx
  - src/appraisal-client/en/ui.ts
  - src/game/appraisal/brokerage.ts
  - src/game/appraisal/engine.ts
  - src/game/appraisal/mechanics.ts
  - src/game/appraisal/types.ts
  - src/game/appraisal/views.ts
  - tests/appraisal-expansion.test.ts
  - tests/appraisal-passives.test.ts
---

## Decided
- Correction to the earlier pulse-shards note: PULSE_RULES is shardsPerSale 1, shardsPerLife 3, shardsWhenWary 0. The user confirmed "1 shard per sale, 3 shards = 1 life". Wary pays none (my reading of the old "reduced to 1"), so confirm if they meant something else.

## Tried and ruled out
- 3 shards per sale (first reading): one sale mended 1 life by itself, which was too strong.

## Watch out
- Sold items leave p.stock, so tests must index stock[0] again after each sale.
