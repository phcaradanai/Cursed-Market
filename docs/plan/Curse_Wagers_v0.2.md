# Cursed Market v0.2 — Curse wagers experiment

Status: experimental response to negative human feedback. Enjoyment and balance are unproven. Original [GDD v0.1](Cursed_Market_GDD_v0.1.md) remains the baseline.

## Hypothesis

The first player report identifies repetitive decisions and an unexciting loop. A shared pot that can grow, secret predictions and limited inspection should give buyers a reason to care about an offered relic even when they pass the auction. Combining inspection and bidding removes the inspection barrier between buyers.

## Rules

- Original item values, starting money, inspections, seller rotation, guarantees and sealed auction remain.
- Market contributes 2 in-game coins at the start of every auction. A match has a finite reserve of 2 × auction count, separate from player money.
- Each buyer may optionally stake 1–3 coins on **cursed** or **uncursed**. Seller cannot wager because seller knows both candidates' truth.
- Wager and bid lock together. Price 0 passes the purchase and can still carry a wager. Passing both submits 0 with no wager.
- Bid plus stake must fit the buyer's current wallet. Future winnings cannot finance the current bid.
- Each buyer may inspect one attribute, then bid immediately without waiting for other inspections. Locking closes that buyer's inspection choice. Inspection is optional.
- Bid, wager, prediction and inspection stay private until reveal. Public wallets and the pot do not change while choices are locking.
- Reveal settles wagers whether the relic sells or not. Add all stakes to the pot. Correct predictors divide it in proportion to their winning stakes. Payout includes the invested stake; net change is payout minus stake. Incorrect predictors lose their stake.
- Integer payouts use largest fractional remainders; seeded seat order breaks equal remainders. Packet order never decides a payout.
- If no predictor is correct, retain the entire pot for the next auction, which adds another 2 coins. If nobody wagers, the pot also carries.
- At match end an unclaimed pot returns to the market, without awarding it to the last seller. Players remain in the match even with no coins.
- Expiry passes both auction and wager for buyers who have not locked a decision. Locked bids and wagers remain in force; expiry never spends money on an undecided player's behalf. Phase deadline does not restart after inspection.

Example: current pot 2; correct stakes 1 and 2; incorrect stake 3. Total pot 8. Correct predictors receive 3 and 5 coins including their own stakes; their net changes are +2 and +3. Incorrect predictor loses 3.

## Boundaries and acceptance

One small experiment: curse wagers plus a consolidated buyer phase. No extra relic types, abilities, progression, real-money payments or new visual identity. Controls explain risk, pot carry, private findings and net settlement.

Technical acceptance: complete real network matches with 2/3/4 seats; simultaneous purchase/wager, pass-and-wager, zero wallet and timeouts; keep sealed choices secret including wallet side channels; retry and reconnect retain one commitment; coins plus escrow, reserve and pot remain conserved; current and v0.1 audit files replay and summarize correctly.

Human acceptance remains open: varied reasons for bets and bids, attention to reveals, fewer boring repeated choices, perceived agency and voluntary continuation. Two scarce curse inspections can produce informed wagers; measure whether hoarding them or always wagering on one prediction becomes routine. Pot incentives may overshadow buying. Do not infer strategy dominance from synthetic fixtures.

## Retest

Use the same group and voice condition first. Explain only changed rules, then play freely. Save each match audit before rematch. Record actual choices and the reason a player changed or repeated one. Collect fun 1–5 and boring/confusing moments privately. Observe requests to continue before inviting a second match. This bundled first test cannot attribute improvement separately to wagers or phase consolidation.
