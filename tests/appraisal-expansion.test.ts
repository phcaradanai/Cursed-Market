import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { BROKERAGE_RULES } from '../src/game/appraisal/index.js';
import { simulateAppraisalRun } from '../src/simulation/appraisal.js';
import { applyAppraisalAction, appraisalViewFor, createAppraisalRun, SURVIVAL_RULES } from '../src/game/appraisal/index.js';
import { EXPANSION_KINDS, ITEM_SPECS, NPC_SPECS, STATUS_CATALOG, expansionActive, itemImage, merchantKinds, npcImage } from '../src/game/appraisal/content.js';
import { eventEligible, offerEvent } from '../src/game/appraisal/events.js';
import { grant, recoveryOffer, status } from '../src/game/appraisal/mechanics.js';
import { cleanseChance } from '../src/game/appraisal/cleanse-rules.js';
import { EXPANSION_EVENT_IDS, STATUS_IDS } from '../src/game/appraisal/types.js';
import type { AppraisalAction, AppraisalState, ItemKind, NpcId } from '../src/game/appraisal/types.js';
import { eventDecision, eventNeeds, eventCost, eventStatusOptions, inspectionCost, purchasePrice } from '../src/appraisal-client/model.js';
import { appraisalFixture } from './support/appraisal-fixture.js';

type Body=AppraisalAction extends infer A ? A extends AppraisalAction ? Omit<A,'playerId'|'requestId'|'encounter'> : never : never;
let request=0;
const act=(state:AppraisalState,playerId:string,body:Body)=>applyAppraisalAction(state,{...body,playerId,requestId:`ex-${++request}`,encounter:state.encounter} as AppraisalAction);
/** Fixture table with the expansion rules on and alice sitting at `npc`'s shop. */
function table(npc:NpcId='deepsea',seed='expansion') {
  const state=appraisalFixture('E18');state.seed=seed;state.config.catalogVersion=3;state.config.expansion=true;
  const p=state.players[0]!;p.eventOffer=null;p.selectedPortalId=p.portals[0]!.id;p.portals[0]!.npc=npc;
  for(const id of p.stock) state.items[id]!.npc=npc;return state;
}

