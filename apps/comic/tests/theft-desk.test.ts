import test from 'node:test';import assert from 'node:assert/strict';import {createElement} from 'react';import {renderToStaticMarkup} from 'react-dom/server';
import {previewRooms} from '../src/appraisal-client/comic-preview-data.js';import {TheftPanel} from '../src/appraisal-client/SecureEconomy.js';import {GameTable} from '../src/appraisal-client/App.js';import {setLang} from '../src/appraisal-client/i18n.js';
function room(){const r=structuredClone(previewRooms.inspection!);const g=r.game!;g.secureEconomy=true;g.self.eventOffer=null;g.self.done=false;g.theft={duels:[],targets:[{playerId:g.players.find(p=>p.id!==g.self.id)!.id}],seals:[],compensation:[]};return r;}
test('target desk uses shared fixed menu, shows actual target costs, and never expands a details list',()=>{
 setLang('th');const r=room(),props={game:r.game!,submit:()=>{},disabled:false,deskOpen:true,onDeskClose:()=>{}};const html=renderToStaticMarkup(createElement(TheftPanel,props));assert(html.includes('comic-menu theft-desk'));assert(!html.includes('<details'));assert(html.includes('ใช้ 1 พลัง'));assert(html.includes('ความเชื่อใจ'));assert(html.includes('ตราคนบาป'));assert(html.includes('ของเป้าหมายยังคว่ำอยู่'));assert(!html.includes('secure-economy theft-table'));
});
test('secure game has a read-only theft navigation button instead of a permanent panel below the phase',()=>{
 const r=room(),html=renderToStaticMarkup(createElement(GameTable,{room:r,submit:()=>{},send:()=>true,disabled:false}));assert(html.includes('aria-label="ขโมยและผลดวล"'));assert(!html.includes('class="secure-economy theft-table"'));assert(html.includes('appraisal-stage'));
});
test('closed duel history is bounded and has no hand submission or hidden item metadata',()=>{
 const r=room(),g=r.game!;g.self.stealTried=['spent'];g.theft!.duels=[{id:'closed',thiefId:g.self.id,victimId:g.theft!.targets[0]!.playerId,round:12,status:'lost',submitted:false,needsChoice:false,revealed:Array.from({length:12},()=>({thief:'rock' as const,opponent:'rock' as const}))}];const props={game:g,submit:()=>{},disabled:false,deskOpen:true,onDeskClose:()=>{}};const html=renderToStaticMarkup(createElement(TheftPanel,props));assert(!html.includes('<details'));assert(!html.includes('secure-duel-rounds'));assert(!html.includes('data-hand='));assert(html.includes('ดูผลดวล'));assert(html.includes('ใช้โอกาสขโมยช่วงนี้แล้ว'));
});

test('a carried crime record remains reviewable when the current encounter has no duel history',()=>{
 const r=room(),g=r.game!;g.theft!.crime={failures:1,banStartsEncounter:1,banUntilEncounter:3,active:true,noticePrice:24,cases:1};const html=renderToStaticMarkup(createElement(TheftPanel,{game:g,submit:()=>{},disabled:false,deskOpen:true,onDeskClose:()=>{}}));const action=html.match(/class="comic-menu-actions">(<button[^>]*>)/)?.[1];assert(action);assert(!action.includes('disabled'), 'the existing crime record must not be trapped behind an unavailable history action');
});

test('secure storage alone does not advertise an unavailable theft action when core2 is off',()=>{
 const r=room();delete r.game!.core2;const html=renderToStaticMarkup(createElement(GameTable,{room:r,submit:()=>{},send:()=>true,disabled:false}));assert(!/<button[^>]*aria-label="ขโมยและผลดวล"/.test(html));
});

test('pending merchant item selection blocks target actions without blocking read-only history',()=>{
 const r=room(),g=r.game!;g.self.abilityChoice={npc:'alien',sourceId:g.self.inventory[0]!.id,itemIds:[g.self.stock[0]!.id]};g.theft!.duels=[{id:'past',thiefId:g.players.find(p=>p.id!==g.self.id)!.id,victimId:g.self.id,round:1,status:'lost',needsChoice:false,submitted:false,revealed:[]}];const html=renderToStaticMarkup(createElement(TheftPanel,{game:g,submit:()=>{},disabled:false,deskOpen:true,onDeskClose:()=>{}}));const targets=html.match(/<button[^>]*class="[^"]*theft-target-item[^"]*"[^>]*>/g)??[];assert(targets.length>0);assert(targets.every(b=>b.includes('disabled')));assert(!(html.match(/class="comic-menu-actions">(<button[^>]*>)/)?.[1]??'disabled').includes('disabled'));
});
