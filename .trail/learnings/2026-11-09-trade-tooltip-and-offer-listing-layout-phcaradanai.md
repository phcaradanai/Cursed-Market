---
title: Trade tooltip and offer listing layout
author: Phcaradanai
date: 2026-11-09
branch: main
touches:
  - ".impeccable/hook.cache.json"
  - apps/comic/src/appraisal-client/App.tsx
  - apps/comic/src/appraisal-client/ComicPreview.tsx
  - apps/comic/src/appraisal-client/ComicTooltip.tsx
  - apps/comic/src/appraisal-client/PortalEventPreview.tsx
  - apps/comic/src/appraisal-client/StatusMenu.tsx
  - apps/comic/src/appraisal-client/TradeScreen.tsx
  - apps/comic/src/appraisal-client/appraisal-concept.css
  - apps/comic/src/appraisal-client/comic-frame.css
  - apps/comic/src/appraisal-client/comic-ui.css
---

## Decided
The shared TradeListing appears in both #table-item-detail and #table-offers-detail. Apply the approved item-information-left and offer-controls-right layout to both dialogs on wide screens, stacking below 1000px. Table item tooltips prefer a side position when available so they do not cover the table title; pointer exit closes the tooltip.

## Tried and ruled out
Styling only #table-item-detail leaves the #table-offers-detail copy on the inherited 120px item column, squeezing facts while leaving empty space. Centering the tabletop tooltip above its large item card can cover the table heading.

## Watch out
The local trade preview has no public other-player listing. Hover placement/dismissal can be checked there, but do not claim exact offer-modal visual verification without a populated listing fixture or submit a trade to create one.
