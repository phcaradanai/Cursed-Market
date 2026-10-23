# Seeded product rarity v1

The user requires reusable runtime effects over one original image/model, with rarity rates, multiple themes per tier, and seeded palettes within a theme. No new tier artwork is generated. Appearance remains independent of hidden authenticity and curse probability. The later optional economy policy adds rarity-scaled value and beneficial numerical strength.

## Library boundary

- `src/shared/rarity-power.ts`: versioned price/effect policy and pure reference-price helpers.
- `src/shared/item-rarity.ts`: browser/Node-compatible pure RNG, config validation, tier/theme registry, seeded material parameters and names. No dependencies.
- `src/shared/rarity-renderer.ts`: optional native WebGL adapter. One GPU context and reference-counted texture cache serve all visible canvases. No React dependency.
- `src/appraisal-client/ItemVisual.tsx`: React lifecycle adapter, text labels and original-image fallback.
- `src/game/appraisal/rarity.ts`: authoritative integration, derives a public visual seed from a dedicated HMAC label without exposing the run seed. The public field is named `visualSeed` to distinguish it from private game `seed`.

## Generation lifecycle

When an `enter` command is accepted, the server completes normal stock (including trust bonus slots), then assigns appearance once to each selected item before redeeming NPC contracts. Unopened doors have no assigned appearance. Door rerolls do not consume any gameplay RNG stream; existing per-label generation remains unchanged.

A descriptor is `{version:1, rarity, theme, visualSeed}`. It remains on the item across transfers, vaults, loans, theft and replay. Client redraws/reconnects do not roll. Beast/Alien replacement candidates get a new descriptor once, when their locked offers are generated. Swarm copies inherit their source appearance. Visual-only historical configs keep their original prices and effects. New runs also persist the separate rarityEconomy policy described below; it scales intrinsic value and beneficial numerical effects without changing hidden authenticity or curse probability.

New runs enable the config. Exact historical restore without `rarity` keeps all old item/config shapes; it never adds a descriptor. Audits retain the full appearance config and descriptors; v1 palette/shader rules must remain versioned if later versions change appearance.

## Initial experimental config

| Tier | Rate | Theme pool |
|---|---:|---:|
| Common | 60% | Original only |
| Uncommon | 25% | 10 |
| Rare | 10% | 10 |
| Epic | 3.5% | 10 |
| Legendary | 1.3% | 10 |
| Mythic | 0.2% | 10 |

These are implementation defaults, not user-approved balance. Theme weights are conditional on the rolled tier. With equal Uncommon weights, an Uncommon Inferno is 25% × 1/10 = 2.5% of rolls before seeded palette variation. A theme weight of zero disables that theme. Tier rates must sum to one and can be zero; each theme pool must contain a positive weight.

The ten themes are Inferno, Frost, Storm, Venom, Spirit, Lunar, Solar, Void, Prism and Clockwork. Each owns a different material/motion signature. Inferno selects among orange/gold, crimson, purple flame and blue flame palettes, with bounded hue/saturation/lightness variation. Seeds also control speed, phase and motes. Identical results are permitted: this is reproducible RNG, not a global uniqueness registry.

```ts
import { defaultRarityConfig, rollAppearance, resolveAppearance } from '../../shared/item-rarity.js';

const config = defaultRarityConfig();
config.themes.uncommon = [
  { theme: 'inferno', weight: 3 },
  { theme: 'frost', weight: 1 },
];
const descriptor = rollAppearance(123456, config); // server chooses and stores seed
const material = resolveAppearance(descriptor);  // client reproduces palette/effects
```

The actual game can receive this serializable config through `createAppraisalRun(..., {rarity: config})`. Rates are configured before a run, not supplied in a door action by the player.

## Rendering and assets

The key uses a single derived alpha matte of the existing `item-key.jpg`, copied as `/art/rarity/key-cutout.png`; its provenance remains in the rarity demo. All other kinds reuse their own original JPEGs. Without a prepared alpha matte the material applies to the complete portrait, including its background. For object-local glows on more items, supply a clean alpha image; do not invent geometric silhouettes or generate rarity paintings.

Richer tiers add strength, particles and layers; Mythic adds a third moving orbit and surface star glints. A single renderer is lazy-loaded; texture loads are shared. Render targets cap at 768px and DPR 1.5, loops at ~30fps and 40 motes. Hidden tabs and offscreen items stop GPU drawing. Reduced-motion uses a composed still; fallback is original art if unavailable. GPU rendering never receives private truths.

## Interactive proof

Run `npm run build:server` once, then serve the repo on loopback with `python3 -m http.server 3129 --bind 127.0.0.1`. Open `/docs/art/rarity-runtime-demo/`.

