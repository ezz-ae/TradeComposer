
import type { SessionSettings } from "@packages/types/src/session";
export interface SessionPreset { id: string; name: string; description: string; overrides: Partial<SessionSettings>; }
export const PRESETS: SessionPreset[] = [
  { id:"conservative", name:"Conservative", description:"Small risk, heavy guards",
    overrides:{ slippage_bps_max:5, kill_gap_bps:15, news_guard_minutes:60, max_concurrent_positions:1 } },
  { id:"balanced", name:"Balanced", description:"Default balanced profile",
    overrides:{ slippage_bps_max:8, kill_gap_bps:25, news_guard_minutes:30 } },
  { id:"aggressive", name:"Aggressive", description:"Faster entries, wider rails",
    overrides:{ slippage_bps_max:12, kill_gap_bps:35, news_guard_minutes:10, max_concurrent_positions:2 } }
];
