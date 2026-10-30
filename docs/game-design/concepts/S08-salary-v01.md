# S08 — รับเครดิตท้ายช่วงและเสี่ยงเหรียญ · v01

2026-10-30 · **draft / not approved / no runtime UI change**

The user explicitly requested a new concept image for this existing screen. This resumes image generation for S08 only; other paused image work stays paused. Keep C21/live-salary as the historical runtime capture and the approved inventory/menu baselines as the current visual authority.

## Composition

One inventory-derived outer frame, shared black/crimson/off-white palette, Thai typography and gently rounded controls. Equal-width left cash-out and right coin-decision regions, equal outside padding/gaps, aligned action baselines; one structural header line, no ornamental ribbons, repeated dividers or nested card clutter. HUD and six-menu dock remain visible. No scroll. One modest inked perspective coin illustration; no duplicated art or merchant image.

Initial fixture: encounter3, wallet85, energy7/10, life4/6, pending reward10, one coin, no income/coin bonus. Left shows pending amount and round-bank. Right shows direct heads/tails actions and a separate add-coin action. Compact shared timeout note. Numbers are illustrative state, not a new default rule.

## Runtime grounding

- `apps/comic/src/appraisal-client/RoundReward.tsx`: existing `round-bank`, `round-flip`, `round-raise`, pending/settled/tossing and per-coin guesses.
- Multi-coin-enabled initial single coin: correct +5, wrong -5, floor0 for this fixture; this is not the historical single-coin lose-all mode.
- Adding a coin costs the encounter base from the wallet:10 in odd encounters,15 in even encounters. Stakes join the pending pool; do not label5 as the addition price. Render actual reward base/bonus/config values in implementation.
- For multiple coins, preserve one prediction per coin and the all-correct condition, gain/loss step scaled by coin count, previous results and stale-attempt/busy protection. This initial-state image does not prove these other substates are designed or implemented.
- Timeout/ready collects the remaining pool under existing rules. Cash-out is not a new combined phase-advance command. Do not invent a dismiss action or new mandatory phase.
- Method/help is read-only; no expanding dropdown or reset clock. Shared controls/tooltips should be reused if implementation is later approved.

## References and scope

- Approved peer: `docs/ui-system/baselines/inventory-1440x722.png`.
- Historical functionality: `docs/game-design/captures/current-comic-2026-10-29/live-salary.png`.
- Generated image: `S08-salary-v01.png`; built-in imagegen, initial prompt and alignment/typography revision prompt retained in sibling `.prompt.txt` files.
- Register as a draft variant. Keep actual capture and approvedImage separate; no automatic baseline promotion. Existing-game code and approved references remain unchanged.
