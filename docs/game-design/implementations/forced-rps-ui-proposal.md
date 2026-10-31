# Forced RPS Comic presentation proposal — 2026-10-31

Status: approved by the user on 2026-10-31 (“ปรับตามกรอบ Comic กลางเลย”); gameplay rule itself is approved and implemented under test. Current screenshot: ../../ui-system/forced-rps-before.png (existing component preview, not a network transaction).

## Observed

At1440×722, existing panel is[x64.8,y221.4,w1310.4,h383.0], hands418px each/44px tall. No page scrolling, but legacy brown/gold panel sits below appraisal context instead of shared inventory frame[x24,y60,w1392,h562]. Existing clock wording still says cancellation; correct this to the approved missing-hand rule regardless of layout.

## Proposed single established approach

Reuse ComicPhaseFrame/ComicButton/Peek/shared icons and inventory geometry. During a forced open duel, show a dedicated phase subview within the existing phase (no new engine phase), hiding duplicate appraisal/trade contents. Header: RPS title and current round. Two equal content tracks: role/opponent/known consequences and sealed round history on the left; independent clock, sealed/waiting feedback and three equal hand actions on the right. Keep unknown stolen item concealed. No portrait, duplicate item art, ribbon, gold palette, new font or new generic component framework.

No close/refuse action while unresolved. HUD, preview selector and all utility menus stay usable read-only and return to the same duel/time. On resolution, show result through the existing feedback/history pattern and return to the original phase; no extra charge/action on navigation. Choosing a target outside an active duel must remain reachable; inspect existing entry points and use a shared navigation affordance rather than an expanding details list. Any additional product-flow choice will be stated explicitly before integration.

Verification: paired tracks/hand actions, inventory bounds at1024/1440/1920, no inner/page overflow, concealed knowledge, focus/touch/reduced-motion, menu switching without clock reset, frozen baseline14 comparison, server/network/replay proof separately. Screenshot candidates are not automatic baseline approval.
