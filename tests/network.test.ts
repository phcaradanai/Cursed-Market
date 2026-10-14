import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { once } from "node:events";
import test from "node:test";
import type { AddressInfo } from "node:net";
import { WebSocket } from "ws";
import { createApp } from "../src/server/app.js";
import { RoomService } from "../src/server/rooms.js";
import { replayEvents, scores } from "../src/game/index.js";
import { analyseMatchAudit } from "../src/playtest/report.js";
import type { ClientMessage, RoomView, ServerMessage } from "../src/shared/protocol.js";

class SocketClient extends EventEmitter {
  messages: ServerMessage[] = [];
  constructor(readonly socket: WebSocket) {
    super();
    socket.on("message", raw => { this.messages.push(JSON.parse(raw.toString()) as ServerMessage); this.emit("update"); });
  }
  static async open(url: string) {
    const socket = new WebSocket(url);
    const client = new SocketClient(socket);
    await once(socket, "open");
    return client;
  }
  send(message: ClientMessage) { this.socket.send(JSON.stringify(message)); }
  get room(): RoomView | undefined { const message = this.messages.findLast(m => m.type === "state"); return message?.type === "state" ? message.room : undefined; }
  async until<T>(read: () => T | undefined): Promise<T> {
    const available = read();
    if (available !== undefined) return available;
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => { this.off("update", update); reject(new Error("Network condition timed out")); }, 5000);
      const update = () => { const value = read(); if (value !== undefined) { clearTimeout(timer); this.off("update", update); resolve(value); } };
      this.on("update", update);
      update();
    });
  }
  async phase(phase: string, auctionNumber?: number) {
    return this.until(() => this.room?.game?.phase === phase && (auctionNumber === undefined || this.room.game.auction.number === auctionNumber) ? this.room : undefined);
  }
}

async function listen(app: ReturnType<typeof createApp>) {
  app.server.listen(0, "127.0.0.1");
  await once(app.server, "listening");
  return `http://127.0.0.1:${(app.server.address() as AddressInfo).port}`;
}

async function chooseRoute(clients: SocketClient[], number: number, matchId: string) {
  await Promise.all(clients.map(c => c.phase("ROUTE_CHOICE", number)));
  for (const [i, client] of clients.entries()) client.send({ type: "action", matchId,
    action: { type: "vote-route", requestId: `route-${number}`, auctionNumber: number, nodeId: client.room!.game!.run!.routeChoices[i % 3]!.id } });
  await Promise.all(clients.map(c => c.phase("SELLER_PREP", number)));
}

async function chooseBoons(clients: SocketClient[], number: number, matchId: string) {
  await Promise.all(clients.map(c => c.phase("BOON_CHOICE", number)));
  for (const [i, client] of clients.entries()) client.send({ type: "action", matchId,
    action: { type: "choose-boon", requestId: `boon-${number}`, auctionNumber: number, boonId: client.room!.game!.private.boonOptions![i % 3]!.id } });
  await chooseRoute(clients, number, matchId);
}

