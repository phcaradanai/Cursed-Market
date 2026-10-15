import { npcAcceptanceChance } from './model.js';
import { npcImage } from '../game/appraisal/content.js';
import type { AppraisalView, EventOffer } from '../game/appraisal/types.js';
import { NpcTerm } from './lore.js';
import { t } from './i18n.js';
import { itemName, npcHint, npcName } from './catalog-text.js';

/** Preview the existing event rules using only the seat's public portal hints. */
export function portalAvailability(game:AppraisalView,offer:EventOffer,choice:string):boolean[] | null {
  if(game.phase!=='PORTALS' || !['E01','E08','E10'].includes(offer.id))return null;
  return game.self.portals.map((portal,index)=>{
    if(offer.id==='E08' && choice!=='decline')return index===(choice==='cash'?0:1);
    if(index===0 && (choice==='switch' || choice==='decline') && offer.id!=='E08')return false;
    return !portal.disabled;
  });
}
export function portalChoiceTitle(game:AppraisalView,offer:EventOffer,choice:string):string | null {
  if(!portalAvailability(game,offer,choice))return null;
  const first=npcName(game.self.portals[0]!.npc);
  if(offer.id==='E08')return choice==='decline'?t('เก็บประตูที่เปิดอยู่ไว้'):`${choice==='cash'?t('เลือกเครดิต'):t('เลือกเงื่อนไข')} · ${npcName(game.self.portals[choice==='cash'?0:1]!.npc)}`;
  if(choice==='switch' || choice==='decline')return `${choice==='decline'?t('ไม่รับ · '):''}${t('ปิดประตู {npc}',{npc:first})}`;
  return `${offer.id==='E01'?t('เก็บประตู'):choice==='pay'?t('จ่ายค่าผ่านให้'):t('รับหมอกเพื่อเก็บประตู')} ${first}`;
}
export function PortalEventPreview({game,offer,choice}:{game:AppraisalView;offer:EventOffer;choice:string}) {
  const open=portalAvailability(game,offer,choice);if(!open)return null;
  return <section className="event-portal-context" aria-labelledby="event-portals-title">
    <h3 id="event-portals-title">{t('พ่อค้าที่รออยู่หลังประตู')}</h3>
    <p>{t('ดูของที่อาจได้และนิสัยพ่อค้าก่อนตัดสินใจ ยืนยันเหตุการณ์แล้วจึงเลือกเข้าประตูที่ยังเปิดได้หนึ่งราย')}</p>
    <div className="event-portal-grid">{game.self.portals.map((portal,index)=><article key={portal.id} className={`event-portal${open[index]?'':' will-close'}`}>
      <img src={npcImage(portal.npc)} alt="" width="56" height="70"/>
      <div><h4><NpcTerm npc={portal.npc}/></h4><p>{t('อาจมี {name}',{name:itemName(portal.hint)})}</p><p>{npcHint(portal.npc)}</p>
        {game.self.npcTrust && <p className="trust-note">{t('ไว้ใจ {n}/10 · ต่อรอง +{chance} จุดเปอร์เซ็นต์',{n:game.self.npcTrust[portal.npc]??0,chance:npcAcceptanceChance(game,portal.npc)})}</p>}
      </div>
      <p className={`portal-projection ${open[index]?'positive-text':'danger-text'}`}>{open[index]?(portal.disabled?t('จะเปิดให้เลือก'):t('ยังเปิดให้เลือก')):(portal.disabled?t('ปิดอยู่แล้ว'):t('จะปิดด้วยตัวเลือกนี้'))}</p>
    </article>)}</div>
    <p className="portal-preview-note" role="status" aria-live="polite">{t('ผลหากยืนยันตัวเลือกนี้: เข้าได้ {n} ประตู',{n:open.filter(Boolean).length})}{offer.id==='E08' && choice!=='decline'?t(' · เลือกพ่อค้าได้รายที่ระบุเท่านั้น'):''}</p>
  </section>;
}
