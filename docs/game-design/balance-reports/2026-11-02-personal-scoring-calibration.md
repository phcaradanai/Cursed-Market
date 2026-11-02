# Personal scoring — offline calibration 2026-11-02

Proposal only; no runtime/scoring/UI/default change. Five original audits reconstructed exactly,14players. Inputs are selected trader normal40/6 runs and one cooperative service journey, not statistical balance.

| Audit/player | Current score | Raw sold qty | Raw sale credits | Eligible qty | Eligible credits | Trust positive command-delta lower bound | Qty illustration | Credit illustration | Unfiltered trust illustration |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| c3-2-trader.audit / seat0 | 161 | 7 | 66 | 6 | 65 | 5 | 30 | 6 | 15 |
| c3-2-trader.audit / seat1 | 139 | 7 | 75 | 6 | 74 | 4 | 30 | 7 | 12 |
| c4-2-trader.audit / seat0 | 20 | 10 | 182 | 9 | 181 | 7 | 45 | 18 | 21 |
| c4-2-trader.audit / seat1 | 284 | 15 | 267 | 13 | 248 | 16 | 65 | 24 | 48 |
| c3-4-trader.audit / seat0 | 7 | 10 | 78 | 8 | 70 | 1 | 40 | 7 | 3 |
| c3-4-trader.audit / seat1 | 21 | 18 | 148 | 14 | 138 | 4 | 70 | 13 | 12 |
| c3-4-trader.audit / seat2 | 28 | 9 | 78 | 8 | 70 | 3 | 40 | 7 | 9 |
| c3-4-trader.audit / seat3 | 149 | 12 | 110 | 10 | 103 | 7 | 50 | 10 | 21 |
| c4-4-trader.audit / seat0 | 68 | 17 | 276 | 15 | 245 | 8 | 75 | 24 | 24 |
| c4-4-trader.audit / seat1 | 32 | 11 | 126 | 10 | 123 | 6 | 50 | 12 | 18 |
| c4-4-trader.audit / seat2 | 234 | 25 | 431 | 21 | 381 | 10 | 75 | 38 | 30 |
| c4-4-trader.audit / seat3 | 103 | 17 | 252 | 16 | 249 | 7 | 75 | 24 | 21 |
| journey.audit / spirit | 92 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| journey.audit / buyer | 357 | 6 | 157 | 5 | 126 | 12 | 25 | 12 | 36 |

Quantity illustration uses5/item cap75; volume floor(credits/10)cap100; unfiltered trust3/delta cap120. Trust delta is NOT complete cumulative gross gains and has NOT applied proposed origin/merchant eligibility. Therefore the three point illustrations are NOT a lower bound on eligible points, NOT new final scores, and must not be reused as runtime statistics. Other metrics/modifier not computed.

Repeated original/copy sales remain in raw observed counts; eligible sale figures are filtered for this proposal only. No claim that all source-channel/anti-collusion rules are implemented. Full NPC stock sale volume is counted for appraisers only when another player buys; self purchases are excluded from sales. Original asset scores still include existing ghost/modifier rules.

Observations: active traders have sales/trust-only unfiltered illustrations49–143 vs current asset totals7–357. This can change rankings and demonstrates why caps and a broad balance run are required before release; it does not approve proposed weights or imply these are complete new totals.

Reproduce after Comic server build: node docs/game-design/scripts/calibrate-personal-scoring.mjs /tmp/new-personal-calibration.json. Original audits, proposal/source hashes and exact limitations are in the JSON.
