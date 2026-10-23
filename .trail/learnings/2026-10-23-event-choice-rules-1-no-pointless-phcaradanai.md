---
title: "Event choice rules 1: no pointless decline, mishaps, repriced debts"
author: Phcaradanai
date: 2026-10-23
branch: fix/event-choices
cost: { minutes: 34, tokens: 223443 }
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - src/appraisal-client/core2-text.ts
  - src/appraisal-client/i18n-content.ts
  - src/appraisal-client/i18n-en.ts
  - src/appraisal-client/model.ts
  - src/game/appraisal/ability-content.ts
  - src/game/appraisal/brokerage.ts
  - src/game/appraisal/content.ts
  - src/game/appraisal/core2-events.ts
---

## Decided
- New config `eventChoiceRules: 1` (in DEFAULT_APPRAISAL_CONFIG; absent in saved audits, which replay unchanged). Under it: free gifts (E108, E131, E132, E42, E43, 11 bond show/reveal gifts via isBondGift) have no decline; bond gifts use no event slot. E37 = pay 2 / D06 / drop an item. E40 = repair 2 energy / discard scanner / endure D02, not offered while D02 is on. E119 pay 2 vs interest 1 + D04; E121 pay 3; E127 borrow 3; D04 debts not offered when classic has no next encounter (CORE2_CHOICES_V2 + core2Choices in core2-specs.ts). E47 sells one fact the listing's appraiser knows for 1 credit. E01/E10 lose the duplicate decline; E08 is not offered. E42 fountain energy ignores D10. E79/E90 not offered while their statuses are held.
- A no-decline offer whose conditions lapse (bank drained, etc.) ends as `event-lapsed` instead of trapping the seat.
- Timeouts use REWORKED_DEFAULT (events.ts): the gift, the first boon, or the mildest mishap cost.
## Tried and ruled out
- Leaving `decline` as a hidden escape: it would bring the pointless button back. Tests now clear events with tests/event-dismiss.ts.
## Watch out
- tests/appraisal-event-choices.test.ts probes ~106 events on real mid-run tables (~50 s) and fails on pointless declines, dominated declines and duplicate choices; it also checks the old rules still get flagged. Gambles/hidden-fact swaps (E51 E70 E74 E87 E93 E107) and note-only E14 are allowlisted.
- E43 can no longer be declined, so zero-price trade tests must expect the +1 subsidy.
- Not changed: E27, E31, E38 (balance, awaiting design).
