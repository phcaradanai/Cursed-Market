# Consistent catalog art — 2026-10-14

Replaced all 50 vector item illustrations and both vector merchant portraits with independently generated realistic dark-fantasy paintings. The existing ten item paintings and six merchant paintings already matched the direction and were retained. The catalog now has 60 product names, 60 distinct item compositions and eight distinct merchant portraits. No spritesheet slicing, repeated family image, recolored duplicate or vector substitution was used.

## Art direction and provenance

Realistic painted material detail, quiet charcoal-brown backgrounds, worn bronze and restrained amber lighting. Each prompt defines an unmistakable silhouette, material and object identity. Deep Sea Monster and The Swarm use the same portrait framing, merchant costume materials and negotiating pose as the incumbent portraits. Art is selected only by public item kind or merchant ID, never hidden authenticity, curse or value.

All 52 new images were generated through the built-in ImageGen tool, one call per asset. [generation-prompts.json](generation-prompts.json) contains the exact prompt set, names, original generation locations, source/delivery SHA-256 hashes, sizes and dimensions for every current asset, including the 16 retained originals. Runtime files are `src/appraisal-client/public/art/item-<kind>.jpg` and `npc-<id>.jpg`. The original PNG/SVG assets remain available for historical clients; new intermediate PNG copies were removed after delivery conversion.

Opaque paintings were converted with `sips`, JPEG quality 85 and width 768 while preserving aspect ratio: items 768×768; portraits 768×959. The 68 delivery images total **12,951,303 bytes**, compared with **161,709,793 bytes** of source PNGs, approximately 92% less. The HTTP server explicitly serves JPEG MIME types. The entry portrait, portal cards, event previews, item DTOs, inventory, choices, peeks and Dark Market all use shared kind-specific selectors.

## Verification

- All 60 product names, 60 image paths and 60 item image hashes are unique; all eight portraits have unique paths/hashes. All 68 files have real JPEG signatures, expected dimensions and matching manifest hashes.
- Full final `npm test`: **524/524 passed**. The first sandboxed run blocked 22 socket tests and exposed one hardcoded PNG assertion; the assertion now uses `npcImage`, and the complete suite subsequently passed outside the sandbox. The asset regression requires raster files and prohibits byte-identical images across different names.
- `npm run build` passed for server, legacy client and appraisal client. The final entry portrait dimensions were followed by another successful appraisal production build.
- All 68 assets returned HTTP 200, `image/jpeg` and expected data sizes from the updated server. The labeled browser gallery loaded 68/68 images. Desktop visual inspection covered the entire set; mobile gallery loaded all images with no horizontal overflow.
- Actual 1440×900 game rendering showed the new Deep Sea Monster and The Swarm alongside Alien. Actual 375×812 rendering loaded those three portraits and had no horizontal overflow. Mobile capture is the top of the game page; full merchant artwork appears below its fold. No claim of walking every item through every interactive game state is made; the catalog gallery, all-kind SSR regression and all-asset HTTP checks provide catalog-wide coverage.
- One mechanical Impeccable scan ran. It misread inherited document colors as white and flagged small gallery metadata. The gallery now uses explicit document/body surfaces, the existing Thai font/palette and 14px metadata. Browser-computed foreground/background confirmed the intended colors. The design hook found no deterministic issue in the changed application component. No application layout, palette, typography or game rules changed.

## Review artifacts

- [Labeled gallery](catalog.html)
- [Complete desktop catalog](catalog-desktop.png)
- [Mobile gallery](catalog-mobile.png)
- [Game desktop](game-desktop.png)
- [Game mobile](game-mobile.png)

Updated survival game: **http://192.168.1.104:3113** (also http://localhost:3113). The LAN address was read from the host during this delivery. Older listeners/rooms were preserved; the temporary QA bot was stopped and its browser space was closed.
