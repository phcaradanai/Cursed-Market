# Cursed Market

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React + TypeScript + Vite, with an authoritative Node.js server. The independent appraisal entry and asset bundle preserve the legacy auction entry and existing LAN servers.

## Users

Private groups of 2–4 players on their own browser/device. Human playtesting prioritizes LAN groups of 3–4, while preserving functional 2-player play. External voice is optional; in-app voice is outside scope.

## Product Purpose

Test whether evaluating and accepting a risky dimensional artifact creates enough temptation, doubt, commitment and surprise to make players request another run. The first auction playtest was reported as lifeless, repetitive, predictable and not fun. Differentiation from Dealer's Life and enjoyable decisions remain hypotheses. A 10–15 minute run is an experimental target to measure.

## Positioning

Players are appraisers choosing portals to Orc, Vampire, Autometa, Alien, Dark One or Beast merchants. Each merchant offers artifacts with hidden base value, authenticity and curses. Players inspect, appraise, negotiate, purchase with credits or accept conditions, construct run-local inventories/statuses, and trade with other appraisers. A low NPC appraisal risks detection and consequences; low P2P offers do not invoke NPC retaliation.

v0.5 runs seeded encounters until all players have zero life, with 50 mechanically resolved event types, 20 combined buff/debuff types and 30 product kinds. Life and energy are separate. Historical v0.4 retains three encounters. The 10/10 split and numeric balance are assistant-selected experiments recorded in `docs/plan/Appraisal_Rules_Decisions_v0.4.md`, not human-validated balance.

The Dark Market rolls before each encounter and, when open, buys until that encounter ends. One or more randomly selected item types receive fixed quotes with quotas and reserved funding. Newly bought artifacts can be sold immediately. Previously sold types remain eligible for future demand; the system does not target anyone's inventory or sale history. The 50% opening probability and 1–3 order default are provisional.

## Operating Context

Private room code, ready/start, simultaneous private portal and NPC decisions, shared negotiation, reveal/results and rematch. Credit and energy are separate resources. Zero energy keeps the player active for portals, non-energy decisions and recovery encounters; energy-cost actions require sufficient energy. Life zero permanently spectators the player for this run. Living players lose one life at encounter end and can recover life through goods/deals. All dead triggers one Collector settlement of held item value, remaining credits and score-status modifiers; no accumulated encounter or accuracy score is added. The lobby host chooses timed or untimed play and whole-second durations of 1–900 seconds for each of four phases. Timed deadlines and safe defaults advance absent seats; untimed play waits for required manual completion, including living disconnected seats returning and living seats confirming reveal. Dead spectators never block continuation. An opaque temporary session token supports seat resume.

## Capabilities and Constraints

The authoritative server owns hidden truths, validation, random results, atomic settlement and room timing. Timing changes are host-only before start, reset readiness when values change, persist across resume/host transfer/rematch and are locked during the run. Enabled deadlines stay fixed per phase; disabled timing has null deadlines. Optional timer metadata in schema-v4/v5 room audits preserves older audit compatibility. Appraisers has 6 merchant types, 30 artifact kinds across 10 art families, inspection, accepted price previews, conditions, inventory activation, P2P exchange, permissioned cross-shop purchases, Dark Market and downloadable schema-v4/v5 replay audits. In-memory rooms do not survive server restart.

The Thai realistic-card UI is implemented using live private DTOs, separate generated NPC/item art with exact prompt provenance, self-hosted Thai typography, bounded motion and opt-in synthesized feedback. Realistic cards are the authorized goal's working delivery direction, not a user-approved final brand. The three concepts in `docs/art/concepts/v0.4/` remain exploration; they are not functional UI screenshots or approved comps.

Numerical survival defaults are experimental: life6/max6, energy10 and entrycost1ifavailable, one merchant recovery deal per encounter, true food/potion healing2, cursed activation damage1 and B10/D10 Collector +20%/−20%. Dead inventory, credits and status ages freeze until collection. See `docs/plan/Survival_Collector_v0.5.md`.

No accounts, ranking, combat, permanent progression, public hosting, Three.js world, pixel spritesheet or automation is included. Existing LAN processes and baseline audits are preserved. The earlier instruction **“หยุดตรวจภาพ ใช้ผลตรวจเดิม”** was superseded on 2026-10-14, when the user asked for UI/UX polish toward the realistic-card concept and authorized any useful tools. Browser screenshots then reviewed real rendering; they do not certify screen-reader behavior, final art quality or brand approval.

The user subsequently required at least 30 products. The catalog now has 30 distinct kinds; each merchant has nine favored variants, and family events accept them. New runs use catalogVersion 2; exact-config restore preserves original v0.4 audits with no version field. Existing family art is deliberately reused. The missing Dark Market images came from constructing nonexistent filenames for new variants; all orders now use the shared family-image mapper. New survival entry uses http://192.168.10.150:3107; listeners 3100–3105 are preserved. Explicit APPRAISAL_RULES=survival selects engine/audit schema5; no flag preserves v0.4/schema4, and exact historical replay remains required. See docs/validation/survival-v0.5.md and the historical timer/catalog reports.

## Evidence on Hand

