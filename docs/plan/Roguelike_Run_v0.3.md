# Cursed Market v0.3 — Roguelike Run

2026-10-13. User explicitly requested roguelike runs with RNG and different routes after identifying repeated decisions, predictable outcomes and weak differentiation from Dealer's Life. This is an experimental response, not validated enjoyment or a production roguelike claim.

## Playable slice

A run has **three markets**. The group secretly votes on one of **three seeded current branches**, trades once per player, then each player selects one of three personal boon offers before voting on the next market. There are two boon selections per run. Money, inventory, boons and inspections carry between markets, then reset for a new run. No player is eliminated; the highest final score wins as before.

2 players play 6 auctions, 3 players 9, 4 players 12. Each player sells exactly once in each market. The 2-player v0.1/v0.2 baseline remains 8 auctions when replaying those rules.

## RNG changes decisions

The current frontier samples three different profiles from six: cleansing temple, black market, haunted collector cemetery, collector auction hall, counterfeit alley and gambling fair. Profiles change authenticity/curse generation rates, genuine/fake values, curse penalties, demand bonus and the market's ante. Seeded weather shifts curse generation by −10, 0 or +10 percentage points, bounded to 5–95%; demand family also varies.

These are **generation probabilities for each candidate**, not the odds of the seller's selected lot. Sellers still know two candidates and choose one. Authenticity and curse remain independently generated within a selected market. Exact current values and the selection caveat are visible before voting and during bidding. Item value is score, not spendable money.

Future branches depend on both the secret seed and the chosen path. A new online run gets a fresh cryptographic server seed; that seed is revealed only at results. Identical seed and decisions reproduce a run for auditing. Randomness offers variation, not a mathematical guarantee that every future run is unique; finite profiles may repeat.

## Route decisions

- Every seat, including the upcoming seller, may cast one secret vote or abstain. A vote locks and cannot be changed.
- Majority selects the branch; tied branches use seeded selection independent of packet order.
- If all players abstain, select the lowest curse-generation probability, then lowest ante, then node ID. This is a timeout default, not a promise of the best or safest financial outcome.
- Route expiry adds abstentions only for undecided players. Accepted votes remain in force. No coins are spent by voting.

## Run-local builds

Each player's three random offers are private. Already owned boons are excluded. A player chooses one for free or skips; expiry skips only undecided seats. Acquired boons are public so opponents can adapt. No accounts or permanent unlocks are introduced.

| Boon | Effect |
| --- | --- |
| Curse eater | For later purchases, replace curse penalty with +2; every genuine relic loses 3 points. |
| Genuine collector | Later genuine purchases add 4 points. |
| Counterfeit collector | Later fake purchases add 6 points. |
| High roller | Wager cap increases from 3 to 5 coins; bid plus stake still cannot exceed the wallet. |
| Temporary lens | Add one inspection token immediately. |
| Specialist | A seeded family adds 5 points on later purchases, genuine or fake. |

Boons combine. Market/build value is fixed at acquisition; a later boon does not reprice old inventory. Reveal records the combined item value and its build contribution. Independent scores are rebuilt from settlement history. This lets the same relic have different value for different builds.

## Wagers, resources and audit

The v0.2 curse-wager settlement remains: prediction and price lock together; price 0 may still carry a wager; correct predictors split the pot proportionally; wrong bets lose their stake; nobody correct carries the pot. The chosen market contributes **1, 2 or 4 coins per auction**, from a finite reserve of 4 × total auctions. Unused reserve stays with the market; an unclaimed terminal pot returns to it. Market subsidy is not taken from players and does not automatically award the pot to the last seller.

Coins plus escrow, pot and remaining reserve stay conserved. Public wallet balances do not reveal sealed stakes. Server owns truth, private offers, validation and RNG. Route/boon choices use the same authenticated-seat, retry and reconnect guarantees as bids. Defaults never place a monetary wager for an undecided player. Reports validate the added phase order from replay events and record path and builds.

## Acceptance and retest

Technical acceptance: complete 2/3/4-player runs over real network connections, restore sealed route/boon/bid commitments, finish disconnected runs, reset builds for rematch, reject spoofing/foreign offers, conserve resources and replay v0.1/v0.2/v0.3 audits exactly.

Human acceptance remains open. Retest with the same group and voice condition. Save each audit before rematch. Ask whether a route or boon changed a player's bid/wager reasoning, whether any profile/build became an automatic pick, and whether low-bankroll players still had meaningful decisions. Collect individual fun scores and spontaneous continuation. The new auction loop still uses sealed bids; changing routes alone does not prove differentiation or replayability.

First slice omits full-map navigation, combat, elimination/permadeath, permanent progression, additional relic art and a content expansion. Those are not needed to test this requested run structure. The user requested no further browser/image checks; v0.3 visual and human-device verification remain open.
