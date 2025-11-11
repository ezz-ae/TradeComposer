
import { NextRequest } from 'next/server';
import { getGemini } from '@/app/lib/ai/geminiClient';
import { reasonPrompt } from '@/app/lib/ai/schemas';

export async function POST(req: NextRequest){
  const body = await req.json();
  const { symbol='BTCUSD', mode='force', plan={}, risk=[], scope={}, frameIndex=0 } = body || {};
  const gem = getGemini();
  const prompt = reasonPrompt(symbol, mode, plan, risk, scope, frameIndex);
  const text = await gem.generate(prompt);
  return new Response(JSON.stringify({ model: gem.model, enabled: gem.enabled, reason: text.trim().replace(/^"|"$/g,'') }), { headers: { 'Content-Type': 'application/json' } });
}
