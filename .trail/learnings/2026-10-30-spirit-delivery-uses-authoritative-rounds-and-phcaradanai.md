---
title: Spirit delivery uses authoritative rounds and immutable accepted quotes
author: Phcaradanai
date: 2026-10-30
branch: main
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - ".impeccable/surfaces/src-appraisal-client-app-tsx.md"
  - apps/comic/src/appraisal-client/App.tsx
  - apps/comic/src/appraisal-client/ComicPreview.tsx
  - apps/comic/src/appraisal-client/StatusMenu.tsx
  - apps/comic/src/appraisal-client/main.tsx
  - apps/comic/src/appraisal-client/model.ts
  - apps/comic/src/game/appraisal/engine.ts
  - apps/comic/src/game/appraisal/journal.ts
---

## Decided
Comic S11/G01–G04 lives only in apps/comic. User approved floor(base/10)+fee as bonus points, 1 credit=1 point, pay only on delivery, insufficient funds wait, buyer-death/end cancellation unpaid, one pending job per buyer per ghost, RPS tie retry and independent slot losses. Completing/cancelling the last job relocks service. Use existing ComicPhaseFrame/ComicButton/CompactPager and inventory bounds.
## Tried and ruled out
Local-only shuffle timers reset on watch/reopen: persist server startedAt in match/audit. Index-only quotes can change terms: bind public quoteId and preserve a private rarity-adjusted prototype. Expanded simultaneous job lists clipped narrow desktops: page one job at a time. Dev artwork comparison drift is not permission to rebaseline; frozen production preserved all14 approved images.
## Watch out
Accepted guess retries bypass the new-round shuffle gate only to reach existing signature/idempotency validation; never reset a new round. DTOs omit prototype/base/answer. Preview callbacks are not settlement proof. Use ghost core/replay/network tests plus ghost-smoke and approved UI compare; full-game balance/new56 binding remains separate. Atlas reads scoped Comic ghost sources, not duplicate global defaults. Keep unrelated .impeccable/root changes out of commits.
