
import { NextRequest } from 'next/server';
import { getGemini } from '@/app/lib/ai/geminiClient';
import { planPrompt } from '@/app/lib/ai/schemas';

export async function POST(req: NextRequest){
  const body = await req.json();
  const { symbol='BTCUSD', scope={} } = body || {};
  const gem = getGemini();
  const prompt = planPrompt(symbol, scope);
  const text = await gem.generate(prompt);
  // Best-effort JSON parse with fallback
  let json:any = null;
  try { json = JSON.parse(text); }
  catch { json = { symbol, regime: { trend:'up', vol:'normal', bias:'bullish-pullback' }, levels: [], tasks: [], reason: text }; }
  return new Response(JSON.stringify({ model: gem.model, enabled: gem.enabled, plan: json }), { headers: { 'Content-Type': 'application/json' } });
}
