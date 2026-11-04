# Verification — current evidence 2026-10-30

Continuity acceptance gates pass against the exact user-approved references. Root provenance gap resolved with the explicitly approved separate source commit4548562 and a Git-export check. This is not a full-game simulation or balance verdict.

- Human approval: exact14-image set approved2026-10-30; image hashes sealed in `baselines/manifest.json`. The approval does not permit unrelated redesign or waive test failures.
- Visual comparisons: `compare-approved-pass-1.json` and `compare-approved-pass-2.json` each pass14/14. Maximum changed-pixel ratio0.0000794405833, below unchanged0.001 limit. Reference images unchanged; only countdown masked. Current samples settle before a single reference comparison; failures are not retried against references.
- UI contracts:10/10 tests pass, including unequal spacing/off-centre controls, unknown-fact privacy, approved-reference overwrite protection and fresh CLI failure receipts. Deferred-paint test fails with old five-sample preparation and passes with bounded ten-sample/two-paint preparation. Stable changed artwork still fails reference comparison.
- Functional affected suite:79/79 pass, including67 historical client cases and4 trade-price cases. Exact quotes/payments, consent, unknown facts, duplicate receipts, selected appraisal and phase utilities remain asserted. See `historical-ui-tests.json` and `functional-continuation.json`.
- Real preview interactions:18 menu flows at1024/1440/1920 pass shared frame/header/control symmetry, same-menu close, selected-item restoration, no clock reset and no scrolling. See `menu-smoke.json`.
- Preservation: all63 imported comic runtime files retain migration hashes;46 artwork files pass portable provenance tests;359 source/static fingerprints. No production UI, rule or art changes in this follow-up.
- Memory: initial same-ID retain/recall probe plus actual baseline-approval retain, scoped recall and direct-ID retrieval verified. Broad mixed query returned irrelevant history; use explicit project tags and `tags_match:all`. Repository files remain authoritative. See `memory-health.json`.
- Browser: original space3 missing; user approved replacement space4. Failed bootstrap is not counted as a visual result. Fresh successful invocation receipt: `compare-approved-pass-2-invocation.json`.

## Root-source handoff resolved2026-10-30

User explicitly authorized a separate aged-interest commit. Commit4548562 includes the five root source files and three vault-related test files; the separate E43 network assertion remains untouched. Server build, appraisal-client typecheck and29 focused tests pass, including9 aged-interest cases and legacy4% compatibility.

Exported the committed Git tree into a fresh temporary directory and ran the Atlas checker there:106 inputs and all generated outputs match, including49 root runtime inputs. Source/art/docs came from Git, not the dirty worktree; installed dependencies were reused by symlink, so this is not a fresh npm-install or network proof. See `root-provenance.json` for exact revision/output and the retained earlier finding. Comic runtime remains isolated; this commit does not claim10% integration into comic.

## Verification limits

No full simulation-suite, live multiplayer, phone-portrait or game-balance pass. Full simulations were CPU-bound despite Node timeouts; do not repeat without an external wall-clock bound. Trail reports pre-existing unrelated `.impeccable` conflicts and a large-diff coverage cap. Historical failed attempts below remain evidence; they are superseded only by the explicitly dated current results above.

## Historical attempts (superseded where current evidence says so)

Current status: **in progress**.7 Node contract tests,18 preview menu flows,359 source/static fingerprints and106 atlas inputs pass; all63 imported runtime files are unchanged. Pixel reproducibility and human image approval remain open. No full functional-suite pass is claimed.

## Passed evidence

