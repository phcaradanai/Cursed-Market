---
title: Personal vault interest rate confirmed at four percent
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
On2026-10-23 the user set personal-vault interest to4%. The discussion context is per encounter; this replaces the assistant's prior proposed2% rate. The user confirmed only the rate, not the entire previously suggested interest policy. This remains design discussion, with no code implementation request.

## Tried and ruled out
Do not retain2% as the intended personal-vault rate. Do not confuse vault interest4% with failed-PvP-theft compensation5% collected at four following encounter starts. Do not silently treat the prior suggested2-credit cap, payout-to-wallet policy or no-automatic-compounding policy as user-approved.

## Watch out
Asked whether4% should retain a maximum2credits per encounter or have no cap; answer pending. Qualification period, payout destination, compounding, fractional rounding and interest treatment for borrowed funds remain unconfirmed. Protected personal-vault credits still cannot be forcibly collected for theft compensation.
