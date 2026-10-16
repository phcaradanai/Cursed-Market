---
title: "Trade-rule visuals: meters, trust ring, provenance chips"
author: Phcaradanai
date: 2026-10-16
branch: main
cost: { minutes: 13, tokens: 221319 }
touches:
  - ".impeccable/hook.cache.json"
  - src/appraisal-client/App.tsx
  - src/appraisal-client/components.tsx
  - src/appraisal-client/en/ui.ts
  - src/appraisal-client/icons.tsx
  - src/appraisal-client/lore.tsx
  - src/appraisal-client/styles.css
  - src/game/appraisal/engine.ts
  - src/game/appraisal/mechanics.ts
  - src/game/appraisal/types.ts
---

## Decided
- New rules are shown as pictures in src/appraisal-client/meters.tsx, with the conditions in the shared Peek card (new tone `rule`, RuleHint). Fortune strip (tickets, shards, buy stack) shows in APPRAISAL and TRADE; TrustRing (one portrait disc per merchant plus the extra-goods bonus chip) shows in PORTALS; Provenance chips (merchant portrait, merchant ask or appraiser price, what you paid, seal, rebate, bonus) show on trade listings and in the sale announcement (Share); stock tabs carry a Bonus badge; inventory thumbs carry a compact seal.
- Server data for the visuals: Appraiser.buyLog (last 3 merchants, replaces buyStreak, clears when three match), Appraiser.paid map (price paid per held item), AppraisalItem.bonus flag, stockBonus.npcs. `paid` lives on the player, not the item, because item fields are replayed against stored historic audits.

## Tried and ruled out
- Putting `paid` on the item: it broke the exact replay of published v0.4 audits.
- Removing AppraisalPrice from TradeListing: existing tests assert its text, so Provenance sits beside it.

## Watch out
- On narrow screens .trade-listing uses display:contents, so any new block in it needs grid-column:1/-1 (as .prov and .force-buy have).
- Every new t() string in a client file needs an English entry, and new client files must be added to CLIENT_FILES in tests/appraisal-i18n.test.ts.
- Local-only fixture server for visual checks lived outside the repo; it must build state with real seat ids, not literal names.
