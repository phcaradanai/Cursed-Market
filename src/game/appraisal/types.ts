export const STATUS_IDS = ['B01','B02','B03','B04','B05','B06','B07','B08','B09','B10','B11','B12','B13','B14','B15','B16','B17','B18','B19','B20','D01','D02','D03','D04','D05','D06','D07','D08','D09','D10','D11','D12','D13','D14','D15','D16','D17','D18','D19','D20'] as const;
export type StatusId = typeof STATUS_IDS[number];
export const EVENT_IDS = ['E01','E02','E03','E04','E05','E06','E07','E08','E09','E10','E11','E12','E13','E14','E15','E16','E17','E18','E19','E20','E21','E22','E23','E24','E25','E26','E27','E28','E29','E30','E31','E32','E33','E34','E35','E36','E37','E38','E39','E40','E41','E42','E43','E44','E45','E46','E47','E48','E49','E50'] as const;
/** NPC × held-item encounters. Kept outside EVENT_IDS so the original random pool never changes. */
export const BOND_EVENT_IDS = ['E51','E52','E53','E54','E55','E56','E57','E58','E59','E60','E61','E62','E63','E64','E65','E66','E67','E68','E69','E70','E71','E72','E102','E103','E104','E105','E106','E107','E74','E75','E76','E77','E78','E79','E80','E81','E82','E83'] as const;
/** Random events that only exist in the deep-sea/swarm expansion; kept outside EVENT_IDS so the original pool never changes. */
/** Polish-pass random events, data-driven (see polish-events.ts). */
export const POLISH_EVENT_IDS = ['E94','E95','E96','E97','E98','E99','E100','E101'] as const;
/** Boon draft: pick one of three seeded buffs, like a roguelike reward choice. */
export const BOON_EVENT_ID = 'E108' as const;
/** Personal merchant contracts, separately gated to preserve historical seeded runs. */
export const NPC_EVENT_IDS = ['E109','E110','E111','E112','E113','E114','E115','E116'] as const;
export const EXPANSION_EVENT_IDS = ['E84','E85','E86','E87','E88','E89','E90','E91','E92','E93'] as const;
/** Merchant wish announcement; kept outside both pools so neither changes. */
export const WISH_EVENT_ID = 'E73' as const;
export type EventId = typeof EVENT_IDS[number] | typeof BOND_EVENT_IDS[number] | typeof WISH_EVENT_ID | typeof EXPANSION_EVENT_IDS[number] | typeof POLISH_EVENT_IDS[number] | typeof BOON_EVENT_ID | typeof NPC_EVENT_IDS[number];
export type NpcId = 'orc' | 'vampire' | 'autometa' | 'alien' | 'darkone' | 'beast' | 'deepsea' | 'swarm';
export type ItemFamily = 'mirror' | 'orb' | 'key' | 'mask' | 'potion' | 'battery' | 'amulet' | 'blade' | 'scanner' | 'food';
export const PASSIVE_ITEM_IDS=['inspection-warrant','tax-order','noble-seal','gambler-hat','lucky-die','merchant-ledger','friendship-ring','negotiator-gloves','guild-badge','light-satchel','surveyor-lens','curse-compass','market-pass','authenticity-seal','smuggler-cloak','merchant-canteen','healing-brooch','inspector-notebook','vital-flask','life-relic','wish-ledger'] as const;
export type PassiveKind=typeof PASSIVE_ITEM_IDS[number];
export type InspectionProperty='price'|'authenticity'|'effects';
export type ItemKind = ItemFamily | 'memory-mirror' | 'rift-mirror' | 'blood-orb' | 'storm-orb' |
  'bone-key' | 'clockwork-key' | 'bone-mask' | 'void-mask' | 'blood-tonic' | 'dream-tonic' |
  'sun-cell' | 'void-cell' | 'oath-charm' | 'echo-charm' | 'bone-blade' | 'eclipse-blade' |
  'truth-lens' | 'curse-meter' | 'ember-feed' | 'moon-feed' | 'smith-hammer' | 'whetstone' | 'doubt-lens' | 'void-seal' |
  'abyss-pearl' | 'tide-lantern' | 'kraken-ink' | 'siren-conch' | 'hive-comb' | 'chitin-blade' | 'larva-cell' | 'compound-mirror' | PassiveKind;
