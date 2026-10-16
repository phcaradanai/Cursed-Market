import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getLang, setLang, subscribeLang, t, pick, LANGS, LANG_LABEL } from '../src/appraisal-client/i18n.js';
import { EN_UI } from '../src/appraisal-client/i18n-en.js';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { GameTable } from '../src/appraisal-client/App.js';
import { appraisalViewFor } from '../src/game/appraisal/index.js';
import { appraisalFixture } from './support/appraisal-fixture.js';
import type { AppraisalRoomView } from '../src/shared/appraisal-protocol.js';
import type { AppraisalState } from '../src/game/appraisal/types.js';

const THAI = /[฀-๿]/;
const CLIENT_FILES = ['components.tsx', 'App.tsx', 'MarketSale.tsx', 'PortalEventPreview.tsx', 'RoundReward.tsx', 'HeldEffects.tsx', 'NpcContracts.tsx', 'feedback.tsx', 'connection.ts', 'lore.tsx', 'model.ts', 'catalog-text.ts', 'meters.tsx'];
/** Every literal passed to t() in the client, with its escapes resolved. */
function translatedKeys(): Set<string> {
  const keys = new Set<string>();
  const pattern = /(?<![A-Za-z_.])t\((['"])((?:(?!\1)[^\\\n]|\\.)*)\1/g;
  for (const file of CLIENT_FILES) {
    const source = readFileSync(`src/appraisal-client/${file}`, 'utf8');
    for (const match of source.matchAll(pattern)) keys.add(match[2]!.replace(/\\'/g, "'").replace(/\\"/g, '"'));
  }
  return keys;
}

test('language switch: two languages, default Thai, placeholders filled in both', () => {
  assert.deepEqual(LANGS, ['th', 'en']);
  assert.equal(LANG_LABEL.en, 'English');
  setLang('th');
  assert.equal(getLang(), 'th');
  assert.equal(t('ตรวจราคา'), 'ตรวจราคา');
  assert.equal(t('เครดิตไม่พอ ต้องใช้ {need} มี {have}', { need: 5, have: 2 }), 'เครดิตไม่พอ ต้องใช้ 5 มี 2');
  setLang('en');
  try {
    assert.equal(t('ตรวจราคา'), 'Inspect price');
    assert.equal(t('เครดิตไม่พอ ต้องใช้ {need} มี {have}', { need: 5, have: 2 }), 'Not enough credits: need 5, have 2');
    assert.equal(t('ข้อความที่ยังไม่มีคำแปล'), 'ข้อความที่ยังไม่มีคำแปล', 'unknown text falls back to Thai, never blank');
    assert.equal(pick('ไทย', 'English'), 'English');
  } finally {
    setLang('th');
  }
  assert.equal(pick('ไทย', 'English'), 'ไทย');
});

test('language switch notifies subscribers and survives a missing localStorage', () => {
  let calls = 0;
  const unsubscribe = subscribeLang(() => { calls++; });
  setLang('en');
  setLang('en');
  setLang('th');
  unsubscribe();
  setLang('en');
  setLang('th');
  assert.equal(calls, 2, 'one notification per real change while subscribed, none for a repeat or after unsubscribe');
});

test('every translated client string has an English entry', () => {
  const missing = [...translatedKeys()].filter(key => !(key in EN_UI));
  assert.deepEqual(missing, [], `missing English for ${missing.length} keys`);
});

test('English values never carry Thai text, and their placeholders match the Thai source', () => {
  const placeholders = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map(m => m[1]).sort().join(',');
  for (const [key, value] of Object.entries(EN_UI)) {
    assert(!THAI.test(value), `English for "${key}" still has Thai: ${value}`);
    assert.equal(placeholders(value), placeholders(key), `placeholders differ for "${key}"`);
  }
});

function roomOf(state:AppraisalState):AppraisalRoomView {
  return {rulesVersion:'0.5',mode:'classic',code:'ABC234',hostId:'alice',yourSeatId:'alice',seats:state.players.map(p=>({id:p.id,name:p.id==='alice'?'Appraiser One':'Appraiser Two',connected:true,ready:true})),matchSeats:state.players.map(p=>({id:p.id,name:p.id})),playtestMode:'no-voice',matchId:'match-en',deadline:10000,serverTime:1000,revealReady:[],
    game:appraisalViewFor(state,'alice'),timerSettings:undefined} as unknown as AppraisalRoomView;
}
test('English mode renders every phase with no Thai text left in the table (engine notes aside)', () => {
  const ownNotes = new Set<string>();
  for (const phase of ['PORTALS','APPRAISAL','TRADE','REVEAL','RESULTS'] as const) {
    const state = appraisalFixture();
    state.phase = phase;
    const room = roomOf(state);
    for (const note of room.game!.self.notes) ownNotes.add(note);
    setLang('en');
    try {
      const html = renderToStaticMarkup(createElement(GameTable, { room, submit: () => {}, send: () => true, disabled: false }));
      const visible = html.replace(/<[^>]+>/g, ' ');
      const thaiRuns = [...visible.matchAll(/[\u0E00-\u0E7F][^<]*/g)].map(m => m[0].trim()).filter(run => !ownNotes.has(run));
      const unique=[...new Set(thaiRuns)].slice(0,40);
      assert.deepEqual(unique, [], `${phase}: Thai text left in English mode`);
      assert(visible.includes('Collector') || visible.includes('Dark Market'));
    } finally {
      setLang('th');
    }
  }
});

test('the Rules panel follows the room mode', () => {
  const state = appraisalFixture();
  const render = (survival: boolean) => {
    const room = { ...roomOf(state), mode: survival ? 'survival' as const : 'classic' as const };
    setLang('en');
    try {
      return renderToStaticMarkup(createElement(GameTable, { room, submit: () => {}, send: () => true, disabled: false }));
    } finally {
      setLang('th');
    }
  };
  const classic = render(false);
  const survival = render(true);
  assert(classic.includes('Play 3 merchant encounters per journey'), 'classic room shows the classic rules');
  assert(!classic.includes('the Collector then takes the goods and scores'));
  assert(survival.includes('the Collector then takes the goods and scores'), 'survival room shows the survival rules');
  assert(!survival.includes('Play 3 merchant encounters per journey'));
});

/** Every disabled button must say why on hover; a bare disabled button leaves players guessing. */
function bareDisabledButtons(html: string): string[] {
  return [...html.matchAll(/<button\b[^>]*>/g)].map(m => m[0]).filter(tag => /\bdisabled=""/.test(tag) && !/\btitle="/.test(tag));
}
test('every disabled button in every phase and language carries a hover reason', () => {
  const found = new Set<string>();
  for (const lang of ['th', 'en'] as const) for (const phase of ['PORTALS', 'APPRAISAL', 'TRADE', 'REVEAL', 'RESULTS'] as const) for (const locked of [false, true]) {
    const state = appraisalFixture();
    state.phase = phase;
    const room = roomOf(state);
    setLang(lang);
    try {
      const html = renderToStaticMarkup(createElement(GameTable, { room, submit: () => {}, send: () => true, disabled: locked }));
      for (const tag of bareDisabledButtons(html)) found.add(`${lang}/${phase}/${locked ? 'locked' : 'open'}: ${tag.slice(0, 140)}`);
    } finally {
      setLang('th');
    }
  }
  assert.deepEqual([...found].slice(0, 12), [], 'disabled buttons without a title');
});
