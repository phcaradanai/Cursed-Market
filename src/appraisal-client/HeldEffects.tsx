import { coinWinChance, commissionRate } from '../game/appraisal/passives.js';
import type { AppraisalView } from '../game/appraisal/types.js';
import { hasStatus, playerPassives } from './model.js';
import { t } from './i18n.js';
import { itemName, passiveText, usedBonusesText } from './catalog-text.js';

export function HeldEffects({game}:{game:AppraisalView}) {
  if(!game.passives || game.self.life===0)return null;
  const kinds=[...new Set(game.self.inventory.map(i=>i.kind))];
  const entries=kinds.filter(kind=>passiveText(kind,game.itemEffects)).map(kind=>({kind,count:game.self.inventory.filter(i=>i.kind===kind).length}));
  const used=game.itemEffects?game.self.itemUseBonuses:undefined;
  if(!entries.length && !used)return null;
  const b=playerPassives(game);
  const luck=game.polish?(hasStatus(game,'B18')?10:0)-(hasStatus(game,'D19')?10:0):0;
  return <details className="held-effects"><summary>{t('ดูผลของสะสม · {n} ชิ้น · {k} ชนิด',{n:entries.reduce((n,e)=>n+e.count,0),k:entries.length})}</summary>
    <p>{t('ค่านายหน้า {rate}%{fee} · เงินหลังซื้อขาย +{income} · หัวก้อยถูก {win}% ได้ครั้งละ {bonus} เครดิต · ตรวจได้ {n} ครั้งต่อช่วง',{rate:commissionRate(b),fee:b.saleFee?t(' + {n} เครดิตต่อการขาย',{n:b.saleFee}):'',income:b.income,win:game.self.roundReward?.winChance??Math.max(15,Math.min(85,coinWinChance(b)+luck)),bonus:5+b.coinWin,n:2+b.inspections})}</p>
    {used && <p>{t('ผลกดใช้ถึงจบรอบนี้ · ชนิดเดิมไม่บวกซ้ำ ต่างชนิดบวกกันได้: {text}',{text:usedBonusesText(used)})}</p>}
    {(b.maxEnergy>0 || b.maxLife>0 || b.wishSlots>0) && <p>{t('ขีดจำกัดจากของสะสม · พลังสูงสุด {energy}{life} · สัญญาตามหาของได้ {slots} รายการ',{energy:game.self.maxEnergy??game.maxEnergy??10,life:game.self.maxLife!==undefined?t(' · ชีวิตสูงสุด {n}',{n:game.self.maxLife}):'',slots:game.self.wishDesk?.cap??2+b.wishSlots})}</p>}
    <ul>{entries.map(({kind,count})=><li key={kind}><strong>{itemName(kind)} ×{count}</strong><span>{passiveText(kind,game.itemEffects)}</span></li>)}</ul>
    <p className="supporting">{t('ออกฤทธิ์ทันทีขณะถือ ไม่ต้องเปิดใช้ ของแท้และของปลอมให้ผลสะสมเหมือนกัน · ขายหรือแลกออกแล้วผลหาย · สิทธิ์ตรวจฟรีนับต่อคนต่อช่วงตามจำนวนที่ถือ และยังใช้โควตาตรวจ')}</p>
  </details>;
}
