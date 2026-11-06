import test from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {appraisalBotDecision} from '../src/simulation/appraisal.js';
import {AbilityItemControls} from '../src/appraisal-client/MerchantAbilities.js';
import {setLang} from '../src/appraisal-client/i18n.js';
import {applyAppraisalAction,appraisalViewFor,SURVIVAL_RULES} from '../src/game/appraisal/index.js';
import {damageLife} from '../src/game/appraisal/mechanics.js';
import {cooldownReductionQuote} from '../src/game/appraisal/ability-rules.js';
import {defaultRarityConfig} from '../src/shared/item-rarity.js';
import {defaultRarityEconomy} from '../src/shared/rarity-power.js';
import type {AppraisalAction,AppraisalItem,AppraisalState,ItemKind,NpcId} from '../src/game/appraisal/types.js';
import {appraisalFixture} from './support/appraisal-fixture.js';

const E31:readonly ItemKind[]=['autometa-coolant-canister','alien-phase-dial'];
const E62:readonly ItemKind[]=['deepsea-pressure-cuirass','swarm-chitin-cuirass'];
let request=0;
let visualSeed=0;

function fixture(revision=14) {
  const state=appraisalFixture('E18');
  state.config.catalogVersion=5;
  (state.config as unknown as {native56Effects:number}).native56Effects=revision;
  state.config.survival=SURVIVAL_RULES;
  state.config.trustAbilities=true;
  state.config.rarity=defaultRarityConfig();state.config.rarityEconomy=defaultRarityEconomy();
  state.version=5;
  state.phase='APPRAISAL';
  for(const player of state.players){player.life=6;player.done=false;player.eventOffer=null;}
  const p=state.players[0]!;
  p.energy=7;p.activated=[];p.abilityItemUsed=[];
  p.abilityReady={vampire:state.encounter+5};p.abilityLastUsed={};p.abilityAdjusted={};
  p.npcTrust={...p.npcTrust,vampire:3};
  return {state,p};
}

function addItem(state:AppraisalState,p:AppraisalState['players'][number],kind:ItemKind,id:string,power=1):AppraisalItem {
  const template=state.items[p.stock[0]!]!;
  const rarity=({1:'common',2:'uncommon',3:'rare',4:'epic',6:'legendary',8:'mythic'} as const)[power as 1|2|3|4|6|8]??'common';
  const item:AppraisalItem={...template,id,kind,npc:'autometa',owner:p.id,npcOwnerId:p.id,genuine:true,cursed:false,appearance:{version:1,rarity,theme:'plain',visualSeed:++visualSeed},rarityPower:{version:1,valueMultiplier:power,effectMultiplier:power}};
  delete item.copy;delete item.pilotUsedAt;delete item.pilotUses;
  for(const previousId of p.inventory)if(state.items[previousId]?.owner===p.id)state.items[previousId]!.owner='removed';
  state.items[id]=item;p.inventory=[id];
  return item;
}

function addCopy(state:AppraisalState,p:AppraisalState['players'][number],kind:ItemKind,power=1):AppraisalItem {
  const source=addItem(state,p,kind,'origin',power);
  source.owner='removed';p.inventory=[];
  const copy:AppraisalItem={...source,id:'copy',owner:p.id,copy:{sourceId:source.id,number:1,valuePercent:30}};
  state.items[copy.id]=copy;p.inventory=[copy.id];
  return copy;
}

function activate(state:AppraisalState,p:AppraisalState['players'][number],itemId:string,npc?:NpcId) {
  return applyAppraisalAction(state,{type:'activate',itemId,...(npc?{npc}:{}),playerId:p.id,requestId:`cooldown-${++request}`,encounter:state.encounter} as AppraisalAction);
}

test('E31 UI quote and accepted target action use the same capped reduction; item remains and costs one energy',()=>{
  setLang('en');
  const {state,p}=fixture();const item=addItem(state,p,E31[0]!,E31[0]!,4);
  const view=appraisalViewFor(state,p.id);
  const projected=view.self.inventory.find(i=>i.id===item.id)!;projected.nativeEffectReady=true;
  const html=renderToStaticMarkup(createElement(AbilityItemControls,{game:view,item:projected,submit:()=>{},disabled:false}));
  assert.match(html,/value="vampire"/);
  assert.match(html,/Reduce cooldown by 2/);
  assert.match(html,/Costs 1 energy/);
  const quote=cooldownReductionQuote(p,'vampire',state.encounter,item.rarityPower!.effectMultiplier);
  const before=p.energy,ready=p.abilityReady!.vampire!;
  const after=activate(state,p,item.id,'vampire');
  const changed=after.players[0]!;
  assert.equal(quote,2);
  assert.equal(changed.energy,before-1);
  assert.equal(changed.abilityReady!.vampire,ready-quote);
  assert.equal(changed.abilityAdjusted!.vampire,quote);
  assert(changed.inventory.includes(item.id),'cooldown canister/dial is held, not consumed');
  assert(after.trace.some(entry=>entry.type==='native56-cooldown-adjusted'&&entry.details.npc==='vampire'&&entry.details.reduced===quote));
});

