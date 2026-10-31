export default function handler(req, res) {
  const live = process.env.HOSTED_LIVE_AI === '1';
  res.status(200).json({ provider: live ? 'chutes' : 'demo', model: live ? process.env.CHUTES_MODEL || 'deepseek-ai/DeepSeek-V4-Flash-0731-TEE' : 'deterministic-builds', mock: !live, demo: !live, budgetUsd: 0, spentUsd: 0, online: 0, agents: 0, currency: 'CraftCoin', deployment: 'single-player', integration: { network: 'Bittensor', subnet: 64, configured: !!process.env.CHUTES_API_KEY, verifiedResponse: false } });
}
