# Isolated comic build

This is the user-authorized repository copy of the former external comic build. Edit here, not the external backup. It preserves comic art URLs, journal integration and local rule snapshot; root `src/` remains untouched.

Install dependencies once at repository root (`npm ci`). Use root commands `dev:comic`, `dev:comic:server`, `build:comic`, `test:comic`; see [UI continuity](../../docs/ui-system/README.md). Do not run two backends on3103. The default root commands still select the original app.

`migration-origin.json` records exact imported files before the current continuity fixes. Existing designs/captures may reference the old absolute path as historical provenance. `docs/ui-system/` is current guidance. Do not blindly sync game folders: the comic journal and art-path differences must survive any later rule reconciliation.
