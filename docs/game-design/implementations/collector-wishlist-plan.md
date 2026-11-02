# Collector Wishlist Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement task-by-task in the current goal. Use existing authorized native execution; do not re-request this spec approval.

**Goal:** Make approved personal Collector3+2 request/delivery/peek/paid purchase playable without replacing NPC wishes or final Collector scoring.

**Architecture:** Dedicated versioned state/action/view module inside active Comic. Existing dispatcher, clock/receipt/audit, custody, cost helpers and ComicMenu own their present responsibilities. No new game phase, UI identity or live-bot private-information access.

**Tech Stack:** Existing TypeScript/Node/React and Ego verification; no new dependency.

**Spec:** ../proposals/collector-wishlist-v1.md, exact5a44a7a SHA d7e79e71d6fcb61919c91beaea34b123d1676a4745be97aa88f87bd36462d98f. Approval: ../collector-wishlist-approval.json, user “อนุมัติสเปกทดลองนี้” on2026-11-02.

## Global Constraints

- Private batch:3distinct active kinds+2distinct extra kinds, shuffled5opaque slots; request2/4/6…, due+2; buy1or skip,peek1ifwalletcanpaytotal.
- Shared rawprice=ceil(mean5 rarity-scaled anchors),min1. Apply approved common purchase discounts/surcharges/fees/energy and consume statuses only on successful buy; noportal-NPC condition/trust/commission. Current actual quote visible before confirmation.
- Banblocksbuy; read/request/peek/skip still available as approved. Ownedcurrency/vaultnotautomaticallywithdrawn. No effects/steal/loans/score fromunboughtescrow.
- Own done/TRADE expires current unspent delivery/requestwindow; **does not cancel a valid future pending request**. Death/end cancels futurepending too. Close oldoffer before newrequest sameevenencounter.
- Preserve catalog4generator and no-flag audit. Newrule flag `collectorWishlistRules:1`; sourceversioning,not silent legacy migration. Separate RNGnamespace, no shift of existing stock/market draws.
- No scrolling/dropdown/newart/newdockitem. Use sharedframe/controls, preserveHUD/preview/utilities/E109rules. Do notshowhiddenkind/merchant/rarity/truth/instanceID beforepeek/purchase.

## Review Focus

- A request made in2mustsurviveown doneandarrive4; onlyitscurrentwindowexpires.
- Changing inventory/status betweenpeekandbuy changes payableequallyforallslots; reconfirm latestcost,never charge staleclientquote.
- Duplicate receipt versus a new requestID targeting an alreadyspentbatch cannot yield anotherpeek/item/payment.
- Cancel futurebatches and unboughtescrow before final scoring; do notfakeinventory ownership to callretire().
- Feature-disabled/oldno-flag audits and existingNPCwish handlers must stayexactlycompatible; version4pool remains8.

---

### Task 1: Private lifecycle / redacted view / pricing

**Files:** create apps/comic/src/game/appraisal/collector-wishlist.ts; modify types.ts,engine.ts,views.ts,secure-storage.ts,journal.ts,mechanics.ts only for shared-cost extraction where identical; tests/collector-wishlist.test.ts (Comic paths).

**Interfaces:** `CollectorWishlistAction` union: collector-wish-request{kinds},collector-wish-peek{batchId,slotId},collector-wish-buy{batchId,slotId,quoteId},collector-wish-skip{batchId?}. Dedicated `CollectorWishlistState` and `CollectorWishlistView`. `handleCollectorWishlist(state,p,action):void`, `reconcileCollectorWishlist(state):void`, `closeCollectorWishlists(state):void`, `collectorWishlistView(state,p):CollectorWishlistView|undefined`, `assertCollectorWishlistInvariants(state):void` exported only when a caller needs them.

