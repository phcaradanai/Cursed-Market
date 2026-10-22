---
title: Three.js world behind the appraisal table (Threshold redesign)
author: Phcaradanai
date: 2026-10-21
branch: main
cost: { minutes: 50, tokens: 356623 }
touches:
  - ".impeccable/hook.cache.json"
  - PRODUCT.md
  - package-lock.json
  - package.json
  - src/appraisal-client/App.tsx
  - src/appraisal-client/en/ui.ts
  - src/appraisal-client/index.html
  - src/appraisal-client/main.tsx
  - src/appraisal-client/styles.css
  - tests/appraisal-i18n.test.ts
---

## Decided
- The 3D look is a Three.js scene behind the unchanged DOM table, not a WebGL table. Code in src/appraisal-client/world/: scene.ts (lazy chunk, loaded only by World.tsx via dynamic import in useEffect), state.ts (worldStateFor: the only facts the scene may see), Chapter.tsx (phase heading), tilt.ts (card tilt).
- The scene may react only to what the player already sees: phase, own life, caught, open event, offered doors, chosen merchant. Never hidden item truth (cursed/fake/value).
- Each phase is a camera rig in RIGS (scene.ts). Rigs keep the eye in the upper band, behind the phase header, so it never sits behind body text.
- In PORTALS each gate is placed every frame behind its DOM .portal card (screen rect unprojected onto z=-10), so the card is the gate's face.
- Panels ~0.9 alpha so the world shows through; modal, toasts and peeks stay solid.
- Theme: black samut khoi leaves with orpiment gold rules, verdigris haze, ichor violet for events. Display font: IM Fell English (Latin) then Srisakdi (Thai), via @fontsource in main.tsx.

## Tried and ruled out
- Glass/backdrop-filter on panels: it makes the panel the containing block for fixed .peek children inside it.
- Eye centred in view: its corona sat behind headings and body copy (contrast fail).
- Gates at fixed world positions: hidden behind the portal cards in the phase that owns them.

## Watch out
- No transform, filter, perspective, backdrop-filter or transform-style on ancestors of .modal-backdrop, .toasts or .peek. Tilt only on leaf cards, and only while .tilting.
- GameTable is SSR-rendered in tests; never import three (or scene.ts) statically from App/components/lore.
- New t() strings need en/ui.ts entries; world/Chapter.tsx is in CLIENT_FILES in tests/appraisal-i18n.test.ts.
- The in-app preview tool takes port 5174, so `npm run dev` fails under it; serve the built app with `node dist/src/server/appraisal-main.js` on another PORT for screenshots.
- In the results phase, full dread (everyone at 0 life) tints the sky red over teal, which reads olive. That is intended.
