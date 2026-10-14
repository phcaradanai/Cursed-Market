# Phase 3 tools validation — 2026-10-13

**Result:** observation protocol and offline analysis are ready. This is preparation for a human session, not human fun validation.

## Verified behavior

`npm run check` passed: **45 tests**, client typecheck/production build and 12,000 reproducible simulation matches / 116,000 auctions.

The six new report tests cover:

- Complete logs produce replay-checked decision/timing metrics without claiming human enjoyment or a rematch rate.
- Timeout bids are excluded from manual strategy counts; a claimed timeout must match its recorded safe default.
- No sales yields a null average price/tie ratio, preserving the absence of a denominator.
- Altered settlement, scores, roster and incomplete games are rejected.
- Missing/duplicate/invalid timing metadata is rejected.
- Duplicate copies of the same match and non-export inputs are rejected.

The actual npm CLI was exercised against the two previously downloaded browser-QA match exports. Its stdout parsed as JSON. The first export's four automatic pass bids were correctly separated; the second had zero default bids. Both exports replayed successfully. The summary omitted seed and event logs, kept `humanFunValidated: false`, and kept `voluntaryRematchRate: null`.

Those files were produced by automated browser QA. They are **not** real-player observations and are not included as human study results.

## Collection still required

Use the first LAN group of 3–4 real players. Save match audits and the observer worksheet together. Log files cannot identify genuine participation, comprehension, engagement or voluntary continuation by themselves.

The protocol records measured two-minute comprehension, help needed, confusion, agency, strategy reasons, remembered reveals and individual feedback. It distinguishes spontaneous requests, answers when asked, and actual completed group rematches. Scheduled repeat conditions and unavailable time are reported separately.
