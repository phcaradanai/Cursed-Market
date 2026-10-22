import { copySaleQuote } from '../game/appraisal/copy-effects.js';
import { marketConditionMatch } from '../game/appraisal/market-contracts.js';
import { passiveMarketBonus } from '../game/appraisal/passives.js';
import { playerPassives, saleAdjusted } from './model.js';
import type { AppraisalView, ItemView, MarketContract, MarketOrder } from '../game/appraisal/types.js';
import type { Decision } from './model.js';
import { Rich } from './lore.js';
import { t } from './i18n.js';
import { tip, useLock } from './reasons.js';
import { statusName } from './catalog-text.js';

export const marketRequirements=(c:MarketContract)=>c.requirements.map(r=>r.property==='genuine'?(r.value?t('ของแท้'):t('ของปลอม')):(r.value?t('มีคำสาป'):t('ไม่มีคำสาป'))).join(t(' และ '));
export function marketBonus(c:MarketContract):string {
  const b=c.bonus;return b.kind==='credits'?t('เครดิตเพิ่ม {n}',{n:b.amount}):b.kind==='energy'?t('ฟื้นพลังสูงสุด {n} (ใช้ผลติดตัวตามปกติ)',{n:b.amount}):b.kind==='life'?t('ฟื้นชีวิตสูงสุด {n}',{n:b.amount}):t('รับ {name}',{name:statusName(b.statusId)});
}
export function marketCost(c:MarketContract):string {
  const cost=c.fullPriceCost;return cost.kind==='energy'?t('สละ {n} พลัง',{n:cost.amount}):cost.kind==='life'?t('สละ {n} ชีวิต (ต้องเหลืออย่างน้อย 1)',{n:cost.amount}):t('รับ {name}',{name:statusName(cost.statusId)});
}
export function MarketSale({game,item,order,submit,disabled}:{game:AppraisalView;item:ItemView;order:MarketOrder;submit:(action:Decision)=>void;disabled:boolean}) {
  const locked=useLock();const why=disabled?locked??t('ตอบเหตุการณ์ก่อน หรือยังไม่ถึงช่วงที่ขายได้'):undefined;
  const b=playerPassives(game,item.id);const flat=passiveMarketBonus(order,b,false,false);
  const c=order.contract;if(!c)return <button disabled={disabled} title={why} onClick={()=>submit({type:'market-sell',itemId:item.id,orderId:order.id})}>{t('ขายคลัง #{n} รับ {credits} เครดิต',{n:game.self.inventory.findIndex(i=>i.id===item.id)+1,credits:copySaleQuote(item,saleAdjusted(game,order.price))+flat})}</button>;
  const match=marketConditionMatch(c,item.knowledge);const discounted=copySaleQuote(item,saleAdjusted(game,Math.floor(order.price*80/100)))+passiveMarketBonus(order,b,false,true);
  const payout=copySaleQuote(item,saleAdjusted(game,order.price))+(c.bonus.kind==='credits'?copySaleQuote(item,c.bonus.amount):0)+passiveMarketBonus(order,b,true,false);
  const fullPayout=copySaleQuote(item,saleAdjusted(game,order.price))+flat;
  const cost=c.fullPriceCost;const payable=cost.kind==='energy'?game.self.energy>=cost.amount:cost.kind==='life'?game.self.life!==undefined && game.self.life>cost.amount:!game.self.statuses.some(s=>s.id===cost.statusId) || game.self.statuses.some(s=>s.id==='B06');
  return <div className="market-decision">
    <p className={match==='match'?'positive-text':match==='mismatch'?'danger-text':'supporting'}>{match==='match'?t('ข้อมูลที่ตรวจรู้ตรงเงื่อนไข'):match==='mismatch'?t('ข้อมูลที่ตรวจรู้ไม่ตรงเงื่อนไข'):t('ยังตรวจไม่ครบ ตลาดจะตรวจตอนขาย · เลือกความเสี่ยงก่อนยืนยัน')}</p>
    {(b.market>0 || b.match>0 || b.mitigation>0) && <p className="supporting">{t('ยอดขายรวมผลของสะสมที่ถือแล้ว ไม่นับสินค้าชิ้นที่กำลังขาย')}</p>}
    <div className="actions"><button className="primary" disabled={disabled} title={why} onClick={()=>submit({type:'market-sell',itemId:item.id,orderId:order.id,resolution:'discount'})}>{match==='match'?`${t('ขายรับ {n} เครดิต',{n:payout})}${c.bonus.kind==='credits'?'':t(' + โบนัส')}`:match==='mismatch'?t('ขายลด {pct}% · รับ {n} เครดิต',{pct:20-Math.min(20,b.mitigation),n:discounted}):t('ขาย · ตรงรับ {a} / ผิดรับ {b} เครดิต',{a:payout,b:discounted})}</button>
    {match!=='match' && <button disabled={disabled || !payable} title={tip(why,!payable&&t('ยังจ่ายสิ่งแลกเปลี่ยนเพื่อรับราคาเต็มไม่ได้'))} onClick={()=>submit({type:'market-sell',itemId:item.id,orderId:order.id,resolution:'sacrifice'})}>{t('ขายราคาเต็ม')} {match==='unknown' && (b.market>0 || b.match>0) && payout!==fullPayout?t('{a} / ผิดรับ {b}',{a:payout,b:fullPayout}):fullPayout} {t('เครดิต')} · {match==='unknown'?t('ถ้าผิดเงื่อนไข '):''}<Rich text={marketCost(c)} survival={!!game.survival} passive/></button>}</div>
    {match!=='match' && <p className="supporting">{t('ไม่ตรงเงื่อนไขจะไม่ได้โบนัสสัญญา')}{!payable?t(' · ยังจ่ายสิ่งแลกเปลี่ยนเพื่อรับราคาเต็มไม่ได้'):''}</p>}
  </div>;
}
