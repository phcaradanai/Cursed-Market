import type {ButtonHTMLAttributes,ReactNode} from 'react';
import {GameDialog} from './GameDialog.js';
import {CloseIcon} from './icons.js';
import {pick} from './i18n.js';

/** Shared utility window, controls and visual language for every comic menu. */
export function ComicButton({tone='secondary',className='',...props}:ButtonHTMLAttributes<HTMLButtonElement>&{tone?:'primary'|'secondary'}) {
  return <button type="button" {...props} className={`comic-button comic-button-${tone} ${className}`}/>;
}
/** A reusable in-world destination sign, rather than a toolbar tab. */
export function ComicDestination({icon,label,caption,count,selected,...props}:{icon:ReactNode;label:string;caption:string;count?:number;selected:boolean}&ButtonHTMLAttributes<HTMLButtonElement>) {
  return <ComicButton {...props} className="comic-destination" aria-pressed={selected}>{count!==undefined&&<span className="comic-destination-count">{count}</span>}<span className="comic-destination-icon">{icon}</span><strong>{label}</strong><small>{caption}</small><span className="comic-destination-arrow" aria-hidden="true">›</span></ComicButton>;
}
export function CompactPager({page,pages,onChange,label,className=''}:{page:number;pages:number;onChange:(page:number)=>void;label:string;className?:string}) {
  return <nav className={`comic-pagination ${className}`} aria-label={label}>
    <ComicButton aria-label={pick('ก่อนหน้า','Previous')} disabled={page<=0} onClick={()=>onChange(page-1)}>‹</ComicButton>
    <span aria-live="polite">{page+1} / {pages}</span>
    <ComicButton aria-label={pick('ถัดไป','Next')} disabled={page>=pages-1} onClick={()=>onChange(page+1)}>›</ComicButton>
  </nav>;
}
export function ComicMeter({value,max,label}:{value:number;max:number;label:string}) {
  return <meter className="comic-meter" min={0} max={max} value={value} aria-label={label}/>;
}
export function ComicMenu({id,open,title,icon,action,onClose,children,className='',modal=false}:{id:string;open:boolean;modal?:boolean;title:string;icon?:ReactNode;action?:ReactNode;onClose:()=>void;children:ReactNode;className?:string}) {
  return <GameDialog id={id} modal={modal} open={open} label={title} onClose={onClose} className={`drawer utility-panel comic-menu ${className}`}>
    <header className="drawer-head"><h2>{icon}{title}</h2><div className="comic-menu-actions">{action}<ComicButton className="drawer-close" aria-label={`${pick('ปิด','Close')} ${title}`} onClick={onClose}><CloseIcon/><span>{pick('ปิด','Close')}</span></ComicButton></div></header>
    <div className="drawer-body">{children}</div>
  </GameDialog>;
}
export function EffectEmblem({danger}:{danger:boolean}) {
  return <svg className="comic-emblem" viewBox="0 0 100 112" aria-hidden="true">
    {danger?<><path d="M50 4 62 10 75 9 81 21 93 28 91 43 98 56 91 69 93 83 79 90 72 103 58 102 47 109 35 102 21 102 16 88 5 81 8 65 2 53 9 40 7 26 21 20 28 8 42 10Z" fill="#b71330" stroke="#080a0b" strokeWidth="5"/><circle cx="50" cy="56" r="35" fill="#151315" stroke="#f32948" strokeWidth="4"/><path d="M49 22C60 40 43 43 57 55c0-12 8-14 10-23 28 31 17 61-14 64-27-1-39-25-23-44 0 15 11 19 12 11C32 46 49 41 49 22Z" fill="#e61f39" stroke="#080a0b" strokeWidth="3"/></>:<><path d="M50 4C38 15 20 21 7 23v35c0 23 20 41 43 51 23-10 43-28 43-51V23C76 20 60 14 50 4Z" fill="#131719" stroke="#080a0b" strokeWidth="5"/><path d="M50 13c-11 9-24 14-34 16v29c0 18 16 33 34 43 19-10 34-25 34-43V29C72 26 60 21 50 13Z" fill="#dddcd2" stroke="#f5f1e6" strokeWidth="3"/><path d="M50 22v68c-15-10-25-20-25-34V35c10-3 17-7 25-13Z" fill="#3c4448"/><path d="m30 53 14 14 28-30" fill="none" stroke="#0b1013" strokeWidth="8"/><path d="m26 30 9 10m31 34 8 10M55 27l8 3" stroke="#fff" strokeWidth="2"/></>}
  </svg>;
}

/** Main phase destinations reuse the menu frame without a dismiss action. */
export function ComicPhaseFrame({title,icon,tools,children,footer,className=''}:{title:string;icon?:ReactNode;tools?:ReactNode;children:ReactNode;footer?:ReactNode;className?:string}) {
  return <section className={`comic-main-frame comic-phase-frame ${className}`} aria-label={title}>
    <header className="comic-frame-header"><h2>{icon}{title}</h2><div className="comic-menu-actions">{tools}</div></header>
    {children}{footer&&<footer className="comic-phase-footer">{footer}</footer>}
  </section>;
}
