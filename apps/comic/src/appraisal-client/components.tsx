import { STATUS_ITEM_TARGETS } from '../game/appraisal/status-item-targets.js';
import {createPortal} from 'react-dom';
import {ComicTooltip} from './ComicTooltip.js';
import {ComicButton,ComicDestination,CompactPager} from './ComicUI.js';
import {AuthenticityIcon, InfoIcon, AuctionIcon, EnvelopeIcon, EyeIcon} from './icons.js';
import { Pager } from './Pager.js';
import { rarityValue } from '../shared/rarity-power.js';
import { ItemVisual, RarityLabel } from './ItemVisual.js';
import { copySaleQuote, itemEffectScale } from '../game/appraisal/copy-effects.js';
import { pick } from './i18n.js';
import { AbilityItemControls } from './MerchantAbilities.js';
import { abilityItemLabel } from './ability-text.js';
import { ABILITY_ITEM_IDS } from '../game/appraisal/types.js';
import { marketBonus, marketCost, marketRequirements, MarketSale } from './MarketSale.js';
import { PortalEventPreview, portalChoiceTitle } from './PortalEventPreview.js';
import { isCore2Event } from './core2-text.js';
import { passiveSpec } from '../game/appraisal/passives.js';
import { loanItemCount } from './model.js';
import { appraisalCost, freeInspectionRemaining, inspectionQuota } from './model.js';
import { CHALLENGE_PCT, challengeDiscount, challengePenalty, winPct } from '../game/appraisal/challenge-rules.js';
import type { ClaimKey } from '../game/appraisal/challenge-rules.js';
import { WISH_CAP, WISH_FLOOR } from '../game/appraisal/wishlist-rules.js';
import { CLEANSE_CAP, CLEANSE_TOOLS, CLEANSE_TRUST_CHANCE, CLEANSE_TRUST_PRICE } from '../game/appraisal/cleanse-rules.js';
import { TRUST_CAP } from '../game/appraisal/market-contracts.js';
import { TRUST_RULES } from '../game/appraisal/pulse.js';
import { Provenance } from './meters.js';
import { useEffect, useId, useRef, useState } from 'react';
import type { ReactElement, RefObject } from 'react';
import { ITEM_SPECS, itemImage } from '../game/appraisal/content.js';
import type { AppraisalView, EventOffer, ItemView, MarketOrder } from '../game/appraisal/types.js';
import type { AppraisalRoomView } from '../shared/appraisal-protocol.js';
import { possibleBenefitText, possibleDrawbackText, salePctText, activationBlock, activationOutcome, choiceTitle, effectsInspectionLabel, effectsKnownFor, eventCatalog, eventItemUsable, eventNeeds, inspectionBlock, itemScoreRange, needShort, purchaseBlock, eventCost, eventDecision, eventFacts, eventItemName, eventNeedsItem, eventNeedsStatus, eventStatusOptions, factLabel, hasStatus, inspectionCost, inventoryLabel, marketOptions, purchaseEnergy, purchasePrice, readable, riskRange, stepPrice, scoreStatusText, eventScoreText, statusName, isConsequence, bondOf, unsoldItems, unsoldPenaltyText, consignText } from './model.js';
import type { Decision } from './model.js';
import { ChoiceCards, ItemTerm, Rich, StatusTerm } from './lore.js';
import { AppraiseIcon, BookIcon, BuffIcon, BuyIcon, CloseIcon, CoinIcon, DebuffIcon, EventIcon, EnergyIcon, FlameIcon, InspectIcon, MarketIcon, MinusIcon, PlusIcon, RebateIcon, TicketIcon, TrustIcon } from './icons.js';
import { t } from './i18n.js';
import { tip, useLock } from './reasons.js';
import { itemName, npcName, passiveText, statusDescription, statusDuration, toolText } from './catalog-text.js';

/** Challenge claim text in the active language. */
const claimText=(key:ClaimKey,value:boolean)=>key==='genuine'?(value?t('เป็นของแท้'):t('เป็นของปลอม')):(value?t('มีคำสาป'):t('ไม่มีคำสาป'));

