import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { DEFAULT_CONFIG, scores, winnerIds } from "../game/index.js";
import type { GameState, RulesConfig } from "../game/types.js";
import { POLICIES } from "./bots.js";
import type { Policy } from "./bots.js";
import { simulateGame } from "./simulate.js";

const args = process.argv.slice(2);
const options = new Map<string, string>();
const known = new Set(["--games", "--seed", "--out", "--genuine-probability", "--cursed-probability"]);
for (let i = 0; i < args.length; i += 2) {
  const key = args[i]!;
  const value = args[i + 1];
  if (!known.has(key) || value === undefined || options.has(key)) throw new Error(`Invalid arguments: ${key}`);
  options.set(key, value);
}
const gamesPerScenario = Number(options.get("--games") ?? 250);
if (!Number.isSafeInteger(gamesPerScenario) || gamesPerScenario < 1 || gamesPerScenario > 100000) throw new Error("--games must be an integer from 1 to 100000");
const seedPrefix = options.get("--seed") ?? "cursed-market-v0.1";
const output = resolve(options.get("--out") ?? "docs/simulation/engine-v0.1");
const config: RulesConfig = {
  ...DEFAULT_CONFIG,
  genuineProbability: Number(options.get("--genuine-probability") ?? DEFAULT_CONFIG.genuineProbability),
  cursedProbability: Number(options.get("--cursed-probability") ?? DEFAULT_CONFIG.cursedProbability),
};

interface Summary {
  players: number;
  scenario: string;
  games: number;
  auctions: number;
  soldAuctions: number;
  totalBids: number;
  positiveBidCount: number;
  tiedSales: number;
  soldCertificates: number;
  falseCertificates: number;
  saleRate: number;
  passBidRate: number;
  meanPositiveBid: number;
  meanWinningPrice: number;
  tiedSaleRate: number;
  falseCertificateRateAmongSoldCertificates: number;
  truthfulGenuineCursedSales: number;
  cursedShareOfSales: number;
  meanRichestCoinShare: number;
  negativeScoreRate: number;
  inspectionCounts: { genuine: number; cursed: number };
  meanUnusedTokens: number;
  winSharesBySeat: number[];
  byPolicy: { policy: Policy; seats: number; winShare: number; meanScore: number }[];
}

const summaries: Summary[] = [];
let example: GameState | undefined;
const round = (value: number) => Number(value.toFixed(6));
const ratio = (num: number, den: number) => den === 0 ? 0 : round(num / den);
for (const players of [2, 3, 4]) {
  for (const scenario of ["cautious", "trusting", "skeptical", "mixed"] as const) {
    let auctions = 0, sold = 0, bids = 0, passes = 0, positiveBids = 0, priceSum = 0, tiedSales = 0;
    let certificates = 0, falseCertificates = 0, misleading = 0, cursedSales = 0, coinShare = 0, negativeScores = 0, unusedTokens = 0;
    const inspections = { genuine: 0, cursed: 0 };
    const wins = Array.from({ length: players }, () => 0);
    const byPolicy = POLICIES.map(policy => ({ policy, seats: 0, winShare: 0, scoreSum: 0 }));
    for (let i = 0; i < gamesPerScenario; i++) {
      const policies: Policy[] = Array.from({ length: players }, (_, seat) => scenario === "mixed" ? POLICIES[(seat + i) % POLICIES.length]! : scenario);
      // The game environment is matched across policy scenarios for each seed/player count.
      const state = simulateGame(players, `${seedPrefix}:${players}:${i}`, policies, config);
      if (players === 4 && scenario === "mixed" && i === 0) example = state;
      auctions += state.history.length;
      for (const result of state.history) {
        bids += result.bids.length;
        passes += result.bids.filter(b => b.amount === 0).length;
        positiveBids += result.bids.reduce((sum, b) => sum + b.amount, 0);
        if (result.winnerId === null) continue;
        sold += 1;
        priceSum += result.price;
        if (result.tiedPlayerIds.length > 1) tiedSales += 1;
        if (result.mode !== "as-is") certificates += 1;
        if (result.certificate === "false") falseCertificates += 1;
        if (result.mode === "genuine" && result.relic.genuine && result.relic.cursed) misleading += 1;
        if (result.relic.cursed) cursedSales += 1;
      }
      for (const event of state.events) if (event.type === "inspected" && event.inspection.attribute) inspections[event.inspection.attribute] += 1;
      const totalCoins = state.players.reduce((sum, p) => sum + p.coins, 0);
      coinShare += totalCoins === 0 ? 0 : Math.max(...state.players.map(p => p.coins)) / totalCoins;
      unusedTokens += state.players.reduce((sum, p) => sum + p.inspectionTokens, 0);
      const ranked = scores(state);
      const winners = winnerIds(state);
      negativeScores += ranked.filter(s => s.total < 0).length;
      for (let seat = 0; seat < players; seat++) {
        const playerId = state.players[seat]!.id;
        const share = winners.includes(playerId) ? 1 / winners.length : 0;
        wins[seat]! += share;
        const stats = byPolicy.find(p => p.policy === policies[seat])!;
        stats.seats += 1;
        stats.winShare += share;
        stats.scoreSum += ranked.find(s => s.playerId === playerId)!.total;
      }
    }
    summaries.push({ players, scenario, games: gamesPerScenario, auctions,
      soldAuctions: sold, totalBids: bids, positiveBidCount: bids - passes, tiedSales, soldCertificates: certificates, falseCertificates,
      saleRate: ratio(sold, auctions), passBidRate: ratio(passes, bids), meanPositiveBid: ratio(positiveBids, bids - passes), meanWinningPrice: ratio(priceSum, sold),
      tiedSaleRate: ratio(tiedSales, sold), falseCertificateRateAmongSoldCertificates: ratio(falseCertificates, certificates),
      truthfulGenuineCursedSales: misleading, cursedShareOfSales: ratio(cursedSales, sold), meanRichestCoinShare: ratio(coinShare, gamesPerScenario),
      negativeScoreRate: ratio(negativeScores, gamesPerScenario * players), inspectionCounts: inspections,
      meanUnusedTokens: ratio(unusedTokens, gamesPerScenario * players), winSharesBySeat: wins.map(win => ratio(win, gamesPerScenario)),
      byPolicy: byPolicy.filter(p => p.seats > 0).map(p => ({ policy: p.policy, seats: p.seats, winShare: ratio(p.winShare, p.seats), meanScore: ratio(p.scoreSum, p.seats) })),
    });
  }
}

