import { STATUS_IDS } from '../game/appraisal/types.js';
import type { StatusId } from '../game/appraisal/types.js';
import type { AppraisalClientMessage, AppraisalSeatAction } from '../shared/appraisal-protocol.js';
import { validTimerSettings } from '../shared/appraisal-protocol.js';
import { integer, keys, MessageError, object, parseMessage, string } from './messages.js';

function boolean(value: unknown): boolean { if (typeof value !== 'boolean') throw new MessageError(); return value; }
function encounter(value: unknown): number { const n = integer(value); if (n < 1) throw new MessageError(); return n; }
function action(value: unknown): AppraisalSeatAction {
  const body = object(value); const requestId = string(body.requestId, 80);
  if (!/^[a-zA-Z0-9_-]+$/.test(requestId)) throw new MessageError();
  const base = { requestId, encounter: encounter(body.encounter) };
  const fields = ['type', 'requestId', 'encounter'];
  switch (body.type) {
    case 'enter': keys(body, [...fields, 'portalId']); return { type: 'enter', ...base, portalId: string(body.portalId) };
    case 'inspect':
      keys(body, [...fields, 'itemId', 'property']);
      if (body.property !== 'price' && body.property !== 'authenticity' && body.property !== 'effects') throw new MessageError();
      return { type: 'inspect', ...base, itemId: string(body.itemId), property: body.property };
    case 'appraise': case 'counter':
      keys(body, [...fields, 'itemId', 'value', 'acceptDanger']);
      return { type: body.type, ...base, itemId: string(body.itemId), value: integer(body.value),
        ...(body.acceptDanger === undefined ? {} : { acceptDanger: boolean(body.acceptDanger) }) };
    case 'buy': {
      keys(body, [...fields, 'itemIds', 'condition']);
      if (!Array.isArray(body.itemIds) || body.itemIds.length < 1 || body.itemIds.length > 2) throw new MessageError();
      const itemIds = body.itemIds.map(id => string(id));
      if (new Set(itemIds).size !== itemIds.length) throw new MessageError();
      return { type: 'buy', ...base, itemIds, condition: boolean(body.condition) };
    }
    case 'activate': keys(body, [...fields, 'itemId']); return { type: 'activate', ...base, itemId: string(body.itemId) };
    case 'recover-resource': keys(body,[...fields,'target']);if(body.target!=='energy' && body.target!=='life')throw new MessageError();return {type:'recover-resource',...base,target:body.target};
    case 'event': {
      keys(body, [...fields, 'key', 'choice', 'itemId', 'statusId', 'otherPlayerId', 'fact', 'guess']);
      if (body.statusId !== undefined && !STATUS_IDS.includes(body.statusId as StatusId)) throw new MessageError();
      if (body.fact !== undefined && body.fact !== 'base' && body.fact !== 'genuine' && body.fact !== 'cursed') throw new MessageError();
      return { type: 'event', ...base, key: string(body.key, 256), choice: string(body.choice, 64),
        ...(body.itemId === undefined ? {} : { itemId: string(body.itemId) }),
        ...(body.statusId === undefined ? {} : { statusId: body.statusId as StatusId }),
        ...(body.otherPlayerId === undefined ? {} : { otherPlayerId: string(body.otherPlayerId, 32) }),
        ...(body.fact === undefined ? {} : { fact: body.fact as 'base' | 'genuine' | 'cursed' }),
        ...(body.guess === undefined ? {} : { guess: boolean(body.guess) }) };
    }
    case 'market-sell': keys(body, [...fields, 'itemId', 'orderId']); return { type: 'market-sell', ...base, itemId: string(body.itemId), orderId: string(body.orderId) };
    case 'share': keys(body, [...fields, 'itemId', 'allow', 'purchase']); return { type: 'share', ...base, itemId: string(body.itemId), allow: boolean(body.allow), purchase: boolean(body.purchase) };
    case 'propose':
      keys(body, [...fields, 'sellerId', 'itemId', 'credits', 'swapItemId', 'condition']);
      return { type: 'propose', ...base, sellerId: string(body.sellerId, 32), itemId: string(body.itemId), credits: integer(body.credits),
        ...(body.swapItemId === undefined ? {} : { swapItemId: string(body.swapItemId) }),
        ...(body.condition === undefined ? {} : { condition: boolean(body.condition) }) };
    case 'respond': keys(body, [...fields, 'offerId', 'accept']); return { type: 'respond', ...base, offerId: string(body.offerId), accept: boolean(body.accept) };
    case 'unsold':
      keys(body, [...fields, 'itemId', 'choice']);
      if (body.choice !== 'buy' && body.choice !== 'penalty' && body.choice !== 'consign') throw new MessageError();
      return { type: 'unsold', ...base, itemId: string(body.itemId), choice: body.choice };
    case 'bid': keys(body, [...fields, 'lotId', 'credits']); return { type: 'bid', ...base, lotId: string(body.lotId), credits: integer(body.credits) };
    case 'done': keys(body, fields); return { type: 'done', ...base };
    default: throw new MessageError();
  }
}
/** An actor always comes from the authenticated seat, never from JSON. */
export function parseAppraisalMessage(value: unknown): AppraisalClientMessage {
  const body = object(value);
  if(body.type==='timer-settings') {
    keys(body,['type','settings']);if(!validTimerSettings(body.settings))throw new MessageError();
    return {type:'timer-settings',settings:structuredClone(body.settings)};
  }
  if (body.type === 'action') { keys(body, ['type', 'matchId', 'action']); return { type: 'action', matchId: string(body.matchId, 32), action: action(body.action) }; }
  if (body.type === 'reveal-ready') { keys(body, ['type', 'matchId', 'encounter']); return { type: 'reveal-ready', matchId: string(body.matchId, 32), encounter: encounter(body.encounter) }; }
  const control = parseMessage(value);
  if (control.type === 'action' || control.type === 'reveal-ready') throw new MessageError();
  return control;
}
