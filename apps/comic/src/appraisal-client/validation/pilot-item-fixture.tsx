// Dev-only public DTO proof. Production gameplay still comes from the room service.
import {createRoot} from 'react-dom/client';import {flushSync} from 'react-dom';import {GameTable} from '../App.js';import type {Decision} from '../model.js';import type {AppraisalRoomView} from '../../shared/appraisal-protocol.js';
export function mountPilotItemProof(room:AppraisalRoomView,onAction:(action:Decision)=>void=()=>{}){
 const main=document.querySelector('#game-main')!;main.replaceChildren();const root=createRoot(main);
 const render=(next:AppraisalRoomView)=>flushSync(()=>root.render(<GameTable room={next} submit={onAction} send={()=>true} disabled={false}/>));render(room);
 return {update(next:AppraisalRoomView){render(next);},unmount(){flushSync(()=>root.unmount());}};
}
