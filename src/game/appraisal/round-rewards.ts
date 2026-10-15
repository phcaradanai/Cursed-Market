import { randomAt } from '../random.js';
import { check, omenNow, status, trace } from './mechanics.js';
import { coinWinChance, passiveBonuses, passivesEnabled } from './passives.js';
import type { AppraisalState, Appraiser, CoinSide } from './types.js';

/** A pending reward never touches the wallet. Only banking issues new round credits. */
export function openRoundRewards(state:AppraisalState):void {
  if(!state.config.roundRewards)return;
  for(const p of state.players) {
    if(state.config.survival && p.life===0)continue;
    const base=state.encounter%2?10:15;
    const b=passiveBonuses(state,p);
    // Polish: lucky/unlucky coins and the omen shift the post-trade reward and the coin odds.
    const polish=state.config.polish;const income=b.income+(polish?(status(p,'B18')?3:0)-(status(p,'D19')?3:0)+(omenNow(state)?.roundBonus??0):0);
    const luck=polish?(status(p,'B18')?10:0)-(status(p,'D19')?10:0):0;
    p.roundReward={encounter:state.encounter,base,amount:base+income,flips:0,settled:false,...(passivesEnabled(state.config) || income!==b.income || luck?{incomeBonus:income,winBonus:5+b.coinWin,winChance:Math.max(15,Math.min(85,coinWinChance(b)+luck))}:{})};
  }
}
export function flipRoundReward(state:AppraisalState,p:Appraiser,guess:CoinSide,attempt:number):void {
  const r=p.roundReward;
  check(state.phase==='REVEAL' && r && !r.settled,'round-reward','ไม่มีรางวัลที่เดิมพันได้');
  check(guess==='heads' || guess==='tails','coin-side','เลือกหัวหรือก้อย');
  check(Number.isSafeInteger(attempt) && attempt===r.flips+1,'coin-attempt','ใช้ผลการโยนเหรียญล่าสุดก่อนเล่นต่อ');
  let side:CoinSide=randomAt(state.seed,`${state.encounter}:${p.id}:round-coin:${attempt}`)<.5?'heads':'tails';
  if(side!==guess && (r.winChance??50)>50 && randomAt(state.seed,`${state.encounter}:${p.id}:round-coin-luck:${attempt}`)<((r.winChance??50)-50)/50)side=guess;
  const correct=guess===side;
  r.flips=attempt;r.lastFlip={guess,side,correct};
  r.amount=correct?r.amount+(r.winBonus??5):0;r.settled=!correct;
  trace(state,p,'round-coin',{attempt,guess,side,correct,amount:r.amount});
}
export function bankRoundReward(state:AppraisalState,p:Appraiser):void {
  const r=p.roundReward;
  check(state.phase==='REVEAL' && r && !r.settled,'round-reward','ไม่มีรางวัลที่รับได้');
  // Round income is a separate source of liquidity; finite merchant reserves stay intact.
  p.credits+=r.amount;r.settled=true;
  state.ledger.push({from:'@round-fund',to:p.id,amount:r.amount,reason:'round-reward',encounter:state.encounter});
  trace(state,p,'round-reward-banked',{amount:r.amount,flips:r.flips});
}
