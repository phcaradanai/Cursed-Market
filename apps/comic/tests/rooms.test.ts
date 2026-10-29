import assert from "node:assert/strict";
import test from "node:test";
import { assertEconomy, replayEvents, scores } from "../src/game/index.js";
import { analyseMatchAudit } from "../src/playtest/report.js";
import { parseMessage, MessageError } from "../src/server/messages.js";
import { RoomService } from "../src/server/rooms.js";
import type { Peer } from "../src/server/rooms.js";
import type { ClientMessage, RoomView, ServerMessage } from "../src/shared/protocol.js";

class Client implements Peer {
  messages: ServerMessage[] = [];
  closed: number | null = null;
  send(message: ServerMessage): void { this.messages.push(structuredClone(message)); }
  close(code: number): void { this.closed = code; }
  get room(): RoomView { const state = this.messages.findLast(m => m.type === "state"); assert.ok(state?.type === "state"); return state.room; }
  get joined() { const joined = this.messages.findLast(m => m.type === "joined"); assert.ok(joined?.type === "joined"); return joined; }
  get error() { return this.messages.findLast(m => m.type === "error"); }
}

function setup(count = 3) {
  let now = 1000;
  const rooms = new RoomService(() => now, { ROUTE_CHOICE: 10, BOON_CHOICE: 10, SELLER_PREP: 10, BUYER_INSPECTION: 10, SEALED_BID: 10, REVEAL: 10 }, 100);
  const clients = Array.from({ length: count }, () => new Client());
  rooms.handle(clients[0]!, { type: "create", name: "ผู้ขาย" });
  for (let i = 1; i < count; i++) rooms.handle(clients[i]!, { type: "join", name: `ผู้เล่น ${i}`, roomCode: clients[0]!.room.code });
  return { rooms, clients, advanceTime: () => { now += 11; rooms.tick(); }, expire: () => { now += 200; rooms.tick(); } };
}

function start(rooms: RoomService, clients: Client[]) {
  for (const client of clients) rooms.handle(client, { type: "ready", ready: true });
  rooms.handle(clients[0]!, { type: "start" });
  const room = clients[0]!.room;
  if (room.game?.phase === "ROUTE_CHOICE") for (const client of clients) rooms.handle(client, { type: "action", matchId: room.matchId!,
    action: { type: "vote-route", requestId: "route-1", auctionNumber: 1, nodeId: room.game.run!.routeChoices[0]!.id } });
}

test("runtime schema rejects impersonation, extra fields, invalid names, bids and tokens", () => {
  for (const message of [null, [], { type: "create", name: "" }, { type: "create", name: "x", token: "secret" }, { type: "resume", roomCode: "ABC234", token: "bad" },
    { type: "action", matchId: "match", action: { type: "bid", playerId: "victim", requestId: "x", auctionNumber: 1, amount: 1 } },
    { type: "action", matchId: "match", action: { type: "bid", requestId: "x", auctionNumber: 1, amount: -1 } },
    { type: "action", matchId: "match", action: { type: "inspect", requestId: "x", auctionNumber: 1, attribute: "both" } },
  ]) assert.throws(() => parseMessage(message), e => e instanceof MessageError);
  assert.deepEqual(parseMessage({ type: "join", roomCode: "abc234", name: " ไทย " }), { type: "join", roomCode: "ABC234", name: "ไทย" });
});

test("room capacity, ready/start and host authority enforce 2–4 seats", () => {
  const { rooms, clients } = setup(4);
  const extra = new Client();
  rooms.handle(extra, { type: "join", roomCode: clients[0]!.room.code, name: "คนที่ห้า" });
  assert.equal(extra.error?.type === "error" && extra.error.code, "room-full");
  rooms.handle(clients[1]!, { type: "start" });
  assert.equal(clients[1]!.error?.type === "error" && clients[1]!.error!.code, "host-only");
  rooms.handle(clients[0]!, { type: "start" });
  assert.equal(clients[0]!.error?.type === "error" && clients[0]!.error!.code, "not-ready");
  start(rooms, clients);
  assert.equal(clients[0]!.room.game!.players.length, 4);
  assert.equal(clients[0]!.room.game!.totalAuctions, 12);
  const late = new Client();
  rooms.handle(late, { type: "join", roomCode: clients[0]!.room.code, name: "สาย" });
  assert.equal(late.error?.type === "error" && late.error.code, "match-started");
});

