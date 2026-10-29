---
title: Comic item sale reuses Share rules and pauses under utility menus
author: Phcaradanai
date: 2026-10-29
branch: main
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - ".impeccable/surfaces/src-appraisal-client-app-tsx.md"
  - src/appraisal-client/SecureEconomy.tsx
  - src/game/appraisal/engine.ts
  - src/game/appraisal/secure-storage.ts
  - src/game/appraisal/types.ts
  - src/game/appraisal/views.ts
  - tests/appraisal-network.test.ts
  - tests/appraisal-secure-client.test.ts
---

## Decided
S06 item sale v02 uses the common inventory-sized frame, equal columns and known facts separated from seller claims. ItemSalePanel calls the existing Share with a comic presentation; default callers keep the legacy presentation and the same sell/show/hide handlers. Keep CSS imports in main.tsx for component/SSR imports.
## Tried and ruled out
Independent dialog portals remained open when a utility menu opened and intercepted its close button. Do not stack them: pass utilityOpen from GameTable and pause the trade detail/offers dialog while a main menu is open.
## Watch out
Comic source is the external isolated build, not canonical realistic UI. Browser fixture payload tests are not live transactions. Temporary proof host must have height100% or it produces false button-clipping failures. Central legacy CSS can override facts grid, caption pseudo-elements and art backgrounds; verify pixels as well as dimensions. Unrelated trail check conflicts in .impeccable and SecureEconomy predate this work; do not claim that check passes.
