
export function buildReason(params: {
  mode: 'test'|'prioritize'|'force'|'review',
  symbol: string,
  plan?: any,
  riskKnobs?: any[],
  scope?: any,
  frameIndex?: number,
  manual?: string
}){
  const slip = Number(params.riskKnobs?.find?.((k:any)=>k.id==='slipCap')?.value ?? 0);
  const kill = Number(params.riskKnobs?.find?.((k:any)=>k.id==='killGap')?.value ?? 0);
  const conf = params.scope?.confidence != null ? Math.round(params.scope.confidence*100) : null;
  const r = params.scope?.r != null ? Math.round(params.scope.r*100) : null;
  const task = params.plan?.tasks?.find?.((t:any)=>t.id?.startsWith('OP-')) || params.plan?.tasks?.[1];
  const desc = task?.desc || 'opportunity';
  const parts = [
    `${params.symbol} ${params.mode.toUpperCase()}`,
    desc,
    `slip=${slip}bps`,
    `kill=${kill}bps`,
    (params.frameIndex!=null?`frame=${params.frameIndex}`:null),
    (conf!=null?`conf=${conf}%`:null),
    (r!=null?`R=${r}%`:null)
  ].filter(Boolean);
  const auto = parts.join(' | ');
  if(params.manual && params.manual.trim().length) return auto + ' — ' + params.manual.trim();
  return auto;
}
