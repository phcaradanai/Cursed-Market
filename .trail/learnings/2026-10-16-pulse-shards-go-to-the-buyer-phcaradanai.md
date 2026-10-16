---
title: "Pulse shards go to the buyer, not the appraiser"
author: Phcaradanai
date: 2026-10-16
branch: main
cost: { minutes: 13, tokens: 38103 }
touches:
  - ".impeccable/hook.cache.json"
  - src/appraisal-client/App.tsx
  - src/appraisal-client/en/ui.ts
  - src/game/appraisal/brokerage.ts
  - src/game/appraisal/mechanics.ts
  - src/game/appraisal/pulse.ts
  - tests/appraisal-pulse.test.ts
  - ".gemini/settings.json"
  - AGENTS.md
  - GEMINI.md
---

## Decided
- The user wants pulse shards paid only to the buying side. Correction to the earlier notes, which paid the appraiser.
- purchase() in mechanics.ts now calls gainShards(buyer) once per purchase when survival is on and any item was appraised by another seat. Self-buys pay nothing. completeAppraisedSale no longer touches shards, so the seller keeps commission and trust only. force-buy goes through purchase(), so it pays the buyer too.
- The wary rule now reads the buyer's tradeLink: buying from the same single partner for more than 3 encounters pays 0 until the buyer buys from someone new.
- Dark Market auction wins are not paid shards; they pay a ticket instead.

## Tried and ruled out
- Paying both sides: doubles the collusion yield, so it was not done.

## Watch out
- The earlier learnings say the appraiser earns shards; this one supersedes that part.
