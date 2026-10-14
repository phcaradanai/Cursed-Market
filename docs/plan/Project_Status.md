# Cursed Market — Evidence and next gate

Updated: 2026-10-14. The **v0.5 technical extension** and previous v0.4 delivery are complete at playtest readiness. The broader mission—an enjoyable, differentiated, replayable game—is still unproven. Technical completion does not establish human fun.

## Current delivery

The new [v0.5 rule revision](Survival_Collector_v0.5.md) separates energy/life, permits zero-energy encounters, makes death permanent within the run, and replaces the three-encounter ending with all-dead Collector settlement of items + credits + score statuses. One life is lost per encounter, with item/merchant recovery. Earlier v0.4 rules and audits remain historical and separately runnable. See [current v0.5 validation](../validation/survival-v0.5.md): **349tests**, fullbuild, **120strict seededreplays**, six actualLANtimed/untimed2/3/4flows,12CLIreplays and9mixedreports pass. Live **http://192.168.10.150:3107**; old3100–3105preserved. Freshreviewer scored both boundedcopy/privacyfindings resolved. No human/visual approval.

The preceding v0.4 [Card Appraisers plan](Card_Appraisers_Delivery_v0.4.md) delivers M0–M5: dimensional NPC appraisal rather than the prior auction loop, seeded portals/events, 50 real event resolvers and 20 status effects, credit/energy/inventory/contracts, atomic P2P/cross-shop and intermittent Dark Market. Death/exhaustion pauses one encounter, then recovery restores play. The [decision ledger](Appraisal_Rules_Decisions_v0.4.md) separates confirmed user requirements from experimental scoring/reactions/recovery/quotes/balance.

The user requirement of at least 30 products is delivered as [30 distinct kinds](Item_Catalog_v0.4.md), with [catalog migration evidence](../validation/appraisal-catalog-v0.4.md). Original audits retain the 10-kind seeded mapping; new runs use catalogVersion 2.

The prior timer extension fixes nonexistent Dark Market image URLs for new variants and adds lobby-host timing settings: timed/untimed plus four durations of 1–900 seconds. Changes reset readiness, remain locked during the run and persist across resume/rematch. Untimed rooms require manual completion and wait for absent seats to return. See [prior timer validation](../validation/appraisal-timers-v0.4.md).

The Thai realistic-card UI is implemented with live private DTO controls, 16 separate generated assets with prompt provenance, self-hosted type, bounded feedback and opt-in sound. This is the goal's working visual direction, not a user-approved final brand. The three concepts remain exploration. Narrow browser DOM/image-decoding diagnostics were used for the later missing-image request; no screenshot, art inspection or rendered-quality QA was performed under the user's binding stop instruction.

[Prior timer/image validation](../validation/appraisal-timers-v0.4.md): **322 tests pass**, full server/legacy/appraisal builds pass. Prior entry at **http://192.168.10.150:3105** passed 21 asset/MIME checks and six synthetic 2/3/4-socket run/replay/rematch flows covering custom timed and untimed modes. Prior LAN listeners 3100–3104 and baseline evidence are preserved. The earlier **1,200 seeded runs** remain historical v0.4 domain evidence. That timer extension did not change appraisal rules; v0.5 uses its new separate120-run evidence. Separate human-device reachability remains untested.

Replay/report now supports v0.5, v0.4 and legacy v0.1/v0.2/v0.3. Optional timer audit metadata preserves old files; untimed reports reject timeout records. The prior timer source/SSR finish review resolved its one finding: completed players in untimed mode now wait for others rather than being promised expiry. The focused ship verdict does not certify rendered UI or final art quality. Original catalog/CLI/delivery evidence and resolved UI findings remain separately recorded.

## What remains to prove

| Requirement | Technical evidence | Human/visual evidence still missing |
| --- | --- | --- |
| Understand core in about two minutes | Thai rules/costs/conditions and briefing/questions | Timed comprehension and first-encounter help observations |
| Choices change across repeated runs | Seeded portals, resource tradeoffs, statuses, NPC prices and random demand | Actual reasons, altered plans and reduced repeated automatic choices |
| Risk and RNG feel exciting and fair | Explicit consent/costs, reproducible authoritative outcomes | Memorable stakes, perceived agency, acceptable loss and no arbitrary frustration |
| Multiple viable strategies | Four synthetic policy scenarios | Repeated human strategies across opponents; bot mean-score gaps are only a candidate balance concern |
| Dark Market creates regret and liquidity decisions | Prior sold kinds remain eligible; immediate buy-then-sell and quotes/quota tested | Actual demand-after-sale regret and deliberate keep/sell plan changes |
| Engaging repeated matches | Run/results/rematch technically verified | Unprompted continuation and started/completed voluntary rematch |
| Enjoyable with/without voice | Playtest mode metadata, private multiplayer flow | Separate voice/no-voice sessions and 2-player group |
| 2–4-player online hidden-information correctness | Domain/private views/retry/network/replay tests | Real-device LAN access and human session audit |
| Responsive, accessible, cohesive interface | Source/SSR/type/build and declared contrast calculations | Rendered layout, real touch/focus/screen-reader and visual quality; no new QA per user |
| Fun/differentiation from Dealer's Life | Appraisal/portal/conditions replace legacy auction loop | Positive human feedback after negative first auction feedback |

## Next gate

Run [survival appraisal human protocol](../playtests/appraisal-v0.5.md), starting LAN 3–4 people as selected by the user; save a new [worksheet](../playtests/appraisal-session-v0.5.md) and downloaded audit per run before rematch. Do not use synthetic rooms as participants. Record whether people change portal/price/inspect/contract/keep/sell decisions and why. Separate scheduled repeats, prompted enthusiasm and voluntary continuation.

Then compare no-voice/voice and a separate 2-person group. Choose one highest-impact weakness supported by actual encounters and change that rule/clarity problem before more content or polish. A small positive sample is not proof of balanced strategies or all success criteria.

## Evidence

- [Current survival/Collector extension](../validation/survival-v0.5.md)
- [Survival LAN guide](Appraisal_LAN_v0.5.md)

- [Timer/image extension and live LAN checks](../validation/appraisal-timers-v0.4.md)
- [Focused timer finish review](../validation/appraisal-timers-v0.4-review.md)
- [Technical delivery and limits](../validation/appraisal-delivery-v0.4.md)
- [Plan and completed acceptance](Card_Appraisers_Delivery_v0.4.md)
- [Rules/default decisions](Appraisal_Rules_Decisions_v0.4.md)
- [50 events / 20 statuses](RNG_Content_v0.4.md)
- [Dark Market design](Dark_Market_v0.4.md)
- [LAN run guide](Appraisal_LAN_v0.4.md)
- [Independent source/SSR review](../validation/appraisal-ui-review-v0.4.md)
- [Original M1/M2 evidence](../validation/appraisal-domain-v0.4.md), [M3 evidence](../validation/appraisal-network-v0.4.md)
- [Negative first human feedback](../playtests/2026-10-13-first-feedback.md)
- [Legacy v0.3](../validation/roguelike-run-v0.3.md), [baseline](../simulation/engine-v0.1/report.md)
