import assert from "node:assert/strict";
import test from "node:test";
import { advanceAuction, applyAction, assertEconomy, createGame, replayEvents, scoreFromHistory, scores, viewFor } from "../src/game/index.js";
import { boonBonus, marketRelicScore, wagerLimit } from "../src/game/run.js";
import { randomAt } from "../src/game/random.js";
import { parseMessage } from "../src/server/messages.js";
import type { Action, GameState } from "../src/game/types.js";

const config = { rogueRun: true, curseWagers: true, fastMarket: true };
const run = (seed = "run", count = 3) => createGame(Array.from({ length: count }, (_, i) => `p${i}`), seed, config);

function vote(state: GameState, index = 0): GameState {
  const nodeId = state.run!.routeChoices[index]!.id;
  for (const p of state.players) state = applyAction(state, { type: "vote-route", playerId: p.id, requestId: `route-${state.run!.stage}`,
    auctionNumber: state.auction.number, nodeId });
  return state;
}

function finishMarket(state: GameState): GameState {
  while (state.phase === "SELLER_PREP") {
    const number = state.auction.number;
    state = applyAction(state, { type: "offer", playerId: state.auction.sellerId, requestId: `offer-${number}`, auctionNumber: number,
      relicId: state.auction.candidates[0].id, mode: "as-is" });
    for (const p of state.players.filter(p => p.id !== state.auction.sellerId)) state = applyAction(state,
      { type: "bid", playerId: p.id, requestId: `bid-${number}`, auctionNumber: number, amount: Math.min(1, p.coins) });
    state = advanceAuction(state);
  }
  return state;
}

test("run starts at a three-branch frontier without exposing seller truth, future offers or seed", () => {
  const state = run();
  assert.equal(state.phase, "ROUTE_CHOICE");
  assert.equal(state.setups.length, 9);
  assert.equal(state.jackpot, 0);
  assert.equal(state.houseCoins, 36);
  const view = viewFor(state, "p0");
  assert.equal(view.private.candidates, null);
  assert.equal(view.run!.routeChoices.length, 3);
  assert.equal(new Set(view.run!.routeChoices.map(n => n.id)).size, 3);
  assert.equal(Object.hasOwn(view, "seed"), false);
  assert.equal(Object.hasOwn(view.run!, "boonOffers"), false);
  assert.equal(Object.hasOwn(view, "setups"), false);
  assertEconomy(state);
});

test("route votes are private, immutable, retryable and resolve independently of packet order", () => {
  const state = run("ties", 4);
  const actions: Extract<Action, { type: "vote-route" }>[] = state.players.map((p, i) => ({ type: "vote-route", playerId: p.id, requestId: "vote", auctionNumber: 1, nodeId: state.run!.routeChoices[i % 2]!.id }));
  const partial = applyAction(state, actions[0]!);
  assert.equal(state.run!.votes.length, 0);
  assert.equal(viewFor(partial, "p1").private.routeVote, null);
  assert.deepEqual(viewFor(partial, "p0").private.routeVote, { nodeId: state.run!.routeChoices[0]!.id });
  assert.equal(applyAction(partial, actions[0]!), partial);
  assert.throws(() => applyAction(partial, { ...actions[0]!, nodeId: state.run!.routeChoices[1]!.id }), /another action/);
  assert.throws(() => applyAction(partial, { ...actions[0]!, requestId: "second" }), /already locked/);
  const first = actions.reduce(applyAction, state);
  const reverse = [...actions].reverse().reduce(applyAction, state);
  assert.deepEqual(first.run!.path, reverse.run!.path);
  assert.deepEqual(first.auction, reverse.auction);
  assert.deepEqual(first.setups, reverse.setups);
  assert.equal(first.phase, "SELLER_PREP");
  assert.equal(first.jackpot, first.run!.market!.ante);
  assert.throws(() => applyAction(state, { ...actions[0]!, nodeId: "3-0" }), /offered routes/);
  assertEconomy(first);
});

test("majority chooses its branch; all abstentions choose lowest curse risk and spend no player coins", () => {
  let state = run();
  const id = state.run!.routeChoices[1]!.id;
  for (const [i, p] of state.players.entries()) state = applyAction(state, { type: "vote-route", playerId: p.id,
    requestId: "vote", auctionNumber: 1, nodeId: i < 2 ? id : state.run!.routeChoices[0]!.id });
  assert.equal(state.run!.market!.id, id);
  state = run("abstain");
  const minimum = Math.min(...state.run!.routeChoices.map(n => n.cursedProbability));
  for (const p of state.players) state = applyAction(state, { type: "vote-route", playerId: p.id, requestId: "skip", auctionNumber: 1, nodeId: null });
  assert.equal(state.run!.market!.cursedProbability, minimum);
  assert.ok(state.players.every(p => p.coins === 15));
  assertEconomy(state);
});

