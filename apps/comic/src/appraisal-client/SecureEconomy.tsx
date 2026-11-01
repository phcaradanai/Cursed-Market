import {ComicButton,ComicPhaseFrame,ComicMenu,CompactPager} from './ComicUI.js';
import {HandshakeIcon,MinusIcon,PlusIcon,EnergyIcon} from './icons.js';
import {Peek} from './lore.js';
import {itemName} from './catalog-text.js';
import { ItemVisual } from './ItemVisual.js';
import {useEffect,useId,useState} from 'react';
import type {Actions} from './components.js';
import type {AppraisalView,ItemView} from '../game/appraisal/types.js';
import type {RpsHand} from '../game/appraisal/theft.js';
import {itemLabel,npcName} from './catalog-text.js';
import {pick} from './i18n.js';

type Props=Actions & {playerNames?:Record<string,string>};
/** Seconds left on a server clock, corrected for the gap between this device and the server. */
function DuelClock({deadline,serverTime,autoMissing=false}:{deadline:number;serverTime:number;autoMissing?:boolean}) {
  // serverTime was stamped when the state left the server, so it doubles as the clock offset.
  const left=(offset:number)=>Math.max(0,Math.ceil((deadline-Date.now()-offset)/1000));
  const [remaining,setRemaining]=useState(()=>left(serverTime-Date.now()));
  useEffect(()=>{
    const offset=serverTime-Date.now();
    const update=()=>setRemaining(left(offset));
    update();const timer=setInterval(update,250);return()=>clearInterval(timer);
  },[deadline,serverTime]);
  return <p className="why" role="timer">{pick(`ส่งมือภายใน ${remaining} วินาที ${autoMissing?'หมดเวลาจะสุ่มเฉพาะมือที่ยังไม่ส่ง':'ไม่เช่นนั้นการดวลถูกยกเลิก'}`,`Play a hand within ${remaining}s ${autoMissing?'or missing hands are chosen automatically':'or the duel is cancelled'}`)}</p>;
}
const hands:RpsHand[]=['rock','paper','scissors'];
const handName=(hand:RpsHand)=>hand==='rock'?pick('ค้อน','Rock'):hand==='paper'?pick('กระดาษ','Paper'):pick('กรรไกร','Scissors');
const positive=(value:number)=>Number.isSafeInteger(value)&&value>0;
const paid=(game:AppraisalView)=>game.phase==='REVEAL' && !!game.self.roundReward?.settled;
const alive=(game:AppraisalView)=>game.self.paused!=='dead' && game.self.life!==0;
const credits=(amount:number)=>pick(`${amount} เครดิต`,`${amount} credits`);
function ItemArt({item}:{item:ItemView}) {
  return <><ItemVisual item={item} width={96} height={96}/><span>{itemLabel(item)}</span></>;
}
function Amount({label,value,onChange,min=1,max,disabled=false}:{label:string;value:string;onChange:(value:string)=>void;min?:number;max?:number;disabled?:boolean}) {
  const id=useId();
  return <label className="secure-amount" htmlFor={id}><span>{label}</span><input id={id} type="number" inputMode="numeric" min={min} max={max} step="1" value={value} onChange={event=>onChange(event.target.value)} disabled={disabled}/></label>;
}

