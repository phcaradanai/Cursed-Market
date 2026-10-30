# S09 — Post-payout vault and readiness

2026-10-30 · User asked to design a concept **and continue implementing**. This is authorization for S09 UI work, not separate human review of generated image pixels or a new screenshot baseline.

## Implementation

`PostRewardScreen` reuses `ComicPhaseFrame`, header/frame tokens and `ComicButton`; `VaultPanel` owns the existing custody/credit commands with a new no-scroll two-column presentation. Credit input/minus/plus share equal44px bounds and gaps; deposit/withdraw are equal. Shelves use2 items per compact page, solid empty-slot outlines, existing cloth/item art and full accessible labels. No production asset generation or new financial rule.

ReadyForNext centralizes the existing ready command for classic/survival results and S09. It keeps match/encounter, waiting/disconnection and spectator behavior. No new cash-out action is added after settlement. The reward component remains mounted through a final loss: pre-paint busy notification and hide-settled presentation prevent skipping the final toss or duplicating the settled receipt. Historical no-reward results remain available.

Vault eligibility remains secureEconomy + REVEAL + settled + alive. Locks/capacity block deposits; withdrawals still work. Invalid/fractional/insufficient amounts and insufficient expansion credits stay disabled. Ready players cannot change custody. Stored effects/privacy and the comic4% interest rule are unchanged; root aged10% integration is a separate task.

## Evidence boundaries

- Dedicated fixtures: reward-settled, vault-full, vault-empty. Feature/ownership examples are explicitly sample data; transaction buttons keep example-only feedback and are not live transfer proof.
- Shared engine/storage tests and UI tests preserve actual guards, commands and known/hidden facts. See ../../ui-system/s09-functional-verification.json.
- Browser proof: ../../ui-system/s09-verification.json, actual inventory-frame comparison at1024×800,1440×722,1920×800. Money stepper centre/gaps/heights and paired actions checked, no page scroll, paging, numeric validation and six menu toggles with value/clock preservation.
- Generated concept S09-vault-v01.png is separate from current actual captures and the sealed14-image baseline. The implementation intentionally uses solid outlines and existing asset art, with fewer dividers.
- Existing four broad i18n failures were already reproduced in the S08 audit; they are not fixed or silently counted green here. No full simulation, live multiplayer, phone-portrait or balance verdict.

Run scripts/ui/s09-smoke.mjs through the active Ego task space, then standard ui:test, ui:smoke, ui:visual, relevant functional tests and build. Do not edit frontend source during capture/navigation: HMR can invalidate the page context.

Verified 2026-10-30: focused104/104, UI contracts10/10, sealed baselines14/14 unchanged, peer menu smoke18/18, S09 geometry/validation/menu cases9/9. Synthetic zero-result final-toss lifecycle passes (toss visible/S09 absent during animation; S09 visible/toss absent afterward). Actual canonical captures C31–C33. Server and Comic builds pass; existing bundle warning retained.
