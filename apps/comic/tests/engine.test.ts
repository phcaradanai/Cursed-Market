import assert from "node:assert/strict";
import test from "node:test";
import { advanceAuction, applyAction, assertEconomy, buyerIds, createGame, replayEvents, relicScore, RuleError, scoreFromHistory, scores, viewFor, winnerIds } from "../src/game/index.js";
import type { Action, GameState, OfferMode } from "../src/game/types.js";
import { simulateGame } from "../src/simulation/simulate.js";

function fixture(genuine = true, cursed = true, players = ["seller", "buyer"]): GameState {
  // Controlled truth for contract edge cases, isolated from seeded generation tests.
  const state = createGame(players, "test-seed");
  const card = state.auction.candidates[0];
  card.genuine = genuine;
  card.cursed = cursed;
  card.family = "Mirror";
  state.auction.demand = "Mirror";
  return state;
}

function offer(state: GameState, mode: OfferMode = "as-is"): GameState {
  return applyAction(state, { type: "offer", requestId: `offer-${state.auction.number}`, auctionNumber: state.auction.number,
    playerId: state.auction.sellerId, relicId: state.auction.candidates[0].id, mode });
}

function bidding(state: GameState): GameState {
  for (const playerId of buyerIds(state)) state = applyAction(state, { type: "pass-inspection", requestId: `pass-${state.auction.number}`,
    auctionNumber: state.auction.number, playerId });
  return state;
}

function bid(state: GameState, playerId: string, amount: number, requestId = `bid-${state.auction.number}`): GameState {
  return applyAction(state, { type: "bid", requestId, auctionNumber: state.auction.number, playerId, amount });
}

function error(code: string): (e: unknown) => boolean { return e => e instanceof RuleError && e.code === code; }

test("all four relic values and independent hidden attributes", () => {
  assert.equal(relicScore({ genuine: true, cursed: false }), 9);
  assert.equal(relicScore({ genuine: true, cursed: true }), 3);
  assert.equal(relicScore({ genuine: false, cursed: false }), 1);
  assert.equal(relicScore({ genuine: false, cursed: true }), -5);
  const truth = new Set<string>();
  for (let i = 0; i < 100; i++) for (const setup of createGame(["a", "b"], `seed-${i}`).setups) {
    for (const card of setup.candidates) truth.add(`${card.genuine}:${card.cursed}`);
  }
  assert.equal(truth.size, 4);
});

for (const [genuine, cursed, mode, expected] of [
  [true, true, "genuine", "true"],
  [false, false, "genuine", "false"],
  [false, true, "genuine", "false"],
  [true, true, "uncursed", "false"],
  [false, true, "uncursed", "false"],
  [false, false, "uncursed", "true"],
  [true, false, "uncursed", "true"],
  [true, true, "as-is", "none"],
] as const) test(`${mode} contract for genuine=${genuine}, cursed=${cursed}: ${expected}`, () => {
  const initial = fixture(genuine, cursed);
  const state = bid(bidding(offer(initial, mode)), "buyer", 6);
  const result = state.history[0]!;
  assert.equal(result.certificate, expected);
  const compensation = expected === "false" ? 2 : 0;
  assert.equal(state.players[0]!.coins, 21 - compensation);
  assert.equal(state.players[1]!.coins, 9 + compensation);
  assert.equal(state.players[0]!.falseCertificates, expected === "false" ? 1 : 0);
  assert.equal(result.trustPenalty, expected === "false" ? 2 : 0);
  assert.equal(result.demandBonus, genuine ? 3 : 0);
  assert.equal(state.players[1]!.relics.length, 1);
  assertEconomy(state);
  for (const score of scores(state)) assert.deepEqual(score, scoreFromHistory(score.playerId, state.history, state.config));
  // The input snapshot, inventory, coins and log were preserved by the reducer.
  assert.equal(initial.players[0]!.coins, 15);
  assert.equal(initial.players[1]!.relics.length, 0);
  assert.equal(initial.history.length, 0);
});

