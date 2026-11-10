# Decisions and authority

| ID | Status / evidence | Decision |
|---|---|---|
| UI-01 | Confirmed user repeatedly, latest 2026-10-29 | One game: reuse existing inventory/status/menu look; symmetry includes inner padding, gaps and centres, not just equal columns. |
| UI-02 | Confirmed user | Inventory frame is standard across comic menus and S06. Shared frame/corner tokens, persistent dock, no gameplay scrolling/dropdown expansion. |
| UI-03 | Confirmed user correction | No per-page brush-caption/white-button identity; reduce internal dividers. Prior item-sale v02 decorative PNG is superseded for those details by current implementation. |
| UI-04 | Confirmed user latest screenshot | +/-/input group must centre on the equal action pair; equal button padding, width and gaps. Coin icon must not offset it. |
| ARCH-01 | Explicit asynchronous user approval this audit | Move comic build into `apps/comic`, separately from old root app. Preserve old commands and original external backup. Use repo copy from now on. |
| ARCH-02 | Current implementation, no unification approval | Root and comic game code differ in journal/engine/types/views/content/secure-storage. Preserve both and document divergence. No gameplay migration or engine deduplication in this audit. |
| QA-01 | Authorized task scope | Add Node tests, Ego browser geometry and deterministic pixel comparison. Reuse tooling, no new npm dependency. Mask timer only. |
| QA-02 | Explicit user approval 2026-10-30 | User approved these14 baseline images via call_febe0d975da64664862214910d667d0e. Exact SHA set is sealed in baselines/manifest.json. Approval covers existing UI and corrected rebate geometry, not unrelated redesign or passing pixel/functional gates. Compare may capture proposals; record cannot overwrite this approved set. New replacements need human review of exact captures. |

Material changes need a concrete comparison and approval: altering information visibility, navigation, action eligibility, mobile policy, global dimensions/palette/type, or merging the two runtime implementations. Bug fixes restoring UI-01–04 and safe identical-value extraction do not need repeated permission.

### Spirit delivery settlement and continuity — 2026-10-30

Confirmed: buyer death cancels pending work with no charge/bonus; no remaining jobs requires a new tracking-game win. Displayed quote identity is checked on hiring and private accepted terms remain fixed through delivery. Special income adds1point per earned credit once at Collector. See `implementations/ghost-delivery-progress.md` (game-design) and `ghost-functional-verification.json` (ui-system) for evidence and limits.


### 2026-10-31 — active forced RPS uses existing Comic frame (approved)

User approved forced-rps-ui-proposal.md: inventory-sized ComicPhaseFrame, equal opponent/stakes and hand-choice tracks; hide duplicate appraisal/trade behind active duel. No refusal/close while unresolved. Utility menus remain read-only and return to same server round/deadline. New screenshot C39 is implementation evidence, not approval to replace the sealed14 references.


### 2026-10-31 — confirmed merchant expressions, existing presentation

Implement approved2026-10-29 idle/smile/angry behavior through merchant-reactions.ts.650ms confirmed-entry display reuses portals without delaying commands/clocks; no optimistic smiles. Reduced motion skips hold. Selected item appraisalAccepted controls appraisal mood, independent of accumulated trust. Reuse current frame/CSS/assets;24 existing poses checked for load/rectangle/bottom clipping. Candidates C40/C41 do not alter approved14-image references.

## 2026-11-01 — approved pilot8 integration, no new visual identity

Use native new56 IDs/own merchant-palette PNGs in experimental catalog4 for the eight explicitly approved items. Seven non-activatable tools use existing supporting text in the existing inventory action area; no forged generic activation is allowed. Quotes/available price-check rights come from the server DTO. Sword edge is separately declared without revealing private guards. Inventory/GameTable/Comic controls, HUD/dock, spacing and all14 approved references remain unchanged.10 new fixture captures are evidence, not human baseline approval. Default3/full56 migration remains deferred pending completion/verification. See ../game-design/new56-pilot-verification.json.


