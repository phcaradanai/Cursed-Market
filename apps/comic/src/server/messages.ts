import type { ClientMessage, SeatAction } from "../shared/protocol.js";

export class MessageError extends Error {
  constructor(message = "คำสั่งไม่ถูกต้อง กรุณาโหลดหน้าใหม่แล้วลองอีกครั้ง") { super(message); }
}

export function object(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new MessageError();
  return value as Record<string, unknown>;
}

export function keys(value: Record<string, unknown>, allowed: string[]): void {
  if (Object.keys(value).some(key => !allowed.includes(key))) throw new MessageError();
}

export function string(value: unknown, max = 128): string {
  if (typeof value !== "string" || value.length === 0 || value.length > max) throw new MessageError();
  return value;
}

function name(value: unknown): string {
  const text = string(value, 80).trim();
  if (text.length === 0 || [...text].length > 24 || /[\u0000-\u001f\u007f]/.test(text)) throw new MessageError("ชื่อควรมี 1–24 ตัวอักษร");
  return text;
}

function code(value: unknown): string {
  const text = string(value, 6).toUpperCase();
  if (!/^[A-Z2-9]{6}$/.test(text)) throw new MessageError("รหัสห้องต้องมี 6 ตัวอักษร");
  return text;
}

export function integer(value: unknown): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) throw new MessageError();
  return value;
}

function action(value: unknown): SeatAction {
  const body = object(value);
  const requestId = string(body.requestId);
  const auctionNumber = integer(body.auctionNumber);
  if (auctionNumber < 1 || auctionNumber > 12) throw new MessageError();
  const base = { requestId, auctionNumber };
  switch (body.type) {
    case "offer":
      keys(body, ["type", "requestId", "auctionNumber", "relicId", "mode"]);
      if (body.mode !== "as-is" && body.mode !== "genuine" && body.mode !== "uncursed") throw new MessageError();
      return { type: "offer", ...base, relicId: string(body.relicId, 32), mode: body.mode };
    case "inspect":
      keys(body, ["type", "requestId", "auctionNumber", "attribute"]);
      if (body.attribute !== "genuine" && body.attribute !== "cursed") throw new MessageError();
      return { type: "inspect", ...base, attribute: body.attribute };
    case "pass-inspection":
      keys(body, ["type", "requestId", "auctionNumber"]);
      return { type: "pass-inspection", ...base };
    case "vote-route":
      keys(body, ["type", "requestId", "auctionNumber", "nodeId"]);
      return { type: "vote-route", ...base, nodeId: body.nodeId === null ? null : string(body.nodeId, 32) };
    case "choose-boon":
      keys(body, ["type", "requestId", "auctionNumber", "boonId"]);
      if (body.boonId !== null && !["curse-eater", "authenticity", "counterfeit", "high-roller", "lens", "specialist"].includes(body.boonId as string)) throw new MessageError();
      return { type: "choose-boon", ...base, boonId: body.boonId as "curse-eater" | "authenticity" | "counterfeit" | "high-roller" | "lens" | "specialist" | null };
    case "bid": {
      keys(body, ["type", "requestId", "auctionNumber", "amount", "wager"]);
      if (body.wager === undefined) return { type: "bid", ...base, amount: integer(body.amount) };
      const wager = object(body.wager);
      keys(wager, ["cursed", "stake"]);
      if (typeof wager.cursed !== "boolean") throw new MessageError();
      const stake = integer(wager.stake);
      if (stake < 1 || stake > 5) throw new MessageError();
      return { type: "bid", ...base, amount: integer(body.amount), wager: { cursed: wager.cursed, stake } };
    }
    default: throw new MessageError();
  }
}

/** Reconstruct allowlisted values; never accept a client-supplied actor identity. */
export function parseMessage(value: unknown): ClientMessage {
  const body = object(value);
  switch (body.type) {
    case "create": keys(body, ["type", "name"]); return { type: "create", name: name(body.name) };
    case "join": keys(body, ["type", "roomCode", "name"]); return { type: "join", roomCode: code(body.roomCode), name: name(body.name) };
    case "resume": {
      keys(body, ["type", "roomCode", "token"]);
      const token = string(body.token, 64);
      if (!/^[a-f0-9]{64}$/.test(token)) throw new MessageError();
      return { type: "resume", roomCode: code(body.roomCode), token };
    }
    case "ready":
      keys(body, ["type", "ready"]);
      if (typeof body.ready !== "boolean") throw new MessageError();
      return { type: "ready", ready: body.ready };
    case "start": case "leave": case "rematch": keys(body, ["type"]); return { type: body.type };
    case "remove-seat": keys(body, ["type", "seatId"]); return { type: "remove-seat", seatId: string(body.seatId, 32) };
    case "playtest-mode":
      keys(body, ["type", "mode"]);
      if (body.mode !== "voice" && body.mode !== "no-voice") throw new MessageError();
      return { type: "playtest-mode", mode: body.mode };
    case "action":
      keys(body, ["type", "matchId", "action"]);
      return { type: "action", matchId: string(body.matchId, 32), action: action(body.action) };
    case "reveal-ready":
      keys(body, ["type", "matchId", "auctionNumber"]);
      return { type: "reveal-ready", matchId: string(body.matchId, 32), auctionNumber: integer(body.auctionNumber) };
    case "audit": keys(body, ["type", "matchId"]); return { type: "audit", matchId: string(body.matchId, 32) };
    default: throw new MessageError();
  }
}
