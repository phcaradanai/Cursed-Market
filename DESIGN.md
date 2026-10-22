---
name: Cursed Market
description: The Threshold. The appraisal ledger floats over a drowned Three.js void in black, orpiment gold and verdigris. Legacy auction tokens are kept for the independent LAN client.
colors:
  void: "#05090a"
  table: "#080c0d"
  field: "#0a0f10"
  panel: "rgb(13 18 19 / .9)"
  panel-solid: "#0f1415"
  panel-raised: "#182021"
  panel-gap: "#0b1011"
  cream: "#ece3cc"
  table-muted: "#b8b39f"
  table-line: "#2c3a37"
  bronze: "#a8874a"
  bronze-bright: "#d8b25f"
  frame-line: "#6c5730"
  frame-inner: "rgb(216 178 95 / .3)"
  orpiment: "#d4ad55"
  orpiment-hover: "#e3c06c"
  orpiment-ink: "#17120a"
  amber: "#d9b45a"
  amber-hover: "#ecd08a"
  verdigris: "#5fb8a0"
  focus: "#8fe0c6"
  ichor: "#9a7cc4"
  danger: "#e8a091"
  danger-wash: "#2a1411"
  oxblood: "#4a1410"
  oxblood-line: "#a3402f"
  positive: "#9fd0b0"
  energy: "#8fc3e8"
  life: "#e2867a"
  steel: "#163330"
  steel-line: "#4f9484"
  seat-1: "#7aa6d6"
  seat-2: "#d4806f"
  seat-3: "#8fbf8a"
  seat-4: "#b596d6"
  parchment-light: "#eee5cf"
  parchment-edge: "#d9caa8"
  paper-ink: "#30271f"
  paper-muted: "#67533e"
  paper-line: "#97836a"
  paper-field-line: "#80694f"
  paper: "#fffaf0"
  accent: "#8b3925"
  accent-hover: "#6d2b1c"
  error-ink: "#772d1e"
  hover-wash: "#e7decd"
  ink: "#29251f"
  muted: "#655c50"
  ground: "#f3eee3"
  line: "#c6bcaa"
  field-line: "#877b69"
  notice-wash: "#e7ddca"
  error-wash: "#f1ddd1"
  finding-ink: "#34432a"
  finding-wash: "#e5ead9"
  symbol-ink: "#65533b"
