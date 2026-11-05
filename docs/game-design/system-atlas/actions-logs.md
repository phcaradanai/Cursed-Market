# Actions, validation และ logs

แหล่งข้อมูลรวม dispatcher/union; declaration ไม่ยืนยันว่าใช้งานได้ทุก phase

```json
{
  "actions": [
    {
      "id": "collector-wish-request",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 387,
        "endLine": 387
      },
      "text": "case 'collector-wish-request':\ncase 'collector-wish-peek':\ncase 'collector-wish-buy':\ncase 'collector-wish-skip':\nhandleCollectorWishlist(state,p,action);\nbreak;",
      "guards": []
    },
    {
      "id": "collector-wish-peek",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 387,
        "endLine": 387
      },
      "text": "case 'collector-wish-request':\ncase 'collector-wish-peek':\ncase 'collector-wish-buy':\ncase 'collector-wish-skip':\nhandleCollectorWishlist(state,p,action);\nbreak;",
      "guards": []
    },
    {
      "id": "collector-wish-buy",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 387,
        "endLine": 387
      },
      "text": "case 'collector-wish-request':\ncase 'collector-wish-peek':\ncase 'collector-wish-buy':\ncase 'collector-wish-skip':\nhandleCollectorWishlist(state,p,action);\nbreak;",
      "guards": []
    },
    {
      "id": "collector-wish-skip",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 387,
        "endLine": 387
      },
      "text": "case 'collector-wish-request':\ncase 'collector-wish-peek':\ncase 'collector-wish-buy':\ncase 'collector-wish-skip':\nhandleCollectorWishlist(state,p,action);\nbreak;",
      "guards": []
    },
    {
      "id": "theft-start",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 388,
        "endLine": 388
      },
      "text": "case 'theft-start':\ncheck(state.config.secureEconomy && ['APPRAISAL','TRADE'].includes(state.phase) && !p.eventOffer,'phase','ตอบเหตุการณ์ก่อนขโมย');\nstartTheftDuel(state,p,action);\nbreak;",
      "guards": []
    },
    {
      "id": "reappraise-owned",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 389,
        "endLine": 389
      },
      "text": "case 'reappraise-owned':\ncheck(['APPRAISAL','TRADE'].includes(state.phase) && !p.eventOffer,'phase','ตอบเหตุการณ์ก่อนประเมินใหม่');\nreappraiseOwnedItem(state,p,action.itemId,action.value);\nbreak;",
      "guards": []
    },
    {
      "id": "liquidate",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 390,
        "endLine": 390
      },
      "text": "case 'liquidate':\ncheck(['APPRAISAL','TRADE'].includes(state.phase) && !p.eventOffer,'phase','ตอบเหตุการณ์ก่อนขายของ');\nliquidateOwnedItem(state,p,action.itemId);\nbreak;",
      "guards": []
    },
    {
      "id": "enter",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 391,
        "endLine": 398
      },
      "text": "case 'enter':\n{\n      check(state.phase==='PORTALS' && !p.eventOffer,'phase','เลือก event ก่อนเข้าประตู');\n      const portal=p.portals.find(v=>v.id===action.portalId && !v.disabled); check(portal,'portal','ประตูนี้เข้าไม่ได้');\n      remainingMeet(state,p,portal.npc);p.selectedPortalId=portal.id;p.stock=[...portal.stock];\n      for(let slot=2;slot<2+stockBonus(state,p).extra;slot++)p.stock.push(spawnStockItem(state,p.id,state.players.indexOf(p),state.encounter,p.portals.indexOf(portal),slot,portal.npc));\n      for(const id of p.stock)ensureItemAppearance(state,state.items[id]!);\n      redeemNpcContracts(state,p,portal.npc);p.done=true;trace(state,p,'portal-entered',{portalId:portal.id,npc:portal.npc});break;\n    }",
      "guards": []
    },
    {
      "id": "reroll-portal",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 399,
        "endLine": 399
      },
      "text": "case 'reroll-portal':\nrerollPortal(state,p,action.portalId);\nbreak;",
      "guards": []
    },
    {
      "id": "inspect",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 400,
        "endLine": 400
      },
      "text": "case 'inspect':\nnpcActionAllowed(state,p);\ninspect(state,p,action.itemId,action.property);\nbreak;",
      "guards": []
    },
    {
      "id": "appraise",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 401,
        "endLine": 404
      },
      "text": "case 'appraise':\ncase 'counter':\n{\n      npcActionAllowed(state,p);check(!p.caught,'npc-closed','NPC ที่จับได้แล้วไม่รับการประเมินใหม่');\n      const caught=appraise(state,p,action.itemId,action.value,action.type==='counter',action.acceptDanger===true); drawBacklashEvent(state,p);if(caught && !p.eventOffer) drawEvent(state,p,true);break;\n    }",
      "guards": []
    },
    {
      "id": "counter",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 401,
        "endLine": 404
      },
      "text": "case 'appraise':\ncase 'counter':\n{\n      npcActionAllowed(state,p);check(!p.caught,'npc-closed','NPC ที่จับได้แล้วไม่รับการประเมินใหม่');\n      const caught=appraise(state,p,action.itemId,action.value,action.type==='counter',action.acceptDanger===true); drawBacklashEvent(state,p);if(caught && !p.eventOffer) drawEvent(state,p,true);break;\n    }",
      "guards": []
    },
    {
      "id": "buy",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 405,
        "endLine": 405
      },
      "text": "case 'buy':\nnpcActionAllowed(state,p);\npurchase(state,p,p,action.itemIds,{condition:action.condition});\nbreak;",
      "guards": []
    },
    {
      "id": "activate",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 406,
        "endLine": 406
      },
      "text": "case 'activate':\ncheck(['APPRAISAL','TRADE'].includes(state.phase) && !p.eventOffer,'phase','resolve event ก่อนเปิดใช้');\nactivate(state,p,action.itemId,action.npc,action.otherNpc);\nbreak;",
      "guards": []
    },
    {
      "id": "recover-resource",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 407,
        "endLine": 417
      },
      "text": "case 'recover-resource':\n{\n      npcActionAllowed(state,p);check(!merchantTradeBanned(state,p),'merchant-banned','พ่อค้าทั้งหมดระงับการค้าชั่วคราว');const offer=recoveryOffer(state,p);\n      check(offer && offer.target===action.target,'recovery','พ่อค้านี้ไม่มีดีลฟื้นที่เลือกหรือใช้สิทธิ์แล้ว');\n      check(state.config.recoveryQuoteRules!==1||action.quoteId===offer.quoteId,'stale-recovery-quote','ข้อเสนอฟื้นทรัพยากรเปลี่ยนแล้ว กรุณาตรวจข้อเสนอใหม่');\n      check(offer.target==='life'?p.life!<maxLifeOf(state,p)!:p.energy<maxEnergyOf(state,p),'recovery','ทรัพยากรนี้เต็มแล้ว');\n      spend(state,p,offer.credits,0,'recovery-deal');p.recoveryUsed=true;remainingUseRecovery(state,p,offer.nativeDiscount??0,offer.target);\n      const amount=recoveryAmount(state,p,offer);\n      if(offer.target==='life'){if(amount)healLife(state,p,amount,'recovery-deal');p.notes.push(`ดีลฟื้นชีวิต: จ่าย ${offer.credits} เครดิต ได้ฟื้น ${amount}`);p.notes=p.notes.slice(-30);}\n      else recover(state,p,amount,'recovery-deal');\n      break;\n    }",
      "guards": []
    },
    {
      "id": "steal",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 418,
        "endLine": 418
      },
      "text": "case 'steal':\ncheck(!state.config.secureEconomy,'rps-required','เลือกมือเป่ายิ้งฉุบเพื่อขโมย');\nnpcActionAllowed(state,p);\nstealShop(state,p,action.itemId);\ndrawTheftEvent(state,p);\nbreak;",
      "guards": []
    },
    {
      "id": "pickpocket",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 419,
        "endLine": 419
      },
      "text": "case 'pickpocket':\ncheck(!state.config.secureEconomy,'rps-required','เลือกมือเป่ายิ้งฉุบเพื่อขโมย');\ncheck(['APPRAISAL','TRADE'].includes(state.phase) && !p.eventOffer,'phase','resolve event ก่อน');\npickpocket(state,p,action.victimId);\ndrawTheftEvent(state,p);\nbreak;",
      "guards": []
    },
    {
      "id": "barter",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 420,
        "endLine": 420
      },
      "text": "case 'barter':\nnpcActionAllowed(state,p);\ncheck(!merchantTradeBanned(state,p),'merchant-banned','พ่อค้าทั้งหมดระงับการค้าชั่วคราว');\ncheck(state.config.core2,'action-type','ห้องนี้ไม่มีการแลกของ');\nbarter(state,p,action.itemId,action.targetItemId);\ndrawTheftEvent(state,p);\nbreak;",
      "guards": []
    },
    {
      "id": "merchant-ability",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 421,
        "endLine": 421
      },
      "text": "case 'merchant-ability':\nuseMerchantAbility(state,p,action);\nbreak;",
      "guards": []
    },
    {
      "id": "skill",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 422,
        "endLine": 422
      },
      "text": "case 'skill':\ncheck(!state.config.trustAbilities,'skill','ใช้ความสามารถพ่อค้าแบบใหม่');\nnpcActionAllowed(state,p);\nuseSkill(state,p,action.itemId);\nbreak;",
      "guards": []
    },
    {
      "id": "wish-new",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 423,
        "endLine": 423
      },
      "text": "case 'wish-new':\nnpcActionAllowed(state,p);\ncheck(!merchantTradeBanned(state,p),'merchant-banned','พ่อค้าทั้งหมดระงับการค้าชั่วคราว');\nwishNew(state,p,action.replaceNpc);\nbreak;",
      "guards": []
    },
    {
      "id": "wish-sell",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 424,
        "endLine": 424
      },
      "text": "case 'wish-sell':\nnpcActionAllowed(state,p);\nwishSell(state,p,action.itemId,action.markup);\nbreak;",
      "guards": []
    },
    {
      "id": "cleanse",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 425,
        "endLine": 425
      },
      "text": "case 'cleanse':\nnpcActionAllowed(state,p);\ncheck(!merchantTradeBanned(state,p),'merchant-banned','พ่อค้าทั้งหมดระงับการค้าชั่วคราว');\ncleanseItem(state,p,action.itemId,action.stoneId);\nbreak;",
      "guards": []
    },
    {
      "id": "event",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 426,
        "endLine": 426
      },
      "text": "case 'event':\nresolveEvent(state,p,action);\nbreak;",
      "guards": []
    },
    {
      "id": "unsold",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 427,
        "endLine": 427
      },
      "text": "case 'unsold':\ncheck(state.config.brokerage && ['APPRAISAL','TRADE'].includes(state.phase) && !p.eventOffer,'phase','resolve event ก่อนจัดการของค้าง');\nsettleUnsold(state,p,action.itemId,action.choice);\nbreak;",
      "guards": []
    },
    {
      "id": "bid",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 428,
        "endLine": 428
      },
      "text": "case 'bid':\ncheck(state.config.brokerage,'action-type','ห้องนี้ไม่มีการประมูล');\nplaceBid(state,p,action.lotId,action.credits);\nbreak;",
      "guards": []
    },
    {
      "id": "market-sell",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 429,
        "endLine": 429
      },
      "text": "case 'market-sell':\nmarketSell(state,p,action.itemId,action.orderId,action.resolution);\nbreak;",
      "guards": []
    },
    {
      "id": "share",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 430,
        "endLine": 430
      },
      "text": "case 'share':\ncheck(['APPRAISAL','TRADE'].includes(state.phase),'phase','ยังเปิดรายการไม่ได้');\nshare(state,p,action.itemId,action.allow,action.purchase,action.claims,action.rebate);\nbreak;",
      "guards": []
    },
    {
      "id": "force-buy",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 431,
        "endLine": 431
      },
      "text": "case 'force-buy':\ncheck(state.phase==='TRADE','phase','ยังไม่ใช่ช่วงต่อรอง');\nforceBuy(state,p,action);\nbreak;",
      "guards": []
    },
    {
      "id": "propose",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 432,
        "endLine": 432
      },
      "text": "case 'propose':\ncheck(state.phase==='TRADE','phase','ยังไม่ใช่ช่วงต่อรอง');\npropose(state,p,action);\nbreak;",
      "guards": []
    },
    {
      "id": "respond",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 433,
        "endLine": 433
      },
      "text": "case 'respond':\ncheck(state.phase==='TRADE','phase','ยังไม่ใช่ช่วงต่อรอง');\nrespond(state,p,action.offerId,action.accept);\nbreak;",
      "guards": []
    },
    {
      "id": "theft-timeout",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 434,
        "endLine": 440
      },
      "text": "case 'theft-timeout':\ncase 'done':\nif(action.type==='theft-timeout'){\n        check(state.config.secureEconomy,'action-type','ไม่มีการเป่ายิ้งฉุบ');\n        for(const duel of state.theftDuels??[])if(duel.status==='open' && [duel.thiefId,duel.victimId].includes(p.id)){duel.status='cancelled';duel.hands={};}\n      }\ncheck(!state.config.secureEconomy || !state.theftDuels?.some(d=>d.status==='open' && [d.thiefId,d.victimId].includes(p.id)),'theft-pending','เลือกมือเป่ายิ้งฉุบให้เสร็จก่อน');\nfinishAbilityChoice(state,p);\ndefaultEvent(state,p);\np.done=true;\nfor(const offer of state.trades) if(offer.status==='open' && [offer.buyerId,offer.sellerId].includes(p.id)) offer.status='rejected';\nbreak;",
      "guards": []
    },
    {
      "id": "done",
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 434,
        "endLine": 440
      },
      "text": "case 'theft-timeout':\ncase 'done':\nif(action.type==='theft-timeout'){\n        check(state.config.secureEconomy,'action-type','ไม่มีการเป่ายิ้งฉุบ');\n        for(const duel of state.theftDuels??[])if(duel.status==='open' && [duel.thiefId,duel.victimId].includes(p.id)){duel.status='cancelled';duel.hands={};}\n      }\ncheck(!state.config.secureEconomy || !state.theftDuels?.some(d=>d.status==='open' && [d.thiefId,d.victimId].includes(p.id)),'theft-pending','เลือกมือเป่ายิ้งฉุบให้เสร็จก่อน');\nfinishAbilityChoice(state,p);\ndefaultEvent(state,p);\np.done=true;\nfor(const offer of state.trades) if(offer.status==='open' && [offer.buyerId,offer.sellerId].includes(p.id)) offer.status='rejected';\nbreak;",
      "guards": []
    },
    {
      "id": "ghost-start",
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 67,
        "endLine": 67
      },
      "text": "case 'ghost-start':\ncase 'ghost-guess':\ncase 'ghost-hire':\ncase 'ghost-accept':\ncase 'ghost-rps':\ncase 'ghost-deliver':\nreturn handleGhostCommand(state,id,action);",
      "guards": []
    },
    {
      "id": "ghost-guess",
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 67,
        "endLine": 67
      },
      "text": "case 'ghost-start':\ncase 'ghost-guess':\ncase 'ghost-hire':\ncase 'ghost-accept':\ncase 'ghost-rps':\ncase 'ghost-deliver':\nreturn handleGhostCommand(state,id,action);",
      "guards": []
    },
    {
      "id": "ghost-hire",
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 67,
        "endLine": 67
      },
      "text": "case 'ghost-start':\ncase 'ghost-guess':\ncase 'ghost-hire':\ncase 'ghost-accept':\ncase 'ghost-rps':\ncase 'ghost-deliver':\nreturn handleGhostCommand(state,id,action);",
      "guards": []
    },
    {
      "id": "ghost-accept",
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 67,
        "endLine": 67
      },
      "text": "case 'ghost-start':\ncase 'ghost-guess':\ncase 'ghost-hire':\ncase 'ghost-accept':\ncase 'ghost-rps':\ncase 'ghost-deliver':\nreturn handleGhostCommand(state,id,action);",
      "guards": []
    },
    {
      "id": "ghost-rps",
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 67,
        "endLine": 67
      },
      "text": "case 'ghost-start':\ncase 'ghost-guess':\ncase 'ghost-hire':\ncase 'ghost-accept':\ncase 'ghost-rps':\ncase 'ghost-deliver':\nreturn handleGhostCommand(state,id,action);",
      "guards": []
    },
    {
      "id": "ghost-deliver",
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 67,
        "endLine": 67
      },
      "text": "case 'ghost-start':\ncase 'ghost-guess':\ncase 'ghost-hire':\ncase 'ghost-accept':\ncase 'ghost-rps':\ncase 'ghost-deliver':\nreturn handleGhostCommand(state,id,action);",
      "guards": []
    },
    {
      "id": "seal-offer",
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:handleSealAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 163,
        "endLine": 163
      },
      "text": "case 'seal-offer':\nofferSeal(state,p,action);\nbreak;",
      "guards": []
    },
    {
      "id": "seal-respond",
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:handleSealAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 164,
        "endLine": 164
      },
      "text": "case 'seal-respond':\nrespondOffer(state,p,action.offerId,action.accept,action.itemIds);\nbreak;",
      "guards": []
    },
    {
      "id": "seal-cancel",
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:handleSealAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 165,
        "endLine": 169
      },
      "text": "case 'seal-cancel':\n{\n      const offer = offers(state).find(o => o.id === action.offerId);\n      check(offer && offer.status === 'open' && offer.holderId === p.id,'seal-offer','ไม่มีข้อเสนอที่ยกเลิกได้');\n      offer.status = 'cancelled'; break;\n    }",
      "guards": []
    },
    {
      "id": "seal-redeem",
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:handleSealAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 170,
        "endLine": 170
      },
      "text": "case 'seal-redeem':\nredeem(state,p,action.thiefId);\nbreak;",
      "guards": []
    },
    {
      "id": "seal-pick",
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:handleSealAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 171,
        "endLine": 171
      },
      "text": "case 'seal-pick':\npick(state,p,action.redemptionId,action.slot);\nbreak;",
      "guards": []
    },
    {
      "id": "vault-deposit-item",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleStorageAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 79,
        "endLine": 84
      },
      "text": "case 'vault-deposit-item':\n{\n      check(vault.items.length<vault.slots,'vault-full','คลังส่วนตัวเต็ม');\n      const item=movable(state,p,action.itemId);\n      removeFromHand(state,p,item,`personal-vault:${p.id}`);\n      vault.items.push(item.id);break;\n    }",
      "guards": []
    },
    {
      "id": "vault-withdraw-item",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleStorageAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 85,
        "endLine": 89
      },
      "text": "case 'vault-withdraw-item':\n{\n      check(vault.items.includes(action.itemId) && state.items[action.itemId]?.owner===`personal-vault:${p.id}`,'vault-owner','สินค้าไม่ได้อยู่ในคลังของคุณ');\n      vault.items=vault.items.filter(id=>id!==action.itemId);\n      state.items[action.itemId]!.owner=p.id;p.inventory.push(action.itemId);break;\n    }",
      "guards": []
    },
    {
      "id": "vault-deposit-credits",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleStorageAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 90,
        "endLine": 94
      },
      "text": "case 'vault-deposit-credits':\n{\n      positive(action.amount);check(p.credits>=action.amount,'credits','เครดิตไม่พอ');addable(vault.credits,action.amount);\n      p.credits-=action.amount;vault.credits+=action.amount;\n      state.ledger.push({from:p.id,to:`vault:${p.id}`,amount:action.amount,reason:'vault-deposit',encounter:state.encounter});break;\n    }",
      "guards": []
    },
    {
      "id": "vault-withdraw-credits",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleStorageAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 95,
        "endLine": 100
      },
      "text": "case 'vault-withdraw-credits':\n{\n      positive(action.amount);check(vault.credits>=action.amount,'credits','เครดิตในคลังไม่พอ');addable(p.credits,action.amount);\n      vault.credits-=action.amount;p.credits+=action.amount;\n      if(state.config.vaultInterestRules===1 && vault.interest)vault.interest.principal=Math.min(vault.interest.principal,vault.credits);\n      state.ledger.push({from:`vault:${p.id}`,to:p.id,amount:action.amount,reason:'vault-withdraw',encounter:state.encounter});break;\n    }",
      "guards": []
    },
    {
      "id": "vault-expand",
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleStorageAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 101,
        "endLine": 104
      },
      "text": "case 'vault-expand':\n{\n      const amount=pilotExpansionCost(state,p,quoteVaultExpansion(vault.slots));check(p.credits>=amount,'credits','เครดิตไม่พอเพิ่มช่องคลัง');\n      addable(vault.slots,1);spend(state,p,amount,0,'vault-expand');vault.slots++;break;\n    }",
      "guards": []
    },
    {
      "id": "loan-propose",
      "owner": "LoanAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 27,
        "endLine": 27
      },
      "text": "type:'loan-propose';",
      "guards": [
        "declaration only; dispatch enforces phase/state"
      ],
      "dispatch": "generic or nested dispatch; inspect referenced source"
    },
    {
      "id": "loan-counter",
      "owner": "LoanAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 28,
        "endLine": 28
      },
      "text": "type:'loan-counter';",
      "guards": [
        "declaration only; dispatch enforces phase/state"
      ],
      "dispatch": "generic or nested dispatch; inspect referenced source"
    },
    {
      "id": "loan-respond",
      "owner": "LoanAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 29,
        "endLine": 29
      },
      "text": "type:'loan-respond';",
      "guards": [
        "declaration only; dispatch enforces phase/state"
      ],
      "dispatch": "generic or nested dispatch; inspect referenced source"
    },
    {
      "id": "loan-cancel",
      "owner": "LoanAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 30,
        "endLine": 30
      },
      "text": "type:'loan-cancel';",
      "guards": [
        "declaration only; dispatch enforces phase/state"
      ],
      "dispatch": "generic or nested dispatch; inspect referenced source"
    },
    {
      "id": "loan-repay",
      "owner": "LoanAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 31,
        "endLine": 31
      },
      "text": "type:'loan-repay';",
      "guards": [
        "declaration only; dispatch enforces phase/state"
      ],
      "dispatch": "generic or nested dispatch; inspect referenced source"
    },
    {
      "id": "theft-hand",
      "owner": "AppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 275,
        "endLine": 275
      },
      "text": "type:'theft-hand';",
      "guards": [
        "declaration only; dispatch enforces phase/state"
      ],
      "dispatch": "generic or nested dispatch; inspect referenced source"
    },
    {
      "id": "theft-expire",
      "owner": "AppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 279,
        "endLine": 279
      },
      "text": "type:'theft-expire';",
      "guards": [
        "declaration only; dispatch enforces phase/state"
      ],
      "dispatch": "generic or nested dispatch; inspect referenced source"
    },
    {
      "id": "crime-clear",
      "owner": "AppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 280,
        "endLine": 280
      },
      "text": "type:'crime-clear'",
      "guards": [
        "declaration only; dispatch enforces phase/state"
      ],
      "dispatch": "generic or nested dispatch; inspect referenced source"
    },
    {
      "id": "round-flip",
      "owner": "AppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 295,
        "endLine": 295
      },
      "text": "type: 'round-flip';",
      "guards": [
        "declaration only; dispatch enforces phase/state"
      ],
      "dispatch": "generic or nested dispatch; inspect referenced source"
    },
    {
      "id": "round-raise",
      "owner": "AppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 296,
        "endLine": 296
      },
      "text": "type: 'round-raise';",
      "guards": [
        "declaration only; dispatch enforces phase/state"
      ],
      "dispatch": "generic or nested dispatch; inspect referenced source"
    },
    {
      "id": "round-bank",
      "owner": "AppraisalAction",
      "source": {
        "file": "apps/comic/src/game/appraisal/types.ts",
        "line": 297,
        "endLine": 297
      },
      "text": "type: 'round-bank'",
      "guards": [
        "declaration only; dispatch enforces phase/state"
      ],
      "dispatch": "generic or nested dispatch; inspect referenced source"
    }
  ],
  "logs": [
    {
      "topic": "bond-revealed",
      "topicExpression": "'bond-revealed'",
      "payload": "{id:spec.id,itemId,facts:spec.reveal}",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 95,
        "endLine": 95
      },
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond",
      "guards": []
    },
    {
      "topic": "bond-refused",
      "topicExpression": "'bond-refused'",
      "payload": "{id:spec.id,itemId:give.id}",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 105,
        "endLine": 105
      },
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond",
      "guards": [
        "spec.genuineOnly && !give.genuine"
      ]
    },
    {
      "topic": "bond-caught",
      "topicExpression": "'bond-caught'",
      "payload": "{id:spec.id,itemId:give.id}",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 106,
        "endLine": 106
      },
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond",
      "guards": [
        "spec.risk && randomAt(state.seed,`${offer.key}:bond-risk`)<spec.risk"
      ]
    },
    {
      "topic": "bond-swapped",
      "topicExpression": "'bond-swapped'",
      "payload": "{id:spec.id,gave:give.id,received:target}",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 108,
        "endLine": 108
      },
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond",
      "guards": []
    },
    {
      "topic": "unsold-penalty",
      "topicExpression": "'unsold-penalty'",
      "payload": "{itemId:item.id,npc:item.npc,credits:paid,energy:drained,statuses:rule.statuses}",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 138,
        "endLine": 138
      },
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:unsoldPenalty",
      "guards": []
    },
    {
      "topic": "unsold-consigned",
      "topicExpression": "'unsold-consigned'",
      "payload": "{itemId:item.id,outcome,paid}",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 159,
        "endLine": 159
      },
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:consign",
      "guards": [
        "state.config.core2"
      ]
    },
    {
      "topic": "unsold-consigned",
      "topicExpression": "'unsold-consigned'",
      "payload": "{itemId:item.id,outcome}",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 170,
        "endLine": 170
      },
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:consign",
      "guards": []
    },
    {
      "topic": "bid-withdrawn",
      "topicExpression": "'bid-withdrawn'",
      "payload": "{lotId}",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 207,
        "endLine": 207
      },
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:placeBid",
      "guards": [
        "credits===0"
      ]
    },
    {
      "topic": "bid-placed",
      "topicExpression": "'bid-placed'",
      "payload": "{lotId}",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 210,
        "endLine": 210
      },
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:placeBid",
      "guards": []
    },
    {
      "topic": "auction-won",
      "topicExpression": "'auction-won'",
      "payload": "{lotId:lot.id,itemId:item.id,price:paid,...(edge?{bid:winner.amount}:{})}",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 232,
        "endLine": 232
      },
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:settleAuction",
      "guards": []
    },
    {
      "topic": "challenge-lost",
      "topicExpression": "'challenge-lost'",
      "payload": "{offerId:offer.id,itemId:item.id,key,penalty,sealed,...(owed>penalty&&!sealed?{itemPenaltyReduction:owed-penalty}:{})}",
      "source": {
        "file": "apps/comic/src/game/appraisal/challenge.ts",
        "line": 27,
        "endLine": 27
      },
      "owner": "code:apps/comic/src/game/appraisal/challenge.ts:settleChallenge",
      "guards": [
        "claim===undefined || claim===truth"
      ]
    },
    {
      "topic": "challenge-won",
      "topicExpression": "'challenge-won'",
      "payload": "{offerId:offer.id,itemId:item.id,key,discount,...(bonus?{itemBonusBps:bonus}:{})}",
      "source": {
        "file": "apps/comic/src/game/appraisal/challenge.ts",
        "line": 34,
        "endLine": 34
      },
      "owner": "code:apps/comic/src/game/appraisal/challenge.ts:settleChallenge",
      "guards": []
    },
    {
      "topic": "cursed-cleanse",
      "topicExpression": "'cursed-cleanse'",
      "payload": "{itemId,npc,price,chance,stone:!!stoneId,cleansed:wasCursed && !item.cursed}",
      "source": {
        "file": "apps/comic/src/game/appraisal/cleanse.ts",
        "line": 51,
        "endLine": 51
      },
      "owner": "code:apps/comic/src/game/appraisal/cleanse.ts:cleanseItem",
      "guards": []
    },
    {
      "topic": null,
      "topicExpression": "'collector-wish-'+status",
      "payload": "{batchId:offer.id}",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 37,
        "endLine": 37
      },
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:closeOffer",
      "guards": []
    },
    {
      "topic": "collector-wish-cancelled",
      "topicExpression": "'collector-wish-cancelled'",
      "payload": "{batchId:s.pending.id,dueAt:s.pending.dueAt}",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 38,
        "endLine": 38
      },
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:closeCollectorWishlists",
      "guards": [
        "s.pending"
      ]
    },
    {
      "topic": "collector-wish-delivered",
      "topicExpression": "'collector-wish-delivered'",
      "payload": "{batchId:s.offer.id,rawQuote}",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 45,
        "endLine": 45
      },
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:deliver",
      "guards": []
    },
    {
      "topic": "collector-wish-cancelled",
      "topicExpression": "'collector-wish-cancelled'",
      "payload": "{batchId:s.pending.id,reason:'dead'}",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 51,
        "endLine": 51
      },
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:reconcileCollectorWishlist",
      "guards": [
        "!alive(p)",
        "s.pending"
      ]
    },
    {
      "topic": "collector-wish-expired",
      "topicExpression": "'collector-wish-expired'",
      "payload": "{batchId:s.pending.id}",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 52,
        "endLine": 52
      },
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:reconcileCollectorWishlist",
      "guards": [
        "s.pending&&s.pending.dueAt<=state.encounter",
        "NOT s.pending.dueAt===state.encounter"
      ]
    },
    {
      "topic": "collector-wish-requested",
      "topicExpression": "'collector-wish-requested'",
      "payload": "{batchId:s.pending.id,kinds:[...action.kinds],dueAt:s.pending.dueAt}",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 64,
        "endLine": 64
      },
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:handleCollectorWishlist",
      "guards": [
        "action.type==='collector-wish-request'"
      ]
    },
    {
      "topic": "collector-wish-request-skipped",
      "topicExpression": "'collector-wish-request-skipped'",
      "payload": "{}",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 65,
        "endLine": 65
      },
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:handleCollectorWishlist",
      "guards": [
        "action.type==='collector-wish-skip'&&action.batchId===undefined"
      ]
    },
    {
      "topic": "collector-wish-peeked",
      "topicExpression": "'collector-wish-peeked'",
      "payload": "{batchId:offer.id,slotId:action.slotId}",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 68,
        "endLine": 68
      },
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:handleCollectorWishlist",
      "guards": [
        "action.type==='collector-wish-peek'"
      ]
    },
    {
      "topic": "collector-wish-purchased",
      "topicExpression": "'collector-wish-purchased'",
      "payload": "{batchId:offer.id,itemId:item.id,slotId:action.slotId,...quote}",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 71,
        "endLine": 71
      },
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:handleCollectorWishlist",
      "guards": []
    },
    {
      "topic": "stolen",
      "topicExpression": "'stolen'",
      "payload": "{itemId,chance}",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-actions.ts",
        "line": 38,
        "endLine": 38
      },
      "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:stealShop",
      "guards": [
        "ok"
      ]
    },
    {
      "topic": "steal-failed",
      "topicExpression": "'steal-failed'",
      "payload": "{itemId,chance}",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-actions.ts",
        "line": 42,
        "endLine": 42
      },
      "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:stealShop",
      "guards": []
    },
    {
      "topic": "pickpocketed",
      "topicExpression": "'pickpocketed'",
      "payload": "{victimId,taken,chance}",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-actions.ts",
        "line": 58,
        "endLine": 58
      },
      "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:pickpocket",
      "guards": [
        "ok"
      ]
    },
    {
      "topic": "pickpocket-failed",
      "topicExpression": "'pickpocket-failed'",
      "payload": "{victimId,chance}",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-actions.ts",
        "line": 63,
        "endLine": 63
      },
      "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:pickpocket",
      "guards": []
    },
    {
      "topic": "barter-caught",
      "topicExpression": "'barter-caught'",
      "payload": "{itemId}",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-actions.ts",
        "line": 75,
        "endLine": 75
      },
      "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:barter",
      "guards": [
        "suspicious && randomAt(state.seed,`${state.encounter}:${p.id}:barter:${itemId}`)<CORE2.barter.detect"
      ]
    },
    {
      "topic": "skill",
      "topicExpression": "'skill'",
      "payload": "{npc,strong}",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-actions.ts",
        "line": 127,
        "endLine": 127
      },
      "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:useSkill",
      "guards": []
    },
    {
      "topic": "core2-gamble",
      "topicExpression": "'core2-gamble'",
      "payload": "{id:spec.id,won}",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-events.ts",
        "line": 101,
        "endLine": 101
      },
      "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:resolveCore2Event",
      "guards": [
        "picked.gamble"
      ]
    },
    {
      "topic": "core2-event",
      "topicExpression": "'core2-event'",
      "payload": "{id:spec.id,choice}",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-events.ts",
        "line": 107,
        "endLine": 107
      },
      "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:resolveCore2Event",
      "guards": []
    },
    {
      "topic": "dread-hit",
      "topicExpression": "'dread-hit'",
      "payload": "{kind,chance}",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-rules.ts",
        "line": 35,
        "endLine": 35
      },
      "owner": "code:apps/comic/src/game/appraisal/core2-rules.ts:applyDread",
      "guards": []
    },
    {
      "topic": "portal-rerolled",
      "topicExpression": "'portal-rerolled'",
      "payload": "{from:old.npc,to:npc,energy:cost}",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 170,
        "endLine": 170
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:rerollPortal",
      "guards": []
    },
    {
      "topic": "exhausted",
      "topicExpression": "'exhausted'",
      "payload": null,
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 199,
        "endLine": 199
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:pauseIfNeeded",
      "guards": [
        "!state.config.survival && p.energy===0 && !p.paused && !(state.config.freeMerchantAction && (p.selectedPortalId===null || p.stock.some(id=>merchantActionFree(state,p,id))))",
        "!p.paused"
      ]
    },
    {
      "topic": "breath-drain",
      "topicExpression": "'breath-drain'",
      "payload": null,
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 210,
        "endLine": 210
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:settleEncounter",
      "guards": [
        "status(p,'D05')"
      ]
    },
    {
      "topic": "swarm-venom",
      "topicExpression": "'swarm-venom'",
      "payload": null,
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 211,
        "endLine": 211
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:settleEncounter",
      "guards": [
        "status(p,'D11')"
      ]
    },
    {
      "topic": "omen-plague",
      "topicExpression": "'omen-plague'",
      "payload": null,
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 212,
        "endLine": 212
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:settleEncounter",
      "guards": [
        "omenNow(state)?.settleEnergy"
      ]
    },
    {
      "topic": "listing-shared",
      "topicExpression": "'listing-shared'",
      "payload": "{itemId,allow,purchase:purchaseAllowed,...(stated?{claims:stated}:{}),...(rebate?{rebate}:{})}",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 255,
        "endLine": 255
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:share",
      "guards": []
    },
    {
      "topic": "forced-purchase",
      "topicExpression": "'forced-purchase'",
      "payload": "{itemId:item.id,sellerId:seller.id,tickets:p.darkTickets}",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 293,
        "endLine": 293
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:forceBuy",
      "guards": []
    },
    {
      "topic": "trade-completed",
      "topicExpression": "'trade-completed'",
      "payload": "{offerId,itemId:offer.itemId,buyerId:buyer.id,credits:offer.credits,source:offer.source}",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 330,
        "endLine": 330
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:respond",
      "guards": []
    },
    {
      "topic": "offer-expired",
      "topicExpression": "'offer-expired'",
      "payload": "{offerId:offer.id,itemId:offer.itemId}",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 341,
        "endLine": 341
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:expireUnavailableOffers",
      "guards": [
        "!listed || !available || !swapAvailable || seller.paused || buyer.paused || seller.done || buyer.done"
      ]
    },
    {
      "topic": "portal-entered",
      "topicExpression": "'portal-entered'",
      "payload": "{portalId:portal.id,npc:portal.npc}",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 397,
        "endLine": 397
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "topic": "event-offered",
      "topicExpression": "'event-offered'",
      "payload": "{id,key,choices:p.eventOffer.choices}",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 251,
        "endLine": 251
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:offerEvent",
      "guards": []
    },
    {
      "topic": "event-lapsed",
      "topicExpression": "'event-lapsed'",
      "payload": "{id}",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 312,
        "endLine": 312
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": [
        "reworked(state) && !offer.choices.includes('decline') && !isConsequence(id) && !core2Spec(id) && !eventEligible(state,p,id)"
      ]
    },
    {
      "topic": "event-declined",
      "topicExpression": "'event-declined'",
      "payload": "{id}",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 314,
        "endLine": 314
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": [
        "choice==='decline'"
      ]
    },
    {
      "topic": "event-resolved",
      "topicExpression": "'event-resolved'",
      "payload": "{id,choice}",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 316,
        "endLine": 316
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": [
        "core2Spec(id)"
      ]
    },
    {
      "topic": "event-resolved",
      "topicExpression": "'event-resolved'",
      "payload": "{id,choice}",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 317,
        "endLine": 317
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": [
        "isNpcEvent(id)"
      ]
    },
    {
      "topic": "event-resolved",
      "topicExpression": "'event-resolved'",
      "payload": "{id,choice}",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 321,
        "endLine": 321
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": [
        "bondSpec(id)"
      ]
    },
    {
      "topic": "event-resolved",
      "topicExpression": "'event-resolved'",
      "payload": "{id,choice}",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 322,
        "endLine": 322
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": [
        "id==='E73'"
      ]
    },
    {
      "topic": "historical-price",
      "topicExpression": "'historical-price'",
      "payload": "{price}",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 341,
        "endLine": 341
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": []
    },
    {
      "topic": "guess",
      "topicExpression": "'guess'",
      "payload": "{itemId:v,correct}",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 378,
        "endLine": 378
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": []
    },
    {
      "topic": "cross-shop-viewed",
      "topicExpression": "'cross-shop-viewed'",
      "payload": "{itemId:v}",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 388,
        "endLine": 388
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": []
    },
    {
      "topic": "event-resolved",
      "topicExpression": "'event-resolved'",
      "payload": "{id,choice}",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 409,
        "endLine": 409
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": []
    },
    {
      "topic": "event-default-fallback",
      "topicExpression": "'event-default-fallback'",
      "payload": "{id:offer.id,choice}",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 423,
        "endLine": 423
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:defaultEvent",
      "guards": [
        "core2Spec(offer.id)",
        "state.config.systemLinks===1",
        "!offer.choices.includes(choice)"
      ]
    },
    {
      "topic": "debuff-blocked",
      "topicExpression": "'debuff-blocked'",
      "payload": "{id}",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 95,
        "endLine": 95
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:grant",
      "guards": [
        "id.startsWith('D') && status(p,'B06')"
      ]
    },
    {
      "topic": "status-granted",
      "topicExpression": "'status-granted'",
      "payload": "{id,expires,charges,...(targetItemId ? {targetItemId} : {})}",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 104,
        "endLine": 104
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:grant",
      "guards": []
    },
    {
      "topic": "energy-spent",
      "topicExpression": "'energy-spent'",
      "payload": "{energy,reason}",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 111,
        "endLine": 111
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:spend",
      "guards": [
        "energy"
      ]
    },
    {
      "topic": "energy-restored",
      "topicExpression": "'energy-restored'",
      "payload": "{amount:p.energy-before,reason}",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 134,
        "endLine": 134
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:recover",
      "guards": []
    },
    {
      "topic": "life-restored",
      "topicExpression": "'life-restored'",
      "payload": "{amount:p.life-before,reason}",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 139,
        "endLine": 139
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:healLife",
      "guards": []
    },
    {
      "topic": "pilot-guard-absorbed",
      "topicExpression": "'pilot-guard-absorbed'",
      "payload": "{amount:before-hit,reason}",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 144,
        "endLine": 144
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:damageLife",
      "guards": [
        "hit>0 && shieldable && !['blood-pact','dark-one-contract','market-condition','vampire-rite','darkone-pact'].includes(reason) && (state.config.catalogVersion===4 || state.config.catalogVersion===5) && p.pilotGuard?.encounter===state.encounter"
      ]
    },
    {
      "topic": "life-lost",
      "topicExpression": "'life-lost'",
      "payload": "{amount:before-p.life,reason}",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 150,
        "endLine": 150
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:damageLife",
      "guards": []
    },
    {
      "topic": "death",
      "topicExpression": "'death'",
      "payload": "{reason}",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 151,
        "endLine": 151
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:damageLife",
      "guards": [
        "p.life===0 && !p.paused"
      ]
    },
    {
      "topic": "pulse-shards",
      "topicExpression": "'pulse-shards'",
      "payload": "{gained,wary}",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 185,
        "endLine": 185
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:gainShards",
      "guards": []
    },
    {
      "topic": "item-removed",
      "topicExpression": "'item-removed'",
      "payload": "{itemId,reason}",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 202,
        "endLine": 202
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:retire",
      "guards": []
    },
    {
      "topic": "pilot-price-check",
      "topicExpression": "'pilot-price-check'",
      "payload": "{sourceItemId:caliper.id,itemId,savedEnergy:cost}",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 241,
        "endLine": 241
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:inspect",
      "guards": [
        "NOT merchantFree",
        "NOT free",
        "caliper"
      ]
    },
    {
      "topic": "inspected",
      "topicExpression": "'inspected'",
      "payload": "{itemId,property}",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 262,
        "endLine": 262
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:inspect",
      "guards": []
    },
    {
      "topic": "trust-lost",
      "topicExpression": "'trust-lost'",
      "payload": "{npc:item.npc,lost,trust:trust[item.npc]}",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 302,
        "endLine": 302
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:appraise",
      "guards": [
        "caught",
        "trust && (trust[item.npc]??0)>0"
      ]
    },
    {
      "topic": "appraised",
      "topicExpression": "'appraised'",
      "payload": "{itemId,value,risk,caught,counter,accepted,...(backlash?{overvalued:true}:{})}",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 309,
        "endLine": 309
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:appraise",
      "guards": []
    },
    {
      "topic": "appraisal-commission",
      "topicExpression": "'appraisal-commission'",
      "payload": "{itemId:item.id,npc:item.npc,salePrice,commission,trust:trust[item.npc]}",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 327,
        "endLine": 327
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:completeAppraisedSale",
      "guards": []
    },
    {
      "topic": "rebate-paid",
      "topicExpression": "'rebate-paid'",
      "payload": "{buyerId:buyer.id,paid,promised:rebate}",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 334,
        "endLine": 334
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:payRebate",
      "guards": [
        "paid"
      ]
    },
    {
      "topic": "knowledge-inherited",
      "topicExpression": "'knowledge-inherited'",
      "payload": "{itemId:item.id,from:shop.id,facts:Object.keys(facts)}",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 350,
        "endLine": 350
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:inheritKnowledge",
      "guards": []
    },
    {
      "topic": "repeat-buy-trust",
      "topicExpression": "'repeat-buy-trust'",
      "payload": "{npc,trust:trust[npc]}",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 362,
        "endLine": 362
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:noteRepeatBuy",
      "guards": []
    },
    {
      "topic": "scrap-energy",
      "topicExpression": "'scrap-energy'",
      "payload": "{gained:buyer.energy-before}",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 374,
        "endLine": 374
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:noteScrap",
      "guards": []
    },
    {
      "topic": "npc-purchased",
      "topicExpression": "'npc-purchased'",
      "payload": "{itemIds,shopId:shop.id,price,energy,condition:options.condition ?? false,...(fee?{fee}:{})}",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 428,
        "endLine": 428
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:purchase",
      "guards": []
    },
    {
      "topic": "ability-cooldown-adjusted",
      "topicExpression": "'ability-cooldown-adjusted'",
      "payload": "{npc,otherNpc:otherNpc??null,reduced}",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 451,
        "endLine": 451
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
      "guards": [
        "works",
        "NOT spec.nativeEffect==='effect:E62'",
        "state.config.trustAbilities && (ABILITY_ITEM_IDS as readonly string[]).includes(item.kind)",
        "item.kind==='chrono-gear' || item.kind==='burden-hourglass'"
      ]
    },
    {
      "topic": "item-insight",
      "topicExpression": "'item-insight'",
      "payload": "{itemId:item.id,targetId:id,fact:'base'}",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 462,
        "endLine": 462
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
      "guards": [
        "works",
        "NOT spec.nativeEffect==='effect:E62'",
        "NOT state.config.trustAbilities && (ABILITY_ITEM_IDS as readonly string[]).includes(item.kind)",
        "state.config.trustAbilities && item.kind in MODERN_ACTIVATIONS",
        "NOT operation==='energy-for-delay'",
        "power===1 || randomAt(state.seed,`${state.encounter}:${item.id}:copy-insight`)<power",
        "operation==='scan-shop-price'",
        "pool.length"
      ]
    },
    {
      "topic": "item-insight",
      "topicExpression": "'item-insight'",
      "payload": "{itemId:item.id,targetId:option.id,fact:option.fact}",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 465,
        "endLine": 465
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
      "guards": [
        "works",
        "NOT spec.nativeEffect==='effect:E62'",
        "NOT state.config.trustAbilities && (ABILITY_ITEM_IDS as readonly string[]).includes(item.kind)",
        "state.config.trustAbilities && item.kind in MODERN_ACTIVATIONS",
        "NOT operation==='energy-for-delay'",
        "power===1 || randomAt(state.seed,`${state.encounter}:${item.id}:copy-insight`)<power",
        "NOT operation==='scan-shop-price'",
        "options.length"
      ]
    },
    {
      "topic": "item-activated",
      "topicExpression": "'item-activated'",
      "payload": "{itemId}",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 494,
        "endLine": 494
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
      "guards": []
    },
    {
      "topic": "seizure-blocked",
      "topicExpression": "'seizure-blocked'",
      "payload": "{itemId}",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 511,
        "endLine": 511
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:penaltyItem",
      "guards": [
        "status(p,'B07')"
      ]
    },
    {
      "topic": "death-blocked",
      "topicExpression": "'death-blocked'",
      "payload": null,
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 515,
        "endLine": 515
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:kill",
      "guards": [
        "status(p,'B08')"
      ]
    },
    {
      "topic": "death",
      "topicExpression": "'death'",
      "payload": null,
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 517,
        "endLine": 517
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:kill",
      "guards": [
        "NOT status(p,'B08')",
        "NOT state.config.survival"
      ]
    },
    {
      "topic": "market-sale",
      "topicExpression": "'market-sale'",
      "payload": "{itemId,orderId,price:price+creditsBonus+gearBonus,...(contract?{matched,resolution,bonus:matched?contract.bonus:null}:{})}",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 564,
        "endLine": 564
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:marketSell",
      "guards": []
    },
    {
      "topic": "ability-choice-selected",
      "topicExpression": "'ability-choice-selected'",
      "payload": "{npc:choice.npc,sourceId:source.id,choiceId}",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 76,
        "endLine": 76
      },
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:settleAbilityChoice",
      "guards": []
    },
    {
      "topic": "merchant-ability-used",
      "topicExpression": "'merchant-ability-used'",
      "payload": "{npc,tier,itemId:action.itemId??null,readyAt:p.abilityReady[npc]}",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 119,
        "endLine": 119
      },
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:useMerchantAbility",
      "guards": []
    },
    {
      "topic": "life-paid",
      "topicExpression": "'life-paid'",
      "payload": "{amount,reason}",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 78,
        "endLine": 78
      },
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:payLife",
      "guards": []
    },
    {
      "topic": "alien-loan",
      "topicExpression": "'alien-loan'",
      "payload": "{itemIds:ids,dueAt:state.encounter+2}",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 104,
        "endLine": 104
      },
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent",
      "guards": []
    },
    {
      "topic": "npc-hex",
      "topicExpression": "'npc-hex'",
      "payload": "{targetId:victim!.id,statusId:id}",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 108,
        "endLine": 108
      },
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent",
      "guards": [
        "NOT command.choice==='purge'"
      ]
    },
    {
      "topic": "alien-returned",
      "topicExpression": "'alien-returned'",
      "payload": "{itemIds:loan.itemIds}",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 129,
        "endLine": 129
      },
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:returnLoanItems",
      "guards": []
    },
    {
      "topic": "vampire-repaid",
      "topicExpression": "'vampire-repaid'",
      "payload": "{outcome}",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 145,
        "endLine": 145
      },
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:redeemNpcContracts",
      "guards": [
        "npc==='vampire' && blood && state.encounter>blood.signedAt"
      ]
    },
    {
      "topic": "alien-repaid",
      "topicExpression": "'alien-repaid'",
      "payload": "{count,credits:perItem*count,energy:energy*count}",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 153,
        "endLine": 153
      },
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:redeemNpcContracts",
      "guards": [
        "npc==='alien' && loan && state.encounter>=loan.dueAt"
      ]
    },
    {
      "topic": "item-liquidated",
      "topicExpression": "'item-liquidated'",
      "payload": "{itemId,price}",
      "source": {
        "file": "apps/comic/src/game/appraisal/price-integrity.ts",
        "line": 53,
        "endLine": 53
      },
      "owner": "code:apps/comic/src/game/appraisal/price-integrity.ts:liquidateOwnedItem",
      "guards": []
    },
    {
      "topic": "item-reappraised",
      "topicExpression": "'item-reappraised'",
      "payload": "{itemId,value,success}",
      "source": {
        "file": "apps/comic/src/game/appraisal/price-integrity.ts",
        "line": 74,
        "endLine": 74
      },
      "owner": "code:apps/comic/src/game/appraisal/price-integrity.ts:reappraiseOwnedItem",
      "guards": []
    },
    {
      "topic": "native-first-meeting",
      "topicExpression": "'native-first-meeting'",
      "payload": "{npc,amount:p.npcTrust[npc]!-before,quoted:amount,sourceItemIds:tools.map(i=>i.id)}",
      "source": {
        "file": "apps/comic/src/game/appraisal/remaining48-effects.ts",
        "line": 46,
        "endLine": 46
      },
      "owner": "code:apps/comic/src/game/appraisal/remaining48-effects.ts:remainingMeet",
      "guards": []
    },
    {
      "topic": "native-recovery-discount",
      "topicExpression": "'native-recovery-discount'",
      "payload": "{amount,target,sourceItemIds:tools.map(i=>i.id)}",
      "source": {
        "file": "apps/comic/src/game/appraisal/remaining48-effects.ts",
        "line": 77,
        "endLine": 77
      },
      "owner": "code:apps/comic/src/game/appraisal/remaining48-effects.ts:remainingUseRecovery",
      "guards": []
    },
    {
      "topic": "native-commission-bonus",
      "topicExpression": "'native-commission-bonus'",
      "payload": "{itemId:item.id,buyerId:buyer.id,commission,quoted:quote,amount,runPaid:paid+amount}",
      "source": {
        "file": "apps/comic/src/game/appraisal/remaining48-effects.ts",
        "line": 88,
        "endLine": 88
      },
      "owner": "code:apps/comic/src/game/appraisal/remaining48-effects.ts:remainingCommissionBonus",
      "guards": []
    },
    {
      "topic": "native-sale-energy",
      "topicExpression": "'native-sale-energy'",
      "payload": "{offerId:offer.id,itemId:item.id,paid,amount:actual,quoted:amount,sourceItemIds:tools.map(i=>i.id)}",
      "source": {
        "file": "apps/comic/src/game/appraisal/remaining48-effects.ts",
        "line": 105,
        "endLine": 105
      },
      "owner": "code:apps/comic/src/game/appraisal/remaining48-effects.ts:remainingSaleEnergy",
      "guards": []
    },
    {
      "topic": "native-auction-rebate",
      "topicExpression": "'native-auction-rebate'",
      "payload": "{lotId:lot.id,itemId:item.id,paid,quoted:quote,amount}",
      "source": {
        "file": "apps/comic/src/game/appraisal/remaining48-effects.ts",
        "line": 133,
        "endLine": 133
      },
      "owner": "code:apps/comic/src/game/appraisal/remaining48-effects.ts:remainingAuctionRebate",
      "guards": []
    },
    {
      "topic": "round-coin-raised",
      "topicExpression": "'round-coin-raised'",
      "payload": "{coinCount,stake:r.base,amount:r.amount}",
      "source": {
        "file": "apps/comic/src/game/appraisal/round-rewards.ts",
        "line": 29,
        "endLine": 29
      },
      "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:raiseRoundReward",
      "guards": []
    },
    {
      "topic": "round-coin",
      "topicExpression": "'round-coin'",
      "payload": "{attempt,guess,side:coins[0]!.side,correct,coins,delta,amount}",
      "source": {
        "file": "apps/comic/src/game/appraisal/round-rewards.ts",
        "line": 53,
        "endLine": 53
      },
      "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:flipRoundReward",
      "guards": [
        "state.config.multiCoinRewards"
      ]
    },
    {
      "topic": "round-coin",
      "topicExpression": "'round-coin'",
      "payload": "{attempt,guess,side,correct,amount:r.amount}",
      "source": {
        "file": "apps/comic/src/game/appraisal/round-rewards.ts",
        "line": 62,
        "endLine": 62
      },
      "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:flipRoundReward",
      "guards": []
    },
    {
      "topic": "round-reward-banked",
      "topicExpression": "'round-reward-banked'",
      "payload": "{amount:r.amount,flips:r.flips}",
      "source": {
        "file": "apps/comic/src/game/appraisal/round-rewards.ts",
        "line": 70,
        "endLine": 70
      },
      "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:bankRoundReward",
      "guards": []
    },
    {
      "topic": null,
      "topicExpression": "action.type",
      "payload": "{offerId:list.at(-1)!.id}",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 88,
        "endLine": 88
      },
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:offerSeal",
      "guards": []
    },
    {
      "topic": "seal-destroyed",
      "topicExpression": "'seal-destroyed'",
      "payload": "{sealId:seal.id}",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 113,
        "endLine": 113
      },
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:respondOffer",
      "guards": [
        "seal.thiefId === p.id"
      ]
    },
    {
      "topic": "seal-sold",
      "topicExpression": "'seal-sold'",
      "payload": "{offerId:offer.id,sealId:seal.id}",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 115,
        "endLine": 115
      },
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:respondOffer",
      "guards": []
    },
    {
      "topic": "seal-redeem",
      "topicExpression": "'seal-redeem'",
      "payload": "{redemptionId:id,thiefId:thief.id,slots:chosen.length}",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 135,
        "endLine": 135
      },
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:redeem",
      "guards": []
    },
    {
      "topic": "seal-picked",
      "topicExpression": "'seal-picked'",
      "payload": "{redemptionId:redemption.id,itemId:item.id,thiefId:thief.id}",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 157,
        "endLine": 157
      },
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:pick",
      "guards": []
    },
    {
      "topic": null,
      "topicExpression": "action.type",
      "payload": "{...action}",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 106,
        "endLine": 106
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleStorageAction",
      "guards": []
    },
    {
      "topic": null,
      "topicExpression": "action.type",
      "payload": "{loanId:loans.at(-1)!.id}",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 142,
        "endLine": 142
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleLoanAction",
      "guards": [
        "action.type==='loan-propose'"
      ]
    },
    {
      "topic": null,
      "topicExpression": "action.type",
      "payload": "{loanId:loan.id}",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 182,
        "endLine": 182
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleLoanAction",
      "guards": []
    },
    {
      "topic": "secured-loan-foreclosed",
      "topicExpression": "'secured-loan-foreclosed'",
      "payload": "{loanId:loan.id,lenderId:lender.id,reason:due?'deadline':'match-end'}",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 196,
        "endLine": 196
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:settleLoansBeforeAdvance",
      "guards": [
        "loan.status==='active' && (final || state.phase==='REVEAL' && state.encounter>=loan.dueAt)"
      ]
    },
    {
      "topic": "vault-interest",
      "topicExpression": "'vault-interest'",
      "payload": "{balance:vault.credits,...(state.config.vaultInterestRules===1?{principal}:{}),owed,paid:amount}",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 222,
        "endLine": 222
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:payVaultInterest",
      "guards": []
    },
    {
      "topic": "collector-scored",
      "topicExpression": "'collector-scored'",
      "payload": "{credits:p.credits,itemValue,modifierPercent,score,itemIds:items.map(item=>item.id),statusIds}",
      "source": {
        "file": "apps/comic/src/game/appraisal/survival.ts",
        "line": 34,
        "endLine": 34
      },
      "owner": "code:apps/comic/src/game/appraisal/survival.ts:collectRun",
      "guards": []
    },
    {
      "topic": "theft-started",
      "topicExpression": "'theft-started'",
      "payload": "{duelId:duel.id,...(victim ? {victimId:victim.id} : {itemId:item.id,npc:item.npc})}",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 163,
        "endLine": 163
      },
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:startTheftDuel",
      "guards": []
    },
    {
      "topic": "theft-timeout-resolved",
      "topicExpression": "'theft-timeout-resolved'",
      "payload": "{duelId:duel.id,round,filled:missing}",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 200,
        "endLine": 200
      },
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:expireTheftDuel",
      "guards": [
        "state.config.theftTimeoutRules===1"
      ]
    },
    {
      "topic": "theft-expired",
      "topicExpression": "'theft-expired'",
      "payload": "{duelId:duel.id,round:duel.round}",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 207,
        "endLine": 207
      },
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:expireTheftDuel",
      "guards": []
    },
    {
      "topic": "theft-tie-broken",
      "topicExpression": "'theft-tie-broken'",
      "payload": "{duelId:duel.id,to:edge > 0 ? 'thief' : 'defender',used}",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 238,
        "endLine": 238
      },
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:breakTie",
      "guards": [
        "edge !== 0"
      ]
    },
    {
      "topic": "pilot-sword-used",
      "topicExpression": "'pilot-sword-used'",
      "payload": "{duelId:duel.id,playerId:id,itemId}",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 273,
        "endLine": 273
      },
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:chooseTheftHand",
      "guards": [
        "thiefHand === opponentHand",
        "pilotUses(state,item)===0"
      ]
    },
    {
      "topic": "theft-resolved",
      "topicExpression": "'theft-resolved'",
      "payload": "{duelId:duel.id,result:duel.status}",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 300,
        "endLine": 300
      },
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:chooseTheftHand",
      "guards": []
    },
    {
      "topic": "theft-compensation",
      "topicExpression": "'theft-compensation'",
      "payload": "{compensationId:comp.id,due:comp.amount,paid}",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 318,
        "endLine": 318
      },
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:collectCompensations",
      "guards": []
    },
    {
      "topic": "crime-cleared",
      "topicExpression": "'crime-cleared'",
      "payload": "{price,cases:crime.cases.length}",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 333,
        "endLine": 333
      },
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:clearCrime",
      "guards": []
    },
    {
      "topic": "wish-new",
      "topicExpression": "'wish-new'",
      "payload": "{npc,kind:pick.kind,price:pick.price,...(replaceNpc?{replaced:replaceNpc}:{})}",
      "source": {
        "file": "apps/comic/src/game/appraisal/wishlist.ts",
        "line": 58,
        "endLine": 58
      },
      "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:wishNew",
      "guards": []
    },
    {
      "topic": "wish-refused",
      "topicExpression": "'wish-refused'",
      "payload": "{itemId,npc,reason:'fake'}",
      "source": {
        "file": "apps/comic/src/game/appraisal/wishlist.ts",
        "line": 97,
        "endLine": 97
      },
      "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:wishSell",
      "guards": [
        "!item.genuine && randomAt(state.seed,`${state.encounter}:${p.id}:${itemId}:wish-fake`)<Math.min(.9,Math.max(.05,.4*NPC_SPECS[npc].sensitivity+(state.config.polish?statusMagnitude(p,'D03',.1)-statusMagnitude(p,'B04',.1):0)))"
      ]
    },
    {
      "topic": "wish-sold",
      "topicExpression": "'wish-sold'",
      "payload": "{itemId,npc,price:paid,ask,chance}",
      "source": {
        "file": "apps/comic/src/game/appraisal/wishlist.ts",
        "line": 105,
        "endLine": 105
      },
      "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:wishSell",
      "guards": [
        "NOT !item.genuine && randomAt(state.seed,`${state.encounter}:${p.id}:${itemId}:wish-fake`)<Math.min(.9,Math.max(.05,.4*NPC_SPECS[npc].sensitivity+(state.config.polish?statusMagnitude(p,'D03',.1)-statusMagnitude(p,'B04',.1):0)))",
        "randomAt(state.seed,`${state.encounter}:${p.id}:${itemId}:wish-deal`)*100<chance"
      ]
    },
    {
      "topic": "wish-refused",
      "topicExpression": "'wish-refused'",
      "payload": "{itemId,npc,reason:'price',chance}",
      "source": {
        "file": "apps/comic/src/game/appraisal/wishlist.ts",
        "line": 107,
        "endLine": 107
      },
      "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:wishSell",
      "guards": [
        "NOT !item.genuine && randomAt(state.seed,`${state.encounter}:${p.id}:${itemId}:wish-fake`)<Math.min(.9,Math.max(.05,.4*NPC_SPECS[npc].sensitivity+(state.config.polish?statusMagnitude(p,'D03',.1)-statusMagnitude(p,'B04',.1):0)))",
        "NOT randomAt(state.seed,`${state.encounter}:${p.id}:${itemId}:wish-deal`)*100<chance"
      ]
    }
  ],
  "validations": [
    {
      "code": "score",
      "condition": "row.score===(row.paused==='dead'?0:row.gain+row.accuracy)",
      "message": "'คะแนน encounter ไม่ตรง breakdown'",
      "source": {
        "file": "apps/comic/src/game/appraisal/audit.ts",
        "line": 17,
        "endLine": 17
      },
      "owner": "code:apps/comic/src/game/appraisal/audit.ts:scoresFromAppraisalHistory",
      "guards": []
    },
    {
      "code": "audit-private",
      "condition": "state.phase==='RESULTS'",
      "message": "'ดาวน์โหลด seed/audit ได้หลังจบ run เท่านั้น'",
      "source": {
        "file": "apps/comic/src/game/appraisal/audit.ts",
        "line": 23,
        "endLine": 23
      },
      "owner": "code:apps/comic/src/game/appraisal/audit.ts:exportAppraisalAudit",
      "guards": []
    },
    {
      "code": "audit",
      "condition": "(audit?.schemaVersion===4 || audit?.schemaVersion===5) && Array.isArray(audit.commands) && (audit.schemaVersion===5)===!!audit.config.survival",
      "message": "'เวอร์ชัน appraisal audit ไม่ตรงกติกา'",
      "source": {
        "file": "apps/comic/src/game/appraisal/audit.ts",
        "line": 27,
        "endLine": 27
      },
      "owner": "code:apps/comic/src/game/appraisal/audit.ts:replayAppraisalAudit",
      "guards": []
    },
    {
      "code": "audit",
      "condition": "state.phase==='RESULTS' && isDeepStrictEqual(exportAppraisalAudit(state),audit)",
      "message": "'ผล audit ไม่ตรง replay'",
      "source": {
        "file": "apps/comic/src/game/appraisal/audit.ts",
        "line": 30,
        "endLine": 30
      },
      "owner": "code:apps/comic/src/game/appraisal/audit.ts:replayAppraisalAudit",
      "guards": []
    },
    {
      "code": "score",
      "condition": "state.players.every(p=>scores[p.id]===p.score)",
      "message": "'คะแนน run ไม่ตรงประวัติ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/audit.ts",
        "line": 33,
        "endLine": 33
      },
      "owner": "code:apps/comic/src/game/appraisal/audit.ts:replayAppraisalAudit",
      "guards": []
    },
    {
      "code": "merchant-banned",
      "condition": "!merchantTradeBanned(state,p)",
      "message": "'ยังถูกห้ามค้าขายกับพ่อค้า'",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 85,
        "endLine": 85
      },
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond",
      "guards": [
        "state.config.secureEconomy && (spec.mode==='sell' || spec.mode==='swap')"
      ]
    },
    {
      "code": "event-target",
      "condition": "command.itemId && offer.itemIds.includes(command.itemId)",
      "message": "'เลือกสินค้าที่อยู่ใน event'",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 86,
        "endLine": 86
      },
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond",
      "guards": []
    },
    {
      "code": "event-target",
      "condition": "bondItems(state,p,spec).includes(itemId)",
      "message": "'ไม่มีของที่ NPC ต้องการแล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 87,
        "endLine": 87
      },
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond",
      "guards": []
    },
    {
      "code": "event-target",
      "condition": "bondItems(state,p,spec).length>0",
      "message": "'ไม่มีของที่ NPC ต้องการแล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 89,
        "endLine": 89
      },
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond",
      "guards": []
    },
    {
      "code": "event-target",
      "condition": "bondItems(state,p,spec).length>0",
      "message": "'ไม่มีของที่ NPC ต้องการแล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 91,
        "endLine": 91
      },
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:resolveBond",
      "guards": []
    },
    {
      "code": "unsold",
      "condition": "['buy','penalty','consign'].includes(choice)",
      "message": "'ตัวเลือกของค้างไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 173,
        "endLine": 173
      },
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:settleUnsold",
      "guards": []
    },
    {
      "code": "unsold",
      "condition": "unsoldItems(state,p).includes(itemId)",
      "message": "'ไม่มีของที่ประเมินแล้วค้างอยู่ในร้าน'",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 174,
        "endLine": 174
      },
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:settleUnsold",
      "guards": []
    },
    {
      "code": "lot",
      "condition": "lot && lot.winnerId===undefined",
      "message": "'ไม่มีรายการประมูลนี้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 205,
        "endLine": 205
      },
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:placeBid",
      "guards": []
    },
    {
      "code": "bid",
      "condition": "Number.isSafeInteger(credits) && credits>=0 && credits<=1000",
      "message": "'ราคาประมูลไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 206,
        "endLine": 206
      },
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:placeBid",
      "guards": []
    },
    {
      "code": "bid",
      "condition": "credits>=lot.minimum",
      "message": "`ประมูลขั้นต่ำ ${lot.minimum} เครดิต`",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 208,
        "endLine": 208
      },
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:placeBid",
      "guards": []
    },
    {
      "code": "credits",
      "condition": "p.credits>=credits",
      "message": "'credit ไม่พอสำหรับราคาประมูล'",
      "source": {
        "file": "apps/comic/src/game/appraisal/brokerage.ts",
        "line": 209,
        "endLine": 209
      },
      "owner": "code:apps/comic/src/game/appraisal/brokerage.ts:placeBid",
      "guards": []
    },
    {
      "code": "cleanse",
      "condition": "npc",
      "message": "'พ่อค้านี้ไม่รับล้างคำสาปตอนนี้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/cleanse.ts",
        "line": 31,
        "endLine": 31
      },
      "owner": "code:apps/comic/src/game/appraisal/cleanse.ts:cleanseItem",
      "guards": []
    },
    {
      "code": "cleanse",
      "condition": "!p.cleansed!.includes(itemId)",
      "message": "'ชิ้นนี้ล้างคำสาปในช่วงนี้แล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/cleanse.ts",
        "line": 33,
        "endLine": 33
      },
      "owner": "code:apps/comic/src/game/appraisal/cleanse.ts:cleanseItem",
      "guards": []
    },
    {
      "code": "cleanse",
      "condition": "stoneId!==itemId",
      "message": "'ใช้หินขัดกับตัวมันเองไม่ได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/cleanse.ts",
        "line": 36,
        "endLine": 36
      },
      "owner": "code:apps/comic/src/game/appraisal/cleanse.ts:cleanseItem",
      "guards": [
        "stoneId!==undefined"
      ]
    },
    {
      "code": "cleanse",
      "condition": "stone.kind==='whetstone'",
      "message": "'ของที่เลือกไม่ใช่หินขัด'",
      "source": {
        "file": "apps/comic/src/game/appraisal/cleanse.ts",
        "line": 37,
        "endLine": 37
      },
      "owner": "code:apps/comic/src/game/appraisal/cleanse.ts:cleanseItem",
      "guards": [
        "stoneId!==undefined"
      ]
    },
    {
      "code": "collector-pool",
      "condition": "selected.length===5&&new Set(selected).size===5",
      "message": "'คลังสินค้าสำหรับ Collector ไม่พอ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 42,
        "endLine": 42
      },
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:deliver",
      "guards": []
    },
    {
      "code": "collector-pool",
      "condition": "npc",
      "message": "'ชนิดสินค้านี้ไม่มีในรัน'",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 43,
        "endLine": 43
      },
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:deliver",
      "guards": []
    },
    {
      "code": "collector-window",
      "condition": "state.config.collectorWishlistRules===1&&interactive(state,p)",
      "message": "'ช่วงนี้ยังใช้บริการ Collector ไม่ได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 63,
        "endLine": 63
      },
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:handleCollectorWishlist",
      "guards": []
    },
    {
      "code": "collector-window",
      "condition": "s",
      "message": "'ยังไม่มีสิทธิ์ Collector'",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 63,
        "endLine": 63
      },
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:handleCollectorWishlist",
      "guards": []
    },
    {
      "code": "collector-window",
      "condition": "available(state,p)",
      "message": "'ยังส่งคำขอใหม่ไม่ได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 64,
        "endLine": 64
      },
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:handleCollectorWishlist",
      "guards": [
        "action.type==='collector-wish-request'"
      ]
    },
    {
      "code": "collector-kinds",
      "condition": "Array.isArray(action.kinds)&&action.kinds.length===3&&new Set(action.kinds).size===3&&action.kinds.every(k=>typeof k==='string'&&pool(state).has(k))",
      "message": "'เลือกสินค้า 3 ชนิดที่ไม่ซ้ำกัน'",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 64,
        "endLine": 64
      },
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:handleCollectorWishlist",
      "guards": [
        "action.type==='collector-wish-request'"
      ]
    },
    {
      "code": "collector-window",
      "condition": "available(state,p)",
      "message": "'ยังข้ามคำขอไม่ได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 65,
        "endLine": 65
      },
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:handleCollectorWishlist",
      "guards": [
        "action.type==='collector-wish-skip'&&action.batchId===undefined"
      ]
    },
    {
      "code": "collector-batch",
      "condition": "offer&&offer.status==='open'&&action.batchId===offer.id",
      "message": "'ชุด Collector นี้ไม่พร้อมแล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 66,
        "endLine": 66
      },
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:handleCollectorWishlist",
      "guards": []
    },
    {
      "code": "collector-slot",
      "condition": "index>=0",
      "message": "'ช่องสินค้าไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 67,
        "endLine": 67
      },
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:handleCollectorWishlist",
      "guards": []
    },
    {
      "code": "credits",
      "condition": "p.credits>=quote.total",
      "message": "'เครดิตในกระเป๋าไม่พอ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 67,
        "endLine": 67
      },
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:handleCollectorWishlist",
      "guards": []
    },
    {
      "code": "collector-peek",
      "condition": "offer.peek===undefined",
      "message": "'เปิดดูชุดนี้แล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 68,
        "endLine": 68
      },
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:handleCollectorWishlist",
      "guards": [
        "action.type==='collector-wish-peek'"
      ]
    },
    {
      "code": "collector-quote",
      "condition": "action.quoteId===quoteKey(offer,quote)",
      "message": "'ต้นทุนเปลี่ยนแล้ว กรุณาตรวจและยืนยันราคาใหม่'",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 69,
        "endLine": 69
      },
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:handleCollectorWishlist",
      "guards": []
    },
    {
      "code": "collector-owner",
      "condition": "item.owner===prefix+offer.id",
      "message": "'สินค้าชุดนี้ไม่พร้อมแล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 69,
        "endLine": 69
      },
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:handleCollectorWishlist",
      "guards": []
    },
    {
      "code": "merchant-banned",
      "condition": "!merchantTradeBanned(state,p)",
      "message": "'ยังถูกห้ามค้าขายกับพ่อค้า'",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 70,
        "endLine": 70
      },
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:handleCollectorWishlist",
      "guards": []
    },
    {
      "code": "collector-state",
      "condition": "(state.config.collectorWishlistRules===1)===!!state.collectorWishes",
      "message": "'สถานะ Collector ไม่ตรงกติกา'",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 74,
        "endLine": 74
      },
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:assertCollectorWishlistInvariants",
      "guards": []
    },
    {
      "code": "collector-state",
      "condition": "Object.keys(state.collectorWishes).length===state.players.length&&state.players.every(p=>Object.hasOwn(state.collectorWishes!,p.id))",
      "message": "'สิทธิ์ Collector ไม่ครบผู้เล่น'",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 74,
        "endLine": 74
      },
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:assertCollectorWishlistInvariants",
      "guards": []
    },
    {
      "code": "collector-state",
      "condition": "state.players.some(p=>p.id===id)&&Number.isSafeInteger(s.lastWindowAt)&&s.lastWindowAt>=0&&s.lastWindowAt<=state.encounter",
      "message": "'เจ้าของหรือรอบ Collector ไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 75,
        "endLine": 75
      },
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:assertCollectorWishlistInvariants",
      "guards": []
    },
    {
      "code": "collector-state",
      "condition": "s.pending.kinds.length===3&&new Set(s.pending.kinds).size===3&&s.pending.dueAt===s.pending.requestedAt+2&&s.pending.requestedAt%2===0&&s.pending.dueAt>state.encounter",
      "message": "'คำขอ Collector ไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 76,
        "endLine": 76
      },
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:assertCollectorWishlistInvariants",
      "guards": [
        "s.pending"
      ]
    },
    {
      "code": "collector-state",
      "condition": "o.itemIds.length===5&&new Set(o.itemIds).size===5&&new Set(o.itemIds.map(i=>state.items[i]?.kind)).size===5&&Number.isSafeInteger(o.rawQuote)&&o.rawQuote>=1&&(o.peek===undefined||Number.isSafeInteger(o.peek)&&o.peek>=0&&o.peek<5)",
      "message": "'ชุด Collector ไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 77,
        "endLine": 77
      },
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:assertCollectorWishlistInvariants",
      "guards": [
        "s.offer"
      ]
    },
    {
      "code": "collector-owner",
      "condition": "!escrow.has(itemId)&&!!escrow.add(itemId)&&state.items[itemId]?.owner===prefix+o.id",
      "message": "'ของค้าง Collector ไม่ตรงเจ้าของ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 77,
        "endLine": 77
      },
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:assertCollectorWishlistInvariants",
      "guards": [
        "s.offer",
        "o.status==='open'"
      ]
    },
    {
      "code": "collector-owner",
      "condition": "escrow.has(item.id)",
      "message": "'ของค้าง Collector ไม่มีชุด'",
      "source": {
        "file": "apps/comic/src/game/appraisal/collector-wishlist.ts",
        "line": 79,
        "endLine": 79
      },
      "owner": "code:apps/comic/src/game/appraisal/collector-wishlist.ts:assertCollectorWishlistInvariants",
      "guards": [
        "item.owner.startsWith(prefix)"
      ]
    },
    {
      "code": "steal",
      "condition": "state.config.core2 && !p.eventOffer && !p.stealTried?.length",
      "message": "'ขโมยได้ครั้งเดียวต่อช่วง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-actions.ts",
        "line": 14,
        "endLine": 14
      },
      "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:startTheft",
      "guards": []
    },
    {
      "code": "steal",
      "condition": "victim && victim.id!==p.id && !victim.paused && victim.credits>0 && ['APPRAISAL','TRADE'].includes(state.phase)",
      "message": "'ล้วงกระเป๋าคนนี้ไม่ได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-actions.ts",
        "line": 48,
        "endLine": 48
      },
      "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:pickpocket",
      "guards": []
    },
    {
      "code": "barter",
      "condition": "!mine.copy && npc.favorite.includes(mine.kind) || copySaleQuote(mine,rarityValue(mine,anchorOf(state.config,mine.kind)))>=target.ask",
      "message": "'ของที่เสนอมูลค่าไม่พอสำหรับแลก'",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-actions.ts",
        "line": 70,
        "endLine": 70
      },
      "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:barter",
      "guards": []
    },
    {
      "code": "stolen",
      "condition": "!mine.stolen",
      "message": "'ของที่ฉกมาแลกไม่ได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-actions.ts",
        "line": 71,
        "endLine": 71
      },
      "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:barter",
      "guards": []
    },
    {
      "code": "skill",
      "condition": "skillOpen(state,p)",
      "message": "'ความสามารถนี้ยังไม่พร้อมใช้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-actions.ts",
        "line": 106,
        "endLine": 106
      },
      "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:useSkill",
      "guards": []
    },
    {
      "code": "skill",
      "condition": "itemId",
      "message": "'เลือกสินค้าของร้านนี้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-actions.ts",
        "line": 109,
        "endLine": 109
      },
      "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:useSkill",
      "guards": []
    },
    {
      "code": "skill",
      "condition": "p.life!>1",
      "message": "'ชีวิตไม่พอ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-actions.ts",
        "line": 113,
        "endLine": 113
      },
      "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:useSkill",
      "guards": [
        "life"
      ]
    },
    {
      "code": "skill",
      "condition": "debuff",
      "message": "'ไม่มี debuff ให้ลบ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-actions.ts",
        "line": 119,
        "endLine": 119
      },
      "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:useSkill",
      "guards": []
    },
    {
      "code": "skill",
      "condition": "p.life!>1",
      "message": "'ชีวิตไม่พอ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-actions.ts",
        "line": 120,
        "endLine": 120
      },
      "owner": "code:apps/comic/src/game/appraisal/core2-actions.ts:useSkill",
      "guards": [
        "life"
      ]
    },
    {
      "code": "event-choice",
      "condition": "picked",
      "message": "'ไม่มีตัวเลือกนี้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-events.ts",
        "line": 82,
        "endLine": 82
      },
      "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:resolveCore2Event",
      "guards": []
    },
    {
      "code": "event-cost",
      "condition": "state.config.systemLinks===1?core2EventChoices(state,p,offer.id).includes(choice):affordable(state,p,picked)",
      "message": "'จ่ายตัวเลือกนี้ไม่ไหวแล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-events.ts",
        "line": 83,
        "endLine": 83
      },
      "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:resolveCore2Event",
      "guards": [
        "choice!=='decline' && choice!==FALLBACK_BRAND.id"
      ]
    },
    {
      "code": "event-target",
      "condition": "command.itemId && offer.itemIds.includes(command.itemId)",
      "message": "'เลือกสินค้าที่จะสละ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/core2-events.ts",
        "line": 85,
        "endLine": 85
      },
      "owner": "code:apps/comic/src/game/appraisal/core2-events.ts:resolveCore2Event",
      "guards": [
        "picked.lose"
      ]
    },
    {
      "code": "config",
      "condition": "config.native56Effects===undefined||(config.native56Effects===2||config.native56Effects===3||config.native56Effects===4||config.native56Effects===5)&&config.catalogVersion===5",
      "message": "'รุ่นเอฟเฟกต์สินค้าใหม่ไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 46,
        "endLine": 46
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config.recoveryQuoteRules===undefined||config.recoveryQuoteRules===1",
      "message": "'กติกาข้อเสนอฟื้นทรัพยากรไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 47,
        "endLine": 47
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config.personalScoringRules===undefined||config.personalScoringRules===1",
      "message": "'กติกาคะแนนผลงานไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 48,
        "endLine": 48
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config.personalScoringFacts===undefined||config.personalScoringFacts===2",
      "message": "'รุ่นตัวบันทึกคะแนนไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 49,
        "endLine": 49
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config.personalScoringFacts===undefined||config.personalScoringRules===1",
      "message": "'ตัวบันทึกคะแนนต้องเปิดกติกาคะแนน'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 50,
        "endLine": 50
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config.personalScoringFacts!==2||!!config.survival&&(!config.secureEconomy||config.loanEndSettlement===true)",
      "message": "'คะแนนผลงานต้องใช้ Survival และปิดหนี้ก่อน Collector'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 51,
        "endLine": 51
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config.collectorWishlistRules===undefined||config.collectorWishlistRules===1",
      "message": "'กติกา Collector ไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 52,
        "endLine": 52
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "!!config.rarity",
      "message": "'Rarity economy requires rarity generation'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 53,
        "endLine": 53
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": [
        "config.rarityEconomy!==undefined"
      ]
    },
    {
      "code": "config",
      "condition": "config.secureEconomy===undefined || typeof config.secureEconomy==='boolean'",
      "message": "'กติกาคลังและสัญญาไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 55,
        "endLine": 55
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config.eventChoiceRules===undefined || config.eventChoiceRules===1",
      "message": "'กติกาตัวเลือกเหตุการณ์ไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 56,
        "endLine": 56
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config.statusLinks===undefined || config.statusLinks===1",
      "message": "'กติกาเชื่อมสถานะไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 57,
        "endLine": 57
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config.systemLinks===undefined || config.systemLinks===1",
      "message": "'กติกาเชื่อมระบบไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 58,
        "endLine": 58
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config.theftTimeoutRules===undefined || config.theftTimeoutRules===1",
      "message": "'กติกาหมดเวลาเป่ายิ้งฉุบไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 59,
        "endLine": 59
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config.vaultInterestRules===undefined || config.vaultInterestRules===1",
      "message": "'กติกาดอกเบี้ยไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 60,
        "endLine": 60
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config.loanEndSettlement===undefined || typeof config.loanEndSettlement==='boolean'",
      "message": "'กติกาปิดสัญญากู้ตอนจบไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 61,
        "endLine": 61
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config.collectorDeadline===undefined || Number.isSafeInteger(config.collectorDeadline) && config.collectorDeadline>=1 && config.collectorDeadline<=100",
      "message": "'ช่วงที่ Collector มาไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 62,
        "endLine": 62
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config.trustAbilities===undefined || typeof config.trustAbilities==='boolean'",
      "message": "'กติกาความสามารถพ่อค้าไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 63,
        "endLine": 63
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config.itemEffects===undefined || typeof config.itemEffects==='boolean'",
      "message": "'กติกาผลสินค้าไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 64,
        "endLine": 64
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config.npcEvents===undefined || typeof config.npcEvents==='boolean'",
      "message": "'กติกาอีเวนต์เฉพาะพ่อค้าไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 65,
        "endLine": 65
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config.core2===undefined || typeof config.core2==='boolean'",
      "message": "'กติกาแกนเกมใหม่ไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 66,
        "endLine": 66
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config.commerce===undefined || typeof config.commerce==='boolean'",
      "message": "'กติกาการค้าไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 67,
        "endLine": 67
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config.totalTrustStock===undefined || typeof config.totalTrustStock==='boolean'",
      "message": "'กติกาโบนัสความไว้ใจรวมไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 68,
        "endLine": 68
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config.polish===undefined || typeof config.polish==='boolean'",
      "message": "'กติกาขัดเกลาไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 69,
        "endLine": 69
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config.expansion===undefined || typeof config.expansion==='boolean'",
      "message": "'กติกาส่วนขยายไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 70,
        "endLine": 70
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config.challenge===undefined || typeof config.challenge==='boolean'",
      "message": "'กติกาท้าทายคำระบุไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 71,
        "endLine": 71
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config.wishContract===undefined || typeof config.wishContract==='boolean'",
      "message": "'กติกาสัญญาตามหาของไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 72,
        "endLine": 72
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config.wishlist===undefined || typeof config.wishlist==='boolean'",
      "message": "'กติกาของที่พ่อค้าตามหาไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 73,
        "endLine": 73
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config.cleanse===undefined || typeof config.cleanse==='boolean'",
      "message": "'กติกาล้างคำสาปไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 74,
        "endLine": 74
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config.fakeEffect===undefined || typeof config.fakeEffect==='boolean'",
      "message": "'กติกาผลของปลอมไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 75,
        "endLine": 75
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config.freeMerchantAction===undefined || typeof config.freeMerchantAction==='boolean'",
      "message": "'กติกาสิทธิ์ฟรีประจำสินค้าไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 76,
        "endLine": 76
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config.freeBuy===undefined || typeof config.freeBuy==='boolean'",
      "message": "'กติกาซื้อฟรีพลังไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 77,
        "endLine": 77
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config.curseSight===undefined || typeof config.curseSight==='boolean'",
      "message": "'กติกาตรวจคำสาปไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 78,
        "endLine": 78
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config.multiCoinRewards===undefined || typeof config.multiCoinRewards==='boolean'",
      "message": "'กติกาทบเหรียญไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 79,
        "endLine": 79
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config.roundRewards===undefined || typeof config.roundRewards==='boolean'",
      "message": "'กติการางวัลจบรอบไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 80,
        "endLine": 80
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config.catalogVersion===undefined || config.catalogVersion===1 || config.catalogVersion===2 || config.catalogVersion===3 || config.catalogVersion===4 || config.catalogVersion===5",
      "message": "'เวอร์ชันคลังสินค้าไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 81,
        "endLine": 81
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "Number.isSafeInteger(config[key]) && config[key]>=0 && config[key]<=10000",
      "message": "`ค่า ${key} ไม่ถูกต้อง`",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 83,
        "endLine": 83
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config.encounters>=1 && config.encounters<=10 && config.maxEnergy>=1 && config.recoveryEnergy>=1 && config.recoveryEnergy<=config.maxEnergy",
      "message": "'จำนวน encounter หรือพลังไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 84,
        "endLine": 84
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "Number.isFinite(config.marketProbability) && config.marketProbability>=0 && config.marketProbability<=1 && config.marketMaxOrders>=1 && config.marketQuota>=1",
      "message": "'การสุ่มตลาดไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 85,
        "endLine": 85
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config.survival===undefined || !!config.survival && typeof config.survival==='object' && !Array.isArray(config.survival)",
      "message": "'กติกาชีวิตไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 86,
        "endLine": 86
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": []
    },
    {
      "code": "config",
      "condition": "Object.keys(rules).length===3 && ['maxLife','encounterLifeCost','entryEnergyCost'].every(key=>Number.isSafeInteger(rules[key as keyof typeof rules]))",
      "message": "'กติกาชีวิตไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 89,
        "endLine": 89
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": [
        "config.survival"
      ]
    },
    {
      "code": "config",
      "condition": "rules.maxLife>=1 && rules.maxLife<=100 && rules.encounterLifeCost>=1 && rules.encounterLifeCost<=rules.maxLife && rules.entryEnergyCost>=0 && rules.entryEnergyCost<=config.maxEnergy",
      "message": "'ค่าชีวิตหรือต้นทุนเริ่มรอบไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 90,
        "endLine": 90
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": [
        "config.survival"
      ]
    },
    {
      "code": "config",
      "condition": "!!rules && typeof rules==='object' && !Array.isArray(rules) && Object.keys(rules).length===3",
      "message": "'กติกานายหน้าไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 94,
        "endLine": 94
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": [
        "config.brokerage!==undefined"
      ]
    },
    {
      "code": "config",
      "condition": "[rules.auctionProbability,rules.bondProbability].every(v=>Number.isFinite(v) && v>=0 && v<=1) && Number.isSafeInteger(rules.maxLots) && rules.maxLots>=1 && rules.maxLots<=4",
      "message": "'กติกานายหน้าไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 95,
        "endLine": 95
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:validateConfig",
      "guards": [
        "config.brokerage!==undefined"
      ]
    },
    {
      "code": "players",
      "condition": "playerIds.length>=2 && playerIds.length<=4 && new Set(playerIds).size===playerIds.length && playerIds.every(id=>typeof id==='string' && /^[a-zA-Z0-9_-]{1,64}$/.test(id) && !['bank','__proto__','constructor','prototype'].includes(id))",
      "message": "'ต้องมีผู้เล่น 2–4 คนและ ID ไม่ซ้ำ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 106,
        "endLine": 106
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:initialiseAppraisalRun",
      "guards": []
    },
    {
      "code": "seed",
      "condition": "typeof seed==='string' && seed.length>0 && seed.length<=256",
      "message": "'seed ไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 107,
        "endLine": 107
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:initialiseAppraisalRun",
      "guards": []
    },
    {
      "code": "config",
      "condition": "config && typeof config==='object'",
      "message": "'กติกาไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 108,
        "endLine": 108
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:initialiseAppraisalRun",
      "guards": []
    },
    {
      "code": "reroll",
      "condition": "state.config.core2 && state.phase==='PORTALS' && !p.eventOffer && !p.selectedPortalId",
      "message": "'รีประตูได้เฉพาะตอนเลือกประตู'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 158,
        "endLine": 158
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:rerollPortal",
      "guards": []
    },
    {
      "code": "portal",
      "condition": "old && !old.disabled",
      "message": "'ประตูนี้รีไม่ได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 160,
        "endLine": 160
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:rerollPortal",
      "guards": []
    },
    {
      "code": "reroll",
      "condition": "pool.length",
      "message": "'ไม่มีพ่อค้าให้เปลี่ยน'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 164,
        "endLine": 164
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:rerollPortal",
      "guards": []
    },
    {
      "code": "phase",
      "condition": "state.phase==='APPRAISAL'",
      "message": "'ยังไม่ใช่ช่วงประเมิน'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 243,
        "endLine": 243
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:npcActionAllowed",
      "guards": []
    },
    {
      "code": "event-pending",
      "condition": "!p.eventOffer",
      "message": "'เลือกผล event ก่อน'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 243,
        "endLine": 243
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:npcActionAllowed",
      "guards": []
    },
    {
      "code": "owner",
      "condition": "item && (item.owner===p.id || p.stock.includes(itemId))",
      "message": "'เปิดได้เฉพาะรายการของตน'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 247,
        "endLine": 247
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:share",
      "guards": []
    },
    {
      "code": "listing",
      "condition": "!purchaseAllowed || (item.owner===p.id ? unlocked(p,itemId) : !!p.valuations[itemId])",
      "message": "'ต้องประเมินสินค้าหรือปลดล็อกก่อนเปิดให้ซื้อ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 248,
        "endLine": 248
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:share",
      "guards": []
    },
    {
      "code": "claims",
      "condition": "!stated || (state.config.challenge && item.owner.startsWith('npc:') && allow && purchaseAllowed)",
      "message": "'ระบุข้อมูลได้เฉพาะสินค้าร้านที่ประกาศขายและประเมินแล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 251,
        "endLine": 251
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:share",
      "guards": []
    },
    {
      "code": "rebate",
      "condition": "Number.isSafeInteger(rebate) && rebate>=0 && rebate<=1000 && (rebate===0 || allow && purchaseAllowed && p.credits>=rebate)",
      "message": "'ค่าแถมต้องเป็นจำนวนเต็ม 0–1000 เปิดขายอยู่ และเจ้าของต้องมีเครดิตพอ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 252,
        "endLine": 252
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:share",
      "guards": []
    },
    {
      "code": "seller",
      "condition": "seller.id!==p.id && !seller.paused && !seller.done",
      "message": "'เจ้าของยังไม่พร้อมต่อรอง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 259,
        "endLine": 259
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:propose",
      "guards": []
    },
    {
      "code": "listing",
      "condition": "listing",
      "message": "'เจ้าของยังไม่เปิดให้ซื้อ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 261,
        "endLine": 261
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:propose",
      "guards": []
    },
    {
      "code": "price",
      "condition": "Number.isSafeInteger(action.credits) && action.credits>=0 && action.credits<=1000 && p.credits>=action.credits",
      "message": "'credit ที่เสนอไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 262,
        "endLine": 262
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:propose",
      "guards": []
    },
    {
      "code": "condition",
      "condition": "seller.dealMode!=='condition' || action.condition===true",
      "message": "'ต้องยอมรับเงื่อนไขร้านนี้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 265,
        "endLine": 265
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:propose",
      "guards": [
        "source==='npc'"
      ]
    },
    {
      "code": "challenge",
      "condition": "state.config.challenge && source==='npc' && claim!==undefined",
      "message": "'ท้าทายได้เฉพาะคำระบุที่ผู้ประเมินให้ไว้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 268,
        "endLine": 268
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:propose",
      "guards": [
        "action.challenge!==undefined"
      ]
    },
    {
      "code": "credits",
      "condition": "p.credits>=action.credits+quote+challengePenalty(quote)",
      "message": "'เครดิตไม่พอสำหรับราคา ค่าแนะนำ และค่าปรับถ้าท้าทายผิด'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 269,
        "endLine": 269
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:propose",
      "guards": [
        "action.challenge!==undefined"
      ]
    },
    {
      "code": "challenge",
      "condition": "ownedItem(state,p,action.sealId,true).kind==='void-seal'",
      "message": "'ของที่เลือกไม่ใช่ตราโมฆะ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 270,
        "endLine": 270
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:propose",
      "guards": [
        "action.challenge!==undefined",
        "action.sealId!==undefined"
      ]
    },
    {
      "code": "challenge",
      "condition": "action.sealId===undefined",
      "message": "'ตราโมฆะใช้ได้กับการท้าทายเท่านั้น'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 271,
        "endLine": 271
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:propose",
      "guards": [
        "NOT action.challenge!==undefined"
      ]
    },
    {
      "code": "swap",
      "condition": "source==='inventory'",
      "message": "'ร้าน NPC รับค่าแนะนำเป็น credit เท่านั้น'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 272,
        "endLine": 272
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:propose",
      "guards": [
        "action.swapItemId"
      ]
    },
    {
      "code": "offers",
      "condition": "state.trades.filter(o=>o.status==='open' && o.buyerId===p.id).length<8",
      "message": "'มีข้อเสนอค้างมากเกินไป'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 273,
        "endLine": 273
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:propose",
      "guards": []
    },
    {
      "code": "tickets",
      "condition": "(p.darkTickets??0)>=TRUST_RULES.ticketsToForce",
      "message": "`ต้องมีตั๋วคำสั่งมืด ${TRUST_RULES.ticketsToForce} ใบ`",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 279,
        "endLine": 279
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:forceBuy",
      "guards": []
    },
    {
      "code": "seller",
      "condition": "seller.id!==p.id && seller.paused!=='dead'",
      "message": "'บังคับซื้อจากเจ้าของนี้ไม่ได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 280,
        "endLine": 280
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:forceBuy",
      "guards": []
    },
    {
      "code": "listing",
      "condition": "state.listings.some(l=>l.ownerId===seller.id && l.itemId===action.itemId)",
      "message": "'เจ้าของยังไม่เปิดรายการนี้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 281,
        "endLine": 281
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:forceBuy",
      "guards": []
    },
    {
      "code": "appraisal",
      "condition": "!!seller.valuations[item.id]",
      "message": "'บังคับซื้อได้เฉพาะของที่ประเมินแล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 284,
        "endLine": 284
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:forceBuy",
      "guards": []
    },
    {
      "code": "offer",
      "condition": "offer && offer.encounter===state.encounter && offer.status==='open' && offer.sellerId===p.id",
      "message": "'ข้อเสนอหมดอายุหรือไม่ใช่ของคุณ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 297,
        "endLine": 297
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:respond",
      "guards": []
    },
    {
      "code": "buyer",
      "condition": "!buyer.paused && !buyer.done",
      "message": "'ผู้ซื้อยังไม่พร้อม'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 299,
        "endLine": 299
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:respond",
      "guards": []
    },
    {
      "code": "listing",
      "condition": "listing",
      "message": "'รายการไม่เปิดแล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 301,
        "endLine": 301
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:respond",
      "guards": []
    },
    {
      "code": "rebate",
      "condition": "p.credits+offer.credits>=(listing.rebate??0)",
      "message": "'เครดิตเจ้าของไม่พอจ่ายค่าแถม'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 302,
        "endLine": 302
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:respond",
      "guards": []
    },
    {
      "code": "credits",
      "condition": "buyer.credits>=offer.credits",
      "message": "'ผู้ซื้อเงินไม่พอ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 312,
        "endLine": 312
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:respond",
      "guards": [
        "NOT offer.source==='npc'"
      ]
    },
    {
      "code": "request",
      "condition": "action && typeof action==='object' && typeof action.playerId==='string' && typeof action.requestId==='string' && /^[a-zA-Z0-9_-]{1,80}$/.test(action.requestId)",
      "message": "'คำสั่งไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 346,
        "endLine": 346
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "code": "request-conflict",
      "condition": "previous.accepted[key]===signature",
      "message": "'request ID ถูกใช้กับคำสั่งอื่น'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 348,
        "endLine": 348
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": [
        "previous.accepted[key]"
      ]
    },
    {
      "code": "stale-encounter",
      "condition": "action.encounter===previous.encounter",
      "message": "'คำสั่งมาจาก encounter เก่า'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 349,
        "endLine": 349
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "code": "phase",
      "condition": "ghostAction?previous.phase!=='RESULTS':roundAction?previous.phase==='REVEAL':financeAction?previous.phase!=='RESULTS':!['REVEAL','RESULTS'].includes(previous.phase)",
      "message": "'ช่วงนี้ไม่รับ action'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 356,
        "endLine": 356
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "code": "theft-pending",
      "condition": "!duelling || action.type==='theft-hand' || action.type==='theft-timeout' || action.type==='theft-expire'",
      "message": "'เลือกมือเป่ายิ้งฉุบให้เสร็จก่อน'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 360,
        "endLine": 360
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "code": "ability-choice",
      "condition": "!p.abilityChoice || action.type==='merchant-ability' && !!action.choiceId || action.type==='done' || action.type==='theft-timeout' || action.type==='theft-expire'",
      "message": "'เลือกสินค้าที่พ่อค้าเสนอให้ก่อน'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 361,
        "endLine": 361
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "code": "inactive",
      "condition": "state.config.secureEconomy && p.life!==0 && p.paused!=='dead'",
      "message": "'ผู้เล่นที่หมดชีวิตทำรายการไม่ได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 370,
        "endLine": 370
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": [
        "financeAction || action.type==='theft-hand' || action.type==='theft-expire' || forcedTimeout"
      ]
    },
    {
      "code": "theft-round",
      "condition": "Number.isSafeInteger(action.round)&&action.round===state.theftDuels?.find(d=>d.id===action.duelId)?.round",
      "message": "'รอบเป่ายิ้งฉุบผ่านไปแล้ว ใช้สถานะล่าสุด'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 376,
        "endLine": 376
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": [
        "financeAction || action.type==='theft-hand' || action.type==='theft-expire' || forcedTimeout",
        "NOT storageAction",
        "NOT loanAction",
        "NOT sealAction",
        "NOT action.type==='crime-clear'",
        "action.type==='theft-hand'",
        "state.config.theftTimeoutRules===1"
      ]
    },
    {
      "code": "inactive",
      "condition": "!p.paused && !p.done",
      "message": "'ผู้เล่นพักหรือจบช่วงแล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 384,
        "endLine": 384
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "code": "consequence",
      "condition": "!p.eventOffer || !isConsequence(p.eventOffer.id) || action.type==='event' || action.type==='done' || action.type==='theft-timeout'",
      "message": "'resolve ผล NPC ก่อน'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 385,
        "endLine": 385
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "code": "phase",
      "condition": "state.config.secureEconomy && ['APPRAISAL','TRADE'].includes(state.phase) && !p.eventOffer",
      "message": "'ตอบเหตุการณ์ก่อนขโมย'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 388,
        "endLine": 388
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "code": "phase",
      "condition": "['APPRAISAL','TRADE'].includes(state.phase) && !p.eventOffer",
      "message": "'ตอบเหตุการณ์ก่อนประเมินใหม่'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 389,
        "endLine": 389
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "code": "phase",
      "condition": "['APPRAISAL','TRADE'].includes(state.phase) && !p.eventOffer",
      "message": "'ตอบเหตุการณ์ก่อนขายของ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 390,
        "endLine": 390
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "code": "phase",
      "condition": "state.phase==='PORTALS' && !p.eventOffer",
      "message": "'เลือก event ก่อนเข้าประตู'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 392,
        "endLine": 392
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "code": "portal",
      "condition": "portal",
      "message": "'ประตูนี้เข้าไม่ได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 393,
        "endLine": 393
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "code": "npc-closed",
      "condition": "!p.caught",
      "message": "'NPC ที่จับได้แล้วไม่รับการประเมินใหม่'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 402,
        "endLine": 402
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "code": "phase",
      "condition": "['APPRAISAL','TRADE'].includes(state.phase) && !p.eventOffer",
      "message": "'resolve event ก่อนเปิดใช้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 406,
        "endLine": 406
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "code": "merchant-banned",
      "condition": "!merchantTradeBanned(state,p)",
      "message": "'พ่อค้าทั้งหมดระงับการค้าชั่วคราว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 408,
        "endLine": 408
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "code": "recovery",
      "condition": "offer && offer.target===action.target",
      "message": "'พ่อค้านี้ไม่มีดีลฟื้นที่เลือกหรือใช้สิทธิ์แล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 409,
        "endLine": 409
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "code": "stale-recovery-quote",
      "condition": "state.config.recoveryQuoteRules!==1||action.quoteId===offer.quoteId",
      "message": "'ข้อเสนอฟื้นทรัพยากรเปลี่ยนแล้ว กรุณาตรวจข้อเสนอใหม่'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 410,
        "endLine": 410
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "code": "recovery",
      "condition": "offer.target==='life'?p.life!<maxLifeOf(state,p)!:p.energy<maxEnergyOf(state,p)",
      "message": "'ทรัพยากรนี้เต็มแล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 411,
        "endLine": 411
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "code": "rps-required",
      "condition": "!state.config.secureEconomy",
      "message": "'เลือกมือเป่ายิ้งฉุบเพื่อขโมย'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 418,
        "endLine": 418
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "code": "rps-required",
      "condition": "!state.config.secureEconomy",
      "message": "'เลือกมือเป่ายิ้งฉุบเพื่อขโมย'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 419,
        "endLine": 419
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "code": "phase",
      "condition": "['APPRAISAL','TRADE'].includes(state.phase) && !p.eventOffer",
      "message": "'resolve event ก่อน'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 419,
        "endLine": 419
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "code": "merchant-banned",
      "condition": "!merchantTradeBanned(state,p)",
      "message": "'พ่อค้าทั้งหมดระงับการค้าชั่วคราว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 420,
        "endLine": 420
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "code": "action-type",
      "condition": "state.config.core2",
      "message": "'ห้องนี้ไม่มีการแลกของ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 420,
        "endLine": 420
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "code": "skill",
      "condition": "!state.config.trustAbilities",
      "message": "'ใช้ความสามารถพ่อค้าแบบใหม่'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 422,
        "endLine": 422
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "code": "merchant-banned",
      "condition": "!merchantTradeBanned(state,p)",
      "message": "'พ่อค้าทั้งหมดระงับการค้าชั่วคราว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 423,
        "endLine": 423
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "code": "merchant-banned",
      "condition": "!merchantTradeBanned(state,p)",
      "message": "'พ่อค้าทั้งหมดระงับการค้าชั่วคราว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 425,
        "endLine": 425
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "code": "phase",
      "condition": "state.config.brokerage && ['APPRAISAL','TRADE'].includes(state.phase) && !p.eventOffer",
      "message": "'resolve event ก่อนจัดการของค้าง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 427,
        "endLine": 427
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "code": "action-type",
      "condition": "state.config.brokerage",
      "message": "'ห้องนี้ไม่มีการประมูล'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 428,
        "endLine": 428
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "code": "phase",
      "condition": "['APPRAISAL','TRADE'].includes(state.phase)",
      "message": "'ยังเปิดรายการไม่ได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 430,
        "endLine": 430
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "code": "phase",
      "condition": "state.phase==='TRADE'",
      "message": "'ยังไม่ใช่ช่วงต่อรอง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 431,
        "endLine": 431
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "code": "phase",
      "condition": "state.phase==='TRADE'",
      "message": "'ยังไม่ใช่ช่วงต่อรอง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 432,
        "endLine": 432
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "code": "phase",
      "condition": "state.phase==='TRADE'",
      "message": "'ยังไม่ใช่ช่วงต่อรอง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 433,
        "endLine": 433
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "code": "action-type",
      "condition": "state.config.secureEconomy",
      "message": "'ไม่มีการเป่ายิ้งฉุบ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 436,
        "endLine": 436
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": [
        "action.type==='theft-timeout'"
      ]
    },
    {
      "code": "theft-pending",
      "condition": "!state.config.secureEconomy || !state.theftDuels?.some(d=>d.status==='open' && [d.thiefId,d.victimId].includes(p.id))",
      "message": "'เลือกมือเป่ายิ้งฉุบให้เสร็จก่อน'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 439,
        "endLine": 439
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "code": "action-type",
      "condition": "false",
      "message": "'ไม่รู้จักคำสั่ง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 441,
        "endLine": 441
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:applyAppraisalAction",
      "guards": []
    },
    {
      "code": "phase",
      "condition": "previous.phase==='REVEAL'",
      "message": "'ต้องเปิดผลก่อน'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 447,
        "endLine": 447
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:advanceAppraisalEncounter",
      "guards": []
    },
    {
      "code": "rarity",
      "condition": "!!state.config.rarityEconomy&&!!item.appearance",
      "message": "'พลัง rarity ไม่มีที่มา'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 487,
        "endLine": 487
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
      "guards": [
        "item.rarityPower"
      ]
    },
    {
      "code": "rarity",
      "condition": "!!state.config.rarity",
      "message": "'รูปลักษณ์สินค้าไม่มี config'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 488,
        "endLine": 488
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
      "guards": [
        "item.appearance"
      ]
    },
    {
      "code": "reward-reserve",
      "condition": "state.reservedRewards===state.players.filter(p=>p.subsidy).length+state.players.reduce((sum,p)=>sum+(p.npcContracts?.alien?.reservedCredits??0),0)",
      "message": "'งบรางวัลไม่ตรงสิทธิ์ที่จอง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 490,
        "endLine": 490
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
      "guards": []
    },
    {
      "code": "economy",
      "condition": "Number.isSafeInteger(state.bank) && state.bank>=0 && state.market.budget>=0 && state.bank>=state.market.budget+state.reservedRewards",
      "message": "'bank reserve ไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 491,
        "endLine": 491
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
      "guards": []
    },
    {
      "code": "ledger",
      "condition": "roundFunding.every(e=>state.config.roundRewards && e.reason==='round-reward' && state.players.some(p=>p.id===e.to))",
      "message": "'เงินรางวัลจบรอบไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 493,
        "endLine": 493
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
      "guards": []
    },
    {
      "code": "ledger",
      "condition": "roundStakes.every(e=>state.config.multiCoinRewards && e.reason==='round-stake' && state.players.some(p=>p.id===e.from))",
      "message": "'เงินทบเหรียญไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 495,
        "endLine": 495
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
      "guards": []
    },
    {
      "code": "ledger",
      "condition": "itemFunding.every(e=>passivesEnabled(state.config) && ['gear-commission','gear-market'].includes(e.reason) && state.players.some(p=>p.id===e.to))",
      "message": "'โบนัสสินค้าผิดกติกา'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 497,
        "endLine": 497
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
      "guards": []
    },
    {
      "code": "economy",
      "condition": "state.bank+state.players.reduce((sum,p)=>sum+p.credits+(p.personalVault?.credits??0),0)===expected",
      "message": "'credit รวมเปลี่ยนโดยไม่มี ledger'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 499,
        "endLine": 499
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
      "guards": []
    },
    {
      "code": "ledger",
      "condition": "Number.isSafeInteger(entry.amount) && entry.amount>0 && initial[entry.from]!==undefined && initial[entry.to]!==undefined",
      "message": "'ledger ไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 501,
        "endLine": 501
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
      "guards": []
    },
    {
      "code": "ledger",
      "condition": "initial.bank===state.bank && state.players.every(p=>initial[p.id]===p.credits && (!state.config.secureEconomy || initial[`vault:${p.id}`]===(p.personalVault?.credits??0)))",
      "message": "'ledger ไม่ตรง state'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 502,
        "endLine": 502
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
      "guards": []
    },
    {
      "code": "copy",
      "condition": "state.config.trustAbilities && source && !source.copy && source.kind===item.kind && Number.isSafeInteger(item.copy.number) && item.copy.number>=1 && [25,35,50].includes(item.copy.valuePercent)",
      "message": "'ที่มาสำเนาไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 504,
        "endLine": 504
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
      "guards": [
        "item.copy"
      ]
    },
    {
      "code": "npc-trust",
      "condition": "!!p.npcTrust===!!state.config.commerce && Object.entries(p.npcTrust??{}).every(([npc,n])=>npc in NPC_SPECS && Number.isSafeInteger(n) && n>=0 && n<=TRUST_CAP)",
      "message": "'ความไว้ใจ NPC ไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 506,
        "endLine": 506
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
      "guards": []
    },
    {
      "code": "passive-use",
      "condition": "Object.values(p.passiveUses??{}).every(n=>Number.isSafeInteger(n) && n>=0)",
      "message": "'สิทธิ์ตรวจฟรีไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 507,
        "endLine": 507
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
      "guards": []
    },
    {
      "code": "ability-cooldown",
      "condition": "Object.entries(p.abilityReady??{}).every(([npc,n])=>state.config.trustAbilities && Object.hasOwn(NPC_SPECS,npc) && Number.isFinite(n) && n>=0)",
      "message": "'เวลารอความสามารถไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 508,
        "endLine": 508
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
      "guards": []
    },
    {
      "code": "round-reward",
      "condition": "state.config.roundRewards && r.encounter===state.encounter && r.base===(state.encounter%2?10:15) && Number.isSafeInteger(r.flips) && r.flips>=0 && Number.isSafeInteger(r.amount) && validAmount",
      "message": "'ยอดรางวัลจบรอบไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 516,
        "endLine": 516
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
      "guards": [
        "r"
      ]
    },
    {
      "code": "resources",
      "condition": "Number.isSafeInteger(p.credits) && p.credits>=0 && Number.isSafeInteger(p.energy) && p.energy>=0 && p.energy<=maxEnergyOf(state,p)",
      "message": "'ทรัพยากรไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 518,
        "endLine": 518
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
      "guards": []
    },
    {
      "code": "life",
      "condition": "Number.isSafeInteger(p.life) && p.life!>=0 && p.life!<=maxLifeOf(state,p)! && (p.life===0)===(p.paused==='dead') && p.paused!=='exhausted'",
      "message": "'ชีวิตหรือสิทธิ์เล่นไม่ตรงกัน'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 519,
        "endLine": 519
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
      "guards": [
        "state.config.survival"
      ]
    },
    {
      "code": "tickets",
      "condition": "p.darkTickets===undefined || Number.isSafeInteger(p.darkTickets) && p.darkTickets>=0",
      "message": "'ตั๋วคำสั่งมืดไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 520,
        "endLine": 520
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
      "guards": []
    },
    {
      "code": "pulse",
      "condition": "p.pulseShards===undefined || state.config.survival && Number.isSafeInteger(p.pulseShards) && p.pulseShards>=0 && p.pulseShards<=PULSE_RULES.bankCap",
      "message": "'เศษชีพจรไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 521,
        "endLine": 521
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
      "guards": []
    },
    {
      "code": "owner",
      "condition": "p.inventory.every(id=>!owned.has(id) && !!owned.add(id) && state.items[id]?.owner===p.id)",
      "message": "'สินค้าซ้ำหรือเจ้าของไม่ตรง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 522,
        "endLine": 522
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
      "guards": []
    },
    {
      "code": "alien-loan",
      "condition": "state.config.npcEvents && loan.itemIds.length>=1 && loan.itemIds.length<=3 && loan.reservedCredits===8*loan.itemIds.length && loan.dueAt===loan.lentAt+2 && loan.lentAt<=state.encounter",
      "message": "'สัญญายืมไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 524,
        "endLine": 524
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
      "guards": [
        "loan"
      ]
    },
    {
      "code": "loan-owner",
      "condition": "loan.itemIds.every(id=>!owned.has(id) && !!owned.add(id) && state.items[id]?.owner===`alien-loan:${p.id}`)",
      "message": "'ของที่ให้ยืมซ้ำหรือเจ้าของไม่ตรง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 524,
        "endLine": 524
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
      "guards": [
        "loan"
      ]
    },
    {
      "code": "status",
      "condition": "p.statuses.every(s=>s.charges>0 && (s.power===undefined||Number.isFinite(s.power)&&s.power>0&&s.power<=(state.config.rarityEconomy?MAX_RARITY_MULTIPLIER:1)) && (s.expires>=state.encounter || !!state.config.survival && p.life===0)) && new Set(p.statuses.map(s=>s.id)).size===p.statuses.length",
      "message": "'สถานะไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 525,
        "endLine": 525
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
      "guards": []
    },
    {
      "code": "owner",
      "condition": "owned.has(item.id)",
      "message": "'ของมีเจ้าของแต่ไม่มีใน inventory'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 527,
        "endLine": 527
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
      "guards": [
        "state.players.some(p=>p.id===item.owner)"
      ]
    },
    {
      "code": "loan-owner",
      "condition": "owned.has(item.id)",
      "message": "'ของที่ให้ยืมไม่มีสัญญา'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 528,
        "endLine": 528
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
      "guards": [
        "item.owner.startsWith('alien-loan:')"
      ]
    },
    {
      "code": "vault",
      "condition": "!!state.config.brokerage===Array.isArray(state.vault)",
      "message": "'คลัง Dark Market ไม่ตรงกติกา'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 529,
        "endLine": 529
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
      "guards": []
    },
    {
      "code": "vault",
      "condition": "new Set(state.vault).size===state.vault.length && state.vault.every(id=>state.items[id]?.owner==='dark-market') && Object.values(state.items).filter(i=>i.owner==='dark-market').length===state.vault.length",
      "message": "'คลัง Dark Market ไม่ตรงเจ้าของ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 530,
        "endLine": 530
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
      "guards": [
        "state.vault"
      ]
    },
    {
      "code": "version",
      "condition": "state.version===5",
      "message": "'กติกาชีวิตต้องเป็น v0.5'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 531,
        "endLine": 531
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
      "guards": [
        "state.config.survival"
      ]
    },
    {
      "code": "collector",
      "condition": "(state.players.every(p=>p.life===0) || collectorDue(state)) && state.collector?.length===state.players.length",
      "message": "'จบได้เมื่อทุกคนตายหรือถึงช่วงที่ Collector มา และ Collector คิดผลแล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 531,
        "endLine": 531
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
      "guards": [
        "state.config.survival",
        "state.phase==='RESULTS'"
      ]
    },
    {
      "code": "collector",
      "condition": "!state.collector",
      "message": "'เปิดผล Collector ก่อนจบไม่ได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/engine.ts",
        "line": 531,
        "endLine": 531
      },
      "owner": "code:apps/comic/src/game/appraisal/engine.ts:assertAppraisalInvariants",
      "guards": [
        "state.config.survival",
        "NOT state.phase==='RESULTS'"
      ]
    },
    {
      "code": "event-ineligible",
      "condition": "!p.eventOffer && eventEligible(state,p,id)",
      "message": "'event ไม่เข้าเงื่อนไข'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 212,
        "endLine": 212
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:offerEvent",
      "guards": []
    },
    {
      "code": "event-target",
      "condition": "command.itemId && offer.itemIds.includes(command.itemId)",
      "message": "'เลือกสินค้าที่อยู่ใน event'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 296,
        "endLine": 296
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:chooseItem",
      "guards": []
    },
    {
      "code": "event-target",
      "condition": "command.statusId && offer.statusIds.includes(command.statusId)",
      "message": "'เลือกสถานะที่อยู่ใน event'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 299,
        "endLine": 299
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:chooseStatus",
      "guards": []
    },
    {
      "code": "inspections",
      "condition": "p.inspections<inspectionLimit(state,p)",
      "message": "'สิทธิ์ตรวจหมด'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 302,
        "endLine": 302
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:eventInspect",
      "guards": []
    },
    {
      "code": "event-choice",
      "condition": "offer && offer.key===command.key && offer.choices.includes(command.choice)",
      "message": "'ข้อเสนอเก่าหรือไม่มีตัวเลือกนี้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 308,
        "endLine": 308
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": []
    },
    {
      "code": "consequence",
      "condition": "!isConsequence(id)",
      "message": "'ปฏิเสธผลที่รับความเสี่ยงไว้ไม่ได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 314,
        "endLine": 314
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": [
        "choice==='decline'"
      ]
    },
    {
      "code": "event-ineligible",
      "condition": "state.config.trustAbilities && eventEligible(state,p,id)",
      "message": "'เหตุการณ์เวลาไม่เข้าเงื่อนไขแล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 315,
        "endLine": 315
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": [
        "(ABILITY_EVENT_IDS as readonly string[]).includes(id)"
      ]
    },
    {
      "code": "event-target",
      "condition": "kindOwned(state,p,kind).includes(itemId)",
      "message": "'สินค้าไม่เข้าเงื่อนไข'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 320,
        "endLine": 320
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": []
    },
    {
      "code": "wish",
      "condition": "npc && offer.wish",
      "message": "'ไม่มีคำขอ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 322,
        "endLine": 322
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": [
        "id==='E73'"
      ]
    },
    {
      "code": "ability-cooldown",
      "condition": "npc",
      "message": "'ไม่มีสกิลที่ลดเวลารอได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 325,
        "endLine": 325
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": []
    },
    {
      "code": "known",
      "condition": "known(state,p,selected).genuine===undefined",
      "message": "'รู้ความแท้แล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 327,
        "endLine": 327
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": [
        "NOT choice==='compass'"
      ]
    },
    {
      "code": "event-cost",
      "condition": "state.config.systemLinks!==1 || eventChoices(state,p,id).includes(choice)",
      "message": "'ตัวเลือกนี้ไม่มีต้นทุนเพิ่มแล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 330,
        "endLine": 330
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": []
    },
    {
      "code": "event-target",
      "condition": "selected.startsWith('D') && selected!==next && status(p,selected)",
      "message": "'ล้างสถานะที่เลือกไม่ได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 333,
        "endLine": 333
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": []
    },
    {
      "code": "known",
      "condition": "known(state,p,v).genuine===undefined",
      "message": "'รู้แล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 338,
        "endLine": 338
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": []
    },
    {
      "code": "certificate",
      "condition": "state.items[v]!.certificate && known(state,p,v).certificate===undefined",
      "message": "'ไม่มีใบรับรองที่ตรวจได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 339,
        "endLine": 339
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": []
    },
    {
      "code": "comparison",
      "condition": "ids.length===2 && ids.every(v=>known(state,p,v).base===undefined)",
      "message": "'ไม่มีสินค้าคู่ที่ยังไม่รู้ราคา'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 340,
        "endLine": 340
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": []
    },
    {
      "code": "history",
      "condition": "price!==undefined",
      "message": "'ไม่มีประวัติราคา'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 341,
        "endLine": 341
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": []
    },
    {
      "code": "proof",
      "condition": "known(state,p,v).genuine===false && state.publicKnowledge[v]?.genuine===undefined",
      "message": "'ไม่มีผลตรวจใหม่ของปลอม'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 346,
        "endLine": 346
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": []
    },
    {
      "code": "barter",
      "condition": "!state.items[v]!.copy && NPC_SPECS[npc].favorite.includes(ownedItem(state,p,v,true).kind)",
      "message": "'NPC ไม่ต้องการของนี้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 352,
        "endLine": 352
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": []
    },
    {
      "code": "status",
      "condition": "status(p,'D07')",
      "message": "'ไม่มี D07'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 360,
        "endLine": 360
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": []
    },
    {
      "code": "status",
      "condition": "selected.startsWith('B') && selected!=='B10' && status(p,selected)",
      "message": "'เลือก buff ที่จะสละ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 361,
        "endLine": 361
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": []
    },
    {
      "code": "status",
      "condition": "['D01','D05'].includes(selected) && status(p,selected)",
      "message": "'เลือก D01 หรือ D05'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 362,
        "endLine": 362
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": []
    },
    {
      "code": "status",
      "condition": "selected.startsWith('D') && status(p,selected)",
      "message": "'เลือก debuff'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 372,
        "endLine": 372
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": []
    },
    {
      "code": "status",
      "condition": "status(p,'D10')",
      "message": "'ไม่มี D10'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 374,
        "endLine": 374
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": [
        "NOT choice==='energy'"
      ]
    },
    {
      "code": "bank",
      "condition": "state.bank-state.market.budget-state.reservedRewards>=1",
      "message": "'งบรางวัลไม่พอ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 375,
        "endLine": 375
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": []
    },
    {
      "code": "merchant-banned",
      "condition": "!state.config.secureEconomy || !merchantTradeBanned(state,p)",
      "message": "'ยังถูกห้ามค้าขายกับพ่อค้า'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 376,
        "endLine": 376
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": []
    },
    {
      "code": "collector",
      "condition": "movable(p).length>=2 && offer.quotedPrices[v]!==undefined",
      "message": "'ไม่มีข้อเสนอรับซื้อ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 376,
        "endLine": 376
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": []
    },
    {
      "code": "fact",
      "condition": "fact && ['base','genuine','cursed'].includes(fact)",
      "message": "'เลือกข้อมูลที่จะเปิด'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 377,
        "endLine": 377
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": []
    },
    {
      "code": "proof",
      "condition": "value!==undefined && state.publicKnowledge[v]?.[fact]===undefined && !p.revealedInfo.includes(`${v}:${fact}`)",
      "message": "'ข้อมูลนี้ยังไม่เคยตรวจหรือเปิดแล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 377,
        "endLine": 377
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": []
    },
    {
      "code": "guess",
      "condition": "typeof command.guess==='boolean' && known(state,p,v).genuine===undefined",
      "message": "'ต้องทายแท้หรือปลอมที่ยังไม่รู้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 378,
        "endLine": 378
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": []
    },
    {
      "code": "listing",
      "condition": "state.listings.some(l=>l.itemId===v && l.ownerId!==p.id && state.items[v]!.owner.startsWith('npc:'))",
      "message": "'รายการข้ามร้านไม่ได้เปิด'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 380,
        "endLine": 380
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": []
    },
    {
      "code": "ledger",
      "condition": "facts.length>0",
      "message": "'ผู้ประเมินคนนั้นไม่มีข้อมูลใหม่ให้คุณแล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 383,
        "endLine": 383
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": [
        "reworked(state)"
      ]
    },
    {
      "code": "status",
      "condition": "spec.avoid.every(s=>!status(p,s))",
      "message": "'ผลติดตัวนี้ทำให้เหตุการณ์ไม่มีความหมายแล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 391,
        "endLine": 391
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": []
    },
    {
      "code": "event-target",
      "condition": "picked && offer.boons?.includes(picked) && !status(p,picked)",
      "message": "'เลือกพรที่เสนอให้และยังไม่ติดตัว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 394,
        "endLine": 394
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": []
    },
    {
      "code": "status",
      "condition": "NEW_DEBUFFS.includes(selected) && status(p,selected)",
      "message": "'เลือกผลเสียจากฝูงหรือห้วงลึกที่ติดตัว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 399,
        "endLine": 399
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": []
    },
    {
      "code": "life",
      "condition": "p.life!>1",
      "message": "'ชีวิตไม่พอ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 402,
        "endLine": 402
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": [
        "state.config.survival"
      ]
    },
    {
      "code": "penalty",
      "condition": "p.credits<2 && !p.inventory.length",
      "message": "'ต้องเลือกค่าปรับที่ยังจ่ายได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/events.ts",
        "line": 405,
        "endLine": 405
      },
      "owner": "code:apps/comic/src/game/appraisal/events.ts:resolveEvent",
      "guards": [
        "NOT choice==='pay'",
        "NOT choice==='item'"
      ]
    },
    {
      "code": "ghost-phase",
      "condition": "s.config.survival&&s.phase!=='RESULTS'",
      "message": "'โลกวิญญาณปิดแล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 26,
        "endLine": 26
      },
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "guards": []
    },
    {
      "code": "ghost-alive",
      "condition": "p.life!==0",
      "message": "'เฉพาะผู้มีชีวิตจ้างงานได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 29,
        "endLine": 29
      },
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "guards": [
        "a.type==='ghost-hire'"
      ]
    },
    {
      "code": "ghost-unavailable",
      "condition": "g?.available",
      "message": "'วิญญาณยังไม่เปิดรับงาน'",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 29,
        "endLine": 29
      },
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "guards": [
        "a.type==='ghost-hire'"
      ]
    },
    {
      "code": "ghost-job",
      "condition": "!g.jobs.some(j=>j.buyerId===id&&active(j))",
      "message": "'มีงานค้างอยู่แล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 30,
        "endLine": 30
      },
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "guards": [
        "a.type==='ghost-hire'"
      ]
    },
    {
      "code": "ghost-fee",
      "condition": "Number.isSafeInteger(a.fee)&&a.fee>=0",
      "message": "'ค่าจ้างไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 30,
        "endLine": 30
      },
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "guards": [
        "a.type==='ghost-hire'"
      ]
    },
    {
      "code": "ghost-choice",
      "condition": "Number.isInteger(a.choice)&&q",
      "message": "'เลือกสินค้าที่เสนอ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 31,
        "endLine": 31
      },
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "guards": [
        "a.type==='ghost-hire'"
      ]
    },
    {
      "code": "ghost-quote",
      "condition": "a.quoteId===q.id",
      "message": "'ข้อเสนอเปลี่ยนแล้ว กรุณาเลือกใหม่'",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 31,
        "endLine": 31
      },
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "guards": [
        "a.type==='ghost-hire'"
      ]
    },
    {
      "code": "credits",
      "condition": "p.credits>=q.price+a.fee",
      "message": "'เครดิตไม่พอสำหรับราคาที่ตกลง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 31,
        "endLine": 31
      },
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "guards": [
        "a.type==='ghost-hire'"
      ]
    },
    {
      "code": "ghost-dead",
      "condition": "p.life===0",
      "message": "'ต้องหมดชีวิตก่อนเข้าโลกวิญญาณ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 34,
        "endLine": 34
      },
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "guards": []
    },
    {
      "code": "ghost-busy",
      "condition": "g.tracking?.status!=='guessing'&&!g.available&&!g.jobs.some(active)",
      "message": "'กำลังเปิดบริการหรือมีงานค้าง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 37,
        "endLine": 37
      },
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "guards": [
        "a.type==='ghost-start'"
      ]
    },
    {
      "code": "ghost-clock",
      "condition": "a.startedAt===undefined||Number.isSafeInteger(a.startedAt)&&a.startedAt>=0",
      "message": "'เวลามินิเกมไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 37,
        "endLine": 37
      },
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "guards": [
        "a.type==='ghost-start'"
      ]
    },
    {
      "code": "ghost-round",
      "condition": "g.tracking&&a.round===g.round",
      "message": "'รอบการ์ดผ่านไปแล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 42,
        "endLine": 42
      },
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "guards": [
        "a.type==='ghost-guess'"
      ]
    },
    {
      "code": "ghost-locked",
      "condition": "g.available",
      "message": "'ชนะมินิเกมก่อน'",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 44,
        "endLine": 44
      },
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "guards": []
    },
    {
      "code": "ghost-job",
      "condition": "j?.status==='offered'",
      "message": "'ข้อเสนอนี้ผ่านไปแล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 45,
        "endLine": 45
      },
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "guards": [
        "a.type==='ghost-accept'"
      ]
    },
    {
      "code": "ghost-buyer",
      "condition": "player(s,j.buyerId).life!==0",
      "message": "'ผู้ว่าจ้างหมดชีวิตแล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 45,
        "endLine": 45
      },
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "guards": [
        "a.type==='ghost-accept'"
      ]
    },
    {
      "code": "ghost-slot",
      "condition": "Number.isInteger(a.slot)&&slot",
      "message": "'ช่องสินค้าไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 47,
        "endLine": 47
      },
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "guards": []
    },
    {
      "code": "ghost-lost",
      "condition": "!slot.lost",
      "message": "'ช่องนี้แพ้แล้ว รอช่วงหน้า'",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 49,
        "endLine": 49
      },
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "guards": [
        "a.type==='ghost-rps'"
      ]
    },
    {
      "code": "ghost-job",
      "condition": "g.jobs.some(j=>j.status==='accepted')",
      "message": "'รับงานก่อนตามหาของ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 49,
        "endLine": 49
      },
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "guards": [
        "a.type==='ghost-rps'"
      ]
    },
    {
      "code": "ghost-hand",
      "condition": "h>=0",
      "message": "'มือไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 50,
        "endLine": 50
      },
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "guards": [
        "a.type==='ghost-rps'"
      ]
    },
    {
      "code": "ghost-target",
      "condition": "j?.status==='accepted'&&j.kind===slot.kind",
      "message": "'ซื้อได้เฉพาะของตามงาน'",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 53,
        "endLine": 53
      },
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "guards": []
    },
    {
      "code": "ghost-buyer",
      "condition": "buyer.life!==0",
      "message": "'ผู้ว่าจ้างหมดชีวิตแล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 53,
        "endLine": 53
      },
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "guards": []
    },
    {
      "code": "credits",
      "condition": "buyer.credits>=j.price+j.fee",
      "message": "'รอผู้ว่าจ้างเติมเครดิตก่อนส่งมอบ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 53,
        "endLine": 53
      },
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "guards": []
    },
    {
      "code": "ghost-duplicate",
      "condition": "!s.items[itemId]",
      "message": "'ส่งของแล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/ghost-service.ts",
        "line": 54,
        "endLine": 54
      },
      "owner": "code:apps/comic/src/game/appraisal/ghost-service.ts:handleGhostCommand",
      "guards": []
    },
    {
      "code": "unknown-player",
      "condition": "p",
      "message": "'ไม่พบผู้เล่น'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 32,
        "endLine": 32
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:player",
      "guards": []
    },
    {
      "code": "cost",
      "condition": "Number.isSafeInteger(credits) && credits >= 0 && Number.isSafeInteger(energy) && energy >= 0",
      "message": "'ต้นทุนไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 107,
        "endLine": 107
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:spend",
      "guards": []
    },
    {
      "code": "credits",
      "condition": "p.credits >= credits",
      "message": "'credit ไม่พอ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 108,
        "endLine": 108
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:spend",
      "guards": []
    },
    {
      "code": "energy",
      "condition": "p.energy >= energy",
      "message": "'พลังไม่พอ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 108,
        "endLine": 108
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:spend",
      "guards": []
    },
    {
      "code": "reward",
      "condition": "Number.isSafeInteger(credits) && credits >= 0",
      "message": "'รางวัลไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 114,
        "endLine": 114
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:reward",
      "guards": []
    },
    {
      "code": "bank",
      "condition": "credits <= state.bank - (market ? 0 : state.market.budget + state.reservedRewards)",
      "message": "'งบรางวัลไม่พอ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 115,
        "endLine": 115
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:reward",
      "guards": []
    },
    {
      "code": "credits",
      "condition": "Number.isSafeInteger(credits) && credits >= 0 && from.credits >= credits",
      "message": "'credit ไม่พอ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 120,
        "endLine": 120
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:transfer",
      "guards": []
    },
    {
      "code": "passive-reward",
      "condition": "passivesEnabled(state.config) && Number.isSafeInteger(amount) && amount>=0",
      "message": "'โบนัสสินค้าไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 126,
        "endLine": 126
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:fundPassive",
      "guards": []
    },
    {
      "code": "life",
      "condition": "state.config.survival && p.life!==undefined && p.life>0",
      "message": "'ผู้ตายฟื้นกลับมาใน run นี้ไม่ได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 137,
        "endLine": 137
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:healLife",
      "guards": []
    },
    {
      "code": "life",
      "condition": "p.life!==undefined",
      "message": "'กติกานี้ไม่มีชีวิตแยก'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 142,
        "endLine": 142
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:damageLife",
      "guards": []
    },
    {
      "code": "owner",
      "condition": "item && item.owner === p.id && p.inventory.includes(itemId)",
      "message": "'ไม่ได้เป็นเจ้าของสินค้า'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 194,
        "endLine": 194
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:ownedItem",
      "guards": []
    },
    {
      "code": "locked",
      "condition": "!movable || unlocked(p,itemId)",
      "message": "'สินค้าถูกล็อก'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 195,
        "endLine": 195
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:ownedItem",
      "guards": []
    },
    {
      "code": "stock",
      "condition": "item && item.encounter === state.encounter && item.npcOwnerId === p.id && p.stock.includes(itemId) && item.owner === `npc:${p.id}:${state.encounter}`",
      "message": "'สินค้านี้ไม่มีในร้านแล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 211,
        "endLine": 211
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:stockItem",
      "guards": []
    },
    {
      "code": "property",
      "condition": "['price','authenticity','effects'].includes(property)",
      "message": "'ข้อมูลที่จะตรวจไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 226,
        "endLine": 226
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:inspect",
      "guards": []
    },
    {
      "code": "inspect",
      "condition": "item && (item.owner === p.id || p.stock.includes(itemId))",
      "message": "'ตรวจได้เฉพาะของตนหรือร้านปัจจุบัน'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 228,
        "endLine": 228
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:inspect",
      "guards": []
    },
    {
      "code": "inspections",
      "condition": "merchantFree || p.inspections < inspectionLimit(state,p)",
      "message": "'ใช้สิทธิ์ตรวจครบแล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 230,
        "endLine": 230
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:inspect",
      "guards": []
    },
    {
      "code": "known",
      "condition": "property === 'price' ? k.base === undefined : property === 'authenticity' ? k.genuine === undefined : state.config.curseSight ? k.cursed === undefined : !k.effectsKnown || (status(p,'B02') && k.cursed === undefined)",
      "message": "'รู้ข้อมูลนี้แล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 232,
        "endLine": 232
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:inspect",
      "guards": []
    },
    {
      "code": "price",
      "condition": "Number.isSafeInteger(value) && value >= 0 && value <= 1000",
      "message": "'ราคาประเมินไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 272,
        "endLine": 272
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:appraise",
      "guards": []
    },
    {
      "code": "appraisal",
      "condition": "counter ? p.valuations[itemId] && p.counters < counterLimit(p) : !p.valuations[itemId]",
      "message": "'ไม่มีสิทธิ์ประเมินหรือต่อรองเพิ่ม'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 273,
        "endLine": 273
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:appraise",
      "guards": []
    },
    {
      "code": "danger",
      "condition": "item.npc !== 'darkone' || acceptDanger",
      "message": "'ต้องยอมรับขอบเขตผลเสียของ Dark One ก่อน'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 274,
        "endLine": 274
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:appraise",
      "guards": []
    },
    {
      "code": "merchant-banned",
      "condition": "!state.config.secureEconomy || !merchantTradeBanned(state,buyer) && !merchantTradeBanned(state,shop)",
      "message": "'ยังถูกห้ามค้าขายกับพ่อค้า'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 385,
        "endLine": 385
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:purchase",
      "guards": []
    },
    {
      "code": "bundle",
      "condition": "Array.isArray(itemIds) && itemIds.length > 0 && itemIds.length<=2 && itemIds.every(id=>typeof id==='string') && new Set(itemIds).size === itemIds.length",
      "message": "'ชุดสินค้าไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 386,
        "endLine": 386
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:purchase",
      "guards": []
    },
    {
      "code": "condition",
      "condition": "shop.dealMode !== 'condition' || options.condition",
      "message": "'ข้อเสนอนี้ต้องรับเงื่อนไข'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 389,
        "endLine": 389
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:purchase",
      "guards": []
    },
    {
      "code": "condition",
      "condition": "shop.dealMode !== 'cash' || !options.condition",
      "message": "'ข้อเสนอนี้รับ credit อย่างเดียว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 390,
        "endLine": 390
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:purchase",
      "guards": []
    },
    {
      "code": "bundle",
      "condition": "items.every(item => item.npc === items[0]!.npc)",
      "message": "'สินค้าไม่ได้อยู่ร้านเดียวกัน'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 391,
        "endLine": 391
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:purchase",
      "guards": []
    },
    {
      "code": "condition",
      "condition": "!options.condition || !['D04','D07'].includes(profile.condition) || !!state.config.survival || state.encounter < state.config.encounters",
      "message": "'เงื่อนไขนี้ไม่มี encounter ถัดไป'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 392,
        "endLine": 392
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:purchase",
      "guards": []
    },
    {
      "code": "activated",
      "condition": "!p.activated.includes(itemId)",
      "message": "'เปิดใช้ชิ้นนี้ใน encounter แล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 431,
        "endLine": 431
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
      "guards": []
    },
    {
      "code": "activation",
      "condition": "!isRemaining48Kind(item.kind)",
      "message": "'สินค้านี้ยังไม่มีสิทธิ์เปิดใช้ในรันนี้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 433,
        "endLine": 433
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
      "guards": []
    },
    {
      "code": "activation",
      "condition": "(state.config.catalogVersion===4 || state.config.catalogVersion===5) && spec.explicitActivation",
      "message": "'สินค้านี้ทำงานผ่านระบบที่ระบุ ไม่เปิดใช้แยก'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 434,
        "endLine": 434
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
      "guards": [
        "spec.nativeEffect"
      ]
    },
    {
      "code": "activated",
      "condition": "pilotUses(state,item)===0",
      "message": "'สินค้าชิ้นนี้ใช้ในช่วงนี้แล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 434,
        "endLine": 434
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
      "guards": [
        "spec.nativeEffect"
      ]
    },
    {
      "code": "ability-item",
      "condition": "!p.abilityItemUsed?.includes(item.kind)",
      "message": "'สินค้าชนิดนี้ใช้ได้ครั้งเดียวต่อช่วง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 445,
        "endLine": 445
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
      "guards": [
        "works",
        "NOT spec.nativeEffect==='effect:E62'",
        "state.config.trustAbilities && (ABILITY_ITEM_IDS as readonly string[]).includes(item.kind)"
      ]
    },
    {
      "code": "ability-cooldown",
      "condition": "npc && Object.hasOwn(MERCHANT_ABILITIES,npc) && (p.npcTrust?.[npc]??0)>=1 && reducibleCooldown(p,npc,state.encounter)>0",
      "message": "'เลือกสกิลที่ยังลดเวลารอได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 447,
        "endLine": 447
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
      "guards": [
        "works",
        "NOT spec.nativeEffect==='effect:E62'",
        "state.config.trustAbilities && (ABILITY_ITEM_IDS as readonly string[]).includes(item.kind)",
        "item.kind==='chrono-gear' || item.kind==='burden-hourglass'"
      ]
    },
    {
      "code": "ability-cooldown",
      "condition": "otherNpc && otherNpc!==npc && Object.hasOwn(MERCHANT_ABILITIES,otherNpc) && (p.npcTrust?.[otherNpc]??0)>=1 && (p.abilityReady?.[otherNpc]??0)>state.encounter",
      "message": "'เลือกสกิลอื่นที่ยังรออยู่'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 448,
        "endLine": 448
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:activate",
      "guards": [
        "works",
        "NOT spec.nativeEffect==='effect:E62'",
        "state.config.trustAbilities && (ABILITY_ITEM_IDS as readonly string[]).includes(item.kind)",
        "item.kind==='chrono-gear' || item.kind==='burden-hourglass'",
        "item.kind==='burden-hourglass'"
      ]
    },
    {
      "code": "market-resolution",
      "condition": "resolution==='discount' || resolution==='sacrifice'",
      "message": "'เลือกรับราคาลดหรือสละตามเงื่อนไข'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 520,
        "endLine": 520
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:marketSell",
      "guards": []
    },
    {
      "code": "stolen",
      "condition": "!item.stolen",
      "message": "'ของที่ฉกมาขาย Dark Market ไม่ได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 522,
        "endLine": 522
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:marketSell",
      "guards": []
    },
    {
      "code": "market-closed",
      "condition": "state.market.open && state.market.encounter === state.encounter",
      "message": "'Dark Market ปิดแล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 523,
        "endLine": 523
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:marketSell",
      "guards": []
    },
    {
      "code": "market-order",
      "condition": "order && order.kind === item.kind && (order.quota[p.id] ?? 0) > 0",
      "message": "'ไม่มีสิทธิ์รับซื้อตามรายการ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 524,
        "endLine": 524
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:marketSell",
      "guards": []
    },
    {
      "code": "market-budget",
      "condition": "state.market.budget>=reserved",
      "message": "'งบรับซื้อหมด'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 525,
        "endLine": 525
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:marketSell",
      "guards": []
    },
    {
      "code": "energy",
      "condition": "p.energy>=cost.amount",
      "message": "'พลังไม่พอสำหรับเงื่อนไขราคาเต็ม'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 531,
        "endLine": 531
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:marketSell",
      "guards": [
        "contract && resolution==='sacrifice'",
        "cost.kind==='energy'"
      ]
    },
    {
      "code": "market-cost",
      "condition": "!status(p,cost.statusId) || status(p,'B06')",
      "message": "'มีผลเสียนี้อยู่แล้ว รับซ้ำเพื่อแลกราคาเต็มไม่ได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 532,
        "endLine": 532
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:marketSell",
      "guards": [
        "contract && resolution==='sacrifice'",
        "cost.kind==='debuff'"
      ]
    },
    {
      "code": "life",
      "condition": "state.config.survival && p.life!>cost.amount",
      "message": "'ต้องเหลือชีวิตอย่างน้อย 1 หลังจ่าย'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 533,
        "endLine": 533
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:marketSell",
      "guards": [
        "contract && resolution==='sacrifice'",
        "cost.kind==='life'"
      ]
    },
    {
      "code": "bank",
      "condition": "maximum<=state.bank-(state.market.budget-reserved)-state.reservedRewards",
      "message": "'งบรับซื้อไม่พอโดยไม่แตะสัญญาอื่น'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 537,
        "endLine": 537
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:marketSell",
      "guards": [
        "state.config.rarityEconomy"
      ]
    },
    {
      "code": "life",
      "condition": "state.config.survival && p.life!>cost.amount",
      "message": "'ต้องเหลือชีวิตอย่างน้อย 1 หลังจ่าย'",
      "source": {
        "file": "apps/comic/src/game/appraisal/mechanics.ts",
        "line": 545,
        "endLine": 545
      },
      "owner": "code:apps/comic/src/game/appraisal/mechanics.ts:marketSell",
      "guards": [
        "contract && !matched",
        "NOT resolution==='discount'",
        "NOT cost.kind==='energy'",
        "cost.kind==='life'"
      ]
    },
    {
      "code": "ability-choice",
      "condition": "choice && choice.itemIds.includes(choiceId)",
      "message": "'เลือกสินค้าที่เสนอให้เท่านั้น'",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 58,
        "endLine": 58
      },
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:settleAbilityChoice",
      "guards": []
    },
    {
      "code": "ability-choice",
      "condition": "chosen.owner===`ability-choice:${p.id}`",
      "message": "'สินค้านี้ไม่อยู่ในข้อเสนอ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 62,
        "endLine": 62
      },
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:settleAbilityChoice",
      "guards": [
        "choice.npc==='alien'"
      ]
    },
    {
      "code": "ability-choice",
      "condition": "chosen.owner===`ability-choice:${p.id}`",
      "message": "'สินค้านี้ไม่อยู่ในข้อเสนอ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 69,
        "endLine": 69
      },
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:settleAbilityChoice",
      "guards": [
        "NOT choice.npc==='alien'",
        "choiceId!==source.id"
      ]
    },
    {
      "code": "ability",
      "condition": "state.config.trustAbilities && activeNpcs(state).includes(action.npc)",
      "message": "'ห้องนี้ไม่มีความสามารถที่เลือก'",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 82,
        "endLine": 82
      },
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:useMerchantAbility",
      "guards": []
    },
    {
      "code": "ability-choice",
      "condition": "p.abilityChoice?.npc===action.npc",
      "message": "'ไม่มีข้อเสนอของพ่อค้านี้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 83,
        "endLine": 83
      },
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:useMerchantAbility",
      "guards": [
        "action.choiceId"
      ]
    },
    {
      "code": "ability",
      "condition": "view.ready",
      "message": "view.reason??'ความสามารถยังไม่พร้อม'",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 85,
        "endLine": 85
      },
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:useMerchantAbility",
      "guards": []
    },
    {
      "code": "ability-target",
      "condition": "action.itemId && view.itemIds.includes(action.itemId)",
      "message": "'เลือกสินค้าที่ใช้ความสามารถนี้ได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 87,
        "endLine": 87
      },
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:useMerchantAbility",
      "guards": []
    },
    {
      "code": "ability-target",
      "condition": "action.statusId && view.statusIds.includes(action.statusId)",
      "message": "'เลือก debuff ที่มีอยู่'",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 92,
        "endLine": 92
      },
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:useMerchantAbility",
      "guards": []
    },
    {
      "code": "ability-copy",
      "condition": "!state.items[id]",
      "message": "'ต้นฉบับนี้เคยมีสำเนาแล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/merchant-abilities.ts",
        "line": 97,
        "endLine": 97
      },
      "owner": "code:apps/comic/src/game/appraisal/merchant-abilities.ts:useMerchantAbility",
      "guards": []
    },
    {
      "code": "life",
      "condition": "state.config.survival && p.life!>amount",
      "message": "'ชีวิตไม่พอจ่ายและต้องเหลืออย่างน้อย 1'",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 76,
        "endLine": 76
      },
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:payLife",
      "guards": []
    },
    {
      "code": "event-ineligible",
      "condition": "npcEventEligible(state,p,offer.id)",
      "message": "'เงื่อนไขอีเวนต์พ่อค้าเปลี่ยนไปแล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 81,
        "endLine": 81
      },
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent",
      "guards": []
    },
    {
      "code": "event-terms",
      "condition": "terms",
      "message": "'ไม่มีเงื่อนไขข้อตกลง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 82,
        "endLine": 82
      },
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent",
      "guards": []
    },
    {
      "code": "event-target",
      "condition": "command.itemId && offer.itemIds.includes(command.itemId)",
      "message": "'เลือกสินค้าที่เสนอให้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 83,
        "endLine": 83
      },
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent",
      "guards": []
    },
    {
      "code": "event-cost",
      "condition": "p.credits>=terms.credits && p.energy>=energy && (!terms.life || p.life!>terms.life)",
      "message": "'ทรัพยากรไม่พอจ่ายข้อตกลง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 87,
        "endLine": 87
      },
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent",
      "guards": []
    },
    {
      "code": "event-target",
      "condition": "victim",
      "message": "'เลือกผู้เล่นอื่นที่ยังมีชีวิต'",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 90,
        "endLine": 90
      },
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent",
      "guards": [
        "command.choice==='send-debuff'"
      ]
    },
    {
      "code": "event-target",
      "condition": "command.statusId && offer.statusIds.includes(command.statusId) && command.statusId.startsWith('D') && status(p,command.statusId)",
      "message": "'เลือกผลเสียที่คุณมีอยู่'",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 91,
        "endLine": 91
      },
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent",
      "guards": [
        "command.choice==='purge'"
      ]
    },
    {
      "code": "event-target",
      "condition": "Number.isInteger(count) && count>=1 && count<=terms.loanMax! && Array.isArray(ids) && ids.length===count && new Set(ids).size===count && ids.every(id=>offer.itemIds.includes(id))",
      "message": "'เลือกของให้ยืมให้ครบจำนวนและห้ามซ้ำ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 98,
        "endLine": 98
      },
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent",
      "guards": []
    },
    {
      "code": "bank",
      "condition": "freeBank(state)>=8*count",
      "message": "'งบผลตอบแทนไม่พอ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 100,
        "endLine": 100
      },
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent",
      "guards": []
    },
    {
      "code": "event-target",
      "condition": "clues.length",
      "message": "'ไม่มีข้อมูลใหม่ในร้าน'",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 116,
        "endLine": 116
      },
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:resolvePersonalNpcEvent",
      "guards": []
    },
    {
      "code": "loan-owner",
      "condition": "state.items[id]?.owner===`alien-loan:${p.id}`",
      "message": "'ของที่ให้ยืมไม่ตรงสัญญา'",
      "source": {
        "file": "apps/comic/src/game/appraisal/npc-events.ts",
        "line": 127,
        "endLine": 127
      },
      "owner": "code:apps/comic/src/game/appraisal/npc-events.ts:returnLoanItems",
      "guards": []
    },
    {
      "code": "price",
      "condition": "Number.isSafeInteger(value) && value>=0",
      "message": "'ราคาที่ตรวจสอบไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/price-integrity.ts",
        "line": 17,
        "endLine": 17
      },
      "owner": "code:apps/comic/src/game/appraisal/price-integrity.ts:auditItemPrice",
      "guards": []
    },
    {
      "code": "price",
      "condition": "Number.isSafeInteger(paidPrice) && paidPrice>=0",
      "message": "'ราคาซื้อขายไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/price-integrity.ts",
        "line": 29,
        "endLine": 29
      },
      "owner": "code:apps/comic/src/game/appraisal/price-integrity.ts:recordItemTrade",
      "guards": []
    },
    {
      "code": "liquidate",
      "condition": "state.config.secureEconomy && ['APPRAISAL','TRADE'].includes(state.phase)",
      "message": "'ยังขายของเพื่อรับเงินสดไม่ได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/price-integrity.ts",
        "line": 46,
        "endLine": 46
      },
      "owner": "code:apps/comic/src/game/appraisal/price-integrity.ts:liquidateOwnedItem",
      "guards": []
    },
    {
      "code": "stolen",
      "condition": "!item.stolen",
      "message": "'ของที่ฉกมาขาย Dark Market ไม่ได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/price-integrity.ts",
        "line": 48,
        "endLine": 48
      },
      "owner": "code:apps/comic/src/game/appraisal/price-integrity.ts:liquidateOwnedItem",
      "guards": []
    },
    {
      "code": "reappraisal",
      "condition": "state.config.secureEconomy && ['APPRAISAL','TRADE'].includes(state.phase)",
      "message": "'ยังประเมินของในมือใหม่ไม่ได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/price-integrity.ts",
        "line": 58,
        "endLine": 58
      },
      "owner": "code:apps/comic/src/game/appraisal/price-integrity.ts:reappraiseOwnedItem",
      "guards": []
    },
    {
      "code": "price",
      "condition": "Number.isSafeInteger(value) && value>=0 && value<=1000",
      "message": "'ราคาประเมินไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/price-integrity.ts",
        "line": 60,
        "endLine": 60
      },
      "owner": "code:apps/comic/src/game/appraisal/price-integrity.ts:reappraiseOwnedItem",
      "guards": []
    },
    {
      "code": "reappraisal-used",
      "condition": "item.priceIntegrity?.lastReappraisedEncounter!==state.encounter",
      "message": "'ประเมินของชิ้นนี้ใหม่แล้วในช่วงนี้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/price-integrity.ts",
        "line": 61,
        "endLine": 61
      },
      "owner": "code:apps/comic/src/game/appraisal/price-integrity.ts:reappraiseOwnedItem",
      "guards": []
    },
    {
      "code": "round-reward",
      "condition": "state.phase==='REVEAL' && state.config.multiCoinRewards && r && !r.settled && r.amount>0",
      "message": "'ไม่มีรางวัลที่ทบได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/round-rewards.ts",
        "line": 23,
        "endLine": 23
      },
      "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:raiseRoundReward",
      "guards": []
    },
    {
      "code": "coin-attempt",
      "condition": "Number.isSafeInteger(coinCount) && coinCount===(r.coinCount??1)+1 && attempt===r.flips+1",
      "message": "'ใช้จำนวนเหรียญและผลล่าสุดก่อนทบ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/round-rewards.ts",
        "line": 24,
        "endLine": 24
      },
      "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:raiseRoundReward",
      "guards": []
    },
    {
      "code": "credits",
      "condition": "p.credits>=r.base",
      "message": "'เครดิตในกระเป๋าไม่พอเพิ่มเหรียญ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/round-rewards.ts",
        "line": 25,
        "endLine": 25
      },
      "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:raiseRoundReward",
      "guards": []
    },
    {
      "code": "round-reward",
      "condition": "Number.isSafeInteger(r.amount+r.base)",
      "message": "'ยอดเดิมพันสูงเกินไป'",
      "source": {
        "file": "apps/comic/src/game/appraisal/round-rewards.ts",
        "line": 26,
        "endLine": 26
      },
      "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:raiseRoundReward",
      "guards": []
    },
    {
      "code": "round-reward",
      "condition": "state.phase==='REVEAL' && r && !r.settled",
      "message": "'ไม่มีรางวัลที่เดิมพันได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/round-rewards.ts",
        "line": 33,
        "endLine": 33
      },
      "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:flipRoundReward",
      "guards": []
    },
    {
      "code": "coin-side",
      "condition": "guess==='heads' || guess==='tails'",
      "message": "'เลือกหัวหรือก้อย'",
      "source": {
        "file": "apps/comic/src/game/appraisal/round-rewards.ts",
        "line": 34,
        "endLine": 34
      },
      "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:flipRoundReward",
      "guards": []
    },
    {
      "code": "coin-attempt",
      "condition": "Number.isSafeInteger(attempt) && attempt===r.flips+1",
      "message": "'ใช้ผลการโยนเหรียญล่าสุดก่อนเล่นต่อ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/round-rewards.ts",
        "line": 35,
        "endLine": 35
      },
      "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:flipRoundReward",
      "guards": []
    },
    {
      "code": "coin-side",
      "condition": "Array.isArray(calls) && calls.length===r.coinCount && calls[0]===guess && calls.every(call=>call==='heads' || call==='tails')",
      "message": "'ทายหัวหรือก้อยให้ครบทุกเหรียญ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/round-rewards.ts",
        "line": 38,
        "endLine": 38
      },
      "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:flipRoundReward",
      "guards": [
        "state.config.multiCoinRewards"
      ]
    },
    {
      "code": "round-reward",
      "condition": "Number.isSafeInteger(amount)",
      "message": "'ยอดเดิมพันสูงเกินไป'",
      "source": {
        "file": "apps/comic/src/game/appraisal/round-rewards.ts",
        "line": 50,
        "endLine": 50
      },
      "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:flipRoundReward",
      "guards": [
        "state.config.multiCoinRewards"
      ]
    },
    {
      "code": "coin-side",
      "condition": "guesses===undefined",
      "message": "'กติกานี้ทายได้ครั้งละหนึ่งเหรียญ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/round-rewards.ts",
        "line": 56,
        "endLine": 56
      },
      "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:flipRoundReward",
      "guards": []
    },
    {
      "code": "round-reward",
      "condition": "state.phase==='REVEAL' && r && !r.settled",
      "message": "'ไม่มีรางวัลที่รับได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/round-rewards.ts",
        "line": 66,
        "endLine": 66
      },
      "owner": "code:apps/comic/src/game/appraisal/round-rewards.ts:bankRoundReward",
      "guards": []
    },
    {
      "code": "seal-terms",
      "condition": "value === undefined || typeof value === 'string' && value.length <= 500",
      "message": "'ข้อตกลงยาวได้ไม่เกิน 500 ตัวอักษร'",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 55,
        "endLine": 55
      },
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:text",
      "guards": []
    },
    {
      "code": null,
      "condition": "Number.isSafeInteger(value) && value >= 0",
      "message": "'จำนวนที่เสนอไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 58,
        "endLine": 58
      },
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:amount",
      "guards": []
    },
    {
      "code": "seal-owner",
      "condition": "seal && seal.holderId === p.id",
      "message": "'ไม่ได้ถือตรานี้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 66,
        "endLine": 66
      },
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:ownSeal",
      "guards": []
    },
    {
      "code": "seal-locked",
      "condition": "!lockedSealIds(state).has(seal.id)",
      "message": "'ตรานี้อยู่ระหว่างข้อเสนอหรือการใช้สิทธิ์'",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 67,
        "endLine": 67
      },
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:ownSeal",
      "guards": []
    },
    {
      "code": "seal-party",
      "condition": "buyer.id !== p.id && alive(buyer)",
      "message": "'ต้องขายให้ผู้เล่นอื่นที่ยังมีชีวิต'",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 80,
        "endLine": 80
      },
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:offerSeal",
      "guards": []
    },
    {
      "code": "seal-items",
      "condition": "Number.isSafeInteger(action.goods) && action.goods >= 0 && action.goods <= 8",
      "message": "'จำนวนสินค้าที่ขอไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 82,
        "endLine": 82
      },
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:offerSeal",
      "guards": []
    },
    {
      "code": "seal-life",
      "condition": "action.life === 0 || state.config.survival",
      "message": "'ห้องนี้ไม่มีชีวิตให้แลก'",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 83,
        "endLine": 83
      },
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:offerSeal",
      "guards": []
    },
    {
      "code": "seal-empty",
      "condition": "action.credits+action.energy+action.life+action.goods > 0 || text(action.terms) !== ''",
      "message": "'ต้องระบุสิ่งตอบแทนหรือข้อตกลง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 84,
        "endLine": 84
      },
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:offerSeal",
      "guards": []
    },
    {
      "code": "seal-locked",
      "condition": "!offers(state).some(o => o.status === 'open' && o.sealId === seal.id)",
      "message": "'ตรานี้มีข้อเสนอค้างอยู่'",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 85,
        "endLine": 85
      },
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:offerSeal",
      "guards": []
    },
    {
      "code": "seal-response",
      "condition": "typeof accept === 'boolean'",
      "message": "'คำตอบไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 92,
        "endLine": 92
      },
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:respondOffer",
      "guards": []
    },
    {
      "code": "seal-offer",
      "condition": "offer && offer.status === 'open' && offer.buyerId === p.id && offer.encounter === state.encounter",
      "message": "'ไม่มีข้อเสนอซื้อตรานี้ให้ตอบ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 94,
        "endLine": 94
      },
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:respondOffer",
      "guards": []
    },
    {
      "code": "seal-owner",
      "condition": "seal && seal.holderId === holder.id && !redemptions(state).some(r => r.status === 'open' && r.sealIds.includes(seal.id))",
      "message": "'ผู้ขายไม่ได้ถือตรานี้แล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 98,
        "endLine": 98
      },
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:respondOffer",
      "guards": []
    },
    {
      "code": "seal-party",
      "condition": "alive(holder) && alive(p)",
      "message": "'คู่ค้าต้องยังมีชีวิต'",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 99,
        "endLine": 99
      },
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:respondOffer",
      "guards": []
    },
    {
      "code": "seal-items",
      "condition": "Array.isArray(itemIds) && itemIds.length === offer.goods && new Set(itemIds).size === itemIds.length",
      "message": "'ต้องเลือกสินค้าให้ตรงจำนวนที่ผู้ขายขอ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 100,
        "endLine": 100
      },
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:respondOffer",
      "guards": []
    },
    {
      "code": "credits",
      "condition": "p.credits >= offer.credits",
      "message": "'เครดิตไม่พอ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 102,
        "endLine": 102
      },
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:respondOffer",
      "guards": []
    },
    {
      "code": "seal-energy",
      "condition": "p.energy >= offer.energy && holder.energy+offer.energy <= maxEnergyOf(state,holder)",
      "message": "'พลังไม่พอหรือผู้รับเต็ม'",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 103,
        "endLine": 103
      },
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:respondOffer",
      "guards": []
    },
    {
      "code": "seal-life",
      "condition": "(p.life ?? 0) > offer.life && (holder.life ?? 0)+offer.life <= (maxLifeOf(state,holder) ?? 0)",
      "message": "'ชีวิตผู้จ่ายต้องเหลือ 1 ขึ้นไป และผู้รับต้องไม่เกินขีดสูงสุด'",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 104,
        "endLine": 104
      },
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:respondOffer",
      "guards": [
        "offer.life > 0"
      ]
    },
    {
      "code": "seal-party",
      "condition": "thief.id !== p.id",
      "message": "'ใช้ตรากับตัวเองไม่ได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 121,
        "endLine": 121
      },
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:redeem",
      "guards": []
    },
    {
      "code": "seal-pending",
      "condition": "!redemptions(state).some(r => r.status === 'open' && r.holderId === p.id)",
      "message": "'เลือกสินค้าจากตราชุดก่อนให้เสร็จก่อน'",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 122,
        "endLine": 122
      },
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:redeem",
      "guards": []
    },
    {
      "code": "seal-count",
      "condition": "usable.length >= SEALS_PER_REDEMPTION",
      "message": "'ต้องมีตราของผู้ขโมยคนเดียวกัน 2 ใบ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 125,
        "endLine": 125
      },
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:redeem",
      "guards": []
    },
    {
      "code": "seal-empty-pool",
      "condition": "pool.length > 0",
      "message": "'ผู้ขโมยไม่มีของติดตัวที่ยึดได้ในตอนนี้ ตรายังอยู่'",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 128,
        "endLine": 128
      },
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:redeem",
      "guards": []
    },
    {
      "code": "seal-pick",
      "condition": "redemption && redemption.status === 'open' && redemption.holderId === p.id && redemption.encounter === state.encounter",
      "message": "'ไม่มีชุดที่เลือกได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 140,
        "endLine": 140
      },
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:pick",
      "guards": []
    },
    {
      "code": "seal-slot",
      "condition": "Number.isSafeInteger(slotIndex) && slotIndex >= 0 && slotIndex < redemption.slots.length",
      "message": "'ช่องที่เลือกไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 141,
        "endLine": 141
      },
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:pick",
      "guards": []
    },
    {
      "code": "seal-slot",
      "condition": "!slot.gone",
      "message": "'ช่องนี้ว่างแล้ว เลือกช่องอื่น'",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 143,
        "endLine": 143
      },
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:pick",
      "guards": []
    },
    {
      "code": "seal",
      "condition": "state.config.secureEconomy && alive(p)",
      "message": "'ใช้ตราคนบาปไม่ได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 161,
        "endLine": 161
      },
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:handleSealAction",
      "guards": []
    },
    {
      "code": "seal-offer",
      "condition": "offer && offer.status === 'open' && offer.holderId === p.id",
      "message": "'ไม่มีข้อเสนอที่ยกเลิกได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 167,
        "endLine": 167
      },
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:handleSealAction",
      "guards": []
    },
    {
      "code": "seal",
      "condition": "!ids.has(seal.id) && seal.thiefId !== seal.holderId && state.players.some(p => p.id === seal.thiefId) && state.players.some(p => p.id === seal.holderId)",
      "message": "'ตราคนบาปไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 197,
        "endLine": 197
      },
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:sealInvariants",
      "guards": []
    },
    {
      "code": "seal",
      "condition": "r.sealIds.every(id => ids.has(id))",
      "message": "'ชุดเลือกอ้างตราที่ไม่มีอยู่'",
      "source": {
        "file": "apps/comic/src/game/appraisal/seals.ts",
        "line": 200,
        "endLine": 200
      },
      "owner": "code:apps/comic/src/game/appraisal/seals.ts:sealInvariants",
      "guards": [
        "r.status === 'open'"
      ]
    },
    {
      "code": "credits",
      "condition": "Number.isSafeInteger(amount) && amount>0",
      "message": "'จำนวนเครดิตต้องเป็นจำนวนเต็มบวก'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 34,
        "endLine": 34
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:positive",
      "guards": []
    },
    {
      "code": "credits",
      "condition": "Number.isSafeInteger(balance+amount)",
      "message": "'จำนวนเครดิตเกินขอบเขต'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 37,
        "endLine": 37
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:addable",
      "guards": []
    },
    {
      "code": "secure-economy",
      "condition": "state.config.secureEconomy && state.players.includes(p)",
      "message": "'ไม่ได้เปิดกติกาคลังส่วนตัวและเงินกู้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 40,
        "endLine": 40
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:enabled",
      "guards": []
    },
    {
      "code": "dead",
      "condition": "p.paused!=='dead' && p.life!==0",
      "message": "'ผู้เล่นที่ตายแล้วทำรายการไม่ได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 41,
        "endLine": 41
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:enabled",
      "guards": []
    },
    {
      "code": "vault-window",
      "condition": "state.phase==='REVEAL' && p.roundReward?.encounter===state.encounter && p.roundReward.settled",
      "message": "'ฝากถอนได้หลังรับเงินท้ายช่วงเท่านั้น'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 44,
        "endLine": 44
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:afterReward",
      "guards": []
    },
    {
      "code": "loan-window",
      "condition": "state.phase==='APPRAISAL' || state.phase==='TRADE' || state.phase==='REVEAL'",
      "message": "'ยังทำสัญญากู้ไม่ได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 47,
        "endLine": 47
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:loanWindow",
      "guards": []
    },
    {
      "code": "vault-slots",
      "condition": "Number.isSafeInteger(slots) && slots>=2",
      "message": "'จำนวนช่องคลังไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 59,
        "endLine": 59
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:quoteVaultExpansion",
      "guards": []
    },
    {
      "code": "loan-deadline",
      "condition": "Number.isSafeInteger(dueAt)",
      "message": "'กำหนดชำระเกินขอบเขต'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 69,
        "endLine": 69
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:quoteLoanDeadline",
      "guards": []
    },
    {
      "code": "vault-full",
      "condition": "vault.items.length<vault.slots",
      "message": "'คลังส่วนตัวเต็ม'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 80,
        "endLine": 80
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleStorageAction",
      "guards": []
    },
    {
      "code": "vault-owner",
      "condition": "vault.items.includes(action.itemId) && state.items[action.itemId]?.owner===`personal-vault:${p.id}`",
      "message": "'สินค้าไม่ได้อยู่ในคลังของคุณ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 86,
        "endLine": 86
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleStorageAction",
      "guards": []
    },
    {
      "code": "credits",
      "condition": "p.credits>=action.amount",
      "message": "'เครดิตไม่พอ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 91,
        "endLine": 91
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleStorageAction",
      "guards": []
    },
    {
      "code": "credits",
      "condition": "vault.credits>=action.amount",
      "message": "'เครดิตในคลังไม่พอ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 96,
        "endLine": 96
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleStorageAction",
      "guards": []
    },
    {
      "code": "credits",
      "condition": "p.credits>=amount",
      "message": "'เครดิตไม่พอเพิ่มช่องคลัง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 102,
        "endLine": 102
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleStorageAction",
      "guards": []
    },
    {
      "code": "loan",
      "condition": "loan && (loan.borrowerId===p.id || loan.lenderId===p.id)",
      "message": "'ไม่พบสัญญาของคุณ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 110,
        "endLine": 110
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:loanOf",
      "guards": []
    },
    {
      "code": "loan-status",
      "condition": "loan.status==='proposed' || loan.status==='countered'",
      "message": "'ข้อเสนอนี้ปิดแล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 113,
        "endLine": 113
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:pending",
      "guards": []
    },
    {
      "code": "loan-terms",
      "condition": "terms===undefined || typeof terms==='string' && terms.length<=500",
      "message": "'ข้อตกลงยาวได้ไม่เกิน 500 ตัวอักษร'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 116,
        "endLine": 116
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:termsOf",
      "guards": []
    },
    {
      "code": "loan-minimum",
      "condition": "principal>=Math.ceil(value/2)",
      "message": "'เงินกู้ต้องไม่น้อยกว่าครึ่งราคาหลักประกัน'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 119,
        "endLine": 119
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:validPrincipal",
      "guards": []
    },
    {
      "code": "loan-overpriced",
      "condition": "!item.priceIntegrity?.overpriced",
      "message": "'สินค้าราคาเกินจริงใช้ค้ำประกันไม่ได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 123,
        "endLine": 123
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:collateral",
      "guards": []
    },
    {
      "code": "loan-owner",
      "condition": "item?.owner===`collateral:${loan.id}`",
      "message": "'เจ้าของหลักประกันไม่ตรงสัญญา'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 128,
        "endLine": 128
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:returnCollateral",
      "guards": []
    },
    {
      "code": "loan-party",
      "condition": "lender.id!==p.id && lender.paused!=='dead' && lender.life!==0",
      "message": "'ต้องกู้จากผู้เล่นอื่นที่ยังมีชีวิต'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 135,
        "endLine": 135
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleLoanAction",
      "guards": [
        "action.type==='loan-propose'"
      ]
    },
    {
      "code": "loan-collateral",
      "condition": "!state.loans?.some(loan=>loan.itemId===item.id && ['proposed','countered','active'].includes(loan.status))",
      "message": "'สินค้านี้มีสัญญาที่ยังไม่ปิด'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 138,
        "endLine": 138
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleLoanAction",
      "guards": [
        "action.type==='loan-propose'"
      ]
    },
    {
      "code": "loan-party",
      "condition": "p.id===loan.lenderId",
      "message": "'เฉพาะผู้ให้กู้เสนอเงินใหม่ได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 146,
        "endLine": 146
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleLoanAction",
      "guards": [
        "action.type==='loan-counter'"
      ]
    },
    {
      "code": "credits",
      "condition": "p.credits>=action.principal",
      "message": "'เครดิตผู้ให้กู้ไม่พอ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 148,
        "endLine": 148
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleLoanAction",
      "guards": [
        "action.type==='loan-counter'"
      ]
    },
    {
      "code": "loan-response",
      "condition": "typeof action.accept==='boolean'",
      "message": "'คำตอบสัญญาไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 153,
        "endLine": 153
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleLoanAction",
      "guards": [
        "NOT action.type==='loan-counter'",
        "NOT action.type==='loan-cancel'",
        "action.type==='loan-respond'"
      ]
    },
    {
      "code": "loan-party",
      "condition": "p.id===(loan.status==='proposed'?loan.lenderId:loan.borrowerId)",
      "message": "'ต้องให้อีกฝ่ายยืนยันข้อเสนอ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 154,
        "endLine": 154
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleLoanAction",
      "guards": [
        "NOT action.type==='loan-counter'",
        "NOT action.type==='loan-cancel'",
        "action.type==='loan-respond'"
      ]
    },
    {
      "code": "loan-party",
      "condition": "borrower.paused!=='dead' && borrower.life!==0 && lender.paused!=='dead' && lender.life!==0",
      "message": "'คู่สัญญาต้องยังมีชีวิต'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 158,
        "endLine": 158
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleLoanAction",
      "guards": [
        "NOT action.type==='loan-counter'",
        "NOT action.type==='loan-cancel'",
        "action.type==='loan-respond'",
        "NOT !action.accept"
      ]
    },
    {
      "code": "loan-price",
      "condition": "item.lastTradePrice===loan.collateralValue",
      "message": "'ราคาหลักประกันเปลี่ยนแล้ว ต้องเสนอใหม่'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 160,
        "endLine": 160
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleLoanAction",
      "guards": [
        "NOT action.type==='loan-counter'",
        "NOT action.type==='loan-cancel'",
        "action.type==='loan-respond'",
        "NOT !action.accept"
      ]
    },
    {
      "code": "credits",
      "condition": "lender.credits>=loan.principal",
      "message": "'เครดิตผู้ให้กู้ไม่พอ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 161,
        "endLine": 161
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleLoanAction",
      "guards": [
        "NOT action.type==='loan-counter'",
        "NOT action.type==='loan-cancel'",
        "action.type==='loan-respond'",
        "NOT !action.accept"
      ]
    },
    {
      "code": "loan-collateral",
      "condition": "!state.loans!.some(other=>other!==loan && other.itemId===item.id && other.status==='active')",
      "message": "'สินค้านี้ถูกใช้ค้ำแล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 162,
        "endLine": 162
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleLoanAction",
      "guards": [
        "NOT action.type==='loan-counter'",
        "NOT action.type==='loan-cancel'",
        "action.type==='loan-respond'",
        "NOT !action.accept"
      ]
    },
    {
      "code": "loan-party",
      "condition": "loan.status==='active' && p.id===loan.borrowerId",
      "message": "'เฉพาะผู้กู้ชำระสัญญาที่ยังเปิดได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 169,
        "endLine": 169
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleLoanAction",
      "guards": [
        "NOT action.type==='loan-counter'",
        "NOT action.type==='loan-cancel'",
        "NOT action.type==='loan-respond'",
        "action.type==='loan-repay'"
      ]
    },
    {
      "code": "loan-expired",
      "condition": "state.encounter<=loan.dueAt",
      "message": "'พ้นกำหนดชำระแล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 170,
        "endLine": 170
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleLoanAction",
      "guards": [
        "NOT action.type==='loan-counter'",
        "NOT action.type==='loan-cancel'",
        "NOT action.type==='loan-respond'",
        "action.type==='loan-repay'"
      ]
    },
    {
      "code": "loan-payment",
      "condition": "action.amount<=loan.principal-loan.repaid",
      "message": "'ยอดชำระเกินหนี้ที่เหลือ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 171,
        "endLine": 171
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleLoanAction",
      "guards": [
        "NOT action.type==='loan-counter'",
        "NOT action.type==='loan-cancel'",
        "NOT action.type==='loan-respond'",
        "action.type==='loan-repay'"
      ]
    },
    {
      "code": "loan-owner",
      "condition": "state.items[loan.itemId]?.owner===`collateral:${loan.id}`",
      "message": "'เจ้าของหลักประกันไม่ตรงสัญญา'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 173,
        "endLine": 173
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:handleLoanAction",
      "guards": [
        "NOT action.type==='loan-counter'",
        "NOT action.type==='loan-cancel'",
        "NOT action.type==='loan-respond'",
        "action.type==='loan-repay'"
      ]
    },
    {
      "code": "vault",
      "condition": "state.config.secureEconomy && Number.isSafeInteger(vault.slots) && vault.slots>=2 && vault.items.length<=vault.slots && Number.isSafeInteger(vault.credits) && vault.credits>=0",
      "message": "'ข้อมูลคลังส่วนตัวไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 232,
        "endLine": 232
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:secureStorageInvariants",
      "guards": []
    },
    {
      "code": "vault-interest",
      "condition": "Number.isSafeInteger(vault.interest.principal) && vault.interest.principal>=0 && vault.interest.principal<=vault.credits && Number.isSafeInteger(vault.interest.encounter) && vault.interest.encounter>=1 && vault.interest.encounter<=state.encounter",
      "message": "'ข้อมูลอายุเงินต้นไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 233,
        "endLine": 233
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:secureStorageInvariants",
      "guards": [
        "vault.interest"
      ]
    },
    {
      "code": "vault-owner",
      "condition": "!held.has(id) && state.items[id]?.owner===`personal-vault:${p.id}` && !p.inventory.includes(id)",
      "message": "'เจ้าของคลังส่วนตัวไม่ตรง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 234,
        "endLine": 234
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:secureStorageInvariants",
      "guards": []
    },
    {
      "code": "loan",
      "condition": "state.config.secureEconomy && !ids.has(loan.id) && loan.borrowerId!==loan.lenderId && state.players.some(p=>p.id===loan.borrowerId) && state.players.some(p=>p.id===loan.lenderId)",
      "message": "'คู่สัญญาไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 237,
        "endLine": 237
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:secureStorageInvariants",
      "guards": []
    },
    {
      "code": "loan",
      "condition": "Number.isSafeInteger(loan.repaid) && loan.repaid>=0 && loan.repaid<=loan.principal && loan.dueAt===quoteLoanDeadline(loan.collateralValue,loan.firstPayoutAt)",
      "message": "'ยอดหรือกำหนดชำระไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 239,
        "endLine": 239
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:secureStorageInvariants",
      "guards": []
    },
    {
      "code": "loan-owner",
      "condition": "loan.repaid<loan.principal && !held.has(loan.itemId) && state.items[loan.itemId]?.owner===`collateral:${loan.id}`",
      "message": "'หลักประกันไม่ตรงสัญญา'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 241,
        "endLine": 241
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:secureStorageInvariants",
      "guards": [
        "loan.status==='active'"
      ]
    },
    {
      "code": "secure-owner",
      "condition": "held.has(item.id)",
      "message": "'สินค้าฝากหรือค้ำไม่มีบัญชีรองรับ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/secure-storage.ts",
        "line": 245,
        "endLine": 245
      },
      "owner": "code:apps/comic/src/game/appraisal/secure-storage.ts:secureStorageInvariants",
      "guards": [
        "item.owner.startsWith('personal-vault:') || item.owner.startsWith('collateral:')"
      ]
    },
    {
      "code": "collector",
      "condition": "state.config.survival && (state.players.every(p=>p.life===0) || collectorDue(state))",
      "message": "'Collector รับของเมื่อทุกคนชีวิตหมดหรือถึงช่วงที่ Collector มาเท่านั้น'",
      "source": {
        "file": "apps/comic/src/game/appraisal/survival.ts",
        "line": 17,
        "endLine": 17
      },
      "owner": "code:apps/comic/src/game/appraisal/survival.ts:collectRun",
      "guards": []
    },
    {
      "code": "collector",
      "condition": "!state.collector",
      "message": "'Collector คิดคะแนนแล้ว'",
      "source": {
        "file": "apps/comic/src/game/appraisal/survival.ts",
        "line": 18,
        "endLine": 18
      },
      "owner": "code:apps/comic/src/game/appraisal/survival.ts:collectRun",
      "guards": []
    },
    {
      "code": "steal",
      "condition": "state.config.core2 && ['APPRAISAL','TRADE'].includes(state.phase) && !p.paused && !p.done && !p.eventOffer && !p.abilityChoice",
      "message": "'ช่วงนี้ขโมยไม่ได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 132,
        "endLine": 132
      },
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:startTheftDuel",
      "guards": []
    },
    {
      "code": "steal",
      "condition": "!p.stealTried?.length && !openDuel(state,p.id)",
      "message": "'ขโมยได้ครั้งเดียวต่อช่วง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 133,
        "endLine": 133
      },
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:startTheftDuel",
      "guards": []
    },
    {
      "code": "steal",
      "condition": "victim && victim.id !== p.id && !victim.paused && !victim.done && !victim.eventOffer && !victim.abilityChoice && !openDuel(state,victim.id)",
      "message": "'เริ่มการขโมยกับผู้เล่นนี้ไม่ได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 138,
        "endLine": 138
      },
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:startTheftDuel",
      "guards": [
        "target.victimId"
      ]
    },
    {
      "code": "steal",
      "condition": "eligible.length > 0",
      "message": "'เริ่มการขโมยกับผู้เล่นนี้ไม่ได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 140,
        "endLine": 140
      },
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:startTheftDuel",
      "guards": [
        "target.victimId"
      ]
    },
    {
      "code": "steal-cooldown",
      "condition": "pvpBlockedUntil(state,p,victim.id) === undefined",
      "message": "'แพ้การขโมยผู้เล่นคนนี้ ต้องรออีก 2 ช่วงก่อนขโมยซ้ำ'",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 141,
        "endLine": 141
      },
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:startTheftDuel",
      "guards": [
        "target.victimId"
      ]
    },
    {
      "code": "steal",
      "condition": "target.itemId",
      "message": "'เลือกสินค้าที่จะขโมย'",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 146,
        "endLine": 146
      },
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:startTheftDuel",
      "guards": [
        "NOT target.victimId"
      ]
    },
    {
      "code": "theft-duel",
      "condition": "duel && duel.status === 'open' && [duel.thiefId,duel.victimId].includes(p.id)",
      "message": "'ไม่มีการเป่ายิ้งฉุบที่หมดเวลา'",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 190,
        "endLine": 190
      },
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:expireTheftDuel",
      "guards": []
    },
    {
      "code": "theft-hand",
      "condition": "hands.includes(hand)",
      "message": "'เลือกค้อน กระดาษ หรือกรรไกร'",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 258,
        "endLine": 258
      },
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:chooseTheftHand",
      "guards": []
    },
    {
      "code": "theft-duel",
      "condition": "duel && duel.status === 'open' && [duel.thiefId,duel.victimId].includes(p.id)",
      "message": "'ไม่มีการเป่ายิ้งฉุบที่เลือกได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 260,
        "endLine": 260
      },
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:chooseTheftHand",
      "guards": []
    },
    {
      "code": "theft-hand",
      "condition": "!duel.hands[p.id]",
      "message": "'ส่งมือแล้ว เปลี่ยนไม่ได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 262,
        "endLine": 262
      },
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:chooseTheftHand",
      "guards": []
    },
    {
      "code": "crime",
      "condition": "crime && crime.cases.length > 0",
      "message": "'ไม่มีโทษให้ล้าง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/theft.ts",
        "line": 328,
        "endLine": 328
      },
      "owner": "code:apps/comic/src/game/appraisal/theft.ts:clearCrime",
      "guards": []
    },
    {
      "code": "wish",
      "condition": "replaceNpc===undefined || replaceNpc===npc",
      "message": "'คำขอใหม่แทนได้เฉพาะคำขอเดิมของพ่อค้านี้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/wishlist.ts",
        "line": 43,
        "endLine": 43
      },
      "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:applyWish",
      "guards": [
        "here"
      ]
    },
    {
      "code": "wish",
      "condition": "replaceNpc!==undefined && !!p.wishes![replaceNpc]",
      "message": "`มีคำขอครบ ${wishSlotsOf(state,p,WISH_MAX_ACTIVE)} รายการแล้ว เลือกคำขอเดิมที่จะแทน`",
      "source": {
        "file": "apps/comic/src/game/appraisal/wishlist.ts",
        "line": 44,
        "endLine": 44
      },
      "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:applyWish",
      "guards": [
        "NOT here",
        "open>=wishSlotsOf(state,p,WISH_MAX_ACTIVE)"
      ]
    },
    {
      "code": "wish",
      "condition": "replaceNpc===undefined",
      "message": "'ยังมีที่ว่าง ไม่ต้องแทนคำขอเดิม'",
      "source": {
        "file": "apps/comic/src/game/appraisal/wishlist.ts",
        "line": 45,
        "endLine": 45
      },
      "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:applyWish",
      "guards": [
        "NOT here",
        "NOT open>=wishSlotsOf(state,p,WISH_MAX_ACTIVE)"
      ]
    },
    {
      "code": "wish",
      "condition": "contractOn(state) && state.phase==='APPRAISAL'",
      "message": "'พ่อค้านี้ยังรับทำสัญญาตามหาของไม่ได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/wishlist.ts",
        "line": 52,
        "endLine": 52
      },
      "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:wishNew",
      "guards": []
    },
    {
      "code": "wish",
      "condition": "npc",
      "message": "'ต้องเลือกพ่อค้าก่อน'",
      "source": {
        "file": "apps/comic/src/game/appraisal/wishlist.ts",
        "line": 53,
        "endLine": 53
      },
      "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:wishNew",
      "guards": []
    },
    {
      "code": "bank",
      "condition": "freeBank(state)>=maxAsk(pick.price)",
      "message": "'งบธนาคารไม่พอสำหรับคำขอนี้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/wishlist.ts",
        "line": 55,
        "endLine": 55
      },
      "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:wishNew",
      "guards": []
    },
    {
      "code": "merchant-banned",
      "condition": "!state.config.secureEconomy || !merchantTradeBanned(state,p)",
      "message": "'ยังถูกห้ามค้าขายกับพ่อค้า'",
      "source": {
        "file": "apps/comic/src/game/appraisal/wishlist.ts",
        "line": 88,
        "endLine": 88
      },
      "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:wishSell",
      "guards": []
    },
    {
      "code": "wish",
      "condition": "state.config.wishlist && state.phase==='APPRAISAL'",
      "message": "'พ่อค้านี้ยังรับซื้อตามคำขอไม่ได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/wishlist.ts",
        "line": 89,
        "endLine": 89
      },
      "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:wishSell",
      "guards": []
    },
    {
      "code": "wish",
      "condition": "wish",
      "message": "'พ่อค้านี้ไม่ได้บอกของที่อยากได้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/wishlist.ts",
        "line": 90,
        "endLine": 90
      },
      "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:wishSell",
      "guards": []
    },
    {
      "code": "wish",
      "condition": "!p.wishTried",
      "message": "'ต่อรองกับพ่อค้านี้แล้วในช่วงนี้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/wishlist.ts",
        "line": 91,
        "endLine": 91
      },
      "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:wishSell",
      "guards": []
    },
    {
      "code": "wish",
      "condition": "(WISH_MARKUPS as readonly number[]).includes(markup)",
      "message": "'ราคาที่เสนอไม่ถูกต้อง'",
      "source": {
        "file": "apps/comic/src/game/appraisal/wishlist.ts",
        "line": 92,
        "endLine": 92
      },
      "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:wishSell",
      "guards": []
    },
    {
      "code": "wish",
      "condition": "item.kind===wish.kind",
      "message": "'พ่อค้าไม่ได้ต้องการสินค้าชนิดนี้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/wishlist.ts",
        "line": 93,
        "endLine": 93
      },
      "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:wishSell",
      "guards": []
    },
    {
      "code": "bank",
      "condition": "freeBank(state)>=price",
      "message": "'งบธนาคารไม่พอสำหรับราคานี้'",
      "source": {
        "file": "apps/comic/src/game/appraisal/wishlist.ts",
        "line": 94,
        "endLine": 94
      },
      "owner": "code:apps/comic/src/game/appraisal/wishlist.ts:wishSell",
      "guards": []
    },
    {
      "code": "duel-expired",
      "condition": "false",
      "message": "'รอบเป่ายิ้งฉุบหมดเวลาแล้ว ใช้สถานะล่าสุด'",
      "source": {
        "file": "apps/comic/src/server/appraisal-rooms.ts",
        "line": 69,
        "endLine": 69
      },
      "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.matchMessage",
      "guards": [
        "duel&&!acceptedHand",
        "this.now()>=deadline"
      ]
    },
    {
      "code": "phase-expired",
      "condition": "!!duel",
      "message": "'หมดเวลาช่วงนี้แล้ว ใช้สถานะล่าสุด'",
      "source": {
        "file": "apps/comic/src/server/appraisal-rooms.ts",
        "line": 73,
        "endLine": 73
      },
      "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.matchMessage",
      "guards": [
        "!acceptedHand && (message.type === 'action' || message.type === 'reveal-ready') && room.deadline !== null && this.now() >= room.deadline"
      ]
    },
    {
      "code": "match-started",
      "condition": "!room.game",
      "message": "'ตั้งเวลาได้ก่อนเริ่มเกมเท่านั้น'",
      "source": {
        "file": "apps/comic/src/server/appraisal-rooms.ts",
        "line": 77,
        "endLine": 77
      },
      "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.matchMessage",
      "guards": []
    },
    {
      "code": "match-started",
      "condition": "!room.game",
      "message": "'เพิ่มบอทได้ก่อนเริ่มเกมเท่านั้น'",
      "source": {
        "file": "apps/comic/src/server/appraisal-rooms.ts",
        "line": 83,
        "endLine": 83
      },
      "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.matchMessage",
      "guards": []
    },
    {
      "code": "room-full",
      "condition": "room.seats.length<4",
      "message": "'ห้องนี้มีผู้เล่นครบ 4 คนแล้ว'",
      "source": {
        "file": "apps/comic/src/server/appraisal-rooms.ts",
        "line": 84,
        "endLine": 84
      },
      "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.matchMessage",
      "guards": []
    },
    {
      "code": "match-started",
      "condition": "!room.game",
      "message": "'นำบอทออกได้ก่อนเริ่มเกมเท่านั้น'",
      "source": {
        "file": "apps/comic/src/server/appraisal-rooms.ts",
        "line": 89,
        "endLine": 89
      },
      "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.matchMessage",
      "guards": []
    },
    {
      "code": "not-a-bot",
      "condition": "bot?.bot",
      "message": "'ที่นั่งนี้ไม่ใช่บอท'",
      "source": {
        "file": "apps/comic/src/server/appraisal-rooms.ts",
        "line": 90,
        "endLine": 90
      },
      "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.matchMessage",
      "guards": []
    },
    {
      "code": "match-started",
      "condition": "!room.game",
      "message": "'เลือกโหมดได้ก่อนเริ่มเกมเท่านั้น'",
      "source": {
        "file": "apps/comic/src/server/appraisal-rooms.ts",
        "line": 94,
        "endLine": 94
      },
      "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.matchMessage",
      "guards": []
    },
    {
      "code": "survival-only",
      "condition": "!this.runConfig.survival || message.mode==='survival'",
      "message": "'เกมนี้ใช้กติกาเอาชีวิตรอด ไม่ต้องเลือกโหมด'",
      "source": {
        "file": "apps/comic/src/server/appraisal-rooms.ts",
        "line": 95,
        "endLine": 95
      },
      "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.matchMessage",
      "guards": []
    },
    {
      "code": "stale-match",
      "condition": "room.game && message.matchId === room.matchId",
      "message": "'คำสั่งนี้เป็นของแมตช์เก่า ใช้สถานะล่าสุด'",
      "source": {
        "file": "apps/comic/src/server/appraisal-rooms.ts",
        "line": 100,
        "endLine": 100
      },
      "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.matchMessage",
      "guards": []
    },
    {
      "code": "already-ready",
      "condition": "!room.revealReady.has(seat.id) || !!room.game.accepted[`${seat.id}:${message.action.requestId}`]",
      "message": "'ยืนยันไปต่อแล้ว รอรอบถัดไป'",
      "source": {
        "file": "apps/comic/src/server/appraisal-rooms.ts",
        "line": 101,
        "endLine": 101
      },
      "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.matchMessage",
      "guards": []
    },
    {
      "code": "already-ready",
      "condition": "!loan || ![loan.borrowerId,loan.lenderId].some(id=>room.revealReady.has(id))",
      "message": "'คู่สัญญายืนยันไปต่อแล้ว ทำสัญญาใหม่ช่วงถัดไป'",
      "source": {
        "file": "apps/comic/src/server/appraisal-rooms.ts",
        "line": 105,
        "endLine": 105
      },
      "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.matchMessage",
      "guards": [
        "message.action.type==='loan-respond' && message.action.accept"
      ]
    },
    {
      "code": "already-ready",
      "condition": "!offer || ![offer.holderId,offer.buyerId].some(id=>room.revealReady.has(id))",
      "message": "'คู่ค้ายืนยันไปต่อแล้ว ทำข้อเสนอใหม่ช่วงถัดไป'",
      "source": {
        "file": "apps/comic/src/server/appraisal-rooms.ts",
        "line": 110,
        "endLine": 110
      },
      "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.matchMessage",
      "guards": [
        "message.action.type==='seal-respond' && message.action.accept"
      ]
    },
    {
      "code": "ghost-shuffling",
      "condition": "this.now()-(previous.ghosts?.[seat.id]?.startedAt??Infinity)>=5200",
      "message": "'รอการสลับการ์ดให้จบ'",
      "source": {
        "file": "apps/comic/src/server/appraisal-rooms.ts",
        "line": 114,
        "endLine": 114
      },
      "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.matchMessage",
      "guards": [
        "message.action.type==='ghost-guess'&&!prior"
      ]
    },
    {
      "code": "stale-reveal",
      "condition": "room.game?.phase === 'REVEAL' && message.matchId === room.matchId && message.encounter === room.game.encounter",
      "message": "'ผลช่วงนี้ผ่านไปแล้ว ใช้ผลล่าสุด'",
      "source": {
        "file": "apps/comic/src/server/appraisal-rooms.ts",
        "line": 120,
        "endLine": 121
      },
      "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.matchMessage",
      "guards": []
    },
    {
      "code": "spectator",
      "condition": "!room.game.config.survival || room.game.players.find(p=>p.id===seat.id)?.life!==0",
      "message": "'ชีวิตหมดแล้ว ดูผู้เล่นที่ยังมีชีวิตไปต่อ'",
      "source": {
        "file": "apps/comic/src/server/appraisal-rooms.ts",
        "line": 122,
        "endLine": 122
      },
      "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.matchMessage",
      "guards": []
    },
    {
      "code": "audit-private",
      "condition": "room.game?.phase === 'RESULTS' && message.matchId === room.matchId",
      "message": "'ดาวน์โหลดข้อมูลลับได้หลังจบ run เท่านั้น'",
      "source": {
        "file": "apps/comic/src/server/appraisal-rooms.ts",
        "line": 127,
        "endLine": 127
      },
      "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.matchMessage",
      "guards": []
    },
    {
      "code": "phase",
      "condition": "room.game",
      "message": "'run ยังไม่เริ่ม'",
      "source": {
        "file": "apps/comic/src/server/appraisal-rooms.ts",
        "line": 174,
        "endLine": 174
      },
      "owner": "code:apps/comic/src/server/appraisal-rooms.ts:AppraisalRoomService.timeout",
      "guards": []
    },
    {
      "code": "already-seated",
      "condition": "!this.bindings.has(peer)",
      "message": "'คุณอยู่ในห้องแล้ว ออกจากห้องเดิมก่อน'",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 59,
        "endLine": 59
      },
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.handle",
      "guards": [
        "control.type === 'create' || control.type === 'join' || control.type === 'resume'"
      ]
    },
    {
      "code": "room-limit",
      "condition": "this.rooms.size < 200",
      "message": "'ห้องเต็มเซิร์ฟเวอร์แล้ว ลองอีกครั้งภายหลัง'",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 61,
        "endLine": 61
      },
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.handle",
      "guards": [
        "control.type === 'create' || control.type === 'join' || control.type === 'resume'",
        "control.type === 'create'"
      ]
    },
    {
      "code": "room-missing",
      "condition": "room",
      "message": "'ไม่พบห้องนี้ ห้องอาจหมดอายุหรือเซิร์ฟเวอร์เริ่มใหม่'",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 71,
        "endLine": 71
      },
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.handle",
      "guards": [
        "control.type === 'create' || control.type === 'join' || control.type === 'resume'",
        "NOT control.type === 'create'"
      ]
    },
    {
      "code": "seat-missing",
      "condition": "seat",
      "message": "'กู้ seat ไม่สำเร็จ กลับไปสร้างหรือเข้าห้องใหม่'",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 74,
        "endLine": 74
      },
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.handle",
      "guards": [
        "control.type === 'create' || control.type === 'join' || control.type === 'resume'",
        "NOT control.type === 'create'",
        "control.type === 'resume'"
      ]
    },
    {
      "code": "match-started",
      "condition": "!room.game",
      "message": "'แมตช์เริ่มแล้ว รอเข้าห้องในแมตช์ถัดไป'",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 78,
        "endLine": 78
      },
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.handle",
      "guards": [
        "control.type === 'create' || control.type === 'join' || control.type === 'resume'",
        "NOT control.type === 'create'",
        "NOT control.type === 'resume'"
      ]
    },
    {
      "code": "room-full",
      "condition": "room.seats.length < 4",
      "message": "'ห้องนี้มีผู้เล่นครบ 4 คนแล้ว'",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 79,
        "endLine": 79
      },
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.handle",
      "guards": [
        "control.type === 'create' || control.type === 'join' || control.type === 'resume'",
        "NOT control.type === 'create'",
        "NOT control.type === 'resume'"
      ]
    },
    {
      "code": "not-seated",
      "condition": "binding",
      "message": "'สร้างหรือเข้าห้องก่อน'",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 86,
        "endLine": 86
      },
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.handle",
      "guards": []
    },
    {
      "code": "match-started",
      "condition": "!room.game",
      "message": "'เปลี่ยนพร้อมเล่นได้เฉพาะใน lobby'",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 90,
        "endLine": 90
      },
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.handle",
      "guards": []
    },
    {
      "code": "match-started",
      "condition": "!room.game",
      "message": "'เลือกรูปแบบทดสอบก่อนเริ่มเกม'",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 92,
        "endLine": 92
      },
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.handle",
      "guards": []
    },
    {
      "code": "match-started",
      "condition": "!room.game",
      "message": "'แมตช์เริ่มแล้ว'",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 94,
        "endLine": 94
      },
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.handle",
      "guards": []
    },
    {
      "code": "not-ready",
      "condition": "room.seats.length >= 2 && room.seats.every(s => (s.ready || s.id === room.hostId) && s.connected)",
      "message": "'ต้องมี 2–4 คน และทุกคนพร้อมและเชื่อมต่ออยู่'",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 95,
        "endLine": 95
      },
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.handle",
      "guards": []
    },
    {
      "code": "phase",
      "condition": "room.game?.phase === 'RESULTS'",
      "message": "'ต้องจบแมตช์ก่อนเล่นอีกครั้ง'",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 100,
        "endLine": 100
      },
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.handle",
      "guards": []
    },
    {
      "code": "match-started",
      "condition": "!room.game || room.game.phase === 'RESULTS'",
      "message": "'แมตช์กำลังเล่น ปิดแท็บได้และกลับมาที่ seat เดิมภายหลัง'",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 103,
        "endLine": 103
      },
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.handle",
      "guards": []
    },
    {
      "code": "match-started",
      "condition": "!room.game",
      "message": "'นำ seat ออกได้เฉพาะก่อนเริ่มแมตช์'",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 108,
        "endLine": 108
      },
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.handle",
      "guards": []
    },
    {
      "code": "seat-connected",
      "condition": "absent && !absent.connected && absent.id !== seat.id",
      "message": "'นำออกได้เฉพาะ seat ที่ไม่ได้เชื่อมต่อ'",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 110,
        "endLine": 110
      },
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.handle",
      "guards": []
    },
    {
      "code": "host-only",
      "condition": "room.hostId === seat.id",
      "message": "'เฉพาะเจ้าของห้องทำรายการนี้ได้'",
      "source": {
        "file": "apps/comic/src/server/room-lifecycle.ts",
        "line": 150,
        "endLine": 150
      },
      "owner": "code:apps/comic/src/server/room-lifecycle.ts:RoomLifecycle.hostOnly",
      "guards": []
    }
  ]
}
```