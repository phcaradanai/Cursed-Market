import { useEffect, useLayoutEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { CoinSide, RoundReward as Reward } from '../game/appraisal/types.js';
import type { Decision } from './model.js';
import { t, pick } from './i18n.js';
import { tip, useLock } from './reasons.js';
import {ComicButton, ComicPhaseFrame, CompactPager} from './ComicUI.js';
import {CoinIcon, TimerIcon, PlusIcon} from './icons.js';
import {Peek} from './lore.js';

const sideName=()=>({heads:t('หัว'),tails:t('ก้อย')});
export function RoundReward({reward,credits=0,submit,disabled,onTossing,hideSettled=false}:{reward:Reward;credits?:number;submit:(action:Decision)=>void;disabled:boolean;onTossing:(active:boolean)=>void;hideSettled?:boolean}) {
  const locked=useLock();
  const [choices,setChoices]=useState<CoinSide[]>([]);
  const [page,setPage]=useState(0);
  const [shownFlips,setShownFlips]=useState(reward.flips);
  const tossing=reward.flips>shownFlips;
  useEffect(()=>()=>onTossing(false),[onTossing]);
  useLayoutEffect(()=>{
    onTossing(tossing);
    if(!tossing)return;
    const timer=window.setTimeout(()=>setShownFlips(reward.flips),window.matchMedia('(prefers-reduced-motion: reduce)').matches?100:1300);
    return ()=>window.clearTimeout(timer);
  },[tossing,reward.flips,onTossing]);
  const flip=reward.lastFlip, winBonus=reward.winBonus??5, totalBase=reward.base+(reward.incomeBonus??0);
  const multi=reward.coinCount!==undefined, count=reward.coinCount??1, step=winBonus*count;
  const guesses=Array.from({length:count},(_,index)=>choices[index]??'heads');
  const results=flip?.coins??(flip?[flip]:[]), names=sideName();
  const pages=Math.ceil(count/2), at=Math.min(page,pages-1), visible=guesses.slice(at*2,at*2+2);
  const why=tip(tossing&&t('กำลังโยนเหรียญ รอผล'),disabled&&(locked??t('คุณพร้อมไปต่อแล้ว หรือยังไม่ได้เชื่อมต่อ')));
  const play=(guess:CoinSide)=>submit({type:'round-flip',guess,...(count>1?{guesses}:{}),attempt:reward.flips+1});
  const outcome=multi&&flip?(flip.correct?t('ถูกครบทุกเหรียญ! เพิ่ม {n} เครดิต',{n:flip.delta??step}):t('ทายผิด หัก {n} เครดิต · เหลือ {amount} เครดิต',{n:-(flip.delta??0),amount:reward.amount})):flip?(flip.correct?t('ออก{side} · คุณทาย{guess} · ทายถูก! เพิ่ม {bonus} เครดิต',{side:names[flip.side],guess:names[flip.guess],bonus:winBonus}):t('ออก{side} · คุณทาย{guess} · ทายผิด! รางวัลช่วงนี้เหลือ 0 เครดิต',{side:names[flip.side],guess:names[flip.guess]})):'';
  const method=<><strong>{t('เครดิตหลังจบช่วงซื้อขาย {n}',{n:reward.encounter})}</strong><p>{t('ช่วง{kind} รับ {base} เครดิต · เติมหลังซื้อขายทุกช่วง ก่อนเลือกประตูครั้งถัดไป',{kind:reward.encounter%2?t('คี่'):t('คู่'),base:reward.base})}</p>{multi&&<p>{t('เพิ่มเหรียญโดยจ่ายจากกระเป๋า ตามทุนเริ่มช่วงต่อเหรียญ เงินทบรวมในยอดที่รับได้ เล่นต่อจนยอดเป็น 0 หรือหยุดรับได้ทุกครั้ง')}</p>}{reward.incomeBonus!==undefined&&<p>{t('ของสะสมเพิ่ม {income} เครดิต · รวมเริ่มต้น {total} เครดิต · โอกาสถูกต่อเหรียญ {chance}% · ได้หรือเสียต่อเหรียญ {bonus} เครดิต',{income:reward.incomeBonus,total:totalBase,chance:reward.winChance??50,bonus:winBonus})}</p>}</>;
  // Settled rewards hand back to the existing post-payout services, not a second cash-out action.
  if(reward.settled&&!tossing)return hideSettled?null:<section className="round-reward reward-settled" aria-labelledby="round-reward-title"><h2 id="round-reward-title">{t('เครดิตหลังจบช่วงซื้อขาย {n}',{n:reward.encounter})}</h2><p className="reward-amount">{reward.amount?t('รับแล้ว'):t('รับรอบนี้')} <strong>{reward.amount}</strong> {t('เครดิต')}</p><p role="status">{outcome}</p><span className="sr-only">{pick('ก่อนเลือกประตูครั้งถัดไป','Before the next portal')}</span></section>;
  return <ComicPhaseFrame className="round-reward reward-screen" title={pick('รับเครดิตท้ายช่วง','End-of-encounter credits')} icon={<CoinIcon/>}
    tools={<><span className="reward-encounter">{t('ช่วง {n}',{n:reward.encounter})}</span><Peek tone="rule" label={t('วิธีการ')} card={method}/></>}
    footer={<><TimerIcon/>{t('เมื่อหมดเวลาหรือกดพร้อมไปต่อ จะรับยอดที่เหลืออัตโนมัติ')}</>}>
    <div className="reward-spread" aria-busy={tossing}>
      <section className="reward-half reward-cashout" aria-labelledby="reward-pool-title">
        <h3 id="reward-pool-title">{t('ยอดที่รับได้')}</h3>
        <div className="reward-pool"><p className="reward-amount"><strong>{reward.amount}</strong><span>{t('เครดิต')}</span></p><p>{pick('รับเข้ากระเป๋าได้ทันที','Collect into your wallet now')}</p></div>
        <div className="reward-primary-row"><ComicButton tone="primary" disabled={disabled||tossing} title={why} onClick={()=>submit({type:'round-bank'})}>{tossing?t('กำลังโยนเหรียญ…'):`${reward.flips?t('หยุดและรับ'):t('รับเลย')} ${reward.amount} ${t('เครดิต')}`}</ComicButton></div>
        <div className="reward-secondary-row"><p role="status" aria-live="polite">{tossing?t('กำลังโยนเหรียญ รอผล'):outcome||pick('หยุดเสี่ยงและรับยอดนี้','Stop wagering and collect this amount')}</p></div>
      </section>
      <section className="reward-half reward-wager" aria-labelledby="reward-wager-title">
        <h3 id="reward-wager-title">{pick('เสี่ยงเหรียญ','Call the coins')}</h3>
        <div className="reward-coin-stage">
          <div className={`coin-table${count>1?' multi-coin':''}`}>{visible.map((guess,offset)=>{const index=at*2+offset,side=results[index]?.side??'heads';return <div className="reward-coin" key={index}>
            <div className={`coin-scene${tossing?' tossing':''}`} aria-hidden="true" style={{'--coin-landing':side==='tails'?'1980deg':'1800deg'} as CSSProperties}><div className="coin-shadow"/><div className="coin-flight" key={tossing?reward.flips:'rest'}><div className="coin-angle"><div className="coin-body">{[0,1,2,3,4].map(n=><span key={n} className="coin-edge" style={{transform:`translateZ(${n*2-4}px)`}}/>)}<span className="coin-face coin-heads"><span>{t('ห')}</span><small>{names.heads}</small></span><span className="coin-face coin-tails"><span>{t('ก')}</span><small>{names.tails}</small></span></div></div></div></div>
            {count>1&&<fieldset className="reward-guess" disabled={disabled||tossing}><legend>{t('เหรียญ {n}',{n:index+1})}{flip&&!tossing?` · ${names[side]} · ${results[index]?.correct?t('ถูก'):t('ผิด')}`:''}</legend>{(['heads','tails'] as const).map(call=><ComicButton key={call} aria-label={t('เหรียญ {n} · ทาย {side}',{n:index+1,side:names[call]})} aria-pressed={guess===call} onClick={()=>setChoices(guesses.map((value,i)=>i===index?call:value))}>{names[call]}</ComicButton>)}</fieldset>}
          </div>;})}</div>
          {pages>1&&<CompactPager page={at} pages={pages} onChange={setPage} label={pick('เลือกเหรียญ','Choose coins')}/>}
          <p className="reward-risk">{multi?t('ทายให้ถูกครบ {n} เหรียญ: ได้ {step} · ผิดหัก {step} เครดิต (ต่ำสุด 0)',{n:count,step}):t('ทายผิดเสียยอดช่วงนี้ทั้งหมด รวม {n} เครดิตเติมหลังซื้อขายและโบนัสที่สะสม เงินเดิมในกระเป๋ายังอยู่',{n:totalBase})}</p>
        </div>
        <div className="reward-primary-row reward-calls">{count>1?<ComicButton disabled={disabled||tossing} title={why} onClick={()=>play(guesses[0]!)}>{t('โยน {n} เหรียญ',{n:count})}</ComicButton>:(['heads','tails'] as const).map(guess=><ComicButton key={guess} disabled={disabled||tossing} title={why} onClick={()=>play(guess)}>{reward.flips?t('เล่นต่อ · '):''}{guess==='heads'?t('ทายหัว'):t('ทายก้อย')}</ComicButton>)}</div>
        <div className="reward-secondary-row">{multi&&<><ComicButton disabled={disabled||tossing||credits<reward.base} title={tip(why,credits<reward.base&&t('เครดิตในกระเป๋าไม่พอเพิ่มเหรียญ'))} onClick={()=>submit({type:'round-raise',coinCount:count+1,attempt:reward.flips+1})}><PlusIcon/>{t('เพิ่ม 1 เหรียญ · จ่าย {n} เครดิต',{n:reward.base})}</ComicButton><small>{t('ในกระเป๋า {wallet} เครดิต · ทบแล้ว {staked} เครดิต',{wallet:credits,staked:reward.staked??0})}</small></>}</div>
      </section>
    </div>
  </ComicPhaseFrame>;
}