export interface Actions { game:AppraisalView; submit:(action:Decision)=>void; disabled:boolean }
/** The item's known facts as a row of seals: what the appraiser has learned at a glance, details below. */
export function FactSeals({item}:{item:ItemView}) {
  const k=item.knowledge;
  const seal=(key:string,icon:ReactElement,label:string,value:string,state:'unknown'|'good'|'bad'|'known')=><li key={key} className={`seal ${state}`} data-seal={key} title={`${label}: ${value}`}>{icon}<span className="seal-label">{label}</span><strong>{value}</strong></li>;
  return <ul className="fact-seals" aria-label={t('สิ่งที่รู้แล้ว')}>
    {seal('base',<CoinIcon/>,t('มูลค่าจริง'),k.base!==undefined?t('{n} เครดิต',{n:k.base}):k.range?`${k.range[0]}–${k.range[1]}`:'?',k.base!==undefined?'known':'unknown')}
    {seal('genuine',<AuthenticityIcon/>,t('ความแท้'),k.genuine===undefined?'?':k.genuine?t('ของแท้'):t('ของปลอม'),k.genuine===undefined?'unknown':k.genuine?'good':'bad')}
    {seal('cursed',<FlameIcon/>,t('คำสาป'),k.cursed===undefined?'?':k.cursed?t('มีคำสาป'):t('ไม่มีคำสาป'),k.cursed===undefined?'unknown':k.cursed?'bad':'good')}
    {item.certificate && seal('certificate',<TrustIcon/>,t('ใบรับรองพ่อค้า'),k.certificate===undefined?'?':k.certificate?t('ตรวจแล้วตรงความจริง'):t('ตรวจแล้วเป็นเท็จ'),k.certificate===undefined?'unknown':k.certificate?'good':'bad')}
    {item.overpriced && seal('overpriced',<CoinIcon/>,pick('ราคาเกินจริง','Overpriced'),pick('ขายให้ระบบ 0 เครดิต จนกว่าจะประเมินใหม่สำเร็จ','System sales pay 0 credits until successful reappraisal.'),'bad')}
  </ul>;
}
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
export function Inspect({game,item,submit,disabled,compact=false}:Actions&{item:ItemView;compact?:boolean}) {
  const locked=useLock();
  const price=inspectionCost(game,'price',item),auth=inspectionCost(game,'authenticity',item),effects=inspectionCost(game,'effects',item);
  const quiet=disabled;const lock=inspectionBlock(game,quiet,item);
  const blocked=disabled || !!lock;
  const effectsLabel=effectsInspectionLabel(game);
  const effectsDone=effectsKnownFor(game,item.knowledge);
  const short=(cost:number)=>blocked?null:game.self.energy<cost?t('พลังไม่พอ ต้องใช้ {need} มี {have}',{need:cost,have:game.self.energy}):null;
  const notes=[lock,short(price)&&`${t('ตรวจราคา')}: ${short(price)}`,short(auth)&&`${t('ตรวจความแท้')}: ${short(auth)}`,short(effects)&&`${effectsLabel}: ${short(effects)}`].filter(Boolean);
  const inspectWhy=(cost:number,known:boolean,knownText:string)=>tip(known&&knownText,disabled&&locked,lock,short(cost));
  const help=<>
    {(['price','authenticity','effects'] as const).some(p=>freeInspectionRemaining(game,p)>0) && <details className="inspection-remaining"><summary>{pick('สิทธิ์ตรวจที่เหลือ','Remaining inspections')}</summary><p className="positive-text">{t('สิทธิ์ฟรีที่เหลือช่วงนี้: ราคา {price} · ความแท้ {auth} · {kind} {effects}',{price:freeInspectionRemaining(game,'price'),auth:freeInspectionRemaining(game,'authenticity'),kind:game.curseSight?t('คำสาป'):t('ผลสินค้า'),effects:freeInspectionRemaining(game,'effects')})}</p></details>}
    {game.curseSight && <details className="inspection-help"><summary>{pick('ความแท้กับคำสาปต่างกันอย่างไร','Authenticity and curses')}</summary><p>{t('ตรวจคำสาปเปิดว่าสินค้ามีคำสาปหรือไม่ ความแท้กับคำสาปเป็นคนละเรื่อง ของแท้อาจมีคำสาป และของปลอมอาจไม่มี')}</p></details>}
  </>;
  return <div className="inspection">
    <p>{compact?(item.freeMerchantAction?pick('ตรวจหรือตีราคาฟรี 1 ครั้ง','Inspect or appraise once for free'):t('ตรวจได้อีก {n} ครั้งในช่วงนี้',{n:Math.max(0,inspectionQuota(game)-game.self.inspections)})):item.freeMerchantAction?t('สินค้าชิ้นนี้ตรวจสอบหรือประเมินฟรี 1 ครั้ง เลือกอย่างใดอย่างหนึ่ง'):t('ตรวจได้อีก {n} ครั้งในช่วงนี้ · ราคา {price} / ความแท้ {auth} / {kind} {effects} พลัง{fog}',{n:Math.max(0,inspectionQuota(game)-game.self.inspections),price,auth,kind:game.curseSight?t('คำสาป'):t('ผลสินค้า'),effects,fog:hasStatus(game,'D02')?t(' · หมอกราคาบังมูลค่าจริงอยู่'):''})}</p>
    <div className="actions">
      <button className="inspect" disabled={blocked || game.self.energy<price || item.knowledge.base!==undefined} title={inspectWhy(price,item.knowledge.base!==undefined,t('รู้มูลค่าจริงของชิ้นนี้แล้ว'))} onClick={()=>submit({type:'inspect',itemId:item.id,property:'price'})}><InspectIcon/>{t('ตรวจราคา')}{item.knowledge.base!==undefined?t(' · รู้แล้ว'):price===0?t(' · ฟรี'):t(' · {n} พลัง',{n:price})}</button>
      <button className="inspect" disabled={blocked || game.self.energy<auth || item.knowledge.genuine!==undefined} title={inspectWhy(auth,item.knowledge.genuine!==undefined,t('รู้ความแท้ของชิ้นนี้แล้ว'))} onClick={()=>submit({type:'inspect',itemId:item.id,property:'authenticity'})}><AuthenticityIcon/>{t('ตรวจความแท้')}{item.knowledge.genuine!==undefined?t(' · รู้แล้ว'):auth===0?t(' · ฟรี'):t(' · {n} พลัง',{n:auth})}</button>
      <button className="inspect" disabled={blocked || game.self.energy<effects || effectsDone} title={inspectWhy(effects,effectsDone,t('ตรวจผลของชิ้นนี้ไปแล้ว'))} onClick={()=>submit({type:'inspect',itemId:item.id,property:'effects'})}><FlameIcon/>{effectsLabel}{effectsDone?t(' · รู้แล้ว'):effects===0?t(' · ฟรี'):t(' · {n} พลัง',{n:effects})}</button>
    </div>
    {!compact && help}
    {notes.length>0 && <p className="why" role="status">{notes.join(' · ')}</p>}
  </div>;
}
/** Merchant offer: pay credits to try to lift a curse. Odds are shown up front and never reach 100%. */
export function CleanseDeal({game,submit,disabled,inline=false,itemId}:Actions&{inline?:boolean;itemId?:string}) {
  const locked=useLock();
  const offer=game.self.cleanseOffer;const stones=game.self.inventory.filter(i=>i.kind==='whetstone');
  const [stoneId,setStoneId]=useState('');
  if(!offer || !game.cleanse) return null;
  if(inline) return <CompactCleanseDeal game={game} submit={submit} disabled={disabled} itemId={itemId}/>;
  const stone=stones.find(i=>i.id===stoneId);
  const trust=game.self.npcTrust?.[offer.npc]??0;
  const quiet=disabled;
  const Container=inline?'section':'details'; const Heading=inline?'h3':'summary';
  return <Container className="cleanse-deal"><Heading>{t('{npc}รับล้างคำสาป',{npc:npcName(offer.npc)})} <span>{t('{n} ชิ้น',{n:offer.items.length})}</span></Heading>
    <p>{t('จ่ายเครดิตแลกโอกาสล้างคำสาปของสินค้าที่คุณถือ ราคาตั้งต้นครึ่งหนึ่งของราคาอ้างอิงชนิดนั้น แล้วสุ่มตามนิสัยพ่อค้า ความไว้ใจ {trust} ลดราคา {price}% และเพิ่มโอกาส {chance} จุดเปอร์เซ็นต์ · จ่ายแล้วไม่คืนแม้ล้างไม่สำเร็จ ไม่เสียพลัง ช่วงละครั้งต่อชิ้น สำเร็จได้สูงสุด {cap}%',{trust,price:trust*CLEANSE_TRUST_PRICE,chance:trust*CLEANSE_TRUST_CHANCE,cap:CLEANSE_CAP})}</p>
    <p className="supporting">{toolText('smith-hammer',CLEANSE_TOOLS['smith-hammer'].text)} · {toolText('whetstone',CLEANSE_TOOLS.whetstone.text)}</p>
    {stones.length>0 && <ChoiceCards compact legend={t('หินขัดสำหรับล้างครั้งนี้')} value={stone?.id??''} onChange={setStoneId} disabled={disabled} options={[{value:'',title:t('ไม่ใช้หินขัด'),tone:'quiet'},...stones.map(i=>({value:i.id,title:abilityItemLabel(i),art:i.image,detail:t('+{n} จุดเปอร์เซ็นต์ · ใช้แล้วหมด',{n:offer.stoneBonus*itemEffectScale(i)})}))]}/>}
    <ul>{offer.items.map(row=>{
      const item=game.self.inventory.find(i=>i.id===row.itemId);if(!item) return null;
      const usable=stone && stone.id!==item.id;const chance=Math.min(CLEANSE_CAP,row.chance+(usable?offer.stoneBonus*itemEffectScale(stone):0));
      const why=quiet?null:game.self.eventOffer?t('ตอบเหตุการณ์ก่อน'):row.done?t('ล้างชิ้นนี้ไปแล้วในช่วงนี้'):item.knowledge.cursed===false?t('รู้แล้วว่าไม่มีคำสาป'):needShort(game,{credits:row.price,energy:0});
      return <li key={row.itemId}><h3><ItemTerm kind={item.kind} item={item}/> · {inventoryLabel(game,item)}</h3><p>{item.knowledge.cursed===undefined?t('ยังไม่รู้ว่ามีคำสาปไหม'):item.knowledge.cursed?t('มีคำสาป'):t('ไม่มีคำสาป')} · {t('ราคา')} <strong>{t('{n} เครดิต',{n:row.price})}</strong> · {t('โอกาสสำเร็จ')} <strong>{chance}%</strong>{usable?t(' (รวมหินขัด)'):''}</p>
        <div className="actions"><button disabled={disabled || !!why} title={tip(disabled&&locked,why)} onClick={()=>submit({type:'cleanse',itemId:row.itemId,...(usable?{stoneId:stone!.id}:{})})}>{t('ล้างคำสาป · {n} เครดิต',{n:row.price})}</button></div>
        {why && <p className="why" role="status">{why}</p>}</li>;})}</ul>
    <p className="supporting">{t('ถ้าสินค้าไม่มีคำสาป พ่อค้าจะบอกว่าไม่พบ และยังคิดค่าบริการ')}</p>
  </Container>;
}
/** A single payable cleansing quote at a time; never hide a quote below the frame. */
function CompactCleanseDeal({game,submit,disabled,itemId}:Actions&{itemId?:string|undefined}) {
  const locked=useLock();
  const [stoneAt,setStoneAt]=useState(0);
  const offer=game.self.cleanseOffer!;
  const stones=game.self.inventory.filter(i=>i.kind==='whetstone');
  const at=Math.min(stoneAt,stones.length);const stone=at?stones[at-1]:undefined;
  return <section className="compact-cleanse"><h3>{pick('ล้างคำสาป','Curse cleansing')}</h3>
    <p>{pick('จ่ายเพื่อสุ่มล้างคำสาป · ไม่เสียพลัง · ชิ้นละครั้งต่อช่วง · ไม่สำเร็จก็เสียค่าบริการ','Pay for a cleansing attempt. No energy cost; once per item per encounter. Fees apply even if unsuccessful.')}</p>
    {stones.length>0 && <nav className="offer-choice" aria-label={pick('เลือกหินขัด','Select whetstone')}><button type="button" disabled={!at} aria-label={pick('หินขัดก่อนหน้า','Previous whetstone')} onClick={()=>setStoneAt(at-1)}>‹</button><span>{stone?inventoryLabel(game,stone):pick('ไม่ใช้หินขัด','No whetstone')}</span><button type="button" disabled={at===stones.length} aria-label={pick('หินขัดถัดไป','Next whetstone')} onClick={()=>setStoneAt(at+1)}>›</button></nav>}
    {offer.items.filter(row=>!itemId || row.itemId===itemId).map(row=>{
      const item=game.self.inventory.find(i=>i.id===row.itemId);if(!item)return null;
      const usable=stone && stone.id!==item.id;
      const chance=Math.min(CLEANSE_CAP,row.chance+(usable?offer.stoneBonus*itemEffectScale(stone):0));
      const why=disabled?null:game.self.eventOffer?t('ตอบเหตุการณ์ก่อน'):row.done?t('ล้างชิ้นนี้ไปแล้วในช่วงนี้'):item.knowledge.cursed===false?t('รู้แล้วว่าไม่มีคำสาป'):needShort(game,{credits:row.price,energy:0});
      return <section key={row.itemId} className="cleanse-quote"><h4>{inventoryLabel(game,item)}</h4><p>{t('โอกาสสำเร็จ {n}%',{n:chance})}{usable?pick(' · ใช้หินขัดแล้วหมดไป',' · Whetstone consumed'):''}</p><button type="button" className="primary" disabled={disabled || !!why} title={tip(disabled&&locked,why)} onClick={()=>submit({type:'cleanse',itemId:row.itemId,...(usable?{stoneId:stone!.id}:{})})}>{t(pick('จ่าย {n} เครดิต เพื่อล้างคำสาป','Pay {n} credits to cleanse'),{n:row.price})}</button>{why && <p className="why" role="status">{why}</p>}</section>;
    })}
  </section>;
}
/** Open wishes, what each is worth now, and the control to ask this merchant for a new one. */
function WishBook({game,submit,disabled,compact=false}:Actions&{compact?:boolean}) {
  const locked=useLock();
  const desk=game.self.wishDesk;const [replace,setReplace]=useState('');
  if(!desk || !game.wishContract) return null;
  const replacement=desk.replaceable.includes(replace as never)?replace:desk.replaceable[0]??'';
  const why=disabled?null:game.self.eventOffer?t('ตอบเหตุการณ์ก่อน'):needShort(game,{credits:0,energy:desk.cost});
  if(compact) return <Pager label={pick('สัญญาตามหาของ','Wanted contracts')}>
    <section className="wish-book"><h3>{pick('ทำสัญญาตามหาของ','New wanted contract')}</h3>
      <p>{t(pick('เปิดคำขอรับซื้อใหม่ · มีได้พร้อมกัน {n} รายการ · ราคารับซื้อลดลงทุกช่วงจนถึงราคาฐาน','Open a new purchase request. Up to {n} contracts; quotes decrease each encounter to their base floor.'),{n:desk.cap})}</p>
      {desk.replaceable.length>0 && <ChoiceCards compact legend={t('สัญญาเต็มแล้ว เลือกรายการเก่าที่จะแทน')} value={replacement} onChange={setReplace} disabled={disabled} options={desk.replaceable.map(n=>({value:n,title:npcName(n)}))}/>}
      <button type="button" className="primary" disabled={disabled || !!why} title={tip(disabled&&locked,why)} onClick={()=>submit({type:'wish-new',...(desk.replaceable.length?{replaceNpc:replacement as never}:{})})}>{t('ทำสัญญาใหม่')} · {t('{n} พลัง',{n:desk.cost})}</button>
      {why && <p className="why" role="status">{why}</p>}
    </section>
    {desk.book.map(row=><section key={row.npc} className="wish-book"><h3>{npcName(row.npc)} · {itemName(row.kind)}</h3><p>{t('รับซื้อตอนนี้')} {t('{n} เครดิต',{n:row.price})}</p><p>{row.price>row.floor?t('ช่วงหน้า {n} เครดิต',{n:row.next}):t('ถึงราคาฐานแล้ว')}</p><p>{t('ฐาน {n} เครดิต · เริ่มที่ {initial}',{n:row.floor,initial:row.initial})}</p></section>)}
  </Pager>;
  return <div className="wish-book"><h4>{t('สัญญาตามหาของ {n}/{cap}',{n:desk.book.length,cap:desk.cap})}</h4>
    <p className="supporting">{compact?pick('จ่ายพลังเพื่อเปิดคำขอรับซื้อใหม่ ราคารับซื้อลดลงทุกช่วงจนถึงราคาฐาน','Spend energy for a new purchase request. Quotes decrease each encounter to their base floor.'):t('ทำสัญญาใหม่ทุกครั้งเสียพลัง {cost} มีได้พร้อมกันสูงสุด {cap} รายการ ทำซ้ำกับพ่อค้าเดิมหรือเลือกแทนรายการเก่าได้ ราคารับซื้อลดลงทุกช่วงแต่ไม่ต่ำกว่าราคาฐานของสินค้า ผลเสียที่ติดตัวไม่ทำให้ราคาฐานต่ำลง',{cost:desk.cost,cap:desk.cap})}</p>
    {!compact && desk.book.length>0 && <ul>{desk.book.map(row=><li key={row.npc}><strong>{npcName(row.npc)}</strong> {t('ตามหา')} <ItemTerm kind={row.kind}/> · {t('ตอนนี้')} <strong>{t('{n} เครดิต',{n:row.price})}</strong>{row.price>row.floor?t(' · ช่วงหน้า {n}',{n:row.next}):t(' · ถึงราคาฐานแล้ว')} · {t('ฐาน {n}',{n:row.floor})} · {t('เริ่มที่ {n}',{n:row.initial})}{row.npc===desk.npc?t(' · พ่อค้าที่อยู่ตรงนี้'):''}</li>)}</ul>}
    {desk.replaceable.length>0 && <ChoiceCards compact legend={t('สัญญาเต็มแล้ว เลือกรายการเก่าที่จะแทน')} value={replacement} onChange={setReplace} disabled={disabled} options={desk.replaceable.map(n=>({value:n,title:t('แทนคำขอของ {name}',{name:npcName(n)}),detail:desk.book.find(r=>r.npc===n)?t('{item} · {n} เครดิต',{item:itemName(desk.book.find(r=>r.npc===n)!.kind),n:desk.book.find(r=>r.npc===n)!.price}):''}))}/>}
    <div className="actions"><button disabled={disabled || !!why} title={tip(disabled&&locked,why)} onClick={()=>submit({type:'wish-new',...(desk.replaceable.length?{replaceNpc:replacement as never}:{})})}>{desk.replaces?t('ให้พ่อค้าตั้งคำขอใหม่แทนของเดิม'):desk.replaceable.length?t('ทำสัญญาใหม่แทนรายการที่เลือก'):t('ให้พ่อค้านี้บอกของที่อยากได้')} · {t('{n} พลัง',{n:desk.cost})}</button></div>
    {why && <p className="why" role="status">{why}</p>}</div>;
}
/** A merchant that said what it wants: sell it here, optionally asking above the offer at lower odds. */
export function WishDeal({game,submit,disabled,compact=false}:Actions&{compact?:boolean}) {
  const locked=useLock();
  const wish=game.self.wishOffer;const [markup,setMarkup]=useState(0);const [picked,setPicked]=useState('');
  if(!game.wishlist || (!wish && !game.self.wishDesk)) return null;
  if(!wish && compact) return <section className="wish-deal"><WishBook game={game} submit={submit} disabled={disabled} compact/></section>;
  if(!wish) return <section className="wish-deal" aria-labelledby="wish-title"><h3 id="wish-title">{t('พ่อค้านี้ยังไม่ได้บอกของที่อยากได้')}</h3><WishBook game={game} submit={submit} disabled={disabled}/></section>;
  const held=wish.itemIds.map(id=>game.self.inventory.find(i=>i.id===id)).filter((i):i is ItemView=>!!i);
  const itemId=held.some(i=>i.id===picked)?picked:held[0]?.id??'';
  const selected=held.find(i=>i.id===itemId);const overpriced=!!selected?.overpriced;
  const option=wish.options.find(o=>o.markup===markup)??wish.options[0]!;
  const quote=(o:typeof option)=>wish.itemQuotes?.[itemId]?.find(q=>q.markup===o.markup)?.price??copySaleQuote(selected??{},o.price);
  const reference=(price:number)=>selected?copySaleQuote(selected,rarityValue(selected,price)):price;
  const why=disabled?null:game.self.eventOffer?t('ตอบเหตุการณ์ก่อน'):wish.tried?t('ต่อรองกับพ่อค้านี้แล้วในช่วงนี้ รอครั้งหน้า'):!held.length?t('ยังไม่มีของที่พ่อค้าต้องการ'):null;
  const deal=<section className="wish-deal" aria-labelledby="wish-title"><h3 id="wish-title">{compact?pick('รับซื้อของที่ตามหา','Wanted item'):t('{npc}ตามหา',{npc:npcName(wish.npc)})} {compact?itemName(wish.kind):<ItemTerm kind={wish.kind}/>}</h3>
    {!compact && <p>{t('รับซื้อตอนนี้')} <strong>{t('{n} เครดิต',{n:overpriced?0:reference(wish.price)})}</strong>{!overpriced && <>{wish.price>wish.floor?t(' · ช่วงหน้า {next} · ต่ำสุด {floor} (ราคาฐาน ผลเสียไม่ลดราคาฐาน)',{next:reference(wish.next),floor:reference(wish.floor)}):t(' · ถึงราคาฐานแล้ว {floor} เครดิต จะไม่ลดอีก',{floor:reference(wish.floor)})} · {t('เริ่มที่ {n}',{n:reference(wish.initial)})}</>} · {t('ขอเพิ่มได้แต่โอกาสตกลงลดลง โอกาสคิดจากความไว้ใจ {trust}/{cap} (+{tb}) ผลดีที่ติดตัว {buffs} อย่าง (+{bb}) ผลเสีย {debuffs} อย่าง (−{db}) · อยู่ระหว่าง {lo}–{hi}% เสมอ',{trust:wish.trust,cap:TRUST_CAP,tb:wish.trust*3,buffs:wish.buffs,bb:wish.buffs*4,debuffs:wish.debuffs,db:wish.debuffs*4,lo:WISH_FLOOR,hi:WISH_CAP})}</p>}
    {overpriced && <p className="danger-text" role="status">{pick('ราคาเกินจริง · ขายให้ระบบ 0 เครดิต จนกว่าจะประเมินใหม่สำเร็จ','Overpriced · System sales pay 0 credits until successful reappraisal.')}</p>}
    <p className="supporting">{compact?pick('ขายได้ครั้งเดียวต่อช่วง · ขอราคาเพิ่มได้ แต่โอกาสตกลงลดลง · ของปลอมเสี่ยงถูกจับได้','One sale attempt per encounter. Asking more reduces acceptance; fakes risk detection.'):t('ต่อรองได้ครั้งเดียวต่อช่วง ถ้าไม่ตกลงยังรอของชิ้นนี้ในครั้งหน้า พ่อค้าอาจจับได้ถ้าเป็นของปลอม')}{salePctText(game)?` · ${salePctText(game)} ${t('ราคาที่แสดงปรับแล้ว')}`:''}</p>
    {held.length>1 && (compact?<nav className="offer-choice" aria-label={t('เลือกชิ้นที่จะขาย')}><button type="button" disabled={disabled || itemId===held[0]!.id} aria-label={pick('สินค้าก่อนหน้า','Previous item')} onClick={()=>setPicked(held[held.findIndex(i=>i.id===itemId)-1]!.id)}>‹</button><span>{inventoryLabel(game,selected!)}</span><button type="button" disabled={disabled || itemId===held.at(-1)!.id} aria-label={pick('สินค้าถัดไป','Next item')} onClick={()=>setPicked(held[held.findIndex(i=>i.id===itemId)+1]!.id)}>›</button></nav>:<ChoiceCards compact legend={t('เลือกชิ้นที่จะขาย')} value={itemId} onChange={setPicked} disabled={disabled} options={held.map(i=>({value:i.id,title:inventoryLabel(game,i),art:i.image,item:i}))}/>)}
    {held.length>0 && <ChoiceCards compact legend={t('ราคาที่ขอ')} value={String(markup)} onChange={v=>setMarkup(Number(v))} disabled={disabled} options={wish.options.map(o=>({value:String(o.markup),title:`${t('{n} เครดิต',{n:overpriced?0:quote(o)})}${o.markup && !overpriced?` (+${o.markup}%)`:''}`,detail:t('โอกาสตกลง {n}%',{n:o.chance})}))}/>}
    <div className="actions"><button className="primary" disabled={disabled || !!why || !itemId} title={tip(disabled&&locked,why,!itemId&&t('ยังไม่มีสินค้าที่เลือกขายได้'))} onClick={()=>submit({type:'wish-sell',itemId,markup})}>{t('ขายให้พ่อค้า · {n} เครดิต · {chance}%',{n:overpriced?0:quote(option),chance:option.chance})}</button></div>
    {why && <p className="why" role="status">{why}</p>}
    {!compact && <WishBook game={game} submit={submit} disabled={disabled}/>}</section>;
  return compact?<Pager label={pick('ข้อเสนอรับซื้อ','Purchase requests')}>{deal}{game.self.wishDesk && <WishBook game={game} submit={submit} disabled={disabled} compact/>}</Pager>:deal;
}
const claimChoice=(value:boolean|undefined)=>value===undefined?'':String(value);
const fromChoice=(value:string):boolean|undefined=>value===''?undefined:value==='true';
export function Share({game,item,submit,disabled,optionsHost,onOptionsChange,comic=false}:Actions&{item:ItemView;comic?:boolean;optionsHost?:HTMLElement|null;onOptionsChange?:(open:boolean)=>void}) {
  const [optionsOpen,setOptionsOpen]=useState(false);
  const locked=useLock();
  const listing=game.listings.find(l=>l.ownerId===game.self.id && l.itemId===item.id);
  const maySell=item.owner===game.self.id?item.lockedUntil===null:item.appraisal!==null;
  const shopItem=item.owner.startsWith('npc:') && !!game.challenge;
  const [genuine,setGenuine]=useState(claimChoice(listing?.claims?.genuine));const [cursed,setCursed]=useState(claimChoice(listing?.claims?.cursed));
  const claims={...(fromChoice(genuine)!==undefined?{genuine:fromChoice(genuine)!}:{}),...(fromChoice(cursed)!==undefined?{cursed:fromChoice(cursed)!}:{})};
  const [rebate,setRebate]=useState(String(listing?.rebate??0));const rebateId=useId();
  const rebateValue=Number(rebate);const rebateOk=rebate.trim()!=='' && Number.isSafeInteger(rebateValue) && rebateValue>=0 && rebateValue<=1000 && rebateValue<=game.self.credits;
  const sell=()=>submit({type:'share',itemId:item.id,allow:true,purchase:true,...(shopItem && Object.keys(claims).length?{claims}:{}),...(rebateValue?{rebate:rebateValue}:{})});
  const show=()=>submit({type:'share',itemId:item.id,allow:true,purchase:false});
  const hide=()=>submit({type:'share',itemId:item.id,allow:false,purchase:false});
  const saleBlocked=disabled || !maySell || !rebateOk || !!listing?.purchase && !shopItem;
  const saleReason=disabled?locked:!maySell?(item.owner===game.self.id?t('สินค้าติดล็อก · ยังประกาศขายไม่ได้'):t('ยังไม่ประเมิน · ประกาศขายไม่ได้')):!rebateOk?t('ใส่ค่าแถมจำนวนเต็ม 0–1000 และไม่เกินเครดิตที่มี'):listing?.purchase&&!shopItem?t('ประกาศขายแล้ว'):'';
  if(comic)return <div className="comic-sale-controls">
    <p className="comic-sale-state" role="status"><EyeIcon/>{listing?listing.purchase?t('ประกาศขายแล้ว เพื่อนยื่นข้อเสนอได้'):t('โชว์ให้เพื่อนดูอย่างเดียว'):t('ยังไม่มีใครเห็นชิ้นนี้')}</p>
    <section className="comic-sale-claims"><h3 className="comic-sale-heading">{shopItem?t('คำระบุให้ผู้ซื้อ'):t('การขายสินค้า')}<ComicTooltip content={t('ผู้ซื้อท้าทายคำระบุได้ ถ้าคุณพูดไม่จริงและถูกจับ ผู้ซื้อลดราคา {pct}% ของราคาประเมิน (ไม่รวมค่านายหน้า) ถ้าคุณพูดจริง ผู้ท้าทายต้องจ่ายคุณ {pct}% ของราคาประเมิน',{pct:CHALLENGE_PCT})}><button type="button" className="comic-info" aria-label={t('กติกาคำระบุและการท้าทาย')}><InfoIcon/></button></ComicTooltip></h3>
      {shopItem?<><p className="comic-sale-note">{t('เป็นคำระบุ ไม่ใช่ผลตรวจ')}</p><ChoiceCards compact legend={t('ความแท้')} value={genuine} onChange={setGenuine} disabled={disabled} options={[{value:'',title:t('ไม่ระบุ')},{value:'true',title:t('ของแท้')},{value:'false',title:t('ของปลอม')}]}/><ChoiceCards compact legend={t('คำสาป')} value={cursed} onChange={setCursed} disabled={disabled} options={[{value:'',title:t('ไม่ระบุ')},{value:'false',title:t('ไม่มีคำสาป')},{value:'true',title:t('มีคำสาป')}]}/></>:<p className="comic-sale-note">{t('เปิดรายการให้ผู้เล่นอื่นยื่นข้อเสนอ หรือโชว์ให้ดูอย่างเดียว')}</p>}
    </section>
    <section className="comic-sale-rebate"><div className="comic-sale-rebate-row"><h3 className="comic-sale-heading"><label htmlFor={rebateId}>{t('ค่าแถมให้ผู้ซื้อ')}</label><CoinIcon/><ComicTooltip content={t('ผู้ขายจ่ายให้ผู้ซื้อเมื่อขายสำเร็จ จำนวนเต็ม 0–1000 และไม่เกินเครดิตที่มี')}><button type="button" className="comic-info" aria-label={t('รายละเอียดค่าแถม')}><InfoIcon/></button></ComicTooltip></h3><div className="comic-sale-stepper"><ComicButton aria-label={t('ลดค่าแถม 1 เครดิต')} disabled={disabled || !maySell || rebateValue<=0} onClick={()=>setRebate(stepPrice(rebate,-1))}><MinusIcon/></ComicButton><input id={rebateId} aria-label={t('ค่าแถมให้ผู้ซื้อ')} type="number" inputMode="numeric" min="0" max={Math.min(1000,game.self.credits)} step="1" value={rebate} onChange={e=>setRebate(e.target.value)} disabled={disabled || !maySell}/><ComicButton aria-label={t('เพิ่มค่าแถม 1 เครดิต')} disabled={disabled || !maySell || rebateValue>=Math.min(1000,game.self.credits)} onClick={()=>setRebate(stepPrice(rebate,1))}><PlusIcon/></ComicButton></div></div><p className="comic-sale-note">{t('จ่ายเมื่อขายสำเร็จ')}</p></section>
    <footer className="comic-sale-footer"><p className={saleBlocked?'comic-sale-reason':'comic-sale-note'}>{saleReason||t('เลือกประกาศขายเพื่อรับข้อเสนอจากผู้เล่นอื่น')}</p><div className="comic-sale-actions"><ComicButton tone="primary" disabled={saleBlocked} title={saleReason||undefined} onClick={sell}>{listing?.purchase&&shopItem?t('แก้คำระบุ'):t('ประกาศขาย')}</ComicButton><ComicButton disabled={disabled || !!listing&&!listing.purchase} onClick={show}><EyeIcon/>{t('โชว์ให้ดู')}</ComicButton></div>{listing&&<ComicButton className="comic-sale-withdraw" disabled={disabled} onClick={hide}>{t('เก็บกลับ')}</ComicButton>}</footer>
  </div>;
  return <div className="sharing">
    <div className="sharing-status"><span className={`listing-state ${listing?listing.purchase?'listed':'shown':'unlisted'}`}>{listing?listing.purchase?t('ประกาศขายแล้ว เพื่อนยื่นข้อเสนอได้'):t('โชว์ให้เพื่อนดูอย่างเดียว'):t('ยังไม่มีใครเห็นชิ้นนี้')}</span><Provenance game={game} item={item}/></div>
    <div className="actions sharing-actions">
      <button className="primary" disabled={disabled || !maySell || !rebateOk || !!listing?.purchase && !shopItem} title={tip(disabled&&locked,!maySell&&t('ขายชิ้นนี้ไม่ได้ตอนนี้ (ติดล็อกหรือยังไม่ได้ประเมิน)'),!rebateOk&&t('ค่าแถมไม่ถูกต้อง'),!!listing?.purchase&&!shopItem&&t('ประกาศขายอยู่แล้ว'))} onClick={sell}>{listing?.purchase && shopItem?t('แก้คำระบุ'):t('ประกาศขาย')}</button>
      <button disabled={disabled || !!listing && !listing.purchase} title={tip(disabled&&locked,!!listing&&!listing.purchase&&t('โชว์ให้เพื่อนดูอยู่แล้ว'))} onClick={show}>{t('โชว์ให้ดู')}</button>
      {listing && <button disabled={disabled} title={tip(disabled&&locked)} onClick={hide}>{t('เก็บกลับ')}</button>}
    </div>
    {(shopItem || maySell) && (optionsHost?<><button type="button" className="sharing-options-toggle" aria-expanded={optionsOpen} onClick={()=>{setOptionsOpen(!optionsOpen);onOptionsChange?.(!optionsOpen);}}>{optionsOpen?'ปิดตัวเลือกการขาย':t('ตัวเลือกการขาย')}</button>{optionsOpen&&createPortal(<details className="sharing-options" open><summary>{t('ตัวเลือกการขาย')}{rebateValue>0?` · ${t('ค่าแถม {n} เครดิต',{n:rebateValue})}`:''}{Object.keys(claims).length?` · ${t('มีคำระบุ')}`:''}</summary>
    {shopItem && <div className="claims">
      <ChoiceCards compact legend={t('ระบุความแท้ให้ผู้ซื้อ (ไม่ต้องตรวจก่อนก็ระบุได้)')} value={genuine} onChange={setGenuine} disabled={disabled} options={[{value:'',title:t('ไม่ระบุ'),tone:'quiet'},{value:'true',title:t('บอกว่าเป็นของแท้')},{value:'false',title:t('บอกว่าเป็นของปลอม')}]}/>
      <ChoiceCards compact legend={t('ระบุคำสาปให้ผู้ซื้อ')} value={cursed} onChange={setCursed} disabled={disabled} options={[{value:'',title:t('ไม่ระบุ'),tone:'quiet'},{value:'false',title:t('บอกว่าไม่มีคำสาป')},{value:'true',title:t('บอกว่ามีคำสาป')}]}/>
      <p className="supporting">{t('ผู้ซื้อท้าทายคำระบุได้ ถ้าคุณพูดไม่จริงและถูกจับ ผู้ซื้อลดราคา {pct}% ของราคาประเมิน (ไม่รวมค่านายหน้า) ถ้าคุณพูดจริง ผู้ท้าทายต้องจ่ายคุณ {pct}% ของราคาประเมิน',{pct:CHALLENGE_PCT})}</p>
      {listing?.claims && <p>{t('ที่ระบุไว้: {v}',{v:(['genuine','cursed'] as const).filter(k=>listing.claims![k]!==undefined).map(k=>claimText(k,listing.claims![k]!)).join(' · ')||t('ไม่ระบุ')})}</p>}
    </div>}
    {maySell && <div className="field rebate-field"><label htmlFor={rebateId}><RebateIcon/> {t('ค่าแถมให้ผู้ซื้อ (เครดิต)')}</label><div className="stepper"><button type="button" aria-label={t('ลดค่าแถม 1 เครดิต')} disabled={disabled || rebateValue<=0} title={tip(disabled&&locked,rebateValue<=0&&t('ราคาต่ำสุดคือ 0'))} onClick={()=>setRebate(stepPrice(rebate,-1))}><MinusIcon/></button><input id={rebateId} type="number" inputMode="numeric" min="0" max="1000" step="1" value={rebate} onChange={e=>setRebate(e.target.value)} disabled={disabled}/><button type="button" aria-label={t('เพิ่มค่าแถม 1 เครดิต')} disabled={disabled || rebateValue>=Math.min(1000,game.self.credits)} title={tip(disabled&&locked,rebateValue>=Math.min(1000,game.self.credits)&&t('ใส่จำนวนเต็ม 0–1000 และไม่เกินเครดิตที่มี'))} onClick={()=>setRebate(stepPrice(rebate,1))}><PlusIcon/></button></div><p className="supporting">{rebateOk?t('จ่ายให้ผู้ซื้อเมื่อขายสำเร็จ ใช้ช่วยขายของที่ขายยาก'):t('ใส่จำนวนเต็ม 0–1000 และไม่เกินเครดิตที่มี')}</p></div>}
    </details>,optionsHost)}</>:<details className="sharing-options"><summary>{t('ตัวเลือกการขาย')}{rebateValue>0?` · ${t('ค่าแถม {n} เครดิต',{n:rebateValue})}`:''}{Object.keys(claims).length?` · ${t('มีคำระบุ')}`:''}</summary>
    {shopItem && <div className="claims">
      <ChoiceCards compact legend={t('ระบุความแท้ให้ผู้ซื้อ (ไม่ต้องตรวจก่อนก็ระบุได้)')} value={genuine} onChange={setGenuine} disabled={disabled} options={[{value:'',title:t('ไม่ระบุ'),tone:'quiet'},{value:'true',title:t('บอกว่าเป็นของแท้')},{value:'false',title:t('บอกว่าเป็นของปลอม')}]}/>
      <ChoiceCards compact legend={t('ระบุคำสาปให้ผู้ซื้อ')} value={cursed} onChange={setCursed} disabled={disabled} options={[{value:'',title:t('ไม่ระบุ'),tone:'quiet'},{value:'false',title:t('บอกว่าไม่มีคำสาป')},{value:'true',title:t('บอกว่ามีคำสาป')}]}/>
      <p className="supporting">{t('ผู้ซื้อท้าทายคำระบุได้ ถ้าคุณพูดไม่จริงและถูกจับ ผู้ซื้อลดราคา {pct}% ของราคาประเมิน (ไม่รวมค่านายหน้า) ถ้าคุณพูดจริง ผู้ท้าทายต้องจ่ายคุณ {pct}% ของราคาประเมิน',{pct:CHALLENGE_PCT})}</p>
      {listing?.claims && <p>{t('ที่ระบุไว้: {v}',{v:(['genuine','cursed'] as const).filter(k=>listing.claims![k]!==undefined).map(k=>claimText(k,listing.claims![k]!)).join(' · ')||t('ไม่ระบุ')})}</p>}
    </div>}
    {maySell && <div className="field rebate-field"><label htmlFor={rebateId}><RebateIcon/> {t('ค่าแถมให้ผู้ซื้อ (เครดิต)')}</label><div className="stepper"><button type="button" aria-label={t('ลดค่าแถม 1 เครดิต')} disabled={disabled || rebateValue<=0} title={tip(disabled&&locked,rebateValue<=0&&t('ราคาต่ำสุดคือ 0'))} onClick={()=>setRebate(stepPrice(rebate,-1))}><MinusIcon/></button><input id={rebateId} type="number" inputMode="numeric" min="0" max="1000" step="1" value={rebate} onChange={e=>setRebate(e.target.value)} disabled={disabled}/><button type="button" aria-label={t('เพิ่มค่าแถม 1 เครดิต')} disabled={disabled || rebateValue>=Math.min(1000,game.self.credits)} title={tip(disabled&&locked,rebateValue>=Math.min(1000,game.self.credits)&&t('ใส่จำนวนเต็ม 0–1000 และไม่เกินเครดิตที่มี'))} onClick={()=>setRebate(stepPrice(rebate,1))}><PlusIcon/></button></div><p className="supporting">{rebateOk?t('จ่ายให้ผู้ซื้อเมื่อขายสำเร็จ ใช้ช่วยขายของที่ขายยาก'):t('ใส่จำนวนเต็ม 0–1000 และไม่เกินเครดิตที่มี')}</p></div>}
    </details>)}

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
export type DeskPage='assessment'|'details'|'offers';
type DeskStep='inspect'|'appraise'|'buy';
/** Start where the player left off: a judged item goes straight to buying. */
function openingStep(game:AppraisalView,item:ItemView):DeskStep {
  return item.appraisal!==null || game.self.caught?'buy':item.freeMerchantAction || game.self.inspections<inspectionQuota(game)?'inspect':'appraise';
}
export function AppraisalDesk({game,item,submit,disabled,merchant,stockSelector,page='assessment',onPageChange,offers}:Actions&{item:ItemView;merchant?:ReactElement|undefined;stockSelector?:ReactElement|undefined;page?:DeskPage;onPageChange?:(page:DeskPage)=>void;offers?:ReactElement}) {
  const locked=useLock();
  const [value,setValue]=useState(String(item.knowledge.base??(item.knowledge.range?Math.round((item.knowledge.range[0]+item.knowledge.range[1])/2):item.price)));
  const [danger,setDanger]=useState(false);
  const [condition,setCondition]=useState(item.condition.required);
  const [buyBoth,setBuyBoth]=useState(false);
  const [deskStep,setDeskStep]=useState<DeskStep>(()=>openingStep(game,item));
  useEffect(()=>{if(item.appraisal!==null || game.self.caught) setDeskStep('buy');},[item.appraisal,game.self.caught]);
  useEffect(()=>{if(!item.freeMerchantAction && game.self.inspections>=inspectionQuota(game) && item.appraisal===null && !game.self.caught) setDeskStep(current=>current==='inspect'?'appraise':current);},[game.self.inspections,game.self.inventory,item.freeMerchantAction,item.appraisal,game.self.caught]);
  const pageBack=useRef<HTMLButtonElement>(null);
  useEffect(()=>{if(page!=='assessment')pageBack.current?.focus({preventScroll:true});},[page]);
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
  const name=abilityItemLabel(item);
  const eventFirst=disabled?locked:t('ตอบเหตุการณ์ก่อน');
  const cost=appraisalCost(item);
  const appraiseWhy=!canAct?eventFirst:!valid?t('ใส่จำนวนเต็ม 0–1000'):game.self.energy<cost?t('พลังไม่พอ ต้องใช้ {need} มี {have}',{need:cost,have:game.self.energy}):game.self.caught?t('พ่อค้าจับผิดแล้ว ประเมินไม่ได้'):item.appraisal!==null && game.self.counters>=game.self.counterLimit?t('ต่อรองครบจำนวนครั้งแล้ว'):item.npc==='darkone' && !danger?t('ต้องยอมรับสัญญา Dark One ก่อน'):null;
  const steps:Array<{id:DeskStep;label:string;meta:string}>=[
    {id:'inspect',label:t('ตรวจ'),meta:item.freeMerchantAction?t('ฟรี 1 ครั้ง'):left?t('เหลือ {n} ครั้ง',{n:left}):t('ใช้สิทธิ์ครบ')},
    {id:'appraise',label:t('ตีราคา'),meta:item.appraisal===null?(game.self.caught?t('ถูกจับผิดแล้ว'):t('ยังไม่ตีราคา')):`${item.appraisal} · ${item.appraisalAccepted?t('ตกลง'):t('ปฏิเสธ')}`},
    {id:'buy',label:t('ซื้อ'),meta:t('{n} เครดิต',{n:item.price})},
  ];
  return <section className="desk" aria-label={t('ประเมิน {name}',{name})}>
    <div className="appraisal-visual">
      {merchant}
      <div className="relic-art"><ItemVisual item={item} alt={name} loading="eager"/></div>
      {stockSelector}
    </div>
    <div className="desk-reading">
      <header className="specimen-data"><h2 className="desk-title">{name} <RarityLabel item={item}/></h2>
        <dl className="specimen-price"><dt>{pick('พ่อค้าขาย','Merchant sells')}</dt><dd><CoinIcon/>{item.price} <small>{t('เครดิต')}</small></dd></dl>
      </header>
      <div id="appraisal-reading-panel" className={`appraisal-controls${page!=='assessment'?' information-page':''}`} data-page={page}>
      {page!=='assessment' && <><button ref={pageBack} type="button" className="desk-back" onClick={()=>onPageChange?.('assessment')}>← {pick('กลับไปประเมิน','Back to appraisal')}</button>{page==='details'?<AppraisalItemDetails game={game} item={item}/>:offers}</>}
      <div className="assessment-content" data-step={deskStep} hidden={page!=='assessment'}>
      {game.self.eventOffer && !disabled && <p className="blocked-note">{t('ตอบเหตุการณ์ก่อน ปุ่มบนโต๊ะนี้จึงจะกดได้')}</p>}
      {item.appraisal!==null && <p className={`verdict${item.appraisalAccepted?' accepted':' rejected'}`}>{t('คุณเสนอ {n} เครดิต · {v} · ต่อรองเหลือ {left} ครั้ง',{n:item.appraisal,v:item.appraisalAccepted?t('NPC ยอมรับ'):t('NPC ปฏิเสธ'),left:Math.max(0,game.self.counterLimit-game.self.counters)})}</p>}
      <div className="desk-steps" role="tablist" aria-label={t('ขั้นตอนบนโต๊ะ')} onKeyDown={e=>{
        const at=steps.findIndex(s=>s.id===deskStep);
        const next=e.key==='ArrowRight'?(at+1)%steps.length:e.key==='ArrowLeft'?(at+steps.length-1)%steps.length:e.key==='Home'?0:e.key==='End'?steps.length-1:null;
        if(next===null)return;
        e.preventDefault();setDeskStep(steps[next]!.id);e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
      }}>{steps.map((s,index)=><button key={s.id} type="button" role="tab" id={`${tabs}-${s.id}`} aria-controls={`${tabs}-${s.id}-panel`} aria-selected={deskStep===s.id} tabIndex={deskStep===s.id?0:-1} className={deskStep===s.id?'current':''} onClick={()=>setDeskStep(s.id)}>
        <span className="step-number" aria-hidden="true">{index+1}</span>{s.id==='inspect'?<InspectIcon/>:s.id==='appraise'?<AppraiseIcon/>:<BuyIcon/>}<span className="step-label">{s.label}<small>{s.meta}</small></span></button>)}</div>
      <FactSeals item={item}/>
      <div role="tabpanel" id={`${tabs}-inspect-panel`} aria-labelledby={`${tabs}-inspect`} hidden={deskStep!=='inspect'} className="step-panel">
        <Inspect game={game} item={item} submit={submit} disabled={disabled} compact/>
      </div>
      <div role="tabpanel" id={`${tabs}-appraise-panel`} aria-labelledby={`${tabs}-appraise`} hidden={deskStep!=='appraise'} className="step-panel valuation-panel">
      <form className="valuation-form" onSubmit={e=>{e.preventDefault();if(valid)submit({type:item.appraisal===null?'appraise':'counter',itemId:item.id,value:number,acceptDanger:danger});}}>
        <div className="valuation-editor"><label htmlFor={inputId}>{item.appraisal===null?t('ราคาที่คุณประเมิน'):t('ราคาที่คุณต่อรองใหม่')} ({t('เครดิต')})</label>
        <div className="price-entry"><div className="stepper"><button type="button" aria-label={t('ลดราคา 1 เครดิต')} disabled={!canAct || valid && number<=0} title={tip(!canAct&&eventFirst,valid&&number<=0&&t('ราคาต่ำสุดคือ 0'))} onClick={()=>step(-1)}><MinusIcon/></button><input id={inputId} type="number" inputMode="numeric" min="0" max="1000" step="1" required value={value} onChange={e=>setValue(e.target.value)} disabled={!canAct}/><button type="button" aria-label={t('เพิ่มราคา 1 เครดิต')} disabled={!canAct || valid && number>=1000} title={tip(!canAct&&eventFirst,valid&&number>=1000&&t('ราคาสูงสุดคือ 1000'))} onClick={()=>step(1)}><PlusIcon/></button></div></div></div>
        <p className={`risk${riskLevel}`}>{!valid?t('ใส่จำนวนเต็ม 0–1000'):risk?<>{t('โอกาสถูกจับผิด')} <strong>{risk[0]===risk[1]?risk[0]:`${risk[0]}–${risk[1]}`}%</strong> {t('จากข้อมูลที่คุณรู้')}</>:t('ยังคำนวณโอกาสถูกจับผิดไม่ได้ · ตรวจราคาเพื่อหาเบาะแสมูลค่า')} · {t('ถูกจับผิดอาจเสียเงินหรือของ')}{item.npc==='darkone'?t(' และถึงชีวิตตามสัญญา'):''}</p>
        {item.npc==='darkone' && <label className="check danger-text"><input type="checkbox" checked={danger} onChange={e=>setDanger(e.target.checked)} disabled={!canAct}/><span>{game.survival?t('ยอมรับสัญญา Dark One: หากถูกจับผิด อาจต้องสละของหรือชีวิตเป็น 0 เป็นผู้ชมจนจบ run ของและเครดิตยังรอ Collector'):t('ยอมรับสัญญา Dark One: หากถูกจับผิด อาจต้องสละของหรือตาย พักเฉพาะช่วงนี้และคะแนนช่วงนี้เป็น 0')}</span></label>}
        {game.self.caught && <p className="danger-text">{t('พ่อค้าจับผิดแล้ว ไม่รับการประเมินหรือต่อรองเพิ่ม ยังซื้อในราคาที่แสดงได้')}</p>}
        <div className="valuation-footer"><button className="primary appraise" title={tip(appraiseWhy)} disabled={!canAct || !valid || game.self.energy<cost || game.self.caught || item.appraisal!==null && game.self.counters>=game.self.counterLimit || item.npc==='darkone' && !danger}><AppraiseIcon/>{item.appraisal===null?t('ยืนยันการประเมิน'):t('ยื่นราคาต่อรอง')} · {cost===0?t('ฟรี'):t('1 พลัง')}</button>{item.appraisal===null && <button type="button" className="step-next" onClick={()=>setDeskStep('buy')}>{pick('ไปหน้าซื้อ','Go to purchase')}</button>}</div>
      </form>

      </div>
      <div role="tabpanel" id={`${tabs}-buy-panel`} aria-labelledby={`${tabs}-buy`} hidden={deskStep!=='buy'} className="step-panel purchase">
<div className="purchase-options">
        {item.appraisalAccepted===false && <p>{t('ใช้ราคาหน้าร้าน {n} เครดิต เพราะพ่อค้าปฏิเสธราคาประเมิน',{n:item.ask})}</p>}
        <Contract item={item} condition={useCondition} setCondition={setCondition} disabled={!canAct} survival={!!game.survival}/>

        </div>
        <div className="purchase-footer"><dl className="purchase-summary"><div><dt>{pick('ยอดชำระ','Total payment')}</dt><dd><CoinIcon/>{total} <small>{t('เครดิต')}</small></dd></div><div><dt>{pick('ใช้พลัง','Energy cost')}</dt><dd><EnergyIcon/>{purchaseEnergy(game)} <small>{t('พลัง')}</small></dd></div></dl>
        {(()=>{const why=purchaseBlock(game,total,disabled);return <>{why && <p className="why" role="status">{why}</p>}
        <div className="purchase-actions"><button className="primary buy" disabled={!canAct || !!why} title={tip(!canAct&&eventFirst,why)} onClick={()=>submit({type:'buy',itemIds:items.map(i=>i.id),condition:useCondition})}><BuyIcon/>{buyBoth?t('ซื้อทั้งคู่'):t('ซื้อเก็บไว้')}</button>        {game.self.stock.length===2 && <label className="check"><input type="checkbox" checked={buyBoth} onChange={e=>setBuyBoth(e.target.checked)} disabled={!canAct}/><span>{t('ซื้อทั้งสองชิ้นในดีลเดียว')}</span></label>}</div>
        </>;})()}
        </div>
      </div>

      </div>
      </div>
    </div>
  </section>;
}
/** Extra mechanics only; names, prices and learned seals remain in their existing locations. */
function AppraisalItemDetails({game,item}:{game:AppraisalView;item:ItemView}) {
  const passive=game.passives && (passiveSpec(item.kind)||['autometa-clockwork-sentry','vampire-mist-cloak','swarm-hive-egg-cluster','swarm-resin-spool','swarm-wing-membrane-glider','darkone-debt-chain','vampire-shadow-wine-decanter','alien-spore-lantern','darkone-omen-censer'].includes(item.kind)&&item.nativeEffectReady)?passiveText(item.kind,game.itemEffects,item):null;
  const benefit=possibleBenefitText(game,item);
  const explanation=ITEM_SPECS[item.kind].buff && benefit.includes(statusName(ITEM_SPECS[item.kind].buff!))?readable(statusDescription(ITEM_SPECS[item.kind].buff!)):null;
  const drawback=possibleDrawbackText(game,item);
  const riskExplanation=ITEM_SPECS[item.kind].drawback && drawback.includes(statusName(ITEM_SPECS[item.kind].drawback!))?readable(statusDescription(ITEM_SPECS[item.kind].drawback!)):null;
  return <div className="item-detail-pages"><Pager label={pick('รายละเอียดสินค้า','Item details')}>
    <section className="item-mechanics"><h3><BuffIcon/>{pick('ผลของสินค้า','Item effects')}</h3>
      {passive && <p>{passive}</p>}
      <p>{readable(benefit)}{explanation?` · ${explanation}`:''}</p>
      <h3><InfoIcon/>{pick('วิธีใช้','How to use')}</h3>
      <p>{ITEM_SPECS[item.kind].usage??pick('ซื้อเก็บไว้ แล้วเปิดใช้จากกระเป๋า','Buy the item, then activate it from your bag.')}</p>
      {passive && <p>{pick('ผลสะสมมีผลขณะถือสินค้า','Collection effects apply while holding the item.')}</p>}
      <p className="supporting">{ITEM_SPECS[item.kind].nativeEffect?ITEM_SPECS[item.kind].exclusions:game.itemEffects && ITEM_SPECS[item.kind].consumable?pick('เปิดใช้ไม่เสียพลัง · ใช้แล้วหมดไป','Activation costs no energy; consumed on use.'):pick('เปิดใช้ใช้ 1 พลัง · ชิ้นละหนึ่งครั้งต่อช่วง','Activation costs 1 energy; once per item per encounter.')}</p>
    </section>
    <section className="item-mechanics"><h3><InfoIcon/>{pick('เงื่อนไขและความเสี่ยง','Conditions and risks')}</h3><p>{readable(drawback)}{riskExplanation?` · ${riskExplanation}`:''}</p><p>{activationOutcome(item.knowledge)}</p></section>
  </Pager></div>;
}
const dangerChoices=new Set(['die','item','surrender']);
export function EventDecision({game,offer,submit,disabled,playerNames={},onTuck}:Actions&{offer:EventOffer;playerNames?:Record<string,string>;onTuck?:()=>void}) {
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
  const portalEvent=game.phase==='PORTALS';
  // E01/E10 decline closes the same door as switch; show that outcome once.
  const choices=portalEvent && ['E01','E10'].includes(offer.id)?offer.choices.filter(c=>c!=='decline'):offer.choices;
  return <section className={`event-offer${consequence?' consequence':''}${portalEvent?' portal-event':''}`} aria-labelledby={`event-${offer.id}`}>
    <h2 id={`event-${offer.id}`}><span className="event-heading-title"><EventIcon/>{catalog.name}</span>{onTuck && <button type="button" className="event-tuck" aria-label={t('ซ่อนไว้ก่อน ขอดูโต๊ะ')} title={t('ซ่อนไว้ก่อน ขอดูโต๊ะ')} onClick={onTuck}><CloseIcon/></button>}</h2>
    <PortalEventPreview game={game} offer={offer} choice={choice}/>
    <div className="event-copy">
      <p className="event-say">{survival && offer.id==='E50'?t('คุณผิดสัญญา Dark One สละของหนึ่งชิ้นเพื่อรอด หรือชีวิตเป็น 0 แล้วเป็นผู้ชมจนจบ run ของและเครดิตที่เหลือยังรอ Collector'):<Rich text={catalog.description} survival={survival}/>}</p>
      {offer.wish && <p className="event-give">{t('{npc}อยากได้',{npc:npcName(game.self.portals.find(p=>p.id===game.self.selectedPortalId)?.npc ?? 'orc')})} <ItemTerm kind={offer.wish.kind}/> {t('ให้ {n} เครดิต ซึ่งสูงกว่าตลาด · ถ้าครั้งหน้าคุณเลือกพ่อค้านี้และถือของชนิดนี้อยู่ ขายให้ได้ ต่อรองราคาได้',{n:offer.wish.price})}</p>}
      {offer.giveItemId && <p className="event-give">{t('พ่อค้าขอ')} <ItemTerm kind={offer.targetKinds[offer.giveItemId]!} item={visible.find(i=>i.id===offer.giveItemId)}/> {t('จากคลังของคุณ')}</p>}
    </div>
    <form className="event-form" onSubmit={e=>{e.preventDefault();if(action)submit(action);}}>
      <ChoiceCards legend={t('คุณจะเลือกทางไหน')} value={choice} onChange={c=>{setChoice(c);const count=loanItemCount(c);if(count)setLoanIds(ids=>ids.slice(0,count));}} disabled={disabled} options={choices.map(c=>{const why=blockedReason(c,itemId);return {value:c,title:title(c),disabled:!!why,
        detail:<><Rich passive survival={survival} text={`${eventCost(game,offer,c,itemId)}${eventScoreText(game,offer,c,effectiveStatus)}`}/>{why && <span className="why"> {why}</span>}</>,
        tone:c==='decline'?'quiet':consequence && dangerChoices.has(c)?'danger':undefined};})}/>
      {eventNeedsItem(offer,choice) && <ChoiceCards legend={offer.giveItemId?t('เลือกของในร้านที่จะได้'):t('เลือกสินค้า')} value={itemId} onChange={setItemId} disabled={disabled} options={choiceItems.map((id,index)=>{
        const seen=visible.find(i=>i.id===id);const kind=offer.targetKinds[id];
        return {value:id,title:offer.npcTerms && seen?.owner===game.self.id?inventoryLabel(game,seen):eventItemName(offer,id),...(kind?{art:itemImage(kind),...(seen?{item:seen}:{})}:{}),
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
      <button className={consequence?'danger':'primary'} disabled={disabled || !action || !!blockedReason(choice,itemId)} title={tip(disabled&&locked,blockedReason(choice,itemId),!action&&t('ยังเลือกรายละเอียดไม่ครบ ตรวจตัวเลือกด้านบน'))}>{t('ยืนยัน: {title}',{title:portalEvent && isCore2Event(offer.id)?choiceTitle(offer,choice,survival):title(choice)})}</button>
    </form>
  </section>;
}
/** Two market destinations share one bounded window and the real transaction controls. */
export function DarkMarket({game,submit,disabled}:Actions&{compact?:boolean}) {
  const [wing,setWing]=useState<'order'|'lot'>('order');
  const [page,setPage]=useState(0);
  const [selected,setSelected]=useState<{kind:'order'|'lot';id:string;encounter:number}|null>(null);
  const [perPage,setPerPage]=useState(()=>typeof window==='undefined'?3:window.innerWidth<=600?1:window.innerWidth<=1050?2:3);
  const heading=useRef<HTMLHeadingElement>(null);
  useEffect(()=>{const update=()=>setPerPage(window.innerWidth<=600?1:window.innerWidth<=1050?2:3);window.addEventListener('resize',update);return()=>window.removeEventListener('resize',update);},[]);
  useEffect(()=>{heading.current?.focus({preventScroll:true});},[selected?.id,wing]);
  const lots=game.market.lots??[];
  const orders=game.market.open?game.market.orders:[];
  const entries=wing==='order'?orders.map(order=>({kind:'order' as const,id:order.id,order})):lots.map(lot=>({kind:'lot' as const,id:lot.id,lot}));
  const pages=Math.max(1,Math.ceil(entries.length/perPage)),at=Math.min(page,pages-1);
  const order=selected?.encounter===game.encounter&&selected.kind==='order'?orders.find(o=>o.id===selected.id):undefined;
  const lot=selected?.encounter===game.encounter&&selected.kind==='lot'?lots.find(l=>l.id===selected.id):undefined;
  const detailed=!!order||!!lot;
  const destination=(kind:'order'|'lot')=>{setWing(kind);setPage(0);setSelected(null);};
  return <section className="market-experience" aria-label={pick('ตลาดมืด','Dark Market')}>
    <nav className="market-destinations" aria-label={pick('พื้นที่ตลาดมืด','Market destinations')}>
      <ComicDestination selected={wing==='order'} icon={<CoinIcon/>} label={pick('กระดานรับซื้อ','Buy orders')} caption={pick('แลกของเป็นเครดิต','Trade goods for credits')} count={orders.length} onClick={()=>destination('order')}/>
      <ComicDestination selected={wing==='lot'} icon={<AuctionIcon/>} label={pick('ห้องประมูล','Auction room')} caption={pick('ยื่นราคาแบบปิดซอง','Place a sealed bid')} count={lots.length} onClick={()=>destination('lot')}/>
      <p className="market-rail-note"><MarketIcon/>{pick('ข้อเสนอเปลี่ยนทุกช่วง','Offers change each encounter')}</p>
    </nav>
    <div className="market-content">
      <header className="market-page-head">
        {detailed&&<ComicButton className="market-back" onClick={()=>setSelected(null)}>{pick('‹ กลับรายการ','‹ Back to list')}</ComicButton>}
        <h3 ref={heading} tabIndex={-1}>{detailed?(order?pick('เงื่อนไขและขาย','Terms and sale'):pick('ประมูลแบบปิดซอง','Sealed auction')):wing==='order'?pick('รายการรับซื้อ','Buy orders'):pick('ของประมูลจากคลัง','Vault auctions')}</h3>
        {!detailed&&entries.length>0&&<span>{entries.length} {pick('รายการ','lots')}</span>}
        {!detailed&&pages>1&&<CompactPager page={at} pages={pages} onChange={setPage} label={pick('หน้าตลาดมืด','Market pages')}/>}
      </header>
      {order?<MarketOrderDetail key={order.id} game={game} order={order} submit={submit} disabled={disabled}/>:lot?<ul className="market-auction-detail"><AuctionLot key={lot.id} game={game} lot={lot} submit={submit} disabled={disabled}/></ul>:entries.length?<>
        <ul className="market-lot-grid" data-single={entries.slice(at*perPage,at*perPage+perPage).length===1} style={{gridTemplateColumns:`repeat(${Math.min(perPage,entries.length-at*perPage)},minmax(0,1fr))`}}>{entries.slice(at*perPage,at*perPage+perPage).map(entry=>{
          const kind=entry.kind==='order'?entry.order.kind:entry.lot.item.kind;
          const quota=entry.kind==='order'?entry.order.quota[game.self.id]??0:0;
          const owned=entry.kind==='order'?game.self.inventory.filter(item=>marketOptions(game,item).some(o=>o.id===entry.id)).length:0;
          return <li key={entry.id}><button className="market-lot-card" onClick={()=>setSelected({kind:entry.kind,id:entry.id,encounter:game.encounter})} aria-label={`${entry.kind==='order'?itemName(kind):abilityItemLabel(entry.lot.item)} · ${pick('ดูรายละเอียด','View details')}`}>
            <span className="market-lot-art">{entry.kind==='lot'?<ItemVisual item={entry.lot.item}/>:<img src={itemImage(kind)} alt=""/>}</span>
            <span className="market-lot-copy"><strong className="market-lot-name">{entry.kind==='order'?itemName(kind):abilityItemLabel(entry.lot.item)}</strong>
              <span className="market-lot-price"><span><CoinIcon/>{entry.kind==='order'?pick('ราคารับซื้อ','Buying price'):pick('ขั้นต่ำ','Minimum')}</span><b>{entry.kind==='order'?entry.order.price:entry.lot.minimum}</b></span>
              <span className="market-lot-stat"><span>{entry.kind==='order'?pick('สิทธิ์คงเหลือ','Quota left'):pick('ซองประมูล','Sealed bids')}</span><b>{entry.kind==='order'?quota:entry.lot.bidCount}</b></span>
              <span className="market-lot-stat"><span>{entry.kind==='order'?pick('ของที่ขายได้','Eligible goods'):pick('ซองของคุณ','Your bid')}</span><b>{entry.kind==='order'?owned:entry.lot.yourBid??'—'}</b></span>
              <span className="market-lot-open">{entry.kind==='order'?pick('ดูเงื่อนไข','View terms'):entry.lot.winnerId!==undefined?pick('ดูผลประมูล','View auction result'):entry.lot.yourBid!==null?pick('ดู / แก้ซอง','View / edit bid'):pick('ดูและยื่นซอง','View and bid')}<span aria-hidden="true">›</span></span>
            </span>
          </button></li>;
        })}</ul>
        <p className="market-footnote">{wing==='order'?pick('รับซื้อถึงจบช่วงนี้ · ราคาในรายการเป็นราคาฐาน','Open until encounter ends · Listed prices are base prices'):<><TicketIcon/>{pick('ผู้ชนะรับสินค้าและตั๋วคำสั่งมืด 1 ใบ · เปิดผลเมื่อจบช่วง','Winner receives item and one dark ticket · Settles at encounter end')}</>}</p>
      </>:<div className="market-empty"><span>{wing==='order'?<CoinIcon/>:<TicketIcon/>}</span><h4>{wing==='order'?pick('ยังไม่เปิดกระดานรับซื้อ','No buy orders open'):pick('ห้องประมูลยังไม่มีสินค้า','No auction lots available')}</h4><p>{wing==='order'?pick('เก็บของไว้รอรายการในช่วงถัดไป','Keep your goods for the next encounter'):pick('ของจากคลังจะเปิดประมูลในบางช่วง','Vault auctions open on selected encounters')}</p></div>}
    </div>
  </section>;
}

export function MarketOrderDetail({game,order,submit,disabled}:Actions&{order:MarketOrder}) {
  const [picked,setPicked]=useState('');
  const owned=game.self.inventory.filter(item=>marketOptions(game,item).some(o=>o.id===order.id));
  const index=Math.max(0,owned.findIndex(item=>item.id===picked)),item=owned[index];
  const quota=order.quota[game.self.id]??0;
  return <div className="market-detail-spread">
    <section className="market-showcase"><figure><img src={itemImage(order.kind)} alt=""/></figure><h4>{itemName(order.kind)}</h4><div className="market-showcase-stats"><span><CoinIcon/>{pick('ราคาฐาน','Base price')} <b>{order.price}</b></span><span>{pick('สิทธิ์คงเหลือ','Quota left')} <b>{quota}</b></span></div></section>
    <section className="market-transaction">
      <div className="market-contract-rows">{order.contract?<><p><FlameIcon/><span>{pick('ต้องการ','Wanted')}: <strong>{marketRequirements(order.contract)}</strong></span></p><p><BuffIcon/><span>{pick('ตรงเงื่อนไข','Matches')}: <Rich text={marketBonus(order.contract)} survival={!!game.survival}/></span></p><p><DebuffIcon/><span>{pick('ไม่ตรง','Mismatch')}: {pick('ลดราคา 20% หรือ','20% markdown or')} <Rich text={marketCost(order.contract)} survival={!!game.survival}/> {pick('เพื่อรับราคาเต็ม','for the full price')}</span></p></>:<p><CoinIcon/>{pick('รับซื้อโดยไม่มีเงื่อนไขเพิ่มเติม','No additional contract requirements')}</p>}</div>
      <div className="market-owned-head"><h4>{pick('สินค้าที่จะขาย','Goods to sell')}</h4>{owned.length>1&&<CompactPager page={index} pages={owned.length} onChange={next=>setPicked(owned[next]!.id)} label={pick('เลือกสินค้าที่จะขาย','Choose goods to sell')}/>}</div>
      {quota===0?<div className="market-empty-inline">{pick('ใช้สิทธิ์รายการนี้ครบแล้ว','Quota for this order has been used')}</div>:item?<><div className="market-owned-choice"><ItemVisual item={item}/><div><strong>{pick('ชิ้นที่','Item')} {game.self.inventory.findIndex(i=>i.id===item.id)+1}</strong><span><CoinIcon/>{pick('ซื้อมา','Paid')} {item.paid??'—'}</span></div><span className="market-owned-knowledge">{order.contract?.requirements.map(r=><span key={r.property}>{r.property==='cursed'?<FlameIcon/>:<AuthenticityIcon/>}{r.property==='cursed'?pick('คำสาป','Curse'):pick('ความแท้','Authenticity')}: {item.knowledge[r.property]===undefined?'?':item.knowledge[r.property]?pick('มี / ใช่','Yes'):pick('ไม่มี / ไม่ใช่','No')}</span>)}</span></div>
        <MarketSale game={game} item={item} order={order} submit={submit} disabled={disabled||!!game.self.eventOffer&&isConsequence(game.self.eventOffer.id)}/></>:<div className="market-empty-inline"><BuyIcon/><strong>{pick('ยังไม่มีของที่ขายได้','No eligible goods yet')}</strong><span>{pick('ซื้อของจากพ่อค้าแล้วกลับมาขายได้ก่อนจบช่วง','You can buy from a merchant and return before this encounter ends')}</span></div>}
      {salePctText(game)&&<p className="market-footnote">{salePctText(game)}</p>}
      <p className="market-settlement-note"><InfoIcon/>{pick('ขายแล้วโอนของทันที · ของติดล็อกต้องปลดล็อกก่อน','Goods transfer immediately · Locked goods must be unlocked first')}</p>
    </section>
  </div>;
}
function AuctionLot({game,lot,submit,disabled}:Actions&{lot:NonNullable<AppraisalView['market']['lots']>[number]}) {
  const locked=useLock();
  const [bid,setBid]=useState(String(lot.yourBid??lot.minimum));const id=useId();
  const [showInfo,setShowInfo]=useState(false);
  const score=itemScoreRange(lot.item.knowledge);
  const amount=Number(bid),ceiling=Math.min(1000,game.self.credits);
  const valid=bid.trim()!==''&&Number.isSafeInteger(amount)&&amount>=lot.minimum&&amount<=ceiling;
  const settled=lot.winnerId!==undefined;
  const step=(delta:number)=>setBid(String(Math.min(Math.max(lot.minimum,ceiling),Math.max(lot.minimum,(Number.isSafeInteger(amount)?amount:lot.minimum)+delta))));
  return <li className="market-detail-spread">
    <section className="market-showcase"><figure><ItemVisual item={lot.item}/></figure><h4 className="market-showcase-title"><span>{abilityItemLabel(lot.item)}</span><ComicButton onClick={()=>setShowInfo(value=>!value)} aria-expanded={showInfo}><BookIcon/>{pick('ข้อมูลสินค้า','Item info')}</ComicButton></h4><FactSeals item={lot.item}/></section>
    <section className="market-transaction market-bid-transaction">{showInfo?<div className="market-item-insight"><h4>{pick('ข้อมูลเพิ่มเติม','More item information')}</h4><div><strong>{pick('ผลเมื่อเปิดใช้','Activation outcome')}</strong><p>{activationOutcome(lot.item.knowledge)}</p></div>{score&&<div><strong>{pick('มูลค่าตอนคิดคะแนน','Scoring value')}</strong><p>{score[0]===score[1]?score[0]:`${score[0]}–${score[1]}`} {pick('เครดิต','credits')}</p><small>{pick('ของปลอมเหลือ 25% · คำสาปลดอีก 25%','Counterfeits retain 25% · Curse reduces a further 25%')}</small></div>}{lot.item.knowledge.comparison&&<div><strong>{pick('ผลเทียบราคา','Value comparison')}</strong><p>{lot.item.knowledge.comparison===lot.item.id?t('ชิ้นนี้มูลค่าไม่น้อยกว่าอีกชิ้น'):t('อีกชิ้นมูลค่าสูงกว่า')}</p></div>}<ComicButton onClick={()=>setShowInfo(false)}>{pick('กลับไปประมูล','Back to bid')}</ComicButton></div>:<><div className="market-bid-stats"><span><CoinIcon/>{pick('ขั้นต่ำ','Minimum')}<b>{lot.minimum}</b></span><span><EnvelopeIcon/>{pick('ซองประมูล','Sealed bids')}<b>{lot.bidCount}</b></span></div><p className="market-bid-prize"><TicketIcon/>{pick('ผู้ชนะรับสินค้า + ตั๋วคำสั่งมืด 1 ใบ','Winner receives item + one dark ticket')}</p>
      {settled?<p className="market-result" role="status">{lot.winnerId===null?t('ไม่มีผู้ชนะ ของกลับเข้าคลัง'):lot.winnerId===game.self.id?t('คุณชนะประมูล จ่าย {n} เครดิต',{n:lot.price}):t('มีผู้ชนะประมูลที่ {n} เครดิต',{n:lot.price})}</p>:<form className="market-bid-form" onSubmit={e=>{e.preventDefault();if(valid&&!disabled)submit({type:'bid',lotId:lot.id,credits:amount});}}>
        <p className="market-your-bid">{lot.yourBid!==null?t('ซองของคุณ {n} เครดิต',{n:lot.yourBid}):t('ยังไม่ได้ยื่นซอง')}</p><label htmlFor={id}>{pick('ราคาที่คุณเสนอ','Your offer')}</label>
        <div className="market-bid-stepper"><ComicButton aria-label={t('ลดราคาประมูล 1 เครดิต')} disabled={disabled||valid&&amount<=lot.minimum} onClick={()=>step(-1)}><MinusIcon/></ComicButton><input id={id} type="number" inputMode="numeric" min={lot.minimum} max={ceiling} step="1" value={bid} onChange={e=>setBid(e.target.value)} disabled={disabled}/><ComicButton aria-label={t('เพิ่มราคาประมูล 1 เครดิต')} disabled={disabled||valid&&amount>=ceiling} onClick={()=>step(1)}><PlusIcon/></ComicButton></div>
        <small>{ceiling<lot.minimum?pick('เครดิตไม่ถึงราคาขั้นต่ำ','Not enough credits for the minimum'):pick(`เสนอได้ ${lot.minimum}–${ceiling} เครดิต`,`Offer ${lot.minimum}–${ceiling} credits`)}</small>
        <span className="market-bid-seal" aria-hidden="true"><EnvelopeIcon/></span><div className="market-bid-actions"><ComicButton type="submit" tone="primary" disabled={disabled||!valid} title={tip(disabled&&locked,!valid&&t('ราคาต้องไม่ต่ำกว่า {min} เครดิต และไม่เกิน {max} (เครดิตที่มี)',{min:lot.minimum,max:ceiling}))}>{lot.yourBid!==null?t('แก้ซองประมูล'):t('ยื่นซองประมูล')}</ComicButton>{lot.yourBid!==null&&<ComicButton disabled={disabled} title={tip(disabled&&locked)} onClick={()=>submit({type:'bid',lotId:lot.id,credits:0})}>{t('ถอนซอง')}</ComicButton>}</div>
      </form>}
      <p className="market-settlement-note"><InfoIcon/>{pick('ไม่เห็นราคาคนอื่น · แก้หรือถอนได้จนจบช่วง · จ่ายเมื่อชนะ','Bids stay private · Edit or withdraw before settlement · Pay only if you win')}</p></>}
    </section>
  </li>;
}
export function Unsold({game,submit,disabled}:Actions) {
  const locked=useLock();
  const items=unsoldItems(game);if(!items.length) return null;
  const blocked=disabled || !!game.self.eventOffer;
  return <section className="unsold" aria-labelledby="unsold-title"><h2 id="unsold-title">{t('ของที่คุณประเมินแล้วยังขายไม่ได้')} <span>{t('{n} ชิ้น',{n:items.length})}</span></h2>
    <details className="info-fold"><summary>{t('วิธีการ')}</summary><p>{t('พ่อค้าเชื่อราคาของคุณ ถ้าไม่มีใครซื้อ คุณต้องรับผิดชอบ จบช่วงต่อรองแล้วชิ้นที่ค้างจะรับบทลงโทษจากพ่อค้าโดยอัตโนมัติ')}{game.phase==='APPRAISAL'?t(' ยังเปิดให้ผู้เล่นอื่นซื้อในช่วงต่อรองได้'):''}</p></details>
    <Pager label={t('ของที่คุณประเมินแล้วยังขายไม่ได้')}>{items.map(item=>{const price=purchasePrice(game,[item],game.self.dealMode==='condition');const short=needShort(game,{credits:price,energy:purchaseEnergy(game)});return <ul key={item.id}><li>
      <figure className="pedestal"><ComicTooltip placement="side" content={<><strong>{abilityItemLabel(item)}</strong>{t('คุณประเมินไว้ {n} เครดิต',{n:item.appraisal})}</>}><span className="unsold-item-trigger" tabIndex={0} aria-label={abilityItemLabel(item)}><ItemVisual className="pedestal-item" item={item}/></span></ComicTooltip></figure>
      <div className="option-cards">
        <div className="option-card"><img className="option-art" src="/art/ui/icon-coins.webp" alt="" width="256" height="256"/><div className="option-copy"><button disabled={blocked || !!needShort(game,{credits:price,energy:purchaseEnergy(game)})} title={tip(disabled&&locked,!!game.self.eventOffer&&t('ตอบเหตุการณ์ก่อน'),needShort(game,{credits:price,energy:purchaseEnergy(game)}))} onClick={()=>submit({type:'unsold',itemId:item.id,choice:'buy'})}><BuyIcon/>{t('ซื้อเอง · {n} เครดิต · {e}',{n:price,e:purchaseEnergy(game)===0?t('ไม่เสียพลัง'):t('{n} พลัง',{n:purchaseEnergy(game)})})}</button>{!blocked && short && <small className="why" role="status">{short}</small>}</div></div>
        <div className="option-card danger"><img className="option-art" src="/art/ui/icon-skull.webp" alt="" width="256" height="256"/><div className="option-copy"><button disabled={blocked} title={tip(disabled&&locked,t('ตอบเหตุการณ์ก่อน'))} onClick={()=>submit({type:'unsold',itemId:item.id,choice:'penalty'})}>{t('รับโทษจากพ่อค้า')}</button><small className="danger-text"><Rich text={unsoldPenaltyText(item)} survival={!!game.survival}/></small></div></div>
        <div className="option-card"><img className="option-art" src="/art/ui/icon-chest.webp" alt="" width="256" height="256"/><div className="option-copy"><button disabled={blocked} title={tip(disabled&&locked,t('ตอบเหตุการณ์ก่อน'))} onClick={()=>submit({type:'unsold',itemId:item.id,choice:'consign'})}><MarketIcon/>{t('ส่งต่อ Dark Market')}</button><small>{consignText()}</small></div></div>
      </div></li></ul>;})}</Pager>
  </section>;
}
function InventoryKnownFacts({game,item,submit,disabled}:{game:AppraisalView;item:ItemView;submit:(action:Decision)=>void;disabled:boolean}) {
  const locked=useLock();
  const block=inspectionBlock(game,disabled,item);
  const property=(kind:'authenticity'|'effects',known:boolean,value:string,label:string,icon:ReactElement)=>{
    const cost=inspectionCost(game,kind,item);
    const low=game.self.energy<cost;
    return <div className="inventory-fact"><dt>{icon}{label}</dt><dd>{known?value:<button type="button" disabled={disabled||!!block||low} title={tip(disabled&&locked,block,low&&t('พลังไม่พอ'))} onClick={()=>submit({type:'inspect',itemId:item.id,property:kind})}><InspectIcon/>{pick('ตรวจ','Inspect')} · {cost===0?pick('ฟรี','Free'):<>{cost}<EnergyIcon/></>}</button>}</dd></div>;
  };
  return <dl className="inventory-known-facts">
    <div className="inventory-fact"><dt><CoinIcon/>{pick('ราคาประเมิน','Appraised price')}</dt><dd>{item.appraisal===null?<span className="unknown">{pick('ยังไม่ประเมิน','Not appraised')}</span>:item.appraisal}</dd></div>
    {property('authenticity',item.knowledge.genuine!==undefined,item.knowledge.genuine?t('ของแท้'):t('ของปลอม'),t('ความแท้'),<AuthenticityIcon/>)}
    {property('effects',item.knowledge.cursed!==undefined,item.knowledge.cursed?t('มีคำสาป'):t('ไม่มีคำสาป'),t('คำสาป'),<FlameIcon/>)}
  </dl>;
}
function InventoryUsageDetails({game,item,submit,disabled,onBack,backRef}:{game:AppraisalView;item:ItemView;submit:(action:Decision)=>void;disabled:boolean;onBack:()=>void;backRef:RefObject<HTMLButtonElement|null>}) {
  const titleId=useId();
  const effectsDone=effectsKnownFor(game,item.knowledge);
  const benefit=possibleBenefitText(game,item),risk=possibleDrawbackText(game,item);
  const benefitExplanation=ITEM_SPECS[item.kind].buff && benefit.includes(statusName(ITEM_SPECS[item.kind].buff!))?statusDescription(ITEM_SPECS[item.kind].buff!):null;
  const riskExplanation=ITEM_SPECS[item.kind].drawback && risk.includes(statusName(ITEM_SPECS[item.kind].drawback!))?statusDescription(ITEM_SPECS[item.kind].drawback!):null;
  const passive=game.passives&&(passiveSpec(item.kind)||['autometa-clockwork-sentry','vampire-mist-cloak','swarm-hive-egg-cluster','swarm-resin-spool','swarm-wing-membrane-glider','darkone-debt-chain','vampire-shadow-wine-decanter','alien-spore-lantern','darkone-omen-censer'].includes(item.kind)&&item.nativeEffectReady)?passiveText(item.kind,game.itemEffects,item):null;
  return <section className="inventory-usage-page" aria-labelledby={titleId}>
    <header className="inventory-effect-head"><button ref={backRef} type="button" className="inventory-effect-back" onClick={onBack}><span aria-hidden="true">←</span>{pick('กลับไปกระเป๋า','Back to bag')}</button><h3 id={titleId}>{pick('ข้อมูลและผลการใช้งาน','Facts and use effects')}</h3></header>
    <InventoryKnownFacts game={game} item={item} submit={submit} disabled={disabled}/>
    {passive&&<article className="inventory-effect-card held"><h4><BookIcon/>{pick('ขณะถือ','While held')}</h4><p>{passive}</p></article>}
    <div className="inventory-effect-grid">
      <article className="inventory-effect-card benefit"><h4><BuffIcon/>{effectsDone?pick('ผลเมื่อเปิดใช้','On use'):pick('ผลที่อาจได้รับ','Possible benefit')}</h4><p>{readable(benefit)}</p>{benefitExplanation&&<p>{readable(benefitExplanation)}</p>}</article>
      <article className="inventory-effect-card risk"><h4><FlameIcon/>{effectsDone?pick('ผลเสียเมื่อเปิดใช้','Use risks'):pick('ความเสี่ยงที่อาจเกิด','Possible risk')}</h4><p>{readable(risk)}</p>{riskExplanation&&<p>{readable(riskExplanation)}</p>}</article>
    </div>
  </section>;
}

export function Inventory({game,submit,disabled,drawer=false}:Actions&{drawer?:boolean}) {
  const locked=useLock();
  const [selected,setSelected]=useState<string|null>(null);
  const [saleFor,setSaleFor]=useState<string|null>(null);
  const [effectsFor,setEffectsFor]=useState<string|null>(null);
  const [filter,setFilter]=useState('all');
  const [page,setPage]=useState(0);
  const effectButton=useRef<HTMLButtonElement>(null);
  const effectBack=useRef<HTMLButtonElement>(null);
  const wasShowingEffects=useRef(false);
  const item=game.self.inventory.find(i=>i.id===selected)??game.self.inventory[0];
  const showingEffects=!!item&&effectsFor===item.id;
  const filtered=game.self.inventory.filter(i=>filter==='all'||filter==='genuine'&&i.knowledge.genuine===true||filter==='cursed'&&i.knowledge.cursed===true||filter==='unknown'&&(i.knowledge.genuine===undefined||i.knowledge.cursed===undefined));
  const pages=Math.max(1,Math.ceil(filtered.length/6));
  const at=Math.min(page,pages-1);
  useEffect(()=>{
    if(wasShowingEffects.current===showingEffects)return;
    (showingEffects?effectBack:effectButton).current?.focus();
    wasShowingEffects.current=showingEffects;
  },[showingEffects]);
  const playing=['APPRAISAL','TRADE'].includes(game.phase);
  const heading=<h2 id="inventory-title">{t('ของที่คุณเก็บไว้')} <span>{t('{n} ชิ้น',{n:game.self.inventory.length})}</span></h2>;
  const Shell=drawer?'details':'section';
  return <Shell className={`inventory${drawer?' drawer':''}`} aria-labelledby="inventory-title">
    {!item?<>{heading}<p className="inventory-empty">{t('คลังยังว่าง ซื้อจากพ่อค้าหรือแลกกับเพื่อนเพื่อเริ่มสะสม')}</p></>:<div className="inventory-layout">
      <div className={`inventory-collection ${showingEffects?'showing-details':''}`}>
        {showingEffects?<InventoryUsageDetails game={game} item={item} submit={submit} disabled={disabled} onBack={()=>setEffectsFor(null)} backRef={effectBack}/>:<>
          {heading}<small className="inventory-price-legend"><CoinIcon/>{pick('ราคาซื้อ','Purchase price')}</small>
          <div className="inventory-filters" role="group" aria-label={pick('กรองสินค้า','Filter items')}>{([['all',pick('ทั้งหมด','All')],['genuine',t('ของแท้')],['cursed',t('คำสาป')],['unknown',pick('ยังไม่รู้','Unknown')]] as const).map(([id,label])=><button key={id} type="button" aria-pressed={filter===id} onClick={()=>{setFilter(id);setPage(0);}}>{label}</button>)}</div>
          <ul className="inventory-row">{filtered.slice(at*6,at*6+6).map(i=><li key={i.id}><button type="button" className={`item-thumb ${i.id===item.id?'selected':''}`} aria-pressed={i.id===item.id} aria-label={inventoryLabel(game,i)} onClick={()=>setSelected(i.id)}>
            <span className="thumb-price" title={pick('ราคาที่ซื้อมา','Price paid')}><CoinIcon/>{i.paid??'—'}</span><span className="thumb-knowledge">{i.knowledge.genuine===true&&<AuthenticityIcon/>}{i.knowledge.cursed===true&&<FlameIcon/>}{(i.knowledge.genuine===undefined||i.knowledge.cursed===undefined)&&<span>?</span>}</span>
            <ItemVisual item={i}/><span className="thumb-label">{abilityItemLabel(i)}</span>
          </button></li>)}</ul>
          {!filtered.length&&<p className="inventory-filter-empty">{pick('ไม่มีสินค้าในหมวดนี้','No matching items')}</p>}
          <CompactPager className="inventory-pagination" page={at} pages={pages} onChange={setPage} label={pick('หน้าสินค้า','Inventory pages')}/>
        </>}
      </div>
      <div className={`inventory-detail ${showingEffects?'details-open':''}`} key={item.id}>
        <header className="inventory-detail-head"><h3 className="inventory-item-name">{abilityItemLabel(item)}</h3><RarityLabel item={item}/></header>
        <figure className="inventory-art"><ItemVisual item={item} alt={abilityItemLabel(item)} loading="eager"/></figure>
        <div className="inventory-facts-slot">{!showingEffects&&<InventoryKnownFacts game={game} item={item} submit={submit} disabled={disabled}/>}</div>
        {item.lockedUntil!==null&&<p className="inventory-lock-note">{t('ขายหรือแลกไม่ได้จนจบช่วง {n} ยังเปิดใช้ได้',{n:item.lockedUntil})}</p>}
        <div className="inventory-actions">
          {playing&&<div className="inventory-main-actions"><div className="inventory-use">
            {item.nativeEffectReady && (ITEM_SPECS[item.kind].nativeEffect==='effect:E71'||ITEM_SPECS[item.kind].nativeEffect==='effect:E72') ? <div role="group" aria-label={pick('เลือกสถานะ','Choose a status')}>{game.self.statuses.filter(status=>STATUS_ITEM_TARGETS[ITEM_SPECS[item.kind].nativeEffect as keyof typeof STATUS_ITEM_TARGETS].some(id=>id===status.id)&&status.starts<=game.encounter&&status.expires>=game.encounter&&status.charges>0&&(ITEM_SPECS[item.kind].nativeEffect!=='effect:E72'||!status.extendedByShawl)).map(status=><ComicButton key={status.id} disabled={disabled||game.self.energy<1} onClick={()=>submit({type:'activate',itemId:item.id,target:{statusId:status.id}})}>{statusName(status.id)} · 1 <EnergyIcon/></ComicButton>)}</div>:item.portalTargets?.length ? <div role="group" aria-label={pick('เลือกประตู','Choose a portal')}>{game.self.portals.filter(portal=>item.portalTargets?.includes(portal.id)).map(portal=><ComicButton key={portal.id} disabled={disabled||game.self.energy<1} onClick={()=>submit({type:'activate',itemId:item.id,target:{portalId:portal.id}})}>{npcName(portal.npc)} · 1 <EnergyIcon/></ComicButton>)}</div>:ITEM_SPECS[item.kind].nativeEffect&&!ITEM_SPECS[item.kind].explicitActivation?<span className="supporting">{ITEM_SPECS[item.kind].usage}</span>:(game.trustAbilities&&(ABILITY_ITEM_IDS as readonly string[]).includes(item.kind)||['autometa-coolant-canister','alien-phase-dial'].includes(item.kind))?<AbilityItemControls game={game} item={item} submit={submit} disabled={disabled}/>:((()=>{const why=activationBlock(game,item.id,disabled);return <button type="button" className="primary inventory-activate" disabled={disabled||!!why} title={tip(disabled&&locked,why)} onClick={()=>submit({type:'activate',itemId:item.id})}>{pick('เปิดใช้','Activate')} · {game.itemEffects&&ITEM_SPECS[item.kind].consumable?0:1}<EnergyIcon/></button>;})())}
          </div><button type="button" className="inventory-sell" disabled={game.phase!=='TRADE'} title={game.phase!=='TRADE'?pick('เสนอขายได้ในช่วงซื้อขาย','Available during trading'):undefined} aria-expanded={saleFor===item.id} aria-controls="inventory-sale-options" onClick={()=>setSaleFor(saleFor===item.id?null:item.id)}><AppraiseIcon/>{pick('เสนอขาย','Offer for sale')}</button></div>}
          {playing&&game.phase==='TRADE'&&saleFor===item.id&&<section id="inventory-sale-options" className="inventory-sale" aria-label={pick('กำหนดข้อเสนอขาย','Set sale terms')}><Share game={game} item={item} submit={submit} disabled={disabled}/></section>}
          <button ref={effectButton} type="button" className="inventory-effect-details" aria-expanded={showingEffects} onClick={()=>setEffectsFor(showingEffects?null:item.id)}><BookIcon/>{pick('รายละเอียดผลการใช้งาน','Usage details')}<span aria-hidden="true">{showingEffects?'×':'›'}</span></button>
        </div>
      </div>
    </div>}
  </Shell>;
}
export function Statuses({game}:{game:AppraisalView}) {
  const dead=!!game.survival && game.self.life===0;
  return <section className="statuses" aria-labelledby="status-title"><h2 id="status-title">{t('ผลติดตัว')} <span>{t('{n} อย่าง',{n:game.self.statuses.length})}</span></h2>
    {!game.self.statuses.length?<p>{t('ยังไม่มีผลดีหรือผลเสียติดตัว')}</p>:<ul className="status-badges">{game.self.statuses.map(s=><li key={s.id} className={s.id.startsWith('D')?'debuff':'buff'}>
      <StatusTerm id={s.id} survival={!!game.survival}/>{s.power!==undefined && <span>{pick('ความแรง','Strength')} {Math.round(s.power*100)}%</span>}
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
  const itemTitle=abilityItemLabel(item);
  const sellerOff=!!(seller?.paused || seller?.done);const offerOff=disabled || sellerOff;
  return <article className="trade-listing"><figure className="pedestal"><ItemVisual className="pedestal-item" item={item} alt={itemTitle}/></figure><div><h3>{itemTitle} · {name}</h3><p>{source==='npc'?t('ของในร้าน NPC · ต้องให้เจ้าของร้านอนุมัติ'):t('สินค้าของผู้เล่น · ราคาที่ต่ำไม่มีบทลงโทษจาก NPC')}</p><Provenance game={game} item={item} rebate={listing.rebate}/><FactSeals item={item}/><details className="listing-more"><summary>{t('รายละเอียดของชิ้นนี้')}</summary><AppraisalPrice item={item}/><ItemFacts item={item}/></details>
    {listing.purchase?<form onSubmit={e=>{e.preventDefault();if(valid)submit({type:'propose',sellerId:listing.ownerId,itemId:item.id,credits:price,...(swap?{swapItemId:swap}:{}),condition:useCondition,...(disputed?{challenge:disputed}:{}),...(seal?{sealId:seal.id}:{})});}}>
      {claimKeys.length>0 && <div className="claim-box"><h4>{t('ผู้ประเมินระบุว่า:')} {claimKeys.map(k=>claimText(k,claims![k]!)).join(' · ')}</h4>
        <ChoiceCards compact legend={t('ท้าทายคำระบุไหม')} value={disputed} onChange={setChallenge} disabled={disabled} options={[{value:'',title:t('เชื่อตามที่ระบุ'),tone:'quiet'},...claimKeys.map(k=>({value:k,title:t('ท้าทาย: {v}',{v:claimText(k,claims![k]!)})}))]}/>
        {disputed && <p>{t('ถ้าคำระบุเป็นเท็จ คุณลดราคา')} <strong>{t('{n} เครดิต',{n:winOff})}</strong> ({t('{pct}% ของราคาประเมิน {quote}',{pct:winPct(lenses),quote})}{lenses?t(' · แว่นจับพิรุธ {n} ชิ้นช่วยเพิ่ม',{n:lenses}):''}) · {t('ถ้าเป็นจริง คุณจ่ายผู้ประเมินเพิ่ม')} <strong>{t('{n} เครดิต',{n:lossFee})}</strong> ({t('{pct}% ของราคาประเมิน',{pct:CHALLENGE_PCT})}) · {t('ตัดสินตอนผู้ขายตอบรับ ไม่รวมค่านายหน้า')}</p>}
        {disputed && seals.length>0 && <ChoiceCards compact legend={t('แนบตราโมฆะ (ยกเลิกค่าปรับถ้าท้าทายผิด)')} value={seal?seal.id:''} onChange={setSealPick} disabled={disabled} options={[{value:'',title:t('ไม่แนบ'),tone:'quiet'},...seals.map(i=>({value:i.id,title:abilityItemLabel(i),art:i.image,detail:t('ใช้แล้วหมดเมื่อมีผลยกเลิก')}))]}/>}</div>}
      <div className="field"><label htmlFor={id}>{source==='npc'?t('ค่าแนะนำที่จะให้นักประเมิน'):t('เครดิตที่เสนอให้เจ้าของ')}</label><div className="stepper"><button type="button" aria-label={t('ลดราคา 1 เครดิต')} disabled={offerOff || valid && price<=0} title={tip(disabled&&locked,sellerOff&&t('เจ้าของพักหรือจบช่วงแล้ว ยื่นข้อเสนอไม่ได้'),valid&&price<=0&&t('ราคาต่ำสุดคือ 0'))} onClick={()=>setCredits(stepPrice(credits,-1))}><MinusIcon/></button><input id={id} type="number" inputMode="numeric" min="0" max="1000" step="1" value={credits} onChange={e=>setCredits(e.target.value)} disabled={offerOff}/><button type="button" aria-label={t('เพิ่มราคา 1 เครดิต')} disabled={offerOff || valid && price>=1000} title={tip(disabled&&locked,sellerOff&&t('เจ้าของพักหรือจบช่วงแล้ว ยื่นข้อเสนอไม่ได้'),valid&&price>=1000&&t('ราคาสูงสุดคือ 1000'))} onClick={()=>setCredits(stepPrice(credits,1))}><PlusIcon/></button></div></div>
      {source==='inventory'?<ChoiceCards legend={t('แลกของเพิ่ม (ไม่บังคับ)')} value={swap} onChange={setSwap} disabled={disabled || !!(seller?.paused || seller?.done)} options={[{value:'',title:t('ไม่แลกของ'),tone:'quiet'},...game.self.inventory.filter(i=>i.lockedUntil===null).map(i=>({value:i.id,title:abilityItemLabel(i),art:i.image,detail:inventoryLabel(game,i)}))]}/>:<Contract item={item} condition={useCondition} setCondition={setCondition} disabled={disabled} survival={!!game.survival}/>}
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
  return <section className="trades"><h2>{t('ต่อรองกับนักประเมินคนอื่น')}</h2><details className="info-fold"><summary>{t('วิธีการ')}</summary><p>{t('เจ้าของต้องเปิดรายการและตอบรับก่อนโอนของกับเงิน ราคาต่ำหรือ 0 เครดิตไม่มีผลจับผิดจาก NPC')}</p></details>
    {!listings.length?<p>{t('ยังไม่มีใครเปิดรายการ เปิดของจากคลังหรือร้านที่ประเมินแล้วให้เพื่อนยื่นข้อเสนอ')}</p>:<Pager label={t('รายการของเพื่อน')}>{listings.map(listing=><TradeListing key={listing.itemId} game={game} listing={listing} room={room} submit={submit} disabled={disabled}/>)}</Pager>}
    <h3>{t('ข้อเสนอซื้อขายของคุณ')}</h3>{!game.trades.length?<p>{t('ยังไม่มีข้อเสนอ')}</p>:<ul className="offers">{game.trades.map(tr=><li key={tr.id}><p><strong>{itemName(tr.item.kind)}</strong> · {t('{buyer} เสนอ {n} เครดิต',{buyer:name(tr.buyerId),n:tr.credits})}{tr.source==='npc'?t(' เป็นค่าแนะนำ นอกเหนือจากราคาพ่อค้า'):''}{tr.swapItem?t(' + แลก {name}',{name:itemName(tr.swapItem.kind)}):''} {t('ให้ {seller}',{seller:name(tr.sellerId)})}</p><AppraisalPrice item={tr.item}/>{tr.swapItem && <div className="swap-details"><h3>{t('ของแลกจาก {buyer}: {name}',{buyer:name(tr.buyerId),name:itemName(tr.swapItem.kind)})}</h3><img src={tr.swapItem.image} width="1254" height="1254" alt={itemName(tr.swapItem.kind)}/><AppraisalPrice item={tr.swapItem}/><ItemFacts item={tr.swapItem}/><p>{t('ผลที่เป็นไปได้:')} <Rich text={tr.swapItem.possibleBenefit} survival={!!game.survival}/> · <Rich text={tr.swapItem.possibleDrawback} survival={!!game.survival}/></p></div>}<p>{tr.challenge?t('ผู้ซื้อท้าทายคำระบุ "{v}"{seal} · ',{v:claimText(tr.challenge,(game.listings.find(l=>l.itemId===tr.itemId)?.claims?.[tr.challenge])??true),seal:tr.sealId?t(' แนบตราโมฆะ'):''}):''}{tr.condition?t('ผู้ซื้อยอมรับเงื่อนไข NPC · '):''}{tr.status==='open'?t('รอผู้ขายตอบรับ'):tr.status==='accepted'?t('ตกลงและโอนสำเร็จแล้ว'):t('ปฏิเสธหรือหมดอายุแล้ว')}</p>{tr.sellerId===game.self.id && tr.status==='open' && <div className="actions"><button className="primary" disabled={disabled || !!game.self.eventOffer && isConsequence(game.self.eventOffer.id)} title={tip(disabled&&locked,t('ตอบเหตุการณ์ก่อน'))} onClick={()=>submit({type:'respond',offerId:tr.id,accept:true})}>{t('ตกลงและโอนทันที')}</button><button disabled={disabled || !!game.self.eventOffer && isConsequence(game.self.eventOffer.id)} title={tip(disabled&&locked,t('ตอบเหตุการณ์ก่อน'))} onClick={()=>submit({type:'respond',offerId:tr.id,accept:false})}>{t('ปฏิเสธ')}</button></div>}</li>)}</ul>}
  </section>;
}
