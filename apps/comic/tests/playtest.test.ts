import assert from "node:assert/strict";
import test from "node:test";
import { advanceAuction, applyAction, createGame, scores, winnerIds } from "../src/game/index.js";
import { analyseMatchAudit, analyseMatchAudits } from "../src/playtest/report.js";
import type { MatchAudit } from "../src/shared/protocol.js";

// Synthetic, completed fixtures are never stored as human observations.
function fixture(allPass = false): MatchAudit {
  let state = createGame(["a", "b", "c"], "playtest-report-fixture");
  while (state.phase !== "RESULTS") {
    const auctionNumber = state.auction.number;
    const seller = state.auction.sellerId;
    state = applyAction(state, { type: "offer", requestId: `offer-${auctionNumber}`, playerId: seller, auctionNumber, relicId: state.auction.candidates[0].id, mode: "as-is" });
    const buyers = state.players.filter(p => p.id !== seller);
    for (const player of buyers) {
      const base = { requestId: `inspect-${auctionNumber}-${player.id}`, playerId: player.id, auctionNumber };
      state = applyAction(state, player.inspectionTokens > 0 ? { ...base, type: "inspect", attribute: "cursed" } : { ...base, type: "pass-inspection" });
    }
    for (const [index, player] of buyers.entries()) state = applyAction(state, { type: "bid", requestId: `bid-${auctionNumber}-${player.id}`, playerId: player.id, auctionNumber, amount: allPass || index > 0 ? 0 : 1 });
    state = advanceAuction(state);
  }
  const phases = ["SELLER_PREP", "BUYER_INSPECTION", "SEALED_BID", "REVEAL"];
  return {
    schemaVersion: 1, matchId: "synthetic-fixture", playtestMode: "no-voice", startedAt: 0, endedAt: 36000,
    seats: state.players.map(p => ({ id: p.id, name: p.id })), events: state.events, scores: scores(state), winnerIds: winnerIds(state), timeouts: [],
    phaseTimes: state.history.flatMap(r => phases.map((phase, index) => ({ auctionNumber: r.auctionNumber, phase, startedAt: ((r.auctionNumber - 1) * 4 + index) * 1000, endedAt: ((r.auctionNumber - 1) * 4 + index + 1) * 1000 }))),
  };
}

test("completed logs produce decision and timing evidence without claiming human fun", () => {
  const report = analyseMatchAudits([fixture()]);
  assert.equal(report.evidenceKind, "match-logs-only");
  assert.equal(report.humanFunValidated, false);
  assert.equal(report.voluntaryRematchRate, null);
  const match = report.matches[0]!;
  assert.equal(match.auctions, 9);
  assert.deepEqual(match.sold, { numerator: 9, denominator: 9, value: 1 });
  assert.equal(match.averageWinningBid, 1);
  assert.deepEqual(match.manualPassBids, { numerator: 9, denominator: 18, value: 0.5 });
  assert.equal(match.recordedDurationSeconds, 36);
  assert.deepEqual(match.phaseSeconds.SEALED_BID, { mean: 1, max: 1 });
});

test("timeout passes are excluded from manual strategy counts", () => {
  const audit = fixture();
  audit.timeouts.push({ at: 3000, auctionNumber: 1, phase: "SEALED_BID", playerId: "c" });
  const match = analyseMatchAudit(audit);
  assert.equal(match.defaultBidCount, 1);
  assert.deepEqual(match.manualPassBids, { numerator: 8, denominator: 17, value: 8 / 17 });
  assert.deepEqual(match.players.find(p => p.playerId === "c")!.manualBidChoices, { positive: 0, pass: 5 });
  assert.equal(match.players.find(p => p.playerId === "c")!.defaultChoices, 1);
  audit.timeouts[0]!.playerId = "b";
  assert.throws(() => analyseMatchAudit(audit), /safe default action/);
});

test("no sales has no price or tie denominator, rather than a misleading zero", () => {
  const match = analyseMatchAudit(fixture(true));
  assert.equal(match.averageWinningBid, null);
  assert.deepEqual(match.highestBidTies, { numerator: 0, denominator: 0, value: null });
  assert.equal(match.manualPassBids.value, 1);
});

test("rejects altered outcomes, scores, roster and incomplete matches", () => {
  const score = fixture(); score.scores[0]!.total++;
  assert.throws(() => analyseMatchAudit(score), /scores/);
  const outcome = fixture();
  const settled = outcome.events.find(e => e.type === "auction-settled");
  assert.ok(settled?.type === "auction-settled"); settled.result.price++;
  assert.throws(() => analyseMatchAudit(outcome), /outcomes/);
  const roster = fixture(); roster.seats.reverse();
  assert.throws(() => analyseMatchAudit(roster), /roster/);
  const unfinished = fixture(); unfinished.events.pop();
  assert.throws(() => analyseMatchAudit(unfinished), /not complete/);
});

test("rejects missing, duplicate and invalid timing metadata", () => {
  const missing = fixture(); missing.phaseTimes.pop();
  assert.throws(() => analyseMatchAudit(missing), /missing phase/);
  const duplicate = fixture(); duplicate.phaseTimes.push(duplicate.phaseTimes[0]!);
  assert.throws(() => analyseMatchAudit(duplicate), /duplicate phase/);
  const backwards = fixture(); backwards.phaseTimes[0]!.endedAt = -1;
  assert.throws(() => analyseMatchAudit(backwards), /timestamps/);
  const outside = fixture(); outside.timeouts.push({ at: 5000, auctionNumber: 1, phase: "REVEAL", playerId: null });
  assert.throws(() => analyseMatchAudit(outside), /outside/);
});

test("rejects repeated copies of a match and non-export input", () => {
  assert.throws(() => analyseMatchAudits([fixture(), fixture()]), /more than once/);
  assert.throws(() => analyseMatchAudits([]), /at least one/);
  assert.throws(() => analyseMatchAudit({ events: fixture().events }), /schemaVersion/);
});
