# Survival + Collector v0.5 — technical delivery

Verified **2026-10-14**. Current LAN entry: **http://192.168.10.150:3107**, Node PID34027. This implements the user's new life/energy/run-ending rule; it does not establish human enjoyment or validated numerical balance.

## Delivered rule

The user confirmed separate energy/life, zero-energy encounters and recovery with energy-cost actions requiring enough energy, one life lost at encounter end with healing opportunities, permanent run-local spectatorship at life0, and Collector scoring remaining goods **plus credits** with score buffs/debuffs after every player has died. The [rule ledger](../plan/Survival_Collector_v0.5.md) distinguishes these requirements from experimental numbers.

- No fixed three-encounter ending. New portal/stock sets generate deterministically as surviving players enter each encounter; Dark Market still rolls before portal selection and buys through encounter end.
- Energy0 remains active for portals, eligible events, credit-only recovery and non-energy trading/selling/sharing. Missing energy never substitutes life or mutates state on a rejected action. No normal free between-encounter energy recovery.
- Life0 removes action rights permanently for this run, freezes retained inventory/credits/status ages, and permits public observation. Timed defaults skip spectators; untimed continuation and REVEAL require living seats only. A living disconnected seat still must return in untimed mode.
- When all die, the Collector settles once, takes held goods and produces an itemized receipt. Score is remaining credits plus per-item true value with authenticity/curse factors, adjusted by additive B10/D10 percentages. Encounter gain/accuracy are not added. Ties share the win. Rematch restores new-run life/energy and fresh RNG, retaining room timer settings.
- NPC recovery, life/energy resources, zero-energy guidance, permanent spectator notice, score-status commitment terms and Collector results are present in the existing Thai card UI.

Initial experimental preset: life6/max6, energy10/max10, entry energy1ifavailable, life−1 perencounter; one recovery deal perencounter, energy2creditsforup-to3 orlife4creditsforup-to2 byNPCgroup. Genuine food/potion activation heals2; cursed activation damages1; bloodpact damages1. B10 gives+20% andD10−20% while present at death. Exact mechanical effects, caps, costs and consent are in the ledger and UI; these values have no human balance approval.

## Verification

| Evidence | Result |
| --- | --- |
| [Full suite](survival-v0.5/tests.txt) | **349 passed**, zero failures/skips: 322 prior tests plus 27 survival/privacy/consent regressions |
| [Focused suite](survival-v0.5/focused.txt) | **27 passed**; energy/health distinction, atomic rejection, recovery, permanent death, status freeze, Collector valuation/ownership/ties, long-run completion, authority/resume/timers, exact historical replay and SSR/privacy |
| [Final build](survival-v0.5/build.txt) | Server TypeScript plus both legacy/appraisal Vite bundles succeed; final appraisal JS `index-CohgoWXR.js`, CSS `index-DP9shhVZ.css` |
| [Seeded simulation](../simulation/survival-v0.5/summary.json) | **120 completed, strictly replayed runs**: 10 seeds × 2/3/4 seats × 4 DTO-only policies; **6–16 encounters**. Final rerun uses corrected projection. These are synthetic policies, not human balance/fun evidence |
| [Live LAN rooms](survival-v0.5/lan-check.json) | **Six completed actual socket runs**: 2/3/4 seats × custom timed/untimed, with schema5, all life0, itemized Collector score, strict replay and rematch. Lengths16/18/10/12/8/8 encounters. Rematch starts with life6/energy9 after entry cost. Untimed audits have no timeouts |
| [Final live assets](survival-v0.5/final-assets.json) | Rebuilt HTML and **21 assets** served with 200, correct MIME and byte-for-byte disk match: JS/CSS, 16 existing PNG, 3 existing TTF |
| [CLI compatibility](survival-v0.5/cli-check.json) | **12** historical/current completed CLI replays: legacyv0.1/v0.2/v0.3, original/expandedv0.4, rawv0.5 and sixv0.5 roomaudits. **Nine** mixedv4/v5 downloaded reports pass; [report](survival-v0.5/mixed-report.json) retains `humanFunValidated:false` |
| [Source/build manifest](survival-v0.5/source-sha256.json) | **163 hashes**, including current source/test/bundles. Incumbent root DESIGN, sidecar, all art/fonts and legacy client sources are preserved |

