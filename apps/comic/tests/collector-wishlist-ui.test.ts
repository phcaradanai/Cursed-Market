import test from 'node:test';import assert from 'node:assert/strict';import {createElement} from 'react';import {renderToStaticMarkup} from 'react-dom/server';
import type {AppraisalView} from '../src/game/appraisal/types.js';
import {previewRooms} from '../src/appraisal-client/comic-preview-data.js';
const target='../src/appraisal-client/CollectorWishlist.js';
test('Collector request uses public choices, paired controls and a fixed six-item page without hidden truths',async()=>{
 const {CollectorWishlist}=await import(target);assert.equal(typeof CollectorWishlist,'function');const game=structuredClone(previewRooms.inspection!.game!) as AppraisalView;
 const kinds=[...game.self.inventory,...game.self.stock].slice(0,6).map(i=>({kind:i.kind,name:i.kind,image:'/art/known.png'}));game.self.collectorWishlist={request:{available:true,kinds,dueAt:4}};
 const html=renderToStaticMarkup(createElement(CollectorWishlist,{game,submit:()=>{},disabled:false}));assert(html.includes('collector-choices'));assert(html.includes('0 / 3'));assert(html.includes('ส่งคำขอ'));assert(!html.includes('<details'));assert(!html.includes('genuine'));assert(!html.includes('cursed'));
});

test('Collector delivery renders five opaque slots, one common bill and no item truth or hidden art',async()=>{
 const {CollectorWishlist}=await import(target);const game=structuredClone(previewRooms.inspection!.game!) as AppraisalView;game.self.collectorWishlist={request:{available:false,kinds:[],dueAt:6},delivery:{id:'b',quoteId:'b:30:2:1',status:'open',cost:{price:30,fee:2,total:32,energy:1},canBuy:true,canPeek:true,slots:Array.from({length:5},(_,i)=>({id:'s'+i}))}};
 const html=renderToStaticMarkup(createElement(CollectorWishlist,{game,submit:()=>{},disabled:false}));assert.equal((html.match(/class="comic-button[^"]* collector-slot"/g)??[]).length,5);assert(!html.includes('<img'));assert(!html.includes('มูลค่าจริง'));assert(!html.includes('ความแท้'));assert(!html.includes('คำสาป'));assert(html.includes('ซื้อช่องนี้'));assert(!html.includes('ยืนยันซื้อ</button>'));
});
test('pending and expired views show only their actual rights without fake active controls',async()=>{
 const {CollectorWishlist}=await import(target);const game=structuredClone(previewRooms.inspection!.game!) as AppraisalView;game.self.collectorWishlist={request:{available:false,kinds:[],dueAt:6},pending:{id:'p',kinds:[],requestedAt:2,dueAt:4}};
 let html=renderToStaticMarkup(createElement(CollectorWishlist,{game,submit:()=>{},disabled:false}));assert(html.includes('พบกันช่วง 4'));assert(!html.includes('<button'));delete game.self.collectorWishlist.pending;html=renderToStaticMarkup(createElement(CollectorWishlist,{game,submit:()=>{},disabled:false}));assert(html.includes('สิทธิ์ช่วงนี้สิ้นสุดแล้ว'));assert(!html.includes('<button'));delete game.self.collectorWishlist;html=renderToStaticMarkup(createElement(CollectorWishlist,{game,submit:()=>{},disabled:false}));assert(html.includes('บริการ Collector สิ้นสุดแล้ว'));
});

test('finishing appraisal visibly warns on the actual button that remaining Collector rights close',async()=>{
 const {GameTable}=await import('../src/appraisal-client/App.js');const room=structuredClone(previewRooms.inspection!);room.game!.self.collectorWishlist={request:{available:true,kinds:[],dueAt:4}};const html=renderToStaticMarkup(createElement(GameTable,{room,submit:()=>{},send:()=>true,disabled:false}));assert(html.includes('จบประเมิน · ปิดสิทธิ์ Collector</button>'));
});
