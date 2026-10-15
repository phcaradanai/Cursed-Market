// Local-only UI evidence harness. Never imported by the shipping server.
import {writeFileSync} from 'node:fs';
import {once} from 'node:events';
import {createApp} from '../../../dist/src/server/app.js';
import {AppraisalRoomService} from '../../../dist/src/server/appraisal-rooms.js';
import {createAppraisalRun,assertAppraisalInvariants,SURVIVAL_RULES} from '../../../dist/src/game/appraisal/index.js';
import {offerEvent} from '../../../dist/src/game/appraisal/events.js';
import {NPC_PERSONAL_EVENT} from '../../../dist/src/game/appraisal/npc-events.js';
import {grant} from '../../../dist/src/game/appraisal/mechanics.js';
import WebSocket from 'ws';
const npcs=['alien','darkone','autometa','vampire','orc','beast','deepsea','swarm'];let next=0;
class FixtureRooms extends AppraisalRoomService {
  createGame(ids){
    const npc=npcs[next++ % npcs.length];
    for(let attempt=0;attempt<100;attempt++){
      const s=createAppraisalRun(ids,`npc-browser-${npc}-${attempt}`,{npcEvents:true,polish:true,survival:SURVIVAL_RULES,marketProbability:0});s.phase='APPRAISAL';
      for(const p of s.players){
        p.eventOffer=null;p.done=false;p.offerSlots=0;p.life=4;p.energy=6;p.selectedPortalId=p.portals[0].id;p.portals[0].npc=npc;p.stock=[...p.portals[0].stock];
        p.stock.forEach(id=>s.items[id].npc=npc);
        for(const portal of p.portals.slice(1))for(const id of portal.stock){s.items[id].owner=p.id;p.inventory.push(id);}
        if(npc==='darkone')grant(s,p,'D01');
        offerEvent(s,p,NPC_PERSONAL_EVENT[npc]);
      }
      if(npc==='alien' && s.players[0].eventOffer.npcTerms.loanMax!==3)continue;
      assertAppraisalInvariants(s);return s;
    }
    throw new Error('fixture seed unavailable');
  }
}
const app=createApp({rooms:new FixtureRooms(Date.now,{},undefined,{survival:SURVIVAL_RULES}),webRoot:'dist/appraisal-client'});
app.server.listen(3115,'127.0.0.1');await once(app.server,'listening');
class Client {
  constructor(ws){this.ws=ws;this.messages=[];ws.on('message',raw=>this.messages.push(JSON.parse(raw)));}
  static async open(){const ws=new WebSocket('ws://127.0.0.1:3115/socket');const c=new Client(ws);await once(ws,'open');return c;}
  send(m){this.ws.send(JSON.stringify(m));}
  async until(predicate){for(let i=0;i<300;i++){const result=predicate();if(result)return result;await new Promise(r=>setTimeout(r,20));}throw new Error(JSON.stringify(this.messages.slice(-3)));}
  get room(){return this.messages.findLast(m=>m.type==='state')?.room;}
}
const credentials={};
for(const npc of npcs){
  const alice=await Client.open(),bob=await Client.open();alice.send({type:'create',name:'นักเดินทาง'});await alice.until(()=>alice.room);
  const code=alice.room.code;bob.send({type:'join',name:'เพื่อนบ็อบ',roomCode:code});await bob.until(()=>bob.room);
  alice.send({type:'timer-settings',settings:{enabled:false,durationsMs:{PORTALS:30000,APPRAISAL:90000,TRADE:45000,REVEAL:30000}}});
  alice.send({type:'ready',ready:true});bob.send({type:'ready',ready:true});await alice.until(()=>alice.room.seats.every(s=>s.ready));alice.send({type:'start'});await alice.until(()=>alice.room.game);
  const joined=alice.messages.find(m=>m.type==='joined');credentials[npc]={roomCode:code,token:joined.token};alice.ws.close();
}
writeFileSync('/tmp/cursed-npc-credentials.json',JSON.stringify(credentials));console.log('NPC UI fixtures ready at http://127.0.0.1:3115');
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{void app.close().then(()=>process.exit(0));});
