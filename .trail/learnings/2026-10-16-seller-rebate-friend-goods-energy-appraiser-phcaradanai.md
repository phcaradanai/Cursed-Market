---
title: "Seller rebate, friend-goods energy, appraiser seal, inherited facts"
author: Phcaradanai
date: 2026-10-16
branch: main
cost: { minutes: 7, tokens: 68010 }
touches:
  - ".impeccable/hook.cache.json"
  - src/appraisal-client/App.tsx
  - src/appraisal-client/components.tsx
  - src/appraisal-client/en/ui.ts
  - src/appraisal-client/model.ts
  - src/game/appraisal/engine.ts
  - src/game/appraisal/mechanics.ts
  - src/game/appraisal/scoring.ts
  - src/game/appraisal/survival.ts
  - src/game/appraisal/types.ts
---

## Decided
- Listing rebate: share action takes `rebate` (0-1000, needs an open purchase listing and enough credits). respond() pays it from owner to buyer through payRebate (exact: accepting fails if the owner cannot pay). force-buy pays whatever the owner has, commission from that sale included.
- Appraiser seal: itemScoreValue(base, genuine, cursed, certified) adds PROVENANCE_PERCENT 15 using integer math (20 x 1.15 must be 23, floats give 22). collectRun marks certified rows when item.appraisedBy is another seat; the client estimate does the same.
- Inherited facts: purchase() copies the appraiser's verified base/range/genuine/cursed/effects facts to the buyer, never overriding what the buyer already knows. It does not touch listing claims or the challenge flow, which settle earlier in respond().
- Free energy: friendAppraised() makes survival purchases of goods a friend appraised, with a price the merchant accepted, cost 0 energy.

## Tried and ruled out
- Assuming buying costs 1 energy. DEFAULT_APPRAISAL_CONFIG has freeBuy:true, so NPC purchases already cost 0 energy and the friend-goods rule does nothing in the live game.

## Watch out
- The friend-goods energy rule only matters if survival runs set freeBuy:false. That is a bigger economy change; decide with the user first.
- Tests that exercise energy must set config.freeBuy=false.
