---
title: Pulse shards and trust-gated life deals in survival
author: Phcaradanai
date: 2026-10-16
branch: main
cost: { minutes: 14, tokens: 184920 }
touches:
  - ".impeccable/hook.cache.json"
  - src/appraisal-client/App.tsx
  - src/appraisal-client/en/ui.ts
  - src/game/appraisal/brokerage.ts
  - src/game/appraisal/engine.ts
  - src/game/appraisal/mechanics.ts
  - src/game/appraisal/types.ts
  - src/game/appraisal/views.ts
  - tests/appraisal-expansion.test.ts
  - tests/appraisal-passives.test.ts
---

## Decided
- Survival now ties healing to other players. Rules live in src/game/appraisal/pulse.ts (PULSE_RULES, lifeDealTerms, merchantWary).
- Pulse shards: when another seat buys goods you appraised (completeAppraisedSale, buyerId passed from purchase and settleAuction), the appraiser gets 3 shards. Every 3 shards mend 1 life (mendWithShards, bank cap 5). Self-buys pay nothing.
- Wary rule: tradeLink {partner, since} is set in respond() for both seats. When the same single partner spans more than 3 encounters (encounter - since >= 3), a sale pays 1 shard and the appraiser gets the note "พ่อค้าเริ่มสงสัย". Trading with anyone new resets it to 3.
- Life deals follow NPC trust: 0 gives no deal; 1 gives 3 credits for 0-1 life; 2 gives 5 for 1-2; 3+ gives 7 for 2-3. The amount is rolled once per encounter with randomAt(seed, `${encounter}:${id}:recovery-roll`). Held gear adds to both ends. Energy merchants (ENERGY_DEAL_NPCS) are unchanged.

## Tried and ruled out
- Bot simulation cannot validate the shard loop: bots never sell goods to each other, so 0 shard sales happen. Their runs got shorter (median ~16 to ~8 encounters) purely from the trust gate.

## Watch out
- With 3 or more seats, alternating between two partners resets tradeLink every sale, so the wary rule never fires. A "new" partner may need a cooldown.
- Survival without commerce has no npcTrust, so it has no life deals at all.
- Tests that need a life deal must set p.npcTrust first.
