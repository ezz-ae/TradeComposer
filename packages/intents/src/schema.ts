
import { z } from "zod";
export const StopAndReverse = z.object({
  intent: z.literal("stop_and_reverse"),
  venue: z.enum(["auto","gmx","snx","vertex","bybit","binance"]).default("auto"),
  symbol: z.string(),
  trigger: z.object({ op: z.enum([">=","<="]), price: z.number() }),
  close: z.object({ all: z.boolean(), reduce_only: z.boolean().default(true) }),
  open: z.object({ side: z.enum(["buy","sell"]), size: z.string(), type: z.literal("market") }),
  risk: z.object({ max_slippage_bps: z.number().default(8), kill_gap_bps: z.number().default(25) }).optional(),
  validity: z.enum(["GTC","GFD"]).default("GTC"),
  idempotency: z.string()
});
export type StopAndReverse = z.infer<typeof StopAndReverse>;
