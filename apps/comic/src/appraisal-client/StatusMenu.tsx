import {useEffect,useState} from 'react';
import type {AppraisalView,NpcId} from '../game/appraisal/types.js';
import {npcImage} from '../game/appraisal/content.js';
import {TRUST_RULES} from '../game/appraisal/pulse.js';
import {npcName,statusName,statusDescription,omenText} from './catalog-text.js';
import {abilityName,abilityReason,abilityDescription} from './ability-text.js';
import {collectorEstimate,playerNote,type Decision} from './model.js';
import {pick,useLang} from './i18n.js';
import {HandshakeIcon} from './icons.js';
import {ComicButton,ComicMeter,CompactPager,EffectEmblem} from './ComicUI.js';
import {MerchantAbilities} from './MerchantAbilities.js';
import {GameDialog} from './GameDialog.js';
import {Rich} from './lore.js';

const shortNames:Partial<Record<NpcId,[string,string]>>={orc:['ออร์ก','Orc'],vampire:['แวมไพร์','Vampire'],autometa:['ออโตมาตา','Autometa'],alien:['เอเลียน','Alien'],darkone:['Dark One','Dark One'],deepsea:['อสูรใต้ทะเลลึก','Deep Sea'],swarm:['The Swarm','The Swarm'],beast:['สัตว์นำทาง','Beast']};
const order:NpcId[]=['orc','vampire','autometa','alien','darkone','deepsea','swarm','beast'];
function useSmallScreen(){
  const [small,setSmall]=useState(()=>matchMedia('(max-width:480px)').matches);
  useEffect(()=>{const media=matchMedia('(max-width:480px)');const update=()=>setSmall(media.matches);media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
  return small;
}
export function StatusMenu({game,submit,disabled,playerNames}:{game:AppraisalView;submit:(action:Decision)=>void;disabled:boolean;playerNames:Record<string,string>}) {
  useLang();
  const small=useSmallScreen();
  const [section,setSection]=useState(0);
  const [page,setPage]=useState(0),[effectPage,setEffectPage]=useState(0);
  const [focus,setFocus]=useState<NpcId|null>(game.self.abilityChoice?.npc??null);
  const [history,setHistory]=useState(false);
  useEffect(()=>{if(game.self.abilityChoice)setFocus(game.self.abilityChoice.npc);},[game.self.abilityChoice]);
  const self=game.self,estimate=game.survival&&game.phase!=='RESULTS'?collectorEstimate(game):null;
  const score=estimate?`~${estimate.min===estimate.max?estimate.min:`${estimate.min}–${estimate.max}`}`:self.personalScore?.total??self.score;
  const abilities=self.merchantAbilities??[];
  const merchants=order.filter(npc=>abilities.some(a=>a.npc===npc)||self.npcTrust?.[npc]!==undefined);
  const perPage=small?2:4,pages=Math.max(1,Math.ceil(merchants.length/perPage)),at=Math.min(page,pages-1);
  const effectsPerPage=small?1:2,effectPages=Math.max(1,Math.ceil(self.statuses.length/effectsPerPage)),effectAt=Math.min(effectPage,effectPages-1);
  const skillFocus=focus;
  const omen=game.omen?omenText(game.omen):null;
  return <div className="status-spread status-paged">
    <header className="status-page-nav"><h3>{[pick('ภาพรวมและลาง','Overview & omen'),pick('ผลติดตัว','Active effects'),pick('ความไว้ใจและพันธะ','Trust & bonds')][section]}</h3><CompactPager page={section} pages={3} onChange={setSection} label={pick('หน้าสถานะ','Status pages')}/></header>
    <div className="status-page-content">
    {section===0&&<>
    <dl className="status-summary">
      <div title={estimate?pick(`${self.personalScoreEstimate?'ทรัพย์สินที่รู้และผลงาน · แต้มประเมินรอตัดสิน':'เครดิตและสินค้าที่รู้มูลค่า'} · ยังไม่รู้มูลค่า ${estimate.unpriced} ชิ้น · คะแนนจริงรอ Collector${game.ghosts?.self?.bonus?` · คะแนนวิญญาณ ${game.ghosts.self.bonus}`:''}`,'Known assets and accomplishments; unresolved appraisal points remain hidden until Collector'):undefined}><dt>{pick('คะแนนโดยประมาณ','Estimated score')}</dt><dd>{score}</dd></div>
      {self.pulse&&<div title={self.pulse.wary?pick('ระวังตัว: การรับเศษชีพจรถูกจำกัด','Wary: pulse gains are restricted'):pick('สะสมเศษชีพจรเพื่อฟื้นชีวิต','Collect pulse shards to recover life')}><dt>{pick('เศษชีพจร','Pulse shards')}</dt><dd>{self.pulse.shards}/{self.pulse.perLife}</dd></div>}
      {self.npcTrust&&<div title={pick('ซื้อของที่เพื่อนประเมินจากพ่อค้ารายเดิมครบ 3 ครั้งติด เพิ่มความไว้ใจ','Buy goods appraised by others from the same merchant consecutively to gain trust')}><dt>{pick('ซื้อต่อเนื่อง','Repeat buys')}</dt><dd>{(self.buyLog??[]).length}/{TRUST_RULES.repeatBuys}</dd></div>}
    </dl>
    {omen&&<article className="status-omen" role="note"><h3>{pick('ลางของช่วงนี้','Encounter omen')} · {omen.name}</h3><p>{omen.text}</p></article>}
    </>}
    {section===1&&<section className={`status-effects${self.statuses.length?'':' status-effects-empty'}`} aria-labelledby="comic-effects-title">
      <header className="status-section-head"><h3 id="comic-effects-title">{pick('ผลติดตัว','Active effects')} {self.statuses.length>0&&<span>{self.statuses.length} {pick('อย่าง','effects')}</span>}</h3><div className="status-section-tools">{self.notes.length>0&&<ComicButton onClick={()=>setHistory(true)}>{pick('ประวัติผล','History')}</ComicButton>}{effectPages>1&&<CompactPager page={effectAt} pages={effectPages} onChange={setEffectPage} label={pick('หน้าผลติดตัว','Effect pages')}/>}</div></header>
      <div className="comic-effects-row">
        {self.statuses.slice(effectAt*effectsPerPage,(effectAt+1)*effectsPerPage).map((status,index)=><article key={`${status.id}-${index}`} className="comic-effect-strip"><EffectEmblem danger={status.id.startsWith('D')}/><div><h4>{statusName(status.id)}</h4><p>{statusDescription(status.id).replaceAll('debuff',pick('ผลเสีย','debuff'))}</p><small>{self.life===0?pick('เก็บไว้ให้ Collector · ไม่เดินอายุต่อ','Preserved for Collector'): <>{status.starts>game.encounter?`${pick('เริ่มช่วง','Starts encounter')} ${status.starts} · `:''}{pick('เหลือ','Remaining')} {status.charges} {pick('ครั้ง','charges')} · {pick('ถึงจบช่วง','Until encounter')} {status.expires}{status.power!==undefined?` · ${Math.round(status.power*100)}%`:''}{status.targetItemId?pick(' · ผูกกับของหนึ่งชิ้น',' · Bound to one item'):''}</>}</small></div></article>)}
        {!self.statuses.length&&<p className="status-empty-effects"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 3 4.5 6v5.5c0 4.2 3.1 7.5 7.5 9.5 4.4-2 7.5-5.3 7.5-9.5V6L12 3Z"/><path d="M8.5 12h7"/></svg><span>{pick('ไม่มีผลติดตัวในขณะนี้','No active effects right now')}</span></p>}
      </div>
    </section>}
    {section===2&&<section className="status-bonds" aria-labelledby="comic-bonds-title">
      <header className="status-section-head"><h3 id="comic-bonds-title"><HandshakeIcon/>{pick('ความไว้ใจและพันธะ','Trust & bonds')}</h3><div className="status-section-tools"><span>{pick('พ่อค้า','Merchants')} {merchants.length} {pick('ราย','')}</span><CompactPager page={at} pages={pages} onChange={setPage} label={pick('หน้าพ่อค้า','Merchant pages')}/></div></header>
      <div className="comic-bond-grid">
        {merchants.slice(at*perPage,(at+1)*perPage).map((npc,index)=>{
          const ability=abilities.find(a=>a.npc===npc),trust=self.npcTrust?.[npc]??ability?.trust??0;
          const reason=ability?abilityReason(ability):pick('ไม่มีพันธะในเกมนี้','Bonds unavailable in this game');
          const unavailable=disabled||!ability?.ready||!game.trustAbilities||!['APPRAISAL','TRADE'].includes(game.phase);
          return <article key={npc} className={`comic-bond-card portrait-${index>=(small?1:2)?'right':'left'}`} data-npc={npc}>
            <div className="comic-bond-art" aria-hidden="true"><img src={npcImage(npc)} alt=""/></div>
            <div className="comic-bond-copy"><h4 title={npcName(npc)}>{shortNames[npc]?pick(...shortNames[npc]!):npcName(npc)}</h4><div className="comic-bond-trust"><HandshakeIcon/><ComicMeter value={trust} max={10} label={`${npcName(npc)} ${pick('ความไว้ใจ','Trust')}`}/><span>{trust} / 10</span></div>
              <ComicButton disabled={unavailable} title={reason??(ability?abilityDescription(ability):undefined)} onClick={()=>setFocus(npc)}>{trust<1&&<svg width="18" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/></svg>}{ability?abilityName(ability):pick('ยังไม่ปลดล็อก','Locked')}{ability&&ability.remaining>0&&<small> · {ability.remaining}</small>}</ComicButton>
            </div>
          </article>;
        })}
        {!merchants.length&&<p className="status-empty">{pick('เกมนี้ไม่มีระบบพันธะพ่อค้า','Merchant bonds are unavailable in this game')}</p>}
      </div>
    </section>}
    </div>
    <GameDialog open={skillFocus!==null} label={pick('พันธะพ่อค้า','Merchant bond')} onClose={()=>setFocus(null)} className="comic-ability-dialog"><header className="status-section-head"><h2>{skillFocus&&npcName(skillFocus)}</h2><ComicButton onClick={()=>setFocus(null)}>{pick('กลับ','Back')}</ComicButton></header>{skillFocus&&<MerchantAbilities key={skillFocus} game={game} submit={submit} disabled={disabled} focusNpc={skillFocus} panel/>}</GameDialog>
    <GameDialog open={history} label={pick('ประวัติผลล่าสุด','Recent effects')} onClose={()=>setHistory(false)} className="comic-ability-dialog"><header className="status-section-head"><h2>{pick('ประวัติผลล่าสุด','Recent effects')}</h2><ComicButton onClick={()=>setHistory(false)}>{pick('กลับ','Back')}</ComicButton></header><ul>{self.notes.slice(-6).reverse().map((note,index)=><li key={index}><Rich text={playerNote(note,playerNames)} survival={!!game.survival}/></li>)}</ul></GameDialog>
  </div>;
}
