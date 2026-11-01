---
title: Forced theft utilities need bounded Comic navigation and phase cleanup
author: Phcaradanai
date: 2026-11-01
branch: main
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - ".impeccable/surfaces/src-appraisal-client-app-tsx.md"
  - apps/comic/src/appraisal-client/App.tsx
  - apps/comic/src/appraisal-client/SecureEconomy.tsx
  - apps/comic/src/appraisal-client/theft-concept.css
  - apps/comic/src/appraisal-client/validation/pilot-item-fixture.tsx
  - docs/game-design/implementations/completion-program.md
  - docs/game-design/implementations/new56-pilot-runtime.md
  - docs/ui-system/decisions.md
---

## Decided
Finish the approved forced-RPS UI using existing ComicMenu/Button/CompactPager/Peek and inventory bounds. One HUD handshake opens the internal theft drawer; the six dock menus remain unchanged. Target/history navigation is read-only; exact theft-start requests remain server validated. Merchant targets show public stock; player targets use only public IDs/counts/cooldown. Use fixed pages for stock, one closed duel and one revealed round.
## Tried and ruled out
Permanent secure-economy theft-table shrank appraisal to355px; expanding details violated no-scroll design. Default inspection preview lacks secureEconomy, so old14 baselines alone never covered this gap. Use explicit secure/core2 public DTO fixtures. The forced smoke runner returns void; don't inspect returned.passed after successful checks.
## Watch out
An unavailable openDrawer can leave the main pane inert after TRADE to REVEAL or removed bag/status/market at RESULTS. Clear only orphaned navigation, and close theft drawer when active duel arrives. Preserve read-only utility access, deadlines, unknown facts and sealed hands. Core2 off cannot start theft; pending abilityChoice also blocks targets. Crime history remains accessible with zero current duels. Native pilot verification pins UI sources: rerun affected compatibility and retain old evidence before updating hashes. Frozen catalogVersion4 is eight items; do not widen the generator for remaining48 without versioning recorded replay inputs.
