# Normal-resource scoring baseline —2026-11-04

Current experiment only:40credits/6life/deadline15/pilot8/scoring1-facts2;32games,4predeclared seeds,2/4seats,4existing homogeneous bot policies. No numeric change or release-balance claim.

## Results

| Seats | Policy | Games | End encounter median[range] | Score median[range] | Assets median[range] | Performance median[range] |
|---|---|---|---|---|---|---|
| 2 | cautious | 4 | 6 [5–7] | 111 [87–139] | 66 [47–83] | 45 [40–71] |
| 2 | aggressive | 4 | 5 [4–8] | 251 [135–447] | 116 [53–255] | 109 [82–192] |
| 2 | collector | 4 | 7 [5–8] | 252 [165–500] | 126 [83–314] | 99 [80–186] |
| 2 | trader | 4 | 5 [5–7] | 294 [200–609] | 93 [63–322] | 204 [137–327] |
| 4 | cautious | 4 | 8 [5–8] | 116 [81–150] | 58 [35–78] | 57 [42–105] |
| 4 | aggressive | 4 | 7 [5–9] | 242 [46–563] | 99 [34–320] | 146 [6–243] |
| 4 | collector | 4 | 8 [6–8] | 136 [46–457] | 76 [40–249] | 62 [6–208] |
| 4 | trader | 4 | 8 [6–8] | 295 [80–676] | 88 [29–383] | 218 [42–306] |

## Actual coverage

| System | Commands | Games |
|---|---|---|
| vault | 0 | 0 |
| loans | 0 | 0 |
| forced-theft-RPS | 0 | 0 |
| spirit-work | 0 | 0 |
| collector-wishlist | 402 | 32 |
| merchant-ability | 409 | 32 |
| auction | 107 | 15 |

## Final score metric exposure

| Metric | Raw | Eligible | Points | Zero-point players /96 | Cap-bound players |
|---|---|---|---|---|---|
| bought | 1235 | 1086 | 1922 | 2 | 16 |
| soldQuantity | 935 | 824 | 3270 | 18 | 19 |
| soldGrossCredits | 14233 | 13481 | 1308 | 19 | 0 |
| trustGained | 580 | 580 | 1740 | 2 | 0 |
| inspection | 256 | 256 | 256 | 72 | 0 |
| accurateAppraisal | 599 | 599 | 1192 | 4 | 1 |
| npcContract | 10 | 10 | 40 | 86 | 0 |
| interest | 0 | 0 | 0 | 96 | 0 |
| loanRepaid | 0 | 0 | 0 | 96 | 0 |
| survived | 438 | 438 | 876 | 2 | 0 |
| lifeLost | 674 | 674 | 674 | 0 | 0 |
| theft | 0 | 0 | 0 | 96 | 0 |
| rarity | 492 | 492 | 612 | 45 | 0 |
| ghost | 0 | 0 | 0 | 96 | 0 |

## Findings / next experiments

- vault: no commands in this matrix; these policies do not establish coverage for this system.
- loans: no commands in this matrix; these policies do not establish coverage for this system.
- forced-theft-RPS: no commands in this matrix; these policies do not establish coverage for this system.
- spirit-work: no commands in this matrix; these policies do not establish coverage for this system.
- All8native kinds were bought, but purchases/held quantities do not establish benefit; some relevant action families were never used.
- Homogeneous seats per game: these results cannot rank policies by competitive win share.
- Only4seeds; descriptive ranges are not confidence intervals or approved release targets.
- The8second timeout was diagnostic wall sensitivity, not an asserted gameplay failure: same case passed under20seconds; initial20passed cases preserved, successful diagnostic reused,11remaining cases executed.
- Prior real two-App finance/Spirit route and forced-RPS socket proofs remain separate evidence; no missing-feature conclusion from these bots doing nothing.
- Next balance work needs deliberately eligible financial/theft/native-benefit public-view cases, not lower weights inferred from zero usage.
- All32 sealed audit gzip/raw hashes and configs checked; simulator strictly replays before every successful case returns; all96player records reconcile to canonical result groups and player-credit ledger.
- Replay any archived `.audit.json.gz` by decompressing and using `replayAppraisalAudit`; source/compiled inputs are pinned in report.json.

No screenshot baselines, game code, flags, art or item values changed. Native8mechanism proofs use500credit fixtures and are not these40credit outcomes.
