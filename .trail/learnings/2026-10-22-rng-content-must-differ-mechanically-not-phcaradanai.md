---
title: RNG content must differ mechanically not only in names and prices
author: Phcaradanai
date: 2026-10-22
branch: main
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - src/appraisal-client/en/ui.ts
  - src/appraisal-client/meters.tsx
  - src/game/appraisal/engine.ts
  - src/game/appraisal/mechanics.ts
  - src/game/appraisal/pulse.ts
  - src/game/appraisal/types.ts
  - src/game/appraisal/views.ts
  - tests/appraisal-stock.test.ts
---

## Decided
On 2026-10-22 the user requires more RNG through mechanically distinct content. They explicitly reject item A and item B having identical abilities and differing only by name and price. The upcoming merchant-feature integration and balance pass may add items and change effects, buffs/debuffs, encounters, events, and RNG, but new content must create materially different gameplay choices.
## Tried and ruled out
Do not inflate the content pool with renamed or repriced duplicates. Do not count larger catalog size alone as increased meaningful variety. Cosmetic labels and prices cannot establish a distinct ability.
## Watch out
For proposed items compare their complete effects, activation rules, targets, timing, costs, limits, and interactions; explain the actual situation where choosing one changes the player's decision. The assistant additionally recommends not counting magnitude-only variants as new mechanics; this is an operational interpretation of the user's requirement, rather than a separate explicit ban on all numeric variants. Apply the distinct-choice criterion to new event and status designs as well. The user has not requested randomizing every property independently or removing all RNG repetitions between encounters. No code changes are implied by this design note.
