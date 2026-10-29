import { phaseLabel } from '../model.js';
import type { AppraisalPhase } from '../../game/appraisal/types.js';
import { getLang, t } from '../i18n.js';

const THAI_DIGITS = '๐๑๒๓๔๕๖๗๘๙';
const ROMAN: [number, string][] = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
function roman(n: number): string {
  let out = '';
  for (const [value, mark] of ROMAN) while (n >= value) { out += mark; n -= value; }
  return out;
}
export const chapterNumber = (n: number): string => getLang() === 'en' ? roman(n) : String(n).replace(/\d/g, d => THAI_DIGITS[Number(d)]!);

/**
 * A chapter heading that passes over the table when the phase changes, like turning a page.
 * It never blocks input (timed phases keep counting underneath) and is hidden from screen readers,
 * which already hear the phase through the table's status line.
 */
export function Chapter({ phase, encounter }: { phase: AppraisalPhase; encounter: number }) {
  return <div className="chapter" aria-hidden="true">
    <span className="chapter-title"><span className="chapter-number">{t('บทที่ {n}', { n: chapterNumber(encounter) })}</span>{phaseLabel(phase)}</span>
  </div>;
}
