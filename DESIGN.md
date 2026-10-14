---
name: Cursed Market
description: Working v0.4/v0.5 realistic-card game polished toward the realistic-card concept; legacy auction tokens retained for independent LAN builds.
colors:
  table: "#211b18"
  panel: "#302721"
  cream: "#f2e4cc"
  bronze: "#a48251"
  table-muted: "#c7b79c"
  table-line: "#5e4e3a"
  paper-ink: "#30271f"
  paper-muted: "#67533e"
  amber: "#e9b765"
  amber-hover: "#f2ce8a"
  focus: "#f2ca83"
  danger: "#e4a99a"
  danger-wash: "#422a27"
  positive: "#a5c6a0"
  panel-raised: "#3a2f27"
  bronze-bright: "#c9a46a"
  frame-line: "#7d6342"
  parchment-light: "#f6ebd6"
  parchment-edge: "#e8d6b6"
  steel: "#2f3d4d"
  steel-line: "#6683a2"
  oxblood: "#4f1b17"
  oxblood-line: "#9b4436"
  energy: "#8fb8e6"
  life: "#e48f84"
  seat-1: "#7aa6d6"
  seat-2: "#d4806f"
  seat-3: "#8fbf8a"
  seat-4: "#b596d6"
  paper-line: "#97836a"
  paper-field-line: "#80694f"
  risk-medium: "#7d4a10"
  accent: "#8b3925"
  accent-hover: "#6d2b1c"
  ink: "#29251f"
  muted: "#655c50"
  ground: "#f3eee3"
  paper: "#fffaf0"
  line: "#c6bcaa"
  field-line: "#877b69"
  hover-wash: "#e7decd"
  notice-wash: "#e7ddca"
  error-ink: "#772d1e"
  error-wash: "#f1ddd1"
  finding-ink: "#34432a"
  finding-wash: "#e5ead9"
  symbol-ink: "#65533b"
typography:
  brand:
    fontFamily: '"Cormorant Garamond", "Noto Serif Thai", serif'
    fontSize: "clamp(30px, 4vw, 40px)"
    fontWeight: 600
    lineHeight: 1.1
  appraisal-headline:
    fontFamily: '"Noto Serif Thai", serif'
    fontSize: "clamp(28px, 3vw, 40px)"
    fontWeight: 600
    lineHeight: 1.55
  appraisal-title:
    fontFamily: '"Noto Serif Thai", serif'
    fontSize: "21px"
    fontWeight: 600
    lineHeight: 1.55
  appraisal-section:
    fontFamily: '"Noto Serif Thai", serif'
    fontSize: "26px"
    fontWeight: 600
    lineHeight: 1.55
  appraisal-body:
    fontFamily: '"Noto Sans Thai", sans-serif'
    fontSize: "16px"
    lineHeight: 1.7
  appraisal-label:
    fontFamily: '"Noto Sans Thai", sans-serif'
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.7
  appraisal-small:
    fontFamily: '"Noto Sans Thai", sans-serif'
    fontSize: "15px"
    lineHeight: 1.7
  appraisal-caption:
    fontFamily: '"Noto Sans Thai", sans-serif'
    fontSize: "13px"
    lineHeight: 1.5
  appraisal-resource:
    fontFamily: '"Noto Sans Thai", sans-serif'
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1.3
  headline:
    fontFamily: 'Tahoma, "Noto Sans Thai", sans-serif'
    fontSize: "clamp(23px, 2.5vw, 30px)"
    lineHeight: 1.5
  title:
    fontFamily: 'Tahoma, "Noto Sans Thai", sans-serif'
    fontSize: "19px"
    lineHeight: 1.55
  body:
    fontFamily: 'Tahoma, "Noto Sans Thai", sans-serif'
    fontSize: "16px"
    lineHeight: 1.65
  label:
    fontFamily: 'Tahoma, "Noto Sans Thai", sans-serif'
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.65
  supporting:
    fontFamily: 'Tahoma, "Noto Sans Thai", sans-serif'
    fontSize: "14px"
    lineHeight: 1.65
rounded:
  appraisal-control: "6px"
  appraisal-inset: "8px"
  appraisal-frame: "10px"
  appraisal-pill: "999px"
  art-card: "12px"
  control: "4px"
  container: "0px"
spacing:
  inline: "8px"
  compact: "12px"
  regular: "16px"
  roomy: "18px"
  appraisal-inset: "20px"
  section: "24px"
  stack: "30px"
  appraisal-wide: "32px"
