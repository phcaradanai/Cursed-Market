import {PersonalScoreResults} from './PersonalScoreResults.js';
import {CollectorWishlist} from './CollectorWishlist.js';
import {ComicTooltip} from './ComicTooltip.js';
import {appraisalMood,portalMood,usePortalReaction} from './merchant-reactions.js';
import {GhostWorld} from './GhostWorld.js';
import {PostRewardScreen} from './PostRewardScreen.js';
import {TradeScreen} from './TradeScreen.js';
import { Pager } from './Pager.js';
import type { DeskPage } from './components.js';
import { ItemVisual } from './ItemVisual.js';
import { TheftPanel } from './SecureEconomy.js';
import { abilityText } from './ability-text.js';
import {StatusMenu} from './StatusMenu.js';
import {LedgerMenu} from './LedgerMenu.js';
import {RulesMenu} from './RulesMenu.js';
import {ComicMenu,ComicButton} from './ComicUI.js';
import { HeldEffects } from './HeldEffects.js';
import { phaseHint, phaseLabel, readable, unsoldItems, defaultConsequence, needShort, npcAcceptanceChance } from './model.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DialogFeedback } from './GameDialog.js';
import { CORE2, rerollCost } from '../game/appraisal/core2.js';
import type { FormEvent, ReactElement } from 'react';
import { ITEM_SPECS, itemImage, npcImage } from '../game/appraisal/content.js';
import type { AppraisalBotPolicy, AppraisalRoomView, AppraisalClientMessage, AppraisalTimerSettings } from '../shared/appraisal-protocol.js';
import { APPRAISAL_BOT_POLICIES, APPRAISAL_TIMER_PHASES } from '../shared/appraisal-protocol.js';
import { useConnection } from './connection.js';
import { RoundReward } from './RoundReward.js';
import { AppraisalDesk, CleanseDeal, WishDeal, DarkMarket, Inventory, Unsold } from './components.js';
import { EventModal, Toasts, useOutcomes } from './feedback.js';
import type { Decision } from './model.js';
import { ChoiceCards, ItemTerm } from './lore.js';
import { BagIcon, BookIcon, BuffIcon, CoinIcon, EnergyIcon, EventIcon, LifeIcon, MarketIcon, PassIcon, SoundIcon, SettingsIcon, LanguageIcon, ExitIcon, TimerIcon, HandshakeIcon, LightningIcon } from './icons.js';
import { setLang, t, useLang, pick } from './i18n.js';
import { LockReason, tip, useLock } from './reasons.js';
import { itemName, npcName, statusName, omenText } from './catalog-text.js';
import { ENERGY_DEAL_NPCS } from '../game/appraisal/pulse.js';
import { PROVENANCE_PERCENT } from '../game/appraisal/scoring.js';
import { BonusBadge, Fortune, SeatNames } from './meters.js';

