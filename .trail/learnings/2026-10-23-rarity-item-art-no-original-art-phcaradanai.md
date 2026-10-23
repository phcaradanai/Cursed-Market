---
title: "Rarity item art: no original-art flash, no dark inset frame"
author: Phcaradanai
date: 2026-10-23
branch: fix/event-choices
cost: { minutes: 8, tokens: 98273 }
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - src/appraisal-client/ItemVisual.tsx
  - src/appraisal-client/item-visual.css
  - src/shared/rarity-renderer.ts
  - ".gemini/settings.json"
  - ".impeccable/config.json"
  - AGENTS.md
  - GEMINI.md
  - docs/art/concepts/3d-dark-fantasy-2026-10-21/01-entry.png
---

## Decided
ItemVisual has three states (visual-loading / visual-ready / visual-failed). The original <img> stays hidden (visibility, keeps layout) until the WebGL canvas draws; it shows only on failure (import error, texture error, WebGL unavailable, context lost). The tile background #0e0c09 matches the shader bg so loading shows no hole.
The shader's 90% art inset (q=p/.9) and edge vignette apply only to cutout art (key). Opaque JPEG art fills the tile edge to edge; the inset read as a dark frame around every rare item.
## Tried and ruled out
A load timeout that falls back to the original art: offscreen items never draw (IntersectionObserver), so they would time out and swap again on scroll. Context loss now reports onError from draw() instead.
## Watch out
With full-bleed JPEG art, src.a=1 everywhere, so bg-only effects (aura, rings, orbit) no longer show on non-cutout items; tint, sheen, signature pattern and particles still do. The clockwork theme's diagonal stripes are its signature pattern, not a bug.
