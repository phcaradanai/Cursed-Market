# Secure economy verification — 2026-10-23

Implemented scope and deferred rules: [feature specification](../plan/Secure_Economy_v0.5.md).

## Automated verification

- Full `npm test`: 751 passed, zero failures. Localhost access was required for
  WebSocket integration tests. Log: `/tmp/cursed-market-secure-tests-final.log`.
- After the final custody-feedback and duel-action-lock fixes, server compilation
  and 55 focused tests passed, including theft, storage, price integrity, client
  rendering, integration and localization. Log:
  `/tmp/cursed-market-secure-last-focused.log`.
- Full `npm run build` passed. The shipping appraisal client was rebuilt after the
  final changes and passed. Vite retains its existing chunk-size advisory.
- `git diff --check` passed.

Coverage includes sealed hand privacy, ban escalation and reset, timer cleanup,
last-energy consequences, custody and money conservation, installment repayment,
deadline foreclosure, marked-price sale paths, empty loan terms, and restrictions
on taking other actions during an unresolved duel. Historical-mode fixtures remain
compatible; the latest server enables the new rules.

## Browser evidence

Actual client and WebSocket server were exercised using deterministic temporary
fixtures, at desktop and 390-pixel mobile widths:

- Merchant RPS failure charged one energy, displayed the trade suspension, and
  offered the criminal notice at twice the original storefront price.
- A collateral value of 40 produced a 20-credit request with a four-payout deadline.
  Empty optional agreement text was accepted; the request awaited lender approval.
- Personal vault controls appeared after collecting the phase reward. Item deposit,
  cash deposit, slot expansion and cash withdrawal completed successfully.
- Withdrawal feedback described a custody transfer rather than a monetary loss.
- No horizontal overflow or broken item images appeared in the exercised views.

Screenshots are local review evidence in
`.impeccable/review/secure-economy/`: `desktop-finance.png`, `mobile-finance.png`,
`mobile-finance-lower.png`, `desktop-vault.png`, `mobile-vault.png`, and
`mobile-vault-lower.png`. The lower-view captures close the initial evidence gap
around cancellation and vault controls. Browser evidence covers the request step;
bilateral loan funding, installments and foreclosure are covered by engine tests.

Independent visual finish review returned **Ship** after reviewing the recaptured
mobile controls alongside the original evidence. No material defects were found
in the changed surfaces. Keyboard and hover behavior were not independently
exercised; inherited mobile HUD crowding remains outside this extension.

## Limits and repository checks

Additional PvP theft penalties, notice pricing for multiple cases and vault
interest remain deferred. These checks establish technical behavior, not human
playtest enjoyment or final economy balance.

`trail check` reported 20 heuristic conflicts confined to preexisting modified
Impeccable design/cache metadata and its surface description. No secure-economy
implementation file was implicated. Those unrelated user changes were preserved.
The implementation learning records the newly authorized scope so older
planning-only notes are not mistaken for a current implementation restriction.
The final Trail scan was capped at the first 400 KB of the combined workspace
diff; it is not an exhaustive certification of unrelated concurrent changes.

## Update 2026-10-23: notices, PvP penalties, seals, interest

Implemented in `theft.ts`, `seals.ts`, `secure-storage.ts` and wired through the engine,
message parser, room lifecycle, views and `SinnerSeals.tsx`. Fresh runs this round:
`npm test` 789/789 and `npm run build` pass. New server tests live in
`tests/appraisal-secure-seals.test.ts` and the extended theft/client tests: four-instalment
compensation (5 each at N+1..N+4, none at N or N+5, snapshot immune to resale, short wallet,
vault untouched, idempotent), 4%/uncapped/floored interest, seal trade/redemption/buy-back,
forged and duplicate commands, offer expiry on advance. The seal and compensation UI was
verified by server-rendered markup tests only; the built app was loaded without console errors
but a live multi-seat seal flow was not exercised in a browser, and bots do not use seals.
`trail check` was not re-run for this round. Secure-economy rule version was not bumped, so
historical `secureEconomy` replays recorded before this change would now diverge.
