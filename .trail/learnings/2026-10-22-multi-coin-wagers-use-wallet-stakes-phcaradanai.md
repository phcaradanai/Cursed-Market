---
title: "Multi-coin wagers use wallet stakes of 10 or 15, with symmetric per-coin results"
author: Phcaradanai
date: 2026-10-22
branch: main
cost: { minutes: 29, tokens: 268453 }
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - src/appraisal-client/App.tsx
  - src/appraisal-client/RoundReward.tsx
  - src/appraisal-client/catalog-text.ts
  - src/appraisal-client/en/ui.ts
  - src/appraisal-client/i18n-content.ts
  - src/appraisal-client/styles.css
  - src/game/appraisal/engine.ts
  - src/game/appraisal/round-rewards.ts
---

## Decided
- User's latest clarification (2026-10-22) is authoritative: adding one coin costs 10 wallet credits in odd encounters or 15 in even encounters. Five credits is the baseline gain/loss per coin, not the cost to add a coin. Without betting, collect the normal 10/15 round reward.
- New rounds start with one coin. Added wallet stakes join the pending cash-out pool. All coin predictions must be correct to gain (5 + snapshotted passive coin bonus) times coin count; any wrong call subtracts the same step, floored at zero. Continue until zero or voluntarily collect. Timeout/ready collects any remaining pool.
- config.multiCoinRewards defaults true for new games. Exact restored configs without the flag retain single-coin lose-all behavior for historical audit replay. Wallet-to-@round-fund round-stake ledger entries track real top-ups; the economy invariant counts fund outflows net of stake inflows.

## Tried and ruled out
- Do not price an added coin at 5 credits; the user explicitly corrected that interpretation. Do not use current winnings as the addition price: the encounter base remains 10/15.
- Do not modify historical item data just to change lucky-die descriptions; update the client catalog text instead so published audits still replay exactly.

## Watch out
- round-raise includes target coinCount and next attempt to reject stale commands; duplicate request IDs replay without another debit. Every added coin has an independent deterministic stream. Validate one prediction per coin on the server.
- An owned noble seal may add income when a network test buys random stock. Assert base 10/15 separately from incomeBonus when checking cash-outs.
- Preserve the game-like phase UI and translate every new t() string into English. Each coin needs its own prediction and result.
