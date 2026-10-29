import { readFileSync } from "node:fs";
import { analyseDownloadedAudits } from "./downloaded-reports.js";

const files = process.argv.slice(2);
if (files.length === 0) throw new Error("Usage: npm run --silent playtest:report -- match-1.json [match-2.json ...]");
const inputs: unknown[] = files.map(file => JSON.parse(readFileSync(file, "utf8")) as unknown);
console.log(JSON.stringify(analyseDownloadedAudits(inputs), null, 2));