test("real WebSocket protocol authenticates seats, keeps private data private and resumes locked bids", async t => {
  const app = createApp();
  t.after(() => app.close());
  const url = await listen(app);
  const seller = await SocketClient.open(url.replace("http:", "ws:") + "/socket");
  const buyer = await SocketClient.open(url.replace("http:", "ws:") + "/socket");
  const other = await SocketClient.open(url.replace("http:", "ws:") + "/socket");
  seller.send({ type: "create", name: "เจ้าของ" });
  const room = await seller.until(() => seller.room);
  buyer.send({ type: "join", name: "ผู้ซื้อ", roomCode: room.code });
  other.send({ type: "join", name: "อีกคน", roomCode: room.code });
  await seller.until(() => seller.room?.seats.length === 3 ? true : undefined);
  for (const client of [seller, buyer, other]) { await client.until(() => client.room); client.send({ type: "ready", ready: true }); }
  await seller.until(() => seller.room?.seats.every(s => s.ready) ? true : undefined);
  seller.send({ type: "start" });
  const frontier = await seller.phase("ROUTE_CHOICE", 1);
  assert.equal(frontier.game!.private.candidates, null);
  await chooseRoute([seller, buyer, other], 1, frontier.matchId!);
  const started = await seller.phase("SELLER_PREP", 1);
  const matchId = started.matchId!;
  assert.equal(buyer.room?.game?.private.candidates ?? null, null);
  seller.send({ type: "action", matchId, action: { type: "offer", requestId: "offer", auctionNumber: 1, relicId: started.game!.private.candidates![0].id, mode: "genuine" } });
  await buyer.phase("SEALED_BID", 1);
  assert.deepEqual(Object.keys(buyer.room!.game!.auction.offer!.relic).sort(), ["family", "id", "name"]);
  buyer.send({ type: "action", matchId, action: { type: "inspect", requestId: "inspect", auctionNumber: 1, attribute: "cursed" } });
  other.send({ type: "action", matchId, action: { type: "pass-inspection", requestId: "pass", auctionNumber: 1 } });
  await buyer.phase("SEALED_BID", 1);
  await other.phase("SEALED_BID", 1);
  assert.equal(other.room!.game!.private.inspection?.attribute ?? null, null);
  buyer.socket.send(JSON.stringify({ type: "action", matchId, action: { type: "bid", requestId: "spoof", auctionNumber: 1, amount: 5, playerId: started.yourSeatId } }));
  await buyer.until(() => buyer.messages.find(m => m.type === "error" && m.code === "invalid-message"));
  buyer.send({ type: "action", matchId, action: { type: "bid", requestId: "bid", auctionNumber: 1, amount: 5, wager: { cursed: true, stake: 3 } } });
  await buyer.until(() => buyer.room?.game?.private.bid?.amount === 5 ? true : undefined);
  await other.until(() => other.room?.game?.auction.bidReady.length === 1 ? true : undefined);
  assert.equal(other.room!.game!.private.bid, null);
  assert.equal(other.room!.game!.players.find(p => p.id === buyer.room!.yourSeatId)!.coins, 15);
  const joined = buyer.messages.find(m => m.type === "joined");
  assert.ok(joined?.type === "joined");
  assert.equal(JSON.stringify(other.messages).includes(joined.token), false);
  buyer.socket.terminate();
  const resumed = await SocketClient.open(url.replace("http:", "ws:") + "/socket");
  resumed.send({ type: "resume", roomCode: room.code, token: joined.token });
  const restored = await resumed.until(() => resumed.room);
  assert.equal(restored.yourSeatId, buyer.room!.yourSeatId);
  assert.equal(restored.game!.private.bid!.amount, 5);
  assert.deepEqual(restored.game!.private.bid!.wager, { cursed: true, stake: 3 });
  assert.deepEqual(restored.game!.private.inspection, buyer.room!.game!.private.inspection);
  const last: ClientMessage = { type: "action", matchId, action: { type: "bid", requestId: "last", auctionNumber: 1, amount: 3 } };
  other.send(last); other.send(last);
  await other.phase("REVEAL", 1);
  assert.equal(other.room!.game!.history.length, 1);
  assert.equal(other.room!.game!.players.reduce((n, p) => n + p.relics.length, 0), 1);
});

