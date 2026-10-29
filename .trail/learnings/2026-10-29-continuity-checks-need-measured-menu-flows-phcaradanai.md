---
title: Continuity checks need measured menu flows and honest raster limits
author: Phcaradanai
date: 2026-10-29
branch: main
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - ".impeccable/surfaces/src-appraisal-client-app-tsx.md"
  - AGENTS.md
  - docs/game-design/captures/current-comic-2026-10-29/trade-item-sale-continuity.png
  - docs/game-design/development-roadmap.md
  - docs/game-design/logic-item-relations.html
  - docs/game-design/scripts/current-capture-render.mjs
  - docs/game-design/system-atlas/README.md
  - docs/game-design/system-atlas/data.json
---

## Decided
Keep the user-approved source apps/comic and the inventory frame. Added ui:smoke: actual public preview UI opens/closes all6 dock utilities at1024/1440/1920 (18 flows), asserts equal header padding12/18/12/18,65px header with1px border,40px actions,10px corners, one visible utility, restored sale item, running clock without reset and no scroll. All63 imported runtime game/shared/server files remain identical to import hashes. Main generated HTML labels the active source separately from historical capture sources.
## Tried and ruled out
Same-width DPR2 captures matched, but full cross-width comparison still drifted (10/14 pass) and double loads did not fix it. Do not call native DPR or cache warming a fix. Restored checkpoint DPR1 candidates rather than replace them with unproven images. Do not relax pixel tolerance or mask art to force green. Browser.getWindowForTarget is unavailable for this Ego surface. Preserve raw failure metrics/hash/path in reports.
## Watch out
Historical comic UI assertions still60/67; artwork manifest actually has20 entries versus old expected10. Focused continuity/price tests11/12. Full simulation tests consumed CPU beyond Node timeout90s; stop only verified own process trees, do not repeat an unbounded full run. Current gates7 Node tests and18 real menu flows pass; pixel reproducibility and human image approval remain open. Future agents should distinguish these states rather than claim full completion.
