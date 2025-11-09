
import { StopAndReverse } from "./schema";
export function parseCommand(input: string, ctx: { symbol?: string } = {}): any {
  const s = input.toLowerCase().trim();
  if (s.startsWith("sar")) {
    const m = s.match(/sar\s*(>=|<=)\s*([0-9.]+)\s*(buy|sell)/i);
    if (!m) throw new Error("Invalid SAR");
    return StopAndReverse.parse({
      intent: "stop_and_reverse",
      symbol: ctx.symbol ?? "BTCUSD",
      trigger: { op: m[1] as any, price: Number(m[2]) },
      close: { all: true, reduce_only: true },
      open: { side: m[3] as any, size: "same_as_closed", type: "market" },
      idempotency: `sar-${Date.now()}`
    });
  }
  if (s.startsWith("checkchart")) {
    return { intent: "checkchart", symbol: ctx.symbol ?? "BTCUSD", tfs: ["H4","H1","M15"] };
  }
  throw new Error("Unknown command");
}
