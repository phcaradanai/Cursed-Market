# RULE-01 — Vault interest implementation

User confirmed on 2026-10-28: 10%, held from encounter start to finish, floor to integer credits, withdrawals use newly deposited funds before eligible principal.

## Runtime

- New runs persist `vaultInterestRules:1`; absent historical configs preserve 4% whole-balance behavior and old trace shape.
- `PersonalVault.interest` records eligible principal and the encounter snapshot. Fresh deposits in REVEAL 1 begin eligibility at encounter 2; surviving principal pays at encounter 3.
- Withdrawals reduce eligibility only after new funds are exhausted. Redepositing cannot restore lost eligibility.
- Wallet payout remains bank-funded and does not automatically compound. A settlement is recorded even when bank funding is zero/partial, preventing another claim that encounter.
- Age metadata is private; only rate and estimated eligible interest appear in the view.

## Evidence

- First six regression tests failed against the original 4% implementation, then passed after the change.
- Focused suite: 53 passed, 0 failed. Covers 9 new interest tests plus storage/seals/loans/client/integration/end rules.
- Server TypeScript build and appraisal-client TypeScript build passed.
- Atlas regenerated and checker passed; generated rule record now distinguishes implemented new runs from historical configs.
- Full post-change suite: 840 passed / 1 failed out of 841. The failure expected only fee plus commission but ignored the existing one-credit E43 trade subsidy. Fixed that network fixture expectation for either participant. Final affected suite: 69/69 passed, including the complete network file and all vault-related tests. The complete 841-test suite was not rerun after this test-only fix.

## Balance boundary

This fixes a confirmed rule, not proof that 10% is balanced. Original pre-change 12-run synthetic baseline is in 2026-10-28-runtime-baseline.json. These bots do not intentionally execute every vault/loan action. Multiple victory paths are tracked separately in strategic-paths.md and are not implemented by this change.

## Durable source follow-up2026-10-30

User explicitly authorized a separate commit for this previously uncommitted work:4548562. Root server/client typechecks and29 focused vault/client/seal tests pass, including all9 aged-interest cases. A fresh Git-export tree verifies all106 Atlas inputs/outputs with installed dependencies reused. No additional production edits, E43 test change, comic rule integration or full simulation/balance claim is included. See docs/ui-system/root-provenance.json.
