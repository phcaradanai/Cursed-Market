import { ItemVisual } from './ItemVisual.js';
import {useEffect,useId,useState} from 'react';
import type {Actions} from './components.js';
import type {AppraisalView,ItemView} from '../game/appraisal/types.js';
import type {RpsHand} from '../game/appraisal/theft.js';
import {itemLabel,npcName} from './catalog-text.js';
import {pick} from './i18n.js';

type Props=Actions & {playerNames?:Record<string,string>};
/** Seconds left on a server clock, corrected for the gap between this device and the server. */
function DuelClock({deadline,serverTime}:{deadline:number;serverTime:number}) {
  // serverTime was stamped when the state left the server, so it doubles as the clock offset.
  const left=(offset:number)=>Math.max(0,Math.ceil((deadline-Date.now()-offset)/1000));
  const [remaining,setRemaining]=useState(()=>left(serverTime-Date.now()));
  useEffect(()=>{
    const offset=serverTime-Date.now();
    const update=()=>setRemaining(left(offset));
    update();const timer=setInterval(update,250);return()=>clearInterval(timer);
  },[deadline,serverTime]);
  return <p className="why" role="timer">{pick(`ส่งมือภายใน ${remaining} วินาที ไม่เช่นนั้นการดวลถูกยกเลิก`,`Play a hand within ${remaining}s or the duel is cancelled`)}</p>;
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

export function TheftPanel({game,submit,disabled,playerNames={},deadlines={},serverTime=Date.now()}:Props & {deadlines?:Record<string,number>|undefined;serverTime?:number}) {
  if(!game.secureEconomy || !game.theft || !['APPRAISAL','TRADE'].includes(game.phase) || !alive(game))return null;
  const theft=game.theft,p=game.self,name=(id:string)=>playerNames[id]??id;
  const open=theft.duels.some(duel=>duel.status==='open');
  const spent=!!p.stealTried?.length;
  const attackingBlocked=disabled || !!p.paused || p.done || !!p.eventOffer || spent || open || p.energy<1;
  const crime=theft.crime;
  return <section className="secure-economy theft-table" aria-label={pick('เป่ายิ้งฉุบขโมยของ','Theft duel')}>
    <h2>{pick('เดิมพันด้วยมือเดียว','One hand, one heist')}</h2>
    <p className="supporting">{pick('ขโมยได้ครั้งเดียวต่อช่วง · ใช้ 1 พลัง · เสมอเลือกมือใหม่โดยไม่เสียพลังเพิ่ม','One theft per encounter · 1 energy · Draws cost no extra energy')}</p>
    {crime && <p className={crime.active?'danger-text':'supporting'}>{crime.active?pick(`ถูกห้ามค้ากับพ่อค้าทั้งหมดถึงจบช่วง ${crime.banUntilEncounter}`,`All merchant trade is banned through encounter ${crime.banUntilEncounter}`):game.encounter<crime.banStartsEncounter?pick(`โทษห้ามค้าช่วง ${crime.banStartsEncounter}–${crime.banUntilEncounter}`,`Merchant ban: encounters ${crime.banStartsEncounter}–${crime.banUntilEncounter}`):pick('ยังมีประวัติคดี ซื้อใบประกาศที่โต๊ะการเงินเพื่อล้างประวัติ','A criminal record remains. Clear it at the finance desk.')}</p>}
    {theft.duels.map(duel=>{
      const ownTheft=duel.thiefId===p.id;
      const opponent=ownTheft?(duel.victimId?name(duel.victimId):duel.npc?npcName(duel.npc):pick('พ่อค้า','Merchant')):name(duel.thiefId);
      const result=duel.status==='cancelled'?pick('ยกเลิก: เป้าหมายไม่พร้อมแล้ว','Cancelled: target is no longer available'):duel.status==='open'?pick('กำลังดวล','Duel in progress'):(duel.status==='won')===ownTheft?pick(ownTheft?'ขโมยสำเร็จ':'ป้องกันสำเร็จ',ownTheft?'Theft succeeded':'Defense succeeded'):pick(ownTheft?'ขโมยไม่สำเร็จ':'ถูกขโมยของหนึ่งชิ้น',ownTheft?'Theft failed':'One carried item was stolen');
      return <article className="secure-duel" key={duel.id} aria-label={pick(`ดวลกับ ${opponent}`,`Duel with ${opponent}`)}>
        <h3>{ownTheft?pick('ฉกของจาก ','Steal from '):pick('ป้องกันของจาก ','Defend against ')}{opponent}</h3>
        <p role="status">{result} · {pick(`ตาที่ ${duel.round}`,`Round ${duel.round}`)}</p>
        {duel.npcTell && <p className="supporting">{pick(duel.npcTell.text,`Merchant tell: favors ${handName(duel.npcTell.preferredHand).toLowerCase()}.`)}</p>}
        {duel.tieGoesTo && <p className={duel.tieGoesTo==='you'?'positive-text':'danger-text'}>{duel.tieGoesTo==='you'?pick('ถ้าออกมือเสมอ ตานั้นนับเป็นของคุณ','A tied round goes to you'):pick('ถ้าออกมือเสมอ ตานั้นนับเป็นของอีกฝ่าย','A tied round goes to your opponent')}</p>}
        {duel.status==='open' && <>
          <p className="supporting">{duel.submitted?pick('ส่งมือแล้ว ล็อกคำตอบไว้ รออีกฝ่าย','Hand sealed. Waiting for your opponent.'):pick('เลือกมือของคุณ ทั้งสองฝ่ายจะเปิดพร้อมกัน','Choose your hand. Both hands are revealed together.')}</p>
          {deadlines[duel.id]!==undefined && <DuelClock deadline={deadlines[duel.id]!} serverTime={serverTime}/>}
          {duel.needsChoice && <div className="secure-hands" role="group" aria-label={pick('เลือกมือเป่ายิ้งฉุบ','Choose a hand')}>{hands.map(hand=><button key={hand} disabled={disabled} onClick={()=>submit({type:'theft-hand',duelId:duel.id,hand})}>{handName(hand)}</button>)}</div>}
        </>}
        {duel.revealed.length>0 && <ol className="secure-duel-rounds">{duel.revealed.map((round,index)=><li key={index}>{pick(`ตา ${index+1}: คุณออก `,`Round ${index+1}: you played `)}{handName(ownTheft?round.thief:round.opponent)} · {opponent} {handName(ownTheft?round.opponent:round.thief)}{round.thief===round.opponent?pick(' · เสมอ',' · Draw'):''}</li>)}</ol>}
      </article>;
    })}
    {!open && <details className="info-fold"><summary>{spent?pick('ใช้โอกาสขโมยช่วงนี้แล้ว','Theft attempt spent'):pick('เลือกเป้าหมายขโมย','Choose a theft target')}</summary>
      {p.stock.length>0 && <><h3>{pick('สินค้าหน้าร้าน','Merchant goods')}</h3><p className="supporting">{pick('แพ้: ความเชื่อใจพ่อค้าคนนี้ −2 และเพิ่มโทษห้ามค้าหนึ่งช่วง','Lose: −2 trust with this merchant and one more encounter of merchant trade ban')}</p><div className="secure-items">{p.stock.map(item=><button className="secure-item" key={item.id} disabled={attackingBlocked} onClick={()=>submit({type:'theft-start',itemId:item.id})}><ItemArt item={item}/><small>{pick('ขโมยชิ้นนี้','Steal this item')}</small></button>)}</div></>}
      <h3>{pick('ของที่ผู้เล่นถืออยู่','Carried player goods')}</h3><p className="supporting">{pick('ของเป้าหมายยังคว่ำอยู่ คุณจะไม่เห็นว่าเป็นชิ้นไหนก่อนชนะ','The target item stays concealed until you win.')}</p><p className="supporting">{pick('แพ้: เหยื่อได้ตราคนบาปของคุณ 1 ใบ ขโมยคนเดิมไม่ได้อีก 2 ช่วง และต้องจ่ายชดเชย 5% ของราคาซื้อขายล่าสุดของชิ้นนั้น 4 ช่วงถัดไป','Lose: the victim gets one of your sinner seals, you cannot target them for 2 more encounters, and you pay 5% of that good\'s last trade price at the start of each of the next 4 encounters.')}</p>
      <div className="actions">{theft.targets.map(target=>{const blocked=target.blockedUntilEncounter!==undefined;return <button key={target.playerId} disabled={attackingBlocked || blocked} onClick={()=>submit({type:'theft-start',victimId:target.playerId})}>{pick('ขโมยจาก ','Steal from ')}{name(target.playerId)}{blocked && <small>{pick(` · ห้ามจนจบช่วง ${target.blockedUntilEncounter}`,` · blocked through encounter ${target.blockedUntilEncounter}`)}</small>}</button>})}</div>
      {!theft.targets.length && <p className="supporting">{pick('ยังไม่มีผู้เล่นที่พร้อมเป็นเป้าหมาย','No player targets are available.')}</p>}
      {p.energy<1 && <p className="why">{pick('ต้องมีอย่างน้อย 1 พลัง','Requires at least 1 energy')}</p>}
    </details>}
  </section>;
}

export function VaultPanel({game,submit,disabled}:Props) {
  const [amount,setAmount]=useState('10');
  if(!game.secureEconomy || !paid(game) || !alive(game))return null;
  const p=game.self,vault=p.personalVault??{items:[],credits:0,slots:2,nextSlotPrice:10,nextInterest:0};
  const value=Number(amount),valid=positive(value);
  return <section className="secure-economy vault-table" aria-label={pick('คลังนิรภัย','Personal vault')}>
    <h2>{pick('เก็บไว้ข้ามคืน','Keep it safe')}</h2>
    <p>{pick(`คลังนิรภัย ${vault.items.length}/${vault.slots} ช่อง · เริ่มต้นฟรี 2 ช่อง`,`Personal vault ${vault.items.length}/${vault.slots} slots · First 2 slots are free`)}</p>
    <p className="supporting">{pick('ของในคลังขโมยไม่ได้ ใช้ไม่ได้ และไม่มีผลบวกหรือลบกับผู้ถือครอง ถอนแล้วจึงกลับมามีผล','Stored items cannot be stolen or used and have no positive or negative effects. Withdraw to restore their effects.')}</p>
    <div className="secure-vault-sides"><div><h3>{pick('ถืออยู่ · เลือกเพื่อฝาก','Carried · choose to deposit')}</h3><div className="secure-items">{p.inventory.map(item=><button className="secure-item" key={item.id} disabled={disabled || item.lockedUntil!==null || vault.items.length>=vault.slots} onClick={()=>submit({type:'vault-deposit-item',itemId:item.id})}><ItemArt item={item}/><small>{item.lockedUntil!==null?pick('ถูกล็อก','Locked'):pick('ฝากเข้าคลัง','Deposit')}</small></button>)}</div>{!p.inventory.length && <p className="supporting">{pick('ไม่มีของที่ถืออยู่','No carried items')}</p>}</div>
      <div><h3>{pick('ปลอดภัยในคลัง · เลือกเพื่อถอน','In the vault · choose to withdraw')}</h3><div className="secure-items">{vault.items.map(item=><button className="secure-item" key={item.id} disabled={disabled} onClick={()=>submit({type:'vault-withdraw-item',itemId:item.id})}><ItemArt item={item}/><small>{pick('ถอนออกมาถือ','Withdraw')}</small></button>)}</div>{!vault.items.length && <p className="supporting">{pick('คลังยังว่าง','Vault is empty')}</p>}</div></div>
    <button disabled={disabled || p.credits<vault.nextSlotPrice} onClick={()=>submit({type:'vault-expand'})}>{pick('เพิ่ม 1 ช่อง · ','Add 1 slot · ')}{credits(vault.nextSlotPrice)}</button>
    <details className="info-fold"><summary>{pick(`ฝากเงิน · ในคลัง ${vault.credits} เครดิต`,`Store credits · ${vault.credits} credits in vault`)}</summary>
      <p>{pick(`ในกระเป๋า ${p.credits} เครดิต`,`Wallet: ${p.credits} credits`)}</p><Amount label={pick('จำนวนเครดิต','Credit amount')} value={amount} onChange={setAmount} disabled={disabled}/>
      <div className="actions"><button disabled={disabled || !valid || value>p.credits} onClick={()=>submit({type:'vault-deposit-credits',amount:value})}>{pick('ฝากเงิน','Deposit credits')}</button><button disabled={disabled || !valid || value>vault.credits} onClick={()=>submit({type:'vault-withdraw-credits',amount:value})}>{pick('ถอนเงิน','Withdraw credits')}</button></div>
      <p className="supporting">{pick(`ดอกเบี้ย 4% ต่อช่วง ไม่มีเพดาน จ่ายเข้ากระเป๋าตอนเริ่มช่วงถัดไป ตอนนี้จะได้ ${vault.nextInterest} เครดิต ไม่ทบต้นเอง`,`Interest is 4% of the whole vault balance per encounter, uncapped, paid to your wallet when the next encounter starts. Next payment: ${vault.nextInterest} credits. It does not compound by itself.`)}</p>
    </details>
  </section>;
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
