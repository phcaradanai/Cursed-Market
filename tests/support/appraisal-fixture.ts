import { createAppraisalRun, assertAppraisalInvariants } from '../../src/game/appraisal/index.js';
import { ITEM_SPECS } from '../../src/game/appraisal/content.js';
import { grant, reward } from '../../src/game/appraisal/mechanics.js';
import type { AppraisalState, EventId, ItemKind, NpcId } from '../../src/game/appraisal/types.js';

export function appraisalFixture(id:EventId='E18',count=2):AppraisalState {
  const state=createAppraisalRun(['alice','bob','cara'].slice(0,count),'fixture',{marketProbability:0});
  const p=state.players[0]!,peer=state.players[1]!;
  for(const seat of state.players) {seat.eventOffer=null;seat.done=false;seat.offerSlots=0;reward(state,seat,160,'test-fixture');}
  state.phase=['E01','E08','E10'].includes(id)?'PORTALS':['E43','E44','E45','E47'].includes(id)?'TRADE':'APPRAISAL';
  const npcFor:Partial<Record<EventId,NpcId>>={E02:'orc',E03:'vampire',E04:'autometa',E05:'alien',E06:'darkone',E07:'beast',E24:'vampire',E28:'darkone',E50:'darkone'};
  for(const seat of state.players) {
    seat.stock=[...seat.portals[0]!.stock];
    seat.stock.forEach((itemId,index)=>{const item=state.items[itemId]!;item.npc=npcFor[id]??'orc';item.kind=index?'key':'mirror';item.base=index?24:20;item.ask=item.base;item.reservation=Math.ceil(item.base*.5);item.genuine=index===1;item.cursed=index===0;item.certificate=true;});
  }
  p.energy=7;
  for(const kind of Object.keys(ITEM_SPECS) as ItemKind[]) {
    const itemId=`owned-${kind}`;
    state.items[itemId]={id:itemId,kind,base:ITEM_SPECS[kind].anchor,genuine:true,cursed:false,ask:ITEM_SPECS[kind].anchor,owner:p.id,npcOwnerId:p.id,npc:'orc',encounter:1,certificate:true,lastAppraisal:null,lastAccepted:null,reservation:1};p.inventory.push(itemId);
  }
  if(['E06','E35','E41'].includes(id)) grant(state,p,'D01');
  if(id==='E33') grant(state,p,'D07');
  if(id==='E34') grant(state,p,'B03');
  if(id==='E42') grant(state,p,'D10');
  if(id==='E19') p.knowledge[p.stock[0]!]={genuine:false};
  if(id==='E45') p.knowledge[p.stock[0]!]={base:20,genuine:false};
  if(id==='E14') state.trace.push({type:'market-sale',encounter:0,playerId:p.id,details:{itemId:p.stock[0]!,price:17}});
  if(['E48','E49','E50'].includes(id)) {p.caught=true;p.acceptedDanger=true;}
  peer.valuations[peer.stock[0]!]={value:12,accuracy:false,caught:false,accepted:true};state.items[peer.stock[0]!]!.lastAppraisal=12;
  state.listings.push({ownerId:peer.id,itemId:peer.stock[0]!,purchase:true});
  if(state.phase==='PORTALS') p.stock=[];
  assertAppraisalInvariants(state);return state;
}
