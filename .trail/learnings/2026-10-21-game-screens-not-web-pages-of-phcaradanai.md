---
title: "Game screens, not web pages of information"
author: Phcaradanai
date: 2026-10-21
branch: main
cost: { minutes: 30, tokens: 103725 }
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - DESIGN.md
  - PRODUCT.md
  - package-lock.json
  - package.json
  - src/appraisal-client/App.tsx
  - src/appraisal-client/components.tsx
  - src/appraisal-client/en/ui.ts
  - src/appraisal-client/index.html
---

## Decided
The user said (2026-10-22): stop clinging to a web-like UI that displays information. Each phase must be one full-screen game scene: a compact HUD bar, the painted scene with the decision in it, one primary action, and supporting details (statuses, notes, Dark Market, inventory, contracts, rules, wishlist) behind HUD icons and drawers or hover peeks, not stacked panels down a scrolling page.

## Watch out
Keep the text in the DOM (drawers, details, peeks), because SSR tests assert it. Keep disabled-button tooltips and keep the wishlist reachable in every phase.
