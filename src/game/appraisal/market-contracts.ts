import type { Appraiser, Knowledge, MarketContract, MarketOrder, NpcId } from './types.js';

export const TRUST_CAP=10;
export function trustAcceptanceBonus(p:Pick<Appraiser,'npcTrust'>,npc:NpcId):number {return (p.npcTrust?.[npc]??0)*.05;}
export function marketOrderReserve(order:MarketOrder):number {return order.price+(order.contract?.bonus.kind==='credits'?order.contract.bonus.amount:0);}
/** Accept only visible facts on the client; an unknown property must never become a quote oracle. */
export function marketConditionMatch(contract:MarketContract,facts:Pick<Knowledge,'genuine'|'cursed'>):'match'|'mismatch'|'unknown' {
  if(contract.requirements.some(r=>facts[r.property]!==undefined && facts[r.property]!==r.value))return 'mismatch';
  return contract.requirements.every(r=>facts[r.property]!==undefined)?'match':'unknown';
}
export function makeMarketContract(roll:(key:string)=>number,survival:boolean):MarketContract {
  const requirements:MarketContract['requirements'][]=[
    [{property:'genuine',value:true}],[{property:'cursed',value:false}],
    [{property:'genuine',value:true},{property:'cursed',value:false}],
    [{property:'genuine',value:false}],[{property:'cursed',value:true}],
    [{property:'genuine',value:true},{property:'cursed',value:true}],
  ];
  const bonusIndex=Math.floor(roll('bonus')*4),costIndex=Math.floor(roll('cost')*3);
  const bonus:MarketContract['bonus']=bonusIndex===0?{kind:'credits',amount:3}:bonusIndex===1?{kind:'energy',amount:2}:bonusIndex===2 && survival?{kind:'life',amount:1}:{kind:'buff',statusId:'B03'};
  const fullPriceCost:MarketContract['fullPriceCost']=costIndex===0?{kind:'energy',amount:2}:costIndex===1 && survival?{kind:'life',amount:1}:{kind:'debuff',statusId:'D01'};
  return {requirements:requirements[Math.floor(roll('requirements')*requirements.length)]!,bonus,fullPriceCost};
}
