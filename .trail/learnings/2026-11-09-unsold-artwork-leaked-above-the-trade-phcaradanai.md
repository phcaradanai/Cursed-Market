---
title: Unsold artwork leaked above the trade table
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
  - apps/comic/src/appraisal-client/comic-ui.css
  - apps/comic/src/appraisal-client/components.tsx
---

## Decided
The recurring small item plus name/appraisal tooltip comes from the separate Unsold panel, mounted beside the fixed TradeScreen. Its positioned art can stack above the tabletop. Remove that sibling and render Unsold only while the existing offers menu is open. Keep its three gameplay handlers, and page unsold items and trading content with the shared Pager.

## Tried and ruled out
Changing shared ComicTooltip pointer dismissal alone did not remove the underlying Unsold art/trigger. The default trade preview has no appraised unsold stock, so testing it alone missed the bug. Use ?preview=trade&unsold=1, which includes appraised stock and three public peer listings. scripts/ui/trade-unsold-smoke.mjs checks both desktop sizes, action containment, exact tooltip content, closing, and peer hover dismissal.

## Watch out
The visible artifact is not evidence of a permanently open ComicTooltip; inspect the source panel and stacking too. Existing shared-frame smoke/visual baseline drift and source inventory drift remain separate failures. No baseline promotion or game action is needed for this regression test.
