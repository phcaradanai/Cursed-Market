# Continuity audit — 2026-10-29

## Repository and Git

Starting HEAD `789ab3d` (2026-10-26) refines the realistic/cabinet app. Earlier `2461263`/`b34c5e5` introduced/merged that cabinet; `88b8637` is an older game-style table, not the current comic design. Root GameDialog's focus/error handling and Node SSR tests are useful architecture, not evidence to copy brass visuals.

At audit start, comic lived outside Git at `/Users/oyl-mac_m1/Documents/Codex/2026-10-24/j/outputs/ui-2d-red-black-white/build`; no `.git` there. `docs/game-design/` (82MB), AGENTS and recent captures/continuity decisions were untracked. Root already had unrelated dirty SecureEconomy/storage/engine/test and .impeccable changes; this task does not stage or overwrite them. They prevent claiming a clean repository or green whole-branch Trail check.

Authorized migration imports364 files/230,391,124 bytes into `apps/comic`, excluding dependencies/build output/secrets/local hooks. Import fingerprints in `migration-origin.json`. Root shared/server matched external; external game had5 changed files and journal.ts added; client14 changed/27 new; tests4 changed/2 new. This is why the old root game folder was not copied over comic. Assets remain at their existing public URLs. Root lockfile/dependencies suffice. No new package manager/toolchain.

## Screens and evidence

Existing registry has30 entries,28 captures across15 groups (5live,23fixture), not30 finished pages. Current screenshots are evidence of implementation, not universal approval. S06 tabletop and item detail are substates, not new flow pages. Original capture hashes/root are historical provenance; the active root is now apps/comic and newly generated verification carries its own fingerprints.

| Area | Established pattern | Reconcile / approval boundary |
|---|---|---|
| M01 inventory | reference frame, cutout art, equal action pair, filters/pager | preserve; baseline anchor |
| M02 status | same menu header, compact stats, paged trust cards | preserve; audit content clipping separately, no redesign |
| M03 market | same frame, destination signs, order/auction state | preserve gameplay distinction; do not replace with generic tabs |
| M04 ledger | same frame; event/cause/changes pages | preserve causal logs, no new editorial layout |
| M05 rules / M06 settings | same header/control hierarchy, content panels | preserve; images blocking rules previously removed; no new illustration |
| S02 merchants | existing portal scene, known merchants/outcomes | no replacement concept; selection emotion rules remain a separate roadmap item |
| S03 E109 | nonmodal peek, merchant cutout scale, cost/outcome knowledge | preserve phase gates and footer access |
| S04 inspection | art/merchant plus state/action region | compare tokens and safe area; full reconciliation needs separate approved scope |
| S06 trade/detail | tabletop and shared menu; latest same-game correction | restore centred stepper bug now; preserve Share/TradeListing behavior |
| U01/U02, S08/S13 | existing entry/lobby/reward/results, partial old styling | document discrepancies; no blanket restyle without product approval |
| Planned ghost/Collector screens | design-only or mixed runtime | no inference of absent implementation from missing capture, no automatic generation |

## Main debt

CSS is an accumulated cascade (legacy styles/cabinet/theme/concept/layout plus per-screen rules). Multiple higher-specificity and !important rules can override a new panel while geometry appears valid. Consolidated only identical-value tokens and duplicated main-frame geometry. Kept existing screen styles; no mass selector cleanup. `comic-ink.css` is a rejected decorative experiment and no longer imported.

Token owners and component reuse are explicit in design-system.md. Screen registry conceptStatus often means design progress, not runtime absence. Historical documents append contradictory snapshots; the concise continuity entry and decisions table identify which supersede them instead of deleting history.

## Memory check

`hindsight_sync_retain` completed with memory ID `77b96ea2-f114-49a0-8fdd-ea7262836a6a`. Initial free-text recall did not return the marker. A second recall with continuity-probe tags returned that exact ID and the normalized audit fact. Therefore write acknowledgement + retrieval both verified in this session. Arbitrary probe code was summarized away, and recall also included unrelated older results: memory is semantic/history support, not a byte store, strict filter, or current-source authority. No guarantee is made for future availability; report tool errors, and continue from versioned files.

The generated game atlas still classifies root runtime sources. It is not proof that every comic-backend rule matches root. Comic journal/content/storage differences are versioned, tested separately and must be reconciled deliberately. Two full-suite attempts were stopped after prolonged execution without a result; no full-suite pass is claimed. Focused root UI tests passed81. Imported comic focused tests initially passed63/71; SSR window guard is fixed, stale cabinet-copy/art-manifest assertions remain documented rather than weakened.

## Concrete follow-up proposals

See [reconciliation-plan.md](reconciliation-plan.md) for U01/U02/S08/S13 capture references, observed differences, exact existing primitives/behaviors to preserve, and approval boundaries. These proposals do not authorize or implement unrelated redesigns. Current14-image approval applies only to the sealed baseline set.
