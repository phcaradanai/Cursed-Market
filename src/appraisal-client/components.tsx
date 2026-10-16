import { marketBonus, marketCost, marketRequirements, MarketSale } from './MarketSale.js';
import { PortalEventPreview, portalChoiceTitle } from './PortalEventPreview.js';
import { commissionRate, passiveSpec } from '../game/appraisal/passives.js';
import { loanItemCount } from './model.js';
import { freeInspectionRemaining, inspectionQuota, npcAcceptanceChance, playerPassives } from './model.js';
import { CHALLENGE_PCT, challengeDiscount, challengePenalty, winPct } from '../game/appraisal/challenge-rules.js';
import type { ClaimKey } from '../game/appraisal/challenge-rules.js';
import { WISH_CAP, WISH_FLOOR } from '../game/appraisal/wishlist-rules.js';
import { CLEANSE_CAP, CLEANSE_TOOLS, CLEANSE_TRUST_CHANCE, CLEANSE_TRUST_PRICE } from '../game/appraisal/cleanse-rules.js';
import { TRUST_CAP } from '../game/appraisal/market-contracts.js';
import { TRUST_RULES } from '../game/appraisal/pulse.js';
import { Provenance, SealBadge } from './meters.js';
import { useEffect, useId, useState } from 'react';
import { ITEM_SPECS, itemImage, NPC_SPECS } from '../game/appraisal/content.js';
import type { AppraisalView, EventOffer, ItemView } from '../game/appraisal/types.js';
import type { AppraisalRoomView } from '../shared/appraisal-protocol.js';
import { possibleBenefitText, possibleDrawbackText, salePctText, activationBlock, activationOutcome, choiceTitle, effectsInspectionLabel, effectsKnownFor, eventCatalog, eventItemUsable, eventNeeds, inspectionBlock, itemScoreRange, needShort, purchaseBlock, eventCost, eventDecision, eventFacts, eventItemName, eventNeedsItem, eventNeedsStatus, eventStatusOptions, factLabel, hasStatus, inspectionCost, inventoryLabel, marketOptions, purchaseEnergy, purchasePrice, readable, riskRange, stepPrice, scoreStatusText, eventScoreText, statusName, isConsequence, bondOf, unsoldItems, unsoldPenaltyText, consignText } from './model.js';
import type { Decision } from './model.js';
import { ChoiceCards, ItemCard, ItemTerm, NpcTerm, Peek, Rich, StatusTerm } from './lore.js';
import { AppraiseIcon, BuffIcon, BuyIcon, CoinIcon, DebuffIcon, EventIcon, InspectIcon, MarketIcon, MinusIcon, PlusIcon, RebateIcon, TicketIcon } from './icons.js';
import { t } from './i18n.js';
import { tip, useLock } from './reasons.js';
import { itemName, npcName, passiveText, statusDescription, statusDuration, toolText } from './catalog-text.js';

/** Challenge claim text in the active language. */
const claimText=(key:ClaimKey,value:boolean)=>key==='genuine'?(value?t('เป็นของแท้'):t('เป็นของปลอม')):(value?t('มีคำสาป'):t('ไม่มีคำสาป'));

