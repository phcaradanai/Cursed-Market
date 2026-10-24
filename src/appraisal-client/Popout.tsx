import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { GameDialog } from './GameDialog.js';

/**
 * Secondary table panels live behind a button so the table itself never has to scroll. The panel stays
 * mounted (its state survives), the button only appears while the panel actually renders something, and
 * `auto` pops it open when it needs an answer (a theft duel, for example).
 */
export function Popout({label,badge,hot=false,auto=false,className='',children}:{label:string;badge?:number|undefined;hot?:boolean;auto?:boolean;className?:string;children:ReactNode}) {
  const [open,setOpen]=useState(false);const body=useRef<HTMLDivElement>(null);const [has,setHas]=useState(false);
  useEffect(()=>{const el=body.current;if(el)setHas(el.childElementCount>0);});
  useEffect(()=>{if(auto)setOpen(true);},[auto]);
  return <>
    {has && <button type="button" className={`popout-btn${hot?' hot':''} ${className}`} onClick={()=>setOpen(true)}>{label}{badge?<span className="hud-count">{badge}</span>:null}</button>}
    <GameDialog open={open} title={label} onClose={()=>setOpen(false)} className="popout-dialog"><div ref={body} className="popout-body">{children}</div></GameDialog>
  </>;
}
