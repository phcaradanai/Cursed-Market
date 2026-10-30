---
title: S09 shares inventory frame and preserves final toss lifecycle
author: Phcaradanai
date: 2026-10-30
branch: main
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - ".impeccable/surfaces/src-appraisal-client-app-tsx.md"
  - apps/comic/src/appraisal-client/App.tsx
  - apps/comic/src/appraisal-client/ComicPreview.tsx
  - apps/comic/src/appraisal-client/RoundReward.tsx
  - apps/comic/src/appraisal-client/SecureEconomy.tsx
  - apps/comic/src/appraisal-client/main.tsx
  - apps/comic/tests/appraisal-round-rewards.test.ts
  - apps/comic/tests/appraisal-secure-client.test.ts
---

## Decided
S09 post-payout vault reuses ComicPhaseFrame, inventory geometry/header/buttons, equal two columns and 44px centered amount controls. Vault shelves page two items without scroll. One ready action preserves classic/survival/spectator and match/encounter guards. User authorized concept and implementation together on 2026-10-30, not a separate screenshot baseline approval. C31–C33 record actual fixtures; the sealed14 references remain unchanged. Comic4% runtime is separate from root aged10%; this UI slice changes no engine rule.
## Tried and ruled out
Unmounting RoundReward immediately at settlement skips the final zero-result toss. Keep it mounted, hide its settled summary, and report tossing in useLayoutEffect before paint. Actual GameTable synthetic DTO browser test verifies tossing is visible before S09 and S09 appears afterward. A new long preview label displaced the shared toolbar in the prior S08 audit; new fixture labels stay short. Initial transfer row106px overflowed its label/actions;126px fits tested desktop sizes.
## Watch out
Fixture clicks are sample-only and do not prove live transfers. Focused104 tests, UI contracts10, existing baseline14, peer menu18 and S09 browser9 passed; no live multiplayer/phone/balance claim. Existing broad i18n4 failures remain. Do not edit frontend source during browser capture (HMR invalidates contexts). Current source-hashed captures and central Atlas/HTML are authoritative, not concept pixels. Trail check has unrelated pre-existing .impeccable lexical conflicts and a400KB coverage cap; do not call it exhaustive.
