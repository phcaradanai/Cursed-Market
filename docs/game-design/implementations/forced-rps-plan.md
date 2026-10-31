# Forced RPS missing-hand implementation plan — 2026-10-31

Goal: approved timeouts/disconnects cannot cancel an otherwise valid duel. Only missing hands are server-seeded, submitted hands stay fixed, and ordinary RPS/penalties/transfers resolve. Keep existing30second round clock until a separate decision changes it. Preserve old audits through a versioned flag.

## Intended narrow change

- theft.ts expireTheftDuel: flag-on calls ordinary chooseTheftHand for a snapshot of missing human participants, with seed/duel/round/player keyed draws. Stop if the round changes or duel closes, so a timeout tie cannot submit into the next round. NPC hand already committed by existing npcHand. Invalid/moved target cancellation stays distinct.
- types/engine: new-run theft-timeout rule flag, validation and compatibility. Legacy configs keep old cancelled timeout. New-rule theft-timeout must not cancel/fall through to done; avoid phase timer instantly retrying new tie rounds. defaultAppraisalAction should defer open new-rule duels to their authoritative per-round room deadline, not allow the expired phase timer to spin RPS.
- rooms: retain server-only deadline/round keys and request idempotency, clock unaffected by reconnect. Inspect parser/protocol to prove clients cannot forge early server expiry. Never expose unsubmitted hands.
- existing TheftPanel: update only explanatory copy if needed; same shared controls and required duel behavior.

## Test-led tasks

- [x] Read exact expire/choose/cancel/defaultAction and room deadline/lifecycle callers; test impact includes existing timers, theft, secure integrations, replay and network.
- [x] Reproduce old cancellation using new-rule tests for both missing, one submitted, NPC, tie, invalid target and repeated expiry.
- [x] Implement seeded fallback/version gate; assert no extra attempt/energy/item/penalty on retry, no mutation of submitted hand or newly tied round.
- [x] Test phase deadline before/after duel deadline, reconnect while silent, no early forged expiry, ordinary duel loss consequences and strict audit replay.
- [x] Update approved rule context, UI/source fingerprints, Atlas and verification with actual results. Existing remaining questions about genuinely invalid targets/refunds remain separate; do not invent refunds.

Status: runtime implemented; functional73/73 and two-socket1/1 pass. UI approved and implemented; new3width geometry, baseline14/14, menu18/18 and UIcontracts10/10 pass. Timer10/10 passes from Comic cwd. See docs/ui-system/forced-rps-verification.json. This plan does not mark whole-game completion or replace the program's remaining catalog/strategy/Collector work.

## Recon / red proof after RULE-01 checkpoint e96260a

New untracked appraisal-forced-rps.test.ts currently demonstrates3 expected failures /4cases against unchanged cancellation runtime: both missing cancels, submitted hand is discarded, phase default cancels. Invalid target/legacy cancellation still passes. This records the initial red run; production changes now implement the approved fallback (see current status above).

Important exact current-state gaps for implementation:
- AppraisalRoomService.handle blocks every action after phase deadline, even when an independent duel round is open. New-rule hand submission must remain available under the duel clock; expire due round before accepting a late hand and return latest state.
- theft-hand currently has duelId/hand but no round token. Investigate adding an optional round parameter required only under the new rule, updating client/bot/parser/engine/tests together, to reject an unaccepted delayed old-round hand after a timeout tie. Preserve old audits without the version flag.
- Room timeout loops pending seats using defaultAppraisalAction; returning null for forced open duels lets per-round sweep settle them without repeated phase-clock rerolls. On resolution, normal expired-phase completion may proceed.
- Existing old cancellation test in appraisal-end-rules and default-timeout expectation in appraisal-secure-integration need explicit legacy config or new-rule assertions. Do not indiscriminately rewrite outcomes.

Browser current whole-goal space10 remains agent-managed and is explicitly authorized for continuous verification. Do not finish it at each checkpoint. Latest standard test server3191 session96625 was built after RULE-01; older3189/3190 should not be killed if room ownership unknown. UI needs a new fresh source fingerprint when the next untracked test/changes are ready.

## Current implementation / design approval

- New runs set theftTimeoutRules:1; historical flagless audits preserve cancellation. Late hand actions carry a round token, parsed and enforced only for new rules; duplicate accepted commands stay idempotent.
- Rooms preserve the independent30s round deadline across disconnect/reconnect. A phase timeout cannot cancel/re-roll a pending new-rule duel. Only missing human hands are seeded; existing NPC sealed hands remain fixed. Invalid targets retain ordinary cancellation.
- User approved the shared Comic frame on2026-10-31. Active duel hides duplicate appraisal/trade content; hand controls remain available even if the phase is otherwise done. Utility menus remain read-only. Existing target selection and closed-duel results are preserved; their legacy expanding layout still needs a separate reconciliation, not claimed complete.
- New preview=theft is a public fixture only. appraisals acquired through commands and full audit replay are tested separately; two-WebSocket disconnect/late-hand coverage does not claim whole-game balance.
- Browser verification first attempt had overlapping test navigation and an ambiguous test selector; these are harness failures, not established product regressions. Run final suites sequentially and inspect fresh receipts.

Final extra keyboard assertion passes3widths in replacement authorized space11 after space10 was confirmed missing. Keep11 for continued goal checks; do not touch user-owned5/6. Trail check reports20 existing lexical conflicts in excluded .impeccable artifacts, none staged; root test changes are unrelated.
