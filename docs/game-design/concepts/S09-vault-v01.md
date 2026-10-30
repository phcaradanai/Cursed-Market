# S09 — จัดของหลังรับเงินและพร้อมไปต่อ · v01

2026-10-30 · User requested concept **and continued implementation**. This authorizes S09 UI work; the generated image is not separately reviewed or approved as a pixel baseline.

## Contract

Use the existing inventory/S08 outer frame, ComicPhaseFrame, ComicButton, CompactPager and Peek. Equal-width credit and custody regions, identical paired controls, repeated12px gaps,24px inset (18px on short desktop). Preserve HUD, preview selector and six-menu dock. No scroll, expanding dropdown, dashed borders, repeated dividers, new palette or replacement production item art.

Left: actual wallet/vault balances, centred amount input with equal44px minus/plus buttons, equal deposit/withdraw actions, eligible next-interest amount and a read-only explanation. Right: carried/stored shelves with2 items per compact page, full item name accessible even when visually truncated, available slots and expansion command. Ready is a separate footer action, never another cash-out command.

- Preserve original secureEconomy / alive / REVEAL / settled guards and server action names.
- Stored goods cannot be stolen/activated or grant effects. Locked carried items cannot be deposited. Full slots block deposits, not withdrawals. Invalid/fractional/insufficient credit amounts remain disabled.
- Comic currently retains4% legacy interest, distinct from root aged10% work. Do not silently migrate game rules. Show actual nextInterest; any future rate integration is a separate task.
- Readiness uses existing reveal-ready match/encounter command; ready/disconnected players cannot bank or move goods. Spectator readiness and feature-disabled rooms retain their rules.
- Keep RoundReward mounted through its final toss; suppress only settled presentation so a zero-result animation can finish before S09 appears.

Illustrative concept: wallet95, vault40, nextInterest1, one stored item in2 slots. Runtime preview uses real existing item assets rather than artwork imagined by the concept. Solid empty-slot outlines and fewer decorative lines are intentional restoration of existing UI rules.

References: S08 actual screenshot and approved inventory baseline. Generated with built-in imagegen; prompt in S09-vault-v01.prompt.txt. Implementation report: ../implementations/S09-vault.md. Current screenshots remain separate from this concept and from the sealed14-image baseline set.