export type Send=(message:AppraisalClientMessage)=>boolean;
const graphemes=(text:string)=>typeof Intl.Segmenter==='function'?[...new Intl.Segmenter('th',{granularity:'grapheme'}).segment(text)].map(s=>s.segment):[...text];
/** Thai leading vowels sit before their consonant, so a monogram keeps both glyphs. */
export function monogram(name:string):string {
  const chars=graphemes(name.trim());
  return (/^[เแโใไ]/.test(chars[0]??'')?chars.slice(0,2).join(''):chars[0]??'?').toUpperCase();
}
export function SeatDisc({name,index}:{name:string;index:number}) {
  return <span className="seat-disc" data-seat={index%4} aria-hidden="true">{monogram(name)}</span>;
}
/** Language switch in the masthead. Labels name the other language, so they never need translating. */
export function LangToggle() {
  const lang=useLang();
  return <button type="button" className="lang-toggle" aria-label={lang==='th'?'Switch to English':'Switch to Thai'} onClick={()=>setLang(lang==='th'?'en':'th')}>{lang==='th'?'EN':'ไทย'}</button>;
}
const BOT_STYLE:Record<AppraisalBotPolicy,[string,string]>={
  cautious:['ระวังตัว','ประเมินสุภาพ เลี่ยงความเสี่ยง'],aggressive:['บุกเบิก','กดราคาต่ำและรับเหตุการณ์เสี่ยง'],
  collector:['นักสะสม','เก็บของมูลค่าสูงและของสะสม'],trader:['พ่อค้า','เน้นขายต่อและตลาดเงา'],
};
export const botStyleName=(policy:AppraisalBotPolicy)=>t(BOT_STYLE[policy][0]);
/** The host adds computer players so the table can start with one human. */
function BotControls({room,send,disabled}:{room:AppraisalRoomView;send:Send;disabled:boolean}) {
  const locked=useLock();
  const host=room.hostId===room.yourSeatId;const [policy,setPolicy]=useState<AppraisalBotPolicy>('cautious');
  if(!host) return null;
  const full=room.seats.length>=4;
  return <div className="bot-controls"><details className="bot-personality"><summary>{pick('นิสัยบอท','Bot personality')} · {botStyleName(policy)}</summary><ChoiceCards compact legend={t('เพิ่มบอทเข้าโต๊ะ · เล่นคนเดียวได้')} value={policy} onChange={v=>setPolicy(v as AppraisalBotPolicy)} disabled={disabled || full}
      options={APPRAISAL_BOT_POLICIES.map(p=>({value:p,title:t(BOT_STYLE[p][0]),detail:t(BOT_STYLE[p][1])}))}/></details>
    <div className="actions"><button disabled={disabled || full} title={tip(disabled&&locked,full&&t('โต๊ะเต็ม 4 ที่นั่งแล้ว'))} onClick={()=>send({type:'add-bot',policy})}>{t('เพิ่มบอท: {style}',{style:botStyleName(policy)})}</button></div>
    <p className="supporting">{full?t('โต๊ะเต็ม 4 ที่นั่งแล้ว'):t('บอทเล่นด้วยข้อมูลเท่าที่ผู้เล่นเห็น ไม่รู้คำตอบลับ และพร้อมเสมอ')}</p></div>;
}
function Rules({timers,survival,trustAbilities}:{timers?:AppraisalTimerSettings|undefined;survival?:boolean|undefined;trustAbilities?:boolean|undefined}={}) {
  const phaseLabels=(phase:string)=>phaseLabel(phase as never);
  return <details className="rules"><summary>{t('กติกาก่อนเริ่ม · อ่านใน 2 นาที')}</summary><div>
    {trustAbilities && <p>{abilityText('พันธะพ่อค้า: เชื่อใจ 1 เพื่อปลดล็อก เพิ่มขั้นที่ 3 และ 6 ใช้ได้รวมหนึ่งความสามารถต่อช่วง เวลารอนับเป็นช่วงพบพ่อค้า สำเนา Swarm มี effect 40% ค่าทรัพยากรปัดลง ผลแบบแบ่งขนาดไม่ได้มีโอกาสทำงาน 40% สำเนา #1 ใช้ภาพต้นฉบับและทำสำเนาต่อไม่ได้','Merchant bonds unlock at trust 1 and improve at 3 and 6. Use one ability per encounter; waits count encounters. Swarm copies have 40% effects; integer resources round down, indivisible effects have a 40% trigger chance. Copy #1 shares its original artwork and cannot be copied.')}</p>}
    <p>{t('คุณเป็นนักประเมิน 2–4 คน แต่ละคนเลือกประตูพบพ่อค้าของตนเอง ประเมิน ซื้อ เก็บ ใช้ และแลกสินค้า {mode} เส้นทางใหม่มีพ่อค้า เหตุการณ์ และรายการรับซื้อที่เปลี่ยนไป',{mode:survival===true?t('เล่นจนทุกคนชีวิตหมด แล้ว Collector รับของและคิดคะแนน'):survival===false?t('เล่น 3 ช่วงพบพ่อค้าต่อการเดินทาง'):t('ตรวจวงจรชีวิตและการคิดคะแนนของห้องก่อนเริ่ม')})}</p>
    <ol><li><strong>{t('เลือกประตู:')}</strong> {t('ดูรายการ Dark Market ก่อนเลือกพ่อค้า จัดการเหตุการณ์ที่เสนอให้ก่อนเข้าประตู')}</li><li><strong>{t('ประเมินและซื้อ:')}</strong> {t('สินค้าพ่อค้าแต่ละชิ้นเลือกตรวจสอบหรือประเมินฟรี 1 ครั้ง ตรวจฟรีนี้ไม่หักโควตา ตรวจเพิ่มเริ่มต้น 2 ครั้งต่อช่วง ของสะสมอาจเพิ่มสิทธิ์หรือให้ตรวจฟรี ตรวจได้สามอย่าง คือราคา ความแท้ และคำสาป รู้ความแท้ไม่ได้แปลว่าไร้คำสาป เปิดใช้ของแท้ได้ผลดี ของปลอมมีโอกาส 40% ที่ผลดียังออกฤทธิ์ ของมีคำสาปรับผลเสีย ราคาที่คุณประเมินต้องรอ NPC ยอมรับจึงเป็นราคาซื้อ กดราคาต่ำเพิ่มความเสี่ยงถูกจับผิดและเสียทรัพย์ Dark One มีสัญญาที่ถึงชีวิตได้')}</li><li><strong>{t('ต่อรอง:')}</strong> {t('เปิดของหรือสินค้าร้านที่คุณประเมินให้คนอื่นชมและยื่นข้อเสนอ ผู้ขายตอบรับก่อนโอน เสนอราคากับผู้เล่นไม่มีบทลงโทษจาก NPC')}</li><li><strong>{t('คิดผล:')}</strong> {survival===true?t('Collector รวมเครดิตกับมูลค่าของที่เหลือ แล้วปรับด้วย buff/debuff คะแนน ผู้ตายยังได้คะแนนจากทรัพย์ที่เก็บไว้ ไม่มีโบนัสประเมินหรือคะแนนสะสมรายช่วง'):survival===false?t('คะแนนจากทรัพย์สินที่เพิ่มขึ้นและประเมินตรงมูลค่าจริงในช่วง ±10% ได้ 5 คะแนนต่อชิ้น'):t('ดูสูตรคะแนนในกติกาของห้อง')} {t('ของปลอมและของต้องสาปมีมูลค่าคะแนนลดลง')}</li></ol>
    <p>{t('Dark Market เปิดทุกช่วงก่อนพบพ่อค้า รับซื้อจนจบช่วงนั้น สิทธิ์แยกต่อรายการและผู้เล่น ซื้อของใหม่มาขายได้ ขายแล้วอาจเสียดายเมื่อรอบหน้ารับซื้อแพงกว่า')}</p>
    {survival===true?<><p>{t('พลังไม่ใช่ชีวิต เริ่มช่วงใหม่ไม่เสียพลัง พลัง 0 ยังเลือกประตูและรับดีลฟื้นได้ แต่การกระทำที่ใช้พลังต้องมีพอ ไม่มีฟื้นฟรีท้ายช่วง')}</p><p>{t('เริ่มชีวิต 6 สูงสุด 6 ท้ายทุกช่วงเสียชีวิต 1 ของแท้ประเภทอาหารหรือยาฟื้นชีวิต 2 เมื่อเปิดใช้ ของมีคำสาปเปิดใช้เสียชีวิต 1 ดีลพ่อค้าฟื้นชีวิตหรือพลังได้หนึ่งครั้งต่อช่วง ชีวิต 0 เป็นผู้ชมจนทุกคนตาย ไม่กลับในช่วงถัดไป')}</p><p>{t('ถ้ายังมีคนรอดถึงช่วง {n} Collector มาตอนจบช่วงนั้นและคิดคะแนนทุกคนทันที',{n:CORE2.collectorEncounter})}</p><p>{t('Vampire, Autometa และ Alien รับ 2 เครดิตเพื่อฟื้นพลัง 3; Orc, Beast และ Dark One รับ 4 เครดิตเพื่อฟื้นชีวิต 2 สัญญาโลหิตฟรีเสียชีวิต 1 และรับความกระหายโลหิต')}</p><p>{t('Collector ใช้มูลค่าจริง ของปลอมเหลือ 25% คำสาปลดอีก 25% ปัดลงต่อชิ้น {b10}ที่ยังอยู่เพิ่มคะแนนรวม 20% ความกระหายโลหิตที่ยังอยู่ลด 20% รวมเปอร์เซ็นต์แล้วปัดลงครั้งเดียว สถานะและทรัพย์ของผู้ตายเก็บไว้จน Collector มา',{b10:statusName('B10')})}</p></>:survival===false?<p>{t('พลังหมดหรือตายพักเฉพาะช่วงนั้นแล้วกลับช่วงหน้า ตายได้คะแนนช่วงนั้น 0 คะแนนเดิมยังอยู่ พลังหมดคงคะแนนที่ทำได้ เมื่อกลับจากพักฟื้นอย่างน้อย 4 พลัง ปกติฟื้น 2 สูงสุด 10')}</p>:null}
    <p><strong>{t('เครดิตหลังซื้อขายทุกช่วง:')}</strong> {t('ช่วงคี่รับ 10 ช่วงคู่รับ 15 เครดิต รับเลยหรือทายหัวก้อยได้ เพิ่มเหรียญโดยจ่ายจากกระเป๋าเหรียญละ 10 ในช่วงคี่ / 15 ในช่วงคู่ เงินทบรวมในยอดเดิมพัน ต้องถูกครบทุกเหรียญจึงได้เพิ่ม เริ่มต้นได้หรือเสีย 5 เครดิตต่อเหรียญ ของสะสมปรับยอดต่อเหรียญและโอกาสถูก เล่นต่อจนยอดเป็น 0 หรือหยุดรับได้ เมื่อหมดเวลารับยอดที่เหลืออัตโนมัติ')}</p>
    <p>{t('เหตุการณ์ RNG 50 ประเภท (ห้องที่เปิดส่วนขยายและกติกาขัดเกลามีเพิ่มอีก 18) และผลติดตัว 40 ประเภททำงานตามเงื่อนไข จ่ายเครดิตหรือรับ debuff เพื่อเสี่ยงผลตอบแทน เครดิตเป็นทรัพยากรในเกม')}</p>
    <p><strong>{t('ค่านายหน้าและความไว้ใจ:')}</strong> {t('ของที่คุณประเมินขายจากร้าน NPC ได้ รับเริ่มต้น 10% ของราคาขายจริง (ปัดลง) ครั้งเดียวต่อชิ้น และความไว้ใจ NPC +1 สูงสุด 10 แต่ละระดับเพิ่มโอกาสยอมรับราคาต่ำกว่าปกติ 5 จุดเปอร์เซ็นต์ ยังมีความเสี่ยงถูกจับผิด')}</p>
    <p><strong>{t('เงื่อนไข Dark Market:')}</strong> {t('แต่ละรายการอาจต้องการของแท้ ของปลอม ของมีคำสาป หรือไร้คำสาป ขายตรงเงื่อนไขได้โบนัสเครดิต พลัง ชีวิต หรือผลดีตามป้าย ผิดเงื่อนไขเลือกรับราคาลด 20% หรือสละตามที่ระบุเพื่อรับราคาเต็ม โดยไม่ได้โบนัส ตลาดตรวจคุณสมบัติจริงตอนขาย หากยังตรวจไม่รู้ต้องยอมรับความเสี่ยงก่อน')}</p>
    <p><strong>{t('ประเมินแล้วต้องรับผิดชอบ:')}</strong> {t('ของที่คุณตีราคาแล้วแต่ไม่มีใครซื้อ ต้องซื้อเอง ยอมรับโทษจากพ่อค้า หรือส่งต่อ Dark Market (อาจติด debuff หรือโดนค่าผ่านทาง) ถ้าไม่เลือกจะรับโทษเอง')}</p><p><strong>{t('ประมูลตลาดเงา:')}</strong> {t('ของที่ Dark Market เก็บไว้อาจโผล่มาให้ประมูลแบบปิดซองในบางช่วง')}</p><p><strong>{t('ของติดตัวมีผล:')}</strong> {t('พ่อค้าบางรายสนใจของที่คุณถือ เช่น Vampire ขอแลกของในร้านกับเลือดบริสุทธิ์ มีข้อเสนอแบบนี้ 32 แบบ')}</p>
    <p><strong>{t('ลางประจำช่วง (ห้องกติกาขัดเกลา):')}</strong> {t('ทุกช่วงมีลางสุ่มจากเส้นทางของห้อง ใช้กับทุกคนและไม่ซ้ำช่วงก่อนหน้า เช่น ตลาดคึกคัก ราคาตลาดเฟ้อ ภาษีเงา ราคาขายของที่คุณเป็นเจ้าของ (Dark Market ผู้ซื้อตามหา ผู้ซื้อพิเศษ) ปรับตามผลติดตัวและลางรวมกัน ไม่รวมของที่ประเมินให้พ่อค้า ของสะสมบางชิ้นเพิ่มพลังสูงสุด ชีวิตสูงสุด หรือจำนวนสัญญาตามหาของ ขายออกแล้วส่วนที่เกินหายไป')}</p>
    <p>{timers?.enabled===false?t('ห้องนี้ไม่จับเวลา รอทุกคนจบช่วงหรือยืนยันไปต่อ ผู้ที่หลุดต้องกลับมาจึงเล่นต่อครบได้'):timers?t('เวลาในห้อง: {times}',{times:APPRAISAL_TIMER_PHASES.map(phase=>`${phaseLabels(phase)} ${timers.durationsMs[phase]/1000} ${t('วินาที')}`).join(' · ')}):t('ค่าเริ่มต้น: เลือกประตู 30 วินาที ประเมิน 90 วินาที ต่อรอง 45 วินาที เจ้าของห้องเลือกจับเวลาหรือไม่และปรับเวลาได้ก่อนเริ่ม')}</p>
    <p>{t('เมื่อเปิดจับเวลาและหมดช่วง ข้อเสนอเสริมถูกปฏิเสธ ผลลงโทษที่รับสัญญาไว้ยังมีผล ผู้ที่หลุดเปิดหน้าเดิมเพื่อกลับที่นั่งเดิมได้')}</p>
  </div></details>;
}
function Entry({send,disabled}:{send:Send;disabled:boolean}) {
  const locked=useLock();
  const [name,setName]=useState('');const [code,setCode]=useState('');const [joining,setJoining]=useState(false);
  const validCode=/^[A-Z2-9]{6}$/.test(code.trim());
  const enter=(e:FormEvent)=>{e.preventDefault();if(disabled || !name.trim() || joining && !validCode)return;send(joining?{type:'join',roomCode:code.trim().toUpperCase(),name:name.trim()}:{type:'create',name:name.trim()});};
  return <div className="entry-layout">
    <header className="entry-copy"><p className="entry-logo" aria-hidden="true">Cursed Market</p><h1>{t('ทุกข้อเสนอ')}<br/>{t('มีราคาที่ต้องจ่าย')}</h1><p>{t('ประเมินของจากต่างมิติ ลองกดราคา เก็บของที่อยากได้ และเสี่ยงกับสัญญาที่พ่อค้าเสนอ')}</p></header>
    <div className="entry-art" aria-hidden="true"><img src="/art/comic/merchants/autometa/idle.png" alt="" width="480" height="480"/></div>
    <div className="entry-console"><div className="entry-intent" role="group" aria-label={pick('เริ่มเล่น','Start playing')}><button type="button" aria-pressed={!joining} onClick={()=>setJoining(false)}>{t('สร้างห้องใหม่')}</button><button type="button" aria-pressed={joining} onClick={()=>setJoining(true)}>{t('เข้าห้อง')}</button></div>
      <form onSubmit={enter}><label htmlFor="player-name">{t('ชื่อที่ใช้ในเกม')}</label><input id="player-name" value={name} onChange={e=>setName(e.target.value)} minLength={1} maxLength={16} autoComplete="nickname" placeholder={pick('เช่น ชื่อเล่นของคุณ','e.g. your nickname')} required disabled={disabled}/>
      <div className="entry-join-fields" hidden={!joining}><label htmlFor="room-code-entry">{t('รหัสห้องของเพื่อน')}</label><input id="room-code-entry" className="room-code" value={code} onChange={e=>setCode(e.target.value.toUpperCase())} minLength={6} maxLength={6} pattern="[A-Z2-9]{6}" autoComplete="off" spellCheck={false} placeholder="K7M2QX" required={joining} disabled={disabled || !joining}/></div>
      <button type="submit" className="primary" disabled={disabled || !name.trim() || joining && !validCode} title={tip(disabled&&locked,!name.trim()&&t('ใส่ชื่อที่ใช้ในเกมก่อน'),joining&&!validCode&&t('ใส่รหัสห้องของเพื่อน 6 ตัว'))}>{joining?t('เข้าห้อง'):t('สร้างห้องใหม่')}</button>
    </form><p className="entry-seats">{t('ห้องส่วนตัวสำหรับ 2–4 คน · เพื่อนทุกคนใช้ที่อยู่เกมเดียวกัน')}</p></div>
    <div className="entry-more"><Rules survival trustAbilities/></div>
  </div>;
}
export function RoomTimers({room,send,disabled}:{room:AppraisalRoomView;send:Send;disabled:boolean}) {
  const stored=room.timerSettings;const host=room.hostId===room.yourSeatId;
  const key=JSON.stringify(stored);
  const [enabled,setEnabled]=useState(stored?.enabled??true);
  const [seconds,setSeconds]=useState(()=>Object.fromEntries(APPRAISAL_TIMER_PHASES.map(phase=>[phase,String((stored?.durationsMs[phase]??1000)/1000)])));
  useEffect(()=>{if(stored){setEnabled(stored.enabled);setSeconds(Object.fromEntries(APPRAISAL_TIMER_PHASES.map(phase=>[phase,String(stored.durationsMs[phase]/1000)])));}},[key]);
  if(!stored)return <p>{t('ห้องนี้ใช้เวลาเริ่มต้นของเซิร์ฟเวอร์')}</p>;
  if(!host)return <p>{stored.enabled?t('จับเวลา: {times}',{times:APPRAISAL_TIMER_PHASES.map(phase=>`${phaseLabel(phase)} ${stored.durationsMs[phase]/1000} ${t('วินาที')}`).join(' · ')}):t('ไม่จับเวลา · รอทุกคนจบช่วงหรือยืนยันไปต่อ')}</p>;
  const valid=APPRAISAL_TIMER_PHASES.every(phase=>Number.isInteger(Number(seconds[phase])) && Number(seconds[phase])>=1 && Number(seconds[phase])<=900);
  const apply=(nextEnabled:boolean,nextSeconds:Record<string,string>)=>{
    const ok=APPRAISAL_TIMER_PHASES.every(phase=>Number.isInteger(Number(nextSeconds[phase])) && Number(nextSeconds[phase])>=1 && Number(nextSeconds[phase])<=900);
    if(nextEnabled&&!ok)return;
    const durationsMs=ok?Object.fromEntries(APPRAISAL_TIMER_PHASES.map(phase=>[phase,Number(nextSeconds[phase])*1000])) as AppraisalTimerSettings['durationsMs']:stored.durationsMs;
    if(nextEnabled===stored.enabled && APPRAISAL_TIMER_PHASES.every(phase=>durationsMs[phase]===stored.durationsMs[phase]))return;
    send({type:'timer-settings',settings:{enabled:nextEnabled,durationsMs}});
  };
  return <form onSubmit={e=>e.preventDefault()}><fieldset className="timer-settings"><legend>{t('เวลาในห้อง')}</legend>
    <ChoiceCards compact legend={t('รูปแบบเวลา')} value={enabled?'timed':'untimed'} onChange={v=>{const next=v==='timed';setEnabled(next);apply(next,seconds);}} disabled={disabled} options={[{value:'timed',title:t('จับเวลา'),detail:t('หมดเวลาแล้วเกมเดินต่อเอง')},{value:'untimed',title:t('ไม่จับเวลา'),detail:t('รอทุกคนกดจบช่วง')}]}/>
    <div className="timer-fields">{APPRAISAL_TIMER_PHASES.map(phase=><label key={phase} htmlFor={`timer-${phase}`}>{t('{phase} (วินาที)',{phase:phaseLabel(phase)})}<input id={`timer-${phase}`} type="number" min="1" max="900" step="1" value={seconds[phase]} onChange={e=>setSeconds({...seconds,[phase]:e.target.value})} onBlur={()=>apply(enabled,seconds)} onKeyDown={e=>{if(e.key==='Enter')apply(enabled,seconds);}} disabled={disabled||!enabled} required/></label>)}</div>
    <p>{enabled?(valid?t('ตั้งได้ช่วงละ 1–900 วินาที ทุกคนจบช่วงแล้วไปต่อทันที'):t('ใส่เวลาเป็นจำนวนเต็ม 1–900 วินาทีให้ครบทุกช่วง')):t('ไม่มีการข้ามอัตโนมัติเมื่อรอ คนที่หลุดต้องกลับมาเพื่อจบช่วงหรือยืนยันไปต่อ')}</p>
    <p className="supporting">{t('เปลี่ยนเวลาแล้วทุกคนต้องกดพร้อมใหม่')}</p>
  </fieldset></form>;
}
function Lobby({room,send,disabled}:{room:AppraisalRoomView;send:Send;disabled:boolean}) {
  const locked=useLock();
  const self=room.seats.find(s=>s.id===room.yourSeatId);const host=room.hostId===room.yourSeatId;
  const [copied,setCopied]=useState('');const codeRef=useRef<HTMLInputElement>(null);
  const copy=async()=>{try {await navigator.clipboard.writeText(room.code);setCopied(t('คัดลอกรหัสแล้ว'));}catch {codeRef.current?.select();setCopied(t('เลือกรหัสไว้แล้ว กดคัดลอกด้วยตัวเอง'));}};
  const ready=room.seats.length>=2 && room.seats.every(s=>(s.ready||s.id===room.hostId) && s.connected);
  return <section className="lobby">
    <header className="lobby-head"><div><h1>{t('โต๊ะนักประเมิน')}</h1><p>{t('แชร์ที่อยู่เกมกับรหัสนี้ให้เพื่อน ทุกคนพร้อมแล้วเจ้าของห้องเริ่มได้')}</p></div><div className="code-plaque"><div className="code-copy"><label htmlFor="room-code-display">{t('รหัสห้อง')}</label><input ref={codeRef} id="room-code-display" className="room-code" value={room.code} readOnly/><button onClick={()=>void copy()}>{t('คัดลอกรหัส')}</button></div><p role="status">{copied}</p></div></header>
    <ul className="seat-list">{room.seats.map((s,index)=><li key={s.id}><SeatDisc name={s.name} index={index}/><strong>{s.name}{s.id===room.yourSeatId?t(' (คุณ)'):''}</strong><span>{s.bot?t('บอท · {style}',{style:botStyleName(s.bot)}):`${s.id===room.hostId?t('เจ้าของห้อง · '):''}${!s.connected?t('หลุดจากห้อง'):s.id===room.hostId||s.ready?t('พร้อมแล้ว'):t('ยังไม่พร้อม')}`}</span>{host && s.bot && <button disabled={disabled} title={tip(disabled&&locked)} onClick={()=>send({type:'remove-bot',seatId:s.id})}>{t('นำ {name} ออก',{name:s.name})}</button>}{host && !s.bot && !s.connected && <button disabled={disabled} title={tip(disabled&&locked)} onClick={()=>send({type:'remove-seat',seatId:s.id})}>{t('นำ {name} ออก',{name:s.name})}</button>}</li>)}</ul>
    <div className="lobby-foot">
      <div className="lobby-host-tools"><BotControls room={room} send={send} disabled={disabled}/>
        <details className="lobby-setup"><summary>{t('ตั้งค่าเกม')}</summary><div className="lobby-settings">
        <Rules timers={room.timerSettings} survival={room.mode==='survival'} trustAbilities/>
        <details className="lobby-more"><summary>{t('เวลาในห้อง')}</summary><RoomTimers room={room} send={send} disabled={disabled}/></details>
        </div></details>
      </div>
      <div className="actions lobby-actions">{host && !ready && <p className="lobby-start-hint" role="status">{room.seats.length<2?pick('เพิ่มบอทหรือแชร์รหัสให้เพื่อน แล้วเริ่มได้','Add a bot or share your room code to start'):t('ทุกคนต้องออนไลน์และกดพร้อมก่อน')}</p>}{!host && <button className={self?.ready?'':'primary'} disabled={disabled} title={tip(disabled&&locked)} onClick={()=>send({type:'ready',ready:!self?.ready})}>{self?.ready?t('ยังไม่พร้อม'):t('ฉันพร้อมแล้ว')}</button>}{host && <button className="primary start" disabled={disabled || !ready} title={tip(disabled&&locked,!ready&&(room.seats.length<2?t('ต้องมีอย่างน้อย 2 ที่นั่ง เพิ่มบอทหรือรอเพื่อน'):t('ทุกคนต้องออนไลน์และกดพร้อมก่อน')))} onClick={()=>send({type:'start'})}>{t('เริ่มการเดินทาง')}</button>}<button disabled={disabled} title={tip(disabled&&locked)} onClick={()=>send({type:'leave'})}>{t('ออกจากห้อง')}</button></div>
    </div>
  </section>;
}
function Countdown({room}:{room:AppraisalRoomView}) {
  const [remaining,setRemaining]=useState<number|null>(null);
  useEffect(()=>{
    if(room.deadline===null){setRemaining(null);return;}
    const offset=room.serverTime-Date.now();
    const update=()=>setRemaining(room.deadline===null?null:Math.max(0,Math.ceil((room.deadline-Date.now()-offset)/1000)));
    update();const timer=setInterval(update,250);return()=>clearInterval(timer);
  },[room.deadline,room.serverTime]);
  return room.timerSettings?.enabled===false && room.game?.phase!=='RESULTS'?<p className="countdown untimed" title={t('ไม่จับเวลา · {wait}',{wait:room.game?.phase==='REVEAL'?t('รอทุกคนยืนยันไปต่อ'):t('รอทุกคนจบช่วง')})}><TimerIcon/><span>{t('ไม่จับเวลา · {wait}',{wait:room.game?.phase==='REVEAL'?t('รอทุกคนยืนยันไปต่อ'):t('รอทุกคนจบช่วง')})}</span></p>:remaining===null?null:<p className={`countdown${remaining<=10?' urgent':''}`} aria-live="off"><TimerIcon/><span>{t('เหลือ {n} วินาที',{n:remaining})}</span></p>;
}
type Player=NonNullable<AppraisalRoomView['game']>['players'][number];
function playerState(room:AppraisalRoomView,p:Player):{kind:'spectator'|'paused'|'done'|'deciding'|'finished';text:string} {
  const game=room.game!;
  if(game.phase==='RESULTS')return {kind:'finished',text:t('จบการเดินทาง')};
  if(game.survival && p.life===0)return {kind:'spectator',text:t('ผู้ชม · ชีวิตหมด')};
  if(game.phase==='REVEAL')return room.revealReady.includes(p.id)?{kind:'done',text:t('พร้อมไปต่อแล้ว')}:{kind:'deciding',text:t('รอยืนยันไปต่อ')};
  return p.paused==='dead'?{kind:'paused',text:t('พัก: ตาย')}:p.paused==='exhausted'?{kind:'paused',text:t('พัก: พลังหมด')}:p.done?{kind:'done',text:t('จบช่วงนี้แล้ว')}:{kind:'deciding',text:t('กำลังตัดสินใจ')};
}
const seatName=(room:AppraisalRoomView,id:string)=>room.matchSeats.find(s=>s.id===id)?.name??t('นักประเมิน');
function Roster({room,detailed=false}:{room:AppraisalRoomView;detailed?:boolean}) {
  const game=room.game!;
  return <ul className={detailed?"settings-roster":"roster"} aria-label={t('สถานะผู้เล่นในโต๊ะ')}>{game.players.map((p,index)=>{
    const state=playerState(room,p);const offline=!room.seats.find(s=>s.id===p.id)?.connected;const name=seatName(room,p.id);
    const label=`${name}${p.id===game.self.id?t(' · คุณ'):''} · ${state.text}${offline?t(' · หลุดการเชื่อมต่อ'):''}`;
    return <li key={p.id} className={`${state.kind}${offline?' offline':''}${p.id===game.self.id?' you':''}`} title={label}>{detailed?<><span className="settings-seat-number" aria-hidden="true">{index+1}</span><strong className="settings-player-name">{name}{p.id===game.self.id&&name!==t('คุณ')&&<small>{t('คุณ')}</small>}</strong><span className="settings-player-state"><i aria-hidden="true"/>{offline?t('หลุดการเชื่อมต่อ'):state.text}</span></>:<><SeatDisc name={name} index={index}/><span className="roster-name" aria-hidden="true">{p.id===game.self.id?t('คุณ'):name}</span><span className="sr-only">{label}</span></>}</li>;
  })}</ul>;
}
function ReadyForNext({room,send,disabled}:{room:AppraisalRoomView;send:Send;disabled:boolean}) {
 const locked=useLock(),game=room.game!,waiting=room.revealReady.includes(room.yourSeatId);
 if(game.survival&&game.self.life===0)return <p>{t('คุณเป็นผู้ชม ไม่ต้องยืนยันช่วงถัดไป')}</p>;
 const text=waiting?(game.survival?t('พร้อมแล้ว รอผู้ที่ยังมีชีวิต'):t('พร้อมแล้ว รอเพื่อน')):game.self.roundReward&&!game.self.roundReward.settled?t('รับ {n} เครดิตและไปต่อ',{n:game.self.roundReward.amount}):game.survival?t('พร้อมไปช่วงถัดไป'):t('พร้อมไปต่อ');
 return <ComicButton tone="primary" disabled={disabled||waiting} title={tip(disabled&&locked,waiting&&t('คุณพร้อมแล้ว รอผู้เล่นคนอื่น'))} onClick={()=>{if(room.matchId)send({type:'reveal-ready',matchId:room.matchId,encounter:game.encounter});}}>{text}</ComicButton>;
}
export function SurvivalResults({room,send,disabled}:{room:AppraisalRoomView;send:Send;disabled:boolean}) {
  const locked=useLock();
  const game=room.game!;const final=game.phase==='RESULTS';
  if(final&&game.collector?.length&&game.collector.every(row=>row.personalScore))return <PersonalScoreResults room={room} send={send} disabled={disabled}/>;
  const name=(id:string)=>room.matchSeats.find(s=>s.id===id)?.name??t('นักประเมิน');
  const rows=[...(game.collector??[])].sort((a,b)=>b.score-a.score);
  const winners=rows.filter(row=>row.score===rows[0]?.score).map(row=>name(row.playerId));
  return <section className="results"><h2>{final?t('Collector มารับของ · ผู้ได้คะแนนสูงสุด: {names}',{names:winners.join(', ')}):t('ซื้อขายช่วง {n} เสร็จแล้ว',{n:game.encounter})}</h2>
    {final?<><p>{game.players.some(p=>(p.life??0)>0)?t('ถึงช่วง {n} Collector มาแล้ว รับสินค้าและรวมเครดิตของทุกคน ทั้งผู้ที่ยังรอดและผู้ที่ชีวิตหมด คิดคะแนนครั้งเดียวตามมูลค่าจริงและสถานะที่ยังอยู่',{n:game.encounter}):t('ทุกคนชีวิตหมดแล้ว Collector รับสินค้าที่เหลือและรวมเครดิต คิดคะแนนครั้งเดียวตามมูลค่าจริงและสถานะที่ยังอยู่เมื่อผู้เล่นตาย')}</p><div className="table-scroll"><table><caption>{t('คะแนนสุดท้ายจากสินค้า + เครดิต และผลสถานะ')}</caption><thead><tr><th scope="col">{t('ผู้เล่น')}</th><th scope="col">{t('สินค้า')}</th><th scope="col">{t('เครดิต')}</th><th scope="col">{t('รวมก่อนปรับ')}</th><th scope="col">{t('ผลคะแนน')}</th><th scope="col">{t('คะแนนรวม')}</th></tr></thead><tbody>{rows.map(row=><tr key={row.playerId} className={row.score===rows[0]?.score?'leader':''}><th scope="row">{name(row.playerId)}</th><td data-label={t('สินค้า')}>{row.itemValue}</td><td data-label={t('เครดิต')}>{row.credits}</td><td data-label={t('รวมก่อนปรับ')}>{row.credits+row.itemValue}</td><td data-label={t('ผลคะแนน')}>{row.modifierPercent>=0?'+':''}{row.modifierPercent}%</td><td>{row.score}</td></tr>)}</tbody></table></div>
      {rows.map(row=><details key={row.playerId}><summary>{t('ของที่ Collector รับจาก {name} · {n} ชิ้น',{name:name(row.playerId),n:row.items.length})}</summary>{row.items.length?<ul>{row.items.map((item,index)=><li key={item.id}>{item.certified?t('#{n} {name} · มูลค่าจริง {base} × {genuine} × {cursed} × ตราผู้ประเมิน {seal}% = คิด {value} คะแนน',{n:index+1,name:itemName(item.kind),base:item.base,genuine:item.genuine?t('แท้ 100%'):t('ปลอม 25%'),cursed:item.cursed?t('มีคำสาป 75%'):t('ไร้คำสาป 100%'),seal:100+PROVENANCE_PERCENT,value:item.value}):t('#{n} {name} · มูลค่าจริง {base} × {genuine} × {cursed} = คิด {value} คะแนน',{n:index+1,name:itemName(item.kind),base:item.base,genuine:item.genuine?t('แท้ 100%'):t('ปลอม 25%'),cursed:item.cursed?t('มีคำสาป 75%'):t('ไร้คำสาป 100%'),value:item.value})}</li>)}</ul>:<p>{t('ไม่มีสินค้าเหลือ')}</p>}<p>{t('สถานะคะแนน: {status} · (เครดิต {credits} + สินค้า {items}) × {pct}% ปัดลง = {score}',{status:row.statusIds.length?readable(row.statusIds.join(', ')):t('ไม่มี'),credits:row.credits,items:row.itemValue,pct:100+row.modifierPercent,score:row.score})}</p></details>)}
      <div className="actions">{room.hostId===room.yourSeatId?<button className="primary" disabled={disabled} title={tip(disabled&&locked)} onClick={()=>send({type:'rematch'})}>{t('กลับห้องเพื่อเล่นเส้นทางใหม่')}</button>:<p>{t('รอเจ้าของห้องกลับห้องเพื่อเริ่มเส้นทางใหม่')}</p>}<button disabled={disabled} title={tip(disabled&&locked)} onClick={()=>{if(room.matchId)send({type:'audit',matchId:room.matchId});}}>{t('ดาวน์โหลดบันทึกเกม')}</button><button disabled={disabled} title={tip(disabled&&locked)} onClick={()=>send({type:'leave'})}>{t('ออกจากห้อง')}</button></div>
    </>:<><p>{t('ทุกคนที่ยังเล่นเสียชีวิต 1 ตอนจบช่วง คะแนนจะคิดตอน Collector มา ชีวิตหมดแล้วดูเพื่อนต่อได้ ของและเครดิตของผู้ตายยังอยู่')}</p>{game.self.life===0?<p>{t('คุณเป็นผู้ชม ไม่ต้องยืนยันช่วงถัดไป')}</p>:<ReadyForNext room={room} send={send} disabled={disabled}/>}</>}
  </section>;
}
function Results({room,send,disabled}:{room:AppraisalRoomView;send:Send;disabled:boolean}) {
  const locked=useLock();
  const game=room.game!;const final=game.phase==='RESULTS';
  if(game.survival)return <SurvivalResults room={room} send={send} disabled={disabled}/>;
  const results=game.history.filter(h=>h.encounter===game.encounter);
  const scores=[...game.players].sort((a,b)=>b.score-a.score);
  const winners=scores.filter(p=>p.score===scores[0]?.score).map(p=>room.matchSeats.find(s=>s.id===p.id)?.name??t('นักประเมิน'));
  return <section className="results"><h2>{final?t('ผู้ได้คะแนนสูงสุด: {names}',{names:winners.join(', ')}):t('ผลช่วง {n}',{n:game.encounter})}</h2>
    {final?<div className="table-scroll"><table><caption>{t('คะแนนจากทรัพย์สินเพิ่มขึ้นและความแม่นยำ')}</caption><thead><tr><th scope="col">{t('ผู้เล่น')}</th><th scope="col">{t('ทรัพย์สินเพิ่ม')}</th><th scope="col">{t('ประเมินตรง')}</th><th scope="col">{t('คะแนนช่วงนี้')}</th><th scope="col">{t('รวม')}</th></tr></thead><tbody>{scores.map(p=>{const h=results.find(r=>r.playerId===p.id);return <tr key={p.id} className={final && p.score===scores[0]?.score?'leader':''}><th scope="row">{room.matchSeats.find(s=>s.id===p.id)?.name??t('นักประเมิน')}{h?.paused==='dead'?t(' · ตาย'):h?.paused==='exhausted'?t(' · พลังหมด'):''}</th><td data-label={t('ทรัพย์สินเพิ่ม')}>{h?.gain??0}</td><td data-label={t('ประเมินตรง')}>{h?.accuracy??0}</td><td data-label={t('คะแนนช่วงนี้')}>{h?.score??0}</td><td>{p.score}</td></tr>;})}</tbody></table></div>:<details className="results-table"><summary>{t('คะแนนจากทรัพย์สินเพิ่มขึ้นและความแม่นยำ')}</summary><div className="table-scroll"><table><caption>{t('คะแนนจากทรัพย์สินเพิ่มขึ้นและความแม่นยำ')}</caption><thead><tr><th scope="col">{t('ผู้เล่น')}</th><th scope="col">{t('ทรัพย์สินเพิ่ม')}</th><th scope="col">{t('ประเมินตรง')}</th><th scope="col">{t('คะแนนช่วงนี้')}</th><th scope="col">{t('รวม')}</th></tr></thead><tbody>{scores.map(p=>{const h=results.find(r=>r.playerId===p.id);return <tr key={p.id} className={final && p.score===scores[0]?.score?'leader':''}><th scope="row">{room.matchSeats.find(s=>s.id===p.id)?.name??t('นักประเมิน')}{h?.paused==='dead'?t(' · ตาย'):h?.paused==='exhausted'?t(' · พลังหมด'):''}</th><td data-label={t('ทรัพย์สินเพิ่ม')}>{h?.gain??0}</td><td data-label={t('ประเมินตรง')}>{h?.accuracy??0}</td><td data-label={t('คะแนนช่วงนี้')}>{h?.score??0}</td><td>{p.score}</td></tr>;})}</tbody></table></div></details>}
    {final?<><p>{t('เส้นทางจบแล้ว เริ่มใหม่จะสุ่มพ่อค้า เหตุการณ์ สินค้า และ Dark Market ชุดใหม่')}</p><div className="actions">{room.hostId===room.yourSeatId?<button className="primary" disabled={disabled} title={tip(disabled&&locked)} onClick={()=>send({type:'rematch'})}>{t('กลับห้องเพื่อเล่นเส้นทางใหม่')}</button>:<p>{t('รอเจ้าของห้องกลับห้องเพื่อเริ่มเส้นทางใหม่')}</p>}<button disabled={disabled} title={tip(disabled&&locked)} onClick={()=>{if(room.matchId)send({type:'audit',matchId:room.matchId});}}>{t('ดาวน์โหลดบันทึกเกม')}</button><button disabled={disabled} title={tip(disabled&&locked)} onClick={()=>send({type:'leave'})}>{t('ออกจากห้อง')}</button></div></>:<><p>{game.encounter<game.encounterCount!?t('คนที่พักจะกลับมาเล่นในช่วงถัดไป'):t('จะรวมคะแนนเมื่อจบผลช่วงนี้')}</p><ReadyForNext room={room} send={send} disabled={disabled}/></>}
  </section>;
}
type Drawer='bag'|'effects'|'market'|'ledger'|'rules'|'theft'|'collector';
export function GameTable({room,submit,send,disabled,tools,connected=true,connectionMessage,initialDrawer,initialSettings}:{room:AppraisalRoomView;submit:(action:Decision)=>void;send:Send;disabled:boolean;tools?:ReactElement;connected?:boolean;connectionMessage?:string;initialDrawer?:Drawer|undefined;initialSettings?:boolean}) {
  useLang();
  const game=room.game!;const self=game.self;
  const playerNames=Object.fromEntries(room.matchSeats.map(seat=>[seat.id,seat.name]));
  const ghostServerOffset=useMemo(()=>Date.now()-room.serverTime,[room.serverTime]);
  const [ghostOpen,setGhostOpen]=useState(false),[watching,setWatching]=useState(false);
  const spirit=game.phase!=='RESULTS'&&!!game.survival&&((self.life===0&&!watching)||ghostOpen);
  const [selected,setSelected]=useState('');
  const [deskPage,setDeskPage]=useState<DeskPage>('assessment');
  const [coinTossing,setCoinTossing]=useState(false);
  const portalReaction=usePortalReaction(game);
  const portalSelf=portalReaction?.self??self;
  const item=self.stock.find(i=>i.id===selected)??self.stock[0];
  useEffect(()=>setDeskPage('assessment'),[item?.id,game.encounter,game.phase]);
  const stockIndex=self.stock.findIndex(entry=>entry.id===item?.id);
  const stockStrip=useRef<HTMLDivElement>(null);
  useEffect(()=>{if(selected===item?.id)stockStrip.current?.querySelector('[aria-pressed="true"]')?.scrollIntoView({block:'nearest',inline:'nearest'});},[item?.id,selected]);
  const duelling=!!game.theft?.duels.some(duel=>duel.status==='open');
  const inactive=disabled || game.phase==='RESULTS' || !!self.paused || self.done || duelling || !!portalReaction;
  const outer=useLock();
  const lock=outer ?? (duelling?pick('เลือกมือเป่ายิ้งฉุบให้เสร็จก่อน','Finish the rock, paper, scissors duel first'):game.survival && self.life===0?t('ชีวิตหมดแล้ว คุณเป็นผู้ชม'):self.paused==='dead'?t('คุณตายและพักช่วงนี้'):self.paused?t('พลังหมด พักช่วงนี้'):self.done?t('คุณจบช่วงนี้แล้ว รอเพื่อนหรือหมดเวลา'):coinTossing?t('กำลังโยนเหรียญ รอผล'):disabled?t('รอการเชื่อมต่อหรือผลจากเซิร์ฟเวอร์'):null);
  const playable=['PORTALS','APPRAISAL','TRADE'].includes(game.phase);
  const npc=self.portals.find(p=>p.id===self.selectedPortalId)?.npc;
  const consequence=defaultConsequence(self.eventOffer);
  const [toasts,dismiss]=useOutcomes(game);
  const phase=game.phase;const reveal=phase==='REVEAL' || phase==='RESULTS';
  useEffect(()=>{window.scrollTo(0,0);},[phase,game.encounter]);
  const eventOpen=self.life!==0&&!!self.eventOffer && playable && !portalReaction;
  // A tucked event lets the player study the table; the table only locks while the dialog is actually open.
  const [tuckedKey,setTuckedKey]=useState<string|null>(null);
  const tucked=eventOpen && tuckedKey===self.eventOffer!.key;
  const [openDrawer,setOpenDrawer]=useState<Drawer|null>(initialDrawer??null);
  const theftDeskAvailable=!!game.secureEconomy&&!!game.theft&&(!!game.core2||game.theft.duels.length>0||!!game.theft.crime)&&['APPRAISAL','TRADE'].includes(phase)&&self.life!==0&&self.paused!=='dead';
  const collectorDeskAvailable=!!self.collectorWishlist&&['PORTALS','APPRAISAL'].includes(phase)&&self.life!==0&&!self.paused&&(self.collectorWishlist.request.available||!!self.collectorWishlist.pending||self.collectorWishlist.delivery?.status==='open');
  const orphanedDrawer=openDrawer==='collector'&&(!collectorDeskAvailable||duelling)||openDrawer==='theft'&&(duelling||!theftDeskAvailable)||phase==='RESULTS'&&!self.personalScore&&['bag','effects','market'].includes(openDrawer??'');
  useEffect(()=>{if(orphanedDrawer)setOpenDrawer(null);},[orphanedDrawer]);
  const [settingsOpen,setSettingsOpen]=useState(initialSettings??false);
  const markets=(game.market.open?game.market.orders.length:0)+(game.market.lots?.length??0);
  const drawers:{id:Drawer;label:string;icon:ReactElement;count?:number;hot?:boolean}[]=[
    ...(phase==='RESULTS'&&!self.personalScore?[]:[{id:'bag' as const,label:t('กระเป๋า'),icon:<BagIcon/>,count:self.inventory.length}]),
    ...(phase==='RESULTS'&&!self.personalScore?[]:[{id:'effects' as const,label:t('สถานะ'),icon:<BuffIcon/>,count:self.statuses.length},{id:'market' as const,label:'Dark Market',icon:<MarketIcon/>,count:markets,hot:markets>0}]),
    {id:'ledger',label:game.secureEconomy?t('สมุดบันทึก · เงินกู้และใบประกาศ'):t('สมุดบันทึก'),icon:<BookIcon/>,count:game.loans?.filter(l=>['proposed','countered'].includes(l.status)).length??0},
    {id:'rules',label:t('กติกา'),icon:<EventIcon/>},
  ];
  const drawer=(id:Drawer,title:string,body:ReactElement,action?:ReactElement)=><ComicMenu key={id} id={`drawer-${id}`} open={openDrawer===id} title={id==='bag'?pick('กระเป๋าของคุณ','Your bag'):id==='effects'?pick('สถานะของคุณ','Your status'):title} icon={id==='bag'?<BagIcon/>:id==='effects'?<BuffIcon/>:id==='market'?<MarketIcon/>:id==='rules'?<BookIcon/>:undefined} action={action} onClose={()=>setOpenDrawer(null)}>{body}</ComicMenu>;
  const stockSelector=<section className="stock-shelf" aria-label={t('สินค้าของพ่อค้า')}>
    <h2 className="sr-only">{t('สินค้าของพ่อค้า')} {self.stock.length}</h2>
    <div className="stock-carousel">
      <button type="button" className="stock-arrow previous" aria-label={pick('สินค้าก่อนหน้า','Previous item')} disabled={stockIndex<=0} onClick={()=>setSelected(self.stock[stockIndex-1]!.id)}><PassIcon/></button>
      <div ref={stockStrip} className="stock-tabs" role="group" aria-label={t('สินค้าของพ่อค้า')}>
        {self.stock.map(entry=><button key={entry.id} className={entry.id===item?.id?'selected':''} aria-pressed={entry.id===item?.id} aria-label={`${itemName(entry.kind)} · ${t('{n} เครดิต',{n:entry.price})}`} title={`${itemName(entry.kind)} · ${t('{n} เครดิต',{n:entry.price})}`} onClick={()=>setSelected(entry.id)}><ItemVisual item={entry} width={128} height={128}/>{entry.bonus && <BonusBadge passive/>}</button>)}
      </div>
      <button type="button" className="stock-arrow next" aria-label={pick('สินค้าถัดไป','Next item')} disabled={stockIndex<0 || stockIndex>=self.stock.length-1} onClick={()=>setSelected(self.stock[stockIndex+1]!.id)}><PassIcon/></button>
    </div>
  </section>;
  const merchantCard = npc ? <aside className="merchant" aria-label={t('พ่อค้า {name}',{name:npcName(npc)})}><div className="merchant-window comic-merchant-art" data-npc={npc}><span className="comic-screen-lines" aria-hidden="true"/><img className="merchant-figure" src={npcImage(npc,appraisalMood(item?.appraisalAccepted))} width="640" height="960" alt=""/></div><div className="merchant-copy"><h2>{npcName(npc)}</h2><div className="merchant-trust"><HandshakeIcon/><span>{pick('ไว้ใจ','Trust')} {self.npcTrust?.[npc]??0}/10</span><meter min={0} max={10} value={self.npcTrust?.[npc]??0} aria-label={pick('ความไว้ใจพ่อค้า','Merchant trust')}/></div><p className={self.caught?'danger-text merchant-line':'merchant-line'}>{self.caught?t('พ่อค้าจับผิดคุณแล้ว'):t('“เลือกของที่ต้องการ แล้วบอกข้าวว่ามันมีราคาเท่าไร”')}</p></div><nav className="merchant-page-nav" aria-label={pick('ข้อมูลบนโต๊ะ','Desk information')}><button type="button" aria-pressed={deskPage==='offers'} aria-controls="appraisal-reading-panel" onClick={()=>setDeskPage('offers')}>{pick('ข้อเสนอและข้อมูลพ่อค้า','Merchant offers and details')}</button><button type="button" disabled={!item} aria-pressed={deskPage==='details'} aria-controls="appraisal-reading-panel" onClick={()=>setDeskPage('details')}>{t('รายละเอียดของชิ้นนี้')}</button></nav></aside> : undefined;
  const hasMerchantOffers=!!self.recoveryOffer || !!(game.wishlist && (self.wishOffer || self.wishDesk)) || !!(game.cleanse && self.cleanseOffer);
  const merchantOffers=<div className="merchant-services-body"><Pager label={pick('ข้อเสนอพ่อค้า','Merchant offers')}>
          {self.recoveryOffer && <section className="recovery-deal"><h3>{self.recoveryOffer.target==='life'?t('ดีลฟื้นชีวิต'):t('ดีลฟื้นพลัง')}</h3><p>{self.recoveryOffer.min!==undefined?t('ฟื้นชีวิตสุ่ม {min}–{max} หน่วย · ช่วงละครั้ง · ไม่ใช้พลัง',{min:self.recoveryOffer.min,max:self.recoveryOffer.amount}):t('ฟื้น{target}สูงสุด {amount} หน่วย · ช่วงละครั้ง · ไม่ใช้พลัง',{target:self.recoveryOffer.target==='life'?t('ชีวิต'):t('พลัง'),amount:self.recoveryOffer.amount})}</p>{(()=>{const offer=self.recoveryOffer!;const label=offer.target==='life'?t('ชีวิต'):t('พลัง');
            const why=inactive?null:self.eventOffer?t('ตอบเหตุการณ์ก่อน จึงแลกได้'):(offer.target==='life'?self.life!>=(self.maxLife??game.survival!.maxLife):self.energy>=(self.maxEnergy??game.maxEnergy??10))?t('{label}เต็มแล้ว ไม่ต้องแลก',{label}):needShort(game,{credits:offer.credits,energy:0});
            return <><button disabled={inactive || !!why} title={tip(inactive&&lock,why)} onClick={()=>submit({type:'recover-resource',target:offer.target,...(offer.quoteId===undefined?{}:{quoteId:offer.quoteId})})}>{t('จ่าย {n} เครดิต',{n:offer.credits})}</button>{why && <p className="why" role="status">{why}</p>}</>;})()}</section>}
          {npc && game.survival && !self.recoveryOffer && !self.recoveryUsed && self.life!==0 && !!self.npcTrust && !ENERGY_DEAL_NPCS.includes(npc) && (self.npcTrust[npc]??0)===0 && <section className="recovery-deal"><h3>{t('ดีลฟื้นชีวิต')}</h3><p className="supporting">{t('{name} ยังไม่ไว้ใจคุณ จึงไม่เปิดดีลฟื้นชีวิต · ขายของที่ประเมินให้เพื่อนเพื่อสร้างความไว้ใจ',{name:npcName(npc)})}</p></section>}{game.wishlist && (self.wishOffer || self.wishDesk) && <WishDeal game={game} submit={submit} disabled={inactive} compact/>}
{game.cleanse && self.cleanseOffer && self.cleanseOffer.items.map(row=><CleanseDeal key={row.itemId} game={game} submit={submit} disabled={inactive} inline itemId={row.itemId}/>)}{!hasMerchantOffers && <p className="notice">{pick('ยังไม่มีข้อเสนอที่ซื้อได้ในการพบครั้งนี้','No purchasable offers during this encounter.')}</p>}</Pager></div>;
  const endPhasePanel=(phase==='APPRAISAL' || phase==='TRADE') && !self.paused && !self.done && <div className="end-phase">{consequence && <p className="danger-text">{consequence}</p>}{phase==='TRADE' && game.roundRewardBase!==undefined && <p>{t('เมื่อทุกคนจบซื้อขาย รับเครดิตเติมช่วงนี้ {n} เครดิต หรือเสี่ยงหัวก้อย ก่อนเลือกประตูครั้งถัดไป',{n:game.roundRewardBase})}</p>}{phase==='TRADE' && unsoldItems(game).length>0 && <p className="danger-text">{t('จบช่วงตอนนี้ ของค้าง {n} ชิ้นจะรับโทษจากพ่อค้า',{n:unsoldItems(game).length})}</p>}{phase==='APPRAISAL' && unsoldItems(game).length>0 && <p className="supporting">{t('ของที่ตีราคาแล้ว {n} ชิ้นยังไม่มีคนซื้อ จัดการได้ในช่วงต่อรอง',{n:unsoldItems(game).length})}</p>}<ComicButton tone="primary" className="pass" disabled={disabled || duelling} title={tip((disabled || duelling)&&lock)} onClick={()=>submit({type:'done'})}><PassIcon/>{phase==='APPRAISAL'?(self.collectorWishlist?.request.available||self.collectorWishlist?.delivery?.status==='open'?pick('จบประเมิน · ปิดสิทธิ์ Collector','Finish appraisal · Close Collector'):pick('จบการประเมิน','Finish appraisal')):game.roundRewardBase!==undefined?t('จบซื้อขาย ไปรับเครดิต'):t('จบการต่อรอง คิดผลช่วง')}</ComicButton></div>;
  return <SeatNames.Provider value={playerNames}><LockReason reason={lock}>
    <div className={`screen phase-${portalReaction?'PORTALS':phase}`} data-merchant-reaction={portalReaction?'entry':undefined}>
    <header className="hud phase-header"><div className="hud-bar">{theftDeskAvailable||collectorDeskAvailable?<div className="phase-heading"><h1 className="cabinet-brand">{phase==='PORTALS'?pick('เลือกพ่อค้าที่จะพบ','Choose a merchant'):phaseLabel(phase)}</h1>{theftDeskAvailable&&<ComicTooltip content={pick('เลือกเป้าหมายขโมย หรือดูผลดวล · เปิดดูยังไม่ใช้พลัง','Choose a theft target or review duels. Opening costs no energy.')}><ComicButton className="theft-desk-launch" aria-label={pick('ขโมยและผลดวล','Theft and duel history')} aria-expanded={openDrawer==='theft'} aria-controls="theft-desk" disabled={duelling} onClick={()=>{setOpenDrawer(openDrawer==='theft'?null:'theft');setSettingsOpen(false);}}><HandshakeIcon/></ComicButton></ComicTooltip>}{collectorDeskAvailable&&<ComicTooltip content={pick('Collector · ขอสินค้า รับชุด หรือดูสถานะ · เปิดดูไม่ใช้สิทธิ์','Collector requests, delivery or waiting status. Opening spends nothing.')}><ComicButton className="theft-desk-launch" aria-label={pick('เปิด Collector','Open Collector')} aria-expanded={openDrawer==='collector'} aria-controls="collector-wishlist" onClick={()=>{setOpenDrawer(openDrawer==='collector'?null:'collector');setSettingsOpen(false);}}><BookIcon/></ComicButton></ComicTooltip>}</div>:<h1 className="cabinet-brand">{phase==='PORTALS'?pick('เลือกพ่อค้าที่จะพบ','Choose a merchant'):phaseLabel(phase)}</h1>}<dl className="resources"><div className="resource credit" title={t('เครดิต')}><dt><CoinIcon/>{t('เครดิต')}</dt><dd>{self.credits}</dd></div><div className={`resource energy${self.energy===0?' empty':''}`} title={t('พลัง')}><dt><EnergyIcon/>{t('พลัง')}</dt><dd>{self.energy}<small> / {self.maxEnergy??game.maxEnergy??10}</small></dd></div>{self.life!==undefined && <div className={`resource life${self.life<=2?' low':''}`} title={t('ชีวิต')}><dt><LifeIcon/>{t('ชีวิต')}</dt><dd>{self.life}<small> / {self.maxLife??game.survival?.maxLife}</small></dd></div>}</dl><Countdown room={room}/><Roster room={room}/><nav className="hud-drawers" aria-label={t('สมุดและกระเป๋า')}>{drawers.map(d=><button key={d.id} type="button" className={`hud-drawer${d.hot?' hot':''}${openDrawer===d.id?' active':''}`} aria-expanded={openDrawer===d.id} aria-haspopup="dialog" aria-controls={`drawer-${d.id}`} aria-label={d.label} title={d.label} data-drawer={d.id} onClick={()=>{setSettingsOpen(false);setOpenDrawer(current=>current===d.id?null:d.id);}}>{d.icon}<span className="hud-drawer-label">{d.id==='market'?pick('ตลาดมืด','Market'):d.id==='ledger'?pick('บันทึก','Ledger'):d.label.split(' · ')[0]}</span>{d.count?<span className="hud-count">{d.count}</span>:null}</button>)}<button type="button" className={`hud-settings${settingsOpen?' active':''}`} aria-label={pick('ตั้งค่า','Settings')} aria-haspopup="dialog" aria-controls="game-settings" aria-expanded={settingsOpen} onClick={()=>{setOpenDrawer(null);setSettingsOpen(current=>!current);}}><SettingsIcon/>{pick('ตั้งค่า','Settings')}</button></nav></div></header><ComicMenu id="game-settings" open={settingsOpen} title={pick('ตั้งค่า','Settings')} icon={<SettingsIcon/>} onClose={()=>setSettingsOpen(false)} className="settings-dialog"><div className="settings-spread"><section className="settings-panel settings-preferences"><h3>{pick('การตั้งค่าของคุณ','Your settings')}</h3><div className="settings-controls">{tools}</div></section><section className="settings-panel settings-table"><header className="settings-section-head"><h3>{pick('ผู้ร่วมโต๊ะ','Players at the table')}</h3><span>{game.players.length} / 4</span></header><Roster room={room} detailed/><p className={`settings-connection${connected?' online':' offline'}`} role="status"><i aria-hidden="true"/>{connectionMessage??t('เชื่อมต่อแล้ว')}</p></section></div></ComicMenu>
    <div className="phase-banner">{game.brokerage && playable && !self.paused && self.life!==0 && ['APPRAISAL','TRADE'].includes(game.phase) && <div className="hud-extras"><Fortune game={game}/></div>}{game.omen && playable && (()=>{const omen=omenText(game.omen);return <details className="omen" role="note"><summary><strong>{t('ลางของช่วงนี้ · {name}',{name:omen.name})}</strong></summary>{omen.text}</details>;})()}</div>
    
    <p className="sr-only" role="status" key={`${game.encounter}-${game.phase}`}>{phaseLabel(game.phase)} {t('ช่วง {n}',{n:game.encounter})}{game.encounterCount!==null?t(' จาก {n}',{n:game.encounterCount}):t(' เล่นจนทุกคนชีวิตหมด')}. {phaseHint(game.phase)}</p>
    {self.paused && playable && !game.survival && <div className="notice" role="status"><h2>{self.paused==='dead'?t('สัญญาคร่าชีวิตคุณในช่วงนี้'):t('พลังหมดในช่วงนี้')}</h2><p>{self.paused==='dead'?t('คะแนนช่วงนี้เป็น 0 คะแนนที่ได้ก่อนหน้ายังอยู่'):t('คะแนนที่ทำได้ในช่วงนี้ยังอยู่')} {t('พักดูเพื่อนจนจบช่วงนี้ แล้วกลับมาเล่นช่วงถัดไป')}</p></div>}
    {game.survival && self.life===0 && playable && !spirit && <div className="notice" role="status"><h2>{t('ชีวิตหมดแล้ว · คุณเป็นผู้ชม')}</h2><p>{t('ดูเพื่อนจนทุกคนชีวิตหมด Collector จะรับของที่คุณเก็บไว้และคิดคะแนนพร้อมกัน ไม่มีการกลับมาเล่นใน run นี้')}</p></div>}
    {game.survival && self.energy===0 && self.life!>0 && playable && <p className="notice" role="status">{t('พลัง 0 ยังเล่นต่อได้ เลือกประตูและรับดีลฟื้นพลังได้ การกระทำที่ใช้พลังต้องมีพอ')}</p>}
    {self.done && playable && !self.paused && <p className="notice" role="status">{room.timerSettings?.enabled===false?t('คุณจบช่วงนี้แล้ว รอเพื่อนจบช่วงเพื่อไปต่อ'):t('คุณจบช่วงนี้แล้ว รอเพื่อนหรือหมดเวลาเพื่อไปต่อ')}</p>}
    <div className="table-stage" inert={eventOpen && !tucked || openDrawer!==null || settingsOpen}>
      <div className={`scene-play${reveal?' single':''}`}>
      {spirit&&<GhostWorld serverOffset={ghostServerOffset} game={game} submit={submit} disabled={disabled} names={playerNames} onClose={()=>{setGhostOpen(false);setWatching(true);}}/>}
      {!spirit&&!duelling&&<>
      {(game.phase==='PORTALS' || portalReaction) && !self.paused && <section className="portals"><h2>{t('เชิญใครมาที่โต๊ะของคุณ')}</h2><p>{pick('พบได้หนึ่งรายต่อช่วง แต่ละรายมีสินค้าต่างกัน','Meet one merchant each encounter. Each offers different goods.')}</p>{self.eventOffer && <p className="blocked-note">{t('ตอบเหตุการณ์ก่อน จึงเปิดประตูได้')}</p>}<div className="portal-row">{portalSelf.portals.map(p=><article key={p.id} className={`portal ${p.disabled?'closed':''}`}><div className="gate comic-gate" data-npc={p.npc}><div className="gate-window"><span className="comic-screen-lines" aria-hidden="true"/><img className="gate-figure" src={npcImage(p.npc,portalMood(portalSelf.selectedPortalId,p.id))} width="640" height="960" alt={npcName(p.npc)}/></div></div><div className="portal-details"><h3>{npcName(p.npc)}</h3><div className="plaque-chips"><span className="plaque-chip goods"><img src={itemImage(p.hint)} width="88" height="88" alt=""/><span className="portal-goods-copy"><span className="portal-goods-title"><ItemTerm kind={p.hint}/></span><span className="portal-goods-note">{pick('ของที่นำมาเสนอ','Merchant offering')}</span></span></span>{self.npcTrust && <span className="plaque-chip trust" title={t('ความไว้ใจ {n}/10 · ช่วยต่อรอง +{chance} จุดเปอร์เซ็นต์',{n:self.npcTrust[p.npc]??0,chance:npcAcceptanceChance(game,p.npc)})}><span className="portal-trust-value"><HandshakeIcon/><span>{pick('ไว้ใจ','Trust')} <strong>{self.npcTrust[p.npc]??0}/10</strong></span></span><meter min={0} max={10} value={self.npcTrust[p.npc]??0} aria-label={pick('ความไว้ใจพ่อค้า','Merchant trust')}/></span>}{self.wishes?.[p.npc] && <span className="plaque-chip wish" title={`${t('ตามหา {name}',{name:itemName(self.wishes[p.npc]!.kind)})} · ${game.wishContract?t('ราคาเริ่ม {n} เครดิต ลดลงทุกช่วง ไม่ต่ำกว่า {floor}',{n:self.wishes[p.npc]!.price,floor:ITEM_SPECS[self.wishes[p.npc]!.kind].anchor}):t('รับซื้อ {n} เครดิต',{n:self.wishes[p.npc]!.price})}`}><CoinIcon/>{t('ตามหา {name}',{name:itemName(self.wishes[p.npc]!.kind)})}</span>}</div><button className="primary" aria-label={`${p.disabled?t('ประตูปิด'):pick('พบพ่อค้า','Meet merchant')} · ${npcName(p.npc)}`} disabled={inactive || p.disabled || !!self.eventOffer} title={tip(inactive&&lock,p.disabled&&t('ประตูนี้ปิดอยู่ เลือกพ่อค้ารายอื่น'),!!self.eventOffer&&t('ตอบเหตุการณ์ก่อน จึงเปิดประตูได้'))} onClick={()=>submit({type:'enter',portalId:p.id})}><HandshakeIcon/>{p.disabled?t('ประตูปิด'):pick('พบพ่อค้า','Meet merchant')}</button>{game.core2 && !p.disabled && <button type="button" className="reroll-portal" disabled={inactive || !!self.eventOffer || self.energy<(self.portalRerollCost??rerollCost(self.portalRerolls??0))} title={tip(inactive&&lock,!!self.eventOffer&&t('ตอบเหตุการณ์ก่อน จึงรีประตูได้'),self.energy<(self.portalRerollCost??rerollCost(self.portalRerolls??0))&&t('พลังไม่พอรีประตู'))||t('เปลี่ยนเป็นพ่อค้ารายใหม่พร้อมของใหม่ · รีครั้งต่อไปในช่วงนี้แพงขึ้น 1 พลัง')} onClick={()=>submit({type:'reroll-portal',portalId:p.id})}><LightningIcon/>{pick('เปลี่ยนรายนี้','Replace merchant')} · {(self.portalRerollCost??rerollCost(self.portalRerolls??0))} {pick('พลัง','energy')}</button>}</div></article>)}</div></section>}
      {game.phase==='APPRAISAL' && !self.paused && !portalReaction && <div className={`appraisal-stage${npc?'':' no-merchant'}`}>
        {!npc && <><WishDeal game={game} submit={submit} disabled={inactive}/><CleanseDeal game={game} submit={submit} disabled={inactive}/></>}
        {!item?<div className="empty-shop">{merchantCard}<div id="appraisal-reading-panel" className="appraisal-controls information-page">{deskPage==='offers'?merchantOffers:<p className="notice">{t('ไม่มีของเหลือในร้าน เก็บของ เปิดใช้ หรือจบช่วงประเมินเพื่อไปต่อรองกับเพื่อน')}</p>}</div></div>:<AppraisalDesk key={item.id} game={game} item={item} submit={submit} disabled={inactive} merchant={merchantCard} stockSelector={stockSelector} page={deskPage} onPageChange={setDeskPage} offers={merchantOffers}/>}
      </div>}
      {phase==='TRADE' && !self.paused && <Unsold game={game} submit={submit} disabled={inactive}/>}
      {phase==='TRADE' && <TradeScreen game={game} room={room} submit={submit} disabled={inactive} completion={endPhasePanel} utilityOpen={openDrawer!==null||settingsOpen}/>}
      
      {phase==='REVEAL' && self.roundReward && <RoundReward hideSettled key={game.encounter} reward={self.roundReward} credits={self.credits} submit={submit} disabled={disabled || room.revealReady.includes(room.yourSeatId)} onTossing={setCoinTossing}/>}
      {phase==='REVEAL' && self.roundReward?.settled && !coinTossing && <PostRewardScreen game={game} submit={submit} disabled={disabled || room.revealReady.includes(room.yourSeatId)} completion={<ReadyForNext room={room} send={send} disabled={disabled}/>}/>}
      {reveal && (phase==='RESULTS' || !self.roundReward) && !coinTossing && <Results room={room} send={send} disabled={disabled || coinTossing}/>}
      </>}
      </div>
    </div>
    <TheftPanel game={game} submit={submit} disabled={disabled || self.life===0} playerNames={playerNames} deadlines={room.duelDeadlines} serverTime={room.serverTime} deskOpen={openDrawer==='theft'} onDeskClose={()=>setOpenDrawer(null)} suspended={openDrawer!==null&&openDrawer!=='theft'||settingsOpen||eventOpen&&!tucked}/>
    <ComicMenu id="collector-wishlist" open={openDrawer==='collector'&&collectorDeskAvailable} title="Collector" onClose={()=>setOpenDrawer(null)} className="collector-menu"><CollectorWishlist key={`${game.encounter}:${self.collectorWishlist?.pending?.id??''}:${self.collectorWishlist?.delivery?.id??''}:${self.collectorWishlist?.delivery?.status??''}`} game={game} submit={submit} disabled={inactive}/></ComicMenu>
    {(phase!=='RESULTS'||!!self.personalScore) && drawer('bag',t('กระเป๋า'),<><Inventory game={game} submit={submit} disabled={inactive || phase==='REVEAL'}/><HeldEffects game={game}/></>)}
    {(phase!=='RESULTS'||!!self.personalScore) && drawer('effects',t('สถานะ'),<>{openDrawer==='effects'&&<StatusMenu game={game} submit={submit} disabled={inactive || phase==='REVEAL'} playerNames={playerNames}/>}</>,<>{phase==='APPRAISAL'&&endPhasePanel&&<div className="status-header-completion">{endPhasePanel}</div>}{game.survival&&phase!=='RESULTS'&&!spirit&&(self.life===0||game.ghosts?.services.some(s=>s.available)||!!game.ghosts?.jobs.some(j=>j.status==='accepted'||j.status==='offered'))&&<ComicButton onClick={()=>{setOpenDrawer(null);setGhostOpen(true);setWatching(false);}}>{pick('โลกวิญญาณ','Spirit world')}</ComicButton>}</>)}
    {(phase!=='RESULTS'||!!self.personalScore) && drawer('market',pick('ตลาดมืด','Dark Market'),<DarkMarket game={game} submit={submit} disabled={inactive || !playable}/>)}
    {drawer('ledger',t('สมุดบันทึก'),<LedgerMenu game={game} room={room} submit={submit} disabled={disabled || phase==='RESULTS' || duelling || self.life===0 || room.revealReady.includes(room.yourSeatId)} playerNames={playerNames}/>)}
    {drawer('rules',t('กติกา'),<RulesMenu timers={room.timerSettings} survival={room.mode==='survival'} trustAbilities={!!game.trustAbilities}/>)}
    </div>
    {eventOpen && <EventModal key={self.eventOffer!.key} game={game} offer={self.eventOffer!} submit={submit} disabled={inactive} tucked={tucked || openDrawer!==null || settingsOpen} setTucked={value=>setTuckedKey(value?self.eventOffer!.key:null)} playerNames={playerNames}/>}
    <Toasts toasts={toasts} dismiss={dismiss} survival={!!game.survival} playerNames={playerNames}/>
  </LockReason></SeatNames.Provider>;
}
export function useSound(room:AppraisalRoomView|null) {
  const [enabled,setEnabled]=useState(false);const context=useRef<AudioContext|null>(null);
  const previous=useRef<string|null>(null);
  const toggle=()=>{if(!enabled){try {context.current??=new AudioContext();void context.current.resume();setEnabled(true);}catch {setEnabled(false);}}else setEnabled(false);};
  useEffect(()=>{
    const game=room?.game;const key=game?`${room.matchId}:${game.encounter}:${game.phase}:${game.self.credits}`:null;
    if(enabled && previous.current && previous.current!==key && context.current?.state==='running') {
      const ctx=context.current;const oscillator=ctx.createOscillator();const gain=ctx.createGain();
      oscillator.frequency.value=game?.phase==='REVEAL'?330:440;gain.gain.setValueAtTime(.035,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.12);oscillator.connect(gain);gain.connect(ctx.destination);oscillator.start();oscillator.stop(ctx.currentTime+.13);
    }
    previous.current=key;
  },[room,enabled]);
  useEffect(()=>()=>{void context.current?.close();},[]);
  return {enabled,toggle};
}
/** The server only lets a seat leave in the lobby or at the results, so mid-match this drops the saved seat and returns to the start screen. */
function LeaveMatchButton({label=t('ออกจากห้อง'),className=''}:{label?:string;className?:string}={}) {
  const leave=()=>{
    if(!window.confirm(t('ออกจากห้องตอนนี้? ที่นั่งนี้จะหลุดจากแมตช์และกลับเข้ามาเล่นต่อไม่ได้')))return;
    try {sessionStorage.removeItem('cursed-market-appraisal-seat');} catch { /* Nothing saved to clear. */ }
    location.reload();
  };
  return <button type="button" className={`leave-match ${className}`} onClick={leave}>{label}</button>;
}
export function SettingsControls({sound,canLeave=true}:{sound:ReturnType<typeof useSound>;canLeave?:boolean}) {
  const lang=useLang();
  return <>
    <div className="settings-row"><SoundIcon on={sound.enabled}/><div className="settings-row-copy"><h4>{pick('เสียงเกม','Game sound')}</h4><p>{pick('เสียงแจ้งเตือนและการเปลี่ยนช่วง','Notifications and phase changes')}</p></div><ComicButton className="settings-sound-switch" role="switch" aria-checked={sound.enabled} aria-label={pick('เสียงเกม','Game sound')} onClick={sound.toggle}><span className="settings-switch-track" aria-hidden="true"><span/></span><span>{sound.enabled?pick('เปิด','On'):pick('ปิด','Off')}</span></ComicButton></div>
    <div className="settings-row"><LanguageIcon/><div className="settings-row-copy"><h4>{pick('ภาษา','Language')}</h4><p>{pick('เลือกภาษาที่ใช้แสดง','Choose the display language')}</p></div><div className="settings-language" role="group" aria-label={pick('ภาษา','Language')}><ComicButton aria-pressed={lang==='th'} onClick={()=>setLang('th')}>ไทย</ComicButton><ComicButton aria-pressed={lang==='en'} onClick={()=>setLang('en')}>English</ComicButton></div></div>
    <div className="settings-row"><ExitIcon/><div className="settings-row-copy"><h4>{pick('ออกจากเกม','Leave game')}</h4><p>{canLeave?pick('ออกแล้วจะกลับเข้าแมตช์นี้ไม่ได้','You cannot rejoin this match after leaving'):pick('การเดินทางจบแล้ว','This journey has ended')}</p></div>{canLeave&&<LeaveMatchButton className="comic-button" label={pick('ออกจากเกม','Leave game')}/>}</div>
  </>;
}
export function App() {
  const connection=useConnection();const sound=useSound(connection.room);
  useLang(); // subscribe the whole table so every label re-renders on a language switch
  const game=connection.room?.game;
  const offline=connection.connection!=='online';const disabled=offline || connection.busy;
  const netLock=offline?(connection.connection==='replaced'?t('ที่นั่งนี้เปิดในแท็บอื่น'):t('ยังไม่ได้เชื่อมต่อ รอกลับมาออนไลน์')):connection.busy?t('กำลังส่งการตัดสินใจ รอผลจากพ่อค้า'):null;
  const networkMessage=connection.connection==='replaced'?t('แท็บอื่นรับช่วงที่นั่งนี้แล้ว โหลดแท็บนี้ใหม่เพื่อกลับมาเล่นที่นี่'):offline?t('กำลังเชื่อมต่อกลับห้อง'):null;
  const reconnect=connection.connection==='replaced'?()=>location.reload():null;
  return <DialogFeedback.Provider value={{busy:connection.busy,error:connection.error,clearError:connection.clearError,networkMessage,reconnect}}><a className="skip-link" href="#game-main">{t('ข้ามไปพื้นที่เล่น')}</a><div className="app-shell cabinet-shell comic-build">{!game && <header className="masthead"><span className="brand">Cursed Market</span><div><span role="status" className={`connection ${connection.connection}`}><span className="connection-label">{connection.connection==='online'?t('เชื่อมต่อแล้ว'):connection.connection==='replaced'?t('ที่นั่งนี้เปิดในแท็บอื่น'):t('กำลังเชื่อมต่อกลับห้อง')}</span></span><LangToggle/>{connection.room?.game && connection.room.game.phase!=='RESULTS' && <LeaveMatchButton/>}<button className="sound-toggle" aria-pressed={sound.enabled} onClick={sound.toggle}><SoundIcon on={sound.enabled}/><span className="sound-label">{sound.enabled?t('ปิดเสียง'):t('เปิดเสียง')}</span></button></div></header>}
    <div className="connection-feedback">
    {networkMessage && <div className="network-status" role="status"><p>{networkMessage}</p>{reconnect && <button onClick={reconnect}>{t('กลับมาเล่นในแท็บนี้')}</button>}</div>}
    {connection.error && <div className="error" role="alert"><p>{connection.error}</p><button onClick={connection.clearError}>{t('ปิดข้อความ')}</button></div>}
    {connection.busy && <p className="network-status" role="status">{t('กำลังส่งการตัดสินใจ รอผลจากพ่อค้า')}</p>}
    </div>
    <LockReason reason={netLock}><main id="game-main">{!connection.room?<Entry send={connection.send} disabled={offline}/>:!connection.room.game?<Lobby room={connection.room} send={connection.send} disabled={offline}/>:<GameTable key={connection.room.matchId} room={connection.room} submit={connection.submit} send={connection.send} disabled={disabled} connected={!offline} connectionMessage={networkMessage??t('เชื่อมต่อแล้ว')} tools={<SettingsControls sound={sound} canLeave={game?.phase!=='RESULTS'}/> }/>}</main></LockReason>
    <footer><span>{t('นักประเมินต่างมิติ · ต้นแบบกติกา {v}',{v:connection.room?.rulesVersion??t('พร้อมเริ่ม')})}</span><span>{t('เลือกข้อมูลที่จะเปิด ก่อนยอมรับราคาที่ต้องจ่าย')}</span></footer>
  </div></DialogFeedback.Provider>;
}
