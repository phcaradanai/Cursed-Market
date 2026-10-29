import {writeFileSync} from 'node:fs';
import {createAppraisalRun} from '../dist/src/game/appraisal/engine.js';
import {appraisalViewFor} from '../dist/src/game/appraisal/views.js';
import {ITEM_SPECS} from '../dist/src/game/appraisal/content.js';
function sample(scene) {
  const state=createAppraisalRun(['preview','friend'],'comic-ui-gallery',{
    startingCredits:85,marketProbability:1,catalogVersion:3,core2:true,
    survival:{maxLife:6,encounterLifeCost:1,entryEnergyCost:1}
  });
  const p=state.players[0];
  const merchants=['orc','vampire','autometa'];
  for(const seat of state.players){seat.eventOffer=null;seat.done=false;seat.energy=7;seat.life=4;seat.notes=[];}
  p.npcTrust={...p.npcTrust,orc:3,vampire:3,autometa:3};
  p.portals.forEach((portal,index)=>{
    portal.npc=merchants[index%merchants.length];
    portal.disabled=false;
    portal.stock.forEach(id=>{state.items[id].npc=portal.npc;});
  });
  const active=p.portals[1]??p.portals[0];
  p.selectedPortalId=active.id;
  p.stock=[...active.stock];
  const stockKinds=['amulet','potion'];
  p.stock.forEach((id,index)=>{
    const item=state.items[id];
    item.kind=stockKinds[index%stockKinds.length];
    item.base=42+index*6;item.ask=48+index*4;item.reservation=30;item.genuine=true;item.cursed=false;item.certificate=false;
    delete item.appearance;delete item.rarityPower;
  });
  const kinds=['potion','amulet','mask','key','mirror','orb'];
  p.inventory=[];
  kinds.forEach((kind,index)=>{
    const id='comic-owned-'+index;
    state.items[id]={id,kind,base:ITEM_SPECS[kind].anchor,genuine:true,cursed:false,ask:ITEM_SPECS[kind].anchor,
      owner:p.id,npcOwnerId:p.id,npc:'vampire',encounter:1,certificate:false,lastAppraisal:null,lastAccepted:null,reservation:1};
    p.inventory.push(id);
    p.paid??={};p.paid[id]=ITEM_SPECS[kind].anchor;
  });
  if(scene==='status')p.statuses=[{id:'B06',charges:1,starts:1,expires:2},{id:'D03',charges:2,starts:1,expires:2}];
  state.phase=scene==='merchants'?'PORTALS':scene==='trade'?'TRADE':'APPRAISAL';
  if(state.phase==='PORTALS'){p.selectedPortalId=null;p.stock=[];}
  return state;
}

const rooms={};
for(const scene of ['merchants','inspection','inventory','trade','status']){const state=sample(scene);rooms[scene]={rulesVersion:'0.5',mode:'survival',code:'DEMO2D',hostId:'preview',yourSeatId:'preview',seats:[{id:'preview',name:'คุณ',ready:true,connected:true},{id:'friend',name:'ผู้ประเมินอีกคน',ready:true,connected:true}],matchSeats:[{id:'preview',name:'คุณ'},{id:'friend',name:'ผู้ประเมินอีกคน'}],playtestMode:'no-voice',matchId:'comic-gallery',deadline:null,serverTime:0,revealReady:[],game:appraisalViewFor(state,'preview')};}
writeFileSync(new URL('../src/appraisal-client/comic-preview-data.ts',import.meta.url),"// Generated sample DTOs for the separate visual gallery; never live room data.\nimport type {AppraisalRoomView} from '../shared/appraisal-protocol.js';\nexport const previewRooms = "+JSON.stringify(rooms)+" as unknown as Record<string,AppraisalRoomView>;\n");
