import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { RoundReward as Reward } from '../game/appraisal/types.js';
import type { Decision } from './model.js';

const sideName={heads:'หัว',tails:'ก้อย'};
export function RoundReward({reward,submit,disabled,onTossing}:{reward:Reward;submit:(action:Decision)=>void;disabled:boolean;onTossing:(active:boolean)=>void}) {
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
  const play=(guess:'heads'|'tails')=>submit({type:'round-flip',guess,attempt:reward.flips+1});
  return <section className="round-reward" aria-labelledby="round-reward-title" aria-busy={active}>
    <div className={`coin-scene${tossing?' tossing':''}`} aria-hidden="true" style={{'--coin-landing':side==='tails'?'1980deg':'1800deg'} as CSSProperties}>
      <div className="coin-plinth"/><div className="coin-shadow"/>
      <div className="coin-flight" key={tossing?reward.flips:'rest'}><div className="coin-angle"><div className="coin-body">
        {[0,1,2,3,4].map(n=><span key={n} className="coin-edge" style={{transform:`translateZ(${n*2-4}px)`}}/>)}
        <span className="coin-face coin-heads"><span>ห</span><small>หัว</small></span><span className="coin-face coin-tails"><span>ก</span><small>ก้อย</small></span>
      </div></div></div>
    </div>
    <div className="round-reward-copy"><h2 id="round-reward-title">เครดิตหลังจบช่วงซื้อขาย {reward.encounter}</h2>
      <p>ช่วง{reward.encounter%2?'คี่':'คู่'} รับ {reward.base} เครดิต · เติมหลังซื้อขายทุกช่วง ก่อนเลือกประตูครั้งถัดไป</p>
      {reward.incomeBonus!==undefined && <p>ของสะสมเพิ่ม {reward.incomeBonus} เครดิต · รวมเริ่มต้น {totalBase} เครดิต · โอกาสทายถูก {reward.winChance??50}% · ถูกได้ครั้งละ {winBonus} เครดิต</p>}
      <p className="reward-amount">{active?'กำลังโยนเหรียญ…':<>{reward.settled?(reward.amount?'รับแล้ว':'รับรอบนี้'):'ยอดที่รับได้'} <strong>{reward.amount}</strong> เครดิต</>}</p>
      <p className="coin-outcome" role="status" aria-live="polite">{active?(tossing?'เหรียญกำลังลอยขึ้นและตกลงมา':'รอผลเหรียญ…'):flip?`ออก${sideName[flip.side]} · คุณทาย${sideName[flip.guess]} · ${flip.correct?`ทายถูก! เพิ่ม ${winBonus} เครดิต`:'ทายผิด! รางวัลช่วงนี้เหลือ 0 เครดิต'}`:`เลือกรับเลย หรือทายหัวก้อย ถูกเพิ่มครั้งละ ${winBonus} เครดิต และเลือกเสี่ยงต่อได้`}</p>
      {(!reward.settled || active) && <><p className="danger-text">ทายผิดเสียยอดช่วงนี้ทั้งหมด รวม {totalBase} เครดิตเติมหลังซื้อขายและโบนัสที่สะสม เงินเดิมในกระเป๋ายังอยู่</p>
        <div className="actions"><button className="primary" disabled={disabled || active} onClick={()=>submit({type:'round-bank'})}>{active?'กำลังโยนเหรียญ…':`${reward.flips?'หยุดและรับ':'รับเลย'} ${reward.amount} เครดิต`}</button><button disabled={disabled || active} onClick={()=>play('heads')}>{!active && reward.flips?'เล่นต่อ · ':''}ทายหัว</button><button disabled={disabled || active} onClick={()=>play('tails')}>{!active && reward.flips?'เล่นต่อ · ':''}ทายก้อย</button></div>
        <p className="supporting reward-timeout">เมื่อหมดเวลาหรือกดพร้อมไปต่อ จะรับยอดที่เหลืออัตโนมัติ</p></>}
    </div>
  </section>;
}
