# Ghost delivery — current handoff, 2026-10-31

Active source: `apps/comic/`. User approved the complete spirit-service rules, including buyer-death cancellation. Root legacy remains untouched. This is the implemented S11/G01–G04 flow; current verification is recorded in `docs/ui-system/ghost-functional-verification.json` (not a blanket game-balance verdict).

## Runtime

- Server-authoritative tracking: four cards, six swaps, 5.2-second server clock, one answer per round, retry after failure. Clock/round survive within-match reconnection and watch/reopen. Client timestamps are rejected. No seed or answer in player views.
- Buyer sees three deterministic quotes from the current runtime catalog. Prices are integer90–120% of rarity-adjusted base. Request binds the displayed quote identity; stale/forged offers reject without charge. Private prototype snapshots preserve rarity/base metadata at acceptance without leaking item truth.
- Ghost accepts/declines, then searches three independently lost/refreshable Skeleton slots with RPS. Tie retries, loss disables only that slot until the next living encounter. No self-purchase or reset exploit. Living phases continue independently.
- Delivery validates target, living buyer and funds, atomically creates one item and charges item price+fee through the ledger. Buyer acquisition cost is recorded; secure price-integrity records item price. Fresh seeded genuine/curse truth follows existing factory probabilities. Ghost gains floor(base/10)+fee as special points (not wallet credits). Collector and status estimate add it once after ordinary score modifiers.
- Insufficient funds wait. Buyer death/end of match cancel unfinished work without payment or points. Completing a batch or cancelling its final pending job relocks service until another minigame success.
- UI uses ComicPhaseFrame/ComicButton/CompactPager and inventory geometry. One job/provider at a time prevents clipping; three Skeleton slots stay visible. Utility menus/watch do not decide actions or reset clocks. No new artwork or unrelated redesign.

## Evidence and known limits

Core15/15, real2socket1/1, focused client/continuity/curse20/20, UI contracts10/10 and both Comic builds passed after quote binding. Strict command-only replay includes natural death, unlock, RPS search, delivery and Collector; the test oracle chooses winning hands but never injects matching stock. Network test explicitly fixtures initial death and matching slot; browser live workflow separately proves real RPS search (five rerolls).

Earlier production approved14 images passed14/14; peer menus18/18; live clock and delivery reports are preserved. Final refreshed results/capture hashes are in the verification JSON and central capture registry. Earlier dev13/14 artwork drift and missing-browser failures remain classified, not silently rebaselined. Approved reference images unchanged.

Known pre-existing NPC event test failure (Dark One sender/victim label) reproduces on39ec327; no global test-green claim. New56 runtime binding and full-game economy/balance/phone validation are separate. Match persistence across server restart is unchanged; reconnect is within the running match. Normal latest entry server is3189;3188 is an explicit death/clock fixture, not the ordinary game.

Final room correction: an already-accepted guess retry receives its existing acknowledgement even while a new card round is shuffling. A negative socket test reproduced the timeout before the fix and passed after; the new round remains unchanged. UI source/captures do not change for this room-only correction.

Durability check: exported the full staged Git index to a fresh temporary tree. UI source/art/reference check passed370fingerprints; Atlas checker passed123inputs and generated outputs. Existing installed dependencies were symlinked, so this proves tracked-file completeness, not a fresh dependency-install test. No unrelated .impeccable/root test/art files were included.
