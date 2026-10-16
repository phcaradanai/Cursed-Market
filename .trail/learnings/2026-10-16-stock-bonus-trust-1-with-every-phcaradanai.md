---
title: "Stock bonus: trust 1 with every merchant gives +1, no scaling"
author: Phcaradanai
date: 2026-10-16
branch: main
cost: { minutes: 7, tokens: 14823 }
touches:
  - ".impeccable/hook.cache.json"
  - src/appraisal-client/App.tsx
  - src/appraisal-client/en/ui.ts
  - src/game/appraisal/pulse.ts
  - src/game/appraisal/types.ts
  - src/game/appraisal/views.ts
  - tests/appraisal-stock.test.ts
  - ".gemini/settings.json"
  - AGENTS.md
  - GEMINI.md
---

## Decided
- Supersedes the scaling stock-tier note. STOCK_RULES is now {minTrust:1, extra:1} in pulse.ts: lowest trust 1 or more across every merchant in play adds exactly 1 shop item, nothing more at higher trust. The view field is stockBonus {tier, extra, need}.

## Tried and ruled out
- 1 extra item per 2 levels of lowest trust: it needed 16+ trust gains for the first item, so it was too far out of reach in a 10-encounter run.

## Watch out
- Trust 1 with all 8 merchants still needs 8 separate trust gains, one per merchant.
