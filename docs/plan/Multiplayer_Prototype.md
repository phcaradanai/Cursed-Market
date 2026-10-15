> **Legacy (auction v0.3).** The current game is v0.5: use `npm run dev` / `npm start` (see README). The commands below now run as `npm run dev:legacy` / `npm run start:legacy`.

# Cursed Market — Multiplayer prototype

Milestone 2 uses the unchanged GDD v0.1 rules kernel. The online layer owns identity, room lifecycle and deadlines; it never duplicates scoring or settlement.

## Runtime

- `npm run dev:legacy`: TypeScript server watcher, Node watcher and Vite HMR at port 5173. WebSocket proxy uses the same browser origin.
- `npm run build && npm run start:legacy`: production client build and Node HTTP/WebSocket server at port 3100. `HOST` defaults to `0.0.0.0`; `PORT` can override 3100.
- Two or more devices on the same LAN open the server machine's LAN address, then join with the room code. `localhost` works only on the server machine.
- Public hosting is not configured. A later host must support persistent WebSockets and HTTPS/WSS.

## Identity and private views

Each seat receives a random 256-bit session token through its own socket. The browser saves it in sessionStorage, so independent tabs use independent seats and a reload restores the same tab's seat. The token is never included in room broadcasts, share codes, URLs or audit exports.

Client actions contain a request ID, match ID and auction number. The server validates the complete shape, rejects extra fields such as `playerId`, and binds the actor to the seat occupying that socket. Actions run synchronously against the latest state of the room. A retry reuses the original request ID and payload.

The server broadcasts a separately constructed `viewFor` payload to each seat. Hidden candidate truth, inspection findings, locked bids, the seed and the internal event log are never sent to another seat before their permitted reveal time. A replacement connection takes over the same seat and closes the old socket. A delayed close event cannot disconnect the replacement.

## Room lifecycle

Create/join supports 2–4 seats with a six-character room code. A match starts only when every seat is connected and ready. New seats cannot join an active match. Host authority passes to a connected seat when the host disconnects. Before a match, the host can remove a disconnected seat; this revokes that seat's token.

During a match disconnected seats remain in the game and use safe defaults. A seat can reconnect at any phase, including results. The host returns results to a fresh lobby for rematch, clearing ready flags and using a new match ID and seed when the next match starts. Actions from the previous match reject even if the auction number is the same.

Rooms are in memory and disappear on server restart. When all seats are offline and no participant action has occurred for 30 minutes, the room expires. Completed logs are held only for the current match; download before starting a rematch.

## Timers and defaults

| Phase | Limit | Default for a missing choice |
| --- | ---: | --- |
| Seller preparation | 60 seconds | Offer the first candidate as-is; no stake |
| Buyer inspection | 30 seconds | Pass inspection; retain token |
| Sealed bid | 45 seconds | Bid 0; pass |
| Reveal | 20 seconds | Advance to next auction/results |

All players may acknowledge a reveal to advance sooner. A deadline is set when a phase begins and is not extended by partial choices. Server time decides expiry. The client countdown is informational.

Timers are prototype controller decisions, not a change to the auction economy. Their duration still needs human playtesting.

## Playtest evidence

The lobby records whether the group uses external voice. At results every participant can download a JSON audit containing roster, playtest mode, seed, accepted actions, inspection events, outcomes, scoring, phase timestamps and defaults. `npm run replay -- path/to/download.json` verifies it with the same replay CLI used for simulations.

No in-app voice, accounts, database or progression is included. The next milestone is human playtesting, with observations about guarantee understanding, waiting, inspection choices, memorable reveals and voluntary rematches.

## Automated validation

`npm run check` runs kernel and room tests, actual local HTTP/WebSocket tests, client typechecking/build and reproducible rule simulations. Network tests require permission to bind localhost if the execution environment uses a restrictive sandbox.

Network coverage includes full 2/3/4-player matches, replayable exports, rematches, recovery of locked bids/inspection findings, rejecting actor spoofing, inaccessible pre-results audits, simultaneous final bid retries, safe defaults and serving only client build assets.
