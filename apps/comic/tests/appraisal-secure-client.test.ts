import {outcomeBetween} from '../src/appraisal-client/model.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createAppraisalRun,appraisalViewFor,SURVIVAL_RULES} from '../src/game/appraisal/index.js';
import {TheftPanel,VaultPanel,FinancePanel} from '../src/appraisal-client/SecureEconomy.js';
import {SealPanel} from '../src/appraisal-client/SinnerSeals.js';
import {setLang} from '../src/appraisal-client/i18n.js';
import type {AppraisalView} from '../src/game/appraisal/types.js';

function view():AppraisalView {
  const state=createAppraisalRun(['alice','bob'],'secure-client-tests',{survival:{...SURVIVAL_RULES},secureEconomy:true,marketProbability:0});
  state.players[0]!.stock=[...state.players[0]!.portals[0]!.stock];
  const game=appraisalViewFor(state,'alice');game.phase='APPRAISAL';return game;
}
const submit=()=>undefined;

test('theft duel shows sealed hand choices, translated player names and draw history without percentage odds',()=>{
  setLang('th');const game=view();
  game.theft={duels:[{id:'duel',thiefId:'bob',victimId:'alice',round:2,status:'open',needsChoice:true,submitted:false,revealed:[{thief:'rock',opponent:'rock'}]}],targets:[],seals:[],compensation:[]};
  game.self.done=true;
  const html=renderToStaticMarkup(createElement(TheftPanel,{game,submit,disabled:false,playerNames:{bob:'บ๊อบ'}}));
  assert.match(html,/ป้องกันของจาก/);assert.match(html,/บ๊อบ/);
  for(const hand of ['ค้อน','กระดาษ','กรรไกร'])assert.match(html,new RegExp(hand));
  assert.match(html,/เสมอ/);assert.doesNotMatch(html,/%|<select|disabled=""/);
  game.theft.duels[0]!.submitted=true;game.theft.duels[0]!.needsChoice=false;
  const waiting=renderToStaticMarkup(createElement(TheftPanel,{game,submit,disabled:false}));
  assert.match(waiting,/ส่งมือแล้ว/);assert.doesNotMatch(waiting,/secure-hands/);
  const now=Date.now();
  const clocked=renderToStaticMarkup(createElement(TheftPanel,{game,submit,disabled:false,deadlines:{duel:now+20000},serverTime:now}));
  assert.match(clocked,/role="timer"/);assert.match(clocked,/ส่งมือภายใน (19|20) วินาที/);
  setLang('en');assert.match(renderToStaticMarkup(createElement(TheftPanel,{game,submit,disabled:false,deadlines:{duel:now+20000},serverTime:now})),/Play a hand within (19|20)s/);setLang('th');
  assert.doesNotMatch(renderToStaticMarkup(createElement(TheftPanel,{game,submit,disabled:false,deadlines:{},serverTime:now})),/role="timer"/);
});

test('vault appears after payout only, explains suppressed effects and deferred interest, and shows slot price',()=>{
  setLang('th');const game=view();
  assert.equal(renderToStaticMarkup(createElement(VaultPanel,{game,submit,disabled:false})), '');
  game.phase='REVEAL';game.self.roundReward={encounter:game.encounter,base:10,amount:10,flips:0,settled:false};
  assert.equal(renderToStaticMarkup(createElement(VaultPanel,{game,submit,disabled:false})), '');
  game.self.roundReward.settled=true;
  const html=renderToStaticMarkup(createElement(VaultPanel,{game,submit,disabled:false}));
  assert.match(html,/เริ่มต้นฟรี 2 ช่อง/);assert.match(html,/ไม่มีผลบวกหรือลบ/);assert.match(html,/ดอกเบี้ย 4%/);
  assert.match(html,/10 เครดิต/);assert.doesNotMatch(html,/<select/);
  game.self.paused='dead';assert.equal(renderToStaticMarkup(createElement(VaultPanel,{game,submit,disabled:false})), '');
});

