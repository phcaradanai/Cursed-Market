# Forced RPS missing-hand implementation plan — 2026-10-31

Goal: approved timeouts/disconnects cannot cancel an otherwise valid duel. Only missing hands are server-seeded, submitted hands stay fixed, and ordinary RPS/penalties/transfers resolve. Keep existing30second round clock until a separate decision changes it. Preserve old audits through a versioned flag.

## Intended narrow change

- theft.ts expireTheftDuel: flag-on calls ordinary chooseTheftHand for a snapshot of missing human participants, with seed/duel/round/player keyed draws. Stop if the round changes or duel closes, so a timeout tie cannot submit into the next round. NPC hand already committed by existing npcHand. Invalid/moved target cancellation stays distinct.
- types/engine: new-run theft-timeout rule flag, validation and compatibility. Legacy configs keep old cancelled timeout. New-rule theft-timeout must not cancel/fall through to done; avoid phase timer instantly retrying new tie rounds. defaultAppraisalAction should defer open new-rule duels to their authoritative per-round room deadline, not allow the expired phase timer to spin RPS.
- rooms: retain server-only deadline/round keys and request idempotency, clock unaffected by reconnect. Inspect parser/protocol to prove clients cannot forge early server expiry. Never expose unsubmitted hands.
- existing TheftPanel: update only explanatory copy if needed; same shared controls and required duel behavior.

## Test-led tasks

- [ ] Read exact expire/choose/cancel/defaultAction and room deadline/lifecycle callers; test impact includes existing timers, theft, secure integrations, replay and network.
- [ ] Reproduce old cancellation using new-rule tests for both missing, one submitted, NPC, tie, invalid target and repeated expiry.
- [ ] Implement seeded fallback/version gate; assert no extra attempt/energy/item/penalty on retry, no mutation of submitted hand or newly tied round.
- [ ] Test phase deadline before/after duel deadline, reconnect while silent, no early forged expiry, ordinary duel loss consequences and strict audit replay.
- [ ] Update approved rule context, UI/source fingerprints, Atlas and verification with actual results. Existing remaining questions about genuinely invalid targets/refunds remain separate; do not invent refunds.

Status: approved rule; implementation not started. This plan does not mark whole-game completion or replace the program's remaining catalog/strategy/Collector work.
