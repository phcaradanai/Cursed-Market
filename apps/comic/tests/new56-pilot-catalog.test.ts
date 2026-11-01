import test from 'node:test';import assert from 'node:assert/strict';
import fs from 'node:fs';
import type {NpcId} from '../src/game/appraisal/types.js';
import {createAppraisalRun,appraisalViewFor} from '../src/game/appraisal/index.js';
import {ITEM_SPECS,itemImage,merchantKinds} from '../src/game/appraisal/content.js';
const proposal=JSON.parse(fs.readFileSync(new URL('../../../../docs/game-design/new56-pilot-proposal.json',import.meta.url),'utf8')) as {items:Array<{id:string;merchantId:NpcId;anchor:number;explicitActivation:boolean}>};
const ids=new Set(proposal.items.map(i=>i.id));
test('catalog4 spawns native approved pilot IDs and exact art for each merchant, never an old-kind alias',()=>{
 const s=createAppraisalRun(['a','b'],'native-pilot-catalog',{catalogVersion:4,marketProbability:0});
 for(const row of proposal.items){const kinds=merchantKinds(row.merchantId,4);assert.deepEqual(kinds,[row.id]);}
 for(const p of s.players)for(const portal of p.portals)for(const id of portal.stock){const item=s.items[id]!;assert(ids.has(item.kind));const row=proposal.items.find(r=>r.id===item.kind)!;assert.equal(row.merchantId,portal.npc);assert.equal(ITEM_SPECS[item.kind].anchor,row.anchor);assert.equal(itemImage(item.kind),'/art/comic/items/merchant-set-v1/'+item.kind+'.png');assert.equal(ITEM_SPECS[item.kind].buff,undefined);assert.equal(ITEM_SPECS[item.kind].drawback,undefined);}
});
test('catalog3 retains its existing seeded kinds after native registration',()=>{
 const s=createAppraisalRun(['a','b'],'native-pilot-catalog',{catalogVersion:3,marketProbability:0});assert(Object.values(s.items).every(i=>!ids.has(i.kind)));
});
test('native item public views preserve unknown truth and display their own effect contract',()=>{
 const s=createAppraisalRun(['a','b'],'native-pilot-view',{catalogVersion:4,marketProbability:0}),p=s.players[0]!;p.stock=[...p.portals[0]!.stock];
 const view=appraisalViewFor(s,p.id);for(const item of view.self.stock){assert(ids.has(item.kind));assert.equal(item.image,itemImage(item.kind));assert.equal(item.knowledge.base,undefined);assert.equal(item.knowledge.genuine,undefined);assert.equal(item.knowledge.cursed,undefined);assert(item.possibleBenefit.length>0);}
});
