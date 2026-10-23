import { useState } from 'react';
import type { AppraisalView, ItemView, NpcId } from '../game/appraisal/types.js';
import { npcImage } from '../game/appraisal/content.js';
import { reducibleCooldown } from '../game/appraisal/ability-rules.js';
import { npcName, statusDescription, statusName } from './catalog-text.js';
import { ChoiceCards } from './lore.js';
import { activationBlock, type Decision } from './model.js';
import { useLang } from './i18n.js';
import { abilityDescription, abilityItemFacts, abilityItemLabel, abilityName, abilityReadiness, abilityReason, abilityText as text } from './ability-text.js';

interface AbilityProps {game:AppraisalView;submit:(action:Decision)=>void;disabled:boolean}
const touch={minHeight:44};

/** One focused ability at a time; the other merchants remain a compact readiness ledger. */
export function MerchantAbilities({game,submit,disabled}:AbilityProps) {
  useLang();
  const abilities=game.self.merchantAbilities??[];
  const [selected,setSelected]=useState<NpcId|null>(null);
  const [target,setTarget]=useState<{npc:NpcId;id:string}|null>(null);
  const [choice,setChoice]=useState('');
  if(!game.trustAbilities || !['APPRAISAL','TRADE'].includes(game.phase) || abilities.length===0)return null;
  const pending=game.self.abilityChoice;
  const currentNpc=game.self.portals.find(p=>p.id===game.self.selectedPortalId)?.npc;
  const ability=abilities.find(a=>a.npc===selected)??abilities.find(a=>a.npc===currentNpc)??abilities[0]!;
  const itemTargets=[...game.self.stock,...game.self.inventory].filter(i=>ability.itemIds.includes(i.id));
  const targetId=target?.npc===ability.npc?target.id:'';
  const validItem=itemTargets.some(i=>i.id===targetId);
  const validStatus=ability.statusIds.some(id=>id===targetId);
  const hasTarget=ability.target==='none' || (ability.target==='debuff'?validStatus:validItem);
  const reason=abilityReason(ability);
  const choices=(game.self.abilityChoices??[]).filter(i=>pending?.itemIds.includes(i.id));
  const choiceId=choices.some(i=>i.id===choice)?choice:'';
  return <details className="merchant-abilities inventory" key={pending?'choice':'abilities'} open={pending?true:undefined}>
    <summary style={touch}><h2>{text('พันธะพ่อค้า','Merchant bonds')} <span>{pending?text('เลือกของทดแทน','Choose a replacement'):text('{n} พร้อมใช้','{n} ready',{n:abilities.filter(a=>a.ready).length})}</span></h2></summary>
    <p className="supporting">{text('ใช้ความสามารถพ่อค้าได้รวม 1 ครั้งต่อการพบ · เวลารอนับตามการพบพ่อค้า ไม่ใช่เวลาจริง','Use one merchant ability per encounter. Cooldowns count encounters, not real time.')}</p>
    {pending?<div className="ability-choice">
      <h3>{text('ข้อเสนอจาก {name}','Offers from {name}',{name:npcName(pending.npc)})}</h3>
      <p>{pending.npc==='alien'?text('เลือกของที่จะรับแทนต้นฉบับ การแลกจะเกิดขึ้นเมื่อยืนยัน','Choose the item to receive for your original. The exchange happens when you confirm.'):text('เลือกของที่จะมาแทนช่องเดิม ยังต้องซื้อด้วยกติกาปกติ','Choose the replacement for this shop slot. Normal purchase rules still apply.')}</p>
      <p className="supporting">{text('ข้อเสนอชุดนี้คงเดิมจนเลือก ไม่สามารถปิดเพื่อสุ่มใหม่','These offers stay until you choose. Closing this panel does not reroll them.')}</p>
      {choices.length?<><ChoiceCards legend={text('เลือกของทดแทน','Choose a replacement')} value={choiceId} onChange={setChoice} disabled={disabled} options={choices.map(item=>({value:item.id,title:abilityItemLabel(item),art:item.image,item,detail:abilityItemFacts(item,pending.npc==='beast')}))}/>
        <button style={touch} disabled={disabled || !choiceId} title={disabled?text('รอคำสั่งก่อนหน้า','Wait for the previous action'):!choiceId?text('เลือกของทดแทนก่อน','Choose a replacement first'):undefined} onClick={()=>submit({type:'merchant-ability',npc:pending.npc,choiceId})}>{text('ยืนยันของทดแทน','Confirm replacement')}</button></>:<p role="status">{text('กำลังรอข้อเสนอจากพ่อค้า','Waiting for the merchant’s offers.')}</p>}
    </div>:<>
      <ChoiceCards legend={text('เลือกพ่อค้าเพื่อดูความสามารถ','Choose a merchant ability')} compact value={ability.npc} onChange={npc=>{setSelected(npc as NpcId);setTarget(null);}} options={abilities.map(a=>({value:a.npc,title:npcName(a.npc),art:npcImage(a.npc),detail:text('เชื่อใจ {trust} · {state}','Trust {trust} · {state}',{trust:a.trust,state:abilityReadiness(a)})}))}/>
      <div className="ability-focus">
        <h3>{abilityName(ability)}</h3><p>{abilityDescription(ability)}</p>
        <p className="trust-note">{ability.trust<1?text('ปลดล็อกเมื่อเชื่อใจ 1 · ขั้นถัดไปที่ 3 และ 6','Unlock at trust 1; upgrade at trust 3 and 6'):text('ระดับ {tier} · ขั้นความเชื่อใจ 1 / 3 / 6','Tier {tier} · Trust thresholds: 1 / 3 / 6',{tier:ability.tier+1})} · {text('เวลารอหลังใช้ {n} การพบ','Cooldown after use: {n} encounters',{n:ability.cooldown})}</p>
        {ability.target==='debuff'?<ChoiceCards legend={text('เลือกผลเสียที่จะลบ','Choose a debuff to remove')} value={targetId} onChange={id=>setTarget({npc:ability.npc,id})} disabled={disabled || !ability.ready} options={ability.statusIds.map(id=>({value:id,title:statusName(id),detail:statusDescription(id),tone:'danger'}))}/>:ability.target!=='none' && <ChoiceCards legend={ability.target==='stock'?text('เลือกสินค้าในร้าน','Choose a shop item'):text('เลือกของที่คุณเก็บไว้','Choose a held item')} value={targetId} onChange={id=>setTarget({npc:ability.npc,id})} disabled={disabled || !ability.ready} options={itemTargets.map(item=>({value:item.id,title:abilityItemLabel(item),art:item.image,item,detail:abilityItemFacts(item,ability.target==='stock')}))}/>}
        {reason && <p className="why" role="status">{reason}</p>}
        {ability.ready && !hasTarget && <p className="supporting">{text('เลือกเป้าหมายก่อนใช้ความสามารถ','Choose a target before using the ability.')}</p>}
        <button style={touch} disabled={disabled || !ability.ready || !hasTarget} title={disabled?text('รอคำสั่งก่อนหน้า','Wait for the previous action'):reason??(!hasTarget?text('เลือกเป้าหมายก่อน','Choose a target first'):undefined)} onClick={()=>{if(ability.target==='debuff'){const statusId=ability.statusIds.find(id=>id===targetId);if(statusId)submit({type:'merchant-ability',npc:ability.npc,statusId});}else submit({type:'merchant-ability',npc:ability.npc,...(ability.target==='none'?{}:{itemId:targetId})});}}>{text('ใช้ {name}','Use {name}',{name:abilityName(ability)})}</button>
      </div>
    </>}
  </details>;
}

