import { isDeepStrictEqual } from 'node:util';
import { advanceAppraisalEncounter, applyAppraisalAction, restoreAppraisalRun, replayAppraisalAudit } from '../game/appraisal/index.js';
import type { AppraisalAudit } from '../game/appraisal/audit.js';
import type { AppraisalMatchAudit } from '../shared/appraisal-protocol.js';
import { validTimerSettings } from '../shared/appraisal-protocol.js';

function requireValue(value:unknown,message:string):asserts value {if(!value)throw new Error(`Invalid appraisal match audit: ${message}`);}
export function isAppraisalDownload(input:unknown):boolean {return !!input && typeof input==='object' && !Array.isArray(input) && [4,5].includes((input as {schemaVersion?:number}).schemaVersion!);}
/** The room wrapper carries timing metadata; the canonical run is always strictly replayed. */
export function appraisalRunFromDownload(input:unknown):AppraisalAudit {
  requireValue(isAppraisalDownload(input),'expected schemaVersion 4 or 5');
  return ((input as {run?:AppraisalAudit}).run??input) as AppraisalAudit;
}
function replayPhaseKeys(run:AppraisalAudit):string[] {
  let state=restoreAppraisalRun(run.playerIds,run.seed,run.config);
  const keys=[`${state.encounter}:${state.phase}`];
  for(const command of run.commands) {
    state=command.type==='advance'?advanceAppraisalEncounter(state):applyAppraisalAction(state,command);
    const key=`${state.encounter}:${state.phase}`;
    if(state.phase!=='RESULTS' && key!==keys.at(-1)) keys.push(key);
  }
  return keys;
}
export function analyseAppraisalMatchAudit(input:unknown) {
  requireValue(isAppraisalDownload(input),'expected schemaVersion 4 or 5');
  const audit=input as AppraisalMatchAudit;
  requireValue(typeof audit.matchId==='string' && audit.matchId.length>0 && audit.run,'expected a downloaded room audit, not a simulation run');
  requireValue(audit.playtestMode==='voice' || audit.playtestMode==='no-voice','invalid playtest mode');
  requireValue(Array.isArray(audit.seats) && Array.isArray(audit.phaseTimes) && Array.isArray(audit.timeouts),'missing room metadata');
  if(audit.timerSettings!==undefined) {
    requireValue(validTimerSettings(audit.timerSettings,1),'invalid timer settings');
    requireValue(audit.timerSettings.enabled || audit.timeouts.length===0,'untimed match cannot have timeout defaults');
  }
  requireValue(Number.isFinite(audit.startedAt) && Number.isFinite(audit.endedAt) && audit.endedAt>=audit.startedAt,'invalid match timestamps');
  const state=replayAppraisalAudit(audit.run);
  requireValue(audit.schemaVersion===audit.run.schemaVersion,'room and run versions disagree');
  requireValue(audit.seats.every(s=>s && typeof s.id==='string' && typeof s.name==='string') && isDeepStrictEqual(audit.seats.map(s=>s.id),audit.run.playerIds),'roster disagrees with replay');
  const expected=replayPhaseKeys(audit.run);const keys=new Set<string>();let previousEnd=audit.startedAt;
  for(const [index,timing] of audit.phaseTimes.entries()) {
    requireValue(timing && Number.isSafeInteger(timing.encounter),'invalid phase timing');
    const key=`${timing.encounter}:${timing.phase}`;
    requireValue(!keys.has(key),'duplicate phase timing');requireValue(expected[index]===key,'phase order disagrees with replay');keys.add(key);
    requireValue(Number.isFinite(timing.startedAt) && Number.isFinite(timing.endedAt) && timing.startedAt>=previousEnd && timing.endedAt>=timing.startedAt && timing.endedAt<=audit.endedAt,'phase timestamps out of order');previousEnd=timing.endedAt;
  }
  requireValue(keys.size===expected.length,'missing phase timing');
  const defaults=new Set<string>();
  for(const timeout of audit.timeouts) {
    requireValue(timeout && keys.has(`${timeout.encounter}:${timeout.phase}`),'invalid timeout phase');
    const timing=audit.phaseTimes.find(t=>t.encounter===timeout.encounter && t.phase===timeout.phase)!;
    requireValue(Number.isFinite(timeout.at) && timeout.at>=timing.startedAt && timeout.at<=timing.endedAt,'timeout outside phase');
    const key=`${timeout.encounter}:${timeout.phase}:${timeout.playerId}`;requireValue(!defaults.has(key),'duplicate timeout');defaults.add(key);
    if(timeout.phase==='REVEAL') requireValue(timeout.playerId===null,'reveal timeout must have no actor');
    else requireValue(audit.run.commands.some(c=>c.type==='done' && c.playerId===timeout.playerId && c.encounter===timeout.encounter && c.requestId===`timeout_${audit.matchId}_${timeout.encounter}_${timeout.phase}_${timeout.playerId}`),'timeout disagrees with recorded safe default');
  }
  const commands=audit.run.commands.filter(c=>c.type!=='advance');
  const manual=commands.filter(c=>!c.requestId.startsWith(`timeout_${audit.matchId}_`));
  const countBy=(values:string[])=>Object.fromEntries([...new Set(values)].sort().map(value=>[value,values.filter(v=>v===value).length]));
  const appraisals=state.trace.filter(t=>t.type==='appraised');
  const maximum=Math.max(...state.players.map(p=>p.score));
  return {
    matchId:audit.matchId,rulesVersion:state.config.survival?'0.5-survival-experimental':'0.4-appraisers-experimental',playtestMode:audit.playtestMode,playerCount:state.players.length,
    timerSettings:audit.timerSettings??null,
    recordedDurationSeconds:(audit.endedAt-audit.startedAt)/1000,encounters:state.config.survival?state.encounter:state.config.encounters,
    ...(state.collector?{collector:state.collector}:{}),
    commandCounts:countBy(commands.map(c=>c.type)),manualCommandCounts:countBy(manual.map(c=>c.type)),defaultChoices:commands.length-manual.length,
    eventOffers:countBy(state.trace.filter(t=>t.type==='event-offered').map(t=>String(t.details.id))),
    eventAccepts:countBy(state.trace.filter(t=>t.type==='event-resolved').map(t=>String(t.details.id))),
    eventDeclines:countBy(state.trace.filter(t=>t.type==='event-declined').map(t=>String(t.details.id))),
    recordedAppraisals:{count:appraisals.length,caught:appraisals.filter(t=>t.details.caught===true).length,accepted:appraisals.filter(t=>t.details.accepted===true).length},
    transactionCounts:countBy(state.ledger.map(row=>row.reason)),
    phases:audit.phaseTimes.map(t=>({encounter:t.encounter,phase:t.phase,seconds:(t.endedAt-t.startedAt)/1000})),
    players:state.players.map(p=>({playerId:p.id,name:audit.seats.find(s=>s.id===p.id)!.name,credits:p.credits,energy:p.energy,itemCount:state.collector?.find(row=>row.playerId===p.id)?.items.length??p.inventory.length,score:p.score,...(p.life!==undefined?{life:p.life,deathEncounter:state.trace.find(t=>t.playerId===p.id && t.type==='death')?.encounter??null}:{}),deadEncounters:state.history.filter(h=>h.playerId===p.id && h.paused==='dead').length,exhaustedEncounters:state.history.filter(h=>h.playerId===p.id && h.paused==='exhausted').length})),
    winnerIds:state.players.filter(p=>p.score===maximum).map(p=>p.id),scoreBreakdown:state.history,
  };
}