components:
  appraisal-button-primary:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.paper-ink}"
    rounded: "{rounded.appraisal-control}"
    padding: "8px 16px"
  appraisal-button-primary-hover:
    backgroundColor: "{colors.amber-hover}"
    textColor: "{colors.paper-ink}"
  appraisal-button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.cream}"
    rounded: "{rounded.appraisal-control}"
    padding: "8px 16px"
  appraisal-button-secondary-hover:
    backgroundColor: "{colors.panel}"
  appraisal-button-danger:
    backgroundColor: "{colors.oxblood}"
    textColor: "{colors.cream}"
    rounded: "{rounded.appraisal-control}"
    padding: "8px 16px"
  appraisal-button-inspect:
    backgroundColor: "{colors.steel}"
    textColor: "{colors.cream}"
    rounded: "{rounded.appraisal-control}"
    padding: "8px 16px"
  appraisal-button-appraise:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.paper-ink}"
    rounded: "{rounded.appraisal-control}"
    padding: "8px 16px"
  appraisal-frame:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.cream}"
    rounded: "{rounded.appraisal-frame}"
  appraisal-hud:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.cream}"
    rounded: "{rounded.appraisal-frame}"
    padding: "16px 24px"
  appraisal-seat-disc:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.cream}"
    rounded: "{rounded.appraisal-pill}"
    width: "40px"
    height: "40px"
  appraisal-button-paper-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.paper}"
    rounded: "{rounded.appraisal-control}"
    padding: "8px 16px"
  appraisal-button-paper-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  appraisal-button-paper-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.paper-ink}"
    rounded: "{rounded.appraisal-control}"
    padding: "8px 16px"
  appraisal-button-paper-secondary-hover:
    backgroundColor: "{colors.hover-wash}"
  appraisal-input:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.cream}"
    rounded: "{rounded.appraisal-control}"
    padding: "8px 12px"
    width: "100%"
  appraisal-input-paper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.paper-ink}"
    rounded: "{rounded.appraisal-control}"
    padding: "8px 12px"
    width: "100%"
  appraisal-reading:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.paper-ink}"
    rounded: "{rounded.art-card}"
    padding: "{spacing.section}"
  appraisal-portal:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.cream}"
    rounded: "{rounded.art-card}"
  appraisal-item-thumb:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.cream}"
    rounded: "{rounded.art-card}"
    padding: "0 0 10px"
  appraisal-stock-selection:
    backgroundColor: "transparent"
    textColor: "{colors.cream}"
    rounded: "{rounded.appraisal-control}"
    padding: "8px 16px"
  appraisal-event:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.cream}"
    padding: "{spacing.section}"
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "9px 18px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "{colors.paper}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "9px 18px"
  button-secondary-hover:
    backgroundColor: "{colors.hover-wash}"
  button-text:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "9px 5px"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "9px 12px"
    width: "100%"
  relic-choice:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.container}"
    padding: "{spacing.roomy}"
  phase-navigation:
    textColor: "{colors.muted}"
    typography: "{typography.supporting}"
  private-finding:
    backgroundColor: "{colors.finding-wash}"
    textColor: "{colors.finding-ink}"
    padding: "14px 18px"
---

# Design System: Cursed Market

## Overview

**Creative North Star: "Dimensional appraisal table"**

The implemented table pairs realistic merchant portraits and artifact art with a lamp-lit charcoal ground, ornamented bronze frames and a parchment decision panel. The 2026-10-14 polish moved the runtime toward the realistic-card concept: a framed HUD bar, the merchant beside the item, colour-coded inspect/appraise/buy actions, an oxblood Dark Market band and a card-tray inventory. Thai labels keep inspection, appraisal, accepted NPC quote, contract and purchase distinct. This descriptive north star records the active goal's working card direction; it is not a user-approved production identity.

The appraisal source authority is `src/appraisal-client/styles.css`, `App.tsx` and `components.tsx`. The independent legacy auction UI in `src/client` keeps its pale ground, dark ink, rust controls and neutral SVG relic symbols. All existing legacy frontmatter tokens remain available; the complete prior documents in `docs/art/appraisal-v0.4/legacy-design/` are unchanged. Layout direction belongs to `docs/art/appraisal-v0.4/direction.md`, and product scope belongs to `PRODUCT.md`.

