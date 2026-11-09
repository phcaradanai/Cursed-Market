## Decided
The Status header theft launcher keeps its visible label and uses content width with the shared 40px control height. Its fixed square width was left over from the old icon-only HUD entry.

## Tried and ruled out
Keeping width and min-width tied to control height makes the Thai label wrap outside the button. The existing ComicButton, eligibility, disabled state, and action handler already cover the control.

## Watch out
The Nov 9 utility popup sizing differs from the older approved inventory/status screenshots. Smoke and visual runs can fail on shared frame geometry before checking this launcher; inspect fresh invocation receipts and reports, and do not re-record those baselines to hide the mismatch. A secure `?preview=theft` fixture exposes the launcher for direct measurements.