type DuelView=NonNullable<AppraisalView['theft']>['duels'][number];
function ActiveTheftDuel({game,submit,disabled,playerNames={},duel,deadline,serverTime}:{duel:DuelView;deadline:number|undefined;serverTime:number}&Props) {
  const [historyPage,setHistoryPage]=useState(0);
  const own=duel.thiefId===game.self.id;
  const opponent=own?(duel.victimId?playerNames[duel.victimId]??duel.victimId:duel.npc?npcName(duel.npc):pick('พ่อค้า','Merchant')):playerNames[duel.thiefId]??duel.thiefId;
  const rounds=duel.revealed,at=Math.min(historyPage,Math.max(0,rounds.length-1)),round=rounds[at];
  return <ComicPhaseFrame className="theft-duel-screen" title={pick('เป่ายิ้งฉุบ','Rock, paper, scissors')} icon={<HandshakeIcon/>} tools={<span>{pick(`ตาที่ ${duel.round}`,`Round ${duel.round}`)}</span>}>
    <div className="theft-duel-spread">
      <section className="theft-duel-half" aria-label={pick('คู่ดวลและผลเดิมพัน','Opponent and stakes')}>
        <h3>{own?pick('ฉกของจาก','Steal from'):pick('ป้องกันของจาก','Defend against')}</h3>
        <div className="theft-duel-focus"><strong>{opponent}</strong><p>{own?pick('จ่ายแล้ว 1 พลัง · เสมอไม่เสียเพิ่ม','1 energy paid · No extra cost for draws'):pick('การดวลนี้ปฏิเสธไม่ได้ · ไม่เสียพลังในการป้องกัน','This duel cannot be refused · Defense costs no energy')}</p>
          <Peek tone="rule" label={pick('ผลเดิมพัน','Stakes')} card={<p>{duel.npc?pick('ชนะได้รับสินค้าที่เลือก แพ้เสียความไว้ใจ 2 และเพิ่มโทษห้ามค้าหนึ่งช่วง','Win the selected good. Losing costs 2 trust and adds one encounter of merchant trade ban'):pick('ผู้ขโมยชนะได้รับของที่ยังคว่ำหนึ่งชิ้น หากแพ้ ผู้ป้องกันได้ตราคนบาปและค่าชดเชย 5% ของราคาซื้อขายล่าสุด 4 ช่วง ผู้ขโมยห้ามเลือกคนเดิมอีก 2 ช่วง','A winning thief takes one concealed good. A losing thief grants a sinner seal and 5% of the last sale price for 4 encounters, and cannot target this player for 2 more encounters.')}</p>}/>
        </div>
        <div className="theft-duel-history">
          {duel.npcTell&&<p>{pick(duel.npcTell.text,`Merchant tell: favors ${handName(duel.npcTell.preferredHand).toLowerCase()}.`)}</p>}
          {duel.publicSwords&&(duel.publicSwords.you||duel.publicSwords.opponent)&&<p>{pick('ดาบเขี้ยวรอยแยก: เสมอตาแรก +1 · คุณ ', 'Riftfang: first tie +1 · You ')}{duel.publicSwords.you?1:0} / {pick('คู่ดวล ','Opponent ')}{duel.publicSwords.opponent?1:0}</p>}{duel.tieGoesTo&&<p>{duel.tieGoesTo==='you'?pick('เสมอนับเป็นของคุณ','Ties go to you'):pick('เสมอนับเป็นของอีกฝ่าย','Ties go to your opponent')}</p>}
          {round?<><p>{pick(`ตา ${at+1}: คุณออก `,`Round ${at+1}: you played `)}{handName(own?round.thief:round.opponent)} · {opponent} {handName(own?round.opponent:round.thief)}{round.thief===round.opponent?pick(' · เสมอ',' · Draw'):''}</p><CompactPager page={at} pages={rounds.length} onChange={setHistoryPage} label={pick('ประวัติการดวล','Duel history')}/></>:<p>{pick('ยังไม่มีตาที่เปิดมือ','No hands have been revealed')}</p>}
        </div>
      </section>
      <section className="theft-duel-half" aria-label={pick('เลือกมือของคุณ','Choose your hand')}>
        <h3>{pick('เปิดพร้อมกันทั้งสองฝ่าย','Both hands reveal together')}</h3>
        <div className="theft-duel-focus">
          {deadline!==undefined&&<DuelClock deadline={deadline} serverTime={serverTime} autoMissing={game.theftTimeoutRules===1}/>}
          <p role="status">{duel.submitted?pick('ส่งมือแล้ว ล็อกคำตอบไว้ รออีกฝ่าย','Hand sealed. Waiting for your opponent.'):pick('เลือกมือของคุณ','Choose your hand')}</p>
          {game.theftTimeoutRules===1&&<Peek tone="rule" label={pick('เมื่อหมดเวลา','On timeout')} card={<p>{pick('ระบบสุ่มเฉพาะมือที่ยังไม่ส่ง มือที่ส่งแล้วคงเดิมและตัดสินตามปกติ','Only missing hands are chosen automatically. Submitted hands stay sealed; normal results apply.')}</p>}/>}
        </div>
        <div className="theft-duel-hands" role="group" aria-label={pick('เลือกมือเป่ายิ้งฉุบ','Choose a hand')}>{hands.map(hand=><ComicButton key={hand} disabled={disabled||!duel.needsChoice} onClick={()=>submit({type:'theft-hand',duelId:duel.id,...(game.theftTimeoutRules===1?{round:duel.round}:{}),hand})}>{handName(hand)}</ComicButton>)}</div>
      </section>
    </div>
  </ComicPhaseFrame>;
}

