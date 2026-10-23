import {useId,useState} from 'react';
import type {Actions} from './components.js';
import {itemLabel} from './catalog-text.js';
import {pick} from './i18n.js';

type Props=Actions & {playerNames?:Record<string,string>};
const alive=(props:Props)=>props.game.self.paused!=='dead' && props.game.self.life!==0;
const whole=(value:string)=>value===''?0:Number(value);
const valid=(value:string)=>Number.isSafeInteger(whole(value)) && whole(value)>=0;

function Field({label,value,onChange,disabled}:{label:string;value:string;onChange:(value:string)=>void;disabled:boolean}) {
  const id=useId();
  return <label className="secure-amount" htmlFor={id}><span>{label}</span><input id={id} type="number" inputMode="numeric" min={0} step="1" value={value} onChange={event=>onChange(event.target.value)} disabled={disabled}/></label>;
}

function SellSeal({sealId,thiefName,game,submit,disabled,playerNames={}}:Props & {sealId:string;thiefName:string}) {
  const [buyer,setBuyer]=useState(''),[creditsText,setCredits]=useState('0'),[energy,setEnergy]=useState('0'),[life,setLife]=useState('0'),[goods,setGoods]=useState('0'),[terms,setTerms]=useState('');
  const others=game.players.filter(other=>other.id!==game.self.id && other.paused!=='dead' && other.life!==0);
  const ready=!!buyer && [creditsText,energy,life,goods].every(valid) && whole(creditsText)+whole(energy)+whole(life)+whole(goods)+terms.trim().length>0;
  return <details className="info-fold"><summary>{pick(`ขายตราของ ${thiefName}`,`Sell a seal of ${thiefName}`)}</summary>
    <p className="supporting">{pick('เลือกผู้ซื้อ แล้วระบุสิ่งที่ขอ ผู้ซื้อต้องกดตกลง ระบบย้ายของทั้งหมดพร้อมกัน ข้อความข้อตกลงเป็นเพียงบันทึก','Choose a buyer and what you ask for. The buyer must accept, and everything moves together. Written terms are only a note.')}</p>
    <div className="actions" role="group" aria-label={pick('ผู้ซื้อ','Buyer')}>{others.map(other=><button key={other.id} aria-pressed={buyer===other.id} disabled={disabled} onClick={()=>setBuyer(other.id)}>{playerNames[other.id]??other.id}</button>)}</div>
    <Field label={pick('เครดิต','Credits')} value={creditsText} onChange={setCredits} disabled={disabled}/>
    <Field label={pick('พลัง','Energy')} value={energy} onChange={setEnergy} disabled={disabled}/>
    {game.survival && <Field label={pick('ชีวิต','Life')} value={life} onChange={setLife} disabled={disabled}/>}
    <Field label={pick('จำนวนสินค้าที่ขอ (ผู้ซื้อเลือกเอง)','Goods requested (buyer chooses)')} value={goods} onChange={setGoods} disabled={disabled}/>
    <label className="secure-terms"><span>{pick('ข้อตกลงเพิ่มเติม (ข้อความเท่านั้น)','Extra terms (text only)')}</span><textarea maxLength={500} value={terms} onChange={event=>setTerms(event.target.value)} disabled={disabled}/></label>
    <button className="primary" disabled={disabled || !ready} onClick={()=>submit({type:'seal-offer',sealId,buyerId:buyer,credits:whole(creditsText),energy:whole(energy),life:game.survival?whole(life):0,goods:whole(goods),...(terms.trim()?{terms:terms.trim()}:{})})}>{pick('เสนอขายตรา','Offer this seal')}</button>
  </details>;
}

function IncomingOffer({offer,game,submit,disabled,playerNames={}}:Props & {offer:NonNullable<Props['game']['sealMarket']>['offers'][number]}) {
  const [chosen,setChosen]=useState<string[]>([]);
  const mine=offer.buyerId===game.self.id;
  const name=(id:string)=>playerNames[id]??id;
  const enough=chosen.length===offer.goods;
  const cost=pick(`${offer.credits} เครดิต · ${offer.energy} พลัง${game.survival?` · ${offer.life} ชีวิต`:''} · ${offer.goods} ชิ้น`,`${offer.credits} credits · ${offer.energy} energy${game.survival?` · ${offer.life} life`:''} · ${offer.goods} goods`);
  return <article className="secure-contract" aria-label={pick('ข้อเสนอซื้อตรา','Seal offer')}>
    <p>{mine?pick(`${name(offer.holderId)} เสนอขายตราของ ${name(offer.thiefId)}`,`${name(offer.holderId)} offers a seal of ${name(offer.thiefId)}`):pick(`คุณเสนอขายตราของ ${name(offer.thiefId)} ให้ ${name(offer.buyerId)}`,`You offered a seal of ${name(offer.thiefId)} to ${name(offer.buyerId)}`)}</p>
    <p>{pick('ราคาที่ขอ: ','Asking: ')}{cost}</p>
    {offer.terms && <blockquote>{offer.terms}</blockquote>}
    {mine && offer.goods>0 && <><p className="supporting">{pick('เลือกสินค้าที่ถืออยู่เป็นค่าตอบแทน','Choose carried goods to hand over')}</p>
      <div className="secure-items">{game.self.inventory.map(item=><button className="secure-item" key={item.id} aria-pressed={chosen.includes(item.id)} disabled={disabled || item.lockedUntil!==null} onClick={()=>setChosen(list=>list.includes(item.id)?list.filter(id=>id!==item.id):[...list,item.id])}><span>{itemLabel(item)}</span></button>)}</div></>}
    <div className="actions">{mine
      ?<><button className="primary" disabled={disabled || !enough || game.self.credits<offer.credits || game.self.energy<offer.energy} onClick={()=>submit({type:'seal-respond',offerId:offer.id,accept:true,...(offer.goods?{itemIds:chosen}:{})})}>{pick('ตกลงซื้อ','Accept')}</button><button disabled={disabled} onClick={()=>submit({type:'seal-respond',offerId:offer.id,accept:false})}>{pick('ปฏิเสธ','Decline')}</button></>
      :<button disabled={disabled} onClick={()=>submit({type:'seal-cancel',offerId:offer.id})}>{pick('ยกเลิกข้อเสนอ','Cancel offer')}</button>}</div>
  </article>;
}

