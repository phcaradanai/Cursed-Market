---
title: "Duel clock, match-end loan foreclosure, Collector deadline"
author: Phcaradanai
date: 2026-10-23
branch: main
cost: { minutes: 25, tokens: 108022 }
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - src/appraisal-client/App.tsx
  - src/appraisal-client/SecureEconomy.tsx
  - src/appraisal-client/i18n-en.ts
  - src/game/appraisal/engine.ts
  - src/game/appraisal/secure-storage.ts
  - src/game/appraisal/survival.ts
  - src/game/appraisal/theft.ts
  - src/game/appraisal/types.ts
---

## Decided
- Duel timeout: server-only clock in AppraisalRoomService (APPRAISAL_DUEL_MS=30s per duel round, a draw restarts it) checked by a new RoomLifecycle.sweep hook every tick, so it works in untimed rooms. It applies the internal action `theft-expire` (never parsed from clients): the duel is cancelled, nobody's phase ends, the attempt and energy stay spent, no seal/penalty. Room view carries `duelDeadlines` only for the seat's own duels.
- Loans: config `loanEndSettlement` (in DEFAULT_APPRAISAL_CONFIG) forecloses every active loan at classic RESULTS and in collectRun; trace reason 'match-end'. Pending offers are cancelled.
- Survival end: config `collectorDeadline` defaults to CORE2.collectorEncounter (15). settleEncounter calls collectRun when everyone is dead or `collectorDue(state)`; invariant and collectRun accept either. View exposes `collectorAt`. Bot retirement at 12 now only applies when no deadline is set.
## Tried and ruled out
- Changing `theft-timeout`: it already falls through to `done` and is in saved audits, so a separate action was added instead.
- Unconditional rule changes: replay compares exported audits exactly, so both rules are config fields absent from saved audits.
## Watch out
- Not user-confirmed: the 30 s length, cancel instead of forfeit for the silent side, and foreclosure (not net-out) at match end.
- trail check flags these files on keyword overlap with the rejected "5 credits + global ban" learning; there is no such penalty here.
