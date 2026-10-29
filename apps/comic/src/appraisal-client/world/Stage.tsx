import { useEffect, useRef, useState } from 'react';
import type { WorldState } from './state.js';
import { SCENE, sceneFor } from './art.js';
import type { SceneId } from './art.js';

/** Fetch and decode a scene's plates before it fades in, so the crossfade never shows a half-loaded image. */
function decodeScene(id: SceneId): Promise<void> {
  if (typeof Image === 'undefined') return Promise.resolve();
  const { backdrop, foreground } = SCENE[id];
  return Promise.all([backdrop, foreground].map(src => {
    const image = new Image();
    image.src = src;
    return image.decode().catch(() => undefined);
  })).then(() => undefined);
}

/**
 * The painted scene behind the table, in depth layers. Parallax and the per-phase camera push are CSS
 * transforms on whole layers, so the compositor does all the work: no per-frame layout, no shaders.
 * The pointer loop runs only while the layers are still easing toward the pointer, then stops.
 * Only the current scene and the one fading out are mounted.
 */
export function Stage({ state }: { state: WorldState }) {
  const stage = useRef<HTMLDivElement>(null);
  const wanted = sceneFor(state.view);
  const [scenes, setScenes] = useState<{ current: SceneId; leaving: SceneId | null }>({ current: wanted, leaving: null });
  useEffect(() => {
    if (wanted === scenes.current) return;
    let cancelled = false;
    decodeScene(wanted).then(() => {
      if (cancelled) return;
      setScenes(previous => ({ current: wanted, leaving: previous.current }));
    });
    return () => { cancelled = true; };
  }, [wanted, scenes.current]);
  useEffect(() => {
    if (!scenes.leaving) return;
    const timer = setTimeout(() => setScenes(previous => ({ ...previous, leaving: null })), 900);
    return () => clearTimeout(timer);
  }, [scenes.leaving]);
  useEffect(() => {
    const element = stage.current;
    if (!element || typeof window === 'undefined' || !window.matchMedia) return;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    let x = 0, y = 0, tx = 0, ty = 0, frame = 0;
    const tick = () => {
      x += (tx - x) * .08;
      y += (ty - y) * .08;
      element.style.setProperty('--px', x.toFixed(4));
      element.style.setProperty('--py', y.toFixed(4));
      frame = Math.abs(tx - x) + Math.abs(ty - y) > .001 ? requestAnimationFrame(tick) : 0;
    };
    const move = (event: PointerEvent) => {
      if (still.matches || event.pointerType === 'touch') return;
      tx = event.clientX / window.innerWidth * 2 - 1;
      ty = event.clientY / window.innerHeight * 2 - 1;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(frame); };
  }, []);
  const tense = state.caught || state.lowLife;
  const set = (id: SceneId, leaving: boolean) => <div key={id} className={`stage-set scene-${id}${leaving ? ' leaving' : ''}`}>
    <div className="stage-layer stage-back"><img src={SCENE[id].backdrop} alt="" decoding="async"/></div>
    <div className="stage-glow"/>
    <div className="stage-layer stage-fore"><img src={SCENE[id].foreground} alt="" decoding="async"/></div>
  </div>;
  return <div ref={stage} className={`stage view-${state.view}${state.event ? ' event' : ''}${tense ? ' tense' : ''}`} aria-hidden="true">
    {scenes.leaving && set(scenes.leaving, true)}
    {set(scenes.current, false)}
    <div className="stage-shade"/>
  </div>;
}
