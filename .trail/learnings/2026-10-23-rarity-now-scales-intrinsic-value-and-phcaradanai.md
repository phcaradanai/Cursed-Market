---
title: Rarity now scales intrinsic value and beneficial numerical effects
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
User update on 2026-10-23: higher rarity increases item value and effect strength; Common 20 credits / 2% becomes Uncommon 40 / 4%. This supersedes the visual-only scope for new runs. A separate versioned rarityEconomy config defaults to value/effect ×1,2,3,4,6,8 across Common→Mythic. Only Common/Uncommon were exemplified by the user; higher-tier multipliers remain experimental and configurable.
The server stores public rarityPower factors and scales base/ask/reservation once on first appearance assignment. Benefits compose rarity × copy 40%; strongest-five held copies, strongest same-kind activation, resource rounding and all existing chance/resource caps remain. Costs, curse damage and drawback magnitudes keep their previous copy-scaled strength via itemDrawbackScale.
## Tried and ruled out
Changing visuals alone no longer meets the request. Applying a multiplier globally in copySaleQuote would double-scale already-priced item bases and negotiated transfers; instead scale catalog/order reference quotes explicitly. grant previously dropped powers >=1, so it now retains the strongest power above one. Replacement candidates must scale before the pre-existing source-value ceiling. Updating a quote without its client preview can produce rounding mismatches; wishOffer now publishes per-item final quotes.
## Watch out
rarityEconomy absent in old or visual-only audits means no monetary/effect changes. Feature-gate new worst-case funding checks too. Dark Market orders reserve maximum configured tier value and protect other reservations before consulting hidden contract facts. Numerical item descriptions update the benefit amount only, not caps or five-copy limits. See src/shared/rarity-power.ts and docs/plan/Seeded_Rarity_v1.md. The demo labels synthetic base 20 credits / 2% and uses the real shared multiplier policy.
