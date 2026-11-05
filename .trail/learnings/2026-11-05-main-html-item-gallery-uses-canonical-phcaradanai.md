---
title: Main HTML item gallery uses canonical Comic art and a standalone generator
author: Phcaradanai
date: 2026-11-05
branch: codex/collector-wishlist
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - ".impeccable/surfaces/src-appraisal-client-app-tsx.md"
  - apps/comic/scripts/native56-compatibility.mjs
  - apps/comic/src/game/appraisal/brokerage.ts
  - apps/comic/src/game/appraisal/engine.ts
  - apps/comic/src/game/appraisal/mechanics.ts
  - apps/comic/src/game/appraisal/remaining48-effects.ts
  - apps/comic/src/game/appraisal/types.ts
  - apps/comic/tests/native56-catalog.test.ts
---

## Decided
The main logic-item-relations.html now includes a searchable 56-image gallery grouped by 8 merchants, using existing canonical Comic PNGs. item-gallery-render.mjs validates IDs, counts and image SHA256 and is called by system-atlas-render.mjs. Run its --check to verify reproducibility.
## Tried and ruled out
Do not hand-edit the generated gallery or regenerate unrelated pending gameplay snapshots just to show art. No new item art or game UI identity is needed.
## Watch out
The document has global header styling; scope gallery headers to preserve equal heading/card padding. Verify 7 equal columns on wide screens, 2 on narrow screens, image dialog/Escape and existing tab switching. This gallery check does not certify the entire gameplay Atlas freshness.
