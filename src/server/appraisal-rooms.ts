import { SURVIVAL_RULES, advanceAppraisalEncounter, applyAppraisalAction, appraisalViewFor, createAppraisalRun, defaultAppraisalAction, exportAppraisalAudit } from '../game/appraisal/index.js';
import type { AppraisalConfig, AppraisalPhase, AppraisalState } from '../game/appraisal/types.js';
import type { AppraisalBotPolicy, AppraisalMode, AppraisalClientMessage, AppraisalServerMessage, AppraisalRoomView, AppraisalTimerSettings } from '../shared/appraisal-protocol.js';
import { APPRAISAL_TIMER_PHASES } from '../shared/appraisal-protocol.js';
import { appraisalBotTurn } from '../simulation/appraisal.js';
import type { AppraisalPolicy } from '../simulation/appraisal.js';
import type { AppraisalAction } from '../game/appraisal/types.js';
import { parseAppraisalMessage } from './appraisal-messages.js';
import { insist, RoomLifecycle } from './room-lifecycle.js';
import type { LifecyclePeer, LifecycleRoom, LifecycleSeat } from './room-lifecycle.js';

type Room = LifecycleRoom<AppraisalState, AppraisalServerMessage>;
type Seat = LifecycleSeat<AppraisalServerMessage>;
export const APPRAISAL_PHASE_MS: Record<Exclude<AppraisalPhase, 'RESULTS'>, number> = {
  PORTALS: 30000, APPRAISAL: 90000, TRADE: 45000, REVEAL: 30000,
};
/** Replenished income can keep a bot alive indefinitely, so survival bots stop spending after this encounter and the run can end. */
const BOT_RETIRE_ENCOUNTER = 12;
export class AppraisalRoomService extends RoomLifecycle<AppraisalState, AppraisalClientMessage, AppraisalServerMessage> {
  private readonly durations: typeof APPRAISAL_PHASE_MS;
  constructor(now: () => number = Date.now, durations: Partial<typeof APPRAISAL_PHASE_MS> = {}, idleMs = 30 * 60 * 1000, private readonly runConfig:Partial<AppraisalConfig> = {}) {
    super(now, idleMs); this.durations = { ...APPRAISAL_PHASE_MS, ...durations };
  }
  protected parse(value: unknown): AppraisalClientMessage { return parseAppraisalMessage(value); }
  /** The server's configured mode is only the lobby default; the host can switch before the match starts. */
  private modeOf(room: Room): AppraisalMode { return room.mode === 'survival' || room.mode === 'classic' ? room.mode : this.runConfig.survival ? 'survival' : 'classic'; }
  protected createGame(ids: string[], seed: string, room: Room): AppraisalState {
    const { survival, ...base } = this.runConfig;
    return createAppraisalRun(ids, seed, this.modeOf(room) === 'survival' ? { ...base, survival: survival ?? SURVIVAL_RULES } : base);
  }
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
        if(current.enabled!==message.settings.enabled || APPRAISAL_TIMER_PHASES.some(phase=>current.durationsMs[phase]!==message.settings.durationsMs[phase]))this.unready(room);
        room.timing=structuredClone(message.settings);break;
      }
      case 'add-bot': {
        this.hostOnly(room,seat);insist(!room.game,'match-started','เพิ่มบอทได้ก่อนเริ่มเกมเท่านั้น');
        insist(room.seats.length<4,'room-full','ห้องนี้มีผู้เล่นครบ 4 คนแล้ว');
        const used=new Set(room.seats.filter(s=>s.bot).map(s=>s.name));let n=1;while(used.has(`Bot ${n}`))n++;
        this.addBotSeat(room,`Bot ${n}`,message.policy);break;
      }
      case 'remove-bot': {
        this.hostOnly(room,seat);insist(!room.game,'match-started','นำบอทออกได้ก่อนเริ่มเกมเท่านั้น');
        const bot=room.seats.find(s=>s.id===message.seatId);insist(bot?.bot,'not-a-bot','ที่นั่งนี้ไม่ใช่บอท');
        room.seats=room.seats.filter(s=>s!==bot);break;
      }
      case 'rules-mode': {
        this.hostOnly(room,seat);insist(!room.game,'match-started','เลือกโหมดได้ก่อนเริ่มเกมเท่านั้น');
        if(this.modeOf(room)!==message.mode)this.unready(room);
        room.mode=message.mode;break;
      }
      case 'action': {
        insist(room.game && message.matchId === room.matchId, 'stale-match', 'คำสั่งนี้เป็นของแมตช์เก่า ใช้สถานะล่าสุด');
        insist(!room.revealReady.has(seat.id) || !!room.game.accepted[`${seat.id}:${message.action.requestId}`],'already-ready','ยืนยันไปต่อแล้ว รอรอบถัดไป');
        if(message.action.type==='loan-respond' && message.action.accept){
          const loanId=message.action.loanId;
          const loan=room.game.loans?.find(l=>l.id===loanId);
          insist(!loan || ![loan.borrowerId,loan.lenderId].some(id=>room.revealReady.has(id)),'already-ready','คู่สัญญายืนยันไปต่อแล้ว ทำสัญญาใหม่ช่วงถัดไป');
        }
        const previous = room.game;
        room.game = applyAppraisalAction(previous, { ...message.action, playerId: seat.id });
        this.phaseChanged(room, previous); peer.send({ type: 'ack', requestId: message.action.requestId }); break;
      }
      case 'reveal-ready':
        insist(room.game?.phase === 'REVEAL' && message.matchId === room.matchId && message.encounter === room.game.encounter,
          'stale-reveal', 'ผลช่วงนี้ผ่านไปแล้ว ใช้ผลล่าสุด');
        insist(!room.game.config.survival || room.game.players.find(p=>p.id===seat.id)?.life!==0,'spectator','ชีวิตหมดแล้ว ดูผู้เล่นที่ยังมีชีวิตไปต่อ');
        room.revealReady.add(seat.id);
        if (this.revealDone(room)) this.advance(room);
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
  private botSeq = 0;
  /** Reveal is over once every living seat has confirmed; bots confirm as soon as the phase opens. */
  private revealDone(room: Room): boolean {
    return room.seats.every(s => room.game?.config.survival && room.game.players.find(p=>p.id===s.id)?.life===0 || room.revealReady.has(s.id));
  }
  /** Bot seats play through the same actions and DTOs as a human; a rejected move falls back to ending their turn. */
  protected override afterChange(room: Room): void {
    const skipped = new Set<string>();
    for (let guard = 0; room.game && guard < 2000; guard++) {
      const game = room.game;
      if (game.phase === 'RESULTS') return;
      let acted = false;
      if (game.phase === 'REVEAL') {
        for (const seat of room.seats) if (seat.bot && !room.revealReady.has(seat.id) && !(game.config.survival && game.players.find(p=>p.id===seat.id)?.life===0)) { room.revealReady.add(seat.id); acted = true; }
        if (acted && this.revealDone(room)) this.advance(room);
        if (!acted) return;
        continue;
      }
      const current: AppraisalState = room.game!;
      const bots = room.seats.filter(s => s.bot && !skipped.has(s.id)).flatMap(seat => {
        const player = current.players.find(p => p.id === seat.id);
        return player && !player.paused && !player.done ? [{ id: seat.id, policy: seat.bot as AppraisalPolicy }] : [];
      });
      if (!bots.length) return;
      const humansActive = current.players.some(p => !p.paused && !p.done && (!current.config.survival || p.life !== 0) && !room.seats.find(s => s.id === p.id)?.bot);
      const turn = appraisalBotTurn(current, bots, { humansActive, retired: !!current.config.survival && current.encounter > BOT_RETIRE_ENCOUNTER });
      if (!turn) return;
      const previous: AppraisalState = current;
      const attempt = (body: object): AppraisalState => applyAppraisalAction(previous, { ...body, playerId: turn.id, requestId: `bot-${++this.botSeq}`, encounter: previous.encounter } as AppraisalAction);
      try {
        try { room.game = attempt(turn.body); }
        catch { room.game = attempt({ type: 'done' }); }
        this.phaseChanged(room, previous);
      } catch { skipped.add(turn.id); /* leave this seat to the phase timer */ }
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
      const view: AppraisalRoomView = { rulesVersion: '0.5', mode: this.modeOf(room), code: room.code, hostId: room.hostId, yourSeatId: seat.id,
        seats: room.seats.map(s => ({ id: s.id, name: s.name, ready: s.ready, connected: s.connected, ...(s.bot ? { bot: s.bot as AppraisalBotPolicy } : {}) })), matchSeats: structuredClone(room.matchSeats),
        playtestMode: room.playtestMode, matchId: room.matchId, deadline: room.deadline, serverTime: this.now(), revealReady: [...room.revealReady],
        timerSettings:this.timerSettings(room),
        game: room.game ? appraisalViewFor(room.game, seat.id) : null };
      seat.peer.send({ type: 'state', room: view });
    }
  }
}
