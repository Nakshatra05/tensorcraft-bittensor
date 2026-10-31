import test from 'node:test';
import assert from 'node:assert/strict';
import { generateChutes } from '../chutes.js';
import { demoBuild } from '../demo.js';
test('Chutes uses server credential and reports actual response provenance', async()=>{
  process.env.CHUTES_API_KEY='test-only';
  const result=await generateChutes({system:'system',prompt:'tower',fetchImpl:async(url,opts)=>{
    assert.equal(url,'https://llm.chutes.ai/v1/chat/completions');
    assert.equal(opts.headers.Authorization,'Bearer test-only');
    return {ok:true,json:async()=>({id:'receipt-1',model:'test-model',choices:[{message:{content:'{"message":"Built","actions":[{"do":"build"}]}'}}],usage:{prompt_tokens:10,completion_tokens:20}})};
  }});
  assert.equal(result.inference.subnet,64); assert.equal(result.inference.requestId,'receipt-1'); assert.equal(result.inference.verifiedResponse,true);
});
test('zero credits does not silently pretend a demo is live',async()=>{
  await assert.rejects(generateChutes({system:'s',prompt:'p',fetchImpl:async()=>({ok:false,status:402})}),/credits are exhausted/);
});
test('malformed plans are rejected',async()=>{
  await assert.rejects(generateChutes({system:'s',prompt:'p',fetchImpl:async()=>({ok:true,json:async()=>({choices:[{message:{content:'{"actions":[null]}'}}]})})}),/invalid action plan/);
});
test('demo themes generate distinct, explicitly labeled plans',()=>{
  const plans=['tower','bridge','garden','cabin'].map(demoBuild);
  assert.equal(new Set(plans.map(x=>JSON.stringify(x.actions))).size,4);
  for(const plan of plans) { assert.equal(plan.inference.verifiedResponse,false); assert.ok(plan.actions[0].ops.length>20); }
});

