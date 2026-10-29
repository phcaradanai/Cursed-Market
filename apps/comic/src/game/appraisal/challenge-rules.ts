/** An appraiser may state facts they never checked; a buyer may call one of them a lie. */
export const CHALLENGE_PCT=50;
/** Each held doubt lens adds this many percentage points to a winning challenge. */
export const CHALLENGE_LENS_BONUS=10;
export const CHALLENGE_CAP=90;
export type ClaimKey='genuine'|'cursed';
export interface Claims { genuine?:boolean; cursed?:boolean }
export const CLAIM_KEYS:readonly ClaimKey[]=['genuine','cursed'];
export const winPct=(lenses:number)=>Math.min(CHALLENGE_CAP,CHALLENGE_PCT+lenses*CHALLENGE_LENS_BONUS);
/** Both amounts come from the appraisal (shop) price, never from the 10% commission. */
export const challengeDiscount=(quote:number,lenses:number)=>Math.floor(quote*winPct(lenses)/100);
export const challengePenalty=(quote:number)=>Math.floor(quote*CHALLENGE_PCT/100);
export const claimText=(key:ClaimKey,value:boolean)=>key==='genuine'?(value?'เป็นของแท้':'เป็นของปลอม'):(value?'มีคำสาป':'ไม่มีคำสาป');
export const CHALLENGE_TOOLS={
  'doubt-lens':{text:`ถือไว้ ท้าทายถูกแล้วลดราคาเพิ่ม +${CHALLENGE_LENS_BONUS} จุดเปอร์เซ็นต์ต่อชิ้น (สูงสุด ${CHALLENGE_CAP}%)`},
  'void-seal':{text:'แนบกับการท้าทาย ถ้าท้าทายผิด ค่าปรับเป็นโมฆะ ใช้แล้วหมดไปเฉพาะเมื่อมีผลยกเลิก'},
} as const;
