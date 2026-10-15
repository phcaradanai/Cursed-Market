import type { AppraisalPhase, StatusId } from './types.js';

/** Data-driven events added in the polish pass; the engine, the UI quote and the tests all read this one table. */
export interface PolishEvent {
  phase:AppraisalPhase; credits?:number; energy?:number; reward?:number; grant:StatusId[];
  /** Offered only when none of these statuses is active, so a choice is never a no-op. */
  avoid:StatusId[]; needsAuctions?:boolean;
}
export const POLISH_EVENTS:Record<string,PolishEvent>={
  E94:{phase:'APPRAISAL',credits:2,grant:['B17'],avoid:['B17','D17']},
  E95:{phase:'APPRAISAL',reward:3,grant:['D17'],avoid:['D17','B17']},
  E96:{phase:'APPRAISAL',energy:1,grant:['B18'],avoid:['B18','D19']},
  E97:{phase:'APPRAISAL',credits:2,grant:['B20'],avoid:['B20'],needsAuctions:true},
  E98:{phase:'APPRAISAL',energy:1,grant:['B19'],avoid:['B19','D20']},
  E99:{phase:'APPRAISAL',reward:4,grant:['D20'],avoid:['D20','B19']},
  E100:{phase:'APPRAISAL',reward:2,grant:['D18'],avoid:['D18']},
  E101:{phase:'TRADE',credits:1,grant:['B17','D18'],avoid:['B17','D17','D18']},
};
