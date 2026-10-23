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
  'เป่ายิ้งฉุบหมดเวลา การขโมยครั้งนี้ถูกยกเลิก':'The rock, paper, scissors duel timed out. This theft was cancelled.',
};
