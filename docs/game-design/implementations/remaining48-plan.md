# Approved remaining48 Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans task by task. The user explicitly directs parallel binding for independent effects; group by disjoint source owners, do not overlap modified files, and keep shared revision/config/docs integration with the root agent. Preserve the whole-game goal after each checkpoint.

**Goal:** Bind all approved56 primary item contracts to actual Comic play, preserving old runs and shared Comic UX.

**Architecture:** Keep the frozen532dece specification and a separate approval receipt. Stage typed catalog/rule data and shared numerical primitives before introducing a new catalog/effect revision. Hook resource changes at their existing canonical settlement owners, not via UI or event-name aliases. Do not expose a partly bound catalog as the default game.

**Tech Stack:** Existing TypeScript/Node tests, seeded engine, React Comic components, existing audit/replay/Atlas/UI tools. No new dependency.

**Spec:** ../proposals/remaining48-experimental-v1.json (SHA f16175ff4bc0ad8162b56a5266552d9efc730c9681910e36684d71dba2ce7508), ../remaining48-approval.json. Pilot8 approval remains separate and frozen.

## Current checkpoint — E49/E58/E67 effects13

Current approved experimental implementation is catalog5 / native56Effects13: 56 registered, 36 primary owner-tested, 20 pending. E46 buoy interest, E33 Swarm copy value, E52 seal energy, E34 Swarm Glider reroll discount, E49 Debt Chain, E58 Vampire Shadow Wine Decanter and E67 Spore Lantern/Censer are bound; default3, pilot4 and historical revisions1–12 are unchanged. E49 tests3/3, E58 tests2/2, E67 tests3/3, E34 combined strongest-five regression passes; 32 sealed replays and 4 fixed-seed compatibility diagnostics pass. The inventory item gallery has 56/56 verified art assets. One E38 real-socket regression remains blocked by local EPERM before assertions; current UI verification is recorded separately.

Revision14 is in progress as three disjoint owner groups: E31 cooldown, E62 damage protection, E25 eligible stock creation. Keep E22 disclosure, remaining 20 owner bindings, Task4–6 active/custody/predicate/public-benefit coverage, full browser/reconnect acceptance and multi-seed 2/4-player balance open. This checkpoint is not release balance or game-complete.

## Global constraints

- All48 approved anchors,35primary contracts and9meaning selections are exact experimental rules. Optional effects stay off. Do not re-ask the package approval.
- S uses at most5 strongest eligible carried tools, stable instanceId ties; binary uses highest single instance, not summed fractional copies. Active/consume uses selected instance only. Reuse itemEffectScale/integerEffect.
- Continuous custody and real aged principal, physical/origin/player/pair/encounter/status-instance caps, actual funded bank payouts and known-info boundaries are mandatory. Transfer/reconnect/copy cannot reset rights.
- Legacy source and historical config/RNG/audit bytes remain unchanged. New56 default rollout waits for complete lifecycle, predicate, replay, UI and measured-benefit evidence.
- UI uses existing ComicMenu/Button/Tooltip/tokens/frame; no new art, duplicate images, scrolling, expanded dropdowns or unrelated redesign.

## Review focus

- Decimal copy strengths and high rarity must floor correctly and respect caps; pin Task1 numerical tests, then real owner tests in each binding task.
- Multiple owners, vault/escrow/loan custody and same-origin copies must not reset use/age; pin Task3/4 custody and replay tests.
- Retried settlement, death mid-activation and insufficient/unreserved bank money must never double-spend or mint; pin Task3/4 atomic and reconnect tests.
- Hidden authenticity/curse and blind Collector/Spirit goods must not leak through quotes, clues, statistics or logs; pin Task2/5 private DTO tests.
- Original kind/family events must not silently grant unrelated powers to new visual types; Task6 inventories gates and obtains approval for material encounter remappings rather than aliasing.

### Task 1 — Approval, typed contracts and numerical foundation

**Files:** remaining48-approval.json; scripts/build-remaining48-catalog.mjs; apps/comic/src/game/appraisal/remaining48-catalog.ts and remaining48-numbers.ts; apps/comic/tests/remaining48-foundation.test.ts; current context/Atlas.

**Interfaces:** Catalog exports REMAINING48_ITEMS (identity/name/merchant/type/anchor/nativeEffect/mode/cost), REMAINING48_RULES (exact approved numeric parameters), Remaining48Kind/Effect. Numeric module consumes PoweredItem and itemEffectScale; exposes remainingStrength(items,effect), remainingScaled(amount,strength,cap), remainingDiscount(base,amount,strength,cap,minimum), remainingFundedBonus(quote,freeBank). These are pure primitives, NOT runtime bindings or full gameplay.