const percent = (n: number) => `${(n * 100).toFixed(1)}%`;
const summary = { schemaVersion: 1, seedPrefix, config, gamesPerScenario, totalGames: gamesPerScenario * summaries.length,
  verified: ["coin conservation after every action", "nonnegative coin/token balances", "single settlement per auction", "scores reconstructed from history", "full deterministic event replay"], summaries };
const rows = summaries.map(s => `| ${s.players} | ${s.scenario} | ${percent(s.saleRate)} | ${s.meanWinningPrice.toFixed(2)} | ${percent(s.passBidRate)} | ${percent(s.tiedSaleRate)} | ${percent(s.cursedShareOfSales)} | ${percent(s.meanRichestCoinShare)} | ${s.meanUnusedTokens.toFixed(2)} |`).join("\n");
const mixed2 = summaries.find(s => s.players === 2 && s.scenario === "mixed")!;
const mixed4 = summaries.find(s => s.players === 4 && s.scenario === "mixed")!;
const identical4 = summaries.filter(s => s.players === 4 && s.scenario !== "mixed");
const report = `# Cursed Market — Rules simulation v0.1\n\n` +
  `ทดสอบ ${summary.totalGames.toLocaleString("en-US")} แมตช์ (${gamesPerScenario} ต่อ scenario), รวม ${summaries.reduce((sum, s) => sum + s.auctions, 0).toLocaleString("en-US")} การประมูล ด้วย seed prefix \`${seedPrefix}\`.\n\n` +
  `ทุกแมตช์ตรวจเงินรวมรวมมัดจำหลังทุก action, เงินและสิทธิ์ตรวจไม่ติดลบ, การปิดประมูลครั้งเดียว, คะแนนจากประวัติ และ replay event log ตรงกับ state เดิม หากข้อใดผิด โปรแกรมจะหยุดด้วย error.\n\n` +
  `| ผู้เล่น | Bot scenario | ขายได้ | ราคาเฉลี่ยเมื่อขาย | Bid ที่ pass | ขายแบบเสมอ | สินค้าขายที่มีคำสาป | สัดส่วนเงินคนรวยสุดเฉลี่ย | สิทธิ์ตรวจเหลือ/คน |\n` +
  `| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |\n${rows}\n\n` +
  `## ประเด็นที่ควรนำไปดูใน human playtest\n\n` +
  `- กลุ่ม 2 คนแบบ mixed มี bid ที่ pass ${percent(mixed2.passBidRate)} และเงินคนรวยสุดเฉลี่ย ${percent(mixed2.meanRichestCoinShare)} เทียบกับ ${percent(mixed4.meanRichestCoinShare)} ใน 4 คนแบบ mixed. ตรวจว่าการขาดคู่แข่งประมูลทำให้เกม 2 คนเสียความตื่นเต้นหรือเงินกระจุกเร็วหรือไม่.\n` +
  `- กลุ่ม 4 คนที่ใช้ heuristic แบบเดียวกันมีราคาสูงสุดเสมอ ${percent(Math.min(...identical4.map(s => s.tiedSaleRate)))}–${percent(Math.max(...identical4.map(s => s.tiedSaleRate)))} ของการขาย. อาจเป็นผลจาก bot คิดเหมือนกัน; ต้องดูคนจริงก่อนแก้กติกา.\n` +
  `- ยังไม่มีการเปลี่ยนค่ากติกาหรือประกาศว่า balance สำเร็จจากผลนี้.\n\n` +
  `## ข้อสมมติของ simulation\n\n` +
  `- GDD ไม่กำหนดอัตราแท้/คำสาป จึงเริ่มจาก ${percent(config.genuineProbability)} genuine และ ${percent(config.cursedProbability)} cursed โดยสุ่มแยกอิสระ. ตัวแปรนี้ยังไม่ผ่านการ balance.\n` +
  `- cautious, trusting และ skeptical คำนวณมูลค่าคาดหวังจากข้อมูลของ seat ตนเอง ด้วยความเชื่อใน certificate 75%, 95%, 55% ตามลำดับ; ไม่เรียนรู้พฤติกรรมคนขาย.\n` +
  `- Seller heuristic เลือกสินค้าที่มีคำรับประกันจริงน่าดึงดูด แม้อีกคุณสมบัติอาจอันตราย; random เลือกสินค้า/คำรับประกัน/ตรวจ/ราคาแบบสุ่ม.\n` +
  `- mixed หมุนเวียน bot ทั้งสี่ชนิดใน seat ต่าง ๆ. แต่ละจำนวนผู้เล่นใช้ card seeds เดียวกันข้าม scenario. Bots รับเฉพาะ projected view ของตนเอง.\n` +
  `- ค่า 0 สำหรับอัตราที่ไม่มี denominator หมายถึงไม่มีเหตุการณ์ชนิดนั้น; ดูจำนวนจริงใน JSON. Win shares แบ่งเท่ากันเมื่อชนะร่วม.\n\n` +
  `## ใช้ผลนี้ตัดสินอะไรได้\n\n` +
  `ผลช่วยคัดกรองการผ่านประมูลบ่อย ราคา การเสมอ การใช้ inspection และเงินที่กระจุกตัว ภายใต้ heuristic ที่ประกาศ. ไม่ใช่หลักฐานว่าผู้เล่นจะสนุก หรือกลยุทธ์ใดชนะเสมอ. อัตรา cursed สูงไม่ได้พิสูจน์ว่าคนมองข้ามคำสาป.\n\n` +
  `ก่อนเปลี่ยนกติกา ให้ทดสอบคนจริง 2 และ 3–4 คน ทั้งมี/ไม่มี voice: ความเข้าใจ guarantee, เหตุผลที่ตรวจ/ยื่นราคา, จุด reveal ที่จำได้, ช่วงรอ และการขอ rematch โดยสมัครใจ.\n\n` +
  `## ไฟล์และวิธีตรวจซ้ำ\n\n` +
  `- summary.json: parameters, metrics และ win/score แยก policy/seat.\n` +
  `- summary.csv: ตารางรวมสำหรับวิเคราะห์ต่อ.\n` +
  `- example-match.json: end-of-game audit log จาก 4-player mixed แมตช์แรก มี seed และข้อมูลลับครบ จึงใช้หลังจบเกมเท่านั้น.\n` +
  `- รัน: \`npm run simulate -- --games ${gamesPerScenario} --seed '${seedPrefix}'\` พร้อม probability flags เมื่อใช้ค่าต่างจาก default.\n` +
  `- Replay: \`npm run replay -- docs/simulation/engine-v0.1/example-match.json\`.\n`;
mkdirSync(output, { recursive: true });
writeFileSync(resolve(output, "summary.json"), JSON.stringify(summary, null, 2) + "\n");
const fields = ["players", "scenario", "games", "auctions", "soldAuctions", "totalBids", "positiveBidCount", "tiedSales", "soldCertificates", "falseCertificates", "saleRate", "passBidRate", "meanPositiveBid", "meanWinningPrice", "tiedSaleRate", "falseCertificateRateAmongSoldCertificates", "truthfulGenuineCursedSales", "cursedShareOfSales", "meanRichestCoinShare", "negativeScoreRate", "meanUnusedTokens"] as const;
writeFileSync(resolve(output, "summary.csv"), fields.join(",") + "\n" + summaries.map(s => fields.map(f => s[f]).join(",")).join("\n") + "\n");
writeFileSync(resolve(output, "report.md"), report);
writeFileSync(resolve(output, "example-match.json"), JSON.stringify({ events: example!.events, scores: scores(example!), winnerIds: winnerIds(example!) }, null, 2) + "\n");
console.log(`Verified ${summary.totalGames} games, ${summaries.reduce((sum, s) => sum + s.auctions, 0)} auctions; report: ${resolve(output, "report.md")}`);
