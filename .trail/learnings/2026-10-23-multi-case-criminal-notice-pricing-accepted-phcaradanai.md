---
title: Multi-case criminal notice pricing accepted as twice summed case asks
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
On2026-10-23 user accepted the assistant's proposed multi-case merchant criminal-notice policy. Price is2 times the SUM of original storefront ask snapshots for ALL unresolved failed-merchant-theft cases. Example case asks20,30,50 => notice200credits. Each failed attempt is a separate case even if against the same good. Freeze each ask at occurrence; later appraisal/trade cannot lower notice price. Expired merchant suspension does not erase the record. Full payment clears all merchant cases and lifts current/future merchant trade suspension immediately, without restoring lost trust. Existing notice service availability even when ordinary Dark Market is closed remains unchanged.

## Tried and ruled out
Do not let the cheapest or most recent case clear all accumulated cases. Do not add another case-count multiplier on top of2x sum; user accepted the proposed sum-only rule. Do not use notice purchase to remove PvP victim-specific cooldowns, sinner seals, or compensation obligations: these are separate systems.

## Watch out
This is a design-policy acceptance, not a standalone implementation request. PvP defeat rules were confirmed separately: two-following-encounter same-victim cooldown, tradable thief-named seals redeemed2for1 concealed item excluding vault/collateral, compensation5% at each of four following starts using carried funds only. Vault interest is separately confirmed4% uncapped on all deposits. Remaining rounding/cash-shortfall/interest-payout details are still open; do not silently treat prior suggestions as accepted.