- [x] Write failing tests for exact48IDs/6per merchant/35rules/source SHA, frozen approval, all rarity×copy cases, strongest5/binary max/tie ordering and nonmutation, rounding/discount floors/funding limits.
- [x] Observe missing-module failure, implement only those exports, run build:server and compiled foundation tests; generator --check must match frozen approved source, not trust a handwritten duplicate.
- [x] Commit checkpoint e15a4a6 with explicit8native/48still-unbound status; do not call completed foundations a playable full56 rollout.

### Task 2 — Versioned native56 catalog and selection/description paths

**Files:** types.ts, content.ts, core2.ts, passives.ts, merchant-abilities.ts, wishlist-rules.ts, collector-wishlist.ts, ghost-service.ts and exact source consumers located before edits; native catalog tests.

**Interfaces:** new catalogVersion5 selects stable new56 IDs,7per merchant; existing versions1–4 keep original arrays/order and audit bytes. ItemKind extends Remaining48Kind; family stays a visual type distinct from mechanical capabilities. ITEM_SPECS/image lookup uses actual metadata with no old-ID alias. Explicit active/consume capabilities only where approved; public views describe actual binding readiness.

- [x] Fail tests for56unique IDs/8×7, existing assets/anchors, kind/image/consumable/activation metadata and legacy pool preservation. Unknown facts remain hidden; NPC/Collector/Spirit source pools stay separate.
- [x] Implement versioned pool; do not enable at main entry or expose new-room option until Task3–6 complete.
- [x] Run catalog/spawn/inspection/copy/purchase/loan/vault/auction/Collector/Spirit/replay suites; preserve sealed old audit results.

### Task 3 — Automatic settlement families

**Files:** existing mechanics/challenge/cleanse/passives/commerce/brokerage/secure-storage/theft/survival/core2/engine owners, remaining48-effects.ts if cohesive shared state is needed, types/view/journal and focused effect tests.

**Interfaces:** engine-produced effect facts record instance/origin/target/action/encounter/actual amount. Shared custody reconciliation invalidates continuous hold rights before settlement. E69 is asset-only capped20 added to A, excludes testament/copies/estate/credits; scoring weights and P/G unchanged.

- [ ] For E28/E61/E63/E16/E13/E07/E42/E11/E06/E22/E38/E05/E40/E02/E69/E53/E62/E46/E33/E52/E34/E59/E32/E68/E37, write owner-level tests with exact approved formulas, positive/negative/copy/rarity/cap/zero-bank cases before binding.
- [ ] Implement canonical quotes/triggers and ledgers; no minting, no double actual stats, no returning custody/charge rights after transfer; preserve old behavior without version5.
- [ ] Run focused tests and sealed legacy replays after each owner group; add actual public-command benefit pairs rather than counting acquired items as exposure.

### Task 4 — Explicit targetable active/consumable families

**Files:** activation dispatcher, protocol/types/views, ability-rules.ts, events.ts/portal provenance and status instance tracking; focused lifecycle/network tests.

**Interfaces:** E31 cooldown/E35 portal clue/E36 event-closed portal/E71 debuff removal/E72 buff extension use authoritative target IDs and known quote before accepted attempt. E57 uses existing NPC wish replacement action, not Collector reroll. Status allowlists and active/fake/curse/consumption rules are those in the approved JSON.

- [ ] Fail tests for allowed/disallowed targets, no-op/cancel, floor0copy, fake40%/curse/death order, per-origin/player charge caps, status expiry vs charges, event closure vs crime ban, retry and reconnect.
- [ ] Implement original-instance state tracking and revalidation at settle; server rejects illegal direct activation without charge/cost. Preserve mandatory RPS and event blocking rules.
- [ ] Run protocol/engine/socket/private DTO/replay cases including death during activation; no runtime fallback that guesses a target or silently opens unknown goods.

### Task 5 — Shared Comic interactions and actual multiplayer

**Files:** relevant ItemActions/HeldEffects/Details/Portal/Status controls and existing Comic components only; existing live UI harnesses.

**Interfaces:** buttons use authoritative eligibility/quote/target and existing send handlers; utility navigation remains read-only. No new visual identity. Item truth remains unknown until authorized reveal.

- [ ] Add interaction assertions for known costs, targeting, disabled explanations, body/dock/preview access, symmetry and no scroll at1024/1440/1920; preserve14approved baselines.
- [ ] Implement controls and journal reasons; run ui:check/ui:test/ui:smoke/ui:visual and actual2App/reconnect/retry/full-game evidence with matching fresh receipts.

