import {createPortal} from 'react-dom';
import {useEffect,useState,type ReactNode} from 'react';
import type {AppraisalRoomView} from '../shared/appraisal-protocol.js';
import {Trades,TradeListing,Unsold,type Actions} from './components.js';
import {ComicButton,ComicMenu} from './ComicUI.js';
import {itemName} from './catalog-text.js';
import {ItemSalePanel} from './ItemSalePanel.js';
import {ComicTooltip} from './ComicTooltip.js';
import {Pager} from './Pager.js';
import {unsoldItems} from './model.js';
import {BagIcon,NavigationIcon,TableReturnIcon,PlayerOutlineIcon} from './icons.js';
export function TradeScreen({game,room,submit,disabled,completion,utilityOpen=false}:Actions&{room:AppraisalRoomView;completion?:ReactNode;utilityOpen?:boolean}) {
 const [other,setOther]=useState<string|null>(null),[bag,setBag]=useState(false),[page,setPage]=useState(0),[selected,setSelected]=useState<string|null>(null),[offers,setOffers]=useState(false);
 const [direction,setDirection]=useState('down');
 const [size,setSize]=useState(()=>typeof window!=='undefined'&&window.innerWidth<1100?3:4);
 useEffect(()=>{const resize=()=>setSize(window.innerWidth<1100?3:4);window.addEventListener('resize',resize);return()=>window.removeEventListener('resize',resize);},[]);
 const listings=game.listings.filter(l=>l.ownerId===other),items=other?listings.map(l=>l.item):bag?game.self.inventory:game.self.stock;
 const pages=Math.max(1,Math.ceil(items.length/size)),at=page%pages,visible=items.slice(at*size,(at+1)*size),picked=items.find(i=>i.id===selected),listing=listings.find(l=>l.itemId===selected);
 const peers=room.matchSeats.filter(s=>s.id!==game.self.id),name=room.matchSeats.find(s=>s.id===other)?.name??'ผู้เล่น';
 const navigate=(owner:string|null,inventory=false)=>{setDirection(owner?'left':other?'right':inventory?'down':'up');setOther(owner);setBag(inventory);setPage(0);setSelected(null);};
 const menuTarget=typeof document!=='undefined'?document.querySelector('#game-main .screen'):null;
 return <section className="trade-table comic-main-frame" aria-label="โต๊ะซื้อขาย">
  <header className="trade-table-title"><h2>{other?`โต๊ะของ ${name}`:'โต๊ะของคุณ'}</h2><p>{other?'สินค้าที่เปิดให้ผู้อื่นเห็น':bag?'ของในกระเป๋าของคุณ':'สินค้าในร้านที่คุณประเมิน'}</p></header>
  {!other&&<nav className="table-peer-rail" aria-label="โต๊ะผู้เล่นอื่น">{peers.map(p=><ComicTooltip key={p.id} content={`ดูสินค้าที่ ${p.name} เปิดขาย · ไปยังโต๊ะผู้เล่นนี้`}><button className="comic-overlay-control" type="button" onClick={()=>navigate(p.id)} aria-label={`ไปโต๊ะ ${p.name}`}><span aria-hidden="true"><PlayerOutlineIcon/></span><small>{p.name}</small></button></ComicTooltip>)}</nav>}
  {bag&&!other&&<ComicTooltip content="กลับไปดูสินค้าในร้านที่คุณประเมิน"><button className="comic-overlay-control table-overlay table-up" type="button" aria-label="กลับสินค้าในร้าน" onClick={()=>navigate(null)}><NavigationIcon direction="up"/></button></ComicTooltip>}
  <div key={`${other??(bag?'bag':'shop')}-${at}`} className={`table-goods${visible.length?'':' is-empty'}`} data-direction={direction} style={{gridTemplateColumns:`repeat(${Math.max(1,visible.length)},minmax(0,1fr))`}}>{visible.map(i=><ComicTooltip key={i.id} content={<><strong>{itemName(i.kind)}</strong>{`ราคาประเมิน: ${i.appraisal===null?'ยังไม่ประเมิน':i.appraisal+' เครดิต'}\nมูลค่าจริง: ${i.knowledge.base??(i.knowledge.range?.join('–')??'ยังไม่รู้')}\nความแท้: ${i.knowledge.genuine===undefined?'ยังไม่รู้':i.knowledge.genuine?'ของแท้':'ของปลอม'}\nคำสาป: ${i.knowledge.cursed===undefined?'ยังไม่รู้':i.knowledge.cursed?'มีคำสาป':'ไม่มีคำสาป'}\nกดเพื่อดูรายละเอียดและจัดการ`}</>}><button type="button" className="table-good" key={i.id} onClick={()=>setSelected(i.id)}><img src={i.image} alt=""/><strong>{itemName(i.kind)}</strong>{!bag&&!other&&<small>◉ {i.price} เครดิต</small>}</button></ComicTooltip>)}{!visible.length&&<p className="table-empty">{other?'ผู้เล่นนี้ยังไม่เปิดสินค้า':bag?'ยังไม่มีของในกระเป๋า':'ไม่มีสินค้าในร้านครั้งนี้'}</p>}</div>
  {pages>1&&<div className={`table-paging ${other?'table-left':'table-right'}`}><ComicTooltip content="ดูสินค้าหน้าถัดไป · วนกลับหน้าแรกเมื่อถึงหน้าสุดท้าย"><button className="comic-overlay-control table-overlay" type="button" aria-label="สินค้าหน้าถัดไป" onClick={()=>{setDirection(other?'right':'left');setPage((at+1)%pages);}}><NavigationIcon direction={other?'left':'right'}/></button></ComicTooltip><small>{at+1} / {pages}</small></div>}
  {other?<ComicTooltip content="กลับโต๊ะของคุณ เพื่อเลือกสินค้าและไปโต๊ะผู้เล่นคนอื่น"><button className="comic-overlay-control table-overlay table-return" type="button" aria-label="กลับโต๊ะของคุณ" onClick={()=>navigate(null)}><TableReturnIcon/></button></ComicTooltip>:!bag&&<ComicTooltip content="เลื่อนลงไปดูของในกระเป๋าของคุณ"><button className="comic-overlay-control table-overlay table-down" type="button" aria-label="ของในกระเป๋า" onClick={()=>navigate(null,true)}><BagIcon/><span className="table-bag-direction"><NavigationIcon direction="down"/></span></button></ComicTooltip>}
  <div className="table-completion">{completion}</div>
  <ComicButton className="table-offers" onClick={()=>setOffers(true)}>ข้อเสนอซื้อขาย {game.trades.filter(t=>t.status==='open').length||''}</ComicButton>
  {menuTarget&&createPortal(<><ComicMenu id="table-item-detail" open={!!picked&&!utilityOpen} title={picked?itemName(picked.kind):'สินค้า'} onClose={()=>setSelected(null)} className="table-item-menu">{picked&&(listing?<TradeListing game={game} room={room} listing={listing} submit={submit} disabled={disabled}/>:<ItemSalePanel game={game} item={picked} submit={submit} disabled={disabled}/>)}</ComicMenu><ComicMenu id="table-offers-detail" open={offers&&!utilityOpen} title="ข้อเสนอซื้อขาย" onClose={()=>setOffers(false)}><Pager label="หน้าข้อเสนอซื้อขาย">{!game.self.paused&&unsoldItems(game).length>0&&<div>{offers&&!utilityOpen&&<Unsold game={game} submit={submit} disabled={disabled}/>}</div>}<Trades game={game} room={room} submit={submit} disabled={disabled}/></Pager></ComicMenu></>,menuTarget)}
 </section>;
}
