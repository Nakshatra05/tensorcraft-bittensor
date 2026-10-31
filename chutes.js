// Chutes is a Bittensor Subnet 64 inference service. Credentials stay server-side.
export async function generateChutes({ system, prompt, context = '', model = process.env.CHUTES_MODEL || 'deepseek-ai/DeepSeek-V4-Flash-0731-TEE', maxTokens = 4096, fetchImpl = fetch }) {
  if (!process.env.CHUTES_API_KEY) throw new Error('Chutes is not configured. Set CHUTES_API_KEY on the server.');
  const start = Date.now();
  const response = await fetchImpl('https://llm.chutes.ai/v1/chat/completions', {
    method: 'POST', signal: AbortSignal.timeout(120000),
    headers: { Authorization: `Bearer ${process.env.CHUTES_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, stream: false, max_tokens: maxTokens, temperature: 0.6,
      messages: [{ role: 'system', content: system + '\nReturn only JSON with message (string), actions (array), and optional note. Never return executable JavaScript.' }, { role: 'user', content: `${context}\n\n${prompt}` }] }),
  });
  if (!response.ok) {
    const error = new Error(response.status === 402 ? 'Chutes credits are exhausted. Add credits to enable live Bittensor inference.' : response.status === 401 || response.status === 403 ? 'Chutes rejected the server API key.' : `Chutes is unavailable (HTTP ${response.status}).`);
    error.status = response.status; throw error;
  }
  const payload = await response.json();
  const raw = payload.choices?.[0]?.message?.content;
  if (typeof raw !== 'string') throw new Error('Chutes returned no build plan.');
  const result = JSON.parse(raw.trim().replace(/^```(?:json)?\s*|\s*```$/g, ''));
  if (!result || !Array.isArray(result.actions) || result.actions.length > 500 || result.actions.some(a => !a || typeof a !== 'object' || typeof a.do !== 'string')) throw new Error('Chutes returned an invalid action plan.');
  return { message: String(result.message || ''), actions: result.actions, note: String(result.note || ''), usage: payload.usage || {},
    inference: { provider: 'chutes', network: 'Bittensor', subnet: 64, model: payload.model || model, requestId: payload.id || null, latencyMs: Date.now() - start, verifiedResponse: true } };
}