Reproduce this extension's synthetic checks using new output files when preserving an existing run:

```sh
node docs/validation/survival-v0.5/check-simulation.mjs
node docs/validation/survival-v0.5/check-lan.mjs http://192.168.10.150:3107
node docs/validation/survival-v0.5/check-assets.mjs http://192.168.10.150:3107
node docs/validation/survival-v0.5/check-cli.mjs
```

Scripts replace only v0.5 evidence, not earlier delivery/timer/catalog/simulation baselines. Twelve representative seeded raw audits are stored under `docs/simulation/survival-v0.5/`; six actual LAN audits use `network/lan-{timed,untimed}-{2,3,4}-players.json`. Full-suite network tests additionally retain their new output files here.

## Review and privacy boundary

The [fresh independent finish reviewer](survival-v0.5-review.md) initially found two material issues. One bounded batch resolved both; the focused verdict is **ship, F1 resolved and F2 resolved**, supported by its independent27-test execution.

- **F1:** B10/D10 score effects now appear before direct/cross-shop purchases, E08 conditional portals and relevant event decisions. Removing/consuming a score status explains loss of its modifier. Copy qualifies the modifier as applying if present at death. Rules use B10's actual catalog name, คนกลาง. Default v0.4 wording remains separate.
- **F2:** pre-Collector v0.5 DTOs withhold value-derived history (`history:[]`) and hidden accuracy (`self.accuracyBonus:0`). Private history/audits remain intact, historical v0.4 projection remains exact, and final Collector truth is disclosed. Regression uses command-only seed `history-review-7`: buy35/uninspected effectivevalue37 and appraisal37/privateaccuracy5 do not leak through owner/other/spectator projections before final settlement.

The scoped [documentation handoff](../art/appraisal-v0.4/survival-documentation.md) compares the extension with incumbent primitives. Root `DESIGN.md` and `.impeccable/design.json` are unchanged. No new raster/font/style world, manual detector ignore or suppression was added. The existing hook throttled hints on heavily edited files; this was not a user-approved ignore or a new detector pass. Pre-existing configuration drift is reported without unrelated repair.

## Transport diagnosis and rollout

The first unpaced LAN bot run exceeded the unchanged WebSocket guard of **100 requests per5seconds** (`src/server/app.ts`), closing with4008. The original script kept waiting for an ack, which surfaced as a phase timeout. The v0.5 script now records socket-close reasons and paces synthetic requests at75ms; all six flows pass. The server guard was preserved. This fixes the test transport cadence, not game timers or an invented server capability.

New lifecycle configuration `config.survival` selects version/schema5. Exact saved configurations without it remain version/schema4, preserving original catalog mapping, generation, one-encounter recovery and historical scoring. Replay rejects schema/config mismatches; room/report versions must agree. Startup is explicit:

```sh
APPRAISAL_RULES=survival PORT=3107 HOST=0.0.0.0 npm run start:appraisal
```

No flag retains v0.4; default appraisal PORT remains3103. Existing listeners **3100 PID99522, 3101 PID4365, 3102 PID9128, 3103 PID23920, 3104 PID27527, 3105 PID29252** remain running and their room data was not restarted or converted. Only this turn's provisional3106/PID33028 test service, which had no client connections, was gracefully stopped after replacement with corrected3107. Shared static appraisal files are rebuilt; updated UI selects behavior from each room's rules version. Earlier audits and validation files remain historical rather than overwritten.

## Limits and next human test

The user's **“หยุดตรวจภาพ ใช้ผลตรวจเดิม”** remains binding. v0.5 used source/SSR, binaries/build, CLI and network evidence; **no browser, screenshots, raster/art review, rendered-layout, mobile or accessibility interaction QA**. No final brand, external-device reachability, public hosting, automation or human fun/balance claim is made.

Use [LAN guide](../plan/Appraisal_LAN_v0.5.md), [human protocol](../playtests/appraisal-v0.5.md) and [worksheet](../playtests/appraisal-session-v0.5.md). Measure life/energy/credit tradeoffs, survival length, waiting after early death, Collector comprehension and unprompted replay. The only supplied human enjoyment evidence still reports the old auction loop as repetitive, predictable and not fun.
