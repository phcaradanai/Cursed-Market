# Polish pass (v0.6): effect coverage, balance and route variety

Everything here is behind `polish: true` in the run config. `appraisal-main` turns it on for live rooms; the library default stays off so saved audits and the older tests replay byte-for-byte.

## What every effect now touches

| Lever | Buffs | Debuffs |
|---|---|---|
| Sale of something the seat **owns** (Dark Market, merchant wish, bond buyer, collector offer) | B13 +20% (one sale), **B17 +15% (encounter)**, omen *ตลาดคึกคัก* +15% | D13 −20% (one sale), **D17 −20% (encounter)**, omen *ราคาตลาดเฟ้อ* −20% |
| Items appraised for a merchant (commission, cross-shop) | never affected | never affected |
| NPC purchase price | B03 −2 | D12 +2 |
| Fee on purchases, curse cleansing, recovery deals | B03 −2 on cleansing | **D18 +1**, D16 +2 on recovery, omen *ภาษีเงา* +1 |
| Inspection energy | B05, B11, omen *ฟ้าสว่าง* (first one) | D01 |
| Appraisal acceptance | B12 +25 pts, omen *เทศกาลพ่อค้า* +10 | — |
| Curse cleansing odds | B16 +20, omen festival +10 | D16 −15 |
| Wish pitch odds | B16 +15, B10 +10, every buff +4 | D08 −10, every debuff −4 |
| Wish fake-detection | B04 −10 | D03 +10 |
| Life loss | **B19 −1** | **D20 +1** |
| Unsold-appraisal penalty (no life rule) | B19 waives credits and 1 energy | D20 doubles credits |
| Auction win price | **B20 −20%** | — |
| Post-trade reward / coin odds | **B18 +3 / +10 pts**, omen *ปีแห่งการให้* +3 | **D19 −3 / −10 pts** |
| End-of-encounter energy | B09 (next encounter) | D05, D11, omen *ฝูงโรคระบาด* −1 |
| Energy / life / wish-slot **caps** | vital flask +2 energy, life relic +1 life (+1 energy without lives), wish ledger +1 slot | — |

Percentages on a sale add up and floor once, so +15% and −20% together are −5%. One-shot statuses (B13, D13) are spent by the sale that used them; encounter statuses and omens are not.

## Route variety

* Every match draws a fresh 256-bit seed (`room-lifecycle.ts`), including after a rematch. The portal schedule, stock, hidden facts, market, events and omens all come from it. The test `every random draw differs` generates 200 seeds and finds 200 different routes.
* Each encounter gets one of seven omens, never the same as the previous encounter.
* With polish rules a seat sees every event it qualifies for (bond, expansion, polish) before any repeats, like the original pool does.
* Opening events differ between runs; bond/expansion/polish events are drawn independently of the original 50.

## Rebalance (numbers changed, nothing removed)

| Item | Before | After | Why |
|---|---|---|---|
| Wish premium | 1.8× base | **1.6×** | A filled wish paid about +20 credits against a 10–15 credit round reward; it overshadowed everything else. Floor is reached in three encounters. |
| Wish ask-more penalty | −1.5 pts per +1% | **−0.7** | With −1.5 asking more was never worth it (expected value fell every step). At −0.7 the best ask is about +10% at baseline and rises with trust and buffs. |
| Tradeoff events in the TRADE phase | drawn at 50% every encounter (E92 showed up in nearly every run and handed out D13) | **30%**, unseen-first | Frequency, not the event itself, made D13 the most common status. |
| Consignment debuffs | D01/D02/D03/D06 | **+ D17, D18** | New debuffs reach players through more than events. |
| Vital flask effect | — | buff B17 / drawback D18 | Gives the sale and fee statuses an item source. |

Left alone on purpose, with the reasoning:

* **Curse cleansing** costs about 0.55× base per try at about 55%, while a cursed item only loses 25% of its score value, so it is a loss in pure credits. Its worth is activation: in lives mode a cursed activation costs 1 of 6 life. User-specified base price kept.
* **Challenge** is symmetric (±50% of the appraisal price), so it pays when the claim is false more than half the time. Sellers can claim for free, so honest sellers are not punished.
* **Energy** is cheap in lives mode (2 credits buys 3 energy), so the 2-energy wish cost is a speed bump; the two-slot cap and decay carry the limit.

## Not covered by the bots

The bots still do not use wishes, cleansing, challenges or capacity relics, so the simulations check rule consistency and replay, not strategy balance. Treat the numbers above as design arithmetic that still needs human playtests.
