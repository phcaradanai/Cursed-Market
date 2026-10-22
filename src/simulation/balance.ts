import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { advanceAppraisalEncounter, applyAppraisalAction, createAppraisalRun } from '../game/appraisal/index.js';
import { BROKERAGE_RULES, SURVIVAL_RULES } from '../game/appraisal/index.js';
import type { AppraisalAction, AppraisalConfig, AppraisalState } from '../game/appraisal/index.js';
import { APPRAISAL_POLICIES, appraisalBotTurn } from './appraisal.js';
import type { AppraisalPolicy } from './appraisal.js';

/** Table rules the live server uses (survival mode), plus any rule flags under test. */
export const liveRules=(extra:Partial<AppraisalConfig>={}):Partial<AppraisalConfig>=>({brokerage:BROKERAGE_RULES,polish:true,npcEvents:true,survival:SURVIVAL_RULES,...extra});
export interface RunStats {encounters:number;ended:'collector'|'cap'|'stuck';scores:number[];credits:number[];healed:Record<string,number>;lost:Record<string,number>;trace:Record<string,number>}
/** One uncapped bot run: bots never retire, so the run lasts as long as the rules let a table last. */
export function playBalanced(count:number,policies:AppraisalPolicy[],seed:string,overrides:Partial<AppraisalConfig>,maxTurns=8000):{state:AppraisalState;ended:RunStats['ended']} {
  let state:AppraisalState=createAppraisalRun(Array.from({length:count},(_,i)=>`seat${i}`),seed,overrides);
  let cursor=0;let ended:RunStats['ended']='stuck';
  for(let turn=0;turn<maxTurns;turn++) {
    if(state.phase==='RESULTS'){ended='collector';break;}
    if(state.phase==='REVEAL') {state=advanceAppraisalEncounter(state);continue;}
    const active=state.players.map((player,index)=>({player,index})).filter(({player})=>!player.paused && !player.done)
      .sort((x,y)=>((x.index-cursor+count)%count)-((y.index-cursor+count)%count));
    if(!active.length) break;
    const bots=active.map(({player})=>({id:player.id,policy:policies[state.players.indexOf(player)%policies.length]!}));
    const choice=appraisalBotTurn(state,bots)??{id:active[0]!.player.id,body:{type:'done'} as never};
    const chosen=active.find(({player})=>player.id===choice.id)!;cursor=(chosen.index+1)%count;
    state=applyAppraisalAction(state,{...choice.body,playerId:chosen.player.id,requestId:`b-${turn}`,encounter:state.encounter} as AppraisalAction);
  }
  return {state,ended};
}
export function runBalanced(count:number,policies:AppraisalPolicy[],seed:string,overrides:Partial<AppraisalConfig>,maxTurns=8000):RunStats {
  const {state,ended}=playBalanced(count,policies,seed,overrides,maxTurns);
  const healed:Record<string,number>={};const lost:Record<string,number>={};const trace:Record<string,number>={};
  for(const t of state.trace){
    trace[t.type]=(trace[t.type]??0)+1;
    if(t.type==='life-lost')lost[String(t.details.reason)]=(lost[String(t.details.reason)]??0)+Number(t.details.amount);
    if(t.type==='life-restored')healed[String(t.details.reason)]=(healed[String(t.details.reason)]??0)+Number(t.details.amount);
  }
  return {encounters:state.encounter,ended,scores:state.players.map(p=>p.score),credits:state.players.map(p=>p.credits),healed,lost,trace};
}
const pct=(values:number[],q:number)=>{const s=[...values].sort((a,b)=>a-b);return s[Math.min(s.length-1,Math.floor(q*s.length))]!;};
export function summarize(runs:RunStats[]):string {
  const lengths=runs.map(r=>r.encounters);
  const healed:Record<string,number>={};const lost:Record<string,number>={};const trace:Record<string,number>={};
  for(const r of runs){for(const [k,v] of Object.entries(r.lost))lost[k]=(lost[k]??0)+v;for(const [k,v] of Object.entries(r.healed))healed[k]=(healed[k]??0)+v;for(const [k,v] of Object.entries(r.trace))trace[k]=(trace[k]??0)+v;}
  const per=(n:number)=>(n/runs.length).toFixed(2);
  return [
    `runs ${runs.length}: length median ${pct(lengths,.5)} p90 ${pct(lengths,.9)} max ${Math.max(...lengths)} · stuck ${runs.filter(r=>r.ended==='stuck').length}`,
    `final score mean ${(runs.flatMap(r=>r.scores).reduce((a,b)=>a+b,0)/runs.flatMap(r=>r.scores).length).toFixed(1)} · credits mean ${(runs.flatMap(r=>r.credits).reduce((a,b)=>a+b,0)/runs.flatMap(r=>r.credits).length).toFixed(1)}`,
    `life lost per run by source: ${Object.entries(lost).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k} ${per(v)}`).join(' · ')||'none'}`,
    `life healed per run by source: ${Object.entries(healed).map(([k,v])=>`${k} ${per(v)}`).join(' · ')||'none'}`,
    `per run: ${['market-sale','trade-completed','unsold-consigned','unsold-penalty','auction-won','pulse-shards','death','life-lost','stolen','steal-failed','pickpocketed','pickpocket-failed','core2-event','skill','scrap-energy','dread-hit','inflation-backlash'].map(k=>`${k} ${per(trace[k]??0)}`).join(' · ')}`,
  ].join('\n');
}
if(process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href) {
  const args=process.argv.slice(2);let n=24;const extra:Partial<AppraisalConfig>={};
  for(let i=0;i<args.length;i++){if(args[i]==='--runs')n=Number(args[++i]);else if(args[i]==='--core2')(extra as Record<string,unknown>).core2=true;else throw new Error(`Unknown argument ${args[i]}`);}
  for(const count of [2,3,4]) {
    const runs:RunStats[]=[];
    for(let i=0;i<n;i++)runs.push(runBalanced(count,[...APPRAISAL_POLICIES],`balance:${count}:${i}`,liveRules(extra)));
    console.log(`\n== ${count} seats, mixed bots${(extra as Record<string,unknown>).core2?' · core2':''}\n${summarize(runs)}`);
  }
  for(const policy of APPRAISAL_POLICIES){
    const runs:RunStats[]=[];for(let i=0;i<n;i++)runs.push(runBalanced(3,[policy],`balance-solo:${policy}:${i}`,liveRules(extra)));
    console.log(`\n== 3 seats, all ${policy}\n${summarize(runs)}`);
  }
}
