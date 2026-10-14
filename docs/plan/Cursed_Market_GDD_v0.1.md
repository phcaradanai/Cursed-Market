# CURSED MARKET — Game Design Brief v0.1

**Status:** Concept selected; rules are hypotheses to validate, not final production rules.  
**Project policy:** The only active game. Other game concepts are parked until this game's fun has been validated or deliberately rejected.  
**Design goal:** Make a compelling 2–4-player game from a small number of consequential choices, mostly static illustrations, and clear rules—not movement, large maps, combat, or heavy animation.

## 1. One-sentence pitch

A dark-fantasy auction game where merchants know the secrets of cursed relics, buyers can investigate only part of the truth, and a seller can stake real money on a carefully worded guarantee.

### The emotional loop

**Temptation → Doubt → Commitment → Reveal → Blame / Triumph → Rematch**.

Successful play should create stories about decisions made by people, not only random card reveals. The core challenge is to make claims, inspection, and bidding meaningful even without voice chat.

## 2. Audience and format

- **Players:** 2–4; design and playtest primarily for 3–4, while preserving functional 2-player play.
- **Mode:** Synchronous multiplayer through browser room codes; private information must remain private.
- **Session target:** 10–15 minutes (hypothesis, measure in tests).
- **Input:** Mouse / touch to select, inspect, and bid.
- **Art:** A handful of high-quality static illustrations; tiny UI transitions only when useful.
- **No elimination:** Everyone acts through the final round.
- **Initial platform:** Web; no account creation or matchmaking for the first online test.

## 3. Three mechanical pillars

1. **Information asymmetry:** The selling merchant knows both hidden properties of the relic; buyers see its family and an optional contractual claim.
2. **Costly credibility:** A seller can stake coins on exactly ONE property (genuine, or uncursed). A truthful guarantee protects credibility, while a carefully worded guarantee can also mislead buyers about the other property.
3. **Irreversible choice:** Buyers spend scarce inspection tokens and bid real scoring currency. Reveals happen only after bids lock.

## 4. First playable rules (working hypothesis)

### 4.1 Setup

- Every player begins with **15 coins** and **2 inspection tokens**.
- Every relic has a public **family** (Mask, Mirror, Key, or Clock) and two server-hidden boolean properties:
  - **Genuine** or **Counterfeit**.
  - **Cursed** or **Uncursed**.
- The two hidden properties are **independent**. A relic may be both genuine and cursed.
- Cards are drawn from a seeded pool with a tunable distribution; never let client art or card IDs leak hidden truth.

### 4.2 Card values at final score

| Properties | Relic score before demand bonus |
|---|---:|
| Genuine + Uncursed | +9 |
| Genuine + Cursed | +3 |
| Counterfeit + Uncursed | +1 |
| Counterfeit + Cursed | −5 |

Formula: `relicScore = (genuine ? 9 : 1) - (cursed ? 6 : 0)`.

At the start of every auction, one family becomes the **Demand of the Round**. The buyer scores **+3 additional points** if the purchased relic is both **genuine** and from the demanded family. This bonus is public before bidding and is applied only to that auction.

Coins are retained and each counts as **1 final point**. Thus a high purchase price is a real opportunity cost, not merely a temporary expense.

### 4.3 Turn order and number of auctions

- Seller rotates evenly; a seller **cannot bid** in their own auction.
- **2 players:** 8 auctions (4 each).
- **3 players:** 9 auctions (3 each).
- **4 players:** 12 auctions (3 each).
- These are provisional session lengths; shorten them if the game feels repetitive.

### 4.4 Each auction: four phases

**A. Prepare offer (seller only)**

1. The seller privately receives **two relics** and must choose **one** to offer; the other is discarded from this session.
2. The public sees the offered relic's illustration, name, family, and current demand bonus—**never** its genuine/cursed status.
3. The seller selects ONE offer mode:
   - **As-is**: no contractual guarantee and no stake.
   - **Certified Genuine**: place **2 coins** in escrow, claiming authenticity.
   - **Certified Uncursed**: place **2 coins** in escrow, claiming no curse.
4. Certification is an enforceable claim about precisely one property; it does not imply that the other property is safe.

