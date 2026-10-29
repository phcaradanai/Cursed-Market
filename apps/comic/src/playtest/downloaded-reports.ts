import { analyseMatchAudit } from './report.js';
import { analyseAppraisalMatchAudit, isAppraisalDownload } from './appraisal-report.js';

/** Mixed generations keep their own metrics; the common envelope never claims human fun. */
export function analyseDownloadedAudits(inputs:unknown[]) {
  if(inputs.length===0)throw new Error('Provide at least one downloaded match');
  const matches=inputs.map(input=>isAppraisalDownload(input)?analyseAppraisalMatchAudit(input):analyseMatchAudit(input));
  if(new Set(matches.map(m=>m.matchId)).size!==matches.length)throw new Error('The same match was supplied more than once');
  return {schemaVersion:1,evidenceKind:'match-logs-only',limitation:'Logs cannot establish human participation, understanding, engagement, enjoyment or voluntary rematches. Collect the observer worksheet separately.',humanFunValidated:false,voluntaryRematchRate:null,matches};
}
