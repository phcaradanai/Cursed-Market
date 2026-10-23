---
title: Vault interest four percent has no cap
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
On2026-10-23 user explicitly selected uncapped personal-vault interest:4% of the entire deposited credit balance per encounter. This resolves the cap question left pending in Personal vault interest rate confirmed at four percent. A qualifying balance100 yields4credits;1000 yields40credits. No2-credit maximum applies. Design discussion only; no implementation request.

## Tried and ruled out
Do not apply the assistant's previously proposed maximum2credits per encounter, a deposit-value ceiling or a tiered rate. The user chose4% on the whole deposited amount.

## Watch out
This confirmation settles rate and lack of cap only. Qualification timing, payout destination, compounding and fractional rounding remain unconfirmed; do not infer acceptance of those prior assistant suggestions. Keep vault interest separate from failed-PvP-theft compensation5% at the four following encounter starts. Personal-vault assets remain protected from theft and forced compensation collection.
