---
title: Shared Comic interaction states own selection and focus
author: Phcaradanai
date: 2026-11-09
branch: main
touches:
  - ".impeccable/hook.cache.json"
  - apps/comic/src/appraisal-client/App.tsx
  - apps/comic/src/appraisal-client/ComicPreview.tsx
  - apps/comic/src/appraisal-client/PortalEventPreview.tsx
  - apps/comic/src/appraisal-client/StatusMenu.tsx
  - apps/comic/src/appraisal-client/TradeScreen.tsx
  - apps/comic/src/appraisal-client/appraisal-concept.css
  - apps/comic/src/appraisal-client/comic-frame.css
  - apps/comic/src/appraisal-client/comic-interactions.css
  - apps/comic/src/appraisal-client/comic-tokens.css
---

## Decided
Continue micro-interactions as one shared system in comic-interactions.css, imported last. Scope tokens to .comic-build so entry header and gameplay inherit the same existing accent, focus, hover colors and160ms timing. Selection stays on the control border/fill; keyboard focus is one rose3px ring with4px offset. Group native radio/tooltip focus at ChoiceCard and stepper boundaries, suppress nested rings. Keep item art and semantic terms on their own surfaces. Disabled controls have no press response, reduced-motion removes transitions and pressed displacement.

## Tried and ruled out
The old global .selected outline remained visible on event cards even at idle. Sale choices also had two more-specific local white2px focus rules: remove those duplicates rather than accumulating focus overrides. A broad :is focus selector can win by its a[href] type specificity; descendant suppression must cover native input/button/tabindex targets explicitly. Adding transform/color transitions without opacity dropped quiet-overlay fading.

## Watch out
scripts/ui/comic-interactions-smoke.mjs exercises actual hover/down/up/keyboard states on inventory, events, sale choices, peer-table tooltips, overlay controls, legacy stepper, vault and entry header at1440x720 and1024x800. Move the pointer explicitly before mouse.down in Ego. Existing source inventory and shared-frame baseline failures are separate; do not re-record approved baselines to make this task green.
