# Curse wagers v0.2 — validation

2026-10-13. Scope: experimental response to the user's negative human feedback. No positive gameplay validation is claimed.

## Automated proof

- `npm test`: 57/57 pass. Includes original engine/room/network/audit-report coverage plus 12 wager tests.
- 750 synthetic 2/3/4-player matches in the wager test verify nonnegative balances, conservation across wallets/escrow/pot/market reserve, independent score ledger and exact seeded event replay.
- Focused cases cover pass-and-wager, unsold settlement, all-wrong carry plus next ante, proportional rounding, packet-order invariance, combined purchase/stake budget, secret wallet side channels, duplicate/conflicting requests, seller exclusion, nested payload spoofing and terminal unclaimed funds.
- Real HTTP/WebSocket 2/3/4-player matches include wagers, replay exported audits and summarize the consolidated three-phase flow. Reconnect restores the sealed wager. Timeout defaults contain no wager.
- Client TypeScript and Vite build pass.
- Two existing v0.1 browser audit exports replay and summarize as v0.1, without claiming human participation or fun.

## Browser proof

First browser pass completed a 3-tab, 9-auction LAN match. UI blocks bid-plus-stake overspending, permits wagering with price 0, and restores the identical locked bid/wager after reload. Buyer, reveal and results were captured at 1440px and 390px. Export replay/report verified 14 wagers, 41 coins staked, pot peak 18 and scores 17/54/9. Two first-round bids timed out while QA setup waited; these are recorded as defaults, not decisions. This is synthetic browser QA, not human evidence.

The first mobile inspection found an unbroken long winner name in the reveal heading. Its wrap rule was corrected and confirmed in the second capture pass. This fixes a tested auction-result defect without changing the visual identity.

One scripted seat held all 54 remaining player coins, with two seats at zero. This does not prove strategy dominance, but makes bankroll concentration and late-round agency specific retest risks.

## Live test and remaining gate

The experimental server uses port 3101; the existing port-3100 process is retained for old room/audit access. Both use in-memory rooms. Download results before rematch or server restart.

Retest with actual players using the same voice condition. Record reasons for changed/repeated decisions, attention during reveals, fun scores, confusion and voluntary continuation. Investigate whether informed wagers, one prediction or pot farming becomes routine, and whether wagering replaces buying. The wager and phase changes are bundled, so a positive retest alone cannot separate their causal effects.

Second browser pass: another scheduled synthetic 3-tab/9-auction match, 18 wagers, 54 coins staked, largest pot 16, no default bids, independent audit scores 28/19/17. Buyer/reveal/results screenshots at both widths were opened and validated. Long winner names now wrap. Browser inspection ended after this second pass.

## Independent UI review

The finish reviewer opened all six final buyer/reveal/results captures at 1440px and 390px and compared the extension with the product, design and surface briefs. Its sole material finding was misleading timeout copy that appeared to cancel locked decisions. The text now explicitly limits automatic passing to buyers who have not locked a decision. Client TypeScript and Vite build pass after that correction.

The user explicitly requested stopping visual inspection and using the previous results. No post-correction recapture was made. The reviewer returned `ship`, limited to source verification that this one finding was resolved. Previous captures remain evidence for the unchanged layout; this verdict is not fresh visual approval or evidence of human enjoyment.

The earlier Georgia font finding was fixed by inheriting the documented font stack. No suppression was added. Existing font-size advisories remain outside this experiment's scope.

The independent documenter compared source and compiled client styles/copy against PRODUCT.md, DESIGN.md, the design sidecar and marketplace brief. The extension reuses the incumbent palette, Thai font stack, spacing, responsive breakpoint and component treatment. No documentation mismatch or approved system change required edits; DESIGN.md and the sidecar were preserved.
