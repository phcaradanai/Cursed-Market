import { spawn } from "node:child_process";

// `npm run dev` runs the current appraisal game (v0.5); `npm run dev:legacy` runs the old auction prototype.
const legacy = process.argv[2] === "legacy";
const server = legacy ? "dist/src/server/main.js" : "dist/src/server/appraisal-main.js";
const viteArgs = legacy ? [] : ["--config", "vite.appraisal.config.mjs"];
const children = [
  spawn(process.execPath, ["node_modules/typescript/bin/tsc", "--watch", "-p", "tsconfig.json"], { stdio: "inherit" }),
  spawn(process.execPath, ["--watch", server], { stdio: "inherit", env: legacy ? process.env : { PORT: "3103", ...process.env } }),
  spawn(process.execPath, ["node_modules/vite/bin/vite.js", ...viteArgs], { stdio: "inherit" }),
];
console.log(legacy ? "dev: legacy auction (client :5173, server :3100)" : "dev: Cursed Market v0.5 (open http://localhost:5174, server :3103)");
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  children.forEach(child => child.kill("SIGTERM"));
  process.exitCode = code;
}
children.forEach(child => {
  child.on("error", error => { console.error(error); stop(1); });
  child.on("exit", code => { if (!stopping) stop(code ?? 1); });
});
process.on("SIGINT", () => stop());
process.on("SIGTERM", () => stop());
