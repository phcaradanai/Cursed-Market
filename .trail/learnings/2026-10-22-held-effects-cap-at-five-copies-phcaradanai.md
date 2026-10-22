---
title: Held effects cap at five copies; activated bonuses stack only across different item kinds
author: Phcaradanai
date: 2026-10-22
branch: main
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - src/appraisal-client/HeldEffects.tsx
  - src/appraisal-client/catalog-text.ts
  - src/appraisal-client/components.tsx
  - src/appraisal-client/en/ui.ts
  - src/appraisal-client/lore.tsx
  - src/appraisal-client/model.ts
  - src/game/appraisal/engine.ts
  - src/game/appraisal/mechanics.ts
---

## Decided
- Latest user clarification on 2026-10-22: held bonuses count at most five copies per product kind. Activated bonuses stack across different product kinds, including the same effect, but repeated successful uses of the same kind do not add another bonus. Dream tonic +10 and moon feed +10 therefore give +20 percentage points; another dream tonic adds zero.
- config.itemEffects defaults true for new games. Extra held effects cover the 42 ordinary kinds, alongside the existing 21 artifacts. Every kind keeps its original activation benefit. All consumables cost zero energy to activate, including fake, cursed and fogged outcomes.
- Track successful bonus sources in Appraiser.itemUseKinds and aggregate amounts in itemUseBonuses. Reset both only after banking the encounter reward. Coin probability snapshots at reward opening and retains the existing 85% overall cap.
- Keep new balance metadata separate from ITEM_SPECS so generated items in old audits remain byte-for-byte compatible. Absent itemEffects retains historical costs, unlimited artifact stacking and no new bonuses.

## Tried and ruled out
- Unlimited held stacking was superseded by the user's five-copy cap.
- Global non-stacking by effect was explicitly corrected by the user. Deduplicate by item kind instead; different kinds granting luck must add together.
- Do not count failed/fogged activations as successful bonus sources. Do not remove activated benefits when the consumed source item leaves inventory.

## Watch out
- Server passiveBonuses and client playerPassives must both pass itemEffects to heldPassives; its default false preserves historical standalone calculations. Apply exclusions before the five-copy cap when quoting a sale.
- Cards and activation buttons show free consumable use, held cap and same-kind use deduplication in Thai and English. Price knowledge stays hidden until inspected.
- trail check currently emits broad keyword matches on this branch: extra item refers to bonus text, not stock generation; energy cost refers to activation, not NPC purchasing; lucky-die text remains client-side and ITEM_SPECS is unchanged. The existing freeBuy default, 10/15 added-coin stakes, AppraisalPrice displays and phase backgrounds remain intact. Other flagged files were already outside this item patch. These findings do not represent restoring the ruled-out mechanics.
- Three Cormorant Garamond font findings (styles.css lines 3, 43, 252) already exist in HEAD and DESIGN.md. This item patch does not edit typography or suppress these warnings.
