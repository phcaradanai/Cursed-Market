import test from 'node:test';
import { dismissEvent } from './event-dismiss.js';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { advanceAppraisalEncounter, applyAppraisalAction, appraisalViewFor, createAppraisalRun, exportAppraisalAudit, replayAppraisalAudit } from '../src/game/appraisal/index.js';
import { ITEM_SPECS } from '../src/game/appraisal/content.js';
import { activate, grant, retire } from '../src/game/appraisal/mechanics.js';
import { coinWinChance, heldPassives, passiveBonuses } from '../src/game/appraisal/passives.js';
import { ITEM_USE_EFFECTS } from '../src/game/appraisal/item-effects.js';
import { openRoundRewards, flipRoundReward } from '../src/game/appraisal/round-rewards.js';
import type { AppraisalItem, AppraisalState, ItemKind } from '../src/game/appraisal/types.js';
import { activationBlock, activationEnergy, playerPassives, possibleBenefitText } from '../src/appraisal-client/model.js';
import { passiveText } from '../src/appraisal-client/catalog-text.js';
import { ItemCard } from '../src/appraisal-client/lore.js';
import { HeldEffects } from '../src/appraisal-client/HeldEffects.js';
import { setLang } from '../src/appraisal-client/i18n.js';

function fixture(itemEffects=true) {
  const s=createAppraisalRun(['alice','bob'],'new-item-effects',{itemEffects,catalogVersion:3,marketProbability:0});
  s.phase='APPRAISAL';for(const p of s.players){p.eventOffer=null;p.selectedPortalId=p.portals[0]!.id;p.stock=[...p.portals[0]!.stock];}
  return s;
}
let sequence=0;
function equip(s:AppraisalState,kind:ItemKind,properties:Partial<AppraisalItem>={}) {
  const p=s.players[0]!,id=`effect-${++sequence}`;
  s.items[id]={id,kind,owner:p.id,npcOwnerId:p.id,npc:'orc',encounter:s.encounter,base:20,ask:20,reservation:1,genuine:true,cursed:false,certificate:false,lastAppraisal:null,lastAccepted:null,...properties};
  p.inventory.push(id);return id;
}

