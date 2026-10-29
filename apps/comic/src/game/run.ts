import { pick, randomAt } from "./random.js";
import { FAMILIES } from "./types.js";
import type { AuctionSetup, Boon, GameState, MarketNode, Player, Relic, RulesConfig, RunState } from "./types.js";

const MARKETS: Omit<MarketNode, "id" | "demand">[] = [
  { name: "วิหารชำระล้าง", description: "ของแท้บ่อย คำสาปน้อย แต่กำไรและกองกลางต่ำ", genuineProbability: .85, cursedProbability: .15, genuineValue: 8, fakeValue: 1, cursePenalty: 6, demandBonus: 2, ante: 1 },
  { name: "ตลาดมืด", description: "ของแท้หายากแต่มีค่าสูง ต้องอ่านคำรับประกันให้ดี", genuineProbability: .35, cursedProbability: .55, genuineValue: 14, fakeValue: 0, cursePenalty: 7, demandBonus: 3, ante: 2 },
  { name: "สุสานนักสะสม", description: "คำสาปหนัก ของแท้ราคาแพง และกองกลางสูง", genuineProbability: .70, cursedProbability: .85, genuineValue: 14, fakeValue: 1, cursePenalty: 10, demandBonus: 5, ante: 4 },
  { name: "หอประมูล", description: "โบนัสวัตถุที่ตลาดต้องการสูง เลือกเก็บประเภทให้ตรง", genuineProbability: .55, cursedProbability: .35, genuineValue: 9, fakeValue: 3, cursePenalty: 5, demandBonus: 8, ante: 2 },
  { name: "ตรอกของเลียนแบบ", description: "ของปลอมมากและยังมีค่า ของแท้พบยากแต่ให้แต้มสูง", genuineProbability: .25, cursedProbability: .25, genuineValue: 16, fakeValue: 4, cursePenalty: 6, demandBonus: 2, ante: 1 },
  { name: "งานวัดเสี่ยงโชค", description: "กองกลางสูง โอกาสคำสาปผันผวน ต้องแบ่งทุนให้พอ", genuineProbability: .50, cursedProbability: .50, genuineValue: 11, fakeValue: 1, cursePenalty: 8, demandBonus: 4, ante: 4 },
];

const BOONS: Boon[] = [
  { id: "curse-eater", name: "ผู้กลืนคำสาป", description: "ของที่ซื้อต่อจากนี้: คำสาปเปลี่ยนจากหักแต้มเป็น +2 แต่ของแท้ทุกชิ้นลด 3 แต้ม" },
  { id: "authenticity", name: "นักสะสมของแท้", description: "ของแท้ที่ซื้อต่อจากนี้เพิ่ม 4 แต้ม" },
  { id: "counterfeit", name: "ราชาของเลียนแบบ", description: "ของปลอมที่ซื้อต่อจากนี้เพิ่ม 6 แต้ม" },
  { id: "high-roller", name: "นักเดิมพัน", description: "วงเงินเดิมพันคำสาปเพิ่มจาก 3 เป็น 5 เหรียญ เสี่ยงเสียทุนได้มากขึ้น" },
  { id: "lens", name: "เลนส์ชั่วคราว", description: "รับสิทธิ์ตรวจเพิ่ม 1 ครั้งทันที" },
  { id: "specialist", name: "นักสะสมเฉพาะทาง", description: "วัตถุประเภทที่ระบุซึ่งซื้อต่อจากนี้เพิ่ม 5 แต้ม ทั้งแท้และปลอม" },
];

function routeSalt(run: Pick<RunState, "stage" | "path">): string {
  return `run:${run.stage}:${run.path.map(n => n.id).join("/")}`;
}

