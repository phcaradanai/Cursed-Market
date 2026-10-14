import { useEffect, useRef, useState } from 'react';
import type { AppraisalView, EventOffer } from '../game/appraisal/types.js';
import { EventDecision } from './components.js';
import type { Actions } from './components.js';
import { BuffIcon, CloseIcon, DebuffIcon, EventIcon } from './icons.js';
import { Rich } from './lore.js';
import { eventCatalog, isConsequence, outcomeBetween } from './model.js';
import type { Outcome } from './model.js';

type Toast = Outcome & { id:number };
const TOAST_MS = 6500;

/** Watches the seat view and queues one result card per meaningful change. */
export function useOutcomes(game:AppraisalView):[Toast[],(id:number)=>void] {
  const previous=useRef<AppraisalView|null>(null);const seq=useRef(0);
  const [toasts,setToasts]=useState<Toast[]>([]);
  useEffect(()=>{
    const prev=previous.current;previous.current=game;if(!prev) return;
    const outcome=outcomeBetween(prev,game);
    if(outcome) setToasts(list=>[...list.slice(-3),{...outcome,id:++seq.current}]);
  },[game]);
  return [toasts,(id:number)=>setToasts(list=>list.filter(t=>t.id!==id))];
}

function ToastCard({toast,dismiss,survival}:{toast:Toast;dismiss:()=>void;survival:boolean}) {
  const [paused,setPaused]=useState(false);
  useEffect(()=>{if(paused) return;const timer=setTimeout(dismiss,TOAST_MS);return ()=>clearTimeout(timer);},[paused]);
  return <li className={`toast ${toast.tone}`} onPointerEnter={()=>setPaused(true)} onPointerLeave={()=>setPaused(false)} onFocus={()=>setPaused(true)} onBlur={()=>setPaused(false)}>
    <span className="toast-icon" aria-hidden="true">{toast.tone==='bad'?<DebuffIcon/>:toast.tone==='good'?<BuffIcon/>:<EventIcon/>}</span>
    <div className="toast-body"><strong><Rich passive survival={survival} text={toast.title}/></strong>
      {toast.lines.length>0 && <ul>{toast.lines.map((line,index)=><li key={`${index}-${line}`}><Rich passive survival={survival} text={line}/></li>)}</ul>}</div>
    <button type="button" className="toast-close" onClick={dismiss} aria-label="ปิดการแจ้งเตือน"><CloseIcon/></button>
    {!paused && <span className="toast-timer" style={{animationDuration:`${TOAST_MS}ms`}} aria-hidden="true"/>}
  </li>;
}
export function Toasts({toasts,dismiss,survival}:{toasts:Toast[];dismiss:(id:number)=>void;survival:boolean}) {
  return <ol className="toasts" aria-live="polite" aria-label="ผลที่เพิ่งเกิด">{toasts.map(t=><ToastCard key={t.id} toast={t} survival={survival} dismiss={()=>dismiss(t.id)}/>)}</ol>;
}

/**
 * An event blocks every table action until it is answered, so it takes the stage as a dialog.
 * The player can tuck it away to study the table; a pill brings it back.
 */
export function EventModal({game,offer,submit,disabled}:Actions&{offer:EventOffer}) {
  const [tucked,setTucked]=useState(false);const panel=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if(tucked) return;
    panel.current?.focus();
    const overflow=document.body.style.overflow;document.body.style.overflow='hidden';
    return ()=>{document.body.style.overflow=overflow;};
  },[tucked]);
  if(tucked) return <button type="button" className={`event-pill${isConsequence(offer.id)?' danger':''}`} onClick={()=>setTucked(false)}><EventIcon/><span>เหตุการณ์รอคุณ: {eventCatalog(offer).name}</span><strong>กลับไปตัดสินใจ</strong></button>;
  return <div className="modal-backdrop">
    <div ref={panel} className="modal" role="dialog" aria-modal="true" aria-labelledby={`event-${offer.id}`} tabIndex={-1}>
      <EventDecision game={game} offer={offer} submit={submit} disabled={disabled}/>
      <button type="button" className="modal-tuck" onClick={()=>setTucked(true)}>ซ่อนไว้ก่อน ขอดูโต๊ะ</button>
    </div>
  </div>;
}
