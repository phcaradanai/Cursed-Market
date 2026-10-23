# Theft, personal vaults and secured player loans

Implemented scope from the 2026-10-23 design discussion. The latest server enables
`secureEconomy`; historical audits without that field retain their original rules.

## Theft

- Merchant and player-item theft use sealed rock, paper, scissors. NPC hands are
  fixed before the player's choice; each merchant has a readable hand tendency.
- Preserve the existing one-attempt-per-encounter and one-energy cost. Draws replay
  within the same attempt without further energy. Participants finish their duel
  before taking other actions; a target resolving an ability choice is ineligible.
  The server's timer cancels unfinished duels safely.
- Player targets reveal no concealed item or opposing hand before resolution.
  Stored, escrowed and locked goods cannot be stolen.
- Merchant failure removes two trust from that merchant, clamped at zero, and
  adds one future encounter of trade suspension across all merchants. Theft can
  still be attempted during a suspension. Paid merchant services are suspended too.
- A single criminal notice costs twice the attempted good's original storefront
  ask. It immediately clears the suspension and criminal record, without restoring
  trust. This service remains available when the ordinary Dark Market is closed.

## Personal vault

- Item and credit storage opens during REVEAL after the owner's reward is settled.
  Confirmation to advance closes further actions for that seat.
- Two item slots are free. Additional slots cost 10, 15, 20, 25 credits and so on.
- Stored goods leave carried inventory: no held effects, activation or theft.
  Existing effects and payouts already resolved are not undone.
- Credits move through explicit vault ledger accounts; storage creates no money.
  Stored assets remain owned and count toward wealth and Collector settlement.

## Secured player loans

- Borrower proposes an unlocked carried good with a positive last completed cash
  transaction value. Marked overpriced goods cannot secure a new loan.
- Minimum principal is half that value, rounded up. Lender may counter with a
  higher amount. The other party must accept the final terms before funding.
- Funding transfers actual lender credits and moves the good into neutral escrow.
  The item cannot be used, stolen or pledged again while held as collateral.
- Deadline uses the collateral value, independent of principal. Starting with the
  next unreceived base payout, sum alternating 10/15 until reaching that value.
  Value 40 starting at 10 takes four payouts; starting at 15 takes three.
- Value and deadline freeze when funded. Bonuses, wagers and later appraisals
  cannot alter them. Installments are permitted; full repayment returns the good.
- At the deadline, receive the phase payout and allow repayment before advancing.
  An unpaid collateral item then transfers to the lender. Death alone does not
  accelerate the deadline. Pending contracts remain visible to their participants.
- Free-text terms are recorded and escaped for display; they do not execute game
  actions or add an unstated interest obligation.

## Price integrity

- Prices are checked against the immutable base of that specific item. At 150%,
  200% and 250% of base, trial audit chances are 25%, 50% and 100% respectively.
- An overpriced mark follows the item. System cash sale proceeds are zero until
  a successful owner reappraisal. Buyers see the warning before agreeing to trade.
- Owner reappraisal costs one energy, once per item per encounter, and succeeds
  within 10% of base. It never changes base or erases transaction history.
- Published market contracts and intentional bonuses remain independent of player
  transaction prices. Emergency liquidation is capped by immutable/certified value
  as well as transaction history, so a friend's inflated purchase cannot raise it.
- Exact liquidation previews require already known or certified value; otherwise
  the player can explicitly sell at an unknown system valuation.

## Explicitly deferred

Additional penalties for losing a player theft, notice pricing for multiple cases,
vault interest rates and interest accrual remain disabled pending further design.
No hot-item rule or additional theft fee was introduced.
