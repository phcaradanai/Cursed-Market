import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 3100);
if (!Number.isSafeInteger(port) || port < 0 || port > 65535) throw new Error("PORT must be 0–65535");
const host = process.env.HOST ?? "0.0.0.0";
const app = createApp();
app.server.listen(port, host, () => console.log(`Cursed Market: http://localhost:${port} (bind ${host})`));
for (const signal of ["SIGINT", "SIGTERM"] as const) process.on(signal, () => { void app.close().then(() => process.exit(0)); });
