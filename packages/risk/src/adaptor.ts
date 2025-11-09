
export function clamp(v:number, lo:number, hi:number){ return Math.min(hi, Math.max(lo,v)); }
export function riskAdaptor(
  base: { risk_bps: number; daily_cap_bps: number; leverage_max: number },
  regime: { vol: "low"|"normal"|"high" },
  conf: number,
  feats: { wick_top_bps: number; liquidity_score: number; news_proximity_min: number }
){
  const trendBoost = clamp(0.5 + 1.2*conf, 0.5, 1.8);
  const volMap = { low: 1.1, normal: 1.0, high: 0.65 }[regime.vol];
  const wickPenalty = feats.wick_top_bps > 8 ? 0.7 : 1.0;
  const liqBoost = 0.9 + 0.2*clamp(feats.liquidity_score,0,1);
  const newsGuard = feats.news_proximity_min <= 30 ? 0.4 : 1.0;
  const risk_bps = clamp(base.risk_bps * trendBoost * volMap * wickPenalty * liqBoost * newsGuard, 10, 120);
  const daily_cap_bps = Math.min(base.daily_cap_bps, Math.max(60, risk_bps*3));
  const leverage_max = base.leverage_max * (regime.vol === "high" ? 0.7 : 1.0);
  return {
    target_risk_per_trade_bps: Math.round(risk_bps),
    daily_loss_cap_bps: Math.round(daily_cap_bps),
    leverage_max,
    size_policy: "atr_scaled" as const,
    compute_trace: { trendBoost, volMap, wickPenalty, liqBoost, newsGuard }
  };
}
