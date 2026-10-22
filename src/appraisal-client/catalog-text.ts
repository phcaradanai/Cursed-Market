import { core2Spec } from '../game/appraisal/core2-specs.js';
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
export const passiveText = (kind: ItemKind,itemEffects=false): string => {
  const extra=itemEffects?EXTRA_HELD_EFFECTS[kind]:undefined;
  const text=extra?pick(extra.text,extra.en):pick(kind==='lucky-die'?'ยอดได้หรือเสียต่อเหรียญเพิ่ม 1 เครดิตต่อชิ้นที่ถือ ต้องทายถูกครบทุกเหรียญจึงได้เพิ่ม':(PASSIVE_ITEMS as Partial<Record<string, { passive: { text: string } }>>)[kind]?.passive.text ?? '', EN_PASSIVE_TEXT[kind]);
  return text+(text && itemEffects?t(' · คิดโบนัสถือสูงสุด 5 ชิ้นต่อชนิด'):'');
};
export const activationBonusText=(kind:ItemKind):string=>{const effect=ITEM_USE_EFFECTS[kind];return effect?pick(effect.text,effect.en):'';};
export function usedBonusesText(b:UseBonuses):string {
  return [b.luck?t('โอกาสหัวก้อย +{n} จุดเปอร์เซ็นต์',{n:b.luck}):'',b.income?t('รางวัลจบรอบ +{n} เครดิต',{n:b.income}):'',b.coinWin?t('ยอดได้หรือเสียต่อเหรียญ +{n} เครดิต',{n:b.coinWin}):'',b.discount?t('ลดราคาซื้อ +{n} เครดิตต่อดีล',{n:b.discount}):'',b.acceptance?t('โอกาสยอมรับราคาต่ำ +{n} จุดเปอร์เซ็นต์',{n:b.acceptance}):'',b.inspections?t('โควตาตรวจ +{n} ครั้ง',{n:b.inspections}):''].filter(Boolean).join(' · ');
}
export const toolText = (kind: ItemKind, thai: string): string => pick(thai, EN_TOOL_TEXT[kind]);
