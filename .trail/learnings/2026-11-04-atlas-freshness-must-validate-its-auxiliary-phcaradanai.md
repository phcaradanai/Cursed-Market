---
title: Atlas freshness must validate its auxiliary readiness reports
author: Phcaradanai
date: 2026-11-04
branch: codex/collector-wishlist
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - ".impeccable/surfaces/src-appraisal-client-app-tsx.md"
  - docs/game-design/game-status.json
  - docs/game-design/implementations/remaining48-plan.md
  - docs/game-design/logic-item-relations.html
  - docs/game-design/new56-readiness.json
  - docs/game-design/remaining48-audit.html
  - docs/game-design/remaining48-audit.json
  - docs/game-design/scripts/check-system-atlas.mjs
---

## Decided
check-system-atlas.mjs now delegates audit-new56.mjs --check and audit-remaining48.mjs --check as well as its own manifest checks. Regenerate auxiliary reports before the final Atlas build. Runtime source and approved image baselines remain unchanged.
## Tried and ruled out
A types.ts interface-only shortcut comment changed its source hash after the readiness report was generated. Atlas own fingerprint/output check passed while the separate new56 readiness checker correctly rejected the stale types.ts pin after9ec8092. Added child checks; observed real stale-report RED, regenerated readiness/remaining/Atlas, then GREEN.
## Watch out
Freshness of a report file does not imply freshness of the source hashes stored inside that report. Do not repin an old gameplay proof as if new execution; current public pilot and normal-run proofs already used final source/compiled hashes. This fix updates generated source metadata and validation wiring only. Scope21owner-tested/35pending,3priorUI assertion failures and E63 quote synchronization remain unchanged.
