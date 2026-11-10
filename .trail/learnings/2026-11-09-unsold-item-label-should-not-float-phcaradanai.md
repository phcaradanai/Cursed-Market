---
title: Unsold item label should not float on trade table
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
The user's persistent name/appraisal box in the trade phase came from the always-rendered Unsold figcaption, not the TradeScreen card tooltip. Keep the same item identity and appraised credit, but attach them to a side ComicTooltip on the item art so the content appears on hover/focus and closes on pointer exit.

## Tried and ruled out
Changing only TradeScreen's ComicTooltip cannot remove Unsold's static figcaption. Removing item identity or appraised price would make the unsold choice harder to evaluate.

## Watch out
The local trade preview has no unsold item, so exact visual confirmation requires a populated unsold fixture; do not submit a game action to create one.