## 2026-11-02 — finish approved forced-theft navigation

The existing approved RPS reconciliation extends to target selection and closed results. Reuse ComicMenu/ComicButton/CompactPager/Peek and inventory bounds; two equal tracks, fixed pagination, no expanding details. The phase-title handshake action opens a read-only internal drawer, not a seventh bottom-dock menu. Merchant choices submit exact visible item IDs; player choices use public player IDs only. Never reveal concealed goods or submitted hands. Active forced duel remains non-dismissible; utilities preserve round/deadline. When the drawer becomes unavailable on a phase/result transition, clear that navigation state so the main pane does not remain inert. Existing core2 gates, pending choices and server validation remain authoritative. No engine/rule/default/baseline changes. See theft-desk verification for current evidence.

2026-11-02 A05 follows the exact approved Collector spec (receipt in ../game-design/collector-wishlist-approval.json): same ComicMenu/ComicButton/CompactPager/ComicTooltip, HUD read-only entry without a seventh dock item, five equally spaced concealed slots, current bill before explicit confirmation, no scroll/new phase/new art. Visible finish-appraisal label warns of closing remaining rights; header height unchanged. Existing14-image reference approval is not extended to new candidate captures. Keep added preview option labels short enough to preserve native select width and existing screens.

2026-11-03 personal scoring UI: exact approved1551908 experiment now enabled for actual Comic main new rooms after48focused domain/runtime/eligibility/SSR/socket/main-entry checks,13new screen checks at1024/1440/1920,18peer menus and14sealed pixel comparisons. S13 uses shared inventory ComicPhaseFrame/ComicButton/Tooltip,9local playback stages and paged14metric details. Live Status consumes server known-only range; hidden appraisal receipts stay unresolved untilend, final score frozen. Six end menus readonly; legacy/no-flag fallback retained. C64–C72 are candidates, not promoted baselines. See implementations/personal-scoring-ui.md and docs/validation/personal-score-ui-2026-11-03. Independent final review,48remaining catalog effects/numbers, normal fullgame browser reconnect/ghosttracking scroll and multi-seed balance still outstanding; whole-game goal active.


## 2026-11-03 — approved Spirit entry and stable server feedback

User approved existing Spirit action in Status header next to Close. Existing eligibility/automatic dead entry and shared ComicButton geometry retained; close Status before opening GhostWorld. No phase/action/clock change. Runtime feedback is a shared fixed stack only while a game screen is mounted, using existing palette/corners and alert/status roles, never in document flow that shifts the100vh game. Entry/lobby feedback remains normal flow. Evidence: `../validation/normal-service-feedback-2026-11-03/verification.json`.


### 2026-11-09 — dock popup layout

User requests bottom dock utility menus as centred popups with equal dimensions and consistent typography/padding. Reuse ComicMenu and nonmodal switching/closing; keep gameplay visible. Shared utility footprint is max1120 by720, bounded by viewport and existing HUD/dock insets; phase frames remain inventory geometry.


2026-11-09 encounter omen: user requests moving the phase-banner omen to Status with its description always visible. Reused catalog omenText and Status effects section; removed details/summary from the game banner. No gameplay/config change. Graft native binding still unavailable; Hindsight tools not available. Browser/visual and narrow layout checks pending.


2026-11-09 rarity/certificate correction requested from screenshots: Comic rarity WebGL preserves source alpha, clears destination before redraw, ItemVisual background transparent; appraisal art clips within existing frame without scale overflow. Appraisal certificate moved out of FactSeals into always-visible banner preserving unknown/true/false knowledge; other FactSeals callers retain certificate. Legacy untouched. Browser shader/pixel verification pending; Graft unavailable due native architecture mismatch.

2026-11-09 certificate ribbon: user explicitly requests lower-right of product art. Moved existing certificate note into relic-art, positioned as crimson ribbon using existing tokens; preserves known/unknown inspection copy. No additional facts row. Browser visual verification pending.