test('E31 invalid target, no-op, Alien loan and pre-revision actions do not charge or consume a use',()=>{
  for(const kind of E31){
    const {state,p}=fixture();const item=addItem(state,p,kind,kind,2);const energy=p.energy;
    assert.throws(()=>activate(state,p,item.id));
    assert.equal(p.energy,energy);assert.equal(item.pilotUses??0,0);assert(!p.activated.includes(item.id));
    assert.throws(()=>activate(state,p,item.id,'orc'),'untrusted target is not unlocked');
    assert.equal(p.energy,energy);

    const old=fixture(13);const oldItem=addItem(old.state,old.p,kind,`old-${kind}`,2);
    assert.throws(()=>activate(old.state,old.p,oldItem.id,'vampire'));
    assert.equal(old.p.energy,energy);assert.equal(oldItem.pilotUses??0,0);

    const loan=fixture();const lent=addItem(loan.state,loan.p,kind,`loan-${kind}`,2);
    loan.p.npcContracts={alien:{lentAt:loan.state.encounter,dueAt:loan.state.encounter+1,itemIds:[lent.id],key:'e31-loan',reservedCredits:0}};
    assert.throws(()=>activate(loan.state,loan.p,lent.id,'vampire'));
    assert.equal(loan.p.energy,energy);assert.equal(lent.pilotUses??0,0);
  }
});

test('E31 uses floor(copy strength), combines both physical copies under one cap, and tracks origin custody',()=>{
  const low=fixture();const lowCopy=addCopy(low.state,low.p,E31[0]!,1);const energy=low.p.energy;
  assert.throws(()=>activate(low.state,low.p,lowCopy.id,'vampire'));
  assert.equal(low.p.energy,energy);assert.equal(lowCopy.pilotUses??0,0);

  const powered=fixture();const copy=addCopy(powered.state,powered.p,E31[1]!,3);
  const quote=cooldownReductionQuote(powered.p,'vampire',powered.state.encounter,3*.4);
  assert.equal(quote,1);
  const after=activate(powered.state,powered.p,copy.id,'vampire');
  assert.equal(after.players[0]!.abilityReady!.vampire,powered.state.encounter+4);
  assert.equal(after.items.origin!.pilotUsedAt,after.encounter);

  const source=after.items.origin!;const p=after.players[0]!;
  p.inventory=[source.id];source.owner=p.id;p.abilityItemUsed=[];
  const energyAfterCopy=p.energy;
  assert.throws(()=>activate(after,p,source.id,'vampire'),'origin use is spent even if its copy is now held');
  assert.equal(p.energy,energyAfterCopy);
});

test('E31 family cap allows only one canister/dial activation per encounter',()=>{
  const {state,p}=fixture();const first=addItem(state,p,E31[0]!,'canister',3);
  const second:AppraisalItem={...first,id:'dial',kind:E31[1]!};state.items[second.id]=second;p.inventory.push(second.id);
  const afterFirst=activate(state,p,first.id,'vampire');const nextPlayer=afterFirst.players[0]!;const energy=nextPlayer.energy;
  assert.throws(()=>activate(afterFirst,nextPlayer,second.id,'vampire'));
  assert.equal(nextPlayer.energy,energy);assert.equal(afterFirst.items[second.id]!.pilotUses??0,0);
});

test('E62 applies only to an actual eligible hit, caps at two, and consumes one family use',()=>{
  const {state,p}=fixture();const armor=addItem(state,p,E62[0]!,'armor',4);const starting=p.life!;
  damageLife(state,p,4,'combat');
  assert.equal(p.life,starting-2,'rarity strength is capped at two damage prevented');
  assert.equal(armor.pilotUses,1);assert(p.abilityItemUsed!.includes(E62[0]!));
  damageLife(state,p,1,'combat');
  assert.equal(p.life,starting-3,'the family can only prevent damage once each encounter');
  assert.equal(armor.pilotUses,1);
});

