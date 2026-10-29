import assert from 'node:assert/strict';
export const close = (a, b, label, tolerance = .6) => assert(Math.abs(a - b) <= tolerance, `${label}: ${a} != ${b}`);
export function checkGeometry(m, { frame = true, sale = false } = {}) {
    assert(m.imagesReady, 'visible images must load');
    assert(m.page[0] <= m.viewport[0] && m.page[1] <= m.viewport[1], 'page overflow');
    if (frame) {
        const [w, h] = m.viewport;
        const side = w <= 760 ? 6 : 24;
        const width = Math.min(w - side * 2, 1480);
        const x = (w - width) / 2;
        const top = w <= 760 ? 6 : 60;
        const bottom = 100;
        [x, top, width, h - top - bottom].forEach((v, i) => close(m.frame[i], v, `frame[${i}]`));
    }
    if (m.header) {
        close(m.header.height, m.viewport[0] <= 760 ? 53 : 65, 'shared header height');
        assert.equal(m.header.border, '1px', 'header border');
    }
    if (sale) {
        close(...m.columnWidths, 'equal columns');
        assert(m.overflow.every(n => n === 0), 'sale overflow');
        close(...m.actionWidths, 'paired action widths');
        close(m.stepperCentre, m.actionsCentre, 'stepper/action centre');
        close(m.inputCentre, m.actionsCentre, 'input/action centre');
        close(...m.stepperGaps, 'stepper gaps');
        close(...m.stepperWidths, 'minus/plus widths');
        assert(m.stepperHeights.every(h => Math.abs(h - 40) < .6), 'stepper heights');
        assert(m.knownFacts.every(v => v === '?'), 'unknown facts leaked');
        assert(m.saleDisabled && m.rebateDisabled, 'unappraised item must stay blocked');
    }
    return true;
}
