/** Server-only answer: order maps final positions to the original cards. */
export type Tracking = {status:'guessing'|'failed'|'available'; initialPosition:number; answer:number};
export function startTracking(order:readonly number[],initialPosition:number):Tracking {
 if(order.length!==4 || new Set(order).size!==4 || order.some(n=>!Number.isInteger(n)||n<0||n>3) || !Number.isInteger(initialPosition) || initialPosition<0 || initialPosition>3) throw new RangeError('Invalid tracking cards');
 return {status:'guessing',initialPosition,answer:order.indexOf(initialPosition)};
}
export function trackingView(state:Tracking):{status:Tracking['status'];initialPosition:number} {
 return {status:state.status,initialPosition:state.initialPosition};
}
export function guessTracking(state:Tracking,position:number):Tracking {
 if(state.status!=='guessing' || !Number.isInteger(position) || position<0 || position>3) throw new RangeError('Invalid tracking guess');
 return {...state,status:position===state.answer?'available':'failed'};
}
