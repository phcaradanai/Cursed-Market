import test from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {GameTable} from '../src/appraisal-client/App.js';
import {previewRooms} from '../src/appraisal-client/comic-preview-data.js';
import type {AppraisalView} from '../src/game/appraisal/types.js';
import {setLang} from '../src/appraisal-client/i18n.js';
const room=()=>{const r=structuredClone(previewRooms.inspection!);r.game!.self.eventOffer=null;r.game!.self.done=false;return r;};
const render=(r:ReturnType<typeof room>)=>renderToStaticMarkup(createElement(GameTable,{room:r,submit:()=>{},send:()=>true,disabled:false}));
const images=(html:string,kind:string)=>[...html.matchAll(new RegExp(`<img class="${kind}"[^>]*src="([^"]+)"`,'g'))].map(m=>m[1]!);
test('unselected portals stay idle regardless of trust or closed state',()=>{
 setLang('th');const r=room(),g=r.game!;g.phase='PORTALS';g.self.selectedPortalId=null;
 g.self.portals.forEach(p=>{g.self.npcTrust??={};g.self.npcTrust[p.npc]=10;});g.self.portals[0]!.disabled=true;
 const urls=images(render(r),'gate-figure');assert.equal(urls.length,g.self.portals.length);assert(urls.every(u=>u.endsWith('/idle.png')));
});
test('confirmed portal selection smiles and unselected merchants become angry',()=>{
 const r=room(),g=r.game!;g.phase='PORTALS';g.self.done=true;g.self.selectedPortalId=g.self.portals[1]!.id;
 const urls=images(render(r),'gate-figure');g.self.portals.forEach((p,i)=>assert(urls[i]!.endsWith(p.id===g.self.selectedPortalId?'/smile.png':'/angry.png')));
});
test('appraisal portrait follows the known merchant result, never accumulated trust',()=>{
 for(const [accepted,mood] of [[null,'idle'],[true,'smile'],[false,'angry']] as const){
  const r=room(),g=r.game!;g.phase='APPRAISAL';g.self.stock[0]!.appraisalAccepted=accepted;
  const npc=g.self.portals.find(p=>p.id===g.self.selectedPortalId)!.npc;g.self.npcTrust??={};g.self.npcTrust[npc]=accepted===true?0:10;g.self.caught=false;
  const urls=images(render(r),'merchant-figure');assert.equal(urls.length,1);assert(urls[0]!.endsWith('/'+mood+'.png'));
 }
});

test('reaction snapshot needs a newly confirmed legal entry; duplicate/reconnect/late context does not replay it',async()=>{
 const {confirmedPortalReaction}=await import('../src/appraisal-client/merchant-reactions.js');
 const r=room(),before=r.game!;before.phase='PORTALS';before.self.selectedPortalId=null;
 const after=structuredClone(before);after.phase='APPRAISAL';after.self.selectedPortalId=before.self.portals[0]!.id;
 const reaction=confirmedPortalReaction(before,after)!;assert(reaction);assert.equal(reaction.phase,'PORTALS');assert(reaction.self.done);assert.equal(reaction.self.selectedPortalId,after.self.selectedPortalId);assert.equal(before.self.selectedPortalId,null);
 assert.equal(confirmedPortalReaction(before,before),null);assert.equal(confirmedPortalReaction(after,after),null);
 for(const mutate of [(g:AppraisalView)=>g.encounter++,(g:AppraisalView)=>g.self.id='different',(g:AppraisalView)=>g.phase='TRADE',(g:AppraisalView)=>g.self.life=0,(g:AppraisalView)=>g.self.selectedPortalId='forged']){
  const changed=structuredClone(after);mutate(changed);assert.equal(confirmedPortalReaction(before,changed),null);
 }
 const closed=structuredClone(before);closed.self.portals[0]!.disabled=true;assert.equal(confirmedPortalReaction(closed,after),null);
});

test('command-driven entry and both appraisal outcomes feed the shared public mood rules',async()=>{
 const {createAppraisalRun,applyAppraisalAction,appraisalViewFor}=await import('../src/game/appraisal/index.js');
 const {confirmedPortalReaction,appraisalMood}=await import('../src/appraisal-client/merchant-reactions.js');
 let state:ReturnType<typeof createAppraisalRun>|undefined,before:AppraisalView|undefined,entered:AppraisalView|undefined;
 for(let seed=0;seed<60;seed++){
  let candidate=createAppraisalRun(['alice','bob'],'merchant-command-'+seed,{marketProbability:0,npcEvents:false,core2:false,expansion:false});
  if(!candidate.players.every(p=>!p.eventOffer&&p.portals.some(v=>!v.disabled&&v.npc!=='darkone')))continue;
  const opening=appraisalViewFor(candidate,'alice');
  candidate=applyAppraisalAction(candidate,{type:'enter',playerId:'alice',portalId:candidate.players[0]!.portals.find(p=>!p.disabled&&p.npc!=='darkone')!.id,requestId:'enter-a',encounter:1});
  const chosen=appraisalViewFor(candidate,'alice');
  candidate=applyAppraisalAction(candidate,{type:'enter',playerId:'bob',portalId:candidate.players[1]!.portals.find(p=>!p.disabled&&p.npc!=='darkone')!.id,requestId:'enter-b',encounter:1});
  const offer=candidate.players[0]!.eventOffer;
  if(offer?.choices.includes('decline'))candidate=applyAppraisalAction(candidate,{type:'event',playerId:'alice',key:offer.key,choice:'decline',requestId:'decline-merchant-event',encounter:1});
  if(candidate.phase==='APPRAISAL'&&!candidate.players[0]!.eventOffer&&!candidate.players[0]!.paused&&!candidate.players[0]!.done){state=candidate;before=opening;entered=chosen;break;}
 }
 assert(state&&before&&entered,'bounded search needs a normal unobstructed merchant opening');
 assert(confirmedPortalReaction(before,entered));assert.equal(state.phase,'APPRAISAL');
 assert.equal(appraisalMood(appraisalViewFor(state,'alice').self.stock[0]!.appraisalAccepted),'idle');
 for(const accepted of [false,true]){
  const item=state.items[state.players[0]!.stock[0]!]!,value=accepted?item.reservation:0;
  const next=applyAppraisalAction(state,{type:'appraise',playerId:'alice',itemId:item.id,value,requestId:'appraise-'+accepted,encounter:1});
  const view=appraisalViewFor(next,'alice');assert.equal(view.self.stock[0]!.appraisalAccepted,accepted);assert.equal(appraisalMood(view.self.stock[0]!.appraisalAccepted),accepted?'smile':'angry');
 }
});
