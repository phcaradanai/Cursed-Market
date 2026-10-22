---
version: 1
slug: "src-appraisal-client-app-tsx"
primary_target: "src/appraisal-client/App.tsx"
related_targets: ["src/appraisal-client/styles.css"]
---

# Appraisal table — Threshold redesign (2026-10-21)

## Scope and visitor mode

Operate, with an atmospheric world around it. The v0.5 appraisal client (`src/appraisal-client/`). The user asked for a 2.5D/3D Three.js redesign in a dark fantasy / Lovecraftian / grim novel theme, with parallax and game-like techniques. The user chose: a Three.js world behind the existing UI, not a diegetic WebGL table. All rules, copy, tests and accessibility paths stay.

## Direction contract

THESIS: The appraiser's ledger floats at the edge of a drowned void, and an eclipse-eye watches every bargain. The phase is a camera move through that world, not a page swap. It refuses the flat brown card-table dashboard.

OWN-WORLD: Thai black samut khoi manuscript (lacquer-black folding pages, orpiment-gold ink, chalk-bone text) fused with cosmic dread: abyss teal-black ground, verdigris glow, ichor violet, clotted-blood danger. Srisakdi for chapter and phase display (Thai), IM Fell English for Latin brand. Noto Sans Thai stays for body. Pages are near-opaque so the text stays legible.

STORY: Each encounter is a chapter. The player sees which door, which merchant and which risk, while the world reacts only to what they already know: phase, their own life, being caught.

FIRST VIEWPORT: Masthead top. The phase header is a gold-ruled manuscript leaf with resources. Below it sits the task (portals, desk, trade), and around and behind it the 3D void: sea, monoliths, eye, gates holding the offered merchants' portraits.

FORM: Pinned by the user brief, so concept-seed was not run; seed: none (direction pinned by user brief, roll not run). Signature move: the eclipse-eye tracks the cursor and the camera dollies per phase; cards tilt in true perspective.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