2026-11-09 entry/lobby shared frame: user requests shared box/layout/padding/borders/text and no dropdown or scrolling. EntryLobbyFrame now wraps both; shared entry-lobby.css imported in main only. Lobby utility tabs expose players/bots/timers/rules, reuse paged RulesMenu and existing ready/start/timer/bot handlers; bot personality displayed directly. Desktop1440x720 browser Space2: entry1120x600/page1440x720, all lobby tabs exercised; old inherited lobby grid/column footer corrected after screenshots. Mobile/short-screen acceptance remains unverified. ui:test10 pass and Comic build pass; ui:check source drift and smoke/visual sandbox browser bootstrap failures persist. No baseline promotion.

2026-11-09 responsive four-seat correction: bound seat-list to content height with two equal rows and compact grid cards; mobile remove buttons below names. Actual browser Space3 four-player fixture at1440x720,1024x768,390x844: all4cards inside content, no card overflow, document equals viewport. Mobile screenshot /tmp/seats-mobile.png inspected. Removed unused old Rules details and its imports after build exposed TS6133; ui:test10pass. ui:check remains inventory drift; broad browser harness bootstrap failure separate from successful direct elevated browser checks. Other tabs and shorter mobile heights not reverified this pass.

2026-11-09 trade viewport correction: user requests full play area and centred table from overflowing screenshot. Trade tabletop now fixed between HUD and dock with equal horizontal frame insets; ancestor table-stage/scene-play zoom/transform/filter reset for this phase only. Preview browser initial measurements showed offset at1440/mobile before ancestor reset,1024 centred; final ancestor override still needs fresh geometry verification. No baseline updates.

2026-11-09 shared phase geometry: user extends full-play-area centring request to other screens including reward. Main ComicPhaseFrame removed from utility-dialog specificity group and receives independent full-area insets; frame-bottom now resolved on screen where utility-bottom exists. Reset inherited fit zoom on table-stage/scene-play across phases. Utility popup dimensions preserved. ui:test10/build pass. Browser preview iteration returned no matching frame nodes, so it is not geometry evidence; fresh stable fixture verification remains pending.

2026-11-09 dark tickets: user requests relocation to Bag. Existing TicketMeter moved from phase-banner Fortune to Bag shared header action beside Close; visible even with empty inventory, same count/help and force-buy gameplay. No duplicated meter or new component. Browser narrow-header geometry pending.

2026-11-09 Status pagination: user requests less dense status with pagination/no scroll. Reused CompactPager for3pages: summary+always-visible omen, active effects, trust/bonds; existing effect/merchant paging and action dialogs retained. Browser Space3 clicked1/3,2/3,3/3: drawer427/427 and page347/347 client/scroll heights on all3, no overflow in fixture. Build and ui:test10 pass. Ticket relocation source checked; browser fixture has no ticket meter (brokerage gate), so populated ticket browser proof not claimed. Mobile/dense-history fixtures unverified.

2026-11-09 theft entry relocation: user requests theft in Status. Existing theft/duel launcher moved from HUD to Status shared header, with visible label and same eligibility/disabled/state handler; switches from Status to existing theft desk. Collector HUD unchanged; gameplay and energy costs untouched. Browser interaction verification pending.

2026-11-09 appraisal title spacing: screenshot shows rarity label colliding with inspection frame. Replaced fixed specimen-data height with intrinsic height and6px top/12px bottom padding; rarity label block with6px title gap and1.5line-height. No text/gameplay changes. Browser geometry pending; Graft native architecture issue persists.

2026-11-09 followups: reward explicitly fills available height down to utility dock inset; vault carried/stored shelves now equal flexible rows and empty placeholders fill row height. Event choice titles reuse ComicTooltip with current cost/score preview; status options now always show authoritative effect/duration and reuse StatusTerm explanation instead of name-only text. No hidden truth disclosed. Browser tooltip/top-layer and viewport geometry checks pending.