### Task 6 — Whole-game predicate reconciliation and balance acceptance

**Files:** factual capability audit, current event/encounter/omen source consumers, existing simulation/public scenario tools, context/Atlas/verification.

**Interfaces:** distinguish exact ID, visual family, capability, knowledge and custody predicates. Preliminary source observation:21Atlas helper-call gates do not enumerate all consumers;38BOND specs and E25 raw NPC favorite filters need independent review. Do not infer that every art sword is legacy blade or every hammer is cleanse gear.

- [ ] Inventory all relevant predicates with source/compiled fingerprints and eligible native IDs; test source coverage and own-item/offer/resolution agreement. Obtain concrete approval for material event remappings, retaining required event behaviors.
- [ ] Exercise every56item's approved primary benefit with ordinary commands plus multi-owner custody/replay; paired seed/config and normal40/6multi-policy finance/theft/Spirit matrices must distinguish exposure from ownership.
- [ ] Reconcile money/log/score/rarity/death/Collector/Spirit invariants, then compare approved UI baselines and full end-to-end requirements. Default56 activation is a separate final step after evidence, never inferred from registration or green unit tests.
- [ ] Update main HTML, context, roadmap, captures and verification after each actual checkpoint. Keep whole-game goal active until every objective requirement is proven.

## Task2 checkpoint — 2026-11-04

Catalog5 registered56,7per merchant, exact approved anchors/art. E05 first canonical owner binding tested;47remaining hooks explicitly disabled.198focused +65lifecycle +6Collector socket tests pass.32sealed old normal-game audits replay unchanged;4new normal-budget5runs reach RESULTS,1008commands,55kinds;16old pilot public audits byte-identical. UI10contracts/18menus/14unchanged approved baselines pass. See [verification](../../validation/native56-catalog-2026-11-04/verification.json). This is not full56 effects, balance acceptance or game completion.

Ruling: archive first catalog5 semantics as stage1 (`native56-stage1.json`); before Task3 adds further effects introduce an explicit effects revision. Absent revision must keep pilot8+E05, because sparse5 audits now exist. Cost if wrong: future replay divergence; four sealed full-game regression archives and restored readiness assertions guard it.

Task3 first E05 benefit verified: correct false claim adds approved500bps×S, capped1500bps and total9000bps; unchanged truth/no random wins, real owner/nonloan eligibility. Remaining47 owner bindings still pending.

## Native56 effects2 checkpoint — 2026-11-04

Supersedes the stage1 current-count note above:56registered /10primary verified (pilot8+E05+E06) /46primary pending. `native56Effects:2` is selected only for newly created experimental catalog5 runs; main default3 and opt-inpilot4 unchanged. Exact restore without flag keeps stage1; archived2 keeps stage2. E06 reduces actual failed-challenge credit penalty after void-seal resolution, using floor/cap and player+origin/encounter ledgers. Only an actual zero penalty (including void0) preserves rights; a positive penalty consumes the eligible right even if the saving rounds to zero. Approved held lock restriction applies in2; original sparse5 audits remain unchanged.

203focused tests include65lifecycle identity tests (not an additive268tests);6Collector socket checks,32old strict replays,4new normal-budget2/4seat games and16byte-identical pilot public audits pass. See `native56-runtime.json`, `native56-stage2.json` and `../validation/native56-stage2-2026-11-04/verification.json`. No E06 normal-budget benefit exposure, all56balance or new browser pixel-run claim. Next: remaining46 primary owners plus full predicate/UI/normal-budget acceptance.

Contract correction: E06 counts the first real positive penalty, not the first profitable saving. Positive penalty with eligible basis points consumes player/origin rights even when the saving rounds to0; actual zero penalty/void0 preserves them. A failing regression caught38 instead of50 on the next challenge; fixed before commit. No new passive no-op rule.

Final effects2 checkpoint verification:205focused pass, including65lifecycle and both sealed-stage replay tests;410source fingerprints/10UI contracts and293Atlas inputs current. No fresh stage2browser pixels claimed.

## Current native56 effects3 — 2026-11-04

Current count supersedes earlier checkpoints:56registered /21primary owner-tested /35pending. Eleven new kinds implement E28/E61/E63/E02/E11/E07 with the exact approved formulas; default3 and opt-inpilot4 unchanged. Native56 effects3 preserves absent stage1 and explicit2; future versions must preserve3too. `native56-runtime.json` separates membership from owner proof; `native56-stage3.json` pins4new normal-budget full-game archives.