- Explicitly authorized comic relocation into apps/comic,364 source/config/test/assets files preserved at import (230MB). Root realistic/cabinet source untouched by this task. Import hashes are in migration-origin.json.
- Root focused UI/secure-client/rarity tests:81 passed (log summary retained). Comic continuity4 SSR tests passed; existing blood-pact/journal4 passed. Build:comic passed with existing bundle-size warning. Guarded DarkMarket SSR initializer without changing browser behavior.
- Node UI contract/pixel helper tests7 passed. Negative regression detects prior8px/12px gap, off-centre input, frame drift and hidden facts. PNG comparator detects changed pixels and timer-mask behavior.
-14 screenshot candidates captured with measured geometry. Same frame inventory/shared menu/sale on1440×722,1024×800,1920×800. Sale centre1067 equals both action-pair and input centres at1440; gaps12/12, +/-40×40, heights40/40/40, zero overflow. See record.json and baselines/manifest.json.
- Hindsight synchronous retain and read-back same ID verified; see memory-health.json.

## Pending / failures, not green by assumption

- Stable-raster candidate recapture passed14/14. Independent compare passed13/14; narrow sale capture did not settle within five samples. A targeted narrow retry passed status and sale, but inventory showed0.279% pixel drift in enlarged potion artwork. No full visual-green claim; see compare-first-stable.json and compare-narrow-retry.json. Candidate capture is not image approval; explicit human review is separately tracked in decisions.md/manifest.
- First capture attempts hit browser screenshot timeouts; load readiness and bounded read-only screenshot retries were added. Layout/pixel failures are never retried or rebaselined automatically.
- Full legacy and comic suites were stopped after long-running attempts without a final result. Do not claim either full suite passes.
- Imported legacy comic client assertions: initial63/71 pass,8 failures. After SSR guard a further historical-client run reported60/67 with7 failures (different selected set); remaining exact cabinet text/structure and old artwork manifest assumptions are not accepted current comic baselines. They are reported, not rewritten to hide failures.
- No live multi-player transaction or phone portrait proof in this audit. No gameplay rule unification, global screen redesign, or update to unrelated dirty root code.
- Whole-branch Trail check has known existing conflicts in .impeccable; it is not a green gate for this task.

## Re-run

`npm run ui:check`, `npm run ui:test`, `npm run build:comic`, `npm run ui:visual` (with the comic Vite server and matching browser available). Functional continuity: `npm --prefix apps/comic run build:server` then `node --test apps/comic/dist/tests/comic-continuity.test.js` (run old tests from their own app cwd). A missing tool/environment is a failure to report, not permission to skip silently.

### Raster comparison investigation (2026-10-30)

The first comparison passed10/14; the next passed8/14. Differences were concentrated within merchant/item artwork, while measured frames and sale geometry passed. Initial candidate status portraits were visibly softer than subsequent captures. Image completeness alone did not prove final decoded/composited pixels. The capture gate now awaits image decoding/two animation frames in a foreground page and requires two consecutive matching screenshots (timer excluded), bounded to five samples. It never relaxes pixel tolerance or masks artwork. Stable candidate recapture passed14/14; independent comparison outcomes are above; these are still not human-approved images. The transient candidates are superseded for capture readiness, not accepted as product regressions.

`git diff --cached --check` reports inherited trailing spaces/CRLF in imported source, font licenses, historical patches/CSV and generated atlas output. They are preserved to avoid rewriting provenance/license/history; no whitespace-clean claim.

Latest atlas check passed106 inputs. Static continuity check passed358 source fingerprints, shared token/frame/SSR rules,14 baseline hashes, dependency parity and tracked documentation. Trail check found20 lexical conflicts in pre-existing unstaged .impeccable files and checked only the first400KB of this large migration; those files are excluded from this commit. This is not exhaustive Trail approval.

## Continuation evidence — 2026-10-30

- DPR probe: same CSS image bounds, repeated DPR1 navigation differed2249px (0.276%, maxDelta35); DPR2 matching native display yielded0 changed pixels on both pairs (maxDelta1). See raster-investigation.json. DPR2 was tested as a fixture, with physical dimensions=CSS×DPR and scaled timer masks; UA+DPR must match on comparison. No product styling changes or threshold relaxation.
- Full DPR2 candidate record passed14/14 after same-page recovery. First2x attempt had renderer timeouts while4 full-test child processes consumed CPU; retained failure classification, no partial candidate manifest update. Independent compare pending.
- Focused functional rerun:12 tests,11 pass/1 fail. Continuity4, E1093, journal1 and price3 pass; existing “both trading seats compare” test fails its old UI markup expectation. See functional-continuation.json.
- Migration runtime preservation: all63 imported src/game, src/shared and src/server files still match import SHA256 byte-for-byte. The continuity task did not alter game logic.
- Full comic run with test-timeout90s/concurrency4 remained live at4m, with4 CPU-bound children (bots,brokerage,event-choices,expansion); timeout did not bound synchronous work. Stopped only verified own PIDs31747/32082/32083/32142/32177. No full-suite result or gameplay-balance claim. Do not repeat this expensive full run without an external wall-clock runner or a separate investigation.

