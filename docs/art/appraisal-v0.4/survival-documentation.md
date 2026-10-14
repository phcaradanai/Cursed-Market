# v0.5 survival and Collector documentation handoff

2026-10-14 — Fresh Impeccable source comparison for the ordinary life, energy and Collector extension.

The extension fits the incumbent realistic-card system. It adds resource and lifecycle information through existing typography, controls, notices, tables and native disclosures. Root `DESIGN.md` and `.impeccable/design.json` remain byte-identical; no new palette, font, raster asset or design primitive is established by this handoff.

## Authority and source comparison

`docs/art/appraisal-v0.4/direction.md` remains the working surface direction. Root `DESIGN.md` owns the normative primitives; its schema-version-2 sidecar retains the existing component previews and extensions. `PRODUCT.md` supplies product context, and `docs/plan/Survival_Collector_v0.5.md` distinguishes confirmed lifecycle rules from the experimental numerical preset. The realistic-card concept remains a critique reference, with final brand approval open.

Local graft localized `Rules`, `GameTable`, `SurvivalResults`, contracts and score-copy helpers before targeted source reads. Direct CSS comparison matched all **20 appraisal root color declarations** to the incumbent frontmatter, mapping short properties `--muted`, `--line` and `--ink` to the appraisal `table-muted`, `table-line` and `paper-ink` scopes. The three self-hosted font faces, 6px control radius, 12px art-card radius and soft offset art shadow also match the existing system. The survival resource group wraps; it retains its existing gaps, numeral treatment and 640px layout override.

| Extension | Incumbent comparison and implemented behavior | Source |
| --- | --- | --- |
| Life and score resources | A native definition list adds `ชีวิต` beside credits and energy, using the existing muted label, 26px bold value and tabular numerals. The value shows current/max life. Survival score reads `รอ Collector` before final results; the encounter header describes an all-dead ending rather than a fixed three-encounter cap. | `src/appraisal-client/App.tsx:103`; `styles.css:7` |
| Zero-energy guidance | The existing notice treatment explicitly keeps portal and recovery access available at energy 0. Inspection, appraisal, purchasing and activation controls disable when their actual energy cost is unavailable. Life is not offered as a substitute. | `App.tsx:115`; `components.tsx:19`, `:51`, `:140` |
| Merchant recovery | A heading, cost/limit paragraph and native secondary button state the resource, credit price, maximum recovery, no energy cost and once-per-encounter limit. Pending events, insufficient credits, completed turns and a full target resource disable commitment. The existing button supplies the 44px minimum height, 6px radius, bronze stroke, hover fill, focus outline and disabled opacity. No dedicated recovery styling or component primitive is introduced. | `App.tsx:120`; `styles.css:5` |
| Permanent spectator state | The existing notice uses explicit death and permanent-spectator wording. Portal/appraisal action regions are omitted for paused seats; remaining actions use the inactive gate. Player summaries distinguish remaining life and spectators. Dead seats have no reveal-continuation button; their goods, credits and score statuses wait for collection. | `App.tsx:76`, `:80`, `:114` |
| Intermediate reveal | Existing results typography explains the one-life encounter attrition and that scoring awaits the Collector. Living players confirm continuation; dead players receive spectator text. Timed/untimed waiting remains mode-specific, and spectators do not block advance. | `App.tsx:80`; `docs/plan/Survival_Collector_v0.5.md` |
| Collector settlement | The existing horizontally scrollable table supplies caption, scoped column/row headings, dividers, wrapping player names and tabular values. Rows separate held-item value, remaining credits, signed score percentage and total score. Native disclosures itemize each player's collected goods, true base, authenticity, curse, item points and score statuses; empty goods receive explicit text. Shared top scores remain shared winners. Existing host rematch, audit download and leave buttons remain available. | `App.tsx:80`; `styles.css:9` |
| Score consequences before commitment | Survival-aware copy appends conditional B10/D10 Collector effects to direct and cross-shop contracts, E08 merchant terms and relevant event choices/costs. Removal and last-charge consumption explain losing the modifier. Existing mechanical effects and durations remain visible. Rules use B10's actual catalog name, **คนกลาง**. Acquired-status disclosures explain frozen status age after death. | `components.tsx:43`, `:90`, `:156`, `:159`; `model.ts:8`; `App.tsx:12` |
| Private knowledge and compatibility | Existing item-fact controls still use viewer knowledge and name unknown facts. Survival projections expose `history:[]` and `accuracyBonus:0` until final RESULTS, closing the two identified hidden-value leaks while retaining private server/audit history and final Collector disclosure. The helpers, contracts, Rules and results branch on survival context, preserving historical v0.4 pause, score and three-encounter copy. Artwork continues to identify kind without revealing authenticity or curse. | `src/game/appraisal/views.ts:23`; `components.tsx:9`; `model.ts:8`; `App.tsx:12`, `:92` |

