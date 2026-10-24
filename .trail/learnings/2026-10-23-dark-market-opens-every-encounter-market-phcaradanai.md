---
title: Dark Market opens every encounter; market may hold only half the free bank
author: Phcaradanai
date: 2026-10-23
branch: fix/event-choices
cost: { minutes: 46, tokens: 89752 }
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - src/appraisal-client/App.tsx
  - src/appraisal-client/GameDialog.tsx
  - src/appraisal-client/ItemVisual.tsx
  - src/appraisal-client/components.tsx
  - src/appraisal-client/en/ui.ts
  - src/appraisal-client/i18n-en.ts
  - src/appraisal-client/main.tsx
  - src/appraisal-client/styles.css
---

## Decided
User asked (2026-10-23) for the Dark Market to open every encounter instead of a 50% roll. Engine default `marketProbability` is now 1 (src/game/appraisal/engine.ts), which applies to every rules version that uses the default.
`makeMarket` now caps the market's reserved budget at half of the free bank (`MARKET_BANK_SHARE=.5`). If no drawn quote fits, it opens with the cheapest quote the free bank can still back. Measured over 465 simulated encounters: 0 closed markets, 0 failed runs.
The test 'market draws open every encounter...' (formerly 'intermittent market draws...') asserts the new rule; it was a rule change, not a weakened test.

## Tried and ruled out
Leaving the full free bank available to the market: with the market open every encounter it reserved nearly all of it (budget 2058 of 2058), so an event offered with free bank 3 (E86) could no longer be paid once another reward landed first ("งบรางวัลไม่พอ"). Reverting to 0.5 only hid that race.

## Watch out
With the half-bank cap a fresh run shows at most 2 quotes, not 3.
The omen 'black-night' (`marketOpen`) now has no effect; replace or remove it.
`v0.4 actual cross-shop fee and NPC payment roll back together...` in appraisal-network is flaky (seller credits off by 1, random room seed) and failed before this change too.
