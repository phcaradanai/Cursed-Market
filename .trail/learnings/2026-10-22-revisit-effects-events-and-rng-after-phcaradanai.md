---
title: Revisit effects events and RNG after adding merchant abilities
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
On 2026-10-22 the user established the sequence: after adding the trust-based merchant ability feature, revisit effects, buffs/debuffs, encounters, events, and RNG so the existing systems cover and interact with the new feature. Explicit examples are activated items that reduce cooldown and debuffs that increase cooldown.
## Tried and ruled out
Do not treat merchant abilities as an isolated finished subsystem and leave the existing item/status/event pools disconnected from their cooldowns. The user is asking for a follow-up integration and balance pass, not merely additional merchant flavor.
## Watch out
Detailed cooldown adjustment amounts, stacking limits, targeting, duration, fractional handling for 40-percent Swarm copies, and RNG distributions are not yet approved. Define the difference between changing a currently running cooldown and modifying a cooldown started by the next ability use. Examine indirect loops involving item preservation, Swarm copies, healing, and cooldown reductions. This discussion records intended scope and sequencing; it does not mean the new merchant feature or the follow-up pass has been implemented.
