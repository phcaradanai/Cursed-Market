import { HeldEffects } from './HeldEffects.js';
import { NpcContracts } from './NpcContracts.js';
import { WishlistPanel } from './WishlistPanel.js';
import { playerNote, phaseHint, phaseLabel, readable, unsoldItems, defaultConsequence, needShort, npcAcceptanceChance, collectorEstimate } from './model.js';
import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { ITEM_SPECS, npcImage } from '../game/appraisal/content.js';
import type { AppraisalBotPolicy, AppraisalRoomView, AppraisalClientMessage, AppraisalMode, AppraisalTimerSettings } from '../shared/appraisal-protocol.js';
import { APPRAISAL_BOT_POLICIES, APPRAISAL_TIMER_PHASES } from '../shared/appraisal-protocol.js';
import { useConnection } from './connection.js';
import { RoundReward } from './RoundReward.js';
import { AppraisalDesk, CleanseDeal, WishDeal, DarkMarket, Inventory, Share, Statuses, Trades, Unsold } from './components.js';
import { EventModal, Toasts, useOutcomes } from './feedback.js';
import type { Decision } from './model.js';
import { ChoiceCards, Rich } from './lore.js';
import { CoinIcon, EnergyIcon, LifeIcon, PassIcon, PortalIcon, ScoreIcon, SoundIcon, TimerIcon } from './icons.js';
import { setLang, t, useLang } from './i18n.js';
import { LockReason, tip, useLock } from './reasons.js';
import { itemName, npcName, npcHint, statusName } from './catalog-text.js';

