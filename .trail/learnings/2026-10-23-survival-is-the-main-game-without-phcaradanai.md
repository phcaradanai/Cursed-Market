---
title: Survival is the main game without mode selection
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
On 2026-10-23 the user requested Survival as the main game with no mode selection. The shipped appraisal server always supplies SURVIVAL_RULES; plain AppraisalRoomService construction also defaults to Survival. Survival services reject legacy rules-mode requests for Classic without clearing readiness. Entry and lobby no longer render the selector or comparison table and explain the current rules directly. The running game's config determines its projected mode. README and the current LAN guide reflect the new entry flow.

## Tried and ruled out
Hiding the picker alone would leave new rooms using Classic and allow old clients to switch modes. A survival-only environment flag is no longer needed. Deleting Classic from the engine or protocol would damage historical audit/replay compatibility; explicit legacy service configurations remain supported for those fixtures.

## Watch out
Classic regression fixtures now pass an explicit empty runConfig instead of relying on the old service default. Production supplies Survival explicitly, so this internal compatibility path does not add a player-facing choice. Browser validation on the running game created a room without selectors, added a bot and started directly with 6/6 life. Two focused test runs passed 128/128 and 69/69; server and client builds passed. The working tree also contains earlier UI changes and design metadata, so preserve them. Existing trail keyword warnings need human interpretation and must not cause unrelated game-rule changes.
