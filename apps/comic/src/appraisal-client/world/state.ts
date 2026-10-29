import type { AppraisalRoomView } from '../../shared/appraisal-protocol.js';
import { npcImage } from '../../game/appraisal/content.js';

/**
 * What the 3D world behind the table may react to. Only facts the player can already see on screen:
 * the phase, their own life, being caught, an open event, the doors on offer and the merchant they chose.
 * Never pass hidden item truth (cursed, fake, value) here; the world must not leak it as a glow or tint.
 */
export interface WorldState {
  view: string;
  encounter: number;
  /** 0 = full life (or no life rules), 1 = no life left. */
  dread: number;
  /** Own life is at 2 or below: the world's heartbeat starts. */
  lowLife: boolean;
  caught: boolean;
  event: boolean;
  gates: { image: string; closed: boolean }[];
  merchant: string | null;
  seats: number;
}

export function worldStateFor(room: AppraisalRoomView | null): WorldState {
  const empty = { encounter: 0, dread: 0, lowLife: false, caught: false, event: false, gates: [], merchant: null };
  if (!room) return { view: 'entry', seats: 0, ...empty };
  const game = room.game;
  if (!game) return { view: 'lobby', seats: room.seats.length, ...empty };
  const self = game.self;
  const maxLife = self.maxLife ?? game.survival?.maxLife;
  const life = self.life;
  const dread = life !== undefined && maxLife ? Math.min(1, Math.max(0, 1 - life / maxLife)) : 0;
  const npc = self.portals.find(p => p.id === self.selectedPortalId)?.npc;
  return {
    view: game.phase,
    encounter: game.encounter,
    dread,
    lowLife: life !== undefined && life > 0 && life <= 2,
    caught: !!self.caught,
    event: !!self.eventOffer,
    gates: game.phase === 'PORTALS' ? self.portals.map(p => ({ image: npcImage(p.npc), closed: !!p.disabled })) : [],
    merchant: game.phase === 'APPRAISAL' && npc ? npcImage(npc) : null,
    seats: room.matchSeats.length,
  };
}
