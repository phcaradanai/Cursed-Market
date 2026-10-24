import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, PointerEvent, ReactNode } from 'react';
import { t } from './i18n.js';

const TURN_MS=200;

/**
 * Long panels read like a book: when the content is taller than the space, it is laid out in page-wide
 * CSS columns and the reader turns pages (buttons, arrow keys or a swipe) instead of scrolling.
 * Short content stays a single plain page.
 */
/** Matches a media query live; false without a window (server render). */
function useMedia(query:string|undefined):boolean {
  const get=()=>!query || (typeof window!=='undefined' && typeof window.matchMedia==='function' && window.matchMedia(query).matches);
  const [on,setOn]=useState(get);
  useEffect(()=>{if(!query || typeof window==='undefined' || typeof window.matchMedia!=='function')return;const list=window.matchMedia(query);const change=()=>setOn(list.matches);change();list.addEventListener('change',change);return ()=>list.removeEventListener('change',change);},[query]);
  return on;
}

/** `media` limits paging to windows matching that query; elsewhere the children render as they are. */
export function Book({children,className='',media}:{children:ReactNode;className?:string;media?:string}) {
  return useMedia(media)?<BookPages className={className}>{children}</BookPages>:<>{children}</>;
}

function BookPages({children,className=''}:{children:ReactNode;className?:string}) {
  const view=useRef<HTMLDivElement>(null);const flow=useRef<HTMLDivElement>(null);
  const [pages,setPages]=useState(1);const [page,setPage]=useState(0);const [turn,setTurn]=useState('');
  const pageRef=useRef(0);pageRef.current=page;
  const measure=useCallback(()=>{
    const el=view.current,body=flow.current;if(!el||!body)return;
    body.style.height='';body.style.columnWidth='';
    const height=el.clientHeight,width=el.clientWidth;
    if(!height || !width || body.scrollHeight<=height+1){setPages(1);setPage(0);el.scrollLeft=0;return;}
    body.style.height=`${height}px`;body.style.columnWidth=`${width}px`;
    const count=Math.max(1,Math.round(el.scrollWidth/width));
    setPages(count);
    const at=Math.min(pageRef.current,count-1);setPage(at);el.scrollLeft=at*width;
  },[]);
  useLayoutEffect(()=>{measure();},[measure]);
  useEffect(()=>{
    const el=view.current,body=flow.current;if(!el||!body)return;
    let frame=0;const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(measure);};
    const resize=new ResizeObserver(schedule);resize.observe(el);
    const mutate=new MutationObserver(schedule);mutate.observe(body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['open','hidden']});
    body.addEventListener('toggle',schedule,true);
    return ()=>{cancelAnimationFrame(frame);resize.disconnect();mutate.disconnect();body.removeEventListener('toggle',schedule,true);};
  },[measure]);
  const go=(step:number)=>{
    const next=page+step,el=view.current;if(!el || next<0 || next>=pages || turn)return;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const land=()=>{el.scrollLeft=next*el.clientWidth;setPage(next);};
    if(reduced){land();return;}
    setTurn(step>0?'out-next':'out-prev');
    window.setTimeout(()=>{land();setTurn(step>0?'in-next':'in-prev');window.setTimeout(()=>setTurn(''),TURN_MS);},TURN_MS);
  };
  const key=(e:KeyboardEvent)=>{if(pages<2)return;if(e.key==='ArrowRight' || e.key==='PageDown'){e.preventDefault();go(1);}else if(e.key==='ArrowLeft' || e.key==='PageUp'){e.preventDefault();go(-1);}};
  const swipe=useRef<number|null>(null);
  const down=(e:PointerEvent)=>{if(e.pointerType!=='mouse')swipe.current=e.clientX;};
  const up=(e:PointerEvent)=>{const from=swipe.current;swipe.current=null;if(from===null)return;const dx=e.clientX-from;if(Math.abs(dx)>50)go(dx<0?1:-1);};
  return <div className={`book ${className}${pages>1?' paged':''}`} onKeyDown={key}>
    <div ref={view} className={`book-view${turn?` turn-${turn}`:''}`} style={{'--page':page} as CSSProperties} onPointerDown={down} onPointerUp={up}>
      <div ref={flow} className="book-flow">{children}</div>
    </div>
    {pages>1 && <nav className="book-nav" aria-label={t('พลิกหน้า')}>
      <button type="button" aria-label={t('หน้าก่อน')} title={page===0?t('อยู่หน้าแรกแล้ว'):t('หน้าก่อน')} disabled={page===0} onClick={()=>go(-1)}>‹</button>
      <span aria-live="polite">{t('หน้า {n} / {total}',{n:page+1,total:pages})}</span>
      <button type="button" aria-label={t('หน้าถัดไป')} title={page===pages-1?t('อยู่หน้าสุดท้ายแล้ว'):t('หน้าถัดไป')} disabled={page===pages-1} onClick={()=>go(1)}>›</button>
    </nav>}
  </div>;
}