test("tokens stay private, reconnect restores a locked inspection and bid and replaces old socket", () => {
  const { rooms, clients } = setup(3);
  start(rooms, clients);
  const [seller, buyer, other] = clients as [Client, Client, Client];
  const matchId = seller.room.matchId!;
  const card = seller.room.game!.private.candidates![0];
  rooms.handle(seller, { type: "action", matchId, action: { type: "offer", requestId: "offer", auctionNumber: 1, relicId: card.id, mode: "genuine" } });
  assert.deepEqual(Object.keys(buyer.room.game!.auction.offer!.relic).sort(), ["family", "id", "name"]);
  rooms.handle(buyer, { type: "action", matchId, action: { type: "inspect", requestId: "inspect", auctionNumber: 1, attribute: "cursed" } });
  assert.equal(other.room.game!.private.inspection, null);
  assert.ok(buyer.room.game!.private.inspection);
  rooms.handle(other, { type: "action", matchId, action: { type: "pass-inspection", requestId: "pass", auctionNumber: 1 } });
  rooms.handle(buyer, { type: "action", matchId, action: { type: "bid", requestId: "bid", auctionNumber: 1, amount: 4 } });
  assert.equal(other.room.game!.private.bid, null);
  const secret = buyer.joined.token;
  assert.equal(JSON.stringify(other.messages).includes(secret), false);
  rooms.disconnect(buyer);
  const resumed = new Client();
  rooms.handle(resumed, { type: "resume", roomCode: seller.room.code, token: secret });
  assert.equal(resumed.room.yourSeatId, buyer.room.yourSeatId);
  assert.equal(resumed.room.game!.private.bid!.amount, 4);
  assert.deepEqual(resumed.room.game!.private.inspection, buyer.room.game!.private.inspection);
  const replacement = new Client();
  rooms.handle(replacement, { type: "resume", roomCode: seller.room.code, token: secret });
  assert.equal(resumed.closed, 4001);
  rooms.disconnect(resumed); // A delayed close event cannot disconnect the new binding.
  assert.equal(replacement.room.seats.find(s => s.id === replacement.room.yourSeatId)!.connected, true);
  rooms.handle(resumed, { type: "ready", ready: false });
  assert.equal(resumed.error?.type === "error" && resumed.error.code, "not-seated");
});

test("deadlines do not extend on partial choices; duplicate final bid settles once", () => {
  const { rooms, clients } = setup(3);
  start(rooms, clients);
  const [seller, buyer, other] = clients as [Client, Client, Client];
  const matchId = seller.room.matchId!;
  const offer: ClientMessage = { type: "action", matchId, action: { type: "offer", requestId: "offer", auctionNumber: 1, relicId: seller.room.game!.private.candidates![0].id, mode: "as-is" } };
  rooms.handle(seller, offer);
  const deadline = buyer.room.deadline;
  rooms.handle(buyer, { type: "action", matchId, action: { type: "pass-inspection", requestId: "pass", auctionNumber: 1 } });
  assert.equal(buyer.room.deadline, deadline);
  rooms.handle(other, { type: "action", matchId, action: { type: "pass-inspection", requestId: "pass", auctionNumber: 1 } });
  rooms.handle(buyer, { type: "action", matchId, action: { type: "bid", requestId: "bid", auctionNumber: 1, amount: 3 } });
  const final: ClientMessage = { type: "action", matchId, action: { type: "bid", requestId: "bid", auctionNumber: 1, amount: 2 } };
  rooms.handle(other, final);
  const revision = seller.room.game!.revision;
  rooms.handle(other, final);
  assert.equal(seller.room.game!.revision, revision);
  assert.equal(seller.room.game!.history.length, 1);
  assert.equal(seller.room.game!.players.reduce((sum, p) => sum + p.relics.length, 0), 1);
});

test("offline seller/buyers use safe defaults and every match completes without elimination", () => {
  for (const count of [2, 3, 4]) {
    const { rooms, clients, advanceTime } = setup(count);
    start(rooms, clients);
    for (const client of clients.slice(1)) rooms.disconnect(client);
    let steps = 0;
    while (clients[0]!.room.game!.phase !== "RESULTS" && steps++ < 60) advanceTime();
    const room = clients[0]!.room;
    assert.equal(room.game!.phase, "RESULTS");
    assert.ok(room.game!.players.every(p => p.coins === 15 && p.inspectionTokens === 2));
    assert.ok(room.game!.history.every(result => result.mode === "as-is" && result.winnerId === null));
    rooms.handle(clients[0]!, { type: "audit", matchId: room.matchId! });
    const output = clients[0]!.messages.findLast(m => m.type === "audit");
    assert.ok(output?.type === "audit");
    const replayed = replayEvents(output.audit.events);
    assertEconomy(replayed);
    assert.deepEqual(scores(replayed), output.audit.scores);
    assert.equal(output.audit.seats.length, count);
    assert.ok(output.audit.timeouts.length > 0);
    assert.equal(output.audit.phaseTimes.length, room.game!.totalAuctions * 3 + 5);
    assert.equal(analyseMatchAudit(output.audit).run!.path.length, 3);
  }
});

