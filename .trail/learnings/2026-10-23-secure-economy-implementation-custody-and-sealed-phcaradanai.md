---
title: "Secure economy implementation, custody and sealed theft"
author: Phcaradanai
date: 2026-10-23
branch: main
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - src/appraisal-client/App.tsx
  - src/appraisal-client/MarketSale.tsx
  - src/appraisal-client/MerchantAbilities.tsx
  - src/appraisal-client/components.tsx
  - src/appraisal-client/i18n-en.ts
  - src/appraisal-client/lore.tsx
  - src/appraisal-client/main.tsx
  - src/appraisal-client/model.ts
---

## Decided
User authorized implementing confirmed theft, personal vault, secured player loans and price integrity rules. This supersedes earlier planning-only implementation status. Latest server enables secureEconomy; historical audits without that field retain old rules. Theft uses sealed RPS; only hand submission is allowed while a duel is open. NPC hand commits first, draws replay free, one attempt and one energy remain. Merchant failure removes two trust and adds future merchant suspension; a single-case notice costs twice original ask. Multiple-case pricing, extra PvP defeat penalties and vault interest remain deferred.

Personal vault opens after own REVEAL payout, before readiness. Two slots free; expansion 10/15/20/etc. Vault and collateral leave held inventory and produce no held effects. Explicit custody ledger accounts conserve money. Collector and wealth still count owned vault and escrow assets. Feedback distinguishes custody transfer from actual gain/loss.

Player loans move real lender funds with bilateral approval and neutral collateral escrow. Minimum principal is ceil(last completed cash price/2). Deadline threshold is collateral price, independent of loan principal, using future scheduled base10/15 payouts. Freeze deadline and valuation at funding; allow payout and repayment before foreclosure at advance. Death alone must not accelerate foreclosure. Immutable per-item base drives deterministic price audits. Overpriced goods sell to system for0 and cannot secure new loans until successful owner reappraisal. Liquidation caps prevent inflated friend trades becoming system money; unknown value previews must not expose base.

## Tried and ruled out
Do not reuse mutable market anchors as immutable base, historical Dark Market vault as personal storage, percentage theft in secure mode, or a sink account for paid slot expansion. Do not hide own escrow assets from wealth or confiscate them early on death. Blank optional loan terms are valid. Pending ability choices cannot become theft targets; active duels cannot allow activation or other actions that move the target. Import client CSS from main.tsx so Node SSR tests can import components.

## Watch out
Full suite751 passed before final narrow feedback/duel-lock fixes; final compilation and55 focused tests passed after both. Full build and final appraisal client build passed. Actual WebSocket browser fixtures verified RPS defeat/notice, pending loan request, post-payout vault, expansion and cash/item custody. Independent visual review Ship after complete mobile recaptures. See docs/validation/Secure_Economy_v0.5.md and docs/plan/Secure_Economy_v0.5.md. Preserve existing free-per-item behavior and exhaustion consequences. Trail check's20 metadata conflicts concern preexisting Impeccable design/cache changes, not secure-economy implementation; preserve user files. Human enjoyment and final balance still need playtesting.
