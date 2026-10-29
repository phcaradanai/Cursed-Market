# S06 item-sale v02 verification — 2026-10-29

Scope: isolated comic build, ItemSalePanel/Share comic branch, public preview DTO only. No live multi-player transaction claimed. Removed sale-ui-proof.tsx from runtime source after proof. fixture.tsx is the retained temporary test harness; imports assume it is copied alongside ItemSalePanel for a controlled run, not shipped.

Browser observations:
- Unknown NPC item: sale and rebate disabled; facts all?. Changing seller genuine claim leaves known facts? unchanged.
- Appraised shop test: selected genuine=true,cursed=true,rebate3 => `{type:'share',itemId:'item-1-0-1-1',allow:true,purchase:true,claims:{genuine:true,cursed:true},rebate:3}`.
- Credits85 and rebate86 => sale disabled.
- Listed item withdraw => `{type:'share',itemId:'item-1-0-1-1',allow:false,purchase:false}`.
- Owned item: claim rows0; sale => share allowtrue/purchasetrue; show => allowtrue/purchasefalse; neither includes claims.
- Utility pause: with detail open, bag opens alone (`drawer-bag`), settings opens alone (`game-settings`), closing each restores detail.
- Width1024×800: frame24,60,976,640; two columns486 each. Width1920×800: frame220,60,1480,640; columns738 each. Width1440×722: frame24,60,1392,562; columns694 each. Assertions for zero panel overflow and equal columns passed. Inventory frame1440 equals detail.
- Final `npm run build:appraisal` passed114modules, existing bundle-size warning only.

Unverified: live peer transactions, every item certificate/overpriced combination, phone portrait layouts. No backend rules changed.
