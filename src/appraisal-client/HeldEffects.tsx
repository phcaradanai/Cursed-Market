import { PASSIVE_ITEM_IDS } from '../game/appraisal/types.js';
import { coinWinChance, commissionRate } from '../game/appraisal/passives.js';
import type { AppraisalView } from '../game/appraisal/types.js';
import { playerPassives } from './model.js';
import { t } from './i18n.js';
import { itemName, passiveText } from './catalog-text.js';

export function HeldEffects({game}:{game:AppraisalView}) {
  if(!game.passives || game.self.life===0)return null;
  const entries=PASSIVE_ITEM_IDS.map(kind=>({kind,count:game.self.inventory.filter(i=>i.kind===kind).length})).filter(e=>e.count);
  if(!entries.length)return null;
  const b=playerPassives(game);
  return <details className="held-effects"><summary>{t('ดูผลของสะสม · {n} ชิ้น · {k} ชนิด',{n:entries.reduce((n,e)=>n+e.count,0),k:entries.length})}</summary>
    <p>{t('ค่านายหน้า {rate}%{fee} · เงินหลังซื้อขาย +{income} · หัวก้อยถูก {win}% ได้ครั้งละ {bonus} เครดิต · ตรวจได้ {n} ครั้งต่อช่วง',{rate:commissionRate(b),fee:b.saleFee?t(' + {n} เครดิตต่อการขาย',{n:b.saleFee}):'',income:b.income,win:coinWinChance(b),bonus:5+b.coinWin,n:2+b.inspections})}</p>
    {(b.maxEnergy>0 || b.maxLife>0 || b.wishSlots>0) && <p>{t('ขีดจำกัดจากของสะสม · พลังสูงสุด {energy}{life} · สัญญาตามหาของได้ {slots} รายการ',{energy:game.self.maxEnergy??game.maxEnergy??10,life:game.self.maxLife!==undefined?t(' · ชีวิตสูงสุด {n}',{n:game.self.maxLife}):'',slots:game.self.wishDesk?.cap??2+b.wishSlots})}</p>}
    <ul>{entries.map(({kind,count})=><li key={kind}><strong>{itemName(kind)} ×{count}</strong><span>{passiveText(kind)}</span></li>)}</ul>
    <p className="supporting">{t('ออกฤทธิ์ทันทีขณะถือ ไม่ต้องเปิดใช้ ของแท้และของปลอมให้ผลสะสมเหมือนกัน · ขายหรือแลกออกแล้วผลหาย · สิทธิ์ตรวจฟรีนับต่อคนต่อช่วงตามจำนวนที่ถือ และยังใช้โควตาตรวจ')}</p>
  </details>;
}
