import type { NpcId } from '../../game/appraisal/types.js';

/**
 * Painted 2.5D layers. Each scene is a few depth plates; the merchants are cut-outs that stand inside
 * the gates and behind the appraisal counter. Provenance for every file is in docs/art/stage-2.5d/.
 */
export const SCENE = {
  hall: { backdrop: '/art/scenes/hall/backdrop.webp', foreground: '/art/scenes/hall/foreground.webp' },
  appraisal: { backdrop: '/art/scenes/appraisal/backdrop.webp', foreground: '/art/scenes/appraisal/foreground.webp' },
  market: { backdrop: '/art/scenes/market/backdrop.webp', foreground: '/art/scenes/market/foreground.webp' },
  entry: { backdrop: '/art/scenes/entry/backdrop.webp', foreground: '/art/scenes/hall/foreground.webp' },
  lobby: { backdrop: '/art/scenes/lobby/backdrop.webp', foreground: '/art/scenes/hall/foreground.webp' },
  reveal: { backdrop: '/art/scenes/reveal/backdrop.webp', foreground: '/art/scenes/appraisal/foreground.webp' },
  collector: { backdrop: '/art/scenes/collector/backdrop.webp', foreground: '/art/scenes/hall/foreground.webp' },
} as const;
export type SceneId = keyof typeof SCENE;

/** Which painted scene stands behind each phase. */
const SCENE_BY_VIEW: Record<string, SceneId> = { entry: 'entry', lobby: 'lobby', PORTALS: 'hall', APPRAISAL: 'appraisal', TRADE: 'market', REVEAL: 'reveal', RESULTS: 'collector' };
export const sceneFor = (view: string): SceneId => SCENE_BY_VIEW[view] ?? 'hall';

export const GATE = {
  arch: '/art/scenes/hall/arch.webp',
  room: '/art/scenes/hall/gate-room.webp',
  /** Alpha mask of the arch's opening, traced from the arch image itself. */
  opening: '/art/scenes/hall/arch-opening.webp',
};

export const merchantFigure = (npc: NpcId): string => `/art/merchants/${npc}.webp`;
