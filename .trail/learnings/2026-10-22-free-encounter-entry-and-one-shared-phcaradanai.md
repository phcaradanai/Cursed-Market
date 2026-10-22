---
title: Free encounter entry and one shared merchant action per item
author: Phcaradanai
date: 2026-10-22
branch: main
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - src/appraisal-client/App.tsx
  - src/appraisal-client/components.tsx
  - src/appraisal-client/en/ui.ts
  - src/appraisal-client/model.ts
  - src/game/appraisal/engine.ts
  - src/game/appraisal/mechanics.ts
  - src/game/appraisal/survival.ts
  - src/game/appraisal/types.ts
---

## Decided
User rule on 2026-10-22: starting an encounter costs no energy. Every merchant item gets one free action, choosing either one inspection property or its initial appraisal. Further inspections and counteroffers retain their existing costs. Free merchant inspections are outside the normal inspection quota so every stock item, including bonus stock, can use its right.
New runs enable config.freeMerchantAction. Track spent item IDs in Appraiser.merchantActionsUsed, reset at encounter advance, and expose a seat-specific ItemView.freeMerchantAction. Server and client use the same eligibility. SURVIVAL_RULES.entryEnergyCost is now 0.
## Tried and ruled out
A single free action per encounter cannot satisfy one per item. Keeping free inspections inside the two-inspection quota prevents bonus stock from using its right. Existing tests of passive permits and old exhaustion rules explicitly disable the new option to retain their original purpose.
## Watch out
Historical audits without freeMerchantAction keep paid actions; replay restores their serialized entryEnergyCost. Merchant free actions are spent before other free-inspection sources and do not consume those sources or cost statuses. Owned items and counteroffers do not gain this right. Classic exhaustion must not pause a zero-energy seat while its current merchant still has an unused free item action.
