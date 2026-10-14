import type { EventId, StatusId, ItemFamily, ItemKind, NpcId } from './types.js';

const BASE_EVENT_CATALOG: ReadonlyArray<{id:EventId;name:string;when:string;description:string}> = [
  {
    "id": "E01",
    "name": "ประตูคลาดมิติ",
    "when": "ก่อนเข้าประตู; มีตัวเลือกสำรอง",
    "description": "ประตูกำลังเลื่อนหนี ใช้พลัง 1 ยึดประตูแรกไว้ หรือปล่อยไปแล้วเลือกจากประตูที่เหลือ"
  },
  {
    "id": "E02",
    "name": "คำทักทายแห่งเกียรติ",
    "when": "พบออร์ก; ก่อนประเมิน",
    "description": "ออร์กขอให้ประเมินอย่างมีเกียรติ ถ้าราคาที่คุณให้ห่างจากมูลค่าจริงไม่เกิน 10% ได้ B07 แต่ถ้าพลาดเกินนั้น โอกาสถูกจับผิดเพิ่ม 10%"
  },
  {
    "id": "E03",
    "name": "สัมผัสชีพจร",
    "when": "พบ Vampire; พลังไม่เต็ม",
    "description": "Vampire เสนอฟื้นพลัง 3 จ่าย 2 เครดิต หรือจ่ายด้วยเลือดแล้วรับ D10 แทน"
  },
  {
    "id": "E04",
    "name": "การสอบเทียบ Autometa",
    "when": "พบ Autometa; มีสินค้าที่ยังไม่ทราบราคา",
    "description": "Autometa สอบเทียบเครื่องให้ จ่าย 1 เครดิต รับ B01"
  },
  {
    "id": "E05",
    "name": "ภาษาที่ไม่มีบนโลก",
    "when": "พบ alien; ยังมีข้อมูลผลสินค้าที่ยังไม่รู้",
    "description": "จ้างเครื่องแปลภาษา Alien ใช้พลัง 1 รับ B02"
  },
  {
    "id": "E06",
    "name": "ประตูรับสารภาพ",
    "when": "พบ dark one; มี debuff และมี encounter ถัดไป",
    "description": "สารภาพต่อ Dark One แล้ว debuff ที่คุณเลือกจะหายไปหนึ่งอย่าง แต่ต้องรับ D04 หรือ D07 แทน"
  },
  {
    "id": "E07",
    "name": "สัตว์นำทาง",
    "when": "ผู้มาเยือนเป็นสัตว์; ยังตรวจได้อย่างน้อยหนึ่งครั้ง",
    "description": "ป้อนอาหารหนึ่งชิ้นให้สัตว์นำทาง รับ B05"
  },
  {
    "id": "E08",
    "name": "ผู้มาเยือนคู่แข่ง",
    "when": "ก่อนพบ NPC; มีข้อเสนอสองชุด",
    "description": "พ่อค้าสองรายแย่งโต๊ะคุณ เลือกรายที่รับเครดิตอย่างเดียว หรือรายที่ลดราคาแต่ต้องรับเงื่อนไข เลือกได้รายเดียว"
  },
  {
    "id": "E09",
    "name": "พ่อค้ากำลังรีบ",
    "when": "พบ NPC; ยังมีสิทธิ์ต่อรอง",
    "description": "พ่อค้ารีบปิดร้าน ซื้อของที่เลือกลด 2 เครดิต แต่รับ D08"
  },
  {
    "id": "E10",
    "name": "ค่าผ่านม่านภาพลวง",
    "when": "ก่อนพบ NPC; ยังมีข้อมูลราคาไม่ทราบ",
    "description": "ม่านภาพลวงขวางประตูแรก จ่าย 2 เครดิตเพื่อผ่านตามปกติ ผ่านฟรีแต่รับ D02 ถึงจบช่วงนี้ หรือเลี่ยงไปประตูอื่น"
  },
  {
    "id": "E11",
    "name": "รอยประทับโรงงาน",
    "when": "สินค้ายังไม่ทราบความแท้",
    "description": "ตรวจรอยประทับว่าของแท้ไหม ตรวจอย่างระวังใช้พลัง 2 หรือฝืนตรวจใช้พลัง 1 แล้วรับ D01"
  },
  {
    "id": "E12",
    "name": "ใบรับรองน่าสงสัย",
    "when": "NPC มีคำรับรองที่ตรวจเทียบได้",
    "description": "จ่าย 1 เครดิต ตรวจว่าใบรับรองของพ่อค้าพูดจริงไหม ผลนี้รู้แค่คุณ"
  },
  {
    "id": "E13",
    "name": "ตาชั่งของคู่",
    "when": "NPC เสนอสินค้าสองชิ้นที่ยังไม่ทราบราคา",
    "description": "ใช้พลัง 1 ชั่งของสองชิ้นในร้าน รู้ว่าชิ้นไหนมีมูลค่าสูงกว่า แต่ไม่รู้ตัวเลข"
  },
  {
    "id": "E14",
    "name": "ใบราคาจากอดีต",
    "when": "มีประวัติซื้อขาย family เดียวกันที่เปิดเผยได้",
    "description": "จ่าย 1 เครดิต ดูราคาที่ของแบบนี้เคยซื้อขายจริง เป็นแค่เบาะแส ไม่ใช่มูลค่าของชิ้นนี้"
  },
  {
    "id": "E15",
    "name": "การสแกนที่เหลือช่องเดียว",
    "when": "ยังตรวจได้; มีข้อมูลไม่ทราบ",
    "description": "เครื่องสแกนเหลือช่องเดียว ใช้พลัง 1 เลือกรับ B01 หรือ B02 อย่างใดอย่างหนึ่ง"
  },
  {
    "id": "E16",
    "name": "แสงที่เผยเงื่อนไข",
    "when": "สินค้ามี buff/debuff ที่ยังไม่ทราบจังหวะ",
    "description": "ใช้พลัง 1 ส่องดูว่าสินค้าที่เลือกให้ผลอะไรเมื่อเปิดใช้"
  },
  {
    "id": "E17",
    "name": "พยานอีกมิติ",
    "when": "มีข้อมูลราคาเป็นช่วงและ NPC เสนอการตรวจเพิ่ม",
    "description": "จ่าย 2 เครดิต ให้พยานช่วยบีบช่วงราคาของสินค้าที่เลือกให้แคบลง มูลค่าจริงยังอยู่ในช่วงเสมอ"
  },
  {
    "id": "E18",
    "name": "งานตรวจสอบความซื่อตรง",
    "when": "NPC เสนองานประเมินและไม่ใช่การค้ากับผู้เล่น",
    "description": "ใช้พลัง 1 รับงาน ถ้าราคาที่คุณประเมินครั้งถัดไปห่างจากมูลค่าจริงไม่เกิน 10% เลือกรับ B03 หรือ B04"
  },
  {
    "id": "E19",
    "name": "รางวัลเปิดโปงของปลอม",
    "when": "ตรวจพบว่าสินค้าเป็นของปลอมแล้ว; NPC มีงบรางวัล",
    "description": "คุณรู้ว่าของชิ้นนี้ปลอม ประกาศให้ทุกคนรู้แล้วรับ 1 เครดิต"
  },
  {
    "id": "E20",
    "name": "ของที่มีเงื่อนไขแฝง",
    "when": "มีสินค้าเปิดใช้ได้และยังไม่ทราบเงื่อนไขเปิดใช้",
    "description": "ใช้พลัง 2 รู้ว่าผลดีและผลเสียของสินค้าที่เลือกทำงานเมื่อไร"
  },
  {
    "id": "E21",
    "name": "ชุดขายเหมา",
    "when": "NPC มีสินค้าสองชิ้นพร้อมขาย",
    "description": "ซื้อทั้งสองชิ้นในร้านพร้อมกัน ลดรวม 2 เครดิต"
  },
  {
    "id": "E22",
    "name": "กรมธรรม์พ่อค้า",
    "when": "ไม่มี B07 ที่ใช้งาน; มีความเสี่ยง NPC ยึดของ",
    "description": "จ่าย 1 เครดิตซื้อประกันจากพ่อค้า รับ B07"
  },
  {
    "id": "E23",
    "name": "นายหน้าต่างมิติ",
    "when": "ยังมีพลังยื่นข้อเสนอ; อยู่ในช่วง NPC ต่อรอง",
    "description": "ใช้พลัง 1 จ้างนายหน้า รับ B10"
  },
  {
    "id": "E24",
    "name": "ราคาพิเศษแลกเลือด",
    "when": "พบ Vampire; มีสินค้าพร้อมซื้อ",
    "description": "Vampire ลดราคาของที่เลือก 2 เครดิต แลกกับ D05"
  },
  {
    "id": "E25",
    "name": "พ่อค้าไม่รับเงิน",
    "when": "มีสินค้าที่ NPC ต้องการใน inventory และโอนได้",
    "description": "พ่อค้าไม่เอาเครดิต แต่อยากได้ของในคลังของคุณ แลกของที่เลือกกับสินค้าชิ้นแรกในร้าน"
  },
  {
    "id": "E26",
    "name": "ฝากแรงล่วงหน้า",
    "when": "มี encounter ถัดไป",
    "description": "จ่าย 2 เครดิต รับ B09 พลังจะมาตอนต้นช่วงหน้า"
  },
  {
    "id": "E27",
    "name": "ซื้อก่อนจ่ายทีหลัง",
    "when": "มี encounter ถัดไปและสินค้าพร้อมซื้อ",
    "description": "ซื้อของที่เลือกลด 2 เครดิตตอนนี้ แล้วรับ D04 ไว้จ่ายทีหลัง"
  },
  {
    "id": "E28",
    "name": "ผู้ค้ำความตาย",
    "when": "มี NPC ที่ขอบเขตผลเสียระบุว่าตายได้; ไม่มี B08",
    "description": "จ่าย 2 เครดิต รับ B08 ไว้กันสัญญาถึงตาย"
  },
  {
    "id": "E29",
    "name": "ของถูกแต่ขายต่อไม่ได้",
    "when": "มีสินค้าซื้อได้; ไม่มี D09 สำหรับชิ้นนั้น",
    "description": "ซื้อของที่เลือกลด 3 เครดิต แต่ของชิ้นนั้นติด D09 ขายหรือแลกไม่ได้จนจบช่วงหน้า"
  },
  {
    "id": "E30",
    "name": "พิธีคุ้มครองสัญญา",
    "when": "NPC เสนอทางเลือกที่อาจให้ debuff; ไม่มี B06",
    "description": "จ่ายแพงขึ้น 2 เครดิตสำหรับของที่เลือก เพื่อรับ B06"
  },
  {
    "id": "E31",
    "name": "กระจกกินลมหายใจ",
    "when": "ถือกระจกที่มีคุณสมบัตินี้",
    "description": "ใช้พลัง 1 เปิดกระจก รับ B01 แต่ติด D05"
  },
  {
    "id": "E32",
    "name": "ลูกแก้วแลกแรง",
    "when": "ถือไอเทมใช้แล้วหมด; พลังไม่เต็ม",
    "description": "ทุบลูกแก้วหนึ่งลูกและจ่าย 1 เครดิต ฟื้นพลัง 3"
  },
  {
    "id": "E33",
    "name": "กุญแจฝ่าผนึก",
    "when": "ถือกุญแจใช้แล้วหมดและมี D07",
    "description": "ใช้กุญแจหนึ่งดอกปลด D07"
  },
  {
    "id": "E34",
    "name": "หน้ากากเลือกบุคลิก",
    "when": "ถือหน้ากาก; มี buff ที่ยังใช้งาน",
    "description": "สวมหน้ากาก สละ buff ที่เลือกหนึ่งอย่างเพื่อรับ B10"
  },
  {
    "id": "E35",
    "name": "เศษยาจากอีกโลก",
    "when": "ถือยาใช้แล้วหมดและมี D01 หรือ D05",
    "description": "ดื่มยาหนึ่งขวด ล้าง D01 หรือ D05 อย่างใดอย่างหนึ่ง"
  },
  {
    "id": "E36",
    "name": "แบตเตอรี่รั่ว",
    "when": "ถือแบตเตอรี่เปิดใช้ได้; ยังตรวจได้อย่างน้อยหนึ่งครั้ง",
    "description": "ใช้พลัง 1 ชาร์จแบตเตอรี่ รับ B05"
  },
  {
    "id": "E37",
    "name": "สัมภาระเกินแรง",
    "when": "ถือของอย่างน้อย 3 ชิ้น; อยู่ก่อนการซื้อจาก NPC",
    "description": "ของเต็มมือ จ่าย 2 เครดิตจ้างคนแบก หรือแบกเองแล้วรับ D06"
  },
  {
    "id": "E38",
    "name": "เครื่องรางทำให้ถูกสงสัย",
    "when": "ถือเครื่องรางที่มีคุณสมบัตินี้",
    "description": "ใช้พลัง 1 เปิดเครื่องราง รับ B06 แต่ติด D03"
  },
  {
    "id": "E39",
    "name": "ดาบกระหายโลหิต",
    "when": "ถือสินค้าที่มีคุณสมบัตินี้; ยังมีการประเมิน NPC",
    "description": "ใช้พลัง 1 เปิดดาบ รับ B04 แต่ติด D10"
  },
  {
    "id": "E40",
    "name": "วงจรราคาเสีย",
    "when": "ถือเครื่องตรวจจาก Autometa ที่เปิดเผยความเสี่ยงขัดข้องไว้",
    "description": "เครื่องตรวจราคาเพี้ยน ใช้พลัง 2 ซ่อม หรือปล่อยไว้แล้วรับ D02 ถึงจบช่วงนี้"
  },
  {
    "id": "E41",
    "name": "ร้านชำระคำสาป",
    "when": "มี debuff ที่ล้างได้",
    "description": "จ่าย 2 เครดิต ล้าง debuff ที่เลือกหนึ่งอย่าง"
  },
  {
    "id": "E42",
    "name": "น้ำพุทางแยก",
    "when": "พลังไม่เต็มหรือมี D10",
    "description": "ดื่มน้ำพุได้ครั้งเดียว เลือกฟื้นพลัง 2 หรือล้าง D10"
  },
  {
    "id": "E43",
    "name": "เงินอุดหนุนคนกลาง",
    "when": "ช่วงซื้อขายระหว่างผู้เล่น; ยังไม่รับรางวัลนี้; ตลาดมีงบ",
    "description": "ซื้อขายกับผู้เล่นสำเร็จครั้งถัดไป รับโบนัส 1 เครดิต"
  },
  {
    "id": "E44",
    "name": "นักสะสมซื้อคืน",
    "when": "ถือของอย่างน้อยสองชิ้นที่โอนได้; NPC มีงบซื้อ",
    "description": "นักสะสมขอซื้อของในคลังของคุณหนึ่งชิ้น ตามราคาที่เสนอ"
  },
  {
    "id": "E45",
    "name": "หอข้อมูลเปิดเผย",
    "when": "มีผลตรวจส่วนตัวที่ server รับรองและยังไม่เผยแพร่",
    "description": "เปิดผลตรวจหนึ่งข้อให้ทุกคนเห็น รับ 1 เครดิต"
  },
  {
    "id": "E46",
    "name": "ท้าทายอ่านของ",
    "when": "NPC เสนอสินค้าที่มีคุณสมบัติยังไม่ทราบ; มีพลังพอ",
    "description": "ใช้พลัง 1 ทายว่าสินค้าที่เลือกแท้หรือปลอม ทายถูกได้ 2 เครดิต และได้รู้คำตอบเสมอ"
  },
  {
    "id": "E47",
    "name": "สมุดสินค้าข้ามร้าน",
    "when": "มีรายการ NPC ที่นักประเมินคนอื่นประเมินไว้และยอมเปิดให้ชม",
    "description": "ขอดูรายการจากร้านของผู้เล่นอื่นหนึ่งชิ้น ไม่มีการโอนของ"
  },
  {
    "id": "E48",
    "name": "ค่าปรับจากการกดราคา",
    "when": "Server บันทึกว่าถูก NPC จับได้แล้ว และขอบเขตผลเสียประกาศไว้",
    "description": "พ่อค้าจับได้ว่าคุณกดราคา จ่ายค่าปรับ 2 เครดิต หรือยอมให้ยึดของหนึ่งชิ้น (B07 กันการยึดได้) ถ้าไม่มีทั้งเครดิตและของ เสียพลัง 2"
  },
  {
    "id": "E49",
    "name": "พ่อค้าจดจำใบหน้า",
    "when": "ถูก NPC จับได้แล้ว; ยังมี encounter ถัดไป; ประกาศผลนี้ไว้",
    "description": "พ่อค้าจำหน้าคุณได้ จ่าย 2 เครดิตให้ลืม หรือรับ D08 จนจบช่วงหน้า"
  },
  {
    "id": "E50",
    "name": "คำพิพากษา Dark One",
    "when": "รับสัญญา NPC ที่เปิดเผยว่าตายได้และถูกจับผิดตามสัญญาแล้ว",
    "description": "คุณผิดสัญญา Dark One สละของหนึ่งชิ้นเพื่อรอด หรือรับความตายในช่วงนี้ ถ้ามี B08 จะเสียพลัง 2 แทนการตาย"
  }
];

