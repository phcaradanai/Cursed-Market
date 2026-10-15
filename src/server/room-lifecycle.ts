import { randomBytes, randomInt } from 'node:crypto';
import { RuleError } from '../game/index.js';
import type { ClientMessage, PlaytestMode, SeatView } from '../shared/protocol.js';

export interface LifecyclePeer<M = unknown> {
  send(message: M): void;
  close(code: number, reason: string): void;
}
/** HTTP/WebSocket transport stays independent of the rules version. */
export interface RoomTransport {
  readonly count: number;
  receive(peer: LifecyclePeer, value: unknown): void;
  disconnect(peer: LifecyclePeer): void;
  tick(): void;
}
export type ControlMessage = Exclude<ClientMessage, { type: 'action' | 'reveal-ready' | 'audit' }>;
/** A seat with `bot` set is played by the server: always connected and ready, never has a peer. */
export interface LifecycleSeat<M> extends SeatView { token: string; peer: LifecyclePeer<M> | null; bot?: string }
export interface LifecycleRoom<G, M> {
  timing?:{enabled:boolean;durationsMs:Record<string,number>};
  /** Rules mode picked by the host in the lobby; subclasses that have modes read it in createGame. */
  mode?: string;
  code: string; hostId: string; seats: LifecycleSeat<M>[];
  matchSeats: { id: string; name: string }[]; playtestMode: PlaytestMode;
  game: G | null; matchId: string | null; deadline: number | null;
  phaseStartedAt: number;
  phaseTimes: { number: number; phase: string; startedAt: number; endedAt: number }[];
  timeouts: { at: number; number: number; phase: string; playerId: string | null }[];
  startedAt: number; endedAt: number | null; lastActivity: number; revealReady: Set<string>;
}
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export function insist(condition: unknown, code: string, message: string): asserts condition {
  if (!condition) throw new RuleError(code, message);
}

/** Shared seat/session lifecycle. Match rules own actions, views, audits and defaults. */
export abstract class RoomLifecycle<G extends { phase: string }, C extends { type: string }, M extends { type: string }> implements RoomTransport {
  protected readonly rooms = new Map<string, LifecycleRoom<G, M>>();
  private readonly bindings = new Map<LifecyclePeer<M>, { room: LifecycleRoom<G, M>; seat: LifecycleSeat<M> }>();

  constructor(protected readonly now: () => number = Date.now, private readonly idleMs = 30 * 60 * 1000) {}
  get count(): number { return this.rooms.size; }
  protected abstract parse(value: unknown): C;
  protected abstract createGame(ids: string[], seed: string, room: LifecycleRoom<G, M>): G;
  protected abstract number(game: G): number;
  protected abstract duration(phase: string, room: LifecycleRoom<G,M>): number | null;
  protected abstract advanceGame(game: G): G;
  protected abstract matchMessage(room: LifecycleRoom<G, M>, seat: LifecycleSeat<M>, peer: LifecyclePeer<M>, message: C): void;
  protected abstract timeout(room: LifecycleRoom<G, M>, now: number): void;
  protected abstract broadcast(room: LifecycleRoom<G, M>): void;
  protected errorMessage(error: RuleError): string { return error.message; }

