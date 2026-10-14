import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { existsSync } from 'node:fs';
import { AppraisalRoomService } from '../src/server/appraisal-rooms.js';
import { parseAppraisalMessage } from '../src/server/appraisal-messages.js';
import type { AppraisalClientMessage, AppraisalServerMessage, AppraisalTimerSettings } from '../src/shared/appraisal-protocol.js';
import type { LifecyclePeer } from '../src/server/room-lifecycle.js';
import { analyseAppraisalMatchAudit } from '../src/playtest/appraisal-report.js';
import { GameTable, RoomTimers } from '../src/appraisal-client/App.js';
import { DarkMarket } from '../src/appraisal-client/components.js';
import { ITEM_SPECS, itemImage } from '../src/game/appraisal/content.js';
import type { ItemKind } from '../src/game/appraisal/types.js';
import { appraisalViewFor } from '../src/game/appraisal/views.js';
import { appraisalFixture } from './support/appraisal-fixture.js';

class Client implements LifecyclePeer<AppraisalServerMessage> {
  messages:AppraisalServerMessage[]=[];send(m:AppraisalServerMessage){this.messages.push(structuredClone(m));}close(){}
  get room(){const m=this.messages.findLast(m=>m.type==='state');assert(m?.type==='state');return m.room;}
  get error(){const m=this.messages.findLast(m=>m.type==='error');assert(m?.type==='error');return m;}
}
const settings=(enabled=true):AppraisalTimerSettings=>({enabled,durationsMs:{PORTALS:7000,APPRAISAL:11000,TRADE:13000,REVEAL:2000}});
function setup(count=3) {
  let now=1000;const rooms=new AppraisalRoomService(()=>now);const clients=Array.from({length:count},()=>new Client());const host=clients[0]!;
  rooms.receive(host,{type:'create',name:'host'});for(const c of clients.slice(1))rooms.receive(c,{type:'join',name:'guest',roomCode:host.room.code});
  let request=0;
  const send=(c:Client,m:AppraisalClientMessage)=>rooms.receive(c,m);
  const ready=()=>{for(const c of clients)send(c,{type:'ready',ready:true});};
  const start=()=>{ready();send(host,{type:'start'});assert(host.room.game);};
  const act=(c:Client)=>send(c,{type:'action',matchId:c.room.matchId!,action:{type:'done',encounter:c.room.game!.encounter,requestId:`timer-test-${++request}`}});
  const shift=(ms:number)=>{now+=ms;rooms.tick();};
  const finish=()=>{
    for(let i=0;host.room.game!.phase!=='RESULTS' && i<100;i++){
      if(host.room.game!.phase==='REVEAL'){const encounter=host.room.game!.encounter;for(const c of clients)send(c,{type:'reveal-ready',matchId:host.room.matchId!,encounter});}
      else {const c=clients.find(c=>!c.room.game!.self.done&&!c.room.game!.self.paused);assert(c);act(c);}
      now+=10;
    }
    assert.equal(host.room.game!.phase,'RESULTS');send(host,{type:'audit',matchId:host.room.matchId!});const m=host.messages.findLast(m=>m.type==='audit');assert(m?.type==='audit');analyseAppraisalMatchAudit(m.audit);return m.audit;
  };
  return {rooms,clients,host,send,ready,start,act,shift,finish,get now(){return now;}};
}