test("unsold false guarantees return escrow without trust penalty or owned relic", () => {
  const staked = offer(fixture(false, true), "genuine");
  assert.equal(staked.players[0]!.coins, 13);
  assert.equal(staked.auction.escrow, 2);
  assertEconomy(staked);
  const state = bid(bidding(staked), "buyer", 0);
  assert.equal(state.history[0]!.certificate, "unsold");
  assert.equal(state.history[0]!.escrowReturned, 2);
  assert.equal(state.history[0]!.demandBonus, 0);
  assert.equal(state.players[0]!.falseCertificates, 0);
  assert.deepEqual(state.players.map(p => p.coins), [15, 15]);
  assert.ok(state.players.every(p => p.relics.length === 0));
});

test("demand bonus belongs only to the genuine purchase's auction", () => {
  let state = fixture(true, false);
  state.auction.demand = "Key";
  state = bid(bidding(offer(state)), "buyer", 1);
  assert.equal(state.history[0]!.demandBonus, 0);
  state = advanceAuction(state);
  state.auction.demand = "Mirror";
  assert.equal(state.players[1]!.relics[0]!.demandBonus, 0);
});

test("seller roles, phases, stale auctions, unavailable escrow, and unknown seats reject", () => {
  const initial = fixture();
  assert.throws(() => applyAction(initial, { type: "offer", requestId: "bad", auctionNumber: 1, playerId: "buyer", relicId: "lot-1-1", mode: "as-is" }), error("seller-only"));
  assert.throws(() => bid(initial, "buyer", 1), error("phase"));
  assert.throws(() => bid(initial, "stranger", 1), error("unknown-player"));
  assert.throws(() => advanceAuction(initial), error("phase"));
  const inspected = offer(initial);
  assert.throws(() => applyAction(inspected, { type: "pass-inspection", requestId: "bad", auctionNumber: 1, playerId: "seller" }), error("buyer-only"));
  assert.throws(() => bid(bidding(inspected), "seller", 0), error("buyer-only"));
  initial.players[0]!.coins = 1;
  assert.throws(() => offer(initial, "genuine"), error("escrow"));
  let next = bid(bidding(offer(fixture())), "buyer", 0);
  next = advanceAuction(next);
  assert.throws(() => applyAction(next, { type: "bid", requestId: "stale", auctionNumber: 1, playerId: "buyer", amount: 0 }), error("stale-auction"));
});

