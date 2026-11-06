import { core2Spec } from '../game/appraisal/core2-specs.js';
import { itemEffectScale } from '../game/appraisal/copy-effects.js';
import type { PoweredItem } from '../shared/rarity-power.js';
import { EVENT_CATALOG, ITEM_SPECS, NPC_SPECS, ALL_STATUS_CATALOG as STATUS_CATALOG, UNSOLD_PENALTIES } from '../game/appraisal/content.js';
import { PASSIVE_ITEMS } from '../game/appraisal/passives.js';
import { EXTRA_HELD_EFFECTS, ITEM_USE_EFFECTS, type UseBonuses } from '../game/appraisal/item-effects.js';
import { OMENS, type Omen } from '../game/appraisal/omen-table.js';
import type { EventId, ItemKind, ItemView, NpcId, StatusId } from '../game/appraisal/types.js';
import { EN_EVENT, EN_ITEM, EN_NPC, EN_NPC_UNSOLD, EN_OMEN, EN_PASSIVE_TEXT, EN_STATUS, EN_TOOL_TEXT } from './i18n-content.js';
import { pick, t } from './i18n.js';

/** Display text for catalog entries. Thai comes from src/game; English comes from i18n-content.ts. */

export const itemName = (kind: ItemKind): string => pick(ITEM_SPECS[kind].name, EN_ITEM[kind]);
export const itemLabel=(item:ItemView):string=>item.copy?`${pick('สำเนา','Copy')} #${item.copy.number} ${pick('ของ','of')} ${itemName(item.kind)}`:itemName(item.kind);
export const npcName = (npc: NpcId): string => pick(NPC_SPECS[npc].name, EN_NPC[npc]?.name);
export const npcHint = (npc: NpcId): string => pick(NPC_SPECS[npc].hint, EN_NPC[npc]?.hint);
export const npcUnsoldText = (npc: NpcId): string => pick(UNSOLD_PENALTIES[npc].text, EN_NPC_UNSOLD[npc]);

export const statusName = (id: StatusId): string => pick(STATUS_CATALOG.find(s => s.id === id)!.name, EN_STATUS[id]?.name);
export const statusDescription = (id: StatusId): string => pick(STATUS_CATALOG.find(s => s.id === id)!.description, EN_STATUS[id]?.description);
export const statusDuration = (id: StatusId): string => pick(STATUS_CATALOG.find(s => s.id === id)!.duration, EN_STATUS[id]?.duration);

export function eventText(id: EventId): { name: string; when: string; description: string } {
  const th = EVENT_CATALOG.find(e => e.id === id) ?? core2Spec(id);
  const en = EN_EVENT[id];
  return {
    name: pick(th?.name ?? id, en?.name),
    when: pick(th?.when ?? '', en?.when),
    description: pick(th?.description ?? '', en?.description),
  };
}

export const omenText = (omen: { id: string; name: string; text: string }): { name: string; text: string } => {
  const en = EN_OMEN[omen.id];
  return { name: pick(omen.name, en?.name), text: pick(omen.text, en?.text) };
};
export const omenById = (id: string): Omen | undefined => OMENS.find(omen => omen.id === id);