  receive(peer: LifecyclePeer, value: unknown): void { this.handle(peer, this.parse(value)); }
  handle(peer: LifecyclePeer<M>, message: C): void {
    try {
      // Version-specific parsers reconstruct allowlisted messages before this boundary.
      const control = message as unknown as ControlMessage;
      if (control.type === 'create' || control.type === 'join' || control.type === 'resume') {
        insist(!this.bindings.has(peer), 'already-seated', 'คุณอยู่ในห้องแล้ว ออกจากห้องเดิมก่อน');
        if (control.type === 'create') {
          insist(this.rooms.size < 200, 'room-limit', 'ห้องเต็มเซิร์ฟเวอร์แล้ว ลองอีกครั้งภายหลัง');
          let code: string;
          do { code = Array.from({ length: 6 }, () => ALPHABET[randomInt(ALPHABET.length)]).join(''); } while (this.rooms.has(code));
          const seat = this.newSeat(control.name);
          const room: LifecycleRoom<G, M> = { code, hostId: seat.id, seats: [seat], matchSeats: [], playtestMode: 'no-voice',
            game: null, matchId: null, deadline: null, phaseStartedAt: 0, phaseTimes: [], timeouts: [],
            startedAt: 0, endedAt: null, lastActivity: this.now(), revealReady: new Set() };
          this.rooms.set(code, room); this.attach(room, seat, peer);
        } else {
          const room = this.rooms.get(control.roomCode);
          insist(room, 'room-missing', 'ไม่พบห้องนี้ ห้องอาจหมดอายุหรือเซิร์ฟเวอร์เริ่มใหม่');
          if (control.type === 'resume') {
            const seat = room.seats.find(s => s.token === control.token);
            insist(seat, 'seat-missing', 'กู้ seat ไม่สำเร็จ กลับไปสร้างหรือเข้าห้องใหม่');
            if (seat.peer) { const old = seat.peer; this.bindings.delete(old); old.close(4001, 'Seat resumed in another connection'); }
            this.attach(room, seat, peer);
          } else {
            insist(!room.game, 'match-started', 'แมตช์เริ่มแล้ว รอเข้าห้องในแมตช์ถัดไป');
            insist(room.seats.length < 4, 'room-full', 'ห้องนี้มีผู้เล่นครบ 4 คนแล้ว');
            const seat = this.newSeat(control.name); room.seats.push(seat); this.attach(room, seat, peer);
          }
        }
        return;
      }
      const binding = this.bindings.get(peer);
      insist(binding, 'not-seated', 'สร้างหรือเข้าห้องก่อน');
      const { room, seat } = binding; room.lastActivity = this.now();
      switch (control.type) {
        case 'ready':
          insist(!room.game, 'match-started', 'เปลี่ยนพร้อมเล่นได้เฉพาะใน lobby'); seat.ready = control.ready; break;
        case 'playtest-mode':
          this.hostOnly(room, seat); insist(!room.game, 'match-started', 'เลือกรูปแบบทดสอบก่อนเริ่มเกม'); room.playtestMode = control.mode; break;
        case 'start':
          this.hostOnly(room, seat); insist(!room.game, 'match-started', 'แมตช์เริ่มแล้ว');
          insist(room.seats.length >= 2 && room.seats.every(s => s.ready && s.connected), 'not-ready', 'ต้องมี 2–4 คน และทุกคนพร้อมและเชื่อมต่ออยู่');
          room.matchId = randomBytes(8).toString('hex'); room.matchSeats = room.seats.map(s => ({ id: s.id, name: s.name }));
          room.game = this.createGame(room.seats.map(s => s.id), randomBytes(32).toString('hex'), room);
          room.startedAt = this.now(); room.endedAt = null; room.phaseTimes = []; room.timeouts = []; this.beginPhase(room); break;
        case 'rematch':
          this.hostOnly(room, seat); insist(room.game?.phase === 'RESULTS', 'phase', 'ต้องจบแมตช์ก่อนเล่นอีกครั้ง');
          room.game = null; room.matchId = null; room.deadline = null; room.revealReady.clear(); this.unready(room); break;
        case 'leave':
          insist(!room.game || room.game.phase === 'RESULTS', 'match-started', 'แมตช์กำลังเล่น ปิดแท็บได้และกลับมาที่ seat เดิมภายหลัง');
          this.bindings.delete(peer); room.seats = room.seats.filter(s => s !== seat);
          if (!room.seats.some(s => !s.bot)) this.rooms.delete(room.code); else if (room.hostId === seat.id) room.hostId = room.seats.find(s => !s.bot)!.id;
          peer.send({ type: 'left' } as M); break;
        case 'remove-seat': {
          this.hostOnly(room, seat); insist(!room.game, 'match-started', 'นำ seat ออกได้เฉพาะก่อนเริ่มแมตช์');
          const absent = room.seats.find(s => s.id === control.seatId);
          insist(absent && !absent.connected && absent.id !== seat.id, 'seat-connected', 'นำออกได้เฉพาะ seat ที่ไม่ได้เชื่อมต่อ');
          room.seats = room.seats.filter(s => s !== absent); break;
        }
        default: this.matchMessage(room, seat, peer, message);
      }
      if (this.rooms.has(room.code)) { this.afterChange(room); this.broadcast(room); }
    } catch (error) {
      const body = message as unknown as { type: string; action?: { requestId?: string } };
      peer.send({ type: 'error', code: error instanceof RuleError ? error.code : 'server-error',
        message: error instanceof RuleError ? this.errorMessage(error) : 'เซิร์ฟเวอร์ทำคำสั่งไม่สำเร็จ ลองอีกครั้ง',
        ...(body.type === 'action' && body.action?.requestId ? { requestId: body.action.requestId } : {}) } as unknown as M);
      if (!(error instanceof RuleError)) console.error(error);
    }
  }

