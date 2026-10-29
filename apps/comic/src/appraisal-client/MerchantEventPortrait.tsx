import type {CSSProperties} from 'react';
import type {NpcId} from '../game/appraisal/types.js';
import {npcImage} from '../game/appraisal/content.js';
import {MERCHANT_PORTRAIT_FRAMES as frames} from './merchant-portrait-frames.js';

/** Idle art calibration: visible alpha height and base, not canvas width, determine event scale. */
export function MerchantEventPortrait({npc}:{npc:NpcId}) {
  const frame=frames[npc],visibleHeight=frame.bounds[3]!-frame.bounds[1]!;
  const style={
    '--portrait-height-ratio':frame.height/visibleHeight,
    '--portrait-bottom-offset':-(frame.height-frame.bounds[3]!)/visibleHeight,
    '--portrait-anchor':`${frame.anchorX/frame.width*100}%`,
  } as CSSProperties;
  return <div className="comic-event-portrait" data-merchant={npc} style={style} aria-hidden="true"><img src={npcImage(npc)} alt=""/></div>;
}
