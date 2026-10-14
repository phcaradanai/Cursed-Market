# Roguelike Run v0.3 — validation

2026-10-13. Experimental mechanics, not evidence of human enjoyment.

## Automated and network evidence

- `npm test`: **66/66 pass**, including original kernel/audit coverage, v0.2 wagers and added roguelike/reconnect/default cases.
- **300 synthetic v0.3 runs**, 100 each with 2/3/4 players, verify nonnegative balances, finite reserve conservation, exactly three seller turns per player, two distinct run-local boons, independent score ledger, seeded event replay and tamper rejection.
- **750 v0.2 synthetic regression matches** still pass; original v0.1 phases/scoring remain covered.
- The current report CLI also replays and reports four saved prior browser-QA audits: two v0.1 and two v0.2. These are compatibility evidence, not human playtest results.
- Same seed/choices reproduce state; changed branch changes the current market and future frontier. Fifty sampled seeds produce at least 40 distinct current frontiers. This does not guarantee universal uniqueness or strategic balance.
- Real HTTP/WebSocket tests complete 2/3/4-player runs with route votes, personal boon choices, auctions and wagers, then export/replay/report and reset all builds/resources on a new match.
- Room tests restore a sealed route vote and private boon offers/pick on reconnect; partial choices do not extend deadlines. Offline/default runs reach results with no forced wagers or boon purchases.
- Tests verify private views, foreign-offer rejection, packet-order-independent voting, high-roller caps, combined wallet budget and historical values fixed at purchase time.
- Client TypeScript and production Vite build pass.

## Limits and deployment

The user explicitly selected stopping further image checks. No new browser sessions, v0.3 screenshots or human playtest data are claimed. Existing v0.2 captures describe the incumbent design only. Independent source review found no material blockers within its source and automated-evidence scope. The documentation comparison found no design-system or rules mismatch: `DESIGN.md` and `.impeccable/design.json` remain unchanged; the marketplace surface brief records the local v0.3 extension. Visual and human-device validation remain open.

The new LAN process uses port **3102**. Earlier 3100/3101 processes remain available for prior room/audit access. Rooms are in memory; save JSON before rematch or server restart. Route profiles and boons need human balance testing, especially automatic route picks, build dominance and bankroll loss. The unchanged sealed auction may still be repetitive despite varied run conditions.
