# v0.4 appraisal UI — independent finish review

2026-10-14 — Fresh initial read-only implementation review, followed by the same reviewer's focused verdict pass for F1–F3 after one fix batch. This report follows the Impeccable new-work finish contract and craft floor. The binding user instruction **“หยุดตรวจภาพ ใช้ผลตรวจเดิม”** excludes new browser sessions, screenshots and image QA. Historical v0.2 captures are not v0.4 validation and were not used to certify this build.

## 1. Disposition

**ship — the focused source/test verdict pass scores F1, F2 and F3 resolved.** The initial disposition was `fix`; one bounded batch addressed all three findings. No further fix batch is owed for this list. This verdict is limited to the reviewed fixes' functionality and pre-commit information in source/SSR; it is not a new whole-surface audit, visual-fidelity verdict or final brand approval.

The initial review found three decision surfaces missing information needed to choose an economic outcome knowingly. The updated trade DTO/UI, E08 contract presentation and market/inventory identifiers resolve those omissions. The comparison and initial findings below preserve the original review evidence; the verdict table records the current outcome.

## 2. Comparison with task and working direction

The implementation follows the authorized M4 realistic-card working direction at source level: independent art for six dimensional NPCs and ten item types, Thai controls, a central appraisal desk, a persistent Dark Market, inventory, and player negotiation. The reference concept is critique-only; it is not an approved comp. This report does not infer final brand selection or approval.

- `App.tsx:81` builds selectable portals from the current seat's portal DTO. NPC portraits and hints distinguish all six available types through the catalog; the server remains authoritative for each offered portal.
- `components.tsx:51` separates inspection, appraisal/counter, accepted NPC quote, optional or forced purchase contract, and buying. `model.ts:17` computes a visible-data risk range; `views.ts:12` collapses that range only when the viewer knows the real base. No server seed, reservation or future offer is read by the UI.
- `components.tsx:80` displays the accepted `item.price`, with rejected appraisal and fallback ask explicitly identified. Buyer discounts and energy costs are derived separately from live statuses. Cross-shop proposals disclose the NPC amount plus the referral fee.
- `GameTable` distinguishes phase, paused, done and connection states; server-side gates remain authoritative. Dark One requires separate appraisal consent. Death and exhaustion copy matches the current-encounter pause rule, including death's zero current score and preserved prior score.
- P2P permits 0 credits and states that low player prices have no NPC penalty. Cross-shop permission is explicit through sharing and seller acceptance. Incoming swap identity was finding F1 and is now resolved.
- Dark Market availability, prices, remaining quota and immediate transfer come from the current DTO. Newly acquired items are included in sellable inventory. Duplicate-item selection was finding F3 and is now resolved.
- Every event's offered choice can be encoded through the UI model; the supplied tests exercise every E01–E50 choice against the engine. E08's contract presentation was finding F2 and is now resolved.
- Optional sound starts off, is enabled by a user gesture and uses bounded synthesized feedback. The artifact arrival transition begins from visible content and is disabled for reduced motion.

`PRODUCT.md` and prior M3 validation prose are known progress snapshots pending handoff. Their older UI-status wording is not treated as a regression. This review does not judge M5 CLI/LAN handoff completeness or human enjoyment.

## 3. Material findings

Initial findings and locations are retained as historical evidence; they are superseded by the focused verdict table below.

