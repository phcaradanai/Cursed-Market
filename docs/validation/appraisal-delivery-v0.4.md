# Cursed Market v0.4 — technical delivery evidence

2026-10-14 — M0–M5 Card Appraisers implementation. This is technical playtest readiness evidence. It does not claim human enjoyment, approved balance, final brand approval or new rendered UI validation. The authorized goal uses realistic cards as a working direction on the existing React/Node stack.

## Delivered behavior

- Authoritative seeded appraisal engine with 3 encounters, 6 dimensional NPC behaviors and 10 artifact types. Private portal/stock/inspection views, accepted NPC prices, explicit Dark One consent, credit/energy, inventory activation and contracts.
- All 50 typed RNG events and 20 combined status types have real resolvers with eligibility, choices, timing and effect fixtures. The assistant's 10-buff/10-debuff split and all balance constants remain experimental in the [decision ledger](../plan/Appraisal_Rules_Decisions_v0.4.md).
- Intermittent Dark Market rolls before each encounter, draws 1+ eligible demand kinds, accepts newly bought items until encounter end, and settles once against quotas/reserved funding. Prior sold types remain eligible; no player inventory/history targeting.
- Death/exhaustion rests only the current encounter and recovery restores play next encounter. Death zeros the current encounter's score only; exhaustion retains earned score. Paused/disconnected players do not block advancement.
- Atomic NPC purchases, free/paid P2P trades, item swaps and permissioned cross-shop purchases. Receiving players see recipient-safe incoming item facts before accepting, including previously unlisted swap items. Retry, resource conflicts and stale encounter/match commands cannot pay/transfer twice.
- Private rooms for 2–4, opaque seat resume, fixed deadlines, safe defaults, results, downloadable schema-v4 audit and fresh-match rematch. Deadlines: PORTALS 30s, APPRAISAL 90s, TRADE 45s, REVEAL 4s; actions do not extend them.
- Thai state-driven realistic-card client with portal/appraisal/event/market/inventory/trade controls, pre-commit costs/conditions/risk range, item identity/facts, waiting/error/reconnect/results. Separate new entry/bundle preserves legacy entry and existing LAN processes.
- 16 independently generated NPC/item assets, exact generation prompts and embedded prompt metadata/hashes; 3 self-hosted OFL fonts. Optional sound starts off; motion begins with visible content and respects reduced motion. Same artifact kind art is used across hidden truth states.
- Replay CLI dispatches raw/room appraisal schema-v4 and legacy event logs; report CLI dispatches downloaded legacy/appraisal rooms with strict metadata/replay checks. Reports keep humanFunValidated false and voluntaryRematchRate null.

## Acceptance evidence

| Check | Result | Evidence |
| --- | --- | --- |
| Domain/events/status/economy/ownership/privacy/retry | 116 domain tests pass | [M1/M2 scope](appraisal-domain-v0.4.md), current [full log](appraisal-delivery-v0.4/tests.txt) |
| Room/parser/actual network | 22 tests pass, including 2/3/4-seat run/rematch, socket reconnect/retry, default/disconnect/rest recovery and atomic trades | [M3 scope](appraisal-network-v0.4.md), new [2](appraisal-delivery-v0.4/network/network-2-players.json)/[3](appraisal-delivery-v0.4/network/network-3-players.json)/[4](appraisal-delivery-v0.4/network/network-4-players.json) audits |
| Legacy regression | 66 tests pass, including 300 legacy roguelike synthetic runs | Current [full log](appraisal-delivery-v0.4/tests.txt) |
| Client/model/SSR/provenance | 61 tests pass, including every offered E01–E50 choice, price/risk/consent, phase SSR and F1–F3 regressions | Current full log; tests/appraisal-client.test.ts |
| v4 reporting/replay metadata | 5 tests pass, including altered run/roster/times, deadline-driven skipped phase and CLI raw/room dispatch | Current full log; tests/appraisal-report.test.ts |
| Full production build | Server + legacy client + appraisal client TypeScript/Vite pass | [Build receipt](appraisal-delivery-v0.4/build.json) |
| Fresh seeded scenarios | 1,200 runs, 2/3/4 × cautious/aggressive/collector/trader × 100, each strict replay verified | [Summary](../simulation/appraisal-delivery-v0.4/summary.json), [example audit](../simulation/appraisal-delivery-v0.4/example-run.json) |
| Replay/report legacy compatibility | 9 replay CLI checks; 9 downloaded mixed-generation reports pass | [Checks](appraisal-delivery-v0.4/compatibility-check.json), [mixed report](appraisal-delivery-v0.4/audit-report.json), [reproduction script](appraisal-delivery-v0.4/check-compatibility.mjs) |
| Live new entry via LAN address | HTTP health/index + 21 asset paths/MIME; actual 2/3/4 sockets complete 3 encounters, strict replay and rematch reset | [LAN check](appraisal-delivery-v0.4/lan-check.json), [reproduction script](appraisal-delivery-v0.4/check-lan.mjs), network/lan-{2,3,4}-players.json |
| Independent finish review | Initial F1/F2/F3 fixed in one batch; reviewer scores each resolved, focused ship verdict | [Five-section review](appraisal-ui-review-v0.4.md) |
| Design documentation | Source-based canonical DESIGN + synchronized schema-v2 sidecar; working direction and legacy preservation | [Documentation receipt](../art/appraisal-v0.4/documentation.md), root DESIGN.md and .impeccable/design.json |
| Playtest handoff | LAN command/URL, audit/replay instructions, briefing/questions/observer worksheet | [LAN guide](../plan/Appraisal_LAN_v0.4.md), [v4 protocol](../playtests/appraisal-v0.4.md), [worksheet](../playtests/appraisal-session-v0.4.md) |

