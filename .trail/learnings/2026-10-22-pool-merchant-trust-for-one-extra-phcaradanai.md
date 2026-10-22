---
title: Pool merchant trust for one extra shop good per three points
author: Phcaradanai
date: 2026-10-22
branch: main
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - src/appraisal-client/en/ui.ts
  - src/appraisal-client/meters.tsx
  - src/game/appraisal/engine.ts
  - src/game/appraisal/mechanics.ts
  - src/game/appraisal/pulse.ts
  - src/game/appraisal/types.ts
  - src/game/appraisal/views.ts
  - tests/appraisal-stock.test.ts
---

## Decided
Supersedes the 2026-10-16 all-merchant stock-bonus rules. On 2026-10-22 the user requested that any merchant's trust contribute: new runs add one shop item per 3 current trust points summed across active merchants (3/6/9 gives +1/+2/+3). Generate extras when entering a shop, as before. The trust ring shows pooled total, bonus count and points to the next extra item in Thai and English.
## Tried and ruled out
Requiring trust 1 with every merchant and capping the reward at one item is no longer the requested rule. Do not change that historical path in place: totalTrustStock defaults true in new configs; absent or false preserves old stock and audit replay. Existing trust-earning and trust-loss rules remain unchanged.
## Watch out
Current trust is summed, rather than lifetime gains; losses reduce bonuses on future shop entries. Existing shop stock is not retroactively added or removed. Disabled expansion merchants do not contribute. The optional view total field identifies pooled progress; legacy views retain their old shape. The flag must survive exact audit restore without injecting current defaults.
