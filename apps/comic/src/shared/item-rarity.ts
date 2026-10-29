/** Isomorphic, versioned appearance library. No assets, network, clock or global RNG. */
export const RARITIES = ['common','uncommon','rare','epic','legendary','mythic'] as const;
export type Rarity = typeof RARITIES[number];
export const THEMES = ['inferno','frost','storm','venom','spirit','lunar','solar','void','prism','clockwork'] as const;
export type Theme = typeof THEMES[number] | 'plain';
export interface ItemAppearance { version:1; rarity:Rarity; theme:Theme; visualSeed:number }
export interface ThemeWeight { theme:Theme; weight:number }
export interface RarityConfig {
  version:1;
  /** Probabilities sum to 1; zero explicitly disables a tier. */
  rates:Record<Rarity,number>;
  themes:Record<Rarity,ThemeWeight[]>;
}
export const RARITY_NAMES:Record<Rarity,{th:string;en:string}> = {
  common:{th:'ธรรมดา',en:'Common'},uncommon:{th:'ไม่ธรรมดา',en:'Uncommon'},rare:{th:'หายาก',en:'Rare'},
  epic:{th:'มหากาพย์',en:'Epic'},legendary:{th:'ตำนาน',en:'Legendary'},mythic:{th:'มหัศจรรย์',en:'Mythic'},
};
export const THEME_NAMES:Record<Theme,{th:string;en:string}> = {
  plain:{th:'ต้นฉบับ',en:'Original'},inferno:{th:'นรก',en:'Inferno'},frost:{th:'เหมันต์',en:'Frost'},
  storm:{th:'พายุ',en:'Storm'},venom:{th:'พิษ',en:'Venom'},spirit:{th:'วิญญาณ',en:'Spirit'},
  lunar:{th:'จันทรา',en:'Lunar'},solar:{th:'สุริยะ',en:'Solar'},void:{th:'อเวจี',en:'Void'},
  prism:{th:'ปริซึม',en:'Prism'},clockwork:{th:'จักรกล',en:'Clockwork'},
};
/** Initial experiment, not approved economic balance. Each run persists its own config. */
export function defaultRarityConfig():RarityConfig {
  return {version:1,rates:{common:.6,uncommon:.25,rare:.1,epic:.035,legendary:.013,mythic:.002},
    themes:Object.fromEntries(RARITIES.map(r=>[r,r==='common'?[{theme:'plain',weight:1}]:THEMES.map(theme=>({theme,weight:1}))])) as RarityConfig['themes']};
}
export function validateRarityConfig(config:RarityConfig):void {
  if(!config || config.version!==1 || !config.rates || !config.themes)throw Error('Invalid rarity config version');
  let sum=0;
  for(const r of RARITIES){
    const rate=config.rates[r];if(!Number.isFinite(rate)||rate<0||rate>1)throw Error(`Invalid rarity rate: ${r}`);sum+=rate;
    const themes=config.themes[r];
    if(!Array.isArray(themes)||themes.length<1||themes.length>11||new Set(themes.map(t=>t.theme)).size!==themes.length)throw Error(`Invalid theme pool: ${r}`);
    if(themes.some(t=>!['plain',...THEMES].includes(t.theme)||!Number.isFinite(t.weight)||t.weight<0||t.weight>10000)||!themes.some(t=>t.weight>0))throw Error(`Invalid theme weight: ${r}`);
  }
  if(Math.abs(sum-1)>1e-9)throw Error('Rarity probabilities must sum to 1');
}
/** Independent label streams prevent changing one parameter from rerolling everything. */
export function appearanceRandom(seed:number,label:string):number {
  let h=(seed>>>0)^0x811c9dc5;
  for(let i=0;i<label.length;i++)h=Math.imul(h^label.charCodeAt(i),0x01000193);
  h^=h>>>16;h=Math.imul(h,0x7feb352d);h^=h>>>15;h=Math.imul(h,0x846ca68b);h^=h>>>16;
  return (h>>>0)/0x100000000;
}
export function weightedPick<T>(entries:readonly {value:T;weight:number}[],draw:number):T {
  if(!Number.isFinite(draw)||draw<0||draw>=1||!entries.length||entries.some(e=>!Number.isFinite(e.weight)||e.weight<0))throw Error('Invalid weighted draw');
  const total=entries.reduce((n,e)=>n+e.weight,0);if(!Number.isFinite(total)||total<=0)throw Error('Empty weighted pool');
  let cursor=draw*total;let last=entries[0]!.value;
  for(const entry of entries){if(entry.weight===0)continue;last=entry.value;cursor-=entry.weight;if(cursor<0)return entry.value;}
  return last;
}
export function rollAppearance(seed:number,config:RarityConfig):ItemAppearance {
  validateRarityConfig(config);if(!Number.isSafeInteger(seed)||seed<0||seed>0xffffffff)throw Error('Invalid appearance seed');
  const rarity=weightedPick(RARITIES.map(value=>({value,weight:config.rates[value]})),appearanceRandom(seed,'rarity'));
  const theme=weightedPick(config.themes[rarity].map(t=>({value:t.theme,weight:t.weight})),appearanceRandom(seed,'theme'));
  return {version:1,rarity,theme,visualSeed:seed};
}
export type RGB = [number,number,number];
export function validateItemAppearance(appearance:ItemAppearance):void {
  if(!appearance||appearance.version!==1||!RARITIES.includes(appearance.rarity)||!['plain',...THEMES].includes(appearance.theme)||!Number.isSafeInteger(appearance.visualSeed)||appearance.visualSeed<0||appearance.visualSeed>0xffffffff)throw Error('Unsupported item appearance');
}
const HUES:Record<Theme,readonly [number,number][]> = {
  plain:[[35,42]],inferno:[[12,43],[355,24],[280,325],[195,240]],frost:[[185,215],[205,265],[160,195]],
  storm:[[210,280],[270,330],[45,205]],venom:[[90,140],[125,180],[275,125]],spirit:[[150,190],[175,230],[260,300]],
  lunar:[[220,265],[190,230],[270,320]],solar:[[30,55],[5,40],[45,80]],void:[[270,320],[225,280],[320,190]],
  prism:[[0,180],[90,270],[210,30]],clockwork:[[25,50],[165,40],[5,185]],
};
function rgb(h:number,s:number,l:number):RGB {
  const f=(n:number)=>{const k=(n+h/30)%12,a=s*Math.min(l,1-l);return l-a*Math.max(-1,Math.min(k-3,9-k,1));};
  return [f(0),f(8),f(4)];
}
/** A theme owns its motion vocabulary; seed owns bounded palettes and variation. */
export function resolveAppearance(appearance:ItemAppearance) {
  validateItemAppearance(appearance);
  const random=(label:string)=>appearanceRandom(appearance.visualSeed,label);
  const palettes=HUES[appearance.theme],pair=palettes[Math.floor(random('palette')*palettes.length)]!;
  const hue=(pair[0]+(random('hue')-.5)*16+360)%360;
  const accent=(pair[1]+(random('accent')-.5)*16+360)%360;
  const level=RARITIES.indexOf(appearance.rarity),strength=[0,.3,.5,.7,.9,1][level]!;
  return {level,strength,theme:appearance.theme,themeIndex:appearance.theme==='plain'?-1:THEMES.indexOf(appearance.theme),
    primary:rgb(hue,.65+random('saturation')*.25,.52+random('lightness')*.1),accent:rgb(accent,.8,.6),
    speed:.65+random('speed')*.7,phase:random('phase')*30,particleCount:level===0?0:6+level*6,
    aura:level===0?0:.08+level*.055,ringCount:level<3?0:level-2};
}
