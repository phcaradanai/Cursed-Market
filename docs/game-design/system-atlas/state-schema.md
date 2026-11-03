# State schemas และจุดแก้ข้อมูล

รายการเขียน property เป็นหลักฐานทาง syntax รวม local variables ไม่ใช่ทุกจุดเป็น game state; อ่าน owner และ guards ประกอบ

```json
{
  "schemas": [
    {
      "id": "schema:apps/comic/src/game/appraisal/audit.ts:AppraisalAudit",
      "name": "AppraisalAudit",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/audit.ts",
        "line": 6,
        "endLine": 13
      },
      "text": "export interface AppraisalAudit {\n  personalPerformance?:AppraisalState['personalPerformance'];\n  schemaVersion:4 | 5; playerIds:string[]; seed:string; config:AppraisalConfig;\n  commands:Array<AppraisalAction|{type:'advance'}>;\n  ledger:AppraisalState['ledger']; history:EncounterResult[]; trace:AppraisalState['trace'];\n  items:AppraisalState['items']; final: Array<{id:string;credits:number;energy:number;inventory:string[];score:number;life?:number}>;\n  collector?:AppraisalState['collector'];\n}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/challenge-rules.ts:ClaimKey",
      "name": "ClaimKey",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/challenge-rules.ts",
        "line": 6,
        "endLine": 6
      },
      "text": "export type ClaimKey='genuine'|'cursed';"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/challenge-rules.ts:Claims",
      "name": "Claims",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/challenge-rules.ts",
        "line": 7,
        "endLine": 7
      },
      "text": "export interface Claims { genuine?:boolean; cursed?:boolean }"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/cleanse-rules.ts:CleanseToolKind",
      "name": "CleanseToolKind",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/cleanse-rules.ts",
        "line": 9,
        "endLine": 9
      },
      "text": "export type CleanseToolKind = keyof typeof CLEANSE_TOOLS;"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/collector-wishlist.ts:CollectorWishlistAction",
      "name": "CollectorWishlistAction",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 14,
        "endLine": 18
      },
      "text": "export type CollectorWishlistAction=\n | {type:'collector-wish-request';kinds:ItemKind[]}\n | {type:'collector-wish-peek';batchId:string;slotId:string}\n | {type:'collector-wish-buy';batchId:string;slotId:string;quoteId:string}\n | {type:'collector-wish-skip';batchId?:string};"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/collector-wishlist.ts:Pending",
      "name": "Pending",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 19,
        "endLine": 19
      },
      "text": "interface Pending {id:string;kinds:ItemKind[];requestedAt:number;dueAt:number}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/collector-wishlist.ts:Offer",
      "name": "Offer",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 20,
        "endLine": 20
      },
      "text": "interface Offer {id:string;encounter:number;itemIds:string[];rawQuote:number;peek?:number;status:'open'|'bought'|'skipped'|'expired'|'cancelled'}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/collector-wishlist.ts:CollectorWishlistState",
      "name": "CollectorWishlistState",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 21,
        "endLine": 21
      },
      "text": "export interface CollectorWishlistState {lastWindowAt:number;pending?:Pending;offer?:Offer}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/collector-wishlist.ts:CollectorWishlistView",
      "name": "CollectorWishlistView",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 22,
        "endLine": 26
      },
      "text": "export interface CollectorWishlistView {\n request:{available:boolean;kinds:Array<{kind:ItemKind;name:string;image:string}>;dueAt:number};\n pending?:Pending;\n delivery?:{id:string;quoteId:string;status:Offer['status'];cost:{price:number;fee:number;total:number;energy:number};canPeek:boolean;canBuy:boolean;reason?:string;slots:Array<{id:string;peek?:{kind:ItemKind;name:string;image:string;rarity?:Rarity}}>};\n}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/content.ts:BondMode",
      "name": "BondMode",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/content.ts",
        "line": 311,
        "endLine": 311
      },
      "text": "export type BondMode = 'swap'|'sell'|'tribute'|'show'|'reveal';"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/content.ts:BondSpec",
      "name": "BondSpec",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/content.ts",
        "line": 313,
        "endLine": 319
      },
      "text": "export interface BondSpec {\n  id:EventId; npc:NpcId; name:string; when:string; description:string; mode:BondMode;\n  families?:ItemFamily[]; kinds?:ItemKind[]; exclude?:ItemKind[]; known?:'cursed'|'fake';\n  buffs?:StatusId[]; debuffs?:StatusId[]; cleanse?:'D10'|'debuffs'; energy?:number; life?:number;\n  energyCost?:number; reveal?:Array<'base'|'genuine'|'cursed'|'effectsKnown'>; price?:number;\n  genuineOnly?:boolean; risk?:number;\n}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/content.ts:ItemSpec",
      "name": "ItemSpec",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/content.ts",
        "line": 688,
        "endLine": 688
      },
      "text": "export interface ItemSpec { name:string;anchor:number;buff?:StatusId;drawback?:StatusId;nativeEffect?:`effect:E${number}`;merchant?:NpcId;explicitActivation?:boolean;benefit?:string;usage?:string;exclusions?:string;consumable:boolean;family?:ItemFamily;energyRecovery?:number }"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/content.ts:NpcMood",
      "name": "NpcMood",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/content.ts",
        "line": 739,
        "endLine": 739
      },
      "text": "export type NpcMood='smile'|'angry'|'idle';"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/core2-actions.ts:Skill",
      "name": "Skill",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-actions.ts",
        "line": 81,
        "endLine": 81
      },
      "text": "type Skill={name:string;needsItem?:boolean};"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/core2-specs.ts:Core2Choice",
      "name": "Core2Choice",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-specs.ts",
        "line": 9,
        "endLine": 14
      },
      "text": "export interface Core2Choice {\n  id:string;credits?:number;energy?:number;life?:number;reward?:number;heal?:number;\n  grant?:StatusId[];lose?:boolean;door?:'first'|'second';deal?:'cash'|'condition';toVictim?:boolean;\n  /** A seeded roll after paying: `chance` of the `win` statuses, else the `lose` ones. */\n  gamble?:{chance:number;win:StatusId[];lose:StatusId[]};\n}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/core2-specs.ts:Core2EventSpec",
      "name": "Core2EventSpec",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-specs.ts",
        "line": 15,
        "endLine": 17
      },
      "text": "export interface Core2EventSpec {\n  id:EventId;name:string;when:string;phase:'PORTALS'|'APPRAISAL'|'TRADE';consequence?:boolean;description:string;choices:Core2Choice[];\n}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/core2-specs.ts:Core2Rules",
      "name": "Core2Rules",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-specs.ts",
        "line": 67,
        "endLine": 67
      },
      "text": "export interface Core2Rules {eventChoiceRules?:number;statusLinks?:number}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/core2.ts:Dread",
      "name": "Dread",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2.ts",
        "line": 62,
        "endLine": 62
      },
      "text": "export type Dread='storm'|'tax'|'rot'|'wound'|'fatigue';"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/ghost-service.ts:GhostAction",
      "name": "GhostAction",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 9,
        "endLine": 9
      },
      "text": "export type GhostAction = {type:'ghost-start';startedAt?:number}|{type:'ghost-guess';round:number;position:number}|{type:'ghost-hire';ghostId:string;choice:number;quoteId:string;fee:number}|{type:'ghost-accept';jobId:string;accept:boolean}|{type:'ghost-rps';slot:number;hand:'rock'|'paper'|'scissors'}|{type:'ghost-deliver';jobId:string;slot:number};"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/ghost-service.ts:GhostJob",
      "name": "GhostJob",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 10,
        "endLine": 10
      },
      "text": "export interface GhostJob {id:string;buyerId:string;kind:ItemKind;price:number;base:number;fee:number;status:'offered'|'accepted'|'delivered'|'cancelled';prototype?:AppraisalItem;round?:number}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/ghost-service.ts:GhostState",
      "name": "GhostState",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 11,
        "endLine": 11
      },
      "text": "export interface GhostState {round:number;available:boolean;startedAt?:number;tracking?:Tracking;swaps:[number,number][];encounter:number;slots:{kind:ItemKind;lost:boolean}[];jobs:GhostJob[];bonus:number;draws:number;lastRps?:{slot:number;hand:string;opponent:string;result:string}}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/ghost-tracking.ts:Tracking",
      "name": "Tracking",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-tracking.ts",
        "line": 2,
        "endLine": 2
      },
      "text": "export type Tracking = {status:'guessing'|'failed'|'available'; initialPosition:number; answer:number};"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/item-effects.ts:ItemEffect",
      "name": "ItemEffect",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/item-effects.ts",
        "line": 5,
        "endLine": 7
      },
      "text": "export interface ItemEffect {\n  effect:keyof PassiveBonuses; amount:number; text:string; en:string;\n}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/item-effects.ts:UseBonuses",
      "name": "UseBonuses",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/item-effects.ts",
        "line": 32,
        "endLine": 32
      },
      "text": "export type UseBonuses=Partial<Pick<PassiveBonuses,'luck'|'income'|'coinWin'|'discount'|'acceptance'|'inspections'>>;"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/omen-table.ts:OmenId",
      "name": "OmenId",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/omen-table.ts",
        "line": 3,
        "endLine": 3
      },
      "text": "export type OmenId='boom'|'inflation'|'tax'|'festival'|'insight'|'plague'|'generous'|'bloodmoon'|'collector-tax'|'famine'|'thieves-night'|'calm'|'black-night'|'pilgrims'|'pestilence';"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/omen-table.ts:Omen",
      "name": "Omen",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/omen-table.ts",
        "line": 4,
        "endLine": 32
      },
      "text": "export interface Omen {\n  id:OmenId; name:string; text:string;\n  /** Percentage points added to every sale of an item the seat owns. */\n  salePct?:number;\n  /** Extra credits on every NPC purchase, cleansing and recovery deal. */\n  fee?:number;\n  /** Percentage points added to NPC acceptance and to curse cleansing. */\n  accept?:number;\n  /** The first inspection of the encounter costs no energy. */\n  firstInspectFree?:boolean;\n  /** Energy every living seat loses at settlement. */\n  settleEnergy?:number;\n  /** Credits added to the post-trade round reward. */\n  roundBonus?:number;\n  /** Core v0.6: multiplier on the dread chance this encounter. */\n  dread?:number;\n  /** Core v0.6: extra credits on recovery deals. */\n  healCost?:number;\n  /** Core v0.6: percentage points added to every theft attempt. */\n  steal?:number;\n  /** Core v0.6: trust a sold appraisal earns on top of the usual. */\n  trust?:number;\n  /** Core v0.6: percent of credits the Collector's tax takes at settlement. */\n  taxPct?:number;\n  /** Core v0.6: the Dark Market is always open this encounter. */\n  marketOpen?:boolean;\n  /** Core v0.6: life every living seat loses at settlement. */\n  settleLife?:number;\n}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/passives.ts:PassiveBonuses",
      "name": "PassiveBonuses",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/passives.ts",
        "line": 8,
        "endLine": 13
      },
      "text": "export interface PassiveBonuses {\n  freePrice:number; commission:number; income:number; luck:number; coinWin:number; saleFee:number;\n  trust:number; acceptance:number; discount:number; buyEnergy:number; freeAuth:number; freeEffects:number;\n  market:number; match:number; mitigation:number; energyRecovery:number; lifeRecovery:number; inspections:number;\n  maxEnergy:number; maxLife:number; wishSlots:number;\n}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/passives.ts:PassiveSpec",
      "name": "PassiveSpec",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/passives.ts",
        "line": 15,
        "endLine": 15
      },
      "text": "type PassiveSpec=ItemSpec & {passive:{effect:keyof PassiveBonuses;amount:number;text:string}};"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/personal-scoring.ts:Rule",
      "name": "Rule",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/personal-scoring.ts",
        "line": 130,
        "endLine": 130
      },
      "text": "type Rule=typeof PERSONAL_SCORING_WEIGHTS[number];"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/personal-scoring.ts:PersonalMetric",
      "name": "PersonalMetric",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/personal-scoring.ts",
        "line": 131,
        "endLine": 131
      },
      "text": "export type PersonalMetric=Exclude<Rule['id'],'rarity'|'ghost'>;"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/personal-scoring.ts:PersonalFact",
      "name": "PersonalFact",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/personal-scoring.ts",
        "line": 132,
        "endLine": 132
      },
      "text": "export interface PersonalFact {id:string;playerId:string;metric:PersonalMetric;raw:number;eligibleKey:string;eligible:boolean;cause:string}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/personal-scoring.ts:PersonalPerformance",
      "name": "PersonalPerformance",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/personal-scoring.ts",
        "line": 133,
        "endLine": 133
      },
      "text": "export interface PersonalPerformance {version:1;facts:PersonalFact[]}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/personal-scoring.ts:PersonalPerformanceState",
      "name": "PersonalPerformanceState",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/personal-scoring.ts",
        "line": 134,
        "endLine": 134
      },
      "text": "export interface PersonalPerformanceState {config:{personalScoringRules?:1};players:readonly {id:string}[];personalPerformance?:PersonalPerformance}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/personal-scoring.ts:PersonalScoreInput",
      "name": "PersonalScoreInput",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/personal-scoring.ts",
        "line": 135,
        "endLine": 135
      },
      "text": "export interface PersonalScoreInput {playerId:string;facts:readonly PersonalFact[];assetScore:number;modifierPercent:number;ghostBonus:number;rarities:readonly {id:string;rarity:Rarity}[]}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/personal-scoring.ts:PersonalMetricResult",
      "name": "PersonalMetricResult",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/personal-scoring.ts",
        "line": 136,
        "endLine": 136
      },
      "text": "export interface PersonalMetricResult {id:Rule['id'];raw:number;eligible:number;cap:number|null;uncappedPoints:number;points:number;sourceIds:string[];exclusions:{id:string;cause:string}[];weight:{numerator:number;denominator:number}|{byRarity:Readonly<Record<Rarity,number>>}}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/personal-scoring.ts:PersonalScoreBreakdown",
      "name": "PersonalScoreBreakdown",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/personal-scoring.ts",
        "line": 137,
        "endLine": 137
      },
      "text": "export interface PersonalScoreBreakdown {playerId:string;metrics:PersonalMetricResult[];groups:{id:string;points:number}[];performancePoints:number;ordinaryBeforeModifier:number;modifierDelta:number;ordinaryScore:number;ghostBonus:number;total:number}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/polish-events.ts:PolishEvent",
      "name": "PolishEvent",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/polish-events.ts",
        "line": 4,
        "endLine": 8
      },
      "text": "export interface PolishEvent {\n  phase:AppraisalPhase; credits?:number; energy?:number; reward?:number; grant:StatusId[];\n  /** Offered only when none of these statuses is active, so a choice is never a no-op. */\n  avoid:StatusId[]; needsAuctions?:boolean;\n}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/seals.ts:SealOffer",
      "name": "SealOffer",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 12,
        "endLine": 25
      },
      "text": "export interface SealOffer {\n  id: string;\n  sealId: string;\n  holderId: string;\n  buyerId: string;\n  credits: number;\n  energy: number;\n  life: number;\n  /** How many carried goods the buyer must hand over; the buyer chooses which when accepting. */\n  goods: number;\n  terms: string;\n  encounter: number;\n  status: 'open' | 'accepted' | 'declined' | 'cancelled';\n}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/seals.ts:SealRedemption",
      "name": "SealRedemption",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 27,
        "endLine": 35
      },
      "text": "export interface SealRedemption {\n  id: string;\n  holderId: string;\n  thiefId: string;\n  sealIds: string[];\n  slots: Array<{itemId: string; gone?: boolean}>;\n  encounter: number;\n  status: 'open' | 'done' | 'cancelled';\n}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/seals.ts:SealAction",
      "name": "SealAction",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 36,
        "endLine": 41
      },
      "text": "export type SealAction =\n  | {type: 'seal-offer'; sealId: string; buyerId: string; credits: number; energy: number; life: number; goods: number; terms?: string}\n  | {type: 'seal-respond'; offerId: string; accept: boolean; itemIds?: string[]}\n  | {type: 'seal-cancel'; offerId: string}\n  | {type: 'seal-redeem'; thiefId: string}\n  | {type: 'seal-pick'; redemptionId: string; slot: number};"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/seals.ts:SealMarketView",
      "name": "SealMarketView",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 42,
        "endLine": 47
      },
      "text": "export interface SealMarketView {\n  offers: Array<SealOffer & {thiefId: string}>;\n  redemption?: {id: string; thiefId: string; slots: number[]};\n  /** thiefId -> seals held, so the client can offer redemption at two or more. */\n  holdings: Array<{thiefId: string; count: number}>;\n}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/seals.ts:SealState",
      "name": "SealState",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 49,
        "endLine": 49
      },
      "text": "type SealState = AppraisalState & {sinnerSeals?: SinnerSeal[]; sealOffers?: SealOffer[]; sealRedemptions?: SealRedemption[]};"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/secure-storage.ts:PersonalVault",
      "name": "PersonalVault",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 9,
        "endLine": 9
      },
      "text": "export interface PersonalVault {items:string[]; credits:number; slots:number; interest?:{principal:number;encounter:number;rings?:Record<string,number>}}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/secure-storage.ts:SecuredLoan",
      "name": "SecuredLoan",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 15,
        "endLine": 21
      },
      "text": "export interface SecuredLoan {\n  id:string; borrowerId:string; lenderId:string; itemId:string;\n  /** Agreed item value and deadline never change after funding. */\n  collateralValue:number; principal:number; repaid:number; proposedAt:number;\n  firstPayoutAt:number; dueAt:number; fundedAt?:number; settledAt?:number;\n  terms:string; status:'proposed'|'countered'|'active'|'repaid'|'foreclosed'|'cancelled';\n}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/secure-storage.ts:StorageAction",
      "name": "StorageAction",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 22,
        "endLine": 25
      },
      "text": "export type StorageAction =\n  | {type:'vault-deposit-item'|'vault-withdraw-item';itemId:string}\n  | {type:'vault-deposit-credits'|'vault-withdraw-credits';amount:number}\n  | {type:'vault-expand'};"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/secure-storage.ts:LoanAction",
      "name": "LoanAction",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 26,
        "endLine": 31
      },
      "text": "export type LoanAction =\n  | {type:'loan-propose';lenderId:string;itemId:string;principal:number;terms?:string}\n  | {type:'loan-counter';loanId:string;principal:number;terms?:string}\n  | {type:'loan-respond';loanId:string;accept:boolean}\n  | {type:'loan-cancel';loanId:string}\n  | {type:'loan-repay';loanId:string;amount:number};"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/theft.ts:RpsHand",
      "name": "RpsHand",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 8,
        "endLine": 8
      },
      "text": "export type RpsHand = 'rock' | 'paper' | 'scissors';"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/theft.ts:CrimeRecord",
      "name": "CrimeRecord",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 9,
        "endLine": 14
      },
      "text": "export interface CrimeRecord {\n  failures: number;\n  banStartsEncounter: number;\n  banUntilEncounter: number;\n  cases: Array<{itemId: string; ask: number; npc: NpcId}>;\n}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/theft.ts:SinnerSeal",
      "name": "SinnerSeal",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 16,
        "endLine": 22
      },
      "text": "export interface SinnerSeal {\n  id: string;\n  thiefId: string;\n  holderId: string;\n  duelId: string;\n  issuedEncounter: number;\n}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/theft.ts:PvpCompensation",
      "name": "PvpCompensation",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 24,
        "endLine": 34
      },
      "text": "export interface PvpCompensation {\n  id: string;\n  duelId: string;\n  thiefId: string;\n  victimId: string;\n  itemId: string;\n  snapshot: number;\n  amount: number;\n  dueEncounters: number[];\n  settled: Array<{encounter: number; paid: number}>;\n}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/theft.ts:TheftDuel",
      "name": "TheftDuel",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 35,
        "endLine": 48
      },
      "text": "export interface TheftDuel {\n  id: string;\n  encounter: number;\n  thiefId: string;\n  victimId?: string;\n  npc?: NpcId;\n  itemId: string;\n  ask: number;\n  swordIds?:Record<string,string>;\n  hands: Record<string, RpsHand>;\n  round: number;\n  status: 'open' | 'won' | 'lost' | 'cancelled';\n  revealed: Array<{thief: RpsHand; opponent: RpsHand}>;\n}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/theft.ts:TheftDuelView",
      "name": "TheftDuelView",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 49,
        "endLine": 63
      },
      "text": "export interface TheftDuelView {\n  id: string;\n  thiefId: string;\n  victimId?: string;\n  npc?: NpcId;\n  npcTell?: {preferredHand: RpsHand; text: string};\n  round: number;\n  status: TheftDuel['status'];\n  needsChoice: boolean;\n  submitted: boolean;\n  /** Status links: who a tied round goes to, from this seat's own statuses and the omen only. */\n  tieGoesTo?: 'you' | 'opponent';\n  publicSwords?:{you:boolean;opponent:boolean};\n  revealed: TheftDuel['revealed'];\n}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/theft.ts:TheftView",
      "name": "TheftView",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 64,
        "endLine": 77
      },
      "text": "export interface TheftView {\n  duels: TheftDuelView[];\n  targets: Array<{playerId: string; blockedUntilEncounter?: number}>;\n  seals: Array<{id: string; thiefId: string}>;\n  compensation: Array<{id: string; role: 'payer' | 'receiver'; otherId: string; amount: number; remaining: number[]; paid: number}>;\n  crime?: {\n    failures: number;\n    banStartsEncounter: number;\n    banUntilEncounter: number;\n    active: boolean;\n    noticePrice: number;\n    cases: number;\n  };\n}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/theft.ts:TheftState",
      "name": "TheftState",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 79,
        "endLine": 79
      },
      "text": "type TheftState = AppraisalState & {theftDuels?: TheftDuel[]; sinnerSeals?: SinnerSeal[]; compensations?: PvpCompensation[]};"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/theft.ts:Thief",
      "name": "Thief",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 81,
        "endLine": 81
      },
      "text": "type Thief = Appraiser & {crime?: CrimeRecord; pvpBlocks?: Record<string, number>};"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:StatusId",
      "name": "StatusId",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 6,
        "endLine": 6
      },
      "text": "export type StatusId = typeof ALL_STATUS_IDS[number];"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:EventId",
      "name": "EventId",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 23,
        "endLine": 23
      },
      "text": "export type EventId = typeof EVENT_IDS[number] | typeof BOND_EVENT_IDS[number] | typeof WISH_EVENT_ID | typeof EXPANSION_EVENT_IDS[number] | typeof POLISH_EVENT_IDS[number] | typeof BOON_EVENT_ID | typeof NPC_EVENT_IDS[number] | typeof CORE2_EVENT_IDS[number] | typeof ABILITY_EVENT_IDS[number];"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:NpcId",
      "name": "NpcId",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 24,
        "endLine": 24
      },
      "text": "export type NpcId = 'orc' | 'vampire' | 'autometa' | 'alien' | 'darkone' | 'beast' | 'deepsea' | 'swarm';"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:LegacyItemFamily",
      "name": "LegacyItemFamily",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 25,
        "endLine": 25
      },
      "text": "export type LegacyItemFamily = 'mirror' | 'orb' | 'key' | 'mask' | 'potion' | 'battery' | 'amulet' | 'blade' | 'scanner' | 'food';"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:PassiveKind",
      "name": "PassiveKind",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 27,
        "endLine": 27
      },
      "text": "export type PassiveKind=typeof PASSIVE_ITEM_IDS[number];"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:InspectionProperty",
      "name": "InspectionProperty",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 28,
        "endLine": 28
      },
      "text": "export type InspectionProperty='price'|'authenticity'|'effects';"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:ItemFamily",
      "name": "ItemFamily",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 30,
        "endLine": 30
      },
      "text": "export type ItemFamily = LegacyItemFamily | 'shield' | 'ring' | 'caliper' | 'translator' | 'token' | 'compass' | 'hammer' | 'sword';"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:PilotItemKind",
      "name": "PilotItemKind",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 32,
        "endLine": 32
      },
      "text": "export type PilotItemKind = typeof PILOT_ITEM_IDS[number];"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:ItemKind",
      "name": "ItemKind",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 33,
        "endLine": 37
      },
      "text": "export type ItemKind = LegacyItemFamily | PilotItemKind | 'memory-mirror' | 'rift-mirror' | 'blood-orb' | 'storm-orb' |\n  'bone-key' | 'clockwork-key' | 'bone-mask' | 'void-mask' | 'blood-tonic' | 'dream-tonic' |\n  'sun-cell' | 'void-cell' | 'oath-charm' | 'echo-charm' | 'bone-blade' | 'eclipse-blade' |\n  'truth-lens' | 'curse-meter' | 'ember-feed' | 'moon-feed' | 'smith-hammer' | 'whetstone' | 'doubt-lens' | 'void-seal' |\n  'abyss-pearl' | 'tide-lantern' | 'kraken-ink' | 'siren-conch' | 'hive-comb' | 'chitin-blade' | 'larva-cell' | 'compound-mirror' | PassiveKind | typeof ABILITY_ITEM_IDS[number];"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:AppraisalPhase",
      "name": "AppraisalPhase",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 38,
        "endLine": 38
      },
      "text": "export type AppraisalPhase = 'PORTALS' | 'APPRAISAL' | 'TRADE' | 'REVEAL' | 'RESULTS';"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:AppraisalConfig",
      "name": "AppraisalConfig",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 39,
        "endLine": 110
      },
      "text": "export interface AppraisalConfig {\n  /** Versioned personal accomplishments; historical audits omit this. */\n  personalScoringRules?:1;\n  /** Corrected canonical writers; absence preserves pre-review experimental audit receipts. */\n  personalScoringFacts?:2;\n  /** Dedicated personal Collector purchases; absent in historical audits. */\n  collectorWishlistRules?:1;\n  /** Absent in visual-only/old audits: no price or effect scaling. */\n  rarityEconomy?:import('../../shared/rarity-power.js').RarityEconomyConfig;\n  /** Optional in old audits. Appearance-only RNG; no hidden truths or economic multipliers. */\n  rarity?:import('../../shared/item-rarity.js').RarityConfig;\n  /** Absent in saved audits: preserve the original theft, custody and pricing rules. */\n  secureEconomy?:boolean;\n  /** Absent in saved audits: active loans stay open when the match ends. New runs foreclose them so the lender keeps the collateral. */\n  loanEndSettlement?:boolean;\n  /** Absent in old audits: preserve 4% whole-balance interest. 1 uses aged principal at 10%. */\n  vaultInterestRules?:1;\n  /** Missing in historical audits: cancel timeout instead of choosing absent hands. */\n  theftTimeoutRules?:1;\n  /** Survival only. Absent in saved audits: the run ends only when every life is gone. Otherwise the Collector arrives after this encounter settles, whoever is still alive. */\n  collectorDeadline?:number;\n  /** Absent in saved audits: keep the original event choices. 1 removes pointless decline buttons, turns E37/E40 into mishaps you handle, reprices E119/E121/E127 and gives E47 an effect. */\n  eventChoiceRules?:1;\n  /** Absent in saved audits: v0.6 statuses B21–B24/D21–D24 stay unreachable and theft buffs keep their old chance-based meaning. 1 gives every status a source and makes B21/B22/D21 and the thieves' night omen settle tied theft duels. */\n  statusLinks?:1;\n  /** Absent in saved audits: preserve historical event eligibility and defaults. 1 revalidates core2 defaults, links healing/guard choices to their requirements and excludes costless blood-pact debt. */\n  systemLinks?:1;\n  /** Absent in historical runs: keep original skills, catalogs and RNG pools exactly. */\n  trustAbilities?:boolean;\n  /** Absent in saved audits: preserve historical item effects and activation costs. */\n  itemEffects?: boolean;\n  /** Absent in original v0.4 audits: retain the original 10-item generation pool. */\n  catalogVersion?: 1 | 2 | 3 | 4;\n  /** Absent in historical audits: preserve their original economy. */\n  roundRewards?: boolean;\n  /** Absent in saved runs: retain the original single-coin, lose-all wager. */\n  multiCoinRewards?: boolean;\n  /** Absent in saved runs: retain the pre-commission/trust/market-contract rules. */\n  commerce?: boolean;\n  /** Absent in saved runs: retain the one-item bonus for trusting every merchant. */\n  totalTrustStock?: boolean;\n  /** Absent in saved runs: retain the old effects check where only B02 could reveal a curse. */\n  curseSight?: boolean;\n  /** Absent in saved runs: buying from an NPC still costs energy there. */\n  freeBuy?: boolean;\n  /** Absent in saved audits: inspections and appraisals keep their original costs. */\n  freeMerchantAction?: boolean;\n  /** Absent in saved runs: fake items never produce their good effect there. */\n  fakeEffect?: boolean;\n  /** Absent in saved runs: merchants do not clean curses and the smith tools are never stocked. */\n  cleanse?: boolean;\n  /** Absent in saved runs: merchants never announce wishes. */\n  wishlist?: boolean;\n  /** Absent in saved runs: wishes cost no energy, have no cap and never lose value. */\n  wishContract?: boolean;\n  /** Absent in saved runs: listings carry no appraiser claims and the challenge tools are never stocked. */\n  challenge?: boolean;\n  /** Absent in saved runs: the Deep Sea Monster and The Swarm never appear and their items, statuses and events stay out of play. */\n  expansion?: boolean;\n  /** Absent in saved runs: no omens, sale/fee/life modifiers beyond the original market rules, capacity relics or polish events. */\n  polish?: boolean;\n  /** Absent in saved runs: no personal merchant contracts or delayed repayments. */\n  npcEvents?: boolean;\n  /** Absent in saved runs: the v0.6 core (rebalanced prices, door tolls, overvaluation backlash, escalating survival pressure with a Collector deadline, scrap energy, merchant skills, theft, barter and the extra statuses, events and omens). */\n  core2?: boolean;\n  encounters: number; startingCredits: number; maxEnergy: number; recoveryEnergy: number;\n  bankReserve: number; marketProbability: number; marketMaxOrders: number; marketQuota: number;\n  /** Absent in v0.4: retain encounter recovery and historical scoring exactly. */\n  survival?: { maxLife:number; encounterLifeCost:number; entryEnergyCost:number };\n  /** Absent in v0.4/v0.5 audits: unsold-appraisal duty, Dark Market vault auctions and NPC × held-item events. */\n  brokerage?: { auctionProbability:number; maxLots:number; bondProbability:number };\n}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:UnsoldChoice",
      "name": "UnsoldChoice",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 111,
        "endLine": 111
      },
      "text": "export type UnsoldChoice = 'buy'|'penalty'|'consign';"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:CleanseOffer",
      "name": "CleanseOffer",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 112,
        "endLine": 112
      },
      "text": "export interface CleanseOffer { npc:NpcId; items:Array<{itemId:string;price:number;chance:number;done:boolean}>; stoneBonus:number }"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:WishBookRow",
      "name": "WishBookRow",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 113,
        "endLine": 113
      },
      "text": "export interface WishBookRow { npc:NpcId; kind:ItemKind; price:number; initial:number; floor:number; next:number; age:number }"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:WishDesk",
      "name": "WishDesk",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 114,
        "endLine": 114
      },
      "text": "export interface WishDesk { npc:NpcId; cost:number; cap:number; book:WishBookRow[]; replaces:NpcId|null; replaceable:NpcId[] }"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:WishOffer",
      "name": "WishOffer",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 115,
        "endLine": 115
      },
      "text": "export interface WishOffer { npc:NpcId; kind:ItemKind; price:number; initial:number; floor:number; next:number; age:number; trust:number; buffs:number; debuffs:number; tried:boolean; options:Array<{markup:number;price:number;chance:number}>; itemIds:string[]; itemQuotes?:Record<string,Array<{markup:number;price:number}>> }"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:RecoveryOffer",
      "name": "RecoveryOffer",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 117,
        "endLine": 117
      },
      "text": "export interface RecoveryOffer { target:'energy'|'life'; credits:number; amount:number; min?:number }"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:CollectorResult",
      "name": "CollectorResult",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 118,
        "endLine": 122
      },
      "text": "export interface CollectorResult {\n  personalScore?:import('./personal-scoring.js').PersonalScoreBreakdown;\n  playerId:string; credits:number; itemValue:number; modifierPercent:number; statusIds:StatusId[]; score:number;\n  items:Array<{id:string;kind:ItemKind;base:number;genuine:boolean;cursed:boolean;value:number;certified?:boolean}>;\n}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:Status",
      "name": "Status",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 123,
        "endLine": 123
      },
      "text": "export interface Status { power?:number; id: StatusId; expires: number; charges: number; targetItemId?: string; starts: number }"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:Knowledge",
      "name": "Knowledge",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 124,
        "endLine": 124
      },
      "text": "export interface Knowledge { range?: [number,number]; base?: number; genuine?: boolean; cursed?: boolean; effectsKnown?: boolean; activationKnown?: boolean; certificate?: boolean; comparison?: string }"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:AppraisalItem",
      "name": "AppraisalItem",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 125,
        "endLine": 144
      },
      "text": "export interface AppraisalItem {\n  rarityPower?:import('../../shared/rarity-power.js').RarityPower;\n  appearance?:import('../../shared/item-rarity.js').ItemAppearance;\n  lastTradePrice?:number;\n  priceIntegrity?:{overpriced:boolean;audits:number;lastReappraisedEncounter?:number;certifiedPrice?:number};\n  /** Public copy provenance; restrictions live on the source and survive ownership changes. */\n  copy?:{sourceId:string;number:number;valuePercent:number};\n  pilotUsedAt?:number;pilotUses?:number;\n  copyConsumed?:boolean;\n  preserved?:boolean;\n  id: string; kind: ItemKind; base: number; genuine: boolean; cursed: boolean; ask: number;\n  owner: string; npcOwnerId: string; npc: NpcId; encounter: number; certificate: boolean;\n  lastAppraisal: number | null;\n  appraisedBy?:string; commissionPaid?:boolean;\n  /** Laid out by the trust bonus rather than the merchant's usual two goods. */\n  bonus?:boolean;\n  /** Core v0.6: taken without paying. */\n  stolen?:boolean;\n  reservation: number; lastAccepted: boolean | null;\n}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:Portal",
      "name": "Portal",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 145,
        "endLine": 145
      },
      "text": "export interface Portal { id: string; npc: NpcId; stock: string[]; disabled: boolean }"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:Valuation",
      "name": "Valuation",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 146,
        "endLine": 146
      },
      "text": "export interface Valuation { value: number; accuracy: boolean; caught: boolean; accepted: boolean }"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:EventOffer",
      "name": "EventOffer",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 147,
        "endLine": 158
      },
      "text": "export interface EventOffer {\n  id: EventId; key: string; choices: string[]; itemIds: string[]; statusIds: StatusId[];\n  otherPlayerIds: string[]; quotedPrices: Record<string,number>;\n  facts: Record<string,Knowledge>; targetKinds: Record<string,ItemKind>;\n  /** Held item a bond swap hands to the NPC; fixed when the offer opens. */\n  giveItemId?: string;\n  /** The three buffs of a boon draft (E108), fixed when the offer opens. */\n  boons?: StatusId[];\n  /** What a merchant announces in E73. */\n  wish?: {kind:ItemKind;price:number};\n  npcTerms?: {credits:number;energy:number;life:number;items:number;loanMax?:number};\n}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:NpcContracts",
      "name": "NpcContracts",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 159,
        "endLine": 162
      },
      "text": "export interface NpcContracts {\n  vampire?: {signedAt:number;performanceId?:string};\n  alien?: {lentAt:number;dueAt:number;itemIds:string[];key:string;reservedCredits:number};\n}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:CoinSide",
      "name": "CoinSide",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 163,
        "endLine": 163
      },
      "text": "export type CoinSide = 'heads' | 'tails';"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:RoundReward",
      "name": "RoundReward",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 164,
        "endLine": 169
      },
      "text": "export interface RoundReward {\n  encounter:number; base:number; amount:number; flips:number; settled:boolean;\n  incomeBonus?:number; winBonus?:number; winChance?:number;\n  coinCount?:number; staked?:number; net?:number;\n  lastFlip?:{guess:CoinSide; side:CoinSide; correct:boolean; coins?:Array<{guess:CoinSide;side:CoinSide;correct:boolean}>; delta?:number};\n}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:Appraiser",
      "name": "Appraiser",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 170,
        "endLine": 236
      },
      "text": "export interface Appraiser {\n  journal?: JournalEntry[];\n  personalVault?:import('./secure-storage.js').PersonalVault;\n  crime?:import('./theft.js').CrimeRecord;\n  abilityReady?:Partial<Record<NpcId,number>>;\n  abilityLastUsed?:Partial<Record<NpcId,number>>;\n  abilityAdjusted?:Partial<Record<NpcId,number>>;\n  abilityChoice?:{npc:'alien'|'beast';sourceId:string;itemIds:string[]};\n  preserveItemId?:string;\n  orcDeal?:{itemId:string;percent:number;encounter:number};\n  abilityItemUsed?:ItemKind[];\n  /** Extra activated-item bonuses; reset after the round reward is banked. */\n  itemUseBonuses?:import('./item-effects.js').UseBonuses;\n  /** Successful activation bonus sources this encounter: same kind never adds twice. */\n  itemUseKinds?:ItemKind[];\n  itemUseStrength?:Partial<Record<ItemKind,number>>;\n  npcContracts?: NpcContracts;\n  vampireDiscount?: {encounter:number};\n  passiveUses?:Partial<Record<InspectionProperty,number>>;\n  /** Merchant items whose shared free inspection/appraisal was spent this encounter. */\n  merchantActionsUsed?:string[];\n  roundReward?:RoundReward;\n  npcTrust?:Partial<Record<NpcId,number>>;\n  id: string; credits: number; energy: number; inventory: string[]; statuses: Status[];\n  life?:number; recoveryUsed?:boolean;\n  /** Survival commerce: pulse shards earned when another seat buys goods this seat appraised; 3 mend 1 life. */\n  pulseShards?:number;\n  /** Core v0.6: goods other seats appraised that this seat bought toward the next energy refund. */\n  scraps?:number;\n  /** Core v0.6: energy refunds paid this encounter. */\n  scrapPaid?:number;\n  /** Core v0.6: an overvalued appraisal drew a merchant backlash this encounter. */\n  inflated?:boolean;\n  /** Core v0.6: items and seats this seat already tried to steal from this encounter. */\n  stealTried?:string[];\n  /** Core v0.6: merchant doors this seat rerolled this encounter; each reroll costs one more energy than the last. */\n  portalRerolls?:number;\n  /** Core v0.6: the merchant skill was used this encounter. */\n  skillUsed?:boolean;\n  /** Core v0.6: a failed theft waiting for its penalty event; `victim` is the seat that was robbed. */\n  theft?:{kind:'shop'|'player';victim?:string};\n  /** Dark order tickets won at the Dark Market auction; enough of them force a sale (see TRUST_RULES). */\n  darkTickets?:number;\n  /** The merchants of this seat's last purchases of goods other seats appraised; three of one merchant in a row pay trust, then the log clears. */\n  buyLog?:NpcId[];\n  /** Net credits this seat paid for each item it holds (price, fee, minus any rebate); kept off the item so audits keep their shape. */\n  paid?:Record<string,number>;\n  /** The only seat this one has traded with since `since`; a long exclusive run makes merchants wary. */\n  tradeLink?:{partner:string;since:number};\n  paused: 'dead' | 'exhausted' | null; done: boolean; portals: Portal[]; selectedPortalId: string | null;\n  stock: string[]; knowledge: Record<string,Knowledge>; valuations: Record<string,Valuation>;\n  pilotGuard?:{encounter:number;amount:number};\n  inspections: number; counters: number; activated: string[]; score: number;\n  startWealth: number; accuracyBonus: number; eventOffer: EventOffer | null;\n  seenEvents: EventId[]; resolvedEvents: EventId[]; offerSlots: number; consequenceSlots: number;\n  honorJob: boolean; honestyReward: 'B03' | 'B04' | null; acceptedDanger: boolean;\n  caught: boolean; subsidy: boolean; revealedInfo: string[];\n  dealMode: 'any'|'cash'|'condition';\n  /** Items a merchant already tried to cleanse this encounter; present only with cleanse rules. */\n  cleansed?: string[];\n  /** What each merchant said it wants; kept until sold. Present only with wishlist rules. */\n  wishes?: Partial<Record<NpcId,{kind:ItemKind;price:number;set?:number;performanceId?:string}>>;\n  wishTried?: boolean;\n  /** How many wishes this seat requested; keeps each re-roll different. */\n  wishRolls?: number;\n  notes: string[];\n}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:MarketContract",
      "name": "MarketContract",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 237,
        "endLine": 241
      },
      "text": "export interface MarketContract {\n  requirements:Array<{property:'genuine'|'cursed';value:boolean}>;\n  bonus:{kind:'credits';amount:number}|{kind:'energy';amount:number}|{kind:'life';amount:number}|{kind:'buff';statusId:Extract<StatusId,`B${string}`>};\n  fullPriceCost:{kind:'energy';amount:number}|{kind:'life';amount:number}|{kind:'debuff';statusId:Extract<StatusId,`D${string}`>};\n}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:MarketOrder",
      "name": "MarketOrder",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 242,
        "endLine": 242
      },
      "text": "export interface MarketOrder { rarityReserveMultiplier?:number; id: string; kind: ItemKind; price: number; quota: Record<string,number>; contract?:MarketContract }"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:AuctionLot",
      "name": "AuctionLot",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 243,
        "endLine": 243
      },
      "text": "export interface AuctionLot { id: string; itemId: string; minimum: number; bids: Record<string,number>; winnerId?: string | null; price?: number }"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:DarkMarket",
      "name": "DarkMarket",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 244,
        "endLine": 244
      },
      "text": "export interface DarkMarket { encounter: number; open: boolean; budget: number; orders: MarketOrder[]; lots?: AuctionLot[] }"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:AuctionLotView",
      "name": "AuctionLotView",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 245,
        "endLine": 245
      },
      "text": "export interface AuctionLotView { id: string; itemId: string; minimum: number; item: ItemView; yourBid: number | null; bidCount: number; winnerId?: string | null; price?: number }"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:TradeOffer",
      "name": "TradeOffer",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 246,
        "endLine": 254
      },
      "text": "export interface TradeOffer {\n  id: string; buyerId: string; sellerId: string; itemId: string; swapItemId: string | null;\n  credits: number; source: 'inventory' | 'npc'; encounter: number; status: 'open'|'accepted'|'rejected';\n  condition: boolean;\n  /** Buyer calls this claim on the listing a lie; settled when the seller accepts. */\n  challenge?: 'genuine'|'cursed';\n  /** Void seal staked on the challenge: cancels the penalty if the buyer is wrong. */\n  sealId?: string;\n}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:LedgerEntry",
      "name": "LedgerEntry",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 255,
        "endLine": 255
      },
      "text": "export interface LedgerEntry { from: string; to: string; amount: number; reason: string; encounter: number }"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:TraceEntry",
      "name": "TraceEntry",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 256,
        "endLine": 256
      },
      "text": "export interface TraceEntry { type: string; encounter: number; playerId: string; details: Record<string,unknown> }"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:JournalEntry",
      "name": "JournalEntry",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 257,
        "endLine": 257
      },
      "text": "export interface JournalEntry { id:number; encounter:number; phase:AppraisalPhase; action:string; cause:string; changes:string[]; choice?:string; itemKind?:ItemKind }"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:EncounterResult",
      "name": "EncounterResult",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 258,
        "endLine": 258
      },
      "text": "export interface EncounterResult { encounter: number; playerId: string; gain: number; accuracy: number; score: number; paused: Appraiser['paused'] }"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:AppraisalAction",
      "name": "AppraisalAction",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 259,
        "endLine": 301
      },
      "text": "export type AppraisalAction = { playerId: string; requestId: string; encounter: number } & (\n  | import('./collector-wishlist.js').CollectorWishlistAction\n  | import('./ghost-service.js').GhostAction\n  | import('./secure-storage.js').StorageAction\n  | import('./secure-storage.js').LoanAction\n  | import('./seals.js').SealAction\n  | {type:'theft-start';itemId?:string;victimId?:string}\n  | {type:'theft-hand';duelId:string;round?:number;hand:import('./theft.js').RpsHand}\n  /** Internal timer command; never accepted by the client message parser. */\n  | {type:'theft-timeout'}\n  /** Internal duel clock: cancels one open duel and keeps the phase going. Never accepted by the client message parser. */\n  | {type:'theft-expire';duelId:string}\n  | {type:'crime-clear'}\n  | {type:'reappraise-owned';itemId:string;value:number}\n  | {type:'liquidate';itemId:string}\n  | { type: 'enter'; portalId: string }\n  | { type: 'reroll-portal'; portalId: string }\n  | { type: 'inspect'; itemId: string; property: 'price'|'authenticity'|'effects' }\n  | { type: 'appraise'|'counter'; itemId: string; value: number; acceptDanger?: boolean }\n  | { type: 'buy'; itemIds: string[]; condition: boolean }\n  | { type: 'activate'; itemId: string; npc?:NpcId; otherNpc?:NpcId }\n  | { type: 'event'; key: string; choice: string; itemId?: string; itemIds?:string[]; statusId?: StatusId; otherPlayerId?: string; fact?: 'base'|'genuine'|'cursed'; guess?: boolean }\n  | { type: 'market-sell'; itemId: string; orderId: string; resolution?:'discount'|'sacrifice' }\n  | { type: 'share'; itemId: string; allow: boolean; purchase: boolean; claims?: { genuine?: boolean; cursed?: boolean }; rebate?: number }\n  | { type: 'force-buy'; sellerId: string; itemId: string }\n  | { type: 'propose'; sellerId: string; itemId: string; credits: number; swapItemId?: string; condition?: boolean; challenge?: 'genuine'|'cursed'; sealId?: string }\n  | { type: 'respond'; offerId: string; accept: boolean }\n  | { type: 'round-flip'; guess:CoinSide; guesses?:CoinSide[]; attempt:number }\n  | { type: 'round-raise'; coinCount:number; attempt:number }\n  | { type: 'round-bank' }\n  | { type: 'done' }\n  | { type:'recover-resource'; target:'energy'|'life' }\n  | { type:'wish-sell'; itemId:string; markup:number }\n  | { type:'wish-new'; replaceNpc?:NpcId }\n  | { type:'cleanse'; itemId:string; stoneId?:string }\n  | { type:'unsold'; itemId:string; choice:UnsoldChoice }\n  | { type:'bid'; lotId:string; credits:number }\n  | { type:'steal'; itemId:string }\n  | { type:'pickpocket'; victimId:string }\n  | { type:'barter'; itemId:string; targetItemId:string }\n  | { type:'skill'; itemId?:string }\n  | { type:'merchant-ability'; npc:NpcId; itemId?:string; statusId?:StatusId; choiceId?:string }\n);"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:SharedListing",
      "name": "SharedListing",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 303,
        "endLine": 303
      },
      "text": "export interface SharedListing { ownerId: string; itemId: string; purchase: boolean; claims?: { genuine?: boolean; cursed?: boolean }; rebate?: number }"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:AppraisalState",
      "name": "AppraisalState",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 304,
        "endLine": 320
      },
      "text": "export interface AppraisalState {\n  personalPerformance?:import('./personal-scoring.js').PersonalPerformance;\n  collectorWishes?:Record<string,import('./collector-wishlist.js').CollectorWishlistState>;\n  ghosts?:Record<string,import('./ghost-service.js').GhostState>;\n  theftDuels?:import('./theft.js').TheftDuel[];\n  loans?:import('./secure-storage.js').SecuredLoan[];\n  version: 4 | 5; seed: string; config: AppraisalConfig; encounter: number; phase: AppraisalPhase;\n  revision: number; players: Appraiser[]; items: Record<string,AppraisalItem>;\n  reservedRewards: number;\n  schedule: Record<string,Portal[][]>; bank: number; market: DarkMarket;\n  listings: SharedListing[]; publicKnowledge: Record<string,Knowledge>; trades: TradeOffer[];\n  ledger: LedgerEntry[]; trace: TraceEntry[]; history: EncounterResult[];\n  accepted: Record<string,string>; commands: Array<AppraisalAction | { type: 'advance' }>;\n  collector?:CollectorResult[];\n  /** Items the Dark Market bought or took on consignment; present only with brokerage rules. */\n  vault?: string[];\n}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:ItemView",
      "name": "ItemView",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 321,
        "endLine": 344
      },
      "text": "export interface ItemView {\n  pilotUses?:number;\n  rarityPower?:import('../../shared/rarity-power.js').RarityPower;\n  appearance?:import('../../shared/item-rarity.js').ItemAppearance;\n  lastTradePrice?:number;\n  overpriced?:boolean;\n  lastReappraisedEncounter?:number;\n  reappraisalUsed?:boolean;\n  liquidationPrice?:number;\n  copy?:{sourceId:string;sourceName:string;number:number;valuePercent:number};\n  /** This seat can inspect or appraise this merchant item once without energy. */\n  freeMerchantAction?:boolean;\n  itemEffects?:boolean;\n  trustAbilities?:boolean;\n  id: string; kind: ItemKind; name: string; image: string; owner: string;\n  npc: NpcId;\n  range?: [number,number]; ask: number; appraisal: number | null; lockedUntil: number | null;\n  price: number; appraisalAccepted: boolean | null;\n  appraisedBy?:string; commissionPaid?:boolean;\n  /** Only the owner sees what they paid. */\n  paid?:number; bonus?:boolean; stolen?:boolean;\n  knowledge: Knowledge; certificate: boolean; possibleBenefit: string; possibleDrawback: string;\n  condition: {statusId:StatusId;discount:number;available:boolean;required:boolean};\n}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:Core2Actions",
      "name": "Core2Actions",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 345,
        "endLine": 345
      },
      "text": "export interface Core2Actions { skill?:{npc:NpcId;name:string;needsItem:boolean;strong:boolean}; stealChance?:number; pickpocketChance?:number; theftUsed:boolean; trustForSkill:number }"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:AppraisalView",
      "name": "AppraisalView",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 346,
        "endLine": 388
      },
      "text": "export interface AppraisalView {\n  theftTimeoutRules?:1;\n  vaultInterestPercent?:number;\n  ghosts?:ReturnType<typeof import('./ghost-service.js').ghostView>;\n  secureEconomy?:boolean;\n  theft?:ReturnType<typeof import('./theft.js').theftViewFor>;\n  sealMarket?:import('./seals.js').SealMarketView;\n  loans?:Array<import('./secure-storage.js').SecuredLoan & {item:ItemView}>;\n  trustAbilities?:boolean;\n  itemEffects?:boolean;\n  version: 4 | 5; phase: AppraisalPhase; encounter: number; encounterCount: number | null; revision: number;\n  eventChoiceRules?:1;\n  statusLinks?:1;\n  survival?:NonNullable<AppraisalConfig['survival']>; core2?:boolean; collectorAt?:number; dread?:number; curseSight?:boolean; freeBuy?:boolean; fakeEffect?:boolean; cleanse?:boolean; wishlist?:boolean; wishContract?:boolean; challenge?:boolean; polish?:boolean; omen?:{id:string;name:string;text:string}; salePct?:number; fee?:number; maxEnergy?:number; collector?:CollectorResult[]; brokerage?:boolean; roundRewardBase?:number; passives?:boolean;\n  self: Omit<Appraiser,'personalVault'|'knowledge'|'portals'|'stock'|'inventory'|'valuations'|'startWealth'|'acceptedDanger'|'seenEvents'|'resolvedEvents'> & {\n    personalScore?:import('./personal-scoring.js').PersonalScoreBreakdown;\n    personalScoreEstimate?:{min:number;max:number;unpriced:number;modifier:number};\n    collectorWishlist?:import('./collector-wishlist.js').CollectorWishlistView;\n    personalVault?:{items:ItemView[];credits:number;slots:number;nextSlotPrice:number;nextInterest:number;interestPercent?:number;canWithdrawCredits?:boolean};\n    loanItems?:ItemView[];\n    inventory: ItemView[]; stock: ItemView[]; portals: Array<{id:string; npc:NpcId; hint:ItemKind; disabled:boolean}>;\n    portalRerollCost?:number;pilotPriceChecks?:number;pilotAcceptancePercent?:number;\n    counterLimit: number;\n    /** Per-seat caps once held relics apply (polish rules). */\n    maxEnergy?: number; maxLife?: number;\n    recoveryOffer?:RecoveryOffer;\n    /** Core v0.6: what the seat can do beyond buying: the merchant's skill, theft odds and whether this encounter's one attempt is spent. */\n    core2Actions?:Core2Actions;\n    merchantAbilities?:MerchantAbilityView[];\n    abilityChoices?:ItemView[];\n    pulse?:{shards:number;perLife:number;perSale:number;wary:boolean};\n    /** Shop bonus and its threshold. `total` selects pooled trust; absent keeps the historical all-merchant rule. */\n    stockBonus?:{tier:number;extra:number;need:number;npcs:NpcId[];total?:number};\n    cleanseOffer?:CleanseOffer;\n    wishOffer?:WishOffer;\n    wishDesk?:WishDesk;\n    /** Every open wish with its current price, in any phase, so the seat can recall what to buy. */\n    wishBook?:WishBookRow[];\n  };\n  players: Array<{id:string;credits:number;energy:number;score:number;paused:Appraiser['paused'];done:boolean;itemCount:number;life?:number}>;\n  market: Omit<DarkMarket,'lots'> & { lots?: AuctionLotView[] }; listings: Array<SharedListing & { item: ItemView }>;\n  trades: Array<TradeOffer & {item:ItemView;swapItem:ItemView|null}>; history: EncounterResult[];\n}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/types.ts:MerchantAbilityView",
      "name": "MerchantAbilityView",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 389,
        "endLine": 392
      },
      "text": "export interface MerchantAbilityView {\n  npc:NpcId; name:string; description:string; trust:number; tier:number; cooldown:number; remaining:number;\n  ready:boolean; reason:string|null; target:'stock'|'inventory'|'consumable'|'debuff'|'none'; itemIds:string[]; statusIds:StatusId[];\n}"
    },
    {
      "id": "schema:apps/comic/src/game/appraisal/wishlist.ts:Wish",
      "name": "Wish",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/game/appraisal/wishlist.ts",
        "line": 25,
        "endLine": 25
      },
      "text": "type Wish={kind:ItemKind;price:number;set?:number};"
    },
    {
      "id": "schema:apps/comic/src/shared/item-rarity.ts:Rarity",
      "name": "Rarity",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/shared/item-rarity.ts",
        "line": 3,
        "endLine": 3
      },
      "text": "export type Rarity = typeof RARITIES[number];"
    },
    {
      "id": "schema:apps/comic/src/shared/item-rarity.ts:Theme",
      "name": "Theme",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/shared/item-rarity.ts",
        "line": 5,
        "endLine": 5
      },
      "text": "export type Theme = typeof THEMES[number] | 'plain';"
    },
    {
      "id": "schema:apps/comic/src/shared/item-rarity.ts:ItemAppearance",
      "name": "ItemAppearance",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/shared/item-rarity.ts",
        "line": 6,
        "endLine": 6
      },
      "text": "export interface ItemAppearance { version:1; rarity:Rarity; theme:Theme; visualSeed:number }"
    },
    {
      "id": "schema:apps/comic/src/shared/item-rarity.ts:ThemeWeight",
      "name": "ThemeWeight",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/shared/item-rarity.ts",
        "line": 7,
        "endLine": 7
      },
      "text": "export interface ThemeWeight { theme:Theme; weight:number }"
    },
    {
      "id": "schema:apps/comic/src/shared/item-rarity.ts:RarityConfig",
      "name": "RarityConfig",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/shared/item-rarity.ts",
        "line": 8,
        "endLine": 13
      },
      "text": "export interface RarityConfig {\n  version:1;\n  /** Probabilities sum to 1; zero explicitly disables a tier. */\n  rates:Record<Rarity,number>;\n  themes:Record<Rarity,ThemeWeight[]>;\n}"
    },
    {
      "id": "schema:apps/comic/src/shared/item-rarity.ts:RGB",
      "name": "RGB",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/shared/item-rarity.ts",
        "line": 60,
        "endLine": 60
      },
      "text": "export type RGB = [number,number,number];"
    },
    {
      "id": "schema:apps/comic/src/shared/rarity-power.ts:RarityPower",
      "name": "RarityPower",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/shared/rarity-power.ts",
        "line": 4,
        "endLine": 4
      },
      "text": "export interface RarityPower { version:1; valueMultiplier:number; effectMultiplier:number }"
    },
    {
      "id": "schema:apps/comic/src/shared/rarity-power.ts:RarityEconomyConfig",
      "name": "RarityEconomyConfig",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/shared/rarity-power.ts",
        "line": 5,
        "endLine": 5
      },
      "text": "export interface RarityEconomyConfig { version:1; tiers:Record<Rarity,{value:number;effect:number}> }"
    },
    {
      "id": "schema:apps/comic/src/shared/rarity-power.ts:PoweredItem",
      "name": "PoweredItem",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/shared/rarity-power.ts",
        "line": 6,
        "endLine": 6
      },
      "text": "export interface PoweredItem { rarityPower?:RarityPower }"
    },
    {
      "id": "schema:apps/comic/src/shared/appraisal-protocol.ts:AppraisalSeatAction",
      "name": "AppraisalSeatAction",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/shared/appraisal-protocol.ts",
        "line": 5,
        "endLine": 5
      },
      "text": "export type AppraisalSeatAction = AppraisalAction extends infer A ? A extends AppraisalAction ? Omit<A, 'playerId'> : never : never;"
    },
    {
      "id": "schema:apps/comic/src/shared/appraisal-protocol.ts:AppraisalTimedPhase",
      "name": "AppraisalTimedPhase",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/shared/appraisal-protocol.ts",
        "line": 7,
        "endLine": 7
      },
      "text": "export type AppraisalTimedPhase = Exclude<AppraisalPhase,'RESULTS'>;"
    },
    {
      "id": "schema:apps/comic/src/shared/appraisal-protocol.ts:AppraisalTimerSettings",
      "name": "AppraisalTimerSettings",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/shared/appraisal-protocol.ts",
        "line": 8,
        "endLine": 8
      },
      "text": "export interface AppraisalTimerSettings { enabled:boolean;durationsMs:Record<AppraisalTimedPhase,number> }"
    },
    {
      "id": "schema:apps/comic/src/shared/appraisal-protocol.ts:AppraisalMode",
      "name": "AppraisalMode",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/shared/appraisal-protocol.ts",
        "line": 16,
        "endLine": 16
      },
      "text": "export type AppraisalMode = 'classic' | 'survival';"
    },
    {
      "id": "schema:apps/comic/src/shared/appraisal-protocol.ts:AppraisalBotPolicy",
      "name": "AppraisalBotPolicy",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/shared/appraisal-protocol.ts",
        "line": 20,
        "endLine": 20
      },
      "text": "export type AppraisalBotPolicy = typeof APPRAISAL_BOT_POLICIES[number];"
    },
    {
      "id": "schema:apps/comic/src/shared/appraisal-protocol.ts:AppraisalBotMessage",
      "name": "AppraisalBotMessage",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/shared/appraisal-protocol.ts",
        "line": 21,
        "endLine": 21
      },
      "text": "export type AppraisalBotMessage = { type: 'add-bot'; policy: AppraisalBotPolicy } | { type: 'remove-bot'; seatId: string };"
    },
    {
      "id": "schema:apps/comic/src/shared/appraisal-protocol.ts:AppraisalModeMessage",
      "name": "AppraisalModeMessage",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/shared/appraisal-protocol.ts",
        "line": 22,
        "endLine": 22
      },
      "text": "export type AppraisalModeMessage = { type: 'rules-mode'; mode: AppraisalMode };"
    },
    {
      "id": "schema:apps/comic/src/shared/appraisal-protocol.ts:AppraisalClientMessage",
      "name": "AppraisalClientMessage",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/shared/appraisal-protocol.ts",
        "line": 23,
        "endLine": 30
      },
      "text": "export type AppraisalClientMessage =\n  | Exclude<ClientMessage, { type: 'action' | 'reveal-ready' | 'audit' }>\n  | { type: 'action'; matchId: string; action: AppraisalSeatAction }\n  | { type: 'reveal-ready'; matchId: string; encounter: number }\n  | { type: 'audit'; matchId: string }\n  | AppraisalTimerMessage\n  | AppraisalModeMessage\n  | AppraisalBotMessage;"
    },
    {
      "id": "schema:apps/comic/src/shared/appraisal-protocol.ts:AppraisalTimerMessage",
      "name": "AppraisalTimerMessage",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/shared/appraisal-protocol.ts",
        "line": 32,
        "endLine": 32
      },
      "text": "export type AppraisalTimerMessage = {type:'timer-settings';settings:AppraisalTimerSettings};"
    },
    {
      "id": "schema:apps/comic/src/shared/appraisal-protocol.ts:AppraisalRoomView",
      "name": "AppraisalRoomView",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/shared/appraisal-protocol.ts",
        "line": 33,
        "endLine": 40
      },
      "text": "export interface AppraisalRoomView extends Omit<RoomView, 'rulesVersion' | 'game' | 'seats'> {\n  seats: (RoomView['seats'][number] & { bot?: AppraisalBotPolicy })[];\n  /** One live rules version; classic vs survival is the room's `mode`. */\n  rulesVersion: '0.5'; mode: AppraisalMode; game: AppraisalView | null;\n  timerSettings?:AppraisalTimerSettings;\n  /** Server time when each of this seat's open theft duels is cancelled for want of a hand; runs even in untimed rooms. */\n  duelDeadlines?:Record<string,number>;\n}"
    },
    {
      "id": "schema:apps/comic/src/shared/appraisal-protocol.ts:AppraisalMatchAudit",
      "name": "AppraisalMatchAudit",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/shared/appraisal-protocol.ts",
        "line": 42,
        "endLine": 49
      },
      "text": "export interface AppraisalMatchAudit {\n  schemaVersion: 4 | 5; matchId: string; playtestMode: PlaytestMode;\n  startedAt: number; endedAt: number; seats: { id: string; name: string }[];\n  run: AppraisalAudit;\n  timerSettings?:AppraisalTimerSettings;\n  phaseTimes: { encounter: number; phase: string; startedAt: number; endedAt: number }[];\n  timeouts: { at: number; encounter: number; phase: string; playerId: string | null }[];\n}"
    },
    {
      "id": "schema:apps/comic/src/shared/appraisal-protocol.ts:AppraisalServerMessage",
      "name": "AppraisalServerMessage",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/shared/appraisal-protocol.ts",
        "line": 50,
        "endLine": 53
      },
      "text": "export type AppraisalServerMessage =\n  | Exclude<ServerMessage, { type: 'state' | 'audit' }>\n  | { type: 'state'; room: AppraisalRoomView }\n  | { type: 'audit'; audit: AppraisalMatchAudit };"
    },
    {
      "id": "schema:apps/comic/src/server/appraisal-rooms.ts:Room",
      "name": "Room",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/server/appraisal-rooms.ts",
        "line": 12,
        "endLine": 12
      },
      "text": "type Room = LifecycleRoom<AppraisalState, AppraisalServerMessage>;"
    },
    {
      "id": "schema:apps/comic/src/server/appraisal-rooms.ts:Seat",
      "name": "Seat",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/server/appraisal-rooms.ts",
        "line": 13,
        "endLine": 13
      },
      "text": "type Seat = LifecycleSeat<AppraisalServerMessage>;"
    },
    {
      "id": "schema:apps/comic/src/server/room-lifecycle.ts:LifecyclePeer",
      "name": "LifecyclePeer",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 5,
        "endLine": 8
      },
      "text": "export interface LifecyclePeer<M = unknown> {\n  send(message: M): void;\n  close(code: number, reason: string): void;\n}"
    },
    {
      "id": "schema:apps/comic/src/server/room-lifecycle.ts:RoomTransport",
      "name": "RoomTransport",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 10,
        "endLine": 15
      },
      "text": "export interface RoomTransport {\n  readonly count: number;\n  receive(peer: LifecyclePeer, value: unknown): void;\n  disconnect(peer: LifecyclePeer): void;\n  tick(): void;\n}"
    },
    {
      "id": "schema:apps/comic/src/server/room-lifecycle.ts:ControlMessage",
      "name": "ControlMessage",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 16,
        "endLine": 16
      },
      "text": "export type ControlMessage = Exclude<ClientMessage, { type: 'action' | 'reveal-ready' | 'audit' }>;"
    },
    {
      "id": "schema:apps/comic/src/server/room-lifecycle.ts:LifecycleSeat",
      "name": "LifecycleSeat",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 18,
        "endLine": 18
      },
      "text": "export interface LifecycleSeat<M> extends SeatView { token: string; peer: LifecyclePeer<M> | null; bot?: string }"
    },
    {
      "id": "schema:apps/comic/src/server/room-lifecycle.ts:LifecycleRoom",
      "name": "LifecycleRoom",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 19,
        "endLine": 30
      },
      "text": "export interface LifecycleRoom<G, M> {\n  timing?:{enabled:boolean;durationsMs:Record<string,number>};\n  /** Rules mode picked by the host in the lobby; subclasses that have modes read it in createGame. */\n  mode?: string;\n  code: string; hostId: string; seats: LifecycleSeat<M>[];\n  matchSeats: { id: string; name: string }[]; playtestMode: PlaytestMode;\n  game: G | null; matchId: string | null; deadline: number | null;\n  phaseStartedAt: number;\n  phaseTimes: { number: number; phase: string; startedAt: number; endedAt: number }[];\n  timeouts: { at: number; number: number; phase: string; playerId: string | null }[];\n  startedAt: number; endedAt: number | null; lastActivity: number; revealReady: Set<string>;\n}"
    },
    {
      "id": "schema:apps/comic/src/simulation/appraisal.ts:AppraisalPolicy",
      "name": "AppraisalPolicy",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/simulation/appraisal.ts",
        "line": 11,
        "endLine": 11
      },
      "text": "export type AppraisalPolicy=typeof APPRAISAL_POLICIES[number];"
    },
    {
      "id": "schema:apps/comic/src/simulation/appraisal.ts:Body",
      "name": "Body",
      "kind": "TypeAliasDeclaration",
      "source": {
        "file": "apps/comic/src/simulation/appraisal.ts",
        "line": 12,
        "endLine": 12
      },
      "text": "type Body=AppraisalAction extends infer A ? A extends AppraisalAction ? Omit<A,'playerId'|'requestId'|'encounter'> : never : never;"
    },
    {
      "id": "schema:apps/comic/src/simulation/appraisal.ts:Deal",
      "name": "Deal",
      "kind": "InterfaceDeclaration",
      "source": {
        "file": "apps/comic/src/simulation/appraisal.ts",
        "line": 88,
        "endLine": 88
      },
      "text": "interface Deal {listing:AppraisalView['listings'][number];net:number;ok:boolean;npcSource:boolean;fee:number}"
    }
  ],
  "propertyWrites": [
    {
      "target": "p.abilityReady",
      "operator": "??=",
      "value": "{}",
      "owner": "code:apps/comic/src/game/appraisal/ability-rules.ts:reduceAbilityCooldown",
      "source": {
        "file": "apps/comic/src/game/appraisal/ability-rules.ts",
        "line": 22,
        "endLine": 22
      },
      "guards": [
        "reduced>0"
      ]
    },
    {
      "target": "p.abilityReady[npc]",
      "operator": "=",
      "value": "Math.round((p.abilityReady[npc]!-reduced)*100)/100",
      "owner": "code:apps/comic/src/game/appraisal/ability-rules.ts:reduceAbilityCooldown",
      "source": {
        "file": "apps/comic/src/game/appraisal/ability-rules.ts",
        "line": 22,
        "endLine": 22
      },
      "guards": [
        "reduced>0"
      ]
    },
    {
      "target": "p.abilityAdjusted",
      "operator": "??=",
      "value": "{}",
      "owner": "code:apps/comic/src/game/appraisal/ability-rules.ts:reduceAbilityCooldown",
      "source": {
        "file": "apps/comic/src/game/appraisal/ability-rules.ts",
        "line": 22,
        "endLine": 22
      },
      "guards": [
        "reduced>0"
      ]
    },
    {
      "target": "p.abilityAdjusted[npc]",
      "operator": "=",
      "value": "(p.abilityAdjusted[npc]??0)+reduced",
      "owner": "code:apps/comic/src/game/appraisal/ability-rules.ts:reduceAbilityCooldown",
      "source": {
        "file": "apps/comic/src/game/appraisal/ability-rules.ts",
        "line": 22,
        "endLine": 22
      },
      "guards": [
        "reduced>0"
      ]
    },
    {
      "target": "scores[row.playerId]",
      "operator": "=",
      "value": "(scores[row.playerId]??0)+row.score",
      "owner": "code:apps/comic/src/game/appraisal/audit.ts:scoresFromAppraisalHistory",
      "source": {
        "file": "apps/comic/src/game/appraisal/audit.ts",
        "line": 18,
        "endLine": 18
      },
      "guards": []
    },
    {
      "target": "p.statuses",
      "operator": "=",
      "value": "p.statuses.filter(s=>!s.id.startsWith('D'))",
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:applyGain",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 71,
        "endLine": 71
      },
      "guards": [
        "spec.cleanse==='debuffs'"
      ]
    },
    {
      "target": "item.owner",
      "operator": "=",
      "value": "p.id",
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:takeFromShop",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 79,
        "endLine": 79
      },
      "guards": []
    },
    {
      "target": "p.stock",
      "operator": "=",
      "value": "p.stock.filter(id=>id!==item.id)",
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:takeFromShop",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 79,
        "endLine": 79
      },
      "guards": []
    },
    {
      "target": "state.listings",
      "operator": "=",
      "value": "state.listings.filter(l=>l.itemId!==item.id)",
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:takeFromShop",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 80,
        "endLine": 80
      },
      "guards": []
    },
    {
      "target": "p.notes",
      "operator": "=",
      "value": "p.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 110,
        "endLine": 110
      },
      "guards": []
    },
    {
      "target": "p.stock",
      "operator": "=",
      "value": "p.stock.filter(id=>id!==item.id)",
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:leaveShop",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 121,
        "endLine": 121
      },
      "guards": []
    },
    {
      "target": "state.listings",
      "operator": "=",
      "value": "state.listings.filter(l=>l.itemId!==item.id)",
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:leaveShop",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 121,
        "endLine": 121
      },
      "guards": []
    },
    {
      "target": "p.energy",
      "operator": "-=",
      "value": "drained",
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:unsoldPenalty",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 133,
        "endLine": 133
      },
      "guards": []
    },
    {
      "target": "p.notes",
      "operator": "=",
      "value": "p.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:unsoldPenalty",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 136,
        "endLine": 136
      },
      "guards": []
    },
    {
      "target": "item.owner",
      "operator": "=",
      "value": "'dark-market'",
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:consign",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 142,
        "endLine": 142
      },
      "guards": []
    },
    {
      "target": "p.notes",
      "operator": "=",
      "value": "p.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:consign",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 157,
        "endLine": 157
      },
      "guards": [
        "state.config.core2"
      ]
    },
    {
      "target": "p.notes",
      "operator": "=",
      "value": "p.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:consign",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 168,
        "endLine": 168
      },
      "guards": []
    },
    {
      "target": "item.owner",
      "operator": "=",
      "value": "'dark-market'",
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:vaultSale",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 192,
        "endLine": 192
      },
      "guards": []
    },
    {
      "target": "lot.bids[p.id]",
      "operator": "=",
      "value": "credits",
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:placeBid",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 208,
        "endLine": 208
      },
      "guards": []
    },
    {
      "target": "lot.winnerId",
      "operator": "=",
      "value": "null",
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:settleAuction",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 217,
        "endLine": 217
      },
      "guards": [
        "!winner"
      ]
    },
    {
      "target": "item.owner",
      "operator": "=",
      "value": "winner.p.id",
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:settleAuction",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 225,
        "endLine": 225
      },
      "guards": []
    },
    {
      "target": "state.vault",
      "operator": "=",
      "value": "state.vault!.filter(id=>id!==item.id)",
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:settleAuction",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 225,
        "endLine": 225
      },
      "guards": []
    },
    {
      "target": "lot.winnerId",
      "operator": "=",
      "value": "winner.p.id",
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:settleAuction",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 226,
        "endLine": 226
      },
      "guards": []
    },
    {
      "target": "lot.price",
      "operator": "=",
      "value": "paid",
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:settleAuction",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 226,
        "endLine": 226
      },
      "guards": []
    },
    {
      "target": "winner.p.darkTickets",
      "operator": "=",
      "value": "(winner.p.darkTickets??0)+1",
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:settleAuction",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 227,
        "endLine": 227
      },
      "guards": []
    },
    {
      "target": "winner.p.notes",
      "operator": "=",
      "value": "winner.p.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:settleAuction",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 227,
        "endLine": 227
      },
      "guards": []
    },
    {
      "target": "buyer.notes",
      "operator": "=",
      "value": "buyer.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/challenge.ts:settleChallenge",
      "source": {
        "file": "apps/comic/src/game/appraisal/challenge.ts",
        "line": 26,
        "endLine": 26
      },
      "guards": [
        "claim===undefined || claim===truth"
      ]
    },
    {
      "target": "seller.notes",
      "operator": "=",
      "value": "seller.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/challenge.ts:settleChallenge",
      "source": {
        "file": "apps/comic/src/game/appraisal/challenge.ts",
        "line": 26,
        "endLine": 26
      },
      "guards": [
        "claim===undefined || claim===truth"
      ]
    },
    {
      "target": "buyer.notes",
      "operator": "=",
      "value": "buyer.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/challenge.ts:settleChallenge",
      "source": {
        "file": "apps/comic/src/game/appraisal/challenge.ts",
        "line": 32,
        "endLine": 32
      },
      "guards": []
    },
    {
      "target": "seller.notes",
      "operator": "=",
      "value": "seller.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/challenge.ts:settleChallenge",
      "source": {
        "file": "apps/comic/src/game/appraisal/challenge.ts",
        "line": 32,
        "endLine": 32
      },
      "guards": []
    },
    {
      "target": "item.cursed",
      "operator": "=",
      "value": "false",
      "owner": "code:apps/comic/src/game/appraisal/cleanse.ts:cleanseItem",
      "source": {
        "file": "apps/comic/src/game/appraisal/cleanse.ts",
        "line": 45,
        "endLine": 45
      },
      "guards": [
        "NOT !wasCursed",
        "randomAt(state.seed,`${state.encounter}:${p.id}:${itemId}:cleanse-roll`)*100<chance"
      ]
    },
    {
      "target": "p.notes",
      "operator": "=",
      "value": "p.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/cleanse.ts:cleanseItem",
      "source": {
        "file": "apps/comic/src/game/appraisal/cleanse.ts",
        "line": 49,
        "endLine": 49
      },
      "guards": []
    },
    {
      "target": "p.notes",
      "operator": "=",
      "value": "p.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:note",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 28,
        "endLine": 28
      },
      "guards": []
    },
    {
      "target": "item.owner",
      "operator": "=",
      "value": "'removed'",
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:closeOffer",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 37,
        "endLine": 37
      },
      "guards": [
        "item.owner===prefix+offer.id"
      ]
    },
    {
      "target": "offer.status",
      "operator": "=",
      "value": "status",
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:closeOffer",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 37,
        "endLine": 37
      },
      "guards": []
    },
    {
      "target": "state.items[id]",
      "operator": "=",
      "value": "item",
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:deliver",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 44,
        "endLine": 44
      },
      "guards": []
    },
    {
      "target": "s.offer",
      "operator": "=",
      "value": "{id:pending.id,encounter:state.encounter,itemIds,rawQuote,status:'open'}",
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:deliver",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 45,
        "endLine": 45
      },
      "guards": []
    },
    {
      "target": "state.collectorWishes",
      "operator": "??=",
      "value": "{}",
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:reconcileCollectorWishlist",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 48,
        "endLine": 48
      },
      "guards": []
    },
    {
      "target": "state.collectorWishes[p.id]",
      "operator": "=",
      "value": "{lastWindowAt:0}",
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:reconcileCollectorWishlist",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 50,
        "endLine": 50
      },
      "guards": [
        "!Object.hasOwn(state.collectorWishes,p.id)"
      ]
    },
    {
      "target": "s.lastWindowAt",
      "operator": "=",
      "value": "state.encounter",
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:reconcileCollectorWishlist",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 53,
        "endLine": 53
      },
      "guards": [
        "!phaseWindow(state)||state.phase==='APPRAISAL'&&p.done",
        "state.encounter%2===0"
      ]
    },
    {
      "target": "s.pending",
      "operator": "=",
      "value": "{id:`cw-${p.id}-${state.encounter}`,kinds:[...action.kinds],requestedAt:state.encounter,dueAt:state.encounter+2}",
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:handleCollectorWishlist",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 64,
        "endLine": 64
      },
      "guards": [
        "action.type==='collector-wish-request'"
      ]
    },
    {
      "target": "s.lastWindowAt",
      "operator": "=",
      "value": "state.encounter",
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:handleCollectorWishlist",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 64,
        "endLine": 64
      },
      "guards": [
        "action.type==='collector-wish-request'"
      ]
    },
    {
      "target": "s.lastWindowAt",
      "operator": "=",
      "value": "state.encounter",
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:handleCollectorWishlist",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 65,
        "endLine": 65
      },
      "guards": [
        "action.type==='collector-wish-skip'&&action.batchId===undefined"
      ]
    },
    {
      "target": "offer.peek",
      "operator": "=",
      "value": "index",
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:handleCollectorWishlist",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 68,
        "endLine": 68
      },
      "guards": [
        "action.type==='collector-wish-peek'"
      ]
    },
    {
      "target": "item.owner",
      "operator": "=",
      "value": "p.id",
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:handleCollectorWishlist",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 71,
        "endLine": 71
      },
      "guards": []
    },
    {
      "target": "p.paid",
      "operator": "=",
      "value": "{...p.paid,[item.id]:quote.price}",
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:handleCollectorWishlist",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 71,
        "endLine": 71
      },
      "guards": []
    },
    {
      "target": "p.notes",
      "operator": "=",
      "value": "p.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:note",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-actions.ts",
        "line": 10,
        "endLine": 10
      },
      "guards": []
    },
    {
      "target": "p.stealTried",
      "operator": "??=",
      "value": "[]",
      "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:startTheft",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-actions.ts",
        "line": 15,
        "endLine": 15
      },
      "guards": []
    },
    {
      "target": "p.npcTrust[npc]",
      "operator": "=",
      "value": "Math.max(0,trustOf(p,npc)-amount)",
      "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:loseTrust",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-actions.ts",
        "line": 19,
        "endLine": 19
      },
      "guards": [
        "p.npcTrust"
      ]
    },
    {
      "target": "item.owner",
      "operator": "=",
      "value": "p.id",
      "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:stealShop",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-actions.ts",
        "line": 34,
        "endLine": 34
      },
      "guards": [
        "ok"
      ]
    },
    {
      "target": "item.stolen",
      "operator": "=",
      "value": "true",
      "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:stealShop",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-actions.ts",
        "line": 34,
        "endLine": 34
      },
      "guards": [
        "ok"
      ]
    },
    {
      "target": "p.stock",
      "operator": "=",
      "value": "p.stock.filter(id=>id!==itemId)",
      "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:stealShop",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-actions.ts",
        "line": 34,
        "endLine": 34
      },
      "guards": [
        "ok"
      ]
    },
    {
      "target": "state.listings",
      "operator": "=",
      "value": "state.listings.filter(l=>l.itemId!==itemId)",
      "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:stealShop",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-actions.ts",
        "line": 35,
        "endLine": 35
      },
      "guards": [
        "ok"
      ]
    },
    {
      "target": "p.theft",
      "operator": "=",
      "value": "{kind:'shop'}",
      "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:stealShop",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-actions.ts",
        "line": 40,
        "endLine": 40
      },
      "guards": []
    },
    {
      "target": "p.theft",
      "operator": "=",
      "value": "{kind:'player',victim:victim.id}",
      "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:pickpocket",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-actions.ts",
        "line": 61,
        "endLine": 61
      },
      "guards": []
    },
    {
      "target": "p.theft",
      "operator": "=",
      "value": "{kind:'shop'}",
      "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:barter",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-actions.ts",
        "line": 74,
        "endLine": 74
      },
      "guards": [
        "suspicious && randomAt(state.seed,`${state.encounter}:${p.id}:barter:${itemId}`)<CORE2.barter.detect"
      ]
    },
    {
      "target": "p.skillUsed",
      "operator": "=",
      "value": "true",
      "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:useSkill",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-actions.ts",
        "line": 127,
        "endLine": 127
      },
      "guards": []
    },
    {
      "target": "portal.disabled",
      "operator": "=",
      "value": "true",
      "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:resolveCore2Event",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-events.ts",
        "line": 103,
        "endLine": 103
      },
      "guards": [
        "picked.door",
        "index===(picked.door==='first'?1:0)"
      ]
    },
    {
      "target": "p.dealMode",
      "operator": "=",
      "value": "picked.deal",
      "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:resolveCore2Event",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-events.ts",
        "line": 104,
        "endLine": 104
      },
      "guards": [
        "picked.deal"
      ]
    },
    {
      "target": "p.notes",
      "operator": "=",
      "value": "p.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:resolveCore2Event",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-events.ts",
        "line": 106,
        "endLine": 106
      },
      "guards": []
    },
    {
      "target": "p.notes",
      "operator": "=",
      "value": "p.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/core2-rules.ts:note",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-rules.ts",
        "line": 7,
        "endLine": 7
      },
      "guards": []
    },
    {
      "target": "p.energy",
      "operator": "=",
      "value": "Math.max(0,p.energy-2)",
      "owner": "code:apps/comic/src/game/appraisal/core2-rules.ts:applyDread",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-rules.ts",
        "line": 32,
        "endLine": 32
      },
      "guards": [
        "status(p,'D20')"
      ]
    },
    {
      "target": "p.energy",
      "operator": "-=",
      "value": "lost",
      "owner": "code:apps/comic/src/game/appraisal/core2-rules.ts:applyDread",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-rules.ts",
        "line": 33,
        "endLine": 33
      },
      "guards": []
    },
    {
      "target": "p.energy",
      "operator": "=",
      "value": "Math.max(0,p.energy-2)",
      "owner": "code:apps/comic/src/game/appraisal/core2-rules.ts:applyCore2Settlement",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-rules.ts",
        "line": 53,
        "endLine": 53
      },
      "guards": [
        "status(p,'D23')",
        "NOT state.config.survival"
      ]
    },
    {
      "target": "state.personalPerformance",
      "operator": "=",
      "value": "{version:1,facts:[]}",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:initialiseAppraisalRun",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 107,
        "endLine": 107
      },
      "guards": [
        "config.personalScoringRules===1"
      ]
    },
    {
      "target": "state.vault",
      "operator": "=",
      "value": "[]",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:initialiseAppraisalRun",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 108,
        "endLine": 108
      },
      "guards": [
        "config.brokerage"
      ]
    },
    {
      "target": "state.loans",
      "operator": "=",
      "value": "[]",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:initialiseAppraisalRun",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 109,
        "endLine": 109
      },
      "guards": [
        "config.secureEconomy"
      ]
    },
    {
      "target": "state.theftDuels",
      "operator": "=",
      "value": "[]",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:initialiseAppraisalRun",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 109,
        "endLine": 109
      },
      "guards": [
        "config.secureEconomy"
      ]
    },
    {
      "target": "state.schedule[id]",
      "operator": "=",
      "value": "schedule",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:initialiseAppraisalRun",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 115,
        "endLine": 115
      },
      "guards": []
    },
    {
      "target": "p.personalVault",
      "operator": "=",
      "value": "{items:[],credits:0,slots:2}",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:initialiseAppraisalRun",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 118,
        "endLine": 118
      },
      "guards": [
        "config.secureEconomy"
      ]
    },
    {
      "target": "state.market",
      "operator": "=",
      "value": "makeMarket(state)",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:initialiseAppraisalRun",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 120,
        "endLine": 120
      },
      "guards": []
    },
    {
      "target": "p.journal",
      "operator": "=",
      "value": "[{id:0,encounter:1,phase:'PORTALS',action:'เริ่มการเดินทาง',cause:'ทรัพยากรตั้งต้นของห้อง',changes:[`เครดิต +${p.credits}`,`พลัง +${p.energy}`,...(p.life!==undefined?[`ชีวิต +${p.life}`]:[])]}]",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:initialiseAppraisalRun",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 122,
        "endLine": 122
      },
      "guards": []
    },
    {
      "target": "state.items[itemId]",
      "operator": "=",
      "value": "{\n    id:itemId,kind,base,ask,genuine:randomAt(seed,`${itemId}:genuine`)<.75,\n    cursed:randomAt(seed,`${itemId}:curse`)<.35,owner:`npc:${id}:${encounter}`,\n    npcOwnerId:id,npc,encounter,certificate:randomAt(seed,`${itemId}:certificate`)<.65,\n    lastAppraisal:null,lastAccepted:null,reservation:Math.min(ask,Math.max(1,minimum)),\n    ...(slot>=2?{bonus:true}:{}),\n  }",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:spawnStockItem",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 135,
        "endLine": 141
      },
      "guards": []
    },
    {
      "target": "p.portals[index]",
      "operator": "=",
      "value": "{id:`portal-${state.encounter}-${seat}-${tag}`,npc,stock,disabled:false}",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:rerollPortal",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 166,
        "endLine": 166
      },
      "guards": []
    },
    {
      "target": "p.portalRerolls",
      "operator": "=",
      "value": "done+1",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:rerollPortal",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 167,
        "endLine": 167
      },
      "guards": []
    },
    {
      "target": "market.lots",
      "operator": "=",
      "value": "auctionLots(state)",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:makeMarket",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 173,
        "endLine": 173
      },
      "guards": [
        "state.config.brokerage"
      ]
    },
    {
      "target": "market.budget",
      "operator": "+=",
      "value": "reserved",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:makeMarket",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 186,
        "endLine": 186
      },
      "guards": []
    },
    {
      "target": "market.budget",
      "operator": "+=",
      "value": "cheapest.reserved",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:makeMarket",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 188,
        "endLine": 188
      },
      "guards": [
        "!market.orders.length",
        "cheapest && cheapest.reserved<=free"
      ]
    },
    {
      "target": "market.open",
      "operator": "=",
      "value": "market.orders.length>0",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:makeMarket",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 189,
        "endLine": 189
      },
      "guards": []
    },
    {
      "target": "p.paused",
      "operator": "=",
      "value": "'exhausted'",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:pauseIfNeeded",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 196,
        "endLine": 196
      },
      "guards": [
        "!state.config.survival && p.energy===0 && !p.paused && !(state.config.freeMerchantAction && (p.selectedPortalId===null || p.stock.some(id=>merchantActionFree(state,p,id))))",
        "!p.paused"
      ]
    },
    {
      "target": "p.done",
      "operator": "=",
      "value": "true",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:pauseIfNeeded",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 196,
        "endLine": 196
      },
      "guards": [
        "!state.config.survival && p.energy===0 && !p.paused && !(state.config.freeMerchantAction && (p.selectedPortalId===null || p.stock.some(id=>merchantActionFree(state,p,id))))",
        "!p.paused"
      ]
    },
    {
      "target": "p.eventOffer",
      "operator": "=",
      "value": "null",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:pauseIfNeeded",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 196,
        "endLine": 196
      },
      "guards": [
        "!state.config.survival && p.energy===0 && !p.paused && !(state.config.freeMerchantAction && (p.selectedPortalId===null || p.stock.some(id=>merchantActionFree(state,p,id))))",
        "!p.paused"
      ]
    },
    {
      "target": "p.done",
      "operator": "=",
      "value": "true",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:pauseIfNeeded",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 198,
        "endLine": 198
      },
      "guards": [
        "p.paused"
      ]
    },
    {
      "target": "p.eventOffer",
      "operator": "=",
      "value": "null",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:pauseIfNeeded",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 198,
        "endLine": 198
      },
      "guards": [
        "p.paused"
      ]
    },
    {
      "target": "p.subsidy",
      "operator": "=",
      "value": "false",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:settleEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 204,
        "endLine": 204
      },
      "guards": [
        "state.config.survival && p.life===0",
        "p.subsidy"
      ]
    },
    {
      "target": "state.reservedRewards",
      "operator": "--",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:settleEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 204,
        "endLine": 204
      },
      "guards": [
        "state.config.survival && p.life===0",
        "p.subsidy"
      ]
    },
    {
      "target": "p.energy",
      "operator": "=",
      "value": "Math.max(0,p.energy-integerEffect(statusMagnitude(p,'D05',2)))",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:settleEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 207,
        "endLine": 207
      },
      "guards": [
        "status(p,'D05')"
      ]
    },
    {
      "target": "p.energy",
      "operator": "=",
      "value": "Math.max(0,p.energy-integerEffect(statusMagnitude(p,'D11',1)))",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:settleEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 208,
        "endLine": 208
      },
      "guards": [
        "status(p,'D11')"
      ]
    },
    {
      "target": "p.energy",
      "operator": "=",
      "value": "Math.max(0,p.energy-omenNow(state)!.settleEnergy!)",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:settleEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 209,
        "endLine": 209
      },
      "guards": [
        "omenNow(state)?.settleEnergy"
      ]
    },
    {
      "target": "p.score",
      "operator": "+=",
      "value": "score",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:settleEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 214,
        "endLine": 214
      },
      "guards": []
    },
    {
      "target": "p.subsidy",
      "operator": "=",
      "value": "false",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:settleEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 215,
        "endLine": 215
      },
      "guards": [
        "p.subsidy"
      ]
    },
    {
      "target": "state.reservedRewards",
      "operator": "--",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:settleEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 215,
        "endLine": 215
      },
      "guards": [
        "p.subsidy"
      ]
    },
    {
      "target": "state.market.open",
      "operator": "=",
      "value": "false",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:settleEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 220,
        "endLine": 220
      },
      "guards": []
    },
    {
      "target": "state.market.budget",
      "operator": "=",
      "value": "0",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:settleEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 220,
        "endLine": 220
      },
      "guards": []
    },
    {
      "target": "offer.status",
      "operator": "=",
      "value": "'rejected'",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:settleEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 221,
        "endLine": 221
      },
      "guards": [
        "offer.status==='open'"
      ]
    },
    {
      "target": "state.phase",
      "operator": "=",
      "value": "'REVEAL'",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:settleEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 223,
        "endLine": 223
      },
      "guards": [
        "NOT state.config.survival && (state.players.every(p=>p.life===0) || collectorDue(state))"
      ]
    },
    {
      "target": "state.phase",
      "operator": "=",
      "value": "'APPRAISAL'",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:progress",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 230,
        "endLine": 230
      },
      "guards": [
        "state.phase==='PORTALS'"
      ]
    },
    {
      "target": "p.done",
      "operator": "=",
      "value": "!!p.paused || !p.stock.length",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:progress",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 231,
        "endLine": 231
      },
      "guards": [
        "state.phase==='PORTALS'"
      ]
    },
    {
      "target": "state.phase",
      "operator": "=",
      "value": "'TRADE'",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:progress",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 233,
        "endLine": 233
      },
      "guards": [
        "NOT state.phase==='PORTALS'",
        "state.phase==='APPRAISAL'"
      ]
    },
    {
      "target": "p.done",
      "operator": "=",
      "value": "!!p.paused",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:progress",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 234,
        "endLine": 234
      },
      "guards": [
        "NOT state.phase==='PORTALS'",
        "state.phase==='APPRAISAL'"
      ]
    },
    {
      "target": "state.listings",
      "operator": "=",
      "value": "state.listings.filter(l=>l.itemId!==itemId)",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:share",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 250,
        "endLine": 250
      },
      "guards": []
    },
    {
      "target": "p.darkTickets",
      "operator": "=",
      "value": "p.darkTickets!-TRUST_RULES.ticketsToForce",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:forceBuy",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 283,
        "endLine": 283
      },
      "guards": []
    },
    {
      "target": "p.paid",
      "operator": "=",
      "value": "{...p.paid,[item.id]:Math.max(0,(p.paid?.[item.id]??0)-rebated)}",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:forceBuy",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 285,
        "endLine": 285
      },
      "guards": []
    },
    {
      "target": "state.listings",
      "operator": "=",
      "value": "state.listings.filter(l=>l.itemId!==item.id)",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:forceBuy",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 286,
        "endLine": 286
      },
      "guards": []
    },
    {
      "target": "p.notes",
      "operator": "=",
      "value": "p.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:forceBuy",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 288,
        "endLine": 288
      },
      "guards": []
    },
    {
      "target": "seller.notes",
      "operator": "=",
      "value": "seller.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:forceBuy",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 289,
        "endLine": 289
      },
      "guards": []
    },
    {
      "target": "offer.status",
      "operator": "=",
      "value": "'rejected'",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:respond",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 295,
        "endLine": 295
      },
      "guards": [
        "!accept"
      ]
    },
    {
      "target": "p.inventory",
      "operator": "=",
      "value": "p.inventory.filter(id=>id!==item.id)",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:respond",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 310,
        "endLine": 310
      },
      "guards": [
        "NOT offer.source==='npc'"
      ]
    },
    {
      "target": "item.owner",
      "operator": "=",
      "value": "buyer.id",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:respond",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 310,
        "endLine": 310
      },
      "guards": [
        "NOT offer.source==='npc'"
      ]
    },
    {
      "target": "buyer.inventory",
      "operator": "=",
      "value": "buyer.inventory.filter(id=>id!==swap.id)",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:respond",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 311,
        "endLine": 311
      },
      "guards": [
        "NOT offer.source==='npc'",
        "swap"
      ]
    },
    {
      "target": "swap.owner",
      "operator": "=",
      "value": "p.id",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:respond",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 311,
        "endLine": 311
      },
      "guards": [
        "NOT offer.source==='npc'",
        "swap"
      ]
    },
    {
      "target": "buyer.paid",
      "operator": "=",
      "value": "{...buyer.paid,[offer.itemId]:Math.max(0,(offer.source==='npc'?(buyer.paid?.[offer.itemId]??0):0)+offer.credits+penalty-rebated)}",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:respond",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 322,
        "endLine": 322
      },
      "guards": []
    },
    {
      "target": "state.listings",
      "operator": "=",
      "value": "state.listings.filter(l=>l.itemId!==offer.itemId && l.itemId!==offer.swapItemId)",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:respond",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 323,
        "endLine": 323
      },
      "guards": []
    },
    {
      "target": "offer.status",
      "operator": "=",
      "value": "'accepted'",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:respond",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 324,
        "endLine": 324
      },
      "guards": []
    },
    {
      "target": "party.subsidy",
      "operator": "=",
      "value": "false",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:respond",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 325,
        "endLine": 325
      },
      "guards": [
        "party.subsidy"
      ]
    },
    {
      "target": "state.reservedRewards",
      "operator": "--",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:respond",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 325,
        "endLine": 325
      },
      "guards": [
        "party.subsidy"
      ]
    },
    {
      "target": "offer.status",
      "operator": "=",
      "value": "'rejected'",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:expireUnavailableOffers",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 337,
        "endLine": 337
      },
      "guards": [
        "!listed || !available || !swapAvailable || seller.paused || buyer.paused || seller.done || buyer.done"
      ]
    },
    {
      "target": "state.revision",
      "operator": "++",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 354,
        "endLine": 354
      },
      "guards": [
        "ghostAction"
      ]
    },
    {
      "target": "state.accepted[key]",
      "operator": "=",
      "value": "signature",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 354,
        "endLine": 354
      },
      "guards": [
        "ghostAction"
      ]
    },
    {
      "target": "state.revision",
      "operator": "++",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 362,
        "endLine": 362
      },
      "guards": [
        "roundAction"
      ]
    },
    {
      "target": "state.accepted[key]",
      "operator": "=",
      "value": "signature",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 362,
        "endLine": 362
      },
      "guards": [
        "roundAction"
      ]
    },
    {
      "target": "state.revision",
      "operator": "++",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 378,
        "endLine": 378
      },
      "guards": [
        "financeAction || action.type==='theft-hand' || action.type==='theft-expire' || forcedTimeout"
      ]
    },
    {
      "target": "state.accepted[key]",
      "operator": "=",
      "value": "signature",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 378,
        "endLine": 378
      },
      "guards": [
        "financeAction || action.type==='theft-hand' || action.type==='theft-expire' || forcedTimeout"
      ]
    },
    {
      "target": "p.selectedPortalId",
      "operator": "=",
      "value": "portal.id",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 390,
        "endLine": 390
      },
      "guards": []
    },
    {
      "target": "p.stock",
      "operator": "=",
      "value": "[...portal.stock]",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 390,
        "endLine": 390
      },
      "guards": []
    },
    {
      "target": "p.done",
      "operator": "=",
      "value": "true",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 393,
        "endLine": 393
      },
      "guards": []
    },
    {
      "target": "p.recoveryUsed",
      "operator": "=",
      "value": "true",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 407,
        "endLine": 407
      },
      "guards": []
    },
    {
      "target": "p.notes",
      "operator": "=",
      "value": "p.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 409,
        "endLine": 409
      },
      "guards": [
        "offer.target==='life'"
      ]
    },
    {
      "target": "duel.status",
      "operator": "=",
      "value": "'cancelled'",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 432,
        "endLine": 432
      },
      "guards": [
        "action.type==='theft-timeout'",
        "duel.status==='open' && [duel.thiefId,duel.victimId].includes(p.id)"
      ]
    },
    {
      "target": "duel.hands",
      "operator": "=",
      "value": "{}",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 432,
        "endLine": 432
      },
      "guards": [
        "action.type==='theft-timeout'",
        "duel.status==='open' && [duel.thiefId,duel.victimId].includes(p.id)"
      ]
    },
    {
      "target": "p.done",
      "operator": "=",
      "value": "true",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 435,
        "endLine": 435
      },
      "guards": []
    },
    {
      "target": "offer.status",
      "operator": "=",
      "value": "'rejected'",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 435,
        "endLine": 435
      },
      "guards": [
        "offer.status==='open' && [offer.buyerId,offer.sellerId].includes(p.id)"
      ]
    },
    {
      "target": "state.revision",
      "operator": "++",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 438,
        "endLine": 438
      },
      "guards": []
    },
    {
      "target": "state.accepted[key]",
      "operator": "=",
      "value": "signature",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 439,
        "endLine": 439
      },
      "guards": []
    },
    {
      "target": "state.revision",
      "operator": "++",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 443,
        "endLine": 443
      },
      "guards": []
    },
    {
      "target": "state.phase",
      "operator": "=",
      "value": "'RESULTS'",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 446,
        "endLine": 446
      },
      "guards": [
        "!state.config.survival && state.encounter===state.config.encounters"
      ]
    },
    {
      "target": "state.encounter",
      "operator": "++",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 447,
        "endLine": 447
      },
      "guards": []
    },
    {
      "target": "state.phase",
      "operator": "=",
      "value": "'PORTALS'",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 447,
        "endLine": 447
      },
      "guards": []
    },
    {
      "target": "state.listings",
      "operator": "=",
      "value": "[]",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 447,
        "endLine": 447
      },
      "guards": []
    },
    {
      "target": "state.market",
      "operator": "=",
      "value": "{encounter:state.encounter,open:false,budget:0,orders:[]}",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 447,
        "endLine": 447
      },
      "guards": []
    },
    {
      "target": "p.skillUsed",
      "operator": "=",
      "value": "false",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 452,
        "endLine": 452
      },
      "guards": [
        "state.config.trustAbilities"
      ]
    },
    {
      "target": "p.passiveUses",
      "operator": "=",
      "value": "{}",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 458,
        "endLine": 458
      },
      "guards": [
        "passivesEnabled(state.config)"
      ]
    },
    {
      "target": "p.recoveryUsed",
      "operator": "=",
      "value": "false",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 459,
        "endLine": 459
      },
      "guards": [
        "state.config.survival"
      ]
    },
    {
      "target": "p.paused",
      "operator": "=",
      "value": "null",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 460,
        "endLine": 460
      },
      "guards": []
    },
    {
      "target": "p.done",
      "operator": "=",
      "value": "false",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 460,
        "endLine": 460
      },
      "guards": []
    },
    {
      "target": "p.portals",
      "operator": "=",
      "value": "structuredClone(state.schedule[p.id]![state.encounter-1]!)",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 460,
        "endLine": 460
      },
      "guards": []
    },
    {
      "target": "p.selectedPortalId",
      "operator": "=",
      "value": "null",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 460,
        "endLine": 460
      },
      "guards": []
    },
    {
      "target": "p.stock",
      "operator": "=",
      "value": "[]",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 460,
        "endLine": 460
      },
      "guards": []
    },
    {
      "target": "p.valuations",
      "operator": "=",
      "value": "{}",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 460,
        "endLine": 460
      },
      "guards": []
    },
    {
      "target": "p.inspections",
      "operator": "=",
      "value": "0",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 460,
        "endLine": 460
      },
      "guards": []
    },
    {
      "target": "p.counters",
      "operator": "=",
      "value": "0",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 460,
        "endLine": 460
      },
      "guards": []
    },
    {
      "target": "p.activated",
      "operator": "=",
      "value": "[]",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 460,
        "endLine": 460
      },
      "guards": []
    },
    {
      "target": "p.accuracyBonus",
      "operator": "=",
      "value": "0",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 460,
        "endLine": 460
      },
      "guards": []
    },
    {
      "target": "p.eventOffer",
      "operator": "=",
      "value": "null",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 460,
        "endLine": 460
      },
      "guards": []
    },
    {
      "target": "p.offerSlots",
      "operator": "=",
      "value": "0",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 460,
        "endLine": 460
      },
      "guards": []
    },
    {
      "target": "p.consequenceSlots",
      "operator": "=",
      "value": "0",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 460,
        "endLine": 460
      },
      "guards": []
    },
    {
      "target": "p.honorJob",
      "operator": "=",
      "value": "false",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 460,
        "endLine": 460
      },
      "guards": []
    },
    {
      "target": "p.honestyReward",
      "operator": "=",
      "value": "null",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 460,
        "endLine": 460
      },
      "guards": []
    },
    {
      "target": "p.acceptedDanger",
      "operator": "=",
      "value": "false",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 460,
        "endLine": 460
      },
      "guards": []
    },
    {
      "target": "p.caught",
      "operator": "=",
      "value": "false",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 460,
        "endLine": 460
      },
      "guards": []
    },
    {
      "target": "p.dealMode",
      "operator": "=",
      "value": "'any'",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 460,
        "endLine": 460
      },
      "guards": []
    },
    {
      "target": "p.cleansed",
      "operator": "=",
      "value": "[]",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 460,
        "endLine": 460
      },
      "guards": [
        "p.cleansed"
      ]
    },
    {
      "target": "p.wishTried",
      "operator": "=",
      "value": "false",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 460,
        "endLine": 460
      },
      "guards": [
        "p.wishes"
      ]
    },
    {
      "target": "p.statuses",
      "operator": "=",
      "value": "p.statuses.filter(s=>s.expires>=state.encounter && s.charges>0)",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 461,
        "endLine": 461
      },
      "guards": []
    },
    {
      "target": "p.startWealth",
      "operator": "=",
      "value": "wealth(state,p)",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 461,
        "endLine": 461
      },
      "guards": []
    },
    {
      "target": "p.portals.at(-1)!.disabled",
      "operator": "=",
      "value": "true",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 466,
        "endLine": 466
      },
      "guards": [
        "status(p,'D07')?.starts===state.encounter"
      ]
    },
    {
      "target": "state.market",
      "operator": "=",
      "value": "makeMarket(state)",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 468,
        "endLine": 468
      },
      "guards": []
    },
    {
      "target": "facts[itemId]",
      "operator": "=",
      "value": "proof",
      "owner": "code:apps/comic/src/game/appraisal/events.ts:offerEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 238,
        "endLine": 238
      },
      "guards": [
        "id==='E45'",
        "Object.keys(proof).length"
      ]
    },
    {
      "target": "p.eventOffer",
      "operator": "=",
      "value": "{id,key,choices:eventChoices(state,p,id),itemIds:[...itemIds],statusIds:p.statuses.map(s=>s.id),otherPlayerIds:state.listings.filter(l=>l.ownerId!==p.id).map(l=>l.ownerId),quotedPrices:quotes,facts,targetKinds,...(giveItemId?{giveItemId}:{}),...(wish?{wish}:{}),...(boons?{boons}:{})}",
      "owner": "code:apps/comic/src/game/appraisal/events.ts:offerEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 247,
        "endLine": 247
      },
      "guards": []
    },
    {
      "target": "p.consequenceSlots",
      "operator": "++",
      "owner": "code:apps/comic/src/game/appraisal/events.ts:offerEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 250,
        "endLine": 250
      },
      "guards": [
        "reaction"
      ]
    },
    {
      "target": "p.offerSlots",
      "operator": "++",
      "owner": "code:apps/comic/src/game/appraisal/events.ts:offerEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 250,
        "endLine": 250
      },
      "guards": [
        "NOT reaction",
        "!(reworked(state) && isBondGift(id))"
      ]
    },
    {
      "target": "p.inspections",
      "operator": "++",
      "owner": "code:apps/comic/src/game/appraisal/events.ts:eventInspect",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 305,
        "endLine": 305
      },
      "guards": []
    },
    {
      "target": "p.eventOffer",
      "operator": "=",
      "value": "null",
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 312,
        "endLine": 312
      },
      "guards": [
        "reworked(state) && !offer.choices.includes('decline') && !isConsequence(id) && !core2Spec(id) && !eventEligible(state,p,id)"
      ]
    },
    {
      "target": "p.notes",
      "operator": "=",
      "value": "p.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 312,
        "endLine": 312
      },
      "guards": [
        "reworked(state) && !offer.choices.includes('decline') && !isConsequence(id) && !core2Spec(id) && !eventEligible(state,p,id)"
      ]
    },
    {
      "target": "p.portals[0]!.disabled",
      "operator": "=",
      "value": "true",
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 314,
        "endLine": 314
      },
      "guards": [
        "choice==='decline'",
        "['E01','E10'].includes(id)"
      ]
    },
    {
      "target": "p.eventOffer",
      "operator": "=",
      "value": "null",
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 314,
        "endLine": 314
      },
      "guards": [
        "choice==='decline'"
      ]
    },
    {
      "target": "p.eventOffer",
      "operator": "=",
      "value": "null",
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 316,
        "endLine": 316
      },
      "guards": [
        "core2Spec(id)"
      ]
    },
    {
      "target": "p.eventOffer",
      "operator": "=",
      "value": "null",
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 317,
        "endLine": 317
      },
      "guards": [
        "isNpcEvent(id)"
      ]
    },
    {
      "target": "p.eventOffer",
      "operator": "=",
      "value": "null",
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 321,
        "endLine": 321
      },
      "guards": [
        "bondSpec(id)"
      ]
    },
    {
      "target": "p.notes",
      "operator": "=",
      "value": "p.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 322,
        "endLine": 322
      },
      "guards": [
        "id==='E73'"
      ]
    },
    {
      "target": "p.eventOffer",
      "operator": "=",
      "value": "null",
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 322,
        "endLine": 322
      },
      "guards": [
        "id==='E73'"
      ]
    },
    {
      "target": "p.portals[0]!.disabled",
      "operator": "=",
      "value": "true",
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 328,
        "endLine": 328
      },
      "guards": [
        "NOT choice==='stay'"
      ]
    },
    {
      "target": "p.honorJob",
      "operator": "=",
      "value": "true",
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 329,
        "endLine": 329
      },
      "guards": []
    },
    {
      "target": "p.dealMode",
      "operator": "=",
      "value": "choice==='cash'?'cash':'condition'",
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 335,
        "endLine": 335
      },
      "guards": []
    },
    {
      "target": "portal.disabled",
      "operator": "=",
      "value": "index!==(choice==='cash'?0:1)",
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 335,
        "endLine": 335
      },
      "guards": []
    },
    {
      "target": "p.portals[0]!.disabled",
      "operator": "=",
      "value": "true",
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 337,
        "endLine": 337
      },
      "guards": [
        "NOT choice==='pay'",
        "NOT choice==='fog'"
      ]
    },
    {
      "target": "p.honestyReward",
      "operator": "=",
      "value": "choice==='discount'?'B03':'B04'",
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 345,
        "endLine": 345
      },
      "guards": []
    },
    {
      "target": "state.publicKnowledge[v]",
      "operator": "=",
      "value": "{...state.publicKnowledge[v],genuine:false}",
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 346,
        "endLine": 346
      },
      "guards": []
    },
    {
      "target": "p.subsidy",
      "operator": "=",
      "value": "true",
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 375,
        "endLine": 375
      },
      "guards": []
    },
    {
      "target": "state.reservedRewards",
      "operator": "++",
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 375,
        "endLine": 375
      },
      "guards": []
    },
    {
      "target": "state.publicKnowledge[v]",
      "operator": "=",
      "value": "{...state.publicKnowledge[v],[fact]:value}",
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 377,
        "endLine": 377
      },
      "guards": []
    },
    {
      "target": "p.notes",
      "operator": "=",
      "value": "p.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 378,
        "endLine": 378
      },
      "guards": []
    },
    {
      "target": "p.notes",
      "operator": "=",
      "value": "p.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 386,
        "endLine": 386
      },
      "guards": [
        "reworked(state)"
      ]
    },
    {
      "target": "p.notes",
      "operator": "=",
      "value": "p.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 394,
        "endLine": 394
      },
      "guards": []
    },
    {
      "target": "p.notes",
      "operator": "=",
      "value": "p.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 398,
        "endLine": 398
      },
      "guards": []
    },
    {
      "target": "p.notes",
      "operator": "=",
      "value": "p.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 404,
        "endLine": 404
      },
      "guards": []
    },
    {
      "target": "p.energy",
      "operator": "=",
      "value": "Math.max(0,p.energy-2)",
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 405,
        "endLine": 405
      },
      "guards": [
        "NOT choice==='pay'",
        "NOT choice==='item'"
      ]
    },
    {
      "target": "p.eventOffer",
      "operator": "=",
      "value": "null",
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 409,
        "endLine": 409
      },
      "guards": []
    },
    {
      "target": "g.draws",
      "operator": "++",
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:draw",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 13,
        "endLine": 13
      },
      "guards": []
    },
    {
      "target": "g.encounter",
      "operator": "=",
      "value": "s.encounter",
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:resetSlots",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 16,
        "endLine": 16
      },
      "guards": []
    },
    {
      "target": "g.slots",
      "operator": "=",
      "value": "Array.from({length:3},()=>({kind:sample(s,g,id),lost:false}))",
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:resetSlots",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 16,
        "endLine": 16
      },
      "guards": []
    },
    {
      "target": "s.ghosts",
      "operator": "??=",
      "value": "{}",
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 27,
        "endLine": 27
      },
      "guards": []
    },
    {
      "target": "s.ghosts[id]",
      "operator": "??=",
      "value": "{round:0,available:false,swaps:[],encounter:s.encounter,slots:[],jobs:[],bonus:0,draws:0}",
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 35,
        "endLine": 35
      },
      "guards": []
    },
    {
      "target": "g.startedAt",
      "operator": "=",
      "value": "a.startedAt??0",
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 37,
        "endLine": 37
      },
      "guards": [
        "a.type==='ghost-start'"
      ]
    },
    {
      "target": "g.round",
      "operator": "++",
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 37,
        "endLine": 37
      },
      "guards": [
        "a.type==='ghost-start'"
      ]
    },
    {
      "target": "g.swaps",
      "operator": "=",
      "value": "[]",
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 37,
        "endLine": 37
      },
      "guards": [
        "a.type==='ghost-start'"
      ]
    },
    {
      "target": "g.tracking",
      "operator": "=",
      "value": "startTracking(order,0)",
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 39,
        "endLine": 39
      },
      "guards": [
        "a.type==='ghost-start'"
      ]
    },
    {
      "target": "g.tracking",
      "operator": "=",
      "value": "guessTracking(g.tracking,a.position)",
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 42,
        "endLine": 42
      },
      "guards": [
        "a.type==='ghost-guess'"
      ]
    },
    {
      "target": "g.available",
      "operator": "=",
      "value": "g.tracking.status==='available'",
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 42,
        "endLine": 42
      },
      "guards": [
        "a.type==='ghost-guess'"
      ]
    },
    {
      "target": "j.status",
      "operator": "=",
      "value": "a.accept?'accepted':'cancelled'",
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 45,
        "endLine": 45
      },
      "guards": [
        "a.type==='ghost-accept'"
      ]
    },
    {
      "target": "g.available",
      "operator": "=",
      "value": "false",
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 45,
        "endLine": 45
      },
      "guards": [
        "a.type==='ghost-accept'",
        "!g.jobs.some(active)&&g.jobs.some(job=>job.round===g.round&&job.status==='delivered')"
      ]
    },
    {
      "target": "slot.lost",
      "operator": "=",
      "value": "true",
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 51,
        "endLine": 51
      },
      "guards": [
        "a.type==='ghost-rps'",
        "result==='lost'"
      ]
    },
    {
      "target": "slot.kind",
      "operator": "=",
      "value": "sample(s,g,id)",
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 51,
        "endLine": 51
      },
      "guards": [
        "a.type==='ghost-rps'",
        "result==='won'"
      ]
    },
    {
      "target": "g.lastRps",
      "operator": "=",
      "value": "{slot:a.slot,hand:a.hand,opponent:hands[opponent]!,result}",
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 51,
        "endLine": 51
      },
      "guards": [
        "a.type==='ghost-rps'"
      ]
    },
    {
      "target": "s.items[itemId]",
      "operator": "=",
      "value": "{id:itemId,kind:j.kind,base:j.base,genuine:randomAt(s.seed,`${itemId}:genuine`)<.75,cursed:randomAt(s.seed,`${itemId}:curse`)<.35,ask:j.price,owner:buyer.id,npcOwnerId:buyer.id,npc:source.npc,encounter:s.encounter,lastAppraisal:null,lastAccepted:null,certificate:false,reservation:1,...(source.appearance?{appearance:structuredClone(source.appearance)}:{}),...(source.rarityPower?{rarityPower:structuredClone(source.rarityPower)}:{})}",
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 55,
        "endLine": 55
      },
      "guards": []
    },
    {
      "target": "buyer.paid",
      "operator": "=",
      "value": "{...buyer.paid,[itemId]:j.price+j.fee}",
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 56,
        "endLine": 56
      },
      "guards": []
    },
    {
      "target": "g.bonus",
      "operator": "+=",
      "value": "commission+j.fee",
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 56,
        "endLine": 56
      },
      "guards": []
    },
    {
      "target": "j.status",
      "operator": "=",
      "value": "'delivered'",
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 56,
        "endLine": 56
      },
      "guards": []
    },
    {
      "target": "g.slots[a.slot]",
      "operator": "=",
      "value": "{kind:sample(s,g,id),lost:false}",
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 56,
        "endLine": 56
      },
      "guards": []
    },
    {
      "target": "g.available",
      "operator": "=",
      "value": "false",
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 57,
        "endLine": 57
      },
      "guards": [
        "!g.jobs.some(active)"
      ]
    },
    {
      "target": "job.status",
      "operator": "=",
      "value": "'cancelled'",
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:reconcileGhostJobs",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 75,
        "endLine": 75
      },
      "guards": [
        "active(job)&&player(state,job.buyerId).life===0"
      ]
    },
    {
      "target": "g.available",
      "operator": "=",
      "value": "false",
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:reconcileGhostJobs",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 76,
        "endLine": 76
      },
      "guards": [
        "cancelled&&!g.jobs.some(active)"
      ]
    },
    {
      "target": "bonuses[key]",
      "operator": "+=",
      "value": "used![key]??0",
      "owner": "code:apps/comic/src/game/appraisal/item-effects.ts:addUseBonuses",
      "source": {
        "file": "apps/comic/src/game/appraisal/item-effects.ts",
        "line": 44,
        "endLine": 44
      },
      "guards": []
    },
    {
      "target": "bonuses[key]",
      "operator": "=",
      "value": "integerEffect(bonuses[key])",
      "owner": "code:apps/comic/src/game/appraisal/item-effects.ts:addUseBonuses",
      "source": {
        "file": "apps/comic/src/game/appraisal/item-effects.ts",
        "line": 45,
        "endLine": 45
      },
      "guards": [
        "!['commission','luck','acceptance','mitigation'].includes(key)"
      ]
    },
    {
      "target": "current.journal",
      "operator": "??=",
      "value": "[]",
      "owner": "code:apps/comic/src/game/appraisal/journal.ts:recordJournal",
      "source": {
        "file": "apps/comic/src/game/appraisal/journal.ts",
        "line": 49,
        "endLine": 49
      },
      "guards": []
    },
    {
      "target": "s.charges",
      "operator": "--",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:consumeStatus",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 37,
        "endLine": 37
      },
      "guards": [
        "s"
      ]
    },
    {
      "target": "p.statuses",
      "operator": "=",
      "value": "p.statuses.filter(value => value.charges > 0)",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:consumeStatus",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 37,
        "endLine": 37
      },
      "guards": []
    },
    {
      "target": "p.statuses",
      "operator": "=",
      "value": "p.statuses.filter(s => s.id !== id)",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:removeStatus",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 39,
        "endLine": 39
      },
      "guards": []
    },
    {
      "target": "p.energy",
      "operator": "=",
      "value": "Math.min(p.energy,maxEnergyOf(state,p))",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:enforceCaps",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 51,
        "endLine": 51
      },
      "guards": []
    },
    {
      "target": "p.life",
      "operator": "=",
      "value": "next",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:enforceCaps",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 55,
        "endLine": 55
      },
      "guards": [
        "p.life!==undefined && p.life>0"
      ]
    },
    {
      "target": "old.charges",
      "operator": "=",
      "value": "Math.max(old.charges,charges)",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:grant",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 100,
        "endLine": 100
      },
      "guards": [
        "old"
      ]
    },
    {
      "target": "old.expires",
      "operator": "=",
      "value": "Math.max(old.expires,expires)",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:grant",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 100,
        "endLine": 100
      },
      "guards": [
        "old"
      ]
    },
    {
      "target": "old.power",
      "operator": "=",
      "value": "merged",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:grant",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 100,
        "endLine": 100
      },
      "guards": [
        "old",
        "NOT merged===1"
      ]
    },
    {
      "target": "p.credits",
      "operator": "-=",
      "value": "credits",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:spend",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 107,
        "endLine": 107
      },
      "guards": []
    },
    {
      "target": "state.bank",
      "operator": "+=",
      "value": "credits",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:spend",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 107,
        "endLine": 107
      },
      "guards": []
    },
    {
      "target": "p.energy",
      "operator": "-=",
      "value": "energy",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:spend",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 107,
        "endLine": 107
      },
      "guards": []
    },
    {
      "target": "state.bank",
      "operator": "-=",
      "value": "credits",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:reward",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 114,
        "endLine": 114
      },
      "guards": []
    },
    {
      "target": "p.credits",
      "operator": "+=",
      "value": "credits",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:reward",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 114,
        "endLine": 114
      },
      "guards": []
    },
    {
      "target": "from.credits",
      "operator": "-=",
      "value": "credits",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:transfer",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 119,
        "endLine": 119
      },
      "guards": []
    },
    {
      "target": "to.credits",
      "operator": "+=",
      "value": "credits",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:transfer",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 119,
        "endLine": 119
      },
      "guards": []
    },
    {
      "target": "p.credits",
      "operator": "+=",
      "value": "amount",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:fundPassive",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 125,
        "endLine": 125
      },
      "guards": []
    },
    {
      "target": "p.energy",
      "operator": "=",
      "value": "Math.min(maxEnergyOf(state,p),p.energy + gained)",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:recover",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 131,
        "endLine": 131
      },
      "guards": []
    },
    {
      "target": "p.life",
      "operator": "=",
      "value": "Math.min(maxLifeOf(state,p)!,p.life+amount)",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:healLife",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 136,
        "endLine": 136
      },
      "guards": []
    },
    {
      "target": "p.life",
      "operator": "=",
      "value": "remaining",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:damageLife",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 147,
        "endLine": 147
      },
      "guards": []
    },
    {
      "target": "p.paused",
      "operator": "=",
      "value": "'dead'",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:damageLife",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 149,
        "endLine": 149
      },
      "guards": [
        "p.life===0 && !p.paused"
      ]
    },
    {
      "target": "p.done",
      "operator": "=",
      "value": "true",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:damageLife",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 149,
        "endLine": 149
      },
      "guards": [
        "p.life===0 && !p.paused"
      ]
    },
    {
      "target": "p.eventOffer",
      "operator": "=",
      "value": "null",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:damageLife",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 149,
        "endLine": 149
      },
      "guards": [
        "p.life===0 && !p.paused"
      ]
    },
    {
      "target": "p.pulseShards",
      "operator": "=",
      "value": "Math.min(p.pulseShards,PULSE_RULES.bankCap)",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:mendWithShards",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 173,
        "endLine": 173
      },
      "guards": [
        "p.pulseShards!==undefined"
      ]
    },
    {
      "target": "p.pulseShards",
      "operator": "=",
      "value": "(p.pulseShards??0)+gained",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:gainShards",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 177,
        "endLine": 177
      },
      "guards": []
    },
    {
      "target": "p.notes",
      "operator": "=",
      "value": "p.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:gainShards",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 181,
        "endLine": 181
      },
      "guards": []
    },
    {
      "target": "p.inventory",
      "operator": "=",
      "value": "p.inventory.filter(id => id !== itemId)",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:retire",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 192,
        "endLine": 192
      },
      "guards": []
    },
    {
      "target": "state.items[item.copy.sourceId]!.copyConsumed",
      "operator": "=",
      "value": "true",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:retire",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 193,
        "endLine": 193
      },
      "guards": [
        "item.copy"
      ]
    },
    {
      "target": "item.owner",
      "operator": "=",
      "value": "'removed'",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:retire",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 194,
        "endLine": 194
      },
      "guards": []
    },
    {
      "target": "state.listings",
      "operator": "=",
      "value": "state.listings.filter(l => l.itemId !== itemId)",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:retire",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 194,
        "endLine": 194
      },
      "guards": []
    },
    {
      "target": "p.statuses",
      "operator": "=",
      "value": "p.statuses.filter(s => s.id !== 'D09' || s.targetItemId !== itemId)",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:retire",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 195,
        "endLine": 195
      },
      "guards": []
    },
    {
      "target": "p.knowledge[itemId]",
      "operator": "=",
      "value": "{...p.knowledge[itemId],...knowledge}",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:learn",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 212,
        "endLine": 212
      },
      "guards": []
    },
    {
      "target": "p.merchantActionsUsed",
      "operator": "??=",
      "value": "[]",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:inspect",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 233,
        "endLine": 233
      },
      "guards": [
        "merchantFree"
      ]
    },
    {
      "target": "p.passiveUses",
      "operator": "??=",
      "value": "{}",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:inspect",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 234,
        "endLine": 234
      },
      "guards": [
        "NOT merchantFree",
        "free"
      ]
    },
    {
      "target": "p.passiveUses[property]",
      "operator": "=",
      "value": "(p.passiveUses[property]??0)+1",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:inspect",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 234,
        "endLine": 234
      },
      "guards": [
        "NOT merchantFree",
        "free"
      ]
    },
    {
      "target": "p.inspections",
      "operator": "++",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:inspect",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 239,
        "endLine": 239
      },
      "guards": [
        "!merchantFree"
      ]
    },
    {
      "target": "p.merchantActionsUsed",
      "operator": "??=",
      "value": "[]",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:appraise",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 270,
        "endLine": 270
      },
      "guards": [
        "merchantFree"
      ]
    },
    {
      "target": "p.counters",
      "operator": "++",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:appraise",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 271,
        "endLine": 271
      },
      "guards": [
        "counter"
      ]
    },
    {
      "target": "p.acceptedDanger",
      "operator": "||=",
      "value": "item.npc === 'darkone' && acceptDanger",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:appraise",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 272,
        "endLine": 272
      },
      "guards": []
    },
    {
      "target": "p.inflated",
      "operator": "=",
      "value": "true",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:appraise",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 282,
        "endLine": 282
      },
      "guards": [
        "overChance>0 && randomAt(state.seed,`${state.encounter}:${p.id}:${itemId}:overvalue:${counter?p.counters:0}`)<overChance",
        "NOT status(p,'B21')"
      ]
    },
    {
      "target": "p.accuracyBonus",
      "operator": "+=",
      "value": "5",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:appraise",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 286,
        "endLine": 286
      },
      "guards": [
        "accuracy && !previous?.accuracy"
      ]
    },
    {
      "target": "p.accuracyBonus",
      "operator": "-=",
      "value": "5",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:appraise",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 287,
        "endLine": 287
      },
      "guards": [
        "!accuracy && previous?.accuracy"
      ]
    },
    {
      "target": "p.valuations[itemId]",
      "operator": "=",
      "value": "{value,accuracy,caught,accepted}",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:appraise",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 288,
        "endLine": 288
      },
      "guards": []
    },
    {
      "target": "item.lastAppraisal",
      "operator": "=",
      "value": "value",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:appraise",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 289,
        "endLine": 289
      },
      "guards": []
    },
    {
      "target": "item.lastAccepted",
      "operator": "=",
      "value": "accepted",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:appraise",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 289,
        "endLine": 289
      },
      "guards": []
    },
    {
      "target": "item.appraisedBy",
      "operator": "=",
      "value": "p.id",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:appraise",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 290,
        "endLine": 290
      },
      "guards": [
        "state.config.commerce"
      ]
    },
    {
      "target": "trust[item.npc]",
      "operator": "=",
      "value": "trust[item.npc]!-lost",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:appraise",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 295,
        "endLine": 295
      },
      "guards": [
        "caught",
        "trust && (trust[item.npc]??0)>0"
      ]
    },
    {
      "target": "p.notes",
      "operator": "=",
      "value": "p.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:appraise",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 297,
        "endLine": 297
      },
      "guards": []
    },
    {
      "target": "p.honorJob",
      "operator": "=",
      "value": "false",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:appraise",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 299,
        "endLine": 299
      },
      "guards": []
    },
    {
      "target": "p.honestyReward",
      "operator": "=",
      "value": "null",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:appraise",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 300,
        "endLine": 300
      },
      "guards": []
    },
    {
      "target": "p.caught",
      "operator": "||=",
      "value": "caught",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:appraise",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 302,
        "endLine": 302
      },
      "guards": []
    },
    {
      "target": "item.commissionPaid",
      "operator": "=",
      "value": "true",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:completeAppraisedSale",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 310,
        "endLine": 310
      },
      "guards": []
    },
    {
      "target": "appraiser.notes",
      "operator": "=",
      "value": "appraiser.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:completeAppraisedSale",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 318,
        "endLine": 318
      },
      "guards": []
    },
    {
      "target": "buyer.notes",
      "operator": "=",
      "value": "buyer.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:payRebate",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 326,
        "endLine": 326
      },
      "guards": [
        "paid"
      ]
    },
    {
      "target": "buyer.notes",
      "operator": "=",
      "value": "buyer.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:inheritKnowledge",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 341,
        "endLine": 341
      },
      "guards": []
    },
    {
      "target": "buyer.buyLog",
      "operator": "=",
      "value": "log",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:noteRepeatBuy",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 350,
        "endLine": 350
      },
      "guards": [
        "log.length<TRUST_RULES.repeatBuys || log.some(entry=>entry!==npc)"
      ]
    },
    {
      "target": "buyer.notes",
      "operator": "=",
      "value": "buyer.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:noteRepeatBuy",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 353,
        "endLine": 353
      },
      "guards": []
    },
    {
      "target": "buyer.scraps",
      "operator": "=",
      "value": "(buyer.scraps??0)+others",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:noteScrap",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 361,
        "endLine": 361
      },
      "guards": []
    },
    {
      "target": "buyer.scraps",
      "operator": "-=",
      "value": "CORE2.scrap.need",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:noteScrap",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 363,
        "endLine": 363
      },
      "guards": []
    },
    {
      "target": "buyer.scrapPaid",
      "operator": "=",
      "value": "(buyer.scrapPaid??0)+1",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:noteScrap",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 363,
        "endLine": 363
      },
      "guards": []
    },
    {
      "target": "buyer.notes",
      "operator": "=",
      "value": "buyer.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:noteScrap",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 365,
        "endLine": 365
      },
      "guards": []
    },
    {
      "target": "buyer.scraps",
      "operator": "=",
      "value": "Math.min(buyer.scraps,CORE2.scrap.need-1)",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:noteScrap",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 368,
        "endLine": 368
      },
      "guards": [
        "(buyer.scrapPaid??0)>=CORE2.scrap.cap"
      ]
    },
    {
      "target": "buyer.notes",
      "operator": "=",
      "value": "buyer.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:noteScrap",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 369,
        "endLine": 369
      },
      "guards": [
        "NOT (buyer.scrapPaid??0)>=CORE2.scrap.cap"
      ]
    },
    {
      "target": "buyer.paid",
      "operator": "=",
      "value": "{...buyer.paid,[item.id]:share}",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:purchase",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 411,
        "endLine": 411
      },
      "guards": []
    },
    {
      "target": "item.owner",
      "operator": "=",
      "value": "buyer.id",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:purchase",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 412,
        "endLine": 412
      },
      "guards": []
    },
    {
      "target": "shop.stock",
      "operator": "=",
      "value": "shop.stock.filter(id => id !== item.id)",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:purchase",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 412,
        "endLine": 412
      },
      "guards": []
    },
    {
      "target": "state.listings",
      "operator": "=",
      "value": "state.listings.filter(l => l.itemId !== item.id)",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:purchase",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 413,
        "endLine": 413
      },
      "guards": []
    },
    {
      "target": "p.pilotGuard",
      "operator": "=",
      "value": "{encounter:state.encounter,amount:Math.max(amount,p.pilotGuard?.encounter===state.encounter?p.pilotGuard.amount:0)}",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 434,
        "endLine": 434
      },
      "guards": [
        "works",
        "spec.nativeEffect==='effect:E62'",
        "amount>0"
      ]
    },
    {
      "target": "p.abilityReady![otherNpc!]",
      "operator": "=",
      "value": "Math.round((p.abilityReady![otherNpc!]!+reduced)*100)/100",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 441,
        "endLine": 441
      },
      "guards": [
        "works",
        "NOT spec.nativeEffect==='effect:E62'",
        "state.config.trustAbilities && (ABILITY_ITEM_IDS as readonly string[]).includes(item.kind)",
        "item.kind==='chrono-gear' || item.kind==='burden-hourglass'",
        "item.kind==='burden-hourglass'"
      ]
    },
    {
      "target": "p.abilityItemUsed",
      "operator": "??=",
      "value": "[]",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 444,
        "endLine": 444
      },
      "guards": [
        "works",
        "NOT spec.nativeEffect==='effect:E62'",
        "state.config.trustAbilities && (ABILITY_ITEM_IDS as readonly string[]).includes(item.kind)"
      ]
    },
    {
      "target": "p.itemUseKinds",
      "operator": "??=",
      "value": "[]",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 468,
        "endLine": 468
      },
      "guards": [
        "works",
        "bonus",
        "power>previous"
      ]
    },
    {
      "target": "p.itemUseStrength",
      "operator": "??=",
      "value": "{}",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 469,
        "endLine": 469
      },
      "guards": [
        "works",
        "bonus",
        "power>previous",
        "state.config.trustAbilities||state.config.rarityEconomy"
      ]
    },
    {
      "target": "p.itemUseStrength[item.kind]",
      "operator": "=",
      "value": "power",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 469,
        "endLine": 469
      },
      "guards": [
        "works",
        "bonus",
        "power>previous",
        "state.config.trustAbilities||state.config.rarityEconomy"
      ]
    },
    {
      "target": "p.itemUseBonuses",
      "operator": "??=",
      "value": "{}",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 470,
        "endLine": 470
      },
      "guards": [
        "works",
        "bonus",
        "power>previous"
      ]
    },
    {
      "target": "p.itemUseBonuses[key]",
      "operator": "=",
      "value": "(p.itemUseBonuses[key]??0)+bonus.amount*(power-previous)",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 470,
        "endLine": 470
      },
      "guards": [
        "works",
        "bonus",
        "power>previous"
      ]
    },
    {
      "target": "item.preserved",
      "operator": "=",
      "value": "true",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 476,
        "endLine": 476
      },
      "guards": [
        "spec.consumable",
        "p.preserveItemId===item.id && !item.copy && !item.preserved"
      ]
    },
    {
      "target": "state.items[item.copy.sourceId]!.copyConsumed",
      "operator": "=",
      "value": "true",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 477,
        "endLine": 477
      },
      "guards": [
        "spec.consumable",
        "NOT p.preserveItemId===item.id && !item.copy && !item.preserved",
        "item.copy"
      ]
    },
    {
      "target": "p.notes",
      "operator": "=",
      "value": "p.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 483,
        "endLine": 483
      },
      "guards": [
        "state.config.curseSight"
      ]
    },
    {
      "target": "p.energy",
      "operator": "=",
      "value": "Math.max(0,p.energy-2)",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:kill",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 506,
        "endLine": 506
      },
      "guards": [
        "status(p,'B08')"
      ]
    },
    {
      "target": "p.paused",
      "operator": "=",
      "value": "'dead'",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:kill",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 508,
        "endLine": 508
      },
      "guards": [
        "NOT status(p,'B08')",
        "NOT state.config.survival"
      ]
    },
    {
      "target": "p.done",
      "operator": "=",
      "value": "true",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:kill",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 508,
        "endLine": 508
      },
      "guards": [
        "NOT status(p,'B08')",
        "NOT state.config.survival"
      ]
    },
    {
      "target": "p.eventOffer",
      "operator": "=",
      "value": "null",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:kill",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 508,
        "endLine": 508
      },
      "guards": [
        "NOT status(p,'B08')",
        "NOT state.config.survival"
      ]
    },
    {
      "target": "state.market.budget",
      "operator": "-=",
      "value": "reserved",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:marketSell",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 543,
        "endLine": 543
      },
      "guards": []
    },
    {
      "target": "p.notes",
      "operator": "=",
      "value": "p.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:marketSell",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 551,
        "endLine": 551
      },
      "guards": [
        "contract || gearBonus"
      ]
    },
    {
      "target": "item.owner",
      "operator": "=",
      "value": "'dark-market'",
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:marketSell",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 554,
        "endLine": 554
      },
      "guards": [
        "state.config.brokerage"
      ]
    },
    {
      "target": "item.genuine",
      "operator": "=",
      "value": "source.genuine",
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:makeCandidate",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 46,
        "endLine": 46
      },
      "guards": [
        "source"
      ]
    },
    {
      "target": "item.cursed",
      "operator": "=",
      "value": "source.cursed",
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:makeCandidate",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 46,
        "endLine": 46
      },
      "guards": [
        "source"
      ]
    },
    {
      "target": "item.base",
      "operator": "--",
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:makeCandidate",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 48,
        "endLine": 48
      },
      "guards": [
        "source"
      ]
    },
    {
      "target": "item.ask",
      "operator": "=",
      "value": "Math.min(item.ask,source.ask)",
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:makeCandidate",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 49,
        "endLine": 49
      },
      "guards": [
        "source"
      ]
    },
    {
      "target": "state.items[id]",
      "operator": "=",
      "value": "item",
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:makeCandidate",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 51,
        "endLine": 51
      },
      "guards": []
    },
    {
      "target": "state.items[id]!.owner",
      "operator": "=",
      "value": "'retired'",
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:retireChoices",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 54,
        "endLine": 54
      },
      "guards": [
        "id!==keep && state.items[id]?.owner===`ability-choice:${p.id}`"
      ]
    },
    {
      "target": "chosen.owner",
      "operator": "=",
      "value": "p.id",
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:settleAbilityChoice",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 64,
        "endLine": 64
      },
      "guards": [
        "choice.npc==='alien'"
      ]
    },
    {
      "target": "source.owner",
      "operator": "=",
      "value": "'retired'",
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:settleAbilityChoice",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 70,
        "endLine": 70
      },
      "guards": [
        "NOT choice.npc==='alien'",
        "choiceId!==source.id"
      ]
    },
    {
      "target": "chosen.owner",
      "operator": "=",
      "value": "`npc:${p.id}:${state.encounter}`",
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:settleAbilityChoice",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 70,
        "endLine": 70
      },
      "guards": [
        "NOT choice.npc==='alien'",
        "choiceId!==source.id"
      ]
    },
    {
      "target": "p.stock",
      "operator": "=",
      "value": "p.stock.map(id=>id===source.id?chosen.id:id)",
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:settleAbilityChoice",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 70,
        "endLine": 70
      },
      "guards": [
        "NOT choice.npc==='alien'",
        "choiceId!==source.id"
      ]
    },
    {
      "target": "portal.stock",
      "operator": "=",
      "value": "portal.stock.map(id=>id===source.id?chosen.id:id)",
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:settleAbilityChoice",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 71,
        "endLine": 71
      },
      "guards": [
        "NOT choice.npc==='alien'",
        "choiceId!==source.id",
        "portal"
      ]
    },
    {
      "target": "state.listings",
      "operator": "=",
      "value": "state.listings.filter(l=>l.itemId!==source.id)",
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:settleAbilityChoice",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 72,
        "endLine": 72
      },
      "guards": [
        "NOT choice.npc==='alien'",
        "choiceId!==source.id"
      ]
    },
    {
      "target": "p.orcDeal",
      "operator": "=",
      "value": "{itemId:item.id,percent:[10,15,20][tier]!,encounter:state.encounter}",
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:useMerchantAbility",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 89,
        "endLine": 89
      },
      "guards": []
    },
    {
      "target": "p.preserveItemId",
      "operator": "=",
      "value": "item.id",
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:useMerchantAbility",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 91,
        "endLine": 91
      },
      "guards": []
    },
    {
      "target": "item.cursed",
      "operator": "=",
      "value": "false",
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:useMerchantAbility",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 93,
        "endLine": 93
      },
      "guards": []
    },
    {
      "target": "seat.knowledge[item.id]!.cursed",
      "operator": "=",
      "value": "false",
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:useMerchantAbility",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 93,
        "endLine": 93
      },
      "guards": [
        "seat.knowledge[item.id]?.cursed!==undefined"
      ]
    },
    {
      "target": "state.publicKnowledge[item.id]!.cursed",
      "operator": "=",
      "value": "false",
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:useMerchantAbility",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 93,
        "endLine": 93
      },
      "guards": [
        "state.publicKnowledge[item.id]?.cursed!==undefined"
      ]
    },
    {
      "target": "state.items[id]",
      "operator": "=",
      "value": "copy",
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:useMerchantAbility",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 100,
        "endLine": 100
      },
      "guards": []
    },
    {
      "target": "p.abilityChoice",
      "operator": "=",
      "value": "{npc,sourceId:source.id,itemIds}",
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:useMerchantAbility",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 109,
        "endLine": 109
      },
      "guards": []
    },
    {
      "target": "state.listings",
      "operator": "=",
      "value": "state.listings.filter(l=>l.itemId!==source.id)",
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:useMerchantAbility",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 110,
        "endLine": 110
      },
      "guards": [
        "npc==='alien'"
      ]
    },
    {
      "target": "offer.status",
      "operator": "=",
      "value": "'rejected'",
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:useMerchantAbility",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 110,
        "endLine": 110
      },
      "guards": [
        "npc==='alien'",
        "offer.status==='open' && (offer.itemId===source.id||offer.swapItemId===source.id)"
      ]
    },
    {
      "target": "p.abilityReady",
      "operator": "??=",
      "value": "{}",
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:useMerchantAbility",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 114,
        "endLine": 114
      },
      "guards": []
    },
    {
      "target": "p.abilityLastUsed",
      "operator": "??=",
      "value": "{}",
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:useMerchantAbility",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 114,
        "endLine": 114
      },
      "guards": []
    },
    {
      "target": "p.abilityAdjusted",
      "operator": "??=",
      "value": "{}",
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:useMerchantAbility",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 114,
        "endLine": 114
      },
      "guards": []
    },
    {
      "target": "p.abilityReady[npc]",
      "operator": "=",
      "value": "state.encounter+Math.max(1,MERCHANT_ABILITIES[npc].cooldown-haste+delay)",
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:useMerchantAbility",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 115,
        "endLine": 115
      },
      "guards": []
    },
    {
      "target": "p.abilityLastUsed[npc]",
      "operator": "=",
      "value": "state.encounter",
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:useMerchantAbility",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 116,
        "endLine": 116
      },
      "guards": []
    },
    {
      "target": "p.abilityAdjusted[npc]",
      "operator": "=",
      "value": "haste",
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:useMerchantAbility",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 116,
        "endLine": 116
      },
      "guards": []
    },
    {
      "target": "p.skillUsed",
      "operator": "=",
      "value": "true",
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:useMerchantAbility",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 116,
        "endLine": 116
      },
      "guards": []
    },
    {
      "target": "p.notes",
      "operator": "=",
      "value": "p.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:useMerchantAbility",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 118,
        "endLine": 118
      },
      "guards": []
    },
    {
      "target": "p.notes",
      "operator": "=",
      "value": "p.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:note",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 17,
        "endLine": 17
      },
      "guards": []
    },
    {
      "target": "terms.life",
      "operator": "=",
      "value": "2",
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:personalNpcOffer",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 41,
        "endLine": 41
      },
      "guards": [
        "id==='E109'"
      ]
    },
    {
      "target": "terms.loanMax",
      "operator": "=",
      "value": "Math.min(itemIds.length,1+Math.floor(randomAt(state.seed,`${key}:loan-size`)*3),Math.floor(freeBank(state)/8))",
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:personalNpcOffer",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 43,
        "endLine": 43
      },
      "guards": [
        "id==='E110'"
      ]
    },
    {
      "target": "terms[cost]",
      "operator": "=",
      "value": "cost==='credits'?Math.min(p.credits,2+Math.floor(randomAt(state.seed,`${key}:credits`)*4)):cost==='energy'?Math.min(p.energy,2):1",
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:personalNpcOffer",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 51,
        "endLine": 51
      },
      "guards": [
        "id==='E111'"
      ]
    },
    {
      "target": "terms.energy",
      "operator": "=",
      "value": "2",
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:personalNpcOffer",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 55,
        "endLine": 55
      },
      "guards": [
        "id==='E113'"
      ]
    },
    {
      "target": "terms.items",
      "operator": "=",
      "value": "1",
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:personalNpcOffer",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 56,
        "endLine": 56
      },
      "guards": [
        "id==='E114' || id==='E116'"
      ]
    },
    {
      "target": "terms.credits",
      "operator": "=",
      "value": "3",
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:personalNpcOffer",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 57,
        "endLine": 57
      },
      "guards": [
        "id==='E115'"
      ]
    },
    {
      "target": "(p.npcContracts??={}).vampire",
      "operator": "=",
      "value": "{signedAt:state.encounter,...(state.config.personalScoringRules===1?{performanceId:offer.key}:{})}",
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 95,
        "endLine": 95
      },
      "guards": []
    },
    {
      "target": "p.npcContracts",
      "operator": "??=",
      "value": "{}",
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 95,
        "endLine": 95
      },
      "guards": []
    },
    {
      "target": "p.inventory",
      "operator": "=",
      "value": "p.inventory.filter(itemId=>itemId!==id)",
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 101,
        "endLine": 101
      },
      "guards": []
    },
    {
      "target": "state.items[id]!.owner",
      "operator": "=",
      "value": "`alien-loan:${p.id}`",
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 101,
        "endLine": 101
      },
      "guards": []
    },
    {
      "target": "state.listings",
      "operator": "=",
      "value": "state.listings.filter(l=>!ids.includes(l.itemId))",
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 102,
        "endLine": 102
      },
      "guards": []
    },
    {
      "target": "state.reservedRewards",
      "operator": "+=",
      "value": "8*count",
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 103,
        "endLine": 103
      },
      "guards": []
    },
    {
      "target": "(p.npcContracts??={}).alien",
      "operator": "=",
      "value": "{lentAt:state.encounter,dueAt:state.encounter+2,itemIds:[...ids],key:offer.key,reservedCredits:8*count}",
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 103,
        "endLine": 103
      },
      "guards": []
    },
    {
      "target": "p.npcContracts",
      "operator": "??=",
      "value": "{}",
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 103,
        "endLine": 103
      },
      "guards": []
    },
    {
      "target": "state.items[id]!.owner",
      "operator": "=",
      "value": "p.id",
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:returnLoanItems",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 127,
        "endLine": 127
      },
      "guards": []
    },
    {
      "target": "state.reservedRewards",
      "operator": "-=",
      "value": "loan.reservedCredits",
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:returnLoanItems",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 128,
        "endLine": 128
      },
      "guards": []
    },
    {
      "target": "state.items[id]!.owner",
      "operator": "=",
      "value": "p.id",
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:redeemNpcContracts",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 140,
        "endLine": 140
      },
      "guards": [
        "npc==='vampire' && blood && state.encounter>blood.signedAt",
        "outcome==='item'"
      ]
    },
    {
      "target": "p.stock",
      "operator": "=",
      "value": "p.stock.filter(itemId=>itemId!==id)",
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:redeemNpcContracts",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 140,
        "endLine": 140
      },
      "guards": [
        "npc==='vampire' && blood && state.encounter>blood.signedAt",
        "outcome==='item'"
      ]
    },
    {
      "target": "p.vampireDiscount",
      "operator": "=",
      "value": "{encounter:state.encounter}",
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:redeemNpcContracts",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 141,
        "endLine": 141
      },
      "guards": [
        "npc==='vampire' && blood && state.encounter>blood.signedAt",
        "NOT outcome==='item'",
        "outcome==='discount'"
      ]
    },
    {
      "target": "result[effect.effect]",
      "operator": "+=",
      "value": "effect.amount*(itemEffects?itemEffectScale(item):rarityEffect(item))",
      "owner": "code:apps/comic/src/game/appraisal/passives.ts:heldPassives",
      "source": {
        "file": "apps/comic/src/game/appraisal/passives.ts",
        "line": 49,
        "endLine": 49
      },
      "guards": [
        "effect"
      ]
    },
    {
      "target": "result[key]",
      "operator": "=",
      "value": "integerEffect(result[key])",
      "owner": "code:apps/comic/src/game/appraisal/passives.ts:heldPassives",
      "source": {
        "file": "apps/comic/src/game/appraisal/passives.ts",
        "line": 51,
        "endLine": 51
      },
      "guards": [
        "!['commission','luck','acceptance','mitigation'].includes(key)"
      ]
    },
    {
      "target": "state.personalPerformance",
      "operator": "??=",
      "value": "{version:1,facts:[]}",
      "owner": "code:apps/comic/src/game/appraisal/personal-scoring.ts:recordPersonalFact",
      "source": {
        "file": "apps/comic/src/game/appraisal/personal-scoring.ts",
        "line": 152,
        "endLine": 152
      },
      "guards": []
    },
    {
      "target": "p.npcTrust[npc]",
      "operator": "=",
      "value": "next",
      "owner": "code:apps/comic/src/game/appraisal/personal-scoring.ts:setPersonalTrust",
      "source": {
        "file": "apps/comic/src/game/appraisal/personal-scoring.ts",
        "line": 183,
        "endLine": 183
      },
      "guards": []
    },
    {
      "target": "item.pilotUsedAt",
      "operator": "=",
      "value": "state.encounter",
      "owner": "code:apps/comic/src/game/appraisal/pilot-effects.ts:usePilot",
      "source": {
        "file": "apps/comic/src/game/appraisal/pilot-effects.ts",
        "line": 12,
        "endLine": 12
      },
      "guards": []
    },
    {
      "target": "item.pilotUses",
      "operator": "=",
      "value": "used+1",
      "owner": "code:apps/comic/src/game/appraisal/pilot-effects.ts:usePilot",
      "source": {
        "file": "apps/comic/src/game/appraisal/pilot-effects.ts",
        "line": 12,
        "endLine": 12
      },
      "guards": []
    },
    {
      "target": "item.priceIntegrity",
      "operator": "??=",
      "value": "{overpriced:false,audits:0}",
      "owner": "code:apps/comic/src/game/appraisal/price-integrity.ts:auditItemPrice",
      "source": {
        "file": "apps/comic/src/game/appraisal/price-integrity.ts",
        "line": 18,
        "endLine": 18
      },
      "guards": []
    },
    {
      "target": "integrity.audits",
      "operator": "++",
      "owner": "code:apps/comic/src/game/appraisal/price-integrity.ts:auditItemPrice",
      "source": {
        "file": "apps/comic/src/game/appraisal/price-integrity.ts",
        "line": 19,
        "endLine": 19
      },
      "guards": []
    },
    {
      "target": "integrity.overpriced",
      "operator": "=",
      "value": "true",
      "owner": "code:apps/comic/src/game/appraisal/price-integrity.ts:auditItemPrice",
      "source": {
        "file": "apps/comic/src/game/appraisal/price-integrity.ts",
        "line": 22,
        "endLine": 22
      },
      "guards": [
        "flagged"
      ]
    },
    {
      "target": "item.lastTradePrice",
      "operator": "=",
      "value": "paidPrice",
      "owner": "code:apps/comic/src/game/appraisal/price-integrity.ts:recordItemTrade",
      "source": {
        "file": "apps/comic/src/game/appraisal/price-integrity.ts",
        "line": 30,
        "endLine": 30
      },
      "guards": []
    },
    {
      "target": "item.priceIntegrity",
      "operator": "??=",
      "value": "{overpriced:false,audits:0}",
      "owner": "code:apps/comic/src/game/appraisal/price-integrity.ts:reappraiseOwnedItem",
      "source": {
        "file": "apps/comic/src/game/appraisal/price-integrity.ts",
        "line": 63,
        "endLine": 63
      },
      "guards": []
    },
    {
      "target": "integrity.lastReappraisedEncounter",
      "operator": "=",
      "value": "state.encounter",
      "owner": "code:apps/comic/src/game/appraisal/price-integrity.ts:reappraiseOwnedItem",
      "source": {
        "file": "apps/comic/src/game/appraisal/price-integrity.ts",
        "line": 64,
        "endLine": 64
      },
      "guards": []
    },
    {
      "target": "integrity.overpriced",
      "operator": "=",
      "value": "false",
      "owner": "code:apps/comic/src/game/appraisal/price-integrity.ts:reappraiseOwnedItem",
      "source": {
        "file": "apps/comic/src/game/appraisal/price-integrity.ts",
        "line": 69,
        "endLine": 69
      },
      "guards": [
        "success"
      ]
    },
    {
      "target": "integrity.certifiedPrice",
      "operator": "=",
      "value": "value",
      "owner": "code:apps/comic/src/game/appraisal/price-integrity.ts:reappraiseOwnedItem",
      "source": {
        "file": "apps/comic/src/game/appraisal/price-integrity.ts",
        "line": 69,
        "endLine": 69
      },
      "guards": [
        "success"
      ]
    },
    {
      "target": "item.lastAppraisal",
      "operator": "=",
      "value": "value",
      "owner": "code:apps/comic/src/game/appraisal/price-integrity.ts:reappraiseOwnedItem",
      "source": {
        "file": "apps/comic/src/game/appraisal/price-integrity.ts",
        "line": 70,
        "endLine": 70
      },
      "guards": [
        "success"
      ]
    },
    {
      "target": "item.lastAccepted",
      "operator": "=",
      "value": "true",
      "owner": "code:apps/comic/src/game/appraisal/price-integrity.ts:reappraiseOwnedItem",
      "source": {
        "file": "apps/comic/src/game/appraisal/price-integrity.ts",
        "line": 70,
        "endLine": 70
      },
      "guards": [
        "success"
      ]
    },
    {
      "target": "p.notes",
      "operator": "=",
      "value": "p.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/price-integrity.ts:reappraiseOwnedItem",
      "source": {
        "file": "apps/comic/src/game/appraisal/price-integrity.ts",
        "line": 73,
        "endLine": 73
      },
      "guards": []
    },
    {
      "target": "p.tradeLink",
      "operator": "=",
      "value": "{partner:partnerId,since:encounter}",
      "owner": "code:apps/comic/src/game/appraisal/pulse.ts:linkTrade",
      "source": {
        "file": "apps/comic/src/game/appraisal/pulse.ts",
        "line": 16,
        "endLine": 16
      },
      "guards": [
        "p.tradeLink?.partner!==partnerId"
      ]
    },
    {
      "target": "item.appearance",
      "operator": "=",
      "value": "rollAppearance(seed,state.config.rarity)",
      "owner": "code:apps/comic/src/game/appraisal/rarity.ts:ensureItemAppearance",
      "source": {
        "file": "apps/comic/src/game/appraisal/rarity.ts",
        "line": 13,
        "endLine": 13
      },
      "guards": [
        "state.config.rarity && !item.appearance"
      ]
    },
    {
      "target": "item.rarityPower",
      "operator": "=",
      "value": "rarityPowerFor(item.appearance.rarity,state.config.rarityEconomy)",
      "owner": "code:apps/comic/src/game/appraisal/rarity.ts:ensureItemAppearance",
      "source": {
        "file": "apps/comic/src/game/appraisal/rarity.ts",
        "line": 16,
        "endLine": 16
      },
      "guards": [
        "state.config.rarityEconomy && item.appearance && !item.rarityPower"
      ]
    },
    {
      "target": "item.base",
      "operator": "=",
      "value": "rarityValue(item,item.base)",
      "owner": "code:apps/comic/src/game/appraisal/rarity.ts:ensureItemAppearance",
      "source": {
        "file": "apps/comic/src/game/appraisal/rarity.ts",
        "line": 17,
        "endLine": 17
      },
      "guards": [
        "state.config.rarityEconomy && item.appearance && !item.rarityPower"
      ]
    },
    {
      "target": "item.ask",
      "operator": "=",
      "value": "rarityValue(item,item.ask)",
      "owner": "code:apps/comic/src/game/appraisal/rarity.ts:ensureItemAppearance",
      "source": {
        "file": "apps/comic/src/game/appraisal/rarity.ts",
        "line": 17,
        "endLine": 17
      },
      "guards": [
        "state.config.rarityEconomy && item.appearance && !item.rarityPower"
      ]
    },
    {
      "target": "item.reservation",
      "operator": "=",
      "value": "rarityValue(item,item.reservation)",
      "owner": "code:apps/comic/src/game/appraisal/rarity.ts:ensureItemAppearance",
      "source": {
        "file": "apps/comic/src/game/appraisal/rarity.ts",
        "line": 17,
        "endLine": 17
      },
      "guards": [
        "state.config.rarityEconomy && item.appearance && !item.rarityPower"
      ]
    },
    {
      "target": "p.roundReward",
      "operator": "=",
      "value": "{encounter:state.encounter,base,amount:base+income,flips:0,settled:false,...(passivesEnabled(state.config) || income!==b.income || luck?{incomeBonus:income,winBonus:5+b.coinWin,winChance:Math.max(15,Math.min(85,coinWinChance(b)+luck))}:{})}",
      "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:openRoundRewards",
      "source": {
        "file": "apps/comic/src/game/appraisal/round-rewards.ts",
        "line": 17,
        "endLine": 17
      },
      "guards": []
    },
    {
      "target": "p.credits",
      "operator": "-=",
      "value": "r.base",
      "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:raiseRoundReward",
      "source": {
        "file": "apps/comic/src/game/appraisal/round-rewards.ts",
        "line": 27,
        "endLine": 27
      },
      "guards": []
    },
    {
      "target": "r.amount",
      "operator": "+=",
      "value": "r.base",
      "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:raiseRoundReward",
      "source": {
        "file": "apps/comic/src/game/appraisal/round-rewards.ts",
        "line": 27,
        "endLine": 27
      },
      "guards": []
    },
    {
      "target": "r.staked",
      "operator": "=",
      "value": "(r.staked??0)+r.base",
      "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:raiseRoundReward",
      "source": {
        "file": "apps/comic/src/game/appraisal/round-rewards.ts",
        "line": 27,
        "endLine": 27
      },
      "guards": []
    },
    {
      "target": "r.coinCount",
      "operator": "=",
      "value": "coinCount",
      "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:raiseRoundReward",
      "source": {
        "file": "apps/comic/src/game/appraisal/round-rewards.ts",
        "line": 27,
        "endLine": 27
      },
      "guards": []
    },
    {
      "target": "r.net",
      "operator": "=",
      "value": "(r.net??0)+delta",
      "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:flipRoundReward",
      "source": {
        "file": "apps/comic/src/game/appraisal/round-rewards.ts",
        "line": 51,
        "endLine": 51
      },
      "guards": [
        "state.config.multiCoinRewards"
      ]
    },
    {
      "target": "r.amount",
      "operator": "=",
      "value": "amount",
      "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:flipRoundReward",
      "source": {
        "file": "apps/comic/src/game/appraisal/round-rewards.ts",
        "line": 51,
        "endLine": 51
      },
      "guards": [
        "state.config.multiCoinRewards"
      ]
    },
    {
      "target": "r.flips",
      "operator": "=",
      "value": "attempt",
      "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:flipRoundReward",
      "source": {
        "file": "apps/comic/src/game/appraisal/round-rewards.ts",
        "line": 51,
        "endLine": 51
      },
      "guards": [
        "state.config.multiCoinRewards"
      ]
    },
    {
      "target": "r.settled",
      "operator": "=",
      "value": "amount===0",
      "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:flipRoundReward",
      "source": {
        "file": "apps/comic/src/game/appraisal/round-rewards.ts",
        "line": 51,
        "endLine": 51
      },
      "guards": [
        "state.config.multiCoinRewards"
      ]
    },
    {
      "target": "r.lastFlip",
      "operator": "=",
      "value": "{...coins[0]!,correct,coins,delta}",
      "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:flipRoundReward",
      "source": {
        "file": "apps/comic/src/game/appraisal/round-rewards.ts",
        "line": 52,
        "endLine": 52
      },
      "guards": [
        "state.config.multiCoinRewards"
      ]
    },
    {
      "target": "r.flips",
      "operator": "=",
      "value": "attempt",
      "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:flipRoundReward",
      "source": {
        "file": "apps/comic/src/game/appraisal/round-rewards.ts",
        "line": 60,
        "endLine": 60
      },
      "guards": []
    },
    {
      "target": "r.lastFlip",
      "operator": "=",
      "value": "{guess,side,correct}",
      "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:flipRoundReward",
      "source": {
        "file": "apps/comic/src/game/appraisal/round-rewards.ts",
        "line": 60,
        "endLine": 60
      },
      "guards": []
    },
    {
      "target": "r.amount",
      "operator": "=",
      "value": "correct?r.amount+(r.winBonus??5):0",
      "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:flipRoundReward",
      "source": {
        "file": "apps/comic/src/game/appraisal/round-rewards.ts",
        "line": 61,
        "endLine": 61
      },
      "guards": []
    },
    {
      "target": "r.settled",
      "operator": "=",
      "value": "!correct",
      "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:flipRoundReward",
      "source": {
        "file": "apps/comic/src/game/appraisal/round-rewards.ts",
        "line": 61,
        "endLine": 61
      },
      "guards": []
    },
    {
      "target": "p.credits",
      "operator": "+=",
      "value": "r.amount",
      "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:bankRoundReward",
      "source": {
        "file": "apps/comic/src/game/appraisal/round-rewards.ts",
        "line": 68,
        "endLine": 68
      },
      "guards": []
    },
    {
      "target": "r.settled",
      "operator": "=",
      "value": "true",
      "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:bankRoundReward",
      "source": {
        "file": "apps/comic/src/game/appraisal/round-rewards.ts",
        "line": 68,
        "endLine": 68
      },
      "guards": []
    },
    {
      "target": "(state as SealState).sinnerSeals",
      "operator": "??=",
      "value": "[]",
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:seals",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 50,
        "endLine": 50
      },
      "guards": []
    },
    {
      "target": "(state as SealState).sealOffers",
      "operator": "??=",
      "value": "[]",
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:offers",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 51,
        "endLine": 51
      },
      "guards": []
    },
    {
      "target": "(state as SealState).sealRedemptions",
      "operator": "??=",
      "value": "[]",
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:redemptions",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 52,
        "endLine": 52
      },
      "guards": []
    },
    {
      "target": "from.inventory",
      "operator": "=",
      "value": "from.inventory.filter(id => id !== item.id)",
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:moveGoods",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 71,
        "endLine": 71
      },
      "guards": []
    },
    {
      "target": "item.owner",
      "operator": "=",
      "value": "to.id",
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:moveGoods",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 73,
        "endLine": 73
      },
      "guards": []
    },
    {
      "target": "state.listings",
      "operator": "=",
      "value": "state.listings.filter(l => l.itemId !== item.id)",
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:moveGoods",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 74,
        "endLine": 74
      },
      "guards": []
    },
    {
      "target": "offer.status",
      "operator": "=",
      "value": "'declined'",
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:respondOffer",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 95,
        "endLine": 95
      },
      "guards": [
        "!accept"
      ]
    },
    {
      "target": "p.energy",
      "operator": "-=",
      "value": "offer.energy",
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:respondOffer",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 106,
        "endLine": 106
      },
      "guards": []
    },
    {
      "target": "holder.energy",
      "operator": "+=",
      "value": "offer.energy",
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:respondOffer",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 106,
        "endLine": 106
      },
      "guards": []
    },
    {
      "target": "offer.status",
      "operator": "=",
      "value": "'accepted'",
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:respondOffer",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 109,
        "endLine": 109
      },
      "guards": []
    },
    {
      "target": "(state as SealState).sinnerSeals",
      "operator": "=",
      "value": "seals(state).filter(s => s.id !== seal.id)",
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:respondOffer",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 112,
        "endLine": 112
      },
      "guards": [
        "seal.thiefId === p.id"
      ]
    },
    {
      "target": "seal.holderId",
      "operator": "=",
      "value": "p.id",
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:respondOffer",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 114,
        "endLine": 114
      },
      "guards": [
        "NOT seal.thiefId === p.id"
      ]
    },
    {
      "target": "slot.gone",
      "operator": "=",
      "value": "true",
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:pick",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 148,
        "endLine": 148
      },
      "guards": [
        "!item || !eligibleItems(state,thief).includes(item.id)"
      ]
    },
    {
      "target": "redemption.status",
      "operator": "=",
      "value": "'cancelled'",
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:pick",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 149,
        "endLine": 149
      },
      "guards": [
        "!item || !eligibleItems(state,thief).includes(item.id)",
        "redemption.slots.every(s => s.gone)"
      ]
    },
    {
      "target": "item.stolen",
      "operator": "=",
      "value": "true",
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:pick",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 154,
        "endLine": 154
      },
      "guards": []
    },
    {
      "target": "(state as SealState).sinnerSeals",
      "operator": "=",
      "value": "seals(state).filter(s => !redemption.sealIds.includes(s.id))",
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:pick",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 155,
        "endLine": 155
      },
      "guards": []
    },
    {
      "target": "redemption.status",
      "operator": "=",
      "value": "'done'",
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:pick",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 156,
        "endLine": 156
      },
      "guards": []
    },
    {
      "target": "offer.status",
      "operator": "=",
      "value": "'cancelled'",
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:handleSealAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 168,
        "endLine": 168
      },
      "guards": []
    },
    {
      "target": "offer.status",
      "operator": "=",
      "value": "'cancelled'",
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:closeSealOffers",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 177,
        "endLine": 177
      },
      "guards": [
        "offer.status === 'open'"
      ]
    },
    {
      "target": "r.status",
      "operator": "=",
      "value": "'cancelled'",
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:closeSealOffers",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 178,
        "endLine": 178
      },
      "guards": [
        "r.status === 'open'"
      ]
    },
    {
      "target": "p.inventory",
      "operator": "=",
      "value": "p.inventory.filter(id=>id!==item.id)",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:removeFromHand",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 55,
        "endLine": 55
      },
      "guards": []
    },
    {
      "target": "item.owner",
      "operator": "=",
      "value": "owner",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:removeFromHand",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 55,
        "endLine": 55
      },
      "guards": []
    },
    {
      "target": "state.listings",
      "operator": "=",
      "value": "state.listings.filter(listing=>listing.itemId!==item.id)",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:removeFromHand",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 56,
        "endLine": 56
      },
      "guards": []
    },
    {
      "target": "vault.items",
      "operator": "=",
      "value": "vault.items.filter(id=>id!==action.itemId)",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleStorageAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 87,
        "endLine": 87
      },
      "guards": []
    },
    {
      "target": "state.items[action.itemId]!.owner",
      "operator": "=",
      "value": "p.id",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleStorageAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 88,
        "endLine": 88
      },
      "guards": []
    },
    {
      "target": "p.credits",
      "operator": "-=",
      "value": "action.amount",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleStorageAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 92,
        "endLine": 92
      },
      "guards": []
    },
    {
      "target": "vault.credits",
      "operator": "+=",
      "value": "action.amount",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleStorageAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 92,
        "endLine": 92
      },
      "guards": []
    },
    {
      "target": "vault.credits",
      "operator": "-=",
      "value": "action.amount",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleStorageAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 97,
        "endLine": 97
      },
      "guards": []
    },
    {
      "target": "p.credits",
      "operator": "+=",
      "value": "action.amount",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleStorageAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 97,
        "endLine": 97
      },
      "guards": []
    },
    {
      "target": "vault.interest.principal",
      "operator": "=",
      "value": "Math.min(vault.interest.principal,vault.credits)",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleStorageAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 98,
        "endLine": 98
      },
      "guards": [
        "state.config.vaultInterestRules===1 && vault.interest"
      ]
    },
    {
      "target": "vault.slots",
      "operator": "++",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleStorageAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 103,
        "endLine": 103
      },
      "guards": []
    },
    {
      "target": "p.personalVault",
      "operator": "=",
      "value": "vault",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleStorageAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 106,
        "endLine": 106
      },
      "guards": []
    },
    {
      "target": "item.owner",
      "operator": "=",
      "value": "owner.id",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:returnCollateral",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 129,
        "endLine": 129
      },
      "guards": []
    },
    {
      "target": "state.loans",
      "operator": "??=",
      "value": "[]",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleLoanAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 140,
        "endLine": 140
      },
      "guards": [
        "action.type==='loan-propose'"
      ]
    },
    {
      "target": "loan.principal",
      "operator": "=",
      "value": "action.principal",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleLoanAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 149,
        "endLine": 149
      },
      "guards": [
        "action.type==='loan-counter'"
      ]
    },
    {
      "target": "loan.terms",
      "operator": "=",
      "value": "terms",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleLoanAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 149,
        "endLine": 149
      },
      "guards": [
        "action.type==='loan-counter'"
      ]
    },
    {
      "target": "loan.status",
      "operator": "=",
      "value": "'countered'",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleLoanAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 149,
        "endLine": 149
      },
      "guards": [
        "action.type==='loan-counter'"
      ]
    },
    {
      "target": "loan.status",
      "operator": "=",
      "value": "'cancelled'",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleLoanAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 151,
        "endLine": 151
      },
      "guards": [
        "NOT action.type==='loan-counter'",
        "action.type==='loan-cancel'"
      ]
    },
    {
      "target": "loan.settledAt",
      "operator": "=",
      "value": "state.encounter",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleLoanAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 151,
        "endLine": 151
      },
      "guards": [
        "NOT action.type==='loan-counter'",
        "action.type==='loan-cancel'"
      ]
    },
    {
      "target": "loan.status",
      "operator": "=",
      "value": "'cancelled'",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleLoanAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 155,
        "endLine": 155
      },
      "guards": [
        "NOT action.type==='loan-counter'",
        "NOT action.type==='loan-cancel'",
        "action.type==='loan-respond'",
        "!action.accept"
      ]
    },
    {
      "target": "loan.settledAt",
      "operator": "=",
      "value": "state.encounter",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleLoanAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 155,
        "endLine": 155
      },
      "guards": [
        "NOT action.type==='loan-counter'",
        "NOT action.type==='loan-cancel'",
        "action.type==='loan-respond'",
        "!action.accept"
      ]
    },
    {
      "target": "loan.status",
      "operator": "=",
      "value": "'active'",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleLoanAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 166,
        "endLine": 166
      },
      "guards": [
        "NOT action.type==='loan-counter'",
        "NOT action.type==='loan-cancel'",
        "action.type==='loan-respond'",
        "NOT !action.accept"
      ]
    },
    {
      "target": "loan.fundedAt",
      "operator": "=",
      "value": "state.encounter",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleLoanAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 166,
        "endLine": 166
      },
      "guards": [
        "NOT action.type==='loan-counter'",
        "NOT action.type==='loan-cancel'",
        "action.type==='loan-respond'",
        "NOT !action.accept"
      ]
    },
    {
      "target": "loan.firstPayoutAt",
      "operator": "=",
      "value": "first",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleLoanAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 166,
        "endLine": 166
      },
      "guards": [
        "NOT action.type==='loan-counter'",
        "NOT action.type==='loan-cancel'",
        "action.type==='loan-respond'",
        "NOT !action.accept"
      ]
    },
    {
      "target": "loan.dueAt",
      "operator": "=",
      "value": "dueAt",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleLoanAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 166,
        "endLine": 166
      },
      "guards": [
        "NOT action.type==='loan-counter'",
        "NOT action.type==='loan-cancel'",
        "action.type==='loan-respond'",
        "NOT !action.accept"
      ]
    },
    {
      "target": "loan.repaid",
      "operator": "+=",
      "value": "action.amount",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleLoanAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 174,
        "endLine": 174
      },
      "guards": [
        "NOT action.type==='loan-counter'",
        "NOT action.type==='loan-cancel'",
        "NOT action.type==='loan-respond'",
        "action.type==='loan-repay'"
      ]
    },
    {
      "target": "loan.status",
      "operator": "=",
      "value": "'repaid'",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleLoanAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 176,
        "endLine": 176
      },
      "guards": [
        "NOT action.type==='loan-counter'",
        "NOT action.type==='loan-cancel'",
        "NOT action.type==='loan-respond'",
        "action.type==='loan-repay'",
        "loan.repaid===loan.principal"
      ]
    },
    {
      "target": "loan.settledAt",
      "operator": "=",
      "value": "state.encounter",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleLoanAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 176,
        "endLine": 176
      },
      "guards": [
        "NOT action.type==='loan-counter'",
        "NOT action.type==='loan-cancel'",
        "NOT action.type==='loan-respond'",
        "action.type==='loan-repay'",
        "loan.repaid===loan.principal"
      ]
    },
    {
      "target": "loan.status",
      "operator": "=",
      "value": "'foreclosed'",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:settleLoansBeforeAdvance",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 195,
        "endLine": 195
      },
      "guards": [
        "loan.status==='active' && (final || state.phase==='REVEAL' && state.encounter>=loan.dueAt)"
      ]
    },
    {
      "target": "loan.settledAt",
      "operator": "=",
      "value": "state.encounter",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:settleLoansBeforeAdvance",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 195,
        "endLine": 195
      },
      "guards": [
        "loan.status==='active' && (final || state.phase==='REVEAL' && state.encounter>=loan.dueAt)"
      ]
    },
    {
      "target": "loan.status",
      "operator": "=",
      "value": "'cancelled'",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:settleLoansBeforeAdvance",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 198,
        "endLine": 198
      },
      "guards": [
        "NOT loan.status==='active' && (final || state.phase==='REVEAL' && state.encounter>=loan.dueAt)",
        "(loan.status==='proposed' || loan.status==='countered') && (final || dead || lender.paused==='dead' || lender.life===0)"
      ]
    },
    {
      "target": "loan.settledAt",
      "operator": "=",
      "value": "state.encounter",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:settleLoansBeforeAdvance",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 198,
        "endLine": 198
      },
      "guards": [
        "NOT loan.status==='active' && (final || state.phase==='REVEAL' && state.encounter>=loan.dueAt)",
        "(loan.status==='proposed' || loan.status==='countered') && (final || dead || lender.paused==='dead' || lender.life===0)"
      ]
    },
    {
      "target": "vault.interest",
      "operator": "=",
      "value": "{principal:vault.credits,encounter:state.encounter,...(state.config.catalogVersion===4?{rings:heldInterestRings(state,p)}:{})}",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:payVaultInterest",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 215,
        "endLine": 215
      },
      "guards": [
        "state.config.vaultInterestRules===1"
      ]
    },
    {
      "target": "state.phase",
      "operator": "=",
      "value": "'REVEAL'",
      "owner": "code:apps/comic/src/game/appraisal/survival.ts:collectRun",
      "source": {
        "file": "apps/comic/src/game/appraisal/survival.ts",
        "line": 21,
        "endLine": 21
      },
      "guards": [
        "state.config.secureEconomy",
        "NOT state.config.loanEndSettlement"
      ]
    },
    {
      "target": "state.items[item.id]!.owner",
      "operator": "=",
      "value": "'collector'",
      "owner": "code:apps/comic/src/game/appraisal/survival.ts:collectRun",
      "source": {
        "file": "apps/comic/src/game/appraisal/survival.ts",
        "line": 31,
        "endLine": 31
      },
      "guards": [
        "!state.items[item.id]!.owner.startsWith('collateral:')"
      ]
    },
    {
      "target": "p.personalVault.items",
      "operator": "=",
      "value": "[]",
      "owner": "code:apps/comic/src/game/appraisal/survival.ts:collectRun",
      "source": {
        "file": "apps/comic/src/game/appraisal/survival.ts",
        "line": 32,
        "endLine": 32
      },
      "guards": [
        "p.personalVault"
      ]
    },
    {
      "target": "p.inventory",
      "operator": "=",
      "value": "[]",
      "owner": "code:apps/comic/src/game/appraisal/survival.ts:collectRun",
      "source": {
        "file": "apps/comic/src/game/appraisal/survival.ts",
        "line": 33,
        "endLine": 33
      },
      "guards": []
    },
    {
      "target": "p.score",
      "operator": "=",
      "value": "score",
      "owner": "code:apps/comic/src/game/appraisal/survival.ts:collectRun",
      "source": {
        "file": "apps/comic/src/game/appraisal/survival.ts",
        "line": 33,
        "endLine": 33
      },
      "guards": []
    },
    {
      "target": "g.available",
      "operator": "=",
      "value": "false",
      "owner": "code:apps/comic/src/game/appraisal/survival.ts:collectRun",
      "source": {
        "file": "apps/comic/src/game/appraisal/survival.ts",
        "line": 37,
        "endLine": 37
      },
      "guards": []
    },
    {
      "target": "j.status",
      "operator": "=",
      "value": "'cancelled'",
      "owner": "code:apps/comic/src/game/appraisal/survival.ts:collectRun",
      "source": {
        "file": "apps/comic/src/game/appraisal/survival.ts",
        "line": 37,
        "endLine": 37
      },
      "guards": [
        "j.status==='offered'||j.status==='accepted'"
      ]
    },
    {
      "target": "state.collector",
      "operator": "=",
      "value": "results",
      "owner": "code:apps/comic/src/game/appraisal/survival.ts:collectRun",
      "source": {
        "file": "apps/comic/src/game/appraisal/survival.ts",
        "line": 38,
        "endLine": 38
      },
      "guards": []
    },
    {
      "target": "state.listings",
      "operator": "=",
      "value": "[]",
      "owner": "code:apps/comic/src/game/appraisal/survival.ts:collectRun",
      "source": {
        "file": "apps/comic/src/game/appraisal/survival.ts",
        "line": 38,
        "endLine": 38
      },
      "guards": []
    },
    {
      "target": "state.phase",
      "operator": "=",
      "value": "'RESULTS'",
      "owner": "code:apps/comic/src/game/appraisal/survival.ts:collectRun",
      "source": {
        "file": "apps/comic/src/game/appraisal/survival.ts",
        "line": 38,
        "endLine": 38
      },
      "guards": []
    },
    {
      "target": "p.notes",
      "operator": "=",
      "value": "p.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:note",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 105,
        "endLine": 105
      },
      "guards": []
    },
    {
      "target": "p.stealTried",
      "operator": "??=",
      "value": "[]",
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:startTheftDuel",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 150,
        "endLine": 150
      },
      "guards": []
    },
    {
      "target": "(state as TheftState).theftDuels",
      "operator": "??=",
      "value": "[]",
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:startTheftDuel",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 153,
        "endLine": 153
      },
      "guards": []
    },
    {
      "target": "duel.swordIds",
      "operator": "=",
      "value": "{}",
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:startTheftDuel",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 160,
        "endLine": 160
      },
      "guards": [
        "state.config.catalogVersion===4"
      ]
    },
    {
      "target": "duel.swordIds[seat.id]",
      "operator": "=",
      "value": "sword.id",
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:startTheftDuel",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 160,
        "endLine": 160
      },
      "guards": [
        "state.config.catalogVersion===4",
        "sword"
      ]
    },
    {
      "target": "duel.hands.npc",
      "operator": "=",
      "value": "npcHand(state,duel)",
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:startTheftDuel",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 161,
        "endLine": 161
      },
      "guards": [
        "!victim"
      ]
    },
    {
      "target": "duel.status",
      "operator": "=",
      "value": "'cancelled'",
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:cancelTheftDuels",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 182,
        "endLine": 182
      },
      "guards": [
        "duel.status === 'open' && !stillEligible(state,duel)"
      ]
    },
    {
      "target": "duel.hands",
      "operator": "=",
      "value": "{}",
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:cancelTheftDuels",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 182,
        "endLine": 182
      },
      "guards": [
        "duel.status === 'open' && !stillEligible(state,duel)"
      ]
    },
    {
      "target": "duel.status",
      "operator": "=",
      "value": "'cancelled'",
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:expireTheftDuel",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 202,
        "endLine": 202
      },
      "guards": []
    },
    {
      "target": "duel.hands",
      "operator": "=",
      "value": "{}",
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:expireTheftDuel",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 202,
        "endLine": 202
      },
      "guards": []
    },
    {
      "target": "((thief as Thief).pvpBlocks ??= {})[victimId]",
      "operator": "=",
      "value": "state.encounter+PVP_COOLDOWN_ENCOUNTERS",
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:playerFailure",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 213,
        "endLine": 213
      },
      "guards": []
    },
    {
      "target": "(thief as Thief).pvpBlocks",
      "operator": "??=",
      "value": "{}",
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:playerFailure",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 213,
        "endLine": 213
      },
      "guards": []
    },
    {
      "target": "(state as TheftState).sinnerSeals",
      "operator": "??=",
      "value": "[]",
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:playerFailure",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 214,
        "endLine": 214
      },
      "guards": []
    },
    {
      "target": "(state as TheftState).compensations",
      "operator": "??=",
      "value": "[]",
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:playerFailure",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 219,
        "endLine": 219
      },
      "guards": [
        "amount > 0"
      ]
    },
    {
      "target": "(p.npcTrust ??= {})[npc]",
      "operator": "=",
      "value": "Math.max(0,(p.npcTrust[npc] ?? 0)-2)",
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:merchantFailure",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 244,
        "endLine": 244
      },
      "guards": []
    },
    {
      "target": "p.npcTrust",
      "operator": "??=",
      "value": "{}",
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:merchantFailure",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 244,
        "endLine": 244
      },
      "guards": []
    },
    {
      "target": "(p as Thief).crime",
      "operator": "=",
      "value": "{\n    failures: (previous?.failures ?? 0)+1,\n    banStartsEncounter: previous && previous.banUntilEncounter >= state.encounter ? previous.banStartsEncounter : state.encounter+1,\n    banUntilEncounter: Math.max(previous?.banUntilEncounter ?? state.encounter,state.encounter)+1,\n    cases: [...(previous?.cases ?? []),{itemId:duel.itemId,ask:duel.ask,npc}],\n  }",
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:merchantFailure",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 246,
        "endLine": 251
      },
      "guards": []
    },
    {
      "target": "duel.status",
      "operator": "=",
      "value": "'cancelled'",
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:chooseTheftHand",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 261,
        "endLine": 261
      },
      "guards": [
        "!stillEligible(state,duel)"
      ]
    },
    {
      "target": "duel.hands",
      "operator": "=",
      "value": "{}",
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:chooseTheftHand",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 261,
        "endLine": 261
      },
      "guards": [
        "!stillEligible(state,duel)"
      ]
    },
    {
      "target": "duel.hands[p.id]",
      "operator": "=",
      "value": "hand",
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:chooseTheftHand",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 263,
        "endLine": 263
      },
      "guards": []
    },
    {
      "target": "duel.hands",
      "operator": "=",
      "value": "{}",
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:chooseTheftHand",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 268,
        "endLine": 268
      },
      "guards": []
    },
    {
      "target": "duel.round",
      "operator": "++",
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:chooseTheftHand",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 276,
        "endLine": 276
      },
      "guards": [
        "thiefHand === opponentHand",
        "edge === 0"
      ]
    },
    {
      "target": "duel.hands.npc",
      "operator": "=",
      "value": "npcHand(state,duel)",
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:chooseTheftHand",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 277,
        "endLine": 277
      },
      "guards": [
        "thiefHand === opponentHand",
        "edge === 0",
        "!duel.victimId"
      ]
    },
    {
      "target": "duel.status",
      "operator": "=",
      "value": "won ? 'won' : 'lost'",
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:chooseTheftHand",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 282,
        "endLine": 282
      },
      "guards": []
    },
    {
      "target": "victim.inventory",
      "operator": "=",
      "value": "victim.inventory.filter(id => id !== item.id)",
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:chooseTheftHand",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 287,
        "endLine": 287
      },
      "guards": [
        "won",
        "duel.victimId"
      ]
    },
    {
      "target": "thief.stock",
      "operator": "=",
      "value": "thief.stock.filter(id => id !== item.id)",
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:chooseTheftHand",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 290,
        "endLine": 290
      },
      "guards": [
        "won",
        "NOT duel.victimId"
      ]
    },
    {
      "target": "item.owner",
      "operator": "=",
      "value": "thief.id",
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:chooseTheftHand",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 291,
        "endLine": 291
      },
      "guards": [
        "won"
      ]
    },
    {
      "target": "item.stolen",
      "operator": "=",
      "value": "true",
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:chooseTheftHand",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 293,
        "endLine": 293
      },
      "guards": [
        "won"
      ]
    },
    {
      "target": "state.listings",
      "operator": "=",
      "value": "state.listings.filter(l => l.itemId !== item.id)",
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:chooseTheftHand",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 296,
        "endLine": 296
      },
      "guards": [
        "won"
      ]
    },
    {
      "target": "p.wishes![npc]",
      "operator": "=",
      "value": "{...pick,...performance}",
      "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:applyWish",
      "source": {
        "file": "apps/comic/src/game/appraisal/wishlist.ts",
        "line": 41,
        "endLine": 41
      },
      "guards": [
        "!contractOn(state)"
      ]
    },
    {
      "target": "p.wishes![npc]",
      "operator": "=",
      "value": "{...pick,set:state.encounter,...performance}",
      "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:applyWish",
      "source": {
        "file": "apps/comic/src/game/appraisal/wishlist.ts",
        "line": 48,
        "endLine": 48
      },
      "guards": []
    },
    {
      "target": "p.wishRolls",
      "operator": "=",
      "value": "rolls",
      "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:wishNew",
      "source": {
        "file": "apps/comic/src/game/appraisal/wishlist.ts",
        "line": 56,
        "endLine": 56
      },
      "guards": []
    },
    {
      "target": "p.notes",
      "operator": "=",
      "value": "p.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:wishNew",
      "source": {
        "file": "apps/comic/src/game/appraisal/wishlist.ts",
        "line": 57,
        "endLine": 57
      },
      "guards": []
    },
    {
      "target": "p.wishTried",
      "operator": "=",
      "value": "true",
      "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:wishSell",
      "source": {
        "file": "apps/comic/src/game/appraisal/wishlist.ts",
        "line": 95,
        "endLine": 95
      },
      "guards": []
    },
    {
      "target": "p.notes",
      "operator": "=",
      "value": "p.notes.slice(-30)",
      "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:wishSell",
      "source": {
        "file": "apps/comic/src/game/appraisal/wishlist.ts",
        "line": 110,
        "endLine": 110
      },
      "guards": []
    },
    {
      "target": "this.durations",
      "operator": "=",
      "value": "{ ...APPRAISAL_PHASE_MS, ...durations }",
      "owner": null,
      "source": {
        "file": "apps/comic/src/server/appraisal-rooms.ts",
        "line": 26,
        "endLine": 26
      },
      "guards": []
    },
    {
      "target": "room.game",
      "operator": "=",
      "value": "applyAppraisalAction(previous, { type: 'theft-expire', duelId: duel.id, playerId: duel.thiefId, requestId: `duel_${room.matchId}_${duel.id}_${duel.round}`, encounter: previous.encounter })",
      "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.sweep",
      "source": {
        "file": "apps/comic/src/server/appraisal-rooms.ts",
        "line": 43,
        "endLine": 43
      },
      "guards": []
    },
    {
      "target": "room.timing",
      "operator": "=",
      "value": "structuredClone(message.settings)",
      "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.matchMessage",
      "source": {
        "file": "apps/comic/src/server/appraisal-rooms.ts",
        "line": 80,
        "endLine": 80
      },
      "guards": []
    },
    {
      "target": "room.seats",
      "operator": "=",
      "value": "room.seats.filter(s=>s!==bot)",
      "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.matchMessage",
      "source": {
        "file": "apps/comic/src/server/appraisal-rooms.ts",
        "line": 91,
        "endLine": 91
      },
      "guards": []
    },
    {
      "target": "room.mode",
      "operator": "=",
      "value": "message.mode",
      "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.matchMessage",
      "source": {
        "file": "apps/comic/src/server/appraisal-rooms.ts",
        "line": 97,
        "endLine": 97
      },
      "guards": []
    },
    {
      "target": "room.game",
      "operator": "=",
      "value": "applyAppraisalAction(previous, { ...message.action, ...(startedAt===undefined?{}:{startedAt}), playerId: seat.id })",
      "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.matchMessage",
      "source": {
        "file": "apps/comic/src/server/appraisal-rooms.ts",
        "line": 116,
        "endLine": 116
      },
      "guards": []
    },
    {
      "target": "this.botSeq",
      "operator": "++",
      "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.afterChange",
      "source": {
        "file": "apps/comic/src/server/appraisal-rooms.ts",
        "line": 165,
        "endLine": 165
      },
      "guards": []
    },
    {
      "target": "room.game",
      "operator": "=",
      "value": "attempt(turn.body)",
      "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.afterChange",
      "source": {
        "file": "apps/comic/src/server/appraisal-rooms.ts",
        "line": 167,
        "endLine": 167
      },
      "guards": []
    },
    {
      "target": "room.game",
      "operator": "=",
      "value": "attempt({ type: 'done' })",
      "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.afterChange",
      "source": {
        "file": "apps/comic/src/server/appraisal-rooms.ts",
        "line": 168,
        "endLine": 168
      },
      "guards": []
    },
    {
      "target": "room.game",
      "operator": "=",
      "value": "applyAppraisalAction(previous, action)",
      "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.timeout",
      "source": {
        "file": "apps/comic/src/server/appraisal-rooms.ts",
        "line": 184,
        "endLine": 184
      },
      "guards": []
    },
    {
      "target": "room.lastActivity",
      "operator": "=",
      "value": "this.now()",
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.handle",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 87,
        "endLine": 87
      },
      "guards": []
    },
    {
      "target": "seat.ready",
      "operator": "=",
      "value": "control.ready",
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.handle",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 90,
        "endLine": 90
      },
      "guards": []
    },
    {
      "target": "room.playtestMode",
      "operator": "=",
      "value": "control.mode",
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.handle",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 92,
        "endLine": 92
      },
      "guards": []
    },
    {
      "target": "room.matchId",
      "operator": "=",
      "value": "randomBytes(8).toString('hex')",
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.handle",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 96,
        "endLine": 96
      },
      "guards": []
    },
    {
      "target": "room.matchSeats",
      "operator": "=",
      "value": "room.seats.map(s => ({ id: s.id, name: s.name }))",
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.handle",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 96,
        "endLine": 96
      },
      "guards": []
    },
    {
      "target": "room.game",
      "operator": "=",
      "value": "this.createGame(room.seats.map(s => s.id), randomBytes(32).toString('hex'), room)",
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.handle",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 97,
        "endLine": 97
      },
      "guards": []
    },
    {
      "target": "room.startedAt",
      "operator": "=",
      "value": "this.now()",
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.handle",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 98,
        "endLine": 98
      },
      "guards": []
    },
    {
      "target": "room.endedAt",
      "operator": "=",
      "value": "null",
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.handle",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 98,
        "endLine": 98
      },
      "guards": []
    },
    {
      "target": "room.phaseTimes",
      "operator": "=",
      "value": "[]",
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.handle",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 98,
        "endLine": 98
      },
      "guards": []
    },
    {
      "target": "room.timeouts",
      "operator": "=",
      "value": "[]",
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.handle",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 98,
        "endLine": 98
      },
      "guards": []
    },
    {
      "target": "room.game",
      "operator": "=",
      "value": "null",
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.handle",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 101,
        "endLine": 101
      },
      "guards": []
    },
    {
      "target": "room.matchId",
      "operator": "=",
      "value": "null",
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.handle",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 101,
        "endLine": 101
      },
      "guards": []
    },
    {
      "target": "room.deadline",
      "operator": "=",
      "value": "null",
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.handle",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 101,
        "endLine": 101
      },
      "guards": []
    },
    {
      "target": "room.seats",
      "operator": "=",
      "value": "room.seats.filter(s => s !== seat)",
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.handle",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 104,
        "endLine": 104
      },
      "guards": []
    },
    {
      "target": "room.hostId",
      "operator": "=",
      "value": "room.seats.find(s => !s.bot)!.id",
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.handle",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 105,
        "endLine": 105
      },
      "guards": [
        "NOT !room.seats.some(s => !s.bot)",
        "room.hostId === seat.id"
      ]
    },
    {
      "target": "room.seats",
      "operator": "=",
      "value": "room.seats.filter(s => s !== absent)",
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.handle",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 111,
        "endLine": 111
      },
      "guards": []
    },
    {
      "target": "seat.peer",
      "operator": "=",
      "value": "null",
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.disconnect",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 127,
        "endLine": 127
      },
      "guards": []
    },
    {
      "target": "seat.connected",
      "operator": "=",
      "value": "false",
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.disconnect",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 127,
        "endLine": 127
      },
      "guards": []
    },
    {
      "target": "seat.ready",
      "operator": "=",
      "value": "false",
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.disconnect",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 128,
        "endLine": 128
      },
      "guards": [
        "!room.game"
      ]
    },
    {
      "target": "room.hostId",
      "operator": "=",
      "value": "room.seats.find(s => s.connected && !s.bot)?.id ?? seat.id",
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.disconnect",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 129,
        "endLine": 129
      },
      "guards": [
        "room.hostId === seat.id"
      ]
    },
    {
      "target": "s.ready",
      "operator": "=",
      "value": "!!s.bot",
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.unready",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 146,
        "endLine": 146
      },
      "guards": []
    },
    {
      "target": "room.game",
      "operator": "=",
      "value": "this.advanceGame(previous)",
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.advance",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 155,
        "endLine": 155
      },
      "guards": []
    },
    {
      "target": "room.phaseStartedAt",
      "operator": "=",
      "value": "this.now()",
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.beginPhase",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 157,
        "endLine": 157
      },
      "guards": []
    },
    {
      "target": "room.deadline",
      "operator": "=",
      "value": "duration===null?null:room.phaseStartedAt+duration",
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.beginPhase",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 159,
        "endLine": 159
      },
      "guards": []
    },
    {
      "target": "room.endedAt",
      "operator": "=",
      "value": "this.now()",
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.beginPhase",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 160,
        "endLine": 160
      },
      "guards": [
        "room.game!.phase === 'RESULTS'"
      ]
    },
    {
      "target": "seat.peer",
      "operator": "=",
      "value": "peer",
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.attach",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 164,
        "endLine": 164
      },
      "guards": []
    },
    {
      "target": "seat.connected",
      "operator": "=",
      "value": "true",
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.attach",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 164,
        "endLine": 164
      },
      "guards": []
    },
    {
      "target": "room.lastActivity",
      "operator": "=",
      "value": "this.now()",
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.attach",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 164,
        "endLine": 164
      },
      "guards": []
    },
    {
      "target": "room.hostId",
      "operator": "=",
      "value": "seat.id",
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.attach",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 165,
        "endLine": 165
      },
      "guards": [
        "!room.seats.find(s => s.id === room.hostId)?.connected"
      ]
    },
    {
      "target": "routes[npc]",
      "operator": "=",
      "value": "(routes[npc]??0)+1",
      "owner": "code:apps/comic/src/simulation/appraisal.ts:runAppraisalScenarios",
      "source": {
        "file": "apps/comic/src/simulation/appraisal.ts",
        "line": 271,
        "endLine": 271
      },
      "guards": [
        "t.type==='portal-entered'"
      ]
    }
  ]
}
```