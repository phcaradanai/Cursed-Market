# Cursed Market — session contract

Paths below are relative to the Git repository root, even when working inside apps/comic.

## Start with the right source

1. Read `docs/ui-system/README.md` and the relevant decisions/verification before UI work. **Active comic app is `apps/comic/`; root `src/` is the preserved realistic/cabinet app.** The former external comic directory and `docs/.../implementations/*-source` are historical evidence, not edit targets.
2. Gameplay/balance/catalog: read relevant sections of `docs/game-design/PROJECT-CONTEXT.md`, `development-roadmap.md`, and confirmed `rules-and-logic.md`; select a concrete task. Confirm actual runtime/config before changing it. Relation proposals are not runtime bindings; graph dependencies are not causal execution. Use `balance-workflow.md` with config/seed/baseline evidence for experiments.
3. Screen work: read `docs/ui-system/design-system.md`, `decisions.md`, and relevant `screen-context.md`, `screen-flow.json`, `current-captures.json`, `current-ui-inventory.md`. Inspect the actual target and an established peer screen. Registry entries/absent captures do not prove absent implementation. S02 portals already exists: do not recreate it.
4. Inspect Git status/history. Preserve unrelated changes. Read only relevant sections; do not load every historical document each turn.

## Authority and memory

Current repository implementation is authoritative for what runs; explicit approved decisions/rules define intended behavior. Captures carry origin/source hashes; old captures and drafts are not current implementation or automatic approval. `docs/game-design/logic-item-relations.html` is the human-facing index, generated from source data.

Before responses, use applicable Hindsight recall when available. Retain significant facts/approved decisions after work. Verify acknowledgement/retrieval when claiming memory works; report errors or missing retrieval, do not assume it is active. Treat memory as supporting history, never override current files or user instructions with it. Record durable decisions and verification in Git even if memory succeeds.

## Locate before editing — Trail

Use Trail before searching/opening source: `trail ask "task" --source` for location/understanding; `trail grep "literal"` for exhaustive occurrences; `trail skeleton file` for signatures; `trail callers Symbol --depth all` before cross-file changes. Read exact returned spans if truncated. Use `rg` for unindexed/new files (comic may not yet be indexed), not repeated reworded asks. Refresh with `trail build` after substantial changes. Save useful decisions/corrections with `trail note`; run `trail check` before commit/review and report existing conflicts honestly.

## One game, one established UI

- Reuse `ComicMenu`, `ComicButton`, `ComicTooltip`, existing icons, facts, choices and gameplay handlers. Before styling, compare inventory/status/menu implementations. Do not invent per-screen ribbons, palettes, typography, border styles or repeated dividers.
- Inventory is the shared outer-frame reference. Geometry and corners come from `comic-tokens.css` / `comic-frame.css`; header/control appearance from `comic-ui.css`. Keep CSS imports in `main.tsx` so Node SSR can import components.
- Symmetry includes equal outer padding, repeated gaps, aligned labels/value tracks, paired action sizes and whole-group centres. Assert +/-/input centre against the action pair and equal gaps/padding; an inherited min-width must not exceed its grid track. Put decorative currency/info icons outside the measuring group.
- Preserve HUD, preview selector and bottom dock. No scrolling or expanding dropdown in game play panes; use existing pages/subviews. Utility navigation is read-only, does not submit decisions/reset clocks, and must not be blocked by another utility/event dialog.
- Comic 2D inked cutouts, existing merchant/item palettes. Portrait bottom stays flush/clipped; top/sides may overlap. Do not fade art or duplicate item images. Existing3 mood frames are the current asset truth; follow `merchant-expression-rules.md` when implementing them.
- Decision UI must show known costs/gains/targets. Portal-closing choices expose actual merchants and per-choice affected/unaffected portal states, optionally via read-only peek/hover/focus/touch info. S01 follows minimal v01 direction, not permanently expanded v02 grid. Never reveal unknown item truth or confuse seller claims with facts.
- Image generation is paused unless the current user explicitly resumes it for a specific task. Reuse existing captures/implementations first; the screen inventory is not an instruction to generate all pages.

## Change and verify

Keep comic/legacy isolated; do not copy root game code over comic journal/content paths. Material design, information-visibility, navigation, rule or architecture changes need a concrete proposal and user approval. Safe restoration of approved rules and identical-value consolidation may proceed. Do not re-request existing authorization.

Run `npm run ui:check`, `npm run ui:test`, `npm run ui:smoke`, relevant functional tests/build, and `npm run ui:visual` for UI changes. Compare approved contracts and reviewed screenshot baselines on narrow/wide desktops. Never silently re-record a failing baseline; candidate reproducibility is not human design approval. Preserve error/focus/reduced-motion handling. Read verification.md before repeating the CPU-bound full simulation suite; Node test timeout did not provide a wall-clock bound.

Update decisions, roadmap/handoff and verification with commands, outcomes, failures, source/capture fingerprints and remaining gaps. If runtime/rules/registries change, rebuild/check the system atlas; never hand-edit generated HTML/atlas. Report environment failures separately from test failures. Do not declare completion without evidence or call old failures new regressions. Stage only intended files; never sweep unrelated work into a commit.
