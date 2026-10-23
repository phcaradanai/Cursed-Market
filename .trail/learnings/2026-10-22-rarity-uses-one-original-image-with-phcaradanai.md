---
title: "Rarity uses one original image with runtime effects, never generated tier art"
author: Phcaradanai
date: 2026-10-22
branch: main
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - src/appraisal-client/App.tsx
  - src/appraisal-client/MarketSale.tsx
  - src/appraisal-client/components.tsx
  - src/appraisal-client/i18n-en.ts
  - src/appraisal-client/main.tsx
  - src/appraisal-client/model.ts
  - src/game/appraisal/brokerage.ts
  - src/game/appraisal/core2-actions.ts
---

## Decided
User clarified on 2026-10-23: product rarity must reuse one original image/model. Distinctiveness and richer visuals increase with rarity. Use tools, libraries or custom runtime effects; do not generate a new image for each tier. This supersedes the earlier imagegen concept as the desired demonstration method.
A standalone native WebGL proof of concept lives in docs/art/rarity-runtime-demo/, using the existing item-key.jpg with one derived GrabCut alpha matte. Six tier styles share the exact source RGB; shader recoloring, sheen, motes, smoke and rings are computed at render time.
## Tried and ruled out
Imagegen comparison art illustrated the idea but did not prove the user's required reuse pipeline. Do not repeat that approach for rarity variants.
## Watch out
JPEG art contains a background: extract a clean matte once before applying object-local effects. The demo's matte has a small fringe and is not a universal segmentation pipeline. Production inventory rendering should share GPU resources rather than creating one WebGL context per item. Keep rarity separate from hidden authenticity/curse. Tier names, odds and economic modifiers are not approved by this visual request.
