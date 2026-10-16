import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { npcImage } from '../game/appraisal/content.js';
import { TRUST_CAP } from '../game/appraisal/market-contracts.js';
import { ENERGY_DEAL_NPCS, PULSE_RULES, TRUST_RULES, lifeDealTerms } from '../game/appraisal/pulse.js';
import { PROVENANCE_PERCENT } from '../game/appraisal/scoring.js';
import type { AppraisalView, ItemView, NpcId } from '../game/appraisal/types.js';
import { npcName } from './catalog-text.js';
import { AppraiseIcon, BonusIcon, CoinIcon, EyeIcon, RebateIcon, SealIcon, ShardIcon, StackIcon, TicketIcon, TrustIcon } from './icons.js';
import { t } from './i18n.js';
import { NpcTerm, Peek } from './lore.js';
import { npcAcceptanceChance } from './model.js';

/** Seat ids to display names, provided once by the table so any card can say who appraised an item. */
export const SeatNames=createContext<Record<string,string>>({});
export const useSeatName=()=>{const names=useContext(SeatNames);return (id:string)=>names[id]??t('นักประเมิน');};

/** A rule shown as a small picture; the conditions to earn or use it open on hover, focus or tap. */
export function RuleHint({label,icon,title,lines,foot,passive=false}:{label:ReactNode;icon:ReactNode;title:string;lines:string[];foot?:string|undefined;passive?:boolean}) {
  return <Peek tone="rule" passive={passive} label={label} card={<>
    <span className="peek-head">{icon}<strong>{title}</strong></span>
    {lines.map(line=><span key={line} className="peek-body">{line}</span>)}
    {foot && <span className="peek-foot">{foot}</span>}
  </>}/>;
}

function Slots({count,total,icon}:{count:number;total:number;icon:ReactNode}) {
  return <span className="slots" aria-hidden="true">{Array.from({length:total},(_,i)=><span key={i} className={`slot${i<count?' on':''}`}>{icon}</span>)}</span>;
}

export function TicketMeter({game}:{game:AppraisalView}) {
  if(!game.brokerage) return null;
  const count=game.self.darkTickets??0,need=TRUST_RULES.ticketsToForce;
  return <RuleHint icon={<TicketIcon/>} title={t('ตั๋วคำสั่งมืด {n}/{need}',{n:Math.min(count,need),need})}
    lines={[t('ได้จาก: ชนะประมูลของใน Dark Market ครั้งละ 1 ใบ'),t('ใช้: ครบ {need} ใบ บังคับซื้อของในร้านที่เพื่อนเปิดไว้ ตามราคาประเมิน เจ้าของปฏิเสธหรือต่อรองไม่ได้',{need})]}
    foot={count>=need?t('พร้อมใช้ในช่วงต่อรอง'):t('ขาดอีก {n} ใบ',{n:need-count})}
    label={<span className={`meter tickets${count>=need?' ready':''}`}><TicketIcon/><span className="meter-name">{t('ตั๋วมืด')}</span><Slots count={count} total={need} icon={<TicketIcon/>}/><span className="meter-count">{Math.min(count,need)}/{need}{count>need?` +${count-need}`:''}</span></span>}/>;
}

