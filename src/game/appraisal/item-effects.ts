import { integerEffect } from './copy-effects.js';
import type { PassiveBonuses } from './passives.js';
import type { ItemKind } from './types.js';

export interface ItemEffect {
  effect:keyof PassiveBonuses; amount:number; text:string; en:string;
}
const effect=<K extends keyof PassiveBonuses>(key:K,amount:number,text:string,en:string):ItemEffect & {effect:K}=>({effect:key,amount,text,en});
const luck=effect('luck',2,'โอกาสทายหัวก้อยถูก +2 จุดเปอร์เซ็นต์ต่อชิ้น สูงสุด 85%','Coin-call chance +2 percentage points per copy, capped at 85%');
const price=effect('freePrice',1,'ตรวจราคาฟรีเพิ่ม 1 ครั้งต่อช่วงต่อชิ้น ยังใช้โควตาตรวจ','One extra free price inspection per encounter per copy; still uses inspection quota');
const auth=effect('freeAuth',1,'ตรวจความแท้ฟรีเพิ่ม 1 ครั้งต่อช่วงต่อชิ้น ยังใช้โควตาตรวจ','One extra free authenticity inspection per encounter per copy; still uses inspection quota');
const curse=effect('freeEffects',1,'ตรวจคำสาปฟรีเพิ่ม 1 ครั้งต่อช่วงต่อชิ้น ยังใช้โควตาตรวจ','One extra free curse inspection per encounter per copy; still uses inspection quota');
const energy=effect('energyRecovery',1,'ดีลฟื้นพลังกับพ่อค้าฟื้นเพิ่ม 1 ต่อชิ้น ไม่เกินพลังสูงสุด','Merchant energy recovery restores 1 extra per copy, up to your cap');
const life=effect('lifeRecovery',1,'ดีลฟื้นชีวิตกับพ่อค้าฟื้นเพิ่ม 1 ต่อชิ้น ไม่เกินชีวิตสูงสุด','Merchant life recovery restores 1 extra per copy, up to your cap');
const discount=effect('discount',1,'ซื้อจากพ่อค้าลดเพิ่ม 1 เครดิตต่อดีลต่อชิ้น ราคาต่ำสุด 0','Merchant purchases cost 1 credit less per deal per copy, minimum 0');
const acceptance=effect('acceptance',2,'โอกาสพ่อค้ายอมรับราคาต่ำ +2 จุดเปอร์เซ็นต์ต่อชิ้น รวมสูงสุด 95%','Low-price acceptance +2 percentage points per copy, capped at 95%');
const commission=effect('commission',2,'ค่านายหน้าจากของที่ประเมิน +2 จุดเปอร์เซ็นต์ต่อชิ้น รวมสูงสุด 100%','Appraisal commission +2 percentage points per copy, capped at 100%');

/** Public kinds alone determine held effects; hidden authenticity and curses never affect them. */
export const EXTRA_HELD_EFFECTS:Partial<Record<ItemKind,ItemEffect>>={
  mirror:price,'memory-mirror':auth,'rift-mirror':curse,'compound-mirror':price,
  orb:luck,'blood-orb':life,'storm-orb':energy,'abyss-pearl':luck,
  key:discount,'bone-key':discount,'clockwork-key':discount,
  mask:acceptance,'bone-mask':acceptance,'void-mask':curse,
  potion:life,'blood-tonic':life,'dream-tonic':luck,'kraken-ink':curse,
  battery:energy,'sun-cell':energy,'void-cell':curse,'larva-cell':energy,
  amulet:luck,'oath-charm':acceptance,'echo-charm':life,'siren-conch':luck,'void-seal':luck,
  blade:commission,'bone-blade':commission,'eclipse-blade':commission,'chitin-blade':commission,'smith-hammer':commission,whetstone:discount,
  scanner:price,'truth-lens':auth,'curse-meter':curse,'doubt-lens':auth,'tide-lantern':price,
  food:energy,'ember-feed':acceptance,'moon-feed':luck,'hive-comb':life,
};
export type UseBonuses=Partial<Pick<PassiveBonuses,'luck'|'income'|'coinWin'|'discount'|'acceptance'|'inspections'>>;
const useLuck=effect('luck',10,'โอกาสทายหัวก้อยถูก +10 จุดเปอร์เซ็นต์จนจบรอบนี้ ชนิดเดิมไม่บวกซ้ำ ต่างชนิดบวกกันได้ สูงสุด 85%','Coin-call chance +10 percentage points until this encounter ends; Same kind does not stack; different kinds add together, capped at 85%');
/** Extra benefits accompany the item's original activation, under the same genuine/fake/fog rules. */
export const ITEM_USE_EFFECTS:Partial<Record<ItemKind,ItemEffect & {effect:keyof UseBonuses}>>={
  'dream-tonic':useLuck,'moon-feed':useLuck,'gambler-hat':useLuck,
  'noble-seal':effect('income',3,'เงินรางวัลจบรอบนี้ +3 เครดิต ชนิดเดิมไม่บวกซ้ำ ต่างชนิดบวกกันได้','This encounter’s round income +3 credits; Same kind does not stack; different kinds add together'),
  'lucky-die':effect('coinWin',1,'ยอดได้หรือเสียต่อเหรียญรอบนี้ +1 เครดิต ชนิดเดิมไม่บวกซ้ำ ต่างชนิดบวกกันได้','This encounter’s gain or loss per coin +1 credit; Same kind does not stack; different kinds add together'),
  'guild-badge':effect('discount',2,'ซื้อจากพ่อค้าลดเพิ่ม 2 เครดิตต่อดีลจนจบรอบนี้ ชนิดเดิมไม่บวกซ้ำ ต่างชนิดบวกกันได้','Merchant purchases cost 2 credits less per deal until this encounter ends; Same kind does not stack; different kinds add together'),
  'negotiator-gloves':effect('acceptance',10,'โอกาสพ่อค้ายอมรับราคาต่ำ +10 จุดเปอร์เซ็นต์จนจบรอบนี้ ชนิดเดิมไม่บวกซ้ำ ต่างชนิดบวกกันได้ สูงสุด 95%','Low-price acceptance +10 percentage points until this encounter ends; Same kind does not stack; different kinds add together, capped at 95%'),
  'inspector-notebook':effect('inspections',1,'โควตาตรวจสินค้าเพิ่ม 1 ครั้งในรอบนี้ ชนิดเดิมไม่บวกซ้ำ ต่างชนิดบวกกันได้','One extra inspection this encounter; Same kind does not stack; different kinds add together'),
};
export function addUseBonuses(bonuses:PassiveBonuses,used:UseBonuses|undefined):PassiveBonuses {
  for(const key of Object.keys(used??{}) as Array<keyof UseBonuses>)bonuses[key]+=used![key]??0;
  for(const key of Object.keys(bonuses) as Array<keyof PassiveBonuses>)if(!['commission','luck','acceptance','mitigation'].includes(key))bonuses[key]=integerEffect(bonuses[key]);
  return bonuses;
}
