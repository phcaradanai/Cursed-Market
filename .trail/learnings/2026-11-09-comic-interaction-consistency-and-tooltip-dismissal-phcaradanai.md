---
title: Comic interaction consistency and tooltip dismissal
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
  - apps/comic/src/appraisal-client/comic-theme.css
---

## Decided
Keep Comic hover and selected accents on the shared vermilion token, keyboard focus on the rose 3px/4px ring, and pressed feedback at 1px. ChoiceCards should show a single selected outline; item artwork should not lift on hover.

## Tried and ruled out
The legacy `input:checked + *` selector outlines ChoiceCard inner text as well as the card. Remove that sibling rule and style the `.choice-card.selected` wrapper. Do not rely on a decorative item's full grid button to move its artwork for hover feedback.

## Watch out
`ComicTooltip` is wrapped in `display:contents`; pointer exit should be checked against the actual trigger child, not only the wrapper. Current pointerout fix and cross-screen styling could not be manually verified because Ego Lite and the browser host were unavailable.
