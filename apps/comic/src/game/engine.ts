import { randomAt } from "./random.js";
import { createSetups, DEFAULT_CONFIG, relicScore, validateConfig } from "./rules.js";
import { boonBonus, boonOptions, initialRun, marketRelicScore, marketReserve, marketSetups, routeChoices, votedRoute, wagerLimit } from "./run.js";
import type { Action, Auction, AuctionResult, AuctionSetup, GameState, Player, RulesConfig, WagerResult } from "./types.js";

export class RuleError extends Error {
  constructor(public readonly code: string, message: string) { super(message); this.name = "RuleError"; }
}

function requireRule(condition: boolean, code: string, message: string): asserts condition {
  if (!condition) throw new RuleError(code, message);
}

function auctionFrom(setup: AuctionSetup): Auction {
  return { ...setup, offer: null, escrow: 0, inspections: [], bids: [] };
}

export function createGame(playerIds: string[], seed: string, overrides: Partial<RulesConfig> = {}): GameState {
  requireRule(playerIds.length >= 2 && playerIds.length <= 4, "player-count", "A match needs 2–4 players");
  requireRule(new Set(playerIds).size === playerIds.length && playerIds.every(id => typeof id === "string" && /^[a-zA-Z0-9_-]{1,32}$/.test(id)),
    "player-ids", "Player IDs must be unique nonempty identifiers of up to 32 characters");
  requireRule(typeof seed === "string" && seed.length > 0, "seed", "A server seed is required");
  const config = { ...DEFAULT_CONFIG, ...overrides };
  validateConfig(config);
  const setups = createSetups(seed, playerIds, config);
  const auction = auctionFrom(setups[0]!);
  return {
    seed, config, phase: config.rogueRun ? "ROUTE_CHOICE" : "SELLER_PREP", revision: 0,
    players: playerIds.map(id => ({ id, coins: config.startingCoins, inspectionTokens: config.inspectionsPerPlayer, falseCertificates: 0, relics: [], ...(config.rogueRun ? { boons: [] } : {}) })),
    setups, auction, history: [], acceptedActions: [],
    jackpot: config.curseWagers && !config.rogueRun ? 2 : 0,
    houseCoins: marketReserve(config, setups.length) - (config.curseWagers && !config.rogueRun ? 2 : 0),
    ...(config.rogueRun ? { run: initialRun(seed) } : {}),
    events: [{ type: "game-created", seed, playerIds: [...playerIds], config: { ...config } },
      ...(config.rogueRun ? [{ type: "route-opened" as const, stage: 1, auctionNumber: 1 }] :
        [{ type: "auction-started" as const, auctionNumber: auction.number, sellerId: auction.sellerId, demand: auction.demand }])],
  };
}

function player(state: GameState, id: string): Player {
  const found = state.players.find(p => p.id === id);
  requireRule(Boolean(found), "unknown-player", "Player does not occupy a seat");
  return found!;
}

export function buyerIds(state: GameState): string[] {
  return state.players.filter(p => p.id !== state.auction.sellerId).map(p => p.id);
}

function copyState(state: GameState): GameState {
  return {
    ...state,
    players: state.players.map(p => ({ ...p, relics: [...p.relics], ...(p.boons ? { boons: [...p.boons] } : {}) })),
    setups: [...state.setups],
    ...(state.run ? { run: structuredClone(state.run) } : {}),
    auction: { ...state.auction, inspections: [...state.auction.inspections], bids: [...state.auction.bids] },
    history: [...state.history], events: [...state.events], acceptedActions: [...state.acceptedActions],
  };
}

/** Stable semantic identity for retries, independent of JSON key ordering. */
function actionKey(action: Action): string {
  const base = [action.type, action.playerId, action.auctionNumber];
  switch (action.type) {
    case "offer": return JSON.stringify([...base, action.relicId, action.mode]);
    case "inspect": return JSON.stringify([...base, action.attribute]);
    case "bid": return JSON.stringify([...base, action.amount, action.wager?.cursed ?? null, action.wager?.stake ?? 0]);
    case "pass-inspection": return JSON.stringify(base);
    case "vote-route": return JSON.stringify([...base, action.nodeId]);
    case "choose-boon": return JSON.stringify([...base, action.boonId]);
    default: throw new RuleError("action-type", "Unknown action type");
  }
}

