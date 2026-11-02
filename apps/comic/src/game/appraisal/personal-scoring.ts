import {collectorTotal} from './scoring.js';
import type {Rarity} from '../../shared/item-rarity.js';

// Exact approved1551908 experiment; receipt pins the immutable source JSON.
export const PERSONAL_SCORING_WEIGHTS=[
  {
    "id": "bought",
    "group": "commerce",
    "unit": "unique original bought item",
    "numerator": 2,
    "denominator": 1,
    "cap": 40
  },
  {
    "id": "soldQuantity",
    "group": "commerce",
    "unit": "eligible successful sale item",
    "numerator": 5,
    "denominator": 1,
    "cap": 75
  },
  {
    "id": "soldGrossCredits",
    "group": "commerce",
    "unit": "eligible completed gross sale credits excluding fees/rebates/commissions",
    "numerator": 1,
    "denominator": 10,
    "cap": 100
  },
  {
    "id": "trustGained",
    "group": "relations",
    "unit": "actual positive merchant trust gained after cap; cumulative, never subtract later losses",
    "numerator": 3,
    "denominator": 1,
    "cap": 120
  },
  {
    "id": "inspection",
    "group": "knowledge",
    "unit": "new personally inspected item facet",
    "numerator": 1,
    "denominator": 1,
    "cap": 24
  },
  {
    "id": "accurateAppraisal",
    "group": "knowledge",
    "unit": "first submitted appraisal per origin within20percent of true rarity-scaled base",
    "numerator": 2,
    "denominator": 1,
    "cap": 40
  },
  {
    "id": "npcContract",
    "group": "relations",
    "unit": "fulfilled NPC contract id",
    "numerator": 4,
    "denominator": 1,
    "cap": 32
  },
  {
    "id": "interest",
    "group": "finance",
    "unit": "aged interest credits actually paid to wallet",
    "numerator": 1,
    "denominator": 1,
    "cap": 30
  },
  {
    "id": "loanRepaid",
    "group": "finance",
    "unit": "fully repaid real funded loan surviving at least one full encounter",
    "numerator": 5,
    "denominator": 1,
    "cap": 20
  },
  {
    "id": "survived",
    "group": "journey",
    "unit": "completed encounter with life above0 after settlement",
    "numerator": 2,
    "denominator": 1,
    "cap": 30
  },
  {
    "id": "lifeLost",
    "group": "journey",
    "unit": "actual HP removed, including voluntary costs, excluding overkill/death count",
    "numerator": 1,
    "denominator": 1,
    "cap": 12
  },
  {
    "id": "theft",
    "group": "journey",
    "unit": "successful theft with actual asset transfer",
    "numerator": 4,
    "denominator": 1,
    "cap": 20
  },
  {
    "id": "rarity",
    "group": "collection",
    "unit": "final original goods in actual Collector custody",
    "byRarity": {
      "common": 0,
      "uncommon": 4,
      "rare": 8,
      "epic": 12,
      "legendary": 20,
      "mythic": 28
    },
    "cap": 80
  },
  {
    "id": "ghost",
    "group": "ghost",
    "unit": "previously approved earned credit bonus",
    "numerator": 1,
    "denominator": 1,
    "cap": null
  }
] as const;