typography:
  chapter:
    fontFamily: '"IM Fell English", "Srisakdi", "Noto Serif Thai", serif'
    fontSize: "clamp(32px, 5.4vw, 72px)"
    fontWeight: 700
    lineHeight: 1.3
  phase-display:
    fontFamily: '"IM Fell English", "Srisakdi", "Noto Serif Thai", serif'
    fontSize: "clamp(30px, 2.9vw, 42px)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "0.01em"
  entry-display:
    fontFamily: '"IM Fell English", "Srisakdi", "Noto Serif Thai", serif'
    fontSize: "clamp(32px, 4vw, 52px)"
    fontWeight: 700
    lineHeight: 1.4
  merchant-name:
    fontFamily: '"IM Fell English", "Srisakdi", "Noto Serif Thai", serif'
    fontSize: "23px"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "0.01em"
  brand:
    fontFamily: '"IM Fell English", "Srisakdi", serif'
    fontSize: "clamp(24px, 2.6vw, 32px)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "0.1em"
  appraisal-section:
    fontFamily: '"Noto Serif Thai", serif'
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.5
  appraisal-title:
    fontFamily: '"Noto Serif Thai", serif'
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.5
  appraisal-body:
    fontFamily: '"Noto Sans Thai", sans-serif'
    fontSize: "16px"
    fontWeight: 400
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
  appraisal-peek:
    fontFamily: '"Noto Sans Thai", sans-serif'
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.55
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
  art-card: "12px"
  portal: "16px"
  appraisal-pill: "999px"
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
    backgroundColor: "{colors.orpiment}"
    textColor: "{colors.orpiment-ink}"
    rounded: "{rounded.appraisal-control}"
    padding: "8px 16px"
    height: "44px"
  appraisal-button-primary-hover:
    backgroundColor: "{colors.orpiment-hover}"
    textColor: "{colors.orpiment-ink}"
  appraisal-button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.cream}"
    rounded: "{rounded.appraisal-control}"
    padding: "8px 16px"
    height: "44px"
  appraisal-button-inspect:
    backgroundColor: "{colors.steel}"
    textColor: "{colors.cream}"
    rounded: "{rounded.appraisal-control}"
    padding: "8px 16px"
  appraisal-button-danger:
    backgroundColor: "{colors.oxblood}"
    textColor: "{colors.cream}"
    rounded: "{rounded.appraisal-control}"
    padding: "8px 16px"
  appraisal-input:
    backgroundColor: "{colors.field}"
    textColor: "{colors.cream}"
    rounded: "{rounded.appraisal-control}"
    padding: "8px 12px"
    height: "46px"
    width: "100%"
  appraisal-input-paper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.paper-ink}"
    rounded: "{rounded.appraisal-control}"
    padding: "8px 12px"
    width: "100%"
  appraisal-leaf:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.cream}"
    rounded: "{rounded.appraisal-frame}"
    padding: "16px 24px"
  appraisal-reading:
    backgroundColor: "{colors.parchment-light}"
    textColor: "{colors.paper-ink}"
    rounded: "{rounded.appraisal-inset}"
    padding: "22px"
  appraisal-portal:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.cream}"
    rounded: "{rounded.portal}"
    padding: "12px 12px 0"
  appraisal-floating:
    backgroundColor: "{colors.panel-raised}"
    textColor: "{colors.cream}"
    rounded: "{rounded.appraisal-frame}"
    padding: "12px 14px"
  appraisal-choice-card:
    backgroundColor: "rgb(0 0 0 / .2)"
    textColor: "{colors.cream}"
    rounded: "{rounded.appraisal-inset}"
    padding: "10px 12px 10px 38px"
    height: "44px"
  appraisal-trust-ring:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.cream}"
    rounded: "{rounded.appraisal-frame}"
    padding: "12px 16px"
  appraisal-seat-disc:
    textColor: "{colors.cream}"
    rounded: "{rounded.appraisal-pill}"
    width: "40px"
    height: "40px"
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
  private-finding:
    backgroundColor: "{colors.finding-wash}"
    textColor: "{colors.finding-ink}"
    padding: "14px 18px"
---

# Design System: Cursed Market

## Overview

**Creative North Star: "The Threshold"**

The appraiser's ledger floats at the edge of a drowned void, and an eclipse that is really a closed eye watches every bargain. The world is a Thai black samut khoi manuscript fused with cosmic dread: lacquer-black leaves ruled in orpiment gold, chalk-bone text, an abyss teal-black ground, verdigris glow, ichor violet for omens and clotted oxblood for danger. The table UI stays in front, fully operable; the Three.js world sits behind it on a fixed canvas and moves the camera when the phase changes. This replaced the 2026-10-14 warm brown realistic-card table on 2026-10-21.

The world lives in `src/appraisal-client/world/`. `scene.ts` builds a black sea, leaning monoliths and far spires in exponential fog. It adds tentacles, folded black manuscripts with invented orpiment glyph rows, drifting embers and an eclipse-eye that tracks the pointer. Portal choice raises one gate per offered door, each veil holding that merchant's portrait. During appraisal the chosen merchant looms faint in the fog. Lobby and trade light one lantern per seat in the seat colors. Reveal and results open the eye. A post pass adds bloom, a cool-shadow/warm-highlight grade, a chromatic fringe, a heavy vignette and film grain. Scene materials are not CSS tokens. They use fog `#030607`, a teal hemisphere light `#2b4a45`, a verdigris rim `#8fd6c2`, a candle point light `#ffb35c`, stone `#0d1415`, manuscript ground `#0b0a08` and manuscript ink `rgba(214,176,92,.9)`. The sidecar lists the per-phase camera rigs.

The direction contract described every page as a near-opaque black leaf. The build keeps one light leaf: the appraisal desk's reading panel stays a cream parchment set inside a black gold-ruled frame, so dense item facts read dark-on-light. Every other surface is black. The source authority is `src/appraisal-client/styles.css`: the `:root` token line plus the "The Threshold (2026-10-21)" block and the rules appended after it, which override earlier declarations. The independent legacy auction UI in `src/client` keeps its own pale tokens (see Colors, Legacy).