2026-11-09 Comic event pagination: standard EventDecision split into story/choice/optional targets/review using shared CompactPager; ChoiceCards opt-in2-per-page, loans2-per-page retain selection. Review includes cost/score and applicable item/status/loan/recipient/fact/guess. Submit guarded to review page, navigation never submits. Existing event restrictions/tuck preserved. ComicTooltip portal now targets nearest dialog to remain visible in modal top layer. Browser isolated E41 fixture Space4 exercised1/4..4/4: no submit during navigation, confirm visible only4/4. Test fixture mounting initially failed import resolution/top-layer setup, corrected; not runtime failures. ui:test10/build pass; ui:check inventory drift and broad smoke/visual bootstrap failures persist. Specialized BloodPactEvent and every event/mobile viewport not fully verified; no all-events no-scroll claim. Prior reward-height/vault equal-row/tooltip followups included, browser geometry still pending.

2026-11-09 event overflow correction from screenshot: standard modal bounded by60px top/80px bottom with flex body and44px separate tuck footer. Hide entire form on story page (removes empty form chrome). PortalEventPreview retains actual per-choice states but pages one merchant at a time; title/portal content compact Comic layout. Added event-portals E08 reproducible preview. Actual browser Space5 screenshots inspected; all3event pages at1440x720,1024x768,390x844 have clientHeight==scrollHeight for modal/content/event/form (9checks). No choice submitted. Other event families/smaller viewports remain unverified, baseline set unchanged.

2026-11-09 event symmetry: user screenshots expose shrink-wrapped form and tiny review. Standard event content/form now fill content track; two equal grid choice cards with separate radio/text tracks, full-width centred review and confirmation, equal padding. Story copy grows within bounded body. Browser Space6 E08 desktop cards both462x233.406, form/review960wide; confirm910wide with25px equal sides. Mobile390x844 cards both300x176; modal/event/form clientHeight==scrollHeight at both sizes. No submit. ui:test10/build pass. Other event fixtures and all tooltips not reverified.

2026-11-09 event usability correction supersedes multi-step story/choice/review flow: user reports unusable separation of decision information. Standard event now shows description, choices/targets and selected effect/cost plus confirm together. Only long lists page; single mandatory choice hidden to avoid redundant selection, status lists1perpage to keep detailed descriptions readable. Added E108 boon preview. Browser initial desktop fixture confirms choices/targets/confirm simultaneous and no outer scroll; screenshot exposed status text cramped in two-card target list, so final1perpage/single-choice override applied. Final override still needs browser recheck; no all-viewport claim.

2026-11-09 event overlap/single-choice correction: hide choice panel whenever choices.length1 (including no-target events), keep result/cost/explicit confirm. Desktop context/form separate equal grid tracks; review its own row, cards have intrinsic minimum content height. Mobile compact context then controls. Browser Space8 E08/E108: single mandatory panel hidden onlyE108, choice/review overlap false both; modal576/576, event460/460, forms397/397 and336/336, visible cards77/77 client/scroll heights. No action submitted. Mobile final grid not verified.

2026-11-09 portal context/form overlap root cause: inherited cabinet.css event-form grid-column1/-1 survived the new two-column grid. Explicit direct-child context column1row2 and form column2row2; mobile context row2/form row3. Previous overlap check compared choice/review only and missed context/form. Fresh actual browser Space9 measured context/form rectangle intersection false at1440x720,1024x768,390x844; all modal/event/form client heights equal scroll heights. Shared layout only, no rule/action changes.

2026-11-09 user architecture correction: events must reuse bottom-menu components/sizing but keep event-specific ownership separate for future edits. Added EventMenu.tsx wrapping shared ComicMenu and separate event-menu.css imported only via main; shared header/frame selectors support sibling event placement outside.screen. E109 nonmodal BloodPact kept unchanged. Browser Space12 event and Bag both1120x496/header65; event padding18. Body initially overflowed24px under smaller shared bounds; final flex/body box-sizing correction applied, needs fresh browser recheck. ui:test/build pass before final CSS.

