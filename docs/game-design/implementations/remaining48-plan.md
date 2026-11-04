# Approved remaining48 Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans task by task in the current session. No new delegation is authorized by this plan. Preserve the whole-game goal after each checkpoint.

**Goal:** Bind all approved56 primary item contracts to actual Comic play, preserving old runs and shared Comic UX.

**Architecture:** Keep the frozen532dece specification and a separate approval receipt. Stage typed catalog/rule data and shared numerical primitives before introducing a new catalog/effect revision. Hook resource changes at their existing canonical settlement owners, not via UI or event-name aliases. Do not expose a partly bound catalog as the default game.

**Tech Stack:** Existing TypeScript/Node tests, seeded engine, React Comic components, existing audit/replay/Atlas/UI tools. No new dependency.

**Spec:** ../proposals/remaining48-experimental-v1.json (SHA f16175ff4bc0ad8162b56a5266552d9efc730c9681910e36684d71dba2ce7508), ../remaining48-approval.json. Pilot8 approval remains separate and frozen.

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

### Task1 — Approval, typed contracts and numerical foundation

**Files:** remaining48-approval.json; scripts/build-remaining48-catalog.mjs; apps/comic/src/game/appraisal/remaining48-catalog.ts and remaining48-numbers.ts; apps/comic/tests/remaining48-foundation.test.ts; current context/Atlas.

**Interfaces:** Catalog exports REMAINING48_ITEMS (identity/name/merchant/type/anchor/nativeEffect/mode/cost), REMAINING48_RULES (exact approved numeric parameters), Remaining48Kind/Effect. Numeric module consumes PoweredItem and itemEffectScale; exposes remainingStrength(items,effect), remainingScaled(amount,strength,cap), remainingDiscount(base,amount,strength,cap,minimum), remainingFundedBonus(quote,freeBank). These are pure primitives, NOT runtime bindings or full gameplay.

- [x] Write failing tests for exact48IDs/6per merchant/35rules/source SHA, frozen approval, all rarity×copy cases, strongest5/binary max/tie ordering and nonmutation, rounding/discount floors/funding limits.
- [x] Observe missing-module failure, implement only those exports, run build:server and compiled foundation tests; generator --check must match frozen approved source, not trust a handwritten duplicate.
- [ ] Commit checkpoint with explicit8native/48still-unbound status; do not call completed foundations a playable full56 rollout.

### Task2 — Versioned native56 catalog and selection/description paths

**Files:** types.ts, content.ts, core2.ts, passives.ts, merchant-abilities.ts, wishlist-rules.ts, collector-wishlist.ts, ghost-service.ts and exact source consumers located before edits; native catalog tests.

**Interfaces:** new catalogVersion5 selects stable new56 IDs,7per merchant; existing versions1–4 keep original arrays/order and audit bytes. ItemKind extends Remaining48Kind; family stays a visual type distinct from mechanical capabilities. ITEM_SPECS/image lookup uses actual metadata with no old-ID alias. Explicit active/consume capabilities only where approved; public views describe actual binding readiness.

- [ ] Fail tests for56unique IDs/8×7, existing assets/anchors, kind/image/consumable/activation metadata and legacy pool preservation. Unknown facts remain hidden; NPC/Collector/Spirit source pools stay separate.
- [ ] Implement versioned pool; do not enable at main entry or expose new-room option until Task3–6 complete.
- [ ] Run catalog/spawn/inspection/copy/purchase/loan/vault/auction/Collector/Spirit/replay suites; preserve sealed old audit results.

### Task3 — Automatic settlement families

**Files:** existing mechanics/challenge/cleanse/passives/commerce/brokerage/secure-storage/theft/survival/core2/engine owners, remaining48-effects.ts if cohesive shared state is needed, types/view/journal and focused effect tests.

**Interfaces:** engine-produced effect facts record instance/origin/target/action/encounter/actual amount. Shared custody reconciliation invalidates continuous hold rights before settlement. E69 is asset-only capped20 added to A, excludes testament/copies/estate/credits; scoring weights and P/G unchanged.

- [ ] For E28/E61/E63/E16/E13/E07/E42/E58/E11/E06/E22/E38/E05/E40/E02/E67/E69/E49/E53/E62/E46/E33/E52/E34/E59/E32/E68/E37, write owner-level tests with exact approved formulas, positive/negative/copy/rarity/cap/zero-bank cases before binding.
- [ ] Implement canonical quotes/triggers and ledgers; no minting, no double actual stats, no returning custody/charge rights after transfer; preserve old behavior without version5.
- [ ] Run focused tests and sealed legacy replays after each owner group; add actual public-command benefit pairs rather than counting acquired items as exposure.

### Task4 — Explicit targetable active/consumable families

**Files:** activation dispatcher, protocol/types/views, ability-rules.ts, events.ts/portal provenance and status instance tracking; focused lifecycle/network tests.

**Interfaces:** E31 cooldown/E35 portal clue/E36 event-closed portal/E71 debuff removal/E72 buff extension use authoritative target IDs and known quote before accepted attempt. E57 uses existing NPC wish replacement action, not Collector reroll. Status allowlists and active/fake/curse/consumption rules are those in the approved JSON.

- [ ] Fail tests for allowed/disallowed targets, no-op/cancel, floor0copy, fake40%/curse/death order, per-origin/player charge caps, status expiry vs charges, event closure vs crime ban, retry and reconnect.
- [ ] Implement original-instance state tracking and revalidation at settle; server rejects illegal direct activation without charge/cost. Preserve mandatory RPS and event blocking rules.
- [ ] Run protocol/engine/socket/private DTO/replay cases including death during activation; no runtime fallback that guesses a target or silently opens unknown goods.

### Task5 — Shared Comic interactions and actual multiplayer

**Files:** relevant ItemActions/HeldEffects/Details/Portal/Status controls and existing Comic components only; existing live UI harnesses.

**Interfaces:** buttons use authoritative eligibility/quote/target and existing send handlers; utility navigation remains read-only. No new visual identity. Item truth remains unknown until authorized reveal.

- [ ] Add interaction assertions for known costs, targeting, disabled explanations, body/dock/preview access, symmetry and no scroll at1024/1440/1920; preserve14approved baselines.
- [ ] Implement controls and journal reasons; run ui:check/ui:test/ui:smoke/ui:visual and actual2App/reconnect/retry/full-game evidence with matching fresh receipts.

### Task6 — Whole-game predicate reconciliation and balance acceptance

**Files:** factual capability audit, current event/encounter/omen source consumers, existing simulation/public scenario tools, context/Atlas/verification.

**Interfaces:** distinguish exact ID, visual family, capability, knowledge and custody predicates. Preliminary source observation:21Atlas helper-call gates do not enumerate all consumers;38BOND specs and E25 raw NPC favorite filters need independent review. Do not infer that every art sword is legacy blade or every hammer is cleanse gear.

- [ ] Inventory all relevant predicates with source/compiled fingerprints and eligible native IDs; test source coverage and own-item/offer/resolution agreement. Obtain concrete approval for material event remappings, retaining required event behaviors.
- [ ] Exercise every56item's approved primary benefit with ordinary commands plus multi-owner custody/replay; paired seed/config and normal40/6multi-policy finance/theft/Spirit matrices must distinguish exposure from ownership.
- [ ] Reconcile money/log/score/rarity/death/Collector/Spirit invariants, then compare approved UI baselines and full end-to-end requirements. Default56 activation is a separate final step after evidence, never inferred from registration or green unit tests.
- [ ] Update main HTML, context, roadmap, captures and verification after each actual checkpoint. Keep whole-game goal active until every objective requirement is proven.