**Key Characteristics:**

- A fixed WebGL void behind an operable table; the phase is a camera move, not a page swap.
- Black, near-opaque leaves (about 0.9 alpha) with a double gold rule and SVG corner brackets.
- Orpiment gold for action and emphasis, verdigris for hover and focus light, ichor for omens, oxblood for danger.
- Srisakdi and IM Fell English for chapter, phase and merchant display; Noto Sans Thai carries everything read under time pressure.
- Leaf cards tilt toward the pointer in true perspective; a chapter card passes over each phase change without taking input.
- The scene reacts only to facts the player can already see.

## Colors

The frontmatter owns exact values. The palette is ink-black and teal-black ground, gold rule and gold action, with three narrow signal hues. The sidecar's tonal ramps are panel previews, not implemented scales.

### Primary

- **Orpiment** (`orpiment`, `orpiment-hover`, on `orpiment-ink`): the filled primary action everywhere, including the buy button on the parchment. On hover the fill lifts and a gold under-glow appears.
- **Gold Ink** (`amber`, `amber-hover`): highlighted terms for items, met trust discs, selected outlines, countdown and price emphasis, phase hints. It is the gold of the writing; Orpiment is the gold of the seal you press.
- **Frame Gold** (`bronze`, `bronze-bright`, `frame-line`, `frame-inner`): control outlines, the double rule inside leaves, corner brackets, the brand and chapter numerals, and scrollbar thumbs.

### Secondary

- **Verdigris** (`verdigris`): light from the void. It appears as the hover wash on buttons, the border and under-glow of a hovered or focused portal, the inspect hover glow and the top radial of the CSS ground.
- **Verdigris Focus** (`focus`): the 3px keyboard focus ring on dark surfaces.
- **Tarnished Steel** (`steel`, `steel-line`): inspect buttons, a teal-green gradient.

### Tertiary

- **Ichor** (`ichor`): omens and events. It covers the omen note border and wash, and the event heading icon.
- **Oxblood** (`oxblood`, `oxblood-line`, `danger`, `danger-wash`): danger buttons, consequence choices, bad toasts and penalty text.
- **Signal hues** (`positive`, `energy`, `life`): buff terms and good toasts, the energy and life resources.
- **Seat lights** (`seat-1` to `seat-4`): seat disc halos in the table, and the same four colors for the seat lanterns in the scene.

### Neutral

- **Void / Ink Black / Field Black** (`void`, `table`, `field`): the CSS ground under the canvas, badges sunk into leaves, and dark text fields.
- **Leaf** (`panel`, `panel-solid`, `panel-raised`, `panel-gap`): `panel` is the 0.9-alpha leaf, and leaves also use a 0.9 to 0.92 vertical gradient of the same blacks. `panel-raised` is the solid fill of everything that floats. `panel-gap` is the dark channel between the outer border and the inner gold rule.
- **Chalk Bone** (`cream`, `table-muted`, `table-line`): text, supporting text and fine dividers on black. In CSS, `table-muted` is `--muted` and `table-line` is `--line`.
- **Parchment** (`parchment-light` to `parchment-edge` radial, `paper`, `paper-ink`, `paper-muted`, `paper-line`, `paper-field-line`, `hover-wash`): the desk reading panel only. In CSS, `paper-ink` is `--ink`. The paper field line stays at least 3.6:1 against the parchment.
- **Rust on paper** (`accent`, `accent-hover`, `error-ink`): focus outline, caret, checkbox accent, text selection and blocked notes inside the parchment, plus error text there. It is no longer an action fill.

### Legacy (independent `src/client` only)

`ink`, `muted`, `ground`, `line`, `field-line`, `notice-wash`, `error-wash`, `finding-ink`, `finding-wash`, `symbol-ink`, together with the shared `paper`, `accent`, `accent-hover` and `hover-wash`, are the pale-ground, dark-ink, rust-action palette of the legacy auction client (`src/client/styles.css`). They never appear in the appraisal client. Do not treat same-named CSS properties in the two clients as a shared theme.

