import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { resolve, extname, relative } from "node:path";
import { WebSocket, WebSocketServer } from "ws";
import { MessageError } from "./messages.js";
import { RoomService } from "./rooms.js";
import type { LifecyclePeer, RoomTransport } from "./room-lifecycle.js";

export function createApp(options: { rooms?: RoomTransport; webRoot?: string } = {}) {
  const rooms = options.rooms ?? new RoomService();
  const webRoot = resolve(options.webRoot ?? "dist/client");
  const server = createServer((req, res) => {
    if (req.method !== "GET" && req.method !== "HEAD") { res.writeHead(405); res.end(); return; }
    let pathname: string;
    try { pathname = decodeURIComponent(new URL(req.url ?? "/", "http://local").pathname); }
    catch { res.writeHead(400); res.end(); return; }
    if (pathname === "/health") { res.writeHead(200, { "Content-Type": "application/json" }); res.end(JSON.stringify({ ok: true })); return; }
    let file = resolve(webRoot, `.${pathname}`);
    if (relative(webRoot, file).startsWith("..") || pathname.includes("\0")) { res.writeHead(403); res.end(); return; }
    if (!existsSync(file) || !statSync(file).isFile()) {
      if (pathname !== "/") { res.writeHead(404); res.end("Not found"); return; }
      file = resolve(webRoot, "index.html");
    }
    if (!existsSync(file)) { res.writeHead(503); res.end("Build the client with npm run build, or use npm run dev."); return; }
    const mime: Record<string, string> = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".ttf": "font/ttf" };
    res.writeHead(200, {
      "Content-Type": mime[extname(file)] ?? "application/octet-stream",
      "Cache-Control": extname(file) === ".html" ? "no-cache" : "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer",
      "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self' ws: wss:; frame-ancestors 'none'; base-uri 'self'",
    });
    if (req.method === "HEAD") res.end(); else createReadStream(file).pipe(res);
  });
  const sockets = new WebSocketServer({ noServer: true, maxPayload: 4096 });
  server.on("upgrade", (req, socket, head) => {
    let validOrigin = true;
    try { if (req.headers.origin) validOrigin = new URL(req.headers.origin).host === req.headers.host; } catch { validOrigin = false; }
    if (req.url !== "/socket" || !validOrigin) { socket.write("HTTP/1.1 403 Forbidden\r\n\r\n"); socket.destroy(); return; }
    sockets.handleUpgrade(req, socket, head, ws => sockets.emit("connection", ws));
  });
  const live = new Map<WebSocket, boolean>();
  sockets.on("connection", socket => {
    live.set(socket, true);
    const peer: LifecyclePeer = {
      send(message) { if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(message)); },
      close(code, reason) { socket.close(code, reason); },
    };
    let windowStarted = Date.now();
    let messages = 0;
    socket.on("pong", () => live.set(socket, true));
    socket.on("error", () => socket.terminate());
    socket.on("close", () => { live.delete(socket); rooms.disconnect(peer); });
    socket.on("message", (data, isBinary) => {
      if (Date.now() - windowStarted > 5000) { windowStarted = Date.now(); messages = 0; }
      if (++messages > 100) { socket.close(4008, "Too many requests"); return; }
      try {
        if (isBinary) throw new MessageError();
        rooms.receive(peer, JSON.parse(data.toString()));
      } catch {
        peer.send({ type: "error", code: "invalid-message", message: "คำสั่งไม่ถูกต้อง กรุณาโหลดหน้าใหม่แล้วลองอีกครั้ง" });
      }
    });
  });
  const ticker = setInterval(() => rooms.tick(), 250);
  ticker.unref();
  const heartbeat = setInterval(() => {
    for (const [socket, alive] of live) {
      if (!alive) socket.terminate();
      else { live.set(socket, false); socket.ping(); }
    }
  }, 30000);
  heartbeat.unref();
  return {
    server, rooms,
    async close(): Promise<void> {
      clearInterval(ticker); clearInterval(heartbeat);
      for (const socket of sockets.clients) socket.terminate();
      await new Promise<void>(done => sockets.close(() => done()));
      if (server.listening) await new Promise<void>((done, reject) => server.close(error => error ? reject(error) : done()));
    },
  };
}