export function TheftPanel({game,submit,disabled,playerNames={},deadlines={},serverTime=Date.now(),deskOpen=false,onDeskClose=()=>{},suspended=false}:Props & {deadlines?:Record<string,number>|undefined;serverTime?:number;deskOpen?:boolean;onDeskClose?:()=>void;suspended?:boolean}) {
  const [page,setPage]=useState<'targets'|'history'>('targets'),[stockPage,setStockPage]=useState(0),[duelPage,setDuelPage]=useState(0),[roundPage,setRoundPage]=useState<number|null>(null);
  if(!game.secureEconomy || !game.theft || !['APPRAISAL','TRADE'].includes(game.phase) || !alive(game))return null;
  const theft=game.theft,p=game.self,name=(id:string)=>playerNames[id]??id,active=theft.duels.find(d=>d.status==='open');
  if(active)return <div inert={suspended}><ActiveTheftDuel key={active.id} game={game} submit={submit} disabled={disabled||suspended} playerNames={playerNames} duel={active} deadline={deadlines[active.id]} serverTime={serverTime}/></div>;
  const spent=!!p.stealTried?.length,blocked=!game.core2||disabled||!!p.paused||p.done||!!p.eventOffer||!!p.abilityChoice||spent||p.energy<1;
  const why=!game.core2?pick('ห้องนี้ไม่ได้เปิดการขโมย','Theft is not enabled in this room'):p.abilityChoice?pick('เลือกสินค้าที่พ่อค้าเสนอให้ก่อน','Choose the pending merchant item first'):spent?pick('ใช้โอกาสขโมยช่วงนี้แล้ว','Theft attempt spent'):p.energy<1?pick('ต้องมีอย่างน้อย 1 พลัง','Requires at least 1 energy'):p.eventOffer?pick('ตอบเหตุการณ์ก่อน','Resolve the event first'):disabled||p.paused||p.done?pick('ยังเริ่มขโมยไม่ได้ในตอนนี้','Cannot start theft right now'):pick('ใช้ 1 พลัง · ขโมยได้ครั้งเดียวต่อช่วง','1 energy · One theft per encounter');
  const stockPages=Math.max(1,Math.ceil(p.stock.length/2)),stockAt=Math.min(stockPage,stockPages-1);
  const duels=[...theft.duels].reverse(),duelAt=Math.min(duelPage,Math.max(0,duels.length-1)),duel=duels[duelAt];
  const own=duel?.thiefId===p.id,opponent=duel?(own?(duel.victimId?name(duel.victimId):duel.npc?npcName(duel.npc):pick('พ่อค้า','Merchant')):name(duel.thiefId)):'';
  const result=!duel?'':duel.status==='cancelled'?pick('เป้าหมายไม่พร้อมแล้ว','Target became unavailable'):(duel.status==='won')===own?pick(own?'ขโมยสำเร็จ':'ป้องกันสำเร็จ',own?'Theft succeeded':'Defense succeeded'):pick(own?'ขโมยไม่สำเร็จ':'ถูกขโมยของหนึ่งชิ้น',own?'Theft failed':'One carried item was stolen');
  const rounds=duel?.revealed??[],roundAt=Math.min(roundPage??Math.max(0,rounds.length-1),Math.max(0,rounds.length-1)),round=rounds[roundAt];
  const toggle=()=>{setPage(page==='targets'?'history':'targets');setRoundPage(null);};
  return <ComicMenu id="theft-desk" open={deskOpen&&!suspended} title={pick('ขโมยและผลดวล','Theft and duel history')} icon={<HandshakeIcon/>} className="theft-desk" onClose={onDeskClose} action={<ComicButton disabled={page==='targets'&&!duels.length&&!theft.crime} onClick={toggle}>{page==='targets'?pick('ดูผลดวล','Duel history'):pick('เลือกเป้าหมาย','Choose a target')}</ComicButton>}>
    <div className="theft-duel-spread theft-desk-spread">
      {page==='targets'?<>
        <section className="theft-duel-half" aria-label={pick('สินค้าหน้าร้าน','Merchant goods')}><h3>{pick('สินค้าหน้าร้าน','Merchant goods')}</h3>
          <div className="theft-desk-stock">{p.stock.slice(stockAt*2,stockAt*2+2).map(item=><ComicButton key={item.id} className="theft-target-item" disabled={!!blocked} onClick={()=>submit({type:'theft-start',itemId:item.id})}><ItemArt item={item}/><small>{pick('ขโมยชิ้นนี้','Steal this item')} · 1 <EnergyIcon/></small></ComicButton>)}{!p.stock.length&&<p>{pick('ไม่มีสินค้าหน้าร้านให้ขโมย','No merchant goods available')}</p>}</div>
          <div className="theft-desk-footer">{stockPages>1?<CompactPager page={stockAt} pages={stockPages} onChange={setStockPage} label={pick('หน้าสินค้าที่ขโมยได้','Merchant target pages')}/>:<p>{why}</p>}<Peek tone="rule" label={pick('ผลเมื่อแพ้พ่อค้า','Merchant loss consequences')} card={<p>{pick('แพ้: ความเชื่อใจพ่อค้าคนนี้ −2 และเพิ่มโทษห้ามค้าหนึ่งช่วง ใช้ 1 พลังต่อการเริ่มขโมย สิทธิ์ใช้แล้วไม่คืนเมื่อเป้าหมายไม่พร้อม','Lose: −2 trust with this merchant and one more encounter of merchant trade ban. Starting theft costs 1 energy; cancelled targets do not refund the attempt.')}</p>}/></div>
        </section>
        <section className="theft-duel-half" aria-label={pick('ของที่ผู้เล่นถืออยู่','Carried player goods')}><h3>{pick('ของที่ผู้เล่นถืออยู่','Carried player goods')}</h3>
          <div className="theft-desk-players">{theft.targets.map(target=>{const empty=game.players.find(s=>s.id===target.playerId)?.itemCount===0,cooldown=target.blockedUntilEncounter!==undefined;return <ComicButton key={target.playerId} disabled={!!blocked||empty||cooldown} onClick={()=>submit({type:'theft-start',victimId:target.playerId})}>{pick('ขโมยจาก ','Steal from ')}{name(target.playerId)}{empty?<small>{pick('ยังไม่มีของที่ถืออยู่','No carried goods')}</small>:cooldown?<small>{pick(`ห้ามจนจบช่วง ${target.blockedUntilEncounter}`,`Blocked through encounter ${target.blockedUntilEncounter}`)}</small>:<small>1 <EnergyIcon/></small>}</ComicButton>})}{!theft.targets.length&&<p>{pick('ยังไม่มีผู้เล่นที่พร้อมเป็นเป้าหมาย','No player targets are available.')}</p>}</div>
          <div className="theft-desk-footer"><p>{why}</p><Peek tone="rule" label={pick('ข้อมูลเป้าหมายและผลเมื่อแพ้','Concealed target and loss consequences')} card={<p>{pick('ของเป้าหมายยังคว่ำอยู่ คุณจะไม่เห็นว่าเป็นชิ้นไหนก่อนชนะ แพ้: เหยื่อได้ตราคนบาปของคุณ 1 ใบ ขโมยคนเดิมไม่ได้อีก 2 ช่วง และจ่ายชดเชย 5% ของราคาซื้อขายล่าสุดของชิ้นนั้น 4 ช่วงถัดไป','The target item stays concealed until you win. Lose: the victim gets one of your sinner seals, you cannot target them for 2 more encounters, and you pay 5% of the good’s last trade price at each of the next 4 encounter starts.')}</p>}/></div>
        </section>
      </>:<>
        <section className="theft-duel-half"><h3>{opponent||pick('ผลดวล','Duel result')}</h3><div className="theft-duel-focus"><strong role="status">{result||pick('ยังไม่มีผลดวล','No duel results yet')}</strong>{duel&&<p>{pick(`ตัดสินในตาที่ ${duel.round}`,`Resolved in round ${duel.round}`)}</p>}{theft.crime&&<p className={theft.crime.active?'danger-text':'supporting'}>{pick(`โทษห้ามค้าช่วง ${theft.crime.banStartsEncounter}–${theft.crime.banUntilEncounter} · ใบประกาศ ${credits(theft.crime.noticePrice)}`,`Merchant ban: encounters ${theft.crime.banStartsEncounter}–${theft.crime.banUntilEncounter} · Notice ${credits(theft.crime.noticePrice)}`)}</p>}</div><div className="theft-desk-footer">{duels.length>1&&<CompactPager page={duelAt} pages={duels.length} onChange={at=>{setDuelPage(at);setRoundPage(null);}} label={pick('ประวัติการดวล','Duel history pages')}/>}</div></section>
        <section className="theft-duel-half"><h3>{pick('มือที่เปิดแล้ว','Revealed hands')}</h3><div className="theft-duel-focus">{round?<><p>{pick(`ตาที่ ${roundAt+1}`,`Round ${roundAt+1}`)}</p><strong>{handName(own?round.thief:round.opponent)} · {handName(own?round.opponent:round.thief)}</strong><p>{pick('มือคุณ · มือคู่ดวล','Your hand · Opponent hand')}{round.thief===round.opponent?pick(' · ออกมือเสมอ',' · Matching hands'):''}</p></>:<p>{pick('ยังไม่มีตาที่เปิดมือ','No hands have been revealed')}</p>}</div><div className="theft-desk-footer">{rounds.length>1&&<CompactPager page={roundAt} pages={rounds.length} onChange={setRoundPage} label={pick('ตาที่เปิดมือ','Revealed rounds')}/>}</div></section>
      </>}
    </div>
  </ComicMenu>;
}