**The Surface Pair Rule.** Use the foreground, action and focus colors of the current surface together: chalk, orpiment and verdigris focus on black leaves; paper ink, orpiment and rust focus on the parchment.

**The Visible Facts Rule.** Scene color reacts only to what the player can already see on screen: the phase, their own life, being caught, an open event, the doors on offer and the merchant they chose. Hidden item truth (genuine or fake, cursed or safe, value) never becomes a glow, tint or motion. `worldStateFor` in `world/state.ts` is the only input to the scene.

## Typography

**Display Fonts:** Srisakdi 700 (Thai and Latin subsets) and IM Fell English 400 (Latin), self-hosted from `@fontsource/srisakdi` and `@fontsource/im-fell-english` 5.3.0 (OFL-1.1), imported in `main.tsx`. Fallbacks are Noto Serif Thai, then serif.
**Body and UI Font:** self-hosted Noto Sans Thai, with sans-serif fallback.
**Section Heading Font:** self-hosted Noto Serif Thai, with serif fallback.

**Character:** Srisakdi is a looped Thai manuscript hand, and IM Fell English is a worn letterpress Roman. Together they make the headings feel copied into an old book. Noto Sans Thai keeps timed reading plain and steady.

The display stack lists IM Fell English first. It has no Thai glyphs, so Thai text renders in Srisakdi at 700 and Latin text renders in IM Fell. Under `html[lang=en]` the display roles switch to the Latin stack at weight 400, with slightly wider tracking on phase headings.

### Hierarchy

- **Chapter** (700, clamp 32 to 72px, 1.3): the passing chapter card only. "บทที่" plus Thai digits, or "Chapter" plus Roman numerals in English. The numeral is in bronze-bright, followed by a frame-line middle dot, with gold hairlines either side.
- **Phase Display** (700, clamp 30 to 42px, 1.25): the phase header title and the results heading.
- **Entry Display** (700, clamp 32 to 52px, 1.4; 34px at 640px and below): the entry headline.
- **Merchant Name** (700, 23px): portal card and appraisal merchant headings.
- **Brand** (IM Fell 400, clamp 24 to 32px, 0.1em tracking, uppercase, bronze-bright with a soft gold glow): the masthead, led by a 30×18 SVG eye mark.
- **Section / Title** (Noto Serif Thai 600, 24px / 20px, 1.5): everything else that is a heading. The desk reading heading is 19px.
- **Body / Label / Small / Caption** (Noto Sans Thai 16 / 16 semibold / 15 / 13px): reading and controls. Paragraphs cap at 70ch.
- **Resource** (26px 700, tabular): credit, energy, life and score readouts.
- **Peek** (14px, 1.55): every floating peek card.
- **Legacy headline, title, body, label, supporting** (Tahoma stack): `src/client` only.

Prices, resources, timers and score tables use tabular numerals. Headings use balanced wrapping. Text that sits directly on the void (masthead, footer, section headings and intros outside leaves, entry copy) carries a two-layer black text shadow so it reads against the scene.

**The Manuscript Hand Rule.** Srisakdi and IM Fell are for chapter headings (including the chapter numeral), phase, entry and merchant names only. Never set body text, controls, facts or game values (prices, resources, timers, scores) in them.

**The Legibility Rule.** Preserve Thai line spacing, and wrap user names before narrowing or clipping meaningful text.

## Layout

The world canvas is `position: fixed; inset: 0; z-index: 0` with no pointer events. It fades in over 1.8s once the scene is ready. The app shell sits above it at `z-index: 1`. The shell is centred, 1440px wide at most, with 16px 32px 20px padding. The first viewport shows the masthead, then the phase header leaf with the title, hint, encounter line and room code on the left, and countdown, resources and seat discs on the right. The phase task (portals, desk, trade) sits below. The play table has a flexible main region and a 312px side column (Dark Market, statuses, notes) with a 28px gap.

Each phase shows only what its decision needs. Portal choice shows portals, the full Dark Market and statuses. Appraisal shows the merchant beside a three-step desk (inspect, appraise, buy) with one step panel visible, statuses, and a one-line market summary. The inventory is a closed drawer. Trade shows unsold duty, trades, the full market, the inventory and other players. Reveal and results use a single column. The rules disclosure stays at the bottom in every phase.