/** Pure reducer. The future room server must bind playerId to the authenticated seat. */
export function applyAction(state: GameState, action: Action): GameState {
  requireRule(typeof action.requestId === "string" && action.requestId.length > 0 && action.requestId.length <= 128,
    "request-id", "A request ID of 1–128 characters is required");
  player(state, action.playerId);
  const key = actionKey(action);
  const previous = state.acceptedActions.find(a => a.playerId === action.playerId && a.requestId === action.requestId);
  if (previous) {
    requireRule(actionKey(previous) === key, "request-conflict", "Request ID was already used for another action");
    return state;
  }
  requireRule(action.auctionNumber === state.auction.number, "stale-auction", "Action belongs to a different auction");
  const next = copyState(state);
  const actor = player(next, action.playerId);
  const auction = next.auction;
  switch (action.type) {
    case "vote-route": {
      requireRule(next.phase === "ROUTE_CHOICE" && !!next.run, "phase", "Choose a route at the current frontier");
      requireRule(!next.run!.votes.some(v => v.playerId === actor.id), "route-locked", "Route vote is already locked");
      requireRule(action.nodeId === null || next.run!.routeChoices.some(n => n.id === action.nodeId), "route-id", "Choose one of the three offered routes");
      next.run!.votes.push({ playerId: actor.id, nodeId: action.nodeId });
      break;
    }
    case "choose-boon": {
      requireRule(next.phase === "BOON_CHOICE" && !!next.run, "phase", "Choose a boon between markets");
      requireRule(!next.run!.boonPicks.some(p => p.playerId === actor.id), "boon-locked", "Boon choice is already locked");
      const boon = next.run!.boonOffers.find(o => o.playerId === actor.id)!.options.find(b => b.id === action.boonId);
      requireRule(action.boonId === null || !!boon, "boon-id", "Choose a boon from your own three offers");
      if (boon) {
        actor.boons!.push({ ...boon });
        if (boon.id === "lens") actor.inspectionTokens += 1;
      }
      next.run!.boonPicks.push({ playerId: actor.id, boonId: action.boonId });
      break;
    }
    case "offer": {
      requireRule(next.phase === "SELLER_PREP", "phase", "An offer can only be prepared before inspection");
      requireRule(actor.id === auction.sellerId, "seller-only", "Only the seller can prepare an offer");
      requireRule(["as-is", "genuine", "uncursed"].includes(action.mode), "offer-mode", "Unknown guarantee");
      const relic = auction.candidates.find(card => card.id === action.relicId);
      requireRule(Boolean(relic), "relic-id", "Choose one of the seller's two relics");
      const stake = action.mode === "as-is" ? 0 : next.config.escrowCoins;
      requireRule(actor.coins >= stake, "escrow", "Not enough coins for the guarantee stake");
      actor.coins -= stake;
      auction.escrow = stake;
      auction.offer = { relic: relic!, mode: action.mode };
      next.phase = next.config.fastMarket ? "SEALED_BID" : "BUYER_INSPECTION";
      break;
    }
    case "inspect":
    case "pass-inspection": {
      requireRule(next.phase === "BUYER_INSPECTION" || (next.config.fastMarket && next.phase === "SEALED_BID") === true,
        "phase", "Inspection choices must precede your sealed bid");
      requireRule(actor.id !== auction.sellerId, "buyer-only", "The seller cannot inspect or bid");
      requireRule(!auction.bids.some(b => b.playerId === actor.id), "bid-locked", "Inspect before locking your bid");
      requireRule(!auction.inspections.some(i => i.playerId === actor.id), "inspection-locked", "Inspection choice is already locked");
      if (action.type === "inspect") {
        requireRule(action.attribute === "genuine" || action.attribute === "cursed", "attribute", "Choose authenticity or curse status");
        requireRule(actor.inspectionTokens > 0, "inspection-tokens", "No inspection tokens remain");
        actor.inspectionTokens -= 1;
        const inspection = { playerId: actor.id, attribute: action.attribute, value: auction.offer!.relic[action.attribute] };
        auction.inspections.push(inspection);
        next.events.push({ type: "inspected", auctionNumber: auction.number, inspection });
      } else auction.inspections.push({ playerId: actor.id, attribute: null, value: null });
      if (!next.config.fastMarket && auction.inspections.length === next.players.length - 1) next.phase = "SEALED_BID";
      break;
    }
    case "bid": {
      requireRule(next.phase === "SEALED_BID", "phase", "Bids can only be submitted after all inspection choices lock");
      requireRule(actor.id !== auction.sellerId, "buyer-only", "The seller cannot bid");
      requireRule(!auction.bids.some(b => b.playerId === actor.id), "bid-locked", "Bid is already locked");
      const wager = action.wager;
      if (wager !== undefined) {
        requireRule(next.config.curseWagers === true, "wager-disabled", "Curse wagers are not enabled in this match");
        requireRule(wager !== null && typeof wager.cursed === "boolean" && Number.isSafeInteger(wager.stake) && wager.stake >= 1 && wager.stake <= wagerLimit(actor),
          "wager-stake", `A curse wager needs a prediction and 1–${wagerLimit(actor)} coins`);
      }
      const reserved = wager?.stake ?? 0;
      requireRule(Number.isSafeInteger(action.amount) && action.amount >= 0 && action.amount + reserved <= actor.coins,
        "bid-amount", "Bid plus wager must fit your available coins");
      if (next.config.fastMarket && !auction.inspections.some(i => i.playerId === actor.id)) {
        auction.inspections.push({ playerId: actor.id, attribute: null, value: null });
      }
      // Keep balances unchanged until reveal: deduction here would leak the sealed stake.
      auction.bids.push({ playerId: actor.id, amount: action.amount, ...(wager ? { wager: { ...wager } } : {}) });
      break;
    }
  }
  // Accept before settlement so replay observes the same event order.
  const storedAction = structuredClone(action);
  next.acceptedActions.push(storedAction);
  next.events.push({ type: "action-accepted", action: storedAction });
  next.revision += 1;
  if (next.phase === "ROUTE_CHOICE" && next.run!.votes.length === next.players.length) {
    const node = votedRoute(next);
    next.run!.market = node;
    next.run!.path.push(node);
    for (const setup of marketSetups(next, node)) next.setups[setup.number - 1] = setup;
    next.auction = auctionFrom(next.setups[next.auction.number - 1]!);
    next.houseCoins -= node.ante;
    next.jackpot += node.ante;
    next.phase = "SELLER_PREP";
    next.events.push({ type: "route-selected", stage: next.run!.stage, node: { ...node },
      votes: next.players.map(p => ({ ...next.run!.votes.find(v => v.playerId === p.id)! })) });
    next.events.push({ type: "auction-started", auctionNumber: next.auction.number, sellerId: next.auction.sellerId, demand: next.auction.demand });
  }
  if (next.phase === "BOON_CHOICE" && next.run!.boonPicks.length === next.players.length) {
    next.run!.stage += 1;
    next.run!.market = null;
    next.run!.votes = [];
    next.run!.boonOffers = [];
    next.run!.boonPicks = [];
    next.run!.routeChoices = routeChoices(next.seed, next.run!);
    next.phase = "ROUTE_CHOICE";
    next.events.push({ type: "route-opened", stage: next.run!.stage, auctionNumber: next.auction.number });
  }
  if (next.phase === "SEALED_BID" && auction.bids.length === next.players.length - 1) settle(next);
  return next;
}

