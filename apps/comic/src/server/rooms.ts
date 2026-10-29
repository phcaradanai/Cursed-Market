import { advanceAuction, applyAction, createGame, RuleError, scores, viewFor, winnerIds } from "../game/index.js";
import type { Action, GameState, Phase } from "../game/types.js";
import type { ClientMessage, RoomView, ServerMessage } from "../shared/protocol.js";
import { parseMessage } from "./messages.js";
import { insist, RoomLifecycle } from "./room-lifecycle.js";
import type { LifecyclePeer, LifecycleRoom, LifecycleSeat } from "./room-lifecycle.js";

export type Peer = LifecyclePeer<ServerMessage>;
type Room = LifecycleRoom<GameState, ServerMessage>;
type Seat = LifecycleSeat<ServerMessage>;
export const PHASE_MS: Record<Exclude<Phase, "RESULTS">, number> = {
  SELLER_PREP: 60000, BUYER_INSPECTION: 30000, SEALED_BID: 45000, REVEAL: 20000,
  ROUTE_CHOICE: 45000, BOON_CHOICE: 30000,
};

/** Owns room lifecycle. All mutations run synchronously against the latest room state. */
export class RoomService extends RoomLifecycle<GameState, ClientMessage, ServerMessage> {
  private readonly durations: Record<Exclude<Phase, "RESULTS">, number>;
  constructor(now: () => number = Date.now,
    durations: Partial<Record<Exclude<Phase, "RESULTS">, number>> = PHASE_MS,
    idleMs = 30 * 60 * 1000) { super(now, idleMs); this.durations = { ...PHASE_MS, ...durations }; }
  protected parse(value: unknown): ClientMessage { return parseMessage(value); }
  protected createGame(ids: string[], seed: string): GameState { return createGame(ids, seed, { curseWagers: true, fastMarket: true, rogueRun: true }); }
  protected number(game: GameState): number { return game.auction.number; }
  protected duration(phase: string): number { return this.durations[phase as Exclude<Phase, "RESULTS">]; }
  protected advanceGame(game: GameState): GameState { return advanceAuction(game); }
  protected errorMessage(error: RuleError): string { return ruleMessage(error); }

  protected matchMessage(room: Room, seat: Seat, peer: Peer, message: ClientMessage): void {
    switch (message.type) {
        case "action": {
          insist(room.game && message.matchId === room.matchId, "stale-match", "คำสั่งนี้เป็นของแมตช์เก่า ใช้สถานะล่าสุด");
          const previous = room.game;
          room.game = applyAction(previous, { ...message.action, playerId: seat.id });
          this.phaseChanged(room, previous);
          peer.send({ type: "ack", requestId: message.action.requestId });
          break;
        }
        case "reveal-ready": {
          insist(room.game?.phase === "REVEAL" && message.matchId === room.matchId && message.auctionNumber === room.game.auction.number,
            "stale-reveal", "ผลรอบนี้ผ่านไปแล้ว ใช้รอบล่าสุด");
          room.revealReady.add(seat.id);
          if (room.seats.every(s => room.revealReady.has(s.id))) this.advance(room);
          break;
        }
        case "audit":
          insist(room.game?.phase === "RESULTS" && message.matchId === room.matchId, "audit-private", "ดาวน์โหลดข้อมูลลับได้หลังจบแมตช์เท่านั้น");
          peer.send({ type: "audit", audit: {
            schemaVersion: 1, matchId: room.matchId!, playtestMode: room.playtestMode, startedAt: room.startedAt, endedAt: room.endedAt!,
            seats: [...room.matchSeats], events: structuredClone(room.game.events),
            scores: scores(room.game), winnerIds: winnerIds(room.game), timeouts: room.timeouts.map(({ number, ...row }) => ({ ...row, auctionNumber: number })), phaseTimes: room.phaseTimes.map(({ number, ...row }) => ({ ...row, auctionNumber: number })),
          } });
          return;
      default: break;
    }
  }