test('finance offers one notice at portals that clears every case',()=>{
  setLang('th');const game=view();game.phase='PORTALS';
  game.theft={duels:[],targets:[],seals:[],compensation:[],crime:{failures:1,banStartsEncounter:2,banUntilEncounter:2,active:false,noticePrice:200,cases:3}};
  game.self.credits=200;
  const html=renderToStaticMarkup(createElement(FinancePanel,{game,submit,disabled:false}));
  assert.match(html,/ซื้อใบประกาศอาชญากร/);assert.match(html,/200 เครดิต/);assert.match(html,/3 คดี/);assert.doesNotMatch(html,/disabled=""/);
  game.self.credits=199;
  assert.match(renderToStaticMarkup(createElement(FinancePanel,{game,submit,disabled:false})),/disabled=""/);
});

test('loan contract exposes deadline, installments and custom terms as inert text, with no dropdown',()=>{
  setLang('th');const game=view();
  const item=game.self.stock[0]??{id:'public-item',kind:'mirror',name:'Mirror',image:'/art/items/mirror.webp',owner:'collateral:loan',npc:'orc',ask:40,appraisal:null,lockedUntil:null,price:40,appraisalAccepted:null,knowledge:{},certificate:false,possibleBenefit:'',possibleDrawback:'',condition:{statusId:'D09',discount:0,available:false,required:false}};
  game.loans=[{id:'loan',borrowerId:'alice',lenderId:'bob',itemId:item.id,collateralValue:40,principal:20,repaid:5,proposedAt:1,firstPayoutAt:1,dueAt:4,fundedAt:1,terms:'<script>unsafe</script>',status:'active',item}];
  const html=renderToStaticMarkup(createElement(FinancePanel,{game,submit,disabled:false,playerNames:{bob:'บ๊อบ'}}));
  assert.match(html,/ครบกำหนดท้ายช่วง 4/);assert.match(html,/เหลือ 15 เครดิต/);assert.match(html,/ผ่อนคืน/);assert.match(html,/บ๊อบ/);
  assert.match(html,/&lt;script&gt;unsafe&lt;\/script&gt;/);assert.doesNotMatch(html,/<script>|<select/);
});

test('secure economy surfaces have English copy and remain absent in legacy runs',()=>{
  setLang('en');try {
    const game=view();game.phase='REVEAL';game.self.roundReward={encounter:game.encounter,base:10,amount:10,flips:0,settled:true};
    const html=renderToStaticMarkup(createElement(VaultPanel,{game,submit,disabled:false}));
    assert.match(html,/Deposit and withdraw credits/);assert.match(html,/Interest is 4% of the whole vault balance/);
    game.secureEconomy=false;
    for(const Component of [VaultPanel,FinancePanel,TheftPanel])assert.equal(renderToStaticMarkup(createElement(Component,{game,submit,disabled:false})), '');
  } finally {setLang('th');}
});

test('vault custody notifications do not report destroyed goods or lost money',()=>{
  setLang('th');const before=view();const item=before.self.stock[0]!;before.self.inventory=[{...item,owner:before.self.id}];
  const after=structuredClone(before);after.self.inventory=[];after.self.credits-=10;
  after.self.personalVault={items:[{...item,owner:`personal-vault:${before.self.id}`}],credits:10,slots:2,nextSlotPrice:10,nextInterest:0};
  const outcome=outcomeBetween(before,after)!;assert(outcome);
  assert.match(outcome.lines.join(' '),/ฝาก.*คลัง/);
  assert.doesNotMatch([outcome.title,...outcome.lines].join(' '),/เสีย |−10|-10/);
});

