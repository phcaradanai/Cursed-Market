# Acceptance evidence — continuity goal

Status: **in progress**. A checkpoint commit is not completion. The preceding goal turn made progress by committing the isolated app, governance and test infrastructure; it did not satisfy pixel approval.

| Requirement | Authoritative evidence | State |
|---|---|---|
| Audit repository, screens, architecture and Git history | audit.md; migration-origin.json; screen registry/captures; starting HEAD789ab3d and checkpointd91b4d5 | documented; unrelated root changes excluded |
| Verify Hindsight recall and retention, report failures | memory-health.json contains retain ID and matching read-back; audit.md records marker normalization and broad tag results | verified for that session, never assume future availability |
| Derive design system from established approved patterns | design-system.md + decisions.md UI-01–04; current inventory/status/menu source and historical user corrections | documented; no new identity approved or introduced |
| Propose reconciliation; approval for material changes | audit.md reconciliation table; decisions.md ARCH-02, QA-02 | engine unification / broad restyles excluded pending separate approval |
| Future agents read docs, inspect peers, reuse tokens and verify | root AGENTS.md; README.md; generated main HTML links | versioned in checkpoint |
| Safe shared component/token reuse | apps/comic/src/appraisal-client/comic-tokens.css + comic-frame.css and existing ComicMenu/ComicButton/Share handlers; source fingerprints | extracted existing values; engine/legacy folders preserved |
| Repeatable consistency assertions | npm run ui:test; contracts.mjs; negative8/12 gap, off-centre, unknown facts and frame tests |7 checks pass including DPR masks and shared header geometry |
| Screenshot baselines and visual regression | browser-suite.mjs; manifests; raw reports; review.html | candidate approval pending; DPR1 raster instability under investigation, same-width DPR2 probe matched, but full cross-width comparison still fails |
| Preserve existing functionality | import fingerprints; focused root81, comic SSR4 and blood-pact/journal4; compiled server/client; full comic test run | focused proof passes; all63 runtime source hashes unchanged; focused12 tests11 pass/1 historical markup failure; full run stopped after verified CPU-bound work |
| No unrelated redesign | scoped commit; no root src/tests/.impeccable staged; shared menu appearance retained | preserved; pixel evidence still needs final gate |
| Approved baselines pass | candidate approval field and independent comparison report | **not yet proven**; agent cannot self-approve |
| Docs updated; verification honestly reported | verification.md, roadmap CONTINUITY-01, PROJECT-CONTEXT.md, main generated HTML | current checkpoint; update with final outcomes |

Image fixture correction is a test-environment change, not a product redesign: DPR1 repeated enlarged potion raster differed2249px at identical CSS geometry; DPR2 repeated navigations changed0px (channel noise≤1). Pin the chosen DPR, verify physical PNG dimensions and scale only timer masks. Do not mask artwork or relax the existing0.1% / channel8 threshold. Retain failed reports and superseded candidate status.

When every row is supported, obtain the outstanding human review and rerun relevant gates. Only then mark the goal complete. Do not use a partial screen suite to claim all game behavior or every mobile state has been tested.

Continuation correction: native DPR2 is **not** a sufficient solution; the full14-case comparison passed10/14 and warm loads still drift across widths. Baselines and DPR1 restored to checkpoint; no human approval implied. Header height/border assertions were added and all14 recorded cases pass them.

Menu interaction gate now proves18 real fixture flows on three desktop widths, including computed inner padding, control height/radius, single utility visibility, item restoration, clock preservation and no overflow. See menu-smoke.json. This does not resolve raster reproducibility or image approval.

Portable-art follow-up:46 art files/manifest SHA checked from a working directory outside the repo; one stale provenance assertion reconciled with original/v2 formats while retaining all checks and adding per-merchant mood completeness. Historical UI file improves60/67→61/67. Source fingerprints now359, including the art manifest. No production app or asset changed. Pixel/approval rows remain incomplete.
