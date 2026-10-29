import { pick, randomAt } from "./random.js";
import { FAMILIES } from "./types.js";
import type { AuctionSetup, GameState, Relic, RulesConfig, Score } from "./types.js";

export const DEFAULT_CONFIG: Readonly<RulesConfig> = Object.freeze({
  startingCoins: 15,
  inspectionsPerPlayer: 2,
  escrowCoins: 2,
  falseCertificatePenalty: 2,
  demandBonus: 3,
  genuineProbability: 0.5,
  cursedProbability: 0.5,
});

export function validateConfig(config: RulesConfig): void {
  for (const key of ["curseWagers", "fastMarket", "rogueRun"] as const) {
    if (config[key] !== undefined && typeof config[key] !== "boolean") throw new Error(`${key} must be boolean`);
  }
  if (config.rogueRun && (!config.curseWagers || !config.fastMarket)) throw new Error("rogueRun requires curseWagers and fastMarket");
  for (const key of ["startingCoins", "inspectionsPerPlayer", "escrowCoins", "falseCertificatePenalty", "demandBonus"] as const) {
    if (!Number.isSafeInteger(config[key]) || config[key] < 0 || config[key] > 1000) {
      throw new Error(`${key} must be a whole number from 0 to 1000`);
    }
  }
  for (const key of ["genuineProbability", "cursedProbability"] as const) {
    if (!Number.isFinite(config[key]) || config[key] < 0 || config[key] > 1) {
      throw new Error(`${key} must be a probability from 0 to 1`);
    }
  }
}

export function relicScore(relic: Pick<Relic, "genuine" | "cursed">): number {
  return (relic.genuine ? 9 : 1) - (relic.cursed ? 6 : 0);
}

export function createSetups(seed: string, playerIds: string[], config: RulesConfig): AuctionSetup[] {
  const count = !config.rogueRun && playerIds.length === 2 ? 8 : playerIds.length * 3;
  return Array.from({ length: count }, (_, index) => {
    const number = index + 1;
    const card = (option: number): Relic => {
      const label = `auction:${number}:option:${option}`;
      const family = pick(FAMILIES, randomAt(seed, `${label}:family`));
      return {
        id: `lot-${number}-${option}`,
        name: `${family} Relic`,
        family,
        genuine: randomAt(seed, `${label}:genuine`) < config.genuineProbability,
        cursed: randomAt(seed, `${label}:cursed`) < config.cursedProbability,
      };
    };
    return {
      number,
      sellerId: playerIds[index % playerIds.length]!,
      demand: pick(FAMILIES, randomAt(seed, `auction:${number}:demand`)),
      candidates: [card(1), card(2)],
    };
  });
}

export function scores(state: GameState): Score[] {
  return state.players.map(player => {
    const relicPoints = player.relics.reduce((sum, relic) => sum + (relic.settledScore ?? relicScore(relic)), 0);
    const demandPoints = player.relics.reduce((sum, relic) => sum + relic.demandBonus, 0);
    const trustPenalty = player.falseCertificates * state.config.falseCertificatePenalty;
    return { playerId: player.id, coins: player.coins, relicPoints, demandPoints, trustPenalty,
      total: player.coins + relicPoints + demandPoints - trustPenalty };
  }).sort((a, b) => b.total - a.total || b.coins - a.coins);
}

export function winnerIds(state: GameState): string[] {
  const ranked = scores(state);
  const best = ranked[0]!;
  return ranked.filter(score => score.total === best.total && score.coins === best.coins).map(score => score.playerId);
}
