import { PASSIVE_ITEM_IDS } from '../game/appraisal/types.js';
import { coinWinChance, commissionRate, PASSIVE_ITEMS } from '../game/appraisal/passives.js';
import type { AppraisalView } from '../game/appraisal/types.js';
import { playerPassives } from './model.js';

export function HeldEffects({game}:{game:AppraisalView}) {
  if(!game.passives || game.self.life===0)return null;
  const entries=PASSIVE_ITEM_IDS.map(kind=>({kind,count:game.self.inventory.filter(i=>i.kind===kind).length})).filter(e=>e.count);
  if(!entries.length)return null;
  const b=playerPassives(game);
  return <details className="held-effects"><summary>ดูผลของสะสม · {entries.reduce((n,e)=>n+e.count,0)} ชิ้น · {entries.length} ชนิด</summary>
    <p>ค่านายหน้า {commissionRate(b)}%{b.saleFee?` + ${b.saleFee} เครดิตต่อการขาย`:''} · เงินหลังซื้อขาย +{b.income} · หัวก้อยถูก {coinWinChance(b)}% ได้ครั้งละ {5+b.coinWin} เครดิต · ตรวจได้ {2+b.inspections} ครั้งต่อช่วง</p>
    <ul>{entries.map(({kind,count})=><li key={kind}><strong>{PASSIVE_ITEMS[kind].name} ×{count}</strong><span>{PASSIVE_ITEMS[kind].passive.text}</span></li>)}</ul>
    <p className="supporting">ออกฤทธิ์ทันทีขณะถือ ไม่ต้องเปิดใช้ ของแท้และของปลอมให้ผลสะสมเหมือนกัน · ขายหรือแลกออกแล้วผลหาย · สิทธิ์ตรวจฟรีนับต่อคนต่อช่วงตามจำนวนที่ถือ และยังใช้โควตาตรวจ</p>
  </details>;
}