test("branch selection changes current rules and future frontier; identical seeds and choices reproduce a run", () => {
  const start = run("branches");
  const a = vote(start, 0), b = vote(start, 1);
  assert.notDeepEqual(a.run!.market, b.run!.market);
  const next = (state: GameState) => {
    state = finishMarket(state);
    for (const p of state.players) state = applyAction(state, { type: "choose-boon", playerId: p.id, requestId: "skip", auctionNumber: state.auction.number, boonId: null });
    return state;
  };
  assert.notDeepEqual(next(a).run!.routeChoices, next(b).run!.routeChoices);
  assert.deepEqual(next(a), next(vote(run("branches"), 0)));
  const signatures = new Set(Array.from({ length: 50 }, (_, i) => JSON.stringify(run(`variety:${i}`).run!.routeChoices)));
  assert.ok(signatures.size >= 40, `only ${signatures.size} distinct frontiers`);
});

test("each buyer's random boon offers stay private; choice locks, skip is safe, old inventory is not repriced", () => {
  let state = finishMarket(vote(run("boons")));
  assert.equal(state.phase, "BOON_CHOICE");
  for (const p of state.players) assert.equal(viewFor(state, p.id).private.boonOptions!.length, 3);
  const actor = state.players[0]!;
  const options = viewFor(state, actor.id).private.boonOptions!;
  const oldPoints = scores(state).find(s => s.playerId === actor.id)!.relicPoints;
  const otherOnly = state.run!.boonOffers.flatMap(o => o.options).find(b => !options.some(mine => mine.id === b.id));
  assert.ok(otherOnly);
  assert.throws(() => applyAction(state, { type: "choose-boon", playerId: actor.id, requestId: "bad", auctionNumber: state.auction.number, boonId: otherOnly.id }), /own three offers/);
  const action: Action = { type: "choose-boon", playerId: actor.id, requestId: "boon", auctionNumber: state.auction.number, boonId: options[0]!.id };
  state = applyAction(state, action);
  assert.equal(applyAction(state, action), state);
  assert.equal(scores(state).find(s => s.playerId === actor.id)!.relicPoints, oldPoints);
  assert.throws(() => applyAction(state, { ...action, requestId: "another" }), /already locked/);
  for (const p of state.players.slice(1)) state = applyAction(state, { type: "choose-boon", playerId: p.id, requestId: "skip", auctionNumber: state.auction.number, boonId: null });
  assert.equal(state.phase, "ROUTE_CHOICE");
  assert.equal(state.run!.stage, 2);
  assert.equal(state.players[1]!.boons!.length, 0);
  assertEconomy(state);
  assert.deepEqual(replayEvents(state.events), state);
});

test("builds change the value of the same relic, and high-roller cap still respects the wallet", () => {
  let state = vote(run());
  const node = { ...state.run!.market!, genuineValue: 9, fakeValue: 1, cursePenalty: 6 };
  const cursed = { ...state.auction.candidates[0], family: "Mirror" as const, genuine: false, cursed: true };
  const actor = state.players[1]!;
  assert.equal(marketRelicScore(cursed, node), -5);
  assert.equal(boonBonus(cursed, node, { ...actor, boons: [{ id: "curse-eater", name: "fixture", description: "fixture" }] }), 8);
  assert.equal(boonBonus(cursed, node, { ...actor, boons: [{ id: "counterfeit", name: "fixture", description: "fixture" }] }), 6);
  assert.equal(boonBonus(cursed, node, { ...actor, boons: [{ id: "specialist", name: "fixture", description: "fixture", family: "Mirror" }] }), 5);
  state = applyAction(state, { type: "offer", playerId: "p0", requestId: "offer", auctionNumber: 1, relicId: state.auction.candidates[0].id, mode: "as-is" });
  const action: Action = { type: "bid", playerId: "p1", requestId: "bid", auctionNumber: 1, amount: 0, wager: { cursed: true, stake: 5 } };
  assert.throws(() => applyAction(state, action), /1–3/);
  // Explicit build fixture exercises the authoritative wager cap, independent of offer RNG.
  state.players[1]!.boons!.push({ id: "high-roller", name: "fixture", description: "fixture" });
  assert.equal(wagerLimit(state.players[1]!), 5);
  assert.throws(() => applyAction(state, { ...action, amount: 11 }), /fit your available/);
  state = applyAction(state, action);
  assert.equal(state.auction.bids[0]!.wager!.stake, 5);
  assert.equal(state.players[1]!.coins, 15);
  assertEconomy(state);
});

