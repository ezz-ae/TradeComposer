
import { NextRequest } from 'next/server';
import { getGemini } from '@/app/lib/ai/geminiClient';
import { planPrompt, reasonPrompt, riskPrompt } from '@/app/lib/ai/schemas';
import { SeePlanZ, RiskCritiqueZ, extractJson, tryParseJSON, validateOrThrow, coerceNumberFields } from '@/app/lib/ai/strict';

// optional: direct partner queue
async function enqueueQueue(mode: string, symbol: string, why: string, context: any){
  try{
    await fetch(process.env.NEXT_PUBLIC_PARTNER_API_URL?.replace('http','http') + '/api/queue', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ mode, symbol, why, context })
    });
  }catch{}
}

export async function POST(req: NextRequest){
  const body = await req.json();
  const {
    symbol='BTCUSD',
    scope={},
    risk=[],
    mode='prioritize',
    frameIndex=0
  } = body || {};

  const gem = getGemini();

  // 1) Plan
  const planText = await gem.generate(planPrompt(symbol, scope));
  let planJson = tryParseJSON(extractJson(planText) ?? planText) ?? {};
  planJson = coerceNumberFields(planJson);
  let plan = validateOrThrow(SeePlanZ, planJson, 'SEE plan');

  // 2) Reason
  const reasonText = await gem.generate(reasonPrompt(symbol, mode, plan, risk, scope, frameIndex));
  const reason = String(reasonText).trim().replace(/^"|"$/g, '');

  // 3) Risk critique
  const riskText = await gem.generate(riskPrompt(risk, scope));
  let riskJson = tryParseJSON(extractJson(riskText) ?? riskText) ?? {};
  const critique = validateOrThrow(RiskCritiqueZ, riskJson, 'risk critique');

  // 4) Queue (optional): attach full context
  const context = { scope, risk, plan, frameIndex };
  await enqueueQueue(mode, symbol, `AI Orchestrate → ${mode}`, context);

  return new Response(JSON.stringify({ ok:true, model: gem.model, enabled: gem.enabled, plan, reason, critique }), { headers: { 'Content-Type':'application/json' } });
}
