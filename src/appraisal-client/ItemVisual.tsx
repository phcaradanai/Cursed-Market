import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { ItemView } from '../game/appraisal/types.js';
import { RARITY_NAMES, THEME_NAMES, resolveAppearance } from '../shared/item-rarity.js';
import { getLang } from './i18n.js';

export function appearanceLabel(item:Pick<ItemView,'appearance'|'rarityPower'>):string {
  const look=item.appearance;if(!look)return '';
  const lang=getLang();return `${RARITY_NAMES[look.rarity][lang]} · ${THEME_NAMES[look.theme][lang]}`+(item.rarityPower?` · ${lang==='th'?'มูลค่า':'Value'} ×${item.rarityPower.valueMultiplier} · effect ×${item.rarityPower.effectMultiplier}`:'');
}
export function RarityLabel({item}:{item:Pick<ItemView,'appearance'|'rarityPower'>}) {
  return item.appearance?<span className="rarity-label">{appearanceLabel(item)}</span>:null;
}
/** A thin React adapter; all rendering/RNG rules are reusable without React. */
export function ItemVisual({item,alt='',className='',width=1254,height=1254,loading='lazy'}:{
  item:Pick<ItemView,'image'|'appearance'|'kind'|'rarityPower'>;alt?:string;className?:string;width?:number;height?:number;loading?:'lazy'|'eager';
}) {
  const ref=useRef<HTMLCanvasElement>(null);const [ready,setReady]=useState(false);
  const appearance=item.appearance,lookKey=appearance?`${appearance.version}:${appearance.rarity}:${appearance.theme}:${appearance.visualSeed}`:'';
  const cutout=item.kind==='key';const imageUrl=cutout?'/art/rarity/key-cutout.png':item.image;
  useEffect(()=>{
    setReady(false);if(!appearance||appearance.rarity==='common'||!ref.current)return;
    let cancelled=false,dispose:(()=>void)|undefined;
    void import('../shared/rarity-renderer.js').then(({createRarityVisual})=>{
      if(cancelled||!ref.current)return;
      const visual=createRarityVisual(ref.current,{imageUrl,appearance,cutout,onReady:()=>{if(!cancelled)setReady(true);},onError:()=>{if(!cancelled)setReady(false);}});dispose=visual.dispose;
    }).catch(()=>{if(!cancelled)setReady(false);});
    return ()=>{cancelled=true;dispose?.();};
  // DTO objects are replaced on every room update; the versioned value key owns lifetime.
  },[lookKey,imageUrl,cutout]);
  if(!appearance||appearance.rarity==='common')return <img src={item.image} alt={alt} className={className||undefined} width={width} height={height} loading={loading}/>;
  const style=resolveAppearance(appearance);
  const css={'--rarity-color':`rgb(${style.primary.map(c=>Math.round(c*255)).join(' ')})`,...(width<200?{width,height}:{})} as CSSProperties;
  return <span className={`item-visual ${className}${ready?' visual-ready':''}`} role={alt?'img':undefined} aria-label={alt?`${alt} · ${appearanceLabel(item)}`:undefined} aria-hidden={!alt||undefined} title={appearanceLabel(item)} style={css}>
    <img src={item.image} alt="" width={width} height={height} loading={loading}/><canvas ref={ref} aria-hidden="true"/>
  </span>;
}