test("run messages reject injected seed, foreign actor, malformed choice and out-of-range stakes", () => {
  for (const action of [
    { type: "vote-route", nodeId: "1-0", seed: "mine" },
    { type: "vote-route", nodeId: "1-0", playerId: "p1" },
    { type: "vote-route", nodeId: {} },
    { type: "choose-boon", boonId: "unlimited-money" },
    { type: "choose-boon", boonId: ["lens"] },
  ]) assert.throws(() => parseMessage({ type: "action", matchId: "run", action: { requestId: "x", auctionNumber: 1, ...action } }));
  assert.deepEqual(parseMessage({ type: "action", matchId: "run", action: { type: "choose-boon", requestId: "x", auctionNumber: 4, boonId: null } }),
    { type: "action", matchId: "run", action: { type: "choose-boon", requestId: "x", auctionNumber: 4, boonId: null } });
});

test("300 synthetic 2/3/4-player roguelike runs preserve economy, equal seller turns, independent scores and exact replay", () => {
  for (const count of [2, 3, 4]) for (let trial = 0; trial < 100; trial++) {
    const seed = `run-proof:${count}:${trial}`;
    let state = run(seed, count);
    let actions = 0;
    while (state.phase !== "RESULTS") {
      if (state.phase === "ROUTE_CHOICE") state = vote(state, trial % 3);
      else if (state.phase === "BOON_CHOICE") {
        for (const p of state.players) {
          const boon = viewFor(state, p.id).private.boonOptions![trial % 3]!;
          state = applyAction(state, { type: "choose-boon", playerId: p.id, requestId: `boon-${state.run!.stage}`, auctionNumber: state.auction.number, boonId: boon.id });
          assertEconomy(state);
        }
      } else if (state.phase === "SELLER_PREP") {
        const n = state.auction.number;
        state = applyAction(state, { type: "offer", playerId: state.auction.sellerId, requestId: `offer-${n}`, auctionNumber: n,
          relicId: state.auction.candidates[trial % 2]!.id, mode: state.players.find(p => p.id === state.auction.sellerId)!.coins >= 2 && trial % 3 === 0 ? "genuine" : "as-is" });
      } else if (state.phase === "SEALED_BID") {
        for (const p of state.players.filter(p => p.id !== state.auction.sellerId)) {
          const n = state.auction.number;
          if (p.inspectionTokens > 0 && randomAt(seed, `${n}:${p.id}:inspect`) < .3) state = applyAction(state,
            { type: "inspect", playerId: p.id, requestId: `inspect-${n}`, auctionNumber: n, attribute: "cursed" });
          const stake = Math.min(p.coins, Math.floor(randomAt(seed, `${n}:${p.id}:stake`) * (wagerLimit(p) + 1)));
          const prediction = viewFor(state, p.id).private.inspection?.value ?? randomAt(seed, `${n}:${p.id}:predict`) < state.run!.market!.cursedProbability;
          state = applyAction(state, { type: "bid", playerId: p.id, requestId: `bid-${n}`, auctionNumber: n,
            amount: Math.min(p.coins - stake, 1 + trial % 4), ...(stake ? { wager: { cursed: prediction, stake } } : {}) });
          assertEconomy(state);
        }
      } else state = advanceAuction(state);
      assertEconomy(state);
      assert.ok(actions++ < 80);
    }
    assert.equal(state.history.length, count * 3);
    assert.equal(state.run!.path.length, 3);
    for (const p of state.players) {
      assert.equal(state.history.filter(h => h.sellerId === p.id).length, 3);
      assert.equal(p.boons!.length, 2);
      assert.equal(new Set(p.boons!.map(b => b.id)).size, 2);
      assert.deepEqual(scores(state).find(s => s.playerId === p.id), scoreFromHistory(p.id, state.history, state.config));
    }
    assert.equal(state.jackpot, 0);
    assert.deepEqual(replayEvents(state.events), state);
    const tampered = structuredClone(state.events);
    const node = tampered.find(e => e.type === "route-selected");
    assert.ok(node?.type === "route-selected");
    node.node.ante += 1;
    assert.throws(() => replayEvents(tampered), /outcomes do not match/);
  }
});
