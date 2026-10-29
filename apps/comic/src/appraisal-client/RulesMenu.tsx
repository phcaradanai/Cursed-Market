import {useState} from 'react';
import type {AppraisalTimerSettings} from '../shared/appraisal-protocol.js';
import {ComicDestination} from './ComicUI.js';
import {BookIcon,CoinIcon,EventIcon,MarketIcon} from './icons.js';
import {pick} from './i18n.js';

type ChapterId='start'|'cycle'|'inspect'|'trade'|'score';
type RuleStep={title:string;caption:string;facts:[string,string,string]};
type RuleChapter={id:ChapterId;title:string;caption:string;icon:React.ReactNode;heading:string;steps:[RuleStep,RuleStep,RuleStep,RuleStep]};
const label=(th:string,en:string)=>pick(th,en);

function chapters(survival:boolean,timers:AppraisalTimerSettings|undefined,trustAbilities:boolean):RuleChapter[] {
  const timer=timers?.enabled
    ?label('ห้องนี้จับเวลาตามช่วงที่เจ้าของห้องกำหนด','This room uses the host’s phase timers')
    :label('ห้องนี้ไม่จับเวลา รอผู้เล่นทุกคนจบช่วง','No timer: wait for every player to finish');
  return [
    {id:'start',title:label('เริ่มเล่น','Getting started'),caption:label('ตั้งห้องและทรัพยากร','Room and resources'),icon:<EventIcon/>,heading:label('เริ่มการเดินทาง','Start the journey'),steps:[
      {title:label('รวมผู้เล่น','Gather players'),caption:label('นักประเมิน 2–4 คนต่อห้อง','2–4 appraisers per room'),facts:[label('ผู้เล่นแต่ละคนมีโต๊ะและพ่อค้าของตน','Each player has their own merchant desk'),label('เลือกพ่อค้าเองในแต่ละช่วง','Choose your merchant each encounter'),timer]},
      {title:label('ดูทรัพยากร','Watch resources'),caption:label('เครดิต พลัง และชีวิตแยกกัน','Credits, energy and life differ'),facts:[label('เครดิตใช้ซื้อของและจ่ายค่าดีล','Credits pay for goods and deals'),label('พลังใช้กับการกระทำที่มีต้นทุน','Energy pays for costly actions'),label('ชีวิต 0 แล้วเป็นผู้ชมในโหมดเอาชีวิตรอด','At zero life, survival players spectate')]},
      {title:label('อ่านข้อเสนอ','Read the offer'),caption:label('ของแต่ละชิ้นมีความเสี่ยง','Every good has a risk'),facts:[label('ราคา ความแท้ และคำสาปเป็นคนละข้อมูล','Price, authenticity and curse are separate facts'),label('พ่อค้าแต่ละรายเสนอสินค้าต่างกัน','Merchants offer different goods'),label('ตรวจข้อมูลก่อนยอมรับความเสี่ยง','Inspect before taking a risk')]},
      {title:label('เลือกทางเดิน','Choose a path'),caption:label('พ่อค้าและเหตุการณ์เปลี่ยนในรันใหม่','Merchants and events change each run'),facts:[label('ตอบเหตุการณ์ที่ปรากฏก่อนเข้าประตู','Resolve an event before entering a door'),label('เลือกพ่อค้าได้หนึ่งรายต่อช่วง','Meet one merchant each encounter'),trustAbilities?label('ความไว้ใจปลดล็อกความสามารถพ่อค้า','Trust unlocks merchant abilities'):label('เล่นตามกติกาห้องที่เปิดไว้','Follow the room’s selected rules')]},
    ]},
    {id:'cycle',title:label('วงจรแต่ละช่วง','Encounter loop'),caption:label('เล่นทีละสี่ขั้น','Four steps each round'),icon:<BookIcon/>,heading:label('หนึ่งช่วง เล่นอย่างไร','How one encounter works'),steps:[
      {title:label('เลือกพ่อค้า','Choose merchant'),caption:label('เลือกประตูและพบสินค้า','Enter a door to see goods'),facts:[label('ดูรายการตลาดมืดก่อนเลือกได้','Check the Dark Market first'),label('เลือกพบพ่อค้าเพียงหนึ่งราย','Meet only one merchant'),label('ตอบเหตุการณ์ก่อนเข้าประตู','Resolve offered events before entering')]},
      {title:label('ประเมินและซื้อ','Appraise and buy'),caption:label('ตรวจสินค้า ตีราคา แล้วตัดสินใจ','Inspect, appraise, decide'),facts:[label('ตรวจหรือตีราคาฟรี 1 ครั้งต่อชิ้น','One free inspect or appraisal per item'),label('ตรวจเพิ่มได้เริ่มต้น 2 ครั้งต่อช่วง','Two extra inspections per encounter initially'),label('ราคาซื้อใช้เมื่อพ่อค้ายอมรับ','Buy at the price the merchant accepts')]},
      {title:label('ซื้อขาย','Trade'),caption:label('ยื่นข้อเสนอให้ผู้เล่นอื่น','Make offers to other players'),facts:[label('เปิดของให้ผู้เล่นอื่นเห็นก่อนเสนอขาย','Share goods before other players offer'),label('ผู้ขายต้องตอบรับก่อนโอนสินค้า','Seller accepts before transfer'),label('ตลาดมืดรับซื้อของที่ตรงรายการ','Dark Market buys eligible goods')]},
      {title:label('รับเครดิต','Collect credits'),caption:label('รับเลยหรือเสี่ยงเหรียญ','Bank or risk a coin flip'),facts:[label('ช่วงคี่รับพื้นฐาน 10 เครดิต','Odd encounters pay 10 base credits'),label('ช่วงคู่รับพื้นฐาน 15 เครดิต','Even encounters pay 15 base credits'),label('เสี่ยงเหรียญได้หรือหยุดรับยอดที่มี','Flip coins or bank the current amount')]},
    ]},
    {id:'inspect',title:label('ตรวจและซื้อ','Inspect and buy'),caption:label('อ่านของก่อนจ่าย','Learn before paying'),icon:<EventIcon/>,heading:label('รู้ก่อนซื้อ ตัดสินใจเอง','Know before you buy'),steps:[
      {title:label('ตรวจข้อมูล','Inspect facts'),caption:label('ราคา ความแท้ คำสาป','Price, authenticity, curse'),facts:[label('เลือกตรวจได้ทีละคุณสมบัติ','Inspect one property at a time'),label('รู้ความแท้ไม่ได้แปลว่าไร้คำสาป','Genuine does not mean uncursed'),label('ข้อมูลที่ยังไม่ตรวจยังคงไม่ทราบ','Uninspected facts stay unknown')]},
      {title:label('ตีราคา','Name a price'),caption:label('เสนอราคาให้พ่อค้าตัดสิน','Merchant decides whether to accept'),facts:[label('ราคาที่เสนออาจถูกยอมรับหรือปฏิเสธ','The merchant can accept or reject'),label('กดราคาต่ำเพิ่มโอกาสถูกจับผิด','Low appraisals raise suspicion'),label('ราคาที่รับแล้วจึงเป็นราคาซื้อ','Accepted appraisal becomes the buy price')]},
      {title:label('ซื้อเข้ากระเป๋า','Buy and keep'),caption:label('จ่ายเครดิต รับสินค้าชิ้นนั้น','Pay credits and take the item'),facts:[label('ต้องมีเครดิตพอจ่ายราคาที่ใช้ซื้อ','You need enough credits'),label('ซื้อแล้วเก็บในกระเป๋าได้','Bought goods enter your bag'),label('ของแต่ละชิ้นมีข้อมูลที่คุณรู้ต่างกัน','Knowledge stays with each item')]},
      {title:label('เปิดใช้สินค้า','Activate a good'),caption:label('ผลดีอาจมาพร้อมความเสี่ยง','Benefit can carry risk'),facts:[label('ของแท้ให้ผลดีตามชนิด','Genuine goods grant their benefit'),label('ของปลอมมีโอกาส 40% ที่ผลดียังทำงาน','Fake goods have a 40% benefit chance'),label('ของต้องสาปมีผลเสียเมื่อใช้','Cursed goods bring a drawback')]},
    ]},
    {id:'trade',title:label('ซื้อขายและตลาดมืด','Trade & market'),caption:label('ข้อเสนอและประมูล','Offers and auctions'),icon:<MarketIcon/>,heading:label('ของมีค่าเมื่อหาคนซื้อ','Goods need buyers'),steps:[
      {title:label('เปิดของ','Share goods'),caption:label('แสดงของที่อยากขาย','Show goods for sale'),facts:[label('แบ่งปันข้อมูลของที่ถือหรือที่ประเมิน','Share owned or appraised goods'),label('ผู้เล่นอื่นจึงยื่นข้อเสนอได้','Other players can then offer'),label('ของบางชิ้นขายได้เฉพาะเมื่อปลดล็อก','Some goods may be locked')]},
      {title:label('รับข้อเสนอ','Accept an offer'),caption:label('ผู้ขายเป็นคนตอบตกลง','Seller makes the final call'),facts:[label('ข้อเสนอระบุราคาหรือของที่แลก','Offers state a price or swap'),label('ตอบรับแล้วจึงจ่ายและโอนสินค้า','Payment and transfer follow acceptance'),label('ข้อเสนอจากผู้เล่นไม่ถูก NPC ลงโทษ','Player offers have no NPC penalty')]},
      {title:label('ขายตลาดมืด','Sell to Dark Market'),caption:label('อ่านเงื่อนไขก่อนส่งของ','Check each listing’s condition'),facts:[label('แต่ละรายการมีสิทธิ์ขายแยกกัน','Each listing has a separate quota'),label('ตรงเงื่อนไขอาจได้โบนัส','Matching conditions may pay a bonus'),label('ผิดเงื่อนไขเลือกราคาลดหรือจ่ายต้นทุน','Mismatch means discount or listed cost')]},
      {title:label('ประมูลปิดซอง','Sealed auction'),caption:label('บางช่วงมีของให้ประมูล','Some encounters offer lots'),facts:[label('เห็นราคาขั้นต่ำและยอดของตัวเอง','See the minimum and your own bid'),label('ราคาของคนอื่นเป็นความลับ','Other bids remain hidden'),label('ประมูลจบแล้วผู้ชนะรับสินค้า','Winner receives the item at settlement')]},
    ]},
    {id:'score',title:label('จบเกมและคะแนน','End & score'),caption:label('อยู่รอดและคิดผล','Survive and settle'),icon:<CoinIcon/>,heading:label('ตอนจบ คิดอะไรบ้าง','What counts at the end'),steps:[
      {title:label('จบช่วง','End encounter'),caption:survival?label('ชีวิตลดตามกติกาห้อง','Life decays by room rules'):label('พักแล้วกลับช่วงหน้า','Rest and return next round'),facts:survival?[label('พลังกับชีวิตเป็นคนละทรัพยากร','Energy and life are separate'),label('ชีวิตหมดแล้วดูผู้เล่นอื่นต่อ','At zero life, spectate'),label('ของและเครดิตยังอยู่รอคิดคะแนน','Goods and credits remain for scoring')]:[label('พลังหมดพักเฉพาะช่วงนี้','Exhaustion rests this encounter'),label('เริ่มช่วงใหม่แล้วกลับมาเล่น','Return next encounter'),label('คะแนนก่อนหน้ายังคงอยู่','Earlier points remain')]},
      {title:survival?label('Collector มา','Collector arrives'):label('ครบสามช่วง','Three rounds complete'),caption:survival?label('ถึงกำหนดหรือทุกคนชีวิตหมด','Deadline or all players fall'):label('จบการเดินทาง','Journey concludes'),facts:survival?[label('Collector มาเมื่อครบช่วงที่กำหนด','Collector comes at the set encounter'),label('หรือเมื่อทุกคนชีวิตหมด','Or when everyone has lost all life'),label('คิดผลให้ผู้เล่นทุกคนพร้อมกัน','All players settle together')]:[label('เล่นทั้งหมดสามช่วง','Play three encounters'),label('รวมคะแนนที่ทำได้แต่ละช่วง','Add points from each encounter'),label('ผู้ได้คะแนนสูงสุดชนะ','Highest score wins')]},
      {title:label('นับทรัพย์สิน','Value goods'),caption:label('เครดิตและของที่เหลือมีค่า','Credits and kept goods matter'),facts:survival?[label('รวมเครดิตกับมูลค่าจริงของสินค้า','Add credits and true item value'),label('ของปลอมเหลือ 25% ของมูลค่า','Fake goods count at 25%'),label('คำสาปลดมูลค่าอีก 25%','Curse reduces value by another 25%')]:[label('ทรัพย์สินเพิ่มช่วยคะแนนช่วง','Wealth gain contributes to round score'),label('ประเมินตรงมูลค่าจริง ±10% ได้โบนัส','Appraisals within ±10% earn a bonus'),label('ของปลอมและต้องสาปมีค่าน้อยลง','Fake and cursed goods are worth less')]},
      {title:label('คิดผลติดตัว','Apply effects'),caption:label('สถานะที่ยังอยู่มีผลตอนจบ','Remaining statuses can matter'),facts:survival?[label('ผลดีและผลเสียปรับคะแนนรวม','Buffs and debuffs modify total score'),label('รวมเปอร์เซ็นต์ก่อนปัดลง','Combine percentages before rounding'),label('ผู้ตายยังได้คะแนนจากทรัพย์ที่เก็บ','Dead players still score stored wealth')]:[label('สถานะบางอย่างช่วยหรือขัดขวาง','Some statuses help or hinder'),label('อ่านผลติดตัวในเมนูสถานะ','Check active effects in Status'),label('ผลช่วงจะแสดงหลังซื้อขาย','Round results appear after trading')]},
    ]},
  ];
}

