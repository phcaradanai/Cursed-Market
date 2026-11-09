# Shared Comic micro-interactions

User requested continuing the earlier micro-interaction work as one consistent system. This pass extends the established black/crimson control language rather than changing geometry, art, actions or navigation.

## Decisions

- `comic-interactions.css`, loaded last in `main.tsx`, owns hover, pressed, selected, disabled and keyboard-focus states. Existing160ms timing and existing hover colors are tokens scoped to `.comic-build`, including the entry header.
- A selected control uses the existing accent border and dark red fill. The external rose3px/4px-offset ring means keyboard focus. Remove the legacy idle `.selected` outline and the duplicate white2px sale focus rules.
- ChoiceCards and legacy steppers show one group focus ring, including when a native radio or tooltip term receives focus. Preserve native controls and handlers.
- Hover keeps artwork stationary; quiet overlays retain opacity fading. Item surfaces and semantic status terms retain their own colors. Disabled controls have no press response. Reduced motion removes control transitions and displacement.

## Evidence

The initial actual-browser audit found event cards with a white2px outline at idle, inventory/table focus offsets of3px, and quiet overlay transitions missing opacity. The final `scripts/ui/comic-interactions-smoke.mjs` passes at1440x720 and1024x800 in Ego TaskSpace29. It checks actual primary/secondary hover, unchanged control dimensions,1px press, selected navigation, selected event/sale focus, suppressed nested native-input rings, disabled cards/buttons, quiet overlay opacity/timing, tooltip exit, legacy stepper and vault focus, reduced motion, and entry-header focus. No gameplay decision was submitted. Report: `runs/latest/comic-interactions-smoke.json`, finished2026-11-09T11:54:35.310Z.

Desktop and390x844 touch event screenshots were inspected during the pass. Selected card borders remain accent-colored without the idle external white outline; touch native-radio accent is the same rose. Final sale-card keyboard capture: `runs/latest/micro-sale-focus.png`, SHA256 `04cf06ec2dd08718d2ca508a3054e58b5a9877359daba388af58e46dc74f9a4d`. Captures are verification candidates, not promoted references or proof of every mobile layout.

- `npm run ui:test`:10/10 pass.
- `npm run build:comic`:135 modules pass; existing938.97KB bundle advisory remains.
- `git diff --check`:pass.
- Focused Impeccable detector exits0 with palette/type advisories on existing values in `item-sale.css` and the reused disabled border `#596065` from `ComicButton`. No new palette/type direction is implied, and no clean-design claim is based on this scan.
- `npm run ui:check`:source inventory drift persists across the existing worktree; not refreshed in this pass.
- `npm run ui:smoke -- --space 29`:exit1 at shared-frame y112 versus60. Fresh receipt starts11:55:51Z.
- `npm run ui:visual -- --space 29`:exit1,0/14; matching fresh compare report starts11:55:55Z in Space29, first inventory x160 versus24. Existing frame-contract failures stop those comparisons before they can validate interaction pixels. No baseline changed.
- `trail build`:pass. `trail check`:20 lexical findings remain in the other in-progress worktree changes; the scoped commit explains them. Public trycloudflare `/comic-interactions.css` returns200 and contains the final shared-state stylesheet.

## Source fingerprints

- `comic-interactions.css`: `53e4487cafcfa36c77989392a5c67ff0946b5aa40aacf7f280af8859ddb4d0c1`
- `comic-tokens.css`: `5b8767941038480b48de0a8703efa36d62bb5e73038f24b47c37b74ad98bf2e7`
- `item-sale.css`: `002bdfda7bb518bbe6518de3f4be99dd6547d6adddc6ab7da8bb4ae2f96b7e4e`
- `scripts/ui/comic-interactions-smoke.mjs`: `d8c6cf58ca7ec8937b51acf343bf86e806078920c97a421634a8f5e7c19a7598`

## Handoff

Shared-frame baseline/source-inventory reconciliation remains separate. This pass does not claim full screen-reader, all-events or all-mobile acceptance. Graft CLI resolved an unrelated parent index, so the repository's MCP Trail graph was used instead; Hindsight tools were unavailable.
