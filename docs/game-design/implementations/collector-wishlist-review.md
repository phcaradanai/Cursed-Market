# Collector v1 — independent initial review and owner fix pass

Scope: frozen `10629f2..7ab2a39`, approved specification/receipt in `../collector-wishlist-approval.json`. Whole-game acceptance is separate. The first reviewer (gpt-6-astra) confirmed the market-pool defect, then stopped at an external usage limit before a verdict. Replacement gpt-6.1-terra completed the **same initial review**, not a second opinion or a review of the owner's changes.

## Independent findings

- Critical: none found.
- Important: `engine.ts` built public market kinds from all stored items, including private/unbought/removed Collector rows. A free request and skip could steer next-period demand. Root owns the fix.
- Minor, deferred: an entry event makes `request.available` false and hides the Collector launch if there is no pending request or delivery. The request catalog cannot be read until the event is resolved. Existing six utility menus remain accessible; server guards correctly reject commands. Track `UI-COLLECTOR-CONTEXT`; do not call this context-reading gap resolved.

Reviewer strengths: private batch DTOs, latest server quote checked before payment, unbought escrow closed without ownership, tests for timing/duplicate/cross-seat/reconnect/cancellation/replay.

Original verdict: **With fixes**. The reviewer did not run tests or review the uncommitted fix.

## Owner fix, not independently re-reviewed

Actual command comparison at `review-market-12`, catalog3, request2/delivery4/skip then encounter5 produced different public demand/reserve than no request. RED reproduced in `collector-wishlist.test.ts`. Auditing all global item-store readers found the same source leak in Spirit quote prototypes and card/slot pools; a named available-ghost fixture produced a second meaningful RED.

One shared `publicOfferItems` query now excludes Collector origin IDs and their copies only under `collectorWishlistRules:1`. Market and Spirit consumers use it. Skipped, expired, purchased or copied Collector goods do not become evidence for public offer generation; ordinary copies remain eligible. Ownership changes cannot bypass the filter. No new item metadata, phase, score or numeric effect rule was added. Historical no-flag runs use the original pool.

Verification is recorded in `../collector-offer-isolation-verification.json`; the raw RED logs remain evidence of the original failures. The reviewed branch's historical receipts stay historical, not assertions about a later engine.

## Rulings on declined areas

1. The uncommitted fix was outside the frozen initial review. Owner verifies it with failure-first market/Spirit regressions, copy provenance boundaries and the scoped suite, without claiming a second independent review. Risk: normal author blind spots remain after a tested fix.
2. Whole-game completeness/balance was outside Collector scope. The overall goal stays active; remaining48, strategic paths, statistics/rarity awards, broader end-to-end play and balance remain open. Risk of premature completion is controlled by the central status/roadmap, not by declaring this subsystem the game.
3. Live-browser paid purchase was not established: the normal-budget QA window expired before the click. Mounted exact-command checks and actual socket payment/replay remain separate evidence. Keep the live-browser full-flow gap in PLAY-01; do not turn it into a success claim. Risk: a UI/transport edge may still need that end-to-end pass.

Deferred minor: `UI-COLLECTOR-CONTEXT`, above. It is not silently waived or fixed in this review pass.

## Post-fix result

235 scoped regressions and7 actual socket cases pass;24 historical no-flag and2 prior Collector fixture audits still replay exactly. The three offer-source/provenance regressions pass. Normal UI source and stored public preview inputs remain byte-identical. The earlier live-browser gap is now closed **for the declared500-credit/20-life fixture**: real App request, funded peek, explicit payment, owned item, RESULTS and strict replay passed twice; final run also records per-capture viewport/DPR/PNG dimensions. Ordinary phases were prepared through authenticated public commands, not hidden state writes. Normal40-credit/6-life full-game balance is still outside this evidence.

## Implementation rulings retained for continuity

- Existing isolated codex branch used rather than another worktree; exact staging preserves unrelated edits.
- Rules1 stayed opt-in through protocol/UI work, then enabled only for Comic main new rooms; historical explicit no-flag configurations unchanged. Experimental release-balance risk remains.
- Manual credit withdrawal is allowed during an open Collector window as approved, other vault operations remain salary-only; earlier access applies only to this versioned window.
- Server quoteId binds latest bill/energy before payment; changed terms require confirmation again.
- Historical cabinet test wording updated only after reproducing the same failure against10629f2; actual approved Status button behavior retained.
- Replacement reviewer completed the same initial review after external quota failure; no independent review of owner fix claimed.

Final33 Collector engine/protocol/UI cases and10 UI contracts pass; source393/Atlas189 guards pass. No additional UI redesign or baseline promotion. Ledger archived here; whole-game work remains active.

Trail check: existing20 conflicts are confined to unrelated .impeccable/design.json/hook.cache.json, excluded from this commit. Diff exceeds400KB checker cap, so Trail is not full-branch review evidence. New learning records this fix; manual source review and targeted tests supply the actual fix evidence.