export function VaultPanel({game,submit,disabled}:Props) {
  const [amount,setAmount]=useState('10'),[carriedPage,setCarriedPage]=useState(0),[storedPage,setStoredPage]=useState(0);
  if(!game.secureEconomy || !paid(game) || !alive(game))return null;
  const p=game.self,vault=p.personalVault??{items:[],credits:0,slots:2,nextSlotPrice:10,nextInterest:0,interestPercent:game.vaultInterestPercent??4};
  const value=Number(amount),valid=positive(value),max=Math.max(p.credits,vault.credits);
  const locked=pick('ยืนยันไปต่อแล้ว หรือกำลังรอการเชื่อมต่อ','Already ready, or waiting for connection');
  const depositWhy=disabled?locked:!valid?pick('ใส่จำนวนเต็มบวก','Enter a positive whole number'):value>p.credits?pick('เครดิตในกระเป๋าไม่พอ','Not enough wallet credits'):undefined;
  const withdrawWhy=disabled?locked:!valid?pick('ใส่จำนวนเต็มบวก','Enter a positive whole number'):value>vault.credits?pick('เครดิตในคลังไม่พอ','Not enough vault credits'):undefined;
  const slotCount=Math.max(vault.items.length,Math.min(vault.slots,Math.ceil((vault.items.length+1)/2)*2));
  const shelf=(stored:boolean)=>{
    const items=stored?vault.items:p.inventory,total=stored?slotCount:items.length,pages=Math.max(1,Math.ceil(total/2)),at=Math.min(stored?storedPage:carriedPage,pages-1),setPage=stored?setStoredPage:setCarriedPage;
    return <section className="vault-shelf" aria-label={stored?pick('สินค้าที่ฝากไว้','Stored items'):pick('สินค้าที่ถืออยู่','Carried items')}>
      <header><h3>{stored?pick('ในคลัง','In the vault'):pick('ของที่ถืออยู่','Carried items')} <small>{stored?`${items.length}/${vault.slots}`:items.length}</small></h3>{pages>1&&<CompactPager page={at} pages={pages} onChange={setPage} label={stored?pick('หน้าของในคลัง','Stored item pages'):pick('หน้าของที่ถืออยู่','Carried item pages')}/>}</header>
      <div className="vault-item-row">{Array.from({length:Math.min(2,total-at*2)},(_,offset)=>{const item=items[at*2+offset];
        if(!item)return <div className="vault-empty-slot" key={offset}>{pick('ว่าง','Empty')}</div>;
        const why=disabled?locked:!stored&&item.lockedUntil!==null?pick('สินค้าติดล็อก ฝากไม่ได้','Locked item cannot be deposited'):!stored&&vault.items.length>=vault.slots?pick('คลังเต็ม เพิ่มช่องหรือถอนของก่อน','Vault full; expand or withdraw first'):undefined;
        return <ComicButton key={item.id} className="vault-item" disabled={!!why} title={why??itemName(item.kind)} aria-label={`${stored?pick('ถอน','Withdraw'):pick('ฝาก','Deposit')} ${itemName(item.kind)}`} onClick={()=>submit({type:stored?'vault-withdraw-item':'vault-deposit-item',itemId:item.id})}><ItemVisual item={item} width={80} height={80}/><strong>{itemName(item.kind)}</strong><small>{stored?pick('ถอน','Withdraw'):pick('ฝาก','Deposit')}</small></ComicButton>;
      })}{!total&&<p className="vault-empty-slot">{pick('ไม่มีของที่ถืออยู่','No carried items')}</p>}</div>
    </section>;
  };
  return <div className="vault-spread" aria-label={pick('คลังนิรภัย','Personal vault')}>
    <section className="vault-money"><h3>{pick('ฝาก–ถอนเครดิต','Deposit and withdraw credits')}</h3>
      <dl className="vault-balances"><div><dt>{pick('ในกระเป๋า','Wallet')}</dt><dd>{p.credits}</dd></div><div><dt>{pick('ในคลัง','Vault')}</dt><dd>{vault.credits}</dd></div></dl>
      <div className="vault-transfer"><div className="vault-stepper"><ComicButton aria-label={pick('ลดจำนวนเครดิต','Decrease credit amount')} disabled={disabled||!valid||value<=1} title={disabled?locked:pick('จำนวนต่ำสุด 1 เครดิต','Minimum 1 credit')} onClick={()=>setAmount(String(value-1))}><MinusIcon/></ComicButton><Amount label={pick('จำนวนเครดิต','Credit amount')} value={amount} onChange={setAmount} max={max} disabled={disabled}/><ComicButton aria-label={pick('เพิ่มจำนวนเครดิต','Increase credit amount')} disabled={disabled||!valid||value>=max} title={disabled?locked:pick('ไม่เกินเครดิตที่มี','Cannot exceed available credits')} onClick={()=>setAmount(String(value+1))}><PlusIcon/></ComicButton></div>
      <div className="vault-transfer-actions"><ComicButton tone="primary" disabled={!!depositWhy} title={depositWhy} onClick={()=>submit({type:'vault-deposit-credits',amount:value})}>{pick('ฝากเงิน','Deposit credits')}</ComicButton><ComicButton disabled={!!withdrawWhy} title={withdrawWhy} onClick={()=>submit({type:'vault-withdraw-credits',amount:value})}>{pick('ถอนเงิน','Withdraw credits')}</ComicButton></div></div>
      <div className="vault-interest"><span>{pick('ดอกเบี้ยถัดไป','Next interest')} <strong>{credits(vault.nextInterest)}</strong></span><Peek tone="rule" label={pick('วิธีคิด','Interest rules')} card={<><p>{pick(`ดอกเบี้ย ${vault.interestPercent??4}% ต่อช่วง ${vault.interestPercent===10?'เฉพาะเงินต้นที่อยู่ครบช่วง ถอนเงินใหม่ก่อนเงินเก่า เติมใหม่ไม่รับย้อนหลัง ปัดเศษลง':'ตามกติกาเดิมของรัน'} จ่ายเข้ากระเป๋า ยอดที่มีสิทธิ์ตอนนี้ได้ ${vault.nextInterest} เครดิต ไม่ทบต้นเอง`,`Interest is ${vault.interestPercent??4}% per encounter. ${vault.interestPercent===10?'Only principal held for a full encounter qualifies; withdrawals use new deposits first. New deposits earn no retroactive interest. Rounded down.':'Historical whole-balance rules apply.'} Paid to your wallet. Eligible payment: ${vault.nextInterest} credits. It does not compound by itself.`)}</p><p>{pick('เริ่มต้นฟรี 2 ช่อง','First 2 slots are free')}</p></>}/></div>
      <p className="vault-custody-note">{pick('ของในคลังขโมยไม่ได้ ใช้ไม่ได้ และไม่มีผลบวกหรือลบกับผู้ถือครอง ถอนแล้วจึงกลับมามีผล','Stored items cannot be stolen or used and have no positive or negative effects. Withdraw to restore their effects.')}</p>
    </section>
    <section className="vault-goods">{shelf(false)}{shelf(true)}<ComicButton className="vault-expand" disabled={disabled||p.credits<vault.nextSlotPrice} title={disabled?locked:p.credits<vault.nextSlotPrice?pick('เครดิตในกระเป๋าไม่พอ','Not enough wallet credits'):undefined} onClick={()=>submit({type:'vault-expand'})}><PlusIcon/>{pick('เพิ่ม 1 ช่อง · ','Add 1 slot · ')}{credits(vault.nextSlotPrice)}</ComicButton></section>
  </div>;
}

