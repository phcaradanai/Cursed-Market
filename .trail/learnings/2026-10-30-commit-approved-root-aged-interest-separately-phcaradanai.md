---
title: Commit approved root aged interest separately from comic continuity
author: Phcaradanai
date: 2026-10-30
branch: main
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - ".impeccable/surfaces/src-appraisal-client-app-tsx.md"
  - src/appraisal-client/SecureEconomy.tsx
  - src/game/appraisal/engine.ts
  - src/game/appraisal/secure-storage.ts
  - src/game/appraisal/types.ts
  - src/game/appraisal/views.ts
  - tests/appraisal-network.test.ts
  - tests/appraisal-secure-client.test.ts
---

## Decided
On 2026-10-30 the user explicitly approved checking and committing the pre-existing root aged10% vault-interest implementation as a separate commit. This preserves root source that the system Atlas already fingerprints. Scope is SecureEconomy, root engine/storage/types/views, vault-specific client/seals tests and the nine-case vault-interest test. Server build, appraisal-client typecheck and 29 focused tests pass. Do not copy this root engine over the isolated comic app.

## Tried and ruled out
Worktree Atlas freshness did not prove a clean clone: four root runtime inputs differed from committed HEAD. Recording source hashes without committing source was insufficient. Do not include the separate E43 network subsidy assertion or unrelated .impeccable state in this commit.

## Watch out
Old configs without vaultInterestRules retain4% whole-balance behavior; new runs require original principal held from encounter start through finish, newest deposits withdrawn first, floor, no immediate/redeposit entitlement and no repeated payout. Comic retains its separate imported runtime until an approved rule-integration task. Verify committed Atlas inputs and an exported Git tree after the source commit, not just local files. Full simulations and multiplayer/balance are outside this focused evidence.