Breakpoints: at 1100px the side column becomes 272px, the merchant becomes a 104px-portrait row above the desk, and events stack. At 900px the table becomes one column and the side panels sit in an auto-fit row. At 640px the shell pads 12px 16px 16px and the masthead keeps one line. The phase header stacks with resources in four columns, portals become 104px-portrait rows, the desk stacks with art capped at 260px, toasts move to the top, and the trust ring and lobby tighten. Under 720px the scene lowers its sea mesh detail (64 instead of 120 segments) and ember count (280 instead of 650).

The legacy `src/client` shell keeps a 1216px maximum width, 32px horizontal padding, a 265px participant column with a 48px gap, and a 760px breakpoint that pads 20px and stacks entry, lobby, market and phase headers.

Spacing is practical rather than modular. Reused steps are in the frontmatter.

## Elevation & Depth

Depth comes from the world, not from shadow stacks. The void gives distance: fog, a pointer parallax on the camera, and the camera dollying to a new rig at each phase. Leaves sit on it as dark, near-opaque planes. A key leaf (phase header, desk, Dark Market, event, entry portrait, results, lobby, round reward) has a 1px frame-line border, an inset 4px panel-gap channel, then a 1px inset gold rule (`frame-inner`). It adds two 1px gold hairlines inset 14px from the top and bottom, and 16px SVG corner brackets. Supporting panels (portals, statuses, trades, inventory cards, trust ring) use the single frame line. Without WebGL, the body ground is the fallback: a verdigris radial from the top, black toward the bottom, over the void.

### Shadow Vocabulary

- **Art** (`0 18px 36px -8px rgb(0 0 0 / .7)`): artifact art and the entry portrait. New desk art arrives once over 320ms, from brightness 0.82 and a low shadow.
- **Gold under-glow** (`0 8px 22px -10px rgb(217 180 90 / .7)`): primary button hover.
- **Verdigris under-glow** (`0 8px 22px -10px rgb(95 184 160 / .65)`; portals `0 22px 44px -18px rgb(95 184 160 / .5)`): inspect hover and portal hover.
- **Seat halo** (`0 0 14px -2px` in the seat color): seat discs.
- **Floating** (toast `0 14px 32px rgb(0 0 0 / .5)`, peek `0 12px 28px rgb(0 0 0 / .45)`, modal event `0 24px 60px rgb(0 0 0 / .55)`): only layers that float over the table.

**The Solid Float Rule.** Anything that floats over the table (event modal leaf, toasts, peeks) is fully opaque, so table text never shows through. Only in-flow leaves use the 0.9-alpha panel.

**The Fixed Layer Rule.** Never put `transform`, `filter` or `backdrop-filter` on an ancestor of a fixed layer (modal, toasts, peeks, chapter card). Only leaf cards tilt, and a tilted card holding an open peek drops its transform.

**The Still Frame Rule.** Under `prefers-reduced-motion: reduce` the scene renders one still frame: no time, parallax, gaze, blink, heartbeat or flicker. Card tilt is off, the chapter card is not shown, and the canvas fade, toast motion and arrival animation are removed.

**The CSS Ground Rule.** WebGL failure is silent. If the scene chunk fails to load, the context fails, or the context is lost, the canvas stays hidden and the CSS ground carries the page.

## Shapes

Controls have a 6px radius, insets and the parchment 8px, framed leaves 10px, art cards and inventory thumbnails 12px. Portal cards have a 16px radius. Their portrait is cut as an arch: `50% 50% 6px 6px / 34% 34% 6px 6px`, with a 1:1.05 aspect, echoing the gates that rise in the scene. Seat discs, trust discs and pills are round. Fine borders are 1px. Selected stock and inventory use a 2px amber outline with a 2px offset. Keyboard focus is a separate 3px outline with a 3px offset. Trust discs not yet met use a 2px dashed line. Corner brackets are thin L-strokes with an inner echo and a diagonal tick. Legacy `src/client` controls keep a 4px radius. Relic choices are square, focus is a 3px rust outline at a 4px offset, and family symbols are 64px inline SVGs with a 2px rounded stroke.

## Components

### Buttons

