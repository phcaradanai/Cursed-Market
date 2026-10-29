import assert from 'node:assert/strict';
import test from 'node:test';
import { CORE2_SPECS } from '../src/game/appraisal/core2-specs.js';
import { choiceTitle, eventCost, eventCatalog, eventNeedsItem, eventNeeds, isConsequence } from '../src/appraisal-client/model.js';
import type { AppraisalView, EventOffer } from '../src/game/appraisal/types.js';

const offer=(id:string,choices:string[]):EventOffer=>({id,key:`k:${id}`,choices,itemIds:[],statusIds:[],otherPlayerIds:[],quotedPrices:{},facts:{},targetKinds:{}}) as unknown as EventOffer;
const game={survival:true,self:{stock:[],inventory:[],credits:9,energy:9,life:6},listings:[]} as unknown as AppraisalView;

test('every core v0.6 event shows a name, a description and a titled, priced choice in the client',()=>{
  for(const spec of Object.values(CORE2_SPECS)){
    const o=offer(spec.id,spec.choices.map(c=>c.id));const text=eventCatalog(o);
    assert.equal(text.name,spec.name);assert.ok(text.description.length>0,spec.id);
    for(const c of spec.choices){
      assert.notEqual(choiceTitle(o,c.id),c.id,`${spec.id}/${c.id} has no title`);
      if(c.id!=='decline')assert.ok(eventCost(game,o,c.id,'').length>0);
      assert.equal(eventNeedsItem(o,c.id),!!c.lose);
      assert.equal(eventNeeds(game,o,c.id,'').credits,c.id==='decline'?0:c.credits??0);
    }
    assert.equal(isConsequence(spec.id),!!spec.consequence);
  }
});