type LoanView=NonNullable<AppraisalView['loans']>[number];
function LoanContract({loan,game,submit,disabled,playerNames={}}:Props & {loan:LoanView}) {
  const [repayment,setRepayment]=useState(''),[counter,setCounter]=useState('');
  const [terms,setTerms]=useState(loan.terms);
  const borrower=loan.borrowerId===game.self.id;
  const remaining=loan.principal-loan.repaid;
  const payment=Number(repayment||remaining),counterValue=Number(counter||loan.principal);
  const pending=loan.status==='proposed' || loan.status==='countered';
  const responds=loan.status==='proposed'?!borrower:borrower;
  const status=loan.status==='active'?pick('กำลังผ่อน','Active'):loan.status==='repaid'?pick('คืนครบแล้ว','Repaid'):loan.status==='foreclosed'?pick('ยึดหลักประกันแล้ว','Collateral forfeited'):loan.status==='cancelled'?pick('ยกเลิกแล้ว','Cancelled'):loan.status==='countered'?pick('รอผู้กู้ยืนยันยอดใหม่','Awaiting borrower confirmation'):pick('รอผู้ให้กู้ยืนยัน','Awaiting lender confirmation');
  return <details className="secure-contract" open={pending}>
    <summary><span>{itemLabel(loan.item)} · {credits(remaining)}</span><small>{status}</small></summary>
    <div className="secure-contract-body"><ItemVisual className="secure-collateral-art" item={loan.item} alt={itemLabel(loan.item)} width={96} height={96}/>
      <p>{borrower?pick('ผู้ให้กู้: ','Lender: '):pick('ผู้กู้: ','Borrower: ')}{playerNames[borrower?loan.lenderId:loan.borrowerId]??(borrower?loan.lenderId:loan.borrowerId)}</p>
      <p>{pick(`กู้ ${loan.principal} · คืนแล้ว ${loan.repaid} · เหลือ ${remaining} เครดิต`,`Principal ${loan.principal} · Repaid ${loan.repaid} · Remaining ${remaining} credits`)}</p>
      <p>{pick(`ราคาหลักประกันที่ล็อกไว้ ${loan.collateralValue} เครดิต · ครบกำหนดท้ายช่วง ${loan.dueAt}`,`Frozen collateral value ${loan.collateralValue} credits · Due at the end of encounter ${loan.dueAt}`)}</p>
      <p className="supporting">{pick('หลักประกันพักกับระบบ ใช้หรือรับผลไม่ได้ คืนครบจึงได้ของคืน หากหมดกำหนดแล้วยังคืนไม่ครบ ของเป็นของผู้ให้กู้','Collateral stays in escrow with no use or effects. Repay in full to reclaim it. Unpaid collateral transfers to the lender at the deadline.')}</p>
      <p className="supporting">{pick('ถ้าเกมจบก่อนคืนครบ แม้ยังไม่ถึงกำหนด ของค้ำตกเป็นของผู้ให้กู้ทันที','If the match ends before the loan is repaid, even before the deadline, the collateral goes to the lender.')}</p>
      {loan.terms && <blockquote>{loan.terms}</blockquote>}
      <p className="supporting">{pick('ข้อความข้อตกลงเป็นบันทึกของทั้งสองฝ่าย ระบบไม่บังคับเงื่อนไขเพิ่มเติม','Written terms are a shared record; extra conditions are not enforced by the game.')}</p>
      {pending && <><p>{responds?pick('ถึงตาคุณยืนยันข้อเสนอ','Your confirmation is needed'):pick('รออีกฝ่ายยืนยันข้อเสนอ','Waiting for the other party to confirm')}</p>
        <div className="actions">{responds && <><button className="primary" disabled={disabled || (!borrower && game.self.credits<loan.principal)} onClick={()=>submit({type:'loan-respond',loanId:loan.id,accept:true})}>{pick('ยืนยันสัญญา','Accept loan')}</button><button disabled={disabled} onClick={()=>submit({type:'loan-respond',loanId:loan.id,accept:false})}>{pick('ปฏิเสธ','Decline')}</button></>}<button disabled={disabled} onClick={()=>submit({type:'loan-cancel',loanId:loan.id})}>{pick('ยกเลิกข้อเสนอ','Cancel offer')}</button></div>
        {!borrower && <details><summary>{pick('เสนอจำนวนเงินใหม่','Counter with another amount')}</summary><Amount label={pick('ยอดเงินกู้ใหม่','New principal')} min={Math.ceil(loan.collateralValue/2)} value={counter||String(loan.principal)} onChange={setCounter} disabled={disabled}/><label>{pick('ข้อตกลงเพิ่มเติม','Additional terms')}<textarea maxLength={500} value={terms} disabled={disabled} onChange={event=>setTerms(event.target.value)}/></label><button disabled={disabled || !positive(counterValue) || counterValue<Math.ceil(loan.collateralValue/2) || counterValue>game.self.credits} onClick={()=>submit({type:'loan-counter',loanId:loan.id,principal:counterValue,terms})}>{pick('ส่งข้อเสนอใหม่ให้ผู้กู้ยืนยัน','Send counteroffer for borrower confirmation')}</button></details>}
      </>}
      {loan.status==='active' && borrower && <><Amount label={pick('จำนวนที่ต้องการผ่อนคืน','Installment amount')} max={remaining} value={repayment||String(remaining)} onChange={setRepayment} disabled={disabled}/><button className="primary" disabled={disabled || !positive(payment) || payment>remaining || payment>game.self.credits || game.encounter>loan.dueAt} onClick={()=>submit({type:'loan-repay',loanId:loan.id,amount:payment})}>{pick('ผ่อนคืน ','Repay ')}{positive(payment)?credits(payment):''}</button></>}
    </div>
  </details>;
}
function LoanProposal({game,submit,disabled,playerNames={}}:Props) {
  const [selected,setSelected]=useState(''),[lenderId,setLenderId]=useState(''),[amount,setAmount]=useState(''),[terms,setTerms]=useState('');
  const eligible=game.self.inventory.filter(item=>item.lockedUntil===null && !item.overpriced && (item.lastTradePrice??0)>0 && !game.loans?.some(loan=>loan.itemId===item.id && ['proposed','countered','active'].includes(loan.status)));
  const item=eligible.find(item=>item.id===selected);
  const lenders=game.players.filter(p=>p.id!==game.self.id && p.paused!=='dead' && p.life!==0);
  const minimum=item?Math.ceil(item.lastTradePrice!/2):0,principal=Number(amount||minimum);
  return <details className="info-fold"><summary>{pick('กู้เงินโดยใช้ของค้ำประกัน','Borrow against an item')}</summary>
    <p className="supporting">{pick('เลือกของ แล้วเลือกผู้ให้กู้ เงินมาจากผู้ให้กู้จริง ทั้งสองฝ่ายต้องยืนยันก่อนส่งของค้ำ','Choose collateral and a lender. Existing lender credits fund the loan after both parties confirm.')}</p>
    <p className="supporting">{pick('ถ้าเกมจบก่อนคืนครบ ของค้ำตกเป็นของผู้ให้กู้ทันที','If the match ends before you repay in full, the collateral goes to the lender.')}</p>
    {!eligible.length?<p>{pick('ต้องมีของที่ไม่ถูกล็อก ไม่ติดตราราคาเกินจริง และมีประวัติราคาซื้อขาย','You need an unlocked item with a recorded sale price and no overpricing mark.')}</p>:<div className="secure-items" role="group" aria-label={pick('เลือกหลักประกัน','Choose collateral')}>{eligible.map(candidate=><button className="secure-item" key={candidate.id} aria-pressed={selected===candidate.id} disabled={disabled} onClick={()=>{setSelected(candidate.id);setAmount('');}}><ItemArt item={candidate}/><small>{credits(candidate.lastTradePrice!)}</small></button>)}</div>}
    {item && <><p>{pick(`ราคาซื้อขายล่าสุด ${item.lastTradePrice} · กู้ขั้นต่ำ ${minimum} เครดิต`,`Last sale ${item.lastTradePrice} · Minimum loan ${minimum} credits`)}</p><fieldset disabled={disabled}><legend>{pick('เลือกผู้ให้กู้','Choose a lender')}</legend><div className="actions">{lenders.map(lender=><button key={lender.id} aria-pressed={lenderId===lender.id} onClick={()=>setLenderId(lender.id)}>{playerNames[lender.id]??lender.id}</button>)}</div></fieldset>
      <Amount label={pick('ยอดเงินที่ขอกู้','Requested principal')} min={minimum} value={amount||String(minimum)} onChange={setAmount} disabled={disabled}/>
      <label>{pick('ข้อตกลงที่ต้องการบันทึก','Agreed terms to record')}<textarea maxLength={500} value={terms} disabled={disabled} onChange={event=>setTerms(event.target.value)}/></label>
      <button className="primary" disabled={disabled || !lenders.some(lender=>lender.id===lenderId) || !positive(principal) || principal<minimum} onClick={()=>submit({type:'loan-propose',itemId:item.id,lenderId,principal,terms})}>{pick('ส่งคำขอกู้','Send loan request')}</button>
    </>}
  </details>;
}

