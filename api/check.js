import crypto from 'node:crypto';
export const passwordRequired = () => process.env.HOSTED_REQUIRE_PASSWORD === '1';
export const authorized = req => {
  if (!passwordRequired()) return true;
  const digest = s => crypto.createHash('sha256').update(String(s || '')).digest();
  return !!process.env.GAME_PASSWORD && crypto.timingSafeEqual(digest(req.headers['x-game-password']), digest(process.env.GAME_PASSWORD));
};
export default function handler(req, res) {
  const ok = process.env.HOSTED_LIVE_AI !== '1' || authorized(req);
  res.status(ok ? 200 : 401).json(ok ? { ok: true } : { error: 'Enter the host password to use live inference.' });
}