  protected timeout(room: Room, now: number): void {
      insist(room.game, 'phase', 'แมตช์ยังไม่เริ่ม');
      const phase = room.game!.phase;
      const number = room.game!.auction.number;
      if (phase === "REVEAL") {
        room.timeouts.push({ at: now, number, phase, playerId: null });
        this.advance(room);
      } else {
        const pending = phase === "ROUTE_CHOICE" ? room.seats.map(s => s.id).filter(id => !room.game!.run!.votes.some(v => v.playerId === id))
          : phase === "BOON_CHOICE" ? room.seats.map(s => s.id).filter(id => !room.game!.run!.boonPicks.some(p => p.playerId === id))
          : phase === "SELLER_PREP" ? [room.game.auction.sellerId] : room.seats.map(s => s.id).filter(id => id !== room.game!.auction.sellerId &&
          !(phase === "BUYER_INSPECTION" ? room.game!.auction.inspections : room.game!.auction.bids).some(choice => choice.playerId === id));
        for (const playerId of pending) {
          const previous = room.game;
          const base = { requestId: `timeout:${room.matchId}:${number}:${phase}:${playerId}`, auctionNumber: number, playerId };
          const action: Action = phase === "ROUTE_CHOICE" ? { ...base, type: "vote-route", nodeId: null }
            : phase === "BOON_CHOICE" ? { ...base, type: "choose-boon", boonId: null }
            : phase === "SELLER_PREP" ? { ...base, type: "offer" as const, relicId: previous.auction.candidates[0].id, mode: "as-is" as const }
            : phase === "BUYER_INSPECTION" ? { ...base, type: "pass-inspection" as const } : { ...base, type: "bid" as const, amount: 0 };
          room.game = applyAction(previous, action);
          room.timeouts.push({ at: now, number, phase, playerId });
          this.phaseChanged(room, previous);
        }
      }
  }

  protected broadcast(room: Room): void {
    for (const seat of room.seats) if (seat.peer) {
      const view: RoomView = {
        rulesVersion: "0.3",
        code: room.code, hostId: room.hostId, yourSeatId: seat.id,
        seats: room.seats.map(s => ({ id: s.id, name: s.name, ready: s.ready, connected: s.connected })),
        matchSeats: [...room.matchSeats],
        playtestMode: room.playtestMode, matchId: room.matchId, deadline: room.deadline, serverTime: this.now(),
        revealReady: [...room.revealReady], game: room.game ? viewFor(room.game, seat.id) : null,
      };
      seat.peer.send({ type: "state", room: view });
    }
  }
}

function ruleMessage(error: RuleError): string {
  const messages: Record<string, string> = {
    phase: "ขั้นตอนเปลี่ยนแล้ว ใช้สถานะล่าสุด", "stale-auction": "รอบเปลี่ยนแล้ว ใช้สถานะล่าสุด",
    "bid-amount": "ราคาและเงินเดิมพันรวมกันต้องไม่เกินเงินที่เหลือ", "wager-stake": "เลือกคำทายและเดิมพันไม่เกินวงเงินของเสริม: ปกติ 3 เหรียญ นักเดิมพัน 5 เหรียญ",
    "wager-disabled": "แมตช์นี้ใช้กติกาเดิม ไม่มีเดิมพันคำสาป", escrow: "เงินไม่พอวางมัดจำ เปลี่ยนเป็นไม่รับประกัน",
    "inspection-tokens": "สิทธิ์ตรวจหมดแล้ว เลือกไม่ตรวจ", "inspection-locked": "ล็อกการตรวจแล้ว รอขั้นประมูล",
    "bid-locked": "ล็อกราคาแล้ว รอเปิดผล", "buyer-only": "ผู้ขายตรวจหรือประมูลของตนเองไม่ได้",
    "seller-only": "รอผู้ขายเลือกสินค้า", "request-conflict": "คำสั่งซ้ำมีข้อมูลต่างกัน โหลดหน้าใหม่เพื่อดูสถานะล่าสุด",
    "relic-id": "สินค้านี้ไม่ใช่ตัวเลือกของรอบปัจจุบัน",
    "route-locked": "ล็อกโหวตแล้ว รอผู้เล่นคนอื่น", "route-id": "เลือกจากเส้นทางที่เปิดอยู่ตอนนี้",
    "boon-locked": "เลือกของเสริมแล้ว รอผู้เล่นคนอื่น", "boon-id": "เลือกจากข้อเสนอของเสริมของคุณเท่านั้น",
  };
  return messages[error.code] ?? error.message;
}
