
export type SeeTask = {
  id: string;
  type: 'alert'|'order'|'note';
  desc: string;
  priority: 'low'|'medium'|'high';
  trigger?: any;
  order?: any;
};

export type SeePlan = {
  symbol: string;
  regime: { trend: 'up'|'down'|'range', vol: 'low'|'normal'|'high', bias: string };
  levels: Array<{ type: string; price: number }>;
  tasks: SeeTask[];
  reason?: string;
};

export type ReasonPacket = {
  symbol: string;
  mode: 'test'|'prioritize'|'force'|'review';
  reason: string;
};

export type RiskCritique = {
  summary: string;
  flags: Array<{ id: string; severity: 'info'|'warn'|'block'; message: string }>;
  adjust: Array<{ id: string; to: number; why: string }>;
};

export const SYSTEM_PROMPT = `You are TradeComposer Partner.
- You do not execute for the user; you propose clear, auditable actions.
- Minimize losses first, teach via actions second, tunable experience third.
- Respect guardrails: slipCap ≤ 12 bps, killGap ≤ 30 bps disables FORCE.
- Always produce: SEE plan (3 tasks, pick OP-1), reason string, risk critique.
- Be concise and concrete. Output JSON only when asked for JSON.`;

export function planPrompt(symbol: string, scope: any){
  return `${SYSTEM_PROMPT}

Task: Build a SEE plan for ${symbol}.
Context:
- scope.r: ${scope?.r}
- scope.confidence: ${scope?.confidence}
- expected.last: ${scope?.expected?.slice?.(-1)?.[0]}
- real.last: ${scope?.real?.slice?.(-1)?.[0]}

Return JSON:
{
  "symbol": "${symbol}",
  "regime": {"trend": "up|down|range", "vol":"low|normal|high","bias": "text"},
  "levels": [{"type": "string", "price": number}, ...],
  "tasks": [ { "id":"OP-1", "type":"order", "desc":"...", "priority":"high", "order": {...} }, ...],
  "reason": "SYMBOL MODE | task | slip=xbps | kill=ybps | frame=n | conf=% | R=%"
}`;
}

export function reasonPrompt(symbol: string, mode: string, plan: any, risk: any, scope: any, frameIndex: number){
  const slip = Number(risk?.find?.((k:any)=>k.id==='slipCap')?.value ?? 0);
  const kill = Number(risk?.find?.((k:any)=>k.id==='killGap')?.value ?? 0);
  const conf = scope?.confidence != null ? Math.round(scope.confidence*100) : null;
  const r = scope?.r != null ? Math.round(scope.r*100) : null;
  const task = plan?.tasks?.find?.((t:any)=>t.id?.startsWith('OP-')) || plan?.tasks?.[0];
  const desc = task?.desc || 'opportunity';
  return `${SYSTEM_PROMPT}

Build a single-line reason:
"${symbol} ${mode.toUpperCase()} | ${desc} | slip=${slip}bps | kill=${kill}bps | frame=${frameIndex} | conf=${conf}% | R=${r}%"`;
}

export function riskPrompt(risk: any[], scope: any){
  const slip = Number(risk?.find?.((k:any)=>k.id==='slipCap')?.value ?? 0);
  const kill = Number(risk?.find?.((k:any)=>k.id==='killGap')?.value ?? 0);
  const r = scope?.r != null ? Math.round(scope.r*100) : null;
  return `${SYSTEM_PROMPT}

Critique the current risk knobs with 3 bullet flags and numeric suggestions.
Inputs: slipCap=${slip}bps, killGap=${kill}bps, R=${r}%

Return JSON:
{
  "summary": "one sentence",
  "flags": [
    { "id":"slip", "severity":"info|warn|block", "message":"text" },
    { "id":"kill", "severity":"info|warn|block", "message":"text" },
    { "id":"context", "severity":"info|warn|block", "message":"text" }
  ],
  "adjust": [
    { "id":"slipCap", "to": number, "why":"..." },
    { "id":"killGap", "to": number, "why":"..." }
  ]
}`;
}
