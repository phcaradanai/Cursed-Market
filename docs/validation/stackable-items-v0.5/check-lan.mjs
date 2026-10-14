import assert from 'node:assert/strict';
import {WebSocket} from 'ws';
const clients=[];
const open=()=>new Promise(resolve=>{const ws=new WebSocket('ws://192.168.10.150:3112/socket');const c={ws,room:null,messages:[]};ws.on('message',raw=>{const m=JSON.parse(raw);c.messages.push(m);if(m.type==='state')c.room=m.room;});ws.on('open',()=>resolve(c));});
const wait=async(fn)=>{const until=Date.now()+5000;while(!fn()){if(Date.now()>until)throw Error('LAN wait timed out');await new Promise(r=>setTimeout(r,10));}};
const send=(c,m)=>c.ws.send(JSON.stringify(m));let request=0;
const act=async(c,body)=>{const id='lan-check-'+ ++request;send(c,{type:'action',matchId:c.room.matchId,action:{...body,encounter:c.room.game.encounter,requestId:id}});await wait(()=>c.messages.some(m=>(m.type==='ack'||m.type==='error')&&m.requestId===id));const reply=c.messages.find(m=>m.requestId===id);assert.equal(reply.type,'ack',JSON.stringify(reply));await wait(()=>c.room.game.revision>=(c.messages.findLast(m=>m.type==='state')?.room.game.revision??0));};
try {
 const a=await open(),b=await open();clients.push(a,b);send(a,{type:'create',name:'LAN timing QA'});await wait(()=>a.room);send(b,{type:'join',name:'LAN timing peer',roomCode:a.room.code});await wait(()=>b.room);for(const c of clients)send(c,{type:'ready',ready:true});await wait(()=>a.room.seats.every(s=>s.ready));send(a,{type:'start'});await wait(()=>clients.every(c=>c.room.game?.phase==='PORTALS'));
 for(const c of clients){const offer=c.room.game.self.eventOffer;if(offer)await act(c,{type:'event',key:offer.key,choice:'decline'});await act(c,{type:'enter',portalId:c.room.game.self.portals.find(p=>!p.disabled).id});await new Promise(r=>setTimeout(r,20));}
 await wait(()=>clients.every(c=>c.room.game.phase==='APPRAISAL'));
 for(const c of clients){const offer=c.room.game.self.eventOffer;if(offer)await act(c,{type:'event',key:offer.key,choice:'decline'});}
 assert.equal(a.room.game.passives,true);
 const item=a.room.game.self.stock[0];assert.equal(item.range,undefined);assert.equal(item.knowledge.range,undefined);assert.equal(item.knowledge.base,undefined);
 const energy=a.room.game.self.energy;await act(a,{type:'inspect',itemId:item.id,property:'price'});await wait(()=>!!a.room.game.self.stock[0].knowledge.range || a.room.game.self.stock[0].knowledge.base!==undefined);
 const inspected=a.room.game.self.stock[0];assert(a.room.game.self.energy<energy);assert.equal(a.room.game.self.stock[1].range,undefined);
 console.log(JSON.stringify({ok:true,passives:a.room.game.passives,url:'http://192.168.10.150:3112',merchantHints:a.room.game.self.portals.map(p=>p.hint),item:item.id,before:{range:item.range??null,knowledge:item.knowledge},after:{range:inspected.range,knowledge:inspected.knowledge},energyBefore:energy,energyAfter:a.room.game.self.energy,otherItemRange:a.room.game.self.stock[1].range??null},null,2));
}finally{for(const c of clients)c.ws.close();}
