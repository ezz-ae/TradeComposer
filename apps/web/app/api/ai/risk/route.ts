
import { NextRequest } from 'next/server';
import { getGemini } from '@/app/lib/ai/geminiClient';
import { riskPrompt } from '@/app/lib/ai/schemas';

export async function POST(req: NextRequest){
  const body = await req.json();
  const { risk=[], scope={} } = body || {};
  const gem = getGemini();
  const prompt = riskPrompt(risk, scope);
  const text = await gem.generate(prompt);
  let json:any = null;
  try { json = JSON.parse(text); } catch { json = { summary: text, flags: [], adjust: [] }; }
  return new Response(JSON.stringify({ model: gem.model, enabled: gem.enabled, critique: json }), { headers: { 'Content-Type': 'application/json' } });
}