/** Only the current frontier is exposed; the seed and future branches remain server-only. */
export function routeChoices(seed: string, run: Pick<RunState, "stage" | "path">): MarketNode[] {
  const salt = routeSalt(run);
  return MARKETS.map((market, index) => ({ market, index, order: randomAt(seed, `${salt}:branch:${index}`) }))
    .sort((a, b) => a.order - b.order || a.index - b.index).slice(0, 3).map(({ market, index }) => {
      const drift = pick([-.10, 0, .10], randomAt(seed, `${salt}:${index}:weather`));
      return { ...market, id: `${run.stage}-${index}`, demand: pick(FAMILIES, randomAt(seed, `${salt}:${index}:demand`)),
        cursedProbability: Math.round(Math.min(.95, Math.max(.05, market.cursedProbability + drift)) * 100) / 100 };
    });
}

export function initialRun(seed: string): RunState {
  const run: RunState = { stage: 1, totalStages: 3, path: [], market: null, routeChoices: [], votes: [], boonOffers: [], boonPicks: [] };
  run.routeChoices = routeChoices(seed, run);
  return run;
}

/** Majority vote; ties use seed order, never packet order. All abstentions choose lowest curse risk. */
export function votedRoute(state: GameState): MarketNode {
  const run = state.run!;
  const counts = run.routeChoices.map(node => ({ node, count: run.votes.filter(v => v.nodeId === node.id).length }));
  const most = Math.max(...counts.map(c => c.count));
  if (most === 0) return [...run.routeChoices].sort((a, b) => a.cursedProbability - b.cursedProbability || a.ante - b.ante || a.id.localeCompare(b.id))[0]!;
  const tied = counts.filter(c => c.count === most).map(c => c.node).sort((a, b) => a.id.localeCompare(b.id));
  return pick(tied, randomAt(state.seed, `${routeSalt(run)}:vote-tie`));
}

export function marketSetups(state: GameState, node: MarketNode): AuctionSetup[] {
  const salt = `${routeSalt(state.run!)}:${node.id}`;
  const first = (state.run!.stage - 1) * state.players.length;
  return state.players.map((seller, index) => {
    const number = first + index + 1;
    const card = (option: number): Relic => ({ id: `lot-${number}-${option}`, name: "Relic", family: pick(FAMILIES, randomAt(state.seed, `${salt}:${number}:${option}:family`)),
      genuine: randomAt(state.seed, `${salt}:${number}:${option}:genuine`) < node.genuineProbability,
      cursed: randomAt(state.seed, `${salt}:${number}:${option}:cursed`) < node.cursedProbability });
    const candidates: [Relic, Relic] = [card(1), card(2)];
    candidates.forEach(c => { c.name = `${c.family} Relic`; });
    return { number, sellerId: seller.id, demand: node.demand, candidates };
  });
}

export function boonOptions(state: GameState, player: Player): Boon[] {
  const salt = `${routeSalt(state.run!)}:boons:${player.id}`;
  return BOONS.filter(b => !player.boons?.some(owned => owned.id === b.id))
    .map(boon => ({ boon, order: randomAt(state.seed, `${salt}:${boon.id}`) }))
    .sort((a, b) => a.order - b.order || a.boon.id.localeCompare(b.boon.id)).slice(0, 3)
    .map(({ boon }) => ({ ...boon, ...(boon.id === "specialist" ? { family: pick(FAMILIES, randomAt(state.seed, `${salt}:family`)) } : {}) }));
}

export function wagerLimit(player: Player): number {
  return player.boons?.some(b => b.id === "high-roller") ? 5 : 3;
}

export function marketRelicScore(relic: Relic, node: MarketNode): number {
  return (relic.genuine ? node.genuineValue : node.fakeValue) - (relic.cursed ? node.cursePenalty : 0);
}

export function boonBonus(relic: Relic, node: MarketNode, player: Player): number {
  return (player.boons ?? []).reduce((sum, boon) => sum + (
    boon.id === "curse-eater" ? (relic.cursed ? node.cursePenalty + 2 : 0) - (relic.genuine ? 3 : 0) :
    boon.id === "authenticity" && relic.genuine ? 4 :
    boon.id === "counterfeit" && !relic.genuine ? 6 :
    boon.id === "specialist" && relic.family === boon.family ? 5 : 0), 0);
}

export function marketReserve(config: RulesConfig, auctionCount: number): number {
  return config.curseWagers ? auctionCount * (config.rogueRun ? 4 : 2) : 0;
}
