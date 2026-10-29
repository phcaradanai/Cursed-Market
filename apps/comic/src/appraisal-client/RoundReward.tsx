import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { CoinSide, RoundReward as Reward } from '../game/appraisal/types.js';
import type { Decision } from './model.js';
import { t } from './i18n.js';
import { tip, useLock } from './reasons.js';

const sideName=()=>({heads:t('หัว'),tails:t('ก้อย')});
export function RoundReward({reward,credits=0,submit,disabled,onTossing}:{reward:Reward;credits?:number;submit:(action:Decision)=>void;disabled:boolean;onTossing:(active:boolean)=>void}) {
  const locked=useLock();
  const [choices,setChoices]=useState<CoinSide[]>([]);
  const [shownFlips,setShownFlips]=useState(reward.flips);
  const tossing=reward.flips>shownFlips;
  useEffect(()=>()=>onTossing(false),[onTossing]);
  useEffect(()=>{
    onTossing(tossing);
    if(!tossing)return;
    const timer=window.setTimeout(()=>setShownFlips(reward.flips),window.matchMedia('(prefers-reduced-motion: reduce)').matches?100:1300);
    return ()=>window.clearTimeout(timer);
  },[tossing,reward.flips,onTossing]);
  const flip=reward.lastFlip;const active=tossing;
  const winBonus=reward.winBonus??5;const totalBase=reward.base+(reward.incomeBonus??0);
  const multi=reward.coinCount!==undefined;const count=reward.coinCount??1;
  const guesses=Array.from({length:count},(_,index)=>choices[index]??'heads');
  const step=winBonus*count;
  const results=flip?.coins??(flip?[flip]:[]);
  const names=sideName();
  const why=tip(active&&t('กำลังโยนเหรียญ รอผล'),disabled&&(locked??t('คุณพร้อมไปต่อแล้ว หรือยังไม่ได้เชื่อมต่อ')));
  const play=(guess:CoinSide)=>submit({type:'round-flip',guess,...(count>1?{guesses}:{}),attempt:reward.flips+1});
  return <section className="round-reward" aria-labelledby="round-reward-title" aria-busy={active}>
    <div className={`coin-table${count>1?' multi-coin':''}`}>{Array.from({length:count},(_,index)=>{const side=results[index]?.side??'heads';return <div key={index} className={`coin-scene${tossing?' tossing':''}`} aria-hidden="true" style={{'--coin-landing':side==='tails'?'1980deg':'1800deg'} as CSSProperties}>
      <div className="coin-plinth"/><div className="coin-shadow"/>
      <div className="coin-flight" key={tossing?reward.flips:'rest'}><div className="coin-angle"><div className="coin-body">
        {[0,1,2,3,4].map(n=><span key={n} className="coin-edge" style={{transform:`translateZ(${n*2-4}px)`}}/>)}
        <span className="coin-face coin-heads"><span>{t('ห')}</span><small>{names.heads}</small></span><span className="coin-face coin-tails"><span>{t('ก')}</span><small>{names.tails}</small></span>
      </div></div></div>
    </div>;})}</div>
    <div className="round-reward-copy"><h2 id="round-reward-title">{t('เครดิตหลังจบช่วงซื้อขาย {n}',{n:reward.encounter})}</h2>
      <p className="reward-amount">{active?t('กำลังโยนเหรียญ…'):<>{reward.settled?(reward.amount?t('รับแล้ว'):t('รับรอบนี้')):t('ยอดที่รับได้')} <strong>{reward.amount}</strong> {t('เครดิต')}</>}</p>
      <p className="coin-outcome" role="status" aria-live="polite">{multi && !active && flip ? (flip.correct?t('ถูกครบทุกเหรียญ! เพิ่ม {n} เครดิต',{n:flip.delta??step}):t('ทายผิด หัก {n} เครดิต · เหลือ {amount} เครดิต',{n:-(flip.delta??0),amount:reward.amount})) : active?(tossing?t('เหรียญกำลังลอยขึ้นและตกลงมา'):t('รอผลเหรียญ…')):flip?(flip.correct?t('ออก{side} · คุณทาย{guess} · ทายถูก! เพิ่ม {bonus} เครดิต',{side:names[flip.side],guess:names[flip.guess],bonus:winBonus}):t('ออก{side} · คุณทาย{guess} · ทายผิด! รางวัลช่วงนี้เหลือ 0 เครดิต',{side:names[flip.side],guess:names[flip.guess]})):multi?t('เลือกรับเลย หรือทายให้ถูกครบทุกเหรียญ เพิ่ม {bonus} เครดิต แล้วเลือกเสี่ยงต่อได้',{bonus:step}):t('เลือกรับเลย หรือทายหัวก้อย ถูกเพิ่มครั้งละ {bonus} เครดิต และเลือกเสี่ยงต่อได้',{bonus:winBonus})}</p>
      {!active && results.length>0 && multi && <ol className="coin-results">{results.map((coin,index)=><li key={index}>{t('เหรียญ {n}',{n:index+1})} · {t('ทาย {guess} · ออก {side} · {result}',{guess:names[coin.guess],side:names[coin.side],result:coin.correct?t('ถูก'):t('ผิด')})}</li>)}</ol>}
      {(!reward.settled || active) && <><p className="danger-text">{multi?t('ทายให้ถูกครบ {n} เหรียญ: ได้ {step} · ผิดหัก {step} เครดิต (ต่ำสุด 0)',{n:count,step}):t('ทายผิดเสียยอดช่วงนี้ทั้งหมด รวม {n} เครดิตเติมหลังซื้อขายและโบนัสที่สะสม เงินเดิมในกระเป๋ายังอยู่',{n:totalBase})}</p>
        {multi && <div className="coin-stake"><p>{t('ในกระเป๋า {wallet} เครดิต · ทบแล้ว {staked} เครดิต',{wallet:credits,staked:reward.staked??0})}</p><button disabled={disabled || active || credits<reward.base} title={tip(why,credits<reward.base && t('เครดิตในกระเป๋าไม่พอเพิ่มเหรียญ'))} onClick={()=>submit({type:'round-raise',coinCount:count+1,attempt:reward.flips+1})}>{t('เพิ่ม 1 เหรียญ · จ่าย {n} เครดิต',{n:reward.base})}</button></div>}
        {count>1 && <fieldset className="coin-guesses" disabled={disabled || active}><legend>{t('เลือกหัวหรือก้อยให้ครบทุกเหรียญ')}</legend>{guesses.map((guess,index)=><div className="coin-guess" key={index}><span>{t('เหรียญ {n}',{n:index+1})}</span>{(['heads','tails'] as const).map(side=><button key={side} aria-label={t('เหรียญ {n} · ทาย {side}',{n:index+1,side:names[side]})} aria-pressed={guess===side} onClick={()=>setChoices(guesses.map((call,i)=>i===index?side:call))}>{names[side]}</button>)}</div>)}</fieldset>}
        <div className="actions"><button className="primary" disabled={disabled || active} title={why} onClick={()=>submit({type:'round-bank'})}>{active?t('กำลังโยนเหรียญ…'):`${reward.flips?t('หยุดและรับ'):t('รับเลย')} ${reward.amount} ${t('เครดิต')}`}</button>{count>1?<button disabled={disabled || active} title={why} onClick={()=>play(guesses[0]!)}>{t('โยน {n} เหรียญ',{n:count})}</button>:<><button disabled={disabled || active} title={why} onClick={()=>play('heads')}>{!active && reward.flips?t('เล่นต่อ · '):''}{t('ทายหัว')}</button><button disabled={disabled || active} title={why} onClick={()=>play('tails')}>{!active && reward.flips?t('เล่นต่อ · '):''}{t('ทายก้อย')}</button></>}</div>
        <p className="supporting reward-timeout">{t('เมื่อหมดเวลาหรือกดพร้อมไปต่อ จะรับยอดที่เหลืออัตโนมัติ')}</p></>}
      <details className="info-fold"><summary>{t('วิธีการ')}</summary>
        <p>{t('ช่วง{kind} รับ {base} เครดิต · เติมหลังซื้อขายทุกช่วง ก่อนเลือกประตูครั้งถัดไป',{kind:reward.encounter%2?t('คี่'):t('คู่'),base:reward.base})}</p>
        {multi && <p>{t('เพิ่มเหรียญโดยจ่ายจากกระเป๋า ตามทุนเริ่มช่วงต่อเหรียญ เงินทบรวมในยอดที่รับได้ เล่นต่อจนยอดเป็น 0 หรือหยุดรับได้ทุกครั้ง')}</p>}
        {reward.incomeBonus!==undefined && <p>{multi?t('ของสะสมเพิ่ม {income} เครดิต · รวมเริ่มต้น {total} เครดิต · โอกาสถูกต่อเหรียญ {chance}% · ได้หรือเสียต่อเหรียญ {bonus} เครดิต',{income:reward.incomeBonus,total:totalBase,chance:reward.winChance??50,bonus:winBonus}):t('ของสะสมเพิ่ม {income} เครดิต · รวมเริ่มต้น {total} เครดิต · โอกาสทายถูก {chance}% · ถูกได้ครั้งละ {bonus} เครดิต',{income:reward.incomeBonus,total:totalBase,chance:reward.winChance??50,bonus:winBonus})}</p>}
      </details>
    </div>
  </section>;
}