| ID | Severity | Evidence location | Trigger and material impact | Bounded fix |
| --- | --- | --- | --- | --- |
| F1 | P1 | `src/appraisal-client/components.tsx:175`; `src/appraisal-client/components.tsx:178`; `src/game/appraisal/views.ts:28` | A buyer adds an owned, unlisted item to a player offer. The recipient receives only `swapItemId`; the UI cannot resolve it from their inventory, stock or listings and displays **“+ แลก สินค้าที่เสนอ”** next to an enabled **“ตกลงและโอนทันที”**. The seller cannot identify the item they will receive before surrendering their own item. | Add a recipient-safe item projection for items explicitly offered in a trade, or require explicit public sharing before offering them. Render the incoming item's name, image, possible effects and only the recipient's/public knowledge before acceptance. Do not expose the buyer's private inspection facts. Keep free P2P and atomic transfer intact. |
| F2 | P2 | `src/appraisal-client/components.tsx:103`; `src/appraisal-client/model.ts:70`; `src/game/appraisal/events.ts:165` | E08 offers cash versus a forced-condition merchant. The form names neither selected merchant nor exact discount/status/duration; its cost line only says **“เลือกได้เพียงพ่อค้าชุดเดียว”**. Choosing `condition` permanently selects portal index 1 and forces the purchase condition. This contradicts E08's own requirement to show both conditions before choosing. General portal hints below the event do not provide the exact contract or map each choice to its portal. | Present both offered portal identities and their cash/condition terms before confirmation. For the condition choice, show actual discount, status description and duration from the public NPC/status catalogs, tied to the actual offered portal. Use the live encounter restrictions; do not show hidden stock truth. |
| F3 | P2 | `src/appraisal-client/components.tsx:124`; `src/appraisal-client/components.tsx:126` | Inventory can contain two items of the same kind with different known authenticity or curse facts. Dark Market renders **“ขายชิ้น 1”** and **“ขายชิ้น 2”** without those facts or a visible identity mapping to inventory. Each button immediately sells a different item. The player cannot tell which inspected item is being sold, so the market's pre-sale summary is incomplete. | Tie each sell action to a distinguishable inventory item and show its viewer-known facts, quote and immediate transfer outcome before selling. A compact item selector/detail tied to the sale is sufficient; preserve one-step selling where the identity is already unambiguous. No new raster assets are needed. |

Source/SSR reproductions used the existing compiled fixture and components, without browser interaction or files beyond this report:

1. Created a 0-credit inventory offer with `swapItemId: 'owned-food'`, which was unlisted. The recipient's item DTO collections did not include it. Rendered offer text was `alice เสนอ 0 เครดิต + แลก สินค้าที่เสนอ ให้ bob`, with an enabled immediate-accept button.
2. Forced E08 with portal index 1 `npc: 'autometa'`. Rendered event options were generic cash/condition/decline; the rendered event did not identify Autometa or disclose its exact discount/status/duration before confirmation.
3. Created two same-kind food items, one viewer-known genuine/uncursed and the other viewer-known fake/cursed. The market rendered only two numbered sale buttons at the same 10-credit quote, with neither item fact shown.

These are reproducible information omissions in source and SSR, not claims about screenshot appearance.

### Focused verdict pass after one batch

| ID | Score | Current evidence | Result |
| --- | --- | --- | --- |
| F1 | **resolved** | `src/game/appraisal/views.ts:28`; `src/game/appraisal/types.ts:88`; `src/appraisal-client/components.tsx:182`; `tests/appraisal-client.test.ts:97` | Trade views now add the offered item and optional swap item using `appraisalItemView(state, viewerId, itemId)`. The recipient sees the unlisted incoming item's name, art, possible effects and viewer-known facts before the immediate accept control. The regression explicitly gives the buyer private base/authenticity/curse knowledge and verifies the seller still sees those facts as unknown, while the buyer retains their own knowledge. Zero-credit proposals continue to work. |
| F2 | **resolved** | `src/appraisal-client/components.tsx:106`; `tests/appraisal-client.test.ts:109` | E08 shows both actual fixed portals with merchant names and item hints, maps them to cash/condition choice, and displays the exact condition discount, status description and duration before the form. Source also warns when a D04 condition is unavailable in the last encounter. The SSR regression verifies the Orc cash choice and Autometa condition choice, including the three-credit discount, equipment burden, purchase count and duration. |
| F3 | **resolved** | `src/appraisal-client/components.tsx:131`; `src/appraisal-client/components.tsx:144`; `src/appraisal-client/model.ts:87`; `tests/appraisal-client.test.ts:114` | Each market sale names a `คลัง #n` item and shows its viewer-known `ItemFacts`; inventory uses the same current identifier. The quote and immediate-transfer wording remain visible. The SSR regression creates same-kind items with different known authenticity/curse facts, verifies both identifiers in market and inventory, and verifies the market distinguishes all four known facts. |

No item is scored partial or unresolved. This pass examined F1–F3 and their directly relevant source/tests only; it did not open a new defect hunt. Small CSS additions bound swap art and separate each market item's facts at source level, without claiming rendered validation. No new raster asset was created by this fix batch.

## 4. Craft-floor and source evidence