export function SealPanel(props:Props) {
  const {game,submit,disabled,playerNames={}}=props;
  const market=game.sealMarket,theft=game.theft;
  if(!game.secureEconomy || !market || !theft || !alive(props))return null;
  if(!market.holdings.length && !market.offers.length && !market.redemption && !theft.compensation.length)return null;
  const name=(id:string)=>playerNames[id]??id;
  return <section className="secure-economy seal-table" aria-label={pick('ตราคนบาป','Sinner seals')}>
    <h2>{pick('ตราคนบาป','Sinner seals')}</h2>
    {market.redemption && <div className="seal-redemption"><h3>{pick(`เลือกของจาก ${name(market.redemption.thiefId)}`,`Take from ${name(market.redemption.thiefId)}`)}</h3>
      <p className="supporting">{pick('ไพ่ทุกใบคว่ำอยู่ เลือกได้ 1 ใบ ใช้ตรา 2 ใบเมื่อได้ของเท่านั้น','Every card is face down. Pick one; both seals are spent only once you receive the good.')}</p>
      <div className="secure-hands" role="group" aria-label={pick('ไพ่คว่ำ','Face-down goods')}>{market.redemption.slots.map(slot=><button key={slot} disabled={disabled} onClick={()=>submit({type:'seal-pick',redemptionId:market.redemption!.id,slot})}>{pick(`ไพ่ใบที่ ${slot+1}`,`Card ${slot+1}`)}</button>)}</div></div>}
    {market.holdings.map(entry=><div key={entry.thiefId}>
      <p>{pick(`ตราของ ${name(entry.thiefId)} × ${entry.count}`,`Seals of ${name(entry.thiefId)} × ${entry.count}`)}</p>
      {entry.count>=2
        ?<><p className="supporting">{pick('ใช้ตรา 2 ใบ: ระบบสุ่มของติดตัวของผู้ขโมย 3 ชิ้นแบบคว่ำ ของในคลังและของค้ำประกันไม่นับ','Spend 2 seals: the server deals up to 3 face-down carried goods. Vault and collateral goods are never included.')}</p>
          <button className="primary" disabled={disabled || !!market.redemption} onClick={()=>submit({type:'seal-redeem',thiefId:entry.thiefId})}>{pick('ใช้ตรา 2 ใบ','Use 2 seals')}</button></>
        :<p className="supporting">{pick('ต้องมีตราของผู้ขโมยคนเดียวกัน 2 ใบจึงใช้สิทธิ์ได้ ซื้อเพิ่มจากผู้เล่นอื่นได้','You need 2 seals of the same thief. You can buy more from other players.')}</p>}
    </div>)}
    {theft.seals.map(seal=><SellSeal key={seal.id} {...props} sealId={seal.id} thiefName={name(seal.thiefId)}/>)}
    {market.offers.map(offer=><IncomingOffer key={offer.id} {...props} offer={offer}/>)}
    {theft.compensation.map(item=><p key={item.id} className={item.role==='payer'?'danger-text':'supporting'}>
      {item.role==='payer'?pick(`ค่าชดเชยให้ ${name(item.otherId)}: ${item.amount} เครดิต ต้นช่วง ${item.remaining.join(', ')||'ครบแล้ว'} · จ่ายแล้ว ${item.paid}`,`Compensation to ${name(item.otherId)}: ${item.amount} credits at the start of encounters ${item.remaining.join(', ')||'none left'} · paid ${item.paid}`)
        :pick(`ค่าชดเชยจาก ${name(item.otherId)}: ${item.amount} เครดิต ต้นช่วง ${item.remaining.join(', ')||'ครบแล้ว'} · ได้แล้ว ${item.paid}`,`Compensation from ${name(item.otherId)}: ${item.amount} credits at the start of encounters ${item.remaining.join(', ')||'none left'} · received ${item.paid}`)}</p>)}
  </section>;
}
