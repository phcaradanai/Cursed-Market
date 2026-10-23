---
title: RPS theft penalties collateral deadline and expandable personal vault
author: Phcaradanai
date: 2026-10-22
branch: main
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - ".gemini/settings.json"
  - AGENTS.md
  - GEMINI.md
  - docs/art/concepts/3d-dark-fantasy-2026-10-21/01-entry.png
  - docs/art/concepts/3d-dark-fantasy-2026-10-21/02-lobby.png
  - docs/art/concepts/3d-dark-fantasy-2026-10-21/03-portals.png
  - docs/art/concepts/3d-dark-fantasy-2026-10-21/04-inspection.png
  - docs/art/concepts/3d-dark-fantasy-2026-10-21/05-appraisal.png
---

## Decided
On October 23, 2026 (Asia/Bangkok), the user replaced percentage-based theft resolution with Rock Paper Scissors. Theft can target merchants and players. Failed merchant theft reduces trust with the targeted merchant by 2 and bars trade with all merchants during the next phase. Further failures add one phase to the penalty until the player purchases a criminal notice from Dark Market. Purchasing it resets the escalating penalty and immediately cancels any active trade ban. Its price is twice the attempted item's storefront price. The user allows selling owned items to finance the notice, using each item's latest completed transaction price.

The user added player-to-player loans secured by items. The minimum loan is half the collateral item's latest transaction price; lenders can offer more by agreement. Repayment can be made in installments, with collateral returned only after full repayment. The user explicitly clarified that the deadline threshold is the collateral item's latest transaction price, not twice the initial loan. Sum the phase-end base awards (10/15) until they meet or exceed that threshold. For collateral valued at 40, a sequence starting at 10 reaches 50 after four payouts; a sequence starting at 15 reaches 40 after three payouts. If the debt remains unpaid at the deadline, ownership transfers to the lender.

Personal vault starts with two free item slots. Additional slots cost 10, 15, 20, 25 credits, increasing by 5 each time. Credits may also be deposited and earn interest. Earlier confirmed personal-vault rules remain: deposits occur after phase-end payouts; stored items cannot be stolen or used and provide no effects to their owner.

## Tried and ruled out
Percentage-only theft resolution and a deadline based on twice the borrowed principal are superseded by the user's explicit choices. Earlier assistant suggestions about success probabilities, two-energy cost, theft frequency, PvP penalties, hot-item restrictions, and vault-only withdrawal timing were brainstorming, not approved rules.

## Watch out
Still unresolved: RPS draws and timeouts; NPC hand selection; failed PvP theft penalties; criminal-notice pricing after multiple theft attempts; whether buying the notice restores trust (do not assume it does); repayment agreement enforcement, collateral effects and custody, and the interest rate and accrual rules. Current Dark Market can close, so always-available criminal-notice redemption is an assistant recommendation, not implemented or approved. Latest player-to-player transaction prices can be inflated through collusion if automatic system buyback or loan valuation trusts them. No game implementation was requested during this design discussion.