export type BondMode = 'swap'|'sell'|'tribute'|'show'|'reveal';
/** NPC × held-item encounters (brokerage rules). Item-giving modes hand over an unlocked item not used this encounter. */
export interface BondSpec {
  id:EventId; npc:NpcId; name:string; when:string; description:string; mode:BondMode;
  families?:ItemFamily[]; kinds?:ItemKind[]; exclude?:ItemKind[]; known?:'cursed'|'fake';
  buffs?:StatusId[]; debuffs?:StatusId[]; cleanse?:'D10'|'debuffs'; energy?:number; life?:number;
  energyCost?:number; reveal?:Array<'base'|'genuine'|'cursed'|'effectsKnown'>; price?:number;
  genuineOnly?:boolean; risk?:number;
}
export const BOND_SPECS: ReadonlyArray<BondSpec> = [
  {id:'E51',npc:'vampire',mode:'swap',kinds:['blood-orb','blood-tonic'],genuineOnly:true,name:'เลือดบริสุทธิ์',when:'พบ Vampire; ถือลูกแก้วชีพจรโลหิตหรือน้ำยาเลือดคืนชีพ',description:'Vampire ขอแลกของเลือดที่คุณถือกับสินค้าในร้านหนึ่งชิ้นโดยไม่คิดเครดิตหรือพลัง หากของเลือดเป็นของปลอม Vampire ปฏิเสธ คุณเก็บของไว้และรับ D10'},
  {id:'E52',npc:'orc',mode:'show',families:['blade'],buffs:['B03'],name:'ดาบที่คู่ควร',when:'พบออร์ก; ถือดาบ',description:'ออร์กเคารพผู้ถือดาบ ได้รับ B03 โดยไม่ต้องสละของ'},
  {id:'E53',npc:'orc',mode:'reveal',kinds:['oath-charm','amulet'],reveal:['base'],name:'คำสัตย์ต่อคำสัตย์',when:'พบออร์ก; ถือเครื่องรางคำสัตย์ออร์กหรือเครื่องรางเฝ้าจิต',description:'ออร์กบอกมูลค่าจริงของสินค้าที่เลือกหนึ่งชิ้นตามคำสัตย์ ไม่ใช้สิทธิ์ตรวจและไม่ใช้พลัง'},
  {id:'E54',npc:'orc',mode:'tribute',families:['food'],energy:3,life:1,name:'เนื้อย่างเพื่อนร่วมรบ',when:'พบออร์ก; ถืออาหาร',description:'มอบอาหารหนึ่งชิ้นให้ออร์ก ฟื้นพลัง 3 · กติกาชีวิตฟื้นชีวิตเพิ่ม 1'},
  {id:'E55',npc:'vampire',mode:'sell',families:['mirror'],price:1,name:'กระจกที่ไร้เงา',when:'พบ Vampire; ถือกระจก; ธนาคารมีงบพอ',description:'Vampire ซื้อกระจกหนึ่งชิ้นในราคาอ้างอิงเต็มของชนิดนั้น ไม่สนว่าแท้หรือปลอม'},
  {id:'E56',npc:'vampire',mode:'tribute',families:['orb'],exclude:['blood-orb'],cleanse:'D10',energy:2,name:'ดื่มพายุในลูกแก้ว',when:'พบ Vampire; ถือลูกแก้วที่ไม่ใช่ลูกแก้วชีพจรโลหิต',description:'มอบลูกแก้วหนึ่งชิ้น Vampire ดูดพลังแทนคุณ ล้าง D10 และฟื้นพลัง 2'},
  {id:'E57',npc:'autometa',mode:'swap',families:['battery'],name:'แบตเตอรี่ที่เข้ากัน',when:'พบ Autometa; ถือแบตเตอรี่',description:'Autometa ขอแลกแบตเตอรี่ที่คุณถือกับสินค้าในร้านหนึ่งชิ้นโดยไม่คิดเครดิตหรือพลัง'},
  {id:'E58',npc:'autometa',mode:'reveal',families:['scanner'],reveal:['base','genuine'],energyCost:1,name:'อัปเดตเครื่องสแกน',when:'พบ Autometa; ถือเครื่องตรวจราคา',description:'จ่ายพลัง 1 ให้ Autometa เชื่อมเครื่องสแกน เปิดมูลค่าจริงและความแท้ของสินค้าที่เลือกหนึ่งชิ้น ไม่ใช้สิทธิ์ตรวจ'},
  {id:'E59',npc:'autometa',mode:'show',families:['key'],buffs:['B10'],name:'รหัสกุญแจกลไก',when:'พบ Autometa; ถือกุญแจ',description:'Autometa อ่านรหัสกุญแจแล้วยอมต่อรองเพิ่ม ได้รับ B10 โดยไม่ต้องสละของ'},
  {id:'E60',npc:'alien',mode:'reveal',families:['mask'],reveal:['cursed','effectsKnown'],name:'หน้ากากแปลภาษา',when:'พบ Alien; ถือหน้ากาก',description:'สวมหน้ากากคุยกับ Alien เปิดผลของสินค้าและคำสาปของสินค้าที่เลือกหนึ่งชิ้น ไม่ใช้สิทธิ์ตรวจและไม่ใช้พลัง'},
  {id:'E61',npc:'alien',mode:'sell',families:['potion'],price:1.25,name:'ตัวอย่างยาจากโลกนี้',when:'พบ Alien; ถือยา; ธนาคารมีงบพอ',description:'Alien ซื้อยาหนึ่งชิ้นไปศึกษาในราคาอ้างอิง 125% ของชนิดนั้น'},
  {id:'E62',npc:'alien',mode:'show',families:['orb'],energy:2,buffs:['B05'],name:'ลูกแก้วนำทางดาว',when:'พบ Alien; ถือลูกแก้ว',description:'Alien ปรับคลื่นลูกแก้วให้ ฟื้นพลัง 2 และได้รับ B05 โดยไม่ต้องสละของ'},
  {id:'E63',npc:'darkone',mode:'tribute',families:['key'],buffs:['B08'],name:'กุญแจห้องมืด',when:'พบ Dark One; ถือกุญแจ',description:'มอบกุญแจหนึ่งชิ้นให้ Dark One ได้รับ B08'},
  {id:'E64',npc:'darkone',mode:'tribute',families:['amulet'],cleanse:'debuffs',name:'วิญญาณแลกวิญญาณ',when:'พบ Dark One; ถือเครื่องราง; มี debuff',description:'มอบเครื่องรางหนึ่งชิ้น Dark One กลืนผลเสียทั้งหมดที่ติดตัวคุณ'},
  {id:'E65',npc:'darkone',mode:'swap',families:['mask'],name:'หน้ากากแห่งความว่าง',when:'พบ Dark One; ถือหน้ากาก',description:'Dark One ขอแลกหน้ากากที่คุณถือกับสินค้าในร้านหนึ่งชิ้นโดยไม่คิดเครดิตหรือพลัง'},
  {id:'E66',npc:'beast',mode:'swap',families:['food'],name:'อาหารแลกของวิเศษ',when:'พบสัตว์นำทาง; ถืออาหาร',description:'สัตว์นำทางคาบสินค้าในร้านหนึ่งชิ้นมาแลกอาหารที่คุณถือ ไม่คิดเครดิตหรือพลัง'},
  {id:'E67',npc:'beast',mode:'tribute',families:['potion'],buffs:['B05','B09'],name:'ยาสมานแผลสัตว์',when:'พบสัตว์นำทาง; ถือยา',description:'ใช้ยาหนึ่งชิ้นรักษาสัตว์นำทาง ได้รับ B05 และ B09'},
  {id:'E68',npc:'beast',mode:'show',families:['blade'],buffs:['B03'],debuffs:['D03'],name:'สัตว์หวาดคมดาบ',when:'พบสัตว์นำทาง; ถือดาบ',description:'ข่มขู่สัตว์นำทางด้วยดาบ ได้รับ B03 แต่รับ D03'},
  {id:'E69',npc:'darkone',mode:'sell',known:'cursed',price:1,name:'นักสะสมคำสาป',when:'พบ Dark One; ถือของที่คุณรู้ว่ามีคำสาป; ธนาคารมีงบพอ',description:'Dark One ซื้อของต้องสาปหนึ่งชิ้นในราคาอ้างอิงเต็มของชนิดนั้น'},
  {id:'E70',npc:'alien',mode:'swap',known:'fake',risk:.5,name:'ของปลอมข้ามจักรวาล',when:'พบ Alien; ถือของที่คุณรู้ว่าเป็นของปลอม',description:'ลองแลกของปลอมกับสินค้าในร้านหนึ่งชิ้น โอกาส 50% ที่ Alien จับได้: ไม่แลกและรับ D03'},
  {id:'E71',npc:'orc',mode:'show',families:['mask'],buffs:['B07'],name:'หน้ากากนักรบ',when:'พบออร์ก; ถือหน้ากาก',description:'ออร์กนับถือหน้ากากนักรบ ได้รับ B07 โดยไม่ต้องสละของ'},
  {id:'E72',npc:'autometa',mode:'show',families:['mirror'],buffs:['B01'],name:'กระจกสอบเทียบ',when:'พบ Autometa; ถือกระจก',description:'Autometa ใช้กระจกของคุณสอบเทียบเลนส์ ได้รับ B01 โดยไม่ต้องสละของ'},
];
export const EVENT_CATALOG: ReadonlyArray<{id:EventId;name:string;when:string;description:string}> = [
  ...BASE_EVENT_CATALOG,...BOND_SPECS.map(({id,name,when,description})=>({id,name,when,description})),
];
/** What each NPC does when an item you appraised leaves the table unsold. Always payable: credits cap at what you hold. */
export const UNSOLD_PENALTIES: Record<NpcId,{credits:number;energy:number;statuses:StatusId[];life:number;text:string}> = {
  orc:{credits:3,energy:0,statuses:[],life:0,text:'ออร์กเสียหน้า ยึดเครดิต 3 เท่าที่มี'},
  vampire:{credits:0,energy:1,statuses:['D10'],life:0,text:'Vampire ดูดพลัง 1 และทิ้งความกระหายโลหิต'},
  autometa:{credits:2,energy:0,statuses:['D06'],life:0,text:'Autometa เก็บค่าจัดเก็บ 2 เครดิตเท่าที่มี และให้แบกอุปกรณ์หนัก'},
  alien:{credits:0,energy:1,statuses:['D02'],life:0,text:'Alien ส่งคลื่นสับสน เสียพลัง 1 และรับหมอกราคา'},
  darkone:{credits:2,energy:0,statuses:['D03'],life:1,text:'Dark One ยึดเครดิต 2 เท่าที่มีและประทับตรานักโกง · กติกาชีวิตเสียชีวิต 1'},
  beast:{credits:0,energy:1,statuses:['D01'],life:0,text:'สัตว์นำทางงอน เสียพลัง 1 และรับอ่อนล้า'},
};
/** Seeded consignment outcomes; thresholds are cumulative. */
export const CONSIGN_RULES = { cleanBelow:.4, debuffBelow:.8, debuffs:['D01','D02','D03','D06'] as StatusId[], fee:2 };

