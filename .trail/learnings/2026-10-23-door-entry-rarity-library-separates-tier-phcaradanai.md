---
title: "Door-entry rarity library separates tier, weighted theme and public visual seed"
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
On 2026-10-23 the user requested an actual reusable library/plugin called at door selection, configurable rarity rates, multiple themes per rarity (Uncommon with ten as the example), and seeded palettes within each theme. Repeated colors are allowed; richer/stranger visuals signal higher rarity. No ImageGen variants.
Implemented src/shared/item-rarity.ts and rarity-renderer.ts as dependency-free ES modules with a thin React ItemVisual adapter. Server assigns once after an accepted enter action, including trust bonus stock. Replacement candidates get seeded descriptors on offer generation; copies retain source appearance. Descriptor {version, rarity, theme, visualSeed} survives transfers and reconnects. Rates and weighted theme pools are persisted per run; defaults are experimental, not user-approved numerical balance.
## Tried and ruled out
Do not put a field named seed in the public descriptor: the network privacy regression forbids that private-state field name. Use visualSeed, derived with a dedicated HMAC label so the run seed stays private. Do not import CSS from ItemVisual: direct Node/SSR component tests cannot load it; import its stylesheet only in client main.tsx. Do not create a WebGL context per inventory item; the reusable renderer shares one context and texture cache.
## Watch out
Common 60%, Uncommon 25%, Rare 10%, Epic 3.5%, Legendary 1.3%, Mythic 0.2% are provisional. Common has original only; higher tiers each start with ten equally weighted themes. No economic modifiers were approved. Historical exact configs without rarity retain no descriptor and old audits replay unchanged. Only key currently has a prepared alpha matte; other JPEGs get full-portrait material effects until clean mattes are supplied. See docs/plan/Seeded_Rarity_v1.md. Full suite before visualSeed rename: 759/760; the privacy failure was fixed and all 95 affected rarity/client/privacy/network tests then passed.