export function InventoryIntegrityActions({game,submit,disabled}:Actions) {
  const [selected,setSelected]=useState(''),[value,setValue]=useState('');
  if(!game.secureEconomy || !['APPRAISAL','TRADE'].includes(game.phase) || !alive(game))return null;
  const item=game.self.inventory.find(item=>item.id===selected),price=Number(value);
  const locked=disabled || game.self.done || !!game.self.paused;
  return <details className="info-fold"><summary>{pick('ประเมินใหม่หรือขายของเพื่อรับเงินสด','Reappraise or sell carried goods')}</summary>
    <div className="secure-items" role="group" aria-label={pick('เลือกของในมือ','Choose a carried item')}>{game.self.inventory.map(candidate=><button className="secure-item" key={candidate.id} aria-pressed={selected===candidate.id} disabled={locked} onClick={()=>{setSelected(candidate.id);setValue('');}}><ItemArt item={candidate}/>{candidate.overpriced && <small className="danger-text">{pick('ราคาเกินจริง','Overpriced')}</small>}</button>)}</div>
    {item && <div className="secure-integrity-detail"><h3>{itemLabel(item)}</h3>
      {item.overpriced && <p className="danger-text">{pick('ติดตราราคาเกินจริง: ระบบรับซื้อ 0 เครดิต และใช้ค้ำประกันไม่ได้ ประเมินใหม่สำเร็จเพื่อล้างตรา','Overpriced: system sale value is 0 and this item cannot secure a loan. Reappraise successfully to clear the mark.')}</p>}
      <p>{item.lastTradePrice===undefined?pick('ยังไม่มีราคาซื้อขายล่าสุด','No recorded sale price'):pick(`ราคาซื้อขายล่าสุด ${item.lastTradePrice} เครดิต`,`Last sale price ${item.lastTradePrice} credits`)}</p>
      <Amount label={pick('ราคาที่ประเมินใหม่','New appraised price')} min={0} max={1000} value={value} onChange={setValue} disabled={locked || item.lockedUntil!==null}/>
      <button disabled={locked || item.lockedUntil!==null || game.self.energy<1 || !!item.reappraisalUsed || value==='' || !Number.isSafeInteger(price) || price<0 || price>1000} onClick={()=>submit({type:'reappraise-owned',itemId:item.id,value:price})}>{pick('ประเมินใหม่ · 1 พลัง','Reappraise · 1 energy')}</button>
      <p className="supporting">{item.reappraisalUsed?pick('ประเมินใหม่ชิ้นนี้แล้ว รอช่วงถัดไป','Already reappraised this encounter. Try again next encounter.'):pick('ลองได้หนึ่งครั้งต่อชิ้นต่อช่วง การประเมินไม่เปลี่ยนมูลค่าพื้นฐาน','One attempt per item per encounter. Reappraisal does not change its base value.')}</p>
      {item.liquidationPrice===undefined?<p className="supporting">{pick('ยังไม่รู้ราคารับซื้อแน่นอน ตรวจมูลค่าก่อน หรือยอมขายตามราคากลาง', 'Exact liquidation value is unknown. Inspect first or sell at the system valuation.')}{item.lastTradePrice!==undefined && <> {pick(`รับไม่เกิน ${item.lastTradePrice} เครดิต`,`At most ${item.lastTradePrice} credits`)}</>}</p>:<p>{pick('ราคารับซื้อของระบบ ','System liquidation value ')}{credits(item.liquidationPrice)}</p>}
      <button disabled={locked || item.lockedUntil!==null || !!item.stolen} onClick={()=>submit({type:'liquidate',itemId:item.id})}>{pick('ขายให้ระบบ · ','Sell to system · ')}{item.liquidationPrice===undefined?pick('รับราคากลางที่ยังไม่ทราบ','Unknown system valuation'):credits(item.liquidationPrice)}</button>
      {item.lockedUntil!==null && <p className="why">{pick(`สินค้าถูกล็อกถึงจบช่วง ${item.lockedUntil}`,`Item is locked through encounter ${item.lockedUntil}`)}</p>}
    </div>}
    {!game.self.inventory.length && <p className="supporting">{pick('ยังไม่มีของที่ถืออยู่','No carried items')}</p>}
  </details>;
}