Total **270 automated tests passed, 0 failed, 0 skipped**. All network clients are synthetic. Tests accepting each event choice with an offered target do not prove every UI target permutation or browser interaction.

The replay compatibility check preserves the published v0.1 baseline example and adds fresh synthetic raw fixtures for v0.1/v0.2/v0.3 (wager fixtures exercise stakes), room exports for those versions, and v0.4 raw/room audits. Room compatibility fixtures use a controlled clock and safe defaults; they are not human observations.

## Simulation interpretation

Every current run finishes and passes the replay/economy assertions. Trader policies obtain mean scores about 19.9–21.3 across player counts, compared with roughly 3.9–10.1 for the other fixed policies. This is a candidate economy/decision-quality question for playtesting, not proof of a dominant human strategy: these are homogeneous, deliberately limited bots. No automatic balance adjustment was made. Natural sampled runs do not resolve every event; the forced eligible/ineligible/choice fixtures provide ID-level coverage separately.

Keep the original M3 network evidence and original appraisal-v0.4 simulation artifacts unchanged. Fresh delivery outputs use appraisal-delivery-v0.4 directories. [Current source and built hashes](appraisal-delivery-v0.4/source-sha256.json) record what was verified; future edits require checking that manifest before reusing this evidence.

## LAN and preservation

Verified URL: **http://192.168.1.114:3103**. `start:appraisal` uses the new room service and dist/appraisal-client; default `npm start` remains legacy v0.3. New server PID 23920 binds 0.0.0.0. Prior listeners remain: 3100 PID 99522, 3101 PID 4365, 3102 PID 9128. None were restarted or killed. URL/process/IP are a session snapshot, not a permanent hosted service. Rooms/audits remain in memory; download results before rematch or stopping the server.

LAN validation ran through the LAN address from this server machine, with actual HTTP/WebSocket traffic. It does not certify Wi-Fi/firewall access from separate human devices. No public hosting or external notification was created.

## Design findings and limits

The earlier Georgia font finding was corrected to the documented type system. No ignore-value, ignore-file or ignore-rule suppression was added. The independent review's incoming swap identity, E08 exact contract terms, and duplicate-item market sale identity findings are fixed and covered by regressions. Nothing from that bounded finding list remains unresolved.

The user's instruction **“หยุดตรวจภาพ ใช้ผลตรวจเดิม”** remains in force. No new browser session, screenshot, rendered image review or device accessibility check was performed. Source/SSR review establishes controls and information paths; it does not certify actual layout, font rendering, responsive overflow, keyboard/focus behavior, touch geometry, screen-reader output or art quality. Historical captures are historical evidence only. The generated concept is critique reference, not an approved comp or a functional game screenshot.

The implementation is ready for the scoped human playtest. Enjoyment, strategic variety, comprehensibility, voluntary rematches, differentiated identity, balance and final visual quality remain unproven. The technical goal does not require waiting for human attendance.
