import type { AppraisalView } from '../game/appraisal/types.js';
import { ItemTerm, NpcTerm } from './lore.js';
import { t } from './i18n.js';

/** Every open wish in any phase, so a seat can recall what each merchant wants and whether it already holds it. */
export function WishlistPanel({game}:{game:AppraisalView}) {
  const book=game.self.wishBook;
  if(!book?.length) return null;
  const held=(kind:string)=>game.self.inventory.filter(i=>i.kind===kind).length;
  const ready=book.filter(row=>held(row.kind)>0).length;
  return <details className="wishlist-panel"><summary>{t('รายการตามหาของ · {n} รายการ',{n:book.length})}{ready>0 && <span className="positive-text"> · {t('มีของแล้ว {n}',{n:ready})}</span>}</summary>
    <ul>{book.map(row=>{const count=held(row.kind);return <li key={row.npc}>
      <p><NpcTerm npc={row.npc}/> {t('ตามหา')} <ItemTerm kind={row.kind}/> · {t('ตอนนี้')} <strong>{t('{n} เครดิต',{n:row.price})}</strong>{row.price>row.floor?t(' · ช่วงหน้า {n}',{n:row.next}):t(' · ถึงราคาฐานแล้ว')} · {t('ฐาน {n}',{n:row.floor})}</p>
      <p className={count?'positive-text':'supporting'}>{count?t('คุณมีของชิ้นนี้ {n} ชิ้น ขายได้เมื่อเลือกพบพ่อค้ารายนี้ในช่วงประเมิน',{n:count}):t('ยังไม่มีของชิ้นนี้ ซื้อจากพ่อค้าหรือแลกกับเพื่อน')}</p>
    </li>;})}</ul>
  </details>;
}
