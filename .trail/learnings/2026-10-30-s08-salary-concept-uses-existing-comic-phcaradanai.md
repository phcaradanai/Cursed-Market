---
title: S08 salary concept uses existing comic frame and actual coin stakes
author: Phcaradanai
date: 2026-10-30
branch: main
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - ".impeccable/surfaces/src-appraisal-client-app-tsx.md"
  - docs/game-design/PROJECT-CONTEXT.md
  - docs/game-design/development-roadmap.md
  - docs/game-design/logic-item-relations.html
  - docs/game-design/screen-context.md
  - docs/game-design/screen-flow.html
  - docs/game-design/screen-flow.json
  - docs/game-design/system-atlas/README.md
---

## Decided
On 2026-10-30 the user explicitly requested a new concept image for existing S08 end-of-encounter reward/coin UI. This authorizes image generation for S08 only, not implementation or a blanket resume. Draft concepts/S08-salary-v01.png uses approved inventory/menu reference and C21 salary functionality, two equal columns, pending reward, direct heads/tails choices and separate add-coin action. Keep original C21 as runtime evidence and approved baselines unchanged. Prompts and brief saved beside the image.

## Tried and ruled out
First render used italic gold reward digits and misaligned cash-out/prediction rows. Revised typography to upright off-white and aligned the main action row more closely. Raster concept is not measured browser geometry or approval; implementation must assert actual equal heights/padding/centres. No runtime or styles changed.

## Watch out
Fixture is encounter3, multiCoinRewards enabled, one coin, pending10, gain/loss5, floor0; adding a coin costs10 from wallet, not5. Even encounter base15. Multiple coins require per-coin prediction and all-correct result, actual passive modifiers, busy/stale-attempt protection, timeout cash-out and settled service flow. Do not import the historical single-coin lose-all rule. Image alone does not cover all these substates or permit new phases/actions.
