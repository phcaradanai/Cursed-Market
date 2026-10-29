---
name: "Cursed Market — Comic Build"
description: "A playable colored comic market framed by charcoal panels, white rules, and vermilion decisions."
colors:
  comic-red: "#d71940"
  commit-fill: "#be1736"
  inspection-fill: "#bf1539"
  commit-hover: "#dc2346"
  focus-ring: "#ff4265"
  comic-black: "#090a0b"
  comic-panel: "#101112"
  comic-white: "#f6f6f6"
  comic-muted: "#cacbce"
  comic-line: "#a1a3a6"
  field-fill: "#131313"
  reading-fill: "#0f1011"
  fact-fill: "#111315"
  selected-fill: "#291019"
typography:
  display:
    fontFamily: "Noto Sans Thai, sans-serif"
    fontSize: "clamp(32px, 2.9vw, 48px)"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Noto Sans Thai, sans-serif"
    fontSize: "28px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Noto Sans Thai, sans-serif"
    fontSize: "clamp(24px, 1.9vw, 32px)"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Noto Sans Thai, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  action:
    fontFamily: "Noto Sans Thai, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.3
  label:
    fontFamily: "Noto Sans Thai, sans-serif"
    fontSize: "18px"
    fontWeight: 500
    lineHeight: 1.25
  value:
    fontFamily: "Noto Sans Thai, sans-serif"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: 1.2
  brand:
    fontFamily: "IM Fell English, serif"
    fontSize: "24px"
    fontWeight: 400
    letterSpacing: "0.11em"
rounded:
  small: "8px"
  control: "10px"
  inset: "12px"
  panel: "16px"
  dialog: "18px"
spacing:
  tight: "8px"
  compact: "12px"
  regular: "16px"
  roomy: "20px"
  panel-gap: "22px"
components:
  button-primary:
    backgroundColor: "{colors.commit-fill}"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    padding: "8px"
    height: "54px"
  button-primary-hover:
    backgroundColor: "{colors.commit-hover}"
  button-inspect:
    backgroundColor: "{colors.inspection-fill}"
    textColor: "#ffffff"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "6px 10px"
    height: "46px"
  button-outline:
    backgroundColor: "#0e1011"
    textColor: "#ffffff"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "6px 10px"
    height: "46px"
  input:
    backgroundColor: "{colors.field-fill}"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    padding: "8px 12px"
    height: "46px"
  panel:
    backgroundColor: "{colors.reading-fill}"
    textColor: "{colors.comic-white}"
    rounded: "{rounded.panel}"
    padding: "14px 18px"
  stock-selected:
    backgroundColor: "{colors.selected-fill}"
    textColor: "#ffffff"
    rounded: "{rounded.small}"
    padding: "3px 7px"
  fact-row:
    backgroundColor: "{colors.fact-fill}"
    textColor: "{colors.comic-white}"
    padding: "6px 0"
  dock:
    backgroundColor: "#090909"
    textColor: "#f1f1f1"
    height: "68px"
  step-selected:
    backgroundColor: "#241019"
    textColor: "#ff315c"
    padding: "5px"
    height: "53px"
---

# Design System: Cursed Market — Comic Build

## Overview

**Creative North Star: "Playable Comic Market"**

A playable colored comic / manhua market surrounds real appraisal decisions. Neutral charcoal panels, white rules and broad Thai lettering make a quiet frame for fully colored, heavy-outline merchant and object cutouts. Vermilion identifies selection and commitment; the drawings carry the atmosphere and variety.

This system belongs to the separate comic client. It preserves live semantic text, Thai/English language support, hidden-information boundaries and the original interaction rules. Eight distinct merchants retain idle, smile and angry portraits with an even gender split; ten item art families retain their drawn three-quarter volume. Decorative market and cloth illustrations stay separate from actionable content.

**Key Characteristics:**

- Neutral charcoal UI with bright white rules and text.
- Broad, heavy Thai game headings and readable sans-serif controls.
- Full-color cutouts over illustrated market and cloth settings.
- Flat controls, thin panel boundaries and restrained cutout depth.

## Colors

The palette is a neutral ink frame with a vermilion action family; full-color illustration supplies the remaining hues. The frontmatter records the final reused values, including literal component fills that coexist with the root red token.

### Primary

- **Comic Vermilion:** the root accent for the comic language and native accent color.
- **Commit Red:** the shared primary-button fill, with **Commit Hover** for pointer response.
- **Inspection Red:** the first available inspection action uses this close sibling of the commit fill.
- **Focus Rose:** the bright keyboard outline and field caret. Selection also uses stronger rose strokes over **Selected Ink**.

### Neutral

- **Market Black:** the root canvas beneath the illustrated market.
- **Panel Charcoal:** the shared dark panel family; the reading area uses **Reading Charcoal**, and learned facts use **Fact Charcoal**.
- **Comic White:** bright live text and drawn rules; individual high-emphasis controls use pure white.
- **Comic Muted:** secondary reading copy, with local neutral variations for hierarchy.
- **Comic Line:** the shared boundary family. Local one-pixel gray rules separate panels and rows.
- **Field Charcoal:** the fill inside editable controls.

