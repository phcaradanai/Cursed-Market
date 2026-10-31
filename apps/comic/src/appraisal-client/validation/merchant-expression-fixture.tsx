// Dev-only mounted public-component proof; not imported into the shipped client.
import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import {GameTable} from '../App.js';
import {previewRooms} from '../comic-preview-data.js';
import type {NpcId} from '../../game/appraisal/types.js';
export function mountMerchantExpressionProof(){
 let room=structuredClone(previewRooms.merchants!);
 const reset=()=>{room=structuredClone(previewRooms.merchants!);room.game!.self.eventOffer=null;room.game!.self.selectedPortalId=null;room.game!.self.done=false;room.serverTime=Date.now();room.deadline=room.serverTime+80000;};reset();
 const main=document.querySelector('#game-main')!;main.replaceChildren();const root=createRoot(main);
 const render=()=>flushSync(()=>root.render(<GameTable room={room} submit={()=>{}} send={()=>true} disabled={false}/>));
 const copy=()=>{room=structuredClone(room);};render();
 return {
  reset(){reset();room.game!.encounter++;render();},
  enter(){copy();const g=room.game!;g.phase='APPRAISAL';g.self.selectedPortalId=g.self.portals[0]!.id;g.self.stock=structuredClone(previewRooms.inspection!.game!.self.stock);g.self.done=false;render();},
  same(){copy();render();},
  result(accepted:boolean|null){copy();room.game!.self.stock[0]!.appraisalAccepted=accepted;room.game!.self.stock[0]!.appraisal=accepted===null?null:48;render();},
  merchant(npc:NpcId,accepted:boolean|null){copy();const g=room.game!;g.phase='APPRAISAL';g.self.selectedPortalId=g.self.portals[0]!.id;g.self.portals[0]!.npc=npc;g.self.stock=structuredClone(previewRooms.inspection!.game!.self.stock);g.self.stock[0]!.appraisalAccepted=accepted;g.self.stock[0]!.appraisal=accepted===null?null:48;render();},
  unmount(){flushSync(()=>root.unmount());}
 };
}