On 2026-10-14 the user requested UI/UX polish and authorized any useful tools, superseding the earlier **“หยุดตรวจภาพ ใช้ผลตรวจเดิม”** restriction. Dev-server review with live bot seats covered entry, lobby, portals, appraisal, inventory, trade, statuses and reveal at 1440×900; reveal, portals, appraisal and Collector results at 375×812; and results at 1280×800. The production bundle was then smoke-tested at 375×812 (lobby, portals, appraisal, trade, reconnecting masthead, no horizontal overflow) and 1000×800 (appraisal). Not seen in a browser: a mid-run spectator, a sellable Dark Market row, E48+ consequence events, the urgent countdown and a v0.4 room. It does not certify screen-reader output, final art quality, brand approval or human enjoyment.

**Key Characteristics:**

- Realistic merchant and single-item art identifies the subject without revealing hidden truth.
- Charcoal information regions and cream appraisal panels use separate foreground and action colors.
- Thai reading text, visible native controls and explicit unknown facts support timed decisions.
- Ornamented bronze frames (double rule plus SVG corner brackets) mark the key surfaces: HUD, item desk, Dark Market, event, results and the entry portrait. Supporting panels use a single bronze rule.
- One bounded artifact arrival effect and short state transitions define the implemented motion.
- Legacy auction primitives remain scoped to their independent interface.

## Colors

The frontmatter owns exact values. Appraisal colors describe warm table, paper and economic-action roles; legacy tokens retain their original names and values. The sidecar's synthesized tonal ramps are panel previews, not implemented color scales.

### Primary

- **Amber / Hover Amber** (`amber`, `amber-hover`): filled primary actions on the charcoal table, decision-cost emphasis, selected item outlines and countdown numerals.
- **Rust / Deep Rust** (`accent`, `accent-hover`): primary actions, carets, checkboxes, focus and selection inside the cream appraisal panel. The legacy interface also uses this pair for primary actions and commitment emphasis.
- **Focus Amber** (`focus`): keyboard focus on appraisal table controls; the paper panel overrides it with Rust.

### Secondary

- **Worn Bronze** (`bronze`): outlined table controls and scrollbar thumbs.
- **Penalty Text / Penalty Wash** (`danger`, `danger-wash`): named consequences, danger actions and alerts on the table.
- **Positive Text** (`positive`): named beneficial statuses on the table.

### Neutral

- **Warm Charcoal / Raised Charcoal** (`table`, `panel`): appraisal page ground, portraits' card bodies, fields, events and notices.
- **Cream / Table Muted** (`cream`, `table-muted`): table foreground and supporting text.
- **Table Divider** (`table-line`): fine regional separation.
- **Paper Ink / Paper Muted / Paper Divider** (`paper-ink`, `paper-muted`, `paper-line`): foreground, supporting text and strokes inside the appraisal reading panel.
- **Pale Paper / Hover Wash** (`paper`, `hover-wash`): paper fields and secondary hover fill, shared with the legacy palette.
- **Legacy Dark Ink / Muted Ink / Warm Ground** (`ink`, `muted`, `ground`): legacy text, supporting text and page ground only.
- **Legacy Divider / Field Stroke / Notice Wash** (`line`, `field-line`, `notice-wash`): legacy separation, fields and messages or demand.
- **Legacy Symbol Ink** (`symbol-ink`): neutral SVG family drawings.

Error Ink/Wash and Finding Ink/Wash (`error-ink`, `error-wash`, `finding-ink`, `finding-wash`) preserve the legacy semantic pairs. Appraisal paper danger text also uses Error Ink. These are semantic treatments, not extra brand accents.

Appraisal CSS reuses short custom-property names: `table-muted` maps to its `--muted`, `table-line` to its `--line`, and `paper-ink` to its `--ink`. The frontmatter's `muted`, `line` and `ink` keep legacy values. Do not treat the two entries' root properties as a shared theme.

**The Surface Pair Rule.** Use the foreground, action and focus colors of the current table or paper surface together; do not mix their text treatments.

## Typography

**Appraisal Body and UI Font:** self-hosted Noto Sans Thai with sans-serif fallback. **Appraisal Heading Font:** self-hosted Noto Serif Thai with serif fallback. **Latin Brand Font:** self-hosted Cormorant Garamond with Noto Serif Thai and serif fallbacks. Font files use `font-display: swap`; exact Google Fonts origins and OFL license files are recorded in `docs/art/appraisal-v0.4/fonts.json`. No runtime font service is required.

