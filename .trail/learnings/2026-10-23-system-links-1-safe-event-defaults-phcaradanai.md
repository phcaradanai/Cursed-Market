---
title: "System links 1: safe event defaults, held caps and independent guard choices"
author: Phcaradanai
date: 2026-10-23
branch: fix/event-choices
touches:
  - src/game/appraisal/core2-events.ts
  - src/game/appraisal/engine.ts
  - src/game/appraisal/events.ts
  - src/game/appraisal/types.ts
  - src/game/appraisal/views.ts
  - tests/appraisal-system-links.test.ts
  - tests/fixtures/system-links-legacy.json
---

## Decided
- User authorized fixing the continuation review defects. N1-N3 fixes are behind new DEFAULT_APPRAISAL_CONFIG.systemLinks=1; absent saved configs keep their historical eligibility/default behavior. N4 view.dread now calls dreadNow(state,p) directly; views are not audit state.
- N1 default intersects captured choices with currently legal/affordable core2 choices and selects only still-owned captured item targets. If none remain, system-only default adds the existing brand fallback and traces event-default-fallback. Never seize a newly acquired item instead of the captured target and never erase the penalty for free.
- N2 medicine eligibility and original heal affordability use maxLifeOf/maxEnergyOf under systemLinks. N3 E128 ward is independent of sacrifice inventory/B06/B19 gates; already-held B21 is not sold again. Sacrifice remains hidden when its protections already exist.
- Wider event-choice probe reached an additional classic E03 case: existing D10 could be reduced while gaining energy without a fresh cost. Under systemLinks, do not offer debt with existing D10 in classic; paid energy remains available and decline-only E03 is not offered. Saved configs retain old choices.
- Tests: 13 new regression cases, including actual room service tick/timeout, captured target changes and mandatory E117-E124. 140/140 tests across 11 affected files passed; server build and appraisal client typecheck passed. audit.mjs --expect-fixed reports N1-N4 fixed, with three positive-control groups and 200 market seed samples.
- Pre-fix classic/survival command/config fixtures reproduce exact original exported-audit SHA-256 hashes; do not regenerate those fixtures after a fix merely to make a test pass.
## Tried and ruled out
- Choosing current inventory[0] is wrong: it can be a new item never offered as a sacrifice. Filtering money alone also misses disappeared collateral targets.
- Suppressing the event-choice probe failure or allowlisting E03 would hide a real costless choice. Fixed the gated product behavior instead.
- No new route weighting or market-demand redesign was implemented. Initial classic demand coverage remains a documented design gap, not proof of impossible fulfillment.
## Watch out
- The earlier review-only learning is historical: this user turn explicitly authorized runtime fixes.
- trail check import-line conflicts in core2-events.ts are keyword matches: importing maxLifeOf/maxEnergyOf changes no theft odds, energy prices, vault timing or permission to add items. Keep unrelated pre-existing .impeccable changes intact and report a nonzero trail check honestly.
- New rules apply to new games. Old saved audits must not have systemLinks silently injected; restoreAppraisalRun preserves their config exactly.