- **Semantics and keyboard affordances:** Thai document language; native buttons, inputs, selects and disclosure elements; visible form labels connected through IDs; pressed states on inventory/stock selection; table caption and scoped headers; skip link; error alert and connection/action status messages. Phase changes include a concise status message and the countdown avoids repeated live announcements. Actual focus order, screen-reader announcement behavior and touch operation were not exercised.
- **States and action gates:** source covers initial connection, loading, errors, reconnect, replaced tab, empty inventory/listings, paused/done players, results and rematch. Pending action IDs are retained and resent after seat resume; acknowledgments/errors clear them. Server rejection remains the last check against stale resources and permissions. No browser proof of reconnect handling is claimed.
- **Palette:** calculated WCAG ratios for declared base color pairs were body/table 13.56:1, secondary/placeholder on panel 7.43:1, paper body 11.66:1, paper secondary 5.81:1, dark primary 7.96:1, paper primary 7.45:1 and error text/wash 6.56:1. These calculations pass the 4.5:1 text floor for those explicit pairs; opacity, actual compositing, focus contrast and rendered states are not certified.
- **Type, responsiveness and browser surfaces:** self-hosted Noto Sans Thai, Noto Serif Thai and Cormorant Garamond; `font-display: swap`; body 16px/1.7; 70ch paragraph measure; tabular figures; visible focus rings; palette-derived selection, carets and scrollbars. The 1100/900/640px source breakpoints stack the desk/market and turn portals into compact rows. Buttons have a 44px minimum height. Source presence does not prove overflow-free rendering or actual touch target geometry.
- **Assets and privacy:** 16 independent generated asset entries include exact prompts, hashes and origin paths; the supplied provenance test verifies them. `views.ts:11` derives item images solely from kind, keeping art identical across genuine/fake and cursed/uncursed states. `ItemFacts` displays only the viewer's DTO knowledge. No concept screenshot is used as the functional UI.
- **Composition:** code uses the game's merchant and artifact content directly, with real forms, authored card imagery and fine region dividers. No image inspection was performed, so first-viewport hierarchy, image quality, font rendering, visual consistency and resemblance to the critique reference remain unverified.
- **Hooks:** the supplied packet reports a clean deterministic hook scan for the new App/components/CSS after the earlier Georgia finding was corrected, with no new ignore. No additional detector was run for this review.

The local graft wiring graph was fresh when source review began. Graft signatures and references localized the client, view, event, purchase and trade paths before source inspection. No shipped agent definition file was read. No implementation or LAN process was changed.

## 5. Validation limits and next actions

Initial supplied M4 evidence: `npm run build:appraisal` passed; the initial focused compiled client/domain suite passed **174 tests** (**58 UI/model/SSR + 116 domain**). After the fix batch, the builder supplied a passing appraisal build and **182 focused tests** (**61 UI/model/SSR + 116 domain + 5 tooling**). The reviewer independently ran `node --test --test-reporter=dot dist/tests/appraisal-client.test.js`: **61 passed**, exit 0. This includes the three new regressions scored above. The builder also supplied an embedded-provenance scan of 16 rasters with 0 missing; no new raster work needed review.

The client tests verify event decision encoding, risk bounds, quote/cost previews, consent/privacy, phase SSR, cross-shop form output and asset provenance. They are not browser interactions or rendered QA. The 50 event tests use each choice with an offered target; they do not prove every UI interaction or target permutation.

Supplied M3 evidence is recorded separately in `docs/validation/appraisal-domain-v0.4.md`, `docs/validation/appraisal-network-v0.4.md` and the actual 2/3/4-seat socket audits. It proves authoritative domain/protocol behavior at its documented scope. Existing 1,200 synthetic seeded runs do not establish fun or human playtest success. This reviewer did not rerun the full suite, rebuild artifacts, restart or kill LAN, or inspect historical captures.

Next action: continue M5 and documentation/handoff under the active goal. The builder plans the full domain/network/simulation baseline rerun for the additive private-view change during M5; this focused verdict does not substitute for that delivery gate. No additional F1–F3 fix round is required by this reviewer.

No recapture is requested: the user has prohibited new image checks. The current **ship** verdict remains explicitly limited to the three reviewed fixes' source/test scope. Rendered layout, mobile/device interaction, browser accessibility, final brand approval and human enjoyment remain outside the evidence.