test('two new merchants exist only with the expansion rules, and their stock matches their favourite families',()=>{
  assert.equal(Object.keys(NPC_SPECS).length,8);
  for(const npc of ['deepsea','swarm'] as const) {
    const pool=merchantKinds(npc,3,true,true,true);assert(pool.length>0);
    assert(pool.every(kind=>NPC_SPECS[npc].favorite.includes(ITEM_SPECS[kind].family??kind as ItemKind)));
    assert(pool.some(kind=>EXPANSION_KINDS.includes(kind)),`${npc} sells at least one new item`);
  }
  for(const npc of Object.keys(NPC_SPECS) as NpcId[]) assert(merchantKinds(npc,3,true,true,false).every(kind=>!EXPANSION_KINDS.includes(kind)));
  const seen=new Set<NpcId>();
  for(let i=0;i<40;i++){const run=createAppraisalRun(['a','b'],`pool-${i}`);for(const portals of Object.values(run.schedule))for(const row of portals)for(const portal of row)seen.add(portal.npc);}
  assert(seen.has('deepsea') && seen.has('swarm'),'default rooms meet both new merchants');
  for(let i=0;i<40;i++){const run=createAppraisalRun(['a','b'],`pool-${i}`,{expansion:false});for(const portals of Object.values(run.schedule))for(const row of portals)for(const portal of row)assert(!['deepsea','swarm'].includes(portal.npc));}
  assert.equal(expansionActive({catalogVersion:2,expansion:true}),false,'older catalogs never grow');
  const stocked=new Set<ItemKind>();for(let i=0;i<60;i++){const run=createAppraisalRun(['a','b'],`stock-${i}`);for(const item of Object.values(run.items))stocked.add(item.kind);}
  assert(EXPANSION_KINDS.every(kind=>stocked.has(kind)),'every new item is reachable from merchants');
});
test('twelve new statuses (6 buffs, 6 debuffs) are in the catalog and unique',()=>{
  const ids=['B11','B12','B13','B14','B15','B16','D11','D12','D13','D14','D15','D16'];
  assert.equal(STATUS_IDS.length,32);for(const id of ids){assert(STATUS_IDS.includes(id as never));const spec=STATUS_CATALOG.find(s=>s.id===id)!;assert(spec.name && spec.description.length>10);}
  assert.equal(new Set(STATUS_CATALOG.map(s=>s.name)).size,32);
  assert(Object.values(ITEM_SPECS).filter(spec=>EXPANSION_KINDS.some(k=>ITEM_SPECS[k]===spec)).every(spec=>ids.includes(spec.buff) && ids.includes(spec.drawback)));
});
test('B11 compound eyes: two free inspections, still counted; D12 raises the next purchase price once',()=>{
  let state=table();state.config.catalogVersion=2;const p=state.players[0]!;grant(state,p,'B11');const energy=p.energy,stock=p.stock[0]!;
  assert.equal(inspectionCost(appraisalViewFor(state,'alice'),'price'),0);
  state=act(state,'alice',{type:'inspect',itemId:stock,property:'price'});state=act(state,'alice',{type:'inspect',itemId:stock,property:'authenticity'});
  assert.equal(state.players[0]!.energy,energy);assert.equal(state.players[0]!.inspections,2);assert(!status(state.players[0]!,'B11'));
  const plain=table();const base=purchasePrice(appraisalFixtureView(plain),[appraisalViewFor(plain,'alice').self.stock[0]!],false);
  grant(plain,plain.players[0]!,'D12');const raised=purchasePrice(appraisalViewFor(plain,'alice'),[appraisalViewFor(plain,'alice').self.stock[0]!],false);
  assert.equal(raised,base+2);const credits=plain.players[0]!.credits;
  const bought=act(plain,'alice',{type:'buy',itemIds:[plain.players[0]!.stock[0]!],condition:false});
  assert.equal(credits-bought.players[0]!.credits,raised);assert(!status(bought.players[0]!,'D12'));
});
const appraisalFixtureView=(state:AppraisalState)=>appraisalViewFor(state,'alice');
test('B14 adds 2 to the next recovery; D16 makes deals dearer and cleansing less likely; B16 does the opposite',()=>{
  const state=createAppraisalRun(['a','b'],'recover',{survival:SURVIVAL_RULES});const p=state.players[0]!;p.selectedPortalId=p.portals[0]!.id;p.portals[0]!.npc='swarm';
  assert.deepEqual(recoveryOffer(state,p),{target:'energy',credits:2,amount:3});grant(state,p,'D16');assert.equal(recoveryOffer(state,p)!.credits,4);
  const swamp=createAppraisalRun(['a','b'],'recover2',{survival:SURVIVAL_RULES});swamp.players[0]!.selectedPortalId=swamp.players[0]!.portals[0]!.id;swamp.players[0]!.portals[0]!.npc='deepsea';
  assert.equal(recoveryOffer(swamp,swamp.players[0]!)!.target,'life');
  assert.equal(cleanseChance('orc',0,[],undefined,20),70);assert.equal(cleanseChance('orc',0,[],undefined,-15),35);assert.equal(cleanseChance('orc',0,[],undefined,-90),5);
  const t=table('orc');t.players[0]!.energy=2;grant(t,t.players[0]!,'B14');const before=t.players[0]!.energy;
  const healed=act(t,'alice',{type:'activate',itemId:'owned-orb'}).players[0]!;
  assert(healed.energy>before-1+3,'orb recovery +B14 bonus');assert(!status(healed,'B14'));
});
test('D14 fogs the next activation (curse still bites); D11 drains energy at settlement; D15 halves commission; B15 adds trust',()=>{
  const fog=table('orc');fog.items['owned-mirror']!.cursed=true;grant(fog,fog.players[0]!,'D14');
  const after=act(fog,'alice',{type:'activate',itemId:'owned-mirror'}).players[0]!;
  assert(!status(after,'B01'),'good effect does not fire');assert(status(after,'D05'),'the curse still does');assert(!status(after,'D14'));assert(after.notes.at(-1)!.includes('หมอกวิกลจริต'));
  const run=(statuses:Array<'D15'|'B15'>)=>{let s=table('orc','commission');const buyer=s.players[0]!,bob=s.players[1]!;
    const item=buyer.stock[0]!;buyer.valuations[item]={value:20,accuracy:false,caught:false,accepted:true};s.items[item]!.lastAccepted=true;s.items[item]!.appraisedBy='bob';
    for(const id of statuses) grant(s,bob,id);const bob0=bob.credits;const npc=s.items[item]!.npc;const trust0=bob.npcTrust![npc]??0;
    s=act(s,'alice',{type:'buy',itemIds:[item],condition:false});return {gain:s.players[1]!.credits-bob0,trust:(s.players[1]!.npcTrust![npc]??0)-trust0};};
  const base=run([]),webbed=run(['D15']),hived=run(['B15']);
  assert(base.gain>0 && webbed.gain<base.gain && webbed.gain>=Math.floor(base.gain/2)-1,JSON.stringify({base,webbed}));assert.equal(hived.trust,base.trust+1);
});
for(const id of EXPANSION_EVENT_IDS) test(`${id}: eligible only with the expansion, resolves its choice, declines free, UI mirrors its cost`,()=>{
  const npc:NpcId=['E85','E90'].includes(id)?'swarm':'deepsea';
  const build=()=>{const s=table(npc,`event-${id}`);const p=s.players[0]!;
    if(id==='E88')grant(s,p,'D12');
    if(id==='E89'){/* no B11/D14 */}
    if(id==='E92')s.phase='TRADE';
    return s;};
  const state=build();const p=state.players[0]!;
  assert.equal(eventEligible(state,p,id),true,id);
  const legacy=build();delete legacy.config.expansion;assert.equal(eventEligible(legacy,legacy.players[0]!,id),false);
  offerEvent(state,p,id);const offer=structuredClone(p.eventOffer!);
  assert.deepEqual(offer.choices,['accept','decline']);
  const declined=act(structuredClone(state),'alice',{type:'event',key:offer.key,choice:'decline'}).players[0]!;
  assert.equal(declined.credits,build().players[0]!.credits);assert.equal(declined.energy,build().players[0]!.energy);
  const view=appraisalViewFor(state,'alice');const viewOffer=view.self.eventOffer!;
  const statusId=eventStatusOptions(viewOffer,'accept')[0]??'';
  const decision=eventDecision(viewOffer,'accept',{itemId:'',statusId,fact:'',guess:true});assert(decision,id);
  const need=eventNeeds(view,viewOffer,'accept','');const before={credits:p.credits,energy:p.energy};
  const after=act(state,'alice',decision as Body).players[0]!;
  assert.equal(after.eventOffer,null);assert(after.resolvedEvents.includes(id));
  assert.equal(before.energy-after.energy,need.energy,`${id} energy matches the UI quote ${JSON.stringify(need)}`);assert(after.credits>=before.credits-need.credits,`${id} credits within the UI quote`);
  assert(eventCost(view,viewOffer,'accept','').length>6);
});
test('E87/E93 gamble outcomes follow the seeded roll in both directions; E91 survival costs a life, not energy',()=>{
  const outcomes={E87:new Set<string>(),E93:new Set<string>()};
  for(let i=0;i<30;i++) for(const id of ['E87','E93'] as const){
    const s=table('deepsea',`gamble-${i}`);s.players[0]!.energy=6;offerEvent(s,s.players[0]!,id);
    const after=act(s,'alice',{type:'event',key:s.players[0]!.eventOffer!.key,choice:'accept'}).players[0]!;
    outcomes[id].add(id==='E87'?(status(after,'B14')?'win':'lose'):(status(after,'B15')?'win':'lose'));
  }
  assert.equal(outcomes.E87.size,2);assert.equal(outcomes.E93.size,2);
  const run=createAppraisalRun(['a','b'],'life',{survival:SURVIVAL_RULES,catalogVersion:3});run.phase='APPRAISAL';const p=run.players[0]!;p.eventOffer=null;p.selectedPortalId=p.portals[0]!.id;p.portals[0]!.npc='deepsea';p.stock=[...p.portals[0]!.stock];
  assert.equal(eventEligible(run,p,'E91'),true);offerEvent(run,p,'E91');const energy=p.energy,life=p.life!;
  const done=act(run,'a',{type:'event',key:p.eventOffer!.key,choice:'accept'}).players[0]!;
  assert.equal(done.life,life-1);assert.equal(done.energy,energy);assert(status(done,'B16') && status(done,'D16'));
});
test('whole expansion runs replay byte-for-byte for every bot policy, with and without lives',()=>{
  for(const survival of [false,true]) for(const policy of ['cautious','aggressive','collector','trader'] as const) for(let i=0;i<4;i++)
    simulateAppraisalRun(3,policy,`expansion:${survival}:${policy}:${i}`,{brokerage:BROKERAGE_RULES,...(survival?{survival:SURVIVAL_RULES}:{})});
});
test('D11 swarm venom drains one energy per settlement for two settlements',()=>{
  let state=table('swarm');for(const p of state.players){p.eventOffer=null;grant(state,p,'D11');p.energy=8;}
  state.players[0]!.stock=[];state.players[1]!.stock=[];
  for(let steps=0;steps<30 && state.phase!=='REVEAL';steps++){const p=state.players.find(v=>!v.done && !v.paused);if(!p)break;state=act(state,p.id,{type:'done'});}
  assert.equal(state.phase,'REVEAL');assert(state.players.every(p=>p.energy<=7),'venom drained energy');assert(state.players.every(p=>status(p,'D11')?.charges===1));
});
test('every item kind and merchant has its own artwork file; no two names share one picture',()=>{
  const kinds=Object.keys(ITEM_SPECS) as ItemKind[];const paths=kinds.map(itemImage);
  assert.equal(new Set(paths).size,kinds.length,'one path per kind');
  const hashes=new Set<string>();
  for(const kind of kinds){const file=`src/appraisal-client/public${itemImage(kind)}`;assert(existsSync(file),file);hashes.add(createHash('sha256').update(readFileSync(file)).digest('hex'));}
  assert.equal(hashes.size,kinds.length,'no byte-identical pictures under different names');
  const npcs=Object.keys(NPC_SPECS) as NpcId[];assert.equal(new Set(npcs.map(npcImage)).size,npcs.length);
  for(const npc of npcs) assert(existsSync(`src/appraisal-client/public${npcImage(npc)}`));
});
