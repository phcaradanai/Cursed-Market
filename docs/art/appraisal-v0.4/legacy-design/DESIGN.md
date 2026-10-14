---
name: Cursed Market
description: Provisional presentation for a private multiplayer auction prototype.
colors:
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
  control: "4px"
  container: "0px"
spacing:
  inline: "8px"
  compact: "12px"
  regular: "16px"
  roomy: "18px"
  section: "24px"
  stack: "30px"
components:
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

**Creative North Star: "Readable auction work surface"**

A pale warm ground, dark ink and rust commitments make the prototype easy to read while friends make timed decisions. This is the shipped provisional presentation, not an approved production identity. Human fun tests come before polished art or a larger visual system.

Source authority: `src/client/styles.css`, `src/client/App.tsx` and `src/client/Relic.tsx`, checked against the built CSS in `dist/client`. The system records reusable controls and information treatments; marketplace composition remains in `.impeccable/surfaces/marketplace.md`.

**Key Characteristics:**
- Readable Thai text with generous line spacing.
- Flat surfaces, fine dividers and compact native controls.
- Explicit labels for decisions, private findings and outcomes.
- Static family symbols that do not reveal hidden attributes.

## Colors

Warm neutrals support the content; rust marks commitments, current steps and danger text. Semantic messages always include words.

### Primary
- **Rust** (`accent`): primary actions, selected relic borders, current phase, focus rings and curse or false-guarantee emphasis.
- **Deep Rust** (`accent-hover`): enabled primary-button hover.

### Neutral
- **Dark Ink** (`ink`): main text and outlined controls.
- **Muted Ink** (`muted`): supporting copy, connection state and participant metadata.
- **Warm Ground / Pale Paper** (`ground`, `paper`): page ground and fields or relic choices.
- **Divider / Field Stroke** (`line`, `field-line`): section separation and field boundaries.
- **Hover Wash / Notice Wash** (`hover-wash`, `notice-wash`): secondary-button hover and notices or demand.
- **Symbol Ink** (`symbol-ink`): neutral family drawings.

Error Ink/Wash and Finding Ink/Wash are semantic message pairs, not additional brand accents. The frontmatter owns exact colors. Sidecar tonal ramps are synthesized panel previews; they are not an implemented color scale.

## Typography

**Body and UI Font:** Tahoma, with Noto Sans Thai and sans-serif fallbacks, including the provisional masthead. No webfont is bundled. Production display identity remains unresolved.

### Hierarchy
- **Headline:** responsive section heading; the current h2 uses the headline token.
- **Title:** compact task or item heading; the current h3 uses the title token.
- **Body:** regular Thai explanations, with paragraphs limited to 70ch.
- **Label:** semibold field labels.
- **Supporting:** phase labels, help and metadata.

Headings currently use browser bold defaults. Timers, prices and score tables use tabular numerals. Participant names and result text wrap at arbitrary points where required; numeric amounts remain readable beside them.

**The Legibility Rule.** Preserve Thai line spacing and wrap user names before narrowing or clipping meaningful text.

## Layout

The shared shell is centered with a maximum width of 1216px and horizontal padding of 32px. At the single 760px breakpoint, padding becomes 20px, room and phase headers stack, and two-column entry/lobby layouts become one column.

The shipped marketplace uses a flexible work area and a 265px participant column separated by a 48px gap. On narrow screens the work area precedes participants, with a 30px gap and a top divider. Relic choices remain two columns. Action groups wrap; score tables scroll within their own container.

Spacing is practical rather than a strict modular scale: reused steps are recorded in frontmatter. Main vertical padding is 36px/48px on wide screens and 26px/36px on narrow screens.

## Elevation & Depth

No shadows, gradients, blur or animated transitions are implemented. Depth comes from pale filled fields, message washes and thin rules. Native selection and focus remain immediate.

**The Flat Surface Rule.** Preserve the current border and tonal separation while this prototype is being tested.

## Shapes

Controls have softly eased corners using the control radius. Relic choices and message surfaces have square corners. Dividers and borders are 1px; selected relics add a 1px rust outline. Family placeholders use 64px inline SVG drawings with a 2px rounded stroke.

## Components

### Buttons
Outlined secondary, filled rust primary and underlined text variants share a 44px minimum height. Hover changes the fill immediately. Keyboard focus uses a 3px rust outline with a 4px offset. Disabled buttons use 0.55 opacity and a blocked cursor; they do not receive hover styling.

### Inputs / Fields
Text, number and select controls share pale paper, the field stroke, control corners and a 46px minimum height. Labels remain visible above the field. Radios use the native rust accent. The room code is a selectable read-only field; copying announces success or leaves selected text and manual-copy guidance.

### Cards / Containers
Relic choices are the card-like component: paper fill, thin divider border, native radio and an outline when selected. General content uses dividers instead of a card grid. Notices and private findings use semantic washes; errors include an alert and a dismissal action.

### Navigation
The phase row is informational, not clickable. Current phase uses rust, bold weight, underline and `aria-current="step"`; the row wraps on narrow screens. Phase changes are announced once per phase rather than every timer tick.

### Relics and guarantees
Neutral SVG symbols identify only the relic family. Public lots show family and the exact guarantee; private seller truth and inspection findings use text. A finding explains that the other attribute remains unknown. Reveal shows both attributes and the settlement.

**The Property Scope Rule.** A guarantee or inspection of one attribute never visually implies knowledge of the other attribute.

## Do's and Don'ts

### Do:
- **Do** preserve visible Thai labels, explicit focus and wrapping names.
- **Do** state the cost, locked state and exact scope of a decision.
- **Do** keep family symbols identical across hidden attribute combinations.
- **Do** keep additions provisional until human playtests provide evidence.

### Don't:
- **Don't** communicate truth, curse, readiness or errors through color alone.
- **Don't** expose private attributes through illustration variants.
- **Don't** introduce polished art, motion or a larger identity before the authorized human fun tests.