export const STATUS_CATALOG: ReadonlyArray<{id:StatusId;name:string;description:string;duration:string;source:string}> = [
  {
    "id": "B01",
    "name": "ตาเห็นราคา",
    "description": "ตรวจราคาครั้งถัดไป เห็นมูลค่าจริงแบบตัวเลขเป๊ะ",
    "duration": "1 ครั้ง · หมดเมื่อจบช่วงหน้า",
    "source": "เครื่องตรวจราคา/กระจก; D02 ระงับการเปิดค่าจริงได้ แต่ข้อมูลที่รู้แล้วไม่ถูกลบ"
  },
  {
    "id": "B02",
    "name": "อ่านคำสาป",
    "description": "ตรวจผลของสินค้าครั้งถัดไป รู้ด้วยว่ามีคำสาปไหม",
    "duration": "1 ครั้ง · หมดเมื่อจบช่วงหน้า",
    "source": "เครื่องแปล/การสแกน; ข้อสัญญาที่ NPC เสนอต้องเปิดก่อนรับอยู่แล้ว"
  },
  {
    "id": "B03",
    "name": "ปากทอง",
    "description": "ซื้อจากพ่อค้าครั้งถัดไปถูกลง 2 เครดิต",
    "duration": "1 การซื้อ · หมดเมื่อจบช่วงหน้า",
    "source": "ปิดงานประเมินที่ยาก; ไม่ลดราคาที่ผู้เล่นอีกคนได้รับ"
  },
  {
    "id": "B04",
    "name": "รับรองผู้ประเมิน",
    "description": "การประเมินครั้งถัดไป โอกาสถูกจับว่ากดราคาลดลง 10%",
    "duration": "1 การประเมิน · หมดเมื่อจบช่วงหน้า",
    "source": "ประเมินตรงในงานตรวจสอบ/เปิดใช้สินค้า"
  },
  {
    "id": "B05",
    "name": "มือเบา",
    "description": "การตรวจสองครั้งถัดไปใช้พลังน้อยลงครั้งละ 1",
    "duration": "2 ครั้ง · หมดเมื่อจบช่วงนี้",
    "source": "สัตว์นำทาง/แบตเตอรี่; ยังต้องมีสิทธิ์ตรวจตามกติกาหลัก"
  },
  {
    "id": "B06",
    "name": "เกราะจิต",
    "description": "กัน debuff ใหม่ได้ 1 ครั้ง แต่ไม่ล้าง debuff ที่ติดอยู่แล้ว",
    "duration": "1 ครั้ง · หมดเมื่อจบช่วงหน้า",
    "source": "รับเงื่อนไข NPC/เครื่องราง; ไม่ป้องกันการสูญเสีย credit หรือของโดยตรง"
  },
  {
    "id": "B07",
    "name": "ประกันทรัพย์",
    "description": "ถ้าพ่อค้าจะยึดของเป็นค่าปรับ กันไว้ได้ 1 ชิ้น",
    "duration": "1 ครั้ง · หมดเมื่อจบช่วงหน้า",
    "source": "พ่อค้าประกัน/พ่อค้าออร์กที่ไว้ใจ"
  },
  {
    "id": "B08",
    "name": "สัญญาปลอดภัย",
    "description": "รอดจากความตายเพราะพ่อค้า 1 ครั้ง แลกกับเสียพลัง 2",
    "duration": "1 ครั้ง · หมดเมื่อจบช่วงหน้า",
    "source": "ซื้อสิทธิ์คุ้มครอง; ไม่ล้างผลสัญญาอื่น"
  },
  {
    "id": "B09",
    "name": "บ่อน้ำฟื้นแรง",
    "description": "ต้นช่วงหน้าได้พลังเพิ่ม 2 (ไม่เกินเพดาน)",
    "duration": "ทำงานตอนต้นช่วงหน้า",
    "source": "จ่ายล่วงหน้าหรือรับสัญญาฝากพลัง; ไม่สุ่มถ้าไม่มี encounter ถัดไป"
  },
  {
    "id": "B10",
    "name": "คนกลาง",
    "description": "ต่อรองราคากับพ่อค้าได้เพิ่ม 1 ครั้ง",
    "duration": "หมดเมื่อจบช่วงนี้",
    "source": "ซื้องานนายหน้า/หน้ากาก; ไม่เพิ่มผลลงโทษในการต่อรองระหว่างผู้เล่น"
  },
  {
    "id": "D01",
    "name": "อ่อนล้า",
    "description": "การตรวจสองครั้งถัดไปใช้พลังเพิ่มครั้งละ 1",
    "duration": "2 ครั้ง · หมดเมื่อจบช่วงหน้า",
    "source": "หยุดตรวจหรือชำระล้าง; B05 หักล้างต้นทุนตามจำนวนใช้ที่เหลือ"
  },
  {
    "id": "D02",
    "name": "หมอกราคา",
    "description": "ตรวจราคาได้แค่ช่วงคร่าว ๆ ไม่เห็นมูลค่าจริง แม้มี B01 ก็ตาม สิ่งที่รู้แล้วไม่หายไป",
    "duration": "หมดเมื่อจบช่วงนี้",
    "source": "ซ่อมหรือชำระล้างก่อนตรวจ; เลือกตรวจเงื่อนไขอื่นแทน"
  },
  {
    "id": "D03",
    "name": "ตรานักโกง",
    "description": "การประเมินสองครั้งถัดไป โอกาสถูกจับว่ากดราคาเพิ่ม 10%",
    "duration": "2 การประเมิน · หมดเมื่อจบช่วงหน้า",
    "source": "ประเมินตรง/หลีกเลี่ยงข้อเสนอเสี่ยงหรือชำระล้าง; ไม่ใช้กับการเสนอราคาให้ผู้เล่น"
  },
  {
    "id": "D04",
    "name": "ดอกเบี้ยเงา",
    "description": "ต้นช่วงหน้าเสีย 2 เครดิต ถ้ามีไม่พอเสียเท่าที่มี",
    "duration": "ทำงานตอนต้นช่วงหน้า",
    "source": "กันเงินหรือชำระสัญญาก่อนจุดคิดเงิน; ไม่สุ่มถ้าไม่มี encounter ถัดไป"
  },
  {
    "id": "D05",
    "name": "ลมหายใจต้องสาป",
    "description": "ท้ายช่วงนี้และท้ายช่วงหน้า เสียพลังครั้งละ 2",
    "duration": "2 ครั้งตอนคิดผลช่วง",
    "source": "ชำระล้างก่อน settlement/เก็บพลังสำรอง; ถ้าหมดพลังใช้ช่วงพักเดิม"
  },
  {
    "id": "D06",
    "name": "อุปกรณ์หนัก",
    "description": "การซื้อจาก NPC สองครั้งถัดไปใช้พลังเพิ่มครั้งละ 1",
    "duration": "2 การซื้อ · หมดเมื่อจบช่วงหน้า",
    "source": "ลดการซื้อหรือจ้างจัดของ; ไม่หักพลังจากผู้ขายที่เป็นผู้เล่น"
  },
  {
    "id": "D07",
    "name": "ปิดประตู",
    "description": "ตอนเลือกประตูครั้งหน้า ประตูหนึ่งบานจะถูกปิด",
    "duration": "ตอนเลือกประตูครั้งหน้า",
    "source": "ใช้กุญแจเงา/ชำระล้าง; ให้ event นี้ได้เมื่อมีประตูอย่างน้อยสองบานและมี encounter ถัดไป"
  },
  {
    "id": "D08",
    "name": "สาบานห้ามต่อรอง",
    "description": "ต่อรองราคากับพ่อค้าได้น้อยลง 1 ครั้ง ยังซื้อตามราคาที่ตั้งได้",
    "duration": "หมดเมื่อจบช่วงหน้า",
    "source": "รอหมดอายุ/ปลดสัญญา; B10 เพิ่มสิทธิ์คืนได้ ไม่จำกัดการคุยกับผู้เล่น"
  },
  {
    "id": "D09",
    "name": "ครอบครองอัปมงคล",
    "description": "ของชิ้นที่ผูกไว้ขายหรือแลกไม่ได้ แต่ยังเปิดใช้ได้",
    "duration": "หมดเมื่อจบช่วงหน้า",
    "source": "ชำระล้าง/รอหมดอายุ; ขอดูได้โดยไม่โอน ไม่สุ่มเมื่อไม่มีของที่เข้าเงื่อนไข"
  },
  {
    "id": "D10",
    "name": "กระหายโลหิต",
    "description": "การฟื้นพลังสองครั้งถัดไปได้น้อยลงครั้งละ 2",
    "duration": "2 ครั้ง · หมดเมื่อจบช่วงหน้า",
    "source": "ชำระล้าง/หลีกเลี่ยงดีลเลือด/ใช้การฟื้นตามกติกากลับเข้าเล่น"
  }
];

