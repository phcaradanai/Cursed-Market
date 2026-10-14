import { useId, useState } from 'react';
import { ITEM_SPECS, NPC_SPECS, STATUS_CATALOG, itemImage } from '../game/appraisal/content.js';
import type { AppraisalView, EventOffer, ItemView } from '../game/appraisal/types.js';
import type { AppraisalRoomView } from '../shared/appraisal-protocol.js';
import { choiceName, eventCatalog, eventCost, eventDecision, eventFacts, eventItemName, eventNeedsItem, eventNeedsStatus, eventStatusOptions, factName, hasStatus, inspectionCost, inventoryLabel, marketOptions, purchaseEnergy, purchasePrice, readable, riskRange, scoreStatusText, eventScoreText, statusName } from './model.js';
import type { Decision } from './model.js';

export interface Actions { game:AppraisalView; submit:(action:Decision)=>void; disabled:boolean }
export function ItemFacts({item}:{item:ItemView}) {
  const k=item.knowledge;
  return <dl className="facts">
    <div><dt>มูลค่าจริง</dt><dd>{k.base!==undefined?`${k.base} เครดิต`:`ยังไม่รู้ · เบาะแส ${item.range[0]}–${item.range[1]}`}</dd></div>
    <div><dt>ความแท้</dt><dd>{k.genuine===undefined?'ยังไม่ตรวจ':k.genuine?'ของแท้':'ของปลอม'}</dd></div>
    <div><dt>คำสาป</dt><dd>{k.cursed===undefined?'ยังไม่ทราบ':k.cursed?'มีคำสาป':'ไม่มีคำสาป'}</dd></div>
    {item.certificate && <div><dt>ใบรับรองพ่อค้า</dt><dd>{k.certificate===undefined?'มีใบรับรอง · ยังไม่ตรวจ':k.certificate?'ตรวจแล้วตรงความจริง':'ตรวจแล้วเป็นเท็จ'}</dd></div>}
    {k.comparison && <div><dt>ผลเทียบราคา</dt><dd>{k.comparison===item.id?'ชิ้นนี้มูลค่าไม่น้อยกว่าอีกชิ้น':'อีกชิ้นมูลค่าสูงกว่า'}</dd></div>}
  </dl>;
}
export function Inspect({game,item,submit,disabled}:Actions&{item:ItemView}) {
  const cost=inspectionCost(game);
  const blocked=disabled || game.phase!=='APPRAISAL' || !!game.self.eventOffer || game.self.inspections>=2 || game.self.energy<cost;
  return <div className="inspection">
    <p>ตรวจเหลือ {Math.max(0,2-game.self.inspections)} ครั้ง · ครั้งละ {cost} พลัง{hasStatus(game,'D02')?' · หมอกราคาจะบังค่าจริง':''}</p>
    <div className="actions">
      <button disabled={blocked || item.knowledge.base!==undefined} onClick={()=>submit({type:'inspect',itemId:item.id,property:'price'})}>ตรวจราคา</button>
      <button disabled={blocked || item.knowledge.genuine!==undefined} onClick={()=>submit({type:'inspect',itemId:item.id,property:'authenticity'})}>ตรวจความแท้</button>
      <button disabled={blocked || (!!item.knowledge.effectsKnown && (!hasStatus(game,'B02') || item.knowledge.cursed!==undefined))} onClick={()=>submit({type:'inspect',itemId:item.id,property:'effects'})}>ตรวจผลของสินค้า</button>
    </div>
  </div>;
}
export function Share({game,item,submit,disabled}:Actions&{item:ItemView}) {
  const listing=game.listings.find(l=>l.ownerId===game.self.id && l.itemId===item.id);
  const maySell=item.owner===game.self.id?item.lockedUntil===null:item.appraisal!==null;
  return <div className="sharing">
    <p>{listing?listing.purchase?'เปิดให้ชมและยื่นข้อเสนอแล้ว':'เปิดให้ชมอย่างเดียวแล้ว':'ข้อมูลส่วนตัว · เลือกเปิดรายการให้คนอื่นชมได้'}</p>
    <div className="actions">
      <button disabled={disabled || !!listing && !listing.purchase} onClick={()=>submit({type:'share',itemId:item.id,allow:true,purchase:false})}>เปิดให้ชม</button>
      <button disabled={disabled || !maySell || !!listing?.purchase} onClick={()=>submit({type:'share',itemId:item.id,allow:true,purchase:true})}>เปิดให้ยื่นข้อเสนอ</button>
      {listing && <button disabled={disabled} onClick={()=>submit({type:'share',itemId:item.id,allow:false,purchase:false})}>ปิดรายการ</button>}
    </div>
  </div>;
}
export function Contract({item,condition,setCondition,disabled,survival=false}:{item:ItemView;condition:boolean;setCondition:(value:boolean)=>void;disabled:boolean;survival?:boolean}) {
  const spec=STATUS_CATALOG.find(s=>s.id===item.condition.statusId)!;
  if(!item.condition.available) return <p>ร้านนี้รับเครดิตอย่างเดียวในช่วงนี้</p>;
  return <div className="contract">
    <label className="check"><input type="checkbox" checked={condition} onChange={e=>setCondition(e.target.checked)} disabled={disabled || item.condition.required}/><span>{item.condition.required?'เงื่อนไขบังคับของร้าน:':'เลือกรับเงื่อนไข:'} ลด {item.condition.discount} เครดิต แลก {spec.name}</span></label>
    <p>{readable(spec.description)}{scoreStatusText(spec.id,survival)} · {readable(spec.duration)}</p>
  </div>;
}
export function AppraisalDesk({game,item,submit,disabled}:Actions&{item:ItemView}) {
  const [value,setValue]=useState(String(item.knowledge.base??Math.round((item.range[0]+item.range[1])/2)));
  const [danger,setDanger]=useState(false);
  const [condition,setCondition]=useState(item.condition.required);
  const [buyBoth,setBuyBoth]=useState(false);
  const inputId=useId();
  const number=Number(value);
  const valid=value.trim()!=='' && Number.isSafeInteger(number) && number>=0 && number<=1000;
  const risk=valid?riskRange(game,item,number):null;
  const items=buyBoth?game.self.stock:[item];
  const useCondition=item.condition.required || condition && item.condition.available;
  const total=purchasePrice(game,items,useCondition);
  const canAct=!disabled && !game.self.eventOffer;
  return <section className="desk" aria-label={`ประเมิน ${item.name}`}>
    <div className="relic-art"><img src={item.image} alt={item.name} width="1254" height="1254"/><span className="art-caption">{item.name}</span></div>
    <div className="desk-reading">
      <h2>{item.name}</h2>
      <ItemFacts item={item}/>
      <p className="item-effects">เมื่อเปิดใช้: {readable(item.possibleBenefit)}<br/>ความเสี่ยง: {readable(item.possibleDrawback)}{ITEM_SPECS[item.kind].consumable?' · ใช้แล้วหมดไป':''}</p>
      <Inspect game={game} item={item} submit={submit} disabled={disabled}/>
      <form onSubmit={e=>{e.preventDefault();if(valid)submit({type:item.appraisal===null?'appraise':'counter',itemId:item.id,value:number,acceptDanger:danger});}}>
        <label htmlFor={inputId}>{item.appraisal===null?'ราคาที่คุณประเมิน':'ราคาที่คุณต่อรองใหม่'} (เครดิต)</label>
        <div className="price-entry"><input id={inputId} type="number" inputMode="numeric" min="0" max="1000" step="1" required value={value} onChange={e=>setValue(e.target.value)} disabled={!canAct}/><button className="primary" disabled={!canAct || !valid || game.self.energy<1 || game.self.caught || item.appraisal!==null && game.self.counters>=game.self.counterLimit || item.npc==='darkone' && !danger}>{item.appraisal===null?'ยืนยันการประเมิน':'ยื่นราคาต่อรอง'} · 1 พลัง</button></div>
        <p className="risk">{risk?`โอกาสถูกจับผิด ${risk[0]===risk[1]?risk[0]:`${risk[0]}–${risk[1]}`}% จากข้อมูลที่คุณรู้`:'ใส่จำนวนเต็ม 0–1000'} · การถูกจับผิดอาจเสียเงินหรือของ{item.npc==='darkone'?' และถึงชีวิตตามสัญญา':''}</p>
        {item.npc==='darkone' && <label className="check danger-text"><input type="checkbox" checked={danger} onChange={e=>setDanger(e.target.checked)} disabled={!canAct}/><span>{game.survival?'ยอมรับสัญญา Dark One: หากถูกจับผิด อาจต้องสละของหรือชีวิตเป็น 0 เป็นผู้ชมจนจบ run ของและเครดิตยังรอ Collector':'ยอมรับสัญญา Dark One: หากถูกจับผิด อาจต้องสละของหรือตาย พักเฉพาะช่วงนี้และคะแนนช่วงนี้เป็น 0'}</span></label>}
        {item.appraisal!==null && <p>คุณเสนอ {item.appraisal} เครดิต · {item.appraisalAccepted?'NPC ยอมรับ':'NPC ปฏิเสธ'} · ต่อรองเหลือ {Math.max(0,game.self.counterLimit-game.self.counters)} ครั้ง</p>}
        {game.self.caught && <p className="danger-text">พ่อค้าจับผิดแล้ว ไม่รับการประเมินหรือต่อรองเพิ่ม ยังซื้อในราคาที่แสดงได้</p>}
      </form>
      <div className="purchase">
        <h3>ราคาที่พ่อค้ายอมขาย {item.price} เครดิต</h3>
        {item.appraisalAccepted===false && <p>ใช้ราคาหน้าร้าน {item.ask} เครดิต เพราะพ่อค้าปฏิเสธราคาประเมิน</p>}
        <Contract item={item} condition={useCondition} setCondition={setCondition} disabled={!canAct} survival={!!game.survival}/>
        {game.self.stock.length===2 && <label className="check"><input type="checkbox" checked={buyBoth} onChange={e=>setBuyBoth(e.target.checked)} disabled={!canAct}/><span>ซื้อทั้งสองชิ้นในดีลเดียว</span></label>}
        <button className="primary" disabled={!canAct || game.self.credits<total || game.self.energy<purchaseEnergy(game)} onClick={()=>submit({type:'buy',itemIds:items.map(i=>i.id),condition:useCondition})}>ซื้อ{buyBoth?'ทั้งคู่':'เก็บไว้'} · {total} เครดิต · {purchaseEnergy(game)} พลัง</button>
      </div>
      <Share game={game} item={item} submit={submit} disabled={disabled}/>
    </div>
  </section>;
}
export function EventDecision({game,offer,submit,disabled}:Actions&{offer:EventOffer}) {
  const [choice,setChoice]=useState(offer.choices[0]!);
  const [itemId,setItemId]=useState(offer.itemIds[0]??'');
  const statusOptions=eventStatusOptions(offer,choice);
  const [statusId,setStatusId]=useState(statusOptions[0]??'');
  const effectiveStatus=statusOptions.includes(statusId as typeof statusOptions[number])?statusId:statusOptions[0]??'';
  const facts=eventFacts(offer,itemId);
  const [fact,setFact]=useState<string>(facts[0]??'');
  const effectiveFact=facts.includes(fact as typeof facts[number])?fact:facts[0]??'';
  const [guess,setGuess]=useState(true);
  const ids={choice:useId(),item:useId(),status:useId(),fact:useId(),guess:useId()};
  const action=eventDecision(offer,choice,{itemId,statusId:effectiveStatus,fact:effectiveFact,guess});
  const catalog=eventCatalog(offer);
  const scoreTerms=eventScoreText(game,offer,choice==='decline'?offer.choices.find(c=>c!=='decline')??choice:choice,effectiveStatus);
  return <section className={`event-offer ${offer.id>='E48'?'consequence':''}`} aria-labelledby={`event-${offer.id}`}>
    <h2 id={`event-${offer.id}`}>{catalog.name}</h2>
    {scoreTerms && <p>ผลต่อคะแนน: {scoreTerms}</p>}
    <p>{game.survival && offer.id==='E50'?'ผลสัญญา Dark One: สละของที่เลือกหรือชีวิตเป็น 0 เป็นผู้ชมจนจบ run ของและเครดิตที่ยังเหลือรอ Collector':readable(catalog.description)}</p>
    {offer.id==='E08' && <dl className="portal-contracts">{game.self.portals.slice(0,2).map((portal,index)=>{
      const npc=NPC_SPECS[portal.npc];const status=STATUS_CATALOG.find(s=>s.id===npc.condition)!;
      const available=npc.condition!=='D04' || (game.encounterCount===null || game.encounter<game.encounterCount);
      return <div key={portal.id}><dt>{index===0?'เลือกเครดิต':'เลือกเงื่อนไข'} · {npc.name}</dt><dd>{index===0?'ร้านรับเครดิตอย่างเดียว ไม่มีส่วนลดแลกสถานะ':<>ลด {npc.discount} เครดิตต่อการซื้อ · ต้องรับ <strong>{status.name}</strong><p>{readable(status.description)}{scoreStatusText(status.id,!!game.survival)} · {readable(status.duration)}</p>{!available && <p className="danger-text">เงื่อนไขนี้ใช้ไม่ได้ในช่วงสุดท้าย ร้านชุดนี้จะซื้อไม่ได้ เลือกร้านรับเครดิตหรือปฏิเสธข้อเสนอแทน</p>}</>}</dd><dd>อาจมี {ITEM_SPECS[portal.hint].name}</dd></div>;
    })}</dl>}
    <form onSubmit={e=>{e.preventDefault();if(action)submit(action);}}>
      <label htmlFor={ids.choice}>เลือกการตอบรับ</label><select id={ids.choice} value={choice} onChange={e=>setChoice(e.target.value)} disabled={disabled}>{offer.choices.map(c=><option key={c} value={c}>{choiceName(c,!!game.survival)}</option>)}</select>
      {eventNeedsItem(offer,choice) && <><label htmlFor={ids.item}>สินค้าที่เลือก</label><select id={ids.item} value={itemId} onChange={e=>setItemId(e.target.value)} disabled={disabled}>{offer.itemIds.map((id,index)=><option key={id} value={id}>{eventItemName(offer,id)} · รายการ {index+1}{offer.id==='E44'?` · ${offer.quotedPrices[id]} เครดิต`:''}</option>)}</select></>}
      {eventNeedsStatus(offer,choice) && <><label htmlFor={ids.status}>สถานะที่จะสละหรือล้าง</label><select id={ids.status} value={effectiveStatus} onChange={e=>setStatusId(e.target.value)} disabled={disabled}>{statusOptions.map(id=><option key={id} value={id}>{statusName(id)}</option>)}</select></>}
      {offer.id==='E45' && choice!=='decline' && <><label htmlFor={ids.fact}>ผลตรวจที่จะเปิดให้ทุกคน</label><select id={ids.fact} value={effectiveFact} onChange={e=>setFact(e.target.value)} disabled={disabled}>{facts.map(f=><option key={f} value={f}>{factName[f]}: {typeof offer.facts[itemId]?.[f]==='boolean'?offer.facts[itemId]?.[f]?'ใช่':'ไม่ใช่':String(offer.facts[itemId]?.[f])}</option>)}</select></>}
      {offer.id==='E46' && choice!=='decline' && <><label htmlFor={ids.guess}>คุณทายว่า</label><select id={ids.guess} value={String(guess)} onChange={e=>setGuess(e.target.value==='true')} disabled={disabled}><option value="true">ของแท้</option><option value="false">ของปลอม</option></select></>}
      <p className="decision-cost">{eventCost(game,offer,choice,itemId)}{eventScoreText(game,offer,choice,effectiveStatus)}</p>
      <button className={offer.id>='E48'?'danger':'primary'} disabled={disabled || !action}>ยืนยัน: {choiceName(choice,!!game.survival)}</button>
    </form>
  </section>;
}
export function DarkMarket({game,submit,disabled}:Actions) {
  return <aside className="dark-market" aria-labelledby="market-title">
    <h2 id="market-title">Dark Market</h2>
    {!game.market.open?<p>ตลาดเงาปิดในช่วงนี้ เก็บของไว้ลุ้นรายการรับซื้อในช่วงถัดไป</p>:<>
      <p>รับซื้อถึงจบช่วงพบพ่อค้านี้ ซื้อของใหม่แล้วนำมาขายได้</p>
      <ul className="wanted">{game.market.orders.map(order=>{
        const quota=order.quota[game.self.id]??0;
        const owned=game.self.inventory.filter(item=>marketOptions(game,item).some(o=>o.id===order.id));
        return <li key={order.id}><img src={itemImage(order.kind)} alt="" width="1254" height="1254" loading="lazy"/><div><h3>{ITEM_SPECS[order.kind].name}</h3><p>รับซื้อ <strong>{order.price} เครดิต</strong> · สิทธิ์คุณ {quota} ชิ้น</p>
          {quota===0?<p>ใช้สิทธิ์รายการนี้แล้ว</p>:owned.length?owned.map(item=><div key={item.id} className="market-held"><p><strong>{inventoryLabel(game,item)}</strong></p><ItemFacts item={item}/><button disabled={disabled || !!game.self.eventOffer && game.self.eventOffer.id>='E48'} onClick={()=>submit({type:'market-sell',itemId:item.id,orderId:order.id})}>ขายคลัง #{game.self.inventory.findIndex(i=>i.id===item.id)+1} รับ {order.price} เครดิต</button></div>):<p>ยังไม่มีของที่ขายได้ในรายการนี้</p>}
        </div></li>;
      })}</ul>
      <p className="supporting">ขายแล้วโอนของทันที · ของที่ติดครอบครองอัปมงคลต้องปลดล็อกก่อน</p>
    </>}
  </aside>;
}
export function Inventory({game,submit,disabled}:Actions) {
  const [selected,setSelected]=useState<string|null>(null);
  const item=game.self.inventory.find(i=>i.id===selected);
  const playing=['APPRAISAL','TRADE'].includes(game.phase);
  return <section className="inventory" aria-labelledby="inventory-title">
    <h2 id="inventory-title">ของที่คุณเก็บไว้ <span>{game.self.inventory.length} ชิ้น</span></h2>
    {!game.self.inventory.length?<p>ยังไม่มีสินค้า ซื้อจากพ่อค้าหรือรับจากข้อเสนอของผู้เล่น</p>:<ul className="inventory-row">{game.self.inventory.map(i=><li key={i.id}><button className={`item-thumb ${i.id===selected?'selected':''}`} aria-pressed={i.id===selected} onClick={()=>setSelected(i.id===selected?null:i.id)}><img src={i.image} alt="" width="1254" height="1254" loading="lazy"/><span>{inventoryLabel(game,i)}</span>{i.lockedUntil!==null && <span>ล็อกถึงจบช่วง {i.lockedUntil}</span>}</button></li>)}</ul>}
    {item && <div className="inventory-detail"><h3>{item.name}</h3><ItemFacts item={item}/><p>ผลที่เป็นไปได้: {readable(item.possibleBenefit)} · {readable(item.possibleDrawback)}</p>
      {item.lockedUntil!==null && <p>ครอบครองอัปมงคล: ขายหรือแลกไม่ได้จนจบช่วง {item.lockedUntil} ยังเปิดใช้ได้</p>}
      {playing && <><Inspect game={game} item={item} submit={submit} disabled={disabled}/>
        <p>{ITEM_SPECS[item.kind].consumable?'ใช้แล้วสินค้าจะหมดไป':'เปิดใช้ได้หนึ่งครั้งต่อช่วง'} · เมื่อไม่รู้ความแท้หรือคำสาป ยังเสี่ยงรับผลเสีย</p>
        <button disabled={disabled || !!game.self.eventOffer || game.self.energy<1 || game.self.activated.includes(item.id)} onClick={()=>submit({type:'activate',itemId:item.id})}>เปิดใช้ {item.name} · 1 พลัง</button>
        <Share game={game} item={item} submit={submit} disabled={disabled}/></>}
    </div>}
  </section>;
}
export function Statuses({game}:{game:AppraisalView}) {
  return <details className="statuses"><summary>ผลติดตัว {game.self.statuses.length} ประเภท</summary>{!game.self.statuses.length?<p>ยังไม่มี buff หรือ debuff</p>:<ul>{game.self.statuses.map(s=>{const spec=STATUS_CATALOG.find(x=>x.id===s.id)!;return <li key={s.id}><strong className={s.id.startsWith('D')?'danger-text':'positive-text'}>{spec.name}</strong><p>{readable(spec.description)}{game.survival && s.id==='B10'?' · Collector เพิ่มคะแนนรวม 20% ขณะสถานะยังอยู่':''}{game.survival && s.id==='D10'?' · Collector ลดคะแนนรวม 20% ขณะสถานะยังอยู่':''}</p>{game.survival && game.self.life===0?<p>เก็บสถานะนี้ไว้สำหรับ Collector ไม่เดินอายุต่อหลังตาย</p>:<p>เริ่มช่วง {s.starts} · ถึงจบช่วง {s.expires} · ใช้เหลือ {s.charges} ครั้ง{s.targetItemId?' · ผูกกับสินค้าหนึ่งชิ้น':''}</p>}</li>;})}</ul>}</details>;
}
export function TradeListing({game,listing,room,submit,disabled}:Actions&{listing:AppraisalView['listings'][number];room:AppraisalRoomView}) {
  const [credits,setCredits]=useState('0');const [swap,setSwap]=useState('');
  const [condition,setCondition]=useState(listing.item.condition.required);
  const id=useId();const swapId=useId();const item=listing.item;
  const source=item.owner.startsWith('npc:')?'npc':'inventory';
  const price=Number(credits);const valid=credits.trim()!=='' && Number.isSafeInteger(price) && price>=0 && price<=1000;
  const useCondition=item.condition.required || condition && item.condition.available;
  const npcPrice=source==='npc'?purchasePrice(game,[item],useCondition):0;
  const seller=game.players.find(p=>p.id===listing.ownerId);
  const pending=game.trades.filter(t=>t.buyerId===game.self.id && t.status==='open').length;
  const name=room.matchSeats.find(s=>s.id===listing.ownerId)?.name??'นักประเมิน';
  return <article className="trade-listing"><img className="trade-art" src={item.image} alt={item.name} width="1254" height="1254" loading="lazy"/><div><h3>{item.name} · {name}</h3><p>{source==='npc'?'ของในร้าน NPC · ต้องให้เจ้าของร้านอนุมัติ':'สินค้าของผู้เล่น · ราคาที่ต่ำไม่มีบทลงโทษจาก NPC'}</p><ItemFacts item={item}/>
    {listing.purchase?<form onSubmit={e=>{e.preventDefault();if(valid)submit({type:'propose',sellerId:listing.ownerId,itemId:item.id,credits:price,...(swap?{swapItemId:swap}:{}),condition:useCondition});}}>
      <label htmlFor={id}>{source==='npc'?'ค่าแนะนำที่จะให้นักประเมิน':'เครดิตที่เสนอให้เจ้าของ'}</label><input id={id} type="number" min="0" max="1000" step="1" value={credits} onChange={e=>setCredits(e.target.value)} disabled={disabled}/>
      {source==='inventory'?<><label htmlFor={swapId}>สินค้าแลกเพิ่ม (ไม่บังคับ)</label><select id={swapId} value={swap} onChange={e=>setSwap(e.target.value)} disabled={disabled}><option value="">ไม่แลกสินค้าเพิ่ม</option>{game.self.inventory.filter(i=>i.lockedUntil===null).map(i=><option key={i.id} value={i.id}>{i.name}</option>)}</select></>:<Contract item={item} condition={useCondition} setCondition={setCondition} disabled={disabled} survival={!!game.survival}/>}
      <p>เมื่อผู้ขายยอมรับ จ่ายรวม {valid?price+npcPrice:'—'} เครดิต{source==='npc'?` (${npcPrice} ให้ NPC + ${valid?price:'—'} ค่าแนะนำ) · ${purchaseEnergy(game)} พลัง`:' · ไม่ใช้พลัง'}{swap?' และโอนสินค้าที่เลือกให้ผู้ขาย':''}</p>
      {seller?.paused || seller?.done?<p>เจ้าของพักหรือจบช่วงแล้ว ยื่นข้อเสนอไม่ได้</p>:<button disabled={disabled || !valid || price+npcPrice>game.self.credits || source==='npc' && game.self.energy<purchaseEnergy(game) || pending>=8}>ยื่นข้อเสนอให้ {name}</button>}
    </form>:<p>เจ้าของเปิดให้ชมอย่างเดียว ยังซื้อไม่ได้</p>}
  </div></article>;
}
export function Trades({game,room,submit,disabled}:Actions&{room:AppraisalRoomView}) {
  const listings=game.listings.filter(l=>l.ownerId!==game.self.id);
  const name=(id:string)=>room.matchSeats.find(s=>s.id===id)?.name??'ผู้เล่น';
  return <section className="trades"><h2>ต่อรองกับนักประเมินคนอื่น</h2><p>เจ้าของต้องเปิดรายการและตอบรับก่อนโอนของกับเงิน ราคาต่ำหรือ 0 เครดิตไม่มีผลจับผิดจาก NPC</p>
    {!listings.length?<p>ยังไม่มีใครเปิดรายการ เปิดของจากคลังหรือร้านที่ประเมินแล้วให้เพื่อนยื่นข้อเสนอ</p>:listings.map(listing=><TradeListing key={listing.itemId} game={game} listing={listing} room={room} submit={submit} disabled={disabled}/>)}
    <h3>ข้อเสนอซื้อขายของคุณ</h3>{!game.trades.length?<p>ยังไม่มีข้อเสนอ</p>:<ul className="offers">{game.trades.map(t=><li key={t.id}><p><strong>{t.item.name}</strong> · {name(t.buyerId)} เสนอ {t.credits} เครดิต{t.source==='npc'?' เป็นค่าแนะนำ นอกเหนือจากราคาพ่อค้า':''}{t.swapItem?` + แลก ${t.swapItem.name}`:''} ให้ {name(t.sellerId)}</p>{t.swapItem && <div className="swap-details"><h3>ของแลกจาก {name(t.buyerId)}: {t.swapItem.name}</h3><img src={t.swapItem.image} width="1254" height="1254" alt={t.swapItem.name}/><ItemFacts item={t.swapItem}/><p>ผลที่เป็นไปได้: {readable(t.swapItem.possibleBenefit)} · {readable(t.swapItem.possibleDrawback)}</p></div>}<p>{t.condition?'ผู้ซื้อยอมรับเงื่อนไข NPC · ':''}{t.status==='open'?'รอผู้ขายตอบรับ':t.status==='accepted'?'ตกลงและโอนสำเร็จแล้ว':'ปฏิเสธหรือหมดอายุแล้ว'}</p>{t.sellerId===game.self.id && t.status==='open' && <div className="actions"><button className="primary" disabled={disabled || !!game.self.eventOffer && game.self.eventOffer.id>='E48'} onClick={()=>submit({type:'respond',offerId:t.id,accept:true})}>ตกลงและโอนทันที</button><button disabled={disabled || !!game.self.eventOffer && game.self.eventOffer.id>='E48'} onClick={()=>submit({type:'respond',offerId:t.id,accept:false})}>ปฏิเสธ</button></div>}</li>)}</ul>}
  </section>;
}
