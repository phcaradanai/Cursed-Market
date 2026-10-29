# UI continuity — start here

**Active comic source: [`apps/comic/`](../../apps/comic/).** Root `src/` remains the realistic/cabinet implementation and is not the comic UI. The former external build is a historical backup, not an edit target. This relocation was explicitly authorized on 2026-10-29.

Read [design system](design-system.md), [audit and reconciliation](audit.md), [decisions](decisions.md), and [verification](verification.md). For gameplay also read `../game-design/PROJECT-CONTEXT.md`, `rules-and-logic.md` and the relevant roadmap task. [Main system HTML](../game-design/logic-item-relations.html) remains the human-facing index; edit its input files and regenerate it.

## Commands

From repository root after `npm ci` (one root lockfile, no second install):

```
npm run dev:comic             # comic client, localhost:5174
npm run dev:comic:server      # comic backend, port 3103; run only one backend on this port
npm run build:comic
npm run test:comic
npm run ui:check
npm run ui:test
npm run ui:visual             # ego-browser must be available; matching Chromium/font environment
```

`npm run dev`, `build`, `start`, `test` retain their existing root behavior. Comic is isolated: its local `game/` includes journal integration and presentation paths. Do not replace it with root game code blindly. Reconcile rules in a separate reviewed task.

## Baseline lifecycle

`npm run ui:visual -- --mode record` creates/replaces **candidates** only; use only after explicit baseline-update authorization. `compare` (the default) never updates references. Screenshots, computed geometry, browser identity and timer masks are saved in `baselines/manifest.json`; actuals/reports go in ignored `runs/`. Pixel differences above 0.1% (per-channel noise threshold8) fail. Only `.countdown` is masked; content/action areas are never masked. Dimensions or browser changes fail rather than silently rebase.

Existing user-confirmed contracts (same frame, equal action widths, centred stepper, equal +/- gaps, hidden unknown facts) are assertions independent of pixels. A passing pixel comparison proves reproducibility, **not human approval**. Baseline approval status is explicit. Review candidates in [review.html](review.html); do not mark them approved from an agent's own opinion.

Refresh source fingerprints deliberately after reviewing a verified change: `node scripts/ui/check.mjs --refresh`. This records evidence only, not approval or a replacement for tests.

Use the same Ego TaskSpace across rounds of one task (`--space ID`); omit it for a standalone fresh test run. Run `ego-browser skill` before browser work. If the environment blocks the CLI, report it and request the normal execution permission; do not substitute a different browser or bypass user control.

## Before / after each change

Inspect the current screen and an existing peer, read applicable decisions, trace callers, reuse components/tokens, and change only the requested gap. Run source checks and relevant tests; compare actual frame, inner padding/gaps, control sizes and centres. Do not equate equal outer columns with balanced contents. Update the handoff with evidence, failures and the next concrete task. Hindsight supports history; source and versioned decisions govern current work.
