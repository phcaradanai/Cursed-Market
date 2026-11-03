import {personalScorePreview} from './personal-score-preview-data.js';
import {collectorPreview} from './collector-preview-data.js';
import {useMemo,useRef,useState} from 'react';
import {GameTable,SettingsControls,useSound} from './App.js';
import {previewRooms} from './comic-preview-data.js';
import type {AppraisalRoomView} from '../shared/appraisal-protocol.js';
import type {Decision} from './model.js';

const previewScenes=[['score-2','คะแนน · 2 คน'],['score-4','คะแนน · 4 คน'],['score-neg','คะแนน · ลดแต้ม'],['collector-request','ขอของ · Collector'],['collector-waiting','รอของ · Collector'],['collector-delivery','รับของ · Collector'],['collector-peek','เปิดช่อง · Collector'],['collector-closed','ปิดสิทธิ์ · Collector'],['merchants','เลือกพ่อค้า'],['inspection','ประเมินสินค้า'],['event-blood-pact','เหตุการณ์ · สัญญาเลือด'],['trade','ซื้อขาย'],['reveal','รับเครดิต'],['reward-multi','หลายเหรียญ'],['reward-settled','รับเครดิตแล้ว'],['vault-full','คลังเต็ม'],['vault-empty','คลังว่าง'],['theft','ขโมย/RPS'],['ghost','วิญญาณ'],['ghost-busy','งานวิญญาณ'],['ghost-working','ตามหาของ'],['ghost-lost','แพ้ครบช่อง'],['ghost-funds','รอเครดิต'],['results','ผลเกม'],['inventory','กระเป๋า'],['status','สถานะ'],['market','ตลาดมืด'],['market-demo','ตลาดมืด · ตัวอย่างครบ'],['ledger','บันทึก'],['rules','กติกา'],['settings','ตั้งค่า']] as const;
const drawerScenes={'collector-request':'collector','collector-waiting':'collector','collector-delivery':'collector','collector-peek':'collector','collector-closed':'collector',inventory:'bag',status:'effects',market:'market','market-demo':'market',ledger:'ledger',rules:'rules'} as const;

