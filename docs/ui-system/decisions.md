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
2026-11-09 shared Comic interactions: hover/selection use the shared vermilion accent and selection fill; keyboard focus uses the rose 3px ring with 4px offset. Keep hover stationary without shadow/filter lift and use the existing 1px pressed response. ChoiceCards show one selected outline only. Tooltip dismissal follows the actual trigger boundary so display-contents wrappers cannot leave a hover hint hanging.

2026-11-09 tooltip exit correction: `ComicTooltip`'s `display:contents` wrapper does not reliably receive pointer-out when the pointer leaves an item. While open, a document capture `pointermove` closes the tooltip when the target is outside the actual trigger child. Existing click, blur, scroll, and Escape dismissal remain. The tooltip content stays noninteractive.