export function ShardMeter({game}:{game:AppraisalView}) {
  const pulse=game.self.pulse;if(!game.survival || !pulse) return null;
  const per=pulse.perLife,cap=PULSE_RULES.bankCap;
  return <RuleHint icon={pulse.wary?<EyeIcon/>:<ShardIcon/>} title={t('เศษชีพจร {n}/{per}',{n:Math.min(pulse.shards,per),per})}
    lines={[t('ได้จาก: ซื้อของที่เพื่อนประเมิน ครั้งละ {gain} เศษ',{gain:pulse.perSale}),t('ครบ {per} เศษ ฟื้นชีวิต 1 ทันที เศษที่เหลือเก็บได้ไม่เกิน {cap}',{per,cap}),
      ...(pulse.wary?[t('พ่อค้าเริ่มสงสัย: ซื้อจากคนเดิมคนเดียวนานเกินไป จะไม่ได้เศษ จนกว่าจะซื้อกับคนใหม่')]:[])]}
    foot={pulse.wary?t('ตอนนี้ไม่ได้เศษ'):t('ชีวิตเต็มจะเก็บเศษไว้ก่อน')}
    label={<span className={`meter shards${pulse.wary?' wary':''}`}>{pulse.wary?<EyeIcon/>:<ShardIcon/>}<span className="meter-name">{t('เศษชีพจร')}</span><Slots count={pulse.shards} total={per} icon={<ShardIcon/>}/><span className="meter-count">{Math.min(pulse.shards,per)}/{per}{pulse.shards>per?` +${pulse.shards-per}`:''}</span>{pulse.wary && <span className="sr-only">{t('พ่อค้าสงสัย ไม่ได้เศษ')}</span>}</span>}/>;
}

/** The last three purchases of goods other seats appraised, as merchant portraits; three of one merchant pay trust. */
export function BuyStack({game}:{game:AppraisalView}) {
  if(!game.self.npcTrust) return null;
  const log=game.self.buyLog??[],total=TRUST_RULES.repeatBuys;
  const pair=log.length===total-1 && log.every(entry=>entry===log[0]);
  return <RuleHint icon={<StackIcon/>} title={t('ซื้อต่อเนื่อง {n}/{total}',{n:log.length,total})}
    lines={[t('นับเมื่อซื้อของที่เพื่อนประเมิน ช่องแสดงพ่อค้าของ {total} ครั้งล่าสุด',{total}),t('ซื้อจากพ่อค้าคนเดียวกันครบ {total} ครั้งติด ไว้ใจพ่อค้านั้น +{trust} แล้วเริ่มนับใหม่',{total,trust:TRUST_RULES.repeatBuyTrust}),
      ...(pair?[t('ซื้อจาก {name} อีกครั้ง ได้ไว้ใจ +{trust}',{name:npcName(log[0]!),trust:TRUST_RULES.repeatBuyTrust})]:[])]}
    foot={log.length?t('ซื้อคนละพ่อค้าจะไม่นับต่อ แต่ยังเห็นย้อนหลัง'):t('ยังไม่เคยซื้อของที่เพื่อนประเมิน')}
    label={<span className={`meter stack${pair?' streak':''}`}><StackIcon/><span className="meter-name">{t('ซื้อล่าสุด')}</span>
      <span className="chips">{Array.from({length:total},(_,i)=>{const npc=log[i];return npc
        ?<span key={i} className="chip" title={npcName(npc)}><img src={npcImage(npc)} alt="" width="28" height="28"/><span className="sr-only">{npcName(npc)}</span></span>
        :<span key={i} className="chip empty" aria-hidden="true"/>;})}</span>
      <span className="meter-count">{log.length}/{total}</span></span>}/>;
}

/** Tickets, shards and the purchase stack share one strip so the new rules read at a glance. */
export function Fortune({game}:{game:AppraisalView}) {
  const parts=[TicketMeter({game}),ShardMeter({game}),BuyStack({game})];
  if(!parts.some(Boolean)) return null;
  return <div className="fortune" role="group" aria-label={t('สิ่งที่สะสมจากการซื้อขาย')}>{parts.map((part,i)=>part && <div key={i} className="fortune-item">{part}</div>)}</div>;
}

