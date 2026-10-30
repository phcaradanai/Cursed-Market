---
title: Whole-game status must separate active Comic gaps from completed subsystem work
author: Phcaradanai
date: 2026-10-30
branch: main
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - ".impeccable/surfaces/src-appraisal-client-app-tsx.md"
  - docs/game-design/PROJECT-CONTEXT.md
  - docs/game-design/development-roadmap.md
  - docs/game-design/logic-item-relations.html
  - docs/game-design/scripts/build-system-atlas.mjs
  - docs/game-design/scripts/check-system-atlas.mjs
  - docs/game-design/scripts/current-capture-render.mjs
  - docs/game-design/system-atlas/README.md
---

## Decided
The human-facing main HTML now renders docs/game-design/game-status.json as a whole-game status table. PROJECT-CONTEXT and roadmap link it. Spirit S11/G01–G04 completion is not whole-game completion. Root aged10% interest is implemented, while active Comic remains4% current-balance interest; migrate separately, not by claiming the new vault UI includes new rules. New56 bindings, strategic paths, Collector3+2 wishlist, awards and full balance remain incomplete.
## Tried and ruled out
Appending new milestone notes below stale roadmap rows left contradictory status. Reconcile the leading summary/rows and generate HTML from structured status data. The Atlas root baseline plus scoped Comic ghost inputs is not a full active Comic snapshot; label that scope explicitly.
## Watch out
The checker asserts active/root rate facts against their actual source constants and verifies status/evidence rendering. Keep future migrations and status data aligned. Existing wish mechanics are merchant wishlist, not Collector3+2. Ghost bonus scoring is not the requested whole-game award system.
