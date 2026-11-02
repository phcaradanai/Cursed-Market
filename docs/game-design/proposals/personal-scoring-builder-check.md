# Personal scoring v1 builder check — 2026-11-02

One fresh independent read-only builder check of rules/weights documents, no implementation, tests, source review or second fix review. User-confirmed direction/units were supplied. Reviewer asked3 important questions:

1. Is the package approved (weights/caps/anti-farm/leader replacement/modifier)? **Human decision pending.** Concrete rules and JSON are ready for review; do not implement before approval.
2. Does trust dedup mean tuple or independent dimensions? **Author clarified proposed tuple `(playerId,originId,merchantId)`**, not onegain per merchant regardless item. Different origins with same merchant remain eligible. Included in package for approval; no user approval falsely claimed.
3. Can dead players receive final rarity contribution? **Author proposes final custody evaluation for all including dead**, after loan settlement, matching the timing of final asset evaluation. Action-based performance receipts stop atdeath; final asset/rarity evaluation is separate. This is explicitly a new proposed rule to approve, not an inferred prior decision.

No other review was requested. Numeric tuning is not a builder blocker; approval and counter eligibility/timing matter. Previous best-path-only question is already answered/superseded and not reopened. Independent reviewer reported memory recall failure without diagnostic details; repository documents were its evidence. Root matching scoring recall works with known unreliable tag scoping; no claim all agents have working memory.