**B. Investigate (potential buyers)**

1. Each buyer may pass, or spend **1 of their 2 match-long inspection tokens**.
2. An inspection privately reveals **one chosen attribute**: genuine/counterfeit OR cursed/uncursed.
3. Inspection results are private. Players may discuss or bluff using external voice chat, but voice chat is not required for rules to work.

**C. Sealed bids (potential buyers)**

1. All buyers submit a private whole-number bid from **0** to their available coins.
2. `0` means pass. Bids are locked; other bids are hidden until all commit.
3. The highest positive bid wins and pays that number of coins to the seller.
4. If no one bids, the item is discarded and the seller's escrow is returned.
5. Resolve tied highest bids with an auditable server-seeded random tiebreak (not client timing).

**D. Reveal and settle**

1. Reveal the relic's two true attributes, the bids, and winner.
2. Transfer the winning bid from buyer to seller; award the relic and any applicable demand bonus to its buyer.
3. If the seller made a **truthful certification**, return the **2 escrow coins** to the seller.
4. If the seller made a **false certification**, transfer the **2 escrow coins to the buyer**, and give the seller **−2 trust points** at final scoring.
5. Log the offer, inspections (private until end of game), bids, result, and contractual outcome in a deterministic event log.

### 4.5 Ending and winner

At the end, rank players by:

`finalScore = remainingCoins + sum(ownedRelicScores) + earnedDemandBonuses - 2 × falseCertificates`

Tie-breaker: most remaining coins; if still tied, shared victory.

No player is eliminated early. Negative final scores are possible and acceptable.

## 5. One concrete tension example

An offered **Mirror** is secretly **Genuine + Cursed**. The seller chooses **Certified Genuine**. That promise is true, but may cause a buyer to assume the mirror is safe. A buyer with one investigation token remaining must choose whether to test authenticity, test for curses, or save the token. If the winner paid 6 coins, the artifact itself is worth 3 points before any demand bonus: a poor purchase unless market demand makes it worthwhile. The seller does not lose escrow because the specific certification was truthful.

This is the core identity of Cursed Market: **a promise can be true yet misleading**.

## 6. MVP screen list

1. **Lobby:** Room code, 2–4 seats, ready states, start.
2. **Marketplace:** Current round/seller, demanded family, current public relic, player coin and investigation-token counts, seller's certification status.
3. **Seller private panel:** Pick one of two items; choose certification; preview escrow cost.
4. **Buyer private panel:** Optional one-attribute inspection, then hidden integer bid/pass.
5. **Reveal panel:** Winning bid, both hidden attributes, certification result, coin movement, points delta.
6. **Results:** Transparent scores, round history, and rematch.

Only one static background, four family illustrations, one card-back illustration, and simple icons are needed for the first playtest. Skip custom character animations.

## 7. MVP exclusions (hard scope fence)

Do **not** build these before the first human playtest:

- Animated player characters, world navigation, exploration maps, 3D scenes.
- Combat, equipment, upgrade trees, shops, rarity inventories, crafting.
- AI chat, AI merchants, quest or story generation.
- Accounts, persistent progression, ranked play, achievements, battle passes.
- More than four relic families or extensive card catalogues.
- In-app voice chat, complex emote systems, global matchmaking.
- Three other proposed game projects in parallel.

## 8. Initial technical architecture

- **Client:** React + TypeScript + Vite, responsive web UI, static image assets.
- **Rules:** Pure TypeScript domain module; no game calculations trusted from the client.
- **Server:** Small Node.js authoritative game server with WebSockets/Socket.IO and room-code joins.
- **State:** In-memory rooms for prototype; no database requirement initially.
- **Private information:** Project separate server-to-seller and server-to-buyer views. Never broadcast deck, hidden card properties, private inspections, or hidden bids before reveal.
- **Randomness:** Seeded server-side PRNG; record seed, decisions, and outcomes for reproducible balancing tests.
- **Validation:** Explicit state machine and unit tests for turns, escrow settlement, ties, scoring, and reconnect behavior.
- **Connectivity:** Reconnection into the same seat via a temporary opaque session token; handle disconnection with safe timeout/default actions.

### Suggested game phases

