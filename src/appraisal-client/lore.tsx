import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ITEM_SPECS, NPC_SPECS, STATUS_CATALOG, itemFamily, itemImage, priceRange } from '../game/appraisal/content.js';
import type { ItemKind, ItemView, NpcId, StatusId } from '../game/appraisal/types.js';
import { readable, scoreStatusText, statusName } from './model.js';
import { BuffIcon, DebuffIcon } from './icons.js';

type Tone = 'buff'|'debuff'|'item'|'npc';

/**
 * A highlighted name that opens a short card on hover, keyboard focus or tap.
 * `passive` renders a plain span (hover only) for use inside labels and buttons, where nested controls are invalid.
 */
export function Peek({tone,label,card,passive=false}:{tone:Tone;label:ReactNode;card:ReactNode;passive?:boolean}) {
  const id=useId();const anchor=useRef<HTMLElement|null>(null);const box=useRef<HTMLSpanElement>(null);
  const [open,setOpen]=useState(false);const [pos,setPos]=useState<{left:number;top:number}|null>(null);
  const hide=()=>{setOpen(false);setPos(null);};
  useLayoutEffect(()=>{
    if(!open || !anchor.current || !box.current) return;
    const a=anchor.current.getBoundingClientRect(),b=box.current.getBoundingClientRect(),gap=8;
    const top=a.top-b.height-gap>=gap?a.top-b.height-gap:Math.min(a.bottom+gap,window.innerHeight-b.height-gap);
    setPos({top,left:Math.min(Math.max(gap,a.left+a.width/2-b.width/2),window.innerWidth-b.width-gap)});
  },[open]);
  useEffect(()=>{
    if(!open) return;
    const outside=(e:PointerEvent)=>{if(!anchor.current?.contains(e.target as Node)) hide();};
    const key=(e:KeyboardEvent)=>{if(e.key==='Escape') hide();};
    window.addEventListener('scroll',hide,true);window.addEventListener('resize',hide);
    document.addEventListener('pointerdown',outside);document.addEventListener('keydown',key);
    return ()=>{window.removeEventListener('scroll',hide,true);window.removeEventListener('resize',hide);document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',key);};
  },[open]);
  const hover={onPointerEnter:(e:{pointerType:string})=>{if(e.pointerType==='mouse') setOpen(true);},onPointerLeave:(e:{pointerType:string})=>{if(e.pointerType==='mouse') hide();}};
  const popup=<span ref={box} id={id} role="tooltip" className={`peek ${tone}`} hidden={!open} style={pos?{top:pos.top,left:pos.left}:{visibility:'hidden'}}>{card}</span>;
  if(passive) return <span ref={el=>{anchor.current=el;}} className={`term ${tone} passive`} aria-describedby={id} {...hover}>{label}{popup}</span>;
  return <span className="term-wrap"><button ref={el=>{anchor.current=el;}} type="button" className={`term ${tone}`} aria-describedby={id} aria-expanded={open} {...hover}
    onFocus={e=>{if(e.currentTarget.matches(':focus-visible')) setOpen(true);}} onBlur={hide} onClick={()=>setOpen(true)}>{label}</button>{popup}</span>;
}

export function StatusCard({id,survival=false}:{id:StatusId;survival?:boolean}) {
  const spec=STATUS_CATALOG.find(s=>s.id===id)!;const debuff=id.startsWith('D');
  return <>
    <span className="peek-head">{debuff?<DebuffIcon/>:<BuffIcon/>}<strong>{spec.name}</strong><span className="peek-tag">{debuff?'ผลเสีย':'ผลดี'}</span></span>
    <span className="peek-body">{readable(spec.description)}{scoreStatusText(id,survival)}</span>
    <span className="peek-foot">{readable(spec.duration)}</span>
  </>;
}
export function StatusTerm({id,survival=false,passive=false}:{id:StatusId;survival?:boolean;passive?:boolean}) {
  const debuff=id.startsWith('D');
  return <Peek tone={debuff?'debuff':'buff'} passive={passive} label={<>{debuff?<DebuffIcon/>:<BuffIcon/>}{statusName(id)}<span className="sr-only">{debuff?' (ผลเสีย)':' (ผลดี)'}</span></>} card={<StatusCard id={id} survival={survival}/>}/>;
}

const knownText=(item:ItemView)=>{
  const k=item.knowledge;
  return [k.genuine===undefined?'ยังไม่รู้ว่าแท้ไหม':k.genuine?'ของแท้':'ของปลอม',k.cursed===undefined?'ยังไม่รู้เรื่องคำสาป':k.cursed?'มีคำสาป':'ไม่มีคำสาป'].join(' · ');
};
/** Kind-level hints are public; a viewer's ItemView adds only what that viewer already knows. */
export function ItemCard({kind,item}:{kind:ItemKind;item?:ItemView|undefined}) {
  const spec=ITEM_SPECS[kind];const [low,high]=item?.range??priceRange(kind);
  const benefit=itemFamily(kind)==='orb'?`ฟื้นพลัง ${spec.energyRecovery??3}`:statusName(spec.buff);
  return <>
    <img src={itemImage(kind)} alt="" width="72" height="72"/>
    <span className="peek-text">
      <strong>{spec.name}</strong>
      <span>{low===high?`มูลค่าจริง ${low} เครดิต`:`มูลค่าราว ${low}–${high} เครดิต`}</span>
      {item && <span>{knownText(item)}</span>}
      <span>เปิดใช้อาจได้ {benefit} · เสี่ยง {statusName(spec.drawback)}{spec.consumable?' · ใช้แล้วหมด':''}</span>
    </span>
  </>;
}
export function ItemTerm({kind,item,label,passive=false}:{kind:ItemKind;item?:ItemView|undefined;label?:ReactNode;passive?:boolean}) {
  return <Peek tone="item" passive={passive} label={label??ITEM_SPECS[kind].name} card={<ItemCard kind={kind} item={item}/>}/>;
}
export function NpcTerm({npc,label,passive=false}:{npc:NpcId;label?:string;passive?:boolean}) {
  const spec=NPC_SPECS[npc];
  return <Peek tone="npc" passive={passive} label={label??spec.name} card={<><img src={`/art/npc-${npc}.png`} alt="" width="72" height="90"/><span className="peek-text"><strong>{spec.name}</strong><span>{spec.hint}</span></span></>}/>;
}

type Token = {text:string} & ({kind:'status';id:StatusId}|{kind:'item';id:ItemKind}|{kind:'npc';id:NpcId});
const NPC_ALIASES:Record<NpcId,string[]>={orc:['ออร์ก'],vampire:['Vampire','แวมไพร์'],autometa:['Autometa'],alien:['Alien'],darkone:['Dark One'],beast:['สัตว์นำทาง']};
const TOKENS:Token[]=[
  ...STATUS_CATALOG.map(s=>({text:s.name,kind:'status' as const,id:s.id})),
  ...(Object.keys(ITEM_SPECS) as ItemKind[]).map(kind=>({text:ITEM_SPECS[kind].name,kind:'item' as const,id:kind})),
  ...(Object.keys(NPC_SPECS) as NpcId[]).flatMap(npc=>[NPC_SPECS[npc].name,...NPC_ALIASES[npc]].map(text=>({text,kind:'npc' as const,id:npc}))),
].sort((a,b)=>b.text.length-a.text.length);
const LOOKUP=new Map(TOKENS.map(t=>[t.text,t]));
const PATTERN=new RegExp(TOKENS.map(t=>t.text.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'g');

/** Game text with status, item and merchant names highlighted; each opens its short card. */
export function Rich({text,survival=false,passive=false}:{text:string;survival?:boolean;passive?:boolean}) {
  const source=readable(text);const parts:ReactNode[]=[];let last=0;
  for(const match of source.matchAll(PATTERN)) {
    const token=LOOKUP.get(match[0])!;const at=match.index;
    if(at>last) parts.push(source.slice(last,at));
    const key=`${at}-${token.text}`;
    parts.push(token.kind==='status'?<StatusTerm key={key} id={token.id} survival={survival} passive={passive}/>:
      token.kind==='item'?<ItemTerm key={key} kind={token.id} passive={passive}/>:<NpcTerm key={key} npc={token.id} label={token.text} passive={passive}/>);
    last=at+match[0].length;
  }
  if(last<source.length) parts.push(source.slice(last));
  return <>{parts}</>;
}

export interface ChoiceOption { value:string; title:ReactNode; detail?:ReactNode; art?:string; tone?:'quiet'|'danger'|undefined }
/** Selectable cards backed by native radios: keyboard arrows, labels and form semantics stay intact. */
export function ChoiceCards({legend,options,value,onChange,disabled=false,compact=false,hideLegend=false}:{legend:string;options:ChoiceOption[];value:string;onChange:(value:string)=>void;disabled?:boolean;compact?:boolean;hideLegend?:boolean}) {
  const name=useId();
  return <fieldset className={`choice-cards${compact?' compact':''}`} disabled={disabled}>
    <legend className={hideLegend?'sr-only':''}>{legend}</legend>
    <div className="choice-grid">{options.map(option=><label key={option.value} className={`choice-card${option.value===value?' selected':''}${option.tone?` ${option.tone}`:''}${option.art?' has-art':''}`}>
      <input type="radio" name={name} value={option.value} checked={option.value===value} onChange={()=>onChange(option.value)}/>
      {option.art && <img src={option.art} alt="" width="56" height="56"/>}
      <span className="choice-text"><span className="choice-title">{option.title}</span>{option.detail && <span className="choice-detail">{option.detail}</span>}</span>
    </label>)}</div>
  </fieldset>;
}
