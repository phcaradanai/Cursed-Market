---
title: "Status links 1: every status has a source, ties settle RPS theft"
author: Phcaradanai
date: 2026-10-23
branch: fix/event-choices
cost: { minutes: 17, tokens: 87526 }
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - src/appraisal-client/SecureEconomy.tsx
  - src/appraisal-client/ability-text.ts
  - src/appraisal-client/core2-text.ts
  - src/appraisal-client/i18n-content.ts
  - src/appraisal-client/i18n-en.ts
  - src/appraisal-client/model.ts
  - src/game/appraisal/core2-content.ts
  - src/game/appraisal/core2-events.ts
---

## Decided
- Config `statusLinks: 1` (in DEFAULT_APPRAISAL_CONFIG; absent in saved audits, which replay unchanged).
- v0.6 status sources via CORE2_CHOICES_LINKED (core2-specs.ts; core2Choices(id,rules) now takes {eventChoiceRules,statusLinks}): E128 ward → B21; E126 calm → B23, drink → seeded 60% B24 else D23 (Core2Choice.gamble); E120 pouch → D22+D24; E129 whisper → D24+B12. A lost merchant duel grants D21. B21–B24/D21–D24 join boon/NPC blessing/hex pools via linkedStatuses (core2.ts).
- RPS duels: on a tied round, thief edge = B22 + thieves-night omen − D21, defender edge = victim B21; nonzero net decides the duel and spends the statuses. B22 is no longer spent at duel start. View field tieGoesTo counts only the viewer's own statuses + omen. D21 blocks merchant abilities.
## Tried and ruled out
- Granting currentOnly statuses (D22/D24/B23/B24) from dread at settlement: they expire before the next encounter, so they were wired to in-encounter events instead.
## Watch out
- npc-events must use ALL_STATUS_CATALOG (it crashed on B21 names with STATUS_CATALOG).
- tests/appraisal-status-links.test.ts scans engine source for grants/reads; flag-gated grants (D21 on merchant loss) look ungated to it.
- EN text for v0.6 statuses and most v0.6 omens is still missing (falls back to Thai).
