---
title: Approved UI baselines need paint readiness and fresh invocation evidence
author: Phcaradanai
date: 2026-10-30
branch: main
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - ".impeccable/surfaces/src-appraisal-client-app-tsx.md"
  - AGENTS.md
  - apps/comic/tests/appraisal-client.test.ts
  - apps/comic/tests/appraisal-trade-price.test.ts
  - docs/game-design/PROJECT-CONTEXT.md
  - docs/game-design/current-captures.json
  - docs/game-design/development-roadmap.md
  - docs/ui-system/README.md
---

## Decided
The user approved the exact 14-image UI baseline on 2026-10-30. The sealed image SHA set stays unchanged; approval is not permission for unrelated redesign or failed-gate waivers. Two full comparisons passed 14/14, max ratio 0.0000794405833 at the unchanged 0.001 limit. Affected UI/price/continuity/E109/journal tests pass 79/79; UI helper contracts pass 10/10. Source and explicit decisions govern implementation; Hindsight is supporting history. Actual approval retain/scoped recall/direct-ID roundtrip verified; broad retrieval missed relevant approval.

## Tried and ruled out
Native DPR2 and warm reloads did not fix cross-width art drift. Back-to-back screenshots could settle before final paint. Prepare up to ten current-image samples separated by two animation frames; require consecutive matching samples before comparing the reference once. Never retry a reference mismatch, relax tolerance, mask art or re-record approved images. A deferred-paint regression reproduces the old five-sample limit; stable changed pixels still fail.

## Watch out
Browser bootstrap failure can leave old green reports. Check fresh invocation exit/time and matching detailed report. Original space3 disappeared; user authorized replacement space4. Historical assertions must preserve exact financial totals and hidden facts while targeting current approved UI. Root Atlas source includes pre-existing uncommitted aged-interest work: a worktree freshness pass alone does not establish clean-clone reproducibility. Preserve/review that work separately; never silently replace comic engine or sweep unrelated changes into UI commits. Full simulations remain CPU-bound and require a separate bounded investigation.
