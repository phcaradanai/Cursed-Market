---
title: Failed PvP theft compensation is five percent over four following starts
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
On2026-10-23 the user replaced the previously confirmed one-time2% failed-PvP-theft compensation. Charge5% of the attempted item's latest transaction price at the START of each of the four following encounters after a failed theft. Thus a fixed reference value100 yields5credits on each of starts N+1,N+2,N+3,N+4, total20credits. No immediate2% charge remains. The prior no-vault-credit funding constraint remains. Victim receives compensation. Other confirmed rules remain: target-specific two-following-encounter theft cooldown, one tradable thief-named sinner seal to defender per failure, any holder redeems two matching-name seals for one concealed choice from three random eligible carried goods, consumes both seals, excludes vault/collateral.

## Tried and ruled out
Do not retain the superseded one-time2% compensation, charge at phase end, interpret5% as a total split across four payments, or use personal-vault credits. This is continued design discussion, not a separate instruction to implement code.

## Watch out
Reference-price freezing at failure is the stated interpretation for a predictable schedule, not separately confirmed by user; avoid live repricing. Rounding, missing transaction price, insufficient carried funds, overlapping cases, death/run termination and unpaid installments remain unspecified. Own-seal buyback retirement, fewer-than-three goods and selection persistence were assistant proposals, not accepted yet. Multi-case merchant notice pricing and vault interest remain unapproved.
