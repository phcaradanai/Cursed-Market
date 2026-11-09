---
title: Keep tooltips outside clipped utility drawers
author: Phcaradanai
date: 2026-11-09
branch: main
touches:
  - "apps/comic/src/appraisal-client/ComicTooltip.tsx#ComicTooltip"
---

## Decided
Nonmodal utility dialogs clip tooltips when the portal target is the dialog. Portal to body for nonmodal dialogs; use the nearest `dialog:modal` to keep tooltips in the modal top layer.

## Tried and ruled out
Removing overflow clipping from utility frames would weaken frame/content clipping. The portal target alone fixes Status while preserving the existing `aria-describedby`, Escape and dismissal behavior.

## Watch out
`ComicTooltip` is shared by status, trade, wishlist, event choices, sale and score. Verify both Status `?preview=theft` and a modal EventMenu: the Status bubble should render outside the drawer, while an event tooltip should remain inside its modal.
