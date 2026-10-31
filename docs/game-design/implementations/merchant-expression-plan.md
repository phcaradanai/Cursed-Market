# MERCHANT-EXPRESSION-01 implementation — 2026-10-31

Approved rule: merchant-expression-rules.md; three existing frames, no reach/new art. Source baseline a2102fb. Current bug: portal/appraisal moods derive from trust/caught instead of confirmed choice/result.24 existing assets inspected; Beast smile/angry and Alien angry canvas sizes differ from idle, so pose calibration is a separate required check, not assumed solved by URL switching.

## Implementation

1. Red SSR checks for unselected idle, confirmed selection smile/others angry, appraisal null/accepted/rejected. Shared pure expression rules, reused by portal/appraisal and future context consumers.
2. A local650ms confirmed-entry presentation reuses existing portal layout before displaying appraisal. Submit immediately; never delay server commands, clocks or inventory updates. No optimistic smiles before acceptance; no replay on reconnect/duplicate selected state; reduced-motion skips the hold. During the brief read-only reaction, six utility menus and preview remain available. New encounter/seat, death, duel or later phase clears/bypasses stale presentation.
3. Appraisal selected item uses only public appraisalAccepted; start/new item idle. Do not derive success from trust, price guesses or private truth. Result stays until item/result/context changes; no additional timed UI machinery.
4. Test pure transition/rejection/duplicate/reconnect conditions and actual mounted UI sequence, menu/clock access, reduced-motion; confirm shared geometry and24pose framing. Run existing visual/functional gates. A changed approved screenshot requires review rather than re-recording.
5. Update central registry/context/status/verification. Whole-game remains active; separate catalog/strategy/Collector work remains.

## Results

S02/S04 implementation and5 new tests complete. Initial3 SSR cases failed against a2102fb and pass after shared rules. Actual engine-command case required resolving the real appraisal-entry event (not mutating it away); focused suite20/20 passes. Mounted3width sequence/24poses/reduced-motion pass, original14-image references and18menu flows pass. Existing crop/base geometry retained, no asset edit or claimed head-anchor recalibration. Broad suite118/120:2 obsolete tests reproduce against parent GameTable, logs retained. Full report: docs/ui-system/merchant-expression-verification.json. Whole-game still active; STRAT-01 structure question pending.