/** Targeted cooldown items use radio cards instead of hiding a target in a generic activate button. */
export function AbilityItemControls({game,item,submit,disabled}:AbilityProps&{item:ItemView}) {
  useLang();
  const [source,setSource]=useState<NpcId|null>(null);
  const [destination,setDestination]=useState<NpcId|null>(null);
  if(!game.trustAbilities || !['chrono-gear','burden-hourglass','shifting-compass'].includes(item.kind))return null;
  const transfer=item.kind==='burden-hourglass';
  const compass=item.kind==='shifting-compass';
  const abilities=game.self.merchantAbilities??[];
  const cooling=abilities.filter(a=>a.trust>=1 && reducibleCooldown(game.self,a.npc,game.encounter)>0);
  const selectedSource=cooling.find(a=>a.npc===source);
  const destinations=abilities.filter(a=>a.trust>=1 && a.remaining>0 && a.npc!==source);
  const selectedDestination=destinations.find(a=>a.npc===destination);
  const blocked=activationBlock(game,item.id,disabled);
  const ready=compass || (!!selectedSource && (!transfer || !!selectedDestination));
  const selectOptions=(rows:typeof abilities)=>rows.map(a=>({value:a.npc,title:npcName(a.npc),detail:text('เวลารอเหลือ {n} การพบ','{n} encounters remaining',{n:a.remaining})}));
  return <div className="ability-item-controls">
    <p>{compass?text('ใช้แล้วหมด · การเปลี่ยนสินค้าด้วยสัตว์นำทางครั้งถัดไปมีตัวเลือกเพิ่ม 1 ชิ้น สูงสุด 5 ชิ้น','Consumed on use. The next Beast replacement offers one extra choice, up to five.'):transfer?text('เปิดใช้ได้ช่วงละครั้ง · ย้ายเวลารอ {n} การพบจากสกิลหนึ่งไปเพิ่มให้อีกสกิลที่กำลังรอ','Use once per encounter. Transfer {n} encounter of cooldown from one cooling ability to another.',{n:item.copy?0.4:1}):text('ใช้แล้วหมด · ลดเวลารอของสกิลที่เลือก {n} การพบ ชนิดนี้ใช้ได้ครั้งเดียวต่อช่วง','Consumed on use. Reduce one ability’s remaining cooldown by {n} encounter. This item kind works once per encounter.',{n:item.copy?0.4:1})}</p>
    {!compass && <ChoiceCards legend={transfer?text('ลดเวลารอของสกิล','Reduce cooldown on'):text('เลือกสกิลที่จะเร่ง','Choose an ability to accelerate')} value={selectedSource?.npc??''} onChange={npc=>{setSource(npc as NpcId);if(destination===npc)setDestination(null);}} disabled={disabled || !!blocked} options={selectOptions(cooling)}/>}
    {transfer && selectedSource && <ChoiceCards legend={text('เพิ่มเวลารอให้สกิล','Add cooldown to')} value={selectedDestination?.npc??''} onChange={npc=>setDestination(npc as NpcId)} disabled={disabled || !!blocked} options={selectOptions(destinations)}/>}
    {!compass && <p className="supporting">{text('เร่งได้ไม่เกินครึ่งหนึ่งของเวลารอพื้นฐาน และใช้สกิลเดิมซ้ำในการพบเดียวกันไม่ได้','At most half the base cooldown can be removed. The same ability cannot be used twice in one encounter.')}</p>}
    {!compass && cooling.length===0 && <p className="why">{text('ไม่มีสกิลที่ลดเวลารอได้ อาจพร้อมใช้แล้วหรือเร่งถึงเพดานแล้ว','No ability can be accelerated. It may already be ready or have reached its reduction limit.')}</p>}
    {transfer && selectedSource && destinations.length===0 && <p className="why">{text('ต้องมีอีกสกิลที่กำลังรอเพื่อรับเวลาที่ถ่ายโอน','Another cooling ability is needed to receive the transferred wait.')}</p>}
    {blocked && <p className="why" role="status">{blocked}</p>}
    <button style={touch} disabled={disabled || !!blocked || !ready} title={disabled?text('รอคำสั่งก่อนหน้า','Wait for the previous action'):blocked??(!ready?text('เลือกสกิลที่ใช้ได้ก่อน','Choose eligible abilities first'):undefined)} onClick={()=>submit({type:'activate',itemId:item.id,...(selectedSource?{npc:selectedSource.npc}:{}),...(transfer && selectedDestination?{otherNpc:selectedDestination.npc}:{})})}>{text('เปิดใช้ {name}','Activate {name}',{name:abilityItemLabel(item)})}</button>
  </div>;
}
