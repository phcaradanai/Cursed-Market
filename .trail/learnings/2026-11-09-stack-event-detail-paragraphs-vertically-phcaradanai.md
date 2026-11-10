---
title: Stack event detail paragraphs vertically
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
In the standard event's left details panel, stack the story and any optional item or merchant detail vertically and let each use the panel width. A default flex row squeezes both text blocks into narrow columns.

## Tried and ruled out
No component or data change is needed: EventDecision already groups the description and optional detail in .event-copy, so CSS fixes the layout.

## Watch out
Keep this scoped to the event details panel. Long copy can still exceed the fixed event frame on small viewports, so check those sizes when changing the copy or panel height.
