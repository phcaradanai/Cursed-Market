// Dev-only public DTO proof. Production gameplay still comes from the room service.
import {createRoot} from 'react-dom/client';import {flushSync} from 'react-dom';import {GameTable} from '../App.js';import type {AppraisalRoomView} from '../../shared/appraisal-protocol.js';
export function mountPilotItemProof(room:AppraisalRoomView){
 const main=document.querySelector('#game-main')!;main.replaceChildren();const root=createRoot(main);flushSync(()=>root.render(<GameTable room={room} submit={()=>{}} send={()=>true} disabled={false}/>));return {unmount(){flushSync(()=>root.unmount());}};
}