export type AppraisalPhase = 'PORTALS' | 'APPRAISAL' | 'TRADE' | 'REVEAL' | 'RESULTS';
export interface AppraisalConfig {
  /** Absent in original v0.4 audits: retain the original 10-item generation pool. */
  catalogVersion?: 1 | 2 | 3;
  /** Absent in historical audits: preserve their original economy. */
  roundRewards?: boolean;
  /** Absent in saved runs: retain the pre-commission/trust/market-contract rules. */
  commerce?: boolean;
  /** Absent in saved runs: retain the old effects check where only B02 could reveal a curse. */
  curseSight?: boolean;
  /** Absent in saved runs: buying from an NPC still costs energy there. */
  freeBuy?: boolean;
  /** Absent in saved runs: fake items never produce their good effect there. */
  fakeEffect?: boolean;
  /** Absent in saved runs: merchants do not clean curses and the smith tools are never stocked. */
  cleanse?: boolean;
  /** Absent in saved runs: merchants never announce wishes. */
  wishlist?: boolean;
  /** Absent in saved runs: wishes cost no energy, have no cap and never lose value. */
  wishContract?: boolean;
  /** Absent in saved runs: listings carry no appraiser claims and the challenge tools are never stocked. */
  challenge?: boolean;
  /** Absent in saved runs: the Deep Sea Monster and The Swarm never appear and their items, statuses and events stay out of play. */
  expansion?: boolean;
  /** Absent in saved runs: no omens, sale/fee/life modifiers beyond the original market rules, capacity relics or polish events. */
  polish?: boolean;
  /** Absent in saved runs: no personal merchant contracts or delayed repayments. */
  npcEvents?: boolean;
  encounters: number; startingCredits: number; maxEnergy: number; recoveryEnergy: number;
  bankReserve: number; marketProbability: number; marketMaxOrders: number; marketQuota: number;
  /** Absent in v0.4: retain encounter recovery and historical scoring exactly. */
  survival?: { maxLife:number; encounterLifeCost:number; entryEnergyCost:number };
  /** Absent in v0.4/v0.5 audits: unsold-appraisal duty, Dark Market vault auctions and NPC × held-item events. */
  brokerage?: { auctionProbability:number; maxLots:number; bondProbability:number };
}
export type UnsoldChoice = 'buy'|'penalty'|'consign';
export interface CleanseOffer { npc:NpcId; items:Array<{itemId:string;price:number;chance:number;done:boolean}>; stoneBonus:number }
export interface WishBookRow { npc:NpcId; kind:ItemKind; price:number; initial:number; floor:number; next:number; age:number }
export interface WishDesk { npc:NpcId; cost:number; cap:number; book:WishBookRow[]; replaces:NpcId|null; replaceable:NpcId[] }
export interface WishOffer { npc:NpcId; kind:ItemKind; price:number; initial:number; floor:number; next:number; age:number; trust:number; buffs:number; debuffs:number; tried:boolean; options:Array<{markup:number;price:number;chance:number}>; itemIds:string[] }
/** `amount` is the most the deal can restore; `min` (life deals) is the least, rolled per encounter. */
export interface RecoveryOffer { target:'energy'|'life'; credits:number; amount:number; min?:number }
export interface CollectorResult {
  playerId:string; credits:number; itemValue:number; modifierPercent:number; statusIds:StatusId[]; score:number;
  items:Array<{id:string;kind:ItemKind;base:number;genuine:boolean;cursed:boolean;value:number;certified?:boolean}>;
}
export interface Status { id: StatusId; expires: number; charges: number; targetItemId?: string; starts: number }
export interface Knowledge { range?: [number,number]; base?: number; genuine?: boolean; cursed?: boolean; effectsKnown?: boolean; activationKnown?: boolean; certificate?: boolean; comparison?: string }
export interface AppraisalItem {
  id: string; kind: ItemKind; base: number; genuine: boolean; cursed: boolean; ask: number;
  owner: string; npcOwnerId: string; npc: NpcId; encounter: number; certificate: boolean;
  lastAppraisal: number | null;
  appraisedBy?:string; commissionPaid?:boolean;
  reservation: number; lastAccepted: boolean | null;
}
export interface Portal { id: string; npc: NpcId; stock: string[]; disabled: boolean }
export interface Valuation { value: number; accuracy: boolean; caught: boolean; accepted: boolean }
export interface EventOffer {
  id: EventId; key: string; choices: string[]; itemIds: string[]; statusIds: StatusId[];
  otherPlayerIds: string[]; quotedPrices: Record<string,number>;
  facts: Record<string,Knowledge>; targetKinds: Record<string,ItemKind>;
  /** Held item a bond swap hands to the NPC; fixed when the offer opens. */
  giveItemId?: string;
  /** The three buffs of a boon draft (E108), fixed when the offer opens. */
  boons?: StatusId[];
  /** What a merchant announces in E73. */
  wish?: {kind:ItemKind;price:number};
  npcTerms?: {credits:number;energy:number;life:number;items:number;loanMax?:number};
}
export interface NpcContracts {
  vampire?: {signedAt:number};
  alien?: {lentAt:number;dueAt:number;itemIds:string[];key:string;reservedCredits:number};
}
export type CoinSide = 'heads' | 'tails';
export interface RoundReward {
  encounter:number; base:number; amount:number; flips:number; settled:boolean;
  incomeBonus?:number; winBonus?:number; winChance?:number;
  lastFlip?:{guess:CoinSide; side:CoinSide; correct:boolean};
}
export interface Appraiser {
  npcContracts?: NpcContracts;
  vampireDiscount?: {encounter:number};
  passiveUses?:Partial<Record<InspectionProperty,number>>;
  roundReward?:RoundReward;
  npcTrust?:Partial<Record<NpcId,number>>;
  id: string; credits: number; energy: number; inventory: string[]; statuses: Status[];
  life?:number; recoveryUsed?:boolean;
  /** Survival commerce: pulse shards earned when another seat buys goods this seat appraised; 3 mend 1 life. */
  pulseShards?:number;
  /** Dark order tickets won at the Dark Market auction; enough of them force a sale (see TRUST_RULES). */
  darkTickets?:number;
  /** Consecutive purchases of other seats' appraised goods from one merchant; the run pays trust. */
  buyStreak?:{npc:NpcId;count:number};
  /** The only seat this one has traded with since `since`; a long exclusive run makes merchants wary. */
  tradeLink?:{partner:string;since:number};
  paused: 'dead' | 'exhausted' | null; done: boolean; portals: Portal[]; selectedPortalId: string | null;
  stock: string[]; knowledge: Record<string,Knowledge>; valuations: Record<string,Valuation>;
  inspections: number; counters: number; activated: string[]; score: number;
  startWealth: number; accuracyBonus: number; eventOffer: EventOffer | null;
  seenEvents: EventId[]; resolvedEvents: EventId[]; offerSlots: number; consequenceSlots: number;
  honorJob: boolean; honestyReward: 'B03' | 'B04' | null; acceptedDanger: boolean;
  caught: boolean; subsidy: boolean; revealedInfo: string[];
  dealMode: 'any'|'cash'|'condition';
  /** Items a merchant already tried to cleanse this encounter; present only with cleanse rules. */
  cleansed?: string[];
  /** What each merchant said it wants; kept until sold. Present only with wishlist rules. */
  wishes?: Partial<Record<NpcId,{kind:ItemKind;price:number;set?:number}>>;
  wishTried?: boolean;
  /** How many wishes this seat requested; keeps each re-roll different. */
  wishRolls?: number;
  notes: string[];
}
export interface MarketContract {
  requirements:Array<{property:'genuine'|'cursed';value:boolean}>;
  bonus:{kind:'credits';amount:number}|{kind:'energy';amount:number}|{kind:'life';amount:number}|{kind:'buff';statusId:Extract<StatusId,`B${string}`>};
  fullPriceCost:{kind:'energy';amount:number}|{kind:'life';amount:number}|{kind:'debuff';statusId:Extract<StatusId,`D${string}`>};
}
export interface MarketOrder { id: string; kind: ItemKind; price: number; quota: Record<string,number>; contract?:MarketContract }
export interface AuctionLot { id: string; itemId: string; minimum: number; bids: Record<string,number>; winnerId?: string | null; price?: number }
export interface DarkMarket { encounter: number; open: boolean; budget: number; orders: MarketOrder[]; lots?: AuctionLot[] }
export interface AuctionLotView { id: string; itemId: string; minimum: number; item: ItemView; yourBid: number | null; bidCount: number; winnerId?: string | null; price?: number }
export interface TradeOffer {
  id: string; buyerId: string; sellerId: string; itemId: string; swapItemId: string | null;
  credits: number; source: 'inventory' | 'npc'; encounter: number; status: 'open'|'accepted'|'rejected';
  condition: boolean;
  /** Buyer calls this claim on the listing a lie; settled when the seller accepts. */
  challenge?: 'genuine'|'cursed';
  /** Void seal staked on the challenge: cancels the penalty if the buyer is wrong. */
  sealId?: string;
}
export interface LedgerEntry { from: string; to: string; amount: number; reason: string; encounter: number }
export interface TraceEntry { type: string; encounter: number; playerId: string; details: Record<string,unknown> }
export interface EncounterResult { encounter: number; playerId: string; gain: number; accuracy: number; score: number; paused: Appraiser['paused'] }
export type AppraisalAction = { playerId: string; requestId: string; encounter: number } & (
  | { type: 'enter'; portalId: string }
  | { type: 'inspect'; itemId: string; property: 'price'|'authenticity'|'effects' }
  | { type: 'appraise'|'counter'; itemId: string; value: number; acceptDanger?: boolean }
  | { type: 'buy'; itemIds: string[]; condition: boolean }
  | { type: 'activate'; itemId: string }
  | { type: 'event'; key: string; choice: string; itemId?: string; itemIds?:string[]; statusId?: StatusId; otherPlayerId?: string; fact?: 'base'|'genuine'|'cursed'; guess?: boolean }
  | { type: 'market-sell'; itemId: string; orderId: string; resolution?:'discount'|'sacrifice' }
  | { type: 'share'; itemId: string; allow: boolean; purchase: boolean; claims?: { genuine?: boolean; cursed?: boolean }; rebate?: number }
  | { type: 'force-buy'; sellerId: string; itemId: string }
  | { type: 'propose'; sellerId: string; itemId: string; credits: number; swapItemId?: string; condition?: boolean; challenge?: 'genuine'|'cursed'; sealId?: string }
  | { type: 'respond'; offerId: string; accept: boolean }
  | { type: 'round-flip'; guess:CoinSide; attempt:number }
  | { type: 'round-bank' }
  | { type: 'done' }
  | { type:'recover-resource'; target:'energy'|'life' }
  | { type:'wish-sell'; itemId:string; markup:number }
  | { type:'wish-new'; replaceNpc?:NpcId }
  | { type:'cleanse'; itemId:string; stoneId?:string }
  | { type:'unsold'; itemId:string; choice:UnsoldChoice }
  | { type:'bid'; lotId:string; credits:number }
);
/** `rebate` is credits the owner pays the buyer when the sale completes, so a poor item can still find a price. */
export interface SharedListing { ownerId: string; itemId: string; purchase: boolean; claims?: { genuine?: boolean; cursed?: boolean }; rebate?: number }
export interface AppraisalState {
  version: 4 | 5; seed: string; config: AppraisalConfig; encounter: number; phase: AppraisalPhase;
  revision: number; players: Appraiser[]; items: Record<string,AppraisalItem>;
  reservedRewards: number;
  schedule: Record<string,Portal[][]>; bank: number; market: DarkMarket;
  listings: SharedListing[]; publicKnowledge: Record<string,Knowledge>; trades: TradeOffer[];
  ledger: LedgerEntry[]; trace: TraceEntry[]; history: EncounterResult[];
  accepted: Record<string,string>; commands: Array<AppraisalAction | { type: 'advance' }>;
  collector?:CollectorResult[];
  /** Items the Dark Market bought or took on consignment; present only with brokerage rules. */
  vault?: string[];
}
export interface ItemView {
  id: string; kind: ItemKind; name: string; image: string; owner: string;
  npc: NpcId;
  range?: [number,number]; ask: number; appraisal: number | null; lockedUntil: number | null;
  price: number; appraisalAccepted: boolean | null;
  appraisedBy?:string; commissionPaid?:boolean;
  knowledge: Knowledge; certificate: boolean; possibleBenefit: string; possibleDrawback: string;
  condition: {statusId:StatusId;discount:number;available:boolean;required:boolean};
}
export interface AppraisalView {
  version: 4 | 5; phase: AppraisalPhase; encounter: number; encounterCount: number | null; revision: number;
  survival?:NonNullable<AppraisalConfig['survival']>; curseSight?:boolean; freeBuy?:boolean; fakeEffect?:boolean; cleanse?:boolean; wishlist?:boolean; wishContract?:boolean; challenge?:boolean; polish?:boolean; omen?:{id:string;name:string;text:string}; salePct?:number; fee?:number; maxEnergy?:number; collector?:CollectorResult[]; brokerage?:boolean; roundRewardBase?:number; passives?:boolean;
  self: Omit<Appraiser,'knowledge'|'portals'|'stock'|'inventory'|'valuations'|'startWealth'|'acceptedDanger'|'seenEvents'|'resolvedEvents'> & {
    loanItems?:ItemView[];
    inventory: ItemView[]; stock: ItemView[]; portals: Array<{id:string; npc:NpcId; hint:ItemKind; disabled:boolean}>;
    counterLimit: number;
    /** Per-seat caps once held relics apply (polish rules). */
    maxEnergy?: number; maxLife?: number;
    recoveryOffer?:RecoveryOffer;
    pulse?:{shards:number;perLife:number;perSale:number;wary:boolean};
    /** Lowest trust across every merchant in play and the extra shop goods it earns. */
    stockBonus?:{tier:number;extra:number;perExtra:number};
    cleanseOffer?:CleanseOffer;
    wishOffer?:WishOffer;
    wishDesk?:WishDesk;
    /** Every open wish with its current price, in any phase, so the seat can recall what to buy. */
    wishBook?:WishBookRow[];
  };
  players: Array<{id:string;credits:number;energy:number;score:number;paused:Appraiser['paused'];done:boolean;itemCount:number;life?:number}>;
  market: Omit<DarkMarket,'lots'> & { lots?: AuctionLotView[] }; listings: Array<SharedListing & { item: ItemView }>;
  trades: Array<TradeOffer & {item:ItemView;swapItem:ItemView|null}>; history: EncounterResult[];
}
