import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { checkGeometry } from './contracts.mjs';
import { comparePng, scaleMasks } from './png.mjs';
export async function captureStable(capture, masks) {
    let previous, diagnostic;
    for(let at=0;at<10;at++) {
        const current=await capture();
        if(previous) {
            const pixels=comparePng(previous,current,masks);
            if(pixels.changed===0)return current;
            diagnostic={before:previous,after:current,pixels};
        }
        previous=current;
    }
    const error=new Error('render did not settle in ten captures');
    error.captureDiagnostic=diagnostic;
    throw error;
}
const screenIds={inventory:'M01',status:'M02',market:'M03',ledger:'M04',rules:'M05',settings:'M06',trade:'S06','item-sale':'S06'};
const cases = ['inventory', 'status', 'market', 'ledger', 'rules', 'settings', 'trade', 'item-sale'];
export async function run({ task, page, repo, baseUrl, mode = 'compare', viewports = [[1440, 722], [1024, 800], [1920, 800]] }) {
    const baselineDir = path.join(repo, 'docs/ui-system/baselines'), out = path.join(repo, 'docs/ui-system/runs/latest');
    await fs.mkdir(out, { recursive: true });
    let manifest = { schema: 1, approval: 'candidate; confirmed layout contracts only, pixel review pending', references: [], entries: [] };
    if (mode === 'record') {
        const existing = await fs.readFile(path.join(baselineDir, 'manifest.json'), 'utf8').catch(error => { if(error.code==='ENOENT')return null; throw error; });
        assert(!existing || JSON.parse(existing).approvalEvidence?.status !== 'approved', 'Baseline is user-approved: record cannot overwrite it. Compare actuals and obtain a new review before promotion.');
    }
    if (mode === 'compare')
        manifest = JSON.parse(await fs.readFile(path.join(baselineDir, 'manifest.json'), 'utf8'));
    const report = { mode, startedAt: new Date().toISOString(), baseUrl, taskSpaceId: task.spaceId, checks: [], failures: [], readiness:{maxSamples:10,paintFramesBetweenSamples:2,referenceComparisonsPerCase:1} };
    for (const [width, height] of viewports)
        for (const name of width === 1440 ? cases : ['inventory', 'status', 'item-sale']) {
            const id = `${name}-${width}x${height}`, evidence = {screenId:screenIds[name]};
            try {
                await page.cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
                await page.cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
                await page.cdp('Page.bringToFront');
                await page.goto(`${baseUrl}/?preview=${name === 'item-sale' ? 'trade' : name}`);
                await page.waitForFunction(kind => !!document.querySelector(kind === 'trade' || kind === 'item-sale' ? '.trade-table' : 'dialog[open]'), name);
                if (name === 'item-sale')
                    await page.evaluate(() => document.querySelector('.table-goods>.comic-tooltip-anchor:nth-child(2)>.table-good').click());
                await page.waitForFunction(() => document.fonts.status === 'loaded' && [...document.images].filter(e => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden').every(e => e.complete && e.naturalWidth > 0));
                await page.evaluate(() => Promise.all(document.getAnimations().filter(a => a.effect?.getComputedTiming().iterations !== Infinity).map(a => a.finish?.())));
                // Image completeness precedes decoded/composited artwork; capture only after both frames settle.
                await page.evaluate(async () => { await Promise.all([...document.images].filter(e => e.getClientRects().length).map(e => e.decode())); await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); });
                const metrics = await page.evaluate(() => {
                    const q = s => document.querySelector(s), r = e => e.getBoundingClientRect(), rect = e => { const a = r(e); return [a.x, a.y, a.width, a.height]; }, centre = e => { const a = r(e); return a.x + a.width / 2; }, box = q('dialog[open]') ?? q('.trade-table'), sale = q('.item-sale-panel');
                    const data = { viewport: [innerWidth, innerHeight], page: [document.documentElement.scrollWidth, document.documentElement.scrollHeight], frame: rect(box), imagesReady: [...document.images].filter(e => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden').every(e => e.complete && e.naturalWidth > 0), masks: [q('.countdown')].filter(Boolean).map(e => { const a = r(e); return { x: Math.floor(a.x) - 2, y: Math.floor(a.y) - 2, width: Math.ceil(a.width) + 4, height: Math.ceil(a.height) + 4 }; }), environment: { userAgent: navigator.userAgent, dpr: devicePixelRatio }, renderState: { visibility:document.visibilityState,focused:document.hasFocus(),scale:visualViewport?.scale,art:[...document.images].filter(e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden').map(e=>({src:e.currentSrc,rect:rect(e),natural:[e.naturalWidth,e.naturalHeight],filter:getComputedStyle(e).filter,transform:getComputedStyle(e).transform})) }, header: box.querySelector('.drawer-head') ? { height: r(box.querySelector('.drawer-head')).height, border: getComputedStyle(box.querySelector('.drawer-head')).borderBottomWidth } : null };
                    if (sale) {
                        const [minus, input, plus] = [q('.comic-sale-stepper button:first-child'), q('.comic-sale-stepper input'), q('.comic-sale-stepper button:last-child')], a = r(minus), b = r(input), c = r(plus);
                        Object.assign(data, { columnWidths: [...sale.children].map(e => r(e).width), overflow: [sale.scrollWidth - sale.clientWidth, sale.scrollHeight - sale.clientHeight], actionWidths: [...document.querySelectorAll('.comic-sale-actions button')].map(e => r(e).width), stepperCentre: centre(q('.comic-sale-stepper')), actionsCentre: centre(q('.comic-sale-actions')), inputCentre: centre(input), stepperGaps: [b.left - a.right, c.left - b.right], stepperWidths: [a.width, c.width], stepperHeights: [a.height, b.height, c.height], knownFacts: [...document.querySelectorAll('.item-sale-visual .seal strong')].map(e => e.textContent), saleDisabled: q('.comic-sale-actions button').disabled, rebateDisabled: input.disabled });
                    }
                    return data;
                });
                evidence.metrics = metrics;
                checkGeometry(metrics, { sale: name === 'item-sale' });
                const file = `${id}.png`, actual = path.join(out, file);
                const bytes = await captureStable(async () => {
                    // Separate samples by actual paints; reference comparison remains a single later step.
                    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
                    let shot; for (let attempt = 0; attempt < 3; attempt++) {
                    try {
                        shot = await page.cdp('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false, optimizeForSpeed: true });
                        break;
                    }
                    catch (error) {
                        if (attempt === 2 || !String(error).includes('captureScreenshot'))
                            throw error;
                    }
                } return Buffer.from(shot.data, 'base64'); }, scaleMasks(metrics.masks, metrics.environment.dpr));
                await fs.writeFile(actual, bytes);
                Object.assign(evidence, { actual: path.relative(repo, actual), sha256: crypto.createHash('sha256').update(bytes).digest('hex') });
                assert.equal(bytes.readUInt32BE(16), width * metrics.environment.dpr, 'capture/viewport width mismatch');
                assert.equal(bytes.readUInt32BE(20), height * metrics.environment.dpr, 'capture/viewport height mismatch');
                let pixels;
                if (mode === 'record') {
                    await fs.mkdir(baselineDir, { recursive: true });
                    manifest.entries.push({ id, screenId:screenIds[name], file, metrics, sha256: crypto.createHash('sha256').update(bytes).digest('hex') });
                }
                else {
                    const entry = manifest.entries.find(e => e.id === id);
                    assert(entry, `missing baseline ${id}`);
                    const expected = await fs.readFile(path.join(baselineDir, entry.file));
                    assert.equal(crypto.createHash('sha256').update(expected).digest('hex'), entry.sha256, 'baseline changed outside review');
                    assert.deepEqual(metrics.environment, entry.metrics.environment, 'browser/DPR changed; review baseline in matching environment');
                    pixels = comparePng(expected, bytes, scaleMasks([...entry.metrics.masks, ...metrics.masks], metrics.environment.dpr));
                    evidence.pixels = pixels;
                    assert(pixels.ratio <= .001, `visual drift ${(pixels.ratio * 100).toFixed(3)}%; review actual vs baseline, never auto-update`);
                }
                report.checks.push({ id, screenId:screenIds[name], passed: true, metrics, pixels });
                console.log(id + ' PASS');
            }
            catch (error) {
                if(error.captureDiagnostic) {
                    const before=path.join(out,`${id}-unstable-before.png`),after=path.join(out,`${id}-unstable-after.png`);
                    await fs.writeFile(before,error.captureDiagnostic.before);await fs.writeFile(after,error.captureDiagnostic.after);
                    evidence.captureStability={before:path.relative(repo,before),after:path.relative(repo,after),pixels:error.captureDiagnostic.pixels};
                }
                report.failures.push({ id, error: String(error.message ?? error), ...evidence });
            }
        }
    if (mode === 'record' && report.failures.length === 0) {
        for (const e of manifest.entries)
            await fs.copyFile(path.join(out, e.file), path.join(baselineDir, e.file));
        manifest.references = ['inventory is the confirmed frame/control reference', '2026-10-29 user: one game, same existing style; equal spacing and centred stepper'];
        await fs.writeFile(path.join(baselineDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
    }
    report.finishedAt = new Date().toISOString();
    report.passed = report.failures.length === 0;
    await fs.writeFile(path.join(out, `${mode}.json`), JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify({ mode, passed: report.checks.length, failures: report.failures, approval: manifest.approval }));
    if (!report.passed)
        throw Error('UI suite failed; see docs/ui-system/runs/latest/' + mode + '.json');
    return report;
}
