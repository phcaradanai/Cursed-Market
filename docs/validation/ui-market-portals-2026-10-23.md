# Compact market and portal decision review — 2026-10-23

Dark Market now shows three notices per page. Each notice opens one order or auction in a native dialog. Order details keep the existing MarketSale calculations; duplicate held items have a separate item selector. Narrow screens switch between terms and selling within the same dialog. Portal events E01, E08 and E10 show merchant portraits, public goods hints and the projected open/closed doors beside the choices. Tucking an event retains its choice. Dialogs trap focus, restore the opener, and consume Escape before the underlying drawer can close.

## Validation

- Server TypeScript build and appraisal client production build passed. Vite retains its existing large-chunk warning.
- Focused client, commerce, portal-context, timer and localization tests: 105 passed, zero failed.
- Full suite: 821 of 822 passed. The cross-shop fee network assertion failed under full load (514 versus 513) and passed when rerun alone. No server or game-rule source was changed by this task.
- Browser: all 24 E01/E08/E10 choice/viewport combinations fit without modal overflow at 1366x768, 1024x768 and 390x844. Market pagination, mobile terms/sale views, duplicate-item selection, an engine-backed sale, event choice persistence, focus trapping and focus restoration were exercised.
- Replaced the three undeclared Cormorant Garamond font references with the canonical typography. No design findings were suppressed.
- Temporary browser fixtures and their servers were removed after testing. Existing working-tree changes were preserved.

## Trail review

`trail check` and `trail check --base HEAD` return keyword conflicts. Most match existing design metadata and hook-cache text. The remaining matches concern imports and presentation of market orders in components.tsx: the words “term/card/choice”, “copy/item”, “item/kind” and “copy/quote/item” are not changes to those rules. This task does not change copying, held-item stacking, reference quotes or passive deduplication. E08's duplicated contract block was removed; its canonical terms remain in the choices. These flags were reviewed as lexical false positives, not suppressed, and must not prompt changes to game rules or removal of the user's metadata.

## Current portal events corrected after screenshot feedback

The earlier preview covered only E01/E08/E10. The player's E117 screenshot exposed missing context in current Survival events. Preview and dialog layout now apply by PORTALS phase, including E117/E118/E119. Numbered door cards use the existing gate art and public merchant data. Every current choice names the numbered merchant door it closes, and the preview preserves the third door and existing closures exactly as the engine does.

The expanded tests enumerate current portal specs and compare every offered choice under current and archived rules with engine results. Focused tests passed 79/79. Browser checks passed all 32 current-event choice/viewport cases at 1440x900, 1366x768, 1024x768 and 390x844 without dialog overflow. An actual confirmation closed the same door predicted by the preview. All browser work used a separate temporary fixture server. `trail check` continues to report lexical flags; placing the existing gate artwork inside a dialog does not introduce fixed 3D world gates or a new WebGL context.
