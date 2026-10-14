# v0.4 design documentation handoff

2026-10-14 — Fresh Impeccable document pass for the implemented realistic-card working direction. This pass documents existing source; it does not select a new identity, redesign the UI or certify final brand approval.

## Written files

- Root `DESIGN.md`: canonical eight-section design record, with the existing legacy token coverage retained and separate appraisal component tokens added.
- `.impeccable/design.json`: synchronized schema-version-2 extension sidecar for colors, typography metadata, observed shadows/motion/breakpoints, component snippets and narrative.
- `docs/art/appraisal-v0.4/documentation.md`: this handoff and its verification limits.

## Source authority and scope

The documenter localized `src/appraisal-client/App.tsx` and `components.tsx` through the local graft CLI, then read the relevant source. The graph did not index the CSS paths, so their declared styles were read directly. Appraisal visual authority is `src/appraisal-client/styles.css`, `App.tsx` and `components.tsx`; legacy declarations are in `src/client/styles.css` and the existing archived design record.

`docs/art/appraisal-v0.4/direction.md` supplies the authorized working direction. `generation-prompts.json` and `fonts.json` supply raster and font provenance respectively. The focused finish review in `docs/validation/appraisal-ui-review-v0.4.md` provides the existing F1–F3 source/test verdict; this documentation does not extend it into a whole-surface visual judgment. Delivery verification is recorded separately in `docs/validation/appraisal-delivery-v0.4.md`.

The root frontmatter retains every legacy color, type, spacing, radius and component value. Appraisal additions describe amber table actions, rust paper actions, surface-specific fields, the cream reading panel, portals, inventory thumbnails, stock selection and event fills. The appraisal default h3 token is corrected to the observed 21px; 22px remains a local narrow merchant override in prose. The short CSS root names `--ink`, `--muted` and `--line` differ between the two entries, so the documentation gives each value an explicit scope.

The sidecar has 30 color metadata entries, 11 typography metadata entries, two observed artifact-shadow values, the 320ms artifact arrival declaration and reduced-motion override, and the separate 1100/900/640px appraisal and 760px legacy breakpoints. Its narrative is copied directly from the canonical Markdown. Tonal ramps are synthesized panel previews, not implemented ramps.

Fifteen snippets cover eight appraisal examples and the seven retained legacy primitives. Every class is prefixed `ds-`; each example carries its own distinctive CSS and literal fallbacks or current appraisal CSS variables. Legacy snippets use their source colors literally so they cannot inherit the appraisal entry's conflicting root properties. The labeled legacy relic preview uses phrasing spans to keep its HTML label valid while preserving the documented layout. The new reading-panel example displays unknown facts and omits raster art; it is not a full-desk or asset-fidelity preview. Snippets require no React runtime, utility bundle, external image or icon package. Font fallbacks allow standalone previews without claiming the self-hosted fonts were rendered.

## Static verification

- The root body has exactly the eight canonical sections in the required order.
- Every archived legacy frontmatter value is preserved in root `DESIGN.md`.
- All 60 component token references resolve across 25 component entries; component properties use the documented eight-property schema.
- Color and typography metadata keys exactly match the root primitives, and every color ramp has eight entries.
- All 15 snippet CSS strings parse with the project's PostCSS dependency. HTMLParser checks passed for balanced markup, scoped classes and valid phrasing children inside labels; interactive samples contain focus rules.
- The sidecar north star, overview, characteristics, four named rules and do/don't lists match the Markdown exactly.
- Shadow, animation, reduced-motion and breakpoint values match the relevant source declarations.
- The legacy archive files remain unchanged, with SHA-256 `abce875670d7da3d64f822af9a5ffab975cd4a576cc69f6f4571a7fb6a42d477` for archived `DESIGN.md` and `f6ca09ae0310ab0e1d0fa588b0821345f3a6d016cb2d3f323717642af71c036b` for archived `design.json`.

These are bounded structural checks, not an official external schema-linter run or rendered preview. No source implementation, plan, PRODUCT document, archive, process or LAN service was edited by this handoff.

## Verification limits

The user's instruction **“หยุดตรวจภาพ ใช้ผลตรวจเดิม”** remains binding. No browser session, screenshot, image inspection, rendered preview, mobile/device interaction or accessibility interaction was performed. Source and snippet checks do not certify visual hierarchy, font rendering, artwork quality, asset cropping, overflow-free layout, focus order or screen-reader behavior. Historical captures do not establish v0.4 visual quality. Realistic cards remain the technical goal's working direction; final brand approval and human fun remain unproven.
