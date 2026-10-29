# Cursed Market — Comic Build

This folder is the independent 2D comic presentation of Cursed Market. The realistic-art game remains outside this folder and is unchanged.

## Build and run

From this folder, rebuild the server and web client, then start the game:

- **npm run build:server** compiles the game server.
- **npm run build:appraisal** creates the appraisal web bundle in dist/appraisal-client.
- **npm run start:appraisal** starts the appraisal server after the build.

Comic artwork is isolated under src/appraisal-client/public/art/comic/. The same server rules and game flow are used by this build.

## Visual examples

While the server is running, open these pages to compare the real UI components with the approved concepts:

- [Merchant choices](http://localhost:3103/?preview=merchants)
- [Inspect, appraise and buy](http://localhost:3103/?preview=inspection)
- [Inventory](http://localhost:3103/?preview=inventory)
- [Trading](http://localhost:3103/?preview=trade)

These examples use labelled sample DTOs. Use **เล่นเกมจริง** to create or join a room and perform game actions. The normal game entry is http://localhost:3103/.

The sample DTOs are checked in. To refresh them after a game-view change, run `npm run build:server`, then `node scripts/generate-comic-preview.mjs`, and rebuild the client.

## Evidence

Current comic approvals, reference regions, screenshots and comparison reports live under `.impeccable/comic-build/`. Current runtime captures and the independent review live under `.impeccable/review/`. Historical cabinet build records remain separate.

The two setting images were made with the built-in ImageGen tool. Exact prompts and source paths are in `docs/art/comic-setting-prompts.json`; all 36 shipped comic rasters have embedded provenance and hashes in `docs/art/comic-assets.json`.

