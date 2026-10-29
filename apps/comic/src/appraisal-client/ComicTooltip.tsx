import {cloneElement,useEffect,useId,useLayoutEffect,useRef,useState,type ReactElement,type ReactNode} from 'react';
import {createPortal} from 'react-dom';
/** Read-only hint shared by icon navigation and item previews. */
export function ComicTooltip({children,content}:{children:ReactElement<{'aria-describedby'?:string|undefined}>;content:ReactNode}) {
 const id=useId(),anchor=useRef<HTMLSpanElement>(null),tip=useRef<HTMLSpanElement>(null);
 const [open,setOpen]=useState(false),[position,setPosition]=useState({left:0,top:0});
 useEffect(()=>{if(!open)return;const close=()=>setOpen(false);document.addEventListener('pointerdown',close,true);window.addEventListener('blur',close);window.addEventListener('scroll',close,true);return()=>{document.removeEventListener('pointerdown',close,true);window.removeEventListener('blur',close);window.removeEventListener('scroll',close,true);};},[open]);
 useLayoutEffect(()=>{if(!open)return;const a=anchor.current?.firstElementChild?.getBoundingClientRect(),b=tip.current?.getBoundingClientRect();if(!a||!b)return;
 const place=()=>{const a=anchor.current?.firstElementChild?.getBoundingClientRect(),b=tip.current?.getBoundingClientRect();if(!a||!b)return;setPosition({left:Math.max(12,Math.min(innerWidth-b.width-12,a.left+(a.width-b.width)/2)),top:Math.max(12,a.top-b.height-10>=12?a.top-b.height-10:Math.min(innerHeight-b.height-12,a.bottom+10))});};place();window.addEventListener('resize',place);return()=>window.removeEventListener('resize',place);},[open]);
 return <span ref={anchor} className="comic-tooltip-anchor" onMouseEnter={()=>setOpen(true)} onMouseLeave={()=>setOpen(false)} onFocus={e=>{if(e.target instanceof Element&&e.target.matches(':focus-visible'))setOpen(true);}} onClickCapture={()=>setOpen(false)} onBlur={()=>setOpen(false)} onKeyDown={e=>{if(e.key==='Escape')setOpen(false);}}>{cloneElement(children,{'aria-describedby':open?id:undefined})}{open&&createPortal(<span id={id} ref={tip} role="tooltip" className="comic-tooltip" style={position}>{content}</span>,document.body)}</span>;
}
