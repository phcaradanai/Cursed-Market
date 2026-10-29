import { statusMagnitude, integerEffect } from './copy-effects.js';
import { randomAt } from '../random.js';
import { check, omenNow, trace } from './mechanics.js';
import { coinWinChance, passiveBonuses, passivesEnabled } from './passives.js';
import type { AppraisalState, Appraiser, CoinSide } from './types.js';

/** Round income stays pending; adding coins transfers real wallet credits into the pool. */
export function openRoundRewards(state:AppraisalState):void {
  if(!state.config.roundRewards)return;
  for(const p of state.players) {
    if(state.config.survival && p.life===0)continue;
    const base=state.encounter%2?10:15;
    const b=passiveBonuses(state,p);
    // Polish: lucky/unlucky coins and the omen shift the post-trade reward and the coin odds.
    const polish=state.config.polish;const income=b.income+(polish?integerEffect(statusMagnitude(p,'B18',3))-integerEffect(statusMagnitude(p,'D19',3))+(omenNow(state)?.roundBonus??0):0);
    const luck=polish?statusMagnitude(p,'B18',10)-statusMagnitude(p,'D19',10):0;
    p.roundReward={encounter:state.encounter,base,amount:base+income,flips:0,settled:false,...(passivesEnabled(state.config) || income!==b.income || luck?{incomeBonus:income,winBonus:5+b.coinWin,winChance:Math.max(15,Math.min(85,coinWinChance(b)+luck))}:{})};
    if(state.config.multiCoinRewards)Object.assign(p.roundReward,{coinCount:1,staked:0,net:0});
  }
}
export function raiseRoundReward(state:AppraisalState,p:Appraiser,coinCount:number,attempt:number):void {
  const r=p.roundReward;
  check(state.phase==='REVEAL' && state.config.multiCoinRewards && r && !r.settled && r.amount>0,'round-reward','ไม่มีรางวัลที่ทบได้');
  check(Number.isSafeInteger(coinCount) && coinCount===(r.coinCount??1)+1 && attempt===r.flips+1,'coin-attempt','ใช้จำนวนเหรียญและผลล่าสุดก่อนทบ');
  check(p.credits>=r.base,'credits','เครดิตในกระเป๋าไม่พอเพิ่มเหรียญ');
  check(Number.isSafeInteger(r.amount+r.base),'round-reward','ยอดเดิมพันสูงเกินไป');
  p.credits-=r.base;r.amount+=r.base;r.staked=(r.staked??0)+r.base;r.coinCount=coinCount;
  state.ledger.push({from:p.id,to:'@round-fund',amount:r.base,reason:'round-stake',encounter:state.encounter});
  trace(state,p,'round-coin-raised',{coinCount,stake:r.base,amount:r.amount});
}
export function flipRoundReward(state:AppraisalState,p:Appraiser,guess:CoinSide,attempt:number,guesses?:CoinSide[]):void {
  const r=p.roundReward;
  check(state.phase==='REVEAL' && r && !r.settled,'round-reward','ไม่มีรางวัลที่เดิมพันได้');
  check(guess==='heads' || guess==='tails','coin-side','เลือกหัวหรือก้อย');
  check(Number.isSafeInteger(attempt) && attempt===r.flips+1,'coin-attempt','ใช้ผลการโยนเหรียญล่าสุดก่อนเล่นต่อ');
  if(state.config.multiCoinRewards) {
    const calls=guesses??[guess];
    check(Array.isArray(calls) && calls.length===r.coinCount && calls[0]===guess && calls.every(call=>call==='heads' || call==='tails'),'coin-side','ทายหัวหรือก้อยให้ครบทุกเหรียญ');
    const coins=calls.map((call,index)=>{
      // Keep the first coin's original random stream; each added coin has an independent stream.
      const suffix=index?`:coin:${index+1}`:'';
      let side:CoinSide=randomAt(state.seed,`${state.encounter}:${p.id}:round-coin:${attempt}${suffix}`)<.5?'heads':'tails';
      const chance=r.winChance??50;
      if(side!==call && chance>50 && randomAt(state.seed,`${state.encounter}:${p.id}:round-coin-luck:${attempt}${suffix}`)<(chance-50)/50)side=call;
      if(side===call && chance<50 && randomAt(state.seed,`${state.encounter}:${p.id}:round-coin-unluck:${attempt}${suffix}`)<(50-chance)/50)side=call==='heads'?'tails':'heads';
      return {guess:call,side,correct:call===side};
    });
    const correct=coins.every(coin=>coin.correct);const step=(r.winBonus??5)*coins.length;
    const amount=correct?r.amount+step:Math.max(0,r.amount-step);
    check(Number.isSafeInteger(amount),'round-reward','ยอดเดิมพันสูงเกินไป');
    const delta=amount-r.amount;r.net=(r.net??0)+delta;r.amount=amount;r.flips=attempt;r.settled=amount===0;
    r.lastFlip={...coins[0]!,correct,coins,delta};
    trace(state,p,'round-coin',{attempt,guess,side:coins[0]!.side,correct,coins,delta,amount});
    return;
  }
  check(guesses===undefined,'coin-side','กติกานี้ทายได้ครั้งละหนึ่งเหรียญ');
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
