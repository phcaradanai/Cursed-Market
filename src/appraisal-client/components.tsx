import { marketBonus, marketCost, marketRequirements, MarketSale } from './MarketSale.js';
import { PortalEventPreview, portalChoiceTitle } from './PortalEventPreview.js';
import { commissionRate, passiveSpec } from '../game/appraisal/passives.js';
import { freeInspectionRemaining, inspectionQuota, npcAcceptanceChance, playerPassives } from './model.js';
import { TRUST_CAP } from '../game/appraisal/market-contracts.js';
import { useEffect, useId, useState } from 'react';
import { ITEM_SPECS, NPC_SPECS, STATUS_CATALOG, itemImage } from '../game/appraisal/content.js';
import type { AppraisalView, EventOffer, ItemView } from '../game/appraisal/types.js';
import type { AppraisalRoomView } from '../shared/appraisal-protocol.js';
import { choiceTitle, eventCatalog, eventCost, eventDecision, eventFacts, eventItemName, eventNeedsItem, eventNeedsStatus, eventStatusOptions, factName, hasStatus, inspectionCost, inventoryLabel, marketOptions, purchaseEnergy, purchasePrice, readable, riskRange, stepPrice, scoreStatusText, eventScoreText, statusName, isConsequence, bondOf, unsoldItems, unsoldPenaltyText, consignText } from './model.js';
import type { Decision } from './model.js';
import { ChoiceCards, ItemCard, ItemTerm, NpcTerm, Peek, Rich, StatusTerm } from './lore.js';
import { AppraiseIcon, BuffIcon, BuyIcon, CoinIcon, DebuffIcon, EventIcon, InspectIcon, MarketIcon, MinusIcon, PlusIcon } from './icons.js';

