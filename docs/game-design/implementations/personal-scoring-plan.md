# Personal system scoring implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this native plan task-by-task. Steps use checkbox syntax. One fresh independent whole-branch review after implementation; no per-task reviewer churn.

**Goal:** Implement exactly the approved1551908 personal scoring package and sequential Comic result graph while keeping historical audits/legacy separate.
**Architecture:** Versioned private canonical performance receipts, one shared pure scoring calculator, allowlisted self/final breakdown DTO, presentation-only animation in the existing result frame. Runtime producers own successful facts; no score inferred from prose logs, final trust, or graph dependencies.
**Tech Stack:** Existing TypeScript/React/Node tests/Comic components/ego-browser gates; no dependencies or art generation.
**Spec:** `../personal-scoring-approval.json` pins1551908 rules and weights; `../proposals/personal-scoring-rules-v1.md` and weights JSON are immutable approval sources. Repository convention keeps implementation plans here.

## Global constraints

- Every player gets own accomplishments; sale quantity and gross credits separate; trust is actual cumulative positive gains after clamp, even if later lost. Initial trust is not earned performance.
- Approved weights/caps: bought2/40; sold quantity5/75; sold credits1per10/100; trust3/120; inspection1/24; first accurate appraisal2/40 at≤20%base error; NPCcontract4/32; interest1/30; aged fully-repaidloan5/20 to each party; survived2/30; actual HPlost1/12; theft4/20; rarity0/4/8/12/20/28 capped80; ghost1credit1point unchanged/no newcap.
- `floor((assets + performance) * (100 + B10-D10)/100) + ghostBonus`; one floor per aggregate metric and after modifier. Canonical origin/tuple/contract eligibility and exclusions exactly as approved spec. No new leader awards.
- Action facts stop atdeath. Asset/rarity custody assessed for all includingdead after loan settlement. Ghost unchanged. Old no-flag audits retain original formula/state.
- Comic only, defaultcatalogue3/pilot4 unchanged; remaining48 not included. Reuse shared frame/buttons/tooltips; no gameplay scroll, no art/style redesign or new dock.

## Review focus

1. Duplicate requests, repeated origin sales, copies, self-NPC purchases, barter/refund and multiple trace rows must not create duplicate eligible accomplishments; raw real repeated activity remains visible.
2. Positive trust gain then loss in the same command, clamped gain0 and starting trust cannot be reconstructed from net/final/peak trust; test canonical mutation hooks.
3. Loan custody, full-encounter age, full repayment/foreclosure/cancellation/death and both parties must choose correct eligibility and final rarity ownership.
4. Modifier/rounding/caps and ghost addition must match one formula in Status, Collector, audit and all graph stages, including negative modifier stage.
5. Two/four-player graphs, reconnect/replay/skip/reduced-motion and all utility menus must not resubmit scoring, reset clocks, leak hidden item truth, scroll or drift inventory frame.

### Task 1: Receipt domain and shared calculator

**Files:** Create `apps/comic/src/game/appraisal/personal-scoring.ts`; modify `types.ts` for config/state/final DTO types, `engine.ts` config validation/init/invariants only; create `apps/comic/tests/personal-scoring.test.ts`.
**Consumes:** Approved receipt and weights; existing `collectorTotal`, `Rarity`, immutable original/copy metadata.
**Produces:** `PersonalMetric` (12 action metrics; rarity/ghost evaluated separately), `PersonalFact {id:string;playerId:string;metric:PersonalMetric;raw:number;eligibleKey:string;eligible:boolean;cause:string}`, `PersonalPerformance {version:1;facts:PersonalFact[]}`, `recordPersonalFact(state,fact):void`, `calculatePersonalScore(input:PersonalScoreInput):PersonalScoreBreakdown`, `personalPerformanceInvariants(state):void`. Input has assetScore, modifierPercent, ghostBonus, actor facts and final original rarities. Breakdown contains metric raw/eligible/weight/uncappedPoints/points/exclusions/sourceIds, group totals, ordinaryBeforeModifier/modifierDelta/ordinaryScore/ghostBonus/total. Config `personalScoringRules?:1`, private state `personalPerformance?`; flag-off record is strict no-op with no extra state.

- [x] Write failing domain tests: sale4→20, credits9+1 aggregated→1, trust6→18 despite laterloss, approved example100+53 with20%→183 and B130+11→141; all14 definitions equal pinnedJSON; allcaps; rarity common0/uncommon4/rare8/epic12/legendary20/mythic28 cap80; ghost2 added once. Test raw repeating sale2/eligible1, tuple(player,origin,merchant), copies/excluded facts, duplicate fact IDs identical no-op/conflicting reject, noninteger/unsafe/negative raw and unknown player/metric rejection, noflag no state change.
- [x] Run Comic server build and `node --test apps/comic/dist/tests/personal-scoring.test.js`; save meaningful RED.
- [x] Implement above interfaces with approved constants. Reuse `collectorTotal` for modifier semantics (existing magnitude can be fractional); do not invent integer-only modifier validation. Validate finite/safe results; no public commands or main default rollout yet. State init only underflag1.
- [x] Run domain tests and relevant historical audit replay/source/config tests. Explicit noflag state/audit byte assertions. Update context/evidence and commit intended files only.

### Task 2: Canonical facts and runtime scoring

