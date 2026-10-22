# Multi-coin round wagers — 2026-10-22

## Rules delivered

- A player may collect the normal 10-credit odd / 15-credit even encounter reward without playing. Existing held-item income still applies.
- The initial pending pool has one coin. Each added coin costs the encounter base, 10 or 15, from wallet credits and adds that stake to the pending pool. Pending winnings cannot fund a raise.
- Predict heads or tails separately for every coin. All predictions must match to win. Any wrong prediction loses the full per-flip step, rather than a separate penalty for each wrong coin.
- The step is coin count times the snapshotted per-coin reward (baseline 5, plus held-item modifiers). Gains and losses use the same step. Losses stop at zero.
- Continue after a loss while the pool remains positive; collect after any flip. Ready/timeout collects any remaining pool once. Zero ends the wager.
- Example in an even encounter: wallet 30, pending reward 15. Add one coin: wallet 15, pool 30, two coins. A complete correct call makes the pool 40; any wrong call makes it 20. The next flip still uses two coins and a 10-credit step.

## Proof

- Full suite: 660 tests passed, zero failures.
- Full production build passed for server, legacy client, and appraisal client. After the final explanatory-copy adjustment, the affected checks and appraisal bundle were rebuilt.
- Focused coverage includes wallet affordability, odd/even raise prices, mixed correct/incorrect calls, three-coin payouts, zero-floor losses, stale/repeated commands, independent deterministic coin streams, reconnect, ready/timeout cash-out, and exact historical audit replay.
- Browser exercise: added a coin (wallet 40 → 30, pending pool 10 → 20), selected heads/tails separately, won 10, then lost 10 while keeping the wager open. Confirmed responsive rendering at desktop 1440×1100 and mobile 390×844, no horizontal overflow, and mobile prediction/raise targets at least 44 CSS pixels high after the game's scaling.
- [Desktop capture](desktop.png), [mobile capture](mobile.png). Captures precede a final clarification that the odds and held-item gain/loss shown in the expanded instructions are per coin.
- New coin-staking CSS had no detector findings. The design detector also reported existing typography/palette issues in unchanged CSS, which remain outside this change.
- `git diff --check` passed; the Trail graph was rebuilt.

## Replay and review notes

`multiCoinRewards` is enabled for new games. Exact saved configurations without the flag retain their original one-coin, lose-all rules. Historical item specifications stay intact; the lucky-die description is updated in client presentation only. Stake debits and cash-outs are tracked through the round-fund ledger.

`trail check` returned lexical warnings, not demonstrated rule conflicts. Its flags include the pre-existing modified `.impeccable` files, shared words such as “coin credit” in this change and its new learning, and the existing `freeBuy` default on a line where only `multiCoinRewards` was added. The 15→30 test changes describe a funded two-coin wager after a win; the untouched no-wager base remains 10/15. The new catalog presentation deliberately avoids editing historical item data, as the learning requires. No existing learning was edited. The new learning records the user's final clarification and the compatibility decision.