function trustLines(game:AppraisalView,npc:NpcId,level:number):string[] {
  const lines=[t('ไว้ใจ {n}/{cap} · ต่อรองราคาต่ำสำเร็จง่ายขึ้น +{chance} จุดเปอร์เซ็นต์',{n:level,cap:TRUST_CAP,chance:npcAcceptanceChance(game,npc)})];
  if(game.survival) {
    const terms=lifeDealTerms(level);
    lines.push(ENERGY_DEAL_NPCS.includes(npc)?t('ดีลฟื้นพลัง: ไม่ต้องใช้ความไว้ใจ'):terms?t('ดีลฟื้นชีวิต: จ่าย {credits} ฟื้น {min}-{max}',{credits:terms.credits,min:terms.min,max:terms.max}):t('ดีลฟื้นชีวิต: ยังไม่เปิดจนกว่าจะไว้ใจ 1'));
  }
  lines.push(t('เพิ่มเมื่อ: ขายของของ {name} ที่คุณประเมินให้เพื่อน · ซื้อของ {name} ที่เพื่อนประเมินครบ {total} ครั้งติด',{name:npcName(npc),total:TRUST_RULES.repeatBuys}),t('ลดเมื่อ: ประเมินกดราคาแล้วถูกจับได้ −{n}',{n:TRUST_RULES.caughtLoss}));
  return lines;
}

/** One disc per merchant in play: trusting them all lays extra goods in every shop you enter. */
export function TrustRing({game}:{game:AppraisalView}) {
  const bonus=game.self.stockBonus,trust=game.self.npcTrust;if(!bonus || !trust) return null;
  const met=bonus.npcs.filter(npc=>(trust[npc]??0)>=bonus.need).length;
  return <section className="trust-ring" aria-label={t('ความไว้ใจพ่อค้า')}>
    <ul className="discs">{bonus.npcs.map(npc=>{const level=trust[npc]??0,ok=level>=bonus.need;
      return <li key={npc}><RuleHint icon={<TrustIcon/>} title={`${npcName(npc)} · ${t('ไว้ใจ {n}/{cap}',{n:level,cap:TRUST_CAP})}`} lines={trustLines(game,npc,level)} foot={ok?t('ไว้ใจพอสำหรับโบนัสของในร้านแล้ว'):t('ต้องไว้ใจอย่างน้อย {need} เพื่อรับโบนัสของในร้าน',{need:bonus.need})}
        label={<span className={`disc${ok?' met':''}`}><img src={npcImage(npc)} alt="" width="44" height="44"/><span className="level">{level}</span><span className="sr-only">{`${npcName(npc)} ${level}/${TRUST_CAP}`}</span></span>}/></li>;})}
    </ul>
    <RuleHint icon={<BonusIcon/>} title={t('โบนัสของในร้าน')} lines={[t('ไว้ใจพ่อค้าทุกคนอย่างน้อย {need} ร้านที่คุณเข้าจะเพิ่มของให้ {extra} ชิ้น',{need:bonus.need,extra:1}),t('ได้ไม่เพิ่มอีกแม้ไว้ใจสูงขึ้น')]}
      foot={bonus.extra>0?t('ได้รับแล้ว'):t('ไว้ใจครบแล้ว {met}/{total}',{met,total:bonus.npcs.length})}
      label={<span className={`reward${bonus.extra>0?' on':''}`}><BonusIcon/><span>{bonus.extra>0?t('ของเพิ่ม +{n}',{n:bonus.extra}):t('ไว้ใจครบ {met}/{total}',{met,total:bonus.npcs.length})}</span></span>}/>
  </section>;
}

