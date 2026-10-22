# Item effects — 2026-10-22

The latest user rules are implemented for new games (`config.itemEffects: true`):

| Action | Rule |
| --- | --- |
| Hold items | Every one of the 63 product kinds has a held effect and retains an activation benefit. Count at most five held copies of each kind. Different kinds contribute independently. |
| Activate the same kind again | Its additional bonus is counted once per encounter, even when using another physical copy. |
| Activate different kinds | Their additional bonuses add together, including bonuses to the same stat. Dream tonic +10 and moon feed +10 give +20 percentage points of coin-call chance. |
| Use a consumable | Costs zero energy, including fake, cursed and fogged outcomes. Existing authenticity, curse and recovery rules still apply. |
| Finish the encounter | Activated bonuses last through the round reward and coin flips, then clear when the next encounter begins. The existing overall 85% coin-call chance cap remains. |

The new held profiles cover the 42 ordinary kinds; the existing 21 artifact profiles remain intact. Additional activated bonuses cover luck, round income, per-coin gain/loss, purchase discounts, low-price acceptance and inspection quota. Successful source kinds are tracked separately from aggregate bonus amounts. Failed activations do not reserve a successful source.

Historical configs without `itemEffects` keep their original costs and stacking rules. Serialized `ITEM_SPECS` data is unchanged to preserve exact audit replay. The UI explains the five-copy cap, different-kind activation stacking and free consumable use in Thai and English without disclosing hidden item values.

## Verification

- `npm run build:server` — passed.
- `npm run build:appraisal` — passed; existing bundle-size warning remains.
- `node --test dist/tests/*.test.js` — **669 passed, 0 failed**, including real HTTP/WebSocket tests on localhost. Network tests require permission to open local listening sockets outside the default sandbox.
- Focused item effects, passive and polish tests — **85 passed, 0 failed**. New coverage checks all 63 kinds, the five-copy cap, same-kind use deduplication, different-kind addition, zero energy, fakes/curses/fog, reset timing, client/server agreement, bilingual cards and exact seeded audit replay.
- `git diff --check` — passed.

## Existing diagnostic findings

`trail check` reported 20 keyword conflicts against the wider branch diff. Review found no restoration of the prohibited mechanics: “extra item” refers to effect text rather than stock generation, energy costs here refer to activation rather than NPC purchases, and lucky-die descriptions remain client-side. NPC free buying, added-coin wallet stakes of 10/15 credits, AppraisalPrice displays and phase backgrounds retain their existing behavior. Several flagged files belong to earlier branch work. This diagnostic is **not reported as a clean pass**; the disposition is also recorded in the new team learning.

The design hook's three Cormorant Garamond findings in `styles.css` at lines 3, 43 and 252 are already present in HEAD and conflict with the documented typography. This patch leaves them standing: it neither edits fonts nor adds suppressions.