/** Internal, called once by the reducer accepting the last bid. */
function settle(state: GameState): void {
  const auction = state.auction;
  const { relic, mode } = auction.offer!;
  // Seat order, never packet arrival order, defines the tie candidate list.
  const bids = buyerIds(state).map(id => ({ ...auction.bids.find(b => b.playerId === id)! }));
  const price = Math.max(...bids.map(b => b.amount));
  const tiedPlayerIds = price > 0 ? bids.filter(b => b.amount === price).map(b => b.playerId) : [];
  const tieIndex = tiedPlayerIds.length > 1 ? Math.floor(randomAt(state.seed, `auction:${auction.number}:tie`) * tiedPlayerIds.length) : null;
  const winnerId = tiedPlayerIds.length > 0 ? tiedPlayerIds[tieIndex ?? 0]! : null;
  const seller = player(state, auction.sellerId);
  const truth = mode === "genuine" ? relic.genuine : !relic.cursed;
  const certificate = winnerId === null ? "unsold" : mode === "as-is" ? "none" : truth ? "true" : "false";
  const compensation = certificate === "false" ? auction.escrow : 0;
  const escrowReturned = auction.escrow - compensation;
  const trustPenalty = certificate === "false" ? state.config.falseCertificatePenalty : 0;
  const node = state.run?.market;
  const bonus = winnerId !== null && relic.genuine && relic.family === auction.demand ? (node?.demandBonus ?? state.config.demandBonus) : 0;
  const buildBonus = winnerId !== null && node ? boonBonus(relic, node, player(state, winnerId)) : 0;
  const settledScore = winnerId === null ? 0 : (node ? marketRelicScore(relic, node) : relicScore(relic)) + buildBonus;
  const potBefore = state.jackpot;
  const wagers: WagerResult[] = [];
  if (state.config.curseWagers) {
    for (const bid of bids) if (bid.wager) {
      player(state, bid.playerId).coins -= bid.wager.stake;
      state.jackpot += bid.wager.stake;
      wagers.push({ playerId: bid.playerId, ...bid.wager, correct: bid.wager.cursed === relic.cursed, payout: 0 });
    }
    const winners = wagers.filter(w => w.correct);
    if (winners.length > 0) {
      const pot = state.jackpot;
      const weight = winners.reduce((sum, w) => sum + w.stake, 0);
      for (const wager of winners) wager.payout = Math.floor(pot * wager.stake / weight);
      let remainder = pot - winners.reduce((sum, w) => sum + w.payout, 0);
      const offset = Math.floor(randomAt(state.seed, `auction:${auction.number}:wager-remainder`) * winners.length);
      const order = winners.map((w, index) => ({ w, index })).sort((a, b) =>
        (pot * b.w.stake % weight) - (pot * a.w.stake % weight) ||
        (a.index - offset + winners.length) % winners.length - (b.index - offset + winners.length) % winners.length);
      for (const { w } of order) if (remainder-- > 0) w.payout += 1;
      for (const wager of winners) player(state, wager.playerId).coins += wager.payout;
      state.jackpot = 0;
    }
  }
  seller.coins += price + escrowReturned;
  if (winnerId !== null) {
    const winner = player(state, winnerId);
    winner.coins += compensation - price;
    winner.relics.push({ ...relic, auctionNumber: auction.number, demandBonus: bonus, ...(node ? { settledScore } : {}) });
    if (certificate === "false") seller.falseCertificates += 1;
  }
  const result: AuctionResult = {
    auctionNumber: auction.number, sellerId: seller.id, demand: auction.demand, relic: { ...relic }, mode, bids,
    winnerId, price, tiedPlayerIds, tieIndex, certificate, escrowReturned, compensation, trustPenalty,
    relicScore: settledScore, demandBonus: bonus,
    ...(state.config.curseWagers ? { wagers, potBefore, potAfter: state.jackpot } : {}),
    ...(node ? { marketId: node.id, buildBonus } : {}),
  };
  auction.escrow = 0;
  state.history.push(result);
  state.events.push({ type: "auction-settled", result });
  state.phase = "REVEAL";
}

/** Server/controller transition after showing reveal; not a client action. */
export function advanceAuction(state: GameState): GameState {
  requireRule(state.phase === "REVEAL", "phase", "Only a resolved auction can advance");
  const next = copyState(state);
  next.revision += 1;
  if (next.auction.number === next.setups.length) {
    next.houseCoins += next.jackpot;
    next.jackpot = 0;
    next.phase = "RESULTS";
    next.events.push({ type: "game-ended" });
  } else {
    next.auction = auctionFrom(next.setups[next.auction.number]!);
    if (next.run && state.auction.number % next.players.length === 0) {
      next.run.boonPicks = [];
      next.run.boonOffers = next.players.map(p => ({ playerId: p.id, options: boonOptions(next, p) }));
      next.phase = "BOON_CHOICE";
      next.events.push({ type: "boons-opened", stage: next.run.stage, auctionNumber: next.auction.number });
    } else {
      if (next.config.curseWagers) { const ante = next.run?.market?.ante ?? 2; next.houseCoins -= ante; next.jackpot += ante; }
      next.phase = "SELLER_PREP";
      next.events.push({ type: "auction-started", auctionNumber: next.auction.number, sellerId: next.auction.sellerId, demand: next.auction.demand });
    }
  }
  return next;
}
