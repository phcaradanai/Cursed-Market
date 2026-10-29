import { useEffect, useRef, useState } from 'react';
import type { WorldState } from './state.js';
import { Stage } from './Stage.js';

type Embers = { heat(hot: boolean): void; dispose(): void };

/**
 * The world behind the table: the painted 2.5D hall (plain DOM layers) plus one small WebGL canvas
 * for embers. Three.js loads lazily in the browser only, so the table paints first and server
 * rendering never touches WebGL. Without WebGL the painted hall still shows.
 */
export function World({ state }: { state: WorldState }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const embers = useRef<Embers | null>(null);
  const [ready, setReady] = useState(false);
  const hot = state.caught || state.lowLife;
  useEffect(() => {
    let disposed = false;
    import('./embers.js').then(({ createEmbers }) => {
      if (disposed || !canvas.current) return;
      try {
        embers.current = createEmbers(canvas.current);
        setReady(true);
      } catch { /* no WebGL here: the painted hall is enough */ }
    }).catch(() => { /* chunk failed to load: the painted hall is enough */ });
    return () => { disposed = true; embers.current?.dispose(); embers.current = null; };
  }, []);
  useEffect(() => { embers.current?.heat(hot); }, [hot, ready]);
  return <><Stage state={state}/><canvas ref={canvas} className={`embers${ready ? ' ready' : ''}`} aria-hidden="true"/></>;
}
