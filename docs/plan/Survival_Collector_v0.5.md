# Cursed Market v0.5 — Life, Energy and the Collector

2026-10-14. This rule revision supersedes the v0.4 one-encounter pause, automatic energy recovery, three-encounter ending and accumulated encounter scoring. Historical v0.4 rules, audits and running rooms retain their own behavior.

## Confirmed by the user

- Energy and life are separate resources. Energy pays for starting an encounter and energy-cost actions; energy at zero does not remove the player from the run.
- At zero energy, players still encounter merchants, choose portals and receive recovery deals. Actions requiring energy must wait until the player has enough. Life does not automatically substitute for missing energy.
- At zero life, the player becomes a spectator for the remainder of the run. They do not return in the next encounter. Other living players continue, including a sole survivor.
- Each living player loses **one life at encounter end**, with opportunities to recover life through goods or deals. The user confirmed this attrition to prevent cost-free passing forever.
- There is no fixed three-encounter finish. When **all** players have zero life, the Collector takes their remaining goods and scores their true value, remaining credits, and relevant score buffs/debuffs. Highest score wins; ties remain shared wins.

## Experimental numerical preset

These values are implementation choices for playtesting, not validated balance or additional user-confirmed numbers.

| Rule | Initial preset |
| --- | --- |
| Life | Start/max 6; permanent death at 0 |
| Energy | Start/max 10; encounter entry spends 1 if available. At 0, entry remains allowed so recovery encounters remain reachable |
| Normal actions | Existing energy prices remain. No automatic between-encounter recovery |
| Merchant recovery | One deal per player/encounter, available during appraisal without energy cost and after pending events are resolved |
| Vampire / Autometa / Alien | 2 credits for up to 3 energy, subject to existing D10 recovery reduction |
| Orc / Beast / Dark One | 4 credits for up to 2 life; capped at max, cannot revive a dead player |
| Genuine food/potion activation | Existing 1-energy activation cost and consumption; restore up to 2 life |
| Cursed activation | Existing drawback plus loss of 1 life. A genuine restorative item heals first, then applies curse damage |
| E03 blood pact | Existing energy recovery and D10, plus loss of 1 life. Choosing it at life 1 may kill; recovery does not resurrect |
| E50 lethal contract | Life becomes 0 unless B08 blocks the death; existing B08 replacement loses up to 2 energy |
| Collector item valuation | `floor(base × authenticity × curse)` per item; genuine factor 1, fake factor .25, cursed factor .75 |
| Collector score | `floor((credits + sum(item values)) × (100 + modifierPercent) / 100)` |
| Score statuses | B10 remaining at death gives +20%; D10 remaining at death gives −20%. Percentages add; having both cancels. No per-charge stacking |

The existing 50 events, 20 statuses and 30 distinct product kinds remain. B10 and D10 retain their original mechanical effects and gain explicit Collector score effects in v0.5. No new content count is claimed.

## State and flow

Living players retain all available non-energy actions at energy 0: Dark Market sales, sharing, P2P trading, passing, and eligible events/deals. A failed energy-cost action leaves resources, RNG, request acceptance and inventory unchanged. Entry never substitutes life for missing energy.

Death freezes remaining inventory, credits and statuses until collection. Status ages stop advancing for the dead player; other players cannot buy from, sell to or move goods of a dead player. Already confirmed risks still resolve; death cancels pending action rights. The spectator sees permitted public player/trade information, not others' private inspections or future RNG.

Timed phase defaults skip spectators. Untimed phases and REVEAL wait only for players who can still act; spectators do not need to press continuation. Living players who disconnect still need to return in untimed mode. Existing host-only lobby timer settings, readiness reset, resume and rematch behavior remain.

Portals and stock for the next encounter are generated deterministically when that encounter begins. Every encounter still rolls Dark Market before portal selection; demand is drawn from reachable current/prior generated products, including already sold kinds. No future hidden goods or seed are projected to players.

Collector settlement happens once, immediately after the last living player's final encounter resolves. It moves the held items to Collector ownership and records an itemized receipt for every player, including those who died earlier. Scores do not accumulate from encounter wealth gain or appraisal accuracy; those historical measurements are not added again. Only after final settlement are the collected goods' authenticity, curse and value shown publicly. Rematch starts a new run with full starting life and energy and fresh RNG.

## Compatibility and rollout

The optional `config.survival` distinguishes the new lifecycle. A new run with it is version/schema **5**; a saved v0.4 config without it remains version/schema **4**, with its exact original seeded catalog, generation, death/recovery and scoring. Readers support both and reject a schema/config mismatch. Room and run audit versions must agree. Replay validates the complete deterministic Collector receipt, ownership, resources and score.

Explicit startup uses `APPRAISAL_RULES=survival PORT=<free port> HOST=0.0.0.0 npm run start:appraisal`. Omitting the rule flag retains v0.4. Existing LAN servers and audits are not restarted, deleted, converted or overwritten. Current compiled UI handles either room version.

## Acceptance and limits

Required proof: energy-zero decision/recovery, atomic insufficient-energy rejection, permanent death across advance/resume, spectator-free untimed reveal, sole-survivor play beyond encounter three, life healing/damage/attrition, one-time Collector collection and item/credit/status breakdown, strict new audit replay and exact historical replay, timed/untimed 2/3/4-seat rooms and rematch.

Human testing must measure survival length, waiting after early death, whether recovering life is a tempting expense, how energy/credit changes route choices, Collector outcome clarity, and voluntary replay. These are technical rules until observed with people. No screenshot, raster, rendered-layout, mobile/accessibility or final brand approval is added under the user's stop-image-review instruction.
