
export type Venue = "gmx" | "snx" | "vertex" | "bybit" | "binance" | "ibkr";
export type Mode = "force" | "prioritize" | "test" | "review";

export interface SessionSettings {
  tf_primary: "H4"|"H1"|"M15";
  tf_multi: ("H4"|"H1"|"M15")[];
  news_guard_minutes: number;
  slippage_bps_max: number;
  kill_gap_bps: number;
  max_concurrent_positions: number;
  auto_journal: boolean;
  preset_id?: string;
}

export interface RiskProfile {
  target_risk_per_trade_bps: number;
  daily_loss_cap_bps: number;
  leverage_max: number;
  size_policy: "risk_1R"|"fixed"|"atr_scaled";
  compute_trace: Record<string, number>;
}

export interface Opportunity {
  id: string;
  kind: "pullback" | "breakout" | "mean_revert" | "sar";
  desc: string;
  trigger: { op: ">="|"<="|"within_bps"; price?: number; bps?: number };
  priority: "high"|"med"|"low";
  expiry: "session_close"|string;
  intent?: unknown;
}

export interface BrainState {
  regime: { trend: "up"|"down"|"range"; vol: "low"|"normal"|"high"; bias: string };
  confidence: number;
  levels: Array<{type:string; price:number}>;
  opportunities: Opportunity[];
}