- DPR2 full independent compare passed10/14, with artwork drift in trade1440, inventory1024/1920 and status1024. Alternating-width warm-load probe still differed15320px at1024 and3814px at1920; native DPR and double loading are ruled out as sufficient fixes. Restored the checkpoint DPR1 candidates/fixture to avoid replacing reviewed artifacts with an unproven environment change. Cross-navigation raster stability remains open. Geometry/header contracts pass all14 recorded cases and7 Node tests pass.
- Current historical UI test rerun:60/67 pass,7 fail. Provenance failure is20 item manifest entries vs old expected10 (not a missing file). See historical-ui-tests.json. No tests disabled or expectations weakened.

## Repeatable menu interaction proof

`node scripts/ui/run.mjs --space3 --mode smoke` passed18 flows: six utility menus at1024×800,1440×722,1920×800. It uses actual preview handlers, loads visible art, checks shared frame, header65px/border1px, symmetric12/18/12/18px header padding,40px header actions,10px corners, exactly one visible utility, same-button close, preserved sale item, positive fresh countdown with no reset, and no page scroll. See menu-smoke.json. Repeat with `npm run ui:smoke`; this is public fixture UI proof, not a live multiplayer transaction.7 Node contract tests pass; all14 retained baseline metrics satisfy shared frame/header contracts. Main generated HTML now labels active source separately from historical build origins.

## Portable artwork provenance correction

2026-10-30: verified46 legacy display art files from /private/tmp using the compiled test, not the app working directory. All SHA hashes match. The manifest holds10 item families with original/v2 art (20 files), not20 gameplay kinds; originals36 carry the fidelity PNG metadata while10 v2 items record generator provenance in the manifest. Test now checks both formats and each of8 merchants has exactly angry/idle/smile. No image bytes or gameplay changed. The portable target passes1/1; full historical UI file now61/67 with6 unchanged failures (previous60/67). See asset-provenance-verification.json and historical-ui-tests.json. Build:server,359 source checks (including manifest) and7 UI contract tests pass. This does not resolve image approval, raster determinism, or the full simulation suite.

## S08 implementation follow-up2026-10-30

User approved salary-v01 implementation. See ../game-design/implementations/S08-reward.md and s08-verification.json: six actual fixture cases at1024/1440/1920, same frame as inventory, equal columns/headings/actions,48px paired decisions,65px common header, symmetric24px padding (18px in short desktop), no page scroll, menu toggles/clock preservation and paged prediction persistence. Focused83 reward/client tests and10 UI helper contracts pass; build:comic passes with existing bundle warning. Game/shared/server source unchanged.

Original14 approved baselines pass after shortening new preview labels to preserve the existing toolbar width. Initial13 failures were dominated by toolbar displacement (rules content/dock had0 changes); baseline files were never changed. See s08-baseline-before-toolbar-fix.json, s08-baseline-compare.json and matching invocation receipt. Prior broad i18n suite4 failures reproduced in committed4548562 source; scope and28 missing keys remain documented, not counted green. S08 example buttons do not prove live payment. New C29/C30 captures are current UI evidence, not new approved baselines.

## S09 implementation follow-up2026-10-30