test('timer parser strictly accepts booleans and whole 1–900 second values for all four phases',()=>{
  assert.deepEqual(parseAppraisalMessage({type:'timer-settings',settings:settings(false)}),{type:'timer-settings',settings:settings(false)});
  for(const change of [{enabled:'false'},{durationsMs:{...settings().durationsMs,PORTALS:0}},{durationsMs:{...settings().durationsMs,PORTALS:1500}},{durationsMs:{...settings().durationsMs,PORTALS:901000}},{durationsMs:{...settings().durationsMs,RESULTS:1000}},{durationsMs:{PORTALS:7000}},{seed:'lucky'},{playerId:'host'}])assert.throws(()=>parseAppraisalMessage({type:'timer-settings',settings:{...settings(),...change}}));
  assert.throws(()=>parseAppraisalMessage({type:'timer-settings',settings:settings(),playerId:'host'}));
});
test('only lobby host changes settings, resets readiness, persists through join/resume/host transfer and rematch',()=>{
  const s=setup();s.ready();s.send(s.clients[1]!,{type:'timer-settings',settings:settings(false)});assert.equal(s.clients[1]!.error.code,'host-only');assert(s.host.room.seats.every(p=>p.ready));
  s.send(s.host,{type:'timer-settings',settings:settings(false)});assert(s.host.room.seats.every(p=>!p.ready));assert.deepEqual(s.clients[1]!.room.timerSettings,settings(false));
  s.ready();s.send(s.host,{type:'timer-settings',settings:{durationsMs:{REVEAL:2000,TRADE:13000,APPRAISAL:11000,PORTALS:7000},enabled:false}});assert(s.host.room.seats.every(p=>p.ready));
  s.send(s.host,{type:'start'});assert.equal(s.host.room.deadline,null);s.send(s.host,{type:'timer-settings',settings:settings(true)});assert.equal(s.host.error.code,'match-started');assert.equal(s.host.room.timerSettings!.enabled,false);
  s.finish();s.send(s.host,{type:'rematch'});assert.deepEqual(s.host.room.timerSettings,settings(false));assert(s.host.room.seats.every(p=>!p.ready));
  s.rooms.disconnect(s.host);const successor=s.clients[1]!;assert.equal(successor.room.hostId,successor.room.yourSeatId);s.send(successor,{type:'timer-settings',settings:settings(true)});assert.deepEqual(successor.room.timerSettings,settings(true));
  const resumed=new Client();s.send(resumed,{type:'resume',roomCode:successor.room.code,token:s.host.messages.find(m=>m.type==='joined')!.token});assert.deepEqual(resumed.room.timerSettings,settings(true));
});
for(const count of [2,3,4])test(`untimed ${count}-seat run has no expiry, waits for manual completion and exports replayable audit without timeouts`,()=>{
  const s=setup(count);s.send(s.host,{type:'timer-settings',settings:settings(false)});s.start();const revision=s.host.room.game!.revision;
  s.shift(60*60*1000);assert.equal(s.host.room.game!.revision,revision);assert.equal(s.host.room.deadline,null);assert.equal(s.host.room.game!.phase,'PORTALS');
  const audit=s.finish();assert.equal(audit.timeouts.length,0);assert.deepEqual(audit.timerSettings,settings(false));assert.equal(audit.run.history.length,count*3);
  const forged=structuredClone(audit);forged.timeouts.push({at:forged.phaseTimes[0]!.startedAt,encounter:1,phase:'PORTALS',playerId:forged.seats[0]!.id});assert.throws(()=>analyseAppraisalMatchAudit(forged),/untimed/);
});
test('custom phase deadlines expire once, do not extend on action, and differ between rooms',()=>{
  const s=setup();s.send(s.host,{type:'timer-settings',settings:settings()});s.start();assert.equal(s.host.room.deadline,s.now+7000);
  const deadline=s.host.room.deadline;s.act(s.host);assert.equal(s.host.room.deadline,deadline);s.shift(7001);
  assert.notEqual(s.host.room.game!.phase,'PORTALS');const phase=s.host.room.game!.phase;assert.equal(s.host.room.deadline,s.now+settings().durationsMs[phase as 'APPRAISAL'|'TRADE']);
  const second=new Client();s.send(second,{type:'create',name:'separate'});assert.equal(second.room.timerSettings!.durationsMs.PORTALS,30000);assert.equal(second.room.timerSettings!.enabled,true);
  const audit=s.finish();assert(audit.timeouts.length>0);assert.deepEqual(audit.timerSettings,settings());
});
test('untimed disconnect retains pending seat and safe resume without inventing timeout actions',()=>{
  const s=setup(2);s.send(s.host,{type:'timer-settings',settings:settings(false)});s.start();const guest=s.clients[1]!,joined=guest.messages.find(m=>m.type==='joined')!;
  s.rooms.disconnect(guest);s.act(s.host);s.shift(500000);assert.equal(s.host.room.game!.phase,'PORTALS');assert.equal(s.host.room.deadline,null);
  const resumed=new Client();s.send(resumed,{type:'resume',roomCode:s.host.room.code,token:joined.token});assert.deepEqual(resumed.room.timerSettings,settings(false));s.act(resumed);assert.notEqual(resumed.room.game!.phase,'PORTALS');
});
test('settings controls disclose units and untimed waits, are host-only, and preserve old server compatibility',()=>{
  const s=setup();s.send(s.host,{type:'timer-settings',settings:settings(false)});
  const host=renderToStaticMarkup(createElement(RoomTimers,{room:s.host.room,send:()=>true,disabled:false}));assert(host.includes('ไม่จับเวลา'));assert(host.includes('บันทึกเวลาของห้อง'));assert(host.includes('คนที่หลุดต้องกลับมา'));assert(host.includes('min="1" max="900"'));assert.equal((host.match(/type="number"/g)??[]).length,4);
  const guest=renderToStaticMarkup(createElement(RoomTimers,{room:s.clients[1]!.room,send:()=>true,disabled:false}));assert(guest.includes('ไม่จับเวลา'));assert(!guest.includes('<input'));
  const older={...s.host.room};delete older.timerSettings;assert(!renderToStaticMarkup(createElement(RoomTimers,{room:older,send:()=>true,disabled:false})).includes('บันทึกเวลาของห้อง'));
});
test('Dark Market renders existing family image paths for every one of the 30 products',()=>{
  const state=appraisalFixture(),game=appraisalViewFor(state,'alice');game.market.open=true;
  for(const kind of Object.keys(ITEM_SPECS) as ItemKind[]){game.market.orders=[{id:`quote-${kind}`,kind,price:20,quota:{alice:1}}];const html=renderToStaticMarkup(createElement(DarkMarket,{game,submit:()=>{},disabled:false}));assert(html.includes(`src="${itemImage(kind)}"`),kind);assert(existsSync(`src/appraisal-client/public${itemImage(kind)}`),kind);}
});
test('done-state waiting copy promises timeout only when the room has timers enabled',()=>{
  for(const enabled of [false,true]){
    const s=setup(2);s.send(s.host,{type:'timer-settings',settings:settings(enabled)});s.start();s.act(s.host);assert(s.host.room.game!.self.done);
    const html=renderToStaticMarkup(createElement(GameTable,{room:s.host.room,submit:()=>{},send:()=>true,disabled:false}));
    assert.equal(html.includes('คุณจบช่วงนี้แล้ว รอเพื่อนหรือหมดเวลาเพื่อไปต่อ'),enabled);
    assert.equal(html.includes('คุณจบช่วงนี้แล้ว รอเพื่อนจบช่วงเพื่อไปต่อ'),!enabled);
  }
});
