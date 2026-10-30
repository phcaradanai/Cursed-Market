# Established comic design system

Derived from implemented inventory/status/market/ledger/rules/settings and latest user corrections; not a new visual identity. Token extraction retains the original values and selector specificity. Current sources outrank old PNGs and memory.

| Concern | Owner / established contract |
|---|---|
| Outer frame | `apps/comic/src/appraisal-client/comic-frame.css`; `--comic-frame-*` in `comic-tokens.css`; inventory is reference. Desktop side24, top HUD48+12, max1480, bottom dock+preview+12. Mobile keeps existing6px inset policy. |
| Corners | `--comic-radius:10px`; control/inset/dialog aliases point to it. Round navigation overlays are an explicit exception. |
| Rhythm | Existing `--layout-space-small:6px`, `--layout-space:12px`, `--layout-space-large:24px`; shared menu inset18. Use rows/containers, not unrelated per-element margins. |
| Header | `ComicMenu` / `comic-ui.css`:65px desktop,53px <=760; padding12px×18px desktop; standard title and close button, one bottom structural line. |
| Controls | `ComicButton`: black secondary, crimson primary, light thin border;40px menu controls,44px general target,46px inventory/sale action row. These are role-specific existing sizes, not one global height to force everywhere. Paired actions must match. |
| Palette | Screen `--comic-ink:#0a0d0e`, `--comic-red:#c51032`, `--comic-line:#e6e6e0`, `--comic-paper:#f2e8d8`; inherited root art/paper palette is retained, not substituted for screen controls. |
| Typography | Existing Noto Sans Thai/sans-serif screen headings and controls; respect Thai line height. Srisakdi/IM Fell imports are inherited assets, not approval to introduce new per-page typography. Record browser/font environment for pixel tests. |
| Art | 2D inked comic/manhua cutouts with each merchant/item palette. Bottom of portraits flush/clipped; top/left/right may overlap. No fade on art; mild ground shadow. No realistic replacement or duplicate item image. |
| Navigation | Persistent six-menu dock and preview selector work during utility/event inspection. Non-modal `ComicMenu`; pause trade detail/offers when a utility opens. Do not submit gameplay or reset clocks while peeking/navigating. |
| State | `FactSeals` uses only `knowledge`; seller claims are separate choices, never treated as verified facts. Existing `Share` owns eligibility, rebate validation and actions. |
| Hint | `ComicTooltip`: viewport clamp, hover and keyboard focus-visible, aria-describedby, Escape, mouseleave/click/blur/scroll close. No sticky mouse-click focus hint. |
| Quiet overlay | Shared `comic-overlay.css`, existing SVG family; opacity.42 idle/1 hover+focus/.75 no-hover touch. Hit area stays active. Reduced motion disables transitions. |
| Empty / long | Centre empty-state content in its actual panel. Use explicit pages/subviews for long game content, not scroll or expanding dropdown. Preserve all actions/unknown states. Entry/lobby and documentation may have different reading needs; audit before changing. |

## Reuse map

- `ComicMenu`, `ComicButton`, `CompactPager`, `ComicMeter`: menu/control primitives.
- `ComicPhaseFrame`: non-dismissible phase frame sharing the same outer geometry and header rules as ComicMenu; S08 is its first use. Keep destination-specific content inside, and retain explicit server actions. S08 paired decision controls use the existing48px layout-row token/role.
- `ComicDestination`: established market destination sign; not a new universal tab style.
- `FactSeals`, `ChoiceCards`, `Share`, `TradeListing`, `Trades`: known facts, native accessible radios and existing game decisions.
- `MerchantEventPortrait`, `merchant-portrait-frames`: per-character consistent scale; use existing frames, not invented ones.
- `ItemSalePanel`: layout/composition around existing facts and Share; no parallel rule implementation.
- `GameDialog` and `DialogFeedback`: focus, cancellation, busy/error handling. Preserve their semantics when composing.
- `main.tsx`: owns CSS imports, last shared frame rule. Component imports must remain safe for Node SSR tests.

## Symmetry means measured contents

1. Compare `x,y,width,height` with inventory at the same viewport.
2. Equal outside padding, paired action widths/heights and repeated row gaps.
3. Match the centre of the **entire** +/-/input group and numeric input to the action pair. Keep coin/info icons outside that measuring group.
4. Assert minus→input and input→plus gaps equal; inherited min-width must not overflow the grid track. The prior bug (44px buttons in40px tracks) must fail regression even if the input centre matches.
5. Distinguish focus rings from decorative double borders; retain visible keyboard focus on controls.

No per-screen brush ribbons, offwhite form controls, ornamental borders or repeated dividers unless the user explicitly approves a product change after seeing the existing peer screen. Comic atmosphere comes chiefly from existing art, hierarchy and shared black/red UI.

S09 also uses ComicPhaseFrame with the inventory outer bounds and65px shared header. PostRewardScreen owns only content; VaultPanel retains custody actions; ReadyForNext shares the existing command across S09/classic/survival. Use equal44px stepper and transfer controls with common gaps, paged2-item shelves, and a48px footer action. Solid empty-slot lines, no extra section boxes/dropdowns. This does not authorize redesigning other screens or migrating root interest rules.
