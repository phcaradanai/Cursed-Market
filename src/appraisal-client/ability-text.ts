import type { ItemView, MerchantAbilityView, NpcId } from '../game/appraisal/types.js';
import { itemName } from './catalog-text.js';
import { getLang, pick } from './i18n.js';

/** Local copy for the ability surface; no hidden item information is inferred here. */
export function abilityText(th:string,en:string,vars:Record<string,string|number>={}):string {
  return pick(th,en).replace(/\{(\w+)\}/g,(match,key:string)=>key in vars?String(vars[key]):match);
}

const EN_ABILITIES:Record<NpcId,{name:string;description:string}>={
  orc:{name:'Close the deal',description:'Discount one merchant item by 10/15/20% at trust tiers 1/2/3. Applies to credits paid, excluding fees.'},
  autometa:{name:'Complete analysis',description:'Reveal one shop item’s true value at tier 1, value and authenticity at tier 2, or all facts at tier 3.'},
  alien:{name:'Dimensional exchange',description:'Exchange one held original for one of 2/3/4 offers. Its scoring value cannot exceed the original. Offers reveal only facts already inspected on the original.'},
  vampire:{name:'Preserve the original',description:'Preserve one consumable for its next activation, once per original. Tiers 2/3 also restore 1/2 energy. Copies are ineligible.'},
  darkone:{name:'Tear the pact',description:'Remove one selected debuff. Tier 2 also restores 1 energy; tier 3 also shields against the next debuff.'},
  deepsea:{name:'Cleanse the relic',description:'Make one held item curse-free without a separate inspection. Tier 2 also reveals authenticity; tier 3 reveals value. The use is spent even if the item was already safe.'},
  swarm:{name:'Budding',description:'Create one numbered copy worth 25/35/50% of a held original, with 40% effects. One copy per original. Copies cannot be copied; consuming one never allows another from that original.'},
  beast:{name:'Replace the offer',description:'Replace one unbought shop item with one of 2/3/4 choices, including the original. Normal purchase rules still apply.'},
};

export const abilityName=(ability:MerchantAbilityView):string=>pick(ability.name,EN_ABILITIES[ability.npc].name);
export const abilityDescription=(ability:MerchantAbilityView):string=>pick(ability.description,EN_ABILITIES[ability.npc].description);

export function abilityReadiness(ability:MerchantAbilityView):string {
  if(ability.remaining>0)return abilityText('รออีก {n} การพบพ่อค้า','Ready in {n} encounters',{n:ability.remaining});
  if(ability.trust<1)return abilityText('ยังไม่ปลดล็อก','Locked');
  return ability.ready?abilityText('พร้อมใช้','Ready'):abilityText('ยังใช้ไม่ได้','Unavailable');
}

/** Preserve the server's precise Thai explanation; English never silently displays Thai. */
export function abilityReason(ability:MerchantAbilityView):string|null {
  if(!ability.reason)return null;
  if(getLang()==='th')return ability.reason;
  if(ability.remaining>0)return abilityReadiness(ability);
  if(ability.trust<1)return 'Gain at least 1 trust with this merchant to unlock their ability.';
  const reasons:Record<string,string>={
    'ใช้ความสามารถพ่อค้าในช่วงนี้แล้ว':'A merchant ability has already been used this encounter.',
    'เลือกสินค้าที่เสนอให้ก่อน':'Complete the pending item choice first.',
    'ถูกจับผิดในช่วงนี้แล้ว':'This merchant will not help after catching you this encounter.',
    'จบช่วงหรือพักแล้ว':'Your actions have ended for this phase.',
    'ตอบเหตุการณ์ก่อน':'Resolve your event before using an ability.',
    'ใช้ในช่วงประเมินหรือต่อรอง':'Use this ability during appraisal or trade.',
    'ไม่มี debuff ให้ลบ':'You have no debuff to remove.',
    'ไม่มีสินค้าที่ใช้ความสามารถนี้ได้':'There are no eligible items for this ability.',
  };
  return reasons[ability.reason]??'This ability is currently unavailable.';
}

export function abilityItemLabel(item:ItemView):string {
  return item.copy?abilityText('สำเนา #{n} ของ {name}','Copy #{n} of {name}',{n:item.copy.number,name:itemName(item.kind)}):itemName(item.kind);
}

export function abilityCopyText(item:ItemView):string {
  return item.copy?abilityText('ผลของสำเนา 40% · มูลค่า {n}% ของต้นฉบับ','Copy effects: 40% · Value: {n}% of the original',{n:item.copy.valuePercent}):'';
}

/** `ask` is public selling price, and must never stand in for the unknown true value. */
export function abilityItemFacts(item:ItemView,shop=false):string {
  const k=item.knowledge;
  const value=k.base!==undefined?abilityText('มูลค่าจริง {n} เครดิต','True value: {n} credits',{n:k.base}):k.range?abilityText('เบาะแสมูลค่า {a}–{b} เครดิต','Value clue: {a}–{b} credits',{a:k.range[0],b:k.range[1]}):abilityText('ยังไม่รู้มูลค่าจริง','True value unknown');
  return [shop?abilityText('ราคาหน้าร้าน {n} เครดิต','Asking price: {n} credits',{n:item.ask}):'',value,
    k.genuine===undefined?abilityText('ยังไม่รู้ความแท้','Authenticity unknown'):k.genuine?abilityText('ของแท้','Genuine'):abilityText('ของปลอม','Fake'),
    k.cursed===undefined?abilityText('ยังไม่รู้คำสาป','Curse unknown'):k.cursed?abilityText('มีคำสาป','Cursed'):abilityText('ไม่มีคำสาป','Not cursed'),abilityCopyText(item)].filter(Boolean).join(' · ');
}