**Legacy Body and UI Font:** Tahoma, with Noto Sans Thai and sans-serif fallbacks. The legacy bundle does not define webfont faces; its typography remains independent.

### Hierarchy

- **Brand:** the Latin masthead token; on narrow screens its size becomes 30px.
- **Appraisal Headline:** normal phase heading; entry copy has its own observed clamp of 32–52px and becomes 34px on narrow screens.
- **Appraisal Section:** section heading; the narrow-screen default becomes 24px.
- **Appraisal Title:** default task/item heading. Portal headings use 20px, Dark Market headings 18px and the narrow merchant heading 22px.
- **Appraisal Body / Label:** reading and controls use body rhythm; labels add semibold weight. Paragraphs have a maximum measure of 70ch.
- **Legacy Headline / Title / Body / Label / Supporting:** retain the original auction hierarchy and line spacing, including browser bold heading defaults.

Appraisal headings use balanced wrapping. Prices, resources, timers and score tables use tabular numerals; participant names and trade headings wrap where required. The source declaration of the appraisal title is 21px; the earlier 22px documentation referred only to the narrow merchant override.

**The Legibility Rule.** Preserve Thai line spacing and wrap user names before narrowing or clipping meaningful text.

## Layout

The game screen opens with a framed HUD bar: phase title and room code, countdown pill, credit/energy/life/score readouts with icons, and a roster of seat discs whose badges show done, paused or spectator state (with hidden text, never colour alone). During appraisal the main column is a stage: a 232px merchant portrait card (quote, hint, recovery deal) beside stock tabs with thumbnails and the item desk. The desk has a centred title band, square art that stays in view while the parchment column scrolls, and the parchment facts/actions panel. Portal cards crop portraits to 4:3 so, when no event is pending, every enter button sits in the first 1440×900 viewport. Inventory is a horizontally scrolling card tray under a centred title band.

The appraisal shell is centered with a maximum width of 1440px and padding of 16px 32px 20px. The entry uses two columns and an 1100px content limit. The play table has a flexible main region and a 312px side column (Dark Market, statuses, notes) with a 28px gap. The desk pairs artifact art with the cream reading panel. Portal choices use three columns; inventory uses a horizontally scrollable row, and result tables scroll within their own container.

At 1100px the side column becomes 272px, the merchant card turns into a 104px-portrait row above the desk and events stack to one column. At 900px the table becomes one column; during portal choice the market is placed first, and the side panels sit in an auto-fit row. At 640px the shell uses 16px padding, the masthead keeps one line (online dot and icon-only sound toggle keep their accessible names), resources share one row, the roster scrolls, portals become 104px-portrait rows, the desk stacks with art capped at 260px, the appraise button takes a full row and inventory cards narrow to 136px. Only 1440, 1280 (results), 1000 and 375 widths were viewed; the 900px breakpoint remains a source rule, not proof of rendered fit.

The legacy shell retains a 1216px maximum width and 32px horizontal padding. Its 760px breakpoint changes padding to 20px and stacks entry, lobby, market and phase headers. Legacy relic choices remain two columns, actions wrap and score tables scroll. Its marketplace keeps the flexible work area, 265px participant column and 48px gap above that breakpoint.

Spacing is practical rather than a strict modular scale. Reused spacing steps are in frontmatter; the sidecar names the separate appraisal and legacy breakpoints.

## Elevation & Depth

Key appraisal surfaces use a bronze frame: a 1px frame-line border, an inset double rule (4px panel gap, 1px translucent bronze) and 16px SVG corner brackets drawn as crisp geometry. Supporting panels (merchant, portals, statuses, trade listings, inventory cards) use only the 1px frame line. The page ground is the table colour lit by a soft warm radial from the top and darkened toward the bottom; no stripe or grain textures. Portrait/art frames add a soft offset shadow (`0 12px 28px rgb(0 0 0 / .3)`); the cream reading panel is a tonal surface without that shadow. New desk art has one arrival animation, from brightness 0.82 and a lower shadow (`0 4px 12px rgb(0 0 0 / .2)`) to its visible resting state, lasting 320ms with `cubic-bezier(.16,1,.3,1)`. Reduced-motion disables the animation. Buttons and portal cards transition fill, border and colour over 160–220ms with the same ease-out curve; hover-capable pointers also lift portal cards 3px. Reduced-motion removes transitions and the lift.

The legacy interface remains flat, with pale fields, message washes and thin rules. It has no authored shadows or animated transitions.

