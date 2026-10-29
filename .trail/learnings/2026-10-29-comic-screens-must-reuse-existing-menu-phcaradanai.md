---
title: Comic screens must reuse existing menu styling before decorative concepts
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
User corrected S06 sale implementation: this is one game, so reuse inventory/status ComicMenu and ComicButton styling, not a new visual system per concept. Retain one shared outer frame and header; prefer spacing over central, provenance, rebate and footer dividers. Align all value rows to a shared label column and equalize minus/input/plus heights.
## Tried and ruled out
Brush caption ribbons, offwhite choice buttons, paper fact cards and repeated separator lines made this screen look unrelated to existing menus. Even if a draft uses decorative comic styling, implementation must be reconciled with the current game and latest human correction.
## Watch out
Widths alone are insufficient: compare inner left edges, padding and control heights. Current sale layout measured equal columns and zero overflow at1024,1440,1920; choice and rebate value rows share x590,826,1066 respectively. CSS imports stay in main.tsx; no gameplay rules changed by this pass.
