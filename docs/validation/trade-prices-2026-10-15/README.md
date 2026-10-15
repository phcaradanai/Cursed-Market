# Appraisal prices during player trading

User request: show the prices of already-appraised goods during the player trading phase.

- Added the last assigned appraisal to inventory thumbnails/details, trade listings, offers, and swap goods. Zero is a valid appraisal; unappraised goods omit the row.
- NPC shelf price is labeled separately. A rejected appraisal retains its history and explains that the merchant uses the shelf price.
- Uses the existing public appraisal DTO; private true value, authenticity and curse inspection knowledge remain gated.
- New labels have English translations and use the existing facts/thumbnail presentation without new CSS or assets.

## Verification

`npm run build:server` and `npm run build:appraisal` passed. The focused regression command passed 79/79 tests:

```sh
node --test dist/tests/appraisal-trade-price.test.js dist/tests/appraisal-price-knowledge.test.js dist/tests/appraisal-i18n.test.js dist/tests/appraisal-client.test.js
```

The new four regression cases failed before implementation. Coverage includes rejected and zero appraisals, unappraised goods, both trading participants, swap prices, TRADE-only inventory labels, English labels, and private inspection data.

Browser captures in `.impeccable/review/trade-prices-2026-10-15/` use the compiled `GameTable` with shipping CSS, fonts and art in a temporary, explicitly labeled, read-only SSR fixture. Desktop 1440×900 Thai and mobile 390×844 Thai/English showed no horizontal overflow. English player names remain Thai because they are user-entered fixture names. These captures verify presentation; renderer tests verify the data cases.

The detector reported no findings for the changed component (`[]`). Existing unrelated i18n and room-mode edits were preserved.
