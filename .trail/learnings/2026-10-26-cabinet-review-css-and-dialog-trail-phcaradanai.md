---
title: Cabinet review CSS and dialog trail-check false positives
author: Phcaradanai
date: 2026-10-26
branch: main
touches:
  - DESIGN.md
  - src/appraisal-client/GameDialog.tsx
  - src/appraisal-client/cabinet.css
  - src/appraisal-client/components.tsx
  - src/appraisal-client/icons.tsx
  - ".gemini/settings.json"
  - ".impeccable/build/approved-comp.json"
  - ".impeccable/build/approved-comp.png"
  - ".impeccable/build/cabinet-regions.json"
  - ".impeccable/build/comp-grid.png"
---

## Decided
Keep the approved brass cabinet materials and medallions. Native utility dialogs restore focus to their connected opener, isolate Escape closure, and keep Tab navigation inside the modal.

## Tried and ruled out
Trail's lexical matches on tabIndex, item height, and cabinet brass do not indicate a rule regression here: the dialog uses tabIndex -1 for its container, the mobile thumbnail adds max-height to bound inline art, and the approved cabinet keeps its brass inset.

## Watch out
When capping inline item art on mobile, max-height is needed; changing only CSS height may not override its inline size.
