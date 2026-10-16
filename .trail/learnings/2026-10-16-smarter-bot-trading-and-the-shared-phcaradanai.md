---
title: Smarter bot trading and the shared bot turn
author: Phcaradanai
date: 2026-10-16
branch: main
cost: { minutes: 12, tokens: 83206 }
touches:
  - ".impeccable/hook.cache.json"
  - src/server/appraisal-rooms.ts
  - src/simulation/appraisal.ts
  - ".gemini/settings.json"
  - AGENTS.md
  - GEMINI.md
  - tests/appraisal-bots.test.ts
  - src/appraisal-client/App.tsx
  - src/appraisal-client/components.tsx
  - src/appraisal-client/en/ui.ts
---

## Decided
- Bots now trade with each other and with humans. Logic is tradeDecision() in src/simulation/appraisal.ts: it values an item (known facts, the 15% seal), then weighs the new rewards (pulse shard, buy-stack progress, saved energy, rebate, ticket force-buy) against price, fee and energy, with a per-policy margin (BUY_MARGIN). It lists unwanted goods with a rebate when they are known bad, accepts shop-goods offers only when the buyer can afford the whole price, bids for auction tickets, and buys its own shop goods only when worth covers the price (BUY_RATIO).
- Bot turns go through appraisalBotTurn(): a bot with something to do goes before one that only wants to end its phase, and a bot with an open listing stays while a human seat is still active. Both the simulation and AppraisalRoomService.afterChange use it (one action per loop pass, guard 2000).
- Measured over 143 simulated survival runs: completed trades 1 to 2588, shards 0 to 179, rebates 0 to 124, run length unchanged at about 8.5 encounters, mean scores within noise.

## Tried and ruled out
- A per-bot wait action: there is none, and a stateless bot cannot count ticks. The driver defers the bot's `done` instead.

## Watch out
- Bots only said `done` after one pass before, so they could never answer offers; any new bot action that can leave state unchanged would loop until the guard.
- An aggressive bot sometimes fails on a seed (3 seats, seed bot-3-aggressive-11) with an event error that predates this work.
- Forced purchases stay rare (about 1 in 143 runs) because three tickets are hard to collect.
