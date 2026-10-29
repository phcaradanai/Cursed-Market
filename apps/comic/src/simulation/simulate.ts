import { advanceAuction, applyAction, assertEconomy, createGame, replayEvents, scoreFromHistory, scores, viewFor } from "../game/index.js";
import type { Action, GameState, RulesConfig } from "../game/types.js";
import { botDraw, chooseBid, chooseInspection, chooseOffer } from "./bots.js";
import type { Policy } from "./bots.js";
import { isDeepStrictEqual } from "node:util";

export function simulateGame(playerCount: number, seed: string, policies: Policy[], overrides: Partial<RulesConfig> = {}): GameState {
  const playerIds = Array.from({ length: playerCount }, (_, i) => `p${i + 1}`);
  if (policies.length !== playerCount) throw new Error("Each seat needs a policy");
  let state = createGame(playerIds, seed, overrides);
  const policySeed = `${seed}:bot-decisions`; // Independent labelled stream, never used as game seed by bots.
  const act = (action: Action) => { state = applyAction(state, action); assertEconomy(state); };
  while (state.phase !== "RESULTS") {
    const number = state.auction.number;
    const sellerId = state.auction.sellerId;
    const policyFor = (id: string) => policies[playerIds.indexOf(id)]!;
    const draw = (id: string, decision: string) => botDraw(policySeed, number, id, decision);
    const offer = chooseOffer(viewFor(state, sellerId), policyFor(sellerId), draw(sellerId, "offer"));
    act({ type: "offer", requestId: `offer-${number}`, auctionNumber: number, playerId: sellerId, ...offer });
    const buyers = playerIds.filter(id => id !== sellerId);
    for (const playerId of buyers) {
      const attribute = chooseInspection(viewFor(state, playerId), policyFor(playerId), draw(playerId, "inspect"));
      const request = { requestId: `inspect-${number}`, auctionNumber: number, playerId };
      act(attribute === null ? { type: "pass-inspection", ...request } : { type: "inspect", ...request, attribute });
    }
    for (const playerId of buyers) {
      act({ type: "bid", requestId: `bid-${number}`, auctionNumber: number, playerId,
        amount: chooseBid(viewFor(state, playerId), policyFor(playerId), draw(playerId, "bid")) });
    }
    state = advanceAuction(state);
    assertEconomy(state);
  }
  for (const score of scores(state)) {
    if (!isDeepStrictEqual(score, scoreFromHistory(score.playerId, state.history, state.config))) throw new Error("History score disagrees with inventory score");
  }
  // Each simulated game carries an independently replayed proof, not just summary metrics.
  const replay = replayEvents(state.events);
  if (!isDeepStrictEqual(replay, state)) throw new Error("Replay diverged");
  return state;
}
