import { randomAt } from "../game/random.js";
import { relicScore } from "../game/rules.js";
import type { Attribute, GameView, OfferMode } from "../game/types.js";

export const POLICIES = ["cautious", "trusting", "skeptical", "random"] as const;
export type Policy = (typeof POLICIES)[number];

// Bots receive a seat's projected view, never the authoritative state or game seed.
export function chooseOffer(view: GameView, policy: Policy, draw: number): { relicId: string; mode: OfferMode } {
  const candidates = view.private.candidates!;
  const seller = view.players.find(p => p.id === view.private.playerId)!;
  let chosen = candidates[0];
  if (policy === "random") chosen = candidates[draw < 0.5 ? 0 : 1];
  else chosen = [...candidates].sort((a, b) => {
    // Offer worst truth behind an attractive true claim to test misleading guarantees.
    const appeal = (card: typeof a) => (card.genuine ? 8 : !card.cursed ? 5 : 0) + (card.family === view.auction.demand ? 3 : 0) - relicScore(card) * 0.4;
    return appeal(b) - appeal(a);
  })[0]!;
  let mode: OfferMode = "as-is";
  if (seller.coins >= view.config.escrowCoins) {
    if (policy === "random") mode = draw < 1 / 3 ? "as-is" : draw < 2 / 3 ? "genuine" : "uncursed";
    else mode = chosen.genuine ? "genuine" : !chosen.cursed ? "uncursed" : "as-is";
  }
  return { relicId: chosen.id, mode };
}

export function chooseInspection(view: GameView, policy: Policy, draw: number): Attribute | null {
  const actor = view.players.find(p => p.id === view.private.playerId)!;
  if (actor.inspectionTokens === 0) return null;
  const remainingBuyerRounds = view.totalAuctions - view.auction.number + 1;
  // Pace tokens over the match; random policy deliberately inspects earlier.
  if (draw > (policy === "random" ? 0.55 : Math.min(1, actor.inspectionTokens / Math.max(1, remainingBuyerRounds * 0.7)))) return null;
  if (policy === "random") return draw < 0.275 ? "genuine" : "cursed";
  const mode = view.auction.offer!.mode;
  // Probe the property that a truthful certificate leaves unanswered.
  return mode === "genuine" ? "cursed" : "genuine";
}

export function chooseBid(view: GameView, policy: Policy, draw: number): number {
  const actor = view.players.find(p => p.id === view.private.playerId)!;
  if (policy === "random") return draw < 0.2 ? 0 : Math.min(actor.coins, 1 + Math.floor(draw * 12));
  const offer = view.auction.offer!;
  let genuine = view.config.genuineProbability;
  let cursed = view.config.cursedProbability;
  const trust = policy === "trusting" ? 0.95 : policy === "skeptical" ? 0.55 : 0.75;
  if (offer.mode === "genuine") genuine = trust;
  if (offer.mode === "uncursed") cursed = 1 - trust;
  const inspection = view.private.inspection;
  if (inspection?.attribute === "genuine") genuine = inspection.value ? 1 : 0;
  if (inspection?.attribute === "cursed") cursed = inspection.value ? 1 : 0;
  const expectedRelic = 1 + genuine * 8 - cursed * 6 + (offer.relic.family === view.auction.demand ? genuine * view.config.demandBonus : 0);
  const falseChance = offer.mode === "genuine" ? 1 - genuine : offer.mode === "uncursed" ? cursed : 0;
  const expectedValue = expectedRelic + falseChance * view.config.escrowCoins;
  const margin = policy === "cautious" ? 2 : policy === "skeptical" ? 1 : 0.5;
  const competitionJitter = draw * 1.5;
  return Math.min(actor.coins, Math.max(0, Math.floor(expectedValue - margin + competitionJitter)));
}

export function botDraw(policySeed: string, auction: number, playerId: string, decision: string): number {
  return randomAt(policySeed, `${auction}:${playerId}:${decision}`);
}
