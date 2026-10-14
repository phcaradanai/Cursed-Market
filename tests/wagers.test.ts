import assert from "node:assert/strict";
import test from "node:test";
import { advanceAuction, applyAction, assertEconomy, createGame, replayEvents, scoreFromHistory, scores, viewFor } from "../src/game/index.js";
import { randomAt } from "../src/game/random.js";
import { MessageError, parseMessage } from "../src/server/messages.js";
import type { Action, CurseWager, GameState } from "../src/game/types.js";

function market(count = 3, cursed = true, seed = "wagers") {
  let state = createGame(Array.from({ length: count }, (_, i) => `p${i}`), seed,
    { curseWagers: true, fastMarket: true, cursedProbability: cursed ? 1 : 0 });
  return offer(state);
}
function offer(state: GameState) {
  return applyAction(state, { type: "offer", playerId: state.auction.sellerId, requestId: `offer-${state.auction.number}`,
    auctionNumber: state.auction.number, relicId: state.auction.candidates[0].id, mode: "as-is" });
}
function bid(state: GameState, playerId: string, amount = 0, wager?: CurseWager) {
  return applyAction(state, { type: "bid", playerId, requestId: `bid-${state.auction.number}`, auctionNumber: state.auction.number, amount, ...(wager ? { wager } : {}) });
}

test("fast market permits each buyer to inspect and bid independently; bid closes inspection", () => {
  let state = market();
  assert.equal(state.phase, "SEALED_BID");
  state = applyAction(state, { type: "inspect", playerId: "p1", requestId: "inspect", auctionNumber: 1, attribute: "cursed" });
  assert.equal(state.phase, "SEALED_BID");
  state = bid(state, "p1", 0, { cursed: true, stake: 2 });
  assert.equal(state.auction.inspections.some(i => i.playerId === "p2"), false);
  assert.throws(() => applyAction(state, { type: "inspect", playerId: "p1", requestId: "late", auctionNumber: 1, attribute: "genuine" }), /before locking/);
  state = bid(state, "p2");
  assert.equal(state.phase, "REVEAL");
  assertEconomy(state);
});

test("unsold relic still settles wagers; wrong predictions carry the full pot plus next ante", () => {
  let state = bid(bid(market(), "p1", 0, { cursed: false, stake: 3 }), "p2", 0, { cursed: false, stake: 1 });
  assert.equal(state.history[0]!.winnerId, null);
  assert.equal(state.jackpot, 6);
  assert.deepEqual(state.players.map(p => p.coins), [15, 12, 14]);
  assertEconomy(state);
  state = advanceAuction(state);
  assert.equal(state.jackpot, 8);
  assertEconomy(state);
});

test("correct wager wins without buying; opponents' wrong stakes fund the payout", () => {
  const state = bid(bid(market(), "p1", 0, { cursed: true, stake: 1 }), "p2", 0, { cursed: false, stake: 3 });
  assert.equal(state.jackpot, 0);
  assert.deepEqual(state.history[0]!.wagers!.map(w => w.payout), [6, 0]);
  assert.deepEqual(state.players.map(p => p.coins), [15, 20, 12]);
  assert.ok(state.players.every(p => p.relics.length === 0));
  assertEconomy(state);
});

test("proportional integer payouts conserve coins and use largest remainders", () => {
  const state = bid(bid(bid(market(4), "p1", 0, { cursed: true, stake: 1 }), "p2", 0, { cursed: true, stake: 2 }), "p3", 0, { cursed: false, stake: 3 });
  assert.deepEqual(state.history[0]!.wagers!.map(w => w.payout), [3, 5, 0]);
  assertEconomy(state);
});

test("wager payout rounding and auction ties do not depend on packet order", () => {
  const initial = market(4);
  const actions: Action[] = ["p1", "p2", "p3"].map(playerId => ({ type: "bid", playerId, requestId: "bid", auctionNumber: 1, amount: 2, wager: { cursed: true, stake: 1 } }));
  const first = actions.reduce(applyAction, initial);
  const reversed = [...actions].reverse().reduce(applyAction, initial);
  assert.deepEqual(first.history, reversed.history);
  assert.deepEqual(first.players, reversed.players);
});

test("sealed wagers cannot be inferred from opponents' views or public coin balances", () => {
  const initial = market();
  const a = bid(initial, "p1", 4, { cursed: true, stake: 1 });
  const b = bid(initial, "p1", 4, { cursed: false, stake: 3 });
  assert.deepEqual(viewFor(a, "p2"), viewFor(b, "p2"));
  assert.deepEqual(viewFor(a, "p0"), viewFor(b, "p0"));
  assert.deepEqual(viewFor(b, "p1").private.bid!.wager, { cursed: false, stake: 3 });
  assert.equal(viewFor(b, "p2").jackpot, 2);
  assertEconomy(b);
});

