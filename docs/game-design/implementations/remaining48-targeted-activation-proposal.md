# Remaining48 targeted-activation proposal

**Status:** architecture proposal only; no runtime change or new gameplay rule is approved by this document.

**Scope:** implement the already approved primary effects E35, E36, E53, E71, and E72 in the Comic app, behind the catalog 5 / `native56Effects >= 14` gate. Historical revisions remain unchanged. The numeric contracts and eligibility below come from the approved `remaining48-approval.json` and `remaining48-experimental-v1.json`.

## Shared interaction proposal

Keep the current Comic inventory and status UI. Reuse its item cards, `ComicButton`, existing status rows, cost text, focus handling, and disabled reasons. Add target choices inside those existing controls; do not add a new visual style or a new top-level menu.

Keep existing `activate` messages for current items. Add one validated, mutually exclusive target shape for the new item effects:

```ts
target: { kind: 'portal'; portalId: string }
target: { kind: 'status'; statusId: StatusId }
```

The server accepts only the target kind that matches the item effect, resolves it against the actor's current view/state, and validates phase, item custody, target eligibility, cost, and family cap before charging or consuming anything. Existing NPC-target fields remain for existing abilities; malformed payloads that mix target shapes are rejected. The message parser, replay, and idempotency paths must preserve the exact accepted target.

## Approved effect contracts

| Effect | Approved behavior and cost | Required target / guard |
|---|---|---|
| **E35 — Folding Beacon / Lanternfish Cage** | Active; 1 energy; one combined Beacon/Cage portal clue per player per encounter. Reveal the **kind only** of the actual second stock item. The item remains held. | One current real portal during `PORTALS`, before selection, with no unresolved event and an actual second stock slot. Store private knowledge against both `portalId` and `itemId`; rerolling a portal never moves the clue. No base, ask, truth, curse, rarity, other player's knowledge, or new stock is revealed. Already-known/no-slot/invalid attempts cost nothing.
| **E36 — Rift Saddle** | Active; 1 energy; reopen at most one qualifying portal per player per encounter. Change only its disabled flag; keep the same merchant, portal ID, and stock. The saddle remains held. | One current, unselected portal disabled by a **resolved event**, with its `portalId`, merchant, and `causeEventId` recorded. Exclude crime/trade ban, D07, system closure, dead players, and banned merchants. No-op/invalid attempts cost nothing. No reroll or stock refresh.
| **E53 — Ash Seal / Springjaw Trap** | Held; no energy cost; grant one unknown-facet inspection without energy, while still consuming the normal inspection quota. One shared right per player per encounter; tool origin and seized original are bound; it ends when the encounter ends or either required custody is lost, and cannot transfer. | Trigger only after a successful `seal-pick` transfers an original item to the player who already held an eligible original tool. The player chooses an unknown price/authenticity/effects facet through the existing inspection controls. No auto-reveal, no benefit for an already-known facet or exhausted quota, and no repeat inspection score.
| **E71 — Null Sword / Silence Snuffer** | Active; 1 energy; remove one selected active debuff instance. Combined family cap: two accepted removals per player per encounter. Consume the selected item on an accepted attempt. | Only D01, D02, D05, D06, D19, D20, D22, D23 with a future effect still remaining. Exclude D03, D07–D10, D21, D24 and crime, loan, seal, contract, or cooldown state. Validate the exact selected status before charge/consumption; never refund HP, energy, or credits or reopen portals.
| **E72 — Echoweave Shawl** | Active; 1 energy; extend a selected eligible buff expiry by one encounter, with no change to charges or magnitude. One shawl per player per encounter; consume it on an accepted attempt. A status can be extended only once for its whole lifetime across players and copies. | Only active, finite-expiry B03, B05, B11, B14, B16 with remaining charges. Exclude B10/score, infinite-duration effects, start-of-encounter triggers, contracts, Collector, Spirit, and expired statuses. A copied buff inherits whether its source was already extended.

These limits and numbers are approved; the proposal does not add optional effects or change the formulas.

## State and protocol changes needed

### Portal targets and event provenance (E35/E36)

- Add `portalId` target support to the validated activation message and existing item controls. The actor chooses among their currently displayed doors; no hidden facts are included in the target list.
- Add owner-private E35 clue state keyed by `{encounter, portalId, itemId, kind}`. The DTO exposes only clues belonging to that seat and only for the matching current portal. A reroll receives a new portal ID, so an old clue cannot migrate.
- Add event-close provenance to `Portal` (at minimum `causeEventId`) and set it only at resolved event paths that close a portal, including the existing E01/E10 and Core2 event-resolution paths. Clear it whenever the portal is replaced or reopened. D07 closure remains distinguishable and ineligible.
- E36 target view includes the current portal ID, merchant, and observed event cause; it does not expose stock truth.

### Status targets, identity, and custody (E53/E71/E72)

