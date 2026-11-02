import { ALL_STATUS_CATALOG, ITEM_SPECS } from './content.js';
import type { AppraisalAction, AppraisalState, JournalEntry } from './types.js';

const titles:Record<string,string>={
  'collector-wish-request':'ส่งรายการ Collector','collector-wish-peek':'เปิดดูสินค้า Collector','collector-wish-buy':'ซื้อจาก Collector','collector-wish-skip':'ข้าม Collector',
  enter:'เลือกพบพ่อค้า', 'reroll-portal':'เปลี่ยนพ่อค้า', inspect:'ตรวจสินค้า', appraise:'ตีราคา', counter:'ต่อราคา', buy:'ซื้อสินค้า', activate:'เปิดใช้สินค้า',
  event:'เลือกทางในเหตุการณ์', done:'จบช่วง', 'recover-resource':'ฟื้นทรัพยากร', steal:'ขโมยสินค้า', pickpocket:'ล้วงกระเป๋า', barter:'แลกสินค้า',
  'merchant-ability':'ใช้ความสามารถพ่อค้า', skill:'ใช้ทักษะพ่อค้า', 'wish-new':'ขอรายการตามหา', 'wish-sell':'ขายของตามหา',
  'round-flip':'เสี่ยงเหรียญ', 'round-raise':'เพิ่มเดิมพัน', 'round-bank':'รับรางวัลช่วง', 'bid':'เสนอราคาประมูล',
  'reappraise-owned':'ประเมินของในกระเป๋าใหม่', liquidate:'ขายของให้ระบบ', 'theft-start':'เริ่มขโมย', 'theft-hand':'เลือกมือดวล',
  'loan-propose':'เสนอสัญญากู้', 'loan-respond':'ตอบสัญญากู้', 'loan-repay':'ชำระหนี้', 'seal-offer':'เสนอตราคนบาป',
  'ghost-start':'เริ่มติดตามการ์ด', 'ghost-guess':'ทายตำแหน่งการ์ด', 'ghost-hire':'เสนองานวิญญาณ', 'ghost-accept':'ตอบงานวิญญาณ', 'ghost-rps':'เปลี่ยนสินค้าวิญญาณ', 'ghost-deliver':'ส่งมอบสินค้าวิญญาณ',
  'crime-clear':'ล้างใบประกาศ', advance:'เริ่มช่วงใหม่',
};
function addedNotes(before:string[],after:string[]):string[] {
  for(let overlap=Math.min(before.length,after.length);overlap>=0;overlap--) {
    if(before.slice(-overlap).every((note,index)=>note===after[index]))return after.slice(overlap);
  }
  return after;
}
function delta(label:string,before:number,after:number):string|null {
  const amount=after-before;return amount?`${label} ${amount>0?'+':''}${amount}`:null;
}
/** Record one player-safe event per accepted action or automatic phase change, including effects on other seats. */
export function recordJournal(previous:AppraisalState,state:AppraisalState,action:AppraisalAction|{type:'advance'}):void {
  for(const current of state.players) {
    const prior=previous.players.find(player=>player.id===current.id)!;
    const changes=[delta('เครดิต',prior.credits,current.credits),delta('พลัง',prior.energy,current.energy),
      prior.life!==undefined&&current.life!==undefined?delta('ชีวิต',prior.life,current.life):null,
      delta('คะแนน',prior.score,current.score),delta('คะแนนวิญญาณ',previous.ghosts?.[current.id]?.bonus??0,state.ghosts?.[current.id]?.bonus??0)]
      .filter((change):change is string=>change!==null);
    const itemNameOf=(id:string)=>ITEM_SPECS[state.items[id]!.kind].name;
    changes.push(...current.inventory.filter(id=>!prior.inventory.includes(id)).map(id=>`ได้รับ ${itemNameOf(id)}`),
      ...prior.inventory.filter(id=>!current.inventory.includes(id)).map(id=>`เสีย ${itemNameOf(id)}`));
    const gained=current.statuses.filter(status=>!prior.statuses.some(old=>old.id===status.id));
    const lost=prior.statuses.filter(status=>!current.statuses.some(now=>now.id===status.id));
    const statusName=(id:string)=>ALL_STATUS_CATALOG.find(status=>status.id===id)?.name??id;
    changes.push(...gained.map(status=>`ได้สถานะ ${statusName(status.id)}`),...lost.map(status=>`สิ้นสุดสถานะ ${statusName(status.id)}`));
    const notes=addedNotes(prior.notes,current.notes);
    const actor='playerId' in action && action.playerId===current.id;
    if(!actor && !changes.length && !notes.length)continue;
    const itemId='itemId' in action && typeof action.itemId==='string'?action.itemId:undefined;
    const kind=itemId?state.items[itemId]?.kind:undefined;
    const itemName=kind?ITEM_SPECS[kind].name:'';
    const choice='choice' in action && typeof action.choice==='string'?`เลือก ${action.choice}`:'';
    const reason=notes.join(' · ') || choice || (action.type==='advance'?'ผลเมื่อเริ่มช่วงใหม่':`เกิดจาก${titles[action.type]??action.type}`);
    const entry:JournalEntry={id:state.revision,encounter:previous.encounter,phase:previous.phase,
      action:`${titles[action.type]??action.type}${itemName?` · ${itemName}`:''}`,cause:reason,changes,...(choice?{choice}:{}) ,...(kind?{itemKind:kind}:{})};
    (current.journal??=[]).push(entry);
  }
}
