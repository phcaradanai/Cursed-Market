import {createRoot} from 'react-dom/client';
import {ItemSalePanel} from './ItemSalePanel.js';
import {previewRooms} from './comic-preview-data.js';
import type {Decision} from './model.js';
export function mountSaleProof(state:'shop'|'owned'|'listed') {
 const game=structuredClone(previewRooms.trade!.game!);const item=state==='owned'?game.self.inventory[0]!:game.self.stock[1]!;
 if(state!=='owned')item.appraisal=50;else item.lockedUntil=null;
 if(state==='listed')game.listings=[{ownerId:game.self.id,itemId:item.id,item,purchase:true,claims:{genuine:true},rebate:2}];
 document.querySelector('#sale-proof')?.remove();const host=document.createElement('div');host.id='sale-proof';host.style.height='100%';document.querySelector('#table-item-detail .drawer-body')!.replaceChildren(host);
 const actions:Decision[]=[];const root=createRoot(host);root.render(<ItemSalePanel game={game} item={item} disabled={false} submit={a=>actions.push(a)}/>);
 return {actions,root};
}
