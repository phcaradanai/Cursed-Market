---
title: Portal context must cover current E117 E118 E119 events
author: Phcaradanai
date: 2026-10-23
branch: fix/event-choices
cost: { minutes: 2, tokens: 66753 }
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - README.md
  - docs/plan/Appraisal_LAN_v0.5.md
  - src/appraisal-client/App.tsx
  - src/appraisal-client/PortalEventPreview.tsx
  - src/appraisal-client/components.tsx
  - src/appraisal-client/en/ui.ts
  - src/appraisal-client/feedback.tsx
  - src/appraisal-client/styles.css
---

## Decided
The user's screenshot on 2026-10-23 showed the current E117 toll event without any visible merchants. Portal preview and dialog layout now apply to every event in the PORTALS phase rather than an allowlist of three legacy event IDs. Each door has a numbered label, merchant portrait inside the existing gate art, public goods hint and projected open/closed state. Current choice labels name the numbered door and merchant that will close. Read current and archived choice metadata through core2Choice with the view's rule versions; keep old E01/E08/E10 semantics explicitly separate.

## Tried and ruled out
The earlier E01/E08/E10-only fix and its browser checks missed the events used by the current Survival game. Adding another duplicate event allowlist would repeat that failure. Repeating full affected-merchant names in the confirm button made narrow screens too tall; the choices keep the full mapping while confirmation uses the canonical action name. Removed the overlapping decorative radio marker from these selected-frame cards.

## Watch out
Core2 `door: first` closes index 1; `door: second` closes index 0. It does not close every other door: the third door stays available unless already disabled. Preserve pre-existing disabled flags and never enter a door when merely resolving an event. The tests now enumerate all data-defined core2 PORTALS events and compare every offered choice against real engine results under current and archived rules. Focused tests pass 79/79; browser fixtures exercised all current event types independently of live player rooms. Keep state private: preview only the public portal DTO, never hidden stock or values.