- [x] Trace current callers of dispatcher/advance/purchase/collectRun before editing;inspect exactspans,not just this plan. Decide smallest state shape containing pending request, current private delivery,spentpeek andcurrentevenwindow; no parallel historyframework (journal already exists).
- [x] Write failing tests: request3distinct at2; no requestat1/3; due4not3; extra2exclude3; fiveopaqueIDs; publicJSONcontainsno hiddenitemkind/ID/mapping; no seededrerollonview. Own doneat2keepsdue4; own doneat4expiresunboughtoffer; death/end cancelsboth.
- [x] Add versioned flag,new-run initialization and isolated RNG generation using existing activeNpcs/merchantKinds/anchor/priceRange/rarity helpers. Do not widen catalog4 or reuseNPCwish state. Register explicitCollectorescrow owner in invariants; never temporarilygrantunboughtgoods.
- [x] Write failing price/cost tests: raw20/30/40/10/50→30 shared; rarityonce; truthchangesdonotchangequote; B03/D12/helddiscount/fee/currentD06/freeBuy/buyEnergy exact;min1;notappraiserwaiver. Banpreventsbuy,read/request/peek/skipremain; failedspendneverconsumesstatus. Quotescannotleakslotidentity.
- [x] Share identical purchase-cost calculations at existing responsible layer ifneeded; keep originalNPCstock/condition/trust/commission paths unchanged. SuccessfulCollectorbuyspendsatomiccurrency/energy,recordItemTrade/paid/custody/streak exactlyonce;nopeerscrap/shard/commission because no appraiser.
- [x] Run Comic focused build/tests and existing buy/interest/pilot/forcedtheft/ghost lifecycle cases. Commit only verified Task1 checkpoint; do notlabelwholeCollectorreadyyet.

### Task 2: Protocol / room lifecycle / audit / public-only bot policy

**Files:** modify shared/appraisal-protocol.ts,server/appraisal-messages.ts,server/appraisal-rooms.ts,game/appraisal/engine.ts,survival.ts,audit.ts ifneeded,simulation/appraisal.ts; test collector-wishlist-network.test.ts and focused replay tests.

**Interfaces:** Task1 action/view union consumed by existing decisions/parser/room receipts; no client-supplied price/itemtruth/seed. ExistingapplyAppraisalAction idempotency/revision/audit remains soletransactionentry.

- [x] Failing tests rejectwrongtypes/counts/duplicatekinds/foreignbatch/forgedslot/priceextra/privateactions; oldno-flag audit unchanged. Pendingevent/ability preventsrealcommands whileutilityreadremainsread-only.
- [x] Hookreconcileafteradvance/actions/phasechange andclosebeforecollectRun snapshot. Preserve independent RPSclock and normaldeadlines; no new blockingphase or extra timer. Do not expirefuturepending on an unrelated own done.
- [x] Two realsockets: request2→disconnect/resume→deliver4→peek→duplicate receipt→buy→duplicate→oneitem/onepayment; forgedsecondpeeknewIDrejected; unboughtsetcancelsonend/death. Earlyprivateauditdenied; fullRESULTS auditstrictreplaypasses. Verifybothpersonalbatches isolated.
- [x] Extend public-view bots only with explicitrequest/peek/buy/skip bounded behavior; neverinspectprivate mapping or forcehumanchoices. Addreal-budgetcoverage before anybalanceclaim.
- [x] Runfocusednetwork/replay and originalNPCwish/phase/timer tests; commitdurableevidence,default/legacycompatibilityrecorded.

### Task 3: Shared Comic UX / preview / evidence / central context

**Files:** new appraisal-client/CollectorWishlist.tsx; sharedComicUI reused;modify App.tsx,model/protocol-derivedtypes,comic-preview-data.ts and scopedCSS importedinmain.tsx asneeded. Update screen-flow/currentcaptures sources,docs/verification/mainAtlas throughgenerator. Browserproof script in scripts/ui/.

**Interfaces:** public `CollectorWishlistView` plus exactexisting `submit(Decision)`; same openDrawer/navigation/ComicMenu contract, no newdock menu or gameplay mutation whilebrowsing.

- [ ] Mounted tests: choose3kind/compactpages; waitingdue+2;5concealedslots withsharedpayable/energy,onepeekrevealsonlyname/art/rarity; explicitbuyconfirmation; buy/skipoldbefore requestnew; ban/poorwallet/poorenergy/expiry/death. Pairspacing and no duplicatefacts.
- [ ] Implement minimize/return within sharedframe whileactualportalsremainpeekable; use existing eventblocking precedence and6utility menus. Countdowns/focus/reducedmotion restored; no staleorphanedDrawer on advance/end.
- [ ] Fresh1024/1440/1920 publicDTOproof and2-seatcommandflow; no page/paneoverflow; screencontextlinks exactsource/capturehashes. Runui:check,ui:test,ui:smoke,ui:visual withmatchingfreshreceipts; baseline14unchanged,noautomaticre-record.
- [ ] Reverify affectednative/ghost/theftcompatibility and sourcepins; rebuild/checkAtlas. Updategame-status/roadmap/context withactualimplementedstage,logs,failuresandremainingfull56/STRAT/awards/balance. Keepwhole-gamegoalactiveuntilfullacceptance.

Self-review: allapprovedspecsections mapped above; no additional numeric rule inferred. Shared source line spans must be revalidated at execution. The original proposal remains frozen for approval hash; implementation progress lives here and in approval/evidence files.
