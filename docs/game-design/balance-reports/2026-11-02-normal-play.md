# Normal-budget play diagnostic — 2026-11-02

Revision4088f6e. No production values changed. Actual main-room config copied from authenticated audit,40credits/6life/deadline15, current default clocks. Browser main opted into pilot8 as declared; default catalogue3 still preserved.

## Actual App flow

One browser player plus built-in cautious bot. Public phase setup holds human spending beforeCollector4; Collector request/peek/confirmed purchase through actual visible controls. Five checks/captures, exact wallet/energy and owned item, game ended atencounter6 and strict replay matched. Later phase play uses public cautious policy. This is one actual random seed, not statistically representative play or full manual UX acceptance.

## Bounded matrix

One deterministic seed normal-main-0;2/4 seats,cautious/trader,catalog3/4. Each child has12s external kill bound and1500 command guard. All8 reachedRESULTS with strict replay; no timed-out or failed cases.

| Case | Result | End encounter | Commands | Collector paid | PvP trades | Auctions won |
|---|---|---:|---:|---:|---:|---:|
| c3-2-cautious | pass | 6 | 111 | 0 | 1 | 0 |
| c4-2-cautious | pass | 6 | 99 | 0 | 0 | 0 |
| c3-2-trader | pass | 6 | 191 | 1 | 13 | 2 |
| c4-2-trader | pass | 8 | 293 | 2 | 13 | 2 |
| c3-4-cautious | pass | 6 | 223 | 0 | 2 | 0 |
| c4-4-cautious | pass | 5 | 213 | 0 | 2 | 0 |
| c3-4-trader | pass | 5 | 377 | 0 | 47 | 2 |
| c4-4-trader | pass | 8 | 554 | 2 | 53 | 2 |

Observed total Collector purchases 5, deliveries 16. Auction wins 8. No vault-interest/player-loan/forced-RPS/ghost-service action proof in this matrix. Alien-loan events are not player loans. All8 ended through deaths at5–8; this small same-seed/policy sample does not approve any survival or price adjustment.

## Reproduce and preserve

Run node apps/comic/scripts/normal-play-probe.mjs /tmp/normal-play-new-run after Comic server build. Browser run uses scripts/ui/collector-normal-live.mjs on the authorized existing QA task space and current normal main localhost server; random room seed and exact config stored in audit. Replays are deterministic; a new random room is not guaranteed same event or affordability outcome. Preserve original receipts rather than overwrite them for a failed reproduction.

## Next evidence

Target actual ghost minigame/service together with surviving players; normal-resource vault/loan and forced-RPS journeys; separate seed/policy samples before tuning. Remaining48/strategic goals/awards require concrete approved specs. UI-COLLECTOR-CONTEXT remains deferred; no UI baseline change.
