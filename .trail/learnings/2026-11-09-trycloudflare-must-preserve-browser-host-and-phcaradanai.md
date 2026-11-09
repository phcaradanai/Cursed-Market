---
title: Trycloudflare must preserve browser Host and Origin
author: Phcaradanai
date: 2026-11-09
branch: main
touches:
  - ".impeccable/hook.cache.json"
  - apps/comic/src/appraisal-client/App.tsx
  - apps/comic/src/appraisal-client/ComicPreview.tsx
  - apps/comic/src/appraisal-client/PortalEventPreview.tsx
  - apps/comic/src/appraisal-client/StatusMenu.tsx
  - apps/comic/src/appraisal-client/TradeScreen.tsx
  - apps/comic/src/appraisal-client/appraisal-concept.css
  - apps/comic/src/appraisal-client/comic-frame.css
  - apps/comic/src/appraisal-client/comic-ui.css
  - apps/comic/src/appraisal-client/components.tsx
---

## Decided
Expose Comic Vite on5174 with cloudflared tunnel --url http://127.0.0.1:5174 --no-autoupdate. Keep the public Host; allow the .trycloudflare.com suffix in the Comic Vite development server. The backend still requires Origin.host===Host for browser WebSockets.

## Tried and ruled out
--http-host-header localhost:5174 makes the HTTP page load but causes browser WebSocket403 because Origin remains the public domain. A Node ws probe without an Origin header incorrectly appeared successful. Reproduce with the actual public Origin; verify matching Origin opens and an unrelated Origin still gets403.

## Watch out
Quick tunnel domains change after restart. Verify the actual public browser reaches online and enables the form after filling a name. Do not disable backend Origin checks or set allowedHosts:true. Room creation was not submitted during verification.
