---
title: Keep npm run dev/build on the latest version only
author: Phcaradanai
date: 2026-10-15
standing: true
---

## Decided
The user wants `npm run dev` and `npm run build` to launch the latest game version (currently 0.5). Don't keep old versions as defaults, because it confuses them. Keep scripts and docs current together.

## Watch out
Old versions can stay under explicit names such as `:legacy`. Saved-report and replay format labels (engine `version: 4 | 5`) are file formats, so don't rename them without asking. Evidence docs in `docs/validation` and `docs/simulation` stay as they are.

_Told to Claude in 2 past sessions here, most recently on Oct 14._
