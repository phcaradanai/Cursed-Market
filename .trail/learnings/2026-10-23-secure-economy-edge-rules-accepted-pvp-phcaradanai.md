---
title: "Secure economy edge rules accepted: PvP compensation, sinner seals, vault interest"
author: Phcaradanai
date: 2026-10-23
branch: main
cost: { minutes: 22, tokens: 255019 }
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - docs/plan/Secure_Economy_v0.5.md
  - docs/validation/Secure_Economy_v0.5.md
  - src/appraisal-client/App.tsx
  - src/appraisal-client/SecureEconomy.tsx
  - src/game/appraisal/engine.ts
  - src/game/appraisal/secure-storage.ts
  - src/game/appraisal/theft.ts
  - src/game/appraisal/types.ts
---

## Decided
On 2026-10-23 the user accepted all assistant-recommended edge rules: compensation uses a snapshot of the item's lastTradePrice at defeat, 5% floored, charged at the start of each of the next 4 encounters from the wallet only; a short wallet pays what it has and the rest is forgiven (no debt). A thief buying back their own seal destroys it. Seal redemption deals up to 3 face-down carried goods; with none available the seals are kept. Vault interest is 4% of the whole balance, uncapped, floored, paid into the wallet at the start of the next encounter, no auto-compounding. Implemented in theft.ts, seals.ts, secure-storage.ts; criminal notice now clears all cases for 2x summed captured asks.
## Tried and ruled out
Holder naming the buyer's goods by item ID: other players' inventories are hidden, so the offer asks for a goods count and the buyer picks on acceptance. Trusting test setup that mutates credits directly: the ledger invariant rejects it, so tests move credits through the bank.
## Watch out
Not user-stated, chosen conservatively: no trade price means no compensation; instalments are skipped (not deferred) if either side is dead; life/energy seal payments reject rather than kill the payer or overflow the receiver; seized goods keep the stolen flag. Fixtures must set encounters (default 3 ends before instalments finish) and secureEconomy:true or advance skips the new collection. Secure-economy rule version was not bumped.