2026-10-30 S09 implemented after user authorized concept + implementation together. Reuses inventory ComicPhaseFrame, common header/buttons and equal columns; paged custody shelves, centered equal44px money controls and one ready action. C31–C33 record normal/full/empty actual fixtures, not live payment or separately approved pixel baselines. Final zero-result toss remains mounted until animation ends. Comic4% and root aged10% remain separate runtimes; no engine rules changed. Verification: focused104/104, UI contracts10/10, original sealed baselines14/14, peer menus18/18 and S09 browser9/9 at1024/1440/1920; synthetic incoming-DTO animation passes. See implementations/S09-vault.md and docs/ui-system/s09-* reports. Known broad i18n4 failures remain; no full simulation/live multiplayer/phone/balance claim.

## Comic spirit-world S11/G01–G04 — 2026-10-31

See [current machine-readable evidence](ghost-functional-verification.json) and [raw test results](ghost-test-results.txt). Core15/15, two-socket1/1, focused client20/20, UI contracts10/10, ghost geometry15/15 and utility menus18/18 pass. Latest production comparison14/14 has a matching fresh invocation receipt; approved baselines unchanged. Server/client builds pass with the existing bundle warning. Atlas123inputs is current. Earlier live browser proof covers unlock/watch/reload/hire/accept/actual RPS search/delivery; quoteId and acquisition metadata hardening are covered by latest core/network/replay tests, not falsely attributed to the earlier capture.

One old NPC display-name TypeError reproduces on39ec327. Trail reports20 lexical conflicts only in excluded pre-existing .impeccable files and a400KB coverage cap. No full simulation/balance/mobile or new56 integration claim. The normal latest game runs at3189 using the ordinary appraisal-main flags;3188 is an explicitly separate acceptance fixture.

## Whole-game status audit — 2026-10-31

Documentation-only follow-up: added `game-design/game-status.json` to the main HTML, reconciled stale roadmap/context statements, and explicitly separated root10% aged interest from active Comic4% current-balance interest. Added source assertions for both rates, new56 binding count, rendered status rows and evidence-file existence. Atlas generator/checker pass131inputs, including relevant active Comic source fingerprints; this does not change the base root extraction into a full Comic-wide snapshot. No gameplay/UI-art change or new full-game test/balance result is claimed. Previous ghost evidence remains scoped to S11/G01–G04.

## Whole-game checkpoint RULE-01 — 2026-10-31

Comic now uses approved10% aged principal in new runs; no-flag audits retain4%. See comic-interest-verification.json and raw comic-interest-test-results.txt.54focused cases and nearest ghost2socket1pass;11interest cases include full phase-to-results strict replay and empty/missing-vault Thai/English rule copy. Server/client builds, UI contracts10, approved visual14 and menus18 pass. Fresh CLI receipts match latest reports. No new baseline or layout style. Goal remains active; next forced-RPS missing-hand rule is user-approved but not yet implemented. Browser space10 remains active under explicit continuous-verification authorization; Ego upgrade remains separate.


## 2026-10-31 — forced RPS checkpoint

Approved active-duel Comic frame is implemented with shared inventory bounds. [Report](forced-rps-verification.json): focused73/73, two-socket1/1, timers10/10 (Comic cwd), UIcontracts10/10, source375, baseline14/14, menu18/18, new-duel geometry3widths. Fresh detailed visual/menu reports match their invocation receipts; no baseline replacement. C39 is a fixture capture with source hashes, not a new approved pixel reference. Initial browser harness navigation collision/ambiguous selector and timer wrong-cwd failure are recorded; sequential reruns pass. Target selection/closed results retain old expanding layout and remain an explicit UX gap. Whole-game completion/balance is still unverified.


## 2026-10-31 — merchant expressions S02/S04

Shared rules now use confirmed portal selection and public appraisalAccepted, not trust.650ms portal response is presentation only; reduced-motion skips it, duplicate/current selected snapshots do not replay it, and server deadlines continue. [Report](merchant-expression-verification.json):20/20 targeted including command-driven outcomes;3 mounted sequences/24poses/reduced-motion,14/14 approved visual comparisons and18/18 menu flows. Broader suite118/120 has2 old tests reproduced against parent a2102fb (obsolete exit label; removed details.notes history markup). Do not report this broad suite as passing or treat these failures as new. Existing cover/bottom clipping unchanged; no new anatomical pose calibration.

