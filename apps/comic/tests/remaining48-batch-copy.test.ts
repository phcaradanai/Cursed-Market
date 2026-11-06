import test from 'node:test';
import assert from 'node:assert/strict';
import {passiveText} from '../src/appraisal-client/catalog-text.js';

test('revision13 held-effect descriptions are gated and explain the correct trigger/cap',()=>{
 for(const kind of ['darkone-debt-chain','vampire-shadow-wine-decanter','alien-spore-lantern','darkone-omen-censer'] as const){
  assert.equal(passiveText(kind,true,{nativeEffectReady:false}),'');
  assert.notEqual(passiveText(kind,true,{nativeEffectReady:true}),'');
 }
 assert.match(passiveText('darkone-debt-chain',true,{nativeEffectReady:true}),/คืนเงินกู้ที่ครบอายุ/);
 assert.match(passiveText('darkone-debt-chain',true,{nativeEffectReady:true}),/4 ต่อเกม/);
 assert.match(passiveText('vampire-shadow-wine-decanter',true,{nativeEffectReady:true}),/อย่างน้อย 1 ชีวิต/);
 assert.match(passiveText('alien-spore-lantern',true,{nativeEffectReady:true}),/เพดานร่วม 20%/);
 assert.match(passiveText('darkone-omen-censer',true,{nativeEffectReady:true}),/ไม่ทอยซ้ำ/);
 assert.doesNotMatch(passiveText('alien-spore-lantern',true,{nativeEffectReady:true}),/สูงสุด 5 ชิ้นต่อชนิด/);
});
