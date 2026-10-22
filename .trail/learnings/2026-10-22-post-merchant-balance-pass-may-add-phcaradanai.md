---
title: Post-merchant balance pass may add and change items and content
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
On 2026-10-22 the user clarified that the planned integration and balance pass after adding trust-based merchant abilities may both add new content and change existing content. They explicitly allow adding more products/items. Scope includes the previously requested effects, buffs/debuffs, encounters, events, and RNG work.
## Tried and ruled out
Do not restrict the upcoming balance pass to numeric edits of the existing item roster or merely attaching cooldown effects to existing content. New items are authorized when they serve the new mechanics.
## Watch out
This is scope authorization in an ongoing design discussion, not confirmation that implementation has started or finished. No new catalog size, exact item names, costs, drop weights, or balance constants have been approved. Preserve the user's explicit Swarm forty-percent effect rule and consumable-copy restriction unless the user changes them. Judge added content by its practical collection and decision value, rather than adding quantity alone.
