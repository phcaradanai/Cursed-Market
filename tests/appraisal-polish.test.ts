import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { applyAppraisalAction, appraisalViewFor, assertAppraisalInvariants, BROKERAGE_RULES, createAppraisalRun, SURVIVAL_RULES } from '../src/game/appraisal/index.js';
import { ITEM_SPECS, merchantKinds, POLISH_KINDS, STATUS_CATALOG } from '../src/game/appraisal/content.js';
import { eventEligible, offerEvent } from '../src/game/appraisal/events.js';
import { OMENS, omenOf } from '../src/game/appraisal/omens.js';
import { feeSurcharge, grant, maxEnergyOf, maxLifeOf, omenNow, salePercent, saleAdjusted, status, damageLife } from '../src/game/appraisal/mechanics.js';
import { PASSIVE_ITEMS, passiveBonuses } from '../src/game/appraisal/passives.js';
import { POLISH_EVENTS } from '../src/game/appraisal/polish-events.js';
import { POLISH_EVENT_IDS, STATUS_IDS } from '../src/game/appraisal/types.js';
import { wishPrice } from '../src/game/appraisal/wishlist-rules.js';
import { unsoldPenalty } from '../src/game/appraisal/brokerage.js';
import { cleanseChance } from '../src/game/appraisal/cleanse-rules.js';
import { eventDecision, eventNeeds, eventStatusOptions, purchasePrice, saleAdjusted as uiSale } from '../src/appraisal-client/model.js';
import { simulateAppraisalRun } from '../src/simulation/appraisal.js';
import type { AppraisalAction, AppraisalState, ItemKind, NpcId } from '../src/game/appraisal/types.js';
import { appraisalFixture } from './support/appraisal-fixture.js';

type Body=AppraisalAction extends infer A ? A extends AppraisalAction ? Omit<A,'playerId'|'requestId'|'encounter'> : never : never;
let request=0;
const act=(state:AppraisalState,playerId:string,body:Body)=>applyAppraisalAction(state,{...body,playerId,requestId:`pol-${++request}`,encounter:state.encounter} as AppraisalAction);
/** Alice at an orc shop with polish rules on and no omen, so only statuses move prices. */
function table(seed='polish'){const state=appraisalFixture('E18');state.seed=seed;state.config.polish=true;const p=state.players[0]!;p.eventOffer=null;p.selectedPortalId=p.portals[0]!.id;p.portals[0]!.npc='orc';return state;}
/** Pick a seed whose omen leaves prices, fees and rewards alone, so only statuses move them. */
const noOmen=(state:AppraisalState)=>{for(let i=0;i<500 && omenNow(state)?.id!=='festival';i++)state.seed=`${state.seed}~`;assert.equal(omenNow(state)!.id,'festival');return state;};
const openMarket=(state:AppraisalState,kind:ItemKind,price:number)=>{state.market={encounter:state.encounter,open:true,budget:price,orders:[{id:`quote-${kind}`,kind,price,quota:{alice:1,bob:1}}]};return state;};

