import { passwordRequired } from './check.js';
export default function handler(req, res) {
  const live = process.env.HOSTED_LIVE_AI === '1';
  const provider = process.env.PROVIDER === 'anthropic' ? 'anthropic' : 'chutes';
  const model = provider === 'anthropic' ? process.env.CLAUDE_MODEL || 'claude-sonnet-5-5' : process.env.CHUTES_MODEL || 'deepseek-ai/DeepSeek-V4-Flash-0731-TEE';
  res.status(200).json({ requiresPassword: live && passwordRequired(), provider: live ? provider : 'demo', model: live ? model : 'deterministic-builds', mock: !live, demo: !live, metered: live, online: 0, agents: 0, currency: 'CraftCoin', deployment: 'single-player', integration: { network: 'Bittensor', subnet: 64, configured: !!process.env.CHUTES_API_KEY, verifiedResponse: false } });
}
