---
title: Swarm copies retain forty percent effects and consumable copy use blocks recopying
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
On 2026-10-22 the user liked the revised merchant ability direction but required explicit usage limits and suitable cooldowns. They changed Beast from accessing another shop to replacing unwanted initially offered shop stock. For Swarm, user explicitly approves increasing copy value with trust while still making only one copy; effects must be reduced by 60 percent, leaving 40 percent. If a consumable copy is used, the source item must no longer be eligible for another copy.
## Tried and ruled out
Unrestricted copying of held-benefit items can compound bonuses and break the game; cooldown alone does not eliminate accumulation. Score-only copies are not the user's instruction: copies retain weakened effects. Beast portal information and additional-shop access are superseded by replacing unwanted offered goods.
## Watch out
No code implementation was requested in this design exchange. Exact cooldown lengths, trust tiers, score percentages, integer rounding, binary effects, and the precise scope of source identity versus product kind remain design details, not user-approved constants. Assistant interprets the consumable lock as attached to the physical original across ownership transfers; confirm this distinction if implementing. Existing ordinary-item held caps and per-kind activated-bonus rules still apply; the user has not authorized weakening them. Do not present assistant-proposed limits as confirmed user rules.