export interface Actions { game:AppraisalView; submit:(action:Decision)=>void; disabled:boolean }
export function ItemFacts({item}:{item:ItemView}) {
  const k=item.knowledge;const score=itemScoreRange(k);
  return <dl className="facts">
    <div className={k.base===undefined?'unknown':''}><dt>{t('มูลค่าจริง')}</dt><dd>{k.base!==undefined?t('{n} เครดิต',{n:k.base}):k.range?t('ยังไม่รู้ · เบาะแส {a}–{b}',{a:k.range[0],b:k.range[1]}):t('ยังไม่รู้ · ใช้ตรวจราคาเพื่อหาเบาะแส')}</dd></div>
    <div className={k.genuine===undefined?'unknown':''}><dt>{t('ความแท้')}</dt><dd>{k.genuine===undefined?t('ยังไม่ตรวจ'):k.genuine?t('ของแท้'):t('ของปลอม')}</dd></div>
    <div className={k.cursed===undefined?'unknown':''}><dt>{t('คำสาป')}</dt><dd>{k.cursed===undefined?t('ยังไม่ทราบ'):k.cursed?t('มีคำสาป'):t('ไม่มีคำสาป')}</dd></div>
    {item.certificate && <div className={k.certificate===undefined?'unknown':''}><dt>{t('ใบรับรองพ่อค้า')}</dt><dd>{k.certificate===undefined?t('มีใบรับรอง · ยังไม่ตรวจ'):k.certificate?t('ตรวจแล้วตรงความจริง'):t('ตรวจแล้วเป็นเท็จ')}</dd></div>}
    <div className={k.genuine===undefined && k.cursed===undefined?'unknown':''}><dt>{t('ผลเมื่อเปิดใช้')}</dt><dd>{activationOutcome(k)}</dd></div>
    {score && <div><dt>{t('มูลค่าตอนคิดคะแนน')}</dt><dd>{t('{a} เครดิต · ของปลอมเหลือ 25% · คำสาปลดอีก 25%',{a:score[0]===score[1]?score[0]:`${score[0]}–${score[1]}`})}</dd></div>}
    {k.comparison && <div><dt>{t('ผลเทียบราคา')}</dt><dd>{k.comparison===item.id?t('ชิ้นนี้มูลค่าไม่น้อยกว่าอีกชิ้น'):t('อีกชิ้นมูลค่าสูงกว่า')}</dd></div>}
  </dl>;
}
/** Public appraisal history is distinct from private knowledge of the item's real value. */
function AppraisalPrice({item}:{item:ItemView}) {
  if(item.appraisal===null)return null;
  return <dl className="facts">
    <div><dt>{t('ราคาประเมินล่าสุด')}</dt><dd>{t('{n} เครดิต',{n:item.appraisal})}</dd></div>
    {item.owner.startsWith('npc:') && <div><dt>{t('ราคาขายของพ่อค้า')}</dt><dd>{t('{n} เครดิต',{n:item.price})}{item.appraisalAccepted===false && <p className="supporting">{t('พ่อค้าไม่รับราคาประเมิน ใช้ราคาหน้าร้าน')}</p>}</dd></div>}
  </dl>;
}
export function Inspect({game,item,submit,disabled}:Actions&{item:ItemView}) {
  const locked=useLock();
  const price=inspectionCost(game,'price'),auth=inspectionCost(game,'authenticity'),effects=inspectionCost(game,'effects');
  const quiet=disabled;const lock=inspectionBlock(game,quiet);
  const blocked=disabled || !!lock;
  const effectsLabel=effectsInspectionLabel(game);
  const effectsDone=effectsKnownFor(game,item.knowledge);
  const short=(cost:number)=>blocked?null:game.self.energy<cost?t('พลังไม่พอ ต้องใช้ {need} มี {have}',{need:cost,have:game.self.energy}):null;
  const notes=[lock,short(price)&&`${t('ตรวจราคา')}: ${short(price)}`,short(auth)&&`${t('ตรวจความแท้')}: ${short(auth)}`,short(effects)&&`${effectsLabel}: ${short(effects)}`].filter(Boolean);
  const inspectWhy=(cost:number,known:boolean,knownText:string)=>tip(known&&knownText,disabled&&locked,lock,short(cost));
  return <div className="inspection">
    <p>{t('ตรวจได้อีก {n} ครั้งในช่วงนี้ · ราคา {price} / ความแท้ {auth} / {kind} {effects} พลัง{fog}',{n:Math.max(0,inspectionQuota(game)-game.self.inspections),price,auth,kind:game.curseSight?t('คำสาป'):t('ผลสินค้า'),effects,fog:hasStatus(game,'D02')?t(' · หมอกราคาบังมูลค่าจริงอยู่'):''})}</p>
    {game.curseSight && <p className="supporting">{t('ตรวจคำสาปเปิดว่าสินค้ามีคำสาปหรือไม่ ความแท้กับคำสาปเป็นคนละเรื่อง ของแท้อาจมีคำสาป และของปลอมอาจไม่มี')}</p>}
    {(['price','authenticity','effects'] as const).some(p=>freeInspectionRemaining(game,p)>0) && <p className="positive-text">{t('สิทธิ์ฟรีที่เหลือช่วงนี้: ราคา {price} · ความแท้ {auth} · {kind} {effects}',{price:freeInspectionRemaining(game,'price'),auth:freeInspectionRemaining(game,'authenticity'),kind:game.curseSight?t('คำสาป'):t('ผลสินค้า'),effects:freeInspectionRemaining(game,'effects')})}</p>}
    <div className="actions">
      <button className="inspect" disabled={blocked || game.self.energy<price || item.knowledge.base!==undefined} title={inspectWhy(price,item.knowledge.base!==undefined,t('รู้มูลค่าจริงของชิ้นนี้แล้ว'))} onClick={()=>submit({type:'inspect',itemId:item.id,property:'price'})}><InspectIcon/>{t('ตรวจราคา')}{item.knowledge.base!==undefined?t(' · รู้แล้ว'):price===0?t(' · ฟรี'):''}</button>
      <button className="inspect" disabled={blocked || game.self.energy<auth || item.knowledge.genuine!==undefined} title={inspectWhy(auth,item.knowledge.genuine!==undefined,t('รู้ความแท้ของชิ้นนี้แล้ว'))} onClick={()=>submit({type:'inspect',itemId:item.id,property:'authenticity'})}><InspectIcon/>{t('ตรวจความแท้')}{item.knowledge.genuine!==undefined?t(' · รู้แล้ว'):auth===0?t(' · ฟรี'):''}</button>
      <button className="inspect" disabled={blocked || game.self.energy<effects || effectsDone} title={inspectWhy(effects,effectsDone,t('ตรวจผลของชิ้นนี้ไปแล้ว'))} onClick={()=>submit({type:'inspect',itemId:item.id,property:'effects'})}><InspectIcon/>{effectsLabel}{effectsDone?t(' · รู้แล้ว'):effects===0?t(' · ฟรี'):''}</button>
    </div>
    {notes.length>0 && <p className="why" role="status">{notes.join(' · ')}</p>}
  </div>;
}
/** Merchant offer: pay credits to try to lift a curse. Odds are shown up front and never reach 100%. */
export function CleanseDeal({game,submit,disabled}:Actions) {
  const locked=useLock();
  const offer=game.self.cleanseOffer;const stones=game.self.inventory.filter(i=>i.kind==='whetstone');
  const [stoneId,setStoneId]=useState('');
  if(!offer || !game.cleanse) return null;
  const stone=stones.find(i=>i.id===stoneId);
  const trust=game.self.npcTrust?.[offer.npc]??0;
  const quiet=disabled;
  return <details className="cleanse-deal"><summary>{t('{npc}รับล้างคำสาป',{npc:npcName(offer.npc)})} <span>{t('{n} ชิ้น',{n:offer.items.length})}</span></summary>
    <p>{t('จ่ายเครดิตแลกโอกาสล้างคำสาปของสินค้าที่คุณถือ ราคาตั้งต้นครึ่งหนึ่งของราคาอ้างอิงชนิดนั้น แล้วสุ่มตามนิสัยพ่อค้า ความไว้ใจ {trust} ลดราคา {price}% และเพิ่มโอกาส {chance} จุดเปอร์เซ็นต์ · จ่ายแล้วไม่คืนแม้ล้างไม่สำเร็จ ไม่เสียพลัง ช่วงละครั้งต่อชิ้น สำเร็จได้สูงสุด {cap}%',{trust,price:trust*CLEANSE_TRUST_PRICE,chance:trust*CLEANSE_TRUST_CHANCE,cap:CLEANSE_CAP})}</p>
    <p className="supporting">{toolText('smith-hammer',CLEANSE_TOOLS['smith-hammer'].text)} · {toolText('whetstone',CLEANSE_TOOLS.whetstone.text)}</p>
    {stones.length>0 && <ChoiceCards compact legend={t('หินขัดสำหรับล้างครั้งนี้')} value={stone?.id??''} onChange={setStoneId} disabled={disabled} options={[{value:'',title:t('ไม่ใช้หินขัด'),tone:'quiet'},...stones.map(i=>({value:i.id,title:itemName(i.kind),art:i.image,detail:t('+{n} จุดเปอร์เซ็นต์ · ใช้แล้วหมด',{n:offer.stoneBonus})}))]}/>}
    <ul>{offer.items.map(row=>{
      const item=game.self.inventory.find(i=>i.id===row.itemId);if(!item) return null;
      const usable=stone && stone.id!==item.id;const chance=Math.min(CLEANSE_CAP,row.chance+(usable?offer.stoneBonus:0));
      const why=quiet?null:game.self.eventOffer?t('ตอบเหตุการณ์ก่อน'):row.done?t('ล้างชิ้นนี้ไปแล้วในช่วงนี้'):item.knowledge.cursed===false?t('รู้แล้วว่าไม่มีคำสาป'):needShort(game,{credits:row.price,energy:0});
      return <li key={row.itemId}><h3><ItemTerm kind={item.kind} item={item}/> · {inventoryLabel(game,item)}</h3><p>{item.knowledge.cursed===undefined?t('ยังไม่รู้ว่ามีคำสาปไหม'):item.knowledge.cursed?t('มีคำสาป'):t('ไม่มีคำสาป')} · {t('ราคา')} <strong>{t('{n} เครดิต',{n:row.price})}</strong> · {t('โอกาสสำเร็จ')} <strong>{chance}%</strong>{usable?t(' (รวมหินขัด)'):''}</p>
        <div className="actions"><button disabled={disabled || !!why} title={tip(disabled&&locked,why)} onClick={()=>submit({type:'cleanse',itemId:row.itemId,...(usable?{stoneId:stone!.id}:{})})}>{t('ล้างคำสาป · {n} เครดิต',{n:row.price})}</button></div>
        {why && <p className="why" role="status">{why}</p>}</li>;})}</ul>
    <p className="supporting">{t('ถ้าสินค้าไม่มีคำสาป พ่อค้าจะบอกว่าไม่พบ และยังคิดค่าบริการ')}</p>
  </details>;
}
/** Open wishes, what each is worth now, and the control to ask this merchant for a new one. */
function WishBook({game,submit,disabled}:Actions) {
  const locked=useLock();
  const desk=game.self.wishDesk;const [replace,setReplace]=useState('');
  if(!desk || !game.wishContract) return null;
  const pick=desk.replaceable.includes(replace as never)?replace:desk.replaceable[0]??'';
  const why=disabled?null:game.self.eventOffer?t('ตอบเหตุการณ์ก่อน'):needShort(game,{credits:0,energy:desk.cost});
  return <div className="wish-book"><h4>{t('สัญญาตามหาของ {n}/{cap}',{n:desk.book.length,cap:desk.cap})}</h4>
    <p className="supporting">{t('ทำสัญญาใหม่ทุกครั้งเสียพลัง {cost} มีได้พร้อมกันสูงสุด {cap} รายการ ทำซ้ำกับพ่อค้าเดิมหรือเลือกแทนรายการเก่าได้ ราคารับซื้อลดลงทุกช่วงแต่ไม่ต่ำกว่าราคาฐานของสินค้า ผลเสียที่ติดตัวไม่ทำให้ราคาฐานต่ำลง',{cost:desk.cost,cap:desk.cap})}</p>
    {desk.book.length>0 && <ul>{desk.book.map(row=><li key={row.npc}><strong>{npcName(row.npc)}</strong> {t('ตามหา')} <ItemTerm kind={row.kind}/> · {t('ตอนนี้')} <strong>{t('{n} เครดิต',{n:row.price})}</strong>{row.price>row.floor?t(' · ช่วงหน้า {n}',{n:row.next}):t(' · ถึงราคาฐานแล้ว')} · {t('ฐาน {n}',{n:row.floor})} · {t('เริ่มที่ {n}',{n:row.initial})}{row.npc===desk.npc?t(' · พ่อค้าที่อยู่ตรงนี้'):''}</li>)}</ul>}
    {desk.replaceable.length>0 && <ChoiceCards compact legend={t('สัญญาเต็มแล้ว เลือกรายการเก่าที่จะแทน')} value={pick} onChange={setReplace} disabled={disabled} options={desk.replaceable.map(n=>({value:n,title:t('แทนคำขอของ {name}',{name:npcName(n)}),detail:desk.book.find(r=>r.npc===n)?t('{item} · {n} เครดิต',{item:itemName(desk.book.find(r=>r.npc===n)!.kind),n:desk.book.find(r=>r.npc===n)!.price}):''}))}/>}
    <div className="actions"><button disabled={disabled || !!why} title={tip(disabled&&locked,why)} onClick={()=>submit({type:'wish-new',...(desk.replaceable.length?{replaceNpc:pick as never}:{})})}>{desk.replaces?t('ให้พ่อค้าตั้งคำขอใหม่แทนของเดิม'):desk.replaceable.length?t('ทำสัญญาใหม่แทนรายการที่เลือก'):t('ให้พ่อค้านี้บอกของที่อยากได้')} · {t('{n} พลัง',{n:desk.cost})}</button></div>
    {why && <p className="why" role="status">{why}</p>}</div>;
}
/** A merchant that said what it wants: sell it here, optionally asking above the offer at lower odds. */
export function WishDeal({game,submit,disabled}:Actions) {
  const locked=useLock();
  const wish=game.self.wishOffer;const [markup,setMarkup]=useState(0);const [picked,setPicked]=useState('');
  if(!game.wishlist || (!wish && !game.self.wishDesk)) return null;
  if(!wish) return <section className="wish-deal" aria-labelledby="wish-title"><h3 id="wish-title">{t('พ่อค้านี้ยังไม่ได้บอกของที่อยากได้')}</h3><WishBook game={game} submit={submit} disabled={disabled}/></section>;
  const held=wish.itemIds.map(id=>game.self.inventory.find(i=>i.id===id)).filter((i):i is ItemView=>!!i);
  const itemId=held.some(i=>i.id===picked)?picked:held[0]?.id??'';
  const option=wish.options.find(o=>o.markup===markup)??wish.options[0]!;
  const why=disabled?null:game.self.eventOffer?t('ตอบเหตุการณ์ก่อน'):wish.tried?t('ต่อรองกับพ่อค้านี้แล้วในช่วงนี้ รอครั้งหน้า'):!held.length?t('ยังไม่มีของที่พ่อค้าต้องการ'):null;
  return <section className="wish-deal" aria-labelledby="wish-title"><h3 id="wish-title">{t('{npc}ตามหา',{npc:npcName(wish.npc)})} <ItemTerm kind={wish.kind}/></h3>
    <p>{t('รับซื้อตอนนี้')} <strong>{t('{n} เครดิต',{n:wish.price})}</strong>{wish.price>wish.floor?t(' · ช่วงหน้า {next} · ต่ำสุด {floor} (ราคาฐาน ผลเสียไม่ลดราคาฐาน)',{next:wish.next,floor:wish.floor}):t(' · ถึงราคาฐานแล้ว {floor} เครดิต จะไม่ลดอีก',{floor:wish.floor})} · {t('เริ่มที่ {n}',{n:wish.initial})} · {t('ขอเพิ่มได้แต่โอกาสตกลงลดลง โอกาสคิดจากความไว้ใจ {trust}/{cap} (+{tb}) ผลดีที่ติดตัว {buffs} อย่าง (+{bb}) ผลเสีย {debuffs} อย่าง (−{db}) · อยู่ระหว่าง {lo}–{hi}% เสมอ',{trust:wish.trust,cap:TRUST_CAP,tb:wish.trust*3,buffs:wish.buffs,bb:wish.buffs*4,debuffs:wish.debuffs,db:wish.debuffs*4,lo:WISH_FLOOR,hi:WISH_CAP})}</p>
    <p className="supporting">{t('ต่อรองได้ครั้งเดียวต่อช่วง ถ้าไม่ตกลงยังรอของชิ้นนี้ในครั้งหน้า พ่อค้าอาจจับได้ถ้าเป็นของปลอม')}{salePctText(game)?` · ${salePctText(game)} ${t('ราคาที่แสดงปรับแล้ว')}`:''}</p>
    {held.length>1 && <ChoiceCards compact legend={t('เลือกชิ้นที่จะขาย')} value={itemId} onChange={setPicked} disabled={disabled} options={held.map(i=>({value:i.id,title:inventoryLabel(game,i),art:i.image}))}/>}
    {held.length>0 && <ChoiceCards compact legend={t('ราคาที่ขอ')} value={String(markup)} onChange={v=>setMarkup(Number(v))} disabled={disabled} options={wish.options.map(o=>({value:String(o.markup),title:`${t('{n} เครดิต',{n:o.price})}${o.markup?` (+${o.markup}%)`:''}`,detail:t('โอกาสตกลง {n}%',{n:o.chance})}))}/>}
    <div className="actions"><button className="primary" disabled={disabled || !!why || !itemId} title={tip(disabled&&locked,why,!itemId&&t('ยังไม่มีสินค้าที่เลือกขายได้'))} onClick={()=>submit({type:'wish-sell',itemId,markup})}>{t('ขายให้พ่อค้า · {n} เครดิต · {chance}%',{n:option.price,chance:option.chance})}</button></div>
    {why && <p className="why" role="status">{why}</p>}
    <WishBook game={game} submit={submit} disabled={disabled}/></section>;
}
const claimChoice=(value:boolean|undefined)=>value===undefined?'':String(value);
const fromChoice=(value:string):boolean|undefined=>value===''?undefined:value==='true';
export function Share({game,item,submit,disabled}:Actions&{item:ItemView}) {
  const locked=useLock();
  const listing=game.listings.find(l=>l.ownerId===game.self.id && l.itemId===item.id);
  const maySell=item.owner===game.self.id?item.lockedUntil===null:item.appraisal!==null;
  const shopItem=item.owner.startsWith('npc:') && !!game.challenge;
  const [genuine,setGenuine]=useState(claimChoice(listing?.claims?.genuine));const [cursed,setCursed]=useState(claimChoice(listing?.claims?.cursed));
  const claims={...(fromChoice(genuine)!==undefined?{genuine:fromChoice(genuine)!}:{}),...(fromChoice(cursed)!==undefined?{cursed:fromChoice(cursed)!}:{})};
  const [rebate,setRebate]=useState(String(listing?.rebate??0));const rebateId=useId();
  const rebateValue=Number(rebate);const rebateOk=rebate.trim()!=='' && Number.isSafeInteger(rebateValue) && rebateValue>=0 && rebateValue<=1000 && rebateValue<=game.self.credits;
  return <div className="sharing">
    <Provenance game={game} item={item}/>
    <p>{listing?listing.purchase?t('ประกาศขายแล้ว เพื่อนยื่นข้อเสนอได้'):t('โชว์ให้เพื่อนดูอย่างเดียว'):t('ยังไม่มีใครเห็นชิ้นนี้')}</p>
    {shopItem && <div className="claims">
      <ChoiceCards compact legend={t('ระบุความแท้ให้ผู้ซื้อ (ไม่ต้องตรวจก่อนก็ระบุได้)')} value={genuine} onChange={setGenuine} disabled={disabled} options={[{value:'',title:t('ไม่ระบุ'),tone:'quiet'},{value:'true',title:t('บอกว่าเป็นของแท้')},{value:'false',title:t('บอกว่าเป็นของปลอม')}]}/>
      <ChoiceCards compact legend={t('ระบุคำสาปให้ผู้ซื้อ')} value={cursed} onChange={setCursed} disabled={disabled} options={[{value:'',title:t('ไม่ระบุ'),tone:'quiet'},{value:'false',title:t('บอกว่าไม่มีคำสาป')},{value:'true',title:t('บอกว่ามีคำสาป')}]}/>
      <p className="supporting">{t('ผู้ซื้อท้าทายคำระบุได้ ถ้าคุณพูดไม่จริงและถูกจับ ผู้ซื้อลดราคา {pct}% ของราคาประเมิน (ไม่รวมค่านายหน้า) ถ้าคุณพูดจริง ผู้ท้าทายต้องจ่ายคุณ {pct}% ของราคาประเมิน',{pct:CHALLENGE_PCT})}</p>
      {listing?.claims && <p>{t('ที่ระบุไว้: {v}',{v:(['genuine','cursed'] as const).filter(k=>listing.claims![k]!==undefined).map(k=>claimText(k,listing.claims![k]!)).join(' · ')||t('ไม่ระบุ')})}</p>}
    </div>}
    {maySell && <div className="field"><label htmlFor={rebateId}><RebateIcon/> {t('ค่าแถมให้ผู้ซื้อ (เครดิต)')}</label><input id={rebateId} type="number" inputMode="numeric" min="0" max="1000" step="1" value={rebate} onChange={e=>setRebate(e.target.value)} disabled={disabled}/><p className="supporting">{rebateOk?t('จ่ายให้ผู้ซื้อเมื่อขายสำเร็จ ใช้ช่วยขายของที่ขายยาก'):t('ใส่จำนวนเต็ม 0–1000 และไม่เกินเครดิตที่มี')}</p></div>}
    <div className="actions">
      <button disabled={disabled || !!listing && !listing.purchase} title={tip(disabled&&locked,!!listing&&!listing.purchase&&t('โชว์ให้เพื่อนดูอยู่แล้ว'))} onClick={()=>submit({type:'share',itemId:item.id,allow:true,purchase:false})}>{t('โชว์ให้ดู')}</button>
      <button disabled={disabled || !maySell || !rebateOk || !!listing?.purchase && !shopItem} title={tip(disabled&&locked,!maySell&&t('ขายชิ้นนี้ไม่ได้ตอนนี้ (ติดล็อกหรือยังไม่ได้ประเมิน)'),!rebateOk&&t('ค่าแถมไม่ถูกต้อง'),!!listing?.purchase&&!shopItem&&t('ประกาศขายอยู่แล้ว'))} onClick={()=>submit({type:'share',itemId:item.id,allow:true,purchase:true,...(shopItem && Object.keys(claims).length?{claims}:{}),...(rebateValue?{rebate:rebateValue}:{})})}>{listing?.purchase && shopItem?t('แก้คำระบุ'):t('ประกาศขาย')}</button>
      {listing && <button disabled={disabled} title={tip(disabled&&locked)} onClick={()=>submit({type:'share',itemId:item.id,allow:false,purchase:false})}>{t('เก็บกลับ')}</button>}
    </div>
  </div>;
}
export function Contract({item,condition,setCondition,disabled,survival=false}:{item:ItemView;condition:boolean;setCondition:(value:boolean)=>void;disabled:boolean;survival?:boolean}) {
  const statusId=item.condition.statusId;
  if(!item.condition.available) return <p>{t('ร้านนี้รับเครดิตอย่างเดียวในช่วงนี้')}</p>;
  return <div className="contract">
    <label className="check"><input type="checkbox" checked={condition} onChange={e=>setCondition(e.target.checked)} disabled={disabled || item.condition.required}/><span>{item.condition.required?t('ร้านนี้บังคับเงื่อนไข:'):t('รับเงื่อนไขเพื่อลดราคา:')} {t('ลด {n} เครดิต แลก',{n:item.condition.discount})} <StatusTerm passive id={statusId} survival={survival}/></span></label>
    <p><Rich text={statusDescription(statusId)} survival={survival}/>{scoreStatusText(statusId,survival)} · {readable(statusDuration(statusId))}</p>
  </div>;
}
type DeskStep='inspect'|'appraise'|'buy';
/** Start where the player left off: a judged item goes straight to buying. */
function openingStep(game:AppraisalView,item:ItemView):DeskStep {
  return item.appraisal!==null || game.self.caught?'buy':game.self.inspections<inspectionQuota(game)?'inspect':'appraise';
}
export function AppraisalDesk({game,item,submit,disabled}:Actions&{item:ItemView}) {
  const locked=useLock();
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
  const name=itemName(item.kind);
  const eventFirst=disabled?locked:t('ตอบเหตุการณ์ก่อน');
  const appraiseWhy=!canAct?eventFirst:!valid?t('ใส่จำนวนเต็ม 0–1000'):game.self.energy<1?t('พลังไม่พอ ต้องใช้ 1 มี {have}',{have:game.self.energy}):game.self.caught?t('พ่อค้าจับผิดแล้ว ประเมินไม่ได้'):item.appraisal!==null && game.self.counters>=game.self.counterLimit?t('ต่อรองครบจำนวนครั้งแล้ว'):item.npc==='darkone' && !danger?t('ต้องยอมรับสัญญา Dark One ก่อน'):null;
  const steps:Array<{id:DeskStep;label:string;meta:string}>=[
    {id:'inspect',label:t('ตรวจ'),meta:left?t('เหลือ {n} ครั้ง',{n:left}):t('ใช้สิทธิ์ครบ')},
    {id:'appraise',label:t('ตีราคา'),meta:item.appraisal===null?(game.self.caught?t('ถูกจับผิดแล้ว'):t('ยังไม่ตีราคา')):`${item.appraisal} · ${item.appraisalAccepted?t('ตกลง'):t('ปฏิเสธ')}`},
    {id:'buy',label:t('ซื้อ'),meta:t('{n} เครดิต',{n:item.price})},
  ];
  return <section className="desk" aria-label={t('ประเมิน {name}',{name})}>
    <h2 className="desk-title">{name}</h2>
    <div className="relic-art"><img src={item.image} alt={name} width="1254" height="1254"/></div>
    <div className="desk-reading">
      {game.self.eventOffer && !disabled && <p className="blocked-note">{t('ตอบเหตุการณ์ก่อน ปุ่มบนโต๊ะนี้จึงจะกดได้')}</p>}
      <ItemFacts item={item}/>
      {game.self.npcTrust && <p className="trust-note">{t('ความไว้ใจ {npc} {n}/{cap} · โอกาสยอมรับราคาต่ำกว่าปกติเพิ่ม {chance} จุดเปอร์เซ็นต์ · รวมผลของสะสมแล้ว · ความเสี่ยงจับผิดยังมีอยู่',{npc:npcName(item.npc),n:game.self.npcTrust[item.npc]??0,cap:TRUST_CAP,chance:npcAcceptanceChance(game,item.npc)})}</p>}
      {game.self.npcTrust && <p className="commission-note">{t('ของที่คุณประเมินขายได้: รับค่านายหน้า {rate}% ของราคาขายจริง (ปัดลง){fee} และความไว้ใจ +{trust} ต่อชิ้น · รับครั้งเดียว ไม่ซ้ำเมื่อขายต่อ',{rate:commissionRate(playerPassives(game)),fee:playerPassives(game).saleFee?t(' + ค่าดำเนินการ {n} เครดิต',{n:playerPassives(game).saleFee}):'',trust:1+playerPassives(game).trust})}</p>}
      {game.passives && passiveSpec(item.kind) && <p className="trust-note">{t('ถือแล้วได้ผลสะสม: {text}',{text:passiveText(item.kind)})}</p>}
      <p className="item-effects">{t('เมื่อเปิดใช้:')} <Rich text={possibleBenefitText(game,item)} survival={!!game.survival}/><br/>{t('ความเสี่ยง:')} <Rich text={possibleDrawbackText(game,item)} survival={!!game.survival}/>{ITEM_SPECS[item.kind].consumable?t(' · ใช้แล้วหมดไป'):''}</p>
      {item.appraisal!==null && <p className={`verdict${item.appraisalAccepted?' accepted':' rejected'}`}>{t('คุณเสนอ {n} เครดิต · {v} · ต่อรองเหลือ {left} ครั้ง',{n:item.appraisal,v:item.appraisalAccepted?t('NPC ยอมรับ'):t('NPC ปฏิเสธ'),left:Math.max(0,game.self.counterLimit-game.self.counters)})}</p>}
      <div className="desk-steps" role="tablist" aria-label={t('ขั้นตอนบนโต๊ะ')}>{steps.map((s,index)=><button key={s.id} type="button" role="tab" id={`${tabs}-${s.id}`} aria-controls={`${tabs}-${s.id}-panel`} aria-selected={deskStep===s.id} className={deskStep===s.id?'current':''} onClick={()=>setDeskStep(s.id)}>
        <span className="step-number" aria-hidden="true">{index+1}</span><span className="step-label">{s.label}<small>{s.meta}</small></span></button>)}</div>
      <div role="tabpanel" id={`${tabs}-inspect-panel`} aria-labelledby={`${tabs}-inspect`} hidden={deskStep!=='inspect'} className="step-panel">
        <Inspect game={game} item={item} submit={submit} disabled={disabled}/>
        <button type="button" className="step-next" onClick={()=>setDeskStep('appraise')}>{t('พร้อมตีราคาแล้ว')}</button>
      </div>
      <div role="tabpanel" id={`${tabs}-appraise-panel`} aria-labelledby={`${tabs}-appraise`} hidden={deskStep!=='appraise'} className="step-panel">
      <form onSubmit={e=>{e.preventDefault();if(valid)submit({type:item.appraisal===null?'appraise':'counter',itemId:item.id,value:number,acceptDanger:danger});}}>
        <label htmlFor={inputId}>{item.appraisal===null?t('ราคาที่คุณประเมิน'):t('ราคาที่คุณต่อรองใหม่')} ({t('เครดิต')})</label>
        <div className="price-entry"><div className="stepper"><button type="button" aria-label={t('ลดราคา 1 เครดิต')} disabled={!canAct || valid && number<=0} title={tip(!canAct&&eventFirst,valid&&number<=0&&t('ราคาต่ำสุดคือ 0'))} onClick={()=>step(-1)}><MinusIcon/></button><input id={inputId} type="number" inputMode="numeric" min="0" max="1000" step="1" required value={value} onChange={e=>setValue(e.target.value)} disabled={!canAct}/><button type="button" aria-label={t('เพิ่มราคา 1 เครดิต')} disabled={!canAct || valid && number>=1000} title={tip(!canAct&&eventFirst,valid&&number>=1000&&t('ราคาสูงสุดคือ 1000'))} onClick={()=>step(1)}><PlusIcon/></button></div><button className="primary appraise" title={tip(appraiseWhy)} disabled={!canAct || !valid || game.self.energy<1 || game.self.caught || item.appraisal!==null && game.self.counters>=game.self.counterLimit || item.npc==='darkone' && !danger}><AppraiseIcon/>{item.appraisal===null?t('ยืนยันการประเมิน'):t('ยื่นราคาต่อรอง')} · {t('1 พลัง')}</button></div>
        <p className={`risk${riskLevel}`}>{!valid?t('ใส่จำนวนเต็ม 0–1000'):risk?<>{t('โอกาสถูกจับผิด')} <strong>{risk[0]===risk[1]?risk[0]:`${risk[0]}–${risk[1]}`}%</strong> {t('จากข้อมูลที่คุณรู้')}</>:t('ยังคำนวณโอกาสถูกจับผิดไม่ได้ · ตรวจราคาเพื่อหาเบาะแสมูลค่า')} · {t('ถูกจับผิดอาจเสียเงินหรือของ')}{item.npc==='darkone'?t(' และถึงชีวิตตามสัญญา'):''}</p>
        {item.npc==='darkone' && <label className="check danger-text"><input type="checkbox" checked={danger} onChange={e=>setDanger(e.target.checked)} disabled={!canAct}/><span>{game.survival?t('ยอมรับสัญญา Dark One: หากถูกจับผิด อาจต้องสละของหรือชีวิตเป็น 0 เป็นผู้ชมจนจบ run ของและเครดิตยังรอ Collector'):t('ยอมรับสัญญา Dark One: หากถูกจับผิด อาจต้องสละของหรือตาย พักเฉพาะช่วงนี้และคะแนนช่วงนี้เป็น 0')}</span></label>}
        {game.self.caught && <p className="danger-text">{t('พ่อค้าจับผิดแล้ว ไม่รับการประเมินหรือต่อรองเพิ่ม ยังซื้อในราคาที่แสดงได้')}</p>}
      </form>
      {item.appraisal===null && <button type="button" className="step-next" onClick={()=>setDeskStep('buy')}>{t('ไม่ตีราคา ไปดูราคาหน้าร้าน')}</button>}
      </div>
      <div role="tabpanel" id={`${tabs}-buy-panel`} aria-labelledby={`${tabs}-buy`} hidden={deskStep!=='buy'} className="step-panel purchase">
        <h3>{t('ราคาที่พ่อค้ายอมขาย {n} เครดิต',{n:item.price})}</h3>
        {item.appraisalAccepted===false && <p>{t('ใช้ราคาหน้าร้าน {n} เครดิต เพราะพ่อค้าปฏิเสธราคาประเมิน',{n:item.ask})}</p>}
        <Contract item={item} condition={useCondition} setCondition={setCondition} disabled={!canAct} survival={!!game.survival}/>
        {game.self.stock.length===2 && <label className="check"><input type="checkbox" checked={buyBoth} onChange={e=>setBuyBoth(e.target.checked)} disabled={!canAct}/><span>{t('ซื้อทั้งสองชิ้นในดีลเดียว')}</span></label>}
        {(()=>{const why=purchaseBlock(game,total,disabled);return <>
        <button className="primary buy" disabled={!canAct || !!why} title={tip(!canAct&&eventFirst,why)} onClick={()=>submit({type:'buy',itemIds:items.map(i=>i.id),condition:useCondition})}><BuyIcon/>{buyBoth?t('ซื้อทั้งคู่'):t('ซื้อเก็บไว้')} · {t('{n} เครดิต',{n:total})} · {purchaseEnergy(game)===0?t('ไม่เสียพลัง'):t('{n} พลัง',{n:purchaseEnergy(game)})}</button>
        {why && <p className="why" role="status">{why}</p>}</>;})()}
      </div>
    </div>
  </section>;
}
const dangerChoices=new Set(['die','item','surrender']);
export function EventDecision({game,offer,submit,disabled,playerNames={}}:Actions&{offer:EventOffer;playerNames?:Record<string,string>}) {
  const locked=useLock();
  const consequence=isConsequence(offer.id);
  const usableIds=(c:string)=>c==='decline'||!eventNeedsItem(offer,c)?offer.itemIds:offer.itemIds.filter(id=>eventItemUsable(game,offer,id));
  /** Why a choice cannot be taken right now: unaffordable costs or no item left that it could teach. Consequences are never blocked. */
  const blockedReason=(c:string,id:string):string|null=>{
    if(consequence || c==='decline') return null;
    if(eventNeedsItem(offer,c) && !usableIds(c).length) return t('ไม่มีสินค้าที่ใช้ได้ (รู้ข้อมูลนี้แล้ว)');
    return needShort(game,eventNeeds(game,offer,c,usableIds(c).includes(id)?id:usableIds(c)[0]??''));
  };
  const firstOpen=offer.choices.find(c=>!blockedReason(c,offer.itemIds[0]??''))??offer.choices[0]!;
  const [pickedChoice,setChoice]=useState(firstOpen);
  const [pickedItem,setItemId]=useState(offer.itemIds[0]??'');
  const choice=offer.choices.includes(pickedChoice) && !blockedReason(pickedChoice,pickedItem)?pickedChoice:firstOpen;
  const choiceItems=usableIds(choice);
  const itemId=choiceItems.includes(pickedItem)?pickedItem:choiceItems[0]??'';
  const statusOptions=eventStatusOptions(offer,choice);
  const [statusId,setStatusId]=useState(statusOptions[0]??'');
  const effectiveStatus=statusOptions.includes(statusId as typeof statusOptions[number])?statusId:statusOptions[0]??'';
  const facts=eventFacts(offer,itemId);
  const [fact,setFact]=useState<string>(facts[0]??'');
  const effectiveFact=facts.includes(fact as typeof facts[number])?fact:facts[0]??'';
  const [guess,setGuess]=useState(true);
  const [loanIds,setLoanIds]=useState(offer.itemIds.slice(0,1));
  const [otherPlayerId,setOtherPlayerId]=useState(offer.otherPlayerIds[0]??'');
  const action=eventDecision(offer,choice,{itemId,statusId:effectiveStatus,fact:effectiveFact,guess,itemIds:loanIds,otherPlayerId});
  const catalog=eventCatalog(offer);const survival=!!game.survival;
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
      <p className="event-say">{survival && offer.id==='E50'?t('คุณผิดสัญญา Dark One สละของหนึ่งชิ้นเพื่อรอด หรือชีวิตเป็น 0 แล้วเป็นผู้ชมจนจบ run ของและเครดิตที่เหลือยังรอ Collector'):<Rich text={catalog.description} survival={survival}/>}</p>
      {offer.wish && <p className="event-give">{t('{npc}อยากได้',{npc:npcName(game.self.portals.find(p=>p.id===game.self.selectedPortalId)?.npc ?? 'orc')})} <ItemTerm kind={offer.wish.kind}/> {t('ให้ {n} เครดิต ซึ่งสูงกว่าตลาด · ถ้าครั้งหน้าคุณเลือกพ่อค้านี้และถือของชนิดนี้อยู่ ขายให้ได้ ต่อรองราคาได้',{n:offer.wish.price})}</p>}
      {offer.giveItemId && <p className="event-give">{t('พ่อค้าขอ')} <ItemTerm kind={offer.targetKinds[offer.giveItemId]!} item={visible.find(i=>i.id===offer.giveItemId)}/> {t('จากคลังของคุณ')}</p>}
      {offer.id==='E08' && <dl className="portal-contracts">{game.self.portals.slice(0,2).map((portal,index)=>{
        const spec=NPC_SPECS[portal.npc];const status={id:spec.condition};
        const available=spec.condition!=='D04' || (game.encounterCount===null || game.encounter<game.encounterCount);
        return <div key={portal.id}><dt>{index===0?t('เลือกเครดิต'):t('เลือกเงื่อนไข')} · <NpcTerm npc={portal.npc}/></dt><dd>{index===0?t('จ่ายเครดิตอย่างเดียว ไม่มีส่วนลด'):<>{t('ลด {n} เครดิตต่อการซื้อ · ต้องรับ',{n:spec.discount})} <StatusTerm id={status.id} survival={survival}/><p>{readable(statusDescription(status.id))}{scoreStatusText(status.id,survival)} · {readable(statusDuration(status.id))}</p>{!available && <p className="danger-text">{t('ช่วงสุดท้ายรับเงื่อนไขนี้ไม่ได้ ร้านนี้จะซื้อไม่ได้ เลือกร้านรับเครดิตหรือไม่รับแทน')}</p>}</>}</dd><dd>{t('อาจมี')} <ItemTerm kind={portal.hint}/> {t('มาขาย')}</dd></div>;
      })}</dl>}
    </div>
    <form className="event-form" onSubmit={e=>{e.preventDefault();if(action)submit(action);}}>
      <ChoiceCards legend={t('คุณจะเลือกทางไหน')} value={choice} onChange={c=>{setChoice(c);const count=loanItemCount(c);if(count)setLoanIds(ids=>ids.slice(0,count));}} disabled={disabled} options={choices.map(c=>{const why=blockedReason(c,itemId);return {value:c,title:title(c),disabled:!!why,
        detail:<><Rich passive survival={survival} text={`${eventCost(game,offer,c,itemId)}${eventScoreText(game,offer,c,effectiveStatus)}`}/>{why && <span className="why"> {why}</span>}</>,
        tone:c==='decline'?'quiet':consequence && dangerChoices.has(c)?'danger':undefined};})}/>
      {eventNeedsItem(offer,choice) && <ChoiceCards legend={offer.giveItemId?t('เลือกของในร้านที่จะได้'):t('เลือกสินค้า')} value={itemId} onChange={setItemId} disabled={disabled} options={choiceItems.map((id,index)=>{
        const seen=visible.find(i=>i.id===id);const kind=offer.targetKinds[id];
        return {value:id,title:offer.npcTerms && seen?.owner===game.self.id?inventoryLabel(game,seen):eventItemName(offer,id),...(kind?{art:itemImage(kind)}:{}),
          detail:priced?t('รับ {n} เครดิต',{n:offer.quotedPrices[id]}):seen?(seen.owner===game.self.id?inventoryLabel(game,seen):t('ราคาร้าน {n} เครดิต',{n:seen.price})):t('รายการ {n}',{n:index+1})};
      })}/>}
      {offer.id==='E110' && loanItemCount(choice)>0 && <fieldset className="loan-selection" disabled={disabled}><legend>{t('เลือกของให้ยืม · {a}/{b} ชิ้น',{a:loanIds.length,b:loanItemCount(choice)})}</legend>
        {offer.itemIds.map(id=>{const item=game.self.inventory.find(i=>i.id===id);return <label className="check" key={id}><input type="checkbox" checked={loanIds.includes(id)} disabled={!loanIds.includes(id) && loanIds.length>=loanItemCount(choice)} onChange={e=>setLoanIds(ids=>e.target.checked?[...ids,id]:ids.filter(value=>value!==id))}/><span>{item?inventoryLabel(game,item):eventItemName(offer,id)}</span></label>;})}
        <p className="supporting">{t('เลือกให้ครบจำนวน · ของที่ให้ยืมจะใช้ ขาย หรือรับผลติดตัวไม่ได้จนกว่าจะคืน')}</p>
      </fieldset>}
      {offer.id==='E111' && choice==='send-debuff' && <ChoiceCards compact legend={t('ส่งผลเสียสุ่มให้ใคร')} value={otherPlayerId} onChange={setOtherPlayerId} disabled={disabled} options={offer.otherPlayerIds.map((id,index)=>({value:id,title:playerNames[id]??t('ผู้เล่นคนที่ {n}',{n:index+1})}))}/>}
      {eventNeedsStatus(offer,choice) && <ChoiceCards compact legend={t('เลือกสถานะ')} value={effectiveStatus} onChange={setStatusId} disabled={disabled} options={statusOptions.map(id=>({value:id,title:<><span className={id.startsWith('D')?'danger-text':'positive-text'}>{id.startsWith('D')?<DebuffIcon/>:<BuffIcon/>}</span>{statusName(id)}</>,...(offer.id==='E108'?{detail:readable(statusDescription(id))}:{})}))}/>}
      {offer.id==='E45' && choice!=='decline' && <ChoiceCards compact legend={t('ผลตรวจที่จะเปิดให้ทุกคน')} value={effectiveFact} onChange={setFact} disabled={disabled} options={facts.map(f=>{const v=offer.facts[itemId]?.[f];return {value:f,title:`${factLabel(f)}: ${typeof v==='boolean'?v?t('ใช่'):t('ไม่ใช่'):String(v)}`};})}/>}
      {offer.id==='E46' && choice!=='decline' && <ChoiceCards compact legend={t('คุณทายว่า')} value={String(guess)} onChange={v=>setGuess(v==='true')} disabled={disabled} options={[{value:'true',title:t('ของแท้')},{value:'false',title:t('ของปลอม')}]}/>}
      <button className={consequence?'danger':'primary'} disabled={disabled || !action || !!blockedReason(choice,itemId)} title={tip(disabled&&locked,blockedReason(choice,itemId),!action&&t('ยังเลือกรายละเอียดไม่ครบ ตรวจตัวเลือกด้านบน'))}>{t('ยืนยัน: {title}',{title:title(choice)})}</button>
    </form>
  </section>;
}
export function DarkMarket({game,submit,disabled,compact=false}:Actions&{compact?:boolean}) {
  const lots=game.market.lots??[];const [expanded,setExpanded]=useState(false);
  const sellable=game.self.inventory.filter(item=>marketOptions(game,item).length>0).length;
  if(compact && !expanded) return <aside className={`dark-market compact${game.market.open || lots.length?' open':' closed'}`} aria-labelledby="market-title">
    <h2 id="market-title"><MarketIcon/>Dark Market</h2>
    <p className="market-lede">{!game.market.open && !lots.length?t('ปิดในช่วงนี้'):[game.market.open?t('รับซื้อ {n} รายการ',{n:game.market.orders.length}):'',sellable?t('คุณขายได้ {n} ชิ้น',{n:sellable}):'',lots.length?t('ประมูล {n} ชิ้น',{n:lots.length}):''].filter(Boolean).join(' · ')}</p>
    {(game.market.open || lots.length>0) && <button type="button" className="market-toggle" onClick={()=>setExpanded(true)}>{t('ดูรายการ')}</button>}
  </aside>;
  return <aside className={`dark-market${game.market.open || lots.length?' open':' closed'}`} aria-labelledby="market-title">
    <h2 id="market-title"><MarketIcon/>Dark Market</h2>
    {!game.market.open?<p className="market-closed">{t('ตลาดเงาปิดในช่วงนี้ เก็บของไว้ลุ้นรายการรับซื้อในช่วงถัดไป')}</p>:<>
      <p className="market-lede">{t('รับซื้อถึงจบช่วงพบพ่อค้านี้ ซื้อของใหม่แล้วนำมาขายได้ · ป้ายเป็นราคาฐาน ปุ่มขายรวมผลของสะสม')}</p>
      {salePctText(game) && <p className="supporting">{salePctText(game)}</p>}
      <ul className="wanted">{game.market.orders.map(order=>{
        const quota=order.quota[game.self.id]??0;
        const owned=game.self.inventory.filter(item=>marketOptions(game,item).some(o=>o.id===order.id));
        return <li key={order.id}><img src={itemImage(order.kind)} alt="" width="1254" height="1254" loading="lazy"/><div><h3><ItemTerm kind={order.kind}/></h3><p className="order-quote">{t('รับซื้อ')} <strong><CoinIcon/>{t('{n} เครดิต',{n:order.price})}</strong> · {t('สิทธิ์คุณ {n} ชิ้น',{n:quota})}</p>{order.contract && <div className="market-contract"><p><strong>{t('ต้องการ: {v}',{v:marketRequirements(order.contract)})}</strong></p><p className="positive-text">{t('ตรงเงื่อนไข: {n} เครดิต +',{n:order.price})} <Rich text={marketBonus(order.contract)} survival={!!game.survival}/></p><p className="danger-text">{t('ไม่ตรง: ลด 20% เหลือ {n} เครดิต หรือ',{n:Math.floor(order.price*80/100)})} <Rich text={marketCost(order.contract)} survival={!!game.survival}/> {t('เพื่อรับราคาเต็ม {n} เครดิต · ไม่ได้โบนัส',{n:order.price})}</p></div>}
          {quota===0?<p>{t('ใช้สิทธิ์รายการนี้แล้ว')}</p>:owned.length?owned.map(item=><div key={item.id} className="market-held"><p><strong>{inventoryLabel(game,item)}</strong></p><ItemFacts item={item}/><MarketSale game={game} item={item} order={order} submit={submit} disabled={disabled || !!game.self.eventOffer && isConsequence(game.self.eventOffer.id)}/></div>):<p>{t('ยังไม่มีของที่ขายได้ในรายการนี้')}</p>}
        </div></li>;
      })}</ul>
      <p className="supporting">{t('ขายแล้วโอนของทันที · ของที่ติดครอบครองอัปมงคลต้องปลดล็อกก่อน')}{game.brokerage?t(' · ของที่ขายเข้าคลังและอาจถูกนำมาประมูลภายหลัง'):''}</p>
    </>}
    {lots.length>0 && <Auction game={game} submit={submit} disabled={disabled}/>}
  </aside>;
}
function AuctionLot({game,lot,submit,disabled}:Actions&{lot:NonNullable<AppraisalView['market']['lots']>[number]}) {
  const locked=useLock();
  const [bid,setBid]=useState(String(lot.yourBid??lot.minimum));const id=useId();
  const amount=Number(bid);const valid=bid.trim()!=='' && Number.isSafeInteger(amount) && amount>=lot.minimum && amount<=Math.min(1000,game.self.credits);
  const settled=lot.winnerId!==undefined;
  return <li><img src={lot.item.image} alt="" width="1254" height="1254" loading="lazy"/><div><h3><ItemTerm kind={lot.item.kind} item={lot.item}/></h3><p className="lot-prize"><TicketIcon/>{t('ชนะรับตั๋วคำสั่งมืด 1 ใบ')}</p><p className="order-quote">{t('ขั้นต่ำ')} <strong><CoinIcon/>{t('{n} เครดิต',{n:lot.minimum})}</strong> · {t('ซองประมูล {n} ซอง',{n:lot.bidCount})}</p><ItemFacts item={lot.item}/>
    {settled?<p>{lot.winnerId===null?t('ไม่มีผู้ชนะ ของกลับเข้าคลัง'):lot.winnerId===game.self.id?t('คุณชนะประมูล จ่าย {n} เครดิต',{n:lot.price}):t('มีผู้ชนะประมูลที่ {n} เครดิต',{n:lot.price})}</p>:
    <form onSubmit={e=>{e.preventDefault();if(valid)submit({type:'bid',lotId:lot.id,credits:amount});}}>
      <label htmlFor={id}>{t('ราคาประมูลแบบปิดซอง (เครดิต)')}</label><input id={id} type="number" min={lot.minimum} max="1000" step="1" value={bid} onChange={e=>setBid(e.target.value)} disabled={disabled}/>
      <p>{lot.yourBid!==null?t('ซองของคุณ {n} เครดิต · แก้ได้จนจบช่วง',{n:lot.yourBid}):t('ยังไม่ได้ยื่นซอง')} · {t('จ่ายเมื่อชนะตอนคิดผลช่วง')}</p>
      <div className="actions"><button disabled={disabled || !valid} title={tip(disabled&&locked,!valid&&t('ราคาต้องไม่ต่ำกว่า {min} เครดิต และไม่เกิน {max} (เครดิตที่มี)',{min:lot.minimum,max:Math.min(1000,game.self.credits)}))}>{lot.yourBid!==null?t('แก้ซองประมูล'):t('ยื่นซองประมูล')}</button>{lot.yourBid!==null && <button type="button" disabled={disabled} title={tip(disabled&&locked)} onClick={()=>submit({type:'bid',lotId:lot.id,credits:0})}>{t('ถอนซอง')}</button>}</div>
    </form>}
  </div></li>;
}
function Auction({game,submit,disabled}:Actions) {
  return <section className="auction" aria-labelledby="auction-title"><h3 id="auction-title">{t('ประมูลของจากคลังตลาดเงา')}</h3>
    <p className="market-lede">{t('ไม่ได้เปิดทุกช่วง ราคาสูงสุดที่ยังจ่ายไหวชนะเมื่อคิดผลช่วง ราคาเท่ากันตัดสินด้วยเส้นทาง ไม่เห็นซองของคนอื่น')}</p>
    <ul className="wanted">{game.market.lots!.map(lot=><AuctionLot key={lot.id} game={game} lot={lot} submit={submit} disabled={disabled}/>)}</ul></section>;
}
/** Brokerage duty: an appraised item nobody bought must be bought, penalised or consigned before the encounter settles. */
export function Unsold({game,submit,disabled}:Actions) {
  const locked=useLock();
  const items=unsoldItems(game);if(!items.length) return null;
  const blocked=disabled || !!game.self.eventOffer;
  return <section className="unsold" aria-labelledby="unsold-title"><h2 id="unsold-title">{t('ของที่คุณประเมินแล้วยังขายไม่ได้')} <span>{t('{n} ชิ้น',{n:items.length})}</span></h2>
    <p>{t('พ่อค้าเชื่อราคาของคุณ ถ้าไม่มีใครซื้อ คุณต้องรับผิดชอบ จบช่วงต่อรองแล้วชิ้นที่ค้างจะรับบทลงโทษจากพ่อค้าโดยอัตโนมัติ')}{game.phase==='APPRAISAL'?t(' ยังเปิดให้ผู้เล่นอื่นซื้อในช่วงต่อรองได้'):''}</p>
    <ul>{items.map(item=>{const price=purchasePrice(game,[item],game.self.dealMode==='condition');return <li key={item.id}><h3><ItemTerm kind={item.kind} item={item}/> · {t('คุณประเมินไว้ {n} เครดิต',{n:item.appraisal})}</h3>
      <div className="actions">
        <button disabled={blocked || !!needShort(game,{credits:price,energy:purchaseEnergy(game)})} title={tip(disabled&&locked,!!game.self.eventOffer&&t('ตอบเหตุการณ์ก่อน'),needShort(game,{credits:price,energy:purchaseEnergy(game)}))} onClick={()=>submit({type:'unsold',itemId:item.id,choice:'buy'})}><BuyIcon/>{t('ซื้อเอง · {n} เครดิต · {e}',{n:price,e:purchaseEnergy(game)===0?t('ไม่เสียพลัง'):t('{n} พลัง',{n:purchaseEnergy(game)})})}</button>
        <button disabled={blocked} title={tip(disabled&&locked,t('ตอบเหตุการณ์ก่อน'))} onClick={()=>submit({type:'unsold',itemId:item.id,choice:'penalty'})}>{t('รับโทษจากพ่อค้า')}</button>
        <button disabled={blocked} title={tip(disabled&&locked,t('ตอบเหตุการณ์ก่อน'))} onClick={()=>submit({type:'unsold',itemId:item.id,choice:'consign'})}><MarketIcon/>{t('ส่งต่อ Dark Market')}</button>
      </div>
      {!blocked && needShort(game,{credits:price,energy:purchaseEnergy(game)}) && <p className="why" role="status">{t('ซื้อเองไม่ได้:')} {needShort(game,{credits:price,energy:purchaseEnergy(game)})}</p>}
      <p className="danger-text">{t('ถ้ารับโทษ:')} <Rich text={unsoldPenaltyText(item)} survival={!!game.survival}/></p><p>{t('ถ้าส่งต่อ:')} {consignText()}</p></li>;})}</ul>
  </section>;
}
export function Inventory({game,submit,disabled,drawer=false}:Actions&{drawer?:boolean}) {
  const locked=useLock();
  const [selected,setSelected]=useState<string|null>(null);
  const item=game.self.inventory.find(i=>i.id===selected);
  const playing=['APPRAISAL','TRADE'].includes(game.phase);
  const heading=<h2 id="inventory-title">{t('ของที่คุณเก็บไว้')} <span>{t('{n} ชิ้น',{n:game.self.inventory.length})}</span></h2>;
  const Shell=drawer?'details':'section';
  return <Shell className={`inventory${drawer?' drawer':''}`} aria-labelledby="inventory-title">
    {drawer?<summary>{heading}</summary>:heading}
    {!game.self.inventory.length?<p>{t('คลังยังว่าง ซื้อจากพ่อค้าหรือแลกกับเพื่อนเพื่อเริ่มสะสม')}</p>:<ul className="inventory-row">{game.self.inventory.map(i=><li key={i.id}><button className={`item-thumb ${i.id===selected?'selected':''}`} aria-pressed={i.id===selected} onClick={()=>setSelected(i.id===selected?null:i.id)}><Peek passive tone="item" label={<><img src={i.image} alt="" width="1254" height="1254" loading="lazy"/><span className="thumb-label">{inventoryLabel(game,i)}</span>{game.phase==='TRADE' && i.appraisal!==null && <span className="thumb-label">{t('ราคาประเมินล่าสุด')} · {t('{n} เครดิต',{n:i.appraisal})}</span>}</>} card={<ItemCard kind={i.kind} item={i}/>}/>{i.lockedUntil!==null && <span className="thumb-label">{t('ล็อกถึงจบช่วง {n}',{n:i.lockedUntil})}</span>}<span className="thumb-marks"><SealBadge game={game} item={i} passive compact/></span></button></li>)}</ul>}
    {item && <div className="inventory-detail"><h3>{itemName(item.kind)}</h3>{game.phase==='TRADE' && <AppraisalPrice item={item}/>}<ItemFacts item={item}/>{game.passives && passiveSpec(item.kind) && <p className="trust-note">{t('ขณะถือ · สะสมได้: {text}',{text:passiveText(item.kind)})}</p>}<p>{t('ผลที่เป็นไปได้:')} <Rich text={possibleBenefitText(game,item)} survival={!!game.survival}/> · <Rich text={possibleDrawbackText(game,item)} survival={!!game.survival}/></p>
      {item.lockedUntil!==null && <p><StatusTerm id="D09" survival={!!game.survival}/>: {t('ขายหรือแลกไม่ได้จนจบช่วง {n} ยังเปิดใช้ได้',{n:item.lockedUntil})}</p>}
      {playing && <><Inspect game={game} item={item} submit={submit} disabled={disabled}/>
        <p>{ITEM_SPECS[item.kind].consumable?t('ใช้แล้วหมดไป'):t('เปิดใช้ได้ช่วงละครั้ง')} · {t('ถ้ายังไม่รู้ว่าแท้หรือมีคำสาป อาจโดนผลเสีย')}</p>
        {(()=>{const why=activationBlock(game,item.id,disabled);return <><button disabled={disabled || !!why} title={tip(disabled&&locked,why)} onClick={()=>submit({type:'activate',itemId:item.id})}>{t('เปิดใช้ {name} · 1 พลัง',{name:itemName(item.kind)})}</button>{why && <p className="why" role="status">{why}</p>}</>;})()}
        <Share game={game} item={item} submit={submit} disabled={disabled}/></>}
    </div>}
  </Shell>;
}
export function Statuses({game}:{game:AppraisalView}) {
  const dead=!!game.survival && game.self.life===0;
  return <section className="statuses" aria-labelledby="status-title"><h2 id="status-title">{t('ผลติดตัว')} <span>{t('{n} อย่าง',{n:game.self.statuses.length})}</span></h2>
    {!game.self.statuses.length?<p>{t('ยังไม่มีผลดีหรือผลเสียติดตัว')}</p>:<ul className="status-badges">{game.self.statuses.map(s=><li key={s.id} className={s.id.startsWith('D')?'debuff':'buff'}>
      <StatusTerm id={s.id} survival={!!game.survival}/>
      <span className="status-meta">{dead?t('เก็บไว้ให้ Collector · ไม่เดินอายุต่อหลังตาย'):`${s.starts>game.encounter?t('เริ่มช่วง {n} · ',{n:s.starts}):''}${t('เหลือ {n} ครั้ง · ถึงจบช่วง {m}',{n:s.charges,m:s.expires})}${s.targetItemId?t(' · ผูกกับของหนึ่งชิ้น'):''}`}</span>
    </li>)}</ul>}
    {game.self.statuses.length>0 && <p className="supporting">{t('ชี้หรือแตะชื่อเพื่อดูผล')}</p>}
  </section>;
}
export function TradeListing({game,listing,room,submit,disabled}:Actions&{listing:AppraisalView['listings'][number];room:AppraisalRoomView}) {
  const locked=useLock();
  const [credits,setCredits]=useState('0');const [swap,setSwap]=useState('');const [challenge,setChallenge]=useState('');const [sealPick,setSealPick]=useState('');
  const [condition,setCondition]=useState(listing.item.condition.required);
  const id=useId();const item=listing.item;
  const source=item.owner.startsWith('npc:')?'npc':'inventory';
  const price=Number(credits);const valid=credits.trim()!=='' && Number.isSafeInteger(price) && price>=0 && price<=1000;
  const useCondition=item.condition.required || condition && item.condition.available;
  const npcPrice=source==='npc'?purchasePrice(game,[item],useCondition):0;
  const tradeEnergy=purchaseEnergy(game,[item]);
  const claims=source==='npc' && game.challenge?listing.claims:undefined;
  const claimKeys=(['genuine','cursed'] as const).filter(k=>claims?.[k]!==undefined);
  const disputed:ClaimKey|''=claimKeys.includes(challenge as ClaimKey)?challenge as ClaimKey:'';
  const lenses=game.self.inventory.filter(i=>i.kind==='doubt-lens').length;
  const seals=game.self.inventory.filter(i=>i.kind==='void-seal' && i.lockedUntil===null);
  const seal=disputed && seals.find(i=>i.id===sealPick);
  const quote=item.price;const winOff=challengeDiscount(quote,lenses),lossFee=challengePenalty(quote);
  const seller=game.players.find(p=>p.id===listing.ownerId);
  const pending=game.trades.filter(tr=>tr.buyerId===game.self.id && tr.status==='open').length;
  const name=room.matchSeats.find(s=>s.id===listing.ownerId)?.name??t('นักประเมิน');
  const itemTitle=itemName(item.kind);
  return <article className="trade-listing"><img className="trade-art" src={item.image} alt={itemTitle} width="1254" height="1254" loading="lazy"/><div><h3>{itemTitle} · {name}</h3><p>{source==='npc'?t('ของในร้าน NPC · ต้องให้เจ้าของร้านอนุมัติ'):t('สินค้าของผู้เล่น · ราคาที่ต่ำไม่มีบทลงโทษจาก NPC')}</p><Provenance game={game} item={item} rebate={listing.rebate}/><AppraisalPrice item={item}/><ItemFacts item={item}/>
    {listing.purchase?<form onSubmit={e=>{e.preventDefault();if(valid)submit({type:'propose',sellerId:listing.ownerId,itemId:item.id,credits:price,...(swap?{swapItemId:swap}:{}),condition:useCondition,...(disputed?{challenge:disputed}:{}),...(seal?{sealId:seal.id}:{})});}}>
      {claimKeys.length>0 && <div className="claim-box"><h4>{t('ผู้ประเมินระบุว่า:')} {claimKeys.map(k=>claimText(k,claims![k]!)).join(' · ')}</h4>
        <ChoiceCards compact legend={t('ท้าทายคำระบุไหม')} value={disputed} onChange={setChallenge} disabled={disabled} options={[{value:'',title:t('เชื่อตามที่ระบุ'),tone:'quiet'},...claimKeys.map(k=>({value:k,title:t('ท้าทาย: {v}',{v:claimText(k,claims![k]!)})}))]}/>
        {disputed && <p>{t('ถ้าคำระบุเป็นเท็จ คุณลดราคา')} <strong>{t('{n} เครดิต',{n:winOff})}</strong> ({t('{pct}% ของราคาประเมิน {quote}',{pct:winPct(lenses),quote})}{lenses?t(' · แว่นจับพิรุธ {n} ชิ้นช่วยเพิ่ม',{n:lenses}):''}) · {t('ถ้าเป็นจริง คุณจ่ายผู้ประเมินเพิ่ม')} <strong>{t('{n} เครดิต',{n:lossFee})}</strong> ({t('{pct}% ของราคาประเมิน',{pct:CHALLENGE_PCT})}) · {t('ตัดสินตอนผู้ขายตอบรับ ไม่รวมค่านายหน้า')}</p>}
        {disputed && seals.length>0 && <ChoiceCards compact legend={t('แนบตราโมฆะ (ยกเลิกค่าปรับถ้าท้าทายผิด)')} value={seal?seal.id:''} onChange={setSealPick} disabled={disabled} options={[{value:'',title:t('ไม่แนบ'),tone:'quiet'},...seals.map(i=>({value:i.id,title:itemName(i.kind),art:i.image,detail:t('ใช้แล้วหมดเมื่อมีผลยกเลิก')}))]}/>}</div>}
      <div className="field"><label htmlFor={id}>{source==='npc'?t('ค่าแนะนำที่จะให้นักประเมิน'):t('เครดิตที่เสนอให้เจ้าของ')}</label><input id={id} type="number" inputMode="numeric" min="0" max="1000" step="1" value={credits} onChange={e=>setCredits(e.target.value)} disabled={disabled || !!(seller?.paused || seller?.done)}/></div>
      {source==='inventory'?<ChoiceCards legend={t('แลกของเพิ่ม (ไม่บังคับ)')} value={swap} onChange={setSwap} disabled={disabled || !!(seller?.paused || seller?.done)} options={[{value:'',title:t('ไม่แลกของ'),tone:'quiet'},...game.self.inventory.filter(i=>i.lockedUntil===null).map(i=>({value:i.id,title:itemName(i.kind),art:i.image,detail:inventoryLabel(game,i)}))]}/>:<Contract item={item} condition={useCondition} setCondition={setCondition} disabled={disabled} survival={!!game.survival}/>}
      <p>{t('เมื่อผู้ขายยอมรับ จ่ายรวม {total} เครดิต',{total:valid?price+npcPrice:'—'})}{source==='npc'?` (${t('{n} ให้ NPC + {m} ค่าแนะนำ',{n:npcPrice,m:valid?price:'—'})}) · ${tradeEnergy===0?t('ไม่เสียพลัง'):t('{n} พลัง',{n:tradeEnergy})}`:t(' · ไม่ใช้พลัง')}{swap?t(' และโอนสินค้าที่เลือกให้ผู้ขาย'):''}</p>
      {seller?.paused || seller?.done?<p className="why" role="status">{t('เจ้าของพักหรือจบช่วงแล้ว ยื่นข้อเสนอไม่ได้')}</p>:<>{(()=>{const why=!valid?t('ใส่จำนวนเต็ม 0–1000'):pending>=8?t('มีข้อเสนอค้างครบ 8 รายการแล้ว'):price+npcPrice+(disputed?lossFee:0)>game.self.credits?t('เครดิตไม่พอ ต้องใช้ {need}{extra} มี {have}',{need:price+npcPrice+(disputed?lossFee:0),extra:disputed?t(' (รวมค่าปรับสำรองถ้าท้าทายผิด)'):'',have:game.self.credits}):source==='npc' && game.self.energy<purchaseEnergy(game)?t('พลังไม่พอ ต้องใช้ {need} มี {have}',{need:purchaseEnergy(game),have:game.self.energy}):null;
        return <><button disabled={disabled || !!why} title={tip(disabled&&locked,why)}>{t('ยื่นข้อเสนอให้ {name}',{name})}</button>{why && !disabled && <p className="why" role="status">{why}</p>}</>;})()}</>}
    </form>:<p>{t('เจ้าของเปิดให้ชมอย่างเดียว ยังซื้อไม่ได้')}</p>}
    {source==='npc' && game.brokerage && (game.self.darkTickets??0)>=TRUST_RULES.ticketsToForce && (()=>{
      const cost=purchasePrice(game,[item],item.condition.required);const short=needShort(game,{credits:cost,energy:tradeEnergy});
      const why=seller?.paused==='dead'?t('เจ้าของไม่อยู่แล้ว'):short;
      return <div className="force-buy"><p>{t('ตั๋วคำสั่งมืดครบ {n} ใบ · บังคับซื้อตามราคาประเมิน {price} เครดิต เจ้าของปฏิเสธหรือต่อรองไม่ได้',{n:TRUST_RULES.ticketsToForce,price:cost})}</p>
        <button type="button" disabled={disabled || !!why} title={tip(disabled&&locked,why)} onClick={()=>submit({type:'force-buy',sellerId:listing.ownerId,itemId:item.id})}><span className="ticket-cost" aria-hidden="true">{Array.from({length:TRUST_RULES.ticketsToForce},(_,i)=><TicketIcon key={i}/>)}</span>{t('บังคับซื้อ · ใช้ตั๋ว {n} ใบ',{n:TRUST_RULES.ticketsToForce})}</button>{why && !disabled && <p className="why" role="status">{why}</p>}</div>;})()}
  </div></article>;
}
export function Trades({game,room,submit,disabled}:Actions&{room:AppraisalRoomView}) {
  const locked=useLock();
  const listings=game.listings.filter(l=>l.ownerId!==game.self.id);
  const name=(id:string)=>room.matchSeats.find(s=>s.id===id)?.name??t('ผู้เล่น');
  return <section className="trades"><h2>{t('ต่อรองกับนักประเมินคนอื่น')}</h2><p>{t('เจ้าของต้องเปิดรายการและตอบรับก่อนโอนของกับเงิน ราคาต่ำหรือ 0 เครดิตไม่มีผลจับผิดจาก NPC')}</p>
    {!listings.length?<p>{t('ยังไม่มีใครเปิดรายการ เปิดของจากคลังหรือร้านที่ประเมินแล้วให้เพื่อนยื่นข้อเสนอ')}</p>:listings.map(listing=><TradeListing key={listing.itemId} game={game} listing={listing} room={room} submit={submit} disabled={disabled}/>)}
    <h3>{t('ข้อเสนอซื้อขายของคุณ')}</h3>{!game.trades.length?<p>{t('ยังไม่มีข้อเสนอ')}</p>:<ul className="offers">{game.trades.map(tr=><li key={tr.id}><p><strong>{itemName(tr.item.kind)}</strong> · {t('{buyer} เสนอ {n} เครดิต',{buyer:name(tr.buyerId),n:tr.credits})}{tr.source==='npc'?t(' เป็นค่าแนะนำ นอกเหนือจากราคาพ่อค้า'):''}{tr.swapItem?t(' + แลก {name}',{name:itemName(tr.swapItem.kind)}):''} {t('ให้ {seller}',{seller:name(tr.sellerId)})}</p><AppraisalPrice item={tr.item}/>{tr.swapItem && <div className="swap-details"><h3>{t('ของแลกจาก {buyer}: {name}',{buyer:name(tr.buyerId),name:itemName(tr.swapItem.kind)})}</h3><img src={tr.swapItem.image} width="1254" height="1254" alt={itemName(tr.swapItem.kind)}/><AppraisalPrice item={tr.swapItem}/><ItemFacts item={tr.swapItem}/><p>{t('ผลที่เป็นไปได้:')} <Rich text={tr.swapItem.possibleBenefit} survival={!!game.survival}/> · <Rich text={tr.swapItem.possibleDrawback} survival={!!game.survival}/></p></div>}<p>{tr.challenge?t('ผู้ซื้อท้าทายคำระบุ "{v}"{seal} · ',{v:claimText(tr.challenge,(game.listings.find(l=>l.itemId===tr.itemId)?.claims?.[tr.challenge])??true),seal:tr.sealId?t(' แนบตราโมฆะ'):''}):''}{tr.condition?t('ผู้ซื้อยอมรับเงื่อนไข NPC · '):''}{tr.status==='open'?t('รอผู้ขายตอบรับ'):tr.status==='accepted'?t('ตกลงและโอนสำเร็จแล้ว'):t('ปฏิเสธหรือหมดอายุแล้ว')}</p>{tr.sellerId===game.self.id && tr.status==='open' && <div className="actions"><button className="primary" disabled={disabled || !!game.self.eventOffer && isConsequence(game.self.eventOffer.id)} title={tip(disabled&&locked,t('ตอบเหตุการณ์ก่อน'))} onClick={()=>submit({type:'respond',offerId:tr.id,accept:true})}>{t('ตกลงและโอนทันที')}</button><button disabled={disabled || !!game.self.eventOffer && isConsequence(game.self.eventOffer.id)} title={tip(disabled&&locked,t('ตอบเหตุการณ์ก่อน'))} onClick={()=>submit({type:'respond',offerId:tr.id,accept:false})}>{t('ปฏิเสธ')}</button></div>}</li>)}</ul>}
  </section>;
}
