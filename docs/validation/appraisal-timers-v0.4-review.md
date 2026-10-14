# v0.4 images and room timers — independent finish review

2026-10-14. Fresh source/SSR review of the ordinary extension requested as **“รูปไม่แสดง เพิ่มให้สามารถตั้งค่าการจับเวลาหรือไม่ได้”**, with the image failure clarified on LAN port 3104, followed by a focused F1 verdict pass after one fix batch. The binding instruction **“หยุดตรวจภาพ ใช้ผลตรวจเดิม”** excludes screenshots, raster inspection and visual QA. This reviewer used no browser, image viewer, new detector, or shipped agent definition file, and changed only this report.

## 1. Disposition

**ship — the focused source/test verdict pass scores F1 resolved.** The initial disposition was `fix`; one bounded mode-copy correction now tells untimed players to wait for others to finish, while timed players retain the expiry explanation. No additional fix batch is owed for F1. The initial source review and historical finding below are retained as evidence; the verdict table records the current outcome.

This final disposition scores F1 only; it is not a new whole-surface audit or a claim that no other defects exist. The initial review concerns the new image URL and timer flow in source/SSR. Neither pass gives approval of rendered layout, device interaction, browser accessibility, art quality, visual fidelity or final brand selection. Missing screenshots are an explicit scope constraint; no recapture is requested against the user's instruction.

## 2. Comparison with task and working direction

The extension retains the code-led realistic-card working direction in `docs/art/appraisal-v0.4/direction.md`, the incumbent token system and live Thai DTO-based game. `docs/art/concepts/v0.4/realistic-card.png` is a critique reference, not an approved comp; no approved quality-bar board or final brand selection was supplied.

- `src/appraisal-client/components.tsx:130` now calls `itemImage(order.kind)` for Dark Market orders. `src/game/appraisal/content.ts:483` maps 30 kinds onto the ten existing art families, removing the nonexistent new-kind filenames. The focused SSR regression enumerates all 30 kinds and checks that every emitted family path exists.
- `src/appraisal-client/App.tsx:33` exposes enabled/disabled mode and four phase durations to the lobby host, with explicit seconds, 1–900 bounds and a save action. Guests receive a summary. Disconnected controls are disabled; older DTOs without the additive settings field receive default-server copy.
- `src/server/appraisal-messages.ts:58` and `src/shared/appraisal-protocol.ts:9` reject nonboolean mode, missing/extra phase keys and fractional/out-of-range seconds. No actor or game secret is accepted through the setting message.
- `src/server/appraisal-rooms.ts:33` permits only the host before the run; changed settings reset readiness while equal values preserve it. Settings live on the room across resume, host transfer and rematch.
- `src/server/room-lifecycle.ts:143` sets null deadlines for untimed phases. Normal player completion still advances the game. `src/server/appraisal-rooms.ts:46` requires every seat's manual continuation at REVEAL; absent players must return, as disclosed in the settings and rules.
- Timed actions do not reset the deadline; expiry uses the existing authoritative safe defaults. Countdown and REVEAL waiting text recognize untimed mode. The initial done-status inconsistency was F1 and is now resolved.
- Optional timer metadata leaves schema-v4 engine replay unchanged. The report validates supplied settings, rejects timeout defaults in untimed audits and accepts older metadata without settings.

## 3. Material findings

Initial finding retained as historical evidence, superseded by the focused verdict below.

| ID | Severity | Evidence location | Trigger and material impact | Bounded fix |
| --- | --- | --- | --- | --- |
| F1 | P2 | `src/appraisal-client/App.tsx:102` | Host disables timing, starts a run, then a player ends PORTALS while another is pending. The status says **“คุณจบช่วงนี้แล้ว รอเพื่อนหรือหมดเวลาเพื่อไปต่อ”** even though `deadline` is null and no expiry will occur. This directly contradicts the requested untimed behavior and gives a waiting player a recovery expectation the room cannot fulfill. | Choose done-status copy from the room's timing mode: untimed waits for other players to finish; timed may mention expiry. Keep the existing manual completion and disconnect policy. Verify the done state's SSR text for both modes. |

Independent source/SSR reproduction used compiled `GameTable` with an actual two-seat `AppraisalRoomService`. After disabling timing and sending the host's `done` action, the projection was `enabled:false`, `deadline:null`, `selfDone:true`. SSR contained both the correct no-timer text and the quoted expiry promise (`expiryPromised:true`). This is a semantic contradiction, not a screenshot/layout claim.