## Native pilot8 — 2026-11-01 checkpoint

New IDs/own art and8 approved primary effects run only in opt-in catalogVersion4; default3 and root preserved. See [pinned source and results](../game-design/new56-pilot-verification.json).29 native cases pass including all8 lifecycle paths,168 related regressions pass,1 actual network/reconnect/retry/full-run replay passes,8 paired survival replays reach Collector. No full-suite/whole-game/balance claim. CPU-heavy simulation-name cases were excluded under the documented wall-clock rule.

Native GameTable/Inventory fixtures pass10 states (8 at1440, caliper additionally1024/1920). Corrected the proof import to the current Vite root /validation/ after inspecting a failed old-path request. Separate fresh approved-baseline compare14/14 and18 menu flows pass; matching exit0 CLI receipts and detailed reports are copied in docs/validation/new56-pilot-2026-11-01. No reference re-record or pixel approval expansion. UI source check385 fingerprints and10 contract tests pass; client build passes with the existing large-chunk warning.

The network test first tried to export a private audit during a live match. Production correctly rejected it; final test asserts that rejection, continues the match to RESULTS, then exports and replays. Existing JPEG-art test assumptions were migrated to the already-approved Comic PNG/family implementations, while new IDs retain distinct-art assertions. Trail still flags20 lexical matches only in excluded, unrelated .impeccable changes. New native sources and tests are covered by the verification hashes and central Atlas; remaining48 and full game remain open.


## 2026-11-02 — forced theft target/history follow-up

[Current report](theft-desk-verification.json):78 focused,174 related,1 real forced socket,10 UI contracts,386 source fingerprints; target/history3widths,4 phase-boundaries, forced3widths and10 native pilot states pass. Fresh matching exit0 receipts prove14/14 approved pixel comparisons and18/18 menu flows. No baseline re-record. Default preview omits secure economy; separate explicit secure/core2 public DTO proof covers new UI. Three native UI source hashes repinned only after affected compatibility; gameplay hashes and original707da16 backend/paired reports unchanged. Earlier CDP timeouts, sandbox bootstrap failures and void-return summary bug are recorded as harness/environment failures, not silently counted as passing. No full-game balance/mobile/full CPU-bound simulation claim.

2026-11-02 Collector A05: see ../game-design/collector-wishlist-verification.json and collector-wishlist-ui-verification.json. Shared frame12 candidatecaptures/3widths +10 mountedchecks,25 UI functional,14 approved comparisons and18 menus pass. First preview-toolbar drift and historical cabinet assertion are recorded with corrected evidence; no baseline re-record or new image generation. Main new rooms rules1; old explicit no-flag runs preserved. Final branch review pending; whole-game goal remains active.

## Collector reviewed followup — 2026-11-02

2026-11-02 Collector review completed (frozen10629f2..7ab2a39); Important public-offer contamination fixed via shared market/Spirit source filter with failure-first tests. 235 scoped regressions,7 actual network cases,24 historical+2 Collector replays,8 native effect pairs/16 runs/32 replays pass. Real App request/peek/confirmed purchase/owned item/RESULTS replay verified with500-credit/20-life fixture, not normal40/6 balance. UI-COLLECTOR-CONTEXT minor deferred: initial event hides request catalog entry until resolved. See collector-offer-isolation-verification.json and implementations/collector-wishlist-review.md. Whole-game goal remains active; remaining48, STRAT, awards and broader normal-budget balance remain open.

UI production code and generated preview bytes remain unchanged from7ab2a39; previous14 approved pixel/18 menu receipts retain their exact UI scope, not fresh post-fix runs. Five real-App captures C54–C58 record viewport1440×722,DPR1 and PNG dimensions. No baseline replaced. Hindsight retain+retrieval works, but scoped recall also returns unrelated untagged facts and an observation shortened a SHA: memory-health.json records limitations; Git remains authoritative.

