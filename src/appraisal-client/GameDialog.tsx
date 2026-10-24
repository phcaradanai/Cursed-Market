import {createContext, useContext, useEffect, useRef} from 'react';
import type {ReactNode} from 'react';
import {t} from './i18n.js';

export const DialogFeedback=createContext<{busy:boolean;error:string|null;clearError:()=>void;networkMessage?:string|null;reconnect?:(()=>void)|null}|null>(null);

export function GameDialog({open,label,onClose,children,id,className=''}:{open:boolean;label:string;onClose:()=>void;children:ReactNode;id?:string;className?:string}) {
  const panel=useRef<HTMLDialogElement>(null);
  const feedback=useContext(DialogFeedback);
  useEffect(()=>{
    const dialog=panel.current;
    if(!open || !dialog)return;
    const previous=document.activeElement instanceof HTMLElement?document.activeElement:null;
    dialog.showModal();
    return ()=>{dialog.close();if(previous?.isConnected)previous.focus({preventScroll:true});};
  },[open]);
  return <dialog ref={panel} id={id} className={`game-dialog ${className}`} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1} onCancel={e=>{e.preventDefault();onClose();}}>
    <div className="dialog-content">{children}</div>
    {(feedback?.busy || feedback?.error || feedback?.networkMessage) && <div className="dialog-feedback">
      {feedback.networkMessage && <div role="status"><p>{feedback.networkMessage}</p>{feedback.reconnect && <button type="button" onClick={feedback.reconnect}>{t('กลับมาเล่นในแท็บนี้')}</button>}</div>}
      {feedback.error && <div className="error" role="alert"><p>{feedback.error}</p><button type="button" onClick={feedback.clearError}>{t('ปิดข้อความ')}</button></div>}
      {feedback.busy && <p role="status">{t('กำลังส่งการตัดสินใจ รอผลจากพ่อค้า')}</p>}
    </div>}
  </dialog>;
}