test("whole-number bids stay within available coins, including zero and all-in", () => {
  const state = bidding(offer(fixture()));
  for (const amount of [-1, 0.5, 16, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) assert.throws(() => bid(state, "buyer", amount), error("bid-amount"));
  const allIn = bid(state, "buyer", 15);
  assert.equal(allIn.players[1]!.coins, 0);
  assertEconomy(allIn);
});

test("inspection reveals one bit privately, costs one token, and cannot repeat", () => {
  let state = offer(fixture(true, true, ["seller", "buyer", "other"]));
  state = applyAction(state, { type: "inspect", requestId: "inspect", auctionNumber: 1, playerId: "buyer", attribute: "cursed" });
  assert.deepEqual(viewFor(state, "buyer").private.inspection, { playerId: "buyer", attribute: "cursed", value: true });
  assert.equal(state.players[1]!.inspectionTokens, 1);
  assert.equal(viewFor(state, "other").private.inspection, null);
  assert.equal(viewFor(state, "seller").private.inspection, null);
  assert.throws(() => applyAction(state, { type: "inspect", requestId: "repeat", auctionNumber: 1, playerId: "buyer", attribute: "genuine" }), error("inspection-locked"));
  state.players[2]!.inspectionTokens = 0;
  assert.throws(() => applyAction(state, { type: "inspect", requestId: "empty", auctionNumber: 1, playerId: "other", attribute: "genuine" }), error("inspection-tokens"));
  // Passing remains possible with no tokens.
  state = applyAction(state, { type: "pass-inspection", requestId: "pass", auctionNumber: 1, playerId: "other" });
  assert.equal(state.phase, "SEALED_BID");
});

test("allowlisted views hide truth, discarded lots, seed, logs and opponents' locked bids", () => {
  let state = fixture(true, true, ["seller", "buyer", "other"]);
  assert.equal(viewFor(state, "seller").private.candidates?.length, 2);
  assert.equal(viewFor(state, "buyer").private.candidates, null);
  state = offer(state, "genuine");
  const publicCard = viewFor(state, "buyer").auction.offer!.relic;
  assert.deepEqual(Object.keys(publicCard).sort(), ["family", "id", "name"]);
  for (const id of ["seller", "buyer", "other"]) {
    const view = viewFor(state, id);
    for (const secret of ["seed", "setups", "events", "acceptedActions"]) assert.equal(secret in view, false);
    assert.equal(view.results, null);
  }
  state = bidding(state);
  state = bid(state, "buyer", 7);
  assert.equal(viewFor(state, "buyer").private.bid!.amount, 7);
  assert.equal(viewFor(state, "other").private.bid, null);
  assert.equal(viewFor(state, "seller").private.bid, null);
  assert.equal(viewFor(state, "other").history.length, 0);
  assert.throws(() => bid(state, "buyer", 8, "changed"), error("bid-locked"));
  const view = viewFor(state, "seller");
  view.private.candidates![0].genuine = false;
  view.players[0]!.coins = 0;
  assert.equal(state.auction.candidates[0].genuine, true);
  assert.equal(state.players[0]!.coins, 13);
  state = bid(state, "other", 5);
  assert.equal(viewFor(state, "other").history[0]!.relic.cursed, true);
  assert.deepEqual(viewFor(state, "other").history[0]!.bids.map(b => b.amount), [7, 5]);
  assert.throws(() => viewFor(state, "spectator"), error("unknown-player"));
});

test("another seat's serialized view cannot distinguish unrevealed truth, inspection findings or bid amounts", () => {
  let left = fixture(true, true, ["seller", "buyer", "other"]);
  let right = fixture(false, false, ["seller", "buyer", "other"]);
  right.auction.candidates[1].genuine = !left.auction.candidates[1].genuine;
  right.auction.candidates[1].cursed = !left.auction.candidates[1].cursed;
  left = offer(left, "genuine");
  right = offer(right, "genuine");
  assert.equal(JSON.stringify(viewFor(left, "other")), JSON.stringify(viewFor(right, "other")));
  const action: Action = { type: "inspect", requestId: "inspect", auctionNumber: 1, playerId: "buyer", attribute: "genuine" };
  left = applyAction(left, action);
  right = applyAction(right, action);
  assert.equal(JSON.stringify(viewFor(left, "other")), JSON.stringify(viewFor(right, "other")));
  const pass: Action = { type: "pass-inspection", requestId: "pass", auctionNumber: 1, playerId: "other" };
  left = bid(applyAction(left, pass), "buyer", 1);
  right = bid(applyAction(right, pass), "buyer", 14);
  assert.equal(JSON.stringify(viewFor(left, "other")), JSON.stringify(viewFor(right, "other")));
});

test("request retries settle only once; conflicting reuse rejects, including after advance", () => {
  let state = bidding(offer(fixture()));
  const action: Action = { type: "bid", requestId: "last-bid", auctionNumber: 1, playerId: "buyer", amount: 5 };
  state = applyAction(state, action);
  const revision = state.revision;
  assert.equal(applyAction(state, action), state);
  assert.equal(state.history.length, 1);
  assert.equal(state.revision, revision);
  assert.throws(() => applyAction(state, { ...action, amount: 6 }), error("request-conflict"));
  const next = advanceAuction(state);
  assert.equal(applyAction(next, action), next);
  assert.equal(next.players[1]!.relics.length, 1);
});

test("seeded highest-bid tie ignores packet order and is auditable", () => {
  const state = bidding(offer(createGame(["a", "b", "c", "d"], "tie-seed")));
  const left = bid(bid(bid(state, "b", 5), "c", 5), "d", 5);
  const right = bid(bid(bid(state, "d", 5), "c", 5), "b", 5);
  assert.deepEqual(left.history, right.history);
  const result = left.history[0]!;
  assert.deepEqual(result.tiedPlayerIds, ["b", "c", "d"]);
  assert.equal(result.winnerId, result.tiedPlayerIds[result.tieIndex!]);
  assert.equal(left.players.reduce((sum, p) => sum + p.relics.length, 0), 1);
});

test("seeded generation is deterministic and probabilities can reach all four extreme truths", () => {
  assert.deepEqual(createGame(["a", "b"], "same"), createGame(["a", "b"], "same"));
  assert.notDeepEqual(createGame(["a", "b"], "same").setups, createGame(["a", "b"], "different").setups);
  for (const genuineProbability of [0, 1]) for (const cursedProbability of [0, 1]) {
    const state = createGame(["a", "b"], "extreme", { genuineProbability, cursedProbability });
    assert.ok(state.setups.every(s => s.candidates.every(c => c.genuine === Boolean(genuineProbability) && c.cursed === Boolean(cursedProbability))));
  }
});

test("invalid setup and malformed runtime actions reject without mutating state", () => {
  for (const ids of [["a"], ["a", "a"], ["", "b"], ["a", "b", "c", "d", "e"]]) assert.throws(() => createGame(ids, "seed"));
  assert.throws(() => createGame(["a", "b"], ""));
  for (const config of [{ genuineProbability: NaN }, { cursedProbability: -0.1 }, { startingCoins: -1 }, { escrowCoins: 1.5 }]) assert.throws(() => createGame(["a", "b"], "seed", config));
  const state = fixture();
  const original = structuredClone(state);
  const request = { playerId: "seller", auctionNumber: 1, requestId: "bad" };
  for (const action of [
    { ...request, type: "unknown" },
    { ...request, type: "offer", relicId: "lot-1-1", mode: "both" },
    { ...request, type: "offer", relicId: "lot-2-1", mode: "as-is" },
    { ...request, type: "offer", relicId: "lot-1-1", mode: "as-is", requestId: "" },
  ]) assert.throws(() => applyAction(state, action as Action), e => e instanceof RuleError);
  assert.deepEqual(state, original);
});

for (const [count, auctions, turns] of [[2, 8, 4], [3, 9, 3], [4, 12, 3]] as const) test(`${count} players complete ${auctions} auctions with equal seller turns, no elimination and reproducible scores`, () => {
  for (let i = 0; i < 20; i++) {
    const policies = Array.from({ length: count }, () => "random" as const);
    const state = simulateGame(count, `full-${count}-${i}`, policies);
    assert.equal(state.phase, "RESULTS");
    assert.equal(state.history.length, auctions);
    for (const p of state.players) assert.equal(state.history.filter(r => r.sellerId === p.id).length, turns);
    assert.deepEqual(replayEvents(JSON.parse(JSON.stringify(state.events))), state);
    for (const score of scores(state)) assert.deepEqual(scoreFromHistory(score.playerId, state.history, state.config), score);
    const results = viewFor(state, "p1").results!;
    assert.equal(results.seed, state.seed);
    assert.ok(results.inspections.length <= count * 2);
  }
});

test("replay detects tampered bids, inspections and settlement", () => {
  const state = simulateGame(3, "audit-test", ["cautious", "trusting", "random"]);
  const tampered = structuredClone(state.events);
  const settled = tampered.find(e => e.type === "auction-settled")!;
  if (settled.type === "auction-settled") settled.result.price += 1;
  assert.throws(() => replayEvents(tampered), error("audit"));
  const inspectionTamper = structuredClone(state.events);
  const inspected = inspectionTamper.find(e => e.type === "inspected")!;
  assert.ok(inspected);
  if (inspected.type === "inspected") inspected.inspection.value = !inspected.inspection.value;
  assert.throws(() => replayEvents(inspectionTamper), error("audit"));
  const actionTamper = structuredClone(state.events);
  const accepted = actionTamper.find(e => e.type === "action-accepted" && e.action.type === "bid")!;
  if (accepted.type === "action-accepted" && accepted.action.type === "bid") accepted.action.amount += 1;
  assert.throws(() => replayEvents(actionTamper));
});

test("final score ranks by total, then remaining coins, then shared victory; negatives are valid", () => {
  const state = fixture(false, true);
  state.players[0]!.coins = 10;
  state.players[1]!.coins = 5;
  state.players[1]!.relics.push({ ...state.auction.candidates[0], genuine: true, cursed: true, auctionNumber: 1, demandBonus: 2 });
  assert.deepEqual(winnerIds(state), ["seller"]); // Both 10 points, seller has more coins.
  state.players[1]!.coins = 10;
  state.players[1]!.relics = [];
  assert.deepEqual(winnerIds(state), ["seller", "buyer"]);
  state.players[1]!.coins = 0;
  state.players[1]!.relics.push({ ...state.auction.candidates[0], auctionNumber: 1, demandBonus: 0 });
  assert.equal(scores(state).find(s => s.playerId === "buyer")!.total, -5);
});