Evidence:229focused (includes65lifecycle; do not add them),124related regressions pass;3priorUI assertion failures reproduce812ef79 (semantic reconciliation still pending) and remain open. One old audit test cwd path fixed.6Collector socket checks,32old replays+4new40credit/6life games and16byte-identical pilot audits pass. Read `../validation/native56-stage3-2026-11-04/verification.json` for scope, failures and source pins. Not full56 public benefit coverage, pixel approval or balance acceptance.

Ruling: E61 boundary snapshot precedes settlement; shared physical-origin rights use existing player order. Reason: no retroactive returned-loan bonus or duplicate origin payout. Risk: same-origin copies across seats compete in canonical order; covered by original/copy boundary test.

Still required before default rollout:35primary hooks; full native predicate/custody/benefit matrices; Task5 authoritative quote/expected-cost synchronization (E63 origin rights can change between displayed quote and action), item remaining-use explanations and full UI/network/balance acceptance. Whole-game goal remains active.

Effects3 final source verification:229focused pass;124related pass/3priorUI failures remain;6socket pass;411UI fingerprints/10contracts and298Atlas inputs current. Main default and approved image references unchanged; no fresh browser pixel claim.

Effects3 edge verification: lock expiry is evaluated after status expiry against a physical pre-boundary custody snapshot; E02 ranges retain unpowered replacement truth. Two RED→GREEN cases, final229focused pass; no candidate archive or approved image hash changed.

Postcommit9ec8092: readiness audit had one stale types.ts hash after a comment-only edit; regenerated and added auxiliary new56/remaining48 --check calls to central Atlas verifier. Observed real stale-input RED then GREEN. No runtime/default/approved-image change.

### Partial Task5 prerequisite — recovery quotes (2026-11-04)

- [x] Versioned visible-term token from shared recoveryOffer; strict optional bounded wire parser, shared server guard before payment, existing UI/bot conditional sender. New native5/effects3 creations enable recoveryQuoteRules1; exact old restore and explicit2 stay unchanged.
- [x] E63 shared-origin quote race, unchanged reads, actor/shop/encounter/range invalidation, atomic rejection, reconnect, fresh retry and request dedup tested. 145focused/12wire-unit;32old+4new normal games;16pilot audit bytes preserved.18menus/14approved pixels pass.
- [ ] This is not whole Task5: remaining-use presentation, every remaining active/consume path, public benefit and full native lifecycle matrix still required.35primary bindings still pending.

### Partial Task3 checkpoint: effects4 E13/E16 — 2026-11-04

E13 canonical completeAppraisedSale/purchase uses actual commission, excludes self/copy goods, funds capped separate bank bonus and preserves stats. E16 canonical propose/respond snapshots before-offer tool IDs privately, checks settlement custody and actual paid original inventory goods, records unordered pairs/goods origins/player+tool-origin use. Public DTO and type omit snapshots. New4 carries previous3; archived1/2/3/quote3 remain exact.24owner-tested,32pending; all tasks3–6 still incomplete. See native56-stage4.json and validation/native56-stage4-2026-11-04/verification.json for exact test counts/scope.


## 2026-11-05 — Native56 effects5: E22 auction rebate

Approved vampire-midnight-invitation now returns up to the approved, bank-funded rebate only on an actual paid auction win. The original invitation must remain physically held from the first positive bid through settlement; withdrawal does not reset the snapshot. Self-origin lots, copies, unpaid/lost bids and duplicate origin/lot settlements are excluded. New catalog5 experimental runs select effects5; old absent/2/3/4 archives, default3 and opt-in pilot4 remain unchanged.

Evidence: `../validation/native56-stage5-2026-11-04/verification.json`. Server build passed; E22-focused 13/13 including two actual socket reconnect/retry cases; 32 sealed legacy replays plus 4 diagnostic games; approved pilot8 proof remains 16/16 audit hashes; one fixed public 40-credit/6-life pair observed held=1 credit rebate vs stored=0. This is mechanism proof, not balance acceptance.

Still open: 31 primary bindings, bidder-facing E22 benefit/eligibility UI (Task5), whole predicate/custody/normal-benefit matrix, and multi-seed 2/4-player release balance. Next Task3 owner is E38 RPS tie rights. See `native56-stage5.json` and `implementations/remaining48-plan.md`.

## 2026-11-05 — Native56 effects6: E38 sword-family tie right