test('seal panel shows face-down redemption cards with no item identity, plain-text terms and compensation',()=>{
  setLang('th');const game=view();
  game.sealMarket={holdings:[{thiefId:'bob',count:2}],offers:[{id:'seal-offer:1',sealId:'s1',holderId:'bob',buyerId:game.self.id,credits:5,energy:1,life:0,goods:0,terms:'<script>x</script>',encounter:1,status:'open',thiefId:'cara'}],redemption:{id:'seal-redemption:1',thiefId:'bob',slots:[0,1,2]}};
  game.theft={duels:[],targets:[],seals:[{id:'s9',thiefId:'cara'}],compensation:[{id:'c',role:'payer',otherId:'bob',amount:5,remaining:[3,4],paid:5}]};
  const html=renderToStaticMarkup(createElement(SealPanel,{game,submit,disabled:false,playerNames:{bob:'บ๊อบ'}}));
  assert.match(html,/ไพ่ใบที่ 1/);assert.match(html,/ไพ่ใบที่ 3/);assert.match(html,/ตราของ บ๊อบ × 2/);
  assert.match(html,/&lt;script&gt;x&lt;\/script&gt;/);assert.doesNotMatch(html,/<script>|<select/);
  assert.match(html,/ค่าชดเชยให้ บ๊อบ: 5 เครดิต/);
  setLang('en');
  assert.match(renderToStaticMarkup(createElement(SealPanel,{game,submit,disabled:false})),/Card 2/);
  setLang('th');
});

test('vault pages carried/stored goods without expansion, keeps full/locked reasons, and renders no cash-out',()=>{
 const game=view(),item=game.self.stock[0]!;
 game.phase='REVEAL';game.self.roundReward={encounter:game.encounter,base:10,amount:10,flips:0,settled:true};
 game.self.inventory=Array.from({length:5},(_,n)=>({...item,id:`carried-${n}`,lockedUntil:n===0?game.encounter:null}));
 game.self.personalVault={items:Array.from({length:4},(_,n)=>({...item,id:`stored-${n}`})),credits:40,slots:4,nextSlotPrice:20,nextInterest:1};
 const html=renderToStaticMarkup(createElement(VaultPanel,{game,submit,disabled:false}));
 assert(html.includes('1 / 3'));assert(html.includes('1 / 2'));assert(html.includes('สินค้าติดล็อก ฝากไม่ได้'));assert(html.includes('คลังเต็ม เพิ่มช่องหรือถอนของก่อน'));
 assert(!html.includes('<details'));assert(!/<button[^>]*>รับเลย/.test(html));assert(!html.includes('carried-4'));
});
test('settled destination has one ready action, no duplicate reward, and respects readiness/spectators',async()=>{
 const {GameTable}=await import('../src/appraisal-client/App.js');const {previewRooms}=await import('../src/appraisal-client/comic-preview-data.js');
 const room=structuredClone(previewRooms.inspection!),game=room.game!;game.phase='REVEAL';game.secureEconomy=true;game.self.eventOffer=null;
 game.self.roundReward={encounter:game.encounter,base:10,amount:10,flips:0,settled:true};
 const render=()=>renderToStaticMarkup(createElement(GameTable,{room,submit,send:()=>true,disabled:false}));
 let html=render();assert(html.includes('post-reward-screen'));assert.equal((html.match(/>พร้อมไปช่วงถัดไป</g)??[]).length,1);assert(!/<button[^>]*>รับเลย/.test(html));assert(!html.includes('coin-heads'));
 room.revealReady=[room.yourSeatId];html=render();assert(html.includes('พร้อมแล้ว รอผู้ที่ยังมีชีวิต'));assert(html.includes('ยืนยันไปต่อแล้ว หรือกำลังรอการเชื่อมต่อ'));
 game.self.life=0;html=render();assert(!html.includes('vault-spread'));assert(html.includes('โลกวิญญาณ'));assert(html.includes('เริ่มมินิเกม'));assert(!html.includes('พร้อมไปช่วงถัดไป</button>'));
});
test('settled reward may be hidden by its phase owner without another payment control',async()=>{
 const {RoundReward}=await import('../src/appraisal-client/RoundReward.js');
 const html=renderToStaticMarkup(createElement(RoundReward,{reward:{encounter:1,base:10,amount:10,flips:0,settled:true},submit,disabled:false,onTossing:()=>{},hideSettled:true}));assert.equal(html,'');
});
