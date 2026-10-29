import type {NpcId} from '../game/appraisal/types.js';

// Alpha >=32 bounds of idle art; anchorX aligns the head, not wide sleeves or ornaments.
export const MERCHANT_PORTRAIT_FRAMES={
  "orc": {
    "width": 1374,
    "height": 1145,
    "bounds": [
      19,
      9,
      1358,
      1139
    ],
    "anchorX": 730
  },
  "vampire": {
    "width": 1145,
    "height": 1374,
    "bounds": [
      3,
      6,
      1145,
      1374
    ],
    "anchorX": 615
  },
  "autometa": {
    "width": 1145,
    "height": 1374,
    "bounds": [
      3,
      8,
      1145,
      1374
    ],
    "anchorX": 535
  },
  "alien": {
    "width": 1287,
    "height": 1222,
    "bounds": [
      28,
      0,
      1265,
      1222
    ],
    "anchorX": 735
  },
  "darkone": {
    "width": 1326,
    "height": 1187,
    "bounds": [
      7,
      0,
      1326,
      1187
    ],
    "anchorX": 790
  },
  "beast": {
    "width": 1213,
    "height": 1296,
    "bounds": [
      11,
      1,
      1212,
      1296
    ],
    "anchorX": 750
  },
  "deepsea": {
    "width": 1323,
    "height": 1189,
    "bounds": [
      4,
      2,
      1319,
      1189
    ],
    "anchorX": 740
  },
  "swarm": {
    "width": 1199,
    "height": 1312,
    "bounds": [
      12,
      9,
      1184,
      1312
    ],
    "anchorX": 650
  }
} as const satisfies Record<NpcId,{width:number;height:number;bounds:readonly [number,number,number,number];anchorX:number}>;