test('eight new statuses (B17–B20, D17–D20) are catalogued with duration and source',()=>{
  const ids=['B17','B18','B19','B20','D17','D18','D19','D20'];
  for(const id of ids){assert(STATUS_IDS.includes(id as never));const spec=STATUS_CATALOG.find(s=>s.id===id)!;assert(spec.name && spec.description.length>10 && spec.source);}
  assert.equal(STATUS_CATALOG.find(s=>s.id==='D17')!.name,'ราคาตลาดเฟ้อ');
});
test('market inflation (D17) cuts every sale of something the seat owns by 20% — market, wish, collector offer and bond buyer — but never an item appraised for a merchant',()=>{
  const base=noOmen(table('inflation'));const pct=(s:AppraisalState)=>salePercent(s,s.players[0]!,true);
  grant(base,base.players[0]!,'D17');assert.equal(pct(base),-20);assert.equal(saleAdjusted(40,-20),32);
  // Dark Market
  let s=openMarket(structuredClone(base),'mirror',40);const before=s.players[0]!.credits;
  s=act(s,'alice',{type:'market-sell',itemId:'owned-mirror',orderId:'quote-mirror'});assert.equal(s.players[0]!.credits-before,32);assert(status(s.players[0]!,'D17'),'encounter-long, not spent by a sale');
  // wish: quoted price and paid price both include the cut
  const w=structuredClone(base);w.players[0]!.wishes={orc:{kind:'mirror',price:wishPrice('mirror'),set:1}};w.config.wishlist=true;w.config.wishContract=true;
  const quoted=appraisalViewFor(w,'alice').self.wishOffer!.options[0]!.price;assert.equal(quoted,saleAdjusted(wishPrice('mirror'),-20));
  let paid=0;for(let i=0;i<40 && !paid;i++){const t=structuredClone(w);t.seed=`inflation-wish-${i}`;noOmen(t);t.items['owned-mirror']!.genuine=true;const c=t.players[0]!.credits;const after=act(t,'alice',{type:'wish-sell',itemId:'owned-mirror',markup:0}).players[0]!;if(after.credits>c)paid=after.credits-c;}
  assert.equal(paid,quoted);
  // collector offer E44
  const e=structuredClone(base);e.phase='TRADE';offerEvent(e,e.players[0]!,'E44');const offer=e.players[0]!.eventOffer!;
  const raw=Math.floor(ITEM_SPECS.food.anchor*.75);assert.equal(offer.quotedPrices['owned-food'],saleAdjusted(raw,-20));
  const cBefore=e.players[0]!.credits;const done=act(e,'alice',{type:'event',key:offer.key,choice:'accept',itemId:'owned-food'});assert.equal(done.players[0]!.credits-cBefore,saleAdjusted(raw,-20));
  // appraised for the merchant: commission unaffected
  const sold=(id:'D17'|null)=>{const t=structuredClone(base);if(!id)delete t.players[0]!.statuses[0];t.players[0]!.statuses=id?t.players[0]!.statuses:[];const seller=t.players[1]!;const item=t.players[0]!.stock[0]!;
    t.players[0]!.valuations[item]={value:20,accuracy:false,caught:false,accepted:true};t.items[item]!.lastAccepted=true;t.items[item]!.appraisedBy='bob';
    if(id)grant(t,seller,'D17');const c=seller.credits;const after=act(t,'alice',{type:'buy',itemIds:[item],condition:false});return after.players[1]!.credits-c;};
  assert.equal(sold('D17'),sold(null),'commission for merchant-appraised goods ignores the owner-sale modifiers');
});
test('market boom (B17) adds 15%, one-shot B13/D13 add and are spent, all percentages add before one floor',()=>{
  const s=noOmen(table('boom'));const p=s.players[0]!;
  grant(s,p,'B17');assert.equal(salePercent(s,p,true),15);grant(s,p,'B13');assert.equal(salePercent(s,p,true),35);grant(s,p,'D13');assert.equal(salePercent(s,p,true),15);grant(s,p,'D17');assert.equal(salePercent(s,p,true),-5);
  const m=openMarket(structuredClone(s),'mirror',40);const c=m.players[0]!.credits;const after=act(m,'alice',{type:'market-sell',itemId:'owned-mirror',orderId:'quote-mirror'}).players[0]!;
  assert.equal(after.credits-c,saleAdjusted(40,-5));assert(!status(after,'B13') && !status(after,'D13'),'one-shot statuses spent');assert(status(after,'B17') && status(after,'D17'));
  assert.equal(uiSale({salePct:-5} as never,40),38);
});
test('omens: one per encounter from the seed, never twice in a row, all seven reachable, nothing without polish',()=>{
  assert.equal(OMENS.length,7);const seen=new Set<string>();let repeats=0;const runs=new Set<string>();
  for(let i=0;i<300;i++){const seed=randomBytes(8).toString('hex');const seq=[1,2,3,4,5,6].map(e=>omenOf({polish:true},seed,e)!.id);seq.forEach(id=>seen.add(id));
    for(let e=1;e<seq.length;e++) if(seq[e]===seq[e-1]) repeats++;runs.add(seq.join('>'));}
  assert.equal(repeats,0);assert.equal(seen.size,7);assert(runs.size>150,'omen sequences differ from run to run');
  assert.equal(omenOf({},'seed',1),undefined);assert.equal(omenOf({polish:true},'seed',3)!.id,omenOf({polish:true},'seed',3)!.id);
  const run=createAppraisalRun(['a','b'],'omen-view',{polish:true});assert(appraisalViewFor(run,'a').omen && appraisalViewFor(run,'a').polish);
  assert.equal(appraisalViewFor(createAppraisalRun(['a','b'],'omen-view'),'a').omen,undefined);
});
test('omens move the shared levers: sale percent, fees, acceptance, first inspection, settlement drain, round reward',()=>{
  const find=(id:string)=>{for(let i=0;i<500;i++){const s=table(`omen-${id}-${i}`);if(omenNow(s)?.id===id)return s;}throw new Error(id);};
  const inflation=find('inflation');assert.equal(salePercent(inflation,inflation.players[0]!,false),-20);
  const boom=find('boom');assert.equal(salePercent(boom,boom.players[0]!,false),15);
  const tax=find('tax');assert.equal(feeSurcharge(tax,tax.players[0]!),1);
  const v=appraisalViewFor(tax,'alice');const item=v.self.stock[0]!;assert.equal(purchasePrice(v,[item],false),item.price-(passiveBonuses(tax,tax.players[0]!).discount)+1);
  const credits=tax.players[0]!.credits;const bought=act(tax,'alice',{type:'buy',itemIds:[tax.players[0]!.stock[0]!],condition:false});assert.equal(credits-bought.players[0]!.credits,purchasePrice(v,[item],false));
  const insight=find('insight');const e=insight.players[0]!.energy;const inspected=act(insight,'alice',{type:'inspect',itemId:insight.players[0]!.stock[0]!,property:'price'});assert.equal(inspected.players[0]!.energy,e);
  const second=act(inspected,'alice',{type:'inspect',itemId:inspected.players[0]!.stock[0]!,property:'authenticity'});assert.equal(second.players[0]!.energy,e-1,'only the first inspection is free');
  const festival=find('festival');assert.equal(omenNow(festival)!.accept,10);assert.equal(cleanseChance('orc',0,[],undefined,omenNow(festival)!.accept),60);
  const generous=find('generous');assert.equal(omenNow(generous)!.roundBonus,3);
});
test('B18/D19 move the post-trade reward and the coin odds; the omen "generous" adds 3',()=>{
  const run=(statuses:Array<'B18'|'D19'>)=>{let s=noOmen(table('coin-2'));s.config.roundRewards=true;for(const p of s.players){p.stock=[];}for(const id of statuses)grant(s,s.players[0]!,id);
    for(let i=0;i<40 && s.phase!=='REVEAL';i++){const p=s.players.find(v=>!v.done && !v.paused);if(!p)break;s=act(s,p.id,{type:'done'});}return s.players[0]!.roundReward;};
  const base=run([])!,lucky=run(['B18'])!,cursed=run(['D19'])!;
  assert.equal(lucky.amount,base.amount+3);assert.equal(cursed.amount,base.amount-3);
  assert.equal(lucky.winChance!-(base.winChance??50),10);assert.equal((base.winChance??50)-cursed.winChance!,10);
});
test('B19 trims one life of damage, D20 adds one, both cancel; unsold penalties use the same statuses outside the life rules',()=>{
  const survival=()=>{const s=createAppraisalRun(['a','b'],'wounds',{survival:SURVIVAL_RULES,polish:true});return s;};
  let s=survival();grant(s,s.players[0]!,'B19');damageLife(s,s.players[0]!,1,'t');assert.equal(s.players[0]!.life,SURVIVAL_RULES.maxLife);assert(!status(s.players[0]!,'B19'));
  s=survival();grant(s,s.players[0]!,'D20');damageLife(s,s.players[0]!,1,'t');assert.equal(s.players[0]!.life,SURVIVAL_RULES.maxLife-2);
  s=survival();grant(s,s.players[0]!,'D20');grant(s,s.players[0]!,'B19');damageLife(s,s.players[0]!,2,'t');assert.equal(s.players[0]!.life,SURVIVAL_RULES.maxLife-2,'ward and wound cancel');
  const plain=(ids:Array<'B19'|'D20'>)=>{const t=table('unsold');t.config.brokerage=BROKERAGE_RULES;t.vault=[];const p=t.players[0]!;const item=t.items[p.stock[0]!]!;item.npc='orc';for(const id of ids)grant(t,p,id);const c=p.credits;unsoldPenalty(t,p,item);return c-p.credits;};
  assert.equal(plain([]),3);assert.equal(plain(['B19']),0);assert.equal(plain(['D20']),6);
});
test('D18 hidden taxes add a credit to purchases, cleansing and recovery deals; B03 takes 2 off the cleansing fee',()=>{
  const t=noOmen(table('fees'));const p=t.players[0]!;assert.equal(feeSurcharge(t,p),0);grant(t,p,'D18');assert.equal(feeSurcharge(t,p),1);
  const v=appraisalViewFor(t,'alice');const item=v.self.stock[0]!;const c=p.credits;const after=act(t,'alice',{type:'buy',itemIds:[p.stock[0]!],condition:false}).players[0]!;
  assert.equal(c-after.credits,purchasePrice(v,[item],false));assert.equal(v.fee,1);
  const surv=createAppraisalRun(['a','b'],'fees-recovery',{survival:SURVIVAL_RULES,polish:true});const q=surv.players[0]!;q.selectedPortalId=q.portals[0]!.id;q.portals[0]!.npc='vampire';
  noOmen(surv);const plainCost=appraisalViewFor(surv,'a').self.recoveryOffer?.credits??0;grant(surv,q,'D18');assert.equal(appraisalViewFor(surv,'a').self.recoveryOffer!.credits,(plainCost||2)+1);
  const clean=(ids:Array<'D18'|'B03'>)=>{const s=noOmen(table('cleanse-fee'));s.config.cleanse=true;for(const id of ids)grant(s,s.players[0]!,id);return appraisalViewFor(s,'alice').self.cleanseOffer!.items.find(r=>r.itemId==='owned-mirror')!.price;};
  const base=clean([]);assert.equal(clean(['D18']),base+1);assert.equal(clean(['B03']),Math.max(1,base-2));
});
test('three relics raise caps, selling them takes the surplus away, and nothing exceeds the hard cap',()=>{
  assert.deepEqual(POLISH_KINDS,['vital-flask','life-relic','wish-ledger']);
  for(const kind of POLISH_KINDS){assert((PASSIVE_ITEMS as Record<string,unknown>)[kind]);assert(merchantKinds('orc',3,true,true,true,false).every(k=>k!==kind));}
  assert(['orc','vampire','autometa','alien','darkone','beast','deepsea','swarm'].some(n=>merchantKinds(n as NpcId,3,true,true,true,true).includes('vital-flask')));
  const s=createAppraisalRun(['a','b'],'caps',{polish:true,catalogVersion:3,survival:SURVIVAL_RULES});const p=s.players[0]!;
  const give=(kind:ItemKind,n:number)=>{for(let i=0;i<n;i++){const id=`cap-${kind}-${i}`;s.items[id]={...s.items[Object.keys(s.items)[0]!]!,id,kind,owner:p.id,genuine:true,cursed:false};p.inventory.push(id);}};
  assert.equal(maxEnergyOf(s,p),10);give('vital-flask',2);give('life-relic',2);
  assert.equal(maxEnergyOf(s,p),14);assert.equal(maxLifeOf(s,p),SURVIVAL_RULES.maxLife+2);
  const view=appraisalViewFor(s,'a').self;assert.equal(view.maxEnergy,14);assert.equal(view.maxLife,SURVIVAL_RULES.maxLife+2);
  give('vital-flask',20);assert.equal(maxEnergyOf(s,p),20,'hard cap');
  const plain=createAppraisalRun(['a','b'],'caps-plain',{polish:true,catalogVersion:3});const q=plain.players[0]!;const id='relic-1';plain.items[id]={...plain.items[Object.keys(plain.items)[0]!]!,id,kind:'life-relic',owner:q.id};q.inventory.push(id);
  assert.equal(maxEnergyOf(plain,q),11,'without lives the relic raises max energy instead');
});
test('a relic that leaves the inventory drops the surplus energy, and wish slots grow with the ledger',()=>{
  let s=table('relic-sale');s.config.catalogVersion=3;s.config.wishlist=true;s.config.wishContract=true;const p=s.players[0]!;
  const id='flask-1';s.items[id]={...s.items['owned-mirror']!,id,kind:'vital-flask'};p.inventory.push(id);
  p.energy=12;assert(maxEnergyOf(s,p)>=12);
  s=openMarket(s,'vital-flask',50);s.market.budget=50;
  s=act(s,'alice',{type:'market-sell',itemId:id,orderId:'quote-vital-flask'});
  assert(s.players[0]!.energy<=maxEnergyOf(s,s.players[0]!),'surplus energy clamped');assertAppraisalInvariants(s);
  const slots=(n:number)=>{const t=table('slots');t.config.catalogVersion=3;t.config.wishlist=true;t.config.wishContract=true;const q=t.players[0]!;for(let i=0;i<n;i++){const wid=`ledger-${i}`;t.items[wid]={...t.items['owned-mirror']!,id:wid,kind:'wish-ledger'};q.inventory.push(wid);}
    q.inventory=q.inventory.filter(i=>!i.startsWith('owned-') || i==='owned-mirror');return appraisalViewFor(t,'alice').self.wishDesk!.cap;};
  assert.equal(slots(0),2);assert.equal(slots(1),3);assert.equal(slots(5),4,'cap of four');
});
for(const id of POLISH_EVENT_IDS) test(`${id}: eligible only under polish rules, resolves its choice, declines free, UI quote matches`,()=>{
  const spec=POLISH_EVENTS[id]!;
  const build=()=>{const s=table(`polish-${id}`);if(spec.phase==='TRADE')s.phase='TRADE';s.config.brokerage=BROKERAGE_RULES;s.vault=[];return s;};
  const state=build();const p=state.players[0]!;assert.equal(eventEligible(state,p,id),true,id);
  const off=build();off.config.polish=false;assert.equal(eventEligible(off,off.players[0]!,id),false);
  for(const blocker of spec.avoid){const blocked=build();grant(blocked,blocked.players[0]!,blocker);assert.equal(eventEligible(blocked,blocked.players[0]!,id),false,`${id} is pointless with ${blocker}`);}
  offerEvent(state,p,id);const offer=structuredClone(p.eventOffer!);assert.deepEqual(offer.choices,['accept','decline']);
  const declined=act(structuredClone(state),'alice',{type:'event',key:offer.key,choice:'decline'}).players[0]!;assert.equal(declined.credits,build().players[0]!.credits);
  const view=appraisalViewFor(state,'alice');const need=eventNeeds(view,view.self.eventOffer!,'accept','');
  const decision=eventDecision(view.self.eventOffer!,'accept',{itemId:'',statusId:'',fact:'',guess:true})!;
  const before={credits:p.credits,energy:p.energy};const after=act(state,'alice',decision as Body).players[0]!;
  assert.equal(before.energy-after.energy,need.energy);assert.equal(after.credits-before.credits,(spec.reward??0)-need.credits);
  for(const s of spec.grant) assert(status(after,s),`${id} grants ${s}`);
});
test('every random draw differs: 200 fresh seeds never repeat the same route, omen run or event schedule',()=>{
  const routes=new Set<string>(),events=new Set<string>();
  for(let i=0;i<200;i++){const seed=randomBytes(32).toString('hex');const run=createAppraisalRun(['a','b'],seed,{polish:true,brokerage:BROKERAGE_RULES});
    routes.add(JSON.stringify([run.schedule.a!.map(row=>row.map(portal=>[portal.npc,portal.stock.map(id=>run.items[id]!.kind)])),[1,2,3].map(e=>omenOf({polish:true},seed,e)!.id)]));
    events.add(run.players.map(p=>p.eventOffer?.id??'-').join(','));}
  assert.equal(routes.size,200,'no two runs share a route');assert(events.size>3,'opening events vary');
});
test('polish bots finish complete seeded runs with strict replay in both rule sets',()=>{
  for(const survival of [false,true]) for(const policy of ['cautious','aggressive','collector','trader'] as const) for(let i=0;i<4;i++)
    simulateAppraisalRun(3,policy,`polish:${survival}:${policy}:${i}`,{brokerage:BROKERAGE_RULES,polish:true,...(survival?{survival:SURVIVAL_RULES}:{})});
});
test('E108 boon draft: three distinct buffs the seat does not hold, a different draft each seed, one pick granted, strangers rejected',()=>{
  const drafts=new Set<string>();
  for(let i=0;i<40;i++){const s=table(`boon-${i}`);grant(s,s.players[0]!,'B03');const p=s.players[0]!;
    assert.equal(eventEligible(s,p,'E108'),true);offerEvent(s,p,'E108');const offer=p.eventOffer!;
    assert.equal(offer.boons!.length,3);assert.equal(new Set(offer.boons).size,3);assert(offer.boons!.every(id=>id.startsWith('B') && id!=='B03'));drafts.add(offer.boons!.join());}
  assert(drafts.size>25,'drafts vary by seed');
  const s=table('boon-pick');const p=s.players[0]!;offerEvent(s,p,'E108');const offer=structuredClone(p.eventOffer!);const energy=p.energy,credits=p.credits;
  assert.deepEqual(offer.choices,['pick'],'a free boon has no decline');
  assert.throws(()=>act(structuredClone(s),'alice',{type:'event',key:offer.key,choice:'pick',statusId:STATUS_IDS.find(id=>id.startsWith('B') && !offer.boons!.includes(id))!}),/พร/);
  assert.throws(()=>act(structuredClone(s),'alice',{type:'event',key:offer.key,choice:'pick'}),/พร/);
  const view=appraisalViewFor(s,'alice');const options=eventStatusOptions(view.self.eventOffer!,'pick');assert.deepEqual(options,offer.boons);
  const decision=eventDecision(view.self.eventOffer!,'pick',{itemId:'',statusId:options[1]!,fact:'',guess:true})!;
  const done=act(s,'alice',decision as Body).players[0]!;assert(status(done,options[1]!));assert.equal(done.credits,credits);assert.equal(done.energy,energy,'a boon is free');
  assert.throws(()=>act(structuredClone(s),'alice',{type:'event',key:offer.key,choice:'decline'}),/ตัวเลือก/);
  const plain=table('boon-off');plain.config.polish=false;assert.equal(eventEligible(plain,plain.players[0]!,'E108'),false);
});
