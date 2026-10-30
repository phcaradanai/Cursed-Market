# UI continuity — start here

**Active comic source: [`apps/comic/`](../../apps/comic/).** Root `src/` remains the realistic/cabinet implementation and is not the comic UI. The former external build is a historical backup, not an edit target. This relocation was explicitly authorized on 2026-10-29.

Read [design system](design-system.md), [audit](audit.md), [reconciliation proposals](reconciliation-plan.md), [decisions](decisions.md), [verification](verification.md), and [acceptance audit](completion-audit.md). For gameplay also read `../game-design/PROJECT-CONTEXT.md`, `rules-and-logic.md` and the relevant roadmap task. [Main system HTML](../game-design/logic-item-relations.html) remains the human-facing index; edit its input files and regenerate it.

## Commands

From repository root after `npm ci` (one root lockfile, no second install):

```
npm run dev:comic             # comic client, localhost:5174
npm run dev:comic:server      # comic backend, port 3103; run only one backend on this port
npm run build:comic
npm run test:comic
npm run ui:check
npm run ui:test
npm run ui:smoke              # actual menu open/close, frame/header/radius, item state and countdown
npm run ui:visual             # ego-browser must be available; matching Chromium/font environment
```

`test:comic` still has known CPU-bound simulation cases; the affected historical UI/price assertions now pass79/79 together with continuity/E109/journal cases. Read verification.md before using a full simulation run as a gate. The source fingerprints include the portable artwork provenance manifest.

`npm run dev`, `build`, `start`, `test` retain their existing root behavior. Comic is isolated: its local `game/` includes journal integration and presentation paths. Do not replace it with root game code blindly. Reconcile rules in a separate reviewed task.

## Baseline lifecycle

The user approved the exact14-image set on2026-10-30; hashes and scope are sealed in baselines/manifest.json. `record` is only for initial unapproved candidates and now refuses to overwrite an approved baseline. For a proposed change, run `compare`, review the actual images/report, obtain approval for those exact captures, then promote the reviewed hashes explicitly. Never clear approval or re-record to hide a regression. `compare` (the default) never updates references. Screenshots, computed geometry, browser identity and timer masks are saved in `baselines/manifest.json`; actuals/reports go in ignored `runs/`. Pixel differences above 0.1% (per-channel noise threshold8) fail. Only `.countdown` is masked; content/action areas are never masked. The screenshot fixture pins DPR1; physical PNG dimensions must equal CSS dimensions×DPR and timer masks use physical coordinates. DPR2 was investigated but did not solve cross-width artwork instability; see raster-investigation.json. Dimensions, DPR or browser changes fail rather than silently rebase.

Existing user-confirmed contracts (same frame, equal action widths, centred stepper, equal +/- gaps, hidden unknown facts) are assertions independent of pixels. A passing pixel comparison proves a valid comparison in that recorded environment, **not human approval**. Capture preparation allows at most10 current-image samples separated by2 actual animation frames; it does not consult the reference. Only after two current samples match does it compare against the approved reference once. Persistent instability fails and retains the last differing pair; a reference mismatch is never retried automatically. Baseline approval status is explicit. Review the approved set in [review.html](review.html). Human approval covers these images, not unrelated redesign or a waiver of failed pixel/functional gates.

Refresh source fingerprints deliberately after reviewing a verified change: `node scripts/ui/check.mjs --refresh`. This records evidence only, not approval or a replacement for tests.

Use the same Ego TaskSpace across rounds of one task (`--space ID`); omit it for a standalone fresh test run. Run `ego-browser skill` before browser work. If the environment blocks the CLI, report it and request the normal execution permission; do not substitute a different browser or bypass user control.

## Before / after each change

Inspect the current screen and an existing peer, read applicable decisions, trace callers, reuse components/tokens, and change only the requested gap. Run source checks and relevant tests; compare actual frame, inner padding/gaps, control sizes and centres. Do not equate equal outer columns with balanced contents. Update the handoff with evidence, failures and the next concrete task. Hindsight supports history; source and versioned decisions govern current work.

Each CLI call writes a separate `MODE-invocation.json`, even when the browser cannot bootstrap. Check its exit status/time against the detailed report; a leftover green report is not evidence of a new run. The approved set covers14 states across7 registry screen IDs; trade table and item-sale are bothS06, not two new pages.

S08 user-approved implementation: see [current evidence](../game-design/implementations/S08-reward.md), s08-verification.json and scripts/ui/s08-smoke.mjs. Its captures are separate from the sealed14-image baseline set; existing peer image comparisons still pass. The four pre-existing broad i18n failures remain documented in s08-functional-verification.json.

Spirit-world S11/G01–G04: [runtime handoff](../game-design/implementations/ghost-delivery-progress.md), [rules](../game-design/ghost-service-contracts.md), [verification](ghost-functional-verification.json). Shared inventory bounds and controls; C34–C38 are actual fixture captures, not automatically approved visual baselines.
