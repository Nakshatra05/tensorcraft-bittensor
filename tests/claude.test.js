import test from 'node:test';
import assert from 'node:assert/strict';
import {generateClaude} from '../claude.js';
test('Claude provenance never claims Bittensor inference',async()=>{
 process.env.ANTHROPIC_API_KEY='test-only';
 const out=await generateClaude({system:'s',prompt:'p',fetchImpl:async(url,options)=>{
  assert.equal(url,'https://api.anthropic.com/v1/messages');
  assert.equal(JSON.parse(options.body).max_tokens,4096);
  return {ok:true,json:async()=>({id:'test-receipt',model:'test-model',content:[{type:'tool_use',name:'act',input:{message:'done',actions:[{do:'build',ops:[]}]}}]})};
 }});
 assert.equal(out.inference.provider,'anthropic');assert.equal(out.inference.subnet,null);assert.equal(out.inference.verifiedResponse,true);
});
test('truncated tool output is rejected',async()=>{
 await assert.rejects(generateClaude({system:'s',prompt:'p',fetchImpl:async()=>({ok:true,json:async()=>({stop_reason:'max_tokens',content:[]})})}),/incomplete build plan/);
});
