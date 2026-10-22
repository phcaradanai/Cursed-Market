# Merchant abilities — design documentation

Date: 2026-10-23. Verdict: **ordinary extension; incumbent system preserved**.

The finished merchant-bond ledger, copy identity and cooldown-item controls extend the existing appraisal table. They add no visual world, display family or palette. The final [finish review](design-review.md) records **ship** for the scoped F1/F2 corrections. This document records the extension and its evidence; it does not refresh the root design system.

## Authority and preservation

Compared the finished artifact with [PRODUCT.md](../../../PRODUCT.md), [DESIGN.md](../../../DESIGN.md), the existing `.impeccable/design.json`, and the [appraisal surface contract](../../../.impeccable/surfaces/src-appraisal-client-app-tsx.md). Source sampling covered `MerchantAbilities.tsx`, `ability-text.ts`, `components.tsx`, `lore.tsx` and the appended ability/responsive styles. The [implementation rules](../../plan/Merchant_Abilities_v0.5.md) explain the domain semantics.

The contract retains the merchant desk, readable ledger and current decision hierarchy in the established dark fantasy world. The eight compact merchant portraits, one focused ability, existing inventory drawer and explicit confirmations follow that structure. This pass wrote only this validation document. PRODUCT.md, DESIGN.md, `.impeccable/design.json`, the surface contract and all source files were preserved, including pre-existing local changes.

## Reused visual vocabulary

| Element | Shipped evidence | Extension use |
|---|---|---|
| Ink surface | Existing `--panel: rgb(13 18 19 / .9)` and `--table: #080c0d` in `styles.css:4` | The ledger uses the existing panel material rather than a new page ground. |
| Gold hierarchy | Existing bronze `#a8874a`, amber `#d9b45a`, cream `#ece3cc` | Bronze borders/dividers, amber headings and cream counts/body; new rules at `styles.css:1349–1361` reference existing variables. |
| Type | Existing Noto Sans Thai body at 16px/1.7 and Noto Serif Thai headings at weight 600 | Ability summary is 22px, 20px on phones; its readiness count is 15px. These are local hierarchy adjustments, not a new type system. |
| Controls | Existing buttons, 44px minimum targets, 6px control radius and mint focus outline | Ability actions inherit common hover, disabled and focus treatments. Inline touch sizing preserves at least 44px. |
| Choices | Existing `ChoiceCards` in `lore.tsx:123–133` | Fieldset/legend, native radios, selected treatment, disabled options and portrait/item images are reused for merchants, targets and replacements. |
| Supporting information | Existing inventory, `ItemFacts`, `ItemTerm`, `StatusTerm`, supporting/why text and trust notes | Copy disclosures and cooldown controls appear in existing details, with no additional overlay. Status descriptions retain buff/debuff tone. |
| Spacing and shape | Existing 12px/16px rhythm, fine gold rules and framed painted art | Ledger padding is 16px, 12px on phones; 16px section separation and 48×64px cropped merchant portraits retain the established density. |

No new named global rule is introduced. Existing material, hierarchy and disclosure conventions remain the reusable system.

## Behavior and states recorded

- The ledger appears only in trust-ability runs during appraisal/trade. Its summary gives the ready count. Selecting one of eight merchant radios opens that ability's description, trust tier, 1/3/6 thresholds and encounter cooldown; it clears the previous target. The panel explains the shared one-use-per-encounter limit and that waits count encounters rather than elapsed time.
- Locked, cooling, unavailable, ready, missing-target and pending-command states have plain Thai/English copy and disabled actions. Server-provided eligible item/status IDs constrain target choices. Item facts distinguish public asking price from inspected true value and retain explicit unknowns.
- Alien/Beast pending choices force the disclosure open. Persisted candidates remain fixed until selection; the text explains that closing does not reroll. A separate confirmation commits the replacement. Alien explains exchange of the original; Beast explains that ordinary purchase is still required.
- Copies retain source art and the public source kind, with the numbered “Copy #n of …” / Thai source-name label. Inventory detail and ability choices disclose 40% effects plus the copy's source-value percentage. The shown tier-three copy has 50% source value. The Swarm description states one copy per original, no copying copies and no renewed eligibility after consumption.
- Rewinding Gear selects one eligible cooling ability; Burden-transfer Hourglass selects distinct source/destination abilities; Shifting Compass explains its next-Beast extra option and cap. Missing eligible timers, the half-base reduction cap, encounter-use restriction and activation blocks are explained before commitment.
- E130/E131/E132 and B25/D25/B26 use the existing event-choice/status presentation. Their distinct acceleration, future haste/delay and future replacement-choice effects are recorded in the implementation rules; this pass adds no separate icon or card family for them.

## Responsive evidence

Opened all four final captures: [desktop ledger](../../../.impeccable/review/merchant-abilities-desktop.png), [desktop copy drawer](../../../.impeccable/review/merchant-copy-desktop.png), [phone ledger](../../../.impeccable/review/merchant-abilities-mobile.png), and [phone copy drawer](../../../.impeccable/review/merchant-copy-mobile.png). Desktop captures are 1440px wide; phone captures are 390px wide.

The final phone appraisal stacks the merchant and task, keeps full-width readable artifact/inspection panels, gives the masthead controls a separate normal-flow row, wraps resources below it and contains the end-phase action. The merchant selector becomes two columns. These corrections are scoped to appraisal at the 640px breakpoint (`styles.css:1363–1371`); they do not define a new global composition. The validation [README](README.md) records the browser DOM measurement `clientWidth === scrollWidth === innerWidth === 390` and zero unloaded product images. The final finish review closes F1 and F2.

Static captures demonstrate the named layout and copy states. They do not establish motion quality, full keyboard/screen-reader behavior, every merchant state or human balance. The separately recorded 705-test/build evidence remains technical validation rather than proof of player preference.

## New raster provenance: one product, one artwork

The three new goods each map to their own 768×768 shipping JPEG and exact built-in ImageGen prompt in [prompts.json](../../art/merchant-abilities-v0.5/prompts.json), dated 2026-10-22. Recomputed SHA-256 values match that manifest and differ from each other:

| Product kind | Shipping art | SHA-256 |
|---|---|---|
| `chrono-gear` | `src/appraisal-client/public/art/item-chrono-gear.jpg` | `7ae04f6d350c9de788a49e322fb9fc1c69570efcd4546522f41ab63387b2218c` |
| `burden-hourglass` | `src/appraisal-client/public/art/item-burden-hourglass.jpg` | `afbbd53636920bbf7370da9109af3002838ecccce77871d019007d199c232ffc` |
| `shifting-compass` | `src/appraisal-client/public/art/item-shifting-compass.jpg` | `496a5c47e575c61c017b433c3c5489ed903a4be93155b2e4126d857632113d76` |

The manifest specifies a single centered painted collectible per image: a concentric bronze gear, intertwined hourglass vessels, and an octagonal dimensional compass. Bronze, charcoal, restrained verdigris and realistic wear connect them to incumbent art. Merchant portraits and copy artwork reuse existing assets deliberately; copies do not require another generated product painting.

## Drift not canonized or repaired

The incumbent still carries Cormorant declarations at stylesheet lines 3, 43 and 252, while current design/contract display guidance names IM Fell English/Srisakdi. Existing palette, scene and documentation drift also predates this extension. These differences were reported and left intact: this task authorized a feature extension and the two scoped phone fixes, not a redesign or canonical-system refresh. No defect or local exception was promoted into DESIGN.md or its sidecar.
