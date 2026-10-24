import test from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {GameTable} from '../src/appraisal-client/App.js';
import {DialogFeedback,GameDialog} from '../src/appraisal-client/GameDialog.js';
import {appraisalViewFor} from '../src/game/appraisal/index.js';
import type {AppraisalRoomView} from '../src/shared/appraisal-protocol.js';
import {appraisalFixture} from './support/appraisal-fixture.js';

function render(state=appraisalFixture()):string {
  const seats=state.players.map(p=>({id:p.id,name:p.id,connected:true,ready:true}));
  const room:AppraisalRoomView={rulesVersion:'0.5',mode:'classic',code:'ABC234',hostId:'alice',yourSeatId:'alice',seats,matchSeats:seats,playtestMode:'no-voice',matchId:'cabinet',deadline:null,serverTime:1000,revealReady:[],game:appraisalViewFor(state,'alice')};
  return renderToStaticMarkup(createElement(GameTable,{room,submit:()=>{},send:()=>true,disabled:false}));
}

test('game settings are named and reachable alongside the cabinet tools',()=>{
  const html=render();
  assert.match(html,/<button[^>]*aria-label="ตั้งค่า"[^>]*aria-haspopup="dialog"/);
  for(const label of ['กระเป๋า','สถานะ','Dark Market','สมุดบันทึก','กติกา'])assert(html.includes(label),label);
});

test('cabinet selection never reveals a hidden value while showing the public selling price',()=>{
  const state=appraisalFixture();const player=state.players[0]!;
  const item=state.items[player.stock[0]!]!;item.base=987;player.knowledge[item.id]={};
  const html=render(state);
  assert(!html.includes('987'),'uninspected true value must not become a cabinet label');
  assert.match(html,/aria-label="สิ่งที่รู้แล้ว"/);
});

test('empty cabinet stock leaves the phase exit available',()=>{
  const state=appraisalFixture();state.players[0]!.stock=[];
  const html=render(state);
  assert(html.includes('ไม่มีของเหลือในร้าน'));
  assert(html.includes('จบการประเมิน ไปต่อรอง'));
  assert(!html.includes('aria-label="สินค้าของพ่อค้า"'),'empty stock does not invent placeholder products');
});

test('server rejection is readable inside the active utility dialog',()=>{
  const html=renderToStaticMarkup(createElement(DialogFeedback.Provider,{value:{busy:false,error:'ข้อเสนอหมดอายุ ลองเลือกใหม่',clearError:()=>{}}},createElement(GameDialog,{open:true,label:'Dark Market',onClose:()=>{},children:'รายการซื้อขาย'})));
  assert(html.includes('ข้อเสนอหมดอายุ ลองเลือกใหม่'));
  assert(html.includes('role="alert"'));
  assert(html.includes('ปิดข้อความ'));
});

test('the active utility dialog announces an in-flight decision',()=>{
  const html=renderToStaticMarkup(createElement(DialogFeedback.Provider,{value:{busy:true,error:null,clearError:()=>{}}},createElement(GameDialog,{open:true,label:'กระเป๋า',onClose:()=>{},children:'วัตถุที่ถืออยู่'})));
  assert(html.includes('role="status"'));
  assert(html.includes('กำลังส่งการตัดสินใจ'));
});

test('connection loss and seat recovery remain available above a native modal',()=>{
  const html=renderToStaticMarkup(createElement(DialogFeedback.Provider,{value:{busy:false,error:null,clearError:()=>{},networkMessage:'แท็บอื่นรับช่วงที่นั่งนี้แล้ว',reconnect:()=>{}}},createElement(GameDialog,{open:true,label:'กระเป๋า',onClose:()=>{},children:'วัตถุที่ถืออยู่'})));
  assert(html.includes('แท็บอื่นรับช่วงที่นั่งนี้แล้ว'));
  assert(html.includes('role="status"'));
  assert(html.includes('กลับมาเล่นในแท็บนี้'));
});
