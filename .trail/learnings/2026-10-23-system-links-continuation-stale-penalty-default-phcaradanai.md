---
title: "System links continuation: stale penalty default, cap gates and demand provenance"
author: Phcaradanai
date: 2026-10-23
branch: fix/event-choices
cost: { minutes: 3, tokens: 9104 }
touches:
  - docs/validation/system-links-continuation-2026-10-23.md
  - docs/validation/system-links-continuation-2026-10-23/audit.mjs
  - src/game/appraisal/events.ts
  - src/game/appraisal/core2-events.ts
  - src/game/appraisal/views.ts
---

## Decided
- Review and diagnostics only at 0f37012: docs/validation/system-links-continuation-2026-10-23.md plus audit.mjs/report.json. No runtime rule changes or fixes were implemented.
- N1: E120 captures pay first; an allowed loan-repay during the pending consequence drains the wallet, then done and default timeout both fail event-cost. Revalidate captured choices against current resources and preserve a guaranteed penalty fallback.
- N2: E126 compares life to config maxLife rather than maxLifeOf; life 6/7 with life-relic and energy 0 is incorrectly ineligible. N3: E128 ward costs only credits but old sacrifice eligibility still requires inventory and excludes B06/B19. N4: view.dread ignores B23 while dreadNow halves actual chance.
- Positive controls cover vault/held caps, orb recovery/consumption, five held copies and B06 blocking D23. Six focused existing suites passed 97/97.
## Tried and ruled out
- Do not call the market sample proof of impossible fulfillment: rerolls, trust stock and gifts can supply absent kinds. For 100 initial seeds per mode, classic had 112/198 demand orders absent all current starting portals, survival 0/200, because classic pre-generates future items and makeMarket scans all state.items.
- Do not describe diagnostic reproduced=true as a passing regression: it means the bug remains.
- Preserve the established held authenticity/curse rule; route proposals do not authorize silently changing old replay configs.
## Watch out
- Whole-branch trail check failed 20 conflicts in pre-existing .impeccable files and prior event-choice review, with a 400KB diff cap. No commit/push, and do not claim the branch gate is green.
- The N1 room-stall implication is traced from timeout-before-message code, while the reproduction calls engine/default actions directly. No live WebSocket or browser proof this round.
- New weighted route/content rules need versioned config and replay checks; distinguish eligible/offered/resolved and slot starvation when measuring route coverage.