## Normal-main evidence — 2026-11-02

2026-11-02 normal main evidence: realApp40credit/6life/defaultclock request2/delivery4/peek1/confirmedbuy/owneditem/RESULTS6 strictreplay pass; public setup held spending beforedelivery. Matrix8 normal-config runs (2/4 seats,cautious/trader,catalog3/4,same deterministicseed) allRESULTS/replay, ends5–8.5Collectorpaid,8auctionwins andPvPtrades observed; no vault/interest/PvPloan/forcedRPS/ghost-service coverage. No balance/numeric change. See normal-play-verification.json and balance-reports/2026-11-02-normal-play.md. Whole goal active, remaining48/STRAT/awards pending.
No runtime/UI/CSS/assets changed. Existing393 source/14 approved baseline hashes are unchanged; screenshots are live evidence, not baseline replacements. Initial browser-harness expectation failed on valid later cautious skips; first3 actualUI actions stay exact, later commands constrained to skips. Current run5checks/5captures; raw preliminary failure retained with obsolete capture references removed explicitly.

## Normal-resource service and scoring direction — 2026-11-02

2026-11-02 normal-resource command journey: exact main40credit/6life/deadline15 catalogue4pilot8, selectedseednormal-service-2,196commands/9checks. Deposit10/topup5/new-firstwithdraw/agedinterest1, real bought collateral loan funding+repayment, naturaldeath, public card tracking, realRPS/3slotloss/waitnextencounter,21credit delivery/bonus2/RESULTS7/strictreplay. Related44+network1 pass; network uses200/death/slotfixtures and is not combined normal live evidence. No runtime/UI change; see normal-service-verification.json. Whole goal remains active.

2026-11-02 user scoring direction supersedes pending best-path-only question: every player gets personal contributions across systems; sale quantity and gross sales credits are separate score components; merchant trust uses cumulative positive gains throughout game (not final trust). End summary reveals systems sequentially with colored growing bars. Timing remains simultaneous atCollector. Weights/caps/anti-farming and old leader bonus coexistence not yet approved; do not implement invented scoring or replace cumulative trust with peak/final values. See personal-scoring-direction.json and proposals/personal-system-scoring-v1.md.
Current UI/component/CSS/art and source393/baselines unchanged. No new generated art or scoring UI baseline; presentation direction recorded, implementation still pending approved numeric/anti-farm specification.

## Personal score proposal — 2026-11-02

2026-11-02 personal scoring concrete experimental package prepared: proposals/personal-scoring-rules-v1.md and personal-scoring-weights-v1.json. Every-player contributions/sale count+gross volume/cumulative trust already approved; numeric weights/caps, origin eligibility, replacing old leader bonuses, applyingB10/D10 to performance, and final rarity for deadplayers are explicit proposals awaiting approval. One independent builder check completed; tuple/death-scope questions resolved as proposed choices, not prior user decisions. Offline5audit/14player partial sales/trust illustrations reconstructed originalaudit exactly; trust per-command delta is incomplete/unfiltered and not canonical cumulative score. No runtime/UI changes.
No component/token/CSS/asset/preview changes, no pixel baseline promotion. Existing source393/14 reference hashes remain unchanged; required UI implementation gates follow only after package approval.

Proposal verification: offline5audits reconstructed exactly/14players, proposal+source+input hashes and14distinct metric definitions checked; numeric examples183/141 checked. ui:check393/source+14baseline hashes, ui:test10 andAtlas213 pass. No pixel rerun for docs/offline-analysis-only work. Trail check retains20 conflicts solely unrelated .impeccable cache/design files excluded here, with400KB diff cap; not full-branch review.


### 2026-11-03 approved personal scoring checkpoint (supersedes pending wording above)