2026-11-09 event spacing/overflow followup: fixed12px padding for card/review/context text; auto summary rows replace fixed112px so long summaries fit. Responsive ChoiceCards uses1option/page<=600,2desktop; status descriptions no longer duplicated in review. Browser Space13 portal+boon desktop no overflow, boon mobile no overflow; portal mobile choice panel still89/150, so final compact mobile portal name/state row applied (requires fresh check). All measured card/review padding12px.

2026-11-09 short event layout: user screenshot E43 exposes excessive two-panel whitespace. Short single-choice nonportal/no-target events use compact centred column (max760) within unchanged shared ComicMenu. Description/review18px padding,12px gap, confirm directly below result. Added E43 preview. Browser Space14 measured padding18/18 andgap12/no outer overflow; initial widths differed1080/760 so strengthened shared simple-column selector after measurement; final width parity needs recheck.

2026-11-09 portal status border: user requests removing oval border from projected closing text. Event-menu portal-projection now plain text (border0/radius0/transparent), overriding global danger-text panel styling; enclosing card padding remains12px. Browser Space16 selected second portal inE08: text จะปิดด้วยตัวเลือกนี้, computed border0px/radius0px, card padding12px. No state/copy/rule change. Graft remains unavailable(native architecture mismatch); no Hindsight tool available.

2026-11-09 E113 spacing correction: nonportal multi-choice context now has44px heading matching choice legend and description panel fills remaining left track. Both context/form534x391 atx180/726,y197; description and first choice starty253, both columns endy588. Explicit shared gaps12px and all description/choice/review padding12px confirmed in browser Space17. Mobile390x844 drawer535/535,event511/511,form376/376,choice264/264,card148/148,review98/98 client/scroll heights. Added E113 preview. No gameplay change or baseline promotion. Graft unavailable due native architecture mismatch; Hindsight unavailable.

2026-11-09 other-player listing detail layout: user approved item identity, seller source, provenance, known facts and item details in the left column, with offer inputs, costs and action in the right column on wide screens; stack below 1000px. Reuses existing TradeListing content and ComicMenu; decision, validation and payment behavior are unchanged.

2026-11-09 trade tooltip and offer layout followup: the same TradeListing renders in both `#table-item-detail` and `#table-offers-detail`, so both dialogs use the approved item-left/offer-right split on wide screens and a single column below 1000px. Table item tooltips prefer a side placement when it fits, avoiding the table heading; exiting the pointer closes them.

2026-11-09 trade-phase unsold callout: the persistent name/appraisal box in the user's screenshot came from `Unsold`'s `figcaption`, not the tabletop `ComicTooltip`. Keep the same item identity and appraised credit, but show them in a side tooltip on the item art, available on hover/focus and dismissed on pointer exit.

2026-11-09 shared Comic interactions: hover/selection use the shared vermilion accent and selection fill; keyboard focus uses the rose 3px ring with 4px offset. Keep hover stationary without shadow/filter lift and use the existing 1px pressed response. ChoiceCards show one selected outline only. Tooltip dismissal follows the actual trigger boundary so display-contents wrappers cannot leave a hover hint hanging.

2026-11-09 tooltip exit correction: `ComicTooltip`'s `display:contents` wrapper does not reliably receive pointer-out when the pointer leaves an item. While open, a document capture `pointermove` closes the tooltip when the target is outside the actual trigger child. Existing click, blur, scroll, and Escape dismissal remain. The tooltip content stays noninteractive.

2026-11-09 unsold overlay root cause: the separate Unsold sibling leaked positioned item art and its appraisal tooltip above the fixed trade table. The existing offers ComicMenu now owns Unsold only while open, using shared Pager for the unsold items and trading subview. Buy/penalty/consignment handlers are preserved. Added trade&unsold=1 fixture with appraised stock and public peer listings; the earlier default trade fixture did not exercise this failure.
