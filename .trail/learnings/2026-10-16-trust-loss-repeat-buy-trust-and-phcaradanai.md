---
title: "Trust loss, repeat-buy trust and dark order tickets"
author: Phcaradanai
date: 2026-10-16
branch: main
cost: { minutes: 5, tokens: 75697 }
touches:
  - ".impeccable/hook.cache.json"
  - src/appraisal-client/components.tsx
  - src/appraisal-client/en/ui.ts
  - src/game/appraisal/brokerage.ts
  - src/game/appraisal/engine.ts
  - src/game/appraisal/mechanics.ts
  - src/game/appraisal/pulse.ts
  - src/game/appraisal/types.ts
  - src/server/appraisal-messages.ts
  - ".gemini/settings.json"
---

## Decided
- All numbers live in TRUST_RULES (src/game/appraisal/pulse.ts): caughtLoss 1, repeatBuys 3, repeatBuyTrust 1, ticketsToForce 3. The user gave no amounts for trust, so 1 is my default.
- Caught lowballing: appraise() cuts trust with that merchant by 1, never below 0.
- Repeat buys: noteRepeatBuy() in purchase() counts consecutive purchases of one merchant's goods that another seat appraised (buyStreak). The 3rd pays +1 trust and resets. A different merchant restarts the count at 1. Self-buys do not count.
- Tickets: a Dark Market auction win (settleAuction) gives 1 darkTickets. New action 'force-buy' (engine forceBuy) spends 3 and buys a shared, appraised shop item at the NPC quote, with no seller answer and no fee. The seller still gets commission, trust and shards. Forcing works on view-only listings too.

## Tried and ruled out
- Forcing inventory (player-owned) items: they have no appraised price, so only shop items can be forced.

## Watch out
- "Force" was my reading of "บังคับให้ผู้ขายรับซื้อ ... ราคาเต็มที่ประเมินไว้". Confirm with the user if they meant something else.
- Tickets are not capped and bots never bid for them.
