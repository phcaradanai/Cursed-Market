import { isDeepStrictEqual } from "node:util";
import { assertEconomy, replayEvents, scores, winnerIds } from "../game/index.js";
import type { Phase } from "../game/types.js";
import type { MatchAudit } from "../shared/protocol.js";

const phases = ["ROUTE_CHOICE", "BOON_CHOICE", "SELLER_PREP", "BUYER_INSPECTION", "SEALED_BID", "REVEAL"] as const;
function requireValue(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`Invalid match audit: ${message}`);
}
const ratio = (numerator: number, denominator: number) => ({ numerator, denominator, value: denominator === 0 ? null : numerator / denominator });

/** Match logs explain recorded choices; they cannot establish who played or whether anyone enjoyed them. */
export function analyseMatchAudit(input: unknown) {
  requireValue(input !== null && typeof input === "object" && !Array.isArray(input), "expected an exported match object");
  const audit = input as MatchAudit;
  requireValue(audit.schemaVersion === 1 && typeof audit.matchId === "string" && audit.matchId.length > 0, "missing schemaVersion or matchId");
  requireValue(audit.playtestMode === "voice" || audit.playtestMode === "no-voice", "invalid playtest mode");
  requireValue(Array.isArray(audit.events) && Array.isArray(audit.seats) && Array.isArray(audit.timeouts) && Array.isArray(audit.phaseTimes), "missing log arrays");
  requireValue(Number.isFinite(audit.startedAt) && Number.isFinite(audit.endedAt) && audit.endedAt >= audit.startedAt, "invalid match timestamps");

  const state = replayEvents(audit.events);
  const auctionPhases = phases.filter(phase => phase !== "ROUTE_CHOICE" && phase !== "BOON_CHOICE" && (!state.config.fastMarket || phase !== "BUYER_INSPECTION"));
  const expectedPhaseKeys = state.events.flatMap(event => event.type === "auction-started" ? auctionPhases.map(phase => `${event.auctionNumber}:${phase}`)
    : event.type === "route-opened" ? [`${event.auctionNumber}:ROUTE_CHOICE`]
    : event.type === "boons-opened" ? [`${event.auctionNumber}:BOON_CHOICE`] : []);
  requireValue(state.phase === "RESULTS", "match is not complete");
  assertEconomy(state);
  requireValue(isDeepStrictEqual(audit.scores, scores(state)), "stored scores disagree with replay");
  requireValue(isDeepStrictEqual(audit.winnerIds, winnerIds(state)), "stored winners disagree with replay");
  requireValue(audit.seats.every(s => s && typeof s.id === "string" && typeof s.name === "string") &&
    isDeepStrictEqual(audit.seats.map(s => s.id), state.players.map(p => p.id)), "roster disagrees with replay");

  const phaseKeys = new Set<string>();
  let previousEnd = audit.startedAt;
  for (const [index, timing] of audit.phaseTimes.entries()) {
    requireValue(timing && Number.isInteger(timing.auctionNumber) && timing.auctionNumber >= 1 && timing.auctionNumber <= state.history.length &&
      phases.includes(timing.phase as typeof phases[number]), "invalid phase timing");
    const key = `${timing.auctionNumber}:${timing.phase}`;
    requireValue(!phaseKeys.has(key), "duplicate phase timing");
    requireValue(expectedPhaseKeys[index] === key, "phase timing order disagrees with replay");
    phaseKeys.add(key);
    requireValue(Number.isFinite(timing.startedAt) && Number.isFinite(timing.endedAt) && timing.startedAt >= previousEnd &&
      timing.endedAt >= timing.startedAt && timing.endedAt <= audit.endedAt, "phase timestamps are out of order");
    previousEnd = timing.endedAt;
  }
  requireValue(phaseKeys.size === expectedPhaseKeys.length, "missing phase timing");

  const defaultKeys = new Set<string>();
  for (const timeout of audit.timeouts) {
    requireValue(timeout && Number.isInteger(timeout.auctionNumber) && timeout.auctionNumber >= 1 && timeout.auctionNumber <= state.history.length &&
      phaseKeys.has(`${timeout.auctionNumber}:${timeout.phase}`), "invalid timeout");
    const timing = audit.phaseTimes.find(t => t.auctionNumber === timeout.auctionNumber && t.phase === timeout.phase)!;
    requireValue(Number.isFinite(timeout.at) && timeout.at >= timing.startedAt && timeout.at <= timing.endedAt, "timeout is outside its phase");
    const key = `${timeout.auctionNumber}:${timeout.phase}:${timeout.playerId}`;
    requireValue(!defaultKeys.has(key), "duplicate timeout");
    defaultKeys.add(key);
    const action = state.acceptedActions.find(a => a.auctionNumber === timeout.auctionNumber && a.playerId === timeout.playerId &&
      (timeout.phase === "ROUTE_CHOICE" ? a.type === "vote-route" : timeout.phase === "BOON_CHOICE" ? a.type === "choose-boon" :
        timeout.phase === "SELLER_PREP" ? a.type === "offer" : timeout.phase === "BUYER_INSPECTION" ? a.type === "pass-inspection" : a.type === "bid"));
    requireValue(timeout.phase === "REVEAL" ? timeout.playerId === null : action &&
      (action.type === "offer" ? action.mode === "as-is" && action.relicId === state.setups[timeout.auctionNumber - 1]!.candidates[0].id :
        action.type === "bid" ? action.amount === 0 && !action.wager : action.type === "vote-route" ? action.nodeId === null :
        action.type === "choose-boon" ? action.boonId === null : action.type === "pass-inspection"), "timeout disagrees with its safe default action");
  }

  const isDefault = (auction: number, phase: Phase, id: string) => defaultKeys.has(`${auction}:${phase}:${id}`);
  const bidChoices = state.acceptedActions.filter(a => a.type === "bid");
  const manualBids = bidChoices.filter(a => !isDefault(a.auctionNumber, "SEALED_BID", a.playerId));
  const sold = state.history.filter(r => r.winnerId !== null);
  const totalCoins = state.players.reduce((sum, p) => sum + p.coins, 0);
  return {
    matchId: audit.matchId,
    rulesVersion: state.config.rogueRun ? "0.3-roguelike-experimental" : state.config.curseWagers ? "0.2-experimental" : "0.1",
    run: state.run ? {
      path: state.run.path.map(n => ({ id: n.id, name: n.name, demand: n.demand, cursedProbability: n.cursedProbability, ante: n.ante })),
      builds: state.players.map(p => ({ playerId: p.id, boons: p.boons })),
      routeVotes: state.acceptedActions.filter(a => a.type === "vote-route").length,
    } : null,
    playtestMode: audit.playtestMode,
    playerCount: state.players.length,
    recordedDurationSeconds: (audit.endedAt - audit.startedAt) / 1000,
    auctions: state.history.length,
    sold: ratio(sold.length, state.history.length),
    averageWinningBid: sold.length === 0 ? null : sold.reduce((sum, r) => sum + r.price, 0) / sold.length,
    highestBidTies: ratio(sold.filter(r => r.tiedPlayerIds.length > 1).length, sold.length),
    manualPassBids: ratio(manualBids.filter(a => a.type === "bid" && a.amount === 0).length, manualBids.length),
    defaultBidCount: bidChoices.length - manualBids.length,
    curseWagers: {
      count: state.history.reduce((sum, r) => sum + (r.wagers?.length ?? 0), 0),
      totalStaked: state.history.reduce((sum, r) => sum + (r.wagers?.reduce((n, w) => n + w.stake, 0) ?? 0), 0),
      correct: state.history.reduce((sum, r) => sum + (r.wagers?.filter(w => w.correct).length ?? 0), 0),
      largestPot: Math.max(0, ...state.history.map(r => (r.potBefore ?? 0) + (r.wagers?.reduce((sum, w) => sum + w.stake, 0) ?? 0))),
      unclaimedAtEnd: state.history.at(-1)?.potAfter ?? 0,
    },
    richestFinalCoinShare: ratio(Math.max(...state.players.map(p => p.coins)), totalCoins),
    truthfulGenuineButCursedSales: sold.filter(r => r.mode === "genuine" && r.relic.genuine && r.relic.cursed).length,
    timeoutsByPhase: Object.fromEntries(phases.map(phase => [phase, audit.timeouts.filter(t => t.phase === phase).length])),
    phaseSeconds: Object.fromEntries(phases.map(phase => {
      const times = audit.phaseTimes.filter(t => t.phase === phase).map(t => (t.endedAt - t.startedAt) / 1000);
      return [phase, { mean: times.length ? times.reduce((sum, t) => sum + t, 0) / times.length : null, max: times.length ? Math.max(...times) : null }];
    })),
    players: state.players.map(player => {
      const manual = state.acceptedActions.filter(a => a.playerId === player.id && !isDefault(a.auctionNumber,
        a.type === "vote-route" ? "ROUTE_CHOICE" : a.type === "choose-boon" ? "BOON_CHOICE" :
          a.type === "offer" ? "SELLER_PREP" : a.type === "bid" ? "SEALED_BID" : "BUYER_INSPECTION", player.id));
      const offers = manual.filter(a => a.type === "offer");
      const bids = manual.filter(a => a.type === "bid");
      return {
        playerId: player.id,
        finalScore: scores(state).find(s => s.playerId === player.id)!.total,
        finalCoins: player.coins,
        inspectionTokensUnused: player.inspectionTokens,
        manualOffers: Object.fromEntries(["as-is", "genuine", "uncursed"].map(mode => [mode, offers.filter(a => a.type === "offer" && a.mode === mode).length])),
        manualInspectionChoices: {
          genuine: manual.filter(a => a.type === "inspect" && a.attribute === "genuine").length,
          cursed: manual.filter(a => a.type === "inspect" && a.attribute === "cursed").length,
          pass: manual.filter(a => a.type === "pass-inspection").length,
        },
        manualBidChoices: { positive: bids.filter(a => a.type === "bid" && a.amount > 0).length, pass: bids.filter(a => a.type === "bid" && a.amount === 0).length },
        defaultChoices: audit.timeouts.filter(t => t.playerId === player.id).length,
        falseCertificates: player.falseCertificates,
      };
    }),
  };
}

export function analyseMatchAudits(inputs: unknown[]) {
  const matches = inputs.map(analyseMatchAudit);
  requireValue(matches.length > 0, "provide at least one downloaded match");
  requireValue(new Set(matches.map(m => m.matchId)).size === matches.length, "the same match was supplied more than once");
  return {
    schemaVersion: 1,
    evidenceKind: "match-logs-only",
    limitation: "Logs do not establish human participation, understanding, engagement, enjoyment, or voluntary rematches. Collect the observer worksheet separately.",
    humanFunValidated: false,
    voluntaryRematchRate: null,
    matches,
  };
}
