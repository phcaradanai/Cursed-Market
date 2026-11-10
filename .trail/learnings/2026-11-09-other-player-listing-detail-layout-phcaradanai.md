---
title: Other-player listing detail layout
author: Phcaradanai
date: 2026-11-09
branch: main
touches:
  - ".impeccable/hook.cache.json"
  - apps/comic/src/appraisal-client/App.tsx
  - apps/comic/src/appraisal-client/ComicPreview.tsx
  - apps/comic/src/appraisal-client/PortalEventPreview.tsx
  - apps/comic/src/appraisal-client/StatusMenu.tsx
  - apps/comic/src/appraisal-client/appraisal-concept.css
  - apps/comic/src/appraisal-client/comic-frame.css
  - apps/comic/src/appraisal-client/comic-ui.css
  - apps/comic/src/appraisal-client/components.tsx
  - apps/comic/src/appraisal-client/feedback.tsx
---

## Decided
When viewing another player's listing, place item identity, seller source, provenance, known facts and expandable item details in the left column; place offer price, contract/optional swap, known costs and submit action in the right column on wide screens. Stack these groups on narrow screens. Keep the existing item-fact visibility and offer handlers unchanged.

## Tried and ruled out
The previous single content stream left large unused horizontal space in the detail dialog and made the user's offer controls feel detached from the listing. A two-group layout uses the available width while retaining the existing ComicMenu and shared controls.

## Watch out
The trade preview can have no public other-player listings, so a successful build does not prove the rendered P2P detail geometry. Check the exact listing at desktop and narrow widths when a populated fixture is available; do not submit an offer during layout inspection.
