import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {startTracking, trackingView, guessTracking} from '../src/game/appraisal/ghost-tracking.js';

test('tracking keeps answer private, rejects invalid guesses, permits retries and unlocks on success',()=>{
 const state=startTracking([2,0,3,1],0);
 assert.deepEqual(trackingView(state),{status:'guessing',initialPosition:0});
 assert.throws(()=>guessTracking(state,4));
 assert.equal(guessTracking(state,0).status,'failed');
 const retry=startTracking([1,3,0,2],0);
 assert.equal(guessTracking(retry,2).status,'available');
 assert.throws(()=>guessTracking(guessTracking(retry,2),2));
});

test('tracking validates every permutation boundary without mutating the server round',()=>{
 for(const order of [[0,0,2,3],[0,1,2],[0,1,2,4],[0,1,2,3.5]]) assert.throws(()=>startTracking(order,0));
 for(const initial of [-1,4,NaN,0.5]) assert.throws(()=>startTracking([0,1,2,3],initial));
 const state=startTracking([3,2,1,0],1),before=structuredClone(state);
 for(const guess of [-1,4,NaN,Infinity,0.5]) assert.throws(()=>guessTracking(state,guess));
 assert.deepEqual(state,before);
 assert.equal(guessTracking(state,2).status,'available');
 assert.deepEqual(state,before);
});
