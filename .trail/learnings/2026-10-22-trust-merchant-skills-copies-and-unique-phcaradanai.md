---
title: Trust merchant skills copies and unique product art
author: Phcaradanai
date: 2026-10-22
branch: main
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - src/appraisal-client/App.tsx
  - src/appraisal-client/HeldEffects.tsx
  - src/appraisal-client/MarketSale.tsx
  - src/appraisal-client/catalog-text.ts
  - src/appraisal-client/components.tsx
  - src/appraisal-client/en/ui.ts
  - src/appraisal-client/i18n-content.ts
  - src/appraisal-client/lore.tsx
---

## Decided
New v0.5 runs enable trustAbilities with all eight merchant actives at trust 1/3/6, one shared use per encounter, persisted choices and encounter-based cooldowns. Haste and reductions share a half-base cap and cannot reopen the same skill in its use encounter. Historic restored configs without the flag preserve old mechanics and seeded pools. Each original can create one lifetime Swarm copy, with value25/35/50 percent and effects40 percent. Copies keep source artwork and identify Copy #n of the original. The user requires separate artwork for every newly named product; copies are the explicit exception. New gear, hourglass and compass have three unique generated assets and recorded prompts.

## Tried and ruled out
Do not allow rerolling pending Beast/Alien choices by reconnecting, duplicating copies, laundering copy value via unconditional swaps, or applying full-strength copy effects through event/special-tool paths. Do not add cosmetic-only item variants: catalog profile verification ignores names, prices and images and asserts66 distinct mechanical profiles. New-run scanner/memory mirror/void cell replace three old duplicate activations.

## Watch out
Copied numeric effects retain fractions until integer resource boundaries, then floor without minimum1; indivisible effects use seeded40percent chance. NPC quotes scale copy value; negotiated player prices remain explicit. Scanner stock targets require current shop ownership, since stock arrays may retain sold slots. Haste counts against reduction caps. Decline/done must remain available after time-event affordability changes. Mobile appraisal needs final scoped grid and HUD overrides because later desktop CSS overrode early responsive rules. Full regression705/705 passed on2026-10-23; final build also passed. See docs/plan/Merchant_Abilities_v0.5.md and docs/validation/merchant-abilities-v0.5/ for proof and limitations.
