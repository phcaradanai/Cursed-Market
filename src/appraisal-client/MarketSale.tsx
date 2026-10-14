import { marketConditionMatch } from '../game/appraisal/market-contracts.js';
import { passiveMarketBonus } from '../game/appraisal/passives.js';
import { playerPassives } from './model.js';
import type { AppraisalView, ItemView, MarketContract, MarketOrder } from '../game/appraisal/types.js';
import type { Decision } from './model.js';
import { Rich } from './lore.js';

export const marketRequirements=(c:MarketContract)=>c.requirements.map(r=>r.property==='genuine'?(r.value?'ของแท้':'ของปลอม'):(r.value?'มีคำสาป':'ไม่มีคำสาป')).join(' และ ');
export function marketBonus(c:MarketContract):string {
  const b=c.bonus;return b.kind==='credits'?`เครดิตเพิ่ม ${b.amount}`:b.kind==='energy'?`ฟื้นพลังสูงสุด ${b.amount} (ใช้ผลติดตัวตามปกติ)`:b.kind==='life'?`ฟื้นชีวิตสูงสุด ${b.amount}`:`รับ ${b.statusId}`;
}
export function marketCost(c:MarketContract):string {
  const cost=c.fullPriceCost;return cost.kind==='energy'?`สละ ${cost.amount} พลัง`:cost.kind==='life'?`สละ ${cost.amount} ชีวิต (ต้องเหลืออย่างน้อย 1)`:`รับ ${cost.statusId}`;
}
export function MarketSale({game,item,order,submit,disabled}:{game:AppraisalView;item:ItemView;order:MarketOrder;submit:(action:Decision)=>void;disabled:boolean}) {
  const b=playerPassives(game,item.id);const flat=passiveMarketBonus(order,b,false,false);
  const c=order.contract;if(!c)return <button disabled={disabled} onClick={()=>submit({type:'market-sell',itemId:item.id,orderId:order.id})}>ขายคลัง #{game.self.inventory.findIndex(i=>i.id===item.id)+1} รับ {order.price+flat} เครดิต</button>;
  const match=marketConditionMatch(c,item.knowledge);const discounted=Math.floor(order.price*80/100)+passiveMarketBonus(order,b,false,true);
  const payout=order.price+(c.bonus.kind==='credits'?c.bonus.amount:0)+passiveMarketBonus(order,b,true,false);
  const fullPayout=order.price+flat;
  const cost=c.fullPriceCost;const payable=cost.kind==='energy'?game.self.energy>=cost.amount:cost.kind==='life'?game.self.life!==undefined && game.self.life>cost.amount:!game.self.statuses.some(s=>s.id===cost.statusId) || game.self.statuses.some(s=>s.id==='B06');
  return <div className="market-decision">
    <p className={match==='match'?'positive-text':match==='mismatch'?'danger-text':'supporting'}>{match==='match'?'ข้อมูลที่ตรวจรู้ตรงเงื่อนไข':match==='mismatch'?'ข้อมูลที่ตรวจรู้ไม่ตรงเงื่อนไข':'ยังตรวจไม่ครบ ตลาดจะตรวจตอนขาย · เลือกความเสี่ยงก่อนยืนยัน'}</p>
    {(b.market>0 || b.match>0 || b.mitigation>0) && <p className="supporting">ยอดขายรวมผลของสะสมที่ถือแล้ว ไม่นับสินค้าชิ้นที่กำลังขาย</p>}
    <div className="actions"><button className="primary" disabled={disabled} onClick={()=>submit({type:'market-sell',itemId:item.id,orderId:order.id,resolution:'discount'})}>{match==='match'?`ขายรับ ${payout} เครดิต${c.bonus.kind==='credits'?'':' + โบนัส'}`:match==='mismatch'?`ขายลด ${20-Math.min(20,b.mitigation)}% · รับ ${discounted} เครดิต`:`ขาย · ตรงรับ ${payout} / ผิดรับ ${discounted} เครดิต`}</button>
    {match!=='match' && <button disabled={disabled || !payable} onClick={()=>submit({type:'market-sell',itemId:item.id,orderId:order.id,resolution:'sacrifice'})}>ขายราคาเต็ม {match==='unknown' && (b.market>0 || b.match>0) && payout!==fullPayout?`${payout} / ผิดรับ ${fullPayout}`:fullPayout} เครดิต · {match==='unknown'?'ถ้าผิดเงื่อนไข ':''}<Rich text={marketCost(c)} survival={!!game.survival} passive/></button>}</div>
    {match!=='match' && <p className="supporting">ไม่ตรงเงื่อนไขจะไม่ได้โบนัสสัญญา{!payable?' · ยังจ่ายสิ่งแลกเปลี่ยนเพื่อรับราคาเต็มไม่ได้':''}</p>}
  </div>;
}
