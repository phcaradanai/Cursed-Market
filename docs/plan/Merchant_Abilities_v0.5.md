# Trust-based merchant abilities and time encounters

Implemented for new runs with `trustAbilities: true`. Exact restored configurations without the flag retain their historical skill, item and event pools.

## Shared rules

Trust with each merchant unlocks their ability at 1, with upgrades at 3 and 6. Unlocked merchants can be called during appraisal/trade, including merchants other than the current shopkeeper. One merchant ability can be used per player per encounter. Resolve any pending event first; being caught blocks help for that encounter. Abilities consume no trust or energy; normal item activation and purchases keep their normal costs.

Cooldown is measured in encounters, not elapsed time or merchant visits. A base cooldown of 5 used in encounter 2 is ready in encounter 7. Haste B25 subtracts one from the next newly started cooldown; D25 adds two. Neither rewrites a running timer, and both are consumed by the next ability. Their effects expire at the end of the following encounter if unused. Cooldown reductions are capped at half the base cooldown, counting haste, and can never make an ability reusable in the encounter in which it was used. Fractions from copies are retained in the timer; readiness is rounded up to an encounter boundary. Each cooldown item kind can produce its active effect only once per encounter.

| Merchant | Base wait | Trust 1 / 3 / 6 |
|---|---:|---|
| Orc | 3 | One chosen shop item receives 10 / 15 / 20 percent discount, against the paid quote, excluding fees. Expires with the encounter. |
| Autometa | 3 | Reveal true value / value and authenticity / all facts for one shop item. |
| Alien | 4 | Exchange one held original for one of 2 / 3 / 4 persisted candidates. Preserve authenticity/curse quality; scoring value cannot increase. Inherit only already-known attributes. Copies cannot be exchanged to erase their reduced effects. |
| Vampire | 5 | Preserve a consumable on its next use, once per physical original; tier 2 / 3 also restores 1 / 2 energy when invoking the ability. Copies are ineligible. Unused preservation expires with the encounter. |
| Dark One | 4 | Remove the selected debuff; tier 2 restores 1 energy, tier 3 also grants one debuff shield. |
| Deepsea | 4 | Make one held item curse-free without a separate inspection, including unknown items. Tier 2 reveals authenticity; tier 3 also reveals value. A safe target still spends the use. |
| Swarm | 5 | One copy worth 25 / 35 / 50 percent of the original's base value. Effects remain 40 percent at every tier. |
| Beast | 3 | Replace one unbought, unappraised, unlisted shop slot with one of 2 / 3 / 4 choices, including keeping the original. Normal purchase remains necessary. B26 adds one choice, capped at five. |

Opening Alien/Beast choices spends the use and starts cooldown immediately. Candidates persist across reconnect/retry. Other player actions are blocked until a candidate is selected. Ending the phase settles the first candidate, including retaining the original for Beast. Candidate variants avoid repeated kinds while choices are available in the merchant's pool.

## Swarm identity and effects

Every physical original can produce only one numbered copy for the run. Copies retain the original artwork and public kind, explicitly labelled `สำเนา #n ของ …` / `Copy #n of …`, with the source item ID in the DTO. Copy IDs and source restrictions survive trades and sales. Copies cannot themselves be copied. A consumed copy marks its source permanently ineligible. Copy value and quality are fixed at creation; changing trust does not upgrade existing copies.

Numeric held/use benefits and numeric statuses retain 40 percent strength. Integer resource/credit/quota effects round down, without a minimum-one exception. Indivisible effects (such as a shield, exact-information grant, curse-cleansing key or void seal) have a seeded 40 percent trigger chance. Numeric effect sources of the same product kind do not add together: using an original after its weaker copy upgrades that kind to full strength instead of adding a second bonus. Existing five-copy held caps still apply, counting strongest copies first.

NPC sale quotes, including Dark Market, wishes, bond buyers and the E44 buyer, reflect copy value. Player-to-player prices remain explicitly negotiated. Copies cannot be spent in unconditional NPC swaps to turn a low-value copy into a full-value original. Direct barter only accepts a copy if its reduced valuation meets the target price. Item-use events and special tools apply the same 40 percent rule as ordinary activation.

## Distinct additions

Three new collectible kinds each have separate generated 768-pixel JPEG artwork and exact generation prompts in `docs/art/merchant-abilities-v0.5/prompts.json`:

- Rewinding Gear: consumed to reduce the remaining cooldown of a chosen ability.
- Burden-transfer Hourglass: reusable equipment that transfers the same amount of remaining wait from one cooling ability to a different cooling ability.
- Shifting Compass: consumed for B26, adding an option to the next Beast replacement.

Three gated encounters add distinct choices: E130 pays credits to accelerate the longest reducible timer; E131 trades immediate money against a longer future cooldown, or chooses future haste; E132 chooses a future Beast option or pays energy to inspect one shop item's authenticity. Draws use the existing deterministic, eligible, unseen-first event selection. An expired or unaffordable optional offer can always be declined or timed out.

New shop draws avoid repeating a kind until the current merchant pool has been exhausted. New additions are tested by actual behavior, not by differing names/prices. Existing catalogs remain filtered when the feature flag is absent.

## Verification scope

Domain tests cover trust tiers, server targets, ownership transfers, item/event effect scaling, idempotency, pending choices, cooldown adjustments, NPC payouts, private DTOs, unique asset bytes and strict seeded audit replay. Browser evidence uses the local-only fixture server in `docs/validation/merchant-abilities-v0.5/`; no debug route ships in the production server. Numeric balance is an initial playable baseline, not a claim of proven human balance.

## Existing duplicate profiles

The complete catalog audit ignores names, prices and artwork. It found three identical pairs: scanner/inspection-warrant, memory-mirror/surveyor-lens, and void-mask/void-cell. New runs give the scanner an immediate seeded random price scan, the memory mirror a random unknown held-item fact, and the void cell an energy-for-future-cooldown tradeoff. Their counterparts retain the original next-inspection/curse-reading effects. These replacements are gated by `trustAbilities`; historical runs keep their previous activations. A catalog-wide test asserts 66 distinct mechanical profiles and behavioral tests verify the three replacement operations.
