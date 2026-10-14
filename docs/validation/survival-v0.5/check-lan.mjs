import assert from 'node:assert/strict';
import { EventEmitter, once } from 'node:events';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { WebSocket } from 'ws';
import { appraisalBotDecision } from '../../../dist/src/simulation/appraisal.js';
import { analyseAppraisalMatchAudit } from '../../../dist/src/playtest/appraisal-report.js';
const base = process.argv[2];
assert(base && /^http:\/\/(?:192\.168\.|127\.0\.0\.1|localhost)/.test(base));
const evidence = { checkedAt: new Date().toISOString(), base, requestPacingMs:75, scope: 'HTTP assets and synthetic LAN-address sockets; no browser, image inspection or human/device playtest', assets: [], matches: [] };
const health = await fetch(base + '/health'); assert.equal(health.status, 200); assert.deepEqual(await health.json(), {ok:true});
const htmlResponse = await fetch(base + '/'); assert.equal(htmlResponse.status, 200);
const html = await htmlResponse.text();
const paths = [...html.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g)].map(m => m[1]);
for (const dir of ['art','fonts']) for (const file of readdirSync(`dist/appraisal-client/${dir}`)) if (/\.(png|ttf)$/.test(file)) paths.push(`/${dir}/${file}`);
assert(paths.length >= 21);
for (const path of paths) {
  const response = await fetch(base + path); assert.equal(response.status, 200, path);
  const mime = response.headers.get('content-type');
  assert(mime?.startsWith(path.endsWith('.png')?'image/png':path.endsWith('.ttf')?'font/ttf':path.endsWith('.css')?'text/css':'text/javascript'), path);
  const bytes = (await response.arrayBuffer()).byteLength; assert(bytes > 0);
  evidence.assets.push({path,mime,bytes});
}
assert.equal(/node:crypto|__vite-browser-external/.test(readFileSync('dist/appraisal-client' + paths.find(p=>p.endsWith('.js')), 'utf8')), false);
class Client extends EventEmitter {
  messages=[];
  constructor(socket) { super(); this.socket=socket; socket.on('message', data=>{this.messages.push(JSON.parse(data));this.emit('update');});socket.on('close',(code,reason)=>{this.closed={code,reason:reason.toString()};this.emit('update');}); }
  static async open() { const socket=new WebSocket(base.replace('http:','ws:')+'/socket',{origin:base}); const c=new Client(socket); await once(socket,'open'); return c; }
  send(message) { this.socket.send(JSON.stringify(message)); }
  get room() { return this.messages.findLast(m=>m.type==='state')?.room; }
  until(read) { const value=read();if(value!==undefined)return Promise.resolve(value);return new Promise((resolve,reject)=>{ const timer=setTimeout(()=>{this.off('update',update);reject(new Error('LAN condition timed out: '+this.room?.game?.phase+' revision '+this.room?.game?.revision+' condition '+read.toString()+' recent '+JSON.stringify(this.messages.slice(-3).map(m=>({type:m.type,requestId:m.requestId,code:m.code,revision:m.room?.game?.revision,phase:m.room?.game?.phase})))));},10000);const update=()=>{if(this.closed){clearTimeout(timer);this.off('update',update);reject(new Error('Socket closed: '+JSON.stringify(this.closed)));return;}const v=read();if(v!==undefined){clearTimeout(timer);this.off('update',update);resolve(v);}};this.on('update',update);update();}); }
}
for(const enabled of [true,false])for(const count of [2,3,4]) {
  console.log(`${count} seats, timers=${enabled}: starting`);const clients=[];for(let i=0;i<count;i++)clients.push(await Client.open());const host=clients[0];
  try {
    host.send({type:'create',name:'LAN synthetic host'});await host.until(()=>host.room);const code=host.room.code;
    assert.equal(host.room.rulesVersion,'0.5');
    for(const c of clients.slice(1)){c.send({type:'join',roomCode:code,name:'LAN synthetic appraiser'});await c.until(()=>c.room);}
    host.send({type:'timer-settings',settings:{enabled,durationsMs:{PORTALS:7000,APPRAISAL:11000,TRADE:13000,REVEAL:2000}}});await host.until(()=>host.room.timerSettings?.enabled===enabled && host.room.timerSettings.durationsMs.PORTALS===7000?true:undefined);for(const c of clients)c.send({type:'ready',ready:true});await host.until(()=>host.room.seats.every(s=>s.ready)?true:undefined);
    host.send({type:'start'});await Promise.all(clients.map(c=>c.until(()=>c.room?.game?.phase==='PORTALS'?true:undefined)));
    let step=0,cursor=0;const matchId=host.room.matchId;
    while(host.room.game.phase!=='RESULTS' && step++<1500) {
      await new Promise(resolve=>setTimeout(resolve,75));const game=host.room.game;if(!enabled)assert.equal(host.room.deadline,null);else assert(host.room.deadline!==null);
      if(game.phase==='REVEAL'){
        for(const c of clients.filter(c=>c.room.game.self.life>0))c.send({type:'reveal-ready',matchId,encounter:game.encounter});
        await Promise.all(clients.map(c=>c.until(()=>c.room.game.revision>game.revision?true:undefined)));continue;
      }
      const c=Array.from({length:count},(_,i)=>clients[(cursor+i)%count]).find(c=>!c.room.game.self.paused && !c.room.game.self.done);assert(c);
      cursor=(clients.indexOf(c)+1)%count;const requestId=`lan-${step}`,before=c.room.game.revision;
      c.send({type:'action',matchId,action:{...appraisalBotDecision(c.room.game,'trader'),requestId,encounter:c.room.game.encounter}});
      const reply=await c.until(()=>c.messages.findLast(m=>(m.type==='ack'||m.type==='error')&&m.requestId===requestId));assert.equal(reply.type,'ack',JSON.stringify(reply));
      await c.until(()=>c.room.game.revision>before?true:undefined);const revision=c.room.game.revision;
      await Promise.all(clients.map(c=>c.until(()=>c.room.game.revision>=revision?true:undefined)));
    }
    assert.equal(host.room.game.phase,'RESULTS');host.send({type:'audit',matchId});const {audit}=await host.until(()=>host.messages.findLast(m=>m.type==='audit'));
    assert.equal(audit.run.config.catalogVersion,2);assert.equal(audit.schemaVersion,5);assert(audit.run.final.every(p=>p.life===0));assert(audit.run.collector.length===count);assert(audit.run.final.every(p=>p.score===audit.run.collector.find(row=>row.playerId===p.id).score));assert.equal(audit.timerSettings.enabled,enabled);if(!enabled)assert.equal(audit.timeouts.length,0);const metrics=analyseAppraisalMatchAudit(audit);assert.equal(metrics.playerCount,count);
    writeFileSync(`docs/validation/survival-v0.5/network/lan-${enabled?'timed':'untimed'}-${count}-players.json`,JSON.stringify(audit,null,2)+'\n');
    host.send({type:'rematch'});await Promise.all(clients.map(c=>c.until(()=>c.room?.game===null?true:undefined)));assert(host.room.seats.every(s=>!s.ready));assert.equal(host.room.timerSettings.enabled,enabled);for(const c of clients)c.send({type:'ready',ready:true});await host.until(()=>host.room.seats.every(s=>s.ready)?true:undefined);host.send({type:'start'});await Promise.all(clients.map(c=>c.until(()=>c.room?.game?.phase==='PORTALS'?true:undefined)));assert(clients.every(c=>c.room.game.self.life===6 && c.room.game.self.energy===9));
    evidence.matches.push({count,matchId,timersEnabled:enabled,rulesVersion:'0.5',catalogVersion:audit.run.config.catalogVersion,collectorScores:audit.run.collector.map(row=>row.score),phase:'RESULTS',encounters:audit.run.history.length/count,replay:true,rematchReset:true,commands:audit.run.commands.length});
    console.log(`${count} ${enabled?'custom timed':'untimed'} LAN-address sockets: completed, replay verified, rematch reset`);
  } finally {for(const c of clients){if(c.socket.readyState===WebSocket.OPEN)c.send({type:'leave'});c.socket.close();}}
}
writeFileSync('docs/validation/survival-v0.5/lan-check.json',JSON.stringify(evidence,null,2)+'\n');
console.log(`${evidence.assets.length} assets served with correct MIME`);
