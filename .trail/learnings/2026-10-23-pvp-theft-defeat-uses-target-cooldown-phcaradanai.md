---
title: PvP theft defeat uses target cooldown and tradable sinner seals
author: Phcaradanai
date: 2026-10-23
branch: main
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - src/appraisal-client/App.tsx
  - src/appraisal-client/HeldEffects.tsx
  - src/appraisal-client/MarketSale.tsx
  - src/appraisal-client/MerchantAbilities.tsx
  - src/appraisal-client/catalog-text.ts
  - src/appraisal-client/components.tsx
  - src/appraisal-client/en/model.ts
  - src/appraisal-client/i18n-en.ts
---

## Decided
On 2026-10-23 the user replaced the assistant's suggested flat5-credit/global-one-encounter PvP theft penalty. A failed thief cannot steal from that same player for two following encounters. Sinner seals identify the thief; a victim holding two seals belonging to the same thief may choose one concealed item from up to three randomly presented goods of that thief. Seals can be traded, including buyback by the named thief. Seller may negotiate any price in credits, energy, life, goods or combinations. User also specified forced compensation of2% of the attempted item's latest transaction price, without drawing credits from personal vault. These are design rules, not an instruction to implement code yet. No approval was given for the prior multi-case notice or vault-interest recommendations.

## Tried and ruled out
The previous assistant recommendation of5 carried credits and a next-encounter ban against every player was not accepted. Do not treat buying a seal as permission to force a trade; seller sets terms and both parties must agree. Do not treat unrelated merchant notice or vault interest proposals as confirmed.

## Watch out
Clarification requested and pending: issue one seal to the defender per failed theft, allow any current holder (including secondary buyers) to redeem two matching-name seals, consume both on redemption and exclude vault/collateral goods, and charge compensation only on defeat versus every attempt. Rounding2%, missing transaction history and insufficient carried credits remain unspecified. Own-seal buyback retirement, sealed-choice persistence, fewer-than-three eligible goods, and capacity/ownership locks need explicit design before implementation. Preserve private target-item data; displaying an exact2% fee before a concealed theft can reveal its latest price.
