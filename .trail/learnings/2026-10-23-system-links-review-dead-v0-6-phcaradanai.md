---
title: "System links review: dead v0.6 statuses and inert theft effects"
author: Phcaradanai
date: 2026-10-23
branch: fix/event-choices
cost: { minutes: 6, tokens: 90653 }
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - ".gemini/settings.json"
  - ".impeccable/config.json"
  - AGENTS.md
  - GEMINI.md
  - docs/art/concepts/3d-dark-fantasy-2026-10-21/01-entry.png
  - docs/art/concepts/3d-dark-fantasy-2026-10-21/02-lobby.png
  - docs/art/concepts/3d-dark-fantasy-2026-10-21/03-portals.png
  - docs/art/concepts/3d-dark-fantasy-2026-10-21/04-inspection.png
---

## Decided
- Review written to docs/validation/system-links-review-2026-10-23.md (Thai): status producer/consumer map, 66-item hook table, 48-run sim tallies, defects L1–L8, route ideas R1–R8.
- Verified: B21–B24 and D21–D24 have consumers but no producer anywhere (0 grants in 48 sims); boon/NPC pools use STATUS_IDS only.
- Under secureEconomy (RPS theft) B22, D21 and omen thieves-night do nothing, and startTheftDuel (theft.ts:145) consumes B22 for no effect; B21 does not guard RPS theft.
## Tried and ruled out
- Counting producers from literal grant() calls alone: most statuses come from data tables (ITEM_SPECS buff/drawback, NPC conditions, POLISH_EVENTS, CORE2_SPECS, BOND_SPECS, unsold penalties); scan those too.
## Watch out
- Held effects ignore authenticity and curse by design (item-effects.ts:19); changing that is a design call.
- Classic final encounter silently drops B09/D04/D07 grants (mechanics.ts:88).
- Bots never wish-sell, cleanse, steal or use vault/loans; sims say little about those routes.
