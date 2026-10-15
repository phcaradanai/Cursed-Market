import assert from 'node:assert/strict';
import {once} from 'node:events';
import {writeFileSync} from 'node:fs';
import WebSocket from 'ws';
import {appraisalBotDecision} from '../../../dist/src/simulation/appraisal.js';
import {replayAppraisalAudit} from '../../../dist/src/game/appraisal/index.js';
const url=process.argv[2]??'http://127.0.0.1:3114';
assert.equal((await fetch(url+'/health')).status,200);
const pause=()=>new Promise(r=>setTimeout(r,75));
class Client {
  constructor(ws){this.ws=ws;this.messages=[];ws.on('message',raw=>this.messages.push(JSON.parse(raw)));}
  static async open(){const ws=new WebSocket(url.replace('http','ws')+'/socket');const c=new Client(ws);await once(ws,'open');return c;}
  send(m){this.ws.send(JSON.stringify(m));}
  get room(){return this.messages.findLast(m=>m.type==='state')?.room;}
  async until(read){for(let n=0;n<500;n++){const value=read();if(value)return value;await new Promise(r=>setTimeout(r,10));}throw new Error(JSON.stringify(this.messages.slice(-3)));}
}
const reports=[];let request=0;
for(const count of [2,4]){
  const clients=[];for(let i=0;i<count;i++)clients.push(await Client.open());
  try {
    clients[0].send({type:'create',name:'NPC検証1'});await clients[0].until(()=>clients[0].room);const code=clients[0].room.code;
    for(const [i,c] of clients.entries()){if(i){c.send({type:'join',name:`NPC検証${i+1}`,roomCode:code});await c.until(()=>c.room);}}
    clients[0].send({type:'timer-settings',settings:{enabled:false,durationsMs:{PORTALS:30000,APPRAISAL:90000,TRADE:45000,REVEAL:30000}}});
    clients.forEach(c=>c.send({type:'ready',ready:true}));await clients[0].until(()=>clients[0].room.seats.every(s=>s.ready));clients[0].send({type:'start'});await clients[0].until(()=>clients[0].room.game);
    for(let turn=0;turn<1600 && clients[0].room.game.phase!=='RESULTS';turn++){
      const c=clients[turn%count],room=c.room,g=room.game;
      if(g.phase==='RESULTS')break;
      if(g.phase==='REVEAL'){
        if(g.self.life && !room.revealReady.includes(room.yourSeatId)){c.send({type:'reveal-ready',matchId:room.matchId,encounter:g.encounter});await pause();}continue;
      }
      if(g.self.done || g.self.paused)continue;
      const body=appraisalBotDecision(g,turn%2?'collector':'aggressive'),requestId=`npc-net-${++request}`;
      c.send({type:'action',matchId:room.matchId,action:{...body,encounter:g.encounter,requestId}});
      const reply=await c.until(()=>c.messages.find(m=>(m.type==='ack'||m.type==='error') && m.requestId===requestId));assert.equal(reply.type,'ack',JSON.stringify(reply));await pause();
    }
    assert.equal(clients[0].room.game.phase,'RESULTS');clients[0].send({type:'audit',matchId:clients[0].room.matchId});const wrapped=await clients[0].until(()=>clients[0].messages.find(m=>m.type==='audit')?.audit);
    assert.equal(wrapped.run.config.npcEvents,true);replayAppraisalAudit(wrapped.run);const events=wrapped.run.trace.filter(t=>t.type==='event-offered' && Number(t.details.id?.slice(1))>=109).map(t=>t.details.id);
    writeFileSync(new URL(`./live-${count}-seat-audit.json`,import.meta.url),JSON.stringify(wrapped,null,2));reports.push({count,encounters:wrapped.run.history.at(-1)?.encounter,events,replayed:true,commands:wrapped.run.commands.length});
  }finally{clients.forEach(c=>c.ws.close());}
}
writeFileSync(new URL('./live-report.json',import.meta.url),JSON.stringify(reports,null,2));console.log(JSON.stringify(reports));
