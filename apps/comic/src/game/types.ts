export const FAMILIES = ["Mask", "Mirror", "Key", "Clock"] as const;
export type Family = (typeof FAMILIES)[number];
export type Attribute = "genuine" | "cursed";
export type OfferMode = "as-is" | "genuine" | "uncursed";
export type Phase = "ROUTE_CHOICE" | "BOON_CHOICE" | "SELLER_PREP" | "BUYER_INSPECTION" | "SEALED_BID" | "REVEAL" | "RESULTS";

export interface RulesConfig {
  startingCoins: number;
  inspectionsPerPlayer: number;
  escrowCoins: number;
  falseCertificatePenalty: number;
  demandBonus: number;
  genuineProbability: number;
  cursedProbability: number;
  /** Experimental v0.2; omitted in v0.1 logs for replay compatibility. */
  curseWagers?: boolean;
  fastMarket?: boolean;
  /** Experimental v0.3: three branching markets and run-local builds. */
  rogueRun?: boolean;
}

export interface MarketNode {
  id: string;
  name: string;
  description: string;
  demand: Family;
  genuineProbability: number;
  cursedProbability: number;
  genuineValue: number;
  fakeValue: number;
  cursePenalty: number;
  demandBonus: number;
  ante: number;
}

export type BoonId = "curse-eater" | "authenticity" | "counterfeit" | "high-roller" | "lens" | "specialist";
export interface Boon {
  id: BoonId;
  name: string;
  description: string;
  family?: Family;
}

export interface RunState {
  stage: number;
  totalStages: number;
  path: MarketNode[];
  market: MarketNode | null;
  routeChoices: MarketNode[];
  votes: { playerId: string; nodeId: string | null }[];
  boonOffers: { playerId: string; options: Boon[] }[];
  boonPicks: { playerId: string; boonId: BoonId | null }[];
}

export interface PublicRelic {
  id: string;
  name: string;
  family: Family;
}

export interface Relic extends PublicRelic {
  genuine: boolean;
  cursed: boolean;
}

export interface OwnedRelic extends Relic {
  auctionNumber: number;
  demandBonus: number;
  /** Acquisition-time market/build value; later boons cannot reprice inventory. */
  settledScore?: number;
}

export interface Player {
  id: string;
  coins: number;
  inspectionTokens: number;
  falseCertificates: number;
  relics: OwnedRelic[];
  boons?: Boon[];
}

export interface Inspection {
  playerId: string;
  attribute: Attribute | null;
  value: boolean | null;
}

export interface CurseWager {
  cursed: boolean;
  stake: number;
}

export interface WagerResult extends CurseWager {
  playerId: string;
  correct: boolean;
  payout: number;
}

export interface Bid {
  playerId: string;
  amount: number;
  wager?: CurseWager;
}

export interface AuctionSetup {
  number: number;
  sellerId: string;
  demand: Family;
  candidates: [Relic, Relic];
}

export interface Auction extends AuctionSetup {
  offer: { relic: Relic; mode: OfferMode } | null;
  escrow: number;
  inspections: Inspection[];
  bids: Bid[];
}

export interface AuctionResult {
  auctionNumber: number;
  sellerId: string;
  demand: Family;
  relic: Relic;
  mode: OfferMode;
  bids: Bid[];
  winnerId: string | null;
  price: number;
  tiedPlayerIds: string[];
  tieIndex: number | null;
  certificate: "none" | "true" | "false" | "unsold";
  escrowReturned: number;
  compensation: number;
  trustPenalty: number;
  relicScore: number;
  demandBonus: number;
  wagers?: WagerResult[];
  potBefore?: number;
  potAfter?: number;
  marketId?: string;
  buildBonus?: number;
}

interface Request {
  requestId: string;
  playerId: string;
  auctionNumber: number;
}

export type Action = Request & (
  | { type: "offer"; relicId: string; mode: OfferMode }
  | { type: "inspect"; attribute: Attribute }
  | { type: "pass-inspection" }
  | { type: "bid"; amount: number; wager?: CurseWager }
  | { type: "vote-route"; nodeId: string | null }
  | { type: "choose-boon"; boonId: BoonId | null }
);

/** Internal audit events. Never broadcast this log during a match. */
export type Event =
  | { type: "game-created"; seed: string; playerIds: string[]; config: RulesConfig }
  | { type: "auction-started"; auctionNumber: number; sellerId: string; demand: Family }
  | { type: "action-accepted"; action: Action }
  | { type: "inspected"; auctionNumber: number; inspection: Inspection }
  | { type: "auction-settled"; result: AuctionResult }
  | { type: "game-ended" }
  | { type: "route-opened"; stage: number; auctionNumber: number }
  | { type: "route-selected"; stage: number; node: MarketNode; votes: { playerId: string; nodeId: string | null }[] }
  | { type: "boons-opened"; stage: number; auctionNumber: number };

/** Server-only state: seed, candidates, actions, inspections and bids are secrets. */
export interface GameState {
  seed: string;
  config: RulesConfig;
  phase: Phase;
  revision: number;
  players: Player[];
  setups: AuctionSetup[];
  auction: Auction;
  history: AuctionResult[];
  events: Event[];
  acceptedActions: Action[];
  jackpot: number;
  houseCoins: number;
  run?: RunState;
}

export interface Score {
  playerId: string;
  coins: number;
  relicPoints: number;
  demandPoints: number;
  trustPenalty: number;
  total: number;
}

export interface GameView {
  phase: Phase;
  revision: number;
  config: RulesConfig;
  totalAuctions: number;
  players: Player[];
  jackpot: number;
  run?: {
    stage: number;
    totalStages: number;
    path: MarketNode[];
    market: MarketNode | null;
    routeChoices: MarketNode[];
    voteReady: string[];
    boonReady: string[];
  };
  auction: {
    number: number;
    sellerId: string;
    demand: Family;
    offer: { relic: PublicRelic; mode: OfferMode } | null;
    escrow: number;
    inspectionReady: string[];
    bidReady: string[];
  };
  history: AuctionResult[];
  private: {
    playerId: string;
    candidates: [Relic, Relic] | null;
    inspection: Inspection | null;
    bid: Bid | null;
    routeVote?: { nodeId: string | null } | null;
    boonOptions?: Boon[];
    boonPick?: { boonId: BoonId | null } | null;
  };
  results: { scores: Score[]; winnerIds: string[]; seed: string; inspections: { auctionNumber: number; inspection: Inspection }[] } | null;
}
