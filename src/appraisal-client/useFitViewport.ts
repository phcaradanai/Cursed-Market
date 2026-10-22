import { useEffect } from 'react';

/** The parts of a screen that may shrink so the page never needs a scrollbar; the HUD and drawers stay full size. */
const FIT_SELECTOR='.screen .phase-banner,.screen .table-stage,.lobby,.entry-layout';
const MIN_FIT=.72;
const MIN_FIT_MODAL=.65;
const MAX_STEPS=4;

/**
 * Scales the table down (CSS `--fit`, applied as `zoom`) until the document fits the window height.
 * Below MIN_FIT, or on a phone-width window, it stops and the page scrolls as usual so text stays readable.
 */
export function useFitViewport():void {
  useEffect(()=>{
    const root=document.documentElement;let frame=0;
    const fitModal=()=>{
      root.style.setProperty('--fit-modal','1');
      const backdrop=document.querySelector<HTMLElement>('.modal-backdrop'),modal=backdrop?.querySelector<HTMLElement>('.modal');
      if(!backdrop||!modal)return;
      let fit=1;
      for(let step=0;step<MAX_STEPS;step++){
        const over=backdrop.scrollHeight-backdrop.clientHeight;
        const height=modal.getBoundingClientRect().height;
        if(over<=1||height<=0)break;
        fit=Math.max(MIN_FIT_MODAL,fit*(height-over)/height);
        root.style.setProperty('--fit-modal',fit.toFixed(3));
        if(fit===MIN_FIT_MODAL)break;
      }
    };
    const measure=()=>{
      frame=0;
      root.style.setProperty('--fit','1');
      if(window.innerWidth<700){root.style.setProperty('--fit-modal','1');return;}
      fitModal();
      let fit=1;
      for(let step=0;step<MAX_STEPS;step++){
        const over=root.scrollHeight-window.innerHeight;
        if(over<=1)break;
        const zoomed=[...document.querySelectorAll<HTMLElement>(FIT_SELECTOR)].reduce((sum,el)=>sum+el.getBoundingClientRect().height,0);
        if(zoomed<=0)break;
        fit=Math.max(MIN_FIT,fit*(zoomed-over)/zoomed);
        root.style.setProperty('--fit',fit.toFixed(3));
        if(fit===MIN_FIT)break;
      }
    };
    const schedule=()=>{if(!frame)frame=window.setTimeout(measure,30);};
    const mutations=new MutationObserver(schedule);
    mutations.observe(document.body,{childList:true,subtree:true});
    window.addEventListener('resize',schedule);
    document.addEventListener('load',schedule,true);
    schedule();
    return()=>{mutations.disconnect();window.removeEventListener('resize',schedule);document.removeEventListener('load',schedule,true);if(frame)clearTimeout(frame);root.style.removeProperty('--fit');root.style.removeProperty('--fit-modal');};
  },[]);
}