export function ComicPreview(){
  const scene=new URLSearchParams(location.search).get('preview')??'inspection';
  const capture=new URLSearchParams(location.search).has('capture');
  const [message,setMessage]=useState('');
  const time=useRef(Date.now());
  const room=useMemo<AppraisalRoomView>(()=>{
    const base=structuredClone(personalScorePreview[scene]??previewRooms[scene]??previewRooms.inspection!) as AppraisalRoomView;
    if(scene.startsWith('collector-')){base.game=structuredClone(collectorPreview[scene.slice(10)]!);base.yourSeatId='alice';base.matchSeats=[{id:'alice',name:'คุณ'},{id:'bob',name:'ผู้เล่น 2'}];base.seats=base.seats.map((seat,index)=>({...seat,id:index?'bob':'alice'}));}
    if(['ghost','ghost-busy','ghost-working','ghost-lost','ghost-funds'].includes(scene)){const game=base.game!;game.self.life=0;game.self.paused='dead';game.self.eventOffer=null;
     if(scene!=='ghost'){base.matchSeats=base.matchSeats.filter(s=>s.id===game.self.id);game.players=game.players.filter(s=>s.id===game.self.id);game.players.push(...[0,1,2].map(i=>({...game.players[0]!,id:`buyer-${i}`,life:6,paused:null,credits:scene==='ghost-funds'&&i===0?0:200})));base.matchSeats.push(...[0,1,2].map(i=>({id:`buyer-${i}`,name:`ผู้ว่าจ้าง ${i+1}`})));const kinds=[...game.self.inventory,...game.self.stock].slice(0,3).map(i=>i.kind);game.ghosts={services:[],jobs:kinds.map((kind,i)=>({id:`preview-job-${i}`,buyerId:`buyer-${i}`,ghostId:game.self.id,kind,price:20,fee:2,status:scene==='ghost-busy'?'offered':'accepted'})),self:{startedAt:0,cards:kinds,round:1,available:true,swaps:[],tracking:'available',slots:kinds.map(kind=>({kind,lost:scene==='ghost-lost'})),encounter:game.encounter,bonus:0}};}
    }
    if(scene==='theft'){
      const game=base.game!,other=base.matchSeats.find(seat=>seat.id!==game.self.id)!;game.phase='APPRAISAL';game.self.eventOffer=null;game.self.done=false;game.self.paused=null;game.secureEconomy=true;game.theftTimeoutRules=1;
      game.theft={duels:[{id:'preview-duel',thiefId:other.id,victimId:game.self.id,round:1,status:'open',needsChoice:true,submitted:false,revealed:[]}],targets:[],seals:[],compensation:[]};base.duelDeadlines={'preview-duel':time.current+30000};
    }
    if(scene==='event-blood-pact') {
      const game=base.game!;
      game.self.eventOffer={id:'E109',key:'preview-blood-pact',choices:['accept','decline'],itemIds:[],statusIds:[],otherPlayerIds:[],quotedPrices:{},facts:{},targetKinds:{},npcTerms:{credits:0,energy:0,life:2,items:0}};
    }
    if(scene==='market-demo') {
      const game=base.game!,sample=game.market.orders[0]!;
      game.market.open=true;
      game.market.orders=game.self.inventory.slice(0,3).map((item,index)=>({...sample,id:`sample-order-${index}`,kind:item.kind,price:[39,30,24][index]!,quota:{[game.self.id]:1}}));
      game.market.lots=game.self.inventory.slice(3,5).map((item,index)=>({id:`sample-lot-${index}`,itemId:item.id,item:{...item,owner:'dark-market'},minimum:[18,25][index]!,yourBid:index===0?24:null,bidCount:index===0?3:1}));
    }
    if(scene==='ledger') {
      const game=base.game!,item=game.self.inventory[0];game.encounter=3;
      game.self.journal=[
        {id:1,encounter:1,phase:'PORTALS',action:'เลือกพบพ่อค้า',cause:'เลือกประตูของออร์คเพื่อดูสินค้า',changes:[]},
        {id:2,encounter:1,phase:'APPRAISAL',action:'ตรวจสินค้า',cause:'จ่ายพลังเพื่อตรวจมูลค่า',changes:['พลัง -1'],...(item?{itemKind:item.kind}:{})},
        {id:3,encounter:1,phase:'APPRAISAL',action:'ซื้อสินค้า',cause:'รับของจากพ่อค้าในราคาที่ตกลง',changes:['เครดิต -12','ของ +1'],...(item?{itemKind:item.kind}:{})},
        {id:4,encounter:1,phase:'TRADE',action:'จบช่วง',cause:'รับผลเมื่อจบช่วงซื้อขาย',changes:['ชีวิต -1']},
        {id:5,encounter:2,phase:'PORTALS',action:'เริ่มช่วงใหม่',cause:'พักแล้วฟื้นพลังสำหรับช่วงถัดไป',changes:['พลัง +2']},
        {id:6,encounter:2,phase:'APPRAISAL',action:'เลือกทางในเหตุการณ์',cause:'เลือกรับข้อเสนอของพ่อค้า',changes:['เครดิต +8']},
        {id:7,encounter:2,phase:'APPRAISAL',action:'เปิดใช้สินค้า',cause:'ใช้เครื่องรางเพื่อป้องกันผลเสีย',changes:['พลัง -1','ได้สถานะ B03'],...(item?{itemKind:item.kind}:{})},
        {id:8,encounter:2,phase:'TRADE',action:'ขายสินค้า',cause:'ผู้เล่นอีกคนรับข้อเสนอซื้อ',changes:['เครดิต +20','ของ -1'],...(item?{itemKind:item.kind}:{})},
        {id:9,encounter:3,phase:'PORTALS',action:'เริ่มช่วงใหม่',cause:'ผลของสถานะสิ้นสุดเมื่อเริ่มช่วงใหม่',changes:['สิ้นสุดสถานะ B03']},
        {id:10,encounter:3,phase:'APPRAISAL',action:'เลือกพบพ่อค้า',cause:'เลือกประตูของแวมไพร์',changes:[]},
        {id:11,encounter:3,phase:'APPRAISAL',action:'ซื้อสินค้า',cause:'จ่ายให้พ่อค้าและได้รับสินค้าเข้ากระเป๋า',changes:['เครดิต -28','ของ +1'],...(item?{itemKind:item.kind}:{})},
        {id:12,encounter:3,phase:'APPRAISAL',action:'ตรวจสินค้า',cause:'จ่ายพลังเพื่อตรวจความแท้',changes:['พลัง -1'],...(item?{itemKind:item.kind}:{})},
      ];
    }
    if(['reveal','reward-multi','reward-settled','vault-full','vault-empty'].includes(scene)) {
      const game=base.game!;game.phase='REVEAL';game.encounter=3;game.self.eventOffer=null;
      const count=scene==='reward-multi'?5:1;
      game.self.credits=85-(count-1)*10;
      game.self.roundReward={encounter:3,base:10,amount:count*10,flips:0,settled:['reward-settled','vault-full','vault-empty'].includes(scene),coinCount:count,staked:(count-1)*10,net:0};
    }
    if(['reward-settled','vault-full','vault-empty'].includes(scene)) {
      const game=base.game!,items=[...game.self.inventory],full=scene==='vault-full',empty=scene==='vault-empty';
      game.secureEconomy=true;game.self.credits=empty?0:95;
      const stored=empty?[]:full?items.slice(0,4):items.slice(1,2);
      game.self.inventory=empty?[]:items.filter(i=>!stored.some(s=>s.id===i.id));
      game.self.personalVault={items:stored.map(i=>({...i,owner:'personal-vault:'+game.self.id})),credits:empty?0:40,slots:full?4:2,nextSlotPrice:full?20:10,nextInterest:empty?0:1};
    }
    if(scene==='results')base.game!.phase='RESULTS';
    if(scene==='results')base.game!.collector=base.matchSeats.map((seat,index)=>({playerId:seat.id,credits:85-index*12,itemValue:64-index*8,modifierPercent:0,statusIds:[],score:149-index*20,items:[]}));
    return {...base,deadline:time.current+80000,serverTime:time.current,timerSettings:{enabled:true,durationsMs:{PORTALS:80000,APPRAISAL:80000,TRADE:80000,REVEAL:80000}}};
  },[scene]);
  const sound=useSound(room);
  const submit=(action:Decision)=>{
    if(action.type==='enter'){location.href='/?preview=inspection';return;}
    if(action.type==='done'){location.href='/?preview=trade';return;}
    setMessage('หน้านี้ใช้ข้อมูลตัวอย่าง · เปิดเกมจริงเพื่อทำรายการ');
  };
  return <>
    <div className="app-shell cabinet-shell comic-build"><main id="game-main"><GameTable key={scene} room={room} submit={submit} send={()=>true} disabled={false} initialDrawer={drawerScenes[scene as keyof typeof drawerScenes]} initialSettings={scene==='settings'} tools={<SettingsControls sound={sound} canLeave={room.game?.phase!=='RESULTS'}/>}/></main></div>
    {!capture&&<nav className="preview-toolbar" aria-label="ตัวอย่างหน้าจอ"><label>ข้อมูลตัวอย่าง
      <select aria-label="เลือกหน้าตัวอย่าง" value={scene} onChange={event=>{location.href='/?preview='+event.target.value;}}>{previewScenes.map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label>
      <a href="/">เล่นเกมจริง</a>
    </nav>}
    {message&&<button className="preview-feedback" onClick={()=>setMessage('')}>{message}</button>}
  </>;
}
