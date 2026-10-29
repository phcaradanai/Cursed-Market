---
title: Comic continuity uses repo app and measured inner symmetry
author: Phcaradanai
date: 2026-10-29
branch: main
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - ".impeccable/surfaces/src-appraisal-client-app-tsx.md"
  - AGENTS.md
  - README.md
  - apps/comic/DESIGN.md
  - apps/comic/README-COMIC-BUILD.md
  - apps/comic/README.md
  - apps/comic/docs/art/comic-assets.json
  - apps/comic/package.json
---

## Decided
User explicitly authorized moving the external comic build into apps/comic, separate from legacy root src. Read docs/ui-system/README.md and decisions.md first. Repo source and verified captures govern current implementation; Hindsight supports history. A retain/read-back roundtrip succeeded during the audit but arbitrary probe markers were normalized and tag retrieval was not strict.
## Tried and ruled out
Equal outer columns did not fix rebate controls. Coin decoration inside the stepper offset the group; inherited 44px button min-width overflowed 40px tracks and created 8px/12px gaps. Move decoration outside and set min-width:0. Check input/group/action centres and actual gaps at all target widths. Do not add decorative page styles or dividers to solve spacing.
## Watch out
Comic and root game code differ: preserve journal/content paths and isolate both apps. Pixel candidates are not human approval. Image complete alone can capture interim soft raster: await decode/composition and consecutive matching captures without masking art or relaxing tolerance. Existing historical comic tests still contain cabinet/art assumptions; report failures instead of rewriting tests to force green. Trail check has a400KB diff cap on this migration; no exhaustive-pass claim.