These are task-specific combinations of existing primitives. Native recovery sections and Collector disclosures do not require regenerated sidecar previews. No material primitive mismatch was found in this scoped source comparison. Numeric survival settings remain playtest experiments, including life 6/max 6, entry energy 1 when available, restorative healing 2 and B10/D10 +20%/−20%; they are not validated balance or newly approved visual tokens.

## Evidence and limits

The independent receipt `docs/validation/survival-v0.5-review.md` records a focused **ship** verdict after one bounded correction batch: **F1 resolved** for commitment-point scoring terms and the B10 name; **F2 resolved** for hidden-value history and accuracy projection. Its independently executed survival suite passed **27 tests**. This documenter compared the resulting source and inspected the receipt and delivery artifacts; it did not rerun the runtime suite or begin another defect search.

The final delivery records now go beyond the review receipt's earlier pending LAN/build status:

- `docs/validation/survival-v0.5/tests.txt` records **349 passing tests**, with no failures or skips; `focused.txt` records **27 passing survival tests**, including F1/F2 regressions. `build.txt` records successful server TypeScript and both production client builds.
- `docs/simulation/survival-v0.5/summary.json` records **120 seeded runs**, four policies across 2/3/4 seats, strict replay and **6–16 encounters**. It explicitly leaves human fun unvalidated.
- `docs/validation/survival-v0.5/lan-check.json` records six synthetic LAN-address runs at `http://192.168.10.150:3107`: timed and untimed 2/3/4-seat rooms, all reaching RESULTS with strict replay and rematch reset. Their encounter counts are respectively **16/18/10** and **12/8/8**. Requests were paced at 75ms; the earlier unpaced burst hit the existing transport guard, whose behavior was retained.
- `docs/validation/survival-v0.5/final-assets.json` records 21 served bundle/art/font assets with MIME, byte counts and hashes. The delivery check compared those served bytes to the final build; this is transport evidence, not image or font rendering approval. `cli-check.json` records 12 historical/current CLI replay checks and nine mixed reports; the mixed report explicitly cannot establish human participation, enjoyment or voluntary rematches.
- A read-only comparison during this handoff matched all **163 existing file entries** in `docs/validation/survival-v0.5/source-sha256.json` against current bytes. That check binds the inspected source and preserved assets to the delivered evidence without implying execution of those tests by this documenter.

The user's **“หยุดตรวจภาพ ใช้ผลตรวจเดิม”** instruction remains binding. This pass opened no browser or image viewer and performed no screenshot, raster, rendered-layout, device or accessibility interaction QA. Source declares focus, disabled states, native labels, table/disclosure semantics, wrapping, themed browser surfaces and a reduced-motion override; those declarations do not prove current contrast, computed spacing, font shaping, breakpoint fit, crop quality, focus order or screen-reader behavior. Previous captures do not certify this extension. Neither the source verdict nor the synthetic runs establish final art fidelity, approved branding, balanced survival duration or human enjoyment.

## Preservation and pre-existing drift

Before/after SHA-256 values are identical:

| Preserved artifact | SHA-256 |
| --- | --- |
| `DESIGN.md` | `40249653dfcf6b2fbb57192b074c0c48dd6d816a63f8a2e6bbcf99bd49c97d3e` |
| `.impeccable/design.json` | `9238a0f36541673cfc806c2a8ced05e9bcce1ae575775c4093e3804d8815f438` |

The pre-existing `config-build-path-unset` context finding remains: `.impeccable/config.json` is absent, so future Persuade/Experience work has no recorded comp-first/code-first preference. This Operate extension and Read handoff use the established code-led direction. The finding is reported without repair or a new branding interview. The implementation parent reports an existing design hook with repeated-edit throttling; this documenter ran no additional detector and added no ignores.

The only authored project file in this handoff is `docs/art/appraisal-v0.4/survival-documentation.md`. No source, product, plan, root design, sidecar, process, service or archive was edited. Local graft may refresh its generated index before answering code queries. This receipt completes the ordinary-extension documentation handoff at the source/evidence scope above.
