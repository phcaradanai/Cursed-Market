---
title: Remove voluntary merchant skip from portal choices
author: Phcaradanai
date: 2026-10-22
branch: main
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - src/appraisal-client/App.tsx
  - src/appraisal-client/en/ui.ts
  - ".gemini/settings.json"
  - ".impeccable/surfaces/src-appraisal-client-app-tsx.md"
  - AGENTS.md
  - GEMINI.md
  - docs/art/concepts/3d-dark-fantasy-2026-10-21/01-entry.png
  - docs/art/concepts/3d-dark-fantasy-2026-10-21/02-lobby.png
---

## Decided
The user requested removing the merchant-skip button on 2026-10-22 because it no longer serves a purpose. The portal screen should focus on choosing a merchant. Render the end-phase control only during APPRAISAL and TRADE, retaining their completion controls.
## Tried and ruled out
Do not remove the engine's done action: timers still need a safe default, and appraisal/trade still need manual completion. No replacement button or new skip reward is requested.
## Watch out
Encounter entry is free in new runs. Preserve timed fallback and historical replay behavior. Untimed players must choose an available portal to advance.
