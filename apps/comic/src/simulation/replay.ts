import { readFileSync } from "node:fs";
import { isDeepStrictEqual } from "node:util";
import { replayEvents, scores, winnerIds } from "../game/index.js";
import type { Event } from "../game/types.js";
import { replayAppraisalAudit } from '../game/appraisal/index.js';
import { analyseAppraisalMatchAudit, appraisalRunFromDownload, isAppraisalDownload } from '../playtest/appraisal-report.js';

const file = process.argv[2];
if (!file) throw new Error("Usage: npm run replay -- path/to/example-match.json");
const input:unknown = JSON.parse(readFileSync(file, "utf8"));
if(isAppraisalDownload(input)) {
  if('run' in (input as Record<string,unknown>)) analyseAppraisalMatchAudit(input);
  const state=replayAppraisalAudit(appraisalRunFromDownload(input));
  const maximum=Math.max(...state.players.map(p=>p.score));
  console.log(JSON.stringify({rulesVersion:state.config.survival?'0.5':'0.4',phase:state.phase,encounters:state.config.survival?state.encounter:state.config.encounters,scores:state.players.map(p=>({playerId:p.id,total:p.score})),winnerIds:state.players.filter(p=>p.score===maximum).map(p=>p.id),...(state.collector?{collector:state.collector}:{})},null,2));
} else {
  const log=input as { events: Event[]; scores?: unknown; winnerIds?: unknown };
  const state = replayEvents(log.events);
  if (log.scores !== undefined && !isDeepStrictEqual(log.scores, scores(state))) throw new Error("Stored scores differ from replay");
  if (log.winnerIds !== undefined && !isDeepStrictEqual(log.winnerIds, winnerIds(state))) throw new Error("Stored winners differ from replay");
  console.log(JSON.stringify({ phase: state.phase, auctions: state.history.length, scores: scores(state), winnerIds: winnerIds(state) }, null, 2));
}
