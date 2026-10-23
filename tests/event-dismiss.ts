import { REWORKED_DEFAULT } from '../src/game/appraisal/events.js';
import type { EventOffer, StatusId } from '../src/game/appraisal/types.js';

/**
 * Clear an event a test is not about. Decline when the event has one; gifts and mishaps without a decline
 * (event choice rules 1) take the same option the engine takes on a timeout.
 */
export function dismissEvent(offer: EventOffer): { choice: string; itemId?: string; statusId?: StatusId } {
  if (offer.choices.includes('decline')) return { choice: 'decline' };
  const preferred = REWORKED_DEFAULT[offer.id];
  const choice = preferred && offer.choices.includes(preferred) ? preferred : offer.choices[0]!;
  return { choice, ...(offer.itemIds[0] ? { itemId: offer.itemIds[0] } : {}), ...(offer.boons?.[0] ? { statusId: offer.boons[0] } : {}) };
}
