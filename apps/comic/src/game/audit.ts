import { isDeepStrictEqual } from "node:util";
import { advanceAuction, applyAction, createGame, RuleError } from "./engine.js";
import type { AuctionResult, Event, GameState, RulesConfig, Score } from "./types.js";
import { marketReserve } from "./run.js";

/** Rebuild only from setup and accepted decisions, then verify all recorded outcomes. */
export function replayEvents(events: Event[]): GameState {
  const first = events[0];
  if (first?.type !== "game-created") throw new RuleError("audit", "Log must begin with game-created");
  let state = createGame(first.playerIds, first.seed, first.config);
  for (const event of events.slice(1)) {
    switch (event.type) {
      case "action-accepted": state = applyAction(state, event.action); break;
      case "auction-started":
        if (state.phase === "REVEAL") state = advanceAuction(state);
        break;
      case "boons-opened": if (state.phase === "REVEAL") state = advanceAuction(state); break;
      case "game-ended": state = advanceAuction(state); break;
    }
  }
  if (!isDeepStrictEqual(state.events, events)) throw new RuleError("audit", "Log outcomes do not match replayed decisions");
  return state;
}

/** Independent score ledger calculated from settled history, without owned inventory. */
export function scoreFromHistory(playerId: string, history: AuctionResult[], config: RulesConfig): Score {
  let coins = config.startingCoins;
  let relicPoints = 0;
  let demandPoints = 0;
  let trustPenalty = 0;
  for (const result of history) {
    const wager = result.wagers?.find(w => w.playerId === playerId);
    if (wager) coins += wager.payout - wager.stake;
    if (result.sellerId === playerId) {
      coins += result.price - result.compensation;
      trustPenalty += result.trustPenalty;
    }
    if (result.winnerId === playerId) {
      coins += result.compensation - result.price;
      relicPoints += result.relicScore;
      demandPoints += result.demandBonus;
    }
  }
  return { playerId, coins, relicPoints, demandPoints, trustPenalty, total: coins + relicPoints + demandPoints - trustPenalty };
}

/** Economy invariants are checked after every simulation action, including escrow. */
export function assertEconomy(state: GameState): void {
  const total = state.players.reduce((sum, player) => {
    if (!Number.isSafeInteger(player.coins) || player.coins < 0) throw new Error("Invalid coin balance");
    const extra = player.boons?.filter(b => b.id === "lens").length ?? 0;
    if (!Number.isSafeInteger(player.inspectionTokens) || player.inspectionTokens < 0 || player.inspectionTokens > state.config.inspectionsPerPlayer + extra) {
      throw new Error("Invalid inspection balance");
    }
    return sum + player.coins;
  }, state.auction.escrow + state.jackpot + state.houseCoins);
  if (![state.jackpot, state.houseCoins].every(value => Number.isSafeInteger(value) && value >= 0)) throw new Error("Invalid market reserve");
  const initialReserve = marketReserve(state.config, state.setups.length);
  if (total !== state.players.length * state.config.startingCoins + initialReserve) throw new Error("Coins were created or destroyed");
  if (state.history.length !== new Set(state.history.map(result => result.auctionNumber)).size) throw new Error("Auction settled twice");
}
