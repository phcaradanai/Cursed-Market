// Local-only browser evidence. This is never imported by the shipping server.
import { once } from 'node:events';
import { writeFileSync } from 'node:fs';
import WebSocket from 'ws';
import { createApp } from '../../../dist/src/server/app.js';
import { AppraisalRoomService } from '../../../dist/src/server/appraisal-rooms.js';
import { createAppraisalRun, assertAppraisalInvariants, SURVIVAL_RULES } from '../../../dist/src/game/appraisal/index.js';
import { NPC_SPECS, ITEM_SPECS } from '../../../dist/src/game/appraisal/content.js';
class FixtureRooms extends AppraisalRoomService {
  createGame(ids){
    const state=createAppraisalRun(ids,'merchant-ability-browser',{trustAbilities:true,marketProbability:0,survival:SURVIVAL_RULES});
    state.phase='APPRAISAL';
    for(const p of state.players){
      p.eventOffer=null;p.offerSlots=2;p.done=false;p.selectedPortalId=p.portals[0].id;p.stock=[...p.portals[0].stock];p.npcTrust=Object.fromEntries(Object.keys(NPC_SPECS).map(npc=>[npc,6]));
      p.abilityReady={orc:4,alien:5};p.abilityLastUsed={orc:0,alien:0};
      for(const kind of ['gambler-hat','dream-tonic','chrono-gear','burden-hourglass','shifting-compass']){
        const id=`fixture-${p.id}-${kind}`;
        state.items[id]={id,kind,base:ITEM_SPECS[kind].anchor,ask:ITEM_SPECS[kind].anchor,genuine:true,cursed:false,owner:p.id,npcOwnerId:p.id,npc:'orc',encounter:1,certificate:false,reservation:1,lastAppraisal:null,lastAccepted:null};
        p.inventory.push(id);p.knowledge[id]={genuine:true,cursed:false,base:state.items[id].base};
      }
    }
    assertAppraisalInvariants(state);return state;
  }
}
const app=createApp({rooms:new FixtureRooms(Date.now,{},undefined,{survival:SURVIVAL_RULES}),webRoot:'dist/appraisal-client'});
app.server.listen(3127,'127.0.0.1');await once(app.server,'listening');
class Client {
  constructor(ws){this.ws=ws;this.messages=[];ws.on('message',raw=>this.messages.push(JSON.parse(raw)));}
  static async open(){const ws=new WebSocket('ws://127.0.0.1:3127/socket');const c=new Client(ws);await once(ws,'open');return c;}
  send(message){this.ws.send(JSON.stringify(message));}
  get room(){return this.messages.findLast(m=>m.type==='state')?.room;}
  async until(predicate){for(let n=0;n<200;n++){const result=predicate();if(result)return result;await new Promise(resolve=>setTimeout(resolve,20));}throw new Error(JSON.stringify(this.messages.slice(-2)));}
}
const alice=await Client.open(),bob=await Client.open();alice.send({type:'create',name:'ผู้ทดสอบพันธะ'});await alice.until(()=>alice.room);
bob.send({type:'join',name:'เพื่อนร่วมตลาด',roomCode:alice.room.code});await bob.until(()=>bob.room);
alice.send({type:'timer-settings',settings:{enabled:false,durationsMs:{PORTALS:30000,APPRAISAL:90000,TRADE:45000,REVEAL:30000}}});
alice.send({type:'ready',ready:true});bob.send({type:'ready',ready:true});await alice.until(()=>alice.room.seats.every(s=>s.ready));alice.send({type:'start'});await alice.until(()=>alice.room.game);
const joined=alice.messages.find(m=>m.type==='joined');writeFileSync('/private/tmp/cursed-market-ability-credentials.json',JSON.stringify({roomCode:alice.room.code,token:joined.token}));
alice.ws.close();console.log('Merchant ability browser fixture: http://127.0.0.1:3127');
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{void app.close().then(()=>process.exit(0));});