  disconnect(peer: LifecyclePeer<M>): void {
    const binding = this.bindings.get(peer); if (!binding) return;
    this.bindings.delete(peer); const { room, seat } = binding; seat.peer = null; seat.connected = false;
    if (!room.game) seat.ready = false;
    if (room.hostId === seat.id) room.hostId = room.seats.find(s => s.connected && !s.bot)?.id ?? seat.id;
    this.broadcast(room);
  }
  tick(): void {
    const now = this.now();
    for (const room of this.rooms.values()) {
      if (room.seats.every(s => !s.connected || s.bot) && now - room.lastActivity > this.idleMs) { this.rooms.delete(room.code); continue; }
      if (!room.game || room.deadline === null || now < room.deadline) continue;
      this.timeout(room, now); this.afterChange(room); this.broadcast(room);
    }
  }
  /** Hook after any state change, before the broadcast; rules versions with bot seats play them here. */
  protected afterChange(_room: LifecycleRoom<G, M>): void {}
  /** Everyone must ready up again; bot seats are always ready. */
  protected unready(room: LifecycleRoom<G, M>): void { room.seats.forEach(s => { s.ready = !!s.bot; }); }
  protected addBotSeat(room: LifecycleRoom<G, M>, name: string, bot: string): void {
    room.seats.push({ ...this.newSeat(name), ready: true, connected: true, bot });
  }
  protected hostOnly(room: LifecycleRoom<G, M>, seat: LifecycleSeat<M>): void { insist(room.hostId === seat.id, 'host-only', 'เฉพาะเจ้าของห้องทำรายการนี้ได้'); }
  protected phaseChanged(room: LifecycleRoom<G, M>, previous: G): void {
    if (previous.phase === room.game!.phase && this.number(previous) === this.number(room.game!)) return;
    room.phaseTimes.push({ number: this.number(previous), phase: previous.phase, startedAt: room.phaseStartedAt, endedAt: this.now() }); this.beginPhase(room);
  }
  protected advance(room: LifecycleRoom<G, M>): void { const previous = room.game!; room.game = this.advanceGame(previous); this.phaseChanged(room, previous); }
  private beginPhase(room: LifecycleRoom<G, M>): void {
    room.revealReady.clear(); room.phaseStartedAt = this.now();
    const duration=room.game!.phase==='RESULTS'?null:this.duration(room.game!.phase,room);
    room.deadline = duration===null?null:room.phaseStartedAt+duration;
    if (room.game!.phase === 'RESULTS') room.endedAt = this.now();
  }
  protected newSeat(name: string): LifecycleSeat<M> { return { id: randomBytes(8).toString('hex'), name, ready: false, connected: false, token: randomBytes(32).toString('hex'), peer: null }; }
  private attach(room: LifecycleRoom<G, M>, seat: LifecycleSeat<M>, peer: LifecyclePeer<M>): void {
    seat.peer = peer; seat.connected = true; room.lastActivity = this.now(); this.bindings.set(peer, { room, seat });
    if (!room.seats.find(s => s.id === room.hostId)?.connected) room.hostId = seat.id;
    peer.send({ type: 'joined', roomCode: room.code, token: seat.token, seatId: seat.id } as unknown as M); this.broadcast(room);
  }
}