for (const count of [2, 3, 4]) test(`real network ${count}-player match reaches results, exports replayable audit and rematches`, async t => {
  const app = createApp();
  t.after(() => app.close());
  const url = (await listen(app)).replace("http:", "ws:") + "/socket";
  const clients: SocketClient[] = [];
  for (let i = 0; i < count; i++) clients.push(await SocketClient.open(url));
  clients[0]!.send({ type: "create", name: "ผู้เล่น 1" });
  const room = await clients[0]!.until(() => clients[0]!.room);
  for (let i = 1; i < count; i++) {
    clients[i]!.send({ type: "join", roomCode: room.code, name: `ผู้เล่น ${i + 1}` });
    await clients[i]!.until(() => clients[i]!.room);
  }
  for (const client of clients) client.send({ type: "ready", ready: true });
  await clients[0]!.until(() => clients[0]!.room?.seats.every(s => s.ready) ? true : undefined);
  clients[0]!.send({ type: "start" });
  const frontier = await clients[0]!.phase("ROUTE_CHOICE", 1);
  await chooseRoute(clients, 1, frontier.matchId!);
  let current = await clients[0]!.phase("SELLER_PREP", 1);
  const matchId = current.matchId!;
  for (let number = 1; number <= current.game!.totalAuctions; number++) {
    await Promise.all(clients.map(c => c.phase("SELLER_PREP", number)));
    const seller = clients.find(c => c.room!.yourSeatId === c.room!.game!.auction.sellerId)!;
    const buyers = clients.filter(c => c !== seller);
    seller.send({ type: "action", matchId, action: { type: "offer", requestId: `offer-${number}`, auctionNumber: number, relicId: seller.room!.game!.private.candidates![0].id, mode: "as-is" } });
    await Promise.all(buyers.map(c => c.phase("SEALED_BID", number)));
    for (const [index, buyer] of buyers.entries()) {
      const coins = buyer.room!.game!.players.find(p => p.id === buyer.room!.yourSeatId)!.coins;
      buyer.send({ type: "action", matchId, action: { type: "bid", requestId: `bid-${number}`, auctionNumber: number,
        amount: Math.min(2, Math.max(0, coins - 1)), ...(coins > 0 ? { wager: { cursed: (number + index) % 2 === 0, stake: 1 } } : {}) } });
    }
    await Promise.all(clients.map(c => c.phase("REVEAL", number)));
    for (const client of clients) client.send({ type: "reveal-ready", matchId, auctionNumber: number });
    if (number !== current.game!.totalAuctions) {
      if (number % count === 0) await chooseBoons(clients, number + 1, matchId);
      current = await clients[0]!.phase("SELLER_PREP", number + 1);
    }
  }
  const final = await clients[0]!.phase("RESULTS");
  assert.equal(final.game!.history.length, count * 3);
  clients[0]!.send({ type: "audit", matchId });
  const audit = await clients[0]!.until(() => clients[0]!.messages.find(m => m.type === "audit"));
  assert.ok(audit.type === "audit");
  const replayed = replayEvents(audit.audit.events);
  assert.deepEqual(scores(replayed), final.game!.results!.scores);
  assert.equal(audit.audit.timeouts.length, 0);
  const report = analyseMatchAudit(audit.audit);
  assert.equal(report.rulesVersion, "0.3-roguelike-experimental");
  assert.equal(report.run!.path.length, 3);
  assert.ok(report.run!.builds.every(b => b.boons!.length === 2));
  assert.ok(report.curseWagers.count > 0);
  assert.deepEqual(report.phaseSeconds.BUYER_INSPECTION, { mean: null, max: null });
  clients[0]!.send({ type: "rematch" });
  await clients[0]!.until(() => clients[0]!.room?.game === null ? true : undefined);
  assert.ok(clients[0]!.room!.seats.every(s => !s.ready));
  for (const client of clients) client.send({ type: "ready", ready: true });
  await clients[0]!.until(() => clients[0]!.room?.seats.every(s => s.ready) ? true : undefined);
  clients[0]!.send({ type: "start" });
  const restarted = await clients[0]!.phase("ROUTE_CHOICE", 1);
  assert.notEqual(restarted.matchId, matchId);
  assert.equal(restarted.game!.run!.path.length, 0);
  assert.ok(restarted.game!.players.every(p => p.coins === 15 && p.inspectionTokens === 2 && p.boons!.length === 0));
});

test("HTTP only serves client assets and cross-origin WebSocket upgrades reject", async t => {
  const app = createApp();
  t.after(() => app.close());
  const url = await listen(app);
  const health = await fetch(url + "/health");
  assert.deepEqual(await health.json(), { ok: true });
  for (const path of ["/src/game/engine.ts", "/docs/simulation/engine-v0.1/example-match.json", "/package.json", "/%2e%2e%2fpackage.json"]) {
    const response = await fetch(url + path);
    assert.ok(response.status === 403 || response.status === 404);
  }
  const socket = new WebSocket(url.replace("http:", "ws:") + "/socket", { origin: "https://unrelated.example" });
  await new Promise<void>((resolve, reject) => {
    socket.once("open", () => { socket.terminate(); reject(new Error("Cross-origin socket opened")); });
    socket.once("error", error => { assert.match(error.message, /403/); resolve(); });
  });
});

test("network timeout defaults are visible in room projections", async t => {
  let now = 1000;
  const rooms = new RoomService(() => now, { ROUTE_CHOICE: 10, BOON_CHOICE: 10, SELLER_PREP: 10, BUYER_INSPECTION: 10, SEALED_BID: 10, REVEAL: 10 });
  const app = createApp({ rooms });
  t.after(() => app.close());
  const url = (await listen(app)).replace("http:", "ws:") + "/socket";
  const a = await SocketClient.open(url), b = await SocketClient.open(url);
  a.send({ type: "create", name: "A" });
  const room = await a.until(() => a.room);
  b.send({ type: "join", name: "B", roomCode: room.code });
  await b.until(() => b.room);
  a.send({ type: "ready", ready: true }); b.send({ type: "ready", ready: true });
  await a.until(() => a.room?.seats.every(s => s.ready) ? true : undefined);
  a.send({ type: "start" }); await a.phase("ROUTE_CHOICE");
  now += 11; rooms.tick(); await a.phase("SELLER_PREP");
  now += 11; rooms.tick(); await b.phase("SEALED_BID");
  assert.equal(b.room!.game!.auction.offer!.mode, "as-is");
  assert.equal(b.room!.game!.players.find(p => p.id === b.room!.yourSeatId)!.inspectionTokens, 2);
  now += 11; rooms.tick(); await b.phase("REVEAL");
  assert.equal(b.room!.game!.history[0]!.winnerId, null);
});