**The Artifact Depth Rule.** Keep the offset shadow on the artifact frame and entry portrait, and the arrival effect on the artifact frame; general information regions use their existing tonal separation and dividers.

## Shapes

Appraisal controls use the appraisal control radius; art frames, portals, the reading panel and inventory thumbnails use the art-card radius. Artifact illustrations are square, and portal portraits have a 4:5 aspect ratio above the compact mobile layout. Art clips within its frame. Fine borders are 1px; selected stock/inventory controls use a 2px amber outline with a 2px offset. Keyboard focus is a separate 3px outline with a 3px offset.

Legacy controls retain their control radius, while relic choices and message surfaces have square corners. Selected relics add a 1px rust outline; focus uses a 3px rust outline with a 4px offset. Legacy family symbols remain 64px inline SVGs with a 2px rounded stroke.

## Components

### Buttons

Appraisal table buttons have a 44px minimum height, bronze outline, transparent fill, inherited cream text and an optional leading 20px icon. Primary buttons use a short amber metal gradient with Paper Ink and bold weight. Danger buttons use Oxblood with cream text. Inspect buttons on every surface use Steel with a steel line; the desk's appraise button uses a gold gradient with Paper Ink and the buy button keeps Rust. The price field is a stepper: −/+ 44px buttons around a centred 22px numeral, with the native spinner hidden. Paper-panel primary buttons use Rust with Pale Paper; paper secondary buttons use Paper Ink, Paper Divider and Hover Wash. Disabled buttons, fields and selects use 0.55 opacity and a blocked cursor. Focus follows the active surface's palette.

Legacy outlined secondary, filled rust primary and underlined text variants keep the 44px minimum height, immediate hover and original padding. Their focus and disabled treatments remain separate from the appraisal surface.

### Inputs / Fields

Appraisal text, number and select controls have a 46px minimum height and visible labels. Table fields use Raised Charcoal, Cream and Worn Bronze; paper fields and the price stepper use Pale Paper, Paper Ink and Paper Field Line (`paper-field-line`, at least 3.6:1 against the parchment so the field boundary stays visible). Carets, native checkbox accents and selection change with the surface. The native checkbox is 20px within a label row with a 44px minimum height. Read-only room-code copying announces success or selects the field with manual-copy guidance.

Legacy fields retain pale fill, original field stroke and native rust radio accents. The sidecar supplies independent field snippets with declared font and palette fallbacks.

### Cards / Containers

Portal cards pair portrait, actual merchant identity, hinted item type, contract hint and a native enter button. A closed portal dims and grays the portrait and includes disabled-action wording. The desk separates square artifact art from cream facts and price controls. Inventory cards use a shared current `คลัง #n` identity; Dark Market sale rows use that same identity and viewer-known facts before immediate transfer.

General sections use fine rules. Event decisions use a charcoal fill; mandatory consequences use the penalty wash. Notices, loading, errors, empty stock/inventory, paused/done seats, reconnect and replaced-tab guidance have explicit text. The source blocks duplicate decisions while awaiting acknowledgment; the server owns final action validation. The sidecar's reading-panel example uses unknown facts from source and omits raster art rather than inventing a replacement asset.

Legacy relic choices retain paper fill, a thin divider border, native radio and selected outline. Private findings and errors keep their separate semantic washes.

### Icons

`src/appraisal-client/icons.tsx` holds one authored family on a 24px grid with a 1.6 stroke and round joins: coin, energy, life, score, timer, inspect, appraise, buy, portal, pass, buff, debuff, event, market, minus, plus and sound. Icons are always `aria-hidden`; the adjacent text names the meaning. Buff and debuff differ by shape (solid ring with up chevron vs dashed ring with down chevron) as well as colour.

### Navigation

The appraisal phase header reports the current phase, encounter, resources and deadline; it is not a clickable stepper. Stock choices and inventory thumbnails are native buttons with `aria-pressed`, a selected outline and explicit item labels. Phase changes have a concise status message; countdown ticks have `aria-live="off"`. Native disclosure summaries expose rules, notes and sharing; statuses are a badge list whose names open peek cards.

The legacy phase row remains informational, with current phase shown through rust, bold weight, underline and `aria-current="step"`. It wraps at its own breakpoint.

### Choice cards and game terms (2026-10-14)

The appraisal client has no `<select>`. Every pick (event choice, target item, status, fact, guess, trade swap, lobby timing and voice mode) is a `ChoiceCards` group in `src/appraisal-client/lore.tsx`: native radios inside label cards, a ring indicator plus amber border for the selected card, a danger variant for consequence choices, item art at 48px when the option is an item, and a compact chip grid for short options. Each event choice card states its own cost and outcome, so the player compares options before confirming.