Buttons are at least 44px tall, with a 1px bronze outline, transparent fill, chalk text and an optional leading 20px icon. Hover adds a faint verdigris wash and a bronze-bright border. Primary is a flat Orpiment fill with Orpiment Ink, in bold. On the parchment, primary and buy are Orpiment too. The appraise button keeps its own warm gold gradient. Inspect uses a Tarnished Steel gradient with a verdigris under-glow on hover. Danger uses an oxblood gradient. Disabled buttons, fields and selects drop to 0.5 opacity with a blocked cursor. The price field is a stepper: −/+ 44px buttons around a centred 22px numeral, with the native spinner hidden.

### Inputs / Fields

Fields are at least 46px tall, with visible labels. Dark fields use Field Black, chalk text, a bronze outline and an amber caret. Parchment fields use Pale Paper, Paper Ink, the Paper Field Line and a rust caret. The native checkbox is 20px within a label row at least 44px tall. Read-only room-code copying announces success, or selects the field with manual-copy guidance.

### Cards / Containers

**Portal card:** a 0.9-alpha black card with an arched portrait, the actual merchant name in the merchant display face, the hinted item type, the contract hint, trust and a native enter button. On hover or focus it gains a verdigris border and glow. A closed portal is near-solid black with a dimmed, grayed portrait and disabled-action wording.

**Desk:** square artifact art, sticky on desktop, beside the parchment reading panel with facts and price controls. Only one desk step is visible at a time.

**Omen:** the ichor-bordered note for the current open omen.

**Inventory:** items use a shared `คลัง #n` identity. Dark Market rows reuse that identity and viewer-known facts. The Dark Market band heading sits on an oxblood gradient.

### Navigation

The phase header reports phase, encounter, resources and deadline. It is not a clickable stepper. A one-line amber hint sits under the phase title. Stock choices and inventory thumbnails are native buttons with `aria-pressed`, a selected outline and explicit labels. Phase changes have a concise status message. Countdown ticks use `aria-live="off"`. Native disclosure summaries expose rules, notes and sharing, with bronze-bright markers.

### Chapter card (signature)

When the phase or encounter changes, `world/Chapter.tsx` passes a chapter heading over the table, like turning a page. It is fixed, `z-index: 45`, with no pointer events, and `aria-hidden`. Screen readers hear the phase through the status line, and timed phases keep counting underneath. The card sits on a black radial pool and runs once for 1000ms: in from blur 10px and scale 1.04, held, then out with a light blur.

### Card tilt (signature)

`world/tilt.ts` leans leaf cards toward the pointer by up to 7°, using `perspective(900px)` and a 3px lift (4px for portals). A screen-blended warm glint follows the pointer. Tiltable cards are open portals, inventory thumbnails, stock tabs, artifact art, wanted rows and event portals. Tilt only runs with a fine hover pointer and without reduced motion, and never on a disabled card.

### Icons

`src/appraisal-client/icons.tsx` holds one authored SVG family on a 24px grid with a 1.6 stroke and round joins. Icons are always `aria-hidden`, and the adjacent text names the meaning. Buff and debuff differ by shape (a solid ring with an up chevron, a dashed ring with a down chevron) as well as by color.

### Choice cards and game terms

The appraisal client has no `<select>`. Every pick is a `ChoiceCards` group (`lore.tsx`). Each card is a native radio inside a label card, at least 44px tall, with a ring indicator and an amber border when selected. Consequence choices use a danger variant. Item options show 48px art, and short options use a compact chip grid. Each event choice states its own cost and outcome.

Status, item and merchant names in game text are highlighted terms with a dotted underline or icon, so color is never the only signal. Buff terms are positive green, debuffs oxblood-pink, items gold and merchants bronze, with darker variants on the parchment. Hover, focus or tap opens a solid peek card, fixed and clamped to the viewport. It shows a status effect and duration, or item art, value knowledge and possible effects, or a merchant portrait and hint. Inside labels and buttons the term is a passive span with a hover-only peek. Peeks fade in over 140ms.

### Event dialog, toasts and portal previews