**Files:** `engine.ts`, `mechanics.ts`, `wishlist.ts`, `brokerage.ts`, `secure-storage.ts`, `theft.ts`, `npc-events.ts`, `survival.ts`, `types.ts`, `personal-scoring.ts`; tests `personal-scoring-runtime.test.ts`, `personal-scoring-network.test.ts`.
**Consumes:** Task1 record/calculator/types and actual successful economic/knowledge/trust/life/contract mutations.
**Produces:** `personalScoreFor(state,playerId,finalAssets?):PersonalScoreBreakdown` shared projection; new-flag Collector result stores immutable final breakdown; optional `self.personalScore` in Task3 DTO. No new action type. Facts keyed to accepted operation identity, metric and semantic sub-operation; origin eligibility keys use approved tuples. Fact IDs never depend on client clock or random extra draws.

- [x] Write RED public-command tests for all12 activity metrics and final rarity; assert balances/custody in addition to points. Include sale sources inventory PvP/market/NPC-to-other, exclude self purchase and double commission, successful auction buys only, zero-credit/barter/refund/copies/origin resales. Raw and eligible differ explicitly.
- [x] Pin source writers before edits with Trail callers. Positive trust writers located: mechanics `completeAppraisedSale`/`noteRepeatBuy`, wishlist `wishSell`; exhaustively confirm direct/alias mutations and new paths before integration. Add `setPersonalTrust(state,p,npc,next,source):void` only where trust changes to capture actual positive clamped amount; negative paths can call same helper or preserve semantics without decrementing cumulative receipts. No net-state-delta proxy. Test gain→loss in one command and gain atcap.
- [x] Insert explicit receipt calls at actual settled buy/sale/auction/inspect/appraise/interest/loan/theft/life/survived/contract paths, not by parsing trace prose. Derive origins from `item.copy?.sourceId ?? item.id`; mark copy eligibility false. First appraisal/facet keys span custody changes. NPC/wish contract creation retains stable acceptance identity underflag; fulfilment records that same identity only once, noflag object shape unchanged.
- [x] Map a full completed encounter to the existing aged-vault boundary: fund during1, encounter2 remains intact, eligible from3 (`repaidAt >= fundedAt + 2`). Tests fund1/repaid1 or2→0, fund1/repaid3→5 each party, distinctpair+collateral key, duplicate repay no addition, foreclosure/cancel/death zero. This is the same full-encounter age convention already approved for vault, not merely crossing a turn label.
- [x] CollectRun: settle loans first, evaluate true owned original rarity for dead/alive, use calculator for newflag; noflag original path exact. Test old audits, actionfacts stopondeath, estate rarity changes after foreclose, modifier on all ordinary performance and ghost aftermodifier exactlyonce. Status uses same function, never client recomputation.
- [x] Real public sockets cover config1 command routing/duplicate/reconnect/hidden-truth allowlist/end/replay. Bounded fullrun audit plus old noflag audits. Keep main default flag off until Task3 UI verifies. Update evidence/context and commit.

### Task 3: Final breakdown DTO and Comic graph

**Files:** `views.ts`, `types.ts`, `apps/comic/src/appraisal-client/App.tsx` Results L193–204, `StatusMenu.tsx`, new `PersonalScoreResults.tsx`/`personal-score-results.css`, `main.tsx`, preview fixture/generator; `server/appraisal-main.ts`; tests `personal-scoring-ui.test.ts` and scoped browser suite in `scripts/ui/`.
**Consumes:** Task2 optional self/final breakdown. Old/no-flag DTO retains existing Results fallback.
**Produces:** `<PersonalScoreResults room send disabled/>` uses existing ComicPhaseFrame/ComicButton/ComicTooltip;9-stage playback is local UI state only. Render assets, commerce, knowledge, relations, finance, journey, collection, modifier, ghost in fixed2–4 equal columns and shared zero baseline. Negative modifier may lower bar; final sum/ordering from server. Readonly metric pages show raw/eligible/cap/exclusions without hidden truth beforeend.

- [x] SSR RED: old fallback unchanged; two/four players; exact server total183/141; quantity and volume separate; cumulative trust label; unknown/not-yet-final truth hidden; selected metric raw/eligible/cap accessible.
- [x] Implement using shared tokens/frame, CSS import only main. Stable player positions during playback; final ranking labels. Play/pause/next/skip and reduced-motion affect presentation only; utility menus/reconnect do not submit actions/reset clocks or recalculate awards.
- [x] Browser geometry/interaction at1024/1440/1920: no page or internal gameplay scroll/clipping; aligned padding/columns/actions; replay/skip/pause/reducedmotion/reconnect/menu switching and negative modifier. No new art. Candidate screenshots source hashes, never replace approved baselines to hide drift.
- [x] Enable `personalScoringRules:1` only in main new rooms after engine/protocol/UI proof. Preserve explicit/no-flag configs and legacy. Run server/client builds, relevant functional/network/end-to-end, `npm run ui:check`, `ui:test`, `ui:smoke`, `ui:visual` with matching fresh invocation receipts. Record environment failures separately; do not claim old pixel receipts as fresh.
- [x] Update central decisions/status/roadmap/flow/captures, regenerate/check Atlas, versioned approval/evidence, relevant Hindsight acknowledgment+retrieval. Whole-branch review follows native Task3 completion, with one owner fix pass and TDD, not repeated fix reviews. Commit only intended files. Whole-game goal remains active for remaining48/balance/fullgame work.

## Execution and self-review

User explicitly approved putting the1551908 package into the game under the continuing autonomous goal; preserve the existing native method. Plan does not ask permission again for that same implementation. Any new material rule not covered by approval must be surfaced with a concrete proposal while independent work continues. Self-review: all14 weights/eligibility,9 UI stages, protocol/legacy/privacy/death/loan/duplicate concerns map to tasks1–3; Task1 signatures are the shared interfaces, Task2 owns producers, Task3 owns visibility/presentation. No source integration is marked complete by this plan.