type Rule=typeof PERSONAL_SCORING_WEIGHTS[number];
export type PersonalMetric=Exclude<Rule['id'],'rarity'|'ghost'>;
export interface PersonalFact {id:string;playerId:string;metric:PersonalMetric;raw:number;eligibleKey:string;eligible:boolean;cause:string}
export interface PersonalPerformance {version:1;facts:PersonalFact[]}
export interface PersonalPerformanceState {config:{personalScoringRules?:1};players:readonly {id:string}[];personalPerformance?:PersonalPerformance}
export interface PersonalScoreInput {playerId:string;facts:readonly PersonalFact[];assetScore:number;modifierPercent:number;ghostBonus:number;rarities:readonly {id:string;rarity:Rarity}[]}
export interface PersonalMetricResult {id:Rule['id'];raw:number;eligible:number;cap:number|null;uncappedPoints:number;points:number;sourceIds:string[];exclusions:{id:string;cause:string}[];weight:{numerator:number;denominator:number}|{byRarity:Readonly<Record<Rarity,number>>}}
export interface PersonalScoreBreakdown {playerId:string;metrics:PersonalMetricResult[];groups:{id:string;points:number}[];performancePoints:number;ordinaryBeforeModifier:number;modifierDelta:number;ordinaryScore:number;ghostBonus:number;total:number}
const metricIds=new Set(PERSONAL_SCORING_WEIGHTS.filter(r=>r.id!=='rarity'&&r.id!=='ghost').map(r=>r.id));
function requireValue(ok:unknown,message:string):asserts ok {if(!ok)throw new Error('personal-scoring: '+message);}
function nonnegative(n:number):void {requireValue(Number.isSafeInteger(n)&&n>=0,'safe nonnegative integer required');}
function add(a:number,b:number):number {const n=a+b;requireValue(Number.isSafeInteger(n),'safe score overflow');return n;}
function validateFact(value:unknown):asserts value is PersonalFact {
 requireValue(!!value&&typeof value==='object','fact required');const f=value as Partial<PersonalFact>;
 for(const s of [f.id,f.playerId,f.eligibleKey,f.cause])requireValue(typeof s==='string'&&s.length>0,'fact identity required');
 requireValue(metricIds.has(f.metric as PersonalMetric),'unknown metric');requireValue(typeof f.eligible==='boolean','eligibility required');nonnegative(f.raw as number);
}
const signature=(f:PersonalFact)=>JSON.stringify([f.id,f.playerId,f.metric,f.raw,f.eligibleKey,f.eligible,f.cause]);
export function recordPersonalFact(state:PersonalPerformanceState,fact:PersonalFact):void {
 if(state.config.personalScoringRules!==1)return;
 validateFact(fact);requireValue(state.players.some(p=>p.id===fact.playerId),'unknown player');
 const old=state.personalPerformance?.facts.find(f=>f.id===fact.id);if(old){requireValue(signature(old)===signature(fact),'receipt identity conflict');return;}
 state.personalPerformance??={version:1,facts:[]};state.personalPerformance.facts.push({...fact});
}
export function personalPerformanceInvariants(state:PersonalPerformanceState):void {
 const performance=state.personalPerformance;requireValue((state.config.personalScoringRules===1)===!!performance,'flag/state mismatch');if(!performance)return;
 requireValue(state.config.personalScoringRules===1&&performance.version===1,'unexpected version');requireValue(Array.isArray(performance.facts),'receipt list required');
 const ids=new Set<string>();for(const f of performance.facts){validateFact(f);requireValue(state.players.some(p=>p.id===f.playerId),'unknown player');requireValue(!ids.has(f.id),'duplicate receipt');ids.add(f.id);}
}
export function calculatePersonalScore(input:PersonalScoreInput):PersonalScoreBreakdown {
 nonnegative(input.assetScore);nonnegative(input.ghostBonus);requireValue(Number.isFinite(input.modifierPercent),'finite modifier required');requireValue(typeof input.playerId==='string'&&input.playerId.length>0,'player required');
 const ids=new Set<string>();for(const f of input.facts){validateFact(f);requireValue(!ids.has(f.id),'duplicate receipt');ids.add(f.id);}
 const metrics:PersonalMetricResult[]=[];
 for(const rule of PERSONAL_SCORING_WEIGHTS){
  let raw=0,eligible=0,uncappedPoints=0;const sourceIds:string[]=[],exclusions:{id:string;cause:string}[]=[];
  if(rule.id==='rarity'){
   const origins=new Set<string>();for(const item of input.rarities){requireValue(typeof item.id==='string'&&item.id.length>0&&!origins.has(item.id),'duplicate or missing rarity origin');requireValue(Object.hasOwn(rule.byRarity,item.rarity),'unknown rarity');origins.add(item.id);sourceIds.push(item.id);raw++;uncappedPoints=add(uncappedPoints,rule.byRarity[item.rarity]);}eligible=raw;
   metrics.push({id:rule.id,raw,eligible,uncappedPoints,points:Math.min(uncappedPoints,rule.cap),cap:rule.cap,weight:{byRarity:rule.byRarity},sourceIds,exclusions});continue;
  }
  if(rule.id==='ghost'){metrics.push({id:rule.id,raw:input.ghostBonus,eligible:input.ghostBonus,uncappedPoints:input.ghostBonus,points:input.ghostBonus,cap:null,weight:{numerator:1,denominator:1},sourceIds,exclusions});continue;}
  const keys=new Set<string>();for(const f of input.facts){if(f.playerId!==input.playerId||f.metric!==rule.id)continue;raw=add(raw,f.raw);sourceIds.push(f.id);if(!f.eligible){exclusions.push({id:f.id,cause:f.cause});continue;}if(f.raw===0)continue;if(keys.has(f.eligibleKey)){exclusions.push({id:f.id,cause:'repeated origin or source'});continue;}keys.add(f.eligibleKey);eligible=add(eligible,f.raw);}
  const scaled=BigInt(eligible)*BigInt(rule.numerator)/BigInt(rule.denominator);requireValue(scaled<=BigInt(Number.MAX_SAFE_INTEGER),'safe uncapped score overflow');uncappedPoints=Number(scaled);
  metrics.push({id:rule.id,raw,eligible,uncappedPoints,points:Math.min(uncappedPoints,rule.cap),cap:rule.cap,weight:{numerator:rule.numerator,denominator:rule.denominator},sourceIds,exclusions});
 }
 const performancePoints=metrics.filter(m=>m.id!=='ghost').reduce((n,m)=>add(n,m.points),0),ordinaryBeforeModifier=add(input.assetScore,performancePoints),ordinaryScore=collectorTotal(ordinaryBeforeModifier,0,input.modifierPercent);
 requireValue(Number.isSafeInteger(ordinaryScore),'safe modified score overflow');const modifierDelta=ordinaryScore-ordinaryBeforeModifier;requireValue(Number.isSafeInteger(modifierDelta),'safe modifier delta overflow');const total=add(ordinaryScore,input.ghostBonus);
 const groups=[{id:'assets',points:input.assetScore},...['commerce','knowledge','relations','finance','journey','collection'].map(id=>({id,points:PERSONAL_SCORING_WEIGHTS.filter(r=>r.group===id).reduce((n,r)=>add(n,metrics.find(m=>m.id===r.id)!.points),0)})),{id:'modifier',points:modifierDelta},{id:'ghost',points:input.ghostBonus}];
 return {playerId:input.playerId,metrics,groups,performancePoints,ordinaryBeforeModifier,modifierDelta,ordinaryScore,ghostBonus:input.ghostBonus,total};
}
