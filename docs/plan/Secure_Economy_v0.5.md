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

## Rules update 2026-10-23 (supersedes the deferred list below)

Confirmed by the user and implemented; see `docs/handoff/Secure_Economy_Continuation_2026-10-23.md`.

- **Criminal notice:** `2 × sum(storefront ask captured when each case occurred)`. One
  payment clears every case and the merchant trade ban at once, with no trust refund.
  It does not clear PvP seals, cooldowns or compensation.
- **PvP defeat:** the victim receives one sinner seal naming the thief; the thief cannot
  target that victim for the next two encounters (lost in N: blocked N+1, N+2; free N+3);
  other victims are unaffected. Draws, cancellations and wins create none of this.
- **Compensation:** 5% of the item's last trade price, snapshotted at defeat, floored,
  charged at the start of each of the next four encounters (not per phase). The wallet
  only: vault credits are never touched. A short wallet pays what it has and the rest of
  that instalment is forgiven, never a debt.
- **Seals:** any holder of two unlocked seals of the same thief may redeem them. The
  server deals up to three face-down carried goods of the thief (vault, collateral, locked
  and open-trade goods excluded); the holder picks a card slot and receives that good, and
  both seals are spent. If nothing can be dealt, the seals are kept. A card whose good has
  since moved shows as empty without spending the seals. Seized goods keep the stolen flag.
- **Seal trade:** the holder offers one seal to another living player for credits, energy,
  life, a number of goods (the buyer chooses which carried goods), plus inert text terms.
  Acceptance moves everything atomically. A thief who buys back their own seal destroys it.
  Offers and unfinished redemptions last one encounter; seals never expire.
- **Vault interest:** 4% of the whole vault balance per encounter, floored, uncapped,
  paid from the bank into the wallet as an encounter begins; it never compounds by itself.
  A bank unable to cover a payment pays what it safely can.
- **Start-of-encounter order:** compensation, then vault interest, then the existing
  per-player entry effects, so both are counted in the encounter's starting wealth.

### Conservative choices not stated by the user (revisit if wrong)

- No recorded last trade price (merchant stock, event or free goods) means no compensation.
- Instalments are skipped, not deferred, when the thief or victim is dead at that start.
- Seal trade life/energy: the payer must keep at least 1 life, and the receiver may not exceed
  the maximum (the trade is rejected rather than discarding value). Life trades need survival.
- Compensation shows the thief the per-instalment amount, which reveals the last trade price of
  the item they failed to take.

## Explicitly deferred

Superseded by the rules update above. No hot-item rule or additional theft fee was introduced.
