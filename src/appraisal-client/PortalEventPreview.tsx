import { npcAcceptanceChance } from './model.js';
import { ITEM_SPECS, NPC_SPECS, npcImage } from '../game/appraisal/content.js';
import type { AppraisalView, EventOffer } from '../game/appraisal/types.js';
import { NpcTerm } from './lore.js';

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
  const first=NPC_SPECS[game.self.portals[0]!.npc].name;
  if(offer.id==='E08')return choice==='decline'?'เก็บประตูที่เปิดอยู่ไว้':`${choice==='cash'?'เลือกเครดิต':'เลือกเงื่อนไข'} · ${NPC_SPECS[game.self.portals[choice==='cash'?0:1]!.npc].name}`;
  if(choice==='switch' || choice==='decline')return `${choice==='decline'?'ไม่รับ · ':''}ปิดประตู ${first}`;
  return `${offer.id==='E01'?'เก็บประตู':choice==='pay'?'จ่ายค่าผ่านให้':'รับหมอกเพื่อเก็บประตู'} ${first}`;
}
export function PortalEventPreview({game,offer,choice}:{game:AppraisalView;offer:EventOffer;choice:string}) {
  const open=portalAvailability(game,offer,choice);if(!open)return null;
  return <section className="event-portal-context" aria-labelledby="event-portals-title">
    <h3 id="event-portals-title">พ่อค้าที่รออยู่หลังประตู</h3>
    <p>ดูของที่อาจได้และนิสัยพ่อค้าก่อนตัดสินใจ ยืนยันเหตุการณ์แล้วจึงเลือกเข้าประตูที่ยังเปิดได้หนึ่งราย</p>
    <div className="event-portal-grid">{game.self.portals.map((portal,index)=><article key={portal.id} className={`event-portal${open[index]?'':' will-close'}`}>
      <img src={npcImage(portal.npc)} alt="" width="56" height="70"/>
      <div><h4><NpcTerm npc={portal.npc}/></h4><p>อาจมี {ITEM_SPECS[portal.hint].name}</p><p>{NPC_SPECS[portal.npc].hint}</p>
        {game.self.npcTrust && <p className="trust-note">ไว้ใจ {game.self.npcTrust[portal.npc]??0}/10 · ต่อรอง +{npcAcceptanceChance(game,portal.npc)} จุดเปอร์เซ็นต์</p>}
      </div>
      <p className={`portal-projection ${open[index]?'positive-text':'danger-text'}`}>{open[index]?(portal.disabled?'จะเปิดให้เลือก':'ยังเปิดให้เลือก'):(portal.disabled?'ปิดอยู่แล้ว':'จะปิดด้วยตัวเลือกนี้')}</p>
    </article>)}</div>
    <p className="portal-preview-note" role="status" aria-live="polite">ผลหากยืนยันตัวเลือกนี้: เข้าได้ {open.filter(Boolean).length} ประตู{offer.id==='E08' && choice!=='decline'?' · เลือกพ่อค้าได้รายที่ระบุเท่านั้น':''}</p>
  </section>;
}