test('all 63 kinds have stackable held effects and original use benefits, without leaking hidden traits',()=>{
  for(const kind of (Object.keys(ITEM_SPECS) as ItemKind[]).filter(k=>!['chrono-gear','burden-hourglass','shifting-compass'].includes(k))) {
    const s=fixture(),p=s.players[0]!,first=equip(s,kind),second=equip(s,kind,{genuine:false,cursed:true});
    const one=heldPassives([{kind}],true),two=passiveBonuses(s,p);
    assert(Object.values(one).some(n=>n>0),kind);assert(passiveText(kind,true),kind);assert(ITEM_SPECS[kind].buff);
    for(const key of Object.keys(one) as Array<keyof typeof one>)assert.equal(two[key],2*one[key],`${kind}/${key}`);
    retire(s,p,second,'test-sale');assert.deepEqual(passiveBonuses(s,p),one);
    retire(s,p,first,'test-transfer');assert(Object.values(passiveBonuses(s,p)).every(n=>n===0));
  }
});
test('held bonuses count only five copies of each kind and update after selling or transferring copies',()=>{
  for(const kind of (Object.keys(ITEM_SPECS) as ItemKind[]).filter(k=>!['chrono-gear','burden-hourglass','shifting-compass'].includes(k))) {
    const s=fixture(),p=s.players[0]!,ids=Array.from({length:7},()=>equip(s,kind));
    const five=heldPassives(Array.from({length:5},()=>({kind})),true);
    assert.deepEqual(passiveBonuses(s,p),five,kind);
    assert.deepEqual(playerPassives(appraisalViewFor(s,p.id)),five,kind);
    retire(s,p,ids[0]!,'sale');retire(s,p,ids[1]!,'trade');assert.deepEqual(passiveBonuses(s,p),five,kind);
    retire(s,p,ids[2]!,'sale');assert.deepEqual(passiveBonuses(s,p),heldPassives(Array.from({length:4},()=>({kind})),true),kind);
  }
  const s=fixture(),p=s.players[0]!;
  for(let n=0;n<9;n++){equip(s,'moon-feed');equip(s,'amulet');}
  assert.equal(coinWinChance(passiveBonuses(s,p)),70,'each kind contributes at most five copies');
  for(let n=0;n<9;n++)equip(s,'gambler-hat');
  assert.equal(coinWinChance(passiveBonuses(s,p)),85,'different held effects still respect the global chance cap');
});
test('held +2 chance stacks, consumption trades held luck for +10 use luck, and client agrees with server',()=>{
  const s=fixture(),p=s.players[0]!,first=equip(s,'moon-feed');equip(s,'moon-feed');equip(s,'amulet');
  assert.equal(coinWinChance(passiveBonuses(s,p)),56);p.energy=0;
  let v=appraisalViewFor(s,p.id);assert.equal(activationEnergy(v,v.self.inventory[0]!),0);assert.equal(activationBlock(v,first,false),null);
  assert.match(possibleBenefitText(v,v.self.inventory[0]!),/10/);
  activate(s,p,first);assert.equal(p.energy,0);assert(!p.inventory.includes(first));assert.equal(p.itemUseBonuses!.luck,10);
  assert.equal(coinWinChance(passiveBonuses(s,p)),64);
  v=appraisalViewFor(s,p.id);assert.deepEqual(playerPassives(v),passiveBonuses(s,p));
  s.phase='REVEAL';openRoundRewards(s);assert.equal(p.roundReward!.winChance,64);
  retire(s,p,p.inventory[0]!,'after-snapshot');assert.equal(p.roundReward!.winChance,64);
});
test('same-kind uses do not stack, different kinds add together, and all expire after the coin round',()=>{
  let s=fixture();let p=s.players[0]!;
  for(let n=0;n<5;n++)activate(s,p,equip(s,'dream-tonic'));
  assert.equal(p.itemUseBonuses!.luck,10);assert.equal(coinWinChance(passiveBonuses(s,p)),60);
  activate(s,p,equip(s,'moon-feed'));assert.equal(p.itemUseBonuses!.luck,20,'different kinds granting the same effect add together');
  activate(s,p,equip(s,'moon-feed'));assert.equal(p.itemUseBonuses!.luck,20,'a second copy of the same kind adds nothing');
  assert.deepEqual(p.itemUseKinds,['dream-tonic','moon-feed']);
  s.phase='REVEAL';openRoundRewards(s);assert.equal(p.roundReward!.winChance,70);
  flipRoundReward(s,p,'heads',1);assert.equal(p.itemUseBonuses!.luck,20);
  s=advanceAppraisalEncounter(s);p=s.players[0]!;
  assert.equal(p.itemUseBonuses,undefined);assert.equal(p.itemUseKinds,undefined);assert.equal(coinWinChance(passiveBonuses(s,p)),50);
});
test('every consumable costs zero energy, including fakes and curses; equipment still costs one',()=>{
  for(const [kind,spec] of Object.entries(ITEM_SPECS).filter(([kind])=>!['chrono-gear','burden-hourglass','shifting-compass'].includes(kind)) as Array<[ItemKind,typeof ITEM_SPECS[ItemKind]]>) {
    const s=fixture(),p=s.players[0]!,id=equip(s,kind);p.energy=0;
    const v=appraisalViewFor(s,p.id);
    if(spec.consumable){assert.equal(activationBlock(v,id,false),null);activate(s,p,id);assert(!p.inventory.includes(id));}
    else {assert.match(activationBlock(v,id,false)!,/พลังไม่พอ/);assert.throws(()=>activate(s,p,id),/พลังไม่พอ/);}
  }
  for(const cursed of [false,true]) {
    const s=fixture(),p=s.players[0]!,id=equip(s,'moon-feed',{genuine:false,cursed});s.config.fakeEffect=false;p.energy=0;
    activate(s,p,id);assert.equal(p.energy,0);assert.equal(p.itemUseBonuses,undefined);assert(!p.inventory.includes(id));
    if(cursed)assert(p.statuses.some(s=>s.id==='D10'));
    assert(!p.notes.at(-1)!.includes('เสียพลังเปล่า'));
  }
});
test('activated bonuses obey fog, authenticity, repeat-use, and temporary discount/inspection/income rules',()=>{
  const blocked=fixture(),p=blocked.players[0]!;grant(blocked,p,'D14');activate(blocked,p,equip(blocked,'dream-tonic'));assert.equal(p.itemUseBonuses,undefined);
  for(const kind of Object.keys(ITEM_USE_EFFECTS) as ItemKind[]) {
    const s=fixture(),q=s.players[0]!,id=equip(s,kind),effect=ITEM_USE_EFFECTS[kind]!;
    activate(s,q,id);assert.equal(q.itemUseBonuses![effect.effect as keyof typeof q.itemUseBonuses],effect.amount);
    assert.deepEqual(playerPassives(appraisalViewFor(s,q.id)),passiveBonuses(s,q));
    assert.throws(()=>activate(s,q,id));
    activate(s,q,equip(s,kind));assert.equal(q.itemUseBonuses![effect.effect],effect.amount,'using another copy never doubles the bonus');
  }
});
test('cards and summaries disclose held/use effects and free energy in both languages, including consumed last item',()=>{
  const s=fixture(),p=s.players[0]!,id=equip(s,'dream-tonic');
  for(const lang of ['th','en'] as const)try {
    setLang(lang);const v=appraisalViewFor(s,p.id),item=v.self.inventory[0]!;
    const html=renderToStaticMarkup(createElement(ItemCard,{kind:item.kind,item}));
    assert(html.includes('+2'));assert(html.includes('+10'));assert.match(html,lang==='th'?/ไม่เสียพลัง/:/No energy cost/);
    assert.match(html,lang==='th'?/สูงสุด 5 ชิ้นต่อชนิด/:/at most 5 copies per kind/);
    assert.match(html,lang==='th'?/ชนิดเดิมไม่บวกซ้ำ/:/Same kind does not stack/);
  } finally {setLang('th');}
  activate(s,p,id);const summary=renderToStaticMarkup(createElement(HeldEffects,{game:appraisalViewFor(s,p.id)}));
  assert(summary.includes('60%'));assert(summary.includes('ชนิดเดิมไม่บวกซ้ำ ต่างชนิดบวกกันได้'));
});
test('new config is enabled by default while absent legacy configs retain old energy and held effects',()=>{
  assert.equal(createAppraisalRun(['alice','bob'],'default-effects').config.itemEffects,true);
  const s=fixture();delete s.config.itemEffects;const p=s.players[0]!,id=equip(s,'moon-feed');
  assert.equal(coinWinChance(passiveBonuses(s,p)),50);p.energy=0;assert.throws(()=>activate(s,p,id),/พลังไม่พอ/);
  p.energy=2;activate(s,p,id);assert.equal(p.energy,1);assert.equal(p.itemUseBonuses,undefined);
  assert.equal(appraisalViewFor(s,p.id).itemEffects,undefined);
});
test('a naturally acquired consumable can be used for free and replayed with identical state',()=>{
  let s:AppraisalState|undefined,target='';
  for(let n=0;n<100;n++) {
    const candidate=createAppraisalRun(['alice','bob'],`effects-replay-${n}`,{marketProbability:0,startingCredits:200});
    for(const p of candidate.players){p.eventOffer=null;}
    const portal=candidate.players[0]!.portals.find(p=>!p.disabled && p.stock.some(id=>['dream-tonic','moon-feed'].includes(candidate.items[id]!.kind)));
    if(!portal)continue;
    // Restart so all transitions, including any event declines, enter the command log.
    s=createAppraisalRun(['alice','bob'],`effects-replay-${n}`,{marketProbability:0,startingCredits:200});
    target=portal.stock.find(id=>['dream-tonic','moon-feed'].includes(s!.items[id]!.kind))!;break;
  }
  assert(s);
  const act=(id:string,body:Record<string,unknown>)=>{s=applyAppraisalAction(s!,{...body,playerId:id,requestId:`replay-effects-${++sequence}`,encounter:s!.encounter} as Parameters<typeof applyAppraisalAction>[1]);};
  for(const id of ['alice','bob']){const offer=s.players.find(p=>p.id===id)!.eventOffer;if(offer)act(id,{type:'event',key:offer.key,...dismissEvent(offer)});}
  for(const id of ['alice','bob']){const p=s.players.find(p=>p.id===id)!;const portal=p.portals.find(p=>!p.disabled && (id==='bob'||p.stock.includes(target)))!;act(id,{type:'enter',portalId:portal.id});}
  for(const id of ['alice','bob']){const offer=s.players.find(p=>p.id===id)!.eventOffer;if(offer)act(id,{type:'event',key:offer.key,...dismissEvent(offer)});}
  act('alice',{type:'buy',itemIds:[target],condition:false});const before=s.players[0]!.energy;act('alice',{type:'activate',itemId:target});
  assert.equal(s.players[0]!.energy,before);
  for(let n=0;n<50 && s.phase!=='RESULTS';n++) {
    if(s.phase==='REVEAL')s=advanceAppraisalEncounter(s);
    else {const p=s.players.find(p=>!p.done && !p.paused)!;act(p.id,{type:'done'});}
  }
  assert.equal(s.phase,'RESULTS');assert.deepEqual(replayAppraisalAudit(exportAppraisalAudit(s)),s);
});
