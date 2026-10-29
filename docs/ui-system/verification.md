# Verification — audit 2026-10-29 → 2026-10-30

Current status: **in progress**.7 Node contract tests,18 preview menu flows,359 source/static fingerprints and106 atlas inputs pass; all63 imported runtime files are unchanged. Pixel reproducibility and human image approval remain open. No full functional-suite pass is claimed.

## Passed evidence

- Explicitly authorized comic relocation into apps/comic,364 source/config/test/assets files preserved at import (230MB). Root realistic/cabinet source untouched by this task. Import hashes are in migration-origin.json.
- Root focused UI/secure-client/rarity tests:81 passed (log summary retained). Comic continuity4 SSR tests passed; existing blood-pact/journal4 passed. Build:comic passed with existing bundle-size warning. Guarded DarkMarket SSR initializer without changing browser behavior.
- Node UI contract/pixel helper tests7 passed. Negative regression detects prior8px/12px gap, off-centre input, frame drift and hidden facts. PNG comparator detects changed pixels and timer-mask behavior.
-14 screenshot candidates captured with measured geometry. Same frame inventory/shared menu/sale on1440×722,1024×800,1920×800. Sale centre1067 equals both action-pair and input centres at1440; gaps12/12, +/-40×40, heights40/40/40, zero overflow. See record.json and baselines/manifest.json.
- Hindsight synchronous retain and read-back same ID verified; see memory-health.json.

## Pending / failures, not green by assumption

- Stable-raster candidate recapture passed14/14. Independent compare passed13/14; narrow sale capture did not settle within five samples. A targeted narrow retry passed status and sale, but inventory showed0.279% pixel drift in enlarged potion artwork. No full visual-green claim; see compare-first-stable.json and compare-narrow-retry.json. Candidate capture is not image approval; explicit human review is separately tracked in decisions.md/manifest.
- First capture attempts hit browser screenshot timeouts; load readiness and bounded read-only screenshot retries were added. Layout/pixel failures are never retried or rebaselined automatically.
- Full legacy and comic suites were stopped after long-running attempts without a final result. Do not claim either full suite passes.
- Imported legacy comic client assertions: initial63/71 pass,8 failures. After SSR guard a further historical-client run reported60/67 with7 failures (different selected set); remaining exact cabinet text/structure and old artwork manifest assumptions are not accepted current comic baselines. They are reported, not rewritten to hide failures.
- No live multi-player transaction or phone portrait proof in this audit. No gameplay rule unification, global screen redesign, or update to unrelated dirty root code.
- Whole-branch Trail check has known existing conflicts in .impeccable; it is not a green gate for this task.

## Re-run

`npm run ui:check`, `npm run ui:test`, `npm run build:comic`, `npm run ui:visual` (with the comic Vite server and matching browser available). Functional continuity: `npm --prefix apps/comic run build:server` then `node --test apps/comic/dist/tests/comic-continuity.test.js` (run old tests from their own app cwd). A missing tool/environment is a failure to report, not permission to skip silently.

### Raster comparison investigation (2026-10-30)

The first comparison passed10/14; the next passed8/14. Differences were concentrated within merchant/item artwork, while measured frames and sale geometry passed. Initial candidate status portraits were visibly softer than subsequent captures. Image completeness alone did not prove final decoded/composited pixels. The capture gate now awaits image decoding/two animation frames in a foreground page and requires two consecutive matching screenshots (timer excluded), bounded to five samples. It never relaxes pixel tolerance or masks artwork. Stable candidate recapture passed14/14; independent comparison outcomes are above; these are still not human-approved images. The transient candidates are superseded for capture readiness, not accepted as product regressions.

`git diff --cached --check` reports inherited trailing spaces/CRLF in imported source, font licenses, historical patches/CSV and generated atlas output. They are preserved to avoid rewriting provenance/license/history; no whitespace-clean claim.

Latest atlas check passed106 inputs. Static continuity check passed358 source fingerprints, shared token/frame/SSR rules,14 baseline hashes, dependency parity and tracked documentation. Trail check found20 lexical conflicts in pre-existing unstaged .impeccable files and checked only the first400KB of this large migration; those files are excluded from this commit. This is not exhaustive Trail approval.

## Continuation evidence — 2026-10-30

- DPR probe: same CSS image bounds, repeated DPR1 navigation differed2249px (0.276%, maxDelta35); DPR2 matching native display yielded0 changed pixels on both pairs (maxDelta1). See raster-investigation.json. DPR2 was tested as a fixture, with physical dimensions=CSS×DPR and scaled timer masks; UA+DPR must match on comparison. No product styling changes or threshold relaxation.
- Full DPR2 candidate record passed14/14 after same-page recovery. First2x attempt had renderer timeouts while4 full-test child processes consumed CPU; retained failure classification, no partial candidate manifest update. Independent compare pending.
- Focused functional rerun:12 tests,11 pass/1 fail. Continuity4, E1093, journal1 and price3 pass; existing “both trading seats compare” test fails its old UI markup expectation. See functional-continuation.json.
- Migration runtime preservation: all63 imported src/game, src/shared and src/server files still match import SHA256 byte-for-byte. The continuity task did not alter game logic.
- Full comic run with test-timeout90s/concurrency4 remained live at4m, with4 CPU-bound children (bots,brokerage,event-choices,expansion); timeout did not bound synchronous work. Stopped only verified own PIDs31747/32082/32083/32142/32177. No full-suite result or gameplay-balance claim. Do not repeat this expensive full run without an external wall-clock runner or a separate investigation.

- DPR2 full independent compare passed10/14, with artwork drift in trade1440, inventory1024/1920 and status1024. Alternating-width warm-load probe still differed15320px at1024 and3814px at1920; native DPR and double loading are ruled out as sufficient fixes. Restored the checkpoint DPR1 candidates/fixture to avoid replacing reviewed artifacts with an unproven environment change. Cross-navigation raster stability remains open. Geometry/header contracts pass all14 recorded cases and7 Node tests pass.
- Current historical UI test rerun:60/67 pass,7 fail. Provenance failure is20 item manifest entries vs old expected10 (not a missing file). See historical-ui-tests.json. No tests disabled or expectations weakened.

## Repeatable menu interaction proof

`node scripts/ui/run.mjs --space3 --mode smoke` passed18 flows: six utility menus at1024×800,1440×722,1920×800. It uses actual preview handlers, loads visible art, checks shared frame, header65px/border1px, symmetric12/18/12/18px header padding,40px header actions,10px corners, exactly one visible utility, same-button close, preserved sale item, positive fresh countdown with no reset, and no page scroll. See menu-smoke.json. Repeat with `npm run ui:smoke`; this is public fixture UI proof, not a live multiplayer transaction.7 Node contract tests pass; all14 retained baseline metrics satisfy shared frame/header contracts. Main generated HTML now labels active source separately from historical build origins.

## Portable artwork provenance correction

2026-10-30: verified46 legacy display art files from /private/tmp using the compiled test, not the app working directory. All SHA hashes match. The manifest holds10 item families with original/v2 art (20 files), not20 gameplay kinds; originals36 carry the fidelity PNG metadata while10 v2 items record generator provenance in the manifest. Test now checks both formats and each of8 merchants has exactly angry/idle/smile. No image bytes or gameplay changed. The portable target passes1/1; full historical UI file now61/67 with6 unchanged failures (previous60/67). See asset-provenance-verification.json and historical-ui-tests.json. Build:server,359 source checks (including manifest) and7 UI contract tests pass. This does not resolve image approval, raster determinism, or the full simulation suite.
