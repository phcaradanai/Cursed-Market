import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon } from './icons.js';
import { t } from './i18n.js';
import { Book } from './Book.js';

/** Native top-layer dialogs keep focus inside, make the table inert, and restore the opener on close. */
export function GameDialog({title,labelledBy,onClose,children,className='',open=true}:{title?:ReactNode;labelledBy?:string;onClose:()=>void;children:ReactNode;className?:string;open?:boolean}) {
  const ref=useRef<HTMLDialogElement>(null);const id=useId();
  useEffect(()=>{
    const dialog=ref.current;if(!dialog || !open)return;
    const opener=document.activeElement instanceof HTMLElement?document.activeElement:null;
    dialog.showModal();
    const overflow=document.body.style.overflow;document.body.style.overflow='hidden';
    const shield=(event:KeyboardEvent)=>{if(event.key==='Escape' && dialog.contains(event.target as Node))event.stopPropagation();};
    document.addEventListener('keydown',shield);
    return ()=>{document.removeEventListener('keydown',shield);dialog.close();document.body.style.overflow=overflow;if(opener?.isConnected)opener.focus({preventScroll:true});};
  },[open]);
  const content=<dialog ref={ref} className={`game-dialog ${className}`} role="dialog" aria-modal="true" aria-labelledby={labelledBy??id} onCancel={e=>{e.preventDefault();onClose();}}>
    {title!==undefined && <header className="game-dialog-head"><h2 id={id}>{title}</h2><button type="button" aria-label={t('ปิดรายละเอียด')} onClick={onClose}><CloseIcon/></button></header>}
    <Book className="game-dialog-body">{children}</Book>
  </dialog>;
  return typeof document==='undefined'?content:createPortal(content,document.body);
}
