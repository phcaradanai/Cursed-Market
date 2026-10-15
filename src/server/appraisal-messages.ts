import { STATUS_IDS } from '../game/appraisal/types.js';
import type { StatusId } from '../game/appraisal/types.js';
import type { AppraisalBotPolicy, AppraisalClientMessage, AppraisalSeatAction } from '../shared/appraisal-protocol.js';
import { APPRAISAL_BOT_POLICIES, validTimerSettings } from '../shared/appraisal-protocol.js';
import { integer, keys, MessageError, object, parseMessage, string } from './messages.js';

function boolean(value: unknown): boolean { if (typeof value !== 'boolean') throw new MessageError(); return value; }
function encounter(value: unknown): number { const n = integer(value); if (n < 1) throw new MessageError(); return n; }
function claims(value: unknown): { genuine?: boolean; cursed?: boolean } {
  const body = object(value); keys(body, ['genuine', 'cursed']);
  return { ...(body.genuine === undefined ? {} : { genuine: boolean(body.genuine) }), ...(body.cursed === undefined ? {} : { cursed: boolean(body.cursed) }) };
}
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
    case 'wish-new': keys(body,[...fields,'replaceNpc']);return {type:'wish-new',...base,...(body.replaceNpc===undefined?{}:{replaceNpc:string(body.replaceNpc,16) as never})};
    case 'wish-sell': keys(body,[...fields,'itemId','markup']);return {type:'wish-sell',...base,itemId:string(body.itemId),markup:integer(body.markup)};
    case 'cleanse': keys(body,[...fields,'itemId','stoneId']);return {type:'cleanse',...base,itemId:string(body.itemId),...(body.stoneId===undefined?{}:{stoneId:string(body.stoneId)})};
    case 'event': {
      keys(body, [...fields, 'key', 'choice', 'itemId', 'itemIds', 'statusId', 'otherPlayerId', 'fact', 'guess']);
      if(body.itemIds!==undefined && (!Array.isArray(body.itemIds) || body.itemIds.length<1 || body.itemIds.length>3 || new Set(body.itemIds).size!==body.itemIds.length))throw new MessageError();
      if (body.statusId !== undefined && !STATUS_IDS.includes(body.statusId as StatusId)) throw new MessageError();
      if (body.fact !== undefined && body.fact !== 'base' && body.fact !== 'genuine' && body.fact !== 'cursed') throw new MessageError();
      return { type: 'event', ...base, key: string(body.key, 256), choice: string(body.choice, 64),
        ...(body.itemId === undefined ? {} : { itemId: string(body.itemId) }),
        ...(body.itemIds === undefined ? {} : {itemIds:(body.itemIds as unknown[]).map(id=>string(id))}),
        ...(body.statusId === undefined ? {} : { statusId: body.statusId as StatusId }),
        ...(body.otherPlayerId === undefined ? {} : { otherPlayerId: string(body.otherPlayerId, 32) }),
        ...(body.fact === undefined ? {} : { fact: body.fact as 'base' | 'genuine' | 'cursed' }),
        ...(body.guess === undefined ? {} : { guess: boolean(body.guess) }) };
    }
    case 'market-sell':
      keys(body,[...fields,'itemId','orderId','resolution']);
      if(body.resolution!==undefined && body.resolution!=='discount' && body.resolution!=='sacrifice')throw new MessageError();
      return {type:'market-sell',...base,itemId:string(body.itemId),orderId:string(body.orderId),...(body.resolution===undefined?{}:{resolution:body.resolution})};
    case 'share': keys(body, [...fields, 'itemId', 'allow', 'purchase', 'claims']); return { type: 'share', ...base, itemId: string(body.itemId), allow: boolean(body.allow), purchase: boolean(body.purchase),
      ...(body.claims === undefined ? {} : { claims: claims(body.claims) }) };
    case 'propose':
      keys(body, [...fields, 'sellerId', 'itemId', 'credits', 'swapItemId', 'condition', 'challenge', 'sealId']);
      if (body.challenge !== undefined && body.challenge !== 'genuine' && body.challenge !== 'cursed') throw new MessageError();
      return { type: 'propose', ...base, sellerId: string(body.sellerId, 32), itemId: string(body.itemId), credits: integer(body.credits),
        ...(body.swapItemId === undefined ? {} : { swapItemId: string(body.swapItemId) }),
        ...(body.condition === undefined ? {} : { condition: boolean(body.condition) }),
        ...(body.challenge === undefined ? {} : { challenge: body.challenge as 'genuine'|'cursed' }),
        ...(body.sealId === undefined ? {} : { sealId: string(body.sealId) }) };
    case 'respond': keys(body, [...fields, 'offerId', 'accept']); return { type: 'respond', ...base, offerId: string(body.offerId), accept: boolean(body.accept) };
    case 'unsold':
      keys(body, [...fields, 'itemId', 'choice']);
      if (body.choice !== 'buy' && body.choice !== 'penalty' && body.choice !== 'consign') throw new MessageError();
      return { type: 'unsold', ...base, itemId: string(body.itemId), choice: body.choice };
    case 'bid': keys(body, [...fields, 'lotId', 'credits']); return { type: 'bid', ...base, lotId: string(body.lotId), credits: integer(body.credits) };
    case 'round-flip':
      keys(body,[...fields,'guess','attempt']);
      if(body.guess!=='heads' && body.guess!=='tails')throw new MessageError();
      return {type:'round-flip',...base,guess:body.guess,attempt:integer(body.attempt)};
    case 'round-bank': keys(body,fields);return {type:'round-bank',...base};
    case 'done': keys(body, fields); return { type: 'done', ...base };
    default: throw new MessageError();
  }
}
/** An actor always comes from the authenticated seat, never from JSON. */
export function parseAppraisalMessage(value: unknown): AppraisalClientMessage {
  const body = object(value);
  if(body.type==='add-bot') {
    keys(body,['type','policy']);if(!(APPRAISAL_BOT_POLICIES as readonly unknown[]).includes(body.policy))throw new MessageError();
    return {type:'add-bot',policy:body.policy as AppraisalBotPolicy};
  }
  if(body.type==='remove-bot') {keys(body,['type','seatId']);return {type:'remove-bot',seatId:string(body.seatId,32)};}
  if(body.type==='rules-mode') {
    keys(body,['type','mode']);if(body.mode!=='classic' && body.mode!=='survival')throw new MessageError();
    return {type:'rules-mode',mode:body.mode};
  }
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
