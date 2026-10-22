# Goal: game-standard UI/UX, 2.5D (2026-10-22)

The user asked to keep working until the appraisal client's UI/UX reaches a standard game level, in the 2.5D painted direction (Darkest Dungeon / Inscryption style), using real 3D only where it is needed, and without stutter. Concept references: `docs/art/concepts/3d-dark-fantasy-2026-10-21/`.

## Definition of done

Each item is checked against the built app, not the code.

1. **A painted scene for every phase:** entry, lobby, portals, appraisal, trade / Dark Market, reveal (round coin) and Collector results. Each phase has its own depth plates, and phases crossfade with no flash of empty ground.
2. **One decision per screen:** at 1440×900 the primary action of each phase is visible without scrolling. Supporting information (statuses, notes, Dark Market, held effects, rules) sits in a compact HUD or in drawers. It is never removed, and the wishlist stays reachable in every phase.
3. **A compact game HUD:** credits, energy, life, encounter and timer sit in one top bar, styled as in the concepts.
4. **One component family:** bronze plaque buttons, stone plaques and parchment posters, used consistently. There are no dropdowns. Every disabled control keeps its tooltip.
5. **Feedback:** hover, press, chapter heading, toasts and the event dialog. Merchant art never moves controls out from under the cursor.
6. **Performance:** a 5 s rAF sample with the pane visible gives p95 ≤ 20 ms and 0 frames over 33 ms, at 1440×900 and at 375×812. The only WebGL is the ember layer.
7. **Accessibility:** body text has contrast ≥ 4.5:1 over the plates. Keyboard focus is visible. Reduced motion gives a still scene with no tilt and no chapter card.
8. **Robustness:** `npm test` and `npm run build` pass. There is no horizontal overflow at 375. Without WebGL the painted plates still show.
9. **Review:** a fresh finish reviewer returns `ship`, and DESIGN.md describes the built world.
10. **Provenance:** every shipped raster is in `docs/art/stage-2.5d/generation-manifest.json` with its prompt and hashes.

## Progress

- [x] Engine: CSS depth layers, decoded crossfade, ember-only WebGL, image-only tilt
- [x] Portals: hall plates, arch gates with masked merchant cut-outs and interiors, all 8 merchants
- [x] Appraisal scene and merchant card (cut-out in a tinted room); desk shows fact seals, the 3 steps and the console first, with details folded away
- [x] Trade / Dark Market scene and parchment wanted posters (9-slice border image); trade listings as compact cards with seals and an offer stepper
- [~] Compact HUD band, drawers (bag, effects, Dark Market, ledger, rules), sticky action bar, no side column; REVEAL/RESULTS layouts still to do
- [~] Entry, lobby, reveal and Collector plates generated and wired; screen layouts not yet tuned
- [ ] Reveal / coin and Collector scenes
- [ ] Event dialog, toasts, inventory and rules restyled into the component family
- [ ] Performance, accessibility and overflow pass
- [ ] Finish review → ship, DESIGN.md, provenance check

2026-10-22 user direction: stop clinging to a web-like information UI. Each phase is a game screen; details go behind HUD drawers or folded sections.
