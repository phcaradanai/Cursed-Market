# Merchant abilities validation — 2026-10-23

Implementation rules: [Merchant_Abilities_v0.5.md](../../plan/Merchant_Abilities_v0.5.md).

## Automated proof

- `npm test`: **705 passed, zero failed**, including 22 merchant-ability tests, real WebSocket room tests, economy invariants and deterministic audit replay. The final run includes the scanner stale-ownership regression and copied tool-strength fixes.
- `npm run build`: server, original client and current appraisal client passed. Vite reports the existing large-chunk advisory; no compilation failure.
- `git diff --check`: passed.
- The new-run catalog contains **66 distinct mechanical profiles**, ignoring names, prices and artwork. Three previously identical activation pairs now have different decisions and behavioral tests.
- Three new product JPEGs have different SHA-256 hashes and embedded exact generation prompts. Paths and hashes are in [prompts.json](../../art/merchant-abilities-v0.5/prompts.json).

## Browser proof

The local-only fixture runs the real room service, HTTP client and WebSocket actions with synthetic inventories and trust. It is never imported by production. Actual browser actions created a Swarm copy of the gambler hat, checked its source label and 40% effect / 50% value disclosure, then used a Rewinding Gear. Inventory dropped from six to five, the gear disappeared, and Swarm's remaining wait changed from five to four encounters. Its shared encounter-use block remained active. Reload preserved the authoritative room state.

Desktop evidence is 1440px wide; mobile evidence is 390px. The mobile correction restores a stacked appraisal table and contains the end action. DOM checks after correction: `clientWidth === scrollWidth === innerWidth === 390`, one 366px appraisal column, and zero unloaded product images. The masthead ends at 44px and resources start at 62px, avoiding overlap. The final CSS-only `npm run build:appraisal` passed after this correction.

- [Desktop merchant panel](merchant-abilities-desktop.png)
- [Desktop copy detail](merchant-copy-desktop.png)
- [Mobile merchant panel](merchant-abilities-mobile.png)
- [Mobile copy detail](merchant-copy-mobile.png)

## Review and known limits

The code review's material copy-payout, swap, event, tool-strength, cooldown and ownership findings were corrected before the 705-test run. [Design review](design-review.md) records the independent visual review: final disposition **ship**, specifically scoring F1 (mobile appraisal layout) and F2 (HUD/control overlap) resolved. This is a correction-list verdict, not a new full-surface audit.

The design detector was run once on changed UI targets. Its three non-advisory warnings concern pre-existing Cormorant declarations at stylesheet lines 3, 43 and 252. Its remaining findings are advisory drift against the incumbent design documentation; the new merchant styles reuse existing colors and components. Existing design files and unrelated work are preserved.

This is an initial playable balance baseline. Automated invariants and replay do not establish human balance or equal merchant pick rates; that needs playtesting.

## Trail conflict disposition for review

`trail build` completed. `trail check` exited 1 with 20 keyword conflicts; it is **not recorded as a passing gate**. Fourteen refer to the already-dirty design sidecar/hook cache rather than executable changes. The six source hits are these semantic false positives:

- The App rules paragraph mentions one *merchant ability* per encounter. The separate free merchant inspection/appraisal remains **one per physical shop item**, covered by the existing free-action suite. Trust 1 unlocks each merchant's skill independently; the separate pooled-trust stock reward remains intact. Cooldown waits are encounter counters, not a bot wait action.
- Rendering the merchant panel does not isolate the feature: three items, three statuses and three events adjust its cooldowns or choices through shared domain rules.
- HeldEffects retains per-kind aggregation and adds a copy-strength annotation. Distinct luck kinds still add. Source-limited copies, 40% effects and the existing strongest-five held cap prevent unrestricted full-strength accumulation.

No standing learning was edited or overridden. The implementation learning records these distinctions for the next session. The delivery commit carries this disposition in its message; no PR was created.
