# Seeded runtime rarity preview

Build shared modules with `npm run build:server`. From the repository root serve
with `python3 -m http.server 3129 --bind 127.0.0.1`, then open:

http://127.0.0.1:3129/docs/art/rarity-runtime-demo/?seed=8901

This preview imports the actual reusable RNG and renderer from compiled shared
modules. It has no separate copy of the shader or rarity logic.

- Six rarity levels; ten themes for Uncommon and every higher tier.
- Choose Inferno and reroll seed to see palette variation within one theme.
- Enter a seed again to restore the same six descriptors and colors.
- `ทดลองสุ่มตาม rate` rolls six examples from the real config.
- `เทียบ 6 ระดับ` forces one sample per tier to compare richness.
- Pause, base-art comparison, reduced motion and offscreen drawing limits.
- One shared GPU context, with shared/reference-counted source textures.

All views reuse `src/appraisal-client/public/art/item-key.jpg`. `prepare.py`
uses classical GrabCut segmentation and source-pixel hints to extract a matte
once. Original RGB pixels are retained in `key-cutout.png`. `key-glow.png`
remains the earlier derived preview mask and is not used by the shared renderer.
No image generation is used. Hashes are in `provenance.json`.

See [the integration and config guide](../../plan/Seeded_Rarity_v1.md) for the
authoritative door-entry integration, `visualSeed`, theme weights, versioning,
rate defaults and current full-portrait behavior for items without alpha mattes.
The key matte has a small dark fringe beneath its bow; it can be refined before
production art polish without generating a replacement painting.

Verified in Ego Browser: same-seed descriptor equality, changed-seed variation,
theme switching, visible-canvas rendering, desktop and 390px mobile without
horizontal overflow. Also observed a real game trade listing receiving a
server-assigned Rare/Solar appearance and displaying its runtime canvas.

The design detector has no blocking finding in ItemVisual or its stylesheet.
The preview retains intentional experimental rarity colors and its compact type
scale. Its earlier contrast warning assumed white; the actual surface is dark.
The existing unrelated Cormorant Garamond warning in styles.css was not changed
or suppressed. Repository-wide Trail checks may still report pre-existing
metadata conflicts; they are not a clean repository validation.
