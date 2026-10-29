import type {EventOffer} from '../game/appraisal/types.js';
import type {Actions} from './components.js';
import {MerchantEventPortrait} from './MerchantEventPortrait.js';
import {ComicButton} from './ComicUI.js';
import {EventIcon,EyeIcon,InfoIcon,LifeIcon} from './icons.js';
import {Peek} from './lore.js';
import {eventDecision,eventNeeds,needShort} from './model.js';
import {pick} from './i18n.js';
import {useLock} from './reasons.js';

/** E109 presentation only; the existing event command owns payment and deferred rewards. */
export function BloodPactEvent({game,offer,submit,disabled,onTuck}:Actions&{offer:EventOffer;onTuck:()=>void}) {
  const locked=useLock();
  const cost=eventNeeds(game,offer,'accept','');
  const life=game.self.life??0;
  const reason=!offer.npcTerms?pick('ไม่มีเงื่อนไขข้อตกลง','Missing contract terms'):needShort(game,cost);
  const choose=(choice:string)=>{
    const action=eventDecision(offer,choice,{itemId:'',statusId:'',fact:'',guess:false});
    if(!disabled && action && (choice==='decline'||!reason))submit(action);
  };
  return <section className="comic-event-spread" aria-labelledby="blood-pact-title">
    <MerchantEventPortrait npc="vampire"/>
    <div className="comic-event-content">
      <header className="comic-event-heading">
        <div className="comic-event-topline"><span>{pick(`ช่วงที่ ${game.encounter} · พบพ่อค้าแวมไพร์`,`Encounter ${game.encounter} · Vampire`)}</span><ComicButton onClick={onTuck}><EyeIcon/>{pick('ซ่อนไว้ดูโต๊ะ','View table')}</ComicButton></div>
        <h2 id="blood-pact-title">{pick('สัญญาเลือด','Blood pact')}<em>{pick('ครั้งหน้า',' · next meeting')}</em></h2>
        <p>{pick('มอบชีวิตตอนนี้ เพื่อรับผลตอบแทนเมื่อพบกันอีกครั้ง','Pay life now for a reward when you choose to meet the Vampire again.')}</p>
      </header>
      <div className="comic-event-facts">
        <div className="comic-event-fact"><LifeIcon/><div><span>{pick('ชีวิต','Life')}</span><strong>{life}<span aria-hidden="true"> → </span><span className="sr-only">{pick(' เหลือ ',' remaining ')}</span><em>{Math.max(0,life-(cost.life??0))}</em></strong></div><b>−{cost.life??0}</b></div>
        <div className="comic-event-fact comic-event-reward"><EventIcon/><div><strong>{pick('พบแวมไพร์ครั้งหน้า','Next Vampire meeting')}</strong><span>{pick('สุ่มรับเพียง 1 อย่าง','One eligible random reward')}</span></div>
          <Peek tone="rule" label={<><InfoIcon/><span className="sr-only">{pick('ดูผลตอบแทนที่อาจได้รับ','Possible rewards')}</span></>} card={<><span className="peek-head"><strong>{pick('สุ่มเฉพาะผลที่ใช้ได้ · เพียง 1 อย่าง','One eligible result only')}</strong></span><span className="peek-body">{pick('ของฟรี 1 ชิ้น · ลดซื้อครั้งแรก 50% · ฟื้นพลังสูงสุด 6 · ฟื้นชีวิตสูงสุด 3 · หรือพรสุ่ม 1 อย่าง','One free item · 50% off first purchase · recover up to 6 energy · heal up to 3 life · or one random boon')}</span><span className="peek-foot">{pick('รับเมื่อเลือกพบอีกครั้งในช่วงถัดไป ไม่ได้รับทันที','Available on a later encounter when you choose the Vampire again, not immediately.')}</span></>}/>
        </div>
      </div>
      <div className="comic-event-breathing-room" aria-hidden="true"/>
      <div className="comic-event-bottom">
        <p className="comic-event-warning"><EventIcon/>{pick('จบเกมก่อนพบกันอีกครั้ง จะไม่ได้ผลตอบแทน','No reward if the run ends before you meet again.')}</p>
        {reason&&<p className="comic-event-block" role="status">{reason}</p>}
        <div className="comic-event-actions">
          <ComicButton tone="primary" disabled={disabled||!!reason||!offer.choices.includes('accept')} title={disabled?locked??undefined:reason??undefined} onClick={()=>choose('accept')}>{pick('ยอมรับ','Accept')} · <LifeIcon/> −{cost.life??0}</ComicButton>
          <ComicButton disabled={disabled||!offer.choices.includes('decline')} title={disabled?locked??undefined:undefined} onClick={()=>choose('decline')}>{pick('ปฏิเสธ','Decline')}</ComicButton>
        </div>
      </div>
    </div>
  </section>;
}
