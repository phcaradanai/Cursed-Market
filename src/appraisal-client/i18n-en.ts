import { EN_MODEL } from './en/model.js';
import { EN_UI_TEXT } from './en/ui.js';

/** Every English UI string, keyed by its Thai source text. Missing keys fall back to Thai in t(). */
export const EN_UI: Record<string, string> = { ...EN_UI_TEXT, ...EN_MODEL };
