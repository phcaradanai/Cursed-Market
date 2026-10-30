# Acceptance evidence — continuity goal

Final verification audit2026-10-30. Acceptance evidence complete: approved UI/source checks pass; separate root-source commit and Git-export verification resolve the last provenance gap. Historical failures remain documented; no unrelated screen redesign is implied.

| Requirement | Current authoritative evidence | Verdict |
|---|---|---|
| Audit repository/runtime/history/architecture | audit.md, migration-origin.json, current-captures.json and screen-flow.json; starting HEAD789ab3d, isolated app checkpointd91b4d5 | covered; source/profile/proposal boundaries explicit |
| Verify Hindsight retention and recall, report limitations | memory-health.json: initial same-ID probe roundtrip; actual user approval retained/recalled and read directly by ID5e19f5c9-b0bc-44e5-8fd7-a14688d2774b; scoped restriction also retrieved | verified this session; broad query limitation reported, future availability not assumed |
| Derive a design system from existing approved UI | design-system.md, decisions.md UI-01–04, existing shared components, human-approved14-image hash set | covered; no new identity |
| Propose reconciliation and obtain approval for material changes | reconciliation-plan.md gives U01/U02/S08/S13 observed captures, reuse plan, preserved behavior and review boundaries. Migration and baseline explicitly approved; no unrelated material redesign performed | proposals delivered; future screen redesign is a separate task |
| Concise future-session instructions | root AGENTS.md, root/comic READMEs, PROJECT-CONTEXT.md and generated main HTML identify apps/comic and relevant source/docs/tests | versioned session contract |
| Safe token/component consolidation | existing ComicMenu/ComicButton/Share retained; identical-value tokens/frame owner centralized; source fingerprints | covered; no duplicate rule implementation |
| Preserve functionality | all63 imported runtime files remain byte-identical; build:server;79 UI/knowledge/price/E109/journal tests pass; existing root focused81-pass evidence retained | scoped preservation verified; not a claim that every old simulation is green |
| Repeatable UI consistency checks |10 Node tests;18 real preview menu flows at1024/1440/1920; frames, header padding/actions/radius, restored item/clock and no page scroll | covered; negative regression cases included |
| Screenshot references and visual regression | sealed approved manifest14 states across7 stable screen IDs. compare-approved-pass-1.json and pass-2.json each14/14; max changed-pixel ratio0.0000794405833 in both, below unchanged0.001 limit | approved baselines pass twice, no reference mismatch retries or art masking |
| Protect approval / trust fresh evidence | record refuses approved replacement; exact approved SHA set checked; CLI invocation receipts distinguish bootstrap failure from stale reports; failed readiness retains sample pair | covered by negative tests |
| No unrelated redesign / original app preserved | production UI/rule/art unchanged in follow-ups; root legacy files and unrelated changes excluded from scoped commits; imports preserve original source/art | covered; proposals only for other screens |
| Documentation/registry/generated HTML current | decisions, verification, roadmap, current capture metadata, stable IDs; generated atlas source/output hash checker106 inputs | verified106 inputs/outputs, including exported committed root source; see root-provenance.json |

## Evidence limits retained, not hidden

- Earlier raw captures drifted; DPR2/warm reloads did not solve cross-width behavior. Corrected capture preparation samples actual paint frames, allows up to10 readiness samples and compares the approved reference once. A stable changed image still fails the regression test. Two full current runs pass; hardware/browser changes still require a matching environment or reviewed migration.
- The original browser space3 no longer existed. User authorized replacement; space4 was created. The failed bootstrap is not counted as a visual test. See browser-session-gap.json and per-run invocation receipts.
- Historical UI assertions were reconciled to current approved surfaces, not disabled: exact merchant quote/payment totals and consent/unknown facts; phase utility visibility; duplicate-family receipts/selected sale; card/page/quota/disabled decisions; reusable term peeks and explicit item details.67/67 in that file,79/79 in the combined affected suite.
- Full simulations were stopped after verified CPU-bound execution despite Node test-timeout. No whole-simulation, live multiplayer, phone-portrait or game-balance pass is claimed. None was used to justify UI changes; gameplay/balance integration remains the existing separate roadmap.
- Trail check reports unrelated pre-existing .impeccable lexical conflicts. Those files are not part of the continuity commits. Any large-diff cap is reported rather than treated as an exhaustive pass.

Root Atlas provenance resolved: user approved the separate source commit4548562, server/client typechecks and29 focused tests pass. Fresh Git export verifies106 Atlas inputs and generated outputs, with installed dependencies reused explicitly. All source/art/docs used by this check are committed; no root gameplay was copied over comic. The separate E43 test assertion and unrelated work remain untouched.

Repository implementation and explicit approved decisions remain authoritative. Memory supports history. These limits are documented operational boundaries, not authorization to rebrand, change rules or re-record reviewed images.