test("route and boon deadlines stay fixed; reconnect retains votes and private offers while defaults skip unresolved choices", () => {
  const { rooms, clients, advanceTime } = setup(3);
  for (const client of clients) rooms.handle(client, { type: "ready", ready: true });
  rooms.handle(clients[0]!, { type: "start" });
  const initial = clients[0]!.room;
  assert.equal(initial.game!.phase, "ROUTE_CHOICE");
  const vote: ClientMessage = { type: "action", matchId: initial.matchId!, action: { type: "vote-route", requestId: "v", auctionNumber: 1,
    nodeId: initial.game!.run!.routeChoices[1]!.id } };
  rooms.handle(clients[1]!, vote);
  assert.equal(clients[0]!.room.deadline, initial.deadline);
  assert.equal(clients[0]!.room.game!.private.routeVote, null);
  const replacement = new Client();
  rooms.disconnect(clients[1]!);
  rooms.handle(replacement, { type: "resume", roomCode: initial.code, token: clients[1]!.joined.token });
  assert.deepEqual(replacement.room.game!.private.routeVote, { nodeId: initial.game!.run!.routeChoices[1]!.id });
  rooms.handle(replacement, vote);
  advanceTime();
  assert.equal(replacement.room.game!.phase, "SELLER_PREP");
  assert.equal(replacement.room.game!.run!.market!.id, initial.game!.run!.routeChoices[1]!.id);
  const phase = () => replacement.room.game!.phase;
  for (let i = 0; phase() !== "BOON_CHOICE" && i < 12; i++) advanceTime();
  assert.equal(phase(), "BOON_CHOICE");
  const before = replacement.room;
  const options = before.game!.private.boonOptions!;
  rooms.handle(replacement, { type: "action", matchId: before.matchId!, action: { type: "choose-boon", requestId: "b", auctionNumber: before.game!.auction.number, boonId: options[0]!.id } });
  assert.equal(replacement.room.deadline, before.deadline);
  const resumed = new Client();
  rooms.disconnect(replacement);
  rooms.handle(resumed, { type: "resume", roomCode: initial.code, token: clients[1]!.joined.token });
  assert.deepEqual(resumed.room.game!.private.boonOptions, options);
  assert.deepEqual(resumed.room.game!.private.boonPick, { boonId: options[0]!.id });
  advanceTime();
  assert.equal(resumed.room.game!.phase, "ROUTE_CHOICE");
  assert.equal(resumed.room.game!.players.find(p => p.id === resumed.room.yourSeatId)!.boons!.length, 1);
  assert.equal(resumed.room.game!.players.find(p => p.id === initial.yourSeatId)!.boons!.length, 0);
});

test("audit is inaccessible before results and stale match actions reject after rematch", () => {
  const { rooms, clients, advanceTime } = setup(2);
  start(rooms, clients);
  const oldMatch = clients[0]!.room.matchId!;
  rooms.handle(clients[0]!, { type: "audit", matchId: oldMatch });
  assert.equal(clients[0]!.error?.type === "error" && clients[0]!.error!.code, "audit-private");
  while (clients[0]!.room.game!.phase !== "RESULTS") advanceTime();
  rooms.handle(clients[0]!, { type: "rematch" });
  assert.equal(clients[0]!.room.game, null);
  assert.ok(clients[0]!.room.seats.every(s => !s.ready));
  start(rooms, clients);
  assert.notEqual(clients[0]!.room.matchId, oldMatch);
  rooms.handle(clients[0]!, { type: "action", matchId: oldMatch, action: { type: "offer", requestId: "old", auctionNumber: 1, relicId: "lot-1-1", mode: "as-is" } });
  assert.equal(clients[0]!.error?.type === "error" && clients[0]!.error!.code, "stale-match");
});

test("lobby host passes to a connected player; offline seats can be removed and tokens revoked", () => {
  const { rooms, clients, expire } = setup(3);
  const [host, next, other] = clients as [Client, Client, Client];
  const token = host.joined.token;
  const code = host.room.code;
  rooms.disconnect(host);
  assert.equal(next.room.hostId, next.room.yourSeatId);
  rooms.handle(next, { type: "remove-seat", seatId: host.room.yourSeatId });
  assert.equal(next.room.seats.length, 2);
  const resume = new Client();
  rooms.handle(resume, { type: "resume", roomCode: code, token });
  assert.equal(resume.error?.type === "error" && resume.error.code, "seat-missing");
  rooms.disconnect(next); rooms.disconnect(other); expire();
  assert.equal(rooms.count, 0);
});

test("reveal advances only on all seat acknowledgements or timer; stale acknowledgements reject", () => {
  const { rooms, clients, advanceTime } = setup(2);
  start(rooms, clients);
  advanceTime(); advanceTime();
  assert.equal(clients[0]!.room.game!.phase, "REVEAL");
  const matchId = clients[0]!.room.matchId!;
  rooms.handle(clients[0]!, { type: "reveal-ready", matchId, auctionNumber: 1 });
  rooms.handle(clients[0]!, { type: "reveal-ready", matchId, auctionNumber: 1 });
  assert.equal(clients[0]!.room.revealReady.length, 1);
  rooms.handle(clients[1]!, { type: "reveal-ready", matchId, auctionNumber: 1 });
  assert.equal(clients[0]!.room.game!.auction.number, 2);
  rooms.handle(clients[1]!, { type: "reveal-ready", matchId, auctionNumber: 1 });
  assert.equal(clients[1]!.error?.type === "error" && clients[1]!.error!.code, "stale-reveal");
});
