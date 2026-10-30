# Comic aged-interest implementation plan

> For agentic workers: execute inline with superpowers:executing-plans; no per-task subagent needed.

**Goal:** active Comic uses the already-approved10% full-encounter principal rule, with old audits preserving4% whole-balance behavior.
**Architecture:** port the narrow root4548562 interest patch, adding versioned config/metadata and eligible-interest view. Existing ledger, reveal action window, bank budget, ghost integration, UI frame and root source stay intact.
**Tech stack:** existing TypeScript/React/Node tests, no dependency.
**Spec:** ../rules-and-logic.md section5 and approved user answers (floor, new money withdrawn first, no retroactive topups).

## Constraints and review focus

- Withdrawal/redeposit cannot restore age; new deposit cannot inflate old principal.
- New-rule balances missing metadata start fresh; old configs without flag retain4%.
- Mark encounter before calculating payment, including bank shortage/zero, preventing retries.
- Dead seats receive no interest; UI exposes eligible amount/rate without private age metadata.
- Audit/replay, conservation, loan settlement and ghost delivery remain valid; preserve UI geometry and baseline approval.

## Task1: versioned settlement and view

Files: apps/comic/src/game/appraisal/{secure-storage,types,engine,views}.ts; apps/comic/src/appraisal-client/SecureEconomy.tsx; apps/comic/tests/appraisal-vault-interest.test.ts. Callers traced via Trail; ambiguous same-name root/Comic graph requires literal occurrence audit.

- [x] Add the existing9 approved root interest cases to Comic; run against current storage and observe failures.
- [x] Apply only approved interest hunks from4548562 to the four game files. Add vaultInterestRules:1 default/validation, PersonalVault.interest and nextVaultInterest; existing advance pay hook remains.
- [x] Wire optional interestPercent in view and existing tooltip copy; no new layout/component/style.
- [x] Run server/client build;9interest cases plus secure storage/seals, ghost/replay, UI contracts. Historical4% fixtures explicitly delete the new flag only where they intend old rules.
- [x] Add command-only engine replay coverage if the existing9cases do not cover full phase lifecycle; prove request idempotency and actual advance settlement.
- [x] Run UI check/test/smoke/visual with fresh receipts; compare narrow/wide vault wording in existing component.
- [x] Update central game-status facts/roadmap/Atlas and verification; source fingerprints; Trail check; checkpoint only intended files.

Rollback: new runs can omit the version flag to retain historical4% semantics; no saved balances/items destroyed. Do not rewrite old audits or retroactively apply new rules.

## Execution ledger

Task start9e749c4. Rule already approved; no reapproval required for identical-value compatibility migration. Whole-game program remains active after this task.

Result2026-10-31: narrow root interest hunks ported; views preserved ghost integration.36initial cases passed, then54cases after missing-vault rate DTO/Thai-English copy and phase-to-results replay coverage. Ghost network1, UI contracts10, approved visual14 and menu18 pass with fresh matching CLI receipts. Intermediate builds/test failures retained as diagnostics; final receipts are authoritative. No whole-game balance or full simulation pass.