User explicitly approved the exact experimental package at1551908: see `../game-design/personal-scoring-approval.json` for immutable proposal hashes. Every-player weights/caps, eligibility, leader replacement, B10/D10 on ordinary performance and final-custody rarity including dead are approved; do not ask again. Working-tree Task1 domain/config draft passes13 tests, but canonical runtime counters, final scoring/DTO and Comic graph are not implemented or enabled. Historical audits:38 exact replays pass,8 fail; parent comparison is recorded separately. Broad suite reached35s external wall limit;6 assertion failures reproduce by name on pristine1551908. No all-green/full-game claim. Evidence: `../validation/personal-scoring-2026-11-03/checkpoint.json`; continuation: `../game-design/implementations/personal-scoring-plan.md`. Current goal reports `usageLimited`; Task1 remains in progress, not complete. Source fingerprint/public pilot acceptance checks require refresh after compatibility proof; existing screenshot baselines remain unchanged.

Checkpoint update: domain13/13 and UI contracts10/10 pass. `ui:check` fails source inventory drift; Atlas build rejects stale pilot engine fingerprint. Partial generated output restored, so main HTML remains historical until compatibility proof and guarded rebuild succeed. Do not claim HTML/current-source acceptance or refresh evidence hashes without proof.

2026-11-03 resumed: fresh8 native public-effect pairs/16fullruns/32replaychecks pass with all16 audit bytes unchanged; domain13pass. Source manifests repinned only after that compatibility proof. Producers/finalscore/DTO/graph/default activation remain pending. Supersedes earlier usage-limit/source-guard checkpoint; no new screenshot approval or full-game balance claim.

Task1 final gate:96 focused tests (including13domain), server/clientbuild, ui:check395, ui:test10 and guarded Atlas217inputs pass. MainHTML now regenerated with approval/current Task1 source. No canonical event producers/final score/DTO/graph/default activation yet; Task2 next. trail check reports20pre-existing conflicts only in excluded .impeccable cache/design files,400KB branch cap; no claim clean full-branchcheck.

2026-11-03 Task2 progress: canonical personal score receipts/final snapshot connected under opt-in personalScoringRules1; main default remains off. Domain+runtime29pass, actual2/4seat sockets3pass at40/6 with duplicates/resume/privacy and strict ended audits; broad226pass/1old notes-markup failure reproduced on1551908, expensive simulation cases omitted. Historical40exact replays pass/8same old failures; native8pairs/16runs/32checks retain16auditbytes. Task2 completion matrix still open (route/copy/custody coverage, owned reappraisal/cap semantics); Task3 selfDTO/Comic graph not implemented. See ../validation/personal-scoring-2026-11-03/runtime-checkpoint.json. No fresh pixel approval or release-balance claim.

2026-11-03 personal scoring Task2 eligibility/runtime verified:40scoring tests +3real2/4seat socket cases; broader237pass/1oldnotesmarkup failure (CPU cases omitted). Normal40/6 public196command journey naturally ends7, includes spirit mini-game/hire/RPS/delivery, correct ghost bonus2 and strict replay; immediate loan eligible0 intentionally.43historical replays pass/8same1551908 failures; native8/16/32 and original normal audit remain byte-identical. Theft now dedups origin, legacy cash positive transfer records, owner/NPC first appraisal shared, copies do not consume original rights, actual HP cap loss counted before final freeze. Confirmed rules section7/Atlas supersede old leader awards. Task3 selfDTO/Status/Comic graph/default remains pending; fullgame/48/balance/ghostbrowser issue remain. Evidence: ../validation/personal-scoring-eligibility-2026-11-03/verification.json.

2026-11-03 personal scoring UI: exact approved1551908 experiment now enabled for actual Comic main new rooms after48focused domain/runtime/eligibility/SSR/socket/main-entry checks,13new screen checks at1024/1440/1920,18peer menus and14sealed pixel comparisons. S13 uses shared inventory ComicPhaseFrame/ComicButton/Tooltip,9local playback stages and paged14metric details. Live Status consumes server known-only range; hidden appraisal receipts stay unresolved untilend, final score frozen. Six end menus readonly; legacy/no-flag fallback retained. C64–C72 are candidates, not promoted baselines. See implementations/personal-scoring-ui.md and docs/validation/personal-score-ui-2026-11-03. Independent final review,48remaining catalog effects/numbers, normal fullgame browser reconnect/ghosttracking scroll and multi-seed balance still outstanding; whole-game goal active.

