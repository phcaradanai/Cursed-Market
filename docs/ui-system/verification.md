# Verification — audit 2026-10-29 → 2026-10-30

## Passed evidence

- Explicitly authorized comic relocation into apps/comic,364 source/config/test/assets files preserved at import (230MB). Root realistic/cabinet source untouched by this task. Import hashes are in migration-origin.json.
- Root focused UI/secure-client/rarity tests:81 passed (log summary retained). Comic continuity4 SSR tests passed; existing blood-pact/journal4 passed. Build:comic passed with existing bundle-size warning. Guarded DarkMarket SSR initializer without changing browser behavior.
- Node UI contract/pixel helper tests5 passed. Negative regression detects prior8px/12px gap, off-centre input, frame drift and hidden facts. PNG comparator detects changed pixels and timer-mask behavior.
-14 screenshot candidates captured with measured geometry. Same frame inventory/shared menu/sale on1440×722,1024×800,1920×800. Sale centre1067 equals both action-pair and input centres at1440; gaps12/12, +/-40×40, heights40/40/40, zero overflow. See record.json and baselines/manifest.json.
- Hindsight synchronous retain and read-back same ID verified; see memory-health.json.

## Pending / failures, not green by assumption

- Stable-raster candidate recapture passed14/14. Independent compare passed13/14; narrow sale capture did not settle within five samples. A targeted narrow retry passed status and sale, but inventory showed0.279% pixel drift in enlarged potion artwork. No full visual-green claim; see compare-first-stable.json and compare-narrow-retry.json. Candidate capture is not image approval; explicit human review is separately tracked in decisions.md/manifest.
- First capture attempts hit browser screenshot timeouts; load readiness and bounded read-only screenshot retries were added. Layout/pixel failures are never retried or rebaselined automatically.
- Full legacy and comic suites were stopped after long-running attempts without a final result. Do not claim either full suite passes.
- Imported legacy comic client assertions: initial63/71 pass,8 failures. After SSR guard a further historical-client run reported60/67 with7 failures (different selected set); remaining exact cabinet text/structure and old artwork manifest assumptions are not accepted current comic baselines. They are reported, not rewritten to hide failures.
- No live multi-player transaction or phone portrait proof in this audit. No gameplay rule unification, global screen redesign, or update to unrelated dirty root code.
- Whole-branch Trail check has known existing conflicts in .impeccable/SecureEconomy; it is not a green gate for this task.

## Re-run

`npm run ui:check`, `npm run ui:test`, `npm run build:comic`, `npm run ui:visual` (with the comic Vite server and matching browser available). Functional continuity: `npm --prefix apps/comic run build:server` then `node --test apps/comic/dist/tests/comic-continuity.test.js` (run old tests from their own app cwd). A missing tool/environment is a failure to report, not permission to skip silently.

### Raster comparison investigation (2026-10-30)

The first comparison passed10/14; the next passed8/14. Differences were concentrated within merchant/item artwork, while measured frames and sale geometry passed. Initial candidate status portraits were visibly softer than subsequent captures. Image completeness alone did not prove final decoded/composited pixels. The capture gate now awaits image decoding/two animation frames in a foreground page and requires two consecutive matching screenshots (timer excluded), bounded to five samples. It never relaxes pixel tolerance or masks artwork. Stable candidate recapture passed14/14; independent comparison outcomes are above; these are still not human-approved images. The transient candidates are superseded for capture readiness, not accepted as product regressions.

`git diff --cached --check` reports inherited trailing spaces/CRLF in imported source, font licenses, historical patches/CSV and generated atlas output. They are preserved to avoid rewriting provenance/license/history; no whitespace-clean claim.

Latest atlas check passed106 inputs. Static continuity check passed358 source fingerprints, shared token/frame/SSR rules,14 baseline hashes, dependency parity and tracked documentation. Trail check found20 lexical conflicts in pre-existing unstaged .impeccable files and checked only the first400KB of this large migration; those files are excluded from this commit. This is not exhaustive Trail approval.
