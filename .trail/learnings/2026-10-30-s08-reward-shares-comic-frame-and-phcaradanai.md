---
title: S08 reward shares comic frame and preserves coin actions
author: Phcaradanai
date: 2026-10-30
branch: main
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - ".impeccable/surfaces/src-appraisal-client-app-tsx.md"
  - apps/comic/src/appraisal-client/App.tsx
  - apps/comic/src/appraisal-client/ComicPreview.tsx
  - apps/comic/src/appraisal-client/ComicUI.tsx
  - apps/comic/src/appraisal-client/RoundReward.tsx
  - apps/comic/src/appraisal-client/comic-frame.css
  - apps/comic/src/appraisal-client/comic-ui.css
  - apps/comic/src/appraisal-client/main.tsx
---

## Decided
User approved implementing S08 salary-v01 on2026-10-30 and updating central UI context. ComicPhaseFrame shares ComicMenu header rules and inventory frame tokens. RoundReward uses equal-width decision regions and aligned48px cash-out/prediction actions; same padding on four sides (24, or18 at short height). Multiple coins use2 predictions per compact page; choices persist and toss retains all predictions and current attempt. Existing REVEAL utility menus remain available, new bag/status access read-only. Duplicate pending result/ready shortcut is omitted; settled payout returns to existing S09 services/readiness. No game/shared/server changes.

## Tried and ruled out
Inherited round-reward align-items:center initially shrank contents to half the frame; override stretch in the destination owner. Reuse existing coin animation; no new image generation. Long preview option labels changed intrinsic select width, causing13 unrelated screenshot failures almost entirely in toolbar; shortening only new labels restored all14 approved comparisons without rebaselining. Screenshot timeout retries are read-only, not reference-mismatch retries. Do not edit source while a browser run navigates: HMR detached one context, an incomplete4-case run was rejected.

## Watch out
S08 screenshots C29/C30 are actual public-component fixtures, not live settlement or approved pixel baselines.83 focused reward/client tests and10 UI contracts pass, plus6 actual narrow/mid/wide geometry/selection/menu cases. Broader i18n4 failures and28 missing keys were reproduced in earlier committed4548562 source; not fixed or counted green. S09/final results are not redesigned. Keep wallet stake10/15 distinct from per-coin gain/loss5; preserve legacy mode, passive modifiers, busy locks, zero-pool settlement and timeout behavior. Context/registry/HTML carries current captures separately from approved concept.