2026-11-03 independent scoring review4e3fe94: notready;6Important+4Minor. Owner fix pass reproduces12runtime failures then passes12/12 and60total non-network scoring/SSR cases; actual paid E44/bond/liquidation/consignment, exactNPC/sealHP, personallylearnedfacet deltas, configguards and private nestedIDs corrected. Rank/tied-rank/modifierreason/negativefixture and currentrules wording corrected. Server/client builds and8nativepairs16no-flag games32replays pass; normal196command current audit replay passes. Fresh Browser/socket/commit still pending because automatic approval review could not run (usage limit, not a safety decision). Prior captures C64–C72 and14pixel receipts remain historical, not fresh proof of changed labels. Pre-review scoring1 experimental audits may need their pinned old source; originals preserved, no-flag bytes unchanged. See personal-scoring-final-fixes verification and final-review handoff; whole-game goal active.


## Personal scoring final owner-fix checkpoint — 2026-11-03

2026-11-03 final owner-fix verification: 67/67 scoring tests (63 domain/runtime/SSR and4 actual socket/main-entry cases), server/client builds,16 score geometry/interactions with12 captures,4 browser review assertions,18 menu flows and14 unchanged approved pixel references pass. New personalScoringFacts:2 selects corrected canonical writers; rules/weights remain approved1551908. Five unique historical scoring1/no-marker audits replay exactly, and16 no-personal native audit bytes remain identical (8pairs/32strict replays). Normal40/6/deadline15 engine journey196commands reachesRESULTS7 withghostbonus2 and strictly replays. Independent6Important+4Minor findings addressed in one owner fix pass; no second review. Earlier usage-limit block resolved after reset; no bypass. Whole-game goal remains active: remaining48 specs/runtime bindings, normal combined browser/reconnect/ghosttracking overflow and multi-seed balance are not complete. Evidence: `docs/validation/personal-scoring-final-fixes-2026-11-03/verification.json`; candidate captures C73–C84. This latest checkpoint supersedes earlier pending compatibility/Browser notes above.


## Normal service / Spirit access — 2026-11-03

2026-11-03 normal two-App service route now reaches RESULTS with196commands and strict replay: real40credits/6life/defaultclocks/pilot8, natural death, early shuffle rejection without page shift, browser reload preserving round/server startedAt, actual Status→Spirit hire/accept/RPS3losses/next-encounter/delivery (debit21once, bonus2, living phase unchanged). User approved existing Spirit entry in Status header beside Close; shared button height/gaps, no new dock or clock reset.37focused tests,3feedback widths,3preview watch/reentry widths,UI404/contracts10,18menus/14unchanged approvedpixels pass. Final harness field assertion was corrected from amount to paid; same ended run separately validated, original failure retained. This closes the observed normal-service feedback/entry blockers, not every game flow or release balance. Evidence: `docs/validation/normal-service-feedback-2026-11-03/verification.json`. Supersedes earlier ghost-tracking root-scroll and inaccessible-entry checkpoint; remaining48specs/bindings and multi-seed/full-game acceptance remain.

### 2026-11-04 recovery quote payload followup

Existing recovery button now forwards optional server quoteId; no JSX layout/style/art change. New native5/effects3 creation uses recoveryQuoteRules1, while historical configs retain old payloads. `ui:check`412pins, `ui:test`10, smoke18flows and compare14approved baselines pass. Fresh matching invocation/detail reports are copied in `docs/validation/recovery-quote-2026-11-04/`; approved baseline files untouched. Browser used authorized new TaskSpace4 after earlier space removal; initial sandbox startup failure cleared by normal elevated launch. Vite5174 already running; attempted second startup correctly refused port use, no process replaced. Dedicated live recovery button-click not tested; server two-socket stale-price/reconnect/dedup proof is separate. Existing2related survivalSSR/score-disclosure assertions remain failures, not new UI regressions; fullCPU suite not rerun.
