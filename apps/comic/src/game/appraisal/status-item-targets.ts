import type {StatusId} from './types.js';

export const STATUS_ITEM_TARGETS={
  'effect:E71':['D01','D02','D05','D06','D19','D20','D22','D23'],
  'effect:E72':['B03','B05','B11','B14','B16'],
} satisfies Record<string,StatusId[]>;
