---
title: Collector shared Comic UI and preview labels preserve approved baselines
author: Phcaradanai
date: 2026-11-02
branch: codex/collector-wishlist
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - ".impeccable/surfaces/src-appraisal-client-app-tsx.md"
  - apps/comic/src/appraisal-client/App.tsx
  - apps/comic/src/appraisal-client/ComicPreview.tsx
  - apps/comic/src/appraisal-client/main.tsx
  - apps/comic/src/server/appraisal-main.ts
  - apps/comic/tests/appraisal-cabinet.test.ts
  - apps/comic/tests/collector-wishlist-network.test.ts
  - docs/game-design/PROJECT-CONTEXT.md
---

## Decided
Approved Collector3+2 now uses the same inventory-sized ComicMenu, ComicButton, CompactPager and ComicTooltip. Four public request/wait/delivery/peek states captured at1024/1440/1920; opaque slots and one common bill, explicit current-quote confirmation, manual missing-credit withdrawal. Main new rooms enable collectorWishlistRules1; explicit no-flag engine configs keep old audits. Whole-game56/STRAT/awards/balance remain open. Exact spec approval is sealed separately; new captures are candidates, not new approved pixel references.
## Tried and ruled out
Long added preview labels grew native select width and failed14 baselines only in the toolbar; shortened just new labels,14pass without masks/re-record. Warning paragraphs are hidden by existing Status header CSS: visible expiry warning belongs in actual Finish button, preserving65px header/control heights. Replacing a preview root with an open dialog leaves old Escape listeners in a mounted test: begin from closed inspection. Old cabinet phrase assertion also fails with historical10629f2 App; reconcile it to the approved Status completion label, not product redesign.
## Watch out
Do not confuse mounted exact-command checks with live-browser payment or server2-socket replay. Live normal40/6-life QA displayedCollector entry at2 but deadline expired before automation clicked; no successful live-browser purchase claim. Baseline/mounted/network receipts and source hashes are separate. Do not regenerate the sealed proposal or use approval of8 pilot items for remaining48.
