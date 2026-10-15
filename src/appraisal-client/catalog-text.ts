import { EVENT_CATALOG, ITEM_SPECS, NPC_SPECS, STATUS_CATALOG, UNSOLD_PENALTIES } from '../game/appraisal/content.js';
import { PASSIVE_ITEMS } from '../game/appraisal/passives.js';
import { OMENS, type Omen } from '../game/appraisal/omen-table.js';
import type { EventId, ItemKind, NpcId, StatusId } from '../game/appraisal/types.js';
import { EN_EVENT, EN_ITEM, EN_NPC, EN_NPC_UNSOLD, EN_OMEN, EN_PASSIVE_TEXT, EN_STATUS, EN_TOOL_TEXT } from './i18n-content.js';
import { pick } from './i18n.js';

/** Display text for catalog entries. Thai comes from src/game; English comes from i18n-content.ts. */

export const itemName = (kind: ItemKind): string => pick(ITEM_SPECS[kind].name, EN_ITEM[kind]);
export const npcName = (npc: NpcId): string => pick(NPC_SPECS[npc].name, EN_NPC[npc]?.name);
export const npcHint = (npc: NpcId): string => pick(NPC_SPECS[npc].hint, EN_NPC[npc]?.hint);
export const npcUnsoldText = (npc: NpcId): string => pick(UNSOLD_PENALTIES[npc].text, EN_NPC_UNSOLD[npc]);

export const statusName = (id: StatusId): string => pick(STATUS_CATALOG.find(s => s.id === id)!.name, EN_STATUS[id]?.name);
export const statusDescription = (id: StatusId): string => pick(STATUS_CATALOG.find(s => s.id === id)!.description, EN_STATUS[id]?.description);
export const statusDuration = (id: StatusId): string => pick(STATUS_CATALOG.find(s => s.id === id)!.duration, EN_STATUS[id]?.duration);

export function eventText(id: EventId): { name: string; when: string; description: string } {
  const th = EVENT_CATALOG.find(e => e.id === id);
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
export const passiveText = (kind: ItemKind): string => pick((PASSIVE_ITEMS as Partial<Record<string, { passive: { text: string } }>>)[kind]?.passive.text ?? '', EN_PASSIVE_TEXT[kind]);
export const toolText = (kind: ItemKind, thai: string): string => pick(thai, EN_TOOL_TEXT[kind]);