**The Frame and Art Rule.** Keep interface structure neutral; let the approved full-color drawings supply the world’s color. Red marks active choices and commitments.

## Typography

**Display Font:** Noto Sans Thai (with sans-serif fallback) for game headings.
**Body Font:** Noto Sans Thai (with sans-serif fallback), self-hosted from the client’s font directory.
**Brand Font:** IM Fell English (with serif fallback), bundled locally.

**Character:** Game headings use broad, heavy Thai lettering; body and controls use the same family with lighter weights. The English wordmark retains its literary serif. The entry headline remains a Noto Serif Thai exception; it does not define the game-heading system.

### Hierarchy

- **Display:** the fluid phase title in the frontmatter; phone phase titles resolve to (29px).
- **Headline:** merchant, portal and inventory-detail headings; portal headings resolve to (26px) on phones, merchant headings to (23px).
- **Title:** selected product title; it resolves to (26px) on phones.
- **Body:** standard readable interface copy. Paragraphs use a tighter reading line-height (1.55); supporting notes use smaller local sizes.
- **Action:** prominent inspection labels. Larger screens from (1500px) use (22px); inventory actions use (18px), then (15px) on phones.
- **Label / Value:** associated fact labels and learned values occupy the same row. Phone sizes are (16px) and (20px).
- **Brand:** the English wordmark. Phone HUD branding uses (16px).

**The Live Lettering Rule.** Keep labels, prices, learned facts and actions as semantic interface text; never bake them into the art.

## Layout

### Symmetry and spacing contract

This is a binding rule for every comic UI screen, not an appraisal-only treatment. Use the shared 6 / 12 / 24px scale from `layout-system.css`; control-surface padding and group gaps are 12px. Paired decision panels use equal columns and matching visible frame bounds; major spread gutters use one shared responsive token. An explicitly annotated media stage may bleed to its frame, while its interactive controls retain the shared inset. Title rows may sit above both frames when the approved reference specifies that structure. Align corresponding outer boundaries through shared row dimensions, including borders, rather than per-element offsets.

Keep desktop outer gutters equal on both sides and preserve equal top/bottom content clearance within the available frame. Preview controls occupy their own 40px utility row above the dock; never reserve arbitrary per-page empty space for them. Phones stack the same panels with the same 12px inset and gap. Overflow belongs inside long content panels; it must not change page width or hide critical actions. Cutout illustrations may protrude from their planned art region without changing control alignment.

Before claiming a spacing correction complete, check computed panel widths/heights, all four padding values, repeated-row alignment, gaps, and viewport overflow at desktop and phone sizes. Future changes must modify the shared owner or token rather than add an unrelated override for one screen.


The centered shell has a maximum width (1560px) and desktop side gutters (16px). Reused spacing is recorded in the frontmatter; local compact rows and generous illustrated stages serve their content rather than a uniform card grid.

The comic surface uses a compact resource HUD, a phase heading, a main decision composition and a fixed bottom utility dock. The main page reserves space beneath content for that dock. Panel borders, aligned text and art hierarchy carry grouping.

At the phone breakpoint (760px), shell gutters become (10px), the HUD becomes two rows, main columns stack and the dock changes from (68px) to (62px). A narrower-desktop adjustment exists at (1100px); short desktops up to (850px) high compress the appraisal stage and stock controls while retaining decisions. Desktop and phone composition details belong to `.impeccable/surfaces/comic-build.md`.

Actual stock tabs and held-item strips may scroll horizontally. The main portal and appraisal layouts stack on phones. Dialog content scrolls vertically within the viewport; bounded data tables retain their native overflow where needed.

## Elevation & Depth

Depth comes from the illustrations’ drawn volume, transparent silhouettes, cloth surfaces and soft dark separation around major panels. Buttons have no resting box shadow and no hover lift. The inherited pressed-state translation is a small response (1px); reduced motion disables animations and transitions throughout.

### Shadow Vocabulary

- **Decision panel:** a soft separation shadow (`0 10px 26px rgb(0 0 0 / 45%)`) under the paired appraisal surfaces.
- **Cutout edge:** small dark drop shadows under merchant and object silhouettes. These are image treatments, not offset UI-card shadows.
- **Dock separation:** an upward ambient shadow (`0 -8px 22px rgb(0 0 0 / 38%)`) separates fixed navigation from content.

**The Cutout Depth Rule.** Use drawn volume and small dark cutout shadows for art. Controls remain flat; do not restore inherited metallic frames or decorative bevels.

## Shapes

Outer panels have visibly soft corners, with a slightly larger curve on dialogs. Buttons and fields use the control curve; badges, stock choices and inset panels use their respective tokens. Internal row separators stay straight, and the utility dock keeps a flush bottom edge. Merchant cutouts can rise above the rounded frame; round the inner backgrounds to match the frame while leaving the full card overflow visible. Native UI icons are line SVGs. Merchant and object contours come from approved raster alpha.

## Components

### Buttons

