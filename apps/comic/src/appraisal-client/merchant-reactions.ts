import {useLayoutEffect,useRef,useState} from 'react';
import type {AppraisalView,ItemView} from '../game/appraisal/types.js';
import type {NpcMood} from '../game/appraisal/content.js';

export const PORTAL_REACTION_MS=650;
export function portalMood(selectedId:string|null,portalId:string):NpcMood {
 return selectedId===null?'idle':selectedId===portalId?'smile':'angry';
}
export function appraisalMood(accepted:ItemView['appraisalAccepted']|undefined):NpcMood {
 return accepted===true?'smile':accepted===false?'angry':'idle';
}
/** Only an observed, server-confirmed entry can replay the previous portals. */
export function confirmedPortalReaction(before:AppraisalView,after:AppraisalView):AppraisalView|null {
 const selected=after.self.selectedPortalId;
 if(before.self.id!==after.self.id||before.encounter!==after.encounter||before.phase!=='PORTALS'||!['PORTALS','APPRAISAL'].includes(after.phase)||before.self.selectedPortalId!==null||selected===null||after.self.life===0||after.self.paused||after.theft?.duels.some(d=>d.status==='open'))return null;
 if(!before.self.portals.some(p=>p.id===selected&&!p.disabled))return null;
 return {...before,self:{...before.self,selectedPortalId:selected,done:true}};
}
export function usePortalReaction(game:AppraisalView):AppraisalView|null {
 const previous=useRef(game),timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const [reaction,setReaction]=useState<AppraisalView|null>(null);
 useLayoutEffect(()=>{
  const before=previous.current;previous.current=game;
  const next=confirmedPortalReaction(before,game);
  if(next&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
   if(timer.current!==null)clearTimeout(timer.current);
   setReaction(next);timer.current=setTimeout(()=>{setReaction(null);timer.current=null;},PORTAL_REACTION_MS);
  }
 },[game]);
 useLayoutEffect(()=>()=>{if(timer.current!==null)clearTimeout(timer.current);},[]);
 const valid=reaction&&reaction.self.id===game.self.id&&reaction.encounter===game.encounter&&['PORTALS','APPRAISAL'].includes(game.phase)&&game.self.life!==0&&!game.self.paused&&!game.theft?.duels.some(d=>d.status==='open');
 return valid?reaction:null;
}
