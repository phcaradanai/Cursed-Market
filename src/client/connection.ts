import { useEffect, useRef, useState } from "react";
import type { ClientMessage, RoomView, SeatAction, ServerMessage } from "../shared/protocol.js";

type Connection = "connecting" | "online" | "reconnecting" | "replaced";
type Decision = SeatAction extends infer A ? A extends SeatAction ? Omit<A, "requestId" | "auctionNumber"> : never : never;
const STORAGE_KEY = "cursed-market-seat";
interface Credentials { roomCode: string; token: string }
function savedSeat(): Credentials | null {
  try {
    const value = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "null") as Credentials | null;
    return value && /^[A-Z2-9]{6}$/.test(value.roomCode) && /^[a-f0-9]{64}$/.test(value.token) ? value : null;
  } catch { return null; }
}

export function useConnection() {
  const [connection, setConnection] = useState<Connection>("connecting");
  const [room, setRoom] = useState<RoomView | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const roomRef = useRef<RoomView | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const pending = useRef(new Map<string, ClientMessage>());
  const credentials = useRef<Credentials | null>(savedSeat());

  useEffect(() => {
    let stopped = false;
    let retry: ReturnType<typeof setTimeout> | undefined;
    let failures = 0;
    const connect = () => {
      if (stopped) return;
      const socket = new WebSocket(`${location.protocol === "https:" ? "wss:" : "ws:"}//${location.host}/socket`);
      socketRef.current = socket;
      socket.onopen = () => {
        failures = 0;
        setConnection("online");
        if (credentials.current) socket.send(JSON.stringify({ type: "resume", ...credentials.current }));
      };
      socket.onmessage = event => {
        const message = JSON.parse(event.data as string) as ServerMessage;
        switch (message.type) {
          case "joined":
            credentials.current = { roomCode: message.roomCode, token: message.token };
            try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(credentials.current)); } catch { /* Reconnect still works in this open tab. */ }
            setError("");
            for (const action of pending.current.values()) socket.send(JSON.stringify(action));
            break;
          case "state":
            roomRef.current = message.room;
            setRoom(message.room);
            break;
          case "ack":
            pending.current.delete(message.requestId);
            setBusy(pending.current.size > 0);
            break;
          case "left":
            credentials.current = null;
            try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* No saved seat. */ }
            roomRef.current = null;
            setRoom(null);
            pending.current.clear();
            setBusy(false);
            break;
          case "error":
            setError(message.message);
            if (message.requestId) pending.current.delete(message.requestId);
            if (message.code === "room-missing" || message.code === "seat-missing") {
              credentials.current = null;
              try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* No saved seat. */ }
              roomRef.current = null;
              setRoom(null);
              pending.current.clear();
            }
            setBusy(pending.current.size > 0);
            break;
          case "audit": {
            const url = URL.createObjectURL(new Blob([JSON.stringify(message.audit, null, 2)], { type: "application/json" }));
            const link = document.createElement("a");
            link.href = url;
            link.download = `cursed-market-${message.audit.matchId}.json`;
            link.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
            break;
          }
        }
      };
      socket.onclose = event => {
        if (stopped) return;
        if (event.code === 4001) { setConnection("replaced"); return; }
        setConnection("reconnecting");
        retry = setTimeout(connect, Math.min(8000, 500 * 2 ** failures++));
      };
      socket.onerror = () => socket.close();
    };
    connect();
    return () => { stopped = true; clearTimeout(retry); socketRef.current?.close(); };
  }, []);

  const send = (message: ClientMessage) => {
    if (socketRef.current?.readyState !== WebSocket.OPEN) { setError("กำลังเชื่อมต่อใหม่ รอให้กลับมาออนไลน์ก่อน"); return false; }
    setError("");
    socketRef.current.send(JSON.stringify(message));
    return true;
  };
  const submit = (decision: Decision) => {
    const current = roomRef.current;
    if (!current?.game || !current.matchId || pending.current.size > 0) return;
    // getRandomValues works on LAN HTTP as well as secure origins.
    const requestId = Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, "0")).join("");
    const action = { ...decision, auctionNumber: current.game.auction.number, requestId } as SeatAction;
    const message: ClientMessage = { type: "action", matchId: current.matchId, action };
    pending.current.set(action.requestId, message);
    setBusy(true);
    if (!send(message)) { pending.current.delete(action.requestId); setBusy(false); }
  };
  return { connection, room, error, busy, send, submit, clearError: () => setError("") };
}
