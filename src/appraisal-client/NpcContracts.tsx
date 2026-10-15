import type { AppraisalView } from '../game/appraisal/types.js';
import { t } from './i18n.js';
import { itemName } from './catalog-text.js';

/** Keep deferred commitments visible while choosing the next merchant. */
export function NpcContracts({game}:{game:AppraisalView}) {
  const {npcContracts,vampireDiscount,loanItems}=game.self;
  if(!npcContracts?.alien && !npcContracts?.vampire && !vampireDiscount)return null;
  return <section className="npc-contracts" aria-labelledby="npc-contract-title"><h2 id="npc-contract-title">{t('สัญญากับพ่อค้า')}</h2>
    {npcContracts?.vampire && <p><strong>{t('Vampire · จ่ายชีวิต 2 แล้ว')}</strong> {t('เลือกพบ Vampire ครั้งหน้าเพื่อรับของฟรี ส่วนลด 50% ฟื้นพลัง ฟื้นชีวิต หรือพรอย่างใดอย่างหนึ่งแบบสุ่ม')}</p>}
    {vampireDiscount && <p><strong>{t('Vampire · ลดราคาสินค้า 50%')}</strong> {t('ใช้กับการซื้อจากร้าน Vampire นี้ครั้งแรกในช่วงนี้ รวมซื้อสองชิ้นได้ คิดหลังส่วนลดคงที่ ไม่รวมค่าธรรมเนียม')}</p>}
    {npcContracts?.alien && <div><p><strong>{t('Alien · ยืมของ {n} ชิ้น',{n:npcContracts.alien.itemIds.length})}</strong> {game.self.life===0?t('จบรันแล้วจะคืนของเพื่อคิดคะแนน โดยไม่มีโบนัส'):game.encounter>=npcContracts.alien.dueAt?t('ครบกำหนดแล้ว เลือกพบ Alien เพื่อรับของคืนพร้อมโบนัส'):t('พบ Alien ตั้งแต่ช่วง {n} เพื่อรับของคืนพร้อมโบนัส',{n:npcContracts.alien.dueAt})}</p>
      <ul>{loanItems?.map((item,index)=><li key={item.id}>#{index+1} {itemName(item.kind)}</li>)}</ul>
      <p className="supporting">{t('ของที่ยืมหยุดให้ผลติดตัว · โบนัส 4–8 เครดิตและฟื้นพลังสูงสุด 1–2 ต่อชิ้น · หากจบรันก่อนรับคืน จะคืนของเดิมเพื่อคิดคะแนน แต่ไม่ได้โบนัส')}</p>
    </div>}
  </section>;
}
