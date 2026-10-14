# v0.4 image and room-timer documentation handoff

2026-10-14 — Fresh Impeccable source comparison for the ordinary extension requested as **“รูปไม่แสดง เพิ่มให้สามารถตั้งค่าการจับเวลาหรือไม่ได้”**, with the image problem clarified on LAN port 3104.

The finished extension fits the incumbent realistic-card system. Root `DESIGN.md` and `.impeccable/design.json` are preserved byte for byte. This handoff adds the scoped timer and image behavior below; it does not establish a new visual world, component primitive or final brand approval.

## Authority and source comparison

`docs/art/appraisal-v0.4/direction.md` remains the working surface direction. The normative primitive record is root `DESIGN.md`, with the schema-version-2 sidecar providing its existing component previews and extensions. The current implementation authority is `src/appraisal-client/App.tsx`, `components.tsx` and `styles.css`. `PRODUCT.md` supplies product context; runtime progress and LAN evidence remain in the validation records.

Local graft localized `RoomTimers`, `Lobby`, `GameTable`, `DarkMarket` and `itemImage` before direct source reads. CSS declarations were read directly. A bounded static comparison checked all 20 appraisal root color declarations against the existing frontmatter, including the explicit `table-muted`, `table-line` and `paper-ink` scopes for the short CSS names.

| Checked extension | Incumbent comparison and resulting behavior | Source |
| --- | --- | --- |
| Host timer controls | Native fieldset/legend, select, labeled number fields and save button reuse the table's Cream, Raised Charcoal, bronze borders and Thai body/label typography. Existing controls supply 44px button and 46px field minimum heights, the 6px control radius, hover fill, 3px focus outline and 0.55 disabled opacity. | `App.tsx:33`; `styles.css:4–6` |
| Timer group layout | The group uses the existing fine Table Divider and existing 8/12/16/20/24px spacing steps. Its four phase fields use two columns, changing to one at the incumbent 640px breakpoint. The legend retains the existing 600 label weight. The new rule declares no color literal, font family/size, radius, shadow, animation or transition. | `styles.css:15` |
| Timer ownership and states | Only the lobby host receives editable controls. PORTALS, APPRAISAL, TRADE and REVEAL each accept whole 1–900 second values. Guests receive current settings as text; an older room DTO without settings receives default-server wording. Number fields disable when timing is off. Valid duration drafts remain saved when the host selects untimed mode; an invalid disabled draft keeps stored durations. Disconnected controls disable, and the server locks configuration after a run starts. | `App.tsx:33–64`; `src/server/appraisal-rooms.ts:33` |
| Readiness and persistence | A meaningful change to mode or duration resets readiness. Saving equivalent settings preserves readiness. Room configuration survives resume, host transfer and rematch. These states retain explicit Thai wording. | `src/server/appraisal-rooms.ts:33–37`; `tests/appraisal-timers.test.ts:49` |
| Untimed waiting | Authoritative untimed phases have null deadlines. Normal completion advances play; REVEAL waits for every seat's manual confirmation. Rules disclose that a disconnected player must return. The countdown and done notice describe waiting for players without promising expiry; timed rooms retain expiry copy. | `App.tsx:18,66,102`; `src/server/room-lifecycle.ts:143`; `src/server/appraisal-rooms.ts:46` |
| Dark Market artwork | Orders now call the shared `itemImage(kind)` helper. Thirty catalog kinds resolve to the ten existing family images, matching desk/inventory DTO art selection. The existing 72px square thumbnail, crop, control-radius frame and item heading remain in place. No raster or font was generated, substituted or visually reapproved. Shared family art does not reveal authenticity or curse state. | `components.tsx:130`; `styles.css:9`; `src/game/appraisal/content.ts:482–483` |

The new fieldset groups existing primitives for this task. No new sidecar preview is needed to represent a changed primitive. The family helper makes the existing art policy explicit for the expanded catalog; it does not promise thirty distinct illustrations. No material primitive mismatch was found in this scoped comparison.

## Evidence and limits

The independent review in `docs/validation/appraisal-timers-v0.4-review.md` records the focused **ship** verdict with F1 resolved: untimed done-state text now waits for other players, while timed text may mention expiry. Its independently run timer suite passed ten tests. The suite also checks strict settings parsing, host authority, settings persistence, complete untimed 2/3/4-seat runs, old DTO compatibility and existing family paths for all thirty kinds. This documenter inspected that source and report; it did not rerun the runtime suite or broaden the review.

`docs/validation/appraisal-timers-v0.4/lan-check.json` records six synthetic LAN socket runs covering custom timed and untimed 2/3/4-seat rooms, replay and rematch, plus correct MIME responses for 21 bundle, art and font assets. The adjacent final logs record 322 passing full-suite tests, 71 passing focused client/timer tests, and successful server TypeScript plus both Vite builds. Those are delivery evidence, not visual authority. The builder's separate narrow functional browser checks of image decoding and timer DOM state likewise do not certify art or layout.

The user's **“หยุดตรวจภาพ ใช้ผลตรวจเดิม”** instruction remains binding. This documentation pass used source and existing artifacts; it opened no browser or image viewer and performed no screenshot, raster, layout, device or accessibility interaction checks. Source declarations and SSR cannot prove responsive fit, font rendering, crop quality, focus order, screen-reader behavior, final visual fidelity or human enjoyment. Historical concept images remain critique references, not approved comps.

## Preservation and pre-existing drift

Before/after SHA-256 values are identical:

| Preserved artifact | SHA-256 |
| --- | --- |
| `DESIGN.md` | `40249653dfcf6b2fbb57192b074c0c48dd6d816a63f8a2e6bbcf99bd49c97d3e` |
| `.impeccable/design.json` | `9238a0f36541673cfc806c2a8ced05e9bcce1ae575775c4093e3804d8815f438` |

Impeccable context reports the pre-existing `config-build-path-unset` finding: the absent `.impeccable/config.json` records no comp-first/code-first preference for future Persuade or Experience surfaces. Operate screens and documentation use code-first work either way. This finding is reported without repair or a new branding interview; a future landing/showcase task can record that preference within its own scope.

The only authored project change from this handoff is this file. No source, product, plan, process, design primitive, sidecar, archive or LAN service was edited. Local graft refreshed its generated graph before returning the source references.