type Send=(message:AppraisalClientMessage)=>boolean;
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
/** The two rule sets side by side, so players can compare them before the host picks one. */
export function ModeGuide({mode}:{mode?:AppraisalMode}) {
  const rows:[string,string,string][]=[
    [t('ความยาว'),t('3 ช่วงพบพ่อค้า แล้วจบการเดินทาง'),t('เล่นต่อจนผู้เล่นทุกคนชีวิตหมด')],
    [t('ชีวิต'),t('ไม่มีชีวิต ตายหรือพลังหมดคือพักช่วงนั้น แล้วกลับมาช่วงถัดไป'),t('เริ่ม 6 ชีวิต เสีย 1 ทุกช่วง หมดแล้วเป็นผู้ชมจนจบ')],
    [t('คะแนน'),t('นับทุกช่วงจากทรัพย์ที่เพิ่มขึ้นและการประเมินที่ตรงมูลค่าจริง'),t('Collector รวมเครดิตกับมูลค่าของที่เก็บไว้ตอนจบ ครั้งเดียว')],
    [t('พลัง'),t('ฟื้นท้ายช่วง ปกติ 2 สูงสุด 10'),t('ไม่ฟื้นฟรี ต้องแลกกับพ่อค้า')],
    [t('เหมาะกับ'),t('รอบสั้น เรียนรู้เกม'),t('รอบยาว เสี่ยงสูง วางแผนทรัพยากร')],
  ];
  return <div className="mode-guide table-scroll"><table><caption>{t('เปรียบเทียบกติกาสองโหมด')}</caption><thead><tr><th scope="col"><span className="sr-only">{t('หัวข้อ')}</span></th><th scope="col" className={mode==='classic'?'current':''}>{t('โหมดปกติ')}</th><th scope="col" className={mode==='survival'?'current':''}>{t('โหมดเอาชีวิตรอด')}</th></tr></thead>
    <tbody>{rows.map(([label,classic,survival])=><tr key={label}><th scope="row">{label}</th><td className={mode==='classic'?'current':''}>{classic}</td><td className={mode==='survival'?'current':''}>{survival}</td></tr>)}</tbody></table></div>;
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
  return <div className="bot-controls"><ChoiceCards compact legend={t('เพิ่มบอทเข้าโต๊ะ · เล่นคนเดียวได้')} value={policy} onChange={v=>setPolicy(v as AppraisalBotPolicy)} disabled={disabled || full}
      options={APPRAISAL_BOT_POLICIES.map(p=>({value:p,title:t(BOT_STYLE[p][0]),detail:t(BOT_STYLE[p][1])}))}/>
    <div className="actions"><button disabled={disabled || full} title={tip(disabled&&locked,full&&t('โต๊ะเต็ม 4 ที่นั่งแล้ว'))} onClick={()=>send({type:'add-bot',policy})}>{t('เพิ่มบอท: {style}',{style:botStyleName(policy)})}</button></div>
    <p className="supporting">{full?t('โต๊ะเต็ม 4 ที่นั่งแล้ว'):t('บอทเล่นด้วยข้อมูลเท่าที่ผู้เล่นเห็น ไม่รู้คำตอบลับ และพร้อมเสมอ')}</p></div>;
}
/** Host picks the mode in the lobby; everyone else sees which one is chosen. */
function ModePicker({room,send,disabled}:{room:AppraisalRoomView;send:Send;disabled:boolean}) {
  const host=room.hostId===room.yourSeatId;
  return <div className="mode-picker">
    {host?<ChoiceCards legend={t('เลือกโหมดเกม')} value={room.mode} onChange={v=>send({type:'rules-mode',mode:v as AppraisalMode})} disabled={disabled} options={[
      {value:'classic',title:t('โหมดปกติ'),detail:t('3 ช่วง ไม่มีชีวิต เหมาะกับรอบสั้น')},
      {value:'survival',title:t('โหมดเอาชีวิตรอด'),detail:t('มีชีวิต เล่นจนทุกคนหมด Collector นับคะแนนตอนจบ')}]}/>
    :<p><strong>{t('โหมดที่เจ้าของห้องเลือก:')}</strong> {room.mode==='survival'?t('โหมดเอาชีวิตรอด'):t('โหมดปกติ')}</p>}
    {host && <p className="supporting">{t('เปลี่ยนโหมดแล้วทุกคนต้องกดพร้อมใหม่')}</p>}
    <ModeGuide mode={room.mode}/>
  </div>;
}
function Rules({timers,survival}:{timers?:AppraisalTimerSettings|undefined;survival?:boolean|undefined}={}) {
  const phaseLabels=(phase:string)=>phaseLabel(phase as never);
  return <details className="rules"><summary>{t('กติกาก่อนเริ่ม · อ่านใน 2 นาที')}</summary><div>
    <p>{t('คุณเป็นนักประเมิน 2–4 คน แต่ละคนเลือกประตูพบพ่อค้าของตนเอง ประเมิน ซื้อ เก็บ ใช้ และแลกสินค้า {mode} เส้นทางใหม่มีพ่อค้า เหตุการณ์ และรายการรับซื้อที่เปลี่ยนไป',{mode:survival===true?t('เล่นจนทุกคนชีวิตหมด แล้ว Collector รับของและคิดคะแนน'):survival===false?t('เล่น 3 ช่วงพบพ่อค้าต่อการเดินทาง'):t('ตรวจวงจรชีวิตและการคิดคะแนนของห้องก่อนเริ่ม')})}</p>
    <ol><li><strong>{t('เลือกประตู:')}</strong> {t('ดูรายการ Dark Market ก่อนเลือกพ่อค้า จัดการเหตุการณ์ที่เสนอให้ก่อนเข้าประตู')}</li><li><strong>{t('ประเมินและซื้อ:')}</strong> {t('ตรวจเริ่มต้น 2 ครั้งต่อช่วง ของสะสมอาจเพิ่มสิทธิ์หรือให้ตรวจฟรี ตรวจได้สามอย่าง คือราคา ความแท้ และคำสาป รู้ความแท้ไม่ได้แปลว่าไร้คำสาป เปิดใช้ของแท้ได้ผลดี ของปลอมมีโอกาส 40% ที่ผลดียังออกฤทธิ์ ของมีคำสาปรับผลเสีย ราคาที่คุณประเมินต้องรอ NPC ยอมรับจึงเป็นราคาซื้อ กดราคาต่ำเพิ่มความเสี่ยงถูกจับผิดและเสียทรัพย์ Dark One มีสัญญาที่ถึงชีวิตได้')}</li><li><strong>{t('ต่อรอง:')}</strong> {t('เปิดของหรือสินค้าร้านที่คุณประเมินให้คนอื่นชมและยื่นข้อเสนอ ผู้ขายตอบรับก่อนโอน เสนอราคากับผู้เล่นไม่มีบทลงโทษจาก NPC')}</li><li><strong>{t('คิดผล:')}</strong> {survival===true?t('Collector รวมเครดิตกับมูลค่าของที่เหลือ แล้วปรับด้วย buff/debuff คะแนน ผู้ตายยังได้คะแนนจากทรัพย์ที่เก็บไว้ ไม่มีโบนัสประเมินหรือคะแนนสะสมรายช่วง'):survival===false?t('คะแนนจากทรัพย์สินที่เพิ่มขึ้นและประเมินตรงมูลค่าจริงในช่วง ±10% ได้ 5 คะแนนต่อชิ้น'):t('ดูสูตรคะแนนในกติกาของห้อง')} {t('ของปลอมและของต้องสาปมีมูลค่าคะแนนลดลง')}</li></ol>
    <p>{t('Dark Market สุ่มเปิดก่อนพบพ่อค้า รับซื้อจนจบช่วงนั้น สิทธิ์แยกต่อรายการและผู้เล่น ซื้อของใหม่มาขายได้ ขายแล้วอาจเสียดายเมื่อรอบหน้ารับซื้อแพงกว่า')}</p>
    {survival===true?<><p>{t('พลังไม่ใช่ชีวิต เริ่มช่วงใหม่ใช้พลัง 1 เท่าที่มี พลัง 0 ยังเลือกประตูและรับดีลฟื้นได้ แต่การกระทำที่ใช้พลังต้องมีพอ ไม่มีฟื้นฟรีท้ายช่วง')}</p><p>{t('เริ่มชีวิต 6 สูงสุด 6 ท้ายทุกช่วงเสียชีวิต 1 ของแท้ประเภทอาหารหรือยาฟื้นชีวิต 2 เมื่อเปิดใช้ ของมีคำสาปเปิดใช้เสียชีวิต 1 ดีลพ่อค้าฟื้นชีวิตหรือพลังได้หนึ่งครั้งต่อช่วง ชีวิต 0 เป็นผู้ชมจนทุกคนตาย ไม่กลับในช่วงถัดไป')}</p><p>{t('Vampire, Autometa และ Alien รับ 2 เครดิตเพื่อฟื้นพลัง 3; Orc, Beast และ Dark One รับ 4 เครดิตเพื่อฟื้นชีวิต 2 สัญญาโลหิตฟรีเสียชีวิต 1 และรับความกระหายโลหิต')}</p><p>{t('Collector ใช้มูลค่าจริง ของปลอมเหลือ 25% คำสาปลดอีก 25% ปัดลงต่อชิ้น {b10}ที่ยังอยู่เพิ่มคะแนนรวม 20% ความกระหายโลหิตที่ยังอยู่ลด 20% รวมเปอร์เซ็นต์แล้วปัดลงครั้งเดียว สถานะและทรัพย์ของผู้ตายเก็บไว้จน Collector มา',{b10:statusName('B10')})}</p></>:survival===false?<p>{t('พลังหมดหรือตายพักเฉพาะช่วงนั้นแล้วกลับช่วงหน้า ตายได้คะแนนช่วงนั้น 0 คะแนนเดิมยังอยู่ พลังหมดคงคะแนนที่ทำได้ เมื่อกลับจากพักฟื้นอย่างน้อย 4 พลัง ปกติฟื้น 2 สูงสุด 10')}</p>:null}
    <p><strong>{t('เครดิตหลังซื้อขายทุกช่วง:')}</strong> {t('ช่วงคี่รับ 10 ช่วงคู่รับ 15 เครดิต ก่อนเลือกประตูครั้งถัดไป เลือกรับเลยหรือทายหัวก้อย ทายถูกเริ่มต้นเพิ่มครั้งละ 5 ของสะสมเพิ่มรางวัลหรือโอกาสทายถูกได้ และเล่นต่อได้ ทายผิดเสียรางวัลช่วงนี้ทั้งหมด เงินเดิมในกระเป๋ายังอยู่ เมื่อหมดเวลารับยอดที่เหลืออัตโนมัติ')}</p>
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
  const [name,setName]=useState('');const [code,setCode]=useState('');
  const join=(e:FormEvent)=>{e.preventDefault();send({type:'join',roomCode:code.trim().toUpperCase(),name:name.trim()});};
  return <div className="entry-layout"><section className="entry-copy"><h1>{t('ทุกข้อเสนอ')}<br/>{t('มีราคาที่ต้องจ่าย')}</h1><p>{t('ประเมินของจากต่างมิติ ลองกดราคา เก็บของที่อยากได้ และเสี่ยงกับสัญญาที่พ่อค้าเสนอ')}</p><p>{t('ห้องส่วนตัวสำหรับ 2–4 คน · เพื่อนทุกคนใช้ที่อยู่เกมเดียวกัน')}</p>
    <form onSubmit={join}><label htmlFor="player-name">{t('ชื่อที่ใช้ในเกม')}</label><input id="player-name" value={name} onChange={e=>setName(e.target.value)} minLength={1} maxLength={16} autoComplete="nickname" required disabled={disabled}/>
      <button type="button" className="primary" disabled={disabled || !name.trim()} title={tip(disabled&&locked,!name.trim()&&t('ใส่ชื่อที่ใช้ในเกมก่อน'))} onClick={()=>send({type:'create',name:name.trim()})}>{t('สร้างห้องใหม่')}</button>
      <label htmlFor="room-code-entry">{t('รหัสห้องของเพื่อน')}</label><input id="room-code-entry" className="room-code" value={code} onChange={e=>setCode(e.target.value.toUpperCase())} minLength={6} maxLength={6} pattern="[A-Z2-9]{6}" autoComplete="off" spellCheck={false} disabled={disabled}/><button disabled={disabled || !name.trim() || !/^[A-Z2-9]{6}$/.test(code.trim())} title={tip(disabled&&locked,!name.trim()&&t('ใส่ชื่อที่ใช้ในเกมก่อน'),!/^[A-Z2-9]{6}$/.test(code.trim())&&t('ใส่รหัสห้องของเพื่อน 6 ตัว'))}>{t('เข้าห้อง')}</button>
    </form><details className="rules"><summary>{t('โหมดเกมที่เลือกได้ · เปรียบเทียบ')}</summary><ModeGuide/></details><Rules/>
  </section><figure className="entry-portrait"><img src={npcImage('darkone')} width="768" height="959" alt={t('พ่อค้า Dark One ยื่นวัตถุให้ประเมิน')}/><figcaption>{t('ของที่เห็น อาจมีราคามากกว่าที่คิด')}</figcaption></figure></div>;
}
export function RoomTimers({room,send,disabled}:{room:AppraisalRoomView;send:Send;disabled:boolean}) {
  const locked=useLock();
  const stored=room.timerSettings;const host=room.hostId===room.yourSeatId;
  const key=JSON.stringify(stored);
  const [enabled,setEnabled]=useState(stored?.enabled??true);
  const [seconds,setSeconds]=useState(()=>Object.fromEntries(APPRAISAL_TIMER_PHASES.map(phase=>[phase,String((stored?.durationsMs[phase]??1000)/1000)])));
  useEffect(()=>{if(stored){setEnabled(stored.enabled);setSeconds(Object.fromEntries(APPRAISAL_TIMER_PHASES.map(phase=>[phase,String(stored.durationsMs[phase]/1000)])));}},[key]);
  if(!stored)return <p>{t('ห้องนี้ใช้เวลาเริ่มต้นของเซิร์ฟเวอร์')}</p>;
  if(!host)return <p>{stored.enabled?t('จับเวลา: {times}',{times:APPRAISAL_TIMER_PHASES.map(phase=>`${phaseLabel(phase)} ${stored.durationsMs[phase]/1000} ${t('วินาที')}`).join(' · ')}):t('ไม่จับเวลา · รอทุกคนจบช่วงหรือยืนยันไปต่อ')}</p>;
  const valid=APPRAISAL_TIMER_PHASES.every(phase=>Number.isInteger(Number(seconds[phase])) && Number(seconds[phase])>=1 && Number(seconds[phase])<=900);
  const save=(event:FormEvent)=>{event.preventDefault();if(enabled&&!valid)return;
    const durationsMs=valid?Object.fromEntries(APPRAISAL_TIMER_PHASES.map(phase=>[phase,Number(seconds[phase])*1000])) as AppraisalTimerSettings['durationsMs']:stored.durationsMs;
    send({type:'timer-settings',settings:{enabled,durationsMs}});
  };
  return <form onSubmit={save}><fieldset className="timer-settings"><legend>{t('เวลาในห้อง')}</legend>
    <ChoiceCards compact legend={t('รูปแบบเวลา')} value={enabled?'timed':'untimed'} onChange={v=>setEnabled(v==='timed')} disabled={disabled} options={[{value:'timed',title:t('จับเวลา'),detail:t('หมดเวลาแล้วเกมเดินต่อเอง')},{value:'untimed',title:t('ไม่จับเวลา'),detail:t('รอทุกคนกดจบช่วง')}]}/>
    <div className="timer-fields">{APPRAISAL_TIMER_PHASES.map(phase=><label key={phase} htmlFor={`timer-${phase}`}>{t('{phase} (วินาที)',{phase:phaseLabel(phase)})}<input id={`timer-${phase}`} type="number" min="1" max="900" step="1" value={seconds[phase]} onChange={e=>setSeconds({...seconds,[phase]:e.target.value})} disabled={disabled||!enabled} required/></label>)}</div>
    <p>{enabled?t('ตั้งได้ช่วงละ 1–900 วินาที ทุกคนจบช่วงแล้วไปต่อทันที'):t('ไม่มีการข้ามอัตโนมัติเมื่อรอ คนที่หลุดต้องกลับมาเพื่อจบช่วงหรือยืนยันไปต่อ')}</p>
    <button disabled={disabled || enabled&&!valid} title={tip(disabled&&locked,enabled&&!valid&&t('ใส่เวลาเป็นจำนวนเต็ม 1–900 วินาทีให้ครบทุกช่วง'))}>{t('บันทึกเวลาของห้อง')}</button><p className="supporting">{t('เปลี่ยนเวลาแล้วทุกคนต้องกดพร้อมใหม่')}</p>
  </fieldset></form>;
}
function Lobby({room,send,disabled}:{room:AppraisalRoomView;send:Send;disabled:boolean}) {
  const locked=useLock();
  const self=room.seats.find(s=>s.id===room.yourSeatId);const host=room.hostId===room.yourSeatId;
  const [copied,setCopied]=useState('');const codeRef=useRef<HTMLInputElement>(null);
  const copy=async()=>{try {await navigator.clipboard.writeText(room.code);setCopied(t('คัดลอกรหัสแล้ว'));}catch {codeRef.current?.select();setCopied(t('เลือกรหัสไว้แล้ว กดคัดลอกด้วยตัวเอง'));}};
  const ready=room.seats.length>=2 && room.seats.every(s=>s.ready && s.connected);
  return <section className="lobby"><h1>{t('โต๊ะนักประเมิน')}</h1><p>{t('แชร์ที่อยู่เกมกับรหัสนี้ให้เพื่อน ทุกคนพร้อมแล้วเจ้าของห้องเริ่มได้')}</p>
    <div className="code-copy"><label htmlFor="room-code-display">{t('รหัสห้อง')}</label><input ref={codeRef} id="room-code-display" className="room-code" value={room.code} readOnly/><button onClick={()=>void copy()}>{t('คัดลอกรหัส')}</button></div><p role="status">{copied}</p>
    <ul className="seat-list">{room.seats.map((s,index)=><li key={s.id}><SeatDisc name={s.name} index={index}/><strong>{s.name}{s.id===room.yourSeatId?t(' (คุณ)'):''}</strong><span>{s.bot?t('บอท · {style}',{style:botStyleName(s.bot)}):`${s.id===room.hostId?t('เจ้าของห้อง · '):''}${!s.connected?t('หลุดจากห้อง'):s.ready?t('พร้อมแล้ว'):t('ยังไม่พร้อม')}`}</span>{host && s.bot && <button disabled={disabled} title={tip(disabled&&locked)} onClick={()=>send({type:'remove-bot',seatId:s.id})}>{t('นำ {name} ออก',{name:s.name})}</button>}{host && !s.bot && !s.connected && <button disabled={disabled} title={tip(disabled&&locked)} onClick={()=>send({type:'remove-seat',seatId:s.id})}>{t('นำ {name} ออก',{name:s.name})}</button>}</li>)}</ul>
    {host?<ChoiceCards compact legend={t('คุยกันระหว่างเล่นไหม')} value={room.playtestMode} onChange={v=>send({type:'playtest-mode',mode:v as 'voice'|'no-voice'})} disabled={disabled} options={[{value:'no-voice',title:t('เล่นเงียบ'),detail:t('ไม่ใช้ Voice')},{value:'voice',title:t('คุยผ่าน Voice'),detail:t('คุยกันระหว่างเล่น')}]}/>:<p>{room.playtestMode==='voice'?t('รอบนี้เล่นพร้อมคุย Voice'):t('รอบนี้เล่นโดยไม่ใช้ Voice')}</p>}
    <BotControls room={room} send={send} disabled={disabled}/>
    <ModePicker room={room} send={send} disabled={disabled}/>
    <RoomTimers room={room} send={send} disabled={disabled}/>
    <div className="actions"><button className={self?.ready?'':'primary'} disabled={disabled} title={tip(disabled&&locked)} onClick={()=>send({type:'ready',ready:!self?.ready})}>{self?.ready?t('ยังไม่พร้อม'):t('ฉันพร้อมแล้ว')}</button>{host && <button className="primary" disabled={disabled || !ready} title={tip(disabled&&locked,!ready&&(room.seats.length<2?t('ต้องมีอย่างน้อย 2 ที่นั่ง เพิ่มบอทหรือรอเพื่อน'):t('ทุกคนต้องออนไลน์และกดพร้อมก่อน')))} onClick={()=>send({type:'start'})}>{t('เริ่มการเดินทาง')}</button>}<button disabled={disabled} title={tip(disabled&&locked)} onClick={()=>send({type:'leave'})}>{t('ออกจากห้อง')}</button></div>{host && !ready && <p>{t('ต้องมี 2–4 คน ทุกคนออนไลน์และกดพร้อมก่อนเริ่ม')} {t('ไม่มีเพื่อน? เพิ่มบอทอย่างน้อย 1 ตัวเพื่อเล่นคนเดียว')}</p>}<Rules timers={room.timerSettings} survival={room.mode==='survival'}/>
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
  return room.timerSettings?.enabled===false && room.game?.phase!=='RESULTS'?<p className="countdown untimed"><TimerIcon/><span>{t('ไม่จับเวลา · {wait}',{wait:room.game?.phase==='REVEAL'?t('รอทุกคนยืนยันไปต่อ'):t('รอทุกคนจบช่วง')})}</span></p>:remaining===null?null:<p className={`countdown${remaining<=10?' urgent':''}`} aria-live="off"><TimerIcon/><span>{t('เหลือ {n} วินาที',{n:remaining})}</span></p>;
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
function Roster({room}:{room:AppraisalRoomView}) {
  const game=room.game!;
  return <ul className="roster" aria-label={t('สถานะผู้เล่นในโต๊ะ')}>{game.players.map((p,index)=>{
    const state=playerState(room,p);const offline=!room.seats.find(s=>s.id===p.id)?.connected;const name=seatName(room,p.id);
    const label=`${name}${p.id===game.self.id?t(' · คุณ'):''} · ${state.text}${offline?t(' · หลุดการเชื่อมต่อ'):''}`;
    return <li key={p.id} className={`${state.kind}${offline?' offline':''}${p.id===game.self.id?' you':''}`} title={label}><SeatDisc name={name} index={index}/><span className="roster-name" aria-hidden="true">{p.id===game.self.id?t('คุณ'):name}</span><span className="sr-only">{label}</span></li>;
  })}</ul>;
}
function Players({room}:{room:AppraisalRoomView}) {
  const game=room.game!;
  return <section className="participants" aria-label={t('ผู้เล่น')}><ul>{game.players.map((p,index)=>{const state=playerState(room,p);return <li key={p.id} className={state.kind}><SeatDisc name={seatName(room,p.id)} index={index}/><div><strong>{seatName(room,p.id)}{p.id===game.self.id?t(' · คุณ'):''}</strong><span>{game.survival && game.phase!=='RESULTS'?t('รอ Collector'):t('{n} คะแนน',{n:p.score})} · {t('{n} เครดิต',{n:p.credits})} · {t('{n} พลัง',{n:p.energy})}{p.life!==undefined?` · ${t('{n} ชีวิต',{n:p.life})}`:''}</span><span>{state.text}{!room.seats.find(s=>s.id===p.id)?.connected?t(' · หลุดการเชื่อมต่อ'):''}</span></div></li>;})}</ul></section>;
}
export function SurvivalResults({room,send,disabled}:{room:AppraisalRoomView;send:Send;disabled:boolean}) {
  const locked=useLock();
  const game=room.game!;const final=game.phase==='RESULTS';
  const name=(id:string)=>room.matchSeats.find(s=>s.id===id)?.name??t('นักประเมิน');
  const rows=[...(game.collector??[])].sort((a,b)=>b.score-a.score);
  const winners=rows.filter(row=>row.score===rows[0]?.score).map(row=>name(row.playerId));
  return <section className="results"><h2>{final?t('Collector มารับของ · ผู้ได้คะแนนสูงสุด: {names}',{names:winners.join(', ')}):t('ซื้อขายช่วง {n} เสร็จแล้ว',{n:game.encounter})}</h2>
    {final?<><p>{t('ทุกคนชีวิตหมดแล้ว Collector รับสินค้าที่เหลือและรวมเครดิต คิดคะแนนครั้งเดียวตามมูลค่าจริงและสถานะที่ยังอยู่เมื่อผู้เล่นตาย')}</p><div className="table-scroll"><table><caption>{t('คะแนนสุดท้ายจากสินค้า + เครดิต และผลสถานะ')}</caption><thead><tr><th scope="col">{t('ผู้เล่น')}</th><th scope="col">{t('สินค้า')}</th><th scope="col">{t('เครดิต')}</th><th scope="col">{t('รวมก่อนปรับ')}</th><th scope="col">{t('ผลคะแนน')}</th><th scope="col">{t('คะแนนรวม')}</th></tr></thead><tbody>{rows.map(row=><tr key={row.playerId} className={row.score===rows[0]?.score?'leader':''}><th scope="row">{name(row.playerId)}</th><td>{row.itemValue}</td><td>{row.credits}</td><td>{row.credits+row.itemValue}</td><td>{row.modifierPercent>=0?'+':''}{row.modifierPercent}%</td><td>{row.score}</td></tr>)}</tbody></table></div>
      {rows.map(row=><details key={row.playerId}><summary>{t('ของที่ Collector รับจาก {name} · {n} ชิ้น',{name:name(row.playerId),n:row.items.length})}</summary>{row.items.length?<ul>{row.items.map((item,index)=><li key={item.id}>{t('#{n} {name} · มูลค่าจริง {base} × {genuine} × {cursed} = คิด {value} คะแนน',{n:index+1,name:itemName(item.kind),base:item.base,genuine:item.genuine?t('แท้ 100%'):t('ปลอม 25%'),cursed:item.cursed?t('มีคำสาป 75%'):t('ไร้คำสาป 100%'),value:item.value})}</li>)}</ul>:<p>{t('ไม่มีสินค้าเหลือ')}</p>}<p>{t('สถานะคะแนน: {status} · (เครดิต {credits} + สินค้า {items}) × {pct}% ปัดลง = {score}',{status:row.statusIds.length?readable(row.statusIds.join(', ')):t('ไม่มี'),credits:row.credits,items:row.itemValue,pct:100+row.modifierPercent,score:row.score})}</p></details>)}
      <div className="actions">{room.hostId===room.yourSeatId?<button className="primary" disabled={disabled} title={tip(disabled&&locked)} onClick={()=>send({type:'rematch'})}>{t('กลับห้องเพื่อเล่นเส้นทางใหม่')}</button>:<p>{t('รอเจ้าของห้องกลับห้องเพื่อเริ่มเส้นทางใหม่')}</p>}<button disabled={disabled} title={tip(disabled&&locked)} onClick={()=>{if(room.matchId)send({type:'audit',matchId:room.matchId});}}>{t('ดาวน์โหลดบันทึกเกม')}</button><button disabled={disabled} title={tip(disabled&&locked)} onClick={()=>send({type:'leave'})}>{t('ออกจากห้อง')}</button></div>
    </>:<><p>{t('ทุกคนที่ยังเล่นเสียชีวิต 1 ตอนจบช่วง คะแนนจะคิดตอน Collector มา ชีวิตหมดแล้วดูเพื่อนต่อได้ ของและเครดิตของผู้ตายยังอยู่')}</p>{game.self.life===0?<p>{t('คุณเป็นผู้ชม ไม่ต้องยืนยันช่วงถัดไป')}</p>:<button className="primary" disabled={disabled || room.revealReady.includes(room.yourSeatId)} title={tip(disabled&&locked,room.revealReady.includes(room.yourSeatId)&&t('คุณพร้อมแล้ว รอผู้เล่นคนอื่น'))} onClick={()=>{if(room.matchId)send({type:'reveal-ready',matchId:room.matchId,encounter:game.encounter});}}>{room.revealReady.includes(room.yourSeatId)?t('พร้อมแล้ว รอผู้ที่ยังมีชีวิต'):game.self.roundReward && !game.self.roundReward.settled?t('รับ {n} เครดิตและไปต่อ',{n:game.self.roundReward.amount}):t('พร้อมไปช่วงถัดไป')}</button>}</>}
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
    <div className="table-scroll"><table><caption>{t('คะแนนจากทรัพย์สินเพิ่มขึ้นและความแม่นยำ')}</caption><thead><tr><th scope="col">{t('ผู้เล่น')}</th><th scope="col">{t('ทรัพย์สินเพิ่ม')}</th><th scope="col">{t('ประเมินตรง')}</th><th scope="col">{t('คะแนนช่วงนี้')}</th><th scope="col">{t('รวม')}</th></tr></thead><tbody>{scores.map(p=>{const h=results.find(r=>r.playerId===p.id);return <tr key={p.id} className={final && p.score===scores[0]?.score?'leader':''}><th scope="row">{room.matchSeats.find(s=>s.id===p.id)?.name??t('นักประเมิน')}{h?.paused==='dead'?t(' · ตาย'):h?.paused==='exhausted'?t(' · พลังหมด'):''}</th><td>{h?.gain??0}</td><td>{h?.accuracy??0}</td><td>{h?.score??0}</td><td>{p.score}</td></tr>;})}</tbody></table></div>
    {final?<><p>{t('เส้นทางจบแล้ว เริ่มใหม่จะสุ่มพ่อค้า เหตุการณ์ สินค้า และ Dark Market ชุดใหม่')}</p><div className="actions">{room.hostId===room.yourSeatId?<button className="primary" disabled={disabled} title={tip(disabled&&locked)} onClick={()=>send({type:'rematch'})}>{t('กลับห้องเพื่อเล่นเส้นทางใหม่')}</button>:<p>{t('รอเจ้าของห้องกลับห้องเพื่อเริ่มเส้นทางใหม่')}</p>}<button disabled={disabled} title={tip(disabled&&locked)} onClick={()=>{if(room.matchId)send({type:'audit',matchId:room.matchId});}}>{t('ดาวน์โหลดบันทึกเกม')}</button><button disabled={disabled} title={tip(disabled&&locked)} onClick={()=>send({type:'leave'})}>{t('ออกจากห้อง')}</button></div></>:<><p>{game.encounter<game.encounterCount!?t('คนที่พักจะกลับมาเล่นในช่วงถัดไป'):t('จะรวมคะแนนเมื่อจบผลช่วงนี้')}</p><button className="primary" disabled={disabled || room.revealReady.includes(room.yourSeatId)} title={tip(disabled&&locked,room.revealReady.includes(room.yourSeatId)&&t('คุณพร้อมแล้ว รอผู้เล่นคนอื่น'))} onClick={()=>{if(room.matchId)send({type:'reveal-ready',matchId:room.matchId,encounter:game.encounter});}}>{room.revealReady.includes(room.yourSeatId)?t('พร้อมแล้ว รอเพื่อน'):game.self.roundReward && !game.self.roundReward.settled?t('รับ {n} เครดิตและไปต่อ',{n:game.self.roundReward.amount}):t('พร้อมไปต่อ')}</button></>}
  </section>;
}
export function GameTable({room,submit,send,disabled}:{room:AppraisalRoomView;submit:(action:Decision)=>void;send:Send;disabled:boolean}) {
  const game=room.game!;const self=game.self;
  const playerNames=Object.fromEntries(room.matchSeats.map(seat=>[seat.id,seat.name]));
  const [selected,setSelected]=useState('');
  const [coinTossing,setCoinTossing]=useState(false);
  const item=self.stock.find(i=>i.id===selected)??self.stock[0];
  const inactive=disabled || !!self.paused || self.done;
  const outer=useLock();
  const lock=outer ?? (game.survival && self.life===0?t('ชีวิตหมดแล้ว คุณเป็นผู้ชม'):self.paused==='dead'?t('คุณตายและพักช่วงนี้'):self.paused?t('พลังหมด พักช่วงนี้'):self.done?t('คุณจบช่วงนี้แล้ว รอเพื่อนหรือหมดเวลา'):coinTossing?t('กำลังโยนเหรียญ รอผล'):disabled?t('รอการเชื่อมต่อหรือผลจากเซิร์ฟเวอร์'):null);
  const playable=['PORTALS','APPRAISAL','TRADE'].includes(game.phase);
  const npc=self.portals.find(p=>p.id===self.selectedPortalId)?.npc;
  const consequence=defaultConsequence(self.eventOffer);
  const [toasts,dismiss]=useOutcomes(game);
  const phase=game.phase;const reveal=phase==='REVEAL' || phase==='RESULTS';
  const eventOpen=!!self.eventOffer && playable;
  // A tucked event lets the player study the table; the table only locks while the dialog is actually open.
  const [tuckedKey,setTuckedKey]=useState<string|null>(null);
  const tucked=eventOpen && tuckedKey===self.eventOffer!.key;
  const estimate=game.survival && game.phase!=='RESULTS'?collectorEstimate(game):null;
  return <LockReason reason={lock}>
    <header className="phase-header"><div className="phase-title"><h1>{phaseLabel(game.phase)}</h1><p className="phase-hint">{phaseHint(game.phase)}</p><p>{t('ช่วงพบพ่อค้า {n}',{n:game.encounter})}{game.encounterCount===null?t(' · จนทุกคนชีวิตหมด'):` / ${game.encounterCount}`} · {t('ห้อง')} <span className="room-code">{room.code}</span></p></div><Countdown room={room}/>
      <dl className="resources"><div className="resource credit"><dt><CoinIcon/>{t('เครดิต')}</dt><dd>{self.credits}</dd></div><div className={`resource energy${self.energy===0?' empty':''}`}><dt><EnergyIcon/>{t('พลัง')}</dt><dd>{self.energy}<small> / {self.maxEnergy??game.maxEnergy??10}</small></dd></div>{self.life!==undefined && <div className={`resource life${self.life<=2?' low':''}`}><dt><LifeIcon/>{t('ชีวิต')}</dt><dd>{self.life}<small> / {self.maxLife??game.survival?.maxLife}</small></dd></div>}<div className="resource score"><dt><ScoreIcon/>{t('คะแนน')}</dt><dd className={estimate?'pending':''} title={estimate?`${t('ประมาณจากเครดิต + สินค้าที่รู้มูลค่า')}${estimate.unpriced?t(' (ยังไม่รู้มูลค่า {n} ชิ้น นับเป็น 0)',{n:estimate.unpriced}):''}${estimate.modifier?` · ${t('ปรับ {n}%',{n:`${estimate.modifier>0?'+':''}${estimate.modifier}`})}`:''} · ${t('คะแนนจริงรอ Collector')}`:undefined}>{estimate?<>~{estimate.min===estimate.max?estimate.min:`${estimate.min}–${estimate.max}`}<small> {t('รอ Collector')}</small></>:self.score}</dd></div></dl>
      <Roster room={room}/></header>
    <NpcContracts game={game}/>
    <WishlistPanel game={game}/>
    {game.omen && playable && <p className="omen" role="note"><strong>{t('ลางของช่วงนี้ · {name}',{name:game.omen.name})}</strong> {game.omen.text}</p>}
    <p className="sr-only" role="status" key={`${game.encounter}-${game.phase}`}>{phaseLabel(game.phase)} {t('ช่วง {n}',{n:game.encounter})}{game.encounterCount!==null?t(' จาก {n}',{n:game.encounterCount}):t(' เล่นจนทุกคนชีวิตหมด')}</p>
    {self.paused && playable && !game.survival && <div className="notice" role="status"><h2>{self.paused==='dead'?t('สัญญาคร่าชีวิตคุณในช่วงนี้'):t('พลังหมดในช่วงนี้')}</h2><p>{self.paused==='dead'?t('คะแนนช่วงนี้เป็น 0 คะแนนที่ได้ก่อนหน้ายังอยู่'):t('คะแนนที่ทำได้ในช่วงนี้ยังอยู่')} {t('พักดูเพื่อนจนจบช่วงนี้ แล้วกลับมาเล่นช่วงถัดไป')}</p></div>}
    {game.survival && self.life===0 && playable && <div className="notice" role="status"><h2>{t('ชีวิตหมดแล้ว · คุณเป็นผู้ชม')}</h2><p>{t('ดูเพื่อนจนทุกคนชีวิตหมด Collector จะรับของที่คุณเก็บไว้และคิดคะแนนพร้อมกัน ไม่มีการกลับมาเล่นใน run นี้')}</p></div>}
    {game.survival && self.energy===0 && self.life!>0 && playable && <p className="notice" role="status">{t('พลัง 0 ยังเล่นต่อได้ เลือกประตูและรับดีลฟื้นพลังได้ การกระทำที่ใช้พลังต้องมีพอ')}</p>}
    {self.done && playable && !self.paused && <p className="notice" role="status">{room.timerSettings?.enabled===false?t('คุณจบช่วงนี้แล้ว รอเพื่อนจบช่วงเพื่อไปต่อ'):t('คุณจบช่วงนี้แล้ว รอเพื่อนหรือหมดเวลาเพื่อไปต่อ')}</p>}
    <div className="table-stage" inert={eventOpen && !tucked}>
    <div className={`table-layout${reveal?' single':''}`}><div className="main-play">
      {game.phase==='PORTALS' && !self.paused && <section className="portals"><h2>{t('เชิญใครมาที่โต๊ะของคุณ')}</h2><p>{t('พบได้หนึ่งรายต่อช่วง แต่ละรายมีของและนิสัยต่างกัน')}</p>{self.eventOffer && <p className="blocked-note">{t('ตอบเหตุการณ์ก่อน จึงเปิดประตูได้')}</p>}<div className="portal-row">{self.portals.map(p=><article key={p.id} className={`portal ${p.disabled?'closed':''}`}><img src={npcImage(p.npc)} width="1122" height="1402" alt={npcName(p.npc)}/><div><h3>{npcName(p.npc)}</h3><p>{t('อาจนำ {name} มาเสนอ',{name:itemName(p.hint)})}</p><p>{npcHint(p.npc)}</p>{self.wishes?.[p.npc] && <p className="trust-note">{t('ตามหา {name}',{name:itemName(self.wishes[p.npc]!.kind)})} · {game.wishContract?t('ราคาเริ่ม {n} เครดิต ลดลงทุกช่วง ไม่ต่ำกว่า {floor}',{n:self.wishes[p.npc]!.price,floor:ITEM_SPECS[self.wishes[p.npc]!.kind].anchor}):t('รับซื้อ {n} เครดิต',{n:self.wishes[p.npc]!.price})}</p>}{self.npcTrust && <p className="trust-note">{t('ความไว้ใจ {n}/10 · ช่วยต่อรอง +{chance} จุดเปอร์เซ็นต์',{n:self.npcTrust[p.npc]??0,chance:npcAcceptanceChance(game,p.npc)})}</p>}<button className="primary" aria-label={`${p.disabled?t('ประตูปิด'):t('เปิดประตูนี้')} · ${npcName(p.npc)}`} disabled={inactive || p.disabled || !!self.eventOffer} title={tip(inactive&&lock,p.disabled&&t('ประตูนี้ปิดอยู่ เลือกพ่อค้ารายอื่น'),!!self.eventOffer&&t('ตอบเหตุการณ์ก่อน จึงเปิดประตูได้'))} onClick={()=>submit({type:'enter',portalId:p.id})}><PortalIcon/>{p.disabled?t('ประตูปิด'):t('เปิดประตูนี้')}</button></div></article>)}</div></section>}
      {game.phase==='APPRAISAL' && !self.paused && <div className={`appraisal-stage${npc?'':' no-merchant'}`}>
        {npc && <aside className="merchant" aria-label={t('พ่อค้า {name}',{name:npcName(npc)})}><img src={npcImage(npc)} width="1122" height="1402" alt=""/><div className="merchant-copy"><h2>{npcName(npc)}</h2><p className={self.caught?'danger-text merchant-line':'merchant-line'}>{self.caught?t('พ่อค้าจับผิดคุณแล้ว'):t('“เลือกของที่ต้องการ แล้วบอกข้าวว่ามันมีราคาเท่าไร”')}</p><p>{npcHint(npc)}</p></div>
          {self.recoveryOffer && <section className="recovery-deal"><h3>{self.recoveryOffer.target==='life'?t('ดีลฟื้นชีวิต'):t('ดีลฟื้นพลัง')}</h3><p>{t('ช่วงละครั้ง · จ่าย {credits} เครดิต ฟื้น{target}สูงสุด {amount} · ไม่ใช้พลัง',{credits:self.recoveryOffer.credits,target:self.recoveryOffer.target==='life'?t('ชีวิต'):t('พลัง'),amount:self.recoveryOffer.amount})}</p>{(()=>{const offer=self.recoveryOffer!;const label=offer.target==='life'?t('ชีวิต'):t('พลัง');
            const why=inactive?null:self.eventOffer?t('ตอบเหตุการณ์ก่อน จึงแลกได้'):(offer.target==='life'?self.life!>=(self.maxLife??game.survival!.maxLife):self.energy>=(self.maxEnergy??game.maxEnergy??10))?t('{label}เต็มแล้ว ไม่ต้องแลก',{label}):needShort(game,{credits:offer.credits,energy:0});
            return <><button disabled={inactive || !!why} title={tip(inactive&&lock,why)} onClick={()=>submit({type:'recover-resource',target:offer.target})}>{t('แลกเครดิตเพื่อฟื้น{label}',{label})}</button>{why && <p className="why" role="status">{why}</p>}</>;})()}</section>}</aside>}
        <div className="stage-main"><WishDeal game={game} submit={submit} disabled={inactive}/><CleanseDeal game={game} submit={submit} disabled={inactive}/>{!item?<p className="notice">{t('ไม่มีของเหลือในร้าน เก็บของ เปิดใช้ หรือจบช่วงประเมินเพื่อไปต่อรองกับเพื่อน')}</p>:<><div className="stock-tabs" role="group" aria-label={t('สินค้าของพ่อค้า')}>{self.stock.map((i,index)=><button key={i.id} className={i.id===item.id?'selected':''} aria-pressed={i.id===item.id} onClick={()=>setSelected(i.id)}><img src={i.image} alt="" width="1254" height="1254"/><span>{index+1}. {itemName(i.kind)} · {t('{n} เครดิต',{n:i.price})}</span></button>)}</div><AppraisalDesk key={item.id} game={game} item={item} submit={submit} disabled={inactive}/></>}</div>
      </div>}
      {phase==='TRADE' && !self.paused && <Unsold game={game} submit={submit} disabled={inactive}/>}
      {phase==='TRADE' && <><Trades game={game} room={room} submit={submit} disabled={inactive}/>{!self.paused && self.stock.length>0 && <details className="shop-sharing"><summary>{t('เปิดของในร้านที่คุณประเมินแล้วให้เพื่อนซื้อ')}</summary>{self.stock.map(i=><div key={i.id}><h3>{t('{name} · ราคาพ่อค้า {n} เครดิต',{name:itemName(i.kind),n:i.price})}</h3><Share game={game} item={i} submit={submit} disabled={inactive}/></div>)}</details>}</>}
      {phase==='REVEAL' && self.roundReward && <RoundReward key={game.encounter} reward={self.roundReward} submit={submit} disabled={disabled || room.revealReady.includes(room.yourSeatId)} onTossing={setCoinTossing}/>}
      {reveal && <Results room={room} send={send} disabled={disabled || coinTossing}/>}
      {playable && !self.paused && !self.done && <div className="end-phase">{consequence && <p className="danger-text">{consequence}</p>}{phase==='TRADE' && game.roundRewardBase!==undefined && <p>{t('เมื่อทุกคนจบซื้อขาย รับเครดิตเติมช่วงนี้ {n} เครดิต หรือเสี่ยงหัวก้อย ก่อนเลือกประตูครั้งถัดไป',{n:game.roundRewardBase})}</p>}{phase==='TRADE' && unsoldItems(game).length>0 && <p className="danger-text">{t('จบช่วงตอนนี้ ของค้าง {n} ชิ้นจะรับโทษจากพ่อค้า',{n:unsoldItems(game).length})}</p>}{phase==='APPRAISAL' && unsoldItems(game).length>0 && <p className="supporting">{t('ของที่ตีราคาแล้ว {n} ชิ้นยังไม่มีคนซื้อ จัดการได้ในช่วงต่อรอง',{n:unsoldItems(game).length})}</p>}<button className="pass" disabled={disabled} title={tip(disabled&&lock)} onClick={()=>submit({type:'done'})}><PassIcon/>{phase==='PORTALS'?t('ข้ามพ่อค้าช่วงนี้'):phase==='APPRAISAL'?t('จบการประเมิน ไปต่อรอง'):game.roundRewardBase!==undefined?t('จบซื้อขาย ไปรับเครดิต'):t('จบการต่อรอง คิดผลช่วง')}</button></div>}
    </div>{!reveal && <div className="side-play">{phase==='APPRAISAL'?<><Statuses game={game}/><DarkMarket compact game={game} submit={submit} disabled={inactive || !playable}/></>:<><DarkMarket game={game} submit={submit} disabled={inactive || !playable}/><Statuses game={game}/></>}{self.notes.length>0 && <details className="notes"><summary>{t('ประวัติผลล่าสุด')}</summary><ul>{self.notes.slice(-6).reverse().map((note,index)=><li key={`${index}-${note}`}><Rich text={playerNote(note,playerNames)} survival={!!game.survival}/></li>)}</ul></details>}</div>}</div>
    {phase==='TRADE'?<><Inventory game={game} submit={submit} disabled={inactive}/><Players room={room}/></>:!reveal && <Inventory drawer game={game} submit={submit} disabled={inactive}/>}
    <HeldEffects game={game}/>
    <Rules timers={room.timerSettings} survival={room.mode==='survival'}/>
    </div>
    {eventOpen && <EventModal key={self.eventOffer!.key} game={game} offer={self.eventOffer!} submit={submit} disabled={inactive} tucked={tucked} setTucked={value=>setTuckedKey(value?self.eventOffer!.key:null)} playerNames={playerNames}/>}
    <Toasts toasts={toasts} dismiss={dismiss} survival={!!game.survival} playerNames={playerNames}/>
  </LockReason>;
}
function useSound(room:AppraisalRoomView|null) {
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
export function App() {
  const connection=useConnection();const sound=useSound(connection.room);
  useLang(); // subscribe the whole table so every label re-renders on a language switch
  const offline=connection.connection!=='online';const disabled=offline || connection.busy;
  const netLock=offline?(connection.connection==='replaced'?t('ที่นั่งนี้เปิดในแท็บอื่น'):t('ยังไม่ได้เชื่อมต่อ รอกลับมาออนไลน์')):connection.busy?t('กำลังส่งการตัดสินใจ รอผลจากพ่อค้า'):null;
  return <><a className="skip-link" href="#game-main">{t('ข้ามไปพื้นที่เล่น')}</a><div className="app-shell"><header className="masthead"><span className="brand">Cursed Market</span><div><span role="status" className={`connection ${connection.connection}`}><span className="connection-label">{connection.connection==='online'?t('เชื่อมต่อแล้ว'):connection.connection==='replaced'?t('ที่นั่งนี้เปิดในแท็บอื่น'):t('กำลังเชื่อมต่อกลับห้อง')}</span></span><LangToggle/><button className="sound-toggle" aria-pressed={sound.enabled} onClick={sound.toggle}><SoundIcon on={sound.enabled}/><span className="sound-label">{sound.enabled?t('ปิดเสียง'):t('เปิดเสียง')}</span></button></div></header>
    {connection.connection==='replaced' && <div className="notice"><p>{t('แท็บอื่นรับช่วงที่นั่งนี้แล้ว โหลดแท็บนี้ใหม่เพื่อกลับมาเล่นที่นี่')}</p><button onClick={()=>location.reload()}>{t('กลับมาเล่นในแท็บนี้')}</button></div>}
    {connection.error && <div className="error" role="alert"><p>{connection.error}</p><button onClick={connection.clearError}>{t('ปิดข้อความ')}</button></div>}
    {connection.busy && <p className="network-status" role="status">{t('กำลังส่งการตัดสินใจ รอผลจากพ่อค้า')}</p>}
    <LockReason reason={netLock}><main id="game-main">{!connection.room?<Entry send={connection.send} disabled={offline}/>:!connection.room.game?<Lobby room={connection.room} send={connection.send} disabled={offline}/>:<GameTable key={connection.room.matchId} room={connection.room} submit={connection.submit} send={connection.send} disabled={disabled}/>}</main></LockReason>
    <footer><span>{t('นักประเมินต่างมิติ · ต้นแบบกติกา {v}',{v:connection.room?.rulesVersion??t('พร้อมเริ่ม')})}</span><span>{t('เลือกข้อมูลที่จะเปิด ก่อนยอมรับราคาที่ต้องจ่าย')}</span></footer>
  </div></>;
}