An offered event blocks table actions. It opens as a modal (`EventModal`, `feedback.tsx`) over a dark radial backdrop, on a solid event leaf. The player can tuck it away, and a bottom pill brings it back. Portal decisions show all three merchant portraits, hints and trust inside the dialog, with a live preview of which doors remain open. Oversized dialogs align at the top and scroll. Results arrive as solid toast cards: bottom-right from 1100px (newest last, clear of the HUD), top-right below that, and at 12px from the top at 640px and below. Tone is good, bad (danger wash) or info. A toast pauses on hover or focus and dismisses after 6.5s with a 2px timer bar. The collapsed history keeps the last six notes.

### Round coin

During REVEAL, `RoundReward.tsx` puts an isometric minted coin, inside a framed leaf, beside the income decision. Banking is primary; heads and tails are secondary. A server-confirmed flip triggers one 1.3s rise, spin, fall and settle, with a shrinking shadow for height. The coin face is a 44px engraved glyph, and coin metal uses the gold and bronze tokens. Controls are disabled during the toss, and the outcome is announced after landing. Reduced motion reveals the outcome in 100ms. At 640px and below the coin sits above the wrapping controls.

### Trust ring

The trust ring is a 0.9-alpha framed panel holding one 50px round disc per merchant. A merchant not yet met has a 2px dashed line and a grayed, darkened portrait. A met merchant has a solid 2px amber ring and a full-color portrait, with a level badge in amber. Rewards are dashed bronze pills that turn solid amber with a gold wash when earned. Discs shrink to 46px at 640px and below.

### Held effects and price knowledge

`HeldEffects.tsx` is one expandable ledger below the play surface, grouped by named item and held count. It is a raised panel with a fine line, and its columns collapse on phones. The summary states effective commission, extra income, coin odds and reward, and inspection quota. Price knowledge is gated per item. Before a price clue exists, facts say “ยังไม่รู้ · ใช้ตรวจราคาเพื่อหาเบาะแส”. After inspection the known range or exact value shows.

### Art and provenance

`docs/art/consistent-catalog-v0.5/generation-prompts.json` records all 68 runtime paintings, and the original v0.4 manifest records the earlier set. Every public product name has a unique composition, and all eight merchants use realistic painted portraits. Runtime JPEGs are 768px wide. The same image selectors feed the table, the gates and the apparition in the scene. Hidden genuine/fake and cursed/safe states never affect image selection. The scene's manuscripts, glow and geometry are generated in code at runtime (seeded canvas textures and shaders), with no shipping raster. Font provenance is in `package.json` (`@fontsource`) and `docs/art/appraisal-v0.4/fonts.json`.

Optional synthesized sound starts off and turns on only from the player's own gesture. Each cue is one short oscillator tone with a 120ms gain decay, and there are no ambient loops.

**The Property Scope Rule.** Inspecting one attribute never visually implies knowledge of another; illustrations identify the item kind without exposing hidden facts.

## Do's and Don'ts

### Do:

- **Do** keep the world behind the table: a fixed, pointer-transparent canvas at `z-index: 0`, with the operable UI above.
- **Do** feed the scene only through `worldStateFor`: phase, own life, caught, open event, offered doors, chosen merchant, seat count.
- **Do** keep in-flow leaves near-opaque (0.9 to 0.92 alpha) and floating layers fully solid.
- **Do** keep the reduced-motion still frame and the CSS ground fallback working whenever the scene changes.
- **Do** use Orpiment for the one primary action, verdigris for hover and focus light, ichor for omens and oxblood for danger.
- **Do** preserve visible Thai labels, explicit focus and wrapping names.
- **Do** keep appraisal and legacy token scopes separate when adding a screen.
- **Do** use the same item art across hidden attribute combinations and keep its prompt provenance.
- **Do** keep sound opt-in, off by default.

### Don't:

- **Don't** let any scene element (glow, tint, gate, eye, fog) react to hidden item truth or another viewer's private facts.
- **Don't** put `transform`, `filter` or `backdrop-filter` on an ancestor of the modal, toasts, peeks or chapter card; tilt leaf cards only.
- **Don't** let the chapter card block input, take focus or speak to screen readers.
- **Don't** set body text, facts, controls or game values (prices, resources, timers, scores) in Srisakdi or IM Fell English.
- **Don't** communicate authenticity, curse, readiness or errors through color alone.
- **Don't** expose another viewer's private inspection facts through text, image variants or preview data.