export function SealBadge({game,item,passive=false,compact=false}:{game:AppraisalView;item:ItemView;passive?:boolean;compact?:boolean}) {
  const name=useSeatName();
  if(!game.survival || item.appraisedBy===undefined || item.appraisedBy===game.self.id) return null;
  return <RuleHint passive={passive} icon={<SealIcon/>} title={t('ตราผู้ประเมิน +{pct}%',{pct:PROVENANCE_PERCENT})}
    lines={[t('{name} ประเมินของชิ้นนี้ไว้ Collector ให้มูลค่าเพิ่ม {pct}% ตอนจบ',{name:name(item.appraisedBy),pct:PROVENANCE_PERCENT}),t('ของที่คุณประเมินเองไม่มีตรา')]}
    label={<span className={`badge seal${compact?' compact':''}`}><SealIcon/>{compact?<span className="sr-only">{t('ตรา +{pct}%',{pct:PROVENANCE_PERCENT})}</span>:t('ตรา +{pct}%',{pct:PROVENANCE_PERCENT})}</span>}/>;
}
export function RebateBadge({rebate,passive=false}:{rebate:number;passive?:boolean}) {
  return <RuleHint passive={passive} icon={<RebateIcon/>} title={t('ค่าแถม {n} เครดิต',{n:rebate})}
    lines={[t('ผู้ขายจ่ายให้ผู้ซื้อเมื่อขายสำเร็จ ช่วยให้ขายของที่ขายยากได้'),t('ผู้ซื้อรับความเสี่ยงของแลกกับเครดิตนี้')]}
    label={<span className="badge rebate"><RebateIcon/>{t('แถม {n}',{n:rebate})}</span>}/>;
}
export function BonusBadge({passive=false}:{passive?:boolean}) {
  return <RuleHint passive={passive} icon={<BonusIcon/>} title={t('ของโบนัสความไว้ใจ')}
    lines={[t('พ่อค้าเพิ่มของชิ้นนี้ให้ เพราะคุณไว้ใจพ่อค้าทุกคน')]}
    label={<span className="badge bonus"><BonusIcon/>{t('โบนัส')}</span>}/>;
}

/** Where an item came from and what it cost: the merchant's own price, or the appraiser's, and what you paid. */
export function Provenance({game,item,rebate}:{game:AppraisalView;item:ItemView;rebate?:number|undefined}) {
  const name=useSeatName();const by=item.appraisedBy,other=by!==undefined && by!==game.self.id;
  return <ul className="prov" aria-label={t('ที่มาและราคา')}>
    <li><NpcTerm npc={item.npc} label={<><img src={npcImage(item.npc)} alt="" width="28" height="28"/><span>{npcName(item.npc)}</span></>}/></li>
    {other
      ?<li className="price appraised"><RuleHint icon={<AppraiseIcon/>} title={t('ราคาประเมิน')} lines={[t('{name} ประเมินและพ่อค้า{verdict}',{name:name(by),verdict:item.appraisalAccepted?t('ยอมรับ'):t('ไม่ยอมรับ')}),t('ราคาที่พ่อค้าตั้งเดิมคือ {n} เครดิต',{n:item.ask})]}
          label={<span><AppraiseIcon/><span className="price-name">{t('{name} ประเมิน',{name:name(by)})}</span><strong>{item.appraisal??'—'}</strong></span>}/></li>
      :<li className="price base"><RuleHint icon={<CoinIcon/>} title={t('ราคาที่พ่อค้าตั้ง')} lines={[t('ราคาหน้าร้านของพ่อค้า ก่อนมีการประเมินหรือต่อรอง')]}
          label={<span><CoinIcon/><span className="price-name">{t('พ่อค้าตั้ง')}</span><strong>{item.ask}</strong></span>}/></li>}
    {by===game.self.id && item.appraisal!==null && <li className="price mine"><AppraiseIcon/><span className="price-name">{t('คุณประเมิน')}</span><strong>{item.appraisal}</strong></li>}
    {item.paid!==undefined && <li className="price paid"><RuleHint icon={<CoinIcon/>} title={t('ราคาที่คุณซื้อมา')} lines={[t('รวมค่าพ่อค้าและค่าแนะนำ หักค่าแถมที่ผู้ขายคืนให้แล้ว')]}
          label={<span><CoinIcon/><span className="price-name">{t('ซื้อมา')}</span><strong>{item.paid}</strong></span>}/></li>}
    {other && <li><SealBadge game={game} item={item}/></li>}
    {item.bonus && <li><BonusBadge/></li>}
    {!!rebate && <li><RebateBadge rebate={rebate}/></li>}
  </ul>;
}
