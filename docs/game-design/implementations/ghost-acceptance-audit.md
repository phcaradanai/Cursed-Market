# Spirit-world acceptance audit — 2026-10-31

Scope is the active S11/G01–G04 objective. Repository implementation is authoritative; historical concepts are references and current screenshots do not gain automatic baseline approval.

| Requirement | Current evidence | Result |
| --- | --- | --- |
| Four-card server-owned round, visible shuffle, unlimited failed retries | ghost-tracking/service tests; GhostWorld; prior live-clock report | Implemented |
| Early/alive/forged/stale/repeated actions reject or acknowledge safely | real two-socket test; engine idempotency; parser rejects client time | Verified |
| Reconnect/watch does not reset round clock | ghost-live-clock.json; room-state startedAt; socket duplicate/resume assertions | Verified within running match |
| Living player three quotes90–120%, fee≥0, explicit ghost acceptance | ghost-service/quoteId parser+client; socket hire/accept; prior live browser workflow | Implemented and verified |
| Current catalog and fixed accepted rarity/base/price, no secret truth leak | private-clone/prototype test; secret DTO test; quote identity check | Verified; new56 migration separate |
| Skeleton three slots; only contracted target deliverable; independent RPS losses/tie retry | service tests, real command-only RPS search replay; working/lost captures | Verified |
| Three losses wait next encounter; no reset via minigame/reconnect | slot projection/restart tests; lost controls disabled | Verified |
| Atomic delivery and single payment/item/points; insufficient funds wait | secure-ledger2socket test; duplicate request/delivery cases; buyer.paid and price-integrity records | Verified |
| Buyer death/end cancellation unpaid and unscored; batch relocks | service cancellation/Collector/batch tests | Verified |
| One special point per earned credit, once after ordinary score modifier | Collector and Status estimate tests | Verified |
| Ghost does not block living phase/ready flow | living-phase advancement test; replay ends at Collector; browser phase unchanged while service completes | Verified |
| Reuse inventory shell/buttons/pager; no unrelated redesign or scroll | ghost geometry15states ×desktop sizes; six utility menus; source checks | Verified |
| Existing approved baselines preserved | ghost-final-visual + matching invocation:14/14; no baseline changes | Verified |
| Current context/flow/Atlas/captures | C34–C38, screen-flow; generator/checker123inputs; source/capture hashes | Verified |
| Durable implementation and evidence | Explicit staged source/tests/docs exported via git checkout-index;370 UI fingerprints and123 Atlas inputs pass without unstaged/untracked files | Verified |

Exact commands/results and source hashes: ../../ui-system/ghost-functional-verification.json. Raw stdout including negative regression proof and old NPC failure: ../../ui-system/ghost-test-results.txt.

Not a claim of whole-game balance, full CPU-bound simulation coverage, phone portrait support, cross-restart room persistence, or new56 effect migration. Existing Dark One display-name test fails on committed39ec327 too. Initial death/matching slot in the socket test are fixtures; strict command-only replay uses natural death and real draws. Earlier browser oracle only selects winning RPS hands and never adds stock. Preview image callbacks are not multiplayer payment proof.
