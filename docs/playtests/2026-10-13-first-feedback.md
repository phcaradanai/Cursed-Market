# First human feedback — 2026-10-13

Source: user's direct report after trying the real game. The planned group was LAN with 3–4 people; actual participant count, completed auctions, individual ratings, audit JSON and voluntary rematch details have not been supplied.

The user reported: “หลังลองเล่นเกมจริง ยังไม่สนุก และเกมดูไร้ชีวิต” and requested more gambling and less boring repetition. In the first follow-up, the user identified the main weakness as “ตัดสินใจแบบเดิมทุกครั้ง”. No comparison game was named at that point.

This is negative qualitative evidence. It supports another core-loop experiment; it does not establish a measured failure rate, a dominant strategy, or the cause of every boring moment.

## First follow-up experiment: v0.2

Implement [v0.2 curse wagers](../plan/Curse_Wagers_v0.2.md), preserving the old rules and audit replay. Keep four relic families and provisional art. Test whether pot size, opponents' possible predictions and scarce inspections change decisions, whether non-buyers care about the reveal, and whether anyone requests another match voluntarily.

Collect one completed v0.2 audit and individual explanations. Record whether a player changed a wager because of the pot, seller's guarantee, inspection or opponents; also record repeated automatic choices and reasons to stop. A scheduled retest is not a voluntary rematch. Wagers and phase consolidation are changed together, so this first comparison cannot isolate their individual effects.

## Later feedback and current experiment: v0.3

The user later described the game as too predictable and compared it to Dealer's Life reduced to selling items. This is the user's comparison, not a verified equivalence between the games. The user explicitly requested a roguelike structure with RNG so routes differ between runs. No completed v0.2 human retest, individual ratings or voluntary rematch evidence has been supplied; do not assume the criticism followed a measured v0.2 session.

[Roguelike Run v0.3](../plan/Roguelike_Run_v0.3.md) now implements three markets per run, seeded branch choices with different probabilities/values/pot contributions, and two personal boon choices that change future purchases or wagering. Each new match resets resources and builds and uses a fresh secret seed. Finite profiles can repeat; the implementation does not guarantee that every run is unique or enjoyable.

The next human retest should ask whether a chosen route or boon changed an actual bid, inspection or wager. Record the market/auction and the player's reason, plus any repeated automatic choice. Let players choose a rematch before asking for ratings. Save each audit before starting another run. Source review and automated/network checks are complete; human fun and balance remain unverified. The user asked to stop image checks, so no new v0.3 browser or visual validation is claimed.
