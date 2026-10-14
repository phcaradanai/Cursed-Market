import type { Action, Event, GameView, Score } from "../game/types.js";

export type SeatAction = Action extends infer A ? A extends Action ? Omit<A, "playerId"> : never : never;
export type PlaytestMode = "no-voice" | "voice";
export type ClientMessage =
  | { type: "create"; name: string }
  | { type: "join"; roomCode: string; name: string }
  | { type: "resume"; roomCode: string; token: string }
  | { type: "ready"; ready: boolean }
  | { type: "start" }
  | { type: "leave" }
  | { type: "remove-seat"; seatId: string }
  | { type: "rematch" }
  | { type: "playtest-mode"; mode: PlaytestMode }
  | { type: "action"; matchId: string; action: SeatAction }
  | { type: "reveal-ready"; matchId: string; auctionNumber: number }
  | { type: "audit"; matchId: string };

export interface SeatView {
  id: string;
  name: string;
  ready: boolean;
  connected: boolean;
}

export interface RoomView {
  /** Absent on older retained servers; active games also carry their own config. */
  rulesVersion?: "0.3";
  code: string;
  hostId: string;
  yourSeatId: string;
  seats: SeatView[];
  matchSeats: { id: string; name: string }[];
  playtestMode: PlaytestMode;
  matchId: string | null;
  deadline: number | null;
  serverTime: number;
  revealReady: string[];
  game: GameView | null;
}

export interface MatchAudit {
  schemaVersion: 1;
  matchId: string;
  playtestMode: PlaytestMode;
  startedAt: number;
  endedAt: number;
  seats: { id: string; name: string }[];
  events: Event[];
  scores: Score[];
  winnerIds: string[];
  timeouts: { at: number; auctionNumber: number; phase: string; playerId: string | null }[];
  phaseTimes: { auctionNumber: number; phase: string; startedAt: number; endedAt: number }[];
}

export type ServerMessage =
  | { type: "joined"; roomCode: string; token: string; seatId: string }
  | { type: "state"; room: RoomView }
  | { type: "ack"; requestId: string }
  | { type: "left" }
  | { type: "error"; code: string; message: string; requestId?: string }
  | { type: "audit"; audit: MatchAudit };