export interface Actions { game:AppraisalView; submit:(action:Decision)=>void; disabled:boolean }
export function ItemFacts({item}:{item:ItemView}) {
  const k=item.knowledge;
  return <dl className="facts">
    <div className={k.base===undefined?'unknown':''}><dt>มูลค่าจริง</dt><dd>{k.base!==undefined?`${k.base} เครดิต`:k.range?`ยังไม่รู้ · เบาะแส ${k.range[0]}–${k.range[1]}`:'ยังไม่รู้ · ใช้ตรวจราคาเพื่อหาเบาะแส'}</dd></div>
    <div className={k.genuine===undefined?'unknown':''}><dt>ความแท้</dt><dd>{k.genuine===undefined?'ยังไม่ตรวจ':k.genuine?'ของแท้':'ของปลอม'}</dd></div>
    <div className={k.cursed===undefined?'unknown':''}><dt>คำสาป</dt><dd>{k.cursed===undefined?'ยังไม่ทราบ':k.cursed?'มีคำสาป':'ไม่มีคำสาป'}</dd></div>
    {item.certificate && <div className={k.certificate===undefined?'unknown':''}><dt>ใบรับรองพ่อค้า</dt><dd>{k.certificate===undefined?'มีใบรับรอง · ยังไม่ตรวจ':k.certificate?'ตรวจแล้วตรงความจริง':'ตรวจแล้วเป็นเท็จ'}</dd></div>}
    {k.comparison && <div><dt>ผลเทียบราคา</dt><dd>{k.comparison===item.id?'ชิ้นนี้มูลค่าไม่น้อยกว่าอีกชิ้น':'อีกชิ้นมูลค่าสูงกว่า'}</dd></div>}
  </dl>;
}
export function Inspect({game,item,submit,disabled}:Actions&{item:ItemView}) {
  const price=inspectionCost(game,'price'),auth=inspectionCost(game,'authenticity'),effects=inspectionCost(game,'effects');
  const blocked=disabled || game.phase!=='APPRAISAL' || !!game.self.eventOffer || game.self.inspections>=inspectionQuota(game);
  return <div className="inspection">
    <p>ตรวจได้อีก {Math.max(0,inspectionQuota(game)-game.self.inspections)} ครั้งในช่วงนี้ · ราคา {price} / ความแท้ {auth} / ผลสินค้า {effects} พลัง{hasStatus(game,'D02')?' · หมอกราคาบังมูลค่าจริงอยู่':''}</p>
    {(['price','authenticity','effects'] as const).some(p=>freeInspectionRemaining(game,p)>0) && <p className="positive-text">สิทธิ์ฟรีที่เหลือช่วงนี้: ราคา {freeInspectionRemaining(game,'price')} · ความแท้ {freeInspectionRemaining(game,'authenticity')} · ผลสินค้า {freeInspectionRemaining(game,'effects')}</p>}
    <div className="actions">
      <button className="inspect" disabled={blocked || game.self.energy<price || item.knowledge.base!==undefined} onClick={()=>submit({type:'inspect',itemId:item.id,property:'price'})}><InspectIcon/>ตรวจราคา{price===0?' · ฟรี':''}</button>
      <button className="inspect" disabled={blocked || game.self.energy<auth || item.knowledge.genuine!==undefined} onClick={()=>submit({type:'inspect',itemId:item.id,property:'authenticity'})}><InspectIcon/>ตรวจความแท้{auth===0?' · ฟรี':''}</button>
      <button className="inspect" disabled={blocked || game.self.energy<effects || (!!item.knowledge.effectsKnown && (!hasStatus(game,'B02') || item.knowledge.cursed!==undefined))} onClick={()=>submit({type:'inspect',itemId:item.id,property:'effects'})}><InspectIcon/>ตรวจผลของสินค้า{effects===0?' · ฟรี':''}</button>
    </div>
  </div>;
}
export function Share({game,item,submit,disabled}:Actions&{item:ItemView}) {
  const listing=game.listings.find(l=>l.ownerId===game.self.id && l.itemId===item.id);
  const maySell=item.owner===game.self.id?item.lockedUntil===null:item.appraisal!==null;
  return <div className="sharing">
    <p>{listing?listing.purchase?'ประกาศขายแล้ว เพื่อนยื่นข้อเสนอได้':'โชว์ให้เพื่อนดูอย่างเดียว':'ยังไม่มีใครเห็นชิ้นนี้'}</p>
    <div className="actions">
      <button disabled={disabled || !!listing && !listing.purchase} onClick={()=>submit({type:'share',itemId:item.id,allow:true,purchase:false})}>โชว์ให้ดู</button>
      <button disabled={disabled || !maySell || !!listing?.purchase} onClick={()=>submit({type:'share',itemId:item.id,allow:true,purchase:true})}>ประกาศขาย</button>
      {listing && <button disabled={disabled} onClick={()=>submit({type:'share',itemId:item.id,allow:false,purchase:false})}>เก็บกลับ</button>}
    </div>
  </div>;
}
export function Contract({item,condition,setCondition,disabled,survival=false}:{item:ItemView;condition:boolean;setCondition:(value:boolean)=>void;disabled:boolean;survival?:boolean}) {
  const spec=STATUS_CATALOG.find(s=>s.id===item.condition.statusId)!;
  if(!item.condition.available) return <p>ร้านนี้รับเครดิตอย่างเดียวในช่วงนี้</p>;
  return <div className="contract">
    <label className="check"><input type="checkbox" checked={condition} onChange={e=>setCondition(e.target.checked)} disabled={disabled || item.condition.required}/><span>{item.condition.required?'ร้านนี้บังคับเงื่อนไข:':'รับเงื่อนไขเพื่อลดราคา:'} ลด {item.condition.discount} เครดิต แลก <StatusTerm passive id={spec.id} survival={survival}/></span></label>
    <p><Rich text={spec.description} survival={survival}/>{scoreStatusText(spec.id,survival)} · {readable(spec.duration)}</p>
  </div>;
}
type DeskStep='inspect'|'appraise'|'buy';
/** Start where the player left off: a judged item goes straight to buying. */
function openingStep(game:AppraisalView,item:ItemView):DeskStep {
  return item.appraisal!==null || game.self.caught?'buy':game.self.inspections<inspectionQuota(game)?'inspect':'appraise';
}
export function AppraisalDesk({game,item,submit,disabled}:Actions&{item:ItemView}) {
  const [value,setValue]=useState(String(item.knowledge.base??(item.knowledge.range?Math.round((item.knowledge.range[0]+item.knowledge.range[1])/2):item.price)));
  const [danger,setDanger]=useState(false);
  const [condition,setCondition]=useState(item.condition.required);
  const [buyBoth,setBuyBoth]=useState(false);
  const [deskStep,setDeskStep]=useState<DeskStep>(()=>openingStep(game,item));
  useEffect(()=>{if(item.appraisal!==null || game.self.caught) setDeskStep('buy');},[item.appraisal,game.self.caught]);
  useEffect(()=>{if(game.self.inspections>=inspectionQuota(game) && item.appraisal===null && !game.self.caught) setDeskStep(current=>current==='inspect'?'appraise':current);},[game.self.inspections,game.self.inventory]);
  const inputId=useId();const tabs=useId();
  const number=Number(value);
  const valid=value.trim()!=='' && Number.isSafeInteger(number) && number>=0 && number<=1000;
  const risk=valid?riskRange(game,item,number):null;
  const items=buyBoth?game.self.stock:[item];
  const useCondition=item.condition.required || condition && item.condition.available;
  const total=purchasePrice(game,items,useCondition);
  const canAct=!disabled && !game.self.eventOffer;
  const step=(delta:number)=>setValue(stepPrice(value,delta));
  const riskLevel=risk===null?'':risk[1]>=30?' high':risk[1]>=15?' medium':'';
  const left=Math.max(0,inspectionQuota(game)-game.self.inspections);
  const steps:Array<{id:DeskStep;label:string;meta:string}>=[
    {id:'inspect',label:'ตรวจ',meta:left?`เหลือ ${left} ครั้ง`:'ใช้สิทธิ์ครบ'},
    {id:'appraise',label:'ตีราคา',meta:item.appraisal===null?(game.self.caught?'ถูกจับผิดแล้ว':'ยังไม่ตีราคา'):`${item.appraisal} · ${item.appraisalAccepted?'ตกลง':'ปฏิเสธ'}`},
    {id:'buy',label:'ซื้อ',meta:`${item.price} เครดิต`},
  ];
  return <section className="desk" aria-label={`ประเมิน ${item.name}`}>
    <h2 className="desk-title">{item.name}</h2>
    <div className="relic-art"><img src={item.image} alt={item.name} width="1254" height="1254"/></div>
    <div className="desk-reading">
      {game.self.eventOffer && !disabled && <p className="blocked-note">ตอบเหตุการณ์ก่อน ปุ่มบนโต๊ะนี้จึงจะกดได้</p>}
      <ItemFacts item={item}/>
      {game.self.npcTrust && <p className="trust-note">ความไว้ใจ {NPC_SPECS[item.npc].name} {game.self.npcTrust[item.npc]??0}/{TRUST_CAP} · โอกาสยอมรับราคาต่ำกว่าปกติเพิ่ม {npcAcceptanceChance(game,item.npc)} จุดเปอร์เซ็นต์ · รวมผลของสะสมแล้ว · ความเสี่ยงจับผิดยังมีอยู่</p>}
      {game.self.npcTrust && <p className="commission-note">ของที่คุณประเมินขายได้: รับค่านายหน้า {commissionRate(playerPassives(game))}% ของราคาขายจริง (ปัดลง){playerPassives(game).saleFee?` + ค่าดำเนินการ ${playerPassives(game).saleFee} เครดิต`:''} และความไว้ใจ +{1+playerPassives(game).trust} ต่อชิ้น · รับครั้งเดียว ไม่ซ้ำเมื่อขายต่อ</p>}
      {game.passives && passiveSpec(item.kind) && <p className="trust-note">ถือแล้วได้ผลสะสม: {passiveSpec(item.kind)!.passive.text}</p>}
      <p className="item-effects">เมื่อเปิดใช้: <Rich text={item.possibleBenefit} survival={!!game.survival}/><br/>ความเสี่ยง: <Rich text={item.possibleDrawback} survival={!!game.survival}/>{ITEM_SPECS[item.kind].consumable?' · ใช้แล้วหมดไป':''}</p>
      {item.appraisal!==null && <p className={`verdict${item.appraisalAccepted?' accepted':' rejected'}`}>คุณเสนอ {item.appraisal} เครดิต · {item.appraisalAccepted?'NPC ยอมรับ':'NPC ปฏิเสธ'} · ต่อรองเหลือ {Math.max(0,game.self.counterLimit-game.self.counters)} ครั้ง</p>}
      <div className="desk-steps" role="tablist" aria-label="ขั้นตอนบนโต๊ะ">{steps.map((s,index)=><button key={s.id} type="button" role="tab" id={`${tabs}-${s.id}`} aria-controls={`${tabs}-${s.id}-panel`} aria-selected={deskStep===s.id} className={deskStep===s.id?'current':''} onClick={()=>setDeskStep(s.id)}>
        <span className="step-number" aria-hidden="true">{index+1}</span><span className="step-label">{s.label}<small>{s.meta}</small></span></button>)}</div>
      <div role="tabpanel" id={`${tabs}-inspect-panel`} aria-labelledby={`${tabs}-inspect`} hidden={deskStep!=='inspect'} className="step-panel">
        <Inspect game={game} item={item} submit={submit} disabled={disabled}/>
        <button type="button" className="step-next" onClick={()=>setDeskStep('appraise')}>พร้อมตีราคาแล้ว</button>
      </div>
      <div role="tabpanel" id={`${tabs}-appraise-panel`} aria-labelledby={`${tabs}-appraise`} hidden={deskStep!=='appraise'} className="step-panel">
      <form onSubmit={e=>{e.preventDefault();if(valid)submit({type:item.appraisal===null?'appraise':'counter',itemId:item.id,value:number,acceptDanger:danger});}}>
        <label htmlFor={inputId}>{item.appraisal===null?'ราคาที่คุณประเมิน':'ราคาที่คุณต่อรองใหม่'} (เครดิต)</label>
        <div className="price-entry"><div className="stepper"><button type="button" aria-label="ลดราคา 1 เครดิต" disabled={!canAct || valid && number<=0} onClick={()=>step(-1)}><MinusIcon/></button><input id={inputId} type="number" inputMode="numeric" min="0" max="1000" step="1" required value={value} onChange={e=>setValue(e.target.value)} disabled={!canAct}/><button type="button" aria-label="เพิ่มราคา 1 เครดิต" disabled={!canAct || valid && number>=1000} onClick={()=>step(1)}><PlusIcon/></button></div><button className="primary appraise" disabled={!canAct || !valid || game.self.energy<1 || game.self.caught || item.appraisal!==null && game.self.counters>=game.self.counterLimit || item.npc==='darkone' && !danger}><AppraiseIcon/>{item.appraisal===null?'ยืนยันการประเมิน':'ยื่นราคาต่อรอง'} · 1 พลัง</button></div>
        <p className={`risk${riskLevel}`}>{!valid?'ใส่จำนวนเต็ม 0–1000':risk?<>โอกาสถูกจับผิด <strong>{risk[0]===risk[1]?risk[0]:`${risk[0]}–${risk[1]}`}%</strong> จากข้อมูลที่คุณรู้</>:'ยังคำนวณโอกาสถูกจับผิดไม่ได้ · ตรวจราคาเพื่อหาเบาะแสมูลค่า'} · ถูกจับผิดอาจเสียเงินหรือของ{item.npc==='darkone'?' และถึงชีวิตตามสัญญา':''}</p>
        {item.npc==='darkone' && <label className="check danger-text"><input type="checkbox" checked={danger} onChange={e=>setDanger(e.target.checked)} disabled={!canAct}/><span>{game.survival?'ยอมรับสัญญา Dark One: หากถูกจับผิด อาจต้องสละของหรือชีวิตเป็น 0 เป็นผู้ชมจนจบ run ของและเครดิตยังรอ Collector':'ยอมรับสัญญา Dark One: หากถูกจับผิด อาจต้องสละของหรือตาย พักเฉพาะช่วงนี้และคะแนนช่วงนี้เป็น 0'}</span></label>}
        {game.self.caught && <p className="danger-text">พ่อค้าจับผิดแล้ว ไม่รับการประเมินหรือต่อรองเพิ่ม ยังซื้อในราคาที่แสดงได้</p>}
      </form>
      {item.appraisal===null && <button type="button" className="step-next" onClick={()=>setDeskStep('buy')}>ไม่ตีราคา ไปดูราคาหน้าร้าน</button>}
      </div>
      <div role="tabpanel" id={`${tabs}-buy-panel`} aria-labelledby={`${tabs}-buy`} hidden={deskStep!=='buy'} className="step-panel purchase">
        <h3>ราคาที่พ่อค้ายอมขาย {item.price} เครดิต</h3>
        {item.appraisalAccepted===false && <p>ใช้ราคาหน้าร้าน {item.ask} เครดิต เพราะพ่อค้าปฏิเสธราคาประเมิน</p>}
        <Contract item={item} condition={useCondition} setCondition={setCondition} disabled={!canAct} survival={!!game.survival}/>
        {game.self.stock.length===2 && <label className="check"><input type="checkbox" checked={buyBoth} onChange={e=>setBuyBoth(e.target.checked)} disabled={!canAct}/><span>ซื้อทั้งสองชิ้นในดีลเดียว</span></label>}
        <button className="primary buy" disabled={!canAct || game.self.credits<total || game.self.energy<purchaseEnergy(game)} onClick={()=>submit({type:'buy',itemIds:items.map(i=>i.id),condition:useCondition})}><BuyIcon/>ซื้อ{buyBoth?'ทั้งคู่':'เก็บไว้'} · {total} เครดิต · {purchaseEnergy(game)} พลัง</button>
      </div>
    </div>
  </section>;
}
const dangerChoices=new Set(['die','item','surrender']);
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
  const action=eventDecision(offer,choice,{itemId,statusId:effectiveStatus,fact:effectiveFact,guess});
  const catalog=eventCatalog(offer);const survival=!!game.survival;const consequence=isConsequence(offer.id);
  const visible=[...game.self.stock,...game.self.inventory,...game.listings.map(l=>l.item)];
  const priced=offer.id==='E44' || bondOf(offer)?.mode==='sell';
  const title=(c:string)=>portalChoiceTitle(game,offer,c)??choiceTitle(offer,c,survival);
  const portalEvent=game.phase==='PORTALS' && ['E01','E08','E10'].includes(offer.id);
  // E01/E10 decline closes the same door as switch; show that outcome once.
  const choices=portalEvent && offer.id!=='E08'?offer.choices.filter(c=>c!=='decline'):offer.choices;
  return <section className={`event-offer${consequence?' consequence':''}${portalEvent?' portal-event':''}`} aria-labelledby={`event-${offer.id}`}>
    <h2 id={`event-${offer.id}`}><EventIcon/>{catalog.name}</h2>
    <PortalEventPreview game={game} offer={offer} choice={choice}/>
    <div className="event-copy">
      <p className="event-say">{survival && offer.id==='E50'?'คุณผิดสัญญา Dark One สละของหนึ่งชิ้นเพื่อรอด หรือชีวิตเป็น 0 แล้วเป็นผู้ชมจนจบ run ของและเครดิตที่เหลือยังรอ Collector':<Rich text={catalog.description} survival={survival}/>}</p>
      {offer.giveItemId && <p className="event-give">พ่อค้าขอ <ItemTerm kind={offer.targetKinds[offer.giveItemId]!} item={visible.find(i=>i.id===offer.giveItemId)}/> จากคลังของคุณ</p>}
      {offer.id==='E08' && <dl className="portal-contracts">{game.self.portals.slice(0,2).map((portal,index)=>{
        const npc=NPC_SPECS[portal.npc];const status=STATUS_CATALOG.find(s=>s.id===npc.condition)!;
        const available=npc.condition!=='D04' || (game.encounterCount===null || game.encounter<game.encounterCount);
        return <div key={portal.id}><dt>{index===0?'เลือกเครดิต':'เลือกเงื่อนไข'} · <NpcTerm npc={portal.npc}/></dt><dd>{index===0?'จ่ายเครดิตอย่างเดียว ไม่มีส่วนลด':<>ลด {npc.discount} เครดิตต่อการซื้อ · ต้องรับ <StatusTerm id={status.id} survival={survival}/><p>{readable(status.description)}{scoreStatusText(status.id,survival)} · {readable(status.duration)}</p>{!available && <p className="danger-text">ช่วงสุดท้ายรับเงื่อนไขนี้ไม่ได้ ร้านนี้จะซื้อไม่ได้ เลือกร้านรับเครดิตหรือไม่รับแทน</p>}</>}</dd><dd>อาจมี <ItemTerm kind={portal.hint}/> มาขาย</dd></div>;
      })}</dl>}
    </div>
    <form className="event-form" onSubmit={e=>{e.preventDefault();if(action)submit(action);}}>
      <ChoiceCards legend="คุณจะเลือกทางไหน" value={choice} onChange={setChoice} disabled={disabled} options={choices.map(c=>({value:c,title:title(c),
        detail:<Rich passive survival={survival} text={`${eventCost(game,offer,c,itemId)}${eventScoreText(game,offer,c,effectiveStatus)}`}/>,
        tone:c==='decline'?'quiet':consequence && dangerChoices.has(c)?'danger':undefined}))}/>
      {eventNeedsItem(offer,choice) && <ChoiceCards legend={offer.giveItemId?'เลือกของในร้านที่จะได้':'เลือกสินค้า'} value={itemId} onChange={setItemId} disabled={disabled} options={offer.itemIds.map((id,index)=>{
        const seen=visible.find(i=>i.id===id);const kind=offer.targetKinds[id];
        return {value:id,title:eventItemName(offer,id),...(kind?{art:itemImage(kind)}:{}),
          detail:priced?`รับ ${offer.quotedPrices[id]} เครดิต`:seen?(seen.owner===game.self.id?inventoryLabel(game,seen):`ราคาร้าน ${seen.price} เครดิต`):`รายการ ${index+1}`};
      })}/>}
      {eventNeedsStatus(offer,choice) && <ChoiceCards compact legend="เลือกสถานะ" value={effectiveStatus} onChange={setStatusId} disabled={disabled} options={statusOptions.map(id=>({value:id,title:<><span className={id.startsWith('D')?'danger-text':'positive-text'}>{id.startsWith('D')?<DebuffIcon/>:<BuffIcon/>}</span>{statusName(id)}</>}))}/>}
      {offer.id==='E45' && choice!=='decline' && <ChoiceCards compact legend="ผลตรวจที่จะเปิดให้ทุกคน" value={effectiveFact} onChange={setFact} disabled={disabled} options={facts.map(f=>{const v=offer.facts[itemId]?.[f];return {value:f,title:`${factName[f]}: ${typeof v==='boolean'?v?'ใช่':'ไม่ใช่':String(v)}`};})}/>}
      {offer.id==='E46' && choice!=='decline' && <ChoiceCards compact legend="คุณทายว่า" value={String(guess)} onChange={v=>setGuess(v==='true')} disabled={disabled} options={[{value:'true',title:'ของแท้'},{value:'false',title:'ของปลอม'}]}/>}
      <button className={consequence?'danger':'primary'} disabled={disabled || !action}>ยืนยัน: {title(choice)}</button>
    </form>
  </section>;
}
export function DarkMarket({game,submit,disabled,compact=false}:Actions&{compact?:boolean}) {
  const lots=game.market.lots??[];const [expanded,setExpanded]=useState(false);
  const sellable=game.self.inventory.filter(item=>marketOptions(game,item).length>0).length;
  if(compact && !expanded) return <aside className={`dark-market compact${game.market.open || lots.length?' open':' closed'}`} aria-labelledby="market-title">
    <h2 id="market-title"><MarketIcon/>Dark Market</h2>
    <p className="market-lede">{!game.market.open && !lots.length?'ปิดในช่วงนี้':[game.market.open?`รับซื้อ ${game.market.orders.length} รายการ`:'',sellable?`คุณขายได้ ${sellable} ชิ้น`:'',lots.length?`ประมูล ${lots.length} ชิ้น`:''].filter(Boolean).join(' · ')}</p>
    {(game.market.open || lots.length>0) && <button type="button" className="market-toggle" onClick={()=>setExpanded(true)}>ดูรายการ</button>}
  </aside>;
  return <aside className={`dark-market${game.market.open || lots.length?' open':' closed'}`} aria-labelledby="market-title">
    <h2 id="market-title"><MarketIcon/>Dark Market</h2>
    {!game.market.open?<p className="market-closed">ตลาดเงาปิดในช่วงนี้ เก็บของไว้ลุ้นรายการรับซื้อในช่วงถัดไป</p>:<>
      <p className="market-lede">รับซื้อถึงจบช่วงพบพ่อค้านี้ ซื้อของใหม่แล้วนำมาขายได้ · ป้ายเป็นราคาฐาน ปุ่มขายรวมผลของสะสม</p>
      <ul className="wanted">{game.market.orders.map(order=>{
        const quota=order.quota[game.self.id]??0;
        const owned=game.self.inventory.filter(item=>marketOptions(game,item).some(o=>o.id===order.id));
        return <li key={order.id}><img src={itemImage(order.kind)} alt="" width="1254" height="1254" loading="lazy"/><div><h3><ItemTerm kind={order.kind}/></h3><p className="order-quote">รับซื้อ <strong><CoinIcon/>{order.price} เครดิต</strong> · สิทธิ์คุณ {quota} ชิ้น</p>{order.contract && <div className="market-contract"><p><strong>ต้องการ: {marketRequirements(order.contract)}</strong></p><p className="positive-text">ตรงเงื่อนไข: {order.price} เครดิต + <Rich text={marketBonus(order.contract)} survival={!!game.survival}/></p><p className="danger-text">ไม่ตรง: ลด 20% เหลือ {Math.floor(order.price*80/100)} เครดิต หรือ <Rich text={marketCost(order.contract)} survival={!!game.survival}/> เพื่อรับราคาเต็ม {order.price} เครดิต · ไม่ได้โบนัส</p></div>}
          {quota===0?<p>ใช้สิทธิ์รายการนี้แล้ว</p>:owned.length?owned.map(item=><div key={item.id} className="market-held"><p><strong>{inventoryLabel(game,item)}</strong></p><ItemFacts item={item}/><MarketSale game={game} item={item} order={order} submit={submit} disabled={disabled || !!game.self.eventOffer && isConsequence(game.self.eventOffer.id)}/></div>):<p>ยังไม่มีของที่ขายได้ในรายการนี้</p>}
        </div></li>;
      })}</ul>
      <p className="supporting">ขายแล้วโอนของทันที · ของที่ติดครอบครองอัปมงคลต้องปลดล็อกก่อน{game.brokerage?' · ของที่ขายเข้าคลังและอาจถูกนำมาประมูลภายหลัง':''}</p>
    </>}
    {lots.length>0 && <Auction game={game} submit={submit} disabled={disabled}/>}
  </aside>;
}
function AuctionLot({game,lot,submit,disabled}:Actions&{lot:NonNullable<AppraisalView['market']['lots']>[number]}) {
  const [bid,setBid]=useState(String(lot.yourBid??lot.minimum));const id=useId();
  const amount=Number(bid);const valid=bid.trim()!=='' && Number.isSafeInteger(amount) && amount>=lot.minimum && amount<=Math.min(1000,game.self.credits);
  const settled=lot.winnerId!==undefined;
  return <li><img src={lot.item.image} alt="" width="1254" height="1254" loading="lazy"/><div><h3><ItemTerm kind={lot.item.kind} item={lot.item}/></h3><p className="order-quote">ขั้นต่ำ <strong><CoinIcon/>{lot.minimum} เครดิต</strong> · ซองประมูล {lot.bidCount} ซอง</p><ItemFacts item={lot.item}/>
    {settled?<p>{lot.winnerId===null?'ไม่มีผู้ชนะ ของกลับเข้าคลัง':lot.winnerId===game.self.id?`คุณชนะประมูล จ่าย ${lot.price} เครดิต`:`มีผู้ชนะประมูลที่ ${lot.price} เครดิต`}</p>:
    <form onSubmit={e=>{e.preventDefault();if(valid)submit({type:'bid',lotId:lot.id,credits:amount});}}>
      <label htmlFor={id}>ราคาประมูลแบบปิดซอง (เครดิต)</label><input id={id} type="number" min={lot.minimum} max="1000" step="1" value={bid} onChange={e=>setBid(e.target.value)} disabled={disabled}/>
      <p>{lot.yourBid!==null?`ซองของคุณ ${lot.yourBid} เครดิต · แก้ได้จนจบช่วง`:'ยังไม่ได้ยื่นซอง'} · จ่ายเมื่อชนะตอนคิดผลช่วง</p>
      <div className="actions"><button disabled={disabled || !valid}>{lot.yourBid!==null?'แก้ซองประมูล':'ยื่นซองประมูล'}</button>{lot.yourBid!==null && <button type="button" disabled={disabled} onClick={()=>submit({type:'bid',lotId:lot.id,credits:0})}>ถอนซอง</button>}</div>
    </form>}
  </div></li>;
}
function Auction({game,submit,disabled}:Actions) {
  return <section className="auction" aria-labelledby="auction-title"><h3 id="auction-title">ประมูลของจากคลังตลาดเงา</h3>
    <p className="market-lede">ไม่ได้เปิดทุกช่วง ราคาสูงสุดที่ยังจ่ายไหวชนะเมื่อคิดผลช่วง ราคาเท่ากันตัดสินด้วยเส้นทาง ไม่เห็นซองของคนอื่น</p>
    <ul className="wanted">{game.market.lots!.map(lot=><AuctionLot key={lot.id} game={game} lot={lot} submit={submit} disabled={disabled}/>)}</ul></section>;
}
/** Brokerage duty: an appraised item nobody bought must be bought, penalised or consigned before the encounter settles. */
export function Unsold({game,submit,disabled}:Actions) {
  const items=unsoldItems(game);if(!items.length) return null;
  const blocked=disabled || !!game.self.eventOffer;
  return <section className="unsold" aria-labelledby="unsold-title"><h2 id="unsold-title">ของที่คุณประเมินแล้วยังขายไม่ได้ <span>{items.length} ชิ้น</span></h2>
    <p>พ่อค้าเชื่อราคาของคุณ ถ้าไม่มีใครซื้อ คุณต้องรับผิดชอบ จบช่วงต่อรองแล้วชิ้นที่ค้างจะรับบทลงโทษจากพ่อค้าโดยอัตโนมัติ{game.phase==='APPRAISAL'?' ยังเปิดให้ผู้เล่นอื่นซื้อในช่วงต่อรองได้':''}</p>
    <ul>{items.map(item=>{const price=purchasePrice(game,[item],game.self.dealMode==='condition');return <li key={item.id}><h3><ItemTerm kind={item.kind} item={item}/> · คุณประเมินไว้ {item.appraisal} เครดิต</h3>
      <div className="actions">
        <button disabled={blocked || game.self.credits<price || game.self.energy<purchaseEnergy(game)} onClick={()=>submit({type:'unsold',itemId:item.id,choice:'buy'})}><BuyIcon/>ซื้อเอง · {price} เครดิต · {purchaseEnergy(game)} พลัง</button>
        <button disabled={blocked} onClick={()=>submit({type:'unsold',itemId:item.id,choice:'penalty'})}>รับโทษจากพ่อค้า</button>
        <button disabled={blocked} onClick={()=>submit({type:'unsold',itemId:item.id,choice:'consign'})}><MarketIcon/>ส่งต่อ Dark Market</button>
      </div>
      <p className="danger-text">ถ้ารับโทษ: <Rich text={unsoldPenaltyText(item)} survival={!!game.survival}/></p><p>ถ้าส่งต่อ: {consignText}</p></li>;})}</ul>
  </section>;
}
export function Inventory({game,submit,disabled,drawer=false}:Actions&{drawer?:boolean}) {
  const [selected,setSelected]=useState<string|null>(null);
  const item=game.self.inventory.find(i=>i.id===selected);
  const playing=['APPRAISAL','TRADE'].includes(game.phase);
  const heading=<h2 id="inventory-title">ของที่คุณเก็บไว้ <span>{game.self.inventory.length} ชิ้น</span></h2>;
  const Shell=drawer?'details':'section';
  return <Shell className={`inventory${drawer?' drawer':''}`} aria-labelledby="inventory-title">
    {drawer?<summary>{heading}</summary>:heading}
    {!game.self.inventory.length?<p>คลังยังว่าง ซื้อจากพ่อค้าหรือแลกกับเพื่อนเพื่อเริ่มสะสม</p>:<ul className="inventory-row">{game.self.inventory.map(i=><li key={i.id}><button className={`item-thumb ${i.id===selected?'selected':''}`} aria-pressed={i.id===selected} onClick={()=>setSelected(i.id===selected?null:i.id)}><Peek passive tone="item" label={<><img src={i.image} alt="" width="1254" height="1254" loading="lazy"/><span className="thumb-label">{inventoryLabel(game,i)}</span></>} card={<ItemCard kind={i.kind} item={i}/>}/>{i.lockedUntil!==null && <span className="thumb-label">ล็อกถึงจบช่วง {i.lockedUntil}</span>}</button></li>)}</ul>}
    {item && <div className="inventory-detail"><h3>{item.name}</h3><ItemFacts item={item}/>{game.passives && passiveSpec(item.kind) && <p className="trust-note">ขณะถือ · สะสมได้: {passiveSpec(item.kind)!.passive.text}</p>}<p>ผลที่เป็นไปได้: <Rich text={item.possibleBenefit} survival={!!game.survival}/> · <Rich text={item.possibleDrawback} survival={!!game.survival}/></p>
      {item.lockedUntil!==null && <p><StatusTerm id="D09" survival={!!game.survival}/>: ขายหรือแลกไม่ได้จนจบช่วง {item.lockedUntil} ยังเปิดใช้ได้</p>}
      {playing && <><Inspect game={game} item={item} submit={submit} disabled={disabled}/>
        <p>{ITEM_SPECS[item.kind].consumable?'ใช้แล้วหมดไป':'เปิดใช้ได้ช่วงละครั้ง'} · ถ้ายังไม่รู้ว่าแท้หรือมีคำสาป อาจโดนผลเสีย</p>
        <button disabled={disabled || !!game.self.eventOffer || game.self.energy<1 || game.self.activated.includes(item.id)} onClick={()=>submit({type:'activate',itemId:item.id})}>เปิดใช้ {item.name} · 1 พลัง</button>
        <Share game={game} item={item} submit={submit} disabled={disabled}/></>}
    </div>}
  </Shell>;
}
export function Statuses({game}:{game:AppraisalView}) {
  const dead=!!game.survival && game.self.life===0;
  return <section className="statuses" aria-labelledby="status-title"><h2 id="status-title">ผลติดตัว <span>{game.self.statuses.length} อย่าง</span></h2>
    {!game.self.statuses.length?<p>ยังไม่มีผลดีหรือผลเสียติดตัว</p>:<ul className="status-badges">{game.self.statuses.map(s=><li key={s.id} className={s.id.startsWith('D')?'debuff':'buff'}>
      <StatusTerm id={s.id} survival={!!game.survival}/>
      <span className="status-meta">{dead?'เก็บไว้ให้ Collector · ไม่เดินอายุต่อหลังตาย':`${s.starts>game.encounter?`เริ่มช่วง ${s.starts} · `:''}เหลือ ${s.charges} ครั้ง · ถึงจบช่วง ${s.expires}${s.targetItemId?' · ผูกกับของหนึ่งชิ้น':''}`}</span>
    </li>)}</ul>}
    {game.self.statuses.length>0 && <p className="supporting">ชี้หรือแตะชื่อเพื่อดูผล</p>}
  </section>;
}
export function TradeListing({game,listing,room,submit,disabled}:Actions&{listing:AppraisalView['listings'][number];room:AppraisalRoomView}) {
  const [credits,setCredits]=useState('0');const [swap,setSwap]=useState('');
  const [condition,setCondition]=useState(listing.item.condition.required);
  const id=useId();const item=listing.item;
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
      {source==='inventory'?<ChoiceCards legend="แลกของเพิ่ม (ไม่บังคับ)" value={swap} onChange={setSwap} disabled={disabled} options={[{value:'',title:'ไม่แลกของ',tone:'quiet'},...game.self.inventory.filter(i=>i.lockedUntil===null).map(i=>({value:i.id,title:i.name,art:i.image,detail:inventoryLabel(game,i)}))]}/>:<Contract item={item} condition={useCondition} setCondition={setCondition} disabled={disabled} survival={!!game.survival}/>}
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
    <h3>ข้อเสนอซื้อขายของคุณ</h3>{!game.trades.length?<p>ยังไม่มีข้อเสนอ</p>:<ul className="offers">{game.trades.map(t=><li key={t.id}><p><strong>{t.item.name}</strong> · {name(t.buyerId)} เสนอ {t.credits} เครดิต{t.source==='npc'?' เป็นค่าแนะนำ นอกเหนือจากราคาพ่อค้า':''}{t.swapItem?` + แลก ${t.swapItem.name}`:''} ให้ {name(t.sellerId)}</p>{t.swapItem && <div className="swap-details"><h3>ของแลกจาก {name(t.buyerId)}: {t.swapItem.name}</h3><img src={t.swapItem.image} width="1254" height="1254" alt={t.swapItem.name}/><ItemFacts item={t.swapItem}/><p>ผลที่เป็นไปได้: <Rich text={t.swapItem.possibleBenefit} survival={!!game.survival}/> · <Rich text={t.swapItem.possibleDrawback} survival={!!game.survival}/></p></div>}<p>{t.condition?'ผู้ซื้อยอมรับเงื่อนไข NPC · ':''}{t.status==='open'?'รอผู้ขายตอบรับ':t.status==='accepted'?'ตกลงและโอนสำเร็จแล้ว':'ปฏิเสธหรือหมดอายุแล้ว'}</p>{t.sellerId===game.self.id && t.status==='open' && <div className="actions"><button className="primary" disabled={disabled || !!game.self.eventOffer && isConsequence(game.self.eventOffer.id)} onClick={()=>submit({type:'respond',offerId:t.id,accept:true})}>ตกลงและโอนทันที</button><button disabled={disabled || !!game.self.eventOffer && isConsequence(game.self.eventOffer.id)} onClick={()=>submit({type:'respond',offerId:t.id,accept:false})}>ปฏิเสธ</button></div>}</li>)}</ul>}
  </section>;
}