/** Held-item effect text for a passive relic or charm; empty for kinds that have no passive. */
function scaledAmountText(text:string,amount:number,scale:number):string {
  if(scale===1)return text;
  const value=String(Math.round(amount*scale*1000)/1000);
  const pattern=new RegExp(`(^|[^\\d.])${amount}(?=$|[^\\d.])`);
  if(pattern.test(text))return text.replace(pattern,(_match,prefix:string)=>prefix+value);
  return amount===1?text.replace(/\bOne\b/i,value):text;
}
export const passiveText = (kind: ItemKind,itemEffects=false,item?:PoweredItem & {copy?:unknown;nativeEffectReady?:boolean}): string => {
  const extra=itemEffects?EXTRA_HELD_EFFECTS[kind]:undefined;
  const insurance=itemEffects&&kind==='vampire-mist-cloak'&&item?.nativeEffectReady?pick('ถือก่อนดวลผู้เล่นจนของถูกโอน: หากของต้นฉบับถูกขโมยสำเร็จ รับเงินจากธนาคารตามราคาซื้อหรือมูลค่าพื้นฐานที่ต่ำกว่า (เริ่ม 20% สูงสุด 30%; ไม่เกิน 4 เครดิตต่อครั้งและ 6 ต่อเกม)','Hold before the PvP duel through transfer: when an original item is successfully stolen, receive bank-funded insurance on the lower of paid price or base value (starts at 20%, up to 30%; capped at 4 credits per loss and 6 per run).'):'';
  const sentry=itemEffects&&kind==='autometa-clockwork-sentry'&&item?.nativeEffectReady?pick('ถือก่อนดวล: หากแพ้ขโมยจากพ่อค้าและเสียความไว้ใจอย่างน้อย 2 จะเสียลดลง 1 ครั้งต่อช่วง','Held before the duel: on a lost theft duel against a merchant, lose 1 less trust if the loss is at least 2; once per encounter.'):'';
  const buoy=itemEffects&&kind==='deepsea-tideglass-buoy'&&item?.nativeEffectReady?pick('ถือทุ่นแก้วคลื่นชิ้นเดิมต่อเนื่องครบช่วงที่เงินต้นอยู่ในคลัง: เพิ่มดอกเบี้ย 1 จุดเปอร์เซ็นต์ต่อความแรง รวมโบนัสจากทุ่นและแหวนไม่เกิน 4 จุดเปอร์เซ็นต์','Hold the same Tideglass Buoy continuously for the full vault-principal interval: add 1 percentage point of interest per strength; buoys and signet rings share a 4-point cap.'):'';
  const swarmEgg=itemEffects&&kind==='swarm-hive-egg-cluster'&&item?.nativeEffectReady?pick('ถือก่อนใช้สกิลแตกหน่อ: เพิ่มมูลค่าสำเนา 5 จุดเปอร์เซ็นต์ต่อความแรง สูงสุด +10 จุดเปอร์เซ็นต์','Held before using Bud: add 5 percentage points to copy value per strength, up to +10 points.'):'';
  const resin=itemEffects&&kind==='swarm-resin-spool'&&item?.nativeEffectReady&&!item.copy?pick('ถือก่อนยื่นข้อเสนอและจนซื้อขายตราจากผู้เล่นอื่นสำเร็จ: เมื่อจ่ายอย่างน้อย 1 เครดิต ฟื้นพลังตามความแรงรวม (ปัดลง สูงสุด 2) เมื่อพลังยังไม่เต็ม; ผู้ซื้อได้ครั้งเดียวต่อช่วง และตราต้นกำเนิดเดิมให้ผลครั้งเดียวต่อเกม','Hold before making the offer through a successful seal purchase from another player: paying at least 1 credit restores energy equal to total strength (rounded down, up to 2) when not full. One benefit per encounter and each seal origin only once per run.'):'';
  const glider=itemEffects&&kind==='swarm-wing-membrane-glider'&&item?.nativeEffectReady?pick('รวมเข็มทิศกับเครื่องร่อนที่แรงสุดไม่เกิน 5 ชิ้น: ลดพลังรีประตูตามความแรงรวม ปัดลง สูงสุด 2 และเหลืออย่างน้อย 1 พลัง','Combine the five strongest held compasses and gliders: reduce portal reroll energy by total strength, rounded down and capped at 2; cost remains at least 1 energy.') : '';
  const debtChain=itemEffects&&kind==='darkone-debt-chain'&&item?.nativeEffectReady?pick('ถือโซ่ชิ้นเดิมตั้งแต่ปล่อยกู้จนคืนเงินกู้ที่ครบอายุสำเร็จ: ได้เครดิตคืน 5% ของเงินต้นที่คืนต่อความแรง ปัดลง สูงสุด 2 ต่อสัญญาและ 4 ต่อเกม','Hold this same chain from funding through full eligible repayment: receive 5% of principal repaid per strength, rounded down, up to 2 credits per loan and 4 per run.') : '';
  const bloodDecanter=itemEffects&&kind==='vampire-shadow-wine-decanter'&&item?.nativeEffectReady?pick('เมื่อทำสัญญาเลือดกับพ่อค้า ลดค่าชีวิตที่ต้องจ่าย 1 (ต้องมีความแรงอย่างน้อย 1); จ่ายอย่างน้อย 1 ชีวิตเสมอ','For a merchant blood pact, reduce the quoted life cost by 1 at strength 1 or more; payment never drops below 1 life.') : '';
  const dreadTools=itemEffects&&(kind==='alien-spore-lantern'||kind==='darkone-omen-censer')&&item?.nativeEffectReady?pick('ก่อนทอย Dread ท้ายช่วง ลดโอกาสที่เหลือหลังผลลางร้ายลง 10% ต่อความแรงแบบสัมพัทธ์; ตะเกียงกับกระถางใช้เพดานร่วม 20% ไม่ทอยซ้ำ','Before the end-of-encounter Dread roll, reduce the post-omen chance by 10% per strength relatively. Lanterns and censers share a 20% cap; no reroll.') : '';
  const text=extra?pick(extra.text,extra.en):insurance||sentry||buoy||swarmEgg||resin||glider||debtChain||bloodDecanter||dreadTools||pick(kind==='lucky-die'?'ยอดได้หรือเสียต่อเหรียญเพิ่ม 1 เครดิตต่อชิ้นที่ถือ ต้องทายถูกครบทุกเหรียญจึงได้เพิ่ม':(PASSIVE_ITEMS as Partial<Record<string, { passive: { text: string } }>>)[kind]?.passive.text ?? '', EN_PASSIVE_TEXT[kind]);
  const amount=extra?.amount??(buoy?1:swarmEgg?5:(PASSIVE_ITEMS as Partial<Record<string,{passive:{amount:number}}>>)[kind]?.passive.amount);
  const scaled=(item?.rarityPower||item?.copy)&&amount!==undefined?scaledAmountText(text,amount,itemEffectScale(item)):text;
  return scaled+(text && itemEffects && !['autometa-clockwork-sentry','swarm-wing-membrane-glider','alien-spore-lantern','darkone-omen-censer'].includes(kind)?t(' · คิดโบนัสถือสูงสุด 5 ชิ้นต่อชนิด'):'');
};
export const activationBonusText=(kind:ItemKind,item?:PoweredItem & {copy?:unknown}):string=>{const effect=ITEM_USE_EFFECTS[kind];return effect?scaledAmountText(pick(effect.text,effect.en),effect.amount,item?.rarityPower?itemEffectScale(item):1):'';};
export function usedBonusesText(b:UseBonuses):string {
  return [b.luck?t('โอกาสหัวก้อย +{n} จุดเปอร์เซ็นต์',{n:b.luck}):'',b.income?t('รางวัลจบรอบ +{n} เครดิต',{n:b.income}):'',b.coinWin?t('ยอดได้หรือเสียต่อเหรียญ +{n} เครดิต',{n:b.coinWin}):'',b.discount?t('ลดราคาซื้อ +{n} เครดิตต่อดีล',{n:b.discount}):'',b.acceptance?t('โอกาสยอมรับราคาต่ำ +{n} จุดเปอร์เซ็นต์',{n:b.acceptance}):'',b.inspections?t('โควตาตรวจ +{n} ครั้ง',{n:b.inspections}):''].filter(Boolean).join(' · ');
}
export const toolText = (kind: ItemKind, thai: string): string => pick(thai, EN_TOOL_TEXT[kind]);