- Add a `statusId` target to the validated activation message and reuse the player's current status rows as the selector. The server resolves the selected status again at acceptance; a stale or protected target is a no-op rejection with no cost or consumption.
- E71 uses the selected current status ID from the allowlist. Its family-use ledger is encounter-scoped and item-origin-aware, so copies/transfers cannot exceed the two accepted uses.
- E72 needs a stable internal identity or one-use marker for a buff instance: `Status` currently has no instance ID, and `grant` merges same-ID statuses. Recommended implementation: assign a stable status instance ID when a status first exists, preserve it while that status is merged/copied, and store an E72 extension marker on that identity. New status instances after expiry receive a fresh identity. The target message can remain `statusId` because the current player has at most one merged status per ID; the server resolves the internal identity. This preserves the approved cross-player/copy once-per-lifetime limit.
- E53 needs a typed permit linking the original tool origin, the successfully seized `itemId`, and the encounter. Reconcile it after every accepted action and at encounter close. Inspection cost previews must include this permit, and the server consumes it only after all ordinary inspect checks pass. Losing either required custody clears the permit without transfer.

## Required owners and files

- `apps/comic/src/game/appraisal/types.ts`: target action union; portal closure provenance; private clue / E53 permit and E72 status identity fields; view DTO shape.
- `apps/comic/src/server/appraisal-messages.ts`: strict parsing and rejection of mixed/invalid target shapes.
- `apps/comic/src/game/appraisal/engine.ts`: target dispatch, portal eligibility/cost/usage, encounter cleanup, and custody reconciliation.
- `apps/comic/src/game/appraisal/events.ts` and `core2-events.ts`: record event closure cause at the actual event-resolution sites; preserve D07/system closure distinction.
- `apps/comic/src/game/appraisal/views.ts`: seat-only E35 clues, E36 event closure details, active eligible status targets, and E53 inspection quote.
- `apps/comic/src/game/appraisal/mechanics.ts`: E71/E72 validated accepted actions and E53 inspection cost/permit consumption.
- `apps/comic/src/game/appraisal/seals.ts`: create E53 permit only after a successful original-item `seal-pick`; reconcile its custody.
- `apps/comic/src/appraisal-client/components.tsx`, `model.ts`, and existing target controls: show only legal targets, exact energy cost, free inspection quote, disabled reasons, and confirmation state using current Comic components.
- Existing simulation policy, if agents are expected to use these actions; it must choose a currently valid portal/status target and must not submit targetless actions.

## Focused acceptance tests

1. E35 reveals only the second item's kind to the owner; rejects missing/known slot, wrong phase, unresolved event, stale portal ID, borrowed/copy origin where ineligible, and prior revisions without spending energy or changing state. A reroll cannot transfer a clue to its replacement portal.
2. E36 opens only an event-closed current portal with matching `causeEventId`; rejects D07, crime/system closures, wrong merchant/portal, banned merchant, dead player, stale event closure, and prior revisions without energy/item loss. Successful use preserves portal ID, merchant, and stock.
3. E53 permits one unknown inspection after a valid original `seal-pick`, still increments the normal inspection quota, reports zero energy in the UI, and yields no inspection score for known data. It fails for no target, exhausted quota, missing tool at capture, copies, end of encounter, or either custody loss; failed inspections do not consume it.
4. E71 removes only the selected allowed active debuff, never another same/different status by ordering; protected/inactive/stale statuses, insufficient energy, dead/ineligible items, and prior revisions cost nothing. The two-use family cap is shared across both item kinds and follows item origins/copies.
5. E72 extends only the selected eligible finite buff by exactly one expiry step; charges and magnitude remain unchanged. It rejects expired/excluded/already-extended statuses and copies, and proves the once-per-status-lifetime marker survives status copying, merging, retries, and room serialization.
6. Replay/idempotency and seat-view tests prove target IDs, closure causes, and E35 clues cannot leak another player's item kind or hidden facts. Existing revisions 1–13 retain their prior action behavior and fixtures.
7. UI tests compare target visibility, quote, and disabled reasons against server validation for all five effects; no dropdown, scrolling pane, or new visual component style is introduced.

## Decisions still required before implementation

No new effect numbers or gameplay formula decisions are open. The product/architecture approval needed is for the additive target protocol and state fields above, especially:

1. Accept `activate` with a discriminated `target` object (`portalId` or `statusId`) while preserving legacy activation fields, or choose separate action variants. Whichever is chosen must reject mixed target shapes and be included in replay/idempotency.
2. Accept a stable `Status.instanceId` plus E72 extension marker propagated through merge/copy paths. This is needed to honor “once per status instance across players/copies”; `statusId` alone cannot prove that limit.
3. Confirm that E36 provenance is recorded only for resolved event closures and remains available to the player who owns the portal. D07 and other system closures must never receive event provenance.

Until those shared data/interaction changes are approved, E35, E36, E53, E71, and E72 remain pending and their existing item descriptions must not imply that these bindings work in runtime.
