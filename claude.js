export async function generateClaude({system,prompt,context='',model=process.env.CLAUDE_MODEL || 'claude-sonnet-5-5',fetchImpl=fetch}) {
  if(!process.env.ANTHROPIC_API_KEY) throw new Error('Claude is not configured on the server.');
  const started=Date.now();
  const r=await fetchImpl('https://api.anthropic.com/v1/messages',{
    method:'POST',signal:AbortSignal.timeout(90000),
    headers:{'x-api-key':process.env.ANTHROPIC_API_KEY,'anthropic-version':'2023-06-01','content-type':'application/json'},
    body:JSON.stringify({model,max_tokens:4096,system:system+'\nCall the act tool exactly once. Keep builds compact. Use geometric build ops instead of hundreds of individual blocks.',messages:[{role:'user',content:context+'\n\n'+prompt}],
      tools:[{name:'act',description:'Return a voxel world build plan.',input_schema:{type:'object',properties:{message:{type:'string'},actions:{type:'array',items:{type:'object'}},note:{type:'string'}},required:['message','actions']}}],tool_choice:{type:'auto'}})
  });
  if(!r.ok) { const e=new Error(r.status===401?'Claude rejected the server API key.':r.status===429?'Claude is rate limited. Try again shortly.':`Claude request failed (HTTP ${r.status}).`);e.status=r.status;throw e; }
  const j=await r.json();
  const plan=j.content?.find(b=>b.type==='tool_use' && b.name==='act')?.input;
  if(j.stop_reason==='max_tokens' || !Array.isArray(plan?.actions) || plan.actions.length>500 || plan.actions.some(a=>!a || typeof a.do!=='string')) throw new Error('Claude returned an incomplete build plan. Try a smaller build.');
  return {message:String(plan.message || ''),actions:plan.actions,note:String(plan.note || ''),usage:j.usage,
    inference:{provider:'anthropic',network:null,subnet:null,model:j.model || model,requestId:j.id || null,latencyMs:Date.now()-started,verifiedResponse:true}};
}