test("bid plus stake cannot overspend; invalid wagers and seller wagering reject without mutation", () => {
  const state = market();
  assert.throws(() => bid(state, "p1", 13, { cursed: true, stake: 3 }), /fit your available/);
  assert.throws(() => bid(state, "p0", 0, { cursed: true, stake: 1 }), /seller cannot bid/);
  for (const stake of [0, 4, -1, 1.5, NaN]) assert.throws(() => bid(state, "p1", 0, { cursed: true, stake }), /1–3/);
  assert.equal(state.acceptedActions.length, 1);
  assert.equal(state.players[1]!.coins, 15);
});

test("wager retries settle once and changed prediction conflicts even after reveal", () => {
  let state = bid(market(), "p1", 0, { cursed: true, stake: 2 });
  const action: Action = { type: "bid", playerId: "p2", requestId: "last", auctionNumber: 1, amount: 0, wager: { cursed: false, stake: 1 } };
  state = applyAction(state, action);
  assert.equal(applyAction(state, structuredClone(action)), state);
  assert.throws(() => applyAction(state, { ...action, wager: { cursed: true, stake: 1 } }), /another action/);
  assert.equal(state.history.length, 1);
  assertEconomy(state);
});

test("runtime parser rejects nested spoofing, wrong prediction type and invalid wager amount", () => {
  for (const wager of [{ cursed: true, stake: 1, playerId: "p0" }, { cursed: "true", stake: 1 }, { cursed: true, stake: 6 }, null]) {
    assert.throws(() => parseMessage({ type: "action", matchId: "match", action: { type: "bid", requestId: "x", auctionNumber: 1, amount: 0, wager } }), e => e instanceof MessageError);
  }
});

test("v0.1 keeps its four phases and rejects experimental wagering", () => {
  let state = offer(createGame(["p0", "p1"], "legacy"));
  assert.equal(state.phase, "BUYER_INSPECTION");
  state = applyAction(state, { type: "pass-inspection", playerId: "p1", requestId: "pass", auctionNumber: 1 });
  assert.throws(() => bid(state, "p1", 0, { cursed: true, stake: 1 }), /not enabled/);
  state = bid(state, "p1");
  assert.equal(state.history[0]!.wagers, undefined);
  assert.equal(state.jackpot, 0);
  assertEconomy(state);
});

test("unclaimed pot returns to the market at match end, never to the last seller", () => {
  let state = market(2);
  while (state.phase !== "RESULTS") {
    const buyer = state.players.find(p => p.id !== state.auction.sellerId)!;
    state = bid(state, buyer.id);
    state = advanceAuction(state);
    if (state.phase !== "RESULTS") state = offer(state);
  }
  assert.equal(state.jackpot, 0);
  assert.equal(state.houseCoins, 16);
  assert.deepEqual(state.players.map(p => p.coins), [15, 15]);
  assertEconomy(state);
  assert.deepEqual(replayEvents(state.events), state);
});

test("750 synthetic v0.2 matches preserve economy, independent scores, secrets and seeded replay", () => {
  for (const count of [2, 3, 4]) for (let trial = 0; trial < 250; trial++) {
    const seed = `wager-proof:${count}:${trial}`;
    let state = createGame(Array.from({ length: count }, (_, i) => `p${i}`), seed, { curseWagers: true, fastMarket: true });
    while (state.phase !== "RESULTS") {
      state = offer(state);
      const number = state.auction.number;
      const buyers = state.players.filter(p => p.id !== state.auction.sellerId).map(p => p.id);
      for (const id of buyers) {
        const actor = state.players.find(p => p.id === id)!;
        if (actor.inspectionTokens > 0 && randomAt(seed, `${number}:${id}:inspect`) < 0.25) {
          state = applyAction(state, { type: "inspect", playerId: id, auctionNumber: number, requestId: `inspect-${number}`, attribute: "cursed" });
        }
        const stake = Math.min(actor.coins, Math.floor(randomAt(seed, `${number}:${id}:stake`) * 4));
        const cursed = viewFor(state, id).private.inspection?.value ?? randomAt(seed, `${number}:${id}:prediction`) < 0.5;
        state = bid(state, id, Math.min(actor.coins - stake, Math.floor(randomAt(seed, `${number}:${id}:price`) * 7)), stake ? { cursed, stake } : undefined);
        assertEconomy(state);
      }
      state = advanceAuction(state);
      assertEconomy(state);
    }
    for (const score of scores(state)) assert.deepEqual(score, scoreFromHistory(score.playerId, state.history, state.config));
    assert.deepEqual(replayEvents(state.events), state);
  }
});
