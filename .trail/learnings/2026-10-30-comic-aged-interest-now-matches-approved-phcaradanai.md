---
title: Comic aged interest now matches approved root rules and forced RPS fallback is approved
author: Phcaradanai
date: 2026-10-30
branch: main
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - ".impeccable/surfaces/src-appraisal-client-app-tsx.md"
  - apps/comic/src/appraisal-client/SecureEconomy.tsx
  - apps/comic/src/game/appraisal/engine.ts
  - apps/comic/src/game/appraisal/secure-storage.ts
  - apps/comic/src/game/appraisal/types.ts
  - apps/comic/src/game/appraisal/views.ts
  - apps/comic/tests/appraisal-secure-client.test.ts
  - apps/comic/tests/appraisal-secure-seals.test.ts
---

## Decided
Active Comic now ports the narrow approved aged10% rule with vaultInterestRules:1. Old audits without it stay4%; new missing age metadata earns no retroactive interest. DTO gives rate even for a missing vault; tooltip reads server rule, never a new-run4% fallback. User approved2026-10-31 missing-hand RPS timeout/disconnect: seed only absent hands, preserve submitted hands, resolve normally. Continuous browser verification for this whole-game goal is explicitly authorized; current space10, do not finish until goal verification is complete. Upgrade is separate.
## Tried and ruled out
Applying root views hunk wholesale conflicted with the Comic ghost import: adapt only interest import/quote fields, preserving all ghost logic. Old4% test fixture must explicitly remove new flag, not change old expected outcome. Full audit export is private until RESULTS: finish the actual run before strict replay assertion. Preview fixtures are not live transactions.
## Watch out
This is one checkpoint, not whole-game completion. Remaining catalog56, strategic paths, Collector3+2 and awards still need concrete approved rules/bindings. UI reports need fresh matching CLI receipts; initial direct browser batch is intermediate only. Current latest test server3191; do not stop older user rooms. For RPS snapshot missing participants/round before autofill so a timeout tie cannot submit into the next round; phase deadline must not bypass per-round duel clock.
