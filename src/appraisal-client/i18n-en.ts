import { EN_MODEL } from './en/model.js';
import { EN_UI_TEXT } from './en/ui.js';

/** Every English UI string, keyed by its Thai source text. Missing keys fall back to Thai in t(). */
export const EN_UI: Record<string, string> = {
  ...EN_UI_TEXT, ...EN_MODEL,
  'สมุดบันทึก · เงินกู้และใบประกาศ':'Ledger · Loans and notices',
  'พ่อค้าทั้งหมดระงับการค้าชั่วคราว':'All merchants have temporarily suspended trade',
  'เล่นต่อจนผู้เล่นทุกคนชีวิตหมด หรือ Collector มาตอนจบช่วง {n}':'Play on until every player runs out of life, or until the Collector arrives at the end of encounter {n}',
  ' · Collector มาตอนจบช่วง {n}':' · the Collector arrives at the end of encounter {n}',
  'ถ้ายังมีคนรอดถึงช่วง {n} Collector มาตอนจบช่วงนั้นและคิดคะแนนทุกคนทันที':'If anyone survives to encounter {n}, the Collector arrives at its end and scores everyone at once.',
  'ถึงช่วง {n} Collector มาแล้ว รับสินค้าและรวมเครดิตของทุกคน ทั้งผู้ที่ยังรอดและผู้ที่ชีวิตหมด คิดคะแนนครั้งเดียวตามมูลค่าจริงและสถานะที่ยังอยู่':'Encounter {n} is over and the Collector has arrived. It takes the goods and credits of everyone, alive or not, and scores them once by true value and remaining statuses.',
  'ทิ้งของหนึ่งชิ้นให้พ่อค้า':'Leave one item with the merchant',
  'ทิ้งเครื่องตรวจที่เสีย':'Throw the broken scanner away',
  'ทนใช้เครื่องที่เพี้ยน':'Keep using the faulty scanner',
  '2 พลัง · เครื่องกลับมาใช้ได้':'2 energy · the scanner works again',
  'เสียเครื่องตรวจที่เลือก · ไม่ติดหมอกราคา':'Lose the chosen scanner · no Price Fog',
  'รับหมอกราคา · เก็บเครื่องไว้':'Gain Price Fog · keep the scanner',
  '1 เครดิต · รู้ข้อมูลที่ผู้ประเมินคนนั้นตรวจไว้หนึ่งด้าน':'1 credit · learn one fact that appraiser checked',
  'ของขวัญจากพ่อค้า · ไม่ใช้พลังหรือสิทธิ์ตรวจ · ไม่นับเป็นเหตุการณ์ของช่วงนี้':'A gift from the merchant · no energy or inspection · does not count as one of this encounter\'s events',
  'ของขวัญจากพ่อค้า · ไม่ต้องสละของ · ไม่นับเป็นเหตุการณ์ของช่วงนี้':'A gift from the merchant · nothing to give up · does not count as one of this encounter\'s events',
  'รับเงินอุดหนุน':'Take the subsidy','รับพรใบแรก':'Take the first boon','เร่งสกิลครั้งถัดไป':'Speed up your next ability','รับทิศทางแปรผัน':'Take Shifting Compass',
  'หากจบช่วงหรือหมดเวลา จะรับตัวเลือกแรกให้อัตโนมัติ':'If you end the phase or time runs out, the first option is taken for you',
  'ทำพิธีสงบใจ':'Hold a calming rite','ค้างจ่ายท้ายช่วง':'Pay at the end of the encounter','จ้างยามเฝ้าโต๊ะ':'Hire a table guard',
  'สุ่ม {p}%: {win} · ไม่งั้น {lose}':'{p}% chance: {win} · otherwise {lose}',
  'พ่อค้าจับตาคุณอยู่ ไม่ยอมใช้ความสามารถพิเศษให้':'Merchants are watching you and refuse special services',
  'เป่ายิ้งฉุบหมดเวลา การขโมยครั้งนี้ถูกยกเลิก':'The rock, paper, scissors duel timed out. This theft was cancelled.',
};