Confident and legible. Shared primary actions use Commit Red, white text, a bright red border and the control radius. Inspection choices form a vertical full-width stack: the first available action is filled red, the others use white outlines on charcoal. Hover changes color without lifting. Keyboard focus uses a bright outline (3px) with an offset (4px). Disabled buttons use gray fill and border with reduced opacity; disabled reasons remain available in live copy or titles. Action buttons retain the minimum target (44px); prominent inspection and inventory actions are larger.

### Chips

Actual stock selectors combine an object thumbnail, real name and visible merchant price. The selected state uses Selected Ink and a two-pixel rose border, preserving the footprint by adjusting padding. Small HUD count badges are rectangular red counters. These treatments represent selection and quantity, not invented decorative labels.

### Cards / Containers

Thin pale boundaries on dark panels establish readable comic frames. Major decision panels use the panel radius and soft separation described above. Merchant art can overlap its portal frame; appraisal portraits use deliberate head/shoulder cropping. Product images preserve drawn perspective and opacity over the illustrated cloth.

### Inputs / Fields

Editable fields use Field Charcoal, white input text, a pale one-pixel border, the panel radius and a bright caret. Fields have a minimum height (46px). Keep labels and validation associated with their real controls. Entry fields occupy a single readable form column.

### Navigation

The bottom utility dock shows bag, statuses, Dark Market, ledger, rules and settings. Active utilities use a dark red wash and a red bottom rule. Phone items stack icon above label. The appraisal’s three tabs preserve native tab roles, selected state, associated panels and arrow/Home/End keyboard navigation; only the active step’s panel is shown.

### Learned Fact Rows

The fact block holds value, authenticity and curse information. Each row keeps its icon, label and right-aligned value associated horizontally, with a divider between facts. Unknown facts remain question marks. Bad known values use a rose warning color; decorative art never communicates an unrevealed state.

### Inventory Actions

The selected item’s activation and offer-for-sale entries sit side by side, followed immediately by the consumable/unknown-risk warning. Sale terms expand from the explicit sale entry. The use action keeps its actual resource cost and unavailable reason.

## Do's and Don'ts

### Do:

- **Do** preserve the approved merchant roster, its three moods, distinct faces/outfits/poses and even gender split.
- **Do** retain full-color perspective objects, transparent silhouettes and illustrated cloth beneath selected products.
- **Do** keep actionable buttons at least 44px high, visible keyboard focus and the reduced-motion override.
- **Do** show only facts the player has learned; keep unknown value, authenticity and curse states explicit.
- **Do** stack the main compositions on phones and reserve horizontal card scrolling for actual stock and inventory galleries.
- **Do** preserve room, appraisal, trade, reveal, results, reconnect and Thai/English behavior in this separate build.

### Don't:

- **Don’t** replace the approved comic art with the original realistic paintings or the historical Three.js world.
- **Don’t** infer hidden item facts through art, text, numerical estimates or decorative state.
- **Don’t** use the earlier concept portraits to overwrite the later approved merchant faces, costumes or moods.
- **Don’t** use a screenshot of the interface as the interface or put essential text inside generated imagery.
- **Don’t** treat historical cabinet metadata or its surface brief as the current comic design authority.

Appraisal information uses two page buttons below merchant trust. They replace the right panel with item mechanics or one actionable merchant offer at a time; Back restores the mounted appraisal controls and typed values. Never repeat the persistent item title/price or merchant portrait/trust inside these pages. Item detail contains effects, use instructions and conditions only, derived from public/seat-visible game data. Service quotes expose their real price directly on the payment action. Long offer/item lists use bounded pagination rather than disclosures or panel scrolling.

Symmetry acceptance applies inside each group: controls and meters in the same merchant column share both horizontal edges; the space from the meter to the first navigation button, between navigation buttons, and from the last button to the media boundary is exactly the shared 12px inset. Size the containing grid from its rows and gaps; never force controls into leftover height. Verify these internal measurements alongside the paired outer frame bounds.

Appraise and buy steps use the same full-height decision frame: equal-width fact cells at the top on desktop, a flexible decision region, and a shared bottom action baseline. Appraise has a full-width 64px minus/value/plus editor, full-width risk notice and two equal footer buttons. Purchase groups checkbox options in aligned rows, then shows total payment/energy in equal summary cells and a bottom action row: purchase on the left, buy-both selection on the right when offered; a single purchase control spans the row. Do not repeat the total again in the action label. Preserve 12px group gaps, matched edges and 12px bottom inset; verify dynamic options and disabled reasons rather than just default content.

Inspection shares the same desktop three-cell facts band as appraise/buy. Its allowance note is a60px full-width band; the three inspection actions evenly divide the remaining height with12px gaps and matching edges. The compact appraisal inspection UI has no “เลือกตรวจได้อย่างใดอย่างหนึ่ง” disclosure. Preserve cost/known/energy/lock guards and action payloads.

Auxiliary merchant offer pages use uninterrupted surfaces with the shared inset. Remove legacy dashed wish-book separators and nested duplicate padding; align the contract heading, body and full-width action with other offer sections.
