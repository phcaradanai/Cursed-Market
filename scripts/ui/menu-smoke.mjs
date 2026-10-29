import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { checkGeometry, close } from './contracts.mjs';
// Public preview only: exercise real UI handlers, never a live multiplayer room.
export async function run({ task, page, repo, baseUrl }) {
    const report = { taskSpaceId: task.spaceId, startedAt: new Date().toISOString(), checks: [] };
    const menus = [['กระเป๋า', 'กระเป๋า'], ['สถานะ', 'สถานะ'], ['Dark Market', 'ตลาดมืด'], ['สมุดบันทึก', 'บันทึก'], ['กติกา', 'กติกา'], ['ตั้งค่า', 'ตั้งค่า']];
    for (const [width, height] of [[1024, 800], [1440, 722], [1920, 800]]) {
        await page.cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
        await page.goto(`${baseUrl}/?preview=trade`);
        await page.waitForSelector('.table-good');
        await page.evaluate(() => document.querySelector('.table-goods>.comic-tooltip-anchor:nth-child(2)>.table-good').click());
        await page.waitForSelector('.item-sale-panel');
        const initialContext = await page.evaluate(() => ({ seconds: Number(document.querySelector('.countdown').textContent.match(/\d+/)[0]), title: document.querySelector('dialog[open] h2').textContent }));
        const initial = initialContext.seconds;
        assert(initial > 0, 'fresh preview must have a running clock');
        for (const [label, heading] of menus) {
            await page.evaluate(label => document.querySelector(`button[aria-label="${label}"]`).click(), label);
            await page.waitForFunction(heading => [...document.querySelectorAll('dialog[open] h2')].some(e => e.textContent.includes(heading)), heading);
            await page.waitForFunction(() => document.fonts.status === 'loaded' && [...document.images].filter(e => e.getClientRects().length).every(e => e.complete && e.naturalWidth > 0));
            const metrics = await page.evaluate(() => {
                const box = document.querySelector('dialog[open]'), header = box.querySelector('.drawer-head'), rect = box.getBoundingClientRect(), style = getComputedStyle(header);
                return { imagesReady: [...document.images].filter(e => e.getClientRects().length).every(e => e.complete && e.naturalWidth > 0), viewport: [innerWidth, innerHeight], page: [document.documentElement.scrollWidth, document.documentElement.scrollHeight], frame: [rect.x, rect.y, rect.width, rect.height], header: { height: header.getBoundingClientRect().height, border: style.borderBottomWidth }, padding: [style.paddingTop, style.paddingRight, style.paddingBottom, style.paddingLeft], buttons: [...header.querySelectorAll('button')].map(e => ({ height: e.getBoundingClientRect().height, radius: getComputedStyle(e).borderRadius })), dialogs: document.querySelectorAll('dialog[open]').length };
            });
            checkGeometry(metrics);
            assert.equal(metrics.dialogs, 1, 'only the selected utility should be visible');
            assert.deepEqual(metrics.padding, ['12px', '18px', '12px', '18px']);
            for (const button of metrics.buttons) {
                close(button.height, 40, 'header action height');
                assert.equal(button.radius, '10px', 'shared control radius');
            }
            // The same dock button closes its utility and resumes the original sale detail.
            await page.evaluate(label => document.querySelector(`button[aria-label="${label}"]`).click(), label);
            await page.waitForFunction(() => { const e = document.querySelector('.item-sale-panel'); return !!e?.getClientRects().length && getComputedStyle(e).visibility !== 'hidden'; });
            assert.equal(await page.evaluate(() => document.querySelector('dialog[open] h2').textContent), initialContext.title, 'utility navigation must preserve the chosen item');
            report.checks.push({ width, height, menu: label, metrics });
            console.log(`${width} ${label} PASS`);
        }
        const remaining = await page.evaluate(() => Number(document.querySelector('.countdown').textContent.match(/\d+/)[0]));
        assert(remaining <= initial, 'read-only menu navigation must not reset the countdown');
    }
    report.finishedAt = new Date().toISOString();
    report.passed = true;
    const out = path.join(repo, 'docs/ui-system/runs/latest');
    await fs.mkdir(out, { recursive: true });
    await fs.writeFile(path.join(out, 'menu-smoke.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(`PASS: ${report.checks.length} real menu open/close flows, equal frames/header padding/actions/radius, no scrolling or countdown reset`);
    return report;
}