No other material new image/timer defect was identified within this bounded read.

### Focused F1 verdict after one batch

| ID | Score | Current evidence | Result |
| --- | --- | --- | --- |
| F1 | **resolved** | `src/appraisal-client/App.tsx:102`; `tests/appraisal-timers.test.ts:86` | The done notice reads the authoritative room mode. With timing disabled it says **“คุณจบช่วงนี้แล้ว รอเพื่อนจบช่วงเพื่อไปต่อ”**; with timing enabled it retains the existing expiry copy. The regression creates a two-seat room in each mode, starts it, ends only the host's phase, and renders `GameTable`. It verifies the corresponding message appears and the opposite message does not. The reviewer independently ran the compiled timer suite: **10 passed**, exit 0, including this regression. |

No finding is partial or unresolved. This pass inspected only F1's changed line and its directly relevant source/test evidence; no new defect hunt, screenshot or detector pass was performed.

## 4. Craft-floor and source evidence

- **Coverage and copy:** all four requested configurable phases are present; the host setting, guest summary, save action, units, bounds, readiness reset and untimed disconnect consequence are findable in source. F1's inaccurate mode-specific status is corrected as scored above.
- **Semantics and states:** a native fieldset/legend groups timers; labels use matching input IDs; native select/number/button controls retain existing focus styles. Number fields disable when timing is off; validation prevents enabled invalid drafts, while off saves preserve valid drafts or stored durations. Source affordances do not certify actual keyboard or screen-reader behavior.
- **Incumbent system:** the added timer CSS uses existing line/color/type/control tokens, a fine separator, a two-column field grid and a single-column source breakpoint at 640px. It introduces no new raster, font, visual world, detector ignore, or design-system replacement. Computed geometry, contrast after compositing and responsive rendering were not inspected.
- **Images:** the change uses the existing shared image-family helper rather than creating assets or implying distinct variant illustrations. SSR emitted existing paths for all 30 kinds. Builder-supplied CRC/zlib checks and functional image-decoding diagnostics are separate technical evidence; this reviewer did not inspect raster content or certify the full LAN image experience.
- **Behavior:** null deadlines prevent automatic advancement in untimed PORTALS, APPRAISAL, TRADE and REVEAL; completion/confirmation remains authoritative. Fixed timed deadlines remain stable after actions. UI mode is read from the server's current DTO rather than inferred from a local draft.
- **Hooks:** the packet reports the design hook active and no new ignores; no additional detector ran. The craft floor was read for source review. Local graft localized the relevant symbols before direct reads.

## 5. Validation limits and next actions

The initial reviewer run of `node --test --test-reporter=dot dist/tests/appraisal-timers.test.js` passed **9 tests**, exit 0. These cover strict parsing, lobby-host authority, equal-value retry behavior, room persistence, complete untimed 2/3/4-seat replayable runs, custom fixed deadlines, disconnect/resume, host/guest settings SSR, older DTO compatibility and every Dark Market product's family-image path. The independent done-state SSR reproduction established F1. After its fix, the same independently executed suite passed **10 tests**, exit 0, including both timer modes' done-copy regression.

Initial builder evidence was **321 full tests passed**, then a successful full build and **70 focused UI/timer tests passed** after two additional UI lines. After the F1 fix, the builder supplied **322 full tests passed** (312 prior plus 10 timer/image tests). The final rebuild was still running when the focused verdict packet arrived; this report does not assert its outcome.

The builder also supplied six live LAN-3105 synthetic socket runs for 2/3/4 seats with custom timers and with timers disabled, completing strict replay/rematch with settings retained, plus 21 served assets. Its narrowly functional lobby DOM check found a 120-second draft retained when saving untimed mode, readiness reset, and rules acknowledging untimed mode. These are builder-supplied functional diagnostics, not screenshot or rendered-quality evidence. The reviewer did not repeat those diagnostics, rebuild, restart/kill LAN processes or run the full suite.

Next action: record the final rebuild result, then complete documentation and technical handoff. No further F1 fix round, defect hunt or image recapture is required by this reviewer. The **ship** verdict remains limited to F1's source/test resolution. Human enjoyment, full rendered quality, mobile operation, browser accessibility and final brand approval remain unverified.