`vampire-mooncut-sword` now participates in the real forced-theft RPS path. At duel start the server snapshots eligible held swords before either hand is submitted; a tied first round consumes at most one binary right per player per encounter across the new mooncut sword and legacy riftfang sword. If both duelists have a right, they cancel as before. A low-strength copy cannot qualify; rarity does not multiply the right; a non-tie does not spend it. The existing public pre-duel sword indicator now uses family-neutral wording.

New catalog5/effects6 runs preserve effects5 and earlier restore semantics; default catalog3 and pilot4 remain unchanged. E22 readiness remains enabled at stage6. Stage5 archive and approval snapshot are pinned separately.

Evidence: `../validation/native56-stage6-2026-11-05/verification.json`. E38-focused 6/6 and neighboring automatic/E22/challenge regressions 51/51 pass, including three actual socket cases. 32 sealed compatibility replays and four effects6 diagnostic games pass. The eight public pilot pairs (16 audits) remain hash-identical. No full balance or default56 claim.

Count: 56 registered / 26 primary owner-tested / 30 pending. Still open: E22 bidder-facing benefit/eligibility UI, 30 primary bindings, whole predicate/custody/normal-benefit matrix, Task4 active/consumable flows, and multi-seed 2/4-player release balance. Next Task3 owner is E40 theft-loss reduction. Whole-game goal remains active.

## 2026-11-05 — Native56 effects7 checkpoint: E40 theft-loss reduction

`autometa-clockwork-sentry` reduces a qualifying NPC theft defeat's actual trust loss from2 to1 when physically held before duel start. It preserves forced RPS, crime, trade-ban and D21 consequences; excludes PvP; and grants one binary right per player/encounter. Experimental catalog5 selects effects7 only for new runs; default catalog3, pilot4 and archived effects1–6 remain unchanged.

Evidence: `../validation/native56-stage7-2026-11-05/verification.json` and `../game-design/native56-stage7.json`. Server/client builds pass, E40 owner tests3/3, focused regression55/55 (3 real socket cases), 32 sealed compatibility replays,4 diagnostic games and8 public pilot pairs/16 preserved audit hashes pass. UI source check415 and contracts10/10 pass. Browser smoke/visual were not run because the prior agent TaskSpace4 no longer exists; no approved baseline was overwritten.

Current count: 56 registered /27 primary owner-tested /29 pending. Next Task3 owner is E42 theft insurance. E22 disclosure, Task4 active targets, Task5 live interactions/benefit disclosure, Task6 predicate/custody/public exposure, and measured multi-seed 2/4-player release balance are still open. Whole-game goal remains active.

## Task 3 checkpoint — effects8 / E42 theft insurance (2026-11-05)

E42 is bound at the successful PvP transfer owner. A qualifying held Vampire Mist Cloak pays the victim against the original stolen good using `min(lastTradePrice, rarity-scaled item.base)`, 20% scaled up to30%, cap4 per loss and6 per victim/run, one original origin per run globally. The bank pays only from free reserve. The transferred item stays stolen and all existing theft penalties remain; NPC, failed/cancelled, copy, and cloak-self cases are excluded. Do not double-apply rarity to `item.base`.

Validation: E42 focused tests5/5, adjacent non-socket theft regressions14/14, server/client builds, 32 sealed replay +4 normal diagnostics, unchanged public pilot hashes16/16, UI source fingerprints415, UI contracts10/10 and gallery integrity56/56. The actual socket case could not bind `127.0.0.1` (`EPERM`), and browser smoke/visual were skipped because only the user's browser space was listed. No screenshot baseline changed. See `../validation/native56-stage8-2026-11-05/verification.json` and `../game-design/native56-stage8.json`.

Current count: 56 registered /28 primary owner-tested /28 pending. Next owner binding is E46 vault-interest rings. Then continue approved Task4–6, E22 disclosure, full predicate/custody/public-benefit coverage, and normal-budget multi-seed 2/4-player balance. Whole-game goal remains active.

### Revision 14 integration checkpoint

Catalog 5 revision 14 binds 46 of 56 primary effects. The compatibility report for this revision records 32 sealed replays and four seeded games reaching results. The focused catalog and remaining48 suite passed 146 of 150 under the sandbox. Four tests could not open a local socket; the separate E16/E13 and E38 socket retry passed. The normal Comic room entry still selects catalog 3 or pilot catalog 4.

E69 continuous custody is under implementation review. The targeted activation proposal covers eight other items. E37 requires a gameplay decision because its current energy floor equals the base cost.

E37 decision (2026-11-06): the user selected B. In revision 15, an eligible held Fangline Lasso waives the energy cost of the first valid forced theft duel in an encounter, including at zero energy. The existing attempt limit applies.