Status, item and merchant names inside game text are highlighted terms (`Rich`, `StatusTerm`, `ItemTerm`, `NpcTerm`): buff green, debuff red, item amber and merchant bronze, each with an icon or dotted underline so colour is never the only signal, and paper-panel variants on the parchment desk. Hover, keyboard focus or tap opens a fixed peek card clamped to the viewport: status name, good/bad tag, plain effect and duration; or item art, value range, viewer-known facts and possible effects; or merchant portrait and hint. Inside labels and buttons the term is a passive span with hover-only peek, because nested controls are invalid. Peek cards fade in over 140ms and reduced motion removes it.

### Phase focus, event dialog and result cards (2026-10-14)

Each phase shows only what its decision needs. The HUD adds a one-line amber hint under the phase title. Portal choice shows portals, the full Dark Market and statuses. Appraisal shows the merchant and a three-step desk: inspect, appraise, buy. Only one step panel is visible; each step tab shows its state, a judged item opens on Buy, and spent inspections move the desk to Appraise. Statuses and a one-line Dark Market summary sit beside it, and the inventory is a closed drawer. Trade shows unsold duty, trades, the full market, the inventory and other players. Reveal and results use a single column. The rules disclosure stays at the bottom in every phase.

An offered event blocks table actions, so it opens as a modal dialog (`EventModal` in `feedback.tsx`) over a dimmed, inert table. The player can tuck it away to study the table; a bottom pill brings it back. Results arrive as toast cards in the top corner (top on phones). `outcomeBetween` diffs consecutive private views and reports inspection reveals, items gained or lost, statuses, credits, energy and life, merchant detection, incoming offers, trade replies and auction results. Engine notes such as "ทายถูก! … ได้ 2 เครดิต" become the card title, and a phase change becomes the title with its hint. Tone is good (green), bad (oxblood wash) or info. Cards pause on hover or focus and dismiss after 6.5s with a thin timer bar. Reduced motion removes the motion and the timer bar. The collapsed "ประวัติผลล่าสุด" keeps the last six notes.

Event and status descriptions in `content.ts` are player-facing plain Thai: one or two sentences naming the cost and result, without implementation notes.

### Art, knowledge and commitments

The manifest in `docs/art/appraisal-v0.4/generation-prompts.json` records six independently generated NPC portraits and ten item images, with exact prompts, origins and hashes. Item image selection depends on kind, preserving the same art for genuine/fake and cursed/safe states. The concept image in `docs/art/concepts/v0.4/realistic-card.png` is a critique reference, not an approved comp or a source of sliced UI assets. Font provenance is separate from generated-art provenance.

Item facts come only from the current viewer's DTO and name unknown attributes explicitly. Appraisal risk is a visible-data range until the real base is known. Offered appraisal, NPC acceptance and purchase quote have distinct labels. Contracts state discount, status, duration and forced conditions before commitment; E08 associates the terms with each actual offered merchant. Incoming trade swaps disclose item identity and viewer-known facts before acceptance, without carrying another viewer's private inspection facts.

Optional synthesized sound starts off and is enabled by a player's gesture. Source feedback uses a 120ms gain decay and stops the oscillator at 130ms; it does not provide ambient loops or character animation.

**The Property Scope Rule.** An inspection of one attribute never visually implies knowledge of another attribute; illustrations identify item kind without exposing hidden facts.

## Do's and Don'ts

### Do:

- **Do** preserve visible Thai labels, explicit focus and wrapping names.
- **Do** keep appraisal and legacy token scopes separate when adding a screen.
- **Do** show item identity, viewer-known facts, cost, accepted quote and exact contract before commitment.
- **Do** use the same item art across hidden attribute combinations and keep its prompt provenance.
- **Do** preserve the reduced-motion override and opt-in sound default.
- **Do** describe source/test evidence separately from rendered quality and human fun.

### Don't:

- **Don't** communicate authenticity, curse, readiness or errors through color alone.
- **Don't** expose another viewer's private inspection facts through text, image variants or preview data.
- **Don't** slice the critique concept into functional UI assets or call it an approved comp.
- **Don't** treat the working realistic-card direction as final brand approval.
- **Don't** treat the 2026-10-14 viewport review as screen-reader, art-quality or brand validation.
