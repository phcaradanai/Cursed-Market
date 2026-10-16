---
title: "Survival mode can loop forever: why"
author: Phcaradanai
date: 2026-10-16
branch: main
cost: { minutes: 3, tokens: 62053 }
touches:
  - ".gemini/settings.json"
  - AGENTS.md
  - GEMINI.md
  - src/game/appraisal/engine.ts
  - src/game/appraisal/mechanics.ts
  - src/simulation/appraisal.ts
---

## Decided
- Nothing changed in code yet. Diagnosis only; the user still has to pick which fix to build.
- Root cause: decay is a flat 1 life per encounter (SURVIVAL_RULES.encounterLifeCost, applied in settleEncounter, src/game/appraisal/engine.ts:142). Healing outpaces it:
  - recoveryOffer (src/game/appraisal/mechanics.ts:118-125) gives +2 life (+lifeRecovery passives) for only 4+salt credits, once per encounter.
  - openRoundRewards gives 10/15 credits every encounter, so the deal is always affordable.
  - Food/potion items heal +2 (mechanics.ts:281). E114/vampire-return/market bonus also heal.
  - B19 cuts 1 damage off the decay hit (damageLife, mechanics.ts:112), so decay can drop to 0.
  - life-relic raises maxLife by up to +6.
- Proposed fixes (layered): 1) decay that grows with encounter number and ignores B19; 2) recovery price/amount that gets worse each use; 3) hard cap: Collector arrives at a fixed encounter (about 9) with a visible countdown, reusing collectRun.

## Tried and ruled out
- Fixing only heal prices: stacked food, potions and events can still out-heal a flat decay. A hard cap is the only real guarantee.

## Watch out
- assertAppraisalInvariants (engine.ts:342) needs every player at life 0 in RESULTS, and so does collectRun (survival.ts:11). A hard-cap ending has to change both.
- The bot policy in src/simulation/appraisal.ts:66 buys recovery. Use simulateAppraisalRun to measure run length after any change.
