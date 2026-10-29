import { useSyncExternalStore } from 'react';
import { EN_UI } from './i18n-en.js';

/**
 * Two languages for the table UI. The Thai source string is the lookup key, so Thai (the default)
 * never changes and every missing English entry falls back to Thai rather than breaking the screen.
 */
export type Lang = 'th' | 'en';
export const LANGS: Lang[] = ['th', 'en'];
export const LANG_LABEL: Record<Lang, string> = { th: 'ไทย', en: 'English' };
const STORAGE_KEY = 'cursed-market:lang';

let current: Lang = 'th';
const listeners = new Set<() => void>();

function readSaved(): Lang | undefined {
  try {
    const saved = globalThis.localStorage?.getItem(STORAGE_KEY);
    return saved === 'en' || saved === 'th' ? saved : undefined;
  } catch { return undefined; }
}
const saved = readSaved();
if (saved) current = saved;
if (typeof document !== 'undefined') document.documentElement.lang = current;

export const getLang = (): Lang => current;

export function setLang(lang: Lang): void {
  if (lang === current) return;
  current = lang;
  try { globalThis.localStorage?.setItem(STORAGE_KEY, lang); } catch { /* private window or blocked storage: keep it for this page only */ }
  if (typeof document !== 'undefined') document.documentElement.lang = lang;
  listeners.forEach(listener => listener());
}

export function subscribeLang(listener: () => void): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

/** Re-renders a component when the language changes. Server rendering always uses Thai. */
export function useLang(): Lang {
  return useSyncExternalStore(subscribeLang, getLang, () => 'th' as Lang);
}

/** Translate a UI string. `{name}` placeholders are filled from `vars` in either language. */
export function t(text: string, vars?: Record<string, string | number | null | undefined>): string {
  const out = current === 'en' ? (EN_UI[text] ?? text) : text;
  return vars ? out.replace(/\{(\w+)\}/g, (match: string, key: string) => (key in vars ? String(vars[key] ?? '') : match)) : out;
}

/** Pick the language-specific value of a catalog entry. */
export function pick<T>(th: T, en: T | undefined): T {
  return current === 'en' && en !== undefined ? en : th;
}