export interface ItemSpec { name:string;anchor:number;buff:StatusId;drawback:StatusId;consumable:boolean;family?:ItemFamily;energyRecovery?:number }
export const ITEM_SPECS: Record<ItemKind,ItemSpec> = {
  mirror:{name:'กระจกจันทรา',anchor:24,buff:'B01',drawback:'D05',consumable:false},
  orb:{name:'ลูกแก้วแลกแรง',anchor:14,buff:'B09',drawback:'D10',consumable:true},
  key:{name:'กุญแจเงา',anchor:20,buff:'B10',drawback:'D07',consumable:true},
  mask:{name:'หน้ากากกระซิบ',anchor:18,buff:'B10',drawback:'D08',consumable:false},
  potion:{name:'ยาชำระล้าง',anchor:12,buff:'B06',drawback:'D01',consumable:true},
  battery:{name:'แบตเตอรี่ต่างมิติ',anchor:16,buff:'B05',drawback:'D06',consumable:false},
  amulet:{name:'เครื่องรางเฝ้าจิต',anchor:26,buff:'B06',drawback:'D03',consumable:false},
  blade:{name:'ดาบโลหิต',anchor:30,buff:'B04',drawback:'D10',consumable:false},
  scanner:{name:'เครื่องตรวจราคา',anchor:22,buff:'B01',drawback:'D02',consumable:false},
  food:{name:'อาหารสัตว์นำทาง',anchor:8,buff:'B05',drawback:'D01',consumable:true},
  'memory-mirror':{name:'กระจกเก็บความทรงจำ',family:'mirror',anchor:19,buff:'B02',drawback:'D02',consumable:false},
  'rift-mirror':{name:'กระจกสะท้อนรอยแยก',family:'mirror',anchor:32,buff:'B08',drawback:'D07',consumable:false},
  'blood-orb':{name:'ลูกแก้วชีพจรโลหิต',family:'orb',anchor:17,buff:'B09',drawback:'D10',consumable:true,energyRecovery:5},
  'storm-orb':{name:'ลูกแก้วกักพายุ',family:'orb',anchor:23,buff:'B09',drawback:'D05',consumable:true,energyRecovery:4},
  'bone-key':{name:'กุญแจกระดูกโบราณ',family:'key',anchor:13,buff:'B03',drawback:'D01',consumable:true},
  'clockwork-key':{name:'กุญแจกลไกนิรันดร์',family:'key',anchor:27,buff:'B07',drawback:'D06',consumable:false},
  'bone-mask':{name:'หน้ากากผู้รักษาคำสัตย์',family:'mask',anchor:21,buff:'B04',drawback:'D03',consumable:false},
  'void-mask':{name:'หน้ากากเสียงจากความว่าง',family:'mask',anchor:29,buff:'B02',drawback:'D10',consumable:false},
  'blood-tonic':{name:'น้ำยาเลือดคืนชีพ',family:'potion',anchor:16,buff:'B08',drawback:'D05',consumable:true},
  'dream-tonic':{name:'น้ำยาความฝันใส',family:'potion',anchor:10,buff:'B01',drawback:'D02',consumable:true},
  'sun-cell':{name:'เซลล์พลังงานสุริยะ',family:'battery',anchor:25,buff:'B09',drawback:'D05',consumable:false},
  'void-cell':{name:'เซลล์พลังงานสูญญากาศ',family:'battery',anchor:31,buff:'B02',drawback:'D10',consumable:false},
  'oath-charm':{name:'เครื่องรางคำสัตย์ออร์ก',family:'amulet',anchor:18,buff:'B07',drawback:'D08',consumable:false},
  'echo-charm':{name:'เครื่องรางสะท้อนวิญญาณ',family:'amulet',anchor:34,buff:'B08',drawback:'D04',consumable:false},
  'bone-blade':{name:'ดาบกระดูกนักล่า',family:'blade',anchor:22,buff:'B05',drawback:'D06',consumable:false},
  'eclipse-blade':{name:'ดาบสุริยุปราคา',family:'blade',anchor:38,buff:'B06',drawback:'D05',consumable:false},
  'truth-lens':{name:'เลนส์ชั่งความจริง',family:'scanner',anchor:28,buff:'B04',drawback:'D03',consumable:false},
  'curse-meter':{name:'เครื่องวัดคลื่นคำสาป',family:'scanner',anchor:20,buff:'B02',drawback:'D06',consumable:false},
  'ember-feed':{name:'อาหารสัตว์เมล็ดเพลิง',family:'food',anchor:11,buff:'B03',drawback:'D05',consumable:true},
  'moon-feed':{name:'อาหารสัตว์ละอองจันทร์',family:'food',anchor:6,buff:'B06',drawback:'D10',consumable:true},
};
export function itemFamily(kind:ItemKind):ItemFamily { return ITEM_SPECS[kind].family ?? kind as ItemFamily; }
export function itemImage(kind:ItemKind):string { return `/art/item-${itemFamily(kind)}.png`; }
/** Version 1 preserves the exact original order and RNG index mapping. */
export function merchantKinds(npc:NpcId,catalogVersion:1|2=1):ItemKind[] {
  const favorites=NPC_SPECS[npc].favorite;
  return catalogVersion===1 ? favorites : (Object.keys(ITEM_SPECS) as ItemKind[]).filter(kind=>favorites.includes(itemFamily(kind)));
}
export const NPC_SPECS: Record<NpcId,{name:string;sensitivity:number;condition:StatusId;discount:number;reservation:[number,number];favorite:ItemKind[];hint:string}> = {
  orc:{name:'ออร์กผู้รักษาเกียรติ',sensitivity:1,condition:'D03',discount:2,reservation:[.45,.8],favorite:['blade','amulet','food'],hint:'ราคาที่ดูถูกอาจทำให้เสียทรัพย์'},
  vampire:{name:'พ่อค้าแวมไพร์',sensitivity:.75,condition:'D10',discount:3,reservation:[.35,.65],favorite:['orb','mirror','blade'],hint:'ส่วนลดแลกการฟื้นพลังที่ลดลง'},
  autometa:{name:'นักค้าจักรกล Autometa',sensitivity:.5,condition:'D06',discount:3,reservation:[.7,.9],favorite:['scanner','battery','key'],hint:'ตรวจจับต่ำ แต่ราคามีกฎตายตัวและของเพิ่มภาระพลัง'},
  alien:{name:'ผู้แลกเปลี่ยน Alien',sensitivity:1.25,condition:'D02',discount:3,reservation:[.4,.85],favorite:['mask','orb','potion'],hint:'ภาษาและข้อมูลราคาไม่แน่นอน'},
  darkone:{name:'Dark One',sensitivity:1.5,condition:'D04',discount:4,reservation:[.25,.7],favorite:['key','amulet','mirror'],hint:'สัญญากดราคามีผลถึงชีวิต ต้องยอมรับก่อน'},
  beast:{name:'สัตว์นำทางข้ามมิติ',sensitivity:.6,condition:'D01',discount:1,reservation:[.35,.6],favorite:['food','potion','battery'],hint:'อาหารแลกการตรวจที่ประหยัดแรง'},
};
export function priceRange(kind:ItemKind):[number,number] {
  const anchor=ITEM_SPECS[kind].anchor;
  return [Math.floor(anchor*.7),Math.ceil(anchor*1.3)];
}
