import { advanceAppraisalEncounter, applyAppraisalAction, appraisalViewFor, createAppraisalRun, defaultAppraisalAction, exportAppraisalAudit } from '../game/appraisal/index.js';
import type { AppraisalConfig, AppraisalPhase, AppraisalState } from '../game/appraisal/types.js';
import type { AppraisalClientMessage, AppraisalServerMessage, AppraisalRoomView, AppraisalTimerSettings } from '../shared/appraisal-protocol.js';
import { APPRAISAL_TIMER_PHASES } from '../shared/appraisal-protocol.js';
import { parseAppraisalMessage } from './appraisal-messages.js';
import { insist, RoomLifecycle } from './room-lifecycle.js';
import type { LifecyclePeer, LifecycleRoom, LifecycleSeat } from './room-lifecycle.js';

type Room = LifecycleRoom<AppraisalState, AppraisalServerMessage>;
type Seat = LifecycleSeat<AppraisalServerMessage>;
export const APPRAISAL_PHASE_MS: Record<Exclude<AppraisalPhase, 'RESULTS'>, number> = {
  PORTALS: 30000, APPRAISAL: 90000, TRADE: 45000, REVEAL: 4000,
};
export class AppraisalRoomService extends RoomLifecycle<AppraisalState, AppraisalClientMessage, AppraisalServerMessage> {
  private readonly durations: typeof APPRAISAL_PHASE_MS;
  constructor(now: () => number = Date.now, durations: Partial<typeof APPRAISAL_PHASE_MS> = {}, idleMs = 30 * 60 * 1000, private readonly runConfig:Partial<AppraisalConfig> = {}) {
    super(now, idleMs); this.durations = { ...APPRAISAL_PHASE_MS, ...durations };
  }
  protected parse(value: unknown): AppraisalClientMessage { return parseAppraisalMessage(value); }
  protected createGame(ids: string[], seed: string): AppraisalState { return createAppraisalRun(ids, seed, this.runConfig); }
  protected number(game: AppraisalState): number { return game.encounter; }
  private timerSettings(room:Room):AppraisalTimerSettings { return structuredClone(room.timing??{enabled:true,durationsMs:this.durations}) as AppraisalTimerSettings; }
  protected duration(phase: string,room:Room): number | null {
    const settings=this.timerSettings(room);return settings.enabled?settings.durationsMs[phase as keyof typeof APPRAISAL_PHASE_MS]:null;
  }
  protected advanceGame(game: AppraisalState): AppraisalState { return advanceAppraisalEncounter(game); }
  protected matchMessage(room: Room, seat: Seat, peer: LifecyclePeer<AppraisalServerMessage>, message: AppraisalClientMessage): void {
    if ((message.type === 'action' || message.type === 'reveal-ready') && room.deadline !== null && this.now() >= room.deadline) {
      this.timeout(room, this.now()); this.broadcast(room);
      insist(false, 'phase-expired', 'หมดเวลาช่วงนี้แล้ว ใช้สถานะล่าสุด');
    }
    switch (message.type) {
      case 'timer-settings': {
        this.hostOnly(room,seat);insist(!room.game,'match-started','ตั้งเวลาได้ก่อนเริ่มเกมเท่านั้น');
        const current=this.timerSettings(room);
        if(current.enabled!==message.settings.enabled || APPRAISAL_TIMER_PHASES.some(phase=>current.durationsMs[phase]!==message.settings.durationsMs[phase]))room.seats.forEach(s=>{s.ready=false;});
        room.timing=structuredClone(message.settings);break;
      }
      case 'action': {
        insist(room.game && message.matchId === room.matchId, 'stale-match', 'คำสั่งนี้เป็นของแมตช์เก่า ใช้สถานะล่าสุด');
        const previous = room.game;
        room.game = applyAppraisalAction(previous, { ...message.action, playerId: seat.id });
        this.phaseChanged(room, previous); peer.send({ type: 'ack', requestId: message.action.requestId }); break;
      }
      case 'reveal-ready':
        insist(room.game?.phase === 'REVEAL' && message.matchId === room.matchId && message.encounter === room.game.encounter,
          'stale-reveal', 'ผลช่วงนี้ผ่านไปแล้ว ใช้ผลล่าสุด');
        insist(!room.game.config.survival || room.game.players.find(p=>p.id===seat.id)?.life!==0,'spectator','ชีวิตหมดแล้ว ดูผู้เล่นที่ยังมีชีวิตไปต่อ');
        room.revealReady.add(seat.id);
        if (room.seats.every(s => room.game?.config.survival && room.game.players.find(p=>p.id===s.id)?.life===0 || room.revealReady.has(s.id))) this.advance(room);
        break;
      case 'audit':
        insist(room.game?.phase === 'RESULTS' && message.matchId === room.matchId, 'audit-private', 'ดาวน์โหลดข้อมูลลับได้หลังจบ run เท่านั้น');
        peer.send({ type: 'audit', audit: { schemaVersion: room.game.version, matchId: room.matchId!, playtestMode: room.playtestMode,
          startedAt: room.startedAt, endedAt: room.endedAt!, seats: structuredClone(room.matchSeats), run: exportAppraisalAudit(room.game),
          timerSettings:this.timerSettings(room),
          phaseTimes: room.phaseTimes.map(({ number, ...row }) => ({ ...row, encounter: number })),
          timeouts: room.timeouts.map(({ number, ...row }) => ({ ...row, encounter: number })) } });
        break;
      default: break;
    }
  }
  protected timeout(room: Room, now: number): void {
    insist(room.game, 'phase', 'run ยังไม่เริ่ม');
    const phase = room.game.phase, number = room.game.encounter;
    if (phase === 'REVEAL') { room.timeouts.push({ at: now, number, phase, playerId: null }); this.advance(room); return; }
    // Snapshot only the pending seats in the expired phase; the last action may advance it.
    const pending = room.game.players.filter(p => !p.paused && !p.done).map(p => p.id);
    for (const playerId of pending) {
      if (room.game.phase !== phase || room.game.encounter !== number) break;
      const previous = room.game;
      const action = defaultAppraisalAction(previous, playerId, `timeout_${room.matchId}_${number}_${phase}_${playerId}`);
      if (!action) continue;
      room.game = applyAppraisalAction(previous, action); room.timeouts.push({ at: now, number, phase, playerId }); this.phaseChanged(room, previous);
    }
  }
  protected broadcast(room: Room): void {
    for (const seat of room.seats) if (seat.peer) {
      const view: AppraisalRoomView = { rulesVersion: this.runConfig.survival?'0.5':'0.4', code: room.code, hostId: room.hostId, yourSeatId: seat.id,
        seats: room.seats.map(s => ({ id: s.id, name: s.name, ready: s.ready, connected: s.connected })), matchSeats: structuredClone(room.matchSeats),
        playtestMode: room.playtestMode, matchId: room.matchId, deadline: room.deadline, serverTime: this.now(), revealReady: [...room.revealReady],
        timerSettings:this.timerSettings(room),
        game: room.game ? appraisalViewFor(room.game, seat.id) : null };
      seat.peer.send({ type: 'state', room: view });
    }
  }
}
