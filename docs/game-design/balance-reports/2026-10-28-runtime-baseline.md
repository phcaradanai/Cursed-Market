# BAL-01 — Runtime baseline

Revision before runtime changes: 789ab3dbd3cd8cb4bf02b498d8c8e93d9dc27548 plus existing non-runtime working-tree files.

## Build

Direct command: `node node_modules/typescript/bin/tsc -p tsconfig.json --extendedDiagnostics`.
Result: exit 0, TypeScript total 19.55 seconds. Previous incomplete build was not reproduced; no speculative build fix made.

## Synthetic runs

Data: [2026-10-28-runtime-baseline.json](2026-10-28-runtime-baseline.json).

- 12 runs, 4 seeds each for 2/3/4 players.
- Policies: cautious, aggressive, collector, trader (mixed seats).
- Config: `liveRules({secureEconomy:true,core2:true})`, recorded in JSON with seed per run.
- All 12 reached Collector; encounter counts 5–12, median 7.
- To reproduce, build the pre-change revision, import `runBalanced` and `liveRules` from `dist/src/simulation/balance.js`, use each stored `count/seed/policies/config`, maxTurns 8000.

The runner called liveRules does not itself enable secureEconomy/core2; these overrides are explicit here. This tests the old runtime catalog, not new56 effect bindings. No claim of strategy balance or complete event/action coverage.

## Verification limitations

The initial unrestricted-concurrency test attempt was interrupted. A later sandboxed run encountered `listen EPERM` in network tests; that is an environment restriction, not a game rule failure. Full post-change tests were rerun with network permission and concurrency 2. One cross-shop network case failed in that full run but passed when run alone; do not hide the discrepancy or count the isolated pass as a fully green run.

RULE-01 focused suite is independently passing (53 tests). See 2026-10-28-vault-interest.md. Capture the full-suite summary before marking the broad regression gate green.

## Completed regression evidence

Post-change full run: 841 tests, 840 passed, 1 failed, duration 248954ms. Failure seller wallet 514 versus expected 513 came from existing E43 subsidy, which respond() pays for subsidized trade parties. Updated the cross-shop assertion to include either participant’s reserved subsidy; final relevant 69-test suite passed. Full suite was not repeated after the test-only assertion change.
