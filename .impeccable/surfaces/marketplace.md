# Marketplace prototype

## Scope and visitor mode

Operate. First playable private multiplayer interface, not a production visual identity. Primary target: `src/client/App.tsx`; related: `src/client/styles.css`.

## Product facts and constraints

The user approved proceeding from Milestone 1 to the already scoped Milestone 2. GDD v0.1 pins private 2–4 player rooms, static placeholders and no visual polish before human playtests. Negative human feedback authorized v0.2 wagers. The user now explicitly requests roguelike runs with RNG and different routes. v0.3 extends the same interface with three market stages, seeded route votes and two personal boon choices. Keep the incumbent visual world and four placeholder families. The user requested stopping browser image checks; do not represent old captures as v0.3 evidence.

## Chosen direction

Code-first. A readable auction table: pale warm working surface, dark ink, rust for commitments and clear outcome labels. Structure comes from the decision being made, not a dashboard card grid. This is provisional prototype presentation. No comp or visual identity tournament is required by the approved prototype scope.

## FIRST VIEWPORT

Lobby leads with create/join controls and room seats. Marketplace leads with the current rolling pot, offered family, demand and exact guarantee; seller truth or buyer controls remain the main task. Coins and token counts stay in a compact participant list. At narrow widths, the task precedes supporting history without horizontal overflow.

## Signature interaction

All bids lock before the view becomes a reveal showing both attributes, all bids, net wager payouts, pot carry, escrow outcome and the buyer's points. Then every seat can acknowledge the reveal. No custom animation is needed in this milestone.

## STATES AND FLOW

Connection/loading/error, room lobby/ready/start, seller selection and guarantee, optional inspection in the buyer phase, integer bid plus optional sealed curse wager/pass, reveal, result breakdown, downloadable audit and rematch. Reconnect restores the same seat and locked choices. Timer explains the safe default at expiry. Keyboard focus and disabled actions are explicit.

## QUALITY BAR

Controls must work end-to-end with the authoritative server. Guarantee copy distinguishes one certified property from unknown other truth. Thai copy stays legible on desktop and mobile; focus, contrast, labels and error recovery must be usable. Placeholder family symbols never change with hidden truth.

## Unresolved decisions

Actual fun, balance, preferred final art, production typography and public hosting await later evidence. Seed key: none; the user-pinned minimum prototype scope supplies the direction.

## Direction contract — v0.3 extension

THESIS: make route risk and personal build choices change how a player values the next auction. Preserve the current work surface rather than adding a dashboard or new identity.

OWN-WORLD: existing warm paper, dark ink, rust selection/focus, Thai font stack and native controls. No new assets or motion.

STORY: players vote on one of three current branches, trade once each, choose a run-local boon and continue. Three markets end in scores; a new run resets builds and uses a fresh secret seed.

FIRST VIEWPORT: phase title, stage progress and deadline lead. A vertical list of radio choices states risk, reward and commitment before the primary action. During auctions the current market values, rolling pot and owned boons inform the decision.

FORM: local extension of the established Operate surface; code-led, no visual-world tournament or comp. Safe expiry abstains from voting and skips a boon without spending coins. Locked choices survive reconnect.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance. Source review must disclose that new visual/browser validation was waived by the user.