export function RulesMenu({survival,timers,trustAbilities}:{survival:boolean;timers?:AppraisalTimerSettings|undefined;trustAbilities:boolean}) {
  const [chapterId,setChapterId]=useState<ChapterId>('cycle');
  const [selected,setSelected]=useState(1);
  const list=chapters(survival,timers,trustAbilities);
  const chapter=list.find(entry=>entry.id===chapterId)!;
  const active=chapter.steps[selected]!;
  return <div className="ledger-spread rules-spread">
    <aside className="ledger-rail rules-rail" aria-label={label('หมวดกติกา','Rule chapters')}>
      {list.map(entry=><ComicDestination key={entry.id} icon={entry.icon} label={entry.title} caption={entry.caption} selected={chapterId===entry.id} onClick={()=>{setChapterId(entry.id);setSelected(entry.id==='cycle'?1:0);}}/>)}
    </aside>
    <section className="ledger-list rules-center" aria-label={chapter.heading}>
      <header className="ledger-section-head"><div><span className="ledger-kicker">{label('คู่มือการเดินทาง','Journey guide')}</span><h3>{chapter.heading}</h3></div></header>
      <div className="rules-step-grid">{chapter.steps.map((step,index)=><button type="button" key={`${chapter.id}-${index}`} className={`rules-step${selected===index?' selected':''}`} aria-pressed={selected===index} onClick={()=>setSelected(index)}>
        <span className="rules-step-heading"><span className="rules-step-number">{String(index+1).padStart(2,'0')}</span><strong>{step.title}</strong></span>
        <span className="rules-step-caption">{step.caption}</span>
      </button>)}</div>
    </section>
    <section className="ledger-detail rules-detail" aria-label={label('รายละเอียดกติกา','Rule details')}>
      <div className="rules-detail-hero"><div><span className="ledger-kicker">{label(`ขั้นตอนที่ ${String(selected+1).padStart(2,'0')}`,`Step ${String(selected+1).padStart(2,'0')}`)}</span><h3>{active.title}</h3></div></div>
      <ul className="rules-facts">{active.facts.map((fact,index)=><li key={`${chapter.id}-${selected}-${index}`}><span className="rules-fact-mark" aria-hidden="true">{index+1}</span><span>{fact}</span></li>)}</ul>
    </section>
  </div>;
}
