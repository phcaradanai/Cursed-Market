---
title: Compact Dark Market notices and in-context portal decisions
author: Phcaradanai
date: 2026-10-23
branch: fix/event-choices
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - src/appraisal-client/PortalEventPreview.tsx
  - src/appraisal-client/components.tsx
  - src/appraisal-client/en/ui.ts
  - src/appraisal-client/feedback.tsx
  - src/appraisal-client/styles.css
  - tests/appraisal-client.test.ts
  - tests/appraisal-commerce.test.ts
  - ".gemini/settings.json"
---

## Decided
The user requested compact game UI based on the October 21 dark fantasy concepts, starting with overflowing Dark Market lists and portal-affecting encounter decisions. Dark Market shows three summary notices per page, then one complete order or auction in a native dialog. On narrow screens, order terms and selling are separate views in that same dialog; duplicate owned items are selected one at a time. E01/E08/E10 show every merchant, public goods hint and projected door availability beside the decision. Tucking an event preserves the selected choice. Reuse existing art, canonical fonts, MarketSale quotes and server rules.

## Tried and ruled out
Expanding every contract and owned item inside a drawer caused overflow. Repeating E08 terms in both merchant cards and choices wasted space. Shrinking the entire UI or clipping overflow would hide readable decision details and controls. Native dialogs need explicit opener focus restoration when React removes them, and Escape must not also close the underlying drawer.

## Watch out
Keep modal portals outside the drawer and use only public DTO knowledge. Preserve quota, affordability, copies and consequence locks. The browser checked all 24 event-choice/viewport combinations at 1366x768, 1024x768 and 390x844 without modal overflow; it also checked market pagination, duplicate-item sale through the engine, mobile order views, focus trapping and restored event choices. Focused tests passed 105/105. The full suite passed 821/822; its cross-shop network assertion passed when rerun alone, indicating a timing-sensitive failure under the full load. trail check also flags pre-existing metadata/branch-history wording; these UI changes do not change those game rules.
