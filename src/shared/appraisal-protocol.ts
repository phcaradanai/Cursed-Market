import type { AppraisalAction, AppraisalPhase, AppraisalView } from '../game/appraisal/types.js';
import type { AppraisalAudit } from '../game/appraisal/audit.js';
import type { ClientMessage, RoomView, ServerMessage, PlaytestMode } from './protocol.js';

export type AppraisalSeatAction = AppraisalAction extends infer A ? A extends AppraisalAction ? Omit<A, 'playerId'> : never : never;
export const APPRAISAL_TIMER_PHASES = ['PORTALS','APPRAISAL','TRADE','REVEAL'] as const;
export type AppraisalTimedPhase = Exclude<AppraisalPhase,'RESULTS'>;
export interface AppraisalTimerSettings { enabled:boolean;durationsMs:Record<AppraisalTimedPhase,number> }
export function validTimerSettings(value:unknown,minimumMs=1000):value is AppraisalTimerSettings {
  if(!value || typeof value!=='object' || Array.isArray(value))return false;
  const body=value as Record<string,unknown>;const durations=body.durationsMs;
  if(Object.keys(body).length!==2 || typeof body.enabled!=='boolean' || !durations || typeof durations!=='object' || Array.isArray(durations))return false;
  const times=durations as Record<string,unknown>;
  return Object.keys(times).length===4 && APPRAISAL_TIMER_PHASES.every(phase=>Number.isSafeInteger(times[phase]) && (times[phase] as number)>=minimumMs && (times[phase] as number)<=900000 && (minimumMs!==1000 || (times[phase] as number)%1000===0));
}
export type AppraisalClientMessage =
  | Exclude<ClientMessage, { type: 'action' | 'reveal-ready' | 'audit' }>
  | { type: 'action'; matchId: string; action: AppraisalSeatAction }
  | { type: 'reveal-ready'; matchId: string; encounter: number }
  | { type: 'audit'; matchId: string }
  | AppraisalTimerMessage;
// Settings are lobby-only controls; no actor or match secret is supplied by a client.
export type AppraisalTimerMessage = {type:'timer-settings';settings:AppraisalTimerSettings};
export interface AppraisalRoomView extends Omit<RoomView, 'rulesVersion' | 'game'> {
  rulesVersion: '0.4' | '0.5'; game: AppraisalView | null;
  timerSettings?:AppraisalTimerSettings;
}
/** Room metadata wraps the deterministic audit; the engine audit stays byte-for-byte replayable. */
export interface AppraisalMatchAudit {
  schemaVersion: 4 | 5; matchId: string; playtestMode: PlaytestMode;
  startedAt: number; endedAt: number; seats: { id: string; name: string }[];
  run: AppraisalAudit;
  timerSettings?:AppraisalTimerSettings;
  phaseTimes: { encounter: number; phase: string; startedAt: number; endedAt: number }[];
  timeouts: { at: number; encounter: number; phase: string; playerId: string | null }[];
}
export type AppraisalServerMessage =
  | Exclude<ServerMessage, { type: 'state' | 'audit' }>
  | { type: 'state'; room: AppraisalRoomView }
  | { type: 'audit'; audit: AppraisalMatchAudit };