v0.5 delivery passed 349 automated tests (352 after the 2026-10-14 UI polish and its verification pass),27 focused survival/privacy/SSR regressions, full server/legacy/appraisal builds,120 strictly replayed seeded runs(6–16encounters), six actual LAN2/3/4-seat custom timed/untimed runs with Collector and rematch,12 old/new CLI replays and9mixedv4/v5reports. Fresh finish reviewer scored F1 commitment disclosure andF2hidden-valueprojection resolved in one batch. See `docs/validation/survival-v0.5.md`. The 2026-10-14 UI polish pass found that the browser client rejected every v0.5 room state (`rulesVersion` check), so survival mode had only been exercised through socket scripts; the fix has a regression test. Dev-server review with live bot seats covered entry, lobby, portals, appraisal, inventory, trade, statuses and reveal at 1440×900; reveal, portals, appraisal and Collector results at 375×812; and results at 1280×800. The production bundle was then smoke-tested at 375×812 (lobby, portals, appraisal, trade, reconnecting masthead, no horizontal overflow) and 1000×800 (appraisal). Not seen in a browser: a mid-run spectator, a sellable Dark Market row, E48+ consequence events, the urgent countdown and a v0.4 room.

GDD v0.1 and prior auction/roguelike baselines remain historical. User feedback is recorded in `docs/playtests/2026-10-13-first-feedback.md`; participant counts, individual ratings and human audit are unknown. The prior v0.4 delivery passed 322 automated tests, including domain coverage for all event/status IDs, 61 UI/model/SSR tests, 5 report/replay tests, 42 catalog/migration tests and 10 timer/image regressions. Six actual LAN-address 2/3/4-player HTTP/WebSocket runs cover custom timed and untimed completion, strict replay and rematch. Both production bundles build successfully. The timer finish reviewer resolved its one bounded untimed-copy finding in `docs/validation/appraisal-timers-v0.4-review.md`; the original three resolved UI findings remain historical.

M0–M5 technical delivery is complete at playtest readiness under `docs/plan/Card_Appraisers_Delivery_v0.4.md`. Previous M3 evidence remains separate in the domain/network reports. Bots and source review do not establish human fun. The technical goal ends at playtest readiness and does not depend on waiting for human attendance.

## Product Principles

The next 2026-10-14 commerce extension adds a one-time 10% commission on the actual NPC sale price for an appraised item, including cross-shop sales and later vault sales of unsold consignments. NPC-specific trust grows by one per sold appraised item, caps at ten and adds five percentage points per level to accepting a below-threshold offer, without removing detection risk. Market orders now carry public quality requirements, matched bonuses and a disclosed mismatch choice: a 20% markdown or a resource/status sacrifice for full base price without a bonus. Private previews use only known item facts; sacrifice affordability is checked before hidden qualities. Historical configs without `commerce` retain their original rules. See `docs/plan/Commerce_Trust_Market_v0.5.md`. The new playable survival server is separate at port 3109; older listeners remain available.

The 2026-10-14 round-income extension gives living appraisers 10 credits after odd encounters and 15 after even encounters. An optional heads/tails wager adds 5 per correct guess; a wrong guess forfeits the pending base and accumulated bonus, preserving the existing wallet. Players may bank or repeat until loss. REVEAL expiry and continuation bank pending winnings. Survival spectators retain frozen assets. New runs opt into `roundRewards`; exact configs without it replay unchanged. The isometric two-faced coin has a 1.3s toss and a reduced-motion alternative. See `docs/plan/Round_Credits_Coin_v0.5.md`. Synthetic survival seats retire after encounter 12 so replenished life purchases cannot make replay tests endless; live play has no such retirement. The updated server is separate at port 3108.

- Make the current decision, its cost, accepted quote and exact condition visible before commitment.
- Keep seed, future offers and unrevealed/private item facts on the server; retry and reconnect do not reroll or pay twice.
- Keep zero-energy recovery choices available; show permanent death and spectator waiting clearly. Calculate final score once when every player has died.
- Complete and verify the requested 50-event/20-status scope, then use human evidence to change decision quality before expanding content or visual polish.

2026-10-14 user clarification: credit refill and the coin wager belong after every merchant/trading interval, before the next portal selection, rather than at the end of a whole match. Odd intervals grant 10, even intervals 15. Portal events must reveal the current NPCs and decision benefits before asking the player to preserve or close a door. The event now includes all three merchant portraits, visible item hints, NPC temperament, personal trust and a choice-dependent availability preview. No hidden inventory or item truth is revealed.

2026-10-14 user price-knowledge correction: never show a product valuation range before the player obtains price-inspection knowledge for that item. Price facts, detail cards and numerical detection estimates now use item-specific knowledge only; kind-level catalog anchors are no longer shown as free clues. The initial appraisal input may use the visible NPC selling price, never an unseen valuation midpoint. Inspecting authenticity/effects does not unlock price clues. Existing explicit event/public disclosures and Collector truth retain their rules.

2026-10-14 user-authorized expansion: at least 18 new encounters OR item effects tied to current systems, explicitly naming free inspection warrants, +5 percentage-point commission tax orders, +2 income noble seals and improved-odds gambler hats, with stacking copies. Delivered 18 new passive item kinds (48 total) in catalog v3, held-inventory stacking, contextual cost/commission/market/coin previews and an expandable held-effect summary. Core rules and caps are in docs/plan/Stackable_Items_v0.5.md. New types enter the existing merchant/market/bond-family paths; older catalog pools/audits retain their mappings. Family artwork is reused.
