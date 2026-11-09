---
title: Comic tooltip pointer exit correction
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
  - apps/comic/src/appraisal-client/comic-interactions.css
---

## Decided
`ComicTooltip` uses a `display:contents` wrapper, which did not reliably receive `pointerout` when the pointer left an item. While open, listen for document capture `pointermove` and close when the event target is outside the actual trigger child. Keep the shared tooltip and its existing click, blur, scroll, and Escape dismissal paths.

## Tried and ruled out
Wrapper-level `onPointerOut` alone: direct browser interaction still left the hover hint visible. Hovering an item, then the next item, then blank page space now replaces and dismisses the shared tooltip as expected.

## Watch out
Inspect `.comic-tooltip` specifically because other read-only Peek terms use `role="tooltip"`. The local trade preview has no public other-player listing, so the exact Bot1 products were unavailable; the two tables render the same item control. The tooltip content is currently noninteractive; if that changes, include the portaled tooltip itself in the pointer containment rule.