The demo imports the compiled library; it contains no second shader or RNG implementation. Choose Inferno and reroll the seed to compare palette variation within one theme. `ทดลองสุ่มตาม rate` samples six descriptors using the real config. `เทียบ 6 ระดับ` forces one instance per tier for comparison; it is not a claim about drop rates. The game itself uses authoritative HMAC-derived seeds.

## Visual-only v1 verification (before economy update)

- `npm run build:server` and `npm run build:appraisal` pass. Vite retains its existing large-bundle advisories; the optional rarity renderer is a separate ~8KB minified chunk.
- Full suite before the final public-field rename: 759 of 760 pass. The failing network privacy test forbade the private field name `seed`; the public appearance field was renamed `visualSeed` rather than weakening the test.
- After that fix, all 95 affected rarity, network/privacy/reconnect, client and secure-client tests pass.
- Browser proof: same seed restores equal descriptors, a different seed changes colors, theme switching works, visible canvases render on desktop/mobile, and a real server-generated Rare/Solar item renders in the game trade listing.
- `git diff --check` passes. `trail build` refreshed the graph. Repository-wide `trail check` reports 20 pre-existing Impeccable metadata matches and a 400KB diff cap; it is not a clean whole-repository gate. No commit or PR was created.

## Rarity economy v1 (2026-10-23 user update)

The user requested Common 20 credits / 2% → Uncommon 40 credits / 4%. This supersedes the earlier visual-only scope for new runs. Default multipliers are Common ×1, Uncommon ×2, Rare ×3, Epic ×4, Legendary ×6, Mythic ×8. Common/Uncommon follow the user's example; the higher-tier progression remains experimental. Value and effect multipliers are separately configurable. Common stays the baseline and multipliers increase monotonically within 1–8, preserving the existing 0–1000 appraisal domain for this catalog.

`rarityEconomy` is a separate optional saved config. Runs without it, including visual-only rarity audits, retain their old values and effects. At first assignment, the item receives a public `rarityPower` record and base/asking/reservation prices scale exactly once. Repeated entry processing, DTO creation and transfers never multiply again. Replacement candidates scale before the existing source-value ceiling; copies inherit the scaled source without a second multiplication.

`itemEffectScale` multiplies beneficial held/activation power by the item's effect multiplier and then the existing 40% copy factor. The strongest five held copies per kind contribute; activated bonuses keep the strongest per-kind power and different kinds still add. Status power now retains values above one and weaker grants never downgrade it. Credits/resources floor at existing boundaries; chance, life/energy and wish-slot caps still apply. Costs, curse damage and drawback magnitude retain their existing copy-scaled strength through `itemDrawbackScale`. Binary effects retain their existing discrete behavior.

Scaled values flow through Collector settlement, inspections, merchant wishes, event/bond buyers, auction minimums and Dark Market quotes. Inspection bounds contain the scaled base. Dark Market orders reserve the maximum configured rarity value upfront; settlement additionally checks publicly computable worst-case funding before inspecting hidden contract facts. It cannot spend another order's reserve. NPC curse-cleansing services keep their existing prices, while higher-tier hammers/stones provide larger tool bonuses under the same 95% success cap.

The client receives the public multipliers, not the private base. Item cards and held summaries display actual scaled amounts (for example +4 percentage points), retaining unscaled cap and stack-limit text. Merchant wishes include authoritative per-item quote options to avoid rounding differences between preview and settlement. The visual demo now labels its synthetic 20-credit / 2% baseline and computes each tier with the same shared policy.

```ts
import { defaultRarityEconomy } from '../../shared/rarity-power.js';
const rarityEconomy = defaultRarityEconomy();
rarityEconomy.tiers.uncommon = { value: 2, effect: 2 };
// Pass to createAppraisalRun(..., { rarityEconomy }); before the run starts.
```

### Economy verification

- Server and appraisal-client builds pass. The existing Vite bundle advisories and existing Cormorant Garamond style warnings were left unchanged.
- Final focused run: 36/36 rarity-economy, item-rarity and actual-socket network tests pass, including 13 economy cases. Earlier 106/106 focused effect checks also passed.
- Last full regression run was 772/773 before correcting the remaining flat-price network assertion. The final focused run verifies that correction and makes the baseline 20% commission fixture explicitly Common-only; the full suite was not rerun afterward.
- Coverage includes exact-once assignment, separately configurable factors, strongest-five stacking, 40% copy effects, stronger activated statuses, resource caps, unchanged costs/curse damage, truthful inspection ranges, reserve isolation, authoritative merchant quotes, auction reference values, Thai/English descriptions, and audit replay.
- Browser verification confirms all six synthetic value/effect captions on desktop and 390px mobile with no horizontal overflow. Evidence: `/private/tmp/rarity-economy-desktop.png` and `/private/tmp/rarity-economy-mobile.png`.
- `git diff --check` passes and `trail build` refreshed the graph. The repository-wide Trail check still reports the 20 pre-existing Impeccable metadata matches described above. No commit or PR was created.
