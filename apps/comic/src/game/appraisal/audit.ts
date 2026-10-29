import { isDeepStrictEqual } from 'node:util';
import { advanceAppraisalEncounter, applyAppraisalAction, assertAppraisalInvariants, restoreAppraisalRun } from './engine.js';
import { check } from './mechanics.js';
import type { AppraisalAction, AppraisalConfig, AppraisalState, EncounterResult } from './types.js';

export interface AppraisalAudit {
  schemaVersion:4 | 5; playerIds:string[]; seed:string; config:AppraisalConfig;
  commands:Array<AppraisalAction|{type:'advance'}>;
  ledger:AppraisalState['ledger']; history:EncounterResult[]; trace:AppraisalState['trace'];
  items:AppraisalState['items']; final: Array<{id:string;credits:number;energy:number;inventory:string[];score:number;life?:number}>;
  collector?:AppraisalState['collector'];
}
export function scoresFromAppraisalHistory(history:EncounterResult[]):Record<string,number> {
  const scores:Record<string,number>={};
  for(const row of history) {
    check(row.score===(row.paused==='dead'?0:row.gain+row.accuracy),'score','คะแนน encounter ไม่ตรง breakdown');
    scores[row.playerId]=(scores[row.playerId]??0)+row.score;
  }
  return scores;
}
export function exportAppraisalAudit(state:AppraisalState):AppraisalAudit {
  check(state.phase==='RESULTS','audit-private','ดาวน์โหลด seed/audit ได้หลังจบ run เท่านั้น');
  return structuredClone({schemaVersion:state.version,playerIds:state.players.map(p=>p.id),seed:state.seed,config:state.config,commands:state.commands,ledger:state.ledger,history:state.history,trace:state.trace,items:state.items,final:state.players.map(p=>({id:p.id,credits:p.credits,energy:p.energy,inventory:p.inventory,score:p.score,...(p.life!==undefined?{life:p.life}:{})})),...(state.collector?{collector:state.collector}:{})});
}
export function replayAppraisalAudit(audit:AppraisalAudit):AppraisalState {
  check((audit?.schemaVersion===4 || audit?.schemaVersion===5) && Array.isArray(audit.commands) && (audit.schemaVersion===5)===!!audit.config.survival,'audit','เวอร์ชัน appraisal audit ไม่ตรงกติกา');
  let state=restoreAppraisalRun(audit.playerIds,audit.seed,audit.config);
  for(const command of audit.commands) state=command.type==='advance'?advanceAppraisalEncounter(state):applyAppraisalAction(state,command);
  check(state.phase==='RESULTS' && isDeepStrictEqual(exportAppraisalAudit(state),audit),'audit','ผล audit ไม่ตรง replay');
  assertAppraisalInvariants(state);if(state.config.survival)return state;
  const scores=scoresFromAppraisalHistory(state.history);
  check(state.players.every(p=>scores[p.id]===p.score),'score','คะแนน run ไม่ตรงประวัติ');return state;
}
