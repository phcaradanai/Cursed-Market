---
title: Trust tier adds shop stock
author: Phcaradanai
date: 2026-10-16
branch: main
cost: { minutes: 5, tokens: 43583 }
touches:
  - ".impeccable/hook.cache.json"
  - src/appraisal-client/App.tsx
  - src/appraisal-client/en/ui.ts
  - src/game/appraisal/engine.ts
  - src/game/appraisal/mechanics.ts
  - src/game/appraisal/pulse.ts
  - src/game/appraisal/types.ts
  - src/game/appraisal/views.ts
  - ".gemini/settings.json"
  - AGENTS.md
---

## Decided
- Lowest trust across every merchant in play (activeNpcs(config): 8 with expansion, which is the default) sets the tier. Every 2 levels (STOCK_RULES.trustPerExtra) adds 1 item to the shop the seat enters: 2 gives +1, 4 gives +2. No cap beyond trust max 10, so at most +5.
- Extra items are spawned on portal entry by spawnStockItem() in engine.ts, the same recipe as the schedule, with slot 2 and up. portal.stock stays at 2, so previews are unchanged. stockBonus() lives in mechanics.ts (not engine.ts) so views.ts can use it without an import cycle. Views expose self.stockBonus {tier, extra, perExtra}.

## Tried and ruled out
- Generating extra items in the schedule: trust changes during the run, so the bonus has to be read when the portal is entered.

## Watch out
- Reaching tier 2 needs trust 2 with all 8 merchants, which is at least 16 trust gains. Trust comes from sales of that merchant's goods, wish sells and repeat buys, so this is a very late-run reward. If it should matter within about 10 encounters, lower the requirement (average trust, or count of merchants at 2+).
- Tests that act after entering a portal must have every seat enter, clear eventOffer, and wait for the APPRAISAL phase.
