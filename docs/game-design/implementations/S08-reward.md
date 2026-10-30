# S08 — รับเครดิตท้ายช่วงและเสี่ยงเหรียญ

2026-10-30 · User authorized implementation of salary-v01. Active source: `apps/comic`.

## Implemented boundary

- Pending reward uses shared `ComicPhaseFrame`, `ComicMenu` header rules, inventory frame tokens, `ComicButton`, existing `Peek` and `CompactPager`. Equal columns, identical48px cash-out/prediction action rows and symmetric spacing; modest existing CSS coin with perspective, no generated production art.
- Direct single-coin heads/tails and cash-out retain existing commands. Multiple coins show two predictions per compact page; choices persist across pages and toss sends all predictions, original attempt number and coin count. No scrolling or expanding methods dropdown in S08.
- Six utility menus remain available during REVEAL. New bag/status access is read-only; opening/closing a menu does not settle a reward, reset time or change the pool.
- Duplicate pending result/ready panel is omitted while the player decides/tosses. Cash-out remains `round-bank`, not a combined continue command. After settled/zero and animation completion, existing S09 services and readiness return. S09 and final results have not been redesigned here.
- Wages10/15, wallet stakes, passive odds/bonuses, partial losses, legacy lose-all mode, server validations and auto-cashout remain unchanged. No game/shared/server files changed.

## Preview and actual-game evidence

`?preview=reveal`, `?preview=reward-multi`, `?preview=reward-settled` expose initial, five-coin and settled fixtures. These are real components with example data; transaction buttons retain existing example-only feedback. They do not prove multiplayer payment or animate a fabricated result.

Current screenshots and measured frame/action evidence are registered in current-captures.json and ../ui-system/s08-verification.json. Concept PNG remains an approved design reference, never a runtime screenshot or automatic pixel baseline.

## Verification scope

- Comic server/client production build;83 focused reward/client tests, including new single-cashout/ready transition and nine-coin bounded-page regressions. Existing ledger/unknown facts and transaction assertions preserved.
-10 shared UI contract tests. Existing14 approved images compared without rebaselining; see ../ui-system/s08-baseline-compare.json and matching invocation receipt.
- S08 narrow/mid/wide comparisons use actual inventory geometry, equal columns/heading/action y and heights, no page scrolling; real fixture menu toggles and cross-page prediction persistence.
- Broader i18n file has4 existing failures, reproduced in the prior committed4548562 Git-export tree:28 missing keys elsewhere, old untranslated content, Rules-copy expectation and old disabled pager hints. Not counted as passing or silently changed; see ../ui-system/s08-functional-verification.json.
- First screenshot attempt timed out after4 geometry cases; screenshot-only bounded retries were used. An HMR change during another run detached the page context after4 cases; that incomplete run is not accepted as the final six-case proof. Reuse the same task space.

No full simulation, live multiplayer, mobile-portrait or balance verdict. Current approved14-image set unchanged; S08 captures require separate review before any future baseline promotion.

Repeat browser proof using the existing task space: import scripts/ui/s08-smoke.mjs with Ego and call run({page,repo,spaceId}); do not create a replacement space after a navigation/screenshot error. Standard peer gates remain npm run ui:smoke and npm run ui:visual. Capture-source hashes are in current-captures.json; source/static fingerprints include reward-concept.css.
