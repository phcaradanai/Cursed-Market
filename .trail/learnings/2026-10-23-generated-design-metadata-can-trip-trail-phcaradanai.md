---
title: Generated design metadata can trip Trail checks on feature commits
author: Phcaradanai
date: 2026-10-23
branch: main
cost: { minutes: 2, tokens: 78901 }
touches:
  - ".impeccable/design.json"
  - ".impeccable/hook.cache.json"
  - docs/art/rarity-runtime-demo/README.md
  - docs/art/rarity-runtime-demo/demo.mjs
  - docs/art/rarity-runtime-demo/index.html
  - docs/art/rarity-runtime-demo/key-cutout.png
  - docs/art/rarity-runtime-demo/key-glow.png
  - docs/art/rarity-runtime-demo/prepare.py
  - docs/art/rarity-runtime-demo/provenance.json
  - docs/plan/Secure_Economy_v0.5.md
---

## Decided
When a broad working tree contains changes to both Cursed Market rarity and secure economy, stage both feature slices together if the user authorizes both; omit generated Impeccable design/cache artifacts and unrelated concept/handoff files.

## Tried and ruled out
`trail check` on this working tree reports 20 conflicts, all in generated `.impeccable/design.json`, `.impeccable/hook.cache.json`, and `.impeccable/surfaces/...` metadata; it also says the diff exceeds 400KB. The rarity and secure economy implementation files follow the authoritative project learnings. Do not alter feature code to satisfy stale generated metadata matches.

## Watch out
Before a commit, record that these Trail findings are outside the staged feature scope. Run `git diff --cached --check` and inspect the staged file list so generated design metadata, concept art archives, and unrelated handoff files stay out.
