import {useEffect,useState} from 'react';
import type {AppraisalView,JournalEntry} from '../game/appraisal/types.js';
import type {AppraisalRoomView} from '../shared/appraisal-protocol.js';
import type {Decision} from './model.js';
import {itemImage} from '../game/appraisal/content.js';
import {ComicDestination,CompactPager} from './ComicUI.js';
import {BookIcon,CoinIcon,EventIcon,HandshakeIcon,MarketIcon} from './icons.js';
import {FinancePanel} from './SecureEconomy.js';
import {SealPanel} from './SinnerSeals.js';
import {WishlistPanel} from './WishlistPanel.js';
import {NpcContracts} from './NpcContracts.js';

type Chapter='events'|'loans'|'seals'|'wishes'|'contracts';
const PAGE_SIZE=4;
export function LedgerMenu({game,room,submit,disabled,playerNames}:{game:AppraisalView;room:AppraisalRoomView;submit:(action:Decision)=>void;disabled:boolean;playerNames:Record<string,string>}) {
  const [chapter,setChapter]=useState<Chapter>('events');
  const [page,setPage]=useState(0);
  const [selected,setSelected]=useState<number|null>(null);
  const entries=[...(game.self.journal??[])].reverse();
  const pages=Math.max(1,Math.ceil(entries.length/PAGE_SIZE));
  const shown=entries.slice(page*PAGE_SIZE,(page+1)*PAGE_SIZE);
  const active=entries.find(entry=>entry.id===selected)??shown[0];
  const contractCount=Number(!!game.self.npcContracts?.alien)+Number(!!game.self.npcContracts?.vampire)+Number(!!game.self.vampireDiscount);
  useEffect(()=>{if(page>=pages)setPage(pages-1);},[page,pages]);
  const sections:[Chapter,string,string,number,React.ReactNode][]=[
    ['events','เหตุการณ์','ทุกการตัดสินใจ',entries.length,<BookIcon/>],
    ['loans','สัญญากู้','หนี้และหลักประกัน',game.loans?.length??0,<CoinIcon/>],
    ['seals','ตราคนบาป','สิทธิ์และข้อเสนอ',game.sealMarket?.holdings.length??0,<EventIcon/>],
    ['wishes','รายการตามหา','ของที่พ่อค้าต้องการ',game.self.wishBook?.length??0,<MarketIcon/>],
    ['contracts','สัญญาพ่อค้า','พันธะที่ยังมีผล',contractCount,<HandshakeIcon/>],
  ];
  return <div className="ledger-spread">
    <aside className="ledger-rail" aria-label="บทในบันทึก">{sections.map(([id,label,caption,count,icon])=><ComicDestination key={id} icon={icon} label={label} caption={caption} count={count} selected={chapter===id} onClick={()=>{setChapter(id);setPage(0);setSelected(null);}}/>)}</aside>
    {chapter==='events'?<>
      <section className="ledger-list" aria-label="ลำดับเหตุการณ์">
        <div className="ledger-section-head"><div><span className="ledger-kicker">บันทึกการเดินทาง</span><h3>เหตุการณ์ทั้งหมด</h3></div><span>ช่วง {game.encounter} · {entries.length} รายการ</span></div>
        <div className="ledger-event-list">{shown.length?shown.map((entry,index)=><button type="button" key={`${entry.id}-${index}`} className={`ledger-event${active===entry?' selected':''}`} aria-pressed={active===entry} onClick={()=>setSelected(entry.id)}>
          <span className="ledger-event-number">{entries.length-page*PAGE_SIZE-index}</span>
          <span className="ledger-event-copy"><strong title={entry.action}>{entry.action}</strong><small title={entry.cause}>{entry.cause}</small></span>
          <span className="ledger-event-delta">{entry.changes[0]??`ช่วง ${entry.encounter}`}</span>
        </button>):<div className="ledger-empty">ยังไม่มีเหตุการณ์ในบันทึก เมื่อคุณเลือกทางหรือทรัพยากรเปลี่ยน เหตุการณ์จะปรากฏที่นี่</div>}</div>
        <CompactPager page={page} pages={pages} onChange={next=>{setPage(next);setSelected(null);}} label="หน้าเหตุการณ์"/>
      </section>
      <section className="ledger-detail" aria-label="รายละเอียดเหตุการณ์">{active?<EventDetail entry={active}/>:<div className="ledger-empty">เลือกเหตุการณ์เพื่อดูผลและสาเหตุ</div>}</section>
    </>:<section className="ledger-chapter" aria-label={sections.find(([id])=>id===chapter)?.[1]}>
      <div className="ledger-section-head"><div><span className="ledger-kicker">ช่วง {game.encounter} · ห้อง {room.code}</span><h3>{sections.find(([id])=>id===chapter)?.[1]}</h3></div></div>
      <div className="ledger-chapter-content">{chapter==='loans'?(game.secureEconomy?<FinancePanel game={game} submit={submit} disabled={disabled} playerNames={playerNames}/>:<div className="ledger-empty">ห้องนี้ไม่มีระบบสัญญากู้</div>):chapter==='seals'?(game.sealMarket?.holdings.length||game.sealMarket?.offers.length||game.sealMarket?.redemption?<SealPanel game={game} submit={submit} disabled={disabled} playerNames={playerNames}/>:<div className="ledger-empty">ยังไม่มีตราคนบาปหรือข้อเสนอในช่วงนี้</div>):chapter==='wishes'?(game.self.wishBook?.length?<WishlistPanel game={game}/>:<div className="ledger-empty">ยังไม่มีรายการสินค้าที่พ่อค้าตามหา</div>):contractCount?<NpcContracts game={game}/>:<div className="ledger-empty">ยังไม่มีพันธะกับพ่อค้าที่ต้องติดตาม</div>}</div>
    </section>}
  </div>;
}
function EventDetail({entry}:{entry:JournalEntry}) {
  return <><div className="ledger-detail-art">{entry.itemKind?<img src={itemImage(entry.itemKind)} alt=""/>:<BookIcon/>}</div>
    <span className="ledger-kicker">เหตุการณ์ #{entry.id}</span><h3>{entry.action}</h3>
    <dl className="ledger-facts"><div><dt>{entry.choice?'เลือก':'ช่วง'}</dt><dd>{entry.choice??`${entry.encounter} · ${{PORTALS:'พบพ่อค้า',APPRAISAL:'ประเมิน',TRADE:'ซื้อขาย',REVEAL:'สรุป',RESULTS:'ผลเกม'}[entry.phase]}`}</dd></div><div><dt>ผล</dt><dd title={entry.changes.join(' · ')}>{entry.changes.length?entry.changes.join(' · '):'ไม่มีทรัพยากรเปลี่ยน'}</dd></div><div><dt>สาเหตุ</dt><dd title={entry.cause}>{entry.cause}</dd></div></dl>
  </>;
}
