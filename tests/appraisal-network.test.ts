import assert from 'node:assert/strict';
import { dismissEvent } from './event-dismiss.js';
import { EventEmitter, once } from 'node:events';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { AddressInfo } from 'node:net';
import test from 'node:test';
import { WebSocket } from 'ws';
import { createApp } from '../src/server/app.js';
import { AppraisalRoomService } from '../src/server/appraisal-rooms.js';
import { createAppraisalRun, replayAppraisalAudit, SURVIVAL_RULES } from '../src/game/appraisal/index.js';
import type { AppraisalState, AppraisalConfig } from '../src/game/appraisal/types.js';
import { offerEvent } from '../src/game/appraisal/events.js';
import { appraisalBotDecision } from '../src/simulation/appraisal.js';
import type { AppraisalClientMessage, AppraisalRoomView, AppraisalServerMessage, AppraisalSeatAction } from '../src/shared/appraisal-protocol.js';

class SocketClient extends EventEmitter {
  messages: AppraisalServerMessage[] = [];
  constructor(readonly socket: WebSocket) { super(); socket.on('message', raw => { this.messages.push(JSON.parse(raw.toString()) as AppraisalServerMessage); this.emit('update'); }); }
  static async open(url: string) { const socket = new WebSocket(url); const c = new SocketClient(socket); await once(socket, 'open'); return c; }
  send(message: AppraisalClientMessage) { this.socket.send(JSON.stringify(message)); }
  get room(): AppraisalRoomView | undefined { const m = this.messages.findLast(m => m.type === 'state'); return m?.type === 'state' ? m.room : undefined; }
  get joined() { const m = this.messages.findLast(m => m.type === 'joined'); assert(m?.type === 'joined'); return m; }
  async until<T>(read: () => T | undefined): Promise<T> {
    const available = read(); if (available !== undefined) return available;
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => { this.off('update', update); reject(new Error(`v0.4 network condition timed out; phase=${this.room?.game?.phase}; replies=${JSON.stringify(this.messages.slice(-6).map(m => m.type === 'ack' ? {type:m.type,id:m.requestId} : m.type === 'error' ? {type:m.type,id:m.requestId,code:m.code} : {type:m.type}))}`)); }, 5000);
      const update = () => { const value = read(); if (value !== undefined) { clearTimeout(timer); this.off('update', update); resolve(value); } }; this.on('update', update); update();
    });
  }
  async phase(phase: string, encounter?: number) { return this.until(() => this.room?.game?.phase === phase && (encounter === undefined || this.room.game.encounter === encounter) ? this.room : undefined); }
}
class TestRooms extends AppraisalRoomService {
  constructor(now: () => number = Date.now, private readonly config: Partial<AppraisalConfig> = {}, durations: ConstructorParameters<typeof AppraisalRoomService>[1] = {}) { super(now, durations); }
  protected createGame(ids: string[], seed: string): AppraisalState { return createAppraisalRun(ids, seed, this.config); }
  state(code: string): AppraisalState { const state = this.rooms.get(code)?.game; assert(state); return state; }
  publish(code: string): void { const room = this.rooms.get(code); assert(room); this.broadcast(room); }
}
async function listen(app: ReturnType<typeof createApp>) { app.server.listen(0, '127.0.0.1'); await once(app.server, 'listening'); return `http://127.0.0.1:${(app.server.address() as AddressInfo).port}`; }
async function setup(count: number, rooms: AppraisalRoomService = new AppraisalRoomService()) {
  const app = createApp({ rooms }); const http = await listen(app), url = http.replace('http:', 'ws:') + '/socket';
  const clients: SocketClient[] = []; for (let i = 0; i < count; i++) clients.push(await SocketClient.open(url));
  clients[0]!.send({ type: 'create', name: 'เจ้าของ' }); const lobby = await clients[0]!.until(() => clients[0]!.room);
  for (const c of clients.slice(1)) { c.send({ type: 'join', name: 'นักประเมิน', roomCode: lobby.code }); await c.until(() => c.room); }
  for (const c of clients) c.send({ type: 'ready', ready: true }); await clients[0]!.until(() => clients[0]!.room?.seats.every(p => p.ready) ? true : undefined);
  clients[0]!.send({ type: 'start' }); await Promise.all(clients.map(c => c.phase('PORTALS', 1)));
  let request = 0;
  async function act(c: SocketClient, body: Record<string, unknown>, requestId = `network-${++request}`) {
    const before = c.room!.game!.revision;
    c.send({ type: 'action', matchId: c.room!.matchId!, action: { ...body, requestId, encounter: c.room!.game!.encounter } as AppraisalSeatAction });
    const reply = await c.until(() => c.messages.findLast(m => (m.type === 'ack' || m.type === 'error') && m.requestId === requestId));
    assert.equal(reply.type, 'ack', JSON.stringify(reply));
    await c.until(() => c.room!.game!.revision > before ? true : undefined);
    const revision = c.room!.game!.revision; await Promise.all(clients.filter(p => p.socket.readyState === WebSocket.OPEN).map(p => p.until(() => p.room!.game!.revision >= revision ? true : undefined)));
  }
  async function decline(c: SocketClient) { const offer = c.room!.game!.self.eventOffer; if (offer) await act(c, { type: 'event', key: offer.key, ...dismissEvent(offer) }); }
  async function enter() {
    for (const c of clients) { await decline(c); await act(c, { type: 'enter', portalId: c.room!.game!.self.portals.find(p => !p.disabled)!.id }); }
    await Promise.all(clients.map(c => c.phase('APPRAISAL', 1))); for (const c of clients) await decline(c);
  }
  async function endPhase() { const phase = clients[0]!.room!.game!.phase; for (const c of clients) if (c.room!.game!.phase === phase && !c.room!.game!.self.done && !c.room!.game!.self.paused) await act(c, { type: 'done' }); }
  return { app, http, url, clients, act, decline, enter, endPhase };
}
test('actual sockets apply stacked free inspections, 20% commission, noble income and hat odds then reset free uses',async t=>{
  // This regression checks named baseline amounts, so generated sources must be Common.
  const rarity=defaultRarityConfig();rarity.rates={common:1,uncommon:0,rare:0,epic:0,legendary:0,mythic:0};
  const rooms=new TestRooms(Date.now,{rarity,catalogVersion:3,survival:SURVIVAL_RULES,startingCredits:200,marketProbability:0,freeMerchantAction:false});const s=await setup(2,rooms);t.after(()=>s.app.close());await s.enter();
  const a=s.clients[0]!,state=rooms.state(a.room!.code),p=state.players.find(p=>p.id===a.room!.yourSeatId)!;
  for(const kind of ['inspection-warrant','tax-order','noble-seal','gambler-hat'] as const)for(let n=0;n<2;n++){const source=state.items[p.stock[0]!]!,id=`socket-${kind}-${n}`;state.items[id]={...source,id,kind,owner:p.id,genuine:false,cursed:true};p.inventory.push(id);}
  const target=state.items[p.stock[0]!]!;Object.assign(target,{npc:'orc',kind:'eclipse-blade',base:40,ask:40,reservation:1});p.energy=0;rooms.publish(a.room!.code);await a.until(()=>a.room!.game!.self.inventory.length===8?true:undefined);
  assert.equal(a.room!.game!.self.stock[0]!.range,undefined);await s.act(a,{type:'inspect',itemId:target.id,property:'price'});assert.equal(a.room!.game!.self.energy,0);assert.equal(a.room!.game!.self.passiveUses!.price,1);
  rooms.state(a.room!.code).players.find(p=>p.id===a.room!.yourSeatId)!.energy=2;rooms.publish(a.room!.code);await a.until(()=>a.room!.game!.self.energy===2?true:undefined);
  await s.act(a,{type:'appraise',itemId:target.id,value:40,acceptDanger:true});await s.act(a,{type:'buy',itemIds:[target.id],condition:false});assert.equal(a.room!.game!.self.credits,168);
  await s.endPhase();await s.endPhase();assert.equal(a.room!.game!.phase,'REVEAL');assert.equal(a.room!.game!.self.roundReward!.amount,14);assert.equal(a.room!.game!.self.roundReward!.winChance,60);await s.act(a,{type:'round-bank'});assert.equal(a.room!.game!.self.credits,182);
  for(const c of s.clients)c.send({type:'reveal-ready',matchId:c.room!.matchId!,encounter:1});await Promise.all(s.clients.map(c=>c.phase('PORTALS',2)));assert.deepEqual(a.room!.game!.self.passiveUses,{});
});
test('actual sockets pay appraisal commission, retain NPC trust and settle an explicit market mismatch cost',async t=>{
  const rooms=new TestRooms(Date.now,{marketProbability:0});const s=await setup(2,rooms);t.after(()=>s.app.close());await s.enter();
  const a=s.clients[0]!;let state=rooms.state(a.room!.code);const p=state.players.find(p=>p.id===a.room!.yourSeatId)!;
  const item=state.items[p.stock[0]!]!;item.base=40;item.ask=40;item.reservation=1;item.genuine=true;item.cursed=false;
  await s.act(a,{type:'appraise',itemId:item.id,value:40,acceptDanger:true});await s.act(a,{type:'buy',itemIds:[item.id],condition:false});
  assert.equal(a.room!.game!.self.credits,4);assert.equal(a.room!.game!.self.npcTrust![item.npc],1);
  state=rooms.state(a.room!.code);state.items[item.id]!.cursed=true;
  state.market={encounter:1,open:true,budget:56,orders:[{id:'socket-contract',kind:item.kind,price:25,quota:Object.fromEntries(state.players.map(p=>[p.id,1])),contract:{requirements:[{property:'cursed',value:false}],bonus:{kind:'credits',amount:3},fullPriceCost:{kind:'energy',amount:2}}}]};
  rooms.publish(a.room!.code);await a.until(()=>a.room!.game!.market.orders[0]?.id==='socket-contract'?true:undefined);
  assert.equal(a.room!.game!.self.inventory[0]!.knowledge.cursed,undefined);const energy=a.room!.game!.self.energy;
  await s.act(a,{type:'market-sell',itemId:item.id,orderId:'socket-contract',resolution:'sacrifice'});
  assert.equal(a.room!.game!.self.credits,4+25*(item.rarityPower?.valueMultiplier??1));assert.equal(a.room!.game!.self.energy,energy-2);assert.equal(a.room!.game!.self.npcTrust![item.npc],1);assert.equal(a.room!.game!.self.inventory.length,0);
  assert(a.room!.game!.self.notes.at(-1)!.includes('ราคาเต็ม'));
});
test('actual survival sockets receive 10 then 15 after trading, and enter the next merchant with the credited wallet',async t=>{
  const s=await setup(2,new TestRooms(Date.now,{survival:SURVIVAL_RULES,marketProbability:0,startingCredits:200}));t.after(()=>s.app.close());
  const a=s.clients[0]!;
  for(const encounter of [1,2]) {
    for(const c of s.clients) {await s.decline(c);await s.act(c,{type:'enter',portalId:c.room!.game!.self.portals.find(p=>!p.disabled)!.id});}
    for(const c of s.clients)await s.decline(c);
    const item=a.room!.game!.self.stock[0]!;await s.act(a,{type:'buy',itemIds:[item.id],condition:false});
    const wallet=a.room!.game!.self.credits;
    await s.endPhase();assert.equal(a.room!.game!.phase,'TRADE');assert.equal(a.room!.game!.self.roundReward,undefined);
    await s.endPhase();assert.equal(a.room!.game!.phase,'REVEAL');assert.equal(a.room!.game!.encounter,encounter);
    const base=encounter%2?10:15;const reward=a.room!.game!.self.roundReward!;const income=base+(reward.incomeBonus??0);assert.equal(reward.base,base);assert.equal(reward.amount,income);assert.equal(a.room!.game!.self.credits,wallet);
    await s.act(a,{type:'round-bank'});assert.equal(a.room!.game!.self.credits,wallet+income);
    for(const c of s.clients)c.send({type:'reveal-ready',matchId:c.room!.matchId!,encounter});
    await Promise.all(s.clients.map(c=>c.phase('PORTALS',encounter+1)));
    assert.equal(a.room!.game!.self.credits,wallet+income);assert(a.room!.game!.self.life!>0);assert.equal(a.room!.game!.collector,undefined);
  }
});
test('actual sockets deliver round credits and authoritative coin results, then reconnect without rerolling',async t=>{
  const s=await setup(2);t.after(()=>s.app.close());await s.enter();await s.endPhase();await s.endPhase();
  const [a,b]=s.clients as [SocketClient,SocketClient];assert.equal(a.room!.game!.phase,'REVEAL');
  const before=a.room!.game!.self.credits;await s.act(a,{type:'round-raise',coinCount:2,attempt:1});
  assert.equal(a.room!.game!.self.credits,before-10);await s.act(a,{type:'round-flip',guess:'heads',guesses:['heads','tails'],attempt:1});
  const reward=a.room!.game!.self.roundReward!;assert.equal(reward.flips,1);assert.equal(reward.amount,reward.lastFlip!.correct?30:10);assert.equal(a.room!.game!.self.credits,before-10);
  await s.act(b,{type:'round-bank'});assert.equal(b.room!.game!.self.credits,50);
  const joined=a.messages.find(m=>m.type==='joined');assert(joined?.type==='joined');
  a.socket.close();const resumed=await SocketClient.open(s.url);resumed.send({type:'resume',roomCode:joined.roomCode,token:joined.token});
  await resumed.until(()=>resumed.room);assert.deepEqual(resumed.room!.game!.self.roundReward,reward);
  for(const c of [resumed,b])c.send({type:'reveal-ready',matchId:c.room!.matchId!,encounter:1});
  await Promise.all([resumed.phase('PORTALS',2),b.phase('PORTALS',2)]);assert.equal(resumed.room!.game!.self.credits,before-10+reward.amount);assert.equal(b.room!.game!.self.credits,50);
});
for (const count of [2, 3, 4]) test(`v0.4 HTTP/WebSocket ${count}-player appraisal run, replayable room audit, rematch and stale match rejection`, async t => {
  const s = await setup(count); t.after(() => s.app.close()); const host = s.clients[0]!, matchId = host.room!.matchId!;
  assert.equal((await fetch(s.http + '/health')).status, 200); assert.equal(host.room!.rulesVersion, '0.5');
  let cursor = 0, turn = 0, staleChecked = false;
  while (host.room!.game!.phase !== 'RESULTS' && turn++ < 400) {
    const game = host.room!.game!;
    if (game.encounter > 1 && !staleChecked) {
      host.send({ type: 'action', matchId, action: { type: 'done', requestId: 'stale-encounter', encounter: 1 } });
      const error = await host.until(() => host.messages.find(m => m.type === 'error' && m.requestId === 'stale-encounter'));
      assert(error.type === 'error'); assert.equal(error.code, 'stale-encounter'); assert.equal(host.room!.game!.revision, game.revision); staleChecked = true;
    }
    if (game.phase === 'REVEAL') {
      for (const c of s.clients) c.send({ type: 'reveal-ready', matchId, encounter: game.encounter });
      await Promise.all(s.clients.map(c => c.until(() => c.room!.game!.revision > game.revision ? true : undefined))); continue;
    }
    const actor = Array.from({ length: count }, (_, i) => s.clients[(cursor + i) % count]!).find(c => !c.room!.game!.self.paused && !c.room!.game!.self.done); assert(actor);
    cursor = (s.clients.indexOf(actor) + 1) % count; await s.act(actor, appraisalBotDecision(actor.room!.game!, 'trader'));
  }
  assert.equal(host.room!.game!.phase, 'RESULTS'); assert.equal(host.room!.game!.history.length, count * 3);
  host.send({ type: 'audit', matchId }); const m = await host.until(() => host.messages.findLast(m => m.type === 'audit')); assert(m.type === 'audit');
  const replayed = replayAppraisalAudit(m.audit.run); assert.deepEqual(replayed.players.map(p => p.score), host.room!.game!.players.map(p => p.score));
  const evidenceDir = process.env.APPRAISAL_NETWORK_EVIDENCE_DIR;
  if (evidenceDir) { mkdirSync(evidenceDir, { recursive: true }); writeFileSync(join(evidenceDir, `network-${count}-players.json`), JSON.stringify(m.audit, null, 2) + '\n'); }
  assert.equal(m.audit.schemaVersion, 4); assert.equal(m.audit.timeouts.length, 0); assert.equal(m.audit.seats.length, count); assert.equal(m.audit.phaseTimes.at(-1)!.phase, 'REVEAL');
  host.send({ type: 'rematch' }); await Promise.all(s.clients.map(c => c.until(() => c.room?.game === null ? true : undefined))); assert(host.room!.seats.every(p => !p.ready));
  for (const c of s.clients) c.send({ type: 'ready', ready: true }); await host.until(() => host.room!.seats.every(p => p.ready) ? true : undefined); host.send({ type: 'start' });
  await Promise.all(s.clients.map(c => c.phase('PORTALS', 1))); assert.notEqual(host.room!.matchId, matchId); assert(host.room!.game!.players.every(p => p.score === 0 && p.credits === 40 && p.energy === 10));
  host.send({ type: 'action', matchId, action: { type: 'done', requestId: 'old-match', encounter: 1 } });
  const error = await host.until(() => host.messages.findLast(m => m.type === 'error' && m.requestId === 'old-match')); assert(error.type === 'error'); assert.equal(error.code, 'stale-match');
});
test('v0.4 actual socket rejects actor and hidden-state injection, keeps inspections/tokens private and resumes accepted command retries', async t => {
  const s = await setup(3); t.after(() => s.app.close()); await s.enter(); const [a, b, other] = s.clients as [SocketClient, SocketClient, SocketClient];
  const item = a.room!.game!.self.stock[0]!; await s.act(a, { type: 'inspect', itemId: item.id, property: 'price' }, 'inspect');
  const original = a.room!.game!.self, revision = a.room!.game!.revision;
  const serialized = JSON.stringify(other.messages); assert.equal(serialized.includes(a.joined.token), false); assert.equal(serialized.includes('"seed"'), false); assert.equal(serialized.includes('"schedule"'), false);
  assert.equal(other.room!.game!.self.stock.some(i => i.id === item.id), false);
  for (const injection of [{ playerId: b.room!.yourSeatId }, { seed: 'lucky' }, { eventId: 'E46' }, { price: 0 }]) {
    const previousErrors = a.messages.filter(m => m.type === 'error').length;
    a.socket.send(JSON.stringify({ type: 'action', matchId: a.room!.matchId, action: { type: 'done', requestId: 'spoof', encounter: 1, ...injection } }));
    await a.until(() => a.messages.filter(m => m.type === 'error').length > previousErrors ? true : undefined); assert.equal(a.room!.game!.revision, revision);
  }
  const token = a.joined.token; a.socket.terminate(); const resumed = await SocketClient.open(s.url); resumed.send({ type: 'resume', roomCode: a.room!.code, token }); await resumed.until(() => resumed.room);
  assert.equal(resumed.room!.yourSeatId, a.room!.yourSeatId); assert.deepEqual(resumed.room!.game!.self.stock, original.stock);
  resumed.send({ type: 'action', matchId: resumed.room!.matchId!, action: { type: 'inspect', itemId: item.id, property: 'price', encounter: 1, requestId: 'inspect' } });
  await resumed.until(() => resumed.messages.find(m => m.type === 'ack' && m.requestId === 'inspect')); assert.equal(resumed.room!.game!.revision, revision);
  resumed.send({ type: 'action', matchId: resumed.room!.matchId!, action: { type: 'inspect', itemId: item.id, property: 'effects', encounter: 1, requestId: 'inspect' } });
  const conflict = await resumed.until(() => resumed.messages.find(m => m.type === 'error' && m.requestId === 'inspect')); assert(conflict.type === 'error'); assert.equal(conflict.code, 'request-conflict');
  resumed.send({ type: 'audit', matchId: resumed.room!.matchId! }); const privateAudit = await resumed.until(() => resumed.messages.find(m => m.type === 'error' && m.code === 'audit-private')); assert(privateAudit.type === 'error');
});
for (const count of [2, 3, 4]) test(`v0.4 actual ${count}-seat disconnect timeout run completes and restores results/audit`, async t => {
  let now = 1000; const rooms = new TestRooms(() => now, {}, { PORTALS: 10, APPRAISAL: 10, TRADE: 10, REVEAL: 10 });
  const s = await setup(count, rooms); t.after(() => s.app.close()); const host = s.clients[0]!, code = host.room!.code, token = host.joined.token;
  for (const c of s.clients) c.socket.terminate(); await once(s.clients.at(-1)!.socket, 'close');
  for (let i = 0; rooms.state(code).phase !== 'RESULTS' && i < 20; i++) { now += 11; rooms.tick(); }
  assert.equal(rooms.state(code).phase, 'RESULTS');
  const resumed = await SocketClient.open(s.url); resumed.send({ type: 'resume', roomCode: code, token }); await resumed.phase('RESULTS'); assert.equal(resumed.room!.hostId, resumed.room!.yourSeatId);
  resumed.send({ type: 'audit', matchId: resumed.room!.matchId! }); const m = await resumed.until(() => resumed.messages.find(m => m.type === 'audit')); assert(m.type === 'audit'); replayAppraisalAudit(m.audit.run);
  assert(m.audit.timeouts.length > 0); assert.equal(m.audit.run.history.length, count * 3); assert.equal(resumed.room!.deadline, null);
});
test('v0.4 actual zero-price player trade is private, atomic and repeat approval pays/transfers once', async t => {
  const rooms = new TestRooms(Date.now, { startingCredits: 500 }); const s = await setup(3, rooms); t.after(() => s.app.close()); await s.enter();
  const [seller, buyer, other] = s.clients as [SocketClient, SocketClient, SocketClient]; const item = seller.room!.game!.self.stock[0]!;
  await s.act(seller, { type: 'buy', itemIds: [item.id], condition: false }); await s.act(seller, { type: 'share', itemId: item.id, allow: true, purchase: true });
  await s.endPhase(); for (const c of s.clients) await s.decline(c); await s.act(buyer, { type: 'propose', sellerId: seller.room!.yourSeatId, itemId: item.id, credits: 0 });
  const offer = seller.room!.game!.trades.find(t => t.status === 'open')!; assert.equal(other.room!.game!.trades.length, 0); const before = structuredClone(rooms.state(seller.room!.code));
  await s.act(seller, { type: 'respond', offerId: offer.id, accept: true }, 'approve'); const revision = seller.room!.game!.revision;
  seller.send({ type: 'action', matchId: seller.room!.matchId!, action: { type: 'respond', offerId: offer.id, accept: true, requestId: 'approve', encounter: 1 } });
  await seller.until(() => seller.messages.filter(m => m.type === 'ack' && m.requestId === 'approve').length === 2 ? true : undefined);
  const state = rooms.state(seller.room!.code); assert.equal(state.revision, revision); assert.equal(state.items[item.id]!.owner, buyer.room!.yourSeatId);
  // A seat holding the middleman subsidy (E43, which can no longer be declined) earns its 1 credit from the bank.
  assert.deepEqual(state.players.map(p => p.credits), before.players.map(p => p.credits + (p.subsidy && [offer.buyerId, offer.sellerId].includes(p.id) ? 1 : 0))); assert.equal(state.trace.filter(t => t.type === 'npc-caught').length, 0);
});
test('v0.4 actual all-exhausted seats show rest then return next encounter', async t => {
  let now = 1000; const rooms = new TestRooms(() => now, { maxEnergy: 1, recoveryEnergy: 1, freeMerchantAction:false }, { REVEAL: 10 });
  const s = await setup(3, rooms); t.after(() => s.app.close()); await s.enter();
  for (const c of s.clients) await s.act(c, { type: 'inspect', itemId: c.room!.game!.self.stock[0]!.id, property: 'price' });
  await Promise.all(s.clients.map(c => c.phase('REVEAL', 1))); assert(s.clients[0]!.room!.game!.players.every(p => p.paused === 'exhausted'));
  now += 11; rooms.tick(); await Promise.all(s.clients.map(c => c.phase('PORTALS', 2))); assert(s.clients[0]!.room!.game!.players.every(p => p.energy === 1 && !p.paused));
});
class MarketRooms extends TestRooms {
  protected createGame(ids: string[]): AppraisalState {
    // Pick a replayable fixture seed where the first seat has a visible matching route hint.
    for (let i = 0; i < 100; i++) {
      const state = createAppraisalRun(ids, `network-market-${i}`, { commerce:false, marketProbability: 1, startingCredits: 500 });
      const p = state.players[0]!;
      if (!p.eventOffer && p.portals.some(portal => state.market.orders.some(order => order.kind === state.items[portal.stock[0]!]!.kind))) return state;
    }
    throw new Error('No bounded matching-market fixture seed');
  }
}
test('v0.4 actual Dark Market buys new stock immediately once and stays open through TRADE', async t => {
  const rooms = new MarketRooms(); const s = await setup(2, rooms); t.after(() => s.app.close()); const [a, b] = s.clients as [SocketClient, SocketClient];
  assert(a.room!.game!.market.open); const portal = a.room!.game!.self.portals.find(p => a.room!.game!.market.orders.some(o => o.kind === p.hint))!;
  await s.act(a, { type: 'enter', portalId: portal.id }); await s.decline(b); await s.act(b, { type: 'enter', portalId: b.room!.game!.self.portals.find(p => !p.disabled)!.id });
  for (const c of s.clients) await s.decline(c); const item = a.room!.game!.self.stock[0]!, order = a.room!.game!.market.orders.find(o => o.kind === item.kind)!;
  await s.act(a, { type: 'buy', itemIds: [item.id], condition: false }); const before = a.room!.game!.self.credits;
  await s.act(a, { type: 'market-sell', itemId: item.id, orderId: order.id }, 'market'); assert.equal(a.room!.game!.self.credits, before + order.price*(item.rarityPower?.valueMultiplier??1));
  assert.equal(a.room!.game!.self.inventory.some(i => i.id === item.id), false); assert.equal(a.room!.game!.market.orders.find(o => o.id === order.id)!.quota[a.room!.yourSeatId], 0);
  const revision = a.room!.game!.revision;
  a.send({ type: 'action', matchId: a.room!.matchId!, action: { type: 'market-sell', itemId: item.id, orderId: order.id, requestId: 'market', encounter: 1 } });
  await a.until(() => a.messages.filter(m => m.type === 'ack' && m.requestId === 'market').length === 2 ? true : undefined); assert.equal(rooms.state(a.room!.code).revision, revision);
  const snapshot = structuredClone(rooms.state(a.room!.code));
  a.send({ type: 'action', matchId: a.room!.matchId!, action: { type: 'market-sell', itemId: item.id, orderId: order.id, requestId: 'sold-again', encounter: 1 } });
  await a.until(() => a.messages.find(m => m.type === 'error' && m.requestId === 'sold-again')); assert.deepEqual(rooms.state(a.room!.code), snapshot);
  await s.endPhase(); assert.equal(a.room!.game!.phase, 'TRADE'); assert(a.room!.game!.market.open); await s.endPhase(); assert.equal(a.room!.game!.phase, 'REVEAL'); assert.equal(a.room!.game!.market.open, false);
});
test('v0.4 actual cross-shop fee and NPC payment roll back together, competing buyers cannot acquire a sold item', async t => {
  const rooms = new TestRooms(Date.now, { startingCredits: 500 }); const s = await setup(3, rooms); t.after(() => s.app.close()); await s.enter();
  const [seller, buyer, rival] = s.clients as [SocketClient, SocketClient, SocketClient]; const item = seller.room!.game!.self.stock[0]!;
  const base = 100;
  await s.act(seller, { type: 'appraise', itemId: item.id, value: base, acceptDanger: true }); await s.act(seller, { type: 'share', itemId: item.id, allow: true, purchase: true });
  await s.endPhase(); for (const c of s.clients) await s.decline(c);
  await s.act(buyer, { type: 'propose', sellerId: seller.room!.yourSeatId, itemId: item.id, credits: buyer.room!.game!.self.credits - base + 1 });
  const expensive = seller.room!.game!.trades.find(t => t.status === 'open')!, snapshot = structuredClone(rooms.state(seller.room!.code));
  seller.send({ type: 'action', matchId: seller.room!.matchId!, action: { type: 'respond', offerId: expensive.id, accept: true, requestId: 'unaffordable', encounter: 1 } });
  await seller.until(() => seller.messages.find(m => m.type === 'error' && m.requestId === 'unaffordable')); assert.deepEqual(rooms.state(seller.room!.code), snapshot);
  await s.act(seller, { type: 'respond', offerId: expensive.id, accept: false });
  await s.act(buyer, { type: 'propose', sellerId: seller.room!.yourSeatId, itemId: item.id, credits: 3 }); await s.act(rival, { type: 'propose', sellerId: seller.room!.yourSeatId, itemId: item.id, credits: 4 });
  const offer = seller.room!.game!.trades.find(t => t.status === 'open' && t.buyerId === buyer.room!.yourSeatId)!, competing = seller.room!.game!.trades.find(t => t.status === 'open' && t.buyerId === rival.room!.yourSeatId)!;
  const buyerBefore = buyer.room!.game!.self.credits, sellerBefore = seller.room!.game!.self.credits;
  await s.act(seller, { type: 'respond', offerId: offer.id, accept: true }); assert.equal(buyer.room!.game!.self.credits, buyerBefore - base - 3); assert.equal(seller.room!.game!.self.credits, sellerBefore + 3 + Math.floor(base/10));
  assert.equal(rooms.state(seller.room!.code).items[item.id]!.owner, buyer.room!.yourSeatId); assert.equal(seller.room!.game!.trades.find(t => t.id === competing.id)!.status, 'rejected');
  const after = structuredClone(rooms.state(seller.room!.code)); seller.send({ type: 'action', matchId: seller.room!.matchId!, action: { type: 'respond', offerId: competing.id, accept: true, requestId: 'competing', encounter: 1 } });
  await seller.until(() => seller.messages.find(m => m.type === 'error' && m.requestId === 'competing')); assert.deepEqual(rooms.state(seller.room!.code), after);
});
test('v0.4 actual confirmed-death fixture settles all seats and restores play next encounter', async t => {
  let now = 1000; const rooms = new TestRooms(() => now, {}, { REVEAL: 10 }); const s = await setup(3, rooms); t.after(() => s.app.close()); await s.enter();
  // Force the accepted E50 branch on server state; this fixture is not exported as a seeded audit.
  const state = rooms.state(s.clients[0]!.room!.code);
  for (const p of state.players) { state.items[p.stock[0]!]!.npc = 'darkone'; p.caught = true; p.acceptedDanger = true; offerEvent(state, p, 'E50'); }
  rooms.publish(s.clients[0]!.room!.code); await Promise.all(s.clients.map(c => c.until(() => c.room!.game!.self.eventOffer?.id === 'E50' ? true : undefined)));
  for (const c of s.clients) await s.act(c, { type: 'event', key: c.room!.game!.self.eventOffer!.key, choice: 'die' });
  assert.equal(s.clients[0]!.room!.game!.phase, 'REVEAL'); assert(s.clients[0]!.room!.game!.players.every(p => p.paused === 'dead' && p.score === 0));
  now += 11; rooms.tick(); await Promise.all(s.clients.map(c => c.phase('PORTALS', 2))); assert(s.clients[0]!.room!.game!.players.every(p => !p.paused && p.energy >= 4));
});
import { defaultRarityConfig } from '../src/shared/item-rarity.js';