test('E62 sums rarity/copy strength, selects one source, and does not stack with the stronger pilot shield',()=>{
  const rare=fixture();const armor=addItem(rare.state,rare.p,E62[1]!,'rare-armor',2);
  rare.p.pilotGuard={encounter:rare.state.encounter,amount:1};
  const starting=rare.p.life!;damageLife(rare.state,rare.p,3,'combat');
  assert.equal(rare.p.life,starting-1,'the stronger armor source absorbs two; the shield is not stacked');
  assert.equal(armor.pilotUses,1);

  const shield=fixture();const weakArmor=addItem(shield.state,shield.p,E62[0]!,'weak-armor',1);
  shield.p.pilotGuard={encounter:shield.state.encounter,amount:2};
  const shieldStart=shield.p.life!;damageLife(shield.state,shield.p,3,'combat');
  assert.equal(shield.p.life,shieldStart-1,'the stronger existing shield wins this hit');
  assert.equal(weakArmor.pilotUses??0,0,'armor is not spent when it did not reduce damage');
  damageLife(shield.state,shield.p,1,'combat');
  assert.equal(shield.p.life,shieldStart-1,'held armor protects the next eligible hit');
  assert.equal(weakArmor.pilotUses,1);

  const copyCase=fixture();const copy=addCopy(copyCase.state,copyCase.p,E62[0]!,3);
  const hp=copyCase.p.life!;damageLife(copyCase.state,copyCase.p,2,'combat');
  assert.equal(copyCase.p.life,hp-1,'3 x 0.4 copy strength floors to one point');
  assert.equal(copy.pilotUses,1);assert.equal(copyCase.state.items.origin!.pilotUses,1);
});

test('E62 ignores non-harm/explicit exclusions, gates at revision14, and respects origin use',()=>{
  const {state,p}=fixture();const armor=addItem(state,p,E62[0]!,'armor',1);const start=p.life!;
  damageLife(state,p,2,'blood-pact');damageLife(state,p,1,'cursed-activation');damageLife(state,p,1,'combat',false);
  assert.equal(armor.pilotUses??0,0);
  damageLife(state,p,1,'combat');assert.equal(p.life,start-4,'eligible mitigation leaves prior excluded damage untouched');assert.equal(armor.pilotUses,1);

  const old=fixture(13);addItem(old.state,old.p,E62[1]!,'old-armor',2);const oldHp=old.p.life!;
  damageLife(old.state,old.p,1,'combat');assert.equal(old.p.life,oldHp-1);

  const legacy=fixture();legacy.state.config.catalogVersion=4;
  const legacyArmor=addItem(legacy.state,legacy.p,E62[0]!,'legacy-armor',2);const legacyHp=legacy.p.life!;
  damageLife(legacy.state,legacy.p,1,'combat');assert.equal(legacy.p.life,legacyHp-1);assert.equal(legacyArmor.pilotUses??0,0);

  const loan=fixture();const lent=addItem(loan.state,loan.p,E62[1]!,'loan-armor',2);
  loan.p.npcContracts={alien:{lentAt:loan.state.encounter,dueAt:loan.state.encounter+1,itemIds:[lent.id],key:'e62-loan',reservedCredits:0}};
  const loanHp=loan.p.life!;damageLife(loan.state,loan.p,1,'combat');
  assert.equal(loan.p.life,loanHp-1);assert.equal(lent.pilotUses??0,0,'loaned armor has no held effect');

  const custody=fixture();const away=addItem(custody.state,custody.p,E62[0]!,'away-armor',2);
  custody.p.inventory=[];const custodyHp=custody.p.life!;
  damageLife(custody.state,custody.p,1,'combat');
  assert.equal(custody.p.life,custodyHp-1);assert.equal(away.pilotUses??0,0,'the effect follows actual inventory custody');

  const copyCase=fixture();const copy=addCopy(copyCase.state,copyCase.p,E62[1]!,3);
  damageLife(copyCase.state,copyCase.p,1,'combat');
  assert.equal(copy.pilotUses,1);
  const origin=copyCase.state.items.origin!;const seat=copyCase.p;
  seat.inventory=[origin.id];origin.owner=seat.id;seat.abilityItemUsed=[];
  const before=seat.life!;damageLife(copyCase.state,seat,1,'combat');
  assert.equal(seat.life,before-1,'used copy origin cannot grant a second held shield');
});

test('collector bot activates E31 only with a valid cooldown target and never emits a targetless activate',()=>{
  const {state,p}=fixture();const item=addItem(state,p,E31[0]!,'bot-canister',4);p.stock=[];
  let view=appraisalViewFor(state,p.id);view.self.inventory[0]!.nativeEffectReady=true;
  let action=appraisalBotDecision(view,'collector');
  assert.equal(action.type,'activate');
  assert.equal(action.type==='activate'?action.npc:undefined,'vampire');

  p.npcTrust={};p.abilityReady={};
  view=appraisalViewFor(state,p.id);view.self.inventory[0]!.nativeEffectReady=true;
  action=appraisalBotDecision(view,'collector');
  assert.notEqual(action.type,'activate','with no valid cooldown, E31 must not fall through to targetless activation');
  assert.equal(item.owner,p.id);
});
