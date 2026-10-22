import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { RoundReward as Reward } from '../game/appraisal/types.js';
import type { Decision } from './model.js';
import { t } from './i18n.js';
import { tip, useLock } from './reasons.js';

const sideName=()=>({heads:t('หัว'),tails:t('ก้อย')});
export function RoundReward({reward,submit,disabled,onTossing}:{reward:Reward;submit:(action:Decision)=>void;disabled:boolean;onTossing:(active:boolean)=>void}) {
  const locked=useLock();
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
  const side=flip?.side??'heads';
  const names=sideName();
  const why=tip(active&&t('กำลังโยนเหรียญ รอผล'),disabled&&(locked??t('คุณพร้อมไปต่อแล้ว หรือยังไม่ได้เชื่อมต่อ')));
  const play=(guess:'heads'|'tails')=>submit({type:'round-flip',guess,attempt:reward.flips+1});
  return <section className="round-reward" aria-labelledby="round-reward-title" aria-busy={active}>
    <div className={`coin-scene${tossing?' tossing':''}`} aria-hidden="true" style={{'--coin-landing':side==='tails'?'1980deg':'1800deg'} as CSSProperties}>
      <div className="coin-plinth"/><div className="coin-shadow"/>
      <div className="coin-flight" key={tossing?reward.flips:'rest'}><div className="coin-angle"><div className="coin-body">
        {[0,1,2,3,4].map(n=><span key={n} className="coin-edge" style={{transform:`translateZ(${n*2-4}px)`}}/>)}
        <span className="coin-face coin-heads"><span>{t('ห')}</span><small>{names.heads}</small></span><span className="coin-face coin-tails"><span>{t('ก')}</span><small>{names.tails}</small></span>
      </div></div></div>
    </div>
    <div className="round-reward-copy"><h2 id="round-reward-title">{t('เครดิตหลังจบช่วงซื้อขาย {n}',{n:reward.encounter})}</h2>
      <p className="reward-amount">{active?t('กำลังโยนเหรียญ…'):<>{reward.settled?(reward.amount?t('รับแล้ว'):t('รับรอบนี้')):t('ยอดที่รับได้')} <strong>{reward.amount}</strong> {t('เครดิต')}</>}</p>
      <p className="coin-outcome" role="status" aria-live="polite">{active?(tossing?t('เหรียญกำลังลอยขึ้นและตกลงมา'):t('รอผลเหรียญ…')):flip?(flip.correct?t('ออก{side} · คุณทาย{guess} · ทายถูก! เพิ่ม {bonus} เครดิต',{side:names[flip.side],guess:names[flip.guess],bonus:winBonus}):t('ออก{side} · คุณทาย{guess} · ทายผิด! รางวัลช่วงนี้เหลือ 0 เครดิต',{side:names[flip.side],guess:names[flip.guess]})):t('เลือกรับเลย หรือทายหัวก้อย ถูกเพิ่มครั้งละ {bonus} เครดิต และเลือกเสี่ยงต่อได้',{bonus:winBonus})}</p>
      {(!reward.settled || active) && <><p className="danger-text">{t('ทายผิดเสียยอดช่วงนี้ทั้งหมด รวม {n} เครดิตเติมหลังซื้อขายและโบนัสที่สะสม เงินเดิมในกระเป๋ายังอยู่',{n:totalBase})}</p>
        <div className="actions"><button className="primary" disabled={disabled || active} title={why} onClick={()=>submit({type:'round-bank'})}>{active?t('กำลังโยนเหรียญ…'):`${reward.flips?t('หยุดและรับ'):t('รับเลย')} ${reward.amount} ${t('เครดิต')}`}</button><button disabled={disabled || active} title={why} onClick={()=>play('heads')}>{!active && reward.flips?t('เล่นต่อ · '):''}{t('ทายหัว')}</button><button disabled={disabled || active} title={why} onClick={()=>play('tails')}>{!active && reward.flips?t('เล่นต่อ · '):''}{t('ทายก้อย')}</button></div>
        <p className="supporting reward-timeout">{t('เมื่อหมดเวลาหรือกดพร้อมไปต่อ จะรับยอดที่เหลืออัตโนมัติ')}</p></>}
      <details className="info-fold"><summary>{t('วิธีการ')}</summary>
        <p>{t('ช่วง{kind} รับ {base} เครดิต · เติมหลังซื้อขายทุกช่วง ก่อนเลือกประตูครั้งถัดไป',{kind:reward.encounter%2?t('คี่'):t('คู่'),base:reward.base})}</p>
        {reward.incomeBonus!==undefined && <p>{t('ของสะสมเพิ่ม {income} เครดิต · รวมเริ่มต้น {total} เครดิต · โอกาสทายถูก {chance}% · ถูกได้ครั้งละ {bonus} เครดิต',{income:reward.incomeBonus,total:totalBase,chance:reward.winChance??50,bonus:winBonus})}</p>}
      </details>
    </div>
  </section>;
}
