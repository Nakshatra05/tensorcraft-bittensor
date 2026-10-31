import fs from 'node:fs';
import { generateChutes } from '../chutes.js';
import { generateClaude } from '../claude.js';
import { demoBuild } from '../demo.js';
import { authorized } from './check.js';
export default async function handler(req, res) {
  if(req.method !== 'POST') return res.status(405).json({error:'POST required'});
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  if(typeof body.prompt !== 'string' || !body.prompt.trim() || body.prompt.length>2000) return res.status(400).json({error:'Provide a prompt of 1–2000 characters.'});
  if(process.env.HOSTED_LIVE_AI !== '1') return res.status(200).json({...demoBuild(body.prompt), mock:true, demo:true, provider:'demo'});
  if(!authorized(req)) return res.status(401).json({error:'Enter the host password to use live inference.'});
  try {
    const provider = process.env.PROVIDER === 'anthropic' ? 'anthropic' : 'chutes';
    const generate = provider === 'anthropic' ? generateClaude : generateChutes;
    const out = await generate({system:fs.readFileSync(new URL('../prompt.md',import.meta.url),'utf8'),prompt:body.prompt,context:String(body.context || '').slice(0,24000)});
    return res.status(200).json({...out,provider,mock:false});
  } catch(e) { return res.status(e.status===402?402:e.status===429?429:502).json({error:e.message,mock:false}); }
}