export function FinancePanel(props:Props) {
  const {game,submit,disabled}=props;
  if(!game.secureEconomy || !alive(game) || !(game.phase==='PORTALS' || ['APPRAISAL','TRADE'].includes(game.phase) || paid(game)))return null;
  const loanWindow=['APPRAISAL','TRADE'].includes(game.phase) || paid(game),crime=game.theft?.crime;
  return <details className="secure-economy finance-table"><summary>{pick('โต๊ะการเงินและใบประกาศ','Finance and criminal notices')}</summary>
    {crime && <section aria-label={pick('ใบประกาศอาชญากร','Criminal notice')}><h3>{pick('ล้างประวัติอาชญากร','Clear your criminal record')}</h3>
      <p>{pick(`ประวัติขโมยพลาด ${crime.failures} ครั้ง`,`Recorded failed thefts: ${crime.failures}`)}</p>
      <p>{pick(`จ่ายครั้งเดียวล้างทุกคดี (${crime.cases} คดี) ราคา 2 เท่าของราคาหน้าร้านรวม ซื้อแล้วยกเลิกโทษห้ามค้าทันที ไม่ต้องรอ Dark Market เปิด แต่ไม่คืนความเชื่อใจที่เสียไป`,`One payment clears all ${crime.cases} cases at twice the summed storefront asks and lifts the trade ban immediately, even when the Dark Market is closed. Lost trust is not refunded.`)}</p><button disabled={disabled || game.self.credits<crime.noticePrice} onClick={()=>submit({type:'crime-clear'})}>{pick('ซื้อใบประกาศอาชญากร · ','Buy criminal notice · ')}{credits(crime.noticePrice)}</button>{game.self.credits<crime.noticePrice && <p className="why">{pick('เครดิตไม่พอ ขายของหรือเจรจากู้เงินก่อน','Insufficient credits. Sell goods or negotiate a loan first.')}</p>}
    </section>}
    {loanWindow && <><h3>{pick('สัญญากู้ระหว่างผู้เล่น','Player loan contracts')}</h3>
      <p className="supporting">{pick('นับกำหนดจากเงินฐานท้ายช่วง 10/15 จนสะสมถึงราคาหลักประกันที่ล็อกไว้ ไม่รวมโบนัสหรือเงินเสี่ยงเหรียญ','The deadline uses alternating base payouts of 10/15 until their sum reaches the frozen collateral value. Bonuses and coin wagers do not change it.')}</p>
      {(game.loans??[]).map(loan=><LoanContract key={loan.id} {...props} loan={loan}/>)}
      <LoanProposal {...props}/><InventoryIntegrityActions game={game} submit={submit} disabled={disabled}/>
    </>}
    {!crime && !loanWindow && <p className="supporting">{pick('สัญญากู้เปิดเมื่อเริ่มพบพ่อค้า','Loan negotiations open when the encounter begins.')}</p>}
  </details>;
}
