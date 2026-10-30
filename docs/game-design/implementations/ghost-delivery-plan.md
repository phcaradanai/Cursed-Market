# Spirit-world delivery program — active, 2026-10-30

Authorization: user requested concepts, real Comic UX/UI and complete logic integration. Goal is active; existing helper alone is not delivery. Active source apps/comic only.

## Ordered work and acceptance

1. G01: server-owned four-card round, visible reveal/shuffle sequence, one validated answer per round, unlimited failed-round retry, unlock hiring on success. Persist in match state, route authenticated/idempotent actions, serialize only intended knowledge, preserve reconnect and independent living-player clocks. Tests: forged/alive/stale/early/repeated answers, replay, reconnection, success/failure.
2. S11/G01 UI: shared ComicPhaseFrame and ComicButton, inventory bounds, four equal cards, known phase/feedback, accessible keyboard/touch and reduced motion, six utility menus. Existing v02 is visual reference, not measured geometry. No invented placeholder controls counted as working.
3. G02: living-player three-item choices, quote90–120% base, negotiated fee starting0, explicit acceptance, no up-front charge. Use actual item catalog/runtime IDs; do not infer new56 bindings from artwork.
4. G03: Skeleton three revealed slots, buy only contracted target, RPS independently disables lost slot, all lost waits next encounter. Do not reset slots via minigame/reconnect. Living players never wait for ghosts.
5. G04: atomic item/payment delivery. Buyer pays item price+fee only on success. Ghost receives10% base from item price+fee,1 earned credit=1 bonus point. Insufficient buyer funds stays pending. Test conservation, insufficient funds, simultaneous actions, duplicate requests, owner changes and match end.
6. Register actual states/captures distinct from concepts; update main generated HTML/atlas and handoff. UI gates: check/contracts/smoke/approved14 visual baseline, narrow/wide inventory geometry; focused gameplay and network tests, Comic build. No rebaseline without approval.

## Confirmed decisions (2026-10-30)

User approved floor10% to whole credits, RPS tie retries, one pending job per living player per ghost, unfinished jobs cancelled without payment/score at match end. Buyer death cancels the job unpaid/unscored; when no pending job remains, the ghost must win the minigame again. Insufficient funds wait for replenishment. Completing all accepted/pending work relocks service; three independent slots reset on the next living encounter. Quote identity is validated against the displayed offer; delivery retains its accepted private prototype/base/price snapshot.

## Starting evidence (historical)

At the start, only isolated ghost-tracking.ts and one test existed at start. No room/action/view/UI integration. Latest baseline source39ec327; preserve unrelated working changes. Previous broad i18n failures and full simulation limits remain documented in ui-system/verification.md. Never describe a preview as live multiplayer settlement.

## Current handoff

Implementation and current verification are in [ghost-delivery-progress.md](ghost-delivery-progress.md) and [machine-readable results](../../ui-system/ghost-functional-verification.json). Historical starting evidence above does not describe the current implementation.
