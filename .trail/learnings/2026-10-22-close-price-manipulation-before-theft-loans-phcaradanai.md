---
title: Close price manipulation before theft loans and vault expansion
author: Phcaradanai
date: 2026-10-22
branch: main
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - ".gemini/settings.json"
  - AGENTS.md
  - GEMINI.md
  - docs/art/concepts/3d-dark-fantasy-2026-10-21/01-entry.png
  - docs/art/concepts/3d-dark-fantasy-2026-10-21/02-lobby.png
  - docs/art/concepts/3d-dark-fantasy-2026-10-21/03-portals.png
  - docs/art/concepts/3d-dark-fantasy-2026-10-21/04-inspection.png
  - docs/art/concepts/3d-dark-fantasy-2026-10-21/05-appraisal.png
---

## Decided
On October 23, 2026 (Asia/Bangkok), the user prioritized closing price-manipulation exploits before proceeding with the theft, loans, and personal-vault feature set. The user proposed that a sale or appraisal at 150% of base or higher could probabilistically mark an item as overpriced; the item would sell for zero until successfully reappraised. This mechanism is under discussion, not an approved implementation.

## Tried and ruled out
Random detection alone does not guarantee exploit closure: players can attempt inflated trades below the threshold, and expected automatic buyback proceeds may remain profitable above it. No detection probability, reference-value cap, reappraisal price, or definition of which sale routes return zero has been chosen. The previous collateral deadline rule still uses last transaction value unless the user explicitly changes it.

## Watch out
Item-specific base and merchant storefront ask are separate existing values. Do not silently use the per-kind anchor as the item's base. An assistant recommendation is to keep NPC/system payouts independent of player-inflated transaction prices, with any overpricing status adding game risk rather than serving as the sole economic safeguard. Player-to-player loans transfer the lender's existing credits, so they should not mint credits; snapshot collateral value and deadline at agreement to prevent later trades from rewriting an active contract. Reappraisal must not increase the underlying base or erase an item's price history. Any price-warning rule needs clear buyer disclosure and must not let unsolicited appraisals sabotage another owner's item.