`LOBBY → SELLER_PREP → BUYER_INSPECTION → SEALED_BID → REVEAL → NEXT_AUCTION → RESULTS`

### Non-negotiable test cases

- No non-seller client receives the seller's hidden attributes before reveal.
- No player receives another player's inspection findings or unsubmitted bid.
- Winning bids cannot exceed available unescrowed coins; coins never go negative.
- Seller cannot participate in bidding in their own auction.
- False **Genuine** contract penalizes a counterfeit relic even when uncursed.
- True **Genuine** contract does NOT penalize a genuine-but-cursed relic.
- False **Uncursed** contract penalizes cursed relics even when genuine.
- Unsold lots return escrow; no buyer receives a relic.
- Every player gets equal seller rounds for 2, 3, and 4 players.
- Score breakdown is explainable and recalculable from event history.
- Simultaneous final bids settle once only (idempotency).

## 9. Fun-validation plan

### Stage A — Rules sanity (before polished UI)

Use a spreadsheet, index cards, or simple text UI to simulate auctions. Check that sellers can bluff, buyers can make informed choices, prices do not cluster at zero, and curses aren't always ignored.

### Stage B — First human multiplayer build

Implement the smallest networked version that keeps information private across two or more browsers. Use only placeholder images. Run several short sessions with actual players, ideally both 2-player and 3–4-player groups.

### Stage C — Iterate on evidence, not feature requests

Observe and record:

- Did someone voluntarily ask for a rematch?
- Was there at least one memorable reveal or surprising but understandable outcome?
- Did players inspect strategically or always inspect the same attribute?
- Were non-seller players engaged while waiting for bids?
- Did people buy anything, or did passing dominate?
- Did player skill/persuasion matter more than luck?
- Can people play without voice chat and still enjoy it?

**Red flags:** no bids, automatic identical decisions, runaway rich sellers, seller's extra information making deals trivial, frequent confusion about what a certification actually guarantees, and no reason to rematch.

Preliminary success signal—not statistical proof: Most test players understand the round flow and voluntarily play more than one match; social moments emerge without requiring extra content. Record the actual results rather than declaring success by intuition.

## 10. Suggested first implementation backlog

**Milestone 1: Deterministic rules kernel**

- Define `Relic`, `Player`, `Auction`, `GameState`, `Action`, and `Event` types.
- Create seeded decks and round demand.
- Implement phase transitions, validation, and scoring.
- Write tests for every rule/edge case in §8.
- Run simulation scenarios for coin economy and bid incentives.

**Milestone 2: Ugly-but-playable multiplayer**

- Create/join room, private seats, seller view, buyer view.
- Inspect/bid/settle flow, reconnection, and results screen.
- Add only the labels and feedback needed to prevent misunderstood actions.

**Milestone 3: Human playtest + single highest-impact adjustment**

- Collect short-session observations.
- Fix the largest source of boredom or unfairness.
- Do NOT add content or animation to compensate for a weak core loop.

**Milestone 4 (conditional only): Art and game feel**

- Commission/generate four cohesive relic-family illustrations.
- Add satisfying card reveal, coin transfer feedback, sound, accessibility, and mobile polish.
- Expand content only if replayability is already demonstrated.

## 11. Open questions that playtesting must decide

1. Is the game engaging at 2 players, or does it need 3–4 for stronger competing bids?
2. Does a seller's choice between two lots create useful strategy or make selling too easy?
3. Are contract escrow (2 coins) and liar penalty (−2 points) strong enough to make claims credible but not risk-free?
4. Are two inspections per game sufficient, and is one-bit investigation interesting rather than frustrating?
5. Are 8/9/12 auctions the right duration, or do rounds become repetitive?
6. Does revealing the true relic right away create stronger social moments than delayed revelation?

**Important:** These are design variables for tests. Do not present them as balanced, proven facts.

---

### Project decision log

- **2026-10-13:** Cursed Market chosen as first/only active game among four concepts.
- Prioritize real player fun and replayability over graphical complexity.
- Build with still illustrations and strong game logic; animation is optional feedback, not a production prerequisite.
- Do not advance to full production until the smallest multiplayer ruleset produces evidence of fun.
