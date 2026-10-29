---
title: Comic art provenance tests distinguish families versions and metadata formats
author: Phcaradanai
date: 2026-10-29
branch: main
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - ".impeccable/surfaces/src-appraisal-client-app-tsx.md"
  - AGENTS.md
  - apps/comic/tests/appraisal-client.test.ts
  - docs/game-design/development-roadmap.md
  - docs/ui-system/README.md
  - docs/ui-system/completion-audit.md
  - docs/ui-system/historical-ui-tests.json
  - docs/ui-system/source-manifest.json
---

## Decided
The legacy comic art manifest is portable already:46 relative app-local assets. It describes24 merchant frames (8x3),20 item PNGs (10 legacy display families x original/v2), and2 grounds; this is not the new56 gameplay catalog. Test provenance from the compiled module directory rather than process.cwd so it also passes outside the repo. Check every SHA and require each merchant's angry/idle/smile frame.
## Tried and ruled out
Counting20 PNGs as20 gameplay types was wrong. Requiring every image to contain the old fidelity-pass impeccable metadata was also wrong: the10 newer item variants record generator/date/source in the versioned manifest. Preserve the original36 embedded metadata checks and verify new item origins separately; do not alter art bytes or fabricate metadata to force green.
## Watch out
The targeted provenance test passes from /private/tmp, and historical UI file improves60/67 to61/67 with6 other unchanged failures. No production code or artwork changed. Source fingerprints include the provenance manifest (359 files). Image approval, cross-width raster determinism and CPU-bound full simulations remain separate unresolved gates.
