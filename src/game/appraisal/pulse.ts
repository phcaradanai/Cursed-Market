import type { Appraiser, NpcId } from './types.js';

/** Pulse shards: another seat buying goods you appraised pays 1 shard; `shardsPerLife` of them mend 1 life. A wary merchant pays none. */
export const PULSE_RULES={shardsPerLife:3,shardsPerSale:1,shardsWhenWary:0,waryAfter:3,bankCap:5} as const;
/** Trust rules: being caught lowballing costs trust, buying a merchant's goods from other appraisers earns it, auction wins pay tickets. */
export const TRUST_RULES={caughtLoss:1,repeatBuys:3,repeatBuyTrust:1,ticketsToForce:3} as const;
/** Merchants who restore energy instead of life; every other merchant sells life deals. */
export const ENERGY_DEAL_NPCS:readonly NpcId[]=['vampire','autometa','alien','swarm'];
/** Life deals by trust (capped at 3): a merchant with no trust sells none. */
const LIFE_DEALS=[undefined,{credits:3,min:0,max:1},{credits:5,min:1,max:2},{credits:7,min:2,max:3}] as const;
export const lifeDealTerms=(trust:number)=>LIFE_DEALS[Math.max(0,Math.min(3,trust))];

/** Record a trade with `partnerId`; trading with anyone new restarts the exclusive run. */
export function linkTrade(p:Appraiser,partnerId:string,encounter:number):void {
  if(p.tradeLink?.partner!==partnerId)p.tradeLink={partner:partnerId,since:encounter};
}
/** Merchants grow wary after more than `waryAfter` encounters of trading with the same single partner. */
export const merchantWary=(p:Appraiser,encounter:number)=>!!p.tradeLink && encounter-p.tradeLink.since>=PULSE_RULES.waryAfter;
export const shardsPerSale=(p:Appraiser,encounter:number)=>merchantWary(p,encounter)?PULSE_RULES.shardsWhenWary:PULSE_RULES.shardsPerSale;
