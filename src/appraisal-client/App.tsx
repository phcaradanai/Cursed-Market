import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { ITEM_SPECS, NPC_SPECS } from '../game/appraisal/content.js';
import type { AppraisalRoomView, AppraisalClientMessage, AppraisalTimerSettings } from '../shared/appraisal-protocol.js';
import { APPRAISAL_TIMER_PHASES } from '../shared/appraisal-protocol.js';
import { useConnection } from './connection.js';
import { AppraisalDesk, DarkMarket, Inventory, Share, Statuses, Trades, Unsold } from './components.js';
import { EventModal, Toasts, useOutcomes } from './feedback.js';
import { defaultConsequence, phaseHint, phaseName, readable, statusName, unsoldItems } from './model.js';
import type { Decision } from './model.js';
import { ChoiceCards, Rich } from './lore.js';
import { CoinIcon, EnergyIcon, LifeIcon, PassIcon, PortalIcon, ScoreIcon, SoundIcon, TimerIcon } from './icons.js';

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
function Rules({timers,survival}:{timers?:AppraisalTimerSettings|undefined;survival?:boolean|undefined}={}) {
  return <details className="rules"><summary>กติกาก่อนเริ่ม · อ่านใน 2 นาที</summary><div>
    <p>คุณเป็นนักประเมิน 2–4 คน แต่ละคนเลือกประตูพบพ่อค้าของตนเอง ประเมิน ซื้อ เก็บ ใช้ และแลกสินค้า {survival===true?'เล่นจนทุกคนชีวิตหมด แล้ว Collector รับของและคิดคะแนน':survival===false?'เล่น 3 ช่วงพบพ่อค้าต่อการเดินทาง':'ตรวจวงจรชีวิตและการคิดคะแนนของห้องก่อนเริ่ม'} เส้นทางใหม่มีพ่อค้า เหตุการณ์ และรายการรับซื้อที่เปลี่ยนไป</p>
    <ol><li><strong>เลือกประตู:</strong> ดูรายการ Dark Market ก่อนเลือกพ่อค้า จัดการเหตุการณ์ที่เสนอให้ก่อนเข้าประตู</li><li><strong>ประเมินและซื้อ:</strong> ตรวจได้ 2 ครั้งต่อช่วง รู้ความแท้ไม่ได้แปลว่าไร้คำสาป ราคาที่คุณประเมินต้องรอ NPC ยอมรับจึงเป็นราคาซื้อ กดราคาต่ำเพิ่มความเสี่ยงถูกจับผิดและเสียทรัพย์ Dark One มีสัญญาที่ถึงชีวิตได้</li><li><strong>ต่อรอง:</strong> เปิดของหรือสินค้าร้านที่คุณประเมินให้คนอื่นชมและยื่นข้อเสนอ ผู้ขายตอบรับก่อนโอน เสนอราคากับผู้เล่นไม่มีบทลงโทษจาก NPC</li><li><strong>คิดผล:</strong> {survival===true?'Collector รวมเครดิตกับมูลค่าของที่เหลือ แล้วปรับด้วย buff/debuff คะแนน ผู้ตายยังได้คะแนนจากทรัพย์ที่เก็บไว้ ไม่มีโบนัสประเมินหรือคะแนนสะสมรายช่วง':survival===false?'คะแนนจากทรัพย์สินที่เพิ่มขึ้นและประเมินตรงมูลค่าจริงในช่วง ±10% ได้ 5 คะแนนต่อชิ้น':'ดูสูตรคะแนนในกติกาของห้อง'} ของปลอมและของต้องสาปมีมูลค่าคะแนนลดลง</li></ol>
    <p>Dark Market สุ่มเปิดก่อนพบพ่อค้า รับซื้อจนจบช่วงนั้น สิทธิ์แยกต่อรายการและผู้เล่น ซื้อของใหม่มาขายได้ ขายแล้วอาจเสียดายเมื่อรอบหน้ารับซื้อแพงกว่า</p>
    {survival===true?<><p>พลังไม่ใช่ชีวิต เริ่มช่วงใหม่ใช้พลัง 1 เท่าที่มี พลัง 0 ยังเลือกประตูและรับดีลฟื้นได้ แต่การกระทำที่ใช้พลังต้องมีพอ ไม่มีฟื้นฟรีท้ายช่วง</p><p>เริ่มชีวิต 6 สูงสุด 6 ท้ายทุกช่วงเสียชีวิต 1 ของแท้ประเภทอาหารหรือยาฟื้นชีวิต 2 เมื่อเปิดใช้ ของมีคำสาปเปิดใช้เสียชีวิต 1 ดีลพ่อค้าฟื้นชีวิตหรือพลังได้หนึ่งครั้งต่อช่วง ชีวิต 0 เป็นผู้ชมจนทุกคนตาย ไม่กลับในช่วงถัดไป</p><p>Vampire, Autometa และ Alien รับ 2 เครดิตเพื่อฟื้นพลัง 3; Orc, Beast และ Dark One รับ 4 เครดิตเพื่อฟื้นชีวิต 2 สัญญาโลหิตฟรีเสียชีวิต 1 และรับความกระหายโลหิต</p><p>Collector ใช้มูลค่าจริง ของปลอมเหลือ 25% คำสาปลดอีก 25% ปัดลงต่อชิ้น {statusName('B10')}ที่ยังอยู่เพิ่มคะแนนรวม 20% ความกระหายโลหิตที่ยังอยู่ลด 20% รวมเปอร์เซ็นต์แล้วปัดลงครั้งเดียว สถานะและทรัพย์ของผู้ตายเก็บไว้จน Collector มา</p></>:survival===false?<p>พลังหมดหรือตายพักเฉพาะช่วงนั้นแล้วกลับช่วงหน้า ตายได้คะแนนช่วงนั้น 0 คะแนนเดิมยังอยู่ พลังหมดคงคะแนนที่ทำได้ เมื่อกลับจากพักฟื้นอย่างน้อย 4 พลัง ปกติฟื้น 2 สูงสุด 10</p>:null}
    <p>เหตุการณ์ RNG 50 ประเภท และผลติดตัว 20 ประเภททำงานตามเงื่อนไข จ่ายเครดิตหรือรับ debuff เพื่อเสี่ยงผลตอบแทน เครดิตเป็นทรัพยากรในเกม</p>
    <p><strong>ประเมินแล้วต้องรับผิดชอบ:</strong> ของที่คุณตีราคาแล้วแต่ไม่มีใครซื้อ ต้องซื้อเอง ยอมรับโทษจากพ่อค้า หรือส่งต่อ Dark Market (อาจติด debuff หรือโดนค่าผ่านทาง) ถ้าไม่เลือกจะรับโทษเอง</p><p><strong>ประมูลตลาดเงา:</strong> ของที่ Dark Market เก็บไว้อาจโผล่มาให้ประมูลแบบปิดซองในบางช่วง</p><p><strong>ของติดตัวมีผล:</strong> พ่อค้าบางรายสนใจของที่คุณถือ เช่น Vampire ขอแลกของในร้านกับเลือดบริสุทธิ์ มีข้อเสนอแบบนี้ 22 แบบ</p>
    <p>{timers?.enabled===false?'ห้องนี้ไม่จับเวลา รอทุกคนจบช่วงหรือยืนยันไปต่อ ผู้ที่หลุดต้องกลับมาจึงเล่นต่อครบได้':timers?`เวลาในห้อง: ${APPRAISAL_TIMER_PHASES.map(phase=>`${phaseName[phase]} ${timers.durationsMs[phase]/1000} วินาที`).join(' · ')}`:'ค่าเริ่มต้น: เลือกประตู 30 วินาที ประเมิน 90 วินาที ต่อรอง 45 วินาที เจ้าของห้องเลือกจับเวลาหรือไม่และปรับเวลาได้ก่อนเริ่ม'}</p>
    <p>เมื่อเปิดจับเวลาและหมดช่วง ข้อเสนอเสริมถูกปฏิเสธ ผลลงโทษที่รับสัญญาไว้ยังมีผล ผู้ที่หลุดเปิดหน้าเดิมเพื่อกลับที่นั่งเดิมได้</p>
  </div></details>;
}
function Entry({send,disabled}:{send:Send;disabled:boolean}) {
  const [name,setName]=useState('');const [code,setCode]=useState('');
  const join=(e:FormEvent)=>{e.preventDefault();send({type:'join',roomCode:code.trim().toUpperCase(),name:name.trim()});};
  return <div className="entry-layout"><section className="entry-copy"><h1>ทุกข้อเสนอ<br/>มีราคาที่ต้องจ่าย</h1><p>ประเมินของจากต่างมิติ ลองกดราคา เก็บของที่อยากได้ และเสี่ยงกับสัญญาที่พ่อค้าเสนอ</p><p>ห้องส่วนตัวสำหรับ 2–4 คน · เพื่อนทุกคนใช้ที่อยู่เกมเดียวกัน</p>
    <form onSubmit={join}><label htmlFor="player-name">ชื่อที่ใช้ในเกม</label><input id="player-name" value={name} onChange={e=>setName(e.target.value)} minLength={1} maxLength={16} autoComplete="nickname" required disabled={disabled}/>
      <button type="button" className="primary" disabled={disabled || !name.trim()} onClick={()=>send({type:'create',name:name.trim()})}>สร้างห้องใหม่</button>
      <label htmlFor="room-code-entry">รหัสห้องของเพื่อน</label><input id="room-code-entry" className="room-code" value={code} onChange={e=>setCode(e.target.value.toUpperCase())} minLength={6} maxLength={6} pattern="[A-Z2-9]{6}" autoComplete="off" spellCheck={false} disabled={disabled}/><button disabled={disabled || !name.trim() || !/^[A-Z2-9]{6}$/.test(code.trim())}>เข้าห้อง</button>
    </form><Rules/>
  </section><figure className="entry-portrait"><img src="/art/npc-darkone.png" width="1122" height="1402" alt="พ่อค้า Dark One ยื่นวัตถุให้ประเมิน"/><figcaption>ของที่เห็น อาจมีราคามากกว่าที่คิด</figcaption></figure></div>;
}
export function RoomTimers({room,send,disabled}:{room:AppraisalRoomView;send:Send;disabled:boolean}) {
  const stored=room.timerSettings;const host=room.hostId===room.yourSeatId;
  const key=JSON.stringify(stored);
  const [enabled,setEnabled]=useState(stored?.enabled??true);
  const [seconds,setSeconds]=useState(()=>Object.fromEntries(APPRAISAL_TIMER_PHASES.map(phase=>[phase,String((stored?.durationsMs[phase]??1000)/1000)])));
  useEffect(()=>{if(stored){setEnabled(stored.enabled);setSeconds(Object.fromEntries(APPRAISAL_TIMER_PHASES.map(phase=>[phase,String(stored.durationsMs[phase]/1000)])));}},[key]);
  if(!stored)return <p>ห้องนี้ใช้เวลาเริ่มต้นของเซิร์ฟเวอร์</p>;
  if(!host)return <p>{stored.enabled?`จับเวลา: ${APPRAISAL_TIMER_PHASES.map(phase=>`${phaseName[phase]} ${stored.durationsMs[phase]/1000} วินาที`).join(' · ')}`:'ไม่จับเวลา · รอทุกคนจบช่วงหรือยืนยันไปต่อ'}</p>;
  const valid=APPRAISAL_TIMER_PHASES.every(phase=>Number.isInteger(Number(seconds[phase])) && Number(seconds[phase])>=1 && Number(seconds[phase])<=900);
  const save=(event:FormEvent)=>{event.preventDefault();if(enabled&&!valid)return;
    const durationsMs=valid?Object.fromEntries(APPRAISAL_TIMER_PHASES.map(phase=>[phase,Number(seconds[phase])*1000])) as AppraisalTimerSettings['durationsMs']:stored.durationsMs;
    send({type:'timer-settings',settings:{enabled,durationsMs}});
  };
  return <form onSubmit={save}><fieldset className="timer-settings"><legend>เวลาในห้อง</legend>
    <ChoiceCards compact legend="รูปแบบเวลา" value={enabled?'timed':'untimed'} onChange={v=>setEnabled(v==='timed')} disabled={disabled} options={[{value:'timed',title:'จับเวลา',detail:'หมดเวลาแล้วเกมเดินต่อเอง'},{value:'untimed',title:'ไม่จับเวลา',detail:'รอทุกคนกดจบช่วง'}]}/>
    <div className="timer-fields">{APPRAISAL_TIMER_PHASES.map(phase=><label key={phase} htmlFor={`timer-${phase}`}>{phaseName[phase]} (วินาที)<input id={`timer-${phase}`} type="number" min="1" max="900" step="1" value={seconds[phase]} onChange={e=>setSeconds({...seconds,[phase]:e.target.value})} disabled={disabled||!enabled} required/></label>)}</div>
    <p>{enabled?'ตั้งได้ช่วงละ 1–900 วินาที ทุกคนจบช่วงแล้วไปต่อทันที':'ไม่มีการข้ามอัตโนมัติเมื่อรอ คนที่หลุดต้องกลับมาเพื่อจบช่วงหรือยืนยันไปต่อ'}</p>
    <button disabled={disabled || enabled&&!valid}>บันทึกเวลาของห้อง</button><p className="supporting">เปลี่ยนเวลาแล้วทุกคนต้องกดพร้อมใหม่</p>
  </fieldset></form>;
}
function Lobby({room,send,disabled}:{room:AppraisalRoomView;send:Send;disabled:boolean}) {
  const self=room.seats.find(s=>s.id===room.yourSeatId);const host=room.hostId===room.yourSeatId;
  const [copied,setCopied]=useState('');const codeRef=useRef<HTMLInputElement>(null);
  const copy=async()=>{try {await navigator.clipboard.writeText(room.code);setCopied('คัดลอกรหัสแล้ว');}catch {codeRef.current?.select();setCopied('เลือกรหัสไว้แล้ว กดคัดลอกด้วยตัวเอง');}};
  const ready=room.seats.length>=2 && room.seats.every(s=>s.ready && s.connected);
  return <section className="lobby"><h1>โต๊ะนักประเมิน</h1><p>แชร์ที่อยู่เกมกับรหัสนี้ให้เพื่อน ทุกคนพร้อมแล้วเจ้าของห้องเริ่มได้</p>
    <div className="code-copy"><label htmlFor="room-code-display">รหัสห้อง</label><input ref={codeRef} id="room-code-display" className="room-code" value={room.code} readOnly/><button onClick={()=>void copy()}>คัดลอกรหัส</button></div><p role="status">{copied}</p>
    <ul className="seat-list">{room.seats.map((s,index)=><li key={s.id}><SeatDisc name={s.name} index={index}/><strong>{s.name}{s.id===room.yourSeatId?' (คุณ)':''}</strong><span>{s.id===room.hostId?'เจ้าของห้อง · ':''}{!s.connected?'หลุดจากห้อง':s.ready?'พร้อมแล้ว':'ยังไม่พร้อม'}</span>{host && !s.connected && <button disabled={disabled} onClick={()=>send({type:'remove-seat',seatId:s.id})}>นำ {s.name} ออก</button>}</li>)}</ul>
    {host?<ChoiceCards compact legend="คุยกันระหว่างเล่นไหม" value={room.playtestMode} onChange={v=>send({type:'playtest-mode',mode:v as 'voice'|'no-voice'})} disabled={disabled} options={[{value:'no-voice',title:'เล่นเงียบ',detail:'ไม่ใช้ Voice'},{value:'voice',title:'คุยผ่าน Voice',detail:'คุยกันระหว่างเล่น'}]}/>:<p>{room.playtestMode==='voice'?'รอบนี้เล่นพร้อมคุย Voice':'รอบนี้เล่นโดยไม่ใช้ Voice'}</p>}
    <RoomTimers room={room} send={send} disabled={disabled}/>
    <div className="actions"><button className={self?.ready?'':'primary'} disabled={disabled} onClick={()=>send({type:'ready',ready:!self?.ready})}>{self?.ready?'ยังไม่พร้อม':'ฉันพร้อมแล้ว'}</button>{host && <button className="primary" disabled={disabled || !ready} onClick={()=>send({type:'start'})}>เริ่มการเดินทาง</button>}<button disabled={disabled} onClick={()=>send({type:'leave'})}>ออกจากห้อง</button></div>{host && !ready && <p>ต้องมี 2–4 คน ทุกคนออนไลน์และกดพร้อมก่อนเริ่ม</p>}<Rules timers={room.timerSettings} survival={room.rulesVersion==='0.5'}/>
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
  return room.timerSettings?.enabled===false && room.game?.phase!=='RESULTS'?<p className="countdown untimed"><TimerIcon/><span>ไม่จับเวลา · {room.game?.phase==='REVEAL'?'รอทุกคนยืนยันไปต่อ':'รอทุกคนจบช่วง'}</span></p>:remaining===null?null:<p className={`countdown${remaining<=10?' urgent':''}`} aria-live="off"><TimerIcon/><span>เหลือ <strong>{remaining}</strong> วินาที</span></p>;
}
type Player=NonNullable<AppraisalRoomView['game']>['players'][number];
function playerState(room:AppraisalRoomView,p:Player):{kind:'spectator'|'paused'|'done'|'deciding'|'finished';text:string} {
  const game=room.game!;
  if(game.phase==='RESULTS')return {kind:'finished',text:'จบการเดินทาง'};
  if(game.survival && p.life===0)return {kind:'spectator',text:'ผู้ชม · ชีวิตหมด'};
  if(game.phase==='REVEAL')return room.revealReady.includes(p.id)?{kind:'done',text:'พร้อมไปต่อแล้ว'}:{kind:'deciding',text:'รอยืนยันไปต่อ'};
  return p.paused==='dead'?{kind:'paused',text:'พัก: ตาย'}:p.paused==='exhausted'?{kind:'paused',text:'พัก: พลังหมด'}:p.done?{kind:'done',text:'จบช่วงนี้แล้ว'}:{kind:'deciding',text:'กำลังตัดสินใจ'};
}
const seatName=(room:AppraisalRoomView,id:string)=>room.matchSeats.find(s=>s.id===id)?.name??'นักประเมิน';
function Roster({room}:{room:AppraisalRoomView}) {
  const game=room.game!;
  return <ul className="roster" aria-label="สถานะผู้เล่นในโต๊ะ">{game.players.map((p,index)=>{
    const state=playerState(room,p);const offline=!room.seats.find(s=>s.id===p.id)?.connected;const name=seatName(room,p.id);
    const label=`${name}${p.id===game.self.id?' · คุณ':''} · ${state.text}${offline?' · หลุดการเชื่อมต่อ':''}`;
    return <li key={p.id} className={`${state.kind}${offline?' offline':''}${p.id===game.self.id?' you':''}`} title={label}><SeatDisc name={name} index={index}/><span className="roster-name" aria-hidden="true">{p.id===game.self.id?'คุณ':name}</span><span className="sr-only">{label}</span></li>;
  })}</ul>;
}
function Players({room}:{room:AppraisalRoomView}) {
  const game=room.game!;
  return <section className="participants" aria-label="ผู้เล่น"><ul>{game.players.map((p,index)=>{const state=playerState(room,p);return <li key={p.id} className={state.kind}><SeatDisc name={seatName(room,p.id)} index={index}/><div><strong>{seatName(room,p.id)}{p.id===game.self.id?' · คุณ':''}</strong><span>{game.survival && game.phase!=='RESULTS'?'รอ Collector':`${p.score} คะแนน`} · {p.credits} เครดิต · {p.energy} พลัง{p.life!==undefined?` · ${p.life} ชีวิต`:''}</span><span>{state.text}{!room.seats.find(s=>s.id===p.id)?.connected?' · หลุดการเชื่อมต่อ':''}</span></div></li>;})}</ul></section>;
}
export function SurvivalResults({room,send,disabled}:{room:AppraisalRoomView;send:Send;disabled:boolean}) {
  const game=room.game!;const final=game.phase==='RESULTS';
  const name=(id:string)=>room.matchSeats.find(s=>s.id===id)?.name??'นักประเมิน';
  const rows=[...(game.collector??[])].sort((a,b)=>b.score-a.score);
  const winners=rows.filter(row=>row.score===rows[0]?.score).map(row=>name(row.playerId));
  return <section className="results"><h2>{final?`Collector มารับของ · ผู้ได้คะแนนสูงสุด: ${winners.join(', ')}`:`จบช่วงที่ ${game.encounter}`}</h2>
    {final?<><p>ทุกคนชีวิตหมดแล้ว Collector รับสินค้าที่เหลือและรวมเครดิต คิดคะแนนครั้งเดียวตามมูลค่าจริงและสถานะที่ยังอยู่เมื่อผู้เล่นตาย</p><div className="table-scroll"><table><caption>คะแนนสุดท้ายจากสินค้า + เครดิต และผลสถานะ</caption><thead><tr><th scope="col">ผู้เล่น</th><th scope="col">สินค้า</th><th scope="col">เครดิต</th><th scope="col">ผลคะแนน</th><th scope="col">คะแนนรวม</th></tr></thead><tbody>{rows.map(row=><tr key={row.playerId} className={row.score===rows[0]?.score?'leader':''}><th scope="row">{name(row.playerId)}</th><td>{row.itemValue}</td><td>{row.credits}</td><td>{row.modifierPercent>=0?'+':''}{row.modifierPercent}%</td><td>{row.score}</td></tr>)}</tbody></table></div>
      {rows.map(row=><details key={row.playerId}><summary>ของที่ Collector รับจาก {name(row.playerId)} · {row.items.length} ชิ้น</summary>{row.items.length?<ul>{row.items.map((item,index)=><li key={item.id}>#{index+1} {ITEM_SPECS[item.kind].name} · มูลค่าจริง {item.base} · {item.genuine?'แท้':'ปลอม'} · {item.cursed?'มีคำสาป':'ไร้คำสาป'} · คิด {item.value} คะแนน</li>)}</ul>:<p>ไม่มีสินค้าเหลือ</p>}<p>สถานะคะแนน: {row.statusIds.length?readable(row.statusIds.join(', ')):'ไม่มี'}</p></details>)}
      <div className="actions">{room.hostId===room.yourSeatId?<button className="primary" disabled={disabled} onClick={()=>send({type:'rematch'})}>กลับห้องเพื่อเล่นเส้นทางใหม่</button>:<p>รอเจ้าของห้องกลับห้องเพื่อเริ่มเส้นทางใหม่</p>}<button disabled={disabled} onClick={()=>{if(room.matchId)send({type:'audit',matchId:room.matchId});}}>ดาวน์โหลดบันทึกเกม</button><button disabled={disabled} onClick={()=>send({type:'leave'})}>ออกจากห้อง</button></div>
    </>:<><p>ทุกคนที่ยังเล่นเสียชีวิต 1 ตอนจบช่วง คะแนนจะคิดตอน Collector มา ชีวิตหมดแล้วดูเพื่อนต่อได้ ของและเครดิตของผู้ตายยังอยู่</p>{game.self.life===0?<p>คุณเป็นผู้ชม ไม่ต้องยืนยันช่วงถัดไป</p>:<button className="primary" disabled={disabled || room.revealReady.includes(room.yourSeatId)} onClick={()=>{if(room.matchId)send({type:'reveal-ready',matchId:room.matchId,encounter:game.encounter});}}>{room.revealReady.includes(room.yourSeatId)?'พร้อมแล้ว รอผู้ที่ยังมีชีวิต':'พร้อมไปช่วงถัดไป'}</button>}</>}
  </section>;
}
function Results({room,send,disabled}:{room:AppraisalRoomView;send:Send;disabled:boolean}) {
  const game=room.game!;const final=game.phase==='RESULTS';
  if(game.survival)return <SurvivalResults room={room} send={send} disabled={disabled}/>;
  const results=game.history.filter(h=>h.encounter===game.encounter);
  const scores=[...game.players].sort((a,b)=>b.score-a.score);
  const winners=scores.filter(p=>p.score===scores[0]?.score).map(p=>room.matchSeats.find(s=>s.id===p.id)?.name??'นักประเมิน');
  return <section className="results"><h2>{final?`ผู้ได้คะแนนสูงสุด: ${winners.join(', ')}`:`ผลช่วง ${game.encounter}`}</h2>
    <div className="table-scroll"><table><caption>คะแนนจากทรัพย์สินเพิ่มขึ้นและความแม่นยำ</caption><thead><tr><th scope="col">ผู้เล่น</th><th scope="col">ทรัพย์สินเพิ่ม</th><th scope="col">ประเมินตรง</th><th scope="col">คะแนนช่วงนี้</th><th scope="col">รวม</th></tr></thead><tbody>{scores.map(p=>{const h=results.find(r=>r.playerId===p.id);return <tr key={p.id} className={final && p.score===scores[0]?.score?'leader':''}><th scope="row">{room.matchSeats.find(s=>s.id===p.id)?.name??'นักประเมิน'}{h?.paused==='dead'?' · ตาย':h?.paused==='exhausted'?' · พลังหมด':''}</th><td>{h?.gain??0}</td><td>{h?.accuracy??0}</td><td>{h?.score??0}</td><td>{p.score}</td></tr>;})}</tbody></table></div>
    {final?<><p>เส้นทางจบแล้ว เริ่มใหม่จะสุ่มพ่อค้า เหตุการณ์ สินค้า และ Dark Market ชุดใหม่</p><div className="actions">{room.hostId===room.yourSeatId?<button className="primary" disabled={disabled} onClick={()=>send({type:'rematch'})}>กลับห้องเพื่อเล่นเส้นทางใหม่</button>:<p>รอเจ้าของห้องกลับห้องเพื่อเริ่มเส้นทางใหม่</p>}<button disabled={disabled} onClick={()=>{if(room.matchId)send({type:'audit',matchId:room.matchId});}}>ดาวน์โหลดบันทึกเกม</button><button disabled={disabled} onClick={()=>send({type:'leave'})}>ออกจากห้อง</button></div></>:<><p>{game.encounter<game.encounterCount!?'คนที่พักจะกลับมาเล่นในช่วงถัดไป':'จะรวมคะแนนเมื่อจบผลช่วงนี้'}</p><button className="primary" disabled={disabled || room.revealReady.includes(room.yourSeatId)} onClick={()=>{if(room.matchId)send({type:'reveal-ready',matchId:room.matchId,encounter:game.encounter});}}>{room.revealReady.includes(room.yourSeatId)?'พร้อมแล้ว รอเพื่อน':'พร้อมไปต่อ'}</button></>}
  </section>;
}
export function GameTable({room,submit,send,disabled}:{room:AppraisalRoomView;submit:(action:Decision)=>void;send:Send;disabled:boolean}) {
  const game=room.game!;const self=game.self;
  const [selected,setSelected]=useState('');
  const item=self.stock.find(i=>i.id===selected)??self.stock[0];
  const inactive=disabled || !!self.paused || self.done;
  const playable=['PORTALS','APPRAISAL','TRADE'].includes(game.phase);
  const npc=self.portals.find(p=>p.id===self.selectedPortalId)?.npc;
  const consequence=defaultConsequence(self.eventOffer);
  const [toasts,dismiss]=useOutcomes(game);
  const phase=game.phase;const reveal=phase==='REVEAL' || phase==='RESULTS';
  const eventOpen=!!self.eventOffer && playable;
  return <>
    <header className="phase-header"><div className="phase-title"><h1>{phaseName[game.phase]}</h1><p className="phase-hint">{phaseHint[game.phase]}</p><p>ช่วงพบพ่อค้า {game.encounter}{game.encounterCount===null?' · จนทุกคนชีวิตหมด':` / ${game.encounterCount}`} · ห้อง <span className="room-code">{room.code}</span></p></div><Countdown room={room}/>
      <dl className="resources"><div className="resource credit"><dt><CoinIcon/>เครดิต</dt><dd>{self.credits}</dd></div><div className={`resource energy${self.energy===0?' empty':''}`}><dt><EnergyIcon/>พลัง</dt><dd>{self.energy}<small> / {game.maxEnergy??10}</small></dd></div>{self.life!==undefined && <div className={`resource life${self.life<=2?' low':''}`}><dt><LifeIcon/>ชีวิต</dt><dd>{self.life}<small> / {game.survival?.maxLife}</small></dd></div>}<div className="resource score"><dt><ScoreIcon/>คะแนน</dt><dd className={game.survival && game.phase!=='RESULTS'?'pending':''}>{game.survival && game.phase!=='RESULTS'?'รอ Collector':self.score}</dd></div></dl>
      <Roster room={room}/></header>
    <p className="sr-only" role="status" key={`${game.encounter}-${game.phase}`}>{phaseName[game.phase]} ช่วง {game.encounter}{game.encounterCount!==null?` จาก ${game.encounterCount}`:' เล่นจนทุกคนชีวิตหมด'}</p>
    {self.paused && playable && !game.survival && <div className="notice" role="status"><h2>{self.paused==='dead'?'สัญญาคร่าชีวิตคุณในช่วงนี้':'พลังหมดในช่วงนี้'}</h2><p>{self.paused==='dead'?'คะแนนช่วงนี้เป็น 0 คะแนนที่ได้ก่อนหน้ายังอยู่':'คะแนนที่ทำได้ในช่วงนี้ยังอยู่'} พักดูเพื่อนจนจบช่วงนี้ แล้วกลับมาเล่นช่วงถัดไป</p></div>}
    {game.survival && self.life===0 && playable && <div className="notice" role="status"><h2>ชีวิตหมดแล้ว · คุณเป็นผู้ชม</h2><p>ดูเพื่อนจนทุกคนชีวิตหมด Collector จะรับของที่คุณเก็บไว้และคิดคะแนนพร้อมกัน ไม่มีการกลับมาเล่นใน run นี้</p></div>}
    {game.survival && self.energy===0 && self.life!>0 && playable && <p className="notice" role="status">พลัง 0 ยังเล่นต่อได้ เลือกประตูและรับดีลฟื้นพลังได้ การกระทำที่ใช้พลังต้องมีพอ</p>}
    {self.done && playable && !self.paused && <p className="notice" role="status">{room.timerSettings?.enabled===false?'คุณจบช่วงนี้แล้ว รอเพื่อนจบช่วงเพื่อไปต่อ':'คุณจบช่วงนี้แล้ว รอเพื่อนหรือหมดเวลาเพื่อไปต่อ'}</p>}
    <div className="table-stage" inert={eventOpen}>
    <div className={`table-layout${reveal?' single':''}`}><div className="main-play">
      {game.phase==='PORTALS' && !self.paused && <section className="portals"><h2>เชิญใครมาที่โต๊ะของคุณ</h2><p>พบได้หนึ่งรายต่อช่วง แต่ละรายมีของและนิสัยต่างกัน</p>{self.eventOffer && <p className="blocked-note">ตอบเหตุการณ์ก่อน จึงเปิดประตูได้</p>}<div className="portal-row">{self.portals.map(p=><article key={p.id} className={`portal ${p.disabled?'closed':''}`}><img src={`/art/npc-${p.npc}.png`} width="1122" height="1402" alt={NPC_SPECS[p.npc].name}/><div><h3>{NPC_SPECS[p.npc].name}</h3><p>อาจนำ {ITEM_SPECS[p.hint].name} มาเสนอ</p><p>{NPC_SPECS[p.npc].hint}</p><button className="primary" aria-label={`${p.disabled?'ประตูปิด':'เปิดประตูนี้'} · ${NPC_SPECS[p.npc].name}`} disabled={inactive || p.disabled || !!self.eventOffer} onClick={()=>submit({type:'enter',portalId:p.id})}><PortalIcon/>{p.disabled?'ประตูปิด':'เปิดประตูนี้'}</button></div></article>)}</div></section>}
      {game.phase==='APPRAISAL' && !self.paused && <div className={`appraisal-stage${npc?'':' no-merchant'}`}>
        {npc && <aside className="merchant" aria-label={`พ่อค้า ${NPC_SPECS[npc].name}`}><img src={`/art/npc-${npc}.png`} width="1122" height="1402" alt=""/><div className="merchant-copy"><h2>{NPC_SPECS[npc].name}</h2><p className={self.caught?'danger-text merchant-line':'merchant-line'}>{self.caught?'พ่อค้าจับผิดคุณแล้ว':'“เลือกของที่ต้องการ แล้วบอกข้าว่ามันมีราคาเท่าไร”'}</p><p>{NPC_SPECS[npc].hint}</p></div>
          {self.recoveryOffer && <section className="recovery-deal"><h3>ดีลฟื้น{self.recoveryOffer.target==='life'?'ชีวิต':'พลัง'}</h3><p>ช่วงละครั้ง · จ่าย {self.recoveryOffer.credits} เครดิต ฟื้น{self.recoveryOffer.target==='life'?'ชีวิต':'พลัง'}สูงสุด {self.recoveryOffer.amount} · ไม่ใช้พลัง</p><button disabled={inactive || !!self.eventOffer || self.credits<self.recoveryOffer.credits || (self.recoveryOffer.target==='life'?self.life!>=game.survival!.maxLife:self.energy>=(game.maxEnergy??10))} onClick={()=>submit({type:'recover-resource',target:self.recoveryOffer!.target})}>แลกเครดิตเพื่อฟื้น{self.recoveryOffer.target==='life'?'ชีวิต':'พลัง'}</button></section>}</aside>}
        <div className="stage-main">{!item?<p className="notice">ไม่มีของเหลือในร้าน เก็บของ เปิดใช้ หรือจบช่วงประเมินเพื่อไปต่อรองกับเพื่อน</p>:<><div className="stock-tabs" role="group" aria-label="สินค้าของพ่อค้า">{self.stock.map((i,index)=><button key={i.id} className={i.id===item.id?'selected':''} aria-pressed={i.id===item.id} onClick={()=>setSelected(i.id)}><img src={i.image} alt="" width="1254" height="1254"/><span>{index+1}. {i.name} · {i.price} เครดิต</span></button>)}</div><AppraisalDesk key={item.id} game={game} item={item} submit={submit} disabled={inactive}/></>}</div>
      </div>}
      {phase==='TRADE' && !self.paused && <Unsold game={game} submit={submit} disabled={inactive}/>}
      {phase==='TRADE' && <><Trades game={game} room={room} submit={submit} disabled={inactive}/>{!self.paused && self.stock.length>0 && <details className="shop-sharing"><summary>เปิดของในร้านที่คุณประเมินแล้วให้เพื่อนซื้อ</summary>{self.stock.map(i=><div key={i.id}><h3>{i.name} · ราคาพ่อค้า {i.price} เครดิต</h3><Share game={game} item={i} submit={submit} disabled={inactive}/></div>)}</details>}</>}
      {reveal && <Results room={room} send={send} disabled={disabled}/>}
      {playable && !self.paused && !self.done && <div className="end-phase">{consequence && <p className="danger-text">{consequence}</p>}{phase==='TRADE' && unsoldItems(game).length>0 && <p className="danger-text">จบช่วงตอนนี้ ของค้าง {unsoldItems(game).length} ชิ้นจะรับโทษจากพ่อค้า</p>}{phase==='APPRAISAL' && unsoldItems(game).length>0 && <p className="supporting">ของที่ตีราคาแล้ว {unsoldItems(game).length} ชิ้นยังไม่มีคนซื้อ จัดการได้ในช่วงต่อรอง</p>}<button className="pass" disabled={disabled} onClick={()=>submit({type:'done'})}><PassIcon/>{phase==='PORTALS'?'ข้ามพ่อค้าช่วงนี้':phase==='APPRAISAL'?'จบการประเมิน ไปต่อรอง':'จบการต่อรอง คิดผลช่วง'}</button></div>}
    </div>{!reveal && <div className="side-play">{phase==='APPRAISAL'?<><Statuses game={game}/><DarkMarket compact game={game} submit={submit} disabled={inactive || !playable}/></>:<><DarkMarket game={game} submit={submit} disabled={inactive || !playable}/><Statuses game={game}/></>}{self.notes.length>0 && <details className="notes"><summary>ประวัติผลล่าสุด</summary><ul>{self.notes.slice(-6).reverse().map((note,index)=><li key={`${index}-${note}`}><Rich text={note} survival={!!game.survival}/></li>)}</ul></details>}</div>}</div>
    {phase==='TRADE'?<><Inventory game={game} submit={submit} disabled={inactive}/><Players room={room}/></>:!reveal && <Inventory drawer game={game} submit={submit} disabled={inactive}/>}
    <Rules timers={room.timerSettings} survival={room.rulesVersion==='0.5'}/>
    </div>
    {eventOpen && <EventModal key={self.eventOffer!.key} game={game} offer={self.eventOffer!} submit={submit} disabled={inactive}/>}
    <Toasts toasts={toasts} dismiss={dismiss} survival={!!game.survival}/>
  </>;
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
  const offline=connection.connection!=='online';const disabled=offline || connection.busy;
  return <><a className="skip-link" href="#game-main">ข้ามไปพื้นที่เล่น</a><div className="app-shell"><header className="masthead"><span className="brand">Cursed Market</span><div><span role="status" className={`connection ${connection.connection}`}><span className="connection-label">{connection.connection==='online'?'เชื่อมต่อแล้ว':connection.connection==='replaced'?'ที่นั่งนี้เปิดในแท็บอื่น':'กำลังเชื่อมต่อกลับห้อง'}</span></span><button className="sound-toggle" aria-pressed={sound.enabled} onClick={sound.toggle}><SoundIcon on={sound.enabled}/><span className="sound-label">{sound.enabled?'ปิดเสียง':'เปิดเสียง'}</span></button></div></header>
    {connection.connection==='replaced' && <div className="notice"><p>แท็บอื่นรับช่วงที่นั่งนี้แล้ว โหลดแท็บนี้ใหม่เพื่อกลับมาเล่นที่นี่</p><button onClick={()=>location.reload()}>กลับมาเล่นในแท็บนี้</button></div>}
    {connection.error && <div className="error" role="alert"><p>{connection.error}</p><button onClick={connection.clearError}>ปิดข้อความ</button></div>}
    {connection.busy && <p className="network-status" role="status">กำลังส่งการตัดสินใจ รอผลจากพ่อค้า</p>}
    <main id="game-main">{!connection.room?<Entry send={connection.send} disabled={offline}/>:!connection.room.game?<Lobby room={connection.room} send={connection.send} disabled={offline}/>:<GameTable key={connection.room.matchId} room={connection.room} submit={connection.submit} send={connection.send} disabled={disabled}/>}</main>
    <footer><span>นักประเมินต่างมิติ · ต้นแบบกติกา {connection.room?.rulesVersion??'พร้อมเริ่ม'}</span><span>เลือกข้อมูลที่จะเปิด ก่อนยอมรับราคาที่ต้องจ่าย</span></footer>
  </div></>;
}
