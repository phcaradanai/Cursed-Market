import { useEffect } from 'react';

const TILTABLE = '.portal:not(.closed), .relic-art, .merchant';
const MAX_DEGREES = 6;

/**
 * Card artwork leans toward the pointer in true perspective. Only the picture inside a card moves:
 * the card, its buttons and its hit area stay still, so nothing slides out from under the cursor,
 * and no ancestor of the fixed modal, toasts or peeks is ever transformed.
 * Fine pointers only, and never under reduced motion.
 */
export function useTilt(): void {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    let current: HTMLElement | null = null;
    let frame = 0;
    const release = (element: HTMLElement | null) => {
      if (!element) return;
      element.classList.remove('tilting');
      element.style.removeProperty('--rx');
      element.style.removeProperty('--ry');
    };
    const move = (event: PointerEvent) => {
      if (!fine.matches || still.matches) return;
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>(TILTABLE) : null;
      if (target !== current) { release(current); current = target; }
      if (!target) return;
      const { clientX, clientY } = event;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = target.getBoundingClientRect();
        if (!box.width || !box.height) return;
        const x = Math.min(1, Math.max(0, (clientX - box.left) / box.width));
        const y = Math.min(1, Math.max(0, (clientY - box.top) / box.height));
        target.classList.add('tilting');
        target.style.setProperty('--ry', `${((x - .5) * 2 * MAX_DEGREES).toFixed(2)}deg`);
        target.style.setProperty('--rx', `${((.5 - y) * 2 * MAX_DEGREES).toFixed(2)}deg`);
      });
    };
    const leave = () => { cancelAnimationFrame(frame); release(current); current = null; };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    window.addEventListener('blur', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      window.removeEventListener('blur', leave);
      leave();
    };
  }, []);
}
