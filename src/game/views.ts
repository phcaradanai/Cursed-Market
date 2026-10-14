import { scores, winnerIds } from "./rules.js";
import { RuleError } from "./engine.js";
import type { GameState, GameView, PublicRelic } from "./types.js";

/** Allowlist projection, freshly copied; safe payload for exactly one occupied seat. */
export function viewFor(state: GameState, playerId: string): GameView {
  if (!state.players.some(p => p.id === playerId)) throw new RuleError("unknown-player", "Unknown seat");
  const { auction } = state;
  const relic = auction.offer?.relic;
  const publicRelic: PublicRelic | null = relic ? { id: relic.id, name: relic.name, family: relic.family } : null;
  return structuredClone({
    phase: state.phase,
    revision: state.revision,
    config: state.config,
    totalAuctions: state.setups.length,
    players: state.players,
    jackpot: state.jackpot,
    ...(state.run ? { run: {
      stage: state.run.stage, totalStages: state.run.totalStages, path: state.run.path, market: state.run.market,
      routeChoices: state.phase === "ROUTE_CHOICE" ? state.run.routeChoices : [],
      voteReady: state.run.votes.map(v => v.playerId), boonReady: state.run.boonPicks.map(p => p.playerId),
    } } : {}),
    auction: {
      number: auction.number,
      sellerId: auction.sellerId,
      demand: auction.demand,
      offer: publicRelic && auction.offer ? { relic: publicRelic, mode: auction.offer.mode } : null,
      escrow: auction.escrow,
      inspectionReady: auction.inspections.map(i => i.playerId),
      bidReady: auction.bids.map(b => b.playerId),
    },
    history: state.history,
    private: {
      playerId,
      candidates: playerId === auction.sellerId && ["SELLER_PREP", "BUYER_INSPECTION", "SEALED_BID", "REVEAL"].includes(state.phase) ? auction.candidates : null,
      inspection: auction.inspections.find(i => i.playerId === playerId) ?? null,
      bid: auction.bids.find(b => b.playerId === playerId) ?? null,
      ...(state.run ? {
        routeVote: state.run.votes.find(v => v.playerId === playerId) ? { nodeId: state.run.votes.find(v => v.playerId === playerId)!.nodeId } : null,
        boonOptions: state.phase === "BOON_CHOICE" ? state.run.boonOffers.find(o => o.playerId === playerId)?.options ?? [] : [],
        boonPick: state.run.boonPicks.find(p => p.playerId === playerId) ? { boonId: state.run.boonPicks.find(p => p.playerId === playerId)!.boonId } : null,
      } : {}),
    },
    results: state.phase === "RESULTS" ? {
      scores: scores(state), winnerIds: winnerIds(state), seed: state.seed,
      inspections: state.events.flatMap(event => event.type === "inspected" ? [{ auctionNumber: event.auctionNumber, inspection: event.inspection }] : []),
    } : null,
  });
}
