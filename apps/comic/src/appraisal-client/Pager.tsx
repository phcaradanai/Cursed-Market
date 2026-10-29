import { Children, useState } from 'react';
import type { ReactNode } from 'react';
import { t } from './i18n.js';

/** One card at a time with prev/next, so a long list never makes the table scroll. Hidden cards stay mounted, so typed values survive paging. */
export function Pager({children,label}:{children:ReactNode;label:string}) {
  const items=Children.toArray(children);const [at,setAt]=useState(0);
  const n=items.length;if(!n)return null;
  const cur=Math.min(at,n-1);
  return <div className="pager">
    {items.map((item,k)=><div key={k} className="pager-page" hidden={k!==cur}>{item}</div>)}
    {n>1 && <div className="pager-nav" role="group" aria-label={label}>
      <button type="button" aria-label={t('ก่อนหน้า')} title={cur===0?t('อยู่หน้าแรกแล้ว'):t('ก่อนหน้า')} disabled={cur===0} onClick={()=>setAt(cur-1)}>‹</button>
      <span aria-live="polite">{cur+1} / {n}</span>
      <button type="button" aria-label={t('ถัดไป')} title={cur===n-1?t('อยู่หน้าสุดท้ายแล้ว'):t('ถัดไป')} disabled={cur===n-1} onClick={()=>setAt(cur+1)}>›</button>
    </div>}
  </div>;
}
